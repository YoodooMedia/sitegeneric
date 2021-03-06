var display_dooit={
	construct_key:'',
	key:'',
	data:[],
	value:{},
	container:null,
	attachStructure:{},
	attachData:{},
	reporting:false,
	exportable:false,
	customReporter:null,
	exportStyles:{
		defaults:{
			all:'border:1px solid #bbb;',
			paragraph:'color:#366092;',
			title:'color:#76933c;',
			value:'color:#e26b0a;'
		},
		paragraph:{
			all:'',
			paragraph:'font-style:italic;color:#366092'
		},
		text:{
		},
		numeric:{
		},
		checkbox:{
		},
		select:{
		},
		buttons:{
		},
		slider:{
		},
		date:{
		}

	},
	keyChecker:function(ip) {
		//ip=ip.replace(/\d([\w]{19})/g,"f$1");
		return ip;
	},
	init:function() {
		this.completeHandler=function() {};
		this.customReporter=null;
		var file_derived=false;
		this.data=[];
		if (arguments.length>0 && typeof(arguments[0])=="object") {
			if (arguments[0].data!=undefined) {
				file_derived=true;
				this.data=arguments[0].data;
			}
			if (arguments[0].completeHandler!=undefined) {
				this.completeHandler=arguments[0].completeHandler;
			}
			if (arguments[0].customReporter!=undefined) {
				this.customReporter=arguments[0].customReporter;
			}
		}
		this.reporting=false;
		this.value={};
		this.construct_key='';
		this.key='';
		this.attachStructure={};
		this.attachData={};
		
		if(!file_derived) {
			if(typeof(array_of_default_fields)=="object") {
				for(var k=0;k<array_of_default_fields.length;k++) {
					if(/^global_Construct/.test(array_of_default_fields[k])) this.construct_key=array_of_default_fields[k];
				}
			}
			if (this.construct_key==='') {
				for(var k in array_of_fields) {
					if(typeof(array_of_fields[k])=="object") {
						if(/^global_Construct/.test(k)) {
							this.construct_key=k;
							break;
						}
					}
				}
			}

			try{
				eval('this.data='+this.decode(this.keyChecker(array_of_fields[this.construct_key][1]))+';');
			}catch(err) {
			}
		}
		if(typeof(array_of_default_fields)=="object") {
			for(var k=0;k<array_of_default_fields.length;k++) {
				if(/^Data/.test(array_of_default_fields[k])) this.key=array_of_default_fields[k];
			}
		}
		if (this.key==='') {
			for(var k in array_of_fields) {
				if(typeof(array_of_fields[k])=="object") {
					if(/^Data/.test(k)) {
						this.key=k;
						break;
					}
				}
			}
		}
		try{
			eval('this.value='+this.decode(this.keyChecker(array_of_fields[this.key][1]))+';');
		}catch(err) {
		}



		for(var k in array_of_fields) {
			var tmp=null;
			if (k!=this.construct_key) {
				if(typeof(array_of_fields[k])=="object") {
					if(/^global_Construct/.test(k)) {
						if (array_of_fields[k][1]!="") {
							try{
								eval('tmp='+this.decode(this.keyChecker(array_of_fields[k][1]))+';');
							}catch(err) {
							}
							if (tmp!=null) {
								for(var t=0;t<tmp.structure.length;t++) {
									this.attachStructure[tmp.structure[t].id]=tmp.structure[t];
								}
							}
						}
					}
				}
			}
			if (k!=this.key) {
				if(typeof(array_of_fields[k])=="object") {

					if(/^Data/.test(k)) {
						if (array_of_fields[k][1]!="" && /^\{/.test(array_of_fields[k][1])) {
							this.keyChecker(array_of_fields[k][1]);
							try{
								eval('tmp='+this.decode(this.keyChecker(array_of_fields[k][1]))+';');
							}catch(err) {
							}
							if(tmp!==null) {
								for(var nom in tmp) {
									this.attachData[nom]=tmp[nom];
								}
							}
						}
					}
				}
			}
		}
		if (typeof(this.data.dooit.scoring)=="undefined") this.data.dooit.scoring='none';
		eval('this.score_system=this.scoring.'+this.data.dooit.scoring+';');

// attach any reference structure/date

		for(var s=0;s<this.data.structure.length;s++) {
			if (this.data.structure[s].value.type=="reference") {
				if(typeof(this.data.structure[s].value.option[0].link)!="undefined") {
					if(typeof(this.attachStructure[this.data.structure[s].value.option[0].link])!="undefined" && typeof(this.attachData[this.data.structure[s].value.option[0].link])!="undefined") {
						this.data.structure[s].value.option[0].linked={structure:this.attachStructure[this.data.structure[s].value.option[0].link],data:this.attachData[this.data.structure[s].value.option[0].link]};
					}
				}
			}
		}
		this.check_defaults();
		if (this.data.dooit.randomize) this.randomize();
		if (this.data.dooit.randomizeoptions) this.randomize_options();
		this.container=$('.construction').get(0);
		this.render();
		setTimeout('display_dooit.score_system.init();',200);
		setTimeout('display_dooit.post_score_render();',300);

		
		var resrep=$(this.container).find('.result_report').get(0);

		if(this.data.dooit.serialize) {
			if(typeof(this.value.report)!="undefined" && this.value.report!="") {
				var suffix='';
				if (this.data.dooit.serialize && this.data.dooit.redoable) suffix="<div><button type='button' class='questionLeft' onclick='display_dooit.restart()'>redo</button></div>";
				$(resrep).html(this.value.report+suffix);
				$(this.container).find('.fields').css("display","none");
			}
		}
		if (this.exportable) dooit.setExport({csv:display_dooit.xport,xls:display_dooit.xportxls});
		if(this.data.dooit.serialize) {
			for(var i=0;i<this.data.structure.length;i++) {
				//if (this.data.structure[i].value.grouped=='1') this.data.structure[i].value.grouped='0';
				if (this.data.structure[i].value.multiple=='1') this.data.structure[i].value.multiple='0';
			}
			this.serializeIntro=undefined;
			this.serializeOutro=undefined;
			this.questionDisplayed=0;
			var q=$(this.container).find('.fields div.question').get();
			var paras=$(q[0]).prevAll(".answers").get();
			if (paras.length>0) this.serializeIntro=paras.splice(0,1);
			if (this.serializeIntro) this.questionDisplayed=-1;
			var paras=$(q[0]).nextAll(".answers").get();
			if (paras.length>0) this.serializeOutro=paras.pop();
			if (q.length>1) {

				if(this.data.dooit.seialized && !this.data.dooit.redoable) {
					ok=this.questionDisplayed==$(this.container).find('.fields .question').get().length;
				}

				var currentQuestion=q[0];
				$(currentQuestion).siblings('.question').css("display","none");
				if (this.questionDisplayed<0) $(currentQuestion).css("display","none");
				var insBefore=document.createElement("DIV");
				$(insBefore).addClass("fieldheader");
				var ins='';
				var fieldsDiv=$(this.container).find('.fields').get(0);
				var firstQuestion=$(fieldsDiv).find('.question').get(0);
				for(var qq=0;qq<q.length;qq++) ins+="<button type='button' class='questionDot'></button>";
				$(insBefore).html(ins);
				fieldsDiv.insertBefore(insBefore,firstQuestion);
				if (this.data.dooit.redoable) {
					$(this.container).find('.fields .fieldheader button.questionDot').bind("click",function(e) {
						var qi=$(this).prevAll('button.questionDot').get().length;
						var dir=qi-display_dooit.questionDisplayed;
						if (dir!=0) display_dooit.question_move(dir);
					});
				}
				var insAfter=document.createElement("DIV");
				$(insAfter).addClass("fieldfooter");
				ins='';
				ins+="<button class='questionRight'>next</button>";
				ins+="<button class='questionLeft' style='display:none'>previous</button>";
				$(insAfter).html(ins);
				if (this.data.dooit.redoable) {
					$(insAfter).find("button.questionLeft").bind("click",function() {
						display_dooit.question_move(-1);
					});
				}
	
				$(insAfter).find("button.questionRight").bind("click",function() {
					display_dooit.question_move(1);
				});
				fieldsDiv.appendChild(insAfter);

				if (this.questionDisplayed>=0) {
					var canProgress=true;
					if(typeof(this.completed[this.data.structure[this.questionDisplayed].value.type])!="undefined") {
						if(!this.completed[this.data.structure[this.questionDisplayed].value.type](this.questionDisplayed)) canProgress=false;
					}
					$(this.container).find('.fieldfooter button.questionRight').css("display",(canProgress && (this.questionDisplayed<q.length-1))?"block":"none");
				}
				var fini=true;
				for(var i=0;i<this.data.structure.length;i++) {
					if(typeof(this.completed[this.data.structure[i].value.type])!="undefined") {
						if(!this.completed[this.data.structure[i].value.type](i)) fini=false;
					}
				}
//console.log(display_dooit.value.reportFunction);
				if (fini && !this.data.dooit.redoable) {
					this.questionDisplayed=q.length-1;
					if (this.serializeOutro) $(this.serializeOutro).slideDown();
					$(this.container).find('.fields .question').css("display","none");
					$(this.container).find('.fields .fieldheader').css("display","none");
					$(this.container).find('.fields .fieldfooter button').css("display","none");
				}else{
					 $(this.serializeOutro).css("display","none");
				}
				if(this.questionDisplayed>=0) {
					$($(this.container).find('.fields .fieldheader button.questionDot').get(this.questionDisplayed)).addClass("on");
					if (this.serializeIntro)  $(this.serializeIntro).css("display","none");
				}
				if(fini) {
					if(this.completeHandler!=undefined && (this.value.report==undefined || this.value.report=='')) {
						this.value.refID='';
						this.completeHandler();
						//thomas.completedQuiz();
					}else{
						if (typeof(display_dooit.value.reportFunction)=="string") eval(display_dooit.value.reportFunction);
					}
				}
			}
		}
	},
	restart:function() {
		$(this.container).find(".result_report").slideUp(1000,function() {
			display_dooit.result_report='';
			$(display_dooit.container).find(".result_report").html('');
			$(display_dooit.container).find(".result_report").css("display","block");
			$(display_dooit.container).find('.fields .question').css("display","none");
			$(display_dooit.serializeOutro).css("display","none");
			$(display_dooit.container).find('.fields .fieldheader button.questionDot').removeClass("on");
			$(display_dooit.container).find('.fieldfooter button.questionLeft').css("display","none");
			$(display_dooit.container).find('.fieldfooter button.questionRight').css("display","block");
			$(display_dooit.container).find(".fields").slideDown();
			display_dooit.questionDisplayed=-1;
			if(display_dooit.serializeIntro) {
				$(display_dooit.serializeIntro).slideDown();
			}else{
				display_dooit.question_move(0);
			}
		});
	},
	question_move:function(dir) {
		var cq=this.questionDisplayed;
		if(cq<0 && this.serializeIntro) $(this.serializeIntro).slideUp();
		var q=$(this.container).find('.fields div.question').get();
		var time=0;
		if (this.stopwatch && cq>=0 && cq<q.length) {
			var qd=$(q[cq]).find(".answer").get();
			if (qd.length>0) {
				var k=qd[0].id;
				time=new Date().getTime()-this.stopwatch;
				if (typeof(this.value.times)=="undefined") this.value.times={};
				this.value.times[k]=(time/1000).toFixed(2);
			}
		}
		this.questionDisplayed+=dir;
		//console.log(this.questionDisplayed,dir);
		if (this.questionDisplayed<0) this.questionDisplayed=0;
		var fini=this.questionDisplayed>=q.length;
		if (fini) {
			if (this.serializeOutro) $(this.serializeOutro).slideDown();
			$(q[cq]).slideUp(500);
			if(this.completeHandler) this.completeHandler(this.value);
		}else{
			if (cq>=q.length || cq<0) {
				$($(display_dooit.container).find('.fields div.question').get(display_dooit.questionDisplayed)).slideDown(500,function() {
					display_dooit.stopwatch=new Date().getTime();
				});
			}else{
				$(q[cq]).slideUp(500,function() {
					$($(display_dooit.container).find('.fields div.question').get(display_dooit.questionDisplayed)).slideDown(500,function() {
						display_dooit.stopwatch=new Date().getTime();
					});
				});
			}
			$(this.container).find('.fields .fieldheader button.questionDot.on').removeClass("on");
		
			$($(this.container).find('.fields .fieldheader button.questionDot').get(this.questionDisplayed)).addClass("on");
			if (this.data.dooit.redoable) {
				$(this.container).find('.fieldfooter button.questionLeft').css("display",(this.questionDisplayed>0)?"block":"none");
			}
			
			var q=$($(display_dooit.container).find('.fields div.question').get(display_dooit.questionDisplayed)).find('.answer').get(0);
		
			var i=this.question_index(q.id);
			var status=this.automove_canprogress(i);
			if (!this.data.dooit.redoable) {
				var q=$(this.container).find(".fields .question").get();
				$(this.container).find('.fieldfooter button.questionRight').css("display",(status.canProgress && (this.questionDisplayed<q.length-1))?"block":"none");
	//console.log($(this.container).find('.fieldfooter button.questionRight').css("display"));
			}
		}
		//$(this.container).find('.fieldfooter button.questionRight').css("display",(status.canProgress && (this.questionDisplayed<q.length))?"block":"none");
		
	},
	result_report:function(html) {
		this.value.report=html;
		$(this.container).find(".fields").slideUp(1000,function() {
			var suffix='';
			if (display_dooit.data.dooit.serialize && display_dooit.data.dooit.redoable) suffix="<div><button type='button' class='questionLeft' onclick='display_dooit.restart()'>redo</button></div>";
			$(display_dooit.container).find('.result_report').html(display_dooit.value.report+suffix);
			if ($(display_dooit.container).find('.result_report').css("display")=="none") {
				$(display_dooit.container).find('.result_report').slideDown(500,function() {
					if (typeof(display_dooit.value.reportFunction)=="string") eval(display_dooit.value.reportFunction);
				});
			}else{
				if (typeof(display_dooit.value.reportFunction)=="string") eval(display_dooit.value.reportFunction);
			}
		});
	},
	randomize:function() {
		var groups=[];
		var group=[];
		for(var i=0;i<this.data.structure.length;i++) {
			if(this.data.structure[i].value.grouped=="0") {
				if (group.length>0) groups.push(group);
				group=[this.data.structure[i]];
			}else{
				group.push(this.data.structure[i]);
			}
		}
		if (group.length>0) groups.push(group);
		var shuffled=[];
		if (this.data.dooit.serialize) {
			var group=groups.splice(0,1)[0];
			for(var g=0;g<group.length;g++) {
				shuffled.push(group[g]);
			}			
		}
		while(groups.length>this.data.dooit.serialize?1:0) {
			var r=Math.floor(Math.random()*(groups.length-(this.data.dooit.serialize?1:0)));
			var group=groups.splice(r,1)[0];
			for(var g=0;g<group.length;g++) {
				shuffled.push(group[g]);
			}
		}
		if (this.data.dooit.serialize) {
			var group=groups.splice(0,1)[0];
			for(var g=0;g<group.length;g++) {
				shuffled.push(group[g]);
			}			
		}
		this.data.structure=shuffled;
	},
	randomize_options:function() {
		for(var i=0;i<this.data.structure.length;i++) {
			if(this.data.structure[i].value.option.length>1) {
				var shuffled=[];
				while(this.data.structure[i].value.option.length>0 && this.shuffled[this.data.structure[i].value.type]) {
					var r=Math.floor(Math.random()*this.data.structure[i].value.option.length);
					shuffled.push(this.data.structure[i].value.option.splice(r,1)[0]);
				}
				this.data.structure[i].value.option=shuffled;
			}
		}
	},
	check_defaults:function() {
		for(var i=0;i<this.data.structure.length;i++) {
			var defaultValue='';
			var defaultIndex=-1;
			if(this.data.structure[i].value.type=='checkbox' || this.data.structure[i].value.type=='select') {
				for(var j=0;j<this.data.structure[i].value.option.length;j++) {
					if(this.data.structure[i].value.option[j].isdefault=='1') {
						defaultIndex=j;
						//defaultValue=this.data.structure[i].value.option[j].title
					}
				}
			}else if(this.data.structure[i].value.type=='slider') {
				defaultIndex=0;
				defaultValue=""+this.data.structure[i].value.option[0].start;
			}
			if (typeof(this.value[this.data.structure[i].id])=="undefined") {
				var arr=[];
				for(var j=0;j<this.data.structure[i].value.option.length;j++) {
					arr.push('');
				}
				this.value[this.data.structure[i].id]=[arr];
				if(defaultIndex>=0) {
					if(defaultValue!="") {
						this.value[this.data.structure[i].id][0][defaultIndex]=defaultValue;
					}else{
						this.value[this.data.structure[i].id][0][defaultIndex]='1';
					}
				}
				
			}else{
				if (typeof(this.value[this.data.structure[i].id][0])!="object") {
					this.value[this.data.structure[i].id]=[this.value[this.data.structure[i].id]]; // ensure it can take multiple answers
				}
				for(var k=0;k<this.value[this.data.structure[i].id].length;k++) { // each question
					var checkDefault=(this.value[this.data.structure[i].id][k].length==0);
					if(typeof(this.data.structure[i].value)!="undefined" && (typeof(this.data.structure[i].value.option)!="undefined")) {
						if(typeof(this.value[this.data.structure[i].id][k])=="string" || typeof(this.value[this.data.structure[i].id][k])=="number") {
							this.value[this.data.structure[i].id][k]=[this.value[this.data.structure[i].id][k]];
						}
						while(this.data.structure[i].value.option.length>this.value[this.data.structure[i].id][k].length) {
							this.value[this.data.structure[i].id][k].push('');
							
						}
					}
					if(defaultIndex>=0 && checkDefault) {
						if(defaultValue!="") {
							this.value[this.data.structure[i].id][k][defaultIndex]=defaultValue;
						}else{
							this.value[this.data.structure[i].id][k][defaultIndex]='1';
						}
					}
				}
			}
		}
	},
	type_output:{
		paragraph:function(d,val,a) {
			var ins="";
			return ins;
		},
		text:function(d,val,a) {
			var ins="";
			if (val.option.length==0) {
				for(var i=0;i<val.option.length;i++) ins+="<div class='item2'><input type='text' onkeyup='display_dooit.set_value(\""+d+"\","+i+",this.value,"+a+");' value='"+(display_dooit.value[d][a][i]?display_dooit.value[d][a][i]:"")+"' /></div>";
			}else{
				for(var i=0;i<val.option.length;i++) ins+="<div class='item'><span class='label'>"+val.option[i].title+"</span><input type='text' onkeyup='display_dooit.set_value(\""+d+"\","+i+",this.value,"+a+");' value='"+(display_dooit.value[d][a][i]?display_dooit.value[d][a][i]:"")+"' /></div>";
			}
			return ins;
		},
		numeric:function(d,val,a) {
			var ins="";
			if (val.option.length==1) {
				for(var i=0;i<val.option.length;i++) ins+="<input type='text' style='text-align:right' onkeydown='return display_dooit.type_validate.numeric(event);' onkeyup='display_dooit.set_value(\""+d+"\","+i+",this.value,"+a+");' value='"+(display_dooit.value[d][a][i]?display_dooit.value[d][a][i]:"")+"' />";
			}else{
				for(var i=0;i<val.option.length;i++) ins+="<div class='item'><span class='label'>"+val.option[i].title+"</span><input type='text' onkeydown='return display_dooit.type_validate.numeric(event);' onkeyup='display_dooit.set_value(\""+d+"\","+i+",this.value,"+a+");' value='"+(display_dooit.value[d][a][i]?display_dooit.value[d][a][i]:"")+"' /></div>";
			}
			return ins;
		},
		checkbox:function(d,val,a) {
			var ins="";
			if (val.option.length==1) {
				for(var i=0;i<val.option.length;i++) ins+="<input type='checkbox' "+((display_dooit.value[d][a][i]==1)?"checked":"")+" onchange='display_dooit.set_value(\""+d+"\","+i+",this.checked?\"1\":\"0\","+a+");'/>";
			}else{
				for(var i=0;i<val.option.length;i++) {
					ins+="<div class='item'><label><span class='label'>"+val.option[i].title+"</span><input type='checkbox' "+((display_dooit.value[d][a][i]==1)?"checked":"");
					//ins+=" onchange='display_dooit.set_value(\""+d+"\","+i+",this.checked?\"1\":\"0\","+a+");'";
					ins+=" onchange='display_dooit.set_checkbox(this);'";
					ins+="/></label></div>";
				}
			}
			return ins;
		},
		select:function(d,val,a) {
			var ins="";
			ins+="<select onchange='display_dooit.set_select(this);'>";
			var so='';
			var on=false;
			for(var i=0;i<val.option.length;i++) {
				so+="<option"+((display_dooit.value[d][a][i]=="1")?" selected='true'":"")+" >"+val.option[i].title+"</option>";
				if (display_dooit.value[d][a][i]=="1") on=true;
			}
			if (!on) so='<option selected="true">inputremoveoption</option>'+so;
			ins+=so+"</select>";
			return ins;
		},
		buttons:function(d,val,a) {
			var ins="";
			ins+="<div class='buttonInputs'>";
			var so='';
			var on=false;
			for(var i=0;i<val.option.length;i++) {
				so+="<button type='button' class='buttonInput "+((display_dooit.value[d][a][i]=="1")?" on":"")+"' onclick='display_dooit.set_button(this)' >"+val.option[i].title+"</button>";
				if (display_dooit.value[d][a][i]=="1") on=true;
			}
			ins+=so+"</div>";
			return ins;
		},
		reference:function(d,val,a) {
			var ins='';
			if(typeof(display_dooit.value[d][a])=="undefined") display_dooit.value[d][a]=[];
			for(var s=0;s<val.option[0].linked.structure.value.option.length;s++) {
				if(display_dooit.value[d][a].length<=s) display_dooit.value[d][a].push('');
			}
			var asSelect=(val.option[0].linked.structure.value.option.length==1 || val.option[0].onlyTitle || (val.option[0].questionIndex>0));
			var selected=false;
			if (asSelect) {
				ins+="<select onchange='display_dooit.set_select(this);'>";
				for(var o=0;o<val.option[0].linked.data.length;o++) {
					ins+="<option"+((display_dooit.value[d][a][val.option[0].questionIndex]==val.option[0].linked.data[o][val.option[0].questionIndex])?" selected='true'":"")+">"+val.option[0].linked.data[o][val.option[0].questionIndex]+"</option>";
					if(display_dooit.value[d][a][0]==val.option[0].linked.data[o][val.option[0].questionIndex]) selected=true;
				}
				ins+="</select>";
			}else{
				ins+="<div class='ref_list'>";
				for(var o=0;o<val.option[0].linked.data.length;o++) {
					ins+="<div class='ref_item"+((display_dooit.value[d][a][val.option[0].questionIndex]==val.option[0].linked.data[o][val.option[0].questionIndex])?" on":"")+"' onclick='display_dooit.set_reference_item(this,"+o+");'>";
					for(var f=0;f<val.option[0].linked.data[o].length;f++) {
						ins+="<div class='"+((f==0)?'ref_title':'ref_info')+"' title='"+val.option[0].linked.structure.value.option[f].title+": "+val.option[0].linked.data[o][f]+"'>"+val.option[0].linked.data[o][f]+"</div>";
					}
					if(display_dooit.value[d][a][val.option[0].questionIndex]==val.option[0].linked.data[o][val.option[0].questionIndex]) selected=true;
					ins+="</div>";
				}
				ins+="</div>";
			}
			if(val.option[0].addable) {
				var op='<button type="button" onclick="display_dooit.set_reference_custom(this)">'+(selected?"custom":"suggestions")+"</button>";
				op+="<div class='ref_suggestions' style='display:"+(selected?"block":"none")+"'>"+ins+"</div>";
				op+="<div class='ref_custom' style='display:"+(selected?"none":"block")+"'>";
				for(var s=0;s<val.option[0].linked.structure.value.option.length;s++) {
					op+="<div class='item'><span class='label'>"+val.option[0].linked.structure.value.option[s].title+"</span><input type='text' onkeyup='display_dooit.set_value(\""+d+"\","+s+",this.value,"+a+");' value='"+(display_dooit.value[d][a][s]?display_dooit.value[d][a][s]:"")+"' /></div>";
				}
				op+="</div>";
				ins=op;
			}
			return ins;
		},
		slider:function(d,val,a) {
			var w=240;
			var ins="";
			ins+="<div class='slider_frame ice'>";
			ins+="<div class='slider_text'><div class='maxText'>"+val.option[0].maxText+"</div><div class='minText'>"+val.option[0].minText+"</div></div>";
			ins+="<div class='relative'>";
			ins+="<div class='slider_background'>";
			for(var dd=0;dd<val.option[0].divisions;dd++) {
				ins+="<li class='divisions' style='width:"+(w/val.option[0].divisions)+"px'></li>";
			}
			ins+="</div>";
			var v=parseInt((display_dooit.value[d][a][0]=='')?val.option[0].start:display_dooit.value[d][a][0]);
			if(v>val.option[0].divisions) v=parseInt(val.option[0].divisions);
			display_dooit.value[d][a][0]=v;
			if(display_dooit.value[d][a][0]=='') display_dooit.value[d][a][0]=val.option[0].start;
			ins+="<div class='slider_colour' style='width:"+((w/val.option[0].divisions)*v)+"px'>";
			ins+="<div class='slider_colour_fullwidth'>";
			for(var dd=0;dd<val.option[0].divisions;dd++) {
				ins+="<li class='divisions' style='width:"+(w/val.option[0].divisions)+"px'></li>";
			}
			ins+="</div>";
			ins+="</div>";
			ins+="<div class='hotspots'>";
			for(var dd=0;dd<val.option[0].divisions;dd++) {
				ins+="<li class='divisions' style='width:"+(w/val.option[0].divisions)+"px' onclick='display_dooit.set_slider(this);'></li>";
			}
			ins+="</div>";
			ins+="</div>";
			ins+="</div>";
			return ins;
		},
		date:function(d,val,a) {
			var idx=display_dooit.question_index(d);
			var ins="";
				for(var i=0;i<val.option.length;i++) {
				if (display_dooit.data.structure[idx].value.option[i].format==null || display_dooit.data.structure[idx].value.option[i].format=='') display_dooit.data.structure[idx].value.option[i].format='d/m/Y';
					if (val.option.length>1) ins+="<div class='item'><span class='label'>"+val.option[i].title+"</span>";
					ins+="<input type='text' class='date' onkeyup='display_dooit.set_value(\""+d+"\","+i+",this.value,"+a+");' value='"+((display_dooit.value[d][a][i]!="")?inputs.formatDate('d/m/Y',display_dooit.value[d][a][i]):"")+"' />";
					if (val.option.length>1) ins+="</div>";
				}
			
			return ins;
		}
	},
	set_slider:function(o) {
		var ans=this.input_indexes(o);
		var v=$(o).prevAll('li').get().length+1;
		var val=v*(240/display_dooit.data.structure[ans.index].value.option[0].divisions);
		var col=$(o.parentNode.parentNode).find('.slider_colour').animate({width:val});
		display_dooit.value[ans.id][ans.answer][0]=""+v;
		this.score_system.update();
		display_dooit.value_updated(ans.id);
	},
	set_select:function(o) {
		var ans=display_dooit.input_indexes(o);
		var q=display_dooit.question_index(ans.id);
		if (display_dooit.data.structure[q].value.type=="reference") {
			display_dooit.set_reference(o,ans,q);
		}else{
			for(var j=0;j<display_dooit.value[ans.id][ans.answer].length;j++) {
				display_dooit.value[ans.id][ans.answer][j]='0';
			}
			display_dooit.value[ans.id][ans.answer][o.selectedIndex]='1';
			display_dooit.score_system.update();
		}
		display_dooit.value_updated(ans.id);
	},
	layout_buttons:function() {
		var layouts=[];
		if (arguments.length>0) {
			layouts=$(arguments[0]).find('.buttonInputs').get();
		}else{
			layouts=$(this.container).find('.buttonInputs').get();
		}
		var fields=$(this.container).find('.fields').get(0);
		fieldDisplay=$(fields).css("display");
		$(fields).css("display",'block');
		for(var l=0;l<layouts.length;l++) {
			var question=this.predecessor(layouts[l],'question');
			var questionDisplay=$(question).css("display");
			$(question).css("display",'block');
			var buttons=$(layouts[l]).find('button.buttonInput').get();
			var maxWidth=0;
			var dw=0;
			if (buttons.length>0) {
				dw=$(buttons[0]).outerWidth(true)-$(buttons[0]).outerWidth();
			}
			for(var b=0;b<buttons.length;b++) {
				var w=$(buttons[b]).outerWidth(true);
				if (maxWidth<w) maxWidth=w;
			}
			var containerWidth=$(layouts[l]).width();
			if(buttons.length*maxWidth>containerWidth) {
				var nw=Math.floor((containerWidth/buttons.length)-dw);
				$(buttons).css("width",nw+"px");
			}else{
				//dw=0;
				$(buttons).css("width",(maxWidth-dw)+"px");
			}
			var maxHeight=0;
			for(var b=0;b<buttons.length;b++) {
				var h=$(buttons[b]).outerHeight();
				if (maxHeight<h) maxHeight=h;
			}
			$(buttons).css("height",maxHeight+"px");
			$(question).css("display",questionDisplay);
		}
		$(fields).css("display",fieldDisplay);
	},
	set_button:function(o) {
		if (!$(o).hasClass('disabled')) {
			var ans=display_dooit.input_indexes(o);
			var si=$(o).prevAll('button.buttonInput').get().length;
			var ci=-1;
			if ($(o).siblings('button.buttonInput.on').get().length>0) {
				ci=$(o).siblings('button.buttonInput.on').prevAll('button.buttonInput').get().length;
			}
			var q=display_dooit.question_index(ans.id);
			if (!display_dooit.value[ans.id][ans.answer].length) {
				var tmp=[];
				for(var k in display_dooit.value[ans.id][ans.answer]) tmp.push(display_dooit.value[ans.id][ans.answer][k]);
				display_dooit.value[ans.id][ans.answer]=tmp;
			}
			for(var j=0;j<display_dooit.value[ans.id][ans.answer].length;j++) {
				if (j!=si) display_dooit.value[ans.id][ans.answer][j]='0';
			}
			var val=display_dooit.value[ans.id][ans.answer][si]=="1";
			val=!val;
			display_dooit.value[ans.id][ans.answer][si]=val?'1':'0';
			$(o).siblings('.buttonInput.on').removeClass("on");
			if (val) {
				$(o).addClass("on");
			}else{
				$(o).removeClass("on");
			}
			display_dooit.score_system.update();
			display_dooit.value_updated(ans.id);
			if (this.data.dooit.buttonsUniqueInGroups) {
				var thisAnswerItem=this.predecessor(o,'answer_item');
				var question=this.predecessor(o,'question');
				$(question).find('.answer_item').each(function(i,o) {
					if (thisAnswerItem!=o) {
						if (val) {
							$($(o).find('.buttonInput').get(si)).addClass("disabled");
						}else{
							$($(o).find('.buttonInput').get(si)).removeClass("disabled");
						}
						if (ci>=0 && ci!=si) {
							$($(o).find('.buttonInput').get(ci)).removeClass("disabled");
						}
					}
				});
			}
		}
	},
	set_reference_item:function(o,i) {
		$(o).siblings(".ref_item.on").removeClass("on");
		$(o).addClass("on");
		var ans=display_dooit.input_indexes(o);
		var q=display_dooit.question_index(ans.id);
		var val=display_dooit.data.structure[q].value;
		var item=val.option[0].linked.data[i];
		display_dooit.value[ans.id][ans.answer]=[];
		for(var i=0;i<item.length;i++) {
			display_dooit.value[ans.id][ans.answer].push(item[i]);
		}
		display_dooit.score_system.update();
	},
	set_reference:function(o,ans,index) {
		var val=display_dooit.data.structure[index].value;
		var item=val.option[0].linked.data[o.selectedIndex];
		display_dooit.value[ans.id][ans.answer]=[];
		for(var i=0;i<item.length;i++) {
			display_dooit.value[ans.id][ans.answer].push(item[i]);
		}
		display_dooit.score_system.update();
		display_dooit.value_updated(ans.id);
	},
	set_reference_custom:function(o) {
		var ans=display_dooit.input_indexes(o);
		var q=display_dooit.question_index(ans.id);
		if(o.innerHTML=="custom") {
			o.innerHTML="suggestions";
			var ips=$(o.parentNode).find('.ref_custom input').get();
			for(var j=0;j<display_dooit.value[ans.id][ans.answer].length;j++) {
				ips[j].value=display_dooit.value[ans.id][ans.answer][j];
			}
			$(o.parentNode).find('.ref_suggestions').slideUp();
			$(o.parentNode).find('.ref_custom').slideDown();
		}else{
			o.innerHTML="custom";
			$(o.parentNode).find('.ref_suggestions .ref_item.on').removeClass("on");
			var idx=-1;
			var val=display_dooit.data.structure[q].value;
			var item=val.option[0].linked.data;
			for(var i=0;i<item.length;i++) {
				if(item[i][0]==display_dooit.value[ans.id][ans.answer][0]) idx=i;
			}
			if (idx>=0) {
				$($(o.parentNode).find('.ref_suggestions .ref_item').get(idx)).addClass("on");
			}
			$(o.parentNode).find('.ref_suggestions').slideDown();
			$(o.parentNode).find('.ref_custom').slideUp();
		}
	},
	input_indexes:function(o) {
		var ans={};
		ans.question=$(this.predecessor(o,'question')).prevAll('.question').get().length;
		ans.id=this.predecessor(o,'answer').id;
		ans.index=this.question_index(ans.id);
		ans.grouped=($(this.predecessor(o,'answer_item')).parent().find('.answer_item').get().length>1);
		ans.answerItem=$(this.predecessor(o,'answer_item')).prevAll('.answer_item').get().length;
		ans.answer=$(this.predecessor(o,'answers')).prevAll('.answers').get().length;
		if (ans.grouped) ans.question+=ans.answerItem;
		return ans;
	},
	question_index:function(id) {
		for(var i=0;i<display_dooit.data.structure.length;i++) {
			if (display_dooit.data.structure[i].id==id) return i;
		}
		return false;
	},
	set_value:function(k,i,v,a) {
		this.value[k][a][i]=v;
		this.score_system.update();
		this.value_updated(k);
	},
	value_updated:function() {
		var canProgress=true;
		if(this.data.dooit.serialize) {
			var i=this.question_index(arguments[0]);
//console.log(i);
			var status=this.automove_canprogress(i);
			if (!this.data.dooit.redoable) {
				var q=$(this.container).find(".fields .question").get();
				$(this.container).find('.fieldfooter button.questionRight').css("display",(status.canProgress && (this.questionDisplayed<q.length-1))?"block":"none");
			}
			if(status.automove) {
				if (status.canProgress) this.question_move(1);
			}
		}
		return canProgress;
	},
	automove_canprogress:function(i) {
		
		var canProgress=true;
		var grouped=true;
		var automove=true;
		
		while(grouped && i>=0) {
			if(this.data.structure[i].value.grouped!='1') grouped=false;
			i--;
		}
		i++;
		grouped=true;
		while(grouped) {
			if(typeof(this.completed[this.data.structure[i].value.type])!="undefined") {
				if(!this.completed[this.data.structure[i].value.type](i)) canProgress=false;
			}
//console.log(i,this.auto_move[this.data.structure[i].value.type],canProgress);
			if (!this.auto_move[this.data.structure[i].value.type]) automove=false;
			i++;
			if(i==this.data.structure.length || this.data.structure[i].value.grouped!='1') grouped=false;
			
		}
		if (this.data.dooit.redoable) automove=false;
		/*if(automove) {
			if (canProgress) this.question_move(1);
		}*/
		return {automove:automove,canProgress:canProgress};
	},
	auto_move:{
		paragraph:false,
		text:false,
		numeric:false,
		checkbox:true,
		select:true,
		buttons:true,
		slider:false,
		reference:false,
		date:false
	},
	shuffled:{
		paragraph:false,
		text:false,
		numeric:false,
		checkbox:true,
		select:true,
		buttons:true,
		slider:false,
		reference:false,
		date:false
	},
	type_validate:{
		paragraph:function(o,e) {
			return true;
		},
		text:function(o,e) {
			return true;
		},
		numeric:function(o,e) {
			var key=display_dooit.keyCode(e);
			return (key.decimal || key.navigate);
		},
		checkbox:function(o,e) {
			return true;
		},
		select:function(o,e) {
			return true;
		},
		buttons:function(o,e) {
			return true;
		},
		slider:function(o,e) {
			return true;
		},
		reference:function(o,e) {
			return true;
		},
		date:function(o,e) {
			return true;
		}
	},
	type_report:{
		paragraph:function(d,val,a) {
			return '';
		},
		text:function(d,val,a) {
			var ins="";
			if(arguments.length>3 && arguments[3]) {
				if (val.length>1) {
					for(var i=0;i<val.length;i++) ins+="<p class='label'>"+val[i].title+"</p><p class='answer' id='"+d+"'>"+(display_dooit.value[d][a][i]?display_dooit.value[d][a][i]:"")+"</p>";
				}else if (val.length==1) {
					if (val[0].title!=undefined && val[0].title!="") {
						ins+="<p class='label'>"+val[0].title+"</p><p class='answer' id='"+d+"'>"+(display_dooit.value[d][a][0]?display_dooit.value[d][a][0]:"")+"</p>";
					}else{
						ins+="<p class='answer' id='"+d+"'>"+(display_dooit.value[d][a][0]?display_dooit.value[d][a][0]:"")+"</p>";
					}
				}else if(val.length>0) {
					if (val[0].title!=undefined && val[0].title!="") {
						ins+="<p class='label' textType'>"+val[0].title+"</p><p class='answer' id='"+d+"'>Nothing selected</p>";
					}else{
						ins="<p class='answer' id='"+d+"'>Nothing selected</p>";
					}
				}else{
					//ins="Nothing selected";
				}
			}else{
				if (val.length>1) {
					for(var i=0;i<val.length;i++) ins+="<div class='answer textType' id='"+d+"'>"+(display_dooit.value[d][a][i]?display_dooit.value[d][a][i]:"")+"</div><div class='label'>"+val[i].title+"</div>";
				}else if (val.length==1) {
					if (val[0].title!=undefined && val[0].title!="") {
						ins+="<div class='answer textType' id='"+d+"'>"+(display_dooit.value[d][a][0]?display_dooit.value[d][a][0]:"")+"</div><div class='label'>"+val[0].title+"</div>";
					}else{
						ins+=(display_dooit.value[d][0]?display_dooit.value[d][a][0]:"");
					}
				}else if(val.length>0) {
					if (val[0].title!=undefined && val[0].title!="") {
						ins+="<div class='answer textType' id='"+d+"'>Nothing selected</div><div class='label' textType'>"+val[0].title+"</div>";
					}else{
						ins="Nothing selected";
					}
				}else{
					//ins="Nothing selected";
				}
			}
			return ins;
		},
		numeric:function(d,val,a) {
			var ins="";
			if (val.length>1) {
				for(var i=0;i<val.length;i++) ins+="<div class='answer numericType' id='"+d+"'>"+(display_dooit.value[d][a][i]?display_dooit.value[d][a][i]:"")+"</div><div class='label'>"+val[i].title+"</div>";
			}else if (val.length==1) {
				if (val[0].title!=undefined && val[0].title!="") {
					ins+="<div class='answer numericType' id='"+d+"'>"+(display_dooit.value[d][a][0]?display_dooit.value[d][a][0]:"")+"</div><div class='label'>"+val[0].title+"</div>";
				}else{
					ins+=(display_dooit.value[d][0]?display_dooit.value[d][a][0]:"");
				}
			}else{
					ins="Nothing selected";
			}
			return ins;
		},
		checkbox:function(d,val,a) {
			var ins="";
			var checks=[];
			for(var i=0;i<val.length;i++) {
				if (display_dooit.value[d][a][i]==1) checks.push(val[i].title);
			}
			if (checks.length>1) {
				ins=" and "+checks.pop();
				ins=checks.join(", ")+ins;
			}else if (checks.length==1) {
				ins=checks[0];
			}else{
				ins="Nothing selected";
			}
			return ins;
		},
		select:function(d,val,a) {
			var checks=[];
			var ins="";
			for(var i=0;i<val.length;i++) {
				if (display_dooit.value[d][a][i]==1) checks.push(val[i].title);
			}
			if (checks.length>1) {
				ins=" and "+checks.pop();
				ins=checks.join(", ")+ins;
			}else if (checks.length==1) {
				ins=checks[0];
			}else{
				ins="Nothing selected";
			}
			return ins;
		},
		buttons:function(d,val,a) {
			var checks=[];
			var ins="";
			for(var i=0;i<val.length;i++) {
				if (display_dooit.value[d][a][i]==1) checks.push(val[i].title);
			}
			if (checks.length>1) {
				ins=" and "+checks.pop();
				ins=checks.join(", ")+ins;
			}else if (checks.length==1) {
				ins=checks[0];
			}else{
				ins="Nothing selected";
			}
			return ins;
		},
		slider:function(d,val,a) {
			var ins='';
			if(display_dooit.value[d][a][0]=="1") {
				ins=val[0].minText;
			}else if(display_dooit.value[d][a][0]==val[0].divisions) {
				ins=val[0].maxText;
			}else{
				var pc=100*(display_dooit.value[d][a][0]-1)/(val[0].divisions-1);
				ins=Math.round(pc)+"%";
			}
			return ins;
		},
		reference:function(d,val,a) {
			var ins='';
			for(var s=0;s<val[0].linked.structure.value.option.length;s++) {
				ins+="<div style='min-width:200px' title='"+val[0].linked.structure.value.option[s].title+"'>"+(display_dooit.value[d][a][s]?display_dooit.value[d][a][s]:((s==0)?"Empty":""))+"</div>";
			}
			return ins;
		},
		date:function(d,val,a) {
			var ins="";
			var idx=display_dooit.question_index(d);
			if (val.length>1) {
				for(var i=0;i<val.length;i++) {
				if (display_dooit.data.structure[idx].value.option[i].format==null || display_dooit.data.structure[idx].value.option[i].format=='') display_dooit.data.structure[idx].value.option[i].format='d/m/Y';
					var op=(display_dooit.value[d][a][i]?inputs.formatDate(display_dooit.data.structure[idx].value.option[i].format,display_dooit.value[d][a][i]):"");
					ins+="<div class='item'><b>"+val[i].title+":</b> "+op+"</div>";
				}
			}else if (val.length==1 && display_dooit.value[d][a][0]!="") {
				if (display_dooit.data.structure[idx].value.option[0].format==null || display_dooit.data.structure[idx].value.option[0].format=='') display_dooit.data.structure[idx].value.option[0].format='d/m/Y';
				ins+=(display_dooit.value[d][a][0]?inputs.formatDate(display_dooit.data.structure[idx].value.option[0].format,display_dooit.value[d][a][0]):"");
			}else{
				ins="Nothing selected";
			}
			return ins;
		}
	},
	type_value:{
		paragraph:function(d,val,a) {
			return '';
		},
		text:function(d,val,a) {
			var ins=[];
			if (val.length>1) {
				for(var i=0;i<val.length;i++) ins.push(display_dooit.value[d][a][i]?display_dooit.value[d][a][i]:"");
			}else if (val.length==1) {
				ins.push(display_dooit.value[d][0]?display_dooit.value[d][a][0]:"");
			}
			return ins;
		},
		numeric:function(d,val,a) {
			var ins=[];
			if (val.length>1) {
				for(var i=0;i<val.length;i++) ins.push(display_dooit.value[d][a][i]?display_dooit.value[d][a][i]:"");
			}else if (val.length==1) {
				ins.push(display_dooit.value[d][0]?display_dooit.value[d][a][0]:"");
			}
			return ins;

		},
		checkbox:function(d,val,a) {
			var checks=[];
			for(var i=0;i<val.length;i++) {
				if (display_dooit.value[d][a][i]==1) checks.push(val[i].title);
			}
			return checks;
		},
		select:function(d,val,a) {
			var checks=[];
			for(var i=0;i<val.length;i++) {
				if (display_dooit.value[d][a][i]==1) checks.push(val[i].title);
			}
			return checks;
		},
		buttons:function(d,val,a) {
			var checks=[];
			for(var i=0;i<val.length;i++) {
				if (display_dooit.value[d][a][i]==1) checks.push(val[i].title);
			}
			return checks;
		},
		slider:function(d,val,a) {

			var ins='';
			if(display_dooit.value[d][a][0]=="1") {
				ins=val[0].minText;
			}else if(display_dooit.value[d][a][0]==val[0].divisions) {
				ins=val[0].maxText;
			}else{
				var pc=100*(display_dooit.value[d][a][0]-1)/(val[0].divisions-1);
				ins=Math.round(pc)+"%";
			}
			return [ins];
		},
		reference:function(d,val,a) {
			var ins=[];
			for(var s=0;s<val[0].linked.structure.value.option.length;s++) {
				ins.push(display_dooit.value[d][a][s]?display_dooit.value[d][a][s]:((s==0)?"Empty":""));
			}
			return ins;
		},
		date:function(d,val,a) {
			var ins=[];
			var idx=display_dooit.question_index(d);
			if (val.length>1) {
				for(var i=0;i<val.length;i++) {
				if (display_dooit.data.structure[idx].value.option[i].format==null || display_dooit.data.structure[idx].value.option[i].format=='') display_dooit.data.structure[idx].value.option[i].format='d/m/Y';
					var op=(display_dooit.value[d][a][i]?inputs.formatDate(display_dooit.data.structure[idx].value.option[i].format,display_dooit.value[d][a][i]):"");
					ins.push(op);
				}
			}else if (val.length==1 && display_dooit.value[d][a][0]!="") {
				if (display_dooit.data.structure[idx].value.option[0].format==null || display_dooit.data.structure[idx].value.option[0].format=='') display_dooit.data.structure[idx].value.option[0].format='d/m/Y';
				ins.push((display_dooit.value[d][a][0]?inputs.formatDate(display_dooit.data.structure[idx].value.option[0].format,display_dooit.value[d][a][0]):""));
			}
			return ins;
		}
	},
	exporterFetched:false,
	fetchExporterComplete:null,
	fetchExporter:function() {
		if(arguments.length>0) this.fetchExporterComplete=arguments[0];
		if (!this.exporterFetched) {
			var newscript=document.createElement("SCRIPT");
			newscript.src=dooit.fileUrl+"dooits/jquery_dataTables_min.js";
			var head=$("head").get(0);
			head.appendChild(newscript);
			setTimeout("display_dooit.fetchExporter()",200);
			this.exporterFetched=true;
		}else{
			if(typeof(jqueryDataTablesLoaded)!="undefined") {
				this.exportable=true;
				setTimeout(this.fetchExporterComplete,20);
			}else{
				setTimeout("display_dooit.fetchExporter()",200);
			}
		}
	},
	exportable:false,
	xport:function() {
		var op=[];
		var d=0;
		var minColumns=3;
		while(d<display_dooit.data.structure.length) {
			var indexes=[d++];
			while(d<display_dooit.data.structure.length && display_dooit.data.structure[d].value.grouped=="1") indexes.push(d++);
			var row=display_dooit.field_xport_container(indexes);
			for(var r=0;r<row.length;r++) {
				while(row[r].length<minColumns) row[r].push('');
				op.push(row[r]);
			}
		}
		var rows=[];
		for(var r=0;r<op.length;r++) {
			var cells=[];
			for(var c=0;c<op[r].length;c++) {
				cells.push('"'+op[r][c].replace(/"/g,'\\"')+'"');
			}
			rows.push(cells.join(","));
		}
		var file=rows.join("\r\n");
		if(typeof(yoodoo)!="undefined") {
			var fn=yoodoo.dooittitle.replace(/\W+/g,'')+".csv";
			yoodoo.getCSV('Your exported report','Your exported report should start downloading',fn,file);
		}
	},
	xportxls:function() {
		var op=[];
		var d=0;
		var minColumns=3;
		while(d<display_dooit.data.structure.length) {
			var indexes=[d++];
			while(d<display_dooit.data.structure.length && display_dooit.data.structure[d].value.grouped=="1") indexes.push(d++);
			var row=display_dooit.field_xport_container(indexes,true);
			for(var r=0;r<row.length;r++) {
				while(row[r].length<minColumns) row[r].push('');
				op.push(row[r]);
			}
		}
		var rows=[];
		for(var r=0;r<op.length;r++) {
			var cells=[];
			for(var c=0;c<op[r].length;c++) {
				cells.push(op[r][c]);
			}
			rows.push('<tr>'+cells.join("")+'</tr>');
		}

		var fn=yoodoo.dooittitle.replace(/\W+/g,'')+".xls";
		var file='<table>'+rows.join('')+'</table>';
		yoodoo.getXLS('Your exported report','Your exported report should start downloading',fn,file);
	},
	xportStyle:function(type,part,value,styled) {
		if (!styled) {
			value=value.replace(/<[^>]+>/g,'').replace(/\"/g,'\\"');
		}else{
			var style='';
			if (typeof(this.exportStyles[type])!="undefined" && typeof(this.exportStyles[type].all)!="undefined") {
				style=this.exportStyles[type].all;
			}else{
				style=this.exportStyles.defaults.all;
			}
			if (typeof(this.exportStyles[type])!="undefined" && typeof(this.exportStyles[type][part])!="undefined") {
				style+=this.exportStyles[type][part];
			}else{
				style+=this.exportStyles.defaults[part];
			}
			value="<td"+((style!='')?" style='"+style+"'":"")+">"+((value=='untitled')?'':value)+"</td>";		
		}
		return value;
	},
	field_xport_container:function(d) {
		var ins='';
		var styled=false;
		if (arguments.length>1) styled=arguments[1];
		var multy=(this.data.structure[d[0]].value.multiple=="1");
		var maxAnswers=this.value[this.data.structure[d[0]].id].length;
		if (!multy) maxAnswers=1;
		var op=[];
		for(var a=0;a<maxAnswers;a++) {
			for(var di=0;di<d.length;di++) {
				if(this.data.structure[d[di]].value.type=="paragraph") {
					op.push([this.xportStyle(this.data.structure[d[di]].value.type,'paragraph',this.data.structure[d[di]].title,styled)]);
				}else{
					if (this.data.structure[d[di]].value.option.length>0) {
						var tmp=this.xport_type[this.data.structure[d[di]].value.type](this.data.structure[d[di]].id,this.data.structure[d[di]].value.option,a,styled,d[di]);
						for(var t=0;t<tmp.length;t++) {
							if(tmp[t][0]=="untitled") tmp[t][0]='';
							if(tmp[t][0]=='' && this.data.structure[d[di]].title!="") tmp[t][0]=this.data.structure[d[di]].title;
							if (!styled) for(var i=0;i<tmp[t].length;i++) tmp[t][i]=tmp[t][i].replace(/\"/g,'\\"').replace(/<[^>]+>/g,'');
							if (multy && di==0) {
								if(typeof(this.data.structure[d[0]].paragraph)!="undefined" && this.data.structure[d[0]].paragraph!="") {
									if (!styled) {
										tmp[t].splice(0,0,this.data.structure[d[0]].paragraph.replace(/<[^>]+>/g,'').replace(/\"/g,'\\"'));
									}else{
										tmp[t].splice(0,0,this.xportStyle(this.data.structure[d[di]].value.type,'paragraph',this.data.structure[d[0]].paragraph,styled));
									}
								}else if (typeof(this.data.structure[d[0]].title)!="undefined" && this.data.structure[d[0]].title!="") {
									if (!styled) {
										tmp[t].splice(0,0,this.data.structure[d[0]].title.replace(/\"/g,'\\"'));
									}else{
										tmp[t].splice(0,0,this.xportStyle(this.data.structure[d[di]].value.type,'title',this.data.structure[d[0]].title,styled));
									}
								}
							}else if(multy) {
								tmp[t].splice(0,0,styled?'<td></td>':'');
							}else if(typeof(this.data.structure[d[0]].paragraph)!="undefined" && this.data.structure[d[0]].paragraph!="") {
								
					op.push([this.xportStyle(this.data.structure[d[di]].value.type,'paragraph',this.data.structure[d[di]].paragraph,styled)]);
							}
							op.push(tmp[t]);
						}
					}else{
						if(typeof(this.data.structure[d[0]].paragraph)!="undefined" && this.data.structure[d[0]].paragraph!="") {
							op.push([this.xportStyle(this.data.structure[d[0]].value.type,'paragraph',this.data.structure[d[0]].paragraph,styled)]);
						}else if(typeof(this.data.structure[d[0]].title)!="undefined" && this.data.structure[d[0]].title!="") {
							op.push([this.xportStyle(this.data.structure[d[0]].value.type,'title',this.data.structure[d[0]].title,styled)]);
						}
					}
				}
			}
		}
		return op;
	},
	xport_type:{
		paragraph:function(d,val,a) {
			return [];
		},
		text:function(d,val,a,styled,i) {
			var reply=[];
			var title=display_dooit.data.structure[i].title;
			if (title=='') title='untitled';
			if (val.length>1) {
				for(var i=0;i<val.length;i++) {
					var title=val[i].title;
					if (title=='') title='untitled';
					var tit=display_dooit.xportStyle('text','title',title,styled);
					var v=display_dooit.xportStyle('text','value',(display_dooit.value[d][a][i]?display_dooit.value[d][a][i]:""),styled);
					reply.push([tit,v]);
				}
			}else if (val.length==1) {
				var tit=display_dooit.xportStyle('text','title',title,styled);
				var v=display_dooit.xportStyle('text','value',(display_dooit.value[d][a][0]?display_dooit.value[d][a][0]:""),styled);
				reply.push([tit,v]);
			}else{
				var tit=display_dooit.xportStyle('text','title',title,styled);
				var v=display_dooit.xportStyle('text','value','Nothing selected',styled);
				reply.push([tit,v]);
			}
			return reply;
		},
		numeric:function(d,val,a,styled,i) {
			var title=display_dooit.data.structure[i].title;
			if (title=='') title='untitled';
			var reply=[];
			if (val.length>1) {
				for(var i=0;i<val.length;i++) {
					var tit=display_dooit.xportStyle('text','title',title,styled);
					var v=display_dooit.xportStyle('text','value',(display_dooit.value[d][a][i]?display_dooit.value[d][a][i]:""),styled);
					reply.push([tit,v]);
				}
			}else if (val.length==1) {
				var tit=display_dooit.xportStyle('text','title',title,styled);
				var v=display_dooit.xportStyle('text','value',(display_dooit.value[d][a][0]?display_dooit.value[d][a][0]:""),styled);
				reply.push([tit,v]);
			}else{
				var tit=display_dooit.xportStyle('text','title',title,styled);
				var v=display_dooit.xportStyle('text','value','Nothing selected',styled);
				reply.push([tit,v]);
			}
			return reply;
		},
		checkbox:function(d,val,a,styled,i) {
			var title=display_dooit.data.structure[i].title;
			if (title=='') title='untitled';
			var reply=[];
			var checks=[];
			for(var i=0;i<val.length;i++) {
				if (display_dooit.value[d][a][i]==1) checks.push(val[i].title);
			}
			if (checks.length>1) {
				var ins=" and "+checks.pop();
				ins=checks.join(", ")+ins;
				var v=display_dooit.xportStyle('checkbox','value',ins,styled);
				var tit=display_dooit.xportStyle('checkbox','title',title,styled);
				reply.push([tit,v]);
			}else if (checks.length==1) {
				var v=display_dooit.xportStyle('checkbox','value',checks[0],styled);
				var tit=display_dooit.xportStyle('checkbox','title',title,styled);
				reply.push([tit,v]);
			}else{
				var v=display_dooit.xportStyle('checkbox','value','Nothing selected',styled);
				var tit=display_dooit.xportStyle('checkbox','title',title,styled);
				reply.push([tit,v]);
			}
			return reply;
		},
		select:function(d,val,a,styled,i) {
			var title=display_dooit.data.structure[i].title;
			if (title=='') title='untitled';
			var reply=[];
			var checks=[];
			for(var i=0;i<val.length;i++) {
				if (display_dooit.value[d][a][i]==1) checks.push(val[i].title);
			}
			if (checks.length>1) {
				var ins=" and "+checks.pop();
				ins=checks.join(", ")+ins;
				var v=display_dooit.xportStyle('select','value',ins,styled);
				var tit=display_dooit.xportStyle('select','title',title,styled);
				reply.push([tit,v]);
			}else if (checks.length==1) {
				var v=display_dooit.xportStyle('select','value',checks[0],styled);
				var tit=display_dooit.xportStyle('select','title',title,styled);
				reply.push([tit,v]);
			}else{
				var v=display_dooit.xportStyle('select','value','Nothing selected',styled);
				var tit=display_dooit.xportStyle('select','title',title,styled);
				reply.push([tit,v]);
			}
			return reply;
		},
		buttons:function(d,val,a,styled,i) {
			var title=display_dooit.data.structure[i].title;
			if (title=='') title='untitled';
			var reply=[];
			var checks=[];
			for(var i=0;i<val.length;i++) {
				if (display_dooit.value[d][a][i]==1) checks.push(val[i].title);
			}
			if (checks.length>1) {
				var ins=" and "+checks.pop();
				ins=checks.join(", ")+ins;
				var v=display_dooit.xportStyle('select','value',ins,styled);
				var tit=display_dooit.xportStyle('select','title',title,styled);
				reply.push([tit,v]);
			}else if (checks.length==1) {
				var v=display_dooit.xportStyle('select','value',checks[0],styled);
				var tit=display_dooit.xportStyle('select','title',title,styled);
				reply.push([tit,v]);
			}else{
				var v=display_dooit.xportStyle('select','value','Nothing selected',styled);
				var tit=display_dooit.xportStyle('select','title',title,styled);
				reply.push([tit,v]);
			}
			return reply;
		},
		slider:function(d,val,a,styled,i) {
			var title=display_dooit.data.structure[i].title;
			if (title=='') title='untitled';
			var ins='';
			if(display_dooit.value[d][a][0]=="1") {
				ins=val[0].minText;
			}else if(display_dooit.value[d][a][0]==val[0].divisions) {
				ins=val[0].maxText;
			}else{
				var pc=100*(display_dooit.value[d][a][0]-1)/(val[0].divisions-1);
				ins=Math.round(pc)+"%";
			}
			var v=display_dooit.xportStyle('slider','value',ins,styled);
			var tit=display_dooit.xportStyle('slider','title',title,styled);
			return [[tit,v]];
		},
		reference:function(d,val,a,styled,i) {
			var title=display_dooit.data.structure[i].title;
			var ins=[display_dooit.xportStyle('reference','title',title,styled)];
			
			for(var s=0;s<val[0].linked.structure.value.option.length;s++) {
				ins.push(display_dooit.xportStyle(val[0].linked.structure.type,'value',display_dooit.value[d][a][s]?display_dooit.value[d][a][s]:((s==0)?"Empty":""),styled));
			}
			return [ins];
		},
		date:function(d,val,a,styled,i) {
			var title=display_dooit.data.structure[i].title;
			if (title=='') title='untitled';
			var reply=[];
			var idx=display_dooit.question_index(d);
			if (val.length>1) {
				for(var i=0;i<val.length;i++) {
					if (display_dooit.data.structure[idx].value.option[i].format==null || display_dooit.data.structure[idx].value.option[i].format=='') display_dooit.data.structure[idx].value.option[i].format='d/m/Y';
					var op=(display_dooit.value[d][a][i]?inputs.formatDate(display_dooit.data.structure[idx].value.option[i].format,display_dooit.value[d][a][i]):"");
					var v=display_dooit.xportStyle('date','value',op,styled);
					var tit=display_dooit.xportStyle('date','title',title,styled);
					reply.push([tit,v]);
				}
			}else if (val.length==1 && display_dooit.value[d][a][0]!="") {
				if (display_dooit.data.structure[idx].value.option[0].format==null || display_dooit.data.structure[idx].value.option[0].format=='') display_dooit.data.structure[idx].value.option[0].format='d/m/Y';
				var op=(display_dooit.value[d][a][0]?inputs.formatDate(display_dooit.data.structure[idx].value.option[0].format,display_dooit.value[d][a][0]):"");
					var v=display_dooit.xportStyle('date','value',op,styled);
					var tit=display_dooit.xportStyle('date','title',title,styled);
					reply.push([tit,v]);
			}else{
				var v=display_dooit.xportStyle('date','value',"Nothing selected",styled);
				var tit=display_dooit.xportStyle('date','title',title,styled);
				reply.push([tit,v]);
			}
			return reply;
		}
	},
	toggle:function() {
		this.reporting=!this.reporting;
		this.render();
		if (!this.reporting) this.score_system.init();
		this.post_score_render();
	},
	render:function() {
		var forPrinter=false;
		var opa=[];
		if (arguments.length>0) forPrinter=arguments[0];
		if(this.titleOverride!=undefined && this.titleOverride!=null && this.titleOverride!='') this.data.dooit.title=this.titleOverride;
		var op='<h2>'+this.data.dooit.title+'&nbsp;</h2>';
		opa.push('<h2>'+this.data.dooit.title+'</h2>');
		if (this.data.dooit.subheading!="") {
			op+='<h3>'+this.data.dooit.subheading+'&nbsp;</h3>';
			opa.push('<h3>'+this.data.dooit.subheading+'</h3>');
		}
		if (!this.data.dooit.serialize) op+="<button type='button' class='button toggle green' onclick='"+(this.reporting?'display_dooit.output();':'')+"display_dooit.toggle();'>"+(this.reporting?'edit':'report')+"</button>";
		if (this.reporting) {
			op+="<div class='result_report fields'>";
		}else{
			op+="<div class='result_report'></div>";
			op+="<div class='fields'>";	
		}
		if (typeof(this.data.structure)!="undefined" && this.data.structure.length>0) {
			if (this.reporting && this.customReporter!=null) {
				op+=this.customReporter();
			}else{
				var d=0;
				while(d<this.data.structure.length) {
					var indexes=[d++];
					while(d<this.data.structure.length && this.data.structure[d].value.grouped=="1") indexes.push(d++);
					if (this.reporting) {
						var r=this.field_report_container(indexes,false,forPrinter);
						op+=r;
						opa.push(r);
					}else{
						op+=this.field_container(indexes);
					}
				}
			}
		}else{
			op+="No questions defined";
		}
		op+="</div>";
		if (forPrinter) return opa;
		if (this.reporting) {
			op+="<div class='fields'></div>";	
		}
		$(this.container).html(op);
		this.post_render(this.container);
		if (this.reporting) {
			var h=$('#yoodooScrolledArea').height()-$(this.container).find('.result_report').offset().top;
			$(this.container).find('.result_report').css('height',h+"px");
			$(this.container).find('.result_report').css('overflow',"auto");
		}
	},
	post_render:function(e) {
		var opts={oncheck:display_dooit.set_checkbox,onuncheck:display_dooit.set_checkbox};
		inputs.radioCheckbox($(e).find("input[type=checkbox]").get(),opts);
		inputs.dropdown($(e).find('select').get(),{dropdownX:2,dropdownY:2,autofit:true,widthExtension:18,onSelect:display_dooit.set_select});
		var opts={};
		var dates=$(e).find("input[type=text].date").get();
		for(var d=0;d<dates.length;d++) {
			var pos=this.input_location(dates[d]);
			var format='';
			if (typeof(this.data.structure[this.question_index(pos.key)].value.option[pos.field].format)!="undefined") {
				format=this.data.structure[this.question_index(pos.key)].value.option[pos.field].format;
			}
			opts.formatdisplay=format;
			opts.selected=function(ip,dt,fd) {
				var pos=display_dooit.input_location(ip);
				display_dooit.value[pos.key][pos.answer][pos.field]=dt;
			};
			inputs.date([dates[d]],opts);
		}
	},
	post_score_render:function() {
		var obj=this.container;
		if (arguments.length>0) obj=arguments[0];
		this.layout_buttons(obj);
	},
	input_location:function(o) {
		var f=$(this.predecessor(o,'item')).prevAll(".item").get().length;
		var a=$(this.predecessor(o,'answers')).prevAll(".answers").get().length;
		var k=this.predecessor(o,'answer').id;
		return {field:f,key:k,answer:a};
	},
	set_checkbox:function(o) {
		var where=display_dooit.input_location(o);
		display_dooit.value[where.key][where.answer][where.field]=o.checked?'1':'0';
		display_dooit.score_system.update();
	},
	field_report_container:function(d) {
		var as_element=false;
		var forPrinter=false;
		if (arguments.length>1) as_element=arguments[1];
		if (arguments.length>2) forPrinter=arguments[2];
//if(forPrinter) return "For Printer";
		var ins="";
		if(this.data.structure[d[0]].value.type!='paragraph' && !forPrinter) ins+="<div class='question'>";
		//if (this.data.structure[d[0]].paragraph=="<br>") this.data.structure[d[0]].paragraph='';
		if(typeof(this.data.structure[d[0]].paragraph)!="undefined" && this.data.structure[d[0]].paragraph!="") {
			if (/^<p/.test(this.data.structure[d[0]].paragraph)) {
				ins+=this.data.structure[d[0]].paragraph;
			}else{
				ins+='<p>'+this.data.structure[d[0]].paragraph+'</p>';
			}
		}
		var multy=(this.data.structure[d[0]].value.multiple=="1");
		var maxAnswers=this.value[this.data.structure[d[0]].id].length;
		if (!multy) maxAnswers=1;
		for(var a=0;a<maxAnswers;a++) {
			if (!forPrinter) ins+="<div class='answers'>";
				for(var di=0;di<d.length;di++) {
					ins+=this.field_report_answer(d[di],a,false,forPrinter);
				}
			if (!forPrinter) ins+="</div>";
		}
		if (!forPrinter) ins+="<div class='clear'></div>";
		if(this.data.structure[d[0]].value.type!='paragraph' && !forPrinter) ins+="</div>";
		return ins;
	},
	field_container:function(d) {
		var as_element=false;
		if (arguments.length>1) as_element=arguments[1];
		var ins="";
		if(this.data.structure[d[0]].value.type!='paragraph') {
			ins+="<div class='question'>";
			var showPara=(typeof(this.data.structure[d[0]].paragraph)!="undefined" && this.data.structure[d[0]].paragraph!="" );
			if (/^<[^>]+>$/.test(this.data.structure[d[0]].paragraph)) showPara=false;
			if(showPara) ins+=this.data.structure[d[0]].paragraph;
		}
		if(this.data.structure[d[0]].value.type!='paragraph') {
			var multy=(this.data.structure[d[0]].value.multiple=="1");
			var maxAnswers=this.value[this.data.structure[d[0]].id].length;
			if (!multy) maxAnswers=1;
			for(var a=0;a<maxAnswers;a++) {
				ins+="<div class='answers'>";
				if (multy) ins+="<button type='button' class='remove' onclick='display_dooit.remove_answer(this,"+d[0]+")'>remove</button>";
				for(var di=0;di<d.length;di++) {
					ins+=this.field_answer(d[di],a);
				}
				ins+="</div>";
			}
		}else{
			ins+="<div class='answers'>"+((typeof(this.data.structure[d[0]].paragraph)!="undefined" && this.data.structure[d[0]].paragraph!="")?this.data.structure[d[0]].paragraph:this.data.structure[d[0]].title)+"</div>";
		}
		ins+="<div class='clear'></div>";
		if (multy) ins+="<button type='button' class='add' onclick='display_dooit.add_answer(this,"+d[0]+");'>add</button>";
		if(this.data.structure[d[0]].value.type!='paragraph') ins+="</div>";
		return ins;
	},
	field_answer:function(d,a) {
		var asElement=false;
		if(arguments.length>2) asElement=arguments[2];
		var head=false;
		if (d+1<this.data.structure.length && this.data.structure[d].value.grouped!="1" && this.data.structure[d+1].value.grouped=="1") head=true;
		var ins='';
		if(!asElement) ins+="<div class='answer_item'>";
		var showBlockTitle=(head && (this.data.structure[d].paragraph==undefined || this.data.structure[d].paragraph=="" || this.data.structure[d].paragraph=="<br>") && this.data.structure[d].title!='');
		//var hideFirstTitle=head;
		/*var tit=(this.data.structure[d].title=='' && this.data.structure[d].paragraph!=undefined && this.data.structure[d].paragraph!="" && this.data.structure[d].paragraph!="<br>")?'':this.data.structure[d].title;
		if (head && this.data.structure[d].paragraph!=undefined && this.data.structure[d].paragraph!='' && this.data.structure[d].title!=undefined && this.data.structure[d].title!='' && this.data.structure[d].paragraph!="<br>") {
			hideFirstTitle=false;
		}*/
		if (showBlockTitle || this.data.dooit.serialize) ins+="<div class='label'>"+this.data.structure[d].title+"</div>";
		
		var addItemDiv=head || (this.data.structure[d].value.grouped=="1" && (this.data.structure[d].value.type!="text" || this.data.structure[d].value.type!="date"));
		/*addItemDiv=head || (this.data.structure[d].value.grouped=="1" && this.data.structure[d].paragraph!=undefined && this.data.structure[d].paragraph!='' && this.data.structure[d].title!=undefined && this.data.structure[d].title!='');
		if (head && this.data.structure[d].value.multiple!="1") addItemDiv=false;
		var tit=(this.data.structure[d].title=='' && this.data.structure[d].paragraph!=undefined && this.data.structure[d].paragraph!="" && this.data.structure[d].paragraph!="<br>")?'':this.data.structure[d].title;
		if (this.data.structure[d].title!=undefined && this.data.structure[d].title!="" && this.data.structure[d].paragraph!=undefined && this.data.structure[d].paragraph!="" && this.data.structure[d].paragraph!="<br>") ins+="<div class='label'>"+this.data.structure[d].paragraph+"</div>";
		if ((this.data.structure[d].value.grouped!="1"  && !addItemDiv && tit!="") || this.data.dooit.serialize) ins+="<div class='label'>"+tit+"</div>";*/
		if (this.data.structure[d].value.option.length>0) {
			ins+="<div class='answer "+this.data.structure[d].value.type+"Type' id='"+this.data.structure[d].id+"'>";
	

			if (!this.data.dooit.serialize && addItemDiv && !showBlockTitle && this.data.structure[d].title!='') {
				if (!head && this.data.structure[d].paragraph!=undefined && this.data.structure[d].paragraph!="" && this.data.structure[d].paragraph!="<br>") ins+=this.data.structure[d].paragraph;
				ins+="<div class='item'><span class='label'>"+this.data.structure[d].title+"</span>";
				ins+=this.type_output[this.data.structure[d].value.type](this.data.structure[d].id,this.data.structure[d].value,a);
				ins+="</div>";
			}else{
				ins+="<div class='item'>"+this.type_output[this.data.structure[d].value.type](this.data.structure[d].id,this.data.structure[d].value,a)+"</div>";
			}
			//if (!this.data.dooit.serialize && addItemDiv && !hideFirstTitle && this.data.structure[d].title!='') ins+="</div>";
			ins+="</div>";
		}
		ins+="<div style='clear:both'></div>";
		if(!asElement) ins+="</div>";
		if(asElement) {
			var e=document.createElement("DIV");
			$(e).addClass('answer_item');
			$(e).html(ins);
			return e;
		}
		return ins;
	},
	field_report_answer:function(d,a) {
		var asElement=false;
		if(arguments.length>2) asElement=arguments[2];
		var forPrinter=false;
		if(arguments.length>3) forPrinter=arguments[3];
		var ins='';
		if (!forPrinter) {
			if(!asElement) ins+="<div class='answer_item'>";
			if(this.data.structure[d].value.type=="text" || this.data.structure[d].value.type=="numeric") {
				if (this.data.structure[d].title!="") ins+="<div class='label'>"+this.data.structure[d].title+"</div>";
				ins+=this.type_report[this.data.structure[d].value.type](this.data.structure[d].id,this.data.structure[d].value.option,a);
				
			}else{
				ins+="<div class='answer "+this.data.structure[d].value.type+"Type' id='"+this.data.structure[d].id+"'>";
				ins+=this.type_report[this.data.structure[d].value.type](this.data.structure[d].id,this.data.structure[d].value.option,a);
				ins+="</div>";
				if (this.data.structure[d].title!="") {
					ins+="<div class='label'>"+this.data.structure[d].title+"</div>";
				}
			}
			if(!forPrinter) ins+="<div style='clear:both'></div>";
			if(!asElement) ins+="</div>";
		}else{
			if (this.data.structure[d].value.type=="text" || this.data.structure[d].value.type=="numeric") {
				ins+=this.type_report[this.data.structure[d].value.type](this.data.structure[d].id,this.data.structure[d].value.option,a,true);
			}else{
				if (this.data.structure[d].title!="") ins+="<p class='label'>"+this.data.structure[d].title+"</p>";
				ins+='<p class="answer">'+this.type_report[this.data.structure[d].value.type](this.data.structure[d].id,this.data.structure[d].value.option,a,true)+'</p>';
			}
			ins=ins.replace(/<div/g,'<div').replace(/<\/div>/g,'</div>');
		}
		if(asElement) {
			var e=document.createElement("DIV");
			$(e).addClass('answer_item');
			$(e).html(ins);
			return e;
		}
		return ins;
	},
	remove_answer:function(o,i) {
		var d=[i];
		var a=i+1;
		while(a<this.data.structure.length && this.data.structure[a].value.grouped=='1') {
			d.push(a++);
		}
		var ans=$(o.parentNode).prevAll(".answers").get().length;
		for(var di=0;di<d.length;di++) {
			this.value[this.data.structure[d[di]].id].splice(ans,1);
		}
		$(o.parentNode).slideUp(function() {$(this).remove();});
	},
	add_answer:function(o,i) {
		var d=[i];
		var a=i+1;
		while(a<this.data.structure.length && this.data.structure[a].value.grouped=='1') {
			d.push(a++);
		}
		for(var di=0;di<d.length;di++) {
			this.value[this.data.structure[d[di]].id].push([]);
		}
		this.check_defaults();
		var multy=(this.data.structure[i].value.multiple=="1");
		var answers=$(o.parentNode).find('.answers').get();
		var afterAnswers=$(o).prev('div.clear').get(0);
		if (answers.length>0) afterAnswers=$(answers[answers.length-1]).next('div.clear').get(0);
		var cont=document.createElement("DIV");
		$(cont).css("display","none");
		$(cont).addClass("answers");
		$(cont).html("<button type='button' class='remove' onclick='display_dooit.remove_answer(this,"+i+")'>remove</button>");
		for(var di=0;di<d.length;di++) {
			cont.appendChild(this.field_answer(d[di],this.value[this.data.structure[d[di]].id].length-1,true));
		}
		o.parentNode.insertBefore(cont,afterAnswers);
		$(cont).slideDown(function(){
			display_dooit.post_render(this);
			display_dooit.post_score_render(this);
		});
	},
	completed:{
		paragraph:function() {
			return true;
		},
		text:function(q) {
			if (display_dooit.data.structure[q].required!="1") return true;
			var id=display_dooit.data.structure[q].id;
			for(var j=0;j<display_dooit.data.structure[q].value.option.length;j++) {
				if (typeof(display_dooit.value[id][j])=="object") {
					for(var l=0;l<display_dooit.value[id][j].length;l++) {
						if (display_dooit.value[id][j][l]=='') return false;
					}
				}else{
					if (display_dooit.value[id][j]=='') return false;
				}
			}
			return true;
		},
		numeric:function(q) {
			if (display_dooit.data.structure[q].required!="1") return true;
			var id=display_dooit.data.structure[q].id;
			for(var j=0;j<display_dooit.data.structure[q].value.option.length;j++) {
				if (typeof(display_dooit.value[id][j])=="object") {
					for(var l=0;l<display_dooit.value[id][j].length;l++) {
						if (display_dooit.value[id][j][l]=='') return false;
					}
				}else{
					if (display_dooit.value[id][j]=='') return false;
				}
			}
			return true;
		},
		checkbox:function(q) {
			if (display_dooit.data.structure[q].value.required!="1") return true;
			var id=display_dooit.data.structure[q].id;
			var checked=false;
			for(var j=0;j<display_dooit.data.structure[q].value.option.length;j++) {
				if (typeof(display_dooit.value[id][j])=="object") {
					var thisChecked=false;
					for(var l=0;l<display_dooit.value[id][j].length;l++) {
						if (display_dooit.value[id][j][l]=='1') thisChecked=true;
					}
					if (thisChecked) checked=true;
				}else{
					if (display_dooit.value[id][j]=='1') checked=true;
				}
			}
			if (!checked) ok=false;
			return ok;
		},
		select:function(q) {
			if (display_dooit.data.structure[q].value.required!="1") return true;
			var id=display_dooit.data.structure[q].id;
			var checked=false;
			for(var j=0;j<display_dooit.data.structure[q].value.option.length;j++) {
				if (typeof(display_dooit.value[id][j])=="object") {
					var thisChecked=false;
					for(var l=0;l<display_dooit.value[id][j].length;l++) {
						if (display_dooit.value[id][j][l]=='1') thisChecked=true;
					}
					if (thisChecked) checked=true;
				}else{
					if (display_dooit.value[id][j]=='1') checked=true;
				}
			}
			if (!checked) ok=false;
			return ok;
		},
		buttons:function(q) {
			var qq=q*1;
			while(qq>0 && display_dooit.data.structure[qq].value.grouped=="1") {
				qq--;
			}
//console.log(display_dooit.data.structure[qq].required,qq);
			if (display_dooit.data.structure[qq].required!="1") return true;
			var ok=true;
			//qq=q;
			//while(qq==q || (qq<display_dooit.data.structure.length-1 && display_dooit.data.structure[qq].value.grouped=="1")) {
				var id=display_dooit.data.structure[q].id;
				var checked=false;
				for(var j=0;j<display_dooit.data.structure[q].value.option.length;j++) {
					if (typeof(display_dooit.value[id][j])=="object") {
						var thisChecked=false;
						for(var l=0;l<display_dooit.value[id][j].length;l++) {
							if (display_dooit.value[id][j][l]=='1') thisChecked=true;
						}
						if (thisChecked) checked=true;
					}else{
						if (display_dooit.value[id][j]=='1') checked=true;
					}
				}
//console.log(id,display_dooit.value[id],checked);
				if (!checked) ok=false;
				//qq++;
			//}
//console.log('Required',id,display_dooit.value[id],ok);
			return ok;
		}
	},
	finishable:function() {
		var ok=true;
		for(var i=0;i<this.data.structure.length;i++) {
			if(typeof(this.completed[this.data.structure[i].value.type])!="undefined") {
				if(!this.completed[this.data.structure[i].value.type](i)) ok=false;
			}
		}
		if(this.data.dooit.seialized && !this.data.dooit.redoable) {
			ok=this.questionDisplayed==$(this.container).find('.fields .question').get().length;
		}
		return ok;
	},
	output:function() {
		var op=(dooit.json(this.value));
		array_of_fields[this.key][1]=op;
		if(this.adminClear) op='';
		var reply={};
		eval('reply.EF'+array_of_fields[this.key][0]+'=op;');
		return reply;
	},
	json:function(o) {
		if (typeof(o)=="string" || typeof(o)=="number") {
			return '"'+this.encode(''+o)+'"';
		}else if (typeof(o.getFullYear)!="undefined") {
			return 'new Date('+o.getFullYear()+','+o.getMonth()+','+o.getDate()+')';
		}else{
			var keyed=false;
			for(var k in o) {
				if (isNaN(k)) keyed=true;
			}
			var col=[];
			if (keyed) {
				for(var k in o) {
					col.push(k+':'+this.json(o[k]));
				}
			}else{
				for(var k in o) {
					col.push(this.json(o[k]));
				}
			}
			var op=col.join(",");
			if (keyed) {
				op='{'+op+'}';
			}else{
				op='['+op+']';
			}
			return op;
		}
	},
	encode:function(ip) {
		ip=ip.replace(/'/g,'&sq;');
		ip=ip.replace(/"/g,'&dq;');
		return ip;
	},
	decode:function(ip) {
		ip=ip.replace(/&sq;/g,"'");
		ip=ip.replace(/&dq;/g,'\\"');
		return ip;
	},
	predecessor:function(child,classCheck) {
		var found=null;
		var type='';
		while(type!='FORM' && found===null) {
			child=child.parentNode;
			if ($(child).hasClass(classCheck)) found=child;
			type=child.tagName;
		}
		return found;
	},
	multipliable:function(i) {
		var top=this.top_question(i);
		return (this.data.structure[top].value.multiple=="1");
	},
	top_question:function(i) {
		if(this.data.structure[i].value.grouped=="1") i=this.top_question(i-1);
		return i;
	},
	scoring:{
		none:{
			title:'No scoring',
			range:[],
			display:false,
			init:function(){},
			update:function(){}
		},
		rag_balloons:{
			title:'Red Amber Green Balloons',
			range:['red','amber','green'],
			display:true,
			frame:null,
			scores:{'red':0,'amber':0,'green':0},
			sky:{
				position:0,
				max_position:485
			},
			balloons:{
				red:{
					left:10,
					height:100,
					element:null,
					velocity:0,
					dv:180,
					friction:0.97
				},
				amber:{
					left:50,
					height:100,
					element:null,
					velocity:0,
					dv:190,
					friction:0.98
				},
				green:{
					left:90,
					height:100,
					element:null,
					velocity:0,
					dv:200,
					friction:0.99
				}
			},
			answered:0,
			top_height:0,
			init:function(){
				var h=h=$('#yoodooScrolledArea').height()-($(display_dooit.container).find('.result_report').offset().top-$(display_dooit.container).offset().top)-10;
				$(display_dooit.container).find('.fields').css('height',h+"px");
				this.frame=document.createElement("DIV");
				var w=150;
				$(this.frame).css('float','right');
				$(this.frame).css('width',w+'px');
				$(this.frame).addClass('rag_balloons');
				var fields=$(display_dooit.container).find('.fields').get(0);
				var rr=$(display_dooit.container).find('.result_report').get(0);
				$(this.frame).css('height',$(fields).height()+'px');
				this.top_height=$(fields).height()-100;
				$(fields).css('overflow','auto');
				fields.parentNode.insertBefore(this.frame,rr);
				for(var k in this.balloons) {
					this.balloons[k].element=document.createElement("DIV");
					$(this.balloons[k].element).addClass(k);
					$(this.balloons[k].element).css("bottom",this.balloons[k].height+"px");
					$(this.balloons[k].element).css("left",this.balloons[k].left+"px");
					this.frame.appendChild(this.balloons[k].element);
				}
				this.update();
				this.process();
			},
			update:function() {
				this.scores={'red':0,'amber':0,'green':0};
				var quantity=0;
				for(var q=0;q<display_dooit.data.structure.length;q++) {
					if(typeof(display_dooit.value[display_dooit.data.structure[q].id])!="undefined") {
						var answers=1;
						if (display_dooit.multipliable(q)) answers=display_dooit.value[display_dooit.data.structure[q].id].length;
						for(var a=0;a<answers;a++) {
							var ans=display_dooit.value[display_dooit.data.structure[q].id][a];
							switch(display_dooit.data.structure[q].value.type) {
								case "checkbox":
									for(var v=0;v<display_dooit.data.structure[q].value.option.length;v++) {
										if(display_dooit.data.structure[q].value.option[v].score!==null) {
											if(ans[v]=="1") this.scores[display_dooit.data.structure[q].value.option[v].score]++;
										}
									}
									break;
								case "select":
									for(var v=0;v<display_dooit.data.structure[q].value.option.length;v++) {
										if(display_dooit.data.structure[q].value.option[v].score!==null) {
											if(ans[v]=="1") this.scores[display_dooit.data.structure[q].value.option[v].score]++;
										}
									}
									break;
								case "buttons":
									for(var v=0;v<display_dooit.data.structure[q].value.option.length;v++) {
										if(display_dooit.data.structure[q].value.option[v].score!==null) {
											if(ans[v]=="1") this.scores[display_dooit.data.structure[q].value.option[v].score]++;
										}
									}
									break;
								case "slider":
									if (display_dooit.data.structure[q].value.option[0].score!="none") {
										var rtg=(display_dooit.data.structure[q].value.option[0].score=="MinToMax");
										var prop=ans[0]/display_dooit.data.structure[q].value.option[0].divisions;
										if(!rtg) prop=1-prop;
										var c=['red','amber','green'];
										var ci=Math.floor(c.length*prop);
										if (ci>=c.length) ci=c.length-1;
										this.scores[c[ci]]++;
									}
									break;
							}
						}
					}
				}
			},
			process:function() {
				if($('.rag_balloons .red').get().length>0) {
					this.sky.position++;
					if(this.sky.position>=this.sky.max_position) this.sky.position=0;
					$(this.frame).css("background-position","-"+this.sky.position+"px 0px");
					var maxh=1;
					for(var k in this.balloons) {
						if(this.scores[k]>maxh) maxh=this.scores[k];
					}
					for(var k in this.balloons) {
						var dh=((this.scores[k]/maxh)*this.top_height)-this.balloons[k].height;
						this.balloons[k].velocity+=dh/this.balloons[k].dv;
						this.balloons[k].velocity*=this.balloons[k].friction;
						this.balloons[k].height+=this.balloons[k].velocity;
						$(this.balloons[k].element).css("bottom",Math.round(this.balloons[k].height)+"px");
					}
					setTimeout('if(typeof(display_dooit)!="undefined") {if (typeof(display_dooit.score_system)!="undefined") display_dooit.score_system.process();};',20);
				}
			}
		},
		galileo:{
			title:'Galileo thermometer',
			range:['red','amber','green'],
			display:true,
			frame:null,
			scores:{'red':0,'amber':0,'green':0},
			balloons:{
				red:{
					left:54,
					height:100,
					element:null,
					velocity:0,
					dv:380,
					friction:0.87
				},
				amber:{
					left:63,
					height:100,
					element:null,
					velocity:0,
					dv:390,
					friction:0.88
				},
				green:{
					left:57,
					height:100,
					element:null,
					velocity:0,
					dv:400,
					friction:0.89
				}
			},
			answered:0,
			top_height:244,
			bottom_height:50,
			init:function(){
				var h=$('#yoodooScrolledArea').height()-$(display_dooit.container).find('.result_report').offset().top;
				$(display_dooit.container).find('.fields').css('height',h+"px");
				this.frame=document.createElement("DIV");
				var w=150;
				$(this.frame).css('float','right');
				$(this.frame).css('width',w+'px');
				$(this.frame).addClass('galileo');
				var fields=$(display_dooit.container).find('.fields').get(0);
				var rr=$(display_dooit.container).find('.result_report').get(0);
				$(this.frame).css('height',$(fields).height()+'px');
				this.top_height=$(fields).height()-100;
				$(fields).css('overflow','auto');
				fields.parentNode.insertBefore(this.frame,rr);
				for(var k in this.balloons) {
					this.balloons[k].element=document.createElement("DIV");
					$(this.balloons[k].element).addClass(k);
					$(this.balloons[k].element).css("bottom",this.balloons[k].height+"px");
					$(this.balloons[k].element).css("left",this.balloons[k].left+"px");
					this.frame.appendChild(this.balloons[k].element);
				}
				this.update();
				this.process();
			},
			update:function() {
				this.scores={'red':0,'amber':0,'green':0};
				var quantity=0;
				for(var q=0;q<display_dooit.data.structure.length;q++) {
					if(typeof(display_dooit.value[display_dooit.data.structure[q].id])!="undefined") {
						var answers=1;
						if (display_dooit.multipliable(q)) answers=display_dooit.value[display_dooit.data.structure[q].id].length;
						for(var a=0;a<answers;a++) {
							var ans=display_dooit.value[display_dooit.data.structure[q].id][a];
							switch(display_dooit.data.structure[q].value.type) {
								case "checkbox":
									for(var v=0;v<display_dooit.data.structure[q].value.option.length;v++) {
										if(display_dooit.data.structure[q].value.option[v].score!==null) {
											if(ans[v]=="1") this.scores[display_dooit.data.structure[q].value.option[v].score]++;
										}
									}
									break;
								case "select":
									for(var v=0;v<display_dooit.data.structure[q].value.option.length;v++) {
										if(display_dooit.data.structure[q].value.option[v].score!==null) {
											if(ans[v]=="1") this.scores[display_dooit.data.structure[q].value.option[v].score]++;
										}
									}
									break;
								case "buttons":
									for(var v=0;v<display_dooit.data.structure[q].value.option.length;v++) {
										if(display_dooit.data.structure[q].value.option[v].score!==null) {
											if(ans[v]=="1") this.scores[display_dooit.data.structure[q].value.option[v].score]++;
										}
									}
									break;
								case "slider":
									if (display_dooit.data.structure[q].value.option[0].score!="none") {
										var rtg=(display_dooit.data.structure[q].value.option[0].score=="MinToMax");
										var prop=ans[0]/display_dooit.data.structure[q].value.option[0].divisions;
										if(!rtg) prop=1-prop;
										var c=['red','amber','green'];
										var ci=Math.floor(c.length*prop);
										if (ci>=c.length) ci=c.length-1;
										this.scores[c[ci]]++;
									}
									break;
							}
						}
					}
				}
			},
			process:function() {
				if($('.galileo .red').get().length>0) {
					var maxh=1;
					for(var k in this.balloons) {
						if(this.scores[k]>maxh) maxh=this.scores[k];
					}
					for(var k in this.balloons) {
						var dh=((this.scores[k]/maxh)*(this.top_height-this.bottom_height))-this.balloons[k].height;
						this.balloons[k].velocity+=dh/this.balloons[k].dv;
						this.balloons[k].velocity*=this.balloons[k].friction;
						this.balloons[k].height+=this.balloons[k].velocity;
						$(this.balloons[k].element).css("bottom",Math.round(this.bottom_height+this.balloons[k].height)+"px");
					}
					setTimeout('if(typeof(display_dooit)!="undefined") {if (typeof(display_dooit.score_system)!="undefined") display_dooit.score_system.process();};',20);
				}
			}
		}
	}
}


dooit.temporaries('display_dooit');
