const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const pagation =  require('../middlerware/index/pagation');
const getThumbnail = require('../middlerware/index/thumbImg');
const multer = require('../middlerware/upload/Uploadmulter');
const uploadImg = require('../middlerware/upload/uploadImg');
const creatInfo = require('../middlerware/upload/creatInfo');
const userImg = require('../middlerware/show/userImg');
const valifiles = require('../middlerware/upload/valifiles');


/*图片分页*/
router.get('/waterfall',pagation);
/*个人图片页*/
router.get('/gellery/:id',userImg);

/*获取图片url*/
router.get('/photos/:author/:dir/:filename',getThumbnail);

router.post('/uploadPhoto',multer.fields([{name:"file",  maxCount:20},{name:"information",  maxCount:20}]),valifiles(),uploadImg('./public/images/'));
router.post('/authorInfor',multer.fields([{name:"file",  maxCount:20},{name:"information",  maxCount:20}]),valifiles(),creatInfo());

module.exports = router