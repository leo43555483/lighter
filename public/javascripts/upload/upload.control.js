 let control = {
     _MAX_SIZE: 10240,
     check: function(upload) {
         let inputValue = $("[name='photo_author']").val();
         console.log(upload.fileArray.length)
         let condition = upload.fileArray.length <= 0 ? true : false;
         if (inputValue == "" || condition) {
             return false
         } else {
             return inputValue
         }

     },
     filter: function(file) {
         let unit = 1021;
         let maxsize = 10240 * unit;
         let state = {
             _MAX_SIZE: maxsize, //转换成字节
             match: Boolean(file[0].size > maxsize),
             data: file,
         };
         return state
     },
     progress: function(e) {
         console.log(e)
     },
     ajaxConfig: {
         url: '/api/uoloadPhoto',
         type: 'post',
         async: true,
         file: null,
     },
     inform: {
         author: String,
         intro:'爱咋咋滴，啥也不写'
     }
 }

 module.exports = control;