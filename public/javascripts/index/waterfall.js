
(function($) {

    function WaterFall(obj, opt) {
        let AjaxLock = false;
        let dataLimit = 0;
        this.pendgData = false;
        this._self = obj;
        this.pageCount = 0; //当前在第几页
        this.itemHeight  = null
        this.setting = {
            insertType: 1,
            fade: true,
            fadeSpeed: 400,
            autoImgHeight: false,
        }
        this.config = $.extend({}, this.setting, opt || {});
        this.caChe = {}; //缓存返回数据
        this.init();
    }

    WaterFall.prototype = {

        init: function() {
            this.event();
        },
        limit: function() {
            let clienW = $('#g_thumbnailWrap').outerWidth();
            let clienH =  $(document.documentElement)[0].clientHeight;
            let calc = this.getCount(clienW) * this.getCount(clienH);
            dataLimit = Math.max(this.getCount(clienW),calc);
            if(dataLimit > 0) $("#g_calcSize").hide(); //将用于计算加载数量的块隐藏
        },
        /*获取thumbsnail宽度*/
        thumbsHeight:function(){        
            let size = $(".thumBox").outerWidth() || $("#g_calcThumb").outerWidth();
            this.itemHeight = size;   //控制thumbnails 高度的值
            console.log("size",size)
            return size
        },

        getCount: function(wrapW) {
            let clienW = wrapW;
            let thumbW =  this.thumbsHeight();
            let count = Math.floor(clienW / thumbW);
            return count

        },

        getResource: function() {
            let that = this;
            let cache = null;

            $.ajax({
                url: `/api/waterfall?page=${that.pageCount}&limit=${dataLimit}&limited=${that.caChe.oldLimit || ""}`,
                type: 'get',
                dataType: 'json',
                async: false,
                success: function(data) {
                    cache = data;
                    that.pendgData = true;
                    that.pageCount = 1+(cache.newPage?cache.newPage:that.pageCount);
                }
            });
            return cache
        },

        render: function(ele,h) {
            let items = `<div class="col-md-3 col-sm-6" >
                        <div class="thumbnail thumBox" style="height: ${h}px;">
                            <a class="g_items" href="${ele.person}">
                                <img class="img-responsive" src=${ele.url} style="height: 100%;">
                            </a>
                        <div class="g_infor">
                        <div class="g_infor_head">
                            <a class="g_credit" href="${ele.person}"></a>
                                <div class="g_author">
                                    <a href="javascript:void(0)">${ele.author}</a>
                                </div>
                        </div>
                        <div class="g_infor_right"></div>
                        </div>
                    </div>
                </div>`;

            return items
        },

        event: function() {
            let _self = this;
            $(window).on("load",function(){
                this.limit();
                this.loadItems();
                console.log("reqL",dataLimit)
            }.bind(_self));
            $(window).on("scroll", function() {
                this.loadItems();
            }.bind(_self));

            $(window).on("resize", function() {
                this.updataH();
                this.limit();
                this.loadItems();
                console.log("reSizeL",dataLimit)
            }.bind(_self));

        },
        /*更新高度*/
        updataH:function(){
            /*this.itemHeight = this.thumbsHeight();*/
            $(".thumBox").height(this.itemHeight);
            console.log("new",$(".thumBox").height())
        },
        preload: function(c) {
            let img = new Image,
                count = 0,
                that = this;
            wrap = this._self;
            let items = ``;
            this.pendgData = true; //阻止请求时再次触发请求
            $(".g_preload").show();
            let resData = this.caChe = this.getResource(); //获取数据
            let len = resData.datas.length;

            let itemHeight = this.itemHeight; //将thumbs的宽高设为1:1
            console.log("item",itemHeight)
            $(resData.datas).each(function(i, ele) {
                items += that.render(ele,itemHeight);                //添加DOM
                $(img).on("load error", function() {
                    count++;
                    if (count > len - 1) {
                        $(".g_preload").hide();
                        wrap.append(items);
                    }
                    img = null;
                });
                img.onreadystatechange = function() {
                    img.onload = null;
                    if (img.readyState === "complete") {
                        count++;
                        if (count > len - 1) {
                            $(".g_preload").hide();
                            wrap.append(items);
                        }
                        img = null;
                    }
                }
                img.src = ele.url;
            });

        },


        loadItems: function() {
            if (scroLoad.call(this) || (this.pageCount === 0)  && !this.pendgData) {
                let tempCount = this.pageCount;
                if (this.caChe.totalPage && ++tempCount > this.caChe.totalPage) {
                    this.pendgData = true;
                    return
                } else {
                    this.preload();
                }


            }

            function scroLoad() {
                let clientH = this.getSize("clientHeight"),
                    scrollT = this.getSize("scrollTop"),
                    scrollH = this.getSize("scrollHeight");
                if (clientH + scrollT >= scrollH - 5) return true
            }
        },

        getSize: function() {
            if(arguments.length === 1){
                let type = arguments[0] ;
                if (type === "scrollHeight") {
                    return document.body.scrollHeight;
                } else {
                    return document.documentElement[type] || document.body[type];
                }
            }else{
                let obj = arguments[0];
                let type = arguments[1];
                return obj[type];
            }

        }

    }

    window.waterfall = WaterFall;
    $.fn.extend({
        waterfall: function(opt) {
            this.each(function() {
                return new WaterFall($(this), opt || {})
            });
            return this
        },
    });
    $("#g_waterfall").waterfall();

})(jQuery);