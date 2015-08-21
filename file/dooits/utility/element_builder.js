var element_builder={
	cube:{
		build:function(rend,opts) {
			var col=(opts.colour==undefined)?new colour():opts.colour;
			var strokeObject=(opts.stroke==undefined)?new stroke():opts.stroke;
			var ne=rend.createElement(opts);
			ne.build_options=opts;
			ne.showBack=(opts.back==undefined)?opts.back:false;
			ne.renderLevel=1;
			
			
			var data=this.data(opts);
			for(var p=0;p<data.points.length;p++) {
				ne.addPoint(data.points[p][0],data.points[p][1],data.points[p][2]);
			}
			for(var f=0;f<data.faces.length;f++) {
				ne.addFace(data.faces[f],col,strokeObject,false);
			}
			//console.log(col);
			//console.log("Faces added");
			//console.log(ne.faces);
			//console.log(ne);
			//console.log(ne.points);
			ne.type='cube';
			ne.update();
			return ne
		},
		data:function(opts) {
			var reply={
				points:[],
				faces:[]
			};
			var pw=opts.width/2;
			reply.points.push([-pw,-pw,-pw]);
			reply.points.push([-pw,pw,-pw]);
			reply.points.push([pw,pw,-pw]);
			reply.points.push([pw,-pw,-pw]);
			reply.points.push([-pw,-pw,pw]);
			reply.points.push([-pw,pw,pw]);
			reply.points.push([pw,pw,pw]);
			reply.points.push([pw,-pw,pw]);
			
			reply.faces.push([0,1,2,3]);
			reply.faces.push([0,1,5,4]);
			reply.faces.push([1,2,6,5]);
			reply.faces.push([2,3,7,6]);
			reply.faces.push([3,0,4,7]);
			reply.faces.push([4,5,6,7]);
			return reply;
		}
	},
	torus:{
		build:function(rend,opts) {
			var ne=rend.createElement(opts);
			var col=(typeof(opts.colour)=="undefined")?new colour():opts.colour;
			var strokeObject=(opts.stroke==undefined)?new stroke():opts.stroke;
			ne.showBack=(typeof(opts.back)!="undefined")?opts.back:false;
			ne.renderLevel=1;
			ne.build_options=opts;
			
			var data=this.data(rend,ne,ne.build_options);
			for(var p=0;p<data.points.length;p++) {
				ne.addPoint(data.points[p][0],data.points[p][1],data.points[p][2]);
			}
			for(var f=0;f<data.faces.length;f++) {
				ne.addFace(data.faces[f][0],col,strokeObject,false,data.faces[f][1]);
			}
			ne.rebuilder=function(opts) {
				element_builder.torus.rebuild(this,opts);
			};
			ne.type='torus';
			return ne;
		},
		rebuild:function(ele,opts) {
			if(opts.colour!=undefined) ele.build_options.colour=opts.colour;
			if(opts.stroke!=undefined) ele.build_options.stroke=opts.stroke;
			if(opts.majorRadius!=undefined) ele.build_options.majorRadius=opts.majorRadius;
			if(opts.minorRadius!=undefined) ele.build_options.minorRadius=opts.minorRadius;
			var data=this.data(ele.renderer,ele,ele.build_options);
			for(var p=0;p<data.points.length;p++) {
				ele.points[p].location=data.points[p];
			}
			for(var f=0;f<data.faces.length;f++) {
				ele.faces[f].points=data.faces[f][0];
				ele.faces[f].colour=ele.build_options.colour;
				ele.faces[f].stroke=ele.build_options.stroke;
				//ele.faces[f].normalCenter=data.points[f][1];
			}
		},
		data:function(rend,ne,opts) {
			var reply={
				points:[],
				faces:[]
			};
			var majorRadius=(typeof(opts.majorRadius)!="undefined")?opts.majorRadius:100;
			var minorRadius=(typeof(opts.minorRadius)!="undefined")?opts.minorRadius:10;
			var majorSegments=(typeof(opts.majorSegments)!="undefined")?opts.majorSegments:10;
			var minorSegments=(typeof(opts.minorSegments)!="undefined")?opts.minorSegments:10;
			for(var seg=0;seg<majorSegments;seg++) {
				var majorAngle=seg*Math.PI*2/majorSegments;
				for(var miniseg=0;miniseg<minorSegments;miniseg++) {
					var minorAngle=miniseg*Math.PI*2/minorSegments;
					var x=(majorRadius+(minorRadius*Math.sin(minorAngle)))*Math.sin(majorAngle);
					var y=(majorRadius+(minorRadius*Math.sin(minorAngle)))*Math.cos(majorAngle);
					var z=minorRadius*Math.cos(minorAngle);
					reply.points.push([x,y,z]);
				}
			}
			for(var seg=0;seg<majorSegments;seg++) {
				var majorAngle=(seg+0.5)*Math.PI*2/majorSegments;
				var segCenter=new point(rend,ne,majorRadius*Math.sin(majorAngle),majorRadius*Math.cos(majorAngle),0);
				for(var miniseg=0;miniseg<minorSegments;miniseg++) {
					var fi=(minorSegments*seg)+miniseg;
					var ni=fi+((miniseg==minorSegments-1)?-minorSegments+1:1);
					var fip=fi+minorSegments;
					var nip=ni+minorSegments;
					if (ni>=reply.points.length) ni-=reply.points.length;
					if (fip>=reply.points.length) fip-=reply.points.length;
					if (nip>=reply.points.length) nip-=reply.points.length;
					reply.faces.push([[fi,fip,nip,ni],segCenter]);
				}
			}
			return reply;
		}
		
	},
	box:{
		build:function(rend,opts) {
			var col=(opts.colour==undefined)?new colour():opts.colour;
			var strokeObject=(opts.stroke==undefined)?new stroke():opts.stroke;
			var ne=rend.createElement(opts);
			ne.build_options=opts;
			ne.showBack=(opts.back==undefined)?opts.back:false;
			ne.renderLevel=1;
			
			
			var data=this.data(rend,ne,opts);
			for(var p=0;p<data.points.length;p++) {
				ne.addPoint(data.points[p][0],data.points[p][1],data.points[p][2]);
			}
			for(var f=0;f<data.faces.length;f++) {
				ne.addFace(data.faces[f][0],col,strokeObject,false,data.faces[f][1]);
			}
			//console.log(col);
			//console.log("Faces added");
			//console.log(ne.faces);
			//console.log(ne);
			//console.log(ne.points);
			//ne.update();
			ne.rebuilder=function(opts) {
				element_builder.box.rebuild(this,opts);
			};
			ne.type='box';
			return ne;
		},
		rebuild:function(ele,opts) {
			if(opts.colour!=undefined) ele.build_options.colour=opts.colour;
			if(opts.stroke!=undefined) ele.build_options.stroke=opts.stroke;
			if(opts.width!=undefined) ele.build_options.width=opts.width;
			if(opts.height!=undefined) ele.build_options.height=opts.height;
			if(opts.depth!=undefined) ele.build_options.depth=opts.depth;
			var data=this.data(ele.renderer,ele,ele.build_options);
			for(var p=0;p<data.points.length;p++) {
				ele.points[p].location=data.points[p];
			}
			for(var f=0;f<data.faces.length;f++) {
				ele.faces[f].points=data.faces[f][0];
				ele.faces[f].colour=ele.build_options.colour;
				ele.faces[f].stroke=ele.build_options.stroke;
				ele.faces[f].normalCenter=data.faces[f][1];
				//ele.faces[f].normalCenter=data.points[f][1];
			}
		},
		data:function(rend,ne,opts) {
			var reply={
				points:[],
				faces:[]
			};
			var pw=opts.width;
			var ph=opts.height;
			var pd=opts.depth;
			reply.points.push([0,0,0]);
			reply.points.push([0,pd,0]);
			reply.points.push([pw,pd,0]);
			reply.points.push([pw,0,0]);
			reply.points.push([0,0,ph]);
			reply.points.push([0,pd,ph]);
			reply.points.push([pw,pd,ph]);
			reply.points.push([pw,0,ph]);
			
			var segCenter=new point(rend,ne,pw/2,pd/2,ph/2);
			//console.log(segCenter);
			reply.faces.push([[0,1,2,3],segCenter]);
			reply.faces.push([[0,1,5,4],segCenter]);
			reply.faces.push([[1,2,6,5],segCenter]);
			reply.faces.push([[2,3,7,6],segCenter]);
			reply.faces.push([[3,0,4,7],segCenter]);
			reply.faces.push([[4,5,6,7],segCenter]);
			return reply;
		}
	},
	plane:{
		build:function(rend,opts) {
			var col=(opts.colour==undefined)?new colour():opts.colour;
			var strokeObject=(opts.stroke==undefined)?new stroke():opts.stroke;
			var ne=rend.createElement(opts);
			ne.build_options=opts;
			ne.showBack=(opts.back==undefined)?opts.back:true;
			ne.renderLevel=1;
			
			
			var data=this.data(rend,ne,opts);
			for(var p=0;p<data.points.length;p++) {
				ne.addPoint(data.points[p][0],data.points[p][1],data.points[p][2]);
			}
			for(var f=0;f<data.faces.length;f++) {
				ne.addFace(data.faces[f][0],col,strokeObject,false);
			}
			//console.log(col);
			//console.log("Faces added");
			//console.log(ne.faces);
			//console.log(ne);
			//console.log(ne.points);
			//ne.update();
			ne.rebuilder=function(opts) {
				element_builder.plane.rebuild(this,opts);
			};
			ne.type='plane';
			return ne;
		},
		rebuild:function(ele,opts) {
			if(opts.colour!=undefined) ele.build_options.colour=opts.colour;
			if(opts.stroke!=undefined) ele.build_options.stroke=opts.stroke;
			if(opts.width!=undefined) ele.build_options.width=opts.width;
			if(opts.height!=undefined) ele.build_options.height=opts.height;
			if(opts.depth!=undefined) ele.build_options.depth=opts.depth;
			var data=this.data(ele.renderer,ele,ele.build_options);
			for(var p=0;p<data.points.length;p++) {
				ele.points[p].location=data.points[p];
			}
			for(var f=0;f<data.faces.length;f++) {
				ele.faces[f].points=data.faces[f][0];
				ele.faces[f].colour=ele.build_options.colour;
				ele.faces[f].stroke=ele.build_options.stroke;
				//ele.faces[f].normalCenter=data.faces[f][1];
				//ele.faces[f].normalCenter=data.points[f][1];
			}
		},
		data:function(rend,ne,opts) {
			var reply={
				points:[],
				faces:[]
			};
			var pw=opts.width;
			var pd=opts.depth;
			reply.points.push([0,0,0]);
			reply.points.push([0,pd,0]);
			reply.points.push([pw,pd,0]);
			reply.points.push([pw,0,0]);
			
			//var segCenter=new point(rend,ne,pw/2,pd/2,ph/2);
			//console.log(segCenter);
			reply.faces.push([[0,1,2,3]]);
			return reply;
		}
	},
	line:{
		build:function(rend,opts) {
			var col=(opts.colour==undefined)?new colour():opts.colour;
			var strokeObject=(opts.stroke==undefined)?new stroke():opts.stroke;
			var ne=rend.createElement(opts);
			ne.build_options=opts;
			ne.showBack=(opts.back==undefined)?opts.back:true;
			ne.renderLevel=1;
			
			
			var data=this.data(rend,ne,opts);
			for(var p=0;p<data.points.length;p++) {
				ne.addPoint(data.points[p][0],data.points[p][1],data.points[p][2]);
			}
			for(var f=0;f<data.faces.length;f++) {
				ne.addFace(data.faces[f][0],col,strokeObject,false);
			}
			//console.log(col);
			//console.log("Faces added");
			//console.log(ne.faces);
			//console.log(ne);
			//console.log(ne.points);
			//ne.update();
			ne.rebuilder=function(opts) {
				element_builder.line.rebuild(this,opts);
			};
			ne.type='plane';
			return ne;
		},
		rebuild:function(ele,opts) {
			//if(opts.colour!=undefined) ele.build_options.colour=opts.colour;
			if(opts.stroke!=undefined) ele.build_options.stroke=opts.stroke;
			if(opts.width!=undefined) ele.build_options.width=opts.width;
			if(opts.from!=undefined) ele.build_options.from=opts.from;
			if(opts.to!=undefined) ele.build_options.to=opts.to;
			//if(opts.height!=undefined) ele.build_options.height=opts.height;
			//if(opts.depth!=undefined) ele.build_options.depth=opts.depth;
			var data=this.data(ele.renderer,ele,ele.build_options);
			for(var p=0;p<data.points.length;p++) {
				ele.points[p].location=data.points[p];
			}
			for(var f=0;f<data.faces.length;f++) {
				ele.faces[f].points=data.faces[f][0];
				//ele.faces[f].colour=ele.build_options.colour;
				ele.faces[f].stroke=ele.build_options.stroke;
				//ele.faces[f].normalCenter=data.faces[f][1];
				//ele.faces[f].normalCenter=data.points[f][1];
			}
		},
		data:function(rend,ne,opts) {
			
			var reply={
				points:[],
				faces:[]
			};
			var f=opts.from;
			var t=opts.to;
			reply.points.push(f);
			reply.points.push(t);
			
			//var segCenter=new point(rend,ne,pw/2,pd/2,ph/2);
			//console.log(segCenter);
			reply.faces.push([[0,1]]);
			return reply;
		}
	}
	
}