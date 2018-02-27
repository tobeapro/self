## javascript对象属性及原型链的一些思考总结

### 一、js对象
> 首先看下[MDN的说明](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Data_structures)

##### 最新的 ECMAScript 标准定义了 7 种数据类型,分别是

`Boolean`,` Null`,`Undefined`,` String`,`Symbol`(ES6新定义，暂时不深入),`Objcet`
##### 数值类型有5种基本类型,分别是

`string`,` number`,`boolean`,`null`,`undefined`

#### 1.1 typeof
##### `typeof`操作符返回一个字符串，指示未经计算的操作数的类型。
```javascript
typeof 3 // "number"
typeof 'abc' // "string"
typeof a // "undefined"
typeof true // "boolean"
typeof {} // "object"
typeof function(){} // "function"
typeof Symbol() // "symbol"
// 其他特殊注意的情况
typeof null // "object"
typeof NaN // "number"
typeof [] // "object"
typeof Date // "function",内置的几个对象Date、Array、RegExp等均为"function"
```
#### 1.2 instanceof
##### `instanceof`运算符用来测试一个对象在其原型链中是否存在一个构造函数的 `prototype`属性。
```javascript
//语法如下
object instanceof constructor // object为要检测的对象，constructor为某个构造函数
```
#####  描述
`instanceof` 运算符用来检测 `constructor.prototype` 是否存在于参数`object`的原型链上

### 二、原型链
首先要分清`构造函数`,`实例对象`,`原型对象`的关系
```javascript
//声明一个函数及实例
function D(){}
var d = new D()
```
D就是一个函数，而d是他的一个实例。这里D就是构造函数，而d就是一个实例对象。d有一个`constructor`属性指向他的构造函数D,及`d.constructor===D`
这是在看看构造函数的原型对象(只有函数才有原型对象)
```javascript
console.log(D.prototype)
// Object {
//	constructor: D()
//  __proto__: Object
// } 
```
可以看到构造函数的原型对象上有个属性`constructor`指向D,实际上d上的`constructor`就是这样继承过来的,另外一个`__proto__`属性指向对象原型对象.

##### 大致是这样的关系
![prototype](https://tobeapro.github.io/img/prototype.png)
##### 还有一张经典的图
![prototype](https://tobeapro.github.io/img/prototype2.png)
##### 小结：

每个构造函数都有一个原型对象，原型对象都包含一个指向构造函数想指针`constructor`，而实例对象都包含一个指向原型对象的内部指针`__proto__`。

### 三、思考总结
介绍了js的对象和原型链的一些关系，那么他们作用是什么。一是我们在开发过程中可能会遇到判断对象属性或者数据类型的时候，二是原型的继承，构造函数方法时会用到。

前面我们介绍的判断数据类型的方法`typeof`会有特殊情况，所以开发过程中，一般不使用这个方法。而是使用`toString`，具体为`Object.prototype.toString.call()`,使用被检测的数据调用对象原型的`toString`方法
```javascript
Object.prototype.toString.call(3) // "[object Number]"
Object.prototype.toString.call('abc') // "[object String]"
Object.prototype.toString.call(true) // "[object Boolean]"
Object.prototype.toString.call(undefined) // "[object Undefined]",未定义的变量会报错
Object.prototype.toString.call({}) // "[object Object]"
Object.prototype.toString.call(function(){}) // "[object Function]"
Object.prototype.toString.call(Symbol()) // "[object Symbol]"
Object.prototype.toString.call(null) // "[object Null]"
Object.prototype.toString.call(NaN) // "[object Number]",这个还是显示为数字
Object.prototype.toString.call([]) // "[object Array]"
Object.prototype.toString.call(Date) // "[object Function]"
Object.prototype.toString.call(new Date()) // "[object Date]"
Object.prototype.toString.call(new Array()) // "[object Array]"
Object.prototype.toString.call(new RegExp()) // "[object RegExp]"
```