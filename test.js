var cheerio = require('cheerio'); //可以像jquer一样操作界面
var charset = require('superagent-charset'); //解决乱码问题:
var superagent = require('superagent'); //发起请求 
// charset(superagent); 
var async = require('async'); //异步抓取
var eventproxy = require('eventproxy');  //流程控制
var ep = eventproxy();
var request = require('request')
var http = require('https');

var page = 'https://www.xvideos.com/'

var opt = {
    host: '127.0.0.1',
    port: 1080,
    method: 'GET',//这里是发送的方法
    path: 'https://www.cnblogs.com/',     //这里是访问的路径
    headers: {
        //这里放期望发送出去的请求头
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
        'Accept-Encoding': 'utf-8',  //这里设置返回的编码方式 设置其他的会是乱码
        'Accept-Language': 'zh-CN,zh;q=0.8',
        'Connection': 'keep-alive',
        'Host': 'www.cnblogs.com',
        // 'Referer': 'www.iqiyi.com',
        'User-Agent': 'Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2490.86 Safari/537.36'
    }
}

var req = http.request(opt,
    function (res) {
        res.on('data', function (data) {
            console.log(data.toString());
        });
    }
);

// req.end();

// http.get(option3, (res) => {

//     var chunks = [];
//     var size = 0;

//     res.on('data', (chunk) => {
//         chunks.push(chunk);
//         size += chunk.length;
//     })

//     res.on('end', () => {
//         var data = Buffer.concat(chunks, size);
//         var html = data.toString();
//         console.log(html);
//         var $ = cheerio.load(html); //cheerio模块开始处理 DOM处理

//         $('.thumb').each((i, item) => {
//             let a = $(item).find('a')[0];
//         })
//     })

//     res.on('error', (err) => {
//         console.log(err);
//     })

// })

