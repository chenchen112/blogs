# 如何调试本地的 npm 包

场景一：在进行拆包工作中，如何测试拆出来的子包通过依赖的方式引入后能够正常工作？

场景二：项目中依赖的私有组件库出现了 bug，本地修复后如何在项目中测试验证？

## 方式一

比较简单粗暴的方式那就发个版吧，重新 install

缺点是，操作麻烦，效率低，污染 npm 版本线


## 方式二

通过相对或绝对路径引用

```javascript
import { Item } from 'C:/packageA//dist'
```

虽然不用发版了，但是比较危险，万一代码就直接提交了呢，而且 Code Review 时也容易忽略 import


## 方式三

与上述方式二思路类似，直接修改 dependencies

```json
{
  "dependencies": {
    "packageA": "file: 实际包地址 ",
    // "packageA": "link: 实际包地址 "
  }
}
```

也存在上述直接提交的隐患，并且你的 lock 文件通常也会不对劲

## 方式四

相对优雅的一种方式是使用 `npm link`

在 packageA 下执行 `npm link`，首先会进行一次打包，然后将打包产物通过软链接的方式注册到全局的 node_modules

在需要使用的项目内执行 `npm link packageA` 就能直接使用了

可以使用 `npm unlink` 去除软连接

```shell
# packageA
npm link 

# project
npm link packageA

# project
npm unlink projectA

# packageA
npm unlink

```

缺点是每次对于 packageA 的修改都需要重新执行上述命令，重新打包

并且如果组件和应用都使用了同一个依赖，它们会在各自的 node_modules 去查找，如果这个依赖不支持多例，应用就会异常

## 方式五 👍

使用开源项目 [yalc](https://github.com/wclr/yalc) 5.9k ⭐

> Work with yarn/npm packages locally like a boss.
> 
> Better workflow than npm | yarn link for package authors.

它的出现就是为了解决上述 `npm link` 所存在的缺陷

```shell
# 安装方式
npm i yalc -g

# 发布包，在 packageA 中执行
yalc publish

# 添加包，在 project 中执行
yalc add packageA

# 更新包，在 packageA 中执行
npm run build
yalc push

# 移除包，在 project 中执行
yalc remove packageA
```

- 不会移除旧的 packageA 依赖，只是托管到了一个缓存区域，当你执行 remove 时会自动还原
- 如果 packageA 和 project 有同一个依赖，会使用 project 的依赖
- 如果想实现自动 build 后 push ，可以考虑结合 [nodemon](https://github.com/remy/nodemon) 26.5k ⭐
