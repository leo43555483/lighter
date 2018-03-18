const fs = require('fs');
const mongoose = require('../../db/mongoose/mongoose.js')();
const qn = require('qn');
const qnConfig = require('../../common/qnConfig.js');
const sid = require('js-shortid');
const dbInfor = mongoose.authorInfo;
const InfoMethod = require('../../db/mongoose/modelMethod.js')(dbInfor);
module.exports = function() {
    const buckets = ['avatar'];
    return function(req, res) {
        let info = JSON.parse(req.body.information);
        const authorName = info.userName;
        const imgs = req.files['file'];
        const id = sid.gen();
        return (async function() {
            try {
                await findAuthor(authorName);
                const result = await saveInfo(id, info, imgs);
                res.json(200,result);
            } catch (e) {
                console.log('创建用户error',e)
                res.json(200, e)
                return
            }
        })();

    }
}
function saveInfo(id, info, file) {
    return new Promise(async (resolve, reject) => {
        try {
            const result = await creatQnUpload(id, file);
            const dbInfo = await saveToDb(info,id,result.key);
            resolve(dbInfo);
        } catch (e) {
            reject({
                success: false,
                message: e
            })
        }
    });
}
function saveToDb(info,id,uri) {
    console.log('info',info)
    console.log('id',id)
    console.log('uri',uri)
    console.log('dbinfor',dbInfor)

    let model = {};
    model.userId = id;
    model.person = `api/gellery/${id}`;
    model.avatarUrl = qnConfig.avatar.url + '/' + uri;
    mapInfo(model,info);
    console.log('model',model)
    let infoDb = new InfoMethod(model);
    return new Promise((resolve,reject)=>{
        infoDb.save(null,(err)=>{
            if(err){
                console.error('avatar save error',err);
                reject({
                    success:false,
                    message:'用户无法存入mongoose'
                });
                return
            }
            resolve({
                success:true,
                message:'用户创建成功',
                data:model
            });
        })    
    })
    
}
function mapInfo (mapTarget,orginal){
    for(let key in orginal){
        if(!mapTarget[key]) mapTarget[key] = orginal[key]; 
    }
}
function uploadQn(client, Path, Uri) {
    return new Promise((resolve, reject) => {
        console.log('client',client)
        client.uploadFile(Path, { key: Uri }, function(err, result) {
            console.log('err'.err)
            if (err) {
                console.error(err)
                reject({
                    success:false,
                    message:'头像上传qn错误'
                });
            }
            resolve(result)
        })
    })

}
function findAuthor(author) {
    return new Promise((resolve, reject) => {
        InfoMethod.getUserName(author, function(err, user) {
            if (err) {
                reject({
                    success:false, //数据库错误
                    message: '数据库错误'
                });
            } else if (user) {
                reject({
                    success:'false',
                    message: '用户名已存在'
                });
            } else if(!user){
                resolve();
            }
        })
    })
}

function creatQnUpload(id, ele) {
    let config = Object.create(qnConfig);
    let bucket = {
        accessKey: config.qn.accessKey,
        secretKey: config.qn.secretKey,
        bucket: config.avatar.name,
        uploadURL: config.qn.uploadURL
    }
    const client = qn.create(bucket);
    const file = ele[0];
    console.log('file',file)
    const Path = file.path;
    const imgName = file.filename.replace(/\s/g, "");
    const Uri = `lighter/img/${id}/avatar-${imgName}`;
    return new Promise(async(resolve,reject) => {
        try {
            let result = await uploadQn(client, Path, Uri);
            console.log('uploadResult',result)
            resolve(result);
        } catch (e) {
            console.error(e);
            reject(e);
        }
    });
}