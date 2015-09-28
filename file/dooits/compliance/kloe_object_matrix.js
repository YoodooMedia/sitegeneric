/* --- dooit layout ---
{
	dependencies:[
		['dooits/compliance/kloe_object_matrix.js',true],
		['css/compliance/kloe_matrix.css',true]
	],
	loaded:function(){
		matrix_kloe.init({});
	},
	saveValues:['matrix_kloe.output'],
	displayed:'matrix_kloe.displayed',
	finished:'matrix_kloe.finishable',
	orientation:'auto',
	options:{
		evidence_voiceover:{
			title:'Evidence Matrix voiceover url',
			value:'/uploads/library/4827e773d18793e626222eee34ef0842.mp3'
		},
		actionplan_voiceover:{
			title:'Action Plan voiceover url',
			value:'/uploads/library/9bd72a96bfcdfe9a5248da4a76027ddb.mp3'
		},
		actionplan_voiceover:{
			title:'Action Plan voiceover url',
			value:'/uploads/library/9bd72a96bfcdfe9a5248da4a76027ddb.mp3'
		},
		business_sector:{
			type:'objectrecord',
			title:'Object and Record defining the Business Sector',
			object_id:6,
			value:21
		},
		control_panel_view:{
			type:'view',
			title:'Object view Summarizing counts by Business Sector',
			value:21
		},
		prompt_count_view:{
			type:'view',
			title:'Object view showing the prompt count by Business Sector',
			value:20
		},
		response_count_view:{
			type:'view',
			title:'Object view showing the response count by Business Sector',
			value:19
		},
		kloe_prompt_object:{
			type:'object',
			title:'Object name for the Prompts',
			value:14
		},
		key_questions:{
			type:'object',
			title:'Object name for the Key Questions',
			value:7
		},
		kloe_response:{
			type:'object',
			title:'Object name for the Kloe Responses',
			value:9
		},
		action_plan_response:{
			type:'object',
			title:'Object name for the Kloe Action Plans',
			value:19
		},
		evidence_response:{
			type:'object',
			title:'Object name for the Kloe Evidence',
			value:18
		},
		responsibility:{
			type:'object',
			title:'Object name for the Kloe responsibility',
			value:16
		},
		pir_intervention:{
			title:'Intervention Id of the PIR',
			value:''
		}
 	}
 }
 */

