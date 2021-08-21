# webpack loader

webpack 本质就是一个带 nodejs 环境的模块转换合并工具，以处理JS文件为主，但是一个前端项目中时常会包含各种各样不同类型的文件，这时候就需要 loader 转换器对这些文件进行处理。

例如:

- css-loader 加载 css
- sass-loader 把 scss/sass 文件转成 css
- less-loader 把 less 代码转成 css
- ts-loader 把 ts 转成 js
- babel-loader 把 es6 转成 es5

通过正则判断，当遇到某种后缀名的文件的时候，就调用相对应的 loader 进行处理。
