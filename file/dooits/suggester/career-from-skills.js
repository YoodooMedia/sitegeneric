var career_suggester={
	skills:null,
	ppa:null,
	container:null,
	careers:[],
	careerscores:[],
	allFields:{},
	containerSelector:'.skills',
	maxSuggestions:10,
	matchedSkills:{},
	init:function() {
		if (arguments.length>0) this.containerSelector=arguments[0];
		this.container=$(this.containerSelector).get(0);
		this.allFields={};
		for(var k in array_of_fields) {
			try{
				eval('career_suggester.allFields[k]='+array_of_fields[k][1]+';');
			}catch(e) {
				career_suggester.allFields[k]=array_of_fields[k][1];
			}
		}
		for(k in career_suggester.allFields) {
			if (this.allFields[k].traits!=undefined && this.allFields[k].traits.basicFactorCombination!=undefined) {
				this.ppa=this.allFields[k].traits.basicFactorCombination.combination.replace('/','');
			}
			if (typeof(this.allFields[k])=="string") {
				if(/\|/.test(this.allFields[k])) this.skills=this.allFields[k].split('|');
			}
		}
		if(this.skills!==null && this.skills.length>0) {
			this.calculate();
			this.draw();
		}else{
			var op='<h2>'+dooittitle+'</h2>';
			op+="<p>You need to define your skills before I can make any suggestions.</p>";
			$(this.container).html(op);
		}
	},
	calculate:function() {
		skills.scores=[];
		var got={};
		
		this.matchedSkills={};
		for(var g=0;g<this.skills.length;g++) {
			got[this.skills[g]]=true;
		}
		for(var a=0;a<skills.activity.length;a++) {
			var s=0;
			for(var b=0;b<skills.skills.length;b++) {
				if (got[skills.skills[b]]) {
					s+=skills.linked[a][b];
					if(skills.linked[a][b]>0) this.matchedSkills[skills.skills[b]]=true;
				}
			}
			var ins=[s,skills.activity[a]];
			ins.push((this.ppa!==null && skills.ppa[this.ppa][a]==1));
			if (s>0) skills.scores.push(ins);
		}
		skills.scores.sort(function(a,b){return a[0]-b[0];});
		skills.scores.reverse();
	},
	draw:function() {
		var op='<h2>'+dooittitle+'</h2>';
		op+="<p>From a list of career suggestions, your skills match the following:</p>";
		var maxScore=0;
		op+="<div class='career_suggestions'>";
		for(var s=0;s<skills.scores.length;s++ ) {
			if (s<career_suggester.maxSuggestions) {
				op+="<div class='career_suggestion'>"+skills.scores[s][1]+(skills.scores[s][2]?" <em>matches your PPA profile too</em>":"")+"</div>";
				if (maxScore<skills.scores[s][0]) maxScore=skills.scores[s][0];
			}
		}
		op+="</div>";
		var sks=[];
		var lastsks='';
		for(var sk in this.matchedSkills) {
			sks.push(sk);
		}
		if(sks.length>0) {
			var com='<p>The skills you have that were used to compile your matches were:</p>';
			lastsks=sks.pop();
			op+="<div class='matchedSkills'>"+com+sks.join(", ")+((sks.length==0)?'':' and ')+lastsks+"</div>";
		}
		$(this.container).html(op);
		$(this.container).find('.career_suggestion').each(function(i,o) {
			if (i<career_suggester.maxSuggestions) {
				s=skills.scores[i][0]/maxScore;
				$(o).css('opacity',s);
			}
		});
	},
	output:function() {
		array_of_fields[this.key][1]=this.items.join("|");
		array_of_fields[this.hobbyKey][1]=this.json(this.hobbies);
		var reply={};
		eval('reply.EF'+array_of_fields[this.key][0]+'=array_of_fields[this.key][1];');
		eval('reply.EF'+array_of_fields[this.hobbyKey][0]+'=array_of_fields[this.hobbyKey][1];');
		//console.log(reply);
		return reply;
	},
	finishable:function() {
		return (this.items.length>0);
	}
};
dooit.temporaries('career_suggester');
