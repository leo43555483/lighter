var mongoose = require('mongoose'),
    schema = mongoose.Schema,
    ObjectId = schema.ObjectId;

var thumbSchema = new schema({
    url : String,
    author : String,
    avatarPath : String 
})


module.exports =  thumbSchema;