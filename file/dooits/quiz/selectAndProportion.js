var selectAndProportion={
	fields:{},
	key:'',
	container:null,
	title:'',
	crossCheck:true,
	minProportion:2,
	adjustAll:false,
	proportionWidth:600,
	sensitivity:6,
	chooseTitle:'Choose which combinations...',
	proportionTitle:'Now, adjust the proportions of each below',
	types:[
		{
		id:"first",
		title:'First category',
		values:[
			{name:"option1",image:"biz/consumersector.png"},
			{name:"option2",image:"biz/consumersector.png"},
			{name:"option3",image:"biz/consumersector.png"},
			{name:"option4",image:"biz/consumersector.png"},
			{name:"option5",image:"biz/consumersector.png"}
		]},
		{
		id:"second",
		title:'Second category',
		values:[
			{name:"Plus 1",image:""},
			{name:"Plus 2",image:""},
			{name:"Plus 3",image:""},
			{name:"Plus 4",image:""}
		]}
	],
	tags:[
		{
			values:[{id:"first",value:"option1"},{id:"second",value:"Plus 1"}],
			boolean:'and', // and/or -- not required for a single value
			tag:{group:'test',name:'sample3',unique:true,noRemove:true},
			validator:{ // must meet all
				on:true,
				minPercentage:10,
				maxPercentage:50,
				highest:true,
				lowest:false
			}
		}
	],
	init:function(sel,key) {
		this.key=key;
		for(var k in array_of_fields) {
			this.fields[k]='';
			try{
				eval('selectAndProportion.fields["'+k+'"]='+dooit.decode(array_of_fields[k][1])+';');
			}catch(e) {
				this.fields[k]=array_of_fields[k][1];
			}
		}
		this.container=$(sel).get(0);
		var ins='';
		if (this.title!='') ins+='<h3>'+this.title+'</h3>';
		if(typeof(this.fields[this.key])!="object") this.fields[this.key]={types:[],proportions:{}};
		for(var q=0;q<this.types.length;q++) {
			if(typeof(this.fields[this.key].types[q])=="undefined") this.fields[this.key].types[q]=[];
			ins+="<div class='type_selector'>";
			var hasImages=false;
			for(var v=0;v<this.types[q].values.length;v++) {
				if (typeof(this.types[q].values[v].image)!="undefined" && this.types[q].values[v].image!="") hasImages=true;
			}
			ins+=this.types[q].title;
			ins+="<div class='block_selector"+(hasImages?' withImages':'')+"'><tr>";
			//ins+="<table class='block_selector"+(hasImages?' withImages':'')+"'><tr>";
			for(var v=this.types[q].values.length-1;v>=0;v--) {
				if(typeof(this.fields[this.key].types[q][v])!="object") this.fields[this.key].types[q][v]={name:this.types[q].values[v].name,value:'0'};
				ins+="<div class='select_item"+((this.fields[this.key].types[q][v].value=='1')?' on':'')+"' onclick='selectAndProportion.check(this,"+q+","+v+")'>";
				if (typeof(this.types[q].values[v].image)!="undefined" && this.types[q].values[v].image!="") {
					ins+="<img src='"+yoodoo.getFilePath('image',false)+this.types[q].values[v].image+"' onload='selectAndProportion.resize(this);' />";
				}
				ins+=this.types[q].values[v].name;
				ins+="</div>";
			}
			//ins+="</tr></table>";
			ins+="</div>";
			ins+="</div>";
		}
		ins+="<div class='cross_checker'></div>";
		ins+="<div class='proportioner' style='display:none'><div class='proportionTitle'>"+this.proportionTitle+"</div><div class='proportions'></div></div>";
		$(this.container).html(ins);
		$('.block_selector').each(function(i,e) {
			e.resize=function() {
				var maxw=0;
				var i=$(this).prevAll(".block_selector").get().length;
				$(this).find('.select_item').css("height","auto");
				var items=$(this).find('.select_item').get();
				for(var i=0;i<items.length;i++) {
					var w=$(items[i]).width();
					if (w>maxw) maxw=w;
				}
				$(this).find('.select_item').css("width",maxw+"px");
				var maxh=0;
				for(var i=0;i<items.length;i++) {
					var h=$(items[i]).height();
					if (h>maxh) maxh=h;
				}
				$(this).find('.select_item').css("height",maxh+"px");
			};
		});
		$('.block_selector').each(function(i,e) {e.resize();});
		this.deriveCrossChecks();
		this.renderCrossCheck((this.crossCheck && this.showCrossChecks));
		this.renderProportions();
	},
	tag_checker:function() {
		var comment=[];
		var props=this.getPropInOrder();
		for(var t=0;t<this.tags.length;t++) {
			if (typeof(this.tags[t].boolean)=="undefined") this.tags[t].boolean='and';
			var isOn=(this.tags[t].boolean=="and");
			var ids=[];
			for(var v=0;v<this.tags[t].values.length;v++) {
				var type=this.getTypeById(this.tags[t].values[v].id);
				var val=false;
				for(var s=0;s<this.fields[this.key].types[type.index].length;s++) {
					if(this.fields[this.key].types[type.index][s].name==this.tags[t].values[v].value) {
						ids.push(s);
						if (this.fields[this.key].types[type.index][s].value=="1") val=true;
					}
				}
				if (val){
					if (this.tags[t].boolean=="or") isOn=true;
				}else{
					if (this.tags[t].boolean=="and") isOn=false;
				}
			}
			var propId="prop_"+ids.join("_");
			var prop=(typeof(this.fields[this.key].proportions[propId])!="undefined")?this.fields[this.key].proportions[propId]:null;
			if(prop!==null && prop.selected && typeof(this.tags[t].validator)!="undefined" && this.tags[t].validator.on) {
				// process validator
				if (isOn) isOn=(prop.value>=this.tags[t].validator.minPercentage);
				if (isOn) isOn=(prop.value<=this.tags[t].validator.maxPercentage);
				if(isOn && this.tags[t].validator.lowest) isOn=(propId==props[0][1]);
				if(isOn && this.tags[t].validator.highest) isOn=(propId==props[props.length-1][1]);
			}
			if(isOn) {
				dooit.addTag(this.tags[t].tag.name);
				comment.push('Adding tag '+this.tags[t].tag.name);
				if(this.tags[t].tag.unique) {
					for(var tt in tag_groups[this.tags[t].tag.group]) {
						if(tt!=this.tags[t].tag.name && tag_groups[this.tags[t].tag.group][tt]) {
							dooit.removeTag(tt);
							comment.push('Removing tag '+tt);
						}
					}
				}
			}else{
				if (!this.tags[t].tag.noRemove) {
					dooit.removeTag(this.tags[t].tag.name);
					comment.push('Removing tag '+this.tags[t].tag.name);
				}
			}
		}
		return comment.join(", ");
	},
	getPropInOrder:function() {
		var props=[];
		for(var p in this.fields[this.key].proportions) {
			if(this.fields[this.key].proportions[p]!==null && this.fields[this.key].proportions[p].selected) props.push([this.fields[this.key].proportions[p].value,p]);
		}
		props.sort(selectAndProportion.sortByFirst);
		return props;
	},
	sortByFirst:function(a,b) {
		return a[0]-b[0];
	},
	getTypeById:function(id) {
		for(var q=0;q<this.types.length;q++) {
			if (this.types[q].id==id) return {index:q,type:this.types[q]};
		}
		return {index:-1,type:{}};
	},
	resize:function(o) {
		var o=this.parentOfClass(o,'block_selector');
		o.resize();
	},
	parentOfClass:function(e,c) {
		if (e==document.body) return e;
		if($(e).hasClass(c)) return e;
		return this.parentOfClass(e.parentNode,c);
	},
	check:function(o,q,v) {
		this.fields[this.key].types[q][v].value=($(o).hasClass("on")?"0":"1");
		if (this.fields[this.key].types[q][v].value=="1") {
			$(o).addClass("on");
		}else{
			$(o).removeClass("on");
		}
		this.deriveCrossChecks();
		this.renderCrossCheck((this.crossCheck && this.showCrossChecks));
		this.renderProportions();
	},
	showCrossChecks:false,
	deriveCrossChecks:function() {
		var levels=[];
		var aboveTwo=0;
		for(var q=0;q<this.fields[this.key].types.length;q++) {
			var level=[];
			var count=0;
			for(var v=0;v<this.fields[this.key].types[q].length;v++) {
				if(this.fields[this.key].types[q][v].value=="1") {
					level.push(v);
					count++;
				}
			}
			if (count>1) aboveTwo++;
			levels.push(level);
		}
		this.showCrossChecks=(aboveTwo>1);
		var propKeys=this.nextLevel(levels,0);
		for(var p=0;p<propKeys.length;p++) {
			var levels=propKeys[p].split("_");
				var names=[];
			if(typeof(this.fields[this.key].proportions['prop_'+propKeys[p]])=="undefined" || this.fields[this.key].proportions['prop_'+propKeys[p]]===null) {
				this.fields[this.key].proportions['prop_'+propKeys[p]]={levels:levels,value:5,selected:true,name:''};
			}
				
				for(var l=levels.length-1;l>=0;l--) {
					if(this.types[l].values[levels[l]]!=undefined) {
						if (typeof(this.types[l].values[levels[l]].verbose)!="undefined") {
							if (typeof(this.types[l].values[levels[l]].verbose.prefix)!="undefined" && this.types[l].values[levels[l]].verbose.prefix!="") names.splice(0,0,this.types[l].values[levels[l]].verbose.prefix);
							if (typeof(this.types[l].values[levels[l]].verbose.suffix)!="undefined" && this.types[l].values[levels[l]].verbose.suffix!="") names.push(this.types[l].values[levels[l]].verbose.suffix);
							if (typeof(this.types[l].values[levels[l]].verbose.prefix)=="undefined" && typeof(this.types[l].values[levels[l]].verbose.suffix)=="undefined") names.push(this.types[l].values[levels[l]].name);
						}
					}
				//for(var l=0;l<levels.length;l++) {
					//names.push(this.types[l].values[levels[l]].name);
				}
				this.fields[this.key].proportions['prop_'+propKeys[p]].name=names.join(" ");
		}
		for(var k in this.fields[this.key].proportions) {
			if(!this.in_array(k.replace(/^prop_/,''),propKeys)) this.fields[this.key].proportions[k]=null;
		}
	},
	in_array:function(needle,haystack) {
		for(var i=0;i<haystack.length;i++) {
			if(haystack[i]==needle) return true;
		}
		return false;
	},
	nextLevel:function(levels,i) {
		if(i+1>=levels.length) {
			return levels[i];
		}else{
			var reply=[];
			for(var l=0;l<levels[i].length;l++) {
				var more=this.nextLevel(levels,i+1);
				for(var m=0;m<more.length;m++) {
					reply.push(levels[i][l]+"_"+more[m]);
				}
			}
			return reply;
		}
	},
	renderCrossCheck:function(show) {
		var ins='';
		if(show) {
		var q=0;
		var bits=[];
		for(var p in this.fields[this.key].proportions) {
			if (this.fields[this.key].proportions[p]!==null) {
				var name=[];
				q++;
				/*for(var i=0;i<this.fields[this.key].proportions[p].levels.length;i++) {
					name.push(this.types[i].values[this.fields[this.key].proportions[p].levels[i]].name);
				}
				this.fields[this.key].proportions[p].name=name.join(", ");*/
				var ison=this.fields[this.key].proportions[p].selected;
				bits.push("<button type='button' class='select_item"+(ison?" on":"")+"' onclick='selectAndProportion.toggleCrossCheck(this,\""+p+"\")'>"+this.fields[this.key].proportions[p].name+"</button>");
			}
		}
		bits.reverse();
		if(q>0) ins=this.chooseTitle.replace('[count]',q)+"<div style='clear:both'>"+bits.join('')+"</div>";
		}
		$('.cross_checker').html(ins);
	},
	toggleCrossCheck:function(o,p) {
		this.fields[this.key].proportions[p].selected=!this.fields[this.key].proportions[p].selected;
		if(this.fields[this.key].proportions[p].selected) {
			$(o).addClass("on");
		}else{
			$(o).removeClass("on");
		}
		this.renderProportions();
	},
	balanceProportions:function() {
		var minTotal=0;
		var total=0;
		for(var p in this.fields[this.key].proportions) {
			if (this.fields[this.key].proportions[p]!==null && this.fields[this.key].proportions[p].selected) {
				if (this.fields[this.key].proportions[p].value<=this.minProportion) {
					this.fields[this.key].proportions[p].value=this.minProportion;
					minTotal+=this.minProportion;
				}else{
					total+=1*this.fields[this.key].proportions[p].value;
				}
			}
		}
		for(var p in this.fields[this.key].proportions) {
			if (this.fields[this.key].proportions[p]!==null && this.fields[this.key].proportions[p].selected) {
				if (this.fields[this.key].proportions[p].value>this.minProportion) {
					this.fields[this.key].proportions[p].value=(100-minTotal)*this.fields[this.key].proportions[p].value/total;
				}
			}
		}
	},
	renderProportions:function() {
		var ins='';
		this.balanceProportions();
		var q=0;
		for(var p in this.fields[this.key].proportions) {
			if (this.fields[this.key].proportions[p]!==null && this.fields[this.key].proportions[p].selected) {
				q++;
				ins+="<div class='proportion "+((q%2==0)?"even":"odd")+"' id='"+p+"' style='width:"+Math.round(this.proportionWidth*this.fields[this.key].proportions[p].value/100)+"px'><div class='handle'></div>";
				ins+="<div class='label'><div><div>"+this.fields[this.key].proportions[p].name+"<div class='percentage'>"+Math.round(this.fields[this.key].proportions[p].value)+"%</div></div></div></div>";
				ins+="</div>";
			}
		}
		$('.proportions').html(ins);
		if (q>1) {
			$('.proportioner').css("display","block");
			$('.proportions .proportion').bind('mousedown',function(e) {
				e.preventDefault();
				selectAndProportion.proportionDownX=e.pageX;
				var i=$(this).prevAll('.proportion').get().length;
				selectAndProportion.proportionEditIndex=this.id;
				$(document).bind('mousemove',function(e) {
					e.preventDefault();
					var dx=(e.pageX - selectAndProportion.proportionDownX)/selectAndProportion.sensitivity;
					selectAndProportion.proportionDownX=e.pageX;
					var prop=selectAndProportion.fields[selectAndProportion.key].proportions[selectAndProportion.proportionEditIndex].value+dx;
					if (prop<selectAndProportion.minProportion) prop=selectAndProportion.minProportion;
					dx=prop-selectAndProportion.fields[selectAndProportion.key].proportions[selectAndProportion.proportionEditIndex].value;
					if (selectAndProportion.adjustAll) {
						selectAndProportion.fields[selectAndProportion.key].proportions[selectAndProportion.proportionEditIndex].value=prop;
						selectAndProportion.balanceProportions();
					}else{
						var t=$('.proportions #'+selectAndProportion.proportionEditIndex).get(0);
						var n=$(t).next(".proportion").get();
						var p=$(t).prev(".proportion").get();
						var reduceKey='';
						if(n.length>0) {
							reduceKey=n[0].id;
						}else if (p.length>0) {
							reduceKey=p[0].id;
						}
						if (reduceKey!="") {
							var dv=selectAndProportion.fields[selectAndProportion.key].proportions[reduceKey].value-dx;
							var nv=dv*1;
							if (dv<selectAndProportion.minProportion) nv=selectAndProportion.minProportion;
							if (nv!=dv) {
								dx=selectAndProportion.fields[selectAndProportion.key].proportions[reduceKey].value-nv;
								prop=selectAndProportion.fields[selectAndProportion.key].proportions[selectAndProportion.proportionEditIndex].value+dx;
							}
							selectAndProportion.fields[selectAndProportion.key].proportions[reduceKey].value=nv;
						}
						selectAndProportion.fields[selectAndProportion.key].proportions[selectAndProportion.proportionEditIndex].value=prop;
					}
					for(var p in selectAndProportion.fields[selectAndProportion.key].proportions) {
						if (selectAndProportion.fields[selectAndProportion.key].proportions[p]!==null && selectAndProportion.fields[selectAndProportion.key].proportions[p].selected) {
							$('.proportions #'+p).css("width",Math.round(selectAndProportion.proportionWidth*selectAndProportion.fields[selectAndProportion.key].proportions[p].value/100)+"px");
							$('.proportions #'+p+" .percentage").html(Math.round(selectAndProportion.fields[selectAndProportion.key].proportions[p].value)+"%");
						}
					}
				});
				$(document).bind('mouseup',function() {
					$(document).unbind("mousemove");
					$(document).unbind("mouseup");
				});
			});
		}else{
			$('.proportioner').css("display","none");
		}
	},
	summary:function() {
		var txt={prefix:'',verbose:'',selection:[]};
		if (typeof(selectAndProportion_summary_prefix)!="undefined") txt.prefix=selectAndProportion_summary_prefix;
		var noms=[];
		for(var p in this.fields[this.key].proportions) {
			if (this.fields[this.key].proportions[p]!==null && this.fields[this.key].proportions[p].selected) {
				txt.selection.push([this.fields[this.key].proportions[p].value,this.fields[this.key].proportions[p].name]);
			}
		}
		txt.selection.sort(selectAndProportion.byValue);
		for(var p=0;p<txt.selection.length;p++) noms.push(txt.selection[p][1]);
		noms.reverse();
		var last=noms.pop();
		txt.verbose=noms.join(", ");
		txt.verbose+=((txt.verbose=='')?'':" and ")+last;
		this.fields[this.key].summary=txt;
		return this.fields[this.key].summary;
	},
	byValue:function(a,b) {
		return a[0]-b[0];
	},
	proportionDownX:0,
	proportionEditIndex:'',
	output:function() {
		this.summary();
		this.tag_checker();
		var vals=this.fields[this.key];
		for(var q=0;q<vals.length;q++) {
			if (vals[q].selected=='0') vals[q].answer='';
		}
		
		var op=(dooit.json(this.fields[this.key]));
		array_of_fields[this.key][1]=op;
		var reply={};
		eval('reply.EF'+array_of_fields[this.key][0]+'=op;');
		return reply;
	},
	finishable:function() {
		return true;
	}


};
dooit.temporaries('selectAndProportion');
