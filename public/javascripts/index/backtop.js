(function($){
    function BackTop(obj,opt){
        this._self = obj;
        this.setting = {
            finalTop : 0,//返回到最终的高度
            appearenTop:0,//消失和隐藏的高度
            btnfade:true,//点击按钮出现时的过渡,fadeIn fadeOut效果
            speedDen:6,//加速处理器中的分母
            interval:500,//动画调用间隔
            fadeTime:400,
        }
        this.config = $.extend(true,this.setting,opt||{});
        this.init();
        

    }

    BackTop.prototype = {
        init:function(){     
            let that = this,
                isTop = false;
                this.timer = null;
            console.log()
            this._self.on("click",function(){
                $("html,body").animate({scrollTop:that.config.finalTop},that.config.interval);
                         if($("html,body") <= that.config.finalTop){
                            $("html,body").stop(true);
                         }      
            });
            window.addEventListener("scroll",function(){
                    let scrolltop = document.documentElement.scrollTop || document.body.scrollTop;        
                   if((scrolltop >= that.config.appearenTop) && that.config.btnfade){
                        that._self.fadeIn(that.config.fadeTime);
                    }else{
                        that._self.fadeOut(that.config.fadeTime);
                    }
                });
        },
    }

    window.backtop = BackTop;
    $.fn.extend({
        backtop:function(opt){
            this.each(function(){
                return new BackTop($(this),opt);
            });
            return this
        }
    })
}(jQuery))
