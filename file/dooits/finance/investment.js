var investment={
	container:null,
	message:"Taking the plunge needs some money upfront. Let's work out how much money you can put in to get your practice under way.",
	key:'',
	fields:{},
	questions:[
		"How much capital investment can you provide (not including any overdraft facility)?",
		"If you have an overdraft facility, how much do you feel comfortable borrowing?",
		"What money can you call on from family/friends who won't need paying back immediately?",
		"What money can you call on from family/friends who would need scheduled repayment?",
		"What capital could you call on if you for example sold shareholdings or other assets?"
	],
	em:'Optional: if you are not a start-up, leave these values at 0',
	overdraftLabel:'If you have an overdraft facility,<br />how much could you borrow at the maximum?',
	init:function(sel) {
		if (array_of_default_fields.length>0) {
			this.key=array_of_default_fields[0];
		
			for(var k in array_of_fields) {
				this.fields[k]='';
				try{
					eval('investment.fields["'+k+'"]='+array_of_fields[k][1]+';');
				}catch(e) {
					this.fields[k]=array_of_fields[k][1];
				}
			}
			if (typeof(this.fields[this.key])!="object") this.fields[this.key]={values:[],total:0,overdraft:0,report:[]};
			if (typeof(this.fields[this.key].overdraft)=="undefined") this.fields[this.key].overdraft=0;
			if (typeof(this.fields[this.key].total)=="undefined") this.fields[this.key].total=0;
			if (typeof(this.fields[this.key].values)=="undefined") this.fields[this.key].values=[];
			while(this.fields[this.key].values.length<5) this.fields[this.key].values.push(0);
			this.container=$(sel).get(0);
			this.draw();
			this.numericChecker();
		}
	},
	draw:function() {
		var ins='<h3>'+this.message+'</h3>';
		ins+="<em style='font-size:0.85em'>"+this.em+"</em>";
		var total=0;
		for(var q=0;q<this.questions.length;q++) {
			if (!isNaN(this.fields[this.key].values[q])) total+=parseFloat(this.fields[this.key].values[q]);
			ins+="<div class='qinput'><label>"+this.questions[q]+"</label>&pound;<input type='text' class='numeric' value='"+this.fields[this.key].values[q].toFixed(0)+"' onkeyup='investment.update(this)'/></div>";
		}
		ins+="<div class='investTotal'><label>Total :</label><span>&pound;"+total.toFixed(0)+"</span></div>";
		ins+="<div class='qinput2'><label>"+this.overdraftLabel+"</label>&pound;<input type='text' class='numeric' value='"+this.fields[this.key].overdraft.toFixed(0)+"' onkeyup='investment.update(this,\"overdraft\")'/></div>";
		this.container.innerHTML=ins;
	},
	update:function(o) {
		if (arguments.length>1) {
			if(!isNaN(o.value)) this.fields[this.key].overdraft=parseFloat(o.value);
		}else{
			var i=$(o.parentNode).prevAll(".qinput").get().length;
			if(!isNaN(o.value)) this.fields[this.key].values[i]=parseFloat(o.value);
			var total=0;
			for(var q=0;q<this.questions.length;q++) {
				if (!isNaN(this.fields[this.key].values[q])) total+=parseFloat(this.fields[this.key].values[q]);
			}
			this.fields[this.key].total=total;
			$(this.container).find(".investTotal span").html('&pound;'+total.toFixed(0));
		}	
	},
	numericChecker:function() {
		var base=this.container;
		if(arguments.length>0) base=arguments[0];
		$(base).find('input.numeric').bind('keydown',function(e) {
			var key=dooit.keyCode(e);
			var decimal=$(this).hasClass("decimal");
			if (!key.navigate) {
				if (decimal && !key.decimal) e.preventDefault();
				if (!key.numeric && !decimal) e.preventDefault();
			}
		});
	},
	report:function() {
		this.fields[this.key].report=[];
		for(var i=0;i<this.questions.length;i++) {
			if (typeof(this.fields[this.key].values[i])!="undefined" && this.fields[this.key].values[i]!=0) this.fields[this.key].report.push('<p>'+this.questions[i]+'</p><p class="answer">'+this.toPounds(this.fields[this.key].values[i])+'</p>');
		}
	},
	toPounds:function(i) {
		var s=i.toFixed(2);
		var bits=s.split('.');
		var negative=/^\-/.test(s);
		bits[0]=bits[0].replace('-','');
		var pence=bits[1];
		
		var thousands=[];
		while(bits[0].length>0) {
			thousands.push(bits[0].substr(-3,3));
			bits[0]=bits[0].substr(0,bits[0].length-3);
		}
		thousands.reverse();
		
		s='&pound;'+(negative?"-":"")+thousands.join(",")+"."+pence;
		return s;
	},
	output:function() {
		this.report();
		var op=(dooit.json(this.fields[this.key]));
		array_of_fields[this.key][1]=op;
		var reply={};
		eval('reply.EF'+array_of_fields[this.key][0]+'=op;');
		return reply;
	},
	finishable:function() {
		var complete=true;
		return complete;
	}
};
dooit.temporaries('investment');
