questionaire={
	key:null,
	mustSave:false,
	keyNumber:0,
	data:{dooit:{title:'Untitled',subheading:''},structure:[]},
	layout:'<div class="construction">&nbsp;</div>\n<script type="text/javascript">\nfunction initThis() {\nvar param={};\nparam.dependencies=[\n[\'dooits/inputs.js\',true],\n[\'dooits/quiz/display_dooit.js\',true],\n[\'dooits/utility/summary.js\',true],\n[\'css/dooits.css\',true],\n[\'css/quiz/display_dooit.css\',true],\n[\'css/quiz/calendar.css\',true]\n];\nparam.loaded=function(){\ndisplay_dooit.init();\n};\nparam.saveValues=["display_dooit.output"];\nparam.finished="display_dooit.finishable";\ndooit.init(param);\n}\n</script>',
	help:{
		serialize:{text:'Serialize will present the user with a question at a time.<br /><em>You must have a paragraph at the top and at the bottom of the question list. These will be the introduction and finish confirmation messages. Also, be sure to check &lsquo;required&rsquo; when you think it is necessary.</em><br /><b>Any grouping or multiples are ignored</b>',width:300,left:true,top:true,xOffset:200,yOffset:0},
		report:{text:'Report allows the viewing of a summary of their answers',width:300,left:true,top:true,xOffset:200,yOffset:0},
		reportButtonText:{text:'When reporting is available, the button to show the report will have this text',width:300,left:true,top:true,xOffset:200,yOffset:0},
		editButtonText:{text:'When reporting is available, the button to hide the report and return to the questionaire will have this text',width:300,left:true,top:true,xOffset:200,yOffset:0},
		randomize:{text:'Randomize will reorder the question groups on a user\'s first entry.<br /><em>Note: ungrouped paragraphs may end up out of order.</em>',width:300,left:true,top:true,xOffset:200,yOffset:0},
		randomOptions:{text:'Randomize options will randomly reorder the options of selects and checkboxes.',width:300,left:true,top:true,xOffset:200,yOffset:0},
		redoable:{text:'When serialized, if redoable is selected, the user will not be able to navigate back and redo the questions.',width:300,left:true,top:true,xOffset:200,yOffset:0},
		copy:{text:'Copy this question including the options.',width:300,left:false,top:true,xOffset:30,yOffset:0},
		remove:{text:'Remove this question.',width:300,left:false,top:true,xOffset:30,yOffset:0},
		startbutton:{text:'When serialized this text will override the next in the next button.',width:300,left:true,top:true,xOffset:200,yOffset:0}
	},
	library:null,
	attachStructure:[],
	attachData:{},
	container:null,
	reference:{},
	score_system:null,
	fields_content:null,
	uniqueID_length:20,
	nic:null,
	keyChecker:function(ip) {
		///ip=ip.replace(/\d([\w]{19})/g,"f$1");
		return ip;
	},
	newKeys:function() {
		for(var s=0;s<this.data.structure.length;s++) {
			this.data.structure[s].id=this.uniqueID();
		}
	},
	init:function() {
		recovery.templateOutput=function() {return questionaire.json(questionaire.data).replace(/\n/g,'');};
		recovery.templateRestart=function() {questionaire.init();};
		var ta=$('#globalFieldContent').val();
		/*this.autosave=typeof(localStorage)!="undefined";
		if (this.autosave) {
			this.autosaveKey='globalFieldId'+$('input[name=globalFieldId]').val();
			if (localStorage[this.autosaveKey]!==undefined && localStorage[this.autosaveKey]!="" && localStorage[this.autosaveKey]!=ta) {
				if (window.confirm("Recover autosave data?")) {
					$('textarea#globalFieldContent').val(localStorage[this.autosaveKey]);
					localStorage[this.autosaveKey]='';
					questionaire.init();
					return false;
				}
			}
		}
		setInterval('questionaire.saveLocal();',60000);*/
		$('form#sf_admin_edit_form').submit(function() {
			questionaire.save();
		});
		this.data={dooit:{title:'Untitled',subheading:''},structure:[]};
		this.attachStructure=[];
		this.attachData={};
		try{
			eval('this.data='+this.decode(this.keyChecker(ta))+';');
		}catch(err) {
			if ($('textarea#globalFieldContent').val()!="") alert("Failed to load the structure");
		}
		if (typeof(this.data.dooit)=="undefined" || typeof(this.data.structure)=="undefined") this.data=this.empty_data();
		if (typeof(this.data.dooit.scoring)=="undefined") this.data.dooit.scoring='none';
		eval('this.score_system=this.scoring.'+this.data.dooit.scoring+';');
		if (this.data.dooit.score_options!=undefined && this.score_system.options!=undefined) {
			this.score_system.options=$.extend(true,{},this.data.dooit.score_options);
			this.score_system.saveOptions();
		}
		if (typeof(questionaire.data.dooit.tag_rules)=="undefined") questionaire.data.dooit.tag_rules={tags:[]};
		for(var s=0;s<this.data.structure.length;s++) {

			for(var o=0;o<this.data.structure[s].value.option.length;o++) {
				if(typeof(this.data.structure[s].value.option[o])=="string") this.data.structure[s].value.option[o]={title:this.data.structure[s].value.option[o],score:null,isdefault:false}; // makes options keyed
			}
		}
		if (typeof(otherGlobals)!="undefined") {
			for(var k in otherGlobals) {
				var id=otherGlobals[k][0];
				var name=otherGlobals[k][1];
				var textareaid="globalFieldContent"+id;
				if(/^global_Construct/.test(name)) {
					var tmp=null;
					try{
						eval('tmp='+this.decode(this.keyChecker($('#'+textareaid).val()))+';');
					}catch(err){
					}
					if(tmp!==null) {
						for(var t=0;t<tmp.structure.length;t++) {
							this.attachStructure.push(tmp.structure[t]);
						}
					}
				}else if(/^Data/.test(name)) {
					var tmp=null;
					try{
						eval('tmp='+this.decode(this.keyChecker($('#'+textareaid).val()))+';');
					}catch(err){
					}
					if(tmp!==null) {
						for(var nom in tmp) {
							this.attachData[nom]=tmp[nom];
						}
					}
				}
			}
		}
		$('.exerciseTemplate').html("<div class='construction'></div>");
		$($('.exerciseTemplate').get(0).parentNode).css({overflow:'visible'});
		this.container=$('.exerciseTemplate .construction').get(0);
		//this.load_reference_data();
		for(var i=0;i<accessibleTags.length;i++) {
			if (!questionaire.inArray(questionaire.data.dooit.tag_rules.tags,accessibleTags[i])) questionaire.data.dooit.tag_rules.tags.push(accessibleTags[i]);
		}
		if (questionaire.data.dooit.tag_rules.tags.length>1) {
			for(var i=questionaire.data.dooit.tag_rules.tags.length-1;i>=0;i--) {
				if (questionaire.data.dooit.tag_rules.tags[i]=="") questionaire.data.dooit.tag_rules.tags.splice(i,1);
			}
		}
		this.render();
	},
	inArray:function(arr,item) {
		for(var i=0;i<arr.length;i++) {
			if(arr[i]==item) return true;
		}
		return false;
	},
	saveLocal:function() {
		if (this.autosave) localStorage[this.autosaveKey]=this.json(this.data);
	},
	clearLocal:function() {
		if (this.autosave) localStorage[this.autosaveKey]='';
	},

/*	load other reference data	*/

	/*load_reference_data:function() {
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
	},*/



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
				var sumText=questionaire.summary_text(this.data.structure[d].paragraph);
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
						summary=questionaire.summary_text(this.data.structure[d].paragraph);
					}else if (this.data.structure[d].title!='') {
						summary=questionaire.summary_text(this.data.structure[d].title);
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
	hasWidget:function(val) {
		if (arguments.length>1) {
			return (val.option[arguments[1]]!==null && val.option[arguments[1]].widget!==undefined && val.option[arguments[1]].widget!==null && val.option[arguments[1]].widget.exerciseId>0);
		}
		for(var o=0;o<val.option.length;o++) {
			if (val.option[o]!==null && val.option[o].widget!==undefined && val.option[o].widget!==null && val.option[o].widget.exerciseId>0) return true;
		}
		return false;
	},
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
			if (this.groupable[this.data.structure[d].value.type] && this.groupable[this.data.structure[d-1].value.type]) ins+="<button type='button' class='grouped"+((this.data.structure[d].value.grouped=='1')?' on':'')+"' onclick='questionaire.change(\"grouped\",this);'>"+((this.data.structure[d].value.grouped=='1')?'grouped':'ungrouped')+"</button>";
		}
		var hideShuffle=true;
		if(this.data.structure[d].value.grouped!='1' && d+1<this.data.structure.length) {
			if(this.data.structure[d+1].value.grouped=='1') {
				hideShuffle=false;
			}
		}
		if (this.data.structure[d].value.randomize==undefined) this.data.structure[d].value.randomize=-1;
		if (isNaN(this.data.structure[d].value.randomize)) this.data.structure[d].value.randomize=-1;
		this.data.structure[d].value.randomize=parseInt(this.data.structure[d].value.randomize);
		ins+="<button type='button' style='display:"+(hideShuffle?'none':'block')+"' class='random"+((this.data.structure[d].value.randomize>=0)?' on':'')+"' onclick='questionaire.groupRandomDialog(this);'>"+((this.data.structure[d].value.randomize>=0)?((this.data.structure[d].value.randomize>0)?'shuffle ['+this.data.structure[d].value.randomize+']':'shuffle all'):'unshuffled')+"</button>";

		var head=false;
		if (this.data.structure.length>d+1) {
			if (this.data.structure[d+1].value.grouped=='1' && this.data.structure[d].value.grouped!='1') head=true;
		}
		var requirable=(this.data.structure[d].value.grouped!='1');
		//if(this.data.structure[d].value.grouped!='1') head=true;
		//if(this.multipliable[this.data.structure[d].value.type]) {
			var multiply=(this.multipliable[this.data.structure[d].value.type] && (this.data.structure[d].value.grouped!='1' || d==1));
			 ins+="<button type='button' style='display:"+(multiply?"block":"none")+"' class='multiple"+((this.data.structure[d].value.multiple=='1')?' on':'')+"' onclick='questionaire.change(\"multiple\",this);'>"+((this.data.structure[d].value.multiple=='1')?'multiple':'single')+"</button>";
		//}
		switch(this.data.structure[d].value.type) {
			case "paragraph":
				op+="<div class='field_info'><div class='paraDisplay'>"+ins+"<div style='clear:both'>";
				op+="<div id='paragraph"+d+"' class='paragraph' onclick='questionaire.edit_paragraph(this,"+d+")'>"+this.data.structure[d].paragraph+"</div>";
				var opts=['displayed in the report view also','only display with the questions','only display in the report view','display different text in the report view'];
				var displayAs=0;
				if (this.data.structure[d].displayAs!=undefined) displayAs=this.data.structure[d].displayAs;
				if (this.data.structure[d].reportparagraph==undefined) this.data.structure[d].reportparagraph='';
				op+="<div class='reportparagraphcontainer' style='display:"+((displayAs==3)?"block":"none")+"'>Report text:";
				op+="<div id='reportparagraph"+d+"' style='margin:2px 0px' class='paragraph' onclick='questionaire.edit_paragraph(this,"+d+",true)'>"+this.data.structure[d].reportparagraph+"</div>";
				op+="</div>";
				op+="<label><select onchange='questionaire.set_paragraph_type(this,"+d+")'>";
				for(var o=0;o<opts.length;o++) {
					op+="<option value='"+o+"'"+((o==displayAs)?" selected":"")+">"+opts[o]+"</option>";
				}
				op+="</select></label>";
				op+="</div>"+this.type_selector(this.data.structure[d].value.type)+this.type_help[this.data.structure[d].value.type]()+"</div></div>";
			break;
			case "slider":
				//var ins="<button type='button' class='required "+((this.data.structure[d].required=="1")?' on':'')+"' onclick='questionaire.change(\"required\",this);''>"+((this.data.structure[d].required=="1")?'required':'optional')+"</button>";
				op+="<div class='field_info'>"+ins;
				var showPara=(head || this.data.structure[d].value.grouped!="1");
				op+="<div class='paraDisplay' style='display:"+(showPara?'block':'none')+"'>"+this.paragraph_title+"<div style='clear:both'><div id='paragraph"+d+"' class='paragraph head' onclick='questionaire.edit_paragraph(this,"+d+")'>"+((typeof(this.data.structure[d].paragraph)!="undefined")?this.data.structure[d].paragraph:'')+"</div></div></div>";
				//if (head || this.data.structure[d].value.grouped!="1") op+=this.paragraph_title+"<div id='paragraph"+d+"' class='paragraph head' onclick='questionaire.edit_paragraph(this,"+d+")''>"+((typeof(this.data.structure[d].paragraph)!="undefined")?this.data.structure[d].paragraph:'')+"</div>";
				var hw=questionaire.hasWidget(this.data.structure[d].value);
				op+="Title: <input type='text' onkeydown='return questionaire.titleKeys(event)' value=\""+this.data.structure[d].title.replace(/"/g,'&rdquo;')+"\" onkeyup='questionaire.edit_title(this);' />"+this.type_selector(this.data.structure[d].value.type,hw)+this.type_help[this.data.structure[d].value.type]()+"</div>";
				
				var ins=this.type_editor[this.data.structure[d].value.type](this.data.structure[d].value.option,hw);
				op+="<div class='field_container'>"+ins+"</div>";
			break;
			default:
				ins+="<button type='button' style='display:"+(requirable?'block':'none')+"' class='required "+((this.data.structure[d].required=="1")?' on':'')+"' onclick='questionaire.change(\"required\",this);''>"+((this.data.structure[d].required=="1")?'required':'optional')+"</button>";
				op+="<div class='field_info'>"+ins;
				var showPara=(head || this.data.structure[d].value.grouped!="1");
				var hw=questionaire.hasWidget(this.data.structure[d].value);
				op+="<div class='paraDisplay' style='display:"+(showPara?'block':'none')+"'>"+this.paragraph_title+"<div style='clear:both'><div id='paragraph"+d+"' class='paragraph head' onclick='questionaire.edit_paragraph(this,"+d+")'>"+((typeof(this.data.structure[d].paragraph)!="undefined")?this.data.structure[d].paragraph:'')+"</div></div></div>";
				op+="Title: <input type='text' onkeydown='return questionaire.titleKeys(event)' value=\""+this.data.structure[d].title.replace(/"/g,'&rdquo;')+"\" onkeyup='questionaire.edit_title(this);' />"+this.type_selector(this.data.structure[d].value.type,hw)+this.type_help[this.data.structure[d].value.type]()+"</div>";
				var ins=this.type_editor[this.data.structure[d].value.type](this.data.structure[d].value.option,hw);
				op+="<div class='field_container'>"+ins+"</div>";
			break;
		}
		return op;
	},
	imageSelectorSource:null,
	imageValueSelected:function(img) {
		$(questionaire.imageSelectorSource).val(img.source);
		questionaire.change('image',questionaire.imageSelectorSource);
		$(questionaire.imageSelectorSource).next('img').remove();
		var i=document.createElement("img");
		$(i).bind("error",function() {
			$(this).prev("input").addClass("inputerror");
			$(this).remove();
		});
		$(i).bind("load",function() {
			$(this).prev("input").removeClass("inputerror");
		});
		i.src=img.source;
		questionaire.imageSelectorSource.parentNode.appendChild(i);
	},
	imageSelector:function(val) {
		var ins='<div class="imageSelectorRow"><span>The image</span>&nbsp;';
		ins+="<input type='text' value='"+val.image+"' class='imageSelector' onclick='questionaire.imageSelectorSource=this;yoodoo.selectImage(questionaire.imageValueSelected,\"dooits\");' />";
		ins+="<img src='"+val.image+"' onerror='$(this).remove();$(this).prev(\"input\").addClass(\"inputerror\");' />";
		ins+="</div>";
		return ins;
	},
	fileSelector:function(val) {
		var ins='<div class="fileSelectorRow"><span>The file</span>&nbsp;';
		ins+="<input type='text' value='"+val.file+"' class='fileSelector' onclick='questionaire.selectFile(this);' />";
		ins+="<a href='javascript:void(0)' onclick='questionaire.openFile(this)'>open</a>";
		ins+="</div>";
		return ins;
	},
	openFile:function(o) {
		var url=$(o).prev().val();
		if (url=='') {
			alert("No file is selected");
		}else{
			window.open(url,"_blank");
		}
	},
	selectFileSource:null,
	selectFile:function(src) {
		questionaire.selectFileSource=src;
		if (questionaire.library===null) {
			questionaire.fetchFiles();
		}else{
			questionaire.showFileDialog();
		}
	},
	fetchFiles:function() {
		$.ajax({
			url:'/library/ajax',
			dataType:'json'
		}).done(function(files) {
			questionaire.library=[];
			for(var f=0;f<files.length;f++) {
				var m=files[f].url.match(/\.([^\.]+)$/);
				if (m.length>1) {
					files[f].extension=m[1];
					questionaire.library.push(files[f]);
				}
			}
			questionaire.showFileDialog();
		});
	},
	showFileDialog:function() {
		var filters={
			mp3:true
		};
		var form=document.createElement("div");
		var buttons=[];
		for(var l=0;l<questionaire.library.length;l++) {
			if (filters[questionaire.library[l].extension] && questionaire.library[l].exists) {
				var b=document.createElement("button");
				b.type="button";
				$(b).html(questionaire.library[l].name+" ("+questionaire.library[l].extension+")  -  "+questionaire.library[l].created);
				b.item=questionaire.library[l];
				b.dialog=form;
				$(b).bind("click",function() {
					questionaire.selectFileSource.value=this.item.url;
					questionaire.change('file',questionaire.selectFileSource);
					$(this.form).dialog("destroy").remove();
				});
				buttons.push(b);
			}
		}
		if (buttons.length>0) {
			for(var b=0;b<buttons.length;b++) {
				form.appendChild(buttons[b]);
			}
		}else{
			$(form).html("No library files available. Go to the library to add the appropriate file.");
		}
		document.body.appendChild(form);
		$(form).dialog();
	},
	tagOption:function(val) {
		var ins="";
		if (this.data.dooit.tag_rules!=undefined) {
			if (this.data.dooit.tag_rules.tags.length>0) {
				ins+="<span class='tagOptions' style='position:relative'>";
				ins+="<button type='button' class='default' onclick='questionaire.tagOptionClicked(this)'>Add tag</button>";
				if (val.tags==undefined) val.tags=[];
				for(var t=0;t<val.tags.length;t++) {
					ins+=this.tagOptionButton(val.tags[t][0],val.tags[t][1],false);
				}
				ins+="</span>";
			}
		}
		return ins;
	},
	tagOptionClicked:function(o) {
		var value=$(this.parent_of_class(o,'fieldvalue')).prevAll('.fieldvalue').get().length;
		var field=$(this.parent_of_class(o,'field')).prevAll('.field').get().length;
		if (this.data.structure[field].value.option[value].tags==undefined) this.data.structure[field].value.option[value].tags=[];
		var poss=[];
		for(var t=0;t<this.data.dooit.tag_rules.tags.length;t++) {
			var sel=false;
			for(var tt=0;tt<this.data.structure[field].value.option[value].tags.length;tt++) {
				if (this.data.structure[field].value.option[value].tags[tt][0]==this.data.dooit.tag_rules.tags[t]) sel=true;
			}
			if (!sel) poss.push(this.data.dooit.tag_rules.tags[t]);
		}
		var ins='';
		for(var p=0;p<poss.length;p++) {
			ins+="<div>"+poss[p]+" <a href='javascript:void(0)' id='plus'>+</a> <a href='javascript:void(0)' id='minus'>-</a></div>";
		}
		var dropdown=document.createElement("div");
		$(dropdown).css({
			position:'absolute',
			'z-index':999,
			background:'#fff',
			padding:'5px',
			border:'1px solid #999',
			'font-size':'11px',
			'white-space':'nowrap',
			top:0
		}).html(ins);
		$(dropdown).find('#plus').css({
			color:'#0f0'
		}).bind("click",function() {
			var value=$(questionaire.parent_of_class(this,'fieldvalue')).prevAll('.fieldvalue').get().length;
			var field=$(questionaire.parent_of_class(this,'field')).prevAll('.field').get().length;
			var tagName=$(this.parentNode).html().replace(/\<a.*a\>/gi,'').replace(/^ +/,'').replace(/ *$/,'');
			questionaire.data.structure[field].value.option[value].tags.push([tagName,true]);
			this.parentNode.parentNode.parentNode.appendChild(questionaire.tagOptionButton(tagName,true,true));
			$(this.parentNode.parentNode).remove();
		});
		$(dropdown).find('#minus').css({
			color:'#f00'
		}).bind("click",function() {
			var value=$(questionaire.parent_of_class(this,'fieldvalue')).prevAll('.fieldvalue').get().length;
			var field=$(questionaire.parent_of_class(this,'field')).prevAll('.field').get().length;
			var tagName=$(this.parentNode).html().replace(/\<a.*a\>/gi,'').replace(/^ +/,'').replace(/ *$/,'');
			questionaire.data.structure[field].value.option[value].tags.push([tagName,false]);
			this.parentNode.parentNode.parentNode.appendChild(questionaire.tagOptionButton(tagName,false,true));
			$(this.parentNode.parentNode).remove();
		});
		o.parentNode.insertBefore(dropdown,o);
		$(dropdown).bind("mouseleave",function() {
			$(this).remove();
		});
	},
	tagOptionButton:function(name,additive,asElement) {
		var ins=name+" <a href='javascript:void(0)' onclick='questionaire.tagOptionRemove(this.parentNode)'>x</a>";
		if (asElement) {
			var o=document.createElement("span");
			$(o).addClass(additive?"adding":"removing");
			$(o).html(ins);
			o.tite=additive?"adds tag when selected":"removes tag when selected";
			return o;
		}else{
			return "<span class='"+(additive?"adding":"removing")+"' title='"+(additive?"adds tag when selected":"removes tag when selected")+"'>"+ins+"</span>";
		}
	},
	tagOptionRemove:function(o) {
		var value=$(this.parent_of_class(o,'fieldvalue')).prevAll('.fieldvalue').get().length;
		var field=$(this.parent_of_class(o,'field')).prevAll('.field').get().length;
		var tagName=$(o).html().replace(/\<a.*a\>/gi,'').replace(/^ +/,'').replace(/ *$/,'');
		for(var i=questionaire.data.structure[field].value.option[value].tags.length-1;i>=0;i--) {
			if (questionaire.data.structure[field].value.option[value].tags[i][0]==tagName) questionaire.data.structure[field].value.option[value].tags.splice(i,1);
		}
		$(o).remove();
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
		radio:function(val) {
			return "Radio button input";
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
		},
		images:function(val) {
			return "Image buttons";
		},
		library:function(val) {
			return "Library item";
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
		radio:function(val) {
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
		},
		images:function(val) {
			return "";
		},
		library:function(val) {
			return "<div class='field_help'>Insert a library item download or player.</div>";
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
		radio:{
			
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
				while(s<questionaire.attachStructure.length) {
					if (questionaire.attachStructure[s].value.multiple=="1" && questionaire.attachStructure[s].value.grouped=="0" && questionaire.referencable[questionaire.attachStructure[s].value.type]) {
						refs.push([s]);
					}
					/*if (questionaire.attachStructure[s].value.multiple=="1" && questionaire.referencable[questionaire.attachStructure[s].value.type]) {
						if (grouped && row.length>0) {
							refs.push(row);
						}
						row=[s];
						grouped=true;
					}else if(grouped && questionaire.referencable[questionaire.attachStructure[s].value.type] && row.length>0){
						row.push(s);
					}else{
						if (questionaire.attachStructure[s].value.multiple!="1"  && grouped && row.length>0) {
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
					ins.push({index:refs[r][0],title:questionaire.attachStructure[refs[r][0]].title});
					var nom=questionaire.attachStructure[refs[r][0]].title.replace(/<[^>]+>/g,'');
					op+="<option value='"+refs[r][0]+"'"+((key==questionaire.attachStructure[refs[r][0]].id)?" selected='true' ":"")+">"+nom+"</option>";
				}
				return "<select onchange='questionaire.change(\"link\",this)' >"+op+"</select>";
			},
			possibleQuestions:function(key) {
				var refs=this.attached();
				var ref=null;
				for(var r=0;r<refs.length;r++) {
					if (questionaire.attachStructure[refs[r][0]].id==key) ref=r;
				}
//console.log(ref);
				if(ref===null) {
					return [];
				}else{
					var reply=[];
					for(var r=0;r<refs[ref].length;r++) {
//console.log(questionaire.attachStructure[refs[ref][r]].value.option);
						for(var q=0;q<questionaire.attachStructure[refs[ref][r]].value.option.length;q++) {
							reply.push({key:questionaire.attachStructure[refs[ref][r]].id,index:q,title:questionaire.attachStructure[refs[ref][r]].value.option[q].title});
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
						questionaire.data.structure[qi].value.option[0].questionIndex=0;
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
					return "<select onchange='questionaire.change(\"questionIndex\",this)' >"+op+"</select>";
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
				var op="<select class='date' onchange='questionaire.change(\"format\",this)'>";
				//if (typeof(0)=="undefined" || o=='') op+="<option value=''>Unselected</option>";
				//if (idx<0) op+="<option value='' selected='true'>Unselected</option>";
				if (idx<0) idx=0;
				for(var i=0;i<opts.length;i++) {
					op+="<option value='"+opts[i]+"' "+((idx==i)?"selected='true'":"")+">"+inputs.formatDate(opts[i],new Date())+"</option>";
				}
				op+="</select>";
				return op;
			}
		},
		images:{

		},
		library:{

		}
	},
	type_editor:{
		paragraph:function(val) {
			var op="";
			//op+="<a href='javascript:void(0)' onclick='questionaire.add_option(this,\"text\");'>add</a>";
			op+="<div class='fieldvalues'>";
			/*if (val.length==0) op+="No input defined";
			for(var v=0;v<val.length;v++) {
				op+=questionaire.type_option.text(val[v]);
			}*/
			op+="</div>";
			return op;
		},
		text:function(val) {
			var op="<a href='javascript:void(0)' onclick='questionaire.add_option(this,\"text\");'>add</a>";
			op+="<div class='fieldvalues'>";
			if (val.length==0) op+="No input defined";
			for(var v=0;v<val.length;v++) {
				op+=questionaire.type_option.text(val[v]);
			}
			op+="</div>";
			return op;
		},
		textarea:function(val) {
			var op="<a href='javascript:void(0)' onclick='questionaire.add_option(this,\"textarea\");'>add</a>";
			op+="<div class='fieldvalues'>";
			if (val.length==0) op+="No input defined";
			for(var v=0;v<val.length;v++) {
				op+=questionaire.type_option.textarea(val[v]);
			}
			op+="</div>";
			return op;
		},
		numeric:function(val) {
			var op="<a href='javascript:void(0)' onclick='questionaire.add_option(this,\"numeric\");'>add</a>";
			op+="<div class='fieldvalues'>";
			if (val.length==0) op+="No input defined";
			for(var v=0;v<val.length;v++) {
				op+=questionaire.type_option.numeric(val[v]);
			}
			op+="</div>";
			return op;
		},
		checkbox:function(val) {
			var op="<a href='javascript:void(0)' onclick='questionaire.add_option(this,\"checkbox\");'>add</a>";
			op+="<div class='fieldvalues'>";
			if (val.length==0) op+="No input defined";
			for(var v=0;v<val.length;v++) {
				op+=questionaire.type_option.checkbox(val[v]);
			}
			op+="</div>";
			return op;
		},
		radio:function(val) {
			var op="<a href='javascript:void(0)' onclick='questionaire.add_option(this,\"radio\");'>add</a>";
			op+="<div class='fieldvalues'>";
			if (val.length==0) op+="No input defined";
			for(var v=0;v<val.length;v++) {
				op+=questionaire.type_option.radio(val[v]);
			}
			op+="</div>";
			return op;
		},
		select:function(val) {
			var op="<a href='javascript:void(0)' onclick='questionaire.add_option(this,\"select\");'>add</a>";
			op+="<div class='fieldvalues'>";
			if (val.length==0) op+="No input defined";
			for(var v=0;v<val.length;v++) {
				op+=questionaire.type_option.select(val[v]);

			}
			op+="</div>";
			return op;
		},
		buttons:function(val) {
			var op="<a href='javascript:void(0)' onclick='questionaire.add_option(this,\"buttons\");'>add</a>";
			op+="<div class='fieldvalues'>";
			if (val.length==0) op+="No input defined";
			for(var v=0;v<val.length;v++) {
				op+=questionaire.type_option.buttons(val[v]);

			}
			op+="</div>";
			return op;
		},
		reference:function(val) {
			var op="";
			op+="<div class='fieldvalues'>";
			op+=questionaire.type_option.reference(val[0]);
			op+="</div>";
			return op;
		},
		slider:function(val) {
			var op='';
			op+="<div class='fieldvalues'>";
			op+=questionaire.type_option.slider(val[0]);
			op+="</div>";
			return op;
		},
		date:function(val) {
			var op="<a href='javascript:void(0)' onclick='questionaire.add_option(this,\"date\");'>add</a>";
			op+="<div class='fieldvalues'>";
			if (val.length==0) op+="No input defined";
			for(var v=0;v<val.length;v++) {
				op+=questionaire.type_option.date(val[v]);

			}
			op+="</div>";
			return op;
		},
		images:function(val) {
			var op="<a href='javascript:void(0)' onclick='questionaire.add_option(this,\"images\");'>add</a>";
			op+="<div class='fieldvalues'>";
			if (val.length==0) op+="No input defined";
			for(var v=0;v<val.length;v++) {
				op+=questionaire.type_option.images(val[v]);

			}
			op+="</div>";
			return op;
		},
		library:function(val) {
			var op="<a href='javascript:void(0)' onclick='questionaire.add_option(this,\"library\");'>add</a>";
			op+="<div class='fieldvalues'>";
			if (val.length==0) op+="No input defined";
			for(var v=0;v<val.length;v++) {
				op+=questionaire.type_option.library(val[v]);

			}
			op+="</div>";
			return op;
		}
	},
	leavePage:function(url) {
		if (this.mustSave) {
			alert("You must save this Doo-it before leaving it");
		}else{
			window.location=url;
		}
	},
	widgetInput:function(val) {
		var ins='';
		if (val.widget!==undefined && val.widget!==null && val.widget.url!=undefined) {
			ins+="<a href='javascript:void(0)' style='float:right;white-space:nowrap' onclick='questionaire.removeWidget(this.parentNode)' class='deleteLink'>Delete widget";
			if (val.usersTotalsKey!==undefined && val.usersTotalsKey!='') ins+=" &amp; the key";
			ins+="</a>";
			ins+='<a href="javascript:void(0)" onclick="questionaire.leavePage(\''+val.widget.url+'\')">Go to Widget</a>';
			ins+='<span style="font-size:10px">There are options available within the Widget edit page</span>';
			ins+='<br />'+questionaire.usersTotalsInput(val);
		}else{
			ins+="<a href='javascript:void(0)' onclick='questionaire.createWidget(this.parentNode);'>Create a widget</a>";
		}
		return ins;
	},
	usersTotalsInput:function(val) {
		var ins='';
		if (val.usersTotalsKey!==undefined && val.usersTotalsKey!='') {
			ins+="<a href='javascript:void(0)' onclick='questionaire.removeUsersTotals(this.parentNode)' style='float:right;white-space:nowrap' class='deleteLink'>Delete the key</a>";
			ins+='<span style="font-size:10px">Saving this data to <b>'+val.usersTotalsKey+'</b> across the whole site and provides the average to the widget</sml>';
		}else{
			ins+="<a href='javascript:void(0)' onclick='questionaire.createUsersTotals(this.parentNode);'>Create a key to save this data to, which is made available to the widget, to allow an average to be displayed</a>";
		}
		return ins;
	},
	type_option:{
		paragraph:function(val) {
			return '';
		},
		text:function(val) {
			if (val.matches==undefined) val.matches=[];
			if (val.meta==undefined) val.meta=[];
			var ins="<div class='move movevalue'></div><input type='text' value=\""+val.title.replace(/"/g,'&rdquo;')+"\" onkeyup='questionaire.change(\"title\",this)' />";
			ins+="<span style='position:relative'><a href='javascript:void(0)' onclick='questionaire.textMatchDialog(this)'>"+val.matches.length+" Match"+((val.matches.length==1)?"":"es")+"</a></span>";
			ins+="<span style='position:relative'><a href='javascript:void(0)' onclick='questionaire.textMetaDialog(this)'>"+val.meta.length+" Meta"+((val.meta.length==1)?"":"s")+"</a></span>";
			ins+="<button class='removeButton' type='button' onclick='questionaire.remove_option(this);'></button>";
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
			if (val.meta==undefined) val.meta=[];
			if (val.rows==undefined) val.rows=3;
			if (val.fullwidth==undefined) val.fullwidth=false;
			var ins="<div class='move movevalue'></div><input type='text' value=\""+val.title.replace(/"/g,'&rdquo;')+"\" onkeyup='questionaire.change(\"title\",this)' />";
			ins+="<span style='position:relative'><a href='javascript:void(0)' onclick='questionaire.textMetaDialog(this)'>"+val.meta.length+" Meta"+((val.meta.length==1)?"":"s")+"</a></span>";
			ins+="<label><input type='checkbox' "+(val.fullwidth?"checked":"")+" onchange='questionaire.change(\"fullwidth\",this)'/> full width</label>";
			var sel='';
			for(var r=1;r<20;r++) {
				sel+="<option value='"+r+"' "+((val.rows==r)?"selected":"")+">"+r+"</option>";
			}
			ins+="<label><select onchange='questionaire.change(\"rows\",this)'>"+sel+"</select> rows</label>";
			ins+="<button class='removeButton' type='button' onclick='questionaire.remove_option(this);'></button>";
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
			if (val.meta==undefined) val.meta=[];
			var ins="<div class='move movevalue'></div><input type='text' value=\""+val.title.replace(/"/g,'&rdquo;')+"\" onkeyup='questionaire.change(\"title\",this)' />";
			ins+="<span style='position:relative'><a href='javascript:void(0)' onclick='questionaire.textMetaDialog(this)'>"+val.meta.length+" Meta"+((val.meta.length==1)?"":"s")+"</a></span><br />";
			var historical=false;
			if (val.historical===true) historical=true;
			ins+="Record historical values <input type='checkbox' "+(historical?'checked':'')+" onchange='questionaire.change(\"historical\",this);' />";
			ins+="<button class='removeButton' type='button' onclick='questionaire.remove_option(this);'></button>";
			if (questionaire.data.dooit.tag_rules!==undefined && questionaire.data.dooit.tag_rules.tags!==undefined && questionaire.data.dooit.tag_rules.tags.length>0) {
				ins+='<div class="tag_rules">';
				ins+="<a href='javascript:void(0)' onclick='questionaire.addQuestionRule(this)'>Add a tag rule</a>";
				if (val.tag_rules===undefined) val.tag_rules=[];
				for(var r=0;r<val.tag_rules.length;r++) {
					ins+=questionaire.tagRuleInsert.slider(val.tag_rules[r],false);
				}
				ins+="</div>";
			}
			ins+="<div class='field_widget'>"+questionaire.widgetInput(val)+"</div>";
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
			var ins="<div class='move movevalue'></div><input type='text' value=\""+val.title.replace(/"/g,'&rdquo;')+"\" onkeyup='questionaire.change(\"title\",this)' />";
			if (questionaire.score_system.display) {
				ins+=questionaire.score_system.checkbox.selector(val.score,"");
				ins+=questionaire.score_system.multiplier(val.multiplier);
			}
			ins+="<button class='default"+((val.isdefault=='1')?' on':'')+"' type='button' onclick='questionaire.change(\"default\",this)'>default</button>";
			ins+=questionaire.tagOption(val);
			ins+="<button class='removeButton' type='button' onclick='questionaire.remove_option(this);'></button>";
			if (arguments.length>1 && arguments[1]) {
				var op=document.createElement("DIV");
				$(op).addClass("fieldvalue");
				$(op).html(ins);
				return op;
			}else{
				return "<div class='fieldvalue'>"+ins+"</div>";
			}
		},
		radio:function(val) {
			var ins="<div class='move movevalue'></div><input type='text' value=\""+val.title.replace(/"/g,'&rdquo;')+"\" onkeyup='questionaire.change(\"title\",this)' />";
			if (questionaire.score_system.display) {
				ins+=questionaire.score_system.radio.selector(val.score,"");
				ins+=questionaire.score_system.multiplier(val.multiplier);
			}
			ins+="<button class='default"+((val.isdefault=='1')?' on':'')+"' type='button' onclick='questionaire.change(\"default\",this)'>default</button>";
			ins+=questionaire.tagOption(val);
			ins+="<button class='removeButton' type='button' onclick='questionaire.remove_option(this);'></button>";
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
			var ins="<div class='move movevalue'></div><input type='text' value=\""+val.title.replace(/"/g,'&rdquo;')+"\"onkeyup='questionaire.change(\"title\",this)' />";
			if (questionaire.score_system.display) {
				ins+=questionaire.score_system.select.selector(val.score,"");
				ins+=questionaire.score_system.multiplier(val.multiplier);
			}
			ins+="<button class='default"+((val.isdefault=='1')?' on':'')+"' type='button' onclick='questionaire.change(\"default\",this)'>default</button>";
			ins+=questionaire.tagOption(val);
			ins+="<button class='removeButton' type='button' onclick='questionaire.remove_option(this);'></button>";
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
			if (val===null) return '';
			var ins="<div class='move movevalue'></div><input type='text' value=\""+val.title.replace(/"/g,'&rdquo;')+"\" onkeyup='questionaire.change(\"title\",this)' />";
			if (questionaire.score_system.display) {
				ins+=questionaire.score_system.buttons.selector(val.score,"");
				ins+=questionaire.score_system.multiplier(val.multiplier);
			}
			ins+="<button class='default"+((val.isdefault=='1')?' on':'')+"' type='button' onclick='questionaire.change(\"default\",this)'>default</button>";
			ins+=questionaire.tagOption(val);
			ins+="<button class='removeButton' type='button' onclick='questionaire.remove_option(this);'></button>";
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
			ins+="<label>Source question: "+questionaire.type_functions.reference.available(val.link)+"</label>";
			ins+="<label>Select by: "+questionaire.type_functions.reference.question(val.link,val.questionIndex)+"</label>";
			ins+="<button class='addable"+((val.addable=='1')?' on':'')+"' type='button' onclick='questionaire.change(\"addable\",this)'>addable</button>";
			ins+="<button class='onlyTitle"+((val.onlyTitle=='1')?' on':'')+"' type='button' onclick='questionaire.change(\"onlyTitle\",this)'>title only</button>";
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
			var ins="Min: <input type='text' value='"+val.minText+"' onkeyup='questionaire.change(\"minText\",this);' /><br />";
			ins+="Max: <input type='text' value='"+val.maxText+"' onkeyup='questionaire.change(\"maxText\",this)' /><br />";
			ins+="Divisions: <select onchange='questionaire.change(\"divisions\",this);'>";
			for(var i=2;i<120;i++) {
				if(240 % i == 0) ins+="<option value'"+i+"'"+((val.divisions==i)?' selected="true"':'')+">"+i+"</option>";
			}
			ins+="</select><br />";
			ins+="Start value: <select onchange='questionaire.change(\"start\",this);'>";
			for(var i=2;i<120;i++) {
				if(240 % i == 0) ins+="<option value'"+i+"'"+((val.start==i)?' selected="true"':'')+">"+i+"</option>";

			}
			ins+="</select><br />";
			var historical=false;
			if (val.historical===true) historical=true;
			ins+="Record historical values <input type='checkbox' "+(historical?'checked':'')+" onchange='questionaire.change(\"historical\",this);' />";
			if (questionaire.data.dooit.tag_rules!==undefined && questionaire.data.dooit.tag_rules.tags!==undefined && questionaire.data.dooit.tag_rules.tags.length>0) {
				ins+='<div class="tag_rules">';
				ins+="<a href='javascript:void(0)' onclick='questionaire.addQuestionRule(this)'>Add a tag rule</a>";
				if (val.tag_rules===undefined) val.tag_rules=[];
				for(var r=0;r<val.tag_rules.length;r++) {
					ins+=questionaire.tagRuleInsert.slider(val.tag_rules[r],false);
				}
				ins+="</div>";
			}
			if (questionaire.score_system.display) ins+="<br />Score: "+questionaire.score_system.slider.selector(val.score,"'");
			ins+="<div class='field_widget' >"+questionaire.widgetInput(val)+"</div>";
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
			var ins="<div class='move movevalue'></div><input type='text' value=\""+val.title.replace(/"/g,'&rdquo;')+"\" onkeyup='questionaire.change(\"title\",this)' />";
			//if (questionaire.score_system.display) ins+=questionaire.score_system.select.selector(val.score,"");
			//ins+="<button class='default"+((val.isdefault=='1')?' on':'')+"' type='button' onclick='questionaire.change(\"default\",this)'>default</button>";
			ins+=questionaire.type_functions.date.formats(val.format);
			ins+="<button class='removeButton' type='button' onclick='questionaire.remove_option(this);'></button>";
			if (arguments.length>1 && arguments[1]) {
				var op=document.createElement("DIV");
				$(op).addClass("fieldvalue");
				$(op).html(ins);
				return op;
			}else{
				return "<div class='fieldvalue'>"+ins+"</div>";
			}
		},
		images:function(val) {
			var ins="<div class='move movevalue'></div><input type='text' value=\""+val.title.replace(/"/g,'&rdquo;')+"\" onkeyup='questionaire.change(\"title\",this)' />";
			if (questionaire.score_system.display) {
				ins+=questionaire.score_system.buttons.selector(val.score,"");
				ins+=questionaire.score_system.multiplier(val.multiplier);
			}
			if (val.image===undefined) val.image="";
			ins+="<button class='default"+((val.isdefault=='1')?' on':'')+"' type='button' onclick='questionaire.change(\"default\",this)'>default</button>";
			ins+=questionaire.tagOption(val);
			ins+="<button class='removeButton' type='button' onclick='questionaire.remove_option(this);'></button>";
			ins+=questionaire.imageSelector(val);
			if (arguments.length>1 && arguments[1]) {
				var op=document.createElement("DIV");
				$(op).addClass("fieldvalue");
				$(op).html(ins);
				return op;
			}else{
				return "<div class='fieldvalue'>"+ins+"</div>";
			}
		},
		library:function(val) {
			var ins="<div class='move movevalue'></div><input type='text' value=\""+val.title.replace(/"/g,'&rdquo;')+"\" onkeyup='questionaire.change(\"title\",this)' />";
			if (val.file===undefined) val.file="";
			ins+="<button class='removeButton' type='button' onclick='questionaire.remove_option(this);'></button>";
			ins+=questionaire.fileSelector(val);
			if (arguments.length>1 && arguments[1]) {
				var op=document.createElement("DIV");
				$(op).addClass("fieldvalue");
				$(op).html(ins);
				return op;
			}else{
				return "<div class='fieldvalue'>"+ins+"</div>";
			}
		}
	},
	blankTagRule:{
		slider:function() {
			return {tag:'',expression:'==',value:0,unique:false,unset:false};
		},
		numeric:function() {
			return {tag:'',expression:'==',value:0,unique:false,unset:false};
		}
	},
	tagRuleInsert:{
		slider:function(val,asElement) {
			var ins='';
			ins+="<label title='The tag to add or remove for this rule'>Set Tag "+questionaire.tagListSelect(val.tag)+"</label>";
			ins+=" <label title='How the score will compare with the value you define here'>compare "+questionaire.expressionSelect(val.expression)+"</label>";
			ins+=" <label title='The value of the slider up to the number of divisions - 1 (0 is the first division)'>value "+"<input type='text' value='"+val.value+"' onkeydown='return questionaire.integerEventOnly(event)' onkeyup='questionaire.setTagRuleValue(this)' style='width:80px'/></label>";
			ins+="<br /><label title='Removes the other tags for this question if the rule is true'>Unique <input type='checkbox' "+(val.unique?'checked':'')+" onchange='questionaire.setTagRuleUnique(this)'/></label>";
			ins+=" <label title='Removes this tag if the rule is NOT true'>Unset <input type='checkbox' "+(val.unset?'checked':'')+" onchange='questionaire.setTagRuleUnset(this)'/></label>";
			ins+=" <a href='javascript:void(0)' onclick='questionaire.removeTagRule(this)' class='deleteLink'>delete</a>";
			if (asElement) {
				var d=document.createElement("div");
				$(d).html(ins).addClass("tag_rule");
				return d;
			}else{
				return '<div class="tag_rule">'+ins+"</div>";
			}
			return ins;
		},
		numeric:function(val,asElement) {
			var ins='';
			ins+="<label title='The tag to add or remove for this rule'>Set Tag "+questionaire.tagListSelect(val.tag)+"</label>";
			ins+=" <label title='How the score will compare with the value you define here'>compare "+questionaire.expressionSelect(val.expression)+"</label>";
			ins+=" <label title='The value as a whole number'>value "+"<input type='text' value='"+val.value+"' onkeydown='return questionaire.integerEventOnly(event)' onkeyup='questionaire.setTagRuleValue(this)' style='width:80px'/></label>";
			ins+="<br /><label title='Removes the other tags for this question if the rule is true'>Unique <input type='checkbox' "+(val.unique?'checked':'')+" onchange='questionaire.setTagRuleUnique(this)'/></label>";
			ins+=" <label title='Removes this tag if the rule is NOT true'>Unset <input type='checkbox' "+(val.unset?'checked':'')+" onchange='questionaire.setTagRuleUnset(this)'/></label>";
			ins+=" <a href='javascript:void(0)' onclick='questionaire.removeTagRule(this)' class='deleteLink'>delete</a>";
			if (asElement) {
				var d=document.createElement("div");
				$(d).html(ins).addClass("tag_rule");
				return d;
			}else{
				return '<div class="tag_rule">'+ins+"</div>";
			}
			return ins;
		}
	},
	integerEventOnly:function(e) {
		var kc=questionaire.keyCode(e);
		if (!kc.numeric && !kc.navigate){
			e.preventDefault();
			return false;
		}
	},
	addQuestionRule:function(o) {
		var fv=$(questionaire.parent_of_class(o,'fieldvalues')).prevAll('.fieldvalue').get().length;
		var f=$(questionaire.parent_of_class(o,'field')).prevAll('.field').get().length;
		questionaire.data.structure[f].value.option[fv].tag_rules.push(questionaire.blankTagRule[questionaire.data.structure[f].value.type]());
		var e=questionaire.tagRuleInsert[questionaire.data.structure[f].value.type](questionaire.data.structure[f].value.option[fv].tag_rules[questionaire.data.structure[f].value.option[fv].tag_rules.length-1],true);
		$(e).css({display:"none"});
		$(o).parent().append(e);
		$(e).slideDown();
	},
	setTagRuleTag:function(o) {
		var fv=$(questionaire.parent_of_class(o,'fieldvalues')).prevAll('.fieldvalue').get().length;
		var f=$(questionaire.parent_of_class(o,'field')).prevAll('.field').get().length;
		var r=$(questionaire.parent_of_class(o,'tag_rule')).prevAll('.tag_rule').get().length;
		questionaire.data.structure[f].value.option[fv].tag_rules[r].tag=o.value;
	},
	setTagRuleExpression:function(o) {
		var fv=$(questionaire.parent_of_class(o,'fieldvalues')).prevAll('.fieldvalue').get().length;
		var f=$(questionaire.parent_of_class(o,'field')).prevAll('.field').get().length;
		var r=$(questionaire.parent_of_class(o,'tag_rule')).prevAll('.tag_rule').get().length;
		questionaire.data.structure[f].value.option[fv].tag_rules[r].expression=o.value;
	},
	setTagRuleValue:function(o) {
		var fv=$(questionaire.parent_of_class(o,'fieldvalues')).prevAll('.fieldvalue').get().length;
		var f=$(questionaire.parent_of_class(o,'field')).prevAll('.field').get().length;
		var r=$(questionaire.parent_of_class(o,'tag_rule')).prevAll('.tag_rule').get().length;
		questionaire.data.structure[f].value.option[fv].tag_rules[r].value=o.value;
	},
	setTagRuleUnique:function(o) {
		var fv=$(questionaire.parent_of_class(o,'fieldvalues')).prevAll('.fieldvalue').get().length;
		var f=$(questionaire.parent_of_class(o,'field')).prevAll('.field').get().length;
		var r=$(questionaire.parent_of_class(o,'tag_rule')).prevAll('.tag_rule').get().length;
		questionaire.data.structure[f].value.option[fv].tag_rules[r].unique=o.checked;
	},
	setTagRuleUnset:function(o) {
		var fv=$(questionaire.parent_of_class(o,'fieldvalues')).prevAll('.fieldvalue').get().length;
		var f=$(questionaire.parent_of_class(o,'field')).prevAll('.field').get().length;
		var r=$(questionaire.parent_of_class(o,'tag_rule')).prevAll('.tag_rule').get().length;
		questionaire.data.structure[f].value.option[fv].tag_rules[r].unset=o.checked;
	},
	removeTagRule:function(o) {
		var fv=$(questionaire.parent_of_class(o,'fieldvalues')).prevAll('.fieldvalue').get().length;
		var f=$(questionaire.parent_of_class(o,'field')).prevAll('.field').get().length;
		var r=$(questionaire.parent_of_class(o,'tag_rule')).prevAll('.tag_rule').get().length;
		questionaire.data.structure[f].value.option[fv].tag_rules.splice(r,1);
		$(questionaire.parent_of_class(o,'tag_rule')).slideUp(500,function() {$(this).remove();});
	},
	tagListSelect:function(tag) {
		var ins="<select onchange='questionaire.setTagRuleTag(this)'>";
		var selected=false;
		
		for(var t=0;t<questionaire.data.dooit.tag_rules.tags.length;t++) {
			if (questionaire.data.dooit.tag_rules.tags[t]==tag) selected=true;
		}

		if (!selected) ins+="<option></option>";
		for(var t=0;t<questionaire.data.dooit.tag_rules.tags.length;t++) {
			ins+="<option"+((questionaire.data.dooit.tag_rules.tags[t]==tag)?' selected=true':'')+">"+questionaire.data.dooit.tag_rules.tags[t]+"</option>";
		}
		ins+="</select>";
		return ins;
	},
	expressionSelect:function(expression) {
		var expr={'<':'less than','<=':'less than or equal to','==':'equal to','>=':'greater than or equal to','>':'greater than'};
		var ins="<select onchange='questionaire.setTagRuleExpression(this)'>";
		for(var ex in expr) {
			ins+="<option value='"+ex+"' "+((expression==ex)?' selected=true':'')+">"+expr[ex]+"</option>";
		}
		ins+="</select>";
		return ins;
	},
	change_type_check:{
		paragraph:function(idx) {
			for(var i=0;i<questionaire.data.structure[idx].value.option.length;i++) {
				if (typeof(questionaire.data.structure[idx].value.option[i].title)=="undefined") questionaire.data.structure[idx].value.option[i].title='';
			}
		},
		text:function(idx) {
			for(var i=0;i<questionaire.data.structure[idx].value.option.length;i++) {
				if (typeof(questionaire.data.structure[idx].value.option[i].title)=="undefined") questionaire.data.structure[idx].value.option[i].title='';
			}
		},
		textarea:function(idx) {
			for(var i=0;i<questionaire.data.structure[idx].value.option.length;i++) {
				if (typeof(questionaire.data.structure[idx].value.option[i].title)=="undefined") questionaire.data.structure[idx].value.option[i].title='';
			}
		},
		numeric:function(idx) {
			for(var i=0;i<questionaire.data.structure[idx].value.option.length;i++) {
				if (typeof(questionaire.data.structure[idx].value.option[i].title)=="undefined") questionaire.data.structure[idx].value.option[i].title='';
			}
		},
		checkbox:function(idx) {
			for(var i=0;i<questionaire.data.structure[idx].value.option.length;i++) {
				if (typeof(questionaire.data.structure[idx].value.option[i].title)=="undefined") questionaire.data.structure[idx].value.option[i].title='';
			}
		},
		radio:function(idx) {
			for(var i=0;i<questionaire.data.structure[idx].value.option.length;i++) {
				if (typeof(questionaire.data.structure[idx].value.option[i].title)=="undefined") questionaire.data.structure[idx].value.option[i].title='';
			}
		},
		select:function(idx) {
			for(var i=0;i<questionaire.data.structure[idx].value.option.length;i++) {
				if (typeof(questionaire.data.structure[idx].value.option[i].title)=="undefined") questionaire.data.structure[idx].value.option[i].title='';
			}
		},
		buttons:function(idx) {
			for(var i=0;i<questionaire.data.structure[idx].value.option.length;i++) {
				if (typeof(questionaire.data.structure[idx].value.option[i].title)=="undefined") questionaire.data.structure[idx].value.option[i].title='';
			}
		},
		reference:function(idx) {
			if(questionaire.data.structure[idx].value.option.length==0) {
				questionaire.data.structure[idx].value.option=[{link:'',questionIndex:0,addable:0,onlyTitle:0}];
			}else{
				questionaire.data.structure[idx].value.option[0].link='';
				questionaire.data.structure[idx].value.option[0].questionIndex=0;
				questionaire.data.structure[idx].value.option[0].addable=0;
				questionaire.data.structure[idx].value.option[0].onlyTitle=0;
			}
		},
		slider:function(idx) {
			if(questionaire.data.structure[idx].value.option.length==0) {
				questionaire.data.structure[idx].value.option=[{minText:'',maxText:'',divisions:'10',start:'5'}];
			}else{
				questionaire.data.structure[idx].value.option[0].minText='';
				questionaire.data.structure[idx].value.option[0].maxText='';
				questionaire.data.structure[idx].value.option[0].divisions='10';
				questionaire.data.structure[idx].value.option[0].start='5';
			}
		},
		date:function(idx) {
			for(var i=0;i<questionaire.data.structure[idx].value.option.length;i++) {
				if (typeof(questionaire.data.structure[idx].value.option[i].title)=="undefined") questionaire.data.structure[idx].value.option[i].title='';
				if (typeof(questionaire.data.structure[idx].value.option[i].format)=="undefined" || questionaire.data.structure[idx].value.option[i].format=='') {
					var df=questionaire.type_functions.date.format_values();
					questionaire.data.structure[idx].value.option[i].format=df[0];
				}
			}
		},
		images:function(idx) {
			for(var i=0;i<questionaire.data.structure[idx].value.option.length;i++) {
				if (typeof(questionaire.data.structure[idx].value.option[i].title)=="undefined") questionaire.data.structure[idx].value.option[i].title='';
			}
		},
		library:function(idx) {
			for(var i=0;i<questionaire.data.structure[idx].value.option.length;i++) {
				if (typeof(questionaire.data.structure[idx].value.option[i].title)=="undefined") questionaire.data.structure[idx].value.option[i].title='';
			}
		}
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
		radio:function() {
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
			var df=questionaire.type_functions.date.format_values();
			return {title:'',format:df[0]};
		},
		images:function() {
			return {title:'',isdefault:'0',score:null,image:''};
		},
		library:function() {
			return {title:'',file:''};
		}
	},
	groupable:{
		paragraph:false,
		text:true,
		textarea:true,
		numeric:true,
		checkbox:true,
		radio:true,
		select:true,
		buttons:true,
		reference:true,
		slider:true,
		date:true,
		images:true,
		library:true
	},
	multipliable:{
		paragraph:false,
		text:true,
		textarea:true,
		numeric:true,
		checkbox:true,
		radio:true,
		select:true,
		buttons:false,
		reference:true,
		slider:true,
		date:true,
		images:false,
		library:false
	},
	referencable:{
		paragraph:false,
		text:true,
		textarea:true,
		numeric:false,
		checkbox:false,
		radio:false,
		select:false,
		buttons:false,
		reference:false,
		slider:false,
		date:false,
		images:false,
		library:false
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
		radio:function() {
			return [];
		},
		select:function() {
			return [];
		},
		buttons:function() {
			return [];
		},
		reference:function() {
			return [questionaire.default_field_values.reference()];
		},
		slider:function() {
			return [questionaire.default_field_values.slider()];
		},
		date:function() {
			return [];
		},
		images:function() {
			return [];
		},
		library:function() {
			return [];
		}
	},
	titleKeys:function(e) {
		var kc;
		if (window.event) kc=window.event.keyCode;
		else if (e) kc=e.which;
		var shft=e.shiftKey;
		if (shft && (kc==188 || kc==190)) return false;
		return true;
	},
	keyCode: function (e) {
		var keycode;
		if (window.event) keycode = window.event.keyCode;
		else if (e) keycode = e.which;
			var key = {
			code: keycode,
			alpha: (keycode > 64 && keycode < 91),
			space: (keycode == 32),
			numeric: ((keycode > 47 && keycode < 58) || (keycode > 95 && keycode < 106)),
			decimal: ((keycode > 47 && keycode < 58) || (keycode > 95 && keycode < 106) || (keycode == 189) || (keycode == 190) || (keycode == 110)),
			enter: (keycode == 13),
			escape: (keycode == 27),

			input: ((keycode == 190) || (keycode == 188) || (keycode == 192) || (keycode == 111) || (keycode == 192) || (keycode == 191) || (keycode == 107) || (keycode == 187) || (keycode == 189) || (keycode == 106) || (keycode == 110) || (keycode == 220) || (keycode == 223) || (keycode == 222) || (keycode == 221) || (keycode == 219) || (keycode == 186)),
			tab: (keycode == 9),
			shift: (keycode == 16),
			backspace: (keycode == 8),
			del: (keycode == 46),
			fkey: ((keycode > 111 && keycode < 124) ? keycode - 111 : false),
			home: (keycode == 36),
			end: (keycode == 35),
			up: (keycode == 38),
			down: (keycode == 40),
			left: (keycode == 37),
			right: (keycode == 39),
			navigate: false
		};
		key.navigate = (key.left || key.right || key.del || key.backspace || key.shift || key.home || key.end || key.tab);
		return key;
	},
	groupRandomEdit:{button:null,index:0,maxCount:1,dropdown:null},
	dropRandomDialog:function() {
		$(this.groupRandomEdit.dropdown).remove();
		$(this.groupRandomEdit.button).css({display:'block'});
	},
	groupRandomDialog:function(o) {
		this.dropRandomDialog();
		this.groupRandomEdit.button=o;
		this.groupRandomEdit.index=$(o.parentNode.parentNode.parentNode).prevAll('.field').get().length;
		if (questionaire.data.structure[this.groupRandomEdit.index].value.randomize==undefined) questionaire.data.structure[this.groupRandomEdit.index].value.randomize=-1;
		var c=1;
		var i=this.groupRandomEdit.index+1;
		while(i<questionaire.data.structure.length && questionaire.data.structure[i].value.grouped=="1") {
			i++;
			c++;
		}
		this.groupRandomEdit.maxCount=c;
		var locator=document.createElement("div");
		var dropdown=document.createElement("div");
		var opts=[['none',-1],['all',0]];
		if (c>1) for(i=1;i<c;i++) opts.push([i.toString(),i]);
		for(var k in opts) {
			var opt=document.createElement("a");
			opt.href='javascript:void(0)';
			opt.innerHTML=opts[k][0];
			opt.value=opts[k][1];
			$(opt).bind("click",function() {
				questionaire.change('randomize',questionaire.groupRandomEdit.button,questionaire.groupRandomEdit.index,this.value);
				questionaire.dropRandomDialog();
			});
			dropdown.appendChild(opt);
		}
		$(locator).css({float:"right",width:$(o).outerWidth(true),height:$(o).outerHeight(),position:"relative"});
		$(dropdown).addClass("constructorDropdown").css({'min-width':$(o).outerHeight()-8});
		locator.appendChild(dropdown);
		o.parentNode.insertBefore(locator,o);
		$(o).css({display:"none"});
		this.groupRandomEdit.dropdown=locator;
	},
	textMatchOptions:{dialog:null,fieldIndex:null,optionIndex:null},
	dropTextMatchDialog:function() {
		$(this.textMatchOptions.dialog).remove();
	},
	textMetaOptions:{dialog:null,fieldIndex:null,optionIndex:null},
	dropTextMetaDialog:function() {
		$(this.textMetaOptions.dialog).remove();
	},
	textMetaDialog:function(o) {
		this.dropTextMetaDialog();
		var f=this.parent_of_class(o,"field");
		var fi=$(f).prevAll('.field').get().length;
		this.textMetaOptions.fieldIndex=fi;
		var fv=this.parent_of_class(o,"fieldvalue");
		var fvi=$(fv).prevAll('.fieldvalue').get().length;
		this.textMetaOptions.optionIndex=fvi;
		if (this.data.structure[fi].value.option[fvi].meta===undefined) this.data.structure[fi].value.option[fvi].meta=[];
		var matches=this.data.structure[fi].value.option[fvi].meta;
		var dialog=document.createElement("div");
		this.textMetaOptions.dialog=dialog;
		for(var m=0;m<matches.length;m++) {
			dialog.appendChild(this.textMetaEntry(matches[m]));
		}
		var addButton=document.createElement("button");
		$(addButton).bind("click",function() {
			questionaire.data.structure[questionaire.textMetaOptions.fieldIndex].value.option[questionaire.textMetaOptions.optionIndex].meta.push({text:''});
			var matches=questionaire.data.structure[questionaire.textMetaOptions.fieldIndex].value.option[questionaire.textMetaOptions.optionIndex].meta;
			questionaire.textMetaOptions.dialog.insertBefore(questionaire.textMetaEntry(matches[matches.length-1]),this);
			questionaire.textMetaUpdateButton();
		}).addClass("default").attr('type','button');
		addButton.innerHTML="add";
		dialog.appendChild(addButton);
		var closeButton=document.createElement("button");
		$(closeButton).bind("click",function() {questionaire.dropTextMetaDialog();}).addClass("default").html("close");
		dialog.appendChild(closeButton);
		$(dialog).css({position:"absolute",top:0,right:0});
		$(dialog).addClass("textMatch");
		o.parentNode.appendChild(dialog);
	},
	textMatchDialog:function(o) {
		this.dropTextMatchDialog();
		var f=this.parent_of_class(o,"field");
		var fi=$(f).prevAll('.field').get().length;
		this.textMatchOptions.fieldIndex=fi;
		var fv=this.parent_of_class(o,"fieldvalue");
		var fvi=$(fv).prevAll('.fieldvalue').get().length;
		this.textMatchOptions.optionIndex=fvi;
		if (this.data.structure[fi].value.option[fvi].matches===undefined) this.data.structure[fi].value.option[fvi].matches=[];
		var matches=this.data.structure[fi].value.option[fvi].matches;
		var dialog=document.createElement("div");
		this.textMatchOptions.dialog=dialog;
		for(var m=0;m<matches.length;m++) {
			dialog.appendChild(this.textMatchEntry(matches[m]));
		}
		var addButton=document.createElement("button");
		$(addButton).bind("click",function() {
			questionaire.data.structure[questionaire.textMatchOptions.fieldIndex].value.option[questionaire.textMatchOptions.optionIndex].matches.push({text:'',score:null});
			var matches=questionaire.data.structure[questionaire.textMatchOptions.fieldIndex].value.option[questionaire.textMatchOptions.optionIndex].matches;
			questionaire.textMatchOptions.dialog.insertBefore(questionaire.textMatchEntry(matches[matches.length-1]),this);
			questionaire.textMatchUpdateButton();
		}).addClass("default").attr('type','button');
		addButton.innerHTML="add";
		dialog.appendChild(addButton);
		var closeButton=document.createElement("button");
		$(closeButton).bind("click",function() {questionaire.dropTextMatchDialog();}).addClass("default").html("close").attr('type','button');
		dialog.appendChild(closeButton);
		$(dialog).css({position:"absolute",top:0,right:0});
		$(dialog).addClass("textMatch");
		o.parentNode.appendChild(dialog);
	},
	textMetaUpdateButton:function() {
		var l=questionaire.data.structure[questionaire.textMetaOptions.fieldIndex].value.option[questionaire.textMetaOptions.optionIndex].meta.length;
		$(questionaire.textMetaOptions.dialog.parentNode).find(">a").html(l+' Meta'+((l==1)?'':'s'));
	},
	textMatchUpdateButton:function() {
		var l=questionaire.data.structure[questionaire.textMatchOptions.fieldIndex].value.option[questionaire.textMatchOptions.optionIndex].matches.length;
		$(questionaire.textMatchOptions.dialog.parentNode).find(">a").html(l+' Match'+((l==1)?'':'es'));
	},
	textMetaEntry:function(matchItem) {
		var matchText=document.createElement("div");
		$(matchText).css({'white-space':'nowrap'});
		//if (this.score_system.textMatch) matchText.innerHTML=this.score_system.textMatch.selector(matchItem.score)+this.score_system.multiplier(matchItem.multiplier);
		var ip=document.createElement("input");
		$(ip).bind("keydown",function(e) {
			var kc=questionaire.keyCode(e);
			if(kc.navigate || kc.alpha || kc.numeric || kc.code==192 || kc.code==190 || kc.code==189) {
				return true;
			}else{
				e.preventDefault();
				return false;
			}
		});
		$(ip).bind("keyup",function() {
			var mi=$(this.parentNode).prevAll("div").get().length;
			questionaire.data.structure[questionaire.textMetaOptions.fieldIndex].value.option[questionaire.textMetaOptions.optionIndex].meta[mi].text=this.value;
		});
		ip.value=matchItem.text;
		if(matchText.childNodes.length>0) {
			matchText.insertBefore(ip,matchText.childNodes[0]);
		}else{
			matchText.appendChild(ip);
		}
		var rem=document.createElement("button");
		$(rem).bind("click",function() {
			var mi=$(this.parentNode).prevAll("div").get().length;
			questionaire.data.structure[questionaire.textMetaOptions.fieldIndex].value.option[questionaire.textMetaOptions.optionIndex].meta.splice(mi,1);
			$(this.parentNode).remove();
			questionaire.textMetaUpdateButton();
		}).addClass("removeButton").attr('type','button');
		matchText.appendChild(rem);
		return matchText;
	},
	textMatchEntry:function(matchItem) {
		var matchText=document.createElement("div");
		$(matchText).css({'white-space':'nowrap'});
		if (this.score_system.textMatch) matchText.innerHTML=this.score_system.textMatch.selector(matchItem.score)+this.score_system.multiplier(matchItem.multiplier);
		var ip=document.createElement("input");
		$(ip).bind("keydown",function(e) {
			var kc=questionaire.keyCode(e);
			if(kc.navigate || kc.alpha || kc.numeric || kc.code==192 || kc.code==190 || kc.code==189) {
				return true;
			}else{
				e.preventDefault();
				return false;
			}
		});
		$(ip).bind("keyup",function() {
			var mi=$(this.parentNode).prevAll("div").get().length;
			questionaire.data.structure[questionaire.textMatchOptions.fieldIndex].value.option[questionaire.textMatchOptions.optionIndex].matches[mi].text=this.value;
		});
		ip.value=matchItem.text;
		if(matchText.childNodes.length>0) {
			matchText.insertBefore(ip,matchText.childNodes[0]);
		}else{
			matchText.appendChild(ip);
		}
		var rem=document.createElement("button");
		$(rem).bind("click",function() {
			var mi=$(this.parentNode).prevAll("div").get().length;
			questionaire.data.structure[questionaire.textMatchOptions.fieldIndex].value.option[questionaire.textMatchOptions.optionIndex].matches.splice(mi,1);
			$(this.parentNode).remove();
			questionaire.textMatchUpdateButton();
		}).addClass("removeButton").attr('type','button');
		matchText.appendChild(rem);
		return matchText;
	},
	setTextMatchScore:function(o) {
		var mi=$(o.parentNode).prevAll("div").get().length;
		questionaire.data.structure[questionaire.textMatchOptions.fieldIndex].value.option[questionaire.textMatchOptions.optionIndex].matches[mi].score=o.value;
	},
	setMultiplier:function(o,v) {
		var f=this.parent_of_class(o,"field");
		var fi=$(f).prevAll('.field').get().length;
		var fv=this.parent_of_class(o,"fieldvalue");
		var fvi=$(fv).prevAll('.fieldvalue').get().length;
		if (questionaire.data.structure[fi].value.type=="text") {
			var mi=$(o.parentNode.parentNode).prevAll("div").get().length;
			if (questionaire.data.structure[fi].value.option[fvi].matches[mi].multiplier==undefined || isNaN(questionaire.data.structure[fi].value.option[fvi].matches[mi].multiplier)) questionaire.data.structure[fi].value.option[fvi].matches[mi].multiplier=1;
			questionaire.data.structure[fi].value.option[fvi].matches[mi].multiplier+=v;
			if (questionaire.data.structure[fi].value.option[fvi].matches[mi].multiplier<1) questionaire.data.structure[fi].value.option[fvi].matches[mi].multiplier=1;
			$(o.parentNode).find("span").html(questionaire.data.structure[fi].value.option[fvi].matches[mi].multiplier);
		}else{
			if (questionaire.data.structure[fi].value.option[fvi].multiplier==undefined || isNaN(questionaire.data.structure[fi].value.option[fvi].multiplier)) questionaire.data.structure[fi].value.option[fvi].multiplier=1;
			questionaire.data.structure[fi].value.option[fvi].multiplier+=v;
			if(questionaire.data.structure[fi].value.option[fvi].multiplier<1) questionaire.data.structure[fi].value.option[fvi].multiplier=1;
			$(o.parentNode).find("span").html(questionaire.data.structure[fi].value.option[fvi].multiplier);
		}
	},
	createUsersTotals:function(o) {
		var i=$(o.parentNode.parentNode.parentNode.parentNode.parentNode).prevAll('.field').get().length;
		var j=$(o.parentNode).prevAll('.fieldvalue').get().length;
		var opts={prefix:'questionaire'};
		if (questionaire.data.structure[i].value.option[j].widget!==undefined && questionaire.data.structure[i].value.option[j].widget!==null && questionaire.data.structure[i].value.option[j].widget.exerciseId!==undefined) opts.widget=questionaire.data.structure[i].value.option[j].widget.exerciseId;
		createUsersTotals(function(reply) {
			questionaire.data.structure[i].value.option[j].usersTotalsKey=reply;
			questionaire.receivedWidget(o);
			questionaire.mustSave=true;
		},opts);
	},
	removeUsersTotals:function(o) {
		if (window.confirm('This action will erase any data already saved. Are you sure?')) {
			var i=$(o.parentNode.parentNode.parentNode.parentNode.parentNode).prevAll('.field').get().length;
			var j=$(o.parentNode).prevAll('.fieldvalue').get().length;
			deleteUsersTotals(function(reply) {
				questionaire.data.structure[i].value.option[j].usersTotalsKey='';
				questionaire.receivedWidget(o);
				questionaire.mustSave=true;
			},questionaire.data.structure[i].value.option[j].usersTotalsKey,questionaire.data.structure[i].value.option[j].widget.exerciseId);
		}
	},
	createWidget:function(o) {
		var i=$(o.parentNode.parentNode.parentNode.parentNode.parentNode).prevAll('.field').get().length;
		var j=$(o.parentNode).prevAll('.fieldvalue').get().length;
		var opts={
			incompleteText:{title:'Not completed message',value:''},
			prefixText:{title:'Text before the user value',value:''},
			asPercentage:{title:'Show value as a percentage',value:'1',checkbox:'1'},
			suffixText:{title:'Text after the user value',value:''},
			style:{title:'Display type',value:'',options:['progress bar','text only']},
			displayRange:{title:'Display max/min',value:'1',checkbox:'1'},
			updateable:{title:'Updateable',value:'1',checkbox:'1'},
			priorityInitial:{title:'Priority (0-100) start point',value:'0'},
			priorityValueFactor:{title:'Priority factor ( x value )',value:'0'},
			priorityDaysFactor:{title:'Priority factor ( x days since update )',value:'0'},
			openDooit:{title:'Link to Doo-it',value:'1',checkbox:'1'},
			openDooitText:{title:'Link to Doo-it text',value:''}
		};
		if (experienceId!==null) {
			opts.experienceId={title:'Experience ID',value:(experienceId===null)?'':experienceId.toString(),hidden:'1'};
			opts.hideExperience={title:'Hide experience $experienceName$',value:'0',checkbox:'1'};
			opts.showExperienceText={title:'Show experience button text',value:''};
			opts.hideExperienceText={title:'Reset/hide experience button text',value:''};
		}
		if (questionaire.data.structure[i].value.option[j].historical===true) {
			opts.showHistorical={title:'Show graph of historical values',value:'0',checkbox:'1'};
			opts.showHistoricalCount={title:'How many historical values to show (empty shows all)',value:''};
		}
		switch(questionaire.data.structure[i].value.type) {
			case "slider":

			break;
			case "numeric":
				opts.asPercentage=undefined;
			break;
		}
		var widgetLayout=this.generateWidgetLayout(opts,questionaire.data.structure[i].value.option[j]);
		createWidget(exerciseId,widgetLayout,function(reply) {
			questionaire.data.structure[i].value.option[j].widget=reply;
			questionaire.receivedWidget(o);
			questionaire.mustSave=true;
		});
		$(o.parentNode.parentNode.parentNode.parentNode.parentNode).find(".field_info select").attr("disabled",true);
	},
	removeWidget:function(o) {
		if (window.confirm("You sure you wish to delete this widget?")) {
			var i=$(o.parentNode.parentNode.parentNode.parentNode.parentNode).prevAll('.field').get().length;
			var j=$(o.parentNode).prevAll('.fieldvalue').get().length;
			var key='';
			if (questionaire.data.structure[i].value.option[j].usersTotalsKey!==undefined && questionaire.data.structure[i].value.option[j].usersTotalsKey!="") key=questionaire.data.structure[i].value.option[j].usersTotalsKey;
			deleteWidget(questionaire.data.structure[i].value.option[j].widget.exerciseId,key,function(reply) {
				questionaire.data.structure[i].value.option[j].widget=undefined;
				questionaire.data.structure[i].value.option[j].usersTotalsKey='';
				questionaire.receivedWidget(o);
				questionaire.mustSave=true;
				if (!questionaire.hasWidget(questionaire.data.structure[i].value)) $(questionaire.parent_of_class(o,'field')).find(".field_info select").attr("disabled",false);
			});
		}
	},
	receivedWidget:function(o) {
		var i=$(o.parentNode.parentNode.parentNode.parentNode.parentNode).prevAll('.field').get().length;
		var j=$(o.parentNode).prevAll('.fieldvalue').get().length;
		$(o).html(questionaire.widgetInput(questionaire.data.structure[i].value.option[j]));
		questionaire.saveLocal();
	},
	generateWidgetLayout:function(opts,val) {
		var widgetLayout='{\n\tdependencies:[\n';
		widgetLayout+='\t\t[\'widgets/js/miniGraph.js\',true],\n';
		widgetLayout+='\t\t[\'widgets/js/integerWidget.js\',true],\n';
		widgetLayout+='\t\t[\'widgets/css/integerWidget.css\',true]\n';
		widgetLayout+='\t],\n';
		widgetLayout+='\tcontinueControl:false,\n';
		widgetLayout+='\tready:function(src) {\n';
		widgetLayout+='\t\src.object=new integerWidget(src);\n';
		widgetLayout+='\t},\n';
		widgetLayout+='\tkey:\'';
		if (val.usersTotalsKey!==undefined && val.usersTotalsKey!="") widgetLayout+=val.usersTotalsKey;
		widgetLayout+='\',\n';
		widgetLayout+='\toptions:{\n';
		var optsins=[];
		for(var k in opts) {
			var wl='\t\t'+k+':{\n';
			var ins=[];
			for(var kk in opts[k]) {
				if (kk=='options') {
					ins.push('\t\t\t'+kk+':[\''+opts[k][kk].join('\',\'')+'\']');
				}else{
					ins.push('\t\t\t'+kk+':\''+opts[k][kk].replace(/\'/g,'\\\'')+'\'');
				}
			}
			wl+=ins.join(',\n')+'\n';
			wl+='\t\t}';
			optsins.push(wl);
		}
		widgetLayout+=optsins.join(',\n')+'\n';
		widgetLayout+='\t}\n';
		widgetLayout+='}\n';
		return widgetLayout;
	},
	change:function(k,o) {
		if(k=="start") {
			var dv=$(o).prev("select");
			var v=parseInt($(o).val());
			var i=$(o.parentNode.parentNode.parentNode.parentNode.parentNode).prevAll('.field').get().length;
			var j=$(o.parentNode).prevAll('.fieldvalue').get().length;
		
			if(v=="none") v=null;
			questionaire.data.structure[i].value.option[j][k]=""+v;
			if(parseInt(dv.val())<v) {
				dv.get(0).selectedIndex=o.selectedIndex;
				questionaire.data.structure[i].value.option[j]['divisions']=""+v;
			}
		}else  if(k=="divisions") {
			var st=$(o).next("select");
			var v=parseInt($(o).val());
			var i=$(o.parentNode.parentNode.parentNode.parentNode.parentNode).prevAll('.field').get().length;
			var j=$(o.parentNode).prevAll('.fieldvalue').get().length;
		
			if(v=="none") v=null;
			questionaire.data.structure[i].value.option[j][k]=""+v;
			if(parseInt(st.val())>v) {
				st.get(0).selectedIndex=o.selectedIndex;
				questionaire.data.structure[i].value.option[j]['start']=""+v;
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
			questionaire.data.structure[i].required=checked?"1":"0";
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
			questionaire.data.structure[i].value.multiple=checked?"1":"0";
		}else  if(k=="grouped") {
			var checked=!$(o).hasClass("on");
			var i=$(o.parentNode.parentNode.parentNode).prevAll('.field').get().length;
//console.log(o.parentNode.parentNode.parentNode);
			if(checked) {
				$(o).addClass("on");
				$(o).html("grouped");
				var prevRandom=$(o.parentNode.parentNode.parentNode).prev('.field').find('button.random');
				if(i>0) {
					if (questionaire.data.structure[i-1].value.grouped!="1") prevRandom.css({display:'block'});
				}
				$(o.parentNode.parentNode.parentNode).find('.summary .field_summary').html("Grouped with the above");
				questionaire.data.structure[i].value.multiple="0";
				$(o).next('button.multiple').html('single');
				$(o).next('button.multiple').removeClass("on");
				$(o.parentNode).find(".required").css('display','none');
				$(o.parentNode).find('.paraDisplay').css({display:'none'});

			}else{
				$(o.parentNode).find(".required").css('display','block');
				$(o).removeClass("on");
				$(o).html("ungrouped");
				var prevRandom=$(o.parentNode.parentNode.parentNode).prev('.field').find('button.random');
				if(i>0) {
					prevRandom.css({display:'none'});
				}
				var t=questionaire.data.structure[i].paragraph;
				if (t=='' || t=='<br>') t=questionaire.data.structure[i].title;
				if (t=='' || t=='<br>') t='Untitled';
				$(o.parentNode.parentNode.parentNode).find('.summary .field_summary').html(t);
				$(o.parentNode).find('.paraDisplay').css({display:'block'});
			}
			var multiply=questionaire.multipliable[questionaire.data.structure[i].value.type];
			$(o).next('button.multiple').css('display',checked?'none':(multiply?'block':'none'));
			questionaire.data.structure[i].value.grouped=checked?"1":"0";
		}else  if(k=="randomize") {
			var i=arguments[2];
			var v=arguments[3];
			var checked=$(o).hasClass("on");
			if (v>=0 && !checked) $(o).addClass("on");
			if (v<0 && checked) $(o).removeClass("on");
			$(o).html((v<0)?"unshuffled":((v==0)?"shuffle all":"shuffle ["+v+"]"));
			questionaire.data.structure[i].value.randomize=v;
		}else if(k=="default") {
			var checked=!$(o).hasClass("on");
			var i=$(o.parentNode.parentNode.parentNode.parentNode.parentNode).prevAll('.field').get().length;
			var j=$(o.parentNode).prevAll('.fieldvalue').get().length;
			if(questionaire.data.structure[i].value.type=='select') {
				$(o.parentNode.parentNode.parentNode.parentNode).find('button.default').removeClass('on');
				if(checked) $(o).addClass("on");
				for(var s=0;s<this.data.structure[i].value.option.length;s++) {
					questionaire.data.structure[i].value.option[s].isdefault=(s==j && checked)?'1':'0';
				}
			}else{
				if(checked) {
					$(o).addClass("on");
				}else{
					$(o).removeClass("on");
				}
				questionaire.data.structure[i].value.option[j].isdefault=(checked)?'1':'0';
			}
		}else if(k=="link") {
			var v=o.value;
			if(v>=0) {
				var fo=questionaire.parent_of_class(o,'field');
				var i=$(fo).prevAll('.field').get().length;
				if(questionaire.data.structure[i].value.type=='reference') {
					questionaire.data.structure[i].value.option[0].link=questionaire.attachStructure[v].id;
					questionaire.data.structure[i].value.option[0].questionIndex=-1;
					var label=o.parentNode;
					label.innerHTML="Source question: "+questionaire.type_functions.reference.available(questionaire.data.structure[i].value.option[0].link);
					$(label).next("label").html("Select by: "+questionaire.type_functions.reference.question(questionaire.data.structure[i].value.option[0].link,questionaire.data.structure[i].value.option[0].questionIndex,i));
				}
			}
		}else if(k=="addable") {
			var fo=questionaire.parent_of_class(o,'field');
			var i=$(fo).prevAll('.field').get().length;
			if(questionaire.data.structure[i].value.type=='reference') {
				questionaire.data.structure[i].value.option[0].addable=1-questionaire.data.structure[i].value.option[0].addable;
				if(questionaire.data.structure[i].value.option[0].addable) {
					$(o).addClass('on');
				}else{
					$(o).removeClass('on');
				}
			}
		}else if(k=="onlyTitle") {
			var fo=questionaire.parent_of_class(o,'field');
			var i=$(fo).prevAll('.field').get().length;
			if(questionaire.data.structure[i].value.type=='reference') {
				questionaire.data.structure[i].value.option[0].onlyTitle=1-questionaire.data.structure[i].value.option[0].onlyTitle;
				if(questionaire.data.structure[i].value.option[0].onlyTitle) {
					$(o).addClass('on');
				}else{
					$(o).removeClass('on');
				}
			}
		}else if(k=="questionIndex") {
			var v=o.value;
			if(v>=0) {
				var fo=questionaire.parent_of_class(o,'field');
				var i=$(fo).prevAll('.field').get().length;
				if(questionaire.data.structure[i].value.type=='reference') {
					questionaire.data.structure[i].value.option[0].questionIndex=parseInt(v);
				}
			}
		}else{
			var v=$(o).val();
			if(o.type!=undefined && o.type=='checkbox') {
				v=o.checked;
			}
			if (k=="rows") v=1*v;
			//if (!isNaN(v)) v=1*v;
			//var i=$(o.parentNode.parentNode.parentNode.parentNode.parentNode).prevAll('.field').get().length;
//console.log(i);
			var i=$(this.parent_of_class(o,'field')).prevAll('.field').get().length;
//console.log(i);
			//var j=$(o.parentNode).prevAll('.fieldvalue').get().length;
			var j=$(this.parent_of_class(o,'fieldvalue')).prevAll('.fieldvalue').get().length;
		
			if(v=="none") v=null;
			questionaire.data.structure[i].value.option[j][k]=v;
//console.log(questionaire.data.structure);
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
		return questionaire.parent_of_class(o.parentNode,c);
	},
	summary_text:function(txt) {
		var txt=txt.replace(/<[^>]+>/g,'');
		if (txt.length>60) txt=txt.substr(0,60)+"...";
		return txt;
	},
	type_selector:function(selected) {
		var disabled=false;
		if (arguments.length>1) disabled=arguments[1];
		var op="<select onchange='questionaire.change_type(this)'";
		if (disabled) op+=" disabled=true";
		op+=">";
		for(var k in this.type) {
			op+="<option"+((selected==k)?" selected='selected'":"")+">"+k+"</option>";
		}
		op+="</select>";
		return op;
	},
	scoring_selector:function() {
		var op="<select onchange='questionaire.change_scoring(this)'>";
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
		var op='<h2>Questionaire Construction</h2>';
		op+="<div class='additionalOptions'>";
		op+="<div class='info helper'>"+this.helpMessage('report')+"<label>PDF download:</label><input type='checkbox' "+((typeof(this.data.dooit.pdf)=="undefined")?"checked":(this.data.dooit.pdf?"checked":""))+" onchange='questionaire.data.dooit.pdf=this.checked;' /></div>";
		op+="<div class='info helper'>"+this.helpMessage('report')+"<label>Report view:</label><input type='checkbox' "+((typeof(this.data.dooit.report)=="undefined")?"checked":(this.data.dooit.report?"checked":""))+" onchange='questionaire.data.dooit.report=this.checked;if (this.checked) {$(this.parentNode).next().slideDown();}else{$(this.parentNode).next().slideUp();}' /></div>";

		op+="<div style='display:"+((typeof(this.data.dooit.report)=="undefined")?'block':(this.data.dooit.report?'block':'none'))+"'>";
		op+="<div class='info helper'>"+this.helpMessage('editButtonText')+"<label>Edit button view text:</label><br /><input type='text' value='"+((typeof(this.data.dooit.editButtonText)=="undefined")?'':this.data.dooit.editButtonText)+"' onkeyup='questionaire.data.dooit.editButtonText=this.value;' /></div>";
		op+="<div class='info helper'>"+this.helpMessage('reportButtonText')+"<label>Report button view text:</label><br /><input type='text' value='"+((typeof(this.data.dooit.reportButtonText)=="undefined")?'':this.data.dooit.reportButtonText)+"' onkeyup='questionaire.data.dooit.reportButtonText=this.value;' /></div>";
		op+="</div>";

		op+="<div class='info helper'>"+this.helpMessage('randomize')+"<label>Randomize questions:</label><input type='checkbox' "+((typeof(this.data.dooit.randomize)=="undefined")?"":(this.data.dooit.randomize?"checked":""))+" onchange='questionaire.data.dooit.randomize=this.checked;' /></div>";
		op+="<div class='info helper'>"+this.helpMessage('randomOptions')+"<label>Randomize options:</label><input type='checkbox' "+((typeof(this.data.dooit.randomizeoptions)=="undefined")?"":(this.data.dooit.randomizeoptions?"checked":""))+" onchange='questionaire.data.dooit.randomizeoptions=this.checked;' /></div>";
		op+="<div class='info helper'>"+this.helpMessage('serialize')+"<label>Serialize:</label><input type='checkbox' "+((typeof(this.data.dooit.serialize)=="undefined")?"":(this.data.dooit.serialize?"checked":""))+" onchange='questionaire.data.dooit.serialize=this.checked;$(this.parentNode).next().css(\"display\",this.checked?\"block\":\"none\").next().css(\"display\",this.checked?\"block\":\"none\");' /></div>";
		op+="<div class='info helper' style='display:"+((this.data.dooit.serialize)?"block":"none")+"'>"+this.helpMessage('redoable')+"<label>Redoable:</label><input type='checkbox' "+((typeof(this.data.dooit.redoable)=="undefined")?"":(this.data.dooit.redoable?"checked":""))+" onchange='questionaire.data.dooit.redoable=this.checked;' /></div>";
		op+="<div class='info helper' style='display:"+((this.data.dooit.serialize)?"block":"none")+"'>"+this.helpMessage('startbutton')+"<label>Start Button:</label><input type='text' value='"+((typeof(this.data.dooit.startbutton)=="undefined")?"":this.data.dooit.startbutton)+"' onchange='questionaire.data.dooit.startbutton=this.value;' /></div>";
		op+="</div>";
		op+="<div>";
		op+="<div class='info'><label>Dooit title:</label><input type='text' value=\""+this.data.dooit.title.replace(/"/g,'&rdquo;')+"\" onkeyup='questionaire.data.dooit.title=this.value;' /></div>";
		op+="<div class='info'><label>Subheading:</label><input type='text' value=\""+this.data.dooit.subheading.replace(/"/g,'&rdquo;')+"\"  onkeyup='questionaire.data.dooit.subheading=this.value;' /></div>";
		op+="<div class='info'><label>Scoring:</label>"+this.scoring_selector()+"</div>";
		op+="<div class='scoringOptions'>"+((this.score_system.optionsDisplay!=undefined)?this.score_system.optionsDisplay():'')+"</div>";
		op+="<div class='tag_rule_container'></div>";
		op+="</div>";
		op+="<div class='questions'>";
		op+='Questions : <a href="javascript:questionaire.add();">new</a>';
		op+="<div class='fields'>";
		if (this.data.structure.length>0) {
			for(var d=0;d<this.data.structure.length;d++) op+=this.field_container(d);
		}else{
			op+="No questions yet defined";
		}
		op+="</div>";
		op+='<a href="javascript:questionaire.add();">new</a>';
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
		//var ins="<a href='javascript:void(0);' onclick='questionaire.remove(this.parentNode);' style='float:right'>remove</a>";
		var ins="<button type='button' class='removeButton helper' onclick='questionaire.remove(this.parentNode);' style='float:right'>"+this.helpMessage('remove')+"</button>";
		ins+="<button type='button' class='copyButton helper' onclick='questionaire.copy(this.parentNode);' style='float:right'>"+this.helpMessage('copy')+"</button>";
		ins+="<div class='move movefield'></div>";
		ins+="<div class='summary' onmouseup='questionaire.edit(this);'>"+this.field_summary(d)+"</div>";
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
		this.save_paragraph();
		var reported=false;
		if (arguments.length>2) reported=arguments[2];
		libraryOptions = {
			buttons : {'library' : {name : __('Add an image'), type : 'libraryButton'}
			},iconFiles : {'library' : '/utilities/uploader/nicLibrary.png'}
		};
		libraryButton = nicEditorAdvancedButton.extend({   
		  mouseClick : function() {
			questionaire.htmlInstance.saveRng();
			  questionaire.uploader();
		  }
		});
		nicEditors.registerPlugin(nicPlugin,libraryOptions);
		var bl=['bold','italic','underline','left','center','right','justify','ol','ul','subscript','superscript','strikethrough','removeformat','indent','outdent','hr','forecolor','bgcolor','fontSize','fontFamily','fontFormat','library'];
		if(this.nic===null) this.nic=new nicEditor({fullPanel:false,buttonList:bl,iconsPath:'/uploads/sitegeneric/image/dooits/nicEditorIcons.gif'});
		o.parentNode.parentNode.parentNode.parentNode.rte=this.nic.panelInstance(o.id,{hasPanel:true});
		this.htmlInstance=this.nic.instanceById(o.id);
		var ed=this.parent_of_class(o,'editor');
		ed.rteid=o.id;
		ed.question=d;
		ed.field_name=(reported?"report":"")+'paragraph';
		if ($(o).hasClass("head")) o.parentNode.parentNode.parentNode.field_name='paragraph';
	},
	set_paragraph_type:function(o,d) {
		this.save_paragraph();
		var field=this.parent_of_class(o,"field");
		var q=$(field).prevAll('.field').get().length;
		this.data.structure[q].displayAs=$(o).val();
		if (this.data.structure[q].displayAs==3) {
			$(field).find('.reportparagraphcontainer').slideDown();
		}else{
			$(field).find('.reportparagraphcontainer').slideUp();
		}
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

				//var sumText=questionaire.summary_text(this.data.structure[d].title);
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
	uploaderWindow:null,
	uploader:function() {
		uploaderStart(questionaire.imageSelected);
		/*var res=questionaire.iframeResponse;
		if (arguments.length>0) res=arguments[0];
		if (window.attachEvent) {
			window.attachEvent('onmessage',res);
		}else{
			window.addEventListener('message',res,false);
		}
		var w=504;
		w+=20;
		var h=400;
		var ins='<iframe src="/imagery/uploader/?repository=dooits&quantity=0&sitehash='+sitehash+'&userhash='+userhash+'&width='+w+'&height='+h+'&callback=questionaire.imageSelected&origin='+window.location.hostname+'" style="width:'+w+'px;height:'+h+'px" scrolling="no" ></iframe>';
		this.uploaderWindow=document.createElement("div");
		this.uploaderWindow.innerHTML=ins;
		document.body.appendChild(this.uploaderWindow);
		$(this.uploaderWindow).dialog({width:w,height:h+25});*/
		//dialog.show({id:'scrapbookuploader',title:'Upload',content:ins,withBlackoutClickClose:false});
	},
	uploaderClosed:function() {
		if (window.detachEvent) {
			window.detachEvent('onmessage',questionaire.iframeResponse);
		}else{
			window.removeEventListener('message',questionaire.iframeResponse,false);
		}
	},
	iframeResponse:function(r) {
		try{
			eval(r.data);
		}catch(e){
			//console.log(r.data);
		}
	},
	imageSelected:function(img) {
		questionaire.htmlInstance.restoreRng();
		questionaire.nic.nicCommand("insertImage",yoodoo.option.baseUrl+img.source.replace(/^\//,''));
		var imgs=$(questionaire.htmlInstance.elm).find("IMG").get();
		if (img.title!==undefined) {
			for(var i=0;i<imgs.length;i++) {
				if(imgs[i].src==img.source) imgs[i].title=img.title;
			}
		}
		//$(questionaire.uploaderWindow).dialog("close");
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
		var f=questionaire.parent_of_class(ip,'field');
		var fv=questionaire.parent_of_class(ip,'fieldvalue');
		var j=$(f).prevAll(".field").get().length;
		var k=$(fv).prevAll(".fieldvalue").get().length;
		if (questionaire.hasWidget(questionaire.data.structure[j].value,k)) {
			alert("This question option has a Widget and cannot be deleted!");
			return false;
		}
		$(ip.parentNode).slideUp(function() {
			var i=$(this.parentNode.parentNode.parentNode.parentNode).prevAll('.field').get().length;
			var j=$(this).prevAll('.fieldvalue').get().length;
			questionaire.data.structure[i].value.option.splice(j,1);
			if (questionaire.data.structure[i].value.length==0) $(this.parentNode).html("No input defined");
			var sum=$(questionaire.fields_content).find(".field .summary").get(i);
			$(sum).html(questionaire.field_summary(i));
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
		this.dropRandomDialog();
		this.dropTextMatchDialog();
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
		var j=$(f).prevAll(".field").get().length;
		if (questionaire.hasWidget(questionaire.data.structure[j].value)) {
			alert("This question has Widgets and cannot be deleted!");
			return false;
		}else{
			if (!window.confirm("Delete this question?")) return false;
		}
		$(f).slideUp(function() {
			var j=$(this).prevAll(".field").get().length;
			questionaire.data.structure.splice(j,1);
			$(this).remove();
			questionaire.define_sort();
			questionaire.number_field_elements();
		});
	},
	copy:function(f) {
		var j=$(f).prevAll(".field").get().length;
		//questionaire.data.structure.splice(j,1);
		//$(this).remove();
		questionaire.add(j);
	},
	add:function() {
		var idx=null;
		if (arguments.length>0) idx=arguments[0];
		var val=this.field();
		if (idx!==null) {
		//if (this.data.structure.length>0) {
			val.value.type=""+this.data.structure[idx].value.type;
			val.value.option=[];
			for(var i=0;i<this.data.structure[idx].value.option.length;i++) {
				var arr=$.extend(true,[],this.data.structure[idx].value.option[i]);
				arr.widget=undefined;
				val.value.option.push(arr);
			}
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
			$(nf).fadeIn(1000,function() {questionaire.edit($(this).find(".summary").get(0));});
			this.scrollToIndex(this.data.structure.length-1);
		}
	},
	define_sort:function() {
		$(this.fields_content).sortable({items:'.field', handle:'.movefield' ,update:function(e,u) {questionaire.set_order();}});
	},
	define_sort_options:function(fn) {
		this.options_indexing();
		var fo=$(this.open_editor).find('.fieldvalues');
		fo.sortable({items:'.fieldvalue', handle:'.movevalue' ,update:function(e,u) {questionaire.set_order_options();}});
	},
	set_order:function() {
		var ol=[];
		$(this.fields_content).find(".field").each(function(i,o) {
			ol.push(questionaire.data.structure[o.index]);
			o.index=i;
		});
		this.data.structure=ol;
		$(this.fields_content).find(".field").each(function(i,o) {
			//console.log(questionaire.data.structure[i].id+","+questionaire.data.structure[i].value.grouped);
			if((i==0) || (i>0 && (!questionaire.groupable[questionaire.data.structure[i].value.type] || !questionaire.groupable[questionaire.data.structure[i-1].value.type]))) {
				questionaire.data.structure[i].value.grouped='0';
				//$(o).find('.summary .field_summary').html(questionaire.field_summary(i,true));
			}else{
				//$(o).find('.summary .field_summary').html((questionaire.data.structure[i].value.grouped=="1")?"Grouped with the above":questionaire.field_summary(i,true));
			}
				$(o).find('.summary .field_summary').html(questionaire.field_summary(i,true));
			$(o).find('.editor').html(questionaire.field_editor(i));
		});
	},
	set_order_options:function() {
		var ol=[];
		var j=$(questionaire.open_editor.parentNode).prevAll(".field").get().length;
		$(this.open_editor).find(".fieldvalue").each(function(i,o) {
			var oi=o.index;
			ol.push(questionaire.data.structure[j].value.option[oi]);
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
	save:function() {
		$('textarea#globalFieldContent').val(this.json(this.data));
		$('textarea#display').val(this.layout);
		//questionaire.clearLocal();
	},
	json:function(o) {

		if (o===null || typeof(o)=="undefined") {
			return 'null';
		}else if (typeof(o)=="string") {
			return '"'+this.encode(o)+'"';
		}else if (o.getFullYear) {
			return 'new Date('+o.getFullYear()+','+o.getMonth()+','+o.getDate()+')';
		}else if (typeof(o)=="number") {
			return ''+o;
		}else if (typeof(o)=="boolean") {
			return o?"true":"false";
		}else{
			var keyed=false;
			for(var k in o) {
				if (isNaN(k)) keyed=true;
			}
			var col=[];
			if (keyed) {
				for(var k in o) {
					col.push('"'+k+'":'+this.json(o[k]));
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
		ip=ip.replace(/\n/g,'&nl;');
		return ip;
	},
	decode:function(ip) {
		var notJustString=false;
		if (arguments.length>1) notJustString=true;
		if (typeof(ip)=="string") {
			ip=ip.replace(/&sq;/g,"'");
			ip=ip.replace(/&apos;/g,"'");
			if (notJustString) {
				ip=ip.replace(/&dq;/g,'"');
			}else{
				ip=ip.replace(/&dq;/g,'\\"');
			}
			ip=ip.replace(/&nl;/g,"\n");
			return ip;
		}else if (typeof(ip)=="object"){
			for(var i in ip) {
				ip[i]=this.decode(ip[i],true);
			}
		}
		return ip;
	},
	/*output:function() {
		if (this.open_editor!==null) this.save_paragraph(this.open_editor);
		var op=dooit.json(this.data);
		yoodoo.console(op);
		array_of_fields[this.key][1]=op;
		var reply={};
		eval('reply.EF'+array_of_fields[this.key][0]+'=op;');
		return reply;
	},*/
	/*json:function(o) {
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
	},*/
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
		//console.log(ev);
		eval('txt='+ev);
		array_of_fields[this.key][1]=txt;
		this.init();
		//console.log('If this has broken the data, DO NOT SAVE');
	},

	tag_rule_editor:{
		container:null,
		build_set:function() {
			if(questionaire.data.dooit.tag_rules==undefined) questionaire.data.dooit.tag_rules={};
			if(questionaire.data.dooit.tag_rules.tags==undefined) questionaire.data.dooit.tag_rules.tags=[''];
			if(questionaire.data.dooit.tag_rules.rules==undefined) questionaire.data.dooit.tag_rules.rules=[];
			if(questionaire.data.dooit.tag_rules.options==undefined) questionaire.data.dooit.tag_rules.options={reset:false};
		},
		init:function() {
			this.container=document.createElement("div");
			if(questionaire.score_system.range.length>0) {
				this.build_set();
				$(this.container).addClass("tag_rule_editor");
				$(this.container).html('<a href="javascript:void(0)" onclick="questionaire.tag_rule_editor.toggle(this)">Show Tag Rule editor</a><div style="display:none"><ul><li class="on" onclick="questionaire.tag_rule_editor.showTab(\'tags\',this)">Tags</li><li onclick="questionaire.tag_rule_editor.showTab(\'rules\',this)">Rules</li></ul><div class="tab_content"><div class="tag_content"></div><div class="rule_content"></div></div></div>');
				$(this.container).find('.tag_content').get(0).appendChild(this.tag_list());
				//this.container.appendChild(this.rule_list());
			}else{
				this.build_set();
				$(this.container).addClass("tag_rule_editor");
				$(this.container).html('<a href="javascript:void(0)" onclick="questionaire.tag_rule_editor.toggle(this)">Show Tag Rule editor</a><div style="display:none"><div class="tab_content"><div class="tag_content"></div><div class="rule_content"></div></div></div>');
				$(this.container).find('.tag_content').get(0).appendChild(this.tag_list());
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
			//comment+="<button type='button' onclick='questionaire.tag_rule_editor.add_tag()'>add tag</button>";
			$(ins).html(comment);
			for(var i=0;i<questionaire.data.dooit.tag_rules.tags.length;i++) {
				ins.appendChild(this.tag_item(i));
			}
			return ins;
		},
		tag_item:function(i) {
			var tag=document.createElement("div");
			$(tag).addClass("tag_item");
			$(tag).html('<em>'+questionaire.data.dooit.tag_rules.tags[i]+'</em>');
			//$(tag).html("<input type='text' onkeyup='questionaire.tag_rule_editor.update_tag(this)' /><button type='button' onclick='questionaire.tag_rule_editor.remove_tag(this)' class='removeButton'></button>");
			//$(tag).find("input").val(questionaire.data.dooit.tag_rules.tags[i]);
			return tag;
		},
		update_tag:function(o) {
			var i=$(o.parentNode).prevAll('.tag_item').get().length;
			questionaire.data.dooit.tag_rules.tags[i]=$(o).val();
		},
		remove_tag:function(o) {
			var i=$(o.parentNode).prevAll('.tag_item').get().length;
			questionaire.data.dooit.tag_rules.tags.splice(i,1);
			$(o.parentNode).slideUp(500,function() {$(this).remove();});
		},
		add_tag:function() {
			questionaire.data.dooit.tag_rules.tags.push('');
			var item=this.tag_item(questionaire.data.dooit.tag_rules.tags.length-1);
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
					questionaire.data.dooit.tag_rules.options.reset=o.checked;
					break;
			}
		},
		rule_list:function() {
			var ins=document.createElement("div");
			$(ins).addClass('rule_list');
			var comment='<div>Rules are processed sequentially and subsequent rules may override a previous one.</div>';
			comment+="<div><label>Reset all tags before validating the rules <input type='checkbox' onchange='questionaire.tag_rule_editor.setOption(\"reset\",this)' "+(questionaire.data.dooit.tag_rules.options.reset?'checked':'')+" /></label></div>";
			$(ins).html(comment+"<button type='button' onclick='questionaire.tag_rule_editor.add_rule()'>new rule</button>");
			for(var i=0;i<questionaire.data.dooit.tag_rules.rules.length;i++) {
				ins.appendChild(this.rule_item(i));
			}
			return ins;
		},
		rule_item:function(r) {
			var rule=document.createElement("div");
			$(rule).addClass("rule_item");
			var ins='<label>Tag : <select onchange="questionaire.tag_rule_editor.update_rule(\'tag\',this)">';
			ins+="<option></option>";
			for(var i=0;i<questionaire.data.dooit.tag_rules.tags.length;i++) {
				ins+="<option"+((questionaire.data.dooit.tag_rules.rules[r].tag==questionaire.data.dooit.tag_rules.tags[i])?' selected="true"':'')+">"+questionaire.data.dooit.tag_rules.tags[i]+"</option>";
			}
			ins+="</select></label>";
			ins+='<label>Colour : <select onchange="questionaire.tag_rule_editor.update_rule(\'colour\',this)">';
			ins+="<option></option>";
			for(var i=0;i<questionaire.score_system.range.length;i++) {
				ins+="<option"+((questionaire.data.dooit.tag_rules.rules[r].colour==questionaire.score_system.range[i])?' selected="true"':'')+">"+questionaire.score_system.range[i]+"</option>";
			}
			ins+="</select></label>";

			if (questionaire.data.dooit.tag_rules.rules[r].unset==undefined) questionaire.data.dooit.tag_rules.rules[r].unset=false;
			ins+='<label><span>Unset</span>: <input type="checkbox" '+(questionaire.data.dooit.tag_rules.rules[r].unset?' checked':'')+' onchange="questionaire.tag_rule_editor.update_rule(\'unset\',this)"/></label>';
			ins+='<label>Unique: <input type="checkbox" '+(questionaire.data.dooit.tag_rules.rules[r].unique?' checked':'')+' onchange="questionaire.tag_rule_editor.update_rule(\'unique\',this)"/></label>';
			ins+="<button type='button' onclick='questionaire.tag_rule_editor.remove_rule(this)' class='removeButton'></button><br />";

			ins+='<label>Highest: <input type="checkbox" '+(questionaire.data.dooit.tag_rules.rules[r].highest?' checked':'')+' onchange="questionaire.tag_rule_editor.update_rule(\'highest\',this)"/></label>';
			ins+='<label>Lowest: <input type="checkbox" '+(questionaire.data.dooit.tag_rules.rules[r].lowest?' checked':'')+' onchange="questionaire.tag_rule_editor.update_rule(\'lowest\',this)"/></label>';
			
			ins+='<label>Position : <select onchange="questionaire.tag_rule_editor.update_rule(\'index\',this)">';
			ins+="<option value='-1'></option>";
			var suffix=['st','nd','rd','th','th','th','th','th','th','th','th','th'];
			for(var i=0;i<questionaire.score_system.range.length;i++) {
				var itxt=(i+1).toString();
				if (i<suffix.length) itxt+=suffix[i];
				ins+="<option"+((questionaire.data.dooit.tag_rules.rules[r].index==i)?' selected="true"':'')+" value='"+i+"'>"+itxt+"</option>";
			}
			ins+="</select></label><br />";


			ins+='<label>Compare: <input type="checkbox" '+(questionaire.data.dooit.tag_rules.rules[r].compare?' checked':'')+' onchange="questionaire.tag_rule_editor.update_rule(\'compare\',this);$(this.parentNode).next().css(\'display\',this.checked?\'inline\':\'none\');"/></label>';
			ins+='<span style="display:'+(questionaire.data.dooit.tag_rules.rules[r].compare?' inline':'none')+'">';

			ins+='<label>by: <select onchange="questionaire.tag_rule_editor.update_rule(\'compareby\',this)" >';
			var types={none:'',lt:'&lt;',lte:'&lt;=',eq:'=',gte:'&gt;=',gt:'&gt;'};
			for(var i in types) {
				ins+="<option value='"+i+"' "+((questionaire.data.dooit.tag_rules.rules[r].compareby==i)?' selected="true"':'')+">"+types[i]+"</option>";
			}
			ins+="</select></label>";

			ins+='<label>with: <select onchange="questionaire.tag_rule_editor.update_rule(\'comparewith\',this)" >';
			ins+="<option></option>";
			for(var i=0;i<questionaire.score_system.range.length;i++) {
				ins+="<option"+((questionaire.data.dooit.tag_rules.rules[r].comparewith==questionaire.score_system.range[i])?' selected="true"':'')+">"+questionaire.score_system.range[i]+"</option>";
			}
			ins+='</select></label>';

			ins+="</span><br />";
			if(questionaire.data.dooit.tag_rules.rules[r].above==undefined) questionaire.data.dooit.tag_rules.rules[r].above=false;
			if(questionaire.data.dooit.tag_rules.rules[r].below==undefined) questionaire.data.dooit.tag_rules.rules[r].below=false;
			if(questionaire.data.dooit.tag_rules.rules[r].abovePercent==undefined) {
				questionaire.data.dooit.tag_rules.rules[r].abovePercent=50;
				questionaire.data.dooit.tag_rules.rules[r].above=false;
			}
			if(questionaire.data.dooit.tag_rules.rules[r].belowPercent==undefined) {
				questionaire.data.dooit.tag_rules.rules[r].belowPercent=50;
				questionaire.data.dooit.tag_rules.rules[r].below=false;
			}
			ins+='<span>Above: <input type="checkbox" '+(questionaire.data.dooit.tag_rules.rules[r].above?' checked':'')+' onchange="questionaire.tag_rule_editor.update_rule(\'above\',this)"/> <input type="text" onchange="questionaire.tag_rule_editor.update_rule(\'abovePercent\',this)" value="'+questionaire.data.dooit.tag_rules.rules[r].abovePercent+'" style="width:30px;display:'+(questionaire.data.dooit.tag_rules.rules[r].above?'inline':'none')+'"  />%</span>';
			ins+='&nbsp;&nbsp;<span>Below: <input type="checkbox" '+(questionaire.data.dooit.tag_rules.rules[r].below?' checked':'')+' onchange="questionaire.tag_rule_editor.update_rule(\'below\',this)"/> <input type="text" onchange="questionaire.tag_rule_editor.update_rule(\'belowPercent\',this)" value="'+questionaire.data.dooit.tag_rules.rules[r].belowPercent+'" style="width:30px;display:'+(questionaire.data.dooit.tag_rules.rules[r].below?'inline':'none')+'" />%</span>';
			$(rule).html(ins);
			return rule;
		},
		update_rule:function(t,o) {
			var i=$(questionaire.parent_of_class(o,'rule_item')).prevAll('.rule_item').get().length;
			if (t=="highest" || t=="lowest" || t=="unique" || t=="compare" || t=="above" || t=="below" || t=="unset") {
				questionaire.data.dooit.tag_rules.rules[i][t]=o.checked;
				if ( t=="above" || t=="below" ) $(o).next('input').css({display:(o.checked?"inline":"none")});
			}else if(t=="abovePercent" || t=="belowPercent"){
				var v=$(o).val();
				if (isNaN(v)) v=50;
				if(v<0) v=0;
				if(v>100) v=0;
				questionaire.data.dooit.tag_rules.rules[i][t]=v;
			}else{
				questionaire.data.dooit.tag_rules.rules[i][t]=$(o).val();
			}
		},
		remove_rule:function(o) {
			var i=$(o.parentNode).prevAll('.rule_item').get().length;
			questionaire.data.dooit.tag_rules.rules.splice(i,1);
			$(o.parentNode).slideUp(500,function() {$(this).remove();});
		},
		add_rule:function() {
			questionaire.data.dooit.tag_rules.rules.push(this.empty_rule());
			var item=this.rule_item(questionaire.data.dooit.tag_rules.rules.length-1);
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
			multiplier:function(v) {
				if (v==undefined || isNaN(v) || v<1) v=1;
				var ins="<nobr> x<span>"+v+"</span><button type='button' class='default' onclick='questionaire.setMultiplier(this,-1)'>-</button><button class='default' type='button' onclick='questionaire.setMultiplier(this,1)'>+</button></nobr>";
				return ins;
			},
			checkbox:{
				selector:function(val,attrs) {
					var ins="<select onchange='questionaire.change(\"score\",this);"+attrs+"'>";
					ins+="<option value='none'>none</option>";
					for(var k=0;k<questionaire.score_system.range.length;k++) {
						var s=questionaire.score_system.range[k];
						ins+="<option value='"+s+"'"+((s==val)?" selected='selected'":"")+">"+s+"</option>";
					}
					ins+="</select>";
					return ins;
				}
			},
			radio:{
				selector:function(val,attrs) {
					var ins="<select onchange='questionaire.change(\"score\",this);"+attrs+"'>";
					ins+="<option value='none'>none</option>";
					for(var k=0;k<questionaire.score_system.range.length;k++) {
						var s=questionaire.score_system.range[k];
						ins+="<option value='"+s+"'"+((s==val)?" selected='selected'":"")+">"+s+"</option>";
					}
					ins+="</select>";
					return ins;
				}
			},
			select:{
				selector:function(val,attrs) {
					var ins="<select onchange='questionaire.change(\"score\",this);"+attrs+"'>";
					ins+="<option value='none'>none</option>";
					for(var k=0;k<questionaire.score_system.range.length;k++) {
						var s=questionaire.score_system.range[k];
						ins+="<option value='"+s+"'"+((s==val)?" selected='selected'":"")+">"+s+"</option>";
					}
					ins+="</select>";
					return ins;
				}
			},
			slider:{
				selector:function(val,attrs) {
					var ins="<select onchange='questionaire.change(\"score\",this);"+attrs+"'>";
					ins+="<option value='none'>none</option>";
					for(var a=0;a<questionaire.score_system.range.length;a++) {
						ins+="<option value='"+questionaire.score_system.range[a]+"' "+((val==questionaire.score_system.range[a])?" selected='selected'":"")+">"+questionaire.score_system.range[a]+"</option>";
					}
					var l=questionaire.score_system.range[0];
					var r=questionaire.score_system.range[questionaire.score_system.range.length-1];
					ins+="<option value='MinToMax' "+((val=='MinToMax')?" selected='selected'":"")+">"+l+" to "+r+"</option>";
					ins+="<option value='MaxToMin' "+((val=='MaxToMin')?" selected='selected'":"")+">"+r+" to "+l+"</option>";
					ins+="</select>";
					return ins;
				}
			},
			buttons:{
				selector:function(val,attrs) {
					var ins="<select onchange='questionaire.change(\"score\",this);"+attrs+"'>";
					ins+="<option value='none'>none</option>";
					for(var k=0;k<questionaire.score_system.range.length;k++) {
						var s=questionaire.score_system.range[k];
						ins+="<option value='"+s+"'"+((s==val)?" selected='selected'":"")+">"+s+"</option>";
					}
					ins+="</select>";
					return ins;
				}
			},
			images:{
				selector:function(val,attrs) {
					var ins="<select onchange='questionaire.change(\"score\",this);"+attrs+"'>";
					ins+="<option value='none'>none</option>";
					for(var k=0;k<questionaire.score_system.range.length;k++) {
						var s=questionaire.score_system.range[k];
						ins+="<option value='"+s+"'"+((s==val)?" selected='selected'":"")+">"+s+"</option>";
					}
					ins+="</select>";
					return ins;
				}
			},
			textMatch:{
				selector:function(val,attrs) {
					var ins="<select onchange='questionaire.setTextMatchScore(this);"+attrs+"'>";
					ins+="<option value='none'>none</option>";
					for(var k=0;k<questionaire.score_system.range.length;k++) {
						var s=questionaire.score_system.range[k];
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
			multiplier:function(v) {
				if (v==undefined || isNaN(v) || v<1) v=1;
				var ins="<nobr> x<span>"+v+"</span><button type='button' class='default' onclick='questionaire.setMultiplier(this,-1)'>-</button><button type='button' class='default' onclick='questionaire.setMultiplier(this,1)'>+</button></nobr>";
				return ins;
			},
			checkbox:{
				selector:function(val,attrs) {
					var ins="<select onchange='questionaire.change(\"score\",this);"+attrs+"'>";
					ins+="<option value='none'>none</option>";
					for(var k=0;k<questionaire.score_system.range.length;k++) {
						var s=questionaire.score_system.range[k];
						ins+="<option value='"+s+"'"+((s==val)?" selected='selected'":"")+">"+s+"</option>";
					}
					ins+="</select>";
					return ins;
				}
			},
			radio:{
				selector:function(val,attrs) {
					var ins="<select onchange='questionaire.change(\"score\",this);"+attrs+"'>";
					ins+="<option value='none'>none</option>";
					for(var k=0;k<questionaire.score_system.range.length;k++) {
						var s=questionaire.score_system.range[k];
						ins+="<option value='"+s+"'"+((s==val)?" selected='selected'":"")+">"+s+"</option>";
					}
					ins+="</select>";
					return ins;
				}
			},
			select:{
				selector:function(val,attrs) {
					var ins="<select onchange='questionaire.change(\"score\",this);"+attrs+"'>";
					ins+="<option value='none'>none</option>";
					for(var k=0;k<questionaire.score_system.range.length;k++) {
						var s=questionaire.score_system.range[k];
						ins+="<option value='"+s+"'"+((s==val)?" selected='selected'":"")+">"+s+"</option>";
					}
					ins+="</select>";
					return ins;
				}
			},
			buttons:{
				selector:function(val,attrs) {
					var ins="<select onchange='questionaire.change(\"score\",this);"+attrs+"'>";
					ins+="<option value='none'>none</option>";
					for(var k=0;k<questionaire.score_system.range.length;k++) {
						var s=questionaire.score_system.range[k];
						ins+="<option value='"+s+"'"+((s==val)?" selected='selected'":"")+">"+s+"</option>";
					}
					ins+="</select>";
					return ins;
				}
			},
			images:{
				selector:function(val,attrs) {
					var ins="<select onchange='questionaire.change(\"score\",this);"+attrs+"'>";
					ins+="<option value='none'>none</option>";
					for(var k=0;k<questionaire.score_system.range.length;k++) {
						var s=questionaire.score_system.range[k];
						ins+="<option value='"+s+"'"+((s==val)?" selected='selected'":"")+">"+s+"</option>";
					}
					ins+="</select>";
					return ins;
				}
			},
			slider:{
				selector:function(val,attrs) {
					var ins="<select onchange='questionaire.change(\"score\",this);"+attrs+"'>";
					ins+="<option value='none'>none</option>";
					for(var a=0;a<questionaire.score_system.range.length;a++) {
						ins+="<option value='"+questionaire.score_system.range[a]+"' "+((val==questionaire.score_system.range[a])?" selected='selected'":"")+">"+questionaire.score_system.range[a]+"</option>";
					}
					var l=questionaire.score_system.range[0];
					var r=questionaire.score_system.range[questionaire.score_system.range.length-1];
					ins+="<option value='MinToMax' "+((val=='MinToMax')?" selected='selected'":"")+">"+l+" to "+r+"</option>";
					ins+="<option value='MaxToMin' "+((val=='MaxToMin')?" selected='selected'":"")+">"+r+" to "+l+"</option>";
					ins+="</select>";
					return ins;
				}
			},
			textMatch:{
				selector:function(val,attrs) {
					var ins="<select onchange='questionaire.setTextMatchScore(this);"+attrs+"'>";
					ins+="<option value='none'>none</option>";
					for(var k=0;k<questionaire.score_system.range.length;k++) {
						var s=questionaire.score_system.range[k];
						ins+="<option value='"+s+"'"+((s==val)?" selected='selected'":"")+">"+s+"</option>";
					}
					ins+="</select>";
					return ins;
				}
			}
		},
		multi_balloons:{
			title:'Upto 6 Balloons',
			range:['red','amber','green','purple','yellow','blue','option7','option8','option9','option10','option11','option12','option13','option14','option15','option16','option17','option18','option19','option20'],
			fullrange:['red','amber','green','purple','yellow','blue','option7','option8','option9','option10','option11','option12','option13','option14','option15','option16','option17','option18','option19','option20'],
			display:true,
			options:{
				count:6,
				display:true
			},
			saveOptions:function() {
				questionaire.data.dooit.score_options=$.extend(true,{},questionaire.score_system.options);
				questionaire.score_system.range=[];
				for(var i=0;i<questionaire.score_system.options.count;i++) {
					questionaire.score_system.range.push(questionaire.score_system.fullrange[i]);
				}
			},
			optionsDisplay:function(){
				var ins='<div class="info"><label>How many colours? </label><select onchange="questionaire.score_system.options.count=parseInt($(this).val());questionaire.score_system.saveOptions();questionaire.render();">';
				for(var k=1;k<=questionaire.score_system.fullrange.length;k++) {
					ins+="<option"+((questionaire.score_system.options.count==k)?' selected':'')+">"+k+"</option>";
				}
				ins+="</select></div>";
				ins+='<div class="info" title="More than 6 will not display anyway"><label>Display? </label><input type="checkbox" '+(questionaire.score_system.options.display?'checked':'')+' onchange="questionaire.score_system.options.display=!questionaire.score_system.options.display;questionaire.score_system.saveOptions();"/>';
				ins+="</select></div>";
				return ins;
			},
			multiplier:function(v) {
				if (v==undefined || isNaN(v) || v<1) v=1;
				var ins="<nobr> x<span>"+v+"</span><button type='button' class='default' onclick='questionaire.setMultiplier(this,-1)'>-</button><button type='button' class='default' onclick='questionaire.setMultiplier(this,1)'>+</button></nobr>";
				return ins;
			},
			checkbox:{
				selector:function(val,attrs) {
					var ins="<select onchange='questionaire.change(\"score\",this);"+attrs+"'>";
					ins+="<option value='none'>none</option>";
					for(var k=0;k<questionaire.score_system.range.length;k++) {
						var s=questionaire.score_system.range[k];
						ins+="<option value='"+s+"'"+((s==val)?" selected='selected'":"")+">"+s+"</option>";
					}
					ins+="</select>";
					return ins;
				}
			},
			radio:{
				selector:function(val,attrs) {
					var ins="<select onchange='questionaire.change(\"score\",this);"+attrs+"'>";
					ins+="<option value='none'>none</option>";
					for(var k=0;k<questionaire.score_system.range.length;k++) {
						var s=questionaire.score_system.range[k];
						ins+="<option value='"+s+"'"+((s==val)?" selected='selected'":"")+">"+s+"</option>";
					}
					ins+="</select>";
					return ins;
				}
			},
			select:{
				selector:function(val,attrs) {
					var ins="<select onchange='questionaire.change(\"score\",this);"+attrs+"'>";
					ins+="<option value='none'>none</option>";
					for(var k=0;k<questionaire.score_system.range.length;k++) {
						var s=questionaire.score_system.range[k];
						ins+="<option value='"+s+"'"+((s==val)?" selected='selected'":"")+">"+s+"</option>";
					}
					ins+="</select>";
					return ins;
				}
			},
			slider:{
				selector:function(val,attrs) {
					var ins="<select onchange='questionaire.change(\"score\",this);"+attrs+"'>";
					ins+="<option value='none'>none</option>";
					for(var a=0;a<questionaire.score_system.range.length;a++) {
						ins+="<option value='"+questionaire.score_system.range[a]+"' "+((val==questionaire.score_system.range[a])?" selected='selected'":"")+">"+questionaire.score_system.range[a]+"</option>";
					}
					var l=questionaire.score_system.range[0];
					var r=questionaire.score_system.range[questionaire.score_system.range.length-1];
					ins+="<option value='MinToMax' "+((val=='MinToMax')?" selected='selected'":"")+">"+l+" to "+r+"</option>";
					ins+="<option value='MaxToMin' "+((val=='MaxToMin')?" selected='selected'":"")+">"+r+" to "+l+"</option>";
					ins+="</select>";
					return ins;
				}
			},
			buttons:{
				selector:function(val,attrs) {
					var ins="<select onchange='questionaire.change(\"score\",this);"+attrs+"'>";
					ins+="<option value='none'>none</option>";
					for(var k=0;k<questionaire.score_system.range.length;k++) {
						var s=questionaire.score_system.range[k];
						ins+="<option value='"+s+"'"+((s==val)?" selected='selected'":"")+">"+s+"</option>";
					}
					ins+="</select>";
					return ins;
				}
			},

			images:{
				selector:function(val,attrs) {
					var ins="<select onchange='questionaire.change(\"score\",this);"+attrs+"'>";
					ins+="<option value='none'>none</option>";
					for(var k=0;k<questionaire.score_system.range.length;k++) {
						var s=questionaire.score_system.range[k];
						ins+="<option value='"+s+"'"+((s==val)?" selected='selected'":"")+">"+s+"</option>";
					}
					ins+="</select>";
					return ins;
				}
			},
			textMatch:{
				selector:function(val,attrs) {
					var ins="<select onchange='questionaire.setTextMatchScore(this);"+attrs+"'>";
					ins+="<option value='none'>none</option>";
					for(var k=0;k<questionaire.score_system.range.length;k++) {
						var s=questionaire.score_system.range[k];
						ins+="<option value='"+s+"'"+((s==val)?" selected='selected'":"")+">"+s+"</option>";
					}
					ins+="</select>";
					return ins;
				}
			}
		}
	}
};
