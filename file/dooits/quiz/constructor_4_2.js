constructor_dooit={
	key:null,
	keyNumber:0,
	data:{dooit:{title:'Untitled',subheading:''},structure:[]},
	help:{
		serialize:{text:'Serialize will present the user with a question at a time.<br /><em>You must have a paragraph at the top and at the bottom of the question list. These will be the introduction and finish confirmation messages. Also, be sure to check &lsquo;required&rsquo; when you think it is necessary.</em><br /><b>Any grouping or multiples are ignored</b>',width:300,left:false,top:true,xOffset:200,yOffset:0},
		randomize:{text:'Randomize will reorder the questions each time a user visits this doo-it.<br /><em>This is not recommended if the questions are not serialized and are interspersed with paragraphs</em>',width:300,left:false,top:true,xOffset:200,yOffset:0},
		randomOptions:{text:'Randomize options will randomly reorder the options of selects and checkboxes.',width:300,left:false,top:true,xOffset:200,yOffset:0},
		redoable:{text:'When serialized, if redoable is selected, the user will not be able to navigate back and redo the questions.',width:300,left:false,top:true,xOffset:200,yOffset:0},
		copy:{text:'Copy this question including the options.',width:300,left:false,top:true,xOffset:30,yOffset:0},
		remove:{text:'Remove this question.',width:300,left:false,top:true,xOffset:30,yOffset:0}
	},
	attachStructure:[],
	attachData:{},
	container:null,
	reference:{},
	score_system:null,
	fields_content:null,
	uniqueID_length:20,
	nic:null,
	keyChecker:function(ip) {
		ip=ip.replace(/\d([\w]{19})/g,"f$1");
		return ip;
	},
	newKeys:function() {
		for(var s=0;s<this.data.structure.length;s++) {
			this.data.structure[s].id=this.uniqueID();
		}
	},
	init:function() {
		this.data={dooit:{title:'Untitled',subheading:''},structure:[]};
		this.key=null;
		if(typeof(array_of_default_fields)=="object") {
			for(var k=0;k<array_of_default_fields.length;k++) {
				if(/^global_Construct/.test(array_of_default_fields[k])) {
					this.key=array_of_default_fields[k];
				}
			}
		}
		if (this.key===null) {
			for(var k in array_of_fields) {
				if(typeof(array_of_fields[k])=="object") {
					if(/^global_Construct/.test(k)) {
						this.key=k;
						break;
					}
				}
			}
		}
		this.attachStructure=[];
		this.attachData={};
		if (this.key!==null) {
			for(var k in array_of_fields) {
				if (k==this.key) {
					if (array_of_fields[this.key][1]!="") {
						try{
							eval('this.data='+this.decode(this.keyChecker(array_of_fields[this.key][1]))+';');
						}catch(err) {
						}
					}
					this.keyNumber=array_of_fields[this.key][0];
					if (typeof(this.data.dooit)=="undefined" || typeof(this.data.structure)=="undefined") this.data=this.empty_data();
					// check data structure
					if (typeof(this.data.dooit.scoring)=="undefined") this.data.dooit.scoring='none';
					eval('this.score_system=this.scoring.'+this.data.dooit.scoring+';');
					if (this.data.dooit.score_options!=undefined && this.score_system.options!=undefined) {
						this.score_system.options=$.extend(true,{},this.data.dooit.score_options);
						this.score_system.saveOptions();
					}
					for(var s=0;s<this.data.structure.length;s++) {
						for(var o=0;o<this.data.structure[s].value.option.length;o++) {
							if(typeof(this.data.structure[s].value.option[o])=="string") this.data.structure[s].value.option[o]={title:this.data.structure[s].value.option[o],score:null,isdefault:false}; // makes options keyed
						}
					}
				}else if(/^global_Construct/.test(k)) {
					var tmp=null;
					try{
						eval('tmp='+this.decode(this.keyChecker(array_of_fields[k][1]))+';');
					}catch(err){
					}
					if(tmp!==null) {
						for(var t=0;t<tmp.structure.length;t++) {
//console.log(tmp.structure[t]);
							this.attachStructure.push(tmp.structure[t]);
						}
					}
				}else if(/^Data/.test(k)) {
					var tmp=null;
					try{
						eval('tmp='+this.decode(this.keyChecker(array_of_fields[k][1]))+';');
					}catch(err){
					}
					if(tmp!==null) {
						for(var nom in tmp) {
							this.attachData[nom]=tmp[nom];
						}
					}
				}
			}
			this.container=$('.construction').get(0);
			//this.load_reference_data();
			this.render();
		}
	},

/*	load other reference data	*/

	load_reference_data:function() {
		var temp_construct=[];
		var temp_data=[];
		var construct_key=this.key;
		var data_key='';
construct_key='';
		for(var k in array_of_fields) {
			if(typeof(array_of_fields[k])=="object" && k!=construct_key && k!=data_key) {
				if(/^global_Construct/.test(k)) {
					try{
						eval('temp_construct.push('+this.decode(this.keyChecker(array_of_fields[this.key][1]))+');');
					}catch(err) {
					}
				}
				if(/^Data/.test(k)) {
					try{
						eval('temp_data.push('+this.decode(this.keyChecker(array_of_fields[this.key][1]))+');');
					}catch(err) {
					}
				}
			}
		}

		/* Matches construct to data */

		var joined=[];
		for(var c=0;c<temp_construct.length;c++) {
			var idx=null;
			var d=0;
			while(d<temp_data.length && idx===null) {
				var broke=false;
				for(var q=0;q<temp_construct[c].length;q++) {
					if(typeof(temp_data[d][temp_construct[c][q].id])=="undefined") broke=true;
				}
				if (!broke) idx=d;
				d++;
			}
			if(idx!==null) joined.push([temp_construct[c],temp_data[idx]]);
		}
	},



/*	type specific functions	*/


	field_summary:function(d) {
		var content_only=false;
		if (arguments.length>1) content_only=arguments[1];
		switch(this.data.structure[d].value.type) {
			case "paragraph":
				if(this.data.structure[d].paragraph==undefined) this.data.structure[d].paragraph='';
				if (this.data.structure[d].title!='' && this.data.structure[d].paragraph=='') {
					this.data.structure[d].paragraph=this.data.structure[d].title;
				}
				this.data.structure[d].title='';
				var sumText=constructor_dooit.summary_text(this.data.structure[d].paragraph);
				if(sumText=='') sumText="Empty Paragraph";
				var summary=sumText;
//((this.data.structure[d].paragraph=='')?'Undefined':sumText);
				if (content_only) {
					return summary;
				}else{					
					return "<span class='field_summary'>"+summary+"</span>";
				}
			break;
			default:
				var summary='';
				if (this.data.structure[d].value.grouped=='1') {
					summary="Grouped with the above";
				}else{
					if (this.data.structure[d].paragraph!=undefined && this.data.structure[d].paragraph!="" && this.data.structure[d].paragraph!="<br>") {
						summary=constructor_dooit.summary_text(this.data.structure[d].paragraph);
					}else if (this.data.structure[d].title!='') {
						summary=constructor_dooit.summary_text(this.data.structure[d].title);
					}else{
						summary='Undefined';
					}
				}
				summary+=" ["+this.data.structure[d].value.option.length+" x "+this.data.structure[d].value.type+"]";
				if (content_only) {
					return summary;
				}else{					
					return "<span class='field_summary'>"+summary+"</span>";
				}
			break;
		}
	},
	paragraph_title:'<div class="paragraphTitle">Paragraph</div>',
	field_editor:function(d) {
		if (this.data.structure[d].paragraph==undefined || this.data.structure[d].paragraph=='' || this.data.structure[d].paragraph=='<br>') {
			if (this.data.structure[d].value.grouped!="1") {
				if (/[<>]+/.test(this.data.structure[d].title)) {
					this.data.structure[d].paragraph=this.data.structure[d].title;
					this.data.structure[d].title='';
				}
			}
		}
		var op='';
		var ins='';
		if(d>0) {
			if (this.groupable[this.data.structure[d].value.type] && this.groupable[this.data.structure[d-1].value.type]) ins+="<button type='button' class='grouped"+((this.data.structure[d].value.grouped=='1')?' on':'')+"' onclick='constructor_dooit.change(\"grouped\",this);'>"+((this.data.structure[d].value.grouped=='1')?'grouped':'ungrouped')+"</button>";
		}
		var head=false;
		if (this.data.structure.length>d+1) {
			if (this.data.structure[d+1].value.grouped=='1' && this.data.structure[d].value.grouped!='1') head=true;
		}
		var requirable=(this.data.structure[d].value.grouped!='1');
		//if(this.data.structure[d].value.grouped!='1') head=true;
		//if(this.multipliable[this.data.structure[d].value.type]) {
			var multiply=(this.multipliable[this.data.structure[d].value.type] && (this.data.structure[d].value.grouped!='1' || d==1));
			 ins+="<button type='button' style='display:"+(multiply?"block":"none")+"' class='multiple"+((this.data.structure[d].value.multiple=='1')?' on':'')+"' onclick='constructor_dooit.change(\"multiple\",this);'>"+((this.data.structure[d].value.multiple=='1')?'multiple':'single')+"</button>";
		//}
		switch(this.data.structure[d].value.type) {
			case "paragraph":
				op+="<div class='field_info'><div class='paraDisplay'>"+ins+"<div style='clear:both'><div id='paragraph"+d+"' class='paragraph' onclick='constructor_dooit.edit_paragraph(this,"+d+")'>"+this.data.structure[d].paragraph+"</div></div>"+this.type_selector(this.data.structure[d].value.type)+this.type_help[this.data.structure[d].value.type]()+"</div></div>";
			break;
			case "slider":
				//var ins="<button type='button' class='required "+((this.data.structure[d].required=="1")?' on':'')+"' onclick='constructor_dooit.change(\"required\",this);''>"+((this.data.structure[d].required=="1")?'required':'optional')+"</button>";
				op+="<div class='field_info'>"+ins;
				var showPara=(head || this.data.structure[d].value.grouped!="1");
				op+="<div class='paraDisplay' style='display:"+(showPara?'block':'none')+"'>"+this.paragraph_title+"<div style='clear:both'><div id='paragraph"+d+"' class='paragraph head' onclick='constructor_dooit.edit_paragraph(this,"+d+")'>"+((typeof(this.data.structure[d].paragraph)!="undefined")?this.data.structure[d].paragraph:'')+"</div></div></div>";
				//if (head || this.data.structure[d].value.grouped!="1") op+=this.paragraph_title+"<div id='paragraph"+d+"' class='paragraph head' onclick='constructor_dooit.edit_paragraph(this,"+d+")''>"+((typeof(this.data.structure[d].paragraph)!="undefined")?this.data.structure[d].paragraph:'')+"</div>";
				op+="Title: <input type='text' onkeydown='return constructor_dooit.titleKeys(event)' value=\""+this.data.structure[d].title.replace(/"/g,'&rdquo;')+"\" onkeyup='constructor_dooit.edit_title(this);' />"+this.type_selector(this.data.structure[d].value.type)+this.type_help[this.data.structure[d].value.type]()+"</div>";
				var ins=this.type_editor[this.data.structure[d].value.type](this.data.structure[d].value.option);
				op+="<div class='field_container'>"+ins+"</div>";
			break;
			default:
				ins+="<button type='button' style='display:"+(requirable?'block':'none')+"' class='required "+((this.data.structure[d].required=="1")?' on':'')+"' onclick='constructor_dooit.change(\"required\",this);''>"+((this.data.structure[d].required=="1")?'required':'optional')+"</button>";
				op+="<div class='field_info'>"+ins;
				var showPara=(head || this.data.structure[d].value.grouped!="1");
				op+="<div class='paraDisplay' style='display:"+(showPara?'block':'none')+"'>"+this.paragraph_title+"<div style='clear:both'><div id='paragraph"+d+"' class='paragraph head' onclick='constructor_dooit.edit_paragraph(this,"+d+")'>"+((typeof(this.data.structure[d].paragraph)!="undefined")?this.data.structure[d].paragraph:'')+"</div></div></div>";
				op+="Title: <input type='text' onkeydown='return constructor_dooit.titleKeys(event)' value=\""+this.data.structure[d].title.replace(/"/g,'&rdquo;')+"\" onkeyup='constructor_dooit.edit_title(this);' />"+this.type_selector(this.data.structure[d].value.type)+this.type_help[this.data.structure[d].value.type]()+"</div>";
				var ins=this.type_editor[this.data.structure[d].value.type](this.data.structure[d].value.option);
				op+="<div class='field_container'>"+ins+"</div>";
			break;
		}
		return op;
	},
	type:{
		paragraph:function(val) {
			return "Rich text area";
		},
		text:function(val) {
			return "Text input";
		},
		textarea:function(val) {
			return "Multiline Text input";
		},
		numeric:function(val) {
			return "Numeric input";
		},
		checkbox:function(val) {
			return "Checkbox input";
		},
		select:function(val) {
			return "Select input";
		},
		buttons:function(val) {
			return "Button input";
		},
		reference:function(val) {
			return "Reference";
		},
		slider:function(val) {
			return "Slider";
		},
		date:function(val) {
			return "Date";
		}
	},
	type_help:{
		paragraph:function(val) {
			return "";
		},
		text:function(val) {
			return "";
		},
		textarea:function(val) {
			return "";
		},
		numeric:function(val) {
			return "";
		},
		checkbox:function(val) {
			return "";
		},
		select:function(val) {
			return "";
		},
		buttons:function(val) {
			return "";
		},
		reference:function(val) {
			return "<div class='field_help'>You can reference attached text questions if they are ungrouped and multiple.</div>";
		},
		slider:function(val) {
			return "";
		},
		date:function(val) {
			return "";
		}
	},
	type_functions:{
		paragraph:{
			
		},
		text:{
			
		},
		textarea:{
			
		},
		numeric:{
			
		},
		checkbox:{
			
		},
		select:{
			
		},
		buttons:{
			
		},
		reference:{
			attached:function() {
				var refs=[];
				var s=0;
				//var row=[];
				//var grouped=false;
				while(s<constructor_dooit.attachStructure.length) {
					if (constructor_dooit.attachStructure[s].value.multiple=="1" && constructor_dooit.attachStructure[s].value.grouped=="0" && constructor_dooit.referencable[constructor_dooit.attachStructure[s].value.type]) {
						refs.push([s]);
					}
					/*if (constructor_dooit.attachStructure[s].value.multiple=="1" && constructor_dooit.referencable[constructor_dooit.attachStructure[s].value.type]) {
						if (grouped && row.length>0) {
							refs.push(row);
						}
						row=[s];
						grouped=true;
					}else if(grouped && constructor_dooit.referencable[constructor_dooit.attachStructure[s].value.type] && row.length>0){
						row.push(s);
					}else{
						if (constructor_dooit.attachStructure[s].value.multiple!="1"  && grouped && row.length>0) {
							refs.push(row);
						}
						grouped=false;
					}*/
					s++;
				}
				//if(row.length>0) refs.push(row);
				return refs;
			},
			available:function(key) {
				var refs=this.attached();
				var ins=[];
				var op='';
				if(key=='') op+="<option value='-1' selected='true'>Unselected</option>";
				for(var r=0;r<refs.length;r++) {
					ins.push({index:refs[r][0],title:constructor_dooit.attachStructure[refs[r][0]].title});
					var nom=constructor_dooit.attachStructure[refs[r][0]].title.replace(/<[^>]+>/g,'');
					op+="<option value='"+refs[r][0]+"'"+((key==constructor_dooit.attachStructure[refs[r][0]].id)?" selected='true' ":"")+">"+nom+"</option>";
				}
				return "<select onchange='constructor_dooit.change(\"link\",this)' >"+op+"</select>";
			},
			possibleQuestions:function(key) {
				var refs=this.attached();
				var ref=null;
				for(var r=0;r<refs.length;r++) {
					if (constructor_dooit.attachStructure[refs[r][0]].id==key) ref=r;
				}
//console.log(ref);
				if(ref===null) {
					return [];
				}else{
					var reply=[];
					for(var r=0;r<refs[ref].length;r++) {
//console.log(constructor_dooit.attachStructure[refs[ref][r]].value.option);
						for(var q=0;q<constructor_dooit.attachStructure[refs[ref][r]].value.option.length;q++) {
							reply.push({key:constructor_dooit.attachStructure[refs[ref][r]].id,index:q,title:constructor_dooit.attachStructure[refs[ref][r]].value.option[q].title});
						}
					}
					return reply;
				}
			},
			question:function(key,idx) {
				var qi=-1;
				if (arguments.length>2) qi=arguments[2];
				var q=this.possibleQuestions(key);
				var ins=[];
				var op='';
				if(idx<0) {
					if (qi>=0) {
						idx=0;
						constructor_dooit.data.structure[qi].value.option[0].questionIndex=0;
					}else{
						op+="<option value='-1' selected='true'>Unselected</option>";
					}
				}
				if (q.length==0) {
					return "No references found";
				}else if (q.length==1) {
					return q[0].title.replace(/<[^>]+>/g,'');
				}else{
					for(var r=0;r<q.length;r++) {
	//console.log(q[r]);
						var nom=q[r].title.replace(/<[^>]+>/g,'');
	//console.log(nom);
						op+="<option value='"+r+"'"+((idx==r)?" selected='true' ":"")+">"+nom+"</option>";
					}
					return "<select onchange='constructor_dooit.change(\"questionIndex\",this)' >"+op+"</select>";
				}
			}
		},
		slider:{
			
		},
		date:{
			format_values:function() {
				return ['d/m/y','j/n/y','j M Y','jS M','jS F Y','l jS F Y'];
			},
			formats:function(o) {
				var opts=this.format_values();
				var idx=-1;
				if (typeof(o)=="undefined" || o=='') o=opts[0];
				for(var i=0;i<opts.length;i++) {
					if (opts[i]==o) idx=i;
				}
				var op="<select class='date' onchange='constructor_dooit.change(\"format\",this)'>";
				//if (typeof(0)=="undefined" || o=='') op+="<option value=''>Unselected</option>";
				//if (idx<0) op+="<option value='' selected='true'>Unselected</option>";
				if (idx<0) idx=0;
				for(var i=0;i<opts.length;i++) {
					op+="<option value='"+opts[i]+"' "+((idx==i)?"selected='true'":"")+">"+inputs.formatDate(opts[i],new Date())+"</option>";
				}
				op+="</select>";
				return op;
			}
		}
	},
	type_editor:{
		paragraph:function(val) {
			var op="";
			//op+="<a href='javascript:void(0)' onclick='constructor_dooit.add_option(this,\"text\");'>add</a>";
			op+="<div class='fieldvalues'>";
			/*if (val.length==0) op+="No input defined";
			for(var v=0;v<val.length;v++) {
				op+=constructor_dooit.type_option.text(val[v]);
			}*/
			op+="</div>";
			return op;
		},
		text:function(val) {
			var op="<a href='javascript:void(0)' onclick='constructor_dooit.add_option(this,\"text\");'>add</a>";
			op+="<div class='fieldvalues'>";
			if (val.length==0) op+="No input defined";
			for(var v=0;v<val.length;v++) {
				op+=constructor_dooit.type_option.text(val[v]);
			}
			op+="</div>";
			return op;
		},
		textarea:function(val) {
			var op="<a href='javascript:void(0)' onclick='constructor_dooit.add_option(this,\"textarea\");'>add</a>";
			op+="<div class='fieldvalues'>";
			if (val.length==0) op+="No input defined";
			for(var v=0;v<val.length;v++) {
				op+=constructor_dooit.type_option.text(val[v]);
			}
			op+="</div>";
			return op;
		},
		numeric:function(val) {
			var op="<a href='javascript:void(0)' onclick='constructor_dooit.add_option(this,\"numeric\");'>add</a>";
			op+="<div class='fieldvalues'>";
			if (val.length==0) op+="No input defined";
			for(var v=0;v<val.length;v++) {
				op+=constructor_dooit.type_option.numeric(val[v]);
			}
			op+="</div>";
			return op;
		},
		checkbox:function(val) {
			var op="<a href='javascript:void(0)' onclick='constructor_dooit.add_option(this,\"checkbox\");'>add</a>";
			op+="<div class='fieldvalues'>";
			if (val.length==0) op+="No input defined";
			for(var v=0;v<val.length;v++) {
				op+=constructor_dooit.type_option.checkbox(val[v]);
			}
			op+="</div>";
			return op;
		},
		select:function(val) {
			var op="<a href='javascript:void(0)' onclick='constructor_dooit.add_option(this,\"select\");'>add</a>";
			op+="<div class='fieldvalues'>";
			if (val.length==0) op+="No input defined";
			for(var v=0;v<val.length;v++) {
				op+=constructor_dooit.type_option.select(val[v]);

			}
			op+="</div>";
			return op;
		},
		buttons:function(val) {
			var op="<a href='javascript:void(0)' onclick='constructor_dooit.add_option(this,\"buttons\");'>add</a>";
			op+="<div class='fieldvalues'>";
			if (val.length==0) op+="No input defined";
			for(var v=0;v<val.length;v++) {
				op+=constructor_dooit.type_option.buttons(val[v]);

			}
			op+="</div>";
			return op;
		},
		reference:function(val) {
			var op="";
			op+="<div class='fieldvalues'>";
			op+=constructor_dooit.type_option.reference(val[0]);
			op+="</div>";
			return op;
		},
		slider:function(val) {
			var op='';
			op+="<div class='fieldvalues'>";
			op+=constructor_dooit.type_option.slider(val[0]);
			op+="</div>";
			return op;
		},
		date:function(val) {
			var op="<a href='javascript:void(0)' onclick='constructor_dooit.add_option(this,\"date\");'>add</a>";
			op+="<div class='fieldvalues'>";
			if (val.length==0) op+="No input defined";
			for(var v=0;v<val.length;v++) {
				op+=constructor_dooit.type_option.date(val[v]);

			}
			op+="</div>";
			return op;
		}
	},
	type_option:{
		paragraph:function(val) {
			return '';
		},
		text:function(val) {
			var ins="<div class='move movevalue'></div><input type='text' value=\""+val.title.replace(/"/g,'&rdquo;')+"\" onkeyup='constructor_dooit.change(\"title\",this)' />";
			ins+="<button class='removeButton' type='button' onclick='constructor_dooit.remove_option(this);'></button>";
			if (arguments.length>1 && arguments[1]) {
				var op=document.createElement("DIV");
				$(op).addClass("fieldvalue");
				$(op).html(ins);
				return op;
			}else{
				return "<div class='fieldvalue'>"+ins+"</div>";
			}
		},
		textarea:function(val) {
			var ins="<div class='move movevalue'></div><input type='text' value=\""+val.title.replace(/"/g,'&rdquo;')+"\" onkeyup='constructor_dooit.change(\"title\",this)' />";
			ins+="<button class='removeButton' type='button' onclick='constructor_dooit.remove_option(this);'></button>";
			if (arguments.length>1 && arguments[1]) {
				var op=document.createElement("DIV");
				$(op).addClass("fieldvalue");
				$(op).html(ins);
				return op;
			}else{
				return "<div class='fieldvalue'>"+ins+"</div>";
			}
		},
		numeric:function(val) {
			var ins="<div class='move movevalue'></div><input type='text' value=\""+val.title.replace(/"/g,'&rdquo;')+"\" onkeyup='constructor_dooit.change(\"title\",this)' />";
			ins+="<button class='removeButton' type='button' onclick='constructor_dooit.remove_option(this);'></button>";
			if (arguments.length>1 && arguments[1]) {
				var op=document.createElement("DIV");
				$(op).addClass("fieldvalue");
				$(op).html(ins);
				return op;
			}else{
				return "<div class='fieldvalue'>"+ins+"</div>";
			}
		},
		checkbox:function(val) {
			var ins="<div class='move movevalue'></div><input type='text' value=\""+val.title.replace(/"/g,'&rdquo;')+"\" onkeyup='constructor_dooit.change(\"title\",this)' />";
			if (constructor_dooit.score_system.display) ins+=constructor_dooit.score_system.checkbox.selector(val.score,"");
			ins+="<button class='default"+((val.isdefault=='1')?' on':'')+"' type='button' onclick='constructor_dooit.change(\"default\",this)'>default</button>";
			ins+="<button class='removeButton' type='button' onclick='constructor_dooit.remove_option(this);'></button>";
			if (arguments.length>1 && arguments[1]) {
				var op=document.createElement("DIV");
				$(op).addClass("fieldvalue");
				$(op).html(ins);
				return op;
			}else{
				return "<div class='fieldvalue'>"+ins+"</div>";
			}
		},
		select:function(val) {
			var ins="<div class='move movevalue'></div><input type='text' value=\""+val.title.replace(/"/g,'&rdquo;')+"\"onkeyup='constructor_dooit.change(\"title\",this)' />";
			if (constructor_dooit.score_system.display) ins+=constructor_dooit.score_system.select.selector(val.score,"");
			ins+="<button class='default"+((val.isdefault=='1')?' on':'')+"' type='button' onclick='constructor_dooit.change(\"default\",this)'>default</button>";
			ins+="<button class='removeButton' type='button' onclick='constructor_dooit.remove_option(this);'></button>";
			if (arguments.length>1 && arguments[1]) {
				var op=document.createElement("DIV");
				$(op).addClass("fieldvalue");
				$(op).html(ins);
				return op;
			}else{
				return "<div class='fieldvalue'>"+ins+"</div>";
			}
		},
		buttons:function(val) {
			var ins="<div class='move movevalue'></div><input type='text' value=\""+val.title.replace(/"/g,'&rdquo;')+"\" onkeyup='constructor_dooit.change(\"title\",this)' />";
			if (constructor_dooit.score_system.display) ins+=constructor_dooit.score_system.buttons.selector(val.score,"");
			ins+="<button class='default"+((val.isdefault=='1')?' on':'')+"' type='button' onclick='constructor_dooit.change(\"default\",this)'>default</button>";
			ins+="<button class='removeButton' type='button' onclick='constructor_dooit.remove_option(this);'></button>";
			if (arguments.length>1 && arguments[1]) {
				var op=document.createElement("DIV");
				$(op).addClass("fieldvalue");
				$(op).html(ins);
				return op;
			}else{
				return "<div class='fieldvalue'>"+ins+"</div>";
			}
		},
		reference:function(val) {
			var ins="";
			ins+="<label>Source question: "+constructor_dooit.type_functions.reference.available(val.link)+"</label>";
			ins+="<label>Select by: "+constructor_dooit.type_functions.reference.question(val.link,val.questionIndex)+"</label>";
			ins+="<button class='addable"+((val.addable=='1')?' on':'')+"' type='button' onclick='constructor_dooit.change(\"addable\",this)'>addable</button>";
			ins+="<button class='onlyTitle"+((val.onlyTitle=='1')?' on':'')+"' type='button' onclick='constructor_dooit.change(\"onlyTitle\",this)'>title only</button>";
			if (arguments.length>1 && arguments[1]) {
				var op=document.createElement("DIV");
				$(op).addClass("fieldvalue");
				$(op).html(ins);
				return op;
			}else{
				return "<div class='fieldvalue'>"+ins+"</div>";
			}
		},
		slider:function(val) {
			var ins="Min: <input type='text' value='"+val.minText+"' onkeyup='constructor_dooit.change(\"minText\",this);' /><br />";
			ins+="Max: <input type='text' value='"+val.maxText+"' onkeyup='constructor_dooit.change(\"maxText\",this)' /><br />";
			ins+="Divisions: <select onchange='constructor_dooit.change(\"divisions\",this);'>";
			for(var i=2;i<120;i++) {
				if(240 % i == 0) ins+="<option value'"+i+"'"+((val.divisions==i)?' selected="true"':'')+">"+i+"</option>";
			}
			ins+="</select><br />";
			ins+="Start value: <select onchange='constructor_dooit.change(\"start\",this);'>";
			for(var i=2;i<120;i++) {
				if(240 % i == 0) ins+="<option value'"+i+"'"+((val.start==i)?' selected="true"':'')+">"+i+"</option>";

			}
			ins+="</select>";
			if (constructor_dooit.score_system.display) ins+="<br />Score: "+constructor_dooit.score_system.slider.selector(val.score,"'");
			if (arguments.length>1 && arguments[1]) {
				var op=document.createElement("DIV");
				$(op).addClass("fieldvalue");
				$(op).html(ins);
				return op;
			}else{
				return "<div class='fieldvalue'>"+ins+"</div>";
			}
		},
		date:function(val) {
			var ins="<div class='move movevalue'></div><input type='text' value=\""+val.title.replace(/"/g,'&rdquo;')+"\" onkeyup='constructor_dooit.change(\"title\",this)' />";
			//if (constructor_dooit.score_system.display) ins+=constructor_dooit.score_system.select.selector(val.score,"");
			//ins+="<button class='default"+((val.isdefault=='1')?' on':'')+"' type='button' onclick='constructor_dooit.change(\"default\",this)'>default</button>";
			ins+=constructor_dooit.type_functions.date.formats(val.format);
			ins+="<button class='removeButton' type='button' onclick='constructor_dooit.remove_option(this);'></button>";
			if (arguments.length>1 && arguments[1]) {
				var op=document.createElement("DIV");
				$(op).addClass("fieldvalue");
				$(op).html(ins);
				return op;
			}else{
				return "<div class='fieldvalue'>"+ins+"</div>";
			}
		},
	},
	change_type_check:{
		paragraph:function(idx) {
			for(var i=0;i<constructor_dooit.data.structure[idx].value.option.length;i++) {
				if (typeof(constructor_dooit.data.structure[idx].value.option[i].title)=="undefined") constructor_dooit.data.structure[idx].value.option[i].title='';
			}
		},
		text:function(idx) {
			for(var i=0;i<constructor_dooit.data.structure[idx].value.option.length;i++) {
				if (typeof(constructor_dooit.data.structure[idx].value.option[i].title)=="undefined") constructor_dooit.data.structure[idx].value.option[i].title='';
			}
		},
		textarea:function(idx) {
			for(var i=0;i<constructor_dooit.data.structure[idx].value.option.length;i++) {
				if (typeof(constructor_dooit.data.structure[idx].value.option[i].title)=="undefined") constructor_dooit.data.structure[idx].value.option[i].title='';
			}
		},
		numeric:function(idx) {
			for(var i=0;i<constructor_dooit.data.structure[idx].value.option.length;i++) {
				if (typeof(constructor_dooit.data.structure[idx].value.option[i].title)=="undefined") constructor_dooit.data.structure[idx].value.option[i].title='';
			}
		},
		checkbox:function(idx) {
			for(var i=0;i<constructor_dooit.data.structure[idx].value.option.length;i++) {
				if (typeof(constructor_dooit.data.structure[idx].value.option[i].title)=="undefined") constructor_dooit.data.structure[idx].value.option[i].title='';
			}
		},
		select:function(idx) {
			for(var i=0;i<constructor_dooit.data.structure[idx].value.option.length;i++) {
				if (typeof(constructor_dooit.data.structure[idx].value.option[i].title)=="undefined") constructor_dooit.data.structure[idx].value.option[i].title='';
			}
		},
		buttons:function(idx) {
			for(var i=0;i<constructor_dooit.data.structure[idx].value.option.length;i++) {
				if (typeof(constructor_dooit.data.structure[idx].value.option[i].title)=="undefined") constructor_dooit.data.structure[idx].value.option[i].title='';
			}
		},
		reference:function(idx) {
			if(constructor_dooit.data.structure[idx].value.option.length==0) {
				constructor_dooit.data.structure[idx].value.option=[{link:'',questionIndex:0,addable:0,onlyTitle:0}];
			}else{
				constructor_dooit.data.structure[idx].value.option[0].link='';
				constructor_dooit.data.structure[idx].value.option[0].questionIndex=0;
				constructor_dooit.data.structure[idx].value.option[0].addable=0;
				constructor_dooit.data.structure[idx].value.option[0].onlyTitle=0;
			}
		},
		slider:function(idx) {
			if(constructor_dooit.data.structure[idx].value.option.length==0) {
				constructor_dooit.data.structure[idx].value.option=[{minText:'',maxText:'',divisions:'10',start:'5'}];
			}else{
				constructor_dooit.data.structure[idx].value.option[0].minText='';
				constructor_dooit.data.structure[idx].value.option[0].maxText='';
				constructor_dooit.data.structure[idx].value.option[0].divisions='10';
				constructor_dooit.data.structure[idx].value.option[0].start='5';
			}
		},
		date:function(idx) {
			for(var i=0;i<constructor_dooit.data.structure[idx].value.option.length;i++) {
				if (typeof(constructor_dooit.data.structure[idx].value.option[i].title)=="undefined") constructor_dooit.data.structure[idx].value.option[i].title='';
				if (typeof(constructor_dooit.data.structure[idx].value.option[i].format)=="undefined" || constructor_dooit.data.structure[idx].value.option[i].format=='') {
					var df=constructor_dooit.type_functions.date.format_values();
					constructor_dooit.data.structure[idx].value.option[i].format=df[0];
				}
			}
		},
	},
	default_field_values:{
		paragraph:function() {
			return {title:''};
		},
		text:function() {
			return {title:''};
		},
		textarea:function() {
			return {title:''};
		},
		numeric:function() {
			return {title:''};
		},
		checkbox:function() {
			return {title:'',isdefault:'0',score:null};
		},
		select:function() {
			return {title:'',isdefault:'0',score:null};
		},
		buttons:function() {
			return {title:'',isdefault:'0',score:null};
		},
		reference:function() {
			return {title:''};
			//return {link:'',questionIndex:0,addable:0,onlyTitle:0};
		},
		slider:function() {
			return {minText:'',maxText:'',divisions:'10',start:'5'};
		},
		date:function() {
			var df=constructor_dooit.type_functions.date.format_values();
			return {title:'',format:df[0]};
		},
	},
	groupable:{
		paragraph:false,
		text:true,
		textarea:true,
		numeric:true,
		checkbox:true,
		select:true,
		buttons:true,
		reference:true,
		slider:true,
		date:true
	},
	multipliable:{
		paragraph:false,
		text:true,
		textarea:true,
		numeric:true,
		checkbox:true,
		select:true,
		buttons:false,
		reference:true,
		slider:true,
		date:true
	},
	referencable:{
		paragraph:false,
		text:true,
		textarea:true,
		numeric:false,
		checkbox:false,
		select:false,
		buttons:false,
		reference:false,
		slider:false,
		date:false
	},
	new_question_fields:{
		paragraph:function() {
			return [];
		},
		text:function() {
			return [];
		},
		textarea:function() {
			return [];
		},
		numeric:function() {
			return [];
		},
		checkbox:function() {
			return [];
		},
		select:function() {
			return [];
		},
		buttons:function() {
			return [];
		},
		reference:function() {
			return [constructor_dooit.default_field_values.reference()];
		},
		slider:function() {
			return [constructor_dooit.default_field_values.slider()];
		},
		date:function() {
			return [];
		},
	},
	titleKeys:function(e) {
		var kc;
		if (window.event) kc=window.event.keyCode;
		else if (e) kc=e.which;
		var shft=e.shiftKey;
		if (shft && (kc==188 || kc==190)) return false;
		return true;
	},
	change:function(k,o) {
		if(k=="start") {
			var dv=$(o).prev("select");
			var v=parseInt($(o).val());
			var i=$(o.parentNode.parentNode.parentNode.parentNode.parentNode).prevAll('.field').get().length;
			var j=$(o.parentNode).prevAll('.fieldvalue').get().length;
		
			if(v=="none") v=null;
			constructor_dooit.data.structure[i].value.option[j][k]=""+v;
			if(parseInt(dv.val())<v) {
				dv.get(0).selectedIndex=o.selectedIndex;
				constructor_dooit.data.structure[i].value.option[j]['divisions']=""+v;
			}
		}else  if(k=="divisions") {
			var st=$(o).next("select");
			var v=parseInt($(o).val());
			var i=$(o.parentNode.parentNode.parentNode.parentNode.parentNode).prevAll('.field').get().length;
			var j=$(o.parentNode).prevAll('.fieldvalue').get().length;
		
			if(v=="none") v=null;
			constructor_dooit.data.structure[i].value.option[j][k]=""+v;
			if(parseInt(st.val())>v) {
				st.get(0).selectedIndex=o.selectedIndex;
				constructor_dooit.data.structure[i].value.option[j]['start']=""+v;
			}
		}else  if(k=="required") {
			var checked=!$(o).hasClass("on");

			var i=$(o.parentNode.parentNode.parentNode).prevAll('.field').get().length;
			if(checked) {
				$(o).addClass("on");
				$(o).html("required");
			}else{
				$(o).removeClass("on");
				$(o).html("optional");
			}
			constructor_dooit.data.structure[i].required=checked?"1":"0";
		}else  if(k=="multiple") {
			var checked=!$(o).hasClass("on");

			var i=$(o.parentNode.parentNode.parentNode).prevAll('.field').get().length;
			if(checked) {
				$(o).addClass("on");
				$(o).html("multiple");
			}else{
				$(o).removeClass("on");
				$(o).html("single");
			}
			constructor_dooit.data.structure[i].value.multiple=checked?"1":"0";
		}else  if(k=="grouped") {
			var checked=!$(o).hasClass("on");
			var i=$(o.parentNode.parentNode.parentNode).prevAll('.field').get().length;
//console.log(o.parentNode.parentNode.parentNode);
			if(checked) {
				$(o).addClass("on");
				$(o).html("grouped");
				$(o.parentNode.parentNode.parentNode).find('.summary .field_summary').html("Grouped with the above");
				constructor_dooit.data.structure[i].value.multiple="0";
				$(o).next('button.multiple').html('single');
				$(o).next('button.multiple').removeClass("on");
				$(o.parentNode).find(".required").css('display','none');
				$(o.parentNode).find('.paraDisplay').css({display:'none'});

			}else{
				$(o.parentNode).find(".required").css('display','block');
				$(o).removeClass("on");
				$(o).html("ungrouped");
				var t=constructor_dooit.data.structure[i].paragraph;
				if (t=='' || t=='<br>') t=constructor_dooit.data.structure[i].title;
				if (t=='' || t=='<br>') t='Untitled';
				$(o.parentNode.parentNode.parentNode).find('.summary .field_summary').html(t);
				$(o.parentNode).find('.paraDisplay').css({display:'block'});
			}
			var multiply=constructor_dooit.multipliable[constructor_dooit.data.structure[i].value.type];
			$(o).next('button.multiple').css('display',checked?'none':(multiply?'block':'none'));
			constructor_dooit.data.structure[i].value.grouped=checked?"1":"0";
		}else if(k=="default") {
			var checked=!$(o).hasClass("on");
			var i=$(o.parentNode.parentNode.parentNode.parentNode.parentNode).prevAll('.field').get().length;
			var j=$(o.parentNode).prevAll('.fieldvalue').get().length;
			if(constructor_dooit.data.structure[i].value.type=='select') {
				$(o.parentNode.parentNode.parentNode.parentNode).find('button.default').removeClass('on');
				if(checked) $(o).addClass("on");
				for(var s=0;s<this.data.structure[i].value.option.length;s++) {
					constructor_dooit.data.structure[i].value.option[s].isdefault=(s==j && checked)?'1':'0';
				}
			}else{
				if(checked) {
					$(o).addClass("on");
				}else{
					$(o).removeClass("on");
				}
				constructor_dooit.data.structure[i].value.option[j].isdefault=(checked)?'1':'0';
			}
		}else if(k=="link") {
			var v=o.value;
			if(v>=0) {
				var fo=constructor_dooit.parent_of_class(o,'field');
				var i=$(fo).prevAll('.field').get().length;
				if(constructor_dooit.data.structure[i].value.type=='reference') {
					constructor_dooit.data.structure[i].value.option[0].link=constructor_dooit.attachStructure[v].id;
					constructor_dooit.data.structure[i].value.option[0].questionIndex=-1;
					var label=o.parentNode;
					label.innerHTML="Source question: "+constructor_dooit.type_functions.reference.available(constructor_dooit.data.structure[i].value.option[0].link);
					$(label).next("label").html("Select by: "+constructor_dooit.type_functions.reference.question(constructor_dooit.data.structure[i].value.option[0].link,constructor_dooit.data.structure[i].value.option[0].questionIndex,i));
				}
			}
		}else if(k=="addable") {
			var fo=constructor_dooit.parent_of_class(o,'field');
			var i=$(fo).prevAll('.field').get().length;
			if(constructor_dooit.data.structure[i].value.type=='reference') {
				constructor_dooit.data.structure[i].value.option[0].addable=1-constructor_dooit.data.structure[i].value.option[0].addable;
				if(constructor_dooit.data.structure[i].value.option[0].addable) {
					$(o).addClass('on');
				}else{
					$(o).removeClass('on');
				}
			}
		}else if(k=="onlyTitle") {
			var fo=constructor_dooit.parent_of_class(o,'field');
			var i=$(fo).prevAll('.field').get().length;
			if(constructor_dooit.data.structure[i].value.type=='reference') {
				constructor_dooit.data.structure[i].value.option[0].onlyTitle=1-constructor_dooit.data.structure[i].value.option[0].onlyTitle;
				if(constructor_dooit.data.structure[i].value.option[0].onlyTitle) {
					$(o).addClass('on');
				}else{
					$(o).removeClass('on');
				}
			}
		}else if(k=="questionIndex") {
			var v=o.value;
			if(v>=0) {
				var fo=constructor_dooit.parent_of_class(o,'field');
				var i=$(fo).prevAll('.field').get().length;
				if(constructor_dooit.data.structure[i].value.type=='reference') {
					constructor_dooit.data.structure[i].value.option[0].questionIndex=parseInt(v);
				}
			}
		}else{
			var v=$(o).val();
			//var i=$(o.parentNode.parentNode.parentNode.parentNode.parentNode).prevAll('.field').get().length;
//console.log(i);
			var i=$(this.parent_of_class(o,'field')).prevAll('.field').get().length;
//console.log(i);
			//var j=$(o.parentNode).prevAll('.fieldvalue').get().length;
			var j=$(this.parent_of_class(o,'fieldvalue')).prevAll('.fieldvalue').get().length;
		
			if(v=="none") v=null;
			constructor_dooit.data.structure[i].value.option[j][k]=v;
//console.log(constructor_dooit.data.structure);
//console.log(i,j,k);
		}	
	},

	scrollToIndex:function(idx) {
		var target=$('.fields .field').get(idx);
		if (target!==null) {
			var dy=$(target).offset().top-$('.construction').offset().top;
			$('#yoodooScrolledArea').animate({scrollTop:dy},1000);
		}
	},


	empty_data:function() {
		return {dooit:{title:'Untitled',subheading:''},structure:[]};
	},
	field:function() {
		return {title:'',required:'0',id:this.uniqueID(),value:{type:'text',grouped:'0',multiple:'0', option:[]}};
	},
	uniqueID:function() {
		var chars='abcdefgihjklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
		var id='f';
		id+=this.keyNumber;
		while(id.length<this.uniqueID_length) {
			id+=chars[Math.round(Math.random()*(chars.length-1))];
		}
		if(this.id_index(id)>=0) {
			return this.uniqueID();
		}else{
			return id;
		}
	},
	id_index:function(id) {
		var idx=-1;
		for(var i=0;i<this.data.structure.length;i++) {
			if (this.data.structure[i].id==id) idx=i;
		}
		return idx;
	},
	parent_of_class:function(o,c) {
		if(o==document.body) return o;
		if ($(o).hasClass(c)) return o;
		return constructor_dooit.parent_of_class(o.parentNode,c);
	},
	summary_text:function(txt) {
		var txt=txt.replace(/<[^>]+>/g,'');
		if (txt.length>60) txt=txt.substr(0,60)+"...";
		return txt;
	},
	type_selector:function(selected) {
		var op="<select onchange='constructor_dooit.change_type(this)'>";
		for(var k in this.type) {
			op+="<option"+((selected==k)?" selected='selected'":"")+">"+k+"</option>";
		}
		op+="</select>";
		return op;
	},
	scoring_selector:function() {
		var op="<select onchange='constructor_dooit.change_scoring(this)'>";
		for(var k in this.scoring) {
			op+="<option"+((this.data.dooit.scoring==k)?" selected='selected'":"")+" value='"+k+"'>"+this.scoring[k].title+"</option>";
		}
		op+="</select>";
		return op;
	},
	helpMessage:function(type) {
		var ins='<div class="helperText" style="width:'+this.help[type].width+'px;'+(this.help[type].left?'left':'right')+':'+this.help[type].xOffset+'px;'+(this.help[type].top?'top':'bottom')+':'+this.help[type].yOffset+'px;">'+this.help[type].text+'</div>';
		return ins;
	},
	render:function() {
		var op='<h2>Dooit Constructor</h2>';
		op+="<div class='additionalOptions'>";
		op+="<div class='info helper'>"+this.helpMessage('randomize')+"<label>Randomize questions:</label><input type='checkbox' "+((typeof(this.data.dooit.randomize)=="undefined")?"":(this.data.dooit.randomize?"checked":""))+" onchange='constructor_dooit.data.dooit.randomize=this.checked;' /></div>";
		op+="<div class='info helper'>"+this.helpMessage('randomOptions')+"<label>Randomize options:</label><input type='checkbox' "+((typeof(this.data.dooit.randomizeoptions)=="undefined")?"":(this.data.dooit.randomizeoptions?"checked":""))+" onchange='constructor_dooit.data.dooit.randomizeoptions=this.checked;' /></div>";
		op+="<div class='info helper'>"+this.helpMessage('serialize')+"<label>Serialize:</label><input type='checkbox' "+((typeof(this.data.dooit.serialize)=="undefined")?"":(this.data.dooit.serialize?"checked":""))+" onchange='constructor_dooit.data.dooit.serialize=this.checked;$(this.parentNode).next().css(\"display\",this.checked?\"block\":\"none\");' /></div>";
		op+="<div class='info helper' style='display:"+((this.data.dooit.serialize)?"block":"none")+"'>"+this.helpMessage('redoable')+"<label>Redoable:</label><input type='checkbox' "+((typeof(this.data.dooit.redoable)=="undefined")?"":(this.data.dooit.redoable?"checked":""))+" onchange='constructor_dooit.data.dooit.redoable=this.checked;' /></div>";
		op+="</div>";
		op+="<div>";
		op+="<div class='info'><label>Dooit title:</label><input type='text' value=\""+this.data.dooit.title.replace(/"/g,'&rdquo;')+"\" onkeyup='constructor_dooit.data.dooit.title=this.value;' /></div>";
		op+="<div class='info'><label>Subheading:</label><input type='text' value=\""+this.data.dooit.subheading.replace(/"/g,'&rdquo;')+"\"  onkeyup='constructor_dooit.data.dooit.subheading=this.value;' /></div>";
		op+="<div class='info'><label>Scoring:</label>"+this.scoring_selector()+"</div>";
		op+="<div class='scoringOptions'>"+((this.score_system.optionsDisplay!=undefined)?this.score_system.optionsDisplay():'')+"</div>";
		op+="<div class='tag_rule_container'></div>";
		op+="</div>";
		op+="<div class='questions'>";
		op+='Questions : <a href="javascript:constructor_dooit.add();">new</a>';
		op+="<div class='fields'>";
		if (this.data.structure.length>0) {
			for(var d=0;d<this.data.structure.length;d++) op+=this.field_container(d);
		}else{
			op+="No questions yet defined";
		}
		op+="</div>";
		op+='<a href="javascript:constructor_dooit.add();">new</a>';
		op+="</div>";
		$(this.container).html(op);
		this.fields_content=$(this.container).find('.fields').get(0);
//console.log(this.fields_content);
		this.define_sort();
		this.number_field_elements();
		this.manipulate_inputs(this.container);
		$(this.container).find('.tag_rule_container').get(0).appendChild(this.tag_rule_editor.init());
		//inputs.radioCheckbox($(this.container).find('input[type=radio]').get());
	},
	manipulate_inputs:function(o) {
		//inputs.date($(o).find("select.date").get());
	},
	field_container:function(d) {
		var op=null;
		var as_element=false;
		if (arguments.length>1) as_element=arguments[1];
		//var ins="<a href='javascript:void(0);' onclick='constructor_dooit.remove(this.parentNode);' style='float:right'>remove</a>";
		var ins="<button type='button' class='removeButton helper' onclick='constructor_dooit.remove(this.parentNode);' style='float:right'>"+this.helpMessage('remove')+"</button>";
		ins+="<button type='button' class='copyButton helper' onclick='constructor_dooit.copy(this.parentNode);' style='float:right'>"+this.helpMessage('copy')+"</button>";
		ins+="<div class='move movefield'></div>";
		ins+="<div class='summary' onmouseup='constructor_dooit.edit(this);'>"+this.field_summary(d)+"</div>";
		ins+="<div class='editor' style='display:none'>";
		ins+=this.field_editor(d);
		ins+="</div>";
		if (as_element) {
			op=document.createElement("DIV");
			$(op).addClass("field");
			$(op).css("display","none");
			$(op).html(ins);
		}else{
			var op="<div class='field'>"+ins+"</div>";
		}
		return op;
	},
	edit_title:function(ip) {
		var inv=/[\<\>]+/.test(ip.value);
		if (inv) ip.value.replace(/\<[^\>]+\>/g,'');
		if (inv) ip.value.replace(/[\<\>]+/g,'');
		var f=ip.parentNode.parentNode.parentNode;
		this.data.structure[f.index].title=ip.value;
		var sum=$(this.fields_content).find(".field .summary").get(f.index);
		$(sum).html(this.field_summary(f.index));
	},
	edit_paragraph:function(o,d) {
		if(this.nic===null) this.nic=new nicEditor({fullPanel:true,iconsPath:yoodoo.getFilePath('image',true)+'dooits/nicEditorIcons.gif'});
		o.parentNode.parentNode.parentNode.parentNode.rte=this.nic.panelInstance(o.id,{hasPanel:true});
		o.parentNode.parentNode.parentNode.parentNode.rteid=o.id;
		o.parentNode.parentNode.parentNode.parentNode.question=d;
		o.parentNode.parentNode.parentNode.parentNode.field_name='paragraph';
		if ($(o).hasClass("head")) o.parentNode.parentNode.parentNode.field_name='paragraph';
	},
	save_paragraph:function() {
//console.log("Save paragraph");
		if (this.open_editor!==null) {
			if (this.open_editor.rteid!==null && this.nic!==null) {
				var inst=this.nic.instanceById(this.open_editor.rteid);
//console.log(inst.getContent());
				if (typeof(inst)!="undefined") {
					var txt=inst.getContent();
					txt=txt.replace(/\&nbsp\;/g,' ');
					txt=txt.replace(/\n/g,'');
					txt=txt.replace(/\r/g,'');
					var q=$(this.open_editor.parentNode).prevAll('.field').get().length;
					this.data.structure[q][this.open_editor.field_name]=txt;
//console.log(this.open_editor.field_name);
//console.log(this.data.structure[this.open_editor.question]);
					//if (this.open_editor.field_name=='title') {
						var f=this.open_editor.parentNode;
						var sum=$(this.fields_content).find(".field .summary").get(f.index);

				//var sumText=constructor_dooit.summary_text(this.data.structure[d].title);
				//if(sumText=='') sumText="Empty Paragraph";
				//var summary="<span class='field_summary'>"+((this.data.structure[d].title=='')?'Undefined':sumText)+"</span>";
						$(sum).html(this.field_summary(f.index));
					//}else if (this.open_editor.field_name=='paragraph') {
						//var f=this.open_editor.parentNode;
						//var sum=$(this.fields_content).find(".field .summary").get(f.index);
						//$(sum).html(this.field_summary(f.index));
					//}
					this.nic.removeInstance(this.open_editor.rteid);
					this.open_editor.rteid=null;
				}
			}
		}
	},
	change_type:function(ip) {
		this.save_paragraph();
		//var f=ip.parentNode.parentNode.parentNode;
		var f=this.parent_of_class(ip,'field');
		this.data.structure[f.index].value.type=$(ip).val();
		this.change_type_check[this.data.structure[f.index].value.type](f.index);
		if ($(ip).val()=="select") this.unique_default(f.index);
		var ed=$(this.fields_content).find(".field .editor").get(f.index);
		$(ed).html(this.field_editor(f.index));
		var sum=$(this.fields_content).find(".field .summary").get(f.index);
		$(sum).html(this.field_summary(f.index));
	},
	add_option:function(ip,type) {
		var i=ip.parentNode.parentNode.parentNode.index;
		var fieldvalues=$(ip).next('.fieldvalues').get(0);
		if (this.data.structure[i].value.option.length==0) $(fieldvalues).html('');
		var opt=this.type_option[type]({title:'',score:''},true);
		$(opt).css("display","none");
		fieldvalues.appendChild(opt);
		$(opt).slideDown();
		this.data.structure[i].value.option.push(this.default_field_values[type]());
		var f=ip.parentNode.parentNode.parentNode;
		var sum=$(this.fields_content).find(".field .summary").get(f.index);
		$(sum).html(this.field_summary(f.index));
		$(opt).find("input[type=text]").focus();
		this.define_sort_options();
	},
	unique_default:function(i) {
		var defs=0;
		for(var j=0;j<this.data.structure[i].value.option.length;j++) {
			if (this.data.structure[i].value.option[j].isdefault=='1') defs++;
			if(defs>1) this.data.structure[i].value.option[j].isdefault='0';
		}
	},
	remove_option:function(ip) {
		$(ip.parentNode).slideUp(function() {
			var i=$(this.parentNode.parentNode.parentNode.parentNode).prevAll('.field').get().length;
			var j=$(this).prevAll('.fieldvalue').get().length;
			constructor_dooit.data.structure[i].value.option.splice(j,1);
			if (constructor_dooit.data.structure[i].value.length==0) $(this.parentNode).html("No input defined");
			var sum=$(constructor_dooit.fields_content).find(".field .summary").get(i);
			$(sum).html(constructor_dooit.field_summary(i));
			$(this).remove();
		});
	},
	number_field_elements:function() {
		$(this.fields_content).find(".field").each(function(i,o) {
			o.index=i;
		});
	},
	open_editor:null,
	edit:function(summary) {
		var editor=$(summary).next('.editor').get(0);
		if ($(editor).css('display')=="none") {
			$(editor).slideDown();
			if (this.open_editor!==null) {
				$(this.open_editor).slideUp();
				this.save_paragraph();
			}
			this.open_editor=editor;
			this.define_sort_options();
		}else{
			this.save_paragraph();
			if (editor.rte) editor.rte.removeInstance(editor.rteid);
			$(editor).slideUp();
			this.open_editor=null;
		}
	},
	remove:function(f) {
		$(f).slideUp(function() {
			var j=$(this).prevAll(".field").get().length;
			constructor_dooit.data.structure.splice(j,1);
			$(this).remove();
			constructor_dooit.define_sort();
			constructor_dooit.number_field_elements();
		});
	},
	copy:function(f) {
		var j=$(f).prevAll(".field").get().length;
		//constructor_dooit.data.structure.splice(j,1);
		//$(this).remove();
		constructor_dooit.add(j);
	},
	add:function() {
		var idx=null;
		if (arguments.length>0) idx=arguments[0];
		var val=this.field();
		if (idx!==null) {
		//if (this.data.structure.length>0) {
			val.value.type=""+this.data.structure[idx].value.type;
			val.value.option=[];
			for(var i=0;i<this.data.structure[idx].value.option.length;i++) val.value.option.push($.extend(true,[],this.data.structure[idx].value.option[i]));
		}else{
			if (this.data.structure.length>0) {
				val.value.type=this.data.structure[this.data.structure.length-1].value.type;
			}
		}
		if(val.value.option.length==0) val.value.option=this.new_question_fields[val.value.type]();
		//if (val.value.option.length==0) val.value.option=[{title:'',score:null,isdefault:true}];
		this.data.structure.push(val);
		if (this.data.structure.length==1) {
			this.render();
		}else{
			var nf=this.field_container(this.data.structure.length-1,true);
			this.fields_content.appendChild(nf);
			this.define_sort();
			this.number_field_elements();
			$(nf).fadeIn(1000,function() {constructor_dooit.edit($(this).find(".summary").get(0));});
			this.scrollToIndex(this.data.structure.length-1);
		}
	},
	define_sort:function() {
		$(this.fields_content).sortable({items:'.field', handle:'.movefield' ,update:function(e,u) {constructor_dooit.set_order();}});
	},
	define_sort_options:function(fn) {
		this.options_indexing();
		var fo=$(this.open_editor).find('.fieldvalues');
		fo.sortable({items:'.fieldvalue', handle:'.movevalue' ,update:function(e,u) {constructor_dooit.set_order_options();}});
	},
	set_order:function() {
		var ol=[];
		$(this.fields_content).find(".field").each(function(i,o) {
			ol.push(constructor_dooit.data.structure[o.index]);
			o.index=i;
		});
		this.data.structure=ol;
		$(this.fields_content).find(".field").each(function(i,o) {
			//console.log(constructor_dooit.data.structure[i].id+","+constructor_dooit.data.structure[i].value.grouped);
			if((i==0) || (i>0 && (!constructor_dooit.groupable[constructor_dooit.data.structure[i].value.type] || !constructor_dooit.groupable[constructor_dooit.data.structure[i-1].value.type]))) {
				constructor_dooit.data.structure[i].value.grouped='0';
				//$(o).find('.summary .field_summary').html(constructor_dooit.field_summary(i,true));
			}else{
				//$(o).find('.summary .field_summary').html((constructor_dooit.data.structure[i].value.grouped=="1")?"Grouped with the above":constructor_dooit.field_summary(i,true));
			}
				$(o).find('.summary .field_summary').html(constructor_dooit.field_summary(i,true));
			$(o).find('.editor').html(constructor_dooit.field_editor(i));
		});
	},
	set_order_options:function() {
		var ol=[];
		var j=$(constructor_dooit.open_editor.parentNode).prevAll(".field").get().length;
		$(this.open_editor).find(".fieldvalue").each(function(i,o) {
			var oi=o.index;
			ol.push(constructor_dooit.data.structure[j].value.option[oi]);
			//ol.push($(o).find("input").val());
			o.index=i;
		});
		this.data.structure[j].value.option=ol;
	},
	options_indexing:function() {
		$(this.open_editor).find(".fieldvalue").each(function(i,o) {
			o.index=i;
		});
	},
	finishable:function() {
		return (this.data.structure.length>0);
	},
	output:function() {
		if (this.open_editor!==null) this.save_paragraph(this.open_editor);
		var op=dooit.json(this.data);
		yoodoo.console(op);
		array_of_fields[this.key][1]=op;
		var reply={};
		eval('reply.EF'+array_of_fields[this.key][0]+'=op;');
		return reply;
	},
	json:function(o) {
		if (o===null) {
			return 'null';
		}else if (typeof(o)=="string") {
			return '"'+this.encode(o)+'"';
//'"'+o.replace(/"/g,'\\"')+'"';
		}else if (o.getFullYear) {
			return 'new Date('+o.getFullYear()+','+o.getMonth()+','+o.getDate()+')';
		}else{
			var keyed=false;
			for(var k in o) {
				if (isNaN(k)) keyed=true;
			}
			var col=[];
			if (keyed) {
				for(var k in o) {
					col.push(k+':'+this.json(o[k]));
				}
			}else{
				for(var k in o) {
					col.push(this.json(o[k]));
				}
			}
			var op=col.join(",");
			if (keyed) {
				op='{'+op+'}';
			}else{
				op='['+op+']';
			}
			return op;
		}
	},
	encode:function(ip) {
		ip=ip.replace(/'/g,'&sq;');
		ip=ip.replace(/"/g,'&dq;');
		return ip;
	},
	decode:function(ip) {
		ip=ip.replace(/&sq;/g,"'");
		ip=ip.replace(/&dq;/g,'\\"');
		return ip;
	},
	change_scoring:function(t) {
		this.data.dooit.scoring=$(t).val();
		eval('this.score_system=this.scoring.'+this.data.dooit.scoring+';');
		if (this.score_system.saveOptions!=undefined) this.score_system.saveOptions();
		//if (this.score_system.optionsDisplay!=undefined) $('.scoringOptions').html(this.score_system.optionsDisplay());
		this.render();
	},
	searchAndReplace:function(s,r) {
		this.output();
		var txt=array_of_fields[this.key][1];
		var ev='txt.replace(/'+s.replace(/(\W)/g,"\\$1")+'/g,r);';
		console.log(ev);
		eval('txt='+ev);
		array_of_fields[this.key][1]=txt;
		this.init();
		console.log('If this has broken the data, DO NOT SAVE');
	},

	tag_rule_editor:{
		container:null,
		build_set:function() {
			if(constructor_dooit.data.dooit.tag_rules==undefined) constructor_dooit.data.dooit.tag_rules={};
			if(constructor_dooit.data.dooit.tag_rules.tags==undefined) constructor_dooit.data.dooit.tag_rules.tags=[''];
			if(constructor_dooit.data.dooit.tag_rules.rules==undefined) constructor_dooit.data.dooit.tag_rules.rules=[];
			if(constructor_dooit.data.dooit.tag_rules.options==undefined) constructor_dooit.data.dooit.tag_rules.options={reset:false};
		},
		init:function() {
			this.container=document.createElement("div");
			if(constructor_dooit.score_system.range.length>0) {
				this.build_set();
				$(this.container).addClass("tag_rule_editor");
				$(this.container).html('<a href="javascript:void(0)" onclick="constructor_dooit.tag_rule_editor.toggle(this)">Show Tag Rule editor</a><div style="display:none"><ul><li class="on" onclick="constructor_dooit.tag_rule_editor.showTab(\'tags\',this)">Tags</li><li onclick="constructor_dooit.tag_rule_editor.showTab(\'rules\',this)">Rules</li></ul><div class="tab_content"><div class="tag_content"></div><div class="rule_content"></div></div></div>');
				$(this.container).find('.tag_content').get(0).appendChild(this.tag_list());
				//this.container.appendChild(this.rule_list());
			}
			return this.container;
		},
		showTab:function(t,o) {
			if (!$(o).hasClass("on")) {
				$(o).siblings(".on").removeClass("on");
				if(t=="tags") {
					$(this.container).find(".tab_content .tag_content").get(0).appendChild(this.tag_list());
					$(this.container).find(".tab_content .tag_content").slideDown(500);
					$(this.container).find(".tab_content .rule_content").slideUp(500,function() {$(this).html("");});
				}else if (t=="rules") {
					$(this.container).find(".tab_content .rule_content").get(0).appendChild(this.rule_list());
					$(this.container).find(".tab_content .tag_content").slideUp(500,function() {$(this).html("");});
					$(this.container).find(".tab_content .rule_content").slideDown();
				}
				$(o).addClass("on");
			}
		},
		toggle:function(o) {
			if($(o).hasClass("on")) {
				$(o).removeClass("on");
				$(o).next().slideUp();
				$(o).html("Show Tag Rule editor");
			}else{
				$(o).addClass("on");
				$(o).next().slideDown();
				$(o).html("Hide Tag Rule editor");
			}
		},
		tag_list:function() {
			var ins=document.createElement("div");
			$(ins).addClass('tag_list');
			var comment='<div>Group of tags that the rules will utilize:</div>';
			$(ins).html(comment+"<button type='button' onclick='constructor_dooit.tag_rule_editor.add_tag()'>add tag</button>");
			for(var i=0;i<constructor_dooit.data.dooit.tag_rules.tags.length;i++) {
				ins.appendChild(this.tag_item(i));
			}
			return ins;
		},
		tag_item:function(i) {
			var tag=document.createElement("div");
			$(tag).addClass("tag_item");
			$(tag).html("<input type='text' onkeyup='constructor_dooit.tag_rule_editor.update_tag(this)' /><button type='button' onclick='constructor_dooit.tag_rule_editor.remove_tag(this)' class='removeButton'></button>");
			$(tag).find("input").val(constructor_dooit.data.dooit.tag_rules.tags[i]);
			return tag;
		},
		update_tag:function(o) {
			var i=$(o.parentNode).prevAll('.tag_item').get().length;
			constructor_dooit.data.dooit.tag_rules.tags[i]=$(o).val();
		},
		remove_tag:function(o) {
			var i=$(o.parentNode).prevAll('.tag_item').get().length;
			constructor_dooit.data.dooit.tag_rules.tags.splice(i,1);
			$(o.parentNode).slideUp(500,function() {$(this).remove();});
		},
		add_tag:function() {
			constructor_dooit.data.dooit.tag_rules.tags.push('');
			var item=this.tag_item(constructor_dooit.data.dooit.tag_rules.tags.length-1);
			$(item).css({display:'none'});
			$(this.container).find('.tag_list').get(0).appendChild(item);
			$(item).slideDown();
			$(item).find('input').focus();
		},
		empty_rule:function() {
			return {tag:'',colour:'',highest:false,lowest:false,unique:false};
		},
		setOption:function(type,o) {
			switch(type) {
				case "reset":
					constructor_dooit.data.dooit.tag_rules.options.reset=o.checked;
					break;
			}
		},
		rule_list:function() {
			var ins=document.createElement("div");
			$(ins).addClass('rule_list');
			var comment='<div>Rules are processed sequentially and subsequent rules may override a previous one.</div>';
			comment+="<div><label>Reset all tags before validating the rules <input type='checkbox' onchange='constructor_dooit.tag_rule_editor.setOption(\"reset\",this)' "+(constructor_dooit.data.dooit.tag_rules.options.reset?'checked':'')+" /></label></div>";
			$(ins).html(comment+"<button type='button' onclick='constructor_dooit.tag_rule_editor.add_rule()'>new rule</button>");
			for(var i=0;i<constructor_dooit.data.dooit.tag_rules.rules.length;i++) {
				ins.appendChild(this.rule_item(i));
			}
			return ins;
		},
		rule_item:function(r) {
			var rule=document.createElement("div");
			$(rule).addClass("rule_item");
			var ins='<label>Tag : <select onchange="constructor_dooit.tag_rule_editor.update_rule(\'tag\',this)">';
			ins+="<option></option>";
			for(var i=0;i<constructor_dooit.data.dooit.tag_rules.tags.length;i++) {
				ins+="<option"+((constructor_dooit.data.dooit.tag_rules.rules[r].tag==constructor_dooit.data.dooit.tag_rules.tags[i])?' selected="true"':'')+">"+constructor_dooit.data.dooit.tag_rules.tags[i]+"</option>";
			}
			ins+="</select></label>";
			ins+='<label>Colour : <select onchange="constructor_dooit.tag_rule_editor.update_rule(\'colour\',this)">';
			ins+="<option></option>";
			for(var i=0;i<constructor_dooit.score_system.range.length;i++) {
				ins+="<option"+((constructor_dooit.data.dooit.tag_rules.rules[r].colour==constructor_dooit.score_system.range[i])?' selected="true"':'')+">"+constructor_dooit.score_system.range[i]+"</option>";
			}
			ins+="</select></label>";
			ins+='<label>Highest: <input type="checkbox" '+(constructor_dooit.data.dooit.tag_rules.rules[r].highest?' checked':'')+' onchange="constructor_dooit.tag_rule_editor.update_rule(\'highest\',this)"/></label>';
			ins+='<label>Lowest: <input type="checkbox" '+(constructor_dooit.data.dooit.tag_rules.rules[r].lowest?' checked':'')+' onchange="constructor_dooit.tag_rule_editor.update_rule(\'lowest\',this)"/></label>';
			ins+='<label>Unique: <input type="checkbox" '+(constructor_dooit.data.dooit.tag_rules.rules[r].unique?' checked':'')+' onchange="constructor_dooit.tag_rule_editor.update_rule(\'unique\',this)"/></label>';

			$(rule).html(ins+"<button type='button' onclick='constructor_dooit.tag_rule_editor.remove_rule(this)' class='removeButton'></button>");
			return rule;
		},
		update_rule:function(t,o) {
			var i=$(o.parentNode.parentNode).prevAll('.rule_item').get().length;
			if (t=="highest" || t=="lowest" || t=="unique") {
				constructor_dooit.data.dooit.tag_rules.rules[i][t]=o.checked;
			}else{
				constructor_dooit.data.dooit.tag_rules.rules[i][t]=$(o).val();
			}
		},
		remove_rule:function(o) {
			var i=$(o.parentNode).prevAll('.rule_item').get().length;
			constructor_dooit.data.dooit.tag_rules.rules.splice(i,1);
			$(o.parentNode).slideUp(500,function() {$(this).remove();});
		},
		add_rule:function() {
			constructor_dooit.data.dooit.tag_rules.rules.push(this.empty_rule());
			var item=this.rule_item(constructor_dooit.data.dooit.tag_rules.rules.length-1);
			$(item).css({display:'none'});
			$(this.container).find('.rule_list').get(0).appendChild(item);
			$(item).slideDown();
		}

	},

/*	Scoring systems	*/

	scoring:{
		none:{
			title:'No scoring',
			range:[],
			display:false
		},
		rag_balloons:{
			title:'Red Amber Green Balloons',
			range:['red','amber','green'],
			display:true,
			checkbox:{
				selector:function(val,attrs) {
					var ins="<select onchange='constructor_dooit.change(\"score\",this);"+attrs+"'>";
					ins+="<option value='none'>none</option>";
					for(var k=0;k<constructor_dooit.score_system.range.length;k++) {
						var s=constructor_dooit.score_system.range[k];
						ins+="<option value='"+s+"'"+((s==val)?" selected='selected'":"")+">"+s+"</option>";
					}
					ins+="</select>";
					return ins;
				}
			},
			select:{
				selector:function(val,attrs) {
					var ins="<select onchange='constructor_dooit.change(\"score\",this);"+attrs+"'>";
					ins+="<option value='none'>none</option>";
					for(var k=0;k<constructor_dooit.score_system.range.length;k++) {
						var s=constructor_dooit.score_system.range[k];
						ins+="<option value='"+s+"'"+((s==val)?" selected='selected'":"")+">"+s+"</option>";
					}
					ins+="</select>";
					return ins;
				}
			},
			slider:{
				selector:function(val,attrs) {
					var ins="<select onchange='constructor_dooit.change(\"score\",this);"+attrs+"'>";
					ins+="<option value='none'>none</option>";
					var l=constructor_dooit.score_system.range[0];
					var r=constructor_dooit.score_system.range[constructor_dooit.score_system.range.length-1];
					ins+="<option value='MinToMax' "+((val=='MinToMax')?" selected='selected'":"")+">"+l+" to "+r+"</option>";
					ins+="<option value='MaxToMin' "+((val=='MaxToMin')?" selected='selected'":"")+">"+r+" to "+l+"</option>";
					ins+="</select>";
					return ins;
				}
			},
			buttons:{
				selector:function(val,attrs) {
					var ins="<select onchange='constructor_dooit.change(\"score\",this);"+attrs+"'>";
					ins+="<option value='none'>none</option>";
					for(var k=0;k<constructor_dooit.score_system.range.length;k++) {
						var s=constructor_dooit.score_system.range[k];
						ins+="<option value='"+s+"'"+((s==val)?" selected='selected'":"")+">"+s+"</option>";
					}
					ins+="</select>";
					return ins;
				}
			}
		},
		galileo:{
			title:'Galileo thermometer',
			range:['red','amber','green'],
			display:true,
			checkbox:{
				selector:function(val,attrs) {
					var ins="<select onchange='constructor_dooit.change(\"score\",this);"+attrs+"'>";
					ins+="<option value='none'>none</option>";
					for(var k=0;k<constructor_dooit.score_system.range.length;k++) {
						var s=constructor_dooit.score_system.range[k];
						ins+="<option value='"+s+"'"+((s==val)?" selected='selected'":"")+">"+s+"</option>";
					}
					ins+="</select>";
					return ins;
				}
			},
			select:{
				selector:function(val,attrs) {
					var ins="<select onchange='constructor_dooit.change(\"score\",this);"+attrs+"'>";
					ins+="<option value='none'>none</option>";
					for(var k=0;k<constructor_dooit.score_system.range.length;k++) {
						var s=constructor_dooit.score_system.range[k];
						ins+="<option value='"+s+"'"+((s==val)?" selected='selected'":"")+">"+s+"</option>";
					}
					ins+="</select>";
					return ins;
				}
			},
			buttons:{
				selector:function(val,attrs) {
					var ins="<select onchange='constructor_dooit.change(\"score\",this);"+attrs+"'>";
					ins+="<option value='none'>none</option>";
					for(var k=0;k<constructor_dooit.score_system.range.length;k++) {
						var s=constructor_dooit.score_system.range[k];
						ins+="<option value='"+s+"'"+((s==val)?" selected='selected'":"")+">"+s+"</option>";
					}
					ins+="</select>";
					return ins;
				}
			},
			slider:{
				selector:function(val,attrs) {
					var ins="<select onchange='constructor_dooit.change(\"score\",this);"+attrs+"'>";
					ins+="<option value='none'>none</option>";
					var l=constructor_dooit.score_system.range[0];
					var r=constructor_dooit.score_system.range[constructor_dooit.score_system.range.length-1];
					ins+="<option value='MinToMax' "+((val=='MinToMax')?" selected='selected'":"")+">"+l+" to "+r+"</option>";
					ins+="<option value='MaxToMin' "+((val=='MaxToMin')?" selected='selected'":"")+">"+r+" to "+l+"</option>";
					ins+="</select>";
					return ins;
				}
			}
		},
		multi_balloons:{
			title:'Upto 6 Balloons',
			range:['red','amber','green','purple','yellow','blue'],
			fullrange:['red','amber','green','purple','yellow','blue'],
			display:true,
			options:{
				count:6,
				display:true
			},
			saveOptions:function() {
				constructor_dooit.data.dooit.score_options=$.extend(true,{},constructor_dooit.score_system.options);
				constructor_dooit.score_system.range=[];
				for(var i=0;i<constructor_dooit.score_system.options.count;i++) {
					constructor_dooit.score_system.range.push(constructor_dooit.score_system.fullrange[i]);
				}
			},
			optionsDisplay:function(){
				var ins='<div class="info"><label>How many colours? </label><select onchange="constructor_dooit.score_system.options.count=parseInt($(this).val());constructor_dooit.score_system.saveOptions();constructor_dooit.render();">';
				for(var k=1;k<=constructor_dooit.score_system.fullrange.length;k++) {
					ins+="<option"+((constructor_dooit.score_system.options.count==k)?' selected':'')+">"+k+"</option>";
				}
				ins+="</select></div>";
				ins+='<div class="info"><label>Display? </label><input type="checkbox" '+(constructor_dooit.score_system.options.display?'checked':'')+' onchange="constructor_dooit.score_system.options.display=!constructor_dooit.score_system.options.display;constructor_dooit.score_system.saveOptions();"/>';
				ins+="</select></div>";
				return ins;
			},
			checkbox:{
				selector:function(val,attrs) {
					var ins="<select onchange='constructor_dooit.change(\"score\",this);"+attrs+"'>";
					ins+="<option value='none'>none</option>";
					for(var k=0;k<constructor_dooit.score_system.range.length;k++) {
						var s=constructor_dooit.score_system.range[k];
						ins+="<option value='"+s+"'"+((s==val)?" selected='selected'":"")+">"+s+"</option>";
					}
					ins+="</select>";
					return ins;
				}
			},
			select:{
				selector:function(val,attrs) {
					var ins="<select onchange='constructor_dooit.change(\"score\",this);"+attrs+"'>";
					ins+="<option value='none'>none</option>";
					for(var k=0;k<constructor_dooit.score_system.range.length;k++) {
						var s=constructor_dooit.score_system.range[k];
						ins+="<option value='"+s+"'"+((s==val)?" selected='selected'":"")+">"+s+"</option>";
					}
					ins+="</select>";
					return ins;
				}
			},
			slider:{
				selector:function(val,attrs) {
					var ins="<select onchange='constructor_dooit.change(\"score\",this);"+attrs+"'>";
					ins+="<option value='none'>none</option>";
					var l=constructor_dooit.score_system.range[0];
					var r=constructor_dooit.score_system.range[constructor_dooit.score_system.range.length-1];
					ins+="<option value='MinToMax' "+((val=='MinToMax')?" selected='selected'":"")+">"+l+" to "+r+"</option>";
					ins+="<option value='MaxToMin' "+((val=='MaxToMin')?" selected='selected'":"")+">"+r+" to "+l+"</option>";
					ins+="</select>";
					return ins;
				}
			},
			buttons:{
				selector:function(val,attrs) {
					var ins="<select onchange='constructor_dooit.change(\"score\",this);"+attrs+"'>";
					ins+="<option value='none'>none</option>";
					for(var k=0;k<constructor_dooit.score_system.range.length;k++) {
						var s=constructor_dooit.score_system.range[k];
						ins+="<option value='"+s+"'"+((s==val)?" selected='selected'":"")+">"+s+"</option>";
					}
					ins+="</select>";
					return ins;
				}
			}
		},
	}
}
dooit.temporaries('constructor_dooit');
