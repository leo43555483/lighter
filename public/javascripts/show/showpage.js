$(document).ready(function() {
    function getHeight() {
        let outerHeight = $("#g_showgellary").height(),
            nav = document.querySelector(".navbar"),
            navHeight = getcomputed(nav, 'marginBottom') + nav.offsetHeight,
            targetHeight = outerHeight - navHeight;
        console.log(outerHeight)
        $(".g_showitem").height(targetHeight);
    }


    /*全屏*/
    function fullScreen() {
        let btn = $('.g_fullScreen'),
            page = $('#g_showgellary'),
            showItem = $('.g_showpic'),
            indicator = $('.g_indwrap'),
            pending = false;
        btn.on('click', function() {
            if (!pending) {
                page.removeClass('col-md-9').addClass('col-md-12');
                showItem.height('100%');
                indicator.hide();
                pending = true;
            } else {
                page.removeClass('col-md-12').addClass('col-md-9');
                showItem.height('70%');
                indicator.show();
                pending = false;
            }
        });
    }

    fullScreen();

    function getcomputed(obj, attr) {
        if (obj.currentStyle) {
            return parseFloat(obj.currentStyle[attr]);
        } else {
            return parseFloat(window.getComputedStyle(obj, null)[attr]);
        }

    }
    getHeight();
    $(window).on("resize", getHeight);

    $("#g_showgellary").slider();
});