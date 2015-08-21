var timestamp=new Date().getTime();
/*var g=null;
$(function() {
	var args={
		fromEye:1200,
		elevation:0.01,
		target:$('.svg').get(0)
	};
	g=new graph();
	g.init(args);
	
	g.lights.push(new light({center:new point(this.renderer,null,400,-400,400),colour:new colour(255,255,255),range:4000}));
	g.lights.push(new light({center:new point(this.renderer,null,-400,-400,400),colour:new colour(255,255,255),range:4000}));
	
	g.dataSet({
			  name:'Data 1',
			  colour:{
			  		base:new colour(100,100,100,1),
			  		top:new colour(50,255,50,1),
			  		negative:new colour(100,100,100,1),
			  		bottom:new colour(255,50,50,1)
			  },
			  bars:[{column:'month 1',value:4},
				  {column:'month 2',value:3},
				  {column:'month 3',value:-4},
				  {column:'month 4',value:8},
				  {column:'month 5',value:9},
				  {column:'month 6',value:-2},
				  {column:'month 7',value:1}]
			  });
	g.draw();
	g.graphObject.translate(0,0,-200);
*/
function makeRotator() {
	window.graphObject.graphRotator={active:false,downPos:[0,0],elevation:0,yaw:0,twist:0};
	
	$(window.graphObject.args.target).bind("mousedown",function(e) {
		e.preventDefault();
		window.graphObject.graphRotator.active=true;
		window.graphObject.graphRotator.downPos=[e.clientX,e.clientY];
		$('body').bind("mousemove",function(e) {
			var dx=window.graphObject.graphRotator.downPos[0]-e.clientX;
			var dy=window.graphObject.graphRotator.downPos[1]-e.clientY;
			var l=dx/window.graphObject.renderer.width();
			var d=dy/window.graphObject.renderer.height();
		window.graphObject.graphRotator.downPos=[e.clientX,e.clientY];
			var r=((l<0)?-l:l)/3;
			if (r>45) r=45;
			if (r<1) r=1;
			window.graphObject.graphObject.rotation[0]-=d*10;
			window.graphObject.graphObject.rotation[2]-=l*10;
			window.graphObject.renderer.update();
		});
		$('body').bind("mouseup",function(e) {
			window.graphObject.graphRotator.active=false;
			$('body').unbind("mouseup");
			$('body').unbind("mousemove");
		});
	});
	/*for(var d=0;d<g.dataSets.length;d++ ){
		for(var v=0;v<window.graphObject.dataSets[d].length;v++) {
			var ip=document.createElement("INPUT");
			ip.value=window.graphObject.dataSets[d][v].value;
			ip.index=v;
			ip.dataSet=d;
			$(ip).bind("keyup",function() {
				g.animate(this.dataSet,this.index,this.value);
			});
			document.body.appendChild(ip);
		}
	}*/
}

