
dooit.temporaries('summary');
var summary={
	values:{},
	container:null,
	fields:[],
	fieldConfig:null,
	container_selector:'.summary',
	printer:null,
	printable:[],
	pdfHeader:[{image:yoodoo.option.baseUrl+'uploads/sitegeneric/image/dooits/yoodoo-pdf-logo.jpg',w:190,h:11,absolute:true},
		{fontsize:12,fontcolor:[255,255,255],lineheight:11,indent:10,text:'{user}'},
		{lineheight:3}],
	selected:{},
	selectkey:'',
	displayOutput:true,
	styles:{
		h1:{fontsize:16,fontcolor:[50,200,50],lineheight:8},
		h2:{fontsize:14,fontcolor:[50,150,50],lineheight:7},
		h3:{fontsize:12,fontcolor:[50,100,50],lineheight:6},
		right:{fontsize:10,fontcolor:[100,100,100],lineheight:3.8,textalign:'R'},
		label:{fontsize:10,fontcolor:[50,50,200],lineheight:3.8},
		indent:{fontsize:10,fontcolor:[50,200,50],lineheight:3.8,indent:20},
		answer:{fontsize:10,fontcolor:[50,200,50],lineheight:3.8,indent:20},
		spacer:{lineheight:2}
	},
	init:function() {
		if (arguments.length>0) this.container_selector=arguments[0];
		if (this.displayOutput) this.container=$(this.container_selector).get(0);
		this.selected={};
		for(var k in array_of_default_fields) {
			try{
				this.selectkey=array_of_default_fields[k];
				eval('summary.fieldConfig='+dooit.decode(array_of_fields[array_of_default_fields[k]][1])+';');
			}catch(ex){}
		}
		if (this.fieldConfig!==null) {
			if (this.fieldConfig.main!==undefined && this.fieldConfig.main.dooit!==undefined) {
				for(var d=0;d<this.fieldConfig.main.dooit.length;d++) {
					var dt=[
						'Construct',
						this.fieldConfig.main.dooit[d].dooit.name,
						this.fieldConfig.main.dooit[d].dooit.config,
						this.fieldConfig.main.dooit[d].dooit.data
					];
					this.fields.push(dt);
				}
				if (this.fieldConfig.main.pdfHeader!="") {
					this.pdfHeader[0].image=yoodoo.option.baseUrl+this.fieldConfig.main.pdfHeader.replace(/^\//,'');
					this.pdfHeader[0].h=this.fieldConfig.main.pdfHeaderHeight;
					this.pdfHeader[1].lineheight=this.fieldConfig.main.pdfHeaderHeight;
					var col=this.hexToRGB(this.fieldConfig.main.headerColour);
					this.pdfHeader[1].fontcolor=[col.r,col.g,col.b];
				}
				if (this.fieldConfig.main.h1Colour!="") {
					var col=this.hexToRGB(this.fieldConfig.main.h1Colour);
					this.styles.h1.fontcolor=[col.r,col.g,col.b];
				}
				if (this.fieldConfig.main.h2Colour!="") {
					var col=this.hexToRGB(this.fieldConfig.main.h2Colour);
					this.styles.h2.fontcolor=[col.r,col.g,col.b];
				}
				if (this.fieldConfig.main.h3Colour!="") {
					var col=this.hexToRGB(this.fieldConfig.main.h3Colour);
					this.styles.h3.fontcolor=[col.r,col.g,col.b];
				}
				if (this.fieldConfig.main.label!="") {
					var col=this.hexToRGB(this.fieldConfig.main.label);
					this.styles.label.fontcolor=[col.r,col.g,col.b];
				}
				if (this.fieldConfig.main.answer!="") {
					var col=this.hexToRGB(this.fieldConfig.main.answer);
					this.styles.answer.fontcolor=[col.r,col.g,col.b];
				}
				if (this.fieldConfig.main.paragraph!="") {
					var col=this.hexToRGB(this.fieldConfig.main.paragraph);
					this.styles.indent.fontcolor=[col.r,col.g,col.b];
				}
				if (this.fieldConfig.main.h1TextHeight!="") this.styles.h1.fontsize=this.fieldConfig.main.h1TextHeight;
				if (this.fieldConfig.main.h2TextHeight!="") this.styles.h2.fontsize=this.fieldConfig.main.h2TextHeight;
				if (this.fieldConfig.main.h3TextHeight!="") this.styles.h3.fontsize=this.fieldConfig.main.h3TextHeight;
				if (this.fieldConfig.main.labelTextHeight!="") this.styles.label.fontsize=this.fieldConfig.main.labelTextHeight;
				if (this.fieldConfig.main.answerTextHeight!="") this.styles.answer.fontsize=this.fieldConfig.main.answerTextHeight;
				if (this.fieldConfig.main.paragraphTextHeight!="") this.styles.indent.fontsize=this.fieldConfig.main.paragraphTextHeight;
				if (this.fieldConfig.main.h1LineHeight!="") this.styles.h1.lineheight=this.fieldConfig.main.h1LineHeight;
				if (this.fieldConfig.main.h2LineHeight!="") this.styles.h2.lineheight=this.fieldConfig.main.h2LineHeight;
				if (this.fieldConfig.main.h3LineHeight!="") this.styles.h3.lineheight=this.fieldConfig.main.h3LineHeight;
				if (this.fieldConfig.main.labelLineHeight!="") this.styles.label.lineheight=this.fieldConfig.main.labelLineHeight;
				if (this.fieldConfig.main.answerLineHeight!="") this.styles.answer.lineheight=this.fieldConfig.main.answerLineHeight;
				if (this.fieldConfig.main.paragraphLineHeight!="") this.styles.indent.lineheight=this.fieldConfig.main.paragraphLineHeight;
				if (this.fieldConfig.main.spacer!="") this.styles.spacer.lineheight=this.fieldConfig.main.spacer;
				
			}
		}
		for(var k in array_of_fields) {
			if(array_of_fields[k][1]!="") {
				//try{
				//	eval('summary.values[k]='+dooit.decode(array_of_fields[k][1])+';');
				//}catch(ex) {
					try{
						eval("summary.values[k]="+array_of_fields[k][1]+";");
					}catch(ex) {
						try{
							eval("summary.values[k]='"+array_of_fields[k][1]+"';");
						}catch(ex) {
						}
					}
				//}
				summary.values[k]=dooit.decode(summary.values[k]);
			}
		}
		this.build();
	},
	build:function() {
		this.printable=[];
		for(var f=0;f<this.fields.length;f++) {
			var valid=true;
			if (this.fields[f].length<4 || this.fields[f][3]) {
				if(typeof(this.values[this.fields[f][2]])=="undefined" || this.values[this.fields[f][2]]=="") valid=false;
				if(this.fields[f].length>3 && typeof(this.values[this.fields[f][3]])=="undefined" || this.values[this.fields[f][3]]=="") valid=false;
				if(valid) {
					this.printable.push(this.fields[f]);
					var k=this.printableKey(this.printable.length-1);
					if (typeof(this.selected[k])=="undefined") this.selected[k]=true;
				}else{
	//console.log(this.fields[f]);
				}
			}
		}
		//this.values=dooit.decode(this.values);
		if (this.displayOutput) {
			$(this.container).html("<h2>"+dooittitle+"</h2><button type='button' class='printButton'></button><div class='summaryPrinter'><div id='summaryPreview'></div></div><div class='summarySelector'></div>");
			this.selector();
		}
		summary.display();
		if (this.displayOutput) $(this.container).find('.printButton').bind("click",summary.sendPdf);
	},
	selector:function() {
		var txt='';
		var counted=0;
		for(var p=0;p<this.printable.length;p++) {
			var k=this.printableKey(p);
			if (this.selected[k]) counted++;
			txt+="<div class='selectionLabel"+(this.selected[k]?" on":"")+"' onclick='summary.toggle(this,"+p+");'>"+this.printable[p][1]+"</div>";
			//txt+="<label>"+this.printable[p][1]+"<input type='checkbox' "+(this.selected[this.printable[p][1]]?'checked':'')+" onchange='summary.toggle("+p+");' /></label><br />";
		}
		txt="<div class='selectionPosition'><div class='selectionContainer'><div class='selectionButton' onclick='summary.toggleSelectionDisplay()'><span>click to change</span>"+counted+"/"+this.printable.length+" doo-it"+((this.printable.length==1)?'':'s')+"</div><div class='selectionDisplay' style='display:none;'><div class='selectionList'>"+txt+"</div></div></div></div>";
		$(this.container).find('.summarySelector').html(txt);
	},
	toggleSelectionDisplay:function() {
		var d=$(this.container).find('.selectionDisplay');
		if (d.css("display")=="none") {
			d.slideDown();
			$(this.container).find('.selectionButton span').html('click to hide');
		}else{
			d.slideUp();
			$(this.container).find('.selectionButton span').html('click to change');
		}
	},
	toggle:function(o,p) {
		var k=this.printableKey(p);
		this.selected[k]=!this.selected[k];
		if(this.selected[k]) {
			$(o).addClass("on");
		}else{
			$(o).removeClass("on");
		}
		this.display();
		var counted=0;
		for(var p=0;p<this.printable.length;p++) {
			if (this.selected[this.printableKey(p)]) counted++;
		}
		$('.selectionButton').html('<span>click to hide</span>'+counted+"/"+this.printable.length+" doo-it"+((this.printable.length==1)?'':'s'));
	},
	printableKey:function(i) {
		return this.printable[i][1].replace(/\W+/g,'');
	},
	printJSON:[],
	printH1:function(txt) {
		var op={};
		if (this.printJSON.length>0) op.pageBreak=1;
		if (arguments.length>1) op.fontcolor=arguments[1];
		for(var k in summary.styles.h1) {
			if (op[k]==undefined) op[k]=summary.styles.h1[k];
		}
		op.text=summary.cleanText(txt);
		return op;
	},
	printH2:function(txt) {
		var op={};
		if (arguments.length>1) op.fontcolor=arguments[1];
		for(var k in summary.styles.h2) {
			if (op[k]==undefined) op[k]=summary.styles.h2[k];
		}
		op.text=summary.cleanText(txt);
		return op;
	},
	printH3:function(txt) {
		var op={};
		if (arguments.length>1) op.fontcolor=arguments[1];
		for(var k in summary.styles.h3) {
			if (op[k]==undefined) op[k]=summary.styles.h3[k];
		}
		op.text=summary.cleanText(txt);
		return op;
	},
	printRight:function(txt) {
		var op={};
		if (arguments.length>1) op.fontcolor=arguments[1];
		for(var k in summary.styles.right) {
			if (op[k]==undefined) op[k]=summary.styles.right[k];
		}
		op.text=summary.cleanText(txt);
		return op;
	},
	printIndent:function(txt) {
		var op={};
		if (arguments.length>1) op.fontcolor=arguments[1];
		for(var k in summary.styles.indent) {
			if (op[k]==undefined) op[k]=summary.styles.indent[k];
		}
		op.text=summary.cleanText(txt);
		return op;
	},
	printLabel:function(txt) {
		var op={};
		if (arguments.length>1) op.fontcolor=arguments[1];
		for(var k in summary.styles.label) {
			if (op[k]==undefined) op[k]=summary.styles.label[k];
		}
		op.text=summary.cleanText(txt);
		return op;
	},
	printAnswer:function(txt) {
		var op={};
		if (arguments.length>1) op.fontcolor=arguments[1];
		for(var k in summary.styles.answer) {
			if (op[k]==undefined) op[k]=summary.styles.answer[k];
		}
		op.text=summary.cleanText(txt);
		return op;
	},
	printSpacer:function() {
		var op={};
		for(var k in summary.styles.spacer) {
			if (op[k]==undefined) op[k]=summary.styles.answer[k];
		}
		return op;
	},
	cleanText:function(txt) {
		txt=txt.replace(/[^\>]*$\>/gi,"");
		txt=txt.replace(/[\u2018\u2019]/g,"&sq;");
		txt=txt.replace(/[\u201C\u201D]/g,"&dq;");
		txt=txt.replace(/[\u2014]/g,"-");
		txt=txt.replace(/\<\/div\>\>/gi,"&nl;");
		txt=txt.replace(/\<\/p>]*\>/gi,"&nl;");
		txt=txt.replace(/\<br \/\>/g,"&nl;");
		txt=txt.replace(/\<[^\>]*\>/g,"");
		txt=txt.replace(/&amp;/g,"&");
		txt=txt.replace(/\n/g,"&nl;");
		return txt;
	},
	JSONtoHTML:function(row) {
		var op='<p style="';
		if (row.fontcolor!==undefined && row.fontcolor.length>2) {
			op+='color:'+summary.rgbToHex({r:row.fontcolor[0],g:row.fontcolor[1],b:row.fontcolor[2]})+';';
		}
		if (row.fontsize!==undefined) {
			op+='font-size:'+Math.round(row.fontsize*1.4)+"px;";
		}
		if (row.indent!==undefined) {
			op+='padding-left:'+row.indent+"px;";
		}
		if (row.textalign!==undefined) {
			op+='text-align:'+((row.textalign=="L")?"left":(row.textalign=="R")?"right":"center")+";";
		}
		op+='">';
		if (row.text!==undefined) op+=row.text;
		op+="</p>";
		return op;
	},
	display:function() {
		summary.printJSON=[];
		//summary.printer.clearPages();
		//summary.printer.addCSS(this.flashCSS());
		var txt='';
		for(var p=0;p<this.printable.length;p++) {
			if (this.selected[this.printableKey(p)]==true) {
				if (this.printable[p][0]=="Pdf") {
					if (this.values[this.printable[p][2]].pdf!==undefined && this.values[this.printable[p][2]].pdf.length>0) {
						summary.printJSON.push(summary.printH1(this.printable[p][1]));
						txt+="<h2>"+this.printable[p][1]+"</h2>";
						if (this.values[this.printable[p][2]].completed!==undefined) {
							var comp='Completed: '+inputs.formatDate('g:s a jS F Y',this.values[this.printable[p][2]].completed);
							summary.printJSON.push(summary.printRight(comp));
							txt+="<p style='text-align:right'>"+comp+"</p>";
						}
						for(var l=0;l<this.values[this.printable[p][2]].pdf.length;l++) {
							summary.printJSON.push(this.values[this.printable[p][2]].pdf[l]);
							txt+=this.JSONtoHTML(this.values[this.printable[p][2]].pdf[l]);
						}
					}
				}else if (this.printable[p][0]=="Construct") {
					display_dooit.clearAttached();
					if (this.displayOutput) display_dooit.data=this.values[this.printable[p][2]];
					if (this.displayOutput) display_dooit.value=this.values[this.printable[p][3]];
					display_dooit.defineScoring();
					if (this.printable[p].length>4) {
						for(var i=0;i<this.printable[p][4].length;i++) {
							display_dooit.attachField(this.printable[p][4][i]);
						}
						display_dooit.linkAttached();
					}
					//summary.printer.addPage();
					//summary.printer.addPageText('<h1>'+this.printable[p][1]+'</h1>');
					if (display_dooit.value.summary) {
						summary.printJSON.push(summary.printH1(this.printable[p][1]));
						//summary.printer.addPage();
						//summary.printer.addPageText('<h1>'+this.printable[p][1]+'</h1>');
						
							//if (display_dooit.value.pieChart) summary.printer.addPie(display_dooit.value.pieChart);
						
						//if (display_dooit.value.pieChart) console.log(display_dooit.value.pieChart);
						for(var s=0;s<display_dooit.value.summary.length;s++) {
							var op=display_dooit.value.summary[s];
//console.log(op);
								op=op.replace(/<div/g,'<p');
								op=op.replace(/<\/div/g,'</p');
								//op=op.replace(/<br>/g,'');
								op=op.replace(/<button[^>]*>[^<]*<\/button>/g,'');
								op=op.replace(/<[^\/^>]+><\/[^>]+>/g,'');
								//op=op.replace(/<p^>*>\W*<\/p>/g,'');
								op=op.replace(/&sq;/g,"'");
							if (!(/^<p/.test(op)) && /<p/.test(op)) {
								op='<p>'+op.replace(/<p/,'</p><p');
							}
							summary.printJSON.push(summary.printLabel(op));
//console.log(op);
							//summary.printer.addPageText(op);
						}
					}else if (display_dooit.value.report) {
						summary.printJSON.push(summary.printH1(this.printable[p][1]));
						//summary.printer.addPage();
						//summary.printer.addPageText('<h1>'+this.printable[p][1]+'</h1>'+display_dooit.value.report);
						//summary.printer.addPageText(display_dooit.value.report);
						summary.printJSON.push(summary.printLabel(display_dooit.value.report));
					}else{
						display_dooit.reporting=true;
						//try{
							var opa=display_dooit.render(true);
							for(var a=0;a<opa.length;a++) {
								var op=opa[a];
								if (typeof(op.text)!="undefined") op=op.text;
								txt+=op;
//console.log(op);
								op=op.replace(/<br>/g,'<br />');
								op=op.replace(/<div/g,'<p');
								op=op.replace(/<\/div/g,'</p');
								//op=op.replace(/<br>/g,'');
								op=op.replace(/<button[^>]*>[^<]*<\/button>/g,'');
								//op=op.replace(/<p^>*>\W*<\/p>/g,'');
								op=op.replace(/&sq;/g,"'");
								op=op.replace(/\<img[^\>]*\>/ig,'');
								op=op.replace(/\n/g,"<br />");
								//summary.printer.addPageText(op);
								if (/^\<p>/.test(op) && /<\/p>$/.test(op)) {
									op=op.replace(/^<p>/,'').replace(/<\/p>$/,'');
								}
								var lines=op.split(/\<p class\=.label.[^\>]*\>/i);
//console.log(lines);
								if (lines.length>0) {
									if (/^\<p/.test(lines[0]) && !(/\<p class\=.answer.[^\>]*\>/i.test(lines[l]))) {
										var firstLine=lines.splice(0,1);
										var moreLines=firstLine[0].split(/<\/[^\>]+>/);
										for(var m=moreLines.length-1;m>=0;m--) {
											moreLines[m]=moreLines[m].replace(/<[^\/^>]+><\/[^>]+>/g,'');
											if (moreLines[m]=="") {
												moreLines.splice(m,1);
											}else{
												var tag=moreLines[m].match(/^<([a-z]+)/i);
												if (tag!==null && tag.length>1) moreLines[m]+="</"+tag[1]+">";
												if (/<li/.test(moreLines[m])) {
													moreLines[m]='<p class="indent">'+moreLines[m].replace(/<[^>]+>/g,'')+'</p>';
												}
												if (/^\<p/.test(moreLines[m]) != /<\/p>$/.test(moreLines[m])) {
													var tag=moreLines[m].match(/<\/([a-z]+)>/i);
													if (tag!==null && tag.length>1) moreLines[m]="<"+tag[1]+">"+moreLines[m];
												}
												if (/^\<p/.test(moreLines[m]) && /<\/p>$/.test(moreLines[m])) {
													if (/>[^<]+</.test(moreLines[m])) {
													}else{
														if (/<br \/>/.test(moreLines[m])) {
															moreLines[m]='<br />';
														}else{
															moreLines.splice(m,1);
														}
													}
												}else{
													if (/>[^<]+</.test(moreLines[m])) {
														moreLines[m]='<p>'+moreLines[m]+'</p>';
													}else{
														if (/<br \/>/.test(moreLines[m])) {
															moreLines[m]='<br />';
														}else{
															moreLines.splice(m,1);
														}
													}
												}
											}
										}


										lines=moreLines.concat(lines);
									}
									for(var l=0;l<lines.length;l++) {
										if (!(/<br \/>/.test(lines[l]))) {
											if (/^\<p/.test(lines[l]) != /<\/p>$/.test(lines[l])) {
												if (/^\<p/.test(lines[l])) {
													lines[l]+='</p>';
												}else{
													lines[l]='<p>'+lines[l];
												}
											}else{
												if (!(/^\<p/.test(lines[l]))) lines[l]='<p>'+lines[l];
												if (!(/<\/p>$/.test(lines[l]))) lines[l]+='</p>';
											}
										}
									}
//console.log(lines);
								}
								for(var l=0;l<lines.length;l++) {
									if(lines[l]!="") {
										if (/\<h2[^\>]*\>/i.test(lines[l])) {
											summary.printJSON.push(summary.printH1(lines[l]));
										}else if (/\<h3[^\>]*\>/i.test(lines[l])) {
											summary.printJSON.push(summary.printH2(lines[l]));
										}else if (/^\<p style=.text\-align\:right./i.test(lines[l])) {
											summary.printJSON.push(summary.printRight(lines[l]));
										}else if (/^\<p style=.float\:right./i.test(lines[l])) {
											summary.printJSON.push(summary.printRight(lines[l]));
										}else if (/\<p class\=.answer.[^\>]*\>/i.test(lines[l])) {
											summary.printJSON.push(summary.printSpacer());
											var indentAnswer=false;
											if (/\<p class\=.answer indent[^\>]*\>/i.test(lines[l])) indentAnswer=true;
											var col=[];
											var parts=lines[l].split(/\<p class\=.answer.[^\>]*\>/i);
											if (/\<font/.test(parts[1])) {
												var matches=parts[1].match('/color\:\#([a-f0-9]+)/i');
												if (matches.length>1) {
													var rgb=summary.hexToRGB(matches[1]);
													col=[rgb.r,rgb.g,rgb.b];
												}
											}
											parts[0]=parts[0].replace(/^\<[^\>]+\>/,'').replace(/\<[^\>]+\>$/,'');
											if (parts.length>1) parts[1]=parts[1].replace(/^\<[^\>]+\>/,'').replace(/\<[^\>]+\>$/,'');
											summary.printJSON.push(summary.printLabel(parts[0]));
											if (parts.length>1) {
												if (indentAnswer) {
													if (col.length==3) {
														summary.printJSON.push(summary.printIndent(parts[1],col));
													}else{
														summary.printJSON.push(summary.printIndent(parts[1]));
													}
												}else{
													if (col.length==3) {
														summary.printJSON.push(summary.printAnswer(parts[1],col));
													}else{
														summary.printJSON.push(summary.printAnswer(parts[1]));
													}
												}
											}
										}else{
											summary.printJSON.push(summary.printSpacer());
											var indentAnswer=false;
											if (/\<p class\=.[^\>]*indent[^\>]*\>/i.test(lines[l])) indentAnswer=true;
											if (indentAnswer) {
												summary.printJSON.push(summary.printIndent(lines[l],[150,150,150]));
											}else{
												summary.printJSON.push(summary.printLabel(lines[l],[150,150,150]));
											}
										}
									}
								}
							}
						//}catch(ex) {
						//	summary.printJSON.push(summary.printLabel('There seems to be a problem with data here.',[255,100,100]));
						//}
						display_dooit.reporting=false;
					}
				}else if (this.printable[p][0]=="Report") {
					if (typeof(this.values[this.printable[p][2]].report)=='string') {
						//summary.printer.addPage();
						summary.printJSON.push(summary.printH1(this.printable[p][1]));
						summary.printJSON.push(summary.printLabel(this.paragraphize(this.checkStringReplacements(this.values[this.printable[p][2]].report))));
						//summary.printer.addPageText('<h1>'+this.printable[p][1]+'</h1>'+this.paragraphize(this.checkStringReplacements(this.values[this.printable[p][2]].report)));
					}else if (typeof(this.values[this.printable[p][2]].report)=='object') {
						//summary.printer.addPage();
						summary.printJSON.push(summary.printH1(this.printable[p][1]));
						//summary.printer.addPageText('<h1>'+this.printable[p][1]+'</h1>');
						for(var i=0;i<this.values[this.printable[p][2]].report.length;i++) {
							if (typeof(this.values[this.printable[p][2]].report[i])=="string") {
								summary.printJSON.push(summary.printLabel(this.paragraphize(this.checkStringReplacements(this.values[this.printable[p][2]].report[i]))));
								//summary.printer.addPageText(this.paragraphize(this.checkStringReplacements(this.values[this.printable[p][2]].report[i])));
							}else if(this.values[this.printable[p][2]].report[i].prefix && this.values[this.printable[p][2]].report[i].answer) {
								var rep=this.values[this.printable[p][2]].report[i].prefix+" "+this.values[this.printable[p][2]].report[i].answer;
								if (!(/\.$/.test(rep))) rep+=".";
								summary.printJSON.push(summary.printLabel(this.paragraphize(this.checkStringReplacements(rep))));
								//summary.printer.addPageText(this.paragraphize(this.checkStringReplacements(rep)));
							}
						}
					}
				}else if (this.printable[p][0]=="Surveyor") {
					if (typeof(this.values[this.printable[p][2]])=='object') {
						//summary.printer.addPage();
						summary.printJSON.push(summary.printH1(this.printable[p][1]));
						//summary.printer.addPageText('<h1>'+this.printable[p][1]+'</h1>');
						for(var i=0;i<this.values[this.printable[p][2]].length;i++) {
							if (typeof(this.values[this.printable[p][2]][i])=="object") {
								summary.printJSON.push(summary.printLabel(this.paragraphize(this.checkStringReplacements(this.values[this.printable[p][2]][i].q))));
								//summary.printer.addPageText(this.paragraphize(this.checkStringReplacements(this.values[this.printable[p][2]][i].q)));
								var ans=100*this.values[this.printable[p][2]][i].a/this.values[this.printable[p][2]][i].d;
								var txt=((ans>50)?'':((ans<50)?this.values[this.printable[p][2]][i].low:''));
								if (txt=='') {
									txt=Math.round(ans)+"% "+this.values[this.printable[p][2]][i].high;
								}else{
									txt+=" ("+Math.round(ans)+"% "+this.values[this.printable[p][2]][i].high+")";
								}
								txt='<p class="answer">'+txt+'</p>';
								summary.printJSON.push(summary.printAnswer(txt));
								//summary.printer.addPageText(txt);
							}
						}
					}
				}else if (this.printable[p][0]=="Graph") {
					if (typeof(this.values[this.printable[p][2]].graph)=='object') {
						var graphdata=[];
//graphdata.push([twist,elevation,x-axis,y-axis,numeric x-axis,width,depth,height,axis colour,font size,legend distance;y axis spacing]);
						var maxV=0;
						var minV=0;
						for(var v=0;v<this.values[this.printable[p][2]].graph.data.length;v++) {
							if (maxV<this.values[this.printable[p][2]].graph.data[v][1]) maxV=this.values[this.printable[p][2]].graph.data[v][1];
							if (minV>this.values[this.printable[p][2]].graph.data[v][1]) minV=this.values[this.printable[p][2]].graph.data[v][1];
						}
						//summary.printer.addPage();
						summary.printJSON.push(summary.printH1(this.printable[p][1]));
						//summary.printer.addPageText('<h1>'+this.printable[p][1]+'</h1>');
						if (minV==maxV) {
							summary.printJSON.push(summary.printLabel('Data is not sufficient to produce a graph'));
							//summary.printer.addPageText('<p>Data is not sufficient to produce a graph</p>');
						}else{
							var vh=maxV-minV;
							var divs=1;
							var maxDivs=5;
							while(vh/divs>maxDivs) {
								divs*=10;
							}
							graphdata.push([0.1,1.2,this.values[this.printable[p][2]].graph.x,this.values[this.printable[p][2]].graph.y,false,1200,800,800,"0xbbbbbb",14,40,divs]);
							graphdata.push([this.values[this.printable[p][2]].graph.title,this.values[this.printable[p][2]].graph.positiveColour,this.values[this.printable[p][2]].graph.negativeColour,this.values[this.printable[p][2]].graph.data]);
							//summary.printer.addGraph(graphdata);
						}
						if (typeof(this.values[this.printable[p][2]].graph.report)=="string") {
							summary.printJSON.push(summary.printAnswer(this.values[this.printable[p][2]].graph.report));
							//summary.printer.addPageText(this.values[this.printable[p][2]].graph.report);
						}else if (typeof(this.values[this.printable[p][2]].graph.report)=="object") {
							for(var r=0;r<this.values[this.printable[p][2]].graph.report.length;r++) {
								summary.printJSON.push(summary.printAnswer(this.values[this.printable[p][2]].graph.report[r]));
								//summary.printer.addPageText(this.values[this.printable[p][2]].graph.report[r]);
							}
						}
					}
				}else if (this.printable[p][0]=="Custom") {
					var ins='';
				}
			}
		}
		if (summary.displayOutput) $(summary.container).find('#summaryPreview').html(txt);
		//summary.printer.fillPageWithNotes();
	},
	paragraphize:function(ip) {
		if (!(/^<p/.test(ip))) return "<p>"+ip+"</p>";
		return ip;
	},
	checkStringReplacements:function(ip) {
		ip=ip.replace(/\[[^\]]+\]/g,function(m){
			k=m.replace(/^\[/,'').replace(/\]$/,'');
			if (typeof(summary.values[k])=="string") return summary.values[k];
			return m;
		});
		return ip;
	},
	flashCSS:function() {
		op='';
		op="h1{color:#36469e;font-size:5;display:block;margin:2px;}";
		op+="h2{color:#36469e;font-size:4;display:block;margin:2px;}";
		op+="h3{color:#36469e;font-size:3.8;display:block;margin:2px;}";
		op+="h4{color:#36469e;font-size:3.5;display:block;margin:1px;}";
		op+="p{font-size:3;margin:0px;color:#555555;}";
		op+=".answer{color:#44a901;text-align:right;}";
		op+="span{display:block;}";
		op+=".ans{color:#555555;}";
		op+="b{color:#47aa01;}";
		op+=".red{color:#db1010;}";
		op+=".amber{color:#bc840d;font-size:4;margin:2px;}";
		op+=".green{text-align:right;color:#009900;}";
		op+=".warning{text-align:right;color:#db1010;}";
		op+=".indent{margin-left:20px;color:#888888;}";
		return op;
	},
	sendPdf:function() {
		var user=yoodoo.username;
		if (yoodoo.user.firstname!="") {
			user=yoodoo.user.firstname;
			if (yoodoo.user.lastname!="") {
				user+=' '+yoodoo.user.lastname;
			}
		}
		for(var i=0;i<summary.pdfHeader.length;i++) {
			if (summary.pdfHeader[i]!==undefined && summary.pdfHeader[i].text!==undefined) summary.pdfHeader[i].text=summary.pdfHeader[i].text.replace(/{user}/g,user);
		}
		for(var i=0;i<summary.printJSON.length;i++) {
			if (summary.printJSON[i]!==undefined && summary.printJSON[i].text!==undefined) summary.printJSON[i].text=summary.printJSON[i].text.replace(/{user}/g,user);
		}
			
		yoodoo.toPDF({header:summary.pdfHeader,content:summary.printJSON,filename:summary.fieldConfig.main.title.replace(/{user}/g,user).replace(/[^a-z^0-9]+/ig,'')});
	},
	print:function() {
		summary.printer.print();
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
		var reply={};
		if (this.selectkey!="") {
			var op=dooit.json(this.selected);
			yoodoo.console(op);
			array_of_fields[this.selectkey][1]=op;
			eval('reply.EF'+array_of_fields[this.selectkey][0]+'=op;');
		}
		return reply;
	},
	rgbToHex:function(col) {
		var rgb={r:'00',g:'00',b:'00'};
		rgb.r=col.r.toString(16);
		rgb.g=col.g.toString(16);
		rgb.b=col.b.toString(16);
		while(rgb.r.length<2) rgb.r='0'+rgb.r;
		while(rgb.g.length<2) rgb.g='0'+rgb.g;
		while(rgb.b.length<2) rgb.b='0'+rgb.b;
		return '#'+rgb.r+rgb.g+rgb.b;
	},
	hexToRGB:function(col) {
		col=col.replace('#','');
		var rgb={r:0,g:0,b:0};
		if(col.length==6) {
			rgb.r=parseInt(col.substring(0,2), 16);
			rgb.g=parseInt(col.substring(2,4), 16);
			rgb.b=parseInt(col.substring(4,6), 16);
		}
		return rgb;
	}
}
