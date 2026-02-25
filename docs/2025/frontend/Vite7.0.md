# Vite

## 提出问题

- Vite 是什么，用来做什么
- Vite 解决了什么问题，为什么比同类的好

## 介绍

Vite 版本：7.X

### 开始

Vite 是一种新型的前端构建工具，能够显著提升开发体验，它主要由两部分组成：

- 一个开发服务器，基于原生 ES 模块提供了丰富的内建功能，如模块热替换（HMR）
  - 相比于 Webpack 最大的优势，无需打包，冷启动时间只需要几十毫秒
- 一套构建指令，它使用 Rollup 打包你的代码，并且是预配置的，可以输出用于生产环境的高度优化过的静态资源
  - Rollup 拥有极好的的 tree-shaking 能力

### 理念

#### 精简且可扩展的核心

Vite 的目标不在于满足所有用户的每一个场景，旨在开箱即用地支持构建 Web 应用的最常见的模式。

#### 推动现代 Web 开发

Vite 提供了一系列推动编写现代代码的特定功能，如：

- 源代码必须采用 ESM 形式编写，对于非 ESM 的依赖项，需要经过依赖预构建
- 建议使用 new Worker 语法编写 Web Workers，以遵循现代标准
- 在浏览器环境下，不能直接使用 Node.js 模块

#### 旨在高性能的使用解决方案

致力于性能优化，底层使用了 ESbuild 和 SWC

- ESbuild 是使用 Golang 编写的打包工具和压缩工具，类比于 Webpack，支持并行处理
- SWC 是使用 Rust 编写的编译器，类比于 Babel，提供代码转换的能力如 TS 转 JS，ES6 转 ES5

### 为什么选择 Vite

Vite 能够优化开发体验，能做到这一点的契机是因为浏览器开始原生支持 ES 模块，并且 JavaScript 工具开始大面积使用编译型语言重写。

#### 解决缓慢的服务器启动问题

Vite 将应用中的模块区分为 **源码** 和 **依赖** 两类：

- 依赖：大多时候是三方库，开发时不会变动，会使用 ESbuild 进行依赖预构建，缓存到本地（/node_modules/.vite/）
- 源码：并不是所有的源码都需要同时被加载，如基于路由拆分的代码模块，则可以按需编译

#### 解决缓慢的更新问题

基于打包启动时，当源文件修改后，重新构建整个包是低效的，更新速度会随着应用体积的增加而线性下降。

在 Vite 中，HMR 是在原生 ESM 上执行的。当编辑一个文件时，Vite 只需要精确地使已编辑的模块与其最近的 HMR 边界之间的链失活（大多数时候只是模块本身），使得无论应用大小如何，HMR 始终能保持快速更新。

Vite 同时还会利用 HTTP 头来加速页面的重新加载：

- 源码根据 304 Not Modified 进行协商缓存
- 依赖模块通过 Cache-control 强缓存

#### 为什么生成环境仍需要打包

为什么不直接在服务器上起一个 Vite 服务器？

源码模块数量多，嵌套导入，请求数量倍增，会带来额外的网络往返，生产环境需保证最佳的加载时性能

#### 为什么 Vite 在开发环境中使用 ESbuild 打包，而生产环境使用 Rollup 打包

Vite 目前的插件 API 与使用 ESbuild 作为打包器并不兼容，Rollup 提供了更好的性能与灵活性方面的权衡，为 Vite 的如今繁荣的生态埋下了伏笔

## 指引

### 功能

#### npm 依赖解析和预构建

原生 ES 导入不支持裸模块导入如

```js
import React from 'react';
```

> “裸模块导入”（bare module import）是指在 import 语句中导入一个没有使用相对路径（如 ./、../）或绝对路径（如 /）的模块

浏览器无法处理此类导入，Vite 会检测所有被加载的源文件的裸模块导入，并执行以下操作：

- 预构建：使用 ESBuild 将 CommonJS/UMD 转换为 ESM 格式
- 重写导入为合法的 URL，如 `/node_modules/.vite/deps/my-dep.js?v=f3sf2ebd` 以便浏览器能正确导入

#### 模块热替换

#### TypeScript

