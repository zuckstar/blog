# Promise 实现 all 和 race 方法

## 实现 Promise.all

对于 all 方法而言，需要完成下面的核心功能:

1. 传入参数为一个空的可迭代对象，则直接进行 resolve。

2. 如果参数中有一个 promise 失败，那么 Promise.all 返回的 promise 对象失败。

3. 在任何情况下，Promise.all 返回的 promise 的完成状态的结果都是一个数组

具体实现如下:

```js
Promise.all = function (arrs) {
    return new Promise(function (resolve,reject) {
        let result = [];//新的promise返回结果
        let indexNum = 0;//当前完成几个
        let resolved = function (data, index) {
          result[index] = data;
          indexNum++;
          if(indexNum == arrs.length){
            resolve(result);
          }
        };
        for(let i = 0;i < arrs.length; i++){
            Promise.resolve(arrs[i]).then(data => {
              resolved(data, i)
            }).catch(err => {
              reject(err)
            })
        };
    });
```

## 实现 Promise.race

```js

Promise.race = function (arrs) {
    return new Promise(function (resolve,reject) {
        for(let i=0;i<arrs.length;i++){
            Promise.resolve(arrs[i]).then((data) => {
              resolve(data);
            }).catch(err => {
              reject(err)
            })
        };
    });
```
