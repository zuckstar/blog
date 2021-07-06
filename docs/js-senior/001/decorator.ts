// 装饰器


// 类装饰器：
// const classDecorator = (target: any) => {
//   console.log('来啦，老弟')
// }

// @classDecorator
// class A {
//   sayName() {
//       console.log('classA ascoders')
//   }
// }
// const a = new A() // 在 new 的时候就会运行装饰器的内容

// a.sayName() // classA ascoders


// 方法装饰器：

// 重写了原来的方法
// const methodDecorator = (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
//   console.log(target, propertyKey, descriptor)
//   return {
//       get() {
//           return () => {
//               console.log('classC method override')
//           }
//       }
//   }
// }

// class C {
//   @methodDecorator
//   sayName() {
//       console.log('classC ascoders')
//   }
//   sayHi() {
//     console.log('hi')
//   }
// }
// const c = new C()
// c.sayName() // classC method override


// 属性装饰器

// const propertyDecorator = (target: any, propertyKey: string | symbol) => {
//   Object.defineProperty(target, propertyKey, {
//       get() {
//           return 'github'
//       },
//       set(value: any) {
//           return value
//       }
//   })
// }

// class B {
//   @propertyDecorator
//   private name = 'ascoders'

//   sayName() {
//       console.log(`classB ${this.name}`)
//   }
// }
// const b = new B()
// b.sayName() // classB github
