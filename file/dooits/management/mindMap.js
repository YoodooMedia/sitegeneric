/* --- dooit layout ---

	<div class='sampleContainer'></div>
	<script type='text/javascript'>
	function initThis() {
		var params={};
		params.dependencies=[
			['dooits/thisfilename.js',true],       - sitegeneric file
			['dooits/otherrequiredfile.js',false],        - sitespecific file
			['css/otherrequiredfile.ccs',false]        - sitespecific file
		];
		params.loaded=function(){
			pitch.init({selectors:{container:'.sampleContainer'}});      - options to override in the dooit class
		}
		params.saveValues=['pitch.output'];
		params.finished='pitch.finishable';
		dooit.init(param);
	}

*/
var sample={
	node:{
		title:"Get a job",
		x:0,
		y:0,
		colour:'blue',
		buffers:{
			top:10,
			bottom:10,
			left:10,
			right:10
		},
		attachment:{
			type:'dooit',
			id:1,
			title:'Test attachment'
		},
		size:1,
		icon:null,
		children:[
			{
				title:"Know yourself",
				x:100,
				y:0,
				colour:'blue',
				buffers:{
					top:10,
					bottom:10,
					left:10,
					right:10
				},
				attachment:{
					type:'dooit',
					id:1,
					title:'Test attachment'
				},
				size:1,
				icon:null,
				children:[
					{
						title:"Skills",
						x:100,
						y:0,
						colour:null,
						buffers:{
							top:10,
							bottom:10,
							left:10,
							right:10
						},
						attachment:{
							type:'dooit',
							id:1,
							title:'Test attachment'
						},
						size:1,
						icon:null,
						children:[
		
						]
					},
					{
						title:"Personality",
						x:100,
						y:50,
						colour:null,
						buffers:{
							top:10,
							bottom:10,
							left:10,
							right:10
						},
						attachment:{
							type:'dooit',
							id:1,
							title:'Test attachment'
						},
						size:1,
						icon:null,
						children:[
		
						]
					}
				]
			},
			{
				title:"Build your CV",
				x:100,
				y:100,
				colour:'green',
				buffers:{
					top:10,
					bottom:10,
					left:10,
					right:10
				},
				attachment:{
					type:'dooit',
					id:1,
					title:'Test attachment'
				},
				size:1,
				icon:null,
				children:[
					{
						title:"Qualifications",
						x:100,
						y:0,
						buffers:{
							top:10,
							bottom:10,
							left:10,
							right:10
						},
						attachment:{
							type:'dooit',
							id:1,
							title:'Test attachment'
						},
						size:1,
						icon:null,
						children:[
		
						]
					},
					{
						title:"Profile",
						x:100,
						y:50,
						buffers:{
							top:10,
							bottom:10,
							left:10,
							right:10
						},
						attachment:{
							type:'dooit',
							id:1,
							title:'Test attachment'
						},
						size:1,
						icon:null,
						children:[
		
						]
					},
					{
						title:"Interests",
						x:100,
						y:100,
						buffers:{
							top:10,
							bottom:10,
							left:10,
							right:10
						},
						attachment:{
							type:'dooit',
							id:1,

							title:'Test attachment'
						},
						size:1,
						icon:null,
						children:[
		
						]
					}
				]
			},
			{
				title:"Finding Jobs",
				x:100,
				y:250,
				colour:'red',
				buffers:{
					top:10,
					bottom:10,
					left:10,
					right:10
				},
				attachment:{
					type:'dooit',
					id:1,
					title:'Test attachment'
				},
				size:1,
				icon:null,
				children:[
					{
						title:"Full time",
						x:100,
						y:0,
						buffers:{
							top:10,
							bottom:10,
							left:10,
							right:10
						},
						attachment:{
							type:'dooit',
							id:1,
							title:'Test attachment'
						},
						size:1,
						icon:null,
						children:[
						]
					},
					{
						title:"Work experience",
						x:100,
						y:50,
						buffers:{
							top:10,
							bottom:10,
							left:10,
							right:10
						},
						attachment:{
							type:'dooit',
							id:1,
							title:'Test attachment'
						},
						size:1,
						icon:null,
						children:[
		
						]
					}
				]
			},
			{
				title:"Interviews",
				x:100,
				y:400,
				colour:'blue',
				buffers:{
					top:10,
					bottom:10,
					left:10,
					right:10
				},
				attachment:{
					type:'dooit',
					id:1,
					title:'Test attachment'
				},
				size:1,
				icon:null,
				children:[
					{
						title:"Before",
						x:100,
						y:0,
						buffers:{
							top:10,
							bottom:10,
							left:10,
							right:10
						},
						attachment:{
							type:'dooit',
							id:1,
							title:'Test attachment'
						},
						size:1,
						icon:null,
						children:[
						]
					},
					{
						title:"During",
						x:100,
						y:50,
						buffers:{
							top:10,
							bottom:10,
							left:10,
							right:10
						},
						attachment:{
							type:'dooit',
							id:1,
							title:'Test attachment'
						},
						size:1,
						icon:null,
						children:[
		
						]
					},
					{
						title:"After",
						x:100,
						y:100,
						colour:'red',
						buffers:{
							top:10,
							bottom:10,
							left:10,
							right:10
						},
						attachment:{
							type:'dooit',
							id:1,
							title:'Test attachment'
						},
						size:1,
						icon:null,
						children:[
		
						]
					}
				]
			}
		]
	}
};


