
var personal_strengths={
	key:'',
	container:null,
	strengthcontainer:null,
	weaknesscontainer:null,
	selected:null,
	list:null,
	items:[],
	strengthPercentage:0,
	currentWarning:'',
	warningBox:null,
	title:'Your Strengths and Weaknesses',
	teaser:'Help find out what you&apos;re best at - and the things to avoid',
	init:function(key) {
		this.key=key;
		var v=array_of_fields[key][1];
		if (v=='') {
			this.items=[];
		}else{
			this.items=v.split('|');
		}
		strengths=strengths.sort();
		weaknesses=weaknesses.sort();
		this.container=$('.strengths').get(0);
		if (typeof(yoodoo)!="undefined" && yoodoo.dooittitle!="") this.title=yoodoo.dooittitle;
		if (typeof(yoodoo)!="undefined" && yoodoo.dooitteaser!="") this.teaser=yoodoo.dooitteaser;
		this.container.innerHTML='<h2>'+this.title+'</h2><div class="teaser">'+this.teaser+'</div>';
		var ins='<div>Select your strengths...</div>';
		ins+='<div id="availableStrengths" class="list"></div>';
		ins+='<div>Select your weaknesses...</div>';
		ins+='<div id="availableWeaknesses" class="list"></div>';
		ins+='<div style="clear:both"></div>You can choose up to 10 from the above.';
		var tmp=document.createElement("div");
		tmp.id='strengthList';
		$(tmp).html(ins);
		this.container.appendChild(tmp);
		this.selected=$('#selectedStrengths').get(0);
		
		this.skill=document.createElement("div");
		$(this.skill).addClass("left");
		var ins='<div>Drag your strengths &amp; weaknesses into order, with the most accurate at the top.</div>';
		ins+='<div id="selectedStrengths" class="list">';
		ins+='</div><div style="clear:both"></div><div id="maxedout">delete one to add another</div>';
		$(this.skill).html(ins);
		this.container.appendChild(this.skill);
		this.warningBox=document.createElement("div");
		$(this.warningBox).addClass('warningBox');
		this.container.appendChild(this.warningBox);
		var clr=document.createElement("div");
		$(clr).css('clear','both');
		this.container.appendChild(clr);
		this.listSelected();
		this.listAvailable();
		$('#maxedout').slideUp('fast');
	},
	listSelected:function() {
		var ins='';
		var tmp=$('#selectedStrengths');
		tmp.html('');
		for(var s=0;s<this.items.length;s++) {
			var isStrength=this.isStrength(this.items[s]);
			tmp.get(0).appendChild(this.selectedItem(this.items[s],(isStrength?"strong":"weak")));
		}
		$('#selectedStrengths').sortable({handle:'.move',update:function(e,ui){personal_strengths.setOrder(ui);}});
		$('#selectedStrengths .item .delete').bind('click',function() {
			personal_strengths.remove(this);
		});
		this.warning();
	},
	warning:function() {
		var ins='';
		this.strengthPercentage=0;
		for(var s=0;s<this.items.length;s++) {
			if (this.isStrength(this.items[s])) this.strengthPercentage++;
		}
		this.strengthPercentage/=this.items.length;
		this.strengthPercentage*=100;
		if (this.strengthPercentage<30) {
			if (this.items.length<7) {
				ins="Don&apos;t put yourself down. You must be able to find some more Strengths.";
			}else{
				ins="Don&apos;t be so negative. You must be able to find some more Strengths than Weaknesses.";
			}
		}else if (this.strengthPercentage>70) {
			if (this.items.length<7) {
				ins="Are you really so perfect? Be realistic about your Weaknesses.";
			}else{
				ins="Be realistic. Sometimes a Weakness makes you what you are.";
			}
		}else{
			if (this.items.length<3) {
				ins="Have a look through the lists to find which Strengths and Weaknesses you think apply to you.";
			}else if (this.items.length<7) {
				ins="Just a few more may give you insight into yourself.";
			}
		}
		if (ins!=this.currentWarning) {
			this.currentWarning=ins;
			$(this.warningBox).slideUp('fast',function() {
				$(this).html(personal_strengths.currentWarning);
				$(this).slideDown();
			});
		}
	},
	isStrength:function(i) {
		for(var s=0;s<strengths.length;s++) {
			if (i==strengths[s]) return true;
		}
		return false;
	},
	isWeakness:function(i) {
		for(var s=0;s<weaknesses.length;s++) {
			if (i==weaknesses[s]) return true;
		}
		return false;
	},
	listAvailable:function() {
		var ins='';
		for(var s=0;s<strengths.length;s++) {
			if (this.isSelected(strengths[s])<0) ins+='<div class="suggestion strong" title="'+strengths[s]+'"><div>'+strengths[s]+'</div></div>';
		}
		$('#availableStrengths').html(ins);
		$('#availableStrengths>div').bind('click',function() {
			if (personal_strengths.items.length<10) {
				personal_strengths.addStrength($(this).find("div").html());
					$(this).animate({height:'0px'},function() {
						$(this).remove();
					});
			}else{
				$('#maxedout').slideDown('fast');
				setTimeout("$('#maxedout').slideUp('slow');",4000);
			}
		});
		ins='';
		for(var s=0;s<weaknesses.length;s++) {
			if (this.isSelected(weaknesses[s])<0) ins+='<div class="suggestion weak" title="'+weaknesses[s]+'"><div>'+weaknesses[s]+'</div></div>';
		}
		$('#availableWeaknesses').html(ins);
		$('#availableWeaknesses>div').bind('click',function() {
			if (personal_strengths.items.length<10) {
				personal_strengths.addWeakness($(this).find("div").html());
					$(this).animate({height:'0px'},function() {
						$(this).remove();
					});
			}else{
				$('#maxedout').slideDown('fast');
				setTimeout("$('#maxedout').slideUp('slow');",4000);
			}
		});
	},
	selectedItem:function(o,c) {
		var tmp=document.createElement("div");
		$(tmp).addClass("item");
		$(tmp).addClass(c);
		tmp.title=o;
		$(tmp).html('<div class="move">'+o+'</div><div class="delete"></div>');
		return tmp;
	},
	addStrength:function(o) {
		this.items.push(o);
		var n=this.selectedItem(o,'strong');
		$('#selectedStrengths').get(0).appendChild(n);
		$(n).fadeIn('slow',function() {personal_strengths.listSelected();});
	},
	addWeakness:function(o) {
		this.items.push(o);
		var n=this.selectedItem(o,'weak');
		$('#selectedStrengths').get(0).appendChild(n);
		$(n).fadeIn('slow',function() {personal_strengths.listSelected();});
	},
	isSelected:function(o) {
		for ( var i=0;i<this.items.length;i++) {
			if (this.items[i]==o) return i;
		}
		return -1;
	},
	remove:function(o) {
		//$(o.parentNode).fadeOut('fast',function() {
			$(o.parentNode).animate({height:'0px'},function() {
				var i=personal_strengths.isSelected($(this).find('.move').html());
				personal_strengths.items.splice(i,1);
				$(this).remove();
				personal_strengths.listAvailable();
				personal_strengths.warning();
			});
		//});
				
		/*fade.start(o.parentNode,{from:100,to:0,callback:function(o) {
			resizer.resize(o,{toHeight:0,callback:function(o) {
				personal_strengths.items.splice(personal_strengths.isSelected(obj('.move',o).innerHTML),1);
				personal_strengths.listAvailable();
			}});
		}});*/
	},
	setOrder:function(ui) {
		var o=[];
		var neworder=$(ui.item[0].parentNode).find('.move').get();
		for(var k=0;k<neworder.length;k++) {
			o.push(neworder[k].innerHTML);
		}
		this.items=o;
	},
	finishable:function() {
		return (this.items.length>0);
	},
	output:function() {
		array_of_fields[this.key][1]=this.items.join("|");
		var reply={};
		eval('reply.EF'+array_of_fields[this.key][0]+'=array_of_fields[this.key][1];');
		//console.log(reply);
		return reply;
	}
};
dooit.temporaries('personal_strengths');
