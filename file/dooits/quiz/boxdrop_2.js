dooit.temporaries('boxdrop');
var boxdrop={
	selectors:{
		container:'.boxdrop'
	},
	containers:{
		container:null
	},
	value:null,
	structure:null,
	key:null,
	structurekey:null,
	question:-1,
	fields:{},
	init:function() {
		if (arguments.length>0) this.transposeOptions([],arguments[0]);
		this.loadFields();
		this.containers.container=$(this.selectors.container);
		if (this.structure!==null && this.structure!='' && this.containers.container!==null) {
			// prepare the dooit
			if (this.value=='') this.value={};
			for(var q=0;q<this.structure.main.questions.length;q++) {
				if (this.value[this.structure.main.questions[q].id]===undefined) {
					this.value[this.structure.main.questions[q].id]={
						prompt:'',
						boxIndex:-1,
						boxTitle:'',
						correct:false
					};
				}
			}
			this.containers.heading=yoodoo.e("div");
			$(this.containers.heading).html("<h2>"+yoodoo.dooittitle+"</h2><p class='description'>"+this.structure.main.paragraph+"</p>");
			this.containers.area=yoodoo.e("div");
			$(this.containers.container).empty().append(this.containers.heading).append(this.containers.area);
			$(this.containers.area).addClass('displayArea');
		}
	},
	start:function() {
		// add the content to this.containers.container
		var ysa=$('#yoodooScrolledArea');
		var h=ysa.height()-8-($(this.containers.area).offset().top-$(this.containers.container).offset().top);
		$(this.containers.area).css({height:h,opacity:0});
		if (this.value.completed===undefined) {
			var but=yoodoo.e("button");
			$(but).attr("type","button");
			$(but).html(this.structure.main.start).bind("click",function() {boxdrop.nextQuestion();});
			$(this.containers.area).html("<p>"+this.structure.main.intro+"</p>").append(but);
			$(this.containers.area).animate({opacity:1});
		}else{
			this.complete();
		}
	},
	selectedBox:null,
	complete:function() {
		this.value.completed=new Date();
		this.question=-1;
		var but=yoodoo.e("button");
		$(but).attr("type","button");
		$(but).html(this.structure.main.restart).bind("click",function() {boxdrop.nextQuestion();});
		$(this.containers.area).html("<p>"+this.structure.main.outro+"</p>").append(but);
		$(this.containers.area).animate({opacity:1});
	},
	nextQuestion:function() {
		this.question++;
		if (this.question==0) this.value.score={score:0,total:this.structure.main.questions.length};
		if (this.question>=this.structure.main.questions.length) {
			$(this.containers.area).find('.box').animate({top:20},500);
			$(this.containers.area).animate({opacity:0},500,function() {
				$(this).empty();
				boxdrop.complete();
			});
		}else{
			$(this.containers.area).find('.box').animate({top:20},500);
			$(this.containers.area).animate({opacity:0},500,function() {
				$(this).empty();
				boxdrop.renderQuestion();
			});
		}
	},
	renderQuestion:function() {
		var q=this.structure.main.questions[this.question];
		var p=yoodoo.e("p");
		$(p).html(q.paragraph);
		var itemBlock=yoodoo.e("div");
		var item=yoodoo.e("div");
		$(item).html(q.prompt).addClass("prompt").draggable({revert:'invalid'});
		$(itemBlock).append(item).css({'text-align':'center',height:100});
		var droparea=yoodoo.e("div");
		$(droparea).addClass("droparea");
		var boxes=[];
		for(var b=0;b<this.structure.main.boxes.length;b++) {
			boxes.push(this.structure.main.boxes[b]);
		}
		for(var b=0;b<q.boxes.length;b++) {
			boxes.push(q.boxes[b]);
		}
		for(var b=0;b<boxes.length;b++) {
			var box=yoodoo.e("div");
			box.box=boxes[b];
			box.isCorrect=(q.correct==boxes[b].id);
			box.hoverColour=yoodooStyler.rgbToHex(yoodooStyler.tint(yoodooStyler.hexToRGB(boxes[b].colour),0.1,0.2));
			$(box).addClass("box").css({background:'#'+boxes[b].colour,top:20});
			var cover=yoodoo.e("div");
			$(cover).addClass("boxCover");
			var title=yoodoo.e("div");
			$(title).addClass("boxTitle").html(boxes[b].text);
			$(droparea).append($(box).append(cover).append(title));
			box.correct=function() {
				boxdrop.value.score.score++;
				boxdrop.selectedBox=this;
				$(this).addClass("correct");
				var response=yoodoo.e("div");
				$(response).addClass("response").html(this.box.response).css({top:0,left:0,opacity:0.1});
				var p=$(boxdrop.containers.area).find('.prompt');
				p.addClass("correct").append(response);
				var l=($(p).outerWidth(false)-$(response).outerWidth(false))/2;
				var t=0-($(response).outerHeight(false));
				$(response).css({top:t,left:l}).animate({opacity:1},500,function() {
					var s=boxdrop.selectedBox.box.sound;
					if (s!==undefined && s.url!="") {
						yoodoo.stopSound();
						yoodoo.playSound(yoodoo.option.baseUrl+s.url,function() {
							if (boxdrop!==undefined) boxdrop.nextQuestion();
						});
					}else{
						var s=5;
						if (!isNaN(boxdrop.structure.main.responseTime)) s=boxdrop.structure.main.responseTime;
						setTimeout(function() {
							if (boxdrop!==undefined) boxdrop.nextQuestion();
						},s*1000);
					}
				});
				$(this).siblings('.box').addClass("off");
				$(this).siblings('.box').animate({top:40});
			};
			box.wrong=function() {
				boxdrop.selectedBox=this;
				$(this).addClass("correct");
				var response=yoodoo.e("div");
				$(response).addClass("response wrong").html(this.box.wrongresponse).css({top:0,left:0,opacity:0.1});
				var p=$(boxdrop.containers.area).find('.prompt');
				p.addClass("wrong");
				$(this).append(response);
				var l=($(this).outerWidth(false)-$(response).outerWidth(false))/2;
				var t=0-($(response).outerHeight(false));
				$(response).css({top:t,left:l}).animate({opacity:1},500,function() {
					var s=boxdrop.selectedBox.box.sound;
					if (s!==undefined && s.url!="") {
						yoodoo.stopSound();
						yoodoo.playSound(yoodoo.option.baseUrl+s.url,function() {
							if (boxdrop!==undefined) boxdrop.nextQuestion();
						});
					}else{
						var s=5;
						if (!isNaN(boxdrop.structure.main.responseTime)) s=boxdrop.structure.main.responseTime;
						setTimeout(function() {
							if (boxdrop!==undefined) boxdrop.nextQuestion();
						},s*1000);
					}
				});
				$(this).siblings('.box').addClass("off");
				$(this).siblings('.box').animate({top:40});
			};
		}
		$(this.containers.area).append(p).append(itemBlock).append(droparea).animate({opacity:1});
		$(this.containers.area).find('.box').droppable({
			drop:function(e,ui) {
				var p=ui.helper[0];
				var ios=$(p).offset();
				var tos=$(this).offset();
				var dx=(tos.left+($(this).width()/2))-(ios.left+($(p).outerWidth(true)/2));
				var dy=(tos.top)-(ios.top+($(p).outerHeight(true)));
				var l=parseInt($(p).css('left').replace(/px/,''));
				var t=parseInt($(p).css('top').replace(/px/,''));
				if (!this.isCorrect) t+=40;
				$(p).animate({left:l+dx,top:t+dy});
				$(this).parent().find(".box").droppable("disable");
				$(p).draggable("disable");
				var boxes=[];
				$(this).parent().find(".box").each(function(i,e) {
					boxes.push(e.box);
				});
				var q=boxdrop.structure.main.questions[boxdrop.question];
				var v=boxdrop.value[q.id];
				v.correct=this.box.correct;
				v.prompt=p.innerHTML;
				v.boxIndex=$(this).prevAll(".box").get().length;
				v.boxTitle=$(this).find(".boxTitle").html();
				for(var b=0;b<boxes.length;b++) {
					if (this.box===boxes[b]) {
						for(var o=0;o<boxes[b].optionTags.length;o++) {
							if (boxes[b].optionTags[o].remove) {
								dooit.removeTag(boxes[b].optionTags[o].tag);
							}else{
								dooit.addTag(boxes[b].optionTags[o].tag);
							}
						}
					}else{
						for(var o=0;o<boxes[b].optionTags.length;o++) {
							if (boxes[b].optionTags[o].unset) dooit.removeTag(boxes[b].optionTags[o].tag);
						}
					}
				}
				if (this.isCorrect) {
					this.correct();
				}else{
					$(this).siblings('.box').each(function(i,e) {
						if (e.isCorrect) e.wrong();
					});
				}
			},over:function(e,ui) {
				$(this).css({background:this.hoverColour});
			},out:function(e,ui) {
				$(this).css({background:'#'+this.box.colour});
			}
		}).animate({top:0});
		
		var s=q.sound;
		if (s!==undefined && s.url!="") {
			yoodoo.stopSound();
			yoodoo.playSound(yoodoo.option.baseUrl+s.url);
		}
	},
	loadFields:function() {
		if (typeof(array_of_default_fields)=="object" && array_of_default_fields.length==2
			&& typeof(array_of_global_fields)=="object" && array_of_global_fields.length>0) {
			for(var g=0;g<array_of_global_fields.length;g++) {
				for(var k=0;k<array_of_default_fields.length;k++) {
					if (array_of_global_fields[g]==array_of_default_fields[k] && this.structurekey===null) {
						this.structurekey=array_of_global_fields[g];
					}
				}
			}
			if (this.structurekey!==null) {
				for(var k=0;k<array_of_default_fields.length;k++) {
					if (array_of_default_fields[k]!=this.structurekey) this.key=array_of_default_fields[k];
				}
			}

		}
		if(this.structurekey!==null) {
			for(var i=0;i<array_of_default_fields.length;i++) {
				if (/box_drop_config/.test(array_of_default_fields[i])) {
					this.structurekey=array_of_default_fields[i];
				}
			}
		}
		if(this.key!==null) {
			for(var i=0;i<array_of_default_fields.length;i++) {
				if (this.structurekey!=array_of_default_fields[i]) this.key=array_of_default_fields[i];
			}
		}
		if(this.structurekey!==null) {
			try{
				eval('this.structure='+array_of_fields[this.structurekey][1]+';');
			}catch(e){
				this.structure=array_of_fields[this.structurekey][1];
			}
		}
		if(this.key!==null) {
			try{
				eval('this.value='+array_of_fields[this.key][1]+';');
			}catch(e){
				this.value=array_of_fields[this.key][1];
			}
		}
		for(var k in array_of_fields) {
			if (k!=this.key && k!=this.structurekey) {
				try{
					eval('this.fields["'+k+'"]='+array_of_fields[k][1]+';');
				}catch(e){
					this.fields[k]=array_of_fields[this.key][1];
				}
			}
		}
		this.structure=dooit.decode(this.structure);
		this.value=dooit.decode(this.value);
		this.fields=dooit.decode(this.fields);
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
		return (this.value.completed!==undefined);
		var ok=true;
		return ok;
	},
	output:function() {
		var op=(dooit.json(this.value));
		array_of_fields[this.key][1]=op;
		var reply={};
		eval('reply.EF'+array_of_fields[this.key][0]+'=op;');
		return reply;
	}
};
