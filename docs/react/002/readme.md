# React diff 算法

## DIFF 策略

1. Web UI 中 DOM 节点跨层级的移动操作特别少，可以忽略不计。

2. 拥有相同类的两个组件将会生成相似的树形结构，拥有不同类的两个组件将会生成不同的树形结构。

3. 对于同一层级的一组子节点，它们可以通过唯一 id 进行区分。

基于以上三个前提策略，React 分别对 tree diff、component diff 以及 element diff 进行算法优化，事实也证明这三个前提策略是合理且准确的，它保证了整体界面构建的性能。

### tree diff
基于策略一，React 对树的算法进行了简洁明了的优化，即对树进行分层比较，两棵树只会对同一层次的节点进行比较。

既然 DOM 节点跨层级的移动操作少到可以忽略不计，针对这一现象，React 通过 updateDepth 对 Virtual DOM 树进行层级控制，只会对相同颜色方框内的 DOM 节点进行比较，即同一个父节点下的所有子节点。当发现节点已经不存在，则该节点及其子节点会被完全删除掉，不会用于进一步的比较。这样只需要对树进行一次遍历，便能完成整个 DOM 树的比较。

### component diff

React 是基于组件构建应用的，对于组件间的比较所采取的策略也是简洁高效。

如果是同一类型的组件，按照原策略继续比较 virtual DOM tree。

如果不是，则将该组件判断为 dirty component，从而替换整个组件下的所有子节点。

对于同一类型的组件，有可能其 Virtual DOM 没有任何变化，如果能够确切的知道这点那可以节省大量的 diff 运算时间，因此 React 允许用户通过 shouldComponentUpdate() 来判断该组件是否需要进行 diff。

### element diff

当节点处于同一层级时，React diff 提供了三种节点操作，分别为：INSERT_MARKUP（插入）、MOVE_EXISTING（移动）和 REMOVE_NODE（删除）。

- INSERT_MARKUP，新的 component 类型不在老集合里， 即是全新的节点，需要对新节点执行插入操作。

- MOVE_EXISTING，在老集合有新 component 类型，且 element 是可更新的类型，generateComponentChildren 已调用 receiveComponent，这种情况下 prevChild=nextChild，就需要做移动操作，可以复用以前的 DOM 节点。

- REMOVE_NODE，老 component 类型，在新集合里也有，但对应的 element 不同则不能直接复用和更新，需要执行删除操作，或者老 component 不在新集合里的，也需要执行删除操作。


react首先对新集合进行遍历，for( name in nextChildren),通过唯一key来判断老集合中是否存在相同的节点，如果没有的话创建，如果有的话，if (preChild === nextChild ) 进行移动操作
### 移动优化

在移动前，会将节点在新集合中的位置和在老集合中lastIndex进行比较，如果if (child._mountIndex < lastIndex) 进行移动操作，否则不进行移动操作。这是一种顺序移动优化。只有在新集合的位置 小于 在老集合中的位置 才进行移动。

如果遍历的过程中，发现在新集合中没有，但是在老集合中的节点，会进行删除操作

所以：element diff 通过唯一key 进行diff 优化。

总结：
1.react中尽量减少跨层级的操作。 2.可以使用shouldComponentUpdate() 来避免react重复渲染。 3.添加唯一key，减少不必要的重渲染

## 参考

https://zhuanlan.zhihu.com/p/20346379

https://segmentfault.com/a/1190000018914249

https://zhuanlan.zhihu.com/p/149972619