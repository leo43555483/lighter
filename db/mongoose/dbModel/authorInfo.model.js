
var mongoose = require('mongoose'),
    schema = mongoose.Schema;

var authorInfo = new schema({
    userName:String,
    userId:String,
    person:String,
    gender:String,
    intro:String,
    email:String,
    avatarUrl:String

});
module.exports =  authorInfo;