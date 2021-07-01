// instanceof 运算符用于检测构造函数的 prototype 属性是否出现在某个实例对象的原型链上。
// 用来检测  constructor.prototype 是否存在于参数  object 的原型链上。
function newInstanceOf (obj, ctor) {
  if (typeof obj !== 'object' || ctor === null) {
    return false
  }

  let ctorProto = ctor.prototype
  obj = obj.__proto__

  while (true) {
    if (obj === null) return false
    if (obj === ctorProto) return true
    obj = obj.__proto__
  }
}