function bubbleSort (ary) {
  let len = ary.length

  for (let i = 0; i < len - 1; i++) {
    for (let j = 0; j < len - i - 1; j++) {
      if (ary[j] > ary[j + 1]) { // 因为这里是 j+1 所以上述的终止条件 len - 1 就足够
        [ary[j], ary[j+1]] = [ary[j+1], ary[j]]
      }
    }
  }
  return ary
}

console.log(bubbleSort([5, 2, 4, 7, 9, 8, 3, 6, 3, 8, 3]))