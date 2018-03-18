const jwt = require('jsonwebtoken');
const config = require('./setting.js');
const secret = config.JWT_SECRET;
exports.verify = function(token) {
    return new Promise((resolve, reject) => {
        jwt.verify(token, secret, (err, decoded) => {
            if (err) reject(err)
            else resolve(decoded)
        })
    })

}
exports.sign = function(data, opt) {
    return new Promise((resolve, reject) => {
        jwt.sign(data, secret, opt, (err, token) => {
            if (err) reject(err);
            else resolve(token)
        })
    })
}