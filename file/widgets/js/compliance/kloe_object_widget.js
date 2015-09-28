/* sample layout
{
	dependencies:[
		['dooits/compliance/constructor/business_sector.js',true],
		['dooits/compliance/constructor/key_question.js',true],
		['dooits/compliance/constructor/kloe_status.js',true],
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
		prompts_per_key_question:{
			type:'view',
		 	title:'Object view counting the prompts in each Key Question by Business Sector',
			value:9
		},
		responses_by_prompt:{
			type:'view',
		 	title:'Object view showing the status of responses in each prompt',
			value:10
		},
		overview_intervention:{
			title:'Intervention Id of the Overview',
			value:'205263'
		},
		overview_view:{
			type:'view',
			title:'Object view showing the overview by Business Sector',
			value:36
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
	this.keyQuestions=null;
	this.view=null;
	this.attentionView=null;
	this.promptView=null;
	this.dialData={};
	this.keyQuestionOrder=['Safe','Effective','Caring','Responsive','Well-led'];
	this.promptTotalsByBusinessSector={};
	this.promptCountByKeyQuestion={};
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
		$(this.widget.display).empty().append(
			yoodoo.loadingDiv()
		);
		this.admin=(yoodoo.user.managerType!==undefined && yoodoo.user.managerType.subManagers instanceof Array && yoodoo.user.managerType.subManagers.length>0);
		this.templater=this.admin && yoodoo.hasTag("kloe_templater");
		var me=this;
		yoodoo.businessSector.check(function() {
			if (me.admin) {
				me.adminBuild();
			}else{
				me.userBuild();
			}
		});
	};
	this.adminBuild=function() {
		var me=this;
		yoodoo.keyQuestion.get(function(list) {
			me.keyQuestions={};
			me.keyQuestionOrder=[];
			for(var l in list) {
				if (list[l].value.qviof>0) {
					me.keyQuestionOrder.push(list[l]);
					me.keyQuestions[list[l].Id]={keyQuestion:list[l],prompts:[],Immediate:0,Imminent:0};
				}
			}
			me.keyQuestionsComplete=true;
			me.resizeWidget();
//me.widget.setSize({aspect:me.keyQuestionOrder.length*0.8,complete:function(widget) {

//}});
			/*me.keyQuestionOrder.sort(function(a,b) {
				if (a.value.qviof<b.value.qviof) return -1;
				if (a.value.qviof>b.value.qviof) return 1;
				return 0;
			});*/
			yoodoo.object.getView(
				me.widget.data.exercise.display.options.overview_view.value,
				null,
				function(view) {
					var keyQuestion={};
					if (view.results.length>0) {
						for(var r in view.results) {
							if (me.keyQuestions[view.results[r].columns[0]]!==undefined) {
								me.keyQuestions[view.results[r].columns[0]].Immediate=view.results[r].columns[1];
								me.keyQuestions[view.results[r].columns[0]].Imminent=view.results[r].columns[2];
								me.keyQuestions[view.results[r].columns[0]].Expired=view.results[r].columns[3];
							}
							//keyQuestion[me.keyQuestions[view.results[r].columns[0]].keyQuestion.displayName()]={Immediate:view.results[r].columns[1],Imminent:view.results[r].columns[2]};
						}
					}
					$(me.widget.display).empty().append(me.businessSelector(yoodoo.businessSector.businessSectorAvailableCount>1));
					me.drawWarnings();
					$(me.widget.display).append(me.drawTemplateButtons());
				},function(){
				},
				{business_sector:yoodoo.businessSector.selectedBusinessSector}
			);
		},function(){},true);
	};
	this.drawTemplateButtons=function() {
		if (this.templater!==true) return null;
		var keyQuestions=['Safe','Effective','Caring','Responsive','Well-led'];
		var d=$(yoodoo.e("div")).addClass("templateButtons");
		var me=this;
		var pw=Math.floor(100/me.keyQuestionOrder.length);
		for(var k in me.keyQuestionOrder) {
		//for(var k in keyQuestions) {
			(function() {
				var keyQuestion=me.keyQuestionOrder[k];
				var interventionId=keyQuestion.value.zpaqd;
				d.append($(yoodoo.e("button")).attr("type","button").html("templates").click(function(){
					yoodoo.keyQuestion.select(function() {
						yoodoo.bookcase.showIntervention(interventionId);
					},keyQuestion.Id);
				}).css({width:pw+'%'}));
			})();
		}
		return d;
	};
	this.drawWarnings=function() {
		var me=this;
		$(this.widget.display).addClass("kloe_admin_widget");
		var but=$(yoodoo.e("button")).attr("type","button").addClass("overview_button").click(function() {
			yoodoo.bookcase.showIntervention(me.widget.data.exercise.display.options.overview_intervention.value);
		});
		var pw=Math.floor(100/me.keyQuestionOrder.length);
		for(var k in me.keyQuestionOrder) {
			var kqid=me.keyQuestionOrder[k].Id;
			var data=me.keyQuestions[kqid];
			var d=$(yoodoo.e("div")).addClass("keyQuestion").css({width:pw+'%'}).append($(yoodoo.e("div")).html(data.keyQuestion.displayName()));
				if (data.Immediate>0 || data.Expired>0) {
					var expired=null;
					if (data.Expired>0) {
						expired=$(yoodoo.e("span")).addClass("expired").html('+'+data.Expired).css({'border-color':'#'+this.colours.red,color:'#'+this.colours.red});
						yoodoo.bubble(expired.get(0),data.Expired+' location'+(data.Expired==1?' has':'s have')+' one or more expired responses that have not been viewed yet');
					}
					var immediate=null;
					if (data.Immediate>0) {
						immediate=$(yoodoo.e("span")).html(data.Immediate).addClass("warningCount").css({background:'#'+this.colours.red});
						yoodoo.bubble(immediate.get(0),data.Immediate+' location'+(data.Immediate==1?' has':'s have')+' one or more responses that are in need of attention');
					}
					d.append(
						$(yoodoo.e("span")).addClass("Immediate").append(immediate).append(expired).prepend(
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
				if (data.Imminent>0) {
					var imminent=$(yoodoo.e("span")).html(data.Imminent).addClass("warningCount").css({background:'#'+this.colours.amber});
					yoodoo.bubble(imminent.get(0),data.Imminent+' location'+(data.Imminent==1?' has':'s have')+' one or more responses that expire within a week');
					d.append(
						$(yoodoo.e("span")).addClass("Immediate").append(imminent).prepend(
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
					yoodoo.updateFields({},function() {
						me.build();
					},{});
				}
			});
			var sel=$(yoodoo.e("div")).addClass("businessSelector").append(selected).append(selector);
			var found=false;
			for(var name in yoodoo.businessSector.businessSectors) {
				var opt=$(yoodoo.e("option")).html(name).attr("value",yoodoo.businessSector.businessSectors[name].id);
				if (yoodoo.businessSector.businessSectors[name].on) {
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
			for(var name in yoodoo.businessSector.businessSectors) {
				if (yoodoo.businessSector.businessSectors[name].on) return $(yoodoo.e("div")).addClass("businessSelector").append($(yoodoo.e("span")).html(name));
			}
			return null;
		}
	};
	this.userBuild=function() {
		this.sections=[];
		var prompts_per_key_question=this.widget.data.exercise.display.options.prompts_per_key_question.value;
		var responses_by_prompt=this.widget.data.exercise.display.options.responses_by_prompt.value;
		var me=this;
		this.objectPrompt=yoodoo.keyQuestion.promptsObject;
		this.objectKeyQuestion=yoodoo.keyQuestion.object;
		/*yoodoo.object.get([objectPrompt,objectKeyQuestion],function(obj) {
			for(var o in obj) {
				if (obj[o].schema.Id==objectPrompt) me.objectPrompt=obj[o];
				if (obj[o].schema.Id==objectKeyQuestion) me.objectKeyQuestion=obj[o];
			}*/
			/*if (obj.length==2) {
				me.objectPrompt=obj[0];
				me.objectKeyQuestion=obj[1];
			}*/
			//var thisWidget=me;
			yoodoo.object.getView(prompts_per_key_question,null,function(obj) {
				me.promptView=obj;
				me.promptCountByKeyQuestion={};
				for(var r in me.promptView.results) {
					me.promptCountByKeyQuestion[me.promptView.results[r].columns[1]]=me.promptView.results[r].columns[0];
					/*for(var c=0;c<me.promptView.columns.length-1;c++) {
						var bsc=me.promptView.columns.length-1;
						if (me.promptTotalsByBusinessSector[me.promptView.results[r].columns[bsc]]===undefined) me.promptTotalsByBusinessSector[me.promptView.results[r].columns[bsc]]={};
						me.promptTotalsByBusinessSector[me.promptView.results[r].columns[bsc]][me.promptView.columns[c]]=me.promptView.results[r].columns[c];
					}*/
				}
				//console.log( me.promptCountByKeyQuestion);
				//console.log(me.promptCountByKeyQuestion);
				yoodoo.object.getView(responses_by_prompt,null,function(obj) {
					me.view=obj;
					me.promptResults={};
					for(var r in obj.results) {
						if (!isNaN(obj.results[r].columns[3])) {
							me.promptResults[obj.results[r].columns[4]]={
								responses:obj.results[r].columns[0],
								imminent:obj.results[r].columns[1],
								immediate:obj.results[r].columns[2]+obj.results[r].columns[3],
								prompt:obj.results[r].columns[4],
								suggested:obj.results[r].columns[5],
								keyQuestion:parseInt(obj.results[r].columns[7][0])
							}
						}
					}
						//console.log(me.promptResults);
					yoodoo.keyQuestion.get(function(list) {
						me.keyQuestions={};
						me.keyQuestionOrder=[];
						for(var l in list) {
							if (list[l].value.qviof>0) {
								me.keyQuestionOrder.push(list[l]);
								me.keyQuestions[list[l].Id]={keyQuestion:list[l],prompts:[],immediate:0,imminent:0,scores:0,count:(me.promptCountByKeyQuestion[list[l].Id]>0)?me.promptCountByKeyQuestion[list[l].Id]:0,score:0};
							}
						}
	//me.widget.setSize({aspect:this.admin?4:(1+(me.keyQuestionOrder.length*0.8)),complete:function(widget) {
		
	//}});
						//console.log(me.keyQuestionOrder);
						for(var p in me.promptResults) {
							var kqid=me.promptResults[p].keyQuestion;
							if (me.keyQuestions[kqid]!==undefined) {
								me.keyQuestions[kqid].prompts.push(me.promptResults[p]);
								me.keyQuestions[kqid].immediate+=me.promptResults[p].immediate;
								me.keyQuestions[kqid].imminent+=me.promptResults[p].imminent;
								var s=me.promptResults[p].responses/me.promptResults[p].suggested;
								if (s>1) s=1;
								me.keyQuestions[kqid].scores+=s;
							}
						}
						for(var kqid in me.keyQuestions) {
							if (me.keyQuestions[kqid].count==0) {
								me.keyQuestions[kqid].score=0;
							}else{
								me.keyQuestions[kqid].score=100*(me.keyQuestions[kqid].scores/ me.keyQuestions[kqid].count);
								if (me.keyQuestions[kqid].score>100) me.keyQuestions[kqid].score=100;
							}
						}
						me.keyQuestionsComplete=true;
						me.resizeWidget();
						me.loadedObjects();
					});
				},function(obj) {
					console.log('failed',obj);
				},{business_sector:yoodoo.businessSector.selectedBusinessSector});
			},function(obj) {
				console.log('failed',obj);
			},{business_sector:yoodoo.businessSector.selectedBusinessSector});
	};
	this.sortComplete=false;
	this.keyQuestionsComplete=false;
	this.resizeWidget=function() {
		if (this.keyQuestionsComplete && this.sortComplete)
		me.widget.setSize({aspect:this.admin?me.keyQuestionOrder.length*0.8:(1+(me.keyQuestionOrder.length*0.8)),complete:function(widget) {

		}});
	};
		
	this.sorted=function() {
		this.sortComplete=true;
		this.resizeWidget();
	};
	this.dialRescale=function(v) {
		if (v==100) return v;
		return Math.round((90*v)/100);
		return Math.round(Math.pow(v,2)/100);
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
				return (t>1)?1:t;
			}
			return 0;
		};
	};
	this.loadedObjects=function() {
		if (this.view!==null) {
			this.dialData={};
			for(var kq in this.keyQuestions) {
				this.dialData[this.keyQuestions[kq].keyQuestion.Id]=this.keyQuestions[kq];
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
		var aggregate={
			immediate:0,
			imminent:0,
			scores:0,
			score:0,
			count:0
		};
		var widget=this.widget;

		var w=Math.floor($(this.widget.display).height()*0.8);
		var r=Math.floor((w-10)/2);
		var ir=r-10;
		if (ir<0) return false;
		$(this.widget.display).empty();
		var me=this;
		for(var kq in this.keyQuestionOrder) {
			
			aggregate.count++;
			aggregate.immediate+=me.dialData[d].immediate;
			aggregate.imminent+=me.dialData[d].imminent;
			aggregate.scores+=me.dialData[d].score;
			
			var d=this.keyQuestionOrder[kq].Id;
			var b=$(yoodoo.e("button")).attr("type","button");
			(function() {
				var data=me.dialData[d];
				var interventionId=data.keyQuestion.value.zpaqd;
				b.click(function() {
					yoodoo.keyQuestion.select(function() {
						if (interventionId>0) yoodoo.bookcase.showIntervention(interventionId);
					},data.keyQuestion.Id);
				});
			})();
			$(b).css({display:"none",width:w}).addClass("kloe_object_widget").append(
				$(yoodoo.e("div")).html(
					this.keyQuestionOrder[kq].displayName()
				).addClass("widget_label")
			);
			this.dialData[d].dial=null;
			var dir=0;
			//if (this.dialData[d].immediate>0 || this.dialData[d].imminent>0) dir=10;
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
			var col=undefined;
			
			if (this.dialData[d].score==0) col= yoodooStyler.hexToRGB(this.colours.grey);
			if (this.dialData[d].immediate>0) {
				col= yoodooStyler.hexToRGB(this.colours.red);
			}else if (this.dialData[d].imminent>0) {
				col= yoodooStyler.hexToRGB(this.colours.amber);
			}else if (this.dialData[d].score==100) {
				col= yoodooStyler.hexToRGB(this.colours.green);
			}
			
//console.log(this.dialData[d].score);
			$(b).prepend($(this.dialData[d].dial.render(this.dialRescale(this.dialData[d].score),col)).css({display:'inline-block'}));
			$(this.widget.display).append(b);
			$(b).fadeIn(500,function() {

			});
		}
		
		
		aggregate.score=aggregate.scores/aggregate.count;
		if (aggregate.score>100) aggregate.score=100;
		var att=aggregate;
		var w=Math.floor($(this.widget.display).height()*1);
		var r=Math.floor((w-20)/2);
		var ir=r-10;
		var me=this;
		var b=$(yoodoo.e("button")).attr("type","button").click(function() {
			var interventionId=me.widget.data.exercise.display.options.control_panel_intervention_id.value;
			if (interventionId>0) yoodoo.bookcase.showIntervention(interventionId);
		});
		var dir=0;
		var col=undefined;
		if (att.score==0) {
			col=this.colours.grey;
		}else if (att.immediate>0) {
			col=this.colours.red;
			dir=10;
		}else if (att.imminent>0) {
			col=this.colours.amber;
			dir=10;
		}else if (att.score==100) {
			col=this.colours.green;
		}
		
		var css={display:"none",width:w};
		if (col!==undefined) css['border-left']='1px solid #'+col;
		if (col!==undefined) col=yoodooStyler.hexToRGB(col);
		$(b).css(css).addClass("kloe_object_widget").append(
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
		$(b).prepend($(this.totaldial.render(this.dialRescale(att.score),col)).css({display:'inline-block'}));
		$(this.widget.display).append(b);
		$(b).fadeIn(500,function() {

		});
	};
	this.widget.setSize({aspect:this.admin?5*0.8:(1+(5*0.8)),complete:function(widget) {
		widget.readied=true;
		me.render();
		widget.readyCallback();
	}});
	this.build();
}
