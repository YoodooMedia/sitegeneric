/*
{
 dependencies:[
  ['dooits/compliance/prompt_linker.js',true],
  ['dooits/compliance/kloe_response.js',true],
  ['css/compliance/prompt_linker.css',true]
 ],
 dooit:'prompt_linker',
 options:{
	kloe_prompt_object:{
		type:'object',
		title:'Object name for the Prompts',
		value:6
	},
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
	business_sector:{
		type:'objectrecord',
		title:'Object and Record defining the Business Sector',
		object_id:3,
		value:665
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
	prompt_map:{
		type:'object',
		title:'Object for the Prompt map',
		value:12
	}
 }
}
*/

var prompt_linker = {
	objects:{},
	business_sector:null,
	doSVG:(document.createElementNS!==undefined),
	icons:{
		downarrow:'<polygon fill="#4D4D4D" points="50,70 95,30 5,30 "/>'
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
	start: function() {
		this.containers.linkage_selection=$(yoodoo.e("div")).addClass('linkage_selection on loading');
		this.containers.linkage_editor=$(yoodoo.e("div")).addClass('linkage_editor').click(function() {
			$('.contextmenu').remove();
		}).html(
			'<center style="margin-top:30%">Add or Select a thread in the left pane,<br />and then edit it here&hellip;</center>'
		);
		this.containers.prompt_selection=$(yoodoo.e("div")).addClass('prompt_selection');

		this.containers.prompt_list=$(yoodoo.e("div")).addClass('prompt_list').html('Edit a thread first...');
		
		
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
		).append(
			this.containers.prompt_selection.append(
				$(yoodoo.e("button")).attr("type","button").click(function() {
					if ($(this).parent().hasClass("on")) {
						$(this).parent().removeClass("on");
					}else{
						$(this).parent().addClass("on");
					}
				})
			).append(
				$(yoodoo.e("div")).addClass("selection_editor")
			).append(
				this.containers.prompt_list
			)
		);
		//console.log("start");
	},
	failed:function(txt) {
		console.log(txt);
	},
	displayed: function() {
		var arr=[
			dooit.options.kloe_prompt_object.value,
			dooit.options.prompt_linkage.value,
			dooit.options.prompt_links.value,
			dooit.options.prompt_map.value,
			dooit.options.kloe_response_object.value,
			dooit.options.kloe_evidence_object.value,
			dooit.options.kloe_actionplan_object.value
		];
		var me=this;

		var step7=function() {
			//console.log("Got objects");
			me.ready();
		};
		var step6=function(idList) {
			var filter={};
			var responseToLinkages=me.objects.responses.getParameterReferingToObjectId(me.objects.linkage.schema.Id);
			filter[responseToLinkages]=[idList.join(','),'in'];
			me.objects.responses.get(function(list) {
				me.responses=[];
				for(var l in list) {
					if (me.linkagesIds[list[l].value[responseToLinkages]]!==undefined) {
						me.responses.push(me.linkagesIds[list[l].value[responseToLinkages]].addResponse(list[l]));
					}
				}
				kloe_response.createInherited({},me.responses,null,function() {
					step7();
				});
				//me.responses=list;
				//step7();
			},function(){
				me.failed('Failed to fetch responses for linkages');
			},0,filter);
		};


		var step5=function(idList) {
			var filter={};
			filter[me.objects.map.getParameterReferingToObjectId(me.objects.linkage.schema.Id)]=[idList.join(','),'in'];
			var mapToLinkages=me.objects.map.getParameterReferingToObjectId(me.objects.linkage.schema.Id);
			me.objects.map.get(function(list) {
				for(var l in list) {
					if (me.linkagesIds[list[l].value[mapToLinkages]]!==undefined) me.linkagesIds[list[l].value[mapToLinkages]].addMap(list[l]);
				}
				me.maps=list;
				step6(idList);
			},function(){
				me.failed('Failed to fetch maps for linkages');
			},0,filter);
		};

		var step4=function(idList) {
			var filter={};
			var linksToLinkages=me.objects.links.getParameterReferingToObjectId(me.objects.linkage.schema.Id);
			filter[linksToLinkages]=[idList.join(','),'in'];
			me.objects.links.get(function(list) {
				for(var l in list) {
					if (me.linkagesIds[list[l].value[linksToLinkages]]!==undefined) me.linkagesIds[list[l].value[linksToLinkages]].addLink(list[l]);
				}
				me.links=list;
				
				step5(idList);
			},function(){
				me.failed('Failed to fetch links for linkages');
			},0,filter);
		};

		var step3=function() {
			var filter={};
			filter[me.objects.linkage.getParameterReferingToObjectId(yoodoo.businessSector.object.schema.Id)]=me.business_sector;
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
				if (idList.length>0) {
					step4(idList);
				}else{
					step7();
				}
			},function(){
				me.failed('Failed to fetch linkage');
			},0,filter);
		};

		var step2=function() {
			yoodoo.keyQuestion.getPromptsInKeyLines(function(list) {
				me.prompts=list;
				step3();
			},true);
			/*var filter={};
			filter[me.objects.prompts.getParameterReferingToObjectId(yoodoo.businessSector.object_id)]=me.business_sector;
			me.objects.prompts.get(function(list) {
				me.prompts=list;
				me.prompts.sort(function(a,b) {
					if (a.value.lvzfz<b.value.lvzfz) return -1;
					if (a.value.lvzfz>b.value.lvzfz) return 1;
					return 0;
				});
				step3();
			},function(){
				me.failed('Failed to fetch prompts');
			},0,filter);*/
		};
		yoodoo.businessSector.check(function(bs) {
			me.business_sector=bs.Id;
			yoodoo.keyQuestion.get(function(list) {
				me.keyQuestions=list;
				yoodoo.object.get(arr,function(list) {
					if (list.length>=4) {
						me.objects.prompts=(list.length>0)?list.shift():null;
						me.objects.linkage=(list.length>0)?list.shift():null;
						me.objects.links=(list.length>0)?list.shift():null;
						me.objects.map=(list.length>0)?list.shift():null;
						me.objects.responses=(list.length>0)?list.shift():null;
						step2();
					}else{
						me.failed('Failed to fetch the 4 main objects');
					}
				},function(){
					me.failed('Failed to fetch the 4 main objects');
				});
			});
		});
	},
	ready:function() {
		this.containers.linkage_selection.append(this.linkage_selector()).removeClass("loading");
	},
	linkage_selector:function() {
		if (this.linkage_selector_div===undefined) this.linkage_selector_div=$(yoodoo.e("div")).addClass("linkage_selector_div");
		this.linkage_selector_div.empty();
		for(var l in this.linkages) {
			var but=this.linkages[l].render();
			this.linkage_selector_div.append(but);
		}
		var me=this;
		var addButton=$(yoodoo.e("button")).attr("type","button").addClass("addButton").click(function() {
			var obj=me.objects.linkage.add();
			obj.value.alsrj=true;
			var linkage=new me.linkage_item(obj);
			var but=linkage.render();
			but.hide();
			me.linkages.push(linkage);
			but.insertBefore(this);
			but.slideDown(500,function() {
				prompt_linker.editLinkage(linkage);
			});
		}).append(
			yoodoo.icons.get('add',15,15,{'4D4D4D':'FFFFFF'})
		);
		
		return this.linkage_selector_div.append(addButton);
	},
	drawPrompts:function(selectedIds) {
		//console.log(selectedIds);
		var d=$(yoodoo.e("div")).addClass("promptSelector");
		for(var i in this.keyQuestions) {
			var k=this.keyQuestions[i].Id;
			if (this.prompts[k]!==undefined) {
		//for(var k in this.prompts) {
				var keyQuestion=yoodoo.keyQuestion.object.recordsCache[k];
				if (typeof(keyQuestion)!="undefined") {
					var kqList=$(yoodoo.e("div")).hide();
					var kq=$(yoodoo.e("div")).append(
						$(yoodoo.e("h3")).html(keyQuestion.displayName()).click(function() {
							if ($(this).parent().hasClass("on")) {
								$(this).parent().removeClass("on");
								$(this).next().stop().slideUp();
							}else{
								$(this).parent().addClass("on");
								$(this).next().stop().slideDown();
							}
						}).prepend(this.icon(this.icons.downarrow,10,10,100,100,{'4D4D4D':'999999'}))
					).append(kqList);
					var validKq=false;
					for(var l in this.prompts[k]) {
						var klList=$(yoodoo.e("div")).hide();
						var kl=$(yoodoo.e("div")).append(
							$(yoodoo.e("h4")).html(this.prompts[k][l].displayName()).click(function() {
								if ($(this).parent().hasClass("on")) {
									$(this).parent().removeClass("on");
									$(this).next().stop().slideUp();
								}else{
									$(this).parent().addClass("on");
									$(this).next().stop().slideDown();
								}
							}).prepend(this.icon(this.icons.downarrow,10,10,100,100,{'4D4D4D':'656565'}))
						).append(klList);
						var validKl=false;
						for(var p in this.prompts[k][l].items) {
							var prompt=this.prompts[k][l].items[p];
							var pd=yoodoo.e("div");
							pd.id=prompt.Id;
							pd.prompt=prompt;
							var description='description';
							if (prompt.value[kloe_response.promptParameters.Presentation]!==null && prompt.value[kloe_response.promptParameters.Presentation][kloe_response.promptPresentionParameters.Description]!==undefined) description=prompt.value[kloe_response.promptParameters.Presentation][kloe_response.promptPresentionParameters.Description];
							klList.append($(pd).addClass("promptDragger").html(prompt.value[kloe_response.promptParameters.Name]).append(
								$(yoodoo.e("div")).html(description)
							).draggable({
								helper: "clone",
								appendTo:this.containers.container,
								revert:'invalid'
							}).css({
								display:(selectedIds[prompt.Id]===true)?'none':'block'
							}));
							validKl=true;
						}
						if (validKl) {
							kqList.append(kl);
							validKq=true;
						}
					}
					if (validKq) d.append(kq);
				}
			}
		}
		this.containers.prompt_list.empty().append(d);
	},
	linkages:[],
	linkage_item:function(obj) {
		this.object=obj;
		if (!(this.object.value.ypiyt>0)) this.object.value.ypiyt=prompt_linker.business_sector;
		//if (!(this.object.value.fsuoh>0)) this.object.value.fsuoh=yoodoo.formatDate('Y-m-d',new Date());
		this.links=[];
		this.linksByTo={};
		this.maps={};
		this.responsesByPrompt={};
		var me=this;
		this.container=$(yoodoo.e("div")).addClass("linkage_item").append(
			$(yoodoo.e("button")).attr("type","button").addClass("linkage_button").html(obj.displayName()).click(
				function() {
					prompt_linker.showLinkage(me);
				}
			)
		);
		if (me.object.value.qepsf===true) this.container.addClass("on");
		if (this.object.readonly!==true) this.container.append(
			$(yoodoo.e("button")).attr("type","button").addClass("linkage_edit_button").click(
				function() {
					prompt_linker.editLinkage(me);
				}
			).append(
				yoodoo.icons.get("edit",12,12)
			)
		).append(
			$(yoodoo.e("button")).attr("type","button").addClass("linkage_delete_button").click(
				function() {
					me.erase();
				}
			).append(
				yoodoo.icons.get("close",12,12)
			)
		);
		this.addLink=function(link) {
			this.links.push(link);
			if (this.linksByTo[link.value.lzptd]===undefined) this.linksByTo[link.value.lzptd]={};
			this.linksByTo[link.value.lzptd][link.value.gxtxv]=link;
		};
		this.addMap=function(map) {
			this.maps[map.value.lzatj]=new me.mapItem(map,this);
		};
		this.addResponse=function(response){
			if (this.responsesByPrompt[response.value.lsswx]===undefined) this.responsesByPrompt[response.value.lsswx]=[];
			response=new kloe_response.record(response,null,null,this.deleteResponse);
			this.responsesByPrompt[response.object.value.lsswx].push(response);
			return response;
		};
		this.deleteResponse=function(deleteResponse) {
			//console.log(deleteResponse,me.preDelete);
			/*for(var r=responses.length-1;r>=0;r--) {
				if (responses[r]===deleteResponse) responses.splice(r,1);
			}*/
			if (typeof(me.preDelete)=="function") me.preDelete(deleteResponse);
			var pid=deleteResponse.object.value[kloe_response.parameters.Prompt];
			for(var r=me.responsesByPrompt[pid].length-1;r>=0;r--) {
				if (me.responsesByPrompt[pid][r]===deleteResponse) me.responsesByPrompt[pid].splice(r,1);
			}
		};
		this.render=function() {
			return this.container;
		};
		this.erase=function() {
			if (window.confirm('Delete this Linkage?')) {
				this.object.erase();
				this.container.slideUp(function() {
					$(this).remove();
				});
				for(var l in prompt_linker.linkages) {
					if (prompt_linker.linkages[l]===this) prompt_linker.linkages.splice(l,1);
				}
				if (this.arena!==undefined) this.arena.remove();
			}
		};
		this.edit=function() {
			this.editor=$(yoodoo.e("div")).addClass("editor");
			this.arena=$(yoodoo.e("div")).addClass(this.sequence?'sequence':'map');
			this.arena.append(this.editor);
			var onStatus=new yoodoo.ui.checkbox({
				label:'On (available to users)',
				onchange:function() {
					me.object.value.qepsf=this.value;
					if (this.value) {
						me.container.addClass('on');
					}else{
						me.arena.removeClass('on');
					}
				}
			});
			this.editor.append(onStatus.render(this.object.value.qepsf===true));

			if (this.links.length==0) {
				var seqchk=new yoodoo.ui.checkbox({
					label:'Sequential Thread (if not then a similarity map)',
					onchange:function() {
						me.object.value.alsrj=me.sequence=this.value;
						if (this.value) {
							me.arena.addClass('sequence').removeClass('map');
							//me.drawSequence();
						}else{
							me.arena.removeClass('sequence').addClass('map');
							//me.drawMap();
						}
					}
				});
				this.editor.append(seqchk.render(this.sequence));
			}else{
				this.editor.append($(yoodoo.e("div")).html(this.sequence?'Sequential Thread':'Similarity Map'));
			}

			var name=new yoodoo.ui.text({
				label:'Name',
				onchange:function() {
					me.object.value.qwweq=this.value;
					me.container.find('.linkage_button').html(this.value);
				}
			});
			this.editor.append(
				name.render((typeof(this.object.value.qwweq)=="string")?this.object.value.qwweq:'')
			);
			var name=new yoodoo.ui.textarea({
				label:'Description',
				rows:5,
				onchange:function() {
					me.object.value.hitph=this.value;
				}
			});
			this.editor.append(
				name.render((typeof(this.object.value.hitph)=="string")?this.object.value.hitph:'')
			).append(
				$(yoodoo.e("button")).attr("type","button").addClass("linkage_button").html('Edit').click(
					function() {
						prompt_linker.showLinkage(me);
					}
				)
			);
			return this.arena;
		};
		this.display=function() {
			this.sequence=(this.object.value.alsrj===true);
			this.arena=$(yoodoo.e("div")).addClass(this.sequence?'sequence':'map');
			this.arena.append($(yoodoo.e("h2")).html(this.object.displayName()));
			this.input=$(yoodoo.e("div")).addClass("linkage_input");
			this.arena.append(this.input);
			var me=this;
			var selectedIds={};
			if (this.sequence) {
				selectedIds=this.drawSequence();
			}else{
				selectedIds=this.drawMap();
			}
			prompt_linker.drawPrompts(selectedIds);
			return this.arena;
		};
		this.drawSequence=function() {
			this.input.empty();
			var selectedIds={};
			if (this.prompts===undefined) {
				this.prompts=[];
				if (this.links.length>0 && this.object.value.oetpf>0 && prompt_linker.objects.prompts.recordsCache[this.object.value.oetpf]!==undefined) {
					//this.prompts.push({prompt:prompt_linker.objects.prompts.recordsCache[this.object.value.oetpf],link:null,linkage:this});
					//selectedIds[this.object.value.oetpf]=true;
					var fromPrompt={};
					for(var l in this.links) {
						if (this.links[l].value.lzptd>0 && this.links[l].value.lzptd!=this.links[l].value.gxtxv) fromPrompt[this.links[l].value.lzptd]=this.links[l];
					}
					var firstLink=null;
					var l=0;
					while((this.links[l].value.lzptd!=this.links[l].value.gxtxv && fromPrompt[this.links[l].value.lzptd]!==undefined) && l<this.links.length-1) {
						l++;
					}
					firstLink=this.links[l];
					var pid=firstLink.value.lzptd;
					selectedIds[pid]=true;
					this.prompts.push({
						prompt:prompt_linker.objects.prompts.recordsCache[pid],
						link:firstLink,
						linkage:this
					});
					while(fromPrompt[pid]!==undefined) {
						var p=prompt_linker.objects.prompts.recordsCache[fromPrompt[pid].value.gxtxv];
						if (p!==undefined) {
							selectedIds[pid]=true;
							pid=fromPrompt[this.prompts[this.prompts.length-1].prompt.Id].value.gxtxv;
							if (prompt_linker.objects.prompts.recordsCache[pid]!==undefined) {
								selectedIds[pid]=true;
								this.prompts.push({
									prompt:prompt_linker.objects.prompts.recordsCache[pid],
									link:fromPrompt[this.prompts[this.prompts.length-1].prompt.Id],
									linkage:this
								});
							}
						}
					}
//console.log(this.prompts);
				}
			}
			var count=0;
			for(var p in this.prompts) {
				this.input.append(this.sequenceItem(this.prompts[p]));
				count++;
			}
			if (count==0) this.input.append('<center style="margin-top:30%">Drag a prompt here from the right,<br />to create a sequence.</center>');

			if (this.input.hasClass("ui-droppable")) this.input.droppable("destroy");
			var me=this;
			this.input.droppable({
				hoverClass:'dropping',
				accept:'.promptDragger',
				drop:function(e,ui) {
					$(this).find("center").remove();
					var prompt=ui.helper.context;
					$(prompt).slideUp();
					if (me.prompts.length==0) {
						var link=prompt_linker.objects.links.add();
						link.value.uxfjv=me.object;
						link.value.gxtxv=prompt.prompt.Id;
						me.prompts.push({
							prompt:prompt.prompt,
							link:link,
							linkage:me
						});
					}else{
						var link=prompt_linker.objects.links.add();
						link.value.uxfjv=me.object;
						link.value.gxtxv=prompt.prompt.Id;
						me.prompts.push({
							prompt:prompt.prompt,
							link:link,
							linkage:me
						});
					}
					me.input.append(me.sequenceItem(me.prompts[me.prompts.length-1]));
					//console.log(prompt,prompt.prompt);
					me.updateSequence();
				}
			});
			this.input.sortable({
				stop:function(e,ui) {
					var d=ui.item.context;
					var i=$(d).prevAll().get().length;
					var wasi=null;
					for(var p in me.prompts) {
						if (me.prompts[p]===d.link) wasi=p;
					}
					me.prompts.splice(i,0,me.prompts.splice(wasi,1)[0]);
					me.updateSequence();
				}
			});
			//console.log("sequencer",this.input);
			return selectedIds;
		};
		this.updateSequence=function(forced) {
			var pid=null;
			for(var p in this.prompts) {
				if (pid!==null) {
					/*if (this.prompts[p].link===null) {
						this.prompts[p].link=prompt_linker.objects.links.add();
						this.prompts[p].link.value.uxfjv=this.object;
						this.prompts[p].link.value.gxtxv=this.prompts[p].prompt.Id;
					}else if (this.prompts[p].link.deleted===true) {
						
					}*/
					this.prompts[p].link.value.lzptd=pid;
				}else{
					/*if (this.prompts[p].link!==null) {
						this.prompts[p].link.erase();
						if (this.prompts[p].link.deleted!==true) this.prompts[p].link=null;
					}*/
					this.prompts[p].link.value.lzptd=this.prompts[p].prompt.Id;
					this.object.value.oetpf=this.prompts[p].prompt.Id;
				}
				pid=this.prompts[p].prompt.Id;
			}
			this.checkUpdated(forced);
		};
		this.checkUpdated=function(forced) {
			if (typeof(forced)!="undefined") {
				this.object.mustUpdate=forced;
			}else if (this.object.mustUpdate===false) {
				for(var p in this.prompts) {
					if (this.prompts[p].link!==null && this.prompts[p].link.changed()) this.object.mustUpdate=true;
				}
			}
			//if (this.object.mustUpdate) console.log(this.object);
		};
		this.sequenceItem=function(link) {
			var d=yoodoo.e("div");
			d.link=link;
			var me=this;
			var responses=[];
			if (link.linkage.responsesByPrompt[link.prompt.Id] instanceof Array) {
				responses=link.linkage.responsesByPrompt[link.prompt.Id];
			}
			$(d).addClass("link").append(
				$(yoodoo.e("div")).addClass("sequence_position").append(
					$(yoodoo.e("div")).html(link.prompt.value.lvzfz).addClass("sequence_handle").append(
						$(yoodoo.e("div")).addClass("responseCount").html(
							$(yoodoo.e("span")).html(responses.length)
						).append(
							$(yoodoo.e("button")).attr("type","button").click(function() {
								kloe_response.listPrompt(link.prompt,link.linkage,prompt_linker.objects.responses,responses,function(newResponse) {
									responses.push(newResponse);
									if (link.linkage.responsesByPrompt[link.prompt.Id]===undefined) link.linkage.responsesByPrompt[link.prompt.Id]=[];
									link.linkage.responsesByPrompt[link.prompt.Id].push(newResponse);
									$(d).find('.responseCount').removeClass("noResponses").find("span").html(responses.length);
									me.checkUpdated(true);
		//console.log(responses);
								},link.linkage.deleteResponse);
								$(d).find('.responseCount').addClass((responses.length==0)?"noResponses":'').find("span").html(responses.length);
							}).append(
								yoodoo.icons.get("edit",12,12,{'4D4D4D':'FFFFFF'})
							)
						).addClass((responses.length==0)?'noResponses':'')
					)
				).append(
					$(yoodoo.e("div")).html(
						(link.prompt.value.zgsux!==undefined && link.prompt.value.zgsux!==null && link.prompt.value.zgsux.asccj!==undefined)?link.prompt.value.zgsux.asccj:'No message defined'
					).addClass("sequence_info").prepend(
						$(yoodoo.e("button")).attr("type","button").html("").addClass("delButton").append(
							yoodoo.icons.get("close",12,12,{'4D4D4D':'FFFFFF'})
						).click(function() {
							$(d).remove();
							link.link.erase();
							for(var p in me.prompts) {
								if (me.prompts[p]===link) me.prompts.splice(p,1);
							}
							me.updateSequence(true);
						})
					)
				)
			);
			
			//if (link.link!==null) {
				var ip=new yoodoo.ui.textarea({
					label:'Message',
					onchange:function() {
						if (link.link!==null) link.link.value.qnkwd=this.value;
						me.checkUpdated();
					},
					rows:3
				});
				$(d).prepend(
					ip.render((link.link!==null && typeof(link.link.value.qnkwd)=="string")?link.link.value.qnkwd:'')
				);
			//}
			link.linkage.preDelete=function(deletedResponse) {
				for(var r in responses) {
					if (responses[r]===deletedResponse) responses.splice(r,1);
				}
				$(d).find('.responseCount').addClass((responses.length==0)?"noResponses":"").find("span").html(responses.length);
			};
			return d;
		};
		this.drawMap=function() {
			this.input.empty();
			if (this.input.hasClass("ui-droppable")) this.input.droppable("destroy");
			var me=this;
			this.input.droppable({
				hoverClass:'dropping',
				accept:'.promptDragger',
				drop:function(e,ui) {
					$(this).find("center").remove();
					var prompt=ui.helper.context;
					$(prompt).slideUp();
					var loc={x:0,y:0};
					var pos=me.input.offset();
					loc.x=ui.offset.left-pos.left;
					loc.y=ui.offset.top-pos.top;
					var map=prompt_linker.objects.map.add();
					map.value.uozyk=me.object;
					map.value.lzatj=prompt.prompt.Id;
					map.value.qhybx=loc.x+25;
					map.value.kxsai=loc.y+25;
					me.maps[prompt.prompt.Id]=new me.mapItem(map,me);
					//console.log(ui,loc,pos);
					me.input.append(me.maps[prompt.prompt.Id].display());
					me.updateMapLinks(me.maps[prompt.prompt.Id]);
				}
			});
			var selectedIds={};
			var count=0;
			for(var id in this.maps) {
				selectedIds[id]=true;
				this.input.append(this.maps[id].display());
				count++;
			}
			if (count==0) this.input.append('<center style="margin-top:30%">Drag a prompt here from the right,<br />to add it to the map.</center>');

			this.updateMapLinks();
			return selectedIds;
		};
		this.mapItem=function(map,linkage) {
			this.map=map;
			this.linkage=linkage;
			this.svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
			this.svg.setAttribute('type', 'image/svg+xml');
			this.svg.setAttribute('width', 200);
			this.svg.setAttribute('height', 200);
			this.links=$(yoodoo.e("div")).addClass("mapItemLinks");
			this.detail=$(yoodoo.e("div")).addClass("mapItemDetail").attr("title","Right click for more");
			this.ring=$(yoodoo.e("div")).addClass("mapItemRing").append(this.svg);
			this.container=$(yoodoo.e("div")).addClass("mapItem").append(this.detail).append(this.ring).append(this.links);
			this.prompt=prompt_linker.objects.prompts.recordsCache[map.value.lzatj];
			var me=this;
			this.display=function() {
				if (this.prompt===undefined) return null;
				this.detail.html(this.prompt.value.lvzfz);
				this.container.css({
					left:this.map.value.qhybx+'px',
					top:this.map.value.kxsai+'px'
				});
				if (this.container.hasClass("ui-draggable")) this.container.draggable("destroy");
				this.container.draggable({
					handle:this.detail.get(0),
					scroll:true,
					drag:function(e,ui) {
						var loc={x:0,y:0};
						var pos=me.linkage.input.offset();
						loc.x=ui.offset.left-pos.left;
						loc.y=ui.offset.top-pos.top;
						me.map.value.qhybx=loc.x;
						me.map.value.kxsai=loc.y;
						me.linkage.updateMapLinks(me);
					},
					stop:function(e,ui) {
						me.linkage.updateMapLinks(me);
					}
				}).bind("contextmenu",function(e) {
					e.preventDefault();
					me.showMenu();
				});
				return this.container;
			};
			this.showMenu=function() {
				$('.contextmenu').remove();
				this.container.append(
					$(yoodoo.e("div")).addClass("contextmenu").html(
						this.prompt.value.zgsux.asccj
					).prepend(
						$(yoodoo.e("h3")).html(this.prompt.value.lvzfz)
					).prepend(
						$(yoodoo.e("button")).attr("type","button").html("remove")/*.append(
							yoodoo.icons.get("close",12,12,{'4D4D4D':'FFFFFF'})
						)*/.addClass("delButton").click(function() {
							me.remove();
						})
					)
				);
			};
			this.remove=function() {
				$(this.container).remove();
				this.map.erase();
				for(var p in this.linkage.maps) {
					if (this.linkage.maps[p]===this) delete this.linkage.maps[p];
				}
				this.linkage.updateMapLinks();
			};
			this.lines={};
			this.updateLinks=function(lines) {
//console.log(lines,this.lines);
				var toRemove={};
				for(var id in this.lines) toRemove[id]=true;
				for(var id in lines) {
					toRemove[id]=false;
					if (this.lines[id]===undefined) {
						this.lines[id] = document.createElementNS("http://www.w3.org/2000/svg", "line");
						this.svg.appendChild(this.lines[id]);
					}
					this.lines[id].setAttribute('style','stroke:rgb(0,0,0);stroke-width:1');
					this.lines[id].setAttribute('x1',100);
					this.lines[id].setAttribute('y1',100);
					this.lines[id].setAttribute('x2',100-(this.map.value.qhybx-this.linkage.maps[id].map.value.qhybx));
					this.lines[id].setAttribute('y2',100-(this.map.value.kxsai-this.linkage.maps[id].map.value.kxsai));
					this.linkage.maps[id].removeLink(this.map.value.lzatj);

					if (this.linkage.linksByTo[this.map.value.lzatj]===undefined) this.linkage.linksByTo[this.map.value.lzatj]={};
					var newlink=this.linkage.linksByTo[this.map.value.lzatj][id];
					if (newlink===undefined) {
						newlink=prompt_linker.objects.links.add();
						this.linkage.linksByTo[this.map.value.lzatj][id]=newlink;
						newlink.value.lzptd=this.map.value.lzatj;
						newlink.value.gxtxv=id;
						newlink.value.uxfjv=this.linkage.object;
					}
					if (newlink.deleted===true) newlink.deleted=false;
					newlink.value.vmluh=lines[id];


					if (this.linkage.linksByTo[id]===undefined) this.linkage.linksByTo[id]={};
					var reverselink=this.linkage.linksByTo[id][this.map.value.lzatj];
					if (reverselink===undefined) {
						reverselink=prompt_linker.objects.links.add();
						this.linkage.linksByTo[id][this.map.value.lzatj]=newlink;
						reverselink.value.lzptd=id;
						reverselink.value.gxtxv=this.map.value.lzatj;
						reverselink.value.uxfjv=this.linkage.object;
					}
					if (reverselink.deleted===true) reverselink.deleted=false;
					reverselink.value.vmluh=lines[id];
					
				}
				for(var tr in toRemove) {
					if (toRemove[tr]===true) {
						if (this.linkage.linksByTo[this.map.value.lzatj][tr]!==undefined) {
							this.linkage.linksByTo[this.map.value.lzatj][tr].erase();
							if (this.linkage.linksByTo[this.map.value.lzatj][tr].deleted!==true) {
								delete this.linkage.linksByTo[this.map.value.lzatj][tr];
							}
						}
						if (this.linkage.linksByTo[tr][this.map.value.lzatj]!==undefined) {
							this.linkage.linksByTo[tr][this.map.value.lzatj].erase();
							if (this.linkage.linksByTo[tr][this.map.value.lzatj].deleted!==true) {
								delete this.linkage.linksByTo[tr][this.map.value.lzatj];
							}
						}
						$(this.lines[tr]).remove();
						this.lines[tr]=undefined;
					}
				}
			};
			this.removeLink=function(id) {
				if (this.lines[id]!==undefined) {
					if (this.linkage.linksByTo[this.map.value.lzatj][id]!==undefined) {
						this.linkage.linksByTo[this.map.value.lzatj][id].erase();
						if (this.linkage.linksByTo[this.map.value.lzatj][id].deleted!==true) {
							delete this.linkage.linksByTo[this.map.value.lzatj][id];
						}
					}
					$(this.lines[id]).remove();
					this.lines[id]=undefined;
				}
			};
		}
		this.updateMapLinks=function(movedMap) {
			var connections={};
			var mapsToCheck=this.maps;
			if (typeof(movedMap)!="undefined") {
				mapsToCheck={};
				mapsToCheck[movedMap.map.value.lzatj]=movedMap;
			}
			for(var from in mapsToCheck) {
				for(var to in this.maps) {
					if (from!=to && (connections[from]===undefined || connections[from][to]===undefined || connections[to]===undefined || connections[to][from]===undefined)) {
						var h=Math.sqrt(
							Math.pow(this.maps[from].map.value.qhybx-this.maps[to].map.value.qhybx,2)
						+
							Math.pow(this.maps[from].map.value.kxsai-this.maps[to].map.value.kxsai,2)
						);
//console.log(this.maps[from].map.value.qhybx,this.maps[to].map.value.qhybx,this.maps[from].map.value.kxsai,this.maps[to].map.value.kxsai,h);
						if (h<100+25) {
							if (connections[from]===undefined) connections[from]={};
							connections[from][to]=h;
							if (connections[to]===undefined) connections[to]={};
							connections[to][from]=h;
						}
					}
				}
			}
			for(var from in mapsToCheck) {
				mapsToCheck[from].updateLinks(connections[from]);
			}
		};
	},
	editLinkage:function(linkage) {
		//console.log(linkage);
		this.containers.linkage_editor.empty().append(linkage.edit());
		this.containers.linkage_selection.removeClass("on");
		this.containers.prompt_selection.removeClass("on");
		this.containers.linkage_editor.find('input,textarea').first().focus();
	},
	showLinkage:function(linkage) {
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
	}
};
