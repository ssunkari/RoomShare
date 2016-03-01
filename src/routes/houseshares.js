var express = require('express');
var middleware = require('../middleware');
var router = express.Router();

module.exports = function (redisClient) {
    router.get('/new/:uid', function (req, res) {
        res.render('housesharesNew', {
            title: 'Divider-HouseShares',
            uid: req.params.uid
        });
    });

    router.get('/addHousemate', function (req, res) {
        res.render('addHousemate', {
            title: 'Divider-Add Housemate',
            uid: req.params.uid
        });
    });
    router.post('/new', function (req, res, next) {
            req.params.uid = req.body.uid;
            next();
        }, middleware.signup.userExists(redisClient),
        middleware.houseshares.addNew(redisClient),
        middleware.houseshares.userSettings.setHouseSetupFlag(redisClient),
        middleware.houseshares.userSettings.setTenancyAgreement(redisClient),
        middleware.houseshares.houseConfig.addDefaultUtilCategories(redisClient),
        middleware.houseshares.houseConfig.addHousemates(redisClient),

        function (req, res) {
            res.redirect('/user/profile');
        });
    return router;
}