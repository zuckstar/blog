# 装饰者模式

给对象动态地增加职责的方式称为装饰者模式，装饰者模式能够在不改变对象自身的基础上，在程序运行期间给对象动态地添加职责。且不影响该类的派生对象

## 应用场景

### 用 AOP 装饰函数

```js
Function.prototype.before = function(beforeFn) {
  let _self = this
  return function() {
    beforeFn.apply(this, arguments)

    return _self.apply(this, arguments)
  }
}

Function.prototype.after = function(afterFn) {
  let _self = this

  return function() {
    const ret = _self.apply(this, arguments)
    afterFn.apply(this, arguments)
    return ret
  }
}

let showLogin = function() {
  console.log('打开登陆浮窗')
}

showLogin = showLogin.before(() => {
  console.log('检查登陆环境')
})

showLogin = showLogin.after((username, password) => {
  console.log('输入用户名,密码', username, password)
})

showLogin('user', 'pwd')
// 检查登陆环境
// 打开登陆浮窗
// 输入用户名,密码 user pwd
```

### 给 ajax 请求中的参数增加 token

```js
Function.prototype.before = function(beforeFn) {
  let _self = this
  return function() {
    beforeFn.apply(this, arguments)

    return _self.apply(this, arguments)
  }
}

const getCookie = () => {
  let Cookies = document.cookie.split(';')
  let obj = {}
  Cookies.forEach((cookie) => {
    let res = cookie.split('=')
    obj[res[0].trim()] = res[1]
  })
  return obj
}

const getToken = function() {
  let cookie = getCookie()
  return cookie.csrf
}

let ajax = (type, url, param) => {
  param = param || {}
  console.log(type, url, param)
}

ajax = ajax.before((type, url, param) => {
  param.Token = getToken()
})

ajax('get', 'www.xxx.com/info', {})

```
### 表单验证

```js
Function.prototype.before = function(beforeFn) {
  let _self = this
  return function() {
    if (beforeFn.apply(this, arguments) === false) {
      // 如果不通过校验，则直接 return，不再执行后续函数
      return
    }

    return _self.apply(this, arguments)
  }
}

// 模拟 input 表单组件
const username = {
  value: '',
}

const password = {
  value: '',
}

const validate = function() {
  if (!username.value) {
    console.log('用户名不能为空')
    return false
  }
  if (!password.value) {
    console.log('密码不能为空')
    return false
  }
}

let formSubmit = () => {
  let param = {
    username: username.value,
    password: password.value,
  }
  console.log(param)
}

formSubmit = formSubmit.before(validate)

formSubmit()
```

### ts 装饰器

装饰器是一项实验性特性，在未来的版本中可能会发生改变。

若要启用实验性的装饰器特性，你必须在命令行或tsconfig.json里启用experimentalDecorators编译器选项：

```json
{
    "compilerOptions": {
        "target": "ES5",
        "experimentalDecorators": true
    }
}
```

装饰器是一种特殊类型的声明，它能够被附加到类声明，方法， 访问符，属性或参数上。 装饰器使用 @expression这种形式，expression求值后必须为一个函数，它会在运行时被调用，被装饰的声明信息做为参数传入。

### 代理模式和装饰者模式的区别

代理模式的目的是当直接访问本体不方便或者不符合需求时，为这个本体提供一个替代者。本体定义了关键功能，而代理提供或决绝对它的访问，或者在访问本体之前做一些额外的事情，代理模式强调一种关系，这种关系可以静态地表达。

装饰者模式用于一开始不能确定对象的全部功能时，代理模式通常只有一层代理-本体的引用，而装饰者模式经常会形成一条长长的装饰链，装饰者模式的作用就是为对象动态地加入行为。