dooit.temporaries('mindMap');
var mindMap={
	selectors:{
		container:'.mindmap'
	},
	containers:{
		container:null,
		mapWindow:null,
		boundary:null,
		map:null
	},
	colours:{
		red:{background:'#fee',border:'#f99',link:'#600'},
		green:{background:'#efe',border:'#9f9',link:'#060'},
		blue:{background:'#eef',border:'#99f',link:'#006'}
	},
	icons:[
		{image:'icon.png',title:'Icon 1'},
		{image:'icon.png',title:'Icon 2'},
		{image:'icon.png',title:'Icon 3'},
		{image:'icon.png',title:'Icon 4'},
		{image:'icon.png',title:'Icon 5'},
		{image:'icon.png',title:'Icon 6'}
	],
	emptyNode:function(){
		return {
			title:"Empty Node",
			x:100,
			y:0,
			buffers:{
				top:10,
				bottom:10,
				left:10,
				right:10
			},
			attachment:{
				type:'dooit',
				id:1,
				title:'Test attachment'
			},
			size:null,
			icon:null,
			children:[
	
			]
		};
	},
	sizes:[10,11,12,13,14,15,16,18,20,24],
	value:null,
	movingItem:null,
	doubleClick:200,
	boundary:100,
	snapX:20,
	key:null,
	fields:{},
	nodes:[],
	init:function() {
		if (arguments.length>0) this.transposeOptions([],arguments[0]);
		this.loadFields();
		this.key='dfsdf';
		this.containers.container=$(this.selectors.container).get(0);
		if (this.key!==null && this.containers.container!==null) {
			this.value=sample;
			this.drawLayout();
			this.getCanvas();
			this.buildNodes();
			for(var n=0;n<this.nodes.length;n++) this.nodes[n].draw(this.containers.map);
			for(var n=0;n<this.nodes.length;n++) this.nodes[n].getSiblings();
			this.updateDesktop();
		}
	},
	drawLayout:function() {
		//$(this.containers.container).css({position:'relative'});
		if (yoodoo.dooittitle==undefined || yoodoo.dooittitle=="") yoodoo.dooittitle="Mind map";
		$(this.containers.container).html("<div><h2>"+yoodoo.dooittitle+"</h2></div>");
		this.containers.boundary=document.createElement("div");
		$(this.containers.boundary).css({position:'relative'});
		this.containers.container.appendChild(this.containers.boundary);
		var h2=$(this.containers.container).find("div").outerHeight();
		this.containers.mapWindow=document.createElement("div");
		this.containers.boundary.appendChild(this.containers.mapWindow);
		$(this.containers.mapWindow).addClass("mapWindow");
		var h=$('#yoodooScrolledArea').height()-h2-8;
		var w=$('#yoodooScrolledArea').width()-8;
		$(this.containers.mapWindow).css({width:w,height:h});
		$(this.containers.boundary).css({width:w,height:h});
		this.containers.map=document.createElement("div");
		$(this.containers.map).addClass("map");
		this.containers.mapWindow.appendChild(this.containers.map);
		$(this.containers.map).css({'min-width':w,'min-height':h});
		this.width=w;
		this.height=h;
	},
	getCanvas:function() {
		if (this.canvas!=undefined) {
			return this.canvas;
		}else if (document.createElementNS!=undefined) {
			this.canvas=document.createElementNS('http://www.w3.org/2000/svg','svg');
			this.canvas.id='mindMap'+new Date().getTime();
			this.containers.map.appendChild(this.canvas);
			this.canvas.setAttribute('width',this.width);
			this.canvas.setAttribute('height',this.height);
			$(this.canvas).bind("mousedown",function(e) {
				mindMap.closeToolbar();
				if (mindMap.editing!=undefined && mindMap.editing!=null) mindMap.editing.stopEdit();
				e.preventDefault();
				mindMap.scrollLoc={x:e.pageX,y:e.pageY};
				$(mindMap.containers.mapWindow).bind('mousemove',function(e) {
					var x=e.pageX-mindMap.scrollLoc.x;
					var y=e.pageY-mindMap.scrollLoc.y;
					mindMap.containers.mapWindow.scrollTop-=y;
					mindMap.containers.mapWindow.scrollLeft-=x;
					mindMap.scrollLoc={x:e.pageX,y:e.pageY};
				});
				$(mindMap.containers.mapWindow).bind('mouseup mouseleave',function(e) {
					$(mindMap.containers.mapWindow).unbind('mouseup mouseout mousemove');
				});
			});
			return this.canvas;
		}else{
			return null;
		}
	},
	buildNodes:function() {
		if (this.value.node!=undefined) {
			this.nodes.push(new mindMap.node(this.value.node));
		}
	},
	closeToolbar:function() {
		$(mindMap.containers.map).find('.mapNode.toolbared').removeClass('toolbared');
		if (this.toolbar!=undefined && this.toolbar!=null) $(this.toolbar).remove();
	},
	select:function(o) {
		this.closeToolbar();
		this.toolbar=document.createElement("div");
		$(this.toolbar).addClass("toolbar");
		var ins='<div class="optionItem"><div>Colour <button type="button" onclick="$(this.parentNode.parentNode).find(\'.on\').removeClass(\'on\');mindMap.movingItem.set(\'colour\',null)">&Oslash;</button></div><div class="colourSelector"></div></div>';
		ins+='<div class="optionItem"><div>Size <button type="button" onclick="$(this.parentNode.parentNode).find(\'.on\').removeClass(\'on\');mindMap.movingItem.set(\'size\',null)">&Oslash;</button></div><div class="sizeSelector"></div></div>';
		ins+='<div class="optionItem"><div>Icon <button type="button" onclick="$(this.parentNode.parentNode).find(\'.on\').removeClass(\'on\');mindMap.movingItem.set(\'icon\',null)">&Oslash;</button></div><div class="iconSelector"></div></div>';
		$(this.toolbar).html(ins);
		var cs=$(this.toolbar).find('.colourSelector').get(0);
		for(var c in this.colours) {
			var box=document.createElement("div");
			$(box).addClass("swatchContainer");
			if (o.colour==c) $(box).addClass("on");
			var swatch=document.createElement("div");
			$(swatch).addClass("swatch");
			$(swatch).css({background:this.colours[c].background,border:'1px solid '+this.colours[c].border});
			box.appendChild(swatch);
			box.value=c;
			$(box).bind("click",function() {
				mindMap.movingItem.set('colour',this.value);
				$(this).siblings('.swatchContainer.on').removeClass("on");
				$(this).addClass("on");
			});
			cs.appendChild(box);
		}
		var ss=$(this.toolbar).find('.sizeSelector').get(0);
		for(var s=0;s<this.sizes.length;s++) {
			var box=document.createElement("div");
			$(box).addClass("sizeContainer");
			if (o.size==s) $(box).addClass("on");
			var swatch=document.createElement("div");
			$(swatch).html("A");
			$(swatch).addClass("size");
			$(swatch).css({'font-size':this.sizes[s]});
			box.appendChild(swatch);
			box.value=s;
			$(box).bind("click",function() {
				mindMap.movingItem.set('size',this.value);
				$(this).siblings('.sizeContainer.on').removeClass("on");
				$(this).addClass("on");
			});
			ss.appendChild(box);
		}
		var is=$(this.toolbar).find('.iconSelector').get(0);
		for(var s=0;s<this.icons.length;s++) {
			var box=document.createElement("img");
			if (o.icon==s) $(box).addClass("on");
			box.src=this.icons[s].image;
			box.title=this.icons[s].title;
			box.value=s;
			$(box).bind("click",function() {
				mindMap.movingItem.set('icon',this.value);
				$(this).siblings('.on').removeClass("on");
				$(this).addClass("on");
			});
			is.appendChild(box);
		}
		this.containers.boundary.appendChild(this.toolbar);
		$(mindMap.movingItem.element).addClass('toolbared');
	},
	updateDesktop:function() {
		this.closeToolbar();
		var dimensions={
			left:2000000,
			right:0,
			top:2000000,
			bottom:0	
		};
		$(this.containers.map).find('.mapNode').each(function(i,e) {
			var loc=e.source.location();
			loc.left=loc.x;
			loc.top=loc.y;
			loc.right=loc.left+$(e).outerWidth();
			loc.bottom=loc.top+$(e).outerHeight();
			if (dimensions.left>loc.left) dimensions.left=loc.left;
			if (dimensions.top>loc.top) dimensions.top=loc.top;
			if (dimensions.right<loc.right) dimensions.right=loc.right;
			if (dimensions.bottom<loc.bottom) dimensions.bottom=loc.bottom;
		});
		var size={
			width:dimensions.right-dimensions.left+(2*this.boundary),
			height:dimensions.bottom-dimensions.top+(2*this.boundary)
		};
		var offset={
			x:0,
			y:0	
		};
		//console.log(size);
		if (size.width>this.width || size.height>this.height) {
			offset.x=dimensions.left-this.boundary;
			offset.y=dimensions.top-this.boundary;
			if (size.width<this.width) size.width=this.width;
			if (size.height<this.height) size.height=this.height;
			$(this.containers.map).css({width:size.width,height:size.height});
			this.canvas.setAttribute('width',size.width);
			this.canvas.setAttribute('height',size.height);
			//console.log(size);
			if(offset.x!=0 || offset.y!=0) {
				for(var n=0;n<this.nodes.length;n++) this.nodes[n].position(this.nodes[n].x-offset.x,this.nodes[n].y-offset.y);
			}
		}
		//console.log(offset);
		
	},
	node:function(n) {
		this.parent=null;
		this.element=null;
		this.handle=null;
		this.title=n.title;
		this.moving=false;
		this.x=n.x;
		this.y=n.y;
		this.anchorx=n.x;
		this.anchory=n.y;
		this.y=n.y;
		this.colour=(n.colour!=undefined)?n.colour:null;
		this.size=(n.size!=undefined)?n.size:null;
		this.buffers=n.buffers;
		this.offset={
			x:0,
			y:0
		};
		this.attachment=n.attachment;
		this.icon=n.icon;
		this.childContainer=null;
		this.children=[];
		this.lastClick=null;
		for(var c=0;c<n.children.length;c++) {
			this.children.push(new mindMap.node(n.children[c]));
		}
		this.getColour=function() {
			if (this.colour!=null) return this.colour;
			return this.parent.getColour();
		};
		this.getSize=function() {
			if (this.size!=null) return this.size;
			return this.parent.getSize();
		};
		this.draw=function(parent) {
			this.parent=parent;
			this.element=document.createElement("div");
			this.childContainer=document.createElement("div");
			$(this.childContainer).css({position:'relative'});
			$(this.childContainer).addClass("childContainer");
			$(this.element).addClass("mapNode");
			this.element.source=this;
			this.element.appendChild(this.childContainer);
			this.handle=document.createElement("div");
			$(this.handle).addClass("content").addClass("handle");
			$(this.handle).html(this.title);
			this.adder=document.createElement("button");
			$(this.adder).addClass("addNode");
			this.adder.source=this;
			$(this.adder).html('+');
			this.childContainer.appendChild(this.adder);
			this.element.appendChild(this.handle);
			$(this.element).css({left:this.x,top:this.y});
			$(this.handle).css({background:mindMap.colours[this.getColour()].background,color:mindMap.colours[this.getColour()].link,border:'1px solid '+mindMap.colours[this.getColour()].border,"font-size":mindMap.sizes[this.getSize()]+"px"});
			this.handle.source=this;
			if (this.parent.childContainer!=undefined) {
				this.parent.childContainer.appendChild(this.element);
			}else{
				
				this.parent.appendChild(this.element);
			}
			this.drawLink();
			$(this.adder).bind("click",function(){
				this.source.addNode();
			});
			$(this.handle).bind("mousedown",function(e) {
				if (e.target==this) {
					if (mindMap.editing!=undefined && mindMap.editing!=null) mindMap.editing.stopEdit();
					var clicked=new Date().getTime();
					if (this.source.lastClick!=null && (clicked-this.source.lastClick)<mindMap.doubleClick) {
						this.source.lastClick=null;
						this.source.edit();
					}else{
						this.source.lastClick=clicked;
						
						e.preventDefault();
						this.source.findSnapX();
						this.source.offset.x=e.pageX-this.source.x;
						this.source.offset.y=e.pageY-this.source.y;
						mindMap.movingItem=this.source;
						$(mindMap.containers.mapWindow).bind('mousemove',function(e) {
							var x=e.pageX-mindMap.movingItem.offset.x;
							var y=e.pageY-mindMap.movingItem.offset.y;
							mindMap.movingItem.position(x,y);
							mindMap.updateDesktop();
						});
						$(mindMap.containers.mapWindow).bind('mouseup mouseleave',function(e) {
							$(mindMap.containers.mapWindow).unbind('mouseup mouseleave mousemove');
							mindMap.select(mindMap.movingItem);
						});
					}
				}
			});
			for(var c=0;c<this.children.length;c++) this.children[c].draw(this);
			for(var c=0;c<this.children.length;c++) this.children[c].getSiblings();
		};
		this.addNode=function() {
			var nn=mindMap.emptyNode();
			if(this.children.length>0) {
				nn.y=this.children[this.children.length-1].y+this.children[this.children.length-1].buffers.bottom+this.children[this.children.length-1].height()+nn.buffers.top;
				nn.x=this.children[this.children.length-1].x;
			}
			this.children.push(new mindMap.node(nn));
			this.children[this.children.length-1].draw(this);
			for(var c=0;c<this.children.length;c++) this.children[c].getSiblings();
			mindMap.updateDesktop();
		};
		this.edit=function() {
			mindMap.editing=this;
			$(this.handle).html('<input type="text" />');
			var ip=$(this.handle).find('input').get(0);
			$(ip).val(this.title);
			ip.source=this;
			$(this.handle).addClass("editing");
			$(ip).bind("keyup",function() {
				this.source.title=this.value;
			});
			$(ip).bind("blur",function() {
				this.source.stopEdit();
			});
		};
		this.stopEdit=function() {
			mindMap.editing=null;
			$(this.handle).html(this.title);
		};
		this.set=function(t,v) {
			switch(t) {
				case "colour":
					this.colour=v;
					this.updateStyle();
				break;
				case "size":
					this.size=v;
					this.updateStyle();
				break;
			}
		};
		this.updateStyle=function() {
			$(this.handle).css({background:mindMap.colours[this.getColour()].background,color:mindMap.colours[this.getColour()].link,border:'1px solid '+mindMap.colours[this.getColour()].border,"font-size":mindMap.sizes[this.getSize()]+"px"});
			if (this.link!=undefined) this.link.setAttribute("stroke",mindMap.colours[this.getColour()].link);
			for(var c=0;c<this.children.length;c++) {
				this.children[c].updateStyle();
			}
			this.updateLink();
		};
		this.findSnapX=function() {
			if (this.parent.children!=undefined) {
				var x=0;
				for(var i=0;i<this.parent.children.length;i++) {
					if (this.parent.children[i]!=this) x+=this.parent.children[i].x;
				}
				x/=(this.parent.children.length-1);
				this.snapX=Math.round(x);
			}else{
				this.snapX=null;
			}
		};
		this.drawLink=function() {
			if (this.parent.element!=undefined) {
				if (this.link==undefined) {
					var canvas=mindMap.getCanvas();
					if (canvas!=null) {
						this.link=document.createElementNS("http://www.w3.org/2000/svg", "path");
						canvas.appendChild(this.link);
						this.updateLink();
					}
				}
			}
		};
		this.location=function() {
			var x=this.x;
			var y=this.y;
			if (this.parent.element!=undefined) {
				var parLoc=this.parent.location();
				x+=parLoc.x;
				y+=parLoc.y;
			}
			return {x:x,y:y};
		};
		this.updateLink=function() {
			if (this.link!=undefined) {
				var from=this.parent.location();
				var to=this.location();
				var str="";
				from.y+=this.parent.height()/2;
				to.y+=this.height()/2;
				var strength=Math.sqrt(Math.pow(from.x-to.x,2))/4;
				if (strength<20) strength=20;
				if (from.x>to.x) {
					str="M"+from.x+","+from.y+" C"+(from.x-strength)+","+from.y+" "+(to.x+this.width()+strength)+","+to.y+" "+(to.x+this.width())+","+to.y+"";
				}else{
					str="M"+(from.x+this.parent.width())+","+from.y+"C"+(from.x+this.parent.width()+strength)+","+from.y+" "+(to.x-strength)+","+to.y+" "+to.x+","+to.y+"";
				}
				//var c={x:from.x+((from.x-to.x)/2),y:from.y+((from.y-to.y)/2)};
				this.link.setAttribute("d",str);
				this.link.setAttribute("stroke",mindMap.colours[this.getColour()].link);
				this.link.setAttribute("stroke-width",'3');
				this.link.setAttribute("fill",'none');
			}
			for(var c=0;c<this.children.length;c++) this.children[c].updateLink();
		};
		this.styleLink=function(opts) {
			if (this.link!=undefined) {
				var s=[];
				for(var k in opts) {
					if(typeof(opts[k])=="string" || typeof(opts[k])=="number") {
						s.push(k+":"+opts[k]);
					}
				}
				this.link.setAttribute("style",s.join(";"));

			}
		};
		this.getSiblings=function() {
			this.prev=$(this.element).prev('.mapNode').get();
			this.next=$(this.element).next('.mapNode').get();
			if (this.prev.length==1) {
				this.prev=this.prev[0].source;
			}else{
				this.prev=null;
			}
			if (this.next.length==1) {
				this.next=this.next[0].source;
			}else{
				this.next=null;
			}
		};
		this.position=function(x,y) {
			if (x!=null) this.x=x;
			if (y!=null) this.y=y;
			if (this.snapX!==null) {
				if(Math.sqrt(Math.pow(this.snapX-this.x,2))<mindMap.snapX) this.x=this.snapX;
			}
			var dir=null;
			if (arguments.length>2) dir=arguments[2];
			this.parentCollision();
			if (dir==null) {
				this.anchory=this.y;
				this.anchorx=this.x;
				this.updateLink();
			}
			$(this.element).css({left:this.x,top:this.y});
			if (this.next!=null && y!=null && dir!="up") {
				if (this.bottom()>this.next.anchortop()) {
					this.next.position(null,this.bottom()+this.next.buffers.top,"down");
					this.next.updateLink();
				}
			}
			if (this.prev!=null && y!=null && dir!="down") {
				if (this.top()<this.prev.anchorbottom()) {
					this.prev.position(null,this.top()-this.prev.buffers.bottom-this.prev.height(),"up");
					this.prev.updateLink();
				}
			}
		};
		this.top=function() {
			return this.y-this.buffers.top;
		};
		this.bottom=function() {
			return this.y+this.height()+this.buffers.bottom;
		};
		this.left=function() {
			return this.x-this.buffers.left;
		};
		this.right=function() {
			return this.x+this.width()+this.buffers.right;
		};
		this.anchortop=function() {
			return this.anchory-this.buffers.top;
		};
		this.anchorbottom=function() {
			return this.anchory+this.height()+this.buffers.bottom;
		};
		this.height=function() {
			return $(this.element).outerHeight();
		};
		this.width=function() {
			return $(this.element).outerWidth();
		};
		this.parentRect=function() {
			var kidContainer=$(this.parent.childContainer).offset();
			var container=$(this.parent.element).offset();
			var d={
				x:container.left-kidContainer.left,
				y:container.top-kidContainer.top
			};
			var rect={
				top:d.y,
				bottom:d.y+this.parent.height(),
				left:d.x,
				right:d.x+this.parent.width()
			};
			return rect;
		};
		this.relationToParent=function() {
			var rect=this.parentRect();
			var offset={
				x:(this.width()/2),
				y:(this.height()/2)
			};
			var parentoffset={
				x:((rect.right-rect.left)/2),
				y:((rect.bottom-rect.top)/2)
			};
			var center={
				x:this.left()+offset.x,
				y:this.top()+offset.y
			};
			var parentcenter={
				x:rect.left+parentoffset.x,
				y:rect.top+parentoffset.y
			};
			var d={
				x:center.x-parentcenter.x,
				y:center.y-parentcenter.y
			};
			var alpha=(d.x==0)?((d.y>0)?Math.PI/2:-Math.PI/2):Math.atan(d.y/d.x);
			if (d.x<0) alpha=((d.y<0)?-Math.PI:Math.PI)+alpha;
			return {angle:alpha,offset:offset,parentoffset:parentoffset,center:center,parentcenter:parentcenter,d:d};
		};
		this.parentCollision=function() {
			if (this.parent.element!=undefined) {
				var rect=this.parentRect();
				if(this.top()<(rect.bottom+this.parent.buffers.bottom) && this.bottom()>(rect.top-this.parent.buffers.top) && this.left()<(rect.right+this.parent.buffers.right) && this.right()>(rect.left-this.parent.buffers.left)) {
					var alpha=this.relationToParent();
					var x=this.x;
					var y=this.y;
					var h1=0;
					if (alpha.d.x>0) {
						h1=(alpha.offset.x+this.buffers.left+alpha.parentoffset.x+this.parent.buffers.right)/Math.cos(alpha.angle);
					}else{
						h1=(alpha.offset.x+this.buffers.right+alpha.parentoffset.x+this.parent.buffers.left)/Math.cos(alpha.angle);
					}
					var h2=0;
					if (alpha.d.y>0) {
						h2=(alpha.offset.y+this.buffers.top+alpha.parentoffset.y+this.parent.buffers.bottom)/Math.sin(alpha.angle);
					}else{
						h2=(alpha.offset.y+this.buffers.bottom+alpha.parentoffset.y+this.parent.buffers.top)/Math.sin(alpha.angle);
					}
					h1=Math.sqrt(Math.pow(h1,2));
					h2=Math.sqrt(Math.pow(h2,2));
					if (h1<h2) {
						if (alpha.d.x>0) {
							x=alpha.parentcenter.x+alpha.parentoffset.x+this.parent.buffers.right+this.buffers.left;
						}else{
							x=alpha.parentcenter.x-alpha.parentoffset.x-(alpha.offset.x*2)-this.parent.buffers.left-this.buffers.right;
						}
						y=alpha.parentcenter.y+(h1*Math.sin(alpha.angle))-alpha.offset.y;
					}else{
						if (alpha.d.y>0) {
							y=alpha.parentcenter.y+alpha.parentoffset.y+this.parent.buffers.bottom+this.buffers.top;
						}else{
							y=alpha.parentcenter.y-alpha.parentoffset.y-(alpha.offset.y*2)-this.parent.buffers.top-this.buffers.bottom;
						}
						x=alpha.parentcenter.x+(h2*Math.cos(alpha.angle))-alpha.offset.x;
					}
					this.x=x;
					this.y=y;
					
				}
			}
		};
	},
	loadFields:function() {
		if(this.key===null || array_of_fields[this.key]==undefined) this.key=null;
		if (this.key===null && array_of_default_fields.length>0) this.key=array_of_default_fields[0];
		if (this.key===null) {
			for(var k in array_of_fields) {
				if(this.key===null) this.key=k;
			}
		}
		if(this.key!==null) {
			try{
				eval('this.value='+array_of_fields[this.key][1]+';');
			}catch(e){
				this.value=array_of_fields[this.key][1];
			}
		}
		for(var k in array_of_fields) {
			if (k!=this.key) {
				try{
					eval('this.fields["'+k+'"]='+array_of_fields[k][1]+';');
				}catch(e){
					this.fields[k]=array_of_fields[this.key][1];
				}
			}
		}
		this.value=this.decode(this.value);
		this.fields=this.decode(this.fields);
	},
	decode:function(ip) {
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
	},
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
		var ok=true;
		return ok;
	},
	output:function() {
		var op=(dooit.json(this.value));
		array_of_fields[this.key][1]=op;
		var reply={};
		eval('reply.EF'+array_of_fields[this.key][0]+'=op;');
		return reply;
	}
};
