## vue-cli中配置mongodb

#### 1、首先根目录下建立`servers`文件夹

![servers](https://tobeapro.github.io/img/db1.png)

在`servers`中新建`scheame.js`和`index.js`，安装`mongoose`模块，Mongoose是在node.js异步环境下对mongodb进行便捷操作的对象模型工具,简单来说就是使用mongoose来操作Mongodb。在schema中引入mongoose，首先创建schema实例，实例中对象包含该数据对应的字段同时定义数据类型；再创建model，每个model对应一个schema。

![schema.js](https://tobeapro.github.io/img/db2.png)
	
#### 2、然后在mongodb安装目录下双击打开`mongodb.exe`,启动成功在27017接口能看到相应的提示信息
	
![mongod.exe](https://tobeapro.github.io/img/db3.png)

![mongod.exe](https://tobeapro.github.io/img/db4.png)
	
#### 3、启动成功

使用`mongoose.connect`方法连接本地数据库，默认端口为271017,图中的player为自定义的数据库名字（第一次连接会默认创建）

使用mongoose监听mongodb连接状态，同时将`model`的方法导出

在`servers`下的`index`引入`schema`，向外暴露命名的接口方法，数据会和数据库的集合相对应，本例子中player数据库中对应有user和music两个集合

![index.js](https://tobeapro.github.io/img/db5.png)

![dev-server.js](https://tobeapro.github.io/img/db6.png)

#### 4、配置结束后，重新在命令行中运行项目`npm run dev`,就可以使用封装好的接口了。

