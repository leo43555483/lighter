(function($) {

    function WaterFall(obj, opt) {
        let AjaxLock = false;
        let dataLimit = 0;
        this.pendgData = false;
        this._self = obj;
        this.pageCount = 0; //当前在第几页
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
             //计算当前页面可以放几张图
            

        },
        limit: function() {
            dataLimit = this.getColum() * this.getRow();
            if(dataLimit > 0) $("#g_calcSize").hide(); //将用于计算加载数量的块隐藏
        },

        getColum: function(wrapW, boxW) {
            let clienW = wrapW || $('#g_thumbnailWrap').outerWidth();
            let thumbW = boxW || $('.thumbnail').parent().outerWidth();
            let colum = Math.floor(clienW / thumbW);
            return colum

        },

        getRow: function(wrapH, boxH) {
            let clienH = wrapH || $(document.documentElement)[0].clientHeight;
            let thumbH = boxH || $('.thumbnail').parent().outerHeight();
            let row = Math.ceil(clienH / thumbH);
            console.log(clienH)
            console.log(document.documentElement.clientHeight)
            return row
        },

        getResource: function() {
            let that = this;
            let cache = null;
            $.ajax({
                url: `/api/waterfall?page=${that.pageCount}&limit=${dataLimit}`,
                type: 'get',
                dataType: 'json',
                async: false,
                success: function(data) {
                    cache = data;
                    that.pendgData = true;
                    that.pageCount++;
                }
            });
            return cache
        },

        render: function(ele) {
            let items = `<div class="col-md-4 col-sm-6">
                        <div class="thumbnail" style="height:300px;">
                            <a class="g_items" href="javascript:void(0)">
                                <img class="img-responsive" src=${ele.url} style="height: 100%;">
                            </a>
                        <div class="g_infor">
                        <div class="g_infor_head">
                            <a class="g_credit" href="javascript:void(0)"></a>
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
                console.log(dataLimit)
            }.bind(_self));
            $(window).on("scroll", function() {
                this.loadItems();
            }.bind(_self));

            $(window).on("resize", function() {
                this.limit();
                this.loadItems();
                console.log(dataLimit)
            }.bind(_self));

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

            $(resData.datas).each(function(i, ele) {
                items += that.render(ele); //添加DOM
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
                let clientH = this.getHeight("clientHeight"),
                    scrollT = this.getHeight("scrollTop"),
                    scrollH = this.getHeight("scrollHeight");
                if (clientH + scrollT >= scrollH - 5) return true
            }
        },

        getHeight: function(type) {
            if (type === "scrollHeight") {
                return document.body.scrollHeight;
            } else {
                return document.documentElement[type] || document.body[type];
            }
        },

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