var dooit={
	sitefolder:'',
	// my libraries that are required
	dependencies:[],
	// the overlay stylesheets
	stylesheets:[],
	stylesheetTags:[],
	cachedFileElements:[],
	saveValues:[],
	loaded:null,
	visible:false,
	ready:false,
	lastHTML:'',
	dependenciesChecked:false,
	temporaryVariable:[],
	addTags:[],
	removeTags:[],
	jquery:{
		url:'../overlay/jquery-1-6-2-min.js',
		version:'1.6.2',
		fetched:false
	},
	swfobject:{
		jqurl:'../overlay/jq-swfobject.js',
		googleurl:'overlay/swfobject.js',
		fetched:false,
		jquery:false
	},
	init:function(opts) {
		this.xport=function() {};
		yoodoo.dropExport();
		/*while(this.cachedFileElements.length>0) {
			var ft=this.cachedFileElements.pop();
console.log(ft);
			ft.parentNode.removeChild(ft);
		}*/
		if (opts.finished) {
			eval('this.finished=function() {if ('+opts.finished+'!=undefined) {return '+opts.finished+'();}else{return true;}};');
		}else{
			this.finished=function(){var vals=dooit.values();return ((vals!='') && (vals!='[]') && (vals!='{}'));};
			//this.finished=function(){return false;};
		}
		if (opts.leave) {
			eval('this.leave=function() {if ('+opts.leave+'!=undefined) {return '+opts.leave+'();}else{return true;}};');
		}else{
			this.leave=function(){};
			//this.finished=function(){return false;};
		}
		var dependencies=[];
		if(opts.dependencies) dependencies=opts.dependencies;
		if(opts.js) {
			for(var i=0;i<opts.js.length;i++) {
				if (typeof(opts.js[i])=="string") {
					if(typeof(opts.jsUrl)!="undefined" && opts.jsUrl!="") opts.js[i]=opts.jsUrl+opts.js[i];
					dependencies.push([opts.js[i],false]);
				}else if (typeof(opts.js[i][1])=="string") {
					if(typeof(opts.jsUrl)!="undefined" && opts.jsUrl!="") opts.js[i][0]=opts.jsUrl+opts.js[i][0];
					dependencies.push([opts.js[i][0],false]);
				}else{
					if(typeof(opts.jsUrl)!="undefined" && opts.jsUrl!="") opts.js[i][0]=opts.jsUrl+opts.js[i][0];
					dependencies.push(opts.js[i]);
				}
			}
		}
		if(opts.css) {
			for(var i=0;i<opts.css.length;i++) {
				if (typeof(opts.css[i])=="string") {
					if(typeof(opts.cssUrl)!="undefined" && opts.cssUrl!="") opts.css[i]=opts.cssUrl+opts.css[i];
					dependencies.push([opts.css[i],false]);
				}else if (typeof(opts.js[i][1])=="string") {
					if(typeof(opts.cssUrl)!="undefined" && opts.cssUrl!="") opts.css[i][0]=opts.cssUrl+opts.css[i][0];
					dependencies.push([opts.css[i],false]);
				}else{
					if(typeof(opts.cssUrl)!="undefined" && opts.cssUrl!="") opts.css[i][0]=opts.cssUrl+opts.css[i][0];
					dependencies.push(opts.css[i]);
				}
			}
		}
		if (opts.loaded) this.loaded=opts.loaded;
		if (opts.saveValues) this.saveValues=opts.saveValues;
		var cachedElements=yoodoo.checkDependencies(dependencies,dooit.ready,dooit.failed);
		//this.cachedFileElements=yoodoo.checkDependencies(dependencies,dooit.ready,dooit.failed);
		//for(var f in this.cachedFileElements) {
		for(var f in cachedElements) {
			yoodoo.dooitFiles.push(cachedElements[f]);
		}
	},
	ready:function() {
		dooit.loaded();
		yoodoo.displayDooit();
	},
	failed:function() {
		alert("Some dependencies failed to load");
	},
	temporaries:function(arr) {
		/*if(typeof(arr)=="object") {
			for(var i=0;i<arr.length;i++) {
				this.temporaryVariable.push(arr[i]);
			}
		}else{*/
			for(var i=0;i<arguments.length;i++) {
				this.temporaryVariable.push(arguments[i]);
			}
		//}
	},
	removeTemporaries:function() {
		while(this.temporaryVariable.length>0) {
			var tmp=this.temporaryVariable.pop();
			try{
				eval(tmp+'=undefined;');
			}catch(ex) {}
		}
	},
	/*fetchStyleSheets:function(ss) {
		this.stylesheetCount=ss.length;
		this.stylesheetTags=[];
       		for(var i=0;i<ss.length;i++) {
			if (typeof(ss[i])!="string") {
				var j=0;
				var loadthis=false;
				while(j<ss[i].length && !loadthis) {
					if (typeof(ss[i][j][0])=="string") {
						loadthis=true;
						this.loadfile(ss[i][j][0],"css");
					}else if (ss[i][j][0][0]==this.BrowserDetect.browser) {
						eval('loadthis=(this.BrowserDetect.version'+ss[i][j][0][1]+');');
						if (loadthis) this.loadfile(ss[i][j][1],"css");
					}
					j++;
				}
			}else{
            			this.loadfile(ss[i],"css");
			}
        	}
	},
	checkJquery:function() {
		var required=false;
		if (typeof(jQuery)!=="undefined") {
			if (!this.jquery.fetched) {
				var v=$().jquery.split('.');
				var rv=this.jquery.version.split('.');
				while(rv.length<v.length) rv.push(0);
				while(v.length<rv.length) v.push(0);
				for(var vi=0;vi<rv.length;vi++) {
					if (v[vi]<rv[vi]) {
						required=true;
						break;
					}
				}
			}
			this.checkSwfobject();
		}else{
			required=true;
		}
		if (required && !this.jquery.fetched) {
			this.jquery.fetched=true;
			this.loadfile(this.jquery.url,"js");
		}
		if (required) setTimeout('dooit.checkJquery();',50);
	},
	checkSwfobject:function() {
		var required=false;
		if (this.swfobject.jquery) {
			if (typeof($.flash)!=="undefined") {
				this.checkDependencies();
			}else{
				required=true;
			}
			if (required && !this.swfobject.fetched) {
				this.swfobject.fetched=true;
				this.loadfile(this.swfobject.jqurl,"js");
			}
		}else{
			if (typeof(swfobject)!=="undefined") {
				this.checkDependencies();
			}else{
				required=true;
			}
			if (required && !this.swfobject.fetched) {
				this.swfobject.fetched=true;
				this.loadfile(this.swfobject.googleurl,"js");
			}
		}
		if (required) setTimeout('dooit.checkSwfobject();',50);
	},*/
	/*gotstylesheets:function() {
		var complete=true;
		for(var s=0;s<this.stylesheetTags.length;s++) {
			if(!this.cssLoaded(this.stylesheetTags[s])) complete=false;
		}
		return complete;
	},*/
	/*checkDependencies:function() {
		this.ready=true;
		for(var i=0;i<this.dependencies.length;i++) {
			var ok=false;
			eval("if (typeof("+this.dependencies[i][1]+")!=='undefined' && "+this.dependencies[i][1]+"!=false) ok=true;");
			if (!ok && !this.dependenciesChecked) this.loadfile(this.dependencies[i][0],"js");
			if (!ok) this.ready=false;
		}
		this.dependenciesChecked=true;
		var finBut=$('a#finishButton');
		if (this.ready && finBut.length>0) {
			finBut[0].setAttribute("onclick",'dooit.buildFields();'+finBut[0].getAttribute("onclick"));
		}
		if(!this.gotstylesheets()) this.ready=false;
		//if (this.stylesheetCount>0) this.ready=false;
		if (!this.ready) {
			setTimeout('dooit.checkDependencies();',300);
		}else if(this.loaded!==null){
			this.loaded();
			if (yoodoo!=undefined) yoodoo.displayDooit();
		}
	},*/
/*
	loadfile:function (filename, filetype){
		filename=this.translate_version(filename);
		 if (filetype=="js"){
		  var fileref=document.createElement('script');
		  fileref.setAttribute("type","text/javascript");
		  var folder=this.jsUrl;
		  if (typeof(yoodoo)!="undefined") {
			  folder=yoodoo.option.dooitUrl+this.jsUrl;
		  }else{
			  folder=this.basejsUrl+this.jsUrl;
		  }
		  fileref.setAttribute("src",folder+filename);
		if (typeof(yoodoo)!="undefined") yoodoo.dooitFiles.push(fileref);
		 }else if (filetype=="css"){
		  var fileref=document.createElement("link");
		  fileref.setAttribute("rel", "stylesheet");
		  fileref.setAttribute("type", "text/css");
		this.stylesheetTags.push(fileref);
		  var folder=this.cssUrl;
		  if (typeof(yoodoo)!="undefined") {
			  folder=yoodoo.option.dooitUrl+this.cssUrl;
		  }else{
			  folder=this.basecssUrl+this.cssUrl;
		  }
		  this.console(folder+filename);
		  fileref.setAttribute("href",folder+filename);
		if (typeof(yoodoo)!="undefined") yoodoo.dooitFiles.push(fileref);
		 }
		 if (typeof fileref!="undefined") {
			 document.getElementsByTagName("head")[0].appendChild(fileref);
		 }
	},
	cssLoaded:function(css){
		for(var s=0;s<document.styleSheets.length;s++) {
			if(document.styleSheets[s].href==css.href) return true;
		}
		return false;
	},*/
	console:function(txt) {
		if(typeof(yoodoo)!="undefined") yoodoo.console(txt);
	},
/*
	translate_version:function(fn) {
		this.console("Check version of "+fn);
		var iscss=/\.css$/i.test(fn);
		var isjs=/\.js$/i.test(fn);
		var f=fn.replace('.js','').replace('.css','');
		
		if (typeof(yoodoo_js_versions)!='undefined' && isjs && yoodoo_js_versions[f]) {
			fn=f+yoodoo_js_versions[f]+'.js';
		}else if(typeof(yoodoo_css_versions)!='undefined' && iscss && yoodoo_css_versions[f]) {
			fn=f+yoodoo_css_versions[f]+'.css';
		}else{
			fn=fn+'?r='+new Date().getTime();
		}
		this.console("New filename: "+fn);
		return fn;
	},
*/
	getInputOutput:function() {
		var op={};
		var ips=$('form[name=exerciseForm]').find('input,textarea').get();
		var rads={};
		for(var k=0;k<ips.length;k++) {
			if (/\[\]$/.test(ips[k].name) && ips[k].name!="fields[]") {
				rads[ips[k].name.replace('[]','')]=true;
			}else{
				op[ips[k].name]=ips[k].value;
			}
		}
		for (var i in rads) {
			op[i]=getValue(i);
		}
		if (this.addTags.length>0) {
			op['addtags']=this.addTags.join(",");
		}
		if (this.removeTags.length>0) {
			op['removetags']=this.removeTags.join(",");
		}
		this.addTags=[];
		this.removeTags=[];
		return op;
	},
	values:function() {
		var op={};
		for(var p=0;p<this.saveValues.length;p++) {
			var arr={};
			if (typeof(this.saveValues[p])=="string") {
				eval('arr='+this.saveValues[p]+'();');
			}else if (typeof(this.saveValues[p])=="function") {
				arr=this.saveValues[p]();
			}
			for(var k in arr) {
				op[k]=arr[k];
			}
		}
		if (this.addTags.length>0) {
			op['addtags']=this.addTags.join(",");
		}
		if (this.removeTags.length>0) {
			op['removetags']=this.removeTags.join(",");
		}
		this.addTags=[];
		this.removeTags=[];
		return op;
	},
	addTag:function(tag) {
		var ai=this.inAddTag(tag);
		var ri=this.inRemoveTag(tag);
		if (ri>=0) this.removeTags.splice(ri,1);
		if (ai<0) this.addTags.push(tag);
	},
	removeTag:function(tag) {
		var ai=this.inAddTag(tag);
		var ri=this.inRemoveTag(tag);
		if (ai>=0) this.addTags.splice(ai,1);
		if (ri<0) this.removeTags.push(tag);
	},
	inAddTag:function(tag) {
		var idx=-1;
		for(var i=0;i<this.addTags.length;i++) {
			if (this.addTags[i]==tag) idx=i;
		}
		return idx;
	},
	inRemoveTag:function(tag) {
		var idx=-1;
		for(var i=0;i<this.removeTags.length;i++) {
			if (this.removeTags[i]==tag) idx=i;
		}
		return idx;
	},
	buildFields:function() {
		var f=obj('form[name=exerciseForm]');
		var vals=this.values();
		if (this.addTags.length>0) vals.addtags=this.addTags.join(",");
		if (this.removeTags.length>0) vals.removetags=this.removeTags.join(",");
		for(var k in vals) {
			if (typeof(vals[k])=="string") {
				var ip=$(f).fins('input[name='+k+'],textarea[name='+k+']').get();
				if (ip.length==0) {
					var newip=document.createElement("textarea");
					newip.style.display="none";
					newip.name=k;
					newip.id=k;
					newip.value=vals[k];
					//var newip=eez.createHTML('<textarea style="display:none" name="'+k+'" id="'+k+'">'+vals[k]+'</textarea>')[0];
					f.appendChild(newip);
					var newef=document.createElement("input");
					newef.type="hidden";
					newef.name="fields[]";
					newef.value=k.replace(/^EF/,'');
					f.appendChild(newef);
					//f.appendChild(eez.createHTML('<input type="hidden" name="fields[]" value="'+k.replace(/^EF/,'')+'" />')[0]);
				}else{
					ip[0].value=vals[k];
				}
			}
		}
	},
	finishable:function() {
		return this.finished();
	},
	radioValue:function(name) {
		var rads=$("input[type=radio]").get();
		for(var i=0;i<rads.length;i++) {
			if (rad[i].name==name) {
				if (rads[i].checked) {
					return rads[i].value;
				}
			}
		}
		return null;
	},
	setRadioValue:function(name,val) {
		var rads=$("input[type=radio]").get();
		if(!(/^EF\d/.test(name))) name="EF"+array_of_fields[name][0];
		for(var i=0;i<rads.length;i++) {
			if (rads[i].name==name+'[]') {
				if (rads[i].value==val) {
					rads[i].checked=true;
				}else if (rads[i].checked) {
					rads[i].checked=false;
				}
			}
		}
	},
	getRadioValue:function(name) {
		var val='';
		if(!(/^EF\d/.test(name))) name="EF"+array_of_fields[name][0];
		var rads=$("input[type=radio]").get();
		for(var i=0;i<rads.length;i++) {
			if(rads[i].name==name+'[]') {
				if(rads[i].checked) return rads[i].value;
			}
		}
		return "";
	},
	setSelectValue:function(elem,val) {
		$(elem).val(val);
	},
	show:function(id,display){
		if (display) {
			$('#'+id).slideDown();
		}else{
			$('#'+id).slideUp();
		}
	},
	checkBoxes:{},
	drawCheckBoxes:function(name) {
		var click=function(){return true;};
		if (arguments.length>1) click=arguments[1];
		//var tables=$("#exercise_content table.checkboxes").get();
		if (!(/^EF\d/.test(name))) name='EF'+array_of_fields[name][0];
		var these=$('table.checkboxes input[type=radio]').get();
		if (these.length>0) {
			var opts={items:[]};
			for(var i=0;i<these.length;i++) {
				if(these[i].name==name+"[]") {
					opts.items.push({element:these[i],checked:these[i].checked,value:these[i].value});
				}
			}
			var table=dooit.parentElement(opts.items[0].element,'checkboxes');
			var lbl=$(table).find('label').get();
			for(var l=0;l<lbl.length;l++) {
				if (l<opts.items.length) opts.items[l].label=$(lbl[l]).html();
			}
			var t=document.createElement("table");
			$(t).addClass("checkselector");
			$(t).css('float','right');
			$(t).css('width','auto');
			t.id="check"+name;
			//var ins="<table class='checkselector' style='float:right;width:auto' id='check"+name+"'><tr>";
			var ins="<tr>";
			for(i=0;i<opts.items.length;i++) {
				ins+="<td id='"+i+"' onclick='dooit.clickCheckbox(this)' class='"+((opts.items[i].checked)?"selected":"")+"'>"+opts.items[i].label+"</td>";
			}
			ins+="</tr>";
			t.innerHTML=ins;
			table.parentNode.insertBefore(t,table);
			$(table).css("display","none");
			opts.click=click;
			dooit.checkBoxes[name]=opts;
		}
	},
	clickCheckbox:function(o) {
		var i=o.id;
		$(o).siblings('td.selected').removeClass("selected");
		$(o).addClass("selected");
		var t=dooit.parentElement(o,'checkselector');
		var name=t.id.replace(/^check/,'');
		var val='';
		for(var c=0;c<dooit.checkBoxes[name].items.length;c++) {
			if(i==c) {
				dooit.checkBoxes[name].items[c].checked=!dooit.checkBoxes[name].items[c].checked;
				val=dooit.checkBoxes[name].items[c].checked?dooit.checkBoxes[name].items[c].value:'';
			}else{
				dooit.checkBoxes[name].items[c].checked=false;
			}
			if (dooit.checkBoxes[name].items[c].checked) {
				$(dooit.checkBoxes[name].items[c].element).addClass("selected");
			}else{
				$(dooit.checkBoxes[name].items[c].element).removeClass("selected");
			}
		}
		dooit.setRadioValue(name,val);
		dooit.checkBoxes[name].click();
	},
	parentElement:function(o,c) {
		if(typeof(o)=="undefined") return document.body;
		if(o==document.body) return document.body;
		if ($(o).hasClass(c)) return o;
		return dooit.parentElement(o.parentNode,c);
	},
     keyCode:function(e) {
         var keycode;
         if (window.event) keycode = window.event.keyCode;
         else if (e) keycode = e.which;
         var key={
             code:keycode,
             alpha:(keycode>64 && keycode<91),
             numeric:((keycode>47 && keycode<58)||(keycode>95 && keycode<106)),
             decimal:((keycode>47 && keycode<58)||(keycode>95 && keycode<106)||(keycode==189)||(keycode==190)||(keycode==110)),
             enter:(keycode==13),
             escape:(keycode==27),
            
  input:((keycode==190)||(keycode==188)||(keycode==192)||(keycode==111)||(keycode==192)||(keycode==191)||(keycode==107)||(keycode==187)||(keycode==189)||(keycode==106)||(keycode==110)||(keycode==220)||(keycode==223)||(keycode==222)||(keycode==221)||(keycode==219)||(keycode==186)),
             tab:(keycode==9),
             shift:(keycode==16),
             backspace:(keycode==8),
             del:(keycode==46),
             fkey:((keycode>111 && keycode<124)?keycode-111:false),
             home:(keycode==36),
             end:(keycode==35),
             up:(keycode==38),
             down:(keycode==40),
             left:(keycode==37),
             right:(keycode==39),
			 navigate:false
         };
         key.navigate=(key.left||key.right||key.del||key.backspace||key.shift||key.home||key.end||key.tab);
         return key;
     },
	json:function(o) {

		if (o===null || typeof(o)=="undefined") {
			return 'null';
		}else if (typeof(o)=="string") {
			return '"'+this.encode(o)+'"';
//'"'+o.replace(/"/g,'\\"')+'"';
		}else if (o.getFullYear) {
			return 'new Date('+o.getFullYear()+','+o.getMonth()+','+o.getDate()+')';
		}else if (typeof(o)=="number") {
			return ''+o;
		}else if (typeof(o)=="boolean") {
			return o?"true":"false";
		}else{
			var keyed=false;
			for(var k in o) {
				if (isNaN(k)) keyed=true;
			}
			var col=[];
			if (keyed) {
				for(var k in o) {
					col.push('"'+k+'":'+this.json(o[k]));
				}
			}else{
				for(var k in o) {
					col.push(this.json(o[k]));
				}
			}
			var op=col.join(",");
			if (keyed) {
				op='{'+op+'}';
			}else{
				op='['+op+']';
			}
			return op;
		}


		/*if (typeof(o)=="string") {
			return '"'+o.replace(/"/g,'`"')+'"';
		}else if (typeof(o.getFullYear)!="undefined") {
			return 'new Date('+o.getFullYear()+','+o.getMonth()+','+o.getDate()+')';
		}else{
			var keyed=false;
			for(var k in o) {
				if (isNaN(k)) keyed=true;
			}
			var col=[];
			if (keyed) {
				for(var k in o) {
					col.push(k+':'+this.json(o[k]));
				}
			}else{
				for(var k in o) {
					col.push(this.json(o[k]));
				}
			}
			var op=col.join(",");
			if (keyed) {
				op='{'+op+'}';
			}else{
				op='['+op+']';
			}
			return op;
		}*/
	},
	encode:function(ip) {
		ip=ip.replace(/'/g,'&sq;');
		ip=ip.replace(/"/g,'&dq;');
		return ip;
	},
	decode:function(ip) {
		if (typeof(ip)=="string") {
			ip=ip.replace(/&sq;/g,"'");
			ip=ip.replace(/&dq;/g,'\\"');
			return ip;
		}else if (typeof(ip)=="object"){
			for(var i in ip) {
				ip[i]=this.decode(ip[i]);
			}
		}
		return ip;
	},
	fetchJsonFromArray:function(key) {
		var val=array_of_fields[key][1].replace(/`/g,'\\');
		var obj=[];
		try{
			eval('obj='+val+';');
		}catch(err) {
			
		}
		return [val,obj];
	},
	 insertTitle:function() {
		if (typeof(yoodoo.dooittitle!="undefined")) {
			var h2=document.createElement("h2");
			h2.innerHTML=yoodoo.dooittitle;
			var ex=$('#exercise_content').get(0);
			var bits=ex.getElementsByTagName("*");
			if (bits.length>0) {
				ex.insertBefore(h2,bits[0]);
			}else{
				ex.appendChild(h2);
			}
		}
	},
	setExport:function(ex) {
		this.xport=ex;
		if (typeof(yoodoo)!="undefined") yoodoo.setExport();
	},
	xport:function() {
		
	}/*,
	BrowserDetect:{
		init: function () {
			this.browser = this.searchString(this.dataBrowser) || "An unknown browser";
			this.version = this.searchVersion(navigator.userAgent)
				|| this.searchVersion(navigator.appVersion)
				|| "an unknown version";
			this.OS = this.searchString(this.dataOS) || "an unknown OS";
		},
		searchString: function (data) {
			for (var i=0;i<data.length;i++)	{
				var dataString = data[i].s;
				var dataProp = data[i].p;
				this.versionSearchString = data[i].vs || data[i].i;
				if (dataString) {
					if (dataString.indexOf(data[i].ss) != -1)
						return data[i].i;
				}
				else if (dataProp)
					return data[i].i;
			}
		},
		searchVersion: function (dataString) {
			var index = dataString.indexOf(this.versionSearchString);
			if (index == -1) return;
			return parseFloat(dataString.substring(index+this.versionSearchString.length+1));
		},
		dataBrowser: [{s: navigator.userAgent,ss: "Chrome",i: "Chrome"},{ s: navigator.userAgent,ss: "OmniWeb",vs: "OmniWeb/",i: "OmniWeb"},{s: navigator.vendor,ss: "Apple",i: "Safari",vs: "Version"},{p: window.opera,i: "Opera",vs: "Version"},{s: navigator.vendor,ss: "iCab",i: "iCab"},{s: navigator.vendor,ss: "KDE",i: "Konqueror"},{s: navigator.userAgent,ss: "Firefox",i: "Firefox"},{s: navigator.vendor,ss: "Camino",i: "Camino"},{s: navigator.userAgent,ss: "Netscape",i: "Netscape"},{s: navigator.userAgent,ss: "MSIE",i: "Explorer",vs: "MSIE"},{s: navigator.userAgent,ss: "Gecko",i: "Mozilla",vs: "rv"},{s: navigator.userAgent,ss: "Mozilla",i: "Netscape",vs: "Mozilla"}],
		dataOS : [{s: navigator.platform,ss: "Win",i: "Windows"},{s: navigator.platform,ss: "Mac",i: "Mac"},{   s: navigator.userAgent,   ss: "iPhone",   i: "iPhone/iPod"    },{s: navigator.platform,ss: "Linux",i: "Linux"}]
	
	}*/
}