dooit.temporaries('matrix_kloe');
var matrix_kloe = {
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
	key : null,
	schema : null,
	fields : {},
	prompts : {},
	kloes : [],
	kloeId : {},
	responseId : {},
	evidence:null,
	actionPlans:null,
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
			img:'/uploads/sitespecific/yoodoo.siteFolder/image/evidence4D4D4D.png',svg:'<path fill="#4D4D4D" d="M10.027,12.236l1.166,13.017c-1.41,0.127-2.819,0.252-4.229,0.38c-1.444,0.125,0.13-1.285,0.073-1.919c-0.089-0.996-0.178-1.992-0.268-2.989c-0.191-2.132-0.382-4.264-0.573-6.395c-0.072-0.778-1.979-1.572-0.072-1.743C7.426,12.47,8.727,12.353,10.027,12.236L10.027,12.236z M10.826,12.165l3.618-0.324l0.303,3.376c0.161,1.806-1.87-1.262-2.048-1.393C11.804,13.167,10.523,13.669,10.826,12.165L10.826,12.165z M11.403,19.111l-0.099-1.106c0.607-0.383,1.814-3.584,2.015-1.347c0.105,1.177,0.21,2.354,0.316,3.531C13.83,22.307,12.018,19.211,11.403,19.111C11.403,19.111,11.71,19.161,11.403,19.111z M12.002,25.181l-0.093-1.03c1.967-0.5,1.717-1.978,2.728-3.199c0.803-0.983,0.932,2.017,0.949,2.211c0.091,1.017,0.551,1.647-0.531,1.745C14.037,24.998,13.02,25.09,12.002,25.181L12.002,25.181z"/><path fill="#4D4D4D" d="M23.5,20.785L22.945,24.2l-2.361,0.211c-0.898-2.366-1.796-4.732-2.694-7.098c-0.473-1.246-0.945-2.491-1.418-3.736c-0.271-0.716-1.94-1.745-0.093-1.91c1.073-0.096,2.878-0.646,3.901-0.35c1.841-0.164,0.165,1.138,0.506,2.069C21.69,15.853,22.595,18.319,23.5,20.785L23.5,20.785z M23.719,19.392l-0.637-1.75c0.184-1.126,1.559-5.224-0.188-5.53c-1.079-0.276,0.053-1.034,0.467-1.071c0.679-0.061,1.358-0.122,2.037-0.182c1.144-0.104,0.841,0.927,0.089,1.203C23.923,13.023,23.979,17.822,23.719,19.392L23.719,19.392z"/><path fill="#4D4D4D" d="M33.092,23.29c-1.413,0.127-2.825,0.255-4.238,0.38c-1.444,0.131,0.129-1.286,0.072-1.918c-0.089-0.996-0.179-1.992-0.268-2.989c-0.191-2.132-0.382-4.263-0.574-6.395c-0.084-0.962-1.819-1.587,0.185-1.767c1.296-0.116,2.592-0.232,3.888-0.349c1.446-0.127-0.129,1.285-0.072,1.918c0.089,0.997,0.179,1.993,0.268,2.989c0.191,2.132,0.382,4.264,0.574,6.396C32.99,22.274,34.936,23.113,33.092,23.29L33.092,23.29z"/><path fill="#4D4D4D" d="M39.205,9.621l1.167,13.017c-1.41,0.127-2.819,0.255-4.229,0.379c-1.442,0.131,0.13-1.288,0.073-1.919c-0.089-0.996-0.178-1.992-0.268-2.988c-0.191-2.132-0.382-4.264-0.573-6.396c-0.072-0.777-1.979-1.572-0.072-1.743C36.604,9.854,37.904,9.738,39.205,9.621L39.205,9.621z M41.941,19.748l-0.674-7.524c-0.122-1.35-1.53-1.401-1.263-2.675c6.943-0.62,7.997,12.406,1.167,13.017c-0.029-0.318-0.151-0.719-0.093-1.03C41.944,21.212,42.02,20.621,41.941,19.748C41.941,19.748,41.972,20.085,41.941,19.748z"/><path fill="#4D4D4D" d="M51.128,8.552l1.167,13.017c-1.41,0.126-2.819,0.25-4.229,0.379c-1.445,0.131,0.128-1.286,0.071-1.919c-0.089-0.996-0.178-1.992-0.268-2.988c-0.191-2.132-0.382-4.264-0.573-6.396c-0.068-0.777-1.981-1.573-0.071-1.744C48.526,8.785,49.827,8.669,51.128,8.552L51.128,8.552z M51.927,8.48l3.618-0.324l0.303,3.376c0.161,1.805-1.87-1.262-2.049-1.393C52.904,9.483,51.622,9.986,51.927,8.48L51.927,8.48z M52.504,15.427l-0.099-1.106c0.606-0.383,1.813-3.584,2.014-1.348c0.106,1.178,0.212,2.355,0.317,3.533C54.923,18.623,53.123,15.527,52.504,15.427C52.504,15.427,52.81,15.477,52.504,15.427z M53.102,21.497l-0.092-1.03c1.13-0.29,2.02-1.061,2.396-2.188c0.162-0.484,0.993-2.064,1.13-0.482c0.436,0.717,0.226,2.512,0.303,3.366C55.593,21.273,54.347,21.386,53.102,21.497L53.102,21.497z"/><path fill="#4D4D4D" d="M62.099,7.569l5.566,8.383l0.378,4.205l-2.451,0.22c-1.335-1.995-2.669-3.99-4.004-5.986c-0.791-1.183-2.521-5.127-4.157-5.385c-1.304-0.333,0.703-1.082,1.078-1.116C59.705,7.783,60.902,7.676,62.099,7.569L62.099,7.569z M58.638,11.253l1.102,1.594l0.458,5.111c0.077,0.86,0.491,1.558,1.325,1.861c1.489,0.735-2.314,1.13-2.521,1.148c-1.88,0.168,0.117-1.541,0.22-2.118c0.135-0.757-0.052-1.657-0.119-2.41C58.947,14.71,58.793,12.982,58.638,11.253L58.638,11.253z M67.528,14.426l-1.105-1.622l-0.236-2.641c-0.066-0.747-1.82-2.354-1.424-2.713c0.519-0.477,2.097-0.309,2.741-0.366c1.451-0.13-0.429,2.282-0.336,3.316C67.288,11.742,67.408,13.084,67.528,14.426L67.528,14.426z"/><path fill="#4D4D4D" d="M74.275,6.218l0.104,1.154c-2.027,0.516-0.304,8.424-0.156,10.05c0.112,1.301,1.556,0.857,1.266,2.327C68.131,20.412,67.32,6.418,74.275,6.218L74.275,6.218z M75.09,7.317l-0.104-1.153c0.797,0.065,2.483,0.995,2.848-0.034c0.523-1.452,1.034,1.349,1.046,1.482c0.083,0.925,0.166,1.85,0.249,2.775c0.159,1.728-1.128,0.012-1.323-0.463C77.351,8.819,76.429,7.387,75.09,7.317C75.09,7.317,75.362,7.332,75.09,7.317z M76.225,19.684L76.12,18.52c0.867-0.147,1.659-0.745,2.093-1.499c0.186-0.323,0.504-2.271,1.248-1.53C80.906,16.943,77.363,19.525,76.225,19.684C76.225,19.684,76.744,19.611,76.225,19.684z"/><path fill="#4D4D4D" d="M85.011,5.515l1.167,13.017c-1.409,0.126-2.819,0.25-4.229,0.379c-1.445,0.125,0.129-1.283,0.071-1.919c-0.089-0.996-0.179-1.992-0.268-2.989c-0.191-2.132-0.382-4.264-0.573-6.396c-0.068-0.777-1.982-1.572-0.071-1.743C82.409,5.748,83.71,5.632,85.011,5.515L85.011,5.515z M85.81,5.443l3.618-0.324l0.303,3.376c0.161,1.805-1.87-1.262-2.049-1.393C86.787,6.446,85.505,6.949,85.81,5.443L85.81,5.443z M86.387,12.39l-0.1-1.106c0.608-0.383,1.814-3.583,2.015-1.347c0.105,1.177,0.211,2.354,0.316,3.532C88.812,15.585,87.002,12.489,86.387,12.39C86.387,12.39,86.692,12.439,86.387,12.39z M86.984,18.459l-0.092-1.03c1.131-0.288,2.018-1.062,2.396-2.188c0.162-0.483,0.993-2.065,1.13-0.482c0.436,0.716,0.226,2.512,0.303,3.367C89.476,18.236,88.229,18.348,86.984,18.459L86.984,18.459z"/><polygon fill="none" stroke="#4D4D4D" stroke-miterlimit="10" points="94.512,20.815 3.211,29 1.488,9.785 92.789,1.601 94.512,20.815 "/>'},
		downarrow:'<polygon fill="#4D4D4D" points="50,70 95,30 5,30 "/>'
	},
	colours:{
		red:'AB2A2A',
		amber:'EF9225',
		cyan:'619FEC',
		green:'1ADF23'
	},
	statuses:{
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
	dialcolours:{red:{r:171,g:42,b:42},grey:{r:200,g:200,b:200},amber:{r:239,g:146,b:37},green:{r:18,g:201,b:40}},
	dialColourRange:{
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
	},
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
				r : 171,
				g : 42,
				b : 42
			},
			mid : {
				r : 255,
				g : 153,
				b : 0
			},
			high : {
				r : 18,
				g : 201,
				b : 40
			}
		};
		this.render=function(v) {
			if (this.container===null) this.container=$(yoodoo.e("div")).addClass('kloe_numeric_dial');
			this.setValue(v);
			return this.container;
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
	type:'evidence',
	objectoptions:{
		prompts:'kloe_prompt_object',
		keyQuestions:'key_questions',
		//businessSector:'business_sector',
		responses:'kloe_response',
		actionPlans:'action_plan_response',
		evidence:'evidence_response',
		responsibility:'responsibility'
	},
	objects:{
		prompts:null,
		keyQuestions:null,
		//businessSector:null,
		responses:null,
		actionPlans:null,
		evidence:null,
		responsibility:null
	},
	viewoptions:{
		controlPanel:'control_panel_view',
		promptCount:'prompt_count_view',
		responseCount:'response_count_view'
	},
	views:{
		controlPanel:null,
		promptCount:null,
		responseCount:null
	},
	keyQuestionTitles:[
		'Safe',
		'Effective',
		'Caring',
		'Responsive',
		'Well-led'
	],
	pir_intervention:null,
	data:{
		
	},
	businessSector:null,
	init : function() {
		this.loadFields();
		if (!(this.value!==null && typeof(this.value)=="object")) this.value={};
		this.containers.container = $(this.selectors.container).addClass("kloe_matrix");
		if (this.containers.container !== null) {
			if (this.value == '')
				this.value = {};
			var me = this;
			yoodoo.businessSector.check(
			function(businessSector) {
				me.businessSector=businessSector;
				yoodoo.kloeStatus.getWarning(function(obj){
					yoodoo.keyQuestion.get(function(rows){
						me.keyQuestions=$.extend([],rows);
						me.loadObjects(
							function() {
								me.loadViews(function() {
									me.processViews(function() {
										me.buildParameters();
										me.start();
									});
								});
							}
						);
					});
				});
			});
		}

	},
	buildParameters:function() {
		this.schema={
			actionPlans:{
				jzowf:{},
				rpawr:matrix_kloe.objects.actionPlans.parameters.rpawr.words[yoodoo.words.language],
				zwhln:matrix_kloe.objects.actionPlans.parameters.zwhln.words[yoodoo.words.language]
			},
			evidence:{
				vtyxa:{
					ripkx:'',
					fljpz:'',
					webwy:'',
					duedq:'',
				}
			},
			responses:{
				rjhub:matrix_kloe.objects.responses.parameters.rjhub.words[yoodoo.words.language],
				znajr:{
					hklsj:matrix_kloe.objects.responses.parameters.znajr.words[yoodoo.words.language]
				},
				ohrwc:matrix_kloe.objects.responses.parameters.ohrwc.words[yoodoo.words.language]
			},
			prompt:{
				lvzfz:{
					hklsj:matrix_kloe.objects.responses.parameters.znajr.words[yoodoo.words.language]
				},
				ohrwc:matrix_kloe.objects.responses.parameters.ohrwc.words[yoodoo.words.language]
			}
		};
		for(var j in matrix_kloe.objects.actionPlans.parameters.jzowf.json_schema) {
			this.schema.actionPlans.jzowf[matrix_kloe.objects.actionPlans.parameters.jzowf.json_schema[j].key]=matrix_kloe.objects.actionPlans.parameters.jzowf.json_schema[j].title[yoodoo.words.language];
		}
		for(var j in matrix_kloe.objects.evidence.parameters.vtyxa.json_schema) {
			if (this.schema.evidence.vtyxa[matrix_kloe.objects.evidence.parameters.vtyxa.json_schema[j].key]!==undefined) {
				this.schema.evidence.vtyxa[matrix_kloe.objects.evidence.parameters.vtyxa.json_schema[j].key]=matrix_kloe.objects.evidence.parameters.vtyxa.json_schema[j].title[yoodoo.words.language];
			}
		}
		
	},
	loadObjects:function(callback) {
		var me=this;
		var objIds=[];
		for(var k in this.objectoptions) {
			if (dooit.options[this.objectoptions[k]].object_id!==undefined) {
				objIds.push(dooit.options[this.objectoptions[k]].object_id);
			}else if (dooit.options[this.objectoptions[k]].value>0) {
				objIds.push(dooit.options[this.objectoptions[k]].value);
			}
		}
		yoodoo.object.get(objIds,function(objs) {
			for(var k in me.objects) {
				if (objs.length>0) me.objects[k]=objs.shift();
			}
			var failed=false;
			for(var k in me.objects) {
				if ( me.objects[k]===null) failed=true;
			}
			if (failed) {
				me.failed('Not all objects found');
			}else{
				callback();
/*				if (dooit.options[me.objectoptions.businessSector].value>0) {
					me.objects.businessSector.get(function(objs) {
						if (objs.length>0) {
							me.businessSector=objs.pop();
							callback();
						}else{
							me.failed('Business Sector not found');
						}
					},function() {
						me.failed('Business Sector not found');
					},0,{
						recordIds:[dooit.options[me.objectoptions.businessSector].value]
					});
				}else{
					me.failed('Business Sector not defined');
				}*/
			}
		},function() {
			me.failed('Failed to get objects');
		});
	},
	loadViews:function(callback) {
		var me=this;
		var objIds=[];
		for(var k in this.viewoptions) {
			if (dooit.options[this.viewoptions[k]].value>0) {
				objIds.push(dooit.options[this.viewoptions[k]].value);
			}
		}
		var stage3=function() {
			if (yoodoo.object.views[dooit.options[me.viewoptions.responseCount].value]!==undefined && yoodoo.object.views[dooit.options[me.viewoptions.responseCount].value][0]!==undefined) {
				me.views.responseCount=yoodoo.object.views[dooit.options[me.viewoptions.responseCount].value][0];
				callback();
			}else{
				yoodoo.object.getView(dooit.options[me.viewoptions.responseCount].value,null,function(obj) {
					me.views.responseCount=obj;
					callback();
				},function() {
					me.failed('Failed to load Response Count View');
				},{businessSector:me.businessSector.Id});
			}
		};
		var stage2=function() {
			if (yoodoo.object.views[dooit.options[me.viewoptions.promptCount].value]!==undefined && yoodoo.object.views[dooit.options[me.viewoptions.promptCount].value][0]!==undefined) {
				me.views.promptCount=yoodoo.object.views[dooit.options[me.viewoptions.promptCount].value][0];
				stage3();
			}else{
				yoodoo.object.getView(dooit.options[me.viewoptions.promptCount].value,null,function(obj) {
					me.views.promptCount=obj;
					stage3();
				},function() {
					me.failed('Failed to load Prompt Count View');
				},{businessSector:me.businessSector.Id});
			}
		};
		if (yoodoo.object.views[dooit.options[me.viewoptions.controlPanel].value]!==undefined && yoodoo.object.views[dooit.options[me.viewoptions.controlPanel].value][0]!==undefined) {
			me.views.controlPanel=yoodoo.object.views[dooit.options[me.viewoptions.controlPanel].value][0];
			stage2();
		}else{
			yoodoo.object.getView(dooit.options[me.viewoptions.controlPanel].value,null,function(obj) {
				me.views.controlPanel=obj;
				stage2();
			},function() {
				me.failed('Failed to load Control Panel View');
			},{businessSector:me.businessSector.Id});
		}
	},
	getPromptCounts:function() {
		var arr={};
		for(var r in this.views.promptCount.results) {
			var result=this.views.promptCount.results[r];
			arr[result.columns[1]]=result.columns[0];
		}
		return arr;
	},
	getPromptScores:function() {
		var kq={};
		//var promptToKeyQuestion=this.objects.prompts.getParameterReferingToObjectId(this.objects.keyQuestions.schema.Id);
		for(var r in this.views.responseCount.results) {
			var result=this.views.responseCount.results[r];
			//var prompt=this.objects.prompts.recordsCache[result.columns[3]];
			var promptId=result.columns[3];
			var suggested=result.columns[4];
			var kqId=parseInt(result.columns[6][0]);
			if (promptId>0 && kqId>0) {
				var keyQuestion=yoodoo.keyQuestion.object.recordsCache[kqId];
				var name=keyQuestion.Id;
				//var recommendedKey=prompt.nameToKey['Suggested response count'];
				if (kq[name]===undefined) kq[name]={scores:[],total:0};
				var s=0;
				if (suggested>0) {
					s=result.columns[0]/suggested;
					if (s>1) s=1;
				}else if (result.columns[0]>0) {
					s=1;
				}
//console.log(prompt.displayName(),s);
				kq[name].scores.push(s);
				kq[name].total+=s;
			}
		}
		return kq;
	},
	processViews:function(callback) {
		var me=this;
		yoodoo.keyQuestion.get(function(rows){
			//console.log(rows);
			var actionPlanTotal=0;
			var evidenceTotal=0;
			var promptCounts=me.getPromptCounts();
			var promptScores=me.getPromptScores();
			for(var r in me.views.controlPanel.results) {
				var arr={};
				var result=me.views.controlPanel.results[r];
				for(var i in result.view.columns) {
					arr[result.view.columns[i]]=result.columns[i];
				}
				
				actionPlanTotal+=arr['Live Action Plans'];
				evidenceTotal+=arr['Evidence'];
				//console.log(arr);
				if (me.objects.keyQuestions.recordsCache[arr['Key Question']]===undefined) {
					me.failed('Lost link to Key Question');
				}else{
					var keyQuestion=me.objects.keyQuestions.recordsCache[arr['Key Question']];
					arr.keyQuestion=keyQuestion;
					var name=keyQuestion.Id;
					if (promptCounts[name]!==undefined) {
						arr.promptCount=promptCounts[name];
						if (promptScores[name]!==undefined) {
							arr.promptScores=promptScores[name];
//console.log(name,arr.promptScores.total,arr.promptCount);
							arr.score=Math.round(100*arr.promptScores.total/arr.promptCount);
						}
					}
					me.data[name]=arr;

				}
			}
					callback();
		});
	},
	failed:function(msg) {
		console.log(msg);
	},
	playVoiceOver:function() {
		var voiceOver=null;
		if (dooit.params.options[this.type+'_voiceover'].value!="") {
			this.voiceOverPlayer.load(dooit.params.options[this.type+'_voiceover'].value,this.value[this.type]!==true);
			this.value[this.type]=true;
		}
	},
	voiceOverPlayer:{
		file:null,
		load:function(file,play) {
			yoodoo.stopSound();
			this.stopped();
			this.file=file;
			if (this.file!==null && this.file!='') {
				matrix_kloe.containers.voiceoverPlayer.addClass("available");
				if (play) this.play();
			}else{
				matrix_kloe.containers.voiceoverPlayer.removeClass("available");
			}
		},
		play:function() {
			if (this.file!==null) {
				var me=this;
				if (matrix_kloe.containers.voiceoverPlayer.hasClass("playing")) {
					yoodoo.stopSound();
					this.stopped();
				}else{
					yoodoo.playSound(yoodoo.replaceDomain('audiodomain:'+this.file),function() {
						me.stopped();
					});
					matrix_kloe.containers.voiceoverPlayer.addClass("playing");
				}

			}
		},
		stop:function() {
			yoodoo.stopSound();
			this.stopped();
		},
		stopped:function() {
			matrix_kloe.containers.voiceoverPlayer.removeClass("playing");
		}
	},
	typeTitle:function(type) {
		if (typeof(type)=="undefined") type=this.type;
		switch(type) {
			case 'evidence':
				return 'Evidence Matrix';
			break;
			case 'actionplan':
				return 'Action Plans';
			break;
		}
		return '';
	},
	kloes:null,
	pdfStyles:{
		kloeHeader:{fontsize:24,lineheight:10,textalign:'C',fontcolor:[50,50,50]},
		keyLineHeader:{fontsize:18,lineheight:8,width:190,inline:true,relative:true,x:0,y:0,background:{r:153,g:153,b:153},fontcolor:[255,255,255]},
		keyLineDescription:{fontsize:10,lineheight:5,indent:10,fontcolor:[100,100,100]},
		promptHeader:{fontsize:14,lineheight:7,width:180,inline:true,relative:true,x:5,y:0,background:{r:221,g:221,b:221},fontcolor:[85,85,85]},
		promptDescription:{fontsize:10,lineheight:5,indent:20,fontcolor:[100,100,100]},
		label:{fontsize:10,lineheight:5,indent:20,fontcolor:[50,50,50]},
		response:{fontsize:10,lineheight:5,indent:30,fontcolor:[8,77,132]},
		responsibility:{fontsize:10,lineheight:5,indent:30,fontcolor:[30,148,243]},
		responselabel:{fontsize:10,lineheight:5,indent:15,fontcolor:[50,50,50]},
		responseresponse:{fontsize:10,lineheight:5,indent:20,fontcolor:[85,85,85]},
		actionPlanEvidenceTitle:{fontsize:12,textalign:'C',width:170,lineheight:6,inline:true,relative:true,x:10,y:0,background:{r:240,g:240,b:240},fontcolor:[85,85,85]},
		status:{fontsize:12,lineheight:6,textalign:'R',fontcolor:[255,255,255],width:180,inline:true,relative:true,x:5,y:0}
	},
	kloe : function(kq) {
		this.keyQuestion=kq;
		matrix_kloe.kloeId[this.keyQuestion.Id]=this;
		this.keyLines=[];
		this.attachKeyLines=function(keyLines) {
			this.keyLines=[];
			for(var k in keyLines) {
				this.keyLines.push(new matrix_kloe.keyLine(keyLines[k]));
			}
		};
		this.showResponse=function(res) {
			switch(this.type) {
				case 'evidence':
					return (res.doc!="");
				break;
				case 'actionplan':
					return (res.action!=""  && res.status=="needsattention");
				break;
			}
			return false;
		};
		this.noResponses=function() {
			switch(this.type) {
				case 'evidence':
					return 'No Evidence';
				break;
				case 'actionplan':
					return 'No Action Plans';
				break;
			}
			return false;
		};
		this.getpdf=function() {
			yoodoo.alert('Fetching '+this.pdf.filename+'.pdf',[],4);
			yoodoo.toPDF(this.pdf);
		};
		this.build=function() {
			if (this.container===undefined) this.container=$(yoodoo.e("div"));
			this.container.empty();
			this.revealer=$(yoodoo.e("div")).css({display:'none'});
			this.pdf={filename:matrix_kloe.typeTitle()+"-"+this.keyQuestion.displayName(),header:yoodoo.defaults.pdfHeader,content:[]};
			this.pdf.content.push($.extend({},matrix_kloe.pdfStyles.kloeHeader,{text:matrix_kloe.typeTitle()+' - '+this.keyQuestion.displayName()}));
			for(var h in this.pdf.header) {
				if (this.pdf.header[h].text!==undefined) this.pdf.header[h].text=this.pdf.header[h].text.replace(/\{user\}/g,yoodoo.user.getName());
			}
			var src=this;
			this.pdfbutton=$(yoodoo.e("button")).attr("type","button").addClass('getpdf').html("").click(function() {
				src.getpdf();
			});
			this.counter=$(yoodoo.e("div"));
			this.container.append(
				this.pdfbutton
			).append(
				$(yoodoo.e("h3")).html(
					$(yoodoo.e("span")).html(this.keyQuestion.displayName())
				).click(function() {
					if ($(this).hasClass("on")) {
						$(this).removeClass("on").next().slideUp({duration:1000,easing:'swing'});
					}else{
						$(this).addClass("on").next().slideDown({duration:1000,easing:'swing'});
					}
				}).prepend(
					matrix_kloe.doSVG?matrix_kloe.icon(matrix_kloe.icons.downarrow,20,20,100,100):$(yoodoo.e("div")).addClass("downArrow")
				).append(
					this.counter.css({
						float:'right'
					})
				)
			);
			this.container.append(this.revealer);
			var show=false;
			for(var k in this.keyLines) {
				var ans=this.keyLines[k].render();
				if (ans!==null) {
					show=true;
					this.revealer.append(ans.html);
					for(var r in ans.pdf) {
						this.pdf.content.push(ans.pdf[r]);
					}
				}
			}
			if (!show) this.container.empty().append(
				$(yoodoo.e("h3")).html(
						$(yoodoo.e("span")).html(this.keyQuestion.displayName())
					)
			);
			return null;
			
		};
		this.setCounter=function() {
			this.counter.empty();
			switch(me.type) {
				case "actionplan":
					var rep={};
					if (this.found>0) rep['4D4D4D']=me.colours.cyan;
					this.counter.append(
						$(matrix_kloe.icon(me.icons.walking,30,30,100,100,rep))
					).append(this.found).css({
						color:'#'+((this.found>0)?me.colours.cyan:'4d4d4d'),
						opacity:(this.found>0)?1:0.2
					});

				break;
				case "evidence":
					var rep={};
					if (this.found>0) rep['4D4D4D']=me.colours.cyan;
					this.counter.append(
						$(matrix_kloe.icon(me.icons.evidence,80,25,100,30,rep))
					).append(this.found).css({
						color:'#'+((this.found>0)?me.colours.cyan:'4d4d4d'),
						opacity:(this.found>0)?1:0.2
					});

				break;
			}
		};
		this.report=function() {
			this.build();
			return this.container;
		};
	},
	keyLine:function(obj) {
		this.keyLine=obj;
		this.prompts=[];
		for(var p in obj.items) {
			this.prompts.push(new matrix_kloe.prompt(obj.items[p]));
		}
		this.render=function() {
			var arr=[];
			for(var p in this.prompts) {
				var prompt=this.prompts[p].render();
				if (prompt!==null) arr.push(prompt);
			}
			if (arr.length>0) {
				var reply={
					html:$(yoodoo.e("div")).addClass("keyLine").append(
						$(yoodoo.e("label")).html(this.keyLine.value.ngtye)
					).append(
						$(yoodoo.e("p")).html(this.keyLine.value.dphdn.glfdn)
					), // key line info
					pdf:[] // key line info
				};
				reply.pdf.push({lineheight:1});
				reply.pdf.push($.extend({},matrix_kloe.pdfStyles.keyLineHeader,{text:this.keyLine.value.ngtye}));
				reply.pdf.push($.extend({},matrix_kloe.pdfStyles.keyLineDescription,{text:this.keyLine.value.dphdn.glfdn}));
				for(var a in arr) {
					if (arr[a].html!==undefined) reply.html.append(arr[a].html);
					if (arr[a].pdf!==undefined) {
						for(var r in arr[a].pdf) {
							reply.pdf.push(arr[a].pdf[r]);
						}
					}
				}
				//console.log(reply);
				return reply;
			}
			return null;
		};
	},
	prompt:function(obj) {
		this.prompt=obj;
		this.responseIds={};
		this.responses=[];
		matrix_kloe.prompts[this.prompt.Id]=this;
		this.attachResponse=function(obj) {
			if (this.responseIds[obj.Id]===undefined) {
				this.responseIds[obj.Id]=new matrix_kloe.response(obj);
				this.responses.push(this.responseIds[obj.Id]);
			}
		};
		this.render=function() {
			var arr=[];
			for(var p in this.responses) {
				var response=this.responses[p].render();
				if (response!==null) arr.push(response);
			}
			if (arr.length>0) {
				var reply={
					html:$(yoodoo.e("div")).addClass("prompt").append(
						$(yoodoo.e("label")).html(this.prompt.value.lvzfz)
					).append(
						$(yoodoo.e("p")).html(this.prompt.value.zgsux.asccj)
					), //prompt info
					pdf:[] //prompt info
				};
				reply.pdf.push({lineheight:1});
				reply.pdf.push($.extend({},matrix_kloe.pdfStyles.promptHeader,{text:this.prompt.value.lvzfz}));
				reply.pdf.push($.extend({},matrix_kloe.pdfStyles.promptDescription,{text:this.prompt.value.zgsux.asccj}));
				for(var a in arr) {
					if (arr[a].html!==undefined) reply.html.append(arr[a].html);
					if (arr[a].pdf!==undefined) {
						for(var r in arr[a].pdf) {
							reply.pdf.push(arr[a].pdf[r]);
						}
					}
				}
				//console.log(reply);
				return reply;
			}
			return null;
		};
	},
	response:function(obj){
		this.response=obj;
		matrix_kloe.responseId[this.response.Id]=this;
		this.actionPlans=[];
		this.evidence=[];
		this.attachActionPlan=function(obj) {
			this.actionPlans.push(new matrix_kloe.actionPlan(obj));
		};
		this.attachEvidence=function(obj) {
			this.evidence.push(new matrix_kloe.evidence(obj));
		};
		this.heading=function() {
			var html=$(yoodoo.e("div")).addClass("response");
			var pdf=[];
			pdf.push({lineheight:1});
			for(var k in matrix_kloe.schema.responses) {
				if (typeof(matrix_kloe.schema.responses[k])=="string") {
					var val=this.response.value[k];
					if (typeof(val)=="undefined") val='';
					if (matrix_kloe.objects.responses.parameters[k].type.ParameterTableColumn=="date") {
						var d=yoodoo.readDate(val);
						if (d instanceof Date) val=yoodoo.formatDate('jS F Y',d);
					}
					if (matrix_kloe.objects.responses.parameters[k].type.Name=="reference") {
						if (yoodoo.kloeStatus.object.recordsCache[val]!==undefined) {
							val=yoodoo.kloeStatus.object.recordsCache[val];
							html.append(
								$(yoodoo.e("div")).addClass("status").html(val.displayName()).css({
									background:val.value.xtsrn,
									color:'#fff'
								})
							).css({
								'border-color':val.value.xtsrn
							});
							var rgb=yoodooStyler.hexToRGB(val.value.xtsrn);
							pdf.push($.extend({},matrix_kloe.pdfStyles.status,{text:val.displayName(),background:rgb}));
						}
					}else{
						pdf.push($.extend({},matrix_kloe.pdfStyles.responselabel,{text:matrix_kloe.schema.responses[k]}));
						if (val!="") {
							html.append(
								$(yoodoo.e("div")).append(
									$(yoodoo.e("label")).html(matrix_kloe.schema.responses[k])
								).append(
									$(yoodoo.e("p")).html(val)
								)
							);
							pdf.push($.extend({},matrix_kloe.pdfStyles.responseresponse,{text:val}));
						}
					}
				}else{
					for(var j in matrix_kloe.schema.responses[k]) {
						html.append(
							$(yoodoo.e("div")).append(
								$(yoodoo.e("label")).html(matrix_kloe.schema.responses[k][j])
							).append($(yoodoo.e("p")).html(this.response.value[k][j]))
						);
						pdf.push($.extend({},matrix_kloe.pdfStyles.responselabel,{text:matrix_kloe.schema.responses[k][j]}));
						if (this.response.value[k][j]!==undefined && this.response.value[k][j]!="") pdf.push($.extend({},matrix_kloe.pdfStyles.responseresponse,{text:this.response.value[k][j]}));
					}
				}
			}
			return {html:html,pdf:pdf};
		},
		this.render=function() {
			var arr=[];
			if (matrix_kloe.type=="actionplan") {
				for(var p in this.actionPlans) {
					var actionplan=this.actionPlans[p].render();
					if (actionplan!==null) arr.push(actionplan);
				}
			}else{
				for(var p in this.evidence) {
					var evidence=this.evidence[p].render();
					if (evidence!==null) arr.push(evidence);
				}
			}
			var evidenceAndPlans=$(yoodoo.e("div")).addClass("evidenceAndPlans");
			if (arr.length>0) {
				/*var reply={
					html:$(yoodoo.e("div")).addClass('response').append(evidenceAndPlans), //response info
					pdf:[] //response info
				};*/
				var reply=this.heading();
				reply.html.append(evidenceAndPlans);
				for(var a in arr) {
					if (arr[a].html!==undefined) evidenceAndPlans.append(arr[a].html);
					if (arr[a].pdf!==undefined) {
						for(var r in arr[a].pdf) {
							reply.pdf.push(arr[a].pdf[r]);
						}
					}
					//if (arr[a].pdf!==undefined) reply.pdf=$.extend(reply.pdf,arr[a].pdf);
				}
				return reply;
			}
			return null;
		};
	},
	actionPlan:function(obj) {
		this.actionPlan=obj;
			
		this.render=function() {
			var html=$(yoodoo.e("div")).addClass("actionPlan evidenceAndPlansRecord");
			var pdf=[$.extend({},matrix_kloe.pdfStyles.actionPlanEvidenceTitle,{text:'Action plan'})];
			for(var k in matrix_kloe.schema.actionPlans) {
				if (typeof(matrix_kloe.schema.actionPlans[k])=="string") {
					var val=this.actionPlan.value[k];
					if (typeof(val)=="undefined") val='';
					pdf.push($.extend({},matrix_kloe.pdfStyles.label,{text:matrix_kloe.schema.actionPlans[k]}));
					if (matrix_kloe.objects.actionPlans.parameters[k].type.Name=="reference") {
						if (matrix_kloe.objects.responsibility.recordsCache[val]!==undefined) {
							val=matrix_kloe.objects.responsibility.recordsCache[val].displayName();
						}else{
							val='';
						}
						if (val!="") {
							html.append(
								$(yoodoo.e("label")).html(matrix_kloe.schema.actionPlans[k])
							).append(
								$(yoodoo.e("p")).html(val).css({color:'#1E94F3'})
							);
							pdf.push($.extend({},matrix_kloe.pdfStyles.responsibility,{text:val}));
						}
						
					}else if (val!="") {
						html.append(
							$(yoodoo.e("label")).html(matrix_kloe.schema.actionPlans[k])
						).append(
							$(yoodoo.e("p")).html(val)
						);
						pdf.push($.extend({},matrix_kloe.pdfStyles.response,{text:val}));
					}
				}else{
					for(var j in matrix_kloe.schema.actionPlans[k]) {
						html.append(
							$(yoodoo.e("label")).html(matrix_kloe.schema.actionPlans[k][j])
						).append(
							$(yoodoo.e("p")).html(this.actionPlan.value[k][j])
						);
						pdf.push($.extend({},matrix_kloe.pdfStyles.label,{text:matrix_kloe.schema.actionPlans[k][j]}));
						if (this.actionPlan.value[k][j]!==undefined && this.actionPlan.value[k][j]!="") pdf.push($.extend({},matrix_kloe.pdfStyles.response,{text:this.actionPlan.value[k][j]}));
					}
				}
			}
			return {html:html,pdf:pdf};
		};
	},
	evidence:function(obj) {
		//console.log("evidence",obj);
		this.evidence=obj;
		this.render=function() {
			var html=$(yoodoo.e("div")).addClass("evidence evidenceAndPlansRecord");
			var pdf=[$.extend({},matrix_kloe.pdfStyles.actionPlanEvidenceTitle,{text:'Evidence'})];
			for(var k in matrix_kloe.schema.evidence) {
				if (typeof(matrix_kloe.schema.evidence[k])=="string") {
					html.append(
						$(yoodoo.e("label")).html(matrix_kloe.schema.evidence[k])
					).append(
						$(yoodoo.e("p")).html(this.evidence.value[k])
					);
					pdf.push($.extend({},matrix_kloe.pdfStyles.label,{text:matrix_kloe.schema.evidence[k]}));
					if (this.evidence.value[k]!==undefined && this.evidence.value[k]!="") pdf.push($.extend({},matrix_kloe.pdfStyles.response,{text:this.evidence.value[k]}));
				}else{
					for(var j in matrix_kloe.schema.evidence[k]) {
						html.append(
							$(yoodoo.e("label")).html(matrix_kloe.schema.evidence[k][j])
						).append(
							$(yoodoo.e("p")).html(this.evidence.value[k][j])
						);
						pdf.push($.extend({},matrix_kloe.pdfStyles.label,{text:matrix_kloe.schema.evidence[k][j]}));
						if (this.evidence.value[k][j]!==undefined && this.evidence.value[k][j]!="") pdf.push($.extend({},matrix_kloe.pdfStyles.response,{text:this.evidence.value[k][j]}));
					}
				}
			}
			return {html:html,pdf:pdf};
		};
	},
	start : function() {
		var me=this;
		
		if (dooit.options.pir_intervention!==undefined && !isNaN(dooit.options.pir_intervention.value)) {
			this.pir_intervention=dooit.options.pir_intervention.value;
			if (this.pir_intervention>0) {
				var found=false;
				for(var i in yoodoo.bookcase.items) {
					if (yoodoo.bookcase.items[i].intervention!==undefined && yoodoo.bookcase.items[i].intervention==this.pir_intervention) found=true;
				}
				if (found===false) this.pir_intervention=null;
			}else{
				this.pir_intervention=null;
			}
		}
		
		
		// add the content to this.containers.container
		
		this.containers.report = $(yoodoo.e("div"));
		for(var k in this.fieldName) {
			if (this.fields[k]===undefined || this.fields[k]=="") this.fields[k]={title:this.fieldName[k].title};
			this.kloes[k]=this.kloe(this.fields[k]);
		}
		if (yoodoo.user.meta.yourService===undefined || yoodoo.user.meta.yourService=='') yoodoo.set_meta('yourService',yoodoo.user.managerType.name);
		var ip=$(yoodoo.e("input")).attr("type","text").val(dooit.decode(yoodoo.replaceMeta('__yourService|Your Service__'))).bind("blur",function() {
			yoodoo.set_meta('yourService',this.value);
		});
		this.containers.voiceoverPlayer=$(yoodoo.e("button")).attr("type","button").append(
			matrix_kloe.icon(this.icons.speaker,14,14,70,55,{'111111':'ffffff'})
		).addClass("voiceoverPlayer").click(function() {
			me.voiceOverPlayer.play();
		});
		this.containers.h2=$(yoodoo.e("h2")).html(
			$(yoodoo.e("span")).html(yoodoo.dooittitle)
		).append(this.containers.voiceoverPlayer).append(
			ip
		).append(
			$(yoodoo.e("span")).html("edit")
		);
		this.containers.overall=$(yoodoo.e("div")).addClass("overall");
		this.containers.arena=$(yoodoo.e("div"));
		this.containers.container.append(
			$(yoodoo.e("div")).addClass('controlPanel').append(this.containers.arena)
		).append(this.containers.h2).append(this.containers.overall);
		this.showControlPanel();
	},
	showControlPanel:function() {
		var me=this;
		var sum={
			plans:0,
			evidence:0,
			immediate:0,
			warnings:0,
			score:0,
			total:0
		};
		var kloe_summaries=$(yoodoo.e("div")).addClass("kloe_summaries");
		for(var k in this.keyQuestions) {
			var summary={
				immediate:0,
				plans:0,
				evidence:0,
				warnings:0,
				total:0,
				score:0
			};
			if (this.data[this.keyQuestions[k].Id]) {
				var arr=this.data[this.keyQuestions[k].Id];
				summary.immediate=arr['Immediate'];
				summary.plans=arr['Live Action Plans'];
				summary.evidence=arr['Evidence'];
				summary.warnings=arr['Imminent'];
				summary.responses=arr['Responses'];
				summary.score=arr['score'];
			}
				var but=yoodoo.e("button");
				but.key=k;
				sum.plans+=summary.plans;
				sum.evidence+=summary.evidence;
				sum.immediate+=summary.immediate;
				sum.warnings+=summary.warnings;
				sum.total++;
				if (isNaN(summary.score)) summary.score=0;
				sum.score+=summary.score;
			
				var icons=$(yoodoo.e("div")).addClass("summaryIcons");
				if (this.doSVG) {
					var dial = new yoodoo.ui.graphs.dial({
								balanced:50,
								tolerance:50,
								outerRadius:15,
								innerRadius:10,
								markBalance:false,
								colours : this.dialColourRange
							});
				}else{
					var dial=new this.nonSVG();
				}
				var rep={};
				if (summary.immediate>0) rep['4D4D4D']=this.colours.red;
				icons.append(
					$(yoodoo.e("div")).append(
						matrix_kloe.icon(this.icons.cross,20,20,100,100,rep)
					).append(
						summary.immediate
					).css({
						opacity:(summary.immediate>0)?1:0.5,
						color:(summary.immediate>0)?'#'+this.colours.red:'#555',
					})
				);
				rep={};
				if (summary.warnings>0) rep['4D4D4D']=this.colours.amber;
				icons.append(
					$(yoodoo.e("div")).append(
						matrix_kloe.icon(this.icons.tick,20,20,100,100,rep)
					).append(
						summary.warnings
					).css({
						opacity:(summary.warnings>0)?1:0.5,
						color:(summary.warnings>0)?'#'+this.colours.amber:'#555',
					})
				);
				rep={};
				if (summary.plans>0) rep['4D4D4D']=this.colours.cyan;
				icons.append(
					$(yoodoo.e("div")).append(
						matrix_kloe.icon(this.icons.walking,20,20,100,100,rep)
					).append(
						summary.plans
					).css({
						opacity:(summary.plans>0)?1:0.5,
						color:(summary.plans>0)?'#'+this.colours.cyan:'#555',
					})
				);
				var col=null;
				if (!(summary.responses>0)) {
					col=this.dialcolours.grey;
				}else if (summary.immediate>0) {
					col=this.dialcolours.red;
				}else if (summary.imminent>0) {
					col=this.dialcolours.amber;
				}else if (summary.score==100) {
					col=this.dialcolours.green;
				}
				//if (k==0) col=this.dialcolours.grey;
				//if (k==1) col=this.dialcolours.red;
				//if (k==2) col=this.dialcolours.amber;
				//if (k==3) col=this.dialcolours.green;
			(function(col) {
				var background={};
				var hoverColour={};
				if (col!==null) {
					background=$.extend({},col);
					var hoverColour=yoodooStyler.rgbToHex(yoodooStyler.tint(background,0.7,0.25));
					background=yoodooStyler.rgbToHex(yoodooStyler.tint(background,0.7,0.2));
				}else{
					background='#ebffce';
					hoverColour='#f7ffeb';
				}
				//var hoverColour=yoodooStyler.rgbToHex(yoodooStyler.tint(col,0.7,0.25));
				but.keyQuestion=this.keyQuestions[k];
				kloe_summaries.append(
					$(but).attr("type","button").html(this.keyQuestions[k].displayName()).click(function() {
						matrix_kloe.voiceOverPlayer.load('',false);
						yoodoo.nextActions.push('yoodoo.keyQuestion.open('+this.keyQuestion.Id+');');
						yoodoo.cancelDooit();
					}).append(icons).append(dial.render(this.dialRescale(summary.score),col)).css({background:background}).bind('mouseover',function() {
						$(this).css({background:hoverColour})
					}).bind('mouseout',function() {
						$(this).css({background:background})
					})
				);
			}).apply(this,[col]);
		}
		sum.score=(sum.total==0)?0:Math.round(sum.score/sum.total);
		sum.score=(sum.score>100)?100:((sum.score<0)?0:sum.score);
		var evidencerep={};
		if (sum.evidence>0) evidencerep['4D4D4D']=this.colours.cyan;

		var plansrep={};
		if (sum.plans>0) plansrep['4D4D4D']=this.colours.cyan;

		if (this.pir_intervention!==null) {
			var pir=$(yoodoo.e("button")).attr("type","button").html('My PIR').append(
					/*$(yoodoo.e("div")).html(sum.evidence).prepend(
						matrix_kloe.icon(this.icons.evidence,70,20,100,30,evidencerep)
					).css({
						color:(sum.evidence>0)?'#'+this.colours.cyan:'#555',
						opacity:(sum.evidence>0)?1:0.5
					})*/
				).click(function() {
				
						matrix_kloe.voiceOverPlayer.load('',false);
						//console.log(this.keyQuestion);
						yoodoo.nextActions.push('yoodoo.bookcase.showIntervention('+matrix_kloe.pir_intervention+');');
						yoodoo.cancelDooit();
				})
		}
		this.containers.arena.empty().append(
			$(yoodoo.e("div")).addClass("matrices").append(
				$(yoodoo.e("div")).css({
					height:'60%'
				}).append(
					$(yoodoo.e("button")).attr("type","button").html('My<br />'+this.typeTitle("evidence")).append(
						$(yoodoo.e("div")).html(sum.evidence).prepend(
							matrix_kloe.icon(this.icons.evidence,70,20,100,30,evidencerep)
						).css({
							color:(sum.evidence>0)?'#'+this.colours.cyan:'#555',
							opacity:(sum.evidence>0)?1:0.5
						})
					).click(function() {me.showMatrix("evidence");})
				).append(
					$(yoodoo.e("button")).attr("type","button").html('My<br />'+this.typeTitle("actionplan")).append(
						$(yoodoo.e("div")).html(sum.plans).prepend(
							matrix_kloe.icon(this.icons.walking,20,20,100,100,plansrep)
						).css({
							color:(sum.plans>0)?'#'+this.colours.cyan:'#555',
							opacity:(sum.plans>0)?1:0.5
						})
					).click(function() {me.showMatrix("actionplan");})
				)
			).append(
				$(yoodoo.e("div")).css({
					height:'40%'
				}).append(pir)
			)
		).append(
			kloe_summaries
		)
		if (this.doSVG) {
			var dial = new yoodoo.ui.graphs.dial({
						balanced:50,
						tolerance:50,
						outerRadius:30,
						innerRadius:20,
						markBalance:false,
						colours : this.dialColourRange
					});
		}else{
			var dial = new this.nonSVG();
		}
		this.containers.overall.empty().append(
			dial.render(sum.score)
		);

		var rep={};
		if (sum.immediate>0) rep['4D4D4D']=this.colours.red;
		this.containers.overall.append(
			$(yoodoo.e("div")).append(
				$(yoodoo.e("span")).append(
					matrix_kloe.icon(this.icons.cross,15,15,100,100,rep)
				).append(
					sum.immediate+' immediate action'+((sum.immediate==1)?'':'s')
				)
			).css({
				opacity:(sum.immediate>0)?1:0.5,
				color:(sum.immediate>0)?'#'+this.colours.red:'#555',
			})
		);
		rep={};
		if (sum.warnings>0) rep['4D4D4D']=this.colours.amber;
		this.containers.overall.append(
			$(yoodoo.e("div")).append(
				$(yoodoo.e("span")).append(
					matrix_kloe.icon(this.icons.tick,15,15,100,100,rep)
				).append(
					sum.warnings+' imminent action'+((sum.warnings==1)?'':'s')
				)
			).css({
				opacity:(sum.warnings>0)?1:0.5,
				color:(sum.warnings>0)?'#'+this.colours.amber:'#555',
			})
		);
		rep={};
		if (sum.plans>0) rep['4D4D4D']=this.colours.cyan;
		this.containers.overall.append(
			$(yoodoo.e("div")).append(
				$(yoodoo.e("span")).append(
					matrix_kloe.icon(this.icons.walking,15,15,100,100,rep)
				).append(
					sum.plans+' live action plan'+((sum.warnings==1)?'':'s')
				)
			).css({
				opacity:(sum.plans>0)?1:0.5,
				color:(sum.plans>0)?'#'+this.colours.cyan:'#555',
			})
		).show();
	},
	showMatrix:function(type) {
		yoodoo.working(true,'Collating your data&hellip;');
		var me=this;
		var next=function() {
			me.containers.overall.hide();
			me.type=type;
			me.containers.report.empty();
			me.containers.nav=$(yoodoo.e("div")).addClass("nav").append(
				$(yoodoo.e("button")).attr("type","button").addClass("backButton").html(yoodoo.dooittitle).click(function() {
					matrix_kloe.voiceOverPlayer.load('',false);
					me.showControlPanel();
				}).prepend(matrix_kloe.icon(me.icons.left,20,20,100,100,{'4D4D4D':'FFFFFF'}))
			).append(
				$(yoodoo.e("div")).html(me.typeTitle())
			).append(
				$(yoodoo.e("button")).attr("type","button").addClass("getpdfall").html("all").click(function() {
					me.getPDF();
				})
			);
			/*for(var k in this.fields) {
				if (this.kloes[k]===undefined && this.fields[k]) this.kloes[k]=this.kloe(this.fields[k]);
			}*/
			//for(var k in this.fieldName) {
			for(var k in me.kloes) {
				//if (this.kloes[k]!==undefined) 
				me.containers.report.append(me.kloes[k].report());
			}
			yoodoo.working(false);
			me.containers.arena.empty().append($(yoodoo.e("div")).addClass('report').append(me.containers.report)).append(me.containers.nav);
			me.playVoiceOver();
		};
		if (this.kloes===null) {
			this.kloes=[];
			//this.kloeId={};
			for(var k in this.keyQuestions) {
				var kq=new this.kloe(this.keyQuestions[k]);
				//this.kloeId[this.keyQuestions[k].Id]=kq;
				this.kloes.push(kq);
			}
			var me=this;
			yoodoo.keyQuestion.getPromptsInKeyLines(function(list) {
				//console.log(list);
				for(var kqid in list) {
					//console.log(kqid,list[kqid]);
					if (me.kloeId[kqid]!==undefined) me.kloeId[kqid].attachKeyLines(list[kqid]);
				}
				me.getResponses(next);
			},true);
		}else{
			next();
		}
	},
	getResponses:function(callback) {
		if (this.responses===undefined) {
			this.responses={};
			var me=this;
			this.objects.responses.get(function(list) {
				var responsibleIds={};
				var responsesById={};
				var responseToPrompt=me.objects.responses.getParameterReferingToObjectId(yoodoo.keyQuestion.promptsObject.schema.Id);
				for(var l in list) {
					var response=list[l];
					if (me.prompts[response.value[responseToPrompt]]!==undefined) {
						var prompt=me.prompts[response.value[responseToPrompt]];
						prompt.attachResponse(response);
					}
				}
				var responseIds=[];
				for(var rid in me.responseId) responseIds.push(rid);
				if (list.length>0) {
					me.objects.actionPlans.get(function(list) {
						var actionPlanToResponse=me.objects.actionPlans.getParameterReferingToObjectId(me.objects.responses.schema.Id);
						var responsibleIds={};
						for(var l in list) {
							if (me.responseId[list[l].value[actionPlanToResponse]]!==undefined) {
								me.responseId[list[l].value[actionPlanToResponse]].attachActionPlan(list[l]);
									if (list[l].value.zwhln>0) responsibleIds[list[l].value.zwhln]=true;
									if (list[l].value.rpawr>0) responsibleIds[list[l].value.rpawr]=true;
							}
						}
						var getev=function() {
							me.objects.evidence.get(function(list) {
								var evidenceToResponse=me.objects.evidence.getParameterReferingToObjectId(me.objects.responses.schema.Id);
								for(var l in list) {
									if (me.responseId[list[l].value[evidenceToResponse]]!==undefined) {
										me.responseId[list[l].value[evidenceToResponse]].attachEvidence(list[l]);
									}
								}
								callback();
							},function(){},0,{recordsIds:responseIds});
						};
						
						var responsible=[];
						for(var id in responsibleIds) {
							if (responsibleIds[id]===true) responsible.push(id*1);
						}
						if (responsible.length>0) {
							matrix_kloe.objects.responsibility.get(function(list) {
								getev();
							},function() {

							},0,{},responsible);
						}else{
							getev();
						}
						
						
					},function(){},0,{recordsIds:responseIds});
				}else{
					callback();
				}
			},function() {},0,{
				znjjl:[true,'is not'],
				osfzh:yoodoo.businessSector.selectedBusinessSector,
				excludeReadOnly:true
			});
		}else{
			callback();
		}
	},
	getPDF:function() {
		var op={
			header:null,
			content:[],
			filename:matrix_kloe.typeTitle()
		};
		
		for(var k in this.kloes) {
			if (this.kloes[k]!==undefined) {
				if (this.kloes[k].pdf!==undefined) {
					if (op.content.length>0) op.content.push({pageBreak:1});
					op.content=$.merge(op.content,this.kloes[k].pdf.content);
					if (op.header===null) op.header=this.kloes[k].pdf.header;
				}
			}
		}
		yoodoo.alert('Fetching '+op.filename+'.pdf',[],4);
		yoodoo.toPDF(op);
	},
	help : function(text, sound) {
		var helpMessage = $(yoodoo.e("div")).html(text).css({
			padding : 10,
			'text-align' : 'center'
		});
		var blockout = $(yoodoo.e("div")).css({
			position : 'absolute',
			width : '100%',
			height : '100%',
			'box-sizing' : 'border-box',
			padding : 50,
			background : 'rgba(255,255,255,0.9)',
			'z-index' : 998,
			top : 0
		}).click(function() {
			$(this).remove();
		}).append(helpMessage);
		$(yoodoo.widget).append(blockout);
		yoodoo.playSound(yoodoo.replaceDomain('domain:uploads/sitespecific/yoodoo.siteFolder/' + sound));
	},
	dialRescale : function(v) {
		if (v==100) return v;
		return Math.round((90*v)/100);
		return Math.round(Math.pow(v,2)/100);
	},
	displayed : function() {
		// called when the dooit is fully revealed
	},
	loadFields : function() {
		/*if (this.key === null) {
			for (var k in array_of_default_fields) {
				if (array_of_default_fields[k].match(/^kloe/i)) {
					this.key = array_of_default_fields[k];
				}
			}
		}
		if (this.key !== null) {
			try {
				eval('this.value=' + array_of_fields[this.key][1] + ';');
			} catch(e) {
				this.value = array_of_fields[this.key][1];
			}
		}
		for (var k in array_of_fields) {
			if (k != this.key) {
				try {
					eval('this.fields["' + k + '"]=' + array_of_fields[k][1] + ';');
				} catch(e) {
					this.fields[k] = array_of_fields[k][1];
				}
			}
		}
		this.value = dooit.decode(this.value);
		this.fields = dooit.decode(this.fields);*/
	},
	finishable : function() {
		var ok = true;
		return ok;
	},
	output : function() {
		matrix_kloe.voiceOverPlayer.load('',false);
		//var op = dooit.json(this.value);
		//array_of_fields[this.key][1] = op;
		var reply = {};
		//eval('reply.EF' + array_of_fields[this.key][0] + '=op;');
		return reply;
	}
};
