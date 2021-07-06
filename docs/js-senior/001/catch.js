// 场景一：


// function fetch(callback) {
//   setTimeout(() => {
//       throw Error('请求失败')
//   })
// }

// try {
//   fetch(() => {
//       console.log('请求处理') // 永远不会执行
//   })
// } catch (error) {
//   console.log('触发异常', error) // 永远不会执行
// }


// 场景二：

// function fetch(handleError, callback) {
//   setTimeout(() => {
//       handleError('请求失败')
//   })
// }

// fetch(() => {
//   console.log('失败处理') // 失败处理
// }, error => {
//   console.log('请求处理') // 永远不会执行
// })


// 场景三：

// function fetch(callback) {
//   return new Promise((resolve, reject) => {
//       throw Error('用户不存在')
//   })
// }

// fetch().then(result => {
//   console.log('请求成功处理', result) // 永远不会执行
// }).catch(error => {
//   console.log('请求处理异常', error) // 请求处理异常 用户不存在
// })

// 场景四

// function fetch(callback) {
//   return new Promise((resolve, reject) => {
//       setTimeout(() => {
//            throw Error('用户不存在')
//       })
//   })
// }


// fetch().then(result => {
//   console.log('请求成功处理', result) 
// }).catch(error => {
//   console.log('请求处理异常', error) // 请求处理异常 用户不存在
// })

// 场景五

// function fetch(callback) {
//   return new Promise((resolve, reject) => {
//       setTimeout(() => {
//           reject('no')
//       })
//   })
// }

// async function main() {
//   try {
//       const result = await fetch()
//       console.log('请求处理', result) // 永远不会执行
//   } catch (error) {
//       console.log('异常', error) // 异常 no
//   }
// }

// main()


// 场景六 action

// const successRequest = () => Promise.resolve('a')
// const failRequest = () => Promise.reject('b')

// class Action {
//     async successReuqest() {
//         const result = await successRequest()
//         console.log('successReuqest', '处理返回值', result) // successReuqest 处理返回值 a
//     }

//     async failReuqest() {
//         const result = await failRequest()
//         console.log('failReuqest', '处理返回值', result) // 永远不会执行
//     }

//   async allReuqest () {
//     try {
//       const result1 = await successRequest()
//       console.log('allReuqest', '处理返回值 success', result1) // allReuqest 处理返回值 success a
//       const result2 = await failRequest()
//       console.log('allReuqest', '处理返回值 success', result2) // 永远不会执行
//     } catch (e) {
//       console.log('有错误了',e)
//       }
//     }
// }

// const action = new Action()

// action.allReuqest()

// 程序崩溃
// Uncaught (in promise) b
// Uncaught (in promise) b


