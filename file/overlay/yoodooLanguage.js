if (yoodoo===undefined) yoodoo={};

yoodoo.words={
	language:'en',
	languages:{
		en:'English',
		fr:'Français',
		es:'Español'
	},
	setLanguage:function(code) {
		if (this.languages[code]!==undefined) {
			this.language=code;
			return true;
		}
		return false;
	},
	getLanguage:function(code) {
		return this.languages[this.language];
	},
	get:function(key){
		var replacers={};
		if (arguments.length>1) replacers=arguments[1];
		var txt='';
		if (this.data[yoodoo.metaphor.toString()][key]!==undefined && this.data[yoodoo.metaphor.toString()][key][this.language]!==undefined) {
			txt = this.data[yoodoo.metaphor.toString()][key][this.language];
			txt=txt.replace(/\[[^\]]*\]/g,function(t) {
				var k=t.replace(/^\[/,'').replace(/\]$/,'');
				if (replacers!==undefined && replacers[k]!==undefined) return replacers[k];
				return '';
			});
			txt=yoodoo.words.embedded(txt);
		}
		if (txt=='') yoodoo.console("No "+key+" key");
		return txt;
	},
	capitalize:function(txt) {
		return txt.replace(/^[a-z]/,function(t) {
			return t.toUpperCase();
		});
	},
	embedded:function(txt) {
		txt=txt.replace(/\{[^\}]*\}/g,function(t) {
			var k=t.replace(/^\{/,'').replace(/\}$/,'');
			if (yoodoo.words.replaceFunctions[k]!==undefined) return yoodoo.words.replaceFunctions[k](t);
			return yoodoo.words.get(k);
		});
		return txt;
	},
	replaceFunctions:{
		name:function() {
			return yoodoo.user.getName();
		}
	},
	data:{},
	overrides:{},
	setOverrides:function(arr) {
		if (arr[yoodoo.metaphor.toString()]!==undefined) {
			this.overrides=arr[yoodoo.metaphor.toString()];
		}else{
			this.overrides=arr;
		}
		for(var k in this.overrides) {
			if (this.data[yoodoo.metaphor.toString()][k]===undefined) this.data[yoodoo.metaphor.toString()][k]={};
			for(var l in this.overrides[k]) {
				if (typeof(this.overrides[k][l])=="string" && this.overrides[k][l]!="") {
					this.data[yoodoo.metaphor.toString()][k][l]=this.overrides[k][l];
				}
			}
		}
	}
};
yoodoo.w=function(k) {
	if (arguments.length>1) {
		return yoodoo.words.get(k.toLowerCase().replace(/ /g,''),arguments[1]);
	}else{
		return yoodoo.words.get(k.toLowerCase().replace(/ /g,''));
	}
};
yoodoo.wr=function(txt) {
	return yoodoo.words.embedded(txt);
};
yoodoo.words.language=yoodoo.language;