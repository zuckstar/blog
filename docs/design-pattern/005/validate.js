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
