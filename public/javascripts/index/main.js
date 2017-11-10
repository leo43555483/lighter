 window.onload = function() {
     navScroll(); //导航栏滚动消失显示效果
     tagActive();//导航栏鼠标选中效果
     /*回到顶部组件*/
     $("#backtop").backtop({
                appearenTop:document.documentElement.clientHeight || document.body.clientHeight,
                fadeTime:200,
            });








     
     /*导航栏效果结束*/
     function tagActive() {
         const tagWrap = $("#g_navLeft");
         tagWrap.on("mouseenter", "a", function(e) {
             e = e || window.event;
             let target = e.target,
                 parentNode = $(target).parent();
             parentNode.addClass("g_active")
             parentNode.siblings("li").removeClass("g_active");
         })

     }
     /*导航栏效果*/
     function navScroll() {
         const nav = $(".g_navbar_theme"),
             navBgp = $(".g_head_pic");

         window.onscroll = function() {
             let currentTop = document.documentElement.scrollTop || document.body.scrollTop,
                 bgpHeight = navBgp.height(),
                 navHeight = nav.height();
             if (currentTop > bgpHeight - navHeight) {
                 nav.removeClass("g_navbar_theme").addClass("g_navbar_active");
             } else {
                 nav.removeClass("g_navbar_active").addClass("g_navbar_theme");
             }
         }

     }
 }