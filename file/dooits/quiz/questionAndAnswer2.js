var questionAndAnswer={
	fields:{},
	key:'',
	container:null,
	limit:0,
	description:'',
	replacements:{},
	title:'',
	quiz:[
		{pain:"My foot hurts",question:"How you going to stop it hurting?",report:{prefix:"[we] shall",text:"stop feet hurting by [answer]"}},
		{pain:"My foot hurts",question:"How you going to stop it hurting?",report:{prefix:"[we] shall",text:"stop feet hurting by [answer]"}},
		{pain:"My foot hurts",question:"How you going to stop it hurting?",report:{prefix:"[we] shall",text:"stop feet hurting by [answer]"}},
		{pain:"My foot hurts",question:"How you going to stop it hurting?",report:{prefix:"[we] shall",text:"stop feet hurting by [answer]"}},
		{pain:"My foot hurts",question:"How you going to stop it hurting?",report:{prefix:"[we] shall",text:"stop feet hurting by [answer]"}}
	],
	init:function(sel) {
		if (arguments.length>1) this.key=arguments[1];
		if (array_of_default_fields.length>0) this.key=array_of_default_fields[0];
		for(var k in array_of_fields) {
			if (this.key=='') this.key=k;
			this.fields[k]='';
			try{
				eval('questionAndAnswer.fields["'+k+'"]='+yoodoo.decodeHTMLResponse(array_of_fields[k][1])+';');
			}catch(e) {
				this.fields[k]=''; //array_of_fields[k][1];
			}
		}
		questionAndAnswer.fields=dooit.decode(questionAndAnswer.fields);
		this.container=$(sel).get(0);
		var ins='';
		if (this.title!='') ins+='<h3>'+this.title+'</h3>';
		if (this.description!='') ins+='<p>'+this.description+'</p>';

		if(typeof(this.fields[this.key])!="object" || typeof(this.fields[this.key].values)!="object") this.fields[this.key]={values:[],report:[]};
		for(var q=0;q<this.quiz.length;q++) {
			if (typeof(this.fields[this.key].values[q])=="undefined" || this.fields[this.key].values[q]=='') this.fields[this.key].values[q]={answer:'',selected:'0'};
			var show=(this.fields[this.key].values[q].answer!="" && this.fields[this.key].values[q].selected=="1");
			ins+="<div class='qanda'>";
			ins+="<button type='button' class='qanda_button"+(show?" on":"")+"'>"+this.quiz[q].pain+"</button>";
			//ins+="<label><input type='checkbox' />"+this.quiz[q].pain+"</label>";
			ins+="<div class='question' style='display:"+(show?"block":"none")+"'>"+this.quiz[q].question;
			var txt='';
			//if (show) txt=this.fields[this.key].values[q].answer;
			ins+="<textarea id='qa"+q+"' rows='6'>"+txt+"</textarea>";
			ins+="<div class='clear'></div>";
			ins+="</div></div>";

		}
		$(this.container).html(ins);
		for(var q=0;q<this.quiz.length;q++) {
			if ((this.fields[this.key].values[q].answer!="" && this.fields[this.key].values[q].selected=="1")) {
				$(this.container).find('textarea#qa'+q).val(this.fields[this.key].values[q].answer);
			}
		}
		
		$(this.container).find(".qanda_button").bind("click",function() {
			var q=$(this.parentNode).prevAll(".qanda").get().length;
			if ($(this).hasClass("on")) {
				questionAndAnswer.fields[questionAndAnswer.key].values[q].selected="0";
				$(this).removeClass("on");
				$(this.parentNode).find('.question').slideUp();
			}else{
				if(questionAndAnswer.limit<=0 || $(questionAndAnswer.container).find(".qanda_button.on").get().length<questionAndAnswer.limit) {
					questionAndAnswer.fields[questionAndAnswer.key].values[q].selected="1";
					$(this).addClass("on");
					$(this.parentNode).find('.question').slideDown();
				}
			}
		});
		$(this.container).find("textarea").bind("keyup",function() {
			var val=this.value;
			var q=$(this.parentNode.parentNode).prevAll(".qanda").get().length;
			questionAndAnswer.fields[questionAndAnswer.key].values[q].answer=val;
			
		});
	},
	buildReports:function() {
		var report=[];
//console.log(this.fields[this.key]);
		for(var q=0;q<this.fields[this.key].values.length;q++) {
			if (this.fields[this.key].values[q].selected=='1' && this.fields[this.key].values[q].answer!="") {
				var r=this.quiz[q].report;
				var nr={prefix:r.prefix,answer:r.text};
				nr.answer=nr.answer.replace('[answer]',this.fields[this.key].values[q].answer);
				for(var k in this.replacements) {
					nr.answer=nr.answer.replace('['+k+']',this.replacements[k]);
					nr.prefix=nr.prefix.replace('['+k+']',this.replacements[k]);
				}
				report.push(nr);
			}
		}
		this.fields[this.key].report=report;
	},
	output:function() {
		this.buildReports();
		/*var vals=this.fields[this.key];
		for(var q=0;q<vals.length;q++) {
			if (vals[q].selected=='0') vals[q].answer='';
		}*/
		
		var op=(dooit.json(this.fields[this.key]));
		array_of_fields[this.key][1]=op;
		var reply={};
		eval('reply.EF'+array_of_fields[this.key][0]+'=op;');
		return reply;
	},
	finishable:function() {
		return true;
	}


};
