var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var redisClient = require('./redisClient');
var LocalStrategy = require('passport-local').Strategy;
var db = require('./middleware/auth')(redisClient);
var shaGen = require('./middleware/shaGen');

require('./extensions');
require('./cronJob');

var routes = require('./routes/index');
var app = express();

//passport setup

passport.use(new LocalStrategy(
    function (username, password, cb) {
        db.users.findByUsername(username, password).then(function (userObj) {
            if (!userObj) {
                return cb(null, false);
            }
            if (userObj.password === shaGen(password.trim())) {
                return cb(null, userObj);
            } else {
                return cb(null, false);
            }
        });
    }));

passport.serializeUser(function (user, cb) {
    cb(null, {
        username: user.username
    });
});

passport.deserializeUser(function (user, cb) {
    cb(null, user);

});
app.use(require('express-session')({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../', '/public')));

//routes
app.use('/', routes);

var sgEmailClient = require('./sendGridEmailApi');
app.use('/signup', require('./routes/signup.js')(redisClient, sgEmailClient));
app.use('/', require('./routes/passwordRecovery.js')(redisClient, sgEmailClient));
app.use('/houseshares', require('./routes/houseshares.js')(redisClient, sgEmailClient));
app.use('/profile', require('./routes/profile.js')(redisClient, sgEmailClient));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;