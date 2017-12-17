
module.exports = {
    showpage:{
        authortInfo:function(data){
            let name = data[0].author;
            let url = data[0].person;
            let result = `<a href=${url}>${name}</a>`
            if(name) return result
        }
    }
}