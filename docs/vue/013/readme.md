# 013 v-model 语法糖

## vue2
```html
<input v-model="giveDate" />
```
等同于

```html
<input :value="giveDate" @input="giveDate = $event.target.value" /> 
```

### .sync

父组件代码：

```
<comp :foo.sync="bar" ></comp>
```
等价于, 组件属性名称一致,默认事件update
```
<comp :foo="bar" @update:foo="val => bar = val"></comp>
```

子组件代码：
```js
this.$emit('update:foo', val)
```

## vue3
```html
<ChildComponent v-model = "title" />
```

等同于

```html
<ChildComponent :modelValue = "title" @update:modelValue = "title = $event">
```

在子组件中的写法是:

```js
export default defineComponent({
    name:"ValidateInput",
    props:{
        modelValue:String,   // v-model绑定的属性值
    },
    setup(){
        const updateValue = (e: KeyboardEvent) => {
          context.emit("update:modelValue",targetValue);   // 传递的方法
        }
    }
}
```

### 使用 v-model 的参数

```html
<ChildComponent v-model:title="title"  />
// 或者
<ChildComponent :title="title" @update:title = "title = $event" />
```
那么在子组件中，就可以使用title代替modelValue。

```js
export default defineComponent({
    name:"ChildComponent",
    props:{
        title:String,   // title替代了modelValue
    },
    setup(){
        const updateValue = (e: KeyboardEvent) => {
          context.emit("update:title",targetValue);   // 传递的方法
        }
    }
}
```