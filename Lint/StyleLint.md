# [StyleLint](https://stylelint.io/)

## 常见配置

| 名称 |  说明 |
| --- | --- |
| [stylelint-config-standard](https://www.npmjs.com/package/stylelint-config-standard) | 开启常规的一些 rules | 
| [stylelint-config-css-modules](https://www.npmjs.com/package/stylelint-config-css-modules) | 支持 css modules 的语法 |
| [stylelint-config-prettier](https://www.npmjs.com/package/stylelint-config-prettier) | 解决和 prettier 冲突的规则 | 
| [stylelint-declaration-block-no-ignored-properties](https://www.npmjs.com/package/stylelint-declaration-block-no-ignored-properties) | 特定组合下的无效属性 | 


## 参考配置

``` typescript
  "stylelint": "^15.2.0",
  "stylelint-config-css-modules": "4.2.0",
  // "stylelint-config-prettier": "9.0.5",
  "stylelint-config-standard": "30.0.1",
  "stylelint-declaration-block-no-ignored-properties": "2.7.0"
```

``` typescript
  // ..stylelintrc.js
  extends: [
    'stylelint-config-standard',
    'stylelint-config-css-modules',
  ],
  plugins: ['stylelint-declaration-block-no-ignored-properties'],
  ignoreFiles: ['**/*.js', '**/*.jsx', '**/*.tsx', '**/*.ts', '**/dist/**'],
  customSyntax: 'postcss-less',  // 支持 less 的语法
  rules: {
     // import sting or url
    'import-notation': 'string',
    'at-rule-no-unknown': [true, { ignoreAtRules: ['/@*/'] }],
    'function-no-unknown': [true, { ignoreFunctions: ['fade'] }],
    'selector-class-pattern': null, 
    'no-invalid-double-slash-comments': null,
     // a { color: rgb(0 0 0 / 0.2) } or a { color: rgba(12, 122, 231, 0.2) }
    'color-function-notation': 'legacy',
    // 0.5 or 50%
    'alpha-value-notation': 'number',
  },
```
