// function a () {
//   let name = '张三'
//   console.log(this.user) // undefined
//   console.log(this) // window
// }

// a()


// let obj = {
//   a: function () {
//     console.log(this)
//   }
// }

// let func = obj.a

// func()


// obj.a()

// var o1 = {
//   a:10,
//   o2:{
//       // a:12,
//       fn:function(){
//           console.log(this.a);
//       }
//   }
// }
// o1.o2.fn();


function Fn(){
  this.user = "张三";
}
var a = new Fn();
console.log(a.user); // 张三