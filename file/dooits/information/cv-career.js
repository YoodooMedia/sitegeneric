
var cv_career={
	value:'',
	experiencevalue:'',
	container:null,
	field:{name:'',id:''},
	experiencefield:{name:'',id:''},
	details:null,
	list:null,
	editing:-1,
	editingObject:-1,
	jobs:[],
	jobobjects:[],
	experience:[],
	title:'Your job experience',
	teaser:'Tell us about the things you&#39;ve done and learned at work',
	months:['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
	init:function(key,experienceKey) {
		this.field.name=key;
		this.field.id=array_of_fields[key][0];
		this.value=array_of_fields[key][1];
		if (this.value!="") {
			try{
				eval('this.jobs='+this.value+';');
			}catch(err) {
			}
		}
		for(var s=0;s<this.jobs.length;s++) {
			if (typeof(this.jobs[s].experience)=="undefined") this.jobs[s].experience=[];
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
		$(clr).css('clear','both');
		$(clr).css('height','5px');
		this.container.appendChild(clr);
		if (this.jobs.length==0) {
			this.list.innerHTML="<h2>You have not defined any jobs you have had. Go back to the doo-it for your Employment history</h2>";
		}else{
			this.listJobs();
			for (var ex=0;ex<this.experience.length;ex++) {
				$(cv_career.jobobjects[ex]).find('.count').html(this.experience[ex].length);
			}
			this.edit($(this.list).find('.job:first'));
		}
	},
	listJobs:function() {
		var ins='<h3>Your career history</h3>';
		this.jobs=this.jobs.sort(this.byStartDate);
		ins+="<div class='jobList'>";
		for(var i=0;i<this.jobs.length;i++) ins+=this.jobHTML(i);
		ins+="</div>";
		ins+="<div id='toedit'>click the job to edit your qualifications and experience you got from it</div>";
		//ins+="<button type='button' class='green'>add</button>";
		this.list.innerHTML=ins;
		$(this.list).find('.job').bind('click',function() {cv_career.edit(this);});
		$(this.list).find('button.green').bind("click",function() {cv_career.add(this);});
		this.toedit(this.jobs.length>0);
		this.jobobjects=$(this.list).find('.job').get();
	},
	toedit:function(show) {
		$('.career #toedit').css('display',show?'block':'none');
	},
	byStartDate:function(a,b) {
		return a.start-b.start;
	},
	jobHTML:function(i) {
		var ins="<div class='job'><div><div class='dates'>"+this.months[this.jobs[i].start.getMonth()]+' '+this.jobs[i].start.getFullYear()+"<br />"+this.months[this.jobs[i].finish.getMonth()]+' '+this.jobs[i].finish.getFullYear()+'</div>';
		ins+="<div class='detail'>"+((this.jobs[i].position=='')?'Position':this.jobs[i].position)+'<br />'+((this.jobs[i].company=='')?'Company':this.jobs[i].company)+'</div><div class="fader count"></div></div></div>';
		return ins;
	},
	edit:function(o) {
		this.editingObject=o;
		$(o).siblings('.job').removeClass("on");
		$(o).addClass("on");
		var prev=$(o).prevAll('.job').length;
		this.editing=prev;
		var ins='<h3>Experience or Qualifications</h3>';
		ins+="<div id='experienceList'>";
		for(var i=0;i<this.jobs[prev].experience.length;i++) {
			ins+="<div><textarea>"+this.jobs[prev].experience[i]+"</textarea><button type='button' class='del'></button></div>";
		}
		ins+="</div>";
		ins+="<button type='button' class='green add'>add</button>";
		ins+="<button type='button' class='green save'>save</button>";
		
		this.details.innerHTML=ins;
		$(this.details).fadeTo('slow',1);
		//inputs.dropdown(ob('select',this.details),{dropdownX:4,layout:inputs.layout.none});
		$(this.details).find('button.del').bind('click',function() {
			$(this.parentNode).slideUp('slow',function() {$(this).remove();});
		});
		$(this.details).find('button.add').bind('click',function() {
			var newitem=document.createElement("div");
			$(newitem).html("<textarea></textarea><button type='button' class='del'></button>");
			$(newitem).css("display","none");
			$(cv_career.details).find('#experienceList').get(0).appendChild(newitem);
			$(newitem).find('button.del').bind("click",function() {
				$(this.parentNode).slideUp('slow',function() {$(this).remove();});
			});
			$(newitem).slideDown('slow',function() {$(this).find("textarea").get(0).focus();});
		});
		
		$(this.details).find('button.save').bind('click',function() {
			var ips=$(cv_career.details).find('textarea').get();
			var vals=[];
			for(var i=0;i<ips.length;i++) {
				if (ips[i].value!="") vals.push(ips[i].value);
			}
			cv_career.jobs[cv_career.editing].experience=vals;
			$(cv_career.jobobjects[cv_career.editing]).find('.count').html(vals.length);
			$(cv_career.details).fadeTo('slow',0.2);
			//fade.start(cv_career.details,{from:100,to:0,callback:function(o) {o.innerHTML='';}});
		});
	},
	output:function() {
		var op=this.json(this.jobs);
		array_of_fields[this.field.name][1]=op;
		var reply={};
		eval('reply.EF'+array_of_fields[this.field.name][0]+'=op;');
		return reply;
	},
	json:function(o) {
		if (typeof(o)=="string") {
			return '"'+o.replace(/"/g,'\\"')+'"';
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
	}
};
dooit.temporaries('cv_career');
