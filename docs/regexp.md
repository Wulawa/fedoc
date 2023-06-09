# 常用正则


### 16进制颜色

按照规则来

以 `#` 开头
后面紧跟着6个字符或者3个字符作为结尾，这些字符可以是 `a-f` 的小写字母、`A-F`的大写字母、数字
第一句，可以写成 `/^#/`；第二句，`[a-fA-F0-9]` 表示任意的 `a-f`、`A-F`、`0-9`，`6`或 `3`的个数可以用 `{6}`、`{3}`进行表示，那么3个字符就是 `[a-fA-F0-9]{3}`，6个字符就是 `[a-fA-F0-9]{6}`，这两个都有可能，用一个或(`|`)符号来连接：`([a-fA-F0-9]{6}|[a-fA-F0-9]{3})`，最后结尾可以用个 `$`

所有合到一起就是 `/^#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/`


### 链接

目标是匹配出协议、域名、端口号`port`、`path`、`search`

1.协议

合法的协议有 `http`、`https`，还有一个是自适应协议，即不明确加协议，跟当前页面的协议保持一致，所以以下都是合法的：`http://toutiao.com`、`https://toutiao.com`、`//toutiao.com`。这三个协议组成的链接共同点是肯定有 `//` 字符串，在 `//`的前面可能是 `https:` 也可能是 `http:` 也可以没有任何字符串 先按照 `https://` 这种写规则：`^https:\/\/`，其中的 `s` 字符可能有也可能没有，所以使用 `?` 修饰：`^https?:\/\/`，又因为 `https?:`可能没有，所以这个字符串也用 `?`修饰：`^(https?:)?\/\/`

2.域名
域名的前面可能是 `//`，从 `//`往后面匹配，只要没有代表 `:`的 `port`、代表 search 的 `?`、代表 path的 `/`，那么就都属于域名：`[^?:/]+`

3.端口号 port
端口号肯定以 `:` 开头，后面跟着的只要是数字就都属于 port：`:\d+`，由于不一定有端口号，所以用 `?` 修饰：`(:\d+)?`

4.path
肯定以 / 开头，只要不遇到代表 search 的 ?，那么就都属于 path：`\/[^?]*`，由于可能没有 path，所以用 ? 修饰：`(\/[^?]*)?` 

5.search 
肯定以 ? 开头，后面所有的字符都属于 search（不考虑 hash 路由）：`\?(.*)`，由于可能没有 search，所以用 ? 修饰：`(\?.*)?`

最后把上面所有规则合起来就是提取链接的完整正则了，考虑到需要精确提取所需要的部分，所以会对所需要提取的部分加上小括号，结果为：`/^((https?):)?\/\/([^?:/]+)(:(\d+))?(\/[^?]*)?(\?(.*))?/`


### 邮箱

以前在知乎上看到过一段邮箱正则，号称是最符合标准的正则表达式，那条正则的体积好像有几十KB吧，总之很长，现在找不到了，这里只关注常用的邮箱格式，规则：名称允许汉字、字母、数字，下划线，中划线，域名可以有数字、字母、下划线、中划线组成

汉字的范围是 `[\u4e00-\u9fa5]`，字母的范围是 `[a-zA-Z]`，数字的范围是 `[0-9]`，合起来组成邮箱的名称 `^[A-Za-z0-9-_\u4e00-\u9fa5]+`

域名是 `[a-zA-Z0-9_-]+`，域名后缀可以是多级域名 `(\.[a-zA-Z0-9_-]+)+`

上面组合起来就是 `^[A-Za-z0-9-_\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$`


### 手机号

手机号的号段可能是会增加的，所以在实际场景中不建议限制得太死了

本正则按照以下规则编写：

11位数字，以数字 1 开头.

即 `/^1\d{10}$/`



### 数字/货币金额

1.支持负数
负号用 -负号，且必须在第一位，即 ^-，再加个 ? 用于表示这个负号可以有也可以没有，即 `^-? `

