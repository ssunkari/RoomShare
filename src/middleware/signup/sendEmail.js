var shaGen = require('../shaGen.js');

function addEmailBody(req, userHash) {
    if (req.passwordRecovery) {
        return 'Welcome to Divider please click below link to reset your password <a href="https://divider.herokuapp.com/passwordReset/' + userHash + '"> ';
    }
    return 'Welcome to Divider please click below link to activate your account <a href="https://divider.herokuapp.com/activate/' + userHash + '"> ';
}
module.exports = function (emailClient) {
    return function (req, res, next) {
        if (req.userExist) {
            console.log('Email Client :: User Exist', req.userExist);
            next();
        } else {
            var username = req.body.username.trim();
            var userKey = shaGen(username).toLowerCase();

            emailClient(username, {
                    subject: 'New User Registration',
                    text: addEmailBody(req, userKey)
                })
                .then(function () {
                    console.log('Email Client :: Email Sent');
                    next();
                })
                .catch(function (err) {
                    next(err);
                });
        }
    };
}