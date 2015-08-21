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
		};
		params.saveValues=['pitch.output'];
		params.finished='pitch.finishable';
		dooit.init(params);
	}

*/



dooit.temporaries('dragAndReorder');
var dragAndReorder={
	validateOrder:false,
	selectors:{
		container:'.dragAndReorder'
	},
	containers:{
		container:null
	},
	items:[
		{title:'Title',description:'Description',tag:'title1',topTag:'top1'},
		{title:'Title2',description:'Description2',tag:null,topTag:null}
	],
	targets:{
		no:{title:'',className:'noBin'},
		yes:{title:'',className:'yesBin'}
	},
	titles:{
		stage1:'This is titles.stage1 prompt.</p><p>Drag and drop each item into the Yes or No box.',
		stage2:'This is titles.stage2 prompt.</p><p>Drag the items into an order of priority.',
		stage2empty:'This is titles.stage2 prompt.</p><p>Drag the items into an order of priority.',
		stage2ony1:'This is titles.stage2 prompt.</p><p>Drag the items into an order of priority.'
	},
	reorderTarget:'yes',
	value:null,
	key:null,
	fields:{},
	init:function() {
		if (arguments.length>0) this.transposeOptions([],arguments[0]);
		this.loadFields();
		this.containers.container=$(this.selectors.container);
		this.containers.container.css({display:'none'});
		this.items=dooit.decode(this.items);
		this.targets=dooit.decode(this.targets);
		this.titles=dooit.decode(this.titles);
		if (this.key!==null && this.containers.container!==null) {
			// start rendering the dooit

		}
	},
	displayed:function() {
		$(this.selectors.container).css({height:$('#yoodooScrolledArea').css({overflow:'hidden'}).height()-8});
		if (this.value.length>0) {
			this.stage2();
		}else{
			this.stage1();
		}
	},
	draggingIndex:0,
	stage1:function() {
		this.containers.container.html('<div class="progressor"></div><h2>'+dooittitle+'</h2><p>'+this.titles.stage1+'</p><div class="arena"></div><div class="targets"></div>');
		this.containers.arena=this.containers.container.find('.arena');
		this.containers.progress=this.containers.container.find('.progressor');
		this.containers.targets=this.containers.container.find('.targets');
		this.containers.progress.html('<div class="bar"></div>');
		this.containers.container.fadeIn();
		this.drawTargets();
		this.drawItem();
	},
	drawTargets:function() {
		var margin=5;
		var count=0;
		for(var k in this.targets) count++;
		
		var w=Math.floor((($('#yoodooScrolledArea').width()-8)/count)-(2*margin));
		for(var k in this.targets) {
		//for(var i=0;i<this.targets.length;i++) {
			var t=document.createElement("div");
			$(t).addClass("target");
			$(t).css({margin:margin});
			$(t).addClass(this.targets[k].className);
			$(t).html(this.targets[k].title);
			$(t).css({width:w});
			t.key=k;
			this.containers.targets.get(0).appendChild(t);
		}
		this.containers.targets.find('.target').droppable({
			hoverClass: "ui-hover",
			drop:function(event,ui) {
				dragAndReorder.dropOn(ui.helper[0],this.key);
			}
		});
	},
	dropOn:function(e,k) {
		if (this.reorderTarget==k) {
			this.value.push(this.items[this.draggingIndex]);
		}
		this.draggingIndex++;
		$(e).fadeOut(function() {
			$(this).remove();
			dragAndReorder.drawItem();
		});
	},
	drawItem:function() {
		if (this.draggingIndex>=this.items.length) {
			this.containers.progress.find('.bar').animate({width:200});
			this.moveToStage2();
		}else{
			var t=document.createElement("div");
			$(t).addClass("targetItem").css({display:'none'});
			$(t).html("<div class='itemTitle'>"+this.items[this.draggingIndex].title+"</div><div class='itemDescription'>"+this.items[this.draggingIndex].description+"</div>");
			this.containers.arena.html('');
			this.containers.arena.get(0).appendChild(t);
			$(t).draggable({revert:"invalid"});
			$(t).fadeIn();
			var w=this.containers.progress.width()*this.draggingIndex/this.items.length;
			this.containers.progress.find('.bar').animate({width:w});
		}
	},
	moveToStage2:function() {
		this.containers.container.fadeOut(function() {
			dragAndReorder.stage2();
		});
		/*this.containers.arena.fadeOut(function() {$(this).remove();});
		this.containers.container.find('p').slideUp();
		this.containers.targets.fadeOut(function() {
			$(this).remove();
			dragAndReorder.stage2();
		});*/
	},
	stage2:function() {
		var h2=yoodoo.e('h2');
		$(h2).html(yoodoo.dooittitle);
		var restart=yoodoo.e("button");
		$(restart).attr("type","button").html("Restart").bind("click",function() {dragAndReorder.restart();});
		var para=yoodoo.e("p");
		$(para).html(((this.value.length>1)?this.titles.stage2:((this.value.length==0)?this.titles.stage2empty:this.titles.stage2only1)));
		this.containers.list=yoodoo.e("div");
		$(this.containers.list).addClass("itemList");
		this.containers.container.empty().append(h2).append(restart);
		if (this.validateOrder) {
			var finish=yoodoo.e("button");
			$(finish).attr("type","button").html("Validate").bind("click",function() {
				$(this).siblings("button").css({display:'inline-block'});
				$(this).remove();
				dragAndReorder.validate();
			});
			this.containers.container.append(finish);
			$(restart).css({display:"none"});
		}
		this.containers.container.append(para).append(this.containers.list);
		//this.containers.container.html('<h2>'+dooittitle+'</h2><button onclick="dragAndReorder.restart()">Restart</button><p>'+((this.value.length>1)?this.titles.stage2:((this.value.length==0)?this.titles.stage2empty:this.titles.stage2only1))+'</p><div class="itemList"></div>');
		//this.containers.list=this.containers.container.find('.itemList');
		this.containers.container.fadeIn();
		this.drawItems();
	},
	validate:function() {
		$(this.containers.list).sortable('destroy');
		$(this.containers.list).find('.orderItem').css({position:'relative'});
		$(this.containers.container).find('.itemList').animate({'margin-left':0},1000,function() {
			$(dragAndReorder.containers.list).find('.orderItem').each(function(i,e) {
				var index='other';
				if (i==0) index='top';
				if (i==dragAndReorder.value.length-1) index='bottom';
				if (dragAndReorder.value[i].responses[index]!==null) {
					var txt=dragAndReorder.value[i].responses[index];
					var col=dragAndReorder.value[i].colours[index];
					var bubble=yoodoo.e("div");
					$(bubble).addClass("itemBubble").html(txt);
					if (col!==null) $(e).css({color:col});
					if (col!==null) $(bubble).css({color:col,opacity:0,right:0});
					$(e).append(bubble);
					$(bubble).animate({right:-300,opacity:1});
				}
			});
		});
	},
	restart:function() {
		this.value=[];
		this.draggingIndex=0;
		this.stage1();
	},
	drawItems:function() {
		for(var i=0;i<this.value.length;i++) {
			var d=document.createElement("div");
			$(d).html(this.value[i].title);
			$(d).addClass("orderItem");
			d.title=this.value[i].description;
			d.item=this.value[i];
			$(this.containers.list).get(0).appendChild(d);
		}
		if(this.value.length>1) {
			$(this.containers.list).sortable({
				items:'.orderItem',
				update:function(event,ui) {
					dragAndReorder.value=[];
					$(dragAndReorder.containers.list).find('.orderItem').each(function(i,e) {
						dragAndReorder.value.push(e.item);
					});
				}
			});
		}
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
		this.value=dooit.decode(this.value);
		this.fields=dooit.decode(this.fields);
		if (this.value=='') this.value=[];
	},
	transposeOptions:function(keys,obj) {
		for(var k in obj) {
			if(typeof(obj[k])=="object" && obj[k]!==null) {
				var thiskeys=keys.slice();
				thiskeys.push(k);
				this.setOption(keys,k,obj[k]);
				this.transposeOptions(thiskeys,obj[k]);
			}else{
				this.setOption(keys,k,obj[k]);
			}
		}
	},
	setOption:function(keys,key,val) {
		try{
			var e='';
			for(var i=0;i<keys.length;i++) {
				if(isNaN(keys[i])) {
					e+=((e=='')?'':'.')+keys[i];
				}else{
					this.checkIndexExists(e,keys[i]);
					e+='['+keys[i]+']';
				}
			}
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
	checkIndexExists:function(v,i) {
		eval('tmp=this.'+v+';');
		while(tmp.length<=i) tmp.push({});
	},
	finishable:function() {
		return this.value.length>0;
	},
	setTags:function() {
		for(var i=0;i<this.items.length;i++) {
			if (this.items[i].tag!=null) dooit.removeTag(this.items[i].tag);
			if (this.items[i].topTag!=null) dooit.removeTag(this.items[i].topTag);
		}
		for(var i=0;i<this.value.length;i++) {
			if (this.value[i].tag!=null) dooit.addTag(this.value[i].tag);
			if (this.value[i].topTag!=null && i==0) dooit.addTag(this.value[i].topTag);
		}
	},
	output:function() {
		this.setTags();
		var op=(dooit.json(this.value));
		array_of_fields[this.key][1]=op;
		var reply={};
		eval('reply.EF'+array_of_fields[this.key][0]+'=op;');
		return reply;
	}
}
