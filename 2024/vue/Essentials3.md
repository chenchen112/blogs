# 基础篇（三）

[[toc]]

## 模板引用

访问模板引用的方式

```html
<!-- 示例一 -->
<script setup>
import { ref, onMounted } from 'vue'

// 声明一个 ref 来存放该元素的引用
// 必须和模板里的 ref 同名
const input = ref(null)
</script>

<template>
  <input ref="input" />
</template>


<!-- 示例二
 在 v-for 中使用模板引用 
 ref 数组与源数组顺序并不一致
 -->
<script setup>
import { ref, onMounted } from 'vue'

const list = ref([
  /* ... */
])

const itemRefs = ref([])
</script>

<template>
  <ul>
    <li v-for="item in list" ref="itemRefs">
      {{ item }}
    </li>
  </ul>
</template>


<!-- 示例三：使用函数绑定，每次更新 / 卸载时都会执行函数，卸载时 el 为 null -->
<input :ref="(el) => { /* 将 el 赋值给一个数据属性或 ref 变量 */ }">


<!-- 示例四：组件 ref-->
<script setup>
import { ref, onMounted } from 'vue'
import Child from './Child.vue'

const child = ref(null)

onMounted(() => {
  // child.value 是 <Child /> 组件的实例
})
</script>

<template>
  <Child ref="child" />
</template>
```

使用模板引用访问子组件时，在选项式 API 中与子组件的 `this` 完全一致

在使用了 `<script setup>` 的组件内，所有属性 **默认私有**，无法直接访问，除非通过 `defineExpose` 宏显示暴露出去

```html
<script setup>
import { ref } from 'vue'

const a = 1
const b = ref(2)

// 像 defineExpose 这样的编译器宏不需要导入
defineExpose({
  a,
  b
})
</script>
```

## 组件基础

一般会将 Vue 组件定义为一个 `.vue` 文件中，称之为单文件组件 —— SFC

```html
<script setup>
import { ref } from 'vue'

const count = ref(0)
</script>

<template>
  <button @click="count++">You clicked me {{ count }} times.</button>
</template>
```
也可以通过导出 js 对象的方式定义组件

```javascript
import { ref } from 'vue'

export default {
  setup() {
    const count = ref(0)
    return { count }
  },
  template: `
    <button @click="count++">
      You clicked me {{ count }} times.
    </button>`
  // 也可以针对一个 DOM 内联模板：
  // template: '#my-template-element'
}
```

### 传递 props

子组件中使用 `defineProps` 声明接受的 props

```html{3}
<!-- BlogPost.vue -->
<script setup>
const props = defineProps(['title'])
</script>

<template>
  <h4>{{ title }}</h4>
</template>

<!-- 父组件传值 -->
<BlogPost
  v-for="post in posts"
  :key="post.id"
  :title="post.title"
 />
```

### 监听事件

子组件通过 `defineEmits` 声明会抛出的事件

```html{3}
<!-- BlogPost.vue -->
<script setup>
const emit = defineEmits(['enlarge-text'])
// emit 等同于模板中的 $emit
</script>

<template>
  <div class="blog-post">
    <h4>{{ title }}</h4>
    <button @click="$emit('enlarge-text')">Enlarge text</button>
  </div>
</template>

<!-- 父组件接收事件 -->
<BlogPost
  ...
  @enlarge-text="handler"
 />
```

### 插槽

子组件使用 `slot` 接收父组件传递的内容

```html{9}
<AlertBox>
  Something bad happened.
</AlertBox>

<!-- AlertBox.vue -->
<template>
  <div class="alert-box">
    <strong>This is an Error for Demo Purposes</strong>
    <slot />
  </div>
</template>

```

### 动态组件

通过 `<component>` 元素配合 `is` attribute 实现动态组件

```html
<!-- currentTab 改变时组件也改变 -->
<component :is="tabs[currentTab]"></component>
```

`:is` 可以是以下几种
- 被注册的组件名
- 导入的组件对象
- 原生 HTML 元素

被切换掉的组件将会被卸载，但可以通过 `<KeepAlive>` 强制保持存活

### DOM 内模板解析

注意事项如下：

- 大小写区分
- 闭合标签
- 元素位置限制