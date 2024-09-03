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