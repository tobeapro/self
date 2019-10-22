> 因为工作主要是vue技术栈，开发管理系统主要使用的就是`elementUI`组件库。使用过程中，难免会根据业务需求进行二次开发，或者碰到疑惑不解的，就会去看看源码如何封装和实现的来获得启发。接下来会慢慢归纳下我遇到的几个组件。
## 一、el-tree
树形结构组件
起因为业务驱动，公司的组织架构需要用到树形结构组件，同时，由于业务的特殊性，公司的需求是勾选某个部门时不勾选该部门下的子部门。当时没多想直接就自己去实现了，同时呢为了风格统一，直接用的element的便签和样式。
```html
<template>
    <div>
        <div v-for="(data,index) in datas" :key="index" class="select-tree">
            <div class="check-label" :class="{'is-checked':data.isCheck}" v-if="filterNodeName(searchNode,data)">
                <i class="expand-out" v-if="data[childrenStr]&&data[childrenStr]length" @click="toggeleExpand(data)">
                    <div class="expand-block has-children" :class="{'isExpand':data.isExpand}"></div>
                </i>
                <i v-else class="expand-out">
                    <div class="expand-block"></div>
                </i>
                <span class="cus-checkbox" @click="toggleSelect(data)"></span>{{data[nameStr]}}
            </div>
            <common-select-tree :isSingleSelected="isSingleSelected" v-show="data.isExpand" :searchNode="searchNode" :keyStr="keyStr" :childrenStr="childrenStr" :nameStr="nameStr" v-if="data[childrenStr]&&data[childrenStr].length" :datas="data[childrenStr]" :selectedDatas="selectedDatas"></common-select-tree>
        </div>
    </div>
</template>

<script>
    export default {
        name:'select-tree',
        props:{
            datas:{
                type:Array
            },
            // 当前勾选的数据
            selectedDatas:{
                type:Array,
                default:()=>{
                    return []
                }
            },
            // 是否单选
            isSingleSelected:{
                type:Boolean,
                default:false
            },
            searchNode:{
                type:String,
                default:''
            },
            // 唯一标示关键字
            keyStr:{
                type:String,
                default:'id'
            },
            // 子集关键字
            childrenStr:{
                type:String,
                default:'children'
            },
            // 名称关键字
            nameStr:{
                type:String,
                default:'name'
            }
        },
        mounted(){
            this.reset(this.datas)
        },
        watch:{
            searchNode(val){
                if(val){
                    // 展开
                    this.unfoldTree(this.datas)
                }else{
                    // 还原
                    this.resetFoldTree(this.datas)
                }
            }
        },
        methods:{
            reset(datas){
                if(datas&&datas.length){
                    datas.forEach(item=>{
                        this.$set(item,'oldExpand',false);
                        this.$set(item,'isExpand',false);
                        this.$set(item,'isCheck',false)
                        this.reset(item[this.childrenStr])
                    })
                }
            },
            unfoldTree(datas){
                if(datas&&datas.length){
                    datas.forEach(item=>{
                        this.$set(item,'isExpand',true);                       
                        this.unfoldTree(item[this.childrenStr])
                    })
                }
            },
            resetFoldTree(datas){
                if(datas&&datas.length){
                    datas.forEach(item=>{
                        this.$set(item,'isExpand',item.oldExpand||false);
                        this.resetFoldTree(item[this.childrenStr])
                    })
                }
            },
            filterNodeName(key,data){
                if(!key){
                    return true
                }
                if(data&&data[this.nameStr]&&data[this.nameStr].indexOf(key)>-1){
                    return true
                }
                if(data[this.childrenStr]&&data[this.childrenStr].length>1){
                    for(let item of data[this.childrenStr]){
                        if(!this.filterNodeName(key,item)){
                            continue
                        }else{
                            return true
                        }
                    }
                    return false
                }else{
                    return false
                }
            },
            toggeleExpand(item){
                if(item.isExpand){
                    this.$set(item,'isExpand',false)
                    this.$set(item,'oldExpand',false)
                }else{
                    this.$set(item,'isExpand',true)
                    this.$set(item,'oldExpand',true)
                }
            },
            unCheckTreeRoot(){
                if(this.$parent.unCheckTreeRoot){
                    this.$parent.unCheckTreeRoot()
                }else{
                    this.unCheckDatas(this.datas)
                }
            },
            unCheckDatas(datas){
                if(datas&&datas.length){
                    datas.forEach(item=>{
                        this.$set(item,'isCheck',false);                       
                        this.unCheckDatas(item[this.childrenStr])
                    })
                }
            },
            toggleSelect(item){
                let selectedDatas = this.selectedDatas;
                let index = this.selectedDatas.findIndex(child=>{
                    return child.nodeId === item[this.keyStr]
                })
                if(index>-1){
                    this.selectedDatas.splice(index,1)
                    this.$set(item,'isCheck',false)
                }else{
                    if(this.isSingleSelected){
                        this.selectedDatas.length=0
                        // 单选时回溯清空选择
                        this.unCheckTreeRoot()
                    }
                    this.selectedDatas.push({
                        nodeId: item[this.keyStr],
                        names: item.names || ([].concat(item.name))
                    })
                    this.$set(item,'isCheck',true)
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    .select-tree{
        padding-left:20px;
    }
    .expand-out{
        padding:4px 6px;
    }
    .expand-block{
        display:inline-block;
        transform: translateY(-2px);
        width:0;
        height:0;
        border:4px solid transparent;
        transition: all .2s linear;
    }
    .expand-block.has-children{
        border-left-color:#1890FF;
    }
    .expand-block.isExpand{
        transform: rotate(90deg) translateY(4px);
    }
    .check-label{
        padding:4px 0;
    }
    .cus-checkbox{
        display: inline-block;
        transform:translateY(2px);
        margin-right:4px;
        position: relative;
        border: 1px solid #dcdfe6;
        border-radius: 2px;
        box-sizing: border-box;
        width: 14px;
        height: 14px;
        background-color: #fff;
        z-index: 1;
        transition: border-color 0.25s cubic-bezier(0.71, -0.46, 0.29, 1.46), background-color 0.25s cubic-bezier(0.71, -0.46, 0.29, 1.46);
    }
    .cus-checkbox:hover{
        border-color:#1890FF
    }
    .cus-checkbox:after{
        box-sizing: content-box;
        content: "";
        height: 6px;
        width: 3px;
        left: 4px;
        border: 1px solid #fff;
        border-left: 0;
        border-top: 0;
        height: 7px;
        left: 4px;
        position: absolute;
        top: 1px;
        transform: rotate(45deg) scaleY(1);
        width: 3px;
        transition: transform .15s ease-in .05s;
        transform-origin: center;
    }
    .is-checked{
        color:#1890FF;
    }
    .is-checked .cus-checkbox{
        background-color:#1890FF;
    }
</style>
```