Vite 天然支持引入 `.ts` 文件

##### 仅执行转译

Vite 仅执行 `.ts` 文件的转译工作，并不执行任何类型检查，并且假定类型检查已经被你的 IDE 或构建过程处理了。

Vite 之所以不把类型检查作为转换的一部分，是因为这两项工作在本质上是不同的。转译可以在每个文件的基础上进行，与 Vite 的按需编译完全吻合。

相比之下，类型检查需要了解整个模块图，把类型检查塞进 Vite 的转换管道，将不可避免地损害 Vite 的速度优势

Vite 的工作是尽可能将源模块转化可以在浏览器中运行的形式，为此，建议将静态分析检查和 Vite 的转换管道分开，这一原则也适用于其它静态分析检查，如 ESLint

更推荐使用仅含类型的导入导出形式的语法，这类语法编译时更容易被擦除，可以避免潜在的 “仅含类型的导入被不正确打包” 的问题

```js
// good
import type { T } from 'only/types'

export type { T }

// bad
import { SomeType } from 'my-lib';

const x: SomeType = { /* ... */ };

// 编译器会认为你是在运行时导入 SomeType，即使它只是类型。打包工具会尝试去打包 my-lib，但如果它没有实际的运行时代码，就会出错
```

#### HTML

#### 框架支持

Vite 组织维护 Vue 和 React 两大框架的插件，大多数由各自框架团队维护

#### JSX

#### CSS

#### 静态资源

#### JSON

JSON 可以被直接导入，同样支持具名导入：

```js
// 导入整个对象
import json from './example.json'
// 对一个根字段使用具名导入 —— 有效帮助 treeshaking！
import { field } from './example.json'
```

#### Glob 导入

Vite 支持使用特殊的 `import.meta.glob` 函数从文件系统导入多个模块

```js
const modules = import.meta.glob('./dir/*.js')
```

以上导入会被转译成 

```js
// vite 生成的代码
const modules = {
  './dir/bar.js': () => import('./dir/bar.js'),
  './dir/foo.js': () => import('./dir/foo.js')
}
```

由此，你可以遍历 modules 对象的 key 值来访问对应的模块

```js
for (const path in modules) {
  modules[path]().then((mod) => {
    console.log(path, mod)
  })
}
```

匹配到的文件默认是懒加载的，通过动态导入实现，并会在构建时分离为独立的 chunk。

如果你倾向于直接引入所有的模块（例如依赖于这些模块中的副作用首先被应用），你可以传入 { eager: true } 作为第二个参数：

```js
const modules = import.meta.glob('./dir/*.js', { eager: true })
```

以上导入会被转译成 

```js
// vite 生成的代码
// vite 生成的代码
import * as __vite_glob_0_0 from './dir/bar.js'
import * as __vite_glob_0_1 from './dir/foo.js'
const modules = {
  './dir/bar.js': __vite_glob_0_0,
  './dir/foo.js': __vite_glob_0_1
}
```

#### 动态导入

```js
const module = await import(`./dir/${file}.js`)
```

需要注意变量仅代表一层深的文件名，如果 file 是 `foo/bar` 导入将会失败

#### WebAssembly

#### Web Workers

#### 构建优化

##### CSS 

Vite 会自动地将一个异步 chunk 模块中使用到的 CSS 代码抽取出来并为其生成一个单独的文件。

这个 CSS 文件将在该异步 chunk 加载完成时自动通过一个 `<link>` 标签载入，该异步 chunk 会保证只在 CSS 加载完毕后再执行，避免发生 FOUC 。

> FOUC：HTML 先加载完成立马渲染，导致用户先看到一个无样式的界面，随后 CSS 加载完成，页面出现闪烁，最终恢复正常

##### 预加载指令生成

Vite 会为入口 chunk 和它们在打包出的 HTML 中的直接引入自动生成 `<link rel="modulepreload">` 指令

##### 异步 Chunk 加载优化

在实际项目中，Rollup 通常会生成 “共用” chunk —— 被两个或以上的其他 chunk 共享的 chunk。与动态导入相结合，会很容易出现下面这种场景：

