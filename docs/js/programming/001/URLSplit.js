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

function parseParam(url) {
  let search = url.split('?')[1]
  let arr = search ? search.split('#')[0].split('&') : []

  const res = {}

  arr.forEach(e => {
    let [key, value] = e.split('=')

    if (value == undefined) {
      res[key] = true
    } else if (key in res) {
      if (/^[0-9]+$/.test(value)) {
        value = Number(value)
      }
      Array.isArray(res[key]) ? res[key].push(value) : res[key] = [res[key], value]
    } else if (/^[0-9]+$/.test(value)) {
      res[key] = Number(value)
    } else {
      res[key] = decodeURI(value)
    }
  })

  return res
}

console.log(parseParam('http://www.domain.com/?user=anonymous&id=123&id=456&city=%E5%8C%97%E4%BA%AC&enabled'))