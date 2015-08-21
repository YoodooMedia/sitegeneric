/*

//////////////////// sample calls /////////////////////////
	var sortables=[];
	$(document).ready(function(){
		setScroller('.scrollv');
		var opts={callback:function(order) {
		console.log(order);
		}
		,handle:'span'
		};
		sortables=makeSorters('li',opts);
	});
*/
var yoodoo_ui_loaded=true;
var monitoring={
	watching:[],
	delay:1000,
	timer:null,
	removeEmpty:true,
	started:false,
	start:function() {
		if (!this.started) this.timer=setTimeout("monitoring.check();",this.delay);
		this.started=true;
	},
	check:function() {
		if (this.removeEmpty) this.clear();
		for(var w=this.watching.length-1;w>=0;w--) {
			var element=this.watching[w].object;
			var ok=false;
			if (typeof(this.watching[w].checker)=="function") {
				try{
					ok=this.watching[w].checker(this.watching[w].object);
				}catch(ex) {
				}
			}else if (typeof(this.watching[w].checker)=="string") {
				eval('ok=('+this.watching[w].checker+');');
			}
			if (ok) this.watching[w].callback(this.watching[w].object);
		}
		this.timer=setTimeout("monitoring.check();",this.delay);
	},
	add:function(obj,checker,callback) {
		this.watching.push({object:obj,checker:checker,callback:callback});
		this.start();
	},
	remove:function(obj) {
		for(var w=this.watching.length-1;w>=0;w--) {
			if (this.watching[w].object==obj) {
				this.watching.splice(w,1);	
			}
		}
	},
	clear:function() {
		for(var w=this.watching.length-1;w>=0;w--) {
			if (this.watching[w].object===null || this.watching[w].object===undefined || this.watching[w].object.offsetParent===null) {
				this.watching.splice(w,1);	
			}
		}
	}
}
function makeSorters(selector) {
	var items=$(selector).get();
	var opts={};
	if (arguments.length>1) opts=arguments[1];
	if (typeof(opts.handle)=="undefined") opts.handle=null;
	if (typeof(opts.callback)=="undefined") opts.callback=function() {};
	var colls=[];
	var coll=[];
	var p=document.body;
	for(var i=0;i<items.length;i++) {
		if (items[i].parentNode!=p) {
			if (p!=document.body) colls.push(coll);
			coll=[items[i]];
			p=items[i].parentNode;
		}else{
			coll.push(items[i]);
		}
	}
	if (p!=document.body) colls.push(coll);
	var sorters=[];
	for(i=0;i<colls.length;i++) {
		var opt={};
		for(var o in opts) {
			opt[o]=opts[o];
		}
		opt.items=colls[i];
		sorters.push(new sorter(opt));
	}
	return sorters;
}
function sorter(opts) {
	this.items=[];
	this.objects=[];
	this.option={
		selector:null,
		handle:null,
		callback:null
	};
	if(typeof(opts.items)!="undefined") this.items=opts.items;
	for(var o in this.option) {
		if (typeof(opts[o])!="undefined") this.option[o]=opts[o];
	}
	//console.log(opts);
	if (this.items.length==0 && this.selector!='') this.items=$(this.option.selector).get();
	if (this.items.length>0) {
		for(var i=0;i<this.items.length;i++) {
			this.objects.push(new sortObject(this.items[i],this.option.handle,this));
		}
	}
}
function sortObject(o,h,s) {
	this.touch=typeof(window.ontouchstart)!="undefined";
	this.cssPosition=$(o).css("position");
	this.object=o;
	this.object.sourceSortObject=this;
	if (h===null) {
		this.handle=o;
	}else{
		this.handle=$(o).find(h).get(0);
	}
	$(this.object).addClass("sorter-object");
	$(this.handle).addClass("sorter-handle");
	this.handle.sourceObject=this.object;
	this.sorter=s;
	this.mouseOffset=[0,0]; // in relation to mouse position
	if (this.touch) {
		//$(this.handle).attr('ontouchstart','this.sourceObject.sourceSortObject.startDrag(event)');
		this.handle.addEventListener('touchstart', sorttoucherstart=function(e) {
		this.sourceObject.sourceSortObject.startDrag(e);
		});
	}else{
		$(this.handle).bind("mousedown",function(e) {
			this.sourceObject.sourceSortObject.startDrag(e);
		});
	}
	this.locator=null;
	this.performCallback=function() {
		var ordered=[];
		for(var i=0;i<this.object.parentNode.childNodes.length;i++) {
			if ($(this.object.parentNode.childNodes[i]).hasClass("sorter-object")) {
				ordered.push(this.object.parentNode.childNodes[i]);
			}
		}
		if (ordered.length>0) {
			this.sorter.option.callback(ordered);
		}
	}
	this.startDrag=function(e) {
		if (typeof(document.draggingObject)!="undefined" && document.draggingObject!==null) {
			document.draggingObject.drop(e);
		}
		var isie=false;
		this.clearSelection();
		var epos=this.eventLocation(e);
		if (isie) {
			window.event.cancelBubble=true;
			window.event.returnValue = false;
		}else{
			e.preventDefault();
		}
		this.locator=document.createElement("div");
		$(this.locator).addClass("sorter-placeholder");
		$(this.locator).css("height",$(this.object).outerHeight()+"px");
		$(this.locator).css("width",$(this.object).outerWidth()+"px");
		this.currentStyle=$(this.object).attr("style");
		$(this.object).css("width",$(this.object).width()+"px");
		$(this.object).css("height",$(this.object).height()+"px");
		$(this.object).css("position","fixed");
		$(this.object).addClass("sorter-dragging");
		this.scrollOffset={x:0,y:0};
		var offsetObj=this.object;
		var isNode=true;
		var pos=[0,0];
		while(isNode) {
			this.scrollOffset.x+=offsetObj.scrollLeft;
			this.scrollOffset.y+=offsetObj.scrollTop;
			if (offsetObj.parentNode==document.body) {
				isNode=false;
			}else{
				offsetObj=offsetObj.parentNode;
			}
		}
		offsetObj=this.object;
		isNode=true;
		while(isNode) {
			pos[0]+=offsetObj.offsetLeft;
			pos[1]+=offsetObj.offsetTop;
			if (offsetObj.offsetParent==document.body || offsetObj.offsetParent==null) {
				isNode=false;
			}else{
				offsetObj=offsetObj.offsetParent;
			}
		}
		this.mouseOffset[0]=epos.x-pos[0]+this.scrollOffset.x;
		this.mouseOffset[1]=epos.y-pos[1]+this.scrollOffset.y;
		var scrolls=[0,0];
		if (!this.touch) {
			if (document.body.scrollTop) {
				scrolls[0]=document.body.scrollLeft;
				scrolls[1]=document.body.scrollTop;
			}else if (document.documentElement.scrollTop) {
				scrolls[0]=document.documentElement.scrollLeft;
				scrolls[1]=document.documentElement.scrollTop;
			}
			this.mouseOffset[0]+=scrolls[0];
			this.mouseOffset[1]+=scrolls[1];
		}
		document.draggingObject=this;
		if (this.touch) {
			window.addEventListener('touchmove', sorttouchermove=function(e) {
				document.draggingObject.move(e);
			});
			window.addEventListener('touchend', sorttoucherstop=function(e) {
				document.draggingObject.drop(e);
			});
		}else{
			$(document).bind("mousemove",sorttouchermove=function(e) {
				e.preventDefault();
				document.draggingObject.move(e);
			});
			$(document).bind("mouseup",sorttoucherstop=function(e) {
				e.preventDefault();
				document.draggingObject.drop(e);
			});
		}
		this.move(e);
	}
	this.clearSelection=function() {
		if (window.getSelection) {
			window.getSelection().removeAllRanges();
		} else if (document.selection) {
			document.selection.empty();
		}
	}
	this.cancel=function(e) {
		if (this.touch) {
			window.removeEventListener('touchend',sorttoucherstop);
			window.removeEventListener('touchmove',sorttouchermove);
		}else{
			$(document).unbind("mouseup",sorttoucherstop);
			$(document).unbind("mousemove",sorttouchermove);
		}
		$(this.object).removeClass("sorter-dragging");
		$(this.object).attr("style",((typeof(this.currentStyle)=="undefined")?'':this.currentStyle));
		this.locator.parentNode.removeChild(this.locator);
		document.draggingObject=null;
		if (this.touch) {
			this.handle.removeEventListener('touchstart', sorttoucherstart);
			this.handle.addEventListener('touchstart', function(e) {
			this.sourceObject.sourceSortObject.startDrag(e);
			});
		}
		return false;
	}
	this.drop=function(e) {
		if (this.touch) {
			window.removeEventListener('touchend',sorttoucherstop);
			window.removeEventListener('touchmove',sorttouchermove);
		}else{
			$(document).unbind("mouseup",sorttoucherstop);
			$(document).unbind("mousemove",sorttouchermove);
		}
		$(this.object).removeClass("sorter-dragging");
		var idx=this.index(e);
		if (idx>=0) {
			this.object.parentNode.insertBefore(this.object,this.sorter.items[idx]);
		}else{
			this.object.parentNode.appendChild(this.object);
		}
		$(this.object).attr("style",((typeof(this.currentStyle)=="undefined")?'':this.currentStyle));
		this.locator.parentNode.removeChild(this.locator);
		this.performCallback();
		document.draggingObject=null;
		if (this.touch) {
			this.handle.removeEventListener('touchstart', sorttoucherstart);
			this.handle.addEventListener('touchstart', function(e) {
			this.sourceObject.sourceSortObject.startDrag(e);
			});
		}
		return false;
	};
	this.move=function(e) {
		var epos=this.eventLocation(e);
		var scrolls=[0,0];
		if (document.body.scrollTop) {
			scrolls[0]=document.body.scrollLeft;
			scrolls[1]=document.body.scrollTop;
		}else if (document.documentElement.scrollTop) {
			scrolls[0]=document.documentElement.scrollLeft;
			scrolls[1]=document.documentElement.scrollTop;
		}
		var eposs={x:epos.x-scrolls[0],y:epos.y-scrolls[1]};
		if(eposs.x<0 || eposs.y<0 || eposs.x>$(window).width() || eposs.y>$(window).height()) {
			this.cancel(e);
		}else{
			var ny=Math.round(epos.y-this.mouseOffset[1]);
			var nx=Math.round(epos.x-this.mouseOffset[0]);
			$(this.object).css("top",ny+"px");
			$(this.object).css("left",nx+"px");
			var idx=this.index(e);
			if (idx>=0) {
				this.object.parentNode.insertBefore(this.locator,this.sorter.items[idx]);
			}else{
				this.object.parentNode.appendChild(this.locator);
			}
		}
		return false;
	};
	this.eventLocation=function(e) {
		var x=e.changedTouches?e.changedTouches[0].pageX:(e.pageX?e.pageX:e.clientX);
		var y=e.changedTouches?e.changedTouches[0].pageY:(e.pageY?e.pageY:e.clientY);
		return {x:x,y:y};
	};
	this.index=function(e) {
		var epos=this.eventLocation(e);
		var minh=1000000;
		var idx=-1;
		var bottomItem=null;
		var cn=this.sorter.items[0].parentNode.childNodes.length-1;
		while(bottomItem===null && cn>=0) {
			if (this.sorter.items[0].parentNode.childNodes[cn]!=this.object) {
				var found=false;
				for(var i=0;i<this.sorter.items.length;i++) {
					if (this.sorter.items[0].parentNode.childNodes[cn]==this.sorter.items[i]) {
						found=true;
					}
				}
				if (found) bottomItem=this.sorter.items[0].parentNode.childNodes[cn];
			}
			cn--;
		}
		if (epos.y<$(bottomItem).offset().top+$(bottomItem).outerHeight()) {
			for(var i=0;i<this.sorter.items.length;i++) {
				if (this.sorter.items[i]!=this.object) {
					var pos=$(this.sorter.items[i]).offset();
					
					var h=Math.sqrt(Math.pow(epos.x-pos.left+($(this.sorter.items[i]).outerWidth()/2),2)+Math.pow(epos.y-pos.top+($(this.sorter.items[i]).outerHeight()/2),2));
					if (h<minh) {
						minh=h;
						idx=i;
					}
				}
			}
		}
		return idx;
	};
}
function setScroller(selector) {
	var objs=$(selector).get();
	var scrollers=[];
	for (var o=0;o<objs.length;o++) {
		scrollers.push(new scrollerObject(objs[o]));
	}
	
}
function scrollerObject(obj) {
	if (typeof(obj.scroller)!="undefined") {
		obj.scroller.locate();
		return null;
	}
	this.touch=typeof(window.ontouchstart)!="undefined";
	
	var vertical=false;
	var horizontal=false;
	this.scrollBarWidth=20;
	this.borderWidth=1;
	this.containter=null;
	this.verticalScroll={};
	this.horizontalScroll={};
	this.object=obj;
	obj.scroller=this;
	$(obj).css("overflow","hidden");
	
	if (arguments.length>1) {
		vertical=arguments[1];
	}else{
		vertical=($(obj).height()<obj.scrollHeight);
	}
	if (arguments.length>2) {
		horizontal=arguments[2];
	}else{
		horizontal=($(obj).width()<obj.scrollWidth);
	}
	this.container=document.createElement("DIV");
	$(this.container).css("width",$(obj).width()+"px");
	$(this.container).css("height",$(obj).height()+"px");
	
	var m=[$(obj).css("margin-top"),$(obj).css("margin-right"),$(obj).css("margin-bottom"),$(obj).css("margin-left")];
	$(this.container).css("margin",m.join(" "));
	$(obj).css("margin",'0');
	$(obj).css("width",($(obj).width()-(vertical?this.scrollBarWidth:0))+"px");
	if (vertical) {
		var rightBar=document.createElement("DIV");
		$(rightBar).addClass("verticalScroll");
		$(rightBar).css("float","right");
		$(rightBar).css("width",this.scrollBarWidth+"px");
		$(rightBar).css("height",$(obj).height()+"px");
		$(rightBar).html("<div class='button up' style='height:"+(this.scrollBarWidth-(2*this.borderWidth))+"px'>&#8743;</div><div class='scrollBack' style='height:"+($(obj).height()-(2*this.scrollBarWidth)-(2*this.borderWidth))+"px'><div class='button scrollButton'>&#926;</div></div><div class='button down' style='height:"+(this.scrollBarWidth-(2*this.borderWidth))+"px'>&#8744;</div>");
		this.container.appendChild(rightBar);
		$(rightBar).find(".button").css("margin","0");
		$(rightBar).find(".button").css("width",(this.scrollBarWidth-(2*this.borderWidth))+"px");
		$(rightBar).find(".button").css("padding","0");
		$(rightBar).find(".button").css("text-align","center");
		$(rightBar).find(".button").css("font-size","12px");
		$(rightBar).find(".button").css("cursor","pointer");
		$(rightBar).find(".button").css("border-radius","3px");
		$(rightBar).find(".button").css("border",this.borderWidth+"px solid #999");
		$(rightBar).find(".button").css("line-height",(this.scrollBarWidth-(2*this.borderWidth))+"px");
		this.verticalScroll.container=rightBar;
		this.verticalScroll.up=$(rightBar).find(".button.up").get(0);
		this.verticalScroll.up.scroller=this;
		this.verticalScroll.down=$(rightBar).find(".button.down").get(0);
		this.verticalScroll.down.scroller=this;
		this.verticalScroll.background=$(rightBar).find(".scrollBack").get(0);
		this.verticalScroll.slider=$(rightBar).find(".button.scrollButton").get(0);
		$(this.verticalScroll.background).css("position","relative");
		$(this.verticalScroll.slider).css("position","absolute");
		this.verticalScroll.slider.scroller=this;
		this.verticalScroll.offset=0;
		if (this.touch) {
			this.verticalScroll.slider.addEventListener('touchstart', sorttoucherstart=function(e) {
				var epos=this.scroller.eventLocation(e);
				this.scroller.verticalScroll.offset=epos.y-$(this).offset().top;
				this.scroller.verticalSet(e);
				document.scrollBarObject=this.scroller;
				document.addEventListener('touchmove', scrollbarMouseMove=function(e) {
					document.scrollBarObject.verticalSet(e);
				});
				document.addEventListener('touchend', scrollbarMouseUp=function(e) {
					document.scrollBarObject.verticalSet(e);
					document.scrollBarObject.drop(e);
				});
			});
		}else{
			this.verticalScroll.slider.addEventListener("mousedown",function(e) {
				var epos=this.scroller.eventLocation(e);
				this.scroller.verticalScroll.offset=epos.y-$(this).offset().top;
				this.scroller.verticalSet(e);
				document.scrollBarObject=this.scroller;
				$(document).bind("mousemove",scrollbarMouseMove=function(e) {
					document.scrollBarObject.verticalSet(e);
				});
				$(document).bind("mouseup",scrollbarMouseUp=function(e) {
					document.scrollBarObject.verticalSet(e);
					document.scrollBarObject.drop(e);
				});
			});
		}
		$(this.verticalScroll.up).bind("mousedown",function(e) {
			e.preventDefault();
			this.scroller.scrollY(-1);
		});
		$(this.verticalScroll.down).bind("mousedown",function(e) {
			e.preventDefault();
			this.scroller.scrollY(1);
		});
		this.drop=function(e) {
			if (this.touch) {
				document.removeEventListener('touchmove',scrollbarMouseMove);
				document.removeEventListener('touchend',scrollbarMouseUp);
			}else{
				$(document).unbind("mousemove",scrollbarMouseMove);
				$(document).unbind("mouseup",scrollbarMouseUp);
			}
			document.scrollBarObject=null;
		}
		this.locate=function() {
			var showvertical=($(obj).height()<obj.scrollHeight);
			if (showvertical) {
				$(this.verticalScroll).css("display","block");
				var butHeight=Math.floor(($(this.object).height()-(2*this.scrollBarWidth))*($(this.object).height()/this.object.scrollHeight));
				butHeight-=(2*this.borderWidth);
				$(this.verticalScroll.slider).css("height",butHeight+"px");
				$(this.verticalScroll.slider).css("line-height",butHeight+"px");
				var prop=this.object.scrollTop/(this.object.scrollHeight-$(this.object).height());
				this.object.oldScrollHeight=this.object.scrollHeight;
				var top=prop*(($(this.object).height()-(2*this.borderWidth)-(2*this.scrollBarWidth))-butHeight);
				$(this.verticalScroll.slider).css("top",Math.round(top)+"px");
			}else{
				$(this.verticalScroll).css("display","none");
			}
		}
		this.verticalSet=function(e) {
			e.preventDefault();
			var epos=this.eventLocation(e);
			var v=epos.y-this.verticalScroll.offset;
			var t=Math.round(v-this.top());
			if(t<0) t=0;
			var maxh=$(this.verticalScroll.background).height()-$(this.verticalScroll.slider).outerHeight();
			if(t>maxh) t=maxh;
			$(this.verticalScroll.slider).css("top",t+"px");
			var prop=t/maxh;
			var top=prop*(this.object.scrollHeight-$(this.object).height());
			this.object.scrollTop=Math.round(top);
			if (epos.x>$(window).width() || epos.x<0) this.drop(e);
			if (epos.y>$(window).height() || epos.y<0) this.drop(e);
		}
		this.scrollY=function(direction) {
			this.object.scrollTop+=(direction*($(this.object).height()/2));
			this.locate();
		}
		
		
		
		this.locate();
	}
	obj.parentNode.insertBefore(this.container,obj);
	this.container.appendChild(obj);
	
	
	this.top=function() {
		return $(this.verticalScroll.background).offset().top;
	}
	this.eventLocation=function(e) {
		var x=e.changedTouches?e.changedTouches[0].pageX:(e.pageX?e.pageX:e.clientX);
		var y=e.changedTouches?e.changedTouches[0].pageY:(e.pageY?e.pageY:e.clientY);
		return {x:x,y:y};
	};
	this.changed=function() {
		var itis=false;
		if (typeof(this.object.oldScrollHeight)!="undefined") {
			itis=(this.object.oldScrollHeight!=this.object.scrollHeight);
		}
		this.object.oldScrollHeight=this.object.scrollHeight;
		return itis;
	};
	//monitoring.add(this.object,'element.changed()',function(o) {o.scroller.locate();});
	monitoring.add(this.object,function(o) {return o.scroller.changed();},function(o) {o.scroller.locate();});
}
