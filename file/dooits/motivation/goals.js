
var goals={
	value:'',
	container:null,
	buttons:null,
	creator:null,
	list:null,
	dreams:[],
	types:['job','position','earn','business','other'],
	typeButtons:['a particular job','achieve a position','earn a certain amount','run my own business','something else'],
	typeIndex:-1,
	inputQuestions:['I aim to work as a','I aim to achieve the position of','I aim to earn','I aim to run my own business, doing','I aim to'],
	field:{name:'',id:0},
	title:'What do you fancy?',
	teaser:'Money? Satisfaction? Using your skills? Pick your main career goal.',
	init:function(key) {
		this.field.name=key;
		this.field.id=array_of_fields[key][0];
		this.value=array_of_fields[key][1];
		var v=['',''];
		if (/\|/.test(this.value)) v=this.value.split('|');
		this.container=$('.goals').get(0);
		if (typeof(yoodoo)!="undefined" && yoodoo.dooittitle!="") this.title=yoodoo.dooittitle;
		if (typeof(yoodoo)!="undefined" && yoodoo.dooitteaser!="") this.teaser=yoodoo.dooitteaser;
		this.container.innerHTML='<h2>'+this.title+'</h2><div class="teaser">'+this.teaser+'</div>';
		var ins='';
		for(var i=0;i<this.types.length;i++) {
			ins+="<button type='button' class='"+this.types[i]+"'></button>";
		}
		this.buttons=document.createElement("div");
		$(this.buttons).addClass("buttons");
		$(this.buttons).html(ins);
		this.container.appendChild(this.buttons);
		this.list=document.createElement("div");
		$(this.list).addClass("list");
		this.container.appendChild(this.list);
		this.creator=document.createElement("div");
		$(this.creator).addClass("creator");
		this.container.appendChild(this.creator);
		for(var i=0;i<this.types.length;i++) {
			if (this.types[i]==v[0]) this.typeIndex=i;
		}
		if (this.typeIndex>=0) {
			var ins=this.inputQuestions[this.typeIndex]+"&hellip;";
			ins+="<div><input type='text' /></div>";
			this.creator.innerHTML=ins;
			$(this.creator).find('input').val(v[1]);
			$(this.creator).fadeIn('slow',function() {$(goals.creator).find('input').get(0).focus();});
			var ip=goals.inputQuestions[goals.typeIndex]+' '+$(goals.creator).find('input').val();
			goals.list.innerHTML=ip;
			$(this.creator).find("input").bind("keyup",function() {goals.add();});
		}else{
			$(this.list).fadeTo('fast',0.2);
		}
		$(this.buttons).find('button').bind('click',function() {
			var i=$(this).prevAll('button').get().length;
			goals.typeIndex=i;
			var ins=goals.inputQuestions[i]+"&hellip;";
			ins+="<div><input type='text' /></div>";
			goals.creator.innerHTML=ins;
			$(goals.creator).fadeIn('slow',function() {$(goals.creator).find('input').get(0).focus();});
			$(goals.creator).find("input").bind("keyup",function() {goals.add();});
		});
	},
	add:function() {
		var ins=$(goals.creator).find('input').val();
		var ip=goals.inputQuestions[goals.typeIndex]+' '+ins;
		goals.value=goals.types[goals.typeIndex]+'|'+ins;
		goals.list.innerHTML=ip;
		if (ins=='') {
			$(goals.list).fadeTo('slow',0.2);
		}else{
			$(goals.list).fadeTo('slow',1);
		}
	},
	finishable:function() {
		return (this.value!="");
	},
	output:function() {
		array_of_fields[this.field.name][1]=this.value;
		var reply={};
		eval('reply.EF'+this.field.id+'=goals.value;');
		return reply;
	}
};
dooit.temporaries('goals');
