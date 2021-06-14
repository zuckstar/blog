// ctr 是构造器 例如 function Animal(){}

function newFunc (ctor, ...args) {
  // 创建一个空对象
  let obj = new Object()

  // 原型继承
  obj.__proto__ = Object.create(ctor.prototype)

  // 拷贝属性
  let res = ctor.apply(obj, args)

  // 如果执行完构造函数有返回值且返回的是一个对象，则返回该对象
  let isObject = typeof res === 'object' && typeof res !== null

  return isObject ? res : obj;
}

function newFunc2 (ctor, ...args) {
  let obj = {}

  obj.__proto__ = ctor.prototype

  let res = ctor.apply(obj, args)

  let isObject = typeof res === 'object' && typeof res !== null

  return isObject ? res : obj;
}

function Animal (name) {
  this.name = name
  this.age = 18
}

Animal.prototype.sayName = function () {
  console.log(this.name)
}

let a = newFunc2(Animal, '小狗')

a.sayName()
console.log(a.age)