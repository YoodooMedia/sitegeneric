var hotspot={
	containers:{
		main:null,
		options:null,
		structure:null,
		preview:null
	},
	layout:"<div class='hotspot'>&nbsp;</div>\n<script type='text/javascript'>\nfunction initThis() {\nvar param={};\nparam.dependencies=[\n['dooits/quiz/hotspot.js',true],\n['css/quiz/hotspot.css',true]\n];\nparam.loaded=function(){\nhotspot.init({selectors:{container:'.hotspot'}});\n};\nparam.saveValues=['hotspot.output'];\nparam.noscroll=true;\nparam.displayed=function() {hotspot.loaded();};\nparam.finished='hotspot.finishable';\ndooit.init(param);\n}\n</script>",
	value:{
	},
	selections:{
		audio:[],
		responses:[],
		pages:[]
	},
	selectors:{
		audio:[],
		responses:[],
		pages:[]
	},
	removeSelection:function(type,obj) {
		for(var i=hotspot.selections[type].length-1;i>=0;i--) {
			if (hotspot.selections[type][i]===obj) hotspot.selections[type].splice(i,1);
		}
		for(var i=0;i<hotspot.selectors[type].length;i++) {
			if (hotspot.selectors[type][i].update!==undefined) hotspot.selectors[type][i].update();
		}
	},
	updateSelectors:function(type) {
		for(var i=0;i<hotspot.selectors[type].length;i++) {
			if (hotspot.selectors[type][i].update!==undefined) hotspot.selectors[type][i].update();
		}

	},
	schema:{
		main:{
			text:{label:'Introduction text',initial:'',type:'textarea',description:'Before the pages are shown below, the user will be shown this expanation text.'},
			starttext:{label:'Start button text',initial:'Click here to start...',type:'text',description:'The text in the start button.'},
			endtext:{label:'Finished text',initial:'',type:'textarea',description:'After the pages are completed, the user will be shown this text.'},
			restarttext:{label:'Restart button text',initial:'Click here to try again...',type:'text',description:'The text in the restart button.'},
			restart:{label:'Redoable',initial:false,type:'boolean',description:'Can the user go back to the start once all the pages are completed?'},
			fontSize:{label:'Intro and outro font size (px)',initial:20,type:'integer',description:'What size is the font for the introduction and finished screens (in pixels)?'},
			infoSize:{label:'Screen info font size (px)',initial:14,type:'integer',description:'What size is the font for the descriptive text on each screen (in pixels)?'},
			responseSize:{label:'Response font size (px)',initial:20,type:'integer',description:'What size is the font for the responses (in pixels)?'},
			responseShadow:{label:'Response drop shadow',initial:true,type:'boolean',description:'Does the response text have a drop shadow?'},
			responseShadowColour:{label:'Response shadow colour',initial:'000000',type:'colour',description:'The response text drop shadow colour is?'},
			nextPageButton:{label:'Next page button text',initial:'Continue...',type:'text',description:'The text in the next button.'},
			responseWait:{label:'Seconds to show a response if no sound is attached',initial:5,type:'integer',description:'If no sound file is attached to a response, then the response text will be displayed for this amount of seconds.'},
			explanatoryReveal:{label:'How to reveal explanatory text',initial:'0',type:'selection',prefill:[{value:'0',title:'Hide as mouse approaches'},{value:'1',title:'Hide after wait then click to show'}],description:'The behaviour if the explanatory text for a screen, as it is shown overlaying the top of the base image.'},
			pages:{label:'Screens',initial:[],type:'page',description:'Page.',required:true,className:'pages',sortable:true,deletable:true,titleBarColour:'#2d75d8',itemBarColour:'#3c71ba'},
			responses:{label:'Responses',initial:[],type:'response',description:'Responses.',className:'responses',deletable:true,titleBarColour:'#d99f24',itemBarColour:'#c79d43'}
		},
		page:{
			elementType:{className:'pageForm',selection:'pages'},
			id:{uniqueId:true,type:'hidden'},
			title:{label:'Reference name',initial:'Untitled screen',type:'text',description:'The name for this page, used for referencing only.',updateTitle:true,updateParent:true},
			text:{label:'Explanatory text',initial:'',type:'textarea',description:'The explanatory text shown overlaying the top of the image.'},
			sound:{label:'Intro sound file',initial:'',type:'audio',description:'The sound file to explain this page.',affectButton:false,required:false,script:'text'},
			image:{label:'Image',initial:'',type:'image',description:'The base image that presents the hotspots.',updateParent:true},
			rollover:{label:'Rollover image',initial:'',type:'image',description:'The image used for the rollover background for a hotspot. Use the same size image as the base image for best results.',updateParent:true},
			response:{label:'Missed hotspot response',initial:'',type:'selection',selection:'responses',prefill:[{value:'',title:'None'}],description:'Select a response you have already defined as the result of clicking the background and not a hotspot.'},
			nextpage:{label:'If missed, go to screen',initial:'0',type:'selection',selection:'pages',prefill:[{value:'0',title:'Next Page'},{value:'-1',title:'End - stop'}],exclude:'this.parent.elements.id.value',description:'If all hotspots are missed, which screen is to be shown next?'},
			width:{label:'Image width',initial:'',type:'span'},
			height:{label:'Image height',initial:'',type:'span'},
			spots:{label:'Hotspots',initial:[],type:'spot',description:'The hotspot definitions.',required:true,sortable:false,deletable:true,updateParent:true,titleBarColour:'#995500',itemBarColour:'#995500'}
		},
		spot:{
			elementType:{className:'spotForm'},
			id:{uniqueId:true,type:'hidden'},
			title:{label:'Reference name',initial:'Hotspot',type:'text',description:'The name for this hotspot, used for referencing only.',updateTitle:true,updateParent:true},
			left:{initial:0,type:'hidden',description:''},
			top:{initial:0,type:'hidden',description:''},
			width:{initial:50,type:'hidden',description:''},
			height:{initial:50,type:'hidden',description:''},
			rollover:{label:'User rollover image',initial:true,type:'boolean',description:'If the rollover image for this page is available, this hotspot can be chosen to use it or not.',updateParent:true},
			cursor:{label:'Pointer cursor',initial:true,type:'boolean',description:'When the mouse is moved over the hotspot, the cursor change to a pointer, indicating the presence of the hotspot.'},
			nextpage:{label:'Go to screen',initial:'0',type:'selection',selection:'pages',prefill:[{value:'0',title:'Next Page'},{value:'-1',title:'End - stop'}],exclude:'this.parent.parent.parent.elements.id.value',description:'If this hotspot is clicked, which screen is to be shown next?'},
			response:{label:'Perform response',initial:'',type:'selection',selection:'responses',prefill:[{value:'',title:'None'}],description:'Select a response you have already defined as the result of clicking this hotspot.'}
		},
		response:{
			elementType:{className:'responseForm',selection:'responses'},
			id:{uniqueId:true,type:'hidden'},
			title:{label:'Reference name',initial:'Response text',type:'text',description:'The name for this response, used for referencing only.',updateTitle:true,updateParent:true},
			text:{label:'Display text',initial:'',type:'textarea',description:'The text that will be shown to the user when this response is shown.'},
			sound:{label:'Sound file',initial:'',type:'audio',description:'The sound file to play with this response.',affectButton:false,required:false,script:'text'},
			colour:{label:'Colour',initial:'990000',type:'colour',description:'Response text colour.'},
			optionTags:{label:'Tag rules',initial:[],type:'tags',deletable:true,titleBarColour:'#a336e2',itemBarColour:'#a050ce'}
		},
		tags:{
			elementType:{className:'rule'},
			tag:{label:'Tag name',initial:'',type:'tag',description:'The tag to change.',required:true,updateParent:true},
			remove:{label:'Remove',initial:false,type:'boolean',description:'For this response, this tag will be removed if this is checked. Otherwise, it is added.',updateParent:true}
		}
	},
	ids:{},
	savelocal:function() {
		localStorage[this.autosaveKey]=JSON.stringify(this.values());
	},
	init:function() {
		this.autosaveKey='globalFieldId'+$('input[name=globalFieldId]').val();
		this.autosave=typeof(localStorage)!="undefined";
		
		
		$('form#sf_admin_edit_form').submit(function(e) {
			return hotspot.save(e);
		});
		this.containers.main=$('.exerciseTemplate').get(0);
		$(this.ancester(this.containers.main,'form-row')).css({overflow:"visible"});
		var val=$('#globalFieldContent').val();
		/*try{
			eval('hotspot.value='+val+';');
		}catch(e) {}*/
		try{
		if (this.autosave) {
			if (localStorage[this.autosaveKey]!==undefined && localStorage[this.autosaveKey]!="" && localStorage[this.autosaveKey]!=val) {
				if (window.confirm("Recover autosave data?")) {
					$('textarea#globalFieldContent').val(localStorage[this.autosaveKey]);
					localStorage[this.autosaveKey]='';
					hotspot.init();
					return false;
				}
			}
		}
			val=Base64.decode(val);
			hotspot.value=$.parseJSON(val);
		}catch(e) {
			if (val!="") console.log("Failed to parse:",val);
		}
		if (hotspot.value.rememberedAudio!==undefined) this.selections.audio=this.value.rememberedAudio;
		this.build();
		this.adminbar();
		this.render();
	},
	build:function() {
		$(this.containers.main).html("<h2>hotspot Construction</h2>");
		var main=document.createElement("div");
		this.containers.main.appendChild(main);
		this.elements=this.buildElements(this.value,this.schema.main,null);
		
	},
	ancester:function(o,c) {
		if ($(o).hasClass(c)) return o;
		if (o==document.body) return false;
		if (!o.parentNode) return false;
		return hotspot.ancester(o.parentNode,c);
	},
	render:function() {
		for(var k in this.elements) {
			$(this.containers.main).append(this.elements[k].render());
		}
	},
	buildElements:function(v,o,p) {
		var objs={};
		for(var t in o) {
			if (o[t].type!==undefined) {
				objs[t]=null;
				var thisValue=null;
				if (v!==undefined && v!==null && v[t]!==undefined) thisValue=v[t];
				if (typeof(o[t].initial)=='object' && typeof(o[t].initial.length)=='number') {
					objs[t]=new this.extensible(thisValue,o[t],p);
				}else{
					if (this.object[o[t].type]!==undefined) {
						objs[t]=new this.object[o[t].type](thisValue,o[t],p);
					}
				}
			}else if (t=='elementType'){
				//console.log(o[t]);	
			}
		}
		return objs;
	},
	extensible:function(v,o,p) {
		this.parent=p;
		this.schema=o;
		this.container=document.createElement("div");
		if (o.className!==undefined) $(this.container).addClass(o.className);
		this.header=document.createElement("div");
		var but=document.createElement("button");
		but.source=this;
		$(but).attr("type","button").html("<div></div>").addClass("addButton").click(function() {this.source.add();});
		if (this.schema.titleBarColour!==undefined) $(this.header).css({background:this.schema.titleBarColour});
		$(this.container).addClass('extensible').append($(this.header).addClass("itemHeader").append(but).append('<span class="headerTitle">'+o.label+"</div>"));
		this.listedSchema={};
		if (hotspot.schema[o.type]!==undefined) this.listedSchema=hotspot.schema[o.type];
		this.list=[];
		if (v!==null && v.length!==undefined) {
			for(var i=0;i<v.length;i++) this.list.push(new hotspot.object[o.type](v[i],this.listedSchema,this));
		}
		this.render=function() {
			for(var i=0;i<this.list.length;i++) {
				$(this.container).append(this.list[i].render());
			}
			this.makeSortable();
			return this.container;
		};
		this.update=function() {
			this.makeSortable();
		};
		this.json=function() {
			var arr=[];
			for(var a=0;a<this.list.length;a++) arr.push(this.list[a].json());
			return arr;
		};
		this.add=function() {
			var obj=new hotspot.object[this.schema.type](null,this.listedSchema,this);
			this.list.push(obj);
			var con=obj.render();
			$(this.container).append($(con).hide());
			obj.update();
			$(con).slideDown();
			this.update();
			if (this.schema.updateParent===true) this.parent.update(obj);
		};
		this.output=function() {
			var op=[];
			for(var i=0;i<this.list.length;i++) {
				op.push(this.list[i].output());
			}
			return op;
		};
		this.remove=function(obj) {
			var idx=this.index(obj);
			if (idx!==false) {
				this.list.splice(idx,1);
			}
			this.update();
		};
		this.index=function(obj) {
			for(var i=0;i<this.list.length;i++) {
				if (this.list[i]===obj) return i;
			}
			return false;
		};
		this.makeSortable=function() {
			var me=this;
			if (this.schema.sortable===true) {
				$(this.container).sortable({
					containment:this.container,
					items:'>.formItem',
					handle:'.itemHeader>.sortHandle',
					start:function(e,ui) {
						var item=ui.item.context;
						item.startIndex=$(item).prevAll('.formItem').get().length;
					},
					update:function(e,ui) {
						var item=ui.item.context;
						item.stopIndex=$(item).prevAll('.formItem').get().length;
						me.updateOrder(item);
					}
				});
			}
		};
		this.updateOrder=function(a) {
			var items=this.list.splice(a.startIndex,1);
			this.list.splice(a.stopIndex,0,items[0]);
		};
	},
	ids:{},
	uniqueId:function() {
		if (arguments.length>0) {
			this.ids[arguments[0]]=true;
		}else{
			var id=this.randomString();
			while(this.idExists(id)) id=this.randomString();
			return id;
		}
	},
	idExists:function(id) {
		return (typeof(this.ids[id])!="undefined");
	},
	randomString:function() {
		var length=20;
		if (arguments.length>0) length=arguments[0];
		var chars='abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
		var op='';
		while(op.length<length) op+=chars.substr(Math.round(Math.random()*(chars.length-1)),1);
		return op;
	},
	defaultObjectProcess:function(element,schema,value,parent) {
		element.parent=parent;
		element.value=value;
		if ((element.value===undefined || element.value===null) && schema.initial!==undefined) element.value=schema.initial;
		if ((element.value===undefined || element.value===null) && schema.uniqueId===true) element.value=hotspot.uniqueId();
		if ((element.value!==undefined && element.value!==null) && schema.uniqueId===true) hotspot.uniqueId(element.value);
		element.container=document.createElement("div");
		element.container.source=element;
		$(element.container).addClass("formItem");
		if (schema.description!==undefined) {
			element.description=document.createElement("div");
			$(element.description).addClass("itemDescription").html(schema.description);
			$(element.container).append(element.description);
		}
		if (schema.elementType!==undefined) {
			element.elementType=schema.elementType;
			if (schema.elementType.selection!==undefined) hotspot.selections[schema.elementType.selection].push(element);
			if (schema.elementType.className!==undefined) $(element.container).addClass(schema.elementType.className);
		}
		element.elementcontainer=document.createElement("div");
		if (element.parent!==null) {
			if (element.parent.schema.sortable===true || element.parent.schema.deletable===true || element.parent.list!==undefined) {
				element.header=document.createElement("div");
				
				element.expander=document.createElement("button");
				element.header.source=element.expander.source=element;
				$(element.header).append($(element.expander).attr('type','button').addClass('expandButton').html('<div></div>')).click(function(e) {
					var but=$(this).find('>.expandButton');
					var on=!($(but).hasClass("open"));
					if (on) {
						$(this.source.elementcontainer).slideDown();
						$(but).addClass("open");
					}else{
						$(this.source.elementcontainer).slideUp();
						$(but).removeClass("open");
					}
				});
				
				
				if (element.parent.schema.sortable===true) {
					element.handle=document.createElement("div");
					$(element.header).append($(element.handle).html('<div></div>').addClass('sortHandle')).addClass("sortable");
				}
					
					
				element.headerTitle=document.createElement("span");
				$(element.header).append($(element.headerTitle).addClass("headerTitle"));
				if (element.parent.schema.deletable===true) {
					element.deleter=document.createElement("button");
					element.deleter.source=element;
					$(element.header).append($(element.deleter).attr('type','button').addClass('deleteButton').html('<div></div>').click(function() {
						this.source.remove();
					}));
					element.remove=function() {
						this.parent.remove(this);
						this.container.source=this;
						if (this.elementType.selection!==undefined) hotspot.removeSelection(this.elementType.selection,this);
						$(this.container).slideUp(200,function() {
							var me=this.source;
							var p=me.parent;
							if (me.preRemove!==undefined) me.preRemove();
							$(this).remove();
							p.update();
							if (me.postRemove!==undefined) me.postRemove();
						;});
					};
				}
				if (element.parent.schema.itemBarColour!==undefined) $(element.header).css({background:element.parent.schema.itemBarColour});
				$(element.container).append($(element.header).addClass('itemHeader'));
				$(element.elementcontainer).hide();
				if (element.parent.schema.itemBarColour!==undefined) {
					$(element.elementcontainer).css({border:'1px solid '+element.parent.schema.itemBarColour});
				}else{
					$(element.elementcontainer).css({border:'1px solid #999'});
				}
			}
		}
		$(element.container).append($(element.elementcontainer).addClass(""));
		element.schema=schema;
		element.elements=hotspot.buildElements(value,schema,element);
		element.render=function() {
			if (this.schema.updateTitle===true) $(this.parent.headerTitle).html(this.value);
			if (this.schema.label!==undefined) {
				var label=document.createElement('label');
				$(this.container).append($(label).html(this.schema.label));
			}
			if (this.preRender!==undefined) this.preRender();
			var hasElement=false;
			for(var k in this.elements) {
				if (this.elements[k]!==null) {
					$(this.elementcontainer).append(this.elements[k].render());
					hasElement=true;
				}
			}
			if (this.postRender!==undefined) this.postRender();
			//console.log($(this.elementcontainer).html());
			if (this.schema.label===undefined && !hasElement) return null;
			return this.container;
		};
		element.update=function(obj) {
			if (this.elementType!==undefined) {
				if (this.elementType.selection!==undefined) {
					for(var i=0;i<hotspot.selectors[this.elementType.selection].length;i++) {
						if (hotspot.selectors[this.elementType.selection][i].update!==undefined) hotspot.selectors[this.elementType.selection][i].update();
					}
				}
			}
			if (this.schema.updateTitle===true) $(this.parent.headerTitle).html(this.value);
			if (this.preUpdate!==undefined) this.preUpdate(obj);
			if (this.schema.updateParent===true) {
				if (this.parent!==null) this.parent.update(this);
			}
			if (this.postUpdate!==undefined) this.postUpdate(obj);
			hotspot.savelocal();
		};
		element.json=function() {
			if (this.schema.elementType===undefined) return this.value;
			var arr={};
			for(var k in this.elements) arr[k]=this.elements[k].json();
			return arr;
		};
	},
	object:{
		page:function(v,o,p) {
			this.objectName='page';
			hotspot.defaultObjectProcess(this,o,v,p);
			this.postUpdate=function(obj) {
				this.drawPreview();
			};
			this.postRender=function() {
				if (this.previewArea===undefined) {
					this.previewArea=document.createElement("div");
					$(this.elementcontainer).append($(this.previewArea).addClass("pagePreviewArea"));
				}
				if (this.previewTitle===undefined) {
					this.previewTitle=document.createElement("div");
					$(this.previewArea).append($(this.previewTitle).html($('#title').val()).addClass('previewTitle'));
				}
				if (this.preview===undefined) {
					this.preview=document.createElement("div");
					$(this.previewArea).append($(this.preview).addClass("pagePreview"));
				}
				if (this.elements.image.value=='') $(this.elements.spots.container).hide();
				this.drawPreview(true);
				
			};
			this.drawPreview=function() {
				var firstTime=false;
				if (arguments.length>0) firstTime=arguments[0];
				if (this.previewImage===undefined) {
					this.previewImage=document.createElement("img");
					$(this.preview).append(this.previewImage);
				}
				if (this.elements.image.value!="" && this.elements.image.value!=this.previewImage.src) {
					this.previewImage.src=this.elements.image.value;
					this.previewImage.source=this;
					if (firstTime) {
						$(this.preview).css({width:this.elements.width.value+2});
					}else{
						$(this.previewImage).bind("error",function() {
							
						}).bind("load",function() {
							$(this.source.preview).animate({width:$(this).width()+2});
							this.source.elements.width.value=$(this).width();
							$(this.source.elements.width.input).html(this.source.elements.width.value);
							this.source.elements.height.value=$(this).height();
							$(this.source.elements.height.input).html(this.source.elements.height.value);
							if ($(this.source.elements.spots.container).css('display')=='none') $(this.source.elements.spots.container).slideDown();
							//console.log($(this).width(),$(this).height());
						});
					}
				}
				//$(this.preview).find('.spot').remove();
				for(var s=0;s<this.elements.spots.list.length;s++) {
					var cont=this.elements.spots.list[s].preview();
					if (this.elements.rollover.value!="") this.elements.spots.list[s].setBackground(this.elements.rollover.value);
					if (cont.parentNode===null) {
						$(this.preview).append(cont);
						
						$(cont).draggable({
							containment:this.preview,
							stop:function(e,ui) {
								ui.helper[0].source.updatePosition();
							},
							drag:function(e,ui) {
								ui.helper[0].source.placeBackground(ui.position);
							}
						}).bind('mouseenter',function() {
							if ($(this).siblings(".ui-draggable-dragging,.ui-resizing").get().length==0) {
								this.parentNode.appendChild(this);
							}
						});
					}
				}
			};
		},
		response:function(v,o,p) {
			this.objectName='response';

			hotspot.defaultObjectProcess(this,o,v,p);
		},
		tags:function(v,o,p) {
			this.objectName='tags';

			hotspot.defaultObjectProcess(this,o,v,p);
			this.postUpdate=function(obj){
				var str=this.elements.tag.value;
				if (str=='') {
					str="Not defined";
				}else if (this.elements.remove.value===true) {
					str='Remove '+str;
				}else{
					str='Add '+str;
				}
				$(this.headerTitle).html(str);
			};
		},
		spot:function(v,o,p) {
			this.objectName='spot';

			hotspot.defaultObjectProcess(this,o,v,p);
			this.preview=function() {
				if (this.box!==undefined) return this.box;
				this.box=document.createElement("div");
				this.box.source=this;
				$(this.box).addClass("spot").css({
					top:this.elements.top.value,
					left:this.elements.left.value,
					width:this.elements.width.value,
					height:this.elements.height.value
				});
				var inbox=document.createElement("div");
				$(this.box).append(inbox);
				this.titleBox=document.createElement("div");
				$(inbox).append($(this.titleBox).html('<span>'+this.elements.title.value+'</span>').addClass("boxTitle"));
				this.stretch=document.createElement("div");
				this.stretchHandle=document.createElement("div");
				this.stretchHandle.source=this;
				$(inbox).append($(this.stretch).addClass('bottomRight').append($(this.stretchHandle).addClass('stretchHandle')));				
				$(this.stretchHandle).draggable({
					start:function(e,ui) {
						var spot=ui.helper[0].source;
						$(spot.box).addClass("ui-resizing");
					},drag:function(e,ui) {
						var x=ui.position.left-ui.originalPosition.left;
						var y=ui.position.top-ui.originalPosition.top;
						var spot=ui.helper[0].source;
						var maxWidth=$(spot.box.parentNode).width()-2-spot.elements.left.value;
						var maxHeight=$(spot.box.parentNode).height()-2-spot.elements.top.value;
						var w=spot.elements.width.value+x;
						var h=spot.elements.height.value+y;
						if (w<20) w=20;
						if (h<20) h=20;
						if (w>maxWidth) w=maxWidth;
						if (h>maxHeight) h=maxHeight;
						$(spot.box).width(w);
						$(spot.box).height(h);
						spot.placeBackground();
					},stop:function(e,ui) {
						var x=ui.position.left-ui.originalPosition.left;
						var y=ui.position.top-ui.originalPosition.top;
						var spot=ui.helper[0].source;
						$(spot.box).removeClass("ui-resizing");
						spot.adjustSize(x,y);
						spot.placeBackground();
						//console.log(ui);
					},revert:true,
					revertDuration:0
				});
				return this.box;
			};
			this.updatePosition=function() {
				//this.elements.top.input.value=
				this.elements.top.value=1*$(this.box).css('top').replace('px','');
				//this.elements.left.input.value=
				this.elements.left.value=1*$(this.box).css('left').replace('px','');
				//this.elements.width.input.value=
				this.elements.width.value=1*$(this.box).width();
				//this.elements.height.input.value=
				this.elements.height.value=1*$(this.box).height();
				this.placeBackground();
			};
			this.adjustSize=function(dx,dy) {
				var maxWidth=$(this.box.parentNode).width()-2-this.elements.left.value;
				var maxHeight=$(this.box.parentNode).height()-2-this.elements.top.value;
				this.elements.width.value+=dx;
				if (this.elements.width.value<20) this.elements.width.value=20;
				if (this.elements.width.value>maxWidth) this.elements.width.value=maxWidth;
				this.elements.height.value+=dy;
				if (this.elements.height.value<20) this.elements.height.value=20;
				if (this.elements.height.value>maxHeight) this.elements.height.value=maxHeight;
				//this.elements.width.input.value=this.elements.width.value;
				//this.elements.height.input.value=this.elements.height.value;
				$(this.box).width(this.elements.width.value);
				$(this.box).height(this.elements.height.value);
			};
			this.setBackground=function() {
				if (arguments.length>0) this.background=arguments[0];
				var src=this.background;
				if (this.elements.rollover.value!==true) src='none';
				$(this.box).css({'background-image':((src=='none')?src:'url('+src+')')});
				this.placeBackground();
			};
			this.placeBackground=function() {
				var pos={left:this.elements.left.value,top:this.elements.top.value};
				if (arguments.length>0) pos=arguments[0];
				if (this.background!==undefined) {
					$(this.box).css({'background-position':'-'+pos.left+'px -'+pos.top+'px'});
				}
			};
			this.postUpdate=function(obj){
				this.setBackground();
				$(this.titleBox).html('<span>'+this.elements.title.value+'</span>');
			};
			this.preRemove=function() {
				$(this.box).remove();
			};
		},
		text:function(v,o,p) {
			this.objectName='text';

			hotspot.defaultObjectProcess(this,o,v,p);
			this.preRender=function() {
				this.input=document.createElement("input");
				$(this.input).bind("keydown",function(e) {
					var k=hotspot.keyCode(e);
					if (k.enter) e.preventDefault();
				});
				this.input.source=this;
				$(this.input).attr("type","text").val(this.value).bind('keyup change',function() {this.source.value=this.value;this.source.update();});
				$(this.container).append(this.input);
			};
		},
		textarea:function(v,o,p) {
			this.objectName='text';

			hotspot.defaultObjectProcess(this,o,v,p);
			this.preRender=function() {
				this.input=document.createElement("textarea");
				/*$(this.input).bind("keydown",function(e) {
					var k=hotspot.keyCode(e);
					if (k.enter) e.preventDefault();
				});*/
				this.input.source=this;
				$(this.input).val(this.value).bind('keyup change',function() {this.source.value=this.value;this.source.update();});
				$(this.container).append(this.input);
			};
		},
		integer:function(v,o,p) {
			this.objectName='integer';

			hotspot.defaultObjectProcess(this,o,v,p);
			this.preRender=function() {
				this.input=document.createElement("input");
				$(this.input).bind("keydown",function(e) {
					var k=hotspot.keyCode(e);
					if (k.enter || !(k.numeric || k.navigate)) e.preventDefault();
				}).css({width:'10%'});
				this.input.source=this;
				$(this.input).attr("type","text").val(this.value).bind('keyup change',function() {this.source.value=this.value;this.source.update();});
				$(this.container).append(this.input);
			};
		},
		span:function(v,o,p) {
			this.objectName='span';

			hotspot.defaultObjectProcess(this,o,v,p);
			this.preRender=function() {
				this.input=document.createElement("span");
				this.input.source=this;
				$(this.input).html(this.value);
				$(this.container).append(this.input);
			};
		},
		boolean:function(v,o,p) {
			this.objectName='boolean';

			hotspot.defaultObjectProcess(this,o,v,p);
			this.preRender=function() {
				this.input=document.createElement("input");
				$(this.input).attr("type","checkbox");
				if (this.value) this.input.checked=true;
				this.input.source=this;
				$(this.input).bind('change',function() {this.source.value=this.checked;this.source.update();});
				$(this.container).append(this.input);
			};
		},
		hidden:function(v,o,p) {
			this.objectName='hidden';

			hotspot.defaultObjectProcess(this,o,v,p);
		},
		colour:function(v,o,p) {
			this.objectName='colour';

			hotspot.defaultObjectProcess(this,o,v,p);
			
			this.preRender=function() {
				this.input=document.createElement("input");
				this.input.type='text';
				this.input.value=this.value;
				this.input.source=this;
				$(this.input).addClass("colour");
				/*$(this.input).bind("change",function() {
					this.source.value=this.value;
					this.source.update();
				});*/
				$(this.container).append(this.input);
				$(this.input).jPicker({images:{clientPath:'/js/jpicker/images/'},window:{liveUpdate:true}},function(colour,context) {
					this.source.value=colour.val().hex;
					this.source.update();
				});
			};
		},
		image:function(v,o,p) {
			this.objectName='image';

			hotspot.defaultObjectProcess(this,o,v,p);
			this.preRender=function() {
				this.input=document.createElement("span");
				$(this.input).addClass('imageThumb');
				this.input.source=this;
				if (v!==null && v.length>0) {
					$(this.input).css({'background-image':'url('+v.replace(/(fit|crop)\/\d+\/\d+\//,'crop/80/80/')+')'});
				}else{
					
				}
				$(this.container).append(this.input);
				var me=this;
				this.input.update=function(me,img) {
					this.source.value=img.source;
					$(this).css({'background-image':'url('+this.source.value.replace(/(fit|crop)\/\d+\/\d+\//,'crop/80/80/')+')'});
					this.source.update();
				};
				$(this.input).click(function() {
					yoodoo.selectImage(this,"dooits",'dooitMinusHeading');
				});
			};
		},
		tag:function(v,o,p) {
			this.objectName='tag';

			hotspot.defaultObjectProcess(this,o,v,p);
			this.preRender=function() {
				this.input=document.createElement("select");
				var opt=document.createElement("option");
				opt.value=opt.text='';
				$(this.input).append(opt);
				for(var t=0;t<accessibleTags.length;t++) {
					var opt=document.createElement("option");
					opt.value=opt.text=accessibleTags[t];
					if (opt.value==v) opt.selected=true;
					$(this.input).append(opt);
				}
				this.input.source=this;
				$(this.input).bind("change",function() {
					this.source.value=this.value;
					this.source.update();
				});
				$(this.container).append(this.input);
			};
			
		},
		selection:function(v,o,p) {
			this.objectName='tag';

			hotspot.defaultObjectProcess(this,o,v,p);
			this.preRender=function() {
				this.input=document.createElement("select");
				this.input.source=this;
				$(this.input).bind("change",function() {
					this.source.value=this.value;
					this.source.update();
				});
				$(this.container).append(this.input);
				this.update();
				if (this.schema.selection!==undefined) hotspot.selectors[this.schema.selection].push(this);
			};
			this.preUpdate=function() {
				$(this.input).empty();
				var checked=false;
				var exclude=null;
				try{
					eval('exclude='+this.schema.exclude);
				}catch(e) {}
				for(var t=0;t<this.schema.prefill.length;t++) {
					var opt=document.createElement("option");
					opt.value=this.schema.prefill[t].value;
					opt.text=this.schema.prefill[t].title;
					if (opt.value==this.value) checked=opt.selected=true;
					$(this.input).append(opt);
				}
				if (this.schema.selection!==undefined) {
					for(var t=0;t<hotspot.selections[this.schema.selection].length;t++) {
						if (exclude!==hotspot.selections[this.schema.selection][t].elements.id.value) {
							var opt=document.createElement("option");
							opt.value=hotspot.selections[this.schema.selection][t].elements.id.value;
							opt.text=hotspot.selections[this.schema.selection][t].elements.title.value;
							if (opt.value==this.value) checked=opt.selected=true;
							$(this.input).append(opt);
						}
					}
				}
				if (checked===false) {
					var opt=$(this.input).find("option").get(0);
					this.value=opt.value;
					opt.selected=true;
				}
			};
		},
		audio:function(v,o,p) {
			this.objectName='tag';
			hotspot.defaultObjectProcess(this,o,v,p);
			this.preRender=function() {
				this.input=document.createElement("select");
				this.audio=document.createElement("audio");
				$(this.audio).attr("controls","").hide().css({display:'block',margin:'2px auto'});
				this.input.source=this;
				$(this.input).bind("change",function() {
					try{
						eval('this.source.value='+this.value);
					}catch(e) {
						this.source.value=this.value;
					}
					this.source.update();
				});
				$(this.container).append(this.input).append(this.audio);
				this.update();
				hotspot.selectors['audio'].push(this);
			};
			this.preUpdate=function() {
				if (this.value.url!="" && this.value.url!==undefined) {
					if (this.audioSource!==undefined && this.audioSource.src!=this.value.url) {
						$(this.audioSource).remove();
						this.audioSource==undefined;
					}
					if (this.audioSource===undefined) {
						$(this.audio).slideDown();
						this.audioSource=document.createElement("source");
						$(this.audio).append(this.audioSource);
					}
					if (/mp3$/.test(this.value)) $(this.audioSource).attr("type","audio/mpeg");
					if (/wav$/.test(this.value)) $(this.audioSource).attr("type","audio/wav");
					if (/ogg$/.test(this.value)) $(this.audioSource).attr("type","audio/ogg");
					$(this.audioSource).attr("src",this.value.url);
				}else{
					$(this.audioSource).remove();
					this.audioSource=undefined;
					$(this.audio).slideUp();
				}
				$(this.input).empty();
				var checked=false;
				
					var opt=document.createElement("option");
					opt.value='';
					opt.text='';
					$(this.input).append(opt);
					
				for(var t=0;t<hotspot.selections.audio.length;t++) {
					var opt=document.createElement("option");
					opt.value=json.build(hotspot.selections.audio[t]);
					opt.text=hotspot.selections.audio[t].name;
					if (hotspot.selections.audio[t].id==this.value.id) checked=opt.selected=true;
					$(this.input).append(opt);
				}
				if (checked===false) {
					var opt=$(this.input).find("option").get(0);
					this.value=opt.value;
					opt.selected=true;
				}
			};
		}
	},
	uniqueId:function() {
		var id=this.randomString();
		while(hotspot.idExists(id)) id=this.randomString();
		return id;
	},
	idExists:function(id) {
		return (typeof(hotspot.ids[id])!="undefined");
	},
	randomString:function() {
		var length=20;
		var chars='abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
		var op='';
		while(op.length<length) op+=chars.substr(Math.round(Math.random()*(chars.length-1)),1);
		return op;
	},
	values:function() {
		var op={};
		for(var k in this.elements) {
			op[k]=this.elements[k].json();
		}
		op.rememberedAudio=this.selections.audio;
		return op;
	},
	validate:function() {
		return [];
	},
	save:function(e) {
		var err=hotspot.validate();
		if (err.length==0) {
			var txt=JSON.stringify(this.values());
			txt=Base64.encode(txt);
			$('textarea#globalFieldContent').val(txt);
			localStorage[this.autosaveKey]=txt;
			$('textarea#display').val(this.layout);
			return true;
		}else{
			alert(err.join("\n"));
			e.preventDefault();
			return false;
		}
	},
	
	adminbar:function() {
		this.containers.adminbar=document.createElement("div");
		$('#sf_admin_bar').append(this.containers.adminbar);
		$(this.containers.adminbar).html("<h3>Audio panel</h3>").css({'margin-top':'20px'});
		this.bulkUploader();
		this.libraryAudio();
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
			hotspot.filterLibrary(this.value);
		});
		$(filter).append(ip);
		$(this.containers.audioLibrary).append(but).append(filter).append(this.containers.libraryFiles);
		$(but).bind("click",function() {
			$(hotspot.containers.libraryFiles).html("Fetching...");
			$(this).slideUp();
			$.ajax({
				url:'/library/ajax',
				method:"POST",
				dataType:'json',
				success:function(obj) {
					$('.filterBox').css({display:"block"});
					$(hotspot.containers.libraryFiles).empty();
					if (typeof(obj)=="object" && obj.length>0) {
						var found=0;
						obj.sort(function(a,b) {
							if (a.name.toLowerCase()<b.name.toLowerCase()) return -1;
							if (a.name.toLowerCase()>b.name.toLowerCase()) return 1;
							return 0;
						});
						hotspot.libraryFiles=[];
						for(var o=0;o<obj.length;o++) {
							if (/mp3$/.test(obj[o].url) && !hotspot.audioRemembered(obj[o].url)) {
								var a=document.createElement("a");
								a.libraryFile=obj[o];
								$(a).html(obj[o].name).attr("href","javascript:void(0)").bind("click",function() {
	hotspot.rememberAudioFile(this);
								});
								a.title=obj[o].url;
								found++;
								$(hotspot.containers.libraryFiles).append(a);
								hotspot.libraryFiles.push(a);
							}
						}
						if (found==0) $(hotspot.containers.libraryFiles).slideUp(500,function(){$(this).html("No files found").slideDown();});
					}else{
						$(hotspot.containers.libraryFiles).slideUp(500,function(){$(this).html("No files found").slideDown();});
					}
					
					//hotspot.checkAudioScripts();
				}
			});
		});
	},
	rememberAudioFile:function() {
		var obj=null;
		if (arguments.length>0) obj=arguments[0];
		if (obj!==null) {
			var aud={};
			aud.name=obj.libraryFile.name.replace(/_/g,' ');
			aud.url=obj.libraryFile.url;
			aud.id=obj.libraryFile.id;
			if (this.audioRemembered(aud)) return false;
			hotspot.selections.audio.push(aud);
		}
		hotspot.updateSelectors('audio');
		if ($(hotspot.containers.audioLibrary).find('.warning').get().length==0) {
			var d=document.createElement("div");
			$(d).html("This doo-it will remember which files you have selected ONLY if you save it.").css({color:'#f00',display:"none"}).addClass("warning");
			$(hotspot.containers.audioLibrary).append(d);
			$(d).slideDown();
		}
		$(obj).slideUp(500,function() {
			$(this).remove();
		});
		//$('.audioSelectInput').each(function(i,e) {hotspot.audioSelectOptions(e);});
	},
	audioRemembered:function(aud) {
		for(var a=0;a<hotspot.selections.audio.length;a++) {
			if (hotspot.selections.audio[a].url==aud.url) return true;
		}
		return false;
	},
	filterLibrary:function(txt) {
		var found=[];
		if (txt.replace(/ /g,'')=="") {
			$(hotspot.containers.libraryFiles).empty();
			for(var l=0;l<this.libraryFiles.length;l++) {
				$(this.libraryFiles[l]).bind("click",function() {
					hotspot.rememberAudioFile(this);
				});
				$(hotspot.containers.libraryFiles).append(this.libraryFiles[l]);
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
			$(hotspot.containers.libraryFiles).empty();
			var score=[];
			for(var a=0;a<20;a++) {
				if (a<found.length) {
					score.push(found[a][0]);
					$(found[a][1]).bind("click",function() {
						hotspot.rememberAudioFile(this);
					});
					$(hotspot.containers.libraryFiles).append(found[a][1]);
				}
			}
		}
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
				hotspot.audioUploadCount=ip.files.length;
				var data=new FormData(this.parentNode);
				var xhr=new XMLHttpRequest;
				xhr.open('POST','/library/bulkUploadAudio',true);
				xhr.send(data);
				xhr.onreadystatechange=function() {
					if (this.readyState==4) {
						var r=this.responseText;
						this.getAllResponseHeaders();
						if (this.status==200) r=this.responseText;
						hotspot.bulkComplete(r);
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
		//if (this.value.audio===undefined) this.value.audio=[];
		for(var f=0;f<newfiles.length;f++) {
			if (!this.audioRemembered(newfiles[f])) hotspot.selections.audio.push(newfiles[f]);
		}
		hotspot.updateSelectors('audio');
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
		if (hotspot.audioUploadCount!=newfiles.length) {
			$(d).html("One or more files failed to upload. They may be higher than the upload limit.").css({color:'#f00',display:"none"}).addClass("warning");
		}else{
			$(d).html("This doo-it will remember which files you have uploaded ONLY if you save it.").css({color:'#f00',display:"none"}).addClass("warning");
		}
		$(d).slideDown();

		$('.audioSelectInput').each(function(i,e) {hotspot.audioSelectOptions(e);});
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

var Base64 = {

	// private property
	_keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

	// public method for encoding
	encode: function (input) {
		var output = "";
		var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
		var i = 0;

		input = Base64._utf8_encode(input);

		while (i < input.length) {

			chr1 = input.charCodeAt(i++);
			chr2 = input.charCodeAt(i++);
			chr3 = input.charCodeAt(i++);

			enc1 = chr1 >> 2;
			enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
			enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
			enc4 = chr3 & 63;

			if (isNaN(chr2)) {
				enc3 = enc4 = 64;
			} else if (isNaN(chr3)) {
				enc4 = 64;
			}

			output = output +
				this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
				this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);

		}

		return output;
	},

	// public method for decoding
	decode: function (input) {
		var output = "";
		var chr1, chr2, chr3;
		var enc1, enc2, enc3, enc4;
		var i = 0;

		input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

		while (i < input.length) {

			enc1 = this._keyStr.indexOf(input.charAt(i++));
			enc2 = this._keyStr.indexOf(input.charAt(i++));
			enc3 = this._keyStr.indexOf(input.charAt(i++));
			enc4 = this._keyStr.indexOf(input.charAt(i++));

			chr1 = (enc1 << 2) | (enc2 >> 4);
			chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
			chr3 = ((enc3 & 3) << 6) | enc4;

			output = output + String.fromCharCode(chr1);

			if (enc3 != 64) {
				output = output + String.fromCharCode(chr2);
			}
			if (enc4 != 64) {
				output = output + String.fromCharCode(chr3);
			}

		}

		output = Base64._utf8_decode(output);

		return output;

	},

	// private method for UTF-8 encoding
	_utf8_encode: function (string) {
		string = string.replace(/\r\n/g, "\n");
		var utftext = "";

		for (var n = 0; n < string.length; n++) {

			var c = string.charCodeAt(n);

			if (c < 128) {
				utftext += String.fromCharCode(c);
			} else if ((c > 127) && (c < 2048)) {
				utftext += String.fromCharCode((c >> 6) | 192);
				utftext += String.fromCharCode((c & 63) | 128);
			} else {
				utftext += String.fromCharCode((c >> 12) | 224);
				utftext += String.fromCharCode(((c >> 6) & 63) | 128);
				utftext += String.fromCharCode((c & 63) | 128);
			}

		}

		return utftext;
	},

	// private method for UTF-8 decoding
	_utf8_decode: function (utftext) {
		var string = "";
		var i = 0;
		var c = c1 = c2 = 0;

		while (i < utftext.length) {

			c = utftext.charCodeAt(i);

			if (c < 128) {
				string += String.fromCharCode(c);
				i++;
			} else if ((c > 191) && (c < 224)) {
				c2 = utftext.charCodeAt(i + 1);
				string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
				i += 2;
			} else {
				c2 = utftext.charCodeAt(i + 1);
				c3 = utftext.charCodeAt(i + 2);
				string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
				i += 3;
			}

		}

		return string;
	}

};