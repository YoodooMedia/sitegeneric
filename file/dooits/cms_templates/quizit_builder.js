var quizit={
	containers:{
		main:null,
		options:null,
		structure:null
	},
	autosave:false,
	layout:'<div class="quizit">&nbsp;</div>\n<script type="text/javascript">\nfunction initThis() {\nvar param={};\nparam.dependencies=[\n[\'dooits/quiz/quizit.js\',true],\n[\'css/quiz/quizit.css\',true],\n[\'overlay/json.js\',true]\n];\nparam.loaded=function(){\nquizit.init({selectors:{container:".quizit"}});\n};\nparam.saveValues=["quizit.output"];\nparam.noscroll=true;\nparam.finished="quizit.finishable";\ndooit.init(param);\n}\n</script>',
	value:{},
	schema:{
		main:{
			title:{label:'Title',initial:'Quizit',type:'text',description:'The title of the Quizit.'},
			paragraph:{label:'Paragraph',initial:'',type:'textarea',description:'The paragraph shown under the title on all pages.'},
			start:{label:'Start button text',initial:"Let's get going...",type:'text',description:'The text shown on the start the quiz button.'},
			nextPage:{label:'Next button text',initial:"Next...",type:'text',description:'The text shown on the next page button.'},
			finish:{label:'Finish button text',initial:"Finish...",type:'text',description:'The text shown on the finish button.'},
			passedMessage:{label:'Passed message',initial:"Congratulations, you passed with a score of {score}",type:'textarea',description:'The message the user receives if the pass mark is achieved ("{score}" will be replaced with the score achieved).'},
			failedMessage:{label:'Failed message',initial:"Unfortunately, you did not pass with a score of {score}",type:'textarea',description:'The message the user receives if the pass mark is not achieved ("{score}" will be replaced with the score achieved).'},
			redoable:{label:'Redoable',initial:true,type:'boolean',description:'Allows the user to redo the quiz, once it has been completed.'},
			navigable:{label:'Navigable',initial:false,type:'boolean',description:'Allows the user to navigate while in the quiz (Not available if a timer is defined).'},
			timeout:{label:'Total time limit',initial:0,type:'integer',description:'The time limit set for the whole Quizit in seconds. If no time limit desired, then set to 0.',notNull:true},
			timeoutMessage:{label:'Timeout message',initial:'You took too long!',type:'textarea',description:'The message shown to the user if the time limit is reached before completion.'},
			completeOnPassOnly:{label:'Complete on pass only',initial:true,type:'boolean',description:'Tick this if you want the Quizit to appear complete only when the user passes it..'},
			passMark:{label:'Pass mark (%)',initial:75,type:'integer',description:'The percentage score required to mark as a pass.',notNull:true},
			pages:{label:'Pages',initial:[],type:'page',description:'The pages that contain the groups of questions.',required:true},
			timerWarnings:{label:'Timer warnings',initial:[],type:'timerWarnings',description:'The warnings shown to the user when the timer reaches a limit.'},
			scoreTagRules:{label:'Tag rules',initial:[],type:'scoreTagRules',description:'The rules that set tags depending on the score achieved.'}
		},
		scoreTagRules:{
			elementType:{className:'rule',sortable:true,deleteable:true},
			tag:{label:'Tag name',initial:'tagname',type:'text',description:'The name of the tag to change.',affectButton:true,required:true},
			unique:{label:'Unique',initial:false,type:'boolean',description:'If the user gets this tag, all other tags defined here are removed.'},
			unset:{label:'Removable',initial:false,type:'boolean',description:'If the user already has this tag and it is no longer applicable, it will be removed.'},
			stop:{label:'Stop',initial:false,type:'boolean',description:'If the user gets this tag, the tag rules below will not be checked.'},
			compares:{label:'Tag parameters (all must be true to set the tag)',initial:[],type:'compares',description:'The score percentage comparisons.'}
		},
		compares:{
			elementType:{className:'Parameter',sortable:true,deleteable:true},
			compare:{label:'Score % is...',initial:'=',options:[
				{value:'<',text:'less than'},
				{value:'<=',text:'less than or equal to'},
				{value:'=',text:'equal to'},
				{value:'>=',text:'greater than or equal to'},
				{value:'>',text:'greater than '}
				],type:'select',description:'The rule to apply to the score below.'},
			value:{label:'this score...',initial:0,type:'integer',description:'The percentage the score will be compared to.',notNull:true}
		},
		timerWarnings:{
			elementType:{className:'timerwarning',sortable:false,deleteable:true},
			timeLeft:{label:'Time left',initial:10,type:'integer',description:'The time left when the warning is shown.',notNull:true},
			message:{label:'Warning message',initial:'Not long left!',type:'text',description:'The warning text to be shown when the time left is reached.',affectButton:true,required:true},
			colour:{label:'Warning colour',initial:'990000',type:'colour',description:'The time warning colour.'}
		},
		page:{
			elementType:{className:'page',sortable:true,deleteable:true,update:'onPageUpdate'},
			id:{initial:'quizit.uniqueId()',type:'hidden'},
			title:{label:'Title',initial:'Page title',type:'text',description:'The title of the Quizit page.',affectButton:true},
			paragraph:{label:'Paragraph',initial:'',type:'textarea',description:'The paragraph shown under the title on this page.'},
			timeout:{label:'Total time limit',initial:0,type:'integer',description:'The time limit set for the Page in seconds. If no time limit desired, then set to 0.',notNull:true},
			timeoutMessage:{label:'Timeout message',initial:'You took too long!',type:'textarea',description:'The message shown to the user if the time limit is reached before completion of the Page.'},
			shuffle:{label:'Shuffle',initial:'None',type:'shuffle',description:'The quantity of questions displayed randomly. Choose "None" if not to be shuffled.',className:'onPageUpdate'},
			autoProgress:{label:'Auto progress',initial:false,type:'boolean',description:'If all the questions on the page are answered and does not contain text questions, then the next page will automatically be progressed to.'},
			questions:{label:'Questions',initial:[],type:'questions',description:'The questions on this page.',onchange:'quizit.ancester(this,"page").update()',required:true}
		},
		questions:{
			Text:{
				type:{initial:'Text',type:'h4',description:''},
				id:{initial:'quizit.uniqueId()',type:'hidden'},
				title:{label:'Title',initial:'Question title',type:'text',description:'The title of the question.',affectButton:true,required:true},
				paragraph:{label:'Paragraph',initial:'',type:'textarea',description:'The paragraph shown under the title on this question.'},
				caseInsensitive:{label:'Matches are case insensitive',initial:true,type:'boolean',description:'If selected, the matches will not be case sensitive.'},
				options:{label:'Matches',initial:[],type:'optionsText',description:'The matches in this question.',required:true}
			},
			Select:{
				type:{initial:'Select',type:'h4',description:'A select box for a single selection from a number of predefined options.'},
				id:{initial:'quizit.uniqueId()',type:'hidden'},
				title:{label:'Title',initial:'Question title',type:'text',description:'The title of the question.',affectButton:true,required:true},
				paragraph:{label:'Paragraph',initial:'',type:'textarea',description:'The paragraph shown under the title on this question.'},
				options:{label:'Options',initial:[],type:'optionsSelect',description:'The options in this question.',required:true}
			},
			MultipleChoice:{
				type:{initial:'Multiple Choice',type:'h4',description:'Select any of the available options.',update:'onMultipleChoiceUpdate'},
				id:{initial:'quizit.uniqueId()',type:'hidden'},
				title:{label:'Title',initial:'Question title',type:'text',description:'The title of the question.',affectButton:true,required:true},
				paragraph:{label:'Paragraph',initial:'',type:'textarea',description:'The paragraph shown under the title on this question.'},
				maximum:{label:'Maximum',initial:1,type:'maximum',description:'The maximum number of items selectable.',className:'onMultipleChoiceUpdate'},
				options:{label:'Answers',initial:[],type:'optionsMultipleChoice',description:'The answers available in this question.',onchange:'console.log(quizit.ancester(this,"MultipleChoiceType"));quizit.ancester(this,"MultipleChoiceType").update()',required:true}
			},
			DragandDrop:{
				type:{initial:'Drag and Drop',type:'h4',description:'Drag and Drop the answer into the question.'},
				id:{initial:'quizit.uniqueId()',type:'hidden'},
				title:{label:'Title',initial:'Question title',type:'text',description:'The title of the question.',affectButton:true,required:true},
				paragraph:{label:'Paragraph',initial:'',type:'textarea',description:'The paragraph shown under the title on this question. Where "[blank]" is placed in the paragraph, the selected answer will be inserted instead.'},
				options:{label:'Options',initial:[],type:'optionsDragAndDrop',description:'The options in this question.',required:true}
			},
			Reorder:{
				type:{initial:'Reorder',type:'h4',description:'Reorder the available options into the correct order.'},
				id:{initial:'quizit.uniqueId()',type:'hidden'},
				title:{label:'Title',initial:'Question title',type:'text',description:'The title of the question.',affectButton:true,required:true},
				paragraph:{label:'Paragraph',initial:'',type:'textarea',description:'The paragraph shown under the title on this question. Where "[blank]" is placed in the paragraph, the selected answer will be inserted instead.'},
				positions:{label:'Positions',initial:1,type:'integer',description:'The number of top positions that count.'},
				scoreall:{label:'Score if all correct',initial:0,type:'integer',description:'The score if all positions are correct. Ensure this value is more or equal to the sum of each position score.'},
				options:{label:'Options',initial:[],type:'optionsReorder',description:'The options in this question.',required:true}
			}
		},
		optionsText:{
			elementType:{sortable:false,deleteable:true},
			title:{label:'Match text',initial:'',type:'text',description:'The text to match the answer against',required:true},
			score:{label:'Score',initial:1,type:'integer',description:'The score given if the text matches the answer.',notNull:true}
		},
		optionsSelect:{
			elementType:{sortable:false,deleteable:true},
			title:{label:'Option title',initial:'',type:'text',description:'The option answer text.',required:true},
			score:{label:'Score',initial:1,type:'integer',description:'The score given for this selected answer.',notNull:true}
		},
		optionsMultipleChoice:{
			elementType:{sortable:false,deleteable:true},
			title:{label:'Answer title',initial:'',type:'text',description:'The answer text.',required:true},
			score:{label:'Score',initial:1,type:'integer',description:'The score given for this selected answer.',notNull:true}
		},
		optionsDragAndDrop:{
			elementType:{sortable:false,deleteable:true},
			title:{label:'Option title',initial:'',type:'text',description:'The option answer text.',required:true},
			score:{label:'Score',initial:1,type:'integer',description:'The score given for this selected answer.',notNull:true}
		},
		optionsReorder:{
			elementType:{sortable:true,deleteable:true,className:'orderItem'},
			title:{label:'Option title',initial:'Order item',type:'text',description:'The option answer text.',affectButton:true,required:true},
			score:{label:'Score',initial:1,type:'integer',description:'The score awarded if in the correct position.',notNull:true},
		}
	},
	ids:{},
	init:function() {
		this.autosave=typeof(localStorage)!="undefined";
		if (this.autosave) {
			this.autosaveKey='globalFieldId'+$('input[name=globalFieldId]').val();
			if (localStorage[this.autosaveKey]!==undefined && localStorage[this.autosaveKey]!="") {
				if (window.confirm("Recover autosave data?")) {
					$('textarea#globalFieldContent').val(localStorage[this.autosaveKey]);
					localStorage[this.autosaveKey]='';
					quizit.init();
					return false;
				}
			}
		}
		$('form#exercise_form').submit(function(e) {
			return quizit.save(e);
		});
		this.containers.main=$('.exerciseTemplate').get(0);
		$(this.ancester(this.containers.main,'form-row')).css({overflow:"visible"});
		var val=$('#globalFieldContent').val();
		try{
			eval('quizit.value='+val+';');
		}catch(e) {}
		quizit.value=json.decode(quizit.value);
		this.build();
	},
	saveLocal:function() {
		if (this.autosave) localStorage[this.autosaveKey]=json.build(this.value);
	},
	clearLocal:function() {
		if (this.autosave) localStorage[this.autosaveKey]='';
	},
	build:function() {
		$(this.containers.main).html("<h2>Quizit Construction</h2>");
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
				if (quizit.levelValue(levels).length==0) {
					var err=but.item.label+' has no items';
					if(levels.length>2) {
						var parnt=quizit.parentValue(levels);
						if (parnt.title!==undefined && parnt.title!="") err+=' in '+parnt.title;
					}
					err+='.';
					missing.push(err);
				}
			}
		});
		$(this.containers.main).find(".requiredValue").each(function(i,e) {
//console.log(e.levels);
			var v=quizit.levelValue(e.levels);
			if (v===undefined || v===null || v=='') {
				var err=e.item.label+' is empty';
				if(e.levels.length>2) {
					var parnt=quizit.parentTitle(e.levels);
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
			return quizit.parentTitle(l);
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
		var level=quizit.value;
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
			if ( typeof(item.initial)=="object" && typeof(item.initial.length)=="number") defaultValue=item.initial.concat([]);
						
			if (/\(\)/.test(defaultValue)) {
				try{
					eval('defaultValue='+item.initial+';');
					if (item.initial=='quizit.uniqueId()') quizit.ids[defaultValue]=true;
				}catch(e){}
			}
			var index=null;
			if (args.length>3) {
				var val=quizit.levelValue(levels.concat([]),item,defaultValue,args[3]);
				return val;
			}else{
				var val=quizit.levelValue(levels.concat([]),item,defaultValue,item);
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
						};
					}
					$(but).bind("click",function() {
						var index=$(this).nextAll('div').get().length;
						var insertLevels=this.levels.concat([index]);
						quizit.object.render(this.parentNode,insertLevels,quizit.schema[this.item.type],index);
						if (this.update) this.update();
						return true;
					});
					o.appendChild(but);
					if (item.label) className=item.label;
					ab=$(o).find('.affectButton').get();
				}
				for(var i=0;i<val.length;i++) {
					quizit.object.render(o,levels.concat([i]),quizit.schema[item.type],i);
				}
				if (item.elementType!==undefined) {
					if (item.elementType.className!==undefined) className=item.elementType.className;
					if (item.elementType.sortable!==undefined) sortable=item.elementType.sortable;
					if (item.elementType.deleteable!==undefined) deleteable=item.elementType.deleteable;
				}
				if (className!==null || sortable==true) {
					o=quizit.collapsible((ab.length>0)?ab[0].value:className,o,{className:className.replace(/[^a-z]+/ig,'_'),sortable:sortable,deleteable:deleteable});
				}else if (deleteable) {
					var but=document.createElement("button");
					but.type="button";
					$(but).html("delete").addClass("delete");
					$(but).bind("click",function() {
						quizit.deleteItem(this);
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
						if (quizit.object[item[k].type]===undefined && typeof(item[k].initial)=="object" && typeof(item[k].initial.length)=="number") {
							var obj=quizit.object.render(o,levels.concat([k]),item[k]);
						}else{
							//try{
								var obj=quizit.object[item[k].type](o,levels.concat([k]),item[k]);
							//}catch(e) {
							//	console.log(quizit.schema[item.type][k].type);
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
						o=quizit.collapsible((ab.length>0)?ab[0].value:className,o,{className:className,sortable:sortable,deleteable:deleteable});
					}else if (deleteable) {
						var but=document.createElement("button");
						but.type="button";
						$(but).html("delete").addClass("delete");
						$(but).bind("click",function() {
							quizit.deleteItem(this);
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
						}
					}
				}
				if (sortable && className!==null) quizit.sortable(target,'>.quizit_sortable','>.collapseButton>.mover',function(e,ui) {quizit.updateOrder(e,ui,className);});
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
			//ip.val=val;
			ip.item=item;
			ip.levels=levels;
			$(ip).addClass("hasLevels");
			if (item.required===true) $(ip).addClass("requiredValue");
			ip.update=function(){};
			if (item.affectButton===true) {
				ip.update=function() {
					var p=quizit.ancester(this,'collapseContent');
					var b=$(p).prev('.collapseButton').find('>nobr');
					var t=this.value.replace(/[^a-z^0-9^ ]+/gi,'');
					b.html(t);
				};
				$(ip).addClass('affectButton');
			}
			$(ip).bind("keyup",function() {
				quizit.setValue(this,this.levels,this.value);
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
			$(ip).bind("keyup",function() {
				quizit.setValue(this,this.levels,this.value);
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
			$(ip).bind("blur",function() {
				if (this.notNull && this.value=='') {
					this.value=this.initial;
					quizit.setValue(this,this.levels,1*this.value);
				}
			});
			$(ip).bind("keydown",function(e) {
				var k=quizit.keyCode(e);
				if (!k.numeric && !k.navigate) {
					e.preventDefault();
					return false;
				}
			});
			$(ip).bind("keyup",function() {
				quizit.setValue(this,this.levels,1*this.value);
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
			$(ip).bind("keydown",function(e) {
				var hasPoint=/\./.test(this.value);
				var k=quizit.keyCode(e);
				if (hasPoint && k.numeric) return true;
				if (k.navigate) return true;
				if (!hasPoint && k.decimal) return true;
				e.preventDefault();
				return false;
			});
			$(ip).bind("keyup",function() {
				quizit.setValue(this,this.levels,1*this.value);
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
				quizit.setValue(this,this.levels,this.value);
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
				quizit.setValue(this,this.levels,this.checked);
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
				quizit.setValue(this,this.levels,this.value);
			});
			o.appendChild(label);
			o.appendChild(description);
			o.appendChild(ip);
			target.appendChild(o);
			$(ip).jPicker({images:{clientPath:'/js/jpicker/images/'},window:{position:{x:'0px',y:'0px'},expandable:true,liveUpdate:true}},function(colour,context) {
				quizit.setValue(this,this.levels,this.value);
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
				this.selector.val=quizit.levelValue(this.selector.levels);
				this.draw();
			};
			o.draw=function() {
				while(this.selector.childNodes.length>0) this.selector.removeChild(this.selector.childNodes[0]);
				var page=quizit.levelValue([this.selector.levels[0],this.selector.levels[1],this.selector.levels[2]]);
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
				quizit.setValue(this,this.levels,this.val);
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
				this.selector.val=quizit.levelValue(this.selector.levels);
				this.draw();
			};
			o.draw=function() {
				while(this.selector.childNodes.length>0) this.selector.removeChild(this.selector.childNodes[0]);
				var levels=[];
				for(var i=0;i<this.selector.levels.length-1;i++) levels.push(this.selector.levels[i]);
				var multichoice=quizit.levelValue(levels);
				var l=(multichoice.options==undefined)?0:multichoice.options.length;
				if (this.selector.val>l && l>0) {
					this.selector.val=l;
					quizit.setValue(this.selector,this.selector.levels,this.selector.val);
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
				quizit.setValue(this,this.levels,this.val);
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
					for(var k in quizit.schema.questions[type]) {
						if (quizit.object[quizit.schema.questions[type][k].type]!==undefined) {
							var o=quizit.object[quizit.schema.questions[type][k].type](oo,this.levels.concat([index,k]),quizit.schema.questions[type][k]);
						}else{
							var o=quizit.object.render(oo,this.levels.concat([index,k]),quizit.schema.questions[type][k]);
						}
					}
					var ab=$(oo).find('.affectButton').get();
					oo=quizit.collapsible((ab.length>0)?ab[0].value:'Question',oo,{className:'question '+type+'Type',sortable:true,deleteable:true});
					if (quizit.schema.questions[type].type.update!==undefined) {
						oo.updateClass=quizit.schema.questions[type].type.update;
						oo.update=function() {
							$(this).find('.'+this.updateClass).each(function(i,e) {
								if (e.update!==undefined) e.update();
							});
						};
					}
					$(oo).css({display:"none"});
					this.parentNode.appendChild(oo);
					$(oo).slideDown();
					var fi=quizit.ancester(this,'formItemUpdate');
					fi.update();
				}
			});

			var sel=quizit.questionTypeSelector();
			o.appendChild(label);
			o.appendChild(sel);
			o.appendChild(button);
			for(var q=0;q<val.length;q++) {
				var oo=document.createElement("div");
				$(oo).addClass("indexed");
				oo.levels=levels.concat([q]);
				$(oo).addClass("hasLevels");
				var sch=quizit.schema.questions[val[q].type.replace(/ /g,'')];
				for(var k in sch) {
					if (quizit.object[sch[k].type]!==undefined) {
						var ob=quizit.object[sch[k].type](oo,levels.concat([q,k]),sch[k]);
					}else{
						var ob=quizit.object.render(oo,levels.concat([q,k]),sch[k]);
					}
				}
				var ab=$(oo).find('.affectButton').get();
				oo=quizit.collapsible((ab.length>0)?ab[0].value:'Question',oo,{className:'question '+val[q].type.replace(/ /g,'')+'Type',sortable:true,deleteable:true})
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
			quizit.sortable(o,'.question','>.collapseButton .mover',function(e,ui) {quizit.updateOrder(e,ui,'question');});
			return o;
		}
	},
	deleteItem:function(o) {
		var item=quizit.ancester(o,'hasLevels');
		var removeItem=item;
		if ($(item.parentNode).hasClass("collapseContent")) removeItem=item.parentNode.parentNode;
		var callOnDelete=quizit.ancester(removeItem.parentNode,'callOnDelete');
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
			//var list=quizit.value;
//console.log(indexes);
			//for(var ii=0;ii<indexes.length;ii++) {
//console.log(list);
			//	list=list[indexes[ii]];
			//}
			//eval('list=quizit.value['+indexes.join('][')+'];');
			var cmd='quizit.value['+indexes.join('][')+'].splice('+i+',1);';
			eval(cmd);
//console.log(cmd);
//console.log(list);
			//list.splice(i,1);
			$(item).find('button').unbind("click");
			var fi=quizit.ancester(item,'formItem');
			if (fi.update) fi.update();
			if ($(removeItem).hasClass("hasLevels")) {
				quizit.updateLevelIndex($(removeItem).siblings('.hasLevels').get());
			}else{
				quizit.updateLevelIndex($(removeItem).siblings().find('>div>div.hasLevels').get());
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
			eval('list=quizit.value['+indexes.join('][')+'];');
			for(var i=0;i<list.length;i++) {
				if (list[i].id==id) oldIndex=i;
			}
			var page=list.splice(oldIndex,1);
			list.splice(newIndex,0,page[0]);
		}catch(e){}
		quizit.rebuildOrderIndexes(item);
	},
	rebuildOrderIndexes:function(item) {
//console.log(item);
		var os=$(item).parent().find('>.quizit_sortable>.collapseContent>.hasLevels.indexed').get();
//console.log(os);
		quizit.updateLevelIndex(os);
		/*$(item).parent().find('>.quizit_sortable>.collapseContent>.hasLevels.indexed').each(function(i,o) {
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
		while(quizit.idExists(id)) id=this.randomString();
		return id;
	},
	idExists:function(id) {
		return (typeof(quizit.ids[id])!="undefined");
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
		if (!isNaN(levels[levels.length-1])) levels[levels.length-1]=$(quizit.ancester(src,'indexed')).prevAll('.indexed').get().length;
		for(var l=0;l<levels.length;l++) {
			if (isNaN(levels[l])) {
				stack.push("'"+levels[l]+"'");
			}else{
				stack.push(levels[l]);
			}
		}
		try{
			eval('quizit.value['+stack.join('][')+']=value;');
		}catch(e){}
		if (quizit.autosave) quizit.saveLocal();
	},
	ancester:function(o,c) {
		if ($(o).hasClass(c)) return o;
		if (o==document.body) return false;
		if (!o.parentNode) return false;
		return quizit.ancester(o.parentNode,c);
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
				quizit.deleteItem(this);
			});
			content.insertBefore(but,content.childNodes[0]);
		}
		c.appendChild(content);
		o.appendChild(t);
		o.appendChild(c);
		if (className!==null) $(o).addClass(className);
		if (props['sortable']===true) $(o).addClass('quizit_sortable');
		return o;
	},
	sortable:function(container,items,handles,update) {
		$(container).sortable("destroy");
		$(container).sortable({items:items,handle:handles,update:update});
	},
	save:function(e) {
		var err=quizit.validate();
		quizit.clearLocal();
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
}
