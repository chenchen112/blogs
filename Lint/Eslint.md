# [Eslint](https://eslint.org/docs/latest/rules/)
> 2023-04-07

## [config](https://zh-hans.eslint.org/docs/latest/use/configure)

- **extends**  
  配置选项，最终结果会将派生配置合并到基础配置的结果，可以省略配置名称中的 `eslint-config-` 前缀。如 `airbnb-base` 会被解析为 `eslint-config-airbnb-base`。配置文件使用扩展后，就可以继承另一个配置文件的所有特征（包括规则、插件和语言选项）并修改所有选项

  ``` typescript
    // extends 将继承 airbnb-base 所有配置，如下：
    extends: ['airbnb-base']

    // packages/eslint-config-airbnb-base/index.js
    module.exports = {
      extends: ['./rules/imports',... ...].map(require.resolve),
      parserOptions: {
        ecmaVersion: 2018,
        sourceType: 'module',
      },
      rules: {... ...},
    };
  ```

- **plugins**  
  插件选项，为 ESLint 添加各种扩展功能的包，可以省略包名中的 `eslint-plugin-` 前缀。一个插件可以添加新的规则和导出可共享的配置，`extends` 的使用顺序有关系，顺序靠后的将会对已定义的配置产生影响，`plugin` 的声明顺序无关

  ``` typescript
    // 仅添加新的 rule 的定义，并不开启或禁用
    plugins: ["react"],  
    
    // 继承 jest 插件中导出的 recommended 配置
    extends: ['plugin:jest/recommended'],
    plugins: ['jest'],
    
    
    // eslint-plugin-jest/index.js
    export = {
      configs: {
        all: createConfig(allRules),
        recommended: createConfig(recommendedRules),
        style: createConfig({
          'jest/no-alias-methods': 'warn',
          'jest/prefer-to-be': 'error',
          'jest/prefer-to-contain': 'error',
          'jest/prefer-to-have-length': 'error',
        }),
      },
      rules: {... ...},
    };

  ```

- **rules**  
  - "off" or 0 - turn the rule off
  - "warn" or 1 - turn the rule on as a warning
  - "error" or 2 - turn the rule on as an error
  - 需要增加配置选项时，如：
    ``` typescript
    "max-lines": ["error", { "max": 200, "skipBlankLines": true, "skipComments": true }]
    "quotes": ["error", "single", "avoid-escape"]
    ```
- overrides：可用作针对某些文件覆盖通用配置
  
- root，env，parseOptions，globals...

## 级联

配置级联的工作是基于被检测的文件的位置。如果有一个`.eslintrc`文件与被检测的文件在同一目录下，那么该配置将被优先考虑。然后 ESLint 沿着目录结构向上搜索，合并沿途发现的任何`.eslintrc`文件，直到到达`root: true`的`.eslintrc`文件或根目录。
同样，如果根目录下有`package.json`文件，而其中又有`eslintConfig`字段，它所描述的配置将适用于它下面的所有子目录，但 packageA 目录下的`.eslintrc`文件所描述的配置将在有冲突的规范时覆盖它。
如果在同一目录下有`.eslintrc`和`package.json`文件`.eslintrc`将优先使用，`package.json`文件将不被使用。

## 插件列表

