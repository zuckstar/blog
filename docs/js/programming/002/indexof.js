function indexOf(origin, target) {
  const len = target.length

  for (let i = 0; i < origin.length; i++) {
    if (origin.slice(i, i + len) === target.slice()) {
      return i
    }
  }

  return -1
}

let origin = 'ababcdd'

let target = 'bc'

console.log(indexOf(origin, target))
