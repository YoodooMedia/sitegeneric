dooit.temporaries('pieChart');

var pieChart=function(params) {
	/* if the second argument is not exist, params is an objet empty. */
	this.params = arguments[1] || {};

	/* values of this object/s. */
	this.radius = params.radius	|| 100;
	this.angle = params.angle	|| 0;
	this.paper = params.paper	|| null;
	this.total = params.total	|| 1000;
	this.ctotal = params.ctotal	|| '#999999';
	this.ctitle = params.ctitle	|| '#999999';
	this.cvalue = params.cvalue	|| '#999999';
	this.fontSizeTotal = params.fontSizeTotal	|| 40;
	this.fontSizeTitle = params.fontSizeTitle	|| 13;
	this.fontSizeValue = params.fontSizeValue	|| 10;
	this.stroke = params.stroke	|| '#FFFFFF';
	this.strokeWidth = params.strokeWidth	|| 3;
	this.budgetTotal = params.budgetTotal	|| 1000;
	this.center = params.center || {x: 200, y: 150};
	this.handler = params.handler || 5;
	this.handlerColor = params.handlerColor || '#0B0B3B';
	this.radiusLabel = params.radiusLabel || 45;
	this.radiusValue = params.radiusValue || 20;
	this.bottomTint = params.bottomTint || -0.3;
	this.topTint = params.topTint || -0.1;
	this.unids = params.unids || 'unids';
	this.totalXPos = params.totalXPos || 500;
	this.totalYPos = params.totalYPos || 100;
	this.width = params.width || 700;
	this.height = params.height || 300;
	this.onchange = params.onchange || function(){ };
	
	for(var k in params) {
		this.params[k]=params[k];
	}
	this.containers={
		target:null
	};
	this.render=function(target,data) {
		this.containers.target=target;
		this.data=data;

		// draw pie chart
		this.sphere();		

	};
	
	this.sphere=function(cx, cy, radius) {
 
			var startAngle=0;
			var endAngle;
			var container = this.containers.target;
			this.paper = new Raphael(container, this.width, this.height);
			this.paper.nameClass='paper';
			this.total=0;
			
			for(var i=0;i<this.data.length;i++) this.total+=this.data[i].value;
			var alpha=0;
			var txtTotal = this.paper.text(this.totalXPos, this.totalYPos, "").attr({fill: this.ctotal, stroke: "none", opacity: 1,"font-size":this.fontSizeTotal});
				
			for(var i=0;i<this.data.length;i++) {
				var thisAlpha=2*Math.PI*this.data[i].value/this.total;
				var p1={x:0,y:0};
				var p2={x:0,y:0};
				p1.x=this.center.x+(this.radius*Math.sin(alpha));
				p1.y=this.center.y+(this.radius*Math.cos(alpha));
				p2.x=this.center.x+(this.radius*Math.sin(alpha+thisAlpha));
				p2.y=this.center.y+(this.radius*Math.cos(alpha+thisAlpha));  
				
				this.data[i].segment=this.paper.path(["M", this.center.x, this.center.y, "L", p1.x, p1.y, "A", this.radius,this.radius,0, +(thisAlpha - alpha>180),0, p2.x, p2.y, "z"]).attr({fill: "90-" + this.rgbToHex(this.tint(this.hexToRGB(this.data[i].colour),this.bottomTint,this.topTint)) + "-" + this.data[i].colour, stroke: this.stroke, "stroke-width": this.strokeWidth});//.animate({ opacity: 0.25 },3000, "bounce");
				alpha+=thisAlpha;
				//CONFIGURATION POSITION OF THE LABELS
				var p1e={x:0,y:0};
				p1e.x=this.center.x+((this.radius+this.radiusLabel)*Math.sin(alpha+thisAlpha/2));
				p1e.y=this.center.y+((this.radius+this.radiusLabel)*Math.cos(alpha+thisAlpha/2));
				
				//CONFIGURATION POSITION OF THE NUMBERS
				var p1num={x:0,y:0};
				p1num.x=this.center.x+((this.radius+this.radiusValue)*Math.sin(alpha+thisAlpha/2));
				p1num.y=this.center.y+((this.radius+this.radiusValue)*Math.cos(alpha+thisAlpha/2));
				
				this.data[i].txtValue = this.paper.text(p1num.x, p1num.y, this.data[i].value).attr({fill: this.cvalue, stroke: "none", opacity: 1, "font-size": this.fontSizeValue});
				this.data[i].txtTitle = this.paper.text(p1e.x, p1e.y, this.data[i].title).attr({fill: this.ctitle, stroke: "none", opacity: 1, "font-size": this.fontSizeTitle});
				
				this.data[i].segment.index=i;
				this.data[i].segment.chart=this;
				this.data[i].segment.update=function() {
					this.chart.total=0;
					for(var i=0;i<this.chart.data.length;i++) this.chart.total+=this.chart.data[i].value;
					var fromAngle=0;
					for(var i=0;i<this.index;i++) fromAngle+= Math.PI * 2 * (this.chart.data[i].value) / this.chart.total;
					var thisAlpha=2*Math.PI*this.chart.data[this.index].value/this.chart.total;
					var p1={x:0,y:0};
					var p2={x:0,y:0};
					
					p1.x=this.chart.center.x+(this.chart.radius*Math.sin(fromAngle));
					p1.y=this.chart.center.y+(this.chart.radius*Math.cos(fromAngle));
					p2.x=this.chart.center.x+(this.chart.radius*Math.sin(fromAngle+thisAlpha));
					p2.y=this.chart.center.y+(this.chart.radius*Math.cos(fromAngle+thisAlpha));					

					if(thisAlpha > Math.PI){
						var d=["M", this.chart.center.x, this.chart.center.y, "L", p1.x, p1.y, "A", this.chart.radius,this.chart.radius,0, 1,0, p2.x, p2.y, "z"];
					}else{	
						var d=["M", this.chart.center.x, this.chart.center.y, "L", p1.x, p1.y, "A", this.chart.radius,this.chart.radius,0, 0,0, p2.x, p2.y, "z"];
					}
					
					$(this.node).attr("d",d.join(" "));		
					
					//CONFIGURATION RADIOUS HANDLERS
					p1.x=this.chart.center.x+((this.chart.radius+this.chart.handler)*Math.sin(fromAngle+(thisAlpha/5)));
					p1.y=this.chart.center.y+((this.chart.radius+this.chart.handler)*Math.cos(fromAngle+(thisAlpha/5)));
					$(this.chart.data[this.index].dot.node).attr('cx',Math.round(p1.x)).attr('cy',Math.round(p1.y));
					
					//CONFIGURATION RADIOUS LABELS IN ACTION
					p1.x=this.chart.center.x+((this.chart.radius+this.chart.radiusValue)*Math.sin(fromAngle+(thisAlpha/2)));
					p1.y=this.chart.center.y+((this.chart.radius+this.chart.radiusValue)*Math.cos(fromAngle+(thisAlpha/2)));
					$(this.chart.data[this.index].txtValue.node).attr('x',Math.round(p1.x)).attr('y',Math.round(p1.y));
					
					//CONFIGURATION RADIOUS NUMBERS IN ACTION
					var p1n={x:0,y:0};
					p1n.x=this.chart.center.x+((this.chart.radius+this.chart.radiusLabel)*Math.sin(fromAngle+(thisAlpha/2)));
					p1n.y=this.chart.center.y+((this.chart.radius+this.chart.radiusLabel)*Math.cos(fromAngle+(thisAlpha/2)));
					
					var txtValue = this.chart.data[this.index].txtValue;
					var txtTitle = this.chart.data[this.index].txtTitle;
					var txtTotaly = txtTotal;
					
					txtValue.attr('x',Math.round(p1.x));
					txtValue.attr('y',Math.round(p1.y));
					txtValue.attr('text',this.chart.data[this.index].value);
					txtTitle.attr('x',Math.round(p1n.x));
					txtTitle.attr('y',Math.round(p1n.y));
					txtTitle.attr('text',this.chart.data[this.index].title);
					
					txtTotaly.attr('text',"TOTAL: "+this.chart.total+" "+this.chart.unids);
	
				};
				
				this.processNew(i);
			}
	};
	this.processNew=function(ii,total){
		start = 0;
		var alpha=0;		
		
		var textAngle=0
		for(var i=0;i<ii;i++) textAngle+= Math.PI * 2 * (this.data[i].value) / this.total;
		var segangle = Math.PI * 2 * (this.data[ii].value) / this.total;
		var angleplus = segangle/2;

		//HANDLERS AFTER OF START ACTION
		var x=this.center.x + ((this.radius+this.handler) * Math.sin(angleplus+textAngle));
		var y=this.center.y + ((this.radius+this.handler) * Math.cos(angleplus+textAngle));

		this.data[ii].dot = this.paper.circle(x, y, 5).attr({fill: this.handlerColor ,cursor: "pointer","stroke-width": 10,stroke: "transparent"});

			this.data[ii].dot.index=ii;	
			this.data[ii].dot.chart=this;
			this.data[ii].dot.drag(function (dx,dy) {
					if (this.node.startY===undefined) this.node.startY=0;
					this.chart.data[this.index].value-=(dy-this.node.startY);
					if (this.chart.data[this.index].value<0) this.chart.data[this.index].value=0;
					this.node.startY=dy;
					this.chart.total=0;
					for (var i=0;i<this.chart.data.length;i++) {
						this.chart.total += this.chart.data[i].value;
					}
					
					var db=this.chart.budgetTotal-this.chart.total;
					
					if (db<0) this.chart.data[this.index].value+=db;

					for (var i=0;i<this.chart.data.length;i++) this.chart.data[i].segment.update();
	
				},function () {
					this.node.startY=undefined;	
				},function () {
					this.chart.onchange();
				}
			);
			this.data[ii].segment.update();
	};	
	this.tint=function(colour,lighten,brighten) {
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
	};
	
	this.rgbToHex=function(col) {
		var rgb={r:'00',g:'00',b:'00'};
		rgb.r=col.r.toString(16);
		rgb.g=col.g.toString(16);
		rgb.b=col.b.toString(16);
		while(rgb.r.length<2) rgb.r='0'+rgb.r;
		while(rgb.g.length<2) rgb.g='0'+rgb.g;
		while(rgb.b.length<2) rgb.b='0'+rgb.b;
		return '#'+rgb.r+rgb.g+rgb.b;
	};
	this.hexToRGB=function(hex){
		  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})|([a-f\d]{1})([a-f\d]{1})([a-f\d]{1})$/i.exec(hex);
		  return result ? {        
			r: parseInt(hex.length <= 4 ? result[4]+result[4] : result[1], 16),
			g: parseInt(hex.length <= 4 ? result[5]+result[5] : result[2], 16),
			b: parseInt(hex.length <= 4 ? result[6]+result[6] : result[3], 16),
			toString: function() {
			  var arr = [];
			  arr.push(this.r);
			  arr.push(this.g);
			  arr.push(this.b);
			  return "rgb(" + arr.join(",") + ")";
			}
		  } : null;
	};
};
