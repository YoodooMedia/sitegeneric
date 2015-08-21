var boxdrop={
	containers:{
		main:null,
		options:null,
		structure:null
	},
	autosave:false,
	layout:'<div class="boxdrop">&nbsp;</div>\n<script type="text/javascript">\nfunction initThis() {\nvar param={};\nparam.dependencies=[\n[\'dooits/quiz/boxdrop.js\',true],\n[\'css/quiz/boxdrop.css\',true],\n[\'overlay/json.js\',true]\n];\nparam.loaded=function(){\nboxdrop.init({selectors:{container:".boxdrop"}});\n};\nparam.displayed="boxdrop.start";\nparam.saveValues=["boxdrop.output"];\nparam.noscroll=true;\nparam.finished="boxdrop.finishable";\ndooit.init(param);\n}\n</script>',
	value:{},
	schema:{
		main:{
			paragraph:{label:'Paragraph',initial:'',type:'textarea',description:'The paragraph shown under the title on all questions.'},
			intro:{label:'Introduction prompt',initial:'You will now be asked to drop some phrases into the appropriate boxes',type:'textarea',description:'The paragraph shown at the beginning of the Doo-it.'},
			start:{label:'Start button text',initial:'Start',type:'text',description:'The text to drop in the boxes'},
			orderingintro:{label:'Ordering prompt',initial:'Now, place your answers in order of relevance',type:'textarea',description:'The paragraph shown at the beginning of the ordering of the answers.',toDisplay:'boxdrop.value.main.ordering'},
			orderingsound:{label:'Ordering sound file',initial:{url:'',name:'',script:''},type:'audio',description:'The sound file to play at the beginning of the ordering of the answers.',affectButton:false,required:false,script:'orderingintro',toDisplay:'boxdrop.value.main.ordering'},
			outro:{label:'Completion text',initial:'Complete.',type:'textarea',description:'The paragraph shown under the title on all questions.'},
			ordering:{label:'Order the correct answers',initial:false,type:'boolean',description:'Allows the answers, put in a particular box, to be reordered in a list',onchange:'boxdrop.updateOrdering()'},
			boxResponses:{label:'Show correct box on dropping',initial:false,type:'boolean',description:'Indicates the correct answer and displays the appropriate response.',onchange:'boxdrop.updateResponses()'},
			restart:{label:'Restart button text',initial:'Start again',type:'text',description:'The text to drop in the boxes'},
			responseTime:{label:'Response display time',initial:5,type:'integer',description:'If no sound is attached to a response then it will display for this amount of seconds.',notNull:true},
			questions:{label:'Questions',initial:[],type:'question',description:'The questions.',required:true,onchange:'boxdrop.updateResponses();boxdrop.updateOrdering();'},
			boxes:{label:'Boxes',initial:[],type:'box',description:'The globally available boxes for selection by dropping the prompt into it.',onchange:'boxdrop.updateBoxSelectors();boxdrop.updateResponses();'}
		},
		question:{
			elementType:{className:'Question',sortable:true,deleteable:true},
			id:{initial:'boxdrop.uniqueId()',type:'hidden'},
			paragraph:{label:'Paragraph',initial:'',type:'textarea',description:'The paragraph shown for this question only.'},
			prompt:{label:'The prompt text',initial:'Empty',type:'text',description:'The text to drop in the boxes',affectButton:true},
			sound:{label:'Sound file',initial:{url:'',name:'',script:''},type:'audio',description:'The sound file to play with this question.',affectButton:false,required:false,script:'paragraph'},
			topResponse:{label:'Top of the order response',initial:'',type:'text',description:'The response shown if this item is ordered to the top',affectButton:true,toDisplay:'boxdrop.value.main.ordering'},
			topResponseSound:{label:'Top of the order Sound file',initial:{url:'',name:'',script:''},type:'audio',description:'The sound file to play if this item is ordered to the top.',affectButton:false,toDisplay:'boxdrop.value.main.ordering',required:false,script:'topResponse'},
			topResponseColour:{label:'Top of the order Colour',initial:'339933',type:'colour',description:'The top response colour if this item is ordered to the top.',toDisplay:'boxdrop.value.main.ordering'},
			bottomResponse:{label:'Bottom of the order response',initial:'',type:'text',description:'The response shown if this item is ordered to the bottom',affectButton:true,toDisplay:'boxdrop.value.main.ordering'},
			bottomResponseSound:{label:'Bottom of the order Sound file',initial:{url:'',name:'',script:''},type:'audio',description:'The sound file to play if this item is ordered to the bottom.',toDisplay:'boxdrop.value.main.ordering',affectButton:false,required:false,script:'bottomResponse'},
			bottomResponseColour:{label:'Bottom of the order Colour',initial:'993333',type:'colour',description:'The bottom response colour if this item is ordered to the bottom.',toDisplay:'boxdrop.value.main.ordering'},
			otherResponse:{label:'Not Top or Bottom of the order response',initial:'',type:'text',description:'The response shown if this item is not ordered to the top or bottom',toDisplay:'boxdrop.value.main.ordering',affectButton:true},
			otherResponseSound:{label:'Not Top or Bottom of the order Sound file',initial:{url:'',name:'',script:''},type:'audio',description:'The sound file to play if this item is not ordered to the top or bottom.',toDisplay:'boxdrop.value.main.ordering',affectButton:false,required:false,script:'bottomResponse'},
			otherResponseColour:{label:'Not Top or Bottom of the order Colour',initial:'999933',type:'colour',description:'The response colour if this item is not ordered to the top or bottom.'},
			correct:{label:'Correct box',initial:'',type:'boxSelect',description:'Which box is the correct one.'},
			boxes:{label:'Boxes',initial:[],type:'box',description:'The boxes for selection by dropping the prompt into it.',onchange:'boxdrop.updateBoxSelectors()'}
		},
		box:{
			elementType:{className:'Box',sortable:true,deleteable:true},
			id:{initial:'boxdrop.uniqueId()',type:'hidden'},
			text:{label:'Text',initial:'Empty',type:'text',description:'The text for the box.',affectButton:true,required:true,onchange:'boxdrop.updateBoxSelectors()'},
			colour:{label:'Colour',initial:'339933',type:'colour',description:'The box colour.'},
			response:{label:'Correct response text',initial:'Correct',type:'text',description:'The response shown to the user when they select this box if it is correct.',toDisplay:'boxdrop.value.main.boxResponses'},
			sound:{label:'Correct sound file',initial:{url:'',name:'',script:''},type:'audio',description:'The sound file to play with the correct response.',affectButton:false,required:false,script:'response',toDisplay:'boxdrop.value.main.boxResponses'},
			wrongresponse:{label:'Wrong response text',initial:'Wrong',type:'text',description:'The response shown to the user when they DO NOT select this box, only if it is correct.',toDisplay:'boxdrop.value.main.boxResponses'},
			wrongsound:{label:'Correct sound file',initial:{url:'',name:'',script:''},type:'audio',description:'The sound file to play when they DO NOT select this box, only if it is correct.',affectButton:false,required:false,script:'wrongresponse',toDisplay:'boxdrop.value.main.boxResponses'},
			optionTags:{label:'Tags',initial:[],type:'optionTags',description:'The tags that are controlled by this question.'}
		},
		optionTags:{
			elementType:{className:'tag',sortable:true,deleteable:true},
			tag:{label:'Tag name',initial:'',type:'tag',description:'The name of the tag to change.',affectButton:true,required:true},
			remove:{label:'Remove',initial:false,type:'boolean',description:'If the user select this answer then this tag is removed.'},
			unset:{label:'Removable',initial:false,type:'boolean',description:'If the user already has this tag and this answer is not selected, it will be removed.'}
		}
	},
	ids:{},
	clear:function() {
		this.value='';
		this.init();
	},
	init:function() {
		this.autosave=typeof(localStorage)!="undefined";
		if (this.autosave) {
			this.autosaveKey='globalFieldId'+$('input[name=globalFieldId]').val();
			if (localStorage[this.autosaveKey]!==undefined && localStorage[this.autosaveKey]!="") {
				if (window.confirm("Recover autosave data?")) {
					$('textarea#globalFieldContent').val(localStorage[this.autosaveKey]);
					localStorage[this.autosaveKey]='';
					boxdrop.init();
					return false;
				}
			}
		}
		$('form#sf_admin_edit_form').submit(function(e) {
			return boxdrop.save(e);
		});
		this.containers.main=$('.exerciseTemplate').get(0);
		$(this.ancester(this.containers.main,'form-row')).css({overflow:"visible"});
		var val=$('#globalFieldContent').val();
		try{
			eval('boxdrop.value='+val+';');
		}catch(e) {}
		boxdrop.value=json.decode(boxdrop.value);
		this.build();
		this.adminbar();
		this.updateOrdering();
		this.updateResponses();
	},
	adminbar:function() {
		this.containers.adminbar=document.createElement("div");
		$('#sf_admin_bar').append(this.containers.adminbar);
		$(this.containers.adminbar).html("<h3>Audio panel</h3>").css({'margin-top':'20px'});
		var but=document.createElement("button");
		$(but).attr("type","button");
		$(but).html("Get script file").bind("click",function() {
			boxdrop.getScript();
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
			boxdrop.filterLibrary(this.value);
		});
		$(filter).append(ip);
		$(this.containers.audioLibrary).append(but).append(filter).append(this.containers.libraryFiles);
		$(but).bind("click",function() {
			$(boxdrop.containers.libraryFiles).html("Fetching...");
			$(this).slideUp();
			$.ajax({
				url:'/library/ajax',
				method:"POST",
				dataType:'json',
				success:function(obj) {
					$('.filterBox').css({display:"block"});
					$(boxdrop.containers.libraryFiles).empty();
					if (typeof(obj)=="object" && obj.length>0) {
						var found=0;
						obj.sort(function(a,b) {
							if (a.name.toLowerCase()<b.name.toLowerCase()) return -1;
							if (a.name.toLowerCase()>b.name.toLowerCase()) return 1;
							return 0;
						});
						boxdrop.libraryFiles=[];
						for(var o=0;o<obj.length;o++) {
							if (/mp3$/.test(obj[o].url) && !boxdrop.audioRemembered(obj[o].url)) {
								var a=document.createElement("a");
								a.libraryFile=obj[o];
								$(a).html(obj[o].name).attr("href","javascript:void(0)").bind("click",function() {
	boxdrop.rememberAudioFile(this);
	/*var aud={};
	aud.name=this.libraryFile.name;
	aud.url=this.libraryFile.url;
	aud.id=this.libraryFile.id;
	if (boxdrop.value.audio===undefined) boxdrop.value.audio=[];
	boxdrop.value.audio.push(aud);
	if ($(boxdrop.containers.audioLibrary).find('.warning').get().length==0) {
		var d=document.createElement("div");
		$(d).html("This doo-it will remember which files you have selected ONLY if you save it.").css({color:'#f00',display:"none"}).addClass("warning");
		$(boxdrop.containers.audioLibrary).append(d);
		$(d).slideDown();
	}
	$(this).slideUp(500,function() {
		$(this).remove();
	});
	$('.audioSelectInput').each(function(i,e) {boxdrop.audioSelectOptions(e);});*/
								});
								a.title=obj[o].url;
								found++;
								$(boxdrop.containers.libraryFiles).append(a);
								boxdrop.libraryFiles.push(a);
							}
						}
						if (found==0) $(boxdrop.containers.libraryFiles).slideUp(500,function(){$(this).html("No files found").slideDown();});
					}else{
						$(boxdrop.containers.libraryFiles).slideUp(500,function(){$(this).html("No files found").slideDown();});
					}
					
					boxdrop.checkAudioScripts();
				}
			});
		});
	},
	rememberAudioFile:function(obj) {
		var aud={};
		aud.name=obj.libraryFile.name.replace(/_/g,' ');
		aud.url=obj.libraryFile.url;
		aud.id=obj.libraryFile.id;
		if (boxdrop.value.audio===undefined) boxdrop.value.audio=[];
		boxdrop.value.audio.push(aud);
		if ($(boxdrop.containers.audioLibrary).find('.warning').get().length==0) {
			var d=document.createElement("div");
			$(d).html("This doo-it will remember which files you have selected ONLY if you save it.").css({color:'#f00',display:"none"}).addClass("warning");
			$(boxdrop.containers.audioLibrary).append(d);
			$(d).slideDown();
		}
		$(obj).slideUp(500,function() {
			$(this).remove();
		});
		$('.audioSelectInput').each(function(i,e) {boxdrop.audioSelectOptions(e);});
	},
	filterLibrary:function(txt) {
		var found=[];
		if (txt.replace(/ /g,'')=="") {
			$(boxdrop.containers.libraryFiles).empty();
			for(var l=0;l<this.libraryFiles.length;l++) {
				$(this.libraryFiles[l]).bind("click",function() {
					boxdrop.rememberAudioFile(this);
				});
				$(boxdrop.containers.libraryFiles).append(this.libraryFiles[l]);
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
			$(boxdrop.containers.libraryFiles).empty();
			var score=[];
			for(var a=0;a<20;a++) {
				if (a<found.length) {
					score.push(found[a][0]);
					$(found[a][1]).bind("click",function() {
						boxdrop.rememberAudioFile(this);
					});
					$(boxdrop.containers.libraryFiles).append(found[a][1]);
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
				boxdrop.audioUploadCount=ip.files.length;
				var data=new FormData(this.parentNode);
				var xhr=new XMLHttpRequest;
				xhr.open('POST','/library/bulkUploadAudio',true);
				xhr.send(data);
				xhr.onreadystatechange=function() {
					if (this.readyState==4) {
						var r=this.responseText;
						this.getAllResponseHeaders();
						if (this.status==200) r=this.responseText;
						boxdrop.bulkComplete(r);
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
		if (boxdrop.audioUploadCount!=newfiles.length) {
			$(d).html("One or more files failed to upload. They may be higher than the upload limit.").css({color:'#f00',display:"none"}).addClass("warning");
		}else{
			$(d).html("This doo-it will remember which files you have uploaded ONLY if you save it.").css({color:'#f00',display:"none"}).addClass("warning");
		}
		$(d).slideDown();

		$('.audioSelectInput').each(function(i,e) {boxdrop.audioSelectOptions(e);});
		this.checkAudioScripts();
	},
	saveLocal:function() {
		if (this.autosave) localStorage[this.autosaveKey]=json.build(this.value);
	},
	clearLocal:function() {
		if (this.autosave) localStorage[this.autosaveKey]='';
	},
	build:function() {
		$(this.containers.main).html("<h2>boxdrop Construction</h2>");
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
				if (boxdrop.levelValue(levels).length==0) {
					var err=but.item.label+' has no items';
					if(levels.length>2) {
						var parnt=boxdrop.parentValue(levels);
						if (parnt.title!==undefined && parnt.title!="") err+=' in '+parnt.title;
					}
					err+='.';
					missing.push(err);
				}
			}
		});
		$(this.containers.main).find(".requiredValue").each(function(i,e) {
//console.log(e.levels);
			var v=boxdrop.levelValue(e.levels);
			if (v===undefined || v===null || v=='') {
				var err=e.item.label+' is empty';
				if(e.levels.length>2) {
					var parnt=boxdrop.parentTitle(e.levels);
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
			return boxdrop.parentTitle(l);
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
		var level=boxdrop.value;
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
	getItem:function(levels) {
		var obj=this.value;
		while(levels.length>0 && obj!==undefined) {
			obj=obj[levels.shift()];
		}
		return obj;
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
					defaultValue.script=boxdrop.scriptId();
				}
				boxdrop.scriptIds[defaultValue.script]=true;
			}
			if (/\(\)/.test(defaultValue)) {
				try{
					eval('defaultValue='+item.initial+';');
					if (item.initial=='boxdrop.uniqueId()') boxdrop.ids[defaultValue]=true;
				}catch(e){}
			}
			var index=null;
			if (args.length>3) {
				var val=boxdrop.levelValue(levels.concat([]),item,defaultValue,args[3]);
				return val;
			}else{
				var val=boxdrop.levelValue(levels.concat([]),item,defaultValue,item);
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
						boxdrop.object.render(this.parentNode,insertLevels,boxdrop.schema[this.item.type],index);
						if (this.update) this.update();
						return true;
					});
					o.appendChild(but);
					if (item.label) className=item.label;
					ab=$(o).find('.affectButton').get();
				}
				for(var i=0;i<val.length;i++) {
					boxdrop.object.render(o,levels.concat([i]),boxdrop.schema[item.type],i);
				}
				if (item.elementType!==undefined) {
					if (item.elementType.className!==undefined) className=item.elementType.className;
					if (item.elementType.sortable!==undefined) sortable=item.elementType.sortable;
					if (item.elementType.deleteable!==undefined) deleteable=item.elementType.deleteable;
				}
				if (className!==null || sortable==true) {
					o=boxdrop.collapsible((ab.length>0)?ab[0].value:className,o,{className:className.replace(/[^a-z]+/ig,'_'),sortable:sortable,deleteable:deleteable});
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
						boxdrop.deleteItem(this);
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
						if (boxdrop.object[item[k].type]===undefined && typeof(item[k].initial)=="object" && typeof(item[k].initial.length)=="number") {
							var obj=boxdrop.object.render(o,levels.concat([k]),item[k]);
						}else{
							//try{
								var obj=boxdrop.object[item[k].type](o,levels.concat([k]),item[k]);
							//}catch(e) {
							//	console.log(boxdrop.schema[item.type][k].type);
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
						o=boxdrop.collapsible((ab.length>0)?ab[0].value:className,o,{className:className,sortable:sortable,deleteable:deleteable});
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
							boxdrop.deleteItem(this);
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
				if (sortable && className!==null) boxdrop.sortable(target,'>.boxdrop_sortable','>.collapseButton>.mover',function(e,ui) {boxdrop.updateOrder(e,ui,className);});
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
			/*if (item.visible) {
				var visible=true;
				try{
					eval('visible='+item.visible+';');
				}catch(e) {}
				$(o).css({display:visible?'block':'none'});
			}*/
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
					var p=boxdrop.ancester(this,'collapseContent');
					var b=$(p).prev('.collapseButton').find('>nobr');
					var t=this.value.replace(/[^a-z^0-9^ ]+/gi,'');
					b.html(t);
				};
				$(ip).addClass('affectButton');
			}
			$(ip).bind("keyup",function() {
				boxdrop.setValue(this,this.levels,this.value);
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
				boxdrop.setValue(this,this.levels,this.value);
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
					boxdrop.setValue(this,this.levels,1*this.value);
				}
			});
			$(ip).bind("keydown",function(e) {
				var k=boxdrop.keyCode(e);
				if (!k.numeric && !k.navigate) {
					e.preventDefault();
					return false;
				}
			});
			$(ip).bind("keyup",function() {
				boxdrop.setValue(this,this.levels,1*this.value);
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
				var k=boxdrop.keyCode(e);
				if (hasPoint && k.numeric) return true;
				if (k.navigate) return true;
				if (!hasPoint && k.decimal) return true;
				e.preventDefault();
				return false;
			});
			$(ip).bind("keyup",function() {
				boxdrop.setValue(this,this.levels,1*this.value);
			});
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
				boxdrop.setValue(this,this.levels,this.value);
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
					boxdrop.setValue(this,this.levels,this.value);
					this.update();
				});
				if (item.affectButton===true) {
					ip.update=function() {
						var p=boxdrop.ancester(this,'collapseContent');
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
		boxSelect:function(target,levels,item) {
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

			ip.levels=levels;
			$(ip).addClass("hasLevels");
			$(ip).bind("change",function() {
				boxdrop.setValue(this,this.levels,this.value);
			});
			o.appendChild(label);
			o.appendChild(description);
			o.appendChild(ip);
			target.appendChild(o);
			boxdrop.boxSelectOptions(ip,val);
			//$(ip).val(val);
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
				boxdrop.setValue(this,this.levels,this.value);
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
				boxdrop.setValue(this,this.levels,this.checked);
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
				boxdrop.setValue(this,this.levels,this.value);
			});
			o.appendChild(label);
			o.appendChild(description);
			o.appendChild(ip);
			target.appendChild(o);
			$(ip).jPicker({images:{clientPath:'/js/jpicker/images/'},window:{position:{x:'0px',y:'0px'},expandable:true,liveUpdate:true}},function(colour,context) {
				boxdrop.setValue(this,this.levels,this.value);
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
			boxdrop.audioSelectOptions(ip);
			$(ip).bind("change",function() {
				boxdrop.setAudioValue(this,this.levels,$(this).val());
			});
			ip.setTo=function(newUrl) {
				$(this).val(newUrl);
				boxdrop.setAudioValue(this,this.levels,$(this).val());
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
						var p=boxdrop.levelValue(stack);
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
						txt+=' '+boxdrop.levelValue(stack);
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
					eval('res=boxdrop.value['+stack.join('][')+'];');
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
				if (!found && (val!="" && val!=null)) boxdrop.setValue(this,this.levels,'');
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
				boxdrop.setValue(this,this.levels,$(this).val());
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
				this.selector.val=boxdrop.levelValue(this.selector.levels);
				this.draw();
			};
			o.draw=function() {
				while(this.selector.childNodes.length>0) this.selector.removeChild(this.selector.childNodes[0]);
				var page=boxdrop.levelValue([this.selector.levels[0],this.selector.levels[1],this.selector.levels[2]]);
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
				boxdrop.setValue(this,this.levels,this.val);
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
				this.selector.val=boxdrop.levelValue(this.selector.levels);
				this.draw();
			};
			o.draw=function() {
				while(this.selector.childNodes.length>0) this.selector.removeChild(this.selector.childNodes[0]);
				var levels=[];
				for(var i=0;i<this.selector.levels.length-1;i++) levels.push(this.selector.levels[i]);
				var multichoice=boxdrop.levelValue(levels);
				var l=(multichoice.options==undefined)?0:multichoice.options.length;
				if (this.selector.val>l && l>0) {
					this.selector.val=l;
					boxdrop.setValue(this.selector,this.selector.levels,this.selector.val);
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
				boxdrop.setValue(this,this.levels,this.val);
			});
			o.draw();
			o.appendChild(label);
			o.appendChild(description);
			o.appendChild(sel);
			target.appendChild(o);
			return o;
		},
		/*questions:function(target,levels,item) {
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
					for(var k in boxdrop.schema.questions[type]) {
						if (boxdrop.object[boxdrop.schema.questions[type][k].type]!==undefined) {
							var o=boxdrop.object[boxdrop.schema.questions[type][k].type](oo,this.levels.concat([index,k]),boxdrop.schema.questions[type][k]);
						}else{
							var o=boxdrop.object.render(oo,this.levels.concat([index,k]),boxdrop.schema.questions[type][k]);
						}
					}
					var ab=$(oo).find('.affectButton').get();
					oo=boxdrop.collapsible((ab.length>0)?ab[0].value:'Question',oo,{className:'question '+type+'Type',sortable:true,deleteable:true});
					if (boxdrop.schema.questions[type].type.update!==undefined) {
						oo.updateClass=boxdrop.schema.questions[type].type.update;
						oo.update=function() {
							$(this).find('.'+this.updateClass).each(function(i,e) {
								if (e.update!==undefined) e.update();
							});
						};
					}
					$(oo).css({display:"none"});
					this.parentNode.appendChild(oo);
					$(oo).slideDown();
					var fi=boxdrop.ancester(this,'formItemUpdate');
					fi.update();
				}
			});

			var sel=boxdrop.questionTypeSelector();
			o.appendChild(label);
			o.appendChild(sel);
			o.appendChild(button);
			for(var q=0;q<val.length;q++) {
				var oo=document.createElement("div");
				$(oo).addClass("indexed");
				oo.levels=levels.concat([q]);
				$(oo).addClass("hasLevels");
				var sch=boxdrop.schema.questions[val[q].type.replace(/ /g,'')];
				for(var k in sch) {
					if (boxdrop.object[sch[k].type]!==undefined) {
						var ob=boxdrop.object[sch[k].type](oo,levels.concat([q,k]),sch[k]);
					}else{
						var ob=boxdrop.object.render(oo,levels.concat([q,k]),sch[k]);
					}
				}
				var ab=$(oo).find('.affectButton').get();
				oo=boxdrop.collapsible((ab.length>0)?ab[0].value:'Question',oo,{className:'question '+val[q].type.replace(/ /g,'')+'Type',sortable:true,deleteable:true})
				if (sch.type && sch.type.update) {
					$(oo).addClass("callOnDelete");
					oo.updateClass=sch.type.update;
					oo.update=function() {
						$(this).find('.'+this.updateClass).each(function(i,e) {
							if (e.update) e.update();
						});
					}
				}
				o.appendChild(oo);
			}
			o.levels=levels;
			$(o).addClass("hasLevels");
			target.appendChild(o);
			boxdrop.sortable(o,'.question','>.collapseButton .mover',function(e,ui) {boxdrop.updateOrder(e,ui,'question');});
			return o;
		}*/
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
                op += "<html><head></head><body><form id='boxdropPost' action='/utilities/txt.php' method='POST'>";
		op += "<textarea name='txt'>"+content+"</textarea>";
		op += "<textarea name='filename'>"+((title=='')?'Untitled':title)+"</textarea>";
                op += "</form>";
                op += "<script type='text/javascript'>document.getElementById('boxdropPost').submit();</script>";
                op += "</body></html>";
                doc.writeln(op);
                doc.close();
	},
	updateBoxSelectors:function() {
		$(this.containers.main).find(".param_correct select").each(function(i,e) {
			boxdrop.boxSelectOptions(e);
		});
	},
	updateOrdering:function() {
		if (this.value.main.ordering) {
			$(this.containers.main).find(".param_orderingsound,.param_orderingintro,.param_topResponse,.param_topResponseSound,.param_topResponseColour,.param_bottomResponse,.param_bottomResponseSound,.param_bottomResponseColour,.param_otherResponse,.param_otherResponseSound,.param_otherResponseColour").slideDown();
		}else{
			$(this.containers.main).find(".param_orderingsound,.param_orderingintro,.param_topResponse,.param_topResponseSound,.param_topResponseColour,.param_bottomResponse,.param_bottomResponseSound,.param_bottomResponseColour,.param_otherResponse,.param_otherResponseSound,.param_otherResponseColour").slideUp();
		}
	},
	updateResponses:function() {
		if (this.value.main.boxResponses) {
			$(this.containers.main).find(".Box .param_response,.Box .param_sound,.Box .param_wrongresponse,.Box .param_wrongsound").slideDown();
		}else{
			$(this.containers.main).find(".Box .param_response,.Box .param_sound,.Box .param_wrongresponse,.Box .param_wrongsound").slideUp();
		}
	},
	boxSelectOptions:function(ip) {
		var val=$(ip).val();
		if (arguments.length>1) val=arguments[1];
		$(ip).empty();

		var opt=document.createElement("option");
		opt.text="Select the correct box";
		opt.value='';
		ip.appendChild(opt);

		var boxes=[];
		for(var b=0;b<boxdrop.value.main.boxes.length;b++) {
			boxes.push({value:boxdrop.value.main.boxes[b].id,text:boxdrop.value.main.boxes[b].text});
		}
		var l=[];
		for(var i=0;i<ip.levels.length-1;i++) {
			l.push(ip.levels[i]);
		}
		var q=boxdrop.getItem(l);
		if (q!==undefined && q.boxes!=undefined) {
			for(var b=0;b<q.boxes.length;b++) {
				boxes.push({value:q.boxes[b].id,text:q.boxes[b].text});
			}
		}
		for(var b=0;b<boxes.length;b++) {
			//var so=item.options[s];
			var opt=document.createElement("option");
			opt.text=boxes[b].text;
			opt.value=boxes[b].value;
			ip.appendChild(opt);
		}
		$(ip).val(val);
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
		if (!found) {
			var o=document.createElement("option");
			o.value='';
			o.text='No audio';
			if (sel.childNodes.length>0) {
				sel.insertBefore(o,sel.childNodes[0]);
			}else{
				sel.appendChild(o,sel.childNodes[0]);
			}
		}
	},
	deleteItem:function(o) {
		var item=boxdrop.ancester(o,'hasLevels');
		var removeItem=item;
		if ($(item.parentNode).hasClass("collapseContent")) removeItem=item.parentNode.parentNode;
		var callOnDelete=boxdrop.ancester(removeItem.parentNode,'callOnDelete');
		var updateFromButton=boxdrop.ancester(removeItem,'extensible');
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
			//var list=boxdrop.value;
//console.log(indexes);
			//for(var ii=0;ii<indexes.length;ii++) {
//console.log(list);
			//	list=list[indexes[ii]];
			//}
			//eval('list=boxdrop.value['+indexes.join('][')+'];');
			var cmd='boxdrop.value['+indexes.join('][')+'].splice('+i+',1);';
			eval(cmd);
//console.log(cmd);
//console.log(list);
			//list.splice(i,1);
			$(item).find('button').unbind("click");
			var fi=boxdrop.ancester(item,'formItem');
			if (fi.update) fi.update();
			if ($(removeItem).hasClass("hasLevels")) {
				boxdrop.updateLevelIndex($(removeItem).siblings('.hasLevels').get());
			}else{
				boxdrop.updateLevelIndex($(removeItem).siblings().find('>div>div.hasLevels').get());
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
			eval('list=boxdrop.value['+indexes.join('][')+'];');
			for(var i=0;i<list.length;i++) {
				if (list[i].id==id) oldIndex=i;
			}
			var page=list.splice(oldIndex,1);
			list.splice(newIndex,0,page[0]);
		}catch(e){}
		boxdrop.rebuildOrderIndexes(item);
	},
	rebuildOrderIndexes:function(item) {
//console.log(item);
		var os=$(item).parent().find('>.boxdrop_sortable>.collapseContent>.hasLevels.indexed').get();
//console.log(os);
		boxdrop.updateLevelIndex(os);
		/*$(item).parent().find('>.boxdrop_sortable>.collapseContent>.hasLevels.indexed').each(function(i,o) {
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
		while((typeof(boxdrop.scriptIds[id])!="undefined")) id=this.randomString(10);
		return id;
	},
	uniqueId:function() {
		var id=this.randomString();
		while(boxdrop.idExists(id)) id=this.randomString();
		return id;
	},
	idExists:function(id) {
		return (typeof(boxdrop.ids[id])!="undefined");
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
		if (!isNaN(levels[levels.length-1])) levels[levels.length-1]=$(boxdrop.ancester(src,'indexed')).prevAll('.indexed').get().length;
		for(var l=0;l<levels.length;l++) {
			if (isNaN(levels[l])) {
				stack.push("'"+levels[l]+"'");
			}else{
				stack.push(levels[l]);
			}
		}
		try{
			eval('boxdrop.value['+stack.join('][')+']={url:"",name:""};');
			eval('boxdrop.value['+stack.join('][')+'].url=value;');
			if (this.value.audio!==undefined) {
				for(var f=0;f<this.value.audio.length;f++) {
					if (this.value.audio[f].url==value) eval('boxdrop.value['+stack.join('][')+'].name=boxdrop.value.audio[f].name;');
				}
			}
		}catch(e){}
		if (boxdrop.autosave) boxdrop.saveLocal();
	},
	toDisplay:function(levels) {
		var invert=false;
		if (levels[levels.length-1]=="nextQuestion") invert=true;
		var dl=-1;
		if (levels[levels.length-3]=="questions") dl=-3;
		var stack=[];
		for(var s=0;s<levels.length+dl;s++) stack.push(levels[s]);
		stack.push('serial');
		var val=boxdrop.levelValue(stack);
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
		if (!isNaN(levels[levels.length-1])) levels[levels.length-1]=$(boxdrop.ancester(src,'indexed')).prevAll('.indexed').get().length;
		for(var l=0;l<levels.length;l++) {
			if (isNaN(levels[l])) {
				stack.push("'"+levels[l]+"'");
			}else{
				stack.push(levels[l]);
			}
		}
		try{
			eval('boxdrop.value['+stack.join('][')+']=value;');
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
		if (boxdrop.autosave) boxdrop.saveLocal();
	},
	ancester:function(o,c) {
		if ($(o).hasClass(c)) return o;
		if (o==document.body) return false;
		if (!o.parentNode) return false;
		return boxdrop.ancester(o.parentNode,c);
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
				boxdrop.deleteItem(this);
			});
			content.insertBefore(but,content.childNodes[0]);
		}
		c.appendChild(content);
		o.appendChild(t);
		o.appendChild(c);
		if (className!==null) $(o).addClass(className);
		if (props['sortable']===true) $(o).addClass('boxdrop_sortable');
		return o;
	},
	sortable:function(container,items,handles,update) {
		if ($(container).hasClass('ui-sortable')) $(container).sortable("destroy");
		$(container).sortable({items:items,handle:handles,update:update});
	},
	save:function(e) {
		var err=boxdrop.validate();
		boxdrop.clearLocal();
		if (err.length==0) {
			$('textarea#globalFieldContent').val(json.build(this.value));
			$('textarea#display').val(this.layout);
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