- entry --- dynamic import ---> _async chunk A_ --- direct import ---> **common chunk C**
- entry --- dynamic import ---> _async chunk B_ --- direct import ---> **common chunk C**

在无优化的情境下，当异步 chunk A 被导入时，浏览器将必须请求和解析 A，然后它才能弄清楚它也需要共用 chunk C。这会导致额外的网络往返：

```
Entry ---> A ---> C
```

Vite 将使用一个预加载步骤自动重写代码，来分割动态导入调用，以实现当 A 被请求时，C 也将同时被请求：

```
Entry ---> (A + C)
```

C 也可能有更深的导入，在未优化的场景中，这会导致更多的网络往返。

Vite 的优化会跟踪所有的直接导入，无论导入的深度如何，都能够完全消除不必要的往返。

### 命令行接口

### 使用插件

```js
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    {
      ...plugin(),
      enforce: 'pre', // 修改插件调用顺序：Vite 核心插件之前、之后、Vite 构建插件之后
      apply: 'build', // 修改插件应用环境：开发 or 生产
    },
  ],
})

```

### 依赖预构建

当你首次启动 Vite 时，Vite 在本地加载你的站点之前预构建了项目依赖。默认情况下，它是自动且透明地完成的。

这个过程有两个目的：

- CommonJS 和 UMD 兼容性：开发阶段，Vite 需要将所有其他形式的依赖项转换为 ES 模块
  - 支持动态分配的导入，具名导入，裸模块导入

```js
import React, { useState } from 'react'
```

- 性能：为提高后续页面的加载性能，Vite 将那些具有许多内部模块的 ESM 依赖项转换为单个模块。
  - 有些包将它们的 ES 模块构建为许多单独的文件，彼此导入。
  - 例如，lodash-es 有超过 600 个内置模块，当我们执行 `import { debounce } from 'lodash-es'` 时，浏览器同时发出 600 多个 HTTP 请求。（Vite 预构建时没有 tree-shaking）
  - 即使服务器能够轻松处理它们，但大量请求会导致浏览器端的网络拥塞，使页面加载变得明显缓慢。
  - 通过将 lodash-es 预构建成单个模块，现在我们只需要一个 HTTP 请求

#### 自动依赖搜寻

如果没有找到现有的缓存，Vite 会扫描源代码，并自动寻找引入的依赖项，从 node_modules 中解析，并将这些依赖项作为预构建的入口点。

#### Monorepo 和链接依赖

有时候默认的依赖启发式算法（discovery heuristics）可能并不总是理想的。

如果您想要明确地包含或排除依赖项，可以使用 `optimizeDeps` 配置项 来进行设置。

#### 缓存

##### 文件系统缓存

Vite 将预构建的依赖项缓存到 `node_modules/.vite` 中，它会基于以下几个来源决定是否需要重新运行预构建

- 包管理器的锁文件
- 补丁文件夹的修改时间
- vite.config.js 的相关字段
- NODE_ENV 的值

如果出于某些原因你想要强制重新预构建，可以在开发服务器启动时指定 `--force` 选项，或者手动删除 `node_modules/.vite`

##### 浏览器缓存

已经构建的依赖请求使用 HTTP 头 `max-age=312360000，immutable` 进行强缓存。

如果你想通过本地本地编辑来调试依赖项，可以：

- 通过浏览器开发工具的 Network 选项卡暂时禁用缓存
- 重启 Vite 开发服务器指定 `--force` 选项，重新构建依赖项
- 重新载入页面

### 静态资源处理

#### 将资源引入为 URL

引入一个静态资源会返回解析后的公共路径

```js
import imgUrl from './img.png'
document.getElementById('hero-img').src = imgUrl
```

例如，imgUrl 在开发时会是 `/src/img.png`，在生产构建后会是 `/assets/img.xxx.png`。

行为类似于 Webpack 的 file-loader，区别在于导入既可以使用绝对公共路径，也可以使用相对路径

- `url()` 在 CSS 中的引用也已同样的方式处理
  - 通过 `url()` 内联 SVG 时需要用双引号将变量包裹起来
  - `` document.getElementById('hero-img').style.background = `url("${imgUrl}")` ``
