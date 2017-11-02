var fs = require('fs');
var path = require('path');

let getImg = function(req, res) {
  let url = req.query.a;
  let rootPath = path.join(__dirname, '../public/images/thumbs/');
  let imagPath = rootPath + url;

  fs.exists(imagPath, function(exists) {
    if (!exists) {
      res.writeHead(404);
      res.end();
    } else {
      fs.readFile(imagPath, function(erro, data) {
        if (erro) console.log(erro);
        res.writeHead(200, {
          'Conten-Type': 'image/jpg'
        });
        res.end(data, 'binary');
      })
    }
  })
  console.log(imagPath)
}

module.exports = getImg;