var profile_builder={
	key:'',
	container:null,
	text:'',
	list:null,
	selection:[],
	edited:false,
	startingText:'',
	clicked:[],
	lengthText:null,
	lengthBar:null,
	title:'Your CV profile...',
	teaser:'Your sales pitch - all about you in 50 words or less',
	init:function(key,selection) {
		this.key=key;
		this.text=array_of_fields[key][1];
		if (this.text=="") {
			this.text=this.startingText;
		}else{
			this.edited=true;
		}
		this.selection=[];
		for(var i=0;i<selection.length;i++) {
			this.selection=this.selection.concat(array_of_fields[selection[i]][1].split("|"));
		}
		for(i=this.selection.length-1;i>=0;i--) {
			if (this.selection[i]=='') this.selection.splice(i,1);
		}
		this.container=$('.profile').get(0);
		if (typeof(yoodoo)!="undefined" && yoodoo.dooittitle!="") this.title=yoodoo.dooittitle;
		if (typeof(yoodoo)!="undefined" && yoodoo.dooitteaser!="") this.teaser=yoodoo.dooitteaser;
		this.container.innerHTML='<h2>'+this.title+'</h2><div class="teaser">'+this.teaser+"</div><div style='width:80%;margin:20px 0 10px 0;'>This is your profile we will save for later. You can edit it as much as like, so it makes sense and sounds right.</div>";
		this.list=this.createElement("div",null,'list',null);
		this.input=this.createElement("textarea",null,null,null);
		this.input.value=dooit.decode(this.text);
		this.container.appendChild(this.list);
		this.container.appendChild(this.input);
		var proflen=this.createElement("div","profileLength",null,null);
		$(proflen).html("<span></span><div><div class='bar'></div></div>");
		this.container.appendChild(proflen);
		this.lengthText=$(proflen).find("span").get(0);
		this.lengthBar=$(proflen).find(" div .bar").get(0);
		this.listSuggestions();
		$(this.input).bind('keyup',function() {
			profile_builder.edited=true;
			profile_builder.checkLength();
		});
		this.checkLength();
	},
	checkLength:function() {
		var l=this.input.value.length;
		var limits=[
			[0,'Too short, needs some more',-30],
			[150,'A little short, needs some more',-60],
			[250,'Good length, don\'t want to bore anyone',-90],
			[400,'Getting rather long now. You sure it needs this much?',-60],
			[500,'Much too long. You really need to reduce it',-30]
		];
		var idx=0;
		for(var i=0;i<limits.length;i++) {
			if (l>limits[i][0]) idx=i;
		}
		this.lengthText.innerHTML=limits[idx][1];
		$(this.lengthBar).css('backgroundPosition','0px '+limits[idx][2]+"px");
		$(this.lengthBar).css('width',((l>500)?500:l)+'px');
	},
	listSuggestions:function() {
		this.selection=this.selection.sort();
		var gotsome=false;
		for(var i=0;i<this.selection.length;i++) {
			if (this.suggestion(this.selection[i])!="") {
				var tmp=this.createElement("button",null,null,null);
				tmp.setAttribute("type","button");
				$(tmp).html(this.selection[i]);
				this.list.appendChild(tmp);
				gotsome=true;
			}
		}
		if (!gotsome) {
			var tmp=this.createElement("div",null,null,null);
			var ins="<em>We could not find any suggestions for the skills you provided. Be inventive and think about why your skills might be useful.</em>";
			if (this.selection.length>0) {
				ins+="<div>You chose... "+this.selection.join(", ")+"</div>";
			}
			$(tmp).html(ins);
			this.list.appendChild(tmp);
		}
		$(this.list).find('button').bind("click",function() {
			var thisSuggestion=profile_builder.suggestion(this.innerHTML);
			profile_builder.clicked.push(thisSuggestion);
			if (profile_builder.clicked) {
				profile_builder.input.value=profile_builder.input.value+" "+thisSuggestion;
			}else{
				var t=this.startingText;
				for(var i=0;i<profile_builder.clicked.length;i++) {
					/*if (i>0) {
						if (i<profile_builder.clicked.length-1) {
							t+=', ';
						}else{
							t+=' and ';
						}
					}*/
					t+=profile_builder.clicked[i]+" ";
				}
				profile_builder.input.value=t;
			}
			profile_builder.checkLength();
		});
	},
	suggestion:function(key) {
		for(var i=0;i<profile_suggestions.length;i++) {
			if (key==profile_suggestions[i][0]) {
				return profile_suggestions[i][1];
			}
		}
		return '';
	},
	finishable:function() {
		return (this.input.value!="");
	},
	output:function() {
		array_of_fields[this.key][1]=dooit.encode(this.input.value);
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
	}
};
dooit.temporaries('profile_builder');
