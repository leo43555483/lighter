var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var pagation =  require('../middlerware/index/pagation');
var getThumbnail = require('../middlerware/index/thumbImg');
var multer = require('../middlerware/upload/Uploadmulter');
var uploadImg = require('../middlerware/upload/uploadImg');
var userImg = require('../middlerware/show/userImg');


/*图片分页*/
router.get('/waterfall',pagation);
/*个人图片页*/
router.get('/gellery/:id',userImg);

/*获取图片url*/
router.get('/photos/:author/:dir/:filename',getThumbnail);

router.post('/uploadPhoto',multer.fields([{name:"file",  maxCount:20},{name:"information",  maxCount:20}]),uploadImg('./public/images/'));

module.exports = router