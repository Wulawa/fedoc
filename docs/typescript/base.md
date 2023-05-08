# TypeScript 核心概念梳理

### 什么是 TypeScript

- 简单的说 TypeScript 是 JavaScript 一个超集，能够编译成 JavaScript 代码
- 其核心能力是在代码编写过程中提供了类型支持，以及在编译过程中进行类型校验



先说一下 JS 的现状：

在 JS 中的变量本身是没有类型，变量可以接受任意不同类型的值，同时可以访问任意属性，属性不存在无非是返回 `undefined`
JS 也是有类型的，但是 JS 的类型是和值绑定的，是值的类型，用 `typeof` 判断变量类型其实是判断当前值的类型

```TypeScript
	// JavaScript

	var a = 123
	typeof a // "number"
	a = 'sdf'
	typeof a // "string"
	a = { name: 'Tom' }
	a = function () {
	  return true
	}
	a.xxx // undefined
```


TS 做的事情就是给变量加上类型限制

限制在变量赋值的时候必须提供类型匹配的值
限制变量只能访问所绑定的类型中存在的属性和方法

举个简单的例子，如下是一段能够正常执行的 JS 代码：

```TypeScript
	let a = 100
	if (a.length !== undefined) {
	  console.log(a.length)
	} else {
	  console.log('no length')
	}
```

直接用 TS 来重写上面的代码，把变量 a 的类型设置为 number

在 TS 中给变量设置类型的语法是 【 `:Type` 】 类型注解



```TypeScript
let a:number = 100
if (a.length !== undefined) { // error TS2339: Property 'length' does not exist on type 'number'.
  console.log(a.length)
} else {
  console.log('no length')
}
```

但是如果直接对这个 TS 代码进行编译会报错，因为当变量被限制了类型之后，就无法访问该类型中不存在的属性或方法。

那再来写一段能正常执行的 TS


let a: string = 'hello'
console.log(a.length)

编译成 JS 后的代码为

```JavaScript

var a = 'hello'
console.log(a.length)

```

可以发现 : string 这个类型限制编译之后是不存在的，只在编译时进行类型校验。

当 TS 源码最终被编译成 JS 后，是不会产
生任何类型代码的，所以在运行时自然也不存在类型校验。
mp
> 也就是说，假设一个项目，用 TS 来写，哼哧哼哧加上各种类型检验，项目测试通过部署到线上之后,最后运行在客户端的代码和我直接用 JS 来写的代码是一样的，写了很多额外的类型代码，竟然是为了保证能顺利编译成原来的代码




###  TypeScript 的作用


那 TS 的作用究竟是什么呢，主要是以下三点：

1. 将类型系统看作为文档，在代码结构相对复杂的场景中比较适用，本质上就是良好的注释。
2. 配合 IDE，有更好的代码自动补全功能。
3. 配合 IDE，在代码编写的过程中就能进行一些代码校验。例如在一些 if 内部的类型错误，JS 需要执行到了对应代码才能发现错误，而 TS 在写代码的过程中就能发现部分错误，代码交付质量相对高一些，不过对于逻辑错误，TS 当然也是无法识别的。


### TypeScript 类型梳理


分两类来介绍 TS 的类型系统：

1. JS 中现有的值类型在 TS 中对应如何去限制变量
2. TS 中拓展的类型，这些类型同样只在编译时存在，编译之后运行时所赋的值其实也是 JS 现有的值类型


### JS 中现有的值类型如何绑定到变量

- 使用语法：类型注解【 : Type 】


布尔值:

```TypeScript
let isDone: boolean = false
```

数字:

```TypeScript
let age: number = 18
```

字符串:

```TypeScript
let name: string = 'jiangmo'
```

空值:

```TypeScript
function alertName(): void { // 用 : void 来表示函数没有返回值
  alert('My name is Tom')
}
```
null和undefined:

```TypeScript
let u: undefined = undefined
let n: null = null
// 注意：和所有静态类型的语言一样，TS 中不同类型的变量也无法相互赋值
age = isDone // error TS2322: Type 'false' is not assignable to type 'number'.
// 但是因为 undefined 和 null 是所有类型的子类型，所以可以赋值给任意类型的变量
age = n // ok
```

#### [ 类型推论 ]


- 如果没有明确的指定类型，那么 TypeScript 会依照类型推论的规则推断出一个类型


`例如：定义变量的时候同时进行赋值，那么 TS 会自动推断出变量类型，无需类型注解`

```TypeScript
let age = 18
// 等价于
let age: number = 18
// 所以上面代码中的类型声明其实都可以省略
// 但是如果定义的时候没有赋值，不管之后有没有赋值，则这个变量完全不会被类型检查(被推断成了 any 类型)
let x
x = 'seven'
x = 7
// 所以这个时候应该显示的声明类型
let x: number
x = 7
```

