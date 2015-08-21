/* --- dooit layout ---

	<div class='docDown'></div>
	<script type='text/javascript'>
	function initThis() {
		var params={};
		params.dependencies=[
			['dooits/utility/document_download.js',true],
			['css/utility/document_download.css',true] 
		];
		params.loaded=function(){
			docDown.init();
		}
		params.saveValues=['docDown.output'];
		params.finished='docDown.finishable';
		dooit.init(param);
	}

*/



dooit.temporaries('docDown');
var docDown={
	selectors:{
		container:'.docDown'
	},
	containers:{
		container:null
	},
	value:null,
	key:null,
	fields:{},
	init:function() {
		if (arguments.length>0) this.transposeOptions([],arguments[0]);
		this.loadFields();
		this.containers.container=$(this.selectors.container);
		if (this.key!==null && this.containers.container!==null) {
			this.render();
		}
	},
	loadFields:function() {
		if (typeof(array_of_default_fields)=="object" && array_of_default_fields.length>0
			&& typeof(array_of_global_fields)=="object" && array_of_global_fields.length>0) {
			for(var g=0;g<array_of_global_fields.length;g++) {
				for(var k=0;k<array_of_default_fields.length;k++) {
					if (array_of_global_fields[g]==array_of_default_fields[k] && this.key===null) {
						this.key=array_of_global_fields[g];
					}
				}
			}

		}
		if(this.key===null || array_of_fields[this.key]==undefined) this.key=null;
		if (this.key===null && array_of_default_fields.length>0) this.key=array_of_default_fields[0];
		if (this.key===null) {
			for(var k in array_of_fields) {
				if(this.key===null) this.key=k;
			}
		}
		if(this.key!==null) {
			try{
				eval('this.value='+array_of_fields[this.key][1]+';');
			}catch(e){
				this.value=array_of_fields[this.key][1];
			}
		}
		for(var k in array_of_fields) {
			if (k!=this.key) {
				try{
					eval('this.fields["'+k+'"]='+array_of_fields[k][1]+';');
				}catch(e){
					this.fields[k]=array_of_fields[this.key][1];
				}
			}
		}
		this.value=dooit.decode(this.value);
		this.fields=dooit.decode(this.fields);
	},
	transposeOptions:function(keys,obj) {
		for(var k in obj) {
			if(typeof(obj[k])=="object") {
				var thiskeys=keys.slice();
				thiskeys.push(k);
				this.transposeOptions(thiskeys,obj[k]);
			}else{
				this.setOption(keys,k,obj[k]);
			}
		}
	},
	render:function() {
		var h2=document.createElement("h2");	
		$(h2).html(dooittitle);
		this.containers.container.append(h2);
		if (dooitteaser!="") {
			var p=document.createElement("p");	
			$(p).html(yoodoo.dooitteaser);
			this.containers.container.append(p);
		}
		$(this.containers.container).addClass("icon48");
		var boxes=[];
		for(var f=0;f<this.value.files.length;f++) {
			var div=document.createElement("div");
			$(div).addClass("fileDownload");
			var d=document.createElement("a");
			if (/\/$/.test(yoodoo.option.baseUrl)) {
				if (/^\//.test(this.value.files[f].url)) this.value.files[f].url=this.value.files[f].url.replace(/^\//,'');
			}
			d.href=yoodoo.option.baseUrl+this.value.files[f].url;
			d.target='_blank';
			$(d).addClass("docFile");
			var icon=document.createElement("div");
			$(icon).addClass("fileIcon");
			$(icon).addClass(this.value.files[f].extension.toLowerCase()+"_Icon");
			d.appendChild(icon);
			var tit=document.createElement("div");
			$(tit).html(this.value.files[f].title).addClass("filetitle");
			icon.appendChild(tit);
			var des=document.createElement("div");
			$(des).html(this.value.files[f].description).addClass("filedescription");
			icon.appendChild(des);
			div.appendChild(d);
			boxes.push(d);
			this.containers.container.append(div);
		}
		if (boxes.length>1) {
			var maxH=0;
			for(var b=0;b<boxes.length;b++) {
				var h=$(boxes[b]).height();
				if (h>maxH) maxH=h;
			}
			$(this.containers.container).find('.fileDownload>a').height(maxH);
		}
	},
	finishable:function() {
		return true;
	},
	output:function() {
		return {};
	},
}
