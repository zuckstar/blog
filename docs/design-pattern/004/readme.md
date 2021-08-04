# 代理模式

## 虚拟代理实现图片预加载

```js
let myImage = (function () {
  let imgNode = document.createElement('img')
  document.body.appendChild(imgNode)

  return {
    setSrc: function (src) {
      imgNode.src = src
    }
  }
})()

let proxyImage = (function () {
  let img = new Image()
  img.onload = function () {
    myImage.setSrc(this.src)
  }
  return {
    setSrc: function (src) {
      myImage.setSrc('loading.gif')
      img.src = src
    }
  }
})

```

代理的意义就是实现了面向对象设计的原则--单一职责的原则，让 myImage 做好图片加载和显示的职责，而让 proxyImage 去实现预加载的能力。

## 虚拟代理在惰性加载中的应用
proxy.html
```js
    let miniConsole = (function () {
      let cache = []
      let handler = function (ev) {
        // 点击 F2 后才真正地加载脚本
        if(ev.key === 'F2') {
          let script = document.createElement('script')
          script.onload = function () {
            for(let i = 0; i < cache.length; i++) {
              let fn = cache[i]
              fn()
            }
          }
          script.src = 'miniConsole.js'
          document.getElementsByTagName('head')[0].appendChild(script)
          document.body.removeEventListener('keydown', handler)
        }
      }

      document.body.addEventListener('keydown', handler, false)

      return {
        log: function () {
          let args = arguments
          cache.push(function () {
            return miniConsole.log.apply(miniConsole, args)
          })
        }
      }
    })()
```

miniConsole.js

```js
miniConsole = {
  log: function() {
    console.log(Array.prototype.join.call(arguments))
  },
}
```
## 缓存代理

### 计算乘积

mult.js

```js
let mult = function() {
  console.log('开始计算乘积')
  let a = 1
  let args = Array.from(arguments)
  for (let num of args) {
    a = a * num
  }
  return a
}

let proxyMult = (function() {
  let cache = {}

  return function() {
    let args = Array.prototype.join.call(arguments, ',')
    if (args in cache) {
      return cache[args]
    }
    return (cache[args] = mult.apply(this, arguments))
  }
})()

console.log(proxyMult(1, 2, 3, 4)) 
console.log(proxyMult(1, 2, 3, 4)) // 第二次计算直接读取缓存的值
```

## 用高阶函数动态创建代理

通过传入高阶函数这种更加灵活的方式，可以为各种计算方法创建缓存代理。

createProxyFactory.js

```js
let mult = function() {
  console.log('计算乘积')

  let a = 1
  let args = Array.from(arguments)

  for (let num of args) {
    a *= num
  }
  return a
}

let plus = function() {
  console.log('计算总和')

  let a = 0
  let args = Array.from(arguments)

  for (let num of args) {
    a += num
  }

  return a
}

let createProxyFactory = function(fn) {
  let cache = []
  return function() {
    let args = Array.prototype.join.call(arguments, ',')

    if (args in cache) {
      return cache[args]
    }

    return (cache[args] = fn.apply(this, arguments))
  }
}

let proxyMult = createProxyFactory(mult),
  proxyPlus = createProxyFactory(plus)

console.log(proxyMult(1, 2, 3, 4))
console.log(proxyMult(1, 2, 3, 4))
console.log(proxyPlus(1, 2, 3, 4))
console.log(proxyPlus(1, 2, 3, 4))
```