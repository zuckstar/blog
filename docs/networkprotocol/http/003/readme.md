# 如何理解 URI？

URI, 全称为(Uniform Resource Identifier), 也就是统一资源标识符，它的作用很简单，就是区分互联网上不同的资源。

但是，它并不是我们常说的网址, 网址指的是 `URL` , 实际上URI包含了URN和URL两个部分，由于 URL 过于普及，就默认将 URI 视为 URL 了。

## URL 结构

URI 真正最完整的结构是这样的。

![1](./1.png)

可能你会有疑问，好像跟平时见到的不太一样啊！先别急，我们来一一拆解

scheme 表示协议名，比如http, https, file等等。后面必须和://连在一起。

user:passwd@ 表示登录主机时的用户信息，不过很不安全，不推荐使用，也不常用。

host:port表示主机名和端口。

path表示请求路径，标记资源所在位置。

query表示查询参数，为key=val这种形式，多个键值对之间用&隔开。

fragment表示 URI 所定位的资源内的一个锚点，浏览器可以根据这个锚点跳转到对应的位置。

举个例子:

```
https://www.baidu.com/s?wd=HTTP&rsv_spt=1
```

这个 URI 中，https即scheme部分，www.baidu.com为host:port部分（注意，http 和 https 的默认端口分别为80、443），/s为path部分，而wd=HTTP&rsv_spt=1就是query部分。

## URI 编码

URI 只能使用ASCII, ASCII 之外的字符是不支持显示的，而且还有一部分符号是界定符，如果不加以处理就会导致解析出错。

因此，URI 引入了编码机制，将所有非 ASCII 码字符和界定符转为十六进制字节值，然后在前面加个%。

如，空格被转义成了%20
