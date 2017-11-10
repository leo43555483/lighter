var mongoose = require('mongoose'),
    schema = mongoose.Schema,
    ObjectId = schema.ObjectId;

var passSchema = new schema({
    userName:String,
    passWord:Mixed,
    admin:Boolean
})


module.exports =  thumbSchema;