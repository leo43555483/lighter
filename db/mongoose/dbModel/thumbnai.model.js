var mongoose = require('mongoose'),
    schema = mongoose.Schema;

var thumbSchema = new schema({
    url : String,//缩略图地址
    userId: String,
    userName : String,
    gellery:String,//画廊图地址
    person:String,

})


module.exports =  thumbSchema;