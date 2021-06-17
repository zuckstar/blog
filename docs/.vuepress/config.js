module.exports = {
  title: '扎星的博客',
  description: 'Just playing around',
  base: '/',
  plugins: ['demo-container'],
  themeConfig: {
    sidebar: [
      {
        title: 'HTML',
        children: [
          ['/html/features/', 'HTML5 新特性'],
          ['/html/semantic/', 'HTML5 语义化'],
          ['/html/others/', 'HTML 其他']
        ]
      },
      {
        title: 'CSS',
        children: [
          ['/css/box-model/', '盒子模型'],
          ['/css/bfc/', '什么是BFC?'],
          ['/css/center/', '居中大法'],
          ['/css/flex/', 'flex 布局']
        ]
      },
      {
        title: 'JS基础',
        children: [
          ['/js/type/', '基本数据类型'],
          ['/js/transfer/', '数据类型转换'],
          ['/js/this/', 'this对象'],
          ['/js/for/', 'for语句'],
          ['/js/closure/', '闭包'],
          ['/js/deepcopy/', '深拷贝和浅拷贝'],
          ['/js/prototypeChain/', '原型链和继承'],
          ['/js/call&apply/', 'call和apply函数'],
          ['/js/bind/', 'bind函数'],
          ['/js/new/', '模拟实现 new 操作符'],
          ['/js/event/', '事件']
        ]
      },
      {
        title: 'JS数组',
        children: [
          ['/js/array/flat/', '数组扁平化'],
          ['/js/array/arrayLike/', '伪数组转数组'],
          ['/js/array/forEach/', 'forEach&some&every'],
          ['/js/array/contain/', '判断数组是否包含某元素'],
          ['/js/array/map/', 'map方法'],
          ['/js/array/reduce/', 'reduce方法'],
          ['/js/array/splice/', 'splice方法'],
          ['/js/array/filter/', 'filter方法'],
          ['/js/array/push&pop/', 'push&pop方法'],
          ['/js/array/sort/', 'sort方法'],
        ]
      },
      {
        title: 'JS编程练习题',
        children: [
          ['/js/programming/001/', '练习题(一)']
        ]
      },
      {
        title: 'ES6新特性',
        children: [
          ['/es6/let/', 'let 和 const'],
          ['/es6/iterator/', '迭代器'],
          ['/es6/symbol/', 'Symbol']
        ]
      },
      {
        title: '性能优化',
        children: [
          ['/performance/guide/', '001前端性能优化知识体系导读'],
          ['/performance/webpack/', '002webpack性能调优与gzip原理'],
          ['/performance/picture/', '003图片优化'],
          ['/performance/cache/', '004浏览器缓存机制和策略'],
          ['/performance/storage/', '005浏览器本地存储'],
          ['/performance/rendering/', '006服务端渲染的探索与实践'],
          ['/performance/operating/', '007浏览器运行机制'],
          ['/performance/DOM/', '008DOM优化原理与基本实践'],
          ['/performance/eventloop/', '009Event Loop 与异步更新策略'],
          ['/performance/reflow&repaint/', '010回流和重绘'],
          ['/performance/debounce&throttle/', '011防抖和节流'],
          ['/performance/performanceAPI/', '012性能检测篇: PerformanceAPI']
        ]
      },
      {
        title: '浏览器安全',
        children: [
          ['/browser/cors/', '浏览器跨域'],
          ['/browser/xss/', 'xss攻击'],
          ['/browser/csrf/', 'csrf攻击'],
          ['/browser/other/', '其他攻击']
        ]
      },
      {
        title: 'V8引擎',
        children: [
          ['/v8/eventloop/', '事件循环']
        ]
      },
      {
        title: '异步I/O和异步编程',
        children: [
          ['/async/001/', 'NodeJS 中非阻塞 I/O、异步 I/O'],
          ['/async/002/', 'JS异步编程有哪些方案？'],
          ['/async/003/', '实现 Node 回调函数机制'],
          ['/async/004/', 'Promise系列(一)：Promise 是如何消除回调地狱的?'],
          ['/async/005/', 'Promise系列(二)：Promise 为什么要引入微任务?'],
          ['/async/006/', 'Promise系列(三): Promise 如何实现链式调用?'],
          ['/async/007/', 'Promise系列(四): Promise 实现 resolve、reject 和 finally'],
          ['/async/008/', 'Promise系列(五): Promise 实现 all 和 race 方法'],
          ['/async/009/', '谈谈你对 Generator 以及协程的理解'],
          ['/async/010/', '如何让 Generator 的异步代码按顺序执行完毕？'],
          ['/async/011/', '解释一下async/await的运行机制'],
          ['/async/012/', 'forEach 中用 await 会产生什么问题?怎么解决这个问题？']
        ]
      },
      {
        title: 'TCP协议',
        children: [
          ['/networkprotocol/tcp/001/', 'TCP和UDP协议概述'],
          ['/networkprotocol/tcp/002/', '三次握手四次挥手'],
          ['/networkprotocol/tcp/003/', '半连接队列和 SYN Flood 攻击是什么关系？'],
          ['/networkprotocol/tcp/004/', 'TCP 报文头部的字段介绍'],
          ['/networkprotocol/tcp/005/', '谈谈 TCP 快速打开的原理(TFO)'],
        ]
      },
      {
        title: 'HTTP协议',
        children: [
          ['/networkprotocol/http/001/', 'http协议']
        ]
      }
    ]
  }

}
