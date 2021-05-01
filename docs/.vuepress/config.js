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
        title: 'JS',
        children: [
          ['/js/serialize/', '对象序列化']
        ]
      }
    ]
  }

}
