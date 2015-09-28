
var objectName={
		responses:'KLOE Responses',
		evidence:'KLOE evidence',
		actionPlans:'KLOE action plans',
		status:'KLOE Status',
		responsibility:'KLOE responsibility',
		keyQuestions:'KLOE Key Questions',
		businessSector:'KLOE Business sector',
		keyLines:'KLOE Key Lines of Enquiry',
		keyQuestionLines:'KLOE Key Question Lines of Enquiry',
		subSections:'KLOE Prompts',
		voiceOvers:'KLOE Voiceovers',
		displayInformation:'KLOE Key Question Display Information'
};

var kloe={
	containers:{
		main:null,
		options:null,
		structure:null,
		preview:null
	},
	//layout:"{\ndependencies:[\n['dooits/kloe.js',false],\n['css/kloe.css',false]\n],\nloaded:function(){\nkloe.init({});\n},\nsaveValues:['kloe.output'],\ndisplayed:'kloe.displayed',\nfinished:'kloe.finishable',\norientation:'auto',\noptions:{}\n}",
	layout:"{\ndependencies:[\n\n['dooits/compliance/kloe_response.js',true],\n['dooits/compliance/kloe.js',true],\n['css/compliance/kloe.css',true]\n],\nloaded:function(){\nkloe.init({});\n},\nsaveValues:['kloe.output'],\ndisplayed:'kloe.displayed',\nfinished:'kloe.finishable',\norientation:'auto',\noptions:{}\n}",
	value:{
	},
	selections:{
		audio:[],
		status:[],
		sections:[]
	},
	selectors:{
		audio:[],
		status:[],
		sections:[]
	},
	objects:[
		objectName.keyQuestions,
		objectName.businessSector,
		objectName.keyLines,
		objectName.keyQuestionLines,
		objectName.subSections
	],
	outputObject:[objectName.responses,objectName.actionPlans,objectName.evidence],
	removeSelection:function(type,obj) {
		for(var i=kloe.selections[type].length-1;i>=0;i--) {
			if (kloe.selections[type][i]===obj) kloe.selections[type].splice(i,1);
		}
		for(var i=0;i<kloe.selectors[type].length;i++) {
			if (kloe.selectors[type][i].update!==undefined) kloe.selectors[type][i].update();
		}
	},
	updateSelectors:function(type) {
		for(var i=0;i<kloe.selectors[type].length;i++) {
			if (kloe.selectors[type][i].update!==undefined) kloe.selectors[type][i].update();
		}

	},
	schema:{
		main:{
			title:{label:'KLOE title',initial:'',type:'text',description:'Title of this KLOE doo-it.'},
			introduction:{label:'Introduction text',initial:'',type:'textarea',description:'The explanatory text.'},
			expiryWarningDays:{label:'Expiry warning',initial:7,type:'integer',description:'The number of days before the expiry, for the record to be highlighted.'},
			help:{label:'Help text',initial:'',type:'textarea',description:'The help text shown on clicking i.'},
			helpVoice:{label:'Sound file',initial:'',type:'audio',description:'The sound file to accompany the help text.',affectButton:false,required:false,script:'help'},
			displayInformation:{label:'Display Information',initial:'',type:'object',object:objectName.displayInformation,description:'Select the Display Information record',required:true},
			businessSector:{label:objectName.businessSector,initial:'',type:'object',object:objectName.businessSector,description:'Select the Business sector',required:true},
			keyQuestion:{label:'Key Question',initial:'',type:'object',object:objectName.keyQuestions,description:'Select the key question',required:true},
			suggestedRecordsCount:{label:'The suggested record count',initial:'xlbzu',type:'objectparameter',object:objectName.subSections,description:'The suggested record count is overridden by the value in this parameter.'},
			inheritField:{label:'The FIELD that Ids the inherited response',initial:'yyzho',type:'objectparameter',object:objectName.responses,description:'The field that links to an inherited response.'},
			editableField:{label:'The FIELD that defines the editable level when inherited',initial:'znjjl',type:'objectparameter',object:objectName.responses,description:'The field that set the editable level when inherited.'},
			//inheritancePlansField:{label:'The FIELD that defines action plan inheritance',initial:'llvoe',type:'objectparameter',object:objectName.responses,description:'The field that allows Action Plan inheritance.'},
			//inheritanceEvidenceField:{label:'The FIELD that defines evidence inheritance',initial:'idssk',type:'objectparameter',object:objectName.responses,description:'The field that allows Evidence inheritance.'},
			displayField:{label:'Truncated display text of the achieving field',initial:'sqgjb',type:'objectparameter',parameterType:'text',object:objectName.responses,description:'Select the field to save the answer to "How are you achieving this?"',required:true},
			textField:{label:'How are you achieving this FIELD',initial:'znajr',type:'objectparameter',parameterType:'complex',object:objectName.responses,description:'Select the field to save the answer to "How are you achieving this?"',required:true},
			expiresField:{label:'When must this be completed FIELD',initial:'ohrwc',type:'objectparameter',object:objectName.responses,description:'Select the field to save the answer to "When must this be completed?"',required:true},
			statusField:{label:'Status FIELD',initial:'rjhub',type:'objectparameter',object:objectName.responses,description:'Select the field to save the answer to "Status?"',required:true},
			evidenceCountField:{label:'Evidence Count FIELD',initial:'glqfo',type:'objectparameter',object:objectName.responses,description:'Select the field that records the number of evidence records',required:true},
			actionPlanCountField:{label:'Action Plan Count FIELD',initial:'hwlle',type:'objectparameter',object:objectName.responses,description:'Select the field that records the number of action plan records',required:true},
			evidenceField:{label:'Your evidence FIELD',initial:'vtyxa',type:'objectparameter',parameterType:'complex',object:objectName.evidence,description:'Select the field to save the answer to "Your supporting file?"',required:true},
			docField:{label:'What is your evidence FIELD',initial:'ripkx',type:'objectparameterjson',parameter:'evidenceField',object:objectName.evidence,description:'Select the field to save the answer to "What is your evidence?"',required:true},
			evidenceDisplayField:{label:'What is your evidence summary FIELD',initial:'vfsye',type:'objectparameter',parameterType:'text',object:objectName.evidence,description:'Select the field to save the answer to "Your supporting file?"',required:true},
			docTypeField:{label:'Where is your evidence kept FIELD',initial:'fljpz',type:'objectparameterjson',parameter:'evidenceField',object:objectName.evidence,description:'Select the field to save the answer to "Where is your evidence kept?"',required:true},
			actionPlanField:{label:'Your Action Plan FIELD',initial:'jzowf',type:'objectparameter',parameterType:'complex',object:objectName.actionPlans,description:'Select the field to save the answer to "Your supporting file?"',required:true},
			actionDisplayField:{label:'What is your action plan summary FIELD',initial:'stsbn',type:'objectparameter',parameterType:'text',object:objectName.actionPlans,description:'Select the field to save the answer to "Your supporting file?"',required:true},
			//fileField:{label:'Your supporting file FIELD',initial:'',type:'objectparameter',object:objectName.evidence,description:'Select the field to save the answer to "Your supporting file?"',required:true},
			//actionPlanField:{label:'Action plan FIELD',initial:'',type:'objectparameter',object:objectName.responses,description:'Select the field to save the answer to "Action plan?"',required:true},
			notmetField:{label:'Action plan "not met" FIELD',initial:'idqdq',type:'objectparameterjson',object:objectName.actionPlans,parameter:'actionPlanField',description:'Select the field to save the answer to "How is the Action plan not met?"',required:true},
			planField:{label:'Action plan "plan for action" FIELD',initial:'kqnom',type:'objectparameterjson',object:objectName.actionPlans,parameter:'actionPlanField',description:'Select the field to save the answer to "What is the plan for action?"',required:true},
			ensureField:{label:'Action plan "how will you ensure" FIELD',initial:'habov',type:'objectparameterjson',object:objectName.actionPlans,parameter:'actionPlanField',description:'Select the field to save the answer to "How will you ensure improvements?"',required:true},
			resourcesField:{label:'Action plan "what resources" FIELD',initial:'sgwen',type:'objectparameterjson',object:objectName.actionPlans,parameter:'actionPlanField',description:'Select the field to save the answer to "What resources are needed?"',required:true},
			affectField:{label:'Action plan "affect customers" FIELD',initial:'kaifp',type:'objectparameterjson',object:objectName.actionPlans,parameter:'actionPlanField',description:'Select the field to save the answer to "How will servie users be affected?"',required:true},
			responsibleField:{label:'Who is responsible for the action FIELD',initial:'zwhln',type:'objectparameter',object:objectName.actionPlans,description:'Select the field to save the answer to "Who is responsible for the action?"',required:true},
			managerField:{label:'Who\'s responsible for ensuring this FIELD',initial:'rpawr',type:'objectparameter',object:objectName.actionPlans,description:'Select the field to save the answer to "Who\'s responsible for ensuring this?"',required:true},
			sections:{label:'Sections',initial:[],type:'section',description:'section',required:true,className:'pages',sortable:true,deletable:true,titleBarColour:'#2d75d8',itemBarColour:'#3c71ba'},
			level1Voice:{label:'Guidance level 1 voiceover',initial:'',type:'audio',description:'The voiceover for the top level.',affectButton:false,required:false},
			level2Voice:{label:'Guidance level 2 voiceover',initial:'',type:'audio',description:'The voiceover for the second level.',affectButton:false,required:false},
			level3Voice:{label:'Guidance level 3 voiceover',initial:'',type:'audio',description:'The voiceover for the third level.',affectButton:false,required:false},
			level4Voice:{label:'Guidance level 4 voiceover',initial:'',type:'audio',description:'The voiceover for the bottom level.',affectButton:false,required:false},
			voiceovers:{label:'Voiceovers',initial:'',type:'object',object:objectName.voiceOvers,description:'Select the voiceover spec',required:true}
		},
		section:{
			elementType:{className:'sectionForm',selection:'sections'},
			title:{label:'Section title',initial:'Untitled section',type:'text',description:'The text to display as the section title.',updateTitle:true,updateParent:true},
			keyLine:{label:'Key Line of Enquiry',initial:'',type:'object',object:objectName.keyQuestionLines,description:'Select the Key Line of Enquiry',required:true},
			shortDescription:{label:'Short description',initial:'',type:'textarea',description:'The explanatory text displayed within the button.'},
			helpAction:{label:'Help action',initial:'',type:'textarea',description:'Javascript run when ? is clicked.'},
			//kloeSection:{label:'KLOE section',initial:'',type:'object',object:objectName.keyLines,description:'Select the KLOE section',required:true},
			items:{label:'Prompts',initial:[],type:'item',description:'The item definitions.',required:true,sortable:true,deletable:true,titleBarColour:'#995500',itemBarColour:'#995500'}
		},
		item:{
			elementType:{className:'itemForm'},
			id:{uniqueId:true,type:'hidden'},
			title:{label:'Title',initial:'Prompt',type:'text',description:'The name for this prompt.',updateTitle:true,updateParent:true},
			kloeSubSection:{label:'KLOE prompt',initial:'',type:'object',object:objectName.subSections,description:'Select the KLOE prompt',required:true},
			shortDescription:{label:'Short description',initial:'',type:'textarea',description:'The explanatory text.',updateRecord:{object:objectName.subSections,id:'kloeSubSection',fields:['zgsux','asccj']}},
			description:{label:'Description',initial:'',type:'textarea',description:'The long explanatory text.',updateRecord:{object:objectName.subSections,id:'kloeSubSection',fields:['zgsux','xikvk']}},
			help:{label:'Help text',initial:'',type:'textarea',description:'The help text shown on clicking i.',updateRecord:{object:objectName.subSections,id:'kloeSubSection',fields:['zgsux','ezvuw']}},
			helpVoice:{label:'Sound file',initial:'',type:'audio',description:'The sound file to accompany the help text.',affectButton:false,required:false,script:'help'},
			textPlaceholder:{label:'Text label',initial:'How are you achieving this?',type:'text',description:'The label for the prompt text.',updateRecord:{object:objectName.subSections,id:'kloeSubSection',fields:['zgsux','lowlk']}},
			docPlaceholder:{label:'Document label',initial:'What is your evidence?',type:'text',description:'The label for the evidence document.',updateRecord:{object:objectName.subSections,id:'kloeSubSection',fields:['zgsux','cqriw']}},
			docTypePlaceholder:{label:'Document type label',initial:'Where is your evidence kept?',type:'text',description:'The label for the evidence document type.',updateRecord:{object:objectName.subSections,id:'kloeSubSection',fields:['zgsux','pgxmk']}},
			fileEmptyPlaceholder:{label:'File empty label',initial:'Select a supporting file...',type:'text',description:'The placeholder for the evidence file.',updateRecord:{object:objectName.subSections,id:'kloeSubSection',fields:['zgsux','iqobi']}},
			filePlaceholder:{label:'File label',initial:'Your supporting file...',type:'text',description:'The label for the evidence file.'},
			expiresPlaceholder:{label:'Expiry label',initial:'When must this be completed?',type:'text',description:'The label for the expiry input.',updateRecord:{object:objectName.subSections,id:'kloeSubSection',fields:['zgsux','cdkna']}},
			statusPlaceholder:{label:'Status label',initial:'Status',type:'text',description:'The label for the status selector.',updateRecord:{object:objectName.subSections,id:'kloeSubSection',fields:['zgsux','ulaff']}},
			defaultExpiryDays:{label:'Default days from complete',initial:0,type:'integer',description:'The default number of days the review date is set to.',updateRecord:{object:objectName.subSections,id:'kloeSubSection',fields:['zgsux','ccjxl']}},
			defaultExpiryMonths:{label:'Default months from complete',initial:0,type:'integer',description:'The default number of months the review date is set to.',updateRecord:{object:objectName.subSections,id:'kloeSubSection',fields:['zgsux','dbqhp']}},
			defaultExpiryYears:{label:'Default years from complete',initial:1,type:'integer',description:'The default number of years the review date is set to.',updateRecord:{object:objectName.subSections,id:'kloeSubSection',fields:['zgsux','sibbg']}},
			suggestedRecordsCount:{label:'Suggested number of records',initial:3,type:'integer',description:'The score is calculated to requiring at least this number of records.',updateRecord:{object:objectName.subSections,id:'kloeSubSection',fields:['xlbzu']}},
			notMetPlaceholder:{label:'Not met label',initial:'How is this not met?',type:'text',description:'The label for the not met input.',updateRecord:{object:objectName.subSections,id:'kloeSubSection',fields:['zgsux','owwor']}},
			actionplanPlaceholder:{label:'Action plan label',initial:'The action you\'re going to take to meet the requirements.',type:'text',description:'The label for the action plan input.',updateRecord:{object:objectName.subSections,id:'kloeSubSection',fields:['zgsux','ustuv']}},
			responsiblePlaceholder:{label:'Responsibility label',initial:'Who is responsible for the action?',type:'text',description:'The label for the responsibility input.',updateRecord:{object:objectName.subSections,id:'kloeSubSection',fields:['zgsux','ofenc']}},
			measuresPlaceholder:{label:'What measures label',initial:'How will you ensure improvements are made and are sustainable?',type:'text',description:'The label for the what measures input.',updateRecord:{object:objectName.subSections,id:'kloeSubSection',fields:['zgsux','kmpgx']}},
			managePlaceholder:{label:'Responsibility manager label',initial:'Who\'s responsible for ensuring this?',type:'text',description:'The label for the responsibility management input.',updateRecord:{object:objectName.subSections,id:'kloeSubSection',fields:['zgsux','eqmls']}},
			sourcesPlaceholder:{label:'Sources label',initial:'What sources are needed to implement these changes?',type:'text',description:'The label for the sources input.',updateRecord:{object:objectName.subSections,id:'kloeSubSection',fields:['zgsux','tmdor']}},
			affectedPlaceholder:{label:'Affected label',initial:'How will service users be affected if you miss the completion date?',type:'text',description:'The label for the affected input.',updateRecord:{object:objectName.subSections,id:'kloeSubSection',fields:['zgsux','hroxo']}}
		}
	},
	ids:{},
	savelocal:function() {
		localStorage[this.autosaveKey]=JSON.stringify(this.values());
	},
	init2:function() {
		var me=this;
		if (this.objects.length>0) {
			object.get(this.objects,function() {
			//console.log(object.objects[6].records.length);
				//me.init2();
				me.postinit();
			},function(err){
				console.log("Error",err);
			},true);
		}else{
			this.postinit();
		}
	},
	init:function() {
		var me=this;
		if (this.outputObject!==undefined) {
			object.get(this.outputObject,function() {
			//console.log(object.objects[6].records.length);
				me.init2();
			},function(){});
		}else{
			this.init2();
		}

	},
	postinit:function() {
		this.autosaveKey='globalFieldId'+$('input[name=globalFieldId]').val();
		this.autosave=typeof(localStorage)!="undefined";


		$('form#sf_admin_edit_form').submit(function(e) {
			return kloe.save(e);
		});
		this.containers.main=$('.exerciseTemplate').get(0);
		$(this.ancester(this.containers.main,'form-row')).css({overflow:"visible"});
		var val=$('#globalFieldContent').val();
		var base64encoded=val;
		val=Base64.decode(val);
		/*try{
			eval('kloe.value='+val+';');
		}catch(e) {}*/
		try{
		if (this.autosave) {
			if (localStorage[this.autosaveKey]!==undefined && localStorage[this.autosaveKey]!="" && localStorage[this.autosaveKey]!=val && localStorage[this.autosaveKey]!=base64encoded) {
				//console.log(localStorage[this.autosaveKey],val);
				if (window.confirm("Recover autosave data?")) {
					val=localStorage[this.autosaveKey];
					$('textarea#globalFieldContent').val(val);
					localStorage[this.autosaveKey]='';
					kloe.init();
					return false;
				}
			}
		}
			kloe.value=$.parseJSON(val);
		}catch(e) {
			//if (val!="") console.log("Failed to parse:",val);
		}
		if (kloe.value.rememberedAudio!==undefined) this.selections.audio=this.value.rememberedAudio;
		this.build();
		this.adminbar();
		this.render();
	},
	build:function() {
		$(this.containers.main).html("<h2>KLOE Construction</h2>");
		var main=document.createElement("div");
		this.containers.main.appendChild(main);
		this.elements=this.buildElements(this.value,this.schema.main,null);

	},
	ancester:function(o,c) {
		if ($(o).hasClass(c)) return o;
		if (o==document.body) return false;
		if (!o.parentNode) return false;
		return kloe.ancester(o.parentNode,c);
	},
	render:function() {
		for(var k in this.elements) {
			$(this.containers.main).append(this.elements[k].render());
		}
	},
	buildElements:function(v,o,p) {
		var objs={};
		for(var t in o) {
			if (o[t]!==undefined && o[t].type!==undefined) {
				objs[t]=null;
				var thisValue=null;
				if (v!==undefined && v!==null && v[t]!==undefined) thisValue=v[t];
				if (typeof(o[t].initial)=='object' && typeof(o[t].initial.length)=='number') {
					objs[t]=new this.extensible(thisValue,o[t],p);
				}else{
					if (this.object[o[t].type]!==undefined) {
						objs[t]=new this.object[o[t].type](thisValue,o[t],p);
					}
				}
			}else if (t=='elementType'){
				//console.log(o[t]);
			}
		}
		return objs;
	},
	extensible:function(v,o,p) {
		this.parent=p;
		this.schema=o;
		this.container=document.createElement("div");
		if (o.className!==undefined) $(this.container).addClass(o.className);
		this.header=document.createElement("div");
		var but=document.createElement("button");
		but.source=this;
		$(but).attr("type","button").html("<div></div>").addClass("addButton").click(function() {this.source.add();});
		if (this.schema.titleBarColour!==undefined) $(this.header).css({background:this.schema.titleBarColour});
		$(this.container).addClass('extensible').append($(this.header).addClass("itemHeader").append(but).append('<span class="headerTitle">'+o.label+"</div>"));
		this.listedSchema={};
		if (kloe.schema[o.type]!==undefined) this.listedSchema=kloe.schema[o.type];
		this.list=[];
		if (v!==null && v.length!==undefined) {
			for(var i=0;i<v.length;i++) this.list.push(new kloe.object[o.type](v[i],this.listedSchema,this));
		}
		this.render=function() {
			for(var i=0;i<this.list.length;i++) {
				$(this.container).append(this.list[i].render());
			}
			this.makeSortable();
			return this.container;
		};
		this.update=function() {
			this.makeSortable();
		};
		this.json=function() {
			var arr=[];
			for(var a=0;a<this.list.length;a++) arr.push(this.list[a].json());
			return arr;
		};
		this.add=function() {
			var obj=new kloe.object[this.schema.type](null,this.listedSchema,this);
			this.list.push(obj);
			var con=obj.render();
			$(this.container).append($(con).hide());
			obj.update();
			$(con).slideDown();
			this.update();
			if (this.schema.updateParent===true) this.parent.update(obj);
		};
		this.output=function() {
			var op=[];
			for(var i=0;i<this.list.length;i++) {
				op.push(this.list[i].output());
			}
			console.log(op);
			return op;
		};
		this.remove=function(obj) {
			var idx=this.index(obj);
			if (idx!==false) {
				this.list.splice(idx,1);
			}
			this.update();
		};
		this.index=function(obj) {
			for(var i=0;i<this.list.length;i++) {
				if (this.list[i]===obj) return i;
			}
			return false;
		};
		this.makeSortable=function() {
			var me=this;
			if (this.schema.sortable===true) {
				$(this.container).sortable({
					containment:this.container,
					items:'>.formItem',
					handle:'.itemHeader>.sortHandle',
					start:function(e,ui) {
						var item=ui.item.context;
						item.startIndex=$(item).prevAll('.formItem').get().length;
					},
					update:function(e,ui) {
						var item=ui.item.context;
						item.stopIndex=$(item).prevAll('.formItem').get().length;
						me.updateOrder(item);
					}
				});
			}
		};
		this.updateOrder=function(a) {
			var items=this.list.splice(a.startIndex,1);
			this.list.splice(a.stopIndex,0,items[0]);
		};
	},
	ids:{},
	uniqueId:function() {
		if (arguments.length>0) {
			this.ids[arguments[0]]=true;
		}else{
			var id=this.randomString();
			while(this.idExists(id)) id=this.randomString();
			return id;
		}
	},
	idExists:function(id) {
		return (typeof(this.ids[id])!="undefined");
	},
	randomString:function() {
		var length=20;
		if (arguments.length>0) length=arguments[0];
		var chars='abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
		var op='';
		while(op.length<length) op+=chars.substr(Math.round(Math.random()*(chars.length-1)),1);
		return op;
	},
	defaultObjectProcess:function(element,schema,value,parent) {
		element.parent=parent;
		element.value=value;
		if ((element.value===undefined || element.value===null) && schema.initial!==undefined) element.value=schema.initial;
		if ((element.value===undefined || element.value===null) && schema.uniqueId===true) element.value=kloe.uniqueId();
		if ((element.value!==undefined && element.value!==null) && schema.uniqueId===true) kloe.uniqueId(element.value);
		element.container=document.createElement("div");
		element.container.source=element;
		$(element.container).addClass("formItem");
		if (schema.description!==undefined) {
			element.description=document.createElement("div");
			$(element.description).addClass("itemDescription").html(schema.description);
			$(element.container).append(element.description);
		}
		if (schema.elementType!==undefined) {
			element.elementType=schema.elementType;
			if (schema.elementType.selection!==undefined) kloe.selections[schema.elementType.selection].push(element);
			if (schema.elementType.className!==undefined) $(element.container).addClass(schema.elementType.className);
		}
		element.elementcontainer=document.createElement("div");
		if (element.parent!==null) {
			if (element.parent.schema.sortable===true || element.parent.schema.deletable===true || element.parent.list!==undefined) {
				element.header=document.createElement("div");

				element.expander=document.createElement("button");
				element.header.source=element.expander.source=element;
				$(element.header).append($(element.expander).attr('type','button').addClass('expandButton').html('<div></div>')).click(function(e) {
					var but=$(this).find('>.expandButton');
					var on=!($(but).hasClass("open"));
					if (on) {
						$(this.source.elementcontainer).slideDown();
						$(but).addClass("open");
					}else{
						$(this.source.elementcontainer).slideUp();
						$(but).removeClass("open");
					}
				});


				if (element.parent.schema.sortable===true) {
					element.handle=document.createElement("div");
					$(element.header).append($(element.handle).html('<div></div>').addClass('sortHandle')).addClass("sortable");
				}


				element.headerTitle=document.createElement("span");
				$(element.header).append($(element.headerTitle).addClass("headerTitle"));
				if (element.parent.schema.deletable===true) {
					element.deleter=document.createElement("button");
					element.deleter.source=element;
					$(element.header).append($(element.deleter).attr('type','button').addClass('deleteButton').html('<div></div>').click(function() {
						this.source.remove();
					}));
					element.remove=function() {
						this.parent.remove(this);
						this.container.source=this;
						if (this.elementType!==undefined && this.elementType.selection!==undefined) kloe.removeSelection(this.elementType.selection,this);
						$(this.container).slideUp(200,function() {
							var me=this.source;
							var p=me.parent;
							if (me.preRemove!==undefined) me.preRemove();
							$(this).remove();
							p.update();
							if (me.postRemove!==undefined) me.postRemove();
						;});
					};
				}
				if (element.parent.schema.itemBarColour!==undefined) $(element.header).css({background:element.parent.schema.itemBarColour});
				$(element.container).append($(element.header).addClass('itemHeader'));
				$(element.elementcontainer).hide();
				if (element.parent.schema.itemBarColour!==undefined) {
					$(element.elementcontainer).css({border:'1px solid '+element.parent.schema.itemBarColour});
				}else{
					$(element.elementcontainer).css({border:'1px solid #999'});
				}
			}
		}
		$(element.container).append($(element.elementcontainer).addClass(""));
		element.schema=schema;
		element.elements=kloe.buildElements(value,schema,element);
		element.render=function() {
			if (this.schema.updateTitle===true) $(this.parent.headerTitle).html(this.value);
			if (this.schema.label!==undefined) {
				var label=document.createElement('label');
				$(this.container).append($(label).html(this.schema.label));
			}
			if (this.preRender!==undefined) this.preRender();
			var hasElement=false;
			for(var k in this.elements) {
				if (this.elements[k]!==null) {
					$(this.elementcontainer).append(this.elements[k].render());
					hasElement=true;
				}
			}
			if (this.schema.updateRecord!==undefined) this.updateRecord();
			if (this.postRender!==undefined) this.postRender();
			//console.log($(this.elementcontainer).html());
			if (this.schema.label===undefined && !hasElement) return null;
			return this.container;
		};
		element.update=function(obj) {
			if (this.elementType!==undefined) {
				if (this.elementType.selection!==undefined) {
					for(var i=0;i<kloe.selectors[this.elementType.selection].length;i++) {
						if (kloe.selectors[this.elementType.selection][i].update!==undefined) kloe.selectors[this.elementType.selection][i].update();
					}
				}
			}
			if (this.schema.updateTitle===true) $(this.parent.headerTitle).html(this.value);
			if (this.preUpdate!==undefined) this.preUpdate(obj);
			if (this.schema.updateParent===true) {
				if (this.parent!==null) this.parent.update(this);
			}
			if (this.postUpdate!==undefined) this.postUpdate(obj);
			kloe.savelocal();
		};
		element.json=function() {
			if (this.schema.elementType===undefined) return this.value;
			var arr={};
			for(var k in this.elements) arr[k]=this.elements[k].json();
			return arr;
		};
		element.updateRecord=function() {
			//console.log(this,this.schema.updateRecord);
			var rid=this.parent.value[this.schema.updateRecord.id];
			if (rid>0) {
			//console.log(this.parent);
				var record=object.objectNames[this.schema.updateRecord.object].recordsCache[rid];
				if (typeof(record)!="undefined") {

					if (record.value[this.schema.updateRecord.fields[0]]===null) {

						if (this.schema.updateRecord.fields.length==1 && this.schema.updateRecord.fields.length!=this.value) console.log("Update",this.schema.updateRecord.fields);

						record.value[this.schema.updateRecord.fields[0]]=(this.schema.updateRecord.fields.length==1)?this.value:{};

					}else if (this.schema.updateRecord.fields.length==1) {
						if (this.value!=record.value[this.schema.updateRecord.fields[0]]) {
		console.log('Revert to',record.value[this.schema.updateRecord.fields[0]]);
							this.value=record.value[this.schema.updateRecord.fields[0]];
						}
					}

					if (this.schema.updateRecord.fields.length>1 && record.value[this.schema.updateRecord.fields[0]][this.schema.updateRecord.fields[1]]===undefined) {

						console.log("Update",this.schema.updateRecord.fields);

						record.value[this.schema.updateRecord.fields[0]][this.schema.updateRecord.fields[1]]=this.value;

					}else if (this.schema.updateRecord.fields.length>1) {
						if (this.value!=record.value[this.schema.updateRecord.fields[0]][this.schema.updateRecord.fields[1]]) {
		console.log('Revert to',record.value[this.schema.updateRecord.fields[0]][this.schema.updateRecord.fields[1]]);
							this.value=record.value[this.schema.updateRecord.fields[0]][this.schema.updateRecord.fields[1]];
						}
					}

					this.input.disabled=true;
				}
			}
			//console.log(record.value);
		};
	},
	object:{
		page:function(v,o,p) {
			this.objectName='page';
			kloe.defaultObjectProcess(this,o,v,p);
			this.postUpdate=function(obj) {
				this.drawPreview();
			};
			this.postRender=function() {
				if (this.previewArea===undefined) {
					this.previewArea=document.createElement("div");
					$(this.elementcontainer).append($(this.previewArea).addClass("pagePreviewArea"));
				}
				if (this.previewTitle===undefined) {
					this.previewTitle=document.createElement("div");
					$(this.previewArea).append($(this.previewTitle).html($('#title').val()).addClass('previewTitle'));
				}
				if (this.preview===undefined) {
					this.preview=document.createElement("div");
					$(this.previewArea).append($(this.preview).addClass("pagePreview"));
				}
				if (this.elements.image.value=='') $(this.elements.spots.container).hide();
				this.drawPreview(true);

			};
			this.drawPreview=function() {
				var firstTime=false;
				if (arguments.length>0) firstTime=arguments[0];
				if (this.previewImage===undefined) {
					this.previewImage=document.createElement("img");
					$(this.preview).append(this.previewImage);
				}
				if (this.elements.image.value!="" && this.elements.image.value!=this.previewImage.src) {
					this.previewImage.src=this.elements.image.value;
					this.previewImage.source=this;
					if (firstTime) {
						$(this.preview).css({width:this.elements.width.value+2});
					}else{
						$(this.previewImage).bind("error",function() {

						}).bind("load",function() {
							$(this.source.preview).animate({width:$(this).width()+2});
							this.source.elements.width.value=$(this).width();
							$(this.source.elements.width.input).html(this.source.elements.width.value);
							this.source.elements.height.value=$(this).height();
							$(this.source.elements.height.input).html(this.source.elements.height.value);
							if ($(this.source.elements.spots.container).css('display')=='none') $(this.source.elements.spots.container).slideDown();
							//console.log($(this).width(),$(this).height());
						});
					}
				}
				//$(this.preview).find('.spot').remove();
				for(var s=0;s<this.elements.spots.list.length;s++) {
					var cont=this.elements.spots.list[s].preview();
					if (this.elements.rollover.value!="") this.elements.spots.list[s].setBackground(this.elements.rollover.value);
					if (cont.parentNode===null) {
						$(this.preview).append(cont);

						$(cont).draggable({
							containment:this.preview,
							stop:function(e,ui) {
								ui.helper[0].source.updatePosition();
							},
							drag:function(e,ui) {
								ui.helper[0].source.placeBackground(ui.position);
							}
						}).bind('mouseenter',function() {
							if ($(this).siblings(".ui-draggable-dragging,.ui-resizing").get().length==0) {
								this.parentNode.appendChild(this);
							}
						});
					}
				}
			};
		},
		section:function(v,o,p) {
			this.objectName='response';

			kloe.defaultObjectProcess(this,o,v,p);
		},
		item:function(v,o,p) {
			this.objectName='response';

			kloe.defaultObjectProcess(this,o,v,p);
		},
		status:function(v,o,p) {
			this.objectName='response';

			kloe.defaultObjectProcess(this,o,v,p);
		},
		response:function(v,o,p) {
			this.objectName='response';

			kloe.defaultObjectProcess(this,o,v,p);
		},
		tags:function(v,o,p) {
			this.objectName='tags';

			kloe.defaultObjectProcess(this,o,v,p);
			this.postUpdate=function(obj){
				var str=this.elements.tag.value;
				if (str=='') {
					str="Not defined";
				}else if (this.elements.remove.value===true) {
					str='Remove '+str;
				}else{
					str='Add '+str;
				}
				$(this.headerTitle).html(str);
			};
		},
		spot:function(v,o,p) {
			this.objectName='spot';

			kloe.defaultObjectProcess(this,o,v,p);
			this.preview=function() {
				if (this.box!==undefined) return this.box;
				this.box=document.createElement("div");
				this.box.source=this;
				$(this.box).addClass("spot").css({
					top:this.elements.top.value,
					left:this.elements.left.value,
					width:this.elements.width.value,
					height:this.elements.height.value
				});
				var inbox=document.createElement("div");
				$(this.box).append(inbox);
				this.titleBox=document.createElement("div");
				$(inbox).append($(this.titleBox).html('<span>'+this.elements.title.value+'</span>').addClass("boxTitle"));
				this.stretch=document.createElement("div");
				this.stretchHandle=document.createElement("div");
				this.stretchHandle.source=this;
				$(inbox).append($(this.stretch).addClass('bottomRight').append($(this.stretchHandle).addClass('stretchHandle')));
				$(this.stretchHandle).draggable({
					start:function(e,ui) {
						var spot=ui.helper[0].source;
						$(spot.box).addClass("ui-resizing");
					},drag:function(e,ui) {
						var x=ui.position.left-ui.originalPosition.left;
						var y=ui.position.top-ui.originalPosition.top;
						var spot=ui.helper[0].source;
						var maxWidth=$(spot.box.parentNode).width()-2-spot.elements.left.value;
						var maxHeight=$(spot.box.parentNode).height()-2-spot.elements.top.value;
						var w=spot.elements.width.value+x;
						var h=spot.elements.height.value+y;
						if (w<20) w=20;
						if (h<20) h=20;
						if (w>maxWidth) w=maxWidth;
						if (h>maxHeight) h=maxHeight;
						$(spot.box).width(w);
						$(spot.box).height(h);
						spot.placeBackground();
					},stop:function(e,ui) {
						var x=ui.position.left-ui.originalPosition.left;
						var y=ui.position.top-ui.originalPosition.top;
						var spot=ui.helper[0].source;
						$(spot.box).removeClass("ui-resizing");
						spot.adjustSize(x,y);
						spot.placeBackground();
						//console.log(ui);
					},revert:true,
					revertDuration:0
				});
				return this.box;
			};
			this.updatePosition=function() {
				//this.elements.top.input.value=
				this.elements.top.value=1*$(this.box).css('top').replace('px','');
				//this.elements.left.input.value=
				this.elements.left.value=1*$(this.box).css('left').replace('px','');
				//this.elements.width.input.value=
				this.elements.width.value=1*$(this.box).width();
				//this.elements.height.input.value=
				this.elements.height.value=1*$(this.box).height();
				this.placeBackground();
			};
			this.adjustSize=function(dx,dy) {
				var maxWidth=$(this.box.parentNode).width()-2-this.elements.left.value;
				var maxHeight=$(this.box.parentNode).height()-2-this.elements.top.value;
				this.elements.width.value+=dx;
				if (this.elements.width.value<20) this.elements.width.value=20;
				if (this.elements.width.value>maxWidth) this.elements.width.value=maxWidth;
				this.elements.height.value+=dy;
				if (this.elements.height.value<20) this.elements.height.value=20;
				if (this.elements.height.value>maxHeight) this.elements.height.value=maxHeight;
				//this.elements.width.input.value=this.elements.width.value;
				//this.elements.height.input.value=this.elements.height.value;
				$(this.box).width(this.elements.width.value);
				$(this.box).height(this.elements.height.value);
			};
			this.setBackground=function() {
				if (arguments.length>0) this.background=arguments[0];
				var src=this.background;
				if (this.elements.rollover.value!==true) src='none';
				$(this.box).css({'background-image':((src=='none')?src:'url('+src+')')});
				this.placeBackground();
			};
			this.placeBackground=function() {
				var pos={left:this.elements.left.value,top:this.elements.top.value};
				if (arguments.length>0) pos=arguments[0];
				if (this.background!==undefined) {
					$(this.box).css({'background-position':'-'+pos.left+'px -'+pos.top+'px'});
				}
			};
			this.postUpdate=function(obj){
				this.setBackground();
				$(this.titleBox).html('<span>'+this.elements.title.value+'</span>');
			};
			this.preRemove=function() {
				$(this.box).remove();
			};
		},
		text:function(v,o,p) {
			this.objectName='text';

			kloe.defaultObjectProcess(this,o,v,p);
			this.preRender=function() {
				this.input=document.createElement("input");
				$(this.input).bind("keydown",function(e) {
					var k=kloe.keyCode(e);
					if (k.enter) e.preventDefault();
				});
				this.input.source=this;
				$(this.input).attr("type","text").val(this.value).bind('keyup change',function() {this.source.value=this.value;this.source.update();});
				$(this.container).append(this.input);
			};
		},
		textarea:function(v,o,p) {
			this.objectName='text';

			kloe.defaultObjectProcess(this,o,v,p);
			this.preRender=function() {
				this.input=document.createElement("textarea");
				/*$(this.input).bind("keydown",function(e) {
					var k=kloe.keyCode(e);
					if (k.enter) e.preventDefault();
				});*/
				this.input.source=this;
				$(this.input).val(this.value).bind('keyup change',function() {this.source.value=this.value;this.source.update();});
				$(this.container).append(this.input);
			};
		},
		integer:function(v,o,p) {
			this.objectName='integer';

			kloe.defaultObjectProcess(this,o,v,p);
			this.preRender=function() {
				this.input=document.createElement("input");
				$(this.input).bind("keydown",function(e) {
					var k=kloe.keyCode(e);
					if (k.enter || !(k.numeric || k.navigate)) e.preventDefault();
				}).css({width:'10%'});
				this.input.source=this;
				$(this.input).attr("type","text").val(this.value).bind('keyup change',function() {this.source.value=this.value;this.source.update();});
				$(this.container).append(this.input);
			};
		},
		span:function(v,o,p) {
			this.objectName='span';

			kloe.defaultObjectProcess(this,o,v,p);
			this.preRender=function() {
				this.input=document.createElement("span");
				this.input.source=this;
				$(this.input).html(this.value);
				$(this.container).append(this.input);
			};
		},
		boolean:function(v,o,p) {
			this.objectName='boolean';

			kloe.defaultObjectProcess(this,o,v,p);
			this.preRender=function() {
				this.input=document.createElement("input");
				$(this.input).attr("type","checkbox");
				if (this.value) this.input.checked=true;
				this.input.source=this;
				$(this.input).bind('change',function() {this.source.value=this.checked;this.source.update();});
				$(this.container).append(this.input);
			};
		},
		hidden:function(v,o,p) {
			this.objectName='hidden';

			kloe.defaultObjectProcess(this,o,v,p);
		},
		colour:function(v,o,p) {
			this.objectName='colour';

			kloe.defaultObjectProcess(this,o,v,p);

			this.preRender=function() {
				this.input=document.createElement("input");
				this.input.type='text';
				this.input.value=this.value;
				this.input.source=this;
				$(this.input).addClass("colour");
				/*$(this.input).bind("change",function() {
					this.source.value=this.value;
					this.source.update();
				});*/
				$(this.container).append(this.input);
				$(this.input).jPicker({images:{clientPath:'/js/jpicker/images/'},window:{liveUpdate:true}},function(colour,context) {
					this.source.value=colour.val().hex;
					this.source.update();
				});
			};
		},
		image:function(v,o,p) {
			this.objectName='image';

			kloe.defaultObjectProcess(this,o,v,p);
			this.preRender=function() {
				this.input=document.createElement("span");
				$(this.input).addClass('imageThumb');
				this.input.source=this;
				if (v!==null && v.length>0) {
					$(this.input).css({'background-image':'url('+v.replace(/(fit|crop)\/\d+\/\d+\//,'crop/80/80/')+')'});
				}else{

				}
				$(this.container).append(this.input);
				var me=this;
				this.input.update=function(me,img) {
					this.source.value=img.source;
					$(this).css({'background-image':'url('+this.source.value.replace(/(fit|crop)\/\d+\/\d+\//,'crop/80/80/')+')'});
					this.source.update();
				};
				$(this.input).click(function() {
					yoodoo.selectImage(this,"dooits",'dooitMinusHeading');
				});
			};
		},
		tag:function(v,o,p) {
			this.objectName='tag';

			kloe.defaultObjectProcess(this,o,v,p);
			this.preRender=function() {
				this.input=document.createElement("select");
				var opt=document.createElement("option");
				opt.value=opt.text='';
				$(this.input).append(opt);
				for(var t=0;t<accessibleTags.length;t++) {
					var opt=document.createElement("option");
					opt.value=opt.text=accessibleTags[t];
					if (opt.value==v) opt.selected=true;
					$(this.input).append(opt);
				}
				this.input.source=this;
				$(this.input).bind("change",function() {
					this.source.value=this.value;
					this.source.update();
				});
				$(this.container).append(this.input);
			};

		},
		select:function(v,o,p) {
			this.objectName='tag';

			kloe.defaultObjectProcess(this,o,v,p);
			this.preRender=function() {
				this.input=document.createElement("select");
				var opt=document.createElement("option");
				opt.value=opt.text='';
				$(this.input).append(opt);
				for(var t=0;t<this.schema.options.length;t++) {
					var opt=document.createElement("option");
					opt.value=opt.text=this.schema.options[t];
					if (opt.value==v) opt.selected=true;
					$(this.input).append(opt);
				}
				this.input.source=this;
				$(this.input).bind("change",function() {
					this.source.value=this.value;
					this.source.update();
				});
				$(this.container).append(this.input);
			};
		},
		audio:function(v,o,p) {
			this.objectName='tag';
			kloe.defaultObjectProcess(this,o,v,p);
			this.preRender=function() {
				this.input=document.createElement("select");
				this.audio=document.createElement("audio");
				$(this.audio).attr("controls","").hide().css({display:'block',margin:'2px auto'});
				this.input.source=this;
				$(this.input).bind("change",function() {
					try{
						eval('this.source.value='+this.value);
					}catch(e) {
						this.source.value=this.value;
					}
					this.source.update();
				});
				$(this.container).append(this.input).append(this.audio);
				this.update();
				kloe.selectors['audio'].push(this);
			};
			this.preUpdate=function() {
				if (this.value.url!="" && this.value.url!==undefined) {
					if (this.audioSource!==undefined && this.audioSource.src!=this.value.url) {
						$(this.audioSource).remove();
						this.audioSource==undefined;
					}
					if (this.audioSource===undefined) {
						$(this.audio).slideDown();
						this.audioSource=document.createElement("source");
						$(this.audio).append(this.audioSource);
					}
					if (/mp3$/.test(this.value)) $(this.audioSource).attr("type","audio/mpeg");
					if (/wav$/.test(this.value)) $(this.audioSource).attr("type","audio/wav");
					if (/ogg$/.test(this.value)) $(this.audioSource).attr("type","audio/ogg");
					$(this.audioSource).attr("src",this.value.url);
				}else{
					$(this.audioSource).remove();
					this.audioSource=undefined;
					$(this.audio).slideUp();
				}
				$(this.input).empty();
				var checked=false;

					var opt=document.createElement("option");
					opt.value='';
					opt.text='';
					$(this.input).append(opt);

				for(var t=0;t<kloe.selections.audio.length;t++) {
					var opt=document.createElement("option");
					opt.value=json.build(kloe.selections.audio[t]);
					opt.text=kloe.selections.audio[t].name;
					if (kloe.selections.audio[t].id==this.value.id) checked=opt.selected=true;
					$(this.input).append(opt);
				}
				if (checked===false) {
					var opt=$(this.input).find("option").get(0);
					this.value=opt.value;
					opt.selected=true;
				}
			};
		},
		object:function(v,o,p){
			this.objectName='object';
			kloe.defaultObjectProcess(this,o,v,p);
			var me=this;
			this.renderSelect=function(obj) {
				if (this.schema.object==objectName.displayInformation) {
					if (this.value=='') {
						//console.log(this.schema.objectType);
						var newRecord=this.schema.objectType.add();
						if (kloe.value.helpVoice=='') kloe.value.helpVoice={name:'',id:null,url:''};
						newRecord.value={
							igxav:{ // Data
								jkkva:kloe.value.introduction, // Introduction
								jukkx:kloe.value.help // Help
							},
							phqhh:parseInt(kloe.value.expiryWarningDays), // Days to expire
							uvyvt:{ // Voiceover
								qvhfv:kloe.value.helpVoice.name, // Name
								dthuz:kloe.value.helpVoice.id, // Id
								ajqdl:kloe.value.helpVoice.url // Url
							},
							xvvse:kloe.schema.main.keyQuestion.objectType.recordsCache[kloe.value.keyQuestion].displayName()+" - "+kloe.schema.main.businessSector.objectType.recordsCache[kloe.value.businessSector].displayName(), // name
							ufwrl:kloe.value.keyQuestion, // key question
							zfyit:kloe.value.businessSector // business sector
						};
						object.save([newRecord],function() {
							me.value=parseInt(newRecord.Id);
						});
						console.log("Created display information: ",newRecord);
					}
				}else if (this.schema.object==objectName.voiceOvers) {
					if (this.value=='') {
						//console.log(this.parent.schema);
						var newRecord=this.schema.objectType.add();
						newRecord.value={
							rqnws:{ // Level 1
								mxxmr:kloe.value.level1Voice.name, // Name
								gpnnp:kloe.value.level1Voice.id, // Id
								kjsst:kloe.value.level1Voice.url // Url
							},
							oybyg:{ // Level 2
								ulwsb:kloe.value.level2Voice.name, // Name
								xfxxo:kloe.value.level2Voice.id, // Id
								lokhc:kloe.value.level2Voice.url // Url
							},
							mdsab:{ // Level 3
								uipza:kloe.value.level3Voice.name, // Name
								bcofn:kloe.value.level3Voice.id, // Id
								rzbpx:kloe.value.level3Voice.url // Url
							},
							amuqf:{ // Level 4
								ratqh:kloe.value.level4Voice.name, // Name
								ozrpt:kloe.value.level4Voice.id, // Id
								gkgph:kloe.value.level4Voice.url // Url
							},
							itdgg:kloe.schema.main.keyQuestion.objectType.recordsCache[kloe.value.keyQuestion].displayName()+" - "+kloe.schema.main.businessSector.objectType.recordsCache[kloe.value.businessSector].displayName(), // name
							amwfq:kloe.value.keyQuestion, // key question
							covco:kloe.value.businessSector // business sector
						};
						object.save([newRecord],function() {
							me.value=parseInt(newRecord.Id);
						});
						console.log("Created Voiceover: ",newRecord);
					}
				}else if (this.schema.object==objectName.keyQuestionLines) {
					if (this.value=='') {
						var newRecord=this.schema.objectType.add();
						newRecord.value={
							dphdn:{
								glfdn:this.parent.value.shortDescription, // description
								ywxsx:this.parent.value.helpAction // help
							}, // data
							ngtye:this.parent.value.title, // name
							vaiqs:kloe.value.keyQuestion, // key question
							vxyvb:kloe.value.businessSector // business sector
						};
						object.save([newRecord],function() {
							me.value=parseInt(newRecord.Id);
						});
						console.log("Created Key Line: "+this.parent.value.title,newRecord);
					}
				}else if (this.parent!==null && kloe.value.businessSector>0 && object.objectNames[objectName.businessSector].recordsCache[kloe.value.businessSector*1]!==undefined) {
					//console.log(this.value);
					if (this.value=='') {
						var fullName=object.objectNames[objectName.businessSector].recordsCache[kloe.value.businessSector*1].displayName()+' '+this.parent.value.title;
						var prompts=object.objectNames[objectName.subSections].recordsCache;
						var id=null;
						for(var p in prompts) {
							if (prompts[p].displayName()==fullName) id=p;
						}
						if (id===null) {
							console.log(this.parent,this.parent.parent.parent.parent.index(this.parent.parent.parent));


							var keyLine=null;
							var keyLineTitle=(1*this.parent.parent.parent.parent.index(this.parent.parent.parent))+1
							keyLineTitle=keyLineTitle.toString();
							if (object.objectNames[objectName.keyLines].records.length>0) {
								for(var r in object.objectNames[objectName.keyLines].records) {
									if (object.objectNames[objectName.keyLines].records[r].displayName()==keyLineTitle) keyLine=object.objectNames[objectName.keyLines].records[r].Id;
								}
							}
							if (keyLine!==null) {
								var newRecord=object.objectNames[objectName.subSections].add();
								newRecord.value={
									clzyj:fullName,
									lvzfz:this.parent.value.title,
									pbyno:kloe.value.businessSector,
									viign:keyLine,
									wuthv:kloe.value.keyQuestion,
									xlbzu:3,
									zgsux:{}
								};
								object.save([newRecord],function() {
									me.value=parseInt(newRecord.Id);
								});
								console.log("Created Prompt: "+this.parent.value.title,newRecord);
							}else{
								console.log("Failed to find Key Line "+keyLineTitle);
							}

						}else{
							this.value=id;
						}
					}else{
						var p=object.objectNames[objectName.subSections].recordsCache[this.value];
						if (isNaN(p.value.lqlom) || p.value.lqlom===null) {
							if (this.parent.parent.parent.value.keyLine>0) {
								p.value.lqlom=this.parent.parent.parent.value.keyLine;
								object.save([p],function() {});
								console.log('Updated prompt: '+p.displayName());
							}
						}
					}
				}
				obj.selector((isNaN(this.value)?null:this.value.toString()),function(ele) {
					$(me.container).append(ele);
				},function() {
					me.value=this.value;
				},true);
			};
			this.preRender=function() {
				if (this.schema.objectType!==undefined) {
					this.renderSelect(this.schema.objectType);
				}else{
					var schema=this.schema;
					console.log('Getting '+this.schema.object);
					object.get(this.schema.object,function(obj) {
						if (obj.length==1) {
							schema.objectType=obj[0];
							me.renderSelect(schema.objectType);
						}
					},function(){},0);
				}
			};
		},
		objectparameter:function(v,o,p){
			this.objectName='objectparameter';
			kloe.defaultObjectProcess(this,o,v,p);
			var me=this;
			this.renderSelect=function(obj) {
				$(me.container).append(
					obj.parameterselector(this.value,function() {
						me.value=this.value;
					},me.schema.parameterType)
				);
			};
			this.preRender=function() {
				if (this.schema.objectType!==undefined) {
					this.renderSelect(this.schema.objectType);
				}else{
					var schema=this.schema;
					object.get(this.schema.object,function(obj) {
						if (obj.length==1) {
							schema.objectType=obj[0];
							me.renderSelect(schema.objectType);
						}
					},function(){},0);
				}
			};
		},
		objectparameterjson:function(v,o,p){
			this.objectName='objectparameterjson';
			kloe.defaultObjectProcess(this,o,v,p);
			var me=this;
			this.renderSelect=function(obj) {
				//console.log(obj);
				var sel=null;
				if (kloe.schema.main[this.schema.parameter]===undefined) {
					$(me.container).append(this.schema.parameter+' is missing in the schema');
				}else{
					var objectType=kloe.schema.main[this.schema.parameter].objectType;
					//console.log(objectType,kloe.value[this.schema.parameter]);
					if (objectType!==undefined && objectType.parameters[kloe.value[this.schema.parameter]]!==undefined) {
						var json=objectType.parameters[kloe.value[this.schema.parameter]].json_schema;
						if (json instanceof Array) {
							sel=new yoodoo.ui.selectbox({
								onchange:function() {
									me.value=this.value;	
								},
								label:null
							});
							for(var j in json) {
								sel.add({
									label:json[j].title.en,
									value:json[j].key
								});
							}
							//console.log(sel.options,o);
							$(me.container).append(sel.render(this.value));
						}
					}
				}
				/*console.log(this,this.schema,objectType);
				$(me.container).append(
					obj.parameterselector(this.value,function() {
						me.value=this.value;
					})
				);*/
			};
			this.preRender=function() {
				if (this.schema.objectType!==undefined) {
					this.renderSelect(this.schema.objectType);
				}else{
					var schema=this.schema;
					object.get(this.schema.object,function(obj) {
						if (obj.length==1) {
							schema.objectType=obj[0];
							me.renderSelect(schema.objectType);
						}
					},function(){},0);
				}
			};
		}
	},
	uniqueId:function() {
		var id=this.randomString();
		while(kloe.idExists(id)) id=this.randomString();
		return id;
	},
	idExists:function(id) {
		return (typeof(kloe.ids[id])!="undefined");
	},
	randomString:function() {
		var length=20;
		var chars='abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
		var op='';
		while(op.length<length) op+=chars.substr(Math.round(Math.random()*(chars.length-1)),1);
		return op;
	},
	values:function() {
		var op={};
		for(var k in this.elements) {
			op[k]=this.elements[k].json();
		}
		op.rememberedAudio=this.selections.audio;
		return op;
	},
	validate:function() {
		return [];
	},
	save:function(e) {
		var err=kloe.validate();
		if (err.length==0) {
			var txt=JSON.stringify(this.values());
			txt=Base64.encode(txt);
			$('textarea#globalFieldContent').val(txt);
			localStorage[this.autosaveKey]=txt;
			$('textarea#display').val(this.layout);
			
			return !(object.saveChanges(function() {
				$('.sf_admin_action_save').click();
			}));
		}else{
			alert(err.join("\n"));
			e.preventDefault();
			return false;
		}
	},

	adminbar:function() {
		this.containers.adminbar=document.createElement("div");
		$('#sf_admin_bar').append(this.containers.adminbar);
		$(this.containers.adminbar).html("<h3>Audio panel</h3>").css({'margin-top':'20px'});
		this.bulkUploader();
		this.libraryAudio();
	},
	libraryAudio:function() {
		this.containers.audioLibrary=document.createElement("div");
		$(this.containers.audioLibrary).addClass("audioLibrary").html("Remember other audio files in the Library<br />");
		$(this.containers.adminbar).append(this.containers.audioLibrary);
		var but=document.createElement("button");
		$(but).attr("type","button").html("Fetch library audio");
		this.containers.libraryFiles=document.createElement("div");
		$(this.containers.libraryFiles).addClass('audiofilelist');
		var filter=document.createElement("div");
		$(filter).addClass("filterBox").css({display:"none"});
		var ip=document.createElement("input");
		$(ip).attr("type","text").bind("keyup",function() {
			kloe.filterLibrary(this.value);
		});
		$(filter).append(ip);
		$(this.containers.audioLibrary).append(but).append(filter).append(this.containers.libraryFiles);
		$(but).bind("click",function() {
			$(kloe.containers.libraryFiles).html("Fetching...");
			$(this).slideUp();
			$.ajax({
				url:'/library/ajax',
				method:"POST",
				dataType:'json',
				success:function(obj) {
					$('.filterBox').css({display:"block"});
					$(kloe.containers.libraryFiles).empty();
					if (typeof(obj)=="object" && obj.length>0) {
						var found=0;
						obj.sort(function(a,b) {
							if (a.name.toLowerCase()<b.name.toLowerCase()) return -1;
							if (a.name.toLowerCase()>b.name.toLowerCase()) return 1;
							return 0;
						});
						kloe.libraryFiles=[];
						for(var o=0;o<obj.length;o++) {
							if (/mp3$/.test(obj[o].url) && !kloe.audioRemembered(obj[o].url)) {
								var a=document.createElement("a");
								a.libraryFile=obj[o];
								$(a).html(obj[o].name).attr("href","javascript:void(0)").bind("click",function() {
	kloe.rememberAudioFile(this);
								});
								a.title=obj[o].url;
								found++;
								$(kloe.containers.libraryFiles).append(a);
								kloe.libraryFiles.push(a);
							}
						}
						if (found==0) $(kloe.containers.libraryFiles).slideUp(500,function(){$(this).html("No files found").slideDown();});
					}else{
						$(kloe.containers.libraryFiles).slideUp(500,function(){$(this).html("No files found").slideDown();});
					}

					//kloe.checkAudioScripts();
				}
			});
		});
	},
	rememberAudioFile:function() {
		var obj=null;
		if (arguments.length>0) obj=arguments[0];
		if (obj!==null) {
			var aud={};
			aud.name=obj.libraryFile.name.replace(/_/g,' ');
			aud.url=obj.libraryFile.url;
			aud.id=obj.libraryFile.id;
			if (this.audioRemembered(aud)) return false;
			kloe.selections.audio.push(aud);
		}
		kloe.updateSelectors('audio');
		if ($(kloe.containers.audioLibrary).find('.warning').get().length==0) {
			var d=document.createElement("div");
			$(d).html("This doo-it will remember which files you have selected ONLY if you save it.").css({color:'#f00',display:"none"}).addClass("warning");
			$(kloe.containers.audioLibrary).append(d);
			$(d).slideDown();
		}
		$(obj).slideUp(500,function() {
			$(this).remove();
		});
		//$('.audioSelectInput').each(function(i,e) {kloe.audioSelectOptions(e);});
	},
	audioRemembered:function(aud) {
		for(var a=0;a<kloe.selections.audio.length;a++) {
			if (kloe.selections.audio[a].url==aud.url) return true;
		}
		return false;
	},
	filterLibrary:function(txt) {
		var found=[];
		if (txt.replace(/ /g,'')=="") {
			$(kloe.containers.libraryFiles).empty();
			for(var l=0;l<this.libraryFiles.length;l++) {
				$(this.libraryFiles[l]).bind("click",function() {
					kloe.rememberAudioFile(this);
				});
				$(kloe.containers.libraryFiles).append(this.libraryFiles[l]);
			}
		}else{
			var txts=txt.split(" ");
			for(var t=0;t<txts.length;t++) {
				if (txts[t]!="") {
					var startMatch=new RegExp('^'+txts[t],'i');
					var goodMatch=new RegExp('\W'+txts[t],'i');
					var aMatch=new RegExp(txts[t],'i');
					for(var l=0;l<this.libraryFiles.length;l++) {
						var s=0;
						if (startMatch.test(this.libraryFiles[l].libraryFile.name)) s+=3;
						if (goodMatch.test(this.libraryFiles[l].libraryFile.name)) s+=2;
						if (aMatch.test(this.libraryFiles[l].libraryFile.name)) s+=txts[t].length;
						if (found[l]===undefined) {
							found[l]=[s,this.libraryFiles[l]];
						}else{
							found[l][0]+=s;
						}
					}
				}
			}
			found.sort(function(a,b) {return b[0]-a[0];});
			$(kloe.containers.libraryFiles).empty();
			var score=[];
			for(var a=0;a<20;a++) {
				if (a<found.length) {
					score.push(found[a][0]);
					$(found[a][1]).bind("click",function() {
						kloe.rememberAudioFile(this);
					});
					$(kloe.containers.libraryFiles).append(found[a][1]);
				}
			}
		}
	},
	audioUploadCount:0,
	bulkUploader:function() {
		this.containers.uploader=document.createElement("div");
		$(this.containers.adminbar).append(this.containers.uploader);
		var up=$(this.containers.uploader);
		up.addClass("audioUpload").html("Upload audio files to the library and remember them here");
		var form=document.createElement("form");
		$(form).bind("submit",function(e) {
			e.preventDefault();
			return false;
		});
		form.method="POST";
		form.name="audioUp";
		form.enctype="multipart/form-data";
		var ip=document.createElement("input");
		$(ip).attr("type","file");
		$(ip).attr("name","audioFiles[]");
		$(ip).attr("multiple","true");
		$(ip).attr("accept","audio/*");
		var list=document.createElement("div");
		$(list).addClass("audiofilelist");
		//var but=document.createElement("button");
		//$(but).html("Upload").css({display:"none"});
		//$(but).attr("type","button");
		$(ip).bind("change",function() {
			//$(this).slideUp();
			var ip=$(this.parentNode).find("input[type=file]").get(0);
			if (ip.files.length>0) {
				kloe.audioUploadCount=ip.files.length;
				var data=new FormData(this.parentNode);
				var xhr=new XMLHttpRequest;
				xhr.open('POST','/library/bulkUploadAudio',true);
				xhr.send(data);
				xhr.onreadystatechange=function() {
					if (this.readyState==4) {
						var r=this.responseText;
						this.getAllResponseHeaders();
						if (this.status==200) r=this.responseText;
						kloe.bulkComplete(r);
					}
				};
			}
		});
		$(form).append(ip).append(list);
		up.append(form);
		$(ip).bind("change",function() {
			var list=$(this).next();
			list.empty().html("Uploading...");
			for(var f=0;f<this.files.length;f++) {
				var file=document.createElement("div");
				$(file).html(this.files[f].name);
				list.append(file);
			}
			$(this).next().next().slideDown();
		});
	},
	bulkComplete:function(res) {
		var newfiles=[];
		try{
			eval('newfiles='+res+';');
		}catch(e){}
		//if (this.value.audio===undefined) this.value.audio=[];
		for(var f=0;f<newfiles.length;f++) {
			if (!this.audioRemembered(newfiles[f])) kloe.selections.audio.push(newfiles[f]);
		}
		kloe.updateSelectors('audio');
		$(this.containers.uploader).find("input").val('');
		$(this.containers.uploader).find("div.audiofilelist").slideUp(500,function() {
			$(this).empty().css({display:"block"});
		});
		//$(this.containers.uploader).find("button").slideUp();
		if ($(this.containers.uploader).find('.warning').get().length==0) {
			var d=document.createElement("div");
			$(this.containers.uploader).append(d);
		}else{
			var d=$(this.containers.uploader).find('.warning').get(0);
		}
		if (kloe.audioUploadCount!=newfiles.length) {
			$(d).html("One or more files failed to upload. They may be higher than the upload limit.").css({color:'#f00',display:"none"}).addClass("warning");
		}else{
			$(d).html("This doo-it will remember which files you have uploaded ONLY if you save it.").css({color:'#f00',display:"none"}).addClass("warning");
		}
		$(d).slideDown();

		$('.audioSelectInput').each(function(i,e) {kloe.audioSelectOptions(e);});
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
	}
};

var Base64 = {

	// private property
	_keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

	// public method for encoding
	encode: function (input) {
		var output = "";
		var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
		var i = 0;

		input = Base64._utf8_encode(input);

		while (i < input.length) {

			chr1 = input.charCodeAt(i++);
			chr2 = input.charCodeAt(i++);
			chr3 = input.charCodeAt(i++);

			enc1 = chr1 >> 2;
			enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
			enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
			enc4 = chr3 & 63;

			if (isNaN(chr2)) {
				enc3 = enc4 = 64;
			} else if (isNaN(chr3)) {
				enc4 = 64;
			}

			output = output +
				this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
				this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);

		}

		return output;
	},

	// public method for decoding
	decode: function (input) {
		var output = "";
		var chr1, chr2, chr3;
		var enc1, enc2, enc3, enc4;
		var i = 0;

		input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

		while (i < input.length) {

			enc1 = this._keyStr.indexOf(input.charAt(i++));
			enc2 = this._keyStr.indexOf(input.charAt(i++));
			enc3 = this._keyStr.indexOf(input.charAt(i++));
			enc4 = this._keyStr.indexOf(input.charAt(i++));

			chr1 = (enc1 << 2) | (enc2 >> 4);
			chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
			chr3 = ((enc3 & 3) << 6) | enc4;

			output = output + String.fromCharCode(chr1);

			if (enc3 != 64) {
				output = output + String.fromCharCode(chr2);
			}
			if (enc4 != 64) {
				output = output + String.fromCharCode(chr3);
			}

		}

		output = Base64._utf8_decode(output);

		return output;

	},

	// private method for UTF-8 encoding
	_utf8_encode: function (string) {
		string = string.replace(/\r\n/g, "\n");
		var utftext = "";

		for (var n = 0; n < string.length; n++) {

			var c = string.charCodeAt(n);

			if (c < 128) {
				utftext += String.fromCharCode(c);
			} else if ((c > 127) && (c < 2048)) {
				utftext += String.fromCharCode((c >> 6) | 192);
				utftext += String.fromCharCode((c & 63) | 128);
			} else {
				utftext += String.fromCharCode((c >> 12) | 224);
				utftext += String.fromCharCode(((c >> 6) & 63) | 128);
				utftext += String.fromCharCode((c & 63) | 128);
			}

		}

		return utftext;
	},

	// private method for UTF-8 decoding
	_utf8_decode: function (utftext) {
		var string = "";
		var i = 0;
		var c = c1 = c2 = 0;

		while (i < utftext.length) {

			c = utftext.charCodeAt(i);

			if (c < 128) {
				string += String.fromCharCode(c);
				i++;
			} else if ((c > 191) && (c < 224)) {
				c2 = utftext.charCodeAt(i + 1);
				string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
				i += 2;
			} else {
				c2 = utftext.charCodeAt(i + 1);
				c3 = utftext.charCodeAt(i + 2);
				string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
				i += 3;
			}

		}

		return string;
	}

};