- 如果 Vite 使用了 Vue 插件，Vue SFC 模板中的资源引用都将自动转换为导入
- 常见的图像，媒体和字体文件类型被自动检测为资源，可以通过 `assetsInclude` 选项扩展内部列表
- 引用的资源作为构建资源图的一部分包括在内，生成散列文件名，并可以由插件进行处理以进行优化
- 较小的资源，体积小于 `assetsInlineLimit` 会被内联为 base64 data URL
- 默认情况下，TypeScript 不会将静态资源导入视为有效的模块。要解决这个问题，需要添加 `vite/client`

#### 显式 URL 引入

#### 显式内联处理

```js
import imgUrl1 from './img.svg?no-inline'
import imgUrl2 from './img.png?inline'
```

#### 引入为字符串

```js
import shaderString from './shader.glsl?raw'
```

#### 导入脚本作为 Worker

```js
// 在生产构建中将会分离出 chunk
import Worker from './shader.js?worker'
const worker = new Worker()

// sharedworker
import SharedWorker from './shader.js?sharedworker'
const sharedWorker = new SharedWorker()

// 内联为 base64 字符串
import InlineWorker from './shader.js?worker&inline'
```

#### public 目录

如果你有下列资源：

- 不会被源码医用，如 `robots.txt`
- 必须保持原有文件名，不经过 hash
- 并不像引入该资源，只想得到其 URL，如 favicon.ico

那么你可以将该资源放在指定的 public 目录中，它应位于你的项目根目录。

该目录中的资源在开发时能直接通过 / 根路径访问到，并且打包时会被完整复制到目标目录的根目录下

目录默认是 `<root>/public`，但可以通过 `publicDir` 选项 来配置。

请注意，应该始终使用根绝对路径来引入 public 中的资源 —— 举个例子，`public/icon.png` 应该在源码中被引用为 `/icon.png`。

#### new URL(url, import.meta.url)

### 构建生产版本

当需要将应用部署到生产环境时，只需运行 vite build 命令。

默认情况下，它使用 `<root>/index.html` 作为其构建入口点，并生成能够静态部署的应用程序包

#### 浏览器兼容性

默认情况下，生产包假定使用包含在 Baseline 广泛可用目标中的现代浏览器。默认浏览器支持范围是：

- Chrome >=107
- Edge >=107
- Firefox >=104
- Safari >=16

可以通过 `build.target` 配置项指定构建目标，最低支持 `es2015`。

如果设置较低的值，Vite 仍需要以下浏览器的支持范围，因为它依赖于原生 ESM 动态导入和 `import.meta`

默认情况下，Vite 只处理语法转义，不包含任何 **polyfill**。

传统浏览器可以通过 ` @vitejs/plugin-legacy` 来支持，它将自动生成传统版本的 chunk 及与其相对应 ES 语言特性方面的 polyfill，兼容版的 chunk 只会在不支持原生 ESM 的浏览器中按需加载。

#### 公共基础路径

#### 相对基础路径

#### 自定义构建

构建过程可以通过多种 构建配置选项 来自定义构建。具体来说，你可以通过 `build.rollupOptions` 直接调整底层的 Rollup 选项：

```js
export default defineConfig({
  build: {
    rollupOptions: {
      // https://cn.rollupjs.org/configuration-options/
    },
  },
})
```

#### 产物分块策略

你可以通过配置 `build.rollupOptions.output.manualChunks` 来自定义 chunk 分割策略（配置见 Rollup 相应文档）。

#### 处理加载报错

当 Vite 加载动态导入失败时，会触发 `vite:preloadError` 事件。

event.payload 包含原始的导入错误信息。如果调用 `event.preventDefault()`，则不会抛出错误。

```js
window.addEventListener('vite:preloadError', (event) => {
  window.location.reload() // 例如，刷新页面
})
```

#### 文件变化时重新构建

你可以使用 `vite build --watch` 来启用 rollup 的监听器。或者，你可以直接通过 `build.watch` 调整底层的 `WatcherOptions` 选项

```js
export default defineConfig({
  build: {
    watch: {
      // https://cn.rollupjs.org/configuration-options/#watch
    },
  },
})
```

当启用 --watch 标志时，对 `vite.config.js` 的改动，以及任何要打包的文件，都将触发重新构建。

