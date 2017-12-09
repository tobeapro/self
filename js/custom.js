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
	router()
	function sign(str){
    	switch(str){
    		case "js":return "<a class='sign-default sign-js' href='#js'>javascript</a>";
    		break;
    		case "css":return "<a class='sign-default sign-css' href='#css'>css</a>";
    		break;
    		case "self":return "<a class='sign-default sign-self' href='#self'>原创</a>";
    		break;
    		case "copy":return "<a class='sign-default sign-copy' href='#copy'>转载</a>";
    		break;
    		default:return "<a class='sign-default sign-others' href='#others'>others</a>";
    	}
    }
    function template(obj){
	 	var content="<div class='main-right-item'>";
       		content+="<div class='item-content'>",
       		content+="<div class='user'><a href='"+obj.userUrl+"'><img src='"+obj.userPic+"'></a></div>",
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
            bindTouch()
		}else if(hash.substr(0,5)==="#html"){
			var url="./"+hash.substring(1)+".md"
		    req.open("get",url,false)
			req.send()
			document.getElementById('main-content').innerHTML="<div class='main-right-article'>"+marked(req.responseText)+"</div>";
			loading.hide()
		}else{
			hash=hash.substring(1);
			req.open("get","./content.json",false)
			req.send()	
            var res=JSON.parse(req.responseText).data;
            var part=document.querySelector("#main-content");
            part.innerHTML="";
            res.forEach(function(item){
           		var signs=item.sign.join()
	           	if(signs.indexOf(hash)!=-1){
	           		part.innerHTML+=template(item);
	           	}        	           	
            })
            loading.hide()
            bindTouch()
		}
	}
	function bindTouch(){
		var rightItem=document.querySelectorAll('.main-right-item')
	   	for(var i=0;i<rightItem.length;i++){
	   		rightItem[i].addEventListener("touchstart",function(){
	   			this.className="main-right-item border"
	   		})
	   		rightItem[i].addEventListener("touchend",function(){
	   			this.className="main-right-item"
	   		})
	   	}
	}   
   	window.addEventListener("hashchange",function(){
   		router()
   	})
})()
