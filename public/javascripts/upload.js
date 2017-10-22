function PhotoUpload(v,control){
               let viewParams = {
                    inputFile:null,
                    dragDrop:null,
                    submitBtn:null,
                }

                let controlParams = {
                    filter:function(file){
                        return file
                    },

                }
                this.domCount = 0; //缓存Dom数
                this.control = $.extend({},controlParams,control);//筛选照片等方法 
                this.views = $.extend({},viewParams,v); //关于DOM的相关残书
                this.fileArray = [];//存放待上传的照片
                this.dragDrop = this.views.dragDrop;
                this.init();
            }

            PhotoUpload.prototype = {
                init:function(){
                    let self = this;
                    if(this.views.inputFile){
                        this.views.inputFile.on("change",function(e){
                            self.getFiles(e);
                        });
                    }
                    if(this.views.submitBtn){
                        this.views.submitBtn.on("click",function(e){
                            self.submitData();
                        })
                    }
                },
                submitData:function(){
                    let self = this;
                    let file = this.fileArray;
                     
                    let condition = this.fileArray.length <= 0?true:false;
                    let checked = self.control.check(condition);
                    if(!checked){
                        this.views.inputAuthor();
                        return
                    }
                    let opt = {
                        url:'/api/uoloadPhoto',
                        type:'post',
                        async:true,
                        file:null,
                    }
                    
                    for(let i = 0; i < file.length; i++){
                        file[i].author = checked;
                        opt.file = file[i];
                        self.Ajax(opt,i);
                    }
                },

                Ajax:function(opt,index){
                    let xhr = new XMLHttpRequest();
                    let form  = new FormData();
                    form.append(`file`,opt.file)
                    let self = this;
                    if(xhr.upload){ 
                        xhr.upload.addEventListener("progress",function(e){ 
                            console.log(e.total)
                        },false);
                    }

                    xhr.onreadystatechange = function(e){
                        if(xhr.readyState === 4){ 
                        //与服务端链接状态 
                            if(xhr.status === 200){ 
                            //服务器返回状态
                                console.log(0)
                                self.upArray(opt.file);
                                console.log(self.fileArray)
                                /*self.views.success();*/
                            }else{
                                throw new Error();
                                console.log(opt.file)
                            }
                        }
                    }

                    xhr.open(opt.type,opt.url,opt.async);
/*                    xhr.setRequestHeader("content-type","multipart/form-data");*/
                    xhr.send(form||null);

                },

                dropEvent:function(e){

                    e = e || window.event;
                    e.stopPropagation();
                    e.preventDefault();
                    let type = e.type === "dragover"? "onDragOver": "onDragLeave";
                    e.target[type];
                    return this
                },
                delete:function(j){    
                    let targetFile = this.fileArray[j];
                    this.upArray(targetFile);
                        
                },

                /*把要删除的数据从数组清除*/
                upArray:function(targetFile){
                    let temArr = [];
                    let k = 0;
                    for(let i = 0; i < this.fileArray.length; i++){
                            if(this.fileArray[i] !== targetFile ){
                                this.fileArray[i].index = k;
                                temArr.push(this.fileArray[i]);
                                k++
                                console.log(this.fileArray[i])
                            }else{
                               this.fileArray[i].index = k;
                            }
                        }
                    
                    this.fileArray = temArr;
                },

                getFiles:function(e){
                    e = e || window.event;
                    if(e.type !== "change") {
                        this.dropEvent(e);
                    }
                    
                    let self = this;
                    let file = e.target.files || e.dataTransfer.files;
                    let len = this.fileArray.length;
                    let target = e.target;
                    let tempO = this.control.filter(file);
                    if(tempO.match) {
                        this.views.imgEorr(tempO); 
                        return
                    };
                    let finalfile = tempO.data;
                    this.opreatfile(finalfile,len);
                    this.views.selected(finalfile,target,this);                    
                },

                opreatfile:function(file,arrLen){
                   let len = arrLen;
                   for(let i = 0; i < file.length; i++){
                    if(!file[i].hasOwnProperty("index")){
                        file[i].index = len + i
                        this.fileArray.push(file[i]);
                    }
                   }
                },
            }
            window.photoUpload = PhotoUpload;