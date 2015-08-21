
var dreams={
	value:'',
	container:null,
	buttons:null,
	creator:null,
	maxDreams:4,
	list:null,
	dreams:[],
	types:['visit','buy','live','do','other'],
	typeIndex:-1,
	inputQuestions:['I have always wanted to visit','I have always wanted to buy','I have always wanted to live','I have always wanted to do','I have always dreamt of'],
	field:{name:'',id:0},
	disabled:true,
	maxedOut:false,
	title:'Follow your dreams!',
	teaser:'Follow your dreams and they might happen! Pick something you&#39;d love to do...',
	init:function(key) {
		this.field.name=key;
		this.field.id=array_of_fields[key][0];
		this.value=array_of_fields[key][1];
		this.container=$('.dreams').get(0);
		if (typeof(yoodoo)!="undefined" && yoodoo.dooittitle!="") this.title=yoodoo.dooittitle;
		if (typeof(yoodoo)!="undefined" && yoodoo.dooitteaser!="") this.teaser=yoodoo.dooitteaser;
		this.container.innerHTML='<h2>'+this.title+'</h2><div class="teaser">'+this.teaser+'</div>';
		var ins='<h3 style="text-align:center">My dream has always been to...</h2>';
		for(var i=0;i<this.types.length;i++) {
			ins+="<button type='button' class='"+this.types[i]+"'></button>";
		}
		this.buttons=document.createElement("div");
		$(this.buttons).addClass("buttons");
		$(this.buttons).html(ins);
		this.container.appendChild(this.buttons);
		this.creator=document.createElement("div");
		$(this.creator).addClass("creator");
		var ins=dreams.inputQuestions[4]+"&hellip;&nbsp;";
		ins+="<input type='text' /><button type='button' class='green medium'>add this dream</button>";
		$(dreams.creator).html(ins);
		$(dreams.creator).fadeTo('fast',0.2);
		this.container.appendChild(this.creator);
		var listcontainer=document.createElement("div");
		$(listcontainer).addClass("list");
		this.list=document.createElement("div");
		var clr=document.createElement("div");
		$(clr).css("clear","both");
		listcontainer.appendChild(this.list);
		listcontainer.appendChild(clr);
		this.container.appendChild(listcontainer);
		$(this.buttons).find('button').bind('click',function(e) {
			if (!dreams.maxedOut) {
				var i=$(this).prevAll('button').get().length;
				dreams.typeIndex=i;
				dreams.disabled=false;
				var ins=dreams.inputQuestions[i]+"&hellip;&nbsp;";
				ins+="<input type='text' /><button type='button' class='green medium'>add this dream</button>";
				dreams.creator.innerHTML=ins;
				$(dreams.creator).fadeTo("slow",1,function() {
					$(dreams.creator).find('input').get(0).focus();
				});
				$(dreams.creator).find('button.green').bind('click',function() {
					if (!dreams.disabled) {
						var ip=$(dreams.creator).find("input").val();
						if (ip!="") dreams.add();
					}else{
						$(dreams.buttons).fadeTo('fast',0.2,function() {$(dreams.buttons).fadeTo('slow',1);});
					}
				});
				$(dreams.creator).find('input').bind('keyup',function(e) {
					if (!dreams.disabled) {
						if (e.which==13) dreams.add();
					}else{
						$(dreams.buttons).fadeTo('fast',0.2,function() {$(dreams.buttons).fadeTo('slow',1);});
					}
				});
			}
		});
		var d=this.value.split('~');
		for(var dd=0;dd<d.length;dd++){
			var ddd=d[dd].split('|');
			if (ddd.length>1) {
				var ti=-1;
				for(var dt=0;dt<this.types.length;dt++) {
					if (this.types[dt]==ddd[0]) ti=dt;
				}
				dreams.createDream(ti,ddd[1]);
			}
		}
		if(dreams.dreams.length>=dreams.maxDreams) {
			$(dreams.buttons).fadeTo('slow',0.2);
			dreams.maxedOut=true;
		}
	},
	add:function() {
		var ip=$(dreams.creator).find("input").get(0);
		if (ip.value=='') {
			$(dreams.creator).fadeIn(function() {setTimeout('fade.start(dreams.creator,{from:50,to:100,step:1});',200);});
		}else{
			dreams.createDream(dreams.typeIndex,ip.value);
			$(dreams.creator).fadeTo('slow',0.2);
			ip.value='';
		}
	},
	createDream:function(index,value) {
		dreams.dreams.push([dreams.types[index],value]);
		var thisdream=document.createElement("div");
		$(thisdream).addClass("adream");
		$(thisdream).html("<button type='button'></button><div class='text'>"+dreams.inputQuestions[index]+" "+value+"</div>");
		dreams.list.appendChild(thisdream);
		$(thisdream).fadeIn("slow");
		$(thisdream).find('button').bind('click',function(e) {dreams.remove(e,this);});
		//events.add(ob('button',thisdream),'click',dreams.remove);
		if (dreams.dreams.length>=dreams.maxDreams) {
			$(dreams.buttons).fadeTo('slow',0.2);
			dreams.maxedOut=true;
			/*fade.start(dreams.buttons,{from:100,to:0,step:1,callback:function(o) {
				css.style(dreams.buttons,'display','none');
			}});*/
		}else{
			$(dreams.buttons).fadeTo('slow',1);
			dreams.maxedOut=false;
		}
		/*fade.start(dreams.creator,{from:100,to:0,step:1,callback:function(o) {
			css.style(dreams.creator,'display','none');
		}});*/
	},
	remove:function(e,o) {
		var i=$(o.parentNode).prev('.adream').get().length;
		//var i=ob('<~.adream',o.parentNode).length;
		$(o.parentNode).fadeOut(
			function() {
				$(this).animate({height:'0px'},function() {
					 dreams.dreams.splice(i,1);
					 $(this).remove();
					$(dreams.buttons).fadeTo('slow',1);
					dreams.maxedOut=false;
				});
			}
		);
		if (dreams.dreams.length>=dreams.maxDreams) {
			$(dreams.buttons).fadeIn();
		}
	},
	finishable:function() {
		return (this.dreams.length>0);
	},
	output:function() {
		var op='';
		for(var d=0;d<this.dreams.length;d++) {
			this.dreams[d][1]=this.dreams[d][1].replace('~','').replace('|','');
			op+=((op!='')?'~':'')+this.dreams[d].join('|');
		}
		array_of_fields[this.field.name][1]=op;
		var reply={};
		eval('reply.EF'+array_of_fields[this.field.name][0]+'=op;');
		return reply;
	}
};
dooit.temporaries('dreams');
