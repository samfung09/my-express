const url = require('url');
const path = require('path');
const fs = require('fs');

function static(basePath){
    return (req, res, next) => {
        let {pathname} = url.parse(req.url);
        let p = path.resolve(path.join(basePath, pathname));
        // console.log(p);
        fs.stat(p, (err, stats) => {
            if(err) return next();
            //如果当前目录存在且为文件，则读取文件响应给客户端
            if(stats.isFile()){
                let reader = fs.createReadStream(p);
                return reader.pipe(res);
            }else{      //否则匹配下一条路由
                next();
            }
        })
    }
}

module.exports = static;