function graph(args) {
	this.args={};
	this.renderer=null;
	this.dataSets=[];
	this.dataNames=[];
	this.colours=[];
	this.graphObject=null;
	this.lights=[];
	this.columnLabelsValues=false;
	this.init=function(args) {
		window.graphObject=this;
		this.args=args;
		//console.log(this.args);
		if (typeof(args.target)=="undefined") alert("Target is not supplied");
		var def={fromEye:2000,
				elevation:0.3,
				yaw:0.4,
				twist:0,
				ambient:0.2,
				fov:Math.PI/4,
				margin:10,
				keyed:true,
				minimum:0,
				maximum:-100000,
				datasetSpace:10,
				barSpace:10,
				axisSpace:10,
				labelMargin:80,
				fontSize:50,
				yAxisLabelCount:{minimum:5,maximum:30},
				axisColour:new colour(100,100,100,0.5),
				axisStroke:new stroke({colour:new colour(100,100,100,1),width:1,opacity:1,cap:line_cap.round,type:line_type.none}),
				axis:{x:{width:600,label:'',minimum:0,maximum:-100000},y:{width:400,label:''},z:{width:500,label:''}}};
		for(var i in def) {
			if(typeof(this.args[i])=="undefined") {
				this.args[i]=def[i];
			}else if(typeof(def[i])=="object"){
				for(var ii in def[i]) {
					if(typeof(this.args[i][ii])=="undefined") {
						this.args[i][ii]=def[i][ii];
					}else if(typeof(def[i][ii])=="object"){
						for(var iii in def[i][ii]) {
							if(typeof(this.args[i][ii][iii])=="undefined") {
								this.args[i][ii][iii]=def[i][ii][iii];
							}else if(typeof(def[i][ii][iii])=="object"){
								for(var iiii in def[i][ii][iii]) {
									if(typeof(this.args[i][ii][iii][iiii])=="undefined") {
										this.args[i][ii][iii][iiii]=def[i][ii][iii][iiii];
									}
								}
							}
						}
					}
				}
			}
		}
		this.renderer=new renderer(this.args);
	}
	this.elements={axis:{x:[],y:[],z:[]},data:[],label:{x:[],y:[],z:[],label:{line:[],text:[]}},lights:[]};
	this.dataSet=function(data) {
		/*if (arguments.length>1) {
			this.colours.push(arguments[1]);
		}else{*/
			if (typeof(data.colour.top)!="undefined") data.colour.base.fadeTo=data.colour.top;
			if (typeof(data.colour.negative)!="undefined") data.colour.base.negative=data.colour.negative;
			if (typeof(data.colour.bottom)!="undefined") data.colour.base.bottom=data.colour.bottom;
			this.colours.push(data.colour.base);
		//}
		// data=[{column:number || string ,value:number}];
		this.args.keyed=(typeof(data.bars[0].column)=="string");
		this.dataNames.push(data.name);
		this.dataSets.push(data.bars);
	};
	this.clear=function() {
		for(var o=0;o<this.elements.axis.x.length;o++) $(this.elements.axis.x[o]).remove();
		for(var o=0;o<this.elements.axis.y.length;o++) $(this.elements.axis.y[o]).remove();
		for(var o=0;o<this.elements.axis.z.length;o++) $(this.elements.axis.z[o]).remove();
		for(o=0;o<this.elements.data.length;o++) $(this.elements.data[o]).remove();
		for(o=0;o<this.elements.label.x.length;o++) $(this.elements.label.x[o]).remove();
		for(o=0;o<this.elements.label.y.length;o++) $(this.elements.label.y[o]).remove();
		for(o=0;o<this.elements.label.label.line.length;o++) $(this.elements.label.label.line[o]).remove();
		for(o=0;o<this.elements.label.label.text.length;o++) $(this.elements.label.label.text[o]).remove();
	};
	this.draw=function() {
		//this.clear();
		var update=false;
		if (arguments.length>0) update=arguments[0];
		var finishHandler=null;
		if (arguments.length>1) finishHandler=arguments[1];
		var data=[];
		this.args.axis.x.minimum=1000000000;
		this.args.axis.x.maximum=-1000000000;
		this.args.minimum=1000000000;
		this.args.maximum=-1000000000;
		var maxColumns=0;
		var columns=[];
		var columnsIDs={};
		var blocks=[];
		var labels=[];
		for(var d=0;d<this.dataSets.length;d++) {
			data.push({});
			if (this.dataSets[d].length>maxColumns) maxColumns=this.dataSets[d].length;
			for(var v=0;v<this.dataSets[d].length;v++) {
				if(!this.args.keyed) {
					if(this.args.axis.x.minimum>this.dataSets[d][v].column) this.args.axis.x.minimum=this.dataSets[d][v].column;
					if(this.args.axis.x.maximum<this.dataSets[d][v].column) this.args.axis.x.maximum=this.dataSets[d][v].column;
				}
				this.dataSets[d][v].value=1*this.dataSets[d][v].value;
				if(this.args.minimum>this.dataSets[d][v].value) this.args.minimum=this.dataSets[d][v].value;
				if(this.args.maximum<this.dataSets[d][v].value) this.args.maximum=this.dataSets[d][v].value;
				data[d]['column '+this.dataSets[d][v].column]=this.dataSets[d][v].value;
				if (typeof(columnsIDs['column '+this.dataSets[d][v].column])=="undefined") columns.push('column '+this.dataSets[d][v].column);
				columnsIDs['column '+this.dataSets[d][v].column]=true;
			}
		}
		var w=this.args.axis.x.width/maxColumns;
		var d=this.args.axis.y.width/this.dataSets.length;
		if (this.args.minimum>0) this.args.minimum=0;
		if (this.args.maximum<0) this.args.maximum=0;
		var h=this.args.axis.z.width/(this.args.maximum-this.args.minimum);
		
			if (this.lights.length==0 && !update) {
				var col3=new colour(255,255,255);
				var lp=new point(this.renderer,null,400,-400,400);
				this.renderer.addLight(new light({center:lp,colour:col3,range:4000}));
			}else{
				for(var l=0;l<this.lights.length;l++) {
					if (update && l<this.renderer.lights.length) {
						this.renderer.lights[l]=this.lights[l];
					}else{
						this.renderer.addLight(this.lights[l]);
					}
				}
			}
			
		this.parts=[];
		
		
			
			for(var c=0;c<columns.length;c++) {
				var args={width:w+((c==0)?this.args.axisSpace:0),depth:this.args.axis.z.width+this.args.axisSpace,colour:this.args.axisColour.clone(),stroke:this.args.axisStroke,back:false};
				var loc=[-(this.args.axis.x.width/2)-((c==0)?this.args.axisSpace:0)+(c*w),this.args.axisSpace+(this.args.axis.y.width/2),-this.args.axisSpace];
				if(c<this.elements.axis.z.length) {
					this.elements.axis.z[c].rebuilder(args);
					this.elements.axis.z[c].center=loc;
				}else{
					var ne=element_builder.plane.build(this.renderer,args);
					ne.translate(loc[0],loc[1],loc[2]);
					ne.rotateX(Math.PI/2);
					this.parts.push(ne);
					this.elements.axis.z.push(ne);
				}
			}
			while(this.elements.axis.z.length>columns.length) {
				var tr=this.elements.axis.z.pop();
				tr.remove();
			}
			var c=0;
			var strokeObject=new stroke({colour:new colour(255,255,255,1),width:0,opacity:1,cap:line_cap.round,type:line_type.none});
			var cw=this.args.axis.x.width/columns.length;
			var cy=-(this.args.axis.y.width/2)-20;
			var cz=-60;
			for(var id in columnsIDs) {
				//var cx=(cw*c)-(cw/2)-(this.args.axis.x.width/2);
				var cx=(cw*c)+(cw/2)-(this.args.axis.x.width/2);
				var args={width:100,depth:20,colour:new colour(0,0,0,1),stroke:strokeObject,back:true};
				if (c<this.elements.label.x.length) {
					this.elements.label.x[c].rebuilder.args;
					this.elements.label.x[c].center=[cx,cy,cz];
					this.elements.label.x[c].faces[0].text=id.replace(/^column /,'');
				}else{
					var txt=element_builder.plane.build(this.renderer,args);
					txt.rotateX(Math.PI/2);
					txt.translate(cx,cy,cz);
					txt.faces[0].text=id.replace(/^column /,'');
					txt.faces[0].size=40;
					this.parts.push(txt);
					this.elements.label.x.push(txt);
				}
				c++;
			}
			while(this.elements.label.x.length>c+1) {
				var tr=this.elements.label.x.pop();
				tr.remove();
			}
			
			var nLabels=0;
			var divs=1000000;
			while(nLabels<this.args.yAxisLabelCount.minimum) {
				divs/=10;
				nLabels=Math.ceil(this.args.maximum/divs);
				if (this.args.minimum<0) {
					nLabels-=Math.floor(this.args.minimum/divs);
				}
			}
			if (nLabels>this.args.yAxisLabelCount.maximum) divs*=10;
				//console.log(divs,nLabels,this.args.yAxisLabelCount.minimum);
			//divs/=10;
			var lowest=divs*Math.ceil(this.args.minimum/divs);
			var highest=divs*Math.floor(this.args.maximum/divs);
			var yv=lowest;
			var yn=0;
			while(yv<=highest) {
				var loc=[];
				loc[0]=-(this.args.axis.x.width/2)-120;
				loc[1]=-(this.args.axis.y.width/2)-20;
				loc[2]=this.args.axis.z.width*(yv-this.args.minimum)/(this.args.maximum-this.args.minimum);
				var args={width:100,depth:20,colour:new colour(0,0,0,1),stroke:strokeObject,back:true};
				if (yn<this.elements.label.z.length) {
					this.elements.label.z[yn].rebuilder(args);
					this.elements.label.z[yn].center=loc;
					this.elements.label.z[yn].faces[0].text=yv;
				}else{
					var txt=element_builder.plane.build(this.renderer,args);
					txt.rotateX(Math.PI/2);
					txt.translate(loc[0],loc[1],loc[2]);
					txt.faces[0].text=yv;
					txt.faces[0].size=this.args.fontSize;
					this.parts.push(txt);
					this.elements.label.z.push(txt);
				}
				yv+=divs;
				yn++;
			}
			while(this.elements.label.z.length>yn) {
				var tr=this.elements.label.z.pop();
				tr.remove();
			}
			
			var nd=this.args.axis.y.width/this.dataNames.length;
			var zy=-(this.args.axis.y.width/2);
			for(var dn=0;dn<this.dataNames.length;dn++) {
				var cx=-(this.args.axis.x.width/2)-120;
				var cy=zy+(nd*dn)+(nd/2);
				var cz=this.args.axis.z.width+30;
				var args={width:100,depth:20,colour:new colour(0,0,0,1),stroke:strokeObject,back:true};
				if (dn<this.elements.label.y.length) {
					this.elements.label.y[dn].rebuilder(args);
					this.elements.label.y[dn].center=[cx,cy,cz];
				}else{
					var txt=element_builder.plane.build(this.renderer,args);
					txt.rotateX(Math.PI/2);
					txt.translate(cx,cy,cz);
					txt.faces[0].text=this.dataNames[dn];
					txt.faces[0].size=this.args.fontSize;
					this.parts.push(txt);
					this.elements.label.y.push(txt);
				}
			}
			while(this.elements.label.y.length>this.dataNames.length) {
				var tr=this.elements.label.y.pop();
				tr.remove();
			}
			
			
			var args={width:this.args.axis.x.width+this.args.axisSpace,depth:this.args.axis.y.width+this.args.axisSpace,colour:this.args.axisColour.clone(),stroke:this.args.axisStroke,back:false};
			var loc=[-(this.args.axis.x.width/2)-this.args.axisSpace,-this.args.axis.y.width/2,-this.args.axisSpace];
			if (this.elements.axis.x.length>0) {
				this.elements.axis.x[0].rebuilder(args);
				this.elements.axis.x[0].center=loc;
			}else{
				var ne=element_builder.plane.build(this.renderer,{width:this.args.axis.x.width+this.args.axisSpace,depth:this.args.axis.y.width+this.args.axisSpace,colour:this.args.axisColour.clone(),stroke:this.args.axisStroke,back:false});
				ne.translate(loc[0],loc[1],loc[2]);
				this.parts.push(ne);
				this.elements.axis.x.push(ne);
			}
			
			for(var ds=0;ds<this.dataSets.length;ds++) {
				
				var args={width:this.args.axis.z.width+this.args.axisSpace,depth:d+((ds==0)?this.args.axisSpace:0),colour:this.args.axisColour.clone(),stroke:this.args.axisStroke,back:false};
				var loc=[-(this.args.axis.x.width/2)-this.args.axisSpace,zy-(ds*nd)+((ds==-1)?this.args.axisSpace:0),this.args.axis.z.width];
				if (ds<this.elements.axis.y.length) {
					this.elements.axis.y[ds].rebuilder(args);
					this.elements.axis.y[ds].center=loc;
				}else{
					var ne=element_builder.plane.build(this.renderer,{width:this.args.axis.z.width+this.args.axisSpace,depth:d+((ds==0)?this.args.axisSpace:0),colour:this.args.axisColour.clone(),stroke:this.args.axisStroke,back:false});
					ne.translate(loc[0],loc[1],loc[2]);
					ne.rotateY(Math.PI/2);
					this.parts.push(ne);
					this.elements.axis.y.push(ne);
				}
			}
			while(this.elements.axis.y.length>this.dataSets.length) {
				var tr=this.elements.axis.y.pop();
				tr.remove();
			}
		
		
		// bars and top labels
		
		var boxCount=0;
		var zero_offset=0;
		if (this.args.minimum<0) zero_offset=-this.args.minimum;
		//console.log(zero_offset);
		for(var i=0;i<data.length;i++) {
			var segments=[];
			blocks.push([]);
			labels.push([]);
			for(var c=0;c<columns.length;c++) {
				var cid=columns[c];
				var v=0;
				var col=this.colours[i].clone();
				if (typeof(data[i][columns[c]])!="undefined") v=data[i][columns[c]];
				if (v<0) {
					col.fade=-v/zero_offset;
				}else{
					col.fade=v/this.args.maximum;
				}
				col.showNegative=(v<0);
				var strokeObject=new stroke({colour:col,width:1,opacity:1,cap:line_cap.round,type:line_type.none});
				if (boxCount<this.elements.data.length) {
					this.elements.data[boxCount].rebuilder({width:w-this.args.barSpace,height:h*v,depth:d-this.args.datasetSpace,colour:col,stroke:strokeObject,back:false});
					this.elements.data[boxCount].center=[(w*c)-(this.args.axis.x.width/2),(i*d)-(this.args.axis.y.width/2),h*zero_offset];
				}else{
					var ne=element_builder.box.build(this.renderer,{width:w-this.args.barSpace,height:h*v,depth:d-this.args.datasetSpace,colour:col,stroke:strokeObject,back:false});
					ne.translate((w*c)-(this.args.axis.x.width/2),(i*d)-(this.args.axis.y.width/2),h*zero_offset);
					blocks[i].push(ne);
					segments.push(ne);
					this.elements.data.push(ne);
				}
				if (this.columnLabelsValues) {
					var x=(w*c)-(this.args.axis.x.width/2)+(w/2);
					var y=(i*d)-(this.args.axis.y.width/2)+(d/2);
					//y=0;
					var z=(v<0)?((zero_offset*h)+20):((v+zero_offset)*h)+20;
					//var z=(h*v)+20;
					var args={from:[x,y,z],to:[x,y,this.args.axis.z.width+this.args.labelMargin],stroke:strokeObject};
					if (boxCount<this.elements.label.label.line.length) {
						this.elements.label.label.line[boxCount].rebuilder(args);
					}else{
						var line=element_builder.line.build(this.renderer,args);
						line.showOnOver=ne;
						labels[i].push(line);
						segments.push(line);
						this.elements.label.label.line.push(line);
					}
					var args={width:100,depth:20,colour:this.colours[i].clone(),stroke:strokeObject,back:true};
					var loc=[x,y,this.args.axis.z.width+this.args.labelMargin];
					if (boxCount<this.elements.label.label.text.length) {
						this.elements.label.label.text[boxCount].rebuilder(args);
						this.elements.label.label.text[boxCount].faces[0].text=v;
						this.elements.label.label.text[boxCount].center=loc;
					}else{
						strokeObject.width=0;
						var txt=element_builder.plane.build(this.renderer,{width:100,depth:20,colour:this.colours[i].clone(),stroke:strokeObject,back:true});
						txt.rotateX(Math.PI/2);
						txt.translate(loc[0],loc[1],loc[2]);
						txt.showOnOver=ne;
						txt.faces[0].text=v;
						txt.faces[0].size=this.args.fontSize;
						labels[i].push(txt);
						segments.push(txt);
						this.elements.label.label.text.push(txt);
					}
				}
				boxCount++;
			}
			while(this.elements.data.length>boxCount+1) {
				var tr=this.elements.data.pop();
				tr.remove();
			}
			while(this.elements.label.label.line.length>boxCount+1) {
				var tr=this.elements.label.label.line.pop();
				tr.remove();
			}
			while(this.elements.label.label.text.length>boxCount+1) {
				var tr=this.elements.label.label.text.pop();
				tr.remove();
			}
			
			this.parts.push(this.renderer.group(segments));
		}
		if (this.graphObject!==null) {
			for(var p=0;p<this.parts.length;p++) {
				this.renderer.addToGroup(this.graphObject,this.parts[p]);
			}
		}else{
			this.graphObject=this.renderer.group(this.parts);
		}
		if (finishHandler===null) {
			this.renderer.update();
		}else{
			this.renderer.update(finishHandler);
		}
		
		
		
	};
	this.animating=false;
	this.animate=function(dataSetIndex,item,value) {
		if(!isNaN(value)) {
			this.dataSets[dataSetIndex][item].targetValue=1*value;
			if (!this.animating) this.processAnimation();
		}
	}
	this.processAnimation=function() {
		var now=new Date().getTime();
		//console.log(now-timestamp);
		timestamp=now;
		var complete=true;
		for(var d=0;d<this.dataSets.length;d++) {
			for(var v=0;v<this.dataSets[d].length;v++) {
				if (typeof(this.dataSets[d][v].targetValue)!="undefined" && this.dataSets[d][v].targetValue!==null) {
					var dv=this.dataSets[d][v].targetValue-this.dataSets[d][v].value;
					if (dv>-0.01 && dv<0.01) {
						this.dataSets[d][v].value=this.dataSets[d][v].targetValue;
					}else{
						this.dataSets[d][v].value+=dv/4;
						complete=false;
					}
				}
			}
		}
		if (!complete) {
			this.draw(true,function() {setTimeout('window.graphObject.processAnimation();',20);});
		}else{
			this.draw(true);
		}
	}
	
	
	
}
