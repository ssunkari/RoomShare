var config = require('../../config');
var sendgrid = require('sendgrid')(config.get('sendGrid:apiKey'));

module.exports = function (user, details, callback) {
    sendgrid.send({
        to: user.emailAddress,
        from: 'divider@herokuapp.com',
        subject: details.subject,
        text: details.text
    }, function (err, json) {
        callback(err, json);
    });
};