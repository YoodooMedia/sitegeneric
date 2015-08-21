
var work_skills={
	key:'',
	hobbyKey:'',
	container:null,
	hobby:null,
	skill:null,
	creator:null,
	list:null,
	items:[],
	hobbies:[],
	selection:{},
	maximum:10,
	title:'Transferable Skills',
	teaser:'Use the skills you&rsquo;ve got to broaden your horizons',
	init:function(key,hobbyKey) {
		this.key=key;
		this.hobbyKey=hobbyKey;
		var v=array_of_fields[key][1];
		if (v=='') {
			this.items=[];
		}else{
			this.items=v.split('|');
		}
		v=array_of_fields[hobbyKey][1];
		if (v=='') {
			this.hobbies=[];
		}else{
			this.hobbies=v.split('|');
		}
		this.container=$('.skills').get(0);
		if (typeof(yoodoo)!="undefined" && yoodoo.dooittitle!="") this.title=yoodoo.dooittitle;
		if (typeof(yoodoo)!="undefined" && yoodoo.dooitteaser!="") this.teaser=yoodoo.dooitteaser;
		this.container.innerHTML='<h2>'+this.title+'</h2><div class="teaser">'+this.teaser+'</div>';
		var coleft=document.createElement("div");
		$(coleft).addClass('colleft');
		var ins='<h3>Suggest some skills</h3><div style="font-size:10px;margin:4px;">What kind of jobs have you done?<br />&nbsp;&nbsp;&nbsp;e.g. Retail, Chef, Plumber...</div>';
		ins+='<input type="text" id="hobby" autocomplete="off" />';
		//ins+='<button type="button" id="selectHobby" class="green">add</button>';
		this.hobby=document.createElement("div");
		this.hobby.id='hobbySelector';
		$(this.hobby).html(ins);
		coleft.appendChild(this.hobby);
		
		this.suggestionList=document.createElement("div");
		$(this.suggestionList).addClass("suggestList");
		coleft.appendChild(this.suggestionList);
		this.list=document.createElement("div");
		$(this.list).addClass("list");
		
		var ins='<h3>...or add some skills yourself!</h3><div style="font-size:10px;margin:4px;">What other skills do you think you have?<br />&nbsp;&nbsp;&nbsp;e.g. Time management, organisation, managing money...</div>';
		ins+='<input type="text" id="ability" autocomplete="off" />';
		//ins+='<button type="button" id="selectAbility" class="green">add</button>';
		this.skill=document.createElement("div");
		this.skill.id='abilitySelector';
		$(this.skill).html(ins);
		coleft.appendChild(this.skill);
		
		var rightColumn=document.createElement("div");
		$(rightColumn).addClass('colright');
		$(rightColumn).html("<h3>My Transferable Skills Box</h3><div style='font-size:12px;margin:10px 0px;'>drag &amp; drop them into order - your best at the top</div>");
		this.skillsList=document.createElement("div");
		this.skillsList.id='skillorder';
		this.warning=document.createElement("div");
		$(this.warning).addClass("warning");
		$(this.warning).html("too many");
		this.list.appendChild(coleft);
		this.list.appendChild(rightColumn);
		rightColumn.appendChild(this.skillsList);
		rightColumn.appendChild(this.warning);
		var clr=document.createElement("div");
		$(clr).css('clear','both');
		this.list.appendChild(clr);
		
		this.container.appendChild(this.list);
		this.listSkills();
		this.buildShortlists();
		if (this.hobbies.length>0) {
			this.suggestions(this.hobbies[0]);
		}
		$(this.container).find('#ability').bind('keyup',function(e) {
			if (e.which==13) {
				if (this.value!="") {
					if (work_skills.items.length>=work_skills.maximum) {
						$(work_skills.warning).fadeOut(3000);
					}else{
						if (!work_skills.hasSkill(this.value)) {
							work_skills.add(this.value);
							this.value='';
						}
					}
				}
			}
		});
	},
	buildShortlists:function() {
		if (typeof(transferable)=="undefined") {
			setTimeout('work_skills.buildShortlists();',100);
		}else{
			inputs.shortlist('#hobby',transferable.job,{width:250,offsetX:5,offsetY:1,callback:function(ip) {work_skills.suggestions(ip);}});
			inputs.shortlist('#ability',transferable.skills,{width:250,offsetX:5,offsetY:1,callback:function(ip) {work_skills.add(ip);}});
			$('#ability').bind("keyup",function(e) {
				if(e.which==13 && $(this).val()!='') {
					work_skills.add($(this).val());
					$(this).val("");
				}
			});
		}
	},
	listSkills:function() {
		$(this.skillsList).find('.item').remove();
		$(this.skillsList).find('.spacer').remove();
		
		for(var v=0;v<this.items.length;v++) {
			var newItem=document.createElement("div");
			$(newItem).addClass('item');
			$(newItem).html("<div class='move'>"+this.items[v]+"</div><div class='delete'></div>");
			this.skillsList.appendChild(newItem);
		}
		$(this.skillsList).find('.item div.delete').bind('click',function() {
			$(this).unbind('click');
			work_skills.remove(this.parentNode);
		});
		this.defineReorder();
	},
	suggestions:function(activity) {
		var actIndex=-1;
		this.suggestionList.innerHTML='';
		for(var i=0;i<transferable.job.length;i++) {
			if (transferable.job[i]==activity) actIndex=i;
		}
		this.suggestionList.innerHTML=(this.hobbies.length==0)?'':'<div class="fade"></div><div class="guidelines">We think <em>'+activity+'</em> involves these skills - click one or more to add them to your Transferable Skills Box</div>';
		this.selectedHobby=activity;
		/*inputs.dropdown('#hobbyList',{layout:inputs.layout.none,width:146,dropdownX:2,onSelect:function(o) {
			work_skills.suggestions(o.value);
		}});*/
		if (actIndex>=0) {
			var sugs=[];
			for(i=0;i<transferable.linked[actIndex].length;i++) {
				if (transferable.linked[actIndex][i]>0) sugs.push([transferable.skills[i],transferable.linked[actIndex][i]]);
			}
			sugs=sugs.sort(work_skills.suggestionSort);
			for(var v=0;v<sugs.length;v++) {
				if (!this.hasSkill(sugs[v][0])) {
					var sug=document.createElement("div");
					$(sug).addClass("suggestion");
					$(sug).html(sugs[v][0]);
					this.suggestionList.appendChild(sug);
				}
			}
			$('.list .suggestion').bind("click",function(e) {
				var o=this;
				if (work_skills.items.length>=work_skills.maximum) {
					$(work_skills.warning).css('display','block');
					$(work_skills.warning).fadeOut(2000);
				}else{
					work_skills.add(o.innerHTML);
					
					$(o).fadeOut('slow',function() {
						$(o).animate({height:'0px'},500,function() {
							this.parentNode.removeChild(this);
						});
					});
				}
			});
			$(this.suggestionList).fadeIn();
		}
	},
	removeHobby:function(activity) {
		for(var i=this.hobbies.length-1;i>=0;i--) {
			if (this.hobbies[i]==activity) this.hobbies.splice(i,1);
		}
		this.suggestions((this.hobbies.length==0)?'':this.hobbies[0]);
	},
	hobbySelect:function(n) {
		work_skills.hobbies=work_skills.hobbies.sort();
		var op='<select id="hobbyList">';
		for(var h=0;h<work_skills.hobbies.length;h++) {
			op+="<option value='"+work_skills.hobbies[h]+"'";
			if (work_skills.hobbies[h]==n) op+=" selected";
			op+=">"+work_skills.hobbies[h]+"</option>";
		}
		op+='</select>';
		return op;
	},
	add:function(n) {
		if (!this.hasSkill(n)) {
			if (this.selectedHobby!='') {
				var actIndex=-1;
				for(var i=0;i<work_skills.hobbies.length;i++) {
					if (work_skills.hobbies[i]==this.selectedHobby) actIndex=i;
				}
				if (actIndex<0) work_skills.hobbies.push(this.selectedHobby);
			}
			this.items.push(n);
			this.listSkills();
		}
	},
	defineReorder:function(){
		var objs={containers:'#skillorder',items:'.item',hotspots:".move",area:".move"};
		var opts={offsetX:-15,offsetY:-15,callback:function(neworder) {work_skills.setOrder(neworder[0]);}};
		$('#skillorder').sortable({handle:'.move',update:function(e,ui){work_skills.setOrder(ui);}});
	},
	setOrder:function(ui) {
		var o=[];
		var neworder=$(ui.item[0].parentNode).find('.move').get();
		for(var k=0;k<neworder.length;k++) {
			o.push(neworder[k].innerHTML);
		}
		this.items=o;
	},
	hasSkill:function(n) {
		for(var s=0;s<this.items.length;s++) {
			if (this.items[s]==n) return true;
		}
		return false;
	},
	hasHobby:function(n) {
		for(var s=0;s<this.hobbies.length;s++) {
			if (this.hobbies[s]==n) return true;
		}
		return false;
	},
	remove:function(o) {
		var s=$(o).find('.move').html();
		for(var i=this.items.length-1;i>=0;i--) {
			if (s==this.items[i]) this.items.splice(i,1);
		}
		$(o).fadeOut(500,function() {
			$(this).animate({height:'0px'},function() {
				$(this).remove();
				//this.parentNode.removeChild(this);
				work_skills.listSkills();
				work_skills.suggestions(work_skills.selectedHobby);
			});
		});
	},
	suggestionSort:function(a,b) {
		return b[1]-a[1];
	},
	output:function() {
		array_of_fields[this.key][1]=this.items.join("|");
		array_of_fields[this.hobbyKey][1]=this.hobbies.join("|");
		var reply={};
		eval('reply.EF'+array_of_fields[this.key][0]+'=array_of_fields[this.key][1];');
		eval('reply.EF'+array_of_fields[this.hobbyKey][0]+'=array_of_fields[this.hobbyKey][1];');
		//console.log(reply);
		return reply;
	},
	finishable:function() {
		return (this.items.length>0);
	}
};
dooit.temporaries('work_skills');
