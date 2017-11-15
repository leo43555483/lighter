var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var path = require('path');
var fs = require('fs');
var multer = require('../middlerware/upload/Uploadmulter');
var Login = require('../middlerware/login/login.js');

router.get('/', Login.intercept);
router.get('/login', Login.getLogin);
router.get('/loged', Login.getLoged);

router.post('/login', multer.single('user'), Login.postLogin);

router.get('/logout', Login.logOut)
module.exports = router;