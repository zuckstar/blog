# Vue3 Diff 算法

## patch

在 Vue update 的过程中，在遍历子代 Vnode 的时候，会用不同的 patch 方法来更新老的 VNode, 如果找到 newVnode 和 oldNode 相对应，就可以复用之前的 oldNode 中已渲染的真实 DOM 节点。避免重复创建元素带来的性能开销。毕竟浏览器创建真实的 DOM，性能代价是昂贵的。

## Vue2 和 Vue3 Diff 对比

### compile 过程

vue2：start => parse(生成 AST) => optimize (遍历 AST ，对每个 AST Element 进行标识 static 和 staticRoot) => generate(根据优化后的 AST，生成对应的可执行函数) => 结束。

vue3: start => baseParse(词法分析，生成 AST) => tranform (遍历 AST，对每一个 AST Element 进行优化，例如文本元素、指令元素、动态元素的转化) => generate (根据转化后的 AST，生成对应的可执行函数)

### parse 和 baseParse

 构建原始抽象语法树(AST), 解析 template 生成原始的 AST, vue3 的语法树比 vue2 多出几个属性，hoists、helpers、codegenNode 等等。

### optimize 和 tranform 

#### tranform

tranformText、tranformElement、

#### 静态节点提升

vue3 对于静态节点在整个生命周期中只会执行【一次创建】，这在一定程度上降低了性能上的开销。

vue3.x 中标记和提升所有的静态节点，diff 的时候只需要对比动态节点内容

### generate


## DIFF过程

元素比较 => 儿子节点比较 => 儿子节点都为数组，同层比较

从头开始比较
从尾开始比较
同序列加挂载
同序列加卸载
### 未知序列对比
- 构建映射表
- 查找原先子节点是否存在可复用的
- 节点移动和复用（最长递增子序列）

## 参考文章

https://zhuanlan.zhihu.com/p/150103393


https://blog.csdn.net/weixin_35625397/article/details/112130142

https://www.6hu.cc/archives/3193.html

https://zhuanlan.zhihu.com/p/150732926?from_voters_page=true

[vue3的diff实现原理](https://zhuanlan.zhihu.com/p/357923422)

[Vue3的getSequence最长上升子序列](https://blog.csdn.net/webyouxuan/article/details/108414286) 