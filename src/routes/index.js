var express = require('express');
var router = express.Router();
var passport = require('passport');

function normalizedCtx(ctx) {
    var month = ctx.month || '';
    var tenantName = ctx.tenant || '';
    return {
        year: ctx.year.replace(':', ''),
        month: month.replace(':', ''),
        tenantName: tenantName.replace(':', '')
    };
}
/* GET home page. */
router.get('/', function (req, res) {
    res.render('index', {
        title: 'Divider-Login Page',
        errors: []
    });
});

/* GET home page. */
router.get('/signup', function (req, res) {
    res.render('signup', {
        title: 'Divider-Signup Page',
        errors: []
    });
});

/* GET home page. */
router.get('/houseshares/new', function (req, res) {
    res.render('housesharesNew', {
        title: 'Divider-HouseShares',
        errors: []
    });
});

router.get('/logout',
    function (req, res) {
        req.logout();
        res.redirect('/');
    });

router.post('/', function (req, res, next) {
    passport.authenticate('local',
        function (err, user, info) {
            if (err) {
                return next(err, info);
            }
            if (!user) {
                return res.render('index', {
                    title: 'Rent Portal-Login Page',
                    errMsg: 'User is not authorized'
                });
            }
            req.logIn(user, function (err) {
                if (err) {
                    return next(err);
                }
                return res.redirect('profile/' + req.user.username);
            });
        })(req, res, next);

});
module.exports = router;