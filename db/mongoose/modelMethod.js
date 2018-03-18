let bcrypt = require('bcryptjs');
module.exports = function(mongoose) {

    function Photogragher(info) {
        const _this = this;
        _this.info = {};
        for (let keys in info) {
            _this.info[keys] = info[keys];
        }
    }

    Photogragher.prototype.save = function(mid, callback) {
        let _this = this;
        let information = {};
        if (mid && mid.toString() === 'pass') {
            _this.handlePass(function(err) {
                if (err) return callback(err);
                saveToDb();
                return
            });
        }else{
            saveToDb();
        }
        
        function saveToDb(){
            for (let keys in _this.info) {
                information[keys] = _this.info[keys];
            }
            mongoose.create(information, function(err) {
                if (err) {
                    return callback(err);
                }
                callback(null);
            });
        }
    }

    Photogragher.prototype.handlePass = function(fn) {
        let user = this;
        bcrypt.genSalt(10, function(err, salt) {
            if(err) {
                console.error(err)
                return
            }
            bcrypt.hash(user.info.passWord,salt, function(err, hash) {
                if (err) return fn(err)
                user.info.passWord = hash;
                fn()
            })
        })
    }

    Photogragher.authorUser=function(name,pass,fn){  
        let _this = this;
        Photogragher.getUserName(name,function(err,user){
            user = user.info;
            if(err) return fn(err);
            if(!user.userName) return fn(null,null,1); //账户不存在
            bcrypt.compare(pass,user.passWord,function(err,isMatch){
                if(err) return fn(err);
                if(isMatch){
                    let sessionUser = {};
                    sessionUser.userName = user.userName;
                    sessionUser.admin = user.admin;
                    sessionUser._id = user._id;
                    return fn(null,sessionUser);
                } 
                return fn(null,null,2); //密码错误
            })
            
        })

     }
    Photogragher.getUserName = function(name,fn){
       Photogragher.findOneProperty({userName:name},null,function(err,user){
            if(err){  
                return fn(err)
            }
            if(user) return fn(null,new Photogragher(user));
            if(!user) fn(err,user);
            
        })
    }
    Photogragher.getAllByProperty = function (property, field, callback) {
        mongoose.find(property, field, function(err, data) {
            if (err) return callback(err);
            if(data) callback(null, data);
        })
    }

    Photogragher.findOneProperty = function(property, field, callback) {
        mongoose.findOne(property, field, function(err, data) {
            if (err) {
                return callback(err);
            }
            if(data) callback(null, data);
            if(!data) callback(null, null);
        })
    }

    return Photogragher

}