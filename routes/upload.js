var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var path = require('path');
var fs = require('fs');
var server = require('../db/mongoose/mongoose.js')();
var mongoose = server.passModel;
var Ouser = require('../db/mongoose/modelMethod.js')(mongoose);
var multer = require('../middlerware/Uploadmulter');

router.get('/', function(req, res, next) {
	console.log('session',req.session)
	let originUrl = req.originalUrl
	if(req.session.user && req.session.user.admin){
		res.redirect('/upload/loged');
		next()
	}else if(!req.session.user && (originUrl !== '/ipload/' || originUrl !== '/ipload/login/')){
		console.log('re')
     	res.redirect('/upload/login');
     	next();
	}
});
router.get('/login', function(req, res, next) {
	console.log('log')
	res.sendfile('./views/login.html');
});
router.get('/loged', function(req, res, next) {
	res.sendfile('./views/upload.html');
});

router.post('/login',multer.single('user'),function(req,res,next){
	let reqUser = {};
	reqUser.userName = req.body.userName;
	reqUser.pass = req.body.pass;
	console.log('body',req.body)
	Ouser.authorUser(reqUser.userName,reqUser.pass,function(err,user,status){
		let msg = {};
		console.log('status',status)
		if(err){
			return next(err)
		}

		if(!user && status === 1){
			msg = {
				err_code:1,
				info:'账号不存在'
			}
			
			res.status(404).json(JSON.stringify(msg));

		}
		if(!user && status === 2){
			console.log('mima')
			msg = {
				err_code:2,
				info:'密码错误'
			}
			res.status(404).json(JSON.stringify(msg));
			res.end();
		}
		
		if(user && !status){
			req.session.user = user;
			console.log('suser',req.session.user)
			res.redirect('/upload/loged');
			res.status(200)
			res.end();
		}
		
	})

})

router.get('/logout',function(req,res,next){
	req.session.destroy(function(err){
		if(err){
			console.log('logout',err)
			next(err)
		}
		res.redirect('/upload/login');
	})
})
module.exports = router;