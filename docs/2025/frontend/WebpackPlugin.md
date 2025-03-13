# Webpack 插件

手写一个 Webpack 插件，实现将 npm 包的名称及版本信息注入到构建产物顶部

```javascript

const path = require("path");
const fs = require("fs");

export class InjectVersionPlugin {
  getPackageSync() {
    try {
      const packagePath = path.resolve(process.cwd(), "package.json");
      const content = fs.readFileSync(packagePath, "utf8");
      return JSON.parse(content);
    } catch (error) {
      throw new Error("Failed to read package.json");
    }
  }

  apply(compiler) {
    let packageInfo;
    try {
      packageInfo = this.getPackageSync();
    } catch (error) {
      // 将错误添加到 Webpack 编译结果
      compiler.hooks.thisCompilation.tap(
        "InjectVersionPlugin",
        (compilation) => {
          compilation.errors.push(error);
        }
      );
      return;
    }

    const { name, version } = packageInfo;
    const banner = `/* ${name}--${version} */\n`;

    compiler.hooks.emit.tapAsync(
      "InjectVersionPlugin",
      (compilation, callback) => {
        try {
          Object.keys(compilation.assets).forEach((filename) => {
            if (filename.endsWith(".js")) {
              const originalSource = compilation.assets[filename].source();
              const newSource = banner + originalSource;
              compilation.assets[filename] = {
                source: () => newSource,
                size: () => newSource.length,
              };
            }
          });
          callback();
        } catch (error) {
          callback(error);
        }
      }
    );
  }
}


```