/*
{
 dependencies:[
  ['dooits/kloe_threads.js',false],
  ['dooits/compliance/kloe_response.js',true],
  ['css/kloe_threads.css',false]
 ],
 dooit:'kloe_threads',
 options:{
	kloe_response_object:{
		type:'object',
		title:'Object name for the Responses',
		value:6
	},
	kloe_evidence_object:{
		type:'object',
		title:'Object name for the Evidence',
		value:6
	},
	kloe_actionplan_object:{
		type:'object',
		title:'Object name for the Action Plans',
		value:6
	},
	prompt_linkage_complete:{
		type:'object',
		title:'Object for the Prompt linkage completion',
		value:6
	},
	prompt_linkage:{
		type:'object',
		title:'Object for the Prompt linkage',
		value:10
	},
	prompt_links:{
		type:'object',
		title:'Object for the Prompt links',
		value:11
	},
      prompt_object:{  
         type:'object',
         title:'Object for the Prompts',
         value:6
      }
 }
}
*/

var kloe_threads = {
	objects:{},
	responsesByPrompt:{},
	currentLinkage:null,
	business_sector:null,
	start: function() {
		var me=this;
		this.containers.linkage_selection=$(yoodoo.e("div")).addClass('linkage_selection on loading');
		this.containers.linkage_editor=$(yoodoo.e("div")).addClass('linkage_editor').bind("click",function() {
			me.containers.linkage_selection.removeClass("on");
		});;
		
		
		this.containers.container.append(
			this.containers.linkage_editor
		).append(
			this.containers.linkage_selection.append(
				$(yoodoo.e("button")).attr("type","button").click(function() {
					if ($(this).parent().hasClass("on")) {
						$(this).parent().removeClass("on");
					}else{
						$(this).parent().addClass("on");
					}
				})
			).append(
				$(yoodoo.e("div")).addClass("selection_editor")
			)
		);
		//console.log("start");
	},
	failed:function(txt) {
		console.log(txt);
	},
	warningId:null,
	displayed: function() {
		var arr=[
			dooit.options.prompt_linkage_complete.value,
			dooit.options.prompt_linkage.value,
			dooit.options.prompt_links.value,
			dooit.options.kloe_response_object.value,
			dooit.options.kloe_evidence_object.value,
			dooit.options.kloe_actionplan_object.value,
			dooit.options.prompt_object.value
		];
		var me=this;

		var step6=function() {
			console.log("Got objects");
			me.ready();
		};

		var step3=function(idList) {
			var filter={};
			var linksToLinkages=me.objects.linkage_complete.getParameterReferingToObjectId(me.objects.linkage.schema.Id);
			filter[linksToLinkages]=[idList.join(','),'in'];
			me.objects.linkage_complete.get(function(list) {
				me.completeLinkages=list;
				for(var c in me.completeLinkages) {
					var lid=me.completeLinkages[c].value[linksToLinkages];
					if (me.linkagesIds[lid]!==undefined) me.linkagesIds[lid].assignCompletion(me.completeLinkages[c]);
				}
				step6();
			},function(){
				me.failed('Failed to fetch completion for linkages');
			},0,filter);
		};

		var step2=function() {
			var filter={};
			filter[me.objects.linkage.getParameterReferingToObjectId(yoodoo.businessSector.object.schema.Id)]=me.business_sector;
			filter.alsrj=true;
			filter.qepsf=true;
			me.objects.linkage.get(function(list) {
				me.linkages=[];
				me.linkagesIds={};
				for(var l in list) {
					var link=new me.linkage_item(list[l]);
					me.linkages.push(link);
					me.linkagesIds[list[l].Id]=link;
				}
				var ids={};
				for(var l in list) ids[list[l].Id]=true;
				var idList=[];
				for(var id in ids) idList.push(id);
				step3(idList);
			},function(){
				me.failed('Failed to fetch linkage');
			},0,filter);
		};

		yoodoo.keyQuestion.getPromptsObject(function(obj) {
			yoodoo.object.get(arr,function(list) {
				if (list.length>=4) {
					me.objects.linkage_complete=(list.length>0)?list.shift():null;
					me.objects.linkage=(list.length>0)?list.shift():null;
					me.objects.links=(list.length>0)?list.shift():null;
					me.objects.response=(list.length>0)?list.shift():null;
					me.objects.evidence=(list.length>0)?list.shift():null;
					me.objects.actionplan=(list.length>0)?list.shift():null;
					me.objects.prompts=(list.length>0)?list.shift():null;
					/*if (kloe_response.status===undefined) {
						yoodoo.kloeStatus.getWarning(function(warning) {
							kloe_response.status=me.objects.status;
						});
					}*/
					yoodoo.kloeStatus.getWarning(function(warning) {
						me.warningId=warning.Id
						yoodoo.businessSector.check(function(bs) {
							me.business_sector=bs.Id;
							step2();
						});
					});
				}else{
					me.failed('Failed to fetch the 7 main objects');
				}
			},function(){
				me.failed('Failed to fetch the 7 main objects');
			});
		});
	},
	ready:function() {
		this.containers.linkage_selection.append(this.linkage_selector()).removeClass("loading");
	},
	linkage_selector:function() {
		if (this.linkage_selector_div===undefined) this.linkage_selector_div=$(yoodoo.e("div")).addClass("linkage_selector_div");
		var me=this;
		this.linkage_selector_div.empty();
		this.linkages.sort(function(a,b) {
			if (b.completionRecord===null && a.completionRecord!==null) return 1;
			if (a.completionRecord===null && b.completionRecord!==null) return -1;
			if (b.object.updated>a.object.updated) return 1;
			if (a.object.updated>b.object.updated) return -1;
			return 0;
		});
		for(var l in this.linkages) {
			var but=this.linkages[l].render();
			this.linkage_selector_div.append(but);
		}
		
		return this.linkage_selector_div;
	},
	drawPrompts:function(selectedIds) {
		//console.log(selectedIds);
		var d=$(yoodoo.e("div")).addClass("promptSelector");
			//console.log(this.containers.container);
		for(var p in this.prompts) {
			var pd=yoodoo.e("div");
			pd.id=this.prompts[p].Id;
			pd.prompt=this.prompts[p];
			d.append($(pd).addClass("promptDragger").html(this.prompts[p].value.lvzfz).draggable({
				helper: "clone",
				appendTo:this.containers.container,
				revert:'invalid'
			}).css({
				display:(selectedIds[this.prompts[p].Id]===true)?'none':'block'
			}));
			
		}
		this.containers.prompt_list.empty().append(d);
	},
	linkages:[],
	linkage_item:function(obj) {
		this.object=obj;
		//if (!(this.object.value.ypiyt>0)) this.object.value.ypiyt=dooit.options.business_sector.value;
		//if (!(this.object.value.fsuoh>0)) this.object.value.fsuoh=yoodoo.formatDate('Y-m-d',new Date());
		this.links=null;
		this.promptById={};
		this.responsesByPrompt={};
		this.linksByTo={};
		this.viewedPages={};
		var me=this;
		this.completionRecord=null;
		this.render=function() {
			this.button=$(yoodoo.e("button"));
			this.container=$(yoodoo.e("div")).addClass("linkage_item").append(
				this.button.attr("type","button").addClass("linkage_button").html(obj.displayName()).append(
					$(yoodoo.e("div")).append(
						yoodoo.ago(this.object.updated)
					)
				).click(
					function() {
						if (kloe_threads.currentLinkage!==null) kloe_threads.currentLinkage.complete();
						kloe_threads.currentLinkage=me;
						kloe_threads.containers.linkage_selection.removeClass("on");
						kloe_threads.containers.linkage_editor.fadeOut(function() {
							$(this).empty().append(me.display()).fadeIn();
						});
					}
				).append(
					(typeof(obj.value.hitph)=="string" && obj.value.hitph!="")?
					$(yoodoo.e("div")).addClass("linkage_description").html(obj.value.hitph):null
				)
			);

			if (this.completionRecord!==null) {
				var className="completion";
				var txt='Completed by '+((this.completionRecord.owner.nickname!='')?this.completionRecord.owner.nickname:this.completionRecord.owner.firstname);
				if (this.completionRecord.updated<this.object.updated) {
					className+=' outOfDateCompletion';
					txt+='<em>updated since completion</em>';
				}else{
					txt+='<em>'+yoodoo.ago(this.completionRecord.updated)+'</em>';
				}
				this.button.append(
					$(yoodoo.e("div")).addClass(className).append(
						$(yoodoo.e("span")).html(txt)
					)
				);
			}
			return this.container;
		};
		this.complete=function() {
			if (this.completionRecord===null || this.completionRecord.updated<this.object.updated) {
				var pagesViewed=0;
				for(var i in this.viewedPages) pagesViewed+=(this.viewedPages[i]===true)?1:0;
//console.log(pagesViewed);
				if (pagesViewed==this.schema.length) {
					var completeToLinkages=kloe_threads.objects.linkage_complete.getParameterReferingToObjectId(kloe_threads.objects.linkage.schema.Id);
					if (this.completionRecord===null) {
						this.completionRecord=kloe_threads.objects.linkage_complete.add();
						this.completionRecord.value[completeToLinkages]=this.object.Id;
					}else{
						this.completionRecord.mustUpdate=true;
					}
//console.log(this.completionRecord);
					this.button.find('.completion').remove();
					this.button.append(
						$(yoodoo.e("div")).addClass("completion").append(
							$(yoodoo.e("span")).html('Completed by '+yoodoo.user.getName()+'<em>'+yoodoo.ago(new Date())+'</em>')
						)
					);
				}
			}
		};
		this.display=function() {
			//this.arena=new yoodoo.ui.pages({});
			//this.arena.append($(yoodoo.e("h2")).html(this.object.displayName()));
			this.arena=$(yoodoo.e("div")).addClass("linkage_input");
			//this.arena.append(this.input);
			var me=this;
			var step2=function() {
				kloe_threads.objects.prompts.get(function(list) {
					me.promptById={};
					for(var l in list) me.promptById[list[l].Id]=list[l];
					me.renderDisplay();
				},function(){},0,{},me.getPromptIds());
			};
			(function() {
				var filter={};
				filter[kloe_threads.objects.links.getParameterReferingToObjectId(kloe_threads.objects.linkage.schema.Id)]=[me.object.Id,'equals'];
				kloe_threads.objects.links.get(function(list) {
					me.assignLinks(list);
					step2();
				},function(){},0,filter)
			})();
			return this.arena;
		};
		this.renderDisplay=function() {
			this.schema=[];
			//this.schema.push(this.pageSchema(this.object.value.hitph,this.promptById[this.object.value.oetpf]));
			for(var l in this.links) {
				this.schema.push(this.pageSchema(this.links[l].value.qnkwd,this.promptById[this.links[l].value.gxtxv]));
			}
			var me=this;
			this.pageArena=$(yoodoo.e("div"));
			this.arena.append(
				$(yoodoo.e("h3")).html(this.object.displayName())
			).append(
				$(yoodoo.e("div")).html(this.object.value.hitph)
			).append(this.pageArena).css({'text-align':'center'});
			this.pageArena.css({
				height:this.arena.height()-(this.pageArena.offset().top-this.arena.offset().top),
				'text-align':'left'
			});
			this.input=new yoodoo.ui.pages({
				context:this
				,pages:this.schema,
				onchange:function() {
					me.showingPage(this);
				}
			});
			this.input.appendTo(this.pageArena);
		};
		this.showingPage=function(pages) {
			this.viewedPages[pages.page]=true;
			var obj=this.schema[pages.page];
			obj.display();
		};
		this.assignCompletion=function(completionRecord) {
			this.completionRecord=completionRecord;
		};

		this.assignLinks=function(list) {
			this.links=[];
			var promptId=this.object.value[kloe_threads.objects.linkage.getParameterReferingToObjectId(kloe_threads.objects.prompts.schema.Id)];
			if (promptId>0) {
				while(list.length>0) {
					var found=false;
					for(var l=list.length-1;l>=0;l--) {
						if (this.links.length==0) {
							if (list[l].value.lzptd==promptId && list[l].value.gxtxv==promptId) {
								var link=list.splice(l,1)[0];
								this.links.push(link);
								found=true;
								promptId=link.value.gxtxv;
							}
						}else if (list[l].value.lzptd==promptId) {
							var link=list.splice(l,1)[0];
							this.links.push(link);
							found=true;
							promptId=link.value.gxtxv;
						}
					}
					if (!found) list=[];
				}
			}
		};
		this.getPromptIds=function() {
			var ids=[];
			var promptId=this.object.value[kloe_threads.objects.linkage.getParameterReferingToObjectId(kloe_threads.objects.prompts.schema.Id)];
			if (promptId>0) {
				ids.push(promptId);
				for(var l in this.links) ids.push(this.links[l].value.gxtxv);
			}
			return ids;
		};
		this.pageSchema=function(message,prompt) {
			var me={
				index:this.schema.length,
				fetchedResponses:false,
				linkage:this,
				responses:null,
				templates:null,
				displayed:false,
				className:'linkagePage',
				prompt:prompt,
				page_title:(typeof(message)=="string")?message:''
				,key:prompt.displayName()
				,backButton:'back'
				,nextButton:'next'
				,page:null
				,prerender:function() {
					me.page=this;
				}
				,postrender:function() {
//console.log(me,this);
					me.promptcontainer=$(yoodoo.e("div")).addClass("linkagePrompt");
					me.responseList=$(yoodoo.e("div")).append(
						$(yoodoo.e("div")).addClass("waiting")
					);
					me.optionalList=$(yoodoo.e("div")).addClass("optionalResponses");
					me.promptcontainer.append(
						$(yoodoo.e("h4")).html(me.prompt.value[kloe_response.promptParameters.Name])
					).append(
						$(yoodoo.e("div")).html(me.prompt.value[kloe_response.promptParameters.Presentation][kloe_response.promptPresentionParameters.Description])
					);

					me.promptcontainer.prepend(
						$(yoodoo.e("button")).attr("type", "button").addClass("addButton").append(
							yoodoo.icons.get('add',15,15,{'4D4D4D':'FFFFFF'})
						).click(function() {
							if ($(this).prevAll(".emptyRecord").get().length == 0) me.add();
						})
					);

			var paste=$(yoodoo.e("button")).attr("type","button").addClass("clipboardPaste").click(function() {
				yoodoo.clipboard.selector(function(obj) {
					var newRecord=me.add(obj);
					if (obj.evidence!==undefined) {
						for(var e in obj.evidence) {
							var newEvidence=yoodoo.object.objectNames[kloe_response.objectName.evidence].add(obj.evidence[e]);
							newEvidence.value[kloe_response.evidenceParameters.Response]=newRecord.object;
							newRecord.evidence.attach(newEvidence);
						}
					}
					if (obj.actionPlans!==undefined) {
						for(var e in obj.actionPlans) {
							var newActionPlan=yoodoo.object.objectNames[kloe_response.objectName.actionPlans].add(obj.actionPlans[e]);
							newActionPlan.value[kloe_response.actionPlanParameters.Response]=newRecord.object;
							newRecord.actionPlans.attach(newActionPlan);
						}
					}
					newRecord.update();
				},'kloe_response');	
			});
					me.promptcontainer.prepend(paste);

					me.container=$(yoodoo.e("div")).addClass("linkageList");
					$(this.container).append($(yoodoo.e("div")).addClass("linkageArena").append(me.promptcontainer).append(me.container.append(me.responseList).append(me.optionalList)));
				}
				,display:function() {
					if (this.displayed===false) {
						if (this.fetchedResponses) {
							this.processResponses();
						}else{
							this.getResponses();
						}
						this.displayed=true;
					}
				},
				getResponses:function() {
					this.fetchedResponses=true;
					var responseToLinkage=kloe_threads.objects.response.getParameterReferingToObjectId(kloe_threads.objects.linkage.schema.Id);
					var filter={};
					filter[kloe_threads.objects.response.getParameterReferingToObjectId(kloe_threads.objects.prompts.schema.Id)]=this.prompt.Id;
					kloe_threads.objects.response.get(function(list) {
//console.log(list);
						me.responses=[];
						me.templates={};
						for(var l in list) {
							if (list[l].readonly) {
								if (list[l].value[responseToLinkage]==me.linkage.object.Id) me.templates[list[l].Id]=list[l];
							}else{
								me.responses.push(list[l]);
							}
						}
						me.processResponses();
					},function() {},0,filter);
				},
				processResponses:function() {
					if (this.fetchedResponses===true && this.responses!==null) {
						for(var r in this.responses) this.responses[r]=new kloe_response.record(this.responses[r],null,null,function() {
							console.log('deleted',arguments);
						});
						var me=this;
						kloe_response.createInherited(this.templates,this.responses,this.prompt,function(optional) {
							me.responseList.empty();
							for(var r in me.responses) me.responseList.append(me.responses[r].render());
							me.optional=optional;
							me.suggestOptional();
						});
						/*for(var r in this.responses) {
							if (this.responses[r].object.value[kloe_response.parameters.InheritedId]>0) {
								var tid=this.responses[r].object.value[kloe_response.parameters.InheritedId];
							 	if (this.templates[tid]!==undefined) {
									this.responses[r].object.inheritedResponse=this.templates[tid];
									this.responses[r].updateInherited();
									delete this.templates[tid];
								}
							}
						}*/
						/*for(var r in this.responses) this.container.append(this.responses[r].render());
						for(var tid in this.templates) {
							console.log("New",this.templates[tid]);
						}*/
//console.log($(this.page.container).height(),$(this.container).offset().top,$(this.page.container).offset().top);
						this.container.css({
							height:$(this.page.container).height()-($(this.container).offset().top-$(this.page.container).offset().top)
						});
					}
				},
				add:function(obj) {
					var newRecord=kloe_threads.objects.response.add(obj);
					newRecord.value[kloe_response.parameters.Status]=kloe_response.findStatusWarning();
					newRecord.value[kloe_response.parameters.Prompt]=this.prompt.Id;
					newRecord.value[kloe_response.parameters.BusinessSector]=this.prompt.value[kloe_response.promptParameters['Business Sector']];
					var item=new kloe_response.record(newRecord,null,false);
					this.responses.push(item);
					var box=item.render().css({
						scale: 0.01
					});
					this.responseList.append(box);
					box.transition({
						scale: 1
					}, 300, function() {
						item.edit();
					});
					return item;
				},
				suggestOptional:function() {
					if (this.optional instanceof Array && this.optional.length>0) {
						this.optionalList.html("<h3>Optional templates you can add</h3>");
						var prompt=this;
						for(var o in this.optional) {
							(function() {
								var optionalTemplate=prompt.optional[o];
								prompt.optionalList.append(
									$(yoodoo.e("button")).attr("type","button").html(optionalTemplate.displayName()).append(
										$(yoodoo.e("span")).html(yoodoo.ago(optionalTemplate.updated)+' by '+optionalTemplate.owner.nickname)
									).append(
										$(yoodoo.e("div")).append(
											yoodoo.icons.get('add',15,15,{'4D4D4D':'FFFFFF'})
										)
									).click(function() {
										var newRecord=kloe_response.clone.response(optionalTemplate);
										var item=new kloe_response.record(newRecord,null,false);
										prompt.responses.push(item);
										var box=item.render().css({
											scale: 0.01
										});
										prompt.responseList.append(box);
										box.transition({
											scale: 1
										}, 300, function() {
											item.edit();
										});
										$(this).animate({opacity:0},300,function() {
											$(this).slideUp(300,function(){
												$(this).remove();
												for(var o in prompt.optional) {
													if (prompt.optional[o]===optionalTemplate) prompt.optional.splice(0,1);
												}
												if (prompt.optional.length==0) {
													prompt.optionalList.animate({opacity:0},300,function() {
														$(this).slideUp(300,function() {
															$(this).empty();
														});
													});
												}
											})
										});
										//prompt.update();
									})
								);
							})();
						}
					}else{
						this.optionalList.empty();
					}
				}
			};
			return me;
		};
	},
	editLinkage:function(linkage) {
		console.log(linkage);
		this.containers.linkage_editor.empty().append(linkage.edit());
		this.containers.linkage_selection.removeClass("on");
		this.containers.prompt_selection.removeClass("on");
		this.containers.linkage_editor.find('input,textarea').first().focus();
	},
	showLinkage:function(linkage) {
		console.log(linkage);
		this.containers.linkage_editor.empty().append(linkage.display());
		//if ((linkage.links!==undefined && linkage.links.length>0) || (linkage.maps!==undefined && linkage.maps.length>0)) {
			this.containers.linkage_editor.empty().append(linkage.display());
		/*}else{
			if (linkage.object.value.alsrj===true) {
				this.containers.linkage_editor.empty().append(linkage.display()).append('<center style="margin-top:30%">Drag a prompt here from the right,<br />to create a sequence.</center>');
			}else{
				this.containers.linkage_editor.empty().append(linkage.display()).append('<center style="margin-top:30%">Drag a prompt here from the right,<br />to add it to the map.</center>');
			}
		}*/

		this.containers.linkage_selection.removeClass("on");
		this.containers.prompt_selection.addClass("on");
	},
	presave:function() {
		if (kloe_threads.currentLinkage!==null) kloe_threads.currentLinkage.complete();
	}
};
