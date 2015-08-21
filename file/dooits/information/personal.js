
var personal={
	key:'',
	container:null,
	selected:false,
	button:null,
	details:{salutation:'',name:'',address1:'',address2:'',town:'',county:'',postcode:'',telephone:'',email:''},
	salutations:['Mr','Mrs','Miss','Ms'],
	init:function(key) {
		this.key=key;
		var tmp=dooit.fetchJsonFromArray(this.key);
		this.details=tmp[1];
		if (this.details.length==0) this.details={salutation:'',name:'',address1:'',address2:'',town:'',county:'',postcode:'',telephone:'',email:''};
		this.container=$('.personalInfo').get(0);
		var ins="<h2>Your personal details</h2><div class='teaser'>This information is only used in your CV, later.</div><div class='item'><div class='label'>Name</div>"+this.selectElement(this.salutations,this.details.salutation)+"<input type='text' value='"+this.details.name+"' /></div>";
		ins+="<div class='item'><div class='label'>Address</div><input type='text' value='"+this.details.address1+"' /></div>";
		ins+="<div class='item'><div class='label'>Address</div><input type='text' value='"+this.details.address2+"' /></div>";
		ins+="<div class='item'><div class='label'>Town</div><input type='text' value='"+this.details.town+"' /></div>";
		ins+="<div class='item'><div class='label'>County</div><input type='text' value='"+this.details.county+"' /></div>";
		ins+="<div class='item'><div class='label'>Postcode</div><input type='text' value='"+this.details.postcode+"' /></div>";
		ins+="<div class='item'><div class='label'>Telephone</div><input type='text' value='"+this.details.telephone+"' /></div>";
		ins+="<div class='item'><div class='label'>Email address</div><input type='text' value='"+this.details.email+"' /></div></div>";
		$(this.container).html(ins);
		inputs.dropdown($(this.container).find('select').get(),{layout:inputs.layout.none,dropdownX:3});
	},
	selectElement:function(items,selected) {
		var ins="<select>";
		for(var s=0;s<items.length;s++) {
			ins+="<option"+((items[s]==selected)?" selected":"")+">"+items[s]+"</option>";
		}
		ins+="</select>";
		return ins;
	},
	jsonvalues:function() {
		var ips=$(personal.container).find('input').get();
		personal.details.name=ips[0].value;
		personal.details.address1=ips[1].value;
		personal.details.address2=ips[2].value;
		personal.details.town=ips[3].value;
		personal.details.county=ips[4].value;
		personal.details.postcode=ips[5].value;
		personal.details.telephone=ips[6].value;
		personal.details.email=ips[7].value;
		personal.details.salutation=$(this.container).find("select").val();
		ans=dooit.json(personal.details);
		return ans.replace(/\n/,'').replace(/\r/,'').replace(/\t/,'');
	},
	finishable:function() {
		this.jsonvalues();
		return (this.details.name!="");
	},
	output:function() {
		array_of_fields[this.key][1]=this.jsonvalues();
		var reply={};
		eval('reply.EF'+array_of_fields[this.key][0]+'=array_of_fields[this.key][1];');
		return reply;
	}
};
dooit.temporaries('personal');
