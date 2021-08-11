# 常用的 ts 工具泛型的使用

### Partial

keyof

```ts
interface Animal {
  name: string;
  age: number;
  type: string;
}

type AnimalAttr = keyof Animal

// age | name | type
let animalAttr: AnimalAttr = 'name'
```

keyin

```ts
type AnimalObj = {
  [p in AnimalAttr]: any
}

let animalObj: AnimalObj = {
  name: '小龙',
  age: 100,
  type: 'dragon'
}
```

Patial 部分选取

```ts
type MyPartial<T> = {
  [P in keyof T]?: T[P] // 取 T 类型身上的 P 属性的类型
}

let partialAnimal: MyPartial<Animal> = {
  name: '小虎',
  age: 101
}
```

### Required -? 和 +?

```ts
type Required<T> = {
  [P in keyof T]-?: T[P] // -? 把所有可选选变成必选项
}
```

### Mutable

移除所有的只读属性 -readonly

```ts
type Mutable<T> = {
  -readonly [P in keyof T]: T[P]
}

interface Dog {
  readonly name: string
  readonly age: number
}


let dog: Dog = {
  name: '小龙',
  age: 33
}

// 无法分配到 "name" ，因为它是只读属性。
// dog.name = '小兵'


let dogM: Mutable<Dog> = {
  name: '小龙',
  age: 3
}

dogM.age = 3 // ok
```

### readonly

```ts
type Readonly<T> = {
  readonly [P in keyof T]: T[P]
}

let dogR: Readonly<Dog> = {
  name: '小a',
  age: 3
}
// 无法分配到 "age" ，因为它是只读属性。
// dogR.age = 4
```

### extends
[TypeScript 的 extends 条件类型](https://juejin.cn/post/6844904066485583885)

条件表达式

```ts
T extends U ? X : Y
```
extends 的能力：推迟解析条件类型的额外效果

Exclude

```ts
type MExclude<T, U> = T extends U ? never : T
type t5 = string | number
type t6 = number
type t4 = MExclude<t5, t6> // string
```

Extract

```ts
type MExtract<T, U> = T extends U ? T : never

type t1 = string | boolean | undefined
type t2 = string | number | boolean

type t3 = MExtract<t1, t2> // string | boolean
```

## 参考

https://juejin.cn/post/6844904066485583885