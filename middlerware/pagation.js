
var pagenation = function(req,res) {
    let server = require('../db/mongoose/mongoose.js')();
    let thumbnail = server.thumbnail;

    let p = req.query.page;
    let pages = 0;
    let skip = 0;
    let oldLimit = null;
    let resData = {
        datas: null,
        totalPage: null,
        newPage: null,
        oldLimit:null
    }
    res.json(resData)
    let reqLimit = parseInt(req.query.limit);
    let limits = req.query.limited;
        thumbnail.count().then(function(count) {
            if (limits !== "" && parseInt(limits) !== reqLimit) { //请求限制不同，代表窗口尺寸改变
                oldLimit = limits;
                skip = oldLimit * p; //计算已经加载的图片数量
                p = Math.floor(skip / reqLimit); //将已加载的图片量转换成当前应该的页数
                limits = reqLimit - (skip % reqLimit); //减去调整后每页多加载出的照片数
                resData.oldLimit = reqLimit;  //将当前限制传到前台
                resData.newPage = p;          //尺寸改变后的页数
            } else {
                console.log("run")
                limits = reqLimit;
                skip = p * limits;
                resData.newPage = null;
                resData.oldLimit = limits;
            }
            pages = Math.ceil(count / limits); //总页数
            if (resData.totalPage === null) resData.totalPage = pages;
            p = Math.max(p, 0);
            p = Math.min(p, pages);
            thumbnail.find().limit(limits).skip(skip).then(function(data) {
                resData.datas = data;
                res.json(resData);
                res.end();
                console.log("发送成功")

            });

        });
    




}

module.exports = pagenation;