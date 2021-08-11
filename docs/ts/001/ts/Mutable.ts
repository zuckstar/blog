type Mutable<T> = {
  -readonly [P in keyof T]: T[P]
}

interface IDog {
  readonly name: string
  age: number
}


let dog: IDog = {
  name: '小龙',
  age: 33
}

// 无法分配到 "name" ，因为它是只读属性。
// dog.name = '小兵'


let dogM: Mutable<IDog> = {
  name: '小龙',
  age: 3
}

dogM.name = '小哈' // ok

type MReadonly<T> = {
  readonly [P in keyof T]: T[P]
}

let dogR: MReadonly<IDog> = {
  name: '小a',
  age: 3
}
// 无法分配到 "age" ，因为它是只读属性。
// dogR.age = 4