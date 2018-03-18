let fs = require('fs');

module.exports = function(){
    return function(req,res,next){
        let files = req.files['file'];
        let b = /[image\/jpeg|image\/jpg|image\/png|image\/gif]/;
        let tempPath = './temp/uploadImg';
        if(files.every(isImg)){
            console.log('验证通过')
            return next();
        }else{
            files.forEach(dele)
            res.status(500).json({'status':'1','msg':'包含非法文件'});
            return 
        }

        function isImg(ele,i){
            let mime = ele.mimetype;
            return b.test(mime);
        }
        function dele(ele,i){
            let path = `${tempPath}/${ele['filename']}`;
            fs.unlink(path,function(err){
                if(err) console.err('非法文件删除失败');
                else console.err('非法文件删除成功');
            })
        }   
    }
}