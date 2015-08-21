function integerWidget(src) {
	this.widget=src;
	this.container=null;
	this.allow_continue=true;
	this.widget.autoReady=false;
	var me=this;
	this.widget.setSize({aspect:2,complete:function(widget) {
		widget.readied=true;
		//widget.readyCallback();
		me.render();
		widget.readyCallback();
	}});
	this.widget.priority=0;
	$(this.widget.display).empty();
	this.build=function() {
		this.findQuestion();
		this.findAnswer();
		this.findUsersTotals();
		if (this.widget.data.exercise.display.options.experienceId!==undefined) {
			this.experienceId=this.widget.data.exercise.display.options.experienceId.value;
		}
		this.setPriority();
		this.widget.field_was_updated=function() { // required
			this.object.findAnswer();
			this.object.findUsersTotals();
			this.object.render();
		};
		this.widget.preventing_continue=function(){
			if (this.object===undefined || this.object.allow_continue===undefined) return true;
			return !this.object.allow_continue;
		};
	};
	this.setPriority=function() {
		var p=1*this.widget.data.exercise.display.options.priorityInitial.value;
		if (this.answer!==null) {
			p+=this.answer*this.widget.data.exercise.display.options.priorityValueFactor.value;
		}
		if (this.answerUpdated!==null) {
			var days=Math.floor((new Date().getTime()-this.answerUpdated.getTime())/86400000);
			var hours=Math.floor((new Date().getTime()-this.answerUpdated.getTime())/3600000);
			var minutes=Math.floor((new Date().getTime()-this.answerUpdated.getTime())/60000);
			p+=days*this.widget.data.exercise.display.options.priorityDaysFactor.value;
		}
		if (p<0) p=0;
		if (p>100) p=100;
		this.widget.priority=p;
	};
	this.findQuestion=function() {
		this.globalKey='';
		for(var k in this.widget.data.globals) {
			this.globalKey=k;
		}
		this.questionIndex=-1;
		this.questionKey=null;
		this.questionOption=-1;
		this.usersTotalsKey=null;
		this.question=null;
		for(var s=0;s<this.widget.data.globals[this.globalKey][1].structure.length;s++) {
			for(var o=0;o<this.widget.data.globals[this.globalKey][1].structure[s].value.option.length;o++) {
				var opts=this.widget.data.globals[this.globalKey][1].structure[s].value.option[o];
				if (opts.widget!==undefined && opts.widget!==null && opts.widget.exerciseId!=undefined && opts.widget.exerciseId==this.widget.id) {
					this.questionIndex=s;
					this.questionOption=o;
					if (opts.usersTotalsKey!==undefined && opts.usersTotalsKey!="") this.usersTotalsKey=opts.usersTotalsKey;
					this.questionKey=this.widget.data.globals[this.globalKey][1].structure[s].id;
					this.question=this.widget.data.globals[this.globalKey][1].structure[s];
				}
			}
		}
	};
	this.findAnswer=function() {
		this.answer=null;
		this.answerUpdated=null;
		this.answerField=null;
		this.answerFieldKey=null;
		if (this.questionKey===null) return false;
		if (this.questionOption<0) return false;
		for(var d=0;d<this.widget.data.defaulted.length;d++) {
			if (this.widget.data.defaulted[d]!=this.globalKey) {
				if (this.widget.data.fields[this.widget.data.defaulted[d]]!==undefined) {
					this.answerField=this.widget.data.fields[this.widget.data.defaulted[d]];
					this.answerFieldKey=this.widget.data.defaulted[d];
				}
			}
		}
		if (this.answerField!==null) {
			if (this.answerField[1][this.questionKey]===undefined) return false;
			if (this.answerField[1][this.questionKey][this.questionOption]===undefined) return false;
			this.answer=this.answerField[1][this.questionKey][this.questionOption][0];
			if (this.answerField[1].updated!==undefined) this.answerUpdated=new Date(this.answerField[1].updated);
		}
	};
	this.updateAnswer=function(newValue) {
		var fields=[];
		if (this.answerField!==null) {
			if (this.answerField[1][this.questionKey]===undefined) return false;
			if (this.answerField[1][this.questionKey][this.questionOption]===undefined) return false;
			var dv=newValue-this.answerField[1][this.questionKey][this.questionOption][0];
			this.answerField[1][this.questionKey][this.questionOption][0]=newValue;
			this.answerField[1].updated=new Date().getTime();
			if (this.usersTotalsKey!==null && this.usersTotals!==null) {
				if (yoodoo.usersTotals[this.widget.data.exercise.display.key].counter!=0 && (this.answerField[1].updatedTotals!==undefined && this.answerField[1].updatedTotals[this.usersTotalsKey]===true)) {
					if (dv!=0) {
						yoodoo.set_users_totals(this.usersTotalsKey,dv,newValue,false);
						yoodoo.usersTotals[this.usersTotalsKey].total+=dv;
						if (yoodoo.usersTotals[this.usersTotalsKey].highest<newValue) yoodoo.usersTotals[this.usersTotalsKey].highest=newValue;
						if (yoodoo.usersTotals[this.usersTotalsKey].lowest>newValue) yoodoo.usersTotals[this.usersTotalsKey].lowest=newValue;
					}
				}else{
					if (this.answerField[1].updatedTotals===undefined) this.answerField[1].updatedTotals={};
					this.answerField[1].updatedTotals[this.usersTotalsKey]=true;
					yoodoo.set_users_totals(this.usersTotalsKey,newValue,newValue,true);
					yoodoo.usersTotals[this.usersTotalsKey].total+=newValue;
					yoodoo.usersTotals[this.usersTotalsKey].counter++;
					if (yoodoo.usersTotals[this.usersTotalsKey].highest<newValue) yoodoo.usersTotals[this.usersTotalsKey].highest=newValue;
					if (yoodoo.usersTotals[this.usersTotalsKey].lowest>newValue) yoodoo.usersTotals[this.usersTotalsKey].lowest=newValue;
				}
			}
			var id=this.question.id;
			if (this.question.value.option[this.questionOption].historical===true) {
				if (this.answerField[1].historical===undefined) this.answerField[1].historical=[];
				if (this.answerField[1].historical[id]===undefined) this.answerField[1].historical[id]=[];
				this.answerField[1].historical[id].push({date:new Date(),value:newValue});
			}

			var fields=[[this.answerField[0],dooit.json(this.answerField[1])]];


			var tagRules=(this.question.value.option[this.questionOption].tag_rules);
			if (tagRules!==undefined) {
				var otherTags=[];
				for(var r=0;r<tagRules.length;r++) otherTags.push(tagRules[r].tag);
				for(var r=0;r<tagRules.length;r++) {
					var matched=false;
					try{
						eval('matched=('+newValue+tagRules[r].expression+tagRules[r].value+');');
					}catch(e) {}
					if (matched) {
						dooit.addTag(tagRules[r].tag);
						if (tagRules[r].unique) {
							for(var ot=0;ot<otherTags.length;ot++) {
								if (otherTags[ot]!=tagRules[r].tag)dooit.removeTag(otherTags[ot]);
							}
						}
					}else if(tagRules[r].unset) {
						dooit.removeTag(tagRules[r].tag);
					}
				}
			}
		}
		var me=this;
		yoodoo.updateFields(fields,function (reply) {me.answerUpdateReply(reply);});
		this.allow_continue=true;
	};
	this.answerUpdateReply=function(reply) {
		try{
			var up={};
			eval('up='+reply+';');
			for(var k in up) {
				yoodoo.usersTotals[k]=up[k];
			}
		}catch(e) {}
		this.findAnswer();
		this.findUsersTotals();
		this.render();
		yoodoo.bookcase.updateWidgetField(this.answerFieldKey,this.answerField);
	};
	this.findUsersTotals=function() {
		this.usersTotals=null;
		this.usersTotalsKey=null;
		this.average=null;
		if (this.questionKey===null) return false;
		if (this.questionOption<0) return false;
		if (this.widget.data.exercise.display.key!==undefined && this.widget.data.exercise.display.key!==null && this.widget.data.exercise.display.key!="") {
			//if (yoodoo.usersTotals[this.widget.data.exercise.display.key]!==undefined) {
				this.usersTotalsKey=this.widget.data.exercise.display.key;
				if (yoodoo.usersTotals[this.usersTotalsKey]===undefined) yoodoo.usersTotals[this.usersTotalsKey]={
					total:0,
					counter:0,
					highest:0,
					lowest:0
				};
				this.usersTotals=yoodoo.usersTotals[this.usersTotalsKey];
				if (yoodoo.usersTotals[this.widget.data.exercise.display.key].counter>0) {
					this.average=this.usersTotals.total/this.usersTotals.counter;
				}else{
					this.average=0;
				}
				this.statMax=this.usersTotals.highest;
				this.statMin=this.usersTotals.lowest;
			//}
		}
	};
	this.render=function() {
		if (this.container!==null) $(this.container).remove();
		var b=yoodoo.e("div");
		$(b).css({display:"none"}).addClass("intergerWidgetContainer");
		var maxV=1;
		if (this.question.value.type=='slider') {
			maxV=parseInt(this.question.value.option[this.questionOption].divisions);
		}else if (this.usersTotalsKey!==null) {
			maxV=this.usersTotals.highest;
		}
		if (this.answer===null) {
			var f=yoodoo.e("div");
			$(f).html(this.widget.data.exercise.display.options.incompleteText.value);
			$(b).append(f);
		}else{
			var f=yoodoo.e("div");
			var ins=this.widget.data.exercise.display.options.prefixText.value;
			if (this.widget.data.exercise.display.options.asPercentage.value=="1") {
				//var maxV=parseInt(this.question.value.option[this.questionOption].divisions);
				var pc=100*this.answer/maxV;
				ins+=Math.round(pc)+"%";
			}else{
				ins+=this.answer;
			}
			ins+=this.widget.data.exercise.display.options.suffixText.value;
			$(f).html(ins);
			$(b).append(f);

			var type=this.widget.data.exercise.display.options.style.value;
			/*if (this.usersTotalsKey!==null) {
				if (this.widget.data.exercise.display.options.asPercentage.value=="1") {
					var pc=100*this.average/maxV;
					var f=yoodoo.e("div");
					$(f).html('Average is <span style="color:#e000ff">'+Math.round(pc)+'%</span>');
					$(b).append(f);
				}else{
					var f=yoodoo.e("div");
					$(f).html('Average is <span style="color:#e000ff">'+Math.round(this.average)+'</span>');
					$(b).append(f);
				}
			} */

			if (this.question.value.type=='numeric' && this.widget.data.exercise.display.options.updateable.value=="1") {
				var f=yoodoo.e("div");
				var ip=yoodoo.e("input");
				f.widget=this;
				ip.value=this.answer;
				$(ip).attr("type","text").bind("keydown",function(e) {
					var kc=yoodoo.keyCode(e);
					if (!kc.decimal && !kc.navigate) {
						e.preventDefault();
					}else{
						$(this).next("button").animate({opacity:1});
						$(this).next("button").get(0).disabled=false;
					}
				}).addClass('interactive');
				var save=yoodoo.e("button");
				save.disabled=true;
				$(save).attr('type','button').html('update').bind('click',function() {
					this.disabled=true;
					$(this).animate({opacity:0});
					this.parentNode.widget.updateAnswer(parseFloat($(this).prev("input").val()));
				}).css({opacity:0}).addClass('interactive');
				$(f).append(ip).append(save);
				$(b).append(f);
				
			}
			if (type=='progress bar') {
				if (this.question.value.type=='slider' || this.usersTotalsKey!==null) {
					var f=yoodoo.e("div");
					$(f).addClass('integerProgressBar');
					f.widget=this;
					var a=yoodoo.e("div");
					var pc=Math.round(100*this.answer/maxV);
					$(a).addClass('integerProgressBarAnswer').css({width:pc+'%'});
					f.percentage=pc;
					if (this.usersTotalsKey!==null && this.usersTotals.counter>1) {
						var av=yoodoo.e("div");
						var pcv=Math.round(100*this.average/maxV);
						$(av).addClass('integerProgressBarAverage').css({width:pcv+'%'});
						$(f).append(av);
					}
					if (this.question.value.type=='slider' && this.widget.data.exercise.display.options.updateable.value=="1") {
						$(f).bind("click",function(e) {
							$(this).unbind("click");
							var divs=parseInt(this.widget.question.value.option[this.widget.questionOption].divisions);
							var prop=(e.pageX-$(this).offset().left)/$(this).width();
							this.widget.updateAnswer(Math.round(prop*divs));
						}).addClass("updateable").bind("mousemove",function(e) {
							var divs=parseInt(this.widget.question.value.option[this.widget.questionOption].divisions);
							var prop=(e.pageX-$(this).offset().left)/$(this).width();
							$(this).find(".integerProgressBarAnswer").css({width:(100*prop)+"%"});
						}).bind("mouseleave",function() {
							$(this).find(".integerProgressBarAnswer").animate({width:this.percentage+"%"});
							$(this.widget.container).parent().parent().css({'overflow-x':'hidden','overflow-y':'auto'});
						}).bind("mouseenter",function() {
							$(this).find(".integerProgressBarAnswer").stop();
							//var frame=$(this.widget.container).parent().parent().get(0);
							//frame.css({'overflow':'visible'});
						});
					}
					if (this.usersTotalsKey!==null && this.usersTotals.counter>1) {
						if (this.widget.data.exercise.display.options.displayRange.value=="1") {
							if (this.statMax!==undefined && this.statMin!==undefined && this.statMax!=this.statMin) {
								var r=yoodoo.e("div");
								var bubble=yoodoo.e("div");
								$(bubble).addClass("progressBarBubble");

								if (this.statMax!=this.statMin) {
									var lowest=yoodoo.e("div");
									$(lowest).addClass("progressBarBubbleLowest").css({'margin-right':(100-Math.round(100*this.statMin/maxV))+"%"});
									var icon="<img src='"+yoodoo.option.baseUrl+"uploads/sitegeneric/image/minSymbol.png' />";
									if (this.widget.data.exercise.display.options.asPercentage.value=="1") {
										$(lowest).html(Math.round(100*this.statMin/maxV)+'% '+icon);
									}else{
										$(lowest).html(this.statMin+' '+icon);
									}
									$(bubble).append(lowest);

									var highest=yoodoo.e("div");
									$(highest).addClass("progressBarBubbleHighest").css({'margin-left':Math.round(100*this.statMax/maxV)+"%"});
									var icon="<img src='"+yoodoo.option.baseUrl+"uploads/sitegeneric/image/maxSymbol.png' />";
									if (this.widget.data.exercise.display.options.asPercentage.value=="1") {
										$(highest).html(icon+" "+Math.round(100*this.statMax/maxV)+'%');
									}else{
										$(highest).html(icon+" "+this.statMax);
									}
									$(bubble).append(highest);
								}

								var ave=yoodoo.e("div");
								$(ave).addClass("progressBarBubbleAverage").css({width:'50%','margin-left':(pcv-25)+"%"});
								if (this.widget.data.exercise.display.options.asPercentage.value=="1") {
									$(ave).html("<div>Avg "+pcv+'%</div>');
								}else{
									$(ave).html("<div>Avg "+this.average+"</div>");
								}
								$(bubble).append(ave);

								var pcr=Math.round(100*(this.statMax-this.statMin)/maxV);
								var lr=Math.round(100*(this.statMin)/maxV);
								$(r).addClass('integerProgressBarRange').css({width:pcr+'%','margin-left':lr+"%"});
								$(f).append(r).append(bubble);
							}
						}
					}
					$(f).append(a);
					if (this.usersTotalsKey!==null) $(f).append(av);
					$(b).append(f);
				}
			}

		}
		if (this.widget.data.exercise.display.options.hideExperience!==undefined && this.widget.data.exercise.display.options.hideExperience.value=="1") {
			var a=yoodoo.e('a');
			a.href='javascript:void(0)';
			a.widget=this;
			$(a).bind("click",function() {this.widget.toggleExperienceFilter(this);}).html(this.widget.data.exercise.display.options[(this.experienceId==yoodoo.experienceFilter.show)?'hideExperienceText':'showExperienceText'].value).css({display:'block'});
			$(b).append(a);
		}
		if (this.widget.data.exercise.display.options.openDooit.value=="1") {
			var a=yoodoo.e('a');
			a.href='javascript:void(0)';
			a.widget=this;
			var odt="Open Doo-it";
			if (this.widget.data.exercise.display.options.openDooitText.value!="") odt=this.widget.data.exercise.display.options.openDooitText.value;
			$(a).addClass('openDooitLink').bind("click",function() {$(this).unbind("click");this.widget.openAssociated();}).html(odt).css({display:'block'});
			if (this.widget.data.exercise.display.options.hideExperience!==undefined && this.widget.data.exercise.display.options.hideExperience.value=="1" && this.experienceId!=yoodoo.experienceFilter.show) $(a).css({display:'none'});
			$(b).append(a);
		}
		$(this.widget.display).append(b);
		this.container=b;
		b.widget=this;
		$(b).fadeIn(500,function() {
			var t=yoodoo.e("div");
			$(t).addClass("graphBoundary");
			$(this).append(t);
			this.widget.historical(t);
		});
	};
	this.historical=function(target) {
		var toShow=[];
		var suffix=['st','nd','rd','th','th','th','th','th','th','th','th','th','th','th','th','th','th','th','th','th','st','nd','rd','th','th','th','th','th','th','th','st'];
		var months=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
		if (this.widget.data.exercise.display.options.showHistorical!==undefined && this.widget.data.exercise.display.options.showHistorical.value=="1" && this.answerField!==null) {
			if (this.answerField[1].historical!==undefined && this.answerField[1].historical[this.question.id]!==undefined && this.answerField[1].historical[this.question.id].length>0) {
				var show=this.answerField[1].historical[this.question.id].length;
				if (this.widget.data.exercise.display.options.showHistoricalCount.value!="" && !isNaN(this.widget.data.exercise.display.options.showHistoricalCount.value)) show=parseInt(this.widget.data.exercise.display.options.showHistoricalCount.value);
				
				if (show>this.answerField[1].historical[this.question.id].length) show=this.answerField[1].historical[this.question.id].length;
				for(var i=this.answerField[1].historical[this.question.id].length-show;i<this.answerField[1].historical[this.question.id].length;i++) {
					var record=this.answerField[1].historical[this.question.id][i];
					var h=record.date.getHours();
					var pm=false;
					if (h>=12) {
						pm=true;
						if (h>12) h-=12;
					}
					var m=record.date.getMinutes().toString();
					if (m.length==1) m='0'+m;
					var leg=h+':'+m+(pm?'p':'a')+'m '+record.date.getDate()+suffix[record.date.getDate()-1]+" "+months[record.date.getMonth()]+" "+record.date.getFullYear()+"<br />"+record.value;
					toShow.push({legend:leg,x:record.date.getTime(),y:record.value});
					//console.log(record);
				}
				toShow.sort(function(a,b) {return a.x-b.x;});
			}
		}
		this.graph=new miniGraph(target,{data:toShow});
	};
	this.openAssociated=function() {
		yoodoo.showDooit(this.widget.data.associated.exercise_id);
	};
	this.toggleExperienceFilter=function(button) {
		if (this.experienceId!==undefined) {
			if (this.experienceId==yoodoo.experienceFilter.show) {
				yoodoo.filterBookcase(null,false);
				$(button).html(this.widget.data.exercise.display.options.showExperienceText.value);
				$(button).next('a.openDooitLink').css({display:"none"});
			}else{
				yoodoo.filterBookcase(this.experienceId,true);
				$(button).html(this.widget.data.exercise.display.options.hideExperienceText.value);
				$(button).next('a.openDooitLink').css({display:"block"});
			}
			yoodoo.processFilterBookcase();
		}
	};
	this.build();
}
