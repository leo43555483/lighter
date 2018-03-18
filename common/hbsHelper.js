
module.exports = {
    showpage:{
        authortInfo:function(data){
            console.log('dat',data)
            let name = data[0].author;
            let url = data[0].person;
            let result = `<a href=${url}>${name}</a>`
            if(name) return result
        },
        getValue:function(data){
            let str = '';
            let arr = [];
            Array.prototype.forEach.call(data,function(item,i){
                let a = {
                    thumb:item.url,
                    gellery:item.gellery
                }
                arr.push(JSON.stringify(a));
            });
            return arr
        },
        renderThumb:function(data,fimg){
            let len = data.length;
            console.log(len)
            let imgIndex = data.findIndex(function(ele,i){
                let tem = ele['url'].split('/');
                return tem[tem.length-1] === fimg
            })
            let fpic = data.splice(imgIndex, 1);
            data.splice(0,0,fpic[0]);
            if(len > 10) return render(10);
            else return render(len)
            function render(n){
                let dom = '';
                for(let i = 0;i < n; i++){
                    let url = data[i].url;
                    dom += `<a class="g_thumb" style="background: url(${url}) center; background-size: cover "></a>`
                }
                return dom
            }
        }
    }
}