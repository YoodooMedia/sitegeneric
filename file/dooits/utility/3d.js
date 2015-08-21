function svg_canvas(ele) {
	var t=new Date();
	this.type=(typeof(document.createElementNS)=="undefined")?"vml":"svg";
	this.width=(arguments.length>1)?arguments[1]:'100%';
	this.height=(arguments.length>2)?arguments[2]:'100%';
	this.id=(arguments.length>3)?arguments[3]:'svg'+t.getTime();
	if (this.type=="svg") {
		this.canvas=document.createElementNS('http://www.w3.org/2000/svg','svg');
		ele.appendChild(this.canvas);
		this.canvas.setAttribute('width',this.width);
		this.canvas.setAttribute('height',this.height);
	}else{
		this.canvas=ele;
		$(this.canvas).css("position","relative");
		//this.canvas=document.createElement("DIV");
	}
	this.canvas.id=this.id;
	
	this.groups=[];
	this.paths=[];
	this.group=group;
	function group() {
		var g=new g_element(this);
		this.groups.push(g);
		this.canvas.appendChild(g.element);
		return g;
	}
	this.path=path;
	function path(str) {
		var opts=(arguments.length>1)?arguments[1]:{};
		var p=new path_element(this,str,opts);
		this.paths.push(p);
		this.canvas.appendChild(p.element);
		return p;
	}
	this.text=text;
	function text(str) {
		var opts=(arguments.length>1)?arguments[1]:{};
		var p=new text_element(this,str,opts);
		this.paths.push(p);
		this.canvas.appendChild(p.element);
		return p;
		
	}
	this.dot=dot;
	function dot(x,y) {
		var d=document.createElementNS("http://www.w3.org/2000/svg", "circle");
		d.setAttribute("cx",x);
		d.setAttribute("cy",y);
		d.setAttribute("r",3);
		d.setAttribute("fill",'red');
		d.setAttribute("stroke",'black');
		this.canvas.appendChild(d);
		return d;
	}
}
function g_element(canvas) {
	this.canvas=canvas;
	if (this.canvas.type=="svg") {
		this.element=document.createElementNS("http://www.w3.org/2000/svg", "g");
	}else{
		this.element=document.createElement("GROUP");
	}
	this.paths=[];
	this.path=path;
	function path(str) {
		var opts=(arguments.length>1)?arguments[1]:{};
		var p=new path_element(this.canvas,str,opts);
		this.paths.push(p);
		this.element.appendChild(p.element);
		//document.documentElement.appendChild(p);
		return p;
	}
	this.toFront=toFront;
	function toFront() {
		this.element.parentNode.appendChild(this.element);
	}
}
function path_element(canvas,str) {
	this.canvas=canvas;
	this.element=null;
	this.fillElement=null;
	var opts=(arguments.length>2)?arguments[2]:{};
	this.style=opts;
	if (this.canvas.type=="svg") {
		this.element=document.createElementNS("http://www.w3.org/2000/svg", "path");
		this.element.setAttribute("d",str);
		var s=[];
		for(var k in this.style) {
			if(typeof(opts[k])=="string" || typeof(opts[k])=="number") {
				s.push(k+":"+opts[k]);
			}
		}
		this.element.setAttribute("style",s.join(";"));
	}else{
		this.element=document.createElement("v:polyline");
		this.element.className='pvml';
		str=str.replace(/Z/,'').replace(/M/,'').replace(/L/g,' ').split(" ");
		str.push(str[0]);
		str=str.join(" ");
		//this.element.setAttribute("points",str);
		this.element.points=str;
		this.fillElement=document.createElement("v:fill");
		this.fillElement.className='pvml';
		this.fillElement.setAttribute("type","solid");
		this.element.appendChild(this.fillElement);
		if (this.style.fill!=undefined) this.fillElement.color=this.style.fill;
		//if (this.style.stroke!=undefined) this.element.setAttribute("strokecolor",this.style.stroke);
		if (this.style.stroke!=undefined) this.element.strokecolor=this.style.stroke;
		//if (this.style.opacity!=undefined) this.fillElement.setAttribute("opacity",Math.round(this.style.opacity*100)+"%");
		//if (this.style.opacity!=undefined) this.fillElement.setAttribute("opacity",this.style.opacity);
		if (this.style.opacity!=undefined) this.fillElement.opacity=this.style.opacity;
		for(var k in this.style) {
		//console.log(k);
		}
		//if (this.style.
	}
	this.setStyle=setStyle;
	function setStyle(k,v) {
		this.style[k]=v;
		if (this.canvas.type=="svg") {
			var s=[];
			for(var k in this.style) {
				if(typeof(opts[k])=="string" || typeof(opts[k])=="number") {
					s.push(k+":"+opts[k]);
				}
			}
			this.element.setAttribute("style",s.join(";"));
		}else{
			if (this.style.fill!=undefined) this.fillElement.color=this.style.fill;
			if (this.style.stroke!=undefined) this.element.strokecolor=this.style.stroke;
			if (this.style.opacity!=undefined) this.fillElement.opacity=this.style.opacity;
		}
	}
	this.setPath=setPath;
	function setPath(str) {
		if (this.canvas.type=="svg") {
			this.element.setAttribute("d",str);
		}else{
			str=str.replace(/Z/,'').replace(/M/,'').replace(/L/g,' ').split(" ");
			str.push(str[0]);
			str=str.join(" ");
			//this.element.setAttribute("points",str);
			//console.log(str);
			//console.log(typeof(this.element.points));
			this.element.points.value=str;
		}
	}
	this.toFront=toFront;
	function toFront() {
		this.element.parentNode.appendChild(this.element);
	}
	this.remove=remove;
	function remove(){
		this.element.parentNode.removeChild(this.element);
	}
	this.toFront=toFront;
	function toFront() {
		this.element.parentNode.appendChild(this.element);
	}
}
function text_element(canvas,str) {
	this.canvas=canvas;
	var opts=(arguments.length>2)?arguments[2]:{};
	this.style=opts;
	//console.log(str);
	//console.log(opts);
	if(this.canvas.type=="svg") {
		this.element=document.createElementNS("http://www.w3.org/2000/svg", "text");
		this.element.setAttribute("text-anchor","middle");
		this.element.textContent=str;
		this.canvas.canvas.appendChild(this.element);
		this.style.offsetx=Math.round(this.element.offsetWidth/2);
		this.style.offsety=Math.round(this.element.offsetHeight/2);
		var s=[];
		for(var k in this.style) {
			if(typeof(opts[k])=="string" || typeof(opts[k])=="number") {
				if (k=="x") {
					this.element.setAttribute(k,opts[k]-this.style.offsetx);
				}else if (k=="y") {
					this.element.setAttribute(k,opts[k]-this.style.offsety);
				}else{
					this.element.setAttribute(k,opts[k]);
				}
			}
		}
	}else{
		this.element=document.createElement("p");
		this.element.innerHTML=str;
		//this.element.innerHTML=this.style.x;
		$(this.element).css("position","absolute");
		$(this.element).css("display","block");
		$(this.element).css("text-align","center");
		document.body.appendChild(this.element);
		if (this.style.fill!=undefined) $(this.element).css("color",this.style.fill);
		this.style.offsetx=Math.round(this.element.offsetWidth/2);
		this.style.offsety=Math.round(this.element.offsetHeight/2);
		//console.log(this.element.offsetWidth);
		if (this.style.x!=undefined) $(this.element).css("left",(this.style.x-this.style.offsetx)+"px");
		if (this.style.y!=undefined) $(this.element).css("top",(this.style.y-this.style.offsety)+"px");
		if (this.style["font-size"]!=undefined) $(this.element).css("font-size",this.style["font-size"]+"px");
	}
	//this.element.setAttribute("style",s.join(";"));
	this.setStyle=setStyle;
	function setStyle(k,v) {
		this.style[k]=v;
		if(this.canvas.type=="svg") {
			var s=[];
			for(var k in this.style) {
				if(typeof(opts[k])=="string" || typeof(opts[k])=="number") {
					this.element.setAttribute(k,opts[k]);
					//s.push(k+":"+opts[k]);
				}
			}
		}else{
			if (this.style.fill!=undefined) $(this.element).css("color",this.style.fill);
			this.style.x-=this.element.offsetWidth/2;
			this.style.y-=this.element.offsetHeight/2;
			if (this.style.x!=undefined) $(this.element).css("left",(this.style.x-this.style.offsetx)+"px");
			if (this.style.y!=undefined) $(this.element).css("top",(this.style.y-this.style.offsety)+"px");
			if (this.style["font-size"]!=undefined) $(this.element).css("font-size",this.style["font-size"]+"px");
		//this.element.setAttribute("style",s.join(";"));
		}
	}
	this.setText=function(t) {
		if(this.canvas.type=="svg") {
			this.element.textContent=t;
		}else{
			this.element.innerHTML=t;
		//this.element.innerHTML=this.style.x;
			this.style.offsetx=Math.round(this.element.offsetWidth/2);
			this.style.offsety=Math.round(this.element.offsetHeight/2);
		}
	}
	this.toFront=toFront;
	function toFront() {
		this.element.parentNode.appendChild(this.element);
	}
	this.remove=remove;
	function remove(){
		this.element.parentNode.removeChild(this.element);
	}
	this.toFront=toFront;
	function toFront() {
		this.element.parentNode.appendChild(this.element);
	}
}



