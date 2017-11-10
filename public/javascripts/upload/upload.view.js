let v = {
    inputFile: $("#g_photoUpload"), //上传文件区域
    submitBtn: $(".g_submitLoad"), //提交按钮

    selected: function(finalfile, currEle, photoupload) {
        let len = photoupload.fileArray.length;
        let frag = document.createDocumentFragment();
        let self = this;
        let ul = self.inputFile.get(0);
        let count = 0;
        let appendImg = function() {
            for (let i = 0; i < finalfile.length; ++i) {
                count = finalfile[i].index;
                if (i === 0) {
                    let parent = $(currEle).parent().parent().addClass('showphoto');
                    parent.html(`<img class="g_preView" src="" /><i class="iconfont g_photoDele" data-index=${count} >&#xe69a;</i>`); //第一条数据时
                } else {
                    let outer = self.outerTag1("showphoto");
                    let inner = self.innerTag1("", count);
                    self.render(outer, inner, frag);
                }

                if (finalfile[i]) {
                    let reader = new FileReader();
                    reader.onload = function(e) {
                        $('.g_preView').eq(photoupload.domCount).attr("src", `${e.target.result}`);
                        photoupload.domCount++;
                    }
                    reader.readAsDataURL(finalfile[i]);
                } else {
                    alert("文件不存在")
                }
            }

            self.render(self.outerTag1(""), self.innerTag2(), frag);
            ul.appendChild(frag);
        }
        let deletImg = function() {
            $(".g_photoDele").on("click", function(e) { //因为用虚拟DOM所以事件绑定应该在DOM渲染后 
                let target = $(e.target);
                target.parent().fadeOut();
                let j = parseInt(target.attr("data-index")); //转换数字
                photoupload.delete(j);
                let doms = $("[data-index]");
                target.removeAttr("data-index");
                for (let i = j + 1; i < doms.length; i++) {
                    console.log(j)
                    doms[i].dataset.index = j;
                    j++
                }
            });
        }
        appendImg();
        deletImg();


    },
    render: function(outerELe, innerEle, frag) {
        let eleLi = $(outerELe).get(0);
        eleLi.innerHTML = innerEle;
        frag.appendChild(eleLi);
    },
    inputAuthor: function() {
        alert("请输入作者名并且选择照片");
        $("[name='photo_author']").focus();
    },
    outerTag1: function(className) {
        return `<li class="g_photoItem ${className}"></li>`
    },
    innerTag1: function(data, index) {
        return `<img class="g_preView" src=${data} />
                    <i class="iconfont g_photoDele" data-index=${index} >&#xe69a;</i> `
    },
    innerTag2: function() {
        return `<label class="g_uploadBtn" for="g_uploadInput" >
                            <p class="g_Center">请在此处添加照片
                            </p>                       
                        <input id="g_uploadInput" class="g_block" type="file" name="photo" accept="image/jpg,image/jpeg" multiple>
                        </label>`
    },
    imgEorr: function(finalfile) {
        console.log(finalfile)
        return
    }
};
module.exports = v;