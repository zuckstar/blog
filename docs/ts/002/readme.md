# unkonw、any、和 never 类型

## never 类型的作用

尤大举的例子：

```ts
interface Foo {
  type: 'foo'
}

interface Bar {
  type: 'bar'
}

type All = Foo | Bar

function handleValue(val: All) {
  switch (val.type) {
    case 'foo':
      //  这里的 val 收窄为 Foo
      break;
    case 'bar':
      // 这里的 val 收窄为 Bar
      break;
    default:
      // 实际上 val 在这里的类型是 never
      const exhaustiveCheck: never = val
      break;
  }
}
```

我们在 default 中把收窄为 never 类型的 val 赋值给一个显式声明的 never 变量，如果一切逻辑正确，则编译可以通过。

若有一天其他人修改了 All 类型

```ts
interface Baz {
  type: 'baz'
}

type All = Foo | Bar | Baz
```

在 default branch 中 val 会被收窄为 Baz 类型，导致无法赋值给 never 类型的变量，产生一个编译错误，通过这种方法，你可以确保 handleValue 方法总是穷尽了 All 类型的所有的可能类型

### 类型运算

1. 不相交类型的inteserction结果为never:

```ts
type result = 1 & 2 // never
```

2. 是任何类型的 subtype:

```ts
type Check<T> = never extends T ? true : false
type result = Check<X>  // X 为任意类型，true
```

3. 布尔运算

```ts
// union
T | never // T

// intersection
T & never // never
```


## unkonw 类型

```ts
let value: unknown

value = true
value = 42
value = "hello world"

let value1: unknown = value
let value2: any = value
let value3: boolean = value // Error   
let value4: number  = value // Error
```

unknown 类型只能被赋值给 any 类型和 unknown 类型本身。直观的说，这是有道理的：只有能够保存任意类型值的容器才能保存 unknown 类型的值。毕竟我们不知道变量 value 中存储了什么类型的值。

与 any 类型不一样的地方在于

```ts
let anyValue: any

anyValue = 'ccc'


let value3: boolean = anyValue // ok
```

其他类型的变量可以接受 any 类型的值。