### 数组的类型
- 语法是 【 Type[] 】
```TypeScript
let nameList: string[] = ['Tom', 'Jerry']
let ageList: number[] = [5, 6, 20]
```

### 对象的类型

- 接口 (interface) 用于描述对象的类型

```TypeScript
interface Person { // 自定义的类型名称，一般首字母大写
  name: string
  age: number
}
let tom: Person = {
  name: 'Tom',
  age: 25,
}
```
### 函数的类型

- 直接约束出入参类型
```TypeScript
const sum = function (x: number, y: number): number {
  return x + y
}
```
- 单独给 sum 变量设置类型

```TypeScript
const sum: (x: number, y: number) => number = function (x, y) {
  return x + y
}
```

这里如果把函数类型直接提取出来用并起一个自定义的类型名，代码会更美观，也易复用。

利用 类型别名 可以给 TS 类型重命名

#### [ 类型别名 ]

- 类型别名的语法是 【 type 自定义的类型名称 = Type 】

```TypeScript
type MySum = (x: number, y: number) => number
const sum: MySum = function (x, y) {
  return x + y
}
```


用接口定义函数的类型

```TypeScript
interface MySum {
  (a: number, b: number): number
}
const sum: MySum = function (x, y) {
  return x + y
}
```

### 类的类型
和函数类型的语法相似，直接在 ES6 语法中用【 : Type 】类型注解 和 参数注解 语法给类的属性和方法设置类型

```TypeScript
class Animal {
  name: string // 这一行表示声明实例属性 name
  constructor(name: string) {
    this.name = name
  }
  sayHi(): string {
    return `My name is ${this.name}`
  }
}
let a: Animal = new Animal('Jack') // : Animal 约束了变量 a 必须是 Animal 类的实例
console.log(a.sayHi()) // My name is Jack
```
内置对象

JavaScript 中有很多内置对象和工具函数，TS 自带其对应的类型定义

- 很多内置对象可以直接在 TypeScript 中当做定义好了的类型来使用

```TypeScript
let e: Error = new Error('Error occurred')
let d: Date = new Date()
let r: RegExp = /[a-z]/
let body: HTMLElement = document.body
```

### TS 中拓展的类型

#### 任意值 any

#### 交叉类型
交叉类型是将多个类型合并为一个类型
```TypeScript
function extend<T, U>(first: T, second: U): T & U {
    let result = <T & U>{}; // 
    for (let id in first) {
        (<any>result)[id] = (<any>first)[id];
    }
    for (let id in second) {
        if (!result.hasOwnProperty(id)) {
            (<any>result)[id] = (<any>second)[id];
        }
    }
    return result;
}

class Person {
    constructor(public name: string) { }
}
interface Loggable {
    log(): void;
}
class ConsoleLogger implements Loggable {
    log() {
        // ...
    }
}
var jim = extend(new Person("Jim"), new ConsoleLogger()); // jim 既有name又有log方法

var n = jim.name;
jim.log();
```
#### 联合类型

- 类型中的或操作，在列出的类型里满足其中一个即可
```TypeScript
let x: string | number = 1
x = '1'
```


```TypeScript
let x: string | number = 1
x = '1'
x.length // 这里能访问到 length ，因为 TS 能确定此时 x 是 string 类型
// 下面这个例子就会报错
function getLength(something: string | number): number {
  return something.length // error TS2339: Property 'length' does not exist on type 'string | number'.
}
```

两种解决思路

让 TS 能够自行推断出具体类型
```TypeScript
function getLength(something: string | number): number {
  if (typeof something === 'string') { // TS 能识别 typeof 语句
    return something.length // 所以在这个 if 分支里， something 的类型被推断为 string
  } else {
    return 0
  }
}
```
利用 类型断言，手动强制修改现有类型
```TypeScript
function getLength(something: string | number): number {
  return (something as string).length // 不过这样做实际上代码是有问题的，所以用断言的时候要小心
}
```

#### 字符串字面量类型

- 用来约束取值只能是某几个字符串中的一个

```TypeScript
type EventNames = 'click' | 'scroll' | 'mousemove'
function handleEvent(ele: Element, event: EventNames) {
  // do something
}
```

##### 枚举 enum

