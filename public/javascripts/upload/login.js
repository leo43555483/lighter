!(function($){
    let opt = {
        url:'/upload/login',
        init:{
            method:'post',
            body:null,
            cache:'default',
            credentials:'include'
        }
    }
    let v = {
        msgName:$('#g_mgsName'),
        msgPass:$('#g_mgspass'),
        success:function(json){
            v.msgName.html("") && v.msgPass.html("");
            window.location.href = '/upload/loged';
            return 
        },
        failed:function(res){
             res.json().then(function(json){
                let msg = JSON.parse(json);
                if(msg.err_code === 1) {
                    v.msgPass.html("");
                    v.msgName.html(msg.info);

                }
                if(msg.err_code === 2) {
                    v.msgName.html("");
                    v.msgPass.html(msg.info);
                }
            })
        }
    }
    let submit = document.querySelector("#g_loginSubmit");

    $(submit).on('click',function(){
        
        if($('#inputPassword').val() === ""|| $('#inputName').val() === "")  return;
        let form = new FormData($('#user').get(0));
        opt.init.body = form;
        let fetch = new Fetch(opt,v);
        fetch.fetch();
    })
}(jQuery))
