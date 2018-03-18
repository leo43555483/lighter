let server = require('../../db/mongoose/mongoose.js')();
let thumbnail = server.thumbnail;
let dbMethod = require('../../db/mongoose/modelMethod.js')(thumbnail);
let helpers = require('../../common/hbsHelper.js').showpage;

module.exports = function(req, res, next) {
    let id = req.params.id;
    let iImg = req.query.i;
    let temp = iImg.split('/');
    let fimg = temp[temp.length-1];//应该首先显示的照片
    if (!id) {
        console.log('用户不存在');
        res.status(404);
        res.end();
    }
    let resData = {
        layout: false,
        pages: null,
        datas: null,
        fimg:fimg,
        helpers: {
            authortInfo: helpers.authortInfo,
            getValue:helpers.getValue,
            renderThumb:helpers.renderThumb
        }
    };
    thumbnail.find({ userId: id }).then(function(data) {
        resData.datas = data;
        console.log('show', resData)
        res.render('showPage', resData);

    })

}