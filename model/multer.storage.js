var multer = require('multer');
var uploadStorage = require('../model/upload.multer.model.js');
module.exports = function(model){
    var storage = multer.diskStorage(model);

    var upload = multer({
        storage:storage,
    });
    return upload
}
