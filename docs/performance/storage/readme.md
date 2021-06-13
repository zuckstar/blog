# 本地存储

## Cookie

Cookie 的本职工作并非本地存储，而是“维持状态”。

Cookie 附着在 HTTP 请求上，它可以携带用户信息，在客户端和服务端之间进行传输。当服务器检查 Cookie 的时候，便可以获取到客户端的状态。

Cookie 以键值对的形式存在。

请求头：
```
Cookie: a=xxx;b=xxx
```

而服务端可以通过响应头中的Set-Cookie字段来对客户端写入Cookie，响应头：
```
Set-Cookie: a=xxx
set-Cookie: b=xxx
```

### Cookie 的劣势

#### 容量缺陷：

- Cookie 存储容量不大： Cookie 是有体积上限的，它最大只能有 4kb，当 Cookie 超过 4KB 时，它将面临被裁切的命运。

#### 性能缺陷

- Cookie 会带来巨大的性能浪费：Cookie 是紧跟域名的。我们通过响应头里的 Set-Cookie 指定要存储的 Cookie 值。默认情况下，domain 被设置为设置 Cookie 页面的主机名，我们也可以手动设置 domain 的值：

```
Set-Cookie: name=zhangsan; domain=zhangsan.me; path=/
```

Cookie 紧跟域名，不管域名下面的某一个地址需不需要这个 Cookie ，请求都会携带上完整的 Cookie，这样随着请求数的增多，其实会造成巨大的性能浪费的，因为请求携带了很多不必要的内容。但可以通过 Domain 和 Path 指定作用域来解决。


#### 安全缺陷


由于 Cookie 以纯文本的形式在浏览器和服务器中传递，很容易被非法用户截获，然后进行一系列的篡改，在 Cookie 的有效期内重新发送给服务器，这是相当危险的。另外，在HttpOnly为 false 的情况下，Cookie 信息能直接通过 JS 脚本来读取。

### Cookie 的属性值

#### 生命周期

Cookie 的有效期可以通过Expires和Max-Age两个属性来设置。

- Expires 即过期时间

- Max-Age 用的是一段时间间隔，单位是秒，从浏览器收到报文开始计算。

若 Cookie 过期，则这个 Cookie 会被删除，并不会发送给服务端。

#### 作用域

关于作用域也有两个属性: Domain和path, 给 Cookie 绑定了域名和路径，在发送请求之前，发现域名或者路径和这两个属性不匹配，那么就不会带上 Cookie。值得注意的是，对于路径来说，/表示域名下的任意路径都允许使用 Cookie。

#### 安全相关
secure、httpOnly、SameSite

- HttpOnly 属性设置为 true ，使得 js 脚本无法用 document.cookie 打印出 cookie 的内容，这也是预防 XSS 攻击的重要手段。

- Secure 属性设置为 true， 使得这个 Cookie 只能用 https 协议发送给服务器，而 http 协议是不发送的。

- 相应的，对于 CSRF 攻击的预防，也有SameSite属性。SameSite 属性可以设置三个值：strict、Lax 和 None

a. 在 Strict 模式下，浏览器完全禁止第三方请求携带 Cookie。比如请求 test.com 网站只能在 test.com 域名当中请求才能携带 Cookie，在其他网站请求都不能。

b. 在 Lax 模式，就宽松一点了，但是只能在 get 方法提交表单况或者 a 标签发送 get 请求的情况下可以携带 Cookie，其他情况均不能。

c. 在 None 模式下，也就是默认模式，请求会自动携带上 Cookie。

