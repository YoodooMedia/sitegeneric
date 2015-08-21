var life_skills={
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
	maximum:9,
	suggestionLimit:6,
	suggestMore:false,
	addCustom:true,
	title:'I\'ve got skills, they&apos;re multiplyin\'!',
	teaser:'You\'ve got more skills than you thought - discover them here!',
	shortlist:{
		title:'Find your skills',
		prompt:'What hobbies and interests do you have?<br />&nbsp;&nbsp;&nbsp;e.g. Astronomy, Chess, Genealogy...'
	},
	custominput:{
		title:'...or add some skills yourself!',
		prompt:'What other skills and abilities do you think you have?<br />&nbsp;&nbsp;&nbsp;e.g. Responsibility, Punctuality, Good with money...'
	},
	skillsbox:{
		title:'My Life Skills Box',
		prompt:'drag &amp; drop them into order - your best at the top'
	},
	suggestText:'We think <em>[activity]</em> involves these skills - click one or more to add them to your Life Skills Box',
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
			try{
				eval('this.hobbies='+v+';');
			}catch(err) {
			}
		}
		
		this.container=$('.skills').get(0);
		if (typeof(yoodoo)!="undefined" && yoodoo.dooittitle!="") this.title=yoodoo.dooittitle;
		if (typeof(yoodoo)!="undefined" && yoodoo.dooitteaser!="") this.teaser=yoodoo.dooitteaser;
		this.container.innerHTML='<h2>'+this.title+'</h2><div class="teaser">'+this.teaser+'</div>';
		var coleft=document.createElement("div");
		$(coleft).addClass('colleft');
		//this.container.appendChild(eez.createHTML("<h2>Your life skills...</h2>")[0]);
		var ins='<h3>'+this.shortlist.title+'</h3><div style="font-size:10px;margin:4px;">'+this.shortlist.prompt+'</div>';
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

		if(this.addCustom) {
			var ins='<h3>'+this.custominput.title+'</h3><div style="font-size:10px;margin:4px;">'+this.custominput.prompt+'</div>';
			ins+='<input type="text" id="ability" autocomplete="off" />';
			//ins+='<button type="button" id="selectAbility" class="green">add</button>';
			this.skill=document.createElement("div");
			this.skill.id='abilitySelector';
			$(this.skill).html(ins);
			coleft.appendChild(this.skill);
		}
		
		var rightColumn=document.createElement("div");
		$(rightColumn).addClass('colright');
		$(rightColumn).html("<h3>"+this.skillsbox.title+"</h3><div style='font-size:12px;margin:10px 0px;'>"+this.skillsbox.prompt+"</div>");
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
			this.suggestions(this.hobbies[0].name);
		}
		$(this.container).find('#ability').bind('keyup',function(e) {
			if (e.which==13) {
				if (this.value!="") {
					if (life_skills.items.length>=life_skills.maximum) {
						$(life_skills.warning).fadeOut(3000);
					}else{
						if (!life_skills.hasSkill(this.value)) {
							life_skills.add(this.value);
							this.value='';
						}
					}
				}
			}
		});
	},
	buildShortlists:function() {
		if (typeof(skills)=="undefined") {
			setTimeout('life_skills.buildShortlists();',100);
		}else{
			inputs.shortlist('#hobby',skills.activity,{width:200,offsetX:5,offsetY:1,callback:function(ip) {life_skills.suggestions(ip);}});
			inputs.shortlist('#ability',skills.skills,{autocomplete:false,width:200,offsetX:5,offsetY:1,callback:function(ip) {life_skills.add(ip);}});
			$('#ability').bind("keyup",function(e) {
				if(e.which==13 && $(this).val()!='') {
					life_skills.add($(this).val());
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
			life_skills.remove(this.parentNode);
		});
		this.defineReorder();
	},
	suggestions:function(activity) {
		var actIndex=-1;
		this.suggestionList.innerHTML='';
		for(var i=0;i<skills.activity.length;i++) {
			if (skills.activity[i]==activity) actIndex=i;
			//console.log(skills.activity[i]+'=='+activity);
		}
		this.suggestionList.innerHTML='<div class="fade"></div><div class="guidelines">'+this.suggestText.replace(/\[activity\]/,activity)+'</div>';
		//this.suggestionList.innerHTML='<div class="fade"></div><div class="guidelines">We think <em>'+activity+'</em> involves these skills - click one or more to add them to your Life Skills Box</div>';
		this.selectedHobby=activity;
		/*inputs.dropdown('#hobbyList',{layout:inputs.layout.none,width:146,dropdownX:2,onSelect:function(o) {
			life_skills.suggestions(o.value);
		}});*/
		if (actIndex>=0) {
			var sugs=[];
			for(i=0;i<skills.linked[actIndex].length;i++) {
				if (skills.linked[actIndex][i]>0) sugs.push([skills.skills[i],skills.linked[actIndex][i]]);
			}
			sugs=sugs.sort(life_skills.suggestionSort);
			for(var v=0;v<sugs.length;v++) {
				if (!this.hasSkill(sugs[v][0])) {
					if (v<this.suggestionLimit || this.suggestMore) {
						var sug=document.createElement("div");
						$(sug).addClass("suggestion");
						if (v>=this.suggestionLimit) {
							$(sug).addClass("off");
							$(sug).css("display","none");
						}
						$(sug).html(sugs[v][0]);
						this.suggestionList.appendChild(sug);
					}
				}
			}
			$('.list .suggestion').bind("click",function(e) {
				var o=this;
				if (!$(this).hasClass("off")) {
					if (life_skills.items.length>=life_skills.maximum) {
						$(life_skills.warning).css('display','block');
						$(life_skills.warning).fadeOut(2000);
					}else{
						life_skills.add(o.innerHTML);
						var con=document.createElement("div");
						$(con).css("display","block");
						$(con).css("float","left");
						$(con).css("width",$(o).outerWidth(true)+"px");
						$(con).css("height",$(o).outerHeight(true)+"px");
						o.parentNode.insertBefore(con,o);
						con.appendChild(o);
						$(o).css("position","relative");
						$(o).css("top","0px");
						$(o).animate({top:'20px',opacity:"0"},500,function() {
							$(this.parentNode).animate({width:'0px'},500,function() {
								var n=$(this.parentNode).find('.suggestion.off').get(0);
								$(n).removeClass("off");
								$(n).fadeIn(500);
								$(this).remove();
							});
						});
					}
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
		life_skills.hobbies=life_skills.hobbies.sort();
		var op='<select id="hobbyList">';
		for(var h=0;h<life_skills.hobbies.length;h++) {
			op+="<option value='"+life_skills.hobbies[h]+"'";
			if (life_skills.hobbies[h]==n) op+=" selected";
			op+=">"+life_skills.hobbies[h]+"</option>";
		}
		op+='</select>';
		return op;
	},
	add:function(n) {
		if (!this.hasSkill(n)) {
			if (this.selectedHobby!='') {
				var actIndex=-1;
				for(var i=0;i<life_skills.hobbies.length;i++) {
					if (life_skills.hobbies[i].name==this.selectedHobby) actIndex=i;
				}
				if (actIndex<0) life_skills.hobbies.push({name:this.selectedHobby});
			}
			this.items.push(n);
			this.listSkills();
		}
	},
	defineReorder:function(){
		var objs={containers:'#skillorder',items:'.item',hotspots:".move",area:".move"};
		var opts={offsetX:-15,offsetY:-15,callback:function(neworder) {life_skills.setOrder(neworder[0]);}};
		$('#skillorder').sortable({handle:'.move',update:function(e,ui){life_skills.setOrder(ui);}});
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
			if (this.hobbies[s].name==n) return true;
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
				this.parentNode.removeChild(this);
				life_skills.listSkills();
				life_skills.suggestions(life_skills.selectedHobby);
			});
		});
	},
	suggestionSort:function(a,b) {
		return b[1]-a[1];
	},
	output:function() {
		array_of_fields[this.key][1]=this.items.join("|");
		array_of_fields[this.hobbyKey][1]=this.json(this.hobbies);
		var reply={};
		eval('reply.EF'+array_of_fields[this.key][0]+'=array_of_fields[this.key][1];');
		eval('reply.EF'+array_of_fields[this.hobbyKey][0]+'=array_of_fields[this.hobbyKey][1];');
		//console.log(reply);
		return reply;
	},
	finishable:function() {
		return (this.items.length>0);
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
dooit.temporaries('life_skills');
