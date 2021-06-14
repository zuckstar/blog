// 防抖
function debounce (fn, delay) {
  let timer = null

  return function (...args) {
    let context = this

    if (timer) {
      clearTimeout(timer)
    }

    timer = setTimeout(() => {
      fn.apply(context, args)
    }, delay);
  }
}

// 防抖：立即执行

function debounceImmediate (fn, delay) {
  let timer = null
  let flag = true

  return function (...args) {
    let context = this

    if (flag) {
      fn.apply(context, args)
      flag = false
    }

    if (timer) {
      clearTimeout(timer)
    }

    timer = setTimeout(() => {
      flag = true
    }, delay);
  }
}