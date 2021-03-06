# HTTP 如何处理大文件的传输？

对于几百 M 甚至上 G 的大文件来说，如果要一口气全部传输过来显然是不现实的，会有大量的等待时间，严重影响用户体验。因此，HTTP 针对这一场景，采取了范围请求的解决方案，允许客户端仅仅请求一个资源的一部分。

## 如何支持

当然，前提是服务器要支持范围请求，要支持这个功能，就必须加上这样一个响应头:

```
Accept-Ranges: none
```

用来告知客户端这边是支持范围请求的。

## Range 字段拆解

而对于客户端而言，它需要指定请求哪一部分，通过Range这个请求头字段确定，格式为bytes=x-y。接下来就来讨论一下这个 Range 的书写格式:

- 0-499表示从开始到第 499 个字节。
- 500- 表示从第 500 字节到文件终点。
- -100表示文件的最后100个字节。
服务器收到请求之后，首先验证范围是否合法，如果越界了那么返回416错误码，否则读取相应片段，返回206状态码。

同时，服务器需要添加Content-Range字段，这个字段的格式根据请求头中Range字段的不同而有所差异。

具体来说，请求单段数据和请求多段数据，响应头是不一样的。


举个例子:

```
// 单段数据
Range: bytes=0-9
// 多段数据
Range: bytes=0-9, 30-39

```

接下来我们就分别来讨论着两种情况。

## 单段数据

对于单段数据的请求，返回的响应如下:

```
HTTP/1.1 206 Partial Content
Content-Length: 10
Accept-Ranges: bytes
Content-Range: bytes 0-9/100

i am xxxxx
```

值得注意的是Content-Range字段，0-9表示请求的返回，100表示资源的总大小，很好理解。

## 多段数据

接下来我们看看多段请求的情况。得到的响应会是下面这个形式:

```
HTTP/1.1 206 Partial Content
Content-Type: multipart/byteranges; boundary=00000010101
Content-Length: 189
Connection: keep-alive
Accept-Ranges: bytes


--00000010101
Content-Type: text/plain
Content-Range: bytes 0-9/96

i am xxxxx
--00000010101
Content-Type: text/plain
Content-Range: bytes 20-29/96

eex jspy e
--00000010101--
```

这个时候出现了一个非常关键的字段Content-Type: multipart/byteranges;boundary=00000010101，它代表了信息量是这样的:

- 请求一定是多段数据请求
- 响应体中的分隔符是 00000010101
因此，在响应体中各段数据之间会由这里指定的分隔符分开，而且在最后的分隔末尾添上--表示结束。

以上就是 http 针对大文件传输所采用的手段。


## 参考

[把大象装进冰箱：HTTP传输大文件的方法](https://www.cnblogs.com/sjks/p/11180193.html)
