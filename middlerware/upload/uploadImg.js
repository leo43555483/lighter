let fs = require('fs');
let server = require('../../db/mongoose/mongoose.js')();
let mongoose = server.thumbnail;
let dbMethod = require('../../db/mongoose/modelMethod.js')(mongoose);
let gm = require('gm');
let imageMagick = gm.subClass({ imageMagick: true });
let createThumbs = require('../createThumbs.js');
let path = require('path');
let sid = require('js-shortid');

module.exports = function(dir) {
    return function(req, res) {
        var files = req.files['file'];
        var Oauthor = JSON.parse(req.body['information']).author;
        dbMethod.getUserName(Oauthor, function(user) {
                if (user) {
                    let gid = user.gid;
                    save(files, user);
                    res.status(200);
                    res.end();
                }
                if (!user) {
                    let id = sid.gen();
                    let gelleryDir = dir + id + '/gellery/';
                    let thmbsDir =  dir + id + '/thumbs/';
                    let photoOpt = {
                        gid: id,
                        author: Oauthor,
                        gelleryDir:gelleryDir,
                        thmbsDir: thmbsDir
                    }
                    Promise.all([mkdir(gelleryDir, 0777, handle), mkdir(thmbsDir, 0777, handle)])
                        .then(function() {
                            save(files, photoOpt);
                        }).then(function() {
                            res.writeHead(200, {
                                'Conten-Type': 'text/plain'
                            });
                            res.end();
                        })
                        .catch(function(err) {
                            console.log(err)
                            return
                        });
                }
            })
        }

    }

function handle(err) {
    if (err) {
        console.log(err)
        return
    }
}

function mkdir(dirname, mode, callback) {
    if (fs.existsSync(dirname)) {
        return true;
    } else {
        if (mkdir(path.dirname(dirname), mode)) {
            fs.mkdirSync(dirname, mode);
            return true;
        }
    }
}

function save(files, opt) {
    for (let i = 0; i < files.length; i++) {
        console.log("opt", opt)
        let oldPath = files[i].path;
        let gid = opt.gid;
        let imgName = gid + '-' + files[i].filename.replace(/\s/g, "");
        let gUri = opt.gelleryDir?opt.gelleryDir:dir + gid + '/gellery/';
        let tUri = opt.thmbsDir?opt.thmbsDir:dir + gid + '/thumbs/';
        let newPath = path.join(gUri, imgName);
        let thumUri = `t-${imgName}`;
        let destnation = path.join(process.cwd(), tUri + thumUri);
        let thumbOpt = {
            newPath: newPath,
            width: 600,
            height: 600,
            regular: "!",
            dest: destnation
        }


        fs.rename(oldPath, newPath, function(err) {
            if (err) {
                console.log("rename", err);
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
                url: `/api/photos/${gid}/thumbs/${thumUri}`,
                userId: gid,
                author: opt.author,
                avatarPath: `/api/${gid}/`,
                gellery: `/api/photos/${gid}/gellery/${imgName}`,
                person: `/api/gellery/${gid}`
            });

            photoMsg.save(null, function(err) {
                if (err) {
                    console.log(err);
                    res.status(500);
                }
                console.log("success")
            })

        })
    }
}