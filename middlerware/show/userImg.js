let server = require('../../db/mongoose/mongoose.js')();
let thumbnail = server.thumbnail;
let dbMethod = require('../../db/mongoose/modelMethod.js')(thumbnail);
let helpers = require('../../common/hbsHelper.js').showpage;

module.exports = function(req,res,next){
    let id = req.params.id;
    let p = req.query.p || 0;
    const _Limits_ = 10;
    if(!id) {
        console.log('用户不存在');
        res.status(404);
        res.end();
    }
    let resData = {
        layout:false,
        pages:null,
        datas:null,
        helpers:{
            authortInfo:helpers.authortInfo
        }
    };
    thumbnail.count({userId:id}).then(function(count){
        let pages = Math.ceil(count/_Limits_);
        p = Math.max(1,p);
        p = Math.min(p,pages);
        resData.pages = pages;
        let skip = (p-1)*_Limits_;
        thumbnail.find({userId:id}).limit(_Limits_).skip(skip).then(function(data){
            resData.datas = data;
            console.log('show',resData)
            res.render('showPage',resData);
        })
    })

}

