var yoodooQuiz={
	container:null,
	quiz:null,
	arena:null,
	withAudio:true,
	canAutoPlay:(BrowserDetect.OS!='iPhone' && BrowserDetect.OS!='iPad'),
	passRate:75,
	settings:{
		margin:20,
		padding:10,
		height:0,
		width:0
	},
	delays:{
		intro:{
			withoutVoice:5000,
			afterVoice:2000
		},
		afterPrompt:{
			withoutVoice:5000,
			afterVoice:2000
		},
		afterAnswered:{
			withoutVoice:5000,
			afterVoice:2000
		},
		afterResponse:{
			withoutVoice:5000,
			afterVoice:2000
		},
		complete:{
			withoutVoice:5000,
			afterVoice:2000
		}
	},
	questionPassPercentage:0.75,
	question:-1,
	init:function(quiz) {
		this.quiz=quiz;
		this.question=-1;
		this.results=[];
		this.settings.height=yoodoo.option.height-(2*this.settings.margin)-(2*this.settings.padding);
		this.settings.width=yoodoo.option.width-(2*this.settings.margin)-(2*this.settings.padding);
		this.container=document.createElement("div");
		$(this.container).css({width:this.settings.width,height:this.settings.height,position:"absolute",top:0,left:0,display:"none",margin:this.settings.margin,padding:this.settings.padding}).addClass("yoodooQuiz");
		//console.log(quiz);
		yoodoo.widget.appendChild(this.container);
		this.start();
		this.reveal();
	},
	start:function() {
		this.questionCount=this.countQuestions();
		this.questionsComplete=0;
		this.questionsCorrect=0;
		var ins='<div class="quizHeader"></div>';
		ins+='<h2>'+yoodooPlaya.episode.title+" - "+this.quiz.title+'</h2>';
		ins+='<div class="quizArena">';
		ins+='<p>'+((this.quiz.startText !==undefined) ? this.quiz.startText : "")+'</p>';
		ins+='<button type="button" onclick="yoodooQuiz.clickOnce(this);yoodooPlaya.audio.pause();if (yoodooQuiz.canAutoPlay) {$(this).fadeOut(500,function() {$(this).css({display:\'none\'});yoodooQuiz.nextQuestion();});}else{yoodooQuiz.nextQuestion();}" class="prompt"><span class="rightArrow"><span>&nbsp;</span></span>'+yoodoo.w('quizstartbutton')+'</button>';
		ins+='</div>',
			yoodooQuiz.setSpaceBar(function() {
				yoodooQuiz.clearSpaceBar();
				yoodooPlaya.audio.pause();
				yoodooQuiz.nextQuestion();
			});
		$(this.container).html(ins);
		this.arena=$(this.container).find(".quizArena");
		this.header=$(this.container).find(".quizHeader");
		if (this.withAudio && /^http\:/.test(this.quiz.introVoiceoverURL)) {
			yoodooPlaya.audio.loadAndPlay(this.quiz.introVoiceoverURL,{onComplete:function() {
				if (yoodooQuiz.canAutoPlay) {
					yoodooQuiz.nextQuestion(yoodooQuiz.delays.intro.afterVoice);
				}else{
					yoodooQuiz.confirm(yoodoo.w('quizstartbutton'),function() {yoodooQuiz.nextQuestion();});
				}
			}});
		}else{
			//yoodooQuiz.nextQuestion(yoodooQuiz.delays.intro.withoutVoice);
		}
		this.drawHeader();
	},
	drawHeader:function() {
		var ins='Progress';
		this.header.html(ins);
		this.header.get(0).appendChild(this.progress.init());
		this.header.get(0).appendChild(this.audioToggle());
		this.header.get(0).appendChild(this.clock.init());
		var returnButton=document.createElement("button");
		$(returnButton).addClass("prompt").html("<span class='leftArrow'><span></span></span> back").css({float:"right"});
		$(returnButton).bind("click",function() {
			yoodooQuiz.clickOnce(this);
			yoodooPlaya.movie.returnToComplete();
			yoodooQuiz.close();
		});
		this.header.get(0).appendChild(returnButton);
	},
	audioToggle:function() {
		var o=document.createElement("div");
		$(o).addClass("quizToggleButton").html("Audio ");
		if (this.withAudio) {
			$(o).addClass("on");
		}else{
			$(o).addClass("off");
		}
		var ob=document.createElement("div");
		var o1=document.createElement("div");
		$(o1).html("on").addClass("onSection");
		var o2=document.createElement("div");
		$(o2).html("off").addClass("offSection");
		ob.appendChild(o1);
		ob.appendChild(o2);
		o.appendChild(ob);
		$(o).bind("click",function(e) {
			e.preventDefault();
			yoodooQuiz.withAudio=!yoodooQuiz.withAudio;
			if (yoodooQuiz.withAudio) {
				$(this).addClass("on").removeClass("off");
			}else{
				$(this).addClass("off").removeClass("on");
			}
		});
		return o;
	},
	progress:{
		element:null,
		span:null,
		bar:null,
		init:function() {
			this.element=document.createElement("div");
			$(this.element).addClass("quizProgress");
			this.span=document.createElement("span");
			this.bar=document.createElement("div");
			$(this.bar).addClass("quizBar").css({width:"0%"});
			this.score=document.createElement("div");
			$(this.score).addClass("quizScore").css({width:"0%"});
			this.element.appendChild(this.bar);
			this.element.appendChild(this.score);
			this.element.appendChild(this.span);
			return this.element;
		},
		update:function() {
			var s=100*yoodooQuiz.questionsCorrect/yoodooQuiz.questionCount;
			var p=100*yoodooQuiz.questionsComplete/yoodooQuiz.questionCount;
			var v=Math.round(s);
			$(this.span).html(v+"%");
			$(this.bar).css({width:p.toFixed(1)+"%"});
			$(this.score).css({width:s.toFixed(1)+"%"});
		}
	},
	timer:null,
	clock:{
		element:null,
		timer:null,
		time:null,
		outOfTime:function() {},
		beginTime:null,
		endTime:null,
		init:function() {
			this.container=document.createElement("div");
			this.element=document.createElement("div");
			$(this.container).addClass("quizClock").html("Timer ");
			$(this.container).css({display:'none'});
			this.container.appendChild(this.element);
			return this.container;
		},
		response:function() {
			if (!isNaN(this.beginTime) && !isNaN(this.endTime) && ( this.endTime>this.beginTime )) return (this.endTime-this.beginTime)/1000;
			return 0;
		},
		start:function(time,callback) {
//time=0;
			this.beginTime=new Date().getTime();
			if (time==0) {
				this.clear();
			}else{
				$(this.element).removeClass("outOfTime").removeClass("nearlyOutOfTime").removeClass("paused");
				this.outOfTime=callback;
				this.time=time;
				$(this.element).html(this.time);
				$(this.container).css({display:"inline-block"}).fadeIn();
				this.timer=setTimeout("yoodooQuiz.clock.increment()",1000);
			}
		},
		increment:function() {
			this.time--;
			$(this.element).html(this.time);
			if (this.time<=0) {
				$(this.element).removeClass("nearlyOutOfTime");
				$(this.element).addClass("outOfTime");
				this.outOfTime();
			}else{
				if (this.time<10) $(this.element).addClass("nearlyOutOfTime");
				this.timer=setTimeout("yoodooQuiz.clock.increment()",1000);
			}
		},
		pause:function() {
			this.endTime=new Date().getTime();
			clearTimeout(this.timer);
			$(this.element).addClass("paused");
		},
		restart:function() {
			this.beginTime=new Date().getTime();
			$(this.element).removeClass("paused");
			this.timer=setTimeout("yoodooQuiz.clock.increment()",1000);
		},
		clear:function() {
			$(this.element).removeClass("outOfTime").removeClass("nearlyOutOfTime");
			this.pause();
			$(this.container).fadeOut();
		}
	},
	nextQuestion:function() {
		
		this.clearSpaceBar();
		clearTimeout(this.timer);
		if (!this.canAutoPlay) {
			this.question++;
			//this.arena.css({display:'block'});
			this.renderQuestion();
		}else{
			if (arguments.length>0) {
				this.timer=setTimeout('yoodooQuiz.question++;yoodooQuiz.arena.fadeOut(500,function() {yoodooQuiz.renderQuestion();});',arguments[0]);
			}else{
				this.question++;
				this.arena.fadeOut(500,function() {yoodooQuiz.renderQuestion();});
			}
		}
	},
	voSequence:[],
	sequenceComplete:function() {},
	stopSequence:function() {
		clearTimeout(this.timer);
		this.voSequence=[];
		yoodooPlaya.audio.pause();
		yoodooPlaya.audio.clear();
	},
	playSequence:function(seq) {
		this.voSequence=seq;
		if (arguments.length>1) {
			this.sequenceComplete=arguments[1];
		}else{
			this.sequenceComplete=function() {};
		}
		this.playNextSequence();
	},
	playNextSequence:function() {
		if (yoodooQuiz.voSequence.length>0) {
			yoodooPlaya.audio.loadAndPlay(yoodooQuiz.voSequence.splice(0,1)[0],{onComplete:function() {
				if (yoodooQuiz.canAutoPlay && yoodooQuiz.voSequence.length>0) {
					yoodooQuiz.playNextSequence();
				}else if (yoodooQuiz.voSequence.length==0) {
					yoodooQuiz.sequenceComplete();
				}else{
					yoodooQuiz.confirm('Continue',function() {
						yoodooQuiz.playNextSequence();
					});
				}
			}});
		}else{
			yoodooQuiz.sequenceComplete();
		}
	},
	renderQuestion:function() {
		if (this.question>=this.quiz.questions.length) {
			this.quizComplete();
		}else{
			this.renderQuestionPrompt();
			if (yoodooQuiz.canAutoPlay) this.arena.fadeIn(500);
		}
	},
	countQuestions:function() {
		var t=0;
		for(var q=0;q<this.quiz.questions.length;q++) {
			if (this.quiz.questions[q].prompts.length>0) {
				t+=this.quiz.questions[q].prompts.length;
			}else{
				t++;
			}
		}
		return t;
	},
	timeOut:function() {
		$(yoodooQuiz.confirmWindow).remove();
		$(yoodooQuiz.arena).find(".quizQuestion").removeClass("on");
		yoodooQuiz.clearSpaceBar();
		yoodooQuiz.stopSequence();
		var ins="<h2 style='color:#a00'>"+yoodoo.w('quiztimeouttitle')+"</h2>";
		ins+="<p>"+yoodoo.w('quiztimeoutmessage')+"</p>";
		if (yoodooQuiz.canAutoPlay) {
			ins+='<button type="button" onclick="yoodooQuiz.clickOnce(this);yoodooQuiz.stopSequence();$(yoodooQuiz.arena).fadeOut(500,function() {$(this).css({display:\'none\'});yoodooQuiz.nextQuestion();});" class="prompt"><span class="rightArrow"><span>&nbsp;</span></span>'+yoodoo.w('quiztimeoutbutton')+'</button>';
		}else{
			ins+='<button type="button" onclick="yoodooQuiz.clickOnce(this);yoodooQuiz.stopSequence();yoodooQuiz.nextQuestion();" class="prompt"><span class="rightArrow"><span>&nbsp;</span></span>'+yoodoo.w('quiztimeoutbutton')+'</button>';
		}
		yoodooQuiz.arena.html(ins);
		this.questionsComplete+=this.quiz.questions[this.question].prompts.length-this.questionPrompt;
		this.progress.update();
	},
	confirmWindow:null,
	confirm:function(txt,fn) {
		var proceed=yoodoo.e('div');
		var button=yoodoo.e('button');
		$(button).attr("type","button").addClass("prompt").html('<span class="rightArrow"><span>&nbsp;</span></span>'+txt).bind('click',function() {
			$(this).parent().remove();
			fn();
		});
		$(proceed).css({width:$(this.container).outerWidth(true),height:$(this.container).outerHeight(true),background:'rgba(255,255,255,0.8)','text-align':'center',position:'absolute',top:0,left:0,'margin-top':'100px'}).append(button);
		$(this.container).append(proceed);
		this.confirmWindow=proceed;
	},
	questionPrompt:-1,
	renderQuestionPrompt:function() {
		this.quiz.questions[this.question].totalQuestions=1;
		this.quiz.questions[this.question].answeredCorrectly=0;
		var q=this.quiz.questions[this.question];
		this.questionPrompt=-1;
//console.log("renderQuestionPrompt",q);
		var vo=[];
		if(/^http\:/.test(q.textVoiceoverURL)) vo.push(q.textVoiceoverURL);
		if(/^http\:/.test(q.descriptionVoiceoverURL)) vo.push(q.descriptionVoiceoverURL);
		
		//this.clock.start(this.quiz.questions[this.question].duration,function() {yoodooQuiz.timeOut();})
		if (q.prompts.length==0) {
			this.render[q.type](q,this.questionPrompt);
			if (this.canAutoPlay) yoodooQuiz.arena.css({opacity:0,display:'block'});
			var arenaMaxHeight=$(yoodooQuiz.container).height()-(yoodooQuiz.arena.offset().top-$(yoodooQuiz.container).offset().top);
			var fs=18;
			while(yoodooQuiz.arena.height()>arenaMaxHeight && fs>11) {
				fs--;
				yoodooQuiz.arena.find('>.quizAnswers>.quizAnswer').css({'font-size':fs+'px'});
			}
			if (this.canAutoPlay) {
				yoodooQuiz.arena.css({opacity:1,display:'none'});
				yoodooQuiz.arena.fadeIn(function() {
					yoodooQuiz.postRender();
					$(yoodooQuiz.arena).find(".quizQuestion").addClass("on");
				});
			}else{
				yoodooQuiz.postRender();
				$(yoodooQuiz.arena).find(".quizQuestion").addClass("on");
			}
			this.clock.start(q.duration,function() {yoodooQuiz.timeOut();});
			this.playSequence(vo);
		}else{
			this.quiz.questions[this.question].totalQuestions=q.prompts.length;
			var ins="<h2>"+q.text+"</h2>";
			ins+="<p>"+q.description+"</p>";
			if (this.canAutoPlay) {
				ins+='<button type="button" onclick="yoodooQuiz.clickOnce(this);yoodooQuiz.stopSequence();$(yoodooQuiz.arena).fadeOut(500,function() {$(this).css({display:\'none\'});yoodooQuiz.renderQuestionQuestion();});" class="prompt"><span class="rightArrow"><span>&nbsp;</span></span>'+yoodoo.w('quizskipbutton')+'</button>';
			}else{
				ins+='<button type="button" onclick="yoodooQuiz.clickOnce(this);yoodooQuiz.stopSequence();yoodooQuiz.renderQuestionQuestion();" class="prompt"><span class="rightArrow"><span>&nbsp;</span></span>'+yoodoo.w('quizskipbutton')+'</button>';
			}
			yoodooQuiz.setSpaceBar(function() {
				yoodooQuiz.clearSpaceBar();
				yoodooQuiz.stopSequence();
				if (yoodooQuiz.canAutoPlay) {
					yoodooQuiz.renderQuestionQuestion();
				}else{
					$(yoodooQuiz.arena).fadeOut(500,function() {yoodooQuiz.renderQuestionQuestion();});
				}
			});
			yoodooQuiz.arena.html(ins);
			if (this.canAutoPlay) {
				if (this.withAudio && vo.length>0) {
					this.playSequence(vo,function() {
						yoodooQuiz.timer=setTimeout('$(yoodooQuiz.arena).fadeOut(500,function() {yoodooQuiz.renderQuestionQuestion();});',yoodooQuiz.delays.afterPrompt.afterVoice);
					});
				}else{
					yoodooQuiz.timer=setTimeout('$(yoodooQuiz.arena).fadeOut(500,function() {yoodooQuiz.renderQuestionQuestion();});',yoodooQuiz.delays.afterPrompt.withoutVoice);
				}
			}else{
				if (this.withAudio && vo.length>0) {
					this.playSequence(vo,function() {
						yoodooQuiz.timer=setTimeout('yoodooQuiz.confirm("continue",function() {yoodooQuiz.renderQuestionQuestion();});',yoodooQuiz.delays.afterPrompt.afterVoice);
					});
				}else{
					yoodooQuiz.timer=setTimeout('yoodooQuiz.confirm("continue",function() {yoodooQuiz.renderQuestionQuestion();});',yoodooQuiz.delays.afterPrompt.withoutVoice);
				}
			}
		}
	},
	renderQuestionQuestion:function() {
		var q=this.quiz.questions[this.question];
		this.questionPrompt++;
		if (this.questionPrompt>=q.prompts.length) {
			this.questionAnswered();
		}else{
			if (this.questionPrompt==0) {
				this.clock.start(this.quiz.questions[this.question].duration,function() {yoodooQuiz.timeOut();});
			}else{
				this.clock.restart();
			}
//console.log("renderQuestionQuestion",q.prompts[this.questionPrompt]);
			this.render[q.type](q,this.questionPrompt);
			yoodooQuiz.arena.css({opacity:0,display:'block'});
			var arenaMaxHeight=$(yoodooQuiz.container).height()-(yoodooQuiz.arena.offset().top-$(yoodooQuiz.container).offset().top);
			var fs=18;
			while(yoodooQuiz.arena.height()>arenaMaxHeight && fs>11) {
				fs--;
				yoodooQuiz.arena.find('>.quizAnswers>.quizAnswer').css({'font-size':fs+'px'});
			}
			var fn=function() {
				yoodooQuiz.postRender();
				$(yoodooQuiz.arena).find(".quizQuestion").addClass("on");
			};
			if (this.canAutoPlay) {
				yoodooQuiz.arena.css({opacity:1,display:'none'});
				yoodooQuiz.arena.fadeIn(fn);
			}else{
				yoodooQuiz.arena.css({opacity:1,display:'block'});
				fn();
			}
			//var ins="<h2>"+q.text+"</h2>";
			//ins+="<p>"+q.prompts[this.questionPrompt].text+"</p>";
			//ins+='<button type="button" onclick="yoodooQuiz.stopSequence();$(this).fadeOut(500,function() {$(this).css({display:\'none\'});yoodooQuiz.renderQuestionQuestion();});" class="prompt"><span class="rightArrow"><span>&nbsp;</span></span>'+this.prompts.startButton+'</button>';
			//yoodooQuiz.arena.html(ins);
			var vo=[];
			if(/^http\:/.test(q.prompts[this.questionPrompt].textVoiceoverURL)) vo.push(q.prompts[this.questionPrompt].textVoiceoverURL);
			if (this.withAudio && vo.length>0) {
				this.playSequence(vo,function() {});
			}
		}
	},
	questionComplete:function() {
		this.nextQuestion();
	},
	render:{
		fillintheblank:function(q,i) {
			var ins="";
			var t="";
			if (i>=0) {
				t+=q.prompts[i].text;
			}else{
				t+=q.description;
			}
			ins+="<div class='quizQuestion'><div><p>"+q.text+"</p>"+t.replace('[BLANK]','<span class="replacement">[BLANK]</span>')+"</div></div>";
			ins+="<div class='quizAnswers'>";
			ins+="</div>";
			ins+="<div class='quizResult'>";
			ins+="</div>";
			yoodooQuiz.arena.html(ins);
			var answers=yoodooQuiz.arena.find(".quizAnswers").get(0);
			for(var a=0;a<q.answers.length;a++) {
				var ans=document.createElement("div");
				$(ans).addClass("quizAnswer").html("<span>"+q.answers[a].answer+"</span>").addClass("active").css({display:"block",width:"80%"});
				ans.answer=q.answers[a];
				answers.appendChild(ans);
			}
			yoodooQuiz.postRender=function() {
				$(yoodooQuiz.arena).find(".quizAnswer").draggable({
					containment:'.yoodooQuiz',
					scroll:false,
					revert:'invalid'
				});
				$(yoodooQuiz.arena).find(".quizQuestion").droppable({
					activeClass:'ui-active-hover',
					drop:function(e,ui) {
						$(this).find("span.replacement").html(ui.helper[0].innerHTML);
						$(yoodooQuiz.arena).find(".quizAnswer").unbind("mousedown").fadeOut();
						yoodooQuiz.answered(ui.helper[0].answer.correct,ui.helper[0].answer.answerId);
						if (ui.helper[0].answer.correct) {
							$(yoodooQuiz.arena).find(".quizQuestion").addClass("answerCorrect");
						}else{
							$(yoodooQuiz.arena).find(".quizQuestion").addClass("answerWrong");
						}
					}

				});
			};
		},
		selection:function(q,i) {
			yoodooQuiz.postRender=function() {};
			var ins="";
			var t="<p>"+q.text+"</p>";
			if (i>=0) {
				t+=q.prompts[i].text;
			}else{
				t+=q.description;
			}
			ins+="<div class='quizQuestion'><div>"+t+"</div></div>";
			ins+="<div class='quizAnswers'>";
			ins+="</div>";
			ins+="<div class='quizResult'>";
			ins+="</div>";
			yoodooQuiz.arena.html(ins);
			var answers=yoodooQuiz.arena.find(".quizAnswers").get(0);
			for(var a=0;a<q.answers.length;a++) {
				var ans=document.createElement("button");
				ans.type="button";
				$(ans).addClass("quizAnswer").addClass("active").html("<span></span>"+q.answers[a].answer).css({display:"block",width:"80%"});
				ans.answer=q.answers[a];
				$(ans).bind("click",function() {
					$(this.parentNode).find('>button').unbind("click");
					$(this.parentNode).find(".active").removeClass("active");
					var correct=this.answer.correct;
					if (yoodooQuiz.questionPrompt>=0) {
						var p=yoodooQuiz.quiz.questions[yoodooQuiz.question].prompts[yoodooQuiz.questionPrompt];
						correct= (p.answerId==this.answer.answerId);
					}
					if (correct) {
						$(this).addClass("answerCorrect");
						//yoodooQuiz.answered(true,this.answer.answerId);
					}else{
						$(this).addClass("answerWrong");
						//yoodooQuiz.answered(false,this.answer.answerId);
					}
					var me=this;
					$(this).siblings().animate({opacity:0},500,function() {
						$(this).slideUp(500,function() {
							if (me!==undefined) yoodooQuiz.answered(correct,me.answer.answerId);
							me=undefined;
						});
					});
				});
				answers.appendChild(ans);
			}
		},
		multiple:function(q,i) {
			yoodooQuiz.postRender=function() {};
			var ins="";
			var t="<p>"+q.text+"</p>";
			if (i>=0) {
				t+=q.prompts[i].text;
			}else{
				t+=q.description;
			}
			ins+="<div class='quizQuestion'><div>"+t+"</div></div>";
			ins+="<div class='quizAnswers'>";
			ins+="</div>";
			ins+="<div class='quizResult'>";
			ins+="</div>";
			yoodooQuiz.arena.html(ins);
			var answers=yoodooQuiz.arena.find(".quizAnswers").get(0);
			for(var a=0;a<q.answers.length;a++) {
				var ans=document.createElement("button");
				ans.type="button";
				$(ans).addClass("quizAnswer").addClass("active").html("<span></span>"+q.answers[a].answer).css({display:"block",width:"80%"});
				ans.answer=q.answers[a];
				$(ans).bind("click",function() {
					$(this.parentNode).find('>button').unbind("click");
					/*$(this).siblings().animate({opacity:0},500,function() {
						$(this).slideUp();
					});*/
					$(this.parentNode).find(".active").removeClass("active");
					var correct=this.answer.correct;
					if (yoodooQuiz.questionPrompt>=0) {
						var p=yoodooQuiz.quiz.questions[yoodooQuiz.question].prompts[yoodooQuiz.questionPrompt];
						correct= (p.answerId==this.answer.answerId);
					}
					if (correct) {
						$(this).addClass("answerCorrect");
						//yoodooQuiz.answered(true,this.answer.answerId);
					}else{
						$(this).addClass("answerWrong");
						//yoodooQuiz.answered(false,this.answer.answerId);
					}
					var me=this;
					$(this).siblings().animate({opacity:0},500,function() {
						$(this).slideUp(500,function() {
							if (me!==undefined) yoodooQuiz.answered(correct,me.answer.answerId);
							me=undefined;
						});
					});
				});
				answers.appendChild(ans);
			}
		},
		matching:function(q,i) {
			yoodooQuiz.postRender=function() {};
			var ins="";
			var t="<p>"+q.text+"</p>";
			if (i>=0) {
				t+=q.prompts[i].text;
			}else{
				t+=q.description;
			}
			ins+="<div class='quizQuestion'><div>"+t+"</div></div>";
			ins+="<div class='quizAnswers'>";
			ins+="</div>";
			ins+="<div class='quizResult'>";
			ins+="</div>";
			yoodooQuiz.arena.html(ins);
			var answers=yoodooQuiz.arena.find(".quizAnswers").get(0);
			for(var a=0;a<q.answers.length;a++) {
				var ans=document.createElement("button");
				ans.type="button";
				$(ans).addClass("quizAnswer").addClass("active").html("<span></span>"+q.answers[a].answer).css({display:"block",width:"80%"});
				ans.answer=q.answers[a];
				$(ans).bind("click",function() {
					$(this.parentNode).find('>button').unbind("click");
					/*$(this).siblings().animate({opacity:0},500,function() {
						$(this).slideUp();
					});*/
					$(this.parentNode).find(".active").removeClass("active");
					var correct=this.answer.correct;
					if (yoodooQuiz.questionPrompt>=0) {
						var p=yoodooQuiz.quiz.questions[yoodooQuiz.question].prompts[yoodooQuiz.questionPrompt];
						correct= (p.answerId==this.answer.answerId);
					}
					if (correct) {
						$(this).addClass("answerCorrect");
						//yoodooQuiz.answered(true,this.answer.answerId);
					}else{
						$(this).addClass("answerWrong");
						//yoodooQuiz.answered(false,this.answer.answerId);
					}
					var me=this;
					$(this).siblings().animate({opacity:0},500,function() {
						$(this).slideUp(500,function() {
							if (me!==undefined) yoodooQuiz.answered(correct,me.answer.answerId);
							me=undefined;
						});
					});
				});
				answers.appendChild(ans);
			}
		}
	},
	answered:function(correct,answerId) {
		this.clock.pause();
		var result={
			questionId:this.quiz.questions[this.question].questionId,
			answerId:answerId,
			result:correct,
			time:this.clock.response()
		};
		if (this.quiz.questions[this.question].prompts.length>0) result.promptId=this.quiz.questions[this.question].prompts[this.questionPrompt].promptId;
		this.results.push(result);
		$(yoodooQuiz.arena).find(".quizQuestion").removeClass("on");
		yoodooQuiz.stopSequence();
		if (correct) {
			this.quiz.questions[this.question].answeredCorrectly++;
			this.questionsCorrect++;
		}

			this.questionsComplete++;
			this.progress.update();
		if (this.questionPrompt<0) {
			this.questionAnswered();
		}else{
			var p=this.quiz.questions[this.question].prompts[this.questionPrompt];
			var vo=[];
			var ins='';
			if (correct) {
				if (/^http\:/.test(p.correctVoiceoverURL)) vo.push(p.correctVoiceoverURL);
				ins=p.correct;
			}else{
				if (/^http\:/.test(p.incorrectVoiceoverURL)) vo.push(p.incorrectVoiceoverURL);
				ins=p.incorrect;
			}
			ins+='<div style="text-align:right"><button type="button" onclick="yoodooQuiz.clickOnce(this);yoodooQuiz.stopSequence();if (yoodooQuiz.canAutoPlay) {$(yoodooQuiz.arena).fadeOut(500,function() {yoodooQuiz.renderQuestionQuestion();});}else{yoodooQuiz.renderQuestionQuestion();}" class="prompt"><span class="rightArrow"><span>&nbsp;</span></span>'+yoodoo.w('quiznextbutton')+'</button></div>';
			yoodooQuiz.setSpaceBar(function() {
				yoodooQuiz.clearSpaceBar();
				yoodooQuiz.stopSequence();
				$(yoodooQuiz.arena).fadeOut(500,function() {yoodooQuiz.renderQuestionQuestion();});
			});
			yoodooQuiz.arena.find(".quizResult").css({display:"none"}).html(ins).slideDown(500,function() {
				var z=1;
				var but=$(this).find("button");
				var b=$(yoodooQuiz.container).offset().top+$(yoodooQuiz.container).height();
				var zo=yoodooQuiz.arena.find(".quizQuestion");
				var ft=(but.offset().top+but.outerHeight(true))-b;
				while(ft>0 && z>0.3) {
					z-=0.01;
					$(zo).css({zoom:z});
					ft=(but.offset().top+but.outerHeight(true))-b;
				}
			});
			if (this.withAudio && vo.length>0) {
				this.playSequence(vo,function() {
					if (yoodooQuiz.canAutoPlay) {
						yoodooQuiz.timer=setTimeout('$(yoodooQuiz.arena).css({zoom:1}).fadeOut(500,function() {yoodooQuiz.renderQuestionQuestion();});',yoodooQuiz.delays.afterAnswered.afterVoice);
					}else{
						yoodooQuiz.confirm("continue",function() {
					$(yoodooQuiz.arena).css({zoom:1});
					yoodooQuiz.renderQuestionQuestion();
						});
					}
				});
			}else{
				if (this.canAutoPlay) {
					yoodooQuiz.timer=setTimeout('$(yoodooQuiz.arena).css({zoom:1}).fadeOut(500,function() {yoodooQuiz.renderQuestionQuestion();});',yoodooQuiz.delays.afterAnswered.withoutVoice);
				}else{
					yoodooQuiz.timer=setTimeout(function(){
		$(yoodooQuiz.arena).css({zoom:1});
		yoodooQuiz.confirm('continue',function() {
			//$(yoodooQuiz.arena).css({display:'none'});
			yoodooQuiz.renderQuestionQuestion();
		});
					},yoodooQuiz.delays.afterAnswered.withoutVoice);
				}
			}
		}
	},
	questionAnswered:function() {
		this.clock.clear();
		var p=this.quiz.questions[this.question].answeredCorrectly/this.quiz.questions[this.question].totalQuestions;
		this.quiz.questions[this.question].passed=(p>=this.questionPassPercentage);
		var vo=[];
		if (this.quiz.questions[this.question].responses!=undefined) {
			var res=this.quiz.questions[this.question].responses;
			if (p==1 && res.allCorrectVoiceoverURL!=undefined) vo.push(res.allCorrectVoiceoverURL);
			if (p==0 && res.noneCorrectVoiceoverURL!=undefined) vo.push(res.noneCorrectVoiceoverURL);
			if (p>0 && p<1 && res.someCorrectVoiceoverURL!=undefined) vo.push(res.someCorrectVoiceoverURL);

			var txt='';
			if (p==1 && res.allCorrect!=undefined && res.allCorrect!='') txt=res.allCorrect;
			if (p==0 && res.noneCorrect!=undefined && res.noneCorrect!='') txt=res.noneCorrect;
			if (p>0 && p<1 && res.someCorrect!=undefined && res.someCorrect!='') txt=res.someCorrect;
			if (txt=="" && vo.length==0) {
				this.questionComplete();
			}else{
				var ins='<p>'+txt+'</p><div style="text-align:right"><button type="button" onclick="yoodooQuiz.clickOnce(this);yoodooQuiz.stopSequence();if (yoodooQuiz.canAutoPlay) {$(yoodooQuiz.arena).fadeOut(500,function() {yoodooQuiz.questionComplete();});}else{yoodooQuiz.questionComplete();}" class="prompt"><span class="rightArrow"><span>&nbsp;</span></span>'+yoodoo.w('quiznextbutton')+'</button></div>';
				yoodooQuiz.setSpaceBar(function() {
					yoodooQuiz.clearSpaceBar();
					yoodooQuiz.stopSequence();
					if (yoodooQuiz.canAutoPlay) {
						$(yoodooQuiz.arena).fadeOut(500,function() {yoodooQuiz.questionComplete();});
					}else{
						yoodooQuiz.questionComplete();
					}
				});
				yoodooQuiz.arena.find(".quizResult").css({display:"none"}).html(ins).slideDown(500,function() {
					var z=1;
					var but=$(this).find("button");
					var b=$(yoodooQuiz.container).offset().top+$(yoodooQuiz.container).height();
					var zo=yoodooQuiz.arena.find(".quizQuestion");
					var ft=(but.offset().top+but.outerHeight(true))-b;
					while(ft>0 && z>0.3) {
						z-=0.01;
						$(zo).css({zoom:z});
						ft=(but.offset().top+but.outerHeight(true))-b;
					}
				});
				if (this.withAudio && vo.length>0) {
					this.playSequence(vo,function() {
						if (yoodooQuiz.canAutoPlay) {
							$(yoodooQuiz.arena).fadeOut(500,function() {yoodooQuiz.questionComplete();});
						}else{
							yoodooQuiz.confirm('continue',function() {yoodooQuiz.questionComplete();});
						}
					});
				}else{
					if (yoodooQuiz.canAutoPlay) {
						yoodooQuiz.timer=setTimeout('$(yoodooQuiz.arena).fadeOut(500,function() {yoodooQuiz.questionComplete();});',yoodooQuiz.delays.afterResponse.withoutVoice);
					}else{
						yoodooQuiz.questionComplete();
					}
				}
			}
		}else{
			this.questionComplete();
		}
	},
	clickOnce:function(o) {
		$(o).unbind("click");
	},
	reveal:function() {
		$(this.container).css({display:"block"});
		yoodoo.working(false);
	},
	hide:function() {
		$(this.container).css({display:"none"});
		yoodooPlaya.revealEpisode();
	},
	setSpaceBar:function(f) {
		this.clearSpaceBar();
		$(window).bind("keydown.quizbar",f);
	},
	clearSpaceBar:function() {
		$(window).unbind("keydown.quizbar");
	},
	quizComplete:function() {
		this.clock.clear();
		var t=0;
		var c=0;
		for (var q=0;q<this.quiz.questions.length;q++) {
			//if (this.quiz.questions[q].passed) passed++;
			if (this.quiz.questions[q].totalQuestions>0) {
				t+=this.quiz.questions[q].totalQuestions;
				c+=this.quiz.questions[q].answeredCorrectly;
			}
		}
		var p=(100*c/t).toFixed(1);
		this.quiz.score=p;
		//console.log("Scored: "+p);
        //console.log("Success: passrate "+this.passRate);
		//var success=(passed>=this.quiz.passRate);
		var success=((1*p)>=this.passRate);
        //console.log("sucess "+success);
		this.quiz.success=success;
		var txt=this.quiz.endText;
		var vo=[];
		if (this.quiz.summaryVoiceoverURL!=undefined && /^http\:/.test(this.quiz.summaryVoiceoverURL)) vo.push(this.quiz.summaryVoiceoverURL);
		var ins='<div class="resultOutput"><p>'+((txt !==undefined) ? txt : "")+'</p><div style="text-align:right"><button type="button" onclick="yoodooQuiz.clickOnce(this);yoodooQuiz.stopSequence();if (yoodooQuiz.canAutoPlay) {$(yoodooQuiz.arena).fadeOut(500,function() {yoodooQuiz.showResult();});}else{yoodooQuiz.showResult();}" class="prompt"><span class="rightArrow"><span>&nbsp;</span></span>'+yoodoo.w('quiznextbutton')+'</button></div></div>';
		yoodooQuiz.setSpaceBar(function() {
			yoodooQuiz.stopSequence();
			yoodooQuiz.clearSpaceBar();
			if (yoodooQuiz.canAutoPlay) {
				$(yoodooQuiz.arena).fadeOut(500,function() {yoodooQuiz.showResult();});
			}else{
				yoodooQuiz.showResult();
			}
		});
		yoodooQuiz.arena.css({display:"none"}).html(ins).fadeIn();
		if (this.withAudio && vo.length>0) {
			this.playSequence(vo,function() {
				if (yoodooQuiz.canAutoPlay) {
					yoodooQuiz.timer=setTimeout('$(yoodooQuiz.arena).fadeOut(500,function() {yoodooQuiz.showResult();});',yoodooQuiz.delays.complete.afterVoice);
				}else{
					yoodooQuiz.confirm('continue',function() {yoodooQuiz.showResult();});
				}
			});
		}else{
			if (yoodooQuiz.canAutoPlay) {
				yoodooQuiz.timer=setTimeout('$(yoodooQuiz.arena).fadeOut(500,function() {yoodooQuiz.showResult();});',yoodooQuiz.delays.complete.withoutVoice);
			}else{
				yoodooQuiz.showResult();
			}
		}
	},
	showResult:function() {
		var vo=[];
		var txt='';
		this.quiz.completed=true;
		this.quiz.xml=this.resultXML();
		if (this.quiz.success) {
			txt=this.quiz.endSuccessText;
			if (this.quiz.summarySuccessVoiceoverURL!=undefined && /^http\:/.test(this.quiz.summarySuccessVoiceoverURL)) vo.push(this.quiz.summarySuccessVoiceoverURL);
		}else{
			txt=this.quiz.endFailedText;
			if (this.quiz.summaryFailedVoiceoverURL!=undefined && /^http\:/.test(this.quiz.summaryFailedVoiceoverURL)) vo.push(this.quiz.summaryFailedVoiceoverURL);
		}

		var ins='<div class="resultOutput"><div class="resultScore'+(this.quiz.success?'':' fail')+'">'+((this.quiz.score !==undefined && isNaN(this.quiz.score)=== false ) ? parseInt(this.quiz.score).toFixed() : "0")+'%</div><p>'+((txt !==undefined) ? txt : "")+'</p><div style="text-align:right"><button type="button" class="prompt"><span class="rightArrow"><span>&nbsp;</span></span>'+yoodoo.w('quizclosebutton')+'</button></div></div>';
		yoodooQuiz.arena.css({display:"none"}).html(ins).fadeIn();
		yoodooQuiz.arena.find('button.prompt').bind("click",function() {
			yoodooQuiz.clickOnce(this);
			yoodooQuiz.stopSequence();
			if (yoodooQuiz.canAutoPlay) {
				$(yoodooQuiz.arena).fadeOut(500,function() {
					yoodooQuiz.close();
					yoodooPlaya.quizCompleted();
				});
			}else{
				yoodooQuiz.close();
				yoodooPlaya.quizCompleted();
			}
		});
        //console.log("debug "+this.quiz.score );
		yoodooPlaya.episode.chapters[yoodooPlaya.episode.chapter].performed=true;
		yoodooPlaya.episode.chapters[yoodooPlaya.episode.chapter].score=this.quiz.score;
		yoodooPlaya.episode.chapters[yoodooPlaya.episode.chapter].success=this.quiz.success;
		if (this.quiz.success) yoodooPlaya.episode.chapters[yoodooPlaya.episode.chapter].xml=this.resultXML();

       // console.log(yoodooPlaya.episode.chapters[yoodooPlaya.episode.chapter]);
		if (this.withAudio && vo.length>0) {
			this.playSequence(vo,function() {
				//yoodooQuiz.timer=setTimeout('$(yoodooQuiz.arena).fadeOut(500,function() {yoodooQuiz.showResult();});',yoodooQuiz.delays.complete.afterVoice);
			});
		}else{
			//yoodooQuiz.timer=setTimeout('$(yoodooQuiz.arena).fadeOut(500,function() {yoodooQuiz.showResult();});',yoodooQuiz.delays.complete.withoutVoice);
		}
	},
	resultXML:function() {
		//var q=yoodooPlaya.episode.chapters[yoodooPlaya.episode.chapter];
		var xml='<?xml version="1.0" encoding="utf-8"?>';
		xml+='<results bookId="'+yoodooPlaya.episode.id+'">'+"\n";
		for(var q=0;q<this.results.length;q++) {
			xml+='<result questionId="'+this.results[q].questionId+'" ';
			if (this.results[q].promptId) xml+='promptId="'+this.results[q].promptId+'" ';
			xml+='time="'+Math.round(this.results[q].time)+'" answerId="'+this.results[q].answerId+'"><![CDATA['+(this.results[q].result?"correct":"incorrect")+']]></result>'+"\n";
		}
		xml+='</results>';
		return xml;
	},
	close:function() {
		this.stopSequence();
		this.clearSpaceBar();
		this.hide();
		$(this.container).html("");
		if (this.quiz.completed===true) yoodooPlaya.episode.chapters[yoodooPlaya.episode.chapter].completed=true;
		$(this.container).remove();
	}
};
