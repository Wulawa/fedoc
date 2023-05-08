####  Map 的特点
Map 默认情况下不包含任何键，所有键都是自己添加进去的。不同于 Object 原型链上有一些默认的键。
Map 的键可以是任意类型数据，就连函数都可以。
Map 的键值对个数可以轻易通过size属性获取，Object 需要手动计算。
Map 在频繁增删键值对的场景下性能要比 Object 好。
#### 什么时候用 Map
要添加的键值名和 Object 上的默认键值名冲突，又不想改名时，用 Map
需要 String 和 Symbol 以外的数据类型做键值时，用 Map
键值对很多，有需要计算数量时，用 Map
需要频繁增删键值对时，用 Map

#### Map 实例属性和方法

1、set
2、get
3、has
4、delete
5、clear

不做赘述


#### 遍历方法
可以采用for...of循环和forEach两种方法。由于Map实例会维护键值对的插入顺序，因此可以根据插入顺序进行遍历

采用for...of

for...of可以遍历有iterator接口的数据结构
- keys()：返回键名的遍历器
- values()：返回键值的遍历器
- entries()：返回键值对的遍历器
- forEach()：使用回调函数遍历每个成员

map.entries()
在Map实例中有一个迭代器，能以插入顺序生成[key,value]形式的数据。

我们可以通过entries方法来获得这个迭代器，从而利用for...of进行遍历操作

```javascript
for(let [key, value] of map.entries()){

}
```

又因为entries是默认的迭代器，所以可以直接对Map实例使用扩展操作或者直接采用map

```javascript
for(let [key, value] of map){

}
```

#### WeakMap

总所周知，WeakMap是 ES6 中新增的一种集合类型，叫做“弱映射”。它和Map是兄弟关系，与Map的区别就在于这个弱字，API 还是Map的那套（只有set get has delete)

那它真正是什么意思呢？

> 这其实描述的是 JS 中垃圾回收程序对待“弱映射”中键的方式

那为什么要有 WeakMap 呢？它解决了什么问题呢？这些问题后面都会讲到

#### WeakMap 的特性

我们先从 WeakMap 的特性讲起

##### 1. WeakMap 只能将对象作为键名
只接受对象作为键名（null 除外），不接受其他类型的值作为键名


##### 2. WeakMap 的值引用的对象是弱引用

2.1 什么是强引用？
我们先来看看强引用，这是阮一峰老师书上的例子

```javascript
const e1 = document.getElementbyId('a')
const e2 = document.getElementbyId('b')
const arr = [e1, e2];
```

在上面的代码中，e1和e2是两个对象，通过arr数组对这两个对象添加一些文字说明。但是这样就形成了arr对e1和e2的引用，而这种引用又是强引用。它的区别就体现在。当我们不再需要这两个对象时，我们必须手动的删除这个引用，解除arr都两个对象的引用关系，否则垃圾回收机制不会释放e1和e2占用的内存。因为，arr仍然存在着对对象的引用！

2.2 什么是弱引用？

对于弱引用，百度百科给出的答案：

> 在计算机程序设计中，弱引用与强引用相对，是指不能确保其引用的对象不会被垃圾回收器回收的引用。 一个对象若只被弱引用所引用，则被认为是不可访问（或弱可访问）的，并因此可能在任何时刻被回收。

```javascript
const e1 = document.getElementbyId('a')
const e2 = document.getElementbyId('b')
const weak = new WeakMap()
let key = {a: 1}
let value = {b: 2}
weak.set(key, {b: 2})
// => WeakMap {{a: 1} => {b: 2}}

value = null;
console.log(weak)
// => WeakMap {}

```

上面代码首先创建对象`{b:2}`,然后将变量value指向`{b:2}`，此时他们之间形成强引用，然后创建WeakMap，将`value`设置到weak此时他们之间为弱引用,此时与`{b: 2}`形成引用关系的只有`value`,将value指向null后，引用消失`{b: 2}`被垃圾回收,weak中的值消失

值得一提的是WeakMap的key为强引用，即便key被置为null,weak 中的key依然存在，并保持正确饮用


##### 3. 不可遍历
正因为WeakMap对键名所引用的对象是弱引用关系，因此WeakMap内部成员是会却决于垃圾回收机制有没有执行，运行前后成员个数很可能是不一样的，而垃圾回收机制的执行又是不可预测的，因此不可遍历