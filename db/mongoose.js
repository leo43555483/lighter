var mongoose = require('mongoose');
var dbUri = require('./db.config.js');
module.exports = exports = function() {
    mongoose.Promise = global.Promise;
    var server = mongoose.connect(dbUri.uri, {
        useMongoClient: true
    });

    server.on('error',function(error){
        console.log('连接错误');
    });

     server.on('open',function(error){
    });
    var thumbSchema = require('../Schema/thumbnai.model.js');
    exports.thumbnail = server.model('thumbnails',thumbSchema);

    return exports
}