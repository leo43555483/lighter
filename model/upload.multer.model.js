var uploadModel = {
    destination: function(req,file,cb){
        cb(null,'./temp/uploadImg');   
    },

    filename:function(req,file,cb){
        var origName = file.originalname.replace(/\s+/g,"");
        var fileForm = origName.split('.');
        var newName = fileForm.splice(0,(fileForm.length-1));
        var result = newName+'-'+Date.now()+'.'+fileForm[fileForm.length-1];
         cb(null,result);

    }
}

module.exports = uploadModel