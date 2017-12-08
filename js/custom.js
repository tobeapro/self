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
	function router(){
		loading.show();
		window.scrollTo(0,0);		
		var hash=location.hash;
		var req=new XMLHttpRequest();	
		if(hash===""){			 
			req.open("get","./content.json",false)
			req.send()
			if (req.readyState==4 && req.status==200){
	           var res=JSON.parse(req.responseText).data;
	           var part=document.querySelector("#main-content");
	           part.innerHTML="";
	           res.forEach(function(item){
	           	var content="<div class='main-right-item'>";
	           		content+="<div class='item-content'>",
	           		content+="<div class='user'><a href='"+item.userUrl+"'><img src='"+item.userPic+"'></a></div>",
	           		content+="<div class='detail'><div class='title'><a class='item-link' href='"+item.url+"'>"+item.title+"</a></div><div class='text'>"+item.text+"<a class='item-link' href='"+item.url+"'>详细...</a></div></div>",
	           		content+="</div>",
	           		content+="<div class='item-sign'>";
	           		item.sign.forEach(function(val){
	           			content+=sign(val);
	           		})
	           	content+="</div></div>";
	           	part.innerHTML+=content;
	           	loading.hide()
	           })
	        }else{
	        	loading.hide()
	        	console.log("error")
	        }  
		}else{
			loading.hide()
			let url="./"+hash.substring(1)+".md"; 
		    req.open("get",url,false)
			req.send()
			document.getElementById('main-content').innerHTML="<div class='main-right-article'>"+marked(req.responseText)+"</div>"
		}
	}
    function sign(str){
    	switch(str){
    		case "js":return "<button class='sign-default sign-js'>javascript</button>";
    		break;
    		case "css":return "<button class='sign-default sign-css'>css</button>";
    		break;
    		case "self":return "<button class='sign-default sign-self'>原创</button>";
    		break;
    		case "copy":return "<button class='sign-default sign-copy'>转载</button>";
    		break;
    		default:return "<button class='sign-default sign-others'>others</button>";
    	}
    }
    var rightItem=document.querySelectorAll('.main-right-item')
   	for(let i=0;i<rightItem.length;i++){
   		rightItem[i].addEventListener("touchstart",function(){
   			this.className="main-right-item border"
   		})
   		rightItem[i].addEventListener("touchend",function(){
   			this.className="main-right-item"
   		})
   	}
   	window.addEventListener("hashchange",function(){
   		console.log(location.hash)
   		router()
   	})
})()
