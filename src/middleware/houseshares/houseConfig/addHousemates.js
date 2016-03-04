var moment = require('moment');

module.exports = function (redisClient) {
    return function (req, res, next) {
        var housematesHouseShareKey = 'HMS:' + req.houseShareKey;
        redisClient.saddAsync(housematesHouseShareKey, [
            req.params.uid
        ]).then(function (transactionStatus) {
            console.log('Added HouseMate::', req.params.uid);
            next();
        }).catch(function (err) {
            next(err);
        });
    };
}