type MExtract<T, U> = T extends U ? T : never

type t1 = string | boolean | undefined
type t2 = string | number | boolean

type t3 = MExtract<t1, t2> 