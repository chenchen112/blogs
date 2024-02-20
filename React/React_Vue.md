# React 与 Vue

<div style="text-align:center"><img src="@/react_and_vue.png"/></div>

## 对比

| 框架 | React | Vue3 | Vue2 |
| --- | --- | --- | --- |
| 组件写法 | JSX + inline style，可以将 HTML 和 CSS 都写进 JS | template 组件格式，HTML，CSS，JS 分离 |
| 响应原理 |通过 `setState` 方法来更新状态，触发组件的重新渲染 |  使用了 ES6 `Proxy` 对象来拦截对对象的访问操作。Proxy 可以监听到对对象进行的访问、赋值等操作，并在这些操作发生时通知相关依赖以维护响应式系统的更新 | 使用 `Object.definedProperty()` 将每个属性转换为 getter 和 setter，每个Vue组件实例都有一个对应的 watcher 实例，在组件初次渲染的时候会记录组件用到了那些数据，当数据发生改变的时候，会触发 setter 方法，并通知所有依赖这个数据的 watcher 实例调用 update 方法去触发组件的 compile 渲染方法|
| 渲染 | 重新渲染全部子组件 | 数据变化通知依赖项进行精确的驱动渲染 |
| 数据流 | 自上而下单向数据流 | 双向绑定 |
| 生态 | 状态管理，路由控制，脚手架社区方案比较多 | 官方全家桶(实名羡慕) |


## 相同点

- 虚拟 DOM
- 组件化开发
- Diff 算法
- 开发者工具


## 其它

- React 18 的并发模式
- React 的 Hook
- React 闭包
- useMemo 与 memo
- CRA(deprecated)
- Vite
- vuepress