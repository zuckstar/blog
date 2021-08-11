Function.prototype.call = function(context, ...args) {
  // 如果不传对象，或者对象为 null，则默认上下文环境为 window
  context = context || window

  // 挂载方法
  context.fn = this

  // 执行
  let result = eval(`context.fn(...args)`)

  // 删除方法
  delete context.fn

  return result
}

Function.prototype.apply = function(context, args) {
  context = context || window

  context.fn = this

  let result = eval(`context.fn(...args)`)

  delete context.fn

  return result
}

let obj = {
  name: '小红',
  sayHello: function(age) {
    console.log(this.name + age)
  },
}

let obj2 = {
  name: '小白',
  sayHello: function(age) {
    console.log(this.name + age)
  },
}

obj2.sayHello.call(obj, 18)
obj2.sayHello.apply(obj, [18])
