### vue-cli中配置mongodb
	首先根目录下建立servers文件夹

![servers](https://tobeapro.github.io/user/img/db1.png)

  	在servers中新建scheame.js和index.js，安装mongoose模块，Mongoose是在node.js异步环境下对mongodb进行便捷操作的对象模型工具,简单来说就是使用mongoose来操作Mongodb。在schema中引入mongoose，首先创建schema实例，实例中对象包含该数据对应的字段同时定义数据类型；再创建model，每个model对应一个schema。

![schema.js](https://tobeapro.github.io/user/img/db2.png)
	
	首先在mongodb安装目录下双击打开mongodb.exe,启动成功在27017接口能看到相应的提示信息
	
![mongod.exe](https://tobeapro.github.io/user/img/db3.png)

![mongod.exe](https://tobeapro.github.io/user/img/db4.png)
	
启动成功

使用mongoose.connect方法连接本地数据库，默认端口为271017,图中的player为自定义的数据库名字（第一次连接会默认创建）
使用mongoose监听mongodb连接状态，同时将model的方法导出
在servers下的index引入schema，向外暴露命名的接口方法，数据会和数据库的集合相对应，本例子中player数据库中对应有user和music两个集合

![index.js](https://tobeapro.github.io/user/img/db5.png)

![dev-server.js](https://tobeapro.github.io/user/img/db6.png)

![dev-server.js](https://tobeapro.github.io/user/img/db7.png)

