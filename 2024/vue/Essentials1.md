# 基础篇（一）

[[toc]]

## 创建应用

### 错误处理

```javascript
app.config.errorHandler = (err) => {
  /* 处理错误 */
}
```

## 模板语法

### 文本插值

```html
<span>Message: {{ msg }}</span>
```

### 拆入 html

```html
<p>Using text interpolation: {{ rawHtml }}</p>
<p>Using v-html directive: <span v-html="rawHtml"></span></p>
```
:::warning
动态渲染 HTML 会造成 XSS 漏洞
:::

### Attribute 绑定 

使用 `v-bind` 做响应式绑定

```html
<div v-bind:id="dynamicId"></div>

<!-- 简写 -->
<div :id="dynamicId"></div>

<!-- 同名简写 (3.4+) -->
<div :id></div>

<!-- 动态绑定 -->
<a :[attributeName]="url"> ... </a>
```

### Javascript 表达式绑定

```html
{{ number + 1 }}

{{ ok ? 'YES' : 'NO' }}

{{ message.split('').reverse().join('') }}

{{ fn(item) }}

<div :id="`list-${id}`"></div>
```

可使用 `app.config.globalProperties` 拓展模板内表达式可访问的全局对象列表

### 指令

- `v-bind`
- `v-on`
- `v-if`
- `v-for` `v-else` `v-else-if`
- `v-model`
- `v-show`
- 指令修饰符
- 自定义指令


![ 指令 ](../img/directives.png)

## 响应式

### 状态声明 ref

```javascript
import { ref } from 'vue'

const count = ref(0)

console.log(count) // { value: 0 }
console.log(count.value) // 0

count.value++
console.log(count.value) // 1

```

在模板中使用 **顶级的** `ref` 时不需要附加 `.value` ，会自动解包

推荐使用单文件组件和组合式 API 来声明响应式状态和方法

```html {1,9}
<script setup>
import { ref } from 'vue'

const count = ref(0)

function increment() {
  count.value++
}
</script>

<template>
  <button @click="increment">
    {{ count }}
  </button>
</template>
```

响应式状态更新后， DOM 会在 "next tick" 异步的更新 DOM，类似于 `React` 的批处理

可手动执行 `nextTick()` 来完成 DOM 更新

```javascript
import { nextTick } from 'vue'

async function increment() {
  count.value++
  await nextTick()
  // 现在 DOM 已经更新了
}
```

### reactive

> 推荐阅读：[ref vs reactive](https://juejin.cn/post/7353087285467873299?searchId=20240902163644FD13B1CEE4E0F216C246)

`ref` `reactive` 对比：
- `ref` 要写 `.value` 获取数据
- `reactive` 不能监听原始数据类型： string， number， boolean
- `reactive` 不能替换整个对象
- `reactive` 不支持结构
- 两者底层都是通过 `Proxy` 做实现，而 `Proxy` 不支持代理原始数据类型
- `ref` 可以监听原始数据类型是因为对数据做了一层封装
  

`ref` 封装原理
- 创建一个对象，包含 `value` 属性，指向原始值 ( 包括原始数据类型 )，这一步 `reactive` 没有
- 用 `Proxy` 创建代理对象，拦截读取以及赋值操作
- 读取和赋值操作都针对 `value` 值
- 返回代理对象

## 计算属性

使用 `computed` 方法做计算缓存，类似于 `React` 的 `useMemo`

**但它能自动收集依赖**

```javascript
<script setup>
import { reactive, computed } from 'vue'

const author = reactive({
  name: 'John Doe',
  books: ['Vue 2 - Advanced Guide',]
})

// 一个计算属性 ref
const publishedBooksMessage = computed(() => {
  return author.books.length > 0 ? 'Yes' : 'No'
})
</script>

<template>
  <p>Has published books:</p>
  <span>{{ publishedBooksMessage }}</span>
</template>
```

## 绑定类与样式

有效示例如下，可直接绑定对象或数组

### 绑定 class

```html
<div
  class="static"
  :class="{ active: isActive, 'text-danger': hasError }"
></div>


<div :class="[activeClass, errorClass]"></div>

<div :class="[{ [activeClass]: isActive }, errorClass]"></div>

```

只有一个根元素的组件，这些 class 会被添加到根元素上并与该元素上已有的 class 合并

如果你的组件有多个根元素，需要通过组件的 `$attrs.class` 属性来指定接收的元素

### 绑定 style

```html
<div :style="{ color: activeColor, fontSize: fontSize + 'px' }"></div>

<div :style="[baseStyles, overridingStyles]"></div>
```

Vue 会在运行时检查兼容性并自动补充样式前缀

当你为一个样式以数组形式提供多个值的时候， vue 会选择浏览器支持的最后一个值

```html
<div :style="{ display: ['-webkit-box', '-ms-flexbox', 'flex'] }"></div>
```

在不需要前缀的浏览器中会选择 `flex`

## 条件渲染

两种条件渲染的方式 `v-if` `v-show`

```html
<div v-if="type === 'A'">
  A
</div>
<div v-else-if="type === 'B'">
  B
</div>
<div v-else-if="type === 'C'">
  C
</div>
<div v-else>
  Not A/B/C
</div>

<h1 v-show="ok">Hello!</h1>
```

区别是 `v-if` 不会保留 dom 元素，而 `v-show` 只是设置了样式 `display:'none'`

`v-if` 可以在 `template` 上使用，而 `v-show` 不可以

## 列表元素

使用 `v-for` 来渲染列表元素

```html
<li v-for="(item, index) in items">
  {{ item.message }}
</li>

<!-- 使用 of 关键词，并进行解构 -->
<div v-for="({ value }, index) of items"></div>

<!-- 遍历对象 -->
<li v-for="(value, key, index) in myObject">
  {{ index }}. {{ key }}: {{ value }}
</li>

<!-- 直接使用范围值， n 从 1 开始而非 0 -->
<span v-for="n in 10">{{ n }}</span>
```

同 React 一样，可以使用 `key` 优化 diff 算法

### `v-for` 和 `v-if`

当它们同时存在于一个节点上时，`v-if` 比 `v-for` 的优先级更高。

这意味着 `v-if` 的条件将无法访问到 `v-for` 作用域内定义的变量别名：

```html
<!--
 这会抛出一个错误，因为属性 todo 此时
 没有在该实例上定义
-->
<li v-for="todo in todos" v-if="!todo.isComplete">
  {{ todo.name }}
</li>

<!-- 正确的做法 -->
<template v-for="todo in todos">
  <li v-if="!todo.isComplete">
    {{ todo.name }}
  </li>
</template>
```

### 数组变化侦测

Vue 能够监听到数组的变异方法触发相关更新：

- push， pop
- shift， unshift
- splice
- sort
- reverse