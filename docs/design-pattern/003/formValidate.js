class Validator {
  constructor() {
    this.cache = []
  }

  add (dom, rules) {
    for (let i = 0; i < rules.length; i++) {
      let rule = rules[i]
      const strategyAry = rule.strategy.split(':')
      const errorMsg = rule.errorMsg
      this.cache.push(() => {
        const strategy = strategyAry.shift() // 拿到策略名称
        strategyAry.unshift(dom.value)
        strategyAry.push(errorMsg)
        return strategies[strategy].apply(dom, strategyAry)
      })
    }
  
  }

  start () {
    for (let i = 0; i < this.cache.length; i++) {

      let msg =  this.cache[i]()
      
      if (msg) {
        return msg // 有返回值说明有错误
      }
    }
  }
}

const strategies = {
  isNonEmpty: function (value, errorMsg) {
    if (value === '') {
      return errorMsg;
    }
  },
  minLength: function (value, length, errorMsg) {
    if (value.length < length) {
      return errorMsg
    }
  },
  isMobile: function (value, errorMsg) {
    if (!/^1[3|5|8][0-9]{9}$/.test(value)) {
      return errorMsg
    }
  }
}
const form = {
  userNameDom: {
    value: '张三'
  },
  telephoneDom: {
    value: '119'
  }
}


const validateFunc = function () {
  const validator = new Validator()

  validator.add(form.userNameDom, [{
    strategy: 'isNonEmpty',
    errorMsg: '用户名不能为空'
  }, {
    strategy: 'minLength:6',
    errorMsg: '用户名长度不能小于6位'
  }])

  const errorMsg = validator.start()
  return errorMsg
}

console.log(validateFunc())