
var hobbies={
	key:'',
	hobbyKey:'',
	container:null,
	hobby:null,
	editor:null,
	editing:-1,
	creator:null,
	list:null,
	left:null,
	right:null,
	items:[],
	hobbies:[],
	selection:{},
	title:'Your Hobbies and Experience',
	teaser:'What do you do for fun?',
	init:function(key) {
		this.key=key;
		var v=array_of_fields[key][1];
		if (v=='') {
			this.hobbies=[];
		}else{
			try{
				eval("this.hobbies="+v+";");
			}catch(err){
			}
		}
		for(var h=0;h<this.hobbies.length;h++) {
			if (typeof(this.hobbies[h].description)=="undefined") this.hobbies[h].description='';
		}
		this.container=$('.hobbiesDetails').get(0);
		this.left=this.createElement('div',null,'leftCol',null);
		this.right=this.createElement('div',null,'rightCol',null);
		if (typeof(yoodoo)!="undefined" && yoodoo.dooittitle!="") this.title=yoodoo.dooittitle;
		if (typeof(yoodoo)!="undefined" && yoodoo.dooitteaser!="") this.teaser=yoodoo.dooitteaser;
		this.container.innerHTML='<h2>'+this.title+'</h2><div class="teaser">'+this.teaser+'</div>';
		this.container.appendChild(this.left);
		this.container.appendChild(this.right);
		this.container.appendChild(this.createElement('div',null,null,{clear:'both'}));
		var ins='<div style="padding:10px">Say something about your hobbies and interests that could be useful for your CV.<div id="hobbyprompt">Click a hobby below to edit it.</div></div><div class="hobbylist"></div>';
		this.hobby=this.createElement("div",'hobbySelector',null,null);
		$(this.hobby).html(ins);
		this.left.appendChild(this.hobby);
		this.list=$(this.hobby).find('.hobbylist').get(0);
		
		this.editor=this.createElement("div",'hobbyedit',null,null);
		this.right.appendChild(this.editor);
		this.listHobbies();
		this.edit(0);
	},
	listHobbies:function() {
		var ins='';
		for (var h=0;h<this.hobbies.length;h++) {
			ins+="<button type='button' class='hobbyitem"+((this.hobbies[h].description!="")?" notempty":"")+"'>"+this.hobbies[h].name+"</button>";
		}
		ins+="<div>Add a hobby<br /><input type='text' /><button type='button' class='green'>add</button></div>";
		$(this.list).html(ins);
		$(this.list).find("button.hobbyitem").bind("click",function() {
			var idx=$(this).prevAll("button.hobbyitem").get().length;
			hobbies.edit(idx);
		});
		$(this.list).find("button.green").bind('click',function() {
			var ip=$(this).prevAll('input').get(0);
			var newhobby=ip.value;
			if (newhobby!="") {
				hobbies.hobbies.push({name:newhobby,description:''});
				var newbutton=hobbies.createElement("button",null,'hobbyitem',null);
				$(newbutton).html(newhobby);
				$(newbutton).css("display","none");
				hobbies.list.insertBefore(newbutton,ip.parentNode);
				$(newbutton).slideDown();
				$(newbutton).bind("click",function() {
					var idx=$(this).prevAll("button.hobbyitem").get().length;
					hobbies.edit(idx);
				});
				hobbies.edit(hobbies.hobbies.length-1);
			}
			ip.value='';
		});
		
		$(this.list).find('input').bind('keyup',function(e) {
			if (e.which==13) {
				var newhobby=this.value;
				if (newhobby!="") {
					hobbies.hobbies.push({name:newhobby,description:''});
					hobbies.checkPrompt();
					var newbutton=hobbies.createElement("button",null,'hobbyitem',null);
					$(newbutton).html(newhobby);
					$(newbutton).css("display","none");
					hobbies.list.insertBefore(newbutton,this.parentNode);
					$(newbutton).slideDown();
					$(newbutton).bind("click",function() {
						var idx=$(this).prevAll("button.hobbyitem").get().length;
						hobbies.edit(idx);
					});
				}
				hobbies.edit(hobbies.hobbies.length-1);
				this.value='';
			}
		});
		this.checkPrompt();
	},
	checkPrompt:function() {
		if (this.hobbies.length>0) {
			if($('#hobbyprompt').css("display")=="none") $('#hobbyprompt').slideDown();
		}else{
			if($('#hobbyprompt').css("display")!="none") $('#hobbyprompt').slideUp();
		}
	},
	edit:function(idx) {
		if (this.hobbies.length==0) {
			$(this.editor).html("<div><h3>Tell us a bit more about your hobby...</h3>You have no hobbies defined. Add some on the left.<div class='textarea'>A hobby description</div><button type='button' class='green save'>save</button></div>");
			$(this.editor).fadeTo(0,0.2);
		}else{
			if (this.editing>=0) $(this.list).find("button.on").removeClass("on");
			this.editing=idx;
			$($(this.list).find("button").get(this.editing)).addClass("on");
			var txt=this.hobbies[idx].description;
			if (txt=='') txt=this.hobbies[idx].name;
			var sug=this.hobbies[idx].name+' is something I do at least once a week, which also has a great social life.';
			//var tmp=this.createElement('div',null,null,null);
			$(this.editor).html("<div><h3>Tell us a bit more about "+this.hobbies[idx].name+"...</h3>e.g. "+sug+"<textarea>"+txt+"</textarea><button type='button' class='green save'>save</button><button type='button' class='red delete'>delete</button></div>");
			//this.editor.appendChild(tmp);
			$(this.editor).fadeTo('slow',1);
			$(this.editor).find("button.save").bind("click",function() {
				if (hobbies.editing>=0) {
					var val=$(hobbies.editor).find('textarea').val();
					if (val==hobbies.hobbies[hobbies.editing].name) val='';
					if (val=='') {
						$($(hobbies.list).find('button').get(hobbies.editing)).removeClass("notempty");
					}else{
						$($(hobbies.list).find('button').get(hobbies.editing)).addClass("notempty");
					}
					$($(hobbies.list).find('button').get(hobbies.editing)).removeClass("on");
					hobbies.hobbies[hobbies.editing].description=val;
					$(hobbies.editor).fadeTo('slow',0.2);
					hobbies.editing=-1;
				}
			});
			$(this.editor).find("button.delete").bind("click",function() {
				if (hobbies.editing>=0) {
					hobbies.hobbies.splice(hobbies.editing,1);
					$($(hobbies.list).find('button').get(hobbies.editing)).animate({height:'0px'},function() {$(this).remove();});
					$(hobbies.editor).fadeTo('slow',0.2);
					hobbies.editing=-1;
					hobbies.checkPrompt();
				}
			});
		}
	},
	output:function() {
		array_of_fields[this.key][1]=this.json(this.hobbies);
		var reply={};
		eval('reply.EF'+array_of_fields[this.key][0]+'=array_of_fields[this.key][1];');
		return reply;
	},
	createElement:function(tag,id,className,styles) {
		var tmp=document.createElement(tag);
		if (id!==null) tmp.id=id;
		if (className!==null) $(tmp).addClass(className);
		if (styles!==null) {
			for(var s in styles) {
				if (typeof(styles[s])=="string") $(tmp).css(s,styles[s]);
			}
		}
		return tmp;
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
dooit.temporaries('hobbies');
