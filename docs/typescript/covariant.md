# 函数的双向协变

#### 首先“协变”是啥


一般有以下三种情况（以数组为例）：

协变（Covariant）：`Student[]` 同时也是 `Person[]`，即 `Person[] arr = new Student[]` 成立，与条件 V 的兼容性一致。
逆变（Contravariant），`Person[]` 同时也是 `Student[]`，即 `Student[] arr = new Person[]` 成立，与条件 V 的兼容性相反。
不变（Invariant），既不是协变也不是逆变，即 `Student[]` 和 `Person[]` 没有关系。除非你强转，否则你不能直接把一个类型的变量赋值给另一个类型的变量。
简记就是：协变多变少，逆变少变多（子类型是父类型的扩展，所以理论上子类型的属性比父类型要多）。



上面是以数组为例，还有很多变体的存在，比如泛型（TS 里数组就是泛型的，但大部分 OOP 语言不是这样）`Foo<Student>` 和 `Foo<Parent>` 是否可以互转；再比如函数 `(e: Student) => void` 和 `(e: Parent) => void` 是否可以互转；等等等等。

那什么叫“双向协变（Bivariant）”呢？其实就是协变 + 逆变都成立。



```TypeScript
class Person {
    name!: string;

    constructor(name: string) {
        this.name = name;
    }
}

class Student extends Person {
    school!: string;

    constructor(name: string, school: string) {
        super(name);
        this.school = school;
    }
}

let obj1: Person = new Student('foo1', 'foo2'); // 子类型对象赋值给父类型对象，即多变少，允许
let obj2: Student = new Person('foo1'); // 父类型对象赋值给子类型对象，即少变多，不允许


let arr1: Person[] = [] as Student[]; // A
let arr2: Student[] = [] as Person[]; // B
// 如果 A 成立，这个变体就是协变的；你会发现它的赋值顺序跟上面允许的那个顺序是一致的
// 如果 B 成立，这个变体就是逆变的；你会发现它的赋值顺序跟上面不允许的那个顺序是一致的，或者说跟允许的那个顺序是相反的，所以叫“逆”
// 如果上述都不成立，这个变体就是不变的
// 如果上述都成立，这个变体就是双向协变的
// 当然了，最后我们知道，在 TS 里数组是协变的

```