yoodoo.session = {
	container: null,
	itemButtonHeight:50,
	experienceIndex:0,
	contentIndex:0,
	experience:null,
	content:null,
	calledIds:{
		id:undefined,
		expId:undefined,
		conId:undefined
	},
	show: function (id,expId,conId) {
		this.calledIds={
			id:id,
			expId:expId,
			conId:conId
		};
		yoodoo.sessions.show(id);
		this.container = $(yoodoo.e("div")).addClass("sessionDisplay").css({
			height: '100%',
			width: '100%',
			position: 'absolute'
		});
		this.session = yoodoo.sessions.getSession(id);
		if (this.session === false) return false;

		if (this.session.intervention===true) {
			if (this.session.experiences.length>0) {
				this.experienceIndex=0;
				this.experience=this.session.experiences[0];
				if (this.experience.isEmpty===false && this.experience._content.length>0) {
					this.content=null;
					this.contentIndex=0;
					while(this.content===null && this.contentIndex<this.experience._content.length) {
						if (this.experience._content[this.contentIndex].visible===true) {
							this.content=this.experience._content[this.contentIndex];
						}else{
							this.contentIndex++;
						}
					}
					var me=this;
					if (this.content!==null) yoodoo.interface.content(this.content.content_id,function() {
						me.closedContent();
					});
				}
			}
		}else{

			var header = yoodoo.buildHeader({
				logo: yoodoo.logo.svg,
				logoWidth: yoodoo.logo.width,
				logoHeight: yoodoo.logo.height,
				menu: false,
				back: 'yoodoo.display.remove("session");',
				search: true,
				community: true,
				title: yoodoo.w("_session")
			});
	
			this.page_container = $(yoodoo.e("div")).css({
				height: '100%',
				padding: yoodoo.header_height + 'px 0px 0px 0px',
				'box-sizing': 'border-box'
			});
	
			
			this.pages=undefined;
			//this.drawSessionPages();
			
			this.container.append(header).append(this.page_container);
			var displayParams={
				name:'session',
				obj:this.container,
				hideBelow:true,
				animate:yoodoo.display.stack.length>0,
				added:function() {
					yoodoo.session.drawSessionPages();
					if (yoodoo.session.experience!==null && yoodoo.session.experience._session!==undefined) yoodoo.session.session.slideToFirstIncomplete();
				},
				revealed:function() {
					yoodoo.session.drawSessionPages();
					if (yoodoo.session.experience!==null && yoodoo.session.experience._session!==undefined) yoodoo.session.session.slideToFirstIncomplete();
				},
				removed:function() {
					//if (yoodoo.isApp) 
					yoodoo.fetchHub();
				}
			};
			if (typeof(yoodoo.session.calledIds.conId)!="undefined") displayParams.complete=function() {
				yoodoo.session.showExperience(yoodoo.session.calledIds.expId,yoodoo.session.calledIds.conId);
			};
			
			
			yoodoo.display.add(displayParams);
			for (var s = 0; s < yoodoo.sessions._sessions.length; s++) {
				var sess = yoodoo.sessions._sessions[s];
				sess.slideToFirstIncomplete(yoodoo.session.calledIds.expId);
			}
			this.pages.gotoPage(this.calledIds.active, true);
			/*for (var s = 0; s < yoodoo.sessions._sessions.length; s++) {
				yoodoo.sessions._sessions[s].experienceSlider.gotoPage(yoodoo.sessions._sessions[s].nextExperience, true);
			}*/
				
		}
	},
	drawSessionPages:function() {
		if (this.page_container===undefined) return false;
			var newPages=false;
			if (this.pages===undefined) {
				this.pages = new yoodoo.ui.pages({
					height: '100%',
					pageDotsUnder: false,
					navButtons: false,
					pageDotsClass: 'blue'
				});
				newPages=true;
				$(this.page_container).empty().append(this.pages.container);
			}
			var hideAfter = false;
			this.calledIds.active = 0;
			var sessionList=yoodoo.sessions._sessions;
			for (var s = 0; s < sessionList.length; s++) {
				var sess = sessionList[s];
				if (sess.isEmpty === false) {
					if (sess.id == this.calledIds.id) {
						this.calledIds.active = this.pages.pages.length;
					}
					if (sess.page===undefined || newPages) {
						sess.page = this.pages.addPage({
							disabled: hideAfter
						});
						sess.page.empty().append($(yoodoo.e("h2")).html(sess.name));
						sess.page.append($(yoodoo.e("p")).html(sess.short_description));
		
						sess.page.append(sess.pieChart(200));
		
						if (sess.experienceSlider===undefined || newPages) sess.experienceSlider = new yoodoo.ui.pages({
							height: 'auto',
							pageDots: false,
							navButtons: false
						});
						sess.page.append(sess.experienceSlider.container);
						sess.page.append($(yoodoo.e("p")).html(sess.long_description));
					}else{
						sess.page.setDisable(hideAfter);
						sess.pieChart(200);
						sess.page.setLast();
					}
					if (sess.hideAfter) hideAfter = true;
					//$(yoodoo.e("div")).addClass('experienceSlider');
					for (var e = 0; e < sess.experiences.length; e++) {
						if (sess.experiences[e].isEmpty===false) {
							if (sess.experiences[e].page===undefined || newPages) {
								sess.experiences[e].page = sess.experienceSlider.addPage({
									width: 'auto',
									height: 'auto',
									disabled: !sess.experiences[e].visible,
									className: 'experienceButtonContainer'
								});
							}
							sess.experiences[e].page.setDisable(!sess.experiences[e].visible);
							sess.experiences[e].page.setLast();
							sess.experiences[e].page.empty().append(sess.experiences[e].button(70));
						}
					}
					if (yoodoo.display.getIndex("session")!==false) {
						var revealing=$(sess.experienceSlider.container).find('.timedReveal');
						var z=parseInt(yoodoo.display.stack[yoodoo.display.getIndex("session")].obj.css("z-index"));
						if (revealing.get().length>0) {
							revealing.css({
								'z-index':z+1
							});
						}
					}
					sess.slideToFirstIncomplete=function(id) {
						if (typeof(id)!="undefined" && this.slideToExperience(id)) return false;
						
						this.nextExperience=0;
						var hilite=null;
						var found=false;
						for (var e = 0; e < this.experiences.length; e++) {
							if (this.experiences[e].isEmpty===false) {
								if (found===false && this.experiences[e].complete===false) {
									found=true;
								}else if (found===false) {
									this.nextExperience++;
								}
								if (found===true && hilite===null) hilite=e;
								if ($(this.experiences[e].buttonContainer).hasClass("timedReveal")===false) $(this.experiences[e].buttonContainer).removeClass('nextExperience').css({'z-index':'initial'});
							}
						}
						if (hilite!==null && this.experiences[hilite].visible===true) $(this.experiences[hilite].buttonContainer).addClass("nextExperience").css({
							'z-index':parseInt(yoodoo.display.stack[yoodoo.display.getIndex("session")].obj.css("z-index"))+1
						});
						this.experienceSlider.gotoPage(this.nextExperience,false);
					};
					sess.slideToExperience=function(id) {
						this.nextExperience=0;
						for (var e = 0; e < this.experiences.length; e++) {
							if (this.experiences[e].isEmpty===false) $(this.experiences[e].buttonContainer).removeClass('nextExperience');
						}
						for (var e = 0; e < this.experiences.length; e++) {
							if (this.experiences[e].isEmpty===false) {
								if (this.experiences[e].id===id) {
									this.nextExperience=e;
									this.experienceSlider.gotoPage(this.nextExperience,false);
									//$(this.experiences[e].buttonContainer).addClass("nextExperience");
									return true;
								}
							}
						}
						return false;
					};
					
					//sess.page.append(sess.experienceSlider.container);
					//sess.page.append($(yoodoo.e("p")).html(sess.long_description));
				}
			}
	},
	closedContent:function() {
		if (this.session.intervention===true) {
			this.content=null;
			this.contentIndex++;
			while(this.content===null && this.contentIndex<this.experience._content.length) {
				if (this.experience._content[this.contentIndex].visible===true) {
					this.content=this.experience._content[this.contentIndex];
				}else{
					this.contentIndex++;
				}
			}
			
			if (this.content===null) {
				this.experience=null;
				this.experienceIndex++;
				while(this.experience===null && this.experienceIndex<this.session.experiences.length) {
					if (this.session.experiences[this.experienceIndex].isEmpty===false) {
						this.experience=this.session.experiences[this.experienceIndex];
					}else{
						this.experienceIndex++;
					}
				}
				if (this.experience!==null) {
					this.content=null;
					this.contentIndex=0;
					while(this.content===null && this.contentIndex<this.experience._content.length) {
						if (this.experience._content[this.contentIndex].visible===true) {
							this.content=this.experience._content[this.contentIndex];
						}else{
							this.contentIndex++;
						}
					}
				}
			}
			var me=this;
			if (this.content!==null) {
				yoodoo.interface.content(this.content.content_id,function() {
					me.closedContent();
				});
			}else{
				if (yoodoo.display.stack.length==0 || yoodoo.isApp) {
					yoodoo.fetchHub();
				}
			}
		}
//		this.experience.openNext();
	},
	pieChart:function(params) {
		this.params = {
			dia:100,
			total:30,
			fullPie:60,
			value:10,
			startAngle:0,
			finishAngle:2,
			valueAngle:2,
			outsideRadius:0.45,
			insideRadius:0.32,
			outsideValueRadius:'-5',
			insideValueRadius:'-3',
			totalColour:'#33691e',
			valueColour:'#8bc34a',
			baseColour:'#bdbdbd',
			centerColour:'#fafafa',
			text:null
		};
		for(var k in params) this.params[k]=params[k];
		if (this.params.text===null) this.params.text=[this.params.total.toString(),'mins'];
		this.pie = document.createElementNS("http://www.w3.org/2000/svg", "svg");
		this.pie.setAttribute('type', 'image/svg+xml');
		this.pie.setAttribute('width', this.params.dia);
		this.pie.setAttribute('height', this.params.dia);
		this.pieBase=document.createElementNS("http://www.w3.org/2000/svg", "circle");
		this.pieCenter=document.createElementNS("http://www.w3.org/2000/svg", "circle");
		this.pieTotal=document.createElementNS("http://www.w3.org/2000/svg", "path");
		this.pieValue=document.createElementNS("http://www.w3.org/2000/svg", "path");
		this.pieText1=document.createElementNS("http://www.w3.org/2000/svg", "text");
		this.pieText2=document.createElementNS("http://www.w3.org/2000/svg", "text");
		//this.pieTextLine1=document.createElementNS("http://www.w3.org/2000/svg", "tspan");
		//this.pieTextLine2=document.createElementNS("http://www.w3.org/2000/svg", "tspan");
		this.pie.appendChild(this.pieBase);
		this.pie.appendChild(this.pieCenter);
		this.pie.appendChild(this.pieTotal);
		this.pie.appendChild(this.pieValue);
		//this.pie.appendChild(this.pieText1);
		//this.pie.appendChild(this.pieText2);
		this.update=function(params) {
			for(var k in params) this.params[k]=params[k];
			if (this.params.text===null) this.params.text=[this.params.total.toString(),'mins'];
			return this.draw();
		};
		this.draw=function() {
			//this.pieText1.innerHTML=this.params.text[0];
			//this.pieText1.setAttribute("x","50%");
			//this.pieText1.setAttribute('x',(this.params.dia/2));
			//this.pieText1.setAttribute('y',(this.params.dia/2));
			//this.pieText1.setAttribute('text-anchor','middle');
			//$(this.pieText1).css({'font-size':(this.params.dia/4)+'px'});
			//this.pieText2.innerHTML=this.params.text[1];
			//this.pieText2.setAttribute("x","50%");
			//this.pieText2.setAttribute('x',(this.params.dia/2));
			//this.pieText2.setAttribute("y",(this.params.dia/2)+20);
			//this.pieText2.setAttribute('text-anchor','middle');
			//this.pieText.appendChild(this.pieTextLine1);
			//this.pieText.appendChild(this.pieTextLine2);
			//this.pieText.setAttribute('text-anchor','middle');
			//this.pieText.setAttribute('x',(this.params.dia/2));
			//this.pieText.setAttribute('y','50%');
			var da=(2*Math.PI)/this.params.fullPie;
			this.params.valueAngle=this.params.value*da;
			this.params.finishAngle=this.params.total*da;
			var r1=this.params.dia*this.params.outsideRadius;
			var r2=this.params.dia*this.params.insideRadius;
			var r3=this.params.dia*this.params.outsideValueRadius;
			if (typeof(this.params.outsideValueRadius)=="string") r3=r1+parseInt(this.params.outsideValueRadius);
			var r4=this.params.dia*this.params.insideValueRadius;
			if (typeof(this.params.insideValueRadius)=="string") r4=r2+parseInt(this.params.insideValueRadius);
			var dir='0,1';
			var insidedir='0,0';
			if (this.params.finishAngle-this.params.startAngle>Math.PI) {
				dir='1,1';
				insidedir='1,0';
			}
			var valuedir='0,1';
			var valueinsidedir='0,0';
			if (this.params.valueAngle-this.params.startAngle>Math.PI) {
				valuedir='1,1';
				valueinsidedir='1,0';
			}
			this.pieBase.setAttribute('cx',this.params.dia/2);
			this.pieBase.setAttribute('cy',this.params.dia/2);
			this.pieBase.setAttribute('r',r1);
			this.pieBase.setAttribute('stroke','none');
			this.pieBase.setAttribute('fill',this.params.baseColour);
			this.pieCenter.setAttribute('cx',this.params.dia/2);
			this.pieCenter.setAttribute('cy',this.params.dia/2);
			this.pieCenter.setAttribute('r',r2);
			this.pieCenter.setAttribute('stroke','none');
			this.pieCenter.setAttribute('fill',this.params.centerColour);
			this.pieTotal.setAttribute('d','M'+this.xy(this.params.startAngle,r1)+' A'+r1+','+r1+' 0 '+dir+' '+this.xy(this.params.finishAngle,r1)+' L'+this.xy(this.params.finishAngle,r2)+' A'+r2+','+r2+' 0 '+insidedir+' '+this.xy(this.params.startAngle,r2)+' L'+this.xy(this.params.startAngle,r1));
			this.pieTotal.setAttribute('style',"stroke: "+this.params.totalColour+"; stroke-width:1; fill:"+this.params.totalColour+";");
			if (this.params.value>0) {
				this.pieValue.setAttribute('d','M'+this.xy(this.params.startAngle,r3)+' A'+r3+','+r3+' 0 '+valuedir+' '+this.xy(this.params.valueAngle,r3)+' L'+this.xy(this.params.valueAngle,r4)+' A'+r4+','+r4+' 0 '+valueinsidedir+' '+this.xy(this.params.startAngle,r4)+' L'+this.xy(this.params.startAngle,r3));
				this.pieValue.setAttribute('style',"stroke: "+this.params.valueColour+"; stroke-width:1; fill:"+this.params.valueColour+";");
			}
			if (this.surround===undefined) this.surround=$(yoodoo.e("div"));
			this.surround.empty().append(this.pie).append(
				$(yoodoo.e("div")).html(this.params.text[1]).prepend(
					$(yoodoo.e("div")).html(this.params.text[0]).css({
						'font-size':(this.params.dia/4)+'px'
					})
				)
			).addClass('pieChart');
			return this.surround;
		};
		this.xy=function(a,r) {
			var x=(this.params.dia/2)+(r*Math.sin(a));
			var y=(this.params.dia/2)-(r*Math.cos(a));
			return x.toFixed(1)+','+y.toFixed(1);
		};
	},
	showExperience:function(id,conId) {
		if (yoodoo.sessions._experiences[id]!==undefined) {
			this.experience=yoodoo.sessions._experiences[id];
			var expDiv=$(yoodoo.e("div")).addClass("experienceDisplay");
			
			var expList=$(yoodoo.e("div")).addClass("experienceList").css({
				'padding-top':yoodoo.header_height
			});
			expDiv.append(expList);
			
			expDiv.append(yoodoo.buildHeader({
				logo: yoodoo.logo.svg,
				logoWidth: yoodoo.logo.width,
				logoHeight: yoodoo.logo.height,
				menu: false,
				back: 'yoodoo.display.remove()',
				//search: true,
				//community: true,
				title: this.experience.name
			}));

			
			
			for(var c in this.experience._content) {
				expList.append(this.experience._content[c].button(yoodoo.session.itemButtonHeight));
			}
			var me=this;
			var params={
				name:'experience',
				obj:expDiv,
				hideBelow:true,
				animate:true,
				complete:function() {
					if (me.experience.started!==true) {
						me.experience.openNext();
					}else{
						me.experience.hiliteNext();
					}
				},
				revealed:function() {
					expList.empty();
					for(var c in me.experience._content) {
						expList.append(me.experience._content[c].button(yoodoo.session.itemButtonHeight));
					}
					if (me.experience.started!==true && me.experience.complete===true) {
						me.experience.started=true;
						yoodoo.display.remove("experience");
					}
				}
			};
			if (typeof(conId)!="undefined") params.complete=function() {
				yoodoo.interface.content(conId);
			};
			yoodoo.display.add(params);
		}
	}, 
	showContent:function(id) {
		if (yoodoo.sessions._content[id]!==undefined) {
			//console.log(yoodoo.sessions._content[id]);
			if (arguments.length>1) {
				yoodoo.sessions._content[id].open(arguments[1]);
			}else{
				yoodoo.sessions._content[id].open();
			}
		}
	}
};





