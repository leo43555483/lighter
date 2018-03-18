const jwt = require('../../common/tokenHelper.js');

module.exports = function(req,res,next){
    const token = req.body.token || req.query.token || req.headers['x-access-token'];
    if(token){
        jwt.verify(token).then((decoded)=>{
            res.json(200,{
                success:true,
                userInfo:decoded.data,
                exp:decoded.exp,
                token:token
            });
            return
        }).catch((err)=>{
            console.error('token verify wrong',err)
            res.json({success:false,message:'token无效'});
        })
    }else{
       next();
    }
}