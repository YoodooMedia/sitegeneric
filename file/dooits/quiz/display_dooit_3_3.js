var display_dooit={
	construct_key:'',
	key:'',
	data:[],
	value:{},
	container:null,
	attachStructure:{},
	attachData:{},
	reporting:false,
	//completeMessage:'You have completed this doo-it. Click <b>Done</b> to return to the bookcase.',
	keyChecker:function(ip) {
		ip=ip.replace(/\d([\w]{19})/g,"f$1");
		return ip;
	},
	init:function() {
		this.reporting=false;
		this.data=[];
		this.value={};
		this.construct_key='';
		this.key='';
		this.attachStructure={};
		this.completeHandler=function() {};
		this.attachData={};
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
			//eval('this.data='+this.decode(array_of_fields[k][1].replace(/\,\d/g,',f').replace(/\{\d/g,'{f'))+';');
		}catch(err) {
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
			//eval('this.data='+this.decode(array_of_fields[k][1].replace(/\,\d/g,',f').replace(/\{\d/g,'{f'))+';');
		}catch(err) {
		}


		for(var k in array_of_fields) {
			var tmp=null;
			if (k!=this.construct_key) {
				if(typeof(array_of_fields[k])=="object") {
					if(/^global_Construct/.test(k)) {
						if (array_of_fields[k][1]!="") {
							//this.keyChecker(array_of_fields[k][1]);
							try{
								eval('tmp='+this.decode(this.keyChecker(array_of_fields[k][1]))+';');
								//eval('this.data='+this.decode(array_of_fields[k][1].replace(/\,\d/g,',f').replace(/\{\d/g,'{f'))+';');
							}catch(err) {
							}
							if (tmp!=null) {
								for(var t=0;t<tmp.structure.length;t++) {
									this.attachStructure[tmp.structure[t].id]=tmp.structure[t];
									//this.attachStructure.push(tmp.structure[t]);
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
								//eval('this.value='+this.decode(array_of_fields[k][1].replace(/\,\d/g,',f').replace(/\{\d/g,'{f'))+';');
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
		// check data structure
//console.log(this.decode(array_of_fields[this.key][1].replace(/\,\d/g,',f').replace(/\{\d/g,'{f')));
//console.log(this.value);
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
		/*for(var s=0;s<this.data.structure.length;s++) {
			for(var o=0;o<this.data.structure[s].value.option.length;o++) {
				if(typeof(this.data.structure[s].value.option[o])=="string") this.data.structure[s].value.option[o]={title:this.data.structure[s].value.option[o],score:null}; // makes options keyed
			}
		}*/
//console.log(this.value);
		this.check_defaults();
//console.log(this.value);
		//if (this.value.length==0) {
		//}
		if (this.data.dooit.randomize) this.randomize();
		if (this.data.dooit.randomizeoptions) this.randomize_options();
		this.container=$('.construction').get(0);
		this.render();
		setTimeout('display_dooit.score_system.init();',200);
		var f=$(this.container).find(".fields").get(0);
		var resrep=document.createElement("DIV");
		$(resrep).addClass("result_report");
		f.parentNode.insertBefore(resrep,f);
		if(this.data.dooit.serialize) {
			if(typeof(this.value.report)!="undefined" && this.value.report!="") {
				var suffix='';
				if (this.data.dooit.serialize && this.data.dooit.redoable) suffix="<div><button type='button' class='questionLeft' onclick='display_dooit.restart()'>redo</button></div>";
				$(resrep).html(this.value.report+suffix);
				$(this.container).find('.fields').css("display","none");
			}
		}
		dooit.setExport(display_dooit.xport);
		if(this.data.dooit.serialize) {
			for(var i=0;i<this.data.structure.length;i++) {
				if (this.data.structure[i].value.grouped=='1') this.data.structure[i].value.grouped='0';
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
				$(this.container).find('.fields .fieldheader button.questionDot').bind("click",function(e) {
					var qi=$(this).prevAll('button.questionDot').get().length;
					var dir=qi-display_dooit.questionDisplayed;
					if (dir!=0) display_dooit.question_move(dir);
				});
				var insAfter=document.createElement("DIV");
				$(insAfter).addClass("fieldfooter");
				ins='';
				ins+="<button class='questionRight'>next</button>";
				ins+="<button class='questionLeft' style='display:none'>previous</button>";
				//ins+="<div class='completedMessage' style='display:none'>"+this.completeMessage+"</div>";
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
				//this.question_move(0);
			}
		}
	},
	restart:function() {
		$(this.container).find(".result_report").slideUp(1000,function() {
			$(this.container).find(".result_report").html('');
			$(this.container).find(".result_report").css("display","block");
		});
		$(this.container).find(".fields").slideDown();
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
		if (this.questionDisplayed<0) this.questionDisplayed=0;
		var fini=this.questionDisplayed>=q.length;
		//if (this.questionDisplayed>=q.length) this.questionDisplayed=q.length;
		if (fini) {
			if (this.serializeOutro) $(this.serializeOutro).slideDown();
			$(q[cq]).fadeOut(1000);
			if(this.completeHandler) this.completeHandler(this.value);
		}else{
			if (cq>=q.length || cq<0) {
				$($(display_dooit.container).find('.fields div.question').get(display_dooit.questionDisplayed)).fadeIn(1000,function() {
					display_dooit.stopwatch=new Date().getTime();
				});
			}else{
				$(q[cq]).fadeOut(1000,function() {
					$($(display_dooit.container).find('.fields div.question').get(display_dooit.questionDisplayed)).fadeIn(1000,function() {
						display_dooit.stopwatch=new Date().getTime();
					});
				});
			}
			$(this.container).find('.fields .fieldheader button.questionDot.on').removeClass("on");
		
			$($(this.container).find('.fields .fieldheader button.questionDot').get(this.questionDisplayed)).addClass("on");
			if (this.data.dooit.redoable) {
				$(this.container).find('.fieldfooter button.questionLeft').css("display",(this.questionDisplayed>0)?"block":"none");
			}
			var canProgress=true;
			if(this.questionDisplayed<q.length) {
				if(typeof(this.completed[this.data.structure[this.questionDisplayed].value.type])!="undefined") {
					if(!this.completed[this.data.structure[this.questionDisplayed].value.type](this.questionDisplayed)) canProgress=false;
				}
			}
			
		}
		$(this.container).find('.fieldfooter button.questionRight').css("display",(canProgress && (this.questionDisplayed<q.length))?"block":"none");
		
	},
	result_report:function(html) {
		this.value.report=html;
		$(this.container).find(".fields").slideUp(1000,function() {
			var suffix='';
			if (display_dooit.data.dooit.serialize && display_dooit.data.dooit.redoable) suffix="<div><button type='button' class='questionLeft' onclick='display_dooit.restart()'>redo</button></div>";
			$(display_dooit.container).find('.result_report').html(display_dooit.value.report+suffix);
			if ($(display_dooit.container).find('.result_report').css("display")=="none") $(display_dooit.container).find('.result_report').slideDown();
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
				//this.value[this.data.structure[i].id]=[[]];
				//if (this.data.structure[i].value.option.length==0) this.data.structure[i].value.option=[];
				//for(var k=0;k<this.data.structure[i].value.option.length;k++) {

	
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
//this.value[this.data.structure[i].id][0][defaultIndex]='1';
				
			}else{
				if (typeof(this.value[this.data.structure[i].id][0])!="object") {
					this.value[this.data.structure[i].id]=[this.value[this.data.structure[i].id]]; // ensure it can take multiple answers
				}
				/*for(var j=0;j<this.value[this.data.structure[i].id].length;j++) {
					//if (typeof(this.value[this.data.structure[i].id][j])!="object") {
						this.value[this.data.structure[i].id][j]=[this.value[this.data.structure[i].id][j]];
					//}
				}*/

				for(var k=0;k<this.value[this.data.structure[i].id].length;k++) { // each question
					//var checkDefault=(this.data.structure[i].value.option.length==0);
					var checkDefault=(this.value[this.data.structure[i].id][k].length==0);
					//for(var j=0;j<this.value[this.data.structure[i].id][k].length;j++) {
//console.log(i,this.data.structure[i].id);
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
//console.log(this.value);
	},
	type_output:{
		paragraph:function(d,val,a) {
			var ins="";
			return ins;
		},
		text:function(d,val,a) {
			var ins="";
			if (val.option.length==0) {
				for(var i=0;i<val.option.length;i++) ins+="<div class='item'><input type='text' onkeyup='display_dooit.set_value(\""+d+"\","+i+",this.value,"+a+");' value='"+(display_dooit.value[d][a][i]?display_dooit.value[d][a][i]:"")+"' /></div>";
				//for(var i=0;i<val.length;i++) ins+="<textarea onkeyup='display_dooit.set_value(\""+d+"\","+i+",this.value);'>"+(display_dooit.value[d][a][i]?display_dooit.value[d][a][i]:"")+"</textarea>";
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
				for(var i=0;i<val.option.length;i++) ins+="<div class='item'><label><span class='label'>"+val.option[i].title+"</span><input type='checkbox' "+((display_dooit.value[d][a][i]==1)?"checked":"")+" onchange='display_dooit.set_value(\""+d+"\","+i+",this.checked?\"1\":\"0\","+a+");'/></label></div>";
			}
			return ins;
		},
		select:function(d,val,a) {
			var ins="";
			ins+="<select onchange='display_dooit.set_select(this);'>";
			var so='';
			var on=false;
//console.log(d,a,display_dooit.value[d][a]);
			for(var i=0;i<val.option.length;i++) {
//console.log(d,a,i,display_dooit.value[d][a][i]);
				so+="<option"+((display_dooit.value[d][a][i]=="1")?" selected='true'":"")+" >"+val.option[i].title+"</option>";
				if (display_dooit.value[d][a][i]=="1") on=true;
			}
			if (!on) so='<option selected="true">inputremoveoption</option>'+so;
			
			//for(var i=0;i<val.length;i++) ins+="<option "+((display_dooit.value[d][i]==1)?"selected='true'":"")+" >"+val[i].title+"</option>";
			ins+=so+"</select>";
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
//console.log((display_dooit.value[d][a][i]!=""));
					ins+="<input type='text' class='date' onkeyup='display_dooit.set_value(\""+d+"\","+i+",this.value,"+a+");' value='"+((display_dooit.value[d][a][i]!="")?inputs.formatDate('d/m/Y',display_dooit.value[d][a][i]):"")+"' />";
					if (val.option.length>1) ins+="</div>";
				}
			
			return ins;
		}
	},
	set_slider:function(o) {
		var ans=this.input_indexes(o);
//console.log(ans);
		var v=$(o).prevAll('li').get().length+1;
		/*var i=$(this.predecessor(o,'question')).prevAll('.question').get().length;
		var id=this.predecessor(o,'answer').id;
		var grouped=($(this.predecessor(o,'answer_item')).parent().find('.answer_item').get().length>1);
		var ai=$(this.predecessor(o,'answer_item')).prevAll('.answer_item').get().length;
		if (grouped) i+=ai;
		var a=$(this.predecessor(o,'answers')).prevAll('.answers').get().length;*/
		var val=v*(240/display_dooit.data.structure[ans.index].value.option[0].divisions);
		var col=$(o.parentNode.parentNode).find('.slider_colour').animate({width:val});
		display_dooit.value[ans.id][ans.answer][0]=""+v;
		//console.log(display_dooit.value[id]);
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
//console.log("Updated");
		if(this.data.dooit.serialize) {
			if(typeof(this.completed[this.data.structure[this.questionDisplayed].value.type])!="undefined") {
				if(!this.completed[this.data.structure[this.questionDisplayed].value.type](this.questionDisplayed)) canProgress=false;
			}
			if(this.data.structure[this.questionDisplayed].value.type=="select") {
				this.question_move(1);
			}else{
				var q=$(this.container).find(".fields .question").get();
				$(this.container).find('.fieldfooter button.questionRight').css("display",(canProgress && (this.questionDisplayed<q.length-1))?"block":"none");
			}
			if (arguments.length>0) {
				/*var time=0;
				if (this.stopwatch) {
					time=new Date().getTime()-this.stopwatch;
console.log(time);
					if (this.value.times==undefined) this.value.times={};
					this.value.times[arguments[0]]=(time/1000).toFixed(2);
				}*/
			}
		}
		return canProgress;
	},
	shuffled:{
		paragraph:false,
		text:false,
		numeric:false,
		checkbox:true,
		select:true,
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
			if (val.length>1) {
				for(var i=0;i<val.length;i++) ins+="<div class='item'>"+val[i].title+""+(display_dooit.value[d][a][i]?display_dooit.value[d][a][i]:"")+"</div>";
			}else if (val.length==1) {
				ins+=(display_dooit.value[d][0]?display_dooit.value[d][a][0]:"");
			}else{
				ins="Nothing selected";
			}
			return ins;
		},
		numeric:function(d,val,a) {
			var ins="";
			if (val.length>1) {
				for(var i=0;i<val.length;i++) ins+="<div class='item'>"+val[i].title+""+(display_dooit.value[d][a][i]?display_dooit.value[d][a][i]:"")+"</div>";
			}else if (val.length==1) {
				ins+=(display_dooit.value[d][a][0]?display_dooit.value[d][a][0]:"");
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
		/*if (!this.exportable) {
			this.fetchExporter('display_dooit.xport()');
		}else{*/
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
		/*var exwin=window.open("","csvExport","width=400,height=100,location=0,menubar=0,resizable=0,status=0,toolbar=0,scrollbars=0");
		exwin.document.open("text/html");
		var filename="Downloaded.csv";
		exwin.document.write("<html><head><title>Your exported report</title></head><body style='padding:0;margin:0' onload='self.focus();document.getElementById(\"getCSV\").submit()'><div style='position:fixed;width:100%;height:100%;background:#1a2d48;color:#fff'><a href='javascipt:void(0)' onclick='window.close()'>close</a><div style='margin:10px 0 0 0;text-align:center;'>Your exported report should start downloading</div></div><form style='visibility:hidden' action='"+yoodoo.option.baseUrl+"csvDownload.php' method='POST' id='getCSV'><textarea name='csv'>"+file+"</textarea><input type='hidden' name='filename' value='"+filename+"' /></form></body></html>");
		exwin.document.close();*/

		//return op.join("\n");
		//}
	},
	field_xport_container:function(d) {
		var ins='';
		var multy=(this.data.structure[d[0]].value.multiple=="1");
		var maxAnswers=this.value[this.data.structure[d[0]].id].length;
		if (!multy) maxAnswers=1;
		var op=[];
		for(var a=0;a<maxAnswers;a++) {
			//if(ins!="") ins+="\n";
			for(var di=0;di<d.length;di++) {
				if(this.data.structure[d[di]].value.type=="paragraph") {
					//ins+='"'+this.data.structure[d[di]].title.replace(/<[^>]+>/g,'').replace(/\"/g,'\\"')+'"';
					op.push([this.data.structure[d[di]].title.replace(/<[^>]+>/g,'').replace(/\"/g,'\\"')]);
				}else{
					if (this.data.structure[d[di]].value.option.length>0) {
						var tmp=this.xport_type[this.data.structure[d[di]].value.type](this.data.structure[d[di]].id,this.data.structure[d[di]].value.option,a);
		//console.log(tmp);
						for(var t=0;t<tmp.length;t++) {
							if(tmp[t][0]=="untitled") tmp[t][0]='';
							if(tmp[t][0]=='' && this.data.structure[d[di]].title!="") tmp[t][0]=this.data.structure[d[di]].title;
							for(var i=0;i<tmp[t].length;i++) tmp[t][i]=tmp[t][i].replace(/\"/g,'\\"').replace(/<[^>]+>/g,'');
							//ins+='"'+((t=="untitled")?"":t.replace(/\"/g,'"'))+'","'+tmp[t]+'"'+"\n";
							if (multy && di==0) {
								if(typeof(this.data.structure[d[0]].paragraph)!="undefined" && this.data.structure[d[0]].paragraph!="") {
									tmp[t].splice(0,0,this.data.structure[d[0]].paragraph.replace(/<[^>]+>/g,'').replace(/\"/g,'\\"'));
								}else if (typeof(this.data.structure[d[0]].title)!="undefined" && this.data.structure[d[0]].title!="") {
									tmp[t].splice(0,0,this.data.structure[d[0]].title.replace(/\"/g,'\\"'));
								}
							}else if(multy) {
								tmp[t].splice(0,0,'');
							}else if(typeof(this.data.structure[d[0]].paragraph)!="undefined" && this.data.structure[d[0]].paragraph!="") {
								op.push([this.data.structure[d[0]].paragraph.replace(/<[^>]+>/g,'').replace(/\"/g,'\\"')]);
							}
							op.push(tmp[t]);
							//ins+='"'+tmp[t].join('","')+'"'+"\r\n";
						}
					}else{
						if(typeof(this.data.structure[d[0]].paragraph)!="undefined" && this.data.structure[d[0]].paragraph!="") {
							op.push([this.data.structure[d[0]].paragraph.replace(/<[^>]+>/g,'').replace(/\"/g,'\\"')]);
						}else if(typeof(this.data.structure[d[0]].title)!="undefined" && this.data.structure[d[0]].title!="") {
							op.push([this.data.structure[d[0]].title.replace(/<[^>]+>/g,'').replace(/\"/g,'\\"')]);
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
		text:function(d,val,a) {
			var reply=[];
			if (val.length>1) {
				for(var i=0;i<val.length;i++) reply.push([(val[i].title=='')?'untitled':val[i].title,(display_dooit.value[d][a][i]?display_dooit.value[d][a][i]:"")]);
			}else if (val.length==1) {
				reply.push([(val[0].title=='')?'untitled':val[0].title,(display_dooit.value[d][a][0]?display_dooit.value[d][a][0]:"")]);
			}else{
				reply.push(['untitled',"Nothing selected"]);
			}
			return reply;
		},
		numeric:function(d,val,a) {
			var reply=[];
			if (val.length>1) {
				//for(var i=0;i<val.length;i++) reply[(val[i].title=='')?'untitled':val[i].title]=(display_dooit.value[d][a][i]?display_dooit.value[d][a][i]:"");
				for(var i=0;i<val.length;i++) reply.push([(val[i].title=='')?'untitled':val[i].title,(display_dooit.value[d][a][i]?display_dooit.value[d][a][i]:"")]);
			}else if (val.length==1) {
				//reply[(val[0].title=='')?'untitled':val[0].title]=(display_dooit.value[d][0]?display_dooit.value[d][a][0]:"");
				reply.push([(val[0].title=='')?'untitled':val[0].title,(display_dooit.value[d][a][0]?display_dooit.value[d][a][0]:"")]);
			}else{
				//reply['untitled']="Nothing selected";
				reply.push(['untitled',"Nothing selected"]);
			}
			return reply;
		},
		checkbox:function(d,val,a) {
			var reply=[];
			var checks=[];
			for(var i=0;i<val.length;i++) {
				if (display_dooit.value[d][a][i]==1) checks.push(val[i].title);
			}
			if (checks.length>1) {
				var ins=" and "+checks.pop();
				ins=checks.join(", ")+ins;
				reply.push(['untitled',ins]);
			}else if (checks.length==1) {
				reply.push(['untitled',checks[0]]);
			}else{
				reply.push(['untitled',"Nothing selected"]);
			}
			return reply;
		},
		select:function(d,val,a) {
			var reply=[];
			var checks=[];
			for(var i=0;i<val.length;i++) {
				if (display_dooit.value[d][a][i]==1) checks.push(val[i].title);
			}
			if (checks.length>1) {
				var ins=" and "+checks.pop();
				ins=checks.join(", ")+ins;
				reply.push(['untitled',ins]);
			}else if (checks.length==1) {
				reply.push(['untitled',checks[0]]);
			}else{
				reply.push(['untitled',"Nothing selected"]);
			}
			return reply;
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
			return [["untitled",ins]];
		},
		reference:function(d,val,a) {
			var ins=["untitled"];
			
			for(var s=0;s<val[0].linked.structure.value.option.length;s++) {
				ins.push(display_dooit.value[d][a][s]?display_dooit.value[d][a][s]:((s==0)?"Empty":""));
			}
			return [ins];
		},
		date:function(d,val,a) {
			//var ins="";
			var reply=[];
			var idx=display_dooit.question_index(d);
			if (val.length>1) {
				for(var i=0;i<val.length;i++) {
					if (display_dooit.data.structure[idx].value.option[i].format==null || display_dooit.data.structure[idx].value.option[i].format=='') display_dooit.data.structure[idx].value.option[i].format='d/m/Y';
					var op=(display_dooit.value[d][a][i]?inputs.formatDate(display_dooit.data.structure[idx].value.option[i].format,display_dooit.value[d][a][i]):"");
					//ins+="<div class='item'><b>"+val[i].title+":</b> "+op+"</div>";
					reply.push([(val[i].title=='')?'untitled':val[i].title,op]);
				}
			}else if (val.length==1 && display_dooit.value[d][a][0]!="") {
				if (display_dooit.data.structure[idx].value.option[0].format==null || display_dooit.data.structure[idx].value.option[0].format=='') display_dooit.data.structure[idx].value.option[0].format='d/m/Y';
				var op=(display_dooit.value[d][a][0]?inputs.formatDate(display_dooit.data.structure[idx].value.option[0].format,display_dooit.value[d][a][0]):"");
				//reply[(val[0].title=='')?'untitled':val[0].title]=op;
				reply.push([(val[0].title=='')?'untitled':val[0].title,op]);
			}else{
				reply.push(['untitled',"Nothing selected"]);
			}
			return reply;
		}
	},
   /*  keyCode:function(e) {
         var keycode;
         if (window.event) keycode = window.event.keyCode;
         else if (e) keycode = e.which;
         var key={
             code:keycode,
             alpha:(keycode>64 && keycode<91),
             numeric:((keycode>47 && keycode<57)||(keycode>95 && keycode<105)),
             decimal:((keycode>47 && keycode<57)||(keycode>95 && keycode<105)||(keycode==189)||(keycode==190)),
             enter:(keycode==13),
             escape:(keycode==27),
            
  input:((keycode==190)||(keycode==188)||(keycode==192)||(keycode==111)||(keycode==192)||(keycode==191)||(keycode==107)||(keycode==187)||(keycode==189)||(keycode==106)||(keycode==110)||(keycode==220)||(keycode==223)||(keycode==222)||(keycode==221)||(keycode==219)||(keycode==186)),
             tab:(keycode==9),
             shift:(keycode==16),
             backspace:(keycode==8),
             del:(keycode==46),
             fkey:((keycode>111 && keycode<124)?keycode-111:false),
             home:(keycode==36),
             end:(keycode==35),
             up:(keycode==38),
             down:(keycode==40),
             left:(keycode==37),
             right:(keycode==39),
			 navigate:false
         };
         key.navigate=(key.left||key.right||key.del||key.backspace||key.shift||key.home||key.end||key.tab);
         return key;
     },*/
	toggle:function() {
		this.reporting=!this.reporting;
		this.render();
		if (!this.reporting) this.score_system.init();
	},
	render:function() {
		var op='<h2>'+this.data.dooit.title+'&nbsp;</h2><h3>'+this.data.dooit.subheading+'&nbsp;</h3>';
		if (!this.data.dooit.serialize) op+="<button type='button' class='button toggle green' onclick='"+(this.reporting?'display_dooit.output();':'')+"display_dooit.toggle();'>"+(this.reporting?'edit':'report')+"</button>";
		op+="<div class='fields'>";		
		if (typeof(this.data.structure)!="undefined" && this.data.structure.length>0) {
			var d=0;
			while(d<this.data.structure.length) {
				var indexes=[d++];
				while(d<this.data.structure.length && this.data.structure[d].value.grouped=="1") indexes.push(d++);
				if (this.reporting) {
					op+=this.field_report_container(indexes);
				}else{
					op+=this.field_container(indexes);
				}
			}
		}else{
			op+="No questions defined";
		}
		op+="</div>";
		$(this.container).html(op);
		//setTimeout('display_dooit.render_delay()',200);
		/*var h=$('#yoodooScrolledArea').height()-$(this.container).find('.fields').offset().top;
		$(this.container).find('.fields').css('height',h+"px");
		this.post_render(this.container);*/
		this.post_render(this.container);
	},
	post_render:function(e) {
		var opts={oncheck:display_dooit.set_checkbox,onuncheck:display_dooit.set_checkbox};
		inputs.radioCheckbox($(e).find("input[type=checkbox]").get(),opts);
		inputs.dropdown($(e).find('select').get(),{dropdownX:2,dropdownY:2,autofit:true,widthExtension:18,onSelect:display_dooit.set_select});
		var opts={};
		var dates=$(e).find("input[type=text].date").get();
		for(var d=0;d<dates.length;d++) {
			var pos=this.input_location(dates[d]);
			//console.log(this.question_index(pos.key));
			//console.log(this.data.structure[this.question_index(pos.key)].value.option[pos.field].format);
			var format='';
			if (typeof(this.data.structure[this.question_index(pos.key)].value.option[pos.field].format)!="undefined") {
				format=this.data.structure[this.question_index(pos.key)].value.option[pos.field].format;
			}
			opts.formatdisplay=format;
			opts.selected=function(ip,dt,fd) {
				var pos=display_dooit.input_location(ip);
//console.log(pos);
				//if (typeof(display_dooit.value[pos.key][pos.answer])=="undefined") display_dooit.value[pos.key]=[];
				//if (typeof(display_dooit.value[pos.key][pos.answer])=="undefined") display_dooit.value[pos.key]=[];
				display_dooit.value[pos.key][pos.answer][pos.field]=dt;
				//console.log(display_dooit.value[pos.key][pos.answer][pos.field].toString());
			};
			//console.log(opts);
			inputs.date([dates[d]],opts);
		}
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
		if (arguments.length>1) as_element=arguments[1];
		var ins="";
		if(this.data.structure[d[0]].value.type!='paragraph') ins+="<div class='question'>";
		if(typeof(this.data.structure[d[0]].paragraph)!="undefined" && this.data.structure[d[0]].paragraph!="") ins+=this.data.structure[d[0]].paragraph;
		var multy=(this.data.structure[d[0]].value.multiple=="1");
		var maxAnswers=this.value[this.data.structure[d[0]].id].length;
		if (!multy) maxAnswers=1;
		for(var a=0;a<maxAnswers;a++) {
			ins+="<div class='answers'>";
			//if (multy) ins+="<button type='button' class='remove' onclick='display_dooit.remove_answer(this,"+d[0]+")'>remove</button>";
				for(var di=0;di<d.length;di++) {
					ins+=this.field_report_answer(d[di],a);
				}
			ins+="</div>";
		}
		ins+="<div class='clear'></div>";
		//if (multy) ins+="<button type='button' class='add' onclick='display_dooit.add_answer(this,"+d[0]+");'>add</button>";
		if(this.data.structure[d[0]].value.type!='paragraph') ins+="</div>";


		/*var ins="<div class='question'>";
		ins+="<div class='answers' id='"+this.data.structure[d].id+"'>";
		ins+=this.type_report[this.data.structure[d].value.type](this.data.structure[d].id,this.data.structure[d].value.option);
		ins+="</div>";
		ins+="<div class='label'>"+this.data.structure[d].title+"</div>";
		ins+="<div class='clear'></div>";
		ins+="</div>";*/
		return ins;
	},
	field_container:function(d) {
		var as_element=false;
		if (arguments.length>1) as_element=arguments[1];
		var ins="";
		if(this.data.structure[d[0]].value.type!='paragraph') ins+="<div class='question'>";
		var showPara=(typeof(this.data.structure[d[0]].paragraph)!="undefined" && this.data.structure[d[0]].paragraph!="" );
		if (/^<[^>]+>$/.test(this.data.structure[d[0]].paragraph)) showPara=false;
		if(showPara) ins+=this.data.structure[d[0]].paragraph;
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
		var addItemDiv=head || (this.data.structure[d].value.grouped=="1" && (this.data.structure[d].value.type!="text" || this.data.structure[d].value.type!="date"));
		if (head && this.data.structure[d].value.multiple!="1") addItemDiv=false;
		if (this.data.structure[d].value.grouped!="1"  && !addItemDiv) ins+="<div class='label'>"+this.data.structure[d].title+"</div>";
		if (this.data.structure[d].value.option.length>0) {
			ins+="<div class='answer "+this.data.structure[d].value.type+"Type' id='"+this.data.structure[d].id+"'>";
			if (addItemDiv) ins+="<div class='item'><span class='label'>"+this.data.structure[d].title+"</span>";
			ins+=this.type_output[this.data.structure[d].value.type](this.data.structure[d].id,this.data.structure[d].value,a);
			if (addItemDiv) ins+="</div>";
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
		var ins='';
		if(!asElement) ins+="<div class='answer_item'>";
		ins+="<div class='answer "+this.data.structure[d].value.type+"Type' id='"+this.data.structure[d].id+"'>";
		ins+=this.type_report[this.data.structure[d].value.type](this.data.structure[d].id,this.data.structure[d].value.option,a);
		ins+="</div>";
		ins+="<div class='label'>"+this.data.structure[d].title+"</div>";
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
		var afterAnswers=$(answers[answers.length-1]).next('div').get(0);
		var cont=document.createElement("DIV");
		$(cont).css("display","none");
		$(cont).addClass("answers");
		$(cont).html("<button type='button' class='remove' onclick='display_dooit.remove_answer(this,"+i+")'>remove</button>");
		for(var di=0;di<d.length;di++) {
			cont.appendChild(this.field_answer(d[di],this.value[this.data.structure[d[di]].id].length-1,true));
		}
		o.parentNode.insertBefore(cont,afterAnswers);
		this.post_render(cont);
		$(cont).slideDown();
	},
	completed:{
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
		var op=(this.json(this.value));
		array_of_fields[this.key][1]=op;
		var reply={};
		eval('reply.EF'+array_of_fields[this.key][0]+'=op;');
		return reply;
	},
	json:function(o) {
		if (typeof(o)=="string" || typeof(o)=="number") {
			return '"'+this.encode(''+o)+'"';
			//return this.encode('"'+o.replace(/"/g,'\\"')+'"');
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
				var h=$('#yoodooScrolledArea').height()-$(display_dooit.container).find('.result_report').offset().top;
				$(display_dooit.container).find('.fields').css('height',h+"px");
				this.frame=document.createElement("DIV");
				var w=150;
				$(this.frame).css('float','right');
				$(this.frame).css('width',w+'px');
				$(this.frame).addClass('rag_balloons');
				var fields=$(display_dooit.container).find('.fields').get(0);
				var rr=$(display_dooit.container).find('.result_report').get(0);
				//$(fields).css("width",($(fields).width()-w)+"px");
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
				//$(fields).css("width",($(fields).width()-w)+"px");
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
//console.log(this.scores.red,this.scores.amber,this.scores.green);
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
