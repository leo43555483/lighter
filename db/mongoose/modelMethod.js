let bcrypt = require('bcryptjs');
module.exports = function(mongoose) {

    function Photogragher(info) {
        this.info = {};
        for (let keys in info) {
            this.info[keys] = info[keys];
        }

        this.getAllByProperty = getAllByProperty;
        this.findOneProperty = findOneProperty;
        this.authorUser = authorUser;
        this.getUserName = getUserName;
    }

    Photogragher.prototype.save = function(mid, callback) {
        let self = this;
        let information = {};
        if (mid && mid.toString() === 'pass') {
            this.handlePass(function(err) {
                if (err) return fn(err);
            });
        }
        for (let keys in this.info) {
            information[keys] = this.info[keys];
        }
        mongoose.create(information, function(err) {
            if (err) {
                return callback(err);
            }
            callback(null);

        });
    }

    Photogragher.prototype.handlePass = function(fn) {
        let self = this;
        bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash(user.pass, salt, function(err, hash) {
                if (err) return fn(err)
                user.pass = hash;
            })
        })
    }

    function authorUser(name,pass,fn){  
        let self = this;
        self.getUserName(name,function(err,user){
            if(err) return fn(err);
            if(!user.userName) return fn(null,null,1); //账户不存在
            bcrypt.compare(pass,user.passWord,function(err，isMatch){
                if(err) return fn(err);
                if(isMatch) return fn(null,user);
                return fn(null,null,2); //密码错误
            })
            
        })

     }
    function getUserName(name,fn){
        self.findOneProperty({userName:name},null,function(err,user){
            if(err){
                return fn(err)
            }
            fn(null,new Photogragher(user))
        })
    }
    function getAllByProperty(property, field, callback) {
        mongoose.find(property, field, function(err, data) {
            if (err) return callback(err);
            callback(null, data);
        })
    }

    function findOneProperty(property, field, callback) {
        mongoose.findOne(property, field, function(err, data) {
            if (err) return callback(err);
            callback(null, data);
        })
    }

    return Photogragher

}