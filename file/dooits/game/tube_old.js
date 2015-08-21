dooit.temporaries('tube');
var tube={
	key:'',
	title:"Block game",
	value:null,
	container:null,
	container_selector:'.tube',
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
	route:{
		from:'Bermondsey',
		to:'Marylebone',
		closed:['Green Park','Oxford Circus','Leicester Square'],
		selected:[]
	},
	canvas:null,
	paper:null,
	init:function() {
		
		this.key='';
		if (arguments.length>0) this.container_selector=arguments[0];
		this.container=$(this.container_selector).get(0);
		if(typeof(array_of_default_fields)=="object") {
			if (array_of_default_fields.length>0) this.key=array_of_default_fields[0];
		}
		if (this.key=='') {
			if(typeof(array_of_fields)=="object") {
				for(var k in array_of_fields) {
					if (this.key=='') this.key=k;
				}
			}
		}
		if (this.key!='') {
			try{
				eval('tube.value='+array_of_fields[this.key][1]+';');
			}catch(ex) {
				this.value=array_of_fields[this.key][1];
			}
		}
		if (tubeData!=undefined) {
			this.loadData();
			this.build();
		}
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
		}
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
	cancel:function() {
		clearInterval(this.timer);
		this.running=false;
	},
	build:function() {

		var ins='';
		ins+="<div class='headingDiv'><h2>"+this.title+"</h2></div>";
		ins+="<div class='tubemap'></div>";
		$(this.container).html(ins);
		

		this.map.padding=10;
		var dw=$('.dooitBox').width()-$('.dooitBox').outerWidth();
		var dh=$('.dooitBox').height()-$('.dooitBox').outerHeight();
		var h=$('#yoodooScrolledArea').height()+dh-$('.headingDiv').outerHeight(true);
		var w=$('#yoodooScrolledArea').width()+dw;
		var pplat=(h-(2*this.map.padding))/(this.dims.lat.maxlat-this.dims.lat.minlat);
		var pplon=(w-(2*this.map.padding))/(this.dims.lon.maxlon-this.dims.lon.minlon);
		var pixelPerLat=pplat;
		if (pplon<pplat) pixelPerLat=pplon;
		this.map.ppll=pixelPerLat;
		this.map.width=Math.floor(w);
		this.map.height=Math.floor(h);
		this.tubemap=$('.tubemap').get(0);
		this.paper = Raphael(0, 0, Math.round(this.map.width*this.map.zoom),Math.round(this.map.height*this.map.zoom));
		$(this.paper.canvas).css("position","relative");
		this.map.offsetX=(this.map.width/2)-((this.map.width*this.map.zoom)/2);
		this.map.offsetY=(this.map.height/2)-((this.map.height*this.map.zoom)/2);
		$(this.paper.canvas).css("left",this.map.offsetX+"px");
		$(this.paper.canvas).css("top",this.map.offsetY+"px");
		this.stationLabel=document.createElement("div");
		$(this.stationLabel).addClass("stationLabel");
		$(this.stationLabel).css("display","none");
		this.tubemap.appendChild(this.stationLabel);
		this.tubemap.appendChild(this.paper.canvas);
		$(this.tubemap).css("width",this.map.width+"px");
		$(this.tubemap).css("height",this.map.height+"px");
		$(this.tubemap).css("overflow",'hidden');
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
			st.clickable=false;
			if (s==this.route.from || s==this.route.to) {
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
					$(tube.stationLabel).html(tube.stations[this.stationName].name+"<br />Not connected to "+((tube.route.selected.length==0)?tube.route.from:tube.route.selected[tube.route.selected.length-1]));
				}
				var w=$(tube.stationLabel).outerWidth();
				var ty=tube.stations[this.stationName].y-tube.map.padding-24;
				var tx=(tube.stations[this.stationName].x-Math.round(w/2));
				tx+=tube.map.offsetX;
				ty+=tube.map.offsetY-20;
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
				$(tube.stationLabel).css("display","none");
				if (this.clickable) tube.addToRoute(this);
				tube.center(this.stationName);
			});
		
		}
		this.center(this.route.from);
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
	isClosed:function(s){
		for(var i=0;i<this.route.closed.length;i++) {
			if (this.route.closed[i]==s) return true;
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
			o.attr({fill:this.map.selectedStroke.fill,stroke:this.map.selectedStroke.stroke,'stroke-width':Math.round(this.map.selectedStroke['stroke-width'])});
		}
		if (this.complete()) this.calculate();
	},
	selected:function(s) {
		for(var i=0;i<this.route.selected.length;i++) {
			if (this.route.selected[i]==s) return true;
		}
		return false;
	},
	available:function(s) {
		var last=this.route.from;
		if (this.route.selected.length>0) last=this.route.selected[this.route.selected.length-1];
		for(var i=0;i<this.stationLinks[last].length;i++) {
			if (this.stationLinks[last][i]==s) return true;
		}
		return false;
	},
	complete:function() {
		return this.available(this.route.to);
	},
	calculate:function() {
		this.foundRoutes=[];
		this.routeIndex=0;
		var limit=10;
		while(this.foundRoutes.length<10) {
			this.foundRoutes=[];
			this.getLinked([this.route.from],limit++);
		}
		console.log("Checked "+this.routeIndex+" stations");
		this.foundRoutes.sort(function(a,b) {return a.length>b.length;});
		var shortest=this.foundRoutes[0].length-2;
		if (this.route.selected.length>shortest) {
			// there are shorter routes
			var by=this.route.selected.length-shortest;
			console.log("You can make this journey with "+by+" less station"+((by==1)?'':'s'));
		}else{
			// is one of the shortest routes
			console.log("You chose one of the "+this.foundRoutes.length+" shortest routes");
		}
	},
	availableForCheck:function(stations,station) {
		if (tube.route.from==station) return false;
		if (tube.route.to==station) return true;
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
					if (tube.route.to==s) {
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
		$(this.paper.canvas).animate({left:this.map.offsetX+"px",top:this.map.offsetY+"px"},{duration:500});
	},
	draw:function() {
		var ins='';
		this.type.init();
		for(var r=0;r<this.blocks.rows;r++) {
			ins+="<div class='blockRow'>";
			for(var c=0;c<this.blocks.columns;c++) {
				ins+=this.type.block();
			}
			ins+="</div>";
		}
		this.board.object.html(ins);
		$('.blockRow').css("padding-left",this.board.width+"px");
		this.ready();
	},
	ready:function() {
		var ins='';
		ins+="<div class='blocks_intro'>Level "+this.level+"</div>";
		if (this.value.highscores!=undefined && this.value.highscores[this.level-1]!=undefined) {
			ins+="<div class='blocks_highscore'>Highscore: "+this.value.highscores[this.level-1]+"</div>";
		}else{
			ins+="<div class='blocks_highscore'>No score yet</div>";
		}
		ins+="<button type='button' onclick='blocks.start()'>start</button>";
		ins+="<p>"+this.messages.welcome+"</p>";
		ins+=this.type.help();
		$(this.scoreContainer.object).html(ins);
		$('.blockRow').animate({"padding-left":"0px"});
	},
	start:function() {
		this.score=0;
		this.timed=0;
		this.running=true;
		this.selected=[];
		this.timer=setInterval('blocks.clock()',1000);
		var ins='';
		ins+="<div class='blocks_currentscore'>0</div>";
		ins+="<div class='blocks_time_container'><div class='blocks_time_bar'></div><div class='blocks_time'>"+this.time[this.level-1]+"s</div></div>";
		ins+="<button type='button' onclick='blocks.shuffle()'>shuffle</button><br />";
		ins+="<button type='button' onclick='blocks.restart()'>restart</button>";
		ins+=this.type.help();
		$(this.scoreContainer.object).html(ins);
	},
	restart:function() {
		clearInterval(this.timer);
		this.draw();
	},
	clock:function() {
		this.timed++;
		$(this.scoreContainer.object).find('.blocks_time').html((this.time[this.level-1]-this.timed)+"s");
		$(this.scoreContainer.object).find('.blocks_time_bar').css("width",Math.round(100*this.timed/this.time[this.level-1])+"%");
		if (this.timed>=this.time[this.level-1]) {
			this.finish();
		}
	},
	destroy:function() {
		$(this.createdStyle).remove();
	},
	finish:function() {
		clearInterval(this.timer);
		this.running=false;
		if (this.value.highscores==undefined) this.value.highscores=[];
		while(this.value.highscores.length<this.level) this.value.highscores.push(0);
		this.gotHighscore=false;
		if (this.value.highscores[this.level-1]<this.score) {
			this.value.highscores[this.level-1]=this.score;
			this.gotHighscore=true;
		}
		$(this.scoreContainer.object).slideUp(function(){
			var ins='';
			ins+="<div class='blocks_intro'>Level "+blocks.level+"</div>";
			if(blocks.gotHighscore) ins+="<b>Congratulations... new highscore</b>";
			ins+='<div>You scored <b>'+blocks.score+'</b> in '+blocks.time[blocks.level-1]+' secs</div><button type="button" onclick="blocks.restart()">try again</button>';
			ins+="<p>"+blocks.messages.completed+"</p>";
			$(this).html(ins);
			$(this).slideDown();
		});
		//if (this.gotHighscore) {
			this.checkTags();
		//}
	},
	checkTags:function() {
		if (typeof(gameTagRules)=="object") {
			for(var r=0;r<gameTagRules.rules.length;r++) {
				if (gameTagRules.rules[r].gameType==this.typeName) {
					if (gameTagRules.rules[r].level==0 || gameTagRules.rules[r].level==this.level) {
						var seton=false;
						try{
							eval('seton=('+this.value.highscores[this.level-1]+gameTagRules.rules[r].score+');');
						}catch(e) {}
						if (seton) {
							dooit.addTag(gameTagRules.rules[r].tag);
							if (gameTagRules.rules[r].unique) {
								for(var t=0;t<gameTagRules.groups[gameTagRules.rules[r].group].length;t++) {
									if (gameTagRules.groups[gameTagRules.rules[r].group][t]!=gameTagRules.rules[r].tag) dooit.removeTag(gameTagRules.groups[gameTagRules.rules[r].group][t]);
								}
							}
						}else if(gameTagRules.rules[r].remove) {
							dooit.removeTag(gameTagRules.rules[r].tag);
						}
					}
				}
			}
		}
	},
	shuffle:function(){
		this.setScore(-10);
		$(this.board.object).fadeOut('fast',function() {
			$(this).find('.blockRow').each(function(i,o) {
				var b=$(o).find('.blocks_block').get();
				for(var a=0;a<b.length;a++) {
					var r=Math.floor(Math.random()*b.length);
					o.appendChild(b[r]);
				}
			});
			$(this).fadeIn('fast');
		});
	},
	select:function(o) {
		if (this.running) {
			var col=$(o).prevAll('.blocks_block').get().length;
			var row=$(o.parentNode).prevAll('.blockRow').get().length;
			if(this.selected.length==0) {
				this.selected.push([o,col,row]);
				$(o).addClass("on");
			}else{
				if (this.type.selected(o)) {
					this.type.deselect(o);
					for(var s=this.selected.length-1;s>=0;s--) {
						if (this.selected[s][0]==o) {
							this.selected.splice(s,1);
						}
					}
				}else{
					var adjacent=false;
					for(var s=0;s<this.selected.length;s++) {
						var dx=Math.sqrt(Math.pow(col-this.selected[s][1],2));
						var dy=Math.sqrt(Math.pow(row-this.selected[s][2],2));
						if (dx<2 && dy<2){
							if ((dx==1)==!(dy==1)) adjacent=true;
						}
					}
					if (adjacent && this.type.valid(o)) {
						this.selected.push([o,col,row]);
						this.type.select(o);
					}
				}
			}
			if(this.selected.length==this.find[this.level-1]) {
				this.losing=this.selected.length;
				blocks.setScore(this.selected.length);
				for(var s=0;s<this.selected.length;s++) {
					$(this.selected[s][0]).animate({'width':'0px','margin-left':'0px','margin-right':'0px'},function(){
						$(this).remove();
						blocks.losing--;
						if (blocks.losing==0) {
							blocks.fill();
						}
					});
				}
				this.selected=[];
				//console.log("complete");
			}
		}
	},
	losing:0,
	fill:function() {
		$(this.board.object).find('.blockRow').each(function(i,o) {
			var cols=$(o).find('.blocks_block').get().length;
			var toAdd=blocks.blocks.columns-cols;
			if (toAdd>0) {
				for(var a=0;a<toAdd;a++) {
					var b=blocks.type.block(true);
					$(b).css("margin-left",blocks.board.width+"px");
					$(b).animate({"margin-left":blocks.blocks.margin+"px"});
					o.appendChild(b);
				}
			}
		});
	},
	setScore:function(s) {
		this.score+=s;
		$(this.scoreContainer.object).find('.blocks_currentscore').html(this.score);
	},
	types:{
		colour:{
			init:function(){
				var defs={};
				for(var l=0;l<this.colours.length;l++) {
					var def=blocks.gradientGloss('.'+this.colours[l].className,this.colours[l],0,-0.4,false,false,false);
					if (defs['.'+this.colours[l].className]==undefined) defs['.'+this.colours[l].className]=[];
					for(var cn in def) {
						for(var k in def[cn]) {
							defs['.'+this.colours[l].className].push([k,def[cn][k]]);
						}
					}
					var def=blocks.gradientGloss('.'+this.colours[l].className,this.colours[l],0.2,0,false,false,false);
					if (defs['.'+this.colours[l].className+':hover']==undefined) defs['.'+this.colours[l].className+':hover']=[];
					for(var cn in def) {
						for(var k in def[cn]) {
							defs['.'+this.colours[l].className+':hover'].push([k,def[cn][k]]);
						}
					}
					var def=blocks.gradientGloss('.'+this.colours[l].className+'.on',this.colours[l],0.2,0.2,false,false,false);
					if (defs['.'+this.colours[l].className+'.on']==undefined) defs['.'+this.colours[l].className+'.on']=[];
					for(var cn in def) {
						for(var k in def[cn]) {
							defs['.'+this.colours[l].className+'.on'].push([k,def[cn][k]]);
						}
					}
				}
				defs['.blocks_block']=[
					['width',blocks.blocks.size+"px"],
					['height',blocks.blocks.size+"px"],
					['margin',blocks.blocks.margin+"px"]
				]
				blocks.createStyleSheet(defs);
			},
			colours:[
				{r:200,g:50,b:0,className:'blocktype1'},
				{r:100,g:150,b:0,className:'blocktype2'},
				{r:0,g:50,b:200,className:'blocktype3'}
			],
			block:function() {
				var asObject=false;
				if (arguments.length>0) asObject=arguments[0];
				var cn=this.colours[Math.floor(Math.random()*this.colours.length)].className;
				if (asObject) {
					var b=document.createElement("button");
					b.type="button";
					$(b).addClass('blocks_block');
					$(b).addClass(cn);
					$(b).attr("onclick","blocks.select(this)");
					return b;
				}else{
					return '<button type="button" class="blocks_block '+cn+'" onclick="blocks.select(this)"></button>';
				}
			},
			valid:function(o){
				var cn='';
				for(var c=0;c<this.colours.length;c++) {
					if ($(blocks.selected[0]).hasClass(this.colours[c].className)) cn=this.colours[c].className;
				}
				return $(o).hasClass(cn);
			},
			select:function(o){
				$(o).addClass("on");
			},
			deselect:function(o){
				$(o).removeClass("on");
			},
			selected:function(o){
				return $(o).hasClass("on");
			},
			help:function() {
				return '<p>Select '+blocks.find[blocks.level-1]+' neighbouring coloured blocks</p>';
			}
		},
		shape:{
			init:function(){
				var defs={};
				var def=blocks.gradientGloss('.blocks_block',{r:200,g:200,b:200},0,0,false,false,false);
				if (defs['.blocks_block']==undefined) defs['.blocks_block']=[];
				for(var cn in def) {
					for(var k in def[cn]) {
						defs['.blocks_block'].push([k,def[cn][k]]);
					}
				}
				var def=blocks.gradientGloss('.blocks_block:hover',{r:200,g:200,b:200},-0.1,0.2,false,false,false);
				if (defs['.blocks_block:hover']==undefined) defs['.blocks_block:hover']=[];
				for(var cn in def) {
					for(var k in def[cn]) {
						defs['.blocks_block:hover'].push([k,def[cn][k]]);
					}
				}
				var def=blocks.gradientGloss('.blocks_block.on',{r:200,g:100,b:100},-0.1,0.2,false,false,false);
				if (defs['.blocks_block.on']==undefined) defs['.blocks_block.on']=[];
				for(var cn in def) {
					for(var k in def[cn]) {
						defs['.blocks_block.on'].push([k,def[cn][k]]);
					}
				}
				defs['.blocks_block'].push(['width',blocks.blocks.size+"px"]);
				defs['.blocks_block'].push(['height',blocks.blocks.size+"px"]);
				defs['.blocks_block'].push(['margin',blocks.blocks.margin+"px"]);
				blocks.createStyleSheet(defs);
			},
			images:[
				{src:yoodoo.option.baseUrl+'uploads/sitegeneric/image/dooits/game/blox_square.png',className:'blockshape1'},
				{src:yoodoo.option.baseUrl+'uploads/sitegeneric/image/dooits/game/blox_circle.png',className:'blockshape2'},
				{src:yoodoo.option.baseUrl+'uploads/sitegeneric/image/dooits/game/blox_triangle.png',className:'blockshape3'}
			],
			block:function() {
				var asObject=false;
				if (arguments.length>0) asObject=arguments[0];
				var r=Math.floor(Math.random()*this.images.length);
				var img=this.images[Math.floor(Math.random()*this.images.length)];
				if (asObject) {
					var b=document.createElement("button");
					b.type="button";
					$(b).addClass('blocks_block');
					$(b).addClass(img.className);
					$(b).attr("onclick","blocks.select(this)");
					var w=30;
					if (blocks.blocks.size<w) w=blocks.blocks.size;
					
					$(b).html('<img src="'+img.src+'" width="'+w+'px" />');
					return b;
				}else{
					return '<button type="button" class="blocks_block '+img.className+'" onclick="blocks.select(this)"><img src="'+img.src+'" width="'+w+'px" /></button>';
				}
			},
			valid:function(o){
				var cn='';
				for(var c=0;c<this.images.length;c++) {
					if ($(blocks.selected[0]).hasClass(this.images[c].className)) cn=this.images[c].className;
				}
				return $(o).hasClass(cn);
			},
			select:function(o){
				$(o).addClass("on");
			},
			deselect:function(o){
				$(o).removeClass("on");
			},
			selected:function(o){
				return $(o).hasClass("on");
			},
			help:function() {
				return '<p>Select '+blocks.find[blocks.level-1]+' neighbouring shapes</p>';
			}},
		number:{
			init:function(){
				var defs={};
				var def=blocks.gradientGloss('.blocks_block',{r:200,g:200,b:200},0,0,false,false,false);
				if (defs['.blocks_block']==undefined) defs['.blocks_block']=[];
				for(var cn in def) {
					for(var k in def[cn]) {
						defs['.blocks_block'].push([k,def[cn][k]]);
					}
				}
				var def=blocks.gradientGloss('.blocks_block:hover',{r:200,g:200,b:200},-0.1,0.2,false,false,false);
				if (defs['.blocks_block:hover']==undefined) defs['.blocks_block:hover']=[];
				for(var cn in def) {
					for(var k in def[cn]) {
						defs['.blocks_block:hover'].push([k,def[cn][k]]);
					}
				}
				var def=blocks.gradientGloss('.blocks_block.on',{r:200,g:100,b:100},-0.1,0.2,false,false,false);
				if (defs['.blocks_block.on']==undefined) defs['.blocks_block.on']=[];
				for(var cn in def) {
					for(var k in def[cn]) {
						defs['.blocks_block.on'].push([k,def[cn][k]]);
					}
				}
				defs['.blocks_block'].push(['width',blocks.blocks.size+"px"]);
				defs['.blocks_block'].push(['height',blocks.blocks.size+"px"]);
				defs['.blocks_block'].push(['font-size',(blocks.blocks.size-4)+"px"]);
				defs['.blocks_block'].push(['line-height',blocks.blocks.size+"px"]);
				defs['.blocks_block'].push(['margin',blocks.blocks.margin+"px"]);
				blocks.createStyleSheet(defs);
			},
			block:function() {
				var asObject=false;
				if (arguments.length>0) asObject=arguments[0];
				var i=Math.floor(Math.random()*3)+1;
				//var img=this.images[Math.floor(Math.random()*this.images.length)];
				if (asObject) {
					var b=document.createElement("button");
					b.type="button";
					$(b).addClass('blocks_block');
					$(b).addClass('number'+i);
					$(b).attr("onclick","blocks.select(this)");
					var w=30;
					if (blocks.blocks.size<w) w=blocks.blocks.size;
					$(b).html(i);
					return b;
				}else{
					return '<button type="button" class="blocks_block number'+i+'" onclick="blocks.select(this)">'+i+'</button>';
				}
			},
			findTotal:[6,8,10,12,14,16],
			valid:function(o){
				var last=(blocks.selected.length+1==blocks.find[blocks.level-1]);
			
				var total=0;
				for(var i=0;i<blocks.selected.length;i++) {
					total+=parseInt(blocks.selected[i][0].innerHTML);
				}
				total+=parseInt(o.innerHTML);
				if (last) {
					return (total==this.findTotal[blocks.level-1]);
				}else{
					return (total<this.findTotal[blocks.level-1]);
				}
			},
			select:function(o){
				$(o).addClass("on");
			},
			deselect:function(o){
				$(o).removeClass("on");
			},
			selected:function(o){
				return $(o).hasClass("on");
			},
			help:function() {
				return '<p>Select '+blocks.find[blocks.level-1]+' neighbouring numbers that total to '+this.findTotal[blocks.level-1]+'</p>';
			}},
		letter:{
			init:function(){
				for(var w=0;w<this.findWord.length;w++) {
					this.findWord[w]=this.randomWord(this.findWord[w].length);
				}
				var defs={};
				var def=blocks.gradientGloss('.blocks_block',{r:200,g:200,b:200},0,0,false,false,false);
				if (defs['.blocks_block']==undefined) defs['.blocks_block']=[];
				for(var cn in def) {
					for(var k in def[cn]) {
						defs['.blocks_block'].push([k,def[cn][k]]);
					}
				}
				var def=blocks.gradientGloss('.blocks_block:hover',{r:200,g:200,b:200},-0.1,0.2,false,false,false);
				if (defs['.blocks_block:hover']==undefined) defs['.blocks_block:hover']=[];
				for(var cn in def) {
					for(var k in def[cn]) {
						defs['.blocks_block:hover'].push([k,def[cn][k]]);
					}
				}
				var def=blocks.gradientGloss('.blocks_block.on',{r:200,g:100,b:100},-0.1,0.2,false,false,false);
				if (defs['.blocks_block.on']==undefined) defs['.blocks_block.on']=[];
				for(var cn in def) {
					for(var k in def[cn]) {
						defs['.blocks_block.on'].push([k,def[cn][k]]);
					}
				}
				defs['.blocks_block'].push(['width',blocks.blocks.size+"px"]);
				defs['.blocks_block'].push(['font-size',(blocks.blocks.size-4)+"px"]);
				defs['.blocks_block'].push(['line-height',blocks.blocks.size+"px"]);
				defs['.blocks_block'].push(['height',blocks.blocks.size+"px"]);
				defs['.blocks_block'].push(['margin',blocks.blocks.margin+"px"]);
				blocks.createStyleSheet(defs);
			},
			block:function() {
				var asObject=false;
				if (arguments.length>0) asObject=arguments[0];
				var r=Math.floor(Math.random()*this.findWord[blocks.level-1].length);
				var i=this.findWord[blocks.level-1].substring(r,r+1);
				//var img=this.images[Math.floor(Math.random()*this.images.length)];
				if (asObject) {
					var b=document.createElement("button");
					b.type="button";
					$(b).addClass('blocks_block');
					$(b).addClass('letter'+i);
					$(b).attr("onclick","blocks.select(this)");
					var w=30;
					if (blocks.blocks.size<w) w=blocks.blocks.size;
					$(b).html(i);
					return b;
				}else{
					return '<button type="button" class="blocks_block letter'+i+'" onclick="blocks.select(this)">'+i+'</button>';
				}
			},
			possibleWords:[
				['cow','bus','yak','pan'],
				['bird','help','ship','grey'],
				['flair','lucky','meany','spoil'],
				['bright','flight','retina','auntie'],
				['pontiac','orients','senator','atoners'],
				['flavours','question','discover','modeling']
			],
			randomWord:function(l) {
				var r=Math.round(Math.random()*(this.possibleWords[l-3].length-1));
				return this.possibleWords[l-3][r];
			},
			findWord:['cow','bird','flair','bright','pontiac','flavours'],
			valid:function(o){
				var last=(blocks.selected.length+1==blocks.find[blocks.level-1]);
				var word=this.findWord[blocks.level-1];
				var found={};
				for(var w=0;w<word.length;w++) {
					found[word.substring(w,w+1)]=false;
				}
				for(var i=0;i<blocks.selected.length;i++) {
					found[blocks.selected[i][0].innerHTML]=true;
				}
				return (found[o.innerHTML]!=undefined && !found[o.innerHTML]);
			},
			select:function(o){
				$(o).addClass("on");
			},
			deselect:function(o){
				$(o).removeClass("on");
			},
			selected:function(o){
				return $(o).hasClass("on");
			},
			help:function() {
				return '<p>Select '+blocks.find[blocks.level-1]+' neighbouring letters found in the word &lsquo;'+this.findWord[blocks.level-1]+'&rsquo;</p>';
			}}
	},
	parentOfClass:function(o,c) {
		if ($(o).hasClass(c)) return o;
		if (o==document.body) return o;
		return surveyor.parentOfClass(o.parentNode,c);
	},
	finishable:function() {
		var fin=true;
		return fin;
	},
	output:function() {
		var op=dooit.json(this.value);
		yoodoo.console(op);
		array_of_fields[this.key][1]=op;
		var reply={};
		eval('reply.EF'+array_of_fields[this.key][0]+'=op;');
		return reply;
	},
	gradientGloss:function(obj,colour,lighten,brighten,horizontal,reversed,asCSS) {
		var l=[0.5,0.4,0.2,0.1];
		var b=[0,0,0,0];
		if(colour.tint!=undefined) {
			if(colour.tint.l!=undefined) l=colour.tint.l;
			if(colour.tint.b!=undefined) b=colour.tint.b;
		}
		colour=this.tint(colour,lighten,brighten);
		var colours=[
			this.rgbToHex(this.tint(colour,l[0],b[0])),
			this.rgbToHex(this.tint(colour,l[1],b[1])),
			this.rgbToHex(this.tint(colour,l[2],b[2])),
			this.rgbToHex(this.tint(colour,l[3],b[3]))
		];
		var styles={};
		styles.old={background:colours[2]};
		styles.ff={background:'-moz-linear-gradient('+(horizontal?'left':'top')+', '+colours[0]+' 0%, '+colours[1]+' 50%, '+colours[2]+' 51%, '+colours[3]+' 100%)'};
		styles.chromeOld={background:'-webkit-gradient(linear, '+(horizontal?'left top, right top,':'left top, left bottom,')+' color-stop(0%,'+colours[0]+'), color-stop(50%,'+colours[1]+'), color-stop(51%,'+colours[2]+'), color-stop(100%,'+colours[3]+'))'};
		styles.chrome={background:'-webkit-linear-gradient('+(horizontal?'left':'top')+', '+colours[0]+', 0%, '+colours[1]+',50%, '+colours[2]+',51%, '+colours[3]+',100%)'};
		styles.opera={background:'-o-linear-gradient('+(horizontal?'left':'top')+', '+colours[0]+' 0%, '+colours[1]+' 50%, '+colours[2]+' 51%, '+colours[3]+' 100%)'};
		styles.ms={background:'-ms-linear-gradient('+(horizontal?'left':'top')+', '+colours[0]+' 0%, '+colours[1]+' 50%, '+colours[2]+' 51%, '+colours[3]+' 100%)'};
		styles.w3c={background:'linear-gradient('+(horizontal?'left':'top')+', '+colours[0]+' 0%, '+colours[1]+' 50%, '+colours[2]+' 51%, '+colours[3]+' 100%)'};
		styles.ie={filter:"progid:DXImageTransform.Microsoft.gradient( startColorstr='"+colours[0]+"', endColorstr='"+colours[3]+"',GradientType="+(horizontal?'1':'0')+" )"};
		
		var definitions=[];
		for(var s in styles) {
			for(var ss in styles[s]) {
//console.log(ss,styles[s][ss]);
				if(asCSS && typeof(obj)=="string") {
					definitions.push(ss+':'+styles[s][ss]+';');
				}else{
					$(obj).css(ss,styles[s][ss]);
				}
			}
		}
		if(asCSS && typeof(obj)=="string") {
			var ins=obj+'{'+definitions.join('')+'}';
			var so=document.createElement("style");
			so.type = 'text/css';
			so.innerHTML = ins;
			document.getElementsByTagName('head')[0].appendChild(so);
		}
		return styles;
	},
	createStyleSheet:function(definitions) {
		var ins='';
		for(var k in definitions) {
			ins+=k+'{';
			for(var kk=0;kk<definitions[k].length;kk++) {
				ins+=definitions[k][kk][0]+':'+definitions[k][kk][1]+';';
			}
			ins+='}';
		}
		this.createdStyle=document.createElement("style");
		this.createdStyle.type = 'text/css';
		this.createdStyle.innerHTML = ins;
		document.getElementsByTagName('head')[0].appendChild(this.createdStyle);
		
	},
	tint:function(colour,lighten,brighten) {
		var toColour={r:colour.r,g:colour.g,b:colour.b};
		if (lighten>0) {
			toColour={r:toColour.r+(lighten*(255-toColour.r)),g:toColour.g+(lighten*(255-toColour.g)),b:toColour.b+(lighten*(255-toColour.b))};
		}else if (lighten<0) {
			toColour={r:toColour.r-(-lighten*(toColour.r)),g:toColour.g-(-lighten*(toColour.g)),b:toColour.b-(-lighten*(toColour.b))};
		}
		if (brighten!=0) {
			toColour={r:toColour.r+(brighten*toColour.r),g:toColour.g+(brighten*toColour.g),b:toColour.b+(brighten*toColour.b)};
		}
		toColour.r=Math.round(toColour.r);
		toColour.g=Math.round(toColour.g);
		toColour.b=Math.round(toColour.b);
		toColour.r=(toColour.r>255)?255:(toColour.r<0)?0:toColour.r;
		toColour.g=(toColour.g>255)?255:(toColour.g<0)?0:toColour.g;
		toColour.b=(toColour.b>255)?255:(toColour.b<0)?0:toColour.b;
		return toColour;
	},
	rgbToHex:function(col) {
		col.r=col.r.toString(16);
		col.g=col.g.toString(16);
		col.b=col.b.toString(16);
		while(col.r.length<2) col.r='0'+col.r;
		while(col.g.length<2) col.g='0'+col.g;
		while(col.b.length<2) col.b='0'+col.b;
		return '#'+col.r+col.g+col.b;
	}
}