| 名称 | 关键词 | 说明 |
| --- | --- | --- |
| [eslint-config-prettier](https://www.npmjs.com/package/eslint-config-prettier) | 解决和 prettier 的冲突 | 需要将 prettier 放在 extends 的最后一位 |
| [eslint-plugin-import](https://www.npmjs.com/package/eslint-plugin-import) | import | 如 import 的顺序 | 
| [eslint-plugin-react](https://www.npmjs.com/package/eslint-plugin-react) | react | 需要使用 plugin:react/jsx-runtime 兼容 jsx 的新语法 |
| [eslint-plugin-react-hooks](https://www.npmjs.com/package/eslint-plugin-react-hooks) | react-hooks | Hook 的使用和声明 |
| [eslint-plugin-jsx-a11y](https://www.npmjs.com/package/eslint-plugin-jsx-a11y) | Jsx 无障碍 | 如 button 必须写 ‘type’ ，img 必须写 ‘alt’ | 
| [eslint-plugin-jest](https://www.npmjs.com/package/eslint-plugin-jest) | jest | 测试文件格式 |
| [eslint-plugin-unicorn](https://www.npmjs.com/package/eslint-plugin-unicorn) | powerful ESLint rules | "严格"，如文件命名，Array.find/some/include... 的使用 | 
| [eslint-formatter-pretty](https://www.npmjs.com/package/eslint-formatter-pretty)| 提供一个 formatter 的命令 | 给 eslint 命令提供 --format=pretty 配置 | 

## 常见配置

| 名称 | 关键词 | plugin | extend | 说明 |
| --- | --- | --- | --- | --- |
| [eslint-config-airbnb-base](https://www.npmjs.com/package/eslint-config-airbnb-base) | JavaScript | eslint-plugin-import | --- | 基础的 eslint 规则 |
| [eslint-config-airbnb](https://www.npmjs.com/package/eslint-config-airbnb) | React | eslint-plugin-react，eslint-plugin-jsx-a11y，eslint-plugin-react-hooks | eslint-config-airbnb-base | 在 base 的基础上新增 react 相关配置，虽然内置了 hook 的 plugin 但是并没有使用，需要自己单独声明 'airbnb/hooks' |
| [eslint-config-airbnb-typescript](https://www.npmjs.com/package/eslint-config-airbnb-typescript) | Typescript | [@typescript-eslint/eslint-plugin](https://www.npmjs.com/package/@typescript-eslint/eslint-plugin) | eslint-config-airbnb-base | 内部已配合 @typescript-eslint/parser 使用 |

## 参考配置

``` typescript
  // package.json
  "@typescript-eslint/eslint-plugin": "5.54.1",
  "@typescript-eslint/parser": "5.54.1",
  "eslint": "^7.32.0",  // react-scripts 的原因版本不能写到 8
  "eslint-config-airbnb": "^19.0.4",
  "eslint-config-airbnb-typescript": "^17.0.0",
  "eslint-config-prettier": "^8.7.0",
  "eslint-formatter-pretty": "4.1.0",
  "eslint-plugin-import": "2.27.5",
  "eslint-plugin-jest": "27.2.1",
  "eslint-plugin-jsx-a11y": "6.7.1",
  "eslint-plugin-react": "7.32.2",
  "eslint-plugin-react-hooks": "4.6.0",
  "eslint-plugin-unicorn": "40.0.0",
```

``` typescript
  // .eslintrc
  module.exports = {
    extends: [
      'airbnb',
      'airbnb/hooks',
      'airbnb-typescript',
      'plugin:react/jsx-runtime',
      'plugin:jest/recommended',
      'prettier',
    ],
    plugins: ['jest', 'unicorn'],
    parserOptions: { project: './tsconfig.json' },
    rules: {
      // https://eslint.org/docs/latest/
      'object-curly-newline': 0,
      'class-methods-use-this': 0,
      'no-param-reassign': [2, { props: false }],
      'operator-linebreak': 0,
      'no-restricted-syntax': 0,
      'no-continue': 0,
      'no-console': 1,
      'no-debugger': 1,
      'consistent-return': 1,
      'max-len': [
        1,
        {
          code: 100,
          ignoreComments: true,
          ignoreStrings: true,
          ignoreRegExpLiterals: true,
          ignoreTemplateLiterals: true,
        },
      ],
      'arrow-spacing': 1,
      'no-multiple-empty-lines': 1,
      'arrow-body-style': 1,

      // https://typescript-eslint.io/rules
      '@typescript-eslint/consistent-type-imports': [1, { prefer: 'type-imports' }],
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 1,

      // https://github.com/jsx-eslint/eslint-plugin-react
      'react/function-component-definition': 0,
      'react/require-default-props': 0,
      'react/jsx-props-no-spreading': 0,
      'react/destructuring-assignment': 0,
      'react/jsx-no-useless-fragment': [1, { allowExpressions: true }],
      'react/no-unused-prop-types': 0,
      'react/jsx-indent-props': 1,
      'react/jsx-closing-bracket-location': 1,
      'react/no-unstable-nested-components': [2, { allowAsProps: true }],
      'react/jsx-boolean-value': 1,
      'react/jsx-key': 1,

      // https://github.com/import-js/eslint-plugin-import
      'import/extensions': 0,
      'import/no-extraneous-dependencies': 1,
      'import/prefer-default-export': 1,
      'import/consistent-type-specifier-style': [1, 'prefer-top-level'],
      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', ['parent', 'sibling', 'index']],
          pathGroups: [
            {
              pattern: 'react*',
              group: 'external',
              position: 'before',
            },
            { pattern: '@/**', group: 'internal' },
          ],
          pathGroupsExcludedImportTypes: ['builtin'],
          'newlines-between': 'always',
          alphabetize: {
            order: 'asc' /* sort in ascending order. Options: ['ignore', 'asc', 'desc'] */,
            orderImportKind: 'asc',
            caseInsensitive: true /* ignore case. Options: [true, false] */,
          },
          warnOnUnassignedImports: true,
        },
      ],

      // https://github.com/jsx-eslint/eslint-plugin-jsx-a11y#readme
      'jsx-a11y/click-events-have-key-events': 0,
      'jsx-a11y/mouse-events-have-key-events': 0,
      'jsx-a11y/no-static-element-interactions': 0,
      'jsx-a11y/anchor-is-valid': 0,

      // https://github.com/sindresorhus/eslint-plugin-unicorn
      'unicorn/prefer-array-flat-map': 1,
      'unicorn/prefer-dom-node-append': 1,
      'unicorn/better-regex': 1,
      'unicorn/prefer-array-some': 1,
      'unicorn/prefer-date-now': 1,
      'unicorn/no-useless-fallback-in-spread': 1,
      'unicorn/require-array-join-separator': 1,
      'unicorn/new-for-builtins': 1,
      'unicorn/prefer-regexp-test': 1,
      // 'unicorn/prefer-array-index-of': 1,
      // 'unicorn/prefer-includes': 1,

      'import/no-unresolved': [2, { ignore: ['@'] }],
      'no-restricted-imports': ['error', { patterns: ['*/dist'] }],
      'no-unused-expressions': 'off',
      '@typescript-eslint/no-unused-expressions': 'error',
      'max-classes-per-file': ['error', 3],
      '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
      'lines-between-class-members': ['error', 'always'],
      '@typescript-eslint/no-invalid-this': 0,
    },
  };

```