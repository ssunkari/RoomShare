var moment = require('moment');

module.exports = function (redisClient) {
    return function (req, res, next) {
        var userHouseShareKey = 'UHS:' + req.params.uid + ':' + req.houseShareKey;
        redisClient.hmsetAsync(userHouseShareKey, ['lastmodified', moment().format('YYYY-MM-DD'),
            'startDate', moment().format('YYYY-MM-DD')
        ]).then(function (transactionStatus) {
            if (transactionStatus) {
                next();
            } else {
                next('Internal Server error');
            }
        }).catch(function (err) {
            next(err);
        });
    };
}