#### 多页面模式

#### 库模式

#### CSS 支持

### 部署静态站点

### 环境变量与模式

Vite 在特殊的 `import.meta.env` 对象下暴露了一些常量。这些常量在开发阶段被定义为全局变量，并在构建阶段被静态替换，以使树摇（tree-shaking）更有效。

```js
if (import.meta.env.DEV) {
  // 这里的代码在生产构建中会被 tree-shaking 优化掉
  console.log('Dev mode')
}
```

#### 内置常量

- `import.meta.env.MODE`: {string} 应用运行的模式。

- `import.meta.env.BASE_URL`: {string} 部署应用时的基本 URL。他由base 配置项决定。

- `import.meta.env.PROD`: {boolean} 应用是否运行在生产环境（使用 NODE_ENV='production' 运行开发服务器或构建应用时使用 NODE_ENV='production' ）。

- `import.meta.env.DEV`: {boolean} 应用是否运行在开发环境 (永远与 import.meta.env.PROD相反)。

- `import.meta.env.SSR`: {boolean} 应用是否运行在 server 上。

#### 环境变量

Vite 自动将环境变量暴露在 `import.meta.env` 对象下，作为字符串。

为了防止意外地将一些环境变量泄漏到客户端，只有以 `VITE_` 为前缀的变量才会暴露给经过 vite 处理的代码。例如下面这些环境变量：

```
VITE_SOME_KEY=123
DB_PASSWORD=foobar
```
只有 `VITE_SOME_KEY` 会被暴露为 `import.meta.env.VITE_SOME_KEY` 提供给客户端源码，而 `DB_PASSWORD` 则不会

```js
console.log(import.meta.env.VITE_SOME_KEY) // "123"
console.log(import.meta.env.DB_PASSWORD) // undefined
```

可以通过 `envPrefix` 配置自定义环境变量的前缀

如上所示，`VITE_SOME_KEY` 是一个数字，但在解析时会返回一个字符串。布尔类型的环境变量也会发生同样的情况。在代码中使用时，需要自行转换为所需的类型。

#### `.env` 文件

