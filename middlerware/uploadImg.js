let fs = require('fs');
let server = require('../db/mongoose/mongoose.js')();
let mongoose = server.thumbnail;
let dbMethod = require('../db/mongoose/modelMethod.js')(mongoose);
let gm = require('gm');
let imageMagick = gm.subClass({ imageMagick : true });
var createThumbs = require('./createThumbs.js');
let path = require('path');

module.exports = function(dir) {
    return function(req, res) {
        var files = req.files['file'];
        var Oauthor = JSON.parse(req.body['information']).author;
        let gelleryDir = dir+Oauthor+'/gellery/';
        let thmbsDir = dir+Oauthor+'/thumbs/';
        let photoOpt = {
            gellery:gelleryDir,
            thmbs:thmbsDir,
            author:Oauthor
        }
        Promise.all([mkdir(gelleryDir,0777,handle),mkdir(thmbsDir,0777,handle)])
        .then(function(){
            save(files,photoOpt);
        }).then(function(){
            res.writeHead(200, {
                'Conten-Type': 'text/plain'
            });
            res.end();
        })
        .catch(function(err){
            console.log(err)
            return
        })

    }

}
function handle(err){
    if(err){
        console.log(err)
        return
    }
}
function mkdir(dirname,mode,callback){
    if(fs.existsSync(dirname)){
        return true;
    }else{
        if(mkdir(path.dirname(dirname), mode)){
            fs.mkdirSync(dirname, mode);
            return true;
        }
    }
}

function save(files,opt){
            for (let i = 0; i < files.length; i++) {
                console.log("opt",opt)
            let oldPath = files[i].path;
            let imgName = opt.author+'-'+files[i].filename.replace(/\s/g,"");      
            let newPath = path.join(opt.gellery,imgName);
                    let thumUri = `t-${imgName}`;
                    let destnation = path.join(process.cwd(),opt.thmbs+thumUri);
                    let thumbOpt = {
                        newPath:newPath,
                        width:600,
                        height:600,
                        regular:"!",
                        dest:destnation
                    }


            fs.rename(oldPath,newPath,function(err){
                if(err) {
                    console.log("rename",err);
                    return
                }
                /*let size = imageMagick(newPath).size(function(err,size){
                    if(err) {
                        console.log("gmsizeErr",err)
                        return
                    }
                     console.log(size)
                });*/

                let creat = createThumbs(imageMagick);
                creat(thumbOpt);

                let photoMsg = new dbMethod({
                     url : `/api/Thumbs/${opt.author}/thumbs/${thumUri}`,
                     author : opt.author,
                     avatarPath : `/api/${opt.author}/` ,
                     gellery:`/api/photos/${opt.author}/gellery/${imgName}`,
                     person:`/api/gellery/${opt.author}`,
                });

                photoMsg.save(null,function(err){
                    if(err){
                        console.log(err);
                        next(err);
                    }
                    console.log("success")
                })

            })
        }
}