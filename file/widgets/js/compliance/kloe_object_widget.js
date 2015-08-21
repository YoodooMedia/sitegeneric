/* sample layout
{
	dependencies:[
		['widgets/js/compliance/kloe_object_widget.js',true],
		['widgets/css/compliance/kloe_object_widget.css',true]
	],
	continueControl:false,
	ready:function(src) {
		src.object=new kloe_object_widget(src);
	},
	key:'',
	options:{
		control_panel_intervention_id:{
			type:'integer',
		 	title:'The intervention id of the KLOE Control Panel',
			value:204255
		},
		prompt_view:{
			type:'view',
		 	title:'Object view counting the prompts in each Key Question and Business Sector',
			value:0
		},
		attention_view:{
			type:'view',
		 	title:'Object view showing the needing attention counts',
			value:0
		},
		count_view:{
			type:'view',
		 	title:'Object view showing the response count',
			value:09
		},
		kloe_prompt_object:{
			type:'object',
		 	title:'Object name for the Prompts',
			value:0
		},
		key_questions:{
			type:'object',
		 	title:'Object name for the Key Questions',
			value:0
		},
		overview_intervention:{
			title:'Intervention Id of the Overview',
			value:'205029'
		},
		overview_view:{
			type:'view',
			title:'Object view showing the overview by Business Sector',
			value:0
		}
	}
}
*/


