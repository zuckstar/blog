# 与其他打包工具对比

webpack ： 前端资源，支持 plugin 、loader、CommentJS 模块打包 require() exports、HMR化热更新，每一个模块有大量的加载文件，运行时

rollup: 类库使用，ESMoudle 打包工具，静态打包，tree-shaking，拥有简单插件，可压缩转换，性能好速度快

esbuild: 使用 go 编写，性能极好，速度极快，但是只支持 ts、js 打包，不支持 plugin 和 loader

gulp: 支持多任务批处理，Gulp 的定位是 Task Runner, 就是用来跑一个一个任务的。但是它没发解决的是 js module 的问题，是你写代码时候如何组织代码结构的问题.