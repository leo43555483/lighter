var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');


var multer = require('../middlerware/multer');
var pagation = require('../middlerware/pagation');
var getThumbnail = require('../middlerware/thumbImg');

/*图片分页*/
router.get('/waterfall', pagation);

/*获取图片url*/
router.get('/images', getThumbnail);

router.post('/uoloadPhoto',multer.single("file"),function(req,res){
   var file = req.file;
   console.log(file) 
   /* res.writeHead(200,{
        'Conten-Type':'text/plain'
    });
    res.end();*/
})



module.exports = router