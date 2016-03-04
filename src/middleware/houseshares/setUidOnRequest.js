module.exports = function () {
    return function (req, res, next) {
        req.uid = req.params.uid || req.body.uid || req.query.uid;
        next();
    };
}