enum枚举类型里的key不是单纯的string,number这种类型，枚举的 key 是 string literal 类型。这个时候我们可以用keyof来取出枚举里的所有key值作为type。
但直接使用keyof enum获得是enum原型型上的属性，而不是我们声明的，所以需要先转换成type
```ts
enum errMap  {
    PermissionDeniedError = 'NotAllowedError',
    PermissionDismissedError= 'NotAllowedError',
    InvalidStateError= 'NotAllowedError',
    DevicesNotFoundError= 'NotFoundError',
    ConstraintNotSatisfiedError= 'OverconstrainedError',
    TrackStartError= 'NotReadableError',
    MediaDeviceFailedDueToShutdown= 'NotAllowedError',
    MediaDeviceKillSwitchOn= 'NotAllowedError',
    TabCaptureError= 'AbortError',
    ScreenCaptureError= 'AbortError',
    DeviceCaptureError= 'AbortError',
};
function error(error: keyof typeof errMap) {
  const err = errMap[error]
}
```

##### 元组
```TypeScript
let man: [string, number] = ['Tom', 25]
````

### 泛型


##### 函数
- `<T>` 表示声明了一个 类型参数，在定义类型的时候 `T` 就可以作为一个类型来使用

- 类型参数也可以定义多个，比如 `<A, B, C>`.


```TypeScript
function GenericFunc<T>(arg: T): T {
  return arg
}
// 这里的 GenericFunc<number> 是表示的是一个函数值，同时将类型参数 T 赋值为 number
let n = GenericFunc<number>(1) // n 可以通过类型推论得出类型为 :number
// 进一步，利用 泛型约束 ，限制出入参为 number | string
type MyType = number | string
function GenericFunc<T extends MyType>(arg: T): T { // extends MyType 表示类型参数 T 符合 MyType 类型定义的形状
  return arg
}
let s = GenericFunc<string>('qq')
let b = GenericFunc<boolean>(false) // error TS2344: Type 'boolean' does not satisfy the constraint 'string | number'
```

##### 接口

- 用 泛型接口 来定义函数类型

```TypeScript
interface GenericFn<T> {
  (arg: T): T
}
// 定义一个泛型函数作为函数实现
function identity<T>(arg: T): T {
  return arg
}
// 使用泛型时传入一个类型来使 类型参数 变成具体的类型
// <number> 表示 T 此时就是 number 类型，GenericFn<number> 类似是 “函数调用” 并返回了一个具体的类型 (这里是一个函数类型)
const myNumberFn: GenericFn<number> = identity
const myStringFn: GenericFn<string> = identity
let n = myNumberFn(1) // n 可以通过类型推论得出类型为 :number
let s = myStringFn('string') // s 可以通过类型推论得出类型为 :string
```
对比上述的 泛型函数 和 泛型接口，有一个区别：

- 给泛型函数传参之后得到的是一个函数值，而不是类型
```TypeScript
// GenericFunc 是上面定义的泛型函数
type G = GenericFunc<string> // error TS2749: 'GenericFunc' refers to a value, but is being used as a type here.
```

- 而泛型接口传参之后得到的是一个类型，而不是函数值
```TypeScript
// GenericFn 是上面定义的泛型接口
type G = GenericFn<number> // ok
GenericFn<number>() // error TS2693: 'GenericFn' only refers to a type, but is being used as a value here.
```

##### 类

用 泛型类 来定义类的类型

```TypeScript
class GenericClass<T> {
  zeroValue: T
  constructor(a: T) {
    this.zeroValue = a
  }
}
let instance = new GenericClass<number>(1)
// 等价于
let instance: GenericClass<number> = new GenericClass(1)
// 因为有类型推论，所以可以简写成
let instance = new GenericClass(1)
```

内置的数组泛型
```TypeScript
// 数组的类型之前是用 【 Type[] 】 语法来表示的
let list: number[] = [1, 2, 3]
// 现在也可以这么表示
let list: Array<number> = [1, 2, 3]
```

##### 函数重载

- 即函数声明的合并，即函数重载

- TS 中的重载并不是真正意义上的重载，只是在根据不同的实参类型，从上而下挑选出一个具体的函数类型来使用

```TypeScript
function func(x: number): number
function func(x: string): string
function func(x: any): any {
  // 这里定义的函数类型 (x: any): any 会被覆盖失效
  return x.length
}
let n = func(1) // n 可以通过类型推论得出类型为 :number
let s = func('1') // s 可以通过类型推论得出类型为 :string
// 需要注意的是，如上重载之后只剩下两种函数类型，调用时的入参要么是 number 要么是 string，无法传入其他类型的值
let b = func(true) // error
```


##### 接口的合并

- 接口中方法的合并和函数的合并相同，但是 属性的合并要求类型必须唯一


```TypeScript
interface Alarm {
  price: number
  alert(s: string): string
}
interface Alarm {
  weight: number
  alert(s: string, n: number): string
}
// 相当于
interface Alarm {
  price: number
  weight: number
  alert(s: string): string
  alert(s: string, n: number): string
}
```
