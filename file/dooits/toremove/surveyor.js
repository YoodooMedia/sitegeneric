var surveyor={
	key:'',
	value:null,
	container:null,
	container_selector:'.survey',
	scroller:null,
	structure:{
		title:'How much do you like these animals?',
		minText:'Hate',
		maxText:'Love',
		maximum_sider_width:300,
		divisions:10,
		initial:5,
		tag_groups:{
			'test':[
				'sample1',
				'sample2',
				'sample3'
			]
		},
		questions:[
			{
				question:'Which sex are you?',
				options:[
					"Male",
					"Female"
				],
				multiple:false,
				required:1,
				tags:[
					{
						group:'test',
						name:'Female',
						unique:true,
						remove:true,
						test:{
							option:1
						}
					}
				]
			},
			{
				question:'Cat',
				tags:[
					{
						group:'test',
						name:'sample1',
						unique:true,
						test:{
							greaterthan:2,
							lessthan:8,
							highest:true,
							lowest:false,
							highestOnly:true,
							lowestOnly:false,
							position:2,
							boolean:'or'
						}
					}
				]
			},
		]
	},
	init:function(opts) {
		this.key='';
		if (arguments.length>1) this.container_selector=arguments[1];
		this.container=$(this.container_selector).get(0);
		if(typeof(array_of_default_fields)=="object") {
			if (array_of_default_fields.length>0) this.key=array_of_default_fields[0];
		}
		if (this.key=='') {
			if(typeof(array_of_fields)=="object") {
				for(var k in array_of_fields) {
					if (this.key=='') this.key=k;
				}
			}
		}
		if (this.key!='') {
			try{
				eval('surveyor.value='+array_of_fields[this.key][1]+';');
			}catch(ex) {}
		}
		if (this.key!='') {
			for(var k in opts) {
				this.structure[k]=opts[k];
			}
			this.build();
		}
	},
	build:function() {
		if (this.value===null) this.value=[];
		var ins='';
		ins+="<h3>"+this.structure.title+"</h3>";
		ins+="<div class='scroller'>";
		for(var i=0;i<this.structure.questions.length;i++) {
			if (this.value.length<=i) {
				this.value.push({q:this.structure.questions[i].question,a:undefined});
			}else if( typeof(this.value[i].q)=="undefined") {
				this.value[i]={q:this.structure.questions[i].question,a:undefined};
			}
			ins+="<div class='item'>"+((typeof(this.structure.questions[i].options)!="undefined")?this.radio(i):this.slider(i))+this.structure.questions[i].question+"<div class='clear:both'></div></div>";
		}
		ins+="</div>";
		$(this.container).html(ins);
		$(this.container).addClass("surveyor_content");
		var ysa=$('#yoodooScrolledArea').get();
		if (ysa.length>0) {
			this.scroller=$(this.container).find('.scroller').get(0);
			ysa=ysa[0];
			var h=$(ysa).height()-$(this.scroller).offset().top-20;
			$(this.scroller).css("height",h+"px");
		}
		$(this.container).find('.division_select').bind("click",function() {
			var item=surveyor.parentOfClass(this,'item');
			var i=$(item).prevAll(".item").get().length;
			var v=$(this).prevAll(".division_select").get().length+1;
			surveyor.value[i].a=v;
			surveyor.setSlider(i);
			var st=surveyor.scroller.scrollTop+$(item).position().top-($(surveyor.scroller).height()/2);
			$(surveyor.scroller).animate({'scrollTop':Math.round(st)+"px"});
		});
		$(this.container).find('button.radio').bind("click",function() {
			var item=surveyor.parentOfClass(this,'item');
			var k=this.innerHTML;
			var i=$(item).prevAll(".item").get().length;
			var v=$(this).prevAll("button.radio").get().length;
			//surveyor.value[i]=this.structure.questions[i].options[v];
			if(typeof(surveyor.value[i].a)!="object") surveyor.value[i].a={};
			if(typeof(surveyor.value[i].a[k])=="undefined") {
				surveyor.value[i].a[k]=true;
			}else{
				surveyor.value[i].a[k]=!surveyor.value[i].a[k];
			}
			if (surveyor.value[i].a[k]) {
				$(this).addClass("on");
				if(typeof(surveyor.structure.questions[i].multiple)!="undefined" && !surveyor.structure.questions[i].multiple) {
					$(this).siblings('button.radio').removeClass("on");
					for(var key in surveyor.value[i].a) {
						if (key!=k) surveyor.value[i].a[key]=false;
					}
				}
			}else{
				$(this).removeClass("on");
			}
			var st=surveyor.scroller.scrollTop+$(item).position().top-($(surveyor.scroller).height()/2);
			$(surveyor.scroller).animate({'scrollTop':Math.round(st)+"px"});
		});
	},
	parentOfClass:function(o,c) {
		if ($(o).hasClass(c)) return o;
		if (o==document.body) return o;
		return surveyor.parentOfClass(o.parentNode,c);
	},
	setSlider:function(i) {
		var divs=(typeof(this.structure.questions[i].divisions)!="undefined")?this.structure.questions[i].divisions:this.structure.divisions;
		var dw=Math.floor(this.structure.maximum_sider_width/divs);
		var v=this.value[i].a;
		if (v<0) v=0;	
		if (v>divs) v=divs;
		var vw=Math.round(v*dw);
		var slide=$(this.container).find('.item').get(i);
		$(slide).find('.slidvalue').animate({width:vw});
	},
	radio:function(i) {
		if (typeof(this.value[i].a)!="object") this.value[i].a={};
		var ins='<div class="radios">';
		for(var o=0;o<this.structure.questions[i].options.length;o++) {
			var ticked=false;
			if(typeof(this.value[i].a[this.structure.questions[i].options[o]]) && this.value[i].a[this.structure.questions[i].options[o]]) ticked=true;
			ins+="<button type='button' class='radio"+(ticked?" on":"")+"'>"+this.structure.questions[i].options[o]+"</button>";
		}
		ins+="</div>";
		return ins;
	},
	slider:function(i) {
		var divs=(typeof(this.structure.questions[i].divisions)!="undefined")?this.structure.questions[i].divisions:this.structure.divisions;
		var initial=(typeof(this.structure.questions[i].initial)!="undefined")?this.structure.questions[i].initial:this.structure.initial;
		if (typeof(this.value[i].a)=="undefined" || isNaN(this.value[i].a)) this.value[i].a=initial;
		var dw=Math.floor(this.structure.maximum_sider_width/divs);
		var w=Math.round(dw*divs);
		var v=this.value[i].a;
		if (v<0) v=0;	
		if (v>divs) v=divs;
		this.value[i].a=v;
		var vw=Math.round(v*dw);
		var mint=(typeof(this.structure.questions[i].minText)!="undefined")?this.structure.questions[i].minText:this.structure.minText;
		var maxt=(typeof(this.structure.questions[i].maxText)!="undefined")?this.structure.questions[i].maxText:this.structure.maxText;
		var ins="<div class='slider'><div class='header'><div class='mintext'>"+mint+"</div><div class='maxtext'>"+maxt+"</div></div><div style='clear:both'></div>";
		ins+="<div class='slider_content'>";
		ins+="<div class='divisions' style='width:"+w+"px'>";
		for(var d=0;d<divs;d++) {
			ins+="<div class='division' style='width:"+Math.round(dw)+"px'></div>";
		}
		ins+="</div>";
		ins+="<div class='slidvalue' style='width:"+vw+"px'>";
		ins+="<div class='slid' style='width:"+w+"px'>";
		for(var d=0;d<divs;d++) {
			ins+="<div class='slidivision' style='width:"+Math.round(dw)+"px'></div>";
		}
		ins+="</div>";
		ins+="</div>";
		ins+="<div class='division_selector' style='width:"+w+"px'>";
		for(var d=0;d<divs;d++) {
			ins+="<div class='division_select' style='width:"+Math.round(dw)+"px'></div>";
		}
		ins+="</div>";
		ins+="</div>";
		ins+="</div>";
		return ins;
	},
	checkTags:function() {
		var highest=-1;
		var lowest=-1;
		var maxVal=-1;
		var minVal=10000000;
		for(var i=0;i<this.structure.questions.length;i++) {
			if (this.value[i].a==maxVal) {
				highest=-1;
			}
			if (this.value[i].a>maxVal) {
				highest=i;
				maxVal=this.value[i].a;
			}
			if (this.value[i].a==minVal) {
				lowest=-1;
			}
			if (this.value[i].a<minVal) {
				minVal=this.value[i].a;
				lowest=i;
			}
		}
		for(var i=0;i<this.structure.questions.length;i++) {
			if (typeof(this.structure.questions[i].tags)!="undefined") {
				for(var j=0;j<this.structure.questions[i].tags.length;j++) {
					var met=false;
					var meet=[];
					if(typeof(this.structure.questions[i].options)!="undefined") {
						if (typeof(this.structure.questions[i].tags[j].test.option)!="undefined") {
							meet.push(typeof(this.value[i].a[this.structure.questions[i].tags[j].test.option])!="undefined" && this.value[i].a[this.structure.questions[i].tags[j].test.option]);
						}

					}else{
						if (typeof(this.structure.questions[i].tags[j].test.greaterthan)!="undefined") {
							meet.push((this.value[i].a>this.structure.questions[i].tags[j].test.greaterthan));
						}
						if (typeof(this.structure.questions[i].tags[j].test.lessthan)!="undefined") {
							meet.push((this.value[i].a<this.structure.questions[i].tags[j].test.lessthan));
						}
						if (typeof(this.structure.questions[i].tags[j].test.highest)!="undefined" && this.structure.questions[i].tags[j].test.highest) {
							if (typeof(this.structure.questions[i].tags[j].test.highestOnly)!="undefined" && this.structure.questions[i].tags[j].test.highestOnly) {
								meet.push((i==highest));
							}else{
								meet.push((this.value[i].a==maxVal));
							}
						}
						if (typeof(this.structure.questions[i].tags[j].test.lowest)!="undefined" && this.structure.questions[i].tags[j].test.lowest) {
							if (typeof(this.structure.questions[i].tags[j].test.lowestOnly)!="undefined" && this.structure.questions[i].tags[j].test.lowestOnly) {
								meet.push((i==lowest));
							}else{
								meet.push((this.value[i].a==minVal));
							}
						}
						if (typeof(this.structure.questions[i].tags[j].test.position)!="undefined") {
							meet.push((this.structure.questions[i].tags[j].test.position==this.value[i].a));
						}
					}
					if (typeof(this.structure.questions[i].tags[j].test.boolean)!="undefined" && this.structure.questions[i].tags[j].test.boolean=='and') {
						met=(meet.length>0);
						for(var m=0;m<meet.length;m++) {
							if (!meet[m]) met=false;
						}
					}else{
						met=!(meet.length>0);
						for(var m=0;m<meet.length;m++) {
							if (meet[m]) met=true;
						}
					}

					var g=this.structure.tag_groups[this.structure.questions[i].tags[j].group];
					var t=this.structure.questions[i].tags[j].name;
					var u=(typeof(this.structure.questions[i].tags[j].unique)!="undefined" && this.structure.questions[i].tags[j].unique);
					for(var n=0;n<g.length;n++) {
						if (g[n]==t) {
							if (met) {
								dooit.addTag(t);
							}else if (typeof(this.structure.questions[i].tags[j].remove)!="undefined" && this.structure.questions[i].tags[j].remove) {
								dooit.removeTag(t);
							}
						}else if(u && met){
							dooit.removeTag(g[n]);
						}
					}
				}
			}
		}
	},
	finishable:function() {
		var fin=true;
		for(var i=0;i<this.structure.questions.length;i++) {
			if(typeof(this.structure.questions[i].options)!="undefined" && typeof(this.structure.questions[i].required)!="undefined" && this.structure.questions[i].required>0) {
				var ticked=0;
				for(var v in this.value[i].a) {
					if (this.value[i].a[v]) ticked++;
				}
				if (ticked<this.structure.questions[i].required) fin=false;
			}
		}
		return fin;
	},
	output:function() {
		this.checkTags();
		var op=dooit.json(this.value);
		yoodoo.console(op);
		array_of_fields[this.key][1]=op;
		var reply={};
		eval('reply.EF'+array_of_fields[this.key][0]+'=op;');
		return reply;
	}
}
