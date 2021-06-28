const obj = { selector: { to: { toutiao: "FE Coder" } }, target: [1, 2, { name: 'byted' }] };

function get (obj, ...paths) {
  return paths.map((path) => {
    let tmp = obj
    path.replace(/\[/g, '.')
      .replace(/\]/g, '')
      .split('.')
      .map((p) => tmp = tmp && tmp[p])
    
    return tmp
  })
}

console.log(get(obj, 'selector.to.toutiao', 'target[0]', 'target[2].name'))