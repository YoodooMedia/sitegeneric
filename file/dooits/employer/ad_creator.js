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
	</script>

*/



dooit.temporaries('adcreator');
var adcreator={
	selectors:{
		container:'.adcreator'
	},
	containers:{
		container:null,
		left:{
			main:null,
			tabs:null,
			content:null
		},
		right:{
			main:null,
			tabs:null,
			content:null,
			blockout:null
		}
	},
	selection:{
		left:null,
		right:null,
		job:0
	},
	tabs:{
		left:{
			'Job ads':{
				button:null,
				container:null,
				layout:'drawAds'
			},
			'Snippets':{
				button:null,
				container:null,
				layout:'drawSnippets'
			}
		},
		right:{
			'Basics':{
				button:null,
				container:null,
				layout:'drawBasics',
				fields:{
					title:{title:'Job title',type:'text'},
					reference:{title:'Job Ref.',type:'text'},
					company:{title:'Company',type:'text'},
					salary:{title:'Salary',type:'decimal'},
					location:{title:'Location',type:'text'},
					hours:{title:'Hours',type:'adcreator.hours'},
					type:{title:'Type',type:'adcreator.types'}
				}
			},
			'Details':{
				button:null,
				container:null,
				layout:'drawDetails',
				fields:{
					outline:{title:'Job outline',type:'textarea'},
					responsibilities:{title:'Responsibilities',type:'textarea'},
					skills:{title:'Required skills',type:'textarea'}
				}
			},
			'Edit and polish':{
				button:null,
				container:null,
				layout:'drawEdit'
			},
			'Export':{
				button:null,
				container:null,
				layout:'drawExport'
			}
		}
	},
	value:null,
	key:null,
	fields:{},
	init:function() {
		if (arguments.length>0) this.transposeOptions([],arguments[0]);
		this.loadFields();
		this.containers.container=$(this.selectors.container).get(0);
		if (this.key!==null && this.containers.container!==null) {
			// start rendering the dooit
			if (dooittitle!="") $(this.containers.container).html('<h2>'+dooittitle+'</h2>');
			this.containers.left.main=document.createElement("div");
			$(this.containers.left.main).addClass("leftBlock tabSection");
			this.containers.left.tabs=document.createElement("ul");
			$(this.containers.left.tabs).addClass("tabs");
			this.containers.left.content=document.createElement("div");
			$(this.containers.left.content).addClass("tabContent");
			this.containers.left.main.appendChild(this.containers.left.tabs);
			this.containers.left.main.appendChild(this.containers.left.content);
			this.containers.right.main=document.createElement("div");
			$(this.containers.right.main).addClass("rightBlock tabSection");
			this.containers.right.tabs=document.createElement("ul");
			$(this.containers.right.tabs).addClass("tabs");
			this.containers.right.content=document.createElement("div");
			$(this.containers.right.content).addClass("tabContent");
			this.containers.right.main.appendChild(this.containers.right.tabs);
			this.containers.right.main.appendChild(this.containers.right.content);
			this.containers.right.blockout=document.createElement("div");
			$(this.containers.right.blockout).addClass("adblockout");
			this.containers.right.main.appendChild(this.containers.right.blockout);

			this.containers.container.appendChild(this.containers.right.main);
			this.containers.container.appendChild(this.containers.left.main);
			
			this.validateData();

			this.drawTabs('left');
			this.drawTabs('right');
			var maxh=$('#yoodooScrolledArea').height()-8;
			var contentTop=$(this.containers.right.content).offset().top-$(this.containers.container).offset().top;
			var contentHeight=maxh-contentTop-22;
			$(this.containers.right.content).css({overflow:"auto","max-height":contentHeight+"px"});
			$(this.containers.left.content).css({overflow:"auto","max-height":contentHeight+"px"});


			this[this.tabs.left[this.selection.left].layout]();
			this[this.tabs.right[this.selection.right].layout]();
		}
	},
	setJob:function(i) {
		if (i>=this.selection.job.length) i=this.selection.job.length-1;
		this.selection.job=i;
		this[this.tabs.left[this.selection.left].layout]();
		this[this.tabs.right[this.selection.right].layout]();
	},
	validateData:function() {
		if (this.value===null || typeof(this.value)=="string") this.value={};
		if (this.value.jobs==undefined) this.value.jobs=[this.blankJob()];
		if (this.value.snippets==undefined) this.value.snippets=this.defaultSnippets();
	},
	blankJob:function() {
		return {basics:{name:'',title:'',reference:'',company:'',salary:'',location:'',hours:'',type:''},details:{outline:'We are looking for ',responsibilities:'Responsibilities will include:\n- ',skills:'The successful candidate will have\n- '},changed:false,text:''};
	},
	defaultSnippets:function() {
		return [
			'Contact ME on 0123456789 or me@mycompany.com',
			'Post-graduates only.',
			'Private Healthcare and pension scheme.'
		];
	},
	addJob:function() {
		this.value.jobs.push(this.blankJob());
		this.selection.job=this.value.jobs.length-1;
		$(this.tabs.left['Job ads'].container).find('.jobButton.on').removeClass('on');
		var newAd=this.adButton(this.selection.job);
		$(newAd).css("display","none");
		$(newAd).addClass('on');
		this.tabs.left['Job ads'].container.appendChild(newAd);
		$(newAd).slideDown();
		adcreator[adcreator.tabs.right[adcreator.selection.right].layout]();
	},
	drawTabs:function(side) {
		for(var key in this.tabs[side]) {
			if (this.tabs[side][key].container===null) {
				this.tabs[side][key].container=document.createElement("div");
				$(this.tabs[side][key].container).css("display","none");
				this.containers[side].content.appendChild(this.tabs[side][key].container);
			}
			if (this.selection[side]===null) this.selection[side]=key;
			this.tabs[side].button=document.createElement("li");
			$(this.tabs[side].button).html(key);
			if (this.selection[side]==key) $(this.tabs[side].button).addClass("on");
			this.tabs[side].button.side=side;
			this.tabs[side].button.key=key;
			this.containers[side].tabs.appendChild(this.tabs[side].button);
			$(this.tabs[side].button).bind("click", function () {
				if(!$(this).hasClass("on")) {
					$(this).siblings(".on").removeClass("on");
					$(this).addClass("on");
					if (adcreator.selection[this.side]!=null) {
						$(adcreator.tabs[this.side][adcreator.selection[this.side]].container).slideUp(500,function() {$(this).html("");});
						//adcreator[adcreator.tabs[this.side][this.key].layout]();
						setTimeout('adcreator[adcreator.tabs["'+this.side+'"]["'+this.key+'"].layout]();',400);
					}else{
						adcreator[adcreator.tabs[this.side][this.key].layout]();
					}
					adcreator.selection[this.side]=this.key;
				}
			});
		}
	},
	drawAds:function() {
		$(this.containers.right.blockout).css("display","none");
		while(this.tabs.left['Job ads'].container.childNodes.length>0) $(this.tabs.left['Job ads'].container.childNodes[0]).remove();
		var addButton=document.createElement("button");
		$(addButton).addClass("add");
		$(addButton).html("+ new");
		$(addButton).bind("click",function() {
			adcreator.addJob();
		});
		this.tabs.left['Job ads'].container.appendChild(addButton);
		for(var j=0;j<this.value.jobs.length;j++) {
			var but=this.adButton(j);
			if (this.selection.job==j) $(but).addClass("on");
			this.tabs.left['Job ads'].container.appendChild(but);
		}
		if ($(this.tabs.left['Job ads'].container).css("display")=="none") $(this.tabs.left['Job ads'].container).slideDown();
	},
	adButton:function(j) {
		var jobButtonContainer=document.createElement("div");
		$(jobButtonContainer).addClass("jobButton");
		var jobButtonDelete=document.createElement("button");
		jobButtonDelete.type='button';
		$(jobButtonDelete).addClass("jobButtonDelete");
		$(jobButtonDelete).html("delete");
		jobButtonContainer.appendChild(jobButtonDelete);
		var jobButton=document.createElement("button");
		$(jobButton).addClass("jobButtonSelect");
		jobButton.type='button';
		if (j==this.selection.job) $(jobButton).addClass("on");
		$(jobButton).html(this.truncateText((this.value.jobs[j].basics.name=='')?'untitled':this.value.jobs[j].basics.name,30));
		jobButtonContainer.appendChild(jobButton);
		jobButton.title='Right click to rename';
		$(jobButton).bind("contextmenu",function(e) {
			$(this.parentNode.parentNode).find('.namer').each(function(i,e) {
				$(e).next('.jobButton').css("display","block");
				$(e).remove();
			});
			var i=$(this.parentNode).prevAll(".jobButton").get().length;
			e.preventDefault();
			var namer=document.createElement("div");
			$(namer).addClass("namer");
			//$(namer).css({height:$(this).outerHeight()});
			$(namer).html("<input type='text' value='"+adcreator.value.jobs[i].basics.name+"' />");
			this.parentNode.parentNode.insertBefore(namer,this.parentNode);
			$(this.parentNode).css("display","none");
			$(namer).find("input").bind("blur",function(e) {
				$(this.parentNode).next('.jobButton').css("display","block");
				e.preventDefault();
				$(this.parentNode).remove();
			});
			$(namer).find("input").bind("keydown",function(e) {
				var key=yoodoo.keyCode(e);
				if (key.enter || key.escape) {
					$(this.parentNode).next('.jobButton').css("display","block");
					e.preventDefault();
					$(this.parentNode).remove();
				} 
				if (!key.alpha && !key.space && !key.numeric && !key.navigate) {
					e.preventDefault();
				}
			});
			$(namer).find("input").bind("keyup",function(e) {
				var i=$(this.parentNode).prevAll(".jobButton").get().length;
				adcreator.value.jobs[i].basics.name=$(this).val();
				$(this.parentNode).next('.jobButton').find('.jobButtonSelect').html(adcreator.truncateText((adcreator.value.jobs[i].basics.name=='')?'untitled':this.value.jobs[i].basics.name,30));
			});
			$(namer).find("input").get(0).focus();
		});
		$(jobButton).bind("click",function() {
			if (!$(this.parentNode).hasClass("on")) {
				$(this.parentNode.parentNode).find('.namer').each(function(i,e) {
					$(e).next('.jobButton').css("display","block");
					$(e).remove();
				});
				$(this.parentNode).siblings(".on").removeClass("on");
				$(this.parentNode).addClass("on");
				adcreator.selection.job=$(this.parentNode).prevAll(".jobButton").get().length;
				adcreator[adcreator.tabs.right[adcreator.selection.right].layout]();
			}
		});
		$(jobButtonDelete).bind("click",function() {
			var i=$(this.parentNode).prevAll(".jobButton").get().length;
			if(window.confirm("Delete "+adcreator.value.jobs[i].basics.title)) {
				$(this.parentNode).slideUp(function() {$(this).remove();});
				adcreator.value.jobs.splice(i,1);
				if (adcreator.value.jobs.length==0) {
					adcreator.addJob();
				}else{
					if (adcreator.selection.job>adcreator.value.jobs.length) {
						adcreator.selection.job--;
					}
				}
				if (adcreator.selection.job>=adcreator.value.jobs.length) adcreator.selection.job=adcreator.value.jobs.length-1;
				if (adcreator.selection.job<0) adcreator.selection.job=0;
				adcreator[adcreator.tabs.right[adcreator.selection.right].layout]();
			}
		});
		return jobButtonContainer;
	},
	snippetButton:function(j) {
		var snippetButtonContainer=document.createElement("div");
		$(snippetButtonContainer).addClass("snippetButton");
		var snippetButtonDelete=document.createElement("button");
		snippetButtonDelete.type='button';
		$(snippetButtonDelete).addClass("snippetButtonDelete");
		$(snippetButtonDelete).html("delete");
		snippetButtonContainer.appendChild(snippetButtonDelete);
		var snippetButton=document.createElement("button");
		$(snippetButton).addClass("snippetButtonSelect");
		snippetButton.type='button';
		$(snippetButton).html((this.value.snippets[j]=='')?'empty snippet':this.value.snippets[j]);
		snippetButtonContainer.appendChild(snippetButton);
		$(snippetButton).bind("click",function() {
			adcreator.closeSnippet();
			adcreator.editSnippet(this.parentNode);
		});
		$(snippetButtonDelete).bind("click",function() {
			var i=$(this.parentNode).prevAll(".snippetButton").get().length;
			if(window.confirm("Delete "+adcreator.value.snippets[i])) {
				$(this.parentNode).slideUp(function() {$(this).remove();});
				adcreator.value.snippets.splice(i,1);
				if (adcreator.value.snippets.length==0) {
					adcreator.addSnippet();
				}
			}
		});
		return snippetButtonContainer;
	},
	editSnippet:function(o) {
		var i=$(o).prevAll(".snippetButton").get().length;
		$(o).addClass("editingSnippetHide");
		var editor=document.createElement("div");
		$(editor).addClass("editingSnippet");
		$(editor).css("display","none");
		var ta=document.createElement("textarea");
		$(ta).val(this.value.snippets[i]);
		editor.appendChild(ta);
		var close=document.createElement("button");
		close.type="button";
		$(close).html("done");
		editor.appendChild(close);
		$(close).bind("click",function() {
			adcreator.closeSnippet();
		});
		$(ta).bind("blur",function() {
			adcreator.closeSnippet();
		});
		$(ta).bind("keyup change",function() {
			var s=$(this.parentNode).prevAll('.snippetButton').get().length;
			adcreator.value.snippets[s]=$(this).val();
			$(this.parentNode).next('.snippetButton').find('button.snippetButtonSelect').html(($(this).val()=='')?'empty snippet':$(this).val());
		});
		o.parentNode.insertBefore(editor,o);
		$(o).slideUp();
		$(editor).slideDown();
	},
	closeSnippet:function() {
		$(this.tabs.left['Snippets'].container).find('.editingSnippetHide').slideDown(function() {$(this).removeClass("");});
		$(this.tabs.left['Snippets'].container).find('.editingSnippet').slideUp(function() {$(this).remove();});		
	},
	drawSnippets:function() {
		$(this.containers.right.blockout).css("display","block");
		while(this.tabs.left['Snippets'].container.childNodes.length>0) $(this.tabs.left['Snippets'].container.childNodes[0]).remove();
		//var ins=document.createElement("div");
		var add=document.createElement("button");
		add.type="button";
		$(add).html("+ new");
		$(add).addClass("add");
		$(add).bind("click",function() {
			adcreator.value.snippets.push('');
			var newSnippet=adcreator.snippetButton(adcreator.value.snippets.length-1);
			$(newSnippet).css("display","none");
			adcreator.tabs.left['Snippets'].container.appendChild(newSnippet);
			$(newSnippet).slideDown(function() {
				adcreator.closeSnippet();
				adcreator.editSnippet(this);
			});
		});
		this.tabs.left['Snippets'].container.appendChild(add);
		for(var s=0;s<this.value.snippets.length;s++) {
			this.tabs.left['Snippets'].container.appendChild(this.snippetButton(s));
		}
		if ($(this.tabs.left['Snippets'].container).css("display")=="none") $(this.tabs.left['Snippets'].container).slideDown();
	},
	drawBasics:function() {
		while(this.tabs.right['Basics'].container.childNodes.length>0) $(this.tabs.right['Basics'].container.childNodes[0]).remove();
		var ins=document.createElement("div");
		var job=this.value.jobs[this.selection.job];
		$(ins).html("<em>Blank entries will not be shown</em>");
		for(var k in this.tabs.right.Basics.fields) {
			var field=document.createElement("div");
			$(field).html('<label>'+this.tabs.right.Basics.fields[k].title+'</label>');
			var ip=null;
			switch(this.tabs.right.Basics.fields[k].type) {
				case "text":
					ip=document.createElement("input");
					ip.type="text";
					ip.value=job.basics[k];
					ip.field=k;
					break;
				case "decimal":
					ip=document.createElement("input");
					ip.type="text";
					ip.value=job.basics[k];
					ip.field=k;
					break;
				default:
					eval('ip='+this.tabs.right.Basics.fields[k].type+'("'+k+'",job.basics[k]);');
					break;
			}
			if (ip!==null) $(field).find('label').get(0).appendChild(ip);
			ins.appendChild(field);
		}
		$(ins).find('input,select').bind("change keyup",function(e) {
			if (this.field=="title") {
				if (adcreator.value.jobs[adcreator.selection.job].basics.title==adcreator.value.jobs[adcreator.selection.job].basics.name || adcreator.value.jobs[adcreator.selection.job].basics.name=='') {
					$($(adcreator.tabs.left['Job ads'].container).find('button.jobButtonSelect').get(adcreator.selection.job)).html(adcreator.truncateText($(this).val(),30));
					adcreator.value.jobs[adcreator.selection.job].basics.name=$(this).val();
				}
			}
			adcreator.value.jobs[adcreator.selection.job].basics[this.field]=$(this).val();
			adcreator.value.jobs[adcreator.selection.job].changed=true;
		});
		this.tabs.right['Basics'].container.appendChild(ins);
		if ($(this.tabs.right['Basics'].container).css("display")=="none") $(this.tabs.right['Basics'].container).slideDown();
	},
	drawDetails:function() {
		while(this.tabs.right['Details'].container.childNodes.length>0) $(this.tabs.right['Details'].container.childNodes[0]).remove();
		var ins=document.createElement("div");
		var job=this.value.jobs[this.selection.job];
		for(var k in this.tabs.right.Details.fields) {
			var field=document.createElement("div");
			$(field).html('<label>'+this.tabs.right.Details.fields[k].title+'</label>');
			var ip=null;
			switch(this.tabs.right.Details.fields[k].type) {
				case "textarea":
					ip=document.createElement("textarea");
					ip.value=job.details[k];
					ip.field=k;
					break;
				case "text":
					ip=document.createElement("input");
					ip.type="text";
					ip.value=job.details[k];
					ip.field=k;
					break;
				case "decimal":
					ip=document.createElement("input");
					ip.type="text";
					ip.value=job.details[k];
					ip.field=k;
					break;
				default:
					eval('ip='+this.tabs.right.Details.fields[k].type+'("'+k+'",job.details[k]);');
					break;
			}
			if (ip!==null) $(field).find('label').get(0).appendChild(ip);
			ins.appendChild(field);
		}
		$(ins).find('input,select,textarea').bind("change keyup",function(e) {
			adcreator.value.jobs[adcreator.selection.job].changed=true;
			adcreator.value.jobs[adcreator.selection.job].details[this.field]=$(this).val();
		});
		this.tabs.right['Details'].container.appendChild(ins);
		if ($(this.tabs.right['Details'].container).css("display")=="none") $(this.tabs.right['Details'].container).slideDown();
	},
	drawEdit:function() {
		while(this.tabs.right['Edit and polish'].container.childNodes.length>0) $(this.tabs.right['Edit and polish'].container.childNodes[0]).remove();
		var ins=document.createElement("div");
		$(ins).html("<em>Edit the full text here. Insert a snippet by clicking the cursor in the location required, then select one from the dropdown below.</em>");
		if (this.value.jobs[adcreator.selection.job].text=="") this.buildText();
		if (this.value.jobs[adcreator.selection.job].changed) {
			var but=document.createElement("button");
			but.type='text';
			$(but).addClass("add");
			$(but).html("Things have changed... Rebuild?");
			ins.appendChild(but);
			$(but).bind("click",function() {
				adcreator.buildText();
				$(adcreator.tabs.right['Edit and polish'].container).find("textarea").val(adcreator.value.jobs[adcreator.selection.job].text);
				$(this).slideUp(function(){$(this).remove();});
			});
		}
		var ta=document.createElement("textarea");
		$(ta).addClass("edittext");
		$(ta).val(this.value.jobs[adcreator.selection.job].text);
		$(ta).bind("blur",function() {
			adcreator.selectedTextRange[0]=this.selectionStart;
			adcreator.selectedTextRange[1]=this.selectionEnd;
		});
		$(ta).bind("keyup blur", function() {
			adcreator.value.jobs[adcreator.selection.job].text=$(this).val();
		});
		ins.appendChild(this.snippetSelector());
		ins.appendChild(ta);
		this.tabs.right['Edit and polish'].container.appendChild(ins);
		if ($(this.tabs.right['Edit and polish'].container).css("display")=="none") $(this.tabs.right['Edit and polish'].container).slideDown();
	},
	selectedTextRange:[0,0],
	snippetSelector:function() {
		var sel=document.createElement("select");
		$(sel).addClass("snippetSelector");
		var opt=document.createElement("option");
		opt.value='';
		$(opt).html('Insert a snippet...');
		sel.appendChild(opt);
		
		for(var s=0;s<this.value.snippets.length;s++) {
			if (this.value.snippets[s]!="") {
				opt=document.createElement("option");
				opt.value=s;
				$(opt).html(this.truncateText(this.value.snippets[s],30));
				sel.appendChild(opt);
			}
		}
		$(sel).bind("change",function() {
			if ($(this).val()!="") {
				var seltxt=adcreator.value.snippets[$(this).val()];
				var txt=adcreator.value.jobs[adcreator.selection.job].text.substr(0,adcreator.selectedTextRange[0])+seltxt+adcreator.value.jobs[adcreator.selection.job].text.substr(adcreator.selectedTextRange[1],adcreator.value.jobs[adcreator.selection.job].text.length);
				adcreator.value.jobs[adcreator.selection.job].text=txt;
				$(adcreator.tabs.right['Edit and polish'].container).find('textarea').val(txt);
				$(this).val("");
			}
		});
		return sel;
	},
	buildText:function() {
		var txt='';
		if (this.value.jobs[this.selection.job].basics.title!="") txt+="Job title: "+this.value.jobs[this.selection.job].basics.title+"\n";
		if (this.value.jobs[this.selection.job].basics.reference!="") txt+="Job ref.: "+this.value.jobs[this.selection.job].basics.reference+"\n";
		if (this.value.jobs[this.selection.job].basics.company!="") txt+="Company: "+this.value.jobs[this.selection.job].basics.company+"\n";
		if (this.value.jobs[this.selection.job].basics.location!="") txt+="Location: "+this.value.jobs[this.selection.job].basics.location+"\n";
		if (this.value.jobs[this.selection.job].basics.salary!="") txt+="Salary: "+this.value.jobs[this.selection.job].basics.salary+"\n";
		if (this.value.jobs[this.selection.job].basics.hours!="") txt+="Hours: "+this.value.jobs[this.selection.job].basics.hours+"\n";
		if (this.value.jobs[this.selection.job].basics.type!="") txt+="Type: "+this.value.jobs[this.selection.job].basics.type+"\n";
		if (txt!="") txt+="\n";
		if (this.value.jobs[this.selection.job].details.outline!="") txt+=this.value.jobs[this.selection.job].details.outline+"\n";
		if (this.value.jobs[this.selection.job].details.responsibilities!="") txt+=this.value.jobs[this.selection.job].details.responsibilities+"\n";
		if (this.value.jobs[this.selection.job].details.skills!="") txt+=this.value.jobs[this.selection.job].details.skills+"\n";

		this.value.jobs[adcreator.selection.job].text=txt;
		this.value.jobs[adcreator.selection.job].changed=false;
	},
	drawExport:function() {
		while(this.tabs.right['Export'].container.childNodes.length>0) $(this.tabs.right['Export'].container.childNodes[0]).remove();
		var ins=document.createElement("div");
		$(ins).html('<em>Here is your completed ad. Clicking &lsquo;Copy to Clipboard&rsquo; will allow you to paste it wherever you wish.</em><div id="d_clip_container" style="position:relative"><div id="d_clip_button" class="my_clip_button">Copy To Clipboard...</div></div>');
		var ta=document.createElement("div");
		$(ta).addClass("exporttext");
		$(ta).html(this.value.jobs[adcreator.selection.job].text.replace(/\n/g,'<br />'));
		this.tabs.right['Export'].container.appendChild(ins);
		this.tabs.right['Export'].container.appendChild(ta);
		var message=document.createElement("div");
		$(message).html("<div>Copied to your clipboard. To paste elsewhere, use Ctrl+V.</div>");
		$(message).addClass("copyMessage");
		$(message).css("display","none");
		this.tabs.right['Export'].container.appendChild(message);
		if ($(this.tabs.right['Export'].container).css("display")=="none") $(this.tabs.right['Export'].container).slideDown();
		
			ZeroClipboard.setMoviePath( yoodoo.option.baseUrl+'uploads/sitegeneric/file/dooits/utility/zeroclipboard/ZeroClipboard.swf' );
			clip = new ZeroClipboard.Client();
			clip.setHandCursor( true );
			/*
			clip.addEventListener('load', function (client) {
				debugstr("Flash movie loaded and ready.");
			});
			
			clip.addEventListener('mouseOver', function (client) {
				// update the text on mouse over
				clip.setText( $('my_clip_button').addClass("hovering"));
			});
			clip.addEventListener('mouseOut', function (client) {
				// update the text on mouse over
				clip.setText( $('my_clip_button').removeClass("hovering"));
			});
			*/
			clip.addEventListener('complete', function (client, text) {
				$(adcreator.tabs.right['Export'].container).find('.copyMessage').slideDown(function() {
					setTimeout("$(adcreator.tabs.right['Export'].container).find('.copyMessage').slideUp();",4000);
				});
				//alert("Copied text to clipboard: " + text );
			});
			clip.setText(this.value.jobs[adcreator.selection.job].text);
			clip.glue( 'd_clip_button', 'd_clip_container' );
	},
	hours:function(field,val) {
		var ip=document.createElement("select");
		ip.field=field;
		var opts=['','Full time','Part time','Evenings','Night shift'];
		for(var i=0;i<opts.length;i++) {
			var sel=document.createElement("option");
			$(sel).html(opts[i]);
			if (opts[i]==val) sel.selected=true;
			ip.appendChild(sel);
		}
		return ip;
	},
	types:function(field,val) {
		var ip=document.createElement("select");
		ip.field=field;
		var opts=['','Permanent','Temporary','Contract','Internship'];
		for(var i=0;i<opts.length;i++) {
			var sel=document.createElement("option");
			$(sel).html(opts[i]);
			if (opts[i]==val) sel.selected=true;
			ip.appendChild(sel);
		}
		return ip;
	},
	truncateText:function(t,l) {
		if(t.length>l) {
			return t.substr(0,l)+"&hellip;";
		}
		return t;
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
