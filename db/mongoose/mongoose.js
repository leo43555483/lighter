const mongoose = require('mongoose');
const dbUri = require('./db.config.js');
module.exports = exports = function() {
    mongoose.Promise = global.Promise;
    const server = mongoose.connect(dbUri.uri, {
        useMongoClient: true
    });

    server.on('error',function(error){
        console.log('mongoose连接错误');
        throw new Error(error)
    });

     server.on('open',function(error){
    });
    const thumbSchema = require('./dbModel/thumbnai.model.js');
    exports.thumbnail = server.model('thumbnails',thumbSchema);

    const authorInfo =  require('./dbModel/authorInfo.model.js');
    exports.authorInfo = server.model('authorInfo',authorInfo);

    var passSchema = require('./dbModel/pass.model.js');
    exports.passModel = server.model('passSchema',passSchema);

    return exports
}