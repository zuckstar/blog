var cost = (function () {
  var args = []

  return function () {
    if(arguments.length === 0) {
      var money = 0

      for(var i = 0; i < args.length; i++) {
        money += args[i]
      }

      return money
    } else {
      [].push.apply(args, arguments)
    }
  }
})()

cost(100)
cost(200)
console.log(cost())