// 场景一：类级别的异常处理：
// 高阶函数，传入参数: errorHandler?: (error?: Error) => void) 一个错误处理函数
// 返回值：一个新的函数，函数的入参是一个 target 对象，函数内部对该对象的每一个自有方法都进行了错误处理的包裹

// const asyncClass = (errorHandler?: (error?: Error) => void) => (target: any) => {
//   // 把传入 target 对象的每一个自有属性都进行封装，并用 try...catch 进行包裹，在出错的情况下利用 errorHandler 进行处理
//   Object.getOwnPropertyNames(target.prototype).forEach(key => {
//       const func = target.prototype[key]
//       target.prototype[key] = async (...args: any[]) => {
//           try {
//               await func.apply(this, args)
//           } catch (error) {
//               errorHandler && errorHandler(error)
//           }
//       }
//   })

//   // 处理之后返回 target 对象
//   return target
// }


// const successRequest = () => Promise.resolve('a')
// const failRequest = () => Promise.reject('b')

// // 生成的装饰器方法
// const iAsyncClass = asyncClass(error => {
//     console.log('统一异常处理', error) // 错误处理方法
// })

// @iAsyncClass
// class Action {
//     async successReuqest() {
//         const result = await successRequest()
//         console.log('successReuqest', '处理返回值', result)
//     }

//     async failReuqest() {
//         const result = await failRequest()
//         console.log('failReuqest', '处理返回值', result) // 永远不会执行
//     }

//     async allReuqest() {
//         const result1 = await successRequest()
//         console.log('allReuqest', '处理返回值 success', result1)
//         const result2 = await failRequest()
//         console.log('allReuqest', '处理返回值 success', result2) // 永远不会执行
//     }
// }

// const action = new Action()
// action.successReuqest()
// action.failReuqest()
// action.allReuqest()



// 场景二：方法级别的异常处理：
const asyncMethod = (errorHandler?: (error?: Error) => void) => (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
  // 获取具体的方法
  const func = descriptor.value
  return {
    get() {
          // 重写方法并返回
          return (...args: any[]) => {
              return Promise.resolve(func.apply(this, args)).catch(error => {
                  errorHandler && errorHandler(error)
              })
          }
      },
      set(newValue: any) {
          return newValue
      }
  }
}
const successRequest = () => Promise.resolve('a')
const failRequest = () => Promise.reject('b')

const asyncAction = asyncMethod(error => {
    console.log('统一异常处理', error) // 统一异常处理 b
})

class Action {
    @asyncAction async successReuqest() {
        const result = await successRequest()
        console.log('successReuqest', '处理返回值', result)
    }

    @asyncAction async failReuqest() {
        const result = await failRequest()
        console.log('failReuqest', '处理返回值', result) // 永远不会执行
    }

    @asyncAction async allReuqest() {
        const result1 = await successRequest()
        console.log('allReuqest', '处理返回值 success', result1)
        const result2 = await failRequest()
        console.log('allReuqest', '处理返回值 success', result2) // 永远不会执行
    }
}

const action = new Action()
action.successReuqest()
action.failReuqest()
action.allReuqest()
