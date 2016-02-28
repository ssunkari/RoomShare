var shaGen = require('../shaGen.js');
module.exports = function (redisClient) {
    return function (req, res, next) {
        if (req.body.username) {
            var userKey = shaGen(req.body.username.trim().toLowerCase());
            redisClient.hgetallAsync(userKey).then(function (userObj) {
                if (userObj) {
                    req.userExist = true;
                    req.activated = userObj.activated
                    console.log('validation:: User Exists');
                }
                next();
            });
        } else {
            next('Username not being set');
        }
    };
}