yoodoo.dooit={
	params:{},
	item:null,
	loader:null,
	arena:null,
	snapshots:[],
	show:function(id) {
		if (yoodoo.sessions._content[id]===undefined) return false;
		this.item=yoodoo.sessions._content[id];
		yoodoo.interface.showDialog(yoodoo.w('_loading')+' '+this.item.name+'&hellip;');
		yoodoo.voiceoverfile=(this.item.exercisevoice=='' || this.item.exercisevoice===null)?'':yoodoo.replaceDomain('audiodomain:'+this.item.exercisevoice);
		if (yoodoo.voiceoverfile!="") yoodoo.audio.preload(yoodoo.voiceoverfile);
		//yoodoo.startVoiceover(true);
		yoodoo.sendPost(null,{
			cmd:'dooit',
			dooit:this.item.exercise_id,
			context:this,
			callback:'yoodoo.dooit.got'
		});
	},
	got:function(reply) {
		this.item._experience.opened(this.item);
		var arr=$.parseJSON(reply);
		for(var k in arr) {
			if (/^new Date/.test(arr[k])) eval("arr[k]="+arr[k]+";");
		}
		this.params=arr;
		try{
			eval('yoodoo.dooit.params.display='+this.params.display+';');
			for(var k in this.params.fields) {
				this.params.fields[k][1]=Base64.decode(this.params.fields[k][1]);
				var txt=this.params.fields[k][1].replace(/[\"\'](new Date\([^\)^\"^\']+\))[\"\']/g,"\$1");
				try{
					eval('this.params.fields[k][1]='+txt);
					//this.params.fields[k][1]=$.parseJSON(this.params.fields[k][1]);
				}catch(e) {
					//yoodoo.errorLog(e);
					try{
						this.params.fields[k][1]=$.parseJSON(txt);
					}catch(e) {
						//yoodoo.errorLog(e);
						this.params.fields[k][1]=txt;
					}
				}
			}
			if (this.params.display.canSnapshot!==undefined) this.params.canSnapshot=this.params.display.canSnapshot;
			this.snapshots=[];
			if (this.params.snapshots instanceof Array) {
				for(var s=0;s<this.params.snapshots.length;s++) {
					this.snapshots.push(new this.snapshot(this.params.snapshots[s]));
				}
			}
			this.loader=new yoodoo.fileLoader.loader(this.params.display.dependencies,function() {
				yoodoo.dooit.init.apply(yoodoo.dooit,[]);
			});
		}catch(e) {
			yoodoo.interface.hideDialog();
			yoodoo.messages.show({type:'error',text:'Cannot understand the configuration'});
			yoodoo.errorLog(e);
		}
	},
	init:function() {
		this.arena=$(yoodoo.e("div")).addClass("dooitDisplay").css({
				'padding-top':yoodoo.header_height
		});
		this.donebutton=$(yoodoo.e("button")).attr("type","button").html(yoodoo.w("_done")).addClass("doneButton");
		
		var saveButton=$(yoodoo.e("button")).attr("type","button").html(yoodoo.w('_save_and_leave_anyway')).click(function() {
			yoodoo.dooit.save();
		}).addClass("positiveAction");
		var cancelButton=$(yoodoo.e("button")).attr("type","button").html(yoodoo.w('_stay_here')).click(function() {
			yoodoo.dooit.donebutton.removeClass("prompted");
		}).addClass("negativeAction");
		
		
		this.doneprompt=$(yoodoo.e("div")).addClass("savePrompt").html('<p>'+yoodoo.w('_this_is_not_complete')+'</p>').append(saveButton).append(cancelButton);
		this.savepromptBlockout=$(yoodoo.e("div")).addClass("savePromptBlockout");
		this.donebuttonContainer=$(yoodoo.e("div")).addClass("doneButtonContainer").append(this.donebutton).append(this.savepromptBlockout).append(this.doneprompt);
		$(this.donebutton).click(function() {
			if ($(this).hasClass("savable")) $(this).addClass("prompted");
			if ($(this).hasClass("finishable")) yoodoo.dooit.save();
		});
		this.header=yoodoo.buildHeader({
			logo: yoodoo.logo.svg,
			logoWidth: yoodoo.logo.width,
			logoHeight: yoodoo.logo.height,
			menu: yoodoo.dooit.menu(),
			buttons: [
				{icon:'community',action:'yoodoo.interface.community('+this.item.content_id+')'},
				{icon:"favourite"+(this.item.earmarked?'On':''),action:'yoodoo.dooit.favourite()'}
			],
			search: false,
			community: false,
			//favourite: {on:this.item.earmarked,action:'yoodoo.dooit.favourite();'},
			title: yoodoo.dooit.params.title
		});
		this.arenaContainer=$(yoodoo.e("div")).addClass("dooitArena").append(this.header).append(this.arena).append(this.donebuttonContainer);
		if (typeof(this.params.display.dooit)=='string') {
			var obj={};
			try{
				eval('obj='+this.params.display.dooit+';');
				yoodoo.dooit_standardize(obj);
				dooit.temporaries(this.params.display.dooit);
				if (this.params.display.loaded===undefined) this.params.display.loaded=function() {obj.init();};
				if (this.params.display.displayed===undefined) this.params.display.displayed=this.params.display.dooit+'.displayed';
				if (this.params.display.saveValues===undefined) this.params.display.saveValues=[this.params.display.dooit+'.output'];
				if (this.params.display.finished===undefined) this.params.display.finished=this.params.display.dooit+'.finishable';
			}catch(e){
				yoodoo.errorLog(e);
			}
		}
		if (typeof(this.params.display.loaded)=='function') {
			this.params.display.loaded();
		}else{
			try{
				eval(this.params.display.loaded+'()');
			}catch(e) {
				yoodoo.errorLog(e);
			}
		}
		if (this.params.display.orientation!==undefined) yoodoo.interface.setOrientation(this.params.display.orientation);
		var complete=this.params.display.displayed;
		yoodoo.display.add({
			name:'dooit',
			hideBelow:true,
			obj:this.arenaContainer,
			animate:true,
			added:function() {
				yoodoo.interface.hideDialog();
				if (typeof(complete)=='function') {
					complete();
				}else{
					try{
						eval(complete+'()');
					}catch(e) {
						yoodoo.errorLog(e);
					}
				}
				yoodoo.dooit.checkDone();
				if (yoodoo.voiceoverfile!="") yoodoo.audio.play();
			},
			removed:function() {
				yoodoo.dooit.cancel();
			}
		});
		this.arena.bind("keyup mouseup touchend", function() {
			yoodoo.dooit.checkDone.apply(yoodoo.dooit,[]);
		});
	},
	toggleVoiceover:function() {
		if (yoodoo.voiceoverfile!="") {
			if (yoodoo.audio.playing) {
				yoodoo.audio.pause();
			}else{
				yoodoo.audio.play();
			}
		}
	},
	snapshotIds:{},
	snapshot:function(params) {
		this.render=function() {
			if (this.container===undefined) this.container=$(yoodoo.e("button")).attr("type","button");
			var me=this;
			this.container.html(yoodoo.formatDate("jS M 'y",this.created)).prepend(
				$(yoodoo.e('span')).html(this.length+'B')
			).prepend(yoodoo.icons.get("snapshot",20,20)).unbind('click').click(function() {
				yoodoo.dooit.snapshotter.load(me);
			});
			return this.container;
		};
		this.delete=function() {
			yoodoo.interface.showDialog(yoodoo.w('deleting_snapshot')+'&hellip;');
			yoodoo.sendPost(null,{
				cmd:'deleteSnapshot',
				snapshotId:this.id,
				context:this,
				callback:'yoodoo.dooit.snapshotIds['+this.id+'].deleted'
			});
		};
		this.deleted=function(r) {
			yoodoo.interface.hideDialog();
			for(var s=yoodoo.dooit.snapshots.length-1;s>=0;s--) {
				if (yoodoo.dooit.snapshots[s].id==this.id) yoodoo.dooit.snapshots.splice(s,1);
			}
			yoodoo.dooit.snapshotIds[this.id]=undefined;
			this.container.slideUp(300,function() {
				$(this).remove();
			});
		};
		this.update=function(params) {
			for(k in params) this[k]=params[k];
			var d=new Date();
			try{
				eval('d='+this.created);
				this.created=d;
				this.created=new Date(this.created.getTime()+yoodoo.serverTimeOffset);
			}catch(e) {
				yoodoo.errorLog(e);
			}
			yoodoo.dooit.snapshotIds[this.id]=this;
			if (typeof(this.data)=="string") {
				try{
					this.data=$.parseJSON(this.data);
					for(var k in this.data) {
						if (typeof(this.data[k][1])=="string") {
							var d=null;
							try{
								eval('d='+this.data[k][1]);
							}catch(e) {
								console.log(k,'failed to read data',this.data[k][1]);
							}
							this.data[k][1]=d;
						}
					}
				}catch(e) {
					yoodoo.errorLog(e);
					console.log('failed to read data',this.data);
				}
			}
		};
		this.open=function() {
			for(var k in this.data) {
				yoodoo.dooit.params.fields[k][1]=this.data[k][1];
			}
			yoodoo.dooit.params.display.loaded();
			if (typeof(yoodoo.dooit.params.display.displayed)=="function") {
				yoodoo.dooit.params.display.displayed();
			}else{
				try{
					eval(yoodoo.dooit.params.display.displayed+'()');
				}catch(e) {
					yoodoo.errorLog(e);
				}
			}
			yoodoo.dooit.params.snapshotId=this.id;
			yoodoo.dooit.params.snapshotAuthor=(this.user===undefined)?null:this.user;
		};
		this.update(params);
	},
	favourite:function() {
		yoodoo.interface.showDialog(yoodoo.w('sending')+' '+this.item.name+'&hellip;');
		yoodoo.sendPost(null,{
			cmd:'earmark',
			book:this.item.content_id,
			context:this,
			callback:'yoodoo.dooit.favouriteSet'
		});
	},
	favouriteSet:function(response) {
		yoodoo.interface.hideDialog();
		if (response=='completed') {
			this.item.earmarked=!this.item.earmarked;
			
			if (this.item.earmarked) {
				yoodoo.sessions._favourites[this.item.content_id]=this.item.favouriteArray();
				yoodoo.interface.drawFavourite(yoodoo.sessions._favourites[this.item.content_id]);
			}else{
				yoodoo.sessions._favourites[this.item.content_id]=undefined;
				yoodoo.interface.dropFavourite(this.item.content_id);
			}
			var newHeader=yoodoo.buildHeader({
				logo: yoodoo.logo.svg,
				logoWidth: yoodoo.logo.width,
				logoHeight: yoodoo.logo.height,
				menu: yoodoo.dooit.menu(),
				buttons: [
					{icon:'community',action:'yoodoo.interface.community('+this.item.content_id+')'},
					{icon:"favourite"+(this.item.earmarked?'On':''),action:'yoodoo.dooit.favourite()'}
				],
				search: false,
				community: false,
				//favourite: {on:this.item.earmarked,action:'yoodoo.dooit.favourite();'},
				title: yoodoo.dooit.params.title
			});
			$(newHeader).insertBefore(this.header);
			$(this.header).remove();
			this.header=newHeader;
			//if (yoodoo.ifApp()===false) yoodoo.sessions.showHub();
		}
	},
	finishable:false,
	checkDone:function() {
		if (yoodoo.dooit.params.display===undefined) return false;
		var finishable=true;
		if (typeof(this.params.display.finished)=='function') {
			finishable=this.params.display.finished();
		}else if (typeof(this.params.display.finished)=='string') {
			//var func=function(){return true;};
			try{
				eval('finishable='+this.params.display.finished+'()');
			}catch(e){
				yoodoo.errorLog(e);
			}
			//finishable=func();
		}
		if (typeof(finishable)=='boolean') {
			if (finishable) {
				this.donebutton.addClass('finishable');
			}else{
				this.donebutton.removeClass('finishable');
			}
		}else{
			if (finishable.canComplete){
				this.donebutton.addClass('finishable').removeClass('savable');
				if (finishable.hilite && yoodoo.dooit.item.completed!==true) {
					this.donebutton.addClass('hilite');
				}else{
					this.donebutton.removeClass('hilite');
				}
			}else if(finishable.canSave) {
				this.donebutton.addClass('savable').removeClass('finishable').removeClass('hilite');
			}else{
				this.donebutton.removeClass('savable').removeClass('finishable').removeClass('hilite');
			}
		}
		this.finishable=finishable;
	},
	save:function(withoutClosing) {
		yoodoo.stopVoiceover();
		this.closeOnSaved=(withoutClosing!==true);
		yoodoo.ui.runRuleCache();
		var toSave={
			cmd:yoodoo.cmd.dooitsave.server,
			callback:'yoodoo.dooit.saved',
			completed:(this.finishable===true || this.finishable.canComplete===true),
			context:yoodoo.dooit,
			dooit:yoodoo.dooit.item.exercise_id
		};
		if (this.params.display.saveValues!==undefined) {
			var params=this.saveValues();
			yoodoo.sessions.dooitFieldsUpdateWidgets(params);
			for(var k in params) params[k]=Base64.encode(params[k]);
			for(var k in toSave) params[k]=toSave[k];
			yoodoo.interface.showDialog(yoodoo.w('saveandupdate'));
			yoodoo.sendPost(null,params);
		}
	},
	loadSnaphot:function(snapshotId) {
		if (this.snapshotIds[snapshotId]!==undefined && this.snapshotIds[snapshotId].data!==undefined) {
			this.snapshotIds[snapshotId].open();
		}else{
			yoodoo.interface.showDialog('Loading snapshot...');
			yoodoo.sendPost(null,{
				cmd:'getSnapshot',
				contentId:this.item.content_id,
				snapshotId:snapshotId,
				context:this,
				callback:'yoodoo.dooit.loadedSnapshot'
			});
		}
	},
	loadedSnapshot:function(r) {
		r=this.snapshotted(r);
		
		r.open();
	},
	makeSnapshot:function() {
		var val = this.saveValues();
		var op={};
		for(var k in this.params.fields) {
			if (val['EF'+this.params.fields[k][0]]!==undefined) op[k]=[this.params.fields[k][0],val['EF'+this.params.fields[k][0]]];
		}
		return window.JSON.stringify(op);
	},
	saveSnapshot:function() {
		yoodoo.interface.showDialog(yoodoo.w("sending"));
		var params={
			cmd:'createSnapshot',
			callback:'yoodoo.dooit.snapshotted',
			contentid:this.item.content_id,
			context:yoodoo.dooit,
			data:this.makeSnapshot()
		};
		yoodoo.sendPost(null,params);
	},
	snapshotted:function(r) {
		yoodoo.interface.hideDialog();
		var tmp=$.parseJSON(r);
		if (this.snapshotIds[tmp.id]!==undefined) {
			this.snapshotIds[tmp.id].update(tmp);
			return this.snapshotIds[tmp.id];
		}else{
			var ss=new this.snapshot(tmp);
			this.snapshots.push(ss);
			this.snapshotIds[ss.id]=ss;
			if (yoodoo.dooit.snapshotter.on) {
				yoodoo.dooit.snapshotter.list.append(ss.render());
			}
			return ss;
		}
	},
	saveValues:function() {
		var toSave={};
		if (this.params.display.saveValues instanceof Array) {
			for(var i in this.params.display.saveValues) {
				var op={};
				if (typeof(this.params.display.saveValues[i])=='string') {
					try{
						eval('op='+this.params.display.saveValues[i]+'();');
					}catch(e){
						yoodoo.errorLog(e);
					}
				}else if (typeof(this.params.display.saveValues[i])=='function'){
					op=this.params.display.saveValues[i]();
				}
				for(var k in op) toSave[k]=op[k];
			}
		}else if (typeof(this.params.display.saveValues)=='function'){
			toSave=this.params.display.saveValues();
		}
		return toSave;
	},
	saved:function(reply) {
		yoodoo.interface.hideDialog();
		reply=$.parseJSON(reply);
		yoodoo.sessions.syllabus.apply(yoodoo.sessions,[reply.syllabus]);
		if (reply.tags!==undefined) yoodoo.sessions._tags=reply.tags;
		yoodoo.dooit.item.button();
		if (this.closeOnSaved) this.cancel(function() {
			if (yoodoo.session.experience!==null) yoodoo.session.experience.openNext();
		});
	},
	cancel:function(callback) {
		yoodoo.audio.stop();
		yoodoo.ui.ruleKeys = {};
		this.snapshotter.close();
		yoodoo.stopVoiceover();
		var me=this;
		var params=['dooit',function() {
			if (yoodoo.display.stack.length==0) yoodoo.interface.hideWebview();
		}];
		if (this.item.onclose!==null) callback=function() {
			me.item.closed();
		};
		if (typeof(callback)=="function") params[1]=callback;
		yoodoo.interface.setOrientation("portrait");
		yoodoo.display.remove.apply(yoodoo.display,params);
		yoodoo.dooit.loader.removeFiles();
		dooit.removeTemporaries();
		yoodoo.dooit.params={};
		yoodoo.interface.setOrientation('portrait');
		
	},
	snapshotter:{
		blockout:null,
		container:null,
		arena:null,
		dooit:null,
		prompt:null,
		on:false,
		show:function() {
			if (this.on) return false;
			var me=this;
			this.blockout=$(yoodoo.e("div")).addClass("blockout").click(function(e) {
				if (e.target===this) me.close();
			}).css({opacity:0});
			this.list=$(yoodoo.e("div"));
			this.container=$(yoodoo.e("div")).addClass("snapshots").css({
				'padding-top':(10+yoodoo.header_height)+'px',
					'z-index':parseInt(yoodoo.display.stack[yoodoo.display.stack.length-1].obj.css('z-index'))+2
			}).append(
				$(yoodoo.e("div")).addClass('snapshotTitle').html(yoodoo.w("_snapshots")).prepend(yoodoo.icons.get('snapshot',50,50))
			).append($(yoodoo.e("div")).append(this.list)).prepend(
				$(yoodoo.e("button")).attr("type","button").append(yoodoo.icons.get('add',30,30,{'4d4d4d':'ffffff'})).addClass("addButton").click(function() {
					yoodoo.dooit.saveSnapshot();
				})
			);
			for(var s=0;s<yoodoo.dooit.snapshots.length;s++) {
				this.list.append(yoodoo.dooit.snapshots[s].render());
			}
			this.arena=$(yoodoo.e("div")).addClass("snapshotArena").append(this.blockout).append(
				$(yoodoo.e("div")).addClass("snapshotLocator").append(this.container).click(function(e) {
					if (e.target===this) me.close();
				})
			);
			yoodoo.display.add({
				name:'snapshots',
				obj:this.arena,
				animate:false
			});
			this.on=true;
			this.blockout.animate({opacity:1});
			this.container.animate({left:0});
		},
		close:function() {
			if (this.on===false) return false;
			this.blockout.unbind("click");
			this.closePrompt();
			var me=this;
			this.container.animate({left:'-30%'},300,function() {
				me.blockout.animate({opacity:0},300,function() {
					yoodoo.display.remove('snapshots');
				});
				me.on=false;
			});
		},
		load:function(snapshot) {
			if (this.prompt!==null) {
				this.closePrompt(snapshot);
			}else{
				this.prompt=$(yoodoo.e("div")).addClass("snapshotPrompt").css({
					'margin-top':(10+yoodoo.header_height)+'px',
					'z-index':parseInt(yoodoo.display.stack[yoodoo.display.stack.length-1].obj.css('z-index'))+1
				}).append(
					$(yoodoo.e("div")).append(
						yoodoo.icons.get("snapshot",30,30,{'4d4d4d':'ffffff'})
					).append(
						$(yoodoo.e("div")).html(yoodoo.formatDate('H:i:s',snapshot.created)+"<br />"+yoodoo.formatDate('jS F Y',snapshot.created)+'<br />'+snapshot.length+' bytes').css({
							'white-space':'nowrap'
						}).append(
							$(yoodoo.e("button")).attr("type","button").html(
								'open'
//								yoodoo.w("open")
							).click(function() {
								yoodoo.dooit.snapshotter.close();
								yoodoo.dooit.loadSnaphot(snapshot.id);
								//console.log('open',snapshot);
							}).addClass('green')
						).append(
							$(yoodoo.e("button")).attr("type","button").html(
								'delete'
//								yoodoo.w("delete")
							).click(function() {
								yoodoo.dooit.snapshotter.closePrompt();
								snapshot.delete();
								//console.log('delete',snapshot);
							}).addClass('red')
						)
					).prepend(
						$(yoodoo.e("button")).attr("type","button").addClass("closeButton").append(yoodoo.icons.get("close",20,20,{'4d4d4d':'ffffff'})).click(function() {
								yoodoo.dooit.snapshotter.closePrompt();
						})
					)
				);
				this.prompt.insertAfter(this.container);
				this.prompt.animate({left:0});
			}
		},
		closePrompt:function(snapshot) {
			if (this.prompt!==null) {
				this.prompt.animate({left:'-100%'},300,function() {
					$(this).remove();
					yoodoo.dooit.snapshotter.prompt=null;
					if (typeof(snapshot)!="undefined") yoodoo.dooit.snapshotter.load(snapshot);
				});
			}
		}
	},
	menu:function() {
		var reply= [];
		if (yoodoo.dooit.params.canSnapshot) reply.push(
			{
				title:(yoodoo.words.language=='en')?'snapshots':'instantáneas',
				icon:yoodoo.icons.get("snapshot",20,20),
				action:'yoodoo.dooit.snapshotter.show()'
			}
		);
		if (typeof(this.params.helptext)=='string' && this.params.helptext!="") reply.push(
			{
				title:(yoodoo.words.language=='en')?'help':'ayuda',
				icon:yoodoo.icons.get("help",20,20),
				action:'yoodoo.dooit.help()'
			}
		);
		
		if (typeof(this.params.voiceoverfile)=='string' && this.params.voiceoverfile!='') reply.push(
			{
				title:(yoodoo.words.language=='en')?'pause/play':'pausa/reproducción',
				icon:yoodoo.icons.get("next",20,20),
				action:'yoodoo.dooit.toggleVoiceover()'
			}
		);
		if (yoodoo.sessions._experiences[this.item.experience]._session.intervention!==true) reply.unshift({
				title:(yoodoo.words.language=='en')?'close':'cerca',
				icon:yoodoo.icons.get("close",20,20),
				action:'yoodoo.dooit.cancel()'
		});
		
		
		/*,
			{
				title:'Pause/Play',
				icon:yoodoo.icons.get("next",20,20),
				action:'yoodoo.dooit.toggleVoiceover()'
			}*/
		return reply;
	},
	close:function() {
		var yes=$(yoodoo.e("button")).attr("type","button").html(yoodoo.w("yes"));
		var no=$(yoodoo.e("button")).attr("type","button").html(yoodoo.w("no"));
		var tmp=$(yoodoo.e("div")).html(yoodoo.w("_close_without_saving")).append(
			$(yoodoo.e("div")).append(yes).append(no)
		);
		var help=new yoodoo.ui.dialog({
			html:tmp,
			blockoutClickClose:true,
			closeButton:true
		});
		help.render();
		no.click(function() {
			help.close();
		});
		
		yes.click(function() {
			help.close();
			yoodoo.dooit.cancel();
		});
			
	},
	help:function() {
		if (typeof(this.params.helptext)=='string' && this.params.helptext!="") {
			var help=new yoodoo.ui.dialog({
				html:this.params.helptext,
				blockoutClickClose:true,
				closeButton:true
			});
			help.render();
		}
		//console.log(this.item);
		if (yoodoo.sessions._experiences[this.item.experience]._session.intervention!==true) params.unshift({
				title:'close',
				icon:yoodoo.icons.get("close",20,20),
				action:'yoodoo.dooit.cancel()'
		});
		return params;
	}
};

yoodoo.episode={
	item:null,
	container:null,
	chapter:0,
	show:function(id) {
		this.item=null;
		if (yoodoo.sessions._content[id]===undefined) return false;
		this.item=yoodoo.sessions._content[id];
		if (this.item.chapters instanceof Array) {
			this.display();
		}else{
			yoodoo.interface.showDialog(yoodoo.w('_loading')+' '+this.item.name+'&hellip;');
			yoodoo.sendPost(null,{
				cmd:'episode',
				episode:this.item.content_id,
				context:this,
				callback:'yoodoo.episode.got'
			});
		}
	},
	got:function(reply) {
		yoodoo.interface.hideDialog();
		var obj=null;
		try{
			obj=$.parseJSON(reply);
		}catch(e) {
			yoodoo.errorLog(e);
			try{
				eval('obj='+reply);
			}catch(e){
				yoodoo.errorLog(e);
			}
		}
		if (obj!==null) {
			for(var k in obj) this.item[k]=obj[k];
			this.display();
		}else{
			yoodoo.messages.show({
				text:'Failed to load the required information',
				type:'error',
				timeout:2
			});
		}
	},
	favourite:function() {
		yoodoo.interface.hideDialog();
		yoodoo.sendPost(null,{
			cmd:'earmark',
			book:this.item.content_id,
			context:this,
			callback:'yoodoo.episode.favouriteSet'
		});
	},
	favouriteSet:function(response) {
		yoodoo.interface.hideDialog();
		if (response=='completed') {
			this.item.earmarked=!this.item.earmarked;
			
			if (this.item.earmarked) {
				yoodoo.sessions._favourites[this.item.content_id]=this.item.favouriteArray();
				yoodoo.interface.drawFavourite(yoodoo.sessions._favourites[this.item.content_id]);
			}else{
				yoodoo.sessions._favourites[this.item.content_id]=undefined;
				yoodoo.interface.dropFavourite(this.item.content_id);
			}
			
			this.favouriteButton.empty().append(yoodoo.icons.get('favourite'+(this.item.earmarked?'On':''),20,20));
			//if (yoodoo.ifApp()===false) yoodoo.sessions.showHub();
		}
	},
	video:{
		player:null,
		width:'100%',
		height:'100%',
		types:['mp4','webm'],
		mime:{
			mp4:'video/mp4',
			webm:'video/webm'
		},
		type:null,
		started:false,
		playing:false,
		progress:null,
		clear:function() {
			this.started=false;
			this.playing=false;
		},
		getProgress:function() {
			var me=this;
			//if (this.progress===null) {
				this.progressBar=$(yoodoo.e("div")).addClass('ui_episode_progress_bar').append(yoodoo.e("div")).css({width:'0%'});
				this.progress=$(yoodoo.e("div")).addClass('ui_episode_progress').append(
					$(yoodoo.e("div")).append(this.progressBar)
				).click(function(e) {
					var dx=e.pageX-$(this).offset().left;
					var p=dx/$(this).width();
					p=(p>1)?1:(p<0)?0:p;
					me.viewing(false);
					if (me.player!==null) {
						me.player.currentTime=p*me.player.duration;
						me.setProgress();
						//me.togglePlayback(true);
						me.viewing(true);
					}
				});
				this.currentTime=$(yoodoo.e("span"));
				this.totalTime=$(yoodoo.e("span"));
				this.progress.prepend(this.currentTime).append(this.totalTime);
			//}
			return this.progress;
		},
		setProgress:function() {
			this.currentTime.html(this.player.currentTime.toFixed(1));
			this.totalTime.html(this.player.duration.toFixed(1));
			var p=this.player.currentTime/this.player.duration;
			yoodoo.episode.keypoints.timelineUpdate(this.player.currentTime);
			this.progressBar.css({width:(100*p)+'%'});
		},
		remove:function() {
			this.clear();
			if (this.player!==null) {
				$(this.player).remove();
				this.player=null;
			}
		},
		getPlayer:function() {
			var me=this;
			if (typeof(this.player)!="object" || this.player===null) {
				this.player = document.createElement("video");
				for(var t in this.types) {
					if (this.type===null) {
						if (this.player.canPlayType('video/'+this.types[t]).replace(/no/,'')!="") this.type=this.types[t];
					}
				}
				$(this.player).attr("type",this.mime[this.type]);
			}
				//$(this.video).attr("onloadedmetadata", 'console.log(yoodooPlaya.movie.autoPlay,"onloadedmetadata");yoodooPlaya.movie.loaded()');
				//$(this.video).attr("onloadeddata", 'console.log(yoodooPlaya.movie.autoPlay,"onloadeddata");yoodooPlaya.movie.buffering(false)');
				$(this.player).attr("oncanplay", 'yoodoo.episode.video.ready();yoodoo.episode.video.buffering(false);');
				//$(this.player).attr("onwaiting", 'console.log("waiting");yoodoo.episode.video.buffering(true)');
				/*$(this.player).bind("waiting", function(e) {
					yoodoo.episode.video.buffering(true);
				});*/
				$(this.player).unbind("timeupdate").bind("timeupdate",function(e) {
					//console.log(this.readyState);
					yoodoo.episode.video.setProgress();
				});
				$(this.player).attr("width", me.width);
				$(this.player).attr("height", me.height);
				this.player.poster='/uploads/sitegeneric/file/overlay/images/blank.gif';
				//$(this.player).attr("poster", yoodoo.replaceDomain('domain:uploads/sitegeneric/file/overlay/images/speedo.png'));
				$(this.player).unbind("error").bind("error", function(e) {
					yoodoo.episode.video.failed(e);
				});
				$(this.player).bind("loadeddata loadmetadata suspend stalled seeking pause",function(e) {
					//console.log(this.readyState);
				});
				$(this.player).attr("autobuffer", "autobuffer");
				//$(this.player).attr("controls", "controls");
				$(this.player).attr("autoplay", "autoplay");
				$(this.player).attr("preload", "auto");
				//$(this.player).attr("poster", "");
				$(this.player).attr("webkit-playsinline", "");
				$(this.player).unbind("playing").bind("playing", function() {
					yoodoo.episode.video.buffering(false);
					var vid=this;
					var player=me;
					if (vid.wasTime===undefined) vid.wasTime=0;
					if (me.timeout===undefined) me.timeout=setInterval(function() {
						player.buffering(vid.wasTime>vid.currentTime-0.2);
						vid.wasTime=vid.currentTime;
						//console.log(vid.currentTime - vid.buffered.end(0));
					},250);
					me.starting();
				});
				$(this.player).unbind("ended").bind("ended", function(e) {
					if (me.timeout!==undefined) {
						clearInterval(me.timeout);
						me.timeout=undefined;
					}
					me.stopped();
				});
				$(this.player).unbind("click").bind("click",function() {
					me.togglePlayback();
				});
			return this.player;
		},
		togglePlayback:function(forced) {
			if (this.started) {
				//this.playing=!this.playing;
				//if (forced===true || forced===false) this.playing=forced;
				if (forced!==false && (!this.playing || forced===true)) {
					//yoodoo.episode.container.addClass("videoPlaying").removeClass("videoPaused");
					this.player.play();
					this.starting();
				}else if (this.playing || forced===false ) {
					//yoodoo.episode.container.addClass("videoPaused").removeClass("videoPlaying");
					
					this.buffering(false);
					if (this.timeout!==undefined) {
						clearInterval(this.timeout);
						this.timeout=undefined;
					}
					this.player.pause();
					this.stopped();
				}
			}
		},
		failed:function(e) {
			var d=new yoodoo.ui.dialog({
				html:'This video has failed to load.',
				closeButton:true,
				blockoutClickClose:true,
				closedCallback:function() {
					yoodoo.episode.cancel();
				}
			});
			this.buffering(false);
			d.render();
		},
		buffering:function(on) {
			if (on) {
				yoodoo.episode.container.addClass('videoBuffering');
			}else{
				yoodoo.episode.container.removeClass('videoBuffering');
			}
		},
		starting:function() {
			//if (this.playing!==true) {
				this.viewing(true);
				this.buffering(false);
				this.playing=true;
				this.started=true;
				yoodoo.episode.container.addClass("videoPlaying");
				if (yoodoo.episode.removePaused!==undefined) clearTimeout(yoodoo.episode.removePaused);
				yoodoo.episode.removePaused=setTimeout(function() {
					yoodoo.episode.container.removeClass("videoPaused");
				},2000);
			//}
		},
		stopped:function() {
			this.viewing(false);
			this.playing=false;
			this.buffering(false);
			if (yoodoo.episode.removePaused!==undefined) clearTimeout(yoodoo.episode.removePaused);
			yoodoo.episode.container.addClass("videoPaused").removeClass("videoPlaying");
			if (this.player.currentTime==this.player.duration) {
				yoodoo.episode.finishedChapter();
			}
		},
		viewing:function(play) {
			var ch=yoodoo.episode.item.chapters[yoodoo.episode.chapter];
			if (play) {
				ch.viewing={from:this.player.currentTime,to:null};
			}else{
				ch.viewing.to=this.player.currentTime;
				if (ch.viewed===undefined) ch.viewed=[];
				ch.viewed.push([ch.viewing.from,ch.viewing.to]);
				var was=ch.viewed.length;
				var is=0;
				while(was!==is) {
					var times=[];
					was=ch.viewed.length;
					while(ch.viewed.length>0) {
						var add=true;
						var span=ch.viewed.shift();
						for(var t=0;t<times.length;t++) {
							if (span[0]>=times[t][0] && span[1]<=times[t][1]) {
								// ignore
								add=false;
							}else if (span[0]>=times[t][0] && span[0]<=times[t][1]) {
								times[t][1]=span[1];
								add=false;
							}else if (span[1]>=times[t][0] && span[1]<=times[t][1]) {
								times[t][0]=span[0];
								add=false;
							}
						}
						if (add) times.push(span);
					}
					ch.viewed=times;
					is=ch.viewed.length;
				}
				var seen=0;
				for(var v=0;v<ch.viewed.length;v++) {
					seen+=(ch.viewed[v][1]-ch.viewed[v][0]);
				}
				ch.seen=seen;
				ch.duration=this.player.duration;
				ch.percentage=100*(seen/this.player.duration);
				yoodoo.episode.getPercentage();
			}
		},
		loadedWhen:null,
		ready:function() {
			this.started=true;
			if (this.loadedWhen!==null) {
				//console.log((new Date().getTime()-this.loadedWhen)/1000);
			}
			yoodoo.episode.container.addClass("videoPaused").removeClass("videoPlaying");
		},
		load:function(url) {
			this.buffering(true);
			this.playing=false;
			this.started=false;
			if (!(/^http/.test(url))) url='videodomain:'+url;
			url=yoodoo.replaceDomain(url);
			this.player.src = url;
			yoodoo.episode.container.addClass("videoPaused").removeClass("videoPlaying");
			//this.player.load();
			this.player.play();
			$(this.player).focus();
			this.loadedWhen=new Date().getTime();
		},
		makeMirror:function() {
			var me=this.player;
			navigator.webkitGetUserMedia({video:true, audio:true},
		          function(stream) {
		            me.src = window.webkitURL.createObjectURL(stream);
		          },
		          function(e) {
		          	//console.log("error happended");
		          }
		      );
		}
	},
	getPercentage:function() {
		var seen=0;
		var duration=0;
		var watched=0;
		for(var c=0;c<this.item.chapters.length;c++) {
			if (this.item.chapters[c].seen!==undefined) {
				seen+=this.item.chapters[c].seen;
				watched++;
			}
			if (this.item.chapters[c].duration!==undefined) duration+=this.item.chapters[c].duration;
		}
		this.item.seen=seen;
		this.item.actual_duration=duration;
		this.item.percentage=100*(seen/duration)*(watched/this.item.chapters.length);
	},
	finishedChapter:function() {
		var lastChapter=(this.chapter==(this.item.chapters.length-1));
		var message=$(yoodoo.e("div")).css({
			'text-align':'center'
		});
		var but=$(yoodoo.e("button")).attr("type","button").css({
			display:'block',
			margin:'5px auto'
		});
		if (lastChapter) {
			if (yoodoo.episode.item.completed===true) {
				message.html(yoodoo.w('_you_have_finished')+' '+this.item.name);
				message.append(
					but.html(yoodoo.w('_continue'))
				);
			}else if (this.item.percentage>=this.item.required_percentage) {
				message.html(yoodoo.w('_you_have_completed')+' '+this.item.name);
				message.append(
					but.html(yoodoo.w('_continue'))
				);
			}else{
				message.html(yoodoo.w('_you_have_not_watched_enough_of_to_complete_it',{item:this.item.name}));
				message.append(
					but.html(yoodoo.w('_close_anyway',{item:this.item.name}))
				);
			}
		}else{
			message.html(yoodoo.w('_you_have_completed_chapter',{item:this.item.chapters[this.chapter].name}));
			message.append(
				but.html(yoodoo.w('_open_chapter',{item:this.item.chapters[this.chapter+1].name}))
			);
		}
		
		var d=new yoodoo.ui.dialog({
			html:message,
			blockoutClickClose:false,
			closeButton:true,
			css:{background:'#97C1E0',color:'#000','text-shadow':'0px 0px 2px #fff'},
			closedCallback:function() {
			}
		});
		d.render();
		if (lastChapter) {
			if (yoodoo.episode.item.completed===true) {
				but.click(function() {
					d.close();
					yoodoo.episode.cancel();
				});
			}else if (this.item.percentage>=this.item.required_percentage) {
				but.click(function() {
					d.close();
					yoodoo.episode.saveComplete();
				});
			}else{
				but.click(function() {
					d.close();
					yoodoo.episode.cancel();
				});
			}
		}else{
			but.click(function() {
				d.close();
				yoodoo.episode.gotoChapter(yoodoo.episode.chapter+1);
			});
		}
	},
	display:function() {
		var me=this;
		this.chapter=null;
		this.header=this.headerObject();
		this.controls=this.controlsObject();
		var buffering=$(yoodoo.e("div")).addClass('ui_episode_buffering').append($(yoodoo.e('div')).append(yoodoo.e('div')));
		var calltoPlay=$(yoodoo.e("div")).addClass('ui_episode_call_toPlay').append($(yoodoo.e('div')).append($(yoodoo.e('div')).append(yoodoo.icons.get('play',60,60)))).click(function() {
			me.gotoChapter(0);
		});
		this.container=$(yoodoo.e("div")).addClass('videoPaused ui_episode notStarted').append(this.video.getPlayer()).append(buffering).append(this.controls).append(calltoPlay).append(this.header).append(this.keypoints.getContainer());
		yoodoo.display.add({
			name:'episode',
			obj:this.container,
			animate:true,
			hideBelow:true,
			removed:function() {
				yoodoo.episode.video.clear();
			}
		});
		//if (!yoodoo.ifApp()) {
			
			this.video.buffering(true);
			this.gotoChapter(0);
		//}
		yoodoo.interface.setOrientation('auto');
		//this.video.makeMirror();
	},
	
	keypoints:{
		container:null,
		chapter:null,
		getContainer:function() {
			if (this.container===null) this.container=$(yoodoo.e("div")).addClass('ui_episode_keypoints');
			return this.container;
		},
		loadChapter:function() {
			if (typeof(yoodoo.episode.item.chapters[yoodoo.episode.chapter])=='object') this.chapter=yoodoo.episode.item.chapters[yoodoo.episode.chapter];
			this.render();
		},
		render:function() {
			this.chapter.keypoints.sort(function(a,b) {
				return a.start_time-b.start_time;
			});
			this.container.empty();
			for(var k in this.chapter.keypoints) {
				this.chapter.keypoints[k].button=new this.keypointButton(this.chapter.keypoints[k]);
				this.container.append(this.chapter.keypoints[k].button.render());
			}
		},
		timelineUpdate:function(t) {
			if (this.chapter!==null) {
				for(var k in this.chapter.keypoints) {
					if (this.chapter.keypoints[k].button!==undefined) this.chapter.keypoints[k].button.timelineUpdate(t);
				}
			}
		},
		keypointButton:function(keypoint) {
			this.keypoint=keypoint;
			this.container=null;
			this.button=null;
			this.playbutton=null;
			this.render=function() {
				var me=this;
				if (this.container===null) this.container=$(yoodoo.e("div"));
				if (this.button===null) this.button=$(yoodoo.e("button")).attr("type","button").click(
						function() {
							me.open();
						}
					).html(this.keypoint.name);
				if (this.playbutton===null) this.playbutton=$(yoodoo.e("button")).attr("type","button").click(
						function() {
							me.play();
						}
					).append(yoodoo.icons.get('play',20,20)).addClass("ui_episode_keypoint_play");
				this.container.append(this.playbutton).append(this.button).addClass("ui_episode_keypoint");
				return this.container;
			};
			this.open=function() {
				if (yoodoo.episode.keypoints.timeout!==undefined) clearTimeout(yoodoo.episode.keypoints.timeout);
				var me=this;
				if (this.container.hasClass("ui_episode_keypoint_reveal") || this.container.hasClass("ui_episode_keypoint_active")) this.display();
				if (this.container.hasClass("ui_episode_keypoint_reveal")) {
					this.container.removeClass("ui_episode_keypoint_reveal");
					this.reveal();
				}else{
					this.container.addClass("ui_episode_keypoint_reveal").siblings().removeClass("ui_episode_keypoint_reveal");
					this.reveal();
					yoodoo.episode.keypoints.timeout=setTimeout(function() {
						me.container.removeClass("ui_episode_keypoint_reveal");
						me.reveal();
					},5000);
				}
			};
			this.play=function() {
				yoodoo.episode.video.player.currentTime=this.keypoint.start_time;
				yoodoo.episode.video.setProgress();
				yoodoo.episode.video.togglePlayback(true);
			};
			this.timelineUpdate=function(t) {
				if (t>=this.keypoint.start_time && t<=this.keypoint.end_time) {
					this.container.addClass("ui_episode_keypoint_active");
				}else{
					this.container.removeClass("ui_episode_keypoint_active");
				}
				this.reveal();
			};
			this.reveal=function() {
				if (this.container.hasClass("ui_episode_keypoint_active") || this.container.hasClass("ui_episode_keypoint_reveal")) {
					var css={};
					css.left='-'+this.button.outerWidth(false)+'px';
					this.container.css(css).siblings('div:not(.ui_episode_keypoint_active)').css({
						left:'-50px'
					});
				}else{
					this.container.css({
						left:'-50px'
					});
				}
			};
			this.display=function() {
				yoodoo.interface.setOrientation("auto");
				yoodoo.episode.video.togglePlayback(false);
				this.displayContainer=$(yoodoo.e("div")).addClass('ui_keypoint');
						
				var header = yoodoo.buildHeader({
					logo: yoodoo.logo.svg,
					logoWidth: yoodoo.logo.width,
					logoHeight: yoodoo.logo.height,
					menu: false,
					back: 'yoodoo.display.remove();',
					search: false,
					community: false,
					title: this.keypoint.name
				});
				if (header!==true) this.displayContainer.append(header);
				var kp_pages=$(yoodoo.e("div")).addClass('ui_episode_keypoint_pages').css({
					padding:yoodoo.header_height+'px 0px 0px 0px'
				});
				var pages=new yoodoo.ui.pages({
					height:'100%',
					snapPagesToLeft:true
				});
				for(var p=0;p<this.keypoint.pages.length;p++) {
					var page=pages.addPage({className:'ui_episode_keypoint_page'});
					var kp=$(yoodoo.e("div")).addClass('ui_episode_keypoint_kppage');
					switch (this.keypoint.pages[p].page_type) {
						case 'text':
							kp.append(this.keypoint.pages[p].text);
						break;
						case 'image':
							var img=yoodoo.e("img");
							img.src=yoodoo.replaceDomain('imagedomain:'+this.keypoint.pages[p].image_url);
							kp.append(img);
						break;
						case 'text-image':
							kp.append(this.keypoint.pages[p].text);
							var img=yoodoo.e("img");
							img.src=yoodoo.replaceDomain('imagedomain:'+this.keypoint.pages[p].image_url);
							kp.append(img);
						break;
						case 'image-text':
							var img=yoodoo.e("img");
							img.src=yoodoo.replaceDomain('imagedomain:'+this.keypoint.pages[p].image_url);
							kp.append(img);
							kp.append(this.keypoint.pages[p].text);
						break;
					}
					page.append(kp);
				};
				this.displayContainer.append(kp_pages.append(pages.container));
				yoodoo.display.add({
					name:'keypoint',
					obj:this.displayContainer,
					hideBelow:true,
					animate:true
				});
			};
		}
	},
	gotoChapter:function(c) {
		if (this.chapter!=c) {
			this.container.removeClass('notStarted');
			this.video.buffering(false);
			this.chapter=c;
			this.video.load(this.item.chapters[this.chapter].video[this.video.type]);
			$(this.chapterIcons.find('>button').get(this.chapter)).addClass("playing").siblings('button').removeClass("playing");
			this.keypoints.loadChapter();
		}
	},
	controlElements:{},
	controlsObject:function() {
		this.controlElements.container=$(yoodoo.e("div")).addClass("ui_episode_controls");
		var me=this;
		var playButton=$(yoodoo.e("button")).attr("type","button").append(
			$(yoodoo.e("div")).addClass("notPlaying").append(yoodoo.icons.get('play',36,36))
		).append(
			$(yoodoo.e("div")).addClass("whenPlaying").append(yoodoo.icons.get('pause',36,36))
		).click(function() {
			me.video.togglePlayback();
		});
		this.controlElements.container.append(playButton).append(this.video.getProgress());
		return this.controlElements.container;
	},
	headerElements:{},
	headerObject:function() {
		//if (this.headerElements.container===undefined) {
			this.chapterIcons=$(yoodoo.e("div")).addClass("ui_episode_chapters");
				
			var buttonSize=yoodoo.header_height*0.6;
			this.menuButton=$(yoodoo.e("button")).attr("type","button").append(yoodoo.icons.get("menu",buttonSize,buttonSize)).css({
				width:yoodoo.header_height,
				height:yoodoo.header_height,
				position:'absolute',
				left:0,
				padding:Math.floor((yoodoo.header_height-buttonSize)/2).toString()+'px 10px'
			}).click(function() {
				yoodoo.episode.video.togglePlayback(false);
				//yoodoo.episode.video.player.pause();
				//yoodoo.episode.video.buffering(false);
				yoodoo.menu.show(yoodoo.episode.menu());
			});
			
			this.headerElements.container=$(yoodoo.e("div")).addClass("ui_episode_header").append(this.menuButton).append(this.chapterIcons).css({
				height:yoodoo.header_height,
				'line-height':yoodoo.header_height+'px'
			});
		//}
		var me=this;

		this.chapterIcons.empty().css({padding:'12px 0px 0px 0px'});//.html('<span>'+yoodoo.w('_chapter'+(this.item.chapters.length==1?'':'s'))+':</span> ');
		for(var c=0;c<this.item.chapters.length;c++) {
			this.chapterIcons.append(
				$(yoodoo.e("button")).attr("type","button").append($(yoodoo.e("div")).html(c+1)).click(function() {
					me.gotoChapter($(this).prevAll("button").get().length);
				})
			);
		}
		
		this.favouriteButton=$(yoodoo.e("button")).attr("type","button").append(yoodoo.icons.get("favourite"+(this.item.earmarked?'On':''),20,20)).click(function() {
			yoodoo.episode.favourite();
		}).css({
			float:'right',
			padding:'15px 10px 15px 5px'
		});
		this.communityButton=$(yoodoo.e("button")).attr("type","button").append(yoodoo.icons.get("community",20,20)).click(function() {
			yoodoo.episode.video.togglePlayback(false);
			yoodoo.interface.community(yoodoo.episode.item.content_id);
		}).css({
			float:'right',
			padding:'15px 5px 15px 5px'
		});
		
		
		$(this.headerElements.container).append(this.favouriteButton).append(this.communityButton);
		
		
		
		return this.headerElements.container;
	},
	saveComplete:function() {
		var toSave={
			cmd:'completedepisode',
			callback:'yoodoo.episode.saved',
			completed:(yoodoo.episode.item.percentage>=yoodoo.episode.item.required_percentage),
			context:yoodoo.episode,
			content_id:yoodoo.episode.item.content_id
		};
		yoodoo.interface.showDialog(yoodoo.w('saveandupdate'));
		yoodoo.sendPost(null,toSave);
	},
	saved:function(reply) {
		reply=$.parseJSON(reply);
		yoodoo.sessions.syllabus.apply(yoodoo.sessions,[reply.syllabus]);
		if (reply.tags!==undefined) yoodoo.sessions._tags=reply.tags;
		yoodoo.interface.hideDialog();
		this.cancel(function() {
			yoodoo.session.experience.openNext();
		});
		
	},
	cancel:function(callback) {
		var params=['episode'];
		var me=this;
		if (this.item.onclose!==null) callback=function() {
			me.item.closed();
		};
		if (typeof(callback)=="function") params.push(callback);
		yoodoo.display.remove.apply(yoodoo.display,params);
		yoodoo.interface.setOrientation('portrait');
		this.video.remove();
		/*$(this.video.player).remove();
		this.video.clear();
		this.video.player=null;*/
	},
	menu:function() {
		var complete=(yoodoo.episode.item.completed!==true) && (yoodoo.episode.item.percentage>=yoodoo.episode.item.required_percentage);
		return [
			{
				title:yoodoo.w(complete?'_saveand_close':'_close').toLowerCase(),
				icon:yoodoo.icons.get("close",20,20),
				action:complete?'yoodoo.episode.saveComplete()':'yoodoo.episode.cancel()'
			}
		];
	}
};


yoodoo.menu={
	items:[],
	blockout:null,
	container:null,
	standard:function() {
		return [
			{
				title:yoodoo.w('_community'),
				icon:yoodoo.icons.get("communityHub",20,20,{'ffffff':'555555'}),
				action:'yoodoo.community.show'
			},
			{
				title:yoodoo.w('_your_journey_so_far'),
				icon:yoodoo.icons.get("journeySoFar",20,20),
				action:'yoodoo.sessions.journey'
			},
			{
				title:yoodoo.w('_next_session'),
				icon:yoodoo.icons.get("nextSession",20,20),
				action:'yoodoo.session.show(yoodoo.sessions.currentSession().id)'
			},
			{
				title:yoodoo.w('_settings'),
				icon:yoodoo.icons.get("settings",20,20),
				action:'yoodoo.settings.show()'
			},
			{
				title:yoodoo.w('_sign_out'),
				icon:yoodoo.icons.get("signout",20,20),
				action:'yoodoo.logout()'
			}
		];
	},
	show:function(l) {
		this.items=this.standard();
		if (l instanceof Array) this.items=l;
		this.container=$(yoodoo.e("div")).addClass("menu").css({'left':'-100%'});
		this.blockout=$(yoodoo.e("div")).addClass("blockout").append($(yoodoo.e("div")).css({position:'absolute'}).append(this.container)).click(function(e) {
			if (e.target==this) yoodoo.menu.remove();
		});
		this.container.append($(yoodoo.e("div")).css({height:yoodoo.header_height,'line-height':yoodoo.header_height+'px'}).html(yoodoo.user.getName()));
		for(var m in this.items) {
			var but=yoodoo.e("button");
			but.action=this.items[m].action;
			this.container.append(
				$(but).attr("type","button").append(this.items[m].icon).append(this.items[m].title).click(function() {
					yoodoo.menu.remove();
					try{
						eval(this.action);
					}catch(e){
						yoodoo.errorLog(e);
					}
				})
			);
		}
		yoodoo.display.add(
			{name:'menu',
			obj:$(this.blockout).css({opacity:0})
			}
		);
		this.reveal();
	},
	reveal:function() {
		var me=this;
		this.blockout.transition({opacity:1},300,function() {
			me.container.animate({'left':'0%'});
		});
	},
	remove:function() {
		var me=this;
		this.container.animate({'left':'-100%'},300,function() {
			me.blockout.transition({opacity:0},300,function() {
				yoodoo.display.remove('menu');
			});
		});
	}
};
yoodoo.search=function() {
	
};
yoodoo.community={
	container:null,
	groups:[],
	optionalGroups:[],
	users:{},
	userIds:[],
	contentId:null,
	show:function(contentId){
		this.contentId=contentId;
		var header=yoodoo.buildHeader({
			logo: yoodoo.logo.svg,
			logoWidth: yoodoo.logo.width,
			logoHeight: yoodoo.logo.height,
			menu: false,
			back: true,
			search: false,
			community: false,
			title: yoodoo.w("_community")
		});
		this.userList=$(yoodoo.e("div"));
		this.communityUsers=$(yoodoo.e("div")).addClass("communityUsers").append(this.userList);
		this.commentList=$(yoodoo.e("div"));
		this.container=$(yoodoo.e("div")).css({
		}).append(header).append(
			$(yoodoo.e("div")).addClass('screen').css({
				'padding-top':yoodoo.header_height
			}).append(
				$(yoodoo.e("div")).css({
					height:'100%',
					'box-sizing':'border-box',
					position:'relative'
				}).append(
					$(yoodoo.e("div")).addClass('your_community').html(yoodoo.w('communities'))
				).append(this.communityUsers).append(
					$(yoodoo.e("div")).addClass('latest_comments').html(yoodoo.w('latest_comments')).append(
						$(yoodoo.e("button")).attr("type","button").addClass("addButton").css({padding:'10px'}).append(yoodoo.icons.get("add",20,20,{'4D4D4D':'FFFFFF'})).click(function() {
							yoodoo.commenting.add();
						})
					)
				).append($(yoodoo.e("div")).addClass("communityComments").append(this.commentList))
			)
		).addClass('community');
		yoodoo.display.add({
			title:'community',
			name:'community',
			obj:this.container,
			animate:true,
			hideBelow:true,
			removed: function() {
				if (yoodoo.isApp && yoodoo.display.stack.length==0) yoodoo.fetchHub();
			},complete:function() {
//alert($('.community').height()+','+$('.community').parent().height()+','+$('.community .screen').height()+','+$('.community .screen>div').height());
			}
		});
		var params={
			cmd:'community',
			context:this,
			sharing:'1',
			amount:yoodoo.commenting.perPage,
			callback:'yoodoo.community.gotGroups'
		};
		if (!isNaN(contentId)) params.contentId=contentId;
		yoodoo.sendPost(null,params);
	},
	user:function(params) {
		for(var k in params) this[k]=params[k];
		this.extended=null;
		this.activity=null;
		this.container=null;

		var d=null;
		try{
			eval('d='+this.last_login);
		}catch(e){
			yoodoo.errorLog(e);
		}
		this.last_login=d;
		var d=null;
		try{
			eval('d='+this.created);
		}catch(e){
			yoodoo.errorLog(e);
		}
		this.created=d;
		this.fullname=function() {
			if (typeof(this.name)=="string" && this.name!="") return this.name;
			if (typeof(this.firstname)=="string" && this.firstname!="") return this.firstname+' '+this.lastname;
			if (typeof(this.username)=="string" && this.username!="") return this.username;
		};
				
				
		this.render=function() {
			var me=this;
			if (this.container===null) {
				this.container=$(yoodoo.e("button")).attr("type","button").addClass("user").append(
					$(yoodoo.e("div")).addClass('avatar').css({
						background:'url('+yoodoo.replaceDomain('imagedomain:'+((this.photo!="")?this.smallAvatar.replace(/\\\//,'/'):'uploads/sitegeneric/image/blank_avatar.png'))+') center center no-repeat'
					})
				).append(
					$(yoodoo.e("div")).addClass("userTitle").html(this.fullname())
				);
			}
			return this.container.click(function() {
					me.showBio();
				});
		};
		this.minirender=function() {
			return $(yoodoo.e("div")).addClass("user").append(
					$(yoodoo.e("div")).addClass('avatar').css({
						background:'url('+yoodoo.replaceDomain('imagedomain:'+((this.photo!="")?this.smallAvatar.replace(/\\\//,'/'):'uploads/sitegeneric/image/blank_avatar.png'))+') center center no-repeat'
					})
				);			
		};
		this.showBio=function() {
			
			var header=yoodoo.buildHeader({
				logo: yoodoo.logo.svg,
				logoWidth: yoodoo.logo.width,
				logoHeight: yoodoo.logo.height,
				menu: false,
				back: 'yoodoo.display.remove();',
				search: false,
				community: false,
				title: this.fullname()
			});
			var bio=$(yoodoo.e("div"));
			var details=$(yoodoo.e("div")).addClass("bioDetails");
			var container=$(yoodoo.e("div")).addClass("userBio").append(header).append(
				$(yoodoo.e("div")).css({
					height:'100%',
					'box-sizing':'border-box',
					'padding-top':yoodoo.header_height
				}).append(bio)
			);
			this.cover=$(yoodoo.e('div'));
			bio.append(this.cover);
			
			this.avatar=$(yoodoo.e('div')).addClass("bioAvatar");
			bio.append(this.avatar);
			
			this.details=$(yoodoo.e("div")).addClass("bioDetails");
			bio.append(this.details);
			this.fillInBio();
			var me=this;
			yoodoo.display.add({
				name:'userbio',
				obj:container,
				animate:true,
				reveal:function() {
					me.fillInBio();
				}
			});
			//console.log(this);
		};
		this.fillInBio=function() {
			if (this.largeAvatar!="") {
				this.cover.css({
					'background-image':'url('+yoodoo.replaceDomain('imagedomain:'+this.largeAvatar.replace(/\\\//g,'/'))+')',
					'background-size':'cover',
					height:'20%'
				});
			}else{
				this.cover.css({
					'background':'#B2B2B2',
					height:'20%'
				});
			}
			if (this.photo!="") {
				this.avatar.css({
					'background-image':'url('+yoodoo.replaceDomain('imagedomain:'+this.photo.replace(/\\\//g,'/'))+')',
					'background-size':'cover'
				});
			}else{
				this.avatar.css({
					'background-color':'#DADADA',
					'background-image':'url('+yoodoo.replaceDomain('imagedomain:uploads/sitegeneric/image/blank_avatar.png')+')',
					'background-size':'cover'
				});
			}
			var displayName=this.firstname+' '+this.lastname;
			if (displayName==' ') this.name;
			this.extendedBio=$(yoodoo.e("div"));
			this.details.empty().append(
				$(yoodoo.e("h2")).html(displayName)
			).append(
				$(yoodoo.e("div")).html(yoodoo.formatDate('jS F Y',this.created)+' - '+yoodoo.formatDate('jS F Y',this.last_login))
			).append(this.extendedBio);
			if (this.extended===null) {
				yoodoo.sendPost(null,{
					cmd:'userbio',
					bio_user_id:this.id,
					context:this,
					callback:'yoodoo.community.users['+this.id+'].gotBio'
				});
			}else{
				this.extendedBio.html(this.extended);
			}
			var me=this;
			this.activityBio=$(yoodoo.e("div"));
			if (yoodoo.user.advisor || this.me) {
				if (this.activity===null) {
					this.details.append(
						this.activityBio.append(
							$(yoodoo.e("button")).attr("type","button").html("Activity").click(function() {
								$(this).unbind("click").slideUp(300,function() {$(this).remove();});
								yoodoo.sendPost(null,{
									cmd:'useractivity',
									bio_user_id:me.id,
									context:me,
									callback:'yoodoo.community.users['+me.id+'].gotActivity'
								});
							})
						)
					);
				}else{
					this.details.append(
						this.activityBio.append(
							this.activityGraph()
						)
					);
				}
			}
		};
		this.gotBio=function(r) {
			if (!yoodoo.ajax) r=Base64.decode(r);
			this.extended=r;
			this.extendedBio.html(r);
		};
		this.gotActivity=function(r) {
			if (!yoodoo.ajax) r=Base64.decode(r);
			this.activity=$.parseJSON(r);
			for(var i=0;i<this.activity.activity.length;i++) {
				var d=null;
				try{
					eval('d='+this.activity.activity[i].date);
					this.activity.activity[i].date=d;
					this.activity.activity[i].time=d.getTime();
				}catch(e) {
					yoodoo.errorLog(e);
				}
			}
			this.activity.activity.sort(function(a,b) {
				return b.time-a.time;
			});
			this.startDate=this.created;
			var now=new Date();
			this.latestDate=new Date(now.getFullYear(),now.getMonth(),now.getDate());
			this.highestActivity=1;
			for(var a=0;a<this.activity.activity.length;a++) {
				if (this.activity.activity[a].seconds>this.highestActivity) this.highestActivity=this.activity.activity[a].seconds;
			}
			if (this.activity.activity.length>1 && this.highestActivity>0) 
			this.activityBio.append(
				this.activityGraph()
			);
		};
		this.activityGraph=function() {
			if (this.graph===undefined) {
				var height=200;
				var margin=2;
				this.graphContainer=$(yoodoo.e("div")).addClass("activityGraphContainer");
				this.graph=$(yoodoo.e("div")).addClass("activityGraph");
				this.legendY=$(yoodoo.e("div"));
				this.graphContainer.append($(yoodoo.e("div")).addClass("activityGraphY").css({height:height,top:margin}).append(this.legendY)).append(this.graph);
				var days=Math.round((this.latestDate.getTime()-this.startDate.getTime())/(1000*60*60*24));
				var pixelsPerDay=this.activityBio.width()/days;
				if (pixelsPerDay<2) pixelsPerDay=2;
				
				var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
				svg.setAttribute('type', 'image/svg+xml');
				svg.setAttribute('width', (pixelsPerDay*days)+(2*margin));
				svg.setAttribute('height', height+(2*margin));
				var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
				path.setAttribute('stroke', '#3E87BB');
				path.setAttribute('fill', '#97C1E0');
				path.setAttribute('fill-opacity', '0.1');
				path.setAttribute('stroke-opacity', '0.2');
				path.setAttribute('stroke-width', '1');
				var avpath = document.createElementNS("http://www.w3.org/2000/svg", "path");
				avpath.setAttribute('stroke', '#B2B2B2');
				avpath.setAttribute('fill', '#DADADA');
				avpath.setAttribute('stroke-width', '2');
				var heights=[];
				var avheights=[];
				var avSpread=5;
				for(var a=0;a<this.activity.activity.length;a++) {
					var day=Math.round((this.activity.activity[a].time-this.startDate.getTime())/(1000*60*60*24));
					while(heights.length<day) heights.push(0);
					//heights[day]=margin+height-Math.round(height*(this.activity.activity[a].seconds/this.highestActivity));
					heights[day]=this.activity.activity[a].seconds;
				}
				while(heights.length<days) heights.push(0);
				this.highestActivity=0;
				
				var processDate=new Date(this.startDate.getFullYear(),this.startDate.getMonth(),this.startDate.getDate());
				var l=0;
				var today=this.latestDate;
				var countDays=0;
				while(processDate.getTime()<today.getTime()) {
					var lastDayInMonth=new Date(processDate.getFullYear(),processDate.getMonth()+1,0);
					if (lastDayInMonth.getTime()>today.getTime()) lastDayInMonth=today;
					var days=lastDayInMonth.getDate()-processDate.getDate()+1;
					countDays+=days;
					var monthLine = document.createElementNS("http://www.w3.org/2000/svg", "path");
					monthLine.setAttribute('stroke', '#E09801');
					monthLine.setAttribute('stroke-width', '1');
					monthLine.setAttribute('stroke-opacity', '0.2');
					l+=Math.round(days*pixelsPerDay);
					monthLine.setAttribute('d', 'M'+l+' '+margin+' L'+l+' '+(height+margin));
					//console.log(lastDayInMonth.getDate(),countDays,days,l,yoodoo.formatDate('F',processDate));
					var monthText = document.createElementNS("http://www.w3.org/2000/svg", "text");
					monthText.setAttribute('x',l+2);
					monthText.setAttribute('y',margin+12);
					monthText.setAttribute('font-size',10);
					processDate=new Date(processDate.getFullYear(),processDate.getMonth()+1,1);
					if (processDate.getTime()<today.getTime()) {
						$(svg).append(monthLine);
						$(monthText).html(yoodoo.formatDate((processDate.getMonth()==0)?'M \'y':'M',processDate));
						$(svg).append(monthText);
					}
					/*this.graph.append(
						$(yoodoo.e("div")).addClass("graphMonth").css({
							width:days*pixelsPerDay
						}).html(yoodoo.formatDate('F',processDate))
					);*/
				}
				//console.log(this.latestDate,heights.length,Math.round(((today.getTime()-this.startDate.getTime())/(1000*60*60*24))));
				for(var h=0;h<heights.length;h++) {
					var f=h-avSpread;
					if (f<0) f=0;
					var t=h+avSpread;
					if (t>=heights.length) t=heights.length-1;
					var l=t-f+2;
					var v=0;
					var count=0;
					for(var a=f;a<=t;a++) {
						v+=heights[a]*(avSpread-Math.abs(a-h));
						count+=(avSpread-Math.abs(a-h));
					}
					v/=count;
					avheights[h]=Math.round(v);
					//if (this.highestActivity<avheights[h]) this.highestActivity=avheights[h];
					if (this.highestActivity<heights[h]) this.highestActivity=heights[h];
				}
				if (this.highestActivity>2*3600) {
					this.highestActivity=3600*Math.ceil(this.highestActivity/3600);
				}else{
					this.highestActivity=60*Math.ceil(this.highestActivity/60);
				}
				//console.log(heights);
				for(var h=0;h<avheights.length;h++) {
					heights[h]=margin+height-Math.round(height*(heights[h]/this.highestActivity));
					avheights[h]=margin+height-Math.round(height*(avheights[h]/this.highestActivity));
				}
				var d=[];
				var av=[];
				var das=[];
				for(var a=0;a<heights.length;a++) {
					d.push(Math.round(margin+(pixelsPerDay*a))+' '+heights[a]);
					var prev=(a>0)?avheights[a-1]:avheights[a];
					var next=(a<heights.length-1)?avheights[a+1]:avheights[a];
					var da=(next-prev)/3;
					if (da!=0 && (next>avheights[a])===(prev>avheights[a])) da=(prev-avheights[a]==0)?(-(next-avheights[a])/2):((next-avheights[a])/(prev-avheights[a]));
					das.push(-da);
					//av.push(Math.round(margin+(pixelsPerDay*a)-1)+' '+avheights[a]+' C'+Math.round(margin+(pixelsPerDay*a)+1)+' '+avheights[a]+' '+Math.round(margin+(pixelsPerDay*(a+1))-1)+' '+avheights[a+1]);
				}
				for(var a=0;a<avheights.length-1;a++) {
					//var prev=(a>0)?avheights[a-1]:avheights[a];
					var next=(a<heights.length-1)?avheights[a+1]:avheights[a];
					av.push(Math.round(margin+(pixelsPerDay*a))+','+avheights[a]+' C'+(margin+(pixelsPerDay*(a+0.3))).toFixed(1)+','+avheights[a]+' '+(margin+(pixelsPerDay*(a+0.7))).toFixed(1)+','+(next)+' '+Math.round(margin+(pixelsPerDay*(a+1)))+','+next);
				}
				this.graph.append(
					//gc.append(
						$(svg).append(
							$(path).attr('d','M'+margin+' '+(height+margin)+' L'+d.join(' L')+' L'+(margin+(pixelsPerDay*days))+' '+(height+margin)+' Z')
						).append(
							$(avpath).attr('d','M'+margin+' '+(height+margin)+' L'+av.join(' L')+' L'+(margin+(pixelsPerDay*days))+' '+(height+margin)+' Z')
						)
					)
				//)
				;
				var step=60;
				if (this.highestActivity>(2*3600)) {
					step=3600; // hour
				}else if (this.highestActivity>1800) {
					step=1800; // 30 mins
				}else if (this.highestActivity>600) {
					step=300; // 5 mins
				}
				for(var m=step;m<this.highestActivity;m+=step) {
					var v=m/60;
					var txt=v+' '+yoodoo.w("min"+((v==1)?'':'s'));
					if (this.highestActivity>(2*3600)) {
						v=m/3600;
						var txt=v+' '+yoodoo.w("hour"+((v==1)?'':'s'));
					}
					this.legendY.append(
						$(yoodoo.e("span")).css({
							bottom:(height*(m/this.highestActivity))-7
						}).html(txt)
					);
				}
			}
			yoodoo.ui.behaviours.swipe(this.graph.get(0), {snapToChildren:false});
			return this.graphContainer;
		};
	},
	gotGroups:function(r) {
		if (!yoodoo.ajax) r=Base64.decode(r);
		r=$.parseJSON(r);
		yoodoo.commenting.setTime();
		this.groups=r.member;
		this.optionalGroups=r.optional;
		for(var g=0;g<this.groups.length;g++) {
			for(var u=0;u<this.groups[g].users.length;u++) {
				this.groups[g].users[u].group=this.groups[g];
				if (this.users[this.groups[g].users[u].id]===undefined) {
					this.users[this.groups[g].users[u].id]=new this.user(this.groups[g].users[u]);
				}
			}
		}
		this.userIds=[];
		for(var id in this.users) this.userIds.push(id);
		var me=this;
		this.userIds.sort(function(a,b) {
			return me.users[b].last_login.getTime()-me.users[a].last_login.getTime();
		});
		this.userList.css({width:this.userIds.length*92});
		this.drawUsers();
		$(':focus').blur();
		yoodoo.commenting.show({
			container:this.commentList,
			comments:r.comments.comments
		});
//alert($('.community').height()+','+$('.community').parent().height()+','+$('.community .screen').height()+','+$('.community .screen>div').height());
	},
	drawUsers:function() {
		for(var i in this.userIds) {
			this.userList.append(this.users[this.userIds[i]].render());
		}
		yoodoo.ui.behaviours.swipe(this.communityUsers.get(0), {snapToChildren:false,scrolled:true});
	}
};
yoodoo.commenting={
	container:null,
	subject:null,
	comments:null,
	commentsById:{},
	perPage:5,
	lastLoad:null,
	canGetMore:true,
	setTime:function() {
		this.lastLoad=new Date(new Date().getTime()-yoodoo.serverTimeOffset);
	},
	show:function(opts){
		this.container=null;
		this.subject=null;
		this.comments=null;
		this.canGetMore=true;
		this.commentsById={};
		if (opts.container!==undefined) this.container=opts.container;
		if (opts.subject!==undefined) this.subject=opts.subject;
		if (opts.comments!==undefined) this.parseComments(opts.comments);		
		this.render();
	},
	more:function() {
		var before=new Date(this.comments[this.comments.length-1].updated_at.getTime()-yoodoo.serverTimeOffset);
		yoodoo.sendPost(null,{
			cmd:'commentsFeed',
			sharing:'1',
			amount:this.perPage,
			before:yoodoo.formatDate('Y/m/d H:i:s',before),
			after:yoodoo.formatDate('Y/m/d H:i:s',this.lastLoad),
			context:this,
			callback:'yoodoo.commenting.gotUpdate'
		});
	},
	add:function() {
		var ip=new yoodoo.ui.textarea({
			label:yoodoo.w('new_comment'),
			required:true
		});
		var ss=null;
		if (yoodoo.dooit.item!==null && yoodoo.dooit.item.content_id===yoodoo.community.contentId && yoodoo.dooit.params.canSnapshot===true) {
			ss=new yoodoo.ui.checkbox({
				label:yoodoo.w('_snapshots')
			});
		}
		yoodoo.display.add({
			title:'community',
			obj:$(yoodoo.e("div")).css({
			}).addClass('newComment').append(
				yoodoo.buildHeader({
					logo: yoodoo.logo.svg,
					logoWidth: yoodoo.logo.width,
					logoHeight: yoodoo.logo.height,
					menu: false,
					back: 'yoodoo.display.remove();',
					search: false,
					community: false,
					title: yoodoo.w("post_comment")
				})
			).append(
				$(yoodoo.e("div")).addClass('screen').css({
					'padding-top':yoodoo.header_height
				}).append(
					isNaN(yoodoo.community.contentId)?null:$(yoodoo.e("h2")).html(yoodoo.sessions._content[yoodoo.community.contentId].name)
				).append(
					(ss!==null)?ss.render(false):null
				).append(ip.render('')).append(
					$(yoodoo.e("button")).attr("type","button").addClass('postCommentButton').html(yoodoo.w('post')).css({
						margin:'10px auto',
						display:'block'
					}).click(function() {
						if (ip.value!="") {
							yoodoo.display.remove();
							yoodoo.commenting.post({
								content:ip.value,
								groups:'all',
								snapshot:(ss===null)?false:ss.value
							});
						}
					})
				)
			),
			animate:true,
			hideBelow:true,
			complete:function() {
				ip.input.focus();
			}
		});
		yoodoo.ui.update();
	},
	post:function(obj) {
		yoodoo.interface.showDialog(yoodoo.w('sending')+'&hellip;');
		var params={
			context:this,
			groups:'all',
			sharing:'1',
			callback:'yoodoo.commenting.posted',
			cmd:'commentsFeed',
			newComment:Base64.encode(obj.content)
		};
		if (!isNaN(yoodoo.community.contentId)) {
			params.contentId=yoodoo.community.contentId;
			if (obj.snapshot===true && yoodoo.dooit.item!==null && yoodoo.dooit.item.content_id===yoodoo.community.contentId) params.snapshot=Base64.encode(yoodoo.dooit.makeSnapshot());
		}
		yoodoo.sendPost(null,params);
	},
	posted:function(r) {
		yoodoo.interface.hideDialog();
		this.gotUpdate(r);
	},
	gotUpdate:function(r) {
		r=$.parseJSON(r);
		if (r.comments.length>0) {
			this.parseComments(r.comments);
		}else{
			this.canGetMore=false;
			var nomore=$(yoodoo.e("div")).html(yoodoo.w("no_more")).hide();
			this.container.append(nomore);
			var me=this;
			nomore.slideDown(300,function() {
				me.container.animate({
					scrollTop:me.container.get(0).scrollHeight-me.container.height()
				});
			});
		}
	},
	parseComments:function(comments) {
		if (this.comments===null) this.comments=[];
		var reveal=this.container.get(0).scrollTop==0;
		var st=this.container.get(0).scrollHeight;
		for(var c in comments) {
			if (this.commentsById[comments[c].id]!==undefined) {
				this.commentsById[comments[c].id].update(comments[c]);
			}else{
				var com=new this.comment(comments[c]);
				this.commentsById[comments[c].id]=com;
				this.comments.push(com);
				var cont=com.render();
				if (reveal) cont.hide();
				if (this.lastLoad!==null && com.updated_at>this.lastLoad) {
					this.container.prepend(cont);
				}else{
					this.container.append(cont);
				}
				if (reveal) cont.slideDown();
			}
		}
		if (comments!==undefined) {
			if (this.perPage==comments.length) this.container.append(this.newMoreButton());
		}
		this.comments.sort(function(a,b) {
			return b.updated_at.getTime()-b.updated_at.getTime();
		});
		if (!reveal) this.container.animate({
			scrollTop:st
		});
	},
	newMoreButton:function() {
		var me=this;
		if (this.moreButton!==undefined) return this.moreButton;
		this.moreButton=$(yoodoo.e("button")).attr("type","button").html(yoodoo.w('older')+'&hellip;').click(function() {
			$(this).unbind("click").slideUp(300,function() {
				$(this).remove();
				me.moreButton=undefined;
				yoodoo.commenting.more();
			});
		});
		return this.moreButton;
	},
	render:function() {
		if (this.container!==null) {
			//yoodoo.commenting.renderComments();
		}else{
			this.container=$(yoodoo.e("div"));
			yoodoo.display.add({
				name:'comments',
				obj:this.container,
				complete:function() {
					if (yoodoo.commenting.comments!==null) {
						yoodoo.commenting.renderComments();
					}else{
						yoodoo.commenting.fetchComments();
					}
				}
			});
		}
	},
	fetchComments:function() {
		// get comments by subject
	},
	comment:function(params) {
		this.responseObjects=[];
		this.responseObjectsById={};
		this.parse=function() {
			for(var k in params) this[k]=params[k];
			var d=new Date();
			try{
				eval('d='+this.updated_at);
				d=new Date(d.getTime()+yoodoo.serverTimeOffset);
			}catch(e){
				yoodoo.errorLog(e);
			}
			this.updated_at=d;
			var d=new Date();
			try{
				eval('d='+this.created_at);
				d=new Date(d.getTime()+yoodoo.serverTimeOffset);
			}catch(e){
				yoodoo.errorLog(e);
			}
			this.created_at=d;
			if (this.target_id!==null) this.target=yoodoo.sessions._content[this.target_id];
		};
		this.render=function() {
			if (this.container===undefined) {
				this.user=yoodoo.community.users[this.user_id];
				var me=this;
				this.container=$(yoodoo.e("button")).attr("type","button").addClass("comment").click(function() {
					me.show();
				});
				this.buildRender();
			}
			return this.container;
		};
		this.buildRender=function() {
			var response=null;
			if (this.responses!==undefined && this.responses>0 ) response=$(yoodoo.e("div")).addClass("responses").append(
				$(yoodoo.e("div")).html(this.responses).append(yoodoo.icons.get('left',20,20))
			);
			this.container.empty().append(
				this.user.minirender({responses:2})
				//this.user.minirender({responses:this.responses})
			).append(
				$(yoodoo.e("div")).addClass("content").html(
					'&nbsp;-&nbsp;'+this.comment.replace(/\n/g,'<br />')
				).prepend(
					$(yoodoo.e("span")).html(this.user.fullname()).addClass('nickname')
				).prepend(
					(this.target===undefined)?null:$(yoodoo.e("div")).html(this.target.name)
				).append(response)
			).append(
				$(yoodoo.e("div")).addClass("content_ago").html(
					yoodoo.ago(this.updated_at)
				)
			);
		};
		this.update=function(params) {
			this.parse(params);
			this.buildRender();
		};
		this.parse(params);
		this.show=function() {
			var me=this;
			var header=yoodoo.buildHeader({
				logo: yoodoo.logo.svg,
				logoWidth: yoodoo.logo.width,
				logoHeight: yoodoo.logo.height,
				menu: false,
				back: 'yoodoo.display.remove();',
				search: false,
				community: false,
				title: this.comment
			});
			this.details=$(yoodoo.e("div")).addClass("commentDetails").bind("scroll",function(e) {
				if (this.scrollHeight-$(this).height()-this.scrollTop>100) me.addButton.removeClass('off');
			});
			var container=$(yoodoo.e("div")).addClass("commentView").append(header).append(
				$(yoodoo.e("div")).addClass('screen').css({
					'padding-top':yoodoo.header_height
				}).append(this.details).append(this.drawAddButton())
			);
			yoodoo.display.add({
				name:'commentDetail',
				obj:container,
				animate:true,
				reveal:function() {
					me.showResponses();
				}
			});
			this.drawResponder();
			this.showResponses();
		};
		this.scrollToBottomOf=function(obj,complete) {
			if (typeof(complete)!="function") complete=function(){};
			var b=obj.offset().top+obj.outerHeight(true);
			b-=this.details.offset().top-this.details.get(0).scrollTop;
			this.details.animate({scrollTop:b-this.details.height()},500,complete);
		};
		this.drawAddButton=function() {
			if (this.addButton===undefined) {
				this.addButton=$(yoodoo.e("button")).attr("type","button").append(yoodoo.icons.get("add",20,20,{'4d4d4d':'ffffff'})).addClass("addButton").css({
					padding:10,
					top:yoodoo.header_height+5,
					right:5,
					position:'absolute'
				});
			}
			var me=this;
			return this.addButton.unbind("click").click(function() {
				var source=me;
				me.scrollToBottomOf($(me.responder),function() {
					source.ip.input.focus();
				});
			});
		};
		this.drawResponder=function() {
			var me=this;
			if (this.responder!==undefined) this.responder.remove();
			
			this.respondButton=$(yoodoo.e("button")).attr("type","button").html(yoodoo.w("post")).click(
				function() {
					if (me.ip.value!="") me.sendResponse(me.ip.value);
				}
			).hide();
			this.ip=new yoodoo.ui.textarea({label:yoodoo.w("_reply"),
			onchange:function(e) {
				if (this.value!="") {
					me.respondButton.show();
					me.scrollToBottomOf($(me.responder));
				}else{
					me.respondButton.slideUp();
				}
			}});
			
			this.responder=$(yoodoo.e("div")).append(
				this.ip.render('')
			).addClass("responder").append(this.respondButton).css({
				'padding-bottom':10
			});
			
			$(this.ip.input).bind('focus',function() {
				if (me.addButton.top===undefined) me.addButton.top=me.addButton.css('top');
				me.addButton.addClass('off');
				
				if (this.value!="") {
					me.respondButton.show();
					me.scrollToBottomOf($(me.responder));
				}
			}).bind('blur',function() {
				me.addButton.removeClass('off');
				me.respondButton.slideUp();
			});
			this.details.append(
				this.responder
			);
			yoodoo.ui.update();
		};
		this.sendResponse=function(txt) {
			yoodoo.interface.showDialog(yoodoo.w('sending')+'&hellip;');
			yoodoo.sendPost(null,{
				cmd:'commentsFeed',
				sharing:'1',
				respond:this.id,
				newComment:Base64.encode(txt),
				context:this,
				callback:'yoodoo.commenting.commentsById['+this.id+'].gotResponses'
			});
		};
		this.showResponses=function() {
			//this.details.append(
				$(yoodoo.e("div")).append(
					this.user.minirender({responses:2})
					//this.user.minirender({responses:this.responses})
				).append(
					$(yoodoo.e("div")).addClass("content").html(
						'&nbsp;-&nbsp;'+this.comment.replace(/\n/g,'<br />')
					).prepend(
						$(yoodoo.e("span")).html(this.user.fullname()).addClass('nickname')
					).prepend(
						(this.target===undefined)?null:$(yoodoo.e("div")).html(this.target.name)
					)
				).append(
					$(yoodoo.e("div")).addClass("content_ago").html(
						yoodoo.ago(this.created_at)
					)
				).insertBefore(this.responder);
			//);
			yoodoo.sendPost(null,{
				cmd:'commentResponses',
				context:this,
				callback:'yoodoo.commenting.commentsById['+this.id+'].gotResponses',
				commentId:this.id
			});
		};
		this.gotResponses=function(r) {
			this.ip.input.value='';
			this.ip.processChange();
			yoodoo.interface.hideDialog();
			this.responseObjects=[];
			var res=$.parseJSON(r);
			for (var a=0;a<res.length;a++) {
				if (this.responseObjectsById[res[a].id]!==undefined) {
					this.responseObjectsById[res[a].id].update(res[a]);
				}else{
					this.responseObjectsById[res[a].id]=new this.response(res[a]);
				}
				this.responseObjects.push(this.responseObjectsById[res[a].id]);
			}
			this.responseObjects.sort(function(a,b) {
				return a.updated_at.getTime()-b.updated_at.getTime();
			});
			this.responses=this.responseObjects.length;
			for(var r=0;r<this.responseObjects.length;r++) {
				var div=this.responseObjects[r].render();
				div.insertBefore(this.responder);
				//this.details.append(div);
			}
			this.buildRender();
		};
		this.response=function(params) {
			this.update=function(params) {
				for(var k in params) this[k]=params[k];
				if (typeof(this.created_at)=='string') {
					var d=new Date();
					try{
						eval('d='+this.created_at);
					}catch(e){
						yoodoo.errorLog(e);
					}
					this.created_at=d;
				}
				if (typeof(this.updated_at)=='string') {
					var d=new Date();
					try{
						eval('d='+this.updated_at);
					}catch(e){
						yoodoo.errorLog(e);
					}
					this.updated_at=d;
				}
				
				if (!isNaN(this.user_id) && yoodoo.community.users[this.user_id]!==undefined) {
					this.author=yoodoo.community.users[this.user_id];
				}else{
					this.author=new yoodoo.community.user({
						id:this.user_id,
						name:this.author,
						photo:''
					});
				}
				this.updateRender();
			};
			this.render=function() {
				if (this.container===undefined) this.container=$(yoodoo.e("div"));
				this.updateRender();
				return this.container;
			};
			this.updateRender=function() {
				if (this.container!==undefined) {
					this.container.empty().append(
						$(yoodoo.e("div")).addClass("content").html(' - '+this.comment.replace(/\n/g,'<br />')).prepend(
							$(yoodoo.e("span")).addClass('nickname').html(this.author.fullname())
						)
					).append(
						$(yoodoo.e("div")).addClass("content_ago").html(yoodoo.ago(this.updated_at))
					);
					if (this.author.minirender!==undefined) this.container.prepend(this.author.minirender());
				}
			};
			this.update(params);
		};
	}
};
yoodoo.notification={
	notice:function(data) {
		this.read=false;
		for(var k in data) this[k]=data[k];
		if (typeof(this.created)=='string') {
			var d=new Date();
			try{
				eval('d='+this.created);
				this.created=d;
			}catch(e) {
				yoodoo.errorLog(e);
			}
		}
		this.minisummary=function() {
			if (this.miniSummaryButton===undefined) this.miniSummaryButton=$(yoodoo.e("button")).attr("type","button");
			var me=this;
			if (this.warning) this.miniSummaryButton.addClass("warning");
			return this.miniSummaryButton.html(this.title).append(
				$(yoodoo.e("div")).html(yoodoo.ago(this.created))
			).prepend(
				yoodoo.icons.get("next",20,20)
			).click(function() {
				yoodoo.notification.show(me);
			});
		};
		this.summary=function() {
			if (this.summaryButton===undefined) this.summaryButton=$(yoodoo.e("div"));
			var but=this.commandButton();
			//alert("Call summary");
			return this.summaryButton.empty().append(
				$(yoodoo.e("div")).html(this.title).addClass("messagetitle")
			).append(
				(but===null)?$(yoodoo.e("div")).html(this.content).addClass('fullmessage'):null
			).prepend(
				$(yoodoo.e("div")).html(yoodoo.ago(this.created)).css({'text-align':'right','font-size':'11px'})
			).append(but);
		};
		this.commandButton=function() {
			if (this.command===undefined || this.command===null || this.command=='') return null;
			if (this.cmdButton===undefined) {
				this.cmdButton=$(yoodoo.e("button")).attr("type","button").html(this.content).append(
					yoodoo.icons.get("next",20,20)
				);
			}
			var cmd=this.command;
			this.cmdButton.click(function() {
					yoodoo.display.remove('notification',function() {
						try{
							eval(cmd);
						}catch(e){}
					});
				});
			return this.cmdButton;
		};
		this.asRead=function() {
			this.read=true;
			if (this.miniSummaryButton!==undefined) this.miniSummaryButton.slideUp(300,function() {
				$(this).remove();
			});
			for(var n=yoodoo.notices.length-1;n>=0;n--) {
				if (yoodoo.notices[n].id==this.id) yoodoo.notices.splice(n,1);
			}
		};
	},
	viewing:null,
	show:function(notice) {
		//console.log(JSON.stringify(notice));
		if (notice.read===undefined) notice=new this.notice(notice);
		this.viewing=notice;
		var me=this;
		var header=yoodoo.buildHeader({
			logo: yoodoo.logo.svg,
			logoWidth: yoodoo.logo.width,
			logoHeight: yoodoo.logo.height,
			menu: false,
			back: 'yoodoo.display.remove("notification");',
			search: false,
			community: false,
			title: yoodoo.w('_notification')
		});
		this.details=$(yoodoo.e("div")).addClass("notificationDetails");/*.append(
			$(yoodoo.e("div")).html(yoodoo.formatDate('jS F Y',notice.created))
		).append(
			$(yoodoo.e("div")).html(notice.content)
		);*/
		if (notice.warning) this.details.addClass("warning");
		this.details.append(notice.summary());

		var container=$(yoodoo.e("div")).addClass("notificationView").append(header).append(
			$(yoodoo.e("div")).addClass('screen').css({
				'padding-top':yoodoo.header_height
			}).append(this.details)
		);
		yoodoo.display.add({
			name:'notification',
			obj:container,
			animate:true,
			hideBelow:true,
			revealed:function() {
			},
			removed:function() {
				if (yoodoo.display.getIndex("notifications")===false) yoodoo.sessions.showHub();
			}
		});
		if (notice.id!==undefined) {			
			yoodoo.sendPost(null,{
				cmd:'notificationRead',
				noticeId:notice.id,
				context:this,
				callback:'yoodoo.notification.read'
			});
		}
	},
	read:function(r) {
		var reply=$.parseJSON(r);
		if (reply===true) {
			this.viewing.asRead();
		}
	},
	list:function() {
		if (yoodoo.notices.length==1) {
			this.show(yoodoo.notices[0]);
		}else{
			var me=this;
			var header=yoodoo.buildHeader({
				logo: yoodoo.logo.svg,
				logoWidth: yoodoo.logo.width,
				logoHeight: yoodoo.logo.height,
				menu: false,
				back: 'yoodoo.display.remove("notifications");',
				search: false,
				community: false,
				title: yoodoo.w('_notifications')
			});
			var listing=$(yoodoo.e("div"));
			for(var n=0;n<yoodoo.notices.length;n++) {
				listing.append(yoodoo.notices[n].minisummary());
			}
			var container=$(yoodoo.e("div")).addClass("notificationView").append(header).append(
				$(yoodoo.e("div")).addClass('screen').css({
					'padding-top':yoodoo.header_height
				}).append(listing)
			);
			yoodoo.display.add({
				name:'notifications',
				obj:container,
				animate:true,
				hideBelow:true,
				revealed:function() {
					if (yoodoo.notices.length==0) yoodoo.display.remove('notifications',function() {
						yoodoo.sessions.showHub();
					});
				},
				removed:function() {
					if (yoodoo.isApp) yoodoo.sessions.showHub();
				}
			});
		}
	}
};
yoodoo.profile={
	show:function() {
		// edit profile
	}
};
yoodoo.audio= {
		file: null,
		object: null,
		source: null,
		onUpdate: function() {},
		onComplete: function() {},
		playing: false,
		autoplay: false,
		updateTimer: null,
		updateInterval: 100,
		additionalType: [{
				mime: 'audio/ogg',
				subfolder: 'ogg',
				extension: 'ogg',
				codecs: 'vorbis'
			}
			//{mime:'audio/m4a',subfolder:'m4a',extension:'m4a',codecs:'vorbis'}
		],
		playType: -1, // -1 = default mp3
		init: function() {
			if (this.object === null) {
				this.object = document.createElement("audio");
				if (yoodoo.option.voiceoverMovie!==undefined && yoodoo.option.voiceoverMovie.flashvars!==undefined ) this.object.volume = yoodoo.option.voiceoverMovie.flashvars.volume / 100;
				$(this.object).attr("onloadedmetadata", 'yoodoo.audio.loaded()');
				//this.object.onloadeddata=function() {yoodooPlaya.audio.loaded();};
				$(this.object).attr("onerror", 'alert("Audio error")');
				$(this.object).attr("onended", 'yoodoo.audio.ended()');
				$(this.object).attr("ontimeupdate", 'yoodoo.audio.update()');
				$(this.object).attr("onprogress", 'yoodoo.audio.update()');
				$(this.object).attr("preload", "auto");
				yoodoo.widget.appendChild(this.object);
				if (!this.object.canPlayType('audio/mpeg')) {
					for (var i = 0; i < this.additionalType.length; i++) {
						if (this.object.canPlayType(this.additionalType[i].mime)) this.playType = i;
					}
				}
				if (this.playType < 0) {
					$(this.source).attr("type", 'audio/mpeg;codecs="mp3"');
				} else {
					$(this.source).attr("type", this.additionalType[this.playType].mime + ';' + (this.additionalType[this.playType].codecs ? 'codecs="' + this.additionalType[this.playType].codecs + '"' : ''));
				}
			}
		},
		clear: function() {
			this.init();
			while (this.object.childNodes.length > 0) this.object.removeChild(this.object.childNodes[0]);
		},
		ended: function() {
			this.pause();
			this.onComplete();
		},
		stop: function() {
			this.pause();
			this.clear();
		},
		loaded: function() {
			if (this.autoplay) this.play();
			this.autoplay = false;
		},
		typeUrl: function(url) {
			if (this.playType < 0) return url;
			var turl = url.replace(/^(.*)\/([^\/]+)\.([^\/]+)$/, '$1/' + this.additionalType[this.playType].subfolder + '/' + '$2.' + this.additionalType[this.playType].extension);
			return turl;
		},
		load: function(url) {
			if (url===null) return false;
			this.init();
			this.clear();
			url=yoodoo.replaceDomain(url);
			//if (yoodooPlaya.localFiles) url = url.replace(/^http\:\/\/feserver\.yoodidit\.co\.uk\//, yoodoo.option.baseUrl);
			this.source = document.createElement("source");
			//url='http://www.yoodoo.co/uploads/audio/test.mp3';
			if (arguments.length > 1) {
				if (arguments[1].onUpdate != undefined) {
					this.onUpdate = arguments[1].onUpdate;
				} else {
					this.onUpdate = function() {};
				}
				if (arguments[1].onComplete != undefined) {
					this.onComplete = arguments[1].onComplete;
				} else {
					this.onComplete = function() {};
				}
			} else {
				this.onComplete = function() {};
				this.onUpdate = function() {};
			}
			//this.autoplay=false;
			this.playing = false;
			this.file = this.typeUrl(url);
			this.source.src = this.file;
			this.object.appendChild(this.source);
			this.object.load();
		},
		preload: function() {
			this.autoplay = false;
			if (arguments.length > 1) {
				this.load(arguments[0], arguments[1]);
			} else {
				this.load(arguments[0]);
			}
		},
		loadAndPlay: function() {
			this.autoplay = true;
			if (arguments.length > 1) {
				this.load(arguments[0], arguments[1]);
			} else {
				this.load(arguments[0]);
			}
			if (this.mobile) this.play();
		},
		play: function() {
			this.playing = true;
			this.object.play();
		},
		pause: function() {
			this.playing = false;
			this.autoplay = false;
			if (this.object!==null) this.object.pause();
		},
		update: function() {
			var st = this.status();
			this.onUpdate(st);
		},
		status: function() {
			var reply = {};
			if (this.object.buffered.length > 0) {
				reply.buffer = this.object.buffered.end(0) - this.object.buffered.start(0);
			} else {
				reply.buffer = 0;
			}
			reply.buffer = 100 * (reply.buffer / this.object.duration);
			reply.currentTime = this.object.currentTime;
			reply.volume = this.object.volume;
			reply.duration = this.object.duration;
			reply.state = this.object.readyState;
			reply.buffering = (reply.state > 1 && reply.state < 4);
			reply.bufferedAhead = (this.object.duration - this.object.currentTime);
			reply.progress = 100 * (this.object.currentTime / this.object.duration);
			return reply;
		}
	};
