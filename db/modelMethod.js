let server = require('../db/mongoose.js')();
let mongoose = server.thumbnail;


function Photogragher(info) {
    this.url = info.url;
    this.author = info.author;
    this.avatarPath = info.avatarPath;
    this.gellery = info.gellery;
    this.person = info.person;

    this.getAllByProperty = getAllByProperty;
}

Photogragher.prototype.save = function(callback){
    let self = this;
    let information = {
        url: self.url,
        author:self.author,
        avatarPath: self.avatarPath,
        gellery: self.gellery,
        person: self.person,
    }
    mongoose.create(information,function(err){
        if(err){
           return callback(err);
        }
        callback(null);

    });
}
function getAllByProperty (property,field,callback){
        mongoose.find(property,field,function(err,data){
            if(err) return callback(err);
            callback(null,data);
        })
    }

module.exports = Photogragher;