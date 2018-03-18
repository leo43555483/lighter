let fs = require('fs');
let mongoose = require('../../db/mongoose/mongoose.js')();
let dbThumb = mongoose.thumbnail;
let ThumbMethod = require('../../db/mongoose/modelMethod.js')(dbThumb);
let createThumbs = require('../createThumbs.js');
let path = require('path');
let sid = require('js-shortid');
let qn = require('qn');
let config = require('../../common/setting.js');

const caChe = new caCheFile();
module.exports = function(dir) {
    return function(req, res) {
        let files = req.files['file'];
        let Oauthor = JSON.parse(req.body['information']).author;
        ThumbMethod.getUserName(Oauthor, function(err, user) {
            if (user) {
                let gid = user.gid;
                save(files, user).then((result) => {
                    if (!caChe.successFile || caChe.successFile.length === 0) {
                        res.json(200, {
                            success: false,
                            message: '上传失败',
                            failData: caChe.failedFile
                        });
                        caChe.rest();
                        return
                    } else {
                        const success = !(caChe.failedFile.length > 0)
                        res.status(200).json({
                            success: success,
                            message: success ? '全部上传成功' : '部分上传失败',
                            sucData: caChe.successFile || [],
                            failData: caChe.failedFile || []
                        });
                        caChe.rest();
                        return
                    }
                }).catch((err) => {
                    res.json(200, err);
                    return
                })
            }
            if (!user) {
                const failData = [].concat(files);
                res.json(200, {
                    success: false,
                    message: '用户不存在，请先创建用户',
                    failData: failData
                })
            }
        })
    }

}


function save(files, opt) {
    opt = opt['info'];
    const userScheme = mapOption(opt); //生成需要存入Mongoose需要的model
    console.log('scheme', userScheme);
    let gid = '';
    if (!(gid = userScheme.userId)) {
        Promise.reject({
            success: false,
            message: 'id不存在'
        });
        return
    };
    let tBucketOpts = {
        accessKey: config.qn.accessKey,
        secretKey: config.qn.secretKey,
        bucket: config.qn.tbucket,
        uploadURL: config.qn.uploadURL
    }
    let otBucketOpts = {
        accessKey: config.qn.accessKey,
        secretKey: config.qn.secretKey,
        bucket: config.qn.obucket,
        uploadURL: config.qn.uploadURL
    }
    let successFile = [];
    let failedFile = [];
    let tClient = qn.create(tBucketOpts);
    let oClient = qn.create(otBucketOpts);
    /*所有照片上传完后的回调*/
    let promiseFile = () => {
        return files.map((item, i) => {
            return (async(item, i) => {
                let oldPath = item.path;
                let imgName = gid + '-' + item.filename.replace(/\s/g, "");
                let thumUri = `lighter/img/${gid}/t-${imgName}`;
                let oUri = `lighter/img/${gid}/o-${imgName}`;
                const _qnConfig = config.qn;
                /*异步上传照片，每组照片分别上传到缩略图与原始图的bucket中*/
                try {
                    const qResult = await excutUpLoad(tClient, oldPath, thumUri, oClient, oUri); //上传至七牛
                    const res = await saveInfo(qResult, _qnConfig, userScheme); //数据上传数据库
                    caChe.successFile.push(item);
                    Promise.resolve();
                    return
                } catch (e) {
                    caChe.failedFile.push(item);
                    Promise.resolve();
                }
            })(item, i);
        })
    }
    return new Promise((resolve, reject) => {
        Promise.all(promiseFile()).then((result) => {
            resolve(result);
        });
    })

}
async function saveInfo(result, config, secheme) {
    return new Promise((resolve, reject) => {
        let model = Object.assign({}, secheme);
        /*console.log('upload-result------------>', result)*/
        model.url = config.visitTurl + '/' + result[0].key;
        model.gellery = config.visitOurl + '/' + result[1].key;
        let photoMsg = new ThumbMethod(model);

        photoMsg.save(null, function(err) {
            if (err) {
                console.error(err);
                reject({
                    success: false,
                    message: '数据库存入图片信息发生错误'
                })
            }
            resolve({
                success: true,
                message: '图片信息存入成功'
            });
            console.log("mongod save success of image")
        })
    })
}

function excutUpLoad(tClient, oldPath, thumUri, oClient, oUri) {
    return Promise.all([uploadToQn(tClient, oldPath, thumUri), uploadToQn(oClient, oldPath, oUri)]);
}

function mapOption(opt) {
    let result = {};
    console.log('opt', opt)
    for (let key in opt) {
        if (opt.hasOwnProperty(key)) {
            if (key === 'userId' || key === 'userName' || key === 'person') {
                result[key] = opt[key];
                console.log('resu', result[key])
            }
        }
    }
    return result
}

function uploadToQn(client, Path, Uri) {
    return (function(client, Path, Uri) {
        return new Promise((resolve, reject) => {
            client.uploadFile(Path, { key: Uri }, function(err, result) {
                if (err) {
                    reject({
                        success: false,
                        message: '图片上传失败',
                    })
                }
                console.log('qn', result)
                resolve(result);
            })
        })
    })(client, Path, Uri);
}

function caCheFile() {
    this.successFile = [];
    this.failedFile = [];
}
caCheFile.prototype.rest = function() {
    this.successFile.length = 0;
    this.failedFile.length = 0;
}

function handle(err) {
    if (err) {
        console.log(err)
        return
    }
}