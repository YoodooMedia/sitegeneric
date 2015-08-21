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
	key : null,
	schema : null,
	fields : {},
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
	init : function() {
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
				for (var k in this.schema.sections) {
					this.standardizeSection(this.schema.sections[k]);
				}
				// start rendering the dooit
				this.start();
		}
		//if (yoodoo.hasTag('kloe_exporter')) this.exporter.detect();
	},
	exporter : {
		window:null,
		detect:function() {
			if (yoodoo.exportWindow===undefined || yoodoo.exportWindow.window===null) {
				yoodoo.exportWindow=window.open(window.location.href,'exportWindow');
			}
			if (yoodoo.exportWindow.window!==null) this.window=yoodoo.exportWindow;
		},
		send:function() {
			if (kloe.openPrompt!==undefined && kloe.openPrompt.id!==undefined) {
				var json=[];
				for(var r in kloe.openPrompt.records) json.push(kloe.openPrompt.records[r].output());
				if (this.window!==null && this.window.window!==null && this.window.kloe!==undefined && this.window.kloe.openPrompt!==undefined) {
					this.window.kloe.openPrompt.importer(json);
				}else{
					alert("The export window does not have an open prompt");
				}
			}
		}
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
		this.containers.statDial.setValue(sum.compliance);
		if (warnings.immediate>0) this.containers.statDial.setColour({r:171,g:42,b:42});
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
			this.button.append(
				$(yoodoo.e("div")).addClass("immediateItems").append(kloe.icon(this.context.icons.cross,20,20,100,100,{'4D4D4D':this.context.colours.red})).append(this.immediateItems)
			).append(
				$(yoodoo.e("div")).addClass("imminentItems").append(kloe.icon(this.context.icons.tick,20,20,100,100,{'4D4D4D':this.context.colours.amber})).append(this.imminentItems)
			).append(
				$(yoodoo.e("div")).addClass("actionplans").append(kloe.icon(this.context.icons.walking,20,20,100,100,{'4D4D4D':this.context.colours.cyan})).append(this.actionplansItems)
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
			var c=this.immediateAction();
			this.immediateItems.html(c).parent().css({opacity:(c==0)?this.context.unusedOpacity:1});
			var c=this.imminentAction();
			this.imminentItems.html(c).parent().css({opacity:(c==0)?this.context.unusedOpacity:1});
			var c=this.actionPlans();
			this.actionplansItems.html(c).parent().css({opacity:(c==0)?this.context.unusedOpacity:1});
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
					val=Math.round(val/10);
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
	},
	standardizeItem : function(obj) {
		var me = this;
		obj.context = this;
		obj.records = [];
		if (!(this.value[obj.key] instanceof Array)) this.value[obj.key]=[];
		for (var r = 0; r < this.value[obj.key].length; r++)
			obj.records.push(new this.record(obj, this.value[obj.key][r]));
		obj.add = function(vals) {
			var item = new this.context.record(this, vals);
			obj.records.push(item);
			var box = item.render().css({
				scale : 0.01
			}).insertBefore(this.context.containers.pending.find('.emptyMessage'));
			box.transition({
				scale : 1
			}, 300, function() {
				$(this).addClass("emptyRecord");
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
			return Math.round((100*score)/(2*total));
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
				if (this.records[r].pendingActionPlan()) w++;
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
		obj.importer = function(json) {
			for(var j in json) {
				var record=new kloe.record(this,json[j]);
				this.records.push(record);
			}
			this.open();
		};
		obj.open = function() {
			kloe.openPrompt=this;
			var src = this;
			//me.containers.expired = $(yoodoo.e("div")).addClass("expiredRecords");
			me.containers.pending = $(yoodoo.e("div")).addClass("pendingRecords");
			var back = $(yoodoo.e("button")).attr("type", "button").addClass("backButton").click(function() {
				me.show(true);
				kloe.openPrompt=undefined;
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
			if (yoodoo.hasTag("kloe_exporter")) {
				if (kloe.exporter.window===null || kloe.exporter.window.window===null) {
					me.containers.records.prepend($(yoodoo.e("button")).attr("type","button").addClass("kloe_exporter").html("start exporter").click(function() {
						kloe.exporter.detect();
						if (kloe.exporter.window!==null && kloe.exporter.window.window!==null) {
							$(this).html("export").unbind("click").click(function() {
								kloe.exporter.send();
							});
						}else{
							alert("Your browser seems to be blocking the exporter popup!");
						}
					}));
				}else if (kloe.exporter.window!==null && kloe.exporter.window.window!==null) {
					me.containers.records.prepend($(yoodoo.e("button")).attr("type","button").addClass("kloe_exporter").html("export").click(function() {
						kloe.exporter.send();
					}));
				}
			}

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
        if (!isNaN(this.item.defaultExpiryDays) && this.item.defaultExpiryDays!==null) this.expires.setDate(this.expires.getDate() + parseInt(this.item.defaultExpiryDays));
        if (!isNaN(this.item.defaultExpiryMonths) && this.item.defaultExpiryMonths!==null) this.expires.setMonth(this.expires.getMonth() + parseInt(this.item.defaultExpiryMonths));
        if (!isNaN(this.item.defaultExpiryYears) && this.item.defaultExpiryYears!==null) this.expires.setFullYear(this.expires.getFullYear() + parseInt(this.item.defaultExpiryYears));
		if ( typeof (params) != "undefined") {
			for (var k in params)
			this[k] = params[k];
		}
		if (this.expires.getTime()<new Date().getTime()) {
			this.status='needsattention';
			this.warning==false;
		}else{
			//this.expires = new Date();
			//this.expires.setDate(this.expires.getDate() + this.item.defaultExpiryDays);
			//if (this.status!="noaction")
				//this.status='needsattention';
			var now=new Date();
			this.warning=this.expires.getTime()<new Date(now.setDate(now.getDate()+this.item.context.schema.expiryWarningDays)).getTime();
		}
		this.immediateAction=function() {
			return (this.status == 'needsattention');
		};
		this.imminentAction=function() {
			return this.warning;
		};
		this.pendingActionPlan=function() {
			return (this.action!='' && this.score()<2);
		};
		this.remove = function() {
			this.item.remove(this);
			this.button.animate({
				width : 0
			}, 300, function() {
				$(this).remove();
			});
		};
		this.score=function() {
			var s=0;
			if (this.item.context.statuses[this.status]!==undefined) s=this.item.context.statuses[this.status].score;
			//console.log(this,this.item);
			return s;
		};
		this.output = function() {
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
		this.update = function(withEmptyRecord) {
			var now=new Date();
			this.warning=this.expires.getTime()<new Date(now.setDate(now.getDate()+this.item.context.schema.expiryWarningDays)).getTime();
			this.overdue=false;
			if (this.expires.getTime()<new Date().getTime()) {
				this.status='needsattention';
				this.warning=false;
				this.overdue=true;
			}
			var me = this;
			var statusColour = (this.item.context.statuses[this.status] !== undefined) ? this.item.context.statuses[this.status].colour : null;
			if (statusColour!==null && !statusColour.match(/^#/)) statusColour='#'+statusColour;
			//console.log(statusColour);
			if (this.warning) statusColour=this.item.context.colours.amber;
			var actionColour=(this.overdue)?this.item.context.statuses[this.status].colour:this.item.context.colours.cyan;
			var borderColour=statusColour;
			if (borderColour!==null && !borderColour.match(/^#/)) borderColour='#'+borderColour;
			if (statusColour!==null) statusColour=yoodooStyler.rgbToHex(yoodooStyler.tint(yoodooStyler.hexToRGB(statusColour),0.9,0));
			if (statusColour!==null && !statusColour.match(/^#/)) statusColour='#'+statusColour;
			var docParams={'4D4D4D':'999999'};
			if (this.doc!='') docParams['4D4D4D']=this.item.context.colours.cyan;
			var actionParams={'4D4D4D':'999999'};
			if (this.action!='') actionParams['4D4D4D']=actionColour.replace(/#/g,'');

			this.button.empty().append(
				$(yoodoo.e("div")).html((this.text == '') ? 'empty' : this.text).css({
				})
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
				if (this.text == '') {
					this.button.addClass("emptyRecord");
				} else {
					this.button.removeClass("emptyRecord");
				}
			}
			this.item.update();
		};
		this.remove = function() {
			this.item.remove(this);
			this.button.remove();
			this.item.context.showRecord(false);
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
			this.inputs.text = new yoodoo.ui.textarea({
				label : this.item.textPlaceholder,
				onchange : function() {
					me.text = this.value;
					updateSection.apply(this,[this.value=='']);
					me.update();
				}
			});

			this.inputs.status = this.item.context.statusBox();
			this.inputs.status.val(this.status).bind("change", function() {
				me.status = this.value;
				if (me.status=='needsattention') {
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
					/*
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
					*/
				}
				$(this).css({
					background : (me.item.context.statuses[this.value].colour.match(/^#/)?'':'#')+me.item.context.statuses[this.value].colour
				});
				updateSection.apply(this,[this.value=='']);
				me.checkEmptyRecord();
				me.update();
			});
			if (me.item.context.statuses[me.status]!==undefined)
				this.inputs.status.css({
					background : (me.item.context.statuses[me.status].colour.match(/^#/)?'':'#')+me.item.context.statuses[me.status].colour
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
					me.doc = this.value;
					updateSection.apply(this,[this.value=='']);
					me.update();
				}
			});
			this.inputs.doctype = new yoodoo.ui.textarea({
				label : this.item.docTypePlaceholder,
				onchange : function() {
					me.doctype = this.value;
					updateSection.apply(this,[this.value=='']);
					me.update();
				}
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



			rows.push(this.editSection.apply(this.inputs.text,[this.inputs.text.render(this.text)]));
			rows.push(this.editSection.apply(this.inputs.date,[this.inputs.date.render(this.expires)]));
			rows.push(this.editSection.apply(this.inputs.status.get(0),[
				$(yoodoo.e("div")).addClass("yoodooUI yoodooUI_selectbox").append(
					$(yoodoo.e("label")).html(this.item.statusPlaceholder)
				).append(
					this.inputs.status
				)
			]));
			rows.push(this.editSection.apply(this.inputs.doc,[this.inputs.doc.render(this.doc)]));
			rows.push(this.editSection.apply(this.inputs.doctype,[this.inputs.doctype.render(this.doctype)]));

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

			this.inputs.responsibility = new yoodoo.ui.text({
				label : this.item.responsiblePlaceholder,
				onchange : function() {
					me.who = this.value;
					updateSection.apply(this,[this.value=='']);
					me.update();
				}
			});
			this.inputs.actionplan = new yoodoo.ui.textarea({
				label : this.item.actionplanPlaceholder,
				onchange : function() {
					me.action = this.value;
					updateSection.apply(this,[this.value=='']);
					me.update();
				}
			});
			this.inputs.notmet = new yoodoo.ui.textarea({
				label : this.item.notMetPlaceholder,
				onchange : function() {
					me.notmet = this.value;
					updateSection.apply(this,[this.value=='']);
					me.update();
				}
			});
			this.inputs.measures = new yoodoo.ui.textarea({
				label : this.item.measuresPlaceholder,
				onchange : function() {
					me.measures = this.value;
					updateSection.apply(this,[this.value=='']);
					me.update();
				}
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
					me.sources = this.value;
					updateSection.apply(this,[this.value=='']);
					me.update();
				}
			});
			this.inputs.affects = new yoodoo.ui.textarea({
				label : this.item.affectedPlaceholder,
				onchange : function() {
					me.affects = this.value;
					updateSection.apply(this,[this.value=='']);
					me.update();
				}
			});



			rows.push(this.editSection.apply(this.inputs.actionplan,[this.inputs.actionplan.render(this.action)]).addClass("actionPlan"));
			rows.push(this.editSection.apply(this.inputs.responsibility,[this.inputs.responsibility.render(this.who)]).addClass("actionPlan"));
			rows.push(this.editSection.apply(this.inputs.notmet,[this.inputs.notmet.render(this.notmet)]).addClass("actionPlan"));
			rows.push(this.editSection.apply(this.inputs.measures,[this.inputs.measures.render(this.measures)]).addClass("actionPlan"));
			rows.push(this.editSection.apply(this.inputs.manager,[this.inputs.manager.render(this.manager)]).addClass("actionPlan"));
			rows.push(this.editSection.apply(this.inputs.sources,[this.inputs.sources.render(this.sources)]).addClass("actionPlan"));
			rows.push(this.editSection.apply(this.inputs.affects,[this.inputs.affects.render(this.affects)]).addClass("actionPlan"));
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
				updateSection.apply(div.source,[div.source.value=='']);

				if (rows.length>0) this.scrollArea.append($(yoodoo.e("div")).addClass("sectionLink"));
			}
			var scrollArea=this.scrollArea.get(0);
			this.scrollArea.find("textarea,input,select").bind("focus",function() {
				var sect=yoodoo.parentOfType(this,['.recordSection']);
				if(!$(sect).prev().hasClass('promptDescription')){
					var t=$(sect).offset().top;
					var st=$(scrollArea).offset().top;
					if (t>st) $(scrollArea).animate({
						scrollTop:scrollArea.scrollTop+(t-st)
					},500);
				}
			});

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
		var helpMessage = $(yoodoo.e("div")).html(text).css({
			padding : '75px 10px 10px 10px',
			height:'100%',
			'overflow-y':'auto',
			'box-sizing':'border-box',
			border:'3px solid #555',
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
		}).click(function(e) {
			if (e.target.tagName!="A") {
				yoodoo.stopSound();
				$(this).fadeOut(300,function() {$(this).remove();});
			}
		}).append(helpMessage).prepend(
			$(yoodoo.e("h2")).html("Expert insight").css({
				transform:'rotate(10deg)',
				display:'inline-block',
				position:'absolute',
				right:'75px',
				top:'60px',
				color:'#791F1F',
				'text-transform':'uppercase',
				border:'2px solid #791f1f',
				padding:'2px 6px',
				background:'#fff'
			})
		);
		$(yoodoo.widget).append($(blockout).hide().fadeIn());
		if (typeof(sound)=="string" && sound.length>0) yoodoo.playSound(yoodoo.replaceDomain('domain:uploads/sitespecific/yoodoo.siteFolder/' + sound));
	},
	statusBox : function() {
		var sel = $(yoodoo.e("select"));
		sel.append($(yoodoo.e("option")).attr("value", '').html('Select a status').css({
			display : 'none'
		}));
		for (var k in this.statuses) {
			sel.append($(yoodoo.e("option")).attr("value", k).html(this.statuses[k].title).css({
				color : (this.statuses[k].colour.match(/^\#/)?'':'#')+this.statuses[k].colour
			}));
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
		if (this.value.archived!==undefined) {
			for(var k in this.value.archived) {
				this.value[k]=$.extend(true,[],this.value.archived[k]);
			}
			delete this.value.archived;
		}
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
		return v;
	},
	getsummary : function() {
		var v = {
			warnings:this.fullWarnings(),
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
	}
};
