# 策略模式

## 用策略模式计算奖金

参照 Java 设计模式的实现版本 

```js
class performanceS {
  calculate (salary) {
    return salary * 4
  }
}

class performanceA {
  calculate (salary) {
    return salary * 3
  }
}

class performanceB {
  calculate (salary) {
    return salary * 2
  }
}
class Bonus {
  constructor() {
    this.salary = null
    this.strategy = null
  }

  setSalary (salary) {
    this.salary = salary
  }

  setStrategy (strategy) {
    this.strategy = strategy
  }

  getBonus () {
    return this.strategy.calculate(this.salary)
  }
}

let bonus = new Bonus()

bonus.setSalary(10000)
bonus.setStrategy(new performanceB())

console.log(bonus.getBonus())

bonus.setStrategy(new performanceA())


console.log(bonus.getBonus())
```
## JS 版策略模式
```js
const strategies = {
  "S": function (salary) {
    return salary * 4
  },
  "A": function (salary) {
    return salary * 3
  },
  "B": function (salary) {
    return salary * 2
  }
}

const calcuteBonus = function (level, salary) {
  return strategies[level](salary)
}

console.log(calcuteBonus('S', 1000));

console.log(calcuteBonus('A', 1000));
```
## 表单校验
给表单中的各个DOM组件增加校验
```js
class Validator {
  constructor() {
    this.cache = []
  }

  add (dom, rule, errorMsg) {
    let ary = rule.split(':')
    this.cache.push(() => {
      const strategy = ary.shift() //拿到第一个参数用户挑选的策略名称
      ary.unshift(dom.value) // 把 input 等组件的 value 值添加进参数列表
      ary.push(errorMsg)
      return strategies[strategy].apply(dom, ary)
    })
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

  validator.add(form.userNameDom, 'isNonEmpty', '用户名不能为空')
  validator.add(form.telephoneDom, 'isMobile', '用户电话号码输入不正确')

  const errorMsg = validator.start()
  return errorMsg
}

console.log(validateFunc())
```
如果一个DOM组件想要进行多个规则的校验呢？没问题，修改代码如下

校验的时候，传入rules数组，对rules数组进行处理。
```js
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
```