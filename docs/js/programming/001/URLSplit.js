function getParams (url) {
  let search = url.split('?')[1]
  let arr = search ? search.split('#')[0].split('&') : []

  const res = {}

  arr.forEach(e => {
    const [key, value] = e.split('=')

    if (value) {
      res[key] = value
    } else {
      res[key] = ''
    }
  });

  return res
}

console.log(getParams('http://sample.com/?a=1&e&b=2&c=xx&d#hash'))