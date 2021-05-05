# bind 函数

## Function.prototype.bind() 定义

bind() 方法创建一个新的函数，在 bind() 被调用时，这个新函数的 this 被指定为 bind() 的第一个参数，而其余参数将作为新函数的参数，供调用时使用。

```js
const module = {
  x: 42,
  getX: function() {
    return this.x;
  }
};

const unboundGetX = module.getX;
console.log(unboundGetX()); // The function gets invoked at the global scope
// expected output: undefined

const boundGetX = unboundGetX.bind(module);
console.log(boundGetX());
// expected output: 42
```

## 代码实现

简单版本

```js
Function.prototype.bind = function (context) {
    if(typeof this !== 'function') {
        throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable')
    }

    let self = this

    // arguments 没有 slice 方法，利用数组原型上的slice方法，获得第一次的传参列表，1是把 context 给去除掉
    let args = Array.prototype.slice.call(arguments, 1)  

    return function() {
        let innerArgs = Array.prototype.slice.call(argumnets) // 调用时候的参数
        return self.apply(context, args.concat(innerArgs)) // 拼接两次参数
    }
}
```

作为构造函数的时候
```js
Function.prototype.newBind = function(context) {
    if(typeof this !== 'function') {
        throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
    }
    var self = this;
    var args = Array.prototype.slice.call(arguments, 1);  // 间接调用数组方法，获取第一次传的参数
    
    let tempFn = function {};  // 利用一个空函数作为中转
    
    tempFn.prototype = this.prototype;  // 修改返回函数的 prototype 为绑定函数的 prototype，实例就可以继承绑定函数的原型中的值
    
    var resultFn = function () {
        var innerArgs = Array.prototype.slice.call(arguments);
        if (this instanceof tempFn) {  // 如果 返回函数被当做构造函数后，生成的对象是 tempFn 的实例，此时应该将 this 的指向指向创建的实例。
            return self.apply(this, args.concat(innerArgs));
        } else {
            return self.apply(context, args.concat(innerArgs))
        }
      }
      
    resultFn = new tempFn();
    return resultFn;
}
```


## 参考文章

[JavaScript专题之模拟实现bind](https://zhuanlan.zhihu.com/p/48081913)