# pdf 预览

本文记录使用 pdf.js 进行文件预览的过程及踩过的一些坑。

## 安装依赖

```sh
npm install pdfjs-dist
```

### 注意

如果项目使用 vue-cli ，且有打包 pdf 的需求

需要先安装 file-loader 并且 vue-config.js 需增加以下打包配置

```sh
npm install file-loader -D
```

```js
// vue.config.js
chainWebpack: (config) => {
    config.module
        .rule("pdf")
        .test(/\.pdf$/)
        .use("file-loader")
        .loader("file-loader")
        .options({
            name: "[name].[ext]",
        });
},
```

## 引入依赖

引入后报错

```sh
ERROR in ./node_modules/pdfjs-dist/build/pdf.mjs
Module build failed (from ./node_modules/babel-loader/lib/index.js):
SyntaxError: D:\UserData\kuanglong\desktop\code\gitlab\vue-demo\node_modules\pdfjs-dist\build\pdf.mjs: Class private methods are not enabled. Please add `@babel/plugin-transform-private-methods` to your configuration.
```

原因是源码内使用了 class 私有方法的语法， babel 转义时未开启私有方法的支持，需要装对应的插件进行支持

```sh
npm install --save-dev @babel/plugin-transform-private-methods
```

babel 配置更新后如下

```diff
module.exports = {
    presets: ["@vue/cli-plugin-babel/preset"],
+    plugins: ["@babel/plugin-transform-private-methods"],
};

```

还是报错，继续装对应的插件

```sh
@babel/plugin-transform-class-static-block
```

解决上述转义问题后，能正常启动，但是运行时报错

```sh
Uncaught TypeError: Object.defineProperty called on non-object
```

查了一下与 Webpack 的 devtool 配置有关，不能使用 eval 开头的配置：[github issue](https://github.com/wojtekmaj/react-pdf/issues/1813)

将 devtool 配置修改成 `cheap-source-map`

还是有运行时错误。。。

去[社区](https://juejin.cn/post/7506844239373893643)查了一下，发现有人用了比较旧的版本能正常运行，固尝试降低依赖版本。

降低版本至 2.7.570 后能直接使用，无需配置 babel 和 webpack。

## 组件封装

```vue
<template>
    <div class="pdf-viewer" v-loading="loading">
        <div v-if="error" class="fallback">
            <p>加载失败</p>
        </div>
        <div v-else>
            <div v-for="(page, index) in pages" :key="index" class="pdf-page">
                <img :src="page" :alt="'pdf ' + (index + 1)" class="pdf-image" />
            </div>
        </div>
    </div>
</template>

<script>
/**
 * @description 使用 pdfjs-dist 的 2.7.570 版本的 es5 产物
 * @description 该版本的 es5 的 build 产物没有特殊写法，对本项目 webpack、babel的兼容性最好
 */
// eslint-disable-next-line import/no-extraneous-dependencies
import * as pdfjsLib from 'pdfjs-dist/es5/build/pdf';
// eslint-disable-next-line import/no-extraneous-dependencies
import pdfWorker from 'pdfjs-dist/es5/build/pdf.worker.entry';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

/**
 * @description 关闭 eval 支持（防止漏洞）
 * @description 漏洞链接: https://www.venustech.com.cn/new_type/aqtg/20240514/27492.
 */
pdfjsLib.GlobalWorkerOptions.isEvalSupported = false;

export default {
    name: 'PdfViewer',

    props: {
        url: String
    },

    data() {
        return {
            pages: [],
            loading: false,
            error: false
        };
    },

    watch: {
        url: {
            immediate: true,
            handler(newValue) {
                this.loadPdf(newValue);
            }
        }
    },

    methods: {
        reset() {
            this.loading = false;
            this.error = false;
        },

        async loadPdf(url) {
            if (!url) {
                this.reset();
                return;
            }
            try {
                this.loading = true;
                const loadingTask = pdfjsLib.getDocument(url);
                const pdf = await loadingTask.promise;
                const pageImages = [];

                for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
                    // eslint-disable-next-line no-await-in-loop
                    const page = await pdf.getPage(pageNum);
                    const viewport = page.getViewport({ scale: 2 }); // scale 调大可提高清晰度

                    const canvas = document.createElement('canvas');
                    const context = canvas.getContext('2d');
                    canvas.width = viewport.width;
                    canvas.height = viewport.height;

                    // eslint-disable-next-line no-await-in-loop
                    await page.render({ canvasContext: context, viewport }).promise;
                    pageImages.push(canvas.toDataURL());
                }

                this.pages = pageImages;
                this.loading = false;
            } catch (e) {
                console.error('PDF 加载失败:', e);
                this.reset();
            }
        }
    }
};
</script>

<style scoped>
.pdf-viewer {
    width: 100%;
    height: 100%;
    max-height: 100%;
    overflow: auto;
}

.pdf-image {
    width: 100%;
    display: block;
    object-fit: contain;
}

.fallback {
    text-align: center;
    color: #999;
    font-size: 14px;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>

```