# 依赖

```
npm install superagent cheerio superagent-charset async eventproxy -save
```

**说明**

## uperagent：

作用：跟request差不多，我们可以用它来获取get/post等请求，并且可以设置相关的请求头信息，相比较使用内置的模块，要简单很多。

用法：
```
var superagent = require('superagent');
superagent
.get('/some-url')
.end(function(err, res){
    // Do something 
});
```

## superagent-charset

作用：解决编码问题，因为电影天堂的编码是gb2312,爬取下来的中文会乱码掉。

用法：

```
var superagent = require('superagent');
var charset = require('superagent-charset');
charset(superagent);

superagent
.get('/some-url')
.charset('gb2312')  //这里设置编码
.end(function(err, res){
    // Do something 
});
```

## async

作用：Async是一个流程控制工具包，提供了直接而强大的异步功能，在这里作为处理并发来调用。

用法：这里需要用到的是：async.mapLimit(arr, limit, iterator, callback) 

mapLimit可以同时发起多个异步操作，然后一起等待callback的返回，返回一个就再发起下一个。 

arr是一个数组，limit并发数，将arr中的每一项依次拿给iterator去执行，执行结果传给最后的callback 

## eventproxy

作用：eventproxy 起到了计数器的作用，它来帮你管理到底异步操作是否完成，完成之后，它会自动调用你提供的处理函数，并将抓取到的数据当参数传过来。

例如我首先抓取到电影天堂首页侧栏的链接，才可以接着抓取链接里面的内容。具体作用可以点这里

用法：

```
var ep = new EventProxy();
ep.after('got_file', files.length, function (list) {
  // 在所有文件的异步执行结束后将被执行 
  // 所有文件的内容都存在list数组中 
});
for (var i = 0; i < files.length; i++) {
  fs.readFile(files[i], 'utf-8', function (err, content) {
    // 触发结果事件 
    ep.emit('got_file', content);
  });
}
```

