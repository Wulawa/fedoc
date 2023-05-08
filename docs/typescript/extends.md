# 类型知识补充


### 类型断言

TypeScript有时无法推断出来一些变量的类型，但是我们可以明确知道，所以有些时候它给了我们一些不确定选项的时候我们可以断言成确定的类型。使用类型断言就可以辅助ts更加明确每个变量的类型。

> TypeScript类型断言不是类型转换，类型转换是在运行阶段，断言是在编译阶段，编译过后断言就不存在了。

举个例子：


```TypeScript
const nums = [110, 120, 119, 112]
// 下面返回的 res ，ts认为可能是number，也可能是undefined
const res = nums.find(i => i > 0)

// 如果下面要对res进行运算，res直接运算就会报错
const square = res * res // 报错，就要断言它为number类型才行
```

#### 方法一：as 关键词
使用as就可以明确num1是一个数字，下面就可以使用数字运算

```TypeScript
const num1 = res as number // 一般用于声明赋值时
```


#### 方法二：尖括号断言
这个尖括号和jsx的标签产生冲突，那种情况不推荐使用

```TypeScript
const num2 = <number>res
if ((<Fish>pet).swim) { // 一般用于使用时
    (<Fish>pet).swim();
}
```

### 类型声明(declare)