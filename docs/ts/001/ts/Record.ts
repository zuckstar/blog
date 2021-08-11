type MRecord<K, T> = {
  [P in keyof K]: T
}


let dog10: MRecord<IDog, string> = {
  name: 'aa',
  age: '33'
}




type M = string extends any ? string : number

let a: M = '3'


type TypeName<T> =
    T extends string ? "string" :
    T extends number ? "number" :
    T extends boolean ? "boolean" :
    T extends undefined ? "undefined" :
    T extends Function ? "function" :
    "object";

type T0 = TypeName<string>
type T1 = TypeName<"a">
type T2 = TypeName<true>
type T3 = TypeName<() => void>
type T4 = TypeName<string | number>


let t0: T0 = "string"
let t3: T3 = 'function'
let t4: T4 = 'string'