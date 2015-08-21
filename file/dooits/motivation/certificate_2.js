/* --- dooit layout ---

	<div class='certificate'></div>
	<script type='text/javascript'>
	function initThis() {
		var params={};
		params.dependencies=[
			['dooits/certificate.js',true]
		];
		params.loaded=function(){
			certificate.init({selectors:{container:'.certificate'}});
		}
		params.saveValues=['certificate.output'];
		params.finished='certificate.finishable';
		dooit.init(param);
	}

*/



dooit.temporaries('certificate');
var certificate={
	selectors:{
		container:'.certificate'
	},
	containers:{
		container:null,
		preview:null
	},
	download:'',
	header:[{image:'',absolute:true,w:278,h:190}],
	content:[{moveY:110,fontsize:24,textalign:'C',text:yoodoo.user.firstname+" "+yoodoo.user.lastname},{moveY:150,fontsize:24,textalign:'C',text:''}],
	orientation:'L',
	filename:yoodoo.user.firstname+" "+yoodoo.user.lastname+' certificate',
	username:yoodoo.user.firstname+" "+yoodoo.user.lastname,
	value:null,
	key:null,
	fields:{},
	init:function() {
		if (arguments.length>0) this.transposeOptions([],arguments[0]);
		this.loadFields();
		this.containers.container=$(this.selectors.container).empty().css({overflow:'hidden'});
		if (this.username.replace(/ /g,'')=='') {
			this.username=(yoodoo.user.nickname=='')?yoodoo.user.username:yoodoo.user.nickname;
		}
		this.render();
	},
	loaded:function() {
		var h=$(certificate.containers.container).height()-($(certificate.containers.preview).offset().top-$(certificate.containers.container).offset().top);
		certificate.containers.previewContainer=document.createElement("div");
		$(certificate.containers.previewContainer).height(h-10);
		certificate.containers.preview.parentNode.insertBefore(certificate.containers.previewContainer,certificate.containers.preview);
		certificate.containers.previewContainer.appendChild(certificate.containers.preview);
		$(certificate.containers.previewContainer).addClass("previewContainer").css({overflow:'hidden'});
		$(certificate.containers.previewContainer).bind("mousemove",function(e) {
			if (certificate!==undefined) {
				var ft=e.pageY-$(this).offset().top;
				var h=$(certificate.containers.previewContainer).height();
				var ms=$(certificate.containers.preview).outerHeight(true)-h;
				certificate.containers.previewContainer.scrollTop=Math.round(ms*(ft/h));
			}
		});
	},
	render:function() {
		var title=document.createElement("h2");
		$(title).html(yoodoo.dooittitle);
		var prompt=document.createElement("div");
		$(prompt).html("Click your certificate to download it&hellip;").css({float:'right'});
		var description=document.createElement("div");
		$(description).html(yoodoo.dooitteaser);
		$(this.containers.container).append(prompt).append(title).append(description);
		this.containers.preview=document.createElement("div");
		$(this.containers.preview).addClass("previewArea");
		$(this.containers.container).append(this.containers.preview);
		certificate.preview();
		$(certificate.containers.preview).bind("click",function() {
			certificate.getPDF();
		});
	},
	getPDF:function() {
		var content=[];
		for(var t=0;t<this.value.main.text.length;t++) {
			var txt=this.value.main.text[t];
			var col=this.hexToRGB(txt.colour);
			var fs=txt.size;
			fs=txt.size*2.83464;
			content.push({
				font:txt.font,
				fontstyle:txt.fontstyle,
				fontsize:fs.toFixed(1),
				lineheight:fs.toFixed(1),
				textalign:txt.align.substring(0,1),
				moveY:txt.y,
				indent:txt.x,
				fontcolor:[col.r,col.g,col.b],
				text:txt.text.replace(/\{user\}/g,certificate.username)
			});
		}
		var header=[{image:yoodoo.option.baseUrl+this.value.main.background,absolute:true,w:this.value.main.backgroundWidth,h:this.value.main.backgroundHeight}];
		var op={orientation:certificate.value.main.orientation.substring(0,1),header:header,content:content};
		yoodoo.toPDF({orientation:certificate.value.main.orientation.substring(0,1),header:header,footer:[],content:content},certificate.value.main.title.replace(/\{user\}/g,certificate.username));
	},
	preview:function() {
		$(this.containers.preview).empty().css({position:'relative'});
		var dpi=1;
		var w=$(this.containers.preview).width();
		if (this.value.main.orientation=="Landscape") {
			$(this.containers.preview).css({height:Math.round((190*w)/278)});
			dpi=278/w;
		}else{
			$(this.containers.preview).css({height:Math.round((278*w)/190)});
			dpi=190/w;
		}
		if (this.value.main.background!="") {
			var bd=document.createElement("img");
			bd.src=yoodoo.option.baseUrl+this.value.main.background;
			$(bd).attr("width",w+"px");
			$(bd).bind("error",function() {$(this).remove();}).css({position:"absolute",top:0,left:0});
			this.containers.preview.appendChild(bd);
		}
		for( var t=0;t<this.value.main.text.length;t++) {
			var d=document.createElement("div");
			$(d).html(this.value.main.text[t].text.replace(/\{user\}/g,certificate.username)).addClass("font-"+this.value.main.text[t].font);
			var styles=this.value.main.text[t].fontstyle.split("");
			for(var l=0;l<styles.length;l++) {
				if (styles[l]!="") $(d).addClass("font-"+styles[l]);
			}
			var fs=this.value.main.text[t].size/dpi;
			var h=this.value.main.text[t].height/dpi;
			var top=this.value.main.text[t].y/dpi;
			var indent=this.value.main.text[t].x/dpi;
			var dw=w-indent;
			$(d).css({
				color:'#'+this.value.main.text[t].colour,
				'font-size':fs.toFixed(1)+"px",
				'line-height':h.toFixed(1)+"px",
				height:h.toFixed(1)+"px",
				'text-align':this.value.main.text[t].align.toLowerCase(),
				top:top.toFixed(1)+"px",
				'padding-left':indent.toFixed(1)+"px",
				width:dw.toFixed(1)+"px"
			});
			this.containers.preview.appendChild(d);
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
		this.value=this.decode(this.value);
		this.fields=this.decode(this.fields);
	},
	decode:function(ip) {
		if (typeof(ip)=="string") {
			ip=ip.replace(/&sq;/g,"'");
			ip=ip.replace(/&dq;/g,'"');
			ip=ip.replace(/&nl;/g,"\n");
			return ip;
		}else if (typeof(ip)=="object"){
			for(var i in ip) {
				ip[i]=this.decode(ip[i]);
			}
		}
		return ip;
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
	setOption:function(keys,key,val) {
		try{
			var e=keys.join('.');
			if(e!='') {
				e='this.'+e;
			}else{
				e='this';
			}
			if(isNaN(key)) {
				e+='.'+key+"=val;";
			}else{
				e+='['+key+']=val;';
			}
			eval(e);

		}catch(e){}
	},
	finishable:function() {
		var ok=true;
		return ok;
	},
	output:function() {
		$(this.containers.previewContainer).slideUp();
		return {};
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
};