# React hooks 和 class 组件

## HOC 高阶组件

## hooks

### 优点：

1. 更容易复用代码

hooks复用比高阶组件复用逻辑更容易维护，class 生命周期比较复杂。

2. 更加清爽的代码风格+代码量更少

### 缺点：

1. 响应式的useEffect

写函数组件时，你不得不改变一些写法习惯。你必须清楚代码中useEffect和useCallback的“依赖项数组”的改变时机。有时候，你的useEffect依赖某个函数的不可变性，这个函数的不可变性又依赖于另一个函数的不可变性，这样便形成了一条依赖链。一旦这条依赖链的某个节点意外地被改变了，你的useEffect就被意外地触发了，如果你的useEffect是幂等的操作，可能带来的是性能层次的问题，如果是非幂等，那就糟糕了。

所以，对比componentDidmount和componentDidUpdate，useEffect带来的心智负担更大。

2. 状态不同步


## 参考

https://github.com/KieSun/Dream/issues/15

[谈谈react hooks的优缺点

Yong_bcf4
](https://www.jianshu.com/p/d5e4aa1a568d)