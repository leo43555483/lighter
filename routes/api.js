var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var multer = require('../middlerware/Uploadmulter');
var pagation =  require('../middlerware/pagation');
var getThumbnail = require('../middlerware/thumbImg');
var uploadImg = require('../middlerware/uploadImg');


/*图片分页*/
router.get('/waterfall',pagation);

/*获取图片url*/
router.get('/indexThumbnails',getThumbnail);

router.post('/uoloadPhoto',multer.fields([{name:"file",  maxCount:20},{name:"information",  maxCount:20}]),uploadImg('../public/images/photo'));



module.exports = router