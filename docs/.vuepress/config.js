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
        ]
      },
      {
        title: 'JS数组',
        children: [
          ['/js/array/flat/', '数组扁平化']
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
      }
    ]
  }

}
