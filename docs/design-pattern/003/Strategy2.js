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