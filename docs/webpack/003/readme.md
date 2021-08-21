# webpack plugin

插件用来扩展 webpack 的功能的，它们会在整个构建的运行过程中改变输出结果。
在打包过程中，webpack 会广播默认事件，可以在钩子函数中插入我们想要执行的事件

```js
class myPlugin {

    constructor(doneCallback, failCallback) {
        this.doneCallback = doneCallback;
        this.failCallback = failCallback;
    }

    apply(compiler) {
        compiler.hooks.done.tap('myPlugin', (stats) => {
            this.doneCallback(stats);
        });
        compiler.hooks.failed.tap('myPlugin', (err) => {
            this.failCallback(err);
        });
    }
}

module.exports = myPlugin;
```