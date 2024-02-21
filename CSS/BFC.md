# BFC

`BFC`（Block Formatting Context），即块级格式化上下文，它是页面中的一块渲染区域，并且有一套属于自己的渲染规则。

## 触发条件

- 根元素，即 HTML 元素
- 浮动元素，float 部位 none
- overflow 不为 visible，为 auto，scroll，hidden
- display 为 inline-block，flex，inline-flex，table，grid...
- position 为 absolute，fixed

## 渲染规则

- BFC 的区域不会与浮动元素重叠
- 计算 BFC 的高度时，浮动元素也参与计算
- BFC 就是页面上的一个隔离的独立容器，容器里面的子元素和外面的元素互不影响，属于 css 世界中的结界
- 块级元素会在垂直方向，一个接一个地放置。垂直方向的距离由 margin 决定。属于同一个 BFC 的两个相邻 Box 的 margin 会发生重叠（避免外边距融合）
  
## 应用范围

- 自适应布局
- 包裹浮动元素时父元素没有高度

## 示例

<div style="text-align:center"><img src="@/BFC.png"/></div>

``` html
  <div class="box">
      <div class="left"></div>
      <div class="right"></div>
  </div>
```

``` css
  .box {
      background: gray;
      overflow:hidden;  // 父容器触发 BFC，浮动元素参与高度计算
  }
  .left {
      width: 200px;
      height: 200px;
      float: left;
      border: 1px solid black;
  }
  .right {
      height: 100px;
      border: 1px solid blue;
      background:red;
      overflow:hidden; // 子元素触发 BFC，不与浮动元素重叠
  }

```

## 盒模型

在 CSS 中我们广泛地使用两种“盒子”——块级盒子（block box）和内联盒子（inline box）。

这两种盒子会在页面流（page flow）和元素之间的关系方面表现出不同的行为：

一个被定义成块级的（block）盒子会表现出以下行为：

- 盒子会在内联的方向上扩展并占据父容器在该方向上的所有可用空间，在绝大数情况下意味着盒子会和父容器一样宽
- 每个盒子都会换行
- width 和 height 属性可以发挥作用
- 内边距（padding）, 外边距（margin）和 边框（border）会将其他元素从当前盒子周围“推开”
- `<h1>` `<p>` `<div>`

如果一个盒子对外显示为 inline，那么他的行为如下：

- 盒子不会产生换行。
- width 和 height 属性将不起作用。
- 垂直方向的内边距、外边距以及边框会被应用但是不会把其他处于 inline 状态的盒子推开。
- 水平方向的内边距、外边距以及边框会被应用且会把其他处于 inline 状态的盒子推开。
- `<a>` `<span>` `<em>` `<strong>`

## box-sizing

- content-box(默认值)：标准盒模型，如果你设置一个元素的宽为 100px，那么这个元素的内容区会有 100px 宽，并且任何边框和内边距的宽度都会被增加到最后绘制出来的元素宽度中。
- border-box：怪异盒模型，width = border + padding + 内容的宽度，同理 height = border + padding + 内容的高度

