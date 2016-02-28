var express = require('express');
var middleware = require('../middleware');
var router = express.Router();

module.exports = function (redisClient, emailClient) {

    router.post('/', middleware.signup.userValidator(redisClient), middleware.signup.register(redisClient), middleware.signup.sendEmail(emailClient), middleware.signup.render());

    router.get('/', function (req, res) {
        res.render('signup', {
            title: 'Divider-Signup Page',
            errors: []
        });
    });
    router.get('/resend/email', function (req, res, next) {
            req.body.username = req.query.uid;
            next();
        }, middleware.signup.sendEmail(emailClient),
        function (req, res, next) {
            res.redirect('/');
        }
    );

    router.get('/activate/:uid', middleware.signup.userExists(redisClient), middleware.signup.activate(redisClient),
        function (req, res, next) {
            res.redirect('/houseshares/new');
        }
    );
    return router;
};