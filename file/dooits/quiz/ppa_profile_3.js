dooit.temporaries('ppa_profile');
var ppa_profile={
	selectors:{
		container:'.ppa_profile'
	},
	containers:{
		container:null
	},
	value:null,
	key:null,
	questionNumber:-1,
	startTime:null,
	finishTime:null,
	height:300,
	animateDuration:100,
	dev:false,
	settingskey:null,
	fields:{},
	display:{
		graphs:[false,false,true],
		summaries:{
			invalid:true,
			basicFactorCombination:true,
			characteristics:true,
			tight1:false,
			tight2:false,
			tight3:false,
			tightAll:false,
			flickUp:false,
			flickDown:false,
			sweepDown:false,
			overshift:false,
			undershift:false,
			greyZone:false,
			Smovement:true,
			DequalsC:false	
		}
	},
	init:function() {
		if (arguments.length>0) this.transposeOptions([],arguments[0]);
		this.loadFields();
		this.containers.container=$(this.selectors.container);
		if (this.key!==null && this.containers.container!==null) {
			// start rendering the dooit
			if (!this.isCompleted()) this.definedValue();
			if (this.structure.main.selfImage) {
				this.display.graphs=[false,false,true];
			}else{
				this.display.graphs=[true,true,true];
			}
			if (this.structure.main.deepreport) {
				this.display.summaries={
					invalid:true,
					basicFactorCombination:true,
					characteristics:true,
					tight1:true,
					tight2:true,
					tight3:true,
					tightAll:true,
					flickUp:true,
					flickDown:true,
					sweepDown:true,
					overshift:true,
					undershift:true,
					greyZone:true,
					Smovement:true,
					DequalsC:true	
				};
			}
			this.verboseCharacteristics=(this.structure.main.readability===true);
			this.start();
		}
	},
	start:function() {
		// add the content to this.containers.container
		var h2=yoodoo.e("h2");
		$(h2).html(yoodoo.dooittitle);
		var p=yoodoo.e("p");
		$(p).html(this.structure.main.paragraph);
		this.containers.area=yoodoo.e("div");
		$(this.containers.area).addClass("displayarea");
		$(this.containers.container).empty().append(h2).append(p).append(this.containers.area);
	},
	displayed:function() {
		// add the content to this.containers.container
		var ysa=$('#yoodooScrolledArea');
		this.height=ysa.height()-(($(this.containers.area).offset().top-$(this.containers.container).offset().top))-10-20;
		$(this.containers.area).css({height:this.height,top:-10,opacity:0});
		if (this.isCompleted()) {
			this.showResult();
		}else{
			this.showIntro();
		}
	},
	definedValue:function() {
		this.value={ppa:{},responses:[],questionOrder:[],completed:null,seconds:0};
		var rq=[];
		for(var q=0;q<this.questions.length;q++) {
			rq.push(q);
			this.value.responses.push({most:null,least:null});
		}
		while(rq.length>0) this.value.questionOrder.push(rq.splice(Math.round((rq.length-1)*Math.random()),1)[0]);

	},
	isCompleted:function() {
		return (this.value.answered===true);
	},
	refId:function() {
		if (this.value.refId!==undefined) return this.value.refId;
		var id=yoodoo.siteFolder+'-'+yoodoo.user.username;
		if (this.dev) id+=new Date().getTime().toString();
		this.value.refId=id.replace(/[^a-z^0-9^\-]+/i,'');
		return this.value.refId;
	},
	showIntro:function() {
		var p=yoodoo.e("p");
		$(p).html(this.structure.main.intro);
		var b=yoodoo.e("button");
		$(b).attr('type','button').html(this.structure.main.start).addClass("ppa_cta").bind("click",function() {
			$(ppa_profile.containers.area).animate({top:-10,opacity:0},ppa_profile.animateDuration,function() {
				ppa_profile.questionNumber=0;
				ppa_profile.renderProgress();
				ppa_profile.showQuestion();
				$(this).animate({top:0,opacity:1},ppa_profile.animateDuration,function() {
					ppa_profile.startTime=new Date();
				});
			});
		});
		$(this.containers.area).empty().append(p).append(b).animate({top:0,opacity:1});
	},
	renderProgress:function() {
		if (this.structure.main.thomasstyle===true) {
			this.containers.progress=yoodoo.e("div");
			$(this.containers.progress).addClass("progressDiv");
			var c=yoodoo.e("div");
			$(c).html('<span></span>&nbsp;');
			var d=yoodoo.e("div");
			this.containers.progressBar=yoodoo.e("div");
			$(d).addClass("progressBox").append(this.containers.progressBar);
			$(this.containers.progressBar).addClass("progressBar").css({width:'0%'});
			$(this.containers.progress).css({height:50,opacity:0,padding:0}).append(c).append(d);
			$(this.containers.area).css({height:this.height-50});
			this.containers.container.get(0).insertBefore(this.containers.progress,this.containers.area);
			$(this.containers.progress).animate({opacity:1});
		}else{
			this.containers.progress=yoodoo.e("div");
			var c=yoodoo.e("div");
			var d=yoodoo.e("div");
			this.containers.progressBar=yoodoo.e("div");
			$(c).addClass("progressBox").html("&nbsp;<span></span>").append(this.containers.progressBar);
			$(d).append(c).css({padding:10});
			$(this.containers.progressBar).addClass("progressBar").css({width:'0%'}).html("&nbsp;<span></span>");
			$(this.containers.progress).css({height:50,opacity:0,padding:0}).append(d);
			$(this.containers.area).css({height:this.height-50});
			this.containers.container.get(0).insertBefore(this.containers.progress,this.containers.area);
			$(this.containers.progress).animate({opacity:1});
		}
	},
	processCompletion:function() {
		this.value.answered=true;
		var justData=false;
		if (arguments.length>0) justData=arguments[0];
		$(this.containers.progressBar).animate({width:'100%'});
		$(this.containers.progress).find("span").html('Complete');
		$(this.containers.progress).slideUp(this.animateDuration,function() {
			$(this).remove();
			$(ppa_profile.containers.area).animate({height:ppa_profile.height},this.animateDuration);
		});
		$(this.containers.area).animate({top:-10,opacity:0},this.animateDuration,function() {
			$(this).html("<div class='processing'>Fetching your results</div>").animate({top:0,opacity:1},ppa_profile.animateDuration,function() {
				var toSend={refId:ppa_profile.refId(),justData:justData,data:ppa_profile.value.responses,ppareport:ppa_profile.structure.main.reports};
				yoodoo.sendPost(null,{ppadata:Base64.encode(dooit.json(toSend)),cmd:'ppa',callback:'ppa_profile.gotResult'});
			});
		});
	},
	gotResult:function(result) {
		var ppa=null;
		try{
			ppa=jQuery.parseJSON(Base64.decode(result));
			//console.log(result);
			eval('ppa='+Base64.decode(result)+';');
			//console.log(ppa);
			if (this.value.ppa===undefined) this.value.ppa={};
			if (typeof(ppa)=="string") {
				this.failed(ppa);
			}else if (ppa.faultcode!==undefined) {
				this.failed(ppa.faultstring);
			}else{
				for(var k in ppa) {
					this.value.ppa[k]=ppa[k];
				}
				if (this.value.ppa.Status!==undefined) {
					//this.translate();
					this.analyze();
				}
				this.showResult();
			}
		}catch(e) {
			this.failed();
		}
		this.save();
	},
	failed:function() {
		var but=yoodoo.e("button");
		$(but).attr("type","button").addClass('ppa_cta').html("Attempt fetching of your results again").bind("click",function() {
			ppa_profile.refetch();
		});
		var error='An issue has occurred in fetching your results';
		if (arguments.length>0) error=arguments[0];
		$(this.containers.area).animate({top:-10,opacity:0},this.animateDuration,function() {
			if ($(ppa_profile.containers.progress).get().length>0) {
				$(ppa_profile.containers.progress).slideUp(ppa_profile.animateDuration,function() {
					$(this).remove();
					$(ppa_profile.containers.area).empty().css({top:0,opacity:1,overflow:'auto'}).html('<center>'+error+'</center>').append(but);
					//ppa_profile.initGraph();
				});
			}else{
				$(ppa_profile.containers.area).empty().css({top:0,opacity:1,overflow:'auto'}).html('<center>'+error+'</center>').append(but);
				//ppa_profile.initGraph();
			}
		});
	},
	showResult:function() {
		if (this.value.ppa!==undefined && this.value.ppa.Status!==undefined && this.value.answered!==null) {

			$(this.containers.area).animate({top:-10,opacity:0},this.animateDuration,function() {
				if ($(ppa_profile.containers.progress).get().length>0) {
					$(ppa_profile.containers.progress).slideUp(ppa_profile.animateDuration,function() {
						$(this).remove();
						$(ppa_profile.containers.area).empty().css({top:0,opacity:1,overflow:'auto'}).html('<p>'+ppa_profile.structure.main.outro+'</p>').append(ppa_profile.reportLink());
						ppa_profile.initGraph();
					});
				}else{
					$(ppa_profile.containers.area).empty().css({top:0,opacity:1,overflow:'auto'}).html('<p>'+ppa_profile.structure.main.outro+'</p>').append(ppa_profile.reportLink());
					ppa_profile.initGraph();
				}
			});
		}else if (dooit.saved || this.attempts>0) {
			this.failed();
		}else{
			this.refetch(0);
		}
	},
	reportLink:function() {
		if (this.structure.main.allowdownload && this.value.ppa.reportUrl!==undefined && this.value.ppa.reportUrl!='') {
			var a=yoodoo.e("a");
			a.href=this.value.ppa.reportUrl;
			a.target='_blank';
			$(a).html(this.structure.main.download);
			return a;
		}else{
			return null;
		}
	},
	attempts:0,
	refetch:function() {
		if (arguments.length>0 && this.attempts>arguments[0]) return false;
		if (this.value.ppa.reportUrl!==undefined && this.value.ppa.reportUrl!="") {
			this.processCompletion(true);
		}else{
			this.processCompletion();
		}
		this.attempts++;
	},
	showQuestion:function() {
		var p=Math.round(100*(this.questionNumber/this.questions.length));
		$(this.containers.progressBar).animate({width:p+'%'},this.animateDuration);
		if (this.structure.main.thomasstyle===true) {
			$(this.containers.progress).find("span").html('Progress '+this.questionNumber+' / '+this.questions.length);
		}else{
			$(this.containers.progress).find("span").html(((this.questionNumber==0)?'None answered yet':this.questionNumber+'/'+this.questions.length+' answered'));
		}
		var i=this.value.questionOrder[this.questionNumber]; // the actual question index when randomized is removed
		var q=this.questions[i]; // the question
		var most=yoodoo.e("div");
		$(most).html("<p>"+this.structure.main.mostPrompt+"</p>").addClass("mostRow");
		var least=yoodoo.e("div");
		$(least).html("<p>"+this.structure.main.leastPrompt+"</p>").addClass("leastRow");
		var options=[];
		for(var o=0;o<q.option.length;o++) {
			options.push({index:o,option:q.option[o]});
		}
		while(options.length>0) {
			var presentOption=options.splice(Math.round((options.length-1)*Math.random()),1)[0];

			if (this.structure.main.thomasstyle===true) {
				var bl=yoodoo.e("label");
				var bli=yoodoo.e("input");
				$(bli).attr("type","radio");
				bli.name='leastcheck';
				bli.questionIndex=i;
				bli.optionIndex=presentOption.index;
				$(bl).addClass("leastOption").html('<div>'+presentOption.option.title+((this.structure.main.readability===true)?"<em>"+presentOption.option.sub+"</em>":'')+'</div>').append(bli);
				$(bli).bind("change",function() {
					if (this.brother.checked) return false;
					this.brother.disabled=true;
					$(this.brother).parent().addClass("unavailable");
					$(this.brother).parent().siblings("label").find('input').each(function(i,e) {
						e.disabled=false;
						$(e).parent().removeClass("unavailable");
					});
					ppa_profile.value.responses[this.questionIndex].least=this.optionIndex;
					if (ppa_profile.value.responses[this.questionIndex].most!==null) ppa_profile.nextQuestion();
				});
				$(least).append(bl);
				
				var bm=yoodoo.e("label");
				var bmi=yoodoo.e("input");
				$(bmi).attr("type","radio");
				bmi.name='mpstcheck';
				bmi.questionIndex=i;
				bmi.optionIndex=presentOption.index;
				$(bm).addClass("leastOption").html('<div>'+presentOption.option.title+((this.structure.main.readability===true)?"<em>"+presentOption.option.sub+"</em>":'')+'</div>').append(bmi);
				$(bmi).bind("change",function() {
					if (this.brother.checked) return false;
					this.brother.disabled=true;
					$(this.brother).parent().addClass("unavailable");
					$(this.brother).parent().siblings("label").find('input').each(function(i,e) {
						e.disabled=false;
						$(e).parent().removeClass("unavailable");
					});
					ppa_profile.value.responses[this.questionIndex].most=this.optionIndex;
					if (ppa_profile.value.responses[this.questionIndex].least!==null) ppa_profile.nextQuestion();
				});
				$(most).append(bm);
				
				bli.brother=bmi;
				bmi.brother=bli;
			}else{
				var bl=yoodoo.e("button");
				bl.questionIndex=i;
				bl.optionIndex=presentOption.index;
				$(bl).attr("type","button").addClass("leastOption").html(presentOption.option.title+"<em>"+presentOption.option.sub+"</em>").bind("click",function() {
					if ($(this.brother).hasClass("on")) return false;
					$(this).addClass("on").siblings("button").removeClass('on');
					$(this.brother).addClass("unavailable").siblings("button").removeClass("unavailable");
					ppa_profile.value.responses[this.questionIndex].least=this.optionIndex;
					if (ppa_profile.value.responses[this.questionIndex].most!==null) ppa_profile.nextQuestion();
				});
				$(least).append(bl);
	
				var bm=yoodoo.e("button");
				bm.questionIndex=i;
				bm.optionIndex=presentOption.index;
				$(bm).attr("type","button").addClass("mostOption").html(presentOption.option.title+"<em>"+presentOption.option.sub+"</em>").bind("click",function() {
					if ($(this.brother).hasClass("on")) return false;
					$(this).addClass("on").siblings("button").removeClass('on');
					$(this.brother).addClass("unavailable").siblings("button").removeClass("unavailable");
					ppa_profile.value.responses[this.questionIndex].most=this.optionIndex;
					if (ppa_profile.value.responses[this.questionIndex].least!==null) ppa_profile.nextQuestion();
				});
				$(most).append(bm);
				bl.brother=bm;
				bm.brother=bl;
			}
		}
		$(this.containers.area).empty().append(most).append(least);
		var mh=0;
		$(this.containers.area).find("button").each(function(i,e) {
			var h=$(e).height();
			if (h>mh) mh=h;
		});
		$(this.containers.area).find("button").css({height:mh+20});
	},
	nextQuestion:function() {
		this.questionNumber++;
		if (this.questionNumber>=this.value.questionOrder.length) {
			this.finishTime=new Date();
			this.processCompletion();
		}else{
			$(this.containers.area).animate({top:-10,opacity:0},this.animateDuration,function() {
				ppa_profile.showQuestion();
				$(this).animate({top:0,opacity:1},ppa_profile.animateDuration,function() {
					if (ppa_profile.dev) {
						var ans=[0,1,2,3];
						ppa_profile.value.responses[ppa_profile.value.questionOrder[ppa_profile.questionNumber]].most=ans.splice(Math.round((ans.length-1)*Math.random()),1)[0];
						ppa_profile.value.responses[ppa_profile.value.questionOrder[ppa_profile.questionNumber]].least=ans.splice(Math.round((ans.length-1)*Math.random()),1)[0];
						setTimeout('ppa_profile.nextQuestion()',100);
					}
				});
			});
		}
	},
	loadFields:function() {
		if (typeof(array_of_default_fields)=="object" && array_of_default_fields.length==2
			&& typeof(array_of_global_fields)=="object" && array_of_global_fields.length>0) {
			for(var g=0;g<array_of_global_fields.length;g++) {
				for(var k=0;k<array_of_default_fields.length;k++) {
					if (array_of_global_fields[g]==array_of_default_fields[k] && this.settingskey===null) {
						this.settingskey=array_of_global_fields[g];
					}
				}
			}
			if (this.settingskey!==null) {
				for(var k=0;k<array_of_default_fields.length;k++) {
					if (array_of_default_fields[k]!=this.settingskey) this.key=array_of_default_fields[k];
				}
			}

		}
		if(this.key===null || this.settingskey===null) {
			for(var k in array_of_fields) {
				if (/^ppaProfile/.test(k)) this.key=k;
				if (/^ppaSettings/.test(k)) this.settingskey=k;
			}
		}
		if(this.key!==null) {
			try{
				eval('this.value='+array_of_fields[this.key][1]+';');
			}catch(e){
				this.value=array_of_fields[this.key][1];
			}
		}
		if(this.settingskey!==null) {
			try{
				eval('this.structure='+array_of_fields[this.settingskey][1]+';');
			}catch(e){
				this.structure=array_of_fields[this.settingskey][1];
			}
		}
		for(var k in array_of_fields) {
			if (k!=this.key && k!=this.settingskey) {
				try{
					eval('this.fields["'+k+'"]='+array_of_fields[k][1]+';');
				}catch(e){
					this.fields[k]=array_of_fields[this.key][1];
				}
			}
		}
		this.value=dooit.decode(this.value);
		this.structure=dooit.decode(this.structure);
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
		var ok=(this.value.completed!==undefined && this.value.completed!==null && this.value.completed.getTime!==undefined);
		return ok;
	},
	save:function() {
		if (!dooit.saved) {
			if (this.value.ppa!==undefined && this.value.ppa.traits!==undefined) this.checkTags();
			if (this.value.completed===undefined || this.value.completed===null || this.value.completed.getTime===undefined) this.value.completed=new Date();
			yoodoo.saveDooit(null,null,true);
			dooit.saved=true;
		}
	},
	output:function() {
		if (this.value.completed!==undefined && this.value.completed!==null && this.value.completed.getTime!==undefined) {
			var op=(dooit.json(this.value));
			array_of_fields[this.key][1]=op;
			var reply={};
			eval('reply.EF'+array_of_fields[this.key][0]+'=op;');
			return reply;
		}else{
			return {};
		}
	},
	/*canvas:null,
	paper:null,
	drawSize:[500,300],
	svgOnly:false,
	graphElements:[],*/
	initGraph:function() {
		var w=100;
		var h=200;
		var graphs=yoodoo.e("div");
		$(graphs).addClass("graphs");
		if (this.structure.main.selfimage===false) {
			var graph1=yoodoo.e("div");
			$(graph1).addClass("graphDiv");
			var head=yoodoo.e("div");
			$(head).html('<div class="graphType">Work mask</div>');
			var d=yoodoo.e("div");
			$(d).html("D").css({width:'20%',margin:'0px 0px 0px 10%',display:'inline-block','text-align':'center'});
			var i=yoodoo.e("div");
			$(i).html("I").css({width:'20%',margin:'0px',display:'inline-block','text-align':'center'});
			var s=yoodoo.e("div");
			$(s).html("S").css({width:'20%',margin:'0px',display:'inline-block','text-align':'center'});
			var c=yoodoo.e("div");
			$(c).html("C").css({width:'20%',margin:'0px 10% 0px 0px',display:'inline-block','text-align':'center'});
			$(head).append(d).append(i).append(s).append(c);
			var img1=yoodoo.e("img");
			var foot=yoodoo.e("div");
			$(foot).addClass("graphScores");
			var d=yoodoo.e("div");
			$(d).html(this.value.ppa.DISCGraph1.D).css({width:'20%',margin:'0px 0px 0px 10%',display:'inline-block','text-align':'center'});
			var i=yoodoo.e("div");
			$(i).html(this.value.ppa.DISCGraph1.I).css({width:'20%',margin:'0px',display:'inline-block','text-align':'center'});
			var s=yoodoo.e("div");
			$(s).html(this.value.ppa.DISCGraph1.S).css({width:'20%',margin:'0px',display:'inline-block','text-align':'center'});
			var c=yoodoo.e("div");
			$(c).html(this.value.ppa.DISCGraph1.C).css({width:'20%',margin:'0px 10% 0px 0px',display:'inline-block','text-align':'center'});
			$(foot).append(d).append(i).append(s).append(c);
			
			$(graph1).append(head).append(img1).append(foot).css({width:w});
			img1.src='http://handlers.thomasinternational.net/DISC/Disc.ashx?Width='+w+'&Height='+h+'&D='+this.value.ppa.DISCGraph1.D+'&I='+this.value.ppa.DISCGraph1.I+'&S='+this.value.ppa.DISCGraph1.S+'&C='+this.value.ppa.DISCGraph1.C+'&GraphStyle=0&GraphType=0&ReportingNorms=0';
			
			
			var graph2=yoodoo.e("div");
			$(graph2).addClass("graphDiv");
			var head=yoodoo.e("div");
			$(head).html('<div class="graphType">Behaviour under pressure</div>');
			var d=yoodoo.e("div");
			$(d).html("D").css({width:'20%',margin:'0px 0px 0px 10%',display:'inline-block','text-align':'center'});
			var i=yoodoo.e("div");
			$(i).html("I").css({width:'20%',margin:'0px',display:'inline-block','text-align':'center'});
			var s=yoodoo.e("div");
			$(s).html("S").css({width:'20%',margin:'0px',display:'inline-block','text-align':'center'});
			var c=yoodoo.e("div");
			$(c).html("C").css({width:'20%',margin:'0px 10% 0px 0px',display:'inline-block','text-align':'center'});
			$(head).append(d).append(i).append(s).append(c);
			var img2=yoodoo.e("img");
			var foot=yoodoo.e("div");
			$(foot).addClass("graphScores");
			var d=yoodoo.e("div");
			$(d).html(this.value.ppa.DISCGraph2.D).css({width:'20%',margin:'0px 0px 0px 10%',display:'inline-block','text-align':'center'});
			var i=yoodoo.e("div");
			$(i).html(this.value.ppa.DISCGraph2.I).css({width:'20%',margin:'0px',display:'inline-block','text-align':'center'});
			var s=yoodoo.e("div");
			$(s).html(this.value.ppa.DISCGraph2.S).css({width:'20%',margin:'0px',display:'inline-block','text-align':'center'});
			var c=yoodoo.e("div");
			$(c).html(this.value.ppa.DISCGraph2.C).css({width:'20%',margin:'0px 10% 0px 0px',display:'inline-block','text-align':'center'});
			$(foot).append(d).append(i).append(s).append(c);
			$(graph2).append(head).append(img2).append(foot).css({width:w});
			img2.src='http://handlers.thomasinternational.net/DISC/Disc.ashx?Width='+w+'&Height='+h+'&D='+this.value.ppa.DISCGraph2.D+'&I='+this.value.ppa.DISCGraph2.I+'&S='+this.value.ppa.DISCGraph2.S+'&C='+this.value.ppa.DISCGraph2.C+'&GraphStyle=0&GraphType=1&ReportingNorms=0';
			
			$(graphs).append(graph1).append(graph2);
		}
		var graph3=yoodoo.e("div");
		$(graph3).addClass("graphDiv");
		var head=yoodoo.e("div");
		$(head).html('<div class="graphType">Self image</div>');
		var d=yoodoo.e("div");
		$(d).html("D").css({width:'20%',margin:'0px 0px 0px 10%',display:'inline-block','text-align':'center'});
		var i=yoodoo.e("div");
		$(i).html("I").css({width:'20%',margin:'0px',display:'inline-block','text-align':'center'});
		var s=yoodoo.e("div");
		$(s).html("S").css({width:'20%',margin:'0px',display:'inline-block','text-align':'center'});
		var c=yoodoo.e("div");
		$(c).html("C").css({width:'20%',margin:'0px 10% 0px 0px',display:'inline-block','text-align':'center'});
		$(head).append(d).append(i).append(s).append(c);
		var img3=yoodoo.e("img");
		var foot=yoodoo.e("div");
		$(foot).addClass("graphScores");
		var d=yoodoo.e("div");
		$(d).html(this.value.ppa.DISCGraph3.D).css({width:'20%',margin:'0px 0px 0px 10%',display:'inline-block','text-align':'center'});
		var i=yoodoo.e("div");
		$(i).html(this.value.ppa.DISCGraph3.I).css({width:'20%',margin:'0px',display:'inline-block','text-align':'center'});
		var s=yoodoo.e("div");
		$(s).html(this.value.ppa.DISCGraph3.S).css({width:'20%',margin:'0px',display:'inline-block','text-align':'center'});
		var c=yoodoo.e("div");
		$(c).html(this.value.ppa.DISCGraph3.C).css({width:'20%',margin:'0px 10% 0px 0px',display:'inline-block','text-align':'center'});
		$(foot).append(d).append(i).append(s).append(c);
		$(graph3).append(head).append(img3).append(foot).css({width:w});
		img3.src='http://handlers.thomasinternational.net/DISC/Disc.ashx?Width='+w+'&Height='+h+'&D='+this.value.ppa.DISCGraph3.D+'&I='+this.value.ppa.DISCGraph3.I+'&S='+this.value.ppa.DISCGraph3.S+'&C='+this.value.ppa.DISCGraph3.C+'&GraphStyle=0&GraphType=2&ReportingNorms=0';
		$(graphs).append(graph3);
		
		this.analyze();
		var chars=[];
		if (this.value.ppa.traits.highD) chars.push(this.consistantCharacteristics.D[0]);
		if (this.value.ppa.traits.highI) chars.push(this.consistantCharacteristics.I[0]);
		if (this.value.ppa.traits.highS) chars.push(this.consistantCharacteristics.S[0]);
		if (this.value.ppa.traits.highC) chars.push(this.consistantCharacteristics.C[0]);
		if (this.value.ppa.traits.lowD) chars.push(this.consistantCharacteristics.D[1]);
		if (this.value.ppa.traits.lowI) chars.push(this.consistantCharacteristics.I[1]);
		if (this.value.ppa.traits.lowS) chars.push(this.consistantCharacteristics.S[1]);
		if (this.value.ppa.traits.lowC) chars.push(this.consistantCharacteristics.C[1]);
		var column=yoodoo.e('div');
		var columnDiv=yoodoo.e('div');
		$(column).addClass('characteristics').append(columnDiv);
		$(columnDiv).html("Your consistent characteristics are:");
		var characteristics=yoodoo.e("ul");
		$(columnDiv).append(characteristics);
		for(var c=0;c<chars.length;c++) {
			for(var cc=0;cc<chars[c].length;cc++) {
				var des=yoodoo.e("li");
				$(characteristics).append($(des).html(chars[c][cc]));
			}
		}
		var row=yoodoo.e("div");
		$(ppa_profile.containers.area).append($(row).append(column).append(graphs));
	},
	/*initGraphsvg:function() {
		this.graphCount=3;
		if (this.structure.main.selfImage) this.graphCount=1;
		this.drawSize[0]=$(this.containers.area).width()-100;
		this.drawSize[1]=this.height-100;
		if(this.graphCount==1) this.drawSize[0]=Math.floor(this.drawSize[0]/2);
		var canvasWidth=this.drawSize[0];
		var canvasHeight=this.drawSize[1];
		if (this.value.ppa.graphs!=undefined) {
			if(this.value.ppa.paragraph==undefined) this.analyze();
			var cont=this.containers.area;
  			var elem = null;
			if (!this.svgOnly) elem=document.createElement('canvas');
 			if (!this.svgOnly && elem.getContext && elem.getContext('2d')) {
				$(elem).attr("width",canvasWidth);
				$(elem).attr("height",canvasHeight);
				this.canvas=elem;
				this.canvasContext=elem.getContext('2d');
				cont.appendChild(this.canvas);
			}else{
				this.paper = document.createElement("svg");
				this.paper.setAttribute("width",canvasWidth+"px");
				this.paper.setAttribute("height",canvasHeight+"px");
				cont.appendChild(this.paper);
			}
			var coms=yoodoo.e("div");
			this.containers.area.appendChild(coms);
			var ins='';
			for(var pk in this.display.summaries) {
				if (this.value.ppa.paragraph[pk]!=undefined) {
					if (this.display.summaries[pk]) {
						ins+='<p>'+this.value.ppa.paragraph[pk].statement+'</p>';
						if (this.value.ppa.paragraph[pk].questions.length>0) {
							ins+="<p>Some probing questions:<ul>";
							for(var q=0;q<this.value.ppa.paragraph[pk].questions.length;q++) {
								ins+='<li>'+this.value.ppa.paragraph[pk].questions[q]+'</li>';
							}
							ins+="</ul></p>";
						}
					}
				}
			}
			$(coms).html(ins);

		}
		this.graphData={D:[0,0,0],I:[0,0,0],S:[0,0,0],C:[0,0,0]};
		this.graphVelocity={D:[0,0,0],I:[0,0,0],S:[0,0,0],C:[0,0,0]};
		this.animateGraph();
	},
	graphData:{},
	graphVelocity:{},
	friction:0.9,
	animateGraph:function() {
		var done=true;
		var j=0;
		for(var l in this.graphData) {
			for(var i=0;i<3;i++) {
				if (this.display.graphs[i]!==undefined) {
					var dv=(this.value.ppa.graphs[i][l]-this.graphData[l][i])/(10+j);
					this.graphVelocity[l][i]+=dv;
					this.graphVelocity[l][i]*=this.friction;
					this.graphData[l][i]+=this.graphVelocity[l][i];
					if (Math.sqrt(Math.pow(dv,2))<0.1 && Math.sqrt(Math.pow(this.graphVelocity[l][i],2))<0.1) {
						this.graphData[l][i]=this.value.ppa.graphs[i][l];
					}else{
						done=false;
					}
				}
				j++;
			}
		}
		this.drawGraph();
		if (!done) setTimeout('if (ppa_profile!==undefined) ppa_profile.animateGraph();',10);
	},
	drawGraph:function() {
		var padding=30;
		var initial=(this.graphElements.length==0);
		var w=Math.floor((this.drawSize[0]-(padding*(this.graphCount+1)))/this.graphCount);
		var maxAspect=1.2;
		var h=this.drawSize[1]-(2*padding);
		if (h/w>maxAspect) {
			h=Math.round(w*maxAspect);
		}
		this.clear();
		var horizontals=[this.greyZone,50,100-this.greyZone];
		this.lines=[];
		if (initial || this.canvas!==null) {
			var style={gradient:{stops:[[0,'#dfdfdf'],[1,'#929292']]},shadow:{color:'#000',blur:10,x:0,y:0},stroke:null};
			for(var i=0;i<this.graphCount;i++) {
				this.rect(((w+padding)*i)+padding,padding,w,h,style);
			}
			var stroke={width:2,style:'#fff'};
			for(var i=0;i<this.graphCount;i++) {
				for(var ho=0;ho<horizontals.length;ho++) {
					this.drawLine([[((w+padding)*i)+padding,h-(h*horizontals[ho]/100)+padding],[(((w+padding)*i))+w+padding,h-(h*horizontals[ho]/100)+padding]],{stroke:stroke,shadow:null});
				}
			}
			var stroke={width:2,style:'#494949'};
			var DISCpaddingPROPORTION=0.6;
			var LABELpaddingPROPORTION=0.4;
			var labels=['Work Mask','Behaviour under pressure','Self Image'];
			var shown=0;
			for(var i=0;i<3;i++) {
				if(this.display.graphs[i]) {
					var j=0;
					//for(var k=0;k<this.value.ppa.graphs.length;k++) {
					for(var k in this.value.ppa.graphs[i]) {
					//for(var j=0;j<4;j++) {
						var x=((w+padding)*shown)+padding+(Math.round((w/3)*j));
						this.drawLine([[x,padding],[x,h+padding]],{stroke:stroke,shadow:null});
						this.text(x,Math.round((padding/2)+((padding*DISCpaddingPROPORTION)/2)),k,{font:Math.round(padding*DISCpaddingPROPORTION)+'px Arial',color:'#000',align:'center'});
						j++;
					}
					var x=((w+padding)*shown)+padding+(Math.round(w/2));
					var y=h+(2*padding)-5;
					this.text(x,y,labels[i],{font:Math.round(padding*LABELpaddingPROPORTION)+'px Arial',color:'#000',align:'center'});
					shown++;
				}
			}
			style={fill:null,shadow:null,stroke:{width:2,style:'#494949'}};
			for(var i=0;i<this.graphCount;i++) {
				this.rect(((w+padding)*i)+padding,padding,w,h,style);
			}
		}
		var stroke={width:3,style:'#0f0'};
		var shadow={color:'#000',blur:5,x:0,y:2};
		var dotstroke={width:2,style:'#fff'};
		var fillstyle='#f00';
		var ge=0;
		shown=0;
		for(var i=0;i<3;i++) {
			if (this.display.graphs[i]) {
				var points=[];
				points.push([((w+padding)*shown)+Math.round(w*0/3)+padding,h-(h*this.graphData.D[i]/100)+padding]);
				points.push([((w+padding)*shown)+Math.round(w*1/3)+padding,h-(h*this.graphData.I[i]/100)+padding]);
				points.push([((w+padding)*shown)+Math.round(w*2/3)+padding,h-(h*this.graphData.S[i]/100)+padding]);
				points.push([((w+padding)*shown)+Math.round(w*3/3)+padding,h-(h*this.graphData.C[i]/100)+padding]);
				if (this.graphElements.length>ge && this.paper!==null) {
					this.drawLine(points,{stroke:stroke,shadow:shadow},ge);
				}else{
					this.graphElements.push(this.drawLine(points,{stroke:stroke,shadow:shadow}));
				}
				ge++;
				for(p=0;p<points.length;p++) {
					if (this.graphElements.length>ge && this.paper!==null) {
						this.drawCircle(points[p],5,{stroke:dotstroke,fill:fillstyle},ge);
					}else{
						this.graphElements.push(this.drawCircle(points[p],5,{stroke:dotstroke,fill:fillstyle}));
					}
					ge++;
				}
				shown++;
			}
		}
	
	},
	clear:function(){
		if (this.paper!==null) {

			//this.paper.clearRect(0,0,this.drawSize[0],this.drawSize[1]);
		}else if (this.canvas!==null) {
			this.canvasContext.clearRect(0,0,this.drawSize[0],this.drawSize[1]);
		}
	},
	text:function(x,y,t,style) {

		if (this.paper!==null) {
			
			var o=this.paper.text(x,y,t);
    			if (style.font) {
				var f=style.font.split(" ");
				o.attr({'font-size':f[0]});
				o.attr({'font':f[1]});
			}
    			if (style.color) o.attr({'fill':style.color});
    			if (style.align) {
				var a={left:'start',center:'middle',right:'end'};
				o.attr({'text-anchor':a[style.align]});
			}
		}else if (this.canvas!==null) {
    			if (style.font) this.canvasContext.font = style.font;
    			if (style.color) this.canvasContext.fillStyle  = style.color;
    			if (style.align) this.canvasContext.textAlign  = style.align;

 
    			this.canvasContext.fillText(t, x, y);
		}
	},
	rect:function(l,t,w,h,style){
		if (this.paper!==null) {
			//while(this.paper.
			var o=this.paper.rect(l,t,w,h);
			if (style.fill) o.attr({fill:style.fill});
			if (style.gradient) {
				var g=[];
				for(var i=0;i<style.gradient.stops.length;i++) {
					g.push(style.gradient.stops[i][0]+"-"+style.gradient.stops[i][1]);
				}
				o.attr({fill:((style.gradient.horizontal)?'0-':'270-')+g.join(":")});
			}
			if (style.stroke) {
				if (style.stroke.width)  o.attr({'stroke-width': style.stroke.width});
				if (style.stroke.corner)  o.attr({'stroke-linecap': style.stroke.corner});
				if (style.stroke.corner)  o.attr({'stroke-linejoin': style.stroke.corner});
				if (style.stroke.style)  o.attr({'stroke':style.stroke.style});
			}
		}else if (this.canvas!==null) {

			this.canvasContext.beginPath();
			this.canvasContext.rect(l,t,w,h);
			if (style!==null) {
				if (style.fill) {
					this.canvasContext.fillStyle=style.fill;
				}else if(style.gradient) {
					var grd = null;
					if(style.gradient.horizontal) {
						grd=this.canvasContext.createLinearGradient(0, 0, w, 0);
					}else{
						grd=this.canvasContext.createLinearGradient(0, 0, 0, h);
					}
					for(var i=0;i<style.gradient.stops.length;i++) {
						grd.addColorStop(style.gradient.stops[i][0], style.gradient.stops[i][1]);
					}
					this.canvasContext.fillStyle = grd;
				}
			}
			
			if (style.shadow) {
				if (style.shadow.color) this.canvasContext.shadowColor = style.shadow.color;
				if (style.shadow.blur) this.canvasContext.shadowBlur = style.shadow.blur;
				if (style.shadow.x) this.canvasContext.shadowOffsetX = style.shadow.x;
				if (style.shadow.y) this.canvasContext.shadowOffsetY = style.shadow.y;
			}
			if (style.shadow===null) this.canvasContext.shadowOffsetX=this.canvasContext.shadowOffsetY=this.canvasContext.shadowBlur=0;
			if ((style.fill && style.fill!==null) || (style.gradient && style.gradient!==null)) this.canvasContext.fill();
			if (style.stroke) {
				if (style.stroke.width) this.canvasContext.lineWidth = style.stroke.width;
				if (style.stroke.corner) this.canvasContext.lineJoin  = style.stroke.corner;
				if (style.stroke.corner) this.canvasContext.lineCap  = style.stroke.corner;
				if (style.stroke.style) this.canvasContext.strokeStyle = style.stroke.style;
				this.canvasContext.stroke();
			}
		}
	},
	drawLine:function(points,style) {
		if (this.paper!==null) {
			var p=[];
			for(var i=0;i<points.length;i++) {
				p.push(points[i].join(","));
			}
			if (arguments.length>2) {
				this.graphElements[arguments[2]].attr('path',"M"+p.join("L"));
			}else{
				var o=this.paper.path("M"+p.join("L"));

				if (style.stroke) {
					if (style.stroke.width)  o.attr({'stroke-width': style.stroke.width});
					if (style.stroke.corner)  o.attr({'stroke-linecap': style.stroke.corner});
					if (style.stroke.corner)  o.attr({'stroke-linejoin': style.stroke.corner});
					if (style.stroke.style)  o.attr({'stroke':style.stroke.style});
				}
				return o;
			}
		}else if (this.canvas!==null) {
			this.canvasContext.beginPath();
			for(var i=0;i<points.length;i++) {
				if(i==0) {
					this.canvasContext.moveTo(points[i][0],points[i][1]);
				}else{
					this.canvasContext.lineTo(points[i][0],points[i][1]);
				}
			}
			this.canvasContext.restore();
			if (style.shadow) {
				if (style.shadow.color) this.canvasContext.shadowColor = style.shadow.color;
				if (style.shadow.blur) this.canvasContext.shadowBlur = style.shadow.blur;
				if (style.shadow.x) this.canvasContext.shadowOffsetX = style.shadow.x;
				if (style.shadow.y) this.canvasContext.shadowOffsetY = style.shadow.y;
			}
			if (style.shadow===null) this.canvasContext.shadowOffsetX=this.canvasContext.shadowOffsetY=this.canvasContext.shadowBlur=0;
			if (style.stroke) {
				if (style.stroke.width) this.canvasContext.lineWidth = style.stroke.width;
				if (style.stroke.corner) this.canvasContext.lineJoin  = style.stroke.corner;
				if (style.stroke.corner) this.canvasContext.lineCap  = style.stroke.corner;
				if (style.stroke.style) this.canvasContext.strokeStyle = style.stroke.style;
			}
			this.canvasContext.stroke();
		}
	},
	drawCircle:function(p,r,style) {
		if (this.paper!==null) {
			if (arguments.length>3) {
				this.graphElements[arguments[3]].attr('x',p[0]);
				this.graphElements[arguments[3]].attr('y',p[1]);
				this.graphElements[arguments[3]].attr('cx',p[0]);
				this.graphElements[arguments[3]].attr('cy',p[1]);
				this.graphElements[arguments[3]].attr('r',r);
			}else{
				var o=this.paper.circle(p[0],p[1],r);
				if (style.fill) o.attr({fill: style.fill});

				if (style.stroke) {
					if (style.stroke.width)  o.attr({'stroke-width': style.stroke.width});
					if (style.stroke.corner)  o.attr({'stroke-linecap': style.stroke.corner});
					if (style.stroke.corner)  o.attr({'stroke-linejoin': style.stroke.corner});
					if (style.stroke.style)  o.attr({'stroke':style.stroke.style});
				}
				return o;
			}
		}else{
			this.canvasContext.beginPath();
			this.canvasContext.arc(p[0],p[1],r, 0, 2 * Math.PI, false);
			this.canvasContext.closePath();
			if (style.fill) {
				this.canvasContext.fillStyle=style.fill;
				this.canvasContext.fill();
			}else if(style.gradient) {
				var grd = null;
				if(style.gradient.horizontal) {
					grd=this.canvasContext.createLinearGradient(0, 0, w, 0);
				}else{
					grd=this.canvasContext.createLinearGradient(0, 0, 0, h);
				}
				for(var i=0;i<style.gradient.stops.length;i++) {
					grd.addColorStop(style.gradient.stops[i][0], style.gradient.stops[i][1]);
				}
				this.canvasContext.fillStyle = grd;
				this.canvasContext.fill();
			}
			if (style.stroke) {
				if (style.stroke.width) this.canvasContext.lineWidth = style.stroke.width;
				if (style.stroke.corner) this.canvasContext.lineJoin  = style.stroke.corner;
				if (style.stroke.corner) this.canvasContext.lineCap  = style.stroke.corner;
				if (style.stroke.style) this.canvasContext.strokeStyle = style.stroke.style;
			}
			this.canvasContext.stroke();
		}
	},*/
	questions:[
		{
			id:'ppa_profile1',
			option:[
				{title:'gentle',sub:'mild'},
				{title:'persuasive',sub:'can get others to agree'},
				{title:'humble',sub:'modest'},
				{title:'original',sub:'creative'}
			]
		},
		{
			id:'ppa_profile2',
			option:[
				{title:'attractive',sub:'appealing'},
				{title:'dutiful',sub:'do what is expected of me'},
				{title:'stubborn',sub:'firm in my views'},
				{title:'pleasant',sub:'easy going'}
			]
		},
		{
			id:'ppa_profile3',
			option:[
				{title:'easily led',sub:'tend to follow others'},
				{title:'bold',sub:'not afraid to have a go'},
				{title:'loyal',sub:'trustworthy'},
				{title:'charming',sub:'liked by people'}
			]
		},
		{
			id:'ppa_profile4',
			option:[
				{title:'open-minded',sub:'value all ideas'},
				{title:'obliging',sub:'try to please others'},
				{title:'will power',sub:'resolve'},
				{title:'cheerful',sub:'smiling'}
			]
		},
		{
			id:'ppa_profile5',
			option:[
				{title:'jolly',sub:'joyful'},
				{title:'precise',sub:'do things accurately'},
				{title:'courageous',sub:'have courage'},
				{title:'even-tempered',sub:'not up and down'}
			]
		},
		{
			id:'ppa_profile6',
			option:[
				{title:'competitive',sub:'like to compete'},
				{title:'considerate',sub:'think of the needs of others'},
				{title:'happy',sub:'cheerful'},
				{title:'harmonious',sub:'will try to avoid bad feelings'}
			]
		},
		{
			id:'ppa_profile7',
			option:[
				{title:'fussy',sub:'perfectionist'},
				{title:'obedient',sub:'follow rules '},
				{title:'won’t be beaten',sub:'want to win'},
				{title:'playful',sub:'full of fun'}
			]
		},
		{
			id:'ppa_profile8',
			option:[
				{title:'brave',sub:'gutsy'},
				{title:'inspiring',sub:'encourage others by actions and words'},
				{title:'willing to submit',sub:'give in to others'},
				{title:'timid',sub:'not happy taking chances'}
			]
		},
		{
			id:'ppa_profile9',
			option:[
				{title:'sociable',sub:'friendly'},
				{title:'patient',sub:'will wait until the time is right'},
				{title:'independent',sub:'rely on myself'},
				{title:'soft-spoken',sub:'speak in a mild manner'}
			]
		},
		{
			id:'ppa_profile10',
			option:[
				{title:'adventurous',sub:'willing to take risks'},
				{title:'receptive',sub:'accept suggestions'},
				{title:'polite',sub:'ask for enough and no more'},
				{title:'moderate',sub:'calm'}
			]
		},
		{
			id:'ppa_profile11',
			option:[
				{title:'talkative',sub:'talk a lot'},
				{title:'controlled',sub:'self-controlled'},
				{title:'go with the flow',sub:'toe the line'},
				{title:'decisive',sub:'ready to make decisions'}
			]
		},
		{
			id:'ppa_profile12',
			option:[
				{title:'polished',sub:'poised'},
				{title:'daring',sub:'take risks to win'},
				{title:'diplomatic',sub:'tactful'},
				{title:'satisfied',sub:'fulfilled'}
			]
		},
		{
			id:'ppa_profile13',
			option:[
				{title:'aggressive',sub:'forceful in getting things done'},
				{title:'life-of-the-party',sub:'high spirited'},
				{title:'soft-touch',sub:'can be taken advantage of'},
				{title:'fearful',sub:'usually fear the worst'}
			]
		},
		{
			id:'ppa_profile14',
			option:[
				{title:'cautious',sub:'avoid trouble'},
				{title:'determined',sub:'set on doing something'},
				{title:'convincing',sub:'can convince others'},
				{title:'good-natured',sub:'easy to get on with'}
			]
		},
		{
			id:'ppa_profile15',
			option:[
				{title:'willing',sub:'ready to help others'},
				{title:'eager',sub:'keen'},
				{title:'agreeable',sub:'amenable'},
				{title:'high spirited',sub:'full of life'}
			]
		},
		{
			id:'ppa_profile16',
			option:[
				{title:'confident',sub:'believe in myself'},
				{title:'sympathetic',sub:'feel sorry for others'},
				{title:'tolerant',sub:'accept others for what they are'},
				{title:'assertive',sub:'stand up for my rights'}
			]
		},
		{
			id:'ppa_profile17',
			option:[
				{title:'well-disciplined',sub:'accept limits'},
				{title:'generous',sub:'happy to share what i have'},
				{title:'dramatic',sub:'larger than life'},
				{title:'persistent',sub:'finish what i start'}
			]
		},
		{
			id:'ppa_profile18',
			option:[
				{title:'admirable',sub:'worthy of praise'},
				{title:'kind',sub:'kind-hearted'},
				{title:'resigned',sub:'let it be, think it’s all over'},
				{title:'force-of-character',sub:'determined to get results'}
			]
		},
		{
			id:'ppa_profile19',
			option:[
				{title:'respectful',sub:'show respect'},
				{title:'want to be in the lead',sub:'take the first step ahead of the crowd'},
				{title:'optimistic',sub:'always look on the bright side'},
				{title:'accommodating',sub:'unselfish'}
			]
		},
		{
			id:'ppa_profile20',
			option:[
				{title:'argumentative',sub:'will argue a lot'},
				{title:'adaptable',sub:'will consider alternatives'},
				{title:'easy going',sub:'laid-back'},
				{title:'light-hearted',sub:'like to have fun'}
			]
		},
		{
			id:'ppa_profile21',
			option:[
				{title:'trusting',sub:'trust people'},
				{title:'contented',sub:'relaxed'},
				{title:'positive',sub:'stress good points'},
				{title:'peaceful',sub:'peaceable'}
			]
		},
		{
			id:'ppa_profile22',
			option:[
				{title:'good-mixer',sub:'mix easily with others'},
				{title:'cultured',sub:'know how to say and do things right'},
				{title:'vigorous',sub:'have a lot of energy'},
				{title:'caring',sub:'understanding'}
			]
		},
		{
			id:'ppa_profile23',
			option:[
				{title:'companionable',sub:'want to be a friend'},
				{title:'accurate',sub:'need things to be correct'},
				{title:'outspoken',sub:'say what is on my mind'},
				{title:'restrained',sub:'keep control of my feelings'}
			]
		},
		{
			id:'ppa_profile24',
			option:[
				{title:'restless',sub:'need to keep busy'},
				{title:'neighbourly',sub:'do favours to help'},
				{title:'popular',sub:'want to be liked and admired'},
				{title:'faithful',sub:'true to family, friends'}
			]
		}
	],
	/*translate:function() {
		var reply=[];
		for(var g=1;g<=3;g++) {
			var i=g-1;
			var scores=this.value.ppa['DISCGraph'+g];
			var trans={D:0,I:0,S:0,C:0};
			if (scores!==undefined && scores.D!==undefined) {
				for(var l in scores) {
					var v=scores[l];
					var idx=-1;
					var gv=-1;
					for(var j=0;j<this.translation[i][l].length;j++) {
						if (v==this.translation[i][l][j][0]) {
							idx=j;
							gv=this.translation[i][l][j][1];
						}
					}
					if(idx<0) {
						for(var j=0;j<this.translation[i][l].length-1;j++) {
								if (v>this.translation[i][l][j][0] && v<this.translation[i][l][j+1][0]) {
									var p=(v-this.translation[i][l][j][0])/(this.translation[i][l][j+1][0]-this.translation[i][l][j][0]);
									gv=(p*(this.translation[i][l][j+1][1]-this.translation[i][l][j][1]))+this.translation[i][l][j][1];
								}
						
						}
					}
					if(gv<0) {
						if (v<this.translation[i][l][0][0]) {
							var p=(this.translation[i][l][1][0]-v)/(this.translation[i][l][1][0]-this.translation[i][l][0][0]);
							gv=this.translation[i][l][1][1]-(p*(this.translation[i][l][1][1]-this.translation[i][l][0][1]));
						}
						var lidx=this.translation[i][l].length-1;
						if (v>this.translation[i][l][lidx][0]) {
							var p=(v-this.translation[i][l][lidx-1][0])/(this.translation[i][l][lidx][0]-this.translation[i][l][lidx-1][0]);
							gv=this.translation[i][l][lidx][1]+(p*(this.translation[i][l][lidx][1]-this.translation[i][l][lidx-1][1]));
						}
					}
					if(gv>100) gv=100;
					if(gv<0) gv=0;
					trans[l]=gv;
				}
			}
			reply.push(trans);
		}
		this.value.ppa.graphs=reply;
		return reply;
	},
	translation:[
		{
			D:[
				[0,7.8],
				[1,13.1],
				[2,25.1],
				[3,32],
				[4,36.2],
				[5,39.5],
				[6,46],
				[7,52.2],
				[8,61.5],
				[9,68.7],
				[10,75.6],
				[12,79.4],
				[14,83.1],
				[15,87.9],
				[16,91.5],
				[20,94.8]
			],
			I:[
				[0,12],
				[1,21.2],
				[2,28.4],
				[3,38.9],
				[4,49.5],
				[5,60.5],
				[6,66.6],
				[7,75.3],
				[8,81],
				[9,86],
				[10,90.5],
				[17,94.8]
			],
			S:[
				[0,20.6],
				[1,26.1],
				[2,30.9],
				[3,41.6],
				[4,46.2],
				[5,53.7],
				[6,59.7],
				[7,65.3],
				[8,71.1],
				[9,75.2],
				[10,80.6],
				[11,86.3],
				[12,91.4],
				[19,94.7]
			],
			C:[
				[0,8],
				[1,22.8],
				[2,29],
				[3,42.9],
				[4,53],
				[5,65.4],
				[6,73.1],
				[7,78.8],
				[8,86.7],
				[9,90.8],
				[15,94.5]
			]
		},{
			D:[
				[21,4.4],
				[16,10.4],
				[15,13.8],
				[14,17.3],
				[13,20.9],
				[12,24.5],
				[11,27.9],
				[10,31.7],
				[9,35.1],
				[8,38.6],
				[7,42.3],
				[6,45.6],
				[5,49.8],
				[4,54],
				[3,60.3],
				[2,75.2],
				[1,86.9],
				[0,94.5]
			],
			I:[
				[19,4.4],
				[11,11.9],
				[10,16.1],
				[9,19.7],
				[8,23.1],
				[7,28.4],
				[6,35.4],
				[5,44.7],
				[4,49.8],
				[3,59.7],
				[2,73.7],
				[1,86.9],
				[0,94.5]
			],
			S:[
				[19,4.5],
				[13,8.3],
				[12,12],
				[11,18],
				[10,25.4],
				[9,28.7],
				[8,35.4],
				[7,43.7],
				[6,50.6],
				[5,57.3],
				[4,65.3],
				[3,79.5],
				[2,87],
				[1,90.9],
				[0,94.7]
			],
			C:[
				[16,4.5],
				[13,8.3],
				[12,12.3],
				[11,19.8],
				[10,27.5],
				[9,33.9],
				[8,42],
				[7,47.6],
				[6,52.1],
				[5,58.8],
				[4,69.2],
				[3,78.6],
				[2,86.9],
				[1,91.1],
				[0,94.7]
			]
		},{
			D:[
				[-21,6.8],
				[-14,10.2],
				[-13,13.4],
				[-11,17.1],
				[-10,20.9],
				[-9,24.6],
				[-7,28.2],
				[-6,32],
				[-4,35.7],
				[-3,39.5],
				[-2,42.8],
				[0,46.5],
				[1,51],
				[3,54.5],
				[5,58.2],
				[7,62.6],
				[8,66.3],
				[9,70.7],
				[10,74.7],
				[12,78.5],
				[13,82.2],
				[14,86],
				[15,89.6],
				[16,92.6],
				[20,95.9]
			],
			I:[
				[-19,6.9],
				[-10,12.6],
				[-9,16.1],
				[-8,20.4],
				[-7,24.8],
				[-6,28.4],
				[-5,32.1],
				[-4,35.9],
				[-3,39.6],
				[-2,44.6],
				[-1,48],
				[0,52.8],
				[1,58.2],
				[2,62.7],
				[3,67.1],
				[4,71.1],
				[5,75.8],
				[6,80.1],
				[7,84.9],
				[8,89.9],
				[9,92.7],
				[17,96]
			],
			S:[
				[-19,6.9],
				[-12,10.4],
				[-11,13.5],
				[-10,17.3],
				[-9,20.9],
				[-8,24.8],
				[-7,28.2],
				[-6,32.1],
				[-5,35.7],
				[-4,39.6],
				[-3,42.9],
				[-2,46.4],
				[-1,51],
				[0,55.2],
				[1,59.4],
				[2,63.5],
				[3,67.1],
				[4,71],
				[5,75.2],
				[7,78.6],
				[8,82.4],
				[9,86],
				[10,89.9],
				[11,92.7],
				[19,95.9]
			],
			C:[
				[-16,6.9],
				[-12,12.6],
				[-11,16.1],
				[-10,20.9],
				[-9,24.8],
				[-8,28.2],
				[-7,32.1],
				[-6,37.1],
				[-5,40.7],
				[-4,44.6],
				[-3,48.2],
				[-2,53.1],
				[-1,57.9],
				[0,63.3],
				[1,67.2],
				[2,73.7],
				[3,77.3],
				[4,80.9],
				[5,84.8],
				[6,89.7],
				[7,92.9],
				[15,96]
			]
		}
	],*/
	analyze:function() {
		if (this.value.ppa!==undefined && this.value.ppa.SelfImagePattern!==undefined) {
			this.value.ppa.traits={};
			this.value.ppa.traits.highD=this.check.highD();
			this.value.ppa.traits.highI=this.check.highI();
			this.value.ppa.traits.highS=this.check.highS();
			this.value.ppa.traits.highC=this.check.highC();
			this.value.ppa.traits.lowD=this.check.lowD();
			this.value.ppa.traits.lowI=this.check.lowI();
			this.value.ppa.traits.lowS=this.check.lowS();
			this.value.ppa.traits.lowC=this.check.lowC();
			this.value.ppa.traits.basicFactorCombination=this.check.basicFactorCombination();
		}
	},
	analyzeold:function() {

		this.value.ppa.traits={
			invalid:this.check.invalid(),
			tight1:this.check.tight([true,false,false]),
			tight2:this.check.tight([false,true,false]),
			tight3:this.check.tight([false,false,true]),
			tightAll:this.check.tight([true,true,true]),
			DequalsC:this.check.DequalsC(), // [1,0,-1] 1=equal above the line, -1=equal below the line
			overshift:this.check.overshift(),
			undershift:this.check.undershift(),
			greyZone:this.check.greyZone(),
			Smovement:this.check.Smovement(),
			flickUp:this.check.flickUp(),
			flickDown:this.check.flickDown(),
			sweepDown:this.check.sweepDown(),
			highD:this.check.highD(),
			highI:this.check.highI(),
			highS:this.check.highS(),
			highC:this.check.highC(),
			readOrder:this.check.readOrder(),
			basicFactorCombination:this.check.basicFactorCombination()
		};


		this.value.ppa.paragraph={};
		this.value.ppa.warnings=[];
		if(this.value.ppa.traits.invalid) {
			this.value.ppa.paragraph.invalid={statement:'There seems to be a problem with your results.',questions:['Did you understand the questionnaire?','Did your answers reflect how you actually behave at work?','Did you find it took you longer than 10 minutes?','Where you distracted?']};
		}else{
			
	

			var ks={D:'dominance',I:'influence',S:'steadiness',C:'compliance'};
			// consistantCharacteristics
			var characteristics=[];
			var charlist=this.consistantCharacteristics;
			if (this.verboseCharacteristics) charlist=this.consistantCharacteristicsVerbose;
			for(var i=0;i<this.value.ppa.traits.readOrder.length;i++) {
				var idx=(ppa_profile.value.ppa.graphs[2][this.value.ppa.traits.readOrder[i]]>=50)?0:1;
				var col=[];
				for(var c=0;c<charlist[this.value.ppa.traits.readOrder[i]][idx].length;c++) {
					if (this.verboseCharacteristics) {
						col.push(charlist[this.value.ppa.traits.readOrder[i]][idx][c]);
					}else{
						col.push(charlist[this.value.ppa.traits.readOrder[i]][idx][c].toLowerCase());
					}
				}
				characteristics.push({type:ks[this.value.ppa.traits.readOrder[i]],characteristics:col});
			}

			var rep={statement:'<h2>'+this.value.ppa.traits.basicFactorCombination.characteristic+'</h2>',questions:[]};
			this.value.ppa.paragraph.basicFactorCombination=rep;

			var summary='';
			var separator=', ';
			if (this.verboseCharacteristics) separator=' ';
			for(c=0;c<characteristics.length;c++) {
				summary+='<p><b>'+characteristics[c].type+'</b><br />'+characteristics[c].characteristics.join(separator)+'</p>';
			}
			var rep={statement:'Your consistent characteristics for each area seem to be<br />'+summary,questions:[]};
			this.value.ppa.paragraph.characteristics=rep;
/*
			if (this.value.ppa.traits.tight1) {
				var rep={statement:'You seem to be unsure of what is required of you at work, or unsuited to the work you chose. Maybe you are demotivated, have no clear objectives or unsure of your ability regarding your work.',questions:[]};
				rep.questions.push('Have there been any changes in your job in the last twelve months?');
				rep.questions.push('Do you have a clear job description?');
				rep.questions.push('Does your job description reflect the reality of your work?');
				rep.questions.push('How long have you been in this particular job/role?');
				rep.questions.push('In an ideal world, would you be doing this job?');
				rep.questions.push('What would you  like to change in your current job?');
				rep.questions.push('Where do you see yourself in one to five years\' time?');
				rep.questions.push('What are the stepping stones along the way?');
				rep.questions.push('What training have you had?');
				rep.questions.push('Do you think you need further training?');
				this.value.ppa.paragraph.tight1=rep;
			}
			if (this.value.ppa.traits.tight2) {
				var rep={statement:'You seem to be harbouring some insecurities, maybe you are frustrated with your current work situation, it maybe too challenging or your manager is not happy with your performance.',questions:[]};
				rep.questions.push('Do you ever feel demotivated in your current job and how do you handle that?');
				rep.questions.push('How is business?');
				rep.questions.push('How is your work going?');
				rep.questions.push('Is there something that you would like to change at work currently?');
				rep.questions.push('Are you experiencing current pressures in or out of work?');
				rep.questions.push('How do you feel about your current performance?');
				rep.questions.push('Are you satisfied with your current work performance/situation?');
				rep.questions.push('How is your performance measured?');
				rep.questions.push('How does your manager evaluate your performance?');
				this.value.ppa.paragraph.tight2=rep;
			}
			if (this.value.ppa.traits.tight3) {
				var rep={statement:'You seem to not have clearly defined objectives, or responsibilities without authority or even too many managers. You maybe frustrated that you are not allowed to contribute as much as you feel you can.',questions:[]};
				rep.questions.push('Are your objectives clearly defined? And have you agreed to them?');
				rep.questions.push('Do you have the necessary authority to have achieve your objectives?');
				rep.questions.push('How  does your current manager compare with your ideal?');
				rep.questions.push('When did you last solve a major disagreement with your manager and how was it resolved?');
				rep.questions.push('What defines a good or bad day in your job?');
				rep.questions.push('What do you feel are contraints on you achieving your goals and/or your optimum contribution?');
				rep.questions.push('How much support for your career do you derive from outside the workplace?');
				if (this.value.ppa.traits.highD) rep.questions.push('How much challenge is in your job?');
				if (this.value.ppa.traits.highI) rep.questions.push('Does your job provide opportunities to meet and motivate other people?');
				if (this.value.ppa.traits.highS) rep.questions.push('How often do you get side-tracked in the moddle of a job?');
				if (this.value.ppa.traits.highC) rep.questions.push('How often are you pressured to produce work of a lesser standard then you would like?');
				this.value.ppa.paragraph.tight3=rep;
			}
			if (this.value.ppa.traits.tightAll) {
				var rep={statement:'<b>Instructions</b>: you may not have been told to think of yourself at work<br /><b>Administration</b>: this questionairre may have been completed in between 6 and 8 minutes, or away from distractions/interruptions<br /><b>Language</b>: English may not be your instinctive language<br /><b>Literacy</b>: you may struggle with literacy<br /><b>New to work</b>: you may have just left full-time education or have been out of work for sometime',questions:[]};
				rep.questions.push('Did you have clear instructions?');
				rep.questions.push('Did you think of yourself in the work situation?');
				rep.questions.push('How long did it take you to completed this questionairre?');
				rep.questions.push('How did you find the process of choosing the options?');
				rep.questions.push('How much do you know about this organisation?');
				rep.questions.push('What appeals to you about this particular job?');
				rep.questions.push('Which parts of the job do you find interesting?');
				rep.questions.push('Are you considering or experiencing any major changes in your life?');
				rep.questions.push('Describe your short and long-term goals relative to your work?');
				rep.questions.push('How comfortable are you in your current role?');
				this.value.ppa.paragraph.tightAll=rep;
			}
			if (this.value.ppa.traits.DequalsC[0]==1) {
				var rep={statement:'You seem to be indecisive or cautious when important decision have to be made, or you are required to a job where getting the right result is of critical importance. Otherwise, your job maybe of very highly specialist or technical. If none of these, then maybe you do not have the authority to make decisions or is being suppressed by an agressive manager.',questions:[]};
				rep.questions.push('What is your thought process when making a decision?');
				rep.questions.push('What is the biggest decision you ever made and how did it turn out?');
				rep.questions.push('What is the worst decision you have ever made and why?');
				rep.questions.push('In your current job, what would be the implications if you made a wrong decision?');
				rep.questions.push('How does your organisation deal with failure?');
				rep.questions.push('Which is most important to you, accuracy or goal achievement?');
				rep.questions.push('What concerns you most in terms of decision making?');
				rep.questions.push('Does your manager support your decisions?');
				this.value.ppa.paragraph.DequalsC=rep;
			}
			if (this.value.ppa.traits.DequalsC[0]==-1) {
				var rep={statement:'You seem to be more indecisive when important decisions have to be made.',questions:[]};
				rep.questions.push('What is your thought process when making a decision?');
				rep.questions.push('What is the biggest decision you ever made and how did it turn out?');
				rep.questions.push('What is the worst decision you have ever made and why?');
				rep.questions.push('In your current job, what would be the implications if you made a wrong decision?');
				rep.questions.push('How does your organisation deal with failure?');
				rep.questions.push('Which is most important to you, accuracy or goal achievement?');
				rep.questions.push('What concerns you most in terms of decision making?');
				rep.questions.push('Does your manager support your decisions?');
				this.value.ppa.paragraph.DequalsC=rep;
			}
			if (this.value.ppa.traits.overshift[0]) {
				var rep={statement:'You seem to be pushing yourself in your work situation. This maybe because either:<li>You are new to your position, probably within 3 and 9 months</li><li>You have been over-promoted</li><li>You are forcing yourself to be something you are not, by attempting to do a job that may not be conducive to your natural behaviour</li>',questions:[]};
				rep.questions.push('How long have you been in your current job?');
				rep.questions.push('How has your job changed since you started?');
				rep.questions.push('What is the hardest part of your current job?');
				rep.questions.push('Given the chance, what would you change in your current job?');
				rep.questions.push('When, if ever, do you feel you have to be superman/superwoman?');
				rep.questions.push('Have you recently taken on additional responsibility?');
				rep.questions.push('Are you challenged in your role? How do you deal with challenges?');
				this.value.ppa.paragraph.overshift=rep;
			}
			if (this.value.ppa.traits.undershift[0]) {
				var rep={statement:'You seem to have low morale. This maybe due to over-promotion.',questions:[]};
				rep.questions.push('If you were to list the positive and negative aspects of your current situation, which list would be the longest?');
				rep.questions.push('How do you feel about your current role?');
				rep.questions.push('Where do you think you are doing well and where do you need to do better?');
				rep.questions.push('How do you deal with challenges?');
				this.value.ppa.paragraph.undershift=rep;
			}
			if (this.value.ppa.traits.undershift[2]) {
				this.value.ppa.warnings.push('Very low self image');
			}
			for(var k in this.value.ppa.traits.greyZone) {
				var rep=false;
				if (this.value.ppa.traits.greyZone[k].above!=false) {
					rep={statement:'You seem to have a '+this.value.ppa.traits.greyZone[k].above+' very high '+ks[k]+'.',questions:[]};
				}else if (this.value.ppa.traits.greyZone[k].below!=false) {
					rep={statement:'You seem to have a '+this.value.ppa.traits.greyZone[k].below+' very low '+ks[k]+'.',questions:[]};
				}
				if (rep) {
					rep.questions.push('Describe any situation where you felt you had gone too far in your behaviour?');
					rep.questions.push('How did you rectify the situation?');
					rep.questions.push('Has there ever been a time when you thought you might actually fail/be rejected/lose your security or get involved in direct conflict?');
					rep.questions.push('What did you do about it?');
					rep.questions.push('Are you aware of times when you have behaved very differently from your usual style?');
					this.value.ppa.paragraph.greyZone=rep;
				}
			}
			if (this.value.ppa.traits.Smovement.warning && this.value.ppa.traits.Smovement.warning!='') {
				if (this.value.ppa.traits.Smovement.warning=="work") {
					rep={statement:'You appear to have frustrations, problems or pressures in your work.',questions:[]};
					this.value.ppa.paragraph.Smovement=rep;
				}else if (this.value.ppa.traits.Smovement.warning=="personal") {
					rep={statement:'You appear to have frustrations, problems or pressures in your personal or emotional life.',questions:[]};
					this.value.ppa.paragraph.Smovement=rep;
				}
			}
			if (this.value.ppa.traits.flickUp) {
				rep={statement:'You seem to a person who may take risks and cut corners but will comply when it really matters.',questions:[]};
					this.value.ppa.paragraph.flickUp=rep;
			}
			if (this.value.ppa.traits.flickDown) {
				rep={statement:'You are likely to be overly independent, dislike rules and limitation. You also maybe a maverick/rebel.',questions:[]};
					this.value.ppa.paragraph.flickDown=rep;
			}
			if (this.value.ppa.traits.sweepDown) {
				rep={statement:'You seem to be very stubborn, likely to dig your heels in and could be immovable. In conflict you may show passive resistance.',questions:[]};
				this.value.ppa.paragraph.sweepDown=rep;
			}
			*/
		}
		
//console.log(this.traits);
	},
	checkTags:function() {
//console.log(this.value.ppa.traits);
		for(var t=0;t<this.structure.main.optionTags.length;t++) {
			var tag=this.structure.main.optionTags[t];
			var on=null;
			if (tag.tag!="") {
				if (tag.characteristic!="none") {
					on=(this.value.ppa.traits.basicFactorCombination.combination.replace('/','')==tag.characteristic);
				}
				if (tag.trait!="none") {
					/*switch(tag.trait) {
						case 'greyZone':
							for(var l in this.value.ppa.traits.greyZone) {
								if (this.value.ppa.traits.greyZone[l].above || this.value.ppa.traits.greyZone[l].below) {
									if (on!==false) on=true;
								}
							}
						break;
						case 'overshift':
							for(var i=0;i<this.value.ppa.traits.overshift.length;i++) {
								if (this.value.ppa.traits.overshift[i]) {
									if (on!==false) on=true;
								}
							}
						break;
						case 'undershift':
							for(var i=0;i<this.value.ppa.traits.undershift.length;i++) {
								if (this.value.ppa.traits.undershift[i]) {
									if (on!==false) on=true;
								}
							}
						break;
						case 'Smovement':
							if (this.value.ppa.traits.Smovement.warning!='' && on!==false) on=true;
						break;
						default:*/
							if (this.value.ppa.traits[tag.trait]===true && on!==false) {
								on=true;
							}
						/*break;
					}*/
				}
				if (on===true) {
					if (tag.remove) {
						dooit.removeTag(tag.tag);
					}else{
						dooit.addTag(tag.tag);
					}
				}else if (tag.unset) {
					dooit.removeTag(tag.tag);
				}
			}
		}
	},
	check:{
		/*invalid:function() {
			var dir={D:false,I:false,S:false,C:false};
			for(var k in dir) {
				var d=0;
				for(var i=0;i<3;i++) {
					d+=(ppa_profile.value.ppa.graphs[i][k][i]>50)?1:-1;
				}
				if (d==3 || d==-3) {
					dir[k]=true;
				}
			}
			return !(dir.D || dir.I || dir.S || dir.C);
		},
		tight:function(which) {
			var five=ppa_profile.translation[0].D[5][1];
			var eight=ppa_profile.translation[0].D[8][1];
			var tight=true;
			for(var i=0;i<3;i++) {
				if(which[i]) {
					if (ppa_profile.value.ppa.graphs[i].D<five || ppa_profile.value.ppa.graphs[i].D>eight) tight=false;
					if (ppa_profile.value.ppa.graphs[i].I<five || ppa_profile.value.ppa.graphs[i].I>eight) tight=false;
					if (ppa_profile.value.ppa.graphs[i].S<five || ppa_profile.value.ppa.graphs[i].S>eight) tight=false;
					if (ppa_profile.value.ppa.graphs[i].C<five || ppa_profile.value.ppa.graphs[i].C>eight) tight=false;
				}
			}
			return tight;
		},
		DequalsC:function(){
			var vals=[0,0,0];
			for(var i=0;i<3;i++) {
				var dif=ppa_profile.value.ppa.graphs[i].D-ppa_profile.value.ppa.graphs[i].C;
				if (dif>-6.18 && dif<6.18) {
					if (ppa_profile.value.ppa.graphs[i].D<50 && ppa_profile.value.ppa.graphs[i].C<50) {
						vals[i]=-1;
					}else{
						vals[i]=1;
					}
				}
			}
			return vals;
		},
		overshift:function() {
			var vals=[false,false,false];
			for(var i=0;i<3;i++) {
				vals[i]=!((ppa_profile.value.ppa.graphs[i].D<50)||(ppa_profile.value.ppa.graphs[i].I<50)||(ppa_profile.value.ppa.graphs[i].S<50)||(ppa_profile.value.ppa.graphs[i].C<50));
			}
			return vals;
		},
		undershift:function() {
			var vals=[false,false,false];
			for(var i=0;i<3;i++) {
				vals[i]=!((ppa_profile.value.ppa.graphs[i].D>50)||(ppa_profile.value.ppa.graphs[i].I>50)||(ppa_profile.value.ppa.graphs[i].S>50)||(ppa_profile.value.ppa.graphs[i].C>50));
			}
			return vals;
		},
		greyZone:function(){
			var vals={D:{above:false,below:false},I:{above:false,below:false},S:{above:false,below:false},C:{above:false,below:false}};
			var greyed={};
			for(var l in vals) {
				var above=0;
				var below=0;
				for(var i=0;i<3;i++) {
					if(ppa_profile.value.ppa.graphs[i][l]>100-ppa_profile.greyZone) above++;
					if(ppa_profile.value.ppa.graphs[i][l]<ppa_profile.greyZone) below++;
				}
				if (above>0) vals[l].above=(above==1)?'temporary':'permanent';
				if (below>0) vals[l].below=(below==1)?'temporary':'permanent';
			}
			return vals;
		},
		Smovement:function() {
			var vals={maxS:-100,minS:100,maxI:-100,minI:100};
			for(var i=0;i<3;i++) {
				var ss=ppa_profile.against3C(ppa_profile.value.ppa.graphs[i].S);
				var si=ppa_profile.against3C(ppa_profile.value.ppa.graphs[i].I);
				if (ss>vals.maxS) vals.maxS=ss;
				if (ss<vals.minS) vals.minS=ss;
				if (si>vals.maxI) vals.maxI=si;
				if (si<vals.minI) vals.minI=si;
			}
			vals.S=vals.maxS-vals.minS;
			vals.I=vals.maxI-vals.minI;
			vals.warning='';
			if (vals.S>=3) {
				vals.warning=(Math.round(vals.I)>=3)?'work':'personal';
			}
			return vals;
		},
		flickUp:function() {
			var a=false;
			if(ppa_profile.value.ppa.graphs[2].C<50) {
				a=(ppa_profile.value.ppa.graphs[2].S<ppa_profile.value.ppa.graphs[2].C);
			}
			return a;
		},
		flickDown:function() {
			var a=false;
			if(ppa_profile.value.ppa.graphs[2].C<50 && ppa_profile.value.ppa.graphs[2].C<50) {
				a=(ppa_profile.value.ppa.graphs[2].S>ppa_profile.value.ppa.graphs[2].C);
			}
			return a;
		},
		sweepDown:function() {
			var a=false;
			if(ppa_profile.value.ppa.graphs[2].C<50 && ppa_profile.value.ppa.graphs[2].C>50) {
				a=(ppa_profile.value.ppa.graphs[2].S>ppa_profile.value.ppa.graphs[2].C);
			}
			return a;
		},*/
		highD:function() {
			return (/^D/.test(ppa_profile.value.ppa.SelfImagePattern));
		},
		highI:function() {
			return (/^I/.test(ppa_profile.value.ppa.SelfImagePattern));
		},
		highS:function() {
			return (/^S/.test(ppa_profile.value.ppa.SelfImagePattern));
		},
		highC:function() {
			return (/^C/.test(ppa_profile.value.ppa.SelfImagePattern));
		},
		lowD:function() {
			return !(/D/.test(ppa_profile.value.ppa.SelfImagePattern));
		},
		lowI:function() {
			return (!/I/.test(ppa_profile.value.ppa.SelfImagePattern));
		},
		lowS:function() {
			return (!/S/.test(ppa_profile.value.ppa.SelfImagePattern));
		},
		lowC:function() {
			return (!/C/.test(ppa_profile.value.ppa.SelfImagePattern));
		},
		readOrder:function() {
			var above=[];
			var below=[];
			for(var k in ppa_profile.value.ppa.graphs[2]) {
				if(ppa_profile.value.ppa.graphs[2][k]>=50) {
					above.push(k);
				}else{
					below.push(k);
				}
			}
			above.sort(function(a,b) {return ppa_profile.value.ppa.graphs[2][b]-ppa_profile.value.ppa.graphs[2][a];});
			below.sort(function(a,b) {return ppa_profile.value.ppa.graphs[2][a]-ppa_profile.value.ppa.graphs[2][b];});
			var op=[];
			for(var i=0;i<above.length;i++) op.push(above[i]);
			for(var i=0;i<below.length;i++) op.push(below[i]);
			return op;
		},
		basicFactorCombination:function() {
			var type={
				DI:'Creativeness - Imagination',
				DS:'Drive',
				DC:'Individuality',
				ID:'Goodwill',
				IS:'Contactability',
				IC:'Self-confidence',
				SD:'Patience',
				SI:'Reflectiveness (concentration)',
				SC:'Persistence',
				CD:'Adaptability',
				CI:'Perfectionism',
				CS:'Sensitivity (shrewdness)'
			};
			var highest='';
			var lowest='';
			if (this.highD()) {
				highest='D';
			}else if (this.highI()) {
				highest='I';
			}else if (this.highS()) {
				highest='S';
			}else{
				highest='C';
			}
			if (this.lowD()) {
				lowest='D';
			}else if (this.lowI()) {
				lowest='I';
			}else if (this.lowS()) {
				lowest='S';
			}else{
				lowest='C';
			}
			var op={combination:highest+'/'+lowest,characteristic:type[highest+lowest]};
			return op;
		}
	},
	greyZone:12.5,
	consistantCharacteristics:{
		D:[
			[
				'Driving',
				'Competitive',
				'Forceful',
				'Inquisitive',
				'Direct',
				'Self-starter',
				'Assertive'
			],[
				'Hesitant',
				'Mild mannered',
				'Low decision need',
				'Non-demanding',
				'Accomodating'
			]
		],
		I:[
			[
				'Influential',
				'Persuasive',
				'Friendly',
				'Verbal',
				'Communicative',
				'Positive',
				'Networker'
			],[
				'Reserved',
				'Reflective',
				'Suspicious',
				'Self-conscious',
				'Probing',
				'Serious'
			]
		],
		S:[
			[
				'Dependable',
				'Deliberate',
				'Amiable',
				'Persistant',
				'Good listener',
				'Kind',
				'Methodical',
				'Thorough'
			],[
				'Mobile',
				'Alert',
				'Active',
				'Restless',
				'Demonstrative'
			]
		],
		C:[
			[
				'Compliant',
				'Careful',
				'Systematic',
				'Precise',
				'Accurate',
				'Perfectionist',
				'Logical'
			],[
				'Firm',
				'Persistant',
				'Stubborn',
				'Strong-willed',
				'Independent'
			]
		]
	},
	consistantCharacteristicsVerbose:{
		D:[
			[
				'Drive projects forward.',
				'Compete with others.',
				'Argue for your point of view.',
				'Curious about what’s going on.',
				'Say what you mean.',
				'You provide your own motivation.'
			],[
				'Keep your emotions in check.',
				'Get on with things.',
				'Make allowances for other people.'
			]
		],
		I:[
			[
				'Influence others.',
				'Persuade others that your views are correct.',
				'Are skilled with words.',
				'Communicate with others a lot.',
				'Look on the bright side.',
				'Know a lot of people.',
				'Make friends easily.'
			],[
				'Reserved.',
				'Take time to think things through.',
				'Question why other people do what they do.',
				'Ask questions.',
				'Take things seriously.',
				'Are aware of the effect you have on others.'
			]
		],
		S:[
			[
				'Can be trusted to do the job.',
				'Plan ahead carefully.',
				'Are pleasant to other people.',
				'Work through barriers.',
				'Listen carefully to others.',
				'Are kind.',
				'Work in an organised way.',
				'Pay attention to details.'
			],[
				'Are very active and on the move.',
				'Notice whats going on.',
				'Keep busy.',
				'Don’t settle down.',
				'Express your emotions.'
			]
		],
		C:[
			[
				'Do what you’re asked to do.',
				'Avoid risks.',
				'Tackle jobs in an organised way.',
				'Are accurate and precise.',
				'Argue logically rather than emotionally.'
			],[
				'Argue for what you think is right.',
				'Keep working at a job till you finish.',
				'Act on your own initiative.'
			]
		]
	},
	against3C:function(v) {
		for(var i=0;i<this.translation[2].C.length;i++) {
			if (v==this.translation[2].C[i][1]) return this.translation[2].C[i][0];
			if (i>0) {
				if (v>this.translation[2].C[i-1][1] && v<this.translation[2].C[i][1]) {
					var p=((v-this.translation[2].C[i-1][1])/(this.translation[2].C[i-1][1]-this.translation[2].C[i][1]));
					var a=(p*(this.translation[2].C[i-1][0]-this.translation[2].C[i][0]))+this.translation[2].C[i-1][0];
					return a;
				}
			}
		}
		if(v<this.translation[2].C[0][1]) return this.translation[2].C[0][0];
		if(v>this.translation[2].C[this.translation[2].C.length-1][1]) return this.translation[2].C[this.translation[2].C.length-1][0];
		return 0;
	}
};
