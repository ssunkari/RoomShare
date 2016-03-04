module.exports = function (redisClient) {
    return function (req, res, next) {
        console.log('Get House share users:: UID', req.uid);
        redisClient.hgetallAsync(req.uid).then(function (user) {
            return redisClient.smembersAsync('HMS:' + user.houseshareKey);
        }).map(function (userKey) {
            console.log('Get House share users:: UserKey', userKey);
            return redisClient.hgetallAsync(userKey)
        }).map(function (user) {
            return user.username;
        }).then(function (currentUsers) {
            console.log('Get House share users:: List of Users Fetched', currentUsers);
            req.currentUsers = currentUsers;
            next();
        }).catch(function (err) {
            next(err);
        });

    };
}