var thomas={
	//thomasURL:'http://www.thomasinternational.net/thomas_admin/WhitePage/Receive2.asp',
	thomasURL:yoodoo.option.baseUrl+'utilities/thomaspost.php',
	timeoutDelay:20000,
	timeoutTimer:null,
	tagRules:{groups:{},rules:[]},
	doTagRules:true,
	display:{
		graphs:[false,false,true],
		summaries:{
			invalid:true,
			basicFactorCombination:true,
			characteristics:true,
			tight1:false,
			tight2:false,
			tight3:false,
			tightAll:false,
			flickUp:false,
			flickDown:false,
			sweepDown:false,
			overshift:false,
			undershift:false,
			greyZone:false,
			Smovement:true,
			DequalsC:false	
		}
	},
	warnings:[],
	/*posts:{
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
	},*/
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
        	yoodoo.working(false);
	},
	done:function() {
		if (display_dooit.value.report!=undefined && display_dooit.value.report!="") {
			return true;
		}else{
			if (dooit.finishable()) {
				this.getScores(this.save);
			}else{
				return false;
			}
		}
	},
	checkReceived:function() {
		if (display_dooit.value.DISC==undefined) this.completedQuiz();
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
		var fn=yoodoo.user.firstname;
		if (fn=="") fn=yoodoo.username;
		if (fn=="") fn="Jo";
		var ln=yoodoo.user.lastname;
		if (ln=="") ln="Bloggs";
		op+="<input type='text' name='firstname' value='"+fn+"' />";
		op+="<input type='text' name='lastname' value='"+ln+"' />";
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
	this.timeoutTimer=setTimeout('thomas.timedout()',this.timeoutDelay);
	},
	timedout:function() {
		$(this.iframe).remove();
		this.timeoutTimer=null;
        	yoodoo.working(false);
		if (window.confirm("The connection to the server has timed out. Try again?")) {
			this.getScores();
		}
	},
    removePostResponder:function() {
        if (window.detachEvent) {
            window.detachEvent('onmessage',thomas.gotScores);
        }else{
            window.removeEventListener('message',thomas.gotScores,false);
        }
    },
	cancelPost:function() {
		thomas.removePostResponder();
		if (typeof(thomas.iframe)=="object") $(thomas.iframe).remove();
	},
	gotScores:function(e) {
		if(thomas!=undefined) {
		clearTimeout(thomas.timeoutTimer);
		thomas.timeoutTimer=null;
		thomas.removePostResponder();
		var val={};
		try{
			eval('val='+e.data+';');
		}catch(ex){}
		
		display_dooit.result_report(thomas.verbose(val));
		if (thomas.doTagRules) thomas.checkTags();
		thomas.getScoresComplete();
		if (typeof(thomas.iframe)=="object") $(thomas.iframe).remove();
		}
	},
	verbose:function(data) {
		var op='';
		var scores={D:[0,0,0],I:[0,0,0],S:[0,0,0],C:[0,0,0]};
		for(var k in data) {
			if (/^[DISC][123]/.test(k)) {
				var l=k.replace(/[123]/,'');
				var n=k.replace(/[DISC]/,'');
				scores[l][n-1]=data[k];
			}else if(k=="M") {
				display_dooit.value.motivator=data[k];
			}
		}
		display_dooit.value.disc=scores;
		this.translate();
		display_dooit.value.reportFunction='thomas.initGraph()';
		return "Generating the report";
		//return this.barGraph(scores);
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
	canvas:null,
	paper:null,
	drawSize:[500,300],
	svgOnly:false,
	graphElements:[],
	thomasLink:function(){
		return 'http://www.thomasinternational.net/en-gb/ourassessments/PPA.aspx';
	},
	initGraph:function() {
		this.display.graphCount=0;
		for(var i=0;i<this.display.graphs.length;i++) this.display.graphCount+=(this.display.graphs[i]?1:0);
		this.drawSize[0]=$('.dooitBox').width()-20;
		this.drawSize[1]=yoodoo.option.flashMovie.height-100;
		if(this.display.graphCount==1) this.drawSize[0]=Math.floor(this.drawSize[0]/2);
		var canvasWidth=this.drawSize[0];
		var canvasHeight=this.drawSize[1];
		if (display_dooit.value.discGraph==undefined && display_dooit.value.disc!=undefined) this.translate();
		if (display_dooit.value.discGraph!=undefined) {
			if(display_dooit.value.paragraph==undefined) this.analyze();
			var linkButton="<a href='"+this.thomasLink()+"' target='_blank' class='button green thomasLink' style='right:<rightdistance>px'><img src='"+yoodoo.getFilePath('image.dooits.quiz',true)+"thomas.png' /> get a full profile</a>";
			if (this.display.graphCount==1) {
				linkButton=linkButton.replace('<rightdistance>','5');
				$('.result_report').html(linkButton+'<div style="overflow:auto"><div id="vectorGraph" style="width:'+canvasWidth+'px;height:'+canvasHeight+'px;position:relative;float:left;"></div><div id="discComments" style="width:'+canvasWidth+'px;height:'+canvasHeight+'px;float:left;overflow:auto;"></div></div>');
			}else{
				linkButton=linkButton.replace('<rightdistance>','155');
				$('.result_report').html(linkButton+'<button type="button" class="button green toggleGraph">My description</button><div id="vectorGraph" style="width:'+canvasWidth+'px;height:'+canvasHeight+'px;position:relative"></div><div id="discComments" style="display:none"></div>');
			}
			var cont=$('.result_report div#vectorGraph').get(0);
  			var elem = null;
			if (!this.svgOnly) elem=document.createElement('canvas');
 			if (!this.svgOnly && elem.getContext && elem.getContext('2d')) {
				$(elem).attr("width",canvasWidth);
				$(elem).attr("height",canvasHeight);
				this.canvas=elem;
				this.canvasContext=elem.getContext('2d');
				cont.appendChild(this.canvas);
			}else{
				this.paper = Raphael(0, 0, canvasWidth, canvasHeight);
				cont.appendChild(this.paper.canvas);
				$(this.paper.canvas).css("position","static");
				$(this.paper.canvas).css("width",canvasWidth+"px");
				$(this.paper.canvas).css("height",canvasHeight+"px");
			}
			var coms=$('.result_report div#discComments').get(0);
			var ins='';
			for(var pk in this.display.summaries) {
				if (display_dooit.value.paragraph[pk]!=undefined) {
					if (this.display.summaries[pk]) {
						ins+='<p>'+display_dooit.value.paragraph[pk].statement+'</p>';
						if (display_dooit.value.paragraph[pk].questions.length>0) {
							ins+="<p>Some probing questions:<ul>";
							for(var q=0;q<display_dooit.value.paragraph[pk].questions.length;q++) {
								ins+='<li>'+display_dooit.value.paragraph[pk].questions[q]+'</li>';
							}
							ins+="</ul></p>";
						}
					}
				}
			}
			$(coms).html(ins);
			$('.toggleGraph').css("position","absolute");
			$('.toggleGraph').css("top","2px");
			$('.toggleGraph').css("right","5px");
			$('.toggleGraph').bind("click",function() {
				var gr=$('#vectorGraph');
				var dc=$('#discComments');
				if (gr.css("display")=='none') {
					$(this).html("My description");
					gr.slideDown();
					dc.slideUp();
				}else{
					$(this).html("Show graph");
					dc.slideDown();
					gr.slideUp();
				}
			});
		}
		this.graphData={D:[0,0,0],I:[0,0,0],S:[0,0,0],C:[0,0,0]};
		this.graphVelocity={D:[0,0,0],I:[0,0,0],S:[0,0,0],C:[0,0,0]};
		this.animateGraph();
	},
	graphData:{},
	graphVelocity:{},
	friction:0.9,
	animateGraph:function() {
		var done=true;
		var j=0;
		for(var l in this.graphData) {
			for(var i=0;i<3;i++) {
				if (this.display.graphs[i]) {
					var dv=(display_dooit.value.discGraph[l][i]-this.graphData[l][i])/(10+j);
					this.graphVelocity[l][i]+=dv;
					this.graphVelocity[l][i]*=this.friction;
					this.graphData[l][i]+=this.graphVelocity[l][i];
					if (Math.sqrt(Math.pow(dv,2))<0.1 && Math.sqrt(Math.pow(this.graphVelocity[l][i],2))<0.1) {
						this.graphData[l][i]=display_dooit.value.discGraph[l][i];
					}else{
						done=false;
					}
				}
				j++;
			}
		}
		this.drawGraph();
		if (!done) setTimeout('thomas.animateGraph()',10);
	},
	drawGraph:function() {
		var graphCount=0;
		for(var i=0;i<this.display.graphs.length;i++) {
			if (this.display.graphs[i]) graphCount++;
		}
		var padding=30;
		var initial=(this.graphElements.length==0);
		var w=Math.floor((this.drawSize[0]-(padding*(graphCount+1)))/graphCount);
		var maxAspect=1.2;
		var h=this.drawSize[1]-(2*padding);
		if (h/w>maxAspect) {
			h=Math.round(w*maxAspect);
		}
		this.clear();
		var horizontals=[this.greyZone,50,100-this.greyZone];
		this.lines=[];
		if (initial || this.canvas!==null) {
			var style={gradient:{stops:[[0,'#dfdfdf'],[1,'#929292']]},shadow:{color:'#000',blur:10,x:0,y:0},stroke:null};
			for(var i=0;i<graphCount;i++) {
				this.rect(((w+padding)*i)+padding,padding,w,h,style);
			}
			var stroke={width:2,style:'#fff'};
			for(var i=0;i<graphCount;i++) {
				for(var ho=0;ho<horizontals.length;ho++) {
					this.drawLine([[((w+padding)*i)+padding,h-(h*horizontals[ho]/100)+padding],[(((w+padding)*i))+w+padding,h-(h*horizontals[ho]/100)+padding]],{stroke:stroke,shadow:null});
				}
			}
			var stroke={width:2,style:'#494949'};
			var DISCpaddingPROPORTION=0.6;
			var LABELpaddingPROPORTION=0.4;
			var labels=['Work Mask','Behaviour under pressure','Self Image'];
			var shown=0;
			for(var i=0;i<3;i++) {
				if(this.display.graphs[i]) {
					var j=0;
					for(var k in display_dooit.value.discGraph) {
					//for(var j=0;j<4;j++) {
						var x=((w+padding)*shown)+padding+(Math.round((w/3)*j));
						this.drawLine([[x,padding],[x,h+padding]],{stroke:stroke,shadow:null});
						this.text(x,Math.round((padding/2)+((padding*DISCpaddingPROPORTION)/2)),k,{font:Math.round(padding*DISCpaddingPROPORTION)+'px Arial',color:'#000',align:'center'});
						j++;
					}
					var x=((w+padding)*shown)+padding+(Math.round(w/2));
					var y=h+(2*padding);
					this.text(x,y,labels[i],{font:Math.round(padding*LABELpaddingPROPORTION)+'px Arial',color:'#000',align:'center'});
					shown++;
				}
			}
			style={fill:null,shadow:null,stroke:{width:2,style:'#494949'}};
			for(var i=0;i<graphCount;i++) {
				this.rect(((w+padding)*i)+padding,padding,w,h,style);
			}
		}
		var stroke={width:3,style:'#0f0'};
		var shadow={color:'#000',blur:5,x:0,y:2};
		var dotstroke={width:2,style:'#fff'};
		var fillstyle='#f00';
		var ge=0;
		shown=0;
		for(var i=0;i<3;i++) {
			if (this.display.graphs[i]) {
				var points=[];
				points.push([((w+padding)*shown)+Math.round(w*0/3)+padding,h-(h*this.graphData.D[i]/100)+padding]);
				points.push([((w+padding)*shown)+Math.round(w*1/3)+padding,h-(h*this.graphData.I[i]/100)+padding]);
				points.push([((w+padding)*shown)+Math.round(w*2/3)+padding,h-(h*this.graphData.S[i]/100)+padding]);
				points.push([((w+padding)*shown)+Math.round(w*3/3)+padding,h-(h*this.graphData.C[i]/100)+padding]);
				if (this.graphElements.length>ge && this.paper!==null) {
					this.drawLine(points,{stroke:stroke,shadow:shadow},ge);
				}else{
					this.graphElements.push(this.drawLine(points,{stroke:stroke,shadow:shadow}));
				}
				ge++;
				for(p=0;p<points.length;p++) {
					if (this.graphElements.length>ge && this.paper!==null) {
						this.drawCircle(points[p],5,{stroke:dotstroke,fill:fillstyle},ge);
					}else{
						this.graphElements.push(this.drawCircle(points[p],5,{stroke:dotstroke,fill:fillstyle}));
					}
					ge++;
				}
				shown++;
			}
		}
	
	},
	clear:function(){
		if (this.paper!==null) {
			/*for(var e=0;e<this.graphElements.length;e++) {
				this.graphElements[e].remove();
			}
			this.graphElements=[]*/
			//this.paper.clearRect(0,0,this.drawSize[0],this.drawSize[1]);
		}else if (this.canvas!==null) {
			this.canvasContext.clearRect(0,0,this.drawSize[0],this.drawSize[1]);
		}
	},
	text:function(x,y,t,style) {

		if (this.paper!==null) {
			
			var o=this.paper.text(x,y,t);
    			if (style.font) {
				var f=style.font.split(" ");
				o.attr({'font-size':f[0]});
				o.attr({'font':f[1]});
			}
    			if (style.color) o.attr({'fill':style.color});
    			if (style.align) {
				var a={left:'start',center:'middle',right:'end'};
				o.attr({'text-anchor':a[style.align]});
			}
		}else if (this.canvas!==null) {
    			if (style.font) this.canvasContext.font = style.font;
    			if (style.color) this.canvasContext.fillStyle  = style.color;
    			if (style.align) this.canvasContext.textAlign  = style.align;

 
    			this.canvasContext.fillText(t, x, y);
		}
	},
	rect:function(l,t,w,h,style){
		if (this.paper!==null) {
			//while(this.paper.
			var o=this.paper.rect(l,t,w,h);
			if (style.fill) o.attr({fill:style.fill});
			if (style.gradient) {
				var g=[];
				for(var i=0;i<style.gradient.stops.length;i++) {
					g.push(style.gradient.stops[i][0]+"-"+style.gradient.stops[i][1]);
				}
				o.attr({fill:((style.gradient.horizontal)?'0-':'270-')+g.join(":")});
			}
			if (style.stroke) {
				if (style.stroke.width)  o.attr({'stroke-width': style.stroke.width});
				if (style.stroke.corner)  o.attr({'stroke-linecap': style.stroke.corner});
				if (style.stroke.corner)  o.attr({'stroke-linejoin': style.stroke.corner});
				if (style.stroke.style)  o.attr({'stroke':style.stroke.style});
			}
		}else if (this.canvas!==null) {
			/*if (style.shadow) {
				this.canvasContext.beginPath();
				this.canvasContext.rect(l,t,w,h);
				if (style.shadow.color) this.canvasContext.shadowColor = style.shadow.color;
				if (style.shadow.blur) this.canvasContext.shadowBlur = style.shadow.blur;
				if (style.shadow.x) this.canvasContext.shadowOffsetX = style.shadow.x;
				if (style.shadow.y) this.canvasContext.shadowOffsetY = style.shadow.y;
				this.canvasContext.fill();
			}*/
			this.canvasContext.beginPath();
			this.canvasContext.rect(l,t,w,h);
			if (style!==null) {
				if (style.fill) {
					this.canvasContext.fillStyle=style.fill;
				}else if(style.gradient) {
					var grd = null;
					if(style.gradient.horizontal) {
						grd=this.canvasContext.createLinearGradient(0, 0, w, 0);
					}else{
						grd=this.canvasContext.createLinearGradient(0, 0, 0, h);
					}
					for(var i=0;i<style.gradient.stops.length;i++) {
						grd.addColorStop(style.gradient.stops[i][0], style.gradient.stops[i][1]);
					}
					this.canvasContext.fillStyle = grd;
				}
			}
			
			if (style.shadow) {
				if (style.shadow.color) this.canvasContext.shadowColor = style.shadow.color;
				if (style.shadow.blur) this.canvasContext.shadowBlur = style.shadow.blur;
				if (style.shadow.x) this.canvasContext.shadowOffsetX = style.shadow.x;
				if (style.shadow.y) this.canvasContext.shadowOffsetY = style.shadow.y;
			}
			if (style.shadow===null) this.canvasContext.shadowOffsetX=this.canvasContext.shadowOffsetY=this.canvasContext.shadowBlur=0;
			if ((style.fill && style.fill!==null) || (style.gradient && style.gradient!==null)) this.canvasContext.fill();
			if (style.stroke) {
				if (style.stroke.width) this.canvasContext.lineWidth = style.stroke.width;
				if (style.stroke.corner) this.canvasContext.lineJoin  = style.stroke.corner;
				if (style.stroke.corner) this.canvasContext.lineCap  = style.stroke.corner;
				if (style.stroke.style) this.canvasContext.strokeStyle = style.stroke.style;
				this.canvasContext.stroke();
			}
		}
	},
	drawLine:function(points,style) {
		if (this.paper!==null) {
			var p=[];
			for(var i=0;i<points.length;i++) {
				p.push(points[i].join(","));
			}
			if (arguments.length>2) {
				this.graphElements[arguments[2]].attr('path',"M"+p.join("L"));
			}else{
				var o=this.paper.path("M"+p.join("L"));

				if (style.stroke) {
					if (style.stroke.width)  o.attr({'stroke-width': style.stroke.width});
					if (style.stroke.corner)  o.attr({'stroke-linecap': style.stroke.corner});
					if (style.stroke.corner)  o.attr({'stroke-linejoin': style.stroke.corner});
					if (style.stroke.style)  o.attr({'stroke':style.stroke.style});
				}
				return o;
			}
		}else if (this.canvas!==null) {
			this.canvasContext.beginPath();
			for(var i=0;i<points.length;i++) {
				if(i==0) {
					this.canvasContext.moveTo(points[i][0],points[i][1]);
				}else{
					this.canvasContext.lineTo(points[i][0],points[i][1]);
				}
			}
			this.canvasContext.restore();
			if (style.shadow) {
				if (style.shadow.color) this.canvasContext.shadowColor = style.shadow.color;
				if (style.shadow.blur) this.canvasContext.shadowBlur = style.shadow.blur;
				if (style.shadow.x) this.canvasContext.shadowOffsetX = style.shadow.x;
				if (style.shadow.y) this.canvasContext.shadowOffsetY = style.shadow.y;
			}
			if (style.shadow===null) this.canvasContext.shadowOffsetX=this.canvasContext.shadowOffsetY=this.canvasContext.shadowBlur=0;
			if (style.stroke) {
				if (style.stroke.width) this.canvasContext.lineWidth = style.stroke.width;
				if (style.stroke.corner) this.canvasContext.lineJoin  = style.stroke.corner;
				if (style.stroke.corner) this.canvasContext.lineCap  = style.stroke.corner;
				if (style.stroke.style) this.canvasContext.strokeStyle = style.stroke.style;
			}
			this.canvasContext.stroke();
		}
	},
	drawCircle:function(p,r,style) {
		if (this.paper!==null) {
			if (arguments.length>3) {
				this.graphElements[arguments[3]].attr('x',p[0]);
				this.graphElements[arguments[3]].attr('y',p[1]);
				this.graphElements[arguments[3]].attr('cx',p[0]);
				this.graphElements[arguments[3]].attr('cy',p[1]);
				this.graphElements[arguments[3]].attr('r',r);
			}else{
				var o=this.paper.circle(p[0],p[1],r);
				if (style.fill) o.attr({fill: style.fill});

				if (style.stroke) {
					if (style.stroke.width)  o.attr({'stroke-width': style.stroke.width});
					if (style.stroke.corner)  o.attr({'stroke-linecap': style.stroke.corner});
					if (style.stroke.corner)  o.attr({'stroke-linejoin': style.stroke.corner});
					if (style.stroke.style)  o.attr({'stroke':style.stroke.style});
				}
				return o;
			}
		}else{
			this.canvasContext.beginPath();
			this.canvasContext.arc(p[0],p[1],r, 0, 2 * Math.PI, false);
			this.canvasContext.closePath();
			if (style.fill) {
				this.canvasContext.fillStyle=style.fill;
				this.canvasContext.fill();
			}else if(style.gradient) {
				var grd = null;
				if(style.gradient.horizontal) {
					grd=this.canvasContext.createLinearGradient(0, 0, w, 0);
				}else{
					grd=this.canvasContext.createLinearGradient(0, 0, 0, h);
				}
				for(var i=0;i<style.gradient.stops.length;i++) {
					grd.addColorStop(style.gradient.stops[i][0], style.gradient.stops[i][1]);
				}
				this.canvasContext.fillStyle = grd;
				this.canvasContext.fill();
			}
			if (style.stroke) {
				if (style.stroke.width) this.canvasContext.lineWidth = style.stroke.width;
				if (style.stroke.corner) this.canvasContext.lineJoin  = style.stroke.corner;
				if (style.stroke.corner) this.canvasContext.lineCap  = style.stroke.corner;
				if (style.stroke.style) this.canvasContext.strokeStyle = style.stroke.style;
			}
			this.canvasContext.stroke();
		}
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
		this.analyze();
	},
	greyZone:12.5,
	consistantCharacteristics:{
		D:[
			[
				'Driving',
				'Competitive',
				'Forceful',
				'Inquisitive',
				'Direct',
				'Self-starter',
				'Assertive'
			],[
				'Hesitant',
				'Mild mannered',
				'Low decision need',
				'Non-demanding',
				'Accomodating'
			]
		],
		I:[
			[
				'Influential',
				'Persuasive',
				'Friendly',
				'Verbal',
				'Communicative',
				'Positive',
				'Networker'
			],[
				'Reserved',
				'Reflective',
				'Suspicious',
				'Self-conscious',
				'Probing',
				'Serious'
			]
		],
		S:[
			[
				'Dependable',
				'Deliberate',
				'Amiable',
				'Persistant',
				'Good listener',
				'Kind',
				'Methodical',
				'Thorough'
			],[
				'Mobile',
				'Alert',
				'Active',
				'Restless',
				'Demonstrative'
			]
		],
		C:[
			[
				'Compliant',
				'Careful',
				'Systematic',
				'Precise',
				'Accurate',
				'Perfectionist',
				'Logical'
			],[
				'Firm',
				'Persistant',
				'Stubborn',
				'Strong-willed',
				'Independent'
			]
		]
	},
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
	analyze:function() {
		display_dooit.value.traits={
			invalid:this.check.invalid(),
			tight1:this.check.tight([true,false,false]),
			tight2:this.check.tight([false,true,false]),
			tight3:this.check.tight([false,false,true]),
			tightAll:this.check.tight([true,true,true]),
			DequalsC:this.check.DequalsC(), // [1,0,-1] 1=equal above the line, -1=equal below the line
			overshift:this.check.overshift(),
			undershift:this.check.undershift(),
			greyZone:this.check.greyZone(),
			Smovement:this.check.Smovement(),
			flickUp:this.check.flickUp(),
			flickDown:this.check.flickDown(),
			sweepDown:this.check.sweepDown(),
			highD:this.check.highD(),
			highI:this.check.highI(),
			highS:this.check.highS(),
			highC:this.check.highC(),
			readOrder:this.check.readOrder(),
			basicFactorCombination:this.check.basicFactorCombination()
		};
		display_dooit.value.paragraph={};
		display_dooit.value.warnings=[];
		if(display_dooit.value.traits.invalid) {
			display_dooit.value.paragraph.invalid={statement:'There seems to be a problem with your results.',questions:['Did you understand the questionnaire?','Did your answers reflect how you actually behave at work?','Did you find it took you longer than 10 minutes?','Where you distracted?']};
		}else{
			
	

			var ks={D:'dominance',I:'influence',S:'steadiness',C:'compliance'};
			// consistantCharacteristics
			var characteristics=[];
			for(var i=0;i<display_dooit.value.traits.readOrder.length;i++) {
				var idx=(display_dooit.value.discGraph[display_dooit.value.traits.readOrder[i]][2]>=50)?0:1;
				var col=[];
				for(var c=0;c<this.consistantCharacteristics[display_dooit.value.traits.readOrder[i]][idx].length;c++) {
					col.push(this.consistantCharacteristics[display_dooit.value.traits.readOrder[i]][idx][c].toLowerCase());
				}
				characteristics.push({type:ks[display_dooit.value.traits.readOrder[i]],characteristics:col});
			}

			var rep={statement:'<h2>'+display_dooit.value.traits.basicFactorCombination.characteristic+'</h2>',questions:[]}
			display_dooit.value.paragraph.basicFactorCombination=rep;

			var summary='';
			for(c=0;c<characteristics.length;c++) {
				summary+='<p><b>'+characteristics[c].type+'</b><br />'+characteristics[c].characteristics.join(', ')+'</p>';
			}
			var rep={statement:'Your consistant characteristics for each area seem to be<br />'+summary,questions:[]}
			display_dooit.value.paragraph.characteristics=rep;

			if (display_dooit.value.traits.tight1) {
				var rep={statement:'You seem to be unsure of what is required of you at work, or unsuited to the work you chose. Maybe you are demotivated, have no clear objectives or unsure of your ability regarding your work.',questions:[]}
				rep.questions.push('Have there been any changes in your job in the last twelve months?');
				rep.questions.push('Do you have a clear job description?');
				rep.questions.push('Does your job description reflect the reality of your work?');
				rep.questions.push('How long have you been in this particular job/role?');
				rep.questions.push('In an ideal world, would you be doing this job?');
				rep.questions.push('What would you  like to change in your current job?');
				rep.questions.push('Where do you see yourself in one to five years\' time?');
				rep.questions.push('What are the stepping stones along the way?');
				rep.questions.push('What training have you had?');
				rep.questions.push('Do you think you need further training?');
				display_dooit.value.paragraph.tight1=rep;
			}
			if (display_dooit.value.traits.tight2) {
				var rep={statement:'You seem to be harbouring some insecurities, maybe you are frustrated with your current work situation, it maybe too challenging or your manager is not happy with your performance.',questions:[]}
				rep.questions.push('Do you ever feel demotivated in your current job and how do you handle that?');
				rep.questions.push('How is business?');
				rep.questions.push('How is your work going?');
				rep.questions.push('Is there something that you would like to change at work currently?');
				rep.questions.push('Are you experiencing current pressures in or out of work?');
				rep.questions.push('How do you feel about your current performance?');
				rep.questions.push('Are you satisfied with your current work performance/situation?');
				rep.questions.push('How is your performance measured?');
				rep.questions.push('How does your manager evaluate your performance?');
				display_dooit.value.paragraph.tight2=rep;
			}
			if (display_dooit.value.traits.tight3) {
				var rep={statement:'You seem to not have clearly defined objectives, or responsibilities without authority or even too many managers. You maybe frustrated that you are not allowed to contribute as much as you feel you can.',questions:[]}
				rep.questions.push('Are your objectives clearly defined? And have you agreed to them?');
				rep.questions.push('Do you have the necessary authority to have achieve your objectives?');
				rep.questions.push('How  does your current manager compare with your ideal?');
				rep.questions.push('When did you last solve a major disagreement with your manager and how was it resolved?');
				rep.questions.push('What defines a good or bad day in your job?');
				rep.questions.push('What do you feel are contraints on you achieving your goals and/or your optimum contribution?');
				rep.questions.push('How much support for your career do you derive from outside the workplace?');
				if (display_dooit.value.traits.highD) rep.questions.push('How much challenge is in your job?');
				if (display_dooit.value.traits.highI) rep.questions.push('Does your job provide opportunities to meet and motivate other people?');
				if (display_dooit.value.traits.highS) rep.questions.push('How often do you get side-tracked in the moddle of a job?');
				if (display_dooit.value.traits.highC) rep.questions.push('How often are you pressured to produce work of a lesser standard then you would like?');
				display_dooit.value.paragraph.tight3=rep;
			}
			if (display_dooit.value.traits.tightAll) {
				var rep={statement:'<b>Instructions</b>: you may not have been told to think of yourself at work<br /><b>Administration</b>: this questionairre may have been completed in between 6 and 8 minutes, or away from distractions/interruptions<br /><b>Language</b>: English may not be your instinctive language<br /><b>Literacy</b>: you may struggle with literacy<br /><b>New to work</b>: you may have just left full-time education or have been out of work for sometime',questions:[]}
				rep.questions.push('Did you have clear instructions?');
				rep.questions.push('Did you think of yourself in the work situation?');
				rep.questions.push('How long did it take you to completed this questionairre?');
				rep.questions.push('How did you find the process of choosing the options?');
				rep.questions.push('How much do you know about this organisation?');
				rep.questions.push('What appeals to you about this particular job?');
				rep.questions.push('Which parts of the job do you find interesting?');
				rep.questions.push('Are you considering or experiencing any major changes in your life?');
				rep.questions.push('Describe your short and long-term goals relative to your work?');
				rep.questions.push('How comfortable are you in your current role?');
				display_dooit.value.paragraph.tightAll=rep;
			}
			if (display_dooit.value.traits.DequalsC[0]==1) {
				var rep={statement:'You seem to be indecisive or cautious when important decision have to be made, or you are required to a job where getting the right result is of critical importance. Otherwise, your job maybe of very highly specialist or technical. If none of these, then maybe you do not have the authority to make decisions or is being suppressed by an agressive manager.',questions:[]}
				rep.questions.push('What is your thought process when making a decision?');
				rep.questions.push('What is the biggest decision you ever made and how did it turn out?');
				rep.questions.push('What is the worst decision you have ever made and why?');
				rep.questions.push('In your current job, what would be the implications if you made a wrong decision?');
				rep.questions.push('How does your organisation deal with failure?');
				rep.questions.push('Which is most important to you, accuracy or goal achievement?');
				rep.questions.push('What concerns you most in terms of decision making?');
				rep.questions.push('Does your manager support your decisions?');
				display_dooit.value.paragraph.DequalsC=rep;
			}
			if (display_dooit.value.traits.DequalsC[0]==-1) {
				var rep={statement:'You seem to be more indecisive when important decisions have to be made.',questions:[]}
				rep.questions.push('What is your thought process when making a decision?');
				rep.questions.push('What is the biggest decision you ever made and how did it turn out?');
				rep.questions.push('What is the worst decision you have ever made and why?');
				rep.questions.push('In your current job, what would be the implications if you made a wrong decision?');
				rep.questions.push('How does your organisation deal with failure?');
				rep.questions.push('Which is most important to you, accuracy or goal achievement?');
				rep.questions.push('What concerns you most in terms of decision making?');
				rep.questions.push('Does your manager support your decisions?');
				display_dooit.value.paragraph.DequalsC=rep;
			}
			if (display_dooit.value.traits.overshift[0]) {
				var rep={statement:'You seem to be pushing yourself in your work situation. This maybe because either:<li>You are new to your position, probably within 3 and 9 months</li><li>You have been over-promoted</li><li>You are forcing yourself to be something you are not, by attempting to do a job that may not be conducive to your natural behaviour</li>',questions:[]}
				rep.questions.push('How long have you been in your current job?');
				rep.questions.push('How has your job changed since you started?');
				rep.questions.push('What is the hardest part of your current job?');
				rep.questions.push('Given the chance, what would you change in your current job?');
				rep.questions.push('When, if ever, do you feel you have to be superman/superwoman?');
				rep.questions.push('Have you recently taken on additional responsibility?');
				rep.questions.push('Are you challenged in your role? How do you deal with challenges?');
				display_dooit.value.paragraph.overshift=rep;
			}
			if (display_dooit.value.traits.undershift[0]) {
				var rep={statement:'You seem to have low morale. This maybe due to over-promotion.',questions:[]}
				rep.questions.push('If you were to list the positive and negative aspects of your current situation, which list would be the longest?');
				rep.questions.push('How do you feel about your current role?');
				rep.questions.push('Where do you think you are doing well and where do you need to do better?');
				rep.questions.push('How do you deal with challenges?');
				display_dooit.value.paragraph.undershift=rep;
			}
			if (display_dooit.value.traits.undershift[2]) {
				display_dooit.value.warnings.push('Very low self image');
			}
			for(var k in display_dooit.value.traits.greyZone) {
				var rep=false;
				if (display_dooit.value.traits.greyZone[k].above!=false) {
					rep={statement:'You seem to have a '+display_dooit.value.traits.greyZone[k].above+' very high '+ks[k]+'.',questions:[]}
				}else if (display_dooit.value.traits.greyZone[k].below!=false) {
					rep={statement:'You seem to have a '+display_dooit.value.traits.greyZone[k].below+' very low '+ks[k]+'.',questions:[]}
				}
				if (rep) {
					rep.questions.push('Describe any situation where you felt you had gone too far in your behaviour?');
					rep.questions.push('How did you rectify the situation?');
					rep.questions.push('Has there ever been a time when you thought you might actually fail/be rejected/lose your security or get involved in direct conflict?');
					rep.questions.push('What did you do about it?');
					rep.questions.push('Are you aware of times when you have behaved very differently from your usual style?');
					display_dooit.value.paragraph.greyZone=rep;
				}
			}
			if (display_dooit.value.traits.Smovement.warning && display_dooit.value.traits.Smovement.warning!='') {
				if (display_dooit.value.traits.Smovement.warning=="work") {
					rep={statement:'You appear to have frustrations, problems or pressures in your work.',questions:[]};
					display_dooit.value.paragraph.Smovement=rep;
				}else if (display_dooit.value.traits.Smovement.warning=="personal") {
					rep={statement:'You appear to have frustrations, problems or pressures in your personal or emotional life.',questions:[]};
					display_dooit.value.paragraph.Smovement=rep;
				}
			}
			if (display_dooit.value.traits.flickUp) {
				rep={statement:'You seem to a person who may take risks and cut corners but will comply when it really matters.',questions:[]};
					display_dooit.value.paragraph.flickUp=rep;
			}
			if (display_dooit.value.traits.flickDown) {
				rep={statement:'You are likely to be overly independent, dislike rules and limitation. You also maybe a maverick/rebel.',questions:[]};
					display_dooit.value.paragraph.flickDown=rep;
			}
			if (display_dooit.value.traits.sweepDown) {
				rep={statement:'You seem to be very stubborn, likely to dig your heels in and could be immovable. In conflict you may show passive resistance.',questions:[]};
				display_dooit.value.paragraph.sweepDown=rep;
			}
		}
		
//console.log(this.traits);
	},
	
	check:{
		invalid:function() {
			var dir={D:false,I:false,S:false,C:false};
			for(var k in dir) {
				var d=0;
				for(var i=0;i<3;i++) {
					d+=(display_dooit.value.discGraph[k][i]>50)?1:-1;
				}
				if (d==3 || d==-3) {
					dir[k]=true;
				}
			}
			return !(dir.D || dir.I || dir.S || dir.C);
		},
		tight:function(which) {
			var five=thomas.translation[0].D[5][1];
			var eight=thomas.translation[0].D[8][1];
			var tight=true;
			for(var i=0;i<3;i++) {
				if(which[i]) {
					if (display_dooit.value.discGraph.D[i]<five || display_dooit.value.discGraph.D[i]>eight) tight=false;
					if (display_dooit.value.discGraph.I[i]<five || display_dooit.value.discGraph.I[i]>eight) tight=false;
					if (display_dooit.value.discGraph.S[i]<five || display_dooit.value.discGraph.S[i]>eight) tight=false;
					if (display_dooit.value.discGraph.C[i]<five || display_dooit.value.discGraph.C[i]>eight) tight=false;
				}
			}
			return tight;
		},
		DequalsC:function(){
			var vals=[0,0,0];
			for(var i=0;i<3;i++) {
				var dif=display_dooit.value.discGraph.D[i]-display_dooit.value.discGraph.C[i];
				if (dif>-6.18 && dif<6.18) {
					if (display_dooit.value.discGraph.D[i]<50 && display_dooit.value.discGraph.C[i]<50) {
						vals[i]=-1;
					}else{
						vals[i]=1;
					}
				}
			}
			return vals;
		},
		overshift:function() {
			var vals=[false,false,false];
			for(var i=0;i<3;i++) {
				vals[i]=!((display_dooit.value.discGraph.D[i]<50)||(display_dooit.value.discGraph.I[i]<50)||(display_dooit.value.discGraph.S[i]<50)||(display_dooit.value.discGraph.C[i]<50));
			}
			return vals;
		},
		undershift:function() {
			var vals=[false,false,false];
			for(var i=0;i<3;i++) {
				vals[i]=!((display_dooit.value.discGraph.D[i]>50)||(display_dooit.value.discGraph.I[i]>50)||(display_dooit.value.discGraph.S[i]>50)||(display_dooit.value.discGraph.C[i]>50));
			}
			return vals;
		},
		greyZone:function(){
			var vals={D:{above:false,below:false},I:{above:false,below:false},S:{above:false,below:false},C:{above:false,below:false}};
			var greyed={};
			for(var l in vals) {
				var above=0;
				var below=0;
				for(var i=0;i<3;i++) {
					if(display_dooit.value.discGraph[l][i]>100-thomas.greyZone) above++;
					if(display_dooit.value.discGraph[l][i]<thomas.greyZone) below++;
				}
				if (above>0) vals[l].above=(above==1)?'temporary':'permanent';
				if (below>0) vals[l].below=(below==1)?'temporary':'permanent';
			}
			return vals;
		},
		Smovement:function() {
			var vals={maxS:-100,minS:100,maxI:-100,minI:100};
			for(var i=0;i<3;i++) {
				var ss=thomas.against3C(display_dooit.value.discGraph.S[i]);
				var si=thomas.against3C(display_dooit.value.discGraph.I[i]);
				if (ss>vals.maxS) vals.maxS=ss;
				if (ss<vals.minS) vals.minS=ss;
				if (si>vals.maxI) vals.maxI=si;
				if (si<vals.minI) vals.minI=si;
			}
			vals.S=vals.maxS-vals.minS;
			vals.I=vals.maxI-vals.minI;
			vals.warning='';
			if (vals.S>=3) {
				vals.warning=(Math.round(vals.I)>=3)?'work':'personal';
			}
			return vals;
		},
		flickUp:function() {
			var a=false;
			if(display_dooit.value.discGraph.C[2]<50) {
				a=(display_dooit.value.discGraph.S[2]<display_dooit.value.discGraph.C[2]);
			}
			return a;
		},
		flickDown:function() {
			var a=false;
			if(display_dooit.value.discGraph.C[2]<50 && display_dooit.value.discGraph.C[2]<50) {
				a=(display_dooit.value.discGraph.S[2]>display_dooit.value.discGraph.C[2]);
			}
			return a;
		},
		sweepDown:function() {
			var a=false;
			if(display_dooit.value.discGraph.C[2]<50 && display_dooit.value.discGraph.C[2]>50) {
				a=(display_dooit.value.discGraph.S[2]>display_dooit.value.discGraph.C[2]);
			}
			return a;
		},
		highD:function() {
			var a=true;
			if (display_dooit.value.discGraph.D[2]<display_dooit.value.discGraph.S[2]) a=false;
			if (display_dooit.value.discGraph.D[2]<display_dooit.value.discGraph.I[2]) a=false;
			if (display_dooit.value.discGraph.D[2]<display_dooit.value.discGraph.C[2]) a=false;
			return a;
		},
		highI:function() {
			var a=true;
			if (display_dooit.value.discGraph.I[2]<display_dooit.value.discGraph.S[2]) a=false;
			if (display_dooit.value.discGraph.I[2]<display_dooit.value.discGraph.D[2]) a=false;
			if (display_dooit.value.discGraph.I[2]<display_dooit.value.discGraph.C[2]) a=false;
			return a;
		},
		highS:function() {
			var a=true;
			if (display_dooit.value.discGraph.S[2]<display_dooit.value.discGraph.D[2]) a=false;
			if (display_dooit.value.discGraph.S[2]<display_dooit.value.discGraph.I[2]) a=false;
			if (display_dooit.value.discGraph.S[2]<display_dooit.value.discGraph.C[2]) a=false;
			return a;
		},
		highC:function() {
			var a=true;
			if (display_dooit.value.discGraph.C[2]<display_dooit.value.discGraph.D[2]) a=false;
			if (display_dooit.value.discGraph.C[2]<display_dooit.value.discGraph.I[2]) a=false;
			if (display_dooit.value.discGraph.C[2]<display_dooit.value.discGraph.S[2]) a=false;
			return a;
		},
		readOrder:function() {
			var above=[];
			var below=[];
			for(var k in display_dooit.value.discGraph) {
				if(display_dooit.value.discGraph[k][2]>=50) {
					above.push(k);
				}else{
					below.push(k);
				}
			}
			above.sort(function(a,b) {return display_dooit.value.discGraph[b][2]-display_dooit.value.discGraph[a][2];});
			below.sort(function(a,b) {return display_dooit.value.discGraph[a][2]-display_dooit.value.discGraph[b][2];});
			var op=[];
			for(var i=0;i<above.length;i++) op.push(above[i]);
			for(var i=0;i<below.length;i++) op.push(below[i]);
			return op;
		},
		basicFactorCombination:function() {
			var type={
				DI:'Creativeness - Imagination',
				DS:'Drive',
				DC:'Individuality',
				ID:'Goodwill',
				IS:'Contactability',
				IC:'Self-confidence',
				SD:'Patience',
				SI:'Reflectiveness (concentration)',
				SC:'Persistence',
				CD:'Adaptability',
				CI:'Perfectionism',
				CS:'Sensitivity (shrewdness)'
			};
			var highest='';
			var lowest='';
			for(var k in display_dooit.value.discGraph) {
				if (highest=='') {
					highest=k;
				}else if(display_dooit.value.discGraph[k][2]>display_dooit.value.discGraph[highest][2]){
					highest=k;
				}
				if (lowest=='') {
					lowest=k;
				}else if(display_dooit.value.discGraph[k][2]<display_dooit.value.discGraph[lowest][2]){
					lowest=k;
				}
			}
			var op={combination:highest+'/'+lowest,characteristic:type[highest+lowest]};
			return op;
		}
	},
	
	against3C:function(v) {
		for(var i=0;i<this.translation[2].C.length;i++) {
			if (v==this.translation[2].C[i][1]) return this.translation[2].C[i][0];
			if (i>0) {
				if (v>this.translation[2].C[i-1][1] && v<this.translation[2].C[i][1]) {
					var p=((v-this.translation[2].C[i-1][1])/(this.translation[2].C[i-1][1]-this.translation[2].C[i][1]));
					var a=(p*(this.translation[2].C[i-1][0]-this.translation[2].C[i][0]))+this.translation[2].C[i-1][0];
					return a;
				}
			}
		}
		if(v<this.translation[2].C[0][1]) return this.translation[2].C[0][0];
		if(v>this.translation[2].C[this.translation[2].C.length-1][1]) return this.translation[2].C[this.translation[2].C.length-1][0];
		return 0;
	},
	checkTags:function() {
		var listed=[[],[],[]];
		var vals=display_dooit.value.disc;
		if (display_dooit.value.discGraph!=undefined) vals=display_dooit.value.discGraph;
		for(var i=0;i<3;i++) {
			for(var k in vals) listed[i].push([k,vals[k][i]]);
			listed[i].sort(function(a,b){return b[1]-a[1];});
		}
		for(var i=0;i<this.tagRules.rules.length;i++) {
			var setMatched=false;
			var setMatches=[];
			var type=this.tagRules.rules[i].scoreType;
			for(var c=0;c<this.tagRules.rules[i].checks.length;c++) {
				var matched=false;
				var matches=[];
				var v=vals[this.tagRules.rules[i].checks[c].score][type];
				if (this.tagRules.rules[i].checks[c].comparison!=undefined) {
					for(var com=0;com<this.tagRules.rules[i].checks[c].comparison.length;com++) {
						var res=false;
						var compeval=this.tagRules.rules[i].checks[c].comparison[com];
						thomas.thisRuleType=this.tagRules.rules[i].scoreType;
						compeval=compeval.replace(/([DISC])/g,function(s,ii) {return vals[ii][thomas.thisRuleType];});
						try{
							eval('res=(v'+compeval+');');
						}catch(ex){}
						matches.push(res);
					}
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
