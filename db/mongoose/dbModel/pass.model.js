var mongoose = require('mongoose'),
    schema = mongoose.Schema,
    ObjectId = schema.ObjectId;

var passSchema = new schema({
    userName:String,
    passWord:String,
    admin:Boolean
})


module.exports =  passSchema;