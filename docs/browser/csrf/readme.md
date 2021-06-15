# CSRF

## 什么是 CSRF 攻击

CSRF(Cross-site request forgery), 即跨站请求伪造，指的是黑客诱导用户点击链接，打开黑客的网站，然后黑客利用用户目前的登录状态发起跨站请求。

举个例子, 你在某个论坛点击了黑客精心挑选的小姐姐图片，你点击后，进入了一个新的页面。

那么恭喜你，被攻击了:）

你可能会比较好奇，怎么突然就被攻击了呢？接下来我们就来拆解一下当你点击了链接之后，黑客在背后做了哪些事情。

可能会做三样事情。列举如下：

### 1. 自动发 GET 请求

黑客网页里面可能有一段这样的代码:

```html
<img src="https://target.com/info?user=hhh&count=100" />
```

进入页面后自动发送 get 请求，值得注意的是，这个请求会自动带上关于 target.com 的 cookie 信息(这里是假定你已经在 target.com 中登录过)。

假如服务器端没有相应的验证机制，它可能认为发请求的是一个正常的用户，因为携带了相应的 cookie，然后进行相应的各种操作，可以是转账汇款以及其他的恶意操作。


### 2. 自动发 POST 请求

黑客可能自己填了一个表单，写了一段自动提交的脚本。

```html
<form id='hacker-form' action="https://target.com/info" method="POST">
  <input type="hidden" name="user" value="hhh" />
  <input type="hidden" name="count" value="100" />
</form>
<script>document.getElementById('hacker-form').submit();</script>
```

同样也会携带相应的用户 cookie 信息，让服务器误以为是一个正常的用户在操作，让各种恶意的操作变为可能。

### 3. 诱导点击发送 GET 请求

```html
<a href="https://target.com/info?user=hhh&count=100" taget="_blank">点击进入修仙世界</a>
```

点击后，自动发送 get 请求，接下来和自动发 GET 请求部分同理。

这就是CSRF攻击的原理。和XSS攻击对比，CSRF 攻击并不需要将恶意代码注入用户当前页面的html文档中，而是跳转到新的页面，利用服务器的验证漏洞和用户之前的登录状态来模拟用户进行操作。

## 防范措施

### 1. 利用Cookie的SameSite属性

CSRF攻击中重要的一环就是自动发送目标站点下的 Cookie,然后就是这一份 Cookie 模拟了用户的身份。因此在Cookie上面下文章是防范的不二之选。

恰好，在 Cookie 当中有一个关键的字段，可以对请求中 Cookie 的携带作一些限制，这个字段就是SameSite。

SameSite可以设置为三个值，Strict、Lax和None。

a. 在Strict模式下，浏览器完全禁止第三方请求携带Cookie。比如请求sanyuan.com网站只能在sanyuan.com域名当中请求才能携带 Cookie，在其他网站请求都不能。

b. 在Lax模式，就宽松一点了，但是只能在 get 方法提交表单况或者 a 标签发送 get 请求的情况下可以携带 Cookie，其他情况均不能。（get 和 a 标签一般不对敏感数据进行修改，所以可以放松该标准）

c. 在None模式下，也就是默认模式，请求会自动携带上 Cookie。


### 2. 验证来源站点

这就需要要用到请求头中的两个字段: Origin 和 Referer。

其中，Origin 只包含域名信息，而 Referer 包含了具体的 URL 路径。

当然，这两者都是可以伪造的，通过 Ajax 中自定义请求头即可，安全性略差。

### 3. CSRF Token

Django作为 Python 的一门后端框架，用它开发过的同学就知道，在它的模板(template)中, 开发表单时，经常会附上这样一行代码:

```
{% csrf_token %}
```

这就是CSRF Token的典型应用。那它的原理是怎样的呢？

首先，浏览器向服务器发送请求时，服务器生成一个字符串，将其植入到返回的页面中。

然后浏览器如果要发送请求，就必须带上这个字符串，然后服务器来验证是否合法，如果不合法则不予响应。这个字符串也就是 CSRF Token，通常第三方站点无法拿到这个 token, 因此也就是被服务器给拒绝。


现代的防御一般把 CSRF Token cookie 中，是不是感到不可以思议？听我为你一一解析：

我们防御的是 CSRF 攻击，我们需要把本地的 token 和服务端session 中储存的 token 进行比对，如果token 相同，则认为是合法请求。那么我们本地就要找一个地方储存 token, 最合理方便的就是 cookie，更新 cookie 的时候，顺便更新 token 的值，无需额外的请求接口。发起请求的时候，我们利用 document.cookie 获取 csrfToken 的值，放在请求的表单里面，提交表单到服务端，服务端只要验证 cookie 中的 csrfToken 和请求体中的 token 是否相同即可，方便又实在。

csrf 攻击是不会去获取具体的 cookie 的值的，第一是不同域下不能获取到其他域名下的 cookie，所以 csrf 攻击拿不到具体的 csrfToken。第二，不是所有的 cookie 都是可以被获取的，部分的 cookie 值设置成了 httpOnly，这也防止了 XSS 攻击。XSS 攻击可以拿到 csrfToken，但是拿不到敏感的 cookie 数据。

### 4. 验证码

应用程序和用户进行交互过程中，特别是账户交易这种核心步骤，强制用户输入验证码，才能完成最终请求。在通常情况下，验证码够很好地遏制CSRF攻击。但增加验证码降低了用户的体验，网站不能给所有的操作都加上验证码。所以只能将验证码作为一种辅助手段，在关键业务点设置验证码。

## 总结

CSRF(Cross-site request forgery), 即跨站请求伪造，指的是黑客诱导用户点击链接，打开黑客的网站，然后黑客利用用户目前的登录状态发起跨站请求。


CSRF攻击一般会有三种方式:

- 自动 GET 请求
- 自动 POST 请求
- 诱导点击发送 GET 请求。

防范措施: 

利用 Cookie 的 SameSite 属性、验证来源站点和 CSRF Token。


## 参考

https://github.com/ljianshu/Blog/issues/56