// 选择排序，每次都找到当前位置的元素
function selectSort (ary) {
  let len = ary.length

  for (let i = 0; i < len; i++) {
    let idx = i
    
    // 每次找到一个最小值
    for (let j = i + 1; j < len; j++) {
      if (ary[idx] > ary[j]) {
        idx = j
      }
    }

    [ary[idx], ary[i]] = [ary[i], ary[idx]]

  }

  return ary
}

console.log(selectSort([6, 45, 3, 2, 5, 6, 8, 4, 3, 4, 56, 67, 5]))