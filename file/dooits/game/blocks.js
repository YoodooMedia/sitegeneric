
dooit.temporaries('blocks');
var blocks={
	key:'',
	level:1,
	typeName:'letter',
	title:"Block game",
	value:null,
	container:null,
	container_selector:'.game',
	selected:[],
	createdStyle:null,
	messages:{
		welcome:'',
		completed:''
	},
	score:0,
	blocks:{
		minSize:10,
		columns:10,
		rows:10,
		size:10,
		minColumns:8,
		minRows:8,
		margin:2
	},
	boundary:{
		width:0,
		height:0,
		object:null
	},
	board:{
		width:0,
		height:0,
		object:null
	},
	scoreContainer:{
		object:null,
		minWidth:100,
		maxWidth:200,
		width:0,	
		height:0	
	},
	find:[
		4,5,6,7
	],
	time:[
		20,30,40,50,60
	],
	timer:null,
	timed:0,
	running:false,
	init:function(level) {
		this.level=level;
		this.key='';

		// change typeName according to type of game
		this.type=this.types[this.typeName];
		
		if (arguments.length>1) this.container_selector=arguments[1];
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
				eval('blocks.value='+array_of_fields[this.key][1]+';');
			}catch(ex) {
				this.value=array_of_fields[this.key][1];
			}
		}
		if(this.value=='' || this.value.levels==undefined) {
			if (typeof(this.value)!="object") this.value={};
			this.value.levels=[];
		}
		while(this.value.levels.length<this.level) {
			this.value.levels.push({});
		}
		this.build();
	},
	cancel:function() {
		clearInterval(this.timer);
		this.running=false;
	},
	build:function() {
		var dw=$('.dooitBox').width()-$('.dooitBox').outerWidth();
		var dh=$('.dooitBox').height()-$('.dooitBox').outerHeight();
		this.boundary.width=$('#yoodooScrolledArea').width()+dw;
		this.boundary.height=$('#yoodooScrolledArea').height()+dh;
		var ins='';
		ins+="<h2>"+this.title+"</h2>";
		ins+="<div class='blocks_boundary'>";
		ins+="<div class='blocks_board'></div>";
		ins+="<div class='blocks_score'></div>";
		ins+="</div>";
		$(this.container).html(ins);
		this.boundary.object=$(this.container).find('.blocks_boundary');
		this.boundary.object.css('overflow','hidden');
		this.boundary.height-=$(this.container).find('h2').outerHeight(true);
		this.board.height=this.boundary.height;
		this.scoreContainer.height=this.boundary.height;
		this.board.width=this.boundary.height;
		this.board.object=$(this.container).find('.blocks_board');
		this.scoreContainer.object=$(this.container).find('.blocks_score');
		$(this.container).find('.blocks_boundary').css('height',this.boundary.height+'px');
		this.board.object.css('height',this.board.height+'px');
		this.scoreContainer.object.css('height',this.board.height+'px');
		$(this.container).find('.blocks_boundary').css('width',this.boundary.width+'px');
		if (this.boundary.width-this.board.width>this.scoreContainer.maxWidth) {
			this.scoreContainer.width=this.scoreContainer.maxWidth;
		}else if (this.boundary.width-this.board.width<this.scoreContainer.minWidth) {
			this.scoreContainer.width=this.scoreContainer.minWidth;
		}else{
			this.scoreContainer.width=this.boundary.width-this.board.width;
		}
		this.board.width=this.boundary.width-this.scoreContainer.width;
		var bw=this.board.width/this.blocks.columns;
		var bh=this.board.height/this.blocks.rows;
		if (bw<bh) {
			this.blocks.size=Math.floor(bw);
		}else{
			this.blocks.size=Math.floor(bh);
		}
		if (this.blocks.size<this.blocks.minSize) {
			this.blocks.size=this.blocks.minSize;
			this.blocks.columns=Math.floor(this.board.width/this.blocks.size);
			this.blocks.rows=Math.floor(this.board.height/this.blocks.size);
		}
		this.blocks.size-=this.blocks.margin*2;
		if (this.blocks.columns<this.blocks.minColumns || this.blocks.rows<this.blocks.minRows) {
			$(this.container).find('.blocks_boundary').html("Unfortunately, your browser is not large enough to display this game.");
		}else{
			this.board.object.css('width',this.board.width+"px");
			this.board.object.css('height',this.board.height+"px");
			this.scoreContainer.object.css('width',this.scoreContainer.width+"px");
			this.scoreContainer.object.css('height',this.scoreContainer.height+"px");
			this.draw();
		}
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
		this.timer=setTimeout('blocks.clock()',1000);
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
		this.timer=setTimeout('if (blocks!==undefined) blocks.clock();',1000);
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
				];
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
				//['cow','bus','yak','pan'],
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
		styles.old={background:colours[2]+' !important'};
		styles.ff={background:'-moz-linear-gradient('+(horizontal?'left':'top')+', '+colours[0]+' 0%, '+colours[1]+' 50%, '+colours[2]+' 51%, '+colours[3]+' 100%) !important'};
		styles.chromeOld={background:'-webkit-gradient(linear, '+(horizontal?'left top, right top,':'left top, left bottom,')+' color-stop(0%,'+colours[0]+'), color-stop(50%,'+colours[1]+'), color-stop(51%,'+colours[2]+'), color-stop(100%,'+colours[3]+')) !important'};
		styles.chrome={background:'-webkit-linear-gradient('+(horizontal?'left':'top')+', '+colours[0]+', 0%, '+colours[1]+',50%, '+colours[2]+',51%, '+colours[3]+',100%) !important'};
		styles.opera={background:'-o-linear-gradient('+(horizontal?'left':'top')+', '+colours[0]+' 0%, '+colours[1]+' 50%, '+colours[2]+' 51%, '+colours[3]+' 100%) !important'};
		styles.ms={background:'-ms-linear-gradient('+(horizontal?'left':'top')+', '+colours[0]+' 0%, '+colours[1]+' 50%, '+colours[2]+' 51%, '+colours[3]+' 100%) !important'};
		styles.w3c={background:'linear-gradient('+(horizontal?'left':'top')+', '+colours[0]+' 0%, '+colours[1]+' 50%, '+colours[2]+' 51%, '+colours[3]+' 100%) !important'};
		styles.ie={filter:"progid:DXImageTransform.Microsoft.gradient( startColorstr='"+colours[0]+"', endColorstr='"+colours[3]+"',GradientType="+(horizontal?'1':'0')+" ) !important"};
		
		var definitions=[];
		for(var s in styles) {
			for(var ss in styles[s]) {
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
};
