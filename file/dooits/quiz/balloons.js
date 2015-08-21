var balloons=null;
var balloonPlayerLoaded=true;
function balloonPlayer(vr,n,c,fin) {
	this.varRef=vr;
	this.finish=fin;
	//this.number=n.length;
	this.option=n;
	this.colours=["red","green","purple"];
	this.container=c;
	this.init=init;
	this.balloons=[];
	this.cloud=[];
	this.blowCloud=blowCloud;
	this.motion=motion;
	this.float=0.1;
	this.displayQuestion=displayQuestion;
	this.lengthen=lengthen;
	this.currentQuestion=-1;
	this.init();
	this.result=result;
	this.blower=null;
	this.leave=leave;
	function init() {
		var ins="<div id='boxes'></div><div id='balloonist'>";
		for(var i=0;i<this.option.balloons.length;i++) {
			ins+="<div class='"+this.colours[i]+"-balloon' id='balloon"+i+"'>"+this.option.balloons[i]+"</div>";
		}
		ins+="<div class='cloud' id='cloud1'></div>";
		ins+="<div class='cloud' id='cloud2'></div>";
		ins+="</div>";
		this.container.innerHTML=ins;
		for(var i=0;i<this.option.balloons.length;i++) this.balloons.push({object:document.getElementById("balloon"+i),x:200*(0.5+i),y:0,xv:0,yv:0,l:200,a:this.float});
		this.cloud.push([document.getElementById("cloud1"),0,1]);
		this.cloud.push([document.getElementById("cloud2"),0,-0.5]);
		this.blower=setTimeout(this.varRef+".blowCloud()",20);
		this.displayQuestion();
	}
	function blowCloud() {
		for(var i=0;i<this.cloud.length;i++) {
			this.cloud[i][1]+=this.cloud[i][2];
			this.cloud[i][0].style.backgroundPosition=this.cloud[i][1]+"px 0px";
		}
		this.motion();
		var tout="if (typeof("+this.varRef+")!='undefined'){if (typeof("+this.varRef+".blowCloud)!='undefined') "+this.varRef+".blowCloud();};";
		this.blower=setTimeout(tout,20);
	}
	function motion() {
		for(var i=0;i<this.balloons.length;i++) {
			var b=this.balloons[i];
			b.yv+=b.a;
			if (b.y>b.l && b.yv>0) {
				//b.y=b.l;
				b.yv=-(0.5*b.yv);
			}
			if (Math.sqrt(Math.pow(b.yv,2))<0.5) b.yw=0;
			b.y+=b.yv;
			if (b.y<0) b.y=0;
			b.object.style.top=(300-b.y)+"px";
			b.object.style.left=(b.x)+"px";
		}
	}
	function lengthen(n,l) {
		for(var i=0;i<this.balloons.length;i++) {
			if (i==n) {
				this.balloons[i].l+=l;
			}else{
				this.balloons[i].yv-=3;
				this.balloons[i].l-=l;
			}
		}
		this.displayQuestion();
	}
	function displayQuestion() {
		this.currentQuestion++;
		var ins='';
		setSteps(this.currentQuestion,this.option.questions.length,ob("steps"));
		if (this.currentQuestion<this.option.questions.length) {
			//ins+="<h2>"+(this.currentQuestion+1)+".</h2>";
			
			var q=this.option.questions[this.currentQuestion];
			ins+="<table class='radioselector' style='float:right;width:auto'><tr>";
			for(var i=0;i<q.length;i++) {
				var act='';
				if (q[i].action) act=q[i].action;
				ins+="<td onmouseover='balloons.balloons["+q[i].balloon+"].yv-=2;' onclick='balloons.lengthen("+q[i].balloon+","+q[i].add+");"+act+"'>"+q[i].text+"</td>";
			}
			ins+="</tr></table>";
			ins+="<div style='float:left;width:200px'>Again, select which of these statements makes most sense for your business</div>";
			
		}else{
			ins="Finished";
			setTimeout(this.finish+"(balloons.result());",1000);
			//eval(this.finish);
		}
		document.getElementById("boxes").innerHTML=ins;
	}
	function result() {
		var r='';
		var maxy=0;
		for(var i=0;i<this.balloons.length;i++) {
			if (this.balloons[i].l>maxy) {
				r=this.balloons[i].object.innerHTML;
				maxy=this.balloons[i].l;
			}
		}
		return r;
	}
	function leave() {
		clearTimeout(this.blower);
	}
}
dooit.temporaries('balloons','balloonPlayerLoaded_loaded','balloonPlayer');
