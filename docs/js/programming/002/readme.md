# js编程题（二）

### 1. 将数组转化为树形结构
```js
var menu_list = [{
    id: '1',
    menu_name: '设置',
    menu_url: 'setting',
    parent_id: 0
   }, {
    id: '1-1',
    menu_name: '权限设置',
    menu_url: 'setting.permission',
    parent_id: '1'
   }, {
    id: '1-1-1',
    menu_name: '用户管理列表',
    menu_url: 'setting.permission.user_list',
    parent_id: '1-1'
   }, {
    id: '1-1-2',
    menu_name: '用户管理新增',
    menu_url: 'setting.permission.user_add',
    parent_id: '1-1'
   }, {
    id: '1-1-3',
    menu_name: '角色管理列表',
    menu_url: 'setting.permission.role_list',
    parent_id: '1-1'
   }, {
    id: '1-2',
    menu_name: '菜单设置',
    menu_url: 'setting.menu',
    parent_id: '1'
   }, {
    id: '1-2-1',
    menu_name: '菜单列表',
    menu_url: 'setting.menu.menu_list',
    parent_id: '1-2'
   }, {
    id: '1-2-2',
    menu_name: '菜单添加',
    menu_url: 'setting.menu.menu_add',
    parent_id: '1-2'
   }, {
    id: '2',
    menu_name: '订单',
    menu_url: 'order',
    parent_id: 0
   }, {
    id: '2-1',
    menu_name: '报单审核',
    menu_url: 'order.orderreview',
    parent_id: '2'
   }, {
    id: '2-2',
    menu_name: '退款管理',
    menu_url: 'order.refundmanagement',
    parent_id: '2'
   }
 ]
```

```js
const buildTree = (arr) => {
  let tmp = {}
  let tree = {}

  arr.forEach((ele) => {
    tmp[ele.id] = ele
  })

  for (let key in tmp) {
    const obj = tmp[key]
    if (obj.parent_id) {
      if (tmp[obj.parent_id].children) {
        tmp[obj.parent_id].children.push(obj)
      } else {
        tmp[obj.parent_id].children = [obj]
      }
    } else {
      // 设置根节点
      tree[obj.id] = obj
    }
  }

  return tree
}
```

### 2. 模拟 lodash.get() 函数

输入：
```
const obj = { selector: { to: { toutiao: "FE Coder"} }, target: [1, 2, { name: 'byted'}]};

get(obj, 'selector.to.toutiao', 'target[0]', 'target[2].name')
 ```
输出：
```
['FE coder', 1, 'byted']
```

```js
function get (obj, ...paths) {
  return paths.map((path) => {
    let tmp = obj
    path.replace(/\[/g, '.')
      .replace(/\]/g, '')
      .split('.')
      .map((p) => tmp = tmp && tmp[p])
    
    return tmp
  })
}

```