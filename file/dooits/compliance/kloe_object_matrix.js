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
		downarrow:'<polygon points="50,70 95,30 5,30 "/>'
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
		businessSector:'business_sector',
		responses:'kloe_response',
		actionPlans:'action_plan_response',
		evidence:'evidence_response',
		responsibility:'responsibility'
	},
	objects:{
		prompts:null,
		keyQuestions:null,
		businessSector:null,
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

			this.loadObjects(
				function() {
					me.loadViews(function() {
						me.processViews(function() {
							me.start();
						});
					});
				}
			);
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
				if (dooit.options[me.objectoptions.businessSector].value>0) {
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
				}
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
				});
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
				});
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
			});
		}
	},
	getPromptCounts:function() {
		var arr={};
		for(var r in this.views.promptCount.results) {
			var result=this.views.promptCount.results[r];
			var bsid=result.columns[result.columns.length-1];
			if (bsid==this.businessSector.Id) {
				for(var c=0;c<result.columns.length-1;c++) {
					arr[this.views.promptCount.columns[c]]=result.columns[c];
				}
			}
		}
		return arr;
	},
	getPromptScores:function() {
		var kq={};
		var promptToKeyQuestion=this.objects.prompts.getParameterReferingToObjectId(this.objects.keyQuestions.schema.Id);
		for(var r in this.views.responseCount.results) {
			var result=this.views.responseCount.results[r];
			var prompt=this.objects.prompts.recordsCache[result.columns[1]];
			if (prompt!==undefined) {
				var keyQuestion=this.objects.keyQuestions.recordsCache[prompt.value[promptToKeyQuestion]];
				var name=keyQuestion.displayName();
				var recommendedKey=prompt.nameToKey['Suggested response count'];
				if (kq[name]===undefined) kq[name]={scores:[],total:0};
				var s=0;
				if (prompt.value[recommendedKey]>0) {
					s=result.columns[0]/prompt.value[recommendedKey];
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
		this.objects.keyQuestions.get(function(rows){
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
					var name=keyQuestion.displayName();
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
		},function() {
			
		},0);
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
	/*fieldName:{
		kloe_1:{title:'Safe',intervention:200848},
		kloe_2:{title:'Effective',intervention:204221},
		kloe_3:{title:'Caring',intervention:200850},
		kloe_4:{title:'Responsive',intervention:204224},
		kloe_5:{title:'Well-led',intervention:204222}
	},*/
	kloe : function(kq) {
		this.keyQuestion=kq;
		this.pdfStyles={
			kloeHeader:{fontsize:24,lineheight:10,textalign:'C',fontcolor:[50,50,50]},
			sectionHeader:{fontsize:20,lineheight:8,width:190,inline:true,relative:true,x:0,y:0,background:{r:100,g:100,b:100},fontcolor:[255,255,255]},
			sectionDescription:{fontsize:10,lineheight:5,indent:10,fontcolor:[100,100,100]},
			promptHeader:{fontsize:16,lineheight:7,width:170,inline:true,relative:true,x:10,y:0,background:{r:100,g:100,b:100},fontcolor:[255,255,255]},
			promptDescription:{fontsize:10,lineheight:5,indent:20,fontcolor:[100,100,100]},
			label:{fontsize:10,lineheight:5,indent:20,fontcolor:[100,100,100]},
			response:{fontsize:10,lineheight:5,indent:30,fontcolor:[0,0,0]},
		};
		/*obj.defineReportKeys=function() {
			this.reportKeys=[
				{promptKey:'text',labelKey:'how',pdf:function(text) {
						var col={r:100,g:100,b:100};
						if (this.expires.getTime()<new Date().getTime()) this.status='needsattention';
						if (me.statuses[this.status]!==undefined) col=yoodooStyler.hexToRGB(me.statuses[this.status].colour);

						return {fontsize:12,lineheight:8,width:170,inline:true,relative:false,x:10,y:0,fontcolor:[col.r,col.g,col.b],text:text};
					},pdflabel:function(text) {
						return {};
						return {text:text};
					}
				},
				{promptKey:'expires',labelKey:'deadline',value:function(v) {
						if (this.expires.getTime()<new Date().getTime()) return $(yoodoo.e("div")).append($(yoodoo.e("span")).css({color:'#f00'}).html(yoodoo.formatDate('jS F Y',v))).html();
						return yoodoo.formatDate('jS F Y',v);
					},pdf:function(text) {
						if (text instanceof Date) text=yoodoo.formatDate('jS F Y',text);
						if (this.expires.getTime()<new Date().getTime()) return {text:text,fontcolor:[255,0,0]};
						return {text:text};
					},pdflabel:function(text) {
						return {text:text};
					}
				}
			];
			switch(me.type) {
				case 'evidence':
					this.reportKeys.push({promptKey:'doc',labelKey:'evidence',pdf:function(text) {
							return {text:text};
						},pdflabel:function(text) {
							return {text:text};
						}
					});
					this.reportKeys.push({promptKey:'doctype',labelKey:'evidenceType',pdf:function(text) {
							return {text:text};
						},pdflabel:function(text) {
							return {text:text};
						}
					});
					this.reportKeys.push({promptKey:'file',labelKey:'file',pdf:function(text) {
							if (text.link!==undefined) return {text:text.link};
							if (typeof(text)=='string') return {text:text};
						},pdflabel:function(text) {
							return {text:text};
						}
					});
					break;
				case 'actionplan':
					this.reportKeys.push({promptKey:'action',labelKey:'action',pdf:function(text) {
							return {text:text};
						},pdflabel:function(text) {
							return {text:text};
						}
					});
					this.reportKeys.push({promptKey:'who',labelKey:'responsible',pdf:function(text) {
							return {text:text};
						},pdflabel:function(text) {
							return {text:text};
						}
					});
					this.reportKeys.push({promptKey:'manager',labelKey:'manager',pdf:function(text) {
							return {text:text};
						},pdflabel:function(text) {
							return {text:text};
						}
					});
					this.reportKeys.push({promptKey:'notmet',labelKey:'notmet',pdf:function(text) {
							return {text:text};
						},pdflabel:function(text) {
							return {text:text};
						}
					});
					this.reportKeys.push({promptKey:'measures',labelKey:'measures',pdf:function(text) {
							return {text:text};
						},pdflabel:function(text) {
							return {text:text};
						}
					});
					break;
			}
		};*/
		/*obj.summary=function() {
			var op={
				immediate:0,
				warnings:0,
				plans:0,
				score:0,
				evidence:0
			};
			var score=0;
			var total=0;
			for(var i in this.structure) {
				total++;
				var score2=0;
				var total2=0;
				for(var p in this.structure[i].prompts) {
					total2++;
					var score3=0;
					var total3=0;
					var expiryWarningDays=this.structure[i].prompts[p].expiryWarning;
					if (this[this.structure[i].prompts[p].id] instanceof Array && this[this.structure[i].prompts[p].id].length>0) {
						for(var r=0;r<this[this.structure[i].prompts[p].id].length;r++) {
							total3++;
							var res=this[this.structure[i].prompts[p].id][r];
							var now=new Date();
							
							if (res.expires.getTime()<now.getTime()) {
								res.status='needsattention';
							}else if (res.status!="needsattention") {
								var now=new Date();
								if (res.expires.getTime()<new Date(now.setDate(now.getDate()+expiryWarningDays)).getTime()) op.warnings++;
							}
							if (res.status!="complete") {
								op.immediate++;
								if (res.action!='') op.plans++;
							}else{
								score3++;
							}
							if (res.doc!="") op.evidence++;
						}
					}
					if (total3<this.structure[i].prompts[p].suggestedCount) total3=this.structure[i].prompts[p].suggestedCount;
					var p=(total3==0)?0:(100*score3/total3);
					score2+=p;
				}
				var p=(total2==0)?0:(score2/total2);
				score+=p;
			}
			op.score=Math.round((total==0)?0:(score/total));
			op.score=(op.score>100)?100:((op.score<0)?0:op.score);
			return op;
		};*/
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
			yoodoo.toPDF(this.pdf);
		};
		this.build=function() {
			if (this.container===undefined) this.container=$(yoodoo.e("div"));
			this.container.empty();
			var schema=matrix_kloe.keyQuestions[this.keyQuestion.displayName()];
			//console.log(schema);
			if (typeof(schema)=="undefined") {
				this.container.append(
					$(yoodoo.e("h3")).html(
						$(yoodoo.e("span")).html(this.keyQuestion.displayName())
					)
				);
			}else{
				this.pdf={filename:matrix_kloe.typeTitle()+"-"+this.keyQuestion.displayName(),header:yoodoo.defaults.pdfHeader,content:[]};
				this.pdf.content.push($.extend({},this.pdfStyles.kloeHeader,{text:matrix_kloe.typeTitle()+' - '+this.keyQuestion.displayName()}));
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
				this.revealer=$(yoodoo.e("div")).css({display:'none'});
				this.container.append(this.revealer);
				var promptkeys=[];
				for(var pk in schema.prompts) promptkeys.push(pk);
				promptkeys.sort(function(a,b) {
					if (a<b) return -1;
					if (b<a) return 1;
					return 0;
				});
				var type=(matrix_kloe.type=='evidence')?'evidence':'actionPlans';
				//console.log(schema.prompts,promptkeys);
				for(var i in promptkeys) {
					pk=promptkeys[i];
					var prompt=$(yoodoo.e("div"));
					
					//console.log(i,pk);
					this.pdf.content.push($.extend({},this.pdfStyles.sectionHeader,{text:schema.prompts[pk].prompt.value.lvzfz}));
					this.pdf.content.push($.extend({},this.pdfStyles.sectionDescription,{text:schema.prompts[pk].prompt.value.zgsux.xikvk}));
					prompt.append($(yoodoo.e("div")).html(schema.prompts[pk].prompt.value.lvzfz))
						.append($(yoodoo.e("p")).html(schema.prompts[pk].prompt.value.zgsux.xikvk));
					var promptNotEmpty=false;
					for(var r in schema.prompts[pk].responses) {
						var response=schema.prompts[pk].responses[r];
						var found=false;
						var row=$(yoodoo.e("div")).addClass("response");
						var div=$(yoodoo.e("div")).addClass('evidenceAndPlans');
						//console.log(response);
						for(var l in response[type]) {
							var record=response[type][l];
							//console.log(record);
							var divdiv=$(yoodoo.e("div")).addClass('evidenceAndPlansRecord');
							var keys={};
							if (type=="evidence") {
								keys={
									vtyxa_ripkx:{div:[],pdf:[],label:'promptHeader'},
									vtyxa_fljpz:{div:[],pdf:[],label:'label'}
								};
								for(var p in record.object.parameters) {
									var val=record.value[p];
									/*if (record.object.parameters[p].type.Name=="text") {
										//console.log(record.object.parameters[p].words,record.object.parameters[p].words[yoodoo.words.language],val);
										if (typeof(val)=="string" && val!="") {
											div.append(
												$(yoodoo.e("div")).append(
													$(yoodoo.e("label")).html(record.object.parameters[p].words[yoodoo.words.language])
												).append(
													$(yoodoo.e("p")).html(val)
												)
											);
										}
									}else*/ if (record.object.parameters[p].type.Name=="complex") {
										//console.log(record.object.parameters[p].json_schema,val);
										for(var j in record.object.parameters[p].json_schema) {
											if (record.object.parameters[p].json_schema[j].type=="textarea") {
												var jsval=val[record.object.parameters[p].json_schema[j].key];
												//console.log(jsval);
												if (typeof(jsval)=="string" && jsval!="") {
													found=true;
													promptNotEmpty=true;
													var k=p+'_'+record.object.parameters[p].json_schema[j].key;
					keys[k].pdf.push($.extend({},this.pdfStyles[keys[k].label],{text:record.object.parameters[p].json_schema[j].title[yoodoo.words.language]}));
					keys[k].pdf.push($.extend({},this.pdfStyles.response,{text:jsval}));
													
					keys[k].div.push($(yoodoo.e("label")).html(record.object.parameters[p].json_schema[j].title[yoodoo.words.language]));
					keys[k].div.push($(yoodoo.e("p")).html(jsval));
													/*divdiv.append(
														$(yoodoo.e("div")).append(
															$(yoodoo.e("label")).html(record.object.parameters[p].json_schema[j].title[yoodoo.words.language])
														).append(
															$(yoodoo.e("p")).html(jsval)
														)
													);*/
												}
											}
										}
									}
								}
								for(var k in keys) {
									for(var d in keys[k].div) divdiv.append(keys[k].div[d]);
									for(var d in keys[k].pdf) this.pdf.content.push(keys[k].pdf[d]);
								}
							}else{
								keys={
									jzowf_idqdq:{div:[],pdf:[],label:'promptHeader'},
									jzowf_kqnom:{div:[],pdf:[],label:'label'},
									jzowf_habov:{div:[],pdf:[],label:'label'},
									zwhln:{div:[],pdf:[],label:'label'},
									jzowf_kaifp:{div:[],pdf:[],label:'label'},
									jzowf_sgwen:{div:[],pdf:[],label:'label'},
									rpawr:{div:[],pdf:[],label:'label'}
								};
								for(var p in record.object.parameters) {
									var val=record.value[p];
									if (record.object.parameters[p].type.Name=="reference" && record.object.parameters[p].ReferenceParameter==matrix_kloe.objects.responsibility.schema.Id) {
										//console.log(record.object.parameters[p].words,record.object.parameters[p].words[yoodoo.words.language],val);
										if (typeof(val)=="number" && val>0) {
											var name='<em>Not found</em>';
											if (matrix_kloe.objects.responsibility.recordsCache[val]!==undefined) name=matrix_kloe.objects.responsibility.recordsCache[val].displayName();
											
					keys[p].pdf.push($.extend({},this.pdfStyles[keys[p].label],{text:record.object.parameters[p].words[yoodoo.words.language]}));
					keys[p].pdf.push($.extend({},this.pdfStyles.response,{text:name}));
											
					//this.pdf.content.push($.extend({},this.pdfStyles.label,{text:record.object.parameters[p].words[yoodoo.words.language]}));
					//this.pdf.content.push($.extend({},this.pdfStyles.response,{text:name}));
											
					keys[p].div.push($(yoodoo.e("label")).html(record.object.parameters[p].words[yoodoo.words.language]));
					keys[p].div.push($(yoodoo.e("p")).html(name));
											
											/*divdiv.append(
												$(yoodoo.e("div")).append(
													$(yoodoo.e("label")).html(record.object.parameters[p].words[yoodoo.words.language])
												).append(
													$(yoodoo.e("p")).html(name)
												)
											);*/
										}
									}else if (record.object.parameters[p].type.Name=="complex") {
										//console.log(record.object.parameters[p].json_schema,val);
										for(var j in record.object.parameters[p].json_schema) {
											if (record.object.parameters[p].json_schema[j].type=="textarea") {
												var jsval=val[record.object.parameters[p].json_schema[j].key];
												//console.log(jsval);
												if (typeof(jsval)=="string" && jsval!="") {
													found=true;
													promptNotEmpty=true;
											var k=p+'_'+record.object.parameters[p].json_schema[j].key;
													
					keys[k].pdf.push($.extend({},this.pdfStyles[keys[k].label],{text:record.object.parameters[p].json_schema[j].title[yoodoo.words.language]}));
					keys[k].pdf.push($.extend({},this.pdfStyles.response,{text:jsval}));
													
					keys[k].div.push($(yoodoo.e("label")).html(record.object.parameters[p].json_schema[j].title[yoodoo.words.language]));
					keys[k].div.push($(yoodoo.e("p")).html(jsval));
													
													/*divdiv.append(
														$(yoodoo.e("div")).append(
															$(yoodoo.e("label")).html(record.object.parameters[p].json_schema[j].title[yoodoo.words.language])
														).append(
															$(yoodoo.e("p")).html(jsval)
														)
													);*/
												}
											}
										}
									}
								}
								
								for(var k in keys) {
									for(var d in keys[k].div) divdiv.append(keys[k].div[d]);
									for(var d in keys[k].pdf) this.pdf.content.push(keys[k].pdf[d]);
								}
							}
							div.append(divdiv);
						}
						if (found) {
							//console.log(this.pdf.content);
							prompt.append(row./*append(
								$(yoodoo.e("label")).html(response.response.object.parameters[response.response.object.displayParameter].words[yoodoo.words.language])
							).*/append(
								$(yoodoo.e("div")).html(response.response.displayName())
							).append(
								div
							));
						}
					}
					if (promptNotEmpty) this.revealer.append(prompt);
				}
			}
			/*
			this.defineReportKeys();
			this.found=0;
			var src=this;
			this.pdfbutton=null;
			if (this.structure instanceof Array) this.pdfbutton=$(yoodoo.e("button")).attr("type","button").addClass('getpdf').html("").click(function() {
				src.getpdf();
			});
			this.counter=$(yoodoo.e("div"));
			this.container.append(
				this.pdfbutton
			).append(
				$(yoodoo.e("h3")).html(
					$(yoodoo.e("span")).html(this.title)
				).click(function() {
					if ($(this).hasClass("on")) {
						$(this).removeClass("on").next().slideUp({duration:1000,easing:'swing'});
					}else{
						$(this).addClass("on").next().slideDown({duration:1000,easing:'swing'});
					}
				}).prepend(
					matrix_kloe.doSVG?matrix_kloe.icon(me.icons.downarrow,20,20,100,100):$(yoodoo.e("div")).addClass("downArrow")
				).append(
					this.counter.css({
						float:'right'
					})
				)
			);
			this.revealer=$(yoodoo.e("div")).css({display:'none'});
			this.container.append(this.revealer);
			this.pdf={filename:matrix_kloe.typeTitle()+"-"+this.title,header:yoodoo.defaults.pdfHeader,content:[]};
			this.pdf.content.push($.extend({},this.pdfStyles.kloeHeader,{text:matrix_kloe.typeTitle()+' - '+this.title}));
			for(var h in this.pdf.header) {
				if (this.pdf.header[h].text!==undefined) this.pdf.header[h].text=this.pdf.header[h].text.replace(/\{user\}/g,yoodoo.user.getName());
			}
			if (this.structure instanceof Array) {
				for(var i in this.structure) {
					this.structure[i].container=$(yoodoo.e("div"));
					this.revealer.append(this.structure[i].container);
					this.structure[i].container.empty().append(
						$(yoodoo.e("div")).html(this.structure[i].name)
					).append(
						$(yoodoo.e("p")).html(this.structure[i].description)
					);
					this.pdf.content.push($.extend({},this.pdfStyles.sectionHeader,{text:this.structure[i].name}));
					this.pdf.content.push($.extend({},this.pdfStyles.sectionDescription,{text:this.structure[i].description}));
					for(var p in this.structure[i].prompts) {
						this.structure[i].prompts[p].parent=this;
						this.structure[i].prompts[p].section=this.structure[i];
						this.structure[i].prompts[p].report=function() {
							var count=0;
							//if (this.container===undefined) {
								this.container=$(yoodoo.e("div")).addClass("prompt");
								this.section.container.append(this.container);
							//}
							this.container.empty().append(
								$(yoodoo.e("div")).html(this.title)
							).append(
								$(yoodoo.e("p")).html(this.description)
							);
							this.parent.pdf.content.push($.extend({},this.parent.pdfStyles.promptHeader,{text:this.title}));
							this.parent.pdf.content.push($.extend({},this.parent.pdfStyles.promptDescription,{text:this.description}));
							if (this.parent[this.id]!==undefined) {
								for(var r in this.parent[this.id]) {
									var obj=this.parent[this.id][r];
									if (this.parent.showResponse(obj)) {
										this.parent.found++;
										var response=$(yoodoo.e("div")).addClass("response");
										for(var i in this.parent.reportKeys) {
											var key=this.parent.reportKeys[i];
											//console.log(key,this.parent[this.id]);
											if (obj[key.promptKey]!==undefined) {
												var v=obj[key.promptKey];
	//console.log(key,v);
												if (key.value!==undefined) {
													v=key.value.apply(obj,[v]);
												}
	//console.log(v);
												if (v!="" && v!==false) {
													count++;
													var row=$(yoodoo.e("div"));
													row.append(
														$(yoodoo.e("p")).append(this[key.labelKey])
													).append(
														$(yoodoo.e("p")).append(v)
													);
													response.append(row);

													this.parent.pdf.content.push($.extend({},this.parent.pdfStyles.label,key.pdflabel.apply(obj,[this[key.labelKey]])));
													this.parent.pdf.content.push($.extend({},this.parent.pdfStyles.response,key.pdf.apply(obj,[obj[key.promptKey]])));
												}
											}
										}
										this.container.append(response);
									}
								}
							}
							if (count==0) this.parent.pdf.content.push({text:this.parent.noResponses(),fontcolor:[200,200,200],fontsize:10,textalign:'C',lineheight:5});
							this.container.append(
								$(yoodoo.e("div")).addClass("emptyPrompt").html(this.parent.noResponses())
							);
							return this.container;
						};
						this.structure[i].prompts[p].report();
					}
				}
				this.setCounter();
			}else{
				this.revealer.html("Not yet used");
			}*/
			//console.log(this.pdf);
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

			//this.counter.html(me.type+","+this.found);
				break;
			}
		};
		this.report=function() {
			this.build();
			/*var me=this;
			if (matrix_kloe.type=='evidence') {
				if (matrix_kloe.evidence==null) {
					matrix_kloe.objects.evidence.get(function(list) {
						matrix_kloe.evidence=list;
						me.build();
						callback(this.container);
					},function() {

					},0,{
						excludeReadOnly:true
					});
				}else{
					me.build();
					callback(this.container);
				}
			}else{
				if (matrix_kloe.actionPlans==null) {
					matrix_kloe.objects.actionPlans.get(function(list) {
						matrix_kloe.actionPlans=list;
						me.build();
						callback(this.container);
					},function() {

					},0,{
						excludeReadOnly:true
					});
				}else{
					me.build();
					callback(this.container);
				}
			}*/
			return this.container;
		};
		//if (obj.structure!==undefined) obj.build();
		//return obj;
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
		for(var k in this.keyQuestionTitles) {
			var summary={
				immediate:0,
				plans:0,
				evidence:0,
				warnings:0,
				total:0,
				score:0
			};
			if (this.data[this.keyQuestionTitles[k]]) {
				var arr=this.data[this.keyQuestionTitles[k]];
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
			var keyQuestion=this.objects.keyQuestions.findByDisplayName(this.keyQuestionTitles[k]);
			but.keyQuestion=keyQuestion;
			kloe_summaries.append(
				$(but).attr("type","button").html(this.keyQuestionTitles[k]).click(function() {
					matrix_kloe.voiceOverPlayer.load('',false);
					yoodoo.nextActions.push('yoodoo.bookcase.showIntervention('+this.keyQuestion.value.zpaqd+');');
					yoodoo.cancelDooit();
				}).append(icons).append(dial.render(this.dialRescale(summary.score),col))
			);
			
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
		if (this.kloes===null) {
			this.kloes=[];
			for(var k in this.keyQuestionTitles) {
				this.kloes.push(new this.kloe(this.objects.keyQuestions.findByDisplayName(this.keyQuestionTitles[k])));
			}
		}
		var me=this;
		this.getResponses(function() {
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
			me.containers.arena.empty().append($(yoodoo.e("div")).addClass('report').append(me.containers.report)).append(me.containers.nav);
			me.playVoiceOver();
		});
	},
	getResponses:function(callback) {
		if (this.keyQuestions===undefined) {
			this.keyQuestions={};
			var me=this;
			this.objects.responses.get(function(list) {
				var responsibleIds={};
				var promptToKeyQuestion=me.objects.prompts.getParameterReferingToObjectId(me.objects.keyQuestions.schema.Id);
				for(var p in me.objects.prompts.recordsCache) {
					var prompt=me.objects.prompts.recordsCache[p];
				}
				var responsesById={};
				var responseToPrompt=me.objects.responses.getParameterReferingToObjectId(me.objects.prompts.schema.Id);
				for(var l in list) {
					var response=list[l];
					if (me.objects.prompts.recordsCache[response.value[responseToPrompt]]!==undefined) {
						var prompt=me.objects.prompts.recordsCache[response.value[responseToPrompt]];
						var promptName=prompt.displayName();
						var pid=response.value[responseToPrompt];
						if (me.objects.keyQuestions.recordsCache[prompt.value[promptToKeyQuestion]]!==undefined) {
							var keyQuestion=me.objects.keyQuestions.recordsCache[prompt.value[promptToKeyQuestion]];
							var kqName=keyQuestion.displayName();
							if (me.keyQuestions[kqName]===undefined) {
								me.keyQuestions[kqName]={
									keyQuestion:keyQuestion,
									prompts:{}
								};
							}
							if (me.keyQuestions[kqName].prompts[promptName]===undefined) me.keyQuestions[kqName].prompts[promptName]={
								prompt:prompt,
								responses:[]
							};
							var arr={
								response:response,
								actionPlans:[],
								evidence:[]
							};
							responsesById[response.Id]=arr;
							me.keyQuestions[kqName].prompts[promptName].responses.push(arr);
						}
					}
				}
				var responseIds=[];
				for(var rid in responsesById) responseIds.push(rid);
				if (responseIds.length>0) {
					me.objects.actionPlans.get(function(list) {
						var actionPlanToResponse=me.objects.actionPlans.getParameterReferingToObjectId(me.objects.responses.schema.Id);
						for(var l in list) {
							if (responsesById[list[l].value[actionPlanToResponse]]!==undefined) {
								if (list[l].value.zwhln>0) responsibleIds[list[l].value.zwhln]=true;
								if (list[l].value.rpawr>0) responsibleIds[list[l].value.rpawr]=true;
								responsesById[list[l].value[actionPlanToResponse]].actionPlans.push(list[l]);
							}
						}
						me.objects.evidence.get(function(list) {
							var evidenceToResponse=me.objects.evidence.getParameterReferingToObjectId(me.objects.responses.schema.Id);
							for(var l in list) {
								if (responsesById[list[l].value[evidenceToResponse]]!==undefined) {
									responsesById[list[l].value[evidenceToResponse]].evidence.push(list[l]);
								}
							}
							var responsible=[];
							for(var id in responsibleIds) {
								if (responsibleIds[id]===true) responsible.push(id*1);
							}
							if (responsible.length>0) {
								matrix_kloe.objects.responsibility.get(function(list) {
									callback();
								},function() {
									
								},0,{},responsible);
							}else{
								callback();
							}
						},function(){},0,{recordsIds:responseIds});
					},function(){},0,{recordsIds:responseIds});
				}else{
					callback();
				}
			},function() {},0,{
				znjjl:[true,'is not'],
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
	/*transposeOptions : function(keys, obj) {
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
	},*/
	finishable : function() {
		var ok = true;
		return ok;
	},
	/*getvalue : function() {
		var v = {};
		v.structure=[];
		for (var s in this.schema.sections) {
			var section={
				name:this.schema.sections[s].title,
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
					how:prompt.textPlaceholder
				});
				v[this.schema.sections[s].items[k].id] = [];
				for (var r = 0; r < this.schema.sections[s].items[k].records.length; r++) {
					v[this.schema.sections[s].items[k].id].push(this.schema.sections[s].items[k].records[r].output());
				}
			}
			v.structure.push(section);
		}
		return v;
	},
	getsummary : function() {
		var v = {
			compliance : 0,
			records:[],
			warning : null, // time to show a warning
			expired : null // time to show as expired
		};
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
			v.records.push(section);
		}
		v.warning=(v.warning===null)?'':yoodoo.formatDate('d/m/Y',new Date(v.warning));
		v.expired=(v.expired===null)?'':yoodoo.formatDate('d/m/Y',new Date(v.expired));
		if (total>0) v.compliance = Math.round(score / total);
		return v;
	},*/
	output : function() {
		matrix_kloe.voiceOverPlayer.load('',false);
		//var op = dooit.json(this.value);
		//array_of_fields[this.key][1] = op;
		var reply = {};
		//eval('reply.EF' + array_of_fields[this.key][0] + '=op;');
		return reply;
	}/*,
	dropbox:{
		key:'iytf2k47y2cttsh',
		loaded:false,
		install:function(complete) {
			var me=this;
			if (typeof(Dropbox)=='undefined') {
				var s=yoodoo.e("script");
				s.src="https://www.dropbox.com/static/api/2/dropins.js";
				s.id='dropboxjs';
				s.type = 'text/javascript';
				$(s).attr('data-app-key',this.key);
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
	}*/
};
