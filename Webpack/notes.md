# 笔记

主要记录踩过的一些坑和一些细节优化，针对 CRA 内嵌的 webpack， 版本为 @4.44.2

- 可以通过 [react-app-rewired](https://www.npmjs.com/package/react-app-rewired)
和[customize-cra](https://www.npmjs.com/package/customize-cra) 这个包来修来修改 CRA 中内嵌的 webpack 配置

- 关闭生产环境的 sourcemap
  ``` typescript
  module.exports = (config) => {
    config.devtool = 'none'
  };
  ```

- `CssMinimizerWebpackPlugin`处理 css 中的注释时，只会移除`//`开头的注释，若要移除`/*xxx*/`中的注释需要额外配置(也可以统一成以`//`开头)
  ```typescript
  module.exports = {
    optimization: {
      minimizer: [
        new CssMinimizerPlugin({
          minimizerOptions: {
            preset: [
              'default',
              {
                discardComments: { removeAll: true },
              },
            ],
          },
        }),
      ],
    },
  };
  ```

- `SplitChunksPlugin`和`MiniCssExtractPlugin`可通过代码分割实现按需加载
- webpack5 以下版本可通过 [work-loader](https://www.npmjs.com/package/worker-loader) 加载 webWorker 模块，但会导致重复打包
- webpack5 可通过以下方式加载 webWorker
  ``` typescript
    // https://github.com/webpack/webpack/issues/6472
  const worker = new Worker(new URL('./offscreen.worker.ts', import.meta.url))
  ```