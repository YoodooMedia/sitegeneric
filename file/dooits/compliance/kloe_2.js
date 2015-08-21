/* --- dooit layout ---

 {
 dependencies:[
 ['dooits/kloe.js',false],
 ['dooits/data/kloe1.js',false],
 ['css/kloe.css',false]
 ],
 loaded:function(){
 kloe.init({});
 },
 saveValues:['kloe.output'],
 displayed:'kloe.displayed',
 finished:'kloe.finishable',
 orientation:'auto',
 options:{
 }
 }
 */

dooit.temporaries('kloe');
var kloe = {
	selectors : {
		container : '.dooitDisplay'
	},
	containers : {
		container : null
	},
	summary : null,
	value : null,
	summarykey : null,
	configkey:null,
	voiceoverkey:null,
	voiceoverrecord:null,
	warningStatus:null,
	key : null,
	schema : null,
	fields : {},
	templater:false,
	objectName:{
		responses:'KLOE Responses',
		evidence:'KLOE evidence',
		actionPlans:'KLOE action plans',
		status:'KLOE Status',
		responsibility:'KLOE responsibility',
		keyQuestions:'KLOE Key Questions',
		businessSector:'KLOE Business sector',
		keyLines:'KLOE Key Lines of Enquiry',
		subSections:'KLOE Prompts'
	},
	objectType:null,
	otherObjectType:[],
	objectTypes:{},
	setObjectNames:function() {
		this.objectType=this.objectName.responses;
		this.otherObjectType=[
			this.objectName.evidence,
			this.objectName.actionPlans
		];
		this.objectTypes={};
		this.objectTypes[this.objectName.status]=null;
		this.objectTypes[this.objectName.responsibility]=null;
		this.objectTypes[this.objectName.keyQuestions]=true;
		this.objectTypes[this.objectName.businessSector]=true;
		this.objectTypes[this.objectName.keyLines]=null;
		this.objectTypes[this.objectName.subSections]=null;
	},
	icons:{
		walking:{
			img:'/uploads/sitespecific/yoodoo.siteFolder/image/walking4D4D4D.png',svg:'<path fill="#4D4D4D" d="M94.563,23.5L78.438,37.625l-8.5-5.125l-0.608-0.165c4.788-0.398,8.546-4.199,8.546-8.835 c0-4.901-4.197-8.875-9.375-8.875s-9.375,3.974-9.375,8.875c0,2.902,1.479,5.472,3.754,7.091l-8.191-2.216L43.063,31l-4.5,9.5 l-3.25-1.375L30.188,43.5l8.625,4.125L48.438,36l3.375,1.125l-4.75,19.5l-13.25,11.25L15.688,52.5L6.063,65l11.25-2.75l13,15.25 l24.25-8.75l13-3.125l8.125,21.25L90.313,79.5l-11.125-2.25l-3.5-19l-14.75-2l6.625-15l13.875,4.875L92.813,32.75l3.125,0.75 l0.75-12.875L94.563,23.5z"/>'},
		cross:{
			img:'/uploads/sitespecific/yoodoo.siteFolder/image/cross4D4D4D.png',svg:'<rect x="37.747" y="7.931" transform="matrix(-0.7689 -0.6393 0.6393 -0.7689 56.4817 120.4132)" fill="#4D4D4D" width="24.507" height="84.138"/><rect x="37.746" y="7.931" transform="matrix(0.6393 -0.769 0.769 0.6393 -20.4129 56.483)" fill="#4D4D4D" width="24.508" height="84.138"/>'},
		tick:{
			img:'/uploads/sitespecific/yoodoo.siteFolder/image/tick4D4D4D.png',svg:'<polygon fill="#4D4D4D" points="78.091,10.608 39.669,56.819 18.434,39.164 3.064,57.646 24.3,75.305 43.145,90.973 96.936,26.276"/>'},
		left:{
			img:'/uploads/sitespecific/yoodoo.siteFolder/image/back4D4D4D.png',svg:'<polygon fill="#4D4D4D" points="69.747,0.615 26.475,50.002 69.747,99.385 79.689,90.936 43.831,50.002 79.689,9.078 "/>'},
		exclamation:{
			img:'/uploads/sitespecific/yoodoo.siteFolder/image/exclamation4D4D4D.png',svg:'<path fill="#4D4D4D" d="M39.841,83.397c0-4.438,4.305-7.643,10.331-7.643c6.026,0,9.986,3.205,9.986,7.643 c0,4.314-3.96,7.644-10.33,7.644C43.974,91.041,39.841,87.712,39.841,83.397z M44.146,65.893L41.735,6.597h16.529l-2.41,59.296 H44.146z"/>'},
		speaker:{
			img:'/uploads/sitespecific/yoodoo.siteFolder/image/speaker4D4D4D.png',svg:'<polygon id="polygon1" points="39.389,13.769 22.235,28.606 6,28.606 6,47.699 21.989,47.699 39.389,62.75 39.389,13.769" style="stroke:#111111;stroke-width:5;stroke-linejoin:round;fill:#111111;" /><path id="path1" d="M 48.128,49.03 C 50.057,45.934 51.19,42.291 51.19,38.377 C 51.19,34.399 50.026,30.703 48.043,27.577" style="fill:none;stroke:#111111;stroke-width:5;stroke-linecap:round"/> <path id="path2" d="M 55.082,20.537 C 58.777,25.523 60.966,31.694 60.966,38.377 C 60.966,44.998 58.815,51.115 55.178,56.076" style="fill:none;stroke:#111111;stroke-width:5;stroke-linecap:round"/> <path id="path1" d="M 61.71,62.611 C 66.977,55.945 70.128,47.531 70.128,38.378 C 70.128,29.161 66.936,20.696 61.609,14.01" style="fill:none;stroke:#111111;stroke-width:5;stroke-linecap:round"/>'},
		evidence:{
			img:'/uploads/sitespecific/yoodoo.siteFolder/image/evidence4D4D4D.png',svg:'<path fill="#4D4D4D" d="M10.027,12.236l1.166,13.017c-1.41,0.127-2.819,0.252-4.229,0.38c-1.444,0.125,0.13-1.285,0.073-1.919c-0.089-0.996-0.178-1.992-0.268-2.989c-0.191-2.132-0.382-4.264-0.573-6.395c-0.072-0.778-1.979-1.572-0.072-1.743C7.426,12.47,8.727,12.353,10.027,12.236L10.027,12.236z M10.826,12.165l3.618-0.324l0.303,3.376c0.161,1.806-1.87-1.262-2.048-1.393C11.804,13.167,10.523,13.669,10.826,12.165L10.826,12.165z M11.403,19.111l-0.099-1.106c0.607-0.383,1.814-3.584,2.015-1.347c0.105,1.177,0.21,2.354,0.316,3.531C13.83,22.307,12.018,19.211,11.403,19.111C11.403,19.111,11.71,19.161,11.403,19.111z M12.002,25.181l-0.093-1.03c1.967-0.5,1.717-1.978,2.728-3.199c0.803-0.983,0.932,2.017,0.949,2.211c0.091,1.017,0.551,1.647-0.531,1.745C14.037,24.998,13.02,25.09,12.002,25.181L12.002,25.181z"/><path fill="#4D4D4D" d="M23.5,20.785L22.945,24.2l-2.361,0.211c-0.898-2.366-1.796-4.732-2.694-7.098c-0.473-1.246-0.945-2.491-1.418-3.736c-0.271-0.716-1.94-1.745-0.093-1.91c1.073-0.096,2.878-0.646,3.901-0.35c1.841-0.164,0.165,1.138,0.506,2.069C21.69,15.853,22.595,18.319,23.5,20.785L23.5,20.785z M23.719,19.392l-0.637-1.75c0.184-1.126,1.559-5.224-0.188-5.53c-1.079-0.276,0.053-1.034,0.467-1.071c0.679-0.061,1.358-0.122,2.037-0.182c1.144-0.104,0.841,0.927,0.089,1.203C23.923,13.023,23.979,17.822,23.719,19.392L23.719,19.392z"/><path fill="#4D4D4D" d="M33.092,23.29c-1.413,0.127-2.825,0.255-4.238,0.38c-1.444,0.131,0.129-1.286,0.072-1.918c-0.089-0.996-0.179-1.992-0.268-2.989c-0.191-2.132-0.382-4.263-0.574-6.395c-0.084-0.962-1.819-1.587,0.185-1.767c1.296-0.116,2.592-0.232,3.888-0.349c1.446-0.127-0.129,1.285-0.072,1.918c0.089,0.997,0.179,1.993,0.268,2.989c0.191,2.132,0.382,4.264,0.574,6.396C32.99,22.274,34.936,23.113,33.092,23.29L33.092,23.29z"/><path fill="#4D4D4D" d="M39.205,9.621l1.167,13.017c-1.41,0.127-2.819,0.255-4.229,0.379c-1.442,0.131,0.13-1.288,0.073-1.919c-0.089-0.996-0.178-1.992-0.268-2.988c-0.191-2.132-0.382-4.264-0.573-6.396c-0.072-0.777-1.979-1.572-0.072-1.743C36.604,9.854,37.904,9.738,39.205,9.621L39.205,9.621z M41.941,19.748l-0.674-7.524c-0.122-1.35-1.53-1.401-1.263-2.675c6.943-0.62,7.997,12.406,1.167,13.017c-0.029-0.318-0.151-0.719-0.093-1.03C41.944,21.212,42.02,20.621,41.941,19.748C41.941,19.748,41.972,20.085,41.941,19.748z"/><path fill="#4D4D4D" d="M51.128,8.552l1.167,13.017c-1.41,0.126-2.819,0.25-4.229,0.379c-1.445,0.131,0.128-1.286,0.071-1.919c-0.089-0.996-0.178-1.992-0.268-2.988c-0.191-2.132-0.382-4.264-0.573-6.396c-0.068-0.777-1.981-1.573-0.071-1.744C48.526,8.785,49.827,8.669,51.128,8.552L51.128,8.552z M51.927,8.48l3.618-0.324l0.303,3.376c0.161,1.805-1.87-1.262-2.049-1.393C52.904,9.483,51.622,9.986,51.927,8.48L51.927,8.48z M52.504,15.427l-0.099-1.106c0.606-0.383,1.813-3.584,2.014-1.348c0.106,1.178,0.212,2.355,0.317,3.533C54.923,18.623,53.123,15.527,52.504,15.427C52.504,15.427,52.81,15.477,52.504,15.427z M53.102,21.497l-0.092-1.03c1.13-0.29,2.02-1.061,2.396-2.188c0.162-0.484,0.993-2.064,1.13-0.482c0.436,0.717,0.226,2.512,0.303,3.366C55.593,21.273,54.347,21.386,53.102,21.497L53.102,21.497z"/><path fill="#4D4D4D" d="M62.099,7.569l5.566,8.383l0.378,4.205l-2.451,0.22c-1.335-1.995-2.669-3.99-4.004-5.986c-0.791-1.183-2.521-5.127-4.157-5.385c-1.304-0.333,0.703-1.082,1.078-1.116C59.705,7.783,60.902,7.676,62.099,7.569L62.099,7.569z M58.638,11.253l1.102,1.594l0.458,5.111c0.077,0.86,0.491,1.558,1.325,1.861c1.489,0.735-2.314,1.13-2.521,1.148c-1.88,0.168,0.117-1.541,0.22-2.118c0.135-0.757-0.052-1.657-0.119-2.41C58.947,14.71,58.793,12.982,58.638,11.253L58.638,11.253z M67.528,14.426l-1.105-1.622l-0.236-2.641c-0.066-0.747-1.82-2.354-1.424-2.713c0.519-0.477,2.097-0.309,2.741-0.366c1.451-0.13-0.429,2.282-0.336,3.316C67.288,11.742,67.408,13.084,67.528,14.426L67.528,14.426z"/><path fill="#4D4D4D" d="M74.275,6.218l0.104,1.154c-2.027,0.516-0.304,8.424-0.156,10.05c0.112,1.301,1.556,0.857,1.266,2.327C68.131,20.412,67.32,6.418,74.275,6.218L74.275,6.218z M75.09,7.317l-0.104-1.153c0.797,0.065,2.483,0.995,2.848-0.034c0.523-1.452,1.034,1.349,1.046,1.482c0.083,0.925,0.166,1.85,0.249,2.775c0.159,1.728-1.128,0.012-1.323-0.463C77.351,8.819,76.429,7.387,75.09,7.317C75.09,7.317,75.362,7.332,75.09,7.317z M76.225,19.684L76.12,18.52c0.867-0.147,1.659-0.745,2.093-1.499c0.186-0.323,0.504-2.271,1.248-1.53C80.906,16.943,77.363,19.525,76.225,19.684C76.225,19.684,76.744,19.611,76.225,19.684z"/><path fill="#4D4D4D" d="M85.011,5.515l1.167,13.017c-1.409,0.126-2.819,0.25-4.229,0.379c-1.445,0.125,0.129-1.283,0.071-1.919c-0.089-0.996-0.179-1.992-0.268-2.989c-0.191-2.132-0.382-4.264-0.573-6.396c-0.068-0.777-1.982-1.572-0.071-1.743C82.409,5.748,83.71,5.632,85.011,5.515L85.011,5.515z M85.81,5.443l3.618-0.324l0.303,3.376c0.161,1.805-1.87-1.262-2.049-1.393C86.787,6.446,85.505,6.949,85.81,5.443L85.81,5.443z M86.387,12.39l-0.1-1.106c0.608-0.383,1.814-3.583,2.015-1.347c0.105,1.177,0.211,2.354,0.316,3.532C88.812,15.585,87.002,12.489,86.387,12.39C86.387,12.39,86.692,12.439,86.387,12.39z M86.984,18.459l-0.092-1.03c1.131-0.288,2.018-1.062,2.396-2.188c0.162-0.483,0.993-2.065,1.13-0.482c0.436,0.716,0.226,2.512,0.303,3.367C89.476,18.236,88.229,18.348,86.984,18.459L86.984,18.459z"/><polygon fill="none" stroke="#4D4D4D" stroke-miterlimit="10" points="94.512,20.815 3.211,29 1.488,9.785 92.789,1.601 94.512,20.815 "/>'}
	},
	colours:{
		red:'AB2A2A',
		amber:'EF9225',
		cyan:'619FEC',
		green:'1ADF23'
	},
	dialcolours:{red:{r:171,g:42,b:42},grey:{r:200,g:200,b:200},amber:{r:239,g:146,b:37},green:{r:18,g:201,b:40}},
	statuses:{},
	statusesOld:{
		needsattention:{
			title:'Needs attention',
			colour:'#FF0000',
			score:0
		},
		complete:{
			title:'In place',
			colour:'#13a51a',
			score:2
		}/*,
		pending:{
			title:'Pending',
			colour:'#FFBF00',
			score:1
		},
		noaction:{
			title:'No action',
			colour:'#555555',
			score:2
		}*/
	},
	shouldUpgrade:false,
	upgraded:false,
	noUpgrade:false,
	//upgraded:false,
	//noUpgrade:true,
	icon:function() {
		if (this.doSVG) {
			if (typeof(arguments[0])=="object") arguments[0]=arguments[0].svg;
			return yoodoo.icons.drawSVG.apply(yoodoo.icons,arguments);
		}else{
			if (typeof(arguments[0])=="object") arguments[0]=arguments[0].img;
			var replacer={};
			if (typeof(arguments[arguments.length-1])=="object") replacer=arguments[arguments.length-1];
			var url=arguments[0];
			for(var k in replacer) url=url.replace(k,replacer[k]);
			var img=yoodoo.e("img");
			img.src=yoodoo.replaceDomain('domain:'+url);
			return img;
		}
	},
	nonSVG:function() {
		this.container=null;
		this.colours={
						low : {
							r : 152,
							g : 164,
							b : 93
						},
						mid : {
							r : 205,
							g : 226,
							b : 99
						},
						midabove:null,
						high : {
							r : 225,
							g : 255,
							b : 17
						}
					};
		this.render=function(v) {
			if (this.container===null) this.container=$(yoodoo.e("div")).addClass('kloe_numeric_dial');
			this.setValue(v);
			return this.container;
		};
		this.setColour=function(col) {
			this.container.css({color:yoodooStyler.rgbToHex(col)});
		};
		this.setValue=function(v) {
			var v=Math.round(v);
			var col=(v<50)?
				yoodooStyler.fromTo(this.colours.low,this.colours.mid,(v*2)/100)
				:
				yoodooStyler.fromTo(this.colours.mid,this.colours.high,((v-50)*2)/100);
			this.container.html(v+'%').css({color:yoodooStyler.rgbToHex(col)}).addClass((v<10)?'belowTen':'');
			if (v<10) {
				this.container.addClass("belowTen");
			}else{
				this.container.removeClass("belowTen");
			}
		};
	},
	doSVG:(document.createElementNS!==undefined),
	unusedOpacity:0.3,
	object:null,
	filterObjectTypes:{},
	promptFilter:{},
	recordCount:0,
	readOnly:{},
	sections:{},
	init : function() {
		this.statuses=this.statusesOld;
		this.templater=(yoodoo.user.managerType!==undefined && yoodoo.user.managerType.subManagers instanceof Array && yoodoo.user.managerType.subManagers.length>0);
		this.setObjectNames();
		if (arguments.length > 0)
			this.transposeOptions([], arguments[0]);
		this.loadFields();
		this.containers.container = $(this.selectors.container).addClass("kloe");
		if (this.key !== null && this.containers.container !== null) {
			if ( typeof (kloe_schema) == "object") {
				this.schema = kloe_schema;
			}
			if (!(this.voiceoverrecord!==null && typeof(this.voiceoverrecord)=="object")) this.voiceoverrecord={};
			if (this.voiceoverrecord.level1===undefined) this.voiceoverrecord.level1=false;
			if (this.voiceoverrecord.level2===undefined) this.voiceoverrecord.level2=false;
			if (this.voiceoverrecord.level3===undefined) this.voiceoverrecord.level3=false;
			if (this.voiceoverrecord.level4===undefined) this.voiceoverrecord.level4=false;
			//for(var i in this.schema.statuses) this.statuses[this.schema.statuses[i].id]=this.schema.statuses[i];
				if (this.value == '')
					this.value = {};
				var me = this;
			var me=this;
			var objs=[
			//	this.objectType
			];
			//if (this.recordCount==0) this.upgraded=true;
			for(var k in this.objectTypes) objs.push(k.replace(/_/g,' '));
			if (yoodoo.object!==undefined && this.noUpgrade!==true) {
				yoodoo.working(true,"Fetching structure...");
				yoodoo.object.get(objs,function(objs) {
					for(var k in objs) {
						var name=objs[k].schema.Name;
						if (me.objectTypes[name]===true) {
							me.objectTypes[name]=objs[k];
							me.filterObjectTypes[objs[k].schema.Id]=objs[k];
						}else if (me.objectTypes[name]===null) {
							me.objectTypes[name]=objs[k];
						}
					}
					me.statuses= me.objectTypes[me.objectName.status];
					for(var r in me.statuses.records) {
						if (me.statuses.records[r].getValue('Score')==0) me.warningStatus=me.statuses.records[r];
					}
					var me2=me;
					yoodoo.object.get(me.otherObjectType,function(obj) {
						for(var k in obj) {
							me2.objectTypes[obj[k].schema.Name]=obj[k];
						}
						var prompts=me2;
						yoodoo.object.get(me2.objectType,function(obj) {
							// start rendering the dooit
							if (obj.length==1) {
								prompts.object=obj[0];

		for (var k in prompts.schema.sections) {
			prompts.standardizeSection(prompts.schema.sections[k]);
		}

//console.log(obj,obj.length);
								var filter={};
								filter[prompts.object.getParameterReferingToObjectId(prompts.objectTypes[prompts.objectName.businessSector].schema.Id)]=[prompts.schema.businessSector,'equals'];
								filter[prompts.object.getParameterReferingToObjectId(prompts.objectTypes[prompts.objectName.keyQuestions].schema.Id)]=[prompts.schema.keyQuestion,'equals'];
								filter.ignoreBelow=true;
								prompts.promptFilter=filter;
								if (prompts.upgraded!==true) {
									prompts.shouldUpgrade=0;
//console.log(prompts.schema.sections);
									for(var s in prompts.schema.sections) {
//console.log(prompts.schema.sections[s]);
										for(var i in prompts.schema.sections[s].items) {
//console.log(prompts.schema.sections[s].items[i].records.length);
											prompts.shouldUpgrade+=prompts.schema.sections[s].items[i].records.length;
										}
									}
									prompts.shouldUpgrade=(prompts.shouldUpgrade>0);
									if (prompts.shouldUpgrade===false) prompts.upgraded=true;
								}

								var me=prompts;
								if (prompts.upgraded===true) {
console.log("Getting responses");
									prompts.object.get(function(list) {
										/*for (var k in kloe.schema.sections) {
											kloe.standardizeSection(kloe.schema.sections[k]);
										}*/
										kloe.prompts={};
										for(var s in kloe.schema.sections) {
											//if (kloe.schema.sections[s].kloeSection>0) {
												//var sectionId=kloe.schema.sections[s].kloeSection.toString();
												//if (kloe.sections[sectionId]===undefined) kloe.sections[sectionId]={};
												for(var ss in kloe.schema.sections[s].items) {
													var subsectionId=kloe.schema.sections[s].items[ss].kloeSubSection.toString();
													kloe.prompts[subsectionId]=kloe.schema.sections[s].items[ss];
												}
											//}
										}
										//var sectionParameter=kloe.object.getParameterReferingToObjectId(kloe.objectTypes[kloe.objectName.keyLines].schema.Id);
										var subsectionParameter=kloe.object.getParameterReferingToObjectId(kloe.objectTypes[kloe.objectName.subSections].schema.Id);
										//console.log(sectionParameter);
										//console.log(subsectionParameter);
										for(var l in list) {
	//										console.log(list[l].value[subsectionParameter]);
											if (list[l].readonly) {
												var pid=list[l].value[subsectionParameter];
												if (kloe.readOnly[pid]===undefined) kloe.readOnly[pid]={};
												kloe.readOnly[pid][list[l].Id]=list[l];
											}else{
												if (kloe.prompts[list[l].value[subsectionParameter]]!==undefined) {
														var row=new kloe.record(kloe.prompts[list[l].value[subsectionParameter]],list[l]);
														kloe.prompts[list[l].value[subsectionParameter]].records.push(row);
												}
												/*if (kloe.sections[list[l].value[sectionParameter]]!==undefined) {
													if (kloe.sections[list[l].value[sectionParameter]][list[l].value[subsectionParameter]]!==undefined) {
														var item=kloe.sections[list[l].value[sectionParameter]][list[l].value[subsectionParameter]];
														var row=new kloe.record(item,list[l]);
														item.records.push(row);
														//console.log(row);
													}
												}*/
											}
										}
										//console.log(list);
										//if (kloe.upgraded===true) {
										//	me.createInherited(function() {
										//		yoodoo.working(false);
										//		me.start();
										//	});
										//}else{
											me.start();
										//}
									},function() {},0,filter);
								}else{
									yoodoo.working(false);
									prompts.start();
								}
							}else{
									yoodoo.working(false);
								//prompts.start();
							}
						},function(obj) {
							// start rendering the dooit
							yoodoo.console(obj);
									yoodoo.working(false);
							//prompts.start();
						});
					},function(obj) {
						// start rendering the dooit
						yoodoo.console(obj);
									yoodoo.working(false);
						//me2.start();
					});
				},function() {},true);
			}else{
				this.upgraded=false;
				this.start();
			}
		}
	},
	dialRescale:function(v) {
		if (v==100) return v;
		return Math.round((90*v)/100);
		return Math.round(Math.pow(v,2)/100);
	},
	start : function() {
		var me=this;
		// add the content to this.containers.container
		this.containers.h2 = $(yoodoo.e("h2")).html(this.schema.title);

		this.containers.stat = $(yoodoo.e("div")).addClass('statDiv');
		this.containers.statImmediate = $(yoodoo.e("div")).addClass('statImmediate').css({color:'#'+this.colours.red});
		this.containers.statImminent = $(yoodoo.e("div")).addClass('statImminent').css({color:'#'+this.colours.amber});
		this.containers.statPlans = $(yoodoo.e("div")).addClass('statPlans').css({color:'#'+this.colours.cyan});
		if (this.doSVG) {
			this.containers.statDial = new yoodoo.ui.graphs.dial({
				balanced:50,
				tolerance:50,
				outerRadius:30,
				innerRadius:20,
				markBalance:false,
				colours : {
						low : {
							r : 152,
							g : 164,
							b : 93
						},
						mid : {
							r : 205,
							g : 226,
							b : 99
						},
						midabove:null,
						high : {
							r : 225,
							g : 255,
							b : 17
						}
					}
			});
		}else{
			this.containers.statDial = new this.nonSVG();
		}
		this.containers.statDialDiv = $(yoodoo.e("div")).addClass('statDial').append(this.containers.statDial.render(0));
		this.containers.stat.append(
			this.containers.statImmediate
		).append(
			this.containers.statImminent
		).append(
			this.containers.statPlans
		).append(
			this.containers.statDialDiv
		);
		this.containers.sectionstat = $(yoodoo.e("div")).addClass('sectionstatDiv');
		this.containers.sectionstatImmediate = $(yoodoo.e("div")).addClass('statImmediate').css({color:'#'+this.colours.red});
		this.containers.sectionstatImminent = $(yoodoo.e("div")).addClass('statImminent').css({color:'#'+this.colours.amber});
		this.containers.sectionstatPlans = $(yoodoo.e("div")).addClass('statPlans').css({color:'#'+this.colours.cyan});
		this.containers.sectionstat.append(
			this.containers.sectionstatImmediate
		).append(
			this.containers.sectionstatImminent
		).append(
			this.containers.sectionstatPlans
		);
		this.containers.voiceoverPlayer=$(yoodoo.e("button")).attr("type","button").append(
			this.icon(this.icons.speaker,14,14,70,55,{'111111':'FFFFFF'})
		).addClass("voiceoverPlayer").click(function() {
			me.voiceOverPlayer.play();
		});
		this.containers.sections = $(yoodoo.e("div"));
		this.containers.items = $(yoodoo.e("div"));
		this.containers.records = $(yoodoo.e("div"));
		this.containers.record = $(yoodoo.e("div"));
		this.containers.container.append($(yoodoo.e("div")).append(this.containers.sections)).append($(yoodoo.e("div")).append(this.containers.items)).append($(yoodoo.e("div")).append(this.containers.records)).append($(yoodoo.e("div")).append(this.containers.record)).append(
			$(yoodoo.e("section")).append(
				this.containers.stat
			).append(
				this.containers.sectionstat
			).append(
				this.containers.h2.append(
					this.containers.voiceoverPlayer
				)
			)
		);
		this.drawItems();
		this.updateStats();
		this.show(null);
		if (this.shouldUpgrade) {
			//if (window.confirm("You need to upgrade your data to the new system. Click OK to upgrade now.")) {
				var newRecords=[];
				var evidenceObject=this.objectTypes[this.objectName.evidence];
				var actionPlanObject=this.objectTypes[this.objectName.actionPlans];
				var responsibleObject=this.objectTypes[this.objectName.responsibility];
				var sectionsKey=this.object.getParameterReferingToObjectId(this.objectTypes[this.objectName.keyLines].schema.Id);
				var promptSectionsKey=this.objectTypes[this.objectName.subSections].getParameterReferingToObjectId(this.objectTypes[this.objectName.keyLines].schema.Id);
				for(var s in this.schema.sections) {
					//console.log(sectionsKey);
					for(var i in this.schema.sections[s].items) {
						var subsectionKey=false;
						//console.log(this.schema.sections[s].items[i]);
						if (this.schema.sections[s].items[i].kloeSubSection>0) subsectionKey=this.object.getParameterReferingToObjectId(this.objectTypes[this.objectName.subSections].schema.Id);
					//console.log(subsectionKey);
						for(var r in this.schema.sections[s].items[i].records) {
							var oldRecord=this.schema.sections[s].items[i].records[r];
//console.log("Creating "+oldRecord.text);
							var newRecord=this.object.add();
							newRecord.setValue(this.schema.textField,{hklsj:oldRecord.text});
							newRecord.setValue(this.schema.displayField,oldRecord.text.substring(0,255));
							newRecord.setValue('znjjl',this.templater);
							newRecord.setValue('ztvxs',false);
							newRecord.setValue('lctgx',false);
							newRecord.setValue('nsabm',false);
//console.log(newRecord.value);
							var evidenceCount=0;
							if (typeof(oldRecord.doc)=="string" && oldRecord.doc!=="") {
								var newEvidence=evidenceObject.add();
								var op={};
								op[this.schema.docField]=oldRecord.doc;
								op[this.schema.docTypeField]=oldRecord.doctype;
								if (typeof(oldRecord.file)=='object' && oldRecord.file!==null && oldRecord.file.length===undefined) {
									var jsonSchema=evidenceObject.parameters[this.schema.evidenceField].json_schema;
									//var op={};
									for(var js in jsonSchema) {
										var nom=jsonSchema[js].title.en.toLowerCase();
										if (oldRecord.file[nom]!==undefined && oldRecord.file[nom]!==null) {
											op[jsonSchema[js].key]=oldRecord.file[nom];
										}
									}
									//console.log(op,oldRecord.file);
								}
								newEvidence.setValue(this.schema.evidenceField,op);
								if (typeof(op[this.schema.docField])=="string") newEvidence.setValue(this.schema.evidenceDisplayField,op[this.schema.docField].substring(0,254));
								evidenceCount++;
								var refParam=evidenceObject.getParameterReferingToObjectId(this.object.schema.Id);
								newEvidence.setValue(refParam,newRecord);
								newEvidence.setValue('znjjl',this.templater);
		//console.log(newEvidence);
							}
							newRecord.setValue(this.schema.evidenceCountField,evidenceCount);
							var ap={};
							
							var actionPlanFields={
								'notmet':this.schema.notmetField,
								'action':this.schema.planField,
								'measures':this.schema.ensureField,
								'sources':this.schema.resourcesField,
								'affects':this.schema.affectField
							};
							var op={};
							var createActionPlan=false;
							for(var key in actionPlanFields) {
								if (oldRecord[key]!="") createActionPlan=true;
								op[actionPlanFields[key]]=oldRecord[key];
							}
							
							
							if (createActionPlan) {
								var newActionPlan=actionPlanObject.add();
								newActionPlan.value[this.schema.actionPlanField]=op;

								if (typeof(oldRecord.manager)=='string' && oldRecord.manager!="") {
									createActionPlan=true;
									var manager=responsibleObject.findByDisplayName(oldRecord.manager);
									if (manager===false) {
										manager=responsibleObject.add();
										manager.setValue(responsibleObject.displayParameter,oldRecord.manager);
									}
									newActionPlan.value[this.schema.managerField]=manager;
								}

								if (typeof(oldRecord.who)=='string' && oldRecord.who!="") {
									createActionPlan=true;
									var manager=responsibleObject.findByDisplayName(oldRecord.who);
									if (manager===false) {
										manager=responsibleObject.add();
										manager.setValue(responsibleObject.displayParameter,oldRecord.who);
									}
									//op[this.schema.responsibleField]=manager;
									newActionPlan.value[this.schema.responsibleField]=manager;
								}
								if (typeof(newActionPlan.value[this.schema.actionPlanField][actionPlanFields.notmet])=="string") newActionPlan.setValue(this.schema.actionDisplayField,newActionPlan.value[this.schema.actionPlanField][actionPlanFields.notmet].substring(0,254));
								
								
								//for(var k in op) newActionPlan.setValue(k,op[k]);
								var refParam=actionPlanObject.getParameterReferingToObjectId(this.object.schema.Id);
								newActionPlan.setValue(refParam,newRecord);
								newRecord.setValue(this.schema.actionPlanCountField,1);
								newActionPlan.setValue('znjjl',this.templater);
		//console.log(newActionPlan);
							}else{
								newRecord.setValue(this.schema.actionPlanCountField,0);
							}
							
							//newRecord.setValue(this.schema.actionPlanField,ap);
//console.log(oldRecord);
					//console.log(oldRecord.expires);
							if (oldRecord.expires.toString()=="Invalid Date") {
								oldRecord.expires=new Date();
							}
							newRecord.setValue(this.schema.expiresField,yoodoo.formatDate('Y-m-d H:i:s',oldRecord.expires));
							
							
							if (typeof(oldRecord.status)=='string' && oldRecord.status!="") {
								var status=this.statuses.findByDisplayName((oldRecord.status=='needsattention')?'Needs attention':'In place');
								if (status!==false) {
									newRecord.setValue(this.schema.statusField,status);
								}
							}
							
							for(var k in this.promptFilter) {
								newRecord.setValue(k,this.promptFilter[k][0]);
							}
							//console.log(this.promptFilter);
							//if (sectionsKey!==false) newRecord.setValue(sectionsKey,this.schema.sections[s].kloeSection);
							
							if (subsectionKey!==false) {
//console.log(this.schema.sections[s].items[i]);
								newRecord.setValue(subsectionKey,this.schema.sections[s].items[i].kloeSubSection);
								var prompt=this.objectTypes[this.objectName.subSections].recordsCache[this.schema.sections[s].items[i].kloeSubSection];
								//console.log(sectionsKey,prompt,promptSectionsKey);
								newRecord.setValue(sectionsKey,prompt.value[promptSectionsKey]);
							}
							
							
							
							/*newRecord.value[this.schema.textField]=oldRecord.text;
							newRecord.value[this.schema.docField]=oldRecord.doc;
							newRecord.value[this.schema.docTypeField]=oldRecord.docType;
							var ap={};
							var actionPlanFields=['notmet','action','measures','sources','affects'];
							for(var apf=0;apf<actionPlanFields.length;apf++) {
								var key=newRecord.object.parameters[this.schema.actionPlanField].json_schema[apf].key;
								newRecord.value[this.schema.actionPlanField][key]=oldRecord[actionPlanFields[apf]];
							}
							
							newRecord.value[this.schema.expiresField]=yoodoo.formatDate('Y-m-d H:i:s',oldRecord.expires);
							newRecord.value[this.schema.managerField]=oldRecord.manager;
							newRecord.value[this.schema.responsibleField]=oldRecord.who;*/
							//$(document.body).append(newRecord.getForm());
//console.log(newRecord,this.schema.sections[s].items[i].records[r]);
						}
					}
				}
				this.upgraded=true;
				yoodoo.processDooitSave();
			/*}else{
				this.statuses=this.statusesOld;
				for (var k in kloe.schema.sections) {
					kloe.schema.sections[k].update();
				}
			}*/
		}
	},
	fieldsToClone:[
		'anpev',
		'lsswx',
		'osfzh',
		'qbnov',
		//'rjhub',
		'sqgjb',
		'znajr'
	],
	inheritedReadOnlyFields:{
		'lowlk':false
	},
	createInherited:function(complete) {
		var prompts={};
		var inheritedIds={};
		// attach inherited responses to existing responses
		for(var s in kloe.schema.sections) {
			for(var i in kloe.schema.sections[s].items) {
				if (kloe.schema.sections[s].items[i].kloeSubSection>0) {
					var pid=kloe.schema.sections[s].items[i].kloeSubSection;
					prompts[pid]=kloe.schema.sections[s].items[i];
					for(var r in kloe.schema.sections[s].items[i].records) {
						var rec=kloe.schema.sections[s].items[i].records[r];
						if (rec.object!==null) {
							var id=rec.object.value[this.schema.inheritField];
							if (id>0) {
								if (this.readOnly[pid][id]!==undefined) rec.object.inheritedResponse=this.readOnly[pid][id];
								inheritedIds[id]=true;
							}
						}
					}
				}
			}
		}
		// clone read only responses as inherited responses
		for(var s in kloe.schema.sections) {
			for(var i in kloe.schema.sections[s].items) {
				var pid=kloe.schema.sections[s].items[i].kloeSubSection;
				if (pid>0 && this.readOnly[pid]!==undefined) {
					for(var id in this.readOnly[pid]) {
						if (inheritedIds[id]!==true) {
							var record=this.readOnly[pid][id];
							if (record.value.znjjl===true) {
								var clone=record.object.add();
								clone.value[kloe.schema.actionPlanCountField]=0;
								clone.value[kloe.schema.evidenceCountField]=0;
								clone.value[kloe.schema.statusField]=kloe.warningStatus.Id;
								for(var f in this.fieldsToClone) {
									clone.value[this.fieldsToClone[f]]=record.value[this.fieldsToClone[f]];
								}
								//clone.value=$.extend({},record.value);
								clone.value[this.schema.inheritField]=record.Id;
								inheritedIds[record.Id]=true;
								clone.inheritedResponse=record;
								var row=new kloe.record(kloe.prompts[pid],clone);
								kloe.prompts[pid].records.push(row);
							}
						}
					}
				}
			}
		}
		var idList=[];
		for(var id in inheritedIds) {
			idList.push(id);
		}
		var me=this;
		// update any appropriate fields in the response from the inherited response
		var postFetch=function() {
			for(var s in me.schema.sections) {
				for(var i in me.schema.sections[s].items) {
					for(var r in me.schema.sections[s].items[i].records) {
						if (me.schema.sections[s].items[i].records[r].object!==undefined && me.schema.sections[s].items[i].records[r].object.inheritedResponse!==undefined) 
						me.schema.sections[s].items[i].records[r].updateInherited();
					}
				}
			}
			complete();
		};
		if (idList.length>0) {
			var filter={};
			filter[this.objectTypes[this.objectName.evidence].getParameterReferingToObjectId(this.object.schema.Id)]=[
					idList.join(','),
					'in'
				];
			this.objectTypes[this.objectName.evidence].get(function(list) {
				me.attachEvidenceRecords(list,function() {
					var filter={};
					filter[me.objectTypes[me.objectName.actionPlans].getParameterReferingToObjectId(me.object.schema.Id)]=[
							idList.join(','),
							'in'
						];
					me.objectTypes[me.objectName.actionPlans].get(function(list) {
						me.attachActionPlanRecords(list,postFetch);
					},function(){
						postFetch();
					},0,filter);
				});
			},function(){
				postFetch();
			},0,filter);
			
		}else{
			postFetch();
		}
	},
	attachEvidenceRecords:function(list,callback) {
		var referringParameter=this.objectTypes[this.objectName.evidence].getParameterReferingToObjectId(this.object.schema.Id);
		var byResponseId={};
		for(var l in list) {
			var rid=list[l].value[referringParameter];
			if (rid>0) {
				if (byResponseId[rid]===undefined) byResponseId[rid]=[];
				byResponseId[rid].push(list[l]);
			}
		}
		var evidenceToGet={};
		for(var s in kloe.schema.sections) {
			for(var i in kloe.schema.sections[s].items) {
				for(var r in kloe.schema.sections[s].items[i].records) {
					if (kloe.schema.sections[s].items[i].records[r].object!==undefined/* && kloe.schema.sections[s].items[i].records[r].object.Id>0*/) {
//console.log(kloe.schema.sections[s].items[i].records[r].object.inheritedResponse);
						if (kloe.schema.sections[s].items[i].records[r].object.inheritedResponse!==undefined) {
							var iid=kloe.schema.sections[s].items[i].records[r].object.inheritedResponse.Id;
							if (byResponseId[iid]!==undefined) {
								kloe.schema.sections[s].items[i].records[r].evidenceRecord.applyInheritance(byResponseId[iid],false);
								if (kloe.schema.sections[s].items[i].records[r].object.Id>0) evidenceToGet[kloe.schema.sections[s].items[i].records[r].object.Id]=kloe.schema.sections[s].items[i].records[r];
							}
						}
					}
				}
			}
		}
		var ids=[];
		for(var id in evidenceToGet) ids.push(id);
		if (ids.length>0) {
			//console.log(evidenceToGet);
			var filter={};
			filter[referringParameter]=[ids.join(','),'in'];
			this.objectTypes[this.objectName.evidence].get(function(list) {
				var byResponseId={};
				for(var l in list) {
					var rid=list[l].value[referringParameter];
					if (evidenceToGet[rid]!==undefined) {
						if (byResponseId[rid]===undefined) byResponseId[rid]=[];
						byResponseId[rid].push(list[l]);
					}
				}
				for(var rid in byResponseId) {
//console.log(evidenceToGet[rid],byResponseId[rid]);
					evidenceToGet[rid].evidenceRecord.getExisting(byResponseId[rid]);
				}
				callback();
			},function(){},0,filter);
		}else{
			callback();
		}
	},
	attachActionPlanRecords:function(list,callback) {
		var referringParameter=this.objectTypes[this.objectName.actionPlans].getParameterReferingToObjectId(this.object.schema.Id);
		var byResponseId={};
		for(var l in list) {
			var rid=list[l].value[referringParameter];
			if (rid>0) {
				if (byResponseId[rid]===undefined) byResponseId[rid]=[];
				byResponseId[rid].push(list[l]);
			}
		}
		var actionPlansToGet={};
		for(var s in kloe.schema.sections) {
			for(var i in kloe.schema.sections[s].items) {
				for(var r in kloe.schema.sections[s].items[i].records) {
					if (kloe.schema.sections[s].items[i].records[r].object!==undefined/* && kloe.schema.sections[s].items[i].records[r].object.Id>0*/) {
						if (kloe.schema.sections[s].items[i].records[r].object.inheritedResponse!==undefined) {
							var iid=kloe.schema.sections[s].items[i].records[r].object.inheritedResponse.Id;
							if (byResponseId[iid]!==undefined) {
								kloe.schema.sections[s].items[i].records[r].actionPlanRecord.applyInheritance(byResponseId[iid],false);
								if (kloe.schema.sections[s].items[i].records[r].object.Id>0) actionPlansToGet[kloe.schema.sections[s].items[i].records[r].object.Id]=kloe.schema.sections[s].items[i].records[r];
							}
						}
					}
				}
			}
		}
		var ids=[];
		for(var id in actionPlansToGet) ids.push(id);
		if (ids.length>0) {
			//console.log(evidenceToGet);
			var filter={};
			filter[referringParameter]=[ids.join(','),'in'];
			this.objectTypes[this.objectName.actionPlans].get(function(list) {
				var byResponseId={};
				for(var l in list) {
					var rid=list[l].value[referringParameter];
					if (actionPlansToGet[rid]!==undefined) {
						if (byResponseId[rid]===undefined) byResponseId[rid]=[];
						byResponseId[rid].push(list[l]);
					}
				}
				for(var rid in byResponseId) {
//console.log(evidenceToGet[rid],byResponseId[rid]);
					actionPlansToGet[rid].actionPlanRecord.getExisting(byResponseId[rid]);
				}
				callback();
			},function(){},0,filter);
		}else{
			callback();
		}
	},
	playVoiceOver:function(key) {
		var voiceOver=null;
		if (this.schema[key+'Voice']!==undefined) {
			var voice=this.schema[key+'Voice'];
			if (voice.url!==undefined && voice.url!="") {
				voiceOver=voice.url;
			}
		}
		this.voiceOverPlayer.load(voiceOver,this.voiceoverrecord[key]===false);
		this.voiceoverrecord[key]=true;
	},
	voiceOverPlayer:{
		file:null,
		load:function(file,play) {
			yoodoo.stopSound();
			this.stopped();
			this.file=file;
			if (this.file!==null && this.file!='') {
				kloe.containers.voiceoverPlayer.addClass("available");
				if (play) this.play();
			}else{
				kloe.containers.voiceoverPlayer.removeClass("available");
			}
		},
		play:function() {
			if (this.file!==null) {
				var me=this;
				if (kloe.containers.voiceoverPlayer.hasClass("playing")) {
					yoodoo.stopSound();
					this.stopped();
				}else{
					yoodoo.playSound(yoodoo.replaceDomain('audiodomain:'+this.file),function() {
						me.stopped();
					});
					kloe.containers.voiceoverPlayer.addClass("playing");
				}
			}
		},
		stopped:function() {
			kloe.containers.voiceoverPlayer.removeClass("playing");
		}
	},
	show : function(items) { // items = true (show items) | false (show records) | null (show sections)
		switch(items) {
			case null:
				this.playVoiceOver('level1');
			break;
			case true:
				this.playVoiceOver('level2');
			break;
			case false:
				this.playVoiceOver('level3');
			break;
		}
		this.containers.container.addClass(
			(items === true) ? 'showItems' : (items===false) ? 'showRecords' : 'showSections'
		).removeClass(
			(items === true) ? 'showRecords showSections' : (items===false) ? 'showItems showSections' : 'showRecords showItems'
		);
	},
	showRecord : function(on) {
		this.playVoiceOver(on?'level4':'level3');
		this.containers.container.addClass((on === true) ? 'showRecord' : '').removeClass((on !== true) ? 'showRecord' : '');
	},
	drawItems : function() {
		var me=this;
		this.containers.sections.append($(yoodoo.e("p")).html(this.schema.introduction));
		var secDiv=$(yoodoo.e("div")).addClass("sectionBox");
		if (typeof(this.schema.help)=="string" && this.schema.help!="") this.containers.sections.append(
				$(yoodoo.e("h3")).html("KLOEs").append(
					$(yoodoo.e("button")).attr("type", "button").html("i").click(function() {
						me.help(me.schema.help, me.schema.helpVoice);
					}).addClass('info')
				)
			);
		this.containers.sections.append(secDiv);
		for (var k in this.schema.sections) {
			secDiv.append(this.schema.sections[k].render());
		}
		/*for (var k in this.schema.sections) {
			this.schema.sections[k].update();
		}*/
	},
	fullWarnings : function() {
		var warnings={
			immediate:0,
			imminent:0,
			plans:0
		};
		for (var k in this.schema.sections) {
			warnings.immediate+=this.schema.sections[k].immediateAction();
			warnings.imminent+=this.schema.sections[k].imminentAction();
			warnings.plans+=this.schema.sections[k].actionPlans();
		}
		return warnings;
	},
	updateStats : function() {
		var warnings=this.fullWarnings();
		this.containers.statImmediate.html(warnings.immediate+' immediate action'+((warnings.immediate==1)?'':'s')).css({opacity:(warnings.immediate==0)?this.unusedOpacity:1});
		this.containers.statImminent.html(warnings.imminent+' imminent action'+((warnings.imminent==1)?'':'s')).css({opacity:(warnings.imminent==0)?this.unusedOpacity:1});
		this.containers.statPlans.html(warnings.plans+' live plan'+((warnings.plans==1)?'':'s')).css({opacity:(warnings.plans==0)?this.unusedOpacity:1});
		var sum=this.getsummary();
		var col=undefined;
		if (this.recordCount==0) {
			col=this.dialcolours.grey;
		}else if (warnings.immediate>0) {
			col=this.dialcolours.red;
		}else if (warnings.imminent>0) {
			col=this.dialcolours.amber;
		}else if (sum.compliance==100) {
			col=this.dialcolours.green;
		}
		this.containers.statDial.setValue(this.dialRescale(sum.compliance),col);
	},
	standardizeSection : function(obj) {
		var me = this;
		obj.context = this;
		obj.unusedOpacity = this.unusedOpacity;
		for (var k in obj.items) {
			obj.items[k].key = obj.items[k].id;
			obj.items[k].parent = obj;
			this.standardizeItem(obj.items[k]);
		}
		obj.score = function() {
			var total=0;
			var score=0;
			for(var k in this.items) {
				score+=this.items[k].score();
				total++;
			}
			if (total==0) return 0;
			return Math.round(score/total);
		};
		obj.render = function() {
			if (kloe.doSVG) {
				this.dial=new yoodoo.ui.graphs.dial({
					balanced:50,
					tolerance:50,
					outerRadius:30,
					innerRadius:20,
					markBalance:false,
					colours : {
						low : {
							r : 171,
							g : 42,
							b : 42
						},
						mid : {
							r : 255,
							g : 153,
							b : 0
						},
						midabove:null,
						high : {
							r : 18,
							g : 201,
							b : 40
						}
					}
				});
			}else{
				this.dial = new kloe.nonSVG();
			}
			this.bar={
				container:$(yoodoo.e("div")).addClass("scoreBar"),
				bars:yoodoo.e("div"),
				render:function(val) {
					this.container.append(this.bars);
					for(var i=0;i<10;i++) $(this.bars).append($(yoodoo.e("div")).append($(yoodoo.e("div")).append(yoodoo.e("div"))));
					if (!isNaN(val)) this.update(val);
					return this.container;
				},
				update:function(val) {
					var oval=val;
					val=Math.floor(val/10);
					if (oval>0 && val==0) val=1;
					if (val<0) val=0;
					if (val>10) val=10;
					val=val*10;
					this.bars.className='bar'+val;
				}
			};
			this.button = $(yoodoo.e("button")).attr("type", "button").addClass("item section").append($(yoodoo.e("div")).addClass("buttonLabel"));
			this.immediateItems=$(yoodoo.e("span"));
			this.imminentItems=$(yoodoo.e("span"));
			this.actionplansItems=$(yoodoo.e("span"));
			this.exclamationItems=$(yoodoo.e("span"));
			this.button.append(
				$(yoodoo.e("div")).addClass("immediateItems").append(kloe.icon(this.context.icons.cross,20,20,100,100,{'4D4D4D':this.context.colours.red})).append(this.immediateItems)
			).append(
				$(yoodoo.e("div")).addClass("imminentItems").append(kloe.icon(this.context.icons.tick,20,20,100,100,{'4D4D4D':this.context.colours.amber})).append(this.imminentItems)
			).append(
				$(yoodoo.e("div")).addClass("actionplans").append(kloe.icon(this.context.icons.walking,20,20,100,100,{'4D4D4D':this.context.colours.cyan})).append(this.actionplansItems)
			).append(
				$(yoodoo.e("div")).addClass("exclamations").append(kloe.icon(this.context.icons.exclamation,20,20,100,100,{'4D4D4D':this.context.colours.green})).append(this.exclamationItems)
			).append(
				this.bar.render()
			);
			this.update();
			return this.button;
		};
		obj.update = function() {
			var me = this;
			var s=this.score();
			this.bar.update(s);
			if (this.minibar!==undefined) this.minibar.update(s);
			this.button.find('div.buttonLabel').empty().append($(yoodoo.e("b")).html(this.title)).append($(yoodoo.e("div")).html(this.shortDescription));
			this.button.unbind('click').click(function() {
				me.open();
			});
			var totals=this.totals();
			this.immediateItems.html(totals.immediate).parent().css({opacity:(totals.immediate==0)?this.context.unusedOpacity:1});
			this.imminentItems.html(totals.imminent).parent().css({opacity:(totals.imminent==0)?this.context.unusedOpacity:1});
			this.actionplansItems.html(totals.plans).parent().css({opacity:(totals.plans==0)?this.context.unusedOpacity:1});
			this.exclamationItems.html(totals.exclamation).parent().css({opacity:(totals.exclamation==0)?this.context.unusedOpacity:1});
			
			this.context.updateStats();
			this.updateStats();
		};
		obj.updateStats = function() {
			var immediate=this.immediateAction();
			var imminent=this.imminentAction();
			var plans=this.actionPlans();
			this.context.containers.sectionstatImmediate.html(immediate+' immediate action'+((immediate==1)?'':'s')).css({opacity:(immediate==0)?this.unusedOpacity:1});
			this.context.containers.sectionstatImminent.html(imminent+' imminent action'+((imminent==1)?'':'s')).css({opacity:(imminent==0)?this.unusedOpacity:1});
			this.context.containers.sectionstatPlans.html(plans+' live plan'+((plans==1)?'':'s')).css({opacity:(plans==0)?this.unusedOpacity:1});
		};
		obj.open = function() {
			this.minibar={
				container:$(yoodoo.e("div")).addClass("scoreBar"),
				bars:yoodoo.e("div"),
				render:function(val) {
					this.container.append(this.bars).css({
						width:230,
						margin:'3px auto',
						float:'right'
					});
					for(var i=0;i<10;i++) $(this.bars).append($(yoodoo.e("div")).append($(yoodoo.e("div")).append(yoodoo.e("div"))));
					if (!isNaN(val)) this.update(val);
					return this.container;
				},
				update:function(val) {
					var oval=val;
					val=Math.floor(val/10);
					if (oval>0 && val==0) val=1;
					if (val<0) val=0;
					if (val>10) val=10;
					val=val*10;
					this.bars.className='bar'+val;
				}
			};
			var back = $(yoodoo.e("button")).attr("type", "button").addClass("backButton").click(function() {
				me.show(null);
			}).html(this.context.schema.title).prepend(kloe.icon(this.context.icons.left,20,20,100,100,{'4D4D4D':'FFFFFF'}));

			var items=$(yoodoo.e("div")).addClass('subsectionList');
			for(var k in this.items) {
				items.append(this.items[k].render());
			}
			me.containers.items.empty().append(
				this.minibar.render()
			).append(
				back
			).append(
				$(yoodoo.e("h3")).html(this.title+' - prompts')
			).append(
				$(yoodoo.e("p")).html(this.shortDescription).css({'font-size':'14px'})
			).append(items);

			this.minibar.update(this.score());
			me.show(true);
		};
		obj.totals=function() {
			var t={
				immediate:0,
				plans:0,
				imminent:0,
				exclamation:0
			};
			for (var r = 0; r < this.items.length; r++) {
				var tot=this.items[r].totals();
				t.immediate+=tot.immediate;
				t.plans+=tot.plans;
				t.imminent+=tot.imminent;
				t.exclamation+=tot.exclamation;
			}
			return t;
		};
		obj.immediateAction=function() {
			var w=0;
			for (var r = 0; r < this.items.length; r++) {
				w+=this.items[r].immediateAction();
			}
			return w;
		};
		obj.actionPlans=function() {
			var w=0;
			for (var r = 0; r < this.items.length; r++) {
				w+=this.items[r].actionPlans();
			}
			return w;
		};
		obj.imminentAction=function() {
			var w=0;
			for (var r = 0; r < this.items.length; r++) {
				w+=this.items[r].imminentAction();
			}
			return w;
		};
		obj.exclamations=function() {
			var w=0;
			for (var r = 0; r < this.items.length; r++) {
				w+=(this.items[r].exclamation()?1:0);
			}
			return w;
		};
	},
	standardizeItem : function(obj) {
		var me = this;
		obj.context = this;
		obj.records = [];
//console.log(this.value[obj.key]);
		if (!(this.value[obj.key] instanceof Array) && kloe.upgraded!==true) this.value[obj.key]=[];
		if ( kloe.upgraded!==true) {
			for (var r = 0; r < this.value[obj.key].length; r++)
//console.log(this.value[obj.key]);
				obj.records.push(new this.record(obj, this.value[obj.key][r]));
		}
		if (obj.kloeSubSection>0 && this.objectTypes[this.objectName.subSections]!==null && this.objectTypes[this.objectName.subSections].recordsCache[obj.kloeSubSection]!==undefined) {
			obj.prompt=this.objectTypes[this.objectName.subSections].recordsCache[obj.kloeSubSection];
			obj.suggestedRecordsCount=obj.prompt.value[kloe.schema.suggestedRecordsCount];
		}
		obj.add = function(vals) {
			var item = null;
			if (kloe.upgraded) {
				if (this.prompt===undefined) return false;
				var kloeSectionKey=this.prompt.object.getParameterReferingToObjectId(me.objectTypes[me.objectName.keyLines].schema.Id);
				var keyQuestionKey=this.prompt.object.getParameterReferingToObjectId(me.objectTypes[me.objectName.keyQuestions].schema.Id);
				var businessSectorKey=this.prompt.object.getParameterReferingToObjectId(me.objectTypes[me.objectName.businessSector].schema.Id);
				var newRecord = kloe.object.add(vals);
				newRecord.setValue(newRecord.object.getParameterReferingToObjectId(me.objectTypes[me.objectName.status].schema.Id),kloe.warningStatus.Id);
				newRecord.setValue(newRecord.object.getParameterReferingToObjectId(me.objectTypes[me.objectName.businessSector].schema.Id),this.prompt.value[businessSectorKey]);
				newRecord.setValue(newRecord.object.getParameterReferingToObjectId(me.objectTypes[me.objectName.keyQuestions].schema.Id),this.prompt.value[keyQuestionKey]);
				newRecord.setValue(newRecord.object.getParameterReferingToObjectId(me.objectTypes[me.objectName.keyLines].schema.Id),this.prompt.value[kloeSectionKey]);
				newRecord.setValue(newRecord.object.getParameterReferingToObjectId(me.objectTypes[me.objectName.subSections].schema.Id),this.prompt.Id);
				item = new this.context.record(this, newRecord);
			}else{
				item = new this.context.record(this, vals);
			}
			obj.records.push(item);
			var box = item.render().css({
				scale : 0.01
			}).insertBefore(this.context.containers.pending.find('.emptyMessage'));
			box.transition({
				scale : 1
			}, 300, function() {
				if (obj.object!==null) $(this).addClass("emptyRecord");
				item.edit();
			});
			//this.context.containers.pending.append(item.render());
			return item;
		};
		obj.remove = function(record) {
			for (var i = 0; i < this.records.length; i++) {
				if (this.records[i] === record)
					this.records.splice(i, 1);
			}
			if (record.object!==null && kloe.upgraded) record.object.erase();
			this.update();
		};
		obj.render = function() {
			this.actionPlanIcon=$(yoodoo.e("div"));
			this.statusIcon=$(yoodoo.e("div"));
			this.button = $(yoodoo.e("button")).attr("type", "button").addClass("item subsection").append($(yoodoo.e("b")).html(this.title)).append($(yoodoo.e("div")).html(this.shortDescription)).append(
				this.actionPlanIcon
			).append(
				this.statusIcon
			);
			this.update();
			return this.button;
		};
		obj.update = function() {
			var me = this;
			this.button.unbind('click').click(function() {
				me.open();
			});
			var rep={};
			if (this.actionPlans()>0) rep['4D4D4D']=this.context.colours.cyan;
			this.actionPlanIcon.empty().append($(kloe.icon(this.context.icons.walking,30,30,100,100,rep)).css({opacity:(this.actionPlans()>0)?1:0.2}));
			var rep={};
			var type='cross';
			var opacity=1;
			var tooltip='';
			if (this.immediateAction()>0) {
				rep['4D4D4D']=this.context.colours.red;
				type='cross';
				tooltip='Needs attention';
			}else if (this.imminentAction()>0) {
				rep['4D4D4D']=this.context.colours.amber;
				type='tick';
				tooltip='Action soom required';
			}else if (this.score()==100) {
				rep['4D4D4D']=this.context.colours.green;
				type='tick';
				tooltip='All complete';
			}else if (this.records.length==0) {
				opacity=0.2;
				tooltip='No responses';
			}else{
				rep['4D4D4D']=this.context.colours.green;
				type='exclamation';
				tooltip='Add some more responses!';
			}
			var ic=kloe.icon(this.context.icons[type],30,30,100,100,rep);
			this.statusIcon.empty().append(
				$(ic).css({opacity:opacity})
			).attr("title",tooltip);
			if (this.suggestMessage!==undefined) {
				if (this.records.length<this.suggestedRecordsCount) {
					this.suggestMessage.addClass("suggestalert");
				}else{
					this.suggestMessage.removeClass("suggestalert");
				}
			}
			this.parent.update();
		};
		obj.score = function() {
			var total=0;
			var score=0;
			for (var r = 0; r < this.records.length; r++) {
				score+=this.records[r].score();
				total++;
			}
			if (total<this.suggestedRecordsCount) total=this.suggestedRecordsCount;
			return Math.round((100*score)/total);
		};
		obj.totals=function() {
			var tot={
				immediate:this.immediateAction(),
				imminent:this.imminentAction(),
				plans:this.actionPlans(),
				exclamation:0
			};
			if (tot.immediate==0 && tot.imminent==0) tot.exclamation=this.exclamation()?1:0;
			return tot;
		};
		obj.immediateAction=function() {
			var w=0;
			for (var r = 0; r < this.records.length; r++) {
				if (this.records[r].immediateAction()) w++;
			}
			return w;
		};
		obj.actionPlans=function() {
			var w=0;
			for (var r = 0; r < this.records.length; r++) {
				w+=this.records[r].pendingActionPlan();
			}
			return w;
		};
		obj.imminentAction=function() {
			var w=0;
			for (var r = 0; r < this.records.length; r++) {
				if (this.records[r].imminentAction()) w++;
			}
			return w;
		};
		obj.exclamation = function() {
			return (this.records.length>0)&&(this.records.length<this.suggestedRecordsCount);
		};
		obj.open = function() {
			var src = this;
			//me.containers.expired = $(yoodoo.e("div")).addClass("expiredRecords");
			me.containers.pending = $(yoodoo.e("div")).addClass("pendingRecords");
			var back = $(yoodoo.e("button")).attr("type", "button").addClass("backButton").click(function() {
				me.show(true);
			}).html(this.parent.title).prepend(
				kloe.icon(this.context.icons.left,20,20,100,100,{'4D4D4D':'FFFFFF'})
			);
			me.containers.records.empty().append(
				$(yoodoo.e("h3")).html(this.title+' - responses').append(
					$(yoodoo.e("button")).attr("type", "button").html("i").click(function() {
						src.context.help(src.help, src.helpVoice);
					}).addClass('info')
				)
			).append(
				$(yoodoo.e("div")).html(this.description)
			).append(
				me.containers.pending
			).prepend(
				back
			);


			//me.containers.expired.append($(yoodoo.e("div")).addClass("emptyMessage").html("No expired records"));
			this.addbutton=$(yoodoo.e("button")).attr("type", "button").addClass("addButton").html("+").click(function() {
					if ($(this).prevAll(".emptyRecord").get().length==0) src.add();
				});
			this.emptyMessage=$(yoodoo.e("div")).addClass("emptyMessage").html("No current records");
			this.suggestMessage=$(yoodoo.e("div")).addClass("suggestMessage").html("It is suggested that you have at least "+this.suggestedRecordsCount);
			me.containers.pending.append(
				this.emptyMessage
			).append(
				this.suggestMessage
			).append(
				this.addbutton
			);
			this.updateRecords();
			me.show(false);
		};
		obj.updateRecords = function() {
			/*var sorting=false;
			if (sorting) {
				this.records.sort(function(a, b) {
					return b.expires.getTime() - a.expires.getTime();
				});
				var now = new Date().getTime();
				for (var r = 0; r < this.records.length; r++) {
					if (this.records[r].expires.getTime() < now) {
						me.containers.expired.append(this.records[r].render());
					} else {
						me.containers.pending.append(this.records[r].render());
					}
				}
			}else{*/
				for (var r = 0; r < this.records.length; r++) {
					this.records[r].render().insertBefore(this.emptyMessage);
						//me.containers.pending.append(this.records[r].render().insertBefore(this.emptyMessage));
				}
			//}
			//me.containers.expired.append(me.containers.expired.find('>div')).css({display:sorting?'block':'none'});
			//me.containers.pending.append(me.containers.pending.find('>div'));
			//me.containers.pending.append(this.addbutton);
			if (this.records.length<this.suggestedRecordsCount) {
				this.suggestMessage.addClass("suggestalert");
			}else{
				this.suggestMessage.removeClass("suggestalert");
			}
		};
	},
	record : function(item, params) {
		kloe.recordCount++;
		this.item = item;
		this.text = '';
		this.doc = '';
		this.doctype = '';
		this.file = {};
		this.status = '';
		this.who = '';
		this.action='';
		this.notmet='';
		this.measures='';
		this.manager='';
		this.sources='';
		this.affects='';
		this.inputs = {};
		this.completeDate = null;
		this.expires = new Date();
		this.expires.setDate(this.expires.getDate() + parseInt(this.item.defaultExpiryDays));
		this.expires.setMonth(this.expires.getMonth() + parseInt(this.item.defaultExpiryMonths));
		this.expires.setFullYear(this.expires.getFullYear() + parseInt(this.item.defaultExpiryYears));
		this.object=null;
		if ( typeof (params) != "undefined") {
			if (typeof(params.update)=="function") {
				this.object=params;
			}else{
				for (var k in params)
					this[k] = params[k];
			}
		}
//console.log(this);
		if (kloe.upgraded) {
			if (this.object.value[kloe.schema.expiresField]===undefined) this.object.value[kloe.schema.expiresField]=yoodoo.formatDate('Y-m-d H:i:s',this.expires);
			this.expires=yoodoo.readDate(this.object.value[kloe.schema.expiresField]);
			
		}
		if (this.expires.getTime()<new Date().getTime()) {
			if (kloe.upgraded) {
				this.object.value[kloe.schema.statusField]=kloe.warningStatus.Id;
			}else{
				this.status='needsattention';
			}
			this.warning==false;
		}else{
			//this.expires = new Date();
			//this.expires.setDate(this.expires.getDate() + this.item.defaultExpiryDays);
			//if (this.status!="noaction")
				//this.status='needsattention';
			var now=new Date();
			this.warning=this.expires.getTime()<new Date(now.setDate(now.getDate()+this.item.context.schema.expiryWarningDays)).getTime();
		}
if (!(this.expires instanceof Date)) console.log(params);
		//console.log(this.object.value[kloe.schema.expiresField]);
		this.updateInherited=function() {
			if (kloe.upgraded && this.object!==null && this.object.inheritedResponse!==undefined) {
				if (this.object.inheritedResponse.value.nsabm===true) {
					this.object.value[kloe.schema.textField]=this.object.inheritedResponse.value[kloe.schema.textField];
					this.object.value[kloe.schema.displayField]=this.object.inheritedResponse.value[kloe.schema.displayField];
				}
			}
		};
		this.immediateAction=function() {
			if (kloe.upgraded && this.object!==null && kloe.warningStatus!==null) {
				return (this.object.value[kloe.schema.statusField]==kloe.warningStatus.Id);
			}else{
				return (this.status == 'needsattention');
			}
		};
		this.imminentAction=function() {
			return this.warning;
		};
		this.pendingActionPlan=function() {
			if (kloe.upgraded && this.object!==null) return (this.score()==0)?((this.object.value[kloe.schema.actionPlanCountField]!==undefined)?this.object.value[kloe.schema.actionPlanCountField]:0):0;
			return (this.action!='' && this.score()==0)?1:0;
		};
		this.remove = function() {
			this.item.remove(this);
			if (kloe.upgraded) this.object.erase();
			this.button.animate({
				width : 0
			}, 300, function() {
				$(this).remove();
			});
		};
		this.score=function() {
			var s=0;
			if (kloe.upgraded && this.object!==null && kloe.warningStatus!==null) {
				if (kloe.statuses.recordsCache[this.object.value[kloe.schema.statusField]]!==undefined) {
					return kloe.statuses.recordsCache[this.object.value[kloe.schema.statusField]].getValue('Score');
				}else{
					return 0;
				}
//				return (this.object.value[kloe.schema.statusField]==kloe.warningStatus.Id)?1:0;
			}else if (this.item.context.statuses[this.status]!==undefined) {
				s=this.item.context.statuses[this.status].score;
			}
			return s;
		};
		this.output = function() {
			if (kloe.upgraded) return {};
			return {
				text : this.text,
				doc : this.doc,
				doctype : this.doctype,
				file : this.file,
				who : this.who,
				action : this.action,
				status : this.status,
				expires : this.expires,
				notmet : this.notmet,
				measures : this.measures,
				manager : this.manager,
				sources : this.sources,
				affects : this.affects,
				completeDate : this.completeDate
			};
		};
		this.render = function() {
			if (this.button === undefined) {
				this.button = $(yoodoo.e("button")).attr("type", "button").addClass("recordButton");
				this.update(false);
			} else {
				this.update(true);
			}
			return this.button;
		};
		this.statusColour=function() {
			//if (kloe.templater) return this.item.context.colours.grey;
			var statusColour = null;
			if (kloe.upgraded && this.object!==null) {
				if (this.object.value[kloe.schema.statusField]>0 && this.item.context.statuses.recordsCache[this.object.value[kloe.schema.statusField]]!==undefined) {
					statusColour = this.item.context.statuses.recordsCache[this.object.value[kloe.schema.statusField]].getValue("Colour");
				}
			}else{
				statusColour = (this.item.context.statuses[this.status] !== undefined) ? this.item.context.statuses[this.status].colour : null;
				if (statusColour!==null && !statusColour.match(/^#/)) statusColour='#'+statusColour;
			}
			if (this.warning) statusColour=this.item.context.colours.amber;
			return statusColour;
		};
		this.update = function(withEmptyRecord) {
			var now=new Date();
			this.warning=this.expires.getTime()<new Date(now.setDate(now.getDate()+this.item.context.schema.expiryWarningDays)).getTime();
			this.overdue=false;
			if (this.expires.getTime()<new Date().getTime()) {
				this.status=(kloe.upgraded)?kloe.warningStatus.Id:'needsattention';
				this.warning=false;
				this.overdue=true;
			}
			var me = this;
			var statusColour = this.statusColour();
			//console.log(statusColour);
			if (this.warning) statusColour=this.item.context.colours.amber;
			var actionColour=(this.overdue)?this.item.context.colours.red:this.item.context.colours.cyan;
			var borderColour=statusColour;
			if (borderColour!==null && !borderColour.match(/^#/)) borderColour='#'+borderColour;
			if (statusColour!==null) statusColour=yoodooStyler.rgbToHex(yoodooStyler.tint(yoodooStyler.hexToRGB(statusColour),0.9,0));
			if (statusColour!==null && !statusColour.match(/^#/)) statusColour='#'+statusColour;
			var docParams={'4D4D4D':'999999'};
			var actionParams={'4D4D4D':'999999'};
			if (this.object===null) {
				if (this.doc!='') docParams['4D4D4D']=this.item.context.colours.cyan;
				if (this.action!='') actionParams['4D4D4D']=actionColour.replace(/#/g,'');
			}else{
				if (this.object.value[kloe.schema.evidenceCountField]>0) docParams['4D4D4D']=this.item.context.colours.cyan;
				if (this.object.value[kloe.schema.actionPlanCountField]>0) actionParams['4D4D4D']=actionColour.replace(/#/g,'');
			}

			this.button.empty().append(
				$(yoodoo.e("div")).html((kloe.upgraded)?this.object.displayName():((this.text == '') ? 'empty' : this.text))
			).append(
				kloe.icon(this.item.parent.context.icons.evidence,80,25,100,30,docParams)
			).append(
				kloe.icon(this.item.parent.context.icons.walking,25,25,100,100,actionParams)
			).unbind("click").click(function() {
				me.edit();
			}).css({
				background : (statusColour === null) ? '#dddddd' : statusColour,
				color : (statusColour === null) ? '#000' : '#000',
				'border-color':borderColour
			}).append(
				$(yoodoo.e("span")).html(yoodoo.formatDate('jS F Y',this.expires)).css({
					position:'absolute',
					top:'5px',
					right:'5px'
				}).addClass((this.warning || this.overdue)?'imminentDate':'')
			);
			if (withEmptyRecord !== false) {
				if (this.object===null) {
					if (this.text == '') {
						this.button.addClass("emptyRecord");
					} else {
						this.button.removeClass("emptyRecord");
					}
				}else{
					//console.log(this.object.value[kloe.schema.displayField]);
					if (typeof(this.object.value[kloe.schema.displayField])=="string" && this.object.value[kloe.schema.displayField] != '') {
						this.button.removeClass("emptyRecord");
					} else {
						this.button.addClass("emptyRecord");
					}
				}
			}
			this.item.update();
		};
		this.remove = function() {
			this.item.remove(this);
			this.button.remove();
			this.item.context.showRecord(false);
		};
		var me=this;
		this.evidenceRecord={
			record:me,
			records:null,
			object:kloe.objectTypes[kloe.objectName.evidence],
			filterkey:kloe.objectTypes[kloe.objectName.evidence].getParameterReferingToObjectId(kloe.object.schema.Id),
			inherited:{},
			getExisting:function(callback) {
				if (this.records===null) {
					var filter={};
					filter[this.filterkey]=[this.record.object.Id,'equals'];
					var me=this;
						var processFetched = function(objs) {
							me.records=objs;
							var fetchIds={};
							var cloneIds={};
							for(var id in me.inherited) cloneIds[id]=true;
							for(var r in me.records) {
								if (me.records[r].value.ozeer>0) {
									if (me.inherited[me.records[r].value.ozeer]!==undefined) {
										me.records[r].inheritedResponse=me.inherited[me.records[r].value.ozeer];
										 cloneIds[me.records[r].value.ozeer]=false;
									}else{
										fetchIds[me.records[r].value.ozeer]=true;
									}
								}
							}
							var doClone=[];
							for(var id in cloneIds) {
								if (cloneIds[id]===true) doClone.push(id);
							}
							for(var i in doClone) {
								var clone=me.makeClone(me.inherited[doClone[i]]);
//console.log(clone);
								me.records.push(clone);
							}
							var ids=[];
							for(var id in fetchIds) ids.push(id);
							if (ids.length>0) {
								me.object.get(function(objs) {
									var byId={};
									for(var o in objs) {
										byId[objs[o].Id]=objs[o];
										me.inherited[objs[o].Id]=objs[o];
									}
									for(var r in me.records) {
										if (me.records[r].value.ozeer>0) {
											if (byId[me.records[r].value.ozeer]!==undefined) {
												me.records[r].inheritedResponse=byId[me.records[r].value.ozeer];
											}
										}
									}
									me.updateInherited();
									if (typeof(callback)=="function") callback(me.records);
								},function(){},0,{recordIds:ids});
							}else{
								me.updateInherited();
								if (typeof(callback)=="function") callback(me.records);
							}
						};
					if (callback instanceof Array) {
						processFetched(callback);
					}else if (this.record.object.Id>0) {
						this.object.get(processFetched,
							function() {

							},0,filter
						);
					}else{
						processFetched([]);
					}
				}else{
					this.updateInherited();
					if (typeof(callback)=="function") callback(this.records);
				}
			},
			updateInherited:function() {
				for(var r in this.records) {
					if (this.records[r].value.ozeer>0 && this.records[r].inheritedResponse!==undefined) {
						var from=this.records[r].inheritedResponse;
						var to=this.records[r];
						if (to.Id===null || from.value.nsabm===true) {
							to.value.vfsye=from.value.vfsye;
							to.value.vtyxa=$.extend({},from.value.vtyxa);
						}
						to.value[this.filterkey]=(this.record.object.Id===null)?this.record.object:this.record.object.Id;
					}
				}
				this.record.object.setValue(kloe.schema.evidenceCountField,this.records.length);
			},
			applyInheritance:function(list,getExisting) {
				for(var l in list) {
					this.inherited[list[l].Id]=list[l];
				}
				if (getExisting!==false) this.getExisting(function(){});
			},
			makeClone:function(obj) {
				var newEvidence=this.object.add();
				newEvidence.inheritedResponse=obj;
				newEvidence.value.ozeer=obj.Id;
				return newEvidence;
			}
		};
		this.actionPlanRecord={
			record:me,
			records:null,
			object:kloe.objectTypes[kloe.objectName.actionPlans],
			filterkey:kloe.objectTypes[kloe.objectName.actionPlans].getParameterReferingToObjectId(kloe.object.schema.Id),
			inherited:{},
			getExisting:function(callback) {
				if (this.records===null) {
					var filter={};
					filter[this.filterkey]=[this.record.object.Id,'equals'];
					var me=this;
						var processFetched = function(objs) {
							me.records=objs;
							var fetchIds={};
							var cloneIds={};
							for(var id in me.inherited) cloneIds[id]=true;
							for(var r in me.records) {
								if (me.records[r].value.ozeer>0) {
									if (me.inherited[me.records[r].value.ozeer]!==undefined) {
										me.records[r].inheritedResponse=me.inherited[me.records[r].value.ozeer];
										 cloneIds[me.records[r].value.ozeer]=false;
									}else{
										fetchIds[me.records[r].value.ozeer]=true;
									}
								}
							}
							var doClone=[];
							for(var id in cloneIds) {
								if (cloneIds[id]===true) doClone.push(id);
							}
							for(var i in doClone) {
								var clone=me.makeClone(me.inherited[doClone[i]]);
								me.records.push(clone);
							}
							var ids=[];
							for(var id in fetchIds) ids.push(id);
							if (ids.length>0) {
								me.object.get(function(objs) {
									var byId={};
									for(var o in objs) {
										byId[objs[o].Id]=objs[o];
										me.inherited[objs[o].Id]=objs[o];
									}
									for(var r in me.records) {
										if (me.records[r].value.ozeer>0) {
											if (byId[me.records[r].value.ozeer]!==undefined) {
												me.records[r].inheritedResponse=byId[me.records[r].value.ozeer];
											}
										}
									}
									me.updateInherited();
									if (typeof(callback)=="function") callback(me.records);
								},function(){},0,{recordIds:ids});
							}else{
								me.updateInherited();
								if (typeof(callback)=="function") callback(me.records);
							}
						};
					
					if (callback instanceof Array) {
						processFetched(callback);
					}else if (this.record.object.Id>0) {
						this.object.get(processFetched,
							function() {

							},0,filter
						);
					}else{
						processFetched([]);
					}
				}else{
					this.updateInherited();
					if (typeof(callback)=="function") callback(this.records);
				}
			},
			updateInherited:function() {
				for(var r in this.records) {
					if (this.records[r].value.ozeer>0 && this.records[r].inheritedResponse!==undefined) {
						var from=this.records[r].inheritedResponse;
						var to=this.records[r];
						if (to.Id===null || from.value.nsabm===true) {
							to.value.stsbn=from.value.stsbn;
							to.value.rpawr=from.value.rpawr;
							to.value.zwhln=from.value.zwhln;
							to.value.jzowf=$.extend({},from.value.jzowf);
						}
						to.value[this.filterkey]=this.record.object.Id;
					}
				}
				this.record.object.setValue(kloe.schema.actionPlanCountField,this.records.length);
			},
			applyInheritance:function(list,getExisting) {
				for(var l in list) {
					this.inherited[list[l].Id]=list[l];
				}
				if (getExisting!==false) this.getExisting(function(){});
			},
			makeClone:function(obj) {
				var newEvidence=this.object.add();
				newEvidence.inheritedResponse=obj;
				newEvidence.value.ozeer=obj.Id;
				return newEvidence;
			}
		};
		this.editSection = function(ele) {
			var div=yoodoo.e("div");
			div.source=this;
			div.ele=ele;
			div.disable=function(disabled) {
				$(this).find("input,select,textarea").each(function(i,e) {
					e.disabled=disabled;
				});
				if (disabled) {
					$(this).addClass("disabled");
				}else{
					$(this).removeClass("disabled");
				}
			};
			div.empty=function(empty) {
				if (empty) {
					$(this).addClass("isEmpty");
				}else{
					$(this).removeClass("isEmpty");
				}
			};
			return $(div).addClass("recordSection").append(ele);
		};
		this.edit = function() {
			var me = this;
			var back = $(yoodoo.e("button")).attr("type", "button").addClass("backButton").click(function() {
				me.update();
				me.item.context.showRecord(false);
			}).html(this.item.title).prepend(kloe.icon(this.item.context.icons.left,20,20,100,100,{'4D4D4D':'FFFFFF'}));
			var rows=[];
			var confirm = $(yoodoo.e("div")).addClass("deleteConfirm").css({
			}).html(
				'Delete this?'
			).append(
				$(yoodoo.e("button")).attr("type", "button").html("yes").click(function() {
					me.remove();
				}).css({background:'#'+this.item.context.colours.red})
			).append(
				$(yoodoo.e("button")).attr("type", "button").html("cancel").click(function() {
					confirm.removeClass("on");
				}).css({background:'#'+this.item.context.colours.cyan})
			);
			var del = $(yoodoo.e("button")).attr("type", "button").addClass("delButton").click(function() {
				confirm.addClass("on");
			}).html('delete').css({
				'border-radius':'50px',
				float:'right'
			});
			this.emptyButton=null;
			if (this.object===null) {
				this.emptyButton=$(yoodoo.e("button")).attr("type","button").addClass('emptyRecordButton').html("next input").click(function() {
					var empty=$(me.scrollArea).find(".recordSection.isEmpty:not(.disabled)");
					if (empty.get().length>0) {
						var target=empty.first();
						var t=target.offset().top;
						var b=t+target.outerHeight();
						var saTop=me.scrollArea.offset().top;
						var saST=me.scrollArea.get(0).scrollTop;
						//var saH=me.scrollArea.height();
						var top=t+saST-saTop;
						me.scrollArea.animate({scrollTop:top-20});
					}
				});
				this.checkEmptyRecord=function() {
					var empty=$(me.scrollArea).find(".recordSection.isEmpty:not(.disabled)");
					if (empty.get().length>0) {
						var target=empty.first();
						var t=target.offset().top;
						var b=t+target.outerHeight();
						var saTop=me.scrollArea.offset().top;
						var saST=me.scrollArea.get(0).scrollTop;
						var saH=me.scrollArea.height();
						if (b>saTop+saH) {
							me.emptyButton.addClass("on");
						}else{
							me.emptyButton.removeClass("on");
						}
					}else{
						me.emptyButton.removeClass("on");
					}
				};
			}else{
				this.checkEmptyRecord=function(){};
			}
			this.scrollArea=$(yoodoo.e("div")).bind("scroll",function() {
				me.checkEmptyRecord();
			});
			/*this.inputs.text=$(yoodoo.e("input")).attr("type","text").attr("placeholder",this.item.textPlaceholder).val(this.text).bind("change",function() {
			 me.text=this.value;
			 });*/
			var updateSection=function(empty) {
				var ip=(this.input===undefined)?this:this.input;
				var section=yoodoo.parentOfType(ip,['.recordSection']);
				if (section!==false) section.empty(empty);
				me.checkEmptyRecord();
			};
//				console.log(this);
			if (kloe.upgraded) {
				var form=$(yoodoo.e("div"));
				if (typeof(this.object.value[this.item.context.schema.textField])!="object" && this.object.value[this.item.context.schema.textField]!==null) this.object.value[this.item.context.schema.textField]={};
				// how
				var textareakey=me.object.object.parameters[me.item.context.schema.textField].json_schema[0].key;
				
				
				var disabled= (kloe.upgraded && this.object.inheritedResponse!==undefined && kloe.inheritedReadOnlyFields.lowlk!==undefined && this.object.inheritedResponse.value.nsabm===true);
				if (disabled) {
					form.append($(yoodoo.e("div")).addClass("yoodooUI").append(
						$(yoodoo.e("label")).html(this.item.prompt.value.zgsux.lowlk)
					).append(
						$(yoodoo.e("div")).addClass('disabledTextarea').css({width:'80%'}).html(this.object.value[this.item.context.schema.textField][textareakey])
					));
				}else{
					form.append(new yoodoo.ui.textarea({
						label:this.item.prompt.value.zgsux.lowlk,
						maxlength:0,
						disabled:disabled,
						rows:3,
						onchange:function() {
							//me.object.setValue(me.item.context.schema.textField,{textarea:this.value});
							var op={};
							op[textareakey]=this.value;
							me.object.value[me.item.context.schema.textField]=op;
							me.object.setValue(me.item.context.schema.displayField,this.value.substring(0,254));
							me.render();
							//console.log(me.object.value,me.item.context.schema.textField,op);
						}
					}).render(this.object.value[this.item.context.schema.textField][textareakey]));
				}
				
				
				var columns=$(yoodoo.e("div")).addClass("columns2");
				// status
				var stats=new yoodoo.ui.multiplechoice({
					label:this.item.prompt.value.zgsux.ulaff,
					radioBehaviour:true,
					columns:2,
					onchange:function(e) {
						$(e.target).css({
							background:kloe.statuses.recordsCache[this.value].getValue('Colour'),
							color:'#fff'
						}).parent().siblings('.yoodooUI_multiplechoiceButton').find('button').attr("style","");
						var val=this.value;
						if (val instanceof Array) val=val.pop();
						me.object.setValue(me.item.context.schema.statusField,val);
						if(kloe.statuses.recordsCache[val].getValue("Score")==0) {
							form.addClass("requireActionPlan");
						}else{
							form.removeClass("requireActionPlan");
						}
						me.item.update();
					}
				});
				if (this.score()==0) {
				//if(this.object.value[this.item.context.schema.statusField]>0 && kloe.statuses.recordsCache[this.object.value[this.item.context.schema.statusField]].getValue("Score")==0) {
					form.addClass("requireActionPlan");
				}else{
					form.removeClass("requireActionPlan");
				}
						
				for(var b in kloe.statuses.records) {
					var opt=kloe.statuses.records[b];
					var cssBackgroundColour='';
					var cssFontColour='';
					if (this.object.value[this.item.context.schema.statusField]==opt.Id) {
						cssBackgroundColour=opt.getValue('Colour');
						cssFontColour='#fff';
					}
					stats.add({
						label:opt.displayName(),
						value:opt.Id,
						labelClassName:opt.displayName().replace(/[^a-z^0-9]+/ig,''),
						cssBackgroundColour:cssBackgroundColour,
						cssFontColour:cssFontColour
					},opt.displayName().replace(/[^a-z^0-9]+/ig,''));
				}
				columns.append(stats.render(this.object.value[this.item.context.schema.statusField]));
				
				// expiry
				var expiry={
					container:$(yoodoo.e("div")).addClass("yoodooUI expiryInput"),
					record:this.object,
					item:this.item,
					baseRecord:me,
					key:me.item.context.schema.expiresField,
					update:function() {
						var me=this;
						this.container.empty().append(
							$(yoodoo.e("label")).html(this.item.prompt.value.zgsux.cdkna)
						).append(
							$(yoodoo.e("button")).attr("type","button").append(
								$(yoodoo.e("div")).html(yoodoo.ago(yoodoo.readDate(me.record.value[me.key])))
							).append(
								$(yoodoo.e("div")).html(yoodoo.formatDate("jS F Y",yoodoo.readDate(me.record.value[me.key])))
							).click(function() {
							//$(yoodoo.e("button")).attr("type","button").html(yoodoo.formatDate("jS F Y",yoodoo.readDate(me.record.value[me.key]))).click(function() {
								me.edit();
							})
						)
					},
					edit:function() {
						var me=this;
						var dialog=new yoodoo.ui.dialog({
							html:new yoodoo.ui.date({
								label:this.item.expiresPlaceholder,
								onchange:function() {
									me.record.setValue(me.key,yoodoo.formatDate('Y-m-d',this.value));
									me.baseRecord.expires=this.value;
									me.update();
								}
							}).render(yoodoo.readDate(this.record.value[this.key])),
							blockoutClickClose:true
						}).render();
					}
				};
				expiry.update();
				columns.append(expiry.container);
				form.append(columns);
				/*columns.append(new yoodoo.ui.date({
					label:this.item.expiresPlaceholder,
					onchange:function() {
						me.object.setValue(me.item.context.schema.expiresField,this.value);
					}
				}).render(this.object.value[this.item.context.schema.expiresField]));*/
				
				var columns=$(yoodoo.e("div")).addClass("columns2");
				if (this.evidence!==undefined) {
					this.evidence.update();
				}else{
					this.evidence={
						container:$(yoodoo.e("div")).addClass("loading").addClass("evidenceSummary").addClass("yoodooUI"),
						record:me,
						prompt:me.item.prompt,
						object:kloe.objectTypes[kloe.objectName.evidence],
						filterkey:kloe.objectTypes[kloe.objectName.evidence].getParameterReferingToObjectId(me.item.context.object.schema.Id),
						records:null,
						init:function() {
							if (this.records===null) {
								//if (this.record.object.Id>0) {
									var me=this;
									this.record.evidenceRecord.getExisting(
										function(objs) {
											me.records=objs;
											me.update();
										}
									);
									/*var filter={};
									filter[me.filterkey]=[me.record.object.Id,'equals'];
									this.object.get(
										function(objs) {
											me.records=objs;
											me.update();
										},
										function() {

										},0,filter
									);*/
								//}else{
								//	this.records=[];
								//	this.update();
								//}
							}
						},
						update:function() {
							var me=this;
							this.record.object.setValue(kloe.schema.evidenceCountField,this.records.length);
							this.container.removeClass("loading").empty().append(
								$(yoodoo.e("button")).attr("type","button").html('evidence entr'+((this.records.length==1)?'y':'ies')).prepend(
									$(yoodoo.e("div")).html(this.records.length).append(
										kloe.icon(kloe.icons.evidence,80,25,100,30,{'4D4D4D':(this.records.length>0)?kloe.colours.cyan:'dddddd'})
									)
								).unbind("click").click(function() {
										me.open();
								})
							);
						},
						editor:null,
						recordWindow:null,
						open:function() {
							var me=this;
							this.recordWindow=$(yoodoo.e("div")).addClass("recordWindow");
							this.editor=$(yoodoo.e("div")).addClass("responseEditor").append(
								$(yoodoo.e("div")).append(
									$(yoodoo.e("button")).attr("type","button").html("+").addClass("addButton").click(function() {
										me.add();
									})
								).append($(yoodoo.e("div")).addClass('losenge').append(
									$(yoodoo.e("button")).attr("type","button").html("back").addClass("backButton").click(function() {
										me.close();
									}).prepend(kloe.icon(kloe.icons.left,20,20,100,100,{'4D4D4D':'FFFFFF'}))
								).append(
									$(yoodoo.e("h3")).html("Your evidence")
								)).append(this.recordWindow)
							).css({height:'0%'}).click(function(e) {
								if (e.target===this) me.close();
							});
							for(var r in this.records) this.recordWindow.append(this.recordRow(this.records[r]));
							this.record.item.context.containers.record.append(this.editor);
							this.editor.animate({height:'100%'});
						},
						add:function() {
							var newRecord=this.object.add();
							newRecord.setValue(this.filterkey,this.record.object);
							this.records.push(newRecord);
							this.recordWindow.append(this.recordRow(newRecord,true));
							this.update();
						},
						close:function() {
							this.editor.animate({height:'0%'},500,function() {
								$(this).remove();
							});
						},
						recordRow:function(record,straightToEdit) {
							var form=$(yoodoo.e("div"));
							var rec=record;
							var me=this;
							var disabled=(rec.inheritedResponse!==undefined && rec.inheritedResponse.value.nsabm===true);
							var columns=$(yoodoo.e("div")).addClass("columns2");
							// evidence
							var complexData=rec.value[kloe.schema.evidenceField];
							if (complexData===null || typeof(complexData)!="object") {
								rec.value[kloe.schema.evidenceField]={};
								complexData=rec.value[kloe.schema.evidenceField];
							}
							
							if (disabled) {
								columns.append($(yoodoo.e("div")).addClass("yoodooUI").append(
									$(yoodoo.e("label")).html(this.prompt.value.zgsux.cqriw)
								).append(
									$(yoodoo.e("div")).addClass('disabledTextarea').html(complexData[kloe.schema.docField])
								));
							}else{
								columns.append(new yoodoo.ui.textarea({
									label:this.prompt.value.zgsux.cqriw,
									maxlength:0,
									disabled:disabled,
									rows:3,
									onchange:function() {
										complexData[kloe.schema.docField]=this.value;
										rec.setValue(kloe.schema.evidenceDisplayField,this.value.substring(0,254));
									}
								}).render(complexData[kloe.schema.docField]));
							}
							// evidence where
							if (disabled) {
								columns.append($(yoodoo.e("div")).addClass("yoodooUI").append(
									$(yoodoo.e("label")).html(this.prompt.value.zgsux.pgxmk)
								).append(
									$(yoodoo.e("div")).addClass('disabledTextarea').html(complexData[kloe.schema.docTypeField])
								));
							}else{
								columns.append(new yoodoo.ui.textarea({
									label:this.prompt.value.zgsux.pgxmk,
									maxlength:0,
									disabled:disabled,
									rows:3,
									onchange:function() {
										complexData[kloe.schema.docTypeField]=this.value;
									}
								}).render(complexData[kloe.schema.docTypeField]));
							}

							// file
							var docLink={
								record:rec,
								complexData:complexData,
								recordKey:kloe.schema.evidenceField,
								container:$(yoodoo.e("div")).addClass("yoodooUI"),
								link:$(yoodoo.e("span")),
								update:function(file) {
									var obj=this.complexData;
									//console.log(obj);
									if (obj===undefined) obj={};
									var keys={};
									if (this.record.object.parameters[this.recordKey].json_schema instanceof Array) {
										for(var i in this.record.object.parameters[this.recordKey].json_schema) {
											keys[this.record.object.parameters[this.recordKey].json_schema[i].title.en.toLowerCase()]=this.record.object.parameters[this.recordKey].json_schema[i].key;
										}
									}
									for(var k in keys) {
										if (obj[keys[k]]===undefined) obj[keys[k]]='';
									}

									if (file!==undefined) {
										for(var k in file) {
											if (keys[k.toLowerCase()]!==undefined) obj[keys[k.toLowerCase()]]=file[k];
										}
									}
									//console.log(obj);
									//console.log(obj,keys,file);
									this.complexData=obj;
									if (obj[keys.link]!='') {
										this.link.empty().append(
											$(yoodoo.e("a")).html(obj[keys.name]+' ('+kloe.byteSize(obj[keys.bytes])+')').attr("href",obj[keys.link]).attr("target","_blank")
										);
									}else{
										this.link.html('No file of evidence.');
									}
								}
							};
							if (disabled!==true) {
								this.record.item.context.dropbox.button(function(but) {
									docLink.container.append(docLink.link).append(but);
								},{
									success:function(file) {
										docLink.update(file[0]);
									}
								});
							}else{
								docLink.container.append(docLink.link)
							}
							columns.append(docLink.container);
							docLink.update();
							form.append(columns);

							if (rec.inheritedResponse===undefined && kloe.templater) {
								columns=$(yoodoo.e("div")).addClass("columns2");
								var div=$(yoodoo.e("div"));



								var lockinherit=new yoodoo.ui.checkbox({
									label:'Lock the data',
									onchange:function() {
										rec.value.nsabm=this.value;
									}
								});
								var lockdiv=lockinherit.render(rec.value.nsabm===true).css({display:(rec.value.znjjl===true)?'block':'none'});

				var subManagers = []
				for (var s in yoodoo.user.managerType.subManagers) subManagers.push(yoodoo.user.managerType.subManagers[s].name);
				var last = subManagers.pop();
				var subManagerString = ((subManagers.length > 0) ? (subManagers.join(',') + ' and ') : '') + last;
				div.append($(yoodoo.e("div")).html("This response is  a template for users in "+subManagerString));
				div.append(lockdiv);

								/*var subManagers=[]
								for(var s in yoodoo.user.managerType.subManagers) subManagers.push(yoodoo.user.managerType.subManagers[s].name);
								var last=subManagers.pop();
								var subManagerString=((subManagers.length>0)?(subManagers.join(',')+' and '):'')+last;
								var inherit=new yoodoo.ui.checkbox({
									label:'Template to '+subManagerString,
									onchange:function() {
										rec.value.znjjl=this.value;
										if (this.value===true) {
											lockdiv.slideDown();
										}else{
											lockdiv.slideUp();
										}
									}
								});
								div.append(inherit.render(rec.value.znjjl===true))

								div.append(lockdiv);*/


								columns.append(div);
								form.append(columns);
							}

							
							
							var but = $(yoodoo.e("button"));
							var clickBut=function() {
								var editorForm=new yoodoo.ui.dialog({
									html:$(yoodoo.e("div")).append(
										$(yoodoo.e("div")).append(
											$(yoodoo.e("h4")).html("Evidence entry"+(disabled?' [reference only]':''))
										).append(
											$(yoodoo.e("div")).addClass("recordWindow").append(form)
										)
									).css({
										width:yoodoo.option.width-80,
										//height:yoodoo.option.height-80,
										'max-height':yoodoo.option.height-80,
										'overflow-y':'auto'
									}),
									blockoutClickClose:true,
									closeButton :true,
									closedCallback :function() {
										$(but).find("span").html(rec.displayName());//$('<div/>').text(rec.displayName()).html());
									}
								}).render();//.insertAfter(me.editor).animate({height:'100%'});
								yoodoo.ui.update();
							};
							but.attr("type","button").append($(yoodoo.e("span")).html(rec.displayName())).click(function() {clickBut();}).prepend(
								$(yoodoo.e("button")).attr("type","button").html("delete").addClass("delButton").click(function(e) {
									e.preventDefault();
									if (me.remove(rec)) {
										$(this).parent().unbind("click").slideUp(500,function() {
											$(this).remove();
										});
										rec.erase();
									}
								})
							);
							if (straightToEdit===true) setTimeout(function() {
								clickBut();
							},500);
							return but;
						},
						remove:function(record) {
							if (!(record.Id>0) || window.confirm("Delete '"+record.displayName()+"'?")) {
								for(var r in this.records) {
									if (this.records[r]===record) {
										this.records.splice(r,1);
										this.update();
										return true;
									}
								}
							}
							return false;
						}
					};
				}
				columns.append(this.evidence.container);
				this.evidence.init();
				
				
				if (this.actionplans!==undefined) {
					this.actionplans.update();
				}else{
					this.actionplans={
						container:$(yoodoo.e("div")).addClass("loading").addClass("actionPlanSummary").addClass("yoodooUI"),
						record:me,
						prompt:me.item.prompt,
						object:kloe.objectTypes[kloe.objectName.actionPlans],
						filterkey:kloe.objectTypes[kloe.objectName.actionPlans].getParameterReferingToObjectId(me.item.context.object.schema.Id),
						records:null,
						init:function() {
							if (this.records===null) {
								//if (this.record.object.Id>0) {
									var me=this;
									this.record.actionPlanRecord.getExisting(
										function(objs) {
											me.records=objs;
											me.update();
										}
									);
								/*}else{
									this.records=[];
									this.update();
								}*/
							}
						},
						update:function() {
							var me=this;
							this.record.object.setValue(kloe.schema.actionPlanCountField,this.records.length);
							this.container.removeClass("loading").empty().append(
								$(yoodoo.e("button")).attr("type","button").html('action plan'+((this.records.length==1)?'':'s')).prepend(
									$(yoodoo.e("div")).html(this.records.length).append(
										kloe.icon(kloe.icons.walking,25,25,100,100,{'4D4D4D':(this.records.length>0)?kloe.colours.cyan:'dddddd'})
									)
								).unbind("click").click(function() {
										me.open();
								})
							);
						},
						editor:null,
						recordWindow:null,
						open:function() {
							var me=this;
							this.recordWindow=$(yoodoo.e("div")).addClass("recordWindow");
							this.editor=$(yoodoo.e("div")).addClass("responseEditor").append(
								$(yoodoo.e("div")).append(
									$(yoodoo.e("button")).attr("type","button").html("+").addClass("addButton").click(function() {
										me.add();
									})
								).append($(yoodoo.e("div")).addClass('losenge').append(
									$(yoodoo.e("button")).attr("type","button").html("back").addClass("backButton").click(function() {
										me.close();
									}).prepend(kloe.icon(kloe.icons.left,20,20,100,100,{'4D4D4D':'FFFFFF'}))
								).append(
									$(yoodoo.e("h3")).html("Your action plan")
								)).append(this.recordWindow)
							).css({height:'0%'}).click(function(e) {
								if (e.target===this) me.close();
							});
							for(var r in this.records) this.recordWindow.append(this.recordRow(this.records[r],false));
							this.record.item.context.containers.record.append(this.editor);
							this.editor.animate({height:'100%'});
						},
						add:function() {
							var newRecord=this.object.add();
							newRecord.setValue(this.filterkey,this.record.object);
							this.records.push(newRecord);
							this.recordWindow.append(this.recordRow(newRecord,true));
							this.update();
						},
						close:function() {
							this.editor.animate({height:'0%'},500,function() {
								$(this).remove();
							});
						},
						recordRow:function(record,straightToEdit) {
							var rec=record;
							var me=this;
							var disabled=(rec.inheritedResponse!==undefined && rec.inheritedResponse.value.nsabm===true);
							var complexData=rec.value[kloe.schema.actionPlanField];
							if (complexData===null || typeof(complexData)!="object") {
								rec.value[kloe.schema.actionPlanField]={};
								complexData=rec.value[kloe.schema.actionPlanField];
							}
							
							var form=$(yoodoo.e("div"));
							
							var columns=$(yoodoo.e("div")).addClass("columns2");
							// not met
							if (disabled) {
								columns.append($(yoodoo.e("div")).addClass("yoodooUI").append(
									$(yoodoo.e("label")).html(this.prompt.value.zgsux.owwor)
								).append(
									$(yoodoo.e("div")).addClass('disabledTextarea').html(complexData[kloe.schema.notmetField])
								));
							}else{
								columns.append(new yoodoo.ui.textarea({
									label:this.prompt.value.zgsux.owwor,
									rows:3,
									onchange:function() {
										complexData[kloe.schema.notmetField]=this.value;
										rec.setValue(kloe.schema.actionDisplayField,this.value.substring(0,254));
									},
									maxLength:0
								}).render(complexData[kloe.schema.notmetField]));
							}
							
							// plan of action
							if (disabled) {
								columns.append($(yoodoo.e("div")).addClass("yoodooUI").append(
									$(yoodoo.e("label")).html(this.prompt.value.zgsux.ustuv)
								).append(
									$(yoodoo.e("div")).addClass('disabledTextarea').html(complexData[kloe.schema.planField])
								));
							}else{
								columns.append(new yoodoo.ui.textarea({
									label:this.prompt.value.zgsux.ustuv,
									rows:3,
									onchange:function() {
										complexData[kloe.schema.planField]=this.value;
									},
									maxLength:0
								}).render(complexData[kloe.schema.planField]));
							}
							form.append(columns);
							
							
							
							var columns=$(yoodoo.e("div")).addClass("columns2");
							
							// measures to ensure
							if (disabled) {
								columns.append($(yoodoo.e("div")).addClass("yoodooUI").append(
									$(yoodoo.e("label")).html(this.prompt.value.zgsux.kmpgx)
								).append(
									$(yoodoo.e("div")).addClass('disabledTextarea').html(complexData[kloe.schema.ensureField])
								));
							}else{
								columns.append(new yoodoo.ui.textarea({
									label:this.prompt.value.zgsux.kmpgx,
									rows:3,
									onchange:function() {
										complexData[kloe.schema.ensureField]=this.value;
									},
									maxLength:0
								}).render(complexData[kloe.schema.ensureField]));
							}
							// resources
							if (disabled) {
								columns.append($(yoodoo.e("div")).addClass("yoodooUI").append(
									$(yoodoo.e("label")).html(this.prompt.value.zgsux.tmdor)
								).append(
									$(yoodoo.e("div")).addClass('disabledTextarea').html(complexData[kloe.schema.resourcesField])
								));
							}else{
								columns.append(new yoodoo.ui.textarea({
									label:this.prompt.value.zgsux.tmdor,
									rows:3,
									onchange:function() {
										complexData[kloe.schema.resourcesField]=this.value;
									},
									maxLength:0
								}).render(complexData[kloe.schema.resourcesField]));
							}
							form.append(columns);
							
							
							var columns=$(yoodoo.e("div")).addClass("columns2");
							
							// affects users
							if (disabled) {
								columns.append($(yoodoo.e("div")).addClass("yoodooUI").append(
									$(yoodoo.e("label")).html(this.prompt.value.zgsux.hroxo)
								).append(
									$(yoodoo.e("div")).addClass('disabledTextarea').html(complexData[kloe.schema.affectField])
								));
							}else{
								columns.append(new yoodoo.ui.textarea({
									label:this.prompt.value.zgsux.hroxo,
									rows:3,
									onchange:function() {
										complexData[kloe.schema.affectField]=this.value;
									},
									maxLength:512
								}).render(complexData[kloe.schema.affectField]));
							}
							var box=$(yoodoo.e("div"));
							
							
							// responsible
							var val=kloe.objectTypes[kloe.objectName.responsibility].recordsCache[rec.value[kloe.schema.responsibleField]];
							if (typeof(val)=="undefined") {
								val='';
							}else{
								val=val.displayName();
							}
							var ip=kloe.objectTypes[kloe.objectName.responsibility].searchBox(function(ele) {
								if (ele.record!==undefined) {
									rec.value[kloe.schema.responsibleField]=ele.record;
								}
							},{
								onchange:function() {
									rec.value[kloe.schema.responsibleField]=this.value;
								}
							}).val(val);
							box.append(
								$(yoodoo.e("div")).append(
									$(yoodoo.e("label")).html(this.prompt.value.zgsux.ofenc)
								).append(ip)
							);
							
							
							
							/*yoodoo.object.objectNames['KLOE responsibility'].selector({Key:kloe.schema.responsibleField,label:this.record.item.responsiblePlaceholder},rec,function(ele) {
								columns.append(ele);
							});*/
							
							// responsible manager
							var val=kloe.objectTypes[kloe.objectName.responsibility].recordsCache[rec.value[kloe.schema.managerField]];
							if (typeof(val)=="undefined") {
								val='';
							}else{
								val=val.displayName();
							}
							var ip=kloe.objectTypes[kloe.objectName.responsibility].searchBox(function(ele) {
								if (ele.record!==undefined) {
									rec.value[kloe.schema.managerField]=ele.record;
								}
							},{
								onchange:function() {
									rec.value[kloe.schema.managerField]=this.value;
								}
							}).val(val);
							box.append(
								$(yoodoo.e("div")).append(
									$(yoodoo.e("label")).html(this.prompt.value.zgsux.eqmls)
								).append(ip)
							);
							
							columns.append(box);
							
							/*yoodoo.object.objectNames['KLOE responsibility'].selector({Key:kloe.schema.managerField,label:this.record.item.managePlaceholder},rec,function(ele) {
								columns.append(ele);
							});*/
							form.append(columns);



							if (rec.inheritedResponse===undefined && kloe.templater) {
								columns=$(yoodoo.e("div")).addClass("columns2");
								var div=$(yoodoo.e("div"));


								var lockinherit=new yoodoo.ui.checkbox({
									label:'Lock the data',
									onchange:function() {
										rec.value.nsabm=this.value;
									}
								});
								var lockdiv=lockinherit.render(rec.value.nsabm===true).css({display:(rec.value.znjjl===true)?'block':'none'});

				var subManagers = []
				for (var s in yoodoo.user.managerType.subManagers) subManagers.push(yoodoo.user.managerType.subManagers[s].name);
				var last = subManagers.pop();
				var subManagerString = ((subManagers.length > 0) ? (subManagers.join(',') + ' and ') : '') + last;
				div.append($(yoodoo.e("div")).html("This response is  a template for users in "+subManagerString));
				div.append(lockdiv);

								/*var subManagers=[]
								for(var s in yoodoo.user.managerType.subManagers) subManagers.push(yoodoo.user.managerType.subManagers[s].name);
								var last=subManagers.pop();
								var subManagerString=((subManagers.length>0)?(subManagers.join(',')+' and '):'')+last;
								var inherit=new yoodoo.ui.checkbox({
									label:'Template to '+subManagerString,
									onchange:function() {
										rec.value.znjjl=this.value;
										if (this.value===true) {
											lockdiv.slideDown();
										}else{
											lockdiv.slideUp();
										}
									}
								});
								div.append(inherit.render(rec.value.znjjl===true))

								div.append(lockdiv);*/


								columns.append(div);
								form.append(columns);
							}

							
							
							var but = $(yoodoo.e("button"));
							var clickBut=function() {
								var editorForm=new yoodoo.ui.dialog({
									html:$(yoodoo.e("div")).append(
										$(yoodoo.e("div")).append(
											$(yoodoo.e("h4")).html("Action plan"+(disabled?' [limited]':''))
										).append(
											$(yoodoo.e("div")).addClass("recordWindow").append(form)
										)
									).css({
										width:yoodoo.option.width-80,
										//height:yoodoo.option.height-80,
										'max-height':yoodoo.option.height-80,
										'overflow-y':'auto'
									}),
									blockoutClickClose:true,
									closeButton :true,
									closedCallback :function() {
										$(but).find("span").html(rec.displayName());
									}
								}).render();//.insertAfter(me.editor).animate({height:'100%'});
								yoodoo.ui.update();
							};
							but.attr("type","button").append($(yoodoo.e("span")).html(rec.displayName())).click(function() {clickBut();}).prepend(
								$(yoodoo.e("button")).attr("type","button").html("delete").addClass("delButton").click(function(e) {
									e.preventDefault();
									if (me.remove(rec)) {
										$(this).parent().unbind("click").slideUp(500,function() {
											$(this).remove();
										});
										rec.erase();
									}
								})
							);
							if (straightToEdit===true) setTimeout(function() {
								clickBut();
								yoodoo.ui.update();
							},500);
							return but;
						},
						remove:function(record) {
							if (!(record.Id>0) || window.confirm("Delete '"+record.displayName()+"'?")) {
								for(var r in this.records) {
									if (this.records[r]===record) {
										this.records.splice(r,1);
										this.update();
										return true;
									}
								}
							}
							return false;
						}
					};
				}
				columns.append(this.actionplans.container);
				this.actionplans.init();
				
				
				form.append(columns);
				
				columns=$(yoodoo.e("div")).addClass("columns2");
				var pir=new yoodoo.ui.checkbox({
					label:'Reserve for PIR',
					onchange:function() {
						me.object.value.drkdn=this.value;
					}
				});
				columns.append(pir.render(this.object.value.drkdn===true));
				
				if (kloe.templater) {
					var div=$(yoodoo.e("div"));
					
					
					var lockinherit=new yoodoo.ui.checkbox({
						label:'Lock the data',
						onchange:function() {
							me.object.value.nsabm=this.value;
						}
					});
					var lockdiv=lockinherit.render(this.object.value.nsabm===true);
					
					var subManagers = []
					for (var s in yoodoo.user.managerType.subManagers) subManagers.push(yoodoo.user.managerType.subManagers[s].name);
					var last = subManagers.pop();
					var subManagerString = ((subManagers.length > 0) ? (subManagers.join(',') + ' and ') : '') + last;
					div.append($(yoodoo.e("div")).html("This response is  a template for users in "+subManagerString));
					div.append(lockdiv);
					
					columns.append(div);
				}
				form.append(columns);
				/*
				var columns=$(yoodoo.e("div")).addClass("columns2");
				// evidence
				columns.append(new yoodoo.ui.text({
					label:this.item.docPlaceholder,
					onchange:function() {
						me.object.setValue(me.item.context.schema.docField,this.value);
					}
				}).render(this.object.value[this.item.context.schema.docField]));
				
				// evidence where
				columns.append(new yoodoo.ui.text({
					label:this.item.docTypePlaceholder,
					onchange:function() {
						me.object.setValue(me.item.context.schema.docTypeField,this.value);
					}
				}).render(this.object.value[this.item.context.schema.docTypeField]));
				
				// file
				var docLink={
					record:this.object,
					recordKey:this.item.context.schema.fileField,
					container:$(yoodoo.e("div")).addClass("yoodooUI"),
					link:$(yoodoo.e("span")),
					update:function(file) {
						var obj=this.record.value[this.recordKey];
						var keys={};
						if (this.record.object.parameters[this.recordKey].json_schema instanceof Array) {
							for(var i in this.record.object.parameters[this.recordKey].json_schema) {
								keys[this.record.object.parameters[this.recordKey].json_schema[i].title.en.toLowerCase()]=this.record.object.parameters[this.recordKey].json_schema[i].key;
							}
						}
						for(var k in keys) obj[keys[k]]='';
						
						if (file!==undefined) {
							for(var k in file) {
								if (keys[k.toLowerCase()]!==undefined) obj[keys[k.toLowerCase()]]=file[k];
							}
						}
						console.log(obj,keys,file);
						this.record.value[this.recordKey]=obj;
						if (obj[keys.link]!='') {
							this.link.empty().append(
								$(yoodoo.e("a")).html(obj[keys.name]+' ('+kloe.byteSize(obj[keys.bytes])+')').attr("href",obj[keys.link]).attr("target","_blank")
							);
						}else{
							this.link.html('No file of evidence.');
						}
					}
				};
				this.item.context.dropbox.button(function(but) {
					docLink.container.append(docLink.link).append(but);
				},{
					success:function(file) {
						docLink.update(file[0]);
					}
				});
				columns.append(docLink.container);
				form.append(columns);
				docLink.update();
				
				// action plan
				var actionPlan=$(yoodoo.e("div")).addClass("actionPlanForm");
				
				// plan of action
				
				actionPlan.append(new yoodoo.ui.text({
					label:this.item.actionplanPlaceholder,
					onchange:function() {
						me.object.value[me.item.context.schema.actionPlanField][me.item.context.schema.planField];
					}
				}).render(this.object.value[me.item.context.schema.actionPlanField][me.item.context.schema.planField]));
				form.append(actionPlan);
				*/
				var me=this;
				
				/*
				var form=this.object.input([this.item.context.schema.textField]);
				
					this.item.context.schema.textField,
					this.item.context.schema.expiresField,
					this.item.context.schema.statusField,
					this.item.context.schema.docField,
					this.item.context.schema.docTypeField
				]);*/
				//console.log(form);
				this.scrollArea.append(form);
				
				this.item.context.containers.record.empty().append(
					$(yoodoo.e("div")).append(
						$(yoodoo.e("h3")).html('Response').append(
						$(yoodoo.e("button")).attr("type", "button").html("i").click(function() {
							me.item.context.help(me.item.help, me.item.helpVoice);
						}).addClass('info')
					)
					).prepend(back).css({
						position:'absolute',
						height:50,
						top:0,
						width:'100%'
					}).prepend(confirm).prepend(del)
				).append(
					$(yoodoo.e("div")).css({
						'box-sizing':'border-box',
						padding:'50px 0px 0px 0px',
						height:'100%'
					}).append(this.scrollArea.css({
						//'overflow-y':'scroll',
						height:'100%'
					}))
				).append(
					this.emptyButton
				).css({position:'relative'});
			}else{
				this.inputs.text = new yoodoo.ui.textarea({
					label : this.item.textPlaceholder,
					onchange : function() {
						me.text = this.value;
						updateSection.apply(this,[this.value=='']);
						me.update();
					},
					maxlength:0
				});
	
				this.inputs.status = this.item.context.statusBox();
				this.inputs.status.val(this.status).bind("change", function() {
					if (kloe.upgraded) {
						me.object.setValue(kloe.schema.statusField,this.value);
					}else{
						me.status = this.value;
					}
					var needsattention=false;
					if (me.status=='needsattention') needsattention=true;
					if (kloe.upgraded) needsattention=(me.item.context.statuses.recordsCache[me.object.value[kloe.schema.statusField]].getValue("Score")==0);
					if (needsattention) {
						//me.completeDate=null;
						$(me.scrollArea).find(".actionPlan").each(function(i,e) {
							e.disable(false);
						});
						//me.actionplan.slideDown();
					}else{
						$(me.scrollArea).find(".actionPlan").each(function(i,e) {
							e.disable(true);
						});
						//me.actionplan.slideUp();
						if (me.completeDate===null) {
							me.expires=new Date();
							me.expires.setDate(me.expires.getDate() + parseInt(me.item.defaultExpiryDays));
							me.expires.setMonth(me.expires.getMonth() + parseInt(me.item.defaultExpiryMonths));
							me.expires.setFullYear(me.expires.getFullYear() + parseInt(me.item.defaultExpiryYears));
						}else{
							me.expires=me.completeDate;
							me.expires.setDate(me.expires.getDate() + parseInt(me.item.defaultExpiryDays));
							me.expires.setMonth(me.expires.getMonth() + parseInt(me.item.defaultExpiryMonths));
							me.expires.setFullYear(me.expires.getFullYear() + parseInt(me.item.defaultExpiryYears));
						}
						me.inputs.date.setValue(me.expires);
						//me.inputs.date.value=me.expires;
						//me.inputs.date.update();
						me.completeDate=new Date();
					}
					$(this).css({
						background : me.statusColour()
					});
					updateSection.apply(this,[this.value=='']);
					me.checkEmptyRecord();
					me.update();
				});
				var col=this.statusColour();
				if (col!==null)
					this.inputs.status.css({
						background : col
					});
				this.inputs.date = new yoodoo.ui.date({
					label : this.item.expiresPlaceholder,
					//forceCalendar:true,
					onchange : function() {
						me.expires = this.value;
						me.update();
						me.item.updateRecords();
					}
				});
	
				var docLink = $(yoodoo.e("div")).css({
					width : '80%',
					margin : '2px auto'
				});
				docLink.file=$(yoodoo.e("div"));
				docLink.fileButton=$(yoodoo.e("div")).css({display:'inline-block','vertical-align':'middle'});
				docLink.fileEdit=$(yoodoo.e("div")).css({display:'inline-block','vertical-align':'middle',margin:'0px 0px 0px 10px'});
				docLink.append(
					docLink.file.append(docLink.fileButton).append(docLink.fileEdit)
				);
				var me=this;
				docLink.update=function() {
					if (me.file.link===undefined) return docLink.fileButton.html(me.item.fileEmptyPlaceholder);
					var thumb=me.item.filePlaceholder;
					if (typeof(me.file.thumbnailLink)=="string" && me.file.thumbnailLink.match(/^(http|https|ftp)\:\/\//i)) {
						thumb=yoodoo.e("img");
						thumb.src=me.file.thumbnailLink;
					}
					if (me.file.link.match(/^(http|https|ftp)\:\/\//i) !== null && me.file.link.match(/^[A-Za-z0-9\-\._\~\:\/\?#\[\]@!\$\&\'\(\)\*\+\,\;\=%]*$/i) !== null) {
						docLink.fileButton.empty().append($(yoodoo.e("a")).attr("target", "_blank").attr("href", me.file.link).append(thumb));
					} else if (me.file.link.match(/^(([a-zA-Z]{1})|([a-zA-Z]{1}[a-zA-Z]{1})|([a-zA-Z]{1}[0-9]{1})|([0-9]{1}[a-zA-Z]{1})|([a-zA-Z0-9][a-zA-Z0-9-_]{1,61}[a-zA-Z0-9]))\.([a-zA-Z]{2,6}|[a-zA-Z0-9-]{2,30}\.[a-zA-Z]{2,3})/i) !== null && me.file.link.match(/^[A-Za-z0-9\-\._\~\:\/\?#\[\]@!\$\&\'\(\)\*\+\,\;\=%]*$/i) !== null) {
						docLink.fileButton.empty().append($(yoodoo.e("a")).attr("target", "_blank").attr("href", 'http://' + me.file.link).append(thumb));
					} else if (me.file.link.match(/^[a-z]*\:\\/i) !== null) {
						docLink.fileButton.empty().append($(yoodoo.e("a")).attr("target", "_blank").attr("href", 'file://' + me.file.link).append(thumb));
					} else {
						docLink.fileButton.empty().append($(yoodoo.e("em")).html(me.file.link));
					}
				};
				docLink.update();
				this.inputs.doc = new yoodoo.ui.textarea({
					label : this.item.docPlaceholder,
					onchange : function() {
						if (kloe.upgraded) {
							me.object.setValue(kloe.schema.docField,this.value);
						}else{
							me.doc = this.value;
						}
						updateSection.apply(this,[this.value=='']);
						me.update();
					},
					maxlength:0
				});
				this.inputs.doctype = new yoodoo.ui.textarea({
					label : this.item.docTypePlaceholder,
					onchange : function() {
						if (kloe.upgraded) {
							me.object.setValue(kloe.schema.docTypeField,this.value);
						}else{
							me.doctype = this.value;
						}
						updateSection.apply(this,[this.value=='']);
						me.update();
					},
					maxlength:0
				});
	
	
				//this.dropbox=$(yoodoo.e("div"));
				var me=this;
				this.item.context.dropbox.button(function(but) {
					docLink.fileEdit.append(but);
				},{
					success:function(file) {
						me.file=file[0];
						docLink.update();
						//console.log(file);
					}
				});
				//docLink.fileEdit.append(this.dropbox);
	
				this.item.context.containers.record.empty().append(
					$(yoodoo.e("div")).append(
						$(yoodoo.e("h3")).html('Response').append(
						$(yoodoo.e("button")).attr("type", "button").html("i").click(function() {
							me.item.context.help(me.item.help, me.item.helpVoice);
						}).addClass('info')
					)
					).prepend(back).css({
						position:'absolute',
						height:50,
						top:0,
						width:'100%'
					}).prepend(confirm).prepend(del)
				).append(
					$(yoodoo.e("div")).css({
						'box-sizing':'border-box',
						padding:'50px 0px 0px 0px',
						height:'100%'
					}).append(this.scrollArea.css({
						'overflow-y':'scroll',
						height:'100%'
					}))
				).append(
					this.emptyButton
				).css({position:'relative'});
	
	
	
				rows.push(this.editSection.apply(this.inputs.text,[this.inputs.text.render(
					(this.object===null)?this.text:this.object.value[kloe.schema.textField]
				)]));
				rows.push(this.editSection.apply(this.inputs.date,[this.inputs.date.render(this.expires)]));
				rows.push(this.editSection.apply(this.inputs.status.get(0),[
					$(yoodoo.e("div")).addClass("yoodooUI yoodooUI_selectbox").append(
						$(yoodoo.e("label")).html(this.item.statusPlaceholder)
					).append(
						this.inputs.status
					)
				]));
				rows.push(this.editSection.apply(this.inputs.doc,[this.inputs.doc.render(
					(this.object===null)?this.doc:this.object.value[kloe.schema.docField]
				)]));
				
				rows.push(this.editSection.apply(this.inputs.doctype,[this.inputs.doctype.render(
					(this.object===null)?this.doctype:this.object.value[kloe.schema.docTypeField]
				)]));
	
				this.scrollArea.empty().append(
					$(yoodoo.e("div")).html(this.item.description).addClass("promptDescription")
				);
				/*.append(
					$(yoodoo.e("div")).append(
						$(yoodoo.e("div")).css({
							display : 'inline-block',
							width : '50%',
							'vertical-align' : 'top'
						}).append(
							this.inputs.text.render(this.text)
						).append(
							this.inputs.date.render(this.expires)
						).append(
							$(yoodoo.e("div")).addClass("yoodooUI yoodooUI_selectbox").append(
								$(yoodoo.e("label")).html(this.item.statusPlaceholder)
							).append(
								this.inputs.status
							)
						)
					).append(
						$(yoodoo.e("div")).css({
							display : 'inline-block',
							width : '50%',
							'vertical-align' : 'top'
						}).append(
							this.inputs.doc.render(this.doc)
						).append(
							this.inputs.doctype.render(this.doctype)
						)
					)
				);*/
				$(this.inputs.doctype.container).append(docLink);
	
	
	// action plan
	
				if (this.object===null) {
					this.inputs.responsibility = new yoodoo.ui.text({
						label : this.item.responsiblePlaceholder,
						onchange : function() {
							me.who = this.value;
							updateSection.apply(this,[this.value=='']);
							me.update();
						}
					});
				}else{
					this.inputs.responsibility=yoodoo.object.objectNames['KLOE responsibility'].searchBox(function() {console.log(arguments);},{});
				}
				this.inputs.actionplan = new yoodoo.ui.textarea({
					label : this.item.actionplanPlaceholder,
					onchange : function() {
						if (me.object===null) {
							me.action = this.value;
						}else{
							var obj=me.object.value[kloe.schema.actionPlanField];
							if (typeof(obj)!=="object" || obj===null) obj={};
							obj[kloe.schema.planField]=this.value;
							me.object.value[kloe.schema.actionPlanField]=obj;
						}
						updateSection.apply(this,[this.value=='']);
						me.update();
					},
				maxlength:0
				});
				this.inputs.notmet = new yoodoo.ui.textarea({
					label : this.item.notMetPlaceholder,
					onchange : function() {
						if (me.object===null) {
							me.notmet = this.value;
						}else{
							var obj=me.object.value[kloe.schema.actionPlanField];
							if (typeof(obj)!=="object" || obj===null) obj={};
							obj[kloe.schema.notmetField]=this.value;
							me.object.value[kloe.schema.actionPlanField]=obj;
						}
						updateSection.apply(this,[this.value=='']);
						me.update();
					},
				maxlength:0
				});
				this.inputs.measures = new yoodoo.ui.textarea({
					label : this.item.measuresPlaceholder,
					onchange : function() {
						if (me.object===null) {
							me.measures = this.value;
						}else{
							var obj=me.object.value[kloe.schema.actionPlanField];
							if (typeof(obj)!=="object" || obj===null) obj={};
							obj[kloe.schema.ensureField]=this.value;
							me.object.value[kloe.schema.actionPlanField]=obj;
						}
						updateSection.apply(this,[this.value=='']);
						me.update();
					},
				maxlength:0
				});
				this.inputs.manager = new yoodoo.ui.text({
					label : this.item.managePlaceholder,
					onchange : function() {
						me.manager = this.value;
						updateSection.apply(this,[this.value=='']);
						me.update();
					}
				});
				this.inputs.sources = new yoodoo.ui.textarea({
					label : this.item.sourcesPlaceholder,
					onchange : function() {
						if (me.object===null) {
							me.sources = this.value;
						}else{
							var obj=me.object.value[kloe.schema.actionPlanField];
							if (typeof(obj)!=="object" || obj===null) obj={};
							obj[kloe.schema.resourcesField]=this.value;
							me.object.value[kloe.schema.actionPlanField]=obj;
						}
						updateSection.apply(this,[this.value=='']);
						me.update();
					},
				maxlength:0
				});
				this.inputs.affects = new yoodoo.ui.textarea({
					label : this.item.affectedPlaceholder,
					onchange : function() {
						if (me.object===null) {
							me.affects = this.value;
						}else{
							var obj=me.object.value[kloe.schema.actionPlanField];
							if (typeof(obj)!=="object" || obj===null) obj={};
							obj[kloe.schema.affectField]=this.value;
							me.object.value[kloe.schema.actionPlanField]=obj;
						}
						updateSection.apply(this,[this.value=='']);
						me.update();
					},
				maxlength:0
				});
	
	
				var ap={};
				if (kloe.upgraded) {
					ap=this.object.value[kloe.schema.actionPlanField];
				}
				rows.push(this.editSection.apply(this.inputs.actionplan,[this.inputs.actionplan.render(
					(this.object===null)?this.action:ap[kloe.schema.planField]
				)]).addClass("actionPlan"));
				rows.push(this.editSection.apply(this.inputs.responsibility,[(this.object===null)?this.inputs.responsibility.render(this.who):this.inputs.responsibility]).addClass("actionPlan"));
				rows.push(this.editSection.apply(this.inputs.notmet,[this.inputs.notmet.render(
					(this.object===null)?this.notmet:ap[kloe.schema.notmetField]
				)]).addClass("actionPlan"));
				rows.push(this.editSection.apply(this.inputs.measures,[this.inputs.measures.render(
					(this.object===null)?this.measures:ap[kloe.schema.ensureField]
				)]).addClass("actionPlan"));
				rows.push(this.editSection.apply(this.inputs.manager,[this.inputs.manager.render(this.manager)]).addClass("actionPlan"));
				rows.push(this.editSection.apply(this.inputs.sources,[this.inputs.sources.render(
					(this.object===null)?this.sources:ap[kloe.schema.resourcesField]
				)]).addClass("actionPlan"));
				rows.push(this.editSection.apply(this.inputs.affects,[this.inputs.affects.render(
					(this.object===null)?this.affects:ap[kloe.schema.affectField]
				)]).addClass("actionPlan"));
				/*this.actionplan=$(yoodoo.e("div")).append(
					this.inputs.actionplan.render(this.action)
				).append(
					this.inputs.responsibility.render(this.who)
				).append(
					this.inputs.notmet.render(this.notmet)
				).append(
					this.inputs.measures.render(this.measures)
				).append(
					this.inputs.manager.render(this.manager)
				).append(
					this.inputs.sources.render(this.sources)
				).append(
					this.inputs.affects.render(this.affects)
				);
				this.scrollArea.append(this.actionplan);*/
	
				while(rows.length>0) {
					var div=rows.shift()[0];
					this.scrollArea.append(div);
					//console.log(div.source.length,div.source instanceof Array,typeof(div.source),div.source);
					if (div.source!==undefined && div.source.length===undefined) updateSection.apply(div.source,[div.source.value=='']);
	
					if (rows.length>0) this.scrollArea.append($(yoodoo.e("div")).addClass("sectionLink"));
				}
			}
			if (kloe.upgraded===false) {
				var scrollArea=this.scrollArea.get(0);
				this.scrollArea.find("textarea,input,select").bind("focus",function() {
					var sect=yoodoo.parentOfType(this,['.recordSection']);
					var t=$(sect).offset().top;
					var st=$(scrollArea).offset().top;
					if (t>st) $(scrollArea).animate({
						scrollTop:scrollArea.scrollTop+(t-st)
					},500);
				});
			}

			yoodoo.ui.update();
			this.scrollArea.find('.actionPlan').each(function(i,e) {
				e.disable(me.status!='needsattention');
			});
				//this.actionplan.css({display:'none'});
			this.item.context.showRecord(true);
			this.checkEmptyRecord();
		};
	},
	help : function(text, sound) {
		var helpMessage = $(yoodoo.e("div")).html(text);
		var blockout = $(yoodoo.e("div")).addClass("blockout").click(function(e) {
			if (e.target.tagName!="A") {
				yoodoo.stopSound();
				$(this).fadeOut(300,function() {$(this).remove();});
			}
		}).append(helpMessage).prepend(
			$(yoodoo.e("h2")).html("Expert insight")
		);
		$(yoodoo.widget).append($(blockout).hide().fadeIn());
		if (typeof(sound)=="string" && sound.length>0) yoodoo.playSound(yoodoo.replaceDomain('domain:uploads/sitespecific/yoodoo.siteFolder/' + sound));
	},
	statusBox : function() {
		var sel = $(yoodoo.e("select"));
		sel.append($(yoodoo.e("option")).attr("value", '').html('Select a status').css({
			display : 'none'
		}));
		if (this.upgraded) {
			for (var k in yoodoo.object.objectNames['KLOE Status'].records) {
				var rec=yoodoo.object.objectNames['KLOE Status'].records[k];
				sel.append($(yoodoo.e("option")).attr("value", rec.Id).html(rec.displayName()).css({
					color : rec.getValue('Colour')
				}));
			}
		}else{
			for (var k in this.statuses) {
				sel.append($(yoodoo.e("option")).attr("value", k).html(this.statuses[k].title).css({
					color : (this.statuses[k].colour.match(/^\#/)?'':'#')+this.statuses[k].colour
				}));
			}
		}
		return sel;
	},
	displayed : function() {
		// called when the dooit is fully revealed
	},
	loadFields : function() {
		if (this.configkey === null) {
			if (array_of_global_fields.length>0) {
				this.configkey=array_of_global_fields[0];
			}
		}
		if (this.voiceoverkey === null) {
			for (var k in array_of_fields) {
				if (k!=this.configkey) {
					if (k.match(/_voiceover_record$/i)) {
						this.voiceoverkey = k;
					}
				}
			}
		}
		if (this.summarykey === null) {
			for (var k in array_of_fields) {
				if (k!=this.configkey && k!=this.voiceoverkey) {
					if (k.match(/_summary$/i)) {
						this.summarykey = k;
					} else if (k.match(/^kloe/i)) {
						this.key = k;
					}
				}
			}
		}
		if (this.configkey !== null) {
			try {
				eval('this.schema=' + Base64.decode(array_of_fields[this.configkey][1]) + ';');
			} catch(e) {
				this.schema = Base64.decode(array_of_fields[this.configkey][1]);
			}
			this.schema = dooit.decode(this.schema);
		}
		if (this.key !== null) {
			try {
				eval('this.value=' + array_of_fields[this.key][1] + ';');
			} catch(e) {
				this.value = array_of_fields[this.key][1];
			}
		}
		if (this.voiceoverkey !== null) {
			try {
				eval('this.voiceoverrecord=' + array_of_fields[this.voiceoverkey][1] + ';');
			} catch(e) {
				this.voiceoverrecord = array_of_fields[this.voiceoverkey][1];
			}
		}
		if (this.summarykey !== null) {
			try {
				eval('this.summary=' + array_of_fields[this.summarykey][1] + ';');
			} catch(e) {
				this.summary = array_of_fields[this.summarykey][1];
			}
		}
		for (var k in array_of_fields) {
			if (k != this.key && k != this.summarykey) {
				try {
					eval('this.fields["' + k + '"]=' + array_of_fields[k][1] + ';');
				} catch(e) {
					this.fields[k] = array_of_fields[this.key][1];
				}
			}
		}
		this.value = dooit.decode(this.value);
		this.fields = dooit.decode(this.fields);
	},
	transposeOptions : function(keys, obj) {
		for (var k in obj) {
			if ( typeof (obj[k]) == "object") {
				var thiskeys = keys.slice();
				thiskeys.push(k);
				this.transposeOptions(thiskeys, obj[k]);
			} else {
				this.setOption(keys, k, obj[k]);
			}
		}
	},
	setOption : function(keys, key, val) {
		try {
			var e = keys.join('.');
			if (e != '') {
				e = 'this.' + e;
			} else {
				e = 'this';
			}
			if (isNaN(key)) {
				e += '.' + key + "=val;";
			} else {
				e += '[' + key + ']=val;';
			}
			eval(e);

		} catch(e) {
		}
	},
	finishable : function() {
		var ok = true;
		return ok;
	},
	getvalue : function() {
		var v = {};
		v.title=yoodoo.dooittitle;
		v.structure=[];
		if (this.value.archived!==undefined) {
			v.archived=this.value.archived;
		}else if (this.upgraded) {
			v.archived={};
			for(var s in this.schema.sections) {
				for (var k in this.schema.sections[s].items) {
					var prompt=this.schema.sections[s].items[k];
					if (this.value[prompt.id] instanceof Array && this.value[prompt.id].length>0) {
						v.archived[prompt.id]=this.value[prompt.id];
					}
				}
			}
		}else if (!this.upgraded) {
			for (var s in this.schema.sections) {
				var section={
					name:this.schema.sections[s].title,
					description:this.schema.sections[s].shortDescription,
					prompts:[]
				};
				for (var k in this.schema.sections[s].items) {
					var prompt=this.schema.sections[s].items[k];
					section.prompts.push({
						id:prompt.id,
						title:prompt.title,
						action:prompt.actionplanPlaceholder,
						affected:prompt.affectedPlaceholder,
						description:prompt.description,
						evidence:prompt.docPlaceholder,
						evidenceType:prompt.docTypePlaceholder,
						deadline:prompt.expiresPlaceholder,
						file:prompt.filePlaceholder,
						responsible:prompt.responsiblePlaceholder,
						manager:prompt.managePlaceholder,
						measures:prompt.measuresPlaceholder,
						notmet:prompt.notMetPlaceholder,
						sources:prompt.sourcesPlaceholder,
						how:prompt.textPlaceholder,
						expiryWarning:this.schema.expiryWarningDays,
						suggestedCount:prompt.suggestedRecordsCount
					});
					v[this.schema.sections[s].items[k].id] = [];
					for (var r = 0; r < this.schema.sections[s].items[k].records.length; r++) {
						v[this.schema.sections[s].items[k].id].push(this.schema.sections[s].items[k].records[r].output());
					}
				}
				v.structure.push(section);
			}
		}
		return v;
	},
	getsummary : function() {
		var v = {
			warnings:this.fullWarnings(),
			compliance : 0,
			upgraded:this.upgraded,
			warning : null, // time to show a warning
			expired : null // time to show as expired
		};
		if (this.upgraded!==true) v.records=[];
		var score = 0;
		var total = 0;
		var warningDate=new Date();
		warningDate.setDate(warningDate.getDate()+this.schema.expiryWarningDays);
		warningDate=warningDate.getTime();
		for (var s in this.schema.sections) {
			score+=this.schema.sections[s].score();
			total++;
			var section=[];
			for (var k in this.schema.sections[s].items) {
				var item={suggested:this.schema.sections[s].items[k].suggestedRecordsCount,records:[]};

				for (var r = 0; r < this.schema.sections[s].items[k].records.length; r++) {
					//score += this.schema.sections[s].items[k].records[r].score();
					var record=this.schema.sections[s].items[k].records[r];
					var thiswarningDate=null;
					var thisexpiresDate=null;

					thiswarningDate=new Date(record.expires.getTime());
					thisexpiresDate=thiswarningDate.getTime();
					thiswarningDate.setDate(thiswarningDate.getDate()-this.schema.expiryWarningDays);
					thiswarningDate=thiswarningDate.getTime();

					if (record.status=='complete') {
						if (thiswarningDate!==null && (v.warning===null || v.warning>thiswarningDate)) v.warning=thiswarningDate;
						if (thisexpiresDate!==null && (v.expired===null || v.expired>thisexpiresDate)) v.expired=thisexpiresDate;
					}
					//total++;
					if (record.text!="") item.records.push({
						status:record.status,
						action:(record.action!=""),
						warning:new Date(record.expires.getFullYear(),record.expires.getMonth(),record.expires.getDate()-this.schema.expiryWarningDays),
						expires:new Date(record.expires.getTime())
					});
				}
				section.push(item);
			}
			if (!this.upgraded) v.records.push(section);
		}
		v.warning=(v.warning===null)?'':yoodoo.formatDate('d/m/Y',new Date(v.warning));
		v.expired=(v.expired===null)?'':yoodoo.formatDate('d/m/Y',new Date(v.expired));
		if (total>0) v.compliance = Math.round(score / total);
		return v;
	},
	output : function() {
		var summary=this.getsummary();
		var op = dooit.json(this.getvalue());
		array_of_fields[this.key][1] = op;
		var reply = {};
		eval('reply.EF' + array_of_fields[this.key][0] + '=op;');
		if (typeof(dooitInformation.dooitMeta.outcome)=="object") {
			for(var k in dooitInformation.dooitMeta.outcome) {
				if (typeof(k)=="string" && k.match(/expires$/)) {
					yoodoo.set_meta(k,summary.expired.toString());
				}else if (typeof(k)=="string" && k.match(/^kloe/)) {
					yoodoo.set_meta(k,summary.compliance.toString());
				}
			}
		}
		if (this.voiceoverkey!==null) {
			var op = dooit.json(this.voiceoverrecord);
			array_of_fields[this.voiceoverkey][1] = op;
			eval('reply.EF' + array_of_fields[this.voiceoverkey][0] + '=op;');
		}
		if (this.summarykey!==null) {
			var op = dooit.json(summary);
			array_of_fields[this.summarykey][1] = op;
			eval('reply.EF' + array_of_fields[this.summarykey][0] + '=op;');
		}
		return reply;
	},
	dropbox:{
		key:'ikow9fgantl7v95',
		testkey:'iytf2k47y2cttsh',
		loaded:false,
		install:function(complete) {
			var key=this.key;
			if (yoodoo.option.baseUrl=='http://paul.yoodoo.tv/') key=this.testkey;
			var me=this;
			if (typeof(Dropbox)=='undefined') {
				var s=yoodoo.e("script");
				s.src="https://www.dropbox.com/static/api/2/dropins.js";
				s.id='dropboxjs';
				s.type = 'text/javascript';
				$(s).attr('data-app-key',key);
				s.onload=function() {
					if (me.loaded===false) {
						me.loaded=true;
						complete();
					}
				};
				s.onreadystatechange=function() {
					if (me.loaded===false && (this.readyState == "complete" || this.readyState == "loaded")) {
						me.loaded=true;
						complete();
					}
				};
				var head = document.getElementsByTagName("head")[0];
				head.appendChild(s);
			}else{
				complete();
			}
		},
		button:function(callback,options) {
			this.install(function() {
				callback(Dropbox.createChooseButton(options));
			});
		}
	},
	byteSize:function(s) {
		var units=['b','kb','Mb'];
		var depth=1;
		while(s/Math.pow(2,depth*10)>10 && depth<units.length-1) depth++;
		var v=s/Math.pow(2,depth*10);
		return v.toFixed(1)+units[depth];
	}
};