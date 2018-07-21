const http = require('http');
const url = require('url');

function createApp(){
    let app = {};
    //路由表，app.get(),app.post()等方法相当于往路由表中添加路由规则，然后等客户端来请求匹配
    let routes = [];
    
    //将所有http请求方式都添加到app对象中
    http.METHODS.forEach(method => {
        method = method.toLowerCase();
        app[method] = (path, handler) => {
            let router = {
                method,
                path,
                handler
            };
            //将当前写好的路由规则储存，等待客户端来请求匹配
            routes.push(router);
        }
    })

    //app.all全部匹配，一般用于404
    app.all = (path, handler) => {
        let router = {
            method: 'all',      //如果method为all，则全部匹配
            path,
            handler
        };
        //将当前写好的路由规则储存，等待客户端来请求匹配
        routes.push(router);
    }

    //app.use使用中间件
    app.use = (path, handler) => {
        if(handler === undefined){
            handler = path;
            path = '/';
        }
        let router = {
            method: 'middle',
            path,
            handler
        }
        routes.push(router);
    }

    //请求服务器
    let server = http.createServer((req, res) => {
        let method = req.method.toLowerCase();      //当前请求方式
        let {pathname} = url.parse(req.url);        //当前请求地址
        console.log(method, pathname, routes);
        let i = 0;
        //使用next()迭代遍历routes路由表
        function next(){
            if(i >= routes.length) return;      //迭代结束
            let m = routes[i].method;
            let p = routes[i].path;
            let handler = routes[i].handler;
            i++;
            //如果是中间件        
            if(m == 'middle'){
                if(p == '/' || p == pathname || pathname.startsWith(p+'/')){
                    handler(req, res, next);
                }else{
                    next();
                }
            }else{
                // console.log(method, m, pathname, p);
                //如果有匹配的路由就执行它的handler函数            
                //如果method为all，path为*，则所有地址都可匹配
                if((m == method || m == 'all') && (p == pathname || p == '*')){
                    console.log('路由匹配到了')
                    handler(req, res);
                }else{
                    next();
                }
            }
        }
        next();
    });
    //监听端口函数
    app.listen = function(){
        server.listen(...arguments);
    }
    return app;
}

module.exports = createApp;