var server = require('./db/mongoose/mongoose.js')();
var mongoose = server.passModel;
var User = require('./db/mongoose/modelMethod.js')(mongoose);

let user = new User({
    userName:'zhl',
    passWord:'123456',
    admin:'true'
})

user.save('pass',function(err){
    if(err){
        console.log(err)
        return
    }
})