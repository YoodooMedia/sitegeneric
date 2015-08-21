
var career={
	value:'',
	container:null,
	field:{name:'',id:''},
	details:null,
	list:null,
	editing:-1,
	editorOpen:false,
	editingObject:-1,
	jobs:[],
	title:'Your job history',
	teaser:'A big part of your CV: the jobs you&#39;ve done',
	months:['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
	init:function(key) {
		this.field.name=key;
		this.field.id=array_of_fields[key][0];
		this.value=array_of_fields[key][1];
		if (this.value!="") {
			try{
				eval('this.jobs='+this.value+';');
			}catch(err) {
			}
		}
		this.container=$('.career').get(0);
		if (typeof(yoodoo)!="undefined" && yoodoo.dooittitle!="") this.title=yoodoo.dooittitle;
		if (typeof(yoodoo)!="undefined" && yoodoo.dooitteaser!="") this.teaser=yoodoo.dooitteaser;
		this.container.innerHTML='<h2>'+this.title+'</h2><div class="teaser">'+this.teaser+'</div>';
		this.details=document.createElement("div");
		$(this.details).addClass("details");
		$(this.details).fadeTo('fast',0.2);
		this.list=document.createElement("div");
		$(this.list).addClass("list");
		this.container.appendChild(this.list);
		this.container.appendChild(this.details);
		var clr=document.createElement("div");
		$(clr).css("clear","both");
		$(clr).css("height","5px");
		this.container.appendChild(clr);
		this.listJobs();
		if (this.jobs.length==0) this.add();
		this.edit($(this.list).find('.job:first'));
	},
	listJobs:function() {
		var ins='<h3>Your career history...</h3>';
		this.jobs=this.jobs.sort(this.byStartDate);
		ins+="<div class='jobList'>";
		ins+="</div>";
		ins+="<div id='toedit'>click the job to edit it</div>";
		ins+="<button type='button' class='green'>add</button>";
		this.list.innerHTML=ins;
		var jl=$(this.list).find('.jobList').get(0);
		for(var i=0;i<this.jobs.length;i++) jl.appendChild(this.jobHTML(i));
		
		$(this.list).find('.job').bind("click",function() {career.edit(this);});
		$(this.list).find('button.green').bind("click",function() {career.add(this);});
		this.toedit(this.jobs.length>0);
	},
	toedit:function(show) {
		$('.career #toedit').css('display',show?'block':'none');
	},
	byStartDate:function(a,b) {
		return b.finish-a.finish;
	},
	jobHTML:function(i) {
		var ins="<div><div class='dates'>"+this.months[this.jobs[i].start.getMonth()]+' '+this.jobs[i].start.getFullYear()+"<br />"+(this.jobs[i].present?'present':this.months[this.jobs[i].finish.getMonth()]+' '+this.jobs[i].finish.getFullYear())+'</div>';
		ins+="<div class='detail'>"+((this.jobs[i].position=='')?'Position':this.jobs[i].position)+'<br />'+((this.jobs[i].company=='')?'Company':this.jobs[i].company)+'</div><div class="fader count"></div></div>';
		var j=document.createElement("div");
		$(j).addClass("job");
		$(j).html(ins);
		return j;
	},
	add:function() {
		var job={start:new Date(),finish:new Date(),present:false,position:'Position',company:'Company'};
		this.jobs.push(job);
		var newjob=this.jobHTML(this.jobs.length-1);
		$(newjob).css("display","none");
		var jl=$(this.list).find('.jobList').get(0);
		jl.appendChild(newjob);
		$(newjob).slideDown('slow',function() {
			$(this).bind("click",function() {
				career.edit(this);
			});
			career.edit(this);
			var jl=$(career.list).find('.jobList').get(0);
			jl.scrollTop=(career.jobs.length-5)*53;
		});
		
	},
	edit:function(o) {
		this.editorOpen=true;
		this.editingObject=o;
		$(o).siblings('.job').removeClass("on");
		$(o).addClass("on");
		var prev=$(o).prevAll('.job').get().length;
		this.editing=prev;
		var ins='<h3>Edit</h3>';
		ins+="<div>Position:<br /><input id='positionName' type='text' value='"+((this.jobs[prev].position=='Position')?'':this.jobs[prev].position)+"' /></div>";
		ins+="<div>Company:<br /><input id='companyName' type='text' value='"+((this.jobs[prev].company=='Company')?'':this.jobs[prev].company)+"' /></div>";
		ins+="<div style='clear:both'><div style='clear:both'>When did you start?</div>"+this.selectMonth('startMonth',this.jobs[prev].start.getMonth())+"&nbsp;"+this.selectYear('startYear',this.jobs[prev].start.getFullYear())+"</div>";
		ins+="<div style='clear:both;"+((this.jobs[prev].present===true)?'display:none':'')+"'><div style='clear:both'>When did you leave?</div>"+this.selectMonth('finishMonth',this.jobs[prev].finish.getMonth())+"&nbsp;"+this.selectYear('finishYear',this.jobs[prev].finish.getFullYear())+"</div>";
		ins+="<div style='clear:both'>To present: <input type='checkbox' "+((this.jobs[prev].present===true)?"checked":"")+" id='toPresent' /></div>";
		ins+="<div style='clear:both'><button type='button' class='green'>save</button>";
		ins+="<button type='button' class='red' style='float:left'>delete</button></div>";
		this.details.innerHTML=ins;
		$(this.details).fadeTo('slow',1);
		inputs.dropdown($(this.details).find('select').get(),{dropdownX:4,layout:inputs.layout.none});
		$(this.details).find("input#toPresent").bind("change",function() {
			if (this.checked) {
				$(this.parentNode).prev().slideUp();
			}else{
				$(this.parentNode).prev().slideDown();
			}
		});
		
		$(this.details).find('button.green').bind('click',function() {career.saveDetail();});
		$(this.details).find('button.red').bind('click',function() {career.removeDetail();});
	},
	saveDetail:function() {
		if (this.editorOpen) {
			this.editorOpen=false;
			$(this.list).find('.job').removeClass("on");
			this.jobs[this.editing].position=$('#positionName').val();
			this.jobs[this.editing].company=$('#companyName').val();
			this.jobs[this.editing].present=$('#toPresent').get(0).checked;
			this.jobs[this.editing].start=new Date($('#startYear').val(),$('#startMonth').val(),1,0,0,0,0);
			this.jobs[this.editing].finish=new Date($('#finishYear').val(),$('#finishMonth').val(),1,0,0,0,0);
			$(this.details).fadeTo('slow',0.2);
			this.listJobs();
		}
	},
	removeDetail:function() {
		if (this.editorOpen) {
			//$(this.list).find('.job').removeClass("on");
			$(this.details).fadeTo('slow',0.2);
			//$(this.editingObject).slideUp('slow',function() {
			$(this.editingObject).animate({height:'0px'},function() {
				$(this).remove();
				career.jobs.splice(career.editing,1);
			});
			//this.listJobs();
			this.editorOpen=false;
		}
	},
	selectMonth:function(id,v) {
		var ins='<select id="'+id+'">';
		for(var i=0;i<this.months.length;i++) {
			ins+="<option value='"+(i)+"'";
			if (i==v) ins+=" selected";
			ins+=">"+this.months[i]+"</option>";
		}
		ins+="</select>";
		return ins;
	},
	selectYear:function(id,v) {
		var thisYear=new Date().getFullYear();
		var count=70;
		var ins='<select id="'+id+'">';
		for(var i=thisYear;i>(thisYear-count);i--) {
			ins+="<option value='"+i+"'";
			if (i==v) ins+=" selected";
			ins+=">"+i+"</option>";
		}
		ins+="</select>";
		return ins;
	},
	output:function() {
		var op=dooit.json(this.jobs);
		array_of_fields[this.field.name][1]=op;
		var reply={};
		eval('reply.EF'+array_of_fields[this.field.name][0]+'=op;');
		return reply;
	}
};
dooit.temporaries('career');
