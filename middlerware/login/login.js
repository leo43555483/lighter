var server = require('../../db/mongoose/mongoose.js')();
var mongoose = server.passModel;
var Ouser = require('../../db/mongoose/modelMethod.js')(mongoose);
var jwt = require('../../common/tokenHelper.js');

/*登录拦截*/
exports.intercept = function(req, res, next) {
    let originUrl = req.originalUrl;
    let ip = getIp();
    if (!authorAddress(ip)) {
        res.render('err');
        return    
    }
    if (req.session.user && req.session.user.admin) {
        res.redirect('/upload/loged');
        next()
    } else if (!req.session.user && (originUrl !== '/ipload/' || originUrl !== '/ipload/login/')) {
        res.redirect('/upload/login');
        next();
    }

    function getIp() {
        return req.header['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress ||
            ''
    }
    function authorAddress(ip) {
        let ipAuthor = require('../../common/ipAuthor.js')();
        console.log('ipa',ipAuthor)
        return ipAuthor.some(function(item) {
            return ip === item
        })

    }
}

exports.getLogin = function(req, res, next) {
    res.sendfile('./views/login.html');
}

exports.getLoged = function(req, res, next) {
    res.sendfile('./views/upload.html');
}
/*登录提交*/
exports.postLogin = function(req, res, next) {
    let reqUser = {};
    reqUser.userName = req.body.userName;
    reqUser.pass = req.body.pass;
    Ouser.authorUser(reqUser.userName, reqUser.pass, function(err, user, status) {
        let msg = {};
        if (err) {
            return next(err)
        }

        if (!user && status === 1) {
            msg = {
                success: false,
                message: '账号不存在'
            }

            res.json(200,msg);
            return
        }
        if (!user && status === 2) {
            msg = {
                success: false,
                message: '密码错误'
            }
            res.json(200,msg);
            return
        }

        if (user && !status) {
            const exp = 60*60*2;
            jwt.sign({data:user},{expiresIn:exp}).then((token)=>{
                res.json(200,{
                    success:true,
                    userInfo:user,
                    token:token,
                    exp:exp*1000 + Date.now()
                });
                return 
            }).catch((err)=>{
                console.error('tokenError',err)
                res.json(200,{
                    success:false,
                    message:'token生成失败'
                })
                return
            });
        }
    })
}
/*退出登录*/
exports.logOut = function(req, res, next) {
    req.session.destroy(function(err) {
        if (err) {
            console.log('logout', err)
            next(err)
        }
        res.redirect('/upload/login');
    })
}