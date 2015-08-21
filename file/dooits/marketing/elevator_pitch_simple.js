
dooit.temporaries('pitch');
var pitch={
	selectors:{
		container:'.pitch'
	},
	containers:{
		container:null,
		pitches:null,
		tabs:null
	},
	selectedPitch:0,
	title:'Elevator Pitch',
	description:'',
	defaultPitch:'',
	value:null,
	key:null,
	suggesters:[],	
	fields:{},
	maxPitches:4,
	init:function() {
		if (arguments.length>0) this.transposeOptions([],arguments[0]);
		this.loadFields();
		this.containers.container=$(this.selectors.container);
		if (this.key!==null && this.containers.container!==null) {
			// start rendering the dooit
			this.validateValues();
			this.framework();
			this.renderTabs();
			//this.renderLeft();
			this.renderPitch();
		}
	},
	validateValues:function() {
		if (this.value==null || typeof(this.value)=="string") this.value={};
		if (this.value.sentences==undefined) this.value.sentences={};
		if (this.value.pitches==undefined) this.value.pitches=[];
		if (this.value.suggestions==undefined) this.value.suggestions=pitch_suggestions;
		if (this.value.pitches.length==0) this.value.pitches.push(this.emptyPitch());
		for(var p=0;p<this.value.pitches.length;p++) {
			if (typeof(this.value.pitches[p].content)!="string") this.value.pitches[p].content='';
			if (typeof(this.value.pitches[p].name)!="string") this.value.pitches[p].name='';
		}
		this.value=dooit.decode(this.value);
	},
	framework:function() {
		var ins='<h2>'+this.title+'</h2>';
		if(this.description!="") ins+="<p>"+this.description+"</p>";
		ins+='<div style="width:100%;overflow:auto"><div class="tabs"></div><div class="pitches"></div></div>';
		$(this.containers.container).html(ins);
		this.containers.pitches=$(this.containers.container).find('.pitches')[0];
		this.containers.tabs=$(this.containers.container).find('.tabs')[0];
	},
	renderTabs:function() {
		var ins='';
		if(this.maxPitches>1) {
			for(var p=0;p<this.value.pitches.length;p++) {
				var title=this.value.pitches[p].name;
				if (title=='') title=this.value.pitches[p].content.subString(0,20);
				ins+="<li class='"+((this.selectedPitch==p)?"on":"off")+" pitchTab'>"+title.replace(/[<>]/g,'')+"</li>";
			}
			if (this.value.pitches.length<this.maxPitches) ins+="<li class='addPitch'>+</li>";
			$(this.containers.tabs).html(ins);
			$(this.containers.tabs).find(".pitchTab").bind("click",function() {
				if(!$(this).hasClass("on")) {
					$(this.parentNode).find('.pitchTab.on').removeClass("on").addClass("off");
					var i=$(this).prevAll('.pitchTab').get().length;
					pitch.selectedPitch=i;
					pitch.renderPitch();
					$(this).addClass("on").removeClass("off");
				}
			});
			$(this.containers.tabs).find(".addPitch").bind("click",function() {
				pitch.value.pitches.push(pitch.emptyPitch());
				pitch.selectedPitch=pitch.value.pitches.length-1;
				pitch.renderTabs();
				pitch.renderPitch();
			});
		}
	},
	renderPitch:function() {
		var ins='';
		if(this.maxPitches>1) ins+="<div>Name: <input type='text' id='name' value='' /></div>";
		ins+="<div><select></select><button type='button' class='addSentence'>add</button><button type='button' class='newSentence'>new</button></div>";
		ins+="<div style='display:none'><label>New sentence: <input type='text' id='newSentence' value='' /></label><button type='button' class='addNew'>add</button><button type='button' class='cancelNew orange'>cancel</button></div>";
		ins+="<textarea>"+this.value.pitches[this.selectedPitch].content+"</textarea>";
		if (this.maxPitches>1) ins+="<div style='text-align:right'><button type='button' class='deletePitch orange'>delete</button></div>";
		$(this.containers.pitches).html(ins);
		$(this.containers.pitches).find('input#name').val(this.value.pitches[this.selectedPitch].name);
		var sel=$(this.containers.pitches).find('select').get(0);
		for(var s=0;s<this.value.suggestions.length;s++) {
			var opt=document.createElement("option");
			opt.innerHTML=this.value.suggestions[s];
			sel.appendChild(opt);
		}
		$(this.containers.pitches).find('button.addSentence').bind("click",function() {
			var ta=$(pitch.containers.pitches).find("textarea");
			var txt=ta.val();
			txt+=((txt=="")?'':' ')+$(pitch.containers.pitches).find("select").val();
			ta.val(txt);
			ta.focus();
			pitch.value.pitches[pitch.selectedPitch].content=txt;
		});
		$(this.containers.pitches).find('button.newSentence').bind("click",function() {
			$(this.parentNode).slideUp();
			$(this.parentNode).next().slideDown();
		});
		$(this.containers.pitches).find('button.addNew').bind("click",function() {
			var txt=$(this.parentNode).find("input#newSentence").val();
			if (txt!="") {
				pitch.value.suggestions.push(txt);
				var opt=document.createElement("option");
				opt.innerHTML=txt;
				$(pitch.containers.pitches).find("select").get(0).appendChild(opt);
				$(this.parentNode).slideUp();
				$(this.parentNode).prev().slideDown();

				var ta=$(pitch.containers.pitches).find("textarea");
				var t=ta.val();
				t+=((t=="")?'':' ')+txt;
				ta.val(t);
				ta.focus();
				pitch.value.pitches[pitch.selectedPitch].content=t;

			}
		});
		$(this.containers.pitches).find('button.cancelNew').bind("click",function() {
				$(this.parentNode).slideUp();
				$(this.parentNode).prev().slideDown();
		});
		$(this.containers.pitches).find('input#name').bind("keyup",function() {
			pitch.value.pitches[pitch.selectedPitch].name=this.value;
		});
		$(this.containers.pitches).find('textarea').bind("keyup",function() {
			pitch.value.pitches[pitch.selectedPitch].content=this.value;
		});
		$(this.containers.pitches).find('input#name').bind("blur",function() {
			pitch.renderTabs();
		});
		$(this.containers.pitches).find('button.deletePitch').bind("click",function() {
			pitch.value.pitches.splice(pitch.selectedPitch,1);
			if (pitch.value.pitches.length==0) pitch.value.pitches.push(pitch.emptyPitch());
			if (pitch.selectedPitch>=pitch.value.pitches.length) pitch.selectedPitch=pitch.value.pitches.length-1;
		});
		var ta=$(this.containers.pitches).find('textarea');
		var ha=$('#yoodooScrolledArea').height()-$('.dooitBox').outerHeight();
		ta.css("height",ta.height()+ha);
	},
	renderLeft:function() {
		var d=document.createElement("div");
		var ins="<h3>My sentences</h3>";
		//ins+="<a href='javascript:void(0)' onclick='pitch.showSuggestions()'>Get some suggestions...</a>";
		if (this.showAllSentences) {
			ins+="<a href='javascript:void(0)' onclick='pitch.newSentence()' style='float:right'>new</a>";
			ins+="<a href='javascript:void(0)' onclick='pitch.showSuggestions()'>Get some suggestions...</a>";

			ins+="<br />";
			ins+="<ul class='tabs'>";
			ins+="<li class='tab on'>All</li>";
			ins+="<li class='tab off' onclick='pitch.showAllSentences=!pitch.showAllSentences;pitch.renderLeft()'>in Pitch</li>";
			ins+="</ul>";
			//ins+="Showing all - <a href='javascript:void(0)' onclick='pitch.showAllSentences=!pitch.showAllSentences;pitch.renderLeft()'>Show pitch sentences</a>";
		}else{
			ins+="<a href='javascript:void(0)' onclick='pitch.newSentence(true)' style='float:right'>new</a>";
			ins+="<a href='javascript:void(0)' onclick='pitch.showSuggestions()'>Get some suggestions...</a>";
			ins+="<br />";

			ins+="<ul class='tabs'>";
			ins+="<li class='tab off' onclick='pitch.showAllSentences=!pitch.showAllSentences;pitch.renderLeft()'>All</li>";
			ins+="<li class='tab on'>in Pitch</li>";
			ins+="</ul>";
			//ins+="Showing pitch sentences - <a href='javascript:void(0)' onclick='pitch.showAllSentences=!pitch.showAllSentences;pitch.renderLeft()'>Show all sentences</a>";
		}
		ins+="<div class='sentenceList'></div>";
		$(this.containers.sentences).html(ins);
		if (this.showAllSentences) {
			this.renderSentences($(this.containers.sentences).find(".sentenceList").get(0));
		}else{
			this.renderPitchSentences($(this.containers.sentences).find(".sentenceList").get(0));
		}
		$('.sentenceList .sentenceWrapper').bind("mouseover",function() {
			var a=$(this).find("a").get();
			if (a.length>0) {
				var id=a[0].id;
				$('.pitches .frame span#'+id).addClass("over");
			}
		});
		$('.sentenceList .sentenceWrapper').bind("mouseout",function() {
			var a=$(this).find("a").get();
			if (a.length>0) {
				var id=a[0].id;
				$('.pitches .frame span#'+id).removeClass("over");
			}
		});
	},
	showSuggestions:function() {
		var ins="Suggested sentences...";
		ins+="<div style='max-height:250px;overflow:auto;'>";
		for(var i=0;i<this.suggesters.length;i++) {
			ins+="<a href='javascript:void(0)' onclick='pitch.addSuggestion("+i+");'>"+this.suggesters[i]+"</a>";
		}
		ins+="</div>";
		ins+="<button type='button' class='cancel' onclick='pitch.renderLeft()'>cancel</button>";
		$(this.containers.sentences).html("<div class='pitchSuggestions'>"+ins+"</div>");
	},
	addSuggestion:function(i) {
		this.showAllSentences=true;
		this.newSentence(this.suggesters[i]);
	},
	showAllSentences:true,
	renderSentences:function() {
		this.checkSentenceCounts();
		var ins='';
		var keys=[];
		for(var s in this.value.sentences) {
			keys.push({key:s,text:this.value.sentences[s].content});
		}
		keys.sort(function(a,b){
			var na=a.text.toLowerCase();
			var nb=b.text.toLowerCase();
			return na>nb;
		});
		for(var i=0;i<keys.length;i++) {
			ins+=this.sentenceObjectAddable(keys[i].key);
		}
		if (arguments.length>0) {
			$(arguments[0]).html(ins);
		}else{
			$(this.containers.sentences).html(ins);
		}
	},
	renderPitchSentences:function() {
		this.checkSentenceCounts();
		var ins='';
		for(var s=0;s<this.value.pitches[this.selectedPitch].sentences.length;s++) {
			var id=this.value.pitches[this.selectedPitch].sentences[s];
			if(id=="paragraph") {
				ins+="<div class='sentenceWrapper paragraph' id='paragraph'><button type='button' class='removable' onclick='pitch.removeSentenceFromPitch(\"paragraph\",this)'></button><span class='movable'></span><em>line break</em></div>";
			}else{
				ins+=this.sentenceObject(this.value.pitches[this.selectedPitch].sentences[s],false,false,(this.value.pitches[this.selectedPitch].sentences.length>1));
			}
		}
		var obj=this.containers.sentences;
		if (arguments.length>0) obj=arguments[0];
		$(obj).html(ins);
		$(obj).sortable({handle:'.movable',update:function(e,ui) {
			pitch.reordered();
		}});
		var a=document.createElement("a");
		a.href='javascript:pitch.addParagraphToPitch()';
		a.innerHTML='add a line break';
		this.containers.sentences.appendChild(a);
		//$(this.containers.sentences).html(ins);
	},
	addPitch:function() {
		this.value.pitches.push(this.emptyPitch());
		this.selectedPitch=this.value.pitches.length-1;
		this.renderPitch();
		this.renderLeft();
	},
	deletePitch:function() {
		var i=this.selectedPitch;
		if (arguments.length>0) i=arguments[0];
		this.value.pitches.splice(i,1);
		if (i==this.selectedPitch) this.selectedPitch--;
		if (this.selectedPitch<=this.value.pitches.length) this.selectedPitch=this.value.pitches.length-1;
		if (this.value.pitches.length==0){
			this.selectedPitch=0;
			this.addPitch();
		}else{
			this.renderPitch();
			this.renderLeft();
		}
	},
	addSentenceToPitch:function(k) {
		this.value.pitches[this.selectedPitch].sentences.push(k);
		this.renderPitch();
		this.renderLeft();
	},
	addParagraphToPitch:function() {
		this.value.pitches[this.selectedPitch].sentences.push('paragraph');
		this.renderPitch();
		this.renderLeft();
	},
	removeSentenceFromPitch:function(k) {
		if (k=="paragraph") {
			if (arguments.length>1) {
				var obj=arguments[1];
				var i=$(obj.parentNode).prevAll(".sentenceWrapper").get().length;
				if (i>=0) this.value.pitches[this.selectedPitch].sentences.splice(i,1);
			}
		}else{
			var i=this.value.pitches[this.selectedPitch].sentences.indexOf(k);
			if (i>=0) this.value.pitches[this.selectedPitch].sentences.splice(i,1);
			if(this.value.sentences[k].count==1 && window.confirm("Do you wish to delete this sentence all together?")) {
				delete this.value.sentences[k];
			}else if (this.value.sentences[k].count==0) {
				delete this.value.sentences[k];
			}
		}
		this.checkSentenceCounts();
		this.renderPitch();
		this.renderLeft();
	},
	checkSentenceCounts:function() {
		for(var s in this.value.sentences) {
			this.value.sentences[s].count=this.sentenceCount(s);
		}
	},
	sentenceCount:function(k) {
		var c=0;
		for(var p=0;p<this.value.pitches.length;p++) {
			if (this.value.pitches[p].sentences.indexOf(k)>=0) c++;
		}
		return c;
	},
	sentenceObjectAddable:function(k) {
		var asElement=false;
		if (arguments.length>1) asElement=arguments[1];
		return this.sentenceObject(k,asElement,true);
	},
	sentenceObject:function(k) {
		var asElement=false;
		if (arguments.length>1) asElement=arguments[1];
		var addable=false;
		if (arguments.length>2) addable=arguments[2];
		var movable=false;
		if (arguments.length>3) movable=arguments[3];
		var display=true;
		if (k=="paragraph" && !movable) display=false;
		if(display) {
			var ins='';
			var classes=['sentenceWrapper'];
			if (this.value.sentences[k].count>1) classes.push("multiple");
			if(addable) {
				if (this.value.pitches[this.selectedPitch].sentences.indexOf(k)<0) {
					ins+="<button type='button' class='addable' onclick='pitch.addSentenceToPitch(\""+k+"\")'></button>";
					classes.push("addable");
				}
			}
			//if (this.value.pitches[this.selectedPitch].sentences.indexOf(k)>=0) {
				ins+="<button type='button' class='removable' onclick='pitch.removeSentenceFromPitch(\""+k+"\")'></button>";
			//}
			if (movable) {
				ins+="<span class='movable'></span>";
			}
			if (this.value.sentences[k].count>1) {
				ins+="<span class='multiplePitches' title='In more than one pitch'></span>";
			}
			var content=this.value.sentences[k].content;
			if (content=='') content='<em>empty</em>';
			if (asElement) {
				var a=document.createElement("div");
				for(var i=0;i<classes.length;i++) $(a).addClass(classes[i]);
				$(a).html(ins+"<a id='"+k+"' href='javascript:void(0)' onclick='pitch.editSentence(\""+k+"\");' class='sentence'>"+content+"</a>");
			}else{
				var a="<div class='"+classes.join(" ")+"'>"+ins+"<a id='"+k+"' href='javascript:void(0)' onclick='pitch.editSentence(\""+k+"\");' class='sentence'>"+content+"</a></div>";
			}
			return a;
		}else{
			return null;
		}
	},
	reordered:function() {
		var no=[];
		$('.sentenceList .sentenceWrapper').each(function(i,e) {
			var a=$(e).find("a").get();
			if(a.length>0) {
				no.push(a[0].id);
			}else{
				no.push('paragraph');
			}
		});
		this.value.pitches[this.selectedPitch].sentences=no;
		this.renderPitch();
	},
	sentenceKey:'',
	editSentence:function(k) {
		this.sentenceKey=k;
		$(this.containers.pitches).slideUp(1000,function() {
			$(this).html("<h3>Edit sentence</h3><textarea>"+pitch.value.sentences[pitch.sentenceKey].content+"</textarea><button type='button' class='cancel' onclick='pitch.editSentenceCancel()'>cancel</button><button type='button' class='save' onclick='pitch.editSentenceSave()'>save</button>");
			$(this).slideDown();
			var a=$(pitch.containers.sentences).find('a#'+k).get();
			if (a.length>0) $(a[0].parentNode).addClass("over");
		});
	},
	editSentenceSave:function() {
		var a=$(pitch.containers.sentences).find('a#'+this.sentenceKey).get();
		if (a.length>0) $(a[0].parentNode).removeClass("over");
		this.value.sentences[this.sentenceKey].content=$(this.containers.pitches).find("textarea").val();
		this.renderLeft();
		$(this.containers.pitches).slideUp(1000,function() {
			$(this).html('');
			pitch.renderPitch();
		});
	},
	editSentenceCancel:function() {
		var a=$(pitch.containers.sentences).find('a#'+this.sentenceKey).get();
		if (a.length>0) $(a[0].parentNode).removeClass("over");
		$(this.containers.pitches).slideUp(1000,function() {
			$(this).html('');
			pitch.renderPitch();
		});
	},
	newSentence:function() {
		var t='New sentence';
		var alsoAdd=false;
		if (arguments.length>0 && typeof(arguments[0])=="string") t=arguments[0];
		if (arguments.length>0 && typeof(arguments[0])!="string") alsoAdd=arguments[0];

		var id=this.uniqueid();
		this.value.sentences[id]=this.emptySentence(t);
		if (alsoAdd) this.addSentenceToPitch(id);
		//var a=this.sentenceObject(id,true);
		//$(a).css("display","none");
		//this.containers.sentences.appendChild(a);
		//$(a).slideDown();
		this.renderLeft();
		this.editSentence(id);
	},
	emptySentence:function() {
		return {content:((arguments.length==0)?'':arguments[0]),count:0};
	},
	emptyPitch:function() {
		if (this.maxPitches==1) return {name:'My Elevator Pitch',content:this.defaultPitch};
		return {name:'Untitled',content:this.defaultPitch};
	},
	uniqueid:function() {
		var id=this.randomid();
		while(this.value.sentences[id]!=undefined) {
			id=this.randomid();
		}
		return id;
	},
	randomid:function() {
		var letters='abcdefghijklmnopqrstuvwxyz';
		var id='';
		while(id.length<10) {
			id+=letters.substr(Math.round((letters.length-1)*Math.random()),1);
		}
		return id;
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
