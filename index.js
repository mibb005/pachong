var cheerio = require('cheerio'); //可以像jquer一样操作界面
var charset = require('superagent-charset'); //解决乱码问题:
var superagent = require('superagent'); //发起请求 
// charset(superagent); 
var async = require('async'); //异步抓取
var eventproxy = require('eventproxy');  //流程控制
var ep = eventproxy();

var page = 'http://vip.iqiyi.com/hot.html?cid=1'

superagent
    .get(page)
    // .set('Accept', 'text/html')
    // .set('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.131 Safari/537.36')
    // .charset('gb2312')
    .end(function (err, sres) {
        // 常规的错误处理
        if (err) {
            console.log('抓取' + page + '这条信息的时候出错了:err=' + err)
            return;
        }

        // console.log(sres.text)

        var $ = cheerio.load(sres.text);

        let newMovieLinkArr=[];

        $('.site-piclist_pic_link').each(function (i, item) {
            let href = $(item).attr('href');
            let title = $(item).attr('title');
            let rseat = $(item).attr('rseat');
            let img = $(item).find('img')[0];
            let src = 'http:' + img['attribs']['data-src'];
            newMovieLinkArr.push(href);
        });

        console.log(newMovieLinkArr);

        // let newMovieLinkArr = ['https://blog.csdn.net/zzwwjjdj1/article/details/51857959', 'https://blog.csdn.net/zzwwjjdj1/article/details/51857959']
        /*
        *流程控制语句
        *当首页左侧的链接爬取完毕之后，我们就开始爬取里面的详情页
        */
        // ep.emit('get_topic_html', newMovieLinkArr);
    });

ep.after('get_topic_html', 1, function (eps) {
    console.log(eps[0])

    /**
     * 详情页面处理
     * @param {*} myurl 
     * @param {*} callback 
     */
    var fetchUrl = (myurl, callback) => {
        superagent.get(myurl)
            .end(function (err, res) {
                if (err) {
                    return;
                }
                // console.log(res.text)

                var $ = cheerio.load(res.text);

                var result = {
                    movieLink: myurl
                };
                callback(null, result);
            })
    }

    /*
     * 同步处理多条请求
    */
    async.mapLimit(eps[0], 5, function (myurl, callback) {
        fetchUrl(myurl, callback);
    }, function (err, result) {
        // 爬虫结束后的回调，可以做一些统计结果
        console.log(result[1].movieLink)
        return false;
    });
})

