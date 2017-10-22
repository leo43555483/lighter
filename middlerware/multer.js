var multer = require('multer');
var storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,'./temp/uploadImg');
    },
    filename:function(req,file,cb){
        var origName = file.originalname;
        var fileForm = origName.split('.');
        console.log(fileForm);
        let newName = fileForm.splice(0,(fileForm.length-1));
        cb(null,newName+'-'+Date.now()+'.'+fileForm[fileForm.length-1]);
    }

});

var upload = multer({
    storage:storage,
});

module.exports = upload;