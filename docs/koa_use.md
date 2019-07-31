## Koa入门总结
> 前段时间用Koa和TypeScript重写了一下[个人博客的后台代码](https://github.com/tobeapro/blog-server),TypeScript这里就不说了，简单刷下文档，熟悉下基本配置。这是某位大佬写的入门教程，[文档地址](https://ts.xcatliu.com/)，可以看看。以下主要是对koa的使用和常用中间件做一些简单的总结。

#### 如官方描述那样，koa由express团队打造，它更小、更轻，更加友好的使用async函数，[官方教程](https://koa.bootcss.com/)也是很简略的介绍。

### 一、使用
```javascript
const Koa = require('koa');
const app = new Koa();
app.use(async ctx => {
  ctx.body = 'Hello World';
});
app.listen(3000);
```

这是官方的列子，首先引入`Koa`，Koa这是一个构造函数，然后new一个应用实例，`app.use`添加一个中间件，`listen`将服务启动在3000端口。Koa将request和response都封装在ctx上下文中,可以分别用`ctx.request`和`ctx.response`对应使用，上面的`ctx.body`就是`ctx.response.body`的别名简写

### 二、中间件
Koa的使用扩展主要就依赖于它的中间件机制。
`app.use`方法的参数为一个函数，该函数就对应一个中间件。

```javascript
const Koa = require('koa');
const Router = require('koa-router');
const app = new Koa();
const router = Router();
function a (ctx,next){
    console.log(1)
    next()
    console.log(2)
}
function b(ctx,next){
    console.log(3)
    next()
    console.log(4)
}
function c(ctx,next){
    console.log(5)
    next()
    console.log(6)
}
router.get('/',ctx=>{
    ctx.body = 'hello koa'
})
app.use(a)
app.use(b)
app.use(c)
app.use(router.routes())
const port = 3000
app.listen(port)
console.log('listen on port:'+port)
```
执行这个demo，在浏览器访问3000端口,控制台会依次输出`1 3 5 6 4 2`的结果。中间件函数接受两个参数，第一个是上下文，第二个是`next`函数，在服务启动后，再一次完整请求中，依次执行中间件，从外向内，直到中间件都执行或者某个中间件没有调用next函数，然后再从内向外执行，就是如网上那张洋葱模型的图一样，是一个先进后出的方式。

### 三、常用中间件
主要是个人项目中用的几个

#### 3.1 koa-router
路由配置

#### 3.2 koa-static
配置静态资源目录，主要是html、css、js和一些静态文资源。如果前端页面和资源在一个单独的文件夹下且资源目录使用的绝对路径的话，需要将项目目录和静态资源的文件夹都设置成静态目录。以下是个人项目目录和具体配置

##### `dist` 打包后的html、css、js
##### `public` 图片等静态资源
##### `src` 源码文件夹
##### `app.js` 入口js

```javascript
const koaStatic = require('koa-static');
app.use(koaStatic(path.join(__dirname,'./dist')));
app.use(koaStatic(path.join(__dirname,'./public')));
app.use(koaStatic(__dirname));
```
#### 3.3 koa-session
koa中使用session鉴权，我是直接使用官方的demo就满足需求了

#### 3.4 koa2-connect-history-api-fallback
前端单页面使用history模式时使用的中间件

#### 3.5 koa-body
Koa和express一样，使用引入中间件对`POST`请求的请求报文参数进行解析，这个中间件是bodyParser和node-formidable的结合，用于解析JSON格式的请求参数和文件上传参数。
```javascript
app.use(koaBody({
    multipart:true, // 支持文件上传
    encoding:'utf-8',
    formidable:{
        multiples:false,
        uploadDir:path.join(__dirname,'./public/resource/'), // 设置文件上传目录
        keepExtensions: true,    // 保持文件的后缀
        maxFileSize:3 * 1024 * 1024, // 文件上传大小
        onFileBegin(name,file){
            const fileName = file.name;
            const picReg = /\.(png|jpe?g|gif|svg)$/i;
            if(!picReg.test(fileName)){
               return this._error('只能上传图片')
            }
        }
    },
    onError(err:any,ctx){
        ctx.throw(err)
    }
}))
```
这里说明下`formidable`参数中属性是直接传递给`node-formidable`使用的，详细需要去单独查看`node-formidable`的使用文档

#### 3.6 其他函数
开发中常用的处理跨域的CORS方法函数；鉴权同时过滤一部分接口。

#### [后台项目地址](https://github.com/tobeapro/blog-server)