var libraryButton=null;
var libraryOptions=null;

scrapbooker={
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
		add_comments:true
	},
	newItemCache:{},
	showingUsers:false,
	showingGroups:false,
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
			x:200,
			y:100
		}
	},
	
	items:[],
	publicText:{
		on:'Edit Sharing',
		off:'Share in groups'
	},
	init:function(params) {
		this.showingGroups=false;
		this.showingUsers=false;
		this.showingPage=0;
		this.container=(params.container==undefined)?this.container:params.container;
		if (this.container!==null) {
			this.createDesktop();	
			if (params.xml!==undefined) this.setXML(params.xml);
			
		}
		libraryOptions = {
			buttons : {'library' : {name : __('Add an image'), type : 'libraryButton'}
			},iconFiles : {'library' : yoodoo.option.baseUrl+'utilities/uploader/nicLibrary.png'}
		};
		libraryButton = nicEditorAdvancedButton.extend({   
		  mouseClick : function() {
			  scrapbooker.uploader();
		  }
		});
		nicEditors.registerPlugin(nicPlugin,libraryOptions);
	},
	dispose:function() {
		//if (this.recycle.length>0) {
		//	this.fetchScrapbookPage(-1,'scrapbooker.disposed');
		//}else{
			this.disposed();
		//}
	},
	disposed:function() {
		this.destroy();
		yoodoo.hide();
	},
	setXML:function(xml) {
		this.whos='mine';
		this.viewingUser=undefined;
		this.parseElements(this.parseXML(xml));
		for(var p=0;p<this.pages.mine.length;p++) {
			if (this.pages.mine[p].details.displayed==true) this.showingPage=p;
		}
		this.clearAndRedraw();
		this.drawPages();
		this.addNewNoteButton();
		this.managePageTabs();
	},
	gotUserXML:function(xml){
		this.parseElements(this.parseXML(xml));
		this.setPage(this.showingPage);
	},
	showMine:function() {
		this.whos='mine';
		this.viewingUser=undefined;
		this.setPage(this.showingPage);
	},
	destroy:function() {
		while(yoodoo.scrapbookFiles.length>0) {
			var i=yoodoo.scrapbookFiles.pop();
			i.parentNode.removeChild(i);
		}
		if (dooit != undefined) dooit.removeTemporaries();
		$(this.container).remove();
		scrapbooker=undefined;
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
		if (yoodoo.is_touch) {
			$(this.desktop).bind("touchstart",function(e) {
				if (e.target==this) {
					e.preventDefault();
					this.offset={
						x:e.originalEvent.touches[0].pageX+scrapbooker.desktopWindow.element.scrollLeft,
						y:e.originalEvent.touches[0].pageY+scrapbooker.desktopWindow.element.scrollTop
					};
					$(window).bind("touchmove.desktopMove",function(e){
						var x=e.originalEvent.touches[0].pageX-scrapbooker.desktop.offset.x;
						var y=e.originalEvent.touches[0].pageY-scrapbooker.desktop.offset.y;
						scrapbooker.desktopWindow.element.scrollLeft=-x;
						scrapbooker.desktopWindow.element.scrollTop=-y;
						scrapbooker.arrows();
					});
					$(window).bind("touchend.desktopUp",function(e){
						var x=e.originalEvent.changedTouches[0].pageX-scrapbooker.desktop.offset.x;
						var y=e.originalEvent.changedTouches[0].pageY-scrapbooker.desktop.offset.y;
						scrapbooker.desktopWindow.element.scrollLeft=-x;
						scrapbooker.desktopWindow.element.scrollTop=-y;
						$(window).unbind("touchmove.desktopUp");
						$(window).unbind("touchend.desktopMove");
						scrapbooker.arrows();
					});
				}
			});
		}else{
			$(this.desktop).bind("mousedown",function(e) {
				if (e.target==this) {
					e.preventDefault();
					this.offset={
						x:e.pageX+scrapbooker.desktopWindow.element.scrollLeft,
						y:e.pageY+scrapbooker.desktopWindow.element.scrollTop
					};
					$(document).bind("mousemove",desktopMove=function(e){
						var x=e.pageX-scrapbooker.desktop.offset.x;
						var y=e.pageY-scrapbooker.desktop.offset.y;
						scrapbooker.desktopWindow.element.scrollLeft=-x;
						scrapbooker.desktopWindow.element.scrollTop=-y;
						scrapbooker.arrows();
					});
					$(document).bind("mouseup",desktopUp=function(e){
						var x=e.pageX-scrapbooker.desktop.offset.x;
						var y=e.pageY-scrapbooker.desktop.offset.y;
						scrapbooker.desktopWindow.element.scrollLeft=-x;
						scrapbooker.desktopWindow.element.scrollTop=-y;
						$(document).unbind("mouseup",desktopUp);
						$(document).unbind("mousemove",desktopMove);
						scrapbooker.arrows();
					});
				}
			});
		}
	},
	drawPages:function() {
		while(this.scrapbookPages.childNodes.length>0) this.scrapbookPages.removeChild(this.scrapbookPages.childNodes[0]);
		var tabPages=[];
		var labels=[];
		var firstTitle='';
		if (this.showingGroups) {
			var pc=0;
			for(var p=0;p<this.pages[this.whos].length;p++) {
				if (this.pages[this.whos][p].details.type!="group") {
					pc++;
					if (firstTitle=="") firstTitle=this.pages[this.whos][p].details.title;
				}
			}
			if (pc>1) {
				labels.push("Pages...");
			}else{
				labels.push(firstTitle);
			}
			tabPages.push(0);
			for(var p=0;p<this.pages[this.whos].length;p++) {
				if (this.pages[this.whos][p].details.type=="group") {
					tabPages.push(p);
					labels.push(this.pages[this.whos][p].details.title);
				}
			}
		}else{
			var groupCount=0;
			var firstGroupId=null;
			for(var p=0;p<this.pages[this.whos].length;p++) {
				if (this.pages[this.whos][p].details.type!="group") {
					tabPages.push(p);
					labels.push(this.pages[this.whos][p].details.title);
				}else{
					groupCount++;
					if (firstGroupId==null) firstGroupId=p;
				}
			}
			if (firstGroupId!==null) {
				tabPages.push(firstGroupId);
				if (groupCount>1) {
					labels.push("Groups...");
				}else{
					labels.push(this.pages[this.whos][firstGroupId].details.title);
				}
			}
		}
		var d=document.createElement("div");
		$(d).css({float:'left',position:'relative'});
		var dd=document.createElement("div");
		$(dd).addClass('pageTabBlockScroller').css({overflow:'hidden'});
		var moreLeft=document.createElement("div");
		$(moreLeft).addClass("moreLeft").css({display:"block"}).bind('click',function(){scrapbooker.scrollTabs(-1);});
		var moreRight=document.createElement("div");
		$(moreRight).addClass("moreRight").css({display:"block"}).bind('click',function(){scrapbooker.scrollTabs(1);});
		d.appendChild(moreLeft);
		d.appendChild(moreRight);
		d.appendChild(dd);
		var ds=document.createElement("div");
		$(ds).addClass('pageTabBlock').css({'white-space':'nowrap',height:30});
		dd.appendChild(ds);
		var moreLeft=document.createElement("div");
		$(moreLeft).addClass("moreLeft").css({display:"none"});
		var moreRight=document.createElement("div");
		$(moreRight).addClass("moreRight").css({display:"none"});
		
		for(var p=0;p<tabPages.length;p++) {
			var a=document.createElement("a");
			a.id=tabPages[p];
			$(a).html("<span class='l'>&nbsp;</span><span class='c'>"+((this.pages[this.whos][tabPages[p]].details.type=="group")?"<span class='group'>&nbsp;</span>":"")+this.truncateTab(labels[p])+"</span><span class='r'>&nbsp;</span>");
			$(a).addClass("tab");
			a.title=labels[p];
			if(tabPages[p]==this.showingPage) $(a).addClass("on");
			a.href='javascript:void(0)';
			$(a).bind("click",function() {
				this.selected();
			});
			a.selected=function() {
				if (!$(this).hasClass("on")) {
					scrapbooker.whos="mine";
					scrapbooker.setPage(this.id);
					$(this).siblings("a.on").removeClass("on");
					$(this).addClass("on");
				}
			};
			ds.appendChild(a);
		}
		var spacer=document.createElement("span");
		$(spacer).html("&nbsp;").css({display:"inline-block",width:17});
		ds.appendChild(spacer);
		this.scrapbookPages.appendChild(d);
	},
	truncateTab:function(txt) {
		return txt;
	},
	managePageTabs:function() {
		var w=$(this.scrapbookPages).width();
		var used=0;
		var a=$(this.scrapbookPages).find(">a").get();
		var pa=$(this.scrapbookPages).find(".pageTabBlock>a").get();
		if (pa.length>0) {
			var sw=$(pa[pa.length-1]).offset().left+$(pa[pa.length-1]).outerWidth(true)-$(pa[0]).offset().left;
			$(this.scrapbookPages).find(".pageTabBlock").css({width:sw});
			for(var i=0;i<a.length;i++) used+=$(a[i]).outerWidth(true);
			var available=w-used;
			$(this.scrapbookPages).find(">div").css({'max-width':available});
			if($(this.scrapbookPages).find(".pageTabBlock").width()>$(this.scrapbookPages).find(">div").width()) {
				$(this.scrapbookPages).find(".moreLeft,.moreRight").css({display:"block"});
				$(this.scrapbookPages).find(".pageTabBlockScroller").addClass('truncatedScroller');
			}else{
				$(this.scrapbookPages).find(".moreLeft,.moreRight").css({display:"none"});
				$(this.scrapbookPages).find(".pageTabBlockScroller").removeClass('truncatedScroller');
			}
			yoodoo.initSlider($(this.scrapbookPages).find(".pageTabBlockScroller").get(0),$(this.scrapbookPages).find(".pageTabBlock").get(0),'>a');
		}
	},
	scrollTabs:function(dir) {
		var ps=$(this.scrapbookPages).find(".pageTabBlockScroller").get(0);
		ps.scrollLeft+=dir*10;
	},
	setPage:function(i){
		$('.bar.ui-draggable').draggable("destroy");
		this.sendingPost();
		if(i>=this.pages[this.whos].length) i=0;
		this.showingPage=i;
		this.showingGroups=(this.pages[this.whos][this.showingPage].details.type=="group");
		$(this.desktop).find('>*').fadeOut(500);
		setTimeout('scrapbooker.fetchScrapbookPage();',600);
		//this.checkTabs();
	},
	/*checkTabs:function() {
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
			if (parentIndex!=0) tablist.push(parseInt(parentIndex));
			for(var p=1;p<this.pages[this.whos].length;p++) {
				if (this.pages[this.whos][p].details.grouped==parentId) tablist.push(p);
			}			
		}else{
			for(var p=0;p<this.pages[this.whos].length;p++) {
				if (this.pages[this.whos][p].details.grouped==undefined) tablist.push(p);
			}
		}
		var changed=false;
//console.log(this.tablist,tablist);
		if (tablist.length!=this.tablist.length) {
			//if (this.tablist.length==0) {
			//	this.tablist=tablist;
			//}else{
				changed=true;
			//}
		}else{
			for(var i=0;i<this.tablist.length;i++) {
				if (this.tablist[i]!=tablist[i]) changed=true;
			}
		}
//console.log(changed);
		if (changed) {
			this.tablist=tablist;
			$(this.scrapbookPages).animate({height:0,'padding-top':30},{duration:1000,complete:function(){
				scrapbooker.drawPages(scrapbooker.tablist);
				$(scrapbooker.scrapbookPages).animate({height:30,'padding-top':0},{duration:1000});
				scrapbooker.addNewNoteButton();
			}});
		}else{
			this.addNewNoteButton();
		}
	},*/
	recycleItem:function(item) {
		this.recyclePage=this.showingPage;
		this.recycle.push(item);
		this.updateBin();
		this.managePageTabs();
	},
	showBin:function(){
		var rb=$(this.scrapbookPages).find('.bin .recyclebin');
		var pos=rb.offset();
		this.bin=document.createElement('div');
		$(this.bin).addClass("inbin");
		$(this.bin).css("top",pos.top+"px");
		$(this.bin).css("left",(pos.left+rb.width()-310)+"px");
		$(this.bin).html("<a href='javascript:void(0)' onclick='scrapbooker.purgeBin()' class='purgebin'>purge</a><div>Recycle bin...</div>");
		for(var r=0;r<this.recycle.length;r++) {
			this.bin.appendChild(this.recycle[r].bin());
		}
		document.body.appendChild(this.bin);
		$(document).bind("mousedown",function(e){
			var p=scrapbooker.parentOfClass(e.target,'inbin');
			if (p==document.body) {
				e.preventDefault();
				$(scrapbooker.bin).remove();
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
	purgeBin:function() {
		var ids=[];
		for(var r=0;r<scrapbooker.recycle.length;r++) {
			ids.push(scrapbooker.recycle[r].details.scrapbookid)
		}
		scrapbooker.sendingPost();
		if (scrapbooker.pages.mine[scrapbooker.showingPage].details.type=="scrapbook") {
			yoodoo.sendPost(null,{cmd:'manageScrapbook',method:'purge',page:scrapbooker.pages.mine[scrapbooker.showingPage].details.id,callback:'scrapbooker.gotResponse',items:ids.join(",")});
		}else{
			yoodoo.sendPost(null,{cmd:'manageScrapbook',method:'purge',group:scrapbooker.pages.mine[scrapbooker.showingPage].details.id,callback:'scrapbooker.gotResponse',items:ids.join(",")});
		}
		scrapbooker.recycle=[];
		scrapbooker.updateBin();
	},
	addNewNoteButton:function() {
		this.addNotes=(this.pages[this.whos][this.showingPage].details.newnotes!=undefined && this.pages[this.whos][this.showingPage].details.newnotes=="true");
		this.addNotes=(this.whos=="mine")&&(this.pages[this.whos][this.showingPage].details.type=="scrapbook");
		if (this.whos!="mine") {
			$(scrapbooker.scrapbookPages).find(".newnote").remove();
			var a=document.createElement("a");
			$(a).html("<span class='l'>&nbsp;</span><span class='c'>"+this.users[this.whos].closeText()+"</span><span class='r'>&nbsp;</span>");
			$(a).addClass("tab");
			$(a).addClass("newnote");
			a.href='javascript:void(0)';
			$(a).bind("click",function() {
				scrapbooker.showMine();
			});
			this.scrapbookPages.appendChild(a);
		}else if (!this.addNotes) {
			$(scrapbooker.scrapbookPages).find(".newnote").remove();
		}else{
			if ($(scrapbooker.scrapbookPages).find(".newnote").get().length==0) {
				var a=document.createElement("a");
				$(a).html("<span class='l'>&nbsp;</span><span class='c'>+ note</span><span class='r'>&nbsp;</span>");
				$(a).addClass("tab");
				$(a).addClass("newnote");
				a.href='javascript:void(0)';
				$(a).bind("click",function() {
					scrapbooker.addNote();
				});
				this.scrapbookPages.appendChild(a);
			}
		}
		if (this.whos=="mine") {
			if ($(scrapbooker.scrapbookPages).find(".bin").get().length==0) {
				var a=document.createElement("a");
				$(a).html("<span class='l'>&nbsp;</span><span class='c'><span class='recyclebin'>"+this.recycle.length+"</span></span><span class='r'>&nbsp;</span>");
				$(a).addClass("tab");
				$(a).addClass("bin");
				$(a).css("display",((this.recycle.length==0)?"none":"block"));
				a.href='javascript:void(0)';
				$(a).bind("click",function() {
					scrapbooker.showBin();
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
		for(var i=0;i<scrapbooker.items.length;i++) {
			$(scrapbooker.items[i].arrow).remove();
			scrapbooker.items[i].arrow=undefined;
		}
		while(scrapbooker.desktop.childNodes.length>0) $(scrapbooker.desktop.childNodes[0]).remove();
		scrapbooker.createItems();
		var target=$(scrapbooker.desktop).find(".scrapbookItem.centeron").get();
		if (target.length>0) {
			scrapbooker.updateDesktop(target[0]);
		}else if(scrapbooker.items.length>0) {
			scrapbooker.updateDesktop(scrapbooker.items[scrapbooker.items.length-1].element());
		}else{
			scrapbooker.updateDesktop();
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
					if (this.whos!="mine") {
						this.pages[this.whos][this.showingPage]=new this.objects.page(top[i]);
					}else{
						this.pages[this.whos].push(new this.objects.page(top[i]));
					}
				}else if (top[i].nodeName=="settings") {
					this.parseSettings(top[i]);
				}
			}
		}
		
	},
	parseSettings:function(node) {
		var settings=scrapbooker.nodeContent(node);
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
		if (this.pages[this.whos][this.showingPage].users==undefined) this.showingUsers=false;
		if (this.pages[this.whos][this.showingPage].details.type!="group")  this.showingUsers=false;
			
		var userButton=(this.pages[this.whos][this.showingPage].details.type=="group");
		if (this.pages[this.whos][this.showingPage].reports!=undefined) {
			if (userButton && this.pages[this.whos][this.showingPage].reports.length>0) {
				var abuseButton=document.createElement("a");
				$(abuseButton).addClass("tab abuse_reports");
				abuseButton.href='javascript:void(0)';
				var q=this.pages[this.whos][this.showingPage].reports.length;
				$(abuseButton).html("<span class='l'>&nbsp;</span><span class='c'>"+q+' report'+((q==1)?'':'s')+"</span><span class='r'>&nbsp;</span>");
				var bin=$(scrapbooker.container).find(".scrapbookPages .bin").get();
				if (bin.length==0) {
					$(scrapbooker.container).find(".scrapbookPages").get(0).appendChild(abuseButton);
				}else{
					$(scrapbooker.container).find(".scrapbookPages").get(0).insertBefore(abuseButton,bin[0]);
				}
				$(abuseButton).bind('click',function() {
					var report=document.createElement("div");
					$(report).css({
						'max-height':scrapbooker.desktopWindow.height,
						position:'absolute',
						right:0,
						top:0
					}).addClass('reportAbuseWindow').html("<a href='javascript:void(0)'>close</a><em>Reported comments</em>");
					var q=scrapbooker.pages[scrapbooker.whos][scrapbooker.showingPage].reports.length;
					for(var i=0;i<q;i++) {
						var item=document.createElement("div");
						$(item).addClass("reportAbuseItem");
						var ins="<div class='reportAbuseItemContent'>";
						ins+="<span style='float:right'>"+yoodoo.ago(scrapbooker.pages[scrapbooker.whos][scrapbooker.showingPage].reports[i].reported)+"</span>";
						ins+="<b>"+scrapbooker.pages[scrapbooker.whos][scrapbooker.showingPage].reports[i].owner+"</b><br />"+scrapbooker.pages[scrapbooker.whos][scrapbooker.showingPage].reports[i].comment+"<div>reported by "+scrapbooker.pages[scrapbooker.whos][scrapbooker.showingPage].reports[i].reporter+"</div></div>";
						ins+="<div class='abusetools' style='display:none'>";
						ins+="<a href='javascript:void(0)' onclick='scrapbooker.pages[scrapbooker.whos][scrapbooker.showingPage].abuseReject(this.parentNode.parentNode)'>Ignore</a>";
						ins+="<a href='javascript:void(0)' onclick='scrapbooker.pages[scrapbooker.whos][scrapbooker.showingPage].abuseUphold(this.parentNode.parentNode)'>Remove</a>";
						ins+="<a href='javascript:void(0)' onclick='scrapbooker.pages[scrapbooker.whos][scrapbooker.showingPage].abuseEscalate(this.parentNode.parentNode)'>Escalate "+scrapbooker.pages[scrapbooker.whos][scrapbooker.showingPage].reports[i].owner+"</a>";
						ins+="</div>";
						$(item).html(ins);
						report.appendChild(item);
					}
					$(report).find(">a").bind("click",function() {
						$(this.parentNode).slideUp(function() {$(this).remove();});
					});
					$(report).find('.reportAbuseItem .reportAbuseItemContent').bind("click",function() {
						$(this.parentNode).find(".abusetools").slideDown();
					});
					$(report).bind("mouseleave", function() {
						$(this).find(".abusetools").slideUp();
					});
					scrapbooker.container.appendChild(report);
				});
				
			}
		}
		if (this.showingUsers) {
			this.items=this.pages[this.whos][this.showingPage].users;
		}else{
			this.items=this.pages[this.whos][this.showingPage].items;
		}
		var items=[];
		if (arguments.length>0) {
			items=[arguments[0]];
		}else{
			items=this.items;
		}
		$(scrapbooker.container).find('.scrapbookPages .groupUserToggle').remove();
		if (userButton) {
			var but=document.createElement("a");
			var who='';
			if (scrapbooker.whos!="mine") {
				who='&nbsp;[';
				if (scrapbooker.users[scrapbooker.whos].details.fullname!=undefined && scrapbooker.users[scrapbooker.whos].details.fullname!="") {
					who+=scrapbooker.users[scrapbooker.whos].details.fullname;
				}else{
					who+=scrapbooker.users[scrapbooker.whos].details.firstname+" "+scrapbooker.users[scrapbooker.whos].details.lastname;
				}
				who+=']';
			}
			$(but).addClass("tab groupUserToggle");
			but.href='javascript:void(0)';
			$(but).html("<span class='l'>&nbsp;</span><span class='c'><span>"+(scrapbooker.showingUsers?'Show items':'Show users')+""+who+"</span></span><span class='r'>&nbsp;</span>");
			$(but).addClass(scrapbooker.showingUsers?"showUsers":"showItems");
			$(but).bind('click',function() {
				$(this).unbind("click");
				scrapbooker.whos="mine";
				scrapbooker.showingUsers=!scrapbooker.showingUsers;
				scrapbooker.clearAndRedraw();
				scrapbooker.updateDesktop();
				if (scrapbooker.showingUsers) {
					$(this).addClass("showUsers");
					$(this).removeClass("showItems");
					$(this).find('.c span').html('Show items');
				}else{
					$(this).removeClass("showUsers");
					$(this).addClass("showItems");
					$(this).find('.c span').html('Show users');
				}
			});
			var bin=$(scrapbooker.container).find(".scrapbookPages .bin").get();
			if (bin.length==0) {
				$(scrapbooker.container).find(".scrapbookPages").get(0).appendChild(but);
			}else{
				$(scrapbooker.container).find(".scrapbookPages").get(0).insertBefore(but,bin[0]);
			}
		}
		if (this.pages[this.whos][this.showingPage].details.autoPosition==undefined && !this.showingUsers) {
			for(i=0;i<items.length;i++) {
				if(items[i].details.location==undefined) {
					items[i].details.location=scrapbooker.newLocation();
				}else if(items[i].details.location.x=='' || items[i].details.location.y=='' || isNaN(items[i].details.location.x) || isNaN(items[i].details.location.y) || isNaN(items[i].details.location.z)) {
					items[i].details.location=scrapbooker.newLocation();
				}
			}
		}
		if(this.pages[this.whos][this.showingPage].details.autoPosition==undefined) {
			items.sort(function(a,b) {return a.details.location.z-b.details.location.z;});
		}
		var elements=[];
		if (items.length==0) {
			var empty=document.createElement("div");
			$(empty).addClass("emptyPage");
			this.desktop.appendChild(empty);
		}else{
			$(this.desktop).find(".emptyPage").remove();
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
		}
		$(elements).animate({opacity:1},{duration:500});
		if(this.whos=="mine") {
			if (this.pages[this.whos][this.showingPage].details.type=="scrapbook") {
				$(elements).bind('contextmenu',function(e) {
					e.preventDefault();
					if (!$(this).hasClass("nocontext")) scrapbooker.contextmenu(e,this);
				});
			}
		}
		$(elements).find('button.public').bind("click",function(e){
			var source=this.parentNode.parentNode.sourceObject;
			source.blockout=document.createElement("div");
			$(source.blockout).css({opacity:0});
			$(source.blockout).addClass('blockout');
			this.parentNode.appendChild(source.blockout);
			source.shareBox=document.createElement("div");
			$(source.shareBox).css({position:"absolute",left:0,top:0});
			this.parentNode.appendChild(source.shareBox);
			var ins=[];
			var groups=source.groups();
			for(var g=0;g<scrapbooker.pages.mine.length;g++) {
				if (scrapbooker.pages.mine[g].details.type=="group") {
					var on=false;
					for(var mg=0;mg<groups.length;mg++) {
						if(groups[mg].details.id==scrapbooker.pages.mine[g].details.id) on=true;
					}
					ins.push("<label><input id='"+scrapbooker.pages.mine[g].details.id+"' type='checkbox'"+(on?" checked":"")+" /> "+scrapbooker.pages.mine[g].details.title+"</label>");
				}
			}
			$(source.shareBox).html(ins.join("")+"<button type='button' style='display:none'>Save</button>");
			$(source.shareBox).addClass("scrapbookContext");
			$(source.blockout).bind("click",function() {
				var so=this.parentNode.parentNode.sourceObject;
				$(so.shareBox).remove();
				$(so.blockout).remove();
				so.blockout=undefined;
				so.shareBox=undefined;
			});
			$(source.shareBox).find("input").bind('change',function() {
				$(this.parentNode.parentNode).find("button").css({display:"block"});
			});
			$(source.shareBox).find("button").bind("click",function() {
				var groups={};
				var inAGroup=false;
				$(this.parentNode).find("input").each(function(i,e) {
					groups[e.id]=e.checked;
					if (e.checked) inAGroup=true;
				});
				if(inAGroup) {
					$(this.source.object).find("button.public").addClass("on");
					$(this.source.object).find("button.public").attr("title",scrapbooker.publicText.on);
				}else{
					$(this.source.object).find("button.public").removeClass("on");
					$(this.source.object).find("button.public").attr("title",scrapbooker.publicText.off);
				}
				this.source.setGroups(groups);
				var so=this.source;
				$(so.shareBox).remove();
				$(so.blockout).remove();
				so.blockout=undefined;
				so.shareBox=undefined;
			});
			$(source.shareBox).find("button").get(0).source=source;
		});
		$(elements).find('.tools button.remove').bind("click",function() {scrapbooker.deleteItem(this.parentNode.parentNode.parentNode);});
		$(elements).find('.tools button.edit').bind("click",function() {scrapbooker.editItem(this.parentNode.parentNode.parentNode);});
		$(elements).find('.tools button.grab').bind("click",function() {this.parentNode.parentNode.parentNode.sourceObject.grabItem();});
		$(elements).bind("click",function(e){
			if (e.target==this || $(e.target).data('events')==undefined) {
				this.sourceObject.toTop();
				scrapbooker.scrollTo(this);
			}
		});
		$(elements).find(".comment").bind("click",function() {
//console.log(this);
			$(this).find(".commentTools").slideDown(function() {
				var com=scrapbooker.parentOfClass(this,'scrapbookItem');
				if($(com).hasClass("scrapbookItem")) com.sourceObject.commentSlider();
			});
		});
		$(elements).find('a.commentDelete').bind("click",function() {
			var item=scrapbooker.parentOfClass(this,"scrapbookItem");
			item.sourceObject.deleteComment(this);
		});
		$(elements).find('a.commentReport').bind("click",function() {
			var item=scrapbooker.parentOfClass(this,"scrapbookItem");
			item.sourceObject.reportComment(this);
		});
		$(elements).bind("mouseleave",function() {
			$(this).find(".commentTools").slideUp(function() {
				var com=scrapbooker.parentOfClass(this,'scrapbookItem');
				if($(com).hasClass("scrapbookItem")) com.sourceObject.commentSlider();
			});
		});
		$(elements).find('.scrapbookPin.movable').bind("mousedown",function(e){
			e.preventDefault();
			var offset={
				x:$(this.parentNode).position().left-e.pageX,
				y:$(this.parentNode).position().top-e.pageY
			};
			scrapbooker.moving={object:this.parentNode,offset:offset};
			$(this.parentNode).addClass("dragging");
			var idx=$(this.parentNode).prevAll('.scrapbookItem').get().length;
			scrapbooker.items[idx].toTop();
			$(document).bind("mousemove",scrapmove=function(e){
				e.preventDefault();
				var x=e.pageX+scrapbooker.moving.offset.x;
				var y=e.pageY+scrapbooker.moving.offset.y;
				scrapbooker.moving.object.sourceObject.details.location.x=x;
				scrapbooker.moving.object.sourceObject.details.location.y=y;
				$(scrapbooker.moving.object).css("left",x+"px");
				$(scrapbooker.moving.object).css("top",y+"px");
				scrapbooker.arrows();
			});
			$(document).bind("mouseup",scrapup=function(e){
				var x=e.pageX+scrapbooker.moving.offset.x;
				var y=e.pageY+scrapbooker.moving.offset.y;
				scrapbooker.moving.object.sourceObject.details.location.x=x;
				scrapbooker.moving.object.sourceObject.details.location.y=y;
				$(scrapbooker.moving.object).css("left",x+"px");
				$(scrapbooker.moving.object).css("top",y+"px");
				$(document).unbind("mousemove",scrapmove);
				$(document).unbind("mouseup",scrapup);
				$('body').unbind("mouseleave",scrapout);
				scrapbooker.updateDesktop(scrapbooker.moving.object);
				scrapbooker.moving.object.sourceObject.sendPosition();
				$(scrapbooker.moving.object).removeClass("dragging");
			});
			$('body').bind("mouseleave",scrapout=function(e) {
				var x=e.pageX+scrapbooker.moving.offset.x;
				var y=e.pageY+scrapbooker.moving.offset.y;
				scrapbooker.moving.object.sourceObject.details.location.x=x;
				scrapbooker.moving.object.sourceObject.details.location.y=y;
				$(scrapbooker.moving.object).css("left",x+"px");
				$(scrapbooker.moving.object).css("top",y+"px");
				$(document).unbind("mousemove",scrapmove);
				$(document).unbind("mouseup",scrapup);
				$('body').unbind("mouseleave",scrapout);
				scrapbooker.updateDesktop(scrapbooker.moving.object);
				scrapbooker.moving.object.sourceObject.sendPosition();
				$(scrapbooker.moving.object).removeClass("dragging");
			});
		});
		$(this.desktopWindow.element).find('.highlight').each(function(i,o) {
			o.sourceObject.bounce();
			$(o).removeClass("highlight");
		});
		scrapbooker.arrows();
		scrapbooker.managePageTabs();
	},
	arrows:function() {
		for(var i=0;i<this.items.length;i++) {
			var outside=false;
			var left=false;
			var top=false;
			var right=false;
			var bottom=false;
			var pos=$(this.items[i].object).position();
			if (pos.left+$(this.items[i].object).outerWidth(true)<this.desktopWindow.element.scrollLeft) left=outside=true;
			if (pos.left>this.desktopWindow.element.scrollLeft+$(this.desktopWindow.element).width()) right=outside=true;
			if (pos.top+$(this.items[i].object).outerHeight(true)<this.desktopWindow.element.scrollTop) top=outside=true;
			if (pos.top>this.desktopWindow.element.scrollTop+$(this.desktopWindow.element).height()) bottom=outside=true;
			if (outside) {
				if (this.items[i].arrow==undefined || this.items[i].arrow===null) {
					this.items[i].arrow=document.createElement("div");
					this.items[i].arrow.targetObject=this.items[i].object;
					$(this.items[i].arrow).addClass('arrow');
					this.placeholder.appendChild(this.items[i].arrow);
					$(this.items[i].arrow).bind("click",function() {
						scrapbooker.scrollTo(this.targetObject);
					});
				}
				if((right || left) && !top && !bottom) {
					var center={
						y:pos.top-this.desktopWindow.element.scrollTop+($(this.items[i].object).outerHeight(true)/2)-($(this.items[i].arrow).outerHeight(true)/2)
					}
					if(center.y+$(this.items[i].arrow).outerHeight(true)>this.desktopWindow.height) bottom=true;
					if(center.y<0) top=true;
					if (!top && !bottom) $(this.items[i].arrow).css("top",Math.round(center.y+1)+"px");
				}
				if((top || bottom) && !left && !right) {
					var center={
						x:pos.left-this.desktopWindow.element.scrollLeft+($(this.items[i].object).outerWidth(true)/2)-($(this.items[i].arrow).outerWidth(true)/2)
					}
					if(center.x+$(this.items[i].arrow).outerWidth(true)>this.desktopWindow.width) right=true;
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
	contextmenu:function(e,o) {
		var ins='';
		for(var p=0;p<this.pages.mine.length;p++) {
			if (this.pages.mine[p].details.type=="scrapbook" && this.pages.mine[p].details.newnotes && p!=this.showingPage) {
				ins+="<button type='button' onclick='scrapbooker.moveto("+p+");'>"+this.pages.mine[p].details.title+"</button>";
			}
		}
		if (ins!="") {
			var pos={x:e.pageX,y:e.pageY};
			this.contextItem=o;
			this.context=document.createElement("div");
			$(this.context).addClass("scrapbookContext");
			var moveto=document.createElement("div");
			$(moveto).html("Move to..."+ins+"");
			this.context.appendChild(moveto);
			$(this.context).css("position","absolute");
			$(this.context).css("top",pos.y+"px");
			$(this.context).css("left",pos.x+"px");
			document.body.appendChild(this.context);
			$(document).bind("mousedown",function(e){
				var p=scrapbooker.parentOfClass(e.target,'scrapbookContext');
				if (p==document.body) {
					e.preventDefault();
					$(scrapbooker.context).remove();
					$(document).unbind("mousedown");
				}
			});
		}
	},
	moveto:function(p) {
		$(scrapbooker.context).remove();
		$(document).unbind("mousedown");
		var idx=-1;
		for(var i=0;i<this.pages[this.whos][this.showingPage].items.length;i++) {
			if (this.pages[this.whos][this.showingPage].items[i]==this.contextItem.sourceObject) idx=i;
		}
		if (idx>=0) {
			this.contextItem.sourceObject.moveToPage(this.pages[this.whos][p].details.id,p);
		}
		$(document).unbind("mousedown");
	},
	parentOfClass:function(o,c) {
		if (o.parentNode) {
			if (o==document.body) return document.body;
			o=o.parentNode;
			if ($(o).hasClass(c)) return o;
			return scrapbooker.parentOfClass(o,c);
		}else{
			return document.body;
		}
	},
	deleteItem:function(o) {
		$(o).animate({opacity:0,top:'+=50'},500,function() {
			//this.sourceObject.recycle();
			for(var i=scrapbooker.pages.mine[scrapbooker.showingPage].items.length-1;i>=0;i--) {
				if (scrapbooker.pages.mine[scrapbooker.showingPage].items[i]==this.sourceObject) {
					scrapbooker.recycleItem(scrapbooker.pages.mine[scrapbooker.showingPage].items.splice(i,1)[0]);
				}
			}
			scrapbooker.sendingPost();
			var p={cmd:'manageScrapbook',method:'scrapbookDelete',id:this.sourceObject.details.scrapbookid,callback:'scrapbooker.gotResponse'};
			if(scrapbooker.pages.mine[scrapbooker.showingPage].details.type=="scrapbook") {
				p.fromPage=scrapbooker.pages.mine[scrapbooker.showingPage].details.id;
			}else{
				p.fromGroup=scrapbooker.pages.mine[scrapbooker.showingPage].details.id;
			}
			yoodoo.sendPost(null,p);
			$(this).remove();
			scrapbooker.updateDesktop();
		});
	},
	undeleteItem:function(o) {
			for(var i=scrapbooker.recycle.length-1;i>=0;i--) {
				if (scrapbooker.recycle[i]==o) {
					scrapbooker.recycle.splice(i,1);
				}
			}
			scrapbooker.sendingPost();
			var p={cmd:'manageScrapbook',method:'scrapbookUndelete',id:o.details.scrapbookid,callback:'scrapbooker.gotResponse'};
			if(scrapbooker.pages.mine[scrapbooker.showingPage].details.type=="scrapbook") {
				p.fromPage=scrapbooker.pages.mine[scrapbooker.showingPage].details.id;
			}else{
				p.fromGroup=scrapbooker.pages.mine[scrapbooker.showingPage].details.id;
			}
			yoodoo.sendPost(null,p);
	},
	editingItem:null,
	editor:null,
	editItem:function(o) {
		var margin=20;
		if (typeof(o.sourceObject.details.note.html)=="string") {
			this.editingItem=o;
			this.editor=document.createElement("DIV");
			$(this.editor).addClass("htmlEditor");
			$(this.editor).css("left",($(o).position().left-this.desktopWindow.element.scrollLeft)+"px");
			$(this.editor).css("top",($(o).position().top-this.desktopWindow.element.scrollTop)+"px");
			$(this.editor).css("width",$(o).outerWidth(true)+"px");
			$(this.editor).css("height",$(o).outerHeight(true)+"px");
			$(this.editor).css("opacity",0);
			this.placeholder.appendChild(this.editor);
			$(this.editor).animate({width:(this.desktopWindow.width-(2*margin)),height:(this.desktopWindow.height-(2*margin)),opacity:1,left:margin,top:margin},500,function() {
				scrapbooker.renderEditor();
			});
		}else{
			// process note editing
		}
	},
	renderEditor:function() {
		var ins=document.createElement("DIV");
		var h=$(this.editor).height();
		$(ins).addClass("htmlConsole");
		$(ins).css("max-height",h+"px");
		$(ins).html("<div><div><div class='scrapbookHTML'><textarea style='height:"+(h-70)+"px' id='scrapbookHTML'>"+this.editingItem.sourceObject.details.note.html+"</textarea></div><button type='button' class='cancel'>cancel</button><button type='button' class='save'>save</button></div></div>");
		this.editor.appendChild(ins);
		$(ins).find("textarea").css("width",$(this.editor).width()-32);
		$(ins).find(".scrapbookHTML").css("width",$(this.editor).width()-30);
		$(ins).css("opacity",0);
		$(ins).animate({opacity:1},{duration:500});
		if (this.nicEditor==undefined) {
			this.nicEditor = new nicEditor({fullPanel : false,iconsPath:yoodoo.option.baseUrl+'uploads/sitegeneric/image/dooits/nicEditorIcons.gif',buttonList:['save','bold','italic','underline','left','center','right','justify','ol','ul','fontSize','fontFamily','fontFormat','indent','outdent','image','library','link','unlink','forecolor','bgcolor']});
		}
		this.nicEditor.panelInstance('scrapbookHTML',{hasPanel : true});
		this.htmlInstance=this.nicEditor.instanceById('scrapbookHTML');
		$(ins).find("button.cancel").bind("click",function() {
			$(scrapbooker.editor).fadeOut(500,function(){$(this).remove();});
		});
		$(ins).find("button.save").bind("click",function() {
			var txt=scrapbooker.htmlInstance.getContent();
			if(!(/<img/.test(txt)) && txt.replace(/<[^>]+>/g,'').replace(/( |&nbsp;)+/g,'')=='') txt='Empty';
			scrapbooker.editingItem.sourceObject.details.note.html=txt;
			$(scrapbooker.editingItem).find(".description").html(txt);
			$(scrapbooker.editor).fadeOut(500,function(){$(this).remove();});
			scrapbooker.editingItem.sourceObject.sendContent();
			scrapbooker.updateDesktop();
		});
		$(this.htmlInstance.ne.nicPanel.panelElm.parentNode.parentNode).next().css({'max-height':(h-62)});
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
		if (ok) yoodoo.getScrapbookUser(this.viewingUser.details.id,this.pages.mine[this.showingPage].details.id,'scrapbooker.gotUser');
	},
	gotUser:function(o) {
		o=yoodoo.decodeHTMLResponse(o);
		this.parseElements(this.parseXML(o));
		this.showingUsers=false;
		this.clearAndRedraw();
		this.updateDesktop();
	},
	objects:{
		page:function(node) {
			this.items=[];
			this.users=[];
			for(var i=0;i<node.childNodes.length;i++) {
				switch(node.childNodes[i].nodeName) {
					case "details":
						this.details=scrapbooker.nodeContent(node.childNodes[i]);
					break;
					case "content":
						for(var j=0;j<node.childNodes[i].childNodes.length;j++) {
							var item=scrapbooker.nodeContent(node.childNodes[i].childNodes[j]);
							try{
								if (item.deleted=="1") {
									scrapbooker.recycle.push(scrapbooker.objects[item.type](node.childNodes[i].childNodes[j]));
								}else{
									this.items.push(scrapbooker.objects[item.type](node.childNodes[i].childNodes[j]));
								}
							}catch(e){
								if(typeof(console)!="undefined" && typeof(console.log)!="undefined") console.log(item.type+" is not valid element");
							}
						}
						for(var j=0;j<this.items.length;j++) {
							this.items[j].page=this;
						}
					break;
					case "users":
						this.users=[];
						for(var j=0;j<node.childNodes[i].childNodes.length;j++) {
							try{
								this.users.push(scrapbooker.objects.user(node.childNodes[i].childNodes[j]));
							}catch(e){
								if(typeof(console)!="undefined" && typeof(console.log)!="undefined") console.log(node.childNodes[i].childNodes[j].nodeName+" is not valid element");
							}
						}
						for(var j=0;j<this.users.length;j++) {
							this.users[j].page=this;
						}
					break;
					case "abuse":
						this.reports=[];
						for(var j=0;j<node.childNodes[i].childNodes.length;j++) {
							var abuse=scrapbooker.nodeContent(node.childNodes[i].childNodes[j]);
							if(/^new Date/.test(abuse.reported)) eval('abuse.reported='+abuse.reported+';');
							this.reports.push(abuse);
						}
					break;
				}
			}
			if(this.details.autoPosition!=undefined) {
				this.users.sort(function(a,b) {return a.details[a.page.details.autoPosition]-b.details[b.page.details.autoPosition];});
				if (this.details.autoPosition=="score") this.items.reverse();
				scrapbooker.autoPosition[this.details.autoPosition](this.items);
			}else if (this.users.length>0) {
				this.users.sort(function(a,b) {return b.details.score-a.details.score;});
				//this.users.reverse();
				scrapbooker.autoPosition.score(this.users);
			}
			this.abuseUpdate=function(idx,method) {
				if (idx<this.reports.length) {
					var params={
						cmd:'manageScrapbook',
						method:method,
						id:this.reports[idx].id,
						callback:'scrapbooker.gotResponse'
					};
					yoodoo.sendPost(null,params);
					scrapbooker.sendingPost();
				}
			};
			this.abuseEscalate=function(o) {
				var idx=$(o).prevAll('.reportAbuseItem').get().length;
				$(o).slideUp(function() {$(this).remove();});
				this.abuseUpdate(idx,'escalateReport');
				this.reports.splice(idx,1);
			};
			this.abuseUphold=function(o) {
				var idx=$(o).prevAll('.reportAbuseItem').get().length;
				$(o).slideUp(function() {$(this).remove();});
				this.abuseUpdate(idx,'upholdReport');
				this.reports.splice(idx,1);
			};
			this.abuseReject=function(o) {
				var idx=$(o).prevAll('.reportAbuseItem').get().length;
				$(o).slideUp(function() {$(this).remove();});
				this.abuseUpdate(idx,'rejectReport');
				this.reports.splice(idx,1);
			};
		},
		event:function(node) {
			var o=new scrapbooker.itemObject(node,{className:"event",width:scrapbooker.desktopWindow.width-66,pinColour:"staple",grabable:false,type:"event",movable:false});
			o.element=function() {
				this.params.classes=[];
				if (this.details.urgency!=undefined && this.details.urgency!="") this.params.classes.push(this.details.urgency);
				if (this.details.complete!=undefined && this.details.complete=="1") this.params.classes.push('complete');
				if (this.object!==null) return this.object;
				this.object=scrapbooker.eventContainer({classes:this.params.classes,className:this.params.className,width:this.params.width+"px",pinColour:this.params.pinColour,content:this.content(),source:this});
				return this.object;
			};
			o.content=function() {
				var ins='';
				ins+='<div class="name">'+this.details.name+'</div>';
				ins+='<div class="description">'+this.details.description+'</div>';
				var lw=scrapbooker.desktopWindow.width-86;
				if (lw>688) lw=688;
				ins+='<img src="'+yoodoo.option.baseUrl+'uploads/sitegeneric/file/overlay/addons/blue-line.png" width='+lw+' />';
				return ins;
			};
			return o;
		},
		episode:function(node) {
			var o=new scrapbooker.itemObject(node,{className:"episode",width:170,pinColour:(scrapbooker.whos=="mine")?"blue":"staple",grabable:true,type:"episode",bookcaseType:'book',movable:(scrapbooker.whos=="mine")});
			return o;
		},
		fragment:function(node) {
			return this.chapter(node);
		},
		keypoint:function(node) {
			var o=new scrapbooker.itemObject(node,{className:"keypoint",width:170,pinColour:(scrapbooker.whos=="mine")?"blue":"staple",grabable:true,type:"keypoint",bookcaseType:'keypoint',movable:(scrapbooker.whos=="mine")});
			return o;
		},
		file:function(node) {
			var o=new scrapbooker.itemObject(node,{className:"file",width:170,pinColour:(scrapbooker.whos=="mine")?"green":"staple",grabable:true,type:"file",movable:(scrapbooker.whos=="mine")});
			return o;
		},
		dooit:function(node) {
			var o=new scrapbooker.itemObject(node,{className:"dooit",width:170,pinColour:(scrapbooker.whos=="mine")?"purple":"staple",grabable:true,type:"dooit",bookcaseType:'dooit',movable:(scrapbooker.whos=="mine")});
			return o;
		},
		chapter:function(node) {
			var o=new scrapbooker.itemObject(node,{className:"chapter",width:170,pinColour:(scrapbooker.whos=="mine")?"blue":"staple",grabable:true,type:"chapter",bookcaseType:'chapter',movable:(scrapbooker.whos=="mine")});
			return o;
		},
		user:function(node) {
			var o=new scrapbooker.itemObject(node,{className:"user",width:170,pinColour:"staple",type:"user",movable:false});
			o.element=function() {
				if(this.details.classes==undefined) this.details.classes=[];
				this.me=(this.details.me!=undefined && this.details.me);
				if (this.details.classes.indexOf("nocontext")<0) this.details.classes.push("nocontext");
				if(this.me && this.details.classes.indexOf("centeron")<0) this.details.classes.push("centeron");
				if (this.object!==null) return this.object;
				this.object=scrapbooker.itemContainer({className:"user",width:"170",pinColour:'staple',grabable:false,content:this.content(),source:this,classes:this.details.classes,movable:false,privacy:false,remove:false});
				return this.object;
			};
			o.content=function() {
				var ins='';
				this.details.fullname=this.details.name;
				if (this.details.firstname!=undefined && this.details.firstname!="") {
					this.details.fullname=this.details.firstname;
					if (this.details.lastname!=undefined && this.details.lastname!="") {
						this.details.fullname+=' '+this.details.lastname;
					}
				}
				if (this.details.podium!=undefined && this.details.podium) {
					ins+="<div class='medal'></div>";
					if (this.details.photo!=undefined && this.details.photo!="") ins+="<img src='"+this.details.photo+"' />";
					if (this.details.score!=undefined && this.details.score!="") ins+="<span class='score'>Score:<br /><span>"+this.details.score+"</span></span>";
					ins+='<div class="name">'+this.details.fullname+'</div>';
				}else{
					ins+='<div class="name">'+this.details.fullname+'</div>';
					if (this.details.score!=undefined && this.details.score!="") ins+="<span class='score'>Score: "+this.details.score+"</span>";
					if (this.details.photo!=undefined && this.details.photo!="") ins+="<img src='"+this.details.photo+"' />";
				}
				ins+='<div class="description">'+this.details.comment+'</div>';
				if (!this.details.me) ins+='<button type="button" class="userViewButton" onclick="scrapbooker.getScrapbookUser(this.parentNode.parentNode);">show their items</button>';
				return ins;
			};
			scrapbooker.users["user"+o.details.id]=o;
			if (o.details.me=="true") scrapbooker.me=o;
			o.owner=function() {
				var ins='';
				if (this.details.photo!=undefined && this.details.photo!="") ins+="<img width=20 style='vertical-align:middle' src='"+this.details.photo+"' />";
				ins+=" <a href='javascript:void(0)' onclick='scrapbooker.getScrapbookUser("+this.details.id+")'>"+this.details.name+"</a>";
				return ins;
			};
			o.closeText=function() {
				return 'close - '+this.details.name;
			}
			return o;
		},
		note:function(node) {
			var o=new scrapbooker.itemObject(node,{className:"note",width:170,pinColour:(scrapbooker.whos=="mine")?"red":"staple",grabable:true,type:"note",movable:(scrapbooker.whos=="mine")});
			if (node===null) {
				var id=new Date().getTime();
				o.details={
					created_at:new Date(),
					scrapbookid:id,
					location:scrapbooker.newLocation(),
					note:{
						id:id,
						html:"New note content",
						mine:true,
						script:""
					},
					linked:{
						pages:[scrapbooker.pages[scrapbooker.whos][scrapbooker.showingPage].details.id],
						groups:[]
					}
				}
				o.page=scrapbooker.pages[scrapbooker.whos][scrapbooker.showingPage];
				o.setId=function(ids) {
					ids=ids.split('|');
					ids.splice(0,1);
					eval('ids='+ids.join('|')+';');
					scrapbooker.newItemCache[this.details.scrapbookid]=undefined;
					this.details.scrapbookid=ids.scrapbook;
					this.details.note.id=ids.note;
				};
				scrapbooker.newItemCache[o.details.scrapbookid]=o;
				var params={
					cmd:'newNote',
					html:o.details.note.html,
					script:o.details.note.script,
					x:o.details.location.x,
					y:o.details.location.y,
					z:o.details.location.z,
					callback:'scrapbooker.newItemCache['+o.details.scrapbookid+'].setId'
				};
				if (o.page.details.type=="group") {
					params.group=o.page.details.id;
				}else{
					params.page=o.page.details.id;
				}
				yoodoo.sendPost(null,params);
			}
			o.editable=o.details.note.mine;
			//if (o.details.note.owner!=undefined) o.editable=false;
			try{
				var tmp=null;
				eval('tmp='+o.details.data+';');
				o.details.data=tmp;
			}catch(e){}
			
			o.content=function() {
				var ins='';
				if (this.details.note.owner!=undefined) ins+="<div class='owner'>"+this.details.note.owner+"</div>";
				ins+='<div class="description">'+this.details.note.html+'</div>';
				ins+=this.comments();
				return ins;
			};
			return o;
		}
	},
	newComment:function(o,p) {
		o=this.parentOfClass(o,'scrapbookItem').sourceObject;
		o.commenter(p);
	},
	itemObject:function(node){
		if(node===null) {
			this.details={};
			this.details.linked={pages:[],groups:[]};
		}else{
			this.details=scrapbooker.nodeContent(node);
			if (this.details.linked!=undefined) {
				if (this.details.linked.pages) {
					this.details.linked.pages=this.details.linked.pages.split(",");
				}else{
					this.details.linked.pages=[];
				}
				if (this.details.linked.groups) {
					this.details.linked.groups=this.details.linked.groups.split(",");
				}else{
					this.details.linked.groups=[];
				}
			}else{
				this.details.linked={pages:[],groups:[]};
			}
		}
		this.params={
			width:150,
			className:"episode",
			pinColour:"blue",
			grabable:false,
			type:'none',
			bookcaseType:'none',
			movable:true
		};
		if (arguments.length>1) {
			for(var k in arguments[1]) {
				this.params[k]=arguments[1][k];
			}
		}
		this.object=null;
		this.editable=false;
		this.unread=0;
		this.grabable=false;
		this.inBookcase=false;
		if(this.params.bookcaseType!="none") {
			if (this.params.bookcaseType=="dooit") this.inBookcase=yoodoo.inBookcase("dooit",this.details.exercise.exerciseid);
			if (this.params.bookcaseType=="book") this.inBookcase=yoodoo.inBookcase("book",this.details.id);
			if (this.params.bookcaseType=="chapter") {
				this.inBookcase=yoodoo.inBookcase("book",this.details.episodeid);
			}
			if (this.params.bookcaseType=="keypoint") this.inBookcase=yoodoo.inBookcase("book",this.details.episodeid);
		}
		if (yoodoo.scrapbookedItem.type!==null) {
			if (yoodoo.scrapbookedItem.type=="dooit" && this.params.bookcaseType=="dooit") {
				if(yoodoo.scrapbookedItem.id==this.details.exercise.exerciseid) {
					this.highlight=true;
				}
			}else{
			//if (yoodoo.scrapbookedItem.type=="book" && this.params.bookcaseType=="book") {
				if(yoodoo.scrapbookedItem.id==this.details.id) {
					this.highlight=true;
				}
			}
			if (this.highlight) {
				yoodoo.scrapbookedItem={type:null,id:null};
			}
		}
		this.element=function() {
			var shared=false;
			if (scrapbooker.whos!="mine") shared=this.isAttached();
			if (this.object!==null) return this.object;
			var remove=(scrapbooker.whos=="mine") || shared;
			if (scrapbooker.whos!="mine" && !shared && (this.params.type=="note" || this.inBookcase) && this.params.type!="none") this.grabable=true;
			this.object=scrapbooker.itemContainer({className:this.params.className,width:this.params.width+"px",pinColour:this.params.pinColour,content:this.content(),source:this,location:this.details.location,grab:shared,grabable:this.grabable,remove:remove,movable:this.params.movable});
//console.log($(this.object).find(".comment"));
			return this.object;
		};
		this.isAttached=function() {
			for(var i=0;i<scrapbooker.pages.mine[scrapbooker.showingPage].items.length;i++) {
				if(this.details.type == scrapbooker.pages.mine[scrapbooker.showingPage].items[i].details.type && this.details.target_id == scrapbooker.pages.mine[scrapbooker.showingPage].items[i].details.target_id) return true;
			}
			return false;
		};
		/*this.isPublic=function() {
			for(var a=0;a<this.details.linked.pages.length;a++) {
				for(var p=0;p<scrapbooker.pages.mine.length;p++) {
					if (scrapbooker.pages.mine[p].details.type=="scrapbook" && scrapbooker.pages.mine[p].details.id==this.details.linked.pages[a]) {
						if (scrapbooker.pages.mine[p].details.public=="1") return true;
					}
				}
			}
			return false;
		};*/
		this.groups=function() {
			var groups=[];
			if (this.details.linked!=undefined && this.details.linked.groups!=undefined && this.details.linked.groups.length!=undefined) {
				for(var a=0;a<this.details.linked.groups.length;a++) {
					for(var p=0;p<scrapbooker.pages.mine.length;p++) {
						if (scrapbooker.pages.mine[p].details.type=="group" && scrapbooker.pages.mine[p].details.id==this.details.linked.groups[a]) {
							groups.push(scrapbooker.pages.mine[p]);
						}
					}
				}
			}
			return groups;
		};
		this.setGroups=function(groups) {
			var toAdd=[];
			var toRemove=[];
			var dropFromPage=false;
			for(var id in groups) {
				if(this.inGroup(id) && !groups[id]) {
					toRemove.push(id);
					this.dropGroup(id);
					if (id==scrapbooker.pages.mine[scrapbooker.showingPage].details.id) dropFromPage=true;
				}
				if(!this.inGroup(id) && groups[id]) toAdd.push(id);
			}
			//this.details.linked.groups=[];
			for(var i in toAdd) this.details.linked.groups.push(toAdd[i]);
			var params={
				cmd:'manageScrapbook',
				method:'scrapbookPageAttach',
				id:this.details.scrapbookid,
				add:toAdd.join(","),
				remove:toRemove.join(","),
				x:this.details.location.x,
				y:this.details.location.y,
				z:this.details.location.z,
				callback:'scrapbooker.gotResponse'
			};
			if (this.page.details.type=="group") {
				params.group=this.page.details.id;
			}else{
				params.page=this.page.details.id;
			}
			yoodoo.sendPost(null,params);
			scrapbooker.sendingPost();
			if(dropFromPage) {
				$(this.object).animate({top:(1*this.details.location.y)+20,opacity:0},function() {this.sourceObject.deleteItem();$(this).remove();scrapbooker.updateDesktop();});
			}
		};
		this.deleteItem=function() {
			for(var i=scrapbooker.pages.mine[scrapbooker.showingPage].items.length-1;i>=0;i--) {
				if (scrapbooker.pages.mine[scrapbooker.showingPage].items[i]==this) scrapbooker.pages.mine[scrapbooker.showingPage].items.splice(i,1);
			}
		};
		this.inGroup=function(id) {
			for(var a=0;a<this.details.linked.groups.length;a++) {
				if (this.details.linked.groups[a]==id) return true;
			}
			return false;
		};
		this.dropGroup=function(id) {
			for(var a=this.details.linked.groups.length-1;a>=0;a--) {
				if (this.details.linked.groups[a]==id) this.details.linked.groups.splice(a,1);
			}
		};
		this.content=function() {
			var ins='<div class="name">'+this.details.name+'</div>';
			if (this.details.action!=undefined && this.inBookcase) ins+="<button type='button' class='actionButton "+this.details.actionClass+"' onclick='"+this.details.action+"'>go</button>";
			if (this.details.description!=undefined) ins+='<div class="description">'+this.details.description+'</div>';
			ins+=this.comments();
			return ins;
		};
		this.toggleNext=function(o) {
			var n=$(o).next();
			n.get(0).sourceObject=this;
			if(n.css("display")=="none") {
				$(o).addClass("open");
				n.slideDown(500,function(){
					scrapbooker.updateDesktop(this.sourceObject.object,true);
					this.sourceObject.commentSlider();
				});
			}else{
				$(o).removeClass("open");
				n.slideUp(500,function(){scrapbooker.updateDesktop();});
			}
		};
		this.comments=function() {
			var ins='';
			if (this.details.comments==undefined || typeof(this.details.comments)=="string") this.details.comments=[];
			//this.details.comments.sort(function(a,b) {return a.createdat-b.createdat;});
			if (scrapbooker.whos=="mine") {
				ins+="<div class='comments'>";
				var l=this.details.comments.length;
				var commentIns='';
				for(var i=0;i<this.details.comments.length;i++) {
					commentIns+=this.comment(this.details.comments[i]);
				}
				ins+="<div class='commentOpener"+((this.unread==0)?'':' unread')+"' onclick='$(this).removeClass(\"unread\");scrapbooker.parentOfClass(this,\"scrapbookItem\").sourceObject.toggleNext(this)'>"+l+" comment"+((l==1)?'':'s');
				//if (this.unread>0) ins+=" - "+this.unread+" unread";
				ins+="</div>";
				ins+="<div style='display:none' class='commentsWindowContainer'><div class='slidebar'></div><div class='commentsWindow'><div class='commentsContent'>";
					ins+=commentIns;
				ins+="</div></div>";
				if (scrapbooker.settings.add_comments) {
					ins+="<div class='commentButtons'>";
					ins+="<a href='javascript:void(0)' onclick='scrapbooker.newComment(this,false)'>Add</a>";
					if (scrapbooker.settings.private_comments && (this.details.owner!=undefined && this.details.owner!="")) ins+=" - <a href='javascript:void(0)' onclick='scrapbooker.newComment(this,true)'>Add Privately</a>";
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
					this.bar.unbind("mousedown");
					this.bar.bind("mousedown",function(e) {
						e.preventDefault();
						this.dy=e.pageY-$(this).offset().top;
						this.st=$(this).offset().top-$(this.parentNode).offset().top;
						this.maxst=$(this.parentNode).height()-$(this).height();
						scrapbooker.movingBar=this;
						$(yoodoo.container).bind("mousemove",function(e) {
							var y=e.pageY-$(scrapbooker.movingBar.parentNode).offset().top-scrapbooker.movingBar.dy;
							if (y<0) y=0;
							if (y>scrapbooker.movingBar.maxst) y=scrapbooker.movingBar.maxst;
							$(scrapbooker.movingBar).css({top:y});
							var o=scrapbooker.movingBar.sourceObject;
							var p=y/scrapbooker.movingBar.maxst;
							var st=p*(o.commentsContent.height()-o.commentsWindow.height());
							o.commentsWindow.get(0).scrollTop=Math.round(st);
						});
						$(yoodoo.container).bind("mouseup mouseleave",function(e) {
							$(yoodoo.container).unbind("mousemove mouseup mouseleave");
							scrapbooker.movingBar=undefined;
						});
					});
					/*this.bar.draggable({containment:"parent",scroll:false,drag:function(e,u) {
						var o=u.helper[0].sourceObject;
						var p=u.position.top/(o.slidebar.height()-o.bar.height());
						var st=p*(o.commentsContent.height()-o.commentsWindow.height());
						o.commentsWindow.get(0).scrollTop=Math.round(st);
					}});*/
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
				this.commentsWindow.animate({scrollTop:0},{duration:500,step:function() {
					this.sourceObject.commentSlider();
				}});
			}
		};
		this.comment=function(com){
			var asElement=false;
			var o=null;
			var ins='';
			if (arguments.length>1) asElement=arguments[1];
			var when=com.createdat;
			if (typeof(when)=="string") when=yoodoo.utcToLocal(inputs.stringToDate('Y-m-d H:i:s',when));
			var classes=['comment'];
			var read=true;
			if(this.details.accessed && com.owner!=undefined) {
				read=this.details.accessed>when;
				if(!read) {
					classes.push("unread");
					this.unread++;
				}
			}
			ins+="<div class='when'>"+scrapbooker.abridgeDate(when)+"</div>";
			if (com.owner!=undefined) {
				ins+="<span class='from'>"+com.owner.name+"</span>: ";
				classes.push("inbox");
			}else{
				//ins+="<button type='button' class='commentDelete' id='"+com.scrapbookcommentid+"'></button>";
				classes.push("outbox");
			}
			if(com.reported) classes.push("reported");
			//if (com.private=="1") classes.push("private");
			ins+=com.content;
			var click='';
			var title='';
			var snapButton='';
			if (com.datasnapshotid!==null && com.datasnapshotid!="") {
				click="scrapbooker.destroy();yoodoo.showDooit("+this.details.exercise.exerciseid+","+com.datasnapshotid+")";
				classes.push("hasSnapshot");
				title='Load this snapshot into this doo-it';
				snapButton="<a href='javascript:void(0)' onclick='"+click+"' style='float:right'>Load snapshot</a>"
			}
			click='';
			if (com.owner==undefined) {
				ins+="<div class='commentTools' style='display:none'>"+snapButton+" <a href='javascript:void(0)'  class='commentDelete' id='"+com.scrapbookcommentid+"'>delete</a></div>";
			}else if(com.reported!=true) {
				ins+="<div class='commentTools' style='display:none'>"+snapButton+" <a href='javascript:void(0)'  class='commentReport' id='"+com.scrapbookcommentid+"'>report</a></div>";
			}
			if(com.reported) title="This comment has been reported";
			if(asElement) {
				o=document.createElement("div");
				$(o).addClass(classes.join(" "));
				if (click!="") $(o).attr("onclick",click);
				if (title!="") $(o).attr("title",title);
				$(o).html(ins);
			}else{
				o="<div title='"+title+"' class='"+classes.join(" ")+"' "+((click!="")?"onclick='"+click+"'":"")+">"+ins+"</div>";
			}
			return o;
		};
		this.addComment=function(ip) {
			if(ip.value.replace(/ /g,'')!="") {
				var cacheId="item"+this.details.id+"newcomment";
				scrapbooker.newItemCache[cacheId]=this;
				var params={
					cmd:'manageScrapbook',
					method:'addComment',
					id:this.details.scrapbookid,
					content:yoodoo.htmlEntities(ip.value),
					created:yoodoo.utc(),
					callback:'scrapbooker.newItemCache.'+cacheId+'.commentAdded'
				};
				yoodoo.sendPost(null,params);
				var eventObject=this.details;
				if (eventObject.type!="note") eventObject=yoodoo.bookcase.items[yoodoo.bookcaseIndex(eventObject.type,eventObject.target_id)];
				if (eventObject==undefined) eventObject=this.details;
				var reply={content:ip.value};
				reply[eventObject.type]=eventObject;
				yoodoo.events.trigger('commentScrapbook',reply);
				return true;
			}else{
				return false;
			}
		};
		this.commentAdded=function(reply) {
			try{
				eval('reply='+reply.replace(/&amp;/g,'&')+';');
				var cacheId="item"+this.details.id+"newcomment";
				scrapbooker.newItemCache[cacheId]=undefined;
				eval('reply.createdat='+reply.createdat+';');
				reply.createdat=yoodoo.utcToLocal(reply.createdat);
				this.details.comments.push(reply);
				var c=this.comment(reply,true);
				$(c).css("display","none");
				var coms=this.commentsContent.get(0);
				var firstCom=$(coms).find(".comment").get(0);
				if (firstCom!=null) {
					coms.insertBefore(c,firstCom);
				}else{
					coms.appendChild(c);
				}
				c.sourceObject=this;

				$(c).bind("click",function() {
					$(this).find(".commentTools").slideDown(function() {
						var com=scrapbooker.parentOfClass(this,'scrapbookItem');
						if($(com).hasClass("scrapbookItem")) com.sourceObject.commentSlider();
					});
				});
				$(c).find('a.commentDelete').bind("click",function() {
					var item=scrapbooker.parentOfClass(this,"scrapbookItem");
					item.sourceObject.deleteComment(this);
				});
				$(c).slideDown(1000,function() {scrapbooker.updateDesktop(this.sourceObject.object,true);this.sourceObject.commentSlider(true);});
				$(this.object).find('.commentOpener').html(this.details.comments.length+" comment"+((this.details.comments.length==1)?"":"s"));
			}catch(e){}
		};
		this.commenter=function() {
			$(this.object).find('.commentButtons').slideUp();
			var o=document.createElement("div");
			o.destroying=false;
			o.destroyIt=function() {
				if (!this.destroying) {
					this.destroying=true;
					$(this.parentNode).find('.commentButtons').slideDown();
					$(this).slideUp(500,function() {
						$(this).remove();
						scrapbooker.updateDesktop();
					});
				}
			};
			$(o).html("<textarea class='commenter '></textarea><div><a href='javascript:void(0)'>add</a>&nbsp;&nbsp;<a href='javascript:void(0)'>cancel</a></div>");
			$($(o).find("a").get(0)).bind("click",function() {
				var item=scrapbooker.parentOfClass(this,"scrapbookItem");
				var txt=$(this.parentNode.parentNode).find("textarea").get(0);
				if (item.sourceObject.addComment(txt)) {
					$(this).unbind("click");
					this.parentNode.parentNode.destroyIt();
				}
			});
			$($(o).find("a").get(1)).bind("click",function() {
				$(this).unbind("click");
				this.parentNode.parentNode.destroyIt();
			});
			$(o).find("textarea").bind("keydown",function(e){
				var kc=yoodoo.keyCode(e);
				if (kc.enter) {
					e.preventDefault();
					var item=scrapbooker.parentOfClass(this,"scrapbookItem");
					if (item.sourceObject.addComment(this)) {
						$(this).unbind("keydown");
						this.parentNode.destroyIt();
					}
				}
				if(kc.escape) {
					this.parentNode.destroyIt();
				}
			}).bind('blur',function() {
				//this.parentNode.destroyIt();
			});
			var fb=$(this.object).find(".comments .commentButtons").get(0);
			$(o).css("display","none");
			fb.parentNode.insertBefore(o,fb);
			o.sourceObject=this;
			$(o).slideDown(500,function(){$(this).find("textarea").get(0).focus();scrapbooker.updateDesktop(this.sourceObject.object,true);});
		};
		this.toTop=function() {
			scrapbooker.toTop(this);
		};
		this.bounce=function() {
			this.toTop();
			this.details.location.y=parseInt(this.details.location.y,10);
			if (this.details.location!=undefined && this.details.location.y!=undefined) {
				var o=this.element();
				scrapbooker.updateDesktop(o);
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
			var params={
				cmd:'manageScrapbook',
				method:'addGroupItem',
				page:scrapbooker.showingPage,
				type:this.details.type,
				group:scrapbooker.pages.mine[scrapbooker.showingPage].details.id,
				callback:'scrapbooker.gotScrapbookPage'
			};
			if (this.details.id) params.id=this.details.id;
			if (this.details.note!=undefined) params.noteid=this.details.note.noteid;
			if (this.details.exercise) params.exerciseid=this.details.exercise.exerciseid;
			yoodoo.sendPost(null,params);
		};
		this.bin=function() {
			this.object=null;
			var b=document.createElement('a');
			$(b).addClass("recycleItem");
			b.sourceObject=this;
			if (this.details.note!=undefined) this.details.name=this.details.note.html.replace(/\<[^>]+\>/g,'').replace(/\</g,'&lt;').replace(/\>/g,'&gt;');
			$(b).html(this.details.name);
			$(b).attr("title","Click to restore this "+this.params.type);
			b.href='javascript:void(0)';
			$(b).bind("click",function() {
				var i=$(this).prevAll(".recycleItem").get().length;
				scrapbooker.recycle.splice(i,1);
				//this.sourceObject.page.items.push(this.sourceObject);
				scrapbooker.pages.mine[scrapbooker.showingPage].items.push(this.sourceObject);
				//if (this.sourceObject.page==scrapbooker.pages[scrapbooker.whos][scrapbooker.showingPage]) {
					scrapbooker.createItems(this.sourceObject);
					scrapbooker.updateDesktop(this.sourceObject.object);
				//}
				$(this).slideUp(500,function(){$(this).remove();});
				scrapbooker.updateBin();
				this.sourceObject.bounce();
				scrapbooker.undeleteItem(this.sourceObject);
				scrapbooker.managePageTabs();
			});
			return b;
		};
		this.duplicate=function() {
			var o=new scrapbooker.objects[this.params.type](null);
			for(var k in this.params) o.params[k]=this.params[k];
			for(var k in this.details) o.details[k]=this.details[k];
			return o;
		};
		this.sendPosition=function() {
			var params={
				cmd:'manageScrapbook',
				method:'updateScrapbookItem',
				id:this.details.scrapbookid,
				x:this.details.location.x,
				y:this.details.location.y,
				z:this.details.location.z,
				callback:'scrapbooker.gotResponse'
			};
			if (this.page.details.type=="group") {
				params.group=this.page.details.id;
			}else{
				params.page=this.page.details.id;
			}
			yoodoo.sendPost(null,params);
			scrapbooker.sendingPost();
		};
		this.sendContent=function() {
			var params={
				cmd:'manageScrapbook',
				method:'updateScrapbookItem',
				html:this.details.note.html,
				script:this.details.note.script,
				id:this.details.scrapbookid,
				callback:'scrapbooker.gotResponse'
			};
			yoodoo.sendPost(null,params);
			scrapbooker.sendingPost();
		};
		this.reportComment=function(com) {
			if ($(com).html()=="report") {
				var params={
					cmd:'manageScrapbook',
					method:'reportComment',
					id:com.id,
					callback:'scrapbooker.gotResponse'
				};
				yoodoo.sendPost(null,params);
				scrapbooker.sendingPost();
				var item=scrapbooker.parentOfClass(com,"comment");
				$(item).addClass("reported");
				$(com).html("reported");
			}
		};
		this.deleteComment=function(com) {
			var params={
				cmd:'manageScrapbook',
				method:'deleteComment',
				id:com.id,
				callback:'scrapbooker.gotResponse'
			};
			yoodoo.sendPost(null,params);
			scrapbooker.sendingPost();
			var item=scrapbooker.parentOfClass(com,"comment");
			var i=$(item).prevAll('.comment').get().length;
			this.details.comments.splice(i,1);
			$(item).slideUp(function(){
				var item=scrapbooker.parentOfClass(this,"scrapbookItem")
				$(this).remove();
				if($(item).hasClass("scrapbookItem")) item.sourceObject.commentSlider();
			});

			$(this.object).find('.commentOpener').html(this.details.comments.length+" comment"+((this.details.comments.length==1)?"":"s"));
		};
		this.attachToPage=function(pageid,pagenumber) {
			var method='scrapbookPageAttach';
			scrapbooker.showingPage=pagenumber;
			$(scrapbooker.scrapbookPages).find("a").removeClass("on");
			$(scrapbooker.scrapbookPages).find("a#"+pagenumber).addClass("on");
			var params={
				cmd:'manageScrapbook',
				method:method,
				id:this.details.scrapbookid,
				pageIndex:pagenumber,
				x:this.details.location.x,
				y:this.details.location.y,
				z:this.details.location.z,
				callback:'scrapbooker.gotScrapbookPage'
			};
			if (scrapbooker.pages.mine[pagenumber].details.type=="group") {
				params.group=scrapbooker.pages.mine[pagenumber].details.id;
			}else{
				params.page=scrapbooker.pages.mine[pagenumber].details.id;
			}
			if (this.page.details.type=="group") {
				params.fromGroup=this.page.details.id;
			}else{
				params.fromPage=this.page.details.id;
			}
			yoodoo.sendPost(null,params);
		};
		this.moveToPage=function(pageid,pagenumber) {
			var method='scrapbookMove';
			if (arguments.length>2) method=arguments[2];
			scrapbooker.showingPage=pagenumber;
			$(scrapbooker.scrapbookPages).find("a").removeClass("on");
			$(scrapbooker.scrapbookPages).find("a#"+pagenumber).addClass("on");
			var params={
				cmd:'manageScrapbook',
				method:method,
				id:this.details.scrapbookid,
				pageIndex:pagenumber,
				callback:'scrapbooker.gotScrapbookPage'
			};
			if (scrapbooker.pages.mine[pagenumber].details.type=="group") {
				params.group=scrapbooker.pages.mine[pagenumber].details.id;
			}else{
				params.page=scrapbooker.pages.mine[pagenumber].details.id;
			}
			if (this.page.details.type=="group") {
				params.fromGroup=this.page.details.id;
			}else{
				params.fromPage=this.page.details.id;
			}
			yoodoo.sendPost(null,params);
		};
	},
	sendingPost:function() {
		var footer=$(yoodoo.container).find(".overlayFooter").get(0);
		var waiting=document.createElement("div");
		$(waiting).addClass("scrapbookSaving");
		$(waiting).html("updating");
		footer.appendChild(waiting);
	},
	gotResponse:function() {
		$($(yoodoo.container).find(".overlayFooter .scrapbookSaving").get(0)).remove();
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
			this.items[ii].details.location.z=ii+1;
			var z=parseInt(this.zIndex,10)+parseInt(this.items[ii].details.location.z,10);
			$(this.items[ii].object).css("z-index",z);
		}
	},
	scrollTo:function(element) {
		var toBottom=false;
		if (arguments.length>1) toBottom=arguments[1];
		if (element.toBottom!=undefined) toBottom=element.toBottom;
//console.log(element,toBottom);
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
			step:function(){if (scrapbooker!=undefined) scrapbooker.arrows();}
		});
	},
	updateDesktop:function() {
		this.autoScroll=null;
		if (arguments.length>0) this.autoScroll=arguments[0];
		if (this.autoScroll==null || !$(this.autoScroll).hasClass("centeron")) {
			var unread=$(this.desktopWindow.element).find(".commentOpener.unread").get();
			if (unread.length>0) {
				this.autoScroll=this.parentOfClass(unread[0],'scrapbookItem');
				if (!$(this.autoScroll).hasClass("scrapbookItem")) this.autoScroll=null;
			}
		}
		var toBottom=false;
		if (arguments.length>1) toBottom=arguments[1];
		if (this.autoScroll==null) {
			toBottom=false;
		}else{
			this.autoScroll.toBottom=toBottom;
		}
		var maxx=this.desktopWindow.width;
		var maxy=this.desktopWindow.height;
		var minx=0;
		var miny=0;
		for(var i=0;i<this.items.length;i++) {
			var l=$(this.items[i].object).position().left;
			var t=$(this.items[i].object).position().top;
			var r=l+$(this.items[i].object).outerWidth(true);
			var b=t+$(this.items[i].object).outerHeight(true);
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
			$(this.desktop).animate({width:maxx+"px",height:maxy+"px"},{duration:500,easing:'swing',step:function(){scrapbooker.arrows();},complete:function(){if (scrapbooker.autoScroll!==null) scrapbooker.scrollTo(scrapbooker.autoScroll);}})
		}else{
			$(this.desktop).css("width",maxx+"px");
			$(this.desktop).css("height",maxy+"px");
			if (minx<0 || miny<0) {
				this.desktopWindow.element.scrollLeft-=minx;
				this.desktopWindow.element.scrollTop-=miny;
			}
			if (this.autoScroll!==null) this.scrollTo(this.autoScroll);
		}
	},
	eventContainer:function(params) {
		var d=document.createElement("div");
		if (params.source!=undefined) d.sourceObject=params.source;

		var z=parseInt(this.zIndex,10);
		if (params.source.details.location!=undefined && params.source.details.location.z!=undefined) z+=parseInt(params.source.details.location.z,10);
		$(d).css("z-index",z);
		var x=0;
		if (params.source.details.location!=undefined && params.source.details.location.x!=undefined) x+=parseInt(params.source.details.location.x,10);
		$(d).css("left",x+'px');
		var y=0;
		if (params.source.details.location!=undefined && params.source.details.location.y!=undefined) y+=parseInt(params.source.details.location.y,10);
		$(d).css("top",y+'px');

		$(d).addClass("scrapbookItem");
		if (params.classes!=undefined) {
			for(var p=0;p<params.classes.length;p++) $(d).addClass(params.classes[p]);
		}
		if (params.className!=undefined) $(d).addClass(params.className);
		if (params.width!=undefined) $(d).css("width",params.width);
		if (params.height!=undefined) $(d).css("height",params.height);
		var content='empty';
		if (params.content!=undefined) content=params.content;
		ins='<div class="scrapbookItemContent">';
		if (params.source.details.heading!=undefined) ins+="<div class='heading'>"+params.source.details.heading+"</div>";
		if (params.source.details.when!=undefined && params.source.details.when!="") {
			var dt=params.source.details.when;
			var today=new Date();
			var weekago=new Date(today.getFullYear(),today.getMonth(),today.getDate()-7);
			var thisWeek=(weekago.getTime()<dt.getTime());
			var thisYear=(today.getFullYear()==dt.getFullYear());
			ins+="<div class='when'>"+((params.source.details.verbose!="")?params.source.details.verbose+" - ":'')+inputs.formatDate((thisWeek?'H:i jS M':(thisYear?'jS M':'jS M Y')),dt)+"</div>";
		}
		ins+=content+'</div>';
		$(d).html(ins);
		return d;

	},
	itemContainer:function(params) {
		var d=document.createElement("div");
		if (params.source!=undefined) d.sourceObject=params.source;
		
		var z=parseInt(this.zIndex,10);
		if (params.source.details.location!=undefined && params.source.details.location.z!=undefined) z+=parseInt(params.source.details.location.z,10);
		$(d).css("z-index",z);
		var x=0;
		if (params.source.details.location!=undefined && params.source.details.location.x!=undefined) x+=parseInt(params.source.details.location.x,10);
		$(d).css("left",x+'px');
		var y=0;
		if (params.source.details.location!=undefined && params.source.details.location.y!=undefined) y+=parseInt(params.source.details.location.y,10);
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
		var groups=params.source.groups();
		if (scrapbooker.whos=="mine" && !scrapbooker.showingUsers) ins+='<button type="button" class="public'+((groups.length>0)?' on':'')+'" title="'+((groups.length>0)?this.publicText.on:this.publicText.off)+'"></button>';



		if ((params.remove==undefined || params.remove)) {
			if (scrapbooker.whos=="mine") {
				ins+='<div class="tools">';
				if (params.source.editable) ins+='<button type="button" class="edit" title="edit"></button>';
				ins+='<button type="button" class="remove" title="delete"></button>';
				ins+="</div>";
			}else if(params.source.inBookcase) {
				ins+='<div class="tools">';
				ins+='You have this';
				ins+="</div>";
			}
		}else if(params.grabable) {
			ins+='<div class="tools">';
			ins+='<button type="button" class="grab" title="Get this item too">Get this</button>';
			ins+="</div>";
		}else if(true) {
			//ins+='<div class="tools">';
			//ins+='You have this';
			//ins+="</div>";
		}
		if (params.source.details.created_at!=undefined && params.source.details.created_at!="") {
			var dt=params.source.details.created_at;
			if (typeof(dt)=="string") dt=yoodoo.utcToLocal(inputs.stringToDate('Y-m-d H:i:s',dt));
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
					if (/^\d{2,4}-\d{1,2}-\d{1,2} \d{1,2}:\d{1,2}:\d{1,2}$/.test(params[node.childNodes[i].nodeName])) params[node.childNodes[i].nodeName]=yoodoo.utcToLocal(this.parseDate(params[node.childNodes[i].nodeName]));
					if (params[node.childNodes[i].nodeName]=="true") params[node.childNodes[i].nodeName]=true;
					if (params[node.childNodes[i].nodeName]=="false") params[node.childNodes[i].nodeName]=false;
					if (params[node.childNodes[i].nodeName]==undefined) params[node.childNodes[i].nodeName]='';
				}else if (node.childNodes[i].childNodes.length>0) {
					for(var n=0;n<node.childNodes[i].childNodes.length;n++) {
						params[node.childNodes[i].nodeName]=this.nodeContent(node.childNodes[i]);
					}
				}else{
					params[node.childNodes[i].nodeName]=node.childNodes[i].textContent?node.childNodes[i].textContent:node.childNodes[i].text;
					
					if (/^\d{2,4}-\d{1,2}-\d{1,2} \d{1,2}:\d{1,2}:\d{1,2}$/.test(params[node.childNodes[i].nodeName])) params[node.childNodes[i].nodeName]=yoodoo.utcToLocal(this.parseDate(params[node.childNodes[i].nodeName]));
					if (params[node.childNodes[i].nodeName]=="true") params[node.childNodes[i].nodeName]=true;
					if (params[node.childNodes[i].nodeName]=="false") params[node.childNodes[i].nodeName]=false;
					if (params[node.childNodes[i].nodeName]==undefined) params[node.childNodes[i].nodeName]='';
				}
			}
		}
		return params;
	},
	parseDate:function(str) {
		return inputs.stringToDate('Y-m-d H:i:s',str);
	},
	autoPosition:{
		score:function(items) {
			if(items.length<3) {
				scrapbooker.autoLayout.sideCount=3;
			}else{
				scrapbooker.autoLayout.sideCount=Math.ceil(Math.sqrt(items.length-3));
			}
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
				items[1].details.location={x:-scrapbooker.autoLayout.spread.x,y:scrapbooker.autoLayout.spread.y/3,z:z--};
				if (items[1].details.classes==undefined) {
					items[1].details.classes=['silver'];
				}else{
					items[1].details.classes.push('silver');
				}
				items[1].details.classes.push('podium');
			}
			if (items.length>=3) {
				items[2].details.podium=true;
				items[2].details.location={x:scrapbooker.autoLayout.spread.x,y:scrapbooker.autoLayout.spread.y/2,z:z--};
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
					if (cells[l].length>=scrapbooker.autoLayout.sideCount) {
						cells.push([]);
						l++;
					}
					cells[l].push(items[i]);
				}
				i=4;
				for(var x=0;x<cells.length;x++) {
					var dir=1;
					for(var y=0;y<cells[x].length;y++) {
						var cX=Math.floor((y+1)/2)*scrapbooker.autoLayout.spread.x*dir;
						var cY=(scrapbooker.autoLayout.spread.y/scrapbooker.autoLayout.sideCount)*Math.floor((y+1)/2);
						cY+=(x+2)*scrapbooker.autoLayout.spread.y;
						cells[x][y].details.location={x:cX,y:cY,z:z--};
						dir=-dir;
					}
				}
			}
		},
		when:function(items) {
			var heading='';
			var t=12;
			for(var i=0;i<items.length;i++) {
				var d=scrapbooker.relativeDate(items[i].details.when);
				if (d.heading!=heading) {
					items[i].details.heading=d.heading;
					t+=30;
				}else{
					items[i].details.heading=undefined;
				}
				items[i].details.verbose=d.verbose;
				
				items[i].details.location={x:10,y:t,z:i};
				heading=d.heading;
				t+=60;
			}
		}
	},
	relativeDate:function(dt) {
		var today=new Date();
		var minute=60000;
		var hour=minute*60;
		var day=hour*24;
		var week=day*7;
		var tomorrow=new Date(today.getFullYear(),today.getMonth(),today.getDate()+1);
		var yesterday=new Date(today.getFullYear(),today.getMonth(),today.getDate()+1);
		var absTodayMonth=(today.getFullYear()*12)+(today.getMonth()+1);
		var absDtMonth=(dt.getFullYear()*12)+(dt.getMonth()+1);
		var monthDiff=absDtMonth-absTodayMonth;
		var weekDiff=Math.floor((dt.getTime()-today.getTime())/week);
		var past=dt.getTime()<today.getTime();
		var message={heading:'',verbose:''};
		message.verbose=this.verboseTmeDifference(dt,today);
		if (today.getFullYear()==dt.getFullYear() && today.getMonth()==dt.getMonth() && today.getDate()==dt.getDate()) {
			message.heading="today";		
		}else if (yesterday.getFullYear()==dt.getFullYear() && yesterday.getMonth()==dt.getMonth() && yesterday.getDate()==dt.getDate()) {
			message.heading="yesterday";			
		}else if (tomorrow.getFullYear()==dt.getFullYear() && tomorrow.getMonth()==dt.getMonth() && tomorrow.getDate()==dt.getDate()) {
			message.heading="tomorrow";
		}else if (weekDiff==1) {
			message.heading="next week";
		}else if (weekDiff==0) {
			message.heading="this week";
		}else if (weekDiff==-1) {
			message.heading="last week";
		}else if (monthDiff==1) {
			message.heading="next month";
		}else if (monthDiff==-1) {
			message.heading="last month";
		}else if (monthDiff==0) {
			message.heading="this month";
		}else if (monthDiff>1) {
			message.heading="in "+monthDiff+" months";
		}else if (monthDiff<-1) {
			message.heading=(0-monthDiff)+" months ago";
		}else{
			message.heading=message.verbose;
			message.verbose='';
		}
		return message;
	},
	verboseTmeDifference:function(dt,today) {
		var past=dt<today;
		var minute=60000;
		var hour=minute*60;
		var day=hour*24;
		var week=day*7;
		var d=Math.sqrt(Math.pow(today.getTime()-dt.getTime(),2));
		var op='';
		if (d<minute) {
			if (past) {
				op='less than a minute ago';
			}else{
				op='in less than a minute';
			}
		}else if(d<hour) {
			var mins=Math.floor(d/minute);
			if (past) {
				op=mins+' minute'+((mins==1)?'':'s')+' ago';
			}else{
				op='in '+mins+' minute'+((mins==1)?'':'s');
			}
		}else if(d<day) {
			var hrs=Math.floor(d/hour);
			if (past) {
				op=hrs+' hour'+((hrs==1)?'':'s')+' ago';
			}else{
				op='in '+hrs+' hour'+((hrs==1)?'':'s');
			}
		}else if(d<week) {
			var dys=Math.floor(d/day);
			if (past) {
				op=dys+' day'+((dys==1)?'':'s')+' ago';
			}else{
				op='in '+dys+' day'+((dys==1)?'':'s');
			}
		}else{
			var wks=Math.floor(d/week);
			if (past) {
				op=wks+' week'+((wks==1)?'':'s')+' ago';
			}else{
				op='in '+wks+' week'+((wks==1)?'':'s');
			}
		}
		return op;
	},
	abridgeDate:function(d) {
		var today=new Date();
		if (today.getFullYear()!=d.getFullYear()) return inputs.formatDate('jS M \'y',d);
		if (today.getMonth()!=d.getMonth()) return inputs.formatDate('jS M',d);
		if (today.getDate()!=d.getDate()) return inputs.formatDate('g:ia jS',d);
		return inputs.formatDate('g:ia',d);
	},
	uploader:function() {
		var res=scrapbooker.iframeResponse;
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
		var ins='<iframe src="'+yoodoo.option.baseUrl+'imagery/uploader/?repository=scrapbook&quantity=0&sitehash='+sitehash+'&userhash='+userhash+'&width='+w+'&height='+h+'&filter=scrapbook&callback=scrapbooker.imageSelected&origin='+window.location.hostname+'" style="width:'+w+'px;height:'+h+'px" scrolling="no" ></iframe>';
		dialog.show({id:'scrapbookuploader',title:'Upload',content:ins,withBlackoutClickClose:false});
	},
	uploaderClosed:function() {
		if (window.detachEvent) {
			window.detachEvent('onmessage',scrapbooker.iframeResponse);
		}else{
			window.removeEventListener('message',scrapbooker.iframeResponse,false);
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
		scrapbooker.htmlInstance.restoreRng();
		scrapbooker.nicEditor.nicCommand("insertImage",yoodoo.option.baseUrl+img.source.replace(/^\//,''));
		var imgs=$(scrapbooker.htmlInstance.elm).find("IMG").get();
		for(var i=0;i<imgs.length;i++) {
			if(imgs[i].src==img.source) imgs[i].title=img.title;
		}
		dialog.hide();
	},
	fetchScrapbookPage:function() {
		var forcePage=this.showingPage;
		if (arguments.length>0) forcePage=arguments[0];
		var callback='scrapbooker.gotScrapbookPage';
		if (arguments.length>1) callback=arguments[1];
		var params={};
		/*if(this.recycle.length>0) {
			params.removeItems=[];
			for(var r=0;r<this.recycle.length;r++) params.removeItems.push(this.recycle[r].details.scrapbookid);
			params.removeItems=params.removeItems.join(",");
			var p=this.pages.mine[this.recyclePage];
			if (p.details.type=="group") params.removeFromGroup=p.details.id;
			if (p.details.type=="scrapbook") params.removeFromPage=p.details.id;
		}*/
		yoodoo.fetchScrapbookPage(forcePage,callback,params);
	},
	gotScrapbookPage:function(xml) {
		this.recyclePage=this.showingPage;
		this.recycle=[];
		this.updateBin();
		 xml=yoodoo.decodeHTMLResponse(xml);
		this.setXML(xml);
		this.clearAndRedraw();
		this.gotResponse();
	}
};
