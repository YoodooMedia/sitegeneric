dooit.temporaries('tube');
var tube={
	selectors:{
		container:'.tube'
	},
	containers:{
		container:null,
		pages:null,
		timer:null
	},
	completed:false,
	dooitComplete:false,
	navigable:false,
	canAutoProgress:false,
	page:-1,
	startTime:null,
	structure:{},
	value:null,
	key:null,
	valuekey:null,
	fields:{},
	status:{},
	scrolledAreaOverflow:'',
	stations:{},
	routes:{},
	zone:3,
	map:{
		width:0,
		height:0,
		ppll:0,
		zoom:2.5,
		lineWidth:2,
		lineBackgroundWidth:5,
		lineBackgroundColour:'#fff',
		dotBackgroundRadius:10,
		dotBackgroundColour:'#fff',
		dotRadius:5,
		currentStation:{
			'stroke-width':3,
			'stroke':'#f00',
			'fill':'#0f0'
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
	route:{
		selected:[]
	},
	init:function() {
		this.scrolledAreaOverflow=$('#scrolledAreaOverflow').css("overflow");
		dooit.canSnapshot=false;
		dooit.saved=false;
		if (arguments.length>0) this.transposeOptions([],arguments[0]);
		if (arguments.length>1) {
			this.structure=arguments[1];
		}else{
			this.loadFields();
		}
		this.containers.container=$(this.selectors.container);
		if (this.key!==null && this.containers.container!==null) {
			dooit.displayed=tube.displayed;
			if (this.structure.title==undefined || this.structure.title==null || this.structure.title=='') this.structure.title=yoodoo.dooittitle;
			if (this.structure.paragraph==undefined || this.structure.paragraph==null || this.structure.paragraph=='') this.structure.paragraph=yoodoo.dooitteaser;
			this.containers.container.empty();
			var h2=document.createElement("h2");
			$(h2).html(this.doReplacements(this.structure.title));
			this.containers.container.append(h2);
			if (this.structure.paragraph!="") {
				var p=document.createElement("p");
				$(p).html(this.doReplacements(this.structure.paragraph));
				this.containers.container.append(p);
			}
			this.containers.map=document.createElement("div");
			$(this.containers.map).addClass("tube_display_area");
			this.containers.container.append(this.containers.map);
			this.checkUser();
		}
		if (tubeData!=undefined) {
			this.loadData();
			//this.build();
		}
	},
	restart:function() {
		this.value.route=[];
		this.value.score=0;
		this.value.passed=false;
		this.route.selected=[];
		$(this.containers.map).empty();
		tube.build();
	},
	displayed:function() {
		var mh=$('#yoodooScrolledArea').height()-8;
		var h=mh-($(tube.containers.map).offset().top-tube.containers.container.offset().top);
		tube.map.height=h;
		tube.map.width=$(tube.containers.map).width();
		$(tube.containers.map).css({'height':h,width:tube.map.width});
		tube.build();
		tube.calculate();
		if (tube.value.passed===true) tube.displayComplete();
	},
	checkUser:function() {
		if (this.value.passed!==undefined) {
			this.completed=true;
			//this.displayComplete();
		}else{
			this.value={passed:false,score:0,route:[]};
		}
	},
	scrollTo:function(scrollObject) {
		if (scrollObject!==null && typeof(scrollObject)!=="undefined") {
			var qq=dooit.parentElement(scrollObject,'tube_question');
			var fq=$(qq.parentNode).find('.tube_question').get();
			if (fq.length==0) {
				fq=qq;
			}else{
				fq=fq[0];
			}
			var st=$(qq).position().top-$(fq).position().top;
			var h=this.containers.pages.height()-$(qq).outerHeight(true);
			if (h<0) h=0;
			st-=(h*0.1);
			this.containers.pages.animate({scrollTop:st});
		}
	},
	isNotEmpty:function(str) {
		return str!==undefined && str!==null && str!="";
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
	doReplacements:function(txt) {
		txt=txt.replace(/\{minStations\}/g,this.minStations);
		txt=txt.replace(/\{stationA\}/g,this.structure.stationA);
		if (this.value.score!==undefined) txt=txt.replace(/\{score\}/g,this.value.score);
		txt=txt.replace(/\{stationB\}/g,this.structure.stationB);
		if (this.value.score!==undefined) {
			txt=txt.replace(/\{stations\}/g,this.value.score);
		}else{
			txt=txt.replace(/\{stations\}/g,'0');
		}
		var allClosed='';
		if (this.structure.closedStations.length>0) {
			var closed=[];
			for(var i=0;i<this.structure.closedStations.length;i++) {
				closed.push(this.structure.closedStations[i].station);
			}
			var ls=closed.pop();
			allClosed=closed.join(", ");
			allClosed+=((closed.length>0)?" and ":"")+ls;
		}
		txt=txt.replace(/\{avoiding\}/g,allClosed);
		var via='';
		if (this.value!==undefined && this.value.route!==undefined && this.value.route.length>0) {
			var v=[];
			for(var i=0;i<this.value.route.length;i++) {
				v.push(this.value.route[i]);
			}
			var ls=v.pop();
			via=v.join(", ");
			via+=((v.length>0)?" and ":"")+ls;
		}
		txt=txt.replace(/\{route\}/g,via);
		txt=txt.replace(/\r/g,'');
		txt=txt.replace(/\n/g,'<br />');
		return txt;
	},
	flags:[null,null],
	build:function() {

		var ins='';
		//ins+="<div class='headingDiv'><h2>"+this.doReplacements(this.structure.title)+"</h2>";
		//if (this.structure.paragraph!="") ins+="<p>"+this.doReplacements(this.structure.paragraph)+"</p>";
		//ins+"</div>";
		//ins+="<div class='tubemap'></div>";
		//$(this.containers.container).html(ins);

		this.map.padding=10;
		//var dw=$('.dooitBox').width()-$('.dooitBox').outerWidth();
		//var dh=$('.dooitBox').height()-$('.dooitBox').outerHeight();
		//var h=$('#yoodooScrolledArea').height()+dh-$('.headingDiv').outerHeight(true);
		//var w=$('#yoodooScrolledArea').width()+dw;
		var pplat=(this.map.height-(2*this.map.padding))/(this.dims.lat.maxlat-this.dims.lat.minlat);
		var pplon=(this.map.width-(2*this.map.padding))/(this.dims.lon.maxlon-this.dims.lon.minlon);
		var pixelPerLat=pplat;
		if (pplon<pplat) pixelPerLat=pplon;
		this.map.ppll=pixelPerLat;
		//this.map.width=Math.floor(w);
		//this.map.height=Math.floor(h);
		//this.containers.map=$('.tubemap').get(0);
		this.paper = Raphael(0, 0, Math.round(this.map.width*this.map.zoom),Math.round(this.map.height*this.map.zoom));
		//$(this.paper.canvas).css("position","relative");
		this.map.offsetX=(this.map.width/2)-((this.map.width*this.map.zoom)/2);
		this.map.offsetY=(this.map.height/2)-((this.map.height*this.map.zoom)/2);
		//$(this.paper.canvas).css("left",this.map.offsetX+"px");
		//$(this.paper.canvas).css("top",this.map.offsetY+"px");
		this.stationLabel=document.createElement("div");
		$(this.stationLabel).addClass("stationLabel");
		$(this.stationLabel).css("display","none");
		this.containers.mapScroll=document.createElement("div");
		$(this.containers.mapScroll).css({left:this.map.offsetX+"px",top:this.map.offsetY+"px",position:"relative",width:Math.round(this.map.width*this.map.zoom),height:Math.round(this.map.height*this.map.zoom)});
		this.containers.mapScroll.appendChild(this.stationLabel);
		this.flags=[document.createElement("div"),document.createElement("div")];
		$(this.flags[0]).html("start").addClass("stationLabel").addClass("stationStart");
		$(this.flags[1]).html("destination").addClass("stationLabel").addClass("stationDestination");
		this.containers.mapScroll.appendChild(this.flags[0]);
		this.containers.mapScroll.appendChild(this.flags[1]);
		this.containers.mapScroll.appendChild(this.paper.canvas);
		this.containers.map.appendChild(this.containers.mapScroll);
		$(this.containers.map).css("width",this.map.width+"px");
		$(this.containers.map).css("height",this.map.height+"px");
		$(this.containers.map).css("overflow",'hidden');
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
			this.stations[s].dot=st;
			st.stationName=s;
			st.clickable=false;
			if (s==this.structure.stationA) {
				this.flags[0].x=x-($(this.flags[0]).outerWidth(false)/2);
				this.flags[0].y=y-30;
				$(this.flags[0]).css({left:this.flags[0].x,top:this.flags[0].y});
			}
			if (s==this.structure.stationB) {
				this.flags[1].x=x-($(this.flags[1]).outerWidth(false)/2);
				this.flags[1].y=y-30;
				$(this.flags[1]).css({left:this.flags[1].x,top:this.flags[1].y});
			}
			if (s==this.structure.stationA || s==this.structure.stationB || this.isSelected(s)) {
				st.attr({fill:this.map.selectedStroke.fill,stroke:this.map.selectedStroke.stroke,'stroke-width':Math.round(this.map.selectedStroke['stroke-width'])});
			}else if (this.isClosed(s)) {
				st.attr({fill:this.map.closedStroke.fill,stroke:this.map.closedStroke.stroke,'stroke-width':Math.round(this.map.closedStroke['stroke-width'])});
			}else{
				st.attr({fill:this.map.station.fill,stroke:this.map.station.stroke,'stroke-width':Math.round(this.map.station['stroke-width'])});
				st.clickable=true;
			}
			//st.attr({fill:'#fff',stroke:'#666','stroke-width':1});
			st.mouseover(function() {
				$(tube.stationLabel).css("top","0px");
				$(tube.stationLabel).css("left","0px");
				$(tube.stationLabel).css("visibility","hidden");
				$(tube.stationLabel).css("display","block");
				if (tube.available(this.stationName)) {
					$(tube.stationLabel).html(tube.stations[this.stationName].name);
				}else{
					$(tube.stationLabel).html(tube.stations[this.stationName].name+"<br />Not connected to "+((tube.route.selected.length==0)?tube.structure.stationA:tube.route.selected[tube.route.selected.length-1]));
				}
				var w=$(tube.stationLabel).outerWidth();
				var h=$(tube.stationLabel).outerHeight();
				//var x=tube.stations[this.stationName].x
				var ty=tube.stations[this.stationName].y-tube.map.padding-h-10;
				var tx=(tube.stations[this.stationName].x-tube.map.padding-Math.round(w/2));
				//tx+=tube.map.offsetX;
				//ty+=tube.map.offsetY-20;
//console.log(tx,ty);
				if (ty<0) ty+=100;
				if (tx<0) tx=0;
				var mw=$(tube.containers.mapScroll).width();
				if (tx>mw-w) tx=mw-w;
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
				$(tube.stationLabel).css("display","none");
				if (this.clickable) tube.addToRoute(this);
				tube.center(this.stationName);
			});
		
		}
		this.center(this.structure.stationA);
		$(this.containers.mapScroll).bind("mousedown",function(e) {
			//if (e.target==this) {
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
					$(tube.containers.mapScroll).css({left:tube.map.offsetX+"px",top:tube.map.offsetY+"px"});
				});
				$(window).bind("mouseup",mapUpDrag=function(e) {
					$(window).unbind("mouseup",mapUpDrag);
					$(window).unbind("mousemove",mapMoveDrag);
				});
			//}
		});
		$(this.containers.mapScroll).bind("mousemove",function(e) {
			var pos=$(tube.containers.map).offset();
			var loc={x:e.pageX-tube.map.offsetX-pos.left,y:e.pageY-tube.map.offsetY-pos.top};
			for(var f=0;f<tube.flags.length;f++) {
				var h=Math.sqrt(Math.pow(tube.flags[f].x-loc.x,2)+Math.pow(tube.flags[f].y-loc.y,2))-100;
				if (h<0) h=0;
				if (h>200) h=200;
				h/=200;
				if (h==0) {
					$(tube.flags[f]).css({display:'none'});
				}else{
					$(tube.flags[f]).css({opacity:h,display:'block'});
				}
			}
		});
	},
	isClosed:function(s){
		for(var i=0;i<this.structure.closedStations.length;i++) {
			if (this.structure.closedStations[i].station==s) return true;
		}
		return false;
	},
	isSelected:function(s) {
		for(var i=0;i<this.value.route.length;i++) {
			if (this.value.route[i]==s) return true;
		}
		return false;
	},
	addToRoute:function(o) {
//if (this.route.selected.length>0) console.log(this.route.selected[this.route.selected.length-1]+"=="+o.stationName);
		if (this.route.selected.length>0 && this.route.selected[this.route.selected.length-1]==o.stationName) {
			this.route.selected.pop();
			o.enroute=false;
			o.attr({fill:this.map.station.fill,stroke:this.map.station.stroke,'stroke-width':Math.round(this.map.station['stroke-width'])});
		}else if (this.available(o.stationName) && !o.enroute) {
			o.enroute=true;
			this.route.selected.push(o.stationName);
			o.attr({fill:this.map.currentStation.fill,stroke:this.map.currentStation.stroke,'stroke-width':Math.round(this.map.currentStation['stroke-width'])});
			if (this.route.selected.length>1) {
				var dot=this.stations[this.route.selected[this.route.selected.length-2]].dot;
				dot.attr({fill:this.map.selectedStroke.fill,stroke:this.map.selectedStroke.stroke,'stroke-width':Math.round(this.map.selectedStroke['stroke-width'])});
			}
		}
		if (this.complete()) this.finishRoute();
	},
	selected:function(s) {
		for(var i=0;i<this.route.selected.length;i++) {
			if (this.route.selected[i]==s) return true;
		}
		return false;
	},
	available:function(s) {
		var last=this.structure.stationA;
		if (this.route.selected.length>0) last=this.route.selected[this.route.selected.length-1];
		for(var i=0;i<this.stationLinks[last].length;i++) {
			if (this.stationLinks[last][i]==s) return true;
		}
		return false;
	},
	complete:function() {
		this.completed=this.available(this.structure.stationB);
		return this.completed;
	},
	finishRoute:function() {
		this.value.route=this.route.selected.concat([]);
		this.value.score=this.value.route.length;
		this.value.passed=false;
		this.dooitComplete=false;
		if (this.structure.passMark<this.minStations) this.structure.passMark=this.minStations;
		if (this.value.route.length<=this.structure.passMark) {
			this.dooitComplete=true;
			this.value.passed=true;
		}else if(!this.structure.completeOnPassOnly) {
			this.dooitComplete=true;
		}
		if (this.structure.metaKey!="" && this.structure.metaMessage!="") {
			yoodoo.set_meta(this.structure.metaKey,this.doReplacements(this.structure.metaMessage));
		}
		this.displayComplete();
		//console.log(this.route.selected.length,this.minStations);
	},
	displayComplete:function() {
		var d=document.createElement("div");
		var dd=document.createElement("div");
		d.appendChild(dd);
		$(d).addClass("completeMessage").css({display:"none"});
		if (this.value.score==this.minStations) {
			$(d).addClass("passed");
			$(dd).html(this.doReplacements(this.structure.shortestMessage));
		}else if (this.value.passed) {
			$(d).addClass("passed");
			$(dd).html(this.doReplacements(this.structure.passedMessage));
		}else{
			$(dd).html(this.doReplacements(this.structure.failedMessage));
		}
		if (this.structure.redoable) {
			var b=document.createElement("button");
			$(b).attr('type','button');
			$(b).bind("click",function() {tube.restart();}).html("Try again...");
			var c=document.createElement("center");
			c.appendChild(b);
			dd.appendChild(c);
		}
		this.containers.map.appendChild(d);
		$(d).slideDown();
		this.scoreTagRuleCheck();
	},
	calculate:function() {
		this.minStations="Infinite";
		var routeMessage='No route has been found';
		if (this.structure.stationA!="" && this.structure.stationB!="") {
			this.foundRoutes=[];
			this.routeIndex=0;
			var limit=3;
			while(this.foundRoutes.length==0 && limit<30) {
				this.foundRoutes=[];
				this.getLinked([this.structure.stationA],limit++);
			}
			if (this.foundRoutes.length>0) {
				//console.log("Checked "+this.routeIndex+" stations");
				this.foundRoutes.sort(function(a,b) {return a.length>b.length;});
				var shortest=this.foundRoutes[0].length-2;
				this.minStations=shortest;
				routeMessage="The shortest route consists of "+shortest+" stations";
			}
		}
		//if (this.completed) console.log(routeMessage);
		//$(this.containers.tubeRoute).html(routeMessage);
	},
	availableForCheck:function(stations,station) {
		if (this.structure.stationA==station) return false;
		if (this.structure.stationB==station) return true;
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
					if (tube.structure.stationB==s) {
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
	center:function(osn) {
		this.map.offsetX=Math.round((this.map.width/2)-tube.stations[osn].x);
		this.map.offsetY=Math.round((this.map.height/2)-tube.stations[osn].y);
		$(this.paper.canvas.parentNode).animate({left:this.map.offsetX+"px",top:this.map.offsetY+"px"},{duration:500});
	},
	scoreTagRuleCheck:function() {
		if (this.isNotEmpty(this.structure.scoreTagRules)) {
			var unique=false;
			var toSet=[];
			var toRemove=[];
			var score=tube.value.score;
			var perform=true;
			for(var r=0;r<this.structure.scoreTagRules.length;r++) {
				if (perform) {
					var rule=this.structure.scoreTagRules[r];
					var matched=true;
					for(var c=0;c<rule.compares.length;c++) {
						var m=false;
						try{
							eval('m=(score'+rule.compares[c].compare+rule.compares[c].value.toString()+');');
						}catch(e){}
						if (!m) matched=false;
					}
					if (matched) {
						unique=(rule.unique===true);
						if (rule.unique===true) toSet=[];
						toSet.push(rule.tag);
						if (rule.stop===true) perform=false;
					}else if(rule.unset) {
						toRemove.push(rule.tag);
					}
				}
			}
			if (toSet.length==1 && unique) {
				toRemove=[];
			}else{
				unique=false;
			}
			if (unique) {
				for(var r=0;r<this.structure.scoreTagRules.length;r++) {
					var rule=this.structure.scoreTagRules[r];
					if (rule.tag!=toSet[0]) toRemove.push(rule.tag);
				}
			}
			for(var t=0;t<toSet.length;t++) {
				dooit.addTag(toSet[t]);
			}
			for(var t=0;t<toRemove.length;t++) {
				dooit.removeTag(toRemove[t]);
			}
		}
	},
	/*finished:function() {
		//this.containers.header.animate({opacity:0});
		//var noSave=false;
		if (arguments.length>0) noSave=arguments[0];
		//var duration=((new Date().getTime()-this.startTime)/1000).toFixed(1);
		//this.timer.endQuiz();
		this.completed=true;
		//this.updateStatus();
		if (this.isNotEmpty(this.structure.passMark)) {
			this.value.passed=(this.structure.passMark>=this.value.score);
		}else{
			this.value.passed=true;
		}
		//this.value.score=this.status.percent.toFixed(1);
		this.value.time=duration;
		var txt='You scored {score}';
		if (this.value.passed) {
			if (this.isNotEmpty(this.structure.passedMessage)) txt=this.structure.passedMessage;
		}else{
			if (this.isNotEmpty(this.structure.failedMessage)) txt=this.structure.failedMessage;
		}
		txt=txt.replace(/\{score\}/,"<b>"+this.value.score+"</b>");
		this.containers.pages.html("<div class='tube_complete "+(this.value.passed?"tube_passed":"tube_failed")+"'>"+txt+"</div>");
		if (this.structure.redoable) {
			var restart=document.createElement("button");
			$(restart).attr("type","button");
			$(restart).addClass("yd_cta");
			restart.innerHTML="Restart...";
			$(restart).bind("click",function() {
				//tube.containers.header.animate({opacity:1});
				//tube.page=-1;
				//dooit.saved=false;
				tube.value={};
				tube.checkUser();
				tube.restart();
			})
			//this.containers.pages.get(0).appendChild(restart);
		}
		//this.containers.pages.fadeIn();
		//if (!noSave) {
			this.scoreTagRuleCheck();
		//	yoodoo.saveDooit(null,null,true);
		//	dooit.saved=true;
		//}
	},*/
	loadFields:function() {
		if (typeof(array_of_default_fields)=="object" && array_of_default_fields.length==2
			&& typeof(array_of_global_fields)=="object" && array_of_global_fields.length>0) {
			for(var g=0;g<array_of_global_fields.length;g++) {
				for(var k=0;k<array_of_default_fields.length;k++) {
					if (array_of_global_fields[g]==array_of_default_fields[k] && this.key===null) {
						this.key=array_of_global_fields[g];
					}
				}
			}
			if (this.key!==null) {
				for(var k=0;k<array_of_default_fields.length;k++) {
					if (array_of_default_fields[k]!=this.key) this.valuekey=array_of_default_fields[k];
				}
			}

		}
		if (this.key===null && array_of_default_fields.length>0) {
			for(var f=0;f<array_of_default_fields.length;f++) {
				if (/^global_Tube/.test(array_of_default_fields[f])) this.key=array_of_default_fields[f];
			}
		}
		if (this.valuekey===null && array_of_default_fields.length>0) {
			for(var f=0;f<array_of_default_fields.length;f++) {
				if (/^tube/.test(array_of_default_fields[f])) this.valuekey=array_of_default_fields[f];
			}
		}
		/*if(this.key===null || array_of_fields[this.key]==undefined) this.key=null;
		if (this.key===null && array_of_default_fields.length>0) this.key=array_of_default_fields[0];
		if (this.key===null) {
			for(var k in array_of_fields) {
				if(this.key===null) this.key=k;
			}
		}*/
		if(this.key!==null) {
			try{
				eval('this.structure='+array_of_fields[this.key][1]+';');
			}catch(e){
				this.structure=array_of_fields[this.key][1];
			}
		}
		if(this.valuekey!==null) {
			try{
				eval('this.value='+array_of_fields[this.valuekey][1]+';');
			}catch(e){
				this.value=array_of_fields[this.valuekey][1];
			}
		}
		for(var k in array_of_fields) {
			if (k!=this.key && k!=this.valuekey) {
				try{
					eval('this.fields["'+k+'"]='+array_of_fields[k][1]+';');
				}catch(e){
					this.fields[k]=array_of_fields[this.key][1];
				}
			}
		}
		this.structure=dooit.decode(this.structure);
		if (this.structure.main!==undefined) this.structure=this.structure.main;
		this.value=dooit.decode(this.value);
		this.fields=dooit.decode(this.fields);
	},
	/*decode:function(ip) {
		if (typeof(ip)=="string") {
			ip=ip.replace(/&sq;/g,"'");
			ip=ip.replace(/&dq;/g,'"');
			ip=ip.replace(/&nl;/g,"\n");
			return ip;
		}else if (typeof(ip)=="object"){
			for(var i in ip) {
				ip[i]=this.decode(ip[i]);
			}
		}
		return ip;
	},*/
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
		return this.value.score>0;
	},
	output:function(opts) {
		var op=(dooit.json(this.value));
		array_of_fields[this.valuekey][1]=op;
		var reply={};
		eval('reply.EF'+array_of_fields[this.valuekey][0]+'=op;');
		return reply;
	}
};
