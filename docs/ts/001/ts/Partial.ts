interface Animal {
  name: string;
  age: number;
  type: string;
}

type AnimalAttr = keyof Animal

// age | name | type
let animalAttr: AnimalAttr = 'name'

type AnimalObj = {
  [p in AnimalAttr]: any
}

let animalObj: AnimalObj = {
  name: '小龙',
  age: 100,
  type: 'dragon'
}

// Patial
type MyPartial<T> = {
  [P in keyof T]?: T[P] // 取 T 类型身上的 P 属性的类型
}

let partialAnimal: MyPartial<Animal> = {
  name: '小虎',
  age: 101
}