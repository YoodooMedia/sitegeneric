
var cv={
	personal:{key:'',value:'',array:null,display:'',layout:''},
	profile:{key:'',value:'',array:null,display:'',layout:''},
	career:{key:'',value:'',array:null,display:'',layout:''},
	education:{key:'',value:'',array:null,display:'',layout:''},
	hobby:{key:'',value:'',array:null,display:'',layout:''},
	referees:{key:'',value:'',array:null,display:'',layout:''},
	cv:{key:'',value:'',array:[],display:'',layout:''},
	maxCVs:5,
	minCVs:1,
	showing:0,
	container:null,
	buttons:null,
	builder:null,
	cvDetails:null,
	forCV:null,
	forSection:null,
	cv_inputs:{},
	currentStyle:'',
	sectionEditing:'',
	availableStyles:['elegant','clean','bright'],
	editorWindow:null,
	texteditor:null,
	niceeditor:null,
	previewZoom:0.7,
	init:function(personalKey,profileKey,careerKey,educationKey,hobbyKey,refereesKey,cvKey) {
		this.personal.key=personalKey;
		this.profile.key=profileKey;
		this.career.key=careerKey;
		this.education.key=educationKey;
		this.hobby.key=hobbyKey;
		this.referees.key=refereesKey;
		this.cv.key=cvKey;
		
		//this.personal.value=this.personal.array=array_of_fields[this.personal.key][1].replace(/&apos;/g,"'");
		
		// fetch the career data
		var tmp=dooit.fetchJsonFromArray(this.personal.key);
		this.personal.value=tmp[0];
		this.personal.array=tmp[1];

		this.profile.value=this.profile.array=dooit.decode(array_of_fields[this.profile.key][1]).replace(/\\\"/g,'"');
		
		// fetch the career data
		var tmp=dooit.fetchJsonFromArray(this.career.key);
		this.career.value=tmp[0];
		this.career.array=tmp[1];
		
		// fetch the education data
		tmp=dooit.fetchJsonFromArray(this.education.key);
		this.education.value=tmp[0];
		this.education.array=tmp[1];
		
		// fetch the hobby data
		tmp=dooit.fetchJsonFromArray(this.hobby.key);
		this.hobby.value=tmp[0];
		this.hobby.array=tmp[1];
		
		// fetch the referee data
		tmp=dooit.fetchJsonFromArray(this.referees.key);
		this.referees.value=tmp[0];
		this.referees.array=tmp[1];
		
		// fetch the cv data
		tmp=dooit.fetchJsonFromArray(this.cv.key);
		this.cv.value=tmp[0];
		this.cv.array=tmp[1];
		if (this.cv.array.length==0) {
			for(var i=0;i<this.minCVs;i++) {
				this.cv.array.push(this.newCVArray(i+1));
			}
		}
		
		
		
		this.container=$('#exercise_content .cv').get(0);
		
		this.container.innerHTML='<h2>Your CVs</h2><div class="teaser">Now you can edit and format some CVs</div>';
		this.buttons=this.createElement("div",null,'buttons',null);
		this.builderBorder=this.createElement("div",null,'builder',null);
		this.builderBorder.innerHTML="<h4>Sections</h4>";
		this.builder=this.createElement("div",null,null,null);
		this.builderBorder.appendChild(this.builder);
		this.cvDetails=this.createElement("div",null,'cv-details',null);
		this.toolbox=this.createElement("div",null,'toolbox',null);
		this.forCV=this.createElement("div",null,'forCV',null);
		this.forSection=this.createElement("div",null,'forSection',null);
		this.container.appendChild(this.buttons);
		this.container.appendChild(this.forCV);
		this.container.appendChild(this.builderBorder);
		this.container.appendChild(this.toolbox);
		this.toolbox.appendChild(this.forSection);
		
		for(var i=0;i<this.cv.array.length;i++) {
			var tmp=this.createElement("button",null,'cv-button tab',null);
			tmp.innerHTML=this.cv.array[i].name;
			this.buttons.appendChild(tmp);
		}
		var tmp=this.createElement("button",null,'plus',null);
		tmp.innerHTML="+";
		this.buttons.appendChild(tmp);
		this.buttons.appendChild(this.createElement("div",null,null,{clear:'both'}));
		$(this.buttons).find('button.cv-button').bind("click",function() {
			//$(this).siblings('button.cv-button').removeClass("on");
			//$(this).addClass("on");
			var i=$(this).prevAll('button').get().length;
			cv.edit(i);
		});
		$(this.buttons).find('button.plus').bind("click",function() {
			var i=$(this).prevAll('button').get().length;
			var na=cv.newCVArray(i+1);
			var add=cv.createElement("button",null,'cv-button tab',null);
			add.innerHTML=na.name;
			this.parentNode.insertBefore(add,this);
			cv.cv.array.push(na);
			$(add).bind("click",function() {
				//$(this).siblings('button.cv-button').removeClass("on");
				//$(this).addClass("on");
				var i=$(this).prevAll('button').get().length;
				cv.edit(i);
			});
			var i=$(add).prevAll('button').get().length;
			cv.edit(i);
		});
		
		this.edit(this.showing);
	},
	editSectionText:function() {
		var txt=$(cv.forSection).find('.preview').html();
		this.textEditor=this.createElement("textarea",'SectionEditor','rounded3',null);
		this.textEditorContainer=this.createElement("div",null,'cv-'+this.cv.array[this.showing].style,null);
		this.editorWindow=this.createElement("div",null,'floating',null);
		$(this.editorWindow).html("Text Editor");
		this.textEditorContainer.appendChild(this.textEditor);
		this.editorWindow.appendChild(this.textEditorContainer);
		this.textEditor.value=txt;
		this.container.appendChild(this.editorWindow);
		var doit=$('.dooitBox').get(0);
		var add=this.createElement("button",null,'cv-button update',null);
		add.innerHTML="update";
		this.editorWindow.appendChild(add);
		var cancel=this.createElement("button",null,'cv-button cancel',null);
		cancel.innerHTML="cancel";
		this.editorWindow.appendChild(cancel);
		var pad=inputs.paddings(doit);
		$(this.editorWindow).css('width',(doit.clientWidth-pad[1]-pad[3])+"px");
		$(this.editorWindow).css('height',(doit.clientHeight-pad[0]-pad[2])+"px");
		$(this.textEditor).css('width',(doit.clientWidth-pad[1]-pad[3]-2)+"px");
		$(this.textEditor).css('height',(doit.clientHeight-pad[1]-pad[3]-120)+"px");
		$(add).bind("click",function() {
			cv.setToolboxText($(cv.textEditorContainer).find('.nicEdit-main').html());		 
			//$(cv.forSection).find(".preview").html($(cv.textEditorContainer).find('.nicEdit-main').html());
			cv.niceeditor.removeInstance('SectionEditor');
			$(cv.editorWindow).remove();
		});
		$(cancel).bind('click',function() {
			cv.niceeditor.removeInstance('SectionEditor');
			$(cv.editorWindow).remove();
		});
		this.niceeditor=new nicEditor({buttonList : ['fontSize','bold','italic','underline','strikeThrough','subscript','superscript']}).panelInstance('SectionEditor');
	},
	newCVArray:function(i) {
			return {name:'CV '+i,style:'elegant',sections:{personal:'',profile:'',career:'',education:'',hobbies:'',referees:'',custom:[]},order:['personal','profile','career','education','hobbies','referees']};
	},
	defineReorder:function(){
		$(this.builder).sortable({handle:'.move',update:function(e,ui){cv.setOrder(ui);}});
	},
	setOrder:function(ui) {
		var o=[];
		var neworder=$(ui.item[0].parentNode).find('.area').get();
		for(var k=0;k<neworder.length;k++) {
			o.push(neworder[k].innerHTML.replace(/<[^>]+>/g,'').replace(/^ */,'').replace(/ *$/,''));
		}
		cv.cv.array[cv.showing].order=o;
	},
	edit:function(i) {
		while(cv.forSection.childNodes.length>0) cv.forSection.removeChild(cv.forSection.childNodes[0]);
		$(this.buttons).find("button.on").removeClass("on");
		this.showing=i;
		$($(this.buttons).find("button").get(this.showing)).addClass("on");
		while(this.builder.childNodes.length>0) this.builder.removeChild(this.builder.childNodes[0]);
		while(this.forCV.childNodes.length>0) this.forCV.removeChild(this.forCV.childNodes[0]);
		for(var j=0;j<this.cv.array[i].order.length;j++) {
			var sect=this.createElement("div",null,'section',null);
			sect.innerHTML="<div class='area'><div class='move'></div>"+this.cv.array[i].order[j]+"</div>";
			sect.section=this.cv.array[i].order[j];
			if (this.cv.array[this.showing].sections[this.cv.array[i].order[j]]=="") this.cv.array[this.showing].sections[this.cv.array[i].order[j]]=this.layouts[this.cv.array[i].order[j]]['initial']();
			this.builder.appendChild(sect);
		}
		this.setStyle(this.cv.array[i].style);
		this.setEditingClick();
		this.defineReorder();
		this.styleButtons();
		this.cv_parameters();
		this.showtoolbox("");
	},
	setEditingClick:function() {
		$(this.builder).find("div.section").bind("click",function() {
			cv.showtoolbox(this.section);
			$(this).siblings('div.section').removeClass("editing");
			$(this).addClass("editing");
		});
	},
	styleButtons:function() {
		var buts=[];
		for(var i=0;i<this.availableStyles.length;i++) {
			buts.push("<option value='"+this.availableStyles[i]+"'"+((this.cv.array[this.showing].style==this.availableStyles[i])?' selected="selected"':'')+">"+this.availableStyles[i]+"</option>");
		}
		var styleDiv=this.createElement('div',null,null,{float:'right'});
		styleDiv.innerHTML="Style&nbsp;<select id='styleselect'>"+buts.join('')+"</select>";
		this.cv_inputs.style=$(styleDiv).find("#styleselect").get(0);
		this.forCV.appendChild(styleDiv);
		inputs.dropdown([this.cv_inputs.style],{layout:inputs.layout.none,onSelect:function(o) {
			cv.setStyle(cv.cv_inputs.style.options[cv.cv_inputs.style.selectedIndex].value);
		}});
	},
	cv_parameters:function() {
		var h4=this.createElement("h4");
		h4.innerHTML="Curriculum Vitae";
		this.forCV.appendChild(h4);
		var row1=this.createElement("div",null,null,null);
		row1.innerHTML="Title&nbsp;";
		$(row1).css("margin","0 200px 0 0");
		//this.forCV.appendChild(eez.createHTML("<label>CV Title</label>")[0]);
		this.cv_inputs.title=this.createElement("input",null,null,null);
		this.cv_inputs.title.setAttribute("type","text");
		this.cv_inputs.title.value=this.cv.array[this.showing].name;
		var prevButton=this.createElement("button",null,'layoutButton',{margin:'0 0 2px 20px'});
		$(prevButton).attr("type","button");
		$(prevButton).html("print preview");
		$(prevButton).bind("click",function() {cv.fullPreview();});
		row1.appendChild(this.cv_inputs.title);
		row1.appendChild(prevButton);
		this.forCV.appendChild(row1);
		$(this.cv_inputs.title).bind('keyup',function() {
			cv.cv.array[cv.showing].name=this.value;
			$(cv.buttons).find('button').get(cv.showing).innerHTML=this.value;
		});
	},
	setStyle:function(name) {
		if (this.currentStyle!='') {
			$(this.builder).removeClass('cv-'+this.currentStyle);
			$(cv.forSection).find('.preview').removeClass('cv-'+this.currentStyle);
		}
		this.currentStyle=name;
		$(this.builder).addClass('cv-'+this.currentStyle);
		$(cv.forSection).find('.preview').addClass('cv-'+this.currentStyle);
		this.cv.array[this.showing].style=name;
	},
	showtoolbox:function(e) {
		this.sectionEditing=e;
		$(this.forSection).fadeOut('fast',function() {
			cv.buildtoolbox(cv.sectionEditing);
		});
	},
	toolboxLayout:'',
	setToolboxText:function(txt) {
		$(cv.forSection).find('.preview').html(txt);
		var warning=$(cv.forSection).find('.warning');
		if (txt===null || txt.replace(/ /g,'')=='') {
			if (warning.css("display")=="none") warning.slideDown();
		}else{
			if (warning.css("display")!="none") warning.slideUp();
		}
	},
	buildtoolbox:function(e) {
		//while(this.forCV.childNodes.length>0) this.forCV.removeChild(this.forCV.childNodes[0]);
		while(this.forSection.childNodes.length>0) this.forSection.removeChild(this.forSection.childNodes[0]);
		var ins='';
		if (e=="") {
			ins="<h4>Template editor</h4>";
			ins+="Choose a section of this CV to start editing it";
			var tmp=this.createElement("div",null,"Section",null);
			tmp.innerHTML=ins;
			cv.forSection.appendChild(tmp);
		}else if (this.layouts[e]) {
			var tmpdiv=this.createElement("div",null,null,null);
			this.sectionEditing=e;
			ins="<h4>"+e.charAt(0).toUpperCase() + e.slice(1)+" section</h4>";
			ins+="<div style='float:right'>Zoom:&nbsp;<button type='button' class='in'>in</button><button type='button' class='out'>out</button></div>Apply a layout: ";
			
			for(var l in this.layouts[e]) {
				if (l!="initial") {
					tmpdiv.innerHTML=this.layouts[e][l]();
					var cls=(tmpdiv.innerHTML==this.cv.array[this.showing].sections[e].replace("<br />","<br>"));
					//console.log(tmpdiv.innerHTML);
					//console.log(this.cv.array[this.showing].sections[e]);
					ins+='<button type="button" class="layoutButton'+(cls?" on":"")+'" id="layout_'+l+'">'+l.replace(/_/g,' ')+'</button>';
				}
			}
			$(tmpdiv).remove();
			ins+="<div class='clear warning' style='display:none'>You have not provided the information for this section. Go back to the relevant dooit</div>";
			//var tmp=this.createElement("div",null,null,null);
			var tmp=this.createElement("div",null,e+"Section",null);
			tmp.innerHTML=ins;
			cv.forSection.appendChild(tmp);
			var tmp=this.createElement("div",null,'rounded3 previewContainer',null);
			tmp.innerHTML="<div class='preview"+((this.currentStyle=='')?'':' cv-'+this.currentStyle)+"'></div>";
			cv.forSection.appendChild(tmp);
			$(this.forSection).find("button.layoutButton").bind("click",function() {
				$(this).siblings('button').removeClass("on");
				$(this).addClass("on");
				var txt=$('.previewContainer .preview').html();
				cv.setToolboxText(cv.layouts[this.parentNode.className.replace("Section",'')][this.innerHTML.replace(/ /g,"_")](txt));
				//cv.setToolboxText(cv.layouts[this.parentNode.className.replace("Section",'')][this.innerHTML.replace(/ /g,"_")]());
			});
			for(var l in this.layouts[e]) ins+='<button type="button">'+l+'</button>';
			var tmp=this.createElement("div",null,'zoomer',{margin:'4px 0px'});
			tmp.innerHTML="<button type='button' class='edit'>edit</button><button type='button' class='save'>save</button>";
			cv.forSection.appendChild(tmp);
			$(this.forSection).find("button.in").bind("click",function() {
				//var z=$(cv.forSection).find('.preview').css('zoom');
				//$(cv.forSection).find('.preview').css('zoom',(1*z)+0.1);
				cv.previewZoom=(1*cv.previewZoom)+0.1;
				$(cv.forSection).find('.preview').css('zoom',cv.previewZoom);
			});
			$(this.forSection).find("button.out").bind("click",function() {
				//var z=$(cv.forSection).find('.preview').css('zoom');
				//$(cv.forSection).find('.preview').css('zoom',(1*z)-0.1);
				cv.previewZoom=(1*cv.previewZoom)-0.1;
				$(cv.forSection).find('.preview').css('zoom',cv.previewZoom);
			});
			$(cv.forSection).find('.preview').css('zoom',cv.previewZoom);
			$(this.forSection).find("button.save").bind("click",function() {
				cv.cv.array[cv.showing].sections[cv.sectionEditing]=$(cv.forSection).find('.preview').html();
				while(cv.forSection.childNodes.length>0) cv.forSection.removeChild(cv.forSection.childNodes[0]);
			});
			$(this.forSection).find("button.edit").bind("click",function() {
				cv.editSectionText();
			});
			this.toolboxLayout=this.cv.array[this.showing].sections[e];
			if (this.cv.array[this.showing].sections[e]=='') {
				this.setToolboxText(cv.layouts[this.sectionEditing].initial());
			}else{
				this.setToolboxText(this.cv.array[this.showing].sections[e]);
				//$(this.forSection).find(".preview").html(this.cv.array[this.showing].sections[e]);
			}
		}
		$(cv.forSection).fadeIn();
	},
	clearLayout:function(txt) {
		return txt.replace(/^\<div[^\>]*\>\<h2\>[^\<]*\<\/h2\>/,'').replace(/^\<div[^\>]*\>/,'').replace(/\<\/div\>$/,'');
	},
	layouts:{
		personal:{
			initial:function() {
				$('button#layout_standard').addClass("on");
				return cv.layouts.personal.standard();
			},
			standard:function() {
				var ins='|--salutation-- ||--name--<br />||--address1--<br />||--address2--<br />||--town--<br />||--county--<br />||--postcode--<br />||tel: --telephone--<br />||email: --email--<br />|';
				return "<div class='heading'>"+cv.fillIn(ins,cv.personal.array)+"</div>";
			},
			simple:function() {
				var ins='|--salutation-- ||--name--, ||--address1--, ||--address2--, ||--town--, ||--county--, ||--postcode--, ||tel: --telephone--, ||email: --email--|';
				return "<div class='heading'>"+cv.fillIn(ins,cv.personal.array)+"</div>";
			},
			friendly:function() {
				var ins='<center>|<h1>--name--</h1>||<h2>--telephone--</h2>||<h3>--email--</h3>|<div class="address">|--address1--, ||--address2--, ||--town--, ||--county--, ||--postcode--|</div></div>';
				return "<div class='heading'>"+cv.fillIn(ins,cv.personal.array)+"</div>";
			},
			official:function() {
				var ins='<div style="float:right;min-width:30%;white-space:nowrap;" class="address">|--address1--, ||--address2--, ||--town--<br />||--county--, ||--postcode--<br />||tel: --telephone--<br />||email: --email--|</div>|<h1 style="float:left">--name--</h1>|<div style="clear:both"></div>';
				return "<div class='heading'>"+cv.fillIn(ins,cv.personal.array)+"</div>";
			}
		},
		profile:{
			initial:function() {
				$('button#layout_standard').addClass("on");
				return cv.layouts.profile.standard();
			},
			standard:function() {
				var txt=cv.profile.array;
				if (arguments.length>0) txt=arguments[0];
				return "<div>"+cv.clearLayout(txt)+"</div>";
			},
			sectioned:function() {
				var txt=cv.profile.array;
				if (arguments.length>0) txt=arguments[0];
				return "<div class='section'>"+cv.clearLayout(txt)+"</div>";
			},
			titled:function() {
				var txt=cv.profile.array;
				if (arguments.length>0) txt=arguments[0];
				return "<div class='section'><h2>Profile</h2>"+cv.clearLayout(txt)+"</div>";
			}
		},
		career:{
			initial:function() {
				$('button#layout_simple').addClass("on");
				return cv.layouts.career.simple();
			},
			simple:function() {
				var ins=['<h2>Employment</h2>'];
				for(var i=0;i<cv.career.array.length;i++) {
					var com='<div class="jobtitle"><span style="float:right;white-space:nowrap">|--start--|| to --finish--|</span>| <b>--position--</b> with ||--company--|<div style="clear:both"></div></div>';
					com=cv.fillIn(com,cv.career.array[i],{start:'M Y',finish:"M Y"});
					if (typeof(cv.career.array[i].experience)!="undefined") {
						var ex=[];
						for(var e=0;e<cv.career.array[i].experience.length;e++) {
							ex.push(cv.career.array[i].experience[e]);
						}
						if (ex.length>0) com+='<blockquote>'+ex.join("<br />")+'</blockquote>';
					}
					com='<div class="item-block">'+com+"</div>";
					ins.push(com);
				}
				return "<div class='section'>"+ins.join("")+"</div>";
			},
			longdate:function() {
				var ins=['<h2>Employment</h2>'];
				for(var i=0;i<cv.career.array.length;i++) {
					var com='<div class="jobtitle"><span style="float:right;white-space:nowrap">|--start--|| to --finish--|</span>| <b>--position--</b> with ||--company--|<div style="clear:both"></div></div>';
					com=cv.fillIn(com,cv.career.array[i],{start:'jS M Y',finish:"jS M Y"});
					if (typeof(cv.career.array[i].experience)!="undefined") {
						var ex=[];
						for(var e=0;e<cv.career.array[i].experience.length;e++) {
							ex.push(cv.career.array[i].experience[e]);
						}
						if (ex.length>0) com+='<blockquote>'+ex.join("<br />")+'</blockquote>';
					}
					com='<div class="item-block">'+com+"</div>";
					ins.push(com);
				}
				return "<div class='section'>"+ins.join("")+"</div>";
			}
		},
		education:{
			initial:function() {
				$('button#layout_descriptive').addClass("on");
				return cv.layouts.education.descriptive();
			},
			descriptive_short_date:function() {
				var ins='<h2>Education</h2>';
				ins+="<table>";
				for(var i=0;i<cv.education.array.length;i++) {
					var rowClass='odd';
					if (i%2) rowClass="even";
					var com='<tr class="'+rowClass+'"><th>|<b>--school--</b>||, --location--|</th><th colspan="2">| from --start--|| to --finish--|</th></tr>';
					com=cv.fillIn(com,cv.education.array[i],{start:'M Y',finish:"M Y"});
					if (typeof(cv.education.array[i].experience)!="undefined") {
						var ex=[];
						if (cv.education.array[i].experience.length>0) {
							//ex.push('<tr><th>Subject</th><th>Level</th><th>Grade</th></tr>');
						}
						for(var e=0;e<cv.education.array[i].experience.length;e++) {
							ex.push("<tr><td>"+cv.education.array[i].experience[e][0]+"</td><td>"+cv.education.array[i].experience[e][1]+"</td><td>"+cv.education.array[i].experience[e][2]+"</td></tr>");
						}
						if (ex.length>0) {
							com+=ex.join("");
						}
					}
					ins+=com;
				}
				ins+="</table>";
				return "<div class='section'>"+ins+"</div>";
			},
			descriptive:function() {
				var ins=['<h2>Education</h2>'];
				for(var i=0;i<cv.education.array.length;i++) {
					var com='|<b>--school--</b>, ||--location--|| from --start--|| to --finish--|';
					com=cv.fillIn(com,cv.education.array[i],{start:'jS M Y',finish:"jS M Y"});
					if (typeof(cv.education.array[i].experience)!="undefined") {
						var ex=[];
						if (cv.education.array[i].experience.length>0) {
							//ex.push('<tr><th>Subject</th><th>Level</th><th>Grade</th></tr>');
						}
						for(var e=0;e<cv.education.array[i].experience.length;e++) {
							ex.push("<tr><td>"+cv.education.array[i].experience[e][0]+"</td><td>"+cv.education.array[i].experience[e][1]+"</td><td>"+cv.education.array[i].experience[e][2]+"</td></tr>");
						}
						if (ex.length>0) {
							com+='<table>'+ex.join("")+'</table>';
						}
					}
					com='<div class="item-block">'+com+"</div>";
					ins.push(com);
				}
				return "<div class='section'>"+ins.join("")+"</div>";
			},
			brief:function() {
				var ins=['<h2>Education</h2>'];
				for(var i=0;i<cv.education.array.length;i++) {
					var com='|--start--|| to --finish--|| <b>--school--</b>, ||--location--|';
					com=cv.fillIn(com,cv.education.array[i],{start:'M Y',finish:"M Y"});
					if (typeof(cv.education.array[i].experience)!="undefined") {
						var level={};
						for(var e=0;e<cv.education.array[i].experience.length;e++) {
							if (typeof(level[cv.education.array[i].experience[e][1]])=="undefined") level[cv.education.array[i].experience[e][1]]={};
							if (typeof(level[cv.education.array[i].experience[e][1]][cv.education.array[i].experience[e][2]])=="undefined") level[cv.education.array[i].experience[e][1]][cv.education.array[i].experience[e][2]]=0;
							level[cv.education.array[i].experience[e][1]][cv.education.array[i].experience[e][2]]++;
						}
						var ex=[];
						var lastLevel='';
						if (cv.education.array[i].experience.length>0) {
							//ex.push('<tr><th>Level</th><th>Grade</th></tr>');
						}
						for(var l in level) {
							for(var g in level[l]) {
								var line='<tr>';
								if (l!=lastLevel) {
									line+="<td>"+l+"</td>";
								}else{
									line+="<td></td>";
								}
								lastLevel=l;
								line+="<td>"+level[l][g]+" x "+g+"</td>";
								line+="</tr>";
								ex.push(line);
							}
						}
						if (ex.length>0) {
							com+='<table>'+ex.join("")+'</table>';
						}
						com='<div class="item-block">'+com+"</div>";
						ins.push(com);
					}
				}
				return "<div class='section'>"+ins.join("")+"</div>";
			}
		},
		hobbies:{
			initial:function() {
				$('button#layout_simple').addClass("on");
				return cv.layouts.hobbies.simple();
			},
			simple:function() {
				var ins=['<h2>Interests</h2>'];
				for(var i=0;i<cv.hobby.array.length;i++) {
					var com='<b>|--name--|</b>|: --description--|';
					com=cv.fillIn(com,cv.hobby.array[i]);
					com='<div class="item-block">'+com+"</div>";
					ins.push(com);
				}
				return "<div class='section'>"+ins.join("")+"</div>";
			},
			titled:function() {
				var ins=['<h2>Interests</h2>'];
				for(var i=0;i<cv.hobby.array.length;i++) {
					var com='<b>|--name--|</b>|<blockquote>--description--</blockquote>|';
					com=cv.fillIn(com,cv.hobby.array[i]);
					com='<div class="item-block">'+com+"</div>";
					ins.push(com);
				}
				return "<div class='section'>"+ins.join("")+"</div>";
			}
		},
		referees:{
			initial:function() {
				$('button#layout_minimal').addClass("on");
				return cv.layouts.referees.minimal();
			},
			minimal:function() {
				var both=true;
				var ins='<h2>Referees</h2>';
				var ref='|--salutation-- || --name--</b>, ||--jobtitle--, ||--address1--, ||--address2--, ||--town--, ||--county--, ||--postcode--, ||tel: --telephone--, ||email: --email--|';
				var ref1=cv.fillIn(ref,cv.referees.array[0]);
				var ref2=cv.fillIn(ref,cv.referees.array[1]);
				if (ref1!="" && ref2!="") {
					ins+=ref1+"<br />"+ref2;
				}else{
					ins+=ref1+ref2;
				}
				return "<div class='section'>"+ins+"</div>";
			},
			blocked:function() {
				var both=true;
				var ins='<h2>Referees</h2><table width="100%"><tr><td '+(both?'width="50%"':'')+'>';
				var ref='|--salutation-- ||<b>--name--</b><br />||--jobtitle--<br />||--address1--<br />||--address2--<br />||--town--<br />||--county--<br />||--postcode--<br />||tel: --telephone--<br />||email: --email--<br />|';
				ins+=cv.fillIn(ref,cv.referees.array[0]);
				ins+='</td><td '+(both?'width="50%"':'')+'>';
				ins+=cv.fillIn(ref,cv.referees.array[1]);
				ins+="</td></tr></table>";
				return "<div class='section'>"+ins+"</div>";
			}
		}
	},
	fillIn:function(txt,arr){
		var formats={};
		if (arguments.length>2) formats=arguments[2];
		if (arr) {
			for(var k in arr) {
				var val=arr[k];
				if (typeof(formats[k])!="undefined") {
					if (val.getFullYear) {
						val=inputs.formatDate(formats[k],arr[k]);
					}
				}
				var re=new RegExp('\\|[^\\|]*?\\-\\-'+k+'\\-\\-[^\\|]*?\\|','g');
				if (val=="") {
					txt=txt.replace(re,'');
				}else{
					txt=txt.replace(re,function(m) {
						var mre=new RegExp('\\-\\-'+k+'\\-\\-','g');
						m=m.replace(mre,val);
						m=m.replace(/^\|/,'');
						m=m.replace(/\|$/,'');
						return m;
					});
				}
			}
			txt=txt.replace(/\|[^\|]+?\|/g,'');
			return txt;
			//return (txt=="")?'No information to show':txt;
		}
		return 'No information to show';
	},
	outputHTML:function() {
		var html='';
		for(var o=0;o<this.cv.array[this.showing].order.length;o++) {
		//for(var s in this.cv.array[this.showing].sections) {
			var nom=this.cv.array[this.showing].order[o];
			if (typeof(this.cv.array[this.showing].sections[nom])=="string") html+=this.cv.array[this.showing].sections[nom];
		}
		return html;
	},
	fullPreview:function(){
		var html=this.outputHTML();
		this.windowed(this.cv.array[this.showing].name,this.cv.array[this.showing].style,html);
	},
	msdoc:function(){
		var html=this.outputHTML();
		var docCreateURL='http://eez.co/yoodoo/msdoc.php';
		var op='';
		op+="<html><head></head><body><form id='yoodooPost' action='"+docCreateURL+"' method='POST'>";
		op+="<textarea name='msdoc'>"+html+"</textarea>";
		op+="<input type='text' name='style' value='"+this.cv.array[this.showing].style+"' />";
		op+="<input type='text' name='name' value='"+this.cv.array[this.showing].name+"' />";
		op+="</form>";
		op+="<script type='text/javascript'>document.getElementById('yoodooPost').submit();</script>";
		op+="</body></html>";
		this.windowed(this.cv.array[this.showing].name,this.cv.array[this.showing].style,op);
	},
	output:function() {
		var op=dooit.json(cv.cv.array);
		array_of_fields[this.cv.key][1]=op;
		var reply={};
		eval('reply.EF'+array_of_fields[this.cv.key][0]+'=op;');
		return reply;
	},
	createElement:function(tag,id,className,styles) {
		var tmp=document.createElement(tag);
		if (tag=="button") tmp.setAttribute("type","button");
		if (id!==null) tmp.id=id;
		if (className!==null) $(tmp).addClass(className);
		if (styles!==null) {
			for(var s in styles) {
				if (typeof(styles[s])=="string") $(tmp).css(s,styles[s]);
			}
		}
		return tmp;
	},
	windowed:function(title,templateStyle,html) {
		var win=window.open('','','menubar=1,status=0,scrollbars=1');
		var doc = win.document;
		if(win.contentDocument) {
			doc = win.contentDocument; // For NS6
		} else if(win.contentWindow) {
			doc = win.contentWindow.document; // For IE5.5 and IE6
		} else if(win.document) {
			doc = win.document; // default*/
		}
		if (doc!==null) {
			doc.open();
			var op='';
			html="<div class='noprint'><p>Depending on your computer and settings, you may be able to save your CV as a PDF document (which can be sent to potential employers).</p><p>To find out, click &lsquo;Print&rsquo; and select &lsquo;Change Printer&rsquo;. If one of the available printers is &lsquo;Save to PDF&rsquo; or similar, you can save your CV to your computer by selecting this option.</p><p>Don&rsquo;t worry if you don&rsquo;t have the PDF option; you can still save your CV to your computer. Click at the very top of your CV and drag to the bottom so that all the text is highlighted. Copy the selected text and paste it into the document of your choice.</p><p>Finally, you can of course print directly from this screen.</p><button type='button' onclick='window.print()' class='previewPrintButton'>Print</button></div>"+html;
			op+="<html><head><title>"+title+"</title><link href='"+yoodoo.option.baseUrl+"uploads/sitegeneric/file/css/information/cv-styles.css' rel='stylesheet' type='text/css' /></head><body class='cv-"+templateStyle+"'>"+html+"</body></html>";
			//console.log(op);
			doc.writeln(op);
			doc.close();
		}
	}
};
dooit.temporaries('cv');
