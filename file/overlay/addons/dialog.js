
dooit.temporaries('dialog');
var dialog={
	currentBox:null,
	defaultOptions:{
		object:null,
		id:"dialog",
		closeButton:true,
		centered:true,
		title:'',
		className:'dialog',
		clickCloseElements:'',
		closeCallback:function() {},
		draggable:true,
		withBlackout:true,
		withBlackoutClickClose:true,
		content:'Loading...',
		top:null,
		left:null,
		animationIn:['fadeIn',[500]],
		animationOut:['fadeOut',[500,function() {$(this).remove();}]]
	},
	show:function() {
		var opts=eez.keyValueClone(this.defaultOptions);
		if (arguments.length>0) opts=eez.appendReplacekeyValues(opts,arguments[0]);
		var obj=document.createElement("DIV");
		obj.closeCallback=opts.closeCallback;
		$(obj).addClass(opts.className);
		obj.id=opts.id;
		var html="";
		if (opts.closeButton || opts.title!="" || opts.draggable) {
			html+="<div class='head'>";
			if (opts.closeButton) html+="<div class='right close'></div>";
			if (opts.title!="") html+="<div class='title'>"+opts.title+"</div>";
			html+="</div>";
		}
		html+="<div class='content'>"+opts.content+"</div>";
		$(obj).html(html);
		obj.opts=opts;
		var cf={};
		if (opts.withBlackoutClickClose) {
			cf.closeFunction=function() {dialog.hide(true);};
		}else{
			cf.clickClose=false;
		}
		if (opts.clickCloseElements!="") $(obj).find(opts.clickCloseElements).bind("click",function() {dialog.hide();});
		if (opts.closeButton) $(obj).find('.close').bind("click",function() {dialog.hide();});
		if (opts.withBlackout) eez.screened.show(cf);
		document.body.appendChild(obj);
		if (opts.centered) {
			eez.centered(obj);
			$(obj).find('.content').get(0).centered=obj;
		}else{
			if (opts.left!==null) $(obj).css("left",opts.left+"px");
			if (opts.top!==null) $(obj).css("top",opts.top+"px");
		}
		if (opts.draggable) $(obj).draggable({handle:'.head',cursor:'move',drag:function(e,u) {dialog.currentBox.opts.centered=false;}});
		if (opts.animationIn.length>0) {
			var ani='';
			for(var a=0;a<opts.animationIn[1].length;a++) {
				if (ani!="") ani+=',';
				ani+='opts.animationIn[1]['+a+']';
			}
			//$(obj).css("opacity","0");
			eval('$(obj).'+opts.animationIn[0]+'('+ani+');');
		}
		this.currentBox=obj;
	},
	hide:function() {
		var removeblackout=true;
		if (arguments.length>0 && arguments[0]) removeblackout=false;
		var ani='';
		if (this.currentBox!==null) {
			if (this.currentBox.opts.draggable) $(this.currentBox).draggable("destroy");
			if (this.currentBox.opts.withBlackout && removeblackout) eez.screened.hide();
			this.currentBox.closeCallback();
			for(var a=0;a<this.currentBox.opts.animationOut[1].length;a++) {
				if (ani!="") ani+=',';
				ani+='this.currentBox.opts.animationOut[1]['+a+']';
			}
			if (this.currentBox.opts.animationOut.length>0) {
				eval('$(this.currentBox).'+this.currentBox.opts.animationOut[0]+'('+ani+');');
			}
			this.currentBox=null;
		}
	},
	insert:function(html) {
		eez.insertHTML($(this.currentBox).find(".content").get(0),html,{centeredContainer:this.currentBox.opts.centered?this.currentBox:null});
	}
};
