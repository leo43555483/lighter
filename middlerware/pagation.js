
var pagenation = function(req,res) {
    let server = require('../db/mongoose.js')();
    let thumbnail = server.thumbnail;

    let p = req.query.page;
    let limits = parseInt(req.query.limit);
    let pages = 0;
    let skip = 0;
    let resData = {
        datas:null,
        totalPage:null,
    }
    console.log('页数', p);
    thumbnail.count().then(function(count) {
        pages = Math.ceil(count / limits); //总页数
        if(resData.totalPage === null) resData.totalPage = pages;
        p = Math.max(p, 0);
        p = Math.min(p, pages);
        skip = p * limits;
        thumbnail.find().limit(limits).skip(skip).then(function(data) {
          
            resData.datas = data;
            res.json(resData);
 
            console.log("发送成功")

        });

    });
}

module.exports = pagenation;