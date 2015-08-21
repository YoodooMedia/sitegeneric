/* --- dooit layout ---

<div class='applications'></div>
<script type='text/javascript'>
function initThis() {
	var params={};
	params.dependencies=[
		['dooits/information/applications.js',true],
		['css/information/applications.css',false]
	];
	params.loaded=function(){
		applications.init({selectors:{container:'.applications'}});
	};
	params.saveValues=['applications.output'];
	params.finished='applications.finishable';
	dooit.init(param);
}
</script>

*/



dooit.temporaries('applications');
var applications={
	selectors:{
		container:'.applications'
	},
	containers:{
		container:null
	},
	value:null,
	key:null,
	fields:{},
	pdfHeader:[{image:yoodoo.option.baseUrl+'uploads/sitegeneric/image/dooits/yoodoo-pdf-logo.jpg',w:190,h:11,absolute:true},
		{fontsize:12,fontcolor:[255,255,255],lineheight:11,indent:10,text:'{user}'},
		{lineheight:3}],
	styles:{
		h1:{fontsize:16,fontcolor:[50,50,200],lineheight:8},
		h2:{fontsize:14,fontcolor:[50,50,150],lineheight:7},
		h3:{fontsize:12,fontcolor:[50,50,100],lineheight:6},
		right:{fontsize:10,fontcolor:[100,100,100],lineheight:3.8,textalign:'R'},
		center:{fontsize:10,fontcolor:[100,100,100],lineheight:3.8,textalign:'C'},
		label:{fontsize:10,fontcolor:[50,50,200],lineheight:4.5},
		indent:{fontsize:10,fontcolor:[50,200,50],lineheight:3.8,indent:20},
		answer:{fontsize:10,fontcolor:[50,50,50],lineheight:5,indent:20},
		spacer:{lineheight:2}
	},
	printJSON:[],
	printH1:function(txt) {
		var op={};
		if (this.printJSON.length>0) op.pageBreak=1;
		if (arguments.length>1) op.fontcolor=arguments[1];
		for(var k in applications.styles.h1) {
			if (op[k]==undefined) op[k]=applications.styles.h1[k];
		}
		op.text=applications.cleanText(txt);
		return op;
	},
	printH2:function(txt) {
		var op={};
		if (arguments.length>1) op.fontcolor=arguments[1];
		for(var k in applications.styles.h2) {
			if (op[k]==undefined) op[k]=applications.styles.h2[k];
		}
		op.text=applications.cleanText(txt);
		return op;
	},
	printH3:function(txt) {
		var op={};
		if (arguments.length>1) op.fontcolor=arguments[1];
		for(var k in applications.styles.h3) {
			if (op[k]==undefined) op[k]=applications.styles.h3[k];
		}
		op.text=applications.cleanText(txt);
		return op;
	},
	printRight:function(txt) {
		var op={};
		if (arguments.length>1) op.fontcolor=arguments[1];
		for(var k in applications.styles.right) {
			if (op[k]==undefined) op[k]=applications.styles.right[k];
		}
		op.text=applications.cleanText(txt);
		return op;
	},
	printIndent:function(txt) {
		var op={};
		if (arguments.length>1) op.fontcolor=arguments[1];
		for(var k in applications.styles.indent) {
			if (op[k]==undefined) op[k]=applications.styles.indent[k];
		}
		op.text=applications.cleanText(txt);
		return op;
	},
	printCenter:function(txt) {
		var op={};
		if (arguments.length>1) op.fontcolor=arguments[1];
		for(var k in applications.styles.center) {
			if (op[k]==undefined) op[k]=applications.styles.center[k];
		}
		op.text=applications.cleanText(txt);
		return op;
	},
	printLabel:function(txt) {
		var op={};
		if (arguments.length>1) op.fontcolor=arguments[1];
		for(var k in applications.styles.label) {
			if (op[k]==undefined) op[k]=applications.styles.label[k];
		}
		op.text=applications.cleanText(txt);
		return op;
	},
	printAnswer:function(txt) {
		var op={};
		if (arguments.length>1) op.fontcolor=arguments[1];
		for(var k in applications.styles.answer) {
			if (op[k]==undefined) op[k]=applications.styles.answer[k];
		}
		op.text=applications.cleanText(txt);
		return op;
	},
	printSpacer:function() {
		var op={};
		for(var k in applications.styles.spacer) {
			if (op[k]==undefined) op[k]=applications.styles.answer[k];
		}
		return op;
	},
	cleanText:function(txt) {
		txt=txt.replace(/[^\>]*$\>/gi,"");
		txt=txt.replace(/[\u2018\u2019]/g,"&sq;");
		txt=txt.replace(/[\u201C\u201D]/g,"&dq;");
		txt=txt.replace(/[\u2014]/g,"-");
		txt=txt.replace(/\<\/div\>\>/gi,"&nl;");
		txt=txt.replace(/\<\/p>]*\>/gi,"&nl;");
		txt=txt.replace(/\<br \/\>/g,"&nl;");
		txt=txt.replace(/\<[^\>]*\>/g,"");
		txt=txt.replace(/&amp;/g,"&");
		txt=txt.replace(/\n/g,"&nl;");
		return txt;
	},
	init:function() {
		if (arguments.length>0) this.transposeOptions([],arguments[0]);
		this.loadFields();
		this.containers.container=$(this.selectors.container);
		var h2=document.createElement("h2");
		$(h2).html(dooittitle);
		this.containers.container.append(h2);
		if (yoodoo.dooitteaser!="") {
			var p=document.createElement("p");
			$(p).html(yoodoo.dooitteaser);
			this.containers.container.append(p);
		}
		if (this.key!==null && this.containers.container!==null) {
			var err=this.setup();
			if (err.length>0) {
				this.displayErrors(err);
			}else{
				err=this.dependencies();
				if (err.length>0) {
					this.displayErrors(err);
				}else{
					this.render();
				}
			}
		}else{
			this.displayErrors(['This Doo-it has not been constructed correctly']);
		}
	},
	displayErrors:function(err) {
		var d=document.createElement("div");
		$(d).css({color:'#f00'});
		$(d).html("<div>"+err.join("</div><div>")+"</div>");
		this.containers.container.append(d);
	},
	setup:function() {
		var err=[];
		if (this.fields.career_history===undefined) err.push("Field career_history is not attached to this Doo-it");
		if (this.fields.education_history===undefined) err.push("Field education_history is not attached to this Doo-it");
		if (this.fields.personal_details===undefined) err.push("Field personal_details is not attached to this Doo-it");
		if (this.fields.references===undefined) err.push("Field references is not attached to this Doo-it");
		return err;
	},
	dependencies:function() {
		var err=[];
		if (this.fields.personal_details=='')  err.push("Your Personal Information has not been defined yet.");
		if (this.fields.references=='')  err.push("Your References have not been defined yet.");
		if (this.fields.education_history=='')  err.push("Your Education History has not been defined yet.");
		if (this.fields.career_history=='')  err.push("Your Job History has not been defined yet.");
		return err;
	},
	defaultData:function() {
		return {
			role:null,
			name:this.fields.personal_details.name,
			address:this.fields.personal_details.address1+((this.fields.personal_details.address2=='')?'':', '+this.fields.personal_details.address2),
			postcode:this.fields.personal_details.postcode,
			telephone:this.fields.personal_details.telephone,
			email:this.fields.personal_details.email,
			dob:'',
			doa:'',
			ni_number:'',
			work_authorised:true,
			availability:'Full-time',
			reason_for_leaving:'',
			notice:'',
			wage:'',
			reason_for_applying:'',
			skills:'',
			convictions:false,
			disability:'',
			references:'',
			education:'',
			employment:''
		};
	},
	processReferences:function() {
		if (typeof(this.fields.references.length)=="number") {
			var ref=[];
			for(var r=0;r<this.fields.references.length;r++) {
				var rows=[];
				rows.push(this.fields.references[r].salutation+" "+this.fields.references[r].name);
				if(this.fields.references[r].jobtitle!="") rows.push(this.fields.references[r].jobtitle);
				if(this.fields.references[r].address1!="") {
					var txt=this.fields.references[r].address1+" ";
					if(this.fields.references[r].address2!="") txt+=this.fields.references[r].address2;
					rows.push(txt);
				}
				if(this.fields.references[r].town!="" || this.fields.references[r].county!="" || this.fields.references[r].postcode!="") {
					var txt=this.fields.references[r].town;
					txt+=((txt!="")?" ":"")+this.fields.references[r].county;
					txt+=((txt!="")?" ":"")+this.fields.references[r].postcode;
					rows.push(txt);
				}
				if(this.fields.references[r].telephone!="") rows.push('Tel: '+this.fields.references[r].telephone);
				if(this.fields.references[r].email!="") rows.push('Email: '+this.fields.references[r].email);
				ref.push(rows.join('<br />'));
			}
			return '<div class="suggestion">'+ref.join('</div><div class="suggestion">')+'</div>';
		}else{
			return '';
		}
	},
	processEducation:function() {
		var o=this.fields.education_history;
		var rows=[];
		for(var e=0;e<o.length;e++) {
			var ins=[];
			if (o[e].start!==undefined && o[e].start!=null && o[e].finish!==undefined && o[e].finish!=null) ins.push("<div style='float:right'>"+inputs.formatDate('F Y',o[e].start)+" to "+inputs.formatDate('F Y',o[e].finish)+"</div>");
			if (o[e].school!==undefined && o[e].school!="") ins.push("<b>"+o[e].school+"</b><br />");
			if (o[e].location!==undefined && o[e].location!="") ins.push(o[e].location);
			if (o[e].experience!==undefined && typeof(o[e].experience.length)=="number") {
				var ex=[];
				for(var j=0;j<o[e].experience.length;j++) {
					ex.push(o[e].experience[j].join(" - "));
				}
				ins.push("<blockquote style='margin-top:2px;margin-bottom:2px;'>"+ex.join("<br />")+"</blockquote>");
			}
			rows.push(ins.join(""));
		}
		return '<div class="suggestion">'+rows.join('</div><div class="suggestion">')+'</div>';
	},
	processEmployment:function() {
		var o=this.fields.career_history;
		var rows=[];
		for(var e=0;e<o.length;e++) {
			var ins=[];
			if (o[e].start!==undefined && o[e].start!=null && o[e].finish!==undefined && o[e].finish!=null) ins.push("<div style='float:right'>"+inputs.formatDate('F Y',o[e].start)+" to "+((o[e].present===true)?'present':inputs.formatDate('F Y',o[e].finish))+"</div>");
			if (o[e].company!==undefined && o[e].company!="") ins.push("<b>"+o[e].company+"</b><br />");
			if (o[e].position!==undefined && o[e].position!="") ins.push(o[e].position);
			if (o[e].experience!==undefined && typeof(o[e].experience.length)=="number") {
				ins.push("<blockquote style='margin-top:2px;margin-bottom:2px;'>"+o[e].experience.join("<br />")+"</blockquote>");
			}
			rows.push(ins.join(""));
		}
		return '<div class="suggestion">'+rows.join('</div><div class="suggestion">')+'</div>';
	},
	schema:[
		{title:'Personal Information',content:[
			{title:'I am applying for the role of:',type:'select',options:['Waiter/waitress at Italian restaurant',
												'Shop assistant at a department store',
												'Technical support staff at a computer store',
												'Receptionist at a dental practice',
												'Cold call salesperson'],field:'role'},
			{title:'Name of applicant:',type:'text',field:'name',required:'Absolutely important, you must let them know who you are'},
			{title:'Address:',type:'textarea',field:'address',required:'How can they send you anything if they don\' have your address?'},
			{title:'Postcode:',type:'text',field:'postcode'},
			{title:'Telephone:',type:'text',field:'telephone',required:'They are most likely going to call you at some point'},
			{title:'Email:',type:'text',field:'email',required:'It is advisable to let them contact you by email'},
			{title:'Date of birth:',type:'date',field:'dob',className:'pastOnly'},
			{title:'Date of application:',type:'date',field:'doa',className:'futureOnly'},
			{title:'National Insurance Number:',type:'text',field:'ni_number'},
			{title:'Are you authorised to work in the UK?',type:'select',field:'work_authorised',options:['yes','no']},
			//{title:'Are you authorised to work in the UK?',type:'checkbox',field:'work_authorised',output:{'true':"yes","false":"no"}},
			{title:'What is your availability?',type:'select',options:['Full-time','Part-time'],field:'availability'}
			]
		},
		{title:'Education',routine:'education'},
		{title:'Employment',routine:'employment'},
		{title:'Eligibility',content:[
			{title:'What is the reason for leaving your current/past job?',type:'textarea',field:'reason_for_leaving'},
			{title:'How much notice do you need to give? (Put N/A if not in employment)',type:'text',field:'notice'},
			{title:'What is your current/last salary/hourly pay rate?',type:'text',field:'wage'},
			{title:'Why are you applying for this job?',type:'bigtextarea',field:'reason_for_applying',required:'Be creative, put something that will want them to employ you'},
			{title:'Please outline any skills and experience you have for this job?',type:'bigtextarea',field:'skills',required:'Sell yourself, think about who you are and what you can bring to the job'},
			{title:'Do you have any convictions which are not spent under the Rehabilitation of Offenders?',type:'select',field:'convictions',options:['yes','no']},
			//{title:'Do you have any convictions which are not spent under the Rehabilitation of Offenders?',type:'checkbox',field:'convictions',output:{'true':"yes","false":"no"}},
			{title:'Do we need to make any reasonable adjustments because you have a disability? Please give details or write N/A.',type:'bigtextarea',field:'disability'}
			]
		},
		{title:'References',routine:'referees'}
	],
	referees:function(e) {
		var ed=document.createElement("div");
		$(ed).addClass("formrow");
		if (this.fields.references.length>0) $(ed).html("You have already given us your references. To help you, we've printed them below. Use them to help fill the 'References' box, below.");
		var o=document.createElement("div");
		$(o).css({color:'#777'});
		$(o).html(this.processReferences());
		$(ed).append(o);
		var p=document.createElement("p");
		$(p).html("Provide the details of two referees.");
		$(ed).append(p);
		var q=document.createElement("textarea");
		q.fieldNames=['references'];
		q.value=this.value.references;
		$(q).bind("keyup",function() {
			applications.updateField(this.fieldNames,this.value);
		}).addClass("extraBigTextarea").bind("focus",function() {
			applications.scrollTo(this.parentNode,this);
		});
		$(ed).append(q);
		$(e).append(ed);
	},
	education:function(e) {
		var ed=document.createElement("div");
		$(ed).addClass("formrow");
		if (this.fields.education_history.length>0) $(ed).html("You have already given us some details of your education. To help you, we've printed it below. Use it to help fill the 'Education' box, below.");
		var o=document.createElement("div");
		$(o).css({color:'#777'});
		$(o).html(this.processEducation());
		$(ed).append(o);
		var p=document.createElement("p");
		$(p).html("Provide the details of your education and the qualifications/training received.");
		$(ed).append(p);
		var q=document.createElement("textarea");
		q.fieldNames=['education'];
		q.value=this.value.education;
		$(q).bind("keyup",function() {
			applications.updateField(this.fieldNames,this.value);
		}).addClass("extraBigTextarea").bind("focus",function() {
			applications.scrollTo(this.parentNode,this);
		});
		$(ed).append(q);
		$(e).append(ed);
	},
	employment:function(e) {
		var ed=document.createElement("div");
		$(ed).addClass("formrow");
		if (this.fields.career_history.length>0) $(ed).html("You have already given us some details of your employment history. To help you, we've printed if below. Use if to help fill the 'Employment' box, below.");
		var o=document.createElement("div");
		$(o).css({color:'#777'});
		$(o).html(this.processEmployment());
		$(ed).append(o);
		var p=document.createElement("p");
		$(p).html("Provide the details of your employment and any qualifications/training received.");
		$(ed).append(p);
		var q=document.createElement("textarea");
		q.fieldNames=['employment'];
		q.value=this.value.employment;
		$(q).bind("keyup",function() {
			applications.updateField(this.fieldNames,this.value);
		}).addClass("extraBigTextarea").bind("focus",function() {
			applications.scrollTo(this.parentNode,this);
		});
		$(ed).append(q);
		$(e).append(ed);
	},
	pdfRoutine:{
		education:function() {
			return applications.printAnswer(applications.value.education);
			return true;
			for(var i=0;i<applications.value.education.length;i++) {
				if (applications.value.education[i].show) {
					applications.printJSON.push(applications.printLabel(applications.value.education[i].school+" ("+applications.value.education[i].location+")"));
					applications.printJSON.push(applications.printRight(inputs.formatDate('F Y',applications.value.education[i].start)+" to "+inputs.formatDate('F Y',applications.value.education[i].finish)));
					applications.printJSON.push(applications.printAnswer(applications.value.education[i].qualifications));
				}
			}
		},
		employment:function() {
			return applications.printAnswer(applications.value.employment);
			return true;
			for(var i=0;i<applications.value.employment.length;i++) {
				if (applications.value.employment[i].show) {
					applications.printJSON.push(applications.printLabel(applications.value.employment[i].company));
					applications.printJSON.push(applications.printRight(inputs.formatDate('F Y',applications.value.employment[i].start)+" to "+((applications.value.employment[i].present===true)?'present':inputs.formatDate('F Y',applications.value.employment[i].finish))));
					applications.printJSON.push(applications.printAnswer(applications.value.employment[i].experience));
				}
			}
		},
		referees:function() {
			return applications.printAnswer(applications.value.references);
			return true;
			for(var r=0;r<applications.value.references.length;r++) {
				if (applications.value.references[r]!="") {
					applications.printJSON.push(applications.printSpacer());
					applications.printJSON.push(applications.printIndent(applications.value.references[r]));
				}
			}
		}
	},
	render:function() {
		if (this.value=='') this.value=this.defaultData();
		for(var s=0;s<this.schema.length;s++) {
			var d=document.createElement("div");
			$(d).addClass("section");
			var h3=document.createElement("h3");
			$(h3).html(this.schema[s].title);
			d.appendChild(h3);
			if (this.schema[s].routine!==undefined) {
				applications[this.schema[s].routine](d);
			}else{
				for(var c=0;c<this.schema[s].content.length;c++) {
					var r=document.createElement("div");
					var t=this.schema[s].content[c].type;
					var postLabel=(t!="bigtextarea");
					var label=document.createElement("label");
					$(label).html(this.schema[s].content[c].title);
					if (!postLabel) $(r).addClass("formrow").append(label);
					if (applications.item[this.schema[s].content[c].type]!==undefined) {
						$(label).attr('for',this.schema[s].content[c].field);
						if (this.schema[s].content[c].type=="select") {
							var ip=applications.item.select(this.schema[s].content[c].field,this.schema[s].content[c].options,this.schema[s].content[c].required,this.schema[s].content[c].className);
						}else{
							var ip=applications.item[this.schema[s].content[c].type](this.schema[s].content[c].field,this.schema[s].content[c].required,this.schema[s].content[c].className);
						}
						r.appendChild(ip);
						d.appendChild(r);
					}
					if (postLabel) $(r).addClass("formrow").append(label);
				}
			}
			var clear=document.createElement("div");
			$(clear).css({clear:"both"});
			$(d).append(clear);
			this.containers.container.append(d);
		}
		inputs.radioCheckbox(this.containers.container.find("input[type=checkbox]"),{oncheck:function(o) {o.update();},onuncheck:function(o) {o.update();}});
		var today=new Date();
		today.setHours(0,0,0,0);
		inputs.dropdown(this.containers.container.find("select"),{onSelect:function(o) {o.update();}});
		inputs.date(this.containers.container.find("input.dateInput.pastOnly"),{maxDate:today,formatdisplay:'jS F Y',leftText:'&lt',rightText:'&gt;',selected:function(o) {o.updated();}});
		inputs.date(this.containers.container.find("input.dateInput.futureOnly"),{minDate:today,formatdisplay:'jS F Y',past:false,leftText:'&lt',rightText:'&gt;',selected:function(o) {o.updated();}});
		inputs.date(this.containers.container.find("input.dateInput.anyDate"),{formatdisplay:'jS F Y',leftText:'&lt',rightText:'&gt;',selected:function(o) {o.updated();}});
		var pdfbut=document.createElement("button");
		pdfbut.type="button";
		$(pdfbut).addClass("pdfButton").bind("click",applications.buildPDF).css({float:"right"});
		var footer=document.createElement("div");
		var txt=document.createElement("span");
		$(txt).html("When you have completed your Application Form, you can download and print it, too.<br />This is an Assessment exercise - hit 'Done' when you're finished, and your example Application Form will be sent to your teacher/advisor.");
		$(footer).append(pdfbut).append(txt).css({'text-align':'center'});
		this.containers.container.append(footer);
	},
	item:{
		text:function(field,req,className) {
			var op=document.createElement("input");
			if (className!==undefined) $(op).addClass(className);
			op.type="text";
			op.name=field;
			op.value=applications.value[field];
			op.fieldName=field;
			$(op).bind("keyup",function() {
				applications.updateField(this.fieldName,this.value);
				this.updated();
			}).bind("focus",function() {
				applications.scrollTo(this);
				this.updated();
			});
			if (req!==undefined) {
				op.requiredText=req;
			}
			op.updated=function() {
				if (this.requiredText!==undefined) {
					var label=$(this).next("label");
					if (this.value=='') {
						$(this).addClass("required");
						if (label.find(".warning").get().length>0) {
							label.find(".warning").slideDown();
						}else{
							var w=document.createElement("div");
							$(w).css({display:"none"}).addClass("warning").html(this.requiredText);
							label.append(w);
							$(w).slideDown();
						}
					}else{
						$(this).removeClass("required");
						label.find(".warning").slideUp(function() {$(this).remove();});
					}
				}
			};
			return op;
		},
		date:function(field,req,className) {
			var op=document.createElement("input");
			if (className!==undefined) $(op).addClass(className);
			op.type="text";
			op.name=field;
			op.value=inputs.formatDate('d/m/Y',applications.value[field]);
			op.fieldName=field;
			$(op).addClass("dateInput");
			if (req!==undefined) {
				op.requiredText=req;
			}
			op.updated=function() {
				var val=this.date;
				applications.updateField(this.fieldName,val);
				applications.scrollTo(this);
			};
			return op;
		},
		textarea:function(field,req,className) {
			var op=document.createElement("textarea");
			if (className!==undefined) $(op).addClass(className);
			op.type="text";
			op.name=field;
			op.value=applications.value[field];
			op.fieldName=field;
			$(op).bind("keyup",function() {
				applications.updateField(this.fieldName,this.value);
				this.updated();
			}).bind("focus",function() {
				applications.scrollTo(this);
				this.updated();
			});
			if (req!==undefined) {
				op.requiredText=req;
			}
			op.updated=function() {
				if (this.requiredText!==undefined) {
					var label=$(this).next("label");
					if (this.value=='') {
						$(this).addClass("required");
						if (label.find(".warning").get().length>0) {
							label.find(".warning").slideDown();
						}else{
							var w=document.createElement("div");
							$(w).css({display:"none"}).addClass("warning").html(this.requiredText);
							label.append(w);
							$(w).slideDown();
						}
					}else{
						$(this).removeClass("required");
						label.find(".warning").slideUp(function() {$(this).remove();});
					}
				}
			};
			return op;
		},
		bigtextarea:function(field,req,className) {
			var op=document.createElement("textarea");
			if (className!==undefined) $(op).addClass(className);
			op.type="text";
			op.name=field;
			op.value=applications.value[field];
			op.fieldName=field;
			$(op).bind("keyup",function() {
				applications.updateField(this.fieldName,this.value);
				this.updated();
			}).addClass("bigTextarea").bind("focus",function() {
				applications.scrollTo(this);
				this.updated();
			});
			if (req!==undefined) {
				op.requiredText=req;
			}
			op.updated=function() {
				if (this.requiredText!==undefined) {
					var label=$(this).prev("label");
					if (this.value=='') {
						$(this).addClass("required");
						if (label.find(".warning").get().length>0) {
							label.find(".warning").slideDown();
						}else{
							var w=document.createElement("div");
							$(w).css({display:"none"}).addClass("warning").html(this.requiredText);
							label.append(w);
							$(w).slideDown();
						}
					}else{
						$(this).removeClass("required");
						label.find(".warning").slideUp(function() {$(this).remove();});
					}
				}
			};
			return op;
		},
		checkbox:function(field) {
			var op=document.createElement("input");
			op.type="checkbox";
			op.name=field;
			op.value=applications.value[field];
			op.fieldName=field;
			$(op).bind("keyup",function() {
				this.update();
			});
			op.update=function() {
				applications.updateField(this.fieldName,this.checked);
				applications.scrollTo(this.physicalElement);
			};
			return op;
		},
		select:function(field,options) {
			var op=document.createElement("select");
			var selected=false;
			op.name=field;
			for(var o=0;o<options.length;o++) {
				var opt=document.createElement("option");
				opt.value=opt.text=options[o];
				if (options[o]==applications.value[field]) opt.selected=selected=true;
				$(op).append(opt);
			}
			op.fieldName=field;
			if (!selected) {
				$(op).find("option").get(0).selected=true;
				applications.updateField(field,$(op).val());
			}
			$(op).bind("change",function() {
				this.update();
			});
			op.update=function() {
				applications.updateField(this.fieldName,$(this).val());
				applications.scrollTo(this.physicalElement);
			};
			return op;
		}
	},
	scrollTo:function(o) {
		var s=$(o).offset().top-$('.dooitBox').offset().top-80;
		if (arguments.length>1) {
			var maxScroll=$(arguments[1]).offset().top+$(arguments[1]).outerHeight(true)-$('.dooitBox').offset().top-$('#yoodooScrolledArea').height();
			if (s<maxScroll) s=maxScroll;
		}
		$('#yoodooScrolledArea').animate({scrollTop:s});	
	},
	updateField:function(field,val) {
		if (typeof(field)=="string") {
			applications.value[field]=val;
		}else{
			var f=[];
			for(var i=0;i<field.length;i++) {
				if (isNaN(field[i])) {
					f.push("'"+field[i]+"'");
				}else{
					f.push(field[i]);
				}
			}
			try{
				eval('applications.value['+f.join("][")+']=val;');
			}catch(e) {
				//console.log('Failed to save value to applications.value['+f.join("][")+']');
			}
		}
	},
	loadFields:function() {
		if(this.key===null || array_of_fields[this.key]==undefined) this.key=null;
		if (this.key===null && array_of_default_fields.length>0) this.key=array_of_default_fields[0];
		if (this.key===null) {
			for(var k in array_of_fields) {
				if(this.key===null) this.key=k;
			}
		}
		if(this.key!==null) {
			try{
				eval('this.value='+array_of_fields[this.key][1]+';');
			}catch(e){
				this.value=array_of_fields[this.key][1];
			}
		}
		for(var k in array_of_fields) {
			if (k!=this.key) {
				try{
					eval('this.fields["'+k+'"]='+array_of_fields[k][1]+';');
				}catch(e){
					this.fields[k]=array_of_fields[this.key][1];
				}
			}
		}
		this.value=dooit.decode(this.value);
		this.fields=dooit.decode(this.fields);
	},
	transposeOptions:function(keys,obj) {
		for(var k in obj) {
			if(typeof(obj[k])=="object") {
				var thiskeys=keys.slice();
				thiskeys.push(k);
				this.transposeOptions(thiskeys,obj[k]);
			}else{
				this.setOption(keys,k,obj[k]);
			}
		}
	},
	setOption:function(keys,key,val) {
		try{
			var e=keys.join('.');
			if(e!='') {
				e='this.'+e;
			}else{
				e='this';
			}
			if(isNaN(key)) {
				e+='.'+key+"=val;";
			}else{
				e+='['+key+']=val;';
			}
			eval(e);

		}catch(e){}
	},
	finishable:function() {
		var ok=true;
		return ok;
	},
	output:function() {
		this.getPDFReportData();
		this.value.completed=new Date();
		var op=(dooit.json(this.value));
		array_of_fields[this.key][1]=op;
		var reply={};
		eval('reply.EF'+array_of_fields[this.key][0]+'=op;');
		return reply;
	},
	sendPdf:function() {
		var user=yoodoo.username;
		if (yoodoo.user.firstname!="") {
			user=yoodoo.user.firstname;
			if (yoodoo.user.lastname!="") {
				user+=' '+yoodoo.user.lastname;
			}
		}
		for(var i=0;i<applications.pdfHeader.length;i++) {
			if (applications.pdfHeader[i]!==undefined && applications.pdfHeader[i].text!==undefined) applications.pdfHeader[i].text=applications.pdfHeader[i].text.replace(/{user}/g,user);
		}
		for(var i=0;i<applications.printJSON.length;i++) {
			if (applications.printJSON[i]!==undefined && applications.printJSON[i].text!==undefined) applications.printJSON[i].text=applications.printJSON[i].text.replace(/{user}/g,user);
		}
			
		yoodoo.toPDF({header:applications.pdfHeader,content:applications.printJSON,filename:dooittitle.replace(/[^a-z^0-9]+/ig,'')});
	},
	getPDFReportData:function() {
		applications.value.pdf=[];
		var opdf=[];
		applications.value.pdf.push(applications.printLabel('Scope: Does this assignment constitute the whole or part of Unit 6?  Part'));
		applications.value.pdf.push(applications.printSpacer());
		applications.value.pdf.push(applications.printLabel('Assignment: For the learner to present a job application accurately and in suitable format.'));
		applications.value.pdf.push(applications.printSpacer());
		applications.value.pdf.push(applications.printLabel('Outcome: The learner will be able to present a job application appropriately and accurately.'));
		applications.value.pdf.push(applications.printSpacer());
		applications.value.pdf.push(applications.printLabel('Assessment criteria: The learner should have completed the job application form accurately and presented it in a suitable format.'));
		applications.value.pdf.push(applications.printSpacer());
		applications.value.pdf.push(applications.printSpacer());
		for(var s=0;s<applications.schema.length;s++) {
			opdf.push(applications.printSpacer());
			opdf.push(applications.printH2(applications.schema[s].title));
			if (applications.schema[s].routine!==undefined) {
				opdf.push(applications.printSpacer());
				opdf.push(applications.pdfRoutine[applications.schema[s].routine]());
			}else{
				for(var c=0;c<applications.schema[s].content.length;c++) {
					opdf.push(applications.printSpacer());
					opdf.push(applications.printLabel(applications.schema[s].content[c].title));
					switch(applications.schema[s].content[c].type) {
						case "date":
							opdf.push(applications.printAnswer(inputs.formatDate('jS F Y',applications.value[applications.schema[s].content[c].field])));
						break;
						case "checkbox":
							opdf.push(applications.printAnswer(applications.schema[s].content[c].output[applications.value[applications.schema[s].content[c].field]?'true':'false']));
						break;
						default:
							opdf.push(applications.printAnswer(applications.value[applications.schema[s].content[c].field]));
						break;
					}
				}
			}
		}
		for(var r=0;r<opdf.length;r++) applications.value.pdf.push(opdf[r]);
		return opdf;
	},
	buildPDF:function() {
		applications.printJSON=[];
		var pdfArr=applications.getPDFReportData();
		for(var r=0;r<pdfArr.length;r++) applications.printJSON.push(pdfArr[r]);
		applications.printJSON.push(applications.printSpacer());
		applications.printJSON.push(applications.printLabel('Sign and date below:'));
		applications.printJSON.push(applications.printSpacer());
		applications.printJSON.push(applications.printCenter('Signature: ___________________________    Date: _______________'));
		applications.sendPdf();
	}
};
