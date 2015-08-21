var uploader={
	target:'',
	parameters:{cmd:'uploaded_files'},
	options:{
		quantity:5,
		libraryFetch:3,
		prefix:'yoodoo',
		filter:'standard',
		title:'File uploader',
		callback:'',
		origin:''
	},
	containers:{
		library:null,
		upload:null
	},
	types:['image/jpeg','image/jpg','image/gif','image/png'],
	files:[],
	overwrite:[],
	imageDimensions:[100,100],
	elements:{
		dropzone:null,
		list:null,
		form:null,
		input:null
	},
	show:function() {
		this.files=[];
		this.getArguments(arguments);
		this.containers.library=$('#containerLibrary').get(0);
		this.containers.upload=$('#yoodoouploader').get(0);
		//dialog.show({id:this.options.prefix+'uploader',title:this.options.title,content:this.layout(),withBlackoutClickClose:false});
		this.elements.dropzone=$('#'+this.options.prefix+'uploader .'+this.options.prefix+'dropzone').get(0);
		this.elements.list=$('#'+this.options.prefix+'uploader .'+this.options.prefix+'filelist').get(0);
		this.elements.form=$('#'+this.options.prefix+'uploader form').get(0);
		this.elements.input=$(this.elements.form).find('input[type=file]').get(0);
		this.behaviours();
		this.library();
	},
	behaviours:function() {
		$(this.elements.input).bind("change",function() {uploader.addFiles(this.files);});
		//this.setDragOver();
	},
	setDragOver:function() {
        this.elements.dropzone.addEventListener("dragenter",  function(e) {uploader.stopProp(e,this);}, false);
        this.elements.dropzone.addEventListener("dragleave",  function(e) {uploader.dragExit(e,this);}, false);
        this.elements.dropzone.addEventListener("dragover",  function(e) {uploader.dragOver(e,this);}, false);
        this.elements.dropzone.addEventListener("drop",  function(e) {uploader.dropped(e,this);}, false);
	},
	stopDragOver:function() {
        this.elements.dropzone.removeEventListener("dragenter", false);
        this.elements.dropzone.removeEventListener("dragleave", false);
        this.elements.dropzone.removeEventListener("dragover", false);
        this.elements.dropzone.removeEventListener("drop", false);
	},
	stopProp:function(ev,o) {
        ev.stopPropagation();
        ev.preventDefault();
	},
	dragExit:function(ev,o) {
		uploader.stopProp(ev);
		$(o).removeClass("over");
	},
	dragOver:function(ev,o) {
		uploader.stopProp(ev);
		$(o).addClass("over");
	},
	dropped:function(ev,o) {
		$(o).removeClass("over");
		uploader.stopProp(ev);
		uploader.addFiles(ev.dataTransfer.files);
	},
	getArguments:function(args) {
		if (args.length>0) {
			if (args[0].options) this.options=eez.appendReplacekeyValues(this.options,args[0].options);
			if (args[0].parameters) this.parameters=eez.appendReplacekeyValues(this.parameters,args[0].parameters);
			if (args[0].target) this.target=args[0].target;
		}
	},
	layout:function() {
		var op="<form action method='post' enctype='multipart/form-data'><div class='"+this.options.prefix+"uploadbutton button'><div><input type='file' id='"+this.options.prefix+"filefield' name='"+this.options.prefix+"filefield' "+((this.options.quantity==1)?'':'multiple')+" /></div>select</div>";
		op+="</form>";
		op+="<div class='"+this.options.prefix+"dropzone'>";
		op+="<div class='"+this.options.prefix+"filelist'><div class='clear'></div></div>";
		op+="</div>";
		op+="<center><button type='button' onclick='uploader.upload()' class='button'>upload</button></center>";
		return op;
	},
	addFiles:function(files) {
		var toAdd=[];
		for(var i=0;i<files.length;i++) {
			if (uploader.types.indexOf(files[i].type)>=0) {
				var idx=uploader.fileIndex(files[i]);
				if (idx>=0) {
					var existing=$("#"+this.options.prefix+"uploader ."+this.options.prefix+"fileitem").get(idx);
					$(existing).css("opacity",0);
					$(existing).animate({opacity:1},500);
				}else{
					toAdd.push(files[i]);
					var info=new FileReader();
					info.file = files[i];
					info.onloadend = uploader.fileAdded;
					info.readAsDataURL(files[i]);
				}
			}
		}
		//this.checkPermissions(toAdd);
	},
	checkPermissions:function(files) {
		if (files.length>0) {
			var params={
				url:this.uploadPath(),
				dataType:'json',
				data:{
					cmd:'imagePermissions',
					repository:this.parameters.repository,
					filenames:[]
				},
				success:function(data) {uploader.filePermissions(data);},
			};
			for(var i=0;i<files.length;i++) {
				params.data.filenames.push(files[i].name);
			}
			//if (this.parameters.repository) params.data.repository=this.parameters.repository;
			eez.ajax(params);
		}
	},
	uploadPath:function() {
		return 'upload.php';
	},
	/*filePermissions:function(reply) {
		if(reply.warning!="") {
			if(console && console.log) console.log(reply.warning);
		}else{
			for(var i=0;i<reply.data.length;i++) {
				if (reply.data[i].file) {
					if (reply.data[i].overwrite) {
						uploader.fileOverwrite(reply.data[i].filename);
					}
				}else{
					for(var j=0;j<this.files.length;j++) {
						if (this.files[j].fileName==reply.data[i].filename) $($("#"+this.options.prefix+"uploader ."+this.options.prefix+"fileitem").get(j)).addClass("writenew");
					}
				}
			}
		}
	},
	fileOverwrite:function(filename) {
		for(var i=0;i<this.files.length;i++) {
			if (this.files[i].fileName==filename) {
				var fileitem=$("#"+this.options.prefix+"uploader ."+this.options.prefix+"fileitem").get(i);
				var ins=document.createElement("DIV");
				$(ins).addClass(this.options.prefix+"overwrite");
				$(ins).html("Overwrite the existing file?<br /><button type='button' class='button yes'>yes</button><button type='button' class='button no'>no</button>");
				fileitem.appendChild(ins);
				$(ins).find('button.yes').bind("click",function(){
					var idx=$(this.parentNode.parentNode).prevAll("."+uploader.options.prefix+"fileitem").get().length;
					uploader.overwrite[idx]=true;
					$(this.parentNode).slideUp(function() {$(this).remove();});
					$(this.parentNode.parentNode).addClass("writeover");
				});
				$(ins).find('button.no').bind("click",function(){
					var idx=$(this.parentNode.parentNode).prevAll("."+uploader.options.prefix+"fileitem").get().length;
					uploader.overwrite[idx]=false;
					$(this.parentNode).slideUp(function() {$(this).remove();});
					$(this.parentNode.parentNode).addClass("writenew");
				});
			}
		}
	},*/
	fileIndex:function(file) {
		var idx=-1;
		for(var i=0;i<this.files.length;i++) {
			if (this.files[i].fileName==file.fileName && this.files[i].fileSize==file.fileSize && this.files[i].lastModifiedDate.getTime()==file.lastModifiedDate.getTime()) idx=i;
		}
		return idx;
	},
	fileAdded:function(ev) {
		if (uploader.files.length<uploader.options.quantity) {
			uploader.files.push(ev.target.file);
			uploader.overwrite.push(false);
			var obj=uploader.fileItem(ev,ev.target.file);
			uploader.elements.list.insertBefore(obj,$(uploader.elements.list).find(">.clear").get(0));
			uploader.updateUploadButton();
		}
	},
	updateUploadButton:function() {
		if (uploader.files.length==0) {
			if ($('button.button.upload').css("display")!="none") {
				$('button.button.upload').slideUp();
			}
		}else{
			var q=uploader.files.length;
			var t="Upload "+q+" file"+((q==1)?'':'s');
			$('button.button.upload').html(t);
			if ($('button.button.upload').css("display")=="none") {
				$('button.button.upload').slideDown();
			}
		}
	},
	fileItem:function(e,f) {
		var op="";
		op+="<div class='padded5'>";
		op+="<div class='"+this.options.prefix+"overlay rounded3'>";
		op+="<div class='right close' onclick='uploader.remove(this.parentNode.parentNode.parentNode)'></div>";
		op+="<div class='"+this.options.prefix+"details'>";
		op+="<div class='"+this.options.prefix+"imagename'>"+f.name+"</div>";
		op+="<div class='"+this.options.prefix+"imagesize'>"+eez.verboseFilesize(f.size)+"</div>";
		op+="</div>";
		//op+="<div class='clear'></div>";
		op+="</div>";
		op+="<div class='"+this.options.prefix+"img rounded3'><img src='"+e.target.result+"' onload='uploader.imageLoaded(this);' /></div>";
		op+="<div class='writestatus'></div>";
		op+="<div class='"+this.options.prefix+"progress'><div class='"+this.options.prefix+"bar'></div></div>";
		op+="</div>";
		
		//console.log(f);
		//console.log(e.target);
		//op+="<img src='"+e.target.result+"' />";
		var obj=document.createElement("DIV");
		$(obj).addClass(this.options.prefix+"fileitem");
		//$(obj).addClass("rounded3");
		$(obj).css("position","absolute");
		$(obj).css("visibility","hidden");
		$(obj).html(op);
		return obj;
	},
	imageLoaded:function(img) {
		var w=$(img).width();
		var h=$(img).height();
		if (w>this.imageDimensions[0] || h>this.imageDimensions[1]) {
			var s=this.imageDimensions[0]/w;
			var sh=this.imageDimensions[1]/h;
			if (sh<s) s=sh;
			w=Math.round(s*w);
			h=Math.round(s*h);
			$(img).css("width",w+"px");
			$(img).css("height",h+"px");
		}
		var padleft=Math.floor(($(img.parentNode).width()-w)/2);
		var padtop=Math.floor(($(img.parentNode).height()-h)/2);
		$(img).css("margin",padtop+"px 0 0 "+padleft+"px");
		$(img.parentNode.parentNode.parentNode).css("position","");
		$(img.parentNode.parentNode.parentNode).css("visibility","visible");
		$(img.parentNode.parentNode.parentNode).css("display","none");
		$(img.parentNode.parentNode.parentNode).slideDown();
	},
	remove:function(obj) {
		$(obj).find('.'+this.options.prefix+'overlay').remove();
		var idx=$(obj).prevAll('div').get().length;
		this.files.splice(idx,1);
		$(obj).slideUp(1000,function() {
			$(this).remove();
		});
		uploader.updateUploadButton();
	},
	upload:function() {
		this.uploads=[];
		$('#yoodooLibrary').html('');
		$('#yoodooLibrary').css('display','block');
		$("."+uploader.options.prefix+"progress").css("display","block");
		for(var i=0;i<this.files.length;i++) {
			this.uploads.push(false);
			var data=uploader.parameters;
			data.cmd='uploaded_files';
			data.files=[this.files[i]];
			data.overwrite=this.overwrite[i]?"1":"0";
			data.thumbnailfilter='thumbnail';
			data.filter=this.options.filter;
			var progress=function(p){};
			var complete=function(r){};
			eval('progress=function(p) {var bar=$("."+uploader.options.prefix+"bar").get('+i+');$(bar).css("width",Math.round(p.percent)+"%");};');
			eval('complete=function(r) {var bar=$("."+uploader.options.prefix+"progress").get('+i+');$(bar).css("display","none");uploader.uploaded('+i+',r);};');
			new xhr({parameters:data,type:'POST',url:this.uploadPath(),progress:progress,complete:complete});
		}
	},
	uploaded:function(i,r) {
		var arr=[];
		try{
			eval('arr='+r+';');
		}catch(e){
			
		}
		this.uploads[i]=true;
		$($('.yoodoofilelist div').get(i)).animate({width:0},{duration:200});
		for(var i=0;i<arr.length;i++) {
			this.putInLibrary(arr[i]);
		}
		if (this.checkCompletedUpload()) {
			this.showSection($('button.section').get(0));
			$('.yoodoofilelist').html('');
			$('.yoodoouploadbutton').html($('.yoodoouploadbutton').html());
		}
	},
	checkCompletedUpload:function() {
		for(var i=0;i<this.uploads.length;i++) {
			if (!this.uploads[i]) return false;
		}
		return true;
		//console.log("Completed");
		//dialog.hide();
		//$("."+uploader.options.prefix+"fileitem").slideUp(function() {$(this).remove();});
	},
	library:function() {
		this.showSection($('button.section.library').get(0));
		var page=1;
		if (arguments.length>0) page=arguments[0];
		if (page==1 && $('#yoodooLibrary').html()!='') {
			$('#yoodooLibrary').slideUp(1000,function() {
				$(this).html('');
				$(this).css("display","block");
				$(this).css("height","");
				uploader.library();
			});
		}else{
			if ($('#yoodooLibrary button.more').get().length>0) {
				$('#yoodooLibrary button.more').slideUp(200,function() {$(this).remove();uploader.library(page);});
			}else{
				var data={};
				for(var k in uploader.parameters) data[k]=uploader.parameters[k];
				data.cmd='library';
				data.thumbnailfilter='thumbnail';
				data.filter=this.options.filter;
				data.page=page;
				data.quantity=this.options.libraryFetch;
				new xhr({parameters:data,type:'POST',url:this.uploadPath(),complete:function(r) {uploader.gotLibrary(r);}});
			}
		}
	},
	gotLibrary:function(r) {
		var reply=null;
		try{
			eval('reply='+r+';');
		}catch(e){
			// problem response
		}
		var lib=$('#yoodooLibrary').get(0);
		//$(lib).find("button.more").remove();
		if (reply!==null && reply.files!=undefined && reply.files.length) {
			this.libraryPage=parseInt(reply.page);
			for(var i=0;i<reply.files.length;i++) {
				this.putInLibrary(reply.files[i]);
			}
			if (reply.more) {
				var more=document.createElement("button");
				$(more).addClass("more");
				//$(more).css("display","none");
				more.innerHTML="more...";
				$(more).bind("click",function(e) {uploader.library(uploader.libraryPage+1);});
				$(more).css("height",0);
				lib.appendChild(more);
				$(more).animate({"height":80},{duration:500,step:function() {$('#yoodooLibrary').get(0).scrollTop=100000;}});
				//$(more).fadeIn();
			}
			//var st=$('#yoodooLibrary div').last().position().top+84-$('#yoodooLibrary').height();
			//$('#yoodooLibrary').animate({scrollTop:st},{duration:100});
		}
		//console.log(reply);	
	},
	putInLibrary:function(f) {
		var lib=$('#yoodooLibrary').get(0);
		var img=document.createElement("div");
		$(img).css("background-image","url("+f.file+")");
		$(img).addClass("thumbnail");
		$(img).css("height",0);
		img.source=f.source;
		img.title=f.title;
		lib.appendChild(img);
		$(img).bind("click",function() {
			if (uploader.options.callback!="") {
				var m=uploader.options.callback+"({title:'"+this.title+"',source:'"+this.source+"'});";
				parent.postMessage(m,'http://'+uploader.options.origin);
			}
		});
		$(img).animate({"height":80},{duration:500,step:function() {$('#yoodooLibrary').get(0).scrollTop=100000;}});
	},
	showSection:function(but) {
		if ($(but).hasClass("off")) {
			if($(but).hasClass("library")) {
				$(this.containers.library).slideDown();
				$(this.containers.upload).slideUp();
				this.stopDragOver();
			}else{
				$(this.containers.library).slideUp();
				$(this.containers.upload).slideDown();
				this.setDragOver();
			}
			$(but).removeClass("off");
			$(but).siblings('.section').addClass("off");
		}
	}
	/*sendUpload:function(ev) {
		var data=uploader.parameters;
		data.files=[ev.target];
		var progress=function(p) {
			console.log(p);
		}
		new xhr({parameters:data,type:'POST',url:'',progress:progress});
	}*/
};