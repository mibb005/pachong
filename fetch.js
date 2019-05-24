const fetch = require("node-fetch");
const HttpsProxyAgent = require('https-proxy-agent');
var cheerio = require('cheerio');
var async = require('async'); //异步抓取
var fs = require('fs');

let url = "https://www.xvideos.com/";
let ip = '127.0.0.1';
let port = '1080';
fetch(url, {
    method: 'GET',
    // body: null,    
    redirect: 'follow',  // set to `manual` to extract redirect headers, `error` to reject redirect 
    timeout: 10000,      //ms 
    agent: new HttpsProxyAgent("http://" + ip + ":" + port)
}).then(function (res) {
    console.log("Response Headers ============ ");
    res.headers.forEach(function (v, i, a) {
        // console.log(i + " : " + v);
    });
    return res.text();
}).then(function (res) {
    console.log("Response Body ============ ");
    // console.log(res);
    var $ = cheerio.load(res);

    var hreflink = [];

    $('.thumb').each((i, item) => {
        let a = $(item).find('a')[0];
        let img = $(a).find('img')[0];
        // var href = 'https://www.xvideos.com/' + a['attribs']['href'];
        var href = a['attribs']['href'];
        let src = img['attribs']['data-src']
        var srcs = href.split('/');
        var relhref = 'https://www.xvideos.com/' + srcs[1] + '/' + srcs[4];
        // console.log(relhref + ' ' + src);
        hreflink.push(relhref);
    })
    return hreflink;
}).then(function (res) {
    console.log('本次共抓到' + res.length + '个链接');

    var fetchUrl = (myurl, callback) => {
        fetch(myurl, {
            method: 'GET',
            // body: null,    
            redirect: 'follow',  // set to `manual` to extract redirect headers, `error` to reject redirect 
            timeout: 10000,      //ms 
            agent: new HttpsProxyAgent("http://" + ip + ":" + port) //<==注意是 `http://`
        }).then(function (res) {
            // console.log("Response Headers ============ ");
            res.headers.forEach(function (v, i, a) {
                // console.log(i + " : " + v);
            });
            return res.text();
        }).then(function (res) {
            // console.log("Response Body ============ ");
            // console.log(res);
            var $ = cheerio.load(res);
            var script = $('#video-player-bg script')[4];
            var json = $(script).html()

            // var obj=JSON.parse(json)
            var setVideoHLS = json.match(/html5player.setVideoHLS\(.*\)/g)
            var setVideoUrlLow = json.match(/html5player.setVideoUrlLow\(.*\)/g)
            var setVideoUrlHigh = json.match(/html5player.setVideoUrlHigh\(.*\)/g)

            var hls = setVideoHLS[0].replace('html5player.setVideoHLS(\'', '').replace('\')', "")
            var low = setVideoUrlLow[0].replace('html5player.setVideoUrlLow(\'', '').replace('\')', "")
            var high = setVideoUrlHigh[0].replace('html5player.setVideoUrlHigh(\'', '').replace('\')', "")

            // console.log('hls:' + hls);
            // console.log('low:' + low);
            // console.log('high:' + high);
            var result = {
                hls: hls,
                low: low,
                high: high,
            }
            callback(null, result)
        }).catch(function (error) {
            console.log(error)
            // callback(error, null)
        });
    }

    async.mapLimit(res, 5, function (myurl, callback) {
        fetchUrl(myurl, callback);
    }, function (err, result) {
        // 爬虫结束后的回调，可以做一些统计结果
        console.log('##################' + result.length + '######################')
        for (let index = 0; index < result.length; index++) {
            const element = result[index];

            console.log('hls:' + element.hls);
            console.log('low:' + element.low);
            console.log('high:' + element.high);
        }
        fs.writeFile("url.json",JSON.stringify(result), errss => {
            if(!errss) console.log("success~");
        });
        return false;
    });

});

// let url = "https://www.xvideos.com/video38054065/safari_tiger_fucked_by_bbc_suga_slim_french_boy";
// let ip = '127.0.0.1';
// let port = '1080';
// fetch(url, {
//     method: 'GET',
//     // body: null,    
//     redirect: 'follow',  // set to `manual` to extract redirect headers, `error` to reject redirect 
//     timeout: 10000,      //ms 
//     agent: new HttpsProxyAgent("http://" + ip + ":" + port) //<==注意是 `http://`
// }).then(function (res) {
//     console.log("Response Headers ============ ");
//     res.headers.forEach(function (v, i, a) {
//         // console.log(i + " : " + v);
//     });
//     return res.text();
// }).then(function (res) {
//     console.log("Response Body ============ ");
//     // console.log(res);
//     var $ = cheerio.load(res);
//     var script=$('#video-player-bg script')[4];
//     var json=$(script).html()

//     // var obj=JSON.parse(json)
//     var setVideoHLS=json.match(/html5player.setVideoHLS\(.*\)/g)
//     var setVideoUrlLow=json.match(/html5player.setVideoUrlLow\(.*\)/g)
//     var setVideoUrlHigh=json.match(/html5player.setVideoUrlHigh\(.*\)/g)

//     var hls=setVideoHLS[0].replace('html5player.setVideoHLS(\'','').replace('\')',"")
//     var low=setVideoUrlLow[0].replace('html5player.setVideoUrlLow(\'','').replace('\')',"")
//     var high=setVideoUrlHigh[0].replace('html5player.setVideoUrlHigh(\'','').replace('\')',"")

//     console.log('hls:'+hls);
//     console.log('low:'+low);
//     console.log('high:'+high);

// });

