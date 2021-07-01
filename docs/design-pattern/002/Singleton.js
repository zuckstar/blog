// 单例模式

class Singleton {
  constructor(name){
    this.name = name
  }

  static getInstance(name) {
    if(!this.instance) {
      this.instance = new Singleton(name)
    }
    return this.instance
  }

  getName () {
    return this.name
  }
}


let a = Singleton.getInstance("小黄")
let b = Singleton.getInstance('小兰')


console.log(a === b)
console.log(a.name, b.name)

// 透明的单例模式 -- 利用闭包
const CreateDog = (function () {
  let instance
  class CreateDog {

    constructor(name) {
      if (instance) {
        return instance
      }
      this.name = name
      this.init()
  
      return instance
    }
  
    init () {
      let dog = {}
      dog.name = this.name
      instance = dog
    }
  }
  return CreateDog
})()

let dog1 = new CreateDog('小黄一号')
let dog2 = new CreateDog('小黄二号')

console.log(dog1 === dog2, dog1.name, dog2.name)


// 透明代理单例

class Dog {
  constructor(name) {
    this.name = name
  }
}

const ProxySingletonCreateDog = (function () {
  let instance
  return function (name) {
    if (!instance) {
      instance = new Dog(name)
    }

    return instance
  }
})()

let dog3 = new ProxySingletonCreateDog('小白一号')
let dog4 = new ProxySingletonCreateDog('小白二号')

console.log(dog3 === dog4, dog3.name, dog4.name)


// 通用的惰性单例
const getSingle = function (fn) {
  let result
  return function () {
    return result || (result = fn.apply(this, arguments))
  }
}