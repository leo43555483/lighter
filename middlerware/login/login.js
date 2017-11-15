var server = require('../../db/mongoose/mongoose.js')();
var mongoose = server.passModel;
var Ouser = require('../../db/mongoose/modelMethod.js')(mongoose);
    /*登录拦截*/
    exports.intercept = function(req, res, next) {
        let originUrl = req.originalUrl
        if (req.session.user && req.session.user.admin) {
            res.redirect('/upload/loged');
            next()
        } else if (!req.session.user && (originUrl !== '/ipload/' || originUrl !== '/ipload/login/')) {
            res.redirect('/upload/login');
            next();
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
                    err_code: 1,
                    info: '账号不存在'
                }

                res.status(404).json(JSON.stringify(msg));

            }
            if (!user && status === 2) {
                console.log('mima')
                msg = {
                    err_code: 2,
                    info: '密码错误'
                }
                res.status(404).json(JSON.stringify(msg));
                res.end();
            }

            if (user && !status) {
                req.session.user = user;
                res.status(200)
                res.end();
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