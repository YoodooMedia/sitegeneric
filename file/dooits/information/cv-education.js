
var cv_education={
	value:'',
	experiencevalue:'',
	container:null,
	field:{name:'',id:''},
	experiencefield:{name:'',id:''},
	details:null,
	list:null,
	editing:-1,
	editingObject:-1,
	schools:[],
	schoolobjects:[],
	experience:[],
	title:'Your Qualifications and Training',
	teaser:'Tell us about your qualifications',
	months:['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
	init:function(key) {
		this.field.name=key;
		this.field.id=array_of_fields[key][0];
		this.value=array_of_fields[key][1];
		if (this.value!="") {
			try{
				eval('this.schools='+this.value+';');
			}catch(err){
			}
		}
		for(var s=0;s<this.schools.length;s++) {
			if (typeof(this.schools[s].experience)=="undefined") this.schools[s].experience=[];
		}
		
		this.container=$('.education').get(0);
		if (typeof(yoodoo)!="undefined" && yoodoo.dooittitle!="") this.title=yoodoo.dooittitle;
		if (typeof(yoodoo)!="undefined" && yoodoo.dooitteaser!="") this.teaser=yoodoo.dooitteaser;
		this.container.innerHTML='<h2>'+this.title+'</h2><div class="teaser">'+this.teaser+'</div>';
		this.details=document.createElement("div");
		$(this.details).addClass('details');
		this.list=document.createElement("div");
		$(this.list).addClass("list");
		this.container.appendChild(this.list);
		this.container.appendChild(this.details);
		var clr=document.createElement("div");
		$(clr).css('clear','both');
		$(clr).css('height','5px');
		this.container.appendChild(clr);
		if (this.schools.length==0) {
			this.list.innerHTML="<h2>You have not defined which schools you went to. Go back to the doo-it for your Education history</h2>";
		}else{
			this.listschools();
			for (var ex=0;ex<this.schools.length;ex++) {
				$(cv_education.schoolobjects[ex]).find('.count').html(this.schools[ex].experience.length);
			}
			var schls=$(this.list).find('.school').get();
			if (schls.length>0) this.edit(schls[0]);
		}
	},
	listschools:function() {
		var ins='<h3>Your education history</h3>';
		this.schools=this.schools.sort(this.byStartDate);
		ins+="<div class='schoolList'>";
		for(var i=0;i<this.schools.length;i++) ins+=this.schoolHTML(i);
		ins+="</div>";
		ins+="<div id='toedit'>click the school to edit your qualifications and experience you got from it</div>";
		//ins+="<button type='button' class='green'>add</button>";
		this.list.innerHTML=ins;
		$(this.list).find('.school').bind('click',function() {cv_education.edit(this);});
		$(this.list).find('button.green').bind('click',function() {cv_education.add(this);});
		this.toedit(this.schools.length>0);
		this.schoolobjects=$(this.list).find('.school').get(0);
	},
	toedit:function(show) {
		$('.education #toedit').css('display',show?'block':'none');
	},
	byStartDate:function(a,b) {
		return a.start-b.start;
	},
	schoolHTML:function(i) {
		var ins="<div class='school'><div><div class='dates'>"+this.months[this.schools[i].start.getMonth()]+' '+this.schools[i].start.getFullYear()+"<br />"+this.months[this.schools[i].finish.getMonth()]+' '+this.schools[i].finish.getFullYear()+'</div>';
		ins+="<div class='detail'>"+this.schools[i].school+'<br />'+this.schools[i].location+'</div><div class="fader count">'+this.schools[i].experience.length+'</div></div></div>';
		return ins;
	},
	edit:function(o) {
		this.editingObject=o;
		$(o).siblings('.school').removeClass("on");
		$(o).addClass("on");
		var prev=$(o).prevAll('.school').length;
		this.editing=prev;
		var ins='<h3>Experience and Qualifications</h3>';
		ins+="<div id='experienceHeading'><div>Subject</div><div class='medium'>Level</div><div class='short'>Grade</div></div>";
		ins+="<div id='experienceList'>";
		for(var i=0;i<this.schools[prev].experience.length;i++) {
			ins+="<div><input type='text' value='"+this.schools[prev].experience[i][0]+"' /><input type='text' value='"+this.schools[prev].experience[i][1]+"' class='medium' /><input type='text' value='"+this.schools[prev].experience[i][2]+"' class='short' /><button type='button' class='del'></button></div>";
			//ins+="<div><textarea>"+this.experience[prev][i]+"</textarea><button type='button' class='del'></button></div>";
		}
		ins+="</div>";
		ins+="<button type='button' class='green add'>add</button>";
		ins+="<button type='button' class='green save'>save</button>";
		
		this.details.innerHTML=ins;
		var isnew=$(this.details).html()=="";
		$(this.details).html(ins);
		if (isnew) {
			$(this.details).css("display","none");
			$(this.details).fadeIn('slow');
		}else{
			$(this.details).fadeTo('slow',1);
		}
		
		
		inputs.dropdown($(this.details).find("select").get(),{dropdownX:4,layout:inputs.layout.none});
		$(this.details).find('button.del').bind("click",function() {
			if (cv_education.editing>=0) {
				var i=$(this.parentNode).prevAll("div").get().length;
				cv_education.schools[cv_education.editing].experience.splice(i,1);
				$(this.parentNode).animate({height:'0px'},function() {$(this).remove();});
			}
		});
		
		$(this.details).find('button.add').bind("click",function() {
			if (cv_education.editing>=0) {
				var newitem=document.createElement("div");
				$(newitem).html("<input type='text' value='' /><input type='text' value='' class='medium' /><input type='text' value='' class='short' /><button type='button' class='del'></button>");
				$(newitem).css("display","none");
				$(cv_education.details).find('#experienceList').get(0).appendChild(newitem);
				//cv_education.schools[cv_education.editing].experience.push(['','','']);
				$(newitem).find('button.del').bind('click',function() {
					if (cv_education.editing>=0) {
						var i=$(this.parentNode).prevAll("div").get().length;
						cv_education.schools[cv_education.editing].experience.splice(i,1);
						$(this.parentNode).animate({height:'0px'},function() {$(this).remove();});
					}
				});
				$(newitem).slideDown('slow',function() {$(this).find("input").get(0).focus();});
			}
		});
		$(this.details).find('button.save').bind("click",function() {
			if (cv_education.editing>=0) {
				var cont=$(cv_education.details).find('#experienceList div').get();
				var vals=[];
				for(var j=0;j<cont.length;j++) {
					var ips=$(cont[j]).find('input').get();
					var toadd=[];
					for(var i=0;i<ips.length;i++) {
						toadd.push(ips[i].value);
					}
					//console.log(toadd);
					if (toadd[0]!="") {
						vals.push(toadd);
					}
				}
				cv_education.schools[cv_education.editing].experience=vals;
				$(cv_education.list).find('.school .count').get(cv_education.editing).innerHTML=vals.length;
				//$(cv_education.schoolobjects[cv_education.editing]).find('.count').html(vals.length);
				$(cv_education.details).fadeTo('slow',0.2);
				cv_education.editing=-1;
				$(cv_education.list).find('.school.on').removeClass("on");
			}
		});
	},
	output:function() {
		var op=this.json(this.schools);
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
dooit.temporaries('cv_education');
