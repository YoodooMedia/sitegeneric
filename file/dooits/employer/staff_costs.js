var staff={
	container:null,
	message:'Here, we will cover salaried support staff, i.e. staff you must pay irrespective or procedures etc. Add their details and cost (including salary, tax, benefit and pension burden etc.). <em>Add as many as you wish.</em>',
	reportTitle:'Salaried staff',
	key:'',
	fields:{},
	init:function(sel,key) {
		this.key=key;
		for(var k in array_of_fields) {
			this.fields[k]='';
			try{
				eval('staff.fields["'+k+'"]='+array_of_fields[k][1]+';');
			}catch(e) {
				this.fields[k]=array_of_fields[k][1];
			}
		}
		if (typeof(this.fields[this.key])=="string") this.fields[this.key]={staff:[this.blankProduct()],report:[]};
		if (typeof(this.fields[this.key].length)!="undefined") {
			this.fields[this.key]={staff:this.fields[this.key],report:[]};
		}
		this.container=$(sel).get(0);
		this.draw();
	},
	draw:function() {
		var ins='';
		ins+="<h3>"+this.message+"</h3>";
		ins+="<div class='staffItems'>";
		for(var p=0;p<this.fields[this.key].staff.length;p++) {
			ins+=this.productRow(p);
		}
		ins+="</div>";
		ins+="<button type='button' onclick='staff.add()' class='add'>add</button>";
		this.container.innerHTML=ins;
		this.numericChecker();
	},
	blankProduct:function() {
		return {
			name:'',
			quantity:1,
			monthCost:0
		};
	},
	productRow:function(p) {
		var asElement=false;
		if (arguments.length>1) asElement=arguments[1];
		var ins='';
		ins+="<button type='button' onclick='staff.remove(this)' class='remove'>remove</button>";
		ins+="<label>Staff type: </label><input type='text' onkeyup='staff.update(\"name\",this)' value=\""+this.fields[this.key].staff[p].name+"\" />";
		ins+="<blockquote>";
		ins+="<label>How many? </label><input type='text' class='numeric' onkeyup='staff.update(\"quantity\",this)' value=\""+this.fields[this.key].staff[p].quantity+"\" /><br />";
		ins+="<label>Cost per employee per month? &pound;</label><input type='text' class='numeric decimal' onkeyup='staff.update(\"monthCost\",this)' value=\""+this.fields[this.key].staff[p].monthCost+"\" /><br />";
		ins+="</blockquote>";
		if (asElement) {
			var op=document.createElement("DIV");
			$(op).addClass("staffItem");
			$(op).html(ins);
			return op;
		}else{
			return "<div class='staffItem'>"+ins+"</div>";
		}
	},
	numericChecker:function() {
		var base=this.container;
		if(arguments.length>0) base=arguments[0];
		$(base).find('input.numeric').bind('keydown',function(e) {
			var key=dooit.keyCode(e);
			var decimal=$(this).hasClass("decimal");
			if (key.code==190 && /\./.test(this.value)) e.preventDefault();
			if (!key.navigate) {
				if (decimal && !key.decimal) e.preventDefault();
				if (!key.numeric && !decimal) e.preventDefault();
			}
		});
	},
	add:function() {
		this.fields[this.key].staff.push(this.blankProduct());
		var e=this.productRow(this.fields[this.key].staff.length-1,true);
		$(e).css("display","none");
		var pi=$(this.container).find('.staffItems').get(0);
		pi.appendChild(e);
		this.numericChecker(e);
		$(e).slideDown();
	},
	remove:function(o) {
		var con=this.parentOfClass(o,'staffItem');
		var i=$(con).prevAll(".staffItem").get().length;
		this.fields[this.key].staff.splice(i,1);
		
		$(con).slideUp('fast',function() {
			this.parentNode.removeChild(this);
		});
		if (this.fields[this.key].staff.length==0) this.add();
	},
	update:function(nom,o) {
		var i=$(this.parentOfClass(o,'staffItem')).prevAll(".staffItem").get().length;
		if($(o).hasClass("numeric")) {
			if (isNaN(o.value)) {
				$(o).addClass("error");
			}else{
				$(o).removeClass("error");
				this.fields[this.key].staff[i][nom]=parseFloat(o.value);
			}
		}else{
			this.fields[this.key].staff[i][nom]=o.value;
		}
	},
	parentOfClass:function(e,c) {
		if (e==document.body) return e;
		if($(e).hasClass(c)) return e;
		return this.parentOfClass(e.parentNode,c);
	},
	report:function() {
		var rep=[];
		for(var s=0;s<this.fields[this.key].staff.length;s++) {
			var sm=this.fields[this.key].staff[s];
			rep.push('<p><b>'+sm.name+'</b> x '+sm.quantity+'</p><p class="answer">Monthly salary: '+this.toPounds(sm.monthCost)+'</p>');
		}
		//if (rep.length>0) rep.splice(0,0,'<h3>'+this.reportTitle+'</h3>');
		this.fields[this.key].report=rep;
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
		this.removeEmpty();
		this.report();
		var op=(dooit.json(this.fields[this.key]));
		array_of_fields[this.key][1]=op;
		var reply={};
		eval('reply.EF'+array_of_fields[this.key][0]+'=op;');
		return reply;
	},
	removeEmpty:function() {
		for(var i=this.fields[this.key].staff.length-1;i>=0;i--) {
			if(!this.productIsComplete(i)) this.fields[this.key].staff.splice(i,1);
		}
	},
	finishable:function() {
		var complete=true;
		for(var i=0;i<this.fields[this.key].staff.length;i++) {
			if(this.productIsStarted(i)) complete=false;
		}
		return complete;
	},
	productIsComplete:function(i) {
		var started=false;
		var empty=false;
		for(var k in this.fields[this.key].staff[i]) {
			if(typeof(this.fields[this.key].staff[i][k])=="number") {
				if (!isNaN(this.fields[this.key].staff[i][k]) && parseFloat(this.fields[this.key].staff[i][k])>0) {
					started=true;
				}else{
					empty=true;
				}
			}else{
				if (this.fields[this.key].staff[i][k]==undefined || this.fields[this.key].staff[i][k]=='' || this.fields[this.key].staff[i][k]=='0' || ((k=='quantity') && this.fields[this.key].staff[i][k]=='1')) {
					empty=true;
				}else{
					started=true;
				}
			}
		}
		return (started && !empty);
	},
	productIsStarted:function(i) {
		var started=false;
		var empty=false;
		for(var k in this.fields[this.key].staff[i]) {
			if(typeof(this.fields[this.key].staff[i][k])=="number") {
				if (!isNaN(this.fields[this.key].staff[i][k]) && parseFloat(this.fields[this.key].staff[i][k])>0) {
					started=true;
				}else{
					empty=true;
				}
			}else{
				if (this.fields[this.key].staff[i][k]==undefined || this.fields[this.key].staff[i][k]=='' || this.fields[this.key].staff[i][k]=='0' || ((k=='quantity') && this.fields[this.key].staff[i][k]=='1')) {
					empty=true;
				}else{
					started=true;
				}
			}
		}
		return (started && empty);
	}
};
dooit.temporaries('staff');
