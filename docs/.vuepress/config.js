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
          ['/performance/debounce&throttle/', '防抖和节流']
        ]
      },
      {
        title: '浏览器',
        children: [
          ['/browser/cors/', '跨域']
        ]
      },
      {
        title: 'V8引擎',
        children: [
          ['/v8/eventloop/', '事件循环']
        ]
      }, {
        title: '异步I/O和异步编程',
        children: [
          ['/async/001/', 'NodeJS 中非阻塞 I/O、异步 I/O'],
          ['/async/002/', 'JS异步编程有哪些方案？'],
          ['/async/003/', '实现 Node 回调函数机制'],
          ['/async/004/', 'Promise系列(一)：Promise 是如何消除回调地狱的?']
        ]
      }
    ]
  }

}
