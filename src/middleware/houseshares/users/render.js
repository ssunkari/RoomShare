module.exports = function () {
    return function (req, res) {
        res.render('addHousemate', {
            title: 'Divider-Add Housemate',
            uid: req.uid,
            currentUsers: req.currentUsers
        });
    };
}