```html
<div v-if="visible">
    <!-- confirmNodes确认选择 -->
    <el-button @click="visible=false;">取消</el-button><el-button type="primary" @click="confirmNodes(selectedDatas)">确定</el-button>
</div>
<!-- searchNode为搜索内容，datas为数据集合 -->
<el-input v-model.trim="searchNode" placeholder="搜索组织架构" clearable></el-input>
<div style="padding:16px 0;margin-left:-20px;">
    <common-select-tree v-if="visible" :datas="datas" :searchNode="searchNode" :selectedDatas="selectedDatas" style="max-height:400px;overflow:auto;"></common-select-tree>
</div>
```

> 以上是第一个为整个vue组件，第二个为具体使用的实例主要代码。组织机构的数据格式就是父子嵌套的树形结构，我们的业务数据例子如下。首先全局分析一下需求，和`el-tree`使用效果差不多，不同的是勾选某一节点时不会去触发勾选它的子节点。当时的想法就是首先套用`element的`样式，数据就是循环兄弟节点，然后递归向下循环子节点集合。同时每个节点的需要几个基本参数，`isExpand`表示是否展开后面的子节点，同时控制子节点显示，`isCheck`表示当前节点是否选中，根据这两个字段控制左边展开小箭头和选中框的样式，这里的小插曲，小箭头可以用`border`样式来实现，选中框呢，当时我以为`element`可能用的是iconfont，结果审查一看选中状态钩子样式用的一个倾斜的半长方形边框来实现的，所以我就借鉴了一下。

```javascript
[
    {
        id:1,
        ids:[1]
        name:'一级部门A1',
        names:['一级部门A1']
        children:[
            {
                id:11,
                ids:[1,11]
                name:'二级部门B1',
                names:['一级部门A1','二级部门B1'],
                children:[
                    id:111,
                    ids:[1,11,111]
                    name:'三级部门C1',
                    names:['一级部门A1','二级部门B1','三级部门C1'],
                ]
            }
            {
                id:12,
                ids:[1,12]
                name:'二级部门B2',
                names:['一级部门A1','二级部门B2'],
                children:[]
            }
        ]
    },
    {
        id:2,
        ids:[2]
        name:'二级部门A2',
        names:['二级部门A2'],
        children:[]
    }
]
```

