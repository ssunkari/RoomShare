var fs = require('fs');
var path = require('path');

module.exports = function () {
    return function (req, res, next) {
        var fstream;
        req.pipe(req.busboy);
        req.busboy.on('file', function (fieldname, file, filename) {
            console.log("Uploading: " + filename);
            if (!filename) {
                console.log('File upload : Empty File Name')
                next();
            } else {
                req.imageFileName = req.uid + '_' + filename;
                fstream = fs.createWriteStream(path.resolve(__dirname, '../../../..', 'public/images/user',
                    req.imageFileName));
                file.pipe(fstream);
                fstream.on('close', function () {
                    req.fileUploadSuccess = true;
                    next();
                });
            }
        });

    };
}