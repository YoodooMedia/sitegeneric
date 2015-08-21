var tube={
	containers:{
		main:null,
		options:null,
		structure:null
	},
	layout:'<div class="tube">&nbsp;</div>\n<script type="text/javascript">\nfunction initThis() {\nvar param={};\nparam.dependencies=[\n[\'dooits/game/tube.js\',true],\n[\'css/game/tube.css\',true],\n[\'dooits/raphael.js\',true],\n[\'dooits/data/tube_data.js\',true]\n];\nparam.loaded=function(){\ntube.init({selectors:{container:".tube"}});\n};\nparam.saveValues=["tube.output"];\nparam.noscroll=true;\nparam.finished="tube.finishable";\ndooit.init(param);\n}\n</script>',
	value:{},
	stations:{},
	routes:{},
	zone:3,
	map:{
		selection:null,
		width:0,
		height:0,
		ppll:0,
		zoom:1.5,
		lineWidth:2,
		lineBackgroundWidth:0,
		lineBackgroundColour:'#fff',
		dotBackgroundRadius:1,
		dotBackgroundColour:'#fff',
		dotRadius:5,
		selectedStroke:{
			'stroke-width':3,
			'stroke':'#f00',
			'fill':'#fff'
		},
		closedStroke:{
			'stroke-width':1,
			'stroke':'#000',
			'fill':'#555'
		},
		selectedStroke:{
			'stroke-width':3,
			'stroke':'#000',
			'fill':'#f00'
		},
		station:{
			'stroke-width':2,
			'stroke':'#999',
			'fill':'#fff'
		}
	},
	schema:{
		main:{
			title:{label:'Title',initial:'Tube puzzle',type:'text',description:'The title of the tube puzzle.'},
			paragraph:{label:'Paragraph',initial:'Here you test your problem solving skills by getting from {stationA} to {stationB} in the least number of Stations. Click on the next station to go to, until you reach {stationB}. Unfortunately, you have to avoid {avoiding}.',type:'textarea',description:'The paragraph shown under the title.'},
			passedMessage:{label:'Passed message',initial:"Congratulations, you got to {stationB} from {stationA} in {stations} stations.\nYou could have done it in {minStations} stations.",type:'textarea',description:'The message the user receives if the pass mark is achieved.\nText replacements are:\n{stationA} = Start Station\n{stationB} = Destination Station\n{stations} = the number stations used\n{minStations} = shortest route length\n{score} = the number stations used also\n{avoiding} = the closed stations\n{route} = the stations used.'},
			shortestMessage:{label:'Passed and shortest message',initial:"Amazing, you got to {stationB} from {stationA} in {stations} stations, which is the shortest route.",type:'textarea',description:'The message the user receives if completed in the shortest route.\nText replacements are:\n{stationA} = Start Station\n{stationB} = Destination Station\n{stations} = the number stations used\n{minStations} = shortest route length\n{score} = the number stations used also\n{avoiding} = the closed stations\n{route} = the stations used.'},
			failedMessage:{label:'Failed message',initial:"Unfortunately, you got to {stationB} from {stationA} in {stations} stations.\nYou could have done it in {minStations} stations.",type:'textarea',description:'The message the user receives if the pass mark is not achieved\nText replacements are:\n{stationA} = Start Station\n{stationB} = Destination Station\n{stations} = the number stations used\n{minStations} = shortest route length\n{score} = the number stations used also\n{avoiding} = the closed stations\n{route} = the stations used.'},
			redoable:{label:'Redoable',initial:true,type:'boolean',description:'Allows the user to redo the puzzle, once it has been completed.'},
			restart:{label:'Restart button text',initial:"Try again...",type:'text',description:'The text shown on the restart the puzzle button.'},
			metaKey:{label:'User meta key',initial:'Tube_puzzle',type:'text',description:'The key to save the message below to.'},
			metaMessage:{label:'User meta message',initial:"You got to {stationB} from {stationA} in {stations} stations via {route}.",type:'textarea',description:'The message saved to the User Meta key.\nText replacements are:\n{stationA} = Start Station\n{stationB} = Destination Station\n{stations} = the number stations used\n{minStations} = shortest route length\n{score} = the number stations used also\n{avoiding} = the closed stations\n{route} = the stations used.'},
			completeOnPassOnly:{label:'Complete on pass only',initial:true,type:'boolean',description:'Mark the tube puzzle as complete in the bookcase if the tube is passed only.'},
			passMark:{label:'Pass mark (number of stations)',initial:30,type:'integer',description:'If the user gets from A to B is less then this stations, then they pass.',notNull:true},
			stationA:{label:'Start Station',initial:'',type:'station',style:'selectedStroke',description:'The Station that the user must start from.',notNull:true},
			stationB:{label:'Destination Station',initial:'',type:'station',style:'selectedStroke',description:'The Station that the user must get to.',notNull:true},
			closedStations:{label:'Closed stations',initial:[],type:'closedStations',description:'The Stations that are closed and have to be avoided.'},
			scoreTagRules:{label:'Tag rules',initial:[],type:'scoreTagRules',description:'The rules that set tags depending on the score achieved.'}
		},
		scoreTagRules:{
			elementType:{className:'rule',sortable:true,deleteable:true},
			tag:{label:'Tag name',initial:'',type:'tag',description:'The name of the tag to change.',affectButton:true,required:true},
			unique:{label:'Unique',initial:false,type:'boolean',description:'If the user gets this tag, all other tags defined here are removed.'},
			unset:{label:'Removable',initial:false,type:'boolean',description:'If the user already has this tag and it is no longer applicable, it will be removed.'},
			stop:{label:'Stop',initial:false,type:'boolean',description:'If the user gets this tag, the tag rules below will not be checked.'},
			compares:{label:'Tag parameters (all must be true to set the tag)',initial:[],type:'compares',description:'The score percentage comparisons.'}
		},
		compares:{
			elementType:{className:'Parameter',sortable:true,deleteable:true},
			compare:{label:'Score % is...',initial:'=',options:[
				{value:'<',text:'less than'},
				{value:'<=',text:'less than or equal to'},
				{value:'=',text:'equal to'},
				{value:'>=',text:'greater than or equal to'},
				{value:'>',text:'greater than '}
				],type:'select',description:'The rule to apply to the score below.'},
			value:{label:'this score...',initial:0,type:'integer',description:'The percentage the score will be compared to.',notNull:true}
		},
		closedStations:{
			elementType:{sortable:false,deleteable:true,ondelete:'tube.removeStation'},
			station:{label:'Closed Station',initial:'',type:'station',style:'closedStroke',description:'The Station that is closed.'}
		},
		questions:{
			Text:{
				type:{initial:'Text',type:'h4',description:''},
				id:{initial:'tube.uniqueId()',type:'hidden'},
				title:{label:'Title',initial:'Question title',type:'text',description:'The title of the question.',affectButton:true,required:true},
				paragraph:{label:'Paragraph',initial:'',type:'textarea',description:'The paragraph shown under the title on this question.'},
				caseInsensitive:{label:'Matches are case insensitive',initial:true,type:'boolean',description:'If selected, the matches will not be case sensitive.'},
				options:{label:'Matches',initial:[],type:'optionsText',description:'The matches in this question.',required:true}
			},
			Select:{
				type:{initial:'Select',type:'h4',description:'A select box for a single selection from a number of predefined options.'},
				id:{initial:'tube.uniqueId()',type:'hidden'},
				title:{label:'Title',initial:'Question title',type:'text',description:'The title of the question.',affectButton:true,required:true},
				paragraph:{label:'Paragraph',initial:'',type:'textarea',description:'The paragraph shown under the title on this question.'},
				options:{label:'Options',initial:[],type:'optionsSelect',description:'The options in this question.',required:true}
			},
			MultipleChoice:{
				type:{initial:'Multiple Choice',type:'h4',description:'Select any of the available options.',update:'onMultipleChoiceUpdate'},
				id:{initial:'tube.uniqueId()',type:'hidden'},
				title:{label:'Title',initial:'Question title',type:'text',description:'The title of the question.',affectButton:true,required:true},
				paragraph:{label:'Paragraph',initial:'',type:'textarea',description:'The paragraph shown under the title on this question.'},
				maximum:{label:'Maximum',initial:1,type:'maximum',description:'The maximum number of items selectable.',className:'onMultipleChoiceUpdate'},
				options:{label:'Items',initial:[],type:'optionsMultipleChoice',description:'The items in this question.',onchange:'tube.ancester(this,"MultipleChoiceType").update()',required:true}
			},
			DragandDrop:{
				type:{initial:'Drag and Drop',type:'h4',description:'Drag and Drop the answer into the question.'},
				id:{initial:'tube.uniqueId()',type:'hidden'},
				title:{label:'Title',initial:'Question title',type:'text',description:'The title of the question.',affectButton:true,required:true},
				paragraph:{label:'Paragraph',initial:'',type:'textarea',description:'The paragraph shown under the title on this question. Where "[blank]" is placed in the paragraph, the selected answer will be inserted instead.'},
				options:{label:'Options',initial:[],type:'optionsDragAndDrop',description:'The options in this question.',required:true}
			},
			Reorder:{
				type:{initial:'Reorder',type:'h4',description:'Reorder the available options into the correct order.'},
				id:{initial:'tube.uniqueId()',type:'hidden'},
				title:{label:'Title',initial:'Question title',type:'text',description:'The title of the question.',affectButton:true,required:true},
				paragraph:{label:'Paragraph',initial:'',type:'textarea',description:'The paragraph shown under the title on this question. Where "[blank]" is placed in the paragraph, the selected answer will be inserted instead.'},
				positions:{label:'Positions',initial:1,type:'integer',description:'The number of top positions that count.'},
				scoreall:{label:'Score if all correct',initial:0,type:'integer',description:'The score if all positions are correct. Ensure this value is more or equal to the sum of each position score.'},
				options:{label:'Options',initial:[],type:'optionsReorder',description:'The options in this question.',required:true}
			}
		},
		optionsText:{
			elementType:{sortable:false,deleteable:true},
			title:{label:'Match text',initial:'',type:'text',description:'The text to match the answer against',required:true},
			score:{label:'Score',initial:1,type:'integer',description:'The score given if the text matches the answer.',notNull:true}
		},
		optionsSelect:{
			elementType:{sortable:false,deleteable:true},
			title:{label:'Option title',initial:'',type:'text',description:'The option answer text.',required:true},
			score:{label:'Score',initial:1,type:'integer',description:'The score given for this selected answer.',notNull:true}
		},
		optionsMultipleChoice:{
			elementType:{sortable:false,deleteable:true},
			title:{label:'Option title',initial:'',type:'text',description:'The option answer text.',required:true},
			score:{label:'Score',initial:1,type:'integer',description:'The score given for this selected answer.',notNull:true}
		},
		optionsDragAndDrop:{
			elementType:{sortable:false,deleteable:true},
			title:{label:'Option title',initial:'',type:'text',description:'The option answer text.',required:true},
			score:{label:'Score',initial:1,type:'integer',description:'The score given for this selected answer.',notNull:true}
		},
		optionsReorder:{
			elementType:{sortable:true,deleteable:true,className:'orderItem'},
			title:{label:'Option title',initial:'Order item',type:'text',description:'The option answer text.',affectButton:true,required:true},
			score:{label:'Score',initial:1,type:'integer',description:'The score awarded if in the correct position.',notNull:true},
		}
	},
	ids:{},
	init:function() {
		this.autosave=typeof(localStorage)!="undefined";
		if (this.autosave) {
			this.autosaveKey='globalFieldId'+$('input[name=globalFieldId]').val();
			if (localStorage[this.autosaveKey]!==undefined && localStorage[this.autosaveKey]!="") {
				if (window.confirm("Recover autosave data?")) {
					$('textarea#globalFieldContent').val(localStorage[this.autosaveKey]);
					localStorage[this.autosaveKey]='';
					tube.init();
					return false;
				}
			}
		}
		$('form#sf_admin_edit_form').submit(function(e) {
			return tube.save(e);
		});
		this.containers.main=$('.exerciseTemplate').get(0);
		$(this.ancester(this.containers.main,'form-row')).css({overflow:"visible"});
		var val=$('#globalFieldContent').val();
		try{
			eval('tube.value='+val+';');
		}catch(e) {}
		tube.value=json.decode(tube.value);
		this.build();
	},
	saveLocal:function() {
		if (this.autosave) localStorage[this.autosaveKey]=json.build(this.value);
	},
	clearLocal:function() {
		if (this.autosave) localStorage[this.autosaveKey]='';
	},
	build:function() {
		this.loadData();
		$(this.containers.main).html("<h2>Tube Puzzle Construction</h2>");
		var main=document.createElement("div");
		this.containers.main.appendChild(main);
		this.containers.tubeRoute=document.createElement("h1");
		$(this.containers.tubeRoute).css({"margin-top":"10px"});
		this.containers.main.appendChild(this.containers.tubeRoute);
		this.containers.tubemapTitle=document.createElement("h2");
		$(this.containers.tubemapTitle).html("Select a Station input above, then choose the Station below").css({"margin-top":"10px"});
		this.containers.main.appendChild(this.containers.tubemapTitle);
		this.containers.tubemap=document.createElement("div");
		$(this.containers.tubemap).addClass("tubemap");
		this.containers.main.appendChild(this.containers.tubemap);
		this.render(main,'main');
		this.drawMap();
		this.calculate();
	},
	loadData:function() {
		this.indexRoutes=[];
		for(var i=0;i<tubeData.routes.length;i++) {
			while(this.indexRoutes.length<=tubeData.routes[i][0]+1) this.indexRoutes.push("");
			this.indexRoutes[tubeData.routes[i][0]]=tubeData.routes[i][1];
			this.routes[tubeData.routes[i][1]]={colour:tubeData.routes[i][2],stripe:tubeData.routes[i][3]};
		}
		this.indexNames=[];
		var maxid=0;
		for(var i=0;i<tubeData.stations.length;i++) {
			if(maxid<tubeData.stations[i][0]) maxid=tubeData.stations[i][0];
		}
		while(this.indexNames.length<=maxid) this.indexNames.push("");
		this.dims={
			lat:{
				maxlat:-180,
				minlat:180
			},lon:{
				maxlon:-180,
				minlon:180
			}
		};
		for(var i=0;i<tubeData.stations.length;i++) {
			if (tubeData.stations[i][5]<=this.zone) {
				this.indexNames[tubeData.stations[i][0]]=tubeData.stations[i][3];
				this.stations[tubeData.stations[i][3]]={name:((tubeData.stations[i][4]===null)?tubeData.stations[i][3]:tubeData.stations[i][4]),latitude:tubeData.stations[i][1],longitude:tubeData.stations[i][2],zone:tubeData.stations[i][5],lines:tubeData.stations[i][6],rail:(tubeData.stations[i][4]==1)};
				if (this.dims.lat.maxlat<tubeData.stations[i][1]) this.dims.lat.maxlat=tubeData.stations[i][1];
				if (this.dims.lat.minlat>tubeData.stations[i][1]) this.dims.lat.minlat=tubeData.stations[i][1];
				if (this.dims.lon.maxlon<tubeData.stations[i][2]) this.dims.lon.maxlon=tubeData.stations[i][2];
				if (this.dims.lon.minlon>tubeData.stations[i][2]) this.dims.lon.minlon=tubeData.stations[i][2];
			}
		}
	},
	calculate:function() {
		var routeMessage='No route has been found';
		if (this.value.main.stationA!="" && this.value.main.stationB!="") {
			if (this.value.main.stationA==this.value.main.stationB) {
				routeMessage='Destination and Start stations are the same';
			}else{
				this.foundRoutes=[];
				this.routeIndex=0;
				var limit=3;
				while(this.foundRoutes.length==0 && limit<30) {
					this.foundRoutes=[];
					this.getLinked([this.value.main.stationA],limit++);
				}
				if (this.foundRoutes.length>0) {
					//console.log("Checked "+this.routeIndex+" stations");
					this.foundRoutes.sort(function(a,b) {return a.length>b.length;});
					var shortest=this.foundRoutes[0].length-2;
					routeMessage="The shortest route consists of "+shortest+" stations";
				}
			}
		}
		$(this.containers.tubeRoute).html(routeMessage);
	},
	availableForCheck:function(stations,station) {
		if (tube.value.main.stationA==station) return false;
		if (tube.value.main.stationB==station) return true;
		if (tube.isClosed(station)) return false;
		for(var s=0;s<stations.length;s++) {
			if (stations[s]==station) return false;
		}
		return true;
	},
	getLinked:function(stations,limit) {
		if (stations.length<limit) {
			stations.push('');
			this.routeIndex++;
			//if (this.routeIndex<100000) {
			for(var i=0;i<this.stationLinks[stations[stations.length-2]].length;i++) {
				var s=this.stationLinks[stations[stations.length-2]][i];
				if (tube.availableForCheck(stations,s)) {
	//console.log(stations.length,s);
					stations[stations.length-1]=s;
					if (tube.value.main.stationB==s) {
						var got=[];
						for(var j=0;j<stations.length;j++) got.push(stations[j]);
						tube.foundRoutes.push(got);
					}else{
						tube.getLinked(stations,limit);
					}
				}
			}
			//}
			stations.pop();
		}
	},
	render:function(target,id) {
		var objects=[];
		var list=this.schema[id];
		if (typeof(list.initial)=="object" && typeof(list.initial.length)=="number") {
			objects.push(this.object.render(target,[id],list));
		}else{
			for(var k in list) {
				if (this.object[list[k].type]!=undefined) {
					objects.push(this.object[list[k].type](target,[id,k],list[k]));
				}else{
					objects.push(this.object.render(target,[id,k],list[k]));
				}
			}
		}
		return objects;
	},
	validate:function() {
		var missing=[];
		$(this.containers.main).find(".requiredChildren").each(function(i,e) {
			var but=$(e).find('>button').get(0);
			var levels=but.levels;
			if (levels!==undefined) {
				if (tube.levelValue(levels).length==0) {
					var err=but.item.label+' has no items';
					if(levels.length>2) {
						var parnt=tube.parentValue(levels);
						if (parnt.title!==undefined && parnt.title!="") err+=' in '+parnt.title;
					}
					err+='.';
					missing.push(err);
				}
			}
		});
		$(this.containers.main).find(".requiredValue").each(function(i,e) {
//console.log(e.levels);
			var v=tube.levelValue(e.levels);
			if (v===undefined || v===null || v=='') {
				var err=e.item.label+' is empty';
				if(e.levels.length>2) {
					var parnt=tube.parentTitle(e.levels);
					if (parnt!==undefined && parnt!="") err+=' in '+parnt;
				}
				err+='.';
				missing.push(err);
			}
//console.log(v);
		});
		return missing;
	},
	parentTitle:function(levels) {
		var increment=1;
		//if (levels[levels.length-1]=="title") increment=2;
		var l=[];
		for(var i=0;i<levels.length-increment;i++) l.push(levels[i]);
		var obj=this.levelValue(l);
		if (obj.title!==undefined && obj.title!='') {
			return obj.title;
		}else if (l.length<2) {
			return '';
		}else{
			return tube.parentTitle(l);
		}
	},
	parentParentValue:function(levels) {
		var l=[];
		for(var i=0;i<levels.length-2;i++) l.push(levels[i]);
		return this.levelValue(l);
	},
	parentValue:function(levels) {
		var l=[];
		for(var i=0;i<levels.length-1;i++) l.push(levels[i]);
		return this.levelValue(l);
	},
	levelValue:function(levels) {
		var defaultValue=(arguments.length>2)?arguments[2]:null;
		var level=tube.value;
		for(var l=0;l<levels.length;l++) {
			if (level[levels[l]]==undefined) {
				if (!isNaN(levels[l])) {
					while(level.length<=levels[l]) level.push({});
				}else if (l==levels.length-1) {
					level[levels[l]]=defaultValue;
				}else if (isNaN(levels[l])) {
					level[levels[l]]={};
				}else{
					level[levels[l]]=[];
				}
			}else{
			}
			level=level[levels[l]];
		}
		return level;
	},
	object:{
		base:function(args) {
			var levels=args[1];
			var item=args[2];
			var defaultValue=item.initial;
			if ( typeof(item.initial)=="object" && typeof(item.initial.length)=="number") defaultValue=item.initial.concat([]);
						
			if (/\(\)/.test(defaultValue)) {
				try{
					eval('defaultValue='+item.initial+';');
					if (item.initial=='tube.uniqueId()') tube.ids[defaultValue]=true;
				}catch(e){}
			}
			var index=null;
			if (args.length>3) {
				var val=tube.levelValue(levels.concat([]),item,defaultValue,args[3]);
				return val;
			}else{
				var val=tube.levelValue(levels.concat([]),item,defaultValue,item);
				return val;
			}
		},
		render:function(target,levels,item) {
			var val=this.base(arguments);
			var o=document.createElement("div");
			$(o).addClass("formItem formSection");
			if (arguments.length<4) {
				var className=null;
				var sortable=false;
				var deleteable=false;
				var ab=[];
				if(typeof(val)=="object" && typeof(val.length)=="number") {
					if (item.required===true) $(o).addClass("requiredChildren");
					var but=document.createElement("button");
					$(but).html("add");
					but.type="button";
					but.src=val;
					but.item=item;
					but.levels=levels;
					$(but).addClass("hasLevels add");
					if (item.onchange) {
						but.change=item.onchange;
						but.update=function() {
							if (typeof(this.change)=="string") {
								try{
									eval(this.change);
								}catch(e){}
							}else if (typeof(this.change)=="function") {
								this.change();
							}
						};
					}
					$(but).bind("click",function() {
						var index=$(this).nextAll('div').get().length;
						var insertLevels=this.levels.concat([index]);
						tube.object.render(this.parentNode,insertLevels,tube.schema[this.item.type],index);
						if (this.update) this.update();
						return true;
					});
					o.appendChild(but);
					if (item.label) className=item.label;
					ab=$(o).find('.affectButton').get();
				}
				for(var i=0;i<val.length;i++) {
					tube.object.render(o,levels.concat([i]),tube.schema[item.type],i);
				}
				var ondelete='';
				if (item.elementType!==undefined) {
					if (item.elementType.className!==undefined) className=item.elementType.className;
					if (item.elementType.sortable!==undefined) sortable=item.elementType.sortable;
					if (item.elementType.deleteable!==undefined) deleteable=item.elementType.deleteable;
					if (item.elementType.ondelete!==undefined) ondelete=item.elementType.ondelete;


				}
				if (className!==null || sortable==true) {
					o=tube.collapsible((ab.length>0)?ab[0].value:className,o,{className:className,sortable:sortable,deleteable:deleteable});
				}else if (deleteable) {
					var but=document.createElement("button");
					but.type="button";
					but.deleteMethod=ondelete;
					$(but).html("delete").addClass("delete");
					$(but).bind("click",function() {
						tube.deleteItem(this,this.deleteMethod);
					});
					o.insertBefore(but,o.childNodes[0]);
				}
				/*if (item.elementType!==undefined) {
console.log(item.elementType);
					if (item.elementType.update!==undefined) {
						o.updateClass=item.elementType.update;
console.log(item.elementType.update);
						o.update=function() {
							$(this).find('.'+this.updateClass).each(function(i,e) {
								if (e.update) {
									e.update();
								}else{
									$(e).find('.updateable').each(function(i,ee) {
										if (ee.update) {
											ee.update();
										}
									});
								}
							});
						}
					}
				}*/
			}else{
//console.log(levels,item);
				if (item.label!==undefined) {
					var label=document.createElement("h3");
					$(label).html(item.label);
					o.appendChild(label);
				}
				if (item.description!==undefined) {
					var description=document.createElement("span");
					$(description).html(item.description.replace(/\n/g,'<br />'));
					o.appendChild(description);
				}
				$(o).addClass("hasLevels");
				o.levels=levels;
				$(o).addClass("indexed");
				var elementType=null;
				if (item.elementType!==undefined) elementType=item.elementType;
				for(var k in item) {
					if (k!='elementType') {
						if (tube.object[item[k].type]===undefined && typeof(item[k].initial)=="object" && typeof(item[k].initial.length)=="number") {
							var obj=tube.object.render(o,levels.concat([k]),item[k]);
						}else{
							//try{
								var obj=tube.object[item[k].type](o,levels.concat([k]),item[k]);
							//}catch(e) {
							//	console.log(tube.schema[item.type][k].type);
							//}
						}
					}
				}
				var className=null;
				var sortable=false;
				var ab=$(o).find('.affectButton').get();
				var deleteable=false;
				var ondelete='';
				
				if (elementType!==null) {
					if (elementType.className!==undefined) className=elementType.className;
					if (elementType.sortable!==undefined) sortable=elementType.sortable;
					if (elementType.deleteable!==undefined) deleteable=elementType.deleteable;
					if (elementType.ondelete!==undefined) ondelete=elementType.ondelete;
					var ab=$(o).find('.affectButton').get();
					if (className!==null || sortable==true) {
						o=tube.collapsible((ab.length>0)?ab[0].value:className,o,{className:className,sortable:sortable,deleteable:deleteable});
					}else if (deleteable) {
						var but=document.createElement("button");
						but.type="button";
						but.deleteMethod=ondelete;
						$(but).html("delete").addClass("delete");
						$(but).bind("click",function() {
							tube.deleteItem(this,this.deleteMethod);
						});
						o.insertBefore(but,o.childNodes[0]);
					}
				}
				if (elementType!==null) {
					if (elementType.update!==undefined) {
						o.updateClass=elementType.update;
						$(o).addClass("callOnDelete");
						o.update=function() {
							$(this).find('.'+this.updateClass).each(function(i,e) {
								if (e.update) {
									e.update();
								}else{
									$(e).find('.updateable').each(function(i,ee) {
										if (ee.update) {
											ee.update();
										}
									});
								}
							});
						};
					}
				}
				if (sortable && className!==null) tube.sortable(target,'>.tube_sortable','>.collapseButton>.mover',function(e,ui) {tube.updateOrder(e,ui,className);});
			}
			/*if (item.elementType && item.elementType.update) {
				$(o).addClass("callOnDelete");
				o.updateClass=item.elementType.update;
				o.update=function() {
					$(this).find('.'+this.updateClass).each(function(i,e) {
						if (e.update) e.update();
					});
				}
			}*/
				target.appendChild(o);
				return o;
		},
		station:function(target,levels,item) {
			var o=document.createElement("div");
			$(o).addClass("formItem");
			var val=this.base(arguments);
			var label=document.createElement("label");
			$(label).html(item.label);
			var description=document.createElement("span");
			$(description).html(item.description.replace(/\n/g,'<br />')).addClass("inputDescription");
			var ip=document.createElement("input");
			ip.disabled=true;
			ip.type='text';
			ip.value=val;
			//ip.val=val;
			ip.item=item;
			ip.buttonType=item.style;
			ip.levels=levels;
			if (val!="" && tube.stations[val]===undefined) {
				ip.value=val='';
				tube.setValue(ip,levels,'');
			}
			$(ip).addClass("hasLevels");
			if (val=='') $(ip).addClass("required");
			var change=document.createElement("button");
			$(change).attr("type","button").html("change").bind("click",function() {
				var ip=$(this).prev("input").get(0);
				tube.stationSelector(ip,ip.value,ip.item.label,ip.levels,ip.buttonType);
			});
			if (item.required===true) $(ip).addClass("requiredValue");
			ip.update=function(){};
			if (item.affectButton===true) {
				ip.update=function() {
					var p=tube.ancester(this,'collapseContent');
					var b=$(p).prev('.collapseButton').find('>nobr');
					var t=this.value.replace(/[^a-z^0-9^ ]+/gi,'');
					b.html(t);
				};
				$(ip).addClass('affectButton');
			}
			$(ip).bind("keyup",function() {
				tube.setValue(this,this.levels,this.value);
				this.update();
			});
			o.appendChild(label);
			o.appendChild(description);
			o.appendChild(ip);
			o.appendChild(change);
			target.appendChild(o);
			return o;
		},
		text:function(target,levels,item) {
			var o=document.createElement("div");
			$(o).addClass("formItem");
			var val=this.base(arguments);
			var label=document.createElement("label");
			$(label).html(item.label);
			var description=document.createElement("span");
			$(description).html(item.description.replace(/\n/g,'<br />')).addClass("inputDescription");
			var ip=document.createElement("input");
			ip.type='text';
			ip.value=val;
			//ip.val=val;
			ip.item=item;
			ip.levels=levels;
			$(ip).addClass("hasLevels");
			if (item.required===true) $(ip).addClass("requiredValue");
			ip.update=function(){};
			if (item.affectButton===true) {
				ip.update=function() {
					var p=tube.ancester(this,'collapseContent');
					var b=$(p).prev('.collapseButton').find('>nobr');
					var t=this.value.replace(/[^a-z^0-9^ ]+/gi,'');
					b.html(t);
				};
				$(ip).addClass('affectButton');
			}
			$(ip).bind("keyup",function() {
				tube.setValue(this,this.levels,this.value);
				this.update();
			});
			o.appendChild(label);
			o.appendChild(description);
			o.appendChild(ip);
			target.appendChild(o);
			return o;
		},
		hidden:function(target,levels,item) {
			var val=this.base(arguments);
			var ip=document.createElement("div");
			$(ip).css({color:'#ddd',display:"none"}).html(val).addClass("itemId");
			target.appendChild(ip);
			return ip;
		},
		h4:function(target,levels,item) {
			var val=this.base(arguments);
			var ip=document.createElement("h4");
			$(ip).css({color:'#666'}).html(val);
			target.appendChild(ip);
			return ip;
		},
		textarea:function(target,levels,item) {
			var o=document.createElement("div");
			$(o).addClass("formItem");
			var val=this.base(arguments);
			var label=document.createElement("label");
			$(label).html(item.label);
			var description=document.createElement("span");
			$(description).html(item.description.replace(/\n/g,'<br />')).addClass("inputDescription");
			var ip=document.createElement("textarea");
			ip.value=val;
			ip.levels=levels;
			ip.item=item;
			if (item.required===true) $(ip).addClass("requiredValue");
			$(ip).addClass("hasLevels");
			$(ip).bind("keyup",function() {
				tube.setValue(this,this.levels,this.value);
			});
			o.appendChild(label);
			o.appendChild(description);
			o.appendChild(ip);
			target.appendChild(o);
			return o;
		},
		integer:function(target,levels,item) {
			var o=document.createElement("div");
			$(o).addClass("formItem");
			var val=this.base(arguments);
			var label=document.createElement("label");
			$(label).html(item.label);
			var description=document.createElement("span");
			$(description).html(item.description.replace(/\n/g,'<br />')).addClass("inputDescription");
			var ip=document.createElement("input");
			ip.type='text';
			ip.value=val;
			ip.levels=levels;
			ip.item=item;
			if (item.required===true) $(ip).addClass("requiredValue");
			if (item.notNull) {
				ip.notNull=item.notNull;
				ip.initial=item.initial;
			}
			$(ip).addClass("hasLevels integer");
			$(ip).bind("blur",function() {
				if (this.notNull && this.value=='') {
					this.value=this.initial;
					tube.setValue(this,this.levels,1*this.value);
				}
			});
			$(ip).bind("keydown",function(e) {
				var k=tube.keyCode(e);
				if (!k.numeric && !k.navigate) {
					e.preventDefault();
					return false;
				}
			});
			$(ip).bind("keyup",function() {
				tube.setValue(this,this.levels,1*this.value);
			});
			o.appendChild(label);
			o.appendChild(description);
			o.appendChild(ip);
			target.appendChild(o);
			return o;
		},
		decimal:function(target,levels,item) {
			var o=document.createElement("div");
			$(o).addClass("formItem");
			var val=this.base(arguments);
			var label=document.createElement("label");
			$(label).html(item.label);
			var description=document.createElement("span");
			$(description).html(item.description.replace(/\n/g,'<br />')).addClass("inputDescription");
			var ip=document.createElement("input");
			ip.type='text';
			ip.value=val;
			ip.levels=levels;
			ip.item=item;
			if (item.required===true) $(ip).addClass("requiredValue");
			$(ip).addClass("hasLevels decimal");
			$(ip).bind("keydown",function(e) {
				var hasPoint=/\./.test(this.value);
				var k=tube.keyCode(e);
				if (hasPoint && k.numeric) return true;
				if (k.navigate) return true;
				if (!hasPoint && k.decimal) return true;
				e.preventDefault();
				return false;
			});
			$(ip).bind("keyup",function() {
				tube.setValue(this,this.levels,1*this.value);
			});
			o.appendChild(label);
			o.appendChild(description);
			o.appendChild(ip);
			target.appendChild(o);
			return o;
		},
		tag:function(target,levels,item) {
			var o=document.createElement("div");
			$(o).addClass("formItem");
			var val=this.base(arguments);
			var label=document.createElement("label");
			$(label).html(item.label);
			var description=document.createElement("span");
			$(description).html(item.description).addClass("inputDescription");
			if (accessibleTags.length==0) {
				var ip=document.createElement("span");
				$(ip).html("No accessible Tags defined. They can be managed above.");
			}else{
				var ip=document.createElement("select");
				var selected=false;
				for(var s=0;s<accessibleTags.length;s++) {
					if (val==accessibleTags[s]) selected=true;
				}
				if (!selected && val!="") {
					var opt=document.createElement("option");
					opt.text=opt.value=val;
					opt.selected=true;
					ip.appendChild(opt);
				}
				for(var s=0;s<accessibleTags.length;s++) {
					var opt=document.createElement("option");
					opt.text=opt.value=accessibleTags[s];
					if (val==accessibleTags[s]) opt.selected=true;
					ip.appendChild(opt);
				}
				//ip.value=val;
				ip.levels=levels;
				ip.update=function(){};
				$(ip).addClass("hasLevels");
				$(ip).bind("change",function() {
					quizit.setValue(this,this.levels,this.value);
					this.update();
				});
				if (item.affectButton===true) {
					ip.update=function() {
						var p=quizit.ancester(this,'collapseContent');
						var b=$(p).prev('.collapseButton').find('>nobr');
						var t=this.value.replace(/[^a-z^0-9^ ]+/gi,'');
						b.html(t);
					};
					$(ip).addClass('affectButton');
				}
			}
			o.appendChild(label);
			o.appendChild(description);
			o.appendChild(ip);
			target.appendChild(o);
			return o;
		},
		select:function(target,levels,item) {
			var o=document.createElement("div");
			$(o).addClass("formItem");
			var val=this.base(arguments);
			var label=document.createElement("label");
			$(label).html(item.label);
			var description=document.createElement("span");
			$(description).html(item.description.replace(/\n/g,'<br />')).addClass("inputDescription");
			var ip=document.createElement("select");
			for(var s=0;s<item.options.length;s++) {
				var so=item.options[s];
				var opt=document.createElement("option");
				if (typeof(so)=="object") {
					opt.text=item.options[s].text;
					opt.value=item.options[s].value;
					if (val==item.options[s].value) opt.selected=true;
				}else{
					opt.text=opt.value=item.options[s];
					if (val==item.options[s]) opt.selected=true;
				}
				ip.appendChild(opt);
			}
			//ip.value=val;
			ip.levels=levels;
			$(ip).addClass("hasLevels");
			$(ip).bind("change",function() {
				tube.setValue(this,this.levels,this.value);
			});
			o.appendChild(label);
			o.appendChild(description);
			o.appendChild(ip);
			target.appendChild(o);
			return o;
		},
		boolean:function(target,levels,item) {
			var o=document.createElement("div");
			$(o).addClass("formItem");
			var val=this.base(arguments);
			var label=document.createElement("label");
			$(label).html(item.label);
			var description=document.createElement("span");
			$(description).html(item.description.replace(/\n/g,'<br />')).addClass("inputDescription");
			var ip=document.createElement("input");
			ip.type='checkbox';
			ip.checked=val;
			ip.levels=levels;
			$(ip).addClass("hasLevels");
			$(ip).bind("change",function() {
				tube.setValue(this,this.levels,this.checked);
			});
			o.appendChild(label);
			o.appendChild(description);
			o.appendChild(ip);
			target.appendChild(o);
			return o;
		},
		colour:function(target,levels,item) {
			var o=document.createElement("div");
			$(o).addClass("formItem");
			var val=this.base(arguments);
			var label=document.createElement("label");
			$(label).html(item.label);
			var description=document.createElement("span");
			$(description).html(item.description.replace(/\n/g,'<br />')).addClass("inputDescription");
			var ip=document.createElement("input");
			ip.type='text';
			ip.value=val;
			ip.levels=levels;
			$(ip).addClass("hasLevels colour");
			$(ip).bind("keyup",function() {
				tube.setValue(this,this.levels,this.value);
			});
			o.appendChild(label);
			o.appendChild(description);
			o.appendChild(ip);
			target.appendChild(o);
			$(ip).jPicker({images:{clientPath:'/js/jpicker/images/'},window:{position:{x:'0px',y:'0px'},expandable:true,liveUpdate:true}},function(colour,context) {
				tube.setValue(this,this.levels,this.value);
			});
			return o;
		},
		shuffle:function(target,levels,item) {
			var o=document.createElement("div");
			$(o).addClass("formItem");
			if (item.className) $(o).addClass(item.className);
			var val=this.base(arguments);
			var label=document.createElement("label");
			$(label).html(item.label);
			var description=document.createElement("span");
			$(description).html(item.description.replace(/\n/g,'<br />')).addClass("inputDescription");
			var sel=document.createElement("select");
			o.selector=sel;
			sel.levels=levels;
			sel.val=val;
			$(sel).addClass("hasLevels");
			o.update=function() {
				this.selector.val=tube.levelValue(this.selector.levels);
				this.draw();
			};
			o.draw=function() {
				while(this.selector.childNodes.length>0) this.selector.removeChild(this.selector.childNodes[0]);
				var page=tube.levelValue([this.selector.levels[0],this.selector.levels[1],this.selector.levels[2]]);
				var l=(page.questions==undefined)?0:page.questions.length;
				var vals=['None'];
				if (l>1) {
					for(var i=1;i<l;i++) vals.push(i);
					vals.push('All');
				}
				for(var i=0;i<vals.length;i++) {
					var oo=document.createElement("option");
					oo.text=oo.value=vals[i];
					if (vals[i]==this.selector.val) oo.selected=true;
					this.selector.appendChild(oo);
				}
			};
			$(sel).bind("change",function() {
				this.val=$(this).val();
				tube.setValue(this,this.levels,this.val);
			});
			o.draw();
			o.appendChild(label);
			o.appendChild(description);
			o.appendChild(sel);
			target.appendChild(o);
			return o;
		},
		maximum:function(target,levels,item) {
			var o=document.createElement("div");
			$(o).addClass("formItem");
			if (item.className) $(o).addClass(item.className);
			var val=this.base(arguments);
			var label=document.createElement("label");
			$(label).html(item.label);
			var description=document.createElement("span");
			$(description).html(item.description.replace(/\n/g,'<br />')).addClass("inputDescription");
			var sel=document.createElement("select");
			o.selector=sel;
			sel.levels=levels;
			sel.val=val;
			$(sel).addClass("hasLevels");
			o.update=function() {
				this.selector.val=tube.levelValue(this.selector.levels);
				this.draw();
			};
			o.draw=function() {
				while(this.selector.childNodes.length>0) this.selector.removeChild(this.selector.childNodes[0]);
				var levels=[];
				for(var i=0;i<this.selector.levels.length-1;i++) levels.push(this.selector.levels[i]);
				var multichoice=tube.levelValue(levels);
				var l=(multichoice.options==undefined)?0:multichoice.options.length;
				if (this.selector.val>l && l>0) {
					this.selector.val=l;
					tube.setValue(this.selector,this.selector.levels,this.selector.val);
				}
				var vals=[];
				for(var i=0;i<l;i++) vals.push(i+1);
				for(var i=0;i<vals.length;i++) {
					var oo=document.createElement("option");
					oo.text=oo.value=vals[i];
					if (vals[i]==this.selector.val) oo.selected=true;
					this.selector.appendChild(oo);
				}
			};
			$(sel).bind("change",function() {
				this.val=$(this).val();
				tube.setValue(this,this.levels,this.val);
			});
			o.draw();
			o.appendChild(label);
			o.appendChild(description);
			o.appendChild(sel);
			target.appendChild(o);
			return o;
		},
		questions:function(target,levels,item) {
//console.log(levels,item);
			var o=document.createElement("div");
			$(o).addClass("formItem");
			$(o).addClass("formItemUpdate");
			var val=this.base(arguments);
//console.log(val);
			o.change=item.onchange;
			$(o).addClass("callOnDelete");
			o.update=function() {
				if (typeof(this.change)=="string") {
					try{
						eval(this.change);
					}catch(e){}
				}else if (typeof(this.change)=="function") {
					this.change();
				}
			};
			var label=document.createElement("h4");
			$(label).html('Questions');
			var button=document.createElement("button");
			button.type="button";
			button.src=val;
			button.levels=levels;
			button.item=item;
			if (item.required===true) $(o).addClass("requiredChildren");
			$(button).addClass("hasLevels add");
			$(button).html("add").bind("click",function() {
				var type=$(this).prev().val();
				if (type!="") {
					var index=this.src.length;
					var oo=document.createElement("div");
					$(oo).addClass("indexed");
					oo.levels=this.levels.concat([index]);
					$(oo).addClass("hasLevels");
					for(var k in tube.schema.questions[type]) {
						if (tube.object[tube.schema.questions[type][k].type]!==undefined) {
							var o=tube.object[tube.schema.questions[type][k].type](oo,this.levels.concat([index,k]),tube.schema.questions[type][k]);
						}else{
							var o=tube.object.render(oo,this.levels.concat([index,k]),tube.schema.questions[type][k]);
						}
					}
					var ab=$(oo).find('.affectButton').get();
					oo=tube.collapsible((ab.length>0)?ab[0].value:'Question',oo,{className:'question '+type+'Type',sortable:true,deleteable:true});
					if (tube.schema.questions[type].type.update!==undefined) {
						oo.updateClass=tube.schema.questions[type].type.update;
						oo.update=function() {
							$(this).find('.'+this.updateClass).each(function(i,e) {
								if (e.update!==undefined) e.update();
							});
						};
					}
					$(oo).css({display:"none"});
					this.parentNode.appendChild(oo);
					$(oo).slideDown();
					var fi=tube.ancester(this,'formItemUpdate');
					fi.update();
				}
			});

			var sel=tube.questionTypeSelector();
			o.appendChild(label);
			o.appendChild(sel);
			o.appendChild(button);
			for(var q=0;q<val.length;q++) {
				var oo=document.createElement("div");
				$(oo).addClass("indexed");
				oo.levels=levels.concat([q]);
				$(oo).addClass("hasLevels");
				var sch=tube.schema.questions[val[q].type.replace(/ /g,'')];
				for(var k in sch) {
					if (tube.object[sch[k].type]!==undefined) {
						var ob=tube.object[sch[k].type](oo,levels.concat([q,k]),sch[k]);
					}else{
						var ob=tube.object.render(oo,levels.concat([q,k]),sch[k]);
					}
				}
				var ab=$(oo).find('.affectButton').get();
				oo=tube.collapsible((ab.length>0)?ab[0].value:'Question',oo,{className:'question '+val[q].type.replace(/ /g,'')+'Type',sortable:true,deleteable:true});
				if (sch.type && sch.type.update) {
					$(oo).addClass("callOnDelete");
					oo.updateClass=sch.type.update;
					oo.update=function() {
						$(this).find('.'+this.updateClass).each(function(i,e) {
							if (e.update) e.update();
						});
					};
				}
				o.appendChild(oo);
			}
			o.levels=levels;
			$(o).addClass("hasLevels");
			target.appendChild(o);
			tube.sortable(o,'.question','>.collapseButton .mover',function(e,ui) {tube.updateOrder(e,ui,'question');});
			return o;
		}
	},
	stationSelector:function(ip,current,label,levels,type) {
		this.map.selection={
			was:current,
			input:ip,
			label:label,
			levels:levels,
			type:type
		};
		$(this.containers.tubemapTitle).html("Select "+label+" below");
		if (current!="") this.centerMap(current);
		this.scrollToMap();
	},
	centerMap:function(osn) {
		this.map.offsetX=Math.round((this.map.width/2)-tube.stations[osn].x);
		this.map.offsetY=Math.round((this.map.height/2)-tube.stations[osn].y);
		$(this.paper.canvas).animate({left:this.map.offsetX+"px",top:this.map.offsetY+"px"},{duration:500});
	},
	scrollToMap:function() {
		$('html,body').animate({scrollTop:$(this.containers.tubeMap).offset().top-50});
	},
	scrollTo:function(o) {
		$('html,body').animate({scrollTop:$(o).offset().top-50});
	},
	removeStation:function(s) {
		this.map.selection=null;
		$(this.containers.tubemapTitle).html("Select a Station input above, then choose the Station below");
		if (s.station!="") this.stations[s.station].button.attr({fill:this.map.station.fill,stroke:this.map.station.stroke,'stroke-width':this.map.station['stroke-width']});
		this.calculate();
	},
	isSelected:function(s) {
		if (this.value.main.stationA==s) return true;
		if (this.value.main.stationB==s) return true;
		for(var c=0;c<this.value.main.closedStations.length;c++) {
			if (this.value.main.closedStations[c].station==s) return true;
		}
		return false;
	},
	drawMap:function() {
		
		this.map.padding=10;
		var w=$('.exerciseTemplate').width();
		var h=w/2;
		var pplat=(h-(2*this.map.padding))/(this.dims.lat.maxlat-this.dims.lat.minlat);
		var pplon=(w-(2*this.map.padding))/(this.dims.lon.maxlon-this.dims.lon.minlon);
		var pixelPerLat=pplat;
		if (pplon<pplat) pixelPerLat=pplon;
		this.map.ppll=pixelPerLat;
		this.map.width=Math.floor(w);
		this.map.height=Math.floor(h);
		this.containers.tubeMap=$('.tubemap').get(0);
		this.paper = Raphael(0, 0, Math.round(this.map.width*this.map.zoom),Math.round(this.map.height*this.map.zoom));
		$(this.paper.canvas).css("position","relative");
		this.map.offsetX=(this.map.width/2)-((this.map.width*this.map.zoom)/2);
		this.map.offsetY=(this.map.height/2)-((this.map.height*this.map.zoom)/2);
		$(this.paper.canvas).css("left",this.map.offsetX+"px");
		$(this.paper.canvas).css("top",this.map.offsetY+"px");
		this.stationLabel=document.createElement("div");
		$(this.stationLabel).addClass("stationLabel");
		$(this.stationLabel).css("display","none");
		this.containers.tubeMap.appendChild(this.stationLabel);
		this.containers.tubeMap.appendChild(this.paper.canvas);
		$(this.containers.tubeMap).css("width",this.map.width+"px");
		$(this.containers.tubeMap).css("height",this.map.height+"px");
		$(this.containers.tubeMap).css("overflow",'hidden');
		//$(this.tubemap).css("position","relative");
		this.stationLinks={};
		for(var l=0;l<tubeData.lines.length;l++) {
			if (this.indexNames[tubeData.lines[l][0]]!='' && this.indexNames[tubeData.lines[l][1]]!='') {
				if (this.stationLinks[this.indexNames[tubeData.lines[l][0]]]==undefined) this.stationLinks[this.indexNames[tubeData.lines[l][0]]]=[];
				if (this.stationLinks[this.indexNames[tubeData.lines[l][1]]]==undefined) this.stationLinks[this.indexNames[tubeData.lines[l][1]]]=[];
				this.stationLinks[this.indexNames[tubeData.lines[l][0]]].push(this.indexNames[tubeData.lines[l][1]]);
				this.stationLinks[this.indexNames[tubeData.lines[l][1]]].push(this.indexNames[tubeData.lines[l][0]]);
				var station1=this.stations[this.indexNames[tubeData.lines[l][0]]];
				var station2=this.stations[this.indexNames[tubeData.lines[l][1]]];
				var route=this.routes[this.indexRoutes[tubeData.lines[l][2]]];

				var y1=this.map.height-this.map.padding-Math.round(this.map.ppll*(station1.latitude-this.dims.lat.minlat));
				var x1=this.map.padding+Math.round(this.map.ppll*(station1.longitude-this.dims.lon.minlon));
				var y2=this.map.height-this.map.padding-Math.round(this.map.ppll*(station2.latitude-this.dims.lat.minlat));
				var x2=this.map.padding+Math.round(this.map.ppll*(station2.longitude-this.dims.lon.minlon));
				x1=Math.round(x1*this.map.zoom);
				x2=Math.round(x2*this.map.zoom);
				y1=Math.round(y1*this.map.zoom);
				y2=Math.round(y2*this.map.zoom);
				var st=this.paper.path('M'+x1+","+y1+"L"+x2+","+y2);
				st.attr({stroke:this.map.lineBackgroundColour,'stroke-width':this.map.lineBackgroundWidth});
				var st=this.paper.path('M'+x1+","+y1+"L"+x2+","+y2);
				st.attr({stroke:'#'+route.colour,'stroke-width':Math.round(this.map.lineWidth)});
				if (route.stripe!==null) {
					var st=this.paper.path('M'+x1+","+y1+"L"+x2+","+y2);
					st.attr({'stroke-dasharray':'-',stroke:'#'+route.stripe,'stroke-width':Math.round(this.map.lineWidth)});
				}
			}
		}
		for(var s in this.stations) {
			var y=Math.round((this.map.height-this.map.padding-Math.round(this.map.ppll*(this.stations[s].latitude-this.dims.lat.minlat)))*this.map.zoom);
			var x=Math.round((this.map.padding+Math.round(this.map.ppll*(this.stations[s].longitude-this.dims.lon.minlon)))*this.map.zoom);
			this.stations[s].x=x;
			this.stations[s].y=y;
			var st=this.paper.circle(x,y,Math.round(this.map.dotBackgroundRadius));
			st.attr({fill:this.map.dotBackgroundColour,stroke:this.map.selectedStroke.stroke,'stroke-width':0});


			var st=this.paper.circle(x,y,Math.round(this.map.dotRadius));
			st.stationName=s;
			//st.clickable=false;
			if (s==this.value.main.stationA || s==this.value.main.stationB) {
				st.attr({fill:this.map.selectedStroke.fill,stroke:this.map.selectedStroke.stroke,'stroke-width':Math.round(this.map.selectedStroke['stroke-width'])});
			}else if (this.isClosed(s)) {
				st.attr({fill:this.map.closedStroke.fill,stroke:this.map.closedStroke.stroke,'stroke-width':Math.round(this.map.closedStroke['stroke-width'])});
			}else{
				st.attr({fill:this.map.station.fill,stroke:this.map.station.stroke,'stroke-width':Math.round(this.map.station['stroke-width'])});
				//st.clickable=true;
			}
			//st.attr({fill:'#fff',stroke:'#666','stroke-width':1});
			this.stations[s].button=st;
			st.mouseover(function() {
				$(tube.stationLabel).css("top","0px");
				$(tube.stationLabel).css("left","0px");
				$(tube.stationLabel).css("visibility","hidden");
				$(tube.stationLabel).css("display","block");
				//if (tube.available(this.stationName)) {
					$(tube.stationLabel).html(tube.stations[this.stationName].name);
				//}else{
				//	$(tube.stationLabel).html(tube.stations[this.stationName].name+"<br />Not connected to "+((tube.route.selected.length==0)?tube.route.from:tube.route.selected[tube.route.selected.length-1]));
				//}
				var w=$(tube.stationLabel).outerWidth();
				var ty=tube.stations[this.stationName].y-tube.map.padding-24;
				var tx=(tube.stations[this.stationName].x-Math.round(w/2));
				tx+=tube.map.offsetX;
				ty+=tube.map.offsetY-20;
				if (ty<0) ty+=100;
				if (tx<0) tx=0;
				if (tx>tube.map.width-w) tx=tube.map.width-w;
				$(tube.stationLabel).css("top",ty+"px");
				$(tube.stationLabel).css("left",tx+"px");
				$(tube.stationLabel).css("visibility","visible");
				if (!this.enroute && this.clickable) this.attr("fill","#f00");
			});
			st.mouseout(function() {
				$(tube.stationLabel).css("display","none");
				if (!this.enroute && this.clickable) this.attr("fill",tube.map.station.fill);
			});
			st.click(function() {
				if (tube.map.selection!==null) {
					if (!tube.isSelected(this.stationName)) {
						$(tube.stationLabel).css("display","none");
						if (tube.map.selection.was!="") {
							tube.stations[tube.map.selection.was].button.attr({
								fill:tube.map.station.fill,
								stroke:tube.map.station.stroke,
								'stroke-width':tube.map.station['stroke-width']
							});
						}
						this.attr({
							fill:tube.map[tube.map.selection.type].fill,
							stroke:tube.map[tube.map.selection.type].stroke,
							'stroke-width':tube.map[tube.map.selection.type]['stroke-width']
						});
						tube.map.selection.input.value=this.stationName;
						tube.setValue(tube.map.selection.input,tube.map.selection.levels,this.stationName);
						tube.map.selection.was=this.stationName;
						tube.centerMap(this.stationName);
						tube.scrollTo(tube.map.selection.input);
						tube.calculate();
					}
				}
			});
		
		}
		//this.center(this.route.from);
		$(this.paper.canvas).bind("mousedown",function(e) {
			if (e.target==this) {
				e.preventDefault();
				tube.downLocation={x:e.pageX,y:e.pageY};
				$(window).bind("mousemove",mapMoveDrag=function(e) {
					e.preventDefault();
					var dl={x:e.pageX,y:e.pageY};
					tube.map.offsetX+=dl.x-tube.downLocation.x;
					tube.map.offsetY+=dl.y-tube.downLocation.y;
					tube.downLocation=dl;
					if (tube.map.offsetX>0) tube.map.offsetX=0;
					if (tube.map.offsetY>0) tube.map.offsetY=0;
					var mx=Math.round(tube.map.width-(tube.map.width*tube.map.zoom));
					var my=Math.round(tube.map.height-(tube.map.height*tube.map.zoom));
					if (tube.map.offsetX<mx) tube.map.offsetX=mx;
					if (tube.map.offsetY<my) tube.map.offsetY=my;
					$(tube.paper.canvas).css({left:tube.map.offsetX+"px",top:tube.map.offsetY+"px"});
				});
				$(window).bind("mouseup",mapUpDrag=function(e) {
					$(window).unbind("mouseup",mapUpDrag);
					$(window).unbind("mousemove",mapMoveDrag);
				});
			}
		});
	},
	isClosed:function(s) {
		for(var i=0;i<this.value.main.closedStations.length;i++) {
			if (this.value.main.closedStations[i].station==s) return true;
		}
		return false;
	},
	deleteItem:function(o) {
		var ondelete='';
		if (arguments.length>1) ondelete=arguments[1];
		var item=tube.ancester(o,'hasLevels');
		var removeItem=item;
		if ($(item.parentNode).hasClass("collapseContent")) removeItem=item.parentNode.parentNode;
		var callOnDelete=tube.ancester(removeItem.parentNode,'callOnDelete');
		var indexes=[];
		for(var l=0;l<item.levels.length-1;l++) {
			if (isNaN(item.levels[l])) {
				indexes.push("'"+item.levels[l]+"'");
			}else{
				indexes.push(""+item.levels[l]+"");
			}
		}
		var i=item.levels[item.levels.length-1];
		//try{
			//var list=tube.value;
//console.log(indexes);
			//for(var ii=0;ii<indexes.length;ii++) {
//console.log(list);
			//	list=list[indexes[ii]];
			//}
			//eval('list=tube.value['+indexes.join('][')+'];');
			if (ondelete!="") eval(ondelete+'(tube.value['+indexes.join('][')+'][i]);');

			var cmd='tube.value['+indexes.join('][')+'].splice('+i+',1);';
			eval(cmd);
//console.log(cmd);
//console.log(list);
			//list.splice(i,1);
			$(item).find('button').unbind("click");
			var fi=tube.ancester(item,'formItem');
			if (fi.update) fi.update();
			if ($(removeItem).hasClass("hasLevels")) {
				tube.updateLevelIndex($(removeItem).siblings('.hasLevels').get());
			}else{
				tube.updateLevelIndex($(removeItem).siblings().find('>div>div.hasLevels').get());
			}
			$(removeItem).slideUp(500,function() {
				var parent=this.parentNode;
				$(this).remove();
				if ($(callOnDelete).hasClass('callOnDelete')) {
					callOnDelete.update();
				}else{
				}
			});
		//}catch(e){}
	},
	updateLevelIndex:function(items) {
//console.log(items);
		var iii=0;
		for(var i=0;i<items.length;i++) {
//console.log(items[i]);
			if ($(items[i]).hasClass("hasLevels") && !$(items[i]).hasClass("add")) {
				var ii=items[i].levels.length-1;
//console.log("Change index "+ii);
				if (items[i].levels[ii]!=iii) {
					items[i].levels[ii]=iii;
					$(items[i]).find(".hasLevels").each(function(j,e) {
						e.levels[ii]=iii;
//console.log("Change index "+ii+" to "+iii);
					});
				}
				iii++;
			}
		}
	},
	updateOrder:function(e,ui,className) {
		var item=ui.item;
		var id=item.find('>div>div>div.itemId').html();
		var newIndex=item.prevAll('.'+className).get().length;
		var levels=item.parent().find('>button').get(0).levels;
		var list=[];
		var indexes=[];
		for(var l=0;l<levels.length;l++) {
			if (isNaN(levels[l])) {
				indexes.push("'"+levels[l]+"'");
			}else{
				indexes.push(""+levels[l]+"");
			}
		}
		try{
			var oldIndex=0;
			eval('list=tube.value['+indexes.join('][')+'];');
			for(var i=0;i<list.length;i++) {
				if (list[i].id==id) oldIndex=i;
			}
			var page=list.splice(oldIndex,1);
			list.splice(newIndex,0,page[0]);
		}catch(e){}
		tube.rebuildOrderIndexes(item);
	},
	rebuildOrderIndexes:function(item) {
//console.log(item);
		var os=$(item).parent().find('>.tube_sortable>.collapseContent>.hasLevels.indexed').get();
//console.log(os);
		tube.updateLevelIndex(os);
		/*$(item).parent().find('>.tube_sortable>.collapseContent>.hasLevels.indexed').each(function(i,o) {
			if (typeof(o.levels)=="object" && o.levels.length>0 && !isNaN(o.levels[o.levels.length-1])) {
				var levelIndex=o.levels.length-1;
				o.levels[levelIndex]=i;
				$(o).find(".hasLevels").each(function(ii,oo) {
					if (typeof(oo.levels)=="object" && oo.levels.length>levelIndex && !isNaN(oo.levels[levelIndex])) {
						oo.levels[levelIndex]=i;
					}
				});
			}
		});*/
	},
	uniqueId:function() {
		var id=this.randomString();
		while(tube.idExists(id)) id=this.randomString();
		return id;
	},
	idExists:function(id) {
		return (typeof(tube.ids[id])!="undefined");
	},
	randomString:function() {
		var length=20;
		var chars='abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
		var op='';
		while(op.length<length) op+=chars.substr(Math.round(Math.random()*(chars.length-1)),1);
		return op;
	},
	questionTypeSelector:function() {
		var o=document.createElement("select");
		var oo=document.createElement("option");
		oo.value='';
		oo.text="Select a question type...";
		o.appendChild(oo);
		for(var t in this.schema.questions) {
			var oo=document.createElement("option");
			oo.value=t;
			oo.text=this.schema.questions[t].type.initial;
			o.appendChild(oo);
		}
		$(o).addClass("questionSelect");
		return o;
	},
	setValue:function(src,levels,value) {
		var stack=[];
		if (!isNaN(levels[levels.length-1])) levels[levels.length-1]=$(tube.ancester(src,'indexed')).prevAll('.indexed').get().length;
		for(var l=0;l<levels.length;l++) {
			if (isNaN(levels[l])) {
				stack.push("'"+levels[l]+"'");
			}else{
				stack.push(levels[l]);
			}
		}
		try{
			eval('tube.value['+stack.join('][')+']=value;');
		}catch(e){}
		if (tube.autosave) tube.saveLocal();
	},
	ancester:function(o,c) {
		if ($(o).hasClass(c)) return o;
		if (o==document.body) return false;
		if (!o.parentNode) return false;
		return tube.ancester(o.parentNode,c);
	},
	collapsible:function(title,content) {
		var className=null;
		var props={};
		if (arguments.length>2) props=arguments[2];
		if (props['className']!==undefined) className=props['className'];
		var add='';
		if (props['sortable']===true) add='<div class="mover">&nbsp;</div>';
		var o=document.createElement("div");
		var t=document.createElement("div");
		var c=document.createElement("div");
		$(t).addClass("collapseButton").bind("click",function() {
			if ($(this).hasClass("open")) {
				$(this).removeClass("open");
				$(this).next().removeClass("open").slideUp();
			}else{
				$(this.parentNode.parentNode).find('>div>.collapseButton.open').removeClass("open");
				$(this.parentNode.parentNode).find('>div>.collapseContent.open').removeClass("open").slideUp();
				$(this).addClass("open");
				$(this).next().addClass("open").slideDown();
			}
		}).html(add+'<nobr>'+title+'</nobr>');
		$(c).addClass("collapseContent").css({display:"none"});
		if (props.deleteable===true) {
			var but=document.createElement("button");
			but.type="button";
			$(but).html("delete").addClass("delete");
			$(but).bind("click",function() {
				tube.deleteItem(this);
			});
			content.insertBefore(but,content.childNodes[0]);
		}
		c.appendChild(content);
		o.appendChild(t);
		o.appendChild(c);
		if (className!==null) $(o).addClass(className);
		if (props['sortable']===true) $(o).addClass('tube_sortable');
		return o;
	},
	sortable:function(container,items,handles,update) {
		$(container).sortable("destroy");
		$(container).sortable({items:items,handle:handles,update:update});
	},
	save:function(e) {
		var err=tube.validate();
		tube.clearLocal();
		if (err.length==0) {
			$('textarea#globalFieldContent').val(json.build(this.value));
			$('textarea#display').val(this.layout);
			return true;
		}else{
			alert(err.join("\n"));
			e.preventDefault();
			return false;
		}
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
