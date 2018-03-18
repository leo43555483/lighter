$(document).ready(function(){
    let box = $('.js-itemBox');
    let item = $('.js-thumbItem');
    let thumbWrap = $('.js-itemBox');
    let originButton = $('.js-opci');
    let timer = null;
    let timer2 = null;
    const _PreWidth = 400;
    box.on('mouseenter','.js-opic',handleIn);
    box.on('mouseleave','.js-thumbItem',boxMout);


    function boxMout(event){
        let mouseOutObj = mouseTarget(event);
        let _this = $(this);
        let thisPreV = _this.find('.js-preview');
        console.log('eq',$(mouseOutObj).is(thisPreV))
        if(!$(mouseOutObj).is(thisPreV)) {
            stopAction(timer);
            toggleClass(thisPreV,'g_Show','g_Hide','js-preview');
        }
    }
    function eTarget(e){
        e = e || window.e;
        return e.target||e.srcElem
    }
    function handleIn(e){
        stopAction(timer);
        timer = setTimeout(function(){
            console.log('moveIn')
            let target = $(eTarget(e)).parents('.g_titem');
/*            let wrap = target.parent().parent();*/
            setPos(target);
            let preV = toggleClass(target,'g_Hide','g_Show','js-preview').preV;
            let preL = (preV.find('.js-pl')).show();
            let imgEle = preV.find('.js-imgEle');
            let src = imgEle.data('src');
            let img = imgEle.get(0);
            preV.on('mouseenter',function(){
                console.log('in')
            })
            preV.on('mouseleave',handleOut);
            imgLazyLoad(src,imgCallBack)

            function imgCallBack(e){
                if(e.type === 'error'){
                     console.log('图片不存在')
                     return
                }
                preL.hide();
                img.src = src;
            }
        },300)
        
    }
    function imgLazyLoad(url,cb){
        let oImg = new Image();
        return (function(){
            if(typeof cb ==='function'){
                $(oImg).on("load error",function(e){
                    cb(e);
                    oImg = null;
                });
                oImg.src = url;
            }else{
                throw new Error('missing a callback in imgLazyLoad');
            }
        })();
    }
    function setPos(ele){
       let Prentele = ele.hasClass('g_titem')?ele:ele.parents('.g_titem');
       let wrapWidth = thumbWrap.outerWidth();
       let wrapHeight = thumbWrap.outerHeight();
       let pos = Prentele.position();
       pos.right = wrapWidth - (pos.left+ele.outerWidth());
       if(pos.right < _PreWidth){
         return toggleClass(Prentele,'g_preL','g_preR','js-preview');
       }else{
         return toggleClass(Prentele,'g_preR','g_preL','js-preview');
       }
    }
    function handleOut(event){
        let target = $(eTarget(event));
        let _this = $(this);
        let relaObj = mouseTarget(event);
        console.log('mouseout')
        if(relaObj !== _this){
            target = target.hasClass('js-imgEle')?_this:target;
            stopAction(timer);
            toggleClass(target,'g_Show','g_Hide','js-preview');
            $(this).unbind('mouseleave',handleOut); 
        }
    }
    function mouseTarget(e){
        return e.toElement || e.relatedTarget
    }
    function stopAction(t){
        clearTimeout(t);
    }

    function toggleClass(parent,remove,add,cln){
        if(!(parent instanceof jQuery)) throw new Error('element must instanceof jQuery ');
        let preV = parent.hasClass(cln)?parent:parent.siblings('.'+cln).get(0)?parent.siblings('.'+cln):parent.find('.'+cln);
        preV.hasClass(remove) && preV.removeClass(remove).addClass(add);
        return {
            wrap:wrap,
            preV:preV
        }
    }
})