function kloe_object_widget(src) {
	this.widget=src;
	this.container=null;
	this.allow_continue=true;
	this.widget.autoReady=false;
	var me=this;
	this.sections=[];
	this.widget.priority=50;
	$(this.widget.display).empty();
	this.prompts={};
	this.keyQuestions={};
	this.view=null;
	this.attentionView=null;
	this.promptView=null;
	this.dialData={};
	this.keyQuestionOrder=['Safe','Effective','Caring','Responsive','Well-led'];
	this.promptTotalsByBusinessSector={};
	this.usedBusinessSectorIds={};
	this.colours={red:{r:171,g:42,b:42},grey:{r:200,g:200,b:200},amber:{r:239,g:146,b:37},green:{r:18,g:201,b:40}};
	this.dialColourRange={
		low : {
			r : 152,
			g : 164,
			b : 93
		},
		mid : {
			r : 205,
			g : 226,
			b : 99
		},
		midabove:null,
		high : {
			r : 225,
			g : 255,
			b : 17
		}
	};
	this.businessSectors={};
	this.businessSectorAvailableCount=0;
	this.templater=false;
	this.admin=false;
	this.icons={
		cross:{
			img:'/uploads/sitespecific/yoodoo.siteFolder/image/cross4D4D4D.png',
			svg:'<rect x="37.747" y="7.931" transform="matrix(-0.7689 -0.6393 0.6393 -0.7689 56.4817 120.4132)" fill="#4D4D4D" width="24.507" height="84.138"/><rect x="37.746" y="7.931" transform="matrix(0.6393 -0.769 0.769 0.6393 -20.4129 56.483)" fill="#4D4D4D" width="24.508" height="84.138"/>'},
		warning:{
			img:'/uploads/sitespecific/yoodoo.siteFolder/image/warning.png',
			svg:'<path fill-rule="evenodd" clip-rule="evenodd" fill="#4D4D4D" d="M53.845,33.167c0.114,0.113,0.17,0.245,0.17,0.396v11.853c0,3.706-0.754,10.496-2.261,20.37c-0.025,0.138-0.088,0.251-0.188,0.339c-0.113,0.088-0.239,0.132-0.377,0.132h-2.054c-0.138,0-0.257-0.044-0.358-0.132c-0.113-0.088-0.176-0.201-0.188-0.339c-1.495-9.761-2.242-16.539-2.242-20.332v-11.89c0-0.151,0.057-0.283,0.169-0.396c0.113-0.113,0.245-0.169,0.396-0.169h6.538C53.601,32.998,53.732,33.054,53.845,33.167z M55.277,72.964c0,1.357-0.478,2.525-1.433,3.506h-0.019c-0.967,0.967-2.123,1.45-3.467,1.45c-1.369,0-2.525-0.483-3.467-1.45c-0.967-0.98-1.451-2.148-1.451-3.506c0-1.344,0.484-2.499,1.451-3.467c0.955-0.954,2.11-1.432,3.467-1.432c1.344,0,2.5,0.478,3.467,1.432C54.794,70.465,55.277,71.62,55.277,72.964z M48.079,7.521c1.42-0.528,2.852-0.528,4.297,0c0.088,0.038,0.175,0.088,0.264,0.151l-0.057-0.057c1.318,0.54,2.33,1.444,3.033,2.713l41.136,72.849c0.053,0.063,0.098,0.133,0.132,0.207c0.007,0.012,0.013,0.024,0.019,0.037c0.727,1.283,0.965,2.646,0.716,4.09c0,0.037,0,0.069,0,0.094c-0.289,1.457-1.005,2.67-2.147,3.637h-0.02c-1.155,0.955-2.481,1.433-3.976,1.433H8.941c-1.444,0-2.726-0.446-3.844-1.338c-0.05-0.025-0.094-0.057-0.132-0.095c-1.156-0.967-1.866-2.18-2.129-3.637c-0.013-0.024-0.019-0.05-0.019-0.075c-0.261-1.443-0.029-2.813,0.697-4.108c0.006-0.013,0.012-0.025,0.019-0.037c0.034-0.074,0.078-0.144,0.132-0.207l41.135-72.849c0.703-1.269,1.721-2.173,3.052-2.713l-0.075,0.057c0.101-0.063,0.207-0.113,0.32-0.151H48.079z M50.755,12.232c-0.314-0.113-0.616-0.113-0.905,0c-0.314,0.113-0.553,0.314-0.716,0.603L7.868,85.929c-0.151,0.276-0.195,0.571-0.132,0.886c0.05,0.313,0.194,0.571,0.433,0.772c0.251,0.201,0.534,0.302,0.848,0.302h82.534c0.314,0,0.597-0.101,0.849-0.302c0.238-0.201,0.396-0.459,0.471-0.772c0.05-0.314-0.007-0.609-0.17-0.886L51.434,12.835C51.271,12.546,51.044,12.345,50.755,12.232z"></path>'}
	};
	this.colours={
		red:'AB2A2A',
		amber:'EF9225',
		cyan:'619FEC',
		green:'1ADF23',
		grey:'C8C8C8'
	};
	this.icon=function() {
		if (this.doSVG) {
			if (typeof(arguments[0])=="object") arguments[0]=arguments[0].svg;
			return yoodoo.icons.drawSVG.apply(yoodoo.icons,arguments);
		}else{
			if (typeof(arguments[0])=="object") arguments[0]=arguments[0].img;
			var replacer={};
			if (typeof(arguments[arguments.length-1])=="object") replacer=arguments[arguments.length-1];
			var url=arguments[0];
			for(var k in replacer) url=url.replace(k,replacer[k]);
			var img=yoodoo.e("img");
			img.src=yoodoo.replaceDomain('domain:'+url);
			return img;
		}
	};
	this.build=function() {
		this.widget.preventing_continue=function(){
			return !this.object.allow_continue;
		};
		$(this.widget.container).addClass("kloe_object_widget_parent");
		$(this.widget.display).append(
			yoodoo.loadingDiv()
		);
		this.admin=(yoodoo.user.managerType!==undefined && yoodoo.user.managerType.subManagers instanceof Array && yoodoo.user.managerType.subManagers.length>0);
		this.templater=this.admin && yoodoo.hasTag("kloe_templater");
		if (this.admin) {
			this.detectBusinessSectors();
			this.adminBuild();
		}else{
			this.userBuild();
		}
	};
	this.detectBusinessSectors=function() {
		this.businessSectors={};
		var tagNames={};
		for(var tid in this.widget.data.tags) {
			tagNames[this.widget.data.tags[tid]]=tid;
		}
		this.businessSectorAvailableCount=0;
		for(var tid in this.widget.data.tags) {
			if (this.widget.data.tags[tid].match(/^Selectable/)) {
				var userTag=this.widget.data.tags[tid].replace(/^Selectable/,'User');
				if (tagNames[userTag]!==undefined && yoodoo.hasTag(this.widget.data.tags[tid])) {
					this.businessSectors[userTag.replace(/User_Type_/,'').replace(/_/,' ')]={tag:userTag,id:tagNames[userTag],on:yoodoo.hasTag(userTag)};
					this.businessSectorAvailableCount++;
				}
			}
		}
	};
	this.adminBuild=function() {
		//if (this.businessSectorAvailableCount>1) {
			//$(this.widget.display).append(this.businessSelector(this.businessSectorAvailableCount>1));
		//}
//console.log(this.widget.data.exercise.display.options.overview_view.value);
		var objectKeyQuestion=this.widget.data.exercise.display.options.key_questions.value;
		var me=this;
		yoodoo.object.get(objectKeyQuestion,function(obj) {
			var kq=me.keyQuestionObject=obj.pop();
			me.keyQuestions={};
			for(var i in kq.records) {
				me.keyQuestions[kq.records[i].displayName()]=kq.records[i];
			}
			yoodoo.object.getView(me.widget.data.exercise.display.options.overview_view.value,null,function(view) {
				var keyQuestion={};
				if (view.results.length>0) {
					for(var r in view.results) {
						keyQuestion[me.keyQuestionObject.recordsCache[view.results[r].columns[0]].displayName()]={Immediate:view.results[r].columns[1],Imminent:view.results[r].columns[2]};
					}
				}
				$(me.widget.display).empty().append(me.businessSelector(me.businessSectorAvailableCount>1));
				me.drawWarnings(keyQuestion);
				$(me.widget.display).append(me.drawTemplateButtons());
			},function(){});
		},function(){},true);
	};
	this.drawTemplateButtons=function() {
		if (this.templater!==true) return null;
		var keyQuestions=['Safe','Effective','Caring','Responsive','Well-led'];
		var d=$(yoodoo.e("div")).addClass("templateButtons");
		var me=this;
		for(var k in keyQuestions) {
			var nom=keyQuestions[k];
			(function() {
				var interventionId=me.keyQuestions[nom].value.zpaqd;
				d.append($(yoodoo.e("button")).attr("type","button").html("templates").click(function(){
					yoodoo.bookcase.showIntervention(interventionId);
				}));
			})();
		}
		return d;
	};
	this.drawWarnings=function(data) {
		var me=this;
		var keyQuestions=['Safe','Effective','Caring','Responsive','Well-led'];
		$(this.widget.display).addClass("kloe_admin_widget");
		var but=$(yoodoo.e("button")).attr("type","button").addClass("overview_button").click(function() {
			yoodoo.bookcase.showIntervention(me.widget.data.exercise.display.options.overview_intervention.value);
		});
		for(var k in keyQuestions) {
			var nom=keyQuestions[k];
			var d=$(yoodoo.e("div")).addClass("keyQuestion").append($(yoodoo.e("div")).html(nom));
				if (data[nom]!==undefined && data[nom].Immediate>0) {
					d.append(
						$(yoodoo.e("span")).addClass("Immediate").append(
							$(yoodoo.e("span")).html(data[nom].Immediate).css({background:'#'+this.colours.red})
						).prepend(
							this.icon(this.icons.cross,20,20,100,100,{'4D4D4D':this.colours.red})
						)
					);
				}else{
					d.append(
						$(yoodoo.e("span")).addClass("Immediate").append(
							$(this.icon(this.icons.cross,20,20,100,100,{'4D4D4D':this.colours.red})).css({opacity:0.2})
						)
					);
				}
				if (data[nom]!==undefined && data[nom].Imminent>0) {
					d.append(
						$(yoodoo.e("span")).addClass("Immediate").append(
							$(yoodoo.e("span")).html(data[nom].Imminent).css({background:'#'+this.colours.red})
						).prepend(
							this.icon(this.icons.warning,20,20,100,100,{'4D4D4D':this.colours.amber})
						)
					);
				}else{
					d.append(
						$(yoodoo.e("span")).addClass("Immediate").append(
							$(this.icon(this.icons.warning,20,20,100,100,{'4D4D4D':this.colours.amber})).css({opacity:0.2})
						)
					);
				}
			$(but).append(d);
		}
		$(this.widget.display).append(but);
	};
	this.businessSelector=function(withSelector) {
		if (withSelector) {
			var open=function(elem) {
				if (document.createEvent) {
				    var e = document.createEvent("MouseEvents");
				    e.initMouseEvent("mousedown", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
				    elem.dispatchEvent(e);
				} else if (elem.fireEvent) {
				    elem.fireEvent("onmousedown");
				}
			    };
			var selected=$(yoodoo.e("button")).attr("type","button").html("No business sector selected").click(function() {
				$(this).fadeOut(function() {
					$(this).next().fadeIn(function() {
						//this.focus();
						open(this);
					});
				});
			});
			var me=this;
			var selector=$(yoodoo.e("select")).hide().bind("change",function() {
				var tagId=this.value;
				if (tagId>0) {
					for(var tid in me.widget.data.tags) {
						if (tagId!=tid && me.widget.data.tags[tid].match(/^User_Type/) && yoodoo.hasTag(tid)) {
							dooit.removeTag(tid);
						}
					}
					dooit.addTag(tagId);
					this.disabled=true;
					yoodoo.updateFields({},function() {},{});
				}
			});
			var sel=$(yoodoo.e("div")).addClass("businessSelector").append(selected).append(selector);
			var found=false;
			for(var name in this.businessSectors) {
				var opt=$(yoodoo.e("option")).html(name).attr("value",this.businessSectors[name].id);
				if (this.businessSectors[name].on) {
					selected.html(name);
					found=opt.get(0).selected=true;
					opt.hide();
				}
				selector.append(opt);
			}
			if (found===false) {
				var opt=$(yoodoo.e("option")).html('Select...').attr("value",0).hide();
				opt.get(0).selected=true;
				selector.append(opt);
			}
			return sel;
		}else{
			for(var name in this.businessSectors) {
				if (this.businessSectors[name].on) return $(yoodoo.e("div")).addClass("businessSelector").append($(yoodoo.e("span")).html(name));
			}
			return null;
		}
	};
	this.userBuild=function() {
		this.sections=[];
		var promptViewId=this.widget.data.exercise.display.options.prompt_view.value;
		var objectViewId=this.widget.data.exercise.display.options.count_view.value;
		var objectAttentionViewId=this.widget.data.exercise.display.options.attention_view.value;
		var objectPrompt=this.widget.data.exercise.display.options.kloe_prompt_object.value;
		var objectKeyQuestion=this.widget.data.exercise.display.options.key_questions.value;
		var me=this;
		yoodoo.object.get([objectPrompt,objectKeyQuestion],function(obj) {
			for(var o in obj) {
				if (obj[o].schema.Id==objectPrompt) me.objectPrompt=obj[o];
				if (obj[o].schema.Id==objectKeyQuestion) me.objectKeyQuestion=obj[o];
			}
			/*if (obj.length==2) {
				me.objectPrompt=obj[0];
				me.objectKeyQuestion=obj[1];
			}*/
			//var thisWidget=me;
			yoodoo.object.getView(promptViewId,null,function(obj) {
				me.promptView=obj;
				//console.log(me.promptView);
				for(var r in me.promptView.results) {
					for(var c=0;c<me.promptView.columns.length-1;c++) {
						var bsc=me.promptView.columns.length-1;
						if (me.promptTotalsByBusinessSector[me.promptView.results[r].columns[bsc]]===undefined) me.promptTotalsByBusinessSector[me.promptView.results[r].columns[bsc]]={};
						me.promptTotalsByBusinessSector[me.promptView.results[r].columns[bsc]][me.promptView.columns[c]]=me.promptView.results[r].columns[c];
					}
				}
				//console.log(me.promptTotalsByBusinessSector);
				yoodoo.object.getView(objectViewId,null,function(obj) {
					me.view=obj;
					var promptIds={};
					for(var r in obj.results) {
						if (!isNaN(obj.results[r].columns[1])) promptIds[obj.results[r].columns[1]]=true;
					}
					var ids=[];
					for(var pid in promptIds) {
						ids.push(pid);
					}
					me.objectPrompt.get(function(obj) {
						me.prompts={};
						for(var o in obj) {
							var prompt=new me.prompt(obj[o]);
							me.prompts[prompt.object.Id]=prompt;
						}
						me.objectKeyQuestion.get(function(obj) {
							me.keyQuestions={};
							for(var o in obj) {
								var kq=new me.keyQuestion(me,obj[o]);
								me.keyQuestions[kq.object.Id]=kq;
							}
							yoodoo.object.getView(objectAttentionViewId,null,function(obj) {
								me.attentionView=obj;
								me.loadedObjects();
							},function(obj) {
								console.log('failed',obj);
							});
						},function() {
							console.log("Failed to retrieve key questions");
						},null,{});
					},function() {
						console.log("Failed to retrieve prompt records");
					},0,{
						pbyno:me.widget.data.exercise.display.options.business_sector.value
					},ids);
					//console.log(obj);
					//$(document.body).append(obj.drawTable(true));
				},function(obj) {
					console.log('failed',obj);
				});
			},function(obj) {
				console.log('failed',obj);
			});
		});
		/*for(var f in this.widget.data.fields) {
			//console.log(this.widget.data.fields[f][1]);
			if (this.widget.data.fields[f][1].records!==undefined) this.sections.push(this.widget.data.fields[f][1].records);
		}*/
	};
	this.dialRescale=function(v) {
		if (v==100) return v;
		return Math.round((90*v)/100);
		return Math.round(Math.pow(v,2)/100);
	};
	this.keyQuestion=function(widget,kQ) {
		this.widget=widget;
		this.object=kQ;
		this.attentions=null;
		this.prompts=[];
		this.score=0;
		this.add=function(prompt) {
			this.prompts.push(prompt);
		};
		this.getScore=function() {
			var promptCount=0;
			for(var id in this.widget.usedBusinessSectorIds) {
				if (this.widget.promptTotalsByBusinessSector[id]!==undefined && this.widget.promptTotalsByBusinessSector[id][this.object.displayName()]!==undefined) {
					promptCount+=this.widget.promptTotalsByBusinessSector[id][this.object.displayName()];
				}
			}
			if (this.prompts.length>0 && promptCount>0) {
				var t=0;
				var c=0;
				for(var p in this.prompts) {
					t+=this.prompts[p].getScore();
					c++;
				}
				//return this.score=99;
//console.log(this.object.displayName(),t,c,promptCount);
				return this.score=Math.round(100*t/promptCount);
			}
			return this.score=0;
		};
		this.getAttentions=function() {
			if (this.attentions===null) return {immediate:0,imminent:0,responses:0};
			//return {responses:10,immediate:1,imminent:0};
			return {immediate:this.attentions.columns[1],imminent:this.attentions.columns[0],responses:this.attentions.columns[2]};
		};
		this.getColour=function() {
			var att=this.getAttentions();
			if (att.responses==0) return yoodooStyler.hexToRGB(this.widget.colours.grey);
			if (att.immediate>0) return yoodooStyler.hexToRGB(this.widget.colours.red);
			if (att.imminent>0) return yoodooStyler.hexToRGB(this.widget.colours.amber);
			if (this.score==100) return yoodooStyler.hexToRGB(this.widget.colours.green);
			return undefined;
		};
	};
	this.getAttentions=function() {
		var att=null;
		for(var k in this.keyQuestions) {
			if (att===null) {
				att=this.keyQuestions[k].getAttentions();
				//console.log(att);
			}else{
				var newatt=this.keyQuestions[k].getAttentions();
				//console.log(newatt);
				for(var a in newatt) {
					if (att[a]!==undefined) att[a]+=newatt[a];
				}
			}
		}
		return att;
	};
	this.prompt=function(p) {
		this.object=p;
		this.results=[];
		this.add=function(result) {
			this.results.push(result);
			
		};
		this.getScore=function() {
			if (this.results.length>0) {
				var t=0;
				for(var r in this.results) {
					t+=this.results[r].columns[0];
				}
				t/=this.object.getValue('Suggested response count');
//console.log(this.object.displayName(),(t>1)?1:t);
				return (t>1)?1:t;
			}
			return 0;
		};
	};
	this.loadedObjects=function() {
		this.suggestedResponseKey='xlbzu';
		this.responsePromptKey=this.objectPrompt.getParameterReferingToObjectId(this.objectKeyQuestion.schema.Id);
		if (this.view!==null) {
			for(var p in this.prompts) {
				var kq=this.prompts[p].object.value[this.responsePromptKey];
				if (this.prompts[p].object.value.pbyno>0) this.usedBusinessSectorIds[this.prompts[p].object.value.pbyno]=true;
				if (kq>0 && this.keyQuestions[kq]!==undefined) this.keyQuestions[kq].add(this.prompts[p]);
			}
			for(var r in this.view.results) {
				var pid=this.view.results[r].columns[1];

			
				if (this.prompts[pid]!==undefined) {
					this.prompts[pid].results=[];
					this.prompts[pid].add(this.view.results[r]);
				}
			}
			//console.log(this.keyQuestions);
			for(var r in this.attentionView.results) {
				//console.log(this.attentionView.results[r]);
				var last=this.attentionView.results[r].columns.length-1;
				if (this.keyQuestions[this.attentionView.results[r].columns[last]]!==undefined) this.keyQuestions[this.attentionView.results[r].columns[last]].attentions=this.attentionView.results[r];
			}
			this.dialData={};
			for(var kq in this.keyQuestions) {
				this.dialData[this.keyQuestions[kq].object.displayName()]=$.extend({keyQuestion:this.keyQuestions[kq],score:this.keyQuestions[kq].getScore()},this.keyQuestions[kq].getAttentions());
				//console.log(this.keyQuestions[kq].object.displayName()+' = '+this.keyQuestions[kq].getScore()+' - '+JSON.stringify(this.keyQuestions[kq].getAttentions()));
			}
			this.drawDials();
		}
	};
	var me=this;
	this.nonSVG=function() {
		this.colours=me.dialColourRange;
		this.render=function(v,col) {
			v=Math.round(v);
			if (typeof(col)=="undefined") col=(v<50)?yoodooStyler.fromTo(this.colours.low,this.colours.mid,(v*2)/100):yoodooStyler.fromTo(this.colours.mid,this.colours.high,((v-50)*2)/100);
			return $(yoodoo.e("div")).html(v+'%').addClass('kloe_numeric_dial').css({color:yoodooStyler.rgbToHex(col)}).addClass((v<10 && v>0)?'belowTen':'');
		};
	};
	this.doSVG=(document.createElementNS!==undefined);
	//this.doSVG=false;
	this.render=function() {
		
	};
	this.drawDials=function() {
		if (this.container!==null) $(this.container).remove();
		var total=0;
		var score=0;
		for(var d in this.dialData) {
			score+=this.dialData[d].score;
			total++;
		}
		if (total>0) score/=total;
		score=Math.round(score);
		//console.log(score);
		//if (this.widget.title =="REQUIRES IMPROVEMENT") score = 50;

		var widget=this.widget;

		var w=Math.floor($(this.widget.display).height()*0.8);
		var r=Math.floor((w-10)/2);
		var ir=r-10;
		if (ir<0) return false;
		$(this.widget.display).empty();
		for(var kq in this.keyQuestionOrder) {
			var d=this.keyQuestionOrder[kq];
			var b=$(yoodoo.e("button")).attr("type","button");
			var data=this.dialData[d];
			(function() {
				var interventionId=data.keyQuestion.object.value.zpaqd;
				b.css({border:'none'}).click(function() {
					if (interventionId>0) yoodoo.bookcase.showIntervention(interventionId);
				});
			})();
			$(b).css({display:"none",width:w}).addClass("kloe_object_widget").append(
				$(yoodoo.e("div")).html(
					d
				).addClass("widget_label")
			);
			this.dialData[d].dial=null;
			var dir=0;
			if (this.dialData[d].immediate>0 || this.dialData[d].imminent>0) dir=10;
			if (this.doSVG) {
				this.dialData[d].dial=new yoodoo.ui.graphs.dial({
					balanced:50,
					tolerance:50,
					outerRadius:r,
					innerRadius:ir-dir,
					markBalance:false,
					colours : this.dialColourRange
				});
			}else{
				this.dialData[d].dial=new this.nonSVG();
			}
			var col=this.dialData[d].keyQuestion.getColour();
//console.log(this.dialData[d].score);
			$(b).prepend($(this.dialData[d].dial.render(this.dialRescale(this.dialData[d].score),col)).css({display:'inline-block'}));
			$(this.widget.display).append(b);
			$(b).fadeIn(500,function() {

			});
		}
		
		
		
		var att=this.getAttentions();
		var w=Math.floor($(this.widget.display).height()*1);
		var r=Math.floor((w-20)/2);
		var ir=r-20;
		var me=this;
		var b=$(yoodoo.e("button")).attr("type","button").css({border:'none'}).click(function() {
			var interventionId=me.widget.data.exercise.display.options.control_panel_intervention_id.value;
			if (interventionId>0) yoodoo.bookcase.showIntervention(interventionId);
		});
		var dir=0;
		var col=undefined;
		if (att.responses==0) {
			col=this.colours.grey;
		}else if (att.immediate>0) {
			col=this.colours.red;
			dir=10;
		}else if (att.imminent>0) {
			col=this.colours.amber;
			dir=10;
		}else if (score==100) {
			col=this.colours.green;
		}
		if (col!==undefined) col=yoodooStyler.hexToRGB(col);
		
		
		$(b).css({display:"none",width:w}).addClass("kloe_object_widget").append(
			$(yoodoo.e("div")).html(
				dooit.decode((typeof(yoodoo.user.meta['yourService'])=="string" && yoodoo.user.meta['yourService'].length>0)?yoodoo.user.meta['yourService']:'Summary')
			).addClass("widget_label")
		);
		if (this.doSVG) {
			this.totaldial=new yoodoo.ui.graphs.dial({
				balanced:50,
				tolerance:50,
				outerRadius:r,
				innerRadius:ir-dir,
				markBalance:false,
				colours : this.dialColourRange
			});
		}else{
			this.totaldial=new this.nonSVG();
		}
		$(b).prepend($(this.totaldial.render(this.dialRescale(score),col)).css({display:'inline-block'}));
		$(this.widget.display).append(b);
		$(b).fadeIn(500,function() {

		});
	};
	this.build();
	this.widget.setSize({aspect:this.admin?4:(1+(5*0.8)),complete:function(widget) {
		widget.readied=true;
		me.render();
		widget.readyCallback();
	}});
}
