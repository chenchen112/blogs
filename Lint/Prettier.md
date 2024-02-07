# [Prettier](https://prettier.io/docs/en/index.html)

Prettier 插件直接安装即可，无需配置

## 参考配置

```
  "prettier": "^2.8.4",
  "prettier-plugin-packagejson": "2.4.3",
  "prettier-plugin-two-style-order": "1.0.1",
```

```
module.exports = {
  singleQuote: true,
  trailingComma: 'all',
  printWidth: 100,
  proseWrap: 'never',
  endOfLine: 'lf',
  overrides: [
    {
      files: '.prettierrc',
      options: {
        parser: 'json',
      },
    },
    {
      files: 'document.ejs',
      options: {
        parser: 'html',
      },
    },
  ],
};
```

| 名称 |  说明 |
| --- | --- |
| [prettier-plugin-packagejson](https://www.npmjs.com/package/prettier-plugin-packagejson) | 美化 packagejson | 
| [prettier-plugin-two-style-order](https://www.npmjs.com/package/prettier-plugin-two-style-order) | Css 属性排序，包含 postcss，postcss-less，postcss-sorting，由 Umijs 的作者 fork 过来，增加了 postcss 和 postcss-less两个依赖 |
