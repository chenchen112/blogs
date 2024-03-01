# 打包优化

## 树摇（Tree Shaking）

基于 ES6 Module 的静态导入语法，通过 AST(抽象语法树) 判断加载了哪些模块和变量进而删除不关代码减少打包体积

``` typescript
// webpack.config.js

// 开发环境
module.exports = {
  // ...
  mode: 'development',
  optimization: {
    usedExports: true,
  }
};

// 生产环境
module.exports = {
  // ...
  mode: 'production',
};


// package.json

{
  "sideEffects": true,  // 所有文件都有副作用，不可参与树摇
  "sideEffects": false, // 所有文件都可以参与树摇
  "sideEffects": ["**/*.less", "**/*.css"], // 仅匹配文件不可参与树摇
  // ...
}

```


## SplitChunks