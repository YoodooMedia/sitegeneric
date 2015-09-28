/*
{
 dependencies:[
  ['dooits/compliance/kloe_overview.js',true],
  ['css/compliance/kloe_overview.css',true]
 ],
 dooit:'kloe_overview',
 options:{
	key_question:{
		title:'Key Question object',
		type:'object',
		value:0
	},
	prompts:{
		title:'Prompts object',
		type:'object',
		value:0
	},
	business_sector:{
		title:'Business Sector',
		type:'objectrecord',
		object_id:0,
		value:0
	},
	suggested_count:{
		title:'Prompt suggested count',
		type:'view',
		value:0
	},
	home_summary:{
		title:'Bottom level view by prompt and Manager Type (KLOE Home Summary)',
		type:'view',
		value:0
	}
 }
}
*/

var kloe_overview = {
	start: function() {
		//console.log("opened");
	},
	objects:{},
	records:{},
	suggestedCounts:{},
	prompts:{},
	keyQuestions:{},
	managerTypes:{},
	managerTypeNames:{},
	promptDisplayNames:{},
	keyQuestionPromptCount:{},
	keyQuestions:{},
	keyQuestionOrder:[],
	doSVG:(document.createElementNS!==undefined),
	icons:{
		cross:{
			img:'/uploads/sitespecific/yoodoo.siteFolder/image/cross4D4D4D.png',
			svg:'<rect x="37.747" y="7.931" transform="matrix(-0.7689 -0.6393 0.6393 -0.7689 56.4817 120.4132)" fill="#4D4D4D" width="24.507" height="84.138"/><rect x="37.746" y="7.931" transform="matrix(0.6393 -0.769 0.769 0.6393 -20.4129 56.483)" fill="#4D4D4D" width="24.508" height="84.138"/>'},
		warning:{
			img:'/uploads/sitespecific/yoodoo.siteFolder/image/warning.png',
			svg:'<path fill-rule="evenodd" clip-rule="evenodd" fill="#4D4D4D" d="M53.845,33.167c0.114,0.113,0.17,0.245,0.17,0.396v11.853c0,3.706-0.754,10.496-2.261,20.37c-0.025,0.138-0.088,0.251-0.188,0.339c-0.113,0.088-0.239,0.132-0.377,0.132h-2.054c-0.138,0-0.257-0.044-0.358-0.132c-0.113-0.088-0.176-0.201-0.188-0.339c-1.495-9.761-2.242-16.539-2.242-20.332v-11.89c0-0.151,0.057-0.283,0.169-0.396c0.113-0.113,0.245-0.169,0.396-0.169h6.538C53.601,32.998,53.732,33.054,53.845,33.167z M55.277,72.964c0,1.357-0.478,2.525-1.433,3.506h-0.019c-0.967,0.967-2.123,1.45-3.467,1.45c-1.369,0-2.525-0.483-3.467-1.45c-0.967-0.98-1.451-2.148-1.451-3.506c0-1.344,0.484-2.499,1.451-3.467c0.955-0.954,2.11-1.432,3.467-1.432c1.344,0,2.5,0.478,3.467,1.432C54.794,70.465,55.277,71.62,55.277,72.964z M48.079,7.521c1.42-0.528,2.852-0.528,4.297,0c0.088,0.038,0.175,0.088,0.264,0.151l-0.057-0.057c1.318,0.54,2.33,1.444,3.033,2.713l41.136,72.849c0.053,0.063,0.098,0.133,0.132,0.207c0.007,0.012,0.013,0.024,0.019,0.037c0.727,1.283,0.965,2.646,0.716,4.09c0,0.037,0,0.069,0,0.094c-0.289,1.457-1.005,2.67-2.147,3.637h-0.02c-1.155,0.955-2.481,1.433-3.976,1.433H8.941c-1.444,0-2.726-0.446-3.844-1.338c-0.05-0.025-0.094-0.057-0.132-0.095c-1.156-0.967-1.866-2.18-2.129-3.637c-0.013-0.024-0.019-0.05-0.019-0.075c-0.261-1.443-0.029-2.813,0.697-4.108c0.006-0.013,0.012-0.025,0.019-0.037c0.034-0.074,0.078-0.144,0.132-0.207l41.135-72.849c0.703-1.269,1.721-2.173,3.052-2.713l-0.075,0.057c0.101-0.063,0.207-0.113,0.32-0.151H48.079z M50.755,12.232c-0.314-0.113-0.616-0.113-0.905,0c-0.314,0.113-0.553,0.314-0.716,0.603L7.868,85.929c-0.151,0.276-0.195,0.571-0.132,0.886c0.05,0.313,0.194,0.571,0.433,0.772c0.251,0.201,0.534,0.302,0.848,0.302h82.534c0.314,0,0.597-0.101,0.849-0.302c0.238-0.201,0.396-0.459,0.471-0.772c0.05-0.314-0.007-0.609-0.17-0.886L51.434,12.835C51.271,12.546,51.044,12.345,50.755,12.232z"></path>'},
		walking:{
			img:'/uploads/sitespecific/yoodoo.siteFolder/image/walking4D4D4D.png',
			svg:'<path fill="#4D4D4D" d="M94.563,23.5L78.438,37.625l-8.5-5.125l-0.608-0.165c4.788-0.398,8.546-4.199,8.546-8.835 c0-4.901-4.197-8.875-9.375-8.875s-9.375,3.974-9.375,8.875c0,2.902,1.479,5.472,3.754,7.091l-8.191-2.216L43.063,31l-4.5,9.5 l-3.25-1.375L30.188,43.5l8.625,4.125L48.438,36l3.375,1.125l-4.75,19.5l-13.25,11.25L15.688,52.5L6.063,65l11.25-2.75l13,15.25 l24.25-8.75l13-3.125l8.125,21.25L90.313,79.5l-11.125-2.25l-3.5-19l-14.75-2l6.625-15l13.875,4.875L92.813,32.75l3.125,0.75 l0.75-12.875L94.563,23.5z"/>'}
	},
	colours:{
		red:'AB2A2A',
		amber:'EF9225',
		cyan:'619FEC',
		green:'1ADF23'
	},
	icon:function() {
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
	},
	displayed:function() {
		var me=this;
		this.containers.breadcrumb=$(yoodoo.e("div")).addClass("kloeBreadcrumb");
		this.containers.arena=$(yoodoo.e("div")).addClass("kloeArena");
		this.containers.container.addClass("kloeOverview").append(this.containers.breadcrumb).append(
			$(yoodoo.e("div")).append(this.containers.arena)
		);
		this.loadManagers();
		// fetch the home summary view
		var step5=function() {
					yoodoo.object.getView(dooit.options.home_summary.value,null,function(view) {
		//console.log(view);
						var foundManagerIds={};
						var promptToKeyQuestionKey=me.objects.prompt.getParameterReferingToObjectId(yoodoo.keyQuestion.object.schema.Id);
						for(var i in view.results) {
							var obj={};
							for(var c in view.columns) obj[view.columns[c]]=view.results[i].columns[c];
		//console.log(view.columns,view.results[i].columns,obj);
							var mid=view.results[i].managerTypeId;
		//console.log(view.results[i]);
		//console.log(mid);
							if (me.managerIds[mid]!==undefined && obj.Prompt!==null) {
								foundManagerIds[mid]=true;
								//if (me.managerTypes[mid]===undefined) me.managerTypes[mid]={};
								//if (me.managerTypeNames[obj['Manager type']]===undefined) me.managerTypeNames[obj['Manager type']]=me.managerIds[mid];
								if (me.managerIds[mid].keyQuestion===undefined) me.managerIds[mid].keyQuestion={};
								var prompt=me.prompts[obj.Prompt];
		//console.log(prompt,obj.Prompt);
								var keyQuestion=me.keyQuestions[prompt.value[promptToKeyQuestionKey]];
								var kqName=keyQuestion.displayName();
								me.managerIds[mid].gotResults=true;
								//console.log(mid,kqName);
								if (me.managerIds[mid].keyQuestion[kqName]===undefined) me.managerIds[mid].keyQuestion[kqName]={
									keyQuestion:null,
									Score:0,
									PromptScores:0,
									PromptCount:me.keyQuestionPromptCount[prompt.value[promptToKeyQuestionKey]],
									Immediate:0,
									Imminent:0,
									Expired:0,
									'Action Plans':0,
									'Evidence':0,
									'Live Action Plans':0,
									Count:0,
									Results:[]
								};
								me.managerIds[mid].keyQuestion[kqName].Results.push(obj);
								for(var k in obj) {
									if (me.managerIds[mid].keyQuestion[kqName][k]!==undefined) me.managerIds[mid].keyQuestion[kqName][k]+=obj[k];
								}
								if (me.managerIds[mid].keyQuestion[kqName].keyQuestion===null) me.managerIds[mid].keyQuestion[kqName].keyQuestion=keyQuestion;
								var score=0;
								if (obj.Responses>0 && me.suggestedCounts[obj.Prompt]!==undefined && me.suggestedCounts[obj.Prompt]>0) score=obj.Responses/me.suggestedCounts[obj.Prompt];
								if (score>1) score=1;
								me.managerIds[mid].keyQuestion[kqName].PromptScores+=score;
								me.managerIds[mid].keyQuestion[kqName].Count++;
							}
						}
						for(var mid in me.managerIds) {
							for(var kqName in me.managerIds[mid].keyQuestion) {
								me.managerIds[mid].keyQuestion[kqName].Score=me.managerIds[mid].keyQuestion[kqName].PromptScores/me.managerIds[mid].keyQuestion[kqName].PromptCount;
							}
						}
						//console.log(me.manager.getScores());
						me.manager.draw();
					},function(){},{
						business_sector:yoodoo.businessSector.selectedBusinessSector
					});
		};
		var processKeyQuestions=function(list) {
			for(var l in list) me.keyQuestions[list[l].Id]=list[l];
			step5();
		};
		// fetch the key questions
		var step4=function() {
			if (me.objects.keyQuestion.records instanceof Array && me.objects.keyQuestion.records.length>1) {
				processKeyQuestions(me.objects.keyQuestion.records);
			}else{
				me.objects.keyQuestion.get(processKeyQuestions,function(){},0);
			}
		};
		var processPrompts=function(list) {
			var promptToKeyQuestionKey=me.objects.prompt.getParameterReferingToObjectId(yoodoo.keyQuestion.object.schema.Id);
			var kqPromptCount={};
			for(var l in list) {
				if (me.prompts[list[l].Id]===undefined) {
					me.prompts[list[l].Id]=list[l];
					me.promptDisplayNames[list[l].displayName()]=list[l].Id;
					var kqId=list[l].value[promptToKeyQuestionKey];
					if (kqPromptCount[kqId]===undefined) kqPromptCount[kqId]=0;
					kqPromptCount[kqId]++;
					me.suggestedCounts[list[l].Id]=list[l].value.xlbzu;
				}
			}
			me.keyQuestionPromptCount=kqPromptCount;
			step5();
		};
		// fetch all prompts in this business sector
		var step2=function() {
			var filter={};
			filter[me.objects.prompt.getParameterReferingToObjectId(yoodoo.businessSector.object.schema.Id)]=yoodoo.businessSector.selectedBusinessSector;
			me.objects.prompt.get(processPrompts,function() {},0,filter);
		};

		// discover the suggested response count for the 
		/*var step3=function() {
			yoodoo.object.getView(dooit.options.suggested_count.value,null,function(view) {
				for(var i in view.results) me.suggestedCounts[me.promptDisplayNames[view.results[i].columns[1]]]=view.results[i].columns[0];
				step4();
			},function(){});
		};*/

		// load the 3 objects required
		yoodoo.businessSector.check(function(bs) {
			yoodoo.keyQuestion.get(function(list) {
				me.keyQuestions={};
				me.keyQuestionOrder=[];
				for(var l in list) {
					if (list[l].value.qviof>0) {
						me.keyQuestions[list[l].Id]=list[l];
						me.keyQuestionOrder.push(list[l]);
					}
				}
				me.keyQuestionOrder.sort(function(a,b) {
					if (a.value.qviof<b.value.qviof) return -1;
					if (a.value.qviof>b.value.qviof) return 1;
					return 0;
				});
				
				yoodoo.keyQuestion.getPromptsObject(function(obj) {
				//yoodoo.object.get(dooit.options.prompts.value,function(list) {
		//console.log(list);
					//me.objects.businessSector=list.pop();
					me.objects.prompt=obj;
					//me.objects.keyQuestion=list.pop();
					step2();
				});
			});
		});
	},
	drawScore:function(percentage) {
		var col=yoodooStyler.fromTo(yoodooStyler.hexToRGB(this.colours.red),yoodooStyler.hexToRGB(this.colours.green),percentage/100);
		return $(yoodoo.e("div")).addClass("scoreBar").append(
			$(yoodoo.e("div")).css({
				width:percentage+"%",
				background:yoodooStyler.rgbToHex(col)
			})
		);
	},
	drawTable:function(ids) {
		var managerColumnhead=$(yoodoo.e("div")).addClass('thead');
		var managerColumnbody=$(yoodoo.e("div"));
		var managerColumn=$(yoodoo.e("div")).addClass('managerColumn').append(managerColumnhead).append($(yoodoo.e("div")).addClass("tbody").append(managerColumnbody));
		var keyQuestionColumnhead=$(yoodoo.e("div")).addClass('thead');
		var keyQuestionColumnbody=$(yoodoo.e("div"));
		var keyQuestionColumn=$(yoodoo.e("div")).addClass('keyQuestionColumn').append(keyQuestionColumnhead).append($(yoodoo.e("div")).addClass("tbody").append(keyQuestionColumnbody));
		var table=$(yoodoo.e("div")).addClass('table').append(managerColumn).append(keyQuestionColumn);
		var managerName=[];
		
		keyQuestionColumnbody.bind("scroll",function() {
			managerColumnbody.get(0).scrollTop=this.scrollTop;
			keyQuestionColumnhead.get(0).scrollLeft=this.scrollLeft;
		});
		for(var id in ids) {
			managerName.push({name:this.managerIds[id].name,object:this.managerIds[id]});
		}
//		for(var n in this.managerTypeNames) managerName.push({name:n,id:this.managerTypeNames[n].id});
		managerName.sort(function(a,b) {
			a=a.name.toLowerCase();
			b=b.name.toLowerCase();
			if (a<b) return -1;
			if (a>b) return 1;
			return 0;
		});
		var kqName=[];
		for(var k in this.keyQuestionOrder) kqName.push(this.keyQuestionOrder[k].displayName());
		managerColumnhead.append($(yoodoo.e("div")).html("Location"));
		for(var i in kqName) {
			keyQuestionColumnhead.append($(yoodoo.e("div")).html(kqName[i]));
		}
//console.log(ids,managerName);
		var parentmanager=null;
		for(n in managerName) {
			var manager=managerName[n].object;
			if (parentmanager===null && manager.parent!==null) parentmanager=manager.parent;
//			var mid=managerName[n].id;
//console.log(mid);
//			if (ids[mid]!==undefined && this.managerIds[mid]!==undefined) {
//console.log(this.managerIds[mid]);
				var tr=$(yoodoo.e("div"));
				(function() {
					var thisManager=manager;
					if (manager.managers!==null) {
						managerColumnbody.append($(yoodoo.e("div")).append(
							$(yoodoo.e("button")).attr("type","button").html(manager.name).click(function() {
								thisManager.draw();
							})
						));
					}else{
						managerColumnbody.append($(yoodoo.e("div")).html(manager.name));
					}
				})();
				var record=manager.keyQuestion;
				var scores=manager.getScores();
				//console.log(scores,record,manager);
				for(var i in kqName) {
					var nom=kqName[i];
					var td=$(yoodoo.e("div")).addClass("result");
					if (typeof(record)!="undefined") {
//console.log(record[nom]);
						if (record[nom]===undefined) {
							td.addClass("noResult").append(
								kloe_overview.drawScore(0)
							);
						}else{
							td.append(
								kloe_overview.drawScore(Math.round(100*record[nom].Score))
							);
							if (record[nom].Immediate>0 || record[nom].Expired>0) {
								//td.addClass("Immediate");
								var immediate=null;
								if (record[nom].Immediate>0) {
									immediate=$(yoodoo.e("span")).addClass("warningCount").html(record[nom].Immediate).css({background:'#'+this.colours.red});
									yoodoo.bubble(immediate.get(0),record[nom].Immediate+' response'+(record[nom].Immediate==1?' ':'s ')+'are in need of attention');
								}
								var expired=null;
								if (record[nom].Expired>0) {
									expired=$(yoodoo.e("span")).addClass("expired").html('+'+record[nom].Expired).css({'border-color':'#'+this.colours.red,color:'#'+this.colours.red});
									yoodoo.bubble(expired.get(0),record[nom].Expired+' response'+(record[nom].Expired==1?' has expired and is':'s have expired and are')+' in need of attention');
								}
								td.append(
									$(yoodoo.e("span")).addClass("Immediate").append(immediate).append(expired).prepend(
										this.icon(this.icons.cross,20,20,100,100,{'4D4D4D':this.colours.red})
									)
								);
							}
							if (record[nom].Imminent>0) {
								var imminent=$(yoodoo.e("span")).addClass("warningCount").html(record[nom].Imminent).css({background:'#'+this.colours.amber});
								yoodoo.bubble(imminent.get(0),record[nom].Imminent+' response'+(record[nom].Imminent==1?' is':'s are')+' going to expire in the next week');
								td.append(
									$(yoodoo.e("span")).addClass("Imminent").append(imminent).prepend(
										this.icon(this.icons.warning,20,20,100,100,{'4D4D4D':this.colours.amber})
									)
								);
							}
							if (record[nom]['Live Action Plans']>0) {
								var ap=$(yoodoo.e("span")).addClass("warningCount").html(record[nom]['Live Action Plans']).css({background:'#'+this.colours.cyan});
								yoodoo.bubble(ap.get(0),record[nom]['Live Action Plans']+' Live Action Plan'+(record[nom]['Live Action Plans']==1?'':'s'));
								td.append(
									$(yoodoo.e("span")).addClass("Imminent").append(ap).prepend(
										this.icon(this.icons.walking,20,20,100,100,{'4D4D4D':this.colours.cyan})
									)
								);
								//td.append(record[nom]['Live Action Plans']+' Live Action Plans').addClass("liveActionPlans");
							}else if (record[nom]['Action Plans']>0) {
								//td.append(record[nom]['Action Plans']+' Action Plans').addClass("ActionPlans");
							}
						}
					}else{
						if (scores[nom]===undefined) {
							td.addClass("noResult");
						}else{
							td.append(
								kloe_overview.drawScore(Math.round(100*scores[nom].Score))
							);
							if (scores[nom].Immediate>0 || scores[nom].Expired>0) {
								var expired=null;
								if (scores[nom].Expired>0) {
									expired=$(yoodoo.e("span")).addClass("expired").html('+'+scores[nom].Expired).css({'border-color':'#'+this.colours.red,color:'#'+this.colours.red});
									yoodoo.bubble(expired.get(0),scores[nom].Expired+' location'+(scores[nom].Expired==1?' has ':'s have ')+'one or more responses that have expired and are in need of attention');
								}
								var immediate=null;
								if (scores[nom].Immediate>0) {
									immediate=$(yoodoo.e("span")).addClass("warningCount").html(scores[nom].Immediate).css({background:'#'+this.colours.red});
									yoodoo.bubble(immediate.get(0),scores[nom].Immediate+' location'+(scores[nom].Immediate==1?' has':'s have')+' one or more responses that are in need of attention');
								}
								td.append(
									$(yoodoo.e("span")).addClass("Immediate").append(immediate).append(expired).prepend(
										this.icon(this.icons.cross,20,20,100,100,{'4D4D4D':this.colours.red})
									)
								);
							}
							if (scores[nom].Imminent>0) {
								var imminent=$(yoodoo.e("span")).addClass("warningCount").html(scores[nom].Imminent).css({background:'#'+this.colours.amber});
								yoodoo.bubble(imminent.get(0),scores[nom].Imminent+' location'+(scores[nom].Imminent==1?' has':'s have')+' one or more responses that are going to expire in the next week');
								td.append(
									$(yoodoo.e("span")).addClass("Imminent").append(imminent).prepend(
										this.icon(this.icons.warning,20,20,100,100,{'4D4D4D':this.colours.amber})
									)
								);
							}
						}
					}
					tr.append(td);
				}
				keyQuestionColumnbody.append(tr);
		//	}
		}
		//table.append(tablehead).append(tablebody);
		/*if (parentmanager!==null) {
			tablehead.find('th').first().prepend(
				$(yoodoo.e("button")).attr("type","button").append(
					yoodoo.icons.get('back',20,20)
				).click(function() {
					parentmanager.draw();
				})
			);
		}*/
		return table;
	},
	managerIds:{},
	managerObject:function(obj,parent) {
		this.id=obj.id;
		this.name=obj.name;
		this.gotResults=false;
		this.parent=(typeof(parent)!="undefined")?parent:null;
		this.managers=null;
		if (obj.subManagers!==undefined && obj.subManagers instanceof Array) {
			for(var m in obj.subManagers) {
				if (this.managers===null) this.managers={};
				this.managers[obj.subManagers[m].id]=new kloe_overview.managerObject(obj.subManagers[m],this);
			}
		}
		kloe_overview.managerIds[this.id]=this;
		kloe_overview.managerTypeNames[this.name]=this;
		this.scores={};
		this.getScores=function() {
			for(var id in kloe_overview.keyQuestions) this.scores[kloe_overview.keyQuestions[id].displayName()]={
				Immediate:0,
				Imminent:0,
				Expired:0,
				Score:0,
				Count:0
			};
			for(var id in this.managers) {
				var scores=this.managers[id].getScores();
				for(var kqId in scores) {
					this.scores[kqId].Immediate+=(scores[kqId].Immediate>0)?1:0;
					this.scores[kqId].Imminent+=(scores[kqId].Imminent>0)?1:0;
					this.scores[kqId].Expired+=(scores[kqId].Expired>0)?1:0;
					this.scores[kqId].Score+=scores[kqId].Score;
					//this.scores[kqId].Count+=scores[kqId].Count;
					this.scores[kqId].Count++;
				}
			}
			for(var id in kloe_overview.keyQuestions) {
				var nom=kloe_overview.keyQuestions[id].displayName();
				if (this.gotResults===true) {
					//console.log(this.keyQuestion);
					if (this.keyQuestion[nom]!==undefined) {
//this.keyQuestion[nom].Imminent++;
						if (this.keyQuestion[nom].Immediate>0) this.scores[nom].Immediate++;
						if (this.keyQuestion[nom].Imminent>0) this.scores[nom].Imminent++;
						if (this.keyQuestion[nom].Expired>0) this.scores[nom].Expired++;
						if (this.keyQuestion[nom].Score>0) this.scores[nom].Score+=this.keyQuestion[nom].Score;
					}
					this.scores[nom].Count++;
//console.log(nom,this.scores[nom]);
				}
//console.log(this.scores[nom]);
			}
			for(var nom in this.scores) {
				//console.log(nom,this.scores[nom].Score);
				if (this.scores[nom].Count>0) this.scores[nom].Score/=this.scores[nom].Count;
			}
			return this.scores;
		};
		this.draw=function() {
			var table=$(yoodoo.e("div")).addClass('reportDiv').append(kloe_overview.drawTable(this.managers));
			//if (this.parent!==null) {
			//	var parentmanager=this.parent;
			var me=this;
				var but=$(yoodoo.e("button")).attr("type","button").attr("disabled","disabled").html(this.name).prepend(
					//yoodoo.icons.get('back',14,14)
				).click(function() {
					$(this).nextAll("button").remove();
					$(this).remove();
					me.draw();
				});
				kloe_overview.containers.breadcrumb.append(
					but
				);
				but.prevAll("button").each(function(i,e) {
					e.disabled=false;
				});
			//}
			kloe_overview.containers.arena.append(table.hide());
			var prevTables=table.prevAll(".reportDiv").slideUp(function() {
				$(this).remove();
			});
			table.slideDown();
		};
	},
	manager:null,
	loadManagers:function() {
		
		
		this.manager=new this.managerObject(yoodoo.user.managerType);
	}
};
