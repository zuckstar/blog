type MExclude<T, U> = T extends U ? never : T
type t5 = string | number
type t6 = number
type t4 = MExclude<t5, t6> 