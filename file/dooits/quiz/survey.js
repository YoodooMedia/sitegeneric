var survey={
	key:'',
	defaultKey:'',
	values:[],
	questions:[],
	container:null,
	inputs:[],
	minText:'disagree',
	maxText:'agree',
	title:'A bit about you',
	teaser:'Tell us how you feel about jobs and job-hunting',
	init:function(key,defaultKey,questions) {
		this.key=key;
		this.defaultKey=defaultKey;
		this.container=$('.survey').get(0);
		this.values=dooit.fetchJsonFromArray(key)[1];
		if (this.values.length==0) {
			if (defaultKey!==null) {
				this.values=dooit.fetchJsonFromArray(defaultKey)[1];
			}else{
				for(var q=0;q<questions.length;q++) {
					this.values.push(5);
				}
			}
		}
		if (typeof(yoodoo)!="undefined" && yoodoo.dooittitle!="") this.title=yoodoo.dooittitle;
		if (typeof(yoodoo)!="undefined" && yoodoo.dooitteaser!="") this.teaser=yoodoo.dooitteaser;
		var ins='<h2>'+this.title+'</h2><div class="teaser">'+this.teaser+'</div>';
		for(var q=0;q<questions.length;q++) {
			ins+=this.itemHTML(questions[q],this.values[q]);
		}
		this.container.innerHTML=ins;
		this.inputs=$(this.container).find("input").get();
		buildSliders(this.inputs,{minText:this.minText,maxText:this.maxText});
	},
	itemHTML:function(q,v) {
		return '<div class="question"><div><input type="text" value="'+v+'" /></div>'+q+'</div>';
	},
	output:function() {
		for(var i=0;i<this.inputs.length;i++) {
			this.values[i]=this.inputs[i].value;
		}
		var op=dooit.json(this.values);
		array_of_fields[this.key][1]=op;
		var reply={};
		eval('reply.EF'+array_of_fields[this.key][0]+'=op;');
		return reply;
	}
};
dooit.temporaries('survey');
