/* sample layout
{
	dependencies:[
		['widgets/js/compliance/kloe_threads_widget.js',true],
		['widgets/css/compliance/kloe_threads_widget.css',true]
	],
	continueControl:false,
	ready:function(src) {
		src.object=new kloe_threads_widget(src);
	},
	key:'',
	options:{

	}
}
*/


function kloe_threads_widget(src) {
	this.widget=src;
	this.widget.allow_continue=true;
	this.widget.priority=0;
	this.object=null;
	this.complete=null;
	this.threads=[];
	this.completedThreads=[];
	this.businessSector=null;
	var me=this;
	this.templater=(yoodoo.user.managerType!==undefined && yoodoo.user.managerType.subManagers instanceof Array && yoodoo.user.managerType.subManagers.length>0);
	this.widget.setSize({aspect:this.templater?1.5:1.5,complete:function(widget) {
		widget.readied=true;
		if (me.templater) {
			me.startTemplater();
		}else{
			me.startTemplating();
		}
		widget.readyCallback();
	}});
	this.startTemplater=function() {
		yoodoo.object.get('Prompt Linkage',function(list) {
			me.object=list.pop();
			yoodoo.object.get('Prompt Linkage Complete',function(list) {
				me.complete=list.pop();
				me.render();
			},function(){});
		},function(){});
	};
	this.startTemplating=function() {
		yoodoo.object.get('Prompt Linkage',function(list) {
			me.object=list.pop();
			yoodoo.object.get('Prompt Linkage Complete',function(list) {
				me.complete=list.pop();
				me.render();
			},function(){});
		},function(){});
	};
	this.build=function() {
		this.businessSector=this.widget.data.exercise.display.options.businessSector.value;
		this.widget.priority=20;
	};
	this.showIntervention=function() {
		this.widget.showIntervention();
	};
	this.render=function() { // draw an html string
		$(this.widget.display).append(
			yoodoo.loadingDiv()
		);
		var me=this;
		var filter={
			ypiyt:me.businessSector,
			alsrj:true
		};
		if (this.templater!==true) filter.qepsf=true;
		this.object.get(function(list){
			me.threads=list;
			me.threadIds=[];
			me.threadsById={};
			for(var i in me.threads) {
				me.threadIds.push(me.threads[i].Id);
				me.threadsById[me.threads[i].Id]=me.threads[i];
			}
			//if (me.complete!==null) {
				var filter={};
				filter[me.complete.getParameterReferingToObjectId(me.object.schema.Id)]=[me.threadIds.join(','),'in'];
				me.complete.get(function(list) {
					me.completedThreads=list;
					me.drawButton();
				},function() {},0,filter);
			//}else{
			//	me.drawButton();
			//}
		},function(){},0,filter);
		$(this.widget.container).addClass("kloe_threads_widget")
	};
	this.bottomManagers=function(manager) {
		var total=0;
		if (this.templater===false) return 0;
		if (typeof(manager)=="undefined") manager=yoodoo.user.managerType;
		if (manager.subManagers instanceof Array) {
			for(var m in manager.subManagers) {
				total+=this.bottomManagers(manager.subManagers[m]);
			}
			return total;
		}else{
			return 1;
		}
	};
	this.drawButton=function() {
		var me=this;
		var l=this.threads.length;
		var completeToThread=this.complete.getParameterReferingToObjectId(this.object.schema.Id);
		if (this.templater) {
			var totalManagers=this.bottomManagers();
			var completedById={};
			var notLive=0;
			var live=0;
			for(var t in this.completedThreads) {
				var tid=this.completedThreads[t].value[completeToThread];
				if (completedById[tid]===undefined) completedById[tid]={completed:0,updated:0};
				if (this.threadsById[tid].updated>this.completedThreads[t].updated) {
					completedById[tid].updated++;
				}else{
					completedById[tid].completed++;
				}
			}
			this.threads.sort(function(a,b) {
				return (a.updated<b.updated)?1:-1;
			});
			var display=$(yoodoo.e("div")).addClass("scrollStyle");
			for(var t in this.threads) {
				var tid=this.threads[t].Id;
				if (this.threads[t].value.qepsf!==true) {
					notLive++;
				}else{
					live++;
	//if (t==0) completedById[tid]={completed:totalManagers,updated:0};
	//if (t==1) completedById[tid]={completed:0,updated:totalManagers};
	//if (t==2) completedById[tid]={updated:1,completed:1};
					var thread=$(yoodoo.e("div")).html($(yoodoo.e("span")).html(this.threads[t].displayName()));
					var completeness=$(yoodoo.e("div")).addClass("completeness");
					if (completedById[tid]!==undefined) {
						if (completedById[tid].completed==totalManagers) {
							thread.addClass("fullyComplete");
							yoodoo.bubble(thread.get(0),'All have completed this Thread',{trackMouse:true,fadeOut:false});
						}else if (completedById[tid].updated==totalManagers) {
							thread.addClass("fullyRedo");
							yoodoo.bubble(thread.get(0),'All have completed but must redo this Thread',{trackMouse:true,fadeOut:false});
						}else{
							var txt=[];
							thread.append(completeness);
							if (completedById[tid].completed>0) {
								txt.push(completedById[tid].completed+'/'+totalManagers+' completed');
								completeness.append($(yoodoo.e("div")).addClass("threadComplete").css({width:(completedById[tid].completed*100/totalManagers)+'%'}));
							}
							if (completedById[tid].updated>0) {
								txt.push(completedById[tid].completed+'/'+totalManagers+' to redo');
								completeness.append($(yoodoo.e("div")).addClass("threadUpdated").css({width:(completedById[tid].updated*100/totalManagers)+'%'}));
							}
							yoodoo.bubble(thread.get(0),txt.join('<br />'),{trackMouse:true,fadeOut:false});
						}
					}else{
						thread.addClass('notStarted');
						yoodoo.bubble(thread.get(0),'None have completed this Thread',{trackMouse:true,fadeOut:false});
					}
					display.append(thread);
				}
			}
			var prefix=null;
			if (notLive>0) {
				prefix=$(yoodoo.e("em")).html('+'+notLive+' off thread'+((notLive==1)?'':'s'));
			}
			$(this.widget.display).empty().append(
				$(yoodoo.e("button")).attr("type","button").append(
					$(yoodoo.e('div')).append(display)
				).prepend(prefix).prepend($(yoodoo.e("span")).html(live+' Expert Thread'+((live==1)?'':'s'))).click(function() {
					me.showIntervention();
				})
			);
		}else{
			var completedById={};
			for(var t in this.completedThreads) {
				var tid=this.completedThreads[t].value[completeToThread];
				if (completedById[tid]===undefined) completedById[tid]={completed:false,updated:false,when:null};
				if (this.threadsById[tid].updated>this.completedThreads[t].updated) {
					completedById[tid].updated=true;
					completedById[tid].when=this.threadsById[tid].updated;
				}else{
					completedById[tid].completed=true;
					completedById[tid].when=this.completedThreads[t].updated;
				}
			}
			this.threads.sort(function(a,b) {
				if (completedById[a.Id]!==undefined && completedById[a.Id].completed===true && (completedById[b.Id]===undefined || completedById[b.Id].completed===false)) return 1;
				if (completedById[b.Id]!==undefined && completedById[b.Id].completed===true && (completedById[a.Id]===undefined || completedById[a.Id].completed===false)) return -1;
				if (completedById[a.Id]!==undefined && completedById[a.Id].updated===true && (completedById[b.Id]===undefined || completedById[b.Id].updated===false)) return 1;
				if (completedById[b.Id]!==undefined && completedById[b.Id].updated===true && (completedById[a.Id]===undefined || completedById[a.Id].updated===false)) return -1;
				return (a.updated<b.updated)?1:-1;
			});
			var display=$(yoodoo.e("div")).addClass("scrollStyle");
			for(var t in this.threads) {
				var tid=this.threads[t].Id;
				var thread=$(yoodoo.e("div")).html($(yoodoo.e("span")).html(this.threads[t].displayName()));
				var completeness=$(yoodoo.e("div")).addClass("completeness");
				var txt='';
				if (completedById[tid]!==undefined) {
					if (completedById[tid].completed===true) {
						thread.addClass("fullyComplete");
						txt='Completed '+yoodoo.ago(completedById[tid].when);
					}else if (completedById[tid].updated===true) {
						thread.addClass("fullyRedo");
						txt='Completed but updated '+yoodoo.ago(completedById[tid].when);
					}else{
						thread.addClass('notStarted');
					}
				}else{
					thread.addClass('notStarted');
					txt='Updated '+yoodoo.ago(this.threads[t].updated);
				}
				yoodoo.bubble(thread.get(0),txt,{trackMouse:true,fadeOut:false});
				display.append(thread);
			}
			$(this.widget.display).empty().append(
				$(yoodoo.e("button")).attr("type","button").addClass("userThreads").append(
					$(yoodoo.e('div')).append(display)
				).prepend(
					$(yoodoo.e('span')).html((l>0)?
						'<span>'+this.completedThreads.length+'/'+l+'</span>Expert Thread'+((l==1)?'':'s')
					:
						'No expert threads'
					)
				).click(function() {
					if (l>0) me.showIntervention();
				})
			);
		}
	};
	this.build();
}

