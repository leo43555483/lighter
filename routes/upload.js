var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var path = require('path');
var fs = require('fs');
var server = require('../db/mongoose/mongoose.js')();
var mongoose = server.passModel;
var User = require('../db/mongoose/modelMethod.js')(mongoose);

router.get('/', function(req, res, next) {
	if(req.session.user && req.session.user.admin){
		res.sendfile('./views/upload.html');
		next()
	}else{
     	res.sendfile('./views/login.html');
     	next();
	}
});

router.post('/',function(req,res,next){
	let user = req.body.user;
	User.authorUser(user.userName,user.pass,function(err,user,status){
		if(err){
			console.log(err)
			return next(err)
		}

		
	})
})
module.exports = router;