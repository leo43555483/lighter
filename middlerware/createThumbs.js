module.exports = function(imageMagick) {
    return function(param) {
        console.log("param",param)
            imageMagick(param.newPath)
            .resize(param.width, param.height, param.regular)
            .quality(param.quality)
            .autoOrient()
            .write(param.dest, function(err) {
                if (err) {
                    console.log("write", err)
                    return
                }
            });
    }
}