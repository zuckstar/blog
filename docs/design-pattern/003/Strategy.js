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