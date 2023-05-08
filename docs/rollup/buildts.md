## 手把手教你使用Rollup打包📦并发布自己的工具库

在开发过程当中我们会将工具，组件，插件等独立出来并发布NPM,进行多项目复用

本文将介绍如何使用Rollup这个轻量的下一代模块打包器打造自己的TypeScript工具库

通过阅读本文，你将学到：

1.如何初始化一个Rollup工程项目
2.如何配置Rollup和TypeScript
3.如何编写脚本，构建并发布自己的工具库到npm仓库


一、创建项目初始化GITHUB

做一个开源库的第一步是创建一个Github(或Gitlab等)代码仓库，并进行简单的初始化，主要包括：

1.git init 初始化git
2.yarn init 初始化package.json
3.配置TypeScript tsconfig.json
4.配置Rollup rollup.config.js
5.编写核心代码

 
 
1.1初始化git创建github仓库并提交此处不做赘述

1.2.yarn init 初始化package.json

此处可以简单完善一下pkg文件

```json
{
    "main": "index.js",
    "scripts": {
        "build": "rollup -c",
    },
    "repository": {
        "type": "git",
        "url": "git+https://github.com/wulawa/pulldown-infinity-scroll.git"
    },
    "keywords": [
        "better-scroll plugin",
        "pulldown"
        "rollup", 
        "typescript"
    ],
}
```

1.3. 使用tsc生成tsconfig.json

首先我们需要在全局安装typescript,安装后tsc会自动添加到环境变量

安装后通过tsc -v检查是否安装

安装成功我们可以使用下面命令快速创建tsconfig.json

```bash
tsc --init
```

默认的配置其实已经够用，我们不做修改，后续可以根据需要删减配置。


1.4.配置Rollup rollup.config.js

初始化工程的最后一步就是配置Rollup，先创建一个Rollup配置文件，没有Rollup CLI工具不支持初始化配置文件，只能手动创建：
```bash
touch rollup.config.js
```
然后在rollup.config.js中增加以下内容

```js
import typescript from 'rollup-plugin-typescript2';
export default {
  input: 'src/index.ts', // 打包入口
  output: { // 打包出口
    name:'reverseInfinity',
	file: 'dist/index.js', // 最终打包出来的文件路径和文件名
    format: 'umd', // umd是兼容amd/cjs/iife的通用打包格式，适合浏览器
  },
  plugins: [ // 打包插件
    typescript({
        "include": ["src/plugins/reverseInfinity/**/*.ts"], //如果你只想打包指定文件夹或文件，此处一定要配置，不然会使用tsconfig.json配置，导致ts检测不需要的文件或文件夹
    }), // 解析TypeScript
  ],
  // 指出哪些模块需要被视为外部引入
  external: ['@better-scroll']
};
```
Rollup配置文件每个配置项的具体含义可以参考：https://www.rollupjs.com/guide/big-list-of-options

Rollup可用插件列表可以参考：https://github.com/rollup/plugins

1.5 安装依赖
```bash
yarn add rollup typescript tslib rollup-plugin-typescript2
```
注意tslib这个依赖库也是必需的，因为rollup-plugin-typescript2插件依赖了该库。


### 二、编写核心代码

编写后可以通过以下命令打包

```bash
yarn build
```

将打后的文件随便引入到一个空壳项目中，看能否正常运行
