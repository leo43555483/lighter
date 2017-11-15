var mongoose = require('mongoose'),
    schema = mongoose.Schema;

var passSchema = new schema({
    userName:String,
    passWord:String,
    admin:Boolean
})


module.exports =  passSchema;