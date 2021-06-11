# webpack 性能调优与 Gzip 原理

HTTP 优化有两个大的方向：

- 减少请求次数
- 减少单次请求所花费的时间

这两个优化点直直地指向了我们日常开发中非常常见的操作——资源的压缩与合并。

## webpack 的性能瓶颈

谈到资源的压缩与合并就离不开当前时下最流行的构建工具 webpack。

webpack 的优化瓶颈，主要是两个方面：

- webpack 的构建过程太花时间
- webpack 打包的结果体积太大

## webpack 优化方案

### 构建过程提速

#### 不要让 loader 做太多事情

以 babel-loader 为例：

babel-loader 无疑是强大的，但它也是慢的。

最常见的优化方式是，用 include 或 exclude 来帮我们避免不必要的转译，比如 webpack 官方在介绍 babel-loader 时给出的示例：

```js
module: {
  rules: [
    {
      test: /\.js$/,
      exclude: /(node_modules|bower_components)/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env'],
        },
      },
    },
  ]
}
```

这段代码帮我们规避了对庞大的 node_modules 文件夹或者 bower_components 文件夹的处理。但通过限定文件范围带来的性能提升是有限的。除此之外，如果我们选择开启缓存将转译结果缓存至文件系统，则至少可以将 babel-loader 的工作效率提升两倍。要做到这点，我们只需要为 loader 增加相应的参数设定：

```js
loader: 'babel-loader?cacheDirectory=true'
```

安装 babel-plugin-transform-runtime 作为开发依赖：

Babel 对常用的函数使用非常小的辅助（内置的垫片比较少），例如\_extend。默认情况下它将会添加到每个引用的文件。这种重复有时候是非常没必要的。特别是你的应用分散在很多文件中。

这是 transform-runtime 插件之所以产生的原因：所有的这些辅助（垫片）将会引用 babel-runtime 来避免编译时重复。runtime 将会编译到你的 build 中。

另一个目的是，这个转换器为你的代码创建了一个沙盒环境。如果你使用 babel-polyfill 并且把它内置提供 promise,set,map 这样的对象或功能，他们将会污染全局环境。也许在一个应用中或者命令行工具中没问题，但是如果你的代码是个库，你想发布给其他人使用，因为使用的人可能在各种各样的执行环境中，所以可能导致错误，不能执行。

转换器 transformer 会将这些内置（垫片）设置别名到 core-js 中，因此你可以不使用 require 来无缝的使用（垫片中的对象和方法）。

#### 不要放过第三方库

第三方库以 node_modules 为代表，它们庞大得可怕，却又不可或缺。

DllPlugin 是基于 Windows 动态链接库（dll）的思想被创作出来的。这个插件会把第三方库单独打包到一个文件中，这个文件就是一个单纯的依赖库。这个依赖库不会跟着你的业务代码一起被重新打包，只有当依赖自身发生版本变化时才会重新打包。

`DLLPlugin` 和 `DLLReferencePlugin` 用某种方法实现了拆分 bundles，同时还大大提升了构建的速度。

1. 首先在 dll.webpack.js 中进行配置，打包常用依赖库，生成 dll 库

```js
const path = require('path')
const webpack = require('webpack')

module.exports = {
  entry: {
    // 依赖的库数组
    vendor: [
      'prop-types',
      'babel-polyfill',
      'react',
      'react-dom',
      'react-router-dom',
    ],
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js',
    library: '[name]_[hash]',
  },
  plugins: [
    new webpack.DllPlugin({
      // DllPlugin的name属性需要和libary保持一致
      name: '[name]_[hash]',
      path: path.join(__dirname, 'dist', '[name]-manifest.json'),
      // context需要和webpack.config.js保持一致
      context: __dirname,
    }),
  ],
}
```

编写完成之后，运行这个配置文件，我们的 dist 文件夹里会出现这样两个文件：

```
vendor-manifest.json
vendor.js
```

