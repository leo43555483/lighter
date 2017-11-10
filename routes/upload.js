var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var path = require('path');
var fs = require('fs');

router.get('/', function(req, res, next) {
  res.sendfile('./views/upload.html');
});
module.exports = router;