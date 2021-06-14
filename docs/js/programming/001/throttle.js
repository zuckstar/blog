function throttle (fn, delay) {
  let flag = false

  return function (...args) {
    let context = this

    if (flag) return;

    flag = true

    setTimeout(() => {
      fn.apply(context, args)
      flag = false
    }, delay);
  }
}

function throttleImmediate (fn, delay) {
  let flag = true
  return function (...args) {
    let context = this

    if (flag) {
      fn.apply(context, args)

      flag = false

      setTimeout(() => {
        flag = true
      }, delay);
    }
  }
}