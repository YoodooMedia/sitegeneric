var theDiv=null;
var companytype="company-type";
var yourcompanyLoaded=true;
function company_defined() {
	return ($('#'+companytype).val()!="");
}
var balloonQuiz=[
        {
               balloons:["Sole Trader","Limited Company","Limited Liability Partnership"],
               questions:[
                       [{text:"I am always going to practise on my own",balloon:0,add:30},{text:"I might have employees but I run the show",balloon:1,add:30},{text:"I will partner with professional peers",balloon:2,add:30}],
                       [{text:"I want to be protected from debt if the business goes wrong, but I want total control",balloon:1,add:40},{text:"I want to be protected from debt if the business goes wrong, but I want to share control with my peers",balloon:2,add:40},{text:"I don't mind being 100% responsible for any debts if it all goes wrong",balloon:0,add:40}],
                       [{text:"It matters to me that clients perceive my surgery as a business",balloon:1,add:20},{text:"It doesn't matter that clients know I'm a one-man band",balloon:0,add:20},{text:"We want to be seen as professionals first, a business second",balloon:2,add:20}],
                       [{text:"I won't want outsiders to invest in my surgery",balloon:0,add:10},{text:"I might want outside investment in my surgery",balloon:1,add:20}],
                       [{text:"I don't want to spend time on accounts and admin",balloon:0,add:5},{text:"It's important to spend time on accounts and admin",balloon:1,add:5}],
                       [{text:"My customers will want to check out my trading credentials",balloon:1,add:20},{text:"My customers will buy from me without wanting to know more about me",balloon:0,add:20}, {text:"My customers will want to know my professional credentials more than my trading ability",balloon:2,add:25}]
               ]
        },
        {
               balloons:["Serviced office","Office"],
               questions:[
                       [{text:"Prefer red?",balloon:0,add:30},{text:"Prefer green?",balloon:1,add:30}],
                       [{text:"Prefer red?",balloon:0,add:30},{text:"Prefer green?",balloon:1,add:30}],
                       [{text:"Prefer red?",balloon:0,add:30},{text:"Prefer green?",balloon:1,add:30}]
               ]
        }
];
var quiz=[
        {question:"Which of these best describes the nature of your business?",options:[
                       {statement:"It's just me for now",action:'balloons=new balloonPlayer("balloons",balloonQuiz[0],container,"selectResult");',image:yoodoo.getFilePath('image',false)+'justme.png'},
                       {statement:"It's me as the professional, plus some support staff",action:'balloons=new balloonPlayer("balloons",balloonQuiz[0],container,"selectResult");',image:yoodoo.getFilePath('image',false)+'withmanagement.png'},
                       {statement:"It's me and other dentists working together",action:'selectResult(answers[2])',image:yoodoo.getFilePath('image',false)+'samepeople.png'}
               ]
        }
];
var answers=["Sole Trader","Limited Company","Limited Liability Partnership"];
var answer_images=[yoodoo.getFilePath('image',false)+'justme.png',yoodoo.getFilePath('image',false)+'samepeople.png',yoodoo.getFilePath('image',false)+'withmanagement.png'];
var answer_class=['justme','samepeople','withmanagement'];
var container=null;
function initQuiz(f) {
	container=ob("quizDiv");
	if (array_of_fields[companytype][1]!="") {
		selectResult(array_of_fields[companytype][1]);
	}else{
		start("question(0);");
	}
}
function start(code) {
	eval(code);
}
function question(n) {
	var ins=quiz[n].question;
	ins+="<table class='radioselector' style='float:right;width:auto'><tr>";
	for(var i=0;i<quiz[n].options.length;i++) {
		ins+="<td onclick='"+quiz[n].options[i].action+"' ><div "+((typeof(quiz[n].options[i].classNom)!="undefined")?"class='"+quiz[n].options[i].classNom+"'":"")+"></div>"+quiz[n].options[i].statement+"</td>";
	}
	ins+="</tr></table>";
	container.innerHTML=ins;
}
function selectResult(n) {
	var op='<div style="display:none"><textarea name="EF'+array_of_fields[companytype][0]+'" id="company-type">'+n+'</textarea><input type="hidden" name="fields[]" value="'+array_of_fields[companytype][0]+'" /></div>';
	op+='On the answers you&rsquo;ve given, we&rsquo;ve identified the right Company Structure for you.<br />To change it, either hit "Restart" or just click to pick one by hand.';
	//op+="<div style='float:right'>Click on another option to change the desired structure...</div>";
	op+="<h2>"+n+"</h2>";
	op+="<table class='radioselector' style='float:right;width:auto'><tr>";
	for(var i=0;i<answers.length;i++) {
		op+="<td onclick='selectResult(\""+answers[i]+"\")'";
		if (answers[i]==n) op+=" class='selected'";
		op+="><div class='"+answer_class[i]+"'></div>"+answers[i]+"</td>";
	}
	op+="</tr></table><div style='clear:both'></div><div class='abutton' onclick='question(0)' style='margin:0px'><div class='left'></div>restart this Doo-it<div class='right'></div></div><div style='clear:both'></div>";
	container.innerHTML=op;
	ob("steps").innerHTML='';
}
function setSteps(s,m,c) {
	var ins='';
	for(var i=0;i<m;i++) {
		ins+="<div class='step";
		if (i<s) ins+=" on";
		ins+="'></div>";
	}
	ins+="<div style='clear:both'></div>";
	c.innerHTML=ins;
}
function ob(id) {return document.getElementById(id);}
dooit.temporaries('ob','setSteps','selectResults','start','question','answers','answer_images','answer_class','container','initQuiz','balloonQuiz','quiz','theDiv','companytype','yourcompanyLoaded','company_defined');
