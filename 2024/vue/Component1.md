# 深入组件（一）

[[toc]]

## 注册组件

注册组件的方式包括局部注册和全局注册

局部注册即通过显示导入的方式使用组件

全局注册通过 `app.component` 实现，注册后可在任意组件的模板中使用

```js
app
  .component('ComponentA', ComponentA)
  .component('ComponentB', ComponentB)
  .component('ComponentC', ComponentC)
```

全局注册优点是方便，无需在此导入

缺点是组件无法被 **树摇**，并且会使得组件之间的依赖关系混乱

## Props

一些比较特别的写法

```html
<!-- 仅写上 prop 但不传值，会隐式转换为 `true` -->
<BlogPost is-published />
```

```js
const post = {
  id: 1,
  title: 'My Journey with Vue'
}

<BlogPost v-bind="post" />

// 等价于
<BlogPost :id="post.id" :title="post.title" />
```

### 基于类型的 prop/emit 声明

```javascript
const props = defineProps<{
  foo: string
  bar?: number
}>()

const emit = defineEmits<{
  (e: 'change', id: number): void
  (e: 'update', value: string): void
}>()

// 3.3+：另一种更简洁的语法
const emit = defineEmits<{
  change: [id: number] // 具名元组语法
  update: [value: string]
}>()
```