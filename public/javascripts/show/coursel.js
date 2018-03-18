(function($) {
    const SliderPlugin = function(plugin, config) {
        const me = this;
        me.default = {
            className: {
                next: ".js-g_right",
                pre: ".js-g_left",
                focus: ".g_thumb",
                active: "g_currentThumb",
                item: ".g_photo",
                wrap: ".g_showitem",
            },
            autoLoop: false,
            ease: "linear",
            index: 0,
            transTime: 2000,
        };
        me.config = $.extend(true, me.default, config || {});
        me.myObject = plugin;
        me.timer = null;
        me.esMethod();
        me.init();
    }

    SliderPlugin.prototype = {
        init: function() {
            const me = this;
            me.pending = false;
            me.cache = {};
            me.eleName = me.config.className;
            me.index = me.config.index;
            me.nextArrow = me.myObject.find(this.eleName.next);
            me.preArrow = me.myObject.find(this.eleName.pre);
            me.wrap = me.myObject.find(this.eleName.wrap);
            me.item = me.myObject.find(this.eleName.item);
            me.indicators = me.myObject.find(this.eleName.focus);
            me.active = me.eleName.active;
            me.index = me.config.index ? me.config.index : 0;
            me.cacheData(window.resource);
            me.selectFirst();
            me.play();
            me.auto();
            me.initEvent();
        },
        esMethod: function() {
            if (!Array.prototype.findIndex) {
                Object.defineProperty(Array.prototype, 'findIndex', {
                    value: function(predicate) {
                        if (this == null) {
                            throw new TypeError('"this" is null or not defined');
                        }
                        var o = Object(this);
                        var len = o.length >>> 0;
                        if (typeof predicate !== 'function') {
                            throw new TypeError('predicate must be a function');
                        }
                        var thisArg = arguments[1];
                        var k = 0;
                        while (k < len) {
                            var kValue = o[k];
                            if (predicate.call(thisArg, kValue, k, o)) {
                                return k;
                            }
                            k++;
                        }
                        return -1;
                    }
                });
            }
        },
        //绑定事件
        selectFirst: function() {
            let tar = this.cache._FIMG;
            let arr = this.cache.gelUrl;
            let n = arr.findIndex(function(ele,i){
                let tem = ele['thumb'].split('/');
                return tem[tem.length-1] === tar
            })
            let fpic = this.cache.gelUrl.splice(n, 1);
            this.cache.gelUrl.splice(0,0,fpic[0]);
            console.log('tem',fpic)


        },
        cacheData: function(data) {
            for (key in data) {
                this.cache[key] = data[key];
            }
            console.log('ca',data)
        },
        initEvent: function() {
            const me = this;
            me.wrap.on("mouseleave", function() {
                me.auto();
            });

            me.wrap.on("mouseover", function(e) {
                clearTimeout(me.timer);
            });

            me.wrap.on("click", function(e) {
                if (me.timer) {
                    clearTimeout(me.timer)
                }
                me.timer = setTimeout(function() {
                    let target = e.target;
                    if ($(target).hasClass(me.eleName.focus.substring(1))) {
                        me.index = $(target).index();
                        me.play();
                        me.showIndicator();
                    }

                    if ($(target).hasClass(me.eleName.pre.substring(1))) {
                        

                        if(me.reduceIndex() || me.index === 0) me.pre();
                    }

                    if ($(target).hasClass(me.eleName.next.substring(1))) {
                        if(me.addIndex()) me.next(); 
                        
                    }
                }, 280)
            });
        },

        auto: function() {
            if (!this.config.autoLoop) return;
            const me = this;
            me.timer = setTimeout(function() {
                me.next()
                me.auto();
            }, me.config.transTime);
        },

        next: function() {
            const me = this;
            let nextB = $(me.eleName.next);
            let preB = $(me.eleName.pre);
            let index = me.index;
            let limit = me.indicators.length - 1;
            if (me.pending) return
            if (me.index >= limit) {
                me.addActive(nextB,'g_indexOver');
            }
            me.removeActive(preB,'g_indexOver');
            me.transAction();
        },
        pre: function() {
            const me = this;
            console.log('mii',me.index)
            let preB = $(me.eleName.pre);
            let nextB = $(me.eleName.next);
            if (me.pending) return
            
            if (me.index <= 0) {
                !preB.hasClass('g_indexOver') && preB.addClass('g_indexOver');
            } 
            me.removeActive(nextB,'g_indexOver'); 
            me.transAction();     
            
        },
        addActive:function(ele,cls){
            ele = this.getJquery(ele);
            !ele.hasClass(cls) && ele.addClass(cls);
        },
        removeActive:function(ele,cls){
            ele = this.getJquery(ele);
            ele.hasClass(cls) && ele.removeClass(cls);
        },

        play: function() {
            const me = this;
            console.log('t', this.cache)
            me.pending = true;
            this.item.css({
                display: 'block'
            })
            this.item.get(0).src = this.cache.gelUrl[me.index].gellery;
            me.pending = false;
        },

        showIndicator: function() {
            let i = this.index;
            let ele = this.indicators.eq(i);
            if (i > 10) {
                let url = this.cache.gelUrl[i].thumb;
                ele.css({
                    "background-img": "url(" + url + ")"
                });
            }
            ele.addClass(this.active).siblings(this.eleName.focus).removeClass(this.active);

        },
        addIndex:function(){
            const me = this;
            let limit = me.indicators.length - 1;
            if(me.index < limit) return ++me.index
            else return false
        },
        reduceIndex:function(){
            const me = this;
            if(me.index > 0) return --me.index;
            else return false
        },
        getJquery:function(ele){
            if(!ele instanceof jQuery) return $(ele);
            else return ele
        },
        transAction:function(){
            const me = this;
            me.play();
            me.showIndicator();
            me.pending = false;
        }
    };

    $.fn.extend({
        slider: function() {
            this.each(function() {
                new SliderPlugin($(this), {});
            });
            return this
        },
    });


})(jQuery)