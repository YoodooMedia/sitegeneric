/*

  ______     _______     _______
 /  __  \   |_____  |   |_____  |
|  |__|  |       /  /        /  /
|   ____/       /  /        /  /
|  |_____      /  /__      /  /__
 \_______|    |______|    |______|

 by Polyfex ltd
 author Paul Clark
 
*/

dooit.temporaries('eez');
var eez={
	messageOptions:{
		duration:3000
	},
	animation:{
		speed:500,
		easing:"swing"
	},
	ajax:function(cmd) {
		var xhr={
			   url:cmd.url,
			   data:cmd.data,
			   type:"POST",
			   dataType:"xml",
			   success:function(data) {eez.received(data);},
			   error:function(jqXHR, textStatus, errorThrown) {eez.ajaxError(jqXHR, textStatus, errorThrown);}
		};
		if (cmd.dataType) xhr.dataType=cmd.dataType;
		if (cmd.success) {
			if (typeof(cmd.success)=="string") {
				eval('xhr.success=function(data) {'+cmd.success+'(data);}');
			}else{
				xhr.success=cmd.success;
			}
		}
		if (cmd.error) eval('xhr.error=function(jqXHR, textStatus, errorThrown) {'+cmd.success+'(jqXHR, textStatus, errorThrown);}');
		return $.ajax(xhr);
	},
	ajaxError:function(jqXHR, textStatus, errorThrown) {
		if (console && console.log) console.log(textStatus+" , "+errorThrown);
	},
	lastResponse:'',
     received:function(reply) {
		 if (typeof(reply)!="string") {
			 this.lastResponse=reply;
			 var items=reply.getElementsByTagName("item");
			 for(var i=0;i<items.length;i++) {
				 var type=items[i].getElementsByTagName("type")[0].childNodes[0].nodeValue;
				 var content=items[i].getElementsByTagName("content")[0].childNodes[0].nodeValue;
				 switch(type) {
					 case "script":
					 	eval(content);
					 break;
					 case "replace":
				 		var target=items[i].getElementsByTagName("target")[0].childNodes[0].nodeValue;
					 	//$(target).html(content);
						var tar=$(target).get(0);
				 		var completes=items[i].getElementsByTagName("complete");
						var complete=function() {};
						if (completes.length>0) eval('complete=function() {'+completes[0].childNodes[0].nodeValue+'}');
						
						if (tar.centered) {
	 						this.insertHTML(tar,content,{centeredContainer:(tar.centered.opts.centered?tar.centered:null),complete:complete});
						}else{
	 						this.insertHTML(tar,content,{stretchWidth:false,complete:complete});
						}
					 break;
					 case "append":
				 		var target=items[i].getElementsByTagName("target")[0].childNodes[0].nodeValue;
					 	$(target).html(content);
						if (content!="") {
							$(target).slideDown();
						}else{
							$(target).slideUp();
						}
					 break;
					 case "prepend":
				 		var target=items[i].getElementsByTagName("target")[0].childNodes[0].nodeValue;
					 	$(target).html(content);
						if (content!="") {
							$(target).slideDown();
						}else{
							$(target).slideUp();
						}
					 break;
				 }
			 }
		 }
     },
     getCookie:function(name) {
         var gc=new RegExp(name+'=([^;]*)');
         var matches=null;
         if (matches=document.cookie.match(gc)) {
             return matches[1];
         }else{
             return '';
         }
     },
     setCookie:function(cookieName,cookieValue,nDays) {
          var today = new Date();
          var expire = new Date();
          if (nDays==null || nDays==0) nDays=1;
          expire.setTime(today.getTime() + 3600000*24*nDays);
          document.cookie = cookieName+"="+escape(cookieValue)
                          + ";expires="+expire.toGMTString();
     },
     deleteCookie:function( name, path, domain ) {
         document.cookie = name + "=" +( ( path ) ? ";path=" + path : "") +( ( domain ) ? ";domain=" + domain : "" ) +";expires=Thu, 01-Jan-1970 00:00:01 GMT";
     },
     holdingArea:document.createElement("DIV"),
     createHTML:function(html) {
         var tar=document.body;
         if (arguments.length>1) tar=arguments[1];
         this.holdingArea.innerHTML=html;
         var op=[];
         for(var o=0;o<this.holdingArea.childNodes.length;o++) {
             if (this.holdingArea.childNodes[o].tagName) {
                 op.push(this.holdingArea.childNodes[o]);
                 //tar.appendChild(this.holdingArea.childNodes[o]);
             }
         }
         for(o=0;o<op.length;o++) tar.appendChild(op[o]);
         this.holdingArea.innerHTML='';
         return op;
     },
     appendReplacekeyValues:function(op,ip) {
         for(var k in ip) {
         	op[k]=ip[k];
         }
         return op;
     },
     keyValueClone:function(ip) {
         var op={};
         for(var k in ip) {
         	op[k]=ip[k];
         }
         return op;
     },
     verboseFilesize:function(s) {
         if (s<1024) {
             return s+" bytes";
         }else if (s<1048576) {
             return (s/1024).toFixed(1)+" kB";
         }else{
             return (s/1048576).toFixed(1)+" MB";
         }
     },
	 screened:{
		 object:null,
         defaultParams:{
             opacity:0.5,
             clickClose:true,
             closeFunction:function() {}
		 },
		 show:function() {
			 var opts=eez.keyValueClone(this.defaultParams);
             if (arguments.length>0) opts=eez.appendReplacekeyValues(opts,arguments[0]);
             if (this.object===null) {
				 this.object=document.createElement("DIV");
				 $(this.object).addClass("screened");
			 }
			 this.object.opts=opts;
			 $(this.object).css("opacity",0);
			 document.body.appendChild(this.object);
			 $(this.object).animate({opacity:opts.opacity});
			 if (opts.clickClose) $(this.object).bind("click",function() {eez.screened.hide(true);});
		 },
		 hide:function() {
			 var doCloseFunction=(arguments.length>0 && arguments[0]);
			 if (doCloseFunction) this.object.opts.closeFunction();
			 $(this.object).animate({opacity:0},{duration:eez.animation.speed,complete:function() {$(this).remove();}});
			 this.object=null;
		 }
	 },
     blackout:{
         object:null,
         defaultParams:{
             opacity:0.5,
             clickClose:true,
             closeFunction:true},
         currentParams:{},
         visible:false,
         show:function() {
             this.currentParams=eez.keyValueClone(this.defaultParams);
             if (arguments.length>0) {
                
  this.currentParams=eez.appendReplacekeyValues(this.currentParams,arguments[0]);
             }
             if (this.object===null) this.object=eez.createHTML('<div id="coreBlackout">&nbsp;</div>')[0];
             $(this.object).css('opacity',0);
             this.object.style.display='block';
            $(this.object).animate({opacity:this.currentParams.opacity});
 // fade.start([this.object],{from:0,to:this.currentParams.opacity,step:this.currentParams.inStep});
             if (this.currentParams.clickClose) {
				 $(this.object).bind("click",function() {
					if ($(this).css("display")!="none") eez.blackout.hide();
				 });
			 }
             this.visible=true;
         },
         hide:function() {
             if (this.visible) {
                 this.visible=false;
                 if (this.currentParams.clickClose) $(eez.blackout.object).unbind('click');
                
            	$(this.object).animate({opacity:0},function() {$(this).css("display","none");});
                 if (typeof(this.currentParams.closeFunction)=="function") this.currentParams.closeFunction();
             }
             this.visible=false;
         }
     },
     centered:function(o) {
         var scr=[$(window).scrollTop(),$(window).scrollLeft()];
         if ($(o).css('position')=="fixed") scr=[0,0];
         var wh = $(window).height();
         var t=(o.clientHeight>wh)?scr[1]:((wh-o.clientHeight)/2)+scr[1];
         if (t<10) t=10;
         var l=((document.body.offsetWidth-o.clientWidth)/2);
         if (l<0) l=0;
         l+=scr[0];
         $(o).css("left",l+"px");
         $(o).css("top",t+"px");
     },
	 insertHTML:function(obj,html) {
		 if (typeof(obj)=="string") obj=$(obj).get(0);
		 var opts={stretchWidth:true,stretchHeight:true,centeredContainer:null,complete:function(){},unconstrain:true};
		if (arguments.length>2) opts=eez.appendReplacekeyValues(opts,arguments[2]);
		var w=$(obj).width();
		var h=$(obj).height();
		var overflow=$(obj).css("overflow");
		$(obj).css("overflow","hidden");
		$(obj).css("width",w+"px");
		$(obj).css("height",h+"px");
		var content=$(obj).html();
		$(obj).html(html);
		obj.newHTML=html;
		if (opts.stretchWidth) $(obj).css("width","auto");
		if (opts.stretchHeight) $(obj).css("height","auto");
		var nw=$(obj).width();
		var nh=$(obj).height();
		$(obj).html(content);
		$(obj).css("width",w+"px");
		$(obj).css("height",h+"px");
		if (opts.centeredContainer!==null) {
			$(obj).animate({width:nw+"px",height:nh+"px",opacity:0},{duration:eez.animation.speed,easing:eez.animation.easing,complete:function() {
				$(obj).html(obj.newHTML);
				$(obj).css("overflow",overflow);
				$(obj).animate({opacity:1},{complete:opts.complete});
			},step:function(now,fx) {eez.centered(opts.centeredContainer);}});
		}else{
			$(obj).animate({width:nw+"px",height:nh+"px",opacity:0},{duration:eez.animation.speed,easing:eez.animation.easing,complete:function() {
				$(obj).html(obj.newHTML);
				$(obj).css("overflow",overflow);
				$(obj).animate({opacity:1},{complete:opts.complete});
			}});
		}
		$(obj).animate({opacity:0},function() {
			$(obj).html(obj.newHTML);
			$(obj).css("overflow",overflow);
			$(obj).animate({opacity:1});
			if (opts.unconstrain) {
				$(obj).css("width","auto");
				$(obj).css("height","auto");
			}
		});
	 },
	 message:{
		 object:null,
		 objectContent:null,
		 buffer:[],
		 show:function(html) {
			this.buffer.push(html);
			if (this.buffer.length==1) this.animate();
		 },
		 checkObject:function() {
			if (this.object===null) {
				this.object=document.createElement("DIV");
				$(this.object).addClass("dropMessage");
				this.objectContent=document.createElement("DIV");
				$(this.objectContent).addClass("dropMessageContent");
				this.object.appendChild(this.objectContent);
				document.body.appendChild(this.object);
			}
		 },
		 animate:function() {
			 this.checkObject();
			 $(this.objectContent).html(this.buffer[0]);
			 $(this.object).css("display","block");
			 $(this.object).css("height",$(this.object).height()+"px");
			 $(this.object).css("top","-"+$(this.object).height()+"px");
			$(this.object).animate({top:'0px'},{duration:eez.animation.speed,easing:eez.animation.easing,complete:function() {
				setTimeout('eez.message.hide();',eez.messageOptions.duration);
			}});
		 },
		 hide:function() {
			$(this.object).animate({top:'-'+$(this.object).height()+'px'},{duration:eez.animation.speed,easing:eez.animation.easing,complete:function() {
				eez.message.buffer.pop();
				if (eez.message.buffer.length>0) {
					eez.message.animate();
				}else{
					$(eez.message.object).remove();
					eez.message.object=null;
					eez.message.objectContent=null;
				}
			}});
		 }
	 },
     scrollToElement:{
         scrolling:null,
         maxScroll:20,
         start:function(o) {
             if (arguments.length==2) this.maxScroll=arguments[1];
             var scrollloc=$(o).position().top;
             if (this.scrolling===null) this.scrolling=new Array(scrollloc,setTimeout("eez.scrollToElement.process()",2));
         },
         process:function() {
             if (this.scrolling!==null) {
                 var scrolls=eez.scrollPosition();
                 var ds=(this.scrolling[0]-scrolls[1])/3;
                 if (ds<- this.maxScroll) ds=- this.maxScroll;
                 if (ds> this.maxScroll) ds= this.maxScroll;
                 window.scrollTo(scrolls[0],scrolls[1]+ds);
                 if (eez.scrollPosition()[1]==scrolls[1]) ds=0;
                 if (ds<-1 || ds>1) {
  					this.scrolling[1]=setTimeout("eez.scrollToElement.process()",2);
                 }else{
                     this.scrolling=null;
                 }
             }
         }
     },
     scrollPosition:function() {
         var scrOfX=scrOfY=0;
        
  if(typeof(window.pageYOffset)=='number'){scrOfY=window.pageYOffset;scrOfX=window.pageXOffset;}else if(document.body&&(document.body.scrollLeft||document.body.scrollTop)){scrOfY=document.body.scrollTop;scrOfX=document.body.scrollLeft;}else if(document.documentElement&&(document.documentElement.scrollLeft||document.documentElement.scrollTop)){scrOfY=document.documentElement.scrollTop;scrOfX=document.documentElement.scrollLeft;}
            return [scrOfX,scrOfY];
     },
	 sendOrderUpdate:function(url,cmd,order,parameters) {
		 	var params=cmd;
			//console.log(order);
			this.appendReplacekeyValues(params,parameters);
			eez.ajax({url:'',data:params});
	 },
	 elementParentWith:function(o,opt) {
		if (o==document.body) return false;
		if (opt.id && o.id==opt.id) {
			return o;
		}else if (typeof(opt.className)=="string" && $(o).hasClass(opt.className)) {
			return o;
		}else if (typeof(opt.className)=="object") {
			for(var c=0;c<opt.className.length;c++) {
				if ($(o).hasClass(opt.className[c])) return o;
			}
		}
		return eez.elementParentWith(o.parentNode,opt);
	 },
	 childOf:function(child,parent) {
		if (child===null) return false;
		if (child==document.body) return false;
		if (parent.length!=undefined) {
			for(var i=0;i<parent.length;i++) {
				if (child==parent[i]) return true;
			}
		}else{
			if (child==parent) return true;
		}
		return eez.childOf(child.parentNode,parent);
	 },
	 keyType:function(e) {
		var kc=e.which;
		var k={};
		k.inputNavigation=(kc==8 || kc==46 || kc==37 || kc==39 || kc==16 || kc==9 || kc==36 || kc==35);
		k.number=((kc>=96 && kc<=105)||(kc>=48 && kc<=57));
		k.decimal=(k.number || kc==190 || kc==110);
		k.numeric=k.number || k.decimal || kc==189;
		k.hex=k.number || (kc>=65 && kc<=70);
		k.letter=(kc>=65 && kc<=90);
		k.enter=kc==13;
		return k;
	 }
};
function xhr(args) {
	this.args=args;
	this.request=null;
	var complaint=[];
	if (!args.type) args.type="POST";
	if (!args.url && args.url!="") complaint.push("Parameter url missing in AJAX call");
	var params='';
	var fd=new FormData();
	for(var p in args.parameters) {
		if (typeof(args.parameters[p])=="string" || typeof(args.parameters[p])=="number") {
			fd.append(p,args.parameters[p]);
		}else{
			
			var arr=[];
			if (p=='files') {
				arr=args.parameters[p];
				for(var f=0;f<arr.length;f++) {
					fd.append(p,arr[f]);
				}
			}else{
				if(args.parameters[p].length) {
					arr=args.parameters[p];
				}else{
					arr=[args.parameters[p]];
				}
				for(var f=0;f<arr.length;f++) {
					fd.append(p+'[]',arr[f]);
				}
			}
		}
	}
	this.request=new XMLHttpRequest();
	this.request.open(args.type,args.url,true);
	this.request.args=this.args;
	this.request.onreadystatechange=function() {
		if (this.readyState==4) {
			r=this.responseText;
			this.getAllResponseHeaders();
			if (this.status==200) {
				r=this.responseText;
			}
			if (this.args.complete) {
				this.args.complete(r);
			}
		}
	};
	if (this.args.progress) {
		var eSource=this.request.upload || this.request;
		eSource.xhr=this.request;
		$(eSource).bind('progress',function(e) {
			var p={loaded:e.originalEvent.loaded,total:e.originalEvent.total,percent:(e.originalEvent.loaded/e.originalEvent.total)*100};
			e.target.xhr.args.progress(p);
		});
	}
	this.request.send(fd);
}
/*function http(args) {
	this.args=args;
	this.request=null;
	var complaint=[];
	if (!args.type) args.type="POST";
	if (!args.url && args.url!="") complaint.push("Parameter url missing in AJAX call");
	var params='';
	var paramArray=[];
	var objectData='';
	var hasFile=false;
	if (args.parameters && complaint.length==0) {
		var boundary = '---------------------------' + (new Date).getTime();
		var dashdash = '--';
		var crlf     = '\r\n';
		var builder = '';
		//console.log(args.parameters);
		for(var p in args.parameters) {
			//console.log(typeof(args.parameters[p]));
			if (typeof(args.parameters[p])=="string" || typeof(args.parameters[p])=="number") {
				paramArray.push(p+"="+escape(args.parameters[p]));
				builder += crlf+dashdash+boundary+crlf;
				builder += 'Content-Disposition: form-data; name=\"'+p+'\"';
				//builder += crlf;
				builder += crlf+crlf; 
				builder += escape(args.parameters[p]);
				//builder += crlf+dashdash+boundary+crlf;
			}else{
				var files=[];
				if (args.parameters[p].files) {
					files=args.parameters[p].files;
				}else if(args.parameters[p].length) {
					files=args.parameters[p];
				}else{
					files=[args.parameters[p]];
				}
				for(var f=0;f<files.length;f++) {
					
					hasFile=true;
					var file=files[f];
					
			
				
					builder += crlf+dashdash+boundary+crlf;
					 
					builder += 'Content-Disposition: form-data; name=\"'+p+'\"';
					if (file.file.name) {
					  builder += '; filename=\"' + unescape(encodeURIComponent(file.file.name)) + '\"';
					}
					builder += crlf;
					builder += 'Content-Type: '+file.file.type;
					builder += crlf+crlf; 
					builder += file.result;
					//builder += crlf+boundary+dashdash+crlf;
				}
			}
		}
		builder += crlf+dashdash+boundary+dashdash+crlf;
		objectData='Content-Type: multipart/form-data; boundary=' + boundary;
		objectData+=crlf+'Content-Length: '+builder.length;
		objectData+=crlf+builder;
	}
	params=paramArray.join('&');
	if (complaint.length>0) {
		//for(var c=0;c<complaint.length;c++) console.log(complaint[c]);
	}else{
		args.url+="?rand="+new Date().valueOf()+((args.type=='GET')?"&"+params:'');
		if (window.XMLHttpRequest){
			this.request=new XMLHttpRequest();
		}else if (window.ActiveXObject){
			this.request=new ActiveXObject("Microsoft.XMLHTTP");			
		}
		this.request.args=this.args;
		if (this.request) {
			this.request.onreadystatechange=function() {
				if (this.readyState==4) {
					r=this.responseText;
					this.getAllResponseHeaders();
					if (this.status==200) {
						r=this.responseText;
					}
					if (this.args.complete) {
						this.args.complete(r);
					}
				}
			};
			var eSource=this.request.upload || this.request;
			eSource.xhr=this.request;
			$(eSource).bind('progress',function(e) {
				var p={loaded:e.originalEvent.loaded,total:e.originalEvent.total,percent:(e.originalEvent.loaded/e.originalEvent.total)*100};
				//console.log(e.originalEvent);
				e.target.xhr.args.progress(p);
			});
			this.request.open(args.type,args.url,true);
			if (hasFile) {
				this.request.setRequestHeader('Content-Type', 'multipart/form-data; boundary=' + boundary);
				//this.request.sendAsBinary(objectData);
				this.request.send(objectData);
			}else{
				this.request.setRequestHeader("Content-Type","application/x-www-form-urlencoded; charset=UTF-8");
				if (args.type=="POST") {
					this.request.send(params);
				}else{
					this.request.send();
				}
			}
		}
	}
}*/
