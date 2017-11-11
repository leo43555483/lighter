var mongoose = require('mongoose'),
    schema = mongoose.Schema,
    ObjectId = schema.ObjectId;

var thumbSchema = new schema({
    url : String,//此图缩略图地址
    author : String,
    avatarPath : String ,
    gellery:String,//此画廊图地址
    person:String,

})


module.exports =  thumbSchema;