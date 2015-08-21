
if (typeof(dooit)!="undefined") dooit.temporaries('inputs');
inputs={
	shortlist:function(objs,res) {
		objs=$(objs).get();
		for(var oo=0;oo<objs.length;oo++) {
			var listContainer=document.createElement("div");
			$(listContainer).addClass('eezshortlist');
			objs[oo].reposition=function() {
				var pos=$(this).offset();
				var pad=[0,0,0,0];
				this.listContainer.style.top=(pos.top+this.clientHeight+pad[2]+this.opt.offsetY)+"px";
				this.listContainer.style.left=(pos.left+this.opt.offsetX)+"px";
			};
			listContainer.owner=objs[oo];
			var opts={
				width:objs[oo].clientWidth,
				offsetX:0,
				offsetY:0,
				height:null,
				autocomplete:true,
				callback:null,
				rows:20};
			if (arguments.length>1) {
				for(var k in arguments[2]) {
					opts[k]=arguments[2][k];
				}
			}
			$(listContainer).css('width',opts.width+"px");
			objs[oo].listing=res;
			objs[oo].textvalue='';
			objs[oo].opt=opts;
			objs[oo].index=0;
			objs[oo].listContainer=listContainer;
			objs[oo].reposition();
			$(objs[oo]).bind("keydown",function(e) {
				var key=e.which;
				if (key==27) this.blur();
				if (key==38 || key==40) e.preventDefault();
			});
			$(objs[oo]).bind("keyup",function(e) {
				this.process(e);
				var o=this;
				if (typeof(o.items)!="undefined" && o.items.length>0) {
					if (o.items && o.index>=0 && o.index<o.items.length) $(o.items[o.index]).removeClass('over');
					var key=e.which;
					o.index+=((key==38)?-1:(key==40)?1:0);
					if (o.index<0) o.index=0;
					if (o.index>=o.items.length) o.index=o.items.length-1;
					if (o.items.length>0) $(o.items[o.index]).addClass('over');
					if (key==13) o.selects(o.opt.autocomplete?o.index:-1);
				}else if(!o.opt.autocomplete) {
					if (e.which==13) o.selects(-1);
				}
				if(key==38 || key==40 || key==13) e.preventDefault();
			});
			/*$(objs[oo]).bind('blur',function(e) {
				var o=this;
				$(o.listContainer).css("display","none");
				if (o.opt.autocomplete && o.shortlist && o.index>=0 && o.index<o.shortlist.length && o.shortlist.length>0) o.value=o.listing[o.shortlist[o.index][1]];
			});*/
			objs[oo].process=function(e) {
				this.reposition();
				$(this.listContainer).css("display","block");
				this.shortlist=[];
				var tp=this.value.replace(/[^a-z^0-9^ ]+/gi,'');
				for(var i=0;i<this.listing.length;i++) {
					var s=inputs.score(tp,this.listing[i]);
					if (s>0) this.shortlist.push([s,i]);
				}
				this.shortlist.sort(inputs.byFirstIndex).reverse();
				var l='<ul>';
				var rg=[];
				tp=tp.split(" ");
				for(i=0;i<tp.length;i++) tp[i]=tp[i].replace(/[^a-z^0-9]+/gi,'');
				for(i=0;i<tp.length;i++) rg.push(new RegExp(tp[i],'i'));
				if (this.shortlist.length>0) {
					i=0;
					while(i<this.shortlist.length && i<this.opt.rows) {
						var t=this.listing[this.shortlist[i][1]];
						for(var r=0;r<rg.length;r++) {
							t=t.replace(rg[r],function(m){ return '<b>'+m+'</b>';});
						}
						l+='<li i="'+i+'">'+t+"</li>";
						i++;
					}
					l+="</ul>";
					this.listContainer.innerHTML=l;
					this.items=$(this.listContainer).find('li');
					$(this.listContainer).find('li:even').addClass("even");
					$(this.listContainer).find('li:odd').addClass("odd");
					for(var ti=0;ti<this.items.length;ti++) {
						this.items[ti].input=this;
					}
					document.body.ip=this;
					$(window).bind("mousedown",function(e) {
						if(!$(e.target).hasClass("eezshortlist")) {
							var o=document.body.ip;
							if (o.opt.autocomplete && o.shortlist && o.index>=0 && o.index<o.shortlist.length && o.shortlist.length>0) o.value=o.listing[o.shortlist[o.index][1]];
							$(document.body.ip.listContainer).css("display","none");
							$(window).unbind("mousedown");
							document.body.ip=null;
						}
					});
					$(this.listContainer).find('li').bind('mouseover',function(e) {
						var o=this;
						var con=o.parentNode.parentNode.owner;
						if (con.index<con.items.length && con.index>=0) $(con.items[con.index]).removeClass('over');
						con.index=1*o.getAttribute("i");
						$(con.items[con.index]).addClass('over');
					});
					$(this.listContainer).find('li').bind('mousedown',function(e) {
						var o=this;
						var con=o.input;
						con.index=1*o.getAttribute("i");
						con.selects(con.index);
					});
					$(this.listContainer).css("display","block");
					document.body.appendChild(this.listContainer);
				}else{
					$(this.listContainer).css("display","none");
				}
			};
			objs[oo].selects=function(idx) {
				$(window).unbind("mousedown");
				document.body.ip=null;
				if (idx<0) {
					if (this.opt.callback) this.opt.callback(this.value);
					$(this.listContainer).css("display","none");
				}else{
					if (idx>=0 && idx<this.shortlist.length) {
						this.value=this.listing[this.shortlist[idx][1]];
						if (this.opt.callback) this.opt.callback(this.value);
						$(this.listContainer).css("display","none");
					}
				}
			};
		}
	},
	dropdown:function(objs) {
		if (typeof(objs)=="string") objs=$(objs).get();
		for(var oo=0;oo<objs.length;oo++) {
			var opts={prompt:'Choose...',width:objs[oo].clientWidth,layout:inputs.layout.none,dropdownX:1,dropdownY:0,widthExtension:-8,autofit:false,onSelect:function() {}};
			if (arguments.length>1) {
				for(var k in arguments[1]) {
					opts[k]=arguments[1][k];
				}
			}
			//var blockout=inputs.blockout();
			//$(blockout).css("display","none");
			//var listContainer=inputs.createElement("div",null,"dropdown",null);
			//blockout.source=listContainer;
			var selectBox=inputs.createElement("a",null,"select",null);
			selectBox.href='javascript:void(0)';
			//blockout.selectBox=selectBox;
			//document.body.appendChild(blockout);
			//document.body.appendChild(listContainer);
			var idx=objs[oo].selectedIndex;
			if(objs[oo].options[idx].text=='inputremoveoption') idx=-1;
			//if (idx<0) idx=0;
			var optionlist=$(objs[oo]).find("option").get();
			//console.log(idx+","+((idx<0)?opts.prompt:optionlist[idx].text));
			var layoutBox=inputs.createHTML(opts.layout("<span>"+((idx<0)?opts.prompt:optionlist[idx].text)+"</span>"))[0];
			for(var oi=optionlist.length-1;oi>=0;oi--) {
				if (optionlist[oi].text=='inputremoveoption') {
					optionlist.splice(oi,1);
					if (idx>oi) idx--;
				}
			}
			selectBox.appendChild(layoutBox);
			selectBox=objs[oo].parentNode.insertBefore(selectBox,objs[oo]);
			/*if (opts.autofit) {
				var marg=inputs.margins(objs[oo]);
				$(selectBox).css("margin",marg[0]+"px "+marg[1]+"px "+marg[2]+"px "+marg[3]+"px");
				var pad=inputs.paddings(objs[oo]);
				$(layoutBox).find('.c').css("padding",pad[0]+"px "+pad[1]+"px "+pad[2]+"px "+pad[3]+"px");
				$(layoutBox).css("width",(objs[oo].clientWidth)+"px");
				$(layoutBox).find('.c').css("height",(objs[oo].clientHeight)+"px");
				$(layoutBox).css("verticalAlign","bottom");
				$(layoutBox).find('span').css("lineHeight",(objs[oo].clientHeight)+"px");
			}*/
			selectBox.reposition=function() {
				var pos=$(this).offset();
				var pad=inputs.paddings(this);
				this.listContainer=document.createElement("div");
				this.listContainer.source=this;
				$(this.listContainer).addClass("dropdown");
				this.listContainer.block=inputs.blockout();
				this.listContainer.block.source=this.listContainer;
				this.process();
				$(this.listContainer.block).bind("click",function() {
					$(this.source).fadeOut("fast",function() {
						$(this.block).remove();
						this.source.listContainer=null;
						$(this).remove();
					});
				});
				document.body.appendChild(this.listContainer.block);
				document.body.appendChild(this.listContainer);
				$(this.listContainer).css('top',(parseInt(pos.top)+this.clientHeight+parseInt(pad[2])+this.opt.dropdownY)+"px");
				$(this.listContainer).css('left',(parseInt(pos.left)+this.opt.dropdownX)+"px");
			};
			//listContainer.owner=objs[oo];
			selectBox.selector=objs[oo];
			//selectBox.listing=$(objs[oo]).find("option").get();
			selectBox.listing=optionlist;
			selectBox.textvalue='';
			//selectBox.blockout=blockout;
			//objs[oo].blockout=blockout;
			//objs[oo].dropdown=listContainer;
			//selectBox.dropdownWidth=parseInt(layoutBox.offsetWidth)+parseInt(opts.widthExtension);
			//selectBox.dropdownWidth=objs[oo].clientWidth+opts.widthExtension;
			selectBox.opt=opts;
			selectBox.index=0;
			//selectBox.listContainer=listContainer;
			//$(listContainer).css("width",selectBox.dropdownWidth+"px");


			//if (opts.autofit) {
				/*var marg=inputs.margins(objs[oo]);
				$(selectBox).css("margin",marg[0]+"px "+marg[1]+"px "+marg[2]+"px "+marg[3]+"px");
				var pad=inputs.paddings(objs[oo]);
				$(layoutBox).find('.c').css("padding",pad[0]+"px "+pad[1]+"px "+pad[2]+"px "+pad[3]+"px");
				$(layoutBox).css("width",(objs[oo].clientWidth)+"px");
				$(layoutBox).find('.c').css("height",(objs[oo].clientHeight)+"px");
				$(layoutBox).css("verticalAlign","bottom");
				$(layoutBox).find('span').css("lineHeight",(objs[oo].clientHeight)+"px");*/
			//}


			/*$(selectBox.blockout).bind("click",function() {
				$(this.source).fadeOut('fast');
				$(this).css("display","none");
			});*/
			$(selectBox).bind("mousedown",function() {
				this.open();
			});

			selectBox.open=function() {
				var selectBox=this;
				selectBox.reposition();
				$(selectBox.listContainer).fadeIn('fast',function(){$(this.block).css("display","block");});
				if ($(this.listContainer).find('ul').height()>$(this.listContainer).height()) {
					$(this.listContainer).css("width",($(this.listContainer).width()+22)+"px");
				}else{
					$(this.listContainer).css("width","auto");
				}
				document.body.source=selectBox;
				$(document.body).bind('keydown',function(e) {
					if (document.body.source.index>=0 && document.body.source.index<document.body.source.items.length) $(document.body.source.items[document.body.source.index]).removeClass('over');
					var key=e.which;
					document.body.source.index+=((key==38)?-1:(key==40)?1:0);
					if (document.body.source.index<0) document.body.source.index=0;
					if (document.body.source.index>=document.body.source.items.length) document.body.source.index=document.body.source.items.length-1;
					if (document.body.source.items.length>0) $(document.body.source.items[document.body.source.index]).addClass('over');
					if (key==13) {
						document.body.source.select(document.body.source.index);
					}else{
						var scr=$(document.body.source.listContainer).find('ul').get();
						if (scr.length>0) {
							scr=scr[0];
							var st=scr.scrollTop;
							var t=$(document.body.source.items[document.body.source.index]).position().top;
							if (t-st<0) {
								scr.scrollTop=t;
							}else if (t-st+document.body.source.items[document.body.source.index].clientHeight>document.body.source.listContainer.clientHeight) {
								scr.scrollTop=t-document.body.source.listContainer.clientHeight+document.body.source.items[document.body.source.index].clientHeight;
							}
						}
					}
					if (key==38 || key==40 || key==13) e.preventDefault();
				});
			};
			selectBox.process=function() {
				var l='<ul';
//console.log(this.opt);
				//if (this.opt.autofit) l+=' style="width:'+this.dropdownWidth+'px"';
				l+='>';
				if (this.listing.length>0) {
					var inGroup=false;
					var groupLabel='';
					for(var i=0;i<this.listing.length;i++) {
						if (this.listing[i].parentNode.tagName=="OPTGROUP") {
							if (!inGroup) l+="</div>";
							inGroup=true;
							if (groupLabel!=this.listing[i].parentNode.label) {
								groupLabel=this.listing[i].parentNode.label;
								l+="<span class='optgroup'>"+groupLabel+"</span><div>";
							}
						}else{
							if (inGroup) l+="</div>";
							inGroup=false;
						}
						l+='<li i="'+i+'" value="'+this.listing[i].value+'" >'+this.listing[i].text+"</li>";
					}
					if (inGroup) l+="</div>";
					l+="</ul>";
					this.listContainer.innerHTML=l;
					this.items=$(this.listContainer).find('li').get();
					for(i=0;i<this.items.length;i++) this.items[i].source=this;
					$(this.listContainer).find('li:even').addClass("even");
					$(this.listContainer).find('li:odd').addClass("odd");
					for(var i=0;i<this.items.length;i++) {
						var thisObject=this.items[i];
						$(thisObject).bind("mouseover",function() {
							if (this.source.index<this.source.items.length && this.source.index>=0) $(this.source.items[this.source.index]).removeClass('over');
							this.source.index=1*this.getAttribute("i");
							$(this.source.items[this.source.index]).addClass('over');
						});
						$(thisObject).bind("mousedown",function() {
							this.source.index=1*this.getAttribute("i");
							this.source.select(this.source.index);
						});
					}
				}
			};
			selectBox.select=function(idx) {
				$(this).find('span').html(this.listing[idx].innerHTML);
				this.selector.selectedIndex=idx;
				$(this.listContainer).remove();
				$(this.listContainer.block).remove();
				$(document.body).unbind('keyup');
				$(document.body).unbind('keydown');
				document.body.source=null;
				this.opt.onSelect(this.selector);
			};
			$(objs[oo]).css("display","none");
			//selectBox.process();
			//selectBox.reposition();
			//$(listContainer).css("display","block");
			//selectBox.dropdownWidth=$(listContainer).width();
//console.log(listContainer);
			selectBox.dropdownWidth=0;
			selectBox.dropdownWidth=$(selectBox).find("span").width();
			var txt=$(selectBox).find("span").html();
			for(var i=0;i<selectBox.listing.length;i++) {
				$(selectBox).find("span").html(selectBox.listing[i].text);
				var w=$(selectBox).find("span").width();
				if (selectBox.dropdownWidth<w) selectBox.dropdownWidth=w;
			}
			$(selectBox).find("span").html(txt);
			//var pads=inputs.paddings(selectBox);
//console.log(selectBox.dropdownWidth,(parseInt(pads[1])+parseInt(pads[3])));
			//selectBox.dropdownWidth-=(parseInt(pads[1])+parseInt(pads[3]));
			$(selectBox).css("width",selectBox.dropdownWidth+"px");
			//$(listContainer).css("display","none");
			//$(layoutBox.parentNode).css("width",(selectBox.dropdownWidth)+"px");
			//$(listContainer).css("width",(selectBox.dropdownWidth+selectBox.opt.widthExtension)+"px");
//console.log(selectBox.opt);
		}
	},
	radio:function() {
		this.radioCheckbox(arguments);
	},
	checkbox:function() {
		this.radioCheckbox(arguments);
	},
	radioCheckbox:function(objs) {
		if (typeof(objs)=="string") objs=$(objs).get();
		var opts={labels:[""],oncheck:function() {},onuncheck:function(){},onlySelect:false};
		if (arguments.length>1) {
			for(var k in arguments[1]) {
				opts[k]=arguments[1][k];
			}
		}
		var i=0;
		var labels=$("label").get();
		var groupNames=[];
		var groups=[];
		for(var oo=0;oo<objs.length;oo++) {
			objs[oo].radio=(objs[oo].getAttribute("type")=="radio");
			objs[oo].checkbox=(objs[oo].getAttribute("type")=="checkbox");
			
			//if (opts.autoSelection) radioNotCheckbox=(objs[oo].getAttribute("type")=="radio") ;
			i++;
			if (i>=opts.labels.length) i=0;
			var thisLabel=null;
			var lblIsParent=false;
			var lbl=opts.labels[i];
			var nomatr=objs[oo].getAttribute("name");
			if (!groups[nomatr]) {
				groupNames.push(nomatr);
				groups[nomatr]=[objs[oo]];
			}else{
				groups[nomatr].push(objs[oo]);
			}
			var nom=nomatr;
			if (objs[oo].parentNode.tagName=="LABEL") {
				lblIsParent=true;
				nom=objs[oo].parentNode.innerHTML;
				thisLabel=objs[oo].parentNode;
			}else{
				if (nom!="") {
					for(var l=0;l<labels.length;l++) {
						if (labels[l].getAttribute("for")==nomatr) {
							thisLabel=labels[l];
							nom=labels[l].innerHTML;
						}
					}
				}
			}
			nom=(nom)?nom.replace(/<[^>]*>/g,''):"";
			if (lbl=="null") {
				nom='';
			}else{
				nom=(nom=="")?lbl:nom;
			}
			var but=document.createElement("BUTTON");
			$(but).attr("type","button");
			$(but).addClass((objs[oo].radio?"radio":(objs[oo].checkbox?"checkbox":"")));
			$(but).addClass(objs[oo].tagName);
			if (objs[oo].disabled) $(but).addClass("disabled");
			$(but).html("<div></div>"+nom);
			//var but=eez.createHTML("<button type='button' class='"+(objs[oo].radio?"radio":(objs[oo].checkbox?"checkbox":""))+" "+objs[oo].tagName+" "+(objs[oo].disabled?"disabled":"")+"'><div></div>"+nom+"</button>")[0];
			but.source=objs[oo];
			but.opts=opts;
			objs[oo].control=but;
			if (lblIsParent) {
				thisLabel.parentNode.insertBefore(but,thisLabel);
			}else{
				objs[oo].parentNode.insertBefore(but,objs[oo]);
			}
			if (lblIsParent) {
				$(thisLabel).css("display","none");
				//css.style(thisLabel,"display","none");
			}else{
				$(objs[oo]).css("display","none");
				//css.style(objs[oo],"display","none");
				if (thisLabel) $(thisLabel).css("display","none");
			}
			if (!objs[oo].disabled) {
				if (objs[oo].checked) {
					$(but).addClass("on");
					$(but).removeClass("off");
				}else{
					$(but).addClass("off");
					$(but).removeClass("on");
				}
			}
			$(but).bind("click",function() {this.change();});
			//events.add(but,"click",function(e,o) {o.change();});
			but.others=[];
			but.change=function() {
				if(!this.source.disabled) {
					if ((this.opts.onlySelect && !this.source.checked) || !this.opts.onlySelect) {
						this.source.checked=!this.source.checked;
						if (this.source.checked) {
							$(this).addClass("on");
							$(this).removeClass("off");
							//css.add(this,"on");
							//css.remove(this,"off");
							if (this.others.length>0) {
								for(var o=0;o<this.others.length;o++) {
									$(this.others[o]).removeClass("on");
									//css.remove(this.others[o],"on");
									if (!this.others[o].source.disabled) $(this.others[o]).addClass("off");
									//css.add(this.others[o],"off");
								}
							}
							this.opts.oncheck(this.source);
						}else{
							$(this).addClass("off");
							//css.add(this,"off");
							$(this).removeClass("on");
							//css.remove(this,"on");
							this.opts.onuncheck(this.source);
						}
					}
				}
			};
		}
		for(oo=0;oo<groupNames.length;oo++) {
			if (groups[groupNames[oo]].length>1) {
				for(var i=0;i<groups[groupNames[oo]].length;i++) {
					for(var ii=0;ii<groups[groupNames[oo]].length;ii++) {
						if (groups[groupNames[oo]][i].radio) {
							if (groups[groupNames[oo]][i]!=groups[groupNames[oo]][ii]) groups[groupNames[oo]][i].control.others.push(groups[groupNames[oo]][ii].control);
						}
					}
				}
			}
		}
	},
	dateScrollingObject:null,
	date:function(objs) {
		if (typeof(objs)=="string") objs=$(objs).get();
		var opt={labels:["label"]};
		if (arguments.length>1) {
			for(var k in arguments[1]) {
				opt[k]=arguments[1][k];
			}
		}
		for(var oo=0;oo<objs.length;oo++) {
			var opts={showUnselectable:false,
						slide:false,
						showOther:true,
						minDate:null,
						maxDate:null,
						past:true,
						align:'left',
						formatdisplay:'d/m/Y',
						formatoutput:'d/m/Y',
						formatinput:'d/m/Y',
						daynamelength:3,
						animateIn:['fadeIn',{}],
						animateOut:['fadeOut',{}],
						layout:inputs.layout.oneCell,
						formatmonth:'F Y',
						cellspacing:2,
						cellpadding:2,
						leftText:'',
						rightText:'',
						offset:[0,1],
						selected:function(){}
					};
			
			for(var k in opt) {
				opts[k]=opt[k];
			}
			var dt=this.stringToDate(opts.formatinput,objs[oo].value);
			objs[oo].opts=opts;
			objs[oo].date=this.stringToDate(opts.formatinput,objs[oo].value);
			if(objs[oo].value!='') objs[oo].value=this.formatDate(opts.formatdisplay,objs[oo].date);
			objs[oo].displaying=null;
			$(objs[oo]).bind("focus click",function() {
				var o=this;
				if (o.displaying===null) {
					o.blockout=inputs.blockout();
document.body.appendChild(o.blockout);
					$(o.blockout).css("display",'block');
					o.displaying=document.createElement("DIV");
document.body.appendChild(o.displaying);
					$(o.displaying).addClass("dateselector");
					$(o.displaying).css("display","none");
					o.displaying.innerHTML=(o.opts.layout!==null)?o.opts.layout('<div></div>'):'<div class="c"><div></div></div>';
					o.blockout.source=o;
					o.displaying.source=o;
					o.displaying.day=o.date.getDate();
					o.displaying.month=o.date.getMonth();
					o.displaying.year=o.date.getFullYear();
					o.displaying.date=new Date(o.displaying.year,o.displaying.month,o.displaying.day);
					$(o.displaying).find('.c>div').html("<table cellspacing=0 cellpadding=0><tr><td style='vertical-align:top'><div class='monthCell'></div></td><td style='vertical-align:top'><div class='monthCell'><div class='head'></div>"+monthTable(o.displaying.date,o.opts)+"</div></td><td style='vertical-align:top'><div class='monthCell'></div></td></tr></table>");
					o.displaying.drawHead=function() {
						var dest=null;
						if (arguments.length>0) {
							dest=arguments[0];
						}else{
							dest=$(this).find('div.head').get(0);
						}
						while(dest.children.length>0) dest.removeChild(dest.children[0]);
						var conts=[];
						var tmp=document.createElement("DIV");
						$(tmp).addClass("monthTitle");
						$(tmp).html(inputs.formatDate(this.source.opts.formatmonth,this.date));
						conts.push(tmp);
						if (this.source.opts.past || (!this.source.opts.past && !(new Date(this.date.getFullYear(),this.date.getMonth(),-1)<new Date()))) {
							if ((this.source.opts.minDate===null) || (new Date(this.date.year,this.date.month,-1)>=this.source.opts.minDate)) {
								var el=document.createElement("BUTTON");
								$(el).addClass("left");
								$(el).html(this.source.opts.leftText);
								el.source=this;
								$(el).bind("click",function(e) {
									// go back a month
									e.preventDefault();
									var o=this;
									o.source.date=new Date(o.source.date.getFullYear(),o.source.date.getMonth()-1,o.source.date.getDate());
									var tarTD=null;
									if (o.source.source.opts.slide) {
										tarTD=$(o.source).find('.c .monthCell').get(0);
									}else{
										tarTD=$(o.source).find('.c .monthCell').get(1);
									}
									tarTD.innerHTML="<div class='head'></div>"+monthTable(o.source.date,o.source.source.opts);
									o.source.drawHead($(tarTD).find('.head').get(0));
									if (o.source.source.opts.slide) {
										o.source.slide("left",function() {o.cellEvents();});
									}else{
										o.source.cellEvents();
									}
								});
								conts.push(el);
							}
						}
						if ((this.source.opts.maxDate===null) || (new Date(this.year,this.month,-1)<=this.source.opts.maxDate)) {
							var el=document.createElement("BUTTON");
							$(el).addClass("right");
							$(el).html(this.source.opts.rightText);
							el.source=this;
							$(el).bind("click",function(e) {
								// go forward a month
								var o=this;
								e.preventDefault();
								o.source.date=new Date(o.source.date.getFullYear(),o.source.date.getMonth()+1,o.source.date.getDate());
								
								var tarTD=null;
								if (o.source.source.opts.slide) {
									tarTD=$(o.source).find('.c .monthCell').get(2);
								}else{
									tarTD=$(o.source).find('.c .monthCell').get(1);
								}
								tarTD.innerHTML="<div class='head'></div>"+monthTable(o.source.date,o.source.source.opts);
								o.source.drawHead($(tarTD).find('.head').get(0));
								if (o.source.source.opts.slide) {
									o.source.slide("right",function(e,oo) {this.cellEvents();});
								}else{
									o.source.cellEvents();
								}
							});
							conts.push(el);
						}
						for(var i=conts.length-1;i>=0;i--) {
							conts[i].source=this;
							dest.appendChild(conts[i]);
						}
					};
					o.displaying.drawHead();
					o.displaying.cellEvents=function() {
						var o=this;
						var cells=$(o).find('td.selectable').get();
						for(var c=0;c<cells.length;c++) {
							cells[c].source=o;
							$(cells[c]).bind("click",function() {
								var o=this;
								var d=o.innerHTML*1;
								var m=o.source.date.getMonth();
								var y=o.source.date.getFullYear();
								if ($(o).hasClass("notMonth")) {
									if (d>15) {
										m--;
									}else{
										m++;
									}
								}
								o.source.source.update(new Date(y,m,d));
							});
						}
					};
					o.displaying.slide=function(dir,complete) {
						var midCell=$(this).find('.c .monthCell:even').get(0);
						var c=$(this).find('.c>div').get(0);
						var w=midCell.clientWidth;
						var h=midCell.clientHeight;
						$(c).css("width",w+"px");
						$(c).css("height",h+"px");
						$(c).addClass("slide");
						if (dir=="left") c.scrollLeft=midCell.clientWidth;
						c.dir=dir;
						c.scrollX=c.scrollLeft;
						c.scrollVelocity=1;
						c.scrollAcceleration=0.25;
						c.scrollProportion=4;
						c.maxScroll=10;
						c.source=this;
						this.scrollComplete=complete;
						c.scrolling=function() {
							var ds=(((this.dir=="left")?0:$(this).find('.monthCell:even').get(0).clientWidth)-this.scrollX);
							if (ds>=-1 && ds<=1) {
								var m=$(this).find('.monthCell:even').get(0);
								
								this.scrollLeft=((this.dir=="left")?0:m.clientWidth);
								var o=$(this).find('.monthCell').get((this.dir=='left')?0:2);
								m.innerHTML='';
								while(o.childNodes.length>0) m.appendChild(o.childNodes[0]);
								this.source.scrollComplete();
								$(this).slideUp();
							}else{
								this.scrollVelocity+=(this.dir=='left')?-this.scrollAcceleration:this.scrollAcceleration;
								if ((this.dir=='right' && this.scrollVelocity>(ds/this.scrollProportion)) || (this.dir=='left' && this.scrollVelocity<(ds/this.scrollProportion))) this.scrollVelocity=(ds/this.scrollProportion);
								if (this.scrollVelocity>this.maxScroll) this.scrollVelocity=this.maxScroll;
								this.scrollX+=this.scrollVelocity;
								this.scrollLeft=this.scrollX;
								inputs.dateScrollingObject=this;
								this.timer=setTimeout("inputs.dateScrollingObject.scrolling();",20);
							}
						};
						c.scrolling(dir);
					};
					o.displaying.cellEvents();
					o.position();
					$(this.blockout).bind("click",function(e) {
						var o=this;
						$(o.source.displaying).remove();
						$(o).remove();
						o.source.displaying=null;
						o.blockout=null;
					});
					if (o.opts.animateIn) {
						eval('$(o.displaying).'+o.opts.animateIn[0]+'(o.opts.animateIn[1]);');
					}else{
						$(o.displaying).css("display","block");
					}
				}else{
					$(o.displaying).css("display","block");
				}
			});
			objs[oo].update=function(dt) {
				this.date=dt;
				this.value=inputs.formatDate(this.opts.formatdisplay,this.date);
				if (this.opts.animateOut) {
					var o={};
					for(var k in this.opts.animateOut[1]) o[k]=this.opts.animateOut[1][k];
					this.displaying.comp=function() {
						var src=this;
						$(src.source.blockout).remove();
						src.source.blockout=null;
						src.source.displaying=null;
						$(src).remove();
					};
					var me=this;
					eval('$(me.displaying).'+me.opts.animateOut[0]+'("fast",function() {this.comp();});');
				}else{
					$(this.displaying).remove();
					this.displaying=null;	
					$(this.blockout).remove();
					this.blockout=null;
				}
				this.opts.selected(this,this.date,inputs.formatDate(this.opts.formatoutput,this.date));
			};
			objs[oo].position=function() {
				var pos=$(this).offset();
				pos.top+=this.opts.offset[1];
				pos.left+=this.opts.offset[0];
				var pad=[0,0,0,0];
				var top=(pos.top+this.clientHeight+pad[2]);
				var bottom=top+$(this.displaying).outerHeight();
				var maxBottom=$(window).height()+document.body.scrollTop;
				if (bottom>maxBottom) top=maxBottom-$(this.displaying).outerHeight();
				this.displaying.style.top=top+"px";

				if (this.opts.align=='left') {
					this.displaying.style.left=(pos.left)+"px";
				}else{
					$(this.displaying).css("display","block");
					this.displaying.style.left=(pos.left+this.clientWidth-this.displaying.clientWidth)+"px";
					$(this.displaying).css("display","none");
				}
			};
		};
		function monthTable(dt,opts) {
			var fd=inputs.firstDayInMonth(dt);
			var ld=inputs.daysInMonth(dt);
			var today=new Date(dt.getFullYear(),dt.getMonth(),-fd+1);
			var selectedDate=new Date(dt.getFullYear(),dt.getMonth(),dt.getDate());
			var op='';
			var current=new Date();
			current=new Date(current.getFullYear(),current.getMonth(),current.getDate());
			op+="<table cellspacing="+opts["cellspacing"]+" cellpadding="+opts["cellpadding"]+" >";
			op+="<tr>";
			var days=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
			for(var d=0;d<days.length;d++) op+='<th>'+days[d].substr(0,opts.daynamelength)+'</th>';
			op+="</tr>";
			while(today.getFullYear()<dt.getFullYear() || (today.getFullYear()==dt.getFullYear() && today.getMonth()<=dt.getMonth()) || today.getDay()>0) {
				var weekend=(today.getDay()==0 || today.getDay()==6);
				var notMonth=(today.getMonth()!=dt.getMonth());
				var inRange=true;
				var now=!(today<current || today>current);
				var inPast=(today<current);
				var selected=!(today<selectedDate || today>selectedDate);
				if (opts.minDate!==null && opts.minDate>today) inRange=false;
				if (opts.maxDate!==null && opts.maxDate<today) inRange=false;
				if (!opts.past && inPast) inRange=false;
				var classes="date"+(weekend?" weekend":"")+(notMonth?" notMonth":"")+(inRange?" selectable":"")+(now?" today":"")+(selected?" selected":"")+(inPast?" inPast":"");
				if (today.getDay()==0) op+="<tr>";
				op+="<td class='"+classes+"'>"+((opts.showOther || !notMonth)?today.getDate():"&nbsp;")+"</td>";
				if (today.getDay()==6) op+="</tr>";
				today=new Date(today.getFullYear(),today.getMonth(),today.getDate()+1);
			}
			op+="</table>";
			return op;
		}
	},
	firstDayInMonth:function(dt) {
		var today=new Date(dt.getFullYear(),dt.getMonth(),1);
		return today.getDay();
	},
	daysInMonth:function(dt) {
		var y=dt.getFullYear();
		var daysInMonth=[31,28,31,30,31,30,31,31,30,31,30,31];
		var leapYear=((y%4)==0)?(((y%100)==0)?(((y%400)==0)?true:false):true):false;
		return daysInMonth[dt.getMonth()];
	},
	stringToDate:function(f,str) {
		var today=new Date();
		var D=today.getDate();
		var M=today.getMonth();
		var Y=today.getFullYear();
		var h=today.getHours();
		var m=today.getMinutes();
		var s=today.getSeconds();
		var morning=(h<=12);
		var days=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
		var months=["January","February","March","April","May","June","July","August","September","October","November","December"];
		for(var l=0;l<f.length;l++) {
			var L=f.substr(l,1);
			switch(L) {
				case "d":
					var mD=str.match(/^\d+/);
					if (mD) {
						D=mD[0];
						str=str.replace(new RegExp('^'+mD[0]),'');
					}
				break;
				case "j":
					var mD=str.match(/^\d+/);
					if (mD) {
						D=mD[0];
						str=str.replace(new RegExp('^'+mD[0]),'');
					}
				break;
				case "D":
					var rem='';
					for(var i=0;i<days.length;i++) {
						if (str.substr(0,3)==days[i].substr(0,3)) rem=str.substr(0,3);
					}
					if (rem!="") str=str.replace(new RegExp('^'+rem),'');
				break;
				case "l":
					var rem='';
					for(var i=0;i<days.length;i++) {
						if (str.substr(0,days[i].length)==days[i]) rem=days[i];
					}
					if (rem!="") str=str.replace(new RegExp('^'+rem),'');
				break;
				case "N":
					str=str.replace(/^\d/,'');
				break;
				case "S":
					str=str.replace(/^[st|nd|rd|th]/,'');
				break;
				case "w":
					str=str.replace(/^\d/,'');
				break;
				case "z":
					str=str.replace(/^\d{1,3}/,'');
				break;
				case "W":
					str=str.replace(/^\d{1,2}/,'');
				break;
				case "F":
					var rem='';
					for(var i=0;i<months.length;i++) {
						if (str.substr(0,3)==months[i].substr(0,3)) rem=str.substr(0,3);
					}
					if (rem!="") str=str.replace(new RegExp('^'+rem),'');
				break;
				case "M":
					var rem='';
					for(var i=0;i<months.length;i++) {
						if (str.substr(0,months[i].length)==months[i]) rem=months[i];
					}
					if (rem!="") str=str.replace(new RegExp('^'+rem),'');
				break;
				case "m":
					var mD=str.match(/^\d{1,2}/);
					if (mD) {
						M=mD[0]-1;
						str=str.replace(new RegExp('^'+mD[0]),'');
					}
				break;
				case "n":
					var mD=str.match(/^\d{1,2}/);
					if (mD) {
						M=mD[0]-1;
						str=str.replace(new RegExp('^'+mD[0]),'');
					}
				break;
				case "t":
					str=str.replace(/^\d{1,2}/,'');
				break;
				case "Y":
					var mD=str.match(/^\d{4}/);
					if (mD) {
						Y=mD[0];
						str=str.replace(new RegExp('^'+mD[0]),'');
					}
				break;
				case "y":
					var mD=str.match(/^\d{2}/);
					if (mD) {
						Y=Y.substr(0,2)+mD[0];
						str=str.replace(new RegExp('^'+mD[0]),'');
					}
				break;
				case "a":
					morning=(str.substr(0,2)=="am");
					str=str.replace(/^\w\w/,'');
				break;
				case "A":
					morning=(str.substr(0,2)=="AM");
					str=str.replace(/^\w\w/,'');
				break;
				case "g":
					var mD=str.match(/^\d{1,2}/);
					if (mD) {
						h=(1*mD[0])+(morning?12:0);
						str=str.replace(new RegExp('^'+mD[0]),'');
					}
				break;
				case "G":
					var mD=str.match(/^\d{1,2}/);
					if (mD) {
						h=1*mD[0];
						str=str.replace(new RegExp('^'+mD[0]),'');
					}
				break;
				case "h":
					var mD=str.match(/^\d{1,2}/);
					if (mD) {
						h=(1*mD[0])+(morning?12:0);
						str=str.replace(new RegExp('^'+mD[0]),'');
					}
				break;
				case "H":
					var mD=str.match(/^\d{1,2}/);
					if (mD) {
						h=1*mD[0];
						str=str.replace(new RegExp('^'+mD[0]),'');
					}
				break;
				case "i":
					var mD=str.match(/^\d{1,2}/);
					if (mD) {
						m=1*mD[0];
						str=str.replace(new RegExp('^'+mD[0]),'');
					}
				break;
				case "s":
					var mD=str.match(/^\d{1,2}/);
					if (mD) {
						s=1*mD[0];
						str=str.replace(new RegExp('^'+mD[0]),'');
					}
				break;
				default:
					str=str.substr(1,str.length-1);
				break;
			}
		}
		return new Date(Y,M,D,h,m,s);
	},
	formatDate:function(f,dt) {
		var op='';
		if (typeof(dt.getDate)=="function") {
			var d=dt.getDate();
			var m=dt.getMonth();
			var y=dt.getFullYear().toString();
			var hours=dt.getHours();
			var minutes=dt.getMinutes();
			var seconds=dt.getSeconds();
			var onejan = new Date(dt.getFullYear(),0,1);
			var doy=Math.ceil((dt - onejan) / 86400000);
			var days=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
			var months=["January","February","March","April","May","June","July","August","September","October","November","December"];
			var daysInMonth=[31,28,31,30,31,30,31,31,30,31,30,31];
			var leapYear=((y%4)==0)?(((y%100)==0)?(((y%400)==0)?true:false):true):false;
			if (leapYear) daysInMonth[1]=29;
			var suffix=[];
			for(var l=0;l<31;l++) suffix[l]="th";
			suffix[0]=suffix[20]=suffix[30]="st";
			suffix[1]=suffix[21]="nd";
			suffix[2]=suffix[22]="rd";
			for(var l=0;l<f.length;l++) {
				var L=f.substr(l,1);
				switch(L) {
					case "d":
						op+=((d.toString().length==1)?"0":"")+d.toString();
					break;
					case "D":
						op+=days[dt.getDay()+1].substr(0,3);
					break;
					case "j":
						op+=d.toString();
					break;
					case "l":
						op+=days[dt.getDay()];
					break;
					case "N":
						op+=(dt.getDay()==0)?"7":dt.getDay();
					break;
					case "S":
						op+=suffix[d-1];
					break;
					case "w":
						op+=dt.getDay();
					break;
					case "z":
						op+=doy;
					break;
					case "W":
						op+=Math.ceil(doy/7);
					break;
					case "F":
						op+=months[m];
					break;
					case "m":
						var mn=m+1;
						op+=((mn.toString().length==1)?"0":"")+mn.toString();
					break;
					case "M":
						op+=months[m].substr(0,3);
					break;
					case "n":
						var mn=m+1;
						op+=mn.toString();
					break;
					case "t":
						op+=daysInMonth[m];
					break;
					case "L":
						op+=leapYear;
					break;
					case "Y":
						op+=y.toString();
					break;
					case "y":
						op+=y.toString().substr(-2);
					break;
					case "a":
						op+=(hours<12)?"am":"pm";
					break;
					case "A":
						op+=(hours<12)?"AM":"PM";
					break;
					case "g":
						op+=(hours>12)?hours-12:hours;
					break;
					case "G":
						op+=hours;
					break;
					case "h":
						var hrs=(hours>12)?hours-12:hours;
						op+=((hrs.toString().length==1)?"0":"")+hrs;
					break;
					case "H":
						op+=((hours.toString().length==1)?"0":"")+hours;
					break;
					case "i":
						op+=((minutes.toString().length==1)?"0":"")+minutes;
					break;
					case "s":
						op+=((seconds.toString().length==1)?"0":"")+seconds;
					break;
					default:
						op+=L;
					break;
				}
			}
		}
		return op;
	},
	surround:function(objs,type) {
		objs=eez.objArray(objs);
		for(var o=0;o<objs.length;o++) {
			var ins=eez.createHTML(type(""))[0];
			css.add(ins,objs[o].tagName);
			var p=objs[o].parentNode;
			p.insertBefore(ins,objs[o]);
			var c=ob('.c',ins)[0];
			c.appendChild(objs[o]);
		}
	},
	score:function(txt,check) {
		var s=0;
		var tp=txt.split(' ');
		for(var i=0;i<tp.length;i++) {
			tp[i]=tp[i].replace(/\W/,'');
			var level1=new RegExp('^'+tp[i],'i');
			var level2=new RegExp('\\b'+tp[i],'i');
			var level3=new RegExp(tp[i],'i');
			if (level1.test(check)) s+=30;
			if (level2.test(check)) s+=20;
			if (level3.test(check)) s+=10;
		}
		return s;
	},
	byFirstIndex:function(a,b) {
		return a[0]-b[0];
	},
	layout:{
		threeColumn:function(content) {
			return "<table cellpadding=0 cellspacing=0 class='threecol'><tr><td class='l'>&nbsp;</td><td class='c'>"+content+"</td><td class='r'>&nbsp;</td></tr></table>";
		},
		nineCell:function(content) {
			return "<table cellpadding=0 cellspacing=0 class='ninecell'><tr><td class='tl'>&nbsp;</td><td class='t'>&nbsp;</td><td class='tr'>&nbsp;</td></tr><tr><td class='l'>&nbsp;</td><td class='c'>"+content+"</td><td class='r'><li></li></td></tr><tr><td class='bl'>&nbsp;</td><td class='b'>&nbsp;</td><td class='br'>&nbsp;</td></tr></table>";
		},
		oneCell:function(content) {
			return "<table cellpadding=0 cellspacing=0 class='onecell'><tr><td class='c'>"+content+"</td></tr></table>";
		},
		none:function(content) {
			return content;
		}
	},
	blockout:function() {
		return this.createHTML("<div class='blockout' style='display:none'></div>")[0];
	},
	functions:{
	},
	createElement:function(tag,id,className,styles) {
		var tmp=document.createElement(tag);
		if (id!==null) tmp.id=id;
		if (className!==null) $(tmp).addClass(className);
		if (styles!==null) {
			for(var s in styles) {
				if (typeof(styles[s])=="string") $(tmp).css(s,styles[s]);
			}
		}
		return tmp;
	},
	tempDiv:null,
	createHTML:function(ins) {
		if (inputs.tempDiv===null) inputs.tempDiv=document.createElement("div");
		$(inputs.tempDiv).html(ins);
		return $(inputs.tempDiv).find(">*").get();
	},
	margins:function(o) {
		return [$(o).css("margin-top").replace("px",""),$(o).css("margin-right").replace("px",""),$(o).css("margin-bottom").replace("px",""),$(o).css("margin-left").replace("px","")];
	},
	paddings:function(o) {
		return [$(o).css("padding-top").replace("px",""),$(o).css("padding-right").replace("px",""),$(o).css("padding-bottom").replace("px",""),$(o).css("padding-left").replace("px","")];
	}
};
