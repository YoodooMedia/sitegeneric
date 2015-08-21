
var education={
	value:'',
	container:null,
	field:{name:'',id:''},
	details:null,
	list:null,
	editing:-1,
	editingObject:-1,
	schools:[],
	currentlyEditing:false,
	title:'Your Schools and Colleges',
	teaser:'Tell us where you&#39;ve studied',
	months:['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
	init:function(key) {
		this.field.name=key;
		this.field.id=array_of_fields[key][0];
		this.value=array_of_fields[key][1];
		if (this.value!="") {
			try{
				eval('this.schools='+this.value+';');
			}catch(err) {
			}
		}
		this.container=$('.education').get(0);
		if (typeof(yoodoo)!="undefined" && yoodoo.dooittitle!="") this.title=yoodoo.dooittitle;
		if (typeof(yoodoo)!="undefined" && yoodoo.dooitteaser!="") this.teaser=yoodoo.dooitteaser;
		this.container.innerHTML='<h2>'+this.title+'</h2><div class="teaser">'+this.teaser+'</div>';
		this.details=document.createElement("div");
		$(this.details).addClass("details");
		//fader(this.details,0);
		this.list=document.createElement("div");
		$(this.list).addClass("list");
		this.container.appendChild(this.list);
		this.container.appendChild(this.details);
		var clr=document.createElement("div");
		$(clr).css('clear','both');
		$(clr).css('height','5px');
		this.container.appendChild(clr);
		this.listschools();
	},
	listschools:function() {
		var ins='<h3>Where and when...</h3>';
		this.schools=this.schools.sort(this.byStartDate);
		ins+="<div class='schoolList'>";
		ins+="</div>";
		ins+="<div id='toedit'>click to edit it</div>";
		ins+="<button type='button' class='green'>add</button>";
		this.list.innerHTML=ins;
		var tmp=$(this.list).find('.schoolList').get(0);
		for(var i=0;i<this.schools.length;i++) tmp.appendChild(this.schoolHTML(i));
		$(this.list).find('.school').bind("click",function() {education.edit(this);});
		$(this.list).find('button.green').bind("click",function() {education.add(this);});
		
		this.toedit(this.schools.length>0);
	},
	toedit:function(show) {
		
		$('.education #toedit').css('display',show?'block':'none');
	},
	byStartDate:function(a,b) {
		return b.start-a.start;
	},
	schoolHTML:function(i) {
		var ins="<div><div class='dates'>"+this.months[this.schools[i].start.getMonth()]+' '+this.schools[i].start.getFullYear()+"<br />"+this.months[this.schools[i].finish.getMonth()]+' '+this.schools[i].finish.getFullYear()+'</div>';
		ins+="<div class='detail'>"+((this.schools[i].school=='')?'school':this.schools[i].school)+'<br />'+((this.schools[i].location=='')?'location':this.schools[i].location)+'</div><div class="fader count"></div></div>';
		var tmp=document.createElement("div");
		$(tmp).addClass("school");
		$(tmp).html(ins);
		return tmp;
	},
	add:function(o) {
		var job={start:new Date(),finish:new Date(),school:'school',location:'location'};
		job.start.setMonth(8);
		job.finish.setMonth(5);
		this.schools.push(job);
		var newjob=this.schoolHTML(this.schools.length-1);
		$(newjob).css("display","none");
		//fader(newjob,0);
		var jl=$(this.list).find('.schoolList').get(0);
		jl.appendChild(newjob);
		$(newjob).slideDown("slow",function() {
			$(this).bind("click",function() {education.edit(this);});
			education.edit(this);
			var jl=$(education.list).find('.schoolList').get(0);
			jl.scrollTop=(education.schools.length-5)*53;
		});
	},
	edit:function(o) {
		this.currentlyEditing=true;
		this.editingObject=o;
		$(o).siblings('.school').removeClass("on");
		$(o).addClass("on");
		var prev=$(o).prevAll(".school").get().length;
		this.editing=prev;
		var ins='<h3>Edit</h3>';
		ins+="<div>School:<br /><input id='schoolName' type='text' value='"+((this.schools[prev].school=='school')?'':this.schools[prev].school)+"' /></div>";
		ins+="<div>Location:<br /><input id='locationName' type='text' value='"+((this.schools[prev].location=='location')?'':this.schools[prev].location)+"' /></div>";
		ins+="<div><div style='clear:both'>When did you start?</div>"+this.selectMonth('startMonth',this.schools[prev].start.getMonth())+"&nbsp;"+this.selectYear('startYear',this.schools[prev].start.getFullYear())+"</div>";
		ins+="<div><div style='clear:both'>When did you leave?</div>"+this.selectMonth('finishMonth',this.schools[prev].finish.getMonth())+"&nbsp;"+this.selectYear('finishYear',this.schools[prev].finish.getFullYear())+"</div>";
		ins+="<div style='clear:both'><button type='button' class='green'>save</button>";
		ins+="<button type='button' class='red' style='float:left'>delete</button></div>";
		//eez.replaceHTML(this.details,ins);
		var isnew=$(this.details).html()=="";
		$(this.details).html(ins);
		if (isnew) {
			$(this.details).css("display","none");
			$(this.details).fadeIn('slow');
		}else{
			$(this.details).fadeTo('slow',1);
		}
		inputs.dropdown($(this.details).find('select').get(),{dropdownX:4,layout:inputs.layout.none});
		$(this.details).find('button.green').bind("click",function() {education.saveDetail();});
		$(this.details).find('button.red').bind("click",function() {education.removeDetail();});
	},
	saveDetail:function() {
		if (this.currentlyEditing) {
			$(this.list).find('.school').removeClass("on");
			this.schools[this.editing].school=$('#schoolName').val();
			this.schools[this.editing].location=$('#locationName').val();
			this.schools[this.editing].start=new Date($('#startYear').val(),$('#startMonth').val(),1,0,0,0,0);
			this.schools[this.editing].finish=new Date($('#finishYear').val(),$('#finishMonth').val(),1,0,0,0,0);
			$(this.details).fadeTo('slow',0.2);
			this.currentlyEditing=false;
			this.listschools();
		}
	},
	removeDetail:function() {
		if (this.currentlyEditing) {
			$(this.list).find('.school').removeClass("on");
			$(this.details).fadeTo('slow',0.2);
			this.schools.splice(this.editing,1);
			$(this.editingObject).animate({height:'0px'},function() {
				$(this).remove();
				education.schools.splice(education.editing,1);
			});
			this.currentlyEditing=false;
			//this.listschools();
		}
	},
	selectMonth:function(id,v) {
		var ins='<select id="'+id+'">';
		for(var i=0;i<this.months.length;i++) {
			ins+="<option value='"+i+"'";
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
		var op=(dooit.json(this.schools));
		/*for(var j=0;j<this.schools.length;j++) {
			op.push(this.schools[j].start.getMonth()+":"+this.schools[j].start.getFullYear()+"~"+this.schools[j].finish.getMonth()+":"+this.schools[j].finish.getFullYear()+"~"+this.schools[j].school.replace('~','').replace('|','')+"~"+this.schools[j].location.replace('~','').replace('|',''));
		}*/
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
dooit.temporaries('education');
