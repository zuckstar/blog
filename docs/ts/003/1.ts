
namespace Generatic {
  interface IDog<T> {
    age: T
  }
  
  function getDogAge<T>(dog: IDog<T>) {
    return dog.age
  }

  let age = getDogAge<number>({ age: 18 })
  
}