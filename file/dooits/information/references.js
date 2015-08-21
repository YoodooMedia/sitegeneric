
var references={
	key:'',
	container:null,
	selected:false,
	buttons:null,
	details:[],
	salutations:['Mr','Mrs','Miss','Ms'],
	referees:[],
	index:0,
	init:function(key) {
		this.referees=[];
		this.buttons=null;
		
		this.key=key;
		
		var tmp=dooit.fetchJsonFromArray(this.key);
		tmp=dooit.decode(tmp);
		this.details=tmp[1];
		if (this.details.length==0) this.details=[{salutation:'',name:'',jobtitle:'',address1:'',address2:'',town:'',county:'',postcode:'',telephone:'',email:''},{salutation:'',name:'',jobtitle:'',address1:'',address2:'',town:'',county:'',postcode:'',telephone:'',email:''}];
		this.container=$('.references').get(0);
		$(this.container).html("<h2>You will need references from people who know you</h2><div class='teaser'>Provide some contact details for 2 referees who are willing to help</div>");
		var ins='';
		for(var r=0;r<this.details.length;r++) {
			ins+="<button type='button' class='ref tab'>Referee "+(r+1)+"</button>";
		}
		this.buttons=this.createElement("div",null,null,null);
		$(this.buttons).html(ins);
		this.container.appendChild(this.buttons);
		for(var r=0;r<this.details.length;r++) {
			var ins="<h3>Referee "+(r+1)+"</h3><div class='item'><div class='label'>Name</div>"+this.selectElement(this.salutations,this.details[r].salutation)+" <input type='text' value='' /></div>";
			ins+="<div class='item'><div class='label'>Job title</div><input type='text' value='' /></div>";
			ins+="<div class='item'><div class='label'>Address</div><input type='text' value='' /></div>";
			ins+="<div class='item'><div class='label'>Address</div><input type='text' value='' /></div>";
			ins+="<div class='item'><div class='label'>Town</div><input type='text' value='' /></div>";
			ins+="<div class='item'><div class='label'>County</div><input type='text' value='' /></div>";
			ins+="<div class='item'><div class='label'>Postcode</div><input type='text' value='' /></div>";
			ins+="<div class='item'><div class='label'>Telephone</div><input type='text' value='' /></div>";
			ins+="<div class='item'><div class='label'>Email address</div><input type='text' value='' /></div>";
			//ins+="<button type='button' class='green'>save</button>";
			var o=this.createElement("div","ref"+r,'referees',{display:((r==0)?"block":"none")});
			$(o).html(ins);
			var ip=$(o).find("input").get();
			ip[0].value=this.details[r].name;
			ip[1].value=this.details[r].jobtitle;
			ip[2].value=this.details[r].address1;
			ip[3].value=this.details[r].address2;
			ip[4].value=this.details[r].town;
			ip[5].value=this.details[r].county;
			ip[6].value=this.details[r].postcode;
			ip[7].value=this.details[r].telephone;
			ip[8].value=this.details[r].email;
			this.referees.push(o);
			this.container.appendChild(o);
		}
		$(this.buttons).find("button:first").addClass("on");
		$(this.buttons).find("button").bind("click",function() {
			if (!$(this).hasClass("on")) {
				$(this).siblings("button").removeClass("on");
				$(this).addClass("on");
				var idx=$(this).prevAll("button").get().length;
				$(references.referees[references.index]).fadeOut('fast',function() {
					$(references.referees[references.index]).fadeIn();
				});
				references.index=idx;
			}
		});
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
	updatevalues:function() {
		for(var j=0;j<references.details.length;j++) {
			var ips=$(references.referees[j]).find('input').get();
			references.details[j].name=ips[0].value;
			references.details[j].jobtitle=ips[1].value;
			references.details[j].address1=ips[2].value;
			references.details[j].address2=ips[3].value;
			references.details[j].town=ips[4].value;
			references.details[j].county=ips[5].value;
			references.details[j].postcode=ips[6].value;
			references.details[j].telephone=ips[7].value;
			references.details[j].email=ips[8].value;
			references.details[j].salutation=$(references.referees[j]).find("select").val();
		}
	},
	finishable:function() {
		this.updatevalues();
		return (this.details[0].name!="" && this.details[1].name!="");
	},
	output:function() {
		this.updatevalues();
		var ans=dooit.json(references.details).replace(/\n/,'').replace(/\r/,'').replace(/\t/,'');
		array_of_fields[this.key][1]=ans;
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
dooit.temporaries('references');
