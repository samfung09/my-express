const express = require('./my-express');
const static = require('./my-static');
const fs = require('fs');

const app = express();
app.use(static('./public'));

// app.use((req, res, next) => {
//     console.log('恭喜你成功使用中间件');
//     next();
// })
app.get('/', (req, res) => {
    res.end('hello world');
})

app.get('/home/index', (req, res) => {
    let reader = fs.createReadStream('./public/index.html');
    return reader.pipe(res);
})

app.post('/post', (req, res) => {
    res.end('恭喜你post请求成功');
})

app.all('*', (req, res) => {
    res.end('404');
})

app.listen(8888, () => {
    console.log('server listening at port 8888');
})