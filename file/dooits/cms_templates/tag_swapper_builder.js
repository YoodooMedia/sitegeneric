var tag_swapper={
	containers:{
		main:null,
		options:null,
		structure:null
	},
	autosave:false,
	layout:"{\ndependencies:[\n['widgets/js/tag_swapper_widget.js',true],\n['widgets/css/tag_swapper_widget.css',true]\n--customcss--],\ncontinueControl:false,\nready:function(src) {\nsrc.object=new tag_swapper_widget(src);\n},\nkey:'',\noptions:{\n}\n}",
	value:{},
	schema:{
		main:{
			customCSS:{label:'Custom CSS url',initial:'',type:'text',description:'The filename of any custom CSS file in the widget/css folder.'},
			courses:{label:'Courses',initial:[],type:'course',description:'The selectable courses.',required:true},
			ignoreTags:{label:'Tags that are persistent across courses',initial:[],type:'tags',description:'The tags that are not affected by a change in course.'}
		},
		course:{
			elementType:{className:'course',sortable:true,deleteable:true},
			id:{initial:'tag_swapper.uniqueId()',type:'hidden'},
			title:{label:'Title',initial:'Course title',type:'text',description:'The title of the tag_swapper course.',affectButton:true},
			requiredTags:{label:'Available if tags',initial:[],type:'tags',description:'The tags required for this course to be available.'},
			selectedTags:{label:'Selected if tags',initial:[],type:'tagsReversible',description:'The tags that define this course. When selected, others courses will have their tags removed.'}
		},
		tags:{
			elementType:{className:'Tag',sortable:true,deleteable:true},
			tag:{label:'Tag name',initial:'',type:'tag',description:'The name of the tag.',affectButton:true,required:true}
		},
		tagsReversible:{
			elementType:{className:'Tag',sortable:true,deleteable:true},
			tag:{label:'Tag name',initial:'',type:'tag',description:'The name of the tag.',affectButton:true,required:true},
			tagNot:{label:'Must not have',initial:false,type:'boolean',description:'This tag is removed when the course is selected.',affectButton:true,required:true}


		}
	},
	ids:{},
	init:function() {
		if (typeof(recovery)!='undefined') {
			recovery.templateOutput=function() {return json.build(tag_swapper.value);};
			recovery.templateRestart=function() {tag_swapper.init();};
		}
		/*this.autosave=typeof(localStorage)!="undefined";
		if (this.autosave) {
			this.autosaveKey='globalFieldId'+$('input[name=globalFieldId]').val();
			if (localStorage[this.autosaveKey]!==undefined && localStorage[this.autosaveKey]!="") {
				if (window.confirm("Recover autosave data?")) {
					$('textarea#globalFieldContent').val(localStorage[this.autosaveKey]);
					localStorage[this.autosaveKey]='';
					tag_swapper.init();
					return false;
				}
			}
		}*/
		$('form#sf_admin_edit_form').submit(function(e) {
			return tag_swapper.save(e);
		});
		this.containers.main=$('.exerciseTemplate').get(0);
		$(this.ancester(this.containers.main,'form-row')).css({overflow:"visible"});
		var val=$('#globalFieldContent').val();
		try{
			eval('tag_swapper.value='+val+';');
		}catch(e) {}
		tag_swapper.value=json.decode(tag_swapper.value);
		this.build();
		this.adminbar();
	},
	adminbar:function() {
		this.containers.adminbar=document.createElement("div");
		$('#sf_admin_bar').append(this.containers.adminbar);
		$(this.containers.adminbar).html("<h3>Audio panel</h3>").css({'margin-top':'20px'});
		var but=document.createElement("button");
		$(but).attr("type","button");
		$(but).html("Get script file").bind("click",function() {
			tag_swapper.getScript();
		});
		this.containers.adminbar.appendChild(but);
		this.bulkUploader();
		this.libraryAudio();
		this.containers.matchedAudio=document.createElement("div");
		$(this.containers.matchedAudio).addClass("matchedAudio");
		$(this.containers.adminbar).append(this.containers.matchedAudio);
		this.checkAudioScripts();
	},
	libraryAudio:function() {
		this.containers.audioLibrary=document.createElement("div");
		$(this.containers.audioLibrary).addClass("audioLibrary").html("Remember other audio files in the Library<br />");
		$(this.containers.adminbar).append(this.containers.audioLibrary);
		var but=document.createElement("button");
		$(but).attr("type","button").html("Fetch library audio");
		this.containers.libraryFiles=document.createElement("div");
		$(this.containers.libraryFiles).addClass('audiofilelist');
		var filter=document.createElement("div");
		$(filter).addClass("filterBox").css({display:"none"});
		var ip=document.createElement("input");
		$(ip).attr("type","text").bind("keyup",function() {
			tag_swapper.filterLibrary(this.value);
		});
		$(filter).append(ip);
		$(this.containers.audioLibrary).append(but).append(filter).append(this.containers.libraryFiles);
		$(but).bind("click",function() {
			$(tag_swapper.containers.libraryFiles).html("Fetching...");
			$(this).slideUp();
			$.ajax({
				url:'/library/ajax',
				method:"POST",
				dataType:'json',
				success:function(obj) {
					$('.filterBox').css({display:"block"});
					$(tag_swapper.containers.libraryFiles).empty();
					if (typeof(obj)=="object" && obj.length>0) {
						var found=0;
						obj.sort(function(a,b) {
							if (a.name.toLowerCase()<b.name.toLowerCase()) return -1;
							if (a.name.toLowerCase()>b.name.toLowerCase()) return 1;
							return 0;
						});
						tag_swapper.libraryFiles=[];
						for(var o=0;o<obj.length;o++) {
							if (/mp3$/.test(obj[o].url) && !tag_swapper.audioRemembered(obj[o].url)) {
								var a=document.createElement("a");
								a.libraryFile=obj[o];
								$(a).html(obj[o].name).attr("href","javascript:void(0)").bind("click",function() {
	tag_swapper.rememberAudioFile(this);
	/*var aud={};
	aud.name=this.libraryFile.name;
	aud.url=this.libraryFile.url;
	aud.id=this.libraryFile.id;
	if (tag_swapper.value.audio===undefined) tag_swapper.value.audio=[];
	tag_swapper.value.audio.push(aud);
	if ($(tag_swapper.containers.audioLibrary).find('.warning').get().length==0) {
		var d=document.createElement("div");
		$(d).html("This doo-it will remember which files you have selected ONLY if you save it.").css({color:'#f00',display:"none"}).addClass("warning");
		$(tag_swapper.containers.audioLibrary).append(d);
		$(d).slideDown();
	}
	$(this).slideUp(500,function() {
		$(this).remove();
	});
	$('.audioSelectInput').each(function(i,e) {tag_swapper.audioSelectOptions(e);});*/
								});
								a.title=obj[o].url;
								found++;
								$(tag_swapper.containers.libraryFiles).append(a);
								tag_swapper.libraryFiles.push(a);
							}
						}
						if (found==0) $(tag_swapper.containers.libraryFiles).slideUp(500,function(){$(this).html("No files found").slideDown();});
					}else{
						$(tag_swapper.containers.libraryFiles).slideUp(500,function(){$(this).html("No files found").slideDown();});
					}
					
					tag_swapper.checkAudioScripts();
				}
			});
		});
	},
	rememberAudioFile:function(obj) {
		var aud={};
		aud.name=obj.libraryFile.name.replace(/_/g,' ');
		aud.url=obj.libraryFile.url;
		aud.id=obj.libraryFile.id;
		if (tag_swapper.value.audio===undefined) tag_swapper.value.audio=[];
		tag_swapper.value.audio.push(aud);
		if ($(tag_swapper.containers.audioLibrary).find('.warning').get().length==0) {
			var d=document.createElement("div");
			$(d).html("This doo-it will remember which files you have selected ONLY if you save it.").css({color:'#f00',display:"none"}).addClass("warning");
			$(tag_swapper.containers.audioLibrary).append(d);
			$(d).slideDown();
		}
		$(obj).slideUp(500,function() {
			$(this).remove();
		});
		$('.audioSelectInput').each(function(i,e) {tag_swapper.audioSelectOptions(e);});
	},
	filterLibrary:function(txt) {
		var found=[];
		if (txt.replace(/ /g,'')=="") {
			$(tag_swapper.containers.libraryFiles).empty();
			for(var l=0;l<this.libraryFiles.length;l++) {
				$(this.libraryFiles[l]).bind("click",function() {
					tag_swapper.rememberAudioFile(this);
				});
				$(tag_swapper.containers.libraryFiles).append(this.libraryFiles[l]);
			}
		}else{
			var txts=txt.split(" ");
			for(var t=0;t<txts.length;t++) {
				if (txts[t]!="") {
					var startMatch=new RegExp('^'+txts[t],'i');
					var goodMatch=new RegExp('\W'+txts[t],'i');
					var aMatch=new RegExp(txts[t],'i');
					for(var l=0;l<this.libraryFiles.length;l++) {
						var s=0;
						if (startMatch.test(this.libraryFiles[l].libraryFile.name)) s+=3;
						if (goodMatch.test(this.libraryFiles[l].libraryFile.name)) s+=2;
						if (aMatch.test(this.libraryFiles[l].libraryFile.name)) s+=txts[t].length;
						if (found[l]===undefined) {
							found[l]=[s,this.libraryFiles[l]];
						}else{
							found[l][0]+=s;
						}
					}
				}
			}
			found.sort(function(a,b) {return b[0]-a[0];});
			$(tag_swapper.containers.libraryFiles).empty();
			var score=[];
			for(var a=0;a<20;a++) {
				if (a<found.length) {
					score.push(found[a][0]);
					$(found[a][1]).bind("click",function() {
						tag_swapper.rememberAudioFile(this);
					});
					$(tag_swapper.containers.libraryFiles).append(found[a][1]);
				}
			}
		}
	},
	audioRemembered:function(url) {
		if (this.value.audio!==undefined) {
			for(var a=0;a<this.value.audio.length;a++) {
				if (this.value.audio[a].url==url) return true;
			}
		}
		return false;
	},
	audioUploadCount:0,
	bulkUploader:function() {
		this.containers.uploader=document.createElement("div");
		$(this.containers.adminbar).append(this.containers.uploader);
		var up=$(this.containers.uploader);
		up.addClass("audioUpload").html("Upload audio files to the library and remember them here");
		var form=document.createElement("form");
		$(form).bind("submit",function(e) {
			e.preventDefault();
			return false;
		});
		form.method="POST";
		form.name="audioUp";
		form.enctype="multipart/form-data";
		var ip=document.createElement("input");
		$(ip).attr("type","file");
		$(ip).attr("name","audioFiles[]");
		$(ip).attr("multiple","true");
		$(ip).attr("accept","audio/*");
		var list=document.createElement("div");
		$(list).addClass("audiofilelist");
		//var but=document.createElement("button");
		//$(but).html("Upload").css({display:"none"});
		//$(but).attr("type","button");
		$(ip).bind("change",function() {
			//$(this).slideUp();
			var ip=$(this.parentNode).find("input[type=file]").get(0);
			if (ip.files.length>0) {
				tag_swapper.audioUploadCount=ip.files.length;
				var data=new FormData(this.parentNode);
				var xhr=new XMLHttpRequest;
				xhr.open('POST','/library/bulkUploadAudio',true);
				xhr.send(data);
				xhr.onreadystatechange=function() {
					if (this.readyState==4) {
						var r=this.responseText;
						this.getAllResponseHeaders();
						if (this.status==200) r=this.responseText;
						tag_swapper.bulkComplete(r);
					}
				};
			}
		});
		$(form).append(ip).append(list);
		up.append(form);
		$(ip).bind("change",function() {
			var list=$(this).next();
			list.empty().html("Uploading...");
			for(var f=0;f<this.files.length;f++) {
				var file=document.createElement("div");
				$(file).html(this.files[f].name);
				list.append(file);
			}
			$(this).next().next().slideDown();
		});
	},
	bulkComplete:function(res) {
		var newfiles=[];
		try{
			eval('newfiles='+res+';');
		}catch(e){}
		if (this.value.audio===undefined) this.value.audio=[];
		for(var f=0;f<newfiles.length;f++) {
			newfiles[f].name=newfiles[f].name.replace(/_/g,' ');
			this.value.audio.push(newfiles[f]);
		}
		$(this.containers.uploader).find("input").val('');
		$(this.containers.uploader).find("div.audiofilelist").slideUp(500,function() {
			$(this).empty().css({display:"block"});
		});
		//$(this.containers.uploader).find("button").slideUp();
		if ($(this.containers.uploader).find('.warning').get().length==0) {
			var d=document.createElement("div");
			$(this.containers.uploader).append(d);
		}else{
			var d=$(this.containers.uploader).find('.warning').get(0);
		}
		if (tag_swapper.audioUploadCount!=newfiles.length) {
			$(d).html("One or more files failed to upload. They may be higher than the upload limit.").css({color:'#f00',display:"none"}).addClass("warning");
		}else{
			$(d).html("This doo-it will remember which files you have uploaded ONLY if you save it.").css({color:'#f00',display:"none"}).addClass("warning");
		}
		$(d).slideDown();

		$('.audioSelectInput').each(function(i,e) {tag_swapper.audioSelectOptions(e);});
		this.checkAudioScripts();
	},
	saveLocal:function() {
		if (this.autosave) localStorage[this.autosaveKey]=json.build(this.value);
	},
	clearLocal:function() {
		if (this.autosave) localStorage[this.autosaveKey]='';
	},
	build:function() {
		$(this.containers.main).html("<h2>tag_swapper Construction</h2>");
		var main=document.createElement("div");
		this.containers.main.appendChild(main);
		this.render(main,'main');
	},
	render:function(target,id) {
		var objects=[];
		var list=this.schema[id];
		if (typeof(list.initial)=="object" && typeof(list.initial.length)=="number") {
			objects.push(this.object.render(target,[id],list));
		}else{
			for(var k in list) {
				if (this.object[list[k].type]!=undefined) {
					objects.push(this.object[list[k].type](target,[id,k],list[k]));
				}else{
					objects.push(this.object.render(target,[id,k],list[k]));
				}
			}
		}
		return objects;
	},
	validate:function() {
		var missing=[];
		$(this.containers.main).find(".requiredChildren").each(function(i,e) {
			var but=$(e).find('>button').get(0);
			var levels=but.levels;
			if (levels!==undefined) {
				if (tag_swapper.levelValue(levels).length==0) {
					var err=but.item.label+' has no items';
					if(levels.length>2) {
						var parnt=tag_swapper.parentValue(levels);
						if (parnt.title!==undefined && parnt.title!="") err+=' in '+parnt.title;
					}
					err+='.';
					missing.push(err);
				}
			}
		});
		$(this.containers.main).find(".requiredValue").each(function(i,e) {
//console.log(e.levels);
			var v=tag_swapper.levelValue(e.levels);
			if (v===undefined || v===null || v=='') {
				var err=e.item.label+' is empty';
				if(e.levels.length>2) {
					var parnt=tag_swapper.parentTitle(e.levels);
					if (parnt!==undefined && parnt!="") err+=' in '+parnt;
				}
				err+='.';
				missing.push(err);
			}
//console.log(v);
		});
		return missing;
	},
	parentTitle:function(levels) {
		var increment=1;
		//if (levels[levels.length-1]=="title") increment=2;
		var l=[];
		for(var i=0;i<levels.length-increment;i++) l.push(levels[i]);
		var obj=this.levelValue(l);
		if (obj.title!==undefined && obj.title!='') {
			return obj.title;
		}else if (l.length<2) {
			return '';
		}else{
			return tag_swapper.parentTitle(l);
		}
	},
	parentParentValue:function(levels) {
		var l=[];
		for(var i=0;i<levels.length-2;i++) l.push(levels[i]);
		return this.levelValue(l);
	},
	parentValue:function(levels) {
		var l=[];
		for(var i=0;i<levels.length-1;i++) l.push(levels[i]);
		return this.levelValue(l);
	},
	levelValue:function(levels) {
		var defaultValue=(arguments.length>2)?arguments[2]:null;
		var level=tag_swapper.value;
		for(var l=0;l<levels.length;l++) {
			if (level[levels[l]]==undefined) {
				if (!isNaN(levels[l])) {
					while(level.length<=levels[l]) level.push({});
				}else if (l==levels.length-1) {
					level[levels[l]]=defaultValue;
				}else if (isNaN(levels[l])) {
					level[levels[l]]={};
				}else{
					level[levels[l]]=[];
				}
			}else if(typeof(defaultValue)=="object" && l==levels.length-1) {
				for(var k in defaultValue) {
					if (level[levels[l]][k]===undefined) level[levels[l]][k]=defaultValue[k];
				}
			}
			level=level[levels[l]];
		}
		return level;
	},
	object:{
		base:function(args) {
			var levels=args[1];
			var item=args[2];
			var defaultValue=item.initial;
			if ( typeof(item.initial)=="object" && item.initial!==null) {
				if (typeof(item.initial.length)=="number") {
					defaultValue=item.initial.concat([]);
				}else{
					defaultValue={};
					for(var k in item.initial) defaultValue[k]=item.initial[k];
				}
			}
			if (defaultValue!==undefined && defaultValue!==null && defaultValue.script!==undefined) {
				if (defaultValue.script=='') {
					defaultValue.script=tag_swapper.scriptId();
				}
				tag_swapper.scriptIds[defaultValue.script]=true;
			}
			if (/\(\)/.test(defaultValue)) {
				try{
					eval('defaultValue='+item.initial+';');
					if (item.initial=='tag_swapper.uniqueId()') tag_swapper.ids[defaultValue]=true;
				}catch(e){}
			}
			var index=null;
			if (args.length>3) {
				var val=tag_swapper.levelValue(levels.concat([]),item,defaultValue,args[3]);
				return val;
			}else{
				var val=tag_swapper.levelValue(levels.concat([]),item,defaultValue,item);
				return val;
			}
		},
		render:function(target,levels,item) {
			var val=this.base(arguments);
			var o=document.createElement("div");
			$(o).addClass("formItem formSection");
			if (arguments.length<4) {
				var className=null;
				var sortable=false;
				var deleteable=false;
				var ab=[];
				if(typeof(val)=="object" && typeof(val.length)=="number") {
					if (item.required===true) $(o).addClass("requiredChildren");
					var but=document.createElement("button");
					$(but).attr('type',"button");
					$(but).html("add");
					but.src=val;
					but.item=item;
					but.levels=levels;
					$(but).addClass("hasLevels add");
					if (item.onchange) {
						but.change=item.onchange;
						but.update=function() {
							if (typeof(this.change)=="string") {
								try{
									eval(this.change);
								}catch(e){}
							}else if (typeof(this.change)=="function") {
								this.change();
							}
						};
						$(o).addClass("extensible");
						o.update=function() {
							$(this).find(">button.add").get(0).update();
						};
					}
					$(but).bind("click",function() {
						var index=$(this).nextAll('div').get().length;
						var insertLevels=this.levels.concat([index]);
						tag_swapper.object.render(this.parentNode,insertLevels,tag_swapper.schema[this.item.type],index);
						if (this.update) this.update();
						return true;
					});
					o.appendChild(but);
					if (item.label) className=item.label;
					ab=$(o).find('.affectButton').get();
				}
				for(var i=0;i<val.length;i++) {
					tag_swapper.object.render(o,levels.concat([i]),tag_swapper.schema[item.type],i);
				}
				if (item.elementType!==undefined) {
					if (item.elementType.className!==undefined) className=item.elementType.className;
					if (item.elementType.sortable!==undefined) sortable=item.elementType.sortable;
					if (item.elementType.deleteable!==undefined) deleteable=item.elementType.deleteable;
				}
				if (className!==null || sortable==true) {
					o=tag_swapper.collapsible((ab.length>0)?ab[0].value:className,o,{className:className.replace(/[^a-z]+/ig,'_'),sortable:sortable,deleteable:deleteable});
				}else if (deleteable) {
					var but=document.createElement("button");
					$(but).attr('type',"button");
					$(but).html("delete").addClass("delete");
					but.update=function(){};
					if (item.onchange) {
						but.change=item.onchange;
						but.update=function() {
							if (typeof(this.change)=="string") {
								try{
									eval(this.change);
								}catch(e){}
							}else if (typeof(this.change)=="function") {
								this.change();
							}
						};
						$(o).addClass("extensible");
						o.update=function() {$(this).find(">button.add").get(0).update();};
					}
					$(but).bind("click",function() {
						tag_swapper.deleteItem(this);
					});
					o.insertBefore(but,o.childNodes[0]);
				}
				/*if (item.elementType!==undefined) {
console.log(item.elementType);
					if (item.elementType.update!==undefined) {
						o.updateClass=item.elementType.update;
console.log(item.elementType.update);
						o.update=function() {
							$(this).find('.'+this.updateClass).each(function(i,e) {
								if (e.update) {
									e.update();
								}else{
									$(e).find('.updateable').each(function(i,ee) {
										if (ee.update) {
											ee.update();
										}
									});
								}
							});
						}
					}
				}*/
			}else{
//console.log(levels,item);
				if (item.label!==undefined) {
					var label=document.createElement("h3");
					$(label).html(item.label);
					o.appendChild(label);
				}
				if (item.description!==undefined) {
					var description=document.createElement("span");
					$(description).html(item.description);
					o.appendChild(description);
				}
				$(o).addClass("hasLevels");
				o.levels=levels;
				$(o).addClass("indexed");
				var elementType=null;
				if (item.elementType!==undefined) elementType=item.elementType;
				for(var k in item) {
					if (k!='elementType') {
						if (tag_swapper.object[item[k].type]===undefined && typeof(item[k].initial)=="object" && typeof(item[k].initial.length)=="number") {
							var obj=tag_swapper.object.render(o,levels.concat([k]),item[k]);
						}else{
							//try{
								var obj=tag_swapper.object[item[k].type](o,levels.concat([k]),item[k]);
							//}catch(e) {
							//	console.log(tag_swapper.schema[item.type][k].type);
							//}
						}
					}
				}
				var className=null;
				var sortable=false;
				var ab=$(o).find('.affectButton').get();
				var deleteable=false;
				
				if (elementType!==null) {
					if (elementType.className!==undefined) className=elementType.className;
					if (elementType.sortable!==undefined) sortable=elementType.sortable;
					if (elementType.deleteable!==undefined) deleteable=elementType.deleteable;
					var ab=$(o).find('.affectButton').get();
					if (className!==null || sortable==true) {
						o=tag_swapper.collapsible((ab.length>0)?ab[0].value:className,o,{className:className,sortable:sortable,deleteable:deleteable});
					}else if (deleteable) {
						var but=document.createElement("button");
						$(but).attr('type',"button");
						$(but).html("delete").addClass("delete");
						but.update=function(){};
						if (item.onchange) {
							but.change=item.onchange;
							but.update=function() {
								if (typeof(this.change)=="string") {
									try{
										eval(this.change);
									}catch(e){}
								}else if (typeof(this.change)=="function") {
									this.change();
								}
							};
						}
						$(o).addClass("callOnDelete");
						$(but).bind("click",function() {
							tag_swapper.deleteItem(this);
						});
						o.insertBefore(but,o.childNodes[0]);
					}
				}
				if (elementType!==null) {
					if (elementType.update!==undefined) {
						o.updateClass=elementType.update;
						$(o).addClass("callOnDelete");
						o.update=function() {
							$(this).find('.'+this.updateClass).each(function(i,e) {
								if (e.update) {
									e.update();
								}else{
									$(e).find('.updateable').each(function(i,ee) {
										if (ee.update) {
											ee.update();
										}
									});
								}
							});
						};
					}
				}
				if (sortable && className!==null) tag_swapper.sortable(target,'>.tag_swapper_sortable','>.collapseButton>.mover',function(e,ui) {tag_swapper.updateOrder(e,ui,className);});
			}
			/*if (item.elementType && item.elementType.update) {
				$(o).addClass("callOnDelete");
				o.updateClass=item.elementType.update;
				o.update=function() {
					$(this).find('.'+this.updateClass).each(function(i,e) {
						if (e.update) e.update();
					});
				}
			}*/
				target.appendChild(o);
				return o;
		},
		text:function(target,levels,item) {
			var o=document.createElement("div");
			$(o).addClass("formItem").addClass('param_'+levels[levels.length-1]);
			var val=this.base(arguments);
			if (item.toDisplay!==undefined) {
				var thisObject=o;
				var show=true;
				try{
					eval('show='+item.toDisplay+';');
				}catch(e){}
				if (!show) $(o).css({display:"none"});
			}
			var label=document.createElement("label");
			$(label).html(item.label);
			var description=document.createElement("span");
			$(description).html(item.description).addClass("inputDescription");
			var ip=document.createElement("input");
			ip.type='text';
			ip.value=val;
			//ip.val=val;
			ip.item=item;
			ip.levels=levels;
			$(ip).addClass("hasLevels");
			if (item.required===true) $(ip).addClass("requiredValue");
			ip.update=function(){};
			if (item.affectButton===true) {
				ip.update=function() {
					var p=tag_swapper.ancester(this,'collapseContent');
					var b=$(p).prev('.collapseButton').find('>nobr');
					var t=this.value.replace(/[^a-z^0-9^ ]+/gi,'');
					b.html(t);
				};
				$(ip).addClass('affectButton');
			}
			$(ip).bind("keyup",function() {
				tag_swapper.setValue(this,this.levels,this.value);
				this.update();
			});
			o.appendChild(label);
			o.appendChild(description);
			o.appendChild(ip);
			target.appendChild(o);
			return o;
		},
		hidden:function(target,levels,item) {
			var val=this.base(arguments);
			var ip=document.createElement("div");
			$(ip).css({color:'#ddd',display:"none"}).html(val).addClass("itemId");
			target.appendChild(ip);
			return ip;
		},
		h4:function(target,levels,item) {
			var val=this.base(arguments);
			var ip=document.createElement("h4");
			$(ip).css({color:'#666'}).html(val);
			target.appendChild(ip);
			return ip;
		},
		textarea:function(target,levels,item) {
			var o=document.createElement("div");
			$(o).addClass("formItem").addClass('param_'+levels[levels.length-1]);
			var val=this.base(arguments);
			if (item.toDisplay!==undefined) {
				var thisObject=o;
				var show=true;
				try{
					eval('show='+item.toDisplay+';');
				}catch(e){}
				if (!show) $(o).css({display:"none"});
			}
			var label=document.createElement("label");
			$(label).html(item.label);
			var description=document.createElement("span");
			$(description).html(item.description).addClass("inputDescription");
			var ip=document.createElement("textarea");
			ip.value=val;
			ip.levels=levels;
			ip.item=item;
			if (item.required===true) $(ip).addClass("requiredValue");
			$(ip).addClass("hasLevels");
			$(ip).bind("keyup",function() {
				tag_swapper.setValue(this,this.levels,this.value);
			});
			o.appendChild(label);
			o.appendChild(description);
			o.appendChild(ip);
			target.appendChild(o);
			return o;
		},
		integer:function(target,levels,item) {
			var o=document.createElement("div");
			$(o).addClass("formItem").addClass('param_'+levels[levels.length-1]);
			var val=this.base(arguments);
			if (item.toDisplay!==undefined) {
				var thisObject=o;
				var show=true;
				try{
					eval('show='+item.toDisplay+';');
				}catch(e){}
				if (!show) $(o).css({display:"none"});
			}
			var label=document.createElement("label");
			$(label).html(item.label);
			var description=document.createElement("span");
			$(description).html(item.description).addClass("inputDescription");
			var ip=document.createElement("input");
			ip.type='text';
			ip.value=val;
			ip.levels=levels;
			ip.item=item;
			if (item.required===true) $(ip).addClass("requiredValue");
			if (item.notNull) {
				ip.notNull=item.notNull;
				ip.initial=item.initial;
			}
			$(ip).addClass("hasLevels integer");
			$(ip).bind("blur",function() {
				if (this.notNull && this.value=='') {
					this.value=this.initial;
					tag_swapper.setValue(this,this.levels,1*this.value);
				}
			});
			$(ip).bind("keydown",function(e) {
				var k=tag_swapper.keyCode(e);
				if (!k.numeric && !k.navigate) {
					e.preventDefault();
					return false;
				}
			});
			$(ip).bind("keyup",function() {
				tag_swapper.setValue(this,this.levels,1*this.value);
			});
			o.appendChild(label);
			o.appendChild(description);
			o.appendChild(ip);
			target.appendChild(o);
			return o;
		},
		decimal:function(target,levels,item) {
			var o=document.createElement("div");
			$(o).addClass("formItem").addClass('param_'+levels[levels.length-1]);
			var val=this.base(arguments);
			if (item.toDisplay!==undefined) {
				var thisObject=o;
				var show=true;
				try{
					eval('show='+item.toDisplay+';');
				}catch(e){}
				if (!show) $(o).css({display:"none"});
			}
			var label=document.createElement("label");
			$(label).html(item.label);
			var description=document.createElement("span");
			$(description).html(item.description).addClass("inputDescription");
			var ip=document.createElement("input");
			ip.type='text';
			ip.value=val;
			ip.levels=levels;
			ip.item=item;
			if (item.required===true) $(ip).addClass("requiredValue");
			$(ip).addClass("hasLevels decimal");
			$(ip).bind("keydown",function(e) {
				var hasPoint=/\./.test(this.value);
				var k=tag_swapper.keyCode(e);
				if (hasPoint && k.numeric) return true;
				if (k.navigate) return true;
				if (!hasPoint && k.decimal) return true;
				e.preventDefault();
				return false;
			});
			$(ip).bind("keyup",function() {
				tag_swapper.setValue(this,this.levels,1*this.value);
			});
			o.appendChild(label);
			o.appendChild(description);
			o.appendChild(ip);
			target.appendChild(o);
			return o;
		},
		trigger:function(target,levels,item) {
			var o=document.createElement("div");
			$(o).addClass("formItem").addClass('param_'+levels[levels.length-1]);
			var val=this.base(arguments);
			if (item.toDisplay!==undefined) {
				var thisObject=o;
				var show=true;
				try{
					eval('show='+item.toDisplay+';');
				}catch(e){}
				if (!show) $(o).css({display:"none"});
			}
			var label=document.createElement("label");
			$(label).html(item.label);
			var description=document.createElement("span");
			$(description).html(item.description).addClass("inputDescription");
			if (availableTriggers.length>0) {
				var ip=document.createElement("select");
				var opt=document.createElement("option");
				opt.text='';
				opt.value='0';
				ip.appendChild(opt);
				for(var t=0;t<availableTriggers.length;t++) {
					var opt=document.createElement("option");
					opt.text=availableTriggers[t].description;
					opt.value=availableTriggers[t].id;
					if (val==availableTriggers[t].id) opt.selected=true;
					ip.appendChild(opt);
				}
				ip.levels=levels;
				ip.item=item;
				$(ip).addClass("hasLevels");
				$(ip).bind("change",function() {
					tag_swapper.setValue(this,this.levels,this.value);
				});
			}else{
				var ip=document.createElement('em');
				$(ip).html("No triggers defined for this Doo-it");
			}
			o.appendChild(label);
			o.appendChild(description);
			o.appendChild(ip);
			target.appendChild(o);
			return o;
		},
		metaSelector:function(target,levels,item) {
			var o=document.createElement("div");
			$(o).addClass("formItem").addClass('param_'+levels[levels.length-1]);
			var val=this.base(arguments);
			if (item.toDisplay!==undefined) {
				var thisObject=o;
				var show=true;
				try{
					eval('show='+item.toDisplay+';');
				}catch(e){}
				if (!show) $(o).css({display:"none"});
			}
			var label=document.createElement("label");
			$(label).html(item.label);
			var description=document.createElement("span");
			$(description).html(item.description).addClass("inputDescription");
			var ip=document.createElement("select");
			var opt=document.createElement("option");
			opt.text='Do not save';
			opt.value='';
			ip.appendChild(opt);
			for(var um in metaWrite) {
				var opt=document.createElement("option");
				opt.text=metaWrite[um];
				opt.value=metaWrite[um];
				if (val==metaWrite[um]) opt.selected=true;
				ip.appendChild(opt);
			}
			ip.levels=levels;
			ip.item=item;
			$(ip).addClass("hasLevels");
			$(ip).bind("change",function() {
				tag_swapper.setValue(this,this.levels,this.value);
			});
			o.appendChild(label);
			o.appendChild(description);
			o.appendChild(ip);
			target.appendChild(o);
			return o;
		},
		tag:function(target,levels,item) {
			var o=document.createElement("div");
			$(o).addClass("formItem").addClass('param_'+levels[levels.length-1]);
			var val=this.base(arguments);
			if (item.toDisplay!==undefined) {
				var thisObject=o;
				var show=true;
				try{
					eval('show='+item.toDisplay+';');
				}catch(e){}
				if (!show) $(o).css({display:"none"});
			}
			var label=document.createElement("label");
			$(label).html(item.label);
			var description=document.createElement("span");
			$(description).html(item.description).addClass("inputDescription");
			if (accessibleTags.length==0) {
				var ip=document.createElement("span");
				$(ip).html("No accessible Tags defined. They can be managed above.");
			}else{
				var ip=document.createElement("select");
				var selected=false;
				for(var s=0;s<accessibleTags.length;s++) {
					if (val==accessibleTags[s]) selected=true;
				}
				if (!selected && val!="") {
					var opt=document.createElement("option");
					opt.text=opt.value=val;
					opt.selected=true;
					ip.appendChild(opt);
				}
				for(var s=0;s<accessibleTags.length;s++) {
					var opt=document.createElement("option");
					opt.text=opt.value=accessibleTags[s];
					if (val==accessibleTags[s]) opt.selected=true;
					ip.appendChild(opt);
				}
				//ip.value=val;
				ip.levels=levels;
				ip.update=function(){};
				$(ip).addClass("hasLevels");
				$(ip).bind("change",function() {
					tag_swapper.setValue(this,this.levels,this.value);
					this.update();
				});
				if (item.affectButton===true) {
					ip.update=function() {
						var p=tag_swapper.ancester(this,'collapseContent');
						var b=$(p).prev('.collapseButton').find('>nobr');
						var t=this.value.replace(/[^a-z^0-9^ ]+/gi,'');
						b.html(t);
					};
					$(ip).addClass('affectButton');
				}
			}
			o.appendChild(label);
			o.appendChild(description);
			o.appendChild(ip);
			target.appendChild(o);
			return o;
		},
		select:function(target,levels,item) {
			var o=document.createElement("div");
			$(o).addClass("formItem").addClass('param_'+levels[levels.length-1]);
			var val=this.base(arguments);
			if (item.toDisplay!==undefined) {
				var thisObject=o;
				var show=true;
				try{
					eval('show='+item.toDisplay+';');
				}catch(e){}
				if (!show) $(o).css({display:"none"});
			}
			var label=document.createElement("label");
			$(label).html(item.label);
			var description=document.createElement("span");
			$(description).html(item.description).addClass("inputDescription");
			var ip=document.createElement("select");
			for(var s=0;s<item.options.length;s++) {
				var so=item.options[s];
				var opt=document.createElement("option");
				if (typeof(so)=="object") {
					opt.text=item.options[s].text;
					opt.value=item.options[s].value;
					if (val==item.options[s].value) opt.selected=true;
				}else{
					opt.text=opt.value=item.options[s];
					if (val==item.options[s]) opt.selected=true;
				}
				ip.appendChild(opt);
			}
			//ip.value=val;
			ip.levels=levels;
			$(ip).addClass("hasLevels");
			$(ip).bind("change",function() {
				tag_swapper.setValue(this,this.levels,this.value);
			});
			o.appendChild(label);
			o.appendChild(description);
			o.appendChild(ip);
			target.appendChild(o);
			return o;
		},
		boolean:function(target,levels,item) {
			var o=document.createElement("div");
			$(o).addClass("formItem").addClass('param_'+levels[levels.length-1]);
			var val=this.base(arguments);
			if (item.toDisplay!==undefined) {
				var thisObject=o;
				var show=true;
				try{
					eval('show='+item.toDisplay+';');
				}catch(e){}
				if (!show) $(o).css({display:"none"});
			}
			var label=document.createElement("label");
			$(label).html(item.label);
			var description=document.createElement("span");
			$(description).html(item.description).addClass("inputDescription");
			var ip=document.createElement("input");
			ip.type='checkbox';
			ip.item=item;
			ip.checked=val;
			ip.levels=levels;
			$(ip).addClass("hasLevels");
			$(ip).bind("change",function() {
				tag_swapper.setValue(this,this.levels,this.checked);
			});
			o.appendChild(label);
			o.appendChild(description);
			o.appendChild(ip);
			target.appendChild(o);
			return o;
		},
		colour:function(target,levels,item) {
			var o=document.createElement("div");
			$(o).addClass("formItem").addClass('param_'+levels[levels.length-1]);
			var val=this.base(arguments);
			if (item.toDisplay!==undefined) {
				var thisObject=o;
				var show=true;
				try{
					eval('show='+item.toDisplay+';');
				}catch(e){}
				if (!show) $(o).css({display:"none"});
			}
			var label=document.createElement("label");
			$(label).html(item.label);
			var description=document.createElement("span");
			$(description).html(item.description).addClass("inputDescription");
			var ip=document.createElement("input");
			ip.type='text';
			ip.value=val;
			ip.levels=levels;
			$(ip).addClass("hasLevels colour");
			$(ip).bind("keyup",function() {
				tag_swapper.setValue(this,this.levels,this.value);
			});
			o.appendChild(label);
			o.appendChild(description);
			o.appendChild(ip);
			target.appendChild(o);
			$(ip).jPicker({images:{clientPath:'/js/jpicker/images/'},window:{position:{x:'0px',y:'0px'},expandable:true,liveUpdate:true}},function(colour,context) {
				tag_swapper.setValue(this,this.levels,this.value);
			});
			return o;
		},
		audio:function(target,levels,item) {
			var o=document.createElement("div");
			$(o).addClass("formItem").addClass('param_'+levels[levels.length-1]);
			var val=this.base(arguments);
			if (item.toDisplay!==undefined) {
				var thisObject=o;
				var show=true;
				try{
					eval('show='+item.toDisplay+';');
				}catch(e){}
				if (!show) $(o).css({display:"none"}).addClass("notInScript");
			}
			var label=document.createElement("label");
			$(label).html(item.label);
			var description=document.createElement("span");
			$(description).html(item.description).addClass("inputDescription");
			var ip=document.createElement("select");
			ip.levels=levels;
			ip.id='script_'+val.script;
			$(ip).addClass("hasLevels").addClass("audioSelectInput");
			if (val!==null && val.name!=='' && val.url!=='') {
				var opt=document.createElement("option");
				opt.text=val.name;
				opt.value=val.url;
				opt.selected=true;
				ip.appendChild(opt);				
			}
			tag_swapper.audioSelectOptions(ip);
			$(ip).bind("change",function() {
				tag_swapper.setAudioValue(this,this.levels,$(this).val());
			});
			ip.setTo=function(newUrl) {
				$(this).val(newUrl);
				tag_swapper.setAudioValue(this,this.levels,$(this).val());
			};
			o.appendChild(label);
			o.appendChild(description);
			o.appendChild(ip);
			target.appendChild(o);
			ip.scriptType=item.script;
			ip.getScript=function() {
				var txt=this.id.replace(/^script_/,'');
				switch(this.scriptType) {
					case "questionParagraphs":
						var stack=[];
						for(var l=0;l<this.levels.length-1;l++) stack.push(this.levels[l]);
						var p=tag_swapper.levelValue(stack);
						var qs=[];
						for(var q=0;q<p.questions.length;q++) {
							qs.push(p.questions[q].paragraph.replace(/[\n/\r]+/g,' '));
						}
						txt+=' '+qs.join(" | ");
					break;
					default:
						var stack=[];
						for(var l=0;l<this.levels.length-1;l++) stack.push(this.levels[l]);
						stack.push(this.scriptType);
						txt+=' '+tag_swapper.levelValue(stack);
					break;
				}
				return txt;
			};
			return o;
		},
		optionResponse:function(target,levels,item) {
			var o=document.createElement("div");
			$(o).addClass("formItem").addClass('param_'+levels[levels.length-1]);
			var val=this.base(arguments);
			var label=document.createElement("label");
			if (item.toDisplay!==undefined) {
				var thisObject=o;
				var show=true;
				try{
					eval('show='+item.toDisplay+';');
				}catch(e){}
				if (!show) $(o).css({display:"none"});
			}
			$(label).html(item.label);
			var description=document.createElement("span");
			$(description).html(item.description).addClass("inputDescription");
			var ip=document.createElement("select");
			$(ip).addClass("onResponseUpdate");
			ip.levels=levels;
			ip.update=function() {
				var lvls=[];
				var backLevels=3;
				if (this.levels[this.levels.length-3]!="options") backLevels=1;
				for(var l=0;l<this.levels.length-backLevels;l++) lvls.push(this.levels[l]);
				lvls.push('responses');
				var res=[];
				var stack=[];
				for(var l=0;l<lvls.length;l++) {
					if (isNaN(lvls[l])) {
						stack.push("'"+lvls[l]+"'");
					}else{
						stack.push(lvls[l]);
					}
				}
				try{
					eval('res=tag_swapper.value['+stack.join('][')+'];');
				}catch(e){}
				var val=$(this).val();
				$(this).empty();
				var o=document.createElement("option");
				o.text="No response";
				o.value='';
				$(this).append(o);
				var found=false;
				if (res!==undefined) {
					for(var r=0;r<res.length;r++) {
						var o=document.createElement("option");
						o.text=res[r].title;
						o.value=res[r].id;
						if (val==res[r].id) {
							o.selected=true;
							found=true;
						}
						$(this).append(o);
					}
				}
				if (!found && (val!="" && val!=null)) tag_swapper.setValue(this,this.levels,'');
			};
			$(ip).addClass("hasLevels");
			if (val!==null && val!=='') {
				var opt=document.createElement("option");
				opt.text='Selected response';
				opt.value=val;
				opt.selected=true;
				ip.appendChild(opt);	
			}
			$(ip).bind("change",function() {
				tag_swapper.setValue(this,this.levels,$(this).val());
			});
			o.appendChild(label);
			o.appendChild(description);
			o.appendChild(ip);
			target.appendChild(o);
			ip.update();
			return o;
		},
		shuffle:function(target,levels,item) {
			var o=document.createElement("div");
			$(o).addClass("formItem").addClass('param_'+levels[levels.length-1]);
			if (item.className) $(o).addClass(item.className);
			var val=this.base(arguments);
			if (item.toDisplay!==undefined) {
				var thisObject=o;
				var show=true;
				try{
					eval('show='+item.toDisplay+';');
				}catch(e){}
				if (!show) $(o).css({display:"none"});
			}
			var label=document.createElement("label");
			$(label).html(item.label);
			var description=document.createElement("span");
			$(description).html(item.description).addClass("inputDescription");
			var sel=document.createElement("select");
			o.selector=sel;
			sel.levels=levels;
			sel.val=val;
			$(sel).addClass("hasLevels");
			o.update=function() {
				this.selector.val=tag_swapper.levelValue(this.selector.levels);
				this.draw();
			};
			o.draw=function() {
				while(this.selector.childNodes.length>0) this.selector.removeChild(this.selector.childNodes[0]);
				var page=tag_swapper.levelValue([this.selector.levels[0],this.selector.levels[1],this.selector.levels[2]]);
				var l=(page.questions==undefined)?0:page.questions.length;
				var vals=['None'];
				if (l>1) {
					for(var i=1;i<l;i++) vals.push(i);
					vals.push('All');
				}
				for(var i=0;i<vals.length;i++) {
					var oo=document.createElement("option");
					oo.text=oo.value=vals[i];
					if (vals[i]==this.selector.val) oo.selected=true;
					this.selector.appendChild(oo);
				}
			};
			$(sel).bind("change",function() {
				this.val=$(this).val();
				tag_swapper.setValue(this,this.levels,this.val);
			});
			o.draw();
			o.appendChild(label);
			o.appendChild(description);
			o.appendChild(sel);
			target.appendChild(o);
			return o;
		},
		maximum:function(target,levels,item) {
			var o=document.createElement("div");
			$(o).addClass("formItem").addClass('param_'+levels[levels.length-1]);
			if (item.className) $(o).addClass(item.className);
			var val=this.base(arguments);
			if (item.toDisplay!==undefined) {
				var thisObject=o;
				var show=true;
				try{
					eval('show='+item.toDisplay+';');
				}catch(e){}
				if (!show) $(o).css({display:"none"});
			}
			var label=document.createElement("label");
			$(label).html(item.label);
			var description=document.createElement("span");
			$(description).html(item.description).addClass("inputDescription");
			var sel=document.createElement("select");
			o.selector=sel;
			sel.levels=levels;
			sel.val=val;
			$(sel).addClass("hasLevels");
			o.update=function() {
				this.selector.val=tag_swapper.levelValue(this.selector.levels);
				this.draw();
			};
			o.draw=function() {
				while(this.selector.childNodes.length>0) this.selector.removeChild(this.selector.childNodes[0]);
				var levels=[];
				for(var i=0;i<this.selector.levels.length-1;i++) levels.push(this.selector.levels[i]);
				var multichoice=tag_swapper.levelValue(levels);
				var l=(multichoice.options==undefined)?0:multichoice.options.length;
				if (this.selector.val>l && l>0) {
					this.selector.val=l;
					tag_swapper.setValue(this.selector,this.selector.levels,this.selector.val);
				}
				var vals=[];
				for(var i=0;i<l;i++) vals.push(i+1);
				for(var i=0;i<vals.length;i++) {
					var oo=document.createElement("option");
					oo.text=oo.value=vals[i];
					if (vals[i]==this.selector.val) oo.selected=true;
					this.selector.appendChild(oo);
				}
			};
			$(sel).bind("change",function() {
				this.val=$(this).val();
				tag_swapper.setValue(this,this.levels,this.val);
			});
			o.draw();
			o.appendChild(label);
			o.appendChild(description);
			o.appendChild(sel);
			target.appendChild(o);
			return o;
		},
		questions:function(target,levels,item) {
//console.log(levels,item);
			var o=document.createElement("div");
			$(o).addClass("formItem").addClass('param_'+levels[levels.length-1]);
			$(o).addClass("formItemUpdate");
			var val=this.base(arguments);
			if (item.toDisplay!==undefined) {
				var thisObject=levels;
				var show=true;
				try{
					eval('show='+item.toDisplay+';');
				}catch(e){}
				if (!show) $(o).css({display:"none"});
			}
//console.log(val);
			o.change=item.onchange;
			$(o).addClass("callOnDelete");
			o.update=function() {
				if (typeof(this.change)=="string") {
					try{
						eval(this.change);
					}catch(e){}
				}else if (typeof(this.change)=="function") {
					this.change();
				}
			};
			var label=document.createElement("h4");
			$(label).html('Questions');
			var button=document.createElement("button");
			$(button).attr('type',"button");
			button.src=val;
			button.levels=levels;
			button.item=item;
			if (item.required===true) $(o).addClass("requiredChildren");
			$(button).addClass("hasLevels add");
			$(button).html("add").bind("click",function() {
				var type=$(this).prev().val();
				if (type!="") {
					var index=this.src.length;
					var oo=document.createElement("div");
					$(oo).addClass("indexed");
					oo.levels=this.levels.concat([index]);
					$(oo).addClass("hasLevels");
					for(var k in tag_swapper.schema.questions[type]) {
						if (tag_swapper.object[tag_swapper.schema.questions[type][k].type]!==undefined) {
							var o=tag_swapper.object[tag_swapper.schema.questions[type][k].type](oo,this.levels.concat([index,k]),tag_swapper.schema.questions[type][k]);
						}else{
							var o=tag_swapper.object.render(oo,this.levels.concat([index,k]),tag_swapper.schema.questions[type][k]);
						}
					}
					var ab=$(oo).find('.affectButton').get();
					oo=tag_swapper.collapsible((ab.length>0)?ab[0].value:'Question',oo,{className:'question '+type+'Type',sortable:true,deleteable:true});
					if (tag_swapper.schema.questions[type].type.update!==undefined) {
						oo.updateClass=tag_swapper.schema.questions[type].type.update;
						oo.update=function() {
							$(this).find('.'+this.updateClass).each(function(i,e) {
								if (e.update!==undefined) e.update();
							});
						};
					}
					$(oo).css({display:"none"});
					this.parentNode.appendChild(oo);
					$(oo).slideDown();
					var fi=tag_swapper.ancester(this,'formItemUpdate');
					fi.update();
				}
			});

			var sel=tag_swapper.questionTypeSelector();
			o.appendChild(label);
			o.appendChild(sel);
			o.appendChild(button);
			for(var q=0;q<val.length;q++) {
				var oo=document.createElement("div");
				$(oo).addClass("indexed");
				oo.levels=levels.concat([q]);
				$(oo).addClass("hasLevels");
				var sch=tag_swapper.schema.questions[val[q].type.replace(/ /g,'')];
				for(var k in sch) {
					if (tag_swapper.object[sch[k].type]!==undefined) {
						var ob=tag_swapper.object[sch[k].type](oo,levels.concat([q,k]),sch[k]);
					}else{
						var ob=tag_swapper.object.render(oo,levels.concat([q,k]),sch[k]);
					}
				}
				var ab=$(oo).find('.affectButton').get();
				oo=tag_swapper.collapsible((ab.length>0)?ab[0].value:'Question',oo,{className:'question '+val[q].type.replace(/ /g,'')+'Type',sortable:true,deleteable:true});
				if (sch.type && sch.type.update) {
					$(oo).addClass("callOnDelete");
					oo.updateClass=sch.type.update;
					oo.update=function() {
						$(this).find('.'+this.updateClass).each(function(i,e) {
							if (e.update) e.update();
						});
					};
				}
				o.appendChild(oo);
			}
			o.levels=levels;
			$(o).addClass("hasLevels");
			target.appendChild(o);
			tag_swapper.sortable(o,'.question','>.collapseButton .mover',function(e,ui) {tag_swapper.updateOrder(e,ui,'question');});
			return o;
		}
	},
	getScript:function() {
		var txt=[];
		$(this.containers.main).find('.audioSelectInput').each(function(i,e) {
			if (!$(e.parentNode).hasClass("notInScript")) txt.push(e.getScript());
		});
		this.getTxtFile(txt.join("\n"));
	},
	getTxtFile:function(content) {
		var f=document.createElement("iframe");
		$(f).css({display:"none"});
		document.body.appendChild(f);
		var doc = f.document;
		if (f.contentDocument) {
			doc = f.contentDocument; // For NS6
		} else if (f.contentWindow) {
			doc = f.contentWindow.document; // For IE5.5 and IE6
		} else if (f.document) {
			doc = f.document; // default*/
		}

		var title=$('input#title').val();
                doc.open();
                var op = '';
                op += "<html><head></head><body><form id='tag_swapperPost' action='/utilities/txt.php' method='POST'>";
		op += "<textarea name='txt'>"+content+"</textarea>";
		op += "<textarea name='filename'>"+((title=='')?'Untitled':title)+"</textarea>";
                op += "</form>";
                op += "<script type='text/javascript'>document.getElementById('tag_swapperPost').submit();</script>";
                op += "</body></html>";
                doc.writeln(op);
                doc.close();
	},
	checkAudioScripts:function() {
		var possibleAdds=[];
		if (this.value.audio!==undefined) {
			for(var i=0;i<this.value.audio.length;i++) {
				if (/^[a-z]{10}/i.test(this.value.audio[i].name)) {
					var m=this.value.audio[i].name.match(/^([a-z]{10})/i);
					var jq=$('#script_'+m[1]);
					if (jq.get().length==1) {
						if (jq.val()!=this.value.audio[i].url) {
							var b=document.createElement("a");
							b.href='javascript:void(0)';
							b.selectId='#script_'+m[1];
							b.audio=this.value.audio[i];
							$(b).html(this.value.audio[i].name);
							$(b).bind("click",function() {
								$(this.selectId).get(0).setTo(this.audio.url);
								$(this).slideUp(500,function() {
									$(this).remove();
								});
							});
							possibleAdds.push(b);
						}
					}
				}
			}
		}
		$(this.containers.matchedAudio).empty().html((possibleAdds.length==0)?"No script audio matches found":"Unassigned script audio matches found - click to assign them:");
		for(var p=0;p<possibleAdds.length;p++) {
			$(this.containers.matchedAudio).append(possibleAdds[p]);
		}
		if (possibleAdds.length>1) {
			var but=document.createElement("button");
			$(but).attr("type","button").html("Assign all").bind("click",function() {
				$(this).prevAll('a').each(function(i,e) {
					$(e.selectId).get(0).setTo(e.audio.url);
					$(e).slideUp(500,function() {
						$(this).remove();
					});
				});
				$(this).slideUp(500,function() {
					var d=document.createElement("div");
					$(d).html("All matches now assigned").css({display:"none"});
					$(this).parent().append(d);
					$(d).slideDown();
					$(this).remove();
				});
			});
			$(this.containers.matchedAudio).append(but);
		}
	},
	audioSelectOptions:function(sel) {
		var current=$(sel).val();
		while(sel.childNodes.length>0) sel.removeChild(sel.childNodes[0]);
		var found=false;
		if (this.value.audio!==undefined) {
			for(var a=0;a<this.value.audio.length;a++) {
				var o=document.createElement("option");
				o.text=this.value.audio[a].name.replace(/_/g,' ');
				o.value=this.value.audio[a].url;
				if (current==o.value) {
					o.selected=true;
					found=true;
				}
				sel.appendChild(o);
			}
		}
		//if (!found) {
			var o=document.createElement("option");
			o.value='';
			o.text='No audio';
			if (sel.childNodes.length>0) {
				sel.insertBefore(o,sel.childNodes[0]);
			}else{
				sel.appendChild(o);
			}
		//}
	},
	deleteItem:function(o) {
		var item=tag_swapper.ancester(o,'hasLevels');
		var removeItem=item;
		if ($(item.parentNode).hasClass("collapseContent")) removeItem=item.parentNode.parentNode;
		var callOnDelete=tag_swapper.ancester(removeItem.parentNode,'callOnDelete');
		var updateFromButton=tag_swapper.ancester(removeItem,'extensible');
		var indexes=[];
		for(var l=0;l<item.levels.length-1;l++) {
			if (isNaN(item.levels[l])) {
				indexes.push("'"+item.levels[l]+"'");
			}else{
				indexes.push(""+item.levels[l]+"");
			}
		}
		var i=item.levels[item.levels.length-1];
		try{
			//var list=tag_swapper.value;
//console.log(indexes);
			//for(var ii=0;ii<indexes.length;ii++) {
//console.log(list);
			//	list=list[indexes[ii]];
			//}
			//eval('list=tag_swapper.value['+indexes.join('][')+'];');
			var cmd='tag_swapper.value['+indexes.join('][')+'].splice('+i+',1);';
			eval(cmd);
//console.log(cmd);
//console.log(list);
			//list.splice(i,1);
			$(item).find('button').unbind("click");
			var fi=tag_swapper.ancester(item,'formItem');
			if (fi.update) fi.update();
			if ($(removeItem).hasClass("hasLevels")) {
				tag_swapper.updateLevelIndex($(removeItem).siblings('.hasLevels').get());
			}else{
				tag_swapper.updateLevelIndex($(removeItem).siblings().find('>div>div.hasLevels').get());
			}
			$(removeItem).slideUp(500,function() {
				var parent=this.parentNode;
				$(this).remove();
				if ($(callOnDelete).hasClass('callOnDelete')) {
					callOnDelete.update();
				}else{
				}
				if (updateFromButton) {
					//console.log(updateFromButton);
					updateFromButton.update();
				}
			});
		}catch(e){}
	},
	updateLevelIndex:function(items) {
//console.log(items);
		var iii=0;
		for(var i=0;i<items.length;i++) {
//console.log(items[i]);
			if ($(items[i]).hasClass("hasLevels") && !$(items[i]).hasClass("add")) {
				var ii=items[i].levels.length-1;
//console.log("Change index "+ii);
				if (items[i].levels[ii]!=iii) {
					items[i].levels[ii]=iii;
					$(items[i]).find(".hasLevels").each(function(j,e) {
						e.levels[ii]=iii;
//console.log("Change index "+ii+" to "+iii);
					});
				}
				iii++;
			}
		}
	},
	updateOrder:function(e,ui,className) {
		var item=ui.item;
		var id=item.find('>div>div>div.itemId').html();
		var newIndex=item.prevAll('.'+className).get().length;
		var levels=item.parent().find('>button').get(0).levels;
		var list=[];
		var indexes=[];
		for(var l=0;l<levels.length;l++) {
			if (isNaN(levels[l])) {
				indexes.push("'"+levels[l]+"'");
			}else{
				indexes.push(""+levels[l]+"");
			}
		}
		try{
			var oldIndex=0;
			eval('list=tag_swapper.value['+indexes.join('][')+'];');
			for(var i=0;i<list.length;i++) {
				if (list[i].id==id) oldIndex=i;
			}
			var page=list.splice(oldIndex,1);
			list.splice(newIndex,0,page[0]);
		}catch(e){}
		tag_swapper.rebuildOrderIndexes(item);
	},
	rebuildOrderIndexes:function(item) {
//console.log(item);
		var os=$(item).parent().find('>.tag_swapper_sortable>.collapseContent>.hasLevels.indexed').get();
//console.log(os);
		tag_swapper.updateLevelIndex(os);
		/*$(item).parent().find('>.tag_swapper_sortable>.collapseContent>.hasLevels.indexed').each(function(i,o) {
			if (typeof(o.levels)=="object" && o.levels.length>0 && !isNaN(o.levels[o.levels.length-1])) {
				var levelIndex=o.levels.length-1;
				o.levels[levelIndex]=i;
				$(o).find(".hasLevels").each(function(ii,oo) {
					if (typeof(oo.levels)=="object" && oo.levels.length>levelIndex && !isNaN(oo.levels[levelIndex])) {
						oo.levels[levelIndex]=i;
					}
				});
			}
		});*/
	},
	scriptIds:{},
	scriptId:function() {
		var id=this.randomString(10);
		while((typeof(tag_swapper.scriptIds[id])!="undefined")) id=this.randomString(10);
		return id;
	},
	uniqueId:function() {
		var id=this.randomString();
		while(tag_swapper.idExists(id)) id=this.randomString();
		return id;
	},
	idExists:function(id) {
		return (typeof(tag_swapper.ids[id])!="undefined");
	},
	randomString:function() {
		var length=20;
		if (arguments.length>0) length=arguments[0];
		var chars='abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
		var op='';
		while(op.length<length) op+=chars.substr(Math.round(Math.random()*(chars.length-1)),1);
		return op;
	},
	questionTypeSelector:function() {
		var o=document.createElement("select");
		var oo=document.createElement("option");
		oo.value='';
		oo.text="Select a question type...";
		o.appendChild(oo);
		for(var t in this.schema.questions) {
			var oo=document.createElement("option");
			oo.value=t;
			oo.text=this.schema.questions[t].type.initial;
			o.appendChild(oo);
		}
		$(o).addClass("questionSelect");
		return o;
	},
	setAudioValue:function(src,levels,value) {
		var stack=[];
		if (!isNaN(levels[levels.length-1])) levels[levels.length-1]=$(tag_swapper.ancester(src,'indexed')).prevAll('.indexed').get().length;
		for(var l=0;l<levels.length;l++) {
			if (isNaN(levels[l])) {
				stack.push("'"+levels[l]+"'");
			}else{
				stack.push(levels[l]);
			}
		}
		try{
			eval('tag_swapper.value['+stack.join('][')+']={url:"",name:""};');
			eval('tag_swapper.value['+stack.join('][')+'].url=value;');
			if (this.value.audio!==undefined) {
				for(var f=0;f<this.value.audio.length;f++) {
					if (this.value.audio[f].url==value) eval('tag_swapper.value['+stack.join('][')+'].name=tag_swapper.value.audio[f].name;');
				}
			}
		}catch(e){}
		if (tag_swapper.autosave) tag_swapper.saveLocal();
	},
	toDisplay:function(levels) {
		var invert=false;
		if (levels[levels.length-1]=="nextQuestion") invert=true;
		var dl=-1;
		if (levels[levels.length-3]=="questions") dl=-3;
		var stack=[];
		for(var s=0;s<levels.length+dl;s++) stack.push(levels[s]);
		stack.push('serial');
		var val=tag_swapper.levelValue(stack);
		if (levels[levels.length-3]=="questions") {
			return invert?!val:val;
		}else{
			return invert?val:!val;
		}
	},
	serialise:function(o) {
		if (o.checked) {
			$(o).parent().siblings(".param_sound").slideUp().addClass("notInScript");
			$(o).parent().siblings('.param_nextQuestion').slideDown();
			$(o).parent().siblings(".param_questions").find('>.question>.collapseContent>div>.param_sound').slideDown().removeClass("notInScript");
		}else{
			$(o).parent().siblings(".param_sound").slideDown().removeClass("notInScript");
			$(o).parent().siblings('.param_nextQuestion').slideUp();
			$(o).parent().siblings(".param_questions").find('>.question>.collapseContent>div>.param_sound').slideUp().addClass("notInScript");
		}
	},
	setValue:function(src,levels,value) {
		var stack=[];
		if (!isNaN(levels[levels.length-1])) levels[levels.length-1]=$(tag_swapper.ancester(src,'indexed')).prevAll('.indexed').get().length;
		for(var l=0;l<levels.length;l++) {
			if (isNaN(levels[l])) {
				stack.push("'"+levels[l]+"'");
			}else{
				stack.push(levels[l]);
			}
		}
		try{
			eval('tag_swapper.value['+stack.join('][')+']=value;');
		}catch(e){}
		if (src.item!==undefined && src.item.onchange!==undefined) {
			if (typeof(src.item.onchange)=="string") {
				try{
					eval(src.item.onchange);
				}catch(e){}
			}else if (typeof(src.item.onchange)=="function") {
				src.item.onchange();
			}
		}
		if (tag_swapper.autosave) tag_swapper.saveLocal();
	},
	ancester:function(o,c) {
		if ($(o).hasClass(c)) return o;
		if (o==document.body) return false;
		if (!o.parentNode) return false;
		return tag_swapper.ancester(o.parentNode,c);
	},
	collapsible:function(title,content) {
		var className=null;
		var props={};
		if (arguments.length>2) props=arguments[2];
		if (props['className']!==undefined) className=props['className'];
		var add='';
		if (props['sortable']===true) add='<div class="mover">&nbsp;</div>';
		var o=document.createElement("div");
		var t=document.createElement("div");
		var c=document.createElement("div");
		$(t).addClass("collapseButton").bind("click",function() {
			if ($(this).hasClass("open")) {
				$(this).removeClass("open");
				$(this).next().removeClass("open").slideUp();
			}else{
				$(this.parentNode.parentNode).find('>div>.collapseButton.open').removeClass("open");
				$(this.parentNode.parentNode).find('>div>.collapseContent.open').removeClass("open").slideUp();
				$(this).addClass("open");
				$(this).next().addClass("open").slideDown();
			}
		}).html(add+'<nobr>'+title+'</nobr>');
		$(c).addClass("collapseContent").css({display:"none"});
		if (props.deleteable===true) {
			var but=document.createElement("button");
			$(but).attr('type','button').html("delete").addClass("delete");
			$(but).bind("click",function() {
				tag_swapper.deleteItem(this);
			});
			content.insertBefore(but,content.childNodes[0]);
		}
		c.appendChild(content);
		o.appendChild(t);
		o.appendChild(c);
		if (className!==null) $(o).addClass(className);
		if (props['sortable']===true) $(o).addClass('tag_swapper_sortable');
		return o;
	},
	sortable:function(container,items,handles,update) {
		if (container.sortableDefined) $(container).sortable("destroy");
		$(container).sortable({items:items,handle:handles,update:update});
		container.sortableDefined=true;
	},
	save:function(e) {
		var err=tag_swapper.validate();
		tag_swapper.clearLocal();
		if (err.length==0) {
			$('textarea#globalFieldContent').val(json.build(this.value));
			var customcss='';
			if (this.value.main.customCSS!="") customcss=",['widgets/css/"+this.value.main.customCSS+"',false]";
			$('textarea#display').val(this.layout.replace(/\-\-customcss\-\-/,customcss));
			return true;
		}else{
			alert(err.join("\n"));
			e.preventDefault();
			return false;
		}
	},
	keyCode: function (e) {
		var keycode;
		if (window.event) keycode = window.event.keyCode;
		else if (e) keycode = e.which;
		var key = {
			code: keycode,
			alpha: (keycode > 64 && keycode < 91),
			space: (keycode == 32),
			numeric: ((keycode > 47 && keycode < 58) || (keycode > 95 && keycode < 106)),
			decimal: ((keycode > 47 && keycode < 58) || (keycode > 95 && keycode < 106) || (keycode == 189) || (keycode == 190) || (keycode == 110)),
			enter: (keycode == 13),
			escape: (keycode == 27),

			input: ((keycode == 190) || (keycode == 188) || (keycode == 192) || (keycode == 111) || (keycode == 192) || (keycode == 191) || (keycode == 107) || (keycode == 187) || (keycode == 189) || (keycode == 106) || (keycode == 110) || (keycode == 220) || (keycode == 223) || (keycode == 222) || (keycode == 221) || (keycode == 219) || (keycode == 186)),
			tab: (keycode == 9),
			shift: (keycode == 16),
			backspace: (keycode == 8),
			del: (keycode == 46),
			fkey: ((keycode > 111 && keycode < 124) ? keycode - 111 : false),
			home: (keycode == 36),
			end: (keycode == 35),
			up: (keycode == 38),
			down: (keycode == 40),
			left: (keycode == 37),
			right: (keycode == 39),
			navigate: false
		};
		key.navigate = (key.left || key.right || key.del || key.backspace || key.shift || key.home || key.end || key.tab);
		return key;
	}
};
