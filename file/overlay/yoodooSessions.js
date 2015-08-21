yoodoo.sessions={
	_data:[],
	_experiences:{},
	_content:{},
	_dooits:{},
	_widgets:{},
	_favourites:{},
	_sessions:[],
	_sessionIds:[],
	_tags:[],
	waitingToReveal:{},
	build:function(arr) {
		this._data=[];
		this._experiences={};
		this._content={};
		this._favourites={};
		this._dooits={};
		this._widgets={};
		this._sessions=[];
		this._sessionIds=[];
		this._interventions=[];
		for(var s=0;s<arr.length;s++) {
			this._data.push(new yoodoo.sessions.elements.session(arr[s]));
		}
		this._data.sort(function(a,b) {return a.order-b.order;});
	},
	syllabus:function(arr) {
		for(var id in this._widgets) {
			if (this._widgets[id]!==undefined) this._widgets[id].toDelete=true;
		}
		for(var id in this._favourites) {
			if (this._favourites[id]!==undefined) this._favourites[id].toDelete=true;
		}
		for(var id in this._content) {
			if (this._content[id]!==undefined) this._content[id].toDelete=true;
		}
		for(var e in this._experiences) {
			if (this._experiences[e]!==undefined) this._experiences[e]._preUpdate();
		}
		for(var c=0;c<arr.length;c++) {
			if (this._experiences[arr[c].experience]!==undefined) {
				if (arr[c].widget) {
					//console.log(arr[c]);
					if (this._widgets[arr[c].exercise_id]!==undefined) {
						//console.log(this._widgets[arr[c].exercise_id]);
						this._widgets[arr[c].exercise_id].toDelete=false;
						//this._widgets[arr[c].exercise_id].build();
					}else{
						var widget=new yoodoo.sessions.elements.widget(arr[c]);
						this._widgets[widget.exercise_id]=widget;
					}
				}else{
					if (this._content[arr[c].content_id]!==undefined) {
						this._content[arr[c].content_id].update(arr[c]);
						this._content[arr[c].content_id].toDelete=false;
					}else{
						var content=new yoodoo.sessions.elements.content(arr[c],this._experiences[arr[c].experience]);
						this._content[content.content_id]=content;
						this._experiences[arr[c].experience]._addContent(content);
						
						if (content.earmarked) {
							this._favourites[content.content_id]=content.favouriteArray();
							yoodoo.interface.drawFavourite(content.favouriteArray());
						}
					}
				}
			}
		}
		var obj=undefined;
		for(var e in this._experiences) {
			obj=this._experiences[e]._postUpdate(obj);
		}
		
		for(var id in this._widgets) {
			if (this._widgets[id]!==undefined && this._widgets[id].toDelete===true) {
				this._widgets[id]=undefined;
				yoodoo.interface.dropWidget(id);
				yoodoo.interface.dropTool(id);
			}
		}
		for(var id in this._favourites) {
			if (this._favourites[id]!==undefined && this._favourites[id].toDelete===true) {
				this._favourites[id]=undefined;
				yoodoo.interface.dropFavourite(id);
			}
		}
		
		for(var id in this._content) {
			if (this._content[id]!==undefined && this._content[id].toDelete===true) {
				var e=this._experiences[this._content[id].experience];
				for(var c=e._content.length-1;c>=0;c--) {
					if (e._content[c].content_id==id) e._content.splice(c,1);
				}
				this._content[id]=undefined;
			}
		}
		for(var i in this._data) {
			if (this._data[i]!==undefined && this._data[i].isEmpty===false) {
				if (this._data[i].intervention) {
					this._interventions[this._data[i].id]=this._data[i];
				}else if (this._sessionIds[this._data[i].id]!==undefined){
					//this._sessions.push(this._data[i]);
					//this._sessionIds[this._data[i].id]=this._data[i];
				}else{
					this._sessions.push(this._data[i]);
					this._sessionIds[this._data[i].id]=this._data[i];
				}
			}
		}
		var params={};
		yoodoo.sessions.waitingToReveal={};
		//console.log(this._sessions);
		for(var s=0;s<this._sessions.length;s++) {
			if (this._sessions[s]!==undefined) params=this._sessions[s].update(params);
		}
		//if (yoodoo.sessions.waitingToReveal.item!==undefined) yoodoo.sessions.waitingToReveal.item._experience.timedReveal(yoodoo.sessions.waitingToReveal.when);
		yoodoo.interface.sessionUpdate({sessions:this._sessions,current:this.currentSession().id});
	},
	show:function(id) {
		var session=this.getSession(id);
		if (session!==false) {
			this.fetched={session_id:id,experience_id:null,session_complete:session.complete};
			//console.log(this.fetched);
		}
	},
	fetched:{
		session_id:null,
		experience_id:null,
		session_complete:null
	},
	currentSession:function() {
		if (this.fetched.session_id!==null) {
			var sess=this.getSession(this.fetched.session_id);
			if (sess.intervention===true) {
				this.fetched.session_id=null;
			}else if (this.fetched.session_complete!==sess.complete) {
				this.fetched.session_id=null;
				this.fetched.session_complete=null;
			}
		}
		if (this.fetched.session_id===null) {
			var visible=null;
			var hideAfter=false;
			var firstIncomplete=null;
			var lastVisible=null;
			for(var s=0;s<this._sessions.length;s++) {
				if (this._sessions[s].isEmpty===false) {
					if (this._sessions[s].complete===false && firstIncomplete===null && hideAfter===false) firstIncomplete=s;
					if (hideAfter===false) lastVisible=s;
					if (this._sessions[s].hideAfter===true) hideAfter=true;
				} 
			}
			if (firstIncomplete!==null) return this._sessions[firstIncomplete];
			return this._sessions[lastVisible];
		}else{
			return this.getSession(this.fetched.session_id);
		}
	},
	getSession:function(id) {
		if (this._sessionIds[id]!==undefined) return this._sessionIds[id];
		if (this._interventions[id]!==undefined) return this._interventions[id];
		return false;
	},
	getWidgetIds:function() {
		var arr=[];
		for(var id in this._widgets) {
			if (this._widgets[id]!==undefined && this._widgets[id].data===null) arr.push(id);
		}
		return arr;
	},
	gotWidgets:function(obj,callback) {
		var callback=callback;
		var dependencies=[];
		for(var id in obj) {
			if (this._widgets[id]!==undefined && this._widgets[id].data===null) {
				this._widgets[id].configure(obj[id]);
				dependencies=$.merge(dependencies,this._widgets[id].dependencies());
			}
		}
		//$(document.body).append(dependencies.length);
		if (dependencies.length>0) {
			var tmp=new yoodoo.fileLoader.loader(dependencies,function() {
		//$(document.body).append('Loaded:'+dependencies.length);
				callback();
			});
		}else{
			callback();
		}
	},
	dooitFieldsUpdateWidgets:function(fields) {
		var fieldIds={};
		for(var k in fields) {
			if (fields[k]!="") {
				try{
					fieldIds[k.replace(/^EF/,'')]={object:$.parseJSON(fields[k]),base64:Base64.encode(fields[k])};
				}catch(e) {
					yoodoo.errorLog(e);
				}
			}
		}
		var updatedWidgets={};
		for(var id in this._widgets) {
			try{
				for(var fieldName in this._widgets[id].data.fields) {
					if (fieldIds[this._widgets[id].data.fields[fieldName][0].toString()]!==undefined) {
						this._widgets[id].data.fields[fieldName][1]=fieldIds[this._widgets[id].data.fields[fieldName][0].toString()].base64;
						this._widgets[id].object[fieldName]=fieldIds[this._widgets[id].data.fields[fieldName][0].toString()].object;
						updatedWidgets[id]=true;
					}
				}
			}catch(e) {
				yoodoo.errorLog(e);
			}
		}
		for(id in updatedWidgets) this._widgets[id].object.field_was_updated();
		// expects EFn:'json'
		//console.log(fieldIds);
	},
	showIntervention:function(id) {
		yoodoo.interface.showWebview();
		yoodoo.session.show(id);
		yoodoo.interface.hideHub();
	},
	showHub:function() {
		for(var id in this._widgets) {
			if (this._widgets[id]!==undefined) {
				try{
					this._widgets[id].build();
				}catch(e){}
			}
		}
		yoodoo.interface.hideDialog();
		yoodoo.interface.setOrientation("portrait");
		yoodoo.interface.showHub({
			sessionId:this.currentSession().id,
			search:true, // display search
			community:true, // display community button
			sessionRow:2, // on which row of the grid in the hub, to show the next session
			notices:[]
		});
	},
	elements:{
		session:function(params) {
			this.isEmpty=true;
			this.complete=true;
			this.hideAfter=false;
			this.experiences=[];
			this.order=params.y;
			this.id=params.session;
			this.name=params.session_name;
			this.intervention=params.intervention;
			this.colour=params.session_colour;
			this.short_description=params.short_description;
			this.long_description=params.long_description;
			this.times={total:0,complete:0};
			for (var e=0;e<params.experiences.length;e++) {
				this.experiences.push(new yoodoo.sessions.elements.experience(params.experiences[e],this));
			}
			this.experiences.sort(function(a,b) {return a.order-b.order;});
			this.update=function(obj) {
				this.experiences.sort(function(a,b) {return a.order-b.order;});
				this.isEmpty=true;
				this.hideAfter=false;
				this.hideAfterTime=false;
				this.complete=true;
				this.started=false;
				this.previousComplete=true;
				this.previousCompleteTime=null;
				this.times={total:0,complete:0};
				if (this.intervention!==true && typeof(obj)!="undefined") {
					jQuery.extend(this,{},obj);
				}
				//console.log('>> '+this.name);
				for(var e=0;e<this.experiences.length;e++) {
					if (this.experiences[e].isEmpty===false) {
						params = this.experiences[e]._sortContent(params);
						this.isEmpty=false;
						var times=this.experiences[e].calculateDuration();
						this.times.total+=times.total;
						this.times.complete+=times.complete;
						if (this.hideAfter===true) this.experiences[e].visible=false;
						if (this.experiences[e].hideAfter===true) this.hideAfter=true;
						if (this.experiences[e].complete===false) this.complete=false;
						if (this.experiences[e].started===true) this.started=true;
					}
				}
				var params={
					hideAfter:this.hideAfter,
					previousComplete:this.previousComplete,
					hideUntil:this.hideAfterTime,
					previousCompleteTime:this.previousCompleteTime
				};
				return params;
			};
			this.openNext=function() {
				
			};
			this.pieChart=function(dia) {
				var full=60;
				var total=this.times.total;
				var value=this.times.complete;
				var text=[total,'mins'];
				if (this.times.total>60) {
					full/=60;
					total/=60;
					value/=60;
					text=[total.toFixed(1),'hour'+((total==1)?'':'s')];
				}
				
				if (this.pie===undefined) {
					this.pie = new yoodoo.session.pieChart({
						dia:100,
						fullPie:full,
						total:total,
						value:value,
						text:text
					});
					return this.pie.draw();
				}else{
					return this.pie.update({
						dia:100,
						fullPie:full,
						total:total,
						value:value,
						text:text
					});
				}
			};
			this.appArray=function() {
				var arr={
					id : this.id,
					title : this.name,
					shortDescription : this.short_description,
					longDescription : this.long_description,
					completed : this.complete,
					complete : this.times.complete,
					duration : this.times.total,
					colour : this.colour,
					experiences : []
				};
				for(var e=0;e<this.experiences.length;e++) {
					arr.experiences.push(this.experiences[e].appArray());
				}
				return arr;
			};
		},
		experience:function(params,session) {
			this._session=session;
			this._content=[];
			this.order=params.y;
			this.id=params.experience;
			this.name=params.experience_name;
			this.icon=params.icon;
			this.complete=true;
			this.hideAfter=false;
			this.isEmpty=true;
			this.visible=true;
			this.started=null;
			this.autoplay=null;
			this.lastviewed=null;
			yoodoo.sessions._experiences[this.id]=this;
			this.opened=function(item) {
				this.lastviewed=item;
			};
			this._preUpdate=function() {
				for(var c=0;c<this._content.length;c++) {
					this._content[c].toRemove=true;
				}
			};
			this._postUpdate=function(obj) {
				//console.log("Post update "+this.name);
				for(var c=this._content.length-1;c>=0;c--) {
					if (this._content[c].toRemove===true) {
						if (this._content[c].buttonContainer!==undefined) this._content[c].buttonContainer.remove();
						this._content.splice(c,1);
					}
				}
//return obj;
				return this._sortContent(obj);
			};
			this.appArray=function() {
				var arr={
					id : this.id,
					title : this.name,
					completed : this.complete,
					available : this.visible,
					icon : this.icon 
				};
				return arr;
			};
			this.calculateDuration=function() {
				var reply={total:0,complete:0};
				var notStarted=true;
				for(var c=0;c<this._content.length;c++) {
					if (this._content[c].completed===true) notStarted=false;
					if (this._content[c].duration>0) {
						reply.total+=this._content[c].duration;
						if (this._content[c].completed===true) reply.complete+=this._content[c].duration;
					}
				}
				if (this.started===null) {
					this.started=!notStarted;
				}else if (!notStarted) {
					//this.started=!notStarted;
				}
				if (this.autoplay===null) this.autoplay=!this.started;
				this.button();
				return reply;
			};
			this._addContent=function(content) {
				this._content.push(content);
			};
			this._sortContent=function(obj) {
				//console.log(this.name);
				this._content.sort(function(a,b) {return a.sort_priority-b.sort_priority;});
				var hideAfter=false;
				this.complete=true;
				this.hideAfter=false;
				//this.hideAfterTime=null;
				this.isEmpty=true;
				this.visible=false;
				var previousComplete=false;
				this.previousCompleteTime=null;
				if (this._session.intervention!==true && obj!==undefined) {
					if (obj.hideAfter===true) {
						hideAfter=true;
					}
					if (obj.previousComplete===true) {
						previousComplete=true;
					}
					/*if (obj.hideUntil instanceof Date) {
						this.hideAfterTime=obj.hideUntil;
					}*/
					if (obj.previousCompleteTime instanceof Date) {
						this.previousCompleteTime=obj.previousCompleteTime;
					}
				}
				var now=new Date().getTime()+5000;
				for(var c=0;c<this._content.length;c++) {
					//if (this._content[c].hide_after_til_complete) console.log(this._content[c]);
					//console.log('+ '+this._content[c].name);
					//if (this._content[c].hide_til_previous_complete && this.previousCompleteTime!=null) console.log(previousComplete,this._content[c].completed,this._content[c].hide_til_previous_complete,this._content[c].hide_til_previous_complete_hours,this.previousCompleteTime,this.previousCompleteTime.getTime()+(this._content[c].hide_til_previous_complete_hours*1000*60*60),now);
					this._content[c].visible=true;
					if (this._content[c].hidden) {
						this._content[c].visible=false;
					}else if (this.previousCompleteTime instanceof Date && this.previousCompleteTime.getTime()>=now) {
						this._content[c].visible=false;
						hideAfter=true;
						yoodoo.sessions.waitingToReveal={
							item:this._content[c],
							when:new Date(this.previousCompleteTime.getTime())
						};
					}else if (hideAfter) {
						this._content[c].visible=false;
					}else if (!previousComplete && this._content[c].hide_til_previous_complete && this._content[c].hide_til_previous_complete==0) {
						this._content[c].visible=false;
					}else if (previousComplete && this._content[c].hide_til_previous_complete && this.previousCompleteTime instanceof Date && this.previousCompleteTime.getTime()+(this._content[c].hide_til_previous_complete_hours*1000*60*60)>=now) {
						this._content[c].visible=false;
						yoodoo.sessions.waitingToReveal={
							item:this._content[c],
							when:new Date(this.previousCompleteTime.getTime()+(this._content[c].hide_til_previous_complete_hours*1000*60*60))
						};
						//console.log(this.previousCompleteTime,this._content[c].hide_til_previous_complete_hours);
					}else if (this._content[c].completed && this._content[c].hide_if_complete) {
						this._content[c].visible=false;
					}
					if (!this._content[c].completed && this._content[c].hide_after_til_complete) {
						hideAfter=true;
					}
					if (this._content[c].visible) this.visible=true;
//					if (!this._content[c].hidden) this.visible=true;
					this.isEmpty=false;
					previousComplete=this._content[c].completed;
					if (!this._content[c].completed && !this._content[c].hidden) this.complete=false;

					if (this._content[c].completed===true) {
						this.previousCompleteTime=new Date(this._content[c].completed_date.getTime());
						//if (this._content[c].hide_after_til_complete_hours>0) console.log(this.previousCompleteTime);
						this.previousCompleteTime.setHours(this.previousCompleteTime.getHours()+this._content[c].hide_after_til_complete_hours);
					}else{
						this.previousCompleteTime=null;
					}
					//if (this._content[c].earmarked && this._content[c].visible) yoodoo.sessions._favourites.push(this._content[c]);
				}
				if (!this.isEmpty) this._session.isEmpty=false;
				if (!this.complete) this._session.complete=false;
				this.hideAfter=hideAfter;
				if (this._session.intervention===true) return obj;
				return {
					hideAfter:hideAfter,
					previousComplete:previousComplete,
					//hideUntil:this.hideAfterTime,
					previousCompleteTime:this.previousCompleteTime
				};
			};
			this.button=function(size) {
				var me=this;
				if (this.buttonContainer===undefined) {
					this.buttonContainer=yoodoo.e("button");
					$(this.buttonContainer).attr("type","button");
					if (!isNaN(size)) this.buttonContainer.size=size;
				}
				$(this.buttonContainer).click(function() {
					if (!$(this).hasClass("timedReveal") && !$(this).hasClass("notAvailable")) yoodoo.interface.experience(me.id);
				});
				if (this.buttonContainer.size===undefined && !isNaN(size)) this.buttonContainer.size=size;
				size=this.buttonContainer.size;
				if (typeof(size)=='undefined') size=70;
				//console.log(size,this.buttonContainer.size);
				this.buttonContainer.disabled=!this.visible;
				var icon=null;
				if (size!==undefined) {
					if (this.icon!==null) {
						icon=$(yoodoo.icons.get(this.icon,Math.floor(size*0.4),Math.floor(size*0.4))).css({margin:Math.floor(size*0.3)});
					}else{
						icon=$(yoodoo.icons.get('dooit',Math.floor(size*0.4),Math.floor(size*0.4))).css({margin:Math.floor(size*0.3)});
					}
				}
				$(this.buttonContainer).empty().append(
					$(yoodoo.e("div")).addClass("experienceTitle").html(this.name)
				).css({
					width:size,
					height:size
				}).removeClass('experienceComplete').removeClass('notAvailable').addClass('experienceButton'+(this.complete?' experienceComplete':'')+(this.visible?'':' notAvailable')).append(icon);
				if (yoodoo.sessions.waitingToReveal.item!==undefined && yoodoo.sessions.waitingToReveal.item._experience===this && yoodoo.sessions.waitingToReveal.item._experience.started!==true) {
					this.timedReveal(yoodoo.sessions.waitingToReveal.when);
				}
				return $(this.buttonContainer);
			};
			this.timedRevealInterval=null;
			this.timedReveal=function(when) {
				if (this.timedRevealInterval!==null) clearInterval(this.timedRevealInterval);
				var togo=yoodoo.togo(when);
				if (togo!==false) {
					togo=togo.replace(/^(\d*) /,"<span>$1</span>");
					$(this.buttonContainer).addClass("timedReveal").append(
						$(yoodoo.e("span")).html(yoodoo.w("available_in")+togo)
					);
					var me=this;
					this.timedRevealInterval=setInterval(function() {
						if (typeof(me)=='object' && me.buttonContainer!==undefined && me.buttonContainer.parentNode!==null && $(me.buttonContainer).hasClass("timedReveal")) {
							var togo=yoodoo.togo(when);
							if (togo!==false) {
								togo=togo.replace(/^(\d*) /,"<span>$1</span>");
								$(me.buttonContainer).find("span").html(yoodoo.w("available_in")+togo);
							}else{
								clearInterval(me.timedRevealInterval);
								$(me.buttonContainer).removeClass('timedReveal').removeClass('notAvailable').addClass("nextExperience").find("span").remove();
								me.buttonContainer.disabled=false;
							}
						}else{
							clearInterval(me.timedRevealInterval);
						}
					},1000);
				}else{
					$(this.buttonContainer).removeClass('timedReveal').removeClass('notAvailable').addClass("nextExperience").find("span").remove();
					this.buttonContainer.disabled=false;
				}
			};
			this.firstIncomplete=function(afterThis) {
				if (typeof(afterThis)=='undefined' || afterThis===null) afterThis=false;
				for(var c=0;c<this._content.length;c++) {
					if (afterThis===false && this._content[c].completed!==true) return this._content[c];
					if (afterThis===this._content[c]) afterThis=false;
				}
				return false;
			};
			this.openNext=function() {
				if (this.lastviewed!==null && this.lastviewed.completed!==true) return false;
				var next=this.firstIncomplete(this.lastviewed);
				if (next===false && this.started===false) {
					yoodoo.display.remove(null,function() {
						yoodoo.session.closedContent();
					});
					//if (yoodoo.display.stack.length==0) yoodoo.sessions.showHub();
				}else if (next===false && this.complete===true) {
					//yoodoo.display.remove(null,function() {
						yoodoo.session.closedContent();
						yoodoo.session.show(yoodoo.sessions.currentSession().id)
					//});
				}else if (next!==false && (this.autoplay || next.autoplay)) next.open();
			};
			this.hiliteNext=function() {
				var next=this.firstIncomplete(this.lastviewed);
				if (next!==false) next.hilite();
			};
		},
		content:function(params,experience) {
			this.visible=true;
			this.toRemove=false;
			this._experience=experience;
			this.onclose=null;
			this.update = function(params) {
				this.toRemove=false;
				for(var k in params) this[k]=params[k];
				if (this.completed_date!==null) {
					try{
						eval('this.completed_date='+this.completed_date+';');
						this.completed_date=new Date(this.completed_date.getTime()+yoodoo.serverTimeOffset);
					}catch(e){}
				}
				if (this.created!==null) {
					try{
						eval('this.created='+this.created+';');
						this.created=new Date(this.created.getTime()+yoodoo.serverTimeOffset);
					}catch(e){}
				}
				this.button();
			};
			this.open = function() {
				if ($(this.buttonContainer).hasClass("itemCTA")) this._experience.started=false;
				this.onclose=null;
				if (arguments.length>0) this.onclose=arguments[0];
				$(this.buttonContainer).removeClass("itemCTA");
				yoodoo[this.content_type].show(this.content_id);
				//yoodoo.interface.content(this.content_id);
			};
			this.closed = function() {
				if (typeof(this.onclose)=="function") this.onclose();
			};
			this.hilite = function() {
				$(this.buttonContainer).addClass("itemCTA").siblings(".itemCTA").removeClass("itemCTA");
			};
			this.favouriteArray = function() { 
				var content=$(yoodoo.e("div")).css({
					position:'relative',
					color:'#fff',
					background:'rgba(0,0,0,0.5)',
					'text-align':'center',
					height:'100%'
				}).append(
					$(yoodoo.icons.get(this.content_type,50,50)).css({
						position:'absolute',
						right:10,
						bottom:10
					})
				).append(
					$(yoodoo.e("div")).html(this.name).css({
						position:'absolute',
						width:'100%',
						height:'100%',
						'box-sizing':'border-box',
						padding:'10px'
					})
				);
				return {
					id:this.content_id,
					title:this.name,
					type:this.content_type,
					colour:null,
					html:yoodoo.outerhtml(content),
					width:1,
					height:1,
					priority:30,
					onclick:'yoodoo.interface.session('+yoodoo.sessions._experiences[this.experience]._session.id+','+this.experience+','+this.content_id+')'
					//onclick:'yoodoo.interface.content('+this.content_id+')'
				};
			};
			this.button=function(size) {
				if (isNaN(size)) size=yoodoo.session.itemButtonHeight;
				if (this.buttonContainer===undefined) this.buttonContainer=$(yoodoo.e("button")).attr("type","button");
				this.buttonContainer.empty().unbind("click");
				this.buttonContainer.get(0).disabled=!this.visible;
				var me=this;
				$(this.buttonContainer).click(function() {
					me.open();
				});
				var icon=null;
				var colour='575757';
				if (this.completed) colour='8bc34a';
				if (!this.visible) colour='B2B2B2';
				//if (this.next) colour='f9ce1d';
				if (this.icon!==null) {
					icon=$(yoodoo.icons.get(this.icon,Math.floor(size*1),Math.floor(size*1),{'FFFFFF':colour}));
				}else{
					icon=yoodoo.icons.get(this.content_type,size,size,{'FFFFFF':colour});
				}
				var favIcon=null;
				if (this.earmarked) favIcon=$(yoodoo.icons.get('favouriteOn',Math.floor(size/2),Math.floor(size/2))).css({left:0});
				this.buttonContainer.html(
					this.name
				).css({
					height:(10+size)+'px',
					'line-height':size+'px',
					width:'100%'
				}).addClass('contentButton'+(this.complete?' contentComplete':'')+(this.visible?'':' notAvailable')).prepend(favIcon).prepend(icon);
				if (this.visible) {
					var next=yoodoo.icons.get('next',size/2,size/2,{'000000':colour});
					this.buttonContainer.append($(next).css({position:'absolute',right:0,'margin-top':size/4}));
				}
				if (yoodoo.sessions.waitingToReveal.item!==undefined && yoodoo.sessions.waitingToReveal.item===this && yoodoo.sessions.waitingToReveal.item.completed!==true) {
					this.timedReveal(yoodoo.sessions.waitingToReveal.when);
				}
				return this.buttonContainer;
			};
			
			this.timedRevealInterval=null;
			this.timedReveal=function(when) {
				if (this.timedRevealInterval!==null) clearInterval(this.timedRevealInterval);
				var togo=yoodoo.togo(when);
				if (togo!==false) {
					togo=togo.replace(/^(\d*) /,"<span>$1</span>");
					$(this.buttonContainer).addClass("timedReveal").append(
						$(yoodoo.e("span")).html(yoodoo.w("available_in")+togo)
					);
					var me=this;
					this.timedRevealInterval=setInterval(function() {
						if (typeof(me)=='object' && me.buttonContainer!==undefined && me.buttonContainer.parentNode!==null && $(me.buttonContainer).hasClass("timedReveal")) {
							var togo=yoodoo.togo(when);
							if (togo!==false) {
								togo=togo.replace(/^(\d*) /,"<span>$1</span>");
								$(me.buttonContainer).find("span").html(yoodoo.w("available_in")+togo);
							}else{
								clearInterval(me.timedRevealInterval);
								me.visible=true;
								me.buttonContainer.removeClass('timedReveal').removeClass('notAvailable').find("span").remove();
								me.buttonContainer.append(
									$(yoodoo.icons.get("next",25,25)).css({
										position:'absolute',
										right:'0px',
										'margin-top':'12.5px'
									})
								).get(0).disabled=false;
							}
						}else{
							clearInterval(me.timedRevealInterval);
						}
					},1000);
				}
			};
			this.update(params);
		},
		widget:function(params) {
			this.width=1;
			this.height=1;
			this.toDelete=false;
			this.data=null;
			this.priority=50;
			for(var k in params) this[k]=params[k];
			this.configure=function(obj) {
				this.data=obj;
				if (this.data.exercise!==undefined && this.data.exercise.display!==undefined) {
					this.data.exercise.display=yoodoo.parseJSON(Base64.decode(this.data.exercise.display));
				}
			};
			this.dependencies=function() {
				if (this.data.exercise!==undefined && this.data.exercise.display!==undefined && this.data.exercise.display.dependencies!==undefined) return this.data.exercise.display.dependencies;
				return [];
			};
			this.build=function() {
				if (this.data.exercise!==undefined && this.data.exercise.display!==undefined && this.data.exercise.display.ready!==undefined) {
					this.data.exercise.display.ready(this);
				}
				if (typeof(this.object.build=='function')) this.object.build();
			};
			this.showIntervention=function() {
				if (yoodoo.sessions._interventions[this.session_id]!==undefined) yoodoo.sessions.showIntervention(this.session_id);
			};
			this.drawWidget=function(params) {
				var obj={
					id:this.content_id,
					html:null,
					colour:'#ffffff',
					background:null,
					width:1,
					height:1,
					belowCTA:false,
					priority:this.priority,
					onclick:'yoodoo.sessions._widgets['+this.exercise_id+'].showIntervention()'
				};
				for(var k in params) obj[k]=params[k];
				if (obj.html===null) {
					yoodoo.interface.dropWidget(this.content_id);
				}else{
					if (obj.background!==null) {
						var rgb=yoodooStyler.hexToRGB(obj.background);
						obj.background='rgba('+rgb.r+','+rgb.g+','+rgb.b+',0.2)';
					}else{
						obj.background='none';
					}
					obj.html='<div style="box-sizing:border-box;height:100%;padding:10px;background:'+obj.background+'">'+obj.html+'</div>';
					obj.background=null;
					yoodoo.interface.drawWidget(obj);
				}
			};
			this.drawTool=function(params) {
				var obj={
					id:this.content_id,
					title:this.name,
					html:null,
					icon:yoodoo.icons.get('settings',20,20),
					colour:null,
					background:null,
					priority:this.priority,
					onclick:'yoodoo.sessions._widgets['+this.exercise_id+'].showIntervention()'
					//onclick:'alert("boo")'
				};
				for(var k in params) obj[k]=params[k];
				if (obj.html===null) {
					yoodoo.interface.dropTool(this.content_id);
				}else{
					if (obj.background!==null) {
						var rgb=yoodooStyler.hexToRGB(obj.background);
						obj.background='rgba('+rgb.r+','+rgb.g+','+rgb.b+',0.2)';
					}
					obj.html='<div style="padding:10px;">'+obj.html+'</div>';
					yoodoo.interface.drawTool(obj);
				}
			};
		}
	}
};
