var express = require('express');
var middleware = require('../middleware');
var router = express.Router();

module.exports = function (redisClient) {
    router.get('/:uid', function (req, res) {
        res.render('profile', {
            title: 'Divider-User Profile',
            uid: req.params.uid
        });
    });

    return router;
}