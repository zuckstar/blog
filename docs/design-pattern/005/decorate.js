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
