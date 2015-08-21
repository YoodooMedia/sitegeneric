dooit.temporaries('quizit');
var quizit={
	selectors:{
		container:'.quizit'
	},
	containers:{
		container:null,
		pages:null,
		timer:null
	},
	completed:false,
	navigable:false,
	canAutoProgress:false,
	page:-1,
	sequence:-1,
	startTime:null,
	structure:{},
	value:null,
	key:null,
	valuekey:null,
	fields:{},
	status:{},
	scrolledAreaOverflow:'',
	init:function() {
		this.scrolledAreaOverflow=$('#scrolledAreaOverflow').css("overflow");
		dooit.canSnapshot=false;
		dooit.saved=false;
		if (arguments.length>0) this.transposeOptions([],arguments[0]);
		if (arguments.length>1) {
			this.structure=arguments[1];
		}else{
			this.loadFields();
		}
		this.containers.container=$(this.selectors.container);
		if (this.key!==null && this.containers.container!==null) {
			dooit.displayed=quizit.displayed;
			if (this.structure.title==undefined || this.structure.title==null || this.structure.title=='') this.structure.title=yoodoo.dooittitle;
			if (this.structure.paragraph==undefined || this.structure.paragraph==null || this.structure.paragraph=='') this.structure.paragraph=yoodoo.dooitteaser;
			this.containers.container.html("<h2>"+this.structure.title+"</h2><div class='quizit_header'><div class='quizit_progress'><div></div>&nbsp;</div>&nbsp;<div class='quizit_timer_area'><span>Not started</span></div></div><div class='quizit_display_area'></div>");
			this.containers.pages=this.containers.container.find('.quizit_display_area');
			this.containers.timer=this.containers.container.find('.quizit_timer_area');
			this.containers.timer.css({opacity:0});
			this.containers.progress=this.containers.container.find('.quizit_progress');
			this.containers.header=this.containers.container.find('.quizit_header');
			if (this.structure.navigable!=undefined) this.navigable=this.structure.navigable;
			if (this.isNotEmpty(this.structure.timer)) this.navigable=false;
			for(var p=0;p<this.structure.pages.length;p++) {
				if (this.isNotEmpty(this.structure.pages[p].timer)) this.navigable=false;
				this.structure.pages[p].object=new quizit.pageObject(p);
			}
			this.checkUser();
		}
	},
	displayed:function() {
		var mh=$('#yoodooScrolledArea').height()-8;
		var h=mh-(quizit.containers.pages.offset().top-quizit.containers.container.offset().top);
		quizit.containers.pages.css({'max-height':h,width:quizit.containers.pages.width()});
		if (quizit.completed) {
			quizit.finished(true);
		}else{
			quizit.showStart();
		}
		yoodoo.closeDooitFunction=function() {
			quizit.timer.cancel();
			yoodoo.closeDooitFunction=function() {};
		};
	},
	showStart:function() {
		quizit.containers.pages.html("<p>"+this.structure.paragraph+"</p>");
		var cont=document.createElement("button");
		$(cont).attr('type','button');
		$(cont).addClass("yd_cta").html(quizit.structure.start).bind("click",function() {
			quizit.nextPage();
		}).css({display:"none"});
		quizit.containers.pages.get(0).appendChild(cont);
		$(cont).fadeIn();
	},
	checkUser:function() {
		if (this.value.score!==undefined) {
			this.completed=true;
			this.canAutoProgress=false;
		}else{
			this.value={passed:false,score:0,time:0,completeOnPassOnly:this.structure.completeOnPassOnly,pages:[]};
			for(var p=0;p<this.structure.pages.length;p++) this.value.pages.push(this.structure.pages[p].object.defineUserField());
		}
	},
	pageObject:function(i) {
		this.index=i;
		this.pageInfo=quizit.structure.pages[i];
		this.questions=[];
		for(var q=0;q<this.pageInfo.questions.length;q++) {
			this.pageInfo.questions[q].onPageIndex=q;
			this.questions.push(new quizit.question(this.pageInfo.questions[q]));
		}
		this.time=[];
		this.totalTime=0;
		this.defineUserField=function() {
			var shuffle=false;
			if (this.pageInfo.shuffle!=undefined && this.pageInfo.shuffle!=null && this.pageInfo.shuffle!="None") {
				if (this.pageInfo.shuffle=="All") {
					shuffle=this.pageInfo.questions.length;
				}else{
					shuffle=this.pageInfo.shuffle;
				}
			}
			if (shuffle>this.pageInfo.questions.length) shuffle=this.pageInfo.questions.length;
			var reply={questions:[]};
			if (shuffle===false) {
				for(var q=0;q<this.pageInfo.questions.length;q++) {
					reply.questions.push({index:q,key:this.pageInfo.questions[q].id,text:this.pageInfo.questions[q].title,maximum:this.pageInfo.questions[q].maximum,type:this.pageInfo.questions[q].type,answer:{answers:[],maxScore:0}});
				}
			}else{
				var indexes=[];
				for(var q=0;q<this.pageInfo.questions.length;q++) indexes.push(q);
				var shuffled=[];
				for(var q=0;q<shuffle;q++) {
					var r=Math.round((Math.random()*(indexes.length))-0.5);
					if (r<0) r=0;
					if (r>=indexes.length) r=indexes.length-1;
					shuffled.push(indexes.splice(r,1)[0]);
				}
				for(var q=0;q<shuffled.length;q++) {
					if (!quizit.isNotEmpty(this.pageInfo.questions[shuffled[q]].maximum)) this.pageInfo.questions[shuffled[q]].maximum=1;
					reply.questions.push({index:shuffled[q],key:this.pageInfo.questions[shuffled[q]].id,text:this.pageInfo.questions[shuffled[q]].title,maximum:this.pageInfo.questions[shuffled[q]].maximum,type:this.pageInfo.questions[shuffled[q]].type,answer:{answers:[],maxScore:0}});
				}
			}
			var maxScore=0;
			for(var q=0;q<reply.questions.length;q++) {
				var ms=0;
				if (this.pageInfo.questions[reply.questions[q].index].type=="Reorder") {
					//if (quizit.isNotEmpty(this.structure.questions[reply.questions[q].index].scores.position)) {
						for(var o=0;o<this.pageInfo.questions[reply.questions[q].index].options.length;o++) {
							ms+=parseInt(this.pageInfo.questions[reply.questions[q].index].options[o].score);
						}
						//for (p=0;p<this.structure.questions[reply.questions[q].index].scores.position.length;p++) {
						//	ms+=this.structure.questions[reply.questions[q].index].scores.position[p];
						//}
					//}
					if (quizit.isNotEmpty(this.pageInfo.questions[reply.questions[q].index].scoreall)) ms=parseInt(this.pageInfo.questions[reply.questions[q].index].scoreall);
				}else if (this.pageInfo.questions[reply.questions[q].index].options!==undefined && this.pageInfo.questions[reply.questions[q].index].options!==null) {
					var qs=[];
					for(var o=0;o<this.pageInfo.questions[reply.questions[q].index].options.length;o++) {
						if (quizit.isNotEmpty(this.pageInfo.questions[reply.questions[q].index].options[o].score)) qs.push(this.pageInfo.questions[reply.questions[q].index].options[o].score);
					}
					qs.sort(function(a,b) {return b-a;});
					if (!quizit.isNotEmpty(this.pageInfo.questions[reply.questions[q].index].maximum)) this.pageInfo.questions[reply.questions[q].index].maximum=1;
					if (this.pageInfo.questions[reply.questions[q].index].maximum>qs.length) this.pageInfo.questions[reply.questions[q].index].maximum=parseInt(qs.length);
					for(var o=0;o<this.pageInfo.questions[reply.questions[q].index].maximum;o++) {
						ms+=parseInt(qs[o]);
					}
				}
				reply.questions[q].answer.maxScore=ms;
				maxScore+=ms;
			}
			reply.maxScore=maxScore;
			reply.time=0;
			reply.key=this.pageInfo.id;
			return reply;
		};
		this.render=function() {
			quizit.sequence=0;
			var ins="<h3>"+this.pageInfo.title+"</h3>";
			if (this.pageInfo.paragraph!==undefined) ins+="<p>"+this.pageInfo.paragraph+"</p>";
			$(quizit.containers.pages).html(ins);
			for(var q=0;q<quizit.value.pages[this.index].questions.length;q++) {
				var tq=quizit.value.pages[this.index].questions[q].index;
				this.questions[tq].answerIndex=q;
				var show=true;
				if (this.pageInfo.serial===true && q!=quizit.sequence) show=false;
				this.questions[tq].render(quizit.containers.pages.get(0),show);
			}
			var vp=document.createElement("button");
			$(vp).attr('type','button');
			vp.innerHTML=this.pageInfo.serial?(this.pageInfo.nextQuestion):((quizit.page<quizit.structure.pages.length-1)?quizit.structure.nextPage:quizit.structure.finish);
			$(vp).bind("click",function() {
				quizit.completeQuestion();
			}).addClass('yd_cta yd_nextButton').css({float:'right'});
			quizit.containers.pages.get(0).appendChild(vp);
			if (quizit.page>0 && quizit.navigable) {
				var vp=document.createElement("button");
				$(vp).attr('type','button');
				vp.innerHTML="Back";
				$(vp).bind("click",function() {
					$(this).unbind("click");
					quizit.prevPage();
				}).addClass('yd_cta');
				quizit.containers.pages.get(0).appendChild(vp);
			}
			$(quizit.containers.pages).fadeIn(500,function() {
				quizit.timer.start();
			})
			
			yoodoo.stopSound();
			if (this.pageInfo.serial!==true && this.pageInfo.sound!==undefined && this.pageInfo.sound.url!="") yoodoo.playSound(this.pageInfo.sound.url);
		};
	},
	question:function(q) {
		this.settings=q;
		this.answerIndex=-1;
		this.object=new quizit.questionTypes[q.type.toLowerCase().replace(/[^a-z^0-9]+/g,'')](this);
		this.container=null;
		this.render=function(o) {
			this.container=o;
			var op=this.object.render();
			if (arguments.length>1 && arguments[1]===false) $(op).css({display:"none"});
			this.container.appendChild(op);
		};
		this.respond=function() {
			quizit.respondQuestion=this;
			this.nextResponse=null;
			if (arguments.length>0) this.nextResponse=arguments[0];
			var res=false;
//console.log(this.settings);
			if (this.settings.responses!==undefined) {
				for(var r=0;r<this.settings.responses.length;r++) {
					if (this.settings.responses[r].id==this.object.response) {
						this.showResponse(this.settings.responses[r]);
						res=true;
						if (this.settings.responses[r].optionTags!==undefined && this.settings.responses[r].optionTags.length>0) {
							for (var o=0;o<this.settings.responses[r].optionTags.length;o++) {
								if (this.settings.responses[r].optionTags[o].remove) {
									dooit.removeTag(this.settings.responses[r].optionTags[o].tag);
								}else{
									dooit.addTag(this.settings.responses[r].optionTags[o].tag);
								}
							}
						}
					}else{
						if (this.settings.responses[r].optionTags!==undefined && this.settings.responses[r].optionTags.length>0) {
							for (var o=0;o<this.settings.responses[r].optionTags.length;o++) {
								if (this.settings.responses[r].optionTags[o].unset) {
									dooit.removeTag(this.settings.responses[r].optionTags[o].tag);
								}
							}
						}
					}
				}
			}
			if (!res) {
//console.log(this.nextResponse);
				if (this.nextResponse===null) {
					quizit.closeResponse();
				}else{
					this.responded();
				}
			}
		};
		this.showResponse=function(response) {
			this.object.container.question=this;
			this.responseObject=response;
			$('.yd_nextButton').slideUp();
			//$(this.object.container).slideUp(500,function() {
				this.revealResponse();
			//});
		};
		this.protect=function() {
			this.hide=document.createElement("div");
			$(this.hide).css({position:"absolute",width:'100%',height:'100%',padding:0,top:0,left:0,background:'rgba(255,255,255,0.5)'});
			$(this.object.container).css({position:"relative"}).append(this.hide);
			this.responseDiv=document.createElement("div");
			$(this.responseDiv).css({width:$(this.hide).width()-20,height:$(this.hide).height()-20,padding:10,'text-align':'center'});
			$(this.hide).append(this.responseDiv);
		};
		this.revealResponse=function() {
			yoodoo.stopSound();
			$(this.responseDiv).html(this.responseObject.text).css({color:'#'+this.responseObject.colour});
			//console.log(this.responseObject);
			if (this.responseObject.sound!==undefined && this.responseObject.sound.url!="") {
				yoodoo.playSound(yoodoo.option.baseUrl+this.responseObject.sound.url,function() {quizit.respondQuestion.responded();});
			}else{
				if (quizit.structure.reponseTime!==undefined && !isNaN(quizit.structure.reponseTime)) {
					setTimeout('quizit.respondQuestion.responded()',quizit.structure.reponseTime*1000);
				}else{
					this.responded();
				}
			}
		};
		this.responded=function() {
			//console.log(this.nextResponse);
			if (this.nextResponse!==null && quizit.structure.pages[quizit.page].serial!==true) {
				if (this.nextResponse<quizit.structure.pages[quizit.page].object.questions.length) {
					quizit.structure.pages[quizit.page].object.questions[this.nextResponse].respond(this.nextResponse+1);
				}else{
					quizit.closeResponse();
				}
			}else{
				quizit.closeResponse();
			}
		};
	},
	questionTypes:{
		select:function(q) {
			this.question=q;
			this.options=q.settings.options;
			this.title=quizit.isNotEmpty(q.settings.title)?'<div class="question_title">'+q.settings.title+'</div>':'';
			this.paragraph=quizit.isNotEmpty(q.settings.paragraph)?'<p class="question_paragraph">'+q.settings.paragraph+'</p>':'';
			this.container=null;
			this.response=null;
			this.render=function(o) {
				this.container=document.createElement("div");
				$(this.container).addClass("quizit_question").addClass("quizit_select");
				$(this.container).html(this.title+this.paragraph);
				var answers=document.createElement("div");
				$(answers).addClass("quizit_answers");
				for(var o=0;o<this.options.length;o++) {
					var ans=document.createElement("button");
					$(ans).attr('type','button');
					ans.innerHTML=this.options[o].title;
					ans.question=this;
					ans.index=o;
					ans.answer=this.options[o];
					for(var a=0;a<quizit.value.pages[quizit.page].questions[ans.question.question.answerIndex].answer.answers.length;a++) {
						if(quizit.value.pages[quizit.page].questions[ans.question.question.answerIndex].answer.answers[a].index==o) $(ans).addClass("answered");
					}
					$(ans).bind("click",function() {
						$(this).addClass("answered").siblings("button").removeClass("answered");
						this.question.answered(this);
					});
					answers.appendChild(ans);
				}
				this.container.appendChild(answers);
				return this.container;
			};
			this.answered=function(ans) {
				if (quizit.value.pages[quizit.page].questions[ans.question.question.answerIndex].answer.answers.length==0) {
					quizit.value.pages[quizit.page].questions[ans.question.question.answerIndex].answer.answers.push({index:ans.index,value:ans.answer.title,score:ans.answer.score});
					var q=quizit.value.pages[quizit.page].questions[ans.question.question.answerIndex];
					if (q.settings!==undefined && q.settings.usermeta!==undefined && q.settings.usermeta!='') yoodoo.set_meta(q.settings.usermeta,ans.answer.title);
				}else{
					var q=quizit.value.pages[quizit.page].questions[ans.question.question.answerIndex];
					if (q.settings.usermeta!==undefined && q.settings.usermeta!='') yoodoo.set_meta(q.settings.usermeta,ans.answer.title);
					quizit.value.pages[quizit.page].questions[ans.question.question.answerIndex].answer.answers[0].index=ans.index;
					quizit.value.pages[quizit.page].questions[ans.question.question.answerIndex].answer.answers[0].score=ans.answer.score;
					quizit.value.pages[quizit.page].questions[ans.question.question.answerIndex].answer.answers[0].value=ans.answer.title;
				}
				if (ans.response!==undefined && ans.response.length>2) this.response=ans.response;
				quizit.updateStatus();
				quizit.autoProgress(ans);
			};
		},
		multiplechoice:function(q) {
			this.question=q;
			this.options=q.settings.options;
			this.title=quizit.isNotEmpty(q.settings.title)?'<div class="question_title">'+q.settings.title+'</div>':'';
			this.paragraph=quizit.isNotEmpty(q.settings.paragraph)?'<p class="question_paragraph">'+q.settings.paragraph+'</p>':'';
			this.container=null;
			this.render=function(o) {
				this.container=document.createElement("div");
				$(this.container).addClass("quizit_question").addClass("quizit_multiplechoice");
				$(this.container).html(this.title+this.paragraph);
				var answers=document.createElement("div");
				$(answers).addClass("quizit_answers");
				for(var o=0;o<this.options.length;o++) {
					var ans=document.createElement("button");
					$(ans).attr('type','button');
					ans.innerHTML=this.options[o].title;
					ans.question=this;
					ans.index=o;
					ans.answer=this.options[o];
					for(var a=0;a<quizit.value.pages[quizit.page].questions[ans.question.question.answerIndex].answer.answers.length;a++) {
						if(quizit.value.pages[quizit.page].questions[ans.question.question.answerIndex].answer.answers[a].index==o) $(ans).addClass("answered");
					}
					$(ans).bind("click",function() {
						if ($(this).hasClass("answered")) {
							this.question.answered(this,false);
							$(this).removeClass("answered");
						}else if (this.question.answered(this,true)) {
							if (quizit.value.pages[quizit.page].questions[this.question.question.answerIndex].maximum==1) {
								$(this).addClass("answered").siblings("button").removeClass("answered");
							}else{
								$(this).addClass("answered");
							}
						}
					});
					answers.appendChild(ans);
				}
				this.container.appendChild(answers);
				return this.container;
			};
			this.answered=function(ans,on) {
				var idx=-1;
				if (quizit.value.pages[quizit.page].questions[ans.question.question.answerIndex].maximum==1) quizit.value.pages[quizit.page].questions[ans.question.question.answerIndex].answer.answers=[];
				for(var a=0;a<quizit.value.pages[quizit.page].questions[ans.question.question.answerIndex].answer.answers.length;a++) {
					if (quizit.value.pages[quizit.page].questions[ans.question.question.answerIndex].answer.answers[a].index==ans.index) idx=a;
				}
//console.log(idx,quizit.value.pages[quizit.page].questions[ans.question.question.answerIndex].answer.answers);
				if (on) {
					if (on && idx<0 && quizit.value.pages[quizit.page].questions[ans.question.question.answerIndex].answer.answers.length==quizit.value.pages[quizit.page].questions[ans.question.question.answerIndex].maximum) return false;
					if (idx<0) {

//console.log(quizit.value.pages[quizit.page].questions[ans.question.question.answerIndex].answer.answers.length,quizit.value.pages[quizit.page].questions[ans.question.question.answerIndex].maximum);
						if (quizit.value.pages[quizit.page].questions[ans.question.question.answerIndex].answer.answers.length<quizit.value.pages[quizit.page].questions[ans.question.question.answerIndex].maximum) {
							quizit.value.pages[quizit.page].questions[ans.question.question.answerIndex].answer.answers.push({index:ans.index,value:ans.answer.title,score:ans.answer.score});
						}
					}else{
						quizit.value.pages[quizit.page].questions[ans.question.question.answerIndex].answer.answers[idx].index=ans.index;
						quizit.value.pages[quizit.page].questions[ans.question.question.answerIndex].answer.answers[idx].score=ans.answer.score;
						quizit.value.pages[quizit.page].questions[ans.question.question.answerIndex].answer.answers[idx].value=ans.answer.title;
					}
					if (quizit.value.pages[quizit.page].questions[ans.question.question.answerIndex].answer.answers.length==quizit.value.pages[quizit.page].questions[ans.question.question.answerIndex].maximum) quizit.autoProgress(ans);
				}else{
					quizit.value.pages[quizit.page].questions[ans.question.question.answerIndex].answer.answers.splice(idx,1);
				}
//console.log(quizit.value.pages[quizit.page].questions[ans.question.question.answerIndex].answer.answers);
				if (ans.response!==undefined && ans.response.length>2) this.response=ans.response;
				quizit.updateStatus();
				return true;
			};
		},
		draganddrop:function(q) {
			this.question=q;
			this.options=q.settings.options;
			this.title=quizit.isNotEmpty(q.settings.title)?'<div class="question_title">'+q.settings.title+'</div>':'';
			this.paragraph="<div class='quizit_droparea'>"+(quizit.isNotEmpty(q.settings.paragraph)?'<p>'+q.settings.paragraph.replace('[blank]','<span>[blank]</span>')+'</p>':'<p><span>[blank]</span></p>')+"</div>";
			this.container=null;
			this.render=function(o) {
				this.container=document.createElement("div");
				$(this.container).addClass("quizit_question").addClass("quizit_draganddrop");
				$(this.container).html(this.title+this.paragraph);
				var da=$(this.container).find(".quizit_droparea").get(0);
				da.questionIndex=this.question.onPageIndex;
				var answers=document.createElement("div");
				$(answers).addClass("quizit_answers");
				var selectedAnswer='';
				for(var o=0;o<this.options.length;o++) {
					var ans=document.createElement("span");
					$(ans).addClass("buttonlike");
					ans.innerHTML=this.options[o].title;
					ans.question=this;
					ans.questionIndex=this.question.onPageIndex;
					ans.index=o;
					ans.answer=this.options[o];
					for(var a=0;a<quizit.value.pages[quizit.page].questions[ans.question.question.answerIndex].answer.answers.length;a++) {
						if(quizit.value.pages[quizit.page].questions[ans.question.question.answerIndex].answer.answers[a].index==o) {
							$(ans).addClass("answered");
							selectedAnswer=this.options[o].title;
						}
					}
					answers.appendChild(ans);
				}
				this.container.appendChild(answers);
				var clear=document.createElement("div");
				$(clear).css({clear:"both"});
				this.container.appendChild(clear);
				$(answers).find("span").draggable({revert:true});
				$(this.container).find(".quizit_droparea").droppable({
					hoverClass:'quizit_hover_state',
					drop:function(e,u) {
						if (u.helper.get(0).questionIndex==this.questionIndex) {
							u.helper.addClass("answered").siblings('.answered').removeClass('answered');
							$(this).find("p span").html(u.helper.html()).addClass("answered");
							var ans=u.helper.get(0);
							ans.question.answered(ans);
						}
					}
				});
				if (selectedAnswer!="") {
					$(this.container).find("p span").html(selectedAnswer).addClass("answered");
				}
				return this.container;
			};
			this.answered=function(ans) {
				if (quizit.value.pages[quizit.page].questions[ans.question.question.answerIndex].answer.answers.length==0) {
					var q=quizit.value.pages[quizit.page].questions[ans.question.question.answerIndex];
					if (q.settings!==undefined && q.settings.usermeta!==undefined && q.settings.usermeta!='') yoodoo.set_meta(q.settings.usermeta,ans.answer.title);
					quizit.value.pages[quizit.page].questions[ans.question.question.answerIndex].answer.answers.push({index:ans.index,value:ans.answer.title,score:ans.answer.score});
				}else{
					var q=quizit.value.pages[quizit.page].questions[ans.question.question.answerIndex];
					if (q.settings!==undefined && q.settings.usermeta!==undefined && q.settings.usermeta!='') yoodoo.set_meta(q.settings.usermeta,ans.answer.title);
					quizit.value.pages[quizit.page].questions[ans.question.question.answerIndex].answer.answers[0].index=ans.index;
					quizit.value.pages[quizit.page].questions[ans.question.question.answerIndex].answer.answers[0].score=ans.answer.score;
					quizit.value.pages[quizit.page].questions[ans.question.question.answerIndex].answer.answers[0].value=ans.answer.title;
				}
				if (ans.response!==undefined && ans.response.length>2) this.response=ans.response;
				quizit.updateStatus();
				quizit.autoProgress(ans);
			};
		},
		reorder:function(q) {
			this.question=q;
			this.options=q.settings.options;
			this.title=quizit.isNotEmpty(q.settings.title)?'<div class="question_title">'+q.settings.title+'</div>':'';
			this.paragraph=quizit.isNotEmpty(q.settings.paragraph)?'<p class="question_paragraph">'+q.settings.paragraph+'</p>':'';
			this.container=null;
			this.render=function(o) {
				this.container=document.createElement("div");
				$(this.container).addClass("quizit_question").addClass("quizit_reorder");
				$(this.container).html(this.title+this.paragraph);
				if (!quizit.isNotEmpty(this.question.settings.positions)) this.question.settings.positions=this.options.length;
				if (this.question.settings.positions>this.options.length) this.question.settings.positions=this.options.length;
				var displayOrder=[];
				var userAnswers=quizit.value.pages[quizit.page].questions[this.question.answerIndex].answer.answers;
				if (userAnswers.length>0) {
					for(var i=0;i<userAnswers.length;i++) {
						displayOrder.push(userAnswers[i].index);
					}
				}else{
					var tmp=[];
					for(var o=0;o<this.options.length;o++) tmp.push(o);
					while(tmp.length>0) {
						var r=Math.round(((tmp.length)*Math.random())-0.5);
						if (r<0) r=0;
						if (r>=tmp.length) r=tmp.length-1;
						displayOrder.push(tmp.splice(r,1)[0]);
					}
				}
				var answers=document.createElement("div");
				$(answers).addClass("quizit_answers");
				for(var d=0;d<displayOrder.length;d++) {
					var o=displayOrder[d];
					var ans=document.createElement("div");
					$(ans).addClass("buttonlike");
					ans.innerHTML=this.options[o].title;
					ans.question=this;
					ans.index=o;
					ans.answer=this.options[o];
					answers.appendChild(ans);
				}
				this.container.appendChild(answers);
				$(answers).sortable({
					axis:"y",
					containment:"parent",
					update: function( event, ui ) {
						ui.item[0].question.answered();
					}
				});
				this.answered();
				return this.container;
			};
			this.answered=function() {
				quizit.scrollTo(this.container);
				var items=$(this.container).find(".buttonlike").get();
				var q=this.question;
				quizit.value.pages[quizit.page].questions[q.answerIndex].answer.answers=[];
				var newAns=[];
				var allRight=true;
				var score=0;
				for(var i=0;i<items.length;i++) {
					var ans=items[i];
//console.log(this.options,items[i].index);
					if (i<this.question.settings.positions) {
						if (ans.index==i) {
							score+=parseInt(this.options[items[i].index].score);
							//score=this.question.settings.scores.position[i];
						}else{
							allRight=false;
						}
					}
					var a={index:ans.index,value:ans.answer.title,score:score};
					newAns.push(a);
				}
				if (allRight) {
					for(var i=0;i<newAns.length;i++) {
						if (i==0) {
							newAns[i].score=parseInt(this.question.settings.scoreall);
						}else{
							newAns[i].score=0;
						}
					}
				}
				quizit.value.pages[quizit.page].questions[q.answerIndex].answer.answers=newAns;
				$(items).removeClass("answered");
				$(items.splice(0,this.question.settings.positions)).addClass("answered");
				if (ans.response!==undefined && ans.response.length>2) this.response=ans.response;
				quizit.updateStatus();
				return true;
			};
		},
		text:function(q) {
			this.question=q;
			this.options=q.settings.options;
			this.title=quizit.isNotEmpty(q.settings.title)?'<div class="question_title">'+q.settings.title+'</div>':'';
			this.paragraph=quizit.isNotEmpty(q.settings.paragraph)?'<p class="question_paragraph">'+q.settings.paragraph+'</p>':'';
			this.container=null;
			this.render=function(o) {
				this.container=document.createElement("div");
				$(this.container).addClass("quizit_question").addClass("quizit_text");
				$(this.container).html(this.title+this.paragraph);
				var answers=document.createElement("div");
				answers.question=this;
				$(answers).addClass("quizit_answers");
				var ip=document.createElement("input");
				ip.type="text";
				answers.appendChild(ip);
				if (quizit.value.pages[quizit.page].questions[this.question.answerIndex].answer.answers.length==1) ip.value=quizit.value.pages[quizit.page].questions[this.question.answerIndex].answer.answers[0].value;
				$(ip).bind("focus",function() {quizit.scrollTo(this);});
				$(ip).bind("keydown",function(e) {
					var kc=yoodoo.keyCode(e);
					if (kc.enter) {
						e.preventDefault();
						return false;
					}
				});
				$(ip).bind("keyup",function() {
					if (this.value!="") {
						$(this).addClass("answered");
					}else{
						$(this).removeClass("answered");
					}
					this.parentNode.question.answered(this.value);
				});
				if (ip.value!="") {
					$(ip).addClass("answered");
				}else{
					$(ip).removeClass("answered");
				}
				this.container.appendChild(answers);
				this.answered(ip.value);
				return this.container;
			};
			this.answered=function(ans) {
				var q=this.question;
				this.response=null;
				if (q.settings.usermeta!==undefined && q.settings.usermeta!='') yoodoo.set_meta(q.settings.usermeta,ans);
				if (ans=="") {
					quizit.value.pages[quizit.page].questions[q.answerIndex].answer.answers=[];
				}else{
					quizit.value.pages[quizit.page].questions[q.answerIndex].answer.answers=[{index:null,value:ans,score:0}];
					var txt=ans.replace(/^ +/,'').replace(/ +$/,'');
					if (this.question.settings.caseInsensitive) txt=txt.toLowerCase();
					for(var m=0;m<this.options.length;m++) {
						var toCheck=this.options[m].title.replace(/^ +/,'').replace(/ +$/,'');
						if (this.question.settings.caseInsensitive) toCheck=toCheck.toLowerCase();
						if (txt==toCheck) {
							quizit.value.pages[quizit.page].questions[q.answerIndex].answer.answers=[{index:m,value:ans,score:this.options[m].score}];

							this.response='';
							if (this.options[m].response!==undefined && this.options[m].response.length>2) this.response=this.options[m].response;
						}
					}
				}
				if (this.response==null && typeof(q.settings.response)=="string") {
					this.response=q.settings.response;
				}
				quizit.updateStatus();
				return true;
			};
		}
	},
	autoProgress:function() {
		var scrollObject=null;
		if (arguments.length>0) scrollObject=arguments[0];
		if (this.structure.pages[this.page].autoProgress===true && this.canAutoProgress) {
			var done=true;
			for(var q=0;q<this.value.pages[this.page].questions.length;q++) {
				if (this.value.pages[this.page].questions[q].answer.index===null) done=false;
			}
			if (this.structure.pages[this.page].serial===true && this.sequence<this.value.pages[this.page].questions.length-1) done=false;
			if (done) {
				this.nextPage();
			}else if (scrollObject!==null) {
				if (this.structure.pages[this.page].serial===true) {
					quizit.completeQuestion()
				}else{
					quizit.scrollTo(scrollObject);
				}
			}
		}else if (scrollObject!==null) {
			if (this.structure.pages[this.page].serial===true) {
				quizit.completeQuestion()
			}else{
				quizit.scrollTo(scrollObject);
			}
		}
	},
	scrollTo:function(scrollObject) {
		if (scrollObject!==null && typeof(scrollObject)!=="undefined") {
			var qq=dooit.parentElement(scrollObject,'quizit_question');
			var fq=$(qq.parentNode).find('.quizit_question').get();
			if (fq.length==0) {
				fq=qq;
			}else{
				fq=fq[0];
			}
			var st=$(qq).position().top-$(fq).position().top;
			var h=this.containers.pages.height()-$(qq).outerHeight(true);
			if (h<0) h=0;
			st-=(h*0.1);
			this.containers.pages.animate({scrollTop:st});
		}
	},
	updateStatus:function() {
		var answered=0;
		var total=0;
		var score=0;
		var maxScore=0;
		for(var p=0;p<this.value.pages.length;p++) {
			for(var q=0;q<this.value.pages[p].questions.length;q++) {
				if (this.isNotEmpty(this.value.pages[p].questions[q].maximum)) {
					total+=this.value.pages[p].questions[q].maximum;
				}else{
					total++;
				}
				maxScore+=this.value.pages[p].questions[q].answer.maxScore;
				for(var s=0;s<this.value.pages[p].questions[q].answer.answers.length;s++) {
					score+=this.value.pages[p].questions[q].answer.answers[s].score;
				}
				if (this.value.pages[p].questions[q].type=="Reorder") {
					answered++;
				}else{
					answered+=this.value.pages[p].questions[q].answer.answers.length;
				}
				//if (this.value.pages[p].questions[q].answer.answers.length>0) answered++;
			}
		}
		quizit.status={total:total,answered:answered,score:score,maxScore:maxScore,progress:(100*answered/total),percent:(100*score/maxScore)};
		if (isNaN(quizit.status.percent)) quizit.status.percent=0;
		if (isNaN(quizit.status.progress)) quizit.status.progress=0;
		quizit.updateProgress();
	},
	updateProgress:function() {
		var w=$(this.containers.progress).width();
		this.containers.progress.find("div").animate({width:Math.round(w*(this.status.progress/100))+"px"});
		//console.log(this.status.progress,this.status.percent);
	},
	isNotEmpty:function(str) {
		return str!==undefined && str!==null && str!="";
	},
	timer:{
		time:0,
		limit:0,
		timer:null,
		active:false,
		perPage:false,
		container:null,
		start:function() {
			if (quizit.isNotEmpty(quizit.structure.timeout) && quizit.page==0) {
				this.perPage=false;
				this.time=quizit.structure.timeout;
				this.timer=setTimeout('if (quizit!==undefined && quizit.timer!==undefined) quizit.timer.update()',1000);
				this.active=true;
			}else if (quizit.isNotEmpty(quizit.structure.pages[quizit.page].timeout) && quizit.page==0) {
				this.perPage=true;
			}
			if (quizit.isNotEmpty(quizit.structure.pages[quizit.page].timeout) && this.perPage) {
				clearTimeout(this.timer);
				this.time=quizit.structure.pages[quizit.page].timeout;
				this.timer=setTimeout('if (quizit!==undefined && quizit.timer!==undefined) quizit.timer.update()',1000);
				this.active=true;
			}
			if (this.active) {
				this.drawTime();
				quizit.containers.timer.animate({opacity:1});
			}
		},
		cancel:function() {
			this.active=false;
			clearTimeout(this.timer);
		},
		endPage:function() {
			if (this.active && this.perPage) {
				this.active=false;
				clearTimeout(this.timer);
				quizit.containers.timer.html("Complete");
				quizit.containers.timer.animate({opacity:0});
			}
		},
		endQuiz:function() {
			if (this.active) {
				this.active=false;
				clearTimeout(this.timer);
				quizit.containers.timer.html("Complete");
				quizit.containers.timer.animate({opacity:0});
			}
		},
		update:function() {
			this.time--;
			if (this.time<=0) {
				this.active=false;
				clearTimeout(this.timer);
				this.drawTime();
				quizit.containers.timer.animate({opacity:0});
				if(this.perPage) {
					quizit.pageTimeout();
				}else{
					quizit.timeout();
				}
			}else{
				this.timer=setTimeout('if (quizit!==undefined && quizit.timer!==undefined) quizit.timer.update()',1000);
				this.drawTime();
			}
		},
		drawTime:function() {
			var mins=Math.floor(this.time/60);
			var secs=this.time-(mins*60);
			secs=secs.toString();
			var warn=null;
			var col='';
			if (quizit.isNotEmpty(quizit.structure.timerWarnings)) {
				for(var w=0;w<quizit.structure.timerWarnings.length;w++) {
					if (this.time==quizit.structure.timerWarnings[w].timeLeft) {
						warn=document.createElement("div");
						$(warn).addClass("quizit_timer_warning").html(quizit.structure.timerWarnings[w].message).css({opacity:1,color:'#'+quizit.structure.timerWarnings[w].colour});
						col=' style="color:#'+quizit.structure.timerWarnings[w].colour+'"';
					}
				}
			}
			while(secs.length<2) secs='0'+secs;
			if (col!="") quizit.containers.timer.find("span").css({color:'#'+col});
			quizit.containers.timer.find("span").html("Time left: <b>"+mins+":"+secs+"</b>");
			if (warn!=null) {
				quizit.containers.timer.get(0).appendChild(warn);
				$(warn).animate({top:150,opacity:0},5000,function() {$(this).remove();});
			}
		}
	},
	nextPage:function() {
		if (this.page<0) {
			this.startTime=new Date().getTime();
		}else{
			var ti=this.structure.pages[this.page].object.time.length-1;
			this.structure.pages[this.page].object.time[ti].end=new Date().getTime();
			quizit.value.pages[quizit.page].timeTotal=0;
			for(var i=0;i<=ti;i++) {
				quizit.value.pages[quizit.page].timeTotal+=(quizit.structure.pages[quizit.page].object.time[i].end-quizit.structure.pages[quizit.page].object.time[i].start)/1000;
			}
			quizit.value.pages[quizit.page].time=Math.round(quizit.value.pages[quizit.page].timeTotal);
		}
		this.timer.endPage();
		quizit.updateStatus();
		this.page++;
		$(this.containers.pages).fadeOut(500,function() {
			quizit.renderPage();
			if (quizit.page<quizit.structure.pages.length) quizit.structure.pages[quizit.page].object.time.push({start:new Date().getTime(),end:null});
		});
	},
	completeQuestion:function() {
//console.log(this.structure.pages[this.page].object.questions[this.sequence]);
		if (this.structure.pages[this.page].serial===true) {
			if (this.sequence==this.structure.pages[this.page].object.questions.length-1) {
				$('.yd_nextButton').html((this.page==this.structure.pages.length-1)?this.structure.finish:this.structure.nextPage);
			}
			this.structure.pages[this.page].object.questions[this.sequence].protect();
			this.structure.pages[this.page].object.questions[this.sequence].respond();
		}else{
			$('.yd_nextButton').unbind("click");
			for(var q=0;q<this.structure.pages[this.page].object.questions.length;q++) {
				this.structure.pages[this.page].object.questions[q].protect();
			}
			this.structure.pages[this.page].object.questions[0].respond(1);
		}
	},
	closeResponse:function() {
//console.log(this.page,this.sequence,this.structure.pages[this.page].object.questions.length);
		if (this.sequence==this.structure.pages[this.page].object.questions.length-1) {
			this.nextPage();
		}else{
			this.nextQuestion();
		}
	},
	nextQuestion:function() {
		
		yoodoo.stopSound();
		$('.yd_nextButton').slideDown();
//console.log(this.structure.pages[this.page]);
		if (this.structure.pages[this.page].serial!==true) {
			this.nextPage();
		}else{
			$($(this.containers.pages).find('.quizit_question').get(this.sequence)).slideUp();
			this.sequence++;
			$($(this.containers.pages).find('.quizit_question').get(this.sequence)).slideDown();
			if (this.sequence<this.structure.pages[this.page].questions.length-1) {
				var q=this.structure.pages[this.page].questions[this.sequence];
				if (q.sound!==undefined && q.sound.url!="") yoodoo.playSound(q.sound.url);
			}
		}
	},
	prevPage:function() {
		if (quizit.page<quizit.structure.pages.length) {
			var ti=this.structure.pages[this.page].object.time.length-1;
			this.structure.pages[this.page].object.time[ti].end=new Date().getTime();
			quizit.value.pages[quizit.page].timeTotal=0;
			for(var i=0;i<=ti;i++) {
				quizit.value.pages[quizit.page].timeTotal+=(quizit.structure.pages[quizit.page].object.time[i].end-quizit.structure.pages[quizit.page].object.time[i].start)/1000;
			}
			quizit.value.pages[quizit.page].time=Math.round(quizit.value.pages[quizit.page].timeTotal);
		}
		this.timer.endPage();
		quizit.updateStatus();
		this.page--;
		$(this.containers.pages).fadeOut(500,function() {
			quizit.renderPage();
			if (quizit.page<quizit.structure.pages.length) quizit.structure.pages[quizit.page].object.time.push({start:new Date().getTime(),end:null});
			//if (quizit.page<quizit.structure.pages.length) quizit.structure.pages[quizit.page].object.time.start=new Date().getTime();
		});
	},
	renderPage:function() {
		if (this.page>=this.structure.pages.length) {
			this.finished();
		}else{
			this.structure.pages[this.page].object.render();
		}
	},
	pageTimeout:function() {
		var txt='';
		if (this.isNotEmpty(this.structure.pages[this.page].timeoutMessage)) {
			txt=this.structure.pages[this.page].timeoutMessage;
		}else if (this.isNotEmpty(this.structure.timeoutMessage)) {
			txt=this.structure.timeoutMessage;
		}else{
			txt="Ran out of time";
		}
		if (txt!="") {
			yoodoo.alert(txt,[['OK', 'yoodoo.alert();quizit.nextPage();']]);
		}else{
			this.nextPage();
		}
	},
	timeout:function() {
		var txt='';
		if (this.isNotEmpty(this.structure.timeoutMessage)) {
			txt=this.structure.timeoutMessage;
		}else{
			txt="Ran out of time";
		}
		$(this.containers.pages).fadeOut(500);
		if (txt!="") {
			yoodoo.alert(txt,[['OK', 'yoodoo.alert();quizit.finished();']]);
		}else{
			quizit.finished();
		}
	},
	scoreTagRuleCheck:function() {
		if (this.isNotEmpty(this.structure.scoreTagRules)) {
			var unique=false;
			var toSet=[];
			var toRemove=[];
			var score=quizit.status.percent;
			var perform=true;
			for(var r=0;r<this.structure.scoreTagRules.length;r++) {
				if (perform) {
					var rule=this.structure.scoreTagRules[r];
					var matched=true;
					for(var c=0;c<rule.compares.length;c++) {
						var m=false;
						try{
							eval('m=(score'+rule.compares[c].compare+rule.compares[c].value.toString()+');');
						}catch(e){}
						if (!m) matched=false;
					}
					if (matched) {
						unique=(rule.unique===true);
						if (rule.unique===true) toSet=[];
						toSet.push(rule.tag);
						if (rule.stop===true) perform=false;
					}else if(rule.unset) {
						toRemove.push(rule.tag);
					}
				}
			}
			if (toSet.length==1 && unique) {
				toRemove=[];
			}else{
				unique=false;
			}
			if (unique) {
				for(var r=0;r<this.structure.scoreTagRules.length;r++) {
					var rule=this.structure.scoreTagRules[r];
					if (rule.tag!=toSet[0]) toRemove.push(rule.tag);
				}
			}
			for(var t=0;t<toSet.length;t++) {
				dooit.addTag(toSet[t]);
			}
			for(var t=0;t<toRemove.length;t++) {
				dooit.removeTag(toRemove[t]);
			}
		}
	},
	finished:function() {
		this.containers.header.animate({opacity:0});
		var noSave=false;
		if (arguments.length>0) noSave=arguments[0];
		var duration=((new Date().getTime()-this.startTime)/1000).toFixed(1);
		this.timer.endQuiz();
		this.completed=true;
		this.updateStatus();
		if (this.isNotEmpty(this.structure.passMark)) {
			this.value.passed=(this.structure.passMark<=this.status.percent);
		}else{
			this.value.passed=true;
		}
		this.value.score=this.status.percent.toFixed(1);
		this.value.time=duration;
		var txt='You scored {score}';
		var sound=null;
		if (this.value.passed) {
			if (this.isNotEmpty(this.structure.passedMessage)) txt=this.structure.passedMessage;
			if (this.structure.passedSound!==undefined && this.structure.passedSound.url!="") sound=this.structure.passedSound.url;
		}else{
			if (this.isNotEmpty(this.structure.failedMessage)) txt=this.structure.failedMessage;
			if (this.structure.failedSound!==undefined && this.structure.failedSound.url!="") sound=this.structure.failedSound.url;
		}
		txt=txt.replace(/\{score\}/,"<b>"+this.value.score+"%</b>");
		this.containers.pages.html("<div class='quizit_complete "+(this.value.passed?"quizit_passed":"quizit_failed")+"'>"+txt+"</div>");
		if (this.structure.redoable) {
			var restart=document.createElement("button");
			$(restart).attr("type","button");
			$(restart).addClass("yd_cta");
			restart.innerHTML="Restart...";
			$(restart).bind("click",function() {
				quizit.containers.header.animate({opacity:1});
				quizit.page=-1;
				dooit.saved=false;
				quizit.value={};
				quizit.checkUser();
				quizit.showStart();
			})
			this.containers.pages.get(0).appendChild(restart);
		}
		yoodoo.stopSound();
		if (sound!==null) yoodoo.playSound(sound);
		this.containers.pages.fadeIn();
		if (!noSave) {
			this.scoreTagRuleCheck();
			yoodoo.saveDooit(null,null,true);
			dooit.saved=true;
		}
	},
	loadFields:function() {
		if (this.key===null && array_of_default_fields.length>0) {
			for(var f=0;f<array_of_default_fields.length;f++) {
				if (/^global_Quizit/.test(array_of_default_fields[f])) this.key=array_of_default_fields[f];
			}
		}
		if (this.valuekey===null && array_of_default_fields.length>0) {
			for(var f=0;f<array_of_default_fields.length;f++) {
				if (/^quizit/.test(array_of_default_fields[f])) this.valuekey=array_of_default_fields[f];
			}
		}
		/*if(this.key===null || array_of_fields[this.key]==undefined) this.key=null;
		if (this.key===null && array_of_default_fields.length>0) this.key=array_of_default_fields[0];
		if (this.key===null) {
			for(var k in array_of_fields) {
				if(this.key===null) this.key=k;
			}
		}*/
		if(this.key!==null) {
			try{
				eval('this.structure='+array_of_fields[this.key][1]+';');
			}catch(e){
				this.structure=array_of_fields[this.key][1];
			}
		}
		if(this.valuekey!==null) {
			try{
				eval('this.value='+array_of_fields[this.valuekey][1]+';');
			}catch(e){
				this.value=array_of_fields[this.valuekey][1];
			}
		}
		for(var k in array_of_fields) {
			if (k!=this.key && k!=this.valuekey) {
				try{
					eval('this.fields["'+k+'"]='+array_of_fields[k][1]+';');
				}catch(e){
					this.fields[k]=array_of_fields[this.key][1];
				}
			}
		}
		this.structure=this.decode(this.structure);
		if (this.structure.main!==undefined) this.structure=this.structure.main;
		this.value=this.decode(this.value);
		this.fields=this.decode(this.fields);
	},
	decode:function(ip) {
		if (typeof(ip)=="string") {
			ip=ip.replace(/&sq;/g,"'");
			ip=ip.replace(/&dq;/g,'"');
			ip=ip.replace(/&nl;/g,"\n");
			return ip;
		}else if (typeof(ip)=="object"){
			for(var i in ip) {
				ip[i]=this.decode(ip[i]);
			}
		}
		return ip;
	},
	transposeOptions:function(keys,obj) {
		for(var k in obj) {
			if(typeof(obj[k])=="object") {
				var thiskeys=keys.slice();
				thiskeys.push(k);
				this.transposeOptions(thiskeys,obj[k]);
			}else{
				this.setOption(keys,k,obj[k]);
			}
		}
	},
	setOption:function(keys,key,val) {
		try{
			var e=keys.join('.');
			if(e!='') {
				e='this.'+e;
			}else{
				e='this';
			}
			if(isNaN(key)) {
				e+='.'+key+"=val;";
			}else{
				e+='['+key+']=val;';
			}
			eval(e);

		}catch(e){}
	},
	finishable:function() {
		return this.completed;
		var ok=true;
		return ok;
	},
	output:function(opts) {
		if(opts.blind===true) {
			var op=(dooit.json(this.value));
			array_of_fields[this.valuekey][1]=op;
			var reply={};
			eval('reply.EF'+array_of_fields[this.valuekey][0]+'=op;');
			reply.quizit='1';
			return reply;
		}else{
			return {};
		}
	}
}