关于 SameSite 的属性，可以看下阮大师的文章 [阮一峰/SameSite](http://www.ruanyifeng.com/blog/2019/09/cookie-samesite.html)

## Web Storage

### Local Storage 与 Session Storage 的区别

两者的区别在于生命周期与作用域的不同。

- 生命周期：Local Storage 是持久化的本地存储，存储在其中的数据是永远不会过期的，使其消失的唯一办法是手动删除；而 Session Storage 是临时性的本地存储，它是会话级别的存储，当会话结束（页面被关闭）时，存储内容也随之被释放。

- 作用域：Local Storage、Session Storage 和 Cookie 都遵循同源策略。但 Session Storage 特别的一点在于，即便是相同域名下的两个页面，只要它们不在同一个浏览器窗口中打开，那么它们的 Session Storage 内容便无法共享。

### Web Storage 的特性

- 存储容量大： Web Storage 根据浏览器的不同，存储容量可以达到 5-10M 之间。

- 仅位于浏览器端，不与服务端发生通信。

### Web Storage 核心 API 使用示例

Web Storage 保存的数据内容和 Cookie 一样，是文本内容，以键值对的形式存在。Local Storage 与 Session Storage 在 API 方面无异，这里我们以 localStorage 为例：

- 存储数据：setItem()
```js
localStorage.setItem('user_name', 'xiuyan')
```
- 读取数据： getItem()
```js
localStorage.getItem('user_name')
```
- 删除某一键名对应的数据： removeItem()
```
localStorage.removeItem('user_name')
```
- 清空数据记录：clear()
```
localStorage.clear()
```

### 应用场景

#### Local Storage

Local Storage 在存储方面没有什么特别的限制，理论上 Cookie 无法胜任的、可以用简单的键值对来存取的数据存储任务，都可以交给 Local Storage 来做。

这里给大家举个例子，考虑到 Local Storage 的特点之一是持久，有时我们更倾向于用它来存储一些内容稳定的资源。比如图片内容丰富的电商网站会用它来存储 Base64 格式的图片字符串。

有的网站还会用它存储一些不经常更新的 CSS、JS 等静态资源。

#### Session Storage

Session Storage 更适合用来存储生命周期和它同步的会话级别的信息。这些信息只适用于当前会话，当你开启新的会话时，它也需要相应的更新或释放。比如微博的 Session Storage 就主要是存储你本次会话的浏览足迹。

这样看来，Web Storage 确实也够强大了。那么 Web Storage 是否能 hold 住所有的存储场景呢？

答案是否定的。大家也看到了，Web Storage 是一个从定义到使用都非常简单的东西。它使用键值对的形式进行存储，这种模式有点类似于对象，却甚至连对象都不是——它只能存储字符串，要想得到对象，我们还需要先对字符串进行一轮解析。

说到底，Web Storage 是对 Cookie 的拓展，它只能用于存储少量的简单数据。当遇到大规模的、结构复杂的数据时，Web Storage 也爱莫能助了。这时候我们就要使用我们的终极 Boss-- IndexedDB！

## IndexDB
IndexedDB 是一个运行在浏览器上的非关系型数据库。既然是数据库了，那就不是 5M、10M 这样小打小闹级别了。理论上来说，IndexedDB 是没有存储上限的（一般来说不会小于 250M）。它不仅可以存储字符串，还可以存储二进制数据。

关于它的使用，本文侧重原理，而且 MDN 上的教程文档已经非常详尽，这里就不做赘述了，感兴趣可以看一下[使用文档](https://developer.mozilla.org/zh-CN/docs/Web/API/IndexedDB_API/Using_IndexedDB)。

接着我们来分析一下IndexDB的一些重要特性，除了拥有数据库本身的特性，比如支持事务，存储二进制数据，还有这样一些特性需要格外注意：

1: 键值对存储。内部采用对象仓库存放数据，在这个对象仓库中数据采用键值对的方式来存储。

2: 异步操作。数据库的读写属于 I/O 操作, 浏览器中对异步 I/O 提供了支持。

3: 受同源策略限制，即无法访问跨域的数据库

### IndexedDB 的应用场景

通过上面的示例大家可以看出，在 IndexedDB 中，我们可以创建多个数据库，一个数据库中创建多张表，一张表中存储多条数据——这足以 hold 住复杂的结构性数据。IndexedDB 可以看做是 LocalStorage 的一个升级，当数据的复杂度和规模上升到了 LocalStorage 无法解决的程度，我们毫无疑问可以请出 IndexedDB 来帮忙。

## CDN 的缓存与回源机制解析


### CDN的核心功能

CDN 的核心点有两个，一个是缓存，一个是回源。

这两个概念都非常好理解。“缓存”就是说我们把资源 copy 一份到 CDN 服务器上这个过程，“回源”就是说 CDN 发现自己没有这个资源（一般是缓存的数据过期了），转头向根服务器（或者它的上层服务器）去要这个资源的过程。

### CDN 与前端性能优化

CDN 往往被用来存放静态资源。上文中我们举例所提到的“根服务器”本质上是业务服务器，它的核心任务在于生成动态页面或返回非纯静态页面，这两种过程都是需要计算的。业务服务器仿佛一个车间，车间里运转的机器轰鸣着为我们产出所需的资源；相比之下，CDN 服务器则像一个仓库，它只充当资源的“栖息地”和“搬运工”。

所谓“静态资源”，就是像 JS、CSS、图片等不需要业务服务器进行计算即得的资源。而“动态资源”，顾名思义是需要后端实时动态生成的资源，较为常见的就是 JSP、ASP 或者依赖服务端渲染得到的 HTML 页面。

什么是“非纯静态资源”呢？它是指需要服务器在页面之外作额外计算的 HTML 页面。具体来说，当我打开某一网站之前，该网站需要通过权限认证等一系列手段确认我的身份、进而决定是否要把 HTML 页面呈现给我。这种情况下 HTML 确实是静态的，但它和业务服务器的操作耦合，我们把它丢到CDN 上显然是不合适的。

### CDN 的实际应用

各种静态资源，都是从 CDN 服务器上请求来的： 例如 JS,GIF,CSS...等文件
首页预加载也可以从 CDN 服务器上请求：例如首页的骨架页面（没有具体内容，但是有整体的框架样式）

### CDN 优化细节

CDN 的服务器域名一般和请求的网站域名不同：不同域名不会携带 Cookie 的认证信息，把静态资源和主页面置于不同的域名下，完美地避免了不必要的 Cookie 的请求信息。
## 参考

[阮一峰/SameSite](http://www.ruanyifeng.com/blog/2019/09/cookie-samesite.html)