function space() {
	this.yaw=0;
	this.elevation=0;
	this.twist=0;
	this.fromEye=800;
	this.onscreen=500;
	this.fov=Math.PI/3;
	this.darknessFactor=0.5;
	this.darkness=0.5;
	this.threeD=threeD;
	this.eye=new vector()
	function threeD(px, py, pz) {
		var p=new vector(px,py,pz);
		//pz = -pz;
		//var h=Math.sqrt(Math.pow(px,2)+Math.pow(py,2)+Math.pow(pz,2));
		//var xa=this.getAtan(px/py);
		//var ninety=Math.PI/2;
		/*var npx=px*Math.cos(this.twist)-py*Math.sin(this.twist);
		var npy=px*Math.sin(this.twist)+py*Math.cos(this.twist);
		var npz=pz;*/
		
		// elevation
		p.rotateX(this.elevation);
		/*npx=npx;
		npy=npy*Math.cos(this.elevation)-npz*Math.sin(this.elevation);
		npz=npy*Math.sin(this.elevation)+npz*Math.cos(this.elevation);*/
		
		// yaw
		p.rotateY(this.twist);
		// twist
		p.rotateZ(this.yaw);
		/*npx=npz*Math.sin(this.yaw)+npx*Math.cos(this.yaw);
		npy=npy;
		npz=npz*Math.cos(this.yaw)-npx*Math.sin(this.yaw);*/
		
		/*var z=this.fromEye*Math.cos(this.elevation)*Math.cos(this.yaw);
		var y=-this.fromEye*Math.sin(this.elevation)*Math.sin(this.yaw);
		var x=-this.fromEye*Math.sin(this.yaw);*/
		
		/*
		//Yaw
		var h = Math.sqrt(Math.pow(pz, 2)+Math.pow(px, 2));
		var a = this.getAtan(px, pz);
		var npz = h*Math.cos(a+this.yaw);
		var npx = h*Math.sin(a+this.yaw);
		var npy=py;
		//Twist
		h = Math.sqrt(Math.pow(npx, 2)+Math.pow(npy, 2));
		a = this.getAtan(npy, npx);
		npx = h*Math.cos(a+this.twist);
		npy = h*Math.sin(a+this.twist);
		//Elevation
		h = Math.sqrt(Math.pow(npz, 2)+Math.pow(npy, 2));
		a = this.getAtan(npz, npy);
		npz = h*Math.cos(a-this.elevation);
		npy = h*Math.sin(a-this.elevation);*/
		//polar position
		var d=p.directions;
		var npx=d[0];
		var npy=d[1];
		var npz=d[2];
		var pa = this.getAtan(npz, npx);
		var r = Math.sqrt(Math.pow(npz, 2)+Math.pow(npx, 2));
		//fromEye
		a = this.getAtan(r, (this.fromEye+npy));
		var ar = this.fromEye*Math.tan(a);
		var inEye = this.fromEye*Math.tan(this.fov);
		var apr = (ar/inEye)*this.onscreen;
		//find x,y
		var ax = apr*Math.cos(pa);
		var ay = apr*Math.sin(pa);
		var fe=Math.sqrt(Math.pow((this.fromEye+npy),2)+Math.pow(r,2));
		var reply = [ax, -ay,fe];
		return reply;
	}
	this.radiusSize=radiusSize;
	function radiusSize(r,d,e){
		var a=this.getAtan(r,e);
		return d*Math.tan(a);
	}
	this.getAtan=getAtan;
	function getAtan(o, a) {
		var t = Math.atan(o/a);
		if (a<0) t+=Math.PI;
		if (t>Math.PI*2) t-=Math.PI*2;
		if (t<0) t+=Math.PI*2;
		if (a==0) {
			if (o>0) {
				t=Math.PI/2;
			} else {
				t=-Math.PI/2;
			}
		}
		return t;
	}
	this.tintColour=tintColour;
	function tintColour(colour,tint,rgb) {
		var contrast=0.8;
		var r=parseInt(colour.substr(0,2), 16);
		var g=parseInt(colour.substr(2,2), 16);
		var b=parseInt(colour.substr(4,2), 16);
		if (tint<0.5) {
			tint=2*(0.5-tint);
			r-=r*tint*contrast;
			g-=g*tint*contrast;
			b-=b*tint*contrast;
		} else {
			tint=2*(tint-0.5);
			r+=(255-r)*tint*contrast;
			g+=(255-g)*tint*contrast;
			b+=(255-b)*tint*contrast;
		}
		r*=(1-(this.darkness*this.darknessFactor));
		g*=(1-(this.darkness*this.darknessFactor));
		b*=(1-(this.darkness*this.darknessFactor));
		if (r>255) r=255;
		if (g>255) g=255;
		if (b>255) b=255;
		if (r<0) r=0;
		if (g<0) g=0;
		if (b<0) b=0;
		if (rgb) {
			return [r,g,b];
		}else{
			r=Math.round(r).toString(16);
			g=Math.round(g).toString(16);
			b=Math.round(b).toString(16);
			if (r.length<2) r='0'+r;
			if (g.length<2) g='0'+g;
			if (b.length<2) b='0'+b;
			colour=r+g+b;
			return colour;
		}
	
	}
	this.eyeVector=eyeVector;
	function eyeVector() {
		this.eye.setDirection(0,-this.fromEye,0);
		this.eye.rotateZ(-this.yaw);
		this.eye.rotateY(-this.twist);
		this.eye.rotateX(-this.elevation);
		this.eye.flip();
	}
	this.eyeVector();
	this.update=update;
	function update(opts) {
		for(var k in opts) {
			if (typeof(this[k])!=="undefined") this[k]=opts[k];
		}
		this.eyeVector();
	}
}
function face(renderer,element,pointIndexes,inverseNormal) {
	this.renderer=renderer;
	this.inverseNormal=inverseNormal;
	this.points=pointIndexes;
	this.centerPoint=new vector();
	this.centerFromCenter=new vector();
	this.centerFromNormalCenter=new vector();
	this.normal=new vector();
	this.colour=new colour(); // rgba
	this.stroke=new stroke(); // rgba
	this.parent=null;
	this.text=null;
	this.size=10;
	//console.log(new point(0,0,0));
	this.element=element;
	this.normalCenter=(arguments.length>4)?arguments[4]:new point(this.renderer,null,0,0,0);
	this.normalCenter.element=this.element;
	//console.log(this.normalCenter);
	this.path=null;
	this.normalpath=null;
	this.shownormalpath=false;
	this.elementsBehind=[];
	this.elementsOnPlane=[];
	this.eyeToCenter=new vector();
	this.eye=new vector();
	this.id='face'+this.renderer.faces.length;
	this.draw=draw;
	function draw() {
		//console.log(this.renderer);
		if (this.show() && true) {
			var pntstr=[];
			//this.text=null;
			if (this.text!==null) {
				if (this.path!==null) {
					this.path.setText(this.text);
					this.path.setStyle('color',this.colour.hex());
					this.path.setStyle('stroke',this.stroke.colour.hex());
					this.path.setStyle('opacity',""+this.colour.opacity());
					var point=[0,0,0];
					for(var i=0;i<this.points.length;i++) {
						point[0]+=this.element.points[this.points[i]].position[0];
						point[1]+=this.element.points[this.points[i]].position[1];
						point[2]+=this.element.points[this.points[i]].position[2];
					}
					var d=Math.round(point[2]/this.points.length);
					var s=this.renderer.space.fromEye*this.size/point[2];
					this.path.setStyle('font-size',s);
					this.path.setStyle('x',Math.round(point[0]/this.points.length));
					this.path.setStyle('y',Math.round(point[1]/this.points.length));					
				}else{
					var opts={
						'fill-opacity':this.colour.opacity(),
						//opacity:'0.2',
						fill:this.tintColour(this.colour),
						stroke:this.tintColour(this.stroke.colour),
						'stroke-dasharray':this.stroke.type,
						'stroke-linecap':this.stroke.cap,
						'stroke-linejoin':this.stroke.corner,
						'stroke-opacity':this.stroke.opacity,
						'stroke-width':this.stroke.width
					};
					//console.log(opts);
					if(this.renderer.sortAllFaces) {
						this.path=this.renderer.paper.text(this.text,opts);
					}else{
						this.path=this.element.group.text(this.text,opts);
					}
					var point=[0,0,0];
					for(var i=0;i<this.points.length;i++) {
						point[0]+=this.element.points[this.points[i]].position[0];
						point[1]+=this.element.points[this.points[i]].position[1];
						point[2]+=this.element.points[this.points[i]].position[2];
					}
					var d=Math.round(point[2]/this.points.length);
					var s=this.renderer.space.fromEye*this.size/point[2];
					this.path.setStyle('font-size',s);
					this.path.setStyle('x',Math.round(point[0]/this.points.length));
					this.path.setStyle('y',Math.round(point[1]/this.points.length));				
					this.path.element.element=this;
					$(this.path.element).bind("mouseover",function() {
						this.element.mouseover();
					});
					$(this.path.element).bind("mouseout",function() {
						this.element.mouseout();
					});
				}
			}else{
				for(var i=0;i<this.points.length;i++) {
					var point=this.element.points[this.points[i]].position;
					pntstr.push(((i==0)?"M":"L")+Math.round(point[0])+","+Math.round(point[1]));
				}
				if(this.points.length>2) pntstr.push("Z");
				if (this.path!==null) {
					this.path.setPath(pntstr.join(""));
					this.path.setStyle('opacity',""+this.colour.opacity());
					//console.log(this.colour.opacity());
					//this.path.setStyle('opacity',"0.1");
					this.path.setStyle('fill',this.tintColour(this.colour));
					this.path.setStyle('stroke',this.tintColour(this.stroke.colour));
					//this.path.setStyle({opacity:this.colour.opacity(),fill:this.tintColour(this.colour),stroke:this.tintColour(this.stroke.colour)});
				}else{
					var opts={
						'fill-opacity':this.colour.opacity(),
						//opacity:'0.2',
						fill:this.tintColour(this.colour),
						stroke:this.tintColour(this.stroke.colour),
						'stroke-dasharray':this.stroke.type,
						'stroke-linecap':this.stroke.cap,
						'stroke-linejoin':this.stroke.corner,
						'stroke-opacity':this.stroke.opacity,
						'stroke-width':this.stroke.width
					};
					//console.log(opts);
					if(this.renderer.sortAllFaces) {
						this.path=this.renderer.paper.path(pntstr.join(""),opts);
					}else{
						this.path=this.element.group.path(pntstr.join(""),opts);
					}
					this.path.element.element=this;
					$(this.path.element).bind("mouseover",function() {
						this.element.mouseover();
					});
					$(this.path.element).bind("mouseout",function() {
						this.element.mouseout();
					});
					//this.path=this.renderer.paper.path(pntstr.join(""),opts);
					//this.path.setStyle(opts);
				}
			}
			if (!this.renderer.sortAllFaces) this.path.toFront();
			//console.log(this.path);
			//console.log(pntstr.join(""));
		}else if (this.path!==null) {
				this.path.remove();
				this.path=null;
		}
		if (this.shownormalpath) {
			var l=100;
			var n=this.normal.unitVector();
			//var n=this.centerFromCenter.unitVector();
			//l=this.centerFromCenter.getLength();
			//clog(this.centerPoint.directions.join(",")+"<br />"+n.join(","));
			//var from=this.renderer.space.threeD(this.centerPoint.directions[0]+this.element.center[0],this.centerPoint.directions[1]+this.element.center[1],this.centerPoint.directions[2]+this.element.center[2]);
			//var to=this.renderer.space.threeD(this.centerPoint.directions[0]+this.element.center[0]+(l*n[0]),this.centerPoint.directions[1]+this.element.center[1]+(l*n[1]),this.centerPoint.directions[2]+this.element.center[2]+(l*n[2]));
			var fp=this.centerPoint.directions;
			//var fp=this.normalCenter.getAbsoluteLocation();
			var rendCenter=this.renderer.center();
			var from=this.renderer.space.threeD(fp[0],fp[1],fp[2]);
			//var from=this.renderer.space.threeD(fp[0],fp[1],fp[2]);
			//var cfnc=this.centerFromNormalCenter.directions;
			//var to=this.renderer.space.threeD(fp[0]+cfnc[0],fp[1]+cfnc[1],fp[2]+cfnc[2]);
			var to=this.renderer.space.threeD(fp[0]+(l*n[0]),fp[1]+(l*n[1]),fp[2]+(l*n[2]));
			from[0]=rendCenter[0]+from[0];
			from[1]=rendCenter[1]+from[1];
			from[2]=rendCenter[2]+from[2];
			to[0]=rendCenter[0]+to[0];
			to[1]=rendCenter[1]+to[1];
			to[2]=rendCenter[2]+to[2];
			var str="M"+from[0]+","+from[1]+"L"+to[0]+","+to[1];
			if (this.normalpath==null) {
				
				if(this.renderer.sortAllFaces) {
					this.normalpath=this.renderer.paper.path(str);
				}else{
					this.normalpath=this.element.group.path(str);
				}
				//this.normalpath=this.renderer.paper.path(str);
			}else{
				this.normalpath.setPath(str);
				this.normalpath.setStyle('stroke',this.stroke.colour.hex());
			}
		}
	}
	this.over=false;
	this.mouseover=mouseover;
	function mouseover() {
		this.over=true;
		//clog(this.element.id);
	}
	this.mouseout=mouseout;
	function mouseout() {
		this.over=false;
	}
	this.show=show;
	function show() {
		if(this.element.showOnOver===null || this.element.showOnOver.mouseover()) {
			if (this.points.length<3) return true;
			if (this.element.showBack) {
				if(this.normal.dotProduct(this.eye)>0) {
					this.normal.flip();
				}
				return true;
			}
			var answer=this.normal.dotProduct(this.eye);
			return (answer<0);
		}
		//clog(this.element.showOnOver.mouseover());
		return false;
	}
	this.center=center;
	function center() {
		this.normalCenter.getAbsoluteLocation();
		var cp=[0,0,0];
		for(var i=0;i<this.points.length;i++) {
			var p=this.getPoint(i).getAbsoluteLocation();
			cp[0]+=p[0];
			cp[1]+=p[1];
			cp[2]+=p[2];
		}
		//console.log(cp[0]/this.points.length);
		this.centerPoint.setDirection(cp[0]/this.points.length,cp[1]/this.points.length,cp[2]/this.points.length);
		//this.centerPoint.setDirection(cp[0]/this.points.length,cp[1]/this.points.length,cp[2]/this.points.length);
		if(this.points.length>2) {
			var c=new point(this.renderer,this.element,0,0,0);
			var ec=c.getAbsoluteLocation();
			this.centerFromCenter.setDirection(this.centerPoint.directions[0]-ec[0],this.centerPoint.directions[1]-ec[1],this.centerPoint.directions[2]-ec[2]);
			//console.log(this.normalCenter);
			/*var e=this.element;
			while(e!==null) {
				
				this.centerFromCenter.rotateX(e.rotation[0]);
				this.centerFromCenter.rotateY(e.rotation[1]);
				this.centerFromCenter.rotateZ(e.rotation[2]);
				//this.absoluteLocation[0]+=e.center[0];
				//this.absoluteLocation[1]+=e.center[1];
				//this.absoluteLocation[2]+=e.center[2];
				e=e.parent;
			}*/
			
			var nc=this.normalCenter.absoluteLocation;
			//if(typeof(this.normalCenter.dot())=="undefined") console.log(this.id);
			//this.normalCenter.dot();
			//c.dot();
			//console.log(this.normalCenter);
			this.centerFromNormalCenter.setDirection(this.centerPoint.directions[0]-nc[0],this.centerPoint.directions[1]-nc[1],this.centerPoint.directions[2]-nc[2]);
		}
		//console.log(this.centerPoint);
	}
	this.getPoint=getPoint;
	function getPoint(n) {
		return this.element.points[this.points[n]];
	}
	this.updateNormal=updateNormal;
	function updateNormal() {
		var p=[this.getPoint(0),this.getPoint(1),this.getPoint(2)];
		//console.log(this.points);
		var p0=p[0].getAbsoluteLocation();
		var p1=p[1].getAbsoluteLocation();
		var p2=p[2].getAbsoluteLocation();
		
		/*var temp=this.normalCenter.clone();
		temp.translate(this.centerFromNormalCenter.directions[0],this.centerFromNormalCenter.directions[1],this.centerFromNormalCenter.directions[2]);
		var nc=temp.getAbsoluteLocation();
		var twod=this.renderer.space.threeD(nc[0],nc[1],nc[2]);
		var rc=this.renderer.center();*/
		//this.renderer.paper.dot(twod[0]+rc[0],twod[1]+rc[1]);
		//console.log(twod,rc);
		var vector1=[p1[0]-p0[0],
					p1[1]-p0[1],
					p1[2]-p0[2]];
		var vector2=[p2[0]-p0[0],
					p2[1]-p0[1],
					p2[2]-p0[2]];
		this.normal.setDirection((vector1[1]*vector2[2])-(vector1[2]*vector2[1]),
					(vector1[2]*vector2[0])-(vector1[0]*vector2[2]),
					(vector1[0]*vector2[1])-(vector1[1]*vector2[0]));
		//clog(this.normal.angleBetween(this.centerPoint));
		if (this.normal.dotProduct(this.centerFromNormalCenter)<0) this.normal.flip();
		//console.log(this.centerFromNormalCenter);
		//var tmp=this.normal.unitVector().join(",");
		if (this.inverseNormal) this.normal.flip();
		//clog(this.centerPoint.directions.join(","));
	}
	this.eyeUpdate=eyeUpdate;
	function eyeUpdate() {
		//console.log(this.renderer.space.eye.directions[0]+'+'+this.centerPoint.directions[0]);
		this.eye.setDirection(this.renderer.space.eye.directions[0]+this.centerPoint.directions[0],this.renderer.space.eye.directions[1]+this.centerPoint.directions[1],this.renderer.space.eye.directions[2]+this.centerPoint.directions[2]);
		//clog(this.renderer.space.eye.directions.join(",")+"<br />"+this.element.eye.directions.join(",")+"<br />"+this.eye.directions.join(","));
	}
	this.update=update;
	function update() {
		this.center();
		if (this.points.length>2) {
			this.updateNormal();
			this.eyeUpdate();
			this.eyeToCenterUpdate();
		}
	}
	this.eyeToCenterUpdate=eyeToCenterUpdate;
	function eyeToCenterUpdate() {
		this.eyeToCenter.setDirection(
			this.centerFromCenter.directions[0]+this.renderer.space.eye.directions[0],
			this.centerFromCenter.directions[1]+this.renderer.space.eye.directions[1],
			this.centerFromCenter.directions[2]+this.renderer.space.eye.directions[2]
		);
	}
	this.infront=infront;
	function infront(panel,full) {
		//console.log(full);
		var pan=panel.eyeToCenter.directions;
		var n=panel.normal.unitVector();
		if (full) {
			var frontScore=0;
			var v=[];
			var d=0;
			var dd=0;
			for(var p=0;p<this.points.length;p++) {
				v=this.getPoint(p).getAbsoluteLocation();
				//clog(pan.join(","));
				v[0]+=this.renderer.space.eye.directions[0];
				v[1]+=this.renderer.space.eye.directions[1];
				v[2]+=this.renderer.space.eye.directions[2];
				d=( (n[0]*pan[0]) + (n[1]*pan[1]) + (n[2]*pan[2]) ) / ( (n[0]*v[0]) + (n[1]*v[1]) + (n[2]*v[2]) );
				if(d>0.99 && d<1.01) {
					//this.elementsOnPlane.push(panel);
				}else if(d>1) {
					frontScore++;
					//this.elementsBehind.push(panel);
				}else{
					frontScore--;
				}
				//console.log(ap);
				dd+=d;
			}
			if(frontScore>0) {
				this.elementsBehind.push(panel);
			}else if(frontScore==0) {
				this.elementsOnPlane.push(panel);
			}
			//clog(this.element.type);
			if (this.element.type=='plane') {
				clog(dd);
			}
		}else{
			var v=this.eyeToCenter.directions;
			var d=( (n[0]*p[0]) + (n[1]*p[1]) + (n[2]*p[2]) ) / ( (n[0]*v[0]) + (n[1]*v[1]) + (n[2]*v[2]) );
			//clog(d);
			if(d>0.99 && d<1.01) {
				this.elementsOnPlane.push(panel);
			}else if(d>1) {
				this.elementsBehind.push(panel);
			}
		}
	}
	this.infrontRecord=infrontRecord;
	function infrontRecord() {
		var full=false;
		if (arguments.length>0) full=arguments[0];
		//if(full) console.log(this);
		this.elementsBehind=[];
		this.elementsOnPlane=[];
		//if(this.element.type=="plane") console.log(this.element.faces.length);
		if (this.renderer.sortAllFaces) {
			for(var f=0;f<this.renderer.faces.length;f++) {
				if(this.renderer.faces[f]!=this)  this.infront(this.renderer.faces[f],full);
			}
		}else{
			for(var f=0;f<this.element.faces.length;f++) {
				if(this.element.faces[f]!=this)  this.infront(this.element.faces[f],full);
			}
		}
	}
	this.isinfront=isinfront;
	function isinfront(f) {
		//console.log('Check',f);
		for(var i=0;i<this.elementsBehind.length;i++) {
			if (this.elementsBehind[i]==f) return true;
		}
		return false;
	}
	this.isonplane=isonplane;
	function isonplane(f) {
		for(var i=0;i<this.elementsOnPlane.length;i++) {
			if (this.elementsOnPlane[i]==f) return true;
		}
		return false;
	}
	this.pointOnPlane=pointOnPlane;
	function pointOnPlane(p) {
		var etc=this.eye.directions;
		var n=this.normal.unitVector();
		var v=p.getAbsoluteLocation();
		v[0]+=this.renderer.space.eye.directions[0];
		v[1]+=this.renderer.space.eye.directions[1];
		v[2]+=this.renderer.space.eye.directions[2];
		var d=( (n[0]*etc[0]) + (n[1]*etc[1]) + (n[2]*etc[2]) ) / ( (n[0]*v[0]) + (n[1]*v[1]) + (n[2]*v[2]) );
		if(d>0.99 && d<1.01) {
			return true;
		}else{
			return false;
		}
	}
	this.tintColour=tintColour;
	function tintColour(col) {
		col.resetTint(this.renderer.ambientLight);
		var coc=this.centerFromCenter.directions;
		var tp=new point(this.renderer,this.element,coc[0],coc[1],coc[2]);
		coc=tp.getAbsoluteLocation();
		for(var l=0;l<this.renderer.lights.length;l++) {
			var lightToCenter=this.renderer.lights[l].center.getAbsoluteLocation();
			var theLight=new vector(lightToCenter[0]-coc[0],lightToCenter[1]-coc[1],lightToCenter[2]-coc[2]);
			var a=theLight.dotProduct(this.normal);
			if(a<0) a=0;
			var t=Math.round(255*a);
			t*=1-(theLight.getLength()/this.renderer.lights[l].range);
			t=(t<0)?0:(t>255)?255:t;
			//t=255;
			col.tint(t,this.renderer.lights[l].colour,this.renderer.ambientLight/this.renderer.lights.length);
		}
		return col.hex();
	}
	//this.update();
}
function stroke() {
	var opts=(arguments.length==0)?{}:arguments[0];
	this.colour=(opts==undefined || opts.colour==undefined)?new colour():opts.colour;
	this.width=(typeof(opts)=="undefined" || typeof(opts.width)=="undefined")?1:opts.width;
	this.type=(typeof(opts)=="undefined" || typeof(opts.type)=="undefined")?line_type.none:opts.type;
	this.cap=(typeof(opts)=="undefined" || typeof(opts.cap)=="undefined")?line_cap.butt:opts.cap;
	this.opacity=(typeof(opts)=="undefined" || typeof(opts.opacity)=="undefined")?1:opts.opacity;
	this.clone=clone;
	function clone() {
		return new stroke({colour:this.colour.clone(),width:this.width,type:this.type,cap:this.cap,opacity:this.opacity});
	}
}
var line_cap={
	none:"",
	butt:"butt",
	round:"round",
	square:"square"
}
var line_corner={
	none:"",
	butt:"bevel",
	round:"round",
	square:"miter"
}
var line_type={
	none:'',
	dash:"-",
	dot:".",
	dashdot:"-.",
	dashdotdot:"-..",
	dotspace:". ",
	dashspace:"- ",
	dashdash:"--",
	dashspacedot:"- .",
	dashdashdot:"--.",
	dashdashdotdot:"--.."	
}
function colour() {
	var opts=[100,100,100,1];
	this.fadeTo=null;
	this.negative=null;
	this.showNegative=false;
	this.bottom=null;
	this.fade=0;
	for(var a=0;a<4;a++) {
		if(arguments.length>a) opts[a]=arguments[a];
	}
	this.rgb={
		r:opts[0],
		g:opts[1],
		b:opts[2],
		a:opts[3]
	}
	this.tinted={
		r:opts[0],
		g:opts[1],
		b:opts[2],
		a:opts[3]
	}
	this.setRGB=setRGB;
	function setRGB(r,g,b){
		this.rgb.r=r;
		this.rgb.g=g;
		this.rgb.b=b;
	}
	this.setOpacity=setOpacity;
	function setOpacity(a) {
		return this.rgb.a=a;
	}
	this.opacity=opacity;
	function opacity() {
		return this.tinted.a;
	}
	this.getRGB=getRGB;
	function getRGB() {
		return Raphael.getRGB('rgb('+this.rgb.r+","+this.rgb.g+","+this.rgb.b+')');
	}
	this.hex=hex;
	function hex() {
		var r=Math.round(this.tinted.r).toString(16);
		var g=Math.round(this.tinted.g).toString(16);
		var b=Math.round(this.tinted.b).toString(16);
		while(r.length<2) r='0'+r;
		while(g.length<2) g='0'+g;
		while(b.length<2) b='0'+b;
		return '#'+r+g+b;
	}
	this.clone=clone;
	function clone() {
		var c=new colour(this.rgb.r,this.rgb.g,this.rgb.b,this.rgb.a);
		if(this.fadeTo!==null) c.fadeTo=this.fadeTo.clone();
		if(this.negative!==null) c.negative=this.negative.clone();
		if(this.bottom!==null) c.bottom=this.bottom.clone();
		return c;
	}
	this.resetTint=resetTint;
	function resetTint() {
		var ambient=((arguments.length>0)?arguments[0]:0);
		//this.fade=1;
		if (this.showNegative && this.negative!==null) {
			this.fadedColour={r:this.negative.rgb.r+((this.bottom.rgb.r-this.negative.rgb.r)*this.fade),g:this.negative.rgb.g+((this.bottom.rgb.g-this.negative.rgb.g)*this.fade),b:this.negative.rgb.b+((this.bottom.rgb.b-this.negative.rgb.b)*this.fade),a:this.negative.rgb.a+((this.bottom.rgb.a-this.negative.rgb.a)*this.fade)};
		}else if (this.fadeTo!==null){
			this.fadedColour={r:this.rgb.r+((this.fadeTo.rgb.r-this.rgb.r)*this.fade),g:this.rgb.g+((this.fadeTo.rgb.g-this.rgb.g)*this.fade),b:this.rgb.b+((this.fadeTo.rgb.b-this.rgb.b)*this.fade),a:this.rgb.a+((this.fadeTo.rgb.a-this.rgb.a)*this.fade)};
		}else{
			this.fadedColour={r:this.rgb.r,g:this.rgb.g,b:this.rgb.b,a:this.rgb.a};
		}
		//if (this.fadeTo!==null) {
			/*this.tinted={
				r:(this.rgb.r+((this.fadeTo.rgb.r-this.rgb.r)*this.fade))*ambient,
				g:(this.rgb.g+((this.fadeTo.rgb.g-this.rgb.g)*this.fade))*ambient,
				b:(this.rgb.b+((this.fadeTo.rgb.b-this.rgb.b)*this.fade))*ambient,
				a:(this.rgb.a+((this.fadeTo.rgb.a-this.rgb.a)*this.fade))
			}*/
			//console.log(this.tinted.r,this.tinted.g,this.tinted.b);
		//}else{
			this.tinted={
				r:this.fadedColour.r*ambient,
				g:this.fadedColour.g*ambient,
				b:this.fadedColour.b*ambient,
				a:this.fadedColour.a
			}
		//}
	}
	this.tint=tint;
	function tint(t,col) {
		var ambient=((arguments.length>2)?arguments[2]:0);
		this.tinted.r+=Math.round(this.fadedColour.r*col.rgb.r*t/(255*255));
		this.tinted.g+=Math.round(this.fadedColour.g*col.rgb.g*t/(255*255));
		this.tinted.b+=Math.round(this.fadedColour.b*col.rgb.b*t/(255*255));
		if (this.tinted.r>255) this.tinted.r=255;
		if (this.tinted.g>255) this.tinted.g=255;
		if (this.tinted.b>255) this.tinted.b=255;
		if (this.tinted.r<0) this.tinted.r=0;
		if (this.tinted.g<0) this.tinted.g=0;
		if (this.tinted.b<0) this.tinted.b=0;
	}
}
function light() {
	var opts=(arguments.length==1)?arguments[0]:{};
	this.colour=(opts.colour==undefined)?new colour():opts.colour;
	this.center=(opts.center==undefined)?[0,0,0]:opts.center;
	this.range=(opts.range==undefined)?300:opts.range;
}
function point(renderer,element,x,y,z) {
	//console.log(renderer);
	this.element=element;
	this.renderer=renderer;
	this.location=[x,y,z];
	this.position=[0,0];
	this.absoluteLocation=this.location;
	this.changed=true;
	
	this.dot=dot;
	function dot() {
		this.twod();
		var pos=this.position;
		//var rc=this.renderer.center();
		//console.log(pos);
		
		this.renderer.paper.dot(Math.round(pos[0]),Math.round(pos[1]));
		//this.renderer.tempPaths.push(this.renderer.paper.dot(Math.round(pos[0]+rc[0]),Math.round(pos[1]+rc[1])));
	}
	this.clone=clone;
	function clone() {
		return new point(this.renderer,this.element,this.location[0],this.location[1],this.location[2]);
	}
	this.twod=twod;
	function twod() {
		if (this.changed || (this.element!==null && this.element.hasChanged())) {
			this.getAbsoluteLocation();
			this.position=this.renderer.space.threeD(this.absoluteLocation[0],this.absoluteLocation[1],this.absoluteLocation[2]);
			this.position[0]+=this.renderer.center()[0];
			this.position[1]+=this.renderer.center()[1];
			//console.log(this.position);
			this.changed=false;
		}
	}
	this.getAbsoluteLocation=getAbsoluteLocation;
	function getAbsoluteLocation() {
		if(this.changed || (this.element!==null && this.element.hasChanged())) {
			this.absoluteLocation=this.location;
			var e=this.element;
			while(e!==null) {
				this.rotateFromElementX(e.rotation[0]);
				this.rotateFromElementY(e.rotation[1]);
				this.rotateFromElementZ(e.rotation[2]);
				this.absoluteLocation[0]+=e.center[0];
				this.absoluteLocation[1]+=e.center[1];
				this.absoluteLocation[2]+=e.center[2];
				e=e.parent;
			}
		}
		//console.log(this.absoluteLocation);
		return this.absoluteLocation;
	}
	this.getLength=getLength;
	function getLength() {
		return Math.sqrt(Math.pow(this.location[0],2)+Math.pow(this.location[1],2)+Math.pow(this.location[2],2));
	}
	this.setLocation=setLocation;
	function setLocation(x,y,z) {
		this.location=[x,y,z];
		this.changed=true;
	}
	this.translate=translate;
	function translate(x,y,z) {
		this.location[0]+=x;
		this.location[1]+=y;
		this.location[2]+=z;
		this.changed=true;
	}
	this.rotateX=rotateX;
	function rotateX(a) {
		var r=[0,0,0];
		r[0]=this.location[0];
		r[1]=(this.location[1]*Math.cos(a))-(this.location[2]*Math.sin(a));
		r[2]=(this.location[1]*Math.sin(a))+(this.location[2]*Math.cos(a));
		this.location=r;
		this.changed=true;
	}
	this.rotateY=rotateY;
	function rotateY(a) {
		var r=[0,0,0];
		r[0]=(this.location[0]*Math.cos(a))+(this.location[2]*Math.sin(a));
		r[1]=this.location[1];
		r[2]=(this.location[2]*Math.cos(a))-(this.location[0]*Math.sin(a));
		this.location=r;
		this.changed=true;
	}
	this.rotateZ=rotateZ;
	function rotateZ(a) {
		var r=[0,0,0];
		r[0]=(this.location[0]*Math.cos(a))-(this.location[1]*Math.sin(a));
		r[1]=(this.location[0]*Math.sin(a))+(this.location[1]*Math.cos(a));
		r[2]=this.location[2];
		this.location=r;
		this.changed=true;
	}
	this.rotateFromElementX=rotateFromElementX;
	function rotateFromElementX(a) {
		var r=[0,0,0];
		r[0]=this.absoluteLocation[0];
		r[1]=(this.absoluteLocation[1]*Math.cos(a))-(this.absoluteLocation[2]*Math.sin(a));
		r[2]=(this.absoluteLocation[1]*Math.sin(a))+(this.absoluteLocation[2]*Math.cos(a));
		this.absoluteLocation=r;
		this.changed=true;
	}
	this.rotateFromElementY=rotateFromElementY;
	function rotateFromElementY(a) {
		var r=[0,0,0];
		r[0]=(this.absoluteLocation[0]*Math.cos(a))+(this.absoluteLocation[2]*Math.sin(a));
		r[1]=this.absoluteLocation[1];
		r[2]=(this.absoluteLocation[2]*Math.cos(a))-(this.absoluteLocation[0]*Math.sin(a));
		this.absoluteLocation=r;
		this.changed=true;
	}
	this.rotateFromElementZ=rotateFromElementZ;
	function rotateFromElementZ(a) {
		var r=[0,0,0];
		r[0]=(this.absoluteLocation[0]*Math.cos(a))-(this.absoluteLocation[1]*Math.sin(a));
		r[1]=(this.absoluteLocation[0]*Math.sin(a))+(this.absoluteLocation[1]*Math.cos(a));
		r[2]=this.absoluteLocation[2];
		this.absoluteLocation=r;
		this.changed=true;
	}
}
function vector() {
	this.unit=null;
	this.lengthValue=null;
	if (arguments.length>=3) {
		this.directions=[arguments[0],arguments[1],arguments[2]];
	}else{
		this.directions=[0,0,0];
	}
	//if (arguments.length==4) console.log(this.directions);
	//console.log(this.directions);
	this.setDirection=setDirection;
	function setDirection(x,y,z) {
		//if(isNaN(x)) console.log(x);
		this.directions=[x,y,z];
		this.unit=null;
		this.lengthValue=null;
	}
	this.add=add;
	function add(x,y,z) {
		this.directions[0]+=x;
		this.directions[1]+=y;
		this.directions[2]+=z;
		this.unit=null;
		this.lengthValue=null;
	}
	this.getLength=getLength;
	function getLength() {
		if (this.lengthValue===null) this.lengthValue=Math.sqrt(Math.pow(this.directions[0],2)+Math.pow(this.directions[1],2)+Math.pow(this.directions[2],2));
		return this.lengthValue;
	}
	this.unitVector=unitVector;
	function unitVector() {
		if (this.directions[0]==0 && this.directions[1]==0 && this.directions[2]==0) return [0,0,0];
		if (this.getLength()==0) return [0,0,0];
		if (this.unit===null || isNaN(this.unit[0]) || isNaN(this.unit[1]) || isNaN(this.unit[2])) {
			//if(isNaN(this.directions[0]/this.getLength())) console.log(this.directions[0],this.getLength());
			this.unit=[this.directions[0]/this.getLength(),this.directions[1]/this.getLength(),this.directions[2]/this.getLength()];	
		}
			//if(isNaN(this.unit[0])) console.log(this.directions[0],this.getLength());
		//console.log(unitVector);
		return this.unit;
	}
	this.dotProduct=dotProduct;
	function dotProduct(v) {
		var uv=v.unitVector();
		var tuv=this.unitVector();
		var val=(uv[0] * tuv[0]) + (uv[1] * tuv[1]) + (uv[2] * tuv[2]);
		//clog(uv[0] +'*'+ tuv[0] +'+'+ uv[1] +'*'+ tuv[1] +'+'+ uv[2] +'*'+ tuv[2]+"="+val);
		//console.log(this.directions);
		return val;
	}
	this.flip=flip;
	function flip() {
		this.directions[0]=-this.directions[0];
		this.directions[1]=-this.directions[1];
		this.directions[2]=-this.directions[2];
		this.unit=null;
		this.lengthValue=null;
	}
	this.angleBetween=angleBetween;
	function angleBetween(v) {
		var dp=this.dotProduct(v);
		//if (dp<0) dp=-dp;
		//while(dp>Math.PI*2) dp-=Math.PI*2;
		return (Math.PI/2)-((Math.PI/2)*dp);
	}
	this.rotateX=rotateX;
	function rotateX(a) {
		var r=[0,0,0];
		r[0]=this.directions[0];
		r[1]=(this.directions[1]*Math.cos(a))-(this.directions[2]*Math.sin(a));
		r[2]=(this.directions[1]*Math.sin(a))+(this.directions[2]*Math.cos(a));
		this.directions=r;
		this.unit=null;
		this.lengthValue=null;
	}
	this.rotateY=rotateY;
	function rotateY(a) {
		var r=[0,0,0];
		r[0]=(this.directions[0]*Math.cos(a))+(this.directions[2]*Math.sin(a));
		r[1]=this.directions[1];
		r[2]=(this.directions[2]*Math.cos(a))-(this.directions[0]*Math.sin(a));
		this.directions=r;
		this.unit=null;
		this.lengthValue=null;
	}
	this.rotateZ=rotateZ;
	function rotateZ(a) {
		var r=[0,0,0];
		r[0]=(this.directions[0]*Math.cos(a))-(this.directions[1]*Math.sin(a));
		r[1]=(this.directions[0]*Math.sin(a))+(this.directions[1]*Math.cos(a));
		r[2]=this.directions[2];
		this.directions=r;
		this.unit=null;
		this.lengthValue=null;
	}
	this.clone=clone;
	function clone() {
		return new vector(this.directions[0],this.directions[1],this.directions[2]);
	}
	//if (arguments.length==4) console.log(this.directions);
}
function element(renderer) {
	this.renderer=renderer;
	this.points=[];
	this.faces=[];
	this.center=[0,0,0];
	this.rotation=[0,0,0];
	this.renderLevel=2;
	this.maxRadius=null;
	this.group=(this.renderer.sortAllFaces)?null:this.renderer.paper.group();
	this.position=this.renderer.space.threeD(this.center[0],this.center[1],this.center[2]);
	this.addPoint=addPoint;
	this.showBack=false;
	this.centerCircle=null;
	this.lights=[];
	this.parent=null;
	this.children=[];
	this.showOnOver=null;
	this.id="Element"+this.renderer.elements.length;
	
	this.changed=true;
	
	this.mouseover=null;
	this.mouseup=null;
	this.mouseout=null;
	this.mousemove=null;
	this.mousedown=null;
	
	this.eye=new vector();
	function addPoint(x,y,z) {
		this.points.push(new point(this.renderer,this,x,y,z));
	}
	this.remove=remove;
	function remove() {
		for(var f=0;f<this.faces.length;f++) {
			for(var c=this.renderer.faces.length-1;c>=0;c--) {
				if (this.renderer.faces[c]==this.faces[f]) this.renderer.faces.splice(c,1);
			}

			this.faces[f].path.remove();
			
		}
		if (this.parent!==null) {
			for(var c=this.parent.children.length-1;c>=0;c--) {
				if (this.parent.children[c]==this) this.parent.children.splice(c,1);
			}
		}
		for(var c=this.renderer.elements.length-1;c>=0;c--) {
			if (this.renderer.elements[c]==this) this.renderer.elements.splice(c,1);
		}
	}
	this.addFace=addFace;
	function addFace(pointIndexes,colour,stroke,inverseNormal) {
		var f=null;
		if (arguments.length>4) {
			f=new face(this.renderer,this,pointIndexes,inverseNormal,arguments[4]);
		}else{
			f=new face(this.renderer,this,pointIndexes,inverseNormal);
		}
		f.colour=colour;
		f.stroke=stroke;
		this.faces.push(f);
		this.renderer.faces.push(f);
		//f.parent=this;
		//f.points=pointIndexes;
		//for(var i=0;i<pointIndexes.length;i++) f.points.push(this.points[pointIndexes[i]]);
	}
	this.addLight=addLight;
	function addLight(l) {
		this.lights.push(l);
		l.element=this;
		this.rend.lights.push(l);
	}
	this.mouseover=mouseover;
	function mouseover() {
		for(var f=0;f<this.faces.length;f++) {
			if(this.faces[f].over) {
				//console.log(this);
				return true;
			}
		}
		return false;
	}
	this.hasChanged=hasChanged;
	function hasChanged() {
		if(this.changed) {
			return true;
		}else if(this.parent!==null && this.parent.hasChanged()) {
			return true;
		}
		return false;
	}
	this.twod=twod;
	function twod() {
		this.position=this.renderer.space.threeD(this.center[0],this.center[1],this.center[2]);
	}
	this.translate=translate;
	function translate(x,y,z) {
		//console.log(this.center+" + "+x+","+y+","+z);
		this.center[0]+=x;
		this.center[1]+=y;
		this.center[2]+=z;
		//console.log(this.center+" + "+x+","+y+","+z);
		this.changed=true;
	}
	this.processPositions=processPositions;
	function processPositions() {
		for(var i=0;i<this.points.length;i++) this.points[i].twod();
	}
	this.rotateX=rotateX;
	function rotateX(a) {
		this.rotation[0]+=a;
		this.changed=true;
		//for(var i=0;i<this.points.length;i++) this.points[i].rotateX(a);
	}
	this.rotateY=rotateY;
	function rotateY(a) {
		this.rotation[1]+=a;
		this.changed=true;
		//for(var i=0;i<this.points.length;i++) this.points[i].rotateY(a);
	}
	this.rotateZ=rotateZ;
	function rotateZ(a) {
		this.rotation[2]+=a;
		this.changed=true;
		//for(var i=0;i<this.points.length;i++) this.points[i].rotateZ(a);
	}
	this.centralizePoint=centralizePoint;
	function centralizePoint() {
		var cod=[0,0,0];
		for(var i=0;i<this.points.length;i++) {
			cod[0]+=this.points[i].location[0];
			cod[1]+=this.points[i].location[1];
			cod[2]+=this.points[i].location[2];
		}
		cod[0]/=this.points.length;
		cod[1]/=this.points.length;
		cod[2]/=this.points.length;
		for(var i=0;i<this.points.length;i++) {
			this.points[i].translate(cod[0],cod[1],cod[2]);
		}
		this.maxRadius=null;
		this.changed=true;
	}
	
	this.draw=draw;
	function draw() {
		for(var i=0;i<this.faces.length;i++) {
			this.faces[i].draw();
		}
	}
	
	this.update=update;
	function update() {
		this.preUpdate();
		this.facesort();
		this.postUpdate();
	}
	this.preUpdate=preUpdate;
	function preUpdate() {
		this.eyeUpdate();
		this.twod();
		for(var i=0;i<this.points.length;i++) {
			this.points[i].twod();
		}
		for(var i=0;i<this.faces.length;i++) {
			this.faces[i].update();
		}
	}
	this.postUpdate=postUpdate;
	function postUpdate() {
		for(var i=0;i<this.faces.length;i++) {
			this.faces[i].draw();
		}
		this.setUnchanged();
	}
	this.setUnchanged=setUnchanged;
	function setUnchanged() {
		this.changed=false;
		if(this.parent!==null) this.parent.setUnchanged();
	}
	this.eyeUpdate=eyeUpdate;
	function eyeUpdate() {
		this.eye.setDirection(this.renderer.space.eye.directions[0]+this.center[0],this.renderer.space.eye.directions[1]+this.center[1],this.renderer.space.eye.directions[2]+this.center[2]);
		//clog(this.renderer.space.eye.directions.join(",")+"<br />"+this.eye.directions.join(","));
	}
	this.setCenter=setCenter;
	function setCenter(x,y,z) {
		if (x!==null) this.center[0]=x;
		if (y!==null) this.center[1]=y;
		if (z!==null) this.center[2]=z;
		//this.update();
		this.changed=true;
	}
	this.setRotation=setRotation;
	function setRotation(x,y,z) {
		if (x!==null) this.rotation[0]=x;
		if (y!==null) this.rotation[1]=y;
		if (z!==null) this.rotation[2]=z;
		//this.update();
		this.changed=true;
	}
	this.showCenter=showCenter;
	function showCenter() {
		var xy=[this.renderer.center[0]-this.position[0],this.renderer.center[1]-this.position[1]];
		if (this.centerCircle==null) {
			this.centerCircle=this.renderer.paper.circle(xy[0],xy[1],3).attr({fill:'#f00'});
		}else{
			//console.log(this.position);
			this.centerCircle.attr({cx:xy[0],cy:xy[1]});
		}
	}
	this.outerRadius=outerRadius;
	function outerRadius() {
		if (this.maxRadius===null) {
			this.maxRadius=0;
			for(var p=0;p<this.points.length;p++) {
				var pl=this.points[p].getLength();
				if (pl>this.maxRadius) this.maxRadius=pl;
			}
		}
		return this.maxRadius;
	}
	this.facesort=facesort;
	function facesort() {
		switch(this.renderLevel) {
			case 1:
				this.faces.sort(this.renderer.sortDistance);
			break;
			case 2:
				this.faces.sort(this.renderer.sortDistance);
			break;
			case 3:
				for(var f=0;f<this.faces.length;f++) this.faces[f].infrontRecord();
				this.faces.sort(this.renderer.sortAlgorithm);
			break;
			case 4:
				for(var f=0;f<this.faces.length;f++) this.faces[f].infrontRecord();
				this.faces.sort(this.renderer.sortAlgorithm);
			break;
		}
		/*for(var f=0;f<this.faces.length;f++) {
			if (this.faces[f].path) this.faces[f].path.toFront();
		}*/
	}
	this.sortAlgorithm=sortAlgorithm;
	function sortAlgorithm(a,b) {
		var order=0;
		if(a.isonplane(b)){
			if(a.eyeToCenter.getLength()<b.eyeToCenter.getLength()) {
				order++;
			}else{
				order--;
			}
		}
		if(order==0) {
			if(a.isinfront(b)) order++;
			if(b.isinfront(a)) order--;
			//order=a.elementsBehind.length-b.elementsBehind.length;
		}
		if (order==0) {
			if(a.eyeToCenter.getLength()<b.eyeToCenter.getLength()) {
				order++;
			}else{
				order--;
			}
		}
		return order;
	}
	this.sortDistance=sortDistance;
	function sortDistance(a,b) {
		var order=0;
		if(a.eyeToCenter.getLength()<b.eyeToCenter.getLength()) {
			order++;
		}else{
			order--;
		}
		return order;
	}
}
function renderer(opts) {
	
	this.sortAllFaces=true;
	this.faces=[];
	this.renderLevel=4;
	this.targetElement=opts.target;
	this.width=(opts.width==undefined)?this.targetElement.clientWidth:opts.width;
	this.height=(opts.height==undefined)?this.targetElement.clientHeight:opts.height;
	this.ambientLight=(opts.ambient==undefined)?0:opts.ambient; // max is 1 which show the object full colour in the shade
	//this.width=(opts.width==undefined)?null:opts.width;
	//this.height=(opts.height==undefined)?null:opts.height;
	//console.log(this.width);
	//console.log(this.height);
	var d = new Date();
	this.id=(opts.id==undefined)?'svg'+d.getTime():opts.id;
	this.paper=new svg_canvas(this.targetElement);
	//this.paper = Raphael(0, 0, opts.width, opts.height);
	this.lights=[];
	//var tmp=$('svg').get();
	//this.svg=tmp.pop();
	//this.targetElement.appendChild(this.svg);
	for(var k in opts.css) {
		if (typeof(opts.css[k])=="string") $(this.paper.canvas).css(k,opts.css[k]);
	}
	if (opts.applyClass!=undefined) $(this.paper.canvas).addClass(opts.applyClass);
	//if (typeof(opts.class)!="undefined") $(this.paper.canvas).addClass(opts.class);
	this.opts=opts;
	
	
	
	//this.center=[this.width/2,this.height/2];
	this.space=new space();
	this.space.fromEye=(typeof(opts.fromEye)=="number")?opts.fromEye:250;
	//console.log(this.space.fromEye,typeof(opts.fromEye));
	this.space.onscreen=(typeof(opts.onscreen)!="undefined")?opts.onscreen:Math.min(this.width,this.height);
	this.space.fov=(typeof(opts.fov)!="undefined")?opts.fov:Math.PI/4;
	this.space.yaw=(typeof(opts.yaw)!="undefined")?opts.yaw:0;
	this.space.elevation=(typeof(opts.elevation)!="undefined")?opts.elevation:0;
		//console.log(opts);
	this.elements=[];
	this.groups=[];
	this.center=center;
	function center() {
		return [this.targetElement.clientWidth/2,this.targetElement.clientHeight/2];
	}
	this.width=width;
	function width() {
		return this.targetElement.clientWidth;
	}
	this.height=height;
	function height() {
		return this.targetElement.clientHeight;
	}
	this.createElement=createElement;
	function createElement(opts) {
		var ne=new element(this);
		this.elements.push(ne);
		return ne;
	}
	this.group=group;
	function group(eles) {
		var ne=new element(this);
		this.groups.push(ne);
		for(var i=0;i<eles.length;i++) {
			eles[i].parent=ne;
		}
		ne.children=eles;
		return ne;
	}
	this.addToGroup=addToGroup;
	function addToGroup(group,child) {
		child.parent=group;
		group.children.push(child);
	}
	this.draw=draw;
	function draw() {
		this.update();
		//for(var i=0;i<this.elements.length;i++) {
			//console.log(this.elements[i]);
		//	this.elements[i].draw();
		//}
	}
	this.update=update;
	function update() {
		var finishHandler=null;
		if (arguments.length>0) finishHandler=arguments[0];
		this.space.update({});
		if (!this.sortAllFaces) {
			this.elements.sort(this.sortElements);
			for(var i=0;i<this.elements.length;i++) {
				this.elements[i].group.toFront();
			}
			for(var i=0;i<this.elements.length;i++) {
				this.elements[i].changed=true;
				this.elements[i].update();
			}
		}else{
			for(var i=0;i<this.elements.length;i++) {
				this.elements[i].changed=true;
				this.elements[i].preUpdate();
			}
			for(var i=0;i<this.elements.length;i++) {
				this.elements[i].postUpdate();
			}
			this.facesort();
			//var lg=[];
			for(var i=0;i<this.faces.length;i++) {
				//var c=100+(100*(i/this.faces.length));
				//this.faces[i].colour=new colour(c,c,c);
				//lg+="<div>"+this.faces[i].element.type+"</div>";
				if (this.faces[i].path!==null) 
					this.faces[i].path.toFront();
			}
			for(var i=0;i<this.tempPaths.length;i++) {
				this.tempPaths[i].parentNode.appendChild(this.tempPaths[i]);
			}
			//clog(lg);
		}
		for(var i=0;i<this.elements.length;i++) {
			this.elements[i].draw();
		}
		if (finishHandler!==null) finishHandler();
	}
	this.addLight=addLight;
	function addLight(l) {
		this.lights.push(l);
	}
	this.facesort=facesort;
	function facesort() {
		switch(this.renderLevel) {
			case 1:
				this.faces.sort(this.sortDistance);
			break;
			case 2:
				this.faces.sort(this.sortDistance);
			break;
			case 3:
				for(var f=0;f<this.faces.length;f++) this.faces[f].infrontRecord();
				this.faces.sort(this.sortAlgorithm);
				//console.log(this.faces);
			break;
			case 4:
				if(this.sortAllFaces) {
					this.faceCombinations();
				}else{
					for(var f=0;f<this.faces.length;f++) this.faces[f].infrontRecord(true);
				}
				this.sortTemp=[];
				//this.faces.sort(this.sortAlgorithmAmountBehind);
				this.complexFaceSort();
				//this.faces.sort(this.sortAlgorithm);
			break;
		}
	}
	this.sortElements=sortElements;
	function sortElements(a,b){
		return b.eye.getLength()-a.eye.getLength();
	}
	this.sortAlgorithmAmountBehind=sortAlgorithmAmountBehind;
	function sortAlgorithmAmountBehind(a,b) {
		return a.elementsBehind.length-b.elementsBehind.length;
	}
	this.sortTemp=[];
	this.complexFaceSort=complexFaceSort;
	function complexFaceSort() {
		var complete=false;
		var i=0;
		while(!complete && i<10) {
			var changed=false;
			for(var f1=0;f1<this.faces.length;f1++) {
				if(this.faces[f1].elementsBehind.length>0) {
					var highest=f1;
					for(var f2=0;f2<this.faces.length;f2++) {
						if (this.faces[f1].isinfront(this.faces[f2])) highest=f2;
					}
					if(highest>f1) {
						var tmp=this.faces[f1];
						this.faces.splice(f1,1);
						this.faces.splice(f2,0,tmp);
						changed=true;
					}
				}
			}
			if(!changed) complete=true;
			i++;
		}
	}
	this.sortAlgorithm=sortAlgorithm;
	function sortAlgorithm(a,b) {
		var order=0;
		/*if(a.isonplane(b)) {
			for(var i=0;i<b.elementsBehind.length;i++) {
				if(a.isonplane(b.elementsBehind[i])) {
					for(var j=0;j<b.elementsBehind[i].elementsBehind.length;j++) {
						if(a.isinfront(b.elementsBehind[i].elementsBehind[j])) order++;
						if(b.elementsBehind[i].elementsBehind[j].isinfront(a)) order--;
					}
				}else{
					if(a.isinfront(b.elementsBehind[i])) order++;
					if(b.elementsBehind[i].isinfront(a)) order--;
				}
			}
		}*/
		//if(order==0) {
			//if(a.isinfront(b)) console.log(a.id+" in front of "+b.id);
			//if(b.isinfront(a)) console.log(b.id+" in front of "+a.id);
			if(a.isinfront(b)) order++;
			if(b.isinfront(a)) order--;
			//rend.sortTemp.push(a.id+","+b.id+"="+order);
			//order=a.elementsBehind.length-b.elementsBehind.length;
		//}
		/*if(order==0 && a.isonplane(b)){
			if(a.eye.getLength()<b.eye.getLength()) {
				order++;
			}else{
				order--;
			}
		}
		if (order==0) {
			if(a.eye.getLength()<b.eye.getLength()) {
				order++;
			}else{
				order--;
			}
		}*/
		if (order>1) order=1;
		if (order<-1) order=-1;
		return order;
	}
	this.sortDistance=sortDistance;
	function sortDistance(a,b) {
		var order=0;
		if(a.eye.getLength()<b.eye.getLength()) {
			order++;
		}else{
			order--;
		}
		return order;
	}
	this.fCombi=[];
	this.faceCombinations=faceCombinations;
	function faceCombinations() {
		this.fCombi=[];
		this.removePaths();
		var rc=this.center();
			//console.log(this.faces);
		if(this.faces.length>1) {
			for(var i=0;i<this.faces.length;i++) {
				this.faces[i].elementsBehind=[];
				this.faces[i].elementsOnPlane=[];
			}
			for(var i=0;i<this.faces.length-1;i++) {
				if(this.faces[i].show()) {
					for(var j=i+1;j<this.faces.length;j++) {
						if(this.faces[j].show()) {
							if (specificPoints=this.overlap(this.faces[i],this.faces[j])) {
								this.fCombi.push([this.faces[i],this.faces[j],specificPoints]);
							}else{
								//console.log(this.faces[i].id+" does not touch "+this.faces[j].id);
							}
						}
					}
				}
			}
			//console.log(this.fCombi.length);
			//var dd=[];
			for(var c=0;c<this.fCombi.length;c++) {
				var frontScore=0;
				var fa=this.fCombi[c][0];
				var fb=this.fCombi[c][1];
				var specificPoints=this.fCombi[c][2];
				if(typeof(specificPoints)!="undefined" && typeof(specificPoints.length)=="undefined") {
				//if(true){
					var v=[];
					var d=0;
					var faetc=fa.eye.directions;
					//clog(faetc.join(','));
					var fan=fa.normal.unitVector();
					for(var p=0;p<fb.points.length;p++) {
						v=fb.getPoint(p).getAbsoluteLocation();
						v[0]+=this.space.eye.directions[0];
						v[1]+=this.space.eye.directions[1];
						v[2]+=this.space.eye.directions[2];
						//if(p==0) clog(this.space.eye.directions.join(',')+" | "+faetc.join(',')+" | "+v.join(','));
						d=( (fan[0]*faetc[0]) + (fan[1]*faetc[1]) + (fan[2]*faetc[2]) ) / ( (fan[0]*v[0]) + (fan[1]*v[1]) + (fan[2]*v[2]) );
						if(d>0.99 && d<1.01) {
							//this.elementsOnPlane.push(panel);
						}else if(d>1) {
							frontScore++;
						}else if(d>0) {
							frontScore--;
						}
					//dd.push(d.toFixed(2));
					}
					var fbetc=fb.eye.directions;
					var fbn=fb.normal.unitVector();
					for(var p=0;p<fa.points.length;p++) {
						v=fa.getPoint(p).getAbsoluteLocation();
						v[0]+=this.space.eye.directions[0];
						v[1]+=this.space.eye.directions[1];
						v[2]+=this.space.eye.directions[2];
						d=( (fbn[0]*fbetc[0]) + (fbn[1]*fbetc[1]) + (fbn[2]*fbetc[2]) ) / ( (fbn[0]*v[0]) + (fbn[1]*v[1]) + (fbn[2]*v[2]) );
						if(d>0.99 && d<1.01) {
							//this.elementsOnPlane.push(panel);
						}else if(d>1) {
							frontScore--;
						}else if(d>0) {
							frontScore++;
						}
					//dd.push(d.toFixed(2));
					}
					var ca=150+(10*frontScore);
					var cb=150-(10*frontScore);
				}else{
					// specificPoints[0] is the face which owns the point to check
					// console.log(specificPoints);
					var flipped=false;
					if(fa==specificPoints[0]) {
						fa=fb;
						fb=specificPoints[0];
						flipped=true;
						//console.log(specificPoints[0]);
					}else{
					}
					//console.log(fa.id,fb.id,flipped);
					var d=0;
					var faetc=fa.eye.directions;
					//clog(faetc.join(','));
					var fan=fa.normal.unitVector();
					for(var p=0;p<specificPoints[1].length;p++) {
						v=specificPoints[1][p].getAbsoluteLocation();
						v[0]+=this.space.eye.directions[0];
						v[1]+=this.space.eye.directions[1];
						v[2]+=this.space.eye.directions[2];
						//if(p==0) clog(this.space.eye.directions.join(',')+" | "+faetc.join(',')+" | "+v.join(','));
						d=( (fan[0]*faetc[0]) + (fan[1]*faetc[1]) + (fan[2]*faetc[2]) ) / ( (fan[0]*v[0]) + (fan[1]*v[1]) + (fan[2]*v[2]) );
						/*var checks=[0,1];
							if(specificPoints[2]&&((fa.id=="face"+checks[0] && fb.id=="face"+checks[1]) || (fb.id=="face"+checks[0] && fa.id=="face"+checks[1]))) {
								specificPoints[1][p].twod();
								var pos=specificPoints[1][p].position;
								this.tempPaths.push(this.paper.dot(Math.round(pos[0]),Math.round(pos[1])));
								//clog(pos.join(","));
								console.log(specificPoints[1][p]);
								if(fb.id=='face'+checks[0]) fb.colour=new colour(255,0,0);
								if(fa.id=='face'+checks[0]) fa.colour=new colour(255,0,0);
								if(fb.id=='face'+checks[1]) fb.colour=new colour(0,0,255);
								if(fa.id=='face'+checks[1]) fa.colour=new colour(0,0,255);
							}*/
						if(d>0.99 && d<1.01) {
							//this.elementsOnPlane.push(panel);
						}else if(d>1) {
							frontScore++;
							/*if((fa.id=="face30" && fb.id=="face35") || (fb.id=="face30" && fa.id=="face35")) {
								//var pos=this.space.threeD(v[0],v[1],v[2]);
								var pos=specificPoints[1][p].position;
								this.tempPaths.push(this.paper.dot(pos[0],pos[1]));
								clog(specificPoints[0].id+" : "+fa.id+","+fb.id+"="+d+" ["+specificPoints[1][p].getAbsoluteLocation().join(",")+"]");
								if(fb.id=='face30') fb.colour=new colour(255,0,0);
								if(fa.id=='face30') fa.colour=new colour(255,0,0);
								if(fb.id=='face35') fb.colour=new colour(0,0,255);
								if(fa.id=='face35') fa.colour=new colour(0,0,255);
							}*/
						}else if(d>0) {
							frontScore--;
							/*if((fa.id=="face30" && fb.id=="face35") || (fb.id=="face30" && fa.id=="face35")) {
								//var pos=this.space.threeD(v[0],v[1],v[2]);
								var pos=specificPoints[1][p].position;
								this.tempPaths.push(this.paper.dot(pos[0],pos[1]));
								clog(specificPoints[0].id+" : "+fa.id+","+fb.id+"="+d+" ["+specificPoints[1][p].getAbsoluteLocation().join(",")+"]");
								if(fb.id=='face30') fb.colour=new colour(255,0,0);
								if(fa.id=='face30') fa.colour=new colour(255,0,0);
								if(fb.id=='face35') fb.colour=new colour(0,0,255);
								if(fa.id=='face35') fa.colour=new colour(0,0,255);
							}*/
							/*if(fa.id=="face0" && fb.id=="face35") {
								var pos=this.space.threeD(v[0],v[1],v[2]);
								var pos=specificPoints[1][p].position;
								this.tempPaths.push(this.paper.dot(pos[0],pos[1]));
								clog(specificPoints[0].id+" : "+fa.id+","+fb.id+"="+d+" ["+specificPoints[1][p].getAbsoluteLocation().join(",")+"]");
							}*/
						//if(fa.id=="face0") clog(specificPoints[0].id+" : "+fa.id+","+fb.id+"="+d+" ["+specificPoints[1][p].getAbsoluteLocation().join(",")+"]");
						}
						//console.log(d);
					//dd.push(d.toFixed(2));
					}
					//if(flipped) frontScore=-frontScore;
							//if(fa.id=="face30" && fb.id=="face35") clog((frontScore>0)?'35 in front of 30':'30 in front of 35');
					//for(var s=0;s<specificPoints[1].length;s++) {
						//console.log(specificPoints[s]);
					//}
				}
				//dd.push(frontScore);
				if(frontScore>0) {
					fb.elementsBehind.push(fa);
					//fb.colour=new colour(ca,ca,ca);
					//fa.colour=new colour(cb,cb,cb);
				}else if(frontScore==0) {
					fb.elementsOnPlane.push(fa);
					fa.elementsOnPlane.push(fb);
					//console.log(fa,fb);
				}else{
					fa.elementsBehind.push(fb);
					//fa.colour=new colour(cb,cb,cb);
					//fb.colour=new colour(ca,ca,ca);
				}
				//console.log(frontScore);
				//clog(dd.join(","));
				/*if (this.element.type=='plane') {
					clog(dd);
				}*/
				//console.log(frontScore);
			}
		}
	}
	this.overlap=overlap;
	function overlap(f1,f2) {
		var specificPoints=[];
		var checkDistance=false;
		if(checkDistance) {
			var c1=[0,0];
			for(var i=0;i<f1.points.length;i++) {
				var p=f1.element.points[f1.points[i]].position;
				c1[0]+=p[0];
				c1[1]+=p[1];
			}
			c1[0]/=f1.points.length;
			c1[1]/=f1.points.length;
			var radius1=0;
			for(var i=0;i<f1.points.length;i++) {
				var p=f1.element.points[f1.points[i]].position;
				var r=Math.sqrt(Math.pow(p[0]-c1[0],2)+Math.pow(p[1]-c1[1],2));
				if (r>radius1) radius1=r;
			}
			var c2=[0,0];
			for(var i=0;i<f2.points.length;i++) {
				var p=f2.element.points[f2.points[i]].position;
				c2[0]+=p[0];
				c2[1]+=p[1];
			}
			c2[0]/=f2.points.length;
			c2[1]/=f2.points.length;
			var radius2=0;
			for(var i=0;i<f2.points.length;i++) {
				var p=f2.element.points[f2.points[i]].position;
				var r=Math.sqrt(Math.pow(p[0]-c2[0],2)+Math.pow(p[1]-c2[1],2));
				if (r>radius2) radius2=r;
			}
			var r=Math.sqrt(Math.pow(c1[0]-c2[0],2)+Math.pow(c1[1]-c2[1],2));
			if(r>radius1+radius2) return false;
		}
		//console.log(f1,f2);
		/*if(this.polygonsCrossed(f1,f2)
								//|| this.polygonsCrossed(f2,f1)
													   //|| this.polygonsCrossed(f1,f2) || this.polygonsCrossed(f2,f1)
													   ) {
			f1.colour=new colour(255,0,0);
			f2.colour=new colour(255,0,0);
		}else{
			f1.colour=new colour(100,100,100);
			f2.colour=new colour(100,100,100);
		}*/
		var bothPolygons=(f1.points.length>2)&&(f2.points.length>2);
		if (bothPolygons) {
			if(specificPoints=this.pointInside(f1,f2)) return (specificPoints.length>0)?[f1,specificPoints]:true;
			if(specificPoints=this.pointInside(f2,f1)) return (specificPoints.length>0)?[f2,specificPoints]:true;
		}
		if(specificPoints=this.polygonsCrossed(f1,f2)) return (specificPoints.length>0)?[f1,specificPoints,true]:true;
		if(specificPoints=this.polygonsCrossed(f2,f1)) return (specificPoints.length>0)?[f2,specificPoints,true]:true;
		//if(this.polygonsCrossed(f2,f1)) return true;
		return false;
	}
	this.tempPaths=[];
	this.removePaths=removePaths;
	function removePaths() {
		while(this.tempPaths.length>0) {
			var r=this.tempPaths.pop();
			if(r.element) {
				r.element.parentNode.removeChild(r.element);
			}else{
				r.parentNode.removeChild(r);
			}
		}
	}
	this.pointInside=pointInside;
	function pointInside(ps,f) {
		var specificPoints=[];
		var rc=[0,0];
		var offset=[-2000,-2000];
		for(var p=0;p<ps.points.length;p++) {
			var crossed=0;
			var pv=[ps.element.points[ps.points[p]].position[0],ps.element.points[ps.points[p]].position[1]];
			//console.log(pv);
			pv[0]-=offset[0];
			pv[1]-=offset[1];
			var pl=Math.sqrt(Math.pow(pv[0],2)+Math.pow(pv[1],2));
			var upv=[pv[0]/pl,pv[1]/pl];
			var check=true;
			for(var v=0;v<f.points.length;v++) {
				if(f.getPoint(v)==ps.getPoint(p)) check=false;
			}
			if (check && f.pointOnPlane(ps.element.points[ps.points[p]])) check=false;
			//this.tempPaths.push(ps.renderer.paper.path('M'+Math.round(rc[0]+offset[0])+','+Math.round(rc[1]+offset[1])+'L'+Math.round(rc[0]+pv[0]+offset[0])+','+Math.round(rc[1]+pv[1]+offset[1])+'Z',{stroke:'black'}));
			if (check) {
			//console.log(upv,pl);
				for(var v=0;v<f.points.length;v++) {
					var f1=f.element.points[f.points[v]].position;
					var f2=f.element.points[((v+1>=f.points.length)?f.points[0]:f.points[v+1])].position;
					var vect=[f2[0]-f1[0],f2[1]-f1[1]];
					var l=Math.sqrt(Math.pow(vect[0],2)+Math.pow(vect[1],2));
					var uv=[vect[0]/l,vect[1]/l];
					//var pd=((f1[0]*uv[1])-(f1[1]*uv[0])+(p1[1]*uv[0])-(p1[0]*uv[1]))/((uv[1]*upv[0])-(uv[0]*upv[1]));
					var pd=((f1[0]*uv[1])-(f1[1]*uv[0])+(offset[1]*uv[0])-(offset[0]*uv[1]))/((uv[1]*upv[0])-(uv[0]*upv[1]));
					//console.log(pd,pl);
					//this.tempPaths.push(ps.renderer.paper.path('M'+Math.round(rc[0]+f1[0])+','+Math.round(rc[1]+f1[1])+'L'+Math.round(rc[0]+f1[0]+vect[0])+','+Math.round(rc[1]+f1[1]+vect[1])+'Z',{stroke:'blue','stroke-width':'3'}));
					if (pd<pl-1 && pd>0) {
						var vd=((upv[0]*pd)-f1[0]+offset[0])/uv[0];
						//console.log(vd,l);
						if (vd<=l && vd>0) {
							//specificPoints.push(ps.getPoint(p));
							crossed++;
						}
					}
				}
			}
			//console.log(crossed);
			if(crossed % 2 == 1) {
				specificPoints.push(ps.getPoint(p));
				/*if(f.id=="face0" || ps.id=="face0") {
								var pos=ps.getPoint(p).position;
								this.tempPaths.push(this.paper.dot(Math.round(pos[0]),Math.round(pos[1])));
								//this.tempPaths.push(ps.renderer.paper.path('M'+Math.round(rc[0]+offset[0])+','+Math.round(rc[1]+offset[1])+'L'+Math.round(rc[0]+pv[0]+offset[0])+','+Math.round(rc[1]+pv[1]+offset[1])+'Z',{stroke:'black'}));
				}*/
			}
		}
		return (specificPoints.length>0)?specificPoints:false;
	}
	this.polygonsCrossed=polygonsCrossed;
	function polygonsCrossed(ps,f) {
		var rc=[0,0];
		var specificPoints=[];
		for(var p=0;p<ps.points.length;p++) {
			var pp=p+1;
			if(pp>=ps.points.length) pp=0;
			var p1=ps.element.points[ps.points[p]].position;
			var p2=ps.element.points[ps.points[pp]].position;
			var pv=[p2[0]-p1[0],p2[1]-p1[1]];
			var pl=Math.sqrt(Math.pow(pv[0],2)+Math.pow(pv[1],2));
			var upv=[pv[0]/pl,pv[1]/pl];
			var check=true;
			for(var v=0;v<f.points.length-1;v++) {
				if(f.getPoint(v)==ps.getPoint(p) || f.getPoint(((v+1>=f.points.length)?0:f.points[v+1]))==ps.getPoint(p)) check=false;
			}
			/*if (ps.id=="face30") {
				this.tempPaths.push(this.paper.path('M'+Math.round(rc[0]+p1[0])+','+Math.round(rc[1]+p1[1])+'L'+Math.round(rc[0]+p2[0])+','+Math.round(rc[1]+p2[1])+'Z',{stroke:'red','stroke-width':'3'}).element);
			}*/
			if (check) {
				for(var v=0;v<f.points.length;v++) {
					if (f.points.length>2 || v<f.points.length-1) {
						var vv=v+1;
						if(vv>=f.points.length) vv=0;
						var f1=f.element.points[f.points[v]].position;
						var f2=f.element.points[f.points[vv]].position;
						var vect=[f2[0]-f1[0],f2[1]-f1[1]];
						//this.tempPaths.push(this.paper.path('M'+Math.round(rc[0]+f1[0])+','+Math.round(rc[1]+f1[1])+'L'+Math.round(rc[0]+f2[0])+','+Math.round(rc[1]+f2[1])+'Z',{stroke:'blue','stroke-width':'3'}));
						var l=Math.sqrt(Math.pow(vect[0],2)+Math.pow(vect[1],2));
						var uv=[vect[0]/l,vect[1]/l];
						var pd=((f1[0]*uv[1])-(f1[1]*uv[0])+(p1[1]*uv[0])-(p1[0]*uv[1]))/((uv[1]*upv[0])-(uv[0]*upv[1]));
						if (pd<=pl && pd>0) {
							var vd=((upv[0]*pd)-f1[0]+p1[0])/uv[0];
							if (vd<=l-0.05 && vd>0.05) {
								//var p31=ps.element.points[ps.points[p]].getAbsoluteLocation();
								//var p33=ps.element.points[ps.points[pp]].getAbsoluteLocation();
								var p31l=ps.element.points[ps.points[p]].location;
								var p31=[p31l[0],p31l[1],p31l[2]];
								var p32l=ps.element.points[ps.points[pp]].location;
								var p32=[p32l[0],p32l[1],p32l[2]];
								var v3=new vector(p32[0]-p31[0],p32[1]-p31[1],p32[2]-p31[2]);
								var v3u=v3.unitVector();
								var v3l=v3.getLength();
								var prop=v3l*(pd/pl);
								//prop=v3l;
								p31[0]+=prop*v3u[0];
								p31[1]+=prop*v3u[1];
								p31[2]+=prop*v3u[2];
								//console.log(p31);
				
								//specificPoints.push(new point(f1.renderer,null,f1[0]+(vd*uv[0]),f1[1]+(vd*uv[1]),f1[2]+(vd*uv[2])));
								var sp=new point(this,ps.element,p31[0],p31[1],p31[2]);
								specificPoints.push(sp);
								//sp.twod();
									//this.tempPaths.push(this.paper.dot(sp.position[0],sp.position[1]));
				/*if (ps.id=="face30") {
					//console.log(p,pp);
					this.tempPaths.push(this.paper.path('M'+Math.round(rc[0]+f1[0])+','+Math.round(rc[1]+f1[1])+'L'+Math.round(rc[0]+f2[0])+','+Math.round(rc[1]+f2[1])+'Z',{stroke:'red','stroke-width':'3'}).element);
				}*/
							}
						}
					}
				}
			}
		}
		return (specificPoints.length>0)?specificPoints:false;
	}
}