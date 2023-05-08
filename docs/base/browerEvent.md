# 浏览器事件机制（冒泡与捕获）

> 捕获、冒泡等基础不做赘述

##### 先简单写一个html 以下案例都以此为基础

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<style>
    div{
        border: 1px solid #eee;
    }
    #parent{
        width: 300px;
        height: 300px;
    }
    #children{
        width: 200px;
        height: 200px;
    }
</style>
<body>
    <div id="parent">parent dom
        <div id="children">children dom</div>
    </div>
    <div id='message'></div>
</body>
<script>
    const message = document.documentElement.querySelector('#message');
    const parent = document.documentElement.querySelector('#parent');
    const children = document.documentElement.querySelector('#children');
    function log(m){
        const dom = document.createElement('div');
        dom.innerHTML = m;
        message.append(dom);
    }
    parent.addEventListener('click', ()=> {
        log('父元素冒泡阶段')
    });

    parent.addEventListener('click', async (e)=> {
        log('父元素捕获阶段')
    }, true);
    
    
    children.addEventListener('click', () => {
        log('子元素元素冒泡阶段')
    })

</script>
</html>
```
### 1、addEventListener 第三个参数
一个 option 对象或一个布尔值 useCapture `addEventListener(type, listener, useCapture | options)`
当为布尔值时 true为捕获阶段执行 false或不传为冒泡阶段执行

当为一个对象时有四个选项
capture:  Boolean，表示 listener 会在该类型的事件捕获阶段传播到该 EventTarget 时触发。
once:  Boolean，表示 listener 在添加之后最多只调用一次。如果是 true， listener 会在其被调用之后自动移除。
passive: Boolean，设置为true时，表示 listener 永远不会调用 preventDefault()。如果 listener 仍然调用了这个函数，客户端将会忽略它并抛出一个控制台警告,默认为false，在 wheel, mousewheel, touchstart 和 touchmove中默认为true,在scroll等调用频繁的事件中设为true有效提升性能
signal:  AbortController的signal属性，当调用其abort方法时取消其监听

```js
// Add an abortable event listener to table
const controller = new AbortController();
const el = document.getElementById("outside");
el.addEventListener("click", modifyText, { signal: controller.signal } );

// Function to change the content of t2
function modifyText() {
  const t2 = document.getElementById("t2");
  if (t2.firstChild.nodeValue === "three") {
    t2.firstChild.nodeValue = "two";
  } else {
    t2.firstChild.nodeValue = "three";
    controller.abort(); // remove listener after value reaches "three"
  }
}
```

### 2、 stopImmediatePropagation 与 stopPropagation
`stopImmediatePropagation`与`stopPropagation`唯一的区别是`stopImmediatePropagation`会立刻阻止自身的其他未执行事件。（首先会先按注册顺序执行，执行到`stopImmediatePropagation`，即不会执行其他事件）
例如：
```js
parent.addEventListener('click', ()=> {
    e.stopPropagation();
    log('父元素捕获阶段')
}, true);

parent.addEventListener('click', async (e)=> {
    log('父元素捕获阶段') // 继续执行
}, true);

```

```js
parent.addEventListener('click', ()=> {
    e.stopImmediatePropagation();
    log('父元素捕获阶段')
}, true);

parent.addEventListener('click', async (e)=> {
    log('父元素捕获阶段') // 不执行
}, true);

```

### 3、捕获阶段阻止冒泡

在捕获阶段只需要执行`e.stopPropagation`即可阻止事件的后续传递（包括子元素的捕获，以及冒泡行为）
```js
parent.addEventListener('click', async (e)=> {
    e.stopPropagation();
    log('父元素捕获阶段')
}, true);
```
在安卓系统中如果触发元素为监听元素，即事件传递最底层，冒泡阶段与捕获阶段谁先注册谁先掉用，所以当冒泡事件先注册，在捕获阶段无法阻止

```js
parent.addEventListener('click', ()=> {
    log('父元素冒泡阶段') // 安卓系统此处先执行，无法被拦截
});
parent.addEventListener('click', async (e)=> {
    e.stopPropagation();
    log('父元素捕获阶段')
}, true);
```

```js

parent.addEventListener('click', async (e)=> {
    e.stopPropagation();
    log('父元素捕获阶段')
}, true);
parent.addEventListener('click', ()=> {
    log('父元素冒泡阶段') // 被拦截，无法执行
});
```

如果因为某些不可控原因，例如vue中的@click在自定义指令中拦截（事件绑定优先于指令bind）
可将事件委托于父元素，以提前拦截

```js
el.parentElement.addEventListener('click',(e) => {
    if (e.target !== el && !el.contains(e.target)) {
        return;
    }
    e.stopImmediatePropagation();
}, true)
```