var dooit={
	sitefolder:'',
	// my libraries that are required
	dependencies:[],
	// the overlay stylesheets
	stylesheets:[],
	stylesheetTags:[],
	cachedFileElements:[],
	saveValues:[],
	saved:false,
	loaded:null,
	visible:false,
	ready:false,
	lastHTML:'',
	dependenciesChecked:false,
	temporaryVariable:[],
	addTags:[],
	removeTags:[],
	isSnapshot:false,
	canSnapshot:true,
	noscroll:true,
	onclose:null,
	item:null,
	jquery:{
		url:'../overlay/jquery-1-6-2-min.js',
		version:'1.6.2',
		fetched:false
	},
	swfobject:{
		jqurl:'../overlay/jq-swfobject.js',
		googleurl:'overlay/swfobject.js',
		fetched:false,
		jquery:false
	},
	init:function(opts) {
		this.item=yoodoo.bookcase.fetchDooit(yoodoo.lastLoad);
		this.canSnapshot=true;
		this.done=function(){return true;};
		this.noscroll=false;
		this.onclose=null;
		this.xport=function() {};
		yoodoo.dropExport();
		/*while(this.cachedFileElements.length>0) {
			var ft=this.cachedFileElements.pop();
console.log(ft);
			ft.parentNode.removeChild(ft);
		}*/
		this.commenterCalledBy=null;
		this.commentsLoaded=false;
		this.isSnapshot=false;
		this.saved=false;
		this.findSnapshot();
		this.loaded=function(){};
		if (opts.finished) {
			eval('this.finished=function() {if ('+opts.finished+'!=undefined) {return '+opts.finished+'();}else{return true;}};');
		}else{
			this.finished=function(){var vals=dooit.values();return ((vals!='') && (vals!='[]') && (vals!='{}'));};
		}
		if (opts.leave) {
			eval('this.leave=function() {if ('+opts.leave+'!=undefined) {return '+opts.leave+'();}else{return true;}};');
		}else{
			this.leave=function(){};
		}
		if (opts.destroy) {
			eval('this.destroy=function() {yoodoo.changed_users_totals();if ('+opts.destroy+'!=undefined) {'+opts.destroy+'();};yoodoo.eraseDooit();');
		}else{
			this.destroy=function(){yoodoo.changed_users_totals();yoodoo.eraseDooit();};
		}
		if (opts.displayed) {
			eval('this.displayed=function() {if ('+opts.displayed+'!==undefined) {return '+opts.displayed+'();}else{return true;}};');
		}else{
			this.displayed=function(){};
		}
		var dependencies=[];
		if(opts.dependencies) dependencies=opts.dependencies;
		if(opts.js) {
			for(var i=0;i<opts.js.length;i++) {
				if (typeof(opts.js[i])=="string") {
					if(typeof(opts.jsUrl)!="undefined" && opts.jsUrl!="") opts.js[i]=opts.jsUrl+opts.js[i];
					dependencies.push([opts.js[i],false]);
				}else if (typeof(opts.js[i][1])=="string") {
					if(typeof(opts.jsUrl)!="undefined" && opts.jsUrl!="") opts.js[i][0]=opts.jsUrl+opts.js[i][0];
					dependencies.push([opts.js[i][0],false]);
				}else{
					if(typeof(opts.jsUrl)!="undefined" && opts.jsUrl!="") opts.js[i][0]=opts.jsUrl+opts.js[i][0];
					dependencies.push(opts.js[i]);
				}
			}
		}
		if(opts.css) {
			for(var i=0;i<opts.css.length;i++) {
				if (typeof(opts.css[i])=="string") {
					if(typeof(opts.cssUrl)!="undefined" && opts.cssUrl!="") opts.css[i]=opts.cssUrl+opts.css[i];
					dependencies.push([opts.css[i],false]);
				}else if (typeof(opts.js[i][1])=="string") {
					if(typeof(opts.cssUrl)!="undefined" && opts.cssUrl!="") opts.css[i][0]=opts.cssUrl+opts.css[i][0];
					dependencies.push([opts.css[i],false]);
				}else{
					if(typeof(opts.cssUrl)!="undefined" && opts.cssUrl!="") opts.css[i][0]=opts.cssUrl+opts.css[i][0];
					dependencies.push(opts.css[i]);
				}
			}
		}
		if (opts.loaded) this.loaded=opts.loaded;
		if (opts.done) this.done=opts.done;
		if (opts.saveValues) this.saveValues=opts.saveValues;
		if (opts.noscroll) this.noscroll=opts.noscroll;
		if (opts.close) this.onclose=opts.close;
		if (this.noscroll) $('#yoodooScrolledArea').css({overflow:"hidden"});
		yoodoo.dooitFiles=yoodoo.checkDependencies(dependencies,function(complete) {
			if (complete) {
				dooit.ready();
			}else{
				dooit.failed();
			}
		});
		//this.cachedFileElements=yoodoo.checkDependencies(dependencies,dooit.ready,dooit.failed);
		//for(var f in this.cachedFileElements) {
		/*for(var f in cachedElements) {
			yoodoo.dooitFiles.push(cachedElements[f]);
		}*/
	},
	close:function() {
		$('#yoodooScrolledArea').find("object").remove();
		if (this.noscroll) $('#yoodooScrolledArea').css({'overflow-y':"auto",'overflow-x':"hidden"});
		if (this.onclose!==null) {
			if (typeof(this.onclose)=="string") {
				try{
					eval(this.onclose);
				}catch(e){}
			}else{
				this.onclose();
			}
		}
	},
	findSnapshot:function() {
		if (dooitInformation.snapshot!=undefined && dooitInformation.snapshot!="") {
			var data='';
			try{
				eval('data='+dooitInformation.snapshot.replace(/&apos;/g,"'")+';');
			}catch(e){}
			if(typeof(data)=="object") {
				this.isSnapshot=true;
				for(var k in data) {
					array_of_fields[k]=data[k];
				}
			}
		}
	},
	snapshotData:function() {
		if (this.canSnapshot) {
			var data=dooit.values({encode:false,withTags:false}); // do not base64 encode
			var vals=[];
			for(var k in data) {
				var i=k.replace(/^EF/,'');
				var n=dooit.getFieldName(i);
				if (n) vals.push("'"+n+"':["+i+",'"+data[k].replace(/'/,"\\'")+"']");
			}
			return Base64.encode('{'+vals.join(",")+'}');
		}
	},
	deleteSnapshotCallback:function(){},
	deleteSnapshot:function (snapshotId,callback) {
		if (this.canSnapshot) {
			this.deleteSnapshotCallback=callback;
			//var dooit=yoodoo.bookcase.items[yoodoo.bookcaseIndex('dooit',yoodoo.lastLoad)];
			var p = {};
			//p.data=this.snapshotData();
			//p.contentid = dooit.content_id;
			p.snapshotId=snapshotId;
			p.cmd = yoodoo.cmd.deletesnapshot.server;
			p.callback='dooit.deleteSnapshotCallback';
			yoodoo.sendPost(null, p, false);
			yoodoo.events.trigger('snapshot',{dooit:dooit,value:p.data});
		}
	},
	createSnapshotCallback:function(){},
	createSnapshot:function (callback) {
		if (this.canSnapshot) {
			this.createSnapshotCallback=callback;
			var dooit=yoodoo.bookcase.items[yoodoo.bookcaseIndex('dooit',yoodoo.lastLoad)];
			var p = {};
			p.data=this.snapshotData();
			p.contentid = dooit.content_id;
			p.cmd = yoodoo.cmd.createsnapshot.server;
			p.callback='dooit.createSnapshotCallback';
			yoodoo.sendPost(null, p, false);
			yoodoo.events.trigger('snapshot',{dooit:dooit,value:p.data});
		}
	},
	saveSnapshot: function () {
		if (this.canSnapshot) {
			$(yoodoo.container).find('.overlayFooter #scrapbook').get(0).parentNode.keepOpen=true;
			this.closeCommenter();
			$(yoodoo.container).find('.overlayFooter .scrapbookOptions button#scrabookaddsnapshot').slideDown();
			var p = {};
			var data=dooit.values({encode:false,withTags:false}); // do not base64 encode
			var vals=[];
			for(var k in data) {
				var i=k.replace(/^EF/,'');
				var n=dooit.getFieldName(i);
				if (n) vals.push("'"+n+"':["+i+",'"+data[k].replace(/'/,"\\'")+"']");
			}
			p.data=Base64.encode('{'+vals.join(",")+'}');
			p.cmd = yoodoo.cmd.snapshot.server;
			p.content="Snapshot saved";
			if (arguments.length>0) p.content=arguments[0];
			p.exerciseid = yoodoo.lastLoad;
			p.returnComments = dooit.commentsLoaded?'0':'1';
			p.callback = dooit.commentsLoaded?'dooit.commentAdded':'dooit.gotComments';
			//p.callback = 'yoodoo.' + yoodoo.cmd.snapshot.callback;
			yoodoo.warning({html:"Capturing a snapshot..."});
			yoodoo.sendPost(null, p, false);
			yoodoo.events.trigger('snapshot',{dooit:yoodoo.bookcase.items[yoodoo.bookcaseIndex('dooit',p.exerciseid)],value:data});
		}
	},
	getFieldName: function (i) {
		if (array_of_fields!=undefined) {
			for(var k in array_of_fields) {
				if (array_of_fields[k][0]==i) {
					return k;
				}
			}
		}
		return false;
	},
	fetchComments:function() {
		var p = {};
		p.cmd = yoodoo.cmd.scrapcomments.server;
		p.exerciseid = yoodoo.lastLoad;
		p.callback = 'yoodoo.' + yoodoo.cmd.scrapcomments.callback;
		yoodoo.warning({html:"Fetching comments..."});
		yoodoo.sendPost(null, p, false);
	},
	commentsLoaded:false,
	gotComments:function(reply) {
		this.commentsLoaded=true;
		yoodoo.hideWarning();
		var mh=yoodoo.option.height-200;
		//if (mh<30) mh=0;
		$($(yoodoo.container).find(".overlayFooter .scrapbookComments").get(0).parentNode).css({"max-height":mh,overflow:'auto'});
		var comments=[];
		try{
			eval('comments='+reply.replace(/&amp;/g,'&')+';');
		}catch(e) {}
		if(comments.length==0) {
			$(yoodoo.container).find(".overlayFooter .scrapbookComments").html("<div class='emptyMessage'>No comments found</div>");
			$($(yoodoo.container).find(".overlayFooter .scrapbookComments").get(0).parentNode.parentNode).slideDown();
			/*if ($(yoodoo.container).css("display")=="none") $(yoodoo.container).slideDown(function() {
				setTimeout('$(yoodoo.container).slideUp();',3000);
			});*/
		}else{
			var ins='';
			for(var c=0;c<comments.length;c++) {
				ins+=this.commentLayout(comments[c]);
			}
			$(yoodoo.container).find(".overlayFooter .scrapbookComments").html(ins);
			//if ($(yoodoo.container).css("display")=="none") 
				$($(yoodoo.container).find(".overlayFooter .scrapbookComments").get(0).parentNode.parentNode).slideDown();
		}
	},
	commentLayout:function(com) {
		var ins='';
		if (/^new Date/.test(com.createdat)) {
			try{
				eval('com.createdat='+com.createdat+';');
			}catch(e){}
		}
		ins+="<div class='comment"+((com.owner!=undefined)?" inbox":" outbox")+((com.datasnapshotid!==null)?' hasSnapshot':'')+"' ";
		if (com.datasnapshotid!==null) ins+=" onclick='dooit.loadSnapshot("+com.datasnapshotid+")' ";
		ins+=">";
		ins+="<div class='when'>"+yoodoo.ago(com.createdat)+"</div>";
		if (com.owner!=undefined) ins+="<span class='from'>"+com.owner+"</span>: ";
		ins+=com.content;
		ins+="</div>";
		return ins;
	},
	fetchingSnapshotId:null,
	loadSnapshot:function(snapshotId) {
		this.fetchingSnapshotId=snapshotId;
		var dooitId=yoodoo.lastLoad;
		if (arguments.length>1) dooitId=arguments[1];
		yoodoo.hide(function() {
			yoodoo.lastLoad='';
			yoodoo.showDooit(dooitId,dooit.fetchingSnapshotId);
		});
	},
	commenterCalledBy:null,
	commenter:function(o,snapshot) {
		this.closeCommenter();
		this.commenterCalledBy=o;
		var h=50;
		var scrolled=$(yoodoo.container).find(".overlayFooter .scrapbookComments").get(0).parentNode;
		var com=document.createElement("div");
		$(com).html((snapshot?"Posting a snapshot":"")+"<textarea>"+(snapshot?"My snapshot":"")+"</textarea><a href='javascript:void(0)'>"+(snapshot?"post snapshot":"post comment")+"</a> <a href='javascript:void(0)'>cancel</a>").addClass("commenter").css({display:'none'});
		o.parentNode.insertBefore(com,o);
		$(com).slideDown(function() {$(this).find("textarea").focus();});
		var mh=Math.round($(scrolled).height()-h);
		if (mh<30) mh=0;
		$(scrolled).animate({"max-height":mh});
		$(o).slideUp();
		$(com).find("a").get(0).snapshot=snapshot;
		$($(com).find("a").get(0)).bind("click",function() {
			var txt=$(this).prev("textarea");
			txt.val($.trim(txt.val()));
			if (txt.val()!="") {
				$(this).unbind("click");
				if(this.snapshot) {
					dooit.saveSnapshot(yoodoo.htmlEntities(txt.val()));
				}else{
					var now=new Date();
					var params={
						cmd:'manageScrapbook',
						method:'addComment',
						exerciseid:yoodoo.lastLoad,
						content:yoodoo.htmlEntities(txt.val()),
						created:now.getFullYear()+"-"+(1+now.getMonth())+"-"+now.getDate()+" "+now.getHours()+":"+now.getMinutes()+":"+now.getSeconds(),
						callback:'dooit.commentAdded'
					};
					yoodoo.sendPost(null,params);
					yoodoo.events.trigger('commentScrapbook',{content:txt.val(),dooit:yoodoo.bookcase.items[yoodoo.bookcaseIndex('dooit',yoodoo.lastLoad)]});
				}
			}
		});
		$($(com).find("textarea").get(0)).bind("keydown",function(e) {
			var kc=yoodoo.keyCode(e);
			if (kc.enter) e.preventDefault();
			return !kc.enter;
		});
		$($(com).find("textarea").get(0)).bind("keyup",function(e) {
			var kc=yoodoo.keyCode(e);
			if (kc.enter) {
				var txt=$(this);
				txt.val($.trim(txt.val()));
				if (txt.val()!="") {
					if($(this).next('a').get(0).snapshot) {
						dooit.saveSnapshot(yoodoo.htmlEntities(txt.val()));
					}else{
						var now=new Date();
						var params={
							cmd:'manageScrapbook',
							method:'addComment',
							exerciseid:yoodoo.lastLoad,
							content:yoodoo.htmlEntities(txt.val()),
							created:now.getFullYear()+"-"+(1+now.getMonth())+"-"+now.getDate()+" "+now.getHours()+":"+now.getMinutes()+":"+now.getSeconds(),

							callback:'dooit.commentAdded'
						};
						yoodoo.sendPost(null,params);
						yoodoo.events.trigger('commentScrapbook',{content:txt.val(),dooit:yoodoo.bookcase.items[yoodoo.bookcaseIndex('dooit',yoodoo.lastLoad)]});
					}
				}
			}
		});
		$($(com).find("a").get(1)).bind("click",function() {
			dooit.closeCommenter();
		});
	},
	commentAdded:function(reply) {
		yoodoo.hideWarning();
		var newComment='';
		try{
			eval('newComment='+reply.replace(/&amp;/g,'&')+';');
			var temp=document.createElement("div");
			$(temp).html(this.commentLayout(newComment));
			var com=$(temp).find('.comment').get(0);
			$(com).css({display:"none"});
			var box=$(yoodoo.container).find(".overlayFooter .scrapbookComments").get(0);
			var coms=$(box).find(".comment").get();
			$(box).find('.emptyMessage').slideUp(function() {$(this).remove();});
			if (coms.length==0) {
				box.appendChild(com);
				$(box).find('.comment').slideDown();
				dooit.closeCommenter();
			}else{
				box.insertBefore(com,coms[0]);
				$(box.parentNode).animate({scrollTop:0},function() {
					$($(box).find('.comment').get(0)).slideDown();
					dooit.closeCommenter();
				});
			}
		}catch(e){}
	},
	closeCommenter:function() {
		$(dooit.commenterCalledBy).slideDown();
		var h=50;
		var scrolled=$(yoodoo.container).find(".overlayFooter .scrapbookComments").get(0).parentNode;
		$(yoodoo.container).find('.commenter').slideUp(function() {$(this).remove();});
		$(scrolled).animate({"max-height":yoodoo.option.height-200});
	},

	ready:function() {
		dooit.loaded();
		yoodoo.displayDooit();
		if (dooitInformation.snapshotOwner!==null && dooitInformation.snapshotOwner!="") {
			yoodoo.warning({html:"Snapshot loaded from "+dooitInformation.snapshotOwner,autoClose:5000});
		}else if(dooitInformation.snapshot!==null) {
			yoodoo.warning({html:"Snapshot loaded. <em>NOT your current version</em>",autoClose:3000});
		}
	},
	failed:function() {
		alert("Some dependencies failed to load");
		yoodoo.working(false);
		yoodoo.hide();
	},
	temporaries:function(arr) {
		/*if(typeof(arr)=="object") {
			for(var i=0;i<arr.length;i++) {
				this.temporaryVariable.push(arr[i]);
			}
		}else{*/
			for(var i=0;i<arguments.length;i++) {
				this.temporaryVariable.push(arguments[i]);
			}
		//}
	},
	removeTemporaries:function() {
		while(this.temporaryVariable.length>0) {
			var tmp=this.temporaryVariable.pop();
			try{
				eval(tmp+'=undefined;');
			}catch(ex) {}
		}
	},
	console:function(txt) {
		if(typeof(yoodoo)!="undefined") yoodoo.console(txt);
	},
	getInputOutput:function() {
		var op={};
		var ips=$('form[name=exerciseForm]').find('input,textarea').get();
		var rads={};
		for(var k=0;k<ips.length;k++) {
			if (/\[\]$/.test(ips[k].name) && ips[k].name!="fields[]") {
				rads[ips[k].name.replace('[]','')]=true;
			}else{
				op[ips[k].name]=ips[k].value;
			}
		}
		for (var i in rads) {
			op[i]=getValue(i);
		}
		/*if (this.addTags.length>0) {
			op['addtags']=this.addTags.join(",");
		}
		if (this.removeTags.length>0) {
			op['removetags']=this.removeTags.join(",");
		}
		this.addTags=[];
		this.removeTags=[];*/
		return op;
	},
	values:function() {
		var encode=true;
		var withTags=true;
		var opts={};
		if (arguments.length>0) opts=arguments[0];
		if (opts.encode!==undefined) encode=opts.encode;
		if (opts.withTags!==undefined) withTags=opts.withTags;
		var op={};
		for(var p=0;p<this.saveValues.length;p++) {
			var arr={};
			if (typeof(this.saveValues[p])=="string") {
				eval('arr='+this.saveValues[p]+'(opts);');
			}else if (typeof(this.saveValues[p])=="function") {
				arr=this.saveValues[p](opts);
			}
			for(var k in arr) {
				if (encode) {
					op[k]=Base64.encode(arr[k]);
				}else{
					op[k]=arr[k];
				}
			}
		}
		if(withTags) {
			if (this.addTags.length>0) {
				op['addtags']=this.addTags.join(",");
			}
			if (this.removeTags.length>0) {
				op['removetags']=this.removeTags.join(",");
			}
			this.addTags=[];
			this.removeTags=[];
		}
		return op;
	},
	clearTagCache:function() {
		this.addTags=[];
		this.removeTags=[];
	},
	addTag:function(tag) {
		var ai=this.inAddTag(tag);
		var ri=this.inRemoveTag(tag);
		if (ri>=0) this.removeTags.splice(ri,1);
		if (ai<0) this.addTags.push(tag);
		yoodoo.debuggerz.addTag(tag);
	},
	removeTag:function(tag) {
		var ai=this.inAddTag(tag);
		var ri=this.inRemoveTag(tag);
		if (ai>=0) this.addTags.splice(ai,1);
		if (ri<0) this.removeTags.push(tag);
		yoodoo.debuggerz.removeTag(tag);
	},
	inAddTag:function(tag) {
		var idx=-1;
		for(var i=0;i<this.addTags.length;i++) {
			if (this.addTags[i]==tag) idx=i;
		}
		return idx;
	},
	inRemoveTag:function(tag) {
		var idx=-1;
		for(var i=0;i<this.removeTags.length;i++) {
			if (this.removeTags[i]==tag) idx=i;
		}
		return idx;
	},
	buildFields:function() {
		var f=obj('form[name=exerciseForm]');
		var vals=this.values();
		if (this.addTags.length>0) vals.addtags=this.addTags.join(",");
		if (this.removeTags.length>0) vals.removetags=this.removeTags.join(",");
		for(var k in vals) {
			if (typeof(vals[k])=="string") {
				var ip=$(f).fins('input[name='+k+'],textarea[name='+k+']').get();
				if (ip.length==0) {
					var newip=document.createElement("textarea");
					newip.style.display="none";
					newip.name=k;
					newip.id=k;
					newip.value=vals[k];
					//var newip=eez.createHTML('<textarea style="display:none" name="'+k+'" id="'+k+'">'+vals[k]+'</textarea>')[0];
					f.appendChild(newip);
					var newef=document.createElement("input");
					newef.type="hidden";
					newef.name="fields[]";
					newef.value=k.replace(/^EF/,'');
					f.appendChild(newef);
					//f.appendChild(eez.createHTML('<input type="hidden" name="fields[]" value="'+k.replace(/^EF/,'')+'" />')[0]);
				}else{
					ip[0].value=vals[k];
				}
			}
		}
	},
	finishable:function() {
		return this.finished();
	},
	radioValue:function(name) {
		var rads=$("input[type=radio]").get();
		for(var i=0;i<rads.length;i++) {
			if (rad[i].name==name) {
				if (rads[i].checked) {
					return rads[i].value;
				}
			}
		}
		return null;
	},
	setRadioValue:function(name,val) {
		var rads=$("input[type=radio]").get();
		if(!(/^EF\d/.test(name))) name="EF"+array_of_fields[name][0];
		for(var i=0;i<rads.length;i++) {
			if (rads[i].name==name+'[]') {
				if (rads[i].value==val) {
					rads[i].checked=true;
				}else if (rads[i].checked) {
					rads[i].checked=false;
				}
			}
		}
	},
	getRadioValue:function(name) {
		var val='';
		if(!(/^EF\d/.test(name))) name="EF"+array_of_fields[name][0];
		var rads=$("input[type=radio]").get();
		for(var i=0;i<rads.length;i++) {
			if(rads[i].name==name+'[]') {
				if(rads[i].checked) return rads[i].value;
			}
		}
		return "";
	},
	setSelectValue:function(elem,val) {
		$(elem).val(val);
	},
	show:function(id,display){
		if (display) {
			$('#'+id).slideDown();
		}else{
			$('#'+id).slideUp();
		}
	},
	checkBoxes:{},
	drawCheckBoxes:function(name) {
		var click=function(){return true;};
		if (arguments.length>1) click=arguments[1];
		//var tables=$("#exercise_content table.checkboxes").get();
		if (!(/^EF\d/.test(name))) name='EF'+array_of_fields[name][0];
		var these=$('table.checkboxes input[type=radio]').get();
		if (these.length>0) {
			var opts={items:[]};
			for(var i=0;i<these.length;i++) {
				if(these[i].name==name+"[]") {
					opts.items.push({element:these[i],checked:these[i].checked,value:these[i].value});
				}
			}
			var table=dooit.parentElement(opts.items[0].element,'checkboxes');
			var lbl=$(table).find('label').get();
			for(var l=0;l<lbl.length;l++) {
				if (l<opts.items.length) opts.items[l].label=$(lbl[l]).html();
			}
			var t=document.createElement("table");
			$(t).addClass("checkselector");
			$(t).css('float','right');
			$(t).css('width','auto');
			t.id="check"+name;
			//var ins="<table class='checkselector' style='float:right;width:auto' id='check"+name+"'><tr>";
			var ins="<tr>";
			for(i=0;i<opts.items.length;i++) {
				ins+="<td id='"+i+"' onclick='dooit.clickCheckbox(this)' class='"+((opts.items[i].checked)?"selected":"")+"'>"+opts.items[i].label+"</td>";
			}
			ins+="</tr>";
			t.innerHTML=ins;
			table.parentNode.insertBefore(t,table);
			$(table).css("display","none");
			opts.click=click;
			dooit.checkBoxes[name]=opts;
		}
	},
	clickCheckbox:function(o) {
		var i=o.id;
		$(o).siblings('td.selected').removeClass("selected");
		$(o).addClass("selected");
		var t=dooit.parentElement(o,'checkselector');
		var name=t.id.replace(/^check/,'');
		var val='';
		for(var c=0;c<dooit.checkBoxes[name].items.length;c++) {
			if(i==c) {
				dooit.checkBoxes[name].items[c].checked=!dooit.checkBoxes[name].items[c].checked;
				val=dooit.checkBoxes[name].items[c].checked?dooit.checkBoxes[name].items[c].value:'';
			}else{
				dooit.checkBoxes[name].items[c].checked=false;
			}
			if (dooit.checkBoxes[name].items[c].checked) {
				$(dooit.checkBoxes[name].items[c].element).addClass("selected");
			}else{
				$(dooit.checkBoxes[name].items[c].element).removeClass("selected");
			}
		}
		dooit.setRadioValue(name,val);
		dooit.checkBoxes[name].click();
	},
	parentElement:function(o,c) {
		if(typeof(o)=="undefined") return document.body;
		if(o==document.body) return document.body;
		if ($(o).hasClass(c)) return o;
		return dooit.parentElement(o.parentNode,c);
	},
     keyCode:function(e) {
	return yoodoo.keyCode(e);
	},
	/*
         var keycode;
         if (window.event) keycode = window.event.keyCode;
         else if (e) keycode = e.which;
         var key={
             code:keycode,
             alpha:(keycode>64 && keycode<91),
             space:(keycode==32),
             numeric:((keycode>47 && keycode<58)||(keycode>95 && keycode<106)),
             decimal:((keycode>47 && keycode<58)||(keycode>95 && keycode<106)||(keycode==189)||(keycode==190)||(keycode==110)),
             enter:(keycode==13),
             escape:(keycode==27),
            
  input:((keycode==190)||(keycode==188)||(keycode==192)||(keycode==111)||(keycode==192)||(keycode==191)||(keycode==107)||(keycode==187)||(keycode==189)||(keycode==106)||(keycode==110)||(keycode==220)||(keycode==223)||(keycode==222)||(keycode==221)||(keycode==219)||(keycode==186)),
             tab:(keycode==9),
             shift:(keycode==16),
             backspace:(keycode==8),
             del:(keycode==46),
             fkey:((keycode>111 && keycode<124)?keycode-111:false),
             home:(keycode==36),
             end:(keycode==35),
             up:(keycode==38),
             down:(keycode==40),
             left:(keycode==37),
             right:(keycode==39),
	     navigate:false
         };
         key.navigate=(key.left||key.right||key.del||key.backspace||key.shift||key.home||key.end||key.tab);
         return key;
     },*/
	json:function(o) {

		if (o===null || typeof(o)=="undefined") {
			return 'null';
		}else if (typeof(o)=="string") {
			return '"'+this.encode(o)+'"';
		}else if (o.getFullYear) {
			return 'new Date('+o.getFullYear()+','+o.getMonth()+','+o.getDate()+','+o.getHours()+','+o.getMinutes()+','+o.getSeconds()+')';
		}else if (typeof(o)=="number") {
			return ''+o;
		}else if (typeof(o)=="boolean") {
			return o?"true":"false";
		}else{
			var keyed=false;
			for(var k in o) {
				if (isNaN(k)) keyed=true;
			}
			var col=[];
			if (keyed) {
				for(var k in o) {
					col.push('"'+k+'":'+this.json(o[k]));
				}
			}else{
				for(var k in o) {
					col.push(this.json(o[k]));
				}
			}
			var op=col.join(",");
			if (keyed) {
				op='{'+op+'}';
			}else{
				op='['+op+']';
			}
			return op;
		}
	},
	encode:function(ip) {
		ip=ip.replace(/[\u2018\u2019]/g,"&sq;");
		ip=ip.replace(/[\u201C\u201D]/g,"&dq;");
		ip=ip.replace(/[\u2014]/g,"-");
		ip=ip.replace(/'/g,'&sq;');
		ip=ip.replace(/"/g,'&dq;');
		ip=ip.replace(/\\/g,'&bs;');
		ip=ip.replace(/\n/g,'&nl;');
		ip=ip.replace(/\r/g,'');
		return ip;
	},
	decode:function(ip) {
		var notJustString=false;
		if (arguments.length>1) notJustString=true;
		if (typeof(ip)=="string") {
			//ip=yoodoo.replaceMeta(ip);
			ip=ip.replace(/&sq;/g,"'");
			ip=ip.replace(/&apos;/g,"'");
			if (notJustString) {
				ip=ip.replace(/&dq;/g,'"');
			}else{
				ip=ip.replace(/&dq;/g,'\\"');
			}
			ip=ip.replace(/&nl;/g,"\n");
			ip=ip.replace(/&bs;/g,"\\");
			return ip;
		}else if (typeof(ip)=="object"){
			for(var i in ip) {
				ip[i]=this.decode(ip[i],true);
			}
		}
		return ip;
	},
	fetchJsonFromArray:function(key) {
		var val=array_of_fields[key][1].replace(/`/g,'&sq;');
		var obj=[];
		try{
			eval('obj='+val+';');
		}catch(err) {
			
		}
		obj=this.decode(obj);
		return [val,obj];
	},
	 insertTitle:function() {
		var title='';
		if (typeof(yoodoo.dooittitle!="undefined")) title=yoodoo.dooittitle;
		if(arguments.length>0) title=arguments[0];
		if (title!="") {
			var h2=document.createElement("h2");
			h2.innerHTML=title;
			$('.dooitDisplay').parent().prepend(h2);
		}
	},
	setExport:function(ex) {
		this.xport=ex;
		if (typeof(yoodoo)!="undefined") yoodoo.setExport();
	},
	xport:function() {
		
	}
};
