function miniGraph(target,data) {
	this.data={
		width:'100%',
		height:'50px',
		padding:5,
		data:[
			{legend:'Title 1',x:1,y:10},
			{legend:'Title 2',x:3,y:3},
			{legend:'Title 3',x:6,y:14},
			{legend:'Title 4',x:7,y:7}
		]
	};
	this.width=null;
	this.height=null;
	this.range={
		x:[Number.MAX_VALUE,-Number.MAX_VALUE],
		y:[Number.MAX_VALUE,-Number.MAX_VALUE],
		dx:1,
		dy:1
	};
	this.dots=[];
	for(var k in data) this.data[k]=data[k];
	this.target=target;
	this.type=(typeof(document.createElementNS)=="undefined")?"":"svg";
	var temp=document.createElement("canvas");
	if (temp.nodeType===1) this.type='canvas';
	this.container=null;
	this.type="svg";
	if (!(this.data.data.length>1)) return false;
	$(this.target).css({width:this.data.width,height:this.data.height});
	this.data.width=$(this.target).width();
	this.data.height=$(this.target).height();
	
	switch(this.type) {
		case "svg":
			this.container=document.createElementNS('http://www.w3.org/2000/svg','svg');
			this.container.setAttribute('width',this.data.width);
			this.container.setAttribute('height',this.data.height);

			this.containerOverlay=document.createElementNS('http://www.w3.org/2000/svg','svg');
			this.containerOverlay.setAttribute('width',this.data.width);
			this.containerOverlay.setAttribute('height',this.data.height);
			$(this.containerOverlay).css({top:0,left:0,position:'absolute'});
		break;
		case "canvas":
			this.container=document.createElement("canvas");
			this.container.width=this.data.width;
			this.container.height=this.data.height;
			$(this.container).css({width:this.data.width,height:this.data.height});
			this.context=this.container.getContext("2d");

			this.containerOverlay=document.createElement("canvas");
			this.containerOverlay.width=this.data.width;
			this.containerOverlay.height=this.data.height;
			$(this.containerOverlay).css({width:this.data.width,height:this.data.height});
			this.contextOverlay=this.containerOverlay.getContext("2d");
			$(this.containerOverlay).css({top:0,left:0,position:'absolute'});
		break;
	}


	this.render=function() {
		if (this.container!==null && this.data.data.length>1) {
			this.dots=[];
			$(this.target).append(this.container).append(this.containerOverlay).css({position:'relative'});
			this.width=$(this.container).width()-(2*this.data.padding);
			this.height=$(this.container).height()-(2*this.data.padding);
			for(var d=0;d<this.data.data.length;d++) {
				if (this.data.data[d].x<this.range.x[0]) this.range.x[0]=this.data.data[d].x;
				if (this.data.data[d].x>this.range.x[1]) this.range.x[1]=this.data.data[d].x;
				if (this.data.data[d].y<this.range.y[0]) this.range.y[0]=this.data.data[d].y;
				if (this.data.data[d].y>this.range.y[1]) this.range.y[1]=this.data.data[d].y;
			}
			if (this.range.x[0]==this.range.x[1]) this.range.x[1]++;
			if (this.range.y[0]==this.range.y[1]) this.range.y[1]++;
			this.range.dx=this.width/(this.range.x[1]-this.range.x[0]);
			this.range.dy=this.height/(this.range.y[1]-this.range.y[0]);
			for(var d=0;d<this.data.data.length;d++) {
				var pos={x:0,y:0};
				pos.x=(this.data.data[d].x-this.range.x[0])*this.range.dx;
				pos.y=(this.range.y[1]-this.data.data[d].y)*this.range.dy;
				pos.x+=this.data.padding;
				pos.y+=this.data.padding;
				this.dots.push([this.data.data[d].legend,pos]);
			}
			this.renderPoints();
			this.containerOverlay.source=this;
			$(this.containerOverlay).bind("mousemove",function(e) {
				var pos=$(this).offset();
				pos.left=e.pageX-pos.left;
				pos.top=e.pageY-pos.top;
				var nearest=this.source.closestDot({x:pos.left,y:pos.top});
				this.source.showClosest(nearest[1].x,nearest[1].y);
				$(this.source.bubble).html(nearest[0]);
				var h=$(this.source.bubble).outerHeight();
				var w=$(this.source.bubble).outerWidth();
				var l=e.pageX-(w/2);
				if (l<1) l=1;
				$(this.source.bubble).css({
					top:e.pageY-20-h,
					left:l
				});
			}).bind("mouseleave",function() {
				$(this.source.bubble).remove();
				this.source.removeClosest();
			}).bind('mouseenter',function() {
				this.source.bubble=yoodoo.e("div");
				$(this.source.bubble).addClass("yd_body_bubble");
				document.body.appendChild(this.source.bubble);
			});
		}
	};
	this.closestDot=function(pos) {
		var nearestH=10000;
		var closest=null;
		for(var d=0;d<this.dots.length;d++) {
			var h=Math.sqrt(Math.pow(pos.x-this.dots[d][1].x,2)+Math.pow(pos.y-this.dots[d][1].y,2));
			if (h<nearestH) {
				nearestH=h;
				closest=this.dots[d];
			}
		}
		return closest;
	};
	this.closestDotObject=null;
	this.closestDotPos={x:-1,y:-1};
	this.showClosest=function(x,y) {
		switch(this.type) {
			case "svg":
				if (this.closestDotObject===null) {
					var e=document.createElementNS("http://www.w3.org/2000/svg", "circle");
					e.setAttribute("cx",x);
					e.setAttribute("cy",y);
					e.setAttribute("r",3);
					e.setAttribute("fill",'red');
					e.setAttribute("stroke",'black');
					this.containerOverlay.appendChild(e);
					this.closestDotObject=e;
				}else if (this.closestDotPos.x!=x || this.closestDotPos.y!=y) {
					this.closestDotObject.setAttribute("cx",x);
					this.closestDotObject.setAttribute("cy",y);
				}
				this.closestDotPos.x=x;
				this.closestDotPos.y=y;
			break;
			case "canvas":
				if (this.closestDotPos.x!=x || this.closestDotPos.y!=y){
					this.contextOverlay.clearRect(this.closestDotPos.x-5,this.closestDotPos.y-5,this.closestDotPos.x+5,this.closestDotPos.y+5);
					this.contextOverlay.lineWidth=1;
					this.contextOverlay.strokeStyle='rgb(0,0,0)';
					this.contextOverlay.fillStyle='rgb(255,0,0)';
					this.contextOverlay.beginPath();
					this.contextOverlay.arc(x,y,3,0,2*Math.PI,false);
					this.contextOverlay.closePath();
					this.contextOverlay.stroke();
					this.contextOverlay.fill();
					this.closestDotPos.x=x;
					this.closestDotPos.y=y;
				}
			break;
		}
	};
	this.removeClosest=function() {
		switch(this.type) {
			case "svg":
				$(this.closestDotObject).remove();
				this.closestDotObject=null;
			break;
			case "canvas":
				this.contextOverlay.clearRect(this.closestDotPos.x-5,this.closestDotPos.x-5,10,10);
			break;
		}
		this.closestDotPos.x=-1;
		this.closestDotPos.y=-1;
	};
	this.renderPoints=function() {
		switch(this.type) {
			case "svg":
				for(var d=1;d<this.dots.length;d++) {
					var e=document.createElementNS("http://www.w3.org/2000/svg", "path");
					var str='M'+this.dots[d-1][1].x+' '+this.dots[d-1][1].y+' L'+this.dots[d][1].x+' '+this.dots[d][1].y+' Z';
					e.setAttribute("d",str);
					e.setAttribute("stroke",'black');
					this.container.appendChild(e);
				}
				for(var d=0;d<this.dots.length;d++) {
					var e=document.createElementNS("http://www.w3.org/2000/svg", "circle");
					e.setAttribute("cx",this.dots[d][1].x);
					e.setAttribute("cy",this.dots[d][1].y);
					e.setAttribute("r",3);
					e.setAttribute("fill",'white');
					e.setAttribute("stroke",'black');
					this.container.appendChild(e);
				}
			break;
			case "canvas":
				this.context.lineWidth=1;
				this.context.strokeStyle='rgb(0,0,0)';
				this.context.beginPath();
				this.context.moveTo(this.dots[0][1].x,this.dots[0][1].y);
				for(var d=1;d<this.dots.length;d++) {
					this.context.lineTo(this.dots[d][1].x,this.dots[d][1].y);
				}
				this.context.stroke();
				this.context.fillStyle='rgb(255,255,255)';
				for(var d=0;d<this.dots.length;d++) {
					this.context.beginPath();
					this.context.arc(this.dots[d][1].x,this.dots[d][1].y,3,0,2*Math.PI,false);
					this.context.closePath();
					this.context.stroke();
					this.context.fill();
				}
			break;
		}
	};
	this.render();
}
