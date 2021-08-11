interface Foo {
  type: 'foo'
}

interface Bar {
  type: 'bar'
}

interface Baz {
  type: 'baz'
}


type All = Foo | Bar
// 修改后：
// type All = Foo | Bar | Baz

function handleValue(val: All) {
  switch (val.type) {
    case 'foo':
      //  这里的 val 收窄为 Foo
      break;
    case 'bar':
      // 这里的 val 收窄为 Bar
      break;
    default:
      // val 在这里的类型是 never
      const exhaustiveCheck: never = val
      break;
  }
}

type Check<T> = never extends T ? true : false
type result = Check<string> 