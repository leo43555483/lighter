var uploadStorage = require('../Schema/upload.multer.model.js');
var storage = require('../Schema/multer.storage.js');

module.exports = storage(uploadStorage);