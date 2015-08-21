var find_sites={
	key:'',
	value:null,
	container:null,
	container_selector:'.findsites',
	//bingID:'ED7C449EE24DD3CE1807C0F1D39CEB0D4DC52D7E',
	bingID:'j3R9727r6Z26WnsKxoHr0uk2o2dsBVafUNb42+cUWto=',
	emptySearchText:'search...',
	emptyAddText:'Competitor name...',
	promptText:'Compile a list of your competitors, add define what is good or bad about them. Maybe even select a favourite.',
	highlight:{startReg:new RegExp("\uE000","g"),endReg:new RegExp("\uE001","g"),start:'<b>',end:'</b>'},
	structure:{
		name:{title:'Company',type:'text',className:'companyname'},
		description:{title:'Description',type:'text',className:'companydescription'},
		like:{title:'What are they good at?',type:'text',className:'companygoodat',summary:'[name] are good at [value]'},
		bad:{title:'What are they bad at?',type:'text',className:'companybadat',summary:'[name] are bad at [value]'},
		copy:{title:'What would you copy?',type:'text',className:'companycopy',summary:'We would copy [value] from [name]'},
		avoid:{title:'What would you avoid?',type:'text',className:'companyavoid',summary:'We would avoid [value] from [name]'},
		favourite:{title:'Most like this',type:'boolean',className:'favourite',summary:'I believe the best competitor is [name]'},
		ease:{title:'Easiest service',type:'boolean',className:'easiest',summary:'I believe the easiest service is provided by [name]'},
		bestvalue:{title:'Best value',type:'boolean',className:'bestvalue',summary:'I believe the best value service is provided by [name]'},
		quality:{title:'Best quality',type:'boolean',className:'bestquality',summary:'I believe the best quality service is provided by [name]'}
	},
	google:{
		title:'name',
		description:'description'
	},
	init:function() {
		this.key='';
		if (arguments.length>0) this.container_selector=arguments[0];
		this.container=$(this.container_selector).get(0);
		$(this.container).addClass("find_sites_container");
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
				eval('find_sites.value='+array_of_fields[this.key][1]+';');
			}catch(ex) {}
		}
		this.build();
		this.embedBing();
	},
	build:function() {
		var ins="";
		if (this.promptText && this.promptText!="") ins+="<p>"+this.promptText+"</p>";
		ins+="<div class='toolbar'><div class='searcher' style='display:none'>Search...<input type='text' value='"+this.emptySearchText+"' /><button type='button' class='searchButton'>search</button><button type='button' class='clearResults' onclick='find_sites.clearResults()' style='display:none'>clear</button><div class='searcherResults'></div></div>Manually add: <input type='text' value='"+this.emptyAddText+"' /><button type='button' class='addButton'>add</button></div>";
		ins+="<div class='companies'>";
		if (this.value===null) this.value={items:[]};
		if (typeof(this.value)=="object" && typeof(this.value.items)=="object") {
			for(var o=0;o<this.value.items.length;o++) {
				ins+=this.siteObject(o);
			}
		}
		ins+="</div>";
		$(this.container).html(ins);
		$(this.container).find('.toolbar>input[type=text]').bind('keydown',function(e) {
			if (e.keyCode==13) {
				e.preventDefault();
				find_sites.addNew();
			}
		});
		$(this.container).find('.toolbar button.addButton').bind('click',function() {
			find_sites.addNew();
		});
		$(this.container).find('.toolbar .searcher input[type=text]').bind('focus',function() {
			if (this.value==find_sites.emptySearchText) this.value='';
		});
		$(this.container).find('.toolbar .searcher input[type=text]').bind('blur',function() {
			if (this.value=='') this.value=find_sites.emptySearchText;
		});
		$(this.container).find('.toolbar>input[type=text]').bind('focus',function() {
			if (this.value==find_sites.emptyAddText) this.value='';
		});
		$(this.container).find('.toolbar>input[type=text]').bind('blur',function() {
			if (this.value=='') this.value=find_sites.emptyAddText;
		});
	},
	addNew:function() {
		var name=$(this.container).find('.toolbar>input[type=text]').val();
		if (name!="" && name!=find_sites.emptyAddText) {
			var no={};
			for(var s in find_sites.structure) {
				no[s]='';
			}
			no.name=name;
			find_sites.value.items.push(no);
			var nco=find_sites.siteObject(find_sites.value.items.length-1,true);
			$(nco).css("display","none");
			$(find_sites.container).find('.companies').get(0).appendChild(nco);
			$(nco).fadeIn();
			$(this.container).find('.toolbar>input[type=text]').val(this.emptyAddText);
		}else{
			$(this).prev('input').fadeOut(500,function(){$(this).fadeIn(500);});
		}
	},
	addResult:function(o) {
		$(o.parentNode).slideUp();
		var title=$(o).find('.searcherResultTitle').html().replace(/<[^>]+>/g,'');
		var description=$(o).find('.searcherResultDescription').html().replace(/<[^>]+>/g,'');
		var no={};
		for(var s in find_sites.structure) {
			no[s]='';
		}
		no.name=title;
		no.description=description;
		find_sites.value.items.push(no);
		var nco=find_sites.siteObject(find_sites.value.items.length-1,true);
		$(nco).css("display","none");
		$(find_sites.container).find('.companies').get(0).appendChild(nco);
		$(nco).fadeIn();
		find_sites.clearResults();
	},
	siteObject:function(i) {
		var asElement=false;
		if (arguments.length>1) asElement=arguments[1];
		var ins='';
		if (typeof(this.value.items[i].favourite)=="undefined") this.value.items[i].favourite=false;
		for(var s in this.structure) {
			if (this.structure[s].type=="boolean") {
				ins+="<button type='button' class='"+this.structure[s].className+(this.value.items[i][s]?" on":"")+"' onclick='find_sites.setBoolean(this,\""+s+"\")' title='"+this.structure[s].title+"'></button>";
			}
		}
		ins+="<button type='button' class='remove' onclick='find_sites.remove(this)'>delete</button>";
		for(var s in this.structure) {
			if (this.structure[s].type=="text") {
			if(typeof(this.value.items[i][s])=="undefined") this.value.items[i][s]='';
			ins+=this.editableText(this.value.items[i][s],s);
			}
		}
		if (asElement) {
			var rep=document.createElement("DIV");
			$(rep).addClass("companyElement");
			$(rep).html(ins);
			return rep;
		}else{
			ins="<div class='companyElement'>"+ins+"</div>";
			return ins;
		}
	},
	editableText:function(text,type) {
		var empty=(text=='');
		if (empty) text=this.structure[type].title;
		var ins='<div class="'+this.structure[type].className+'"><div class="editableText'+(empty?' empty':'')+'" rel="'+type+'"onclick="find_sites.editMe(this)">'+text+'</div></div>';
		return ins;
	},
	remove:function(o) {
		var comp=this.predecessor(o,'companyElement');
		var i=$(comp).prevAll('.companyElement').get().length;
		this.value.items.splice(i,1);
		$(comp).animate({width:"0px",opacity:0},function() {
			$(this).remove();
		});
	},
	predecessor:function(o,c) {
		if (o==document.body) return o;
		if ($(o).hasClass(c)) return o;
		if (typeof(o.parentNode)!="undefined") {
			return this.predecessor(o.parentNode,c);
		}else{
			return document.body;
		}
	},
	setBoolean:function(o,type) {
		var comp=this.predecessor(o,'companyElement');
		var i=$(comp).prevAll('.companyElement').get().length;
		this.value.items[i][type]=!this.value.items[i][type];
		for(var c=0;c<this.value.items.length;c++) {
			if (c!=i) this.value.items[c][type]=false;
		}
		$(this.container).find('.'+this.structure[type].className+'.on').removeClass("on");
		if (this.value.items[i][type]) {
			$(o).addClass("on");
		}else{
			$(o).removeClass("on");
		}
		this.summary();
	},
	editMe:function(o) {
		$(this.container).find("input[type=text]").trigger("blur");
		var emptyText=find_sites.structure[$(o).attr("rel")].title;
		var txt=o.innerHTML;
		if (txt==emptyText) txt='';
		var ip=document.createElement("input");
		ip.type='text';
		ip.value=txt;
		o.parentNode.insertBefore(ip,o);
		ip.focus();
		$(o).css("display","none");
		$(ip).attr("rel",$(o).attr("rel"));
		ip.update=function() {
			var comp=find_sites.predecessor(this,'companyElement');
			var i=$(comp).prevAll('.companyElement').get().length;
			find_sites.value.items[i][$(this).attr("rel")]=this.value;
		};
		$(ip).bind("keydown",function(e) {
			if (e.keyCode==13 || e.keyCode==9) {
				e.preventDefault();
				this.update();
				if(e.shiftKey) {
					var next=$(this.parentNode).prev();
				}else{
					var next=$(this.parentNode).next();
				}
				$(this).trigger("blur");
				next.find('.editableText').trigger("click");
			}
		});
		$(ip).bind("keyup",function() {
			this.update();
		});
		$(ip).bind("blur",function() {
			this.update();
			var emptyText=find_sites.structure[$(this).attr("rel")].title;
			var txt=this.value;
			txt=find_sites.tidyText(txt);
			if (txt=="") txt=emptyText;
			var dv=$(this).next('.editableText');
			if (txt==emptyText) {
				dv.addClass("empty");
			}else{
				dv.removeClass("empty");
			}
			dv.html(txt);
			dv.css("display","block");
			find_sites.summary();
			$(this).remove();
		});
	},
	tidyText:function(txt) {
		return txt.replace(/[\<\>]/g,'');
	},
	summary:function() {
		this.value.summary=[];
		this.value.swot={s:[],w:[],o:[],t:[]};
		if (this.value.items.length>0) {
			for(var i=0;i<this.value.items.length;i++) {
				var name=this.value.items[i].name;
				if (name!='') {
					for(var s in this.structure) {
						if(this.structure[s].summary) {
							if (typeof(this.value.items[i][s])!="undefined" && this.value.items[i][s]!='' && this.value.items[i][s]!=false) {
								var name=this.value.items[i].name;
								var sum=this.structure[s].summary.replace('[name]',name).replace('[value]',this.value.items[i][s]);
								this.value.summary.push(sum);
								if(this.structure[s].swot!=undefined) {
									this.value.swot[this.structure[s].swot].push(sum);
								}
							}
						}
					}
				}
			}
		}
	},
	bingPage:1,
	bingQuery:'',
	embedBing:function() {
		$(find_sites.container).find(".toolbar .searcher").fadeIn();
		$(this.container).find(".toolbar .searcher button.searchButton").bind("click",function() {
			find_sites.startSearch();
		});
		$(this.container).find(".toolbar .searcher input[type=text]").bind("keydown",function(e) {
			if (e.keyCode==13) {
				e.preventDefault();
				find_sites.startSearch();
			}
		});
	},
	startSearch:function() {
		var q=$(find_sites.container).find(".toolbar .searcher input[type=text]").val();
		if (q!=find_sites.emptySearchText) {
			find_sites.bingQuery=q;
			find_sites.bingPage=1;
			find_sites.bingURL();
		}else{
			var ip=$(find_sites.container).find(".toolbar .searcher input[type=text]").get(0);
			ip.value='';
			ip.focus();
		}
	},
	nextPage:function() {
		this.bingPage++;
		this.bingURL();
	},
	bingURL:function() {
		var url='http://www.yoodoo.biz/utilities/bing/search.php?query=%27'+find_sites.bingQuery+'%27&page='+find_sites.bingPage+'&callback=find_sites.binged';
		find_sites.bingScript=document.createElement("SCRIPT");
		find_sites.bingScript.type='text/javascript';
		find_sites.bingScript.src=url;
		var h=$('head').get(0);
		h.appendChild(find_sites.bingScript);
	},
	bingResultHTML:'',
	binged:function(res) {
		$(find_sites.bingScript).remove();
		var ins=this.searchResultsHTML(res);
		if (this.bingPage==1) this.bingResultHTML='';
		this.bingResultHTML+=ins;
		ins=this.bingResultHTML;
		if ($(this.container).find(".searcher button.clearResults").css("display")=="none") $(this.container).find(".searcher button.clearResults").fadeIn();
		ins+="<button type='button' class='searcherMore' onclick='find_sites.nextPage()'>more</button>";
		$(this.container).find('.searcherResults').html(ins);
		$(this.container).find('.searcherResults').slideDown();
	},
	clearResults:function() {
		this.bingPage=1;
		this.bingQuery='';
		this.bingResultHTML='';
		$(this.container).find('.searcher button.clearResults').fadeOut();
		$(this.container).find('.searcherResults').slideUp(1000,function() {$(this).html('');});
	},
	searchResultsHTML:function(res) {
		var ins='';
		for(var i=0;i<res.d.results.length;i++) {
			ins+="<div class='searcherResult'>";
			ins+="<div class='searcherResultSelector' onclick='find_sites.addResult(this)'>";
			ins+="<div class='searcherResultTitle'>"+this.bingHighlight(res.d.results[i].Title)+"</div>";
			ins+="<div class='searcherResultDescription'>"+this.bingHighlight(res.d.results[i].Description)+"</div>";
			ins+="</div>";
			ins+="<a href='"+res.d.results[i].Url+"' target='_blank'>view site</a>";
			ins+="</div>";
		}
		return ins;
	},
	bingHighlight:function(txt) {
		if(txt==undefined || txt==null) return "";
		return txt.replace(this.highlight.startReg,this.highlight.start).replace(this.highlight.endReg,this.highlight.end);
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
	}
};
dooit.temporaries('find_sites');
