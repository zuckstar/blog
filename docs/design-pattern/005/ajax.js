Function.prototype.before = function(beforeFn) {
  let _self = this
  return function() {
    beforeFn.apply(this, arguments)

    return _self.apply(this, arguments)
  }
}

const getCookie = () => {
  let Cookies = document.cookie.split(';')
  let obj = {}
  Cookies.forEach((cookie) => {
    let res = cookie.split('=')
    obj[res[0].trim()] = res[1]
  })
  return obj
}

const getToken = function() {
  let cookie = getCookie()
  return cookie.csrf
}

let ajax = (type, url, param) => {
  param = param || {}
  console.log(type, url, param)
}

ajax = ajax.before((type, url, param) => {
  param.Token = 'token' // getToken()
})

ajax('get', 'www.xxx.com/info', {})
