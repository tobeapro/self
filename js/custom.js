(function(){
	var loading={
		show:function(){
			var el=document.createElement("div");
			el.className="loading";
			document.body.appendChild(el)
		},
		hide:function(){
			var el=document.querySelector('.loading')
			if(el){
				document.body.removeChild(el)
			}
		}
	}
	classifyActive(location.hash)
	router()
	othersLink()
	function sign(str){
    	switch(str){
    		case "js":return "<a class='sign-default sign-js' href='#js'>javascript</a>";
    		break;
    		case "css":return "<a class='sign-default sign-css' href='#css'>css</a>";
    		break;
    		case "self":return "<a class='sign-default sign-self' href='#self'>self</a>";
    		break;
    		case "copy":return "<a class='sign-default sign-copy' href='#copy'>转载</a>";
    		break;
    		default:return "<a class='sign-default sign-others' href='#others'>"+ str +"</a>";
    	}
    }
    function template(obj){
	 	var content="<div class='main-right-item'>";
       		content+="<div class='item-content'>",
       		content+="<div class='user'><a href='"+obj.userUrl+"' target='_blank'><img src='"+obj.userPic+"' alt='头像'></a></div>",
       		content+="<div class='detail'><div class='title'><a class='item-link' href='"+obj.url+"'>"+obj.title+"</a></div><div class='text'>"+obj.text+"<a class='item-link' href='"+obj.url+"'>详细...</a></div></div>",
       		content+="</div>",
       		content+="<div class='item-sign'>";
       		obj.sign.forEach(function(val){
       			content+=sign(val);
       		})
       		content+="</div></div>";
       	return content
    }
	function router(){
		loading.show()
		window.scrollTo(0,0)
		var hash=location.hash
		var req=new XMLHttpRequest()
		if(hash===""){
			req.open("get","./content.json",false)
			req.send()
            var res=JSON.parse(req.responseText).data;
            var part=document.querySelector("#main-content");
            part.innerHTML="";
            res.forEach(function(item){
           	   part.innerHTML+=template(item);
            })
            loading.hide()
            bindEvent()
		}else if(hash.substr(0,5)==="#html"){
			var url="./"+hash.substring(1)+".md"
		    req.open("get",url,false)
			req.send()
			document.getElementById('main-content').innerHTML="<div class='main-right-article'>"+marked(req.responseText)+"</div>";
			document.querySelectorAll('pre code').forEach(function(block) {
			    hljs.highlightBlock(block);
			 })
			loading.hide()
		}else{
			hash=hash.substring(1);
			req.open("get","./content.json",false)
			req.send()
            var res=JSON.parse(req.responseText).data;
            var part=document.querySelector("#main-content");
            part.innerHTML="";
            if(hash==="others"){
            	res.forEach(function(item){
		           	if(item.signMark){
		           		part.innerHTML+=template(item);
		           	}
	            })
            }else{
	            res.forEach(function(item){
	           		var signs=item.sign.join()
		           	if(signs.indexOf(hash)!=-1){
		           		part.innerHTML+=template(item);
		           	}
	            })
            }
            loading.hide()
            bindEvent()
		}
	}
	//移动端的hover效果和点击时间
	function bindEvent(){
		var rightItem=document.body.querySelectorAll('.main-right-item')
		var leftNav=document.querySelector('.main-left-nav')
		var leftItem=leftNav.querySelectorAll("a")
		var bar=document.querySelector(".bar")
	   	for(var i=0;i<rightItem.length;i++){
	   		rightItem[i].addEventListener("touchstart",function(){
	   			this.className="main-right-item border"
	   		})
	   		rightItem[i].addEventListener("touchend",function(){
	   			this.className="main-right-item"
	   		})
	   	}
	   	for(var j=0;j<leftItem.length;j++){
				leftItem[j].addEventListener("click",function(){
					leftNav.className="main-left-nav"
					bar.className="bar"
				})
	   		leftItem[j].addEventListener("touchstart",function(){
	   			this.style["textDecoration"]="underline";
	   		})
	   		leftItem[j].addEventListener("touchend",function(){
	   			this.style["textDecoration"]="none";
	   		})
	   	}
	}
	//监听hash变化
   	window.addEventListener("hashchange",function(){
   		classifyActive(location.hash)
   		router()
   	})
   	function classifyActive(hash){
   		var items=document.body.querySelector('.main-left-nav').querySelectorAll(".item")
   		if(hash.substr(0,5)==="#html"||hash===""){
   			for(var i=0;i<items.length;i++){
	   			if(items[i].querySelector("a").getAttribute("href")==="#"){
	   				items[i].className="item active"
	   			}else{
	   				items[i].className="item"
	   			}
	   		}
   		}else{
   			for(var i=0;i<items.length;i++){
	   			if(items[i].querySelector("a").getAttribute("href")===hash){
	   				items[i].className="item active"
	   			}else{
	   				items[i].className="item"
	   			}
	   		}
   		}
   	}
   	var bar=document.body.querySelector(".bar")
   	bar.onclick=function(){
   		var nav=document.body.querySelector(".main-left-nav")
   		if(this.className==="bar"){
   			this.className="bar active"
   			nav.className="main-left-nav active"
   		}else{
   			this.className="bar"
   			nav.className="main-left-nav"
   		}
   	}
   	//回到顶部的过度效果
   	var backTop=document.body.querySelector('.back-top')
   	backTop.onclick=function(){
   		var num=3;
   		var timer=setInterval(function(){
   			if(num>1){
   				window.scrollTo(0,200-(3-num)*100)
   				num=num-0.4
   			}else{
   				window.scrollTo(0,0)
   				clearInterval(timer)
   			}
   		},40)
   	}
   	window.addEventListener("scroll",function(){
   		if(window.scrollY>200){
   			backTop.className="back-top active"
   		}else{
   			backTop.className="back-top"
   		}
   	})
   	//其他展示
   	function othersLink(){
   		var req=new XMLHttpRequest()
   		req.open("get",'./othersData.json',false)
   		req.send()
   		var res=JSON.parse(req.responseText).data
   		var list=document.querySelector(".link-list")
   		var content="";
   		res.forEach(function(item){
   			content+="<li><a href='"+item.url+"'><i class='fa fa-star' aria-hidden='true'></i>"+item.name+"</a></li>"
   		})
   		list.innerHTML=content
   	}
})()
