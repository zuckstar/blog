# 其他安全漏洞

## 点击劫持

点击劫持是一种视觉欺骗的攻击手段。攻击者将需要攻击的网站通过 iframe 嵌套的方式嵌入自己的网页中，并将 iframe 设置为透明，在页面中透出一个按钮诱导用户点击。
### 1. 特点
- 隐蔽性较高，骗取用户操作
- "UI-覆盖攻击"
- 利用iframe或者其它标签的属性

### 2. 点击劫持的原理
用户在登陆 A 网站的系统后，被攻击者诱惑打开第三方网站，而第三方网站通过 iframe 引入了 A 网站的页面内容，用户在第三方网站中点击某个按钮（被装饰的按钮），实际上是点击了 A 网站的按钮。

### 3. 如何防御
1）X-FRAME-OPTIONS

X-FRAME-OPTIONS是一个 HTTP 响应头，在现代浏览器有一个很好的支持。这个 HTTP 响应头 就是为了防御用 iframe 嵌套的点击劫持攻击。

该响应头有三个值可选，分别是

- DENY，表示页面不允许通过 iframe 的方式展示
- SAMEORIGIN，表示页面可以在相同域名下通过 iframe 的方式展示
- ALLOW-FROM，表示页面可以在指定来源的 iframe 中展示

2）JavaScript 防御

对于某些远古浏览器来说，并不能支持上面的这种方式，那我们只有通过 JS 的方式来防御点击劫持了。

```html
<head>
  <style id="click-jack">
    html {
      display: none !important;
    }
  </style>
</head>
<body>
  <script>
    if (self == top) {
      var style = document.getElementById('click-jack')
      document.body.removeChild(style)
    } else {
      top.location = self.location
    }
  </script>
</body>
```
以上代码的作用就是当通过 iframe 的方式加载页面时，攻击者的网页直接不显示所有内容了。

## URL 跳转漏洞
定义：借助未验证的URL跳转，将应用程序引导到不安全的第三方区域，从而导致的安全问题。

### 1.URL跳转漏洞原理

黑客利用URL跳转漏洞来诱导安全意识低的用户点击，导致用户信息泄露或者资金的流失。其原理是黑客构建恶意链接(链接需要进行伪装,尽可能迷惑),发在QQ群或者是浏览量多的贴吧/论坛中。
安全意识低的用户点击后,经过服务器或者浏览器解析后，跳到恶意的网站中。

恶意链接需要进行伪装,经常的做法是熟悉的链接后面加上一个恶意的网址，这样才迷惑用户。

诸如伪装成像如下的网址，你是否能够识别出来是恶意网址呢？

```
http://gate.baidu.com/index?act=go&url=http://t.cn/RVTatrd
http://qt.qq.com/safecheck.html?flag=1&url=http://t.cn/RVTatrd
http://tieba.baidu.com/f/user/passport?jumpUrl=http://t.cn/RVTatrd
```

### 2.实现方式


- Header头跳转
- Javascript跳转
- META标签跳转

这里我们举个Header头跳转实现方式：

```
<?php
$url=$_GET['jumpto'];
header("Location: $url");
?>
```

```
http://www.wooyun.org/login.php?jumpto=http://www.evil.com
```

这里用户会认为www.wooyun.org都是可信的，但是点击上述链接将导致用户最终访问www.evil.com这个恶意网址。

### 3.如何防御

1)referer的限制

如果确定传递URL参数进入的来源，我们可以通过该方式实现安全限制，保证该URL的有效性，避免恶意用户自己生成跳转链接

2)加入有效性验证Token

我们保证所有生成的链接都是来自于我们可信域的，通过在生成的链接里加入用户不可控的Token对生成的链接进行校验，可以避免用户生成自己的恶意链接从而被利用，但是如果功能本身要求比较开放，可能导致有一定的限制。

## SQL 注入

### 1.SQL注入的原理

SQL注入是一种常见的Web安全漏洞，攻击者利用这个漏洞，可以访问或修改数据，或者利用潜在的数据库漏洞进行攻击。

一次SQL注入的过程包括以下几个过程：

- 获取用户请求参数
- 拼接到代码当中
- SQL语句按照我们构造参数的语义执行成功


SQL注入的必备条件：

- 1.可以控制输入的数据
- 2.服务器要执行的代码拼接了控制的数据。

我们会发现SQL注入流程中与正常请求服务器类似，只是黑客控制了数据，构造了SQL查询，而正常的请求不会SQL查询这一步，SQL注入的本质:数据和代码未分离，即数据当做了代码来执行。

### 2. 危害

- 获取数据库信息
- 管理员后台用户名和密码
- 获取其他数据库敏感信息：用户名、密码、手机号码、身份证、银行卡信息……
- 整个数据库：脱裤
- 获取服务器权限
- 植入Webshell，获取服务器后门
- 读取服务器敏感文件

### 3.如何防御

- 严格限制Web应用的数据库的操作权限，给此用户提供仅仅能够满足其工作的最低权限，从而最大限度的减少注入攻击对数据库的危害

- 后端代码检查输入的数据是否符合预期，严格限制变量的类型，例如使用正则表达式进行一些匹配处理。

- 对进入数据库的特殊字符（'，"，\，<，>，&，*，; 等）进行转义处理，或编码转换。基本上所有的后端语言都有对字符串进行转义处理的方法，比如 lodash 的 lodash._escapehtmlchar 库。

- 所有的查询语句建议使用数据库提供的参数化查询接口，参数化的语句使用参数而不是将用户输入变量嵌入到 SQL 语句中，即不要直接拼接 SQL 语句。例如 Node.js 中的 mysqljs 库的 query 方法中的 ? 占位参数。

## 参考

[常见六大Web安全攻防解析](https://github.com/ljianshu/Blog/issues/56#)