vendor 是我们第三方库打包的结果，这个多出来的 vendor-manifest.json，则用于描述每个第三方库对应的具体路径。

2. 我们在 webpack.config.js 里针对 dll 稍作配置：

```js
const path = require('path')
const webpack = require('webpack')
module.exports = {
  mode: 'production',
  // 编译入口
  entry: {
    main: './src/index.js',
  },
  // 目标文件
  output: {
    path: path.join(__dirname, 'dist/'),
    filename: '[name].js',
  },
  // dll相关配置
  plugins: [
    new webpack.DllReferencePlugin({
      context: __dirname,
      // manifest就是我们第一步中打包出来的json文件
      manifest: require('./dist/vendor-manifest.json'),
    }),
  ],
}
```

一次基于 dll 的 webpack 构建过程优化，便大功告成了！

#### Happypack——将 loader 由单进程转为多进程

大家知道，webpack 是单线程的，就算此刻存在多个任务，你也只能排队一个接一个地等待处理。这是 webpack 的缺点，好在我们的 CPU 是多核的，Happypack 会充分释放 CPU 在多核并发方面的优势，帮我们把任务分解给多个子进程去并发执行，大大提升打包效率。

HappyPack 的使用方法也非常简单，只需要我们把对 loader 的配置转移到 HappyPack 中去就好，我们可以手动告诉 HappyPack 我们需要多少个并发的进程：

```js
const HappyPack = require('happypack')
// 手动创建进程池
const happyThreadPool =  HappyPack.ThreadPool({ size: os.cpus().length })

module.exports = {
  module: {
    rules: [
      ...
      {
        test: /\.js$/,
        // 问号后面的查询参数指定了处理这类文件的HappyPack实例的名字
        loader: 'happypack/loader?id=happyBabel',
        ...
      },
    ],
  },
  plugins: [
    ...
    new HappyPack({
      // 这个HappyPack的“名字”就叫做happyBabel，和楼上的查询参数遥相呼应
      id: 'happyBabel',
      // 指定进程池
      threadPool: happyThreadPool,
      loaders: ['babel-loader?cacheDirectory']
    })
  ],
}
```

