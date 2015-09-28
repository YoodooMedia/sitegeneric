yoodoo.keyQuestion={
	object:null,
	informationObject:null,
	keyLinesObject:null,
	voiceoverObject:null,
	voiceovers:{},
	keyLinesByKeyQuestion:{},
	promptsObject:null,
	prompts:{},
	records:null,
	ready:[],
	started:false,
	selected:null,
	infoByKeyQuestion:{},
	init:function() {
		var me=this;
		this.started=true;
		yoodoo.object.getView(73,null,function(view) {
			var kqIds=[];
			for(var r in view.results) {
				if (view.results[r].columns[1]>0 && view.results[r].columns[2]>0) kqIds.push(view.results[r].columns[2]);
			}
			yoodoo.object.get('KLOE Key Questions',function(obj) {
				me.object=obj.shift();
				me.object.get(function(list){
					me.records=[];
					for(var l in list) me.records.push(list[l]);
					me.records.sort(function(a,b) {
						if (a.value.qviof<b.value.qviof) return -1;
						if (a.value.qviof>b.value.qviof) return 1;
						return 0;
					});
					for(var r in me.ready) {
						me.ready[r](me.object.recordsCache[me.selected]);
					}
					me.ready=[];
				},function(){},0,{},kqIds);
			},function(){},false);
		});
	},
	clear:function(callback) {
		this.records=null;
		this.prompts={};
		this.keyLinesByKeyQuestion={};
		this.started=false;
		this.infoByKeyQuestion={};
		var me=this;
		this.ready=[function() {
			me.select(callback,me.selected);
		}];
	},
	get:function(callback) {
		var me=this;
		if (this.records===null) {
			this.ready.push(function() {
				callback(me.records);
			});
			if (this.started===false) this.init();
		}else{
			callback(this.records);
		}
	},
	select:function(callback,id) {
		if (id>0) {
			this.selected=id;
			var me=this;
			var loaded=function(record) {
				if (typeof(record)=="undefined") {
					me.selected==null;
					callback(false);
				}else{
					callback(record);
				}
			};
			if (this.object===null) {
				this.ready.push(loaded);
				if (this.started===false) this.init();
			}else{
				loaded(this.object.recordsCache[this.selected]);
			}
		}else{
			callback(false);
		}
	},
	performTagging:function() {
		var record=this.object.recordsCache[this.selected];
		if (typeof(record)!="undefined" && typeof(record.value.dsrme)=="string"  && record.value.dsrme!="") {
			var newTag=record.value.dsrme.replace(/ /g,'_');
			if (!yoodoo.hasTag(newTag)) {
				for(var k in this.records) {
					if (this.records[k].Id!=this.selected && typeof(this.records[k].value.dsrme)=="string"  && this.records[k].value.dsrme!="") {
						dooit.removeTag(this.records[k].value.dsrme.replace(/ /g,'_'));
					}
				}
				dooit.addTag(newTag);
			}
		}
	},
	open:function(id) {
		this.select(function(keyQuestion) {
			if (keyQuestion!==false) yoodoo.bookcase.showIntervention(keyQuestion.value.zpaqd);
		},id);
	},
	getSelected:function() {
		if (this.selected===null) return false;
		if (this.object.recordsCache[this.selected]===undefined) {
			this.selected=null;
			return false;
		}
		return this.object.recordsCache[this.selected];
	},
	getSelectedInformation:function(callback) {
		if (this.selected===null) return false;
		var me=this;
		var fetch=function() {
			if (me.infoByKeyQuestion[yoodoo.businessSector.selectedBusinessSector]!==undefined && me.infoByKeyQuestion[yoodoo.businessSector.selectedBusinessSector][me.selected]!==undefined) {
				callback(me.infoByKeyQuestion[yoodoo.businessSector.selectedBusinessSector][me.selected]);
			}else{
				me.informationObject.get(function(list) {
					if (me.infoByKeyQuestion[yoodoo.businessSector.selectedBusinessSector]===undefined) me.infoByKeyQuestion[yoodoo.businessSector.selectedBusinessSector]={};
					for(var l in list) {
						me.infoByKeyQuestion[yoodoo.businessSector.selectedBusinessSector][list[l].value.ufwrl]=list[l];
					}
					callback(me.infoByKeyQuestion[yoodoo.businessSector.selectedBusinessSector][me.selected]);
				},function(){},0,{
					ufwrl:me.selected,
					zfyit:yoodoo.businessSector.selectedBusinessSector
				});
			}
		};
		if (this.informationObject===null) {
			yoodoo.object.get('KLOE Key Question Display Information',function(objs) {
				me.informationObject=objs.shift();
				fetch();
			},function(){});
		}else{
			fetch();
		}
	},
	getKeyLines:function(callback,keyQuestionOrAll,doNotSelect) {
		var me=this;
		//console.log(keyQuestionOrAll);
		if (me.selected>0 || (keyQuestionOrAll===true || keyQuestionOrAll instanceof Array) || (typeof(keyQuestionOrAll)!="undefined" &&  doNotSelect===true)) {
			var processLines=function(lines) {
				var linesToKey=me.keyLinesObject.getParameterReferingToObjectId(me.object.schema.Id);
				var bsid=yoodoo.businessSector.selectedBusinessSector;
				
				if (me.keyLinesByKeyQuestion[bsid]===undefined) me.keyLinesByKeyQuestion[bsid]={};
				for(var r in lines) {
					var kqid=lines[r].value[linesToKey];
					if (kqid>0) {
						if (me.keyLinesByKeyQuestion[bsid][kqid]===undefined) me.keyLinesByKeyQuestion[bsid][kqid]=[];
						me.keyLinesByKeyQuestion[bsid][kqid].push(lines[r]);
					}
				}
				for(var kqid in me.keyLinesByKeyQuestion[bsid]) {
					me.keyLinesByKeyQuestion[bsid][kqid].sort(function(a,b) {
						if (a.displayName()<b.displayName()) return -1;
						if (a.displayName()>b.displayName()) return 1;
						return 0;
					});
				}
			};
			var fetchLines=function(keyQuestion) {
				if (keyQuestion===true) {
					keyQuestion=[];
						//console.log(me.records);
					for(var k in me.records) {
						//console.log(me.records[k]);
						if (me.keyLinesByKeyQuestion[yoodoo.businessSector.selectedBusinessSector]===undefined || me.keyLinesByKeyQuestion[yoodoo.businessSector.selectedBusinessSector][me.records[k].Id]===undefined) keyQuestion.push(me.records[k].Id);
					}
					if (keyQuestion.length==0) keyQuestion=true;
				}
				if (typeof(keyQuestion)=="undefined" && me.selected>0) keyQuestion=me.selected;
				//console.log(keyQuestion);
				if (keyQuestion!==true && (keyQuestion instanceof Array || me.keyLinesByKeyQuestion[yoodoo.businessSector.selectedBusinessSector]===undefined || (!isNaN(keyQuestion) &&  me.keyLinesByKeyQuestion[yoodoo.businessSector.selectedBusinessSector][keyQuestion]===undefined))) {
					var linesToSector=me.keyLinesObject.getParameterReferingToObjectId(yoodoo.businessSector.object.schema.Id);
					var linesToKey=me.keyLinesObject.getParameterReferingToObjectId(me.object.schema.Id);
					var filter={};
					var cont=true;
					filter[linesToSector]=yoodoo.businessSector.selectedBusinessSector;
					if (typeof(keyQuestion)=="undefined") {
						filter[linesToKey]=me.selected;
					}else if (keyQuestion>0) {
						filter[linesToKey]=keyQuestion;
					}else if (keyQuestion.Id>0) {
						filter[linesToKey]=keyQuestion.Id;
					}else if (keyQuestion instanceof Array) {
						if (keyQuestion.length) {
							filter[linesToKey]=[keyQuestion.join(","),'in'];
						}else{
							cont=false;
						}
					}else if (me.selected>0) {
						filter[linesToKey]=me.selected;
					}else{
						cont=false;
						callback(false);
					}
					if (cont) {
						//console.log(filter);
						me.keyLinesObject.get(function(lines){
							processLines(lines);
							//console.log(me.keyLinesByKeyQuestion[yoodoo.businessSector.selectedBusinessSector]);
							if (keyQuestion>0) {
								callback(me.keyLinesByKeyQuestion[yoodoo.businessSector.selectedBusinessSector][keyQuestion]);
							}else{
								callback(me.keyLinesByKeyQuestion[yoodoo.businessSector.selectedBusinessSector]);
							}
						},function(){},0,filter);
					}else{
						if (keyQuestion>0) {
							callback(me.keyLinesByKeyQuestion[yoodoo.businessSector.selectedBusinessSector][keyQuestion]);
						}else{
							callback(me.keyLinesByKeyQuestion[yoodoo.businessSector.selectedBusinessSector]);
						}
					}
				}else if (keyQuestion===true) {
						callback(me.keyLinesByKeyQuestion[yoodoo.businessSector.selectedBusinessSector]);
				}else{
					//console.log(callback,me.keyLinesByKeyQuestion[yoodoo.businessSector.selectedBusinessSector],keyQuestion);
					callback(me.keyLinesByKeyQuestion[yoodoo.businessSector.selectedBusinessSector][keyQuestion]);
				}
			};
			var next=function(keyQuestion) {
				if (me.keyLinesObject===null) {
					yoodoo.object.get("KLOE Key Question Lines of Enquiry",function(obj) {
						me.keyLinesObject=obj.shift();
						fetchLines(keyQuestion);
						//processLines();
						//callback(me.keyLinesByKeyQuestion[yoodoo.businessSector.selectedBusinessSector][me.selected]);
					},function(){},false)
				}else{
					fetchLines(keyQuestion);
					//callback(me.keyLinesByKeyQuestion[yoodoo.businessSector.selectedBusinessSector][me.selected]);
				}
			};
			if (doNotSelect!==true) {
				if (yoodoo.businessSector.selectedBusinessSector>0) {
					if (keyQuestionOrAll!==true && keyQuestionOrAll>0) {
						me.select(next,keyQuestionOrAll);
					}else{
						next(keyQuestionOrAll);
					}
				}else{
					yoodoo.businessSector.check(function() {
						if (keyQuestionOrAll!==true && keyQuestionOrAll>0) {
							me.select(next,keyQuestionOrAll);
						}else{
							next(keyQuestionOrAll);
						}
					});
				}
			}else{
				yoodoo.businessSector.check(function() {
					next(keyQuestionOrAll);
				});
			}
		}else{
			return false;
		}
	},
	getPrompts:function(callback,all) {
		var me=this;
		if (me.selected>0 || all===true || all>0) {
			var params=[];
			
			params.push(function() {
				var fetch=function() {
						var promptsToSector=me.promptsObject.getParameterReferingToObjectId(yoodoo.businessSector.object.schema.Id);
						var promptsToKey=me.promptsObject.getParameterReferingToObjectId(me.object.schema.Id);
						var filter={};
						filter[promptsToSector]=yoodoo.businessSector.selectedBusinessSector;
						var cont=true;
						var selected=(all!==true && all>0)?all:me.selected;
						if (all===true) {
							var kqids=[];
							for(var k in me.records) {
								var kqid=me.records[k].Id;
								if (me.prompts[yoodoo.businessSector.selectedBusinessSector]===undefined || me.prompts[yoodoo.businessSector.selectedBusinessSector][kqid]===undefined) {
									kqids.push(kqid);
								}
							}
							if (kqids.length>0) {
								filter[promptsToKey]=[kqids.join(","),'in'];
							}else{
								cont=false;
								callback(me.prompts[yoodoo.businessSector.selectedBusinessSector]);
							}
						}else if (selected>0 && (me.prompts[yoodoo.businessSector.selectedBusinessSector]===undefined || me.prompts[yoodoo.businessSector.selectedBusinessSector][selected]===undefined)) {
							filter[promptsToKey]=selected;
						}else{
							cont=false;
						}
						if (cont) {
							//console.log(filter);
							me.promptsObject.get(function(list) {
								if (me.prompts[yoodoo.businessSector.selectedBusinessSector]===undefined) me.prompts[yoodoo.businessSector.selectedBusinessSector]={};
								if (selected!==null && me.prompts[yoodoo.businessSector.selectedBusinessSector][selected]===undefined) me.prompts[yoodoo.businessSector.selectedBusinessSector][selected]=[];
								list.sort(function(a,b) {
									if (a.displayName()<b.displayName()) return -1;
									if (a.displayName()>b.displayName()) return 1;
									return 0;
								});
								for(var l in list) {
									var kqid=list[l].value[promptsToKey];
									if (me.prompts[yoodoo.businessSector.selectedBusinessSector][kqid]===undefined) me.prompts[yoodoo.businessSector.selectedBusinessSector][kqid]=[];
									me.prompts[yoodoo.businessSector.selectedBusinessSector][kqid].push(list[l]);
								}
								if (all===true) {
									callback(me.prompts[yoodoo.businessSector.selectedBusinessSector]);
								}else{
									callback(me.prompts[yoodoo.businessSector.selectedBusinessSector][selected]);
								}
							},function(){},0,filter);
						}else if (all===true) {
							callback(me.prompts[yoodoo.businessSector.selectedBusinessSector]);
						}else{
							callback(me.prompts[yoodoo.businessSector.selectedBusinessSector][selected]);
						}
				};
				me.getPromptsObject(function() {
					fetch();
				});
			});
			if (all===true) {
				var kq=[];
				for(var r in this.records) {
					if (this.keyLinesByKeyQuestion[yoodoo.businessSector.selectedBusinessSector]===undefined || this.keyLinesByKeyQuestion[yoodoo.businessSector.selectedBusinessSector][this.records[r].Id]===undefined) kq.push(this.records[r].Id);
				}
				if (kq.length>0) {
					params.push(kq);
					params.push(true);
					this.getKeyLines.apply(this,params);
				}else{
					params[0]();
				}
			}else if (all>0) {
				params.push(all);
				params.push(true);
				this.getKeyLines.apply(this,params);
			}else{
				this.getKeyLines.apply(this,params);
			}
		}else{
			return false;
		}
	},
	getPromptsObject:function(callback) {
		var me=this;
		if (this.promptsObject===null) {
			yoodoo.object.get('KLOE Prompts',function(obj) {
				me.promptsObject=obj.shift();
				callback(me.promptsObject);
			},function(){},false);
		}else{
			callback(me.promptsObject);
		}
	},
	getPromptsInKeyLines:function(callback,all) {
		var me=this;
		var next=function(list) {
			//console.log(list);
			me.getPrompts(function(prompts) {
			//console.log(prompts);
				var promptToKeyLine=me.promptsObject.getParameterReferingToObjectId(me.keyLinesObject.schema.Id);
				var toSort={};
				if (all===true) {
					for(var p in me.keyLinesObject.recordsCache) me.keyLinesObject.recordsCache[p].items=[];
					for(var k in prompts) {
						for(var p in prompts[k]) {
							var klid=prompts[k][p].value[promptToKeyLine];

							if (me.keyLinesObject.recordsCache[klid]!==undefined && (me.keyLinesObject.recordsCache[klid].itemIds===undefined || me.keyLinesObject.recordsCache[klid].itemIds[prompts[k][p].Id]===undefined)) {
								toSort[klid]=me.keyLinesObject.recordsCache[klid];
								if (me.keyLinesObject.recordsCache[klid].items===undefined) me.keyLinesObject.recordsCache[klid].items=[];
								if (me.keyLinesObject.recordsCache[klid].itemIds===undefined) me.keyLinesObject.recordsCache[klid].itemIds={};
								me.keyLinesObject.recordsCache[klid].items.push(prompts[k][p]);
								me.keyLinesObject.recordsCache[klid].itemIds[prompts[k][p].Id]=prompts[k][p];
							}
						}
					}
				}else{
					for(var p in prompts) {
						var klid=prompts[p].value[promptToKeyLine];

						if (me.keyLinesObject.recordsCache[klid]!==undefined && (me.keyLinesObject.recordsCache[klid].itemIds===undefined || me.keyLinesObject.recordsCache[klid].itemIds[prompts[p].Id]===undefined)) {
		//console.log(me.keyLinesObject.recordsCache[klid].value.vaiqs);
							toSort[klid]=me.keyLinesObject.recordsCache[klid];
							if (me.keyLinesObject.recordsCache[klid].items===undefined) me.keyLinesObject.recordsCache[klid].items=[];
							if (me.keyLinesObject.recordsCache[klid].itemIds===undefined) me.keyLinesObject.recordsCache[klid].itemIds={};
							me.keyLinesObject.recordsCache[klid].items.push(prompts[p]);
							me.keyLinesObject.recordsCache[klid].itemIds[prompts[p].Id]=prompts[p];
						}
					}
				}
				for(var klid in toSort) {
					if (toSort[klid].items instanceof Array) {
						toSort[klid].items.sort(function(a,b) {
										if (a.displayName()<b.displayName()) return -1;
										if (a.displayName()>b.displayName()) return 1;
										return 0;
									});
					}
				}
				if (all===true) {
					callback(me.keyLinesByKeyQuestion[yoodoo.businessSector.selectedBusinessSector]);
				}else if (all>0) {
					callback(me.keyLinesByKeyQuestion[yoodoo.businessSector.selectedBusinessSector][all]);
				}else{
					callback(me.keyLinesByKeyQuestion[yoodoo.businessSector.selectedBusinessSector][me.selected]);
				}
			},all);
		};
		var params=[function(list) {
			next(list);
		}];
		if (all===true) {
			params.push(all);
		}else if (all>0) {
			params.push(all);
		}
		params.push(true);
		//console.log(params);
		me.getKeyLines.apply(this,params);
	},
	getVoiceovers:function(callback) {
		if (this.getSelected()!==false) {
			var me=this;
			var fetch=function() {
				if (me.voiceovers[yoodoo.businessSector.selectedBusinessSector]!==undefined && me.voiceovers[yoodoo.businessSector.selectedBusinessSector][me.selected]!==undefined) {
					callback(me.voiceovers[yoodoo.businessSector.selectedBusinessSector][me.selected]);
				}else{
					var voiceToKey=me.voiceoverObject.getParameterReferingToObjectId(me.object.schema.Id);
					var voiceToBusiness=me.voiceoverObject.getParameterReferingToObjectId(yoodoo.businessSector.object.schema.Id);
					var filter={};
					filter[voiceToKey]=me.selected;
					filter[voiceToBusiness]=yoodoo.businessSector.selectedBusinessSector;
					me.voiceoverObject.get(function(list) {
						for(var l in list) {
							if (me.voiceovers[list[l].value[voiceToBusiness]]===undefined) me.voiceovers[list[l].value[voiceToBusiness]]={};
							 me.voiceovers[list[l].value[voiceToBusiness]][list[l].value[voiceToKey]]=list[l];
						}
						callback(me.voiceovers[yoodoo.businessSector.selectedBusinessSector][me.selected]);
					},function(){},0,filter);
				}
			};
			if (this.voiceoverObject===null) {
				yoodoo.object.get('KLOE Voiceovers',function(objs) {
					me.voiceoverObject=objs.shift();
					fetch();
				},function() {});
			}else{
				fetch();
			}
		}
	}
};

// yoodoo.keyQuestion.select(function(){},19)

// yoodoo.keyQuestion.getKeyLines(function(reply){console.log(reply);})