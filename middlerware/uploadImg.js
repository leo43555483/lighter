let fs = require('fs');
let dbMethod = require('../db/modelMethod.js');
let gm = require('gm');
let imageMagick = gm.subClass({ imageMagick : true });
let join = require('path');

module.exports = function(dir) {
    return function(req, res) {
        var files = req.files['file'];
        var inform = req.body['information'];
        console.log(files)
        for (let i = 0; i < files.length; i++) {
            let oldPath = files[i].path;
            let newPath = path.join(dir,inform.author+'-'+files[i].filename);
            console.log(oldPath);
            console.log(newPath)
            fs.rename(oldPath,newPath,function(err){
                if(err) {
                    console.log(err);
                    return
                }

                imageMagick(newPath)
                .resize(300,200,"!")
                .quality(80)
                .autoOrient()
                .write('../public/images/thumbs',function(err){
                    console.log(err)
                });

                let save = new dbMethod({
                     url : newPath,
                     author : inform.author,
                     avatarPath : null ,
                     gellery:newPath,
                     person:`127.0.0.0/gellery/:${inform.author}`,
                })
            })
        }



        res.writeHead(200, {
            'Conten-Type': 'text/plain'
        });
        res.end();
    }

}