2. 支持千分位分隔（没有也没关系） 
如果有千分位，则千分位的后面必然跟着三位数字（否则这个千分号就不应该加了），千分位前面最少一位、最多三位数字，那么可以写成 `\d{1,3},\d{3}`，再精简下，千分位前面的数字其实可以不用限制，因为只要超过三位肯定就有千分位，就会被 `\d{3}`捕获，所以 `\d{1,3}` 换成 \d+就行了，因为符合千分位的可以有多个也可能没有，所以写成 `\d+(,\d{3})*`

3.如果有小数
则小数点后最多两位 小数点就是 `\.`，后面跟着最多两位数字 \d{1,2}，可能有小数也可能没有，所以整体需要再加个 ? 符号，即 `(\.\d{1,2})?`

最终规则 `/^-?\d+(,\d{3})*(\.\d{1,2})?$/`


### 身份证号

这里只看 2代身份证，18位数字 最后一位是校验位,可能为数字或字符X

第一位数字在 `[1-9]` 闭区间内，后面紧跟着5`位任意数字，写成 `^[1-9]\d{5}`

再紧跟着的四位数字代表年份（YYYY），因为目前有身份证的人最早是19世纪最晚21世纪，所以这四个数字中的前两位只看是 18、19、20，即 `(18|19|20)`，后两位则可以是任意数字，即 `\d{2}`

再紧跟着两位数字是月(MM)，月份只可能是 `[1-12]`闭区间，所以可以写成 `(01|02|03|04|05|06|07|08|09|10|11|12)`，前九位的开头都是 0，第二位是 `[1-9]`内的数字，所以简化成 `(0[1-9]|10|11|12)`

再紧跟着两位数字是日(DD)，范围是 `[01-31]`，可以将这31个数字罗列出来，当然也可以精简下，看成是 `[00-09]`、`[10-29]`、`[30-31]`的组合，即 `(0[1-9]|[1-2]\d|30|31)`

再紧跟着三位数字是顺序码，即 `\d{3}`

最后一位是校验码，可以是数字也可以是 X，即`[\dX]`

最终规则 `/^[1-9]\d{5}(18|19|20)\d{2}(0[1-9]|10|11|12)(0[1-9]|[1-2]\d|30|31)\d{3}[\dX]$/`


tips:身份证是有验证规则的,完全可以判断15 | 18数字长度,然后代入验证规则

身份证号 前17位分别和（7－9－10－5－8－4－2－1－6－3－7－9－10－5－8－4－2）相乘后相加，加出来的和除以11，

余数（0－1－2－3－4－5－6－7－8－9－10）对应身份证号第18位（1－0－X－9－8－7－6－5－4－3－2）


### 密码校验

对于 至少1个大写字母 这条规则，这个大写字母的位置是不固定的，只要有就行，如果只有这一条规则的话，正则可以写成 `^\S*[A-Z]+\S*$`，`\S` 匹配任意非空白字符，这个规则即代表大写字母的前面、后面可以跟着任意个（包括0个）非空白字符

但除此之外还需要满足最少1个小写字母，1个数字，1个特殊字符，最少6位，你可以将这几条规则都单独写出正则，然后目标字符串跟这5条正则一一匹配，只要全部能匹配上就是对的，写成 js 代码就是：

```js
function match(s: string) {
  return /^\S*[A-Z]+\S*$/.test(s)
    && /^\S*[a-z]+\S*$/.test(s)
    && /^\S*[0-9]+\S*$/.test(s)
    && /^\S*[!@#$%^&*?]+\S*$/.test(s)
    && /^\S*\S{6,}\S*$/.test(s)
}
```
如果就想在一条正则里实现这些校验呢，也是可以的，需要借助 零宽度正预测先行断言 （(?=exp)），代表 匹配exp前面的位置

有了这个东西，就可以把上面5条规则写到一起去了：`/^\S*(?=\S{6,})(?=\S*\d)(?=\S*[A-Z])(?=\S*[a-z])(?=\S*[!@#$%^&*?])\S*$/`

这条正则前面后面的 `\S*` 还是之前的意思不变，中间是提取了5条规则的个性部分，然后通过 `?=`放在一起了，把规则里所有的 ?=去掉行不行？不行，因为如果去掉的话，首先就有顺序上的冲突了，例如上面的规则，如果把所有的 ?=去掉，就代表着 数字必须在大写字母前面，大写字母必须在小写字母前面，特殊字母必须在小写字母前面（除此之外整个正则也是有问题的）

你可以认为 ?= 在匹配的时候会忽略掉其他的 ?=，只关心自己的前面能不能匹配成功，有多个 ?=，则这多个 ?= 都是只关心自己，忽略其他，但整条正则最后的结果是所有 ?= 匹配结果的并集，计算逻辑和上面的 js 是差不多的


### 提取 HTML 标签数据


要提取的标签字符串类似于`<div class="header-box" name="header">`

只是正则话无法完成，需要借助 js

首先，把标签的属性提取出来

这段标签包含标签开始符号、tag、属性字符串、标签结束符号

开始符号是 <，标签名紧跟着开始符号，且只要没遇到空白符就都是标签名，所以连起来就是 <\w+\s*

在开始符号+标签名，和 结束符号的中间，都是属性，结束符号是 >，所以只要没遇到结束符号 >，就认为是属性字符串，用到了反向选择 `[^>]*\s*>`，合起来就是 `/<\w+\s*[^>]*\s*>/`，为了能捕获属性字符串，加个小括号，即 `/<\w+\s*([^>]*)\s*>/`


```js
const str = `<div class="header-box" name="header">`
const mt = str.match(/<\w+\s*([^>]*)\s*>/)
// properties 即 属性字符串，即 class="header-box" name="header"
const properties = mt[1]
```

`取到了 class="header-box" name="header" 之后，再对其进行处理，观察规律，每个属性的键值对之间肯定存在空白符，不过却不能通过空白符来直接分割，因为属性值是可以存在空白符的，例如 class="a b"

由于可能是自闭合标签，自闭合标签的最后有没有 `/` 都是合法的，例如 `<hr>` 和 `<hr />`都是合法的，所以需要兼容下：`/<\w+\s*([^>]*)\s*\/?>/`


但属性名是可以确定的，它可能是 = 左边不包括空白符的内容，再次用到反向选择，从左往右匹配，反向选择既不是=也不是不是空白符的内容，即 `[^\s=]+`

虽然不确定属性值是否包含空白符，但有个是确定的，即属性值必然被引号包围，所以直接取 `=` 右侧所有引号的内容即可，`=".*?"`

不过还有个问题，引号不仅可以是单引号还可以是双引号，即 `=".*?"` 和 `='.*?'` 都行，如果第一个引号是双引号开头那么对应的第二个引号也必然是双引号，反义单引号亦然，这里需要用到捕获的规则了 `=(["']).*?\1`，\1的意思是这块匹配的内容跟第一捕获组一样，第一捕获组也就是 `["']`，如果第一捕获组匹配的是双引号，那么 `\1` 就代表双引号，否则就代表单引号

至此整个正则为 `[^\s=]+=(["']).*?\1`

不过还有个问题，属性是可以没有属性值的，例如 `<input type="checkbox" checked />`，这里 checked 就是可以不写属性值的，所以再兼容下：`/[^\s=]+(=(["']).*?\2)?/`，又因为希望捕捉属性和属性值，所以给属性和属性值加个小括号：`/([^\s=]+)(=(["'])(.*?)\3)?/`

上面的代表就可以继续写了`


```js
const str = `<div class="header-box" name="header">`
const mt = str.match(/<\w+\s*([^>]*)\s*>/)
// properties 即 属性字符串，即 class="header-box" name="header"
const properties = mt[1]
const mt1 = properties.match(/([^\s=]+)(=(["'])(.*?)\3)?/g)
const obj = {}
if (mt1) {
  mt1.forEach(p => {
    const kv = p.trim().split('=')
    obj[kv[0].trim()] = kv[1].trim().slice(1, -1)
  })
}
```








**持续更新...**