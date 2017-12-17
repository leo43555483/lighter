(function($) {
    const SliderPlugin = function(plugin, config) {
        const me = this;
        me.default = {
            className: {
                next: ".g_right",
                pre: ".g_left",
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
        me.init();
    }

    SliderPlugin.prototype = {
        init: function() {
            const me = this;
            me.pending = false;
            me.eleName = me.config.className;
            me.index = me.config.index;
            me.nextArrow = me.myObject.find(this.eleName.next);
            me.preArrow = me.myObject.find(this.eleName.pre);
            me.wrap = me.myObject.find(this.eleName.wrap);
            me.item = me.myObject.find(this.eleName.item);
            me.indicators = me.myObject.find(this.eleName.focus);
            me.active = me.eleName.active;
            me.index = me.config.index ? me.config.index : 0;
            me.play();
            me.auto();
            me.initEvent();
        },
        //绑定事件
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
                        me.pre();
                    }

                    if ($(target).hasClass(me.eleName.next.substring(1))) {
                        me.next();
                    }
                }, 280)
            });
        },

        auto: function() {
            if(!this.config.autoLoop) return;
            const me = this;
            me.timer = setTimeout(function() {
                me.next()
                me.auto();
            }, me.config.transTime);
        },

        next: function() {
            const me = this;
            if (me.pending) {
                return
            }
            if (me.index >= me.indicators.length - 1) {
               return
            } else {
                ++me.index;
            }
            me.play();
            me.showIndicator();
        },

        pre: function() {
            const me = this;
            if (me.pending) {
                return
            }
            if (me.index <= 0) {
                return
            } else {
                me.index--;
            }
            me.play();
            me.showIndicator();
            me.pending = false;
        },

        play: function() {
            const me = this;
            me.pending = true;
            this.item.eq(me.index).css({
                "display":"block",
                "opacity": "1",
                "z-index": "1"
            }).siblings(me.eleName.item).css({
                "display":"none",
                "opacity": "0",
                "z-index": "0"
            });
            me.pending = false;
        },

        showIndicator: function() {
            this.indicators.eq(this.index).addClass(this.active).siblings(this.eleName.focus).removeClass(this.active);

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