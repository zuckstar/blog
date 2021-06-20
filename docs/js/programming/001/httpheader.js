const solution = (s) => {
  let res = {}

  let arr = s.split('\n')

  arr.forEach(element => {
    let tmp = element.split(': ');
    res[tmp[0]] = tmp[1]
  });

  return res
}

let header = `Accept-Ranges: bytes
Cache-Control: max-age=6000, public
Connection: keep-alive
Content-Type: application/javascript`

console.log(solution(header))