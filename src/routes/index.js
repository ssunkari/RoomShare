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
                    title: 'Divider - Login Page',
                    errMsg: 'We are unable to log you in at this time. Please try again or email admin for assistance.'
                });
            }
            console.dir(user);
            if (!user.activated || user.activated == false) {
                return res.render('index', {
                    title: 'Divider - Login Page',
                    notActivated: true,
                    username: req.body.username,
                });
            }

            req.logIn(user, function (err) {
                if (err) {
                    return next(err);
                }
                if (!user.houseshareSetup) {
                    res.redirect('/houseshares/new?uid=' + req.user.id)
                } else {
                    return res.redirect('/profile/' + req.user.id);
                }
            });
        })(req, res, next);

});
module.exports = router;