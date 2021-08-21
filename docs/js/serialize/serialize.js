const isObject = (target) => {
    typeof target === 'object' || typeof target !== null;
}

const json2str = (target) => {
  let arr = [];
  const isArray = (target) => {
    return Array.isArray(target)
  }
  const fmt = function(s) {
    if(typeof s == 'object' && s !== null) return json2str(s);
    return /^(string)$/.test(typeof s) ? `"${s}"`: s;
  }

  for (let prop in target) {
    if (target.hasOwnProperty(prop)) {
        if(isArray(target)) {
          arr.push(`${fmt(target[prop])}`)
        } else {
          arr.push(`"${prop}":${fmt(target[prop])}`)
        }
       
    }
  }

  if(!isArray(target))
    return `{${arr.join(',')}}`
  else
    return `[${arr.join(',')}]`
}


const obj = { name: "Lily", age: 30, tel: [1,2,3,4,5], address: { city : "beijing", district: "haidian", detail: "dddddddd"} };
const generatedData = json2str(obj)
console.log(generatedData)