> 样式搞定了，接下来是操作了，`toggeleExpand`方法控制展开收起，改变`isExpand`属性即可；`toggleSelect`方法改变选中节点，这个方法改变`isCheck`属性和选中数据，如果`isCheck`原来为`false`，就变成`true`，同时将该节点数据push进选中数据，如果是单选还要取消其他选中和移除其他选中数据，反之，`isCheck`由`false`变为`true`同时将该节点数据push进选中数据。
`selectedDatas`为选中数据，通过`props`传递下来，这里虽然Vue和React中都是使用单向数据流的方式，但是这里的`selectedDatas`是一个对象，不是基本数据类型，所以改变的是对象的引用所以不会产生警告。这样基本功能就有了，能勾选和获取数据。接下来就是完善。
### props 属性
##### 1.datas
当前节点数据集合
##### 2.selectedDatas
选中数据
##### 3.isSingleSelected
控制是否单选，当使用单选时每次勾选节点需要去清空被勾选的节点，这里需要使用回溯到根部然后调用`unCheckTreeRoot`方法来清空选择。
##### 4.searchNode
搜索内容，因为节点过多，所以又增加了一个搜索，首先需要watch该属性，属性有值时说明在使用搜索，需要调用`unfoldTree`展开所有节点。而`filterNodeName`控制该节点是否搜索匹配显示，这里又不是简单的匹配，比如搜索出的结果匹配是一个三级节点，同时也要把它的二级、一级节点（所有祖先节点都需要显示）。
##### 5.keyStr
唯一标示关键字，默认为`id`
##### 6.childrenStr
子集关键字，默认为`children`
##### 7.nameStr
名称关键字，默认为`name`

### methods 方法
##### 1.reset
重置组件，每次组件打开时设置默认属性和数据复原
##### 2.unfoldTree
展开整个树形结构
##### 3.resetFoldTree
还原树形结构，应用场景：搜索时会默认展开所有节点，当搜索清空时需要复原，需要每一项中新增了一个属性`oldExpand`来保存搜索展开前的原展开或收起状态，这样就不会每次清空搜索，节点全部展开了显得过长了。
##### 4.filterNodeName
搜索节点
##### 5.toggeleExpand
控制节点展开收起
##### 6.unCheckTreeRoot
清空所有选中，单选时会用到，会和`unCheckDatas`方法一起使用
##### 7.unCheckDatas
清空选中的具体方法
##### 8.toggleSelect
选中和取消选中

