## 变量提升、函数提升

JavaScript由于以上两个特性，所以会产生很多困惑的事情。看几个例子吧

```javascript
// demo1
console.log(a);
var a = 1;
```

结果为`undefined`,这个并不会报错。

```javascript
// demo2
console.log(a);
var a = 1;
function a(){};
```

结果为`函数a`。

```javascript
// demo3
var a = 1;
function b(){
    if(!a){
        var a = 2;
    }
    console.log(a)
}
b();
```

结果为`2`	。

```javascript
// demo4
var a = 1;
function b() {
    a = 2;
    return;
    function a() {}
}
b();
console.log(a);
```

结果为`1`。

##### ———分割线———

提升顾名思义就是js中变量和函数的声明会自动提升到表达式的顶部。

以上例子相应的等价

```javascript
// demo1
var a;
console.log(a);
a = 1;
```

```javascript
// demo2
function a(){};
var a;
console.log(a);
a = 1;
```

```javascript
// demo3
var a = 1;
function b(){
    var a;
    if(!a){
        a = 2;
    }
    console.log(a)
}
b();
```

```javascript
// demo4
var a = 1;
function b() {
    function a() {};
    a = 2;
    return;
}
b();
console.log(a);
```

第一个、第二个例子都好理解，第三个是因为`if`这种语句并不会创建一个新的作用域，只有函数才会创建新的作用域，第四个是函数作用域中的函数提升。

#### 总结

##### 1.变量声明、函数声明会自动提升到执行上下文的顶部；

##### 2.函数声明在变量声明前面；

##### 3.只有函数才会创建新的作用域；

##### 4.提升可以理解为在代码执行之前就完成了，和具体有没有执行没有关系。