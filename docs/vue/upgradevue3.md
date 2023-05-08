# vue2 迁移 vue3攻略



### 1.使用 Vue CLI v4.5 作为 `@vue/cli`

```sh
yarn global add @vue/cli
```

### 2.添加路由

迁移指南：[https://next.router.vuejs.org/zh/guide/migration/index.html](https://next.router.vuejs.org/zh/guide/migration/index.html)

使用方法基本没变，不支持{`template`}

### 3.添加`vuex`

迁移指南：[https://next.vuex.vuejs.org/zh/guide/migrating-to-4-0-from-3-x.html](https://next.vuex.vuejs.org/zh/guide/migrating-to-4-0-from-3-x.html)

  3.1全新的“`useStore`”组合式函数
  ```js
  import { useStore } from 'vuex'

  export default {
    setup () {
      const store = useStore();

      // 在 computed 函数中访问 state
      count: computed(() => store.state.count),

      // 在 computed 函数中访问 getter
      double: computed(() => store.getters.double)

      // 使用 mutation
      increment: () => store.commit('increment'),

      // 使用 action
      asyncIncrement: () => store.dispatch('asyncIncrement')

    }
  }
  ```
 ### 4.添加`elementui`
```sh
	yarn add element-plus
```
	```js
		import ElementPlus from 'element-plus'
		app.use(ElementPlus);
	```

	4.1 按需导入
	需要添加插件
```sh
	yarn add unplugin-vue-components
```
	```js
		// vite.config.ts webpack基本相同
		import Components from 'unplugin-vue-components/vite'
		import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

		export default {
		  plugins: [
		    // ...
		    Components({
		      resolvers: [ElementPlusResolver()],
		    }),
		  ],
		}
	```

### 5.配置修改
5.1 添加别名&省略后缀
```js
// vite.config.ts webpack基本相同
export default defineConfig({
    resolve: {
    alias: [
        { find: '@', replacement: path.resolve(__dirname, 'src') },
    ],
    extensions: ['.mjs', '.js', '.ts', '.jsx','.vue', '.tsx', '.json']
    },
}

```

5.2 环境变量与模式
		Vite 在一个特殊的 `import.meta.env` 对象上暴露环境变量。
		vue-cli是暴露在`process`上

		`.env `文件与vue-cli基本一致，前缀更换为`VITE_`，只有以` VITE_` 为前缀的变量才会暴露给经过 `vite` 处理的代码

5.3 git-hooks

		与vue3无关，直接将config移动新仓库目录下即可，script增加`air install`


### 6.业务迁移

    6.1 eventBus (删除)

    vue3将全移除了 `$on`、`$off` 和` $once` 方法只保留了`$emit`事件用来出发自定义事件

    替代方案：使用第三方的事件库例如 `mitt` 或 `tiny-emitter`。

    例：
    ```js
      // eventBus.js
      import emitter from 'tiny-emitter/instance'

      export default {
        $on: (...args) => emitter.on(...args),
        $once: (...args) => emitter.once(...args),
        $off: (...args) => emitter.off(...args),
        $emit: (...args) => emitter.emit(...args),
      }
    ```
    ```js
      // main.js
      app.config.globalProperties.$EventBus = eventBus;
    ```
    大多数情况下，不鼓励使用全局的事件总线在组件之间进行通信，可以尝试使用`prop`和`事件`、`Provide` 和 `inject` 、`vuex`、`pinia`等


    6.2 移除Vue.set

    vue3使用`proxy`实现双向绑定，可以监听新属性的增加，所以不在需要`Vue.set`

    6.3 plugin

    plugin的使用基本没有变化，同样暴露install即可，回掉参数更改为(app,options)

    例： ws
```js
      export default {
        install: function (app, options) {
          if (app.config.globalProperties.$ws) return;
          app.config.globalProperties.$ws = function (ev, userId) {
            let event = '';
            if (!ev) {
              // ev 传入空字符串清空订阅, 传入false或不传不修改订阅
              event = ev;
            } else {
              event = `${conf.key}-activity:${ev}`;
            }
      
            let url = getWsUrl(userId);
      
            // 传入userId时重新请求，ps: 当用户信息发生改变时，重新调用
      
            return WS.getWs(
              url,
              async (data) => {
                try {
                  return wsDecode({
                    data: data.data,
                    inflate: (data) => strFromU8(inflateSync(new Uint8Array(data))),
                    fetchUrl: conf.wsPullUrl,
                  });
                } catch (error) {
                  return {
                    ev: 'error',
                    data: {},
                  };
                }
              },
              event
            );
          };
        },
      };
```

    6.4 引入cjs
    vite 会把所有模块视为`esm`,当引用`node_modules`包的时候会在构建时进行预构建将`commonjs`和`UMD`转为`esm`,但当我们从本地`cjs`文件导出时，vite不会处理需要手动以下增加以下配置：
    ```js
    // vite.config.js
    optimizeDeps: {
      include: ['@/assets/js/rtc-audio-mixer.js']
    },
    ```

    6.5 serve proxy
使用 [http-proxy](https://github.com/http-party/node-http-proxy#options)
与webpack-devserve 相比，pathRewrite需要替换为rewrite函数

    例：
    
    webpack-devserve：
```js
    pathRewrite: { '^/remote-v1': '' }
```

    vite:
```js    
    rewrite:(path) => path.replace(/^\/remote-v1/, ''),
```
    6.6 v-model

    用于自定义组件时，v-model prop 和事件默认名称已更改：
    prop：`value -> modelValue；`
    事件：`input -> update:modelValue；`


    `.sync`移除 替换`v-model:title`



### 7 打包部署

7.1 `vite.config` 无法使用 环境变量 [https://github.com/vitejs/vite/issues/1930#issuecomment-783747858](https://github.com/vitejs/vite/issues/1930#issuecomment-783747858)










