# 基础篇（二）

[[toc]]

## 事件处理

使用 `v-on` 监听 DOM 事件，可简写为 `@`

事件处理器可以是 **内联事件处理器** 和 **方法事件处理器** 两种

```html
<!-- 内联事件处理器 -->
<button @click="count++">Add 1</button>
<p>Count is: {{ count }}</p>

<!-- 方法事件处理器，函数入参为 event 事件 -->
<button @click="greet">Greet</button>
```

### 事件修饰符

- .stop
- .prevent
- ... ...

```html
<!-- 单击事件将停止传递 -->
<a @click.stop="doThis"></a>

<!-- 提交事件将不再重新加载页面 -->
<form @submit.prevent="onSubmit"></form>

<!-- 修饰语可以使用链式书写，将会按顺序执行 -->
<a @click.stop.prevent="doThat"></a>

<!-- 也可以只有修饰符 -->
<form @submit.prevent></form>

<!-- 仅当 event.target 是元素本身时才会触发事件处理器 -->
<!-- 例如：事件处理器不来自子元素 -->
<div @click.self="doThat">...</div>
```

### 按键修饰符

```html
<!-- 仅在 `key` 为 `Enter` 时调用 `submit` -->
<input @keyup.enter="submit" />
```

Vue 给一些常用按键提供了别名

- .enter
- .tab
- .delete （ Delete + Backspace）
- .esc
- .space
- .up .down .left .right
- .ctrl .alt .shift .meta

:::tip
系统按键修饰符和常规按键不同。与 keyup 事件一起使用时，该按键必须在事件发出时处于按下状态。

换句话说， keyup.ctrl 只会在你仍然按住 ctrl 但松开了另一个键时被触发。若你单独松开 ctrl 键将不会触发
:::

### `.exact` 修饰符

精确控制按键组合

```html
<!-- 当按下 Ctrl 时，即使同时按下 Alt 或 Shift 也会触发 -->
<button @click.ctrl="onClick">A</button>

<!-- 仅当按下 Ctrl 且未按任何其他键时才会触发 -->
<button @click.ctrl.exact="onCtrlClick">A</button>

<!-- 仅当没有按下任何系统按键时触发 -->
<button @click.exact="onClick">A</button>
```

### 鼠标按键修饰符

- .left
- .right
- .middle

## 表单输入绑定

一般情况下需要值绑定配合事件监听器进行状态同步

使用 `v-model` 可以简化这一过程

```html
<input
  :value="text"
  @input="event => text = event.target.value">

<input v-model="text">

<!-- 文本框 -->
<textarea v-model="text"></textarea>

<!-- 复选框 -->
<input type="checkbox" id="checkbox" v-model="checked" />
<label for="checkbox">{{ checked }}</label>

<!-- 单选按钮 -->
<input type="radio" id="one" value="One" v-model="picked" />
<label for="one">One</label>

<!-- 选择器 -->
<select v-model="selected">
  <option disabled value="">Please select one</option>
  <option>A</option>
  <option>B</option>
  <option>C</option>
</select>
```

### 值绑定

```html
<!-- `picked` 在被选择时是字符串 "a" -->
<input type="radio" v-model="picked" value="a" />

<!-- `toggle` 只会为 true 或 false -->
<input type="checkbox" v-model="toggle" />

<!-- `selected` 在第一项被选中时为字符串 "abc" -->
<select v-model="selected">
  <option value="abc">ABC</option>
</select>

<!-- 在复选框中可以通过 `true-value` `false-value` 指定 `toggle` 的值 -->
<input
  type="checkbox"
  v-model="toggle"
  true-value="yes"
  false-value="no" />

<!-- 动态指定 -->
<input
  type="checkbox"
  v-model="toggle"
  :true-value="dynamicTrueValue"
  :false-value="dynamicFalseValue" />
```

### 修饰符

- `.lazy` 将更新状态的时机由 `input` 事件变换到 `change` 事件
  - `input` 事件会在每次输入时触发
  - `change` 事件会在失去焦点时触发
- `.number` 将调用 `parseFloat()` 尝试转换为数字，失败则返回原始值
- `.trim` 去掉两端的空格

## 生命周期

最常用的生命周期钩子时 `onMounted` `onUpdated` `onUnmounted`

![ 生命周期 ](../img/lifecycle.png)

## 侦听器

类似于 React 的 useEffect，监听状态变化

Vue 使用 `watch` 触发回调

```javascript
// 监听单个 ref
watch(value, (cur, prev) => {
  // do something
});

// 监听一个 getter 函数
watch(() => value, (cur, prev) => {
  // do something
})

// 监听多个数据来源
watch(([x, () => y]), (cur, prev) => {
  // do something
})

// 不能直接监听响应式对象的属性值，需要使用一个 getter 函数
const obj = reactive({ count: 0 })

// 错误，因为 watch() 得到的参数是一个 number
watch(obj.count, (count) => {
  console.log(`Count is: ${count}`)
})

// 提供一个 getter 函数
watch(
  () => obj.count,
  (count) => {
    console.log(`Count is: ${count}`)
  }
)
```

### 深层侦听器

直接传个响应式对象给 `watch` ，会隐式的创建一个深层侦听器

如果是传入一个 getter 函数，只有在返回不同对象时，才执行回调

```javascript
const obj = reactive({ count: 0 })

watch(obj, (newValue, oldValue) => {
  // 在嵌套的属性变更时触发
  // 注意：`newValue` 此处和 `oldValue` 是相等的
  // 因为它们是同一个对象！
})

obj.count++

watch(
  () => state.someObject,
  () => {
    // 仅当 state.someObject 被替换时触发
  },
  // 可以通过设置 { deep: true } 强制转换成深层侦听器
  // 但是对于大型数据结构可能导致性能问题
)
```

### 即时回调

`watch` 默认是懒执行，即仅当数据源变换时执行回调

可通过设置 immediate 实现创建侦听器时立即执行

```javascript
watch(
  source,
  (newValue, oldValue) => {
    // 立即执行，且当 `source` 改变时再次执行
  },
  { immediate: true }
)
```

### 一次性侦听器 (3.4+)

只执行一次

```javascript
watch(
  source,
  (newValue, oldValue) => {
    // 当 `source` 变化时，仅触发一次
  },
  { once: true }
)
```

### watchEffect

`watch` 需要仅追踪手动声明的依赖项，支持 `immediate` `once` `deep` `flush` 配置

`watchEffect` 在同步代码执行期间，自动追踪响应式依赖，仅支持 `flush` 配置

```javascript
const todoId = ref(1)
const data = ref(null)

watch(
  todoId,
  async () => {
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/todos/${todoId.value}`
    )
    data.value = await response.json()
  },
  { immediate: true }
)

// 可简化为

watchEffect(async () => {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/todos/${todoId.value}`
  )
  data.value = await response.json()
})
```

### 回调的触发时机

侦听器回调会发生在父组件更新之后，所属组件的 DOM 更新呢之前

默认情况下侦听器会访问所属组件到更新前的 DOM

如果想访问更新后的 DOM 可使用后置侦听器，配置 `{ flush:'post' }`，等同于 `watchPostEffect`

如果想在任何更新之前执行回调，可以使用同步侦听器，配置 `{ flush:'sync' }`，等同于 `watchSyncEffect`

### 停止侦听器

```javascript
const unwatch = watchEffect(() => {})

// ... 当该侦听器不再需要时
unwatch()
```