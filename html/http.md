## http请求小结
> 背景：现在使用`http`请求的工具或方式主要有两种，`fetch`和`axios`,`axios`是使用`XMLHttpRequest`封装的，就是我们之前所熟知的`ajax`的形式，而`fetch`是后面浏览器新增的原生方法，使用起来差不多。以下个人总结测试是以`axios`+`express`为环境的。
### 一、方法
1.GET
`GET`请求的请求数据在地址栏以明文的形式显示
2.POST
`POST`请求的请求数据通常在请求报文的`body`对象中，在`express`中需要引入`body-parser`这个中间件去解析才能在后台的`body`获取提交的数据
### 二、 请求报文
>  请求报文中的几个重要的参数
####  header请求头
`POST`提交数据时，比较常用的有`application/x-www-form-urlencoded`，`multipart/form-data`，`application/json`请求头，三者提交的数据格式有所不同

1.application/x-www-form-urlencoded
`application/x-www-form-urlencoded`是我们常说的，form表单的形式提交数据，用这个方式提交的数据格式形如：`key1=value1&key2=value2`的这种用键值对用"="分开和用"&"拼接的字符串的形式，是不是看起来和`GET`请求的数据格式一样，实际上`GET`请求头也是这个，是默认的。
2.multipart/form-data
`multipart/form-data`提交数据，这个主要是用来上传文件所使用的，提交的数据依赖`FormData`这个对象，具体可以搜索该对象的使用。同时`express`要使用`formidable`这个中间件去解析这种数据提交格式
3.application/json
`application/json`就是用`json`的数据格式来提交，这种是简单的，数据只要满足`json`的格式就可以了

#### cache缓存
缓存我们，常说的`GET`和`POST`的区别的时，会提到`GET`会缓存，`POST`不会缓存，这两种情况都是在默认的情况下发生的。也就是说和`cache`的默认值有关，在这两种请求方式中，一个是默认缓存，一个默认不缓存。当然缓存不只这一个参数，详细的后面再总结。。。
### 跨域请求
#### 跨域就不用解释了，开发过程中的家常
只要是非简单请求在发生跨域请求是都会先进行一次`OPTIONS`的预请求，如果后台返回一些拒绝的状态码，例如`404`这种就不会进行正常的请求了
那什么是简单请求，简单请求满足条件比较好记的两个就是
1.请求方式
只能为`GET`、`POST`、`HEAD`这三种方法
2.请求头
只能为`application/x-www-form-urlencoded`,`multipart/form-data`,`text/plain`这三种
3.还有一些其他的参数，详细可以看网上的一些介绍
##### 必须同时满足以上三个条件才属于简单请求