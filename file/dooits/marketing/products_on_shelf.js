var products={
	container:null,
	message:'Here you can define other products you sell. List at least your top sellers as this will help with your cashflow forecasts.',
	key:'',
	fields:{},
	init:function(sel,key) {
		this.key=key;
		for(var k in array_of_fields) {
			this.fields[k]='';
			try{
				eval('products.fields["'+k+'"]='+array_of_fields[k][1]+';');
			}catch(e) {
				this.fields[k]=array_of_fields[k][1];
			}
		}
		if (typeof(this.fields[this.key])=="string") this.fields[this.key]={products:[this.blankProduct()],report:[]};
		if (typeof(this.fields[this.key].length)!="undefined") {
			this.fields[this.key]={products:this.fields[this.key],report:[]};
		}
		this.container=$(sel).get(0);
		this.draw();
	},
	draw:function() {
		var ins='';
		ins+="<h3>"+this.message+"</h3>";
		ins+="<em style='font-size:0.85em'>* if you are VAT registered, do not include VAT in the costs below</em>";
		ins+="<div class='productItems'>";
		for(var p=0;p<this.fields[this.key].products.length;p++) {
			ins+=this.productRow(p);
		}
		ins+="</div>";
		ins+="<button type='button' onclick='products.add()' class='add'>add</button>";
		this.container.innerHTML=ins;
		this.numericChecker();
	},
	blankProduct:function() {
		return {
			name:'',
			price:0,
			batchQuantity:1,
			batchCost:0,
			weeklySales:0
		};
	},
	costLabel:function(on) {
		if (!on) {
			return "Unit cost (e.g. &pound;15.20): ";
		}else{
			return "Cost per supplied batch (e.g. &pound;75.50): ";
		}
	},
	productRow:function(p) {
		var asElement=false;
		if (arguments.length>1) asElement=arguments[1];
		var ins='';
		ins+="<button type='button' onclick='products.remove(this)' class='remove'>remove</button>";
		ins+="<label>Product line (e.g. toothbrushes): </label><input type='text' onkeyup='products.update(\"name\",this)' value=\""+this.fields[this.key].products[p].name+"\" />";
		ins+="<blockquote>";
		ins+="<label>Purchased in batches: <input type='checkbox' onchange='products.checkBatch(this)' "+((this.fields[this.key].products[p].batchQuantity==1)?"":"checked='true'")+" /></label>";
		ins+="<div id='batchQuantity'"+((this.fields[this.key].products[p].batchQuantity==1)?"style='display:none'":"")+">";
		ins+="<label>Unit quantity per supplied batch (e.g. 100): </label><input type='text' class='numeric' onkeyup='products.update(\"batchQuantity\",this)' onblur='products.checkBatch(this)' value=\""+this.fields[this.key].products[p].batchQuantity+"\" />";
		ins+="</div>";
		ins+="<label><span id='costLabel'>"+this.costLabel(this.fields[this.key].products[p].batchQuantity!=1)+"</span></label><input type='text' class='numeric decimal' onkeyup='products.update(\"batchCost\",this)' value=\""+this.fields[this.key].products[p].batchCost+"\" />*<br />";
		ins+="<label>Sale price per unit (e.g. &pound;4.99): </label><input type='text' class='numeric decimal' onkeyup='products.update(\"price\",this)' value=\""+this.fields[this.key].products[p].price+"\" />*<br />";
		ins+="<label>Average you would like to sell every week: </label><input type='text' class='numeric' onkeyup='products.update(\"weeklySales\",this)' value=\""+this.fields[this.key].products[p].weeklySales+"\" />";
		ins+="</blockquote>";
		if (asElement) {
			var op=document.createElement("DIV");
			$(op).addClass("productItem");
			$(op).html(ins);
			return op;
		}else{
			return "<div class='productItem'>"+ins+"</div>";
		}
	},
	checkBatch:function(o) {
		var batched=false;
		var pi=this.parentOfClass(o,'productItem');
		var i=$(pi).prevAll('.productItem').get().length;
		if (o.type=='text') {
			batched=(o.value=="1");
		}else{
			batched=o.checked;
		}
		if (batched) {
			if($(pi).find('#batchQuantity').css("display")=="none") $(pi).find('#batchQuantity').slideDown();
			$(pi).find("input[type=checkbox]").get(0).checked=true;
			$(pi).find('#costLabel').html(this.costLabel(true));
		}else{
			if($(pi).find('#batchQuantity').css("display")!="none") $(pi).find('#batchQuantity').slideUp();
			$(pi).find('#batchQuantity input').val("1");
			$(pi).find("input[type=checkbox]").get(0).checked=false;
			$(pi).find('#costLabel').html(this.costLabel(false));
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
		this.fields[this.key].products.push(this.blankProduct());
		var e=this.productRow(this.fields[this.key].products.length-1,true);
		$(e).css("display","none");
		var pi=$(this.container).find('.productItems').get(0);
		pi.appendChild(e);
		this.numericChecker(e);
		$(e).slideDown();
	},
	remove:function(o) {
		var con=this.parentOfClass(o,'productItem');
		var i=$(con).prevAll(".productItem").get().length;
		this.fields[this.key].products.splice(i,1);
		
		$(con).slideUp('fast',function() {
			this.parentNode.removeChild(this);
		});
		if (this.fields[this.key].products.length==0) this.add();
	},
	update:function(nom,o) {
		var i=$(this.parentOfClass(o,'productItem')).prevAll(".productItem").get().length;
		if($(o).hasClass("numeric")) {
			if (isNaN(o.value)) {
				$(o).addClass("error");
			}else{
				$(o).removeClass("error");
				this.fields[this.key].products[i][nom]=parseFloat(o.value);
			}
		}else{
			this.fields[this.key].products[i][nom]=o.value;
		}
	},
	parentOfClass:function(e,c) {
		if (e==document.body) return e;
		if($(e).hasClass(c)) return e;
		return this.parentOfClass(e.parentNode,c);
	},
	report:function() {
		var rep='';
		this.fields[this.key].report=[];
		for(var s=0;s<this.fields[this.key].products.length;s++) {
			var sm=this.fields[this.key].products[s];
			rep='<p>'+sm.name+'</p><p class="answer">';
			var bits=[];
			if (sm.batchQuantity!=0) {
				bits.push('Supplied in batches of '+sm.batchQuantity);
				if (sm.batchQuantity!=0) bits.push('Cost per batch: '+ this.toPounds(sm.batchCost));
			}else if (sm.batchQuantity!=0) {
				bits.push('Cost per batch: '+ this.toPounds(sm.batchCost));
			}
			if (sm.batchQuantity==0) sm.batchQuantity=1;
			if (sm.weeklySales!=0) bits.push('Expected weekly sales: '+ sm.weeklySales);
			if (sm.price!=0) bits.push('Cost per item: '+ this.toPounds(sm.price));
			var weeklyProfit=(sm.price-(sm.batchCost/sm.batchQuantity))*sm.weeklySales;
			if (weeklyProfit!=0) bits.push('Weekly profit: '+ this.toPounds(weeklyProfit));
			rep+=bits.join("<br />");
			rep+="</p>";
			this.fields[this.key].report.push(rep);
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
		this.removeEmpty();
		this.report();
		var op=(dooit.json(this.fields[this.key]));
		array_of_fields[this.key][1]=op;
		var reply={};
		eval('reply.EF'+array_of_fields[this.key][0]+'=op;');
		return reply;
	},
	removeEmpty:function() {
		for(var i=this.fields[this.key].products.length-1;i>=0;i--) {
			if(!this.productIsComplete(i)) this.fields[this.key].products.splice(i,1);
		}
	},
	finishable:function() {
		var complete=true;
		for(var i=0;i<this.fields[this.key].products.length;i++) {
			if(this.productIsStarted(i)) complete=false;
		}
		return complete;
	},
	productIsComplete:function(i) {
		var started=false;
		var empty=false;
		for(var k in this.fields[this.key].products[i]) {
			if(typeof(this.fields[this.key].products[i][k])=="number") {
				if (!isNaN(this.fields[this.key].products[i][k]) && parseFloat(this.fields[this.key].products[i][k])>0) {
					started=true;
				}else{
					empty=true;
				}
			}else{
				if (this.fields[this.key].products[i][k]==undefined || this.fields[this.key].products[i][k]=='' || this.fields[this.key].products[i][k]=='0') {
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
		for(var k in this.fields[this.key].products[i]) {
			if(typeof(this.fields[this.key].products[i][k])=="number") {
				if (!isNaN(this.fields[this.key].products[i][k]) && parseFloat(this.fields[this.key].products[i][k])>0) {
					started=true;
				}else{
					empty=true;
				}
			}else{
				if (this.fields[this.key].products[i][k]==undefined || this.fields[this.key].products[i][k]=='' || this.fields[this.key].products[i][k]=='0') {
					empty=true;
				}else{
					started=true;
				}
			}
		}
		return (started && empty);
	}
};
dooit.temporaries('products');
