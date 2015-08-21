var thomas={
	//thomasURL:'http://www.thomasinternational.net/thomas_admin/WhitePage/Receive2.asp',
	thomasURL:yoodoo.option.baseUrl+'tests/thomasForm.php',
	timeoutDelay:20000,
	tagRules:{groups:{},rules:[]},
	doTagRules:true,
	posts:{
		PPADISCScores:'1',
		Motivator:'1',
		AdminId:'200.109.153',
		userpass:'4Y99dxxPPZ8',
		RefId:'ACCTEST20120216_1',
		TransactionType:'2',
		salute:'1',
		Name1:'Bob',
		Name2:'Thomas',
		Gender:'1',
		adviceLevel:'',
		HJATransactionType:'',
		JobRefId:'',
		JobTitle:'',
		EvaluatorSalute:'',
		EvaluatorName1:'',
		EvaluatorName2:'',
		EvaluatorGender:'',
		EvaluatorRefId:'',
		adviceLevel:'',
		emailaddress:'donotreply@yoodoo.biz',
		FTP:'0',
		LangId:4,
		r:['','1','','','', '','','','','', '','','','','', '','1','','','', '','','','','', '','','','','', ''],
		j:['','','','','', '','','','','', '','','','','', '','','','','', '','','','']
	},
	gotResults:function(answers) {
		var ins='';
		for(var i=0;i<display_dooit.data.structure.length;i++) {
			if (display_dooit.data.structure[i].value.type!="paragraph") {
				var ans=display_dooit.type_value[display_dooit.data.structure[i].value.type](display_dooit.data.structure[i].id,display_dooit.data.structure[i].value.option,0);
				ins+="<div>"+display_dooit.data.structure[i].title+": <span>"+ans.join(",")+"</span> <em>"+display_dooit.value.times[display_dooit.data.structure[i].id]+"s</em></div>";
			}
		}
		display_dooit.result_report(ins);
        	yoodoo.working(false);
	},
	getResults:function() {
		dooit.leave();
        	yoodoo.stopVoiceover();
        	var p=dooit.values();
        	p.cmd='thomas';
        	p.dooit=yoodoo.lastLoad;
        	p.completed=dooit.finishable()?'1':'0';
		var answer={m:[],l:[]};
		for(var k in display_dooit.value) {
			if (/thomas[\d]+[ml]/.test(k)) {
				
		
				//console.log(display_dooit.value[k]);
				var val='blank';
				for(var i=0;i<display_dooit.value[k][0].length;i++) {
					if (display_dooit.value[k][0][i]=="1") val=i+1;
					//console.log(k,display_dooit.value[k][i],i);
				}
				var d=k.match(/thomas([\d]+)[ml]/);
				var ml=k.match(/thomas[\d]+([ml])/);
				//console.log(d,ml,i);
				answer[ml[1]][d[1]-1]=val.toString();
			}
		}
        //if (typeof(dooit.completed)!="undefined") p.completed=dooit.completed();
        	p.callback='thomas.gotResults';
        	yoodoo.working(true,'Calculating your score');
        	yoodoo.sendPost(null,p,false);
//console.log("Thomas saved");
		//yoodoo.saveDooit();
		return false;
	},
	reply:function(reply) {
		console.log(reply);
        	yoodoo.working(false);
	},
	done:function() {
		if (display_dooit.value.report!="") {
			return true;
		}else{
			if (dooit.finishable()) {
				this.getScores(this.save);
			}else{
				return false;
			}
		}
	},
	completedQuiz:function() {
		if (dooit.finishable()) {
			thomas.getScores();
		}
	},
	getScores:function() {
		if (window.attachEvent) {
		    window.attachEvent('onmessage',thomas.gotScores);
		}else{
		    window.addEventListener('message',thomas.gotScores,false);
		}
        	yoodoo.working(true,'Calculating your score');
		this.getScoresComplete=function(reply){yoodoo.working(false);};
		if (arguments.length>0) this.getScoresComplete=arguments[0];
		if (typeof(this.iframe)=="object") $(this.iframe).remove();
		this.iframe=document.createElement("iframe");
		this.iframe.id='thomasPoster';
		$(this.iframe).css("width","1px");
		$(this.iframe).css("height","1px");

                var op='';
                op+="<html><head></head><body><form id='thomasPost' action='"+this.thomasURL+"' method='POST'>";
		var reprint=true;
		if (display_dooit.value.refID==undefined || display_dooit.value.refID.length!=20) {
			display_dooit.value.refID=new Date().getTime()+MD5(yoodoo.sitehash+yoodoo.username);
			display_dooit.value.refID=display_dooit.value.refID.substring(0,20);
			reprint=false;
		}
		op+="<input type='text' name='refid' value='"+display_dooit.value.refID+"' />";
		op+="<input type='text' name='reprint' value='"+(reprint?"2":"1")+"' />";
		var answer={m:[],l:[]};
		for(var k in display_dooit.value) {
			if (/thomas[\d]+[ml]/.test(k)) {
				
		
				//console.log(display_dooit.value[k]);
				var val='blank';
				for(var i=0;i<display_dooit.value[k][0].length;i++) {
					if (display_dooit.value[k][0][i]=="1") val=i+1;
					//console.log(k,display_dooit.value[k][i],i);
				}
				var d=k.match(/thomas([\d]+)[ml]/);
				var ml=k.match(/thomas[\d]+([ml])/);
				//console.log(d,ml,i);
				answer[ml[1]][d[1]-1]=val.toString();
			}
		}
		while(answer.m.length<24) answer.m.push('2');
		while(answer.l.length<24) answer.l.push('2');
		for(var k in answer) {
			for(var i=0;i<answer[k].length;i++) {
				op+="<input type='text' name='"+k+i.toString()+"' value='"+answer[k][i]+"' />";
			}
		}
		/*for(var k in this.posts) {
			if (typeof(this.posts[k])=="object") {
				for(var i=0;i<this.posts[k].length;i++) {
					op+="<input type='text' name='"+k+"' value='"+this.posts[k][i]+"' />";
				}
			}else{
				op+="<input type='text' name='"+k+"' value='"+this.posts[k]+"' />";
			}
		}*/
                op+="</form>";
                op+="<script type='text/javascript'>document.getElementById('thomasPost').submit();</script>";
                op+="</body></html>";
		document.body.appendChild(this.iframe);
            var doc = this.iframe.document;
            if(this.iframe.contentDocument) {
                doc = this.iframe.contentDocument; // For NS6
            } else if(this.iframe.contentWindow) {
                doc = this.iframe.contentWindow.document; // For IE5.5 and IE6
            } else if(this.iframe.document) {
                doc = this.iframe.document; // default*/
            }
		//doc.domain='www.yoodoo.biz';
            if (doc!==null) {
                doc.open();

                doc.writeln(op);
                doc.close();
               // this.timeout=setTimeout('thomas.cancelPost()',this.timeoutDelay);
		$(this.iframe).bind("message",function(reply){console.log(reply);});

                $(this.iframe).bind('load',function() {
                    var frw=thomas.iframe.contentWindow;
                    if (frw.postMessage) {
                        frw.postMessage('send',yoodoo.option.baseUrl);
                    }
                });
               // $(this.iframe).bind('load',function() {
			//try{
			//console.log(thomas.iframe.location);
			//}catch(ex) {
			//	console.log(ex);
			//}
			//thomas.gotScores(thomas.iframe.src);
               // });
            }
	},

    removePostResponder:function() {
        if (window.detachEvent) {
            window.detachEvent('onmessage');
        }else{
            window.removeEventListener('message',false);
        }
    },
	cancelPost:function() {
		thomas.removePostResponder();
		if (typeof(thomas.iframe)=="object") $(thomas.iframe).remove();
	},
	gotScores:function(e) {
		thomas.removePostResponder();
		var val={};
		try{
			eval('val='+e.data+';');
		}catch(ex){}
		
		display_dooit.result_report(thomas.verbose(val));
		if (thomas.doTagRules) thomas.checkTags();
		//$(display_dooit.container).find('.result_report .thomasScores').fadeIn();
		thomas.getScoresComplete();
		if (typeof(thomas.iframe)=="object") $(thomas.iframe).remove();
	},
	verbose:function(data) {
		var op='';
		var scores={D:[0,0,0],I:[0,0,0],S:[0,0,0],C:[0,0,0]};
		for(var k in data) {
			if (/^[DISC][123]/.test(k)) {
				var l=k.replace(/[123]/,'');
				var n=k.replace(/[DISC]/,'');
				scores[l][n-1]=data[k];
			}
		}
		display_dooit.value.disc=scores;
		this.translate();
		return this.barGraph(scores);
	},
	barGraph:function(scores) {
		var op='';
		op+="<div class='thomasHeadings'><div class='thomasHeading'>Dominance</div><div class='thomasHeading'>Influence</div><div class='thomasHeading'>Steadiness</div><div class='thomasHeading'>Compliance</div></div>";
		op+="<div class='thomasLeft'>Work mask<br />Behaviour under pressure<br />Self image</div>";
		for(var i=0;i<3;i++) {
			var maxed={D:0,I:0,S:0,C:0};
			var mined={D:0,I:0,S:0,C:0};
			var maxh=0;
			var minh=0;
			for(var k in scores) {
				//for(var n=0;n<1;n++) {
				for(var n=0;n<scores[k].length;n++) {
					if (maxed[k][n]<scores[k][n]) maxed[k][n]=scores[k][n];
					if (mined[k][n]>scores[k][n]) mined[k][n]=scores[k][n];
					if (maxh<scores[k][n]) maxh=scores[k][n];
					if (minh>scores[k][n]) minh=scores[k][n];
				}
			}
			maxh=10;
			minh=-10;
			var maxheight=100;
			var offseth=(-minh)*(maxheight/(maxh-minh));
			var dh=(maxheight/(maxh-minh));
			op+="<div class='thomasScores' style='display:block'>";
			for(var k in scores) {
				var h=Math.round(Math.sqrt(Math.pow(scores[k][i],2))*dh);
				var mb=offseth;
				if (scores[k][i]<0) mb+=scores[k][i]*dh;
				var mt=maxh*dh;
				if (scores[k][i]>0) mt-=scores[k][i]*dh;
				mt=Math.round(mt);
				mb=Math.round(mb);
				var col='';
				if (scores[k][i]>0) {
					col=this.colour(100*scores[k][i]/maxh);
				}else{
					col=this.colour(100*scores[k][i]/minh);
				}
				op+="<div class='thomasScore"+((scores[k][i]<0)?" negative":"")+"' style='height:"+h+"px;margin-top:"+mt+"px;margin-bottom:"+mb+"px;background:"+col+";'><div><span style='color:"+col+"'>"+scores[k][i]+"</span></div></div>";
			}
			op+="</div>";
		}
		return op;
	},
	lineGraph:function() {
		var w=100;
		var h=100;
		var padding=10;
		if (display_dooit.value.discGraph!=undefined) {
			$('.result_report').html('<div style="position:relative"></div>');
			var cont=$('.result_report div').get(0);
			this.paper = Raphael(10, 50, 320, 200);
			console.log(this.paper);
			cont.appendChild(this.paper.canvas);
			$(this.paper.canvas).css("position","static");
			$(this.paper.canvas).css("width","100%");
			$(this.paper.canvas).css("height","100%");
			this.drawLine([[0,12],[w,12]]);
			this.drawLine([[0,50],[w,50]]);
			this.drawLine([[0,88],[w,88]]);
			this.lines=[];
			for(var i=0;i<3;i++) {
				this.paper.rect(((w+padding)*i),0,w,h);
				var points=[];
				points.push([((w+padding)*i)+Math.round(w*0/3),display_dooit.value.discGraph.D[i]]);
				points.push([((w+padding)*i)+Math.round(w*1/3),display_dooit.value.discGraph.I[i]]);
				points.push([((w+padding)*i)+Math.round(w*2/3),display_dooit.value.discGraph.S[i]]);
				points.push([((w+padding)*i)+Math.round(w*3/3),display_dooit.value.discGraph.C[i]]);
				this.lines.push(this.drawLine(points));
			}
		}
	},
	drawLine:function(points) {
		var p=[];
		for(var i=0;i<points.length;i++) {
			p.push(points[i].join(","));
		}
		return this.paper.path("M"+p.join("L"));
	},
	translate:function() {
		var g={};
		for(var l in display_dooit.value.disc) {
			g[l]=[0,0,0];
			for(var i=0;i<3;i++) {
				var v=display_dooit.value.disc[l][i];
				var idx=-1;
				var gv=-1;
				for(var j=0;j<this.translation[i][l].length;j++) {
					if (v==this.translation[i][l][j][0]) {
						idx=j;
						gv=this.translation[i][l][j][1];
					}
				}
				if(idx<0) {
					for(var j=0;j<this.translation[i][l].length-1;j++) {
							if (v>this.translation[i][l][j][0] && v<this.translation[i][l][j+1][0]) {
								var p=(v-this.translation[i][l][j][0])/(this.translation[i][l][j+1][0]-this.translation[i][l][j][0]);
								gv=(p*(this.translation[i][l][j+1][1]-this.translation[i][l][j][1]))+this.translation[i][l][j][1];
							}
						
					}
				}
				if(gv<0) {
					if (v<this.translation[i][l][0][0]) {
						var p=(this.translation[i][l][1][0]-v)/(this.translation[i][l][1][0]-this.translation[i][l][0][0]);
						gv=this.translation[i][l][1][1]-(p*(this.translation[i][l][1][1]-this.translation[i][l][0][1]));
					}
					var lidx=this.translation[i][l].length-1;
					if (v>this.translation[i][l][lidx][0]) {
						var p=(v-this.translation[i][l][lidx-1][0])/(this.translation[i][l][lidx][0]-this.translation[i][l][lidx-1][0]);
						gv=this.translation[i][l][lidx][1]+(p*(this.translation[i][l][lidx][1]-this.translation[i][l][lidx-1][1]));
					}
				}
				if(gv>100) gv=100;
				if(gv<0) gv=0;
				g[l][i]=gv;
			}
		}
		display_dooit.value.discGraph=g;
	},
	greyZones:12.5,
	translation:[
		{
			D:[
				[0,7.8],
				[1,13.1],
				[2,25.1],
				[3,32],
				[4,36.2],
				[5,39.5],
				[6,46],
				[7,52.2],
				[8,61.5],
				[9,68.7],
				[10,75.6],
				[12,79.4],
				[14,83.1],
				[15,87.9],
				[16,91.5],
				[20,94.8]
			],
			I:[
				[0,12],
				[1,21.2],
				[2,28.4],
				[3,38.9],
				[4,49.5],
				[5,60.5],
				[6,66.6],
				[7,75.3],
				[8,81],
				[9,86],
				[10,90.5],
				[17,94.8]
			],
			S:[
				[0,20.6],
				[1,26.1],
				[2,30.9],
				[3,41.6],
				[4,46.2],
				[5,53.7],
				[6,59.7],
				[7,65.3],
				[8,71.1],
				[9,75.2],
				[10,80.6],
				[11,86.3],
				[12,91.4],
				[19,94.7]
			],
			C:[
				[0,8],
				[1,22.8],
				[2,29],
				[3,42.9],
				[4,53],
				[5,65.4],
				[6,73.1],
				[7,78.8],
				[8,86.7],
				[9,90.8],
				[15,94.5]
			]
		},{
			D:[
				[21,4.4],
				[16,10.4],
				[15,13.8],
				[14,17.3],
				[13,20.9],
				[12,24.5],
				[11,27.9],
				[10,31.7],
				[9,35.1],
				[8,38.6],
				[7,42.3],
				[6,45.6],
				[5,49.8],
				[4,54],
				[3,60.3],
				[2,75.2],
				[1,86.9],
				[0,94.5]
			],
			I:[
				[19,4.4],
				[11,11.9],
				[10,16.1],
				[9,19.7],
				[8,23.1],
				[7,28.4],
				[6,35.4],
				[5,44.7],
				[4,49.8],
				[3,59.7],
				[2,73.7],
				[1,86.9],
				[0,94.5]
			],
			S:[
				[19,4.5],
				[13,8.3],
				[12,12],
				[11,18],
				[10,25.4],
				[9,28.7],
				[8,35.4],
				[7,43.7],
				[6,50.6],
				[5,57.3],
				[4,65.3],
				[3,79.5],
				[2,87],
				[1,90.9],
				[0,94.7]
			],
			C:[
				[16,4.5],
				[13,8.3],
				[12,12.3],
				[11,19.8],
				[10,27.5],
				[9,33.9],
				[8,42],
				[7,47.6],
				[6,52.1],
				[5,58.8],
				[4,69.2],
				[3,78.6],
				[2,86.9],
				[1,91.1],
				[0,94.7]
			]
		},{
			D:[
				[-21,6.8],
				[-14,10.2],
				[-13,13.4],
				[-11,17.1],
				[-10,20.9],
				[-9,24.6],
				[-7,28.2],
				[-6,32],
				[-4,35.7],
				[-3,39.5],
				[-2,42.8],
				[0,46.5],
				[1,51],
				[3,54.5],
				[5,58.2],
				[7,62.6],
				[8,66.3],
				[9,70.7],
				[10,74.7],
				[12,78.5],
				[13,82.2],
				[14,86],
				[15,89.6],
				[16,92.6],
				[20,95.9]
			],
			I:[
				[-19,6.9],
				[-10,12.6],
				[-9,16.1],
				[-8,20.4],
				[-7,24.8],
				[-6,28.4],
				[-5,32.1],
				[-4,35.9],
				[-3,39.6],
				[-2,44.6],
				[-1,48],
				[0,52.8],
				[1,58.2],
				[2,62.7],
				[3,67.1],
				[4,71.1],
				[5,75.8],
				[6,80.1],
				[7,84.9],
				[8,89.9],
				[9,92.7],
				[17,96]
			],
			S:[
				[-19,6.9],
				[-12,10.4],
				[-11,13.5],
				[-10,17.3],
				[-9,20.9],
				[-8,24.8],
				[-7,28.2],
				[-6,32.1],
				[-5,35.7],
				[-4,39.6],
				[-3,42.9],
				[-2,46.4],
				[-1,51],
				[0,55.2],
				[1,59.4],
				[2,63.5],
				[3,67.1],
				[4,71],
				[5,75.2],
				[7,78.6],
				[8,82.4],
				[9,86],
				[10,89.9],
				[11,92.7],
				[19,95.9]
			],
			C:[
				[-16,6.9],
				[-12,12.6],
				[-11,16.1],
				[-10,20.9],
				[-9,24.8],
				[-8,28.2],
				[-7,32.1],
				[-6,37.1],
				[-5,40.7],
				[-4,44.6],
				[-3,48.2],
				[-2,53.1],
				[-1,57.9],
				[0,63.3],
				[1,67.2],
				[2,73.7],
				[3,77.3],
				[4,80.9],
				[5,84.8],
				[6,89.7],
				[7,92.9],
				[15,96]
			]
		}
	],
	save:function() {
		yoodoo.saveDooit();
        	yoodoo.working(false);
	},
	colour:function(p) {
		var top=[0,0,255];
		var col=[100,100,100];
		var bottom=[255,0,0];
		if (p>0) {
			col[0]+=(top[0]-col[0])*(p/100);
			col[1]+=(top[1]-col[1])*(p/100);
			col[2]+=(top[2]-col[2])*(p/100);
		}else{
			col[0]+=(bottom[0]-col[0])*(-p/100);
			col[1]+=(bottom[1]-col[1])*(-p/100);
			col[2]+=(bottom[2]-col[2])*(-p/100);
		}
		for(var i=0;i<col.length;i++) {
			col[i]=Math.round(col[i]);
		}
		var rgb=[col[0].toString(16),col[1].toString(16),col[2].toString(16)];
		for(var i=0;i<rgb.length;i++) {
			while (rgb[i].length<2) {
				rgb[i]='0'+rgb[i];
			}
		}
    		return'#' + rgb.join('');
	},
	checkTags:function() {
		var listed=[[],[],[]];
		for(var i=0;i<3;i++) {
			for(var k in display_dooit.value.disc) listed[i].push([k,display_dooit.value.disc[k][i]]);
			listed[i].sort(function(a,b){return b[1]-a[1];});
		}
		for(var i=0;i<this.tagRules.rules.length;i++) {
			var setMatched=false;
			var setMatches=[];
			var type=this.tagRules.rules[i].scoreType;
			for(var c=0;c<this.tagRules.rules[i].checks.length;c++) {
				var matched=false;
				var matches=[];
				var v=display_dooit.value.disc[this.tagRules.rules[i].checks[c].score][type];
				for(var com=0;com<this.tagRules.rules[i].checks[c].comparison.length;com++) {
					var res=false;
					var compeval=this.tagRules.rules[i].checks[c].comparison[com];
					thomas.thisRuleType=this.tagRules.rules[i].scoreType;
					compeval=compeval.replace(/([DISC])/g,function(s,ii) {return display_dooit.value.disc[ii][thomas.thisRuleType];});
					try{
						eval('res=(v'+compeval+');');
					}catch(ex){}
					matches.push(res);
				}
				if (this.tagRules.rules[i].checks[c].highest==true) {
					matches.push(listed[type][0][0]==this.tagRules.rules[i].checks[c].score);
				}
				if (this.tagRules.rules[i].checks[c].lowest==true) {
					matches.push(listed[type][3][0]==this.tagRules.rules[i].checks[c].score);
				}
				if (this.tagRules.rules[i].checks[c].index!=undefined) {
					matches.push(listed[type][this.tagRules.rules[i].checks[c].index][0]==this.tagRules.rules[i].checks[c].score);
				}
				var bool='and'
				if (this.tagRules.rules[i].checks[c].bool!=undefined) bool=this.tagRules.rules[i].checks[c].bool;
				if (bool=="and") {
					matched=true;
					for(var m=0;m<matches.length;m++) {
						if (!matches[m]) matched=false;
					}
				}else{
					for(var m=0;m<matches.length;m++) {
						if (matches[m]) matched=true;
					}
				}
				setMatches.push(matched);
			}
			var bool='and'
			if (this.tagRules.rules[i].bool!=undefined) bool=this.tagRules.rules[i].bool;
			if (bool=="and") {
				setMatched=true;
				for(var m=0;m<setMatches.length;m++) {
					if (!setMatches[m]) setMatched=false;
				}
			}else{
				for(var m=0;m<setMatches.length;m++) {
					if (setMatches[m]) setMatched=true;
				}
			}
			if (setMatched || this.tagRules.rules[i].remove) {
				if (matched) {
					dooit.addTag(this.tagRules.rules[i].tag);
					if (this.tagRules.rules[i].unique) {
						for(var t=0;t<this.tagRules.groups[this.tagRules.rules[i].group].length;t++) {
							if (this.tagRules.groups[this.tagRules.rules[i].group][t]!=this.tagRules.rules[i].tag)  dooit.removeTag(this.tagRules.groups[this.tagRules.rules[i].group][t]);
						}
					}
				}else{
					dooit.removeTag(this.tagRules.rules[i].tag);
				}
			}
		}
	}
}
var MD5 = function (string) {
 
	function RotateLeft(lValue, iShiftBits) {
		return (lValue<<iShiftBits) | (lValue>>>(32-iShiftBits));
	}
 
	function AddUnsigned(lX,lY) {
		var lX4,lY4,lX8,lY8,lResult;
		lX8 = (lX & 0x80000000);
		lY8 = (lY & 0x80000000);
		lX4 = (lX & 0x40000000);
		lY4 = (lY & 0x40000000);
		lResult = (lX & 0x3FFFFFFF)+(lY & 0x3FFFFFFF);
		if (lX4 & lY4) {
			return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
		}
		if (lX4 | lY4) {
			if (lResult & 0x40000000) {
				return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
			} else {
				return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
			}
		} else {
			return (lResult ^ lX8 ^ lY8);
		}
 	}
 
 	function F(x,y,z) { return (x & y) | ((~x) & z); }
 	function G(x,y,z) { return (x & z) | (y & (~z)); }
 	function H(x,y,z) { return (x ^ y ^ z); }
	function I(x,y,z) { return (y ^ (x | (~z))); }
 
	function FF(a,b,c,d,x,s,ac) {
		a = AddUnsigned(a, AddUnsigned(AddUnsigned(F(b, c, d), x), ac));
		return AddUnsigned(RotateLeft(a, s), b);
	};
 
	function GG(a,b,c,d,x,s,ac) {
		a = AddUnsigned(a, AddUnsigned(AddUnsigned(G(b, c, d), x), ac));
		return AddUnsigned(RotateLeft(a, s), b);
	};
 
	function HH(a,b,c,d,x,s,ac) {
		a = AddUnsigned(a, AddUnsigned(AddUnsigned(H(b, c, d), x), ac));
		return AddUnsigned(RotateLeft(a, s), b);
	};
 
	function II(a,b,c,d,x,s,ac) {
		a = AddUnsigned(a, AddUnsigned(AddUnsigned(I(b, c, d), x), ac));
		return AddUnsigned(RotateLeft(a, s), b);
	};
 
	function ConvertToWordArray(string) {
		var lWordCount;
		var lMessageLength = string.length;
		var lNumberOfWords_temp1=lMessageLength + 8;
		var lNumberOfWords_temp2=(lNumberOfWords_temp1-(lNumberOfWords_temp1 % 64))/64;
		var lNumberOfWords = (lNumberOfWords_temp2+1)*16;
		var lWordArray=Array(lNumberOfWords-1);
		var lBytePosition = 0;
		var lByteCount = 0;
		while ( lByteCount < lMessageLength ) {
			lWordCount = (lByteCount-(lByteCount % 4))/4;
			lBytePosition = (lByteCount % 4)*8;
			lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount)<<lBytePosition));
			lByteCount++;
		}
		lWordCount = (lByteCount-(lByteCount % 4))/4;
		lBytePosition = (lByteCount % 4)*8;
		lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80<<lBytePosition);
		lWordArray[lNumberOfWords-2] = lMessageLength<<3;
		lWordArray[lNumberOfWords-1] = lMessageLength>>>29;
		return lWordArray;
	};
 
	function WordToHex(lValue) {
		var WordToHexValue="",WordToHexValue_temp="",lByte,lCount;
		for (lCount = 0;lCount<=3;lCount++) {
			lByte = (lValue>>>(lCount*8)) & 255;
			WordToHexValue_temp = "0" + lByte.toString(16);
			WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length-2,2);
		}
		return WordToHexValue;
	};
 
	function Utf8Encode(string) {
		string = string.replace(/\r\n/g,"\n");
		var utftext = "";
 
		for (var n = 0; n < string.length; n++) {
 
			var c = string.charCodeAt(n);
 
			if (c < 128) {
				utftext += String.fromCharCode(c);
			}
			else if((c > 127) && (c < 2048)) {
				utftext += String.fromCharCode((c >> 6) | 192);
				utftext += String.fromCharCode((c & 63) | 128);
			}
			else {
				utftext += String.fromCharCode((c >> 12) | 224);
				utftext += String.fromCharCode(((c >> 6) & 63) | 128);
				utftext += String.fromCharCode((c & 63) | 128);
			}
 
		}
 
		return utftext;
	};
 
	var x=Array();
	var k,AA,BB,CC,DD,a,b,c,d;
	var S11=7, S12=12, S13=17, S14=22;
	var S21=5, S22=9 , S23=14, S24=20;
	var S31=4, S32=11, S33=16, S34=23;
	var S41=6, S42=10, S43=15, S44=21;
 
	string = Utf8Encode(string);
 
	x = ConvertToWordArray(string);
 
	a = 0x67452301; b = 0xEFCDAB89; c = 0x98BADCFE; d = 0x10325476;
 
	for (k=0;k<x.length;k+=16) {
		AA=a; BB=b; CC=c; DD=d;
		a=FF(a,b,c,d,x[k+0], S11,0xD76AA478);
		d=FF(d,a,b,c,x[k+1], S12,0xE8C7B756);
		c=FF(c,d,a,b,x[k+2], S13,0x242070DB);
		b=FF(b,c,d,a,x[k+3], S14,0xC1BDCEEE);
		a=FF(a,b,c,d,x[k+4], S11,0xF57C0FAF);
		d=FF(d,a,b,c,x[k+5], S12,0x4787C62A);
		c=FF(c,d,a,b,x[k+6], S13,0xA8304613);
		b=FF(b,c,d,a,x[k+7], S14,0xFD469501);
		a=FF(a,b,c,d,x[k+8], S11,0x698098D8);
		d=FF(d,a,b,c,x[k+9], S12,0x8B44F7AF);
		c=FF(c,d,a,b,x[k+10],S13,0xFFFF5BB1);
		b=FF(b,c,d,a,x[k+11],S14,0x895CD7BE);
		a=FF(a,b,c,d,x[k+12],S11,0x6B901122);
		d=FF(d,a,b,c,x[k+13],S12,0xFD987193);
		c=FF(c,d,a,b,x[k+14],S13,0xA679438E);
		b=FF(b,c,d,a,x[k+15],S14,0x49B40821);
		a=GG(a,b,c,d,x[k+1], S21,0xF61E2562);
		d=GG(d,a,b,c,x[k+6], S22,0xC040B340);
		c=GG(c,d,a,b,x[k+11],S23,0x265E5A51);
		b=GG(b,c,d,a,x[k+0], S24,0xE9B6C7AA);
		a=GG(a,b,c,d,x[k+5], S21,0xD62F105D);
		d=GG(d,a,b,c,x[k+10],S22,0x2441453);
		c=GG(c,d,a,b,x[k+15],S23,0xD8A1E681);
		b=GG(b,c,d,a,x[k+4], S24,0xE7D3FBC8);
		a=GG(a,b,c,d,x[k+9], S21,0x21E1CDE6);
		d=GG(d,a,b,c,x[k+14],S22,0xC33707D6);
		c=GG(c,d,a,b,x[k+3], S23,0xF4D50D87);
		b=GG(b,c,d,a,x[k+8], S24,0x455A14ED);
		a=GG(a,b,c,d,x[k+13],S21,0xA9E3E905);
		d=GG(d,a,b,c,x[k+2], S22,0xFCEFA3F8);
		c=GG(c,d,a,b,x[k+7], S23,0x676F02D9);
		b=GG(b,c,d,a,x[k+12],S24,0x8D2A4C8A);
		a=HH(a,b,c,d,x[k+5], S31,0xFFFA3942);
		d=HH(d,a,b,c,x[k+8], S32,0x8771F681);
		c=HH(c,d,a,b,x[k+11],S33,0x6D9D6122);
		b=HH(b,c,d,a,x[k+14],S34,0xFDE5380C);
		a=HH(a,b,c,d,x[k+1], S31,0xA4BEEA44);
		d=HH(d,a,b,c,x[k+4], S32,0x4BDECFA9);
		c=HH(c,d,a,b,x[k+7], S33,0xF6BB4B60);
		b=HH(b,c,d,a,x[k+10],S34,0xBEBFBC70);
		a=HH(a,b,c,d,x[k+13],S31,0x289B7EC6);
		d=HH(d,a,b,c,x[k+0], S32,0xEAA127FA);
		c=HH(c,d,a,b,x[k+3], S33,0xD4EF3085);
		b=HH(b,c,d,a,x[k+6], S34,0x4881D05);
		a=HH(a,b,c,d,x[k+9], S31,0xD9D4D039);
		d=HH(d,a,b,c,x[k+12],S32,0xE6DB99E5);
		c=HH(c,d,a,b,x[k+15],S33,0x1FA27CF8);
		b=HH(b,c,d,a,x[k+2], S34,0xC4AC5665);
		a=II(a,b,c,d,x[k+0], S41,0xF4292244);
		d=II(d,a,b,c,x[k+7], S42,0x432AFF97);
		c=II(c,d,a,b,x[k+14],S43,0xAB9423A7);
		b=II(b,c,d,a,x[k+5], S44,0xFC93A039);
		a=II(a,b,c,d,x[k+12],S41,0x655B59C3);
		d=II(d,a,b,c,x[k+3], S42,0x8F0CCC92);
		c=II(c,d,a,b,x[k+10],S43,0xFFEFF47D);
		b=II(b,c,d,a,x[k+1], S44,0x85845DD1);
		a=II(a,b,c,d,x[k+8], S41,0x6FA87E4F);
		d=II(d,a,b,c,x[k+15],S42,0xFE2CE6E0);
		c=II(c,d,a,b,x[k+6], S43,0xA3014314);
		b=II(b,c,d,a,x[k+13],S44,0x4E0811A1);
		a=II(a,b,c,d,x[k+4], S41,0xF7537E82);
		d=II(d,a,b,c,x[k+11],S42,0xBD3AF235);
		c=II(c,d,a,b,x[k+2], S43,0x2AD7D2BB);
		b=II(b,c,d,a,x[k+9], S44,0xEB86D391);
		a=AddUnsigned(a,AA);
		b=AddUnsigned(b,BB);
		c=AddUnsigned(c,CC);
		d=AddUnsigned(d,DD);
	}
 
	var temp = WordToHex(a)+WordToHex(b)+WordToHex(c)+WordToHex(d);
 
	return temp.toLowerCase();
}
dooit.temporaries('thomas','MD5');
