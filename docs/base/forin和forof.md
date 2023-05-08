### for in

1.可枚举性决定了这个属性能否被for in 遍历到。
2.遍历的得到的index并不是一个数字,而是一个string,可能无意进行字符串计算,这给编程带来不便。
3.作用于数组的for-in循环除了遍历数组元素以外,还会遍历自定义属性,举个例子,如果你的数组中有一个可枚举的类型a.name,那么循环将额外执行一次,遍历到名为name的索引,甚至数组原型链上的属性都能被访问到，此时如果你不希望得到他们，就应该结在for-in循环的时候添加 hasOwnProperty()方法来过滤掉非自有属性。在某些源码里面会看到。（下面有代码演示）
4. 这段代码可能按照 随机顺序遍历数组

5.for-in 这个代码是为普通对象设计的,不适用于数组的遍历

```js
var a = ["a", "b", "c"];
for(var index in a){
//   console.log(a[index]);
  console.log(typeof index);  //string
}

//关于3的测试 用for in 遍历数组。

var b = new Array(1,2,3,4)    //创建一个数组
b.name = '小明'               //给数组添加一个属性
Array.prototype.age = 12      //给数组的原型也添加一个属性 
for(let key in b){
  console.log(key)
}

//output 
0
1
2
3
name
age

//同样用for of 遍历结果如下
for(let value of b){
  console.log(value)
}
//output
1
2
3
4
```


### for of

1.for of 就遍历数组去吧，
2.遍历对象还的借助Object.keys() 还不如直接for in

#### 区别

1.推荐在遍历对象的时候使用for in ,在遍历数组的时候使用for of 。
2.for in 循环出的是key（并且key的类型是string）,for of 循环出的是value。
3.for of 是es6引新引入的特性，修复了es5引入的for in 的不足。
4.for of 不能循环普通的对象，需要通过Object.keys搭配使用。


### 总结： * 最根本的区别for in 遍历可枚举属性，for of 遍历迭代器（iterator）

扩展：

#### 可枚举属性与不可枚举属性

在JavaScript中，对象的属性分为可枚举和不可枚举之分，它们是由属性的enumerable值决定的。可枚举性决定了这个属性能否被for…in查找遍历到。

##### 一、怎么判断对象属性是否可枚举

js 中的基本包装类型的原型属性是不可枚举的，如Object,Array,Number等，如果对以上包装类型的实例进行for in什么也没有
```js
propertyIsEnumerable() 方法返回一个布尔值，表示指定的属性是否可枚举。
obj.propertyIsEnumerable(prop)
console.log(num.propertyIsEnumerable('valueOf'));   // false
```

需要注意的是：如果判断的属性存在于Object对象的原型内，不管它是否可枚举都会返回false


##### 二、枚举的作用？

属性的枚举性会影响以下三个函数的结果

for in （不可枚举的属性不会被遍历出来）
Object.keys（只返回对象本身具有的可枚举的属性）
JSON.stringify() （此方法也只读取对象本身可枚举属性，并序列化为JSON字符串）
Object.assign() （此方法也是复制自身可枚举的属性，进行浅拷贝）


#### 迭代器


#### 为何object没有迭代器