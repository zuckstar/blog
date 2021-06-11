# 图片优化

## 图片格式

时下应用较为广泛的 Web 图片格式有 JPEG/JPG、PNG、WebP、Base64、SVG等

### JPEG/JPG

关键字：有损压缩、体积小、加载快、不支持透明

优点：有损压缩，高品质的有损压缩。

缺点：不支持透明度处理，当它处理矢量图形和 Logo 等线条感较强、颜色对比强烈的图像时，人为压缩导致的图片模糊会相当明显。

应用场景：一般用于呈现大图上（轮播图、banner）
### PNG

关键字：无损压缩、质量高、体积大、支持透明

优点：PNG（可移植网络图形格式）是一种无损压缩的高保真的图片格式。8 和 24，这里都是二进制数的位数。按照我们前置知识里提到的对应关系，8 位的 PNG 最多支持 256 种颜色，而 24 位的可以呈现约 1600 万种颜色。

缺点：PNG 图片具有比 JPG 更强的色彩表现力，对线条的处理更加细腻，对透明度有良好的支持。它弥补了上文我们提到的 JPG 的局限性，唯一的 BUG 就是体积太大。

应用场景：小 LOGO、颜色简单且对比强烈的图片背景等

### SVG

关键字：文本文件、矢量图、体积小、不失真、兼容性好

SVG（可缩放矢量图形）是一种基于 XML 语法的图像格式。它和本文提及的其它图片种类有着本质的不同：SVG 对图像的处理不是基于像素点，而是是基于对图像的形状描述。


优点：SVG 与 PNG 和 JPG 相比，文件体积更小，可压缩性更强。

当然，作为矢量图，它最显著的优势还是在于图片可无限放大而不失真这一点上。这使得 SVG 即使是被放到视网膜屏幕上，也可以一如既往地展现出较好的成像品质——1 张 SVG 足以适配 n 种分辨率。

此外，SVG 是文本文件。我们既可以像写代码一样定义 SVG，把它写在 HTML 里、成为 DOM 的一部分，也可以把对图形的描述写入以 .svg 为后缀的独立文件（SVG 文件在使用上与普通图片文件无异）。这使得 SVG 文件可以被非常多的工具读取和修改，具有较强的灵活性。

缺点：渲染成本高，影响性能，svg存在学习成本（可编程文本格式）

应用场景：矢量图、设计动画、现在可以代替上述大多数图片的使用场景
### 雪碧图

多个小图整合成一张图，减少图片请求次数

### Base64

关键字：文本文件、依赖编码、小图标解决方案

Base64 是一种用于传输 8Bit 字节码的编码方式，通过对图片进行 Base64 编码，我们可以直接将编码结果写入 HTML 或者写入 CSS，从而减少 HTTP 请求的次数。


优点：减少HTTP请求次数，把图片转成文本跟随 HTML 一起传输，而不用单独请求图片资源

缺点：Base64 编码后，图片大小会膨胀为原文件的 4/3（这是由 Base64 的编码原理决定的），如果使用大图编码会导致 HTML 文件体积明显增加。

应用场景：
适用于图片实际尺寸很小，例如小图标，箭头等，几乎没有超过 2kb
图片的更新频率非常低

### WebP

关键字：年轻的全能型选手

WebP 是今天在座各类图片格式中最年轻的一位，它于 2010 年被提出， 是 Google 专为 Web 开发的一种旨在加快图片加载速度的图片格式，它支持有损压缩和无损压缩。

优点：WebP 像 JPEG 一样对细节丰富的图片信手拈来，像 PNG 一样支持透明，像 GIF 一样可以显示动态图片——它集多种图片文件格式的优点于一身。

WebP 的官方介绍对这一点有着更权威的阐述：

> 与 PNG 相比，WebP 无损图像的尺寸缩小了 26％。在等效的 SSIM 质量指数下，WebP 有损图像比同类 JPEG 图像小 25-34％。

无损 WebP 支持透明度（也称为 alpha 通道），仅需 22％ 的额外字节。对于有损 RGB 压缩可接受的情况，有损 WebP 也支持透明度，与 PNG 相比，通常提供 3 倍的文件大小。

缺点：兼容性差，浏览器除了 chrome（或者 Chromium 内核的浏览器） 其他的支持性一般。

应用场景：对 WebP 兼容性比较好的浏览器，或者对图片展示做兼容性处理，支持 webp 的浏览器显示 webp 图片，不支持的显示 png 图片。

## 图片懒加载


### 方案一：clientHeight、scrollTop 和 offsetTop

首先给图片定义一个占位属性，data-xxx="图片地址"

```html
<img src="default.jpg" data-src="http://www.xxx.com/target.jpg" />
```

通过监听 scroll 事件来判断图片是否达到视口

```js
let img = document.getElementsByTagName("img");
let count = 0;//计数器，从第一张图片开始计

lazyload();//首次加载别忘了显示图片

window.addEventListener('scroll', lazyload);

function lazyload() {
  //视口高度（当前窗口的高度）
  let viewHeight = document.documentElement.clientHeight;

  //滚动条卷去的高度
  let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
  
  for(let i = count; i <num; i++) {
    // 元素现在已经出现在视口中 图片的绝对高度位置 < 卷去高度+视口高度
    if(img[i].offsetTop < scrollHeight + viewHeight) {
      if(img[i].getAttribute("src") !== "default.jpg") continue;
      img[i].src = img[i].getAttribute("data-src");
      count ++;
    }
  }
}
```
当然，最好对 scroll 事件做节流处理，以免频繁触发:

```js
// throttle函数参考 007 防抖和节流
window.addEventListener('scroll', throttle(lazyload, 200));
```
### 方案二：getBoundingClientRect

现在我们用另外一种方式来判断图片是否出现在了当前视口, 即 DOM 元素的 getBoundingClientRect API。

上述的 lazyload 函数改成下面这样:

```js

function lazyload() {
  for(let i = count; i <num; i++) {
    // 元素现在已经出现在视口中
    if(img[i].getBoundingClientRect().top < document.documentElement.clientHeight) {
      if(img[i].getAttribute("src") !== "default.jpg") continue;
      img[i].src = img[i].getAttribute("data-src");
      count++;
    }
  }
}

```

### 方案三：IntersectionObserver

这是浏览器内置的一个API，实现了监听window的scroll事件、判断是否在视口中以及节流三大功能。

```js
let img = document.document.getElementsByTagName("img");

const observer = new IntersectionObserver(changes => {
  //changes 是被观察的元素集合
  for(let i = 0, len = changes.length; i < len; i++) {
    let change = changes[i];
    // 通过这个属性判断是否在视口中
    if(change.isIntersecting) {
      const imgElement = change.target;
      imgElement.src = imgElement.getAttribute("data-src");
      observer.unobserve(imgElement);
    }
  }
})
observer.observe(img);
```

这样就很方便地实现了图片懒加载，当然这个IntersectionObserver也可以用作其他资源的预加载，功能非常强大。