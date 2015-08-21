
dooit.temporaries('strategy');
var strategy={
	selectors:{
		container:'.strategy'
	},
	containers:{
		container:null,
		left:null,
		rigt:null
	},
	defaultCustomerName:'Customer name',
	checklist:[
		{id:'',title:'Become a shareholder',description:'buy one share in each company and receive shareholder information'},
		{id:'',title:'Collect adverts they publish',description:'Start collecting and filing any adverts they publish'},
		{id:'',title:'Press pack',description:'Request a press pack/PR folder'},
		{id:'',title:'Mailing Lists',description:'Get on their mailing lists'},
		{id:'',title:'Attend events',description:'Any conferences or exhibitions that they may be taking part in'},
		{id:'',title:'Star Candidate',description:'Market in a star candidate'},
		{id:'',title:'Company brochure',description:'Send a company brochure by post with an introductory letter'},
		{id:'',title:'Preferred sellers list',description:'Research getting on to their PSL'},
		{id:'',title:'Annual accounts',description:'Get a copy of their annual accounts/chairman\'s statement to identify their growth plans for the next 1-5 years'},
		{id:'',title:'Connect on LinkedIn',description:'Find and file "LinkedIn" profiles for key decision makers'},
		{id:'',title:'Send an article',description:'Send the decision makers a sector related article from a newspaper or industry magazine that might be of interest to them'},
		{id:'',title:'Research the company',description:'Research the company history and understand the company management structure'},
		{id:'',title:'Forums and blogs',description:'Join any forums or blogs they run or take part in'},
		{id:'',title:'Discover their publications',description:'Find out where they publish articles or send press releases and keep up to date with their news'},
		{id:'',title:'Dossier',description:'Build a dossier of any information you can find published on them eg. articles, press releases, etc.)'}
	],
	display:{
		left:'customer',
		right:'summary',
		customer:0
	},
	tabs:[
		{customer:'Companies',checklist:'Checklist items'},
		{summary:'Client Details',history:'Action History'}
	],
	title:'Key Account Target Strategy',
	value:null,
	key:null,	
	fields:{},
	init:function() {
		this.title=yoodoo.dooittitle;
		if (arguments.length>0) this.transposeOptions([],arguments[0]);
		this.loadFields();
		this.containers.container=$(this.selectors.container);
		if (this.key!==null && this.containers.container!==null) {
			// start rendering the dooit
			this.validateValues();
			this.framework();
			this.renderLeft();
			this.renderRight();
			this.updateTimestamps();
		}
	},
	setUpdated:function() {
		this.value.customer[this.display.customer].updated=new Date().getTime();
	},
	validateValues:function() {
		if (this.value==null || typeof(this.value)=="string") this.value={};
		if (this.value.customer==undefined) this.value.customer=[];
		if (this.value.checklist==undefined) {
			this.value.checklist=this.checklist;
			for(var c=0;c<this.value.checklist.length;c++) this.value.checklist[c].id=this.uniqueid();
		}
		if (this.value.details==undefined) this.value.details=this.defaultDetails();
		if (this.value.customer.length==0) this.value.customer.push(this.emptyCustomer());
	},
	framework:function() {
		var ins='<h2>'+this.title+'</h2>';
		if (yoodoo.dooitteaser!="") {
			ins+="<p>"+yoodoo.dooitteaser+"</p>";
		}
		ins+='<div style="width:100%;overflow:auto"><div class="leftPanel"><div class="frame"></div></div><div class="rightPanel"><div class="frame"></div></div></div>';
		$(this.containers.container).html(ins);
		this.containers.leftPanel=$(this.containers.container).find('.leftPanel .frame')[0];
		this.containers.rightPanel=$(this.containers.container).find('.rightPanel .frame')[0];
	},
	renderLeft:function() {
		var ins='';
		ins+="<ul class='tabs'><li id='customerTab' class='tab"+((this.display.left=="customer")?" on":" off")+"'>"+this.tabs[0].customer+"</li><li id='checklistTab' class='tab"+((this.display.left=="checklist")?" on":" off")+"'>"+this.tabs[0].checklist+"</li></ul>";
		ins+="<div class='tabContent' id='customer' style='display:"+((this.display.left=="customer")?"block":"none")+"'>"+this.renderCustomers()+"</div>";
		ins+="<div class='tabContent' id='checklist' style='display:"+((this.display.left=="checklist")?"block":"none")+"'>"+this.renderChecklist()+"</div>";
		$(this.containers.leftPanel).html(ins);
		$(this.containers.leftPanel).find("li.tab").bind("mousedown",function(e){
			e.preventDefault();
		});
		$(this.containers.leftPanel).find("li.tab").bind("click",function(e){
			e.preventDefault();
			$(this).siblings("li").removeClass("on").addClass("off");
			$(this).removeClass("off").addClass("on");
			var con=$(strategy.containers.leftPanel).find("#"+this.id.replace(/Tab$/,''));
			con.css("display","block");
			con.siblings('.tabContent').css("display","none");
			strategy.display.left=this.id.replace(/Tab$/,'');
			if (strategy.display.left=='checklist') {
				strategy.display.right="history";
				strategy.renderRight();
			}
		});
		$(this.containers.leftPanel).find('#checklist').sortable({handle:".move",update:function(e,ui) {
			strategy.reordered();
		}});
	},
	renderRight:function() {
		var ins='';
		ins+="<ul class='tabs'>";
		//ins+="<li id='summaryTab' class='tab"+((this.display.right=="summary")?" on":" off")+"'>"+this.tabs[1].summary+"</li>";
		ins+="<li id='summaryTab' class='tab"+((this.display.right=="details"|| this.display.right=="summary")?" on":" off")+"'>"+this.tabs[1].summary+"</li>";
		//ins+="<li id='checklistTab' class='tab"+((this.display.right=="checklist")?" on":" off")+"'>"+this.tabs[1].checklist+"</li>";
		ins+="<li id='historyTab' class='tab"+((this.display.right=="history" || this.display.right=="checklist")?" on":" off")+"'>"+this.tabs[1].history+"</li>";
		ins+="</ul>";
		ins+="<div class='tabContent' id='summary' style='display:"+((this.display.right=="summary")?"block":"none")+"'>"+this.renderSummary()+"</div>";
		ins+="<div class='tabContent' id='details' style='display:"+((this.display.right=="details")?"block":"none")+"'>"+this.renderDetails()+"</div>";
		ins+="<div class='tabContent' id='checklist' style='display:"+((this.display.right=="checklist")?"block":"none")+"'>"+"</div>";
		ins+="<div class='tabContent' id='history' style='display:"+((this.display.right=="history")?"block":"none")+"'>"+this.renderHistory()+"</div>";
		$(this.containers.rightPanel).html(ins);
		$(this.containers.rightPanel).find("li.tab").bind("mousedown",function(e){
			e.preventDefault();
		});
		$(this.containers.rightPanel).find("li.tab").bind("click",function(e){
			e.preventDefault();
			$(this).siblings("li").removeClass("on").addClass("off");
			$(this).removeClass("off").addClass("on");
			var con=$(strategy.containers.rightPanel).find("#"+this.id.replace(/Tab$/,''));
			con.css("display","block");
			con.siblings('.tabContent').css("display","none");
			strategy.display.right=this.id.replace(/Tab$/,'');
		});
		this.setDetailsEvents();
		this.historyEvents();
	},
	setDetailsEvents:function() {
		inputs.date($(strategy.containers.rightPanel).find("#details input.datetime"),{formatdisplay:'jS F Y',selected:function(o,d,v) {
			var i=$(o.parentNode).prevAll(".detail").get().length;
			strategy.value.customer[strategy.display.customer].details[i].value=v;
		}});
		$(strategy.containers.rightPanel).find("#details input.email").bind("keyup",function(){
			if(/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(this.value) || this.value=='') {
				$(this).removeClass("warning");
			}else{
				$(this).addClass("warning");
			}
			strategy.setUpdated();			
		});
		$(strategy.containers.rightPanel).find("#details input.url").bind("keyup",function(){
			var regexp = /(^|\s)((https?:\/\/)?[\w-]+(\.[\w-]+)+\.?(:\d+)?(\/\S*)?)/gi;
			if(regexp.test(this.value) || this.value=='') {
				$(this).removeClass("warning");
			}else{
				$(this).addClass("warning");
			}	
			strategy.setUpdated();			
		});
		$(strategy.containers.rightPanel).find("#details input,#details textarea").bind("keyup",function(){
			if($(this).hasClass("customerName")){
				strategy.value.customer[strategy.display.customer].name=this.value;
				$('.leftPanel #customer .item.on a').html(this.value);
			}else{
				var i=$(this.parentNode).prevAll(".detail").get().length;
				strategy.value.customer[strategy.display.customer].details[i].value=this.value;
			}
			strategy.setUpdated();
			$('#summary').html(strategy.renderSummary());
		});
	},
	safe:function(ip) {
		return ip.replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\n/g,'<br />').replace(/'/g,'\\\'');
	},
	inputsafe:function(ip) {
		return ip.replace(/"/g,'');
	},
	emptyCustomer:function() {
		var dt=this.defaultDetails();
		//if (this.value.details!=undefined) dt=this.value.details.slice();
		return {name:this.defaultCustomerName,details:dt,checklist:{},history:[],created:new Date().getTime(),updated:new Date().getTime()};
	},
	defaultDetails:function() {
		return [{title:'Website',type:'url',value:''},{title:'Email',type:'email',value:''},{title:'Address',type:'textarea',value:''}];
	},
	selectedCustomer:function(i) {
		this.display.customer=i;
		this.renderLeft();
		this.renderRight();
	},
	show:function(id) {
		$('.rightPanel .tabContent').css({display:"none"});
		$('.rightPanel .tabContent#'+id).css({display:"block"});
	},
	renderSummary:function() {
		var ins='';
		ins+="<button type='button' onclick='strategy.show(\"details\")' class='add'>edit</button><h4 style='margin-top:2px'>"+this.value.customer[this.display.customer].name+"</h4>";
		ins+="<div class='updated'><em>Updated: <span class='ago' rel='"+this.value.customer[this.display.customer].updated+"'>"+this.ago(this.value.customer[this.display.customer].updated)+"</span></em></div>";
		for(var i=0;i<this.value.customer[this.display.customer].details.length;i++) {
			ins+="<div><label>"+this.value.customer[this.display.customer].details[i].title+": </label><div class='detailSummary'>"+this.renderDetail(this.value.customer[this.display.customer].details[i])+"</div></div>";
		}
		return ins;
	},
	renderDetail:function(d) {
		switch(d.type) {
			case "url":
				var val=d.value;
				if (!(/:\/\//.test(this.value))) val='http://'+val;
				return "<a href='"+val+"' target='_blank'>"+this.safe(d.value.replace(/^.*\:\/\//,''))+"</a>";
			break;
			case "email":
			
				return "<a href='mailto:"+d.value+"' target='_blank'>"+this.safe(d.value)+"</a>";
			break;
			default:
				return this.safe(d.value);
			break;
		}				
	},
	updateTimestamps:function() {
		var s=$(this.containers.container).find('span.ago').get();
		if(s.length>0) {
			for(var i=0;i<s.length;i++) {
				var t=$(s[i]).attr("rel")*1;
				$(s[i]).html(this.ago(t));
			}
		}
		setTimeout('if(strategy!=undefined) strategy.updateTimestamps();',10000);
	},
	ago:function(t) {
		if (t==0) return '';
		var r='';
		var d=new Date().getTime()-t;
		var minutes=Math.floor(d/(1000*60));
		var hours=Math.floor(minutes/60);
		var days=Math.floor(hours/24);
		var weeks=Math.floor(days/7);
		if(weeks>=1) {
			if(weeks==1) {
				r="over a week ago";
			}else{
				r="over "+weeks+" weeks ago";
			}
		}else if(days>=1) {
			if(days==1) {
				r="over a day ago";
			}else{
				r="over "+days+" days ago";
			}
		}else if(hours>=1) {
			if(hours==1) {
				r="over an hour ago";
			}else{
				r="over "+hours+" hours ago";
			}
		}else if(minutes>=1) {
			if(minutes==1) {
				r="a minute ago";
			}else{
				r=""+minutes+" minutes ago";
			}
		}else{
			r="less than a minute ago";
		}
		return r;
	},
	renderDetails:function() {
		var ins='';
		ins+="<h4 style='margin-top:2px'>"+this.value.customer[this.display.customer].name+"</h4>";
		ins+="<div><label>Name</label><input type='text' class='customerName' value=\""+this.inputsafe(this.value.customer[this.display.customer].name)+"\"/></div>";
		//ins+="<div>Updated: <span class='ago' rel='"+this.value.customer[this.display.customer].updated+"'>"+this.ago(this.value.customer[this.display.customer].updated)+"</span></div>";
		for(var i=0;i<this.value.customer[this.display.customer].details.length;i++) {
			ins+="<div class='detail' style='margin-top:10px;'>"+this.renderDetailEditor(this.value.customer[this.display.customer].details[i])+"</div>";
		}
		ins+="<button type='button' onclick='strategy.addDetail()' class='add'>Add detail</button>";
		ins+=" <button type='button' onclick='strategy.show(\"summary\")'>Return to summary</button>";
		return ins;
	},
	renderDetailEditor:function(d) {
		switch(d.type) {
			case "url":
				return "<label>"+d.title+"</label> <button type='button' onclick='strategy.removeDetail(this.parentNode)'>X</button><input type='text' class='url' value=\""+this.inputsafe(d.value)+"\" />";
			break;
			case "email":
				return "<label>"+d.title+"</label> <button type='button' onclick='strategy.removeDetail(this.parentNode)'>X</button><input type='text' class='email' value=\""+this.inputsafe(d.value)+"\" />";
			break;
			case "textarea":
				return "<label>"+d.title+"</label> <button type='button' onclick='strategy.removeDetail(this.parentNode)'>X</button><textarea rows=3>"+d.value+"</textarea>";
			break;
			case "datetime":
				return "<label>"+d.title+"</label> <button type='button' onclick='strategy.removeDetail(this.parentNode)'>X</button><input type='text' class='datetime' value=\""+this.inputsafe(d.value)+"\" />";
			break;
			default:
				return "<label>"+d.title+"</label> <button type='button' onclick='strategy.removeDetail(this.parentNode)'>X</button><input type='text' class='' value=\""+this.inputsafe(d.value)+"\" />";
			break;
		}				
	},
	removeDetail:function(o) {
		var i=$(o).prevAll(".detail").get().length;
		this.value.customer[this.display.customer].details.splice(i,1);
		$(strategy.containers.rightPanel).find(".tabContent#summary").html(strategy.renderSummary());
		$(strategy.containers.rightPanel).find(".tabContent#details").html(strategy.renderDetails());
	},
	addDetail:function() {
		var tar=$(this.containers.rightPanel).find('.tabContent#details').get(0);
			var ins='<div>New detail...</div><label><input type="text" /></label><select>';
			ins+="<option selected=true>text</option><option>url</option><option>email</option><option>textarea</option>";
			ins+="</select>";
			ins+="<div style='clear:both'><button type='button' class='save'>save</button><button type='button' class='cancel'>cancel</button></div>";
			ins+="<div style='clear:both'></div>";
			var div=document.createElement("DIV");
			$(div).addClass("newDetailBox");
			$(div).css("display","none");
			$(div).html(ins);
			var addButton=$('#details').find("button.add").get(0);
			$(addButton).fadeOut();
			addButton.parentNode.insertBefore(div,addButton);
			$(div).slideDown();
			$(tar).find("button.save").bind("click",function() {
				var tar=$(strategy.containers.rightPanel).find('.tabContent#details').get(0);
				var ip=$(strategy.containers.rightPanel).find(".tabContent#details .newDetailBox input").val();
				if (ip!='') {
					var t=$(strategy.containers.rightPanel).find(".tabContent#details .newDetailBox select").val();
					strategy.value.customer[strategy.display.customer].details.push({title:ip,type:t,value:''});
					$(strategy.containers.rightPanel).find('.newDetailBox').slideUp(500,function() {
						$(this).remove();
						$(strategy.containers.rightPanel).find('.tabContent#details').html(strategy.renderDetails());
						strategy.setDetailsEvents();
						$(strategy.containers.rightPanel).find(".tabContent#summary").html(strategy.renderSummary());
					});
				}
			});
			$(tar).find("button.cancel").bind("click",function() {
				$(strategy.containers.rightPanel).find('.newDetailBox').slideUp(500,function() {$(this).remove();});
				$('#details').find("button.add").fadeIn();
			});
			
		//});
	},
	historyItems:function() {
		var items=[];
		for(var h=0;h<this.value.customer[this.display.customer].history.length;h++) items.push(this.value.customer[this.display.customer].history[h]);
		for(var c=0;c<this.value.checklist.length;c++) {
			if(this.value.customer[this.display.customer].checklist[this.value.checklist[c].id]==undefined) this.value.customer[this.display.customer].checklist[this.value.checklist[c].id]={when:0,value:false};
			var checked=this.value.customer[this.display.customer].checklist[this.value.checklist[c].id].value;
			if (checked) {
				var item=this.value.checklist[c];
				item.when=this.value.customer[this.display.customer].checklist[this.value.checklist[c].id].when;
				item.date=inputs.formatDate('jS F Y',new Date(this.value.customer[this.display.customer].checklist[this.value.checklist[c].id].when));
				items.push(item);
			}
		}
		items.sort(function(a,b){return a.when-b.when;});
		items.reverse();
		return items;
	},
	updateActionHistory:function() {
		var update=false;
		if (arguments.length>0) update=arguments[0];
		var items=this.historyItems();
		var ins='';
		ins+="<button type='button' onclick='strategy.historyAdded()' class='add'>+ add</button>";
		ins+="<div style='clear:both'></div>";
		ins+="<div class='historical'><div class='date'><div>Date</div></div><div class='content'><div>Action</div></div></div>";
		for(var h=0;h<items.length;h++) {
			ins+="<div class='historical"+((items[h].value!=undefined)?' note':' checked')+((h % 2 == 1)?" odd":" even")+"'>";
			ins+="<div class='date'><div>"+items[h].date+"</div></div>";
			ins+="<div class='content'><div>";
			if (items[h].value!=undefined) ins+="<button type='button' class='delete' onclick='strategy.deleteHistory(this)'>X</button>";
			if (items[h].title!=undefined) ins+="<div>"+items[h].title+"</div>";
			if (items[h].description!=undefined) ins+="<div class='description'>"+items[h].description+"</div>";
			if (items[h].value!=undefined) ins+="<div>"+items[h].value+"</div>";
			ins+="</div></div>";
			ins+="</div>";
		}
		if (update) {
			$('#actionHistory').html(ins);
		}else{
			return ins;
		}
	},
	renderHistory:function() {
		var ins='';
		ins+="<h4 style='margin-top:2px'>"+this.value.customer[this.display.customer].name+"</h4>";
		this.value.customer[this.display.customer].history.sort(function(a,b) {return a.when-b.when;});
		ins+="<div class='historyList'>";
		ins+="<div id='actionHistory'>";
		ins+=this.updateActionHistory();
		ins+="</div>";
		ins+="</div>";
		ins+="<div id='historyAdd' style='display:none'>";
		ins+="<button type='button' onclick='strategy.closeHistoryAdded()' class='close'>Return to history</button>";
		ins+="<div style='clear:both'></div>";
		ins+="<div class='eventAdder'><center><b>Either add an event here...</b></center><div style='overflow:auto'><label>When: </label><input type='text' class='date' /><label>Note:</label><textarea></textarea><button type='button' style='margin:5px auto' class='add' onclick='strategy.addHistorical(this.parentNode)'>+ add</button></div></div>";
		ins+=this.renderChecker();
		ins+="<button type='button' onclick='strategy.closeHistoryAdded()' class='close'>Return to history</button>";
		ins+="</div>";
		return ins;
	},
	historyAdded:function() {
		$(this.containers.container).find('#actionHistory').slideUp();
		$(this.containers.container).find('#historyAdd').slideDown();
	},
	closeHistoryAdded:function() {
		$(this.containers.container).find('#actionHistory').slideDown();
		$(this.containers.container).find('#historyAdd').slideUp();
	},
	deleteHistory:function(o) {
		var i=$(o.parentNode).prevAll('.historical').get().length;
		this.value.customer[this.display.customer].history.splice(i,1);
		$(o.parentNode).slideUp(500,function() {$(this).remove();});
	},
	addHistorical:function(o) {
		var d=$(o).find("input.date").get(0).date.getTime();
		var fd=$(o).find("input.date").val();
		var t=$(o).find("textarea").val().replace(/\n/g,'<br />');
		this.value.customer[this.display.customer].history.push({when:d,date:fd,value:t});
		$(this.containers.rightPanel).find("#history").html(this.renderHistory());
		this.historyEvents();
		this.closeHistoryAdded();
	},
	historyEvents:function() {
		inputs.date($("#history input.date").get(),{formatdisplay:'jS F Y',formatoutput:'jS F Y',formatinput:'jS F Y'});

		$(this.containers.rightPanel).find('#checklist .checker').bind("click",function() {
			if (strategy.value.customer[strategy.display.customer].checklist[this.id]==undefined) {
				strategy.value.customer[strategy.display.customer].checklist[this.id]={when:new Date().getTime(),value:true};
			}else{
				strategy.value.customer[strategy.display.customer].checklist[this.id].value=!strategy.value.customer[strategy.display.customer].checklist[this.id].value;
				if (strategy.value.customer[strategy.display.customer].checklist[this.id].value) {
					strategy.value.customer[strategy.display.customer].checklist[this.id].when=new Date().getTime();
				}else{
					strategy.value.customer[strategy.display.customer].checklist[this.id].when=0;
				}
			}
			var span=$(this).find("span");
			if (strategy.value.customer[strategy.display.customer].checklist[this.id].value) {
				span.html(strategy.ago(strategy.value.customer[strategy.display.customer].checklist[this.id].when));
				span.attr("rel",strategy.value.customer[strategy.display.customer].checklist[this.id].when);
				span.addClass("ago");
			}else{
				span.html('');
				span.attr("rel",strategy.value.customer[strategy.display.customer].checklist[this.id].when);
				span.removeClass("ago");
			}
			if (strategy.value.customer[strategy.display.customer].checklist[this.id].value) {
				$(this).addClass("on");
			}else{
				$(this).removeClass("on");
			}
			strategy.updateActionHistory(true);
		});
	},
	renderChecker:function() {
		var ins='';
		//ins+="<h4 style='margin-top:2px'>"+this.value.customer[this.display.customer].name+"</h4>";
		for(var c=0;c<this.value.checklist.length;c++) {
			if(this.value.customer[this.display.customer].checklist[this.value.checklist[c].id]==undefined) this.value.customer[this.display.customer].checklist[this.value.checklist[c].id]={when:0,value:false};
			var checked=this.value.customer[this.display.customer].checklist[this.value.checklist[c].id].value;
			ins+="<div class='checker"+(checked?' on':'')+"' id='"+this.value.checklist[c].id+"'>";
			ins+="<span class='"+(checked?"ago":"")+"' rel='"+this.value.customer[this.display.customer].checklist[this.value.checklist[c].id].when+"'>"+this.ago(this.value.customer[this.display.customer].checklist[this.value.checklist[c].id].when)+"</span>";
			ins+=this.value.checklist[c].title.replace(/\</g,'&lt;').replace(/\>/g,'&gt;');
			ins+="<div class='checkDescription'>"+this.value.checklist[c].description.replace(/\</g,'&lt;').replace(/\>/g,'&gt;')+"</div>";
			ins+="</div>";
		}
		return "<div id='checklist'><center><b>...or tick checklist items here.</b></center>"+ins+"</div>";
	},
	renderCustomers:function() {
		var ins='';
		ins+="<button type='button' onclick='strategy.addCustomer()' class='add'>+ new</button>";
		ins+="<div style='clear:both'></div>";
		this.value.customer.sort(function(a,b){return a.updated-b.updated;});
		this.value.customer.reverse();
		if(this.display.customer>=this.value.customer.length) this.display.customer=this.value.customer.length-1;
		for(var c=0;c<this.value.customer.length;c++) {
			ins+="<div class='item"+((this.display.customer==c)?" on":"")+"' ><button type='button' class='delete' onclick='strategy.deleteCustomer(this)'>X</button><a href='javascript:strategy.selectCustomer("+c+")'>"+this.value.customer[c].name+"</a></div>";
		}
		return ins;
	},
	deleteCustomer:function(o) {
		var i=$(o.parentNode).prevAll('.item').get().length;
		if(window.confirm("Delete "+this.value.customer[i].name+"?")) {
			this.value.customer.splice(i,1);
			$(o.parentNode).slideUp(500,function() {
				$(this).remove();
				if(strategy.value.customer.length==0) {
					strategy.addCustomer();
				}else{
					strategy.renderLeft();
					strategy.renderRight();
				}
			});
		}
	},
	addCustomer:function() {
		this.value.customer.unshift(this.emptyCustomer());
		this.display.right='details';
		this.display.customer=0;
		this.renderLeft();
		this.renderRight();
	},
	selectCustomer:function(i) {
		this.display.customer=i;
		this.renderLeft();
		this.renderRight();
	},
	editingChecklistItem:null,
	editingChecklistItemLink:null,
	editChecklist:function(i,o) {
		this.editingChecklistItem=i;
		this.editingChecklistItemLink=o;
		this.checkListEditor(o);
		//$('.checklistEdit input[type=text]').val(this.value.checklist[i].title);
		//$('.checklistEdit textarea').val(this.value.checklist[i].description);
		//$('.checklistAdd').slideUp();
		//$('.checklistEdit').slideDown();
	},
	checkListEditor:function(o) {
		if (!$(o.parentNode).hasClass("editing")){
			this.clearChecklistEditor();
			var div=document.createElement("DIV");
			$(div).addClass("checkEditor");
			$(div).css("display","none");
			$(o.parentNode).addClass("editing");
			var ins="<label>Name: </label><input type='text' value='' />";
			ins+="<label>Description: </label><textarea></textarea>";
			ins+="<button type='button' class='save'>save</button>";
			ins+="<button type='button' class='cancel'>cancel</button>";
			ins+="<div style='clear:both'></div>";
			$(div).html(ins);
			$(div).find("input[type=text]").val(this.value.checklist[this.editingChecklistItem].title).bind("keydown",function(e) {
				var key=yoodoo.keyCode(e);
				if (key.alpha || key.numeric || key.space || key.navigate) {
				}else{
					e.preventDefault();
					return false;
				}
			});
			$(div).find("textarea").val(this.value.checklist[this.editingChecklistItem].description);
			$(div).find("button.save").bind("click",function() {
				strategy.value.checklist[strategy.editingChecklistItem].title=$(this.parentNode).find("input[type=text]").val();
				strategy.value.checklist[strategy.editingChecklistItem].description=$(this.parentNode).find("textarea").val();
				$(strategy.editingChecklistItemLink).html(strategy.value.checklist[strategy.editingChecklistItem].title);
				strategy.clearChecklistEditor();
			});
			$(div).find("button.cancel").bind("click",function() {
				strategy.clearChecklistEditor();
			});
			o.parentNode.appendChild(div);
			$(div).slideDown(500,function() {
				var st=($(this).offset().top+$(this).outerHeight()) - ($('#yoodooScrolledArea').offset().top+$('#yoodooScrolledArea').outerHeight());
				if (st>0) $('#yoodooScrolledArea').animate({scrollTop:'+'+st});
			});
		}else{
			this.clearChecklistEditor();
		}
	},
	clearChecklistEditor:function() {
		$('.leftPanel #checklist .item.editing').each(function(i,e) {
			$(e).removeClass("editing");
			$(e).find('.checkEditor').slideUp(500,function(){$(this).remove();});
		});
		$(this.containers.rightPanel).find("#history").html(this.renderHistory());

		this.historyEvents();
	},
	cancelChecklist:function() {
		$('.checklistAdd').slideDown();
		$('.checklistEdit').slideUp();
	},
	saveToChecklist:function() {
		this.value.checklist[this.editingChecklistItem].title='New checklist item';
		this.value.checklist[this.editingChecklistItem].description='Empty description';
		$('.checklistEdit').slideUp(function() {
			$('.checklistAdd').slideDown(function() {
				$('#checklist').html(strategy.renderChecklist());
				strategy.renderRight();
			});
		});
	},
	renderChecklist:function() {
		var ins="<button type='button' class='add' onclick='strategy.addToChecklist()'>+ add</button>";
		for(var c=0;c<this.value.checklist.length;c++) {
			ins+="<div class='item' id='"+c+"'><button type='button' class='delete' onclick='strategy.removeFromChecklist(this.parentNode)'>X</button><span class='move'></span><a href='javascript:void(0)' onclick='strategy.editChecklist("+c+",this)'>"+this.value.checklist[c].title+"</a></div>";
		}
		return ins;
	},
	addToChecklist:function() {
		var t='New checklist item';
		var d='Empty description';
		this.value.checklist.push({title:t,description:d,id:this.uniqueid()});
		this.renderLeft();
		this.renderRight();
		var item=$('.leftPanel .item').get(-1);
		this.editChecklist(item.id,$(item).find("a").get(0));
	},
	removeFromChecklist:function(o) {
		var i=$(o).prevAll('.item').get().length;
		this.value.checklist.splice(i,1);
		$(o).slideUp(500,function(){
			strategy.renderLeft();
			strategy.renderRight();
		});
	},
	reordered:function() {
		var list=[];
		var items=$(this.containers.leftPanel).find('#checklist .item').get();
		for(var i=0;i<items.length;i++) {
			list.push({title:this.value.checklist[items[i].id].title,description:this.value.checklist[items[i].id].description,id:this.value.checklist[items[i].id].id});
			items[i].id=i;
		}
		this.value.checklist=list;
		this.renderRight();
	},
	uniqueid:function() {
		var id=this.randomid();
		var ids={};
		for(var i=0;i<this.value.checklist.length;i++) {
			ids[this.value.checklist[i].id]=true;
		}
		while(ids[id]!=undefined) {
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