Vite 使用 [dotenv](https://github.com/motdotla/dotenv) 从你的环境目录中的下列文件加载额外的环境变量

##### 环境加载优先级

一份用于指定模式的文件（例如 .env.production）会比通用文件的优先级更高（例如 .env）。

Vite 总是会加载 .env 和 .env.local 文件，除此之外还会加载模式特定的 .env.[mode] 文件。

在模式特定文件中声明的变量优先级高于通用文件中的变量，但仅在 .env 或 .env.local 中定义的变量仍然可以在环境中使用。

另外，Vite 执行时已经存在的环境变量有最高的优先级，不会被 .env 类文件覆盖。例如当运行 VITE_SOME_KEY=123 vite build 的时候。

.env 类文件会在 Vite 启动一开始时被加载，而改动会在重启服务器后生效。

#### Typescript 的智能提示

默认情况下，Vite 在 `vite/client.d.ts` 中为 `import.meta.env` 提供了类型定义。

随着在 .env[mode] 文件中自定义了越来越多的环境变量，你可能想要在代码中获取这些以 `VITE_` 为前缀的用户自定义环境变量的 TypeScript 智能提示

要想做到这一点，你可以在 src 目录下创建一个 `vite-env.d.ts` 文件，接着按下面这样增加 `ImportMetaEnv` 的定义

```ts
interface ViteTypeOptions {
  // 添加这行代码，你就可以将 ImportMetaEnv 的类型设为严格模式，
  // 这样就不允许有未知的键值了。
  // strictImportMetaEnv: unknown
}

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  // 更多环境变量...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
```

如果你的代码依赖于浏览器环境的类型，比如 DOM 和 WebWorker，你可以在 `tsconfig.json` 中修改 lib 字段来获取类型支持。

```json
{
  "lib": ["WebWorker"]
}
```

#### HTML 环境变量替换

Vite 还支持在 HTML 文件中替换环境变量。`import.meta.env` 中的任何属性都可以通过特殊的 `%CONST_NAME%` 语法在 HTML 文件中使用：

```html
<h1>Vite is running in %MODE%</h1>
<p>Using data from %VITE_API_URL%</p>
```

#### NODE_ENV 和 mode

- NODE_ENV
  - 是 Node.js 的环境变量
  - 影响运行时行为，如是否启用调试日志，去掉开发工具提示等
- mode
  - 是 Vite 项目中用于区分不同运行环境的构建模式
  - 用以控制 Vite 的行为，如是否启用热更新，是否压缩代码

### 性能

常见性能问题

- 服务器启动慢
- 页面加载慢
- 构建慢

#### 检查浏览器设置

- 关闭浏览器插件或使用无痕模式
- 确保浏览器没有启用 “禁用缓存” 的功能

#### 审核配置的 Vite 插件

- 大型依赖项应动态导入：[perf: lazy load @babel/core](https://github.com/vitejs/vite-plugin-react/pull/212/files)
- `buildStart` `config` `configResolved` 钩子不应运行过长时间
- `resolveId` `load` `transform` 钩子导致一些文件加载速度比其他文件慢

#### 减少解析操作

解析导入路径可能是一项昂贵的操作。

Vite 支持通过 `resolve.extensions` 选项猜测导入路径，该选项默认为 `['.mjs', '.js', '.mts', '.ts', '.jsx', '.tsx', '.json']`

意味着如果不直接声明文件后缀，需要依次检查对应后缀的文件是否存在。

因此，应该尽量减少隐式导入，也可以缩小 `resolve.extensions` 的列表以减少一般的文件系统检查，但必须确保它适用于 node_modules 中的文件。

#### 避免使用桶文件

桶文件（barrel files）是重新导出同一目录下其它 API 的文件，如：

```js
// utils/index.js
export * from './math.js'
export * from './dom.js'
export * from './color.js'

```
当你只导入一个单独的 API，例如 `import { add } from './utils'`，需要获取和转换桶文件内所有的文件，因为他们可能包含副作用

这意味着初始页面加载时，你加载的文件要比所需要的更多。

如果可能的话，你应该尽量避免使用桶文件，直接导入单独的 API，如 `import { add } from './utils/math.js'`

#### 预热常用文件

Vite 开发服务器只转换浏览器请求的文件，所以能快速启动。

但如果某些文件转换时间过长，仍然可能出现请求瀑布。

可以通过 `vite --debug transform` 并检查日志来找到频繁使用的文件

```
vite:transform 28.72ms /@vite/client +1ms
vite:transform 62.95ms /src/components/BigComponent.vue +1ms
vite:transform 102.54ms /src/utils/big-utils.js +1ms
```

Vite 允许预热你确定频繁使用的文件，例如 big-util.js，可以使用 server.warmup 选项，这样，当请求时该文件就已经被准备好并且缓存，以便立即提供服务。

```js
export default defineConfig({
  server: {
    warmup: {
      clientFiles: [
        './src/components/BigComponent.vue',
        './src/utils/big-utils.js',
      ],
    },
  },
})
```

请注意，只应该预热频繁使用的文件，以免在启动时过载 Vite 开发服务器。

使用 `--open` 或 `server.open` 也可以提供性能提升，因为 Vite 将自动预热你的应用的入口起点或被提供的要打开的 URL。

#### 使用更少或更原生化的工具链

保持 Vite 如此之快的关键在于减少源文件（JS/TS/CSS）的工作量。

精简工作的例子：

- 使用 CSS 而不是 Sass/Less/Stylus（可以由 PostCSS 处理嵌套）
- 不要将 SVG 转换为 UI 框架组件（例如 React、Vue 等）。请将其作为字符串或 URL 导入。
- 当使用 @vitejs/plugin-react 时，避免配置 Babel 选项，这样它就会在构建期间跳过转换（只使用 esbuild）

## 总结

- Vite 是什么，用来做什么
  - Vite 是一个现代化的前端开发构建工具
  - 可用于前端开发服务器，可用于打包构建前端项目
- Vite 解决了什么问题，为什么比同类的好
  - 主要解决了开发阶段存在的性能瓶颈
  - 最大的特点就是快，冷启动速度快，热更新速度快，大幅度提升开发者体验和开发效率