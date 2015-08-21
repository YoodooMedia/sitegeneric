var certificate={
	containers:{
		main:null,
		options:null,
		structure:null,
		preview:null
	},
	layout:"<div class='certificate'>&nbsp;</div>\n<script type='text/javascript'>\nfunction initThis() {\nvar param={};\nparam.dependencies=[\n['dooits/motivation/certificate.js',true],\n['css/motivation/certificate.css',true],\n['overlay/json.js',true]\n];\nparam.loaded=function(){\ncertificate.init({selectors:{container:'.certificate'}});\n};\nparam.saveValues=['certificate.output'];\nparam.noscroll=true;\nparam.displayed=function() {certificate.loaded();};\nparam.finished='certificate.finishable';\ndooit.init(param);\n}\n</script>",
	value:{
	},
	schema:{
		main:{
			title:{label:'Filename',initial:'{user} certificate',type:'text',description:'The PDF filename. Use {user} where the user\'s fullname is to appear.'},
			orientation:{label:'Orientation',initial:'Landscape',options:['Landscape','Portrait'],type:'select',description:'The certificate A4 page orientation.'},
			background:{label:'Background',initial:'',type:'image',description:'Background image.'},
			backgroundWidth:{label:'Background width',initial:278,type:'hidden',description:''},
			backgroundHeight:{label:'Background height',initial:190,type:'hidden',description:''},
			text:{label:'Text',initial:[],type:'texts',description:'Page text inserts.',required:true}
		},
		texts:{
			elementType:{className:'texts',sortable:false,deleteable:true},
			text:{label:'Text',initial:'{user}',type:'text',description:'The text. Use {user} where the user\'s fullname is to appear.'},
			font:{label:'Font',initial:'Arial',options:[
				'Arial',
				'Courier',
				'Helvetica',
				'Times'
			],type:'select',description:'The font family of the text.'},
			fontstyle:{label:'Font style',initial:'',options:[
				'',
				'B',
				'BI',
				'BU',
				'I',
				'IU',
				'U'
			],type:'select',description:'The font style of the text.'},
			size:{label:'Font size (mm)',initial:'4',type:'decimal',description:'The size of the text in mm.'},
			height:{label:'Line height (mm)',initial:'5',type:'decimal',description:'The size of the text block in mm.'},
			x:{label:'Indent',initial:'0',type:'decimal',description:'The distance form the left edge in mm.'},
			y:{label:'From top (mm)',initial:'0',type:'decimal',description:'The distance from the top in mm. This is adjusted automatically if the text in the preview is dragged.'},
			align:{label:'Alignment',initial:'Center',options:['Left','Center','Right'],type:'select',description:'The text alignment within its block.'},
			colour:{label:'Colour',initial:'000000',type:'colour',description:'The text colour.'}
		}
	},
	ids:{},
	init:function() {
		$('form#sf_admin_edit_form').submit(function(e) {
			return certificate.save(e);
		});
		this.containers.main=$('.exerciseTemplate').get(0);
		$(this.ancester(this.containers.main,'form-row')).css({overflow:"visible"});
		var val=$('#globalFieldContent').val();
		try{
			eval('certificate.value='+val+';');
		}catch(e) {}
		certificate.value=json.decode(certificate.value);
		this.build();
	},
	build:function() {
		$(this.containers.main).html("<h2>Certificate Construction</h2>");
		var main=document.createElement("div");
		this.containers.main.appendChild(main);
		var prevh2=document.createElement("h2");
		$(prevh2).html("Certificate Preview");
		this.containers.preview=document.createElement("div");
		$(this.containers.preview).addClass("previewArea");
		this.containers.main.appendChild(prevh2);
		this.containers.main.appendChild(this.containers.preview);
		this.render(main,'main');
		this.preview();
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
	preview:function() {
		$(this.containers.preview).empty();
		var dpi=1;
		var w=$(this.containers.preview).width();
		if (this.value.main.orientation=="Landscape") {
			$(this.containers.preview).css({height:Math.round((190*w)/278)});
			dpi=278/w;
		}else{
			$(this.containers.preview).css({height:Math.round((278*w)/190)});
			dpi=190/w;
		}
		if (this.value.main.background!="") {
			var bd=document.createElement("img");
			bd.src=this.value.main.background;
			$(bd).attr("width",w+"px").css({visibility:"hidden"});
			$(bd).bind("error",function() {$(this).remove();}).bind("load",function() {
				if (certificate.value.main.orientation=="Landscape") {
					certificate.value.main.backgroundWidth=278;
					var ap=$(this).width()/$(this).height();
					certificate.value.main.backgroundHeight=Math.round(278/ap);
				}else{
					certificate.value.main.backgroundWidth=190;
					var ap=$(this).height()/$(this).width();
					certificate.value.main.backgroundHeight=Math.round(190*ap);
				}
				$(this).css({visibility:"visible"});
			}).css({position:"absolute",top:0,left:0});
			this.containers.preview.appendChild(bd);
		}
		for( var t=0;t<this.value.main.text.length;t++) {
			var d=document.createElement("div");
			d.levels=['main','text',t,'y'];
			d.item=this.schema.texts.y;
			d.dpi=dpi;
			$(d).html(this.value.main.text[t].text).addClass("font-"+this.value.main.text[t].font);
			var styles=this.value.main.text[t].fontstyle.split("");
			for(var l=0;l<styles.length;l++) {
				if (styles[l]!="") $(d).addClass("font-"+styles[l]);
			}
			var fs=this.value.main.text[t].size/dpi;
			var h=this.value.main.text[t].height/dpi;
			var top=this.value.main.text[t].y/dpi;
			var indent=this.value.main.text[t].x/dpi;
			var dw=w-indent;
			$(d).css({
				color:'#'+this.value.main.text[t].colour,
				'font-size':fs.toFixed(1)+"px",
				'line-height':h.toFixed(1)+"px",
				height:h.toFixed(1)+"px",
				'text-align':this.value.main.text[t].align.toLowerCase(),
				top:top.toFixed(1)+"px",
				'padding-left':indent.toFixed(1)+"px",
				width:dw.toFixed(1)+"px"
			});
			this.containers.preview.appendChild(d);
		}
		$(this.containers.preview).find("div").draggable({
			containment:this.containers.preview,
			stop:function(e,ui) {
				var y=parseInt($(this).css("top").replace("px",''))*this.dpi;
				certificate.setValue(this,this.levels,parseFloat(y.toFixed(1)));
				$(certificate.containers.main).find("input.labelledfromtopmm").get(this.levels[this.levels.length-2]).value=y.toFixed(1);
			}
		});
	},
	validate:function() {
		var missing=[];
		$(this.containers.main).find(".requiredChildren").each(function(i,e) {
			var but=$(e).find('>button').get(0);
			var levels=but.levels;
			if (levels!==undefined) {
				if (certificate.levelValue(levels).length==0) {
					var err=but.item.label+' has no items';
					if(levels.length>2) {
						var parnt=certificate.parentValue(levels);
						if (parnt.title!==undefined && parnt.title!="") err+=' in '+parnt.title;
					}
					err+='.';
					missing.push(err);
				}
			}
		});
		$(this.containers.main).find(".requiredValue").each(function(i,e) {
//console.log(e.levels);
			var v=certificate.levelValue(e.levels);
			if (v===undefined || v===null || v=='') {
				var err=e.item.label+' is empty';
				if(e.levels.length>2) {
					var parnt=certificate.parentTitle(e.levels);
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
			return certificate.parentTitle(l);
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
		var level=certificate.value;
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
			}else{
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
			if (/\(\)/.test(defaultValue)) {
				try{
					eval('defaultValue='+item.initial+';');
					if (item.initial=='certificate.uniqueId()') certificate.ids[defaultValue]=true;
				}catch(e){}
			}
			var index=null;
			if (args.length>3) {
				var val=certificate.levelValue(levels,item,defaultValue,args[3]);
				return val;
			}else{
				var val=certificate.levelValue(levels,item,defaultValue,item);
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
					$(but).html("add");
					but.type="button";
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
							certificate.preview();
						};
					}
					$(but).bind("click",function() {
						var index=$(this).nextAll('div').get().length;
						var insertLevels=this.levels.concat([index]);
						certificate.object.render(this.parentNode,insertLevels,certificate.schema[this.item.type],index);
						if (this.update) this.update();
						return true;
					});
					o.appendChild(but);
					if (item.label) className=item.label;
					ab=$(o).find('.affectButton').get();
				}
				for(var i=0;i<val.length;i++) {
					certificate.object.render(o,levels.concat([i]),certificate.schema[item.type],i);
				}
				if (item.elementType!==undefined) {
					if (item.elementType.className!==undefined) className=item.elementType.className;
					if (item.elementType.sortable!==undefined) sortable=item.elementType.sortable;
					if (item.elementType.deleteable!==undefined) deleteable=item.elementType.deleteable;
				}
				if (className!==null || sortable==true) {
					o=certificate.collapsible((ab.length>0)?ab[0].value:className,o,{className:className,sortable:sortable,deleteable:deleteable});
				}else if (deleteable) {
					var but=document.createElement("button");
					but.type="button";
					$(but).html("delete").addClass("delete");
					$(but).bind("click",function() {
						certificate.deleteItem(this);
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
						if (certificate.object[item[k].type]===undefined && typeof(item[k].initial)=="object" && typeof(item[k].initial.length)=="number") {
							var obj=certificate.object.render(o,levels.concat([k]),item[k]);
						}else{
							try{
								var obj=certificate.object[item[k].type](o,levels.concat([k]),item[k]);
							}catch(e) {
								//console.log(certificate.schema[item.type][k].type);
							}
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
						o=certificate.collapsible((ab.length>0)?ab[0].value:className,o,{className:className,sortable:sortable,deleteable:deleteable});
					}else if (deleteable) {
						var but=document.createElement("button");
						but.type="button";
						$(but).html("delete").addClass("delete");
						$(but).bind("click",function() {
							certificate.deleteItem(this);
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
				if (sortable && className!==null) certificate.sortable(target,'>.certificate_sortable','>.collapseButton>.mover',function(e,ui) {certificate.updateOrder(e,ui,className);});
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
			$(o).addClass("formItem");
			var val=this.base(arguments);
			var label=document.createElement("label");
			$(label).html(item.label);
			var description=document.createElement("span");
			$(description).html(item.description).addClass("inputDescription");
			var ip=document.createElement("input");
			ip.type='text';
			ip.value=val;
			ip.item=item;
			ip.levels=levels;
			$(ip).addClass("hasLevels");
			$(ip).addClass("labelled"+item.label.replace(/^a-z/gi,'').toLowerCase());
			if (item.required===true) $(ip).addClass("requiredValue");
			ip.update=function(){};
			if (item.affectButton===true) {
				ip.update=function() {
					var p=certificate.ancester(this,'collapseContent');
					var b=$(p).prev('.collapseButton').find('>nobr');
					var t=this.value.replace(/[^a-z^0-9^ ]+/gi,'');
					b.html(t);
				};
				$(ip).addClass('affectButton');
			}
			$(ip).bind("keyup",function() {
				certificate.setValue(this,this.levels,this.value);
				this.update();
			});
			o.appendChild(label);
			o.appendChild(description);
			o.appendChild(ip);
			target.appendChild(o);
			return o;
		},
		image:function(target,levels,item) {
			var o=document.createElement("div");
			$(o).addClass("formItem");
			o.levels=levels;
			o.item=item;
			var val=this.base(arguments);
			var label=document.createElement("label");
			$(label).html(item.label);
			var description=document.createElement("span");
			$(description).html(item.description).addClass("inputDescription");
			var ip=document.createElement("input");
			ip.type='text';
			ip.disabled=true;
			ip.value=val;
			ip.item=item;
			ip.levels=levels;
			$(ip).addClass("hasLevels");
			if (item.required===true) $(ip).addClass("requiredValue");
			o.update=function(o,img){
				$(o).find("input").val(img.source);
				certificate.setValue(o,o.levels,img.source);
			};
			o.appendChild(label);
			o.appendChild(description);
			o.appendChild(ip);
			var a=document.createElement("a");
			a.href="javascrip:void(0)";
			$(a).html("change").bind("click",function() {
				yoodoo.selectImage(this.parentNode,"Certificates",'Certificates'+certificate.value.main.orientation);
			});
			o.appendChild(a);
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
			$(o).addClass("formItem");
			var val=this.base(arguments);
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
			$(ip).addClass("labelled"+item.label.replace(/[^a-z]+/gi,'').toLowerCase());
			$(ip).bind("keyup",function() {
				certificate.setValue(this,this.levels,this.value);
			});
			o.appendChild(label);
			o.appendChild(description);
			o.appendChild(ip);
			target.appendChild(o);
			return o;
		},
		integer:function(target,levels,item) {
			var o=document.createElement("div");
			$(o).addClass("formItem");
			var val=this.base(arguments);
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
			$(ip).addClass("labelled"+item.label.replace(/[^a-z]+/gi,'').toLowerCase());
			$(ip).bind("blur",function() {
				if (this.notNull && this.value=='') {
					this.value=this.initial;
					certificate.setValue(this,this.levels,1*this.value);
				}
			});
			$(ip).bind("keydown",function(e) {
				var k=certificate.keyCode(e);
				if (!k.numeric && !k.navigate) {
					e.preventDefault();
					return false;
				}
			});
			$(ip).bind("keyup",function() {
				certificate.setValue(this,this.levels,1*this.value);
			});
			o.appendChild(label);
			o.appendChild(description);
			o.appendChild(ip);
			target.appendChild(o);
			return o;
		},
		decimal:function(target,levels,item) {
			var o=document.createElement("div");
			$(o).addClass("formItem");
			var val=this.base(arguments);
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
			$(ip).addClass("labelled"+item.label.replace(/[^a-z]+/gi,'').toLowerCase());
			$(ip).bind("keydown",function(e) {
				var hasPoint=/\./.test(this.value);
				var k=certificate.keyCode(e);
				if (hasPoint && k.numeric) return true;
				if (k.navigate) return true;
				if (!hasPoint && k.decimal) return true;
				e.preventDefault();
				return false;
			});
			$(ip).bind("keyup",function() {
				certificate.setValue(this,this.levels,1*this.value);
			});
			o.appendChild(label);
			o.appendChild(description);
			o.appendChild(ip);
			target.appendChild(o);
			return o;
		},
		select:function(target,levels,item) {
			var o=document.createElement("div");
			$(o).addClass("formItem");
			var val=this.base(arguments);
			var label=document.createElement("label");
			$(label).html(item.label);
			var description=document.createElement("span");
			$(description).html(item.description).addClass("inputDescription");
			var ip=document.createElement("select");
			for(var s=0;s<item.options.length;s++) {
				var opt=document.createElement("option");
				opt.text=opt.value=item.options[s];
				if (val==item.options[s]) opt.selected=true;
				ip.appendChild(opt);
			}
			//ip.value=val;
			ip.levels=levels;
			$(ip).addClass("hasLevels");
			$(ip).bind("change",function() {
				certificate.setValue(this,this.levels,this.value);
			});
			o.appendChild(label);
			o.appendChild(description);
			o.appendChild(ip);
			target.appendChild(o);
			return o;
		},
		boolean:function(target,levels,item) {
			var o=document.createElement("div");
			$(o).addClass("formItem");
			var val=this.base(arguments);
			var label=document.createElement("label");
			$(label).html(item.label);
			var description=document.createElement("span");
			$(description).html(item.description).addClass("inputDescription");
			var ip=document.createElement("input");
			ip.type='checkbox';
			ip.checked=val;
			ip.levels=levels;
			$(ip).addClass("hasLevels");
			$(ip).bind("change",function() {
				certificate.setValue(this,this.levels,this.checked);
			});
			o.appendChild(label);
			o.appendChild(description);
			o.appendChild(ip);
			target.appendChild(o);
			return o;
		},
		colour:function(target,levels,item) {
			var o=document.createElement("div");
			$(o).addClass("formItem");
			var val=this.base(arguments);
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
				certificate.setValue(this,this.levels,this.value);
			});
			o.appendChild(label);
			o.appendChild(description);
			o.appendChild(ip);
			target.appendChild(o);
			$(ip).jPicker({images:{clientPath:'/js/jpicker/images/'},window:{liveUpdate:true}},function(colour,context) {
				certificate.setValue(this,this.levels,this.value);
			});
			return o;
		},
		shuffle:function(target,levels,item) {
			var o=document.createElement("div");
			$(o).addClass("formItem");
			if (item.className) $(o).addClass(item.className);
			var val=this.base(arguments);
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
				this.selector.val=certificate.levelValue(this.selector.levels);
				this.draw();
			};
			o.draw=function() {
				while(this.selector.childNodes.length>0) this.selector.removeChild(this.selector.childNodes[0]);
				var page=certificate.levelValue([this.selector.levels[0],this.selector.levels[1],this.selector.levels[2]]);
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
				certificate.setValue(this,this.levels,this.val);
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
			$(o).addClass("formItem");
			if (item.className) $(o).addClass(item.className);
			var val=this.base(arguments);
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
				this.selector.val=certificate.levelValue(this.selector.levels);
				this.draw();
			};
			o.draw=function() {
				while(this.selector.childNodes.length>0) this.selector.removeChild(this.selector.childNodes[0]);
				var levels=[];
				for(var i=0;i<this.selector.levels.length-1;i++) levels.push(this.selector.levels[i]);
				var multichoice=certificate.levelValue(levels);
				var l=(multichoice.options==undefined)?0:multichoice.options.length;
				if (this.selector.val>l && l>0) {
					this.selector.val=l;
					certificate.setValue(this.selector,this.selector.levels,this.selector.val);
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
				certificate.setValue(this,this.levels,this.val);
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
			$(o).addClass("formItem");
			$(o).addClass("formItemUpdate");
			var val=this.base(arguments);
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
			button.type="button";
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
					for(var k in certificate.schema.questions[type]) {
						if (certificate.object[certificate.schema.questions[type][k].type]!==undefined) {
							var o=certificate.object[certificate.schema.questions[type][k].type](oo,this.levels.concat([index,k]),certificate.schema.questions[type][k]);
						}else{
							var o=certificate.object.render(oo,this.levels.concat([index,k]),certificate.schema.questions[type][k]);
						}
					}
					var ab=$(oo).find('.affectButton').get();
					oo=certificate.collapsible((ab.length>0)?ab[0].value:'Question',oo,{className:'question '+type+'Type',sortable:true,deleteable:true});
					if (certificate.schema.questions[type].type.update!==undefined) {
						oo.updateClass=certificate.schema.questions[type].type.update;
						oo.update=function() {
							$(this).find('.'+this.updateClass).each(function(i,e) {
								if (e.update!==undefined) e.update();
							});
						};
					}
					$(oo).css({display:"none"});
					this.parentNode.appendChild(oo);
					$(oo).slideDown();
					var fi=certificate.ancester(this,'formItemUpdate');
					fi.update();
				}
			});

			var sel=certificate.questionTypeSelector();
			o.appendChild(label);
			o.appendChild(sel);
			o.appendChild(button);
			for(var q=0;q<val.length;q++) {
				var oo=document.createElement("div");
				$(oo).addClass("indexed");
				oo.levels=levels.concat([q]);
				$(oo).addClass("hasLevels");
				var sch=certificate.schema.questions[val[q].type.replace(/ /g,'')];
				for(var k in sch) {
					if (certificate.object[sch[k].type]!==undefined) {
						var ob=certificate.object[sch[k].type](oo,levels.concat([q,k]),sch[k]);
					}else{
						var ob=certificate.object.render(oo,levels.concat([q,k]),sch[k]);
					}
				}
				var ab=$(oo).find('.affectButton').get();
				oo=certificate.collapsible((ab.length>0)?ab[0].value:'Question',oo,{className:'question '+val[q].type.replace(/ /g,'')+'Type',sortable:true,deleteable:true});
				if (sch.type && sch.type.update) {
					$(oo).addClass("callOnDelete");
					oo.updateClass=sch.type.update;
					oo.update=function() {
						$(this).find('.'+this.updateClass).each(function(i,e) {
							if (e.update) e.update();
						});
					};
				};
				o.appendChild(oo);
			}
			o.levels=levels;
			$(o).addClass("hasLevels");
			target.appendChild(o);
			certificate.sortable(o,'.question','>.collapseButton .mover',function(e,ui) {certificate.updateOrder(e,ui,'question');});
			return o;
		}
	},
	deleteItem:function(o) {
		var item=certificate.ancester(o,'hasLevels');
		var removeItem=item;
		if ($(item.parentNode).hasClass("collapseContent")) removeItem=item.parentNode.parentNode;
		var callOnDelete=certificate.ancester(removeItem.parentNode,'callOnDelete');
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
			//var list=certificate.value;
//console.log(indexes);
			//for(var ii=0;ii<indexes.length;ii++) {
//console.log(list);
			//	list=list[indexes[ii]];
			//}
			//eval('list=certificate.value['+indexes.join('][')+'];');
			var cmd='certificate.value['+indexes.join('][')+'].splice('+i+',1);';
			eval(cmd);
//console.log(cmd);
//console.log(list);
			//list.splice(i,1);
			$(item).find('button').unbind("click");
			var fi=certificate.ancester(item,'formItem');
			if (fi.update) fi.update();
			if ($(removeItem).hasClass("hasLevels")) {
				certificate.updateLevelIndex($(removeItem).siblings('.hasLevels').get());
			}else{
				certificate.updateLevelIndex($(removeItem).siblings().find('>div>div.hasLevels').get());
			}
			$(removeItem).slideUp(500,function() {
				var parent=this.parentNode;
				$(this).remove();
				if ($(callOnDelete).hasClass('callOnDelete')) {
					callOnDelete.update();
				}else{
				}
			});
		}catch(e){}
	},
	updateLevelIndex:function(items) {
		for(var i=0;i<items.length;i++) {
//console.log(items[i]);
			if ($(items[i]).hasClass("hasLevels")) {
				var ii=items[i].levels.length-1;
//console.log("Change index "+ii);
				if (items[i].levels[ii]!=i) {
					items[i].levels[ii]=i;
					$(items[i]).find(".hasLevels").each(function(j,e) {
						e.levels[ii]=i;
//console.log("Change index "+ii+" to "+i);
					});
				}
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
			eval('list=certificate.value['+indexes.join('][')+'];');
			for(var i=0;i<list.length;i++) {
				if (list[i].id==id) oldIndex=i;
			}
			var page=list.splice(oldIndex,1);
			list.splice(newIndex,0,page[0]);
		}catch(e){}
		certificate.rebuildOrderIndexes(item);
	},
	rebuildOrderIndexes:function(item) {
//console.log(item);
		var os=$(item).parent().find('>.certificate_sortable>.collapseContent>.hasLevels.indexed').get();
//console.log(os);
		certificate.updateLevelIndex(os);
		/*$(item).parent().find('>.certificate_sortable>.collapseContent>.hasLevels.indexed').each(function(i,o) {
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
	uniqueId:function() {
		var id=this.randomString();
		while(certificate.idExists(id)) id=this.randomString();
		return id;
	},
	idExists:function(id) {
		return (typeof(certificate.ids[id])!="undefined");
	},
	randomString:function() {
		var length=20;
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
	setValue:function(src,levels,value) {
		var stack=[];
		if (!isNaN(levels[levels.length-1])) levels[levels.length-1]=$(certificate.ancester(src,'indexed')).prevAll('.indexed').get().length;
		for(var l=0;l<levels.length;l++) {
			if (isNaN(levels[l])) {
				stack.push("'"+levels[l]+"'");
			}else{
				stack.push(levels[l]);
			}
		}
		try{
			eval('certificate.value['+stack.join('][')+']=value;');
		}catch(e){}
		if (arguments.length>3 && arguments[3]===true) {
		}else{
			certificate.preview();
		}
	},
	ancester:function(o,c) {
		if ($(o).hasClass(c)) return o;
		if (o==document.body) return false;
		if (!o.parentNode) return false;
		return certificate.ancester(o.parentNode,c);
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
			but.type="button";
			$(but).html("delete").addClass("delete");
			$(but).bind("click",function() {
				certificate.deleteItem(this);
			});
			content.insertBefore(but,content.childNodes[0]);
		}
		c.appendChild(content);
		o.appendChild(t);
		o.appendChild(c);
		if (className!==null) $(o).addClass(className);
		if (props['sortable']===true) $(o).addClass('certificate_sortable');
		return o;
	},
	sortable:function(container,items,handles,update) {
		$(container).sortable("destroy");
		$(container).sortable({items:items,handle:handles,update:update});
	},
	save:function(e) {
		var err=certificate.validate();
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
