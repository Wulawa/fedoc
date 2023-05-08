## 安装

以下方法是Vite + Vue模式下的安装方法，其他脚手架与框架的使用同理。

#### 创建项目：
```bash
yarn create vite tailwind --template vue
# npm create vite tailwind --template vue
```


#### 安装初始化tailwindcss
Vite创建的项目默认集成了PostCSS，而TailwindCSS本身就是一个PostCSS插件，所以直接使用即可。

如未安装npx会提示安装tailwindcss，仅执行以下命令即可：

```bash
yarn add tailwindcss postcss autoprefixer -D
# npm install -D tailwindcss postcss autoprefixer

npx tailwindcss init
```

#### 添加配置

添加解析路径，到`tailwind.config.js`文件，此处解析src下vue,js,ts,jsx,tsx文件

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{vue,js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```
创建`postcss.config.js`并且将tailwind添加到配置中
```js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  }
}
```
#### 添加tailwind指令到主css

```css
/* src/style.css */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

#### 准备就绪

现在，你可以开始使用TailwindCSS的语法了：

```vue

<template>
    <h1 class="text-3xl font-bold underline">
      Hello world!
    </h1>
</template>
```

你可能发现页面的两个图片logo换行了，这是tailwindcss的Preflight生效了
```css
@tailwind base; /* Preflight will be injected here */
```
他是基于[modern-normalize](https://github.com/sindresorhus/modern-normalize)实现的。[这里](https://unpkg.com/tailwindcss@3.3.2/src/css/preflight.css)是他的全部样式表

###### 禁用此特性
preflight默认是跟随 @tailwind base 被注入到你的应用中的，很多时候我们有自己的preflight，所以可以将其禁用：

```js
/** @type {import('tailwindcss').Config} */
export default {
  ...
  corePlugins: {
    preflight: false
  },
  ...
}
```

但此处会有个问题:

以下是官方提供的边框写法
```html
<div class="border-t border-gray-200" />
```
结合preflight的全局样式：
```css
* {
    border-width: 0;
    border-style: solid;
}
```
最终实现边框效果，如果我们禁用了preflight，solid将不生效，导致边框样式不会显示
所以，推荐手动加入一些全局样式：

```css
/* src/style.css */
*, *:before, *:after {
  border-width: 0;
  border-style: solid;
}
```

#### 与Preprocessors（Sass, Less, Stylus）一起使用

预处理器在 嵌套语法、变量、常用函数、逻辑处理 等方面相比原生CSS有更大的优势，它可以让编写CSS代码的效率变得更高。

虽然tailwind可以与预处理起一起使用，但还有会有很多的问题，例如`theme()`、 `@apply`、`@tailwind`语法的冲突

而tailwind本身旨在消除样式代码，并且不使用样式预处理器会是构建更高效，接下来我们我们尝试解决不使用预处理器的弊端

###### 1.构建时导入

预处理器提供的最有用的功能之一是能够将 CSS 组织成多个文件，并在构建时通过@import预先处理语句而不是在浏览器中将它们组合起来。

使用 PostCSS 处理这个问题的规范插件是postcss-import。

安装插件：

```bash
yarn add postcss-import -D
```

然后将它添加为 PostCSS 配置中的第一个插件：

```js
module.exports = {
  plugins: {
    'postcss-import': {},
    tailwindcss: {},
    autoprefixer: {},
  }
}
```
需要注意的一件重要事情postcss-import是它严格遵守 CSS 规范，并且不允许@import在文件顶部以外的任何地方使用语句。

###### 2.嵌套语法

要添加对嵌套声明的支持，我们建议使用我们的捆绑tailwindcss/nesting插件，它是一个 PostCSS 插件，它包装了postcss-nested或postcss-nesting并充当兼容层以确保您选择的嵌套插件正确理解 Tailwind 的自定义语法，如@apply和@screen。
它直接包含在tailwindcss包本身中，因此要使用它，您需要做的就是将它添加到您的 PostCSS 配置中，位于 Tailwind 之前的某个位置：

```js
// postcss.config.js
module.exports = {
  plugins: {
    'postcss-import': {},
    'tailwindcss/nesting': {},
    tailwindcss: {},
    autoprefixer: {},
  }
}
```

##### 3.变量
现在 CSS 变量（正式名称为自定义属性）具有非常好的浏览器支持，因此您根本不需要预处理器即可使用变量。
```css
:root {
  --theme-color: #52b3d0;
}

/* ... */

.btn {
  background-color: var(--theme-color);
  /* ... */
}
```

您可能还会发现，您过去使用变量的大部分事情都可以用 Tailwind 的函数代替，这使您可以直接在 CSS 中theme()访问文件中的所有设计标记：tailwind.config.js

```css
.btn {
  background-color: theme('colors.blue.500');
  padding: theme('spacing.2') theme('spacing.4');
  /* ... */
}
```

###### 4.Autoprefixer
在文章最开始我们已经添加Autoprefixer

###### 5.在vue中使用
设置style lang为postcss即可正常运行
```vue
<style scoped lang="postcss">
.wrap{
  span{
    color: red;
  }
}
</style>
```

但这时我们发现虽然语法报错消失了，但语法高亮也消失了

>> 写到这发现需要安装[language-postcss插件](https://marketplace.visualstudio.com/items?itemName=cpylua.language-postcss)但是这个作者已经不维护。MMP,上次更新2020年，用起来好像没啥问题，但我为啥用个过期的插件，这不是应该volar应该要处理的吗，随后作者尝试了svelte,发现出奇的好用，甚至连unused的样式都能识别警告，好了，作者要去看svelte了，vue的小伙伴自行尝试吧，后续的tailwindcss教程，将在svelte的基础来写