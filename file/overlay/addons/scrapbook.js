var libraryButton=null;
var libraryOptions=null;

scrapbook={
	container:null,
	desktopWindow:{
		element:null,
		width:700,
		height:500,
		pagesHeight:30
	},
	settings:{
		share:false,
		group_defined:false,
		not_in_bookcase:false,
		share_a_share:false,
		add_comments:false
	},
	zIndex:700,
	boundary:25,
	desktop:null,
	placeholder:null,
	scrapbookPages:null,
	scrollArea:null,
	pages:{mine:[],others:[]},
	whos:"mine",
	showingPage:0,
	tablist:[],
	addNotes:true,
	users:{},
	recycle:[],	
	autoLayout:{
		sideCount:2,
		offset:{
			x:20,
			y:15
		},
		spread:{
			x:180,
			y:100
		}
	},
	
	items:[],
	public:{
		on:'Make private',
		off:'Make public'
	},
	init:function(params) {
		this.container=(params.container==undefined)?this.container:params.container;
		if (this.container!==null) {
			if (this.desktop===null) this.createDesktop();	
			if (params.xml!==undefined) this.setXML(params.xml);
			
		}
		
		libraryOptions = {
			buttons : {'library' : {name : __('Add an image'), type : 'libraryButton'}
			},iconFiles : {'library' : yoodoo.option.baseUrl+'utilities/uploader/nicLibrary.png'}
		};
		 
		libraryButton = nicEditorAdvancedButton.extend({   
		  mouseClick : function() {
			  scrapbook.uploader();
		  }
		});

		nicEditors.registerPlugin(nicPlugin,libraryOptions);
		 
			
	},
	setXML:function(xml) {
		this.whos='mine';
		this.viewingUser=undefined;
		this.parseElements(this.parseXML(xml));
		this.createItems();
		this.drawPages();
		this.addNewNoteButton();
	},
	gotUserXML:function(xml){
		//this.whos='others';
		this.parseElements(this.parseXML(xml));
		this.setPage(this.showingPage);
	},
	showMine:function() {
		this.whos='mine';
		this.viewingUser=undefined;
		this.setPage(this.showingPage);
	},
	createDesktop:function() {
		$(this.container).html("<div class='scrapbookPages'></div><div class='scrapbookPlaceholder'><div class='scrapbookWindow'><div class='scrapbookDesktop'></div></div></div>");
		this.desktopWindow.element=$(this.container).find('.scrapbookWindow').get(0);
		this.desktop=$(this.container).find('.scrapbookDesktop').get(0);
		this.placeholder=$(this.container).find('.scrapbookPlaceholder').get(0);
		this.scrapbookPages=$(this.container).find('.scrapbookPages').get(0);
		$(this.desktopWindow.element).css("overflow","hidden");
		this.desktopWindow.width=yoodoo.option.flashMovie.width-18;
		this.desktopWindow.height=yoodoo.option.flashMovie.height-44;
		this.desktopWindow.height-=this.desktopWindow.pagesHeight;
		$(this.desktopWindow.element).css("width",this.desktopWindow.width+"px");
		$(this.desktopWindow.element).css("height",this.desktopWindow.height+"px");
		$(this.placeholder).css("width",this.desktopWindow.width+"px");
		$(this.placeholder).css("height",this.desktopWindow.height+"px");
		$(this.desktop).css("min-width",this.desktopWindow.width+"px");
		$(this.desktop).css("min-height",this.desktopWindow.height+"px");
		$(this.desktop).bind("mousedown",function(e) {
			if (e.target==this) {
				e.preventDefault();
				this.offset={
					x:e.pageX+scrapbook.desktopWindow.element.scrollLeft,
					y:e.pageY+scrapbook.desktopWindow.element.scrollTop
				}
				$(document).bind("mousemove",desktopMove=function(e){
					var x=e.pageX-scrapbook.desktop.offset.x;
					var y=e.pageY-scrapbook.desktop.offset.y;
					scrapbook.desktopWindow.element.scrollLeft=-x;
					scrapbook.desktopWindow.element.scrollTop=-y;
					scrapbook.arrows();
				});
				$(document).bind("mouseup",desktopUp=function(e){
					var x=e.pageX-scrapbook.desktop.offset.x;
					var y=e.pageY-scrapbook.desktop.offset.y;
					scrapbook.desktopWindow.element.scrollLeft=-x;
					scrapbook.desktopWindow.element.scrollTop=-y;
					$(document).unbind("mouseup",desktopUp);
					$(document).unbind("mousemove",desktopMove);
					scrapbook.arrows();
				});
			}
		});
	},
	drawPages:function() {
		while(this.scrapbookPages.childNodes.length>0) this.scrapbookPages.removeChild(this.scrapbookPages.childNodes[0]);
		var tabPages=[];
		if (arguments.length>0) {
			tabPages=arguments[0];
		}else{
			for(var p=0;p<this.pages[this.whos].length;p++) {
				if (this.pages[this.whos][p].details.grouped==undefined) tabPages.push(p);
			}
		}
		for(var p=0;p<tabPages.length;p++) {
			var a=document.createElement("a");
			a.id=tabPages[p];
			$(a).html("<span class='l'>&nbsp;</span><span class='c'>"+this.pages[this.whos][tabPages[p]].details.title+"</span><span class='r'>&nbsp;</span>");
			$(a).addClass("tab");
			if(tabPages[p]==this.showingPage) $(a).addClass("on");
			a.href='javascript:void(0)';
			$(a).bind("click",function() {
				if (!$(this).hasClass("on")) {
					scrapbook.setPage(this.id);
					$(this).siblings("a.on").removeClass("on");
					$(this).addClass("on");
				}
			});
			this.scrapbookPages.appendChild(a);
		}
		
	},
	setPage:function(i){
		if(i>=this.pages[this.whos].length) i=0;
		this.showingPage=i;
		$(this.desktop).find('>*').fadeOut(500);
		setTimeout('scrapbook.clearAndRedraw();',600);
		this.checkTabs();
	},
	checkTabs:function() {
		var kids=false;
		var parentId=null;
		var parentIndex=null;
		if (this.pages[this.whos][this.showingPage].details.grouped!=undefined) {
			parentId=this.pages[this.whos][this.showingPage].details.grouped;
			kids=true;
			for(var p=0;p<this.pages[this.whos].length;p++) {
				if (this.pages[this.whos][p].details.id==parentId) parentIndex=p;
			}
		}else{
			for(var p=0;p<this.pages[this.whos].length;p++) {
				if (this.pages[this.whos][p].details.grouped!=undefined && this.pages[this.whos][p].details.grouped==this.pages[this.whos][this.showingPage].details.id) {
					kids=true;
					parentId=this.pages[this.whos][this.showingPage].details.id;
					parentIndex=this.showingPage;
				}
			}
		}
		var tablist=[];
		if (kids) {
			tablist.push(0);
			if (parentIndex!=0) tablist.push(parentIndex);
			for(var p=1;p<this.pages[this.whos].length;p++) {
				if (this.pages[this.whos][p].details.grouped==parentId) tablist.push(p);
			}			
		}else{
			for(var p=0;p<this.pages[this.whos].length;p++) {
				if (this.pages[this.whos][p].details.grouped==undefined) tablist.push(p);
			}
		}
		var changed=false;
		if (tablist.length!=this.tablist.length) {
			if (this.tablist.length==0) {
				this.tablist=tablist;
			}else{
				changed=true;
			}
		}else{
			for(var i=0;i<this.tablist.length;i++) {
				if (this.tablist[i]!=tablist[i]) changed=true;
			}
		}
		if (changed) {
			this.tablist=tablist;
			$(this.scrapbookPages).animate({height:0,'padding-top':30},{duration:1000,complete:function(){
				scrapbook.drawPages(scrapbook.tablist);
				$(scrapbook.scrapbookPages).animate({height:30,'padding-top':0},{duration:1000});
				scrapbook.addNewNoteButton();
			}});
		}else{
			this.addNewNoteButton();
		}
	},
	recycleItem:function(item) {
		this.recycle.push(item);
		this.updateBin();
	},
	showBin:function(){
		var rb=$(this.scrapbookPages).find('.bin .recyclebin');
		var pos=rb.offset();
		this.bin=document.createElement('div');
		$(this.bin).addClass("inbin");
		$(this.bin).css("top",pos.top+"px");
		$(this.bin).css("left",(pos.left+rb.width()-310)+"px");
		$(this.bin).html("<a href='javascript:void(0)' onclick='scrapbook.hideBin()' class='closebin'>X</a>Recycle bin...");
		for(var r=0;r<this.recycle.length;r++) {
			this.bin.appendChild(this.recycle[r].bin());
		}
		document.body.appendChild(this.bin);
		
		$(document).bind("mousedown",function(e){
			var p=scrapbook.parentOfClass(e.target,'inbin');
			if (p==document.body) {
				e.preventDefault();
				$(scrapbook.bin).remove();
				$(document).unbind("mousedown");
			}
		});
	},
	updateBin:function() {
		$(this.scrapbookPages).find('.bin').css("display",(this.recycle.length==0)?"none":"block");
		$(this.scrapbookPages).find('.bin .recyclebin').html(this.recycle.length);
		if(this.recycle.length==0) this.hideBin();
	},
	hideBin:function(){
		$(document).unbind("mousedown");
		$(this.bin).remove();
		this.bin=undefined;
	},
	addNewNoteButton:function() {
		this.addNotes=(this.pages[this.whos][this.showingPage].details.newnotes!=undefined && this.pages[this.whos][this.showingPage].details.newnotes=="true");
		if (this.whos!="mine") {
			$(scrapbook.scrapbookPages).find(".newnote").remove();
			var a=document.createElement("a");
			$(a).html("<span class='l'>&nbsp;</span><span class='c'>"+this.users[this.whos].closeText()+"</span><span class='r'>&nbsp;</span>");
			$(a).addClass("tab");
			$(a).addClass("newnote");
			a.href='javascript:void(0)';
			$(a).bind("click",function() {
				scrapbook.showMine();
			});
			this.scrapbookPages.appendChild(a);
			
		}else if (!this.addNotes) {
			$(scrapbook.scrapbookPages).find(".newnote").remove();
		}else{
			if ($(scrapbook.scrapbookPages).find(".newnote").get().length==0) {
				
				var a=document.createElement("a");
				$(a).html("<span class='l'>&nbsp;</span><span class='c'>+ note</span><span class='r'>&nbsp;</span>");
				$(a).addClass("tab");
				$(a).addClass("newnote");
				a.href='javascript:void(0)';
				$(a).bind("click",function() {
					scrapbook.addNote();
				});
				this.scrapbookPages.appendChild(a);
			}
		}
		if (this.whos=="mine") {
			if ($(scrapbook.scrapbookPages).find(".bin").get().length==0) {
				var a=document.createElement("a");
				$(a).html("<span class='l'>&nbsp;</span><span class='c'><span class='recyclebin'>"+this.recycle.length+"</span></span><span class='r'>&nbsp;</span>");
				$(a).addClass("tab");
				$(a).addClass("bin");
				$(a).css("display",((this.recycle.length==0)?"none":"block"));
				a.href='javascript:void(0)';
				$(a).bind("click",function() {
					scrapbook.showBin();
				});
				this.scrapbookPages.appendChild(a);
			}else{
				this.updateBin();
			}
		}
	},
	addNote:function() {
		var nn=this.objects.note(null);
		nn.highlight=true;
		this.pages[this.whos][this.showingPage].items.push(nn);
		nn.page=this.pages[this.whos][this.showingPage];
		this.createItems(nn);
		this.updateDesktop(nn.element());
	},
	clearAndRedraw:function() {
		for(var i=0;i<scrapbook.items.length;i++) {
			$(scrapbook.items[i].arrow).remove();
			scrapbook.items[i].arrow=undefined;
		}
		while(scrapbook.desktop.childNodes.length>0) $(scrapbook.desktop.childNodes[0]).remove();
		scrapbook.createItems();
		var target=$(scrapbook.desktop).find(".scrapbookItem.centeron").get();
		if (target.length>0) {
			scrapbook.updateDesktop(target[0]);
		}else if(scrapbook.items.length>0) {
			scrapbook.updateDesktop(scrapbook.items[scrapbook.items.length-1].element());
		}else{
			scrapbook.updateDesktop();
		}
	},
	parseXML:function(text) {
		var xmlDoc=null;
		if (window.DOMParser){
			var parser=new DOMParser();
			xmlDoc=parser.parseFromString(text,"text/xml");
		}else{
			xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
			xmlDoc.async=false;
			xmlDoc.loadXML(text); 
		}
		return xmlDoc;
	},
	dumpXml:function(xml) {
		var l=0;
		if (arguments.length>1) l=arguments[2];
		var spaces='                                 ';
		if (xml.childNodes) {
			for(var i=0;i<xml.childNodes.length;i++) {
				//console.log(spaces.substr(0,l)+xml.childNodes[i].nodeName+':'+(xml.childNodes[i].textContent?xml.childNodes[i].textContent:xml.childNodes[i].text));
				this.dumpXml(xml.childNodes[i],l+1);
			}
		}
	},
	parseElements:function(xml) {
		var top=null;
		this.pages[this.whos]=[];
		for(var i=0;i<xml.childNodes.length;i++) {
			if (xml.childNodes[i].nodeName=="scrapbook") top=xml.childNodes[i].childNodes;
		}
		if (top!=null) {
			for(var i=0;i<top.length;i++) {
				if (top[i].nodeName=="page") {
					this.pages[this.whos].push(new this.objects.page(top[i]));
				}else if (top[i].nodeName=="settings") {
					this.parseSettings(top[i]);
				}
			}
		}
		
	},
	parseSettings:function(node) {
		var settings=scrapbook.nodeContent(node);
		for(var k in settings) {
			switch(typeof(this.settings[k])) {
				case "boolean":
					this.settings[k]=(isNaN(settings[k]))?(settings[k]=="true"):(settings[k]==1);
				break;
				default:
					this.settings[k]=settings[k];
				break;
			}
		}
	},
	createItems:function() {
		this.items=this.pages[this.whos][this.showingPage].items;
		var items=[];
		if (arguments.length>0) {
			items=[arguments[0]];
//console.log(arguments[0].details.location.y);
//console.log($(arguments[0].elements).css("top"));
		}else{
			items=this.items;
		}
		
		for(i=0;i<items.length;i++) {
			if(this.pages[this.whos][this.showingPage].details.autoPosition==undefined && items[i].details.location==undefined) items[i].details.location=scrapbook.newLocation();
		}
		if(this.pages[this.whos][this.showingPage].details.autoPosition==undefined) {
			items.sort(function(a,b) {return a.details.location.z-b.details.location.z;});
		}
		var elements=[];
		for(i=0;i<items.length;i++) {
			var o=items[i].element();
			elements.push(o);
			$(o).css("opacity",0);
			$(o).css("display","block");
			if (items[i].highlight) {
				$(o).addClass("highlight");
				items[i].highlight=false;
			}
			this.desktop.appendChild(o);
		}
		$(elements).animate({opacity:1},{duration:500});
		if(this.whos=="mine") {
			$(elements).bind('contextmenu',function(e) {
				e.preventDefault();
				if (!$(this).hasClass("nocontext")) scrapbook.contextment(e,this);
			});
		}
		$(elements).find('button.public').bind("click",function(){
			this.parentNode.parentNode.sourceObject.details.public=1-this.parentNode.parentNode.sourceObject.details.public;
			if (this.parentNode.parentNode.sourceObject.details.public==1) {
				$(this).addClass("on");
				this.title=scrapbook.public.on;
			}else{
				$(this).removeClass("on");
				this.title=scrapbook.public.off;
			}
		});
		$(elements).find('.tools button.remove').bind("click",function() {scrapbook.deleteItem(this.parentNode.parentNode.parentNode);});
		$(elements).find('.tools button.edit').bind("click",function() {scrapbook.editItem(this.parentNode.parentNode.parentNode);});
		$(elements).find('.tools button.grab').bind("click",function() {this.parentNode.parentNode.parentNode.sourceObject.grabItem();});
		$(elements).bind("click",function(e){
			if (e.target==this || $(e.target).data('events')==undefined) {
				this.sourceObject.toTop();
				scrapbook.scrollTo(this);
			}
		});
		$(elements).find('.scrapbookPin').bind("mousedown",function(e){
			e.preventDefault();
			
			var offset={
				x:$(this.parentNode).position().left-e.pageX,
				y:$(this.parentNode).position().top-e.pageY
			};
			scrapbook.moving={object:this.parentNode,offset:offset};
			$(this.parentNode).addClass("dragging");
			var idx=$(this.parentNode).prevAll('.scrapbookItem').get().length;
			scrapbook.items[idx].toTop();
			$(document).bind("mousemove",scrapmove=function(e){
				e.preventDefault();
				var x=e.pageX+scrapbook.moving.offset.x;
				var y=e.pageY+scrapbook.moving.offset.y;
				scrapbook.moving.object.sourceObject.details.location.x=x;
				scrapbook.moving.object.sourceObject.details.location.y=y;
				$(scrapbook.moving.object).css("left",x+"px");
				$(scrapbook.moving.object).css("top",y+"px");
				scrapbook.arrows();
				//scrapbook.updateDesktop();
			});
			$(document).bind("mouseup",scrapup=function(e){
				var x=e.pageX+scrapbook.moving.offset.x;
				var y=e.pageY+scrapbook.moving.offset.y;
				scrapbook.moving.object.sourceObject.details.location.x=x;
				scrapbook.moving.object.sourceObject.details.location.y=y;
				$(scrapbook.moving.object).css("left",x+"px");
				$(scrapbook.moving.object).css("top",y+"px");
				$(document).unbind("mousemove",scrapmove);
				$(document).unbind("mouseup",scrapup);
				$('body').unbind("mouseleave",scrapout);
				scrapbook.updateDesktop(scrapbook.moving.object);
				$(scrapbook.moving.object).removeClass("dragging");
			});
			$('body').bind("mouseleave",scrapout=function(e) {
				$(document).unbind("mousemove",scrapmove);
				$(document).unbind("mouseup",scrapup);
				$('body').unbind("mouseleave",scrapout);
				scrapbook.updateDesktop(scrapbook.moving.object);
				$(scrapbook.moving.object).removeClass("dragging");
			});
		});
		$(this.desktopWindow.element).find('.highlight').each(function(i,o) {
			o.sourceObject.bounce();
			$(o).removeClass("highlight");
		});
		scrapbook.arrows();
	},
	arrows:function() {
		for(var i=0;i<this.items.length;i++) {
			var outside=false;
			var left=false;
			var top=false;
			var right=false;
			var bottom=false;
			var pos=$(this.items[i].object).position();
			if (pos.left+$(this.items[i].object).outerWidth()<this.desktopWindow.element.scrollLeft) left=outside=true;
			if (pos.left>this.desktopWindow.element.scrollLeft+$(this.desktopWindow.element).width()) right=outside=true;
			if (pos.top+$(this.items[i].object).outerHeight()<this.desktopWindow.element.scrollTop) top=outside=true;
			if (pos.top>this.desktopWindow.element.scrollTop+$(this.desktopWindow.element).height()) bottom=outside=true;
			if (outside) {
				if (this.items[i].arrow==undefined || this.items[i].arrow===null) {
					this.items[i].arrow=document.createElement("div");
					this.items[i].arrow.targetObject=this.items[i].object;
					$(this.items[i].arrow).addClass('arrow');
					this.placeholder.appendChild(this.items[i].arrow);
					$(this.items[i].arrow).bind("click",function() {
						scrapbook.scrollTo(this.targetObject);
					});
				}
				if((right || left) && !top && !bottom) {
					var center={
						y:pos.top-this.desktopWindow.element.scrollTop+($(this.items[i].object).outerHeight()/2)-($(this.items[i].arrow).outerHeight()/2)
					}
					if(center.y+$(this.items[i].arrow).outerHeight()>this.desktopWindow.height) bottom=true;
					if(center.y<0) top=true;
					if (!top && !bottom) $(this.items[i].arrow).css("top",Math.round(center.y+1)+"px");
				}
				if((top || bottom) && !left && !right) {
					var center={
						x:pos.left-this.desktopWindow.element.scrollLeft+($(this.items[i].object).outerWidth()/2)-($(this.items[i].arrow).outerWidth()/2)
					}
					if(center.x+$(this.items[i].arrow).outerWidth()>this.desktopWindow.width) right=true;
					if(center.x<0) left=true;
					if (!left && !right) $(this.items[i].arrow).css("left",Math.round(center.x+1)+"px");
				}
				if(bottom || top) $(this.items[i].arrow).css("top","");
				if(left || right) $(this.items[i].arrow).css("left","");
				if(left) $(this.items[i].arrow).addClass('arrowleft');
				if(right) $(this.items[i].arrow).addClass('arrowright');
				if(top) $(this.items[i].arrow).addClass('arrowtop');
				if(bottom) $(this.items[i].arrow).addClass('arrowbottom');
				if (!left && $(this.items[i].arrow).hasClass("arrowleft")) $(this.items[i].arrow).removeClass("arrowleft");
				if (!right && $(this.items[i].arrow).hasClass("arrowright")) $(this.items[i].arrow).removeClass("arrowright");
				if (!top && $(this.items[i].arrow).hasClass("arrowtop")) $(this.items[i].arrow).removeClass("arrowtop");
				if (!bottom && $(this.items[i].arrow).hasClass("arrowbottom")) $(this.items[i].arrow).removeClass("arrowbottom");
			}else if(!outside && (this.items[i].arrow!=undefined && this.items[i].arrow!==null)) {
				$(this.items[i].arrow).remove();
				this.items[i].arrow=undefined;
			}
		}
	},
	contextment:function(e,o) {
		var pos={x:e.pageX,y:e.pageY};
		this.contextItem=o;
		this.context=document.createElement("div");
		$(this.context).addClass("scrapbookContext");

		var d=document.createElement("button");
		d.type="button";
		$(d).html("delete");
		$(d).bind("click",function() {
			$(scrapbook.context).remove();
			scrapbook.deleteItem(scrapbook.contextItem);
			$(document).unbind("mousedown");
		});
		this.context.appendChild(d);
		
		if($(o).find('.tools button.edit').get().length>0) {
			var ed=document.createElement("button");
			ed.type="button";
			$(ed).html("edit");
			$(ed).bind("click",function() {
				$(scrapbook.context).remove();
				scrapbook.editItem(scrapbook.contextItem);
				$(document).unbind("mousedown");
			});
			this.context.appendChild(ed);
		}

		var moveto=document.createElement("div");
		$(moveto).addClass("moveto");
		var ins='';
		for(var p=0;p<this.pages[this.whos].length;p++) {
			if (this.pages[this.whos][p].details.newnotes=="true" && p!=this.showingPage) {
				ins+="<button type='button' onclick='scrapbook.moveto("+p+");'>"+this.pages[this.whos][p].details.title+"</button>";
			}
		}
		if (ins!="") {
			$(moveto).html("Move to...<div class='onhover'>"+ins+"</div>");
			this.context.appendChild(moveto);
		}
		$(this.context).css("position","absolute");
		$(this.context).css("top",pos.y+"px");
		$(this.context).css("left",pos.x+"px");
		document.body.appendChild(this.context);
		$(document).bind("mousedown",function(e){
			var p=scrapbook.parentOfClass(e.target,'scrapbookContext');
			if (p==document.body) {
				e.preventDefault();
				$(scrapbook.context).remove();
				$(document).unbind("mousedown");
			}
		});
	},
	moveto:function(p) {
		$(scrapbook.context).remove();
		$(document).unbind("mousedown");
		var idx=-1;
		for(var i=0;i<this.pages[this.whos][this.showingPage].items.length;i++) {
			if (this.pages[this.whos][this.showingPage].items[i]==this.contextItem.sourceObject) idx=i;
		}
		if (idx>=0) {
			this.pages[this.whos][p].items.push(this.pages[this.whos][this.showingPage].items.splice(idx,1)[0]);
			for(var i=0;i<this.pages[this.whos][p].items.length;i++) {
				this.pages[this.whos][p].items[i].details.location.z=i+1;
			}
			this.pages[this.whos][p].items[this.pages[this.whos][p].items.length-1].highlight=true;
			this.pages[this.whos][p].items[this.pages[this.whos][p].items.length-1].page=this.pages[this.whos][p];
			this.showingPage=p;
			$(this.scrapbookPages).find("a").removeClass("on");
			$(this.scrapbookPages).find("a#"+p).addClass("on");
			this.setPage(p);
		}
		$(document).unbind("mousedown");
	},
	parentOfClass:function(o,c) {
		if (o.parentNode) {
			if (o==document.body) return document.body;
			o=o.parentNode;
			if ($(o).hasClass(c)) return o;
			return scrapbook.parentOfClass(o,c);
		}else{
			return document.body;
		}
	},
	deleteItem:function(o) {
		$(o).animate({opacity:0,top:'+=50'},500,function() {
			for(var i=scrapbook.items.length-1;i>=0;i--) {
				if (scrapbook.items[i]==this.sourceObject) scrapbook.recycleItem(scrapbook.items.splice(i,1)[0]);
				$(this).remove();
			}
			scrapbook.updateDesktop();
		});
	},
	editingItem:null,
	editor:null,
	editItem:function(o) {
		var margin=20;
		if (typeof(o.sourceObject.details.data)=="string") {
			// edit html
			this.editingItem=o;
			this.editor=document.createElement("DIV");
			$(this.editor).addClass("htmlEditor");
			$(this.editor).css("left",($(o).position().left-this.desktopWindow.element.scrollLeft)+"px");
			$(this.editor).css("top",($(o).position().top-this.desktopWindow.element.scrollTop)+"px");
			$(this.editor).css("width",$(o).outerWidth()+"px");
			$(this.editor).css("height",$(o).outerHeight()+"px");
			$(this.editor).css("opacity",0);
			this.placeholder.appendChild(this.editor);
			$(this.editor).animate({width:(this.desktopWindow.width-(2*margin)),height:(this.desktopWindow.height-(2*margin)),opacity:1,left:margin,top:margin},500,function() {
				scrapbook.renderEditor();
			});
		}else{
			// process note editing
		}
	},
	renderEditor:function() {
		var ins=document.createElement("DIV");
		$(ins).addClass("htmlConsole");
		$(ins).css("max-height",$(this.editor).height()+"px");
		$(ins).html("<div><div><input type='text' value='"+(this.editingItem.sourceObject.details.name)+"' /><div class='scrapbookHTML'><textarea style='height:"+($(this.editor).height()-130)+"px' id='scrapbookHTML'>"+this.editingItem.sourceObject.details.data+"</textarea></div><button type='button' class='cancel'>cancel</button><button type='button' class='save'>save</button></div></div>");
		this.editor.appendChild(ins);
		$(ins).find("textarea").css("width",$(this.editor).width()-32);
		$(ins).find(".scrapbookHTML").css("width",$(this.editor).width()-30);
		$(ins).find("input").css("width",$(this.editor).width()-32);
		$(ins).css("opacity",0);
		$(ins).animate({opacity:1},{duration:500});
		if (this.nicEditor==undefined) {
			this.nicEditor = new nicEditor({fullPanel : false,iconsPath:yoodoo.option.baseUrl+'uploads/sitegeneric/image/dooits/nicEditorIcons.gif',buttonList:['save','bold','italic','underline','left','center','right','justify','ol','ul','fontSize','fontFamily','fontFormat','indent','outdent','image','library','link','unlink','forecolor','bgcolor']});
		}
		this.nicEditor.panelInstance('scrapbookHTML',{hasPanel : true});
		this.htmlInstance=this.nicEditor.instanceById('scrapbookHTML');
       
		$(ins).find("button.cancel").bind("click",function() {
			$(scrapbook.editor).fadeOut(500,function(){$(this).remove();});
		});
		$(ins).find("button.save").bind("click",function() {
			var nom=$(scrapbook.editor).find("input").val();
			var txt=scrapbook.htmlInstance.getContent();
			scrapbook.editingItem.sourceObject.details.name=nom;
			scrapbook.editingItem.sourceObject.details.data=txt;
			$(scrapbook.editingItem).find(".name").html(nom);
			$(scrapbook.editingItem).find(".description").html(txt);
			$(scrapbook.editor).fadeOut(500,function(){$(this).remove();});
		});
	},
	getScrapbookUser:function(user) {
		var ok=true;
		if(typeof(user)!="object") {
			if(this.users['user'+user]==undefined) {
				ok=false;
			}else{
				this.viewingUser=this.users['user'+user];
				this.whos='user'+user;
			}
		}else{
			this.viewingUser=user.sourceObject;
			this.whos="user"+user.sourceObject.details.id;
		}
		if (ok) {
			if (this.pages[this.whos]!=undefined) {
				this.setPage(this.showingPage);
			}else{
				yoodoo.getScrapbookUser(this.viewingUser.details.id);
			}
		}
	},
	objects:{
		page:function(node) {
			this.items=[];
			for(var i=0;i<node.childNodes.length;i++) {
				switch(node.childNodes[i].nodeName) {
					case "details":
						this.details=scrapbook.nodeContent(node.childNodes[i]);
					break;
					case "content":
						for(var j=0;j<node.childNodes[i].childNodes.length;j++) {
							try{
								this.items.push(scrapbook.objects[node.childNodes[i].childNodes[j].nodeName](node.childNodes[i].childNodes[j]));
							}catch(e){
								if(typeof(console)!="undefined" && typeof(console.log)!="undefined") console.log(node.childNodes[i].childNodes[j].nodeName+" is not valid element");
							}
						}
						for(var j=0;j<this.items.length;j++) {
							this.items[j].page=this;
						}
					break;
				}
			}
			if(this.details.autoPosition!=undefined) {
				this.items.sort(function(a,b) {return a.details[a.page.details.autoPosition]-b.details[b.page.details.autoPosition];});
				this.items.reverse();
				scrapbook.autoPosition(this.items);
			}
		},
		episode:function(node) {
			var o=new scrapbook.itemObject(node,{className:"episode",width:150,pinColour:"blue",grabable:true,type:"episode",bookcaseType:'book'});
			return o;
		},
		keypoint:function(node) {
			var o=new scrapbook.itemObject(node,{className:"keypoint",width:150,pinColour:"blue",grabable:true,type:"keypoint"});
			return o;
		},
		file:function(node) {
			var o=new scrapbook.itemObject(node,{className:"file",width:150,pinColour:"green",grabable:true,type:"file"});
			return o;
		},
		dooit:function(node) {
			var o=new scrapbook.itemObject(node,{className:"dooit",width:150,pinColour:"purple",grabable:true,type:"dooit",bookcaseType:'dooit'});
			return o;
		},
		comment:function(node) {
			var o=new scrapbook.itemObject(node,{className:"comment",width:250,pinColour:"blue",grabable:true,type:"comment"});
			return o;
		},
		chapter:function(node) {
			var o=new scrapbook.itemObject(node,{className:"comment",width:250,pinColour:"blue",grabable:true,type:"chapter"});
			return o;
		},
		user:function(node) {
			var o=new scrapbook.itemObject(node,{className:"user",width:150,pinColour:"staple",type:"user"});
			o.element=function() {
				if(this.details.classes==undefined) this.details.classes=[];
				this.me=(this.details.me!=undefined && this.details.me);
				if (this.details.classes.indexOf("nocontext")<0) this.details.classes.push("nocontext");
				if(this.me && this.details.classes.indexOf("centeron")<0) this.details.classes.push("centeron");
				if (this.object!==null) return this.object;
				this.object=scrapbook.itemContainer({className:"user",width:"150px",pinColour:'staple',grabable:false,content:this.content(),source:this,classes:this.details.classes,movable:false,privacy:false,remove:false});
				return this.object;
			};
			o.content=function() {
				var ins='';
				if (this.details.podium!=undefined && this.details.podium) {
					ins+="<div class='medal'></div>";
					if (this.details.photo!=undefined && this.details.photo!="") ins+="<img src='"+this.details.photo+"' />";
					if (this.details.score!=undefined && this.details.score!="") ins+="<span class='score'>Score:<br /><span>"+this.details.score+"</span></span>";
					ins+='<div class="name">'+this.details.name+'</div>';

				}else{
					ins+='<div class="name">'+this.details.name+'</div>';
					if (this.details.score!=undefined && this.details.score!="") ins+="<span class='score'>Score: "+this.details.score+"</span>";
					if (this.details.photo!=undefined && this.details.photo!="") ins+="<img src='"+this.details.photo+"' />";
				}
				ins+='<div class="description">'+this.details.comment+'</div>';
				if (!this.me) ins+='<button type="button" onclick="scrapbook.getScrapbookUser(this.parentNode.parentNode);">view</button>';
				return ins;
			};
			scrapbook.users["user"+o.details.id]=o;
			if (o.details.me=="true") scrapbook.me=o;
			o.owner=function() {
				var ins='';
				if (this.details.photo!=undefined && this.details.photo!="") ins+="<img width=20 style='vertical-align:middle' src='"+this.details.photo+"' />";
				ins+=" <a href='javascript:void(0)' onclick='scrapbook.getScrapbookUser("+this.details.id+")'>"+this.details.name+"</a>";
				return ins;
			};
			o.closeText=function() {
				return 'close - '+this.details.name;
			}
			return o;
		},
		note:function(node) {
			var o=new scrapbook.itemObject(node,{className:"note",width:150,pinColour:"red",grabable:true,type:"note"});
			if (node===null) {
				o.details={
					created_at:inputs.formatDate('Y-m-d H:i:s',new Date()),
					data:'empty',
					id:0,
					location:scrapbook.newLocation(),
					name:"New note",
					public:"1"
				}
				o.page=scrapbook.pages[scrapbook.whos][scrapbook.showingPage];
			}
			o.editable=true;
			try{
				var tmp=null;
				eval('tmp='+o.details.data+';');
				o.details.data=tmp;
			}catch(e){}
			
			o.content=function() {
				var ins='<div class="name">'+this.details.name+'</div>';
				ins+='<div class="description">'+this.details.data+'</div>';
				return ins;
			};
			return o;
		}
	},
	newComment:function(o,p) {
		var o=this.parentOfClass(o,'scrapbookItem').sourceObject;
		o.commenter(p);
	},
	itemObject:function(node){
		if(node===null) {
			this.details={};
		}else{
			this.details=scrapbook.nodeContent(node);
		}
		this.params={
			width:150,
			className:"episode",
			pinColour:"blue",
			grabable:false,
			type:'none',
			bookcaseType:'none'
		};
		if (arguments.length>1) {
			for(var k in arguments[1]) {
				this.params[k]=arguments[1][k];
			}
		}
		this.object=null;
		this.editable=false;
		this.grabable=false;
		this.inBookcase=true;
		if(this.params.bookcaseType!="none") this.inBookcase=yoodoo.inBookcase(this.params.bookcaseType,this.details.id);
		this.element=function() {
			//this.inBookcase=yoodoo.inBookcase(this.params.type,this.details.id);
			if (this.object!==null) {
				if (scrapbook.whos!="mine") {
					var att=this.isAttached()!=false;
					$(this.object).find(".tools .grab").html(att?"drop":"grab");
					$(this.object).find(".tools .grab").attr('title',att?"detach this from my scrapbook":"attach this to my scrapbook");
				}
				return this.object;
			}
			var attached=false;
			if(scrapbook.whos!="mine") attached=(this.isAttached()!=false);
			if(scrapbook.whos=="mine") {
				this.params.grabable=(this.details.owner!=undefined && this.details.owner!="");
				attached=this.params.grabable;
			}
			var remove=(scrapbook.whos=="mine");
			if(scrapbook.whos=="mine" && (this.details.owner!=undefined && this.details.owner!="")) remove=false;
			var grabable=this.params.grabable;
			if (scrapbook.whos!="mine" && grabable) {
				if (!scrapbook.settings.share) grabable=false;
				if (!scrapbook.settings.share_a_share && (this.details.owner!=undefined && this.details.owner!="")) grabable=false;
				if (scrapbook.settings.group_defined && this.viewingUser.page.details.share!="1") grabable=false;
				if (!scrapbook.settings.not_in_bookcase && !this.inBookcase) grabable=false;
			}
			this.grabable=grabable;
			this.object=scrapbook.itemContainer({className:this.params.className,width:this.params.width+"px",pinColour:this.params.pinColour,content:this.content(),source:this,location:this.details.location,grab:attached,grabable:grabable,remove:remove});
			return this.object;
		};
		this.isAttached=function() {
			for(var p=0;p<scrapbook.pages.mine.length;p++) {
				for(var i=0;i<scrapbook.pages.mine[p].items.length;i++) {
					if (scrapbook.pages.mine[p].items[i].params.grabable && scrapbook.pages.mine[p].items[i].details.id==this.details.id) return {page:p,item:i};
				}
			}
			return false;
		};
		this.content=function() {
			var ins='<div class="name">'+this.details.name+'</div>';
			ins+='<div class="description">'+this.details.description+'</div>';
			ins+=this.comments();
			return ins;
		};
		this.toggleNext=function(o) {
			var n=$(o).next();
			n.get(0).sourceObject=this;
			if(n.css("display")=="none") {
				$(o).addClass("open");
				n.slideDown(500,function(){
					scrapbook.updateDesktop(this.sourceObject.object,true);
					this.sourceObject.commentSlider();
				});
			}else{
				$(o).removeClass("open");
				n.slideUp(500,function(){scrapbook.updateDesktop();});
			}
		};
		this.comments=function() {
			var ins='';
			if (this.details.comments==undefined || typeof(this.details.comments)=="string") this.details.comments=[];
			if (scrapbook.whos=="mine") {
				ins+="<div class='comments'>";
				var l=this.details.comments.length;
				ins+="<div class='commentOpener' onclick='scrapbook.parentOfClass(this,\"scrapbookItem\").sourceObject.toggleNext(this)'>"+l+" comment"+((l==1)?'':'s')+"</div>";
				ins+="<div style='display:none' class='commentsWindowContainer'><div class='slidebar'></div><div class='commentsWindow'><div class='commentsContent'>";
				for(var i=0;i<this.details.comments.length;i++) {
					if ((this.details.owner!=undefined && this.details.owner!="") && this.details.comments[i].private=="1" && this.details.comments[i].from.id!=scrapbook.me.details.id) {

					}else{
						ins+=this.comment(this.details.comments[i]);
					}
				}
				ins+="</div></div>";
				if (scrapbook.settings.add_comments) {
					ins+="<div class='commentButtons'>";
					ins+="<a href='javascript:void(0)' onclick='scrapbook.newComment(this,false)'>Add</a>";
					if (scrapbook.settings.private_comments && (this.details.owner!=undefined && this.details.owner!="")) ins+=" - <a href='javascript:void(0)' onclick='scrapbook.newComment(this,true)'>Add Privately</a>";
					ins+="</div>";
				}
				ins+="</div></div>";
			}
			return ins;
		};
		this.commentSlider=function() {
			this.commentsWindowContainer=$(this.object).find('.commentsWindowContainer');
			this.commentsWindow=$(this.object).find('.commentsWindow');
			this.commentsWindow.get(0).sourceObject=this;
			this.slidebar=$(this.object).find('.slidebar');
			this.commentsContent=$(this.object).find('.commentsContent');
			var contentheight=this.commentsContent.height();
			var windowheight=this.commentsWindow.height();
			var mst=contentheight-windowheight;
			if(contentheight>windowheight) {
				this.commentsWindow.css("width",(this.commentsWindowContainer.width()-8)+"px")
				contentheight=this.commentsContent.height();
				windowheight=this.commentsWindow.height();
				if (this.bar==null || this.bar==undefined) {
					this.slidebar.html("<div class='bar'></div>");
					this.slidebar.css("display","block");
					this.bar=$(this.slidebar).find(".bar");
					this.bar.get(0).sourceObject=this;
					this.bar.bind("mousedown",function(e){
						e.preventDefault();
						$(document).bind("mousemove",function(e){

						});
						$(document).bind("mouseup",function(e){
							$(document).unbind("mousemove");
							$(document).unbind("mouseup");
						});
					});
					this.bar.draggable({containment:"parent",scroll:false,drag:function(e,u) {
						var o=u.helper[0].sourceObject;
						var p=u.position.top/(o.slidebar.height()-o.bar.height());
						var st=p*(o.commentsContent.height()-o.commentsWindow.height());
						o.commentsWindow.get(0).scrollTop=Math.round(st);
					}});
				}
				this.slidebar.css("height",windowheight+"px");
				var barheight=Math.floor(windowheight*windowheight/contentheight);
				this.bar.css("height",barheight+"px");
				var st=this.commentsWindow.get(0).scrollTop;
				mst=contentheight-windowheight;
				var t=Math.floor((st/mst)*(windowheight-barheight));
				this.bar.css("top",t+"px");

			}else{
				this.commentsWindow.css("width",this.commentsWindowContainer.width()+"px")
				this.bar=null;
				this.slidebar.html("");
				this.slidebar.css("display","none");
			}
			
			if (arguments.length>0 && arguments[0]) {
				this.commentsWindow.animate({scrollTop:mst},{duration:500,step:function() {
					this.sourceObject.commentSlider();
				}});
			}
		};
		this.comment=function(com){
			var asElement=false;
			var o=null;
			var ins='';
			if (arguments.length>1) asElement=arguments[1];
			//if ((this.details.owner!=undefined && this.details.owner!="") && (com.private=="1" && com.from.id!=this.me.details.id)) {
				//ins="Comment not available";
			//}else{
				var when=inputs.stringToDate('Y-m-d H:i:s',com.when);
				ins+="<div class='when'>"+inputs.formatDate('H:i, jS F \'y',when)+"</div>";
				ins+="<div class='from'>"+com.from.name+"</div>";
				ins+=com.content;
			//}
			if(asElement) {
				o=document.createElement("div");
				$(o).addClass("comment");
				if(com.private=="1") $(o).addClass("private");
				$(o).html(ins);
			}else{
				o="<div class='comment"+((com.private=="1")?" private":"")+"'>"+ins+"</div>";
			}
			return o;
		};
		this.addComment=function(ip) {
			if(ip.value.replace(/ /g,'')!="") {
				var private=$(ip).hasClass("private");
				var com={
					content:yoodoo.htmlEntities(ip.value),
					private:private?"1":"0",
					when:inputs.formatDate('Y-m-d H:i:s',new Date()),
					from:{
						id:scrapbook.me.details.id,
						name:scrapbook.me.details.name
					}
				};
				this.details.comments.push(com);
				var c=this.comment(com,true);
				$(c).css("display","none");
				this.commentsContent.get(0).appendChild(c);
				//ip.parentNode.parentNode.insertBefore(c,ip.parentNode);
				c.sourceObject=this;
				$(c).slideDown(1000,function() {scrapbook.updateDesktop(this.sourceObject.object,true);this.sourceObject.commentSlider(true);});
				//scrapbook.updateDesktop();
				$(ip.parentNode.parentNode).find('.commentButtons').slideDown();
				$(ip.parentNode).slideUp(500,function() {$(this).remove()});
			}
		};
		this.commenter=function(private) {
			$(this.object).find('.commentButtons').slideUp();
			var o=document.createElement("div");
			$(o).html("<textarea class='commenter "+(private?"private":"public")+"'></textarea><div><a href='javascript:void(0)'>add</a>&nbsp;&nbsp;<a href='javascript:void(0)'>cancel</a></div>");
			$($(o).find("a").get(0)).bind("click",function() {
				var item=scrapbook.parentOfClass(this,"scrapbookItem");
				item.sourceObject.addComment($(this.parentNode).find("textarea").get(0));
			});
			$($(o).find("a").get(1)).bind("click",function() {
				$(this.parentNode.parentNode.parentNode).find('.commentButtons').slideDown();
				$(this.parentNode).slideUp(500,function() {$(this).remove();scrapbook.updateDesktop();});
			});
			$(o).find("textarea").bind("keydown",function(e){
				var kc=yoodoo.keyCode(e);
				if (kc.enter) {
					e.preventDefault();
					var item=scrapbook.parentOfClass(this,"scrapbookItem");
					item.sourceObject.addComment(this);
				}
				if(kc.escape) {
					$(this.parentNode.parentNode.parentNode).find('.commentButtons').slideDown();
					$(this.parentNode).slideUp(500,function() {$(this).remove();scrapbook.updateDesktop();});
				}
			});
			$(o).find("textarea").bind('blur',function() {
				$(this.parentNode.parentNode.parentNode).find('.commentButtons').slideDown();
				$(this.parentNode).slideUp(500,function() {
					$(this).remove();
					scrapbook.updateDesktop();
				});
			});
			var fb=$(this.object).find(".comments .commentButtons").get(0);
			$(o).css("display","none");
			fb.parentNode.insertBefore(o,fb);
			o.sourceObject=this;
			$(o).slideDown(500,function(){$(this).find("textarea").get(0).focus();scrapbook.updateDesktop(this.sourceObject.object,true);});
		};
		this.toTop=function() {
			scrapbook.toTop(this);
		};
		this.bounce=function() {
			this.details.location.y=parseInt(this.details.location.y);
			if (this.details.location!=undefined && this.details.location.y!=undefined) {
				var o=this.element();
				$(o).animate({top:this.details.location.y-20},{duration:500,ease:"sweep",complete:function() {
					$(this).animate({top:this.sourceObject.details.location.y+20},{duration:500,ease:"sweep",complete:function() {
						$(this).animate({top:this.sourceObject.details.location.y-20},{duration:500,ease:"sweep",complete:function() {
							$(this).animate({top:this.sourceObject.details.location.y},{duration:500,ease:"sweep"});
						}});
					}});
				}});
			}
		};
		this.grabItem=function() {
			var attach=this.isAttached();
			if(attach!=false) {
				$(this.object).find(".tools .grab").html("grab");
				$(this.object).find(".tools .grab").attr("title",'attach this to my scrapbook');
				scrapbook.recycleItem(scrapbook.pages.mine[attach.page].items.splice(attach.item,1)[0]);
				if (scrapbook.whos=="mine") $(this.object).animate({top:'+=20',opacity:0},{duration:500,complete:function(){$(this).remove();}});
			}else{
				$(this.object).find(".tools .grab").html("drop");
				$(this.object).find(".tools .grab").attr("title",'detach this from my scrapbook');
				var o=this.duplicate();
				o.highlight=true;
				o.details.owner=scrapbook.viewingUser.details.id;
				o.details.location=undefined;
				scrapbook.pages.mine[scrapbook.showingPage].items.push(o);
				o.page=scrapbook.pages.mine[scrapbook.showingPage];
				scrapbook.showMine();
			}
		};
		this.bin=function() {
			this.object=null;
			var b=document.createElement('a');
			$(b).addClass("recycleItem");
			b.sourceObject=this;
			$(b).html(this.details.name+" ["+this.params.type+"]");
			b.href='javascript:void(0)';
			$(b).bind("click",function() {
				var i=$(this).prevAll(".recycleItem").get().length;
				scrapbook.recycle.splice(i,1);
				this.sourceObject.page.items.push(this.sourceObject);
				if (this.sourceObject.page==scrapbook.pages[scrapbook.whos][scrapbook.showingPage]) {
//console.log(this.sourceObject.element());
					scrapbook.createItems(this.sourceObject);
					scrapbook.updateDesktop(this.sourceObject.object);
				}
				$(this).slideUp(500,function(){$(this).remove();});
				scrapbook.updateBin();
			});
			return b;
		};
		this.duplicate=function() {
			var o=new scrapbook.objects[this.params.type](null);
			for(var k in this.params) o.params[k]=this.params[k];
			for(var k in this.details) o.details[k]=this.details[k];
			return o;
		};
	},
	newLocation:function() {
		var x=0;
		var y=0;
		var clear=false;
		var spacing=100;
		var a=0;
		var da=Math.PI/20;
		var r=100;
		var checks=0;
		while(!clear && checks<1000) {
			a+=da;
			if (a>Math.PI/2) {
				a-=2*da;
				da=-da;
			}
			if (a<0) {
				da=-da;
				a=da;
				r+=50;
			}
			x=r*Math.cos(a);
			y=r*Math.sin(a);
			var minh=1000000;
			for(var i=0;i<this.pages[this.whos][this.showingPage].items.length;i++) {
				if (typeof(this.pages[this.whos][this.showingPage].items[i].details.location)=="object") {
					var h=Math.sqrt(Math.pow(this.pages[this.whos][this.showingPage].items[i].details.location.x-x,2)+Math.pow(this.pages[this.whos][this.showingPage].items[i].details.location.y-y,2));
					if (h<minh) minh=h;
				}
			}
			clear=(minh>spacing);
			checks++;
		//console.log(x,y,a,r);
		}
		return {x:x,y:y,z:this.pages[this.whos][this.showingPage].items.length};
	},
	toTop:function(item) {
		item.object.parentNode.appendChild(item.object);
		var i=0;
		for(var ii=0;ii<this.items.length;ii++) {
			if (this.items[ii]==item) i=ii;	
		}
		this.items.push(this.items.splice(i,1)[0]);
		for(var ii=0;ii<this.items.length;ii++) {
			//console.log(this.items[ii]);
			this.items[ii].details.location.z=ii+1;
			var z=parseInt(this.zIndex)+parseInt(this.items[ii].details.location.z);
			$(this.items[ii].object).css("z-index",z);
		}
	},
	scrollTo:function(element) {
		var toBottom=false;
		if (arguments.length>1) toBottom=arguments[1];
		var x=$(element).position().left+Math.round($(element).width()/2)-Math.round($(this.desktopWindow.element).width()/2);
		var y=$(element).position().top+Math.round($(element).height()/2)-Math.round($(this.desktopWindow.element).height()/2);
		if (toBottom) {
			if ($(element).height()>$(this.desktopWindow.element).height()) {
				y=$(element).position().top+Math.round($(element).height())-Math.round($(this.desktopWindow.element).height());
			}
		}
		var maxx=$(this.desktop).width()-$(this.desktopWindow.element).width();
		var maxy=$(this.desktop).height()-$(this.desktopWindow.element).height();
		if (x>maxx) x=maxx
		if (y>maxy) y=maxy;
		if (x<0) x=0;
		if (y<0) y=0;
		$(this.desktopWindow.element).animate({'scrollTop':y,'scrollLeft':x},{
			duration: 1000,
			easing: 'swing',
			step:function(){scrapbook.arrows();}
		});
	},
	updateDesktop:function() {
		this.autoScroll=null;
		if (arguments.length>0) this.autoScroll=arguments[0];
		var toBottom=false;
		if (arguments.length>1) toBottom=arguments[1];
		var maxx=this.desktopWindow.width;
		var maxy=this.desktopWindow.height;
		var minx=0;
		var miny=0;
		for(var i=0;i<this.items.length;i++) {
			var l=$(this.items[i].object).position().left;
			var t=$(this.items[i].object).position().top;
			var r=l+$(this.items[i].object).outerWidth();
			var b=t+$(this.items[i].object).outerHeight();
			if (maxx<r+this.boundary) maxx=r+this.boundary;
			if (maxy<b+this.boundary) maxy=b+this.boundary;
			if (minx>l-this.boundary) minx=l-this.boundary;
			if (miny>t-this.boundary) miny=t-this.boundary;
		}
		if (minx<0 || miny<0) {
			maxx-=minx;
			maxy-=miny;
			for(var i=0;i<this.items.length;i++) {
				this.items[i].details.location.x-=minx;
				this.items[i].details.location.y-=miny;
				$(this.items[i].object).css("left",this.items[i].details.location.x+"px");
				$(this.items[i].object).css("top",this.items[i].details.location.y+"px");
			}
		}
		if (($(this.desktop).width()>maxx || $(this.desktop).height()>maxy) && (minx>=0 && miny>=0)){
			$(this.desktop).animate({width:maxx+"px",height:maxy+"px"},{duration:500,easing:'swing',step:function(){scrapbook.arrows();},complete:function(){if (scrapbook.autoScroll!==null) scrapbook.scrollTo(scrapbook.autoScroll);}})
		}else{
			$(this.desktop).css("width",maxx+"px");
			$(this.desktop).css("height",maxy+"px");
			if (minx<0 || miny<0) {
				this.desktopWindow.element.scrollLeft-=minx;
				this.desktopWindow.element.scrollTop-=miny;
			}
			if (this.autoScroll!==null) this.scrollTo(this.autoScroll,toBottom);
		}
	},
	
	itemContainer:function(params) {
		var d=document.createElement("div");
		if (params.source!=undefined) d.sourceObject=params.source;
		
		var z=parseInt(this.zIndex);
		if (params.source.details.location!=undefined && params.source.details.location.z!=undefined) z+=parseInt(params.source.details.location.z);
		$(d).css("z-index",z);
		var x=0;
		if (params.source.details.location!=undefined && params.source.details.location.x!=undefined) x+=parseInt(params.source.details.location.x);
		$(d).css("left",x+'px');
		var y=0;
		if (params.source.details.location!=undefined && params.source.details.location.y!=undefined) y+=parseInt(params.source.details.location.y);
		$(d).css("top",y+'px');
		
		$(d).addClass("scrapbookItem");
		if (params.classes!=undefined) {
			for(var p=0;p<params.classes.length;p++) $(d).addClass(params.classes[p]);
		}
		if (params.className!=undefined) $(d).addClass(params.className);
		if (params.width!=undefined) $(d).css("width",params.width);
		if (params.height!=undefined) $(d).css("height",params.height);
		var pinColour='red';
		if (params.pinColour!=undefined) pinColour=params.pinColour;
		var content='empty';
		if (params.content!=undefined) content=params.content;
		var ins='<div class="scrapbookPin'+((params.movable==undefined || params.movable)?" movable":"")+' pin'+pinColour+'"></div>';
		ins+='<div class="scrapbookItemContent">';

		if (scrapbook.whos=="mine" && (params.source.details.owner!=undefined && params.source.details.owner!='') && scrapbook.users["user"+params.source.details.owner]!=undefined) {
			ins+=scrapbook.users["user"+params.source.details.owner].owner();
		}

		if (scrapbook.whos=="mine" && (params.privacy==undefined || params.privacy) && (params.remove==undefined || params.remove)) ins+='<button type="button" class="public'+((params.source.details.public=='1')?' on':'')+'" title="'+((params.source.details.public=='1')?this.public.on:this.public.off)+'"></button>';
		if (scrapbook.whos=="mine" && (params.remove==undefined || params.remove)) {
			ins+='<div class="tools">';
			if (params.source.editable) ins+='<button type="button" class="edit" title="edit"></button>';
			ins+='<button type="button" class="remove" title="delete"></button>';
			ins+="</div>";
		}else if(params.grabable) {
			ins+='<div class="tools">';
			ins+='<button type="button" class="grab" title="'+((params.grab)?'detach this from my scrapbook':'attach this to my scrapbook')+'">'+((params.grab)?'drop':'grab')+'</button>';
			ins+="</div>";
		}
		if (params.source.details.created_at!=undefined && params.source.details.created_at!="") {
			var dt=inputs.stringToDate('Y-m-d H:i:s',params.source.details.created_at);
			var today=new Date();
			var weekago=new Date(today.getFullYear(),today.getMonth(),today.getDate()-7);
			var thisWeek=(weekago.getTime()<dt.getTime());
			var thisYear=(today.getFullYear()==dt.getFullYear());
			ins+="<div class='created_at'>"+inputs.formatDate((thisWeek?'H:i jS M':(thisYear?'jS M':'jS M Y')),dt)+"</div>";
		}
		ins+=content+'</div>';
		$(d).html(ins);
		return d;
	},
	nodeContent:function(node) {
		var params={};
		if (node.nodeName=="comments") {
			params=[];
			for(var i=0;i<node.childNodes.length;i++) {
				params.push(this.nodeContent(node.childNodes[i]));
			}
		}else{
			for(var i=0;i<node.childNodes.length;i++) {
				if (node.childNodes[i].childNodes.length==1 && (node.childNodes[i].childNodes[0].nodeName=='#text' || node.childNodes[i].childNodes[0].nodeName=='#cdata-section')) {
					params[node.childNodes[i].nodeName]=node.childNodes[i].childNodes[0].textContent?node.childNodes[i].childNodes[0].textContent:node.childNodes[i].childNodes[0].text;
				}else if (node.childNodes[i].childNodes.length>0) {
					for(var n=0;n<node.childNodes[i].childNodes.length;n++) {
						params[node.childNodes[i].nodeName]=this.nodeContent(node.childNodes[i]);
					}
				}else{
					params[node.childNodes[i].nodeName]=node.childNodes[i].textContent?node.childNodes[i].textContent:node.childNodes[i].text;
				}
			}
		}
		return params;
	},
	autoPosition:function(items) {
		this.autoLayout.sideCount=Math.ceil(Math.sqrt(items.length-3));
		var cells=[[]];
		var z=items.length+1;
		if (items.length>=1) {
			items[0].details.podium=true;
			items[0].details.location={x:0,y:0,z:z--};
			if (items[0].details.classes==undefined) {
				items[0].details.classes=['gold'];
			}else{
				items[0].details.classes.push('gold');
			}
			items[0].details.classes.push('podium');
		}
		if (items.length>=2) {
			items[1].details.podium=true;
			items[1].details.location={x:-this.autoLayout.spread.x,y:this.autoLayout.spread.y/3,z:z--};
			if (items[1].details.classes==undefined) {
				items[1].details.classes=['silver'];
			}else{
				items[1].details.classes.push('silver');
			}
			items[1].details.classes.push('podium');
		}
		if (items.length>=3) {
			items[2].details.podium=true;
			items[2].details.location={x:this.autoLayout.spread.x,y:this.autoLayout.spread.y/2,z:z--};
			if (items[2].details.classes==undefined) {
				items[2].details.classes=['bronze'];
			}else{
				items[2].details.classes.push('bronze');
			}
			items[2].details.classes.push('podium');
		}
		if (items.length>3) {
			for(var i=3;i<items.length;i++) {
				var l=cells.length-1;
				if (cells[l].length>=this.autoLayout.sideCount) {
					cells.push([]);
					l++;
				}
				cells[l].push(items[i]);
			}
			i=4;
			for(var x=0;x<cells.length;x++) {
				var dir=1;
				for(var y=0;y<cells[x].length;y++) {
					var cX=Math.floor((y+1)/2)*this.autoLayout.spread.x*dir;
					var cY=(this.autoLayout.spread.y/this.autoLayout.sideCount)*Math.floor((y+1)/2);
					cY+=(x+2)*this.autoLayout.spread.y;
					cells[x][y].details.location={x:cX,y:cY,z:z--};
//console.log(z);
					//console.log(cX,cY);
					//cells[x][y].details.location={x:this.autoLayout.offset.x+(this.autoLayout.spread.x*x),y:this.autoLayout.offset.y+(this.autoLayout.spread.y*y),z:i};
					dir=-dir;
				}
			}
		}
	},
	uploader:function() {
		var res=scrapbook.iframeResponse;
		if (arguments.length>0) res=arguments[0];
		if (window.attachEvent) {
			window.attachEvent('onmessage',res);
		}else{
			window.addEventListener('message',res,false);
		}
		var w=504;
		w+=20;
		var h=400;
		var sitehash='missingSite';
		if (typeof(yoodoo)!="undefined" && yoodoo.sitehash!=undefined) sitehash=yoodoo.sitehash;
		var userhash='missingUser';
		if (typeof(yoodoo)!="undefined" && yoodoo.loginCode!=undefined) userhash=yoodoo.loginCode;
		var ins='<iframe src="'+yoodoo.option.baseUrl+'utilities/uploader/uploadForm.php?quantity=0&sitehash='+sitehash+'&userhash='+userhash+'&width='+w+'&height='+h+'&filter=scrapbook&callback=scrapbook.imageSelected&origin='+window.location.hostname+'" style="width:'+w+'px;height:'+h+'px" scrolling="no" ></iframe>';
		dialog.show({id:'scrapbookuploader',title:'Upload',content:ins,withBlackoutClickClose:false});
	},
	uploaderClosed:function() {
		if (window.detachEvent) {
			window.detachEvent('onmessage',scrapbook.iframeResponse);
		}else{
			window.removeEventListener('message',scrapbook.iframeResponse,false);
		}
	},
	iframeResponse:function(r) {
		try{
			eval(r.data);
		}catch(e){
			//console.log(r.data);
		}
	},
	imageSelected:function(img) {
		scrapbook.htmlInstance.restoreRng();
		scrapbook.nicEditor.nicCommand("insertImage",img.source);
		var imgs=$(scrapbook.htmlInstance.elm).find("IMG").get();
		for(var i=0;i<imgs.length;i++) {
			if(imgs[i].src==img.source) imgs[i].title=img.title;
		}
		dialog.hide();
	}
};
