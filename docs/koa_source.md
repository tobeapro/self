## Koa源码阅读
> 查看Koa源码，总共只有四个文件`application.js`、`context.js`、`request.js`、`response.js`；分别对应Koa应用入口、上下文环境、请求对象和响应对象

### 一、application.js
#### 1、总览
可以看到这个模块以Node内部模块`events`为父类，导出一个创建Koa应用的构造函数，这个构造函数中有几个属性值，我们主要看

#### 2、属性
- middleware,保存中间件的数组；
- context，上下文对象；
- request，请求对象；
- response，响应对象；

#### 3、方法
##### 3.1 listen
我们使用中一般只传入一个number，让服务启动在某个端口号。可以看到listen内部调用的是node创建httpserver的方法。这里主要看`http.createServer`方法的接受一个请求的监听函数，同时这个函数的两个参数分别为`req`请求对象和`res`响应对象;
查看`callback`方法,
```javascript
callback() {
    const fn = compose(this.middleware);

    if (!this.listenerCount('error')) this.on('error', this.onerror);

    const handleRequest = (req, res) => {
      const ctx = this.createContext(req, res);
      return this.handleRequest(ctx, fn);
    };

    return handleRequest;
  }
```
开始通过`compose`返回链式处理中间件的函数，这里查看componse方法是如何封装的。首先先校验了中间件数组是否符合要求，然后在返回的函数中可以看到，通过`promise.resolve`将返回中间件的执行结果,中间件第一个参数是`ctx`,第二个参数是`next`,这里可以看到`dispatch`就是对应next,当我们执行该方法就会将中间件继续递归进行调用。这样就形成Koa中那种洋葱模型的执行顺序的一个promise。
```javascript
//componse方法
function compose (middleware) {
  if (!Array.isArray(middleware)) throw new TypeError('Middleware stack must be an array!')
  for (const fn of middleware) {
    if (typeof fn !== 'function') throw new TypeError('Middleware must be composed of functions!')
  }

  /**
   * @param {Object} context
   * @return {Promise}
   * @api public
   */

  return function (context, next) {
    // last called middleware #
    let index = -1
    return dispatch(0)
    function dispatch (i) {
      if (i <= index) return Promise.reject(new Error('next() called multiple times'))
      index = i
      let fn = middleware[i]
      if (i === middleware.length) fn = next
      if (!fn) return Promise.resolve()
      try {
        return Promise.resolve(fn(context, dispatch.bind(null, i + 1)));
      } catch (err) {
        return Promise.reject(err)
      }
    }
  }
}
```
然后在看`handleRequest`,这里开始有点迷惑到我,他在`callback`里面定义了一个函数也叫handleRequest,但后面这个只是一个函数变量的名字，里面的`handleRequest`才是我们要分析的。为了方便说明查看，可以临时改写成以下这种写法。
```javascript
callback() {
    const fn = compose(this.middleware);

    if (!this.listenerCount('error')) this.on('error', this.onerror);

    const xxx = (req, res) => {
      const ctx = this.createContext(req, res);
      return this.handleRequest(ctx, fn);
    };

    return xxx;
  }
```
在xxx函数中，首先使用`createContext`方法，将请求报文、响应报文等对象挂载在上下文对象上， 其中`request`是Koa请求对象，`response`是Koa响应对象，`app`为当前Koa服务实例对象，`req`为Node的请求对象，`res`为Node响应对象。然后执行`handleRequest`方法,参数为上下文和处理中间件的函数。最后返回一次请求的执行结果。这里可以看到返回状态码默认为404 
```javascript
createContext(req, res) {
  const context = Object.create(this.context);
  const request = context.request = Object.create(this.request);
  const response = context.response = Object.create(this.response);
  context.app = request.app = response.app = this;
  context.req = request.req = response.req = req;
  context.res = request.res = response.res = res;
  request.ctx = response.ctx = context;
  request.response = response;
  response.request = request;
  context.originalUrl = request.originalUrl = req.url;
  context.state = {};
  return context;
}
```
```javascript
handleRequest(ctx, fnMiddleware) {
  const res = ctx.res;
  res.statusCode = 404;
  const onerror = err => ctx.onerror(err);
  const handleResponse = () => respond(ctx);
  onFinished(res, onerror);
  return fnMiddleware(ctx).then(handleResponse).catch(onerror);
}
```
##### 3.2 handleRequest,createContext
如上callback中使用的两个方法
##### 3.3 use
use方法很简单，就是将单个中间件push进数组保存 
##### 3.3 toJSON
toJSON方法引入一个only的包,打开可以看到就是将一个对象过滤返回出一个新的只包含指定属性值的对象
##### 3.4 onerror
打印错误日志
##### 3.5 respond
处理响应结果对象,涉及了一些buffer和stream的概念,最后返回响应结果

### 二、context.js
> 返回就是上下文环境的对象原型
#### 1、inspect
返回当前对象
#### 2、toJSON
返回请求报文和响应报文和其他一些属性的对象
#### 3、assert,onerror
异常处理
#### 4、get cookies,set cookies
cookies取值和赋值的回掉函数
#### 5、delegate
从上面看到当前上下文原型的属性、方法还很少,后面主要是通过`delegate`定义其他属性方法。查看`delegate`依赖包
```javascript
function Delegator(proto, target) {
  if (!(this instanceof Delegator)) return new Delegator(proto, target);
  this.proto = proto;
  this.target = target;
  this.methods = [];
  this.getters = [];
  this.setters = [];
  this.fluents = [];
}
```
返回一个以`Delegator`为构造函数的对象,返回的对象定义了上面几个属性
`proto`参数就是传入的上下文原型对象,`target`因为这个`Delegator`函数调用了两次分别是`response`和`request`
然后`Delegator`原型上有几个方法`method`、`access`、`getter`、`setter`、`fluent`,调用以后都把原对象返回了,所以在`context.js`中使用时可以链式调用。以`method`方法为例子：
```javascript
Delegator.prototype.method = function(name){
  var proto = this.proto;
  var target = this.target;
  this.methods.push(name);

  proto[name] = function(){
    return this[target][name].apply(this[target], arguments);
  };

  return this;
};
```
调用该方法，首先将方法名保存进方法集合数组，然后在原对象上定义属性方法，这时的`proto`就是上下文原型对象,然后target参数传递表示该方法具体是用的`response`还是`request`对象上的方法。
总结就是上下文原型对象就是定义了`response`、`request`等这些重要属性，同时将这两个对象中的方法，快捷的直接绑定在原型对象上,所以有些属性或方法使用时可以省略response和request。

### request.js
定义一个request对象，将Node请求报文`req`的一些属性和方法挂载该对象上并返回
#### 1、header、headers都表示请求头
#### 2、url等等
#### 3、就是将一些Node中的请求对象里的属性挂载在Koa的请求对象request上

### response.js

和request类似，返回一个response对象，再回顾下`application.js`中的`createContext`方法；

其中`request`是Koa请求对象，`response`是Koa响应对象，`app`为当前Koa服务实例对象，`req`为Node的请求对象，`res`为Node响应对象
#### 其他还包括一些响应结果返回、重定向等方法，具体没有去细看