# HTML5 新特性

## 1. Semantic 语义化特性

详见下一篇文章

## 2. 增强型表单

### 新的 input 输入类型

新增加的属性描述如下：

- autocomplete ：是否显示与现在输入内容相匹配的历史输入记录。
- autofocus ：当页面加载完成后，此元素获得焦点。
- form ：设置元素归属表单的ID。
- formaction ：设置表单action属性的值。
- formenctype ：设置表单enctype属性的值。
- formmethod ：设置表单method属性的值。
- formnovalidate ：关闭表单的验证。
- formtarget ：设置表单target属性的值。
- max ：设置元素中数字或日期控件的最大值。
- min ：设置元素中数字或日期控件的最小值。
- minlength ：设置文本输入控件的内容最小长度。
- pattern ：设置元素文本内容需匹配的正则表达式。
- placeholder ：设置文本控件的预先显示内容。
- readonly ：设置元素是否只读。
- required ：设置控件是否为必填项。

新增的 type：

- color ：颜色控件
- date ：日期控件
- email ：电子邮件地址输入框
- month ：年月日历控件
- number ：数值输入框
- range ：滑动条
- search ：搜索框
- tel ：电话号码输入框
- time ：时间控件
- url ：网址输入框
- week ：周数控件

这些新特性提供了更好的输入控制和验证

## 3. 新增视频 `<video>` 和音频 `<audio>` 标签

## 4. 3D, Graphics & Effects 三维、图形以及特效特性

- SVG 可缩放矢量图形
- Canvas 画布 （通过 JavaScript 来绘制）
- WebGL 网页图形库 （3D Canvas graphics）
- CSS3 3D 特性

## 5. 拖放 API

将将要拖放的对象元素的draggable属性设置为true，任何元素均可实现拖放，但img与a元素（必须定义href）默认允许拖放。
### 与拖放相关的事件
|事件|	产生事件的元素|	描述|
|---|---|---|
|dragstart|	被拖放的元素|	开始拖放操作|
|drag|	被拖放的元素|	拖放过程中|
|dragenter|	拖放过程中鼠标经过的元素|	被拖放的元素开始进入本元素的范围内|
|dragover|	拖放过程中鼠标经过的元素|	被拖放的元素正在本元素的范围内移动|
|dragleave|	拖放过程中鼠标经过的元素|	被拖放的元素离开本元素的范围|
|drop|	拖放的目标元素|	有其他元素被拖放到本元素中|
|dragend|	拖放的对象元素|	拖放操作结束|

## 6. OFFLINE & STORAGE 本地存储特性

### Application Cache 应用程序缓存

使用 HTML5，通过创建 cache manifest 文件，可以轻松地创建 web 应用的离线版本。

HTML5引入了应用程序缓存，这意味着 web 应用可进行缓存，并可在没有因特网连接时进行访问。

- 离线浏览 – 用户可在应用离线时使用它们
- 速度 – 已缓存资源加载得更快
- 减少服务器负载 – 浏览器将只从服务器下载更新过或更改过的资源。

### localStorage 本地存储
### sessionStorage 会话存储
### IndexDB 索引存储
### File API 文件接口

## 7. 设备访问特性（Device Access)

- Geolocation API 用于获得用户的地理位置
- Media API 用于媒体访问，包括麦克风和摄像头
- DeviceOrientation & DeviceMotion API 设备方向和运动API（重力感应+横竖屏）

## 8. WebSocket

## 9. Performance & Integration  性能与集成特性

### Web Workers 网页后台任务

在html5规范中引入了web workers概念，解决客户端JavaScript无法多线程的问题，其定义的worker是指代码的并行线程，不过web worker处于一个自包含的环境中，无法访问主线程的window对象和document对象，和主线程通信只能通过异步消息传递机制。

### XMLHttpRequest 2 新的 Ajax

- 可以设置HTTP请求的时限。
- 可以使用FormData对象管理表单数据。
- 可以上传文件。
- 可以请求不同域名下的数据（跨域请求）。
- 可以获取服务器端的二进制数据。
- 可以获得数据传输的进度信息。

## 参考文章
[HTML5新特性浅谈](https://blog.csdn.net/Gane_Cheng/article/details/52819118)