[提升构建速度的方法（二）——HappyPack](https://zhuanlan.zhihu.com/p/59328293)

### 构建结果体积压缩

#### 文件结构可视化，找出导致体积过大的原因

这里为大家介绍一个非常好用的包组成可视化工具——webpack-bundle-analyzer，配置方法和普通的 plugin 无异，它会以矩形树图的形式将包内各个模块的大小和依赖关系呈现出来，格局如官方所提供这张图所示：

![1.jpg](./1.gif)

在使用时，我们只需要将其以插件的形式引入：

```js
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin

module.exports = {
  plugins: [new BundleAnalyzerPlugin()],
}
```

#### 拆分资源

这点仍然围绕 DllPlugin 展开，可参考上文。

[code spliting](https://zhuanlan.zhihu.com/p/26710831)

#### 删除冗余代码

Tree-Shaking：

基于 import/export 语法，Tree-Shaking 可以在编译的过程中获悉哪些模块并没有真正被使用，这些没用的代码，在最后打包的时候会被去除。

UglifyJsPlugin：

压缩过程中自动删除冗余代码

#### 按需加载

当我们不需要按需加载的时候，我们的代码是这样的：

```js

import BugComponent from '../pages/BugComponent'
...
<Route path="/bug" component={BugComponent}>
```

为了开启按需加载，我们要稍作改动。

首先 webpack 的配置文件要走起来：

```js
output: {
    path: path.join(__dirname, '/../dist'),
    filename: 'app.js',
    publicPath: defaultSettings.publicPath,
    // 指定 chunkFilename
    chunkFilename: '[name].[chunkhash:5].chunk.js',
},
```

路由处的代码也要做一下配合：

```js
const getComponent => (location, cb) {
  require.ensure([], (require) => {
    cb(null, require('../pages/BugComponent').default)
  }, 'bug')
},
...
<Route path="/bug" getComponent={getComponent}>
```

对，核心就是这个方法：

```js
require.ensure(dependencies, callback, chunkName)
```

这是一个异步的方法，webpack 在打包时，BugComponent 会被单独打成一个文件，只有在我们跳转 bug 这个路由的时候，这个异步方法的回调才会生效，才会真正地去获取 BugComponent 的内容。这就是按需加载。

按需加载的粒度，还可以继续细化，细化到更小的组件、细化到某个功能点，都是 ok 的。

在 React-Router4 中，用 Code-Splitting 替换掉了楼上这个操作，实现了按需加载。

## GZip 压缩原理

我们日常开发中，其实还有一个便宜又好用的压缩操作：开启 Gzip。

体的做法非常简单，只需要你在你的 request headers 中加上这么一句：

```
accept-encoding:gzip
```

相信很多同学对 Gzip 也是了解到这里。之所以为大家开这个彩蛋性的小节，绝不是出于炫技要来给大家展示一下 Gzip 的压缩算法，而是想和大家聊一个和我们前端关系更密切的话题：HTTP 压缩。

> HTTP 压缩是一种内置到网页服务器和网页客户端中以改进传输速度和带宽利用率的方式。在使用 HTTP 压缩的情况下，HTTP 数据在从服务器发送前就已压缩：兼容的浏览器将在下载所需的格式前宣告支持何种方法给服务器；不支持压缩方法的浏览器将下载未经压缩的数据。最常见的压缩方案包括 Gzip 和 Deflate。

### HTTP 压缩就是以缩小体积为目的，对 HTTP 内容进行重新编码的过程

Gzip 的内核就是 Deflate，目前我们压缩文件用得最多的就是 Gzip。可以说，Gzip 就是 HTTP 压缩的经典例题。

#### 该不该用 Gzip

如果你的项目不是极端迷你的超小型文件，我都建议你试试 Gzip。

有的同学或许存在这样的疑问：压缩 Gzip，服务端要花时间；解压 Gzip，浏览器要花时间。中间节省出来的传输时间，真的那么可观吗？

答案是肯定的。如果你手上的项目是 1k、2k 的小文件，那确实有点高射炮打蚊子的意思，不值当。但更多的时候，我们处理的都是具备一定规模的项目文件。实践证明，这种情况下压缩和解压带来的时间开销相对于传输过程中节省下的时间开销来说，可以说是微不足道的。

#### Gzip 是万能的吗

首先要承认 Gzip 是高效的，压缩后通常能帮我们减少响应 70% 左右的大小。

但它并非万能。Gzip 并不保证针对每一个文件的压缩都会使其变小。

Gzip 压缩背后的原理，是在一个文本文件中找出一些重复出现的字符串、临时替换它们，从而使整个文件变小。根据这个原理，文件中代码的重复率越高，那么压缩的效率就越高，使用 Gzip 的收益也就越大。反之亦然。

#### webpack 的 Gzip 和服务端的 Gzip

一般来说，Gzip 压缩是服务器的活儿：服务器了解到我们这边有一个 Gzip 压缩的需求，它会启动自己的 CPU 去为我们完成这个任务。而压缩文件这个过程本身是需要耗费时间的，大家可以理解为我们以服务器压缩的时间开销和 CPU 开销（以及浏览器解析压缩文件的开销）为代价，省下了一些传输过程中的时间开销。

既然存在着这样的交换，那么就要求我们学会权衡。服务器的 CPU 性能不是无限的，如果存在大量的压缩需求，服务器也扛不住的。服务器一旦因此慢下来了，用户还是要等。Webpack 中 Gzip 压缩操作的存在，事实上就是为了在构建过程中去做一部分服务器的工作，为服务器分压。

因此，这两个地方的 Gzip 压缩，谁也不能替代谁。它们必须和平共处，好好合作。作为开发者，我们也应该结合业务压力的实际强度情况，去做好这其中的权衡。
