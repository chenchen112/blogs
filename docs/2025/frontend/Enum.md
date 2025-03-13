# Typescript-Enum 现状

看到有 [ 文章 ](https://blog.disintegrator.dev/posts/ode-to-typescript-enums/) 说 Typescript 官方不推荐使用 Enum 了

## 起因

TypeScript 5.8 带来了 `--erasableSyntaxOnly` 标志，禁用了如枚举和命名空间等语法。

Node.js v23 与 Deno 和 Bun 一起添加了无需构建步骤即可运行 TypeScript 文件的支持。但是有一个限制是仅支持包含可擦除 TypeScript 语法的文件。

由于枚举和命名空间被转换为 JavaScript 对象，因此违反了该规则。

因此， TypeScript 团队可以使用新的编译器标志禁止这些功能，并让人们轻松确保他们的 TS 代码可以直接运行。

## 可擦除语法

可擦除语法就是仅在编译时存在、不影响运行时的语法，例如 type， interface

## 枚举缺陷

社区中主要反映的主要问题是：枚举编译后会生成包含正向（名称→值）和反向（值→名称）映射的对象，增加代码体积

```typescript
enum Direction { Up = 1, Down = 2 }

// 编译后的数字枚举
var Direction;
(function (Direction) {
  Direction[Direction["Up"] = 1] = "Up";
  Direction[Direction["Down"] = 2] = "Down";
})(Direction || (Direction = {}));
```

## 替代方案

### 方案一 🤔

使用联合类型替代 enum

```javascript
type Direction = 'Up' | 'Down'
```

- 优点是定义起来简单
- 缺点是如果发生变动，所有使用的地方都要修改

### 方案二 👍

使用类型字面量和对象断言

```javascript
const Direction = {
  Up:'Up',
  Down:'Down',
} as const

type DIRECTION_TYPE = typeof Direction[keyof typeof Direction]

function sortBy(direction: DIRECTION_TYPE) {
  // do some thing
}

sortBy(Direction.Up)
sortBy('Down')

```

定义相对麻烦，但是可维护性更强

