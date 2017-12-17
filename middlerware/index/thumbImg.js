var fs = require('fs');
var path = require('path');
var app = require('express');
let getImg = function(req, res) {
  let params = req.params;
  let uri = appendSting(params);
  let rootPath = path.join(process.cwd(), '/public/images/');
  let imagPath = rootPath + uri;

  fs.exists(imagPath, function(exists) {
    if (!exists) {
      res.writeHead(404);
      res.sendfile(rootPath+'/defaults/tDefualt.png');
    } else {
      fs.readFile(imagPath, function(erro, data) {
        if (erro) console.log(erro);
        res.sendfile(imagPath);
      })
    }
  })
  console.log(imagPath)
}

function appendSting(obj){
    let arr = [];
    for(let item in obj){
        arr.push(obj[item]);
    }
    let str = arr.join("/");
    return str
}
module.exports = getImg;