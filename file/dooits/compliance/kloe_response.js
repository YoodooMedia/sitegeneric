
var kloe_response = {
	/*statusWarningId: null,
	getWarningStatusId:function(callback) {
		if (typeof(callback)!="function") callback=function(){};
		if (this.status===undefined) {
			yoodoo.object.get(this.objectName.status,function(list) {
				kloe_response.status=list.shift();
				callback(kloe_response.findStatusWarning());
			},function(){},true);
		}else if (this.status.records.length>0) {
			callback(kloe_response.findStatusWarning());
		}else{
			this.status.get(function() {
				callback(kloe_response.findStatusWarning());
			},function(){},0,{});
		}

	},
	findStatusWarning:function() {
		if (this.statusWarningId!==null) return this.statusWarningId;
		for(var s in this.status.records) {
			if (this.status.records[s].value.typst==0) this.statusWarningId=this.status.records[s].Id;
		}
		return this.statusWarningId;
	},*/
	expiryWarningDays: 7,
	objectName: {
		responses: 'KLOE Responses',
		evidence: 'KLOE evidence',
		actionPlans: 'KLOE action plans',
		status: 'KLOE Status',
		responsibility: 'KLOE responsibility',
		keyQuestions: 'KLOE Key Questions',
		businessSector: 'KLOE Business sector',
		keyLines: 'KLOE Key Lines of Enquiry',
		subSections: 'KLOE Prompts'
	},
	parameters: {
		"DisplayName": "sqgjb",
		"Expiry": "ohrwc",
		"Status": "rjhub",
		"KeyQuestion": "qbnov",
		"BusinessSector": "osfzh",
		"Prompt": "lsswx",
		"KeyLineOfEnquiry": "anpev",
		"EvidenceCount": "glqfo",
		"ActionPlanCount": "hwlle",
		"Text": "znajr",
		"InheritedId": "yyzho",
		"AllowInheritance": "znjjl",
		"ReserveForPIR": "drkdn",
		"LockedWhenInherited": "nsabm",
		"OptionalInheritance": "lctgx",
		"PromptLinkage": "iwjrx",
		"ActiveInheritance": "ztvxs"
	},
	promptParameters: {
		"Reference name": "clzyj",
		"Business Sector": "pbyno",
		"Key Question": "wuthv",
		"Key Line of Enquiry": "viign",
		"Name": "lvzfz",
		"Suggested response count": "xlbzu",
		"Presentation": "zgsux"
	},
	promptPresentionParameters: {
		"How": "lowlk",
		"Document": "cqriw",
		"DocumentType": "pgxmk",
		"FileEmpty": "iqobi",
		"Expiry": "cdkna",
		"Status": "ulaff",
		"NotMet": "owwor",
		"ActionPlan": "ustuv",
		"Responsible": "ofenc",
		"Measures": "kmpgx",
		"Manager": "eqmls",
		"Resources": "tmdor",
		"Affected": "hroxo",
		"DefaultDays": "ccjxl",
		"DefaultMonths": "dbqhp",
		"DefaultYears": "sibbg",
		"Description": "xikvk",
		"ShortDescription": "asccj",
		"HelpText": "ezvuw"
	},
	evidenceParameters: {
		'AllowInheritance': "znjjl",
		'Data': "vtyxa",
		'InheritedId': "ozeer",
		'LockedWhenInherited': "nsabm",
		'Response': "iinyd",
		'WhatIsYourEvidence': "vfsye"
	},
	evidenceData: {
		'Name': 'webwy',
		'Link': 'duedq',
		'Icon': 'bldfb',
		'Bytes': 'yfizg',
		'WhatIsYourEvidence': 'ripkx',
		'WhereIsYourEvidence': 'fljpz'
	},
	actionPlanParameters: {
		'AllowInheritance': "znjjl",
		'Data': "jzowf",
		'HowIsThisNotMet': "stsbn",
		'InheritedId': "ozeer",
		'LockedWhenInherited': "nsabm",
		'ManagementResponsibility': "rpawr",
		'Response': "kgzgo",
		'Responsible': "zwhln"
	},
	actionPlanData: {
		'HowIsThisNotMet': 'idqdq',
		'WhatIsThePlanForAction': 'kqnom',
		'EnsureImprovements': 'habov',
		'WhatResources': 'sgwen',
		'AffectServiceUsers': 'kaifp'
	},
	icons: {
		walking: {
			img: '/uploads/sitespecific/yoodoo.siteFolder/image/walking4D4D4D.png',
			svg: '<path fill="#4D4D4D" d="M94.563,23.5L78.438,37.625l-8.5-5.125l-0.608-0.165c4.788-0.398,8.546-4.199,8.546-8.835 c0-4.901-4.197-8.875-9.375-8.875s-9.375,3.974-9.375,8.875c0,2.902,1.479,5.472,3.754,7.091l-8.191-2.216L43.063,31l-4.5,9.5 l-3.25-1.375L30.188,43.5l8.625,4.125L48.438,36l3.375,1.125l-4.75,19.5l-13.25,11.25L15.688,52.5L6.063,65l11.25-2.75l13,15.25 l24.25-8.75l13-3.125l8.125,21.25L90.313,79.5l-11.125-2.25l-3.5-19l-14.75-2l6.625-15l13.875,4.875L92.813,32.75l3.125,0.75 l0.75-12.875L94.563,23.5z"/>'
		},
		cross: {
			img: '/uploads/sitespecific/yoodoo.siteFolder/image/cross4D4D4D.png',
			svg: '<rect x="37.747" y="7.931" transform="matrix(-0.7689 -0.6393 0.6393 -0.7689 56.4817 120.4132)" fill="#4D4D4D" width="24.507" height="84.138"/><rect x="37.746" y="7.931" transform="matrix(0.6393 -0.769 0.769 0.6393 -20.4129 56.483)" fill="#4D4D4D" width="24.508" height="84.138"/>'
		},
		tick: {
			img: '/uploads/sitespecific/yoodoo.siteFolder/image/tick4D4D4D.png',
			svg: '<polygon fill="#4D4D4D" points="78.091,10.608 39.669,56.819 18.434,39.164 3.064,57.646 24.3,75.305 43.145,90.973 96.936,26.276"/>'
		},
		left: {
			img: '/uploads/sitespecific/yoodoo.siteFolder/image/back4D4D4D.png',
			svg: '<polygon fill="#4D4D4D" points="69.747,0.615 26.475,50.002 69.747,99.385 79.689,90.936 43.831,50.002 79.689,9.078 "/>'
		},
		exclamation: {
			img: '/uploads/sitespecific/yoodoo.siteFolder/image/exclamation4D4D4D.png',
			svg: '<path fill="#4D4D4D" d="M39.841,83.397c0-4.438,4.305-7.643,10.331-7.643c6.026,0,9.986,3.205,9.986,7.643 c0,4.314-3.96,7.644-10.33,7.644C43.974,91.041,39.841,87.712,39.841,83.397z M44.146,65.893L41.735,6.597h16.529l-2.41,59.296 H44.146z"/>'
		},
		speaker: {
			img: '/uploads/sitespecific/yoodoo.siteFolder/image/speaker4D4D4D.png',
			svg: '<polygon id="polygon1" points="39.389,13.769 22.235,28.606 6,28.606 6,47.699 21.989,47.699 39.389,62.75 39.389,13.769" style="stroke:#111111;stroke-width:5;stroke-linejoin:round;fill:#111111;" /><path id="path1" d="M 48.128,49.03 C 50.057,45.934 51.19,42.291 51.19,38.377 C 51.19,34.399 50.026,30.703 48.043,27.577" style="fill:none;stroke:#111111;stroke-width:5;stroke-linecap:round"/> <path id="path2" d="M 55.082,20.537 C 58.777,25.523 60.966,31.694 60.966,38.377 C 60.966,44.998 58.815,51.115 55.178,56.076" style="fill:none;stroke:#111111;stroke-width:5;stroke-linecap:round"/> <path id="path1" d="M 61.71,62.611 C 66.977,55.945 70.128,47.531 70.128,38.378 C 70.128,29.161 66.936,20.696 61.609,14.01" style="fill:none;stroke:#111111;stroke-width:5;stroke-linecap:round"/>'
		},
		evidence: {
			img: '/uploads/sitespecific/yoodoo.siteFolder/image/evidence4D4D4D.png',
			svg: '<path fill="#4D4D4D" d="M10.027,12.236l1.166,13.017c-1.41,0.127-2.819,0.252-4.229,0.38c-1.444,0.125,0.13-1.285,0.073-1.919c-0.089-0.996-0.178-1.992-0.268-2.989c-0.191-2.132-0.382-4.264-0.573-6.395c-0.072-0.778-1.979-1.572-0.072-1.743C7.426,12.47,8.727,12.353,10.027,12.236L10.027,12.236z M10.826,12.165l3.618-0.324l0.303,3.376c0.161,1.806-1.87-1.262-2.048-1.393C11.804,13.167,10.523,13.669,10.826,12.165L10.826,12.165z M11.403,19.111l-0.099-1.106c0.607-0.383,1.814-3.584,2.015-1.347c0.105,1.177,0.21,2.354,0.316,3.531C13.83,22.307,12.018,19.211,11.403,19.111C11.403,19.111,11.71,19.161,11.403,19.111z M12.002,25.181l-0.093-1.03c1.967-0.5,1.717-1.978,2.728-3.199c0.803-0.983,0.932,2.017,0.949,2.211c0.091,1.017,0.551,1.647-0.531,1.745C14.037,24.998,13.02,25.09,12.002,25.181L12.002,25.181z"/><path fill="#4D4D4D" d="M23.5,20.785L22.945,24.2l-2.361,0.211c-0.898-2.366-1.796-4.732-2.694-7.098c-0.473-1.246-0.945-2.491-1.418-3.736c-0.271-0.716-1.94-1.745-0.093-1.91c1.073-0.096,2.878-0.646,3.901-0.35c1.841-0.164,0.165,1.138,0.506,2.069C21.69,15.853,22.595,18.319,23.5,20.785L23.5,20.785z M23.719,19.392l-0.637-1.75c0.184-1.126,1.559-5.224-0.188-5.53c-1.079-0.276,0.053-1.034,0.467-1.071c0.679-0.061,1.358-0.122,2.037-0.182c1.144-0.104,0.841,0.927,0.089,1.203C23.923,13.023,23.979,17.822,23.719,19.392L23.719,19.392z"/><path fill="#4D4D4D" d="M33.092,23.29c-1.413,0.127-2.825,0.255-4.238,0.38c-1.444,0.131,0.129-1.286,0.072-1.918c-0.089-0.996-0.179-1.992-0.268-2.989c-0.191-2.132-0.382-4.263-0.574-6.395c-0.084-0.962-1.819-1.587,0.185-1.767c1.296-0.116,2.592-0.232,3.888-0.349c1.446-0.127-0.129,1.285-0.072,1.918c0.089,0.997,0.179,1.993,0.268,2.989c0.191,2.132,0.382,4.264,0.574,6.396C32.99,22.274,34.936,23.113,33.092,23.29L33.092,23.29z"/><path fill="#4D4D4D" d="M39.205,9.621l1.167,13.017c-1.41,0.127-2.819,0.255-4.229,0.379c-1.442,0.131,0.13-1.288,0.073-1.919c-0.089-0.996-0.178-1.992-0.268-2.988c-0.191-2.132-0.382-4.264-0.573-6.396c-0.072-0.777-1.979-1.572-0.072-1.743C36.604,9.854,37.904,9.738,39.205,9.621L39.205,9.621z M41.941,19.748l-0.674-7.524c-0.122-1.35-1.53-1.401-1.263-2.675c6.943-0.62,7.997,12.406,1.167,13.017c-0.029-0.318-0.151-0.719-0.093-1.03C41.944,21.212,42.02,20.621,41.941,19.748C41.941,19.748,41.972,20.085,41.941,19.748z"/><path fill="#4D4D4D" d="M51.128,8.552l1.167,13.017c-1.41,0.126-2.819,0.25-4.229,0.379c-1.445,0.131,0.128-1.286,0.071-1.919c-0.089-0.996-0.178-1.992-0.268-2.988c-0.191-2.132-0.382-4.264-0.573-6.396c-0.068-0.777-1.981-1.573-0.071-1.744C48.526,8.785,49.827,8.669,51.128,8.552L51.128,8.552z M51.927,8.48l3.618-0.324l0.303,3.376c0.161,1.805-1.87-1.262-2.049-1.393C52.904,9.483,51.622,9.986,51.927,8.48L51.927,8.48z M52.504,15.427l-0.099-1.106c0.606-0.383,1.813-3.584,2.014-1.348c0.106,1.178,0.212,2.355,0.317,3.533C54.923,18.623,53.123,15.527,52.504,15.427C52.504,15.427,52.81,15.477,52.504,15.427z M53.102,21.497l-0.092-1.03c1.13-0.29,2.02-1.061,2.396-2.188c0.162-0.484,0.993-2.064,1.13-0.482c0.436,0.717,0.226,2.512,0.303,3.366C55.593,21.273,54.347,21.386,53.102,21.497L53.102,21.497z"/><path fill="#4D4D4D" d="M62.099,7.569l5.566,8.383l0.378,4.205l-2.451,0.22c-1.335-1.995-2.669-3.99-4.004-5.986c-0.791-1.183-2.521-5.127-4.157-5.385c-1.304-0.333,0.703-1.082,1.078-1.116C59.705,7.783,60.902,7.676,62.099,7.569L62.099,7.569z M58.638,11.253l1.102,1.594l0.458,5.111c0.077,0.86,0.491,1.558,1.325,1.861c1.489,0.735-2.314,1.13-2.521,1.148c-1.88,0.168,0.117-1.541,0.22-2.118c0.135-0.757-0.052-1.657-0.119-2.41C58.947,14.71,58.793,12.982,58.638,11.253L58.638,11.253z M67.528,14.426l-1.105-1.622l-0.236-2.641c-0.066-0.747-1.82-2.354-1.424-2.713c0.519-0.477,2.097-0.309,2.741-0.366c1.451-0.13-0.429,2.282-0.336,3.316C67.288,11.742,67.408,13.084,67.528,14.426L67.528,14.426z"/><path fill="#4D4D4D" d="M74.275,6.218l0.104,1.154c-2.027,0.516-0.304,8.424-0.156,10.05c0.112,1.301,1.556,0.857,1.266,2.327C68.131,20.412,67.32,6.418,74.275,6.218L74.275,6.218z M75.09,7.317l-0.104-1.153c0.797,0.065,2.483,0.995,2.848-0.034c0.523-1.452,1.034,1.349,1.046,1.482c0.083,0.925,0.166,1.85,0.249,2.775c0.159,1.728-1.128,0.012-1.323-0.463C77.351,8.819,76.429,7.387,75.09,7.317C75.09,7.317,75.362,7.332,75.09,7.317z M76.225,19.684L76.12,18.52c0.867-0.147,1.659-0.745,2.093-1.499c0.186-0.323,0.504-2.271,1.248-1.53C80.906,16.943,77.363,19.525,76.225,19.684C76.225,19.684,76.744,19.611,76.225,19.684z"/><path fill="#4D4D4D" d="M85.011,5.515l1.167,13.017c-1.409,0.126-2.819,0.25-4.229,0.379c-1.445,0.125,0.129-1.283,0.071-1.919c-0.089-0.996-0.179-1.992-0.268-2.989c-0.191-2.132-0.382-4.264-0.573-6.396c-0.068-0.777-1.982-1.572-0.071-1.743C82.409,5.748,83.71,5.632,85.011,5.515L85.011,5.515z M85.81,5.443l3.618-0.324l0.303,3.376c0.161,1.805-1.87-1.262-2.049-1.393C86.787,6.446,85.505,6.949,85.81,5.443L85.81,5.443z M86.387,12.39l-0.1-1.106c0.608-0.383,1.814-3.583,2.015-1.347c0.105,1.177,0.211,2.354,0.316,3.532C88.812,15.585,87.002,12.489,86.387,12.39C86.387,12.39,86.692,12.439,86.387,12.39z M86.984,18.459l-0.092-1.03c1.131-0.288,2.018-1.062,2.396-2.188c0.162-0.483,0.993-2.065,1.13-0.482c0.436,0.716,0.226,2.512,0.303,3.367C89.476,18.236,88.229,18.348,86.984,18.459L86.984,18.459z"/><polygon fill="none" stroke="#4D4D4D" stroke-miterlimit="10" points="94.512,20.815 3.211,29 1.488,9.785 92.789,1.601 94.512,20.815 "/>'
		},
		editDocument:{
			img:'/uploads/sitespecific/yoodoo.siteFolder/image/editDocument4D4D4D.png',
			svg:'<path fill="#FFFFFF" stroke="#4D4D4E" stroke-width="5" stroke-miterlimit="10" d="M69.055,87.663c0,2.762-2.238,5-5,5H12.297 c-2.761,0-5-2.238-5-5V15.471c0-2.761,2.239-5,5-5h51.758c2.762,0,5,2.239,5,5V87.663z"/><polygon fill="#FFFFFF" stroke="#4D4D4E" stroke-width="5" stroke-linejoin="round" stroke-miterlimit="10" points="87.048,24.173 40.26,67.281 49.159,76.906 95.947,33.799 "/><polygon fill="none" stroke="#4D4D4E" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" points="40.26,67.281 49.159,76.906 35.069,80.979 "/>'
		}
	},
	icon: function() {
		if (this.doSVG) {
			if (typeof(arguments[0]) == "object") arguments[0] = arguments[0].svg;
			return yoodoo.icons.drawSVG.apply(yoodoo.icons, arguments);
		} else {
			if (typeof(arguments[0]) == "object") arguments[0] = arguments[0].img;
			var replacer = {};
			if (typeof(arguments[arguments.length - 1]) == "object") replacer = arguments[arguments.length - 1];
			var url = arguments[0];
			for (var k in replacer) url = url.replace(k, replacer[k]);
			var img = yoodoo.e("img");
			img.src = yoodoo.replaceDomain('domain:' + url);
			return img;
		}
	},
	doSVG: (document.createElementNS !== undefined),
	colours: {
		red: 'AB2A2A',
		amber: 'EF9225',
		cyan: '619FEC',
		green: '1ADF23',
		grey: 'eeeeee'
	},
	record: function(obj, item, templater,deleted,prompt) {
		this.item = null;
		this.prompt = yoodoo.keyQuestion.promptsObject.recordsCache[obj.value[kloe_response.parameters.Prompt]];
		if (typeof(item) != "undefined") {
			this.item = item;
			if (typeof(kloe) != "undefined") kloe.recordCount++;
		}
		this.inputs = {};
		if (typeof(templater) == "undefined" || templater===null) templater = (yoodoo.user.managerType !== undefined && yoodoo.user.managerType.subManagers instanceof Array && yoodoo.user.managerType.subManagers.length > 0);
		this.templater = (templater === true);
		this.completeDate = null;
		this.expires = new Date();
		this.object = obj;
		this.deleted=function() {};
		if (typeof(deleted)=="function") this.deleted=deleted;
		this.defaultTime=[];
		if (this.item!==null) {
			this.defaultTime=[this.item.defaultExpiryDays,this.item.defaultExpiryMonth,this.item.defaultExpiryYears];
		}else{
			this.defaultTime=[
				this.prompt.value[kloe_response.promptParameters.Presentation][kloe_response.promptPresentionParameters.DefaultDays],
				this.prompt.value[kloe_response.promptParameters.Presentation][kloe_response.promptPresentionParameters.DefaultMonths],
				this.prompt.value[kloe_response.promptParameters.Presentation][kloe_response.promptPresentionParameters.DefaultYears]
			];
		}
		for(var d in this.defaultTime) {
			if (isNaN(this.defaultTime[d])) this.defaultTime[d]=0;
		}
		if (this.templater !== true) {
			this.expires.setDate(this.expires.getDate() + parseInt(this.defaultTime[0]));
			this.expires.setMonth(this.expires.getMonth() + parseInt(this.defaultTime[1]));
			this.expires.setFullYear(this.expires.getFullYear() + parseInt(this.defaultTime[2]));
			if (this.object.value[kloe_response.parameters.Expiry] === undefined) this.object.value[kloe_response.parameters.Expiry] = yoodoo.formatDate('Y-m-d H:i:s', this.expires);
			if (this.object.value[kloe_response.parameters.Expiry]) this.expires = yoodoo.readDate(this.object.value[kloe_response.parameters.Expiry]);
			if (this.expires.getTime() < new Date().getTime()) {
				this.object.value[kloe_response.parameters.Status] = yoodoo.kloeStatus.warning.Id;
				this.warning == false;
				console.log(this.object);
			} else {
				var now = new Date();
				this.warning = this.expires.getTime() < new Date(now.setDate(now.getDate() + kloe_response.expiryWarningDays)).getTime();
			}
		}
		var me=this;
		this.updateStatus={
			messages:[],
			addedResponse:0,
			updatedResponse:0,
			addedActionPlans:0,
			updatedActionPlans:0,
			addedEvidence:0,
			updatedEvidence:0,
			object:me.object,
			clear:function() {
				this.messages=[];
			},
			add:function(message,opts) {
				this.messages.push(message);
				for(var k in opts) this[k]+=opts[k];
			},
			output:function() {
				if (this.messages.length==0) return null;
				var indicator=$(yoodoo.e("div")).addClass("indicator");
				if (this.object.Id>0) indicator.addClass("updated");
				/*indicator.append(
					$(yoodoo.e("div")).html('<div>'+this.messages.join('</div><div>')+'</div>')
				);*/
				yoodoo.bubble(indicator.get(0),'<div>'+this.messages.join('</div><div>')+'</div>');
				return indicator;
			}
		};
		this.updateInherited = function() {
			this.updateStatus.clear();
			if (this.object !== null && this.object.inheritedResponse !== undefined) {
				//console.log(this.object,this.object.inheritedResponse);
				var locked=this.object.inheritedResponse.value[kloe_response.parameters.LockedWhenInherited] === true;
				var optional=this.object.inheritedResponse.value[kloe_response.parameters.OptionalInheritance] === true;
				//console.log(locked,optional);
				if (this.object.Id>0) {
					if (locked) {
						if (JSON.stringify(this.object.value[kloe_response.parameters.Text]) != JSON.stringify(this.object.inheritedResponse.value[kloe_response.parameters.Text])) {
							this.updateStatus.add("Automatically updated",{updatedResponse:1});
							this.object.value[kloe_response.parameters.Text] = this.object.inheritedResponse.value[kloe_response.parameters.Text];
							this.object.value[kloe_response.parameters.DisplayName] = this.object.inheritedResponse.value[kloe_response.parameters.DisplayName];
						}
						this.evidence.updateInherited();
						this.actionPlans.updateInherited();
					}
				}else if (optional) {
					this.updateStatus.add("Added from Template",{addedResponse:1});
				}else{
					this.updateStatus.add("Automatically added from Template",{addedResponse:1});
				}
			}
		};
		this.immediateAction = function() {
			return (this.object.value[kloe_response.parameters.Status] == yoodoo.kloeStatus.warning.Id);
		};
		this.imminentAction = function() {
			return (this.object.value[kloe_response.parameters.Status] != yoodoo.kloeStatus.warning.Id) && this.warning;
		};
		this.pendingActionPlan = function() {
			if (this.object !== null) return (this.score() == 0) ? ((this.object.value[kloe_response.parameters.ActionPlanCount] !== undefined) ? this.object.value[kloe_response.parameters.ActionPlanCount] : 0) : 0;
			return (this.action != '' && this.score() == 0) ? 1 : 0;
		};
		this.remove = function() {
			if (this.item !== null) this.item.remove(this);
			if (this.object !== null) this.object.erase();
			this.button.animate({
				width: 0
			}, 300, function() {
				$(this).remove();
			});
			this.deleted(this);
			if (this.dialog!==undefined) this.dialog.close();
		};
		this.score = function() {
			if (yoodoo.kloeStatus.object.recordsCache[this.object.value[kloe_response.parameters.Status]] !== undefined) {
				return yoodoo.kloeStatus.object.recordsCache[this.object.value[kloe_response.parameters.Status]].getValue('Score');
			} else {
				return 0;
			}
		};
		this.output = function() {
			return {};
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
		this.statusColour = function() {
			var statusColour = null;
			if (this.object.value[kloe_response.parameters.Status] > 0 && yoodoo.kloeStatus.object.recordsCache[this.object.value[kloe_response.parameters.Status]] !== undefined) {
				statusColour = yoodoo.kloeStatus.object.recordsCache[this.object.value[kloe_response.parameters.Status]].getValue("Colour");
			}
			if (this.warning && this.immediateAction()===false) statusColour = this.item.context.colours.amber;
			return statusColour;
		};
		this.update = function(withEmptyRecord) {
			var statusColour = null;
			var me = this;
			var actionColour=null;
			if (this.templater) {
				statusColour = kloe_response.colours.grey;
				actionColour = kloe_response.colours.cyan;
			} else {
				var now = new Date();
				this.warning = this.expires.getTime() < new Date(now.setDate(now.getDate() + kloe_response.expiryWarningDays)).getTime();
				this.overdue = false;
				if (this.expires.getTime() < new Date().getTime()) {
					this.status =  yoodoo.kloeStatus.warning.Id ;
					this.warning = false;
					this.overdue = true;
				}
				statusColour = this.statusColour();
				if (this.warning && this.immediateAction()===false) statusColour = kloe_response.colours.amber;
				actionColour = (this.overdue) ? kloe_response.colours.red : kloe_response.colours.cyan;
			}
			var borderColour = statusColour;
			if (borderColour !== null && !borderColour.match(/^#/)) borderColour = '#' + borderColour;
			if (statusColour !== null) statusColour = yoodooStyler.rgbToHex(yoodooStyler.tint(yoodooStyler.hexToRGB(statusColour), 0.9, 0));
			if (statusColour !== null && !statusColour.match(/^#/)) statusColour = '#' + statusColour;
			var docParams = {
				'4D4D4D': '999999'
			};
			var actionParams = {
				'4D4D4D': '999999'
			};
			if (this.object.value[kloe_response.parameters.EvidenceCount] > 0) docParams['4D4D4D'] = kloe_response.colours.cyan;
			if (actionColour!==null && this.object.value[kloe_response.parameters.ActionPlanCount] > 0) actionParams['4D4D4D'] = actionColour.replace(/#/g, '');
			this.button.empty().append(
				$(yoodoo.e("div")).html(this.object.displayName())
			).prepend(
				kloe_response.icon(kloe_response.icons.walking, 25, 25, 100, 100, actionParams)
			).prepend(
				kloe_response.icon(kloe_response.icons.evidence, 80, 25, 100, 30, docParams)
			).unbind("click").click(function(e) {
				if (e.target.tagName=="BUTTON" && e.target!==this) {

				}else{
					me.edit();
				}
			}).css({
				background: (statusColour === null) ? '#dddddd' : statusColour,
				color: (statusColour === null) ? '#000' : '#000',
				'border-color': borderColour
			}).append(
				this.templater ? null :
				$(yoodoo.e("span")).html(yoodoo.formatDate('jS F Y', this.expires)).css({
					position: 'absolute',
					top: '5px',
					right: '5px'
				}).addClass((this.warning || this.overdue) ? 'imminentDate' : '')
			);
			this.button.append(this.updateStatus.output());
			this.button.append(
				$(yoodoo.e("button")).attr("type","button").addClass("clipboardCopy").click(function(e) {
					e.preventDefault();
					var copy={};
					copy[kloe_response.parameters.DisplayName]=me.object.value[kloe_response.parameters.DisplayName];
					copy[kloe_response.parameters.Text]=me.object.value[kloe_response.parameters.Text];
					copy.evidence=[];
					for(var r in me.evidence.records) {
						var ecopy={};
						ecopy[kloe_response.evidenceParameters.Data]=me.evidence.records[r].value[kloe_response.evidenceParameters.Data];
						ecopy[kloe_response.evidenceParameters.WhatIsYourEvidence]=me.evidence.records[r].value[kloe_response.evidenceParameters.WhatIsYourEvidence];
						copy.evidence.push(ecopy);
					}
					copy.actionPlans=[];
					for(var r in me.actionPlans.records) {
						var ecopy={};
						ecopy[kloe_response.actionPlanParameters.Data]=me.actionPlans.records[r].value[kloe_response.actionPlanParameters.Data];
						ecopy[kloe_response.actionPlanParameters.HowIsThisNotMet]=me.actionPlans.records[r].value[kloe_response.actionPlanParameters.HowIsThisNotMet];
						copy.actionPlans.push(ecopy);
					}
					var description=[];
					if (copy.evidence.length>0) description.push(copy.evidence.length+' evidence record'+((copy.evidence.length==1)?'':'s'));
					if (copy.actionPlans.length>0) description.push(copy.actionPlans.length+' action plan'+((copy.evidence.length==1)?'':'s'));
					if (description.length==0) {
						description='No evidence or action plans';
					}else{
						description='Includes '+description.join(" and ");
					}
					yoodoo.clipboard.add('kloe_response',me.object.displayName(),copy,description);
				})
			);
			if (withEmptyRecord !== false) {
				if (typeof(this.object.value[kloe_response.parameters.DisplayName]) == "string" && this.object.value[kloe_response.parameters.DisplayName] != '') {
					this.button.removeClass("emptyRecord");
				} else {
					this.button.addClass("emptyRecord");
				}
			}
			if (this.item !== null) this.item.update();
		};
		var me = this;
		this.actionPlans = {
			records:[],
			recordIds:{},
			response:me,
			object: yoodoo.object.objectNames[kloe_response.objectName.actionPlans],
			filterkey: yoodoo.object.objectNames[kloe_response.objectName.actionPlans].getParameterReferingToObjectId(yoodoo.object.objectNames[kloe_response.objectName.responses].schema.Id),
			attach:function(record) {
				if (!(record instanceof Array)) record=[record];
				for(var r in record) {
					if (isNaN(record[r].Id) || record[r].Id===null) {
						this.records.push(record[r]);
					}else if (this.recordIds[record[r].Id]===undefined) {
						this.recordIds[record[r].Id]=record[r];
						this.records.push(record[r]);
					}
				}
				this.response.object.value[kloe_response.parameters.ActionPlanCount]=this.records.length;
			},
			erase:function(plan) {
				for(var r in this.records) {
					if (plan===this.records[r]) {
						this.records.splice(r,1);
						plan.erase();
						this.response.object.value[kloe_response.parameters.ActionPlanCount]=this.records.length;
						return true;
					}
				}
				return false;
			},
			updateInherited:function() {
				var fromTemplate={};
				if (this.response.object.inheritedResponse!==undefined && this.response.object.inheritedResponse.actionPlans instanceof Array) {
					for(var a in this.response.object.inheritedResponse.actionPlans) {
						var ap=this.response.object.inheritedResponse.actionPlans[a];
						fromTemplate[ap.Id]=ap;
					}
				}
				var updated=0;
				for(var r in this.records) {
//console.log(this.records[r],this.records[r].inheritedActionPlan);
					if (this.records[r].inheritedActionPlan!==undefined) {
						var template=this.records[r].inheritedActionPlan;
						if (fromTemplate[template.Id]!==undefined) delete fromTemplate[template.Id];
						if (template.value[kloe_response.actionPlanParameters.LockedWhenInherited]) {
							var arr1=[this.records[r].value[kloe_response.actionPlanParameters.Data],this.records[r].value[kloe_response.actionPlanParameters.HowIsThisNotMet]];
							var arr2=[template.value[kloe_response.actionPlanParameters.Data],template.value[kloe_response.actionPlanParameters.HowIsThisNotMet]];
							if (JSON.stringify(arr1)!=JSON.stringify(arr2)) {
								updated++;
								this.records[r].value[kloe_response.actionPlanParameters.Data]=template.value[kloe_response.actionPlanParameters.Data];
								this.records[r].value[kloe_response.actionPlanParameters.HowIsThisNotMet]=template.value[kloe_response.actionPlanParameters.HowIsThisNotMet];
							}
						}
					}
				}
//console.log(fromTemplate);
				var i=0;
				for(var tid in fromTemplate) {
					i++;
					this.attach(kloe_response.clone.actionPlan(fromTemplate[tid],this.response.object));
				}
				if (i>0) this.response.updateStatus.add(i+' action plan'+((i==1)?'':'s')+' added',{addedActionPlans:i});
				if (updated>0) this.response.updateStatus.add(updated+' action plan'+((updated==1)?'':'s')+' updated',{updatedActionPlans:updated});
			}
		};
		this.evidence = {
			records:[],
			recordIds:{},
			response:me,
			object: yoodoo.object.objectNames[kloe_response.objectName.evidence],
			filterkey: yoodoo.object.objectNames[kloe_response.objectName.evidence].getParameterReferingToObjectId(yoodoo.object.objectNames[kloe_response.objectName.responses].schema.Id),
			attach:function(record) {
				if (!(record instanceof Array)) record=[record];
				for(var r in record) {
					if (isNaN(record[r].Id) || record[r].Id===null) {
						this.records.push(record[r]);
					}else if (this.recordIds[record[r].Id]===undefined) {
						this.recordIds[record[r].Id]=record[r];
						this.records.push(record[r]);
					}
				}
				this.response.object.value[kloe_response.parameters.EvidenceCount]=this.records.length;
			},
			erase:function(evidence) {
				for(var r in this.records) {
					if (evidence===this.records[r]) {
						this.records.splice(r,1);
						evidence.erase();
						this.response.object.value[kloe_response.parameters.EvidenceCount]=this.records.length;
						return true;
					}
				}
				return false;
			},
			updateInherited:function() {
				var fromTemplate={};
				if (this.response.object.inheritedResponse!==undefined && this.response.object.inheritedResponse.evidence instanceof Array) {
					for(var a in this.response.object.inheritedResponse.evidence) {
						var ev=this.response.object.inheritedResponse.evidence[a];
						fromTemplate[ev.Id]=ev;
					}
				}
				var updated=0;
				for(var r in this.records) {
					if (this.records[r].inheritedEvidence!==undefined) {
						var template=this.records[r].inheritedEvidence;
						if (fromTemplate[template.Id]!==undefined) delete fromTemplate[template.Id];
						if (template.value[kloe_response.evidenceParameters.LockedWhenInherited]) {
							
							var arr1=[this.records[r].value[kloe_response.evidenceParameters.Data],this.records[r].value[kloe_response.evidenceParameters.WhatIsYourEvidence]];
							var arr2=[template.value[kloe_response.evidenceParameters.Data],template.value[kloe_response.evidenceParameters.WhatIsYourEvidence]];
							if (JSON.stringify(arr1)!=JSON.stringify(arr2)) {
								updated++;
								this.records[r].value[kloe_response.evidenceParameters.Data]=template.value[kloe_response.evidenceParameters.Data];
								this.records[r].value[kloe_response.evidenceParameters.WhatIsYourEvidence]=template.value[kloe_response.evidenceParameters.WhatIsYourEvidence];
							}
						}
					}
				}
				var i=0;
				for(var tid in fromTemplate) {
					i++;
					this.attach(kloe_response.clone.evidence(fromTemplate[tid],this.response.object));
				}
				if (i>0) this.response.updateStatus.add(i+' evidence report'+((i==1)?'':'s')+' added',{addedEvidence:i});
				if (updated>0) this.response.updateStatus.add(updated+' evidence report'+((updated==1)?'':'s')+' updated',{updatedEvidence:updated});
			}
		};
		if (this.object.actionPlans instanceof Array && this.object.actionPlans.length>0) this.actionPlans.attach(this.object.actionPlans);
		if (this.object.evidence instanceof Array && this.object.evidence.length>0) this.evidence.attach(this.object.evidence);
		this.editSection = function(ele) {
			var div = yoodoo.e("div");
			div.source = this;
			div.ele = ele;
			div.disable = function(disabled) {
				$(this).find("input,select,textarea").each(function(i, e) {
					e.disabled = disabled;
				});
				if (disabled) {
					$(this).addClass("disabled");
				} else {
					$(this).removeClass("disabled");
				}
			};
			div.empty = function(empty) {
				if (empty) {
					$(this).addClass("isEmpty");
				} else {
					$(this).removeClass("isEmpty");
				}
			};
			return $(div).addClass("recordSection").append(ele);
		};
		this.responseReminder = function() {
			return $(yoodoo.e("div")).addClass('responseReminder yoodooUI').append(
				$(yoodoo.e("label")).html(this.prompt.value.zgsux.lowlk)
			).append(
				$(yoodoo.e("p")).html(this.object.value.znajr.hklsj)
			);
		};
		this.edit = function() {
			var me = this;
			var back = (this.item === null) ? null : $(yoodoo.e("button")).attr("type", "button").addClass("backButton").click(function() {
				me.update();
				me.item.context.showRecord(false);
			}).html(this.item.title).prepend(kloe_response.icon(this.item.context.icons.left, 20, 20, 100, 100, {
				'4D4D4D': 'FFFFFF'
			}));
			var rows = [];
			var confirm = $(yoodoo.e("div")).addClass("deleteConfirm").css({}).html(
				'Delete this?'
			).append(
				$(yoodoo.e("button")).attr("type", "button").html("yes").click(function() {
					if (me.item!==null) {
						me.item.context.showRecord(false);
					}else if (me.dialog!==undefined) me.dialog.close();
					me.remove();
				}).css({
					background: '#' + kloe_response.colours.red
				})
			).append(
				$(yoodoo.e("button")).attr("type", "button").html("cancel").click(function() {
					confirm.removeClass("on");
				}).css({
					background: '#' + kloe_response.colours.cyan
				})
			);
			this.scrollArea = $(yoodoo.e("div"));
			var del = $(yoodoo.e("button")).attr("type", "button").addClass("delButton").click(function() {
				confirm.addClass("on");
			}).append(
				yoodoo.icons.get('close', 12, 12, {
					'4D4D4D': 'FFFFFF'
				})
			).css({
				'border-radius': '50px',
				float: 'right'
			});
			var form = $(yoodoo.e("div"));
			form.append(
				$(yoodoo.e("div")).html(this.prompt.value[kloe_response.promptParameters.Presentation][kloe_response.promptPresentionParameters.Description]).prepend(
					$(yoodoo.e("b")).html(this.prompt.value[kloe_response.promptParameters.Name]).css({'margin-right':'10px'})
				).addClass("promptMessage")
			);
			if (typeof(this.object.value[kloe_response.parameters.Text]) != "object" && this.object.value[kloe_response.parameters.Text] !== null) this.object.value[kloe_response.parameters.Text] = {};
			// how
			var textareakey = me.object.object.parameters[kloe_response.parameters.Text].json_schema[0].key;
	//console.log(this.object.inheritedResponse);
			var disabled = (this.templater!==true && this.object !== null && this.object.inheritedResponse !== undefined && this.object.inheritedResponse.value[kloe_response.parameters.LockedWhenInherited] === true);
			var label = 'Untitled';
			if (this.prompt.value[kloe_response.promptParameters.Presentation] !== null && this.prompt.value[kloe_response.promptParameters.Presentation] !== null && this.prompt.value[kloe_response.promptParameters.Presentation][kloe_response.promptPresentionParameters.How] !== undefined) label = this.prompt.value[kloe_response.promptParameters.Presentation][kloe_response.promptPresentionParameters.How];
			if (disabled) {
				form.append($(yoodoo.e("div")).addClass("yoodooUI").append(
					$(yoodoo.e("label")).html(label)
				).append(
					$(yoodoo.e("div")).addClass('disabledTextarea').css({
						width: '80%'
					}).html((this.object.value[kloe_response.parameters.Text] === null) ? '' : this.object.value[kloe_response.parameters.Text][textareakey])
				));
			} else {
				form.append(new yoodoo.ui.textarea({
					label: label,
					maxlength: 0,
					disabled: disabled,
					rows: 3,
					onchange: function() {
						var op = {};
						op[textareakey] = this.value;
						me.object.value[kloe_response.parameters.Text] = op;
						me.object.setValue(kloe_response.parameters.DisplayName, this.value.substring(0, 254));
						me.render();
					}
				}).render(this.object.value[kloe_response.parameters.Text][textareakey]));
			}
			if (this.templater !== true) {
				var columns = $(yoodoo.e("div")).addClass("columns2");
				// status
				var stats = new yoodoo.ui.multiplechoice({
					label: this.prompt.value[kloe_response.promptParameters.Presentation][kloe_response.promptPresentionParameters.Status],
					radioBehaviour: true,
					columns: 2,
					onchange: function(e) {
						$(e.target).css({
							background: yoodoo.kloeStatus.object.recordsCache[this.value].getValue('Colour'),
							color: '#fff'
						}).parent().siblings('.yoodooUI_multiplechoiceButton').find('button').attr("style", "");
						var val = this.value;
						if (val instanceof Array) val = val.pop();
						me.object.setValue(kloe_response.parameters.Status, val);
						if (yoodoo.kloeStatus.object.recordsCache[val].getValue("Score") == 0) {
							form.addClass("requireActionPlan");
						} else {
							form.removeClass("requireActionPlan");
						}
						me.update();
					}
				});
				if (this.score() == 0) {
					form.addClass("requireActionPlan");
				} else {
					form.removeClass("requireActionPlan");
				}
				for (var b in yoodoo.kloeStatus.object.records) {
					var opt = yoodoo.kloeStatus.object.records[b];
					var cssBackgroundColour = '';
					var cssFontColour = '';
					if (this.object.value[kloe_response.parameters.Status] == opt.Id) {
						cssBackgroundColour = opt.getValue('Colour');
						cssFontColour = '#fff';
					}
					stats.add({
						label: opt.displayName(),
						value: opt.Id,
						labelClassName: opt.displayName().replace(/[^a-z^0-9]+/ig, ''),
						cssBackgroundColour: cssBackgroundColour,
						cssFontColour: cssFontColour
					}, opt.displayName().replace(/[^a-z^0-9]+/ig, ''));
				}
				columns.append(stats.render(this.object.value[kloe_response.parameters.Status]));
				// expiry
				var expiry = {
					container: $(yoodoo.e("div")).addClass("yoodooUI expiryInput"),
					record: this.object,
					item: this.item,
					baseRecord: me,
					key: kloe_response.parameters.Expiry,
					update: function() {
						var me = this;
						this.container.empty().append(
							$(yoodoo.e("label")).html(this.baseRecord.prompt.value[kloe_response.promptParameters.Presentation][kloe_response.promptPresentionParameters.Expiry])
						).append(
							$(yoodoo.e("button")).attr("type", "button").append(
								$(yoodoo.e("div")).html(yoodoo.ago(yoodoo.readDate(me.record.value[me.key])))
							).append(
								$(yoodoo.e("div")).html(yoodoo.formatDate("jS F Y", yoodoo.readDate(me.record.value[me.key])))
							).click(function() {
								me.edit();
							})
						)
					},
					edit: function() {
						var me = this;
						var dialog = new yoodoo.ui.dialog({
							html: new yoodoo.ui.date({
								label: this.baseRecord.prompt.value[kloe_response.promptParameters.Presentation][kloe_response.promptPresentionParameters.Expiry],
								onchange: function() {
									me.record.setValue(me.key, yoodoo.formatDate('Y-m-d', this.value));
									me.baseRecord.expires = this.value;
									me.update();
								}
							}).render(yoodoo.readDate(this.record.value[this.key])),
							blockoutClickClose: true,
							className: 'kloe_response_dialog'
						}).render();
					}
				};
				expiry.update();
				columns.append(expiry.container);
				form.append(columns);
			}
			var columns = $(yoodoo.e("div")).addClass("columns2");
			if (this.evidenceDisplay !== undefined) {
				this.evidenceDisplay.update();
			} else {
				this.evidenceDisplay = {
					container: $(yoodoo.e("div")).addClass("evidenceSummary").addClass("yoodooUI"),
					record: me,
					prompt: me.prompt,
					object: yoodoo.object.objectNames[kloe_response.objectName.evidence],
					filterkey: yoodoo.object.objectNames[kloe_response.objectName.evidence].getParameterReferingToObjectId(me.object.object.schema.Id),
					records: null,
					init: function() {
						this.update();
					},
					update: function() {
						this.records=this.record.evidence.records;
						var me = this;
						//this.record.object.setValue(kloe_response.parameters.EvidenceCount, this.records.length);
						this.container.removeClass("loading").empty().append(
							$(yoodoo.e("button")).attr("type", "button").html('evidence entr' + ((this.records.length == 1) ? 'y' : 'ies')).prepend(
								$(yoodoo.e("div")).html(this.records.length).append(
									kloe_response.icon(kloe_response.icons.evidence, 80, 25, 100, 30, {
										'4D4D4D': (this.records.length > 0) ? kloe_response.colours.cyan : 'dddddd'
									})
								)
							).unbind("click").click(function() {
								me.open();
							})
						);
					},
					editor: null,
					recordWindow: null,
					open: function() {
						var me = this;
						var loc1=$('.promptMessage').offset();
						var loc2=$('.dooitDisplay').offset();
						var padding=3;
						var dx=loc2.left-loc1.left-1-padding;
						var dy=loc1.top-loc2.top-1-padding;
						var message=$(yoodoo.e("section")).addClass('promptMessage').html($('.promptMessage').html());
						$('.dooitDisplay').append(message);
						message.css({
							position:'absolute',
							'z-index':999,
							left:dx,
							top:dy,
							opacity:0,
							width:$('.promptMessage').width()+(2*padding)
						}).transition({
							opacity:1,
							top:110-$('.promptMessage').height()-3-(2*padding)
						},500);
						clearTimeout(this.record.autoopentext);
						this.recordWindow = $(yoodoo.e("div")).addClass("recordWindow");
						this.editor = $(yoodoo.e("div")).addClass("responseEditor").append(
							$(yoodoo.e("div")).append(
								$(yoodoo.e("button")).attr("type", "button").append(
									yoodoo.icons.get('add', 12, 12, {
										'4D4D4D': 'FFFFFF'
									})
								).addClass("addButton").click(function() {
									me.add();
								})
							).append($(yoodoo.e("div")).addClass('losenge').append(
								$(yoodoo.e("button")).attr("type", "button").html("back").addClass("backButton").click(function() {
									message.transition({top:0,opacity:0},500,function() {
										$(this).remove();
									});
									me.close();
								}).prepend(kloe_response.icon(kloe_response.icons.left, 20, 20, 100, 100, {
									'4D4D4D': 'FFFFFF'
								}))
							).append(
								$(yoodoo.e("h3")).html("Your evidence")
							)).append(this.recordWindow)
						).css({
							height: '0%'
						}).click(function(e) {
							if (e.target === this) {
									message.transition({top:0,opacity:0},500,function() {
										$(this).remove();
									});
								me.close();
							}
						});
						this.recordWindow.append(this.record.responseReminder());
						for (var r in this.records) this.recordWindow.append(this.recordRow(this.records[r]));
						if (this.record.item !== null) {
							this.record.item.context.containers.record.append(this.editor);
							this.editor.animate({
								height: '100%'
							});
						} else {
							this.editor.css({
								width: yoodoo.option.width - 100,
								height: yoodoo.option.height - 100
							}).insertAfter(this.record.scrollArea.hide());
						}
					},
					add: function() {
						var newRecord = this.object.add();
						newRecord.setValue(this.filterkey, this.record.object);
						this.record.evidence.attach(newRecord);
						this.recordWindow.append(this.recordRow(newRecord, true));
						this.update();
					},
					close: function() {
						this.editor.remove();
						this.record.scrollArea.show();
					},
					recordRow: function(record, straightToEdit) {
						var rec = record;
						var me = this;
						var disabled = (rec.templater!==true && rec.inheritedEvidence !== undefined && rec.inheritedEvidence.value[kloe_response.evidenceParameters.LockedWhenInherited] === true);
						var buildForm=function() {
							var columns = $(yoodoo.e("div")).addClass("columns2");
							// evidence
							var complexData = rec.value[kloe_response.evidenceParameters.Data];
							if (complexData === null || typeof(complexData) != "object") {
								rec.value[kloe_response.evidenceParameters.Data] = {};
								complexData = rec.value[kloe_response.evidenceParameters.Data];
							}
							var label = 'Untitled';
							if (this.prompt.value[kloe_response.promptParameters.Presentation] !== null && this.prompt.value[kloe_response.promptParameters.Presentation][kloe_response.promptPresentionParameters.Document] !== undefined) label = this.prompt.value[kloe_response.promptParameters.Presentation][kloe_response.promptPresentionParameters.Document];
							if (label.replace(/ /g,'')=="") label="Untitled";
							if (disabled) {
								columns.append($(yoodoo.e("div")).addClass("yoodooUI").append(
									$(yoodoo.e("label")).html(label)
								).append(
									$(yoodoo.e("div")).addClass('disabledTextarea').html(complexData[kloe_response.evidenceData.WhatIsYourEvidence])
								));
							} else {
								columns.append(new yoodoo.ui.textarea({
									label: label,
									maxlength: 0,
									disabled: disabled,
									rows: 3,
									onchange: function() {
										complexData[kloe_response.evidenceData.WhatIsYourEvidence] = this.value;
										rec.setValue(kloe_response.evidenceParameters.WhatIsYourEvidence, this.value.substring(0, 254));
									}
								}).render(complexData[kloe_response.evidenceData.WhatIsYourEvidence]));
							}
							// evidence where
							var label = 'Untitled';
							if (this.prompt.value[kloe_response.promptParameters.Presentation] !== null && this.prompt.value[kloe_response.promptParameters.Presentation][kloe_response.promptPresentionParameters.DocumentType] !== undefined) label = this.prompt.value[kloe_response.promptParameters.Presentation][kloe_response.promptPresentionParameters.DocumentType];
							if (disabled) {
								columns.append($(yoodoo.e("div")).addClass("yoodooUI").append(
									$(yoodoo.e("label")).html(label)
								).append(
									$(yoodoo.e("div")).addClass('disabledTextarea').html(complexData[kloe_response.evidenceData.WhereIsYourEvidence])
								));
							} else {
								columns.append(new yoodoo.ui.textarea({
									label: label,
									maxlength: 0,
									disabled: disabled,
									rows: 3,
									onchange: function() {
										complexData[kloe_response.evidenceData.WhereIsYourEvidence] = this.value;
									}
								}).render(complexData[kloe_response.evidenceData.WhereIsYourEvidence]));
							}
							// file
							var docLink = {
								record: rec,
								complexData: complexData,
								recordKey: kloe_response.evidenceParameters.Data,
								container: $(yoodoo.e("div")).addClass("yoodooUI"),
								link: $(yoodoo.e("span")),
								update: function(file) {
									var obj = this.complexData;
									if (obj === undefined) obj = {};
									if (file !== undefined) {
										console.log(obj);
										obj[kloe_response.evidenceData.Bytes]=file.bytes;
										obj[kloe_response.evidenceData.Icon]=file.icon;
										obj[kloe_response.evidenceData.Link]=file.link;
										obj[kloe_response.evidenceData.Name]=file.name;
										this.complexData = obj;
									}
									/*for(var k in obj) {
										
									}
									var keys = {};
									if (this.record.object.parameters[this.recordKey].json_schema instanceof Array) {
										for (var i in this.record.object.parameters[this.recordKey].json_schema) {
											keys[this.record.object.parameters[this.recordKey].json_schema[i].title.en.toLowerCase()] = this.record.object.parameters[this.recordKey].json_schema[i].key;
										}
									}
									for (var k in keys) {
										if (obj[keys[k]] === undefined) obj[keys[k]] = '';
									}
									if (file !== undefined) {
										for (var k in file) {
											if (keys[k.toLowerCase()] !== undefined) obj[keys[k.toLowerCase()]] = file[k];
										}
									}
									this.complexData = obj;*/
									if (obj[kloe_response.evidenceData.Link] != '') {
										this.link.empty().append(
											$(yoodoo.e("a")).html(obj[kloe_response.evidenceData.Name] + ' (' + kloe_response.byteSize(obj[kloe_response.evidenceData.Bytes]) + ')').attr("href", obj[kloe_response.evidenceData.Link]).attr("target", "_blank")
										);
									} else {
										this.link.html('No file of evidence.');
									}
								}
							};
							if (disabled !== true) {
								kloe_response.dropbox.button(function(but) {
									docLink.container.append(docLink.link).append(but);
								}, {
									success: function(file) {
										console.log(file);
										docLink.update(file[0]);
									}
								});
							} else {
								docLink.container.append(docLink.link)
							}
							columns.append(docLink.container);
							docLink.update();
							var form = $(yoodoo.e("div")).addClass("recordWindow").append(columns);
							if (yoodoo.user.managerType !== undefined && yoodoo.user.managerType.subManagers instanceof Array && yoodoo.user.managerType.subManagers.length > 0) {
								columns = $(yoodoo.e("div")).addClass("columns2");
								var div = $(yoodoo.e("div"));
								var lockinherit = new yoodoo.ui.checkbox({
									label: 'Lock the data',
									onchange: function() {
										rec.value[kloe_response.evidenceParameters.LockedWhenInherited] = this.value;
									}
								});
								var lockdiv = lockinherit.render(rec.value[kloe_response.evidenceParameters.LockedWhenInherited] === true);
								rec.value[kloe_response.evidenceParameters.AllowInheritance] = true;
								var subManagers = []
								for (var s in yoodoo.user.managerType.subManagers) subManagers.push(yoodoo.user.managerType.subManagers[s].name);
								var last = subManagers.pop();
								var subManagerString = ((subManagers.length > 0) ? (subManagers.join(',') + ' and ') : '') + last;
								columns.append($(yoodoo.e("div")).html("This response is  a template for users in " + subManagerString));
								columns.append(lockdiv);
								form.append(columns);
							}
							return form;
						};
						var but = $(yoodoo.e("button"));
						var clickBut = function() {
							var apWindow = $(yoodoo.e("div")).css({
								width: yoodoo.option.width - 120,
								//height:yoodoo.option.height-80,
								'max-height': yoodoo.option.height - 120,
								'overflow-y': 'auto'
							});
							var editorForm = new yoodoo.ui.dialog({
								html: apWindow,
								blockoutClickClose: true,
								closeButton: true,
								closedCallback: function() {
									$(but).find("span").html(rec.displayName());
								},
								className: 'kloe_response_dialog'
							});
							apWindow.append(
								$(yoodoo.e("div")).addClass("losenge").append(
									$(yoodoo.e("button")).attr("type", "button").addClass('backButton withCTA').html('back').prepend(
										kloe_response.icon(kloe_response.icons.left, 20, 20, 100, 100, {
											'4D4D4D': 'FFFFFF'
										})
									).click(function() {
										editorForm.close();
									})
								).append(
									$(yoodoo.e("h3")).html("Evidence" + (disabled ? ' [reference only]' : ''))
								)
							).append(
								buildForm.apply(me,[])
							);
							editorForm.render();
							yoodoo.ui.update();
						};
						but.attr("type", "button").append($(yoodoo.e("span")).html(rec.displayName())).click(function(e) {
							if (e.target.tagName=="BUTTON" && e.target!==this) {

							}else{
								clickBut();
							}
						}).prepend(
							$(yoodoo.e("button")).attr("type", "button").append(
								yoodoo.icons.get('close', 12, 12, {
									'4D4D4D': 'FFFFFF'
								})
							).addClass("delButton").click(function(e) {
								e.preventDefault();
								if (me.remove(rec)) {
									$(this).parent().unbind("click").slideUp(500, function() {
										$(this).remove();
									});
									//rec.erase();
								}
							})
						);
						if (straightToEdit === true) setTimeout(function() {
							clickBut();
						}, 500);
						return but;
					},
					remove: function(record) {
						var reply=false;
						if (!(record.Id > 0) || window.confirm("Delete '" + record.displayName() + "'?")) {
							reply=this.record.evidence.erase(record);
							this.update();
							
						}
						return reply;
					}
				};
			}
			columns.append(this.evidenceDisplay.container);
			this.evidenceDisplay.init();
			if (this.actionplansDisplay !== undefined) {
				this.actionplansDisplay.update()
			} else {
				this.actionplansDisplay = {
					container: $(yoodoo.e("div")).addClass("actionPlanSummary"+((me.templater===true)?' requireActionPlan':'')).addClass("yoodooUI"),
					record: me,
					prompt: me.prompt,
					object: yoodoo.object.objectNames[kloe_response.objectName.actionPlans],
					filterkey: yoodoo.object.objectNames[kloe_response.objectName.actionPlans].getParameterReferingToObjectId(me.object.object.schema.Id),
					records: null,
					init: function() {
						this.update();
					},
					update: function() {
						var me = this;
						this.records=this.record.actionPlans.records;
						this.record.object.setValue(kloe_response.parameters.ActionPlanCount, this.records.length);
						this.container.removeClass("loading").empty().append(
							$(yoodoo.e("button")).attr("type", "button").html('action plan' + ((this.records.length == 1) ? '' : 's')).prepend(
								$(yoodoo.e("div")).html(this.records.length).append(
									kloe_response.icon(kloe_response.icons.walking, 25, 25, 100, 100, {
										'4D4D4D': (this.records.length > 0) ? kloe_response.colours.cyan : 'dddddd'
									})
								)
							).unbind("click").click(function() {
								me.open();
							})
						);
					},
					editor: null,
					recordWindow: null,
					open: function() {
						var loc1=$('.promptMessage').offset();
						var loc2=$('.dooitDisplay').offset();
						var padding=3;
						var dx=loc2.left-loc1.left-1-padding;
						var dy=loc1.top-loc2.top-1-padding;
						var message=$(yoodoo.e("section")).addClass('promptMessage').html($('.promptMessage').html());
						$('.dooitDisplay').append(message);
						message.css({
							position:'absolute',
							'z-index':999,
							left:dx,
							top:dy,
							opacity:0,
							width:$('.promptMessage').width()+(2*padding)
						}).transition({
							opacity:1,
							top:110-$('.promptMessage').height()-3-(2*padding)
						},500);
						var me = this;
						clearTimeout(this.record.autoopentext);
						this.recordWindow = $(yoodoo.e("div")).addClass("recordWindow");
						this.editor = $(yoodoo.e("div")).addClass("responseEditor").append(
							$(yoodoo.e("div")).append(
								$(yoodoo.e("button")).attr("type", "button").append(
									yoodoo.icons.get('add', 12, 12, {
										'4D4D4D': 'FFFFFF'
									})
								).addClass("addButton").click(function() {
									me.add();
								})
							).append($(yoodoo.e("div")).addClass('losenge').append(
								$(yoodoo.e("button")).attr("type", "button").html("back").addClass("backButton").click(function() {
									message.transition({top:0,opacity:0},500,function() {
										$(this).remove();
									});
									me.close();
								}).prepend(kloe_response.icon(kloe_response.icons.left, 20, 20, 100, 100, {
									'4D4D4D': 'FFFFFF'
								}))
							).append(
								$(yoodoo.e("h3")).html("Your action plans")
							)).append(this.recordWindow)
						).css({
							height: '0%'
						}).click(function(e) {
							if (e.target === this) {
									message.transition({top:0,opacity:0},500,function() {
										$(this).remove();
									});
								me.close();
							}
						});
						this.recordWindow.append(this.record.responseReminder());
						for (var r in this.records) this.recordWindow.append(this.recordRow(this.records[r], false));
						if (this.record.item !== null) {
							this.record.item.context.containers.record.append(this.editor);
							this.editor.animate({
								height: '100%'
							});
						} else {
							this.editor.css({
								height: yoodoo.option.height - 100,
								width: yoodoo.option.width - 100
							}).insertAfter(this.record.scrollArea.hide());
						}
					},
					add: function() {
						var newRecord = this.object.add();
						newRecord.setValue(this.filterkey, this.record.object);
						this.record.actionPlans.attach(newRecord);
						this.recordWindow.append(this.recordRow(newRecord, true));
						this.update();
					},
					close: function() {
						this.editor.remove();
						this.record.scrollArea.show();
					},
					recordRow: function(record, straightToEdit) {
						var rec = record;
						var me = this;
						var disabled = (rec.templater!==true && rec.inheritedActionPlan !== undefined && rec.inheritedActionPlan.value[kloe_response.actionPlanParameters.LockedWhenInherited] === true);
						var buildForm=function() {
							var complexData = rec.value[kloe_response.actionPlanParameters.Data];
							if (complexData === null || typeof(complexData) != "object") {
								rec.value[kloe_response.actionPlanParameters.Data] = {};
								complexData = rec.value[kloe_response.actionPlanParameters.Data];
							}
							var form = $(yoodoo.e("div"));
							var columns = $(yoodoo.e("div")).addClass("columns2");
							// not met
							var label = 'Untitled';
							if (this.prompt.value[kloe_response.promptParameters.Presentation] !== null && this.prompt.value[kloe_response.promptParameters.Presentation][kloe_response.promptPresentionParameters.NotMet] !== undefined) label = this.prompt.value[kloe_response.promptParameters.Presentation][kloe_response.promptPresentionParameters.NotMet];
							if (label.replace(/ /g,'')=="") label="Untitled";
							if (disabled) {
								columns.append($(yoodoo.e("div")).addClass("yoodooUI").append(
									$(yoodoo.e("label")).html(label)
								).append(
									$(yoodoo.e("div")).addClass('disabledTextarea').html(complexData[kloe_response.actionPlanData.HowIsThisNotMet])
								));
							} else {
								columns.append(new yoodoo.ui.textarea({
									label: label,
									rows: 3,
									onchange: function() {
										complexData[kloe_response.actionPlanData.HowIsThisNotMet] = this.value;
										rec.setValue(kloe_response.actionPlanParameters.HowIsThisNotMet, this.value.substring(0, 254));
									},
									maxLength: 0
								}).render(complexData[kloe_response.actionPlanData.HowIsThisNotMet]));
							}
							// plan of action
							var label = 'Untitled';
							if (this.prompt.value[kloe_response.promptParameters.Presentation] !== null && this.prompt.value[kloe_response.promptParameters.Presentation][kloe_response.promptPresentionParameters.ActionPlan] !== undefined) label = this.prompt.value[kloe_response.promptParameters.Presentation][kloe_response.promptPresentionParameters.ActionPlan];
							if (disabled) {
								columns.append($(yoodoo.e("div")).addClass("yoodooUI").append(
									$(yoodoo.e("label")).html(label)
								).append(
									$(yoodoo.e("div")).addClass('disabledTextarea').html(complexData[kloe_response.actionPlanData.WhatIsThePlanForAction])
								));
							} else {
								columns.append(new yoodoo.ui.textarea({
									label: label,
									rows: 3,
									onchange: function() {
										complexData[kloe_response.actionPlanData.WhatIsThePlanForAction] = this.value;
									},
									maxLength: 0
								}).render(complexData[kloe_response.actionPlanData.WhatIsThePlanForAction]));
							}
							form.append(columns);
							var columns = $(yoodoo.e("div")).addClass("columns2");
							// measures to ensure
							var label = 'Untitled';
							if (this.prompt.value[kloe_response.promptParameters.Presentation] !== null && this.prompt.value[kloe_response.promptParameters.Presentation][kloe_response.promptPresentionParameters.Measures] !== undefined) label = this.prompt.value[kloe_response.promptParameters.Presentation][kloe_response.promptPresentionParameters.Measures];
							if (disabled) {
								columns.append($(yoodoo.e("div")).addClass("yoodooUI").append(
									$(yoodoo.e("label")).html(label)
								).append(
									$(yoodoo.e("div")).addClass('disabledTextarea').html(complexData[kloe_response.actionPlanData.EnsureImprovements])
								));
							} else {
								columns.append(new yoodoo.ui.textarea({
									label: label,
									rows: 3,
									onchange: function() {
										complexData[kloe_response.actionPlanData.EnsureImprovements] = this.value;
									},
									maxLength: 0
								}).render(complexData[kloe_response.actionPlanData.EnsureImprovements]));
							}
							var label = 'Untitled';
							if (this.prompt.value[kloe_response.promptParameters.Presentation] !== null && this.prompt.value[kloe_response.promptParameters.Presentation][kloe_response.promptPresentionParameters.Resources] !== undefined) label = this.prompt.value[kloe_response.promptParameters.Presentation][kloe_response.promptPresentionParameters.Resources];
							// resources
							if (disabled) {
								columns.append($(yoodoo.e("div")).addClass("yoodooUI").append(
									$(yoodoo.e("label")).html(label)
								).append(
									$(yoodoo.e("div")).addClass('disabledTextarea').html(complexData[kloe_response.actionPlanData.WhatResources])
								));
							} else {
								columns.append(new yoodoo.ui.textarea({
									label: label,
									rows: 3,
									onchange: function() {
										complexData[kloe_response.actionPlanData.WhatResources] = this.value;
									},
									maxLength: 0
								}).render(complexData[kloe_response.actionPlanData.WhatResources]));
							}
							form.append(columns);
							var columns = $(yoodoo.e("div")).addClass("columns2");
							// affects users
							var label = 'Untitled';
							if (this.prompt.value[kloe_response.promptParameters.Presentation] !== null && this.prompt.value[kloe_response.promptParameters.Presentation][kloe_response.promptPresentionParameters.Affected] !== undefined) label = this.prompt.value[kloe_response.promptParameters.Presentation][kloe_response.promptPresentionParameters.Affected];
							if (disabled) {
								columns.append($(yoodoo.e("div")).addClass("yoodooUI").append(
									$(yoodoo.e("label")).html(label)
								).append(
									$(yoodoo.e("div")).addClass('disabledTextarea').html(complexData[kloe_response.actionPlanData.AffectServiceUsers])
								));
							} else {
								columns.append(new yoodoo.ui.textarea({
									label: label,
									rows: 3,
									onchange: function() {
										complexData[kloe_response.actionPlanData.AffectServiceUsers] = this.value;
									},
									maxLength: 512
								}).render(complexData[kloe_response.actionPlanData.AffectServiceUsers]));
							}
							var box = $(yoodoo.e("div"));
							// responsible
							var label = 'Untitled';
							if (this.prompt.value[kloe_response.promptParameters.Presentation] !== null && this.prompt.value[kloe_response.promptParameters.Presentation][kloe_response.promptPresentionParameters.Responsible] !== undefined) label = this.prompt.value[kloe_response.promptParameters.Presentation][kloe_response.promptPresentionParameters.Responsible];
							var val = yoodoo.object.objectNames[kloe_response.objectName.responsibility].recordsCache[rec.value[kloe_response.actionPlanParameters.Responsible]];
							if (typeof(rec.value[kloe_response.actionPlanParameters.Responsible])=="string") val=rec.value[kloe_response.actionPlanParameters.Responsible];
							if (typeof(val) == "undefined") {
								val = '';
							} else if (typeof(val)=="string") {
								
							} else {
								val = val.displayName();
							}
							var ip = yoodoo.object.objectNames[kloe_response.objectName.responsibility].searchBox(function(ele) {
								if (ele.record !== undefined) {
									rec.value[kloe_response.actionPlanParameters.Responsible] = ele.record;
								}
							}, {
								onchange: function() {
									rec.value[kloe_response.actionPlanParameters.Responsible] = this.value;
								}
							}).val(val);
							box.append(
								$(yoodoo.e("div")).append(
									$(yoodoo.e("label")).html(label)
								).append(ip)
							);
							// responsible manager
							var label = 'Untitled';
							if (this.prompt.value[kloe_response.promptParameters.Presentation] !== null && this.prompt.value[kloe_response.promptParameters.Presentation][kloe_response.promptPresentionParameters.Manager] !== undefined) label = this.prompt.value[kloe_response.promptParameters.Presentation][kloe_response.promptPresentionParameters.Manager];
							var val = yoodoo.object.objectNames[kloe_response.objectName.responsibility].recordsCache[rec.value[kloe_response.actionPlanParameters.ManagementResponsibility]];
							if (typeof(rec.value[kloe_response.actionPlanParameters.Responsible])=="string") val=rec.value[kloe_response.actionPlanParameters.Responsible];
							if (typeof(val) == "undefined") {
								val = '';
							} else if (typeof(val)=="string") {
								
							}else{
								val = val.displayName();
							}
							var ip = yoodoo.object.objectNames[kloe_response.objectName.responsibility].searchBox(function(ele) {
								if (ele.record !== undefined) {
									rec.value[kloe_response.actionPlanParameters.ManagementResponsibility] = ele.record;
								}
							}, {
								onchange: function() {
									rec.value[kloe_response.actionPlanParameters.ManagementResponsibility] = this.value;
								}
							}).val(val);
							box.append(
								$(yoodoo.e("div")).append(
									$(yoodoo.e("label")).html(label)
								).append(ip)
							);
							columns.append(box);
							form.append(columns);
							if (rec.inheritedResponse === undefined && yoodoo.user.managerType !== undefined && yoodoo.user.managerType.subManagers instanceof Array && yoodoo.user.managerType.subManagers.length > 0) {
								columns = $(yoodoo.e("div")).addClass("columns2");
								var div = $(yoodoo.e("div"));
								rec.value[kloe_response.parameters.AllowInheritance] = true;
								var lockinherit = new yoodoo.ui.checkbox({
									label: 'Lock the data',
									onchange: function() {
										rec.value[kloe_response.actionPlanParameters.LockedWhenInherited] = this.value;
									}
								});
								var lockdiv = lockinherit.render(rec.value[kloe_response.actionPlanParameters.LockedWhenInherited] === true);
								var subManagers = []
								for (var s in yoodoo.user.managerType.subManagers) subManagers.push(yoodoo.user.managerType.subManagers[s].name);
								var last = subManagers.pop();
								var subManagerString = ((subManagers.length > 0) ? (subManagers.join(',') + ' and ') : '') + last;
								columns.append($(yoodoo.e("div")).html("This response is  a template for users in " + subManagerString));
								columns.append(lockdiv);
								form.append(columns);
							}
							return form;
						};
						var but = $(yoodoo.e("button"));
						var clickBut = function() {
							var apWindow = $(yoodoo.e("div")).css({
								width: yoodoo.option.width - 120,
								//height:yoodoo.option.height-80,
								'max-height': yoodoo.option.height - 120,
								'overflow-y': 'auto'
							});
							var editorForm = new yoodoo.ui.dialog({
								html: apWindow,
								blockoutClickClose: true,
								closeButton: true,
								closedCallback: function() {
									$(but).find("span").html(rec.displayName());
								},
								className: 'kloe_response_dialog'
							});
							apWindow.append(
								$(yoodoo.e("div")).addClass("losenge").append(
									$(yoodoo.e("button")).attr("type", "button").addClass('backButton withCTA').html('back').prepend(
										kloe_response.icon(kloe_response.icons.left, 20, 20, 100, 100, {
											'4D4D4D': 'FFFFFF'
										})
									).click(function() {
										editorForm.close();
									})
								).append(
									$(yoodoo.e("h3")).html("Action plan" + (disabled ? ' [limited]' : ''))
								)
							).append(
								$(yoodoo.e("div")).addClass("recordWindow").append(
									buildForm.apply(me,[])
								)
							);
							editorForm.render();
							yoodoo.ui.update();
						};
						but.attr("type", "button").append($(yoodoo.e("span")).html(rec.displayName())).click(function() {
							clickBut();
						}).prepend(
							$(yoodoo.e("button")).attr("type", "button").append(
								yoodoo.icons.get('close', 12, 12, {
									'4D4D4D': 'FFFFFF'
								})
							).addClass("delButton").click(function(e) {
								e.preventDefault();
								if (me.remove(rec)) {
									$(this).parent().unbind("click").slideUp(500, function() {
										$(this).remove();
									});
									//rec.erase();
								}
							})
						);
						if (straightToEdit === true) setTimeout(function() {
							clickBut();
						}, 500);
						return but;
					},
					remove: function(record) {
						var reply=false;
						if (!(record.Id > 0) || window.confirm("Delete '" + record.displayName() + "'?")) {
							reply=this.record.actionPlans.erase(record);
							this.update();
							
						}
						return reply;
					}
				};
			}
			columns.append(this.actionplansDisplay.container);
			this.actionplansDisplay.init();
			form.append(columns);
			columns = $(yoodoo.e("div")).addClass("columns2");
			this.object.value[kloe_response.parameters.AllowInheritance] = this.templater;
			if (this.templater !== true) {
				var pir = new yoodoo.ui.checkbox({
					label: 'Reserve for PIR',
					onchange: function() {
						me.object.value[kloe_response.parameters.ReserveForPIR] = this.value;
					}
				});
				columns.append(pir.render(this.object.value[kloe_response.parameters.ReserveForPIR] === true)).append($(yoodoo.e("div")));
			} else {
				var div = $(yoodoo.e("div"));
				
				var actinherit = new yoodoo.ui.checkbox({
					label: 'Active template',
					onchange: function() {
						me.object.value[kloe_response.parameters.ActiveInheritance] = this.value;
					}
				});
				var actdiv = actinherit.render(this.object.value[kloe_response.parameters.ActiveInheritance] === true);
				
				var optinherit = new yoodoo.ui.checkbox({
					label: 'Optional template',
					onchange: function() {
						me.object.value[kloe_response.parameters.OptionalInheritance] = this.value;
					}
				});
				var optdiv = optinherit.render(this.object.value[kloe_response.parameters.OptionalInheritance] === true);
				var lockinherit = new yoodoo.ui.checkbox({
					label: 'Lock the data',
					onchange: function() {
						me.object.value[kloe_response.parameters.LockedWhenInherited] = this.value;
					}
				});
				var lockdiv = lockinherit.render(this.object.value[kloe_response.parameters.LockedWhenInherited] === true);
				var subManagers = []
				for (var s in yoodoo.user.managerType.subManagers) subManagers.push(yoodoo.user.managerType.subManagers[s].name);
				var last = subManagers.pop();
				var subManagerString = ((subManagers.length > 0) ? (subManagers.join(',') + ' and ') : '') + last;
				columns.append($(yoodoo.e("div")).html("This response is  a template for users in " + subManagerString).append(actdiv));
				columns.append(
					$(yoodoo.e("div")).append(
						optdiv
					).append(
						lockdiv
					)
				);
			}
			form.append(columns);
			if (this.templater) {
				var ts = this.object.tagSelector();
				if (ts !== null) {
					var columns = $(yoodoo.e("div")).addClass("columnLike");
					columns.append(
						$(yoodoo.e("label")).html("Which characteristic must a person have to see this? (only one needs to match)")
					).append(this.object.tagSelector());
					form.append(columns);
				}
			}
			var me = this;
			this.scrollArea.append(form);
			if (this.item !== null) {
				this.item.context.containers.record.empty().append(
					$(yoodoo.e("div")).append(
						$(yoodoo.e("h3")).html('Response').append(
							$(yoodoo.e("button")).attr("type", "button").html("i").click(function() {
								me.item.context.help(me.item.help, me.item.helpVoice);
							}).addClass('info')
						)
					).prepend(back).css({
						position: 'absolute',
						height: 50,
						top: 0,
						width: '100%'
					}).prepend(confirm).prepend(del)
				).append(
					$(yoodoo.e("div")).css({
						'box-sizing': 'border-box',
						padding: '50px 0px 0px 0px',
						height: '100%'
					}).append(this.scrollArea.css({
						height: '100%'
					}))
				).append(
					this.emptyButton
				).css({
					position: 'relative'
				});
			}else{
				form.prepend(confirm).prepend(del);
			}
			yoodoo.ui.update();
			this.scrollArea.find('.actionPlan').each(function(i, e) {
				e.disable(me.status != 'needsattention');
			});
			if (this.item !== null) {
				this.item.context.showRecord(true);
				yoodoo.ui.update();
				this.autoopentext=setTimeout(function() {
					$('.showRecord>div').last().find('textarea,input[type=text]').first().focus();
				},2000);
			} else {
				var me=this;
				this.scrollArea.css({
					width: yoodoo.option.width - 100,
					height: yoodoo.option.height - 100
				});
				this.dialog = new yoodoo.ui.dialog({
					html: this.scrollArea,
					blockoutClickClose: true,
					closeButton: true,
					className: 'kloe_response_dialog'
				});
				this.scrollArea.prepend(
					$(yoodoo.e("div")).addClass("losenge").append(
						$(yoodoo.e("button")).attr("type", "button").addClass('backButton').html('back').prepend(
							kloe_response.icon(kloe_response.icons.left, 20, 20, 100, 100, {
								'4D4D4D': 'FFFFFF'
							})
						).click(function() {
							me.dialog.close();
						})
					).append(
						$(yoodoo.e("h3")).html('A response')
					)
				);
				this.dialog.render();
				yoodoo.ui.update();
				setTimeout(function() {
					me.scrollArea.find('textarea,input[type=text]').first().focus();
				},2000);
			}
		};
	},
	help: function(text, sound) {
		var helpMessage = $(yoodoo.e("div")).html(text);
		var blockout = $(yoodoo.e("div")).addClass("blockout").click(function() {
			if (e.target.tagName != "A") {
				yoodoo.stopSound();
				$(this).fadeOut(300, function() {
					$(this).remove();
				});
			}
		}).append(helpMessage).prepend(
			$(yoodoo.e("h2")).html("Expert insight")
		);
		$(yoodoo.widget).append($(blockout).hide().fadeIn());
		if (typeof(sound) == "string" && sound.length > 0) yoodoo.playSound(yoodoo.replaceDomain('domain:uploads/sitespecific/yoodoo.siteFolder/' + sound));
	},
	statusBox: function() {
		var sel = $(yoodoo.e("select"));
		sel.append($(yoodoo.e("option")).attr("value", '').html('Select a status').css({
			display: 'none'
		}));
		if (this.upgraded) {
			for (var k in yoodoo.kloeStatus.object.records) {
				var rec = yoodoo.kloeStatus.object.records[k];
				sel.append($(yoodoo.e("option")).attr("value", rec.Id).html(rec.displayName()).css({
					color: rec.getValue('Colour')
				}));
			}
		} else {
			for (var k in this.statuses) {
				sel.append($(yoodoo.e("option")).attr("value", k).html(this.statuses[k].title).css({
					color: (this.statuses[k].colour.match(/^\#/) ? '' : '#') + this.statuses[k].colour
				}));
			}
		}
		return sel;
	},
	displayed: function() {
		// called when the dooit is fully revealed
	},
	loadFields: function() {
		if (this.configkey === null) {
			if (array_of_global_fields.length > 0) {
				this.configkey = array_of_global_fields[0];
			}
		}
		if (this.voiceoverkey === null) {
			for (var k in array_of_fields) {
				if (k != this.configkey) {
					if (k.match(/_voiceover_record$/i)) {
						this.voiceoverkey = k;
					}
				}
			}
		}
		if (this.summarykey === null) {
			for (var k in array_of_fields) {
				if (k != this.configkey && k != this.voiceoverkey) {
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
			} catch (e) {
				this.schema = Base64.decode(array_of_fields[this.configkey][1]);
			}
			this.schema = dooit.decode(this.schema);
		}
		if (this.key !== null) {
			try {
				eval('this.value=' + array_of_fields[this.key][1] + ';');
			} catch (e) {
				this.value = array_of_fields[this.key][1];
			}
		}
		if (this.voiceoverkey !== null) {
			try {
				eval('this.voiceoverrecord=' + array_of_fields[this.voiceoverkey][1] + ';');
			} catch (e) {
				this.voiceoverrecord = array_of_fields[this.voiceoverkey][1];
			}
		}
		if (this.summarykey !== null) {
			try {
				eval('this.summary=' + array_of_fields[this.summarykey][1] + ';');
			} catch (e) {
				this.summary = array_of_fields[this.summarykey][1];
			}
		}
		for (var k in array_of_fields) {
			if (k != this.key && k != this.summarykey) {
				try {
					eval('this.fields["' + k + '"]=' + array_of_fields[k][1] + ';');
				} catch (e) {
					this.fields[k] = array_of_fields[this.key][1];
				}
			}
		}
		this.value = dooit.decode(this.value);
		this.fields = dooit.decode(this.fields);
	},
	transposeOptions: function(keys, obj) {
		for (var k in obj) {
			if (typeof(obj[k]) == "object") {
				var thiskeys = keys.slice();
				thiskeys.push(k);
				this.transposeOptions(thiskeys, obj[k]);
			} else {
				this.setOption(keys, k, obj[k]);
			}
		}
	},
	setOption: function(keys, key, val) {
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
		} catch (e) {}
	},
	finishable: function() {
		var ok = true;
		return ok;
	},
	getvalue: function() {
		var v = {};
		v.title = yoodoo.dooittitle;
		v.structure = [];
		if (this.value.archived !== undefined) {
			v.archived = this.value.archived;
		} else if (this.upgraded) {
			v.archived = {};
			for (var s in this.schema.sections) {
				for (var k in this.schema.sections[s].items) {
					var prompt = this.schema.sections[s].items[k];
					if (this.value[prompt.id] instanceof Array && this.value[prompt.id].length > 0) {
						v.archived[prompt.id] = this.value[prompt.id];
					}
				}
			}
		} else if (!this.upgraded) {
			for (var s in this.schema.sections) {
				var section = {
					name: this.schema.sections[s].title,
					description: this.schema.sections[s].shortDescription,
					prompts: []
				};
				for (var k in this.schema.sections[s].items) {
					var prompt = this.schema.sections[s].items[k];
					section.prompts.push({
						id: prompt.id,
						title: prompt.title,
						action: prompt.actionplanPlaceholder,
						affected: prompt.affectedPlaceholder,
						description: prompt.description,
						evidence: prompt.docPlaceholder,
						evidenceType: prompt.docTypePlaceholder,
						deadline: prompt.expiresPlaceholder,
						file: prompt.filePlaceholder,
						responsible: prompt.responsiblePlaceholder,
						manager: prompt.managePlaceholder,
						measures: prompt.measuresPlaceholder,
						notmet: prompt.notMetPlaceholder,
						sources: prompt.sourcesPlaceholder,
						how: prompt.textPlaceholder,
						expiryWarning: this.schema.expiryWarningDays,
						suggestedCount: prompt.suggestedRecordsCount
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
	getsummary: function() {
		var v = {
			warnings: this.fullWarnings(),
			compliance: 0,
			records: [],
			upgraded: this.upgraded,
			warning: null, // time to show a warning
			expired: null // time to show as expired
		};
		var score = 0;
		var total = 0;
		var warningDate = new Date();
		warningDate.setDate(warningDate.getDate() + this.schema.expiryWarningDays);
		warningDate = warningDate.getTime();
		for (var s in this.schema.sections) {
			score += this.schema.sections[s].score();
			total++;
			var section = [];
			for (var k in this.schema.sections[s].items) {
				var item = {
					suggested: this.schema.sections[s].items[k].suggestedRecordsCount,
					records: []
				};
				for (var r = 0; r < this.schema.sections[s].items[k].records.length; r++) {
					//score += this.schema.sections[s].items[k].records[r].score();
					var record = this.schema.sections[s].items[k].records[r];
					var thiswarningDate = null;
					var thisexpiresDate = null;
					thiswarningDate = new Date(record.expires.getTime());
					thisexpiresDate = thiswarningDate.getTime();
					thiswarningDate.setDate(thiswarningDate.getDate() - this.schema.expiryWarningDays);
					thiswarningDate = thiswarningDate.getTime();
					if (record.status == 'complete') {
						if (thiswarningDate !== null && (v.warning === null || v.warning > thiswarningDate)) v.warning = thiswarningDate;
						if (thisexpiresDate !== null && (v.expired === null || v.expired > thisexpiresDate)) v.expired = thisexpiresDate;
					}
					//total++;
					if (record.text != "") item.records.push({
						status: record.status,
						action: (record.action != ""),
						warning: new Date(record.expires.getFullYear(), record.expires.getMonth(), record.expires.getDate() - this.schema.expiryWarningDays),
						expires: new Date(record.expires.getTime())
					});
				}
				section.push(item);
			}
			if (!this.upgraded) v.records.push(section);
		}
		v.warning = (v.warning === null) ? '' : yoodoo.formatDate('d/m/Y', new Date(v.warning));
		v.expired = (v.expired === null) ? '' : yoodoo.formatDate('d/m/Y', new Date(v.expired));
		if (total > 0) v.compliance = Math.round(score / total);
		return v;
	},
	output: function() {
		var summary = this.getsummary();
		var op = dooit.json(this.getvalue());
		array_of_fields[this.key][1] = op;
		var reply = {};
		eval('reply.EF' + array_of_fields[this.key][0] + '=op;');
		if (typeof(dooitInformation.dooitMeta.outcome) == "object") {
			for (var k in dooitInformation.dooitMeta.outcome) {
				if (typeof(k) == "string" && k.match(/expires$/)) {
					yoodoo.set_meta(k, summary.expired.toString());
				} else if (typeof(k) == "string" && k.match(/^kloe/)) {
					yoodoo.set_meta(k, summary.compliance.toString());
				}
			}
		}
		if (this.voiceoverkey !== null) {
			var op = dooit.json(this.voiceoverrecord);
			array_of_fields[this.voiceoverkey][1] = op;
			eval('reply.EF' + array_of_fields[this.voiceoverkey][0] + '=op;');
		}
		if (this.summarykey !== null) {
			var op = dooit.json(summary);
			array_of_fields[this.summarykey][1] = op;
			eval('reply.EF' + array_of_fields[this.summarykey][0] + '=op;');
		}
		return reply;
	},
	dropbox: {
		key: 'ikow9fgantl7v95',
		testkey: 'iytf2k47y2cttsh',
		loaded: false,
		install: function(complete) {
			var key = this.key;
			if (yoodoo.option.baseUrl == 'http://paul.yoodoo.tv/') key = this.testkey;
			var me = this;
			if (typeof(Dropbox) == 'undefined') {
				var s = yoodoo.e("script");
				s.src = "https://www.dropbox.com/static/api/2/dropins.js";
				s.id = 'dropboxjs';
				s.type = 'text/javascript';
				$(s).attr('data-app-key', key);
				s.onload = function() {
					if (me.loaded === false) {
						me.loaded = true;
						complete();
					}
				};
				s.onreadystatechange = function() {
					if (me.loaded === false && (this.readyState == "complete" || this.readyState == "loaded")) {
						me.loaded = true;
						complete();
					}
				};
				var head = document.getElementsByTagName("head")[0];
				head.appendChild(s);
			} else {
				complete();
			}
		},
		button: function(callback, options) {
			this.install(function() {
				callback(Dropbox.createChooseButton(options));
			});
		}
	},
	byteSize: function(s) {
		var units = ['b', 'kb', 'Mb'];
		var depth = 1;
		while (s / Math.pow(2, depth * 10) > 10 && depth < units.length - 1) depth++;
		var v = s / Math.pow(2, depth * 10);
		return v.toFixed(1) + units[depth];
	},
	listPrompt: function(prompt, linkage, responseObject, responses, added, deleted) {
		var div = $(yoodoo.e("div")).css({
			width: yoodoo.option.width - 80,
			height: yoodoo.option.height - 80,
			'box-sizing': 'border-box',
			padding: '0px',
			position: 'relative'
		});
		var container = $(yoodoo.e("div")).css({
			height: '100%',
			overflow: 'auto'
		});
		var dialog = new yoodoo.ui.dialog({
			blockoutClickClose: true,
			closeButton: true,
			html: div,
			className: 'kloe_response_dialog'
		});
		div.append(
			$(yoodoo.e("div")).addClass("losenge").append(
				$(yoodoo.e("button")).attr("type","button").addClass("backButton").html("back").prepend(
					kloe_response.icon(kloe_response.icons.left, 20, 20, 100, 100, {
						'4D4D4D': 'FFFFFF'
					})
				).click(function() {
					dialog.close();
				})
			).append(
				$(yoodoo.e("h3")).html(prompt.value[kloe_response.promptParameters.Name]+' responses')
			)
		).append(
			$(yoodoo.e("button")).attr("type", "button").addClass("addButton").append(
				yoodoo.icons.get('add', 12, 12, {
					'4D4D4D': 'FFFFFF'
				})
			).css({
				position: 'absolute',
				top: '0px',
				right: '0px'
			}).click(function() {
				var newResponse = responseObject.add();
				newResponse.value[kloe_response.parameters.BusinessSector] = prompt.value[kloe_response.promptParameters["Business Sector"]]; // business sector
				newResponse.value[kloe_response.parameters.KeyQuestion]= prompt.value[kloe_response.promptParameters["Key Question"]]; //key question
				newResponse.value[kloe_response.parameters.KeyLineOfEnquiry] = prompt.value[kloe_response.promptParameters["Key Line of Enquiry"]]; // Key Line of Enquiry
				newResponse.value[kloe_response.parameters.Prompt] = prompt.Id; // prompt
				if (typeof(linkage) == "object" && linkage !== null) newResponse.value[kloe_response.parameters.PromptLinkage] = linkage.object.Id; // linkage
				var record = new kloe_response.record(newResponse,null,null,deleted);
				container.append(record.render());
				added(record);
				setTimeout(function() {
					record.edit();
				},1000);
			})
		).append(
			container
		);
		dialog.render();
		for (var r in responses) container.append(responses[r].render());
	},
	clone:{
		response:function(obj) {
			var toClone=['BusinessSector','DisplayName','KeyLineOfEnquiry','KeyQuestion','Prompt','Text'];
			var clone=obj.object.add();
			clone.value[kloe_response.parameters.ActionPlanCount]=0;
			clone.value[kloe_response.parameters.EvidenceCount]=0;
			clone.value[kloe_response.parameters.Status]=yoodoo.kloeStatus.warning.Id;
			for(var i in toClone) {
				clone.value[kloe_response.parameters[toClone[i]]]=obj.value[kloe_response.parameters[toClone[i]]];
			}
			clone.value[kloe_response.parameters.InheritedId]=obj.Id;
			clone.inheritedResponse=obj;
			clone.evidence=[];
			clone.actionPlans=[];

			if (obj.evidence instanceof Array && obj.evidence.length>0) {
				for(var e in obj.evidence) {
					var ev=this.evidence(obj.evidence[e],clone);
					clone.evidence.push(ev);
				}
			}
			if (obj.actionPlans instanceof Array && obj.actionPlans.length>0) {
				for(var e in obj.actionPlans) {
					var ev=this.actionPlan(obj.actionPlans[e],clone);
					clone.actionPlans.push(ev);
				}
			}
			return clone;
		},
		evidence:function(obj,response) {
			var toClone=['Data','WhatIsYourEvidence'];
			var clone=obj.object.add();
			for(var i in toClone) {
				clone.value[kloe_response.evidenceParameters[toClone[i]]]=obj.value[kloe_response.evidenceParameters[toClone[i]]];
			}
			clone.value[kloe_response.evidenceParameters.InheritedId]=obj.Id;
			clone.value[kloe_response.evidenceParameters.Response]=response;
			clone.inheritedEvidence=obj;
			return clone;
		},
		actionPlan:function(obj,response) {
			var toClone=['Data','HowIsThisNotMet'];
			var clone=obj.object.add();
			for(var i in toClone) {
				clone.value[kloe_response.actionPlanParameters[toClone[i]]]=obj.value[kloe_response.actionPlanParameters[toClone[i]]];
			}
			clone.value[kloe_response.actionPlanParameters.InheritedId]=obj.Id;
			clone.value[kloe_response.actionPlanParameters.Response]=response;
			clone.inheritedActionPlan=obj;
			return clone;
		}
	},
	createInherited:function(templatesById,existing,prompt,complete,clonedCallback) {
		var inheritedIds={};
		// attach inherited responses to existing responses
		var responseIds=[];
		var responsesById={};
		for(var r in existing) {
			responseIds.push(existing[r].object.Id);
			responsesById[existing[r].object.Id]=existing[r];
		}
		for(var tid in templatesById) {
			responseIds.push(tid);
			responsesById[tid]=templatesById[tid];
		}


		var me=this;
		var processInherited=function() {		
			for(var r in existing) {
				if (existing[r].object.value[kloe_response.parameters.InheritedId]>0) {
					var tid=existing[r].object.value[kloe_response.parameters.InheritedId];
				 	if (templatesById[tid]!==undefined) {
						existing[r].object.inheritedResponse=templatesById[tid];
						//existing[r].updateInherited();
						delete templatesById[tid];
					}
				}
			}


			// clone read only responses as inherited responses
			//me.getWarningStatusId(
			//	function() {
					var optional=[];
					var toClone=['BusinessSector','DisplayName','KeyLineOfEnquiry','KeyQuestion','Prompt','Text'];
					for(var tid in templatesById) {
						if (templatesById[tid].readonly===true && templatesById[tid].value[kloe_response.parameters.ActiveInheritance]===true) {
							if (templatesById[tid].value[kloe_response.parameters.OptionalInheritance]===true) {
								optional.push(templatesById[tid]);
							}else{
								var item=null;
								if (templatesById[tid].itemObject!==undefined) item=templatesById[tid].itemObject;
								var clone=new kloe_response.record(kloe_response.clone.response(templatesById[tid]),item);
								existing.push(clone);
								if (typeof(clonedCallback)=="function") clonedCallback(clone);
							}
						}
					}
					for(var r in existing) {
						if (existing[r].object.inheritedResponse!==undefined) existing[r].updateInherited();
					}
					complete(optional);
	//console.log(existing,optional);
			//	}
			//);
		};
		yoodoo.object.get([this.objectName.actionPlans,this.objectName.evidence,this.objectName.responses],function(list) {
			var actionPlans=list.shift();
			var evidence=list.shift();
			var responses=list.shift();
			var planToResponse=actionPlans.getParameterReferingToObjectId(responses.schema.Id);
			var evidenceToResponse=evidence.getParameterReferingToObjectId(responses.schema.Id);
			var filter={};
			filter[planToResponse]=[responseIds.join(","),"in"];
			actionPlans.get(function(list) {
				//console.log('Action Plans',list);
				var apid={};
				for(var l in list) {
					apid[list[l].Id]=list[l];
					var rid=list[l].value[planToResponse];
					if (responsesById[rid]!==undefined) {
						if (responsesById[rid].actionPlans!==undefined && typeof(responsesById[rid].actionPlans.attach)=="function") {
							responsesById[rid].actionPlans.attach(list[l]);
						}else{
							if (responsesById[rid].actionPlans===undefined) responsesById[rid].actionPlans=[];
							responsesById[rid].actionPlans.push(list[l]);
						}
					}
				}
//console.log(apid);
				for(var id in apid) {
//console.log(apid[id].value[kloe_response.actionPlanParameters.InheritedId]);
					if (apid[id].value[kloe_response.actionPlanParameters.InheritedId]>0 && 
						apid[apid[id].value[kloe_response.actionPlanParameters.InheritedId]]!==undefined) {
							apid[id].inheritedActionPlan=apid[apid[id].value[kloe_response.actionPlanParameters.InheritedId]];
						}
				}

				var filter={};
				filter[evidenceToResponse]=[responseIds.join(","),"in"];
				evidence.get(function(list) {
					//console.log('Evidence',list);
					var evid={};
					for(var l in list) {
						evid[list[l].Id]=list[l];
						var rid=list[l].value[evidenceToResponse];
						if (responsesById[rid]!==undefined) {
							if (responsesById[rid].evidence!==undefined && typeof(responsesById[rid].evidence.attach)=="function") {
								responsesById[rid].evidence.attach(list[l]);
							}else{
								if (responsesById[rid].evidence===undefined) responsesById[rid].evidence=[];
								responsesById[rid].evidence.push(list[l]);
							}
						}
					}
					for(var id in evid) {
						if (evid[id].value[kloe_response.evidenceParameters.InheritedId]>0 && 
							evid[evid[id].value[kloe_response.evidenceParameters.InheritedId]]!==undefined) {
								evid[id].inheritedEvidence=evid[evid[id].value[kloe_response.evidenceParameters.InheritedId]];
							}
					}
					processInherited();
				},function(){},0,filter);
			},function(){},0,filter);
		},function(){});
	},
	templateMessage:function(opts,asButton) {
		var op=(asButton===true)?$(yoodoo.e("button")).attr("type","button").addClass("templateMessage"):$(yoodoo.e("div")).addClass("templateMessage");
		var arr={
			optional:0,
			addedResponse:0,
			updatedResponse:0,
			addedEvidence:0,
			updatedEvidence:0,
			addedActionPlans:0,
			updatedActionPlans:0,
			title:'Updates'
		};
		var colours={
			cyan:'25d6e1',
			amber:'db810b',
			red:'fb3e3e'
		};
		for(var k in opts) arr[k]=opts[k];
		/*arr={
			optional:1,
			addedResponse:0,
			updatedResponse:0,
			addedEvidence:1,
			updatedEvidence:0,
			addedActionPlans:0,
			updatedActionPlans:1,
			title:'Updates'
		};*/
		var borderColour=(arr.addedActionPlans>0 || arr.addedEvidence>0 || arr.addedResponse>0)?colours.red:((arr.updatedResponse>0 || arr.updatedActionPlans>0 || arr.updatedEvidence>0)?colours.amber:colours.cyan);
		if (arr.optional>0 || arr.updatedResponse>0 || arr.addedResponse>0 || arr.addedEvidence>0 || arr.updatedEvidence>0 || arr.addedActionPlans>0 || arr.updatedActionPlans>0) {
			if (arr.optional>0 || arr.updatedResponse>0 || arr.addedResponse>0) {
				var responses=$(yoodoo.e("span")).append(
						this.icon(this.icons.editDocument,15,15,100,100,{})
					);
				var background=yoodooStyler.hexToRGB((arr.addedResponse>0)?this.colours.red:((arr.updatedResponse>0)?colours.amber:colours.cyan));
				if (arr.optional>0) responses.append(
					yoodoo.bubble($(yoodoo.e("span")).addClass("updateOptional").html(arr.optional).get(0),arr.optional+" optional response"+(arr.optional==1?'':'s'))
				);
				if (arr.updatedResponse>0) responses.append(
					yoodoo.bubble($(yoodoo.e("span")).addClass("updateUpdated").html(arr.updatedResponse).get(0),arr.updatedResponse+" updated response"+(arr.updatedResponse==1?'':'s'))
				);
				if (arr.addedResponse>0) responses.append(
					yoodoo.bubble($(yoodoo.e("span")).addClass("updateAdded").html(arr.addedResponse).get(0),arr.addedResponse+" added response"+(arr.updatedResponse==1?'':'s'))
				);
				background=yoodooStyler.rgbToHex(yoodooStyler.tint(background,0.6,0.2));
				op.append(responses.css({background:background}));
			}
			if (arr.addedEvidence>0 || arr.updatedEvidence>0) {
				var evidence=$(yoodoo.e("span")).append(
						this.icon(this.icons.evidence,50,15,100,30,{})
					);
				var background=yoodooStyler.hexToRGB((arr.addedEvidence>0)?colours.red:colours.amber);
				if (arr.updatedEvidence>0) evidence.append(
					yoodoo.bubble($(yoodoo.e("span")).addClass("updateUpdated").html(arr.updatedEvidence).get(0),arr.updatedEvidence+" updated evidence")
				);
				if (arr.addedEvidence>0) evidence.append(
					yoodoo.bubble($(yoodoo.e("span")).addClass("updateAdded").html(arr.addedEvidence).get(0),arr.addedEvidence+" added evidence")
				);
				background=yoodooStyler.rgbToHex(yoodooStyler.tint(background,0.6,0.2));
				op.append(evidence.css({background:background}));
			}
			if (arr.addedActionPlans>0 || arr.updatedActionPlans>0) {
				var actionPlans=$(yoodoo.e("span")).append(
						this.icon(this.icons.walking,15,15,100,100,{})
					);
				var background=yoodooStyler.hexToRGB((arr.addedActionPlans>0)?colours.red:colours.amber);
				if (arr.updatedActionPlans>0) actionPlans.append(
					yoodoo.bubble($(yoodoo.e("span")).addClass("updateUpdated").html(arr.updatedActionPlans).get(0),arr.updatedActionPlans+" updated action plan"+(arr.updatedActionPlans==1?'':'s'))
				);
				if (arr.addedActionPlans>0) actionPlans.append(
					yoodoo.bubble($(yoodoo.e("span")).addClass("updateUpdated").html(arr.addedActionPlans).get(0),arr.addedActionPlans+" added action plan"+(arr.addedActionPlans==1?'':'s'))
				);
				background=yoodooStyler.rgbToHex(yoodooStyler.tint(background,0.6,0.2));
				op.append(actionPlans.css({background:background}));
			}
			if (typeof(arr.title)=="string" && arr.title!="") op.append($(yoodoo.e("div")).addClass("templateTitle").html(arr.title).css({'border-color':'#'+borderColour,color:'#'+borderColour})).css({'border-color':'#'+borderColour});
			return op;
		}else{
			return null;
		}
	}
};