#### 以上为个人根据公司业务写的tree组件，当然可优化的空间还很多，一个人的视野还是很狭窄的，所以我尝试去探索下element团队是如何封装的。
![9AED312CDE132453BE63C02CEB9E1460.png](http://amz715.com/public/resource/upload_f926f48af96bb0866975d322284f013b.png)
这是`tree`组件的文件结构。`index.js`为入口文件，src下的`tree.vue`为组件的主体部分，`tree-node.vue`为节点组件。
整个组件内容比较多，就不逐行描述了，主要是把几个功能和自己之前写的组件作比对。
- 控制菜单展开收起
- 菜单选中取消选中

#### 1、tree.vue
##### 属性
data，树形结构菜单的数据
nodeKey，数据节点唯一标识符
##### 方法
getCheckedNodes，获取选中节点数据的集合
getCheckedKeys，获取选中节点数据的标识符集合
filter，搜索节点
##### 分析
首先传入的data会进行处理整合，在created生命周期函数中，使用TreeStore构造方法，绑定了一些和拖拽事件有关的方法。
```javascript
this.isTree = true;

this.store = new TreeStore({
    key: this.nodeKey,
    data: this.data,
    lazy: this.lazy,
    props: this.props,
    load: this.load,
    currentNodeKey: this.currentNodeKey,
    checkStrictly: this.checkStrictly,
    checkDescendants: this.checkDescendants,
    defaultCheckedKeys: this.defaultCheckedKeys,
    defaultExpandedKeys: this.defaultExpandedKeys,
    autoExpandParent: this.autoExpandParent,
    defaultExpandAll: this.defaultExpandAll,
    filterNodeMethod: this.filterNodeMethod
});

this.root = this.store.root;
```
首先是isTree变量表明当前是在tree组件，TreeStore方法定义在model文件夹下。
`getCheckedNodes`定义在tree-node.js中，它有两个参数，分别为`leafOnly`表示是否为叶子节点、`includeHalfChecked`表示是否要包含半选的节点；默认值都是`false`，查看该方法内部就是递归将选中的节点取出并返回。
`getCheckedKeys`类似，就是返回所有选中的节点的`nodeKey`集合
`filter`方法用来节点搜索显示，和我们写的也类似，本身和子孙节点满足条件都要显示并展开。
#### 2、tree-node.vue
这个就是循环渲染树形节点的组件，这里和我们想的一样是用递归的方式渲染组件，同时运用created周期函数将我们的根组件tree组件对象保存到tree变量中，一直传递下去。方便在每个循环节点中使用。对于节点的展开收起和我们的组件使用类似。选中和取消选中通过调用`handleSelectChange`方法然后直接从根部向外emit自定义的方法参数就是当前节点的值、是否选中的布尔值
是否全选的状态
> 总结：官方的tree组件，选中和取消选中、展开收起基本和我实现的方式差不多；不同的几点，第一获取选中数据，我是使用一个变量去储存选中的值，而element是每次循环组件获取一次；第二是根节点数据，element使用就更合理了，巧妙利用父子组件周期函数执行顺序，不断将tree对象向下传递。从而在节点组件内部也能方便获取根节点对象。

## 二、el-upload
文件上传组件
`fileList`自定义的时候和上传时的文件的关系，为什么我写的多图上传的时候`on-success`回调只触发了一次。。。基于一些疑问来查看一下`upload`组件内部究竟是如何封装的

目录结构
![20191022205529.png](http://amz715.com/public/resource/upload_82c7f7859775dc4d238378244698111e.png)
`index.js`为入口文件，`ajax.js`封装一个formData格式上传文件的方法，`upload-dragger.vue`和拖动上传有关的部分，`upload-list.vue`根据不同风格显示的已上传文件列表，其中包含删除和预览的方法。剩下的`index.vue`和`upload.vue`是主要研究的部分。

### upload.vue
先看上传组件，不看`upload-dragger`部分，使用`input[type='file']`标签来实现上传的功能。
#### 属性
##### 1、fileList
`index.vue`中的`uploadFiles`，为已上传的文件列表
#### 方法
##### 1、handleChange
选择上传文件后触发，然后调用`uploadFiles`方法上传
##### 2、uploadFiles
首先先校验是否超出个数显示，是否支持多图等。
将files类数组转成数组`postFiles`，然后将需要上传的文件（单个文件时数组长度为1），依次触发`onStart`方法和上传方法`upload`。onStart对应在`index.vue`中的`handleStart`方法，会需要上传的文件增加信息标记，详细在下面描述。
##### 3、upload
开始上传前，会将input便签内容清空，这样每次选择文件都会触发onchange方法，然后如果有`beforeUpload`方法就进行过滤，没有或通过就正式进行上传，`post`方法为上传方法。
##### 4、post
参数为已封装的待上传文件，内部调用的是`ajax.js`封装好的上传文件方法，上传请求成功会触发`onSuccess`方法

### index.vue
查看组件，该组件作者没有使用我们平时传统的vue组件风格，没有使用`template`标签而是直接用的`render`方法返回组件dom；文件上传的几个回调方法也是使用`prop`传值的而不是`emit`触发器的形式。
接下来主要查看几个重要的属性和方法。
#### 属性
##### 1、fileList
`fileList`会被监听，同时初始化加上uid、status属性，同时也会生成一个`uploadFiles`表示已上传的文件。
#### 方法
##### 1、handleStart
文件开始上传的回调方法，给待上传的文件增加uid标记等属性，会直接将信息加到`uploadFiles`中，并触发组件中`onChange`回调方法。
##### 2、handleSuccess
文件上传成功后的回调方法，参数是服务返回的结果和当前文件的信息。方法开始会调用`getFile`方法做一次算是校验吧。然后在触发上传成功`onSuccess`和`onChange`方法，这里面也是我之前`onSuccess`只触发一次的原因，就是自己使用方法不对。
##### 3、getFile
参数为文件信息，然后将`uploadFiles`循环，这里`Array.prototype.every`方法，该方法本来是接受一个函数作为参数，当所有值都满足条件为true是返回true；有遇到一个为false就返回false，且会直接退出循环。所以查看代码实际上该方法判断这个待上传的文件是否在`uploadFiles`中，有就返回它。所以在多图上传的时候不能直接覆盖原来的`fileList`，因为监听生成的`uploadFiles`也会随时变化，导致后面的文件uid就无法匹配了。

> 总结：内部的`uploadFiles`是受`fileList`影响的，不能随便去改变fileList的值。上传成功的返回参数list中会有一个对象带有`response`属性，表示这个文件上传后的服务响应值，通过这个进行相应的操作。

