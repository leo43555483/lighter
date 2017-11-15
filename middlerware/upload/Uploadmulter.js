var uploadStorage = require('../../model/upload.multer.model.js');
var storage = require('../../model/multer.storage.js');

module.exports = storage(uploadStorage);