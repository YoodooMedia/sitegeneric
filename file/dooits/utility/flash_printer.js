
dooit.temporaries('flash_printer');
var flash_printer={
	movie:null,
	id:'',
	ready:'',
	flashid:'flashPrint',
	filename:'biz/printing.swf',
	generic:true,
	readyCallback:function(){},
	embed:function(id) {
		this.id=id;
		var flashvars = { };
		var params = { };
			params.wmode="opaque";
			params.menu = "false";
			params.allowScriptAccess = "always";
			params.allowNetworking = "all";
			params.swliveconnect = "true";
		var attributes = {id:this.flashid,name:this.flashid};
		swfobject.embedSWF(yoodoo.getFilePath("flash",this.generic)+this.filename,id,"700","298","9.0.0","expressInstall.swf", flashvars, params, attributes);
	},
	loaded:function() {
		this.ready=true;
		this.movie=swfobject.getObjectById(this.flashid);
		this.addCSS(this.flashCSS());
		this.readyCallback();
	},
	addGraph:function(graphdata) {
		graphdata[0][5]=500;
		graphdata[0][6]=300;
		graphdata[0][7]=300;
		graphdata[0][9]=3;
		graphdata[0][10]=20;
		if (this.movie!==null) this.movie.setGraph(graphdata);
	},
	addPie:function(graphdata) {
		var d=[[],[],[]];
		for(var k in graphdata) {
			d[0].push(this.colourArrayToInteger(graphdata[k].colour));
			//d[0].push((graphdata[k].colour[0]*256*256)+(graphdata[k].colour[1]*256)+(graphdata[k].colour[2]));
			d[1].push(parseFloat(graphdata[k].value));
			d[2].push(k);
		}
		if (this.movie!==null) this.movie.setPie(d);
	},
	addProportionBar:function(data) {
		var d=[];
		for(var i=0;i<data.order.length;i++) {
			var k=data.order[i];
			if (data.scores[k]!=undefined) {
				d.push([data.scores[k],data.quantity,this.colourArrayToInteger(this.colourArray((data.colours[k]==undefined)?[0,0,0]:data.colours[k])),((data.labels[k]==undefined)?'':data.labels[k])]);
			}
		}
		if (this.movie!==null) this.movie.setProportionBar(d);
	},
	colourArray:function(col) {
		var rgb=yoodooStyler.hexToRGB(col);
		return [rgb.r,rgb.g,rgb.b];
	},
	colourArrayToInteger:function(col) {
		return (col[0]*256*256)+(col[1]*256)+col[2];
	},
	addPage:function() {
		if (this.movie !== null) {
			this.movie.addPage();
		}else{
			alert("Could not find printing");
		}
	},
	addPageText:function(thehtml) {
		if (this.movie !== null) {
			this.movie.addPageText(thehtml);
		}else{
			alert("Could not find printing");
		}
	},
	fillPageWithNotes:function() {
		this.movie.fillPageWithNotes();
	},
	addCSS:function(css) {
		//css=this.flashCSS()+css;
		if (this.movie !== null) {
			this.movie.addCSS(css);
		}else{
			alert("Could not find printing");
		}
	},
	clearPages:function() {
		if (this.movie !== null) {
			this.movie.clearPages();
		}else{
			alert("Could not find printing");
		}
	},
	print:function() {
		if (this.movie !== null) {
			this.movie.doPrint();
		}else{
			alert("Could not find printing");
		}
	},
	loadPreviewGraph:function(fieldid) {
		return array_of_fields[fieldid]
		//eval("graphdata="+getValue(fieldid)+";");	
	},
	arrayToString:function(ip) {
		var op="";
		for(var i=0;i<ip.length;i++) {
			if (op!="") op+=",";
			if (typeof(ip[i])=="object") {
				op+=arrayToString(ip[i]);
			}else if (typeof(ip[i])=="number") {
				op+=ip[i].toString();
			}else{
				op+="'"+ip[i].toString()+"'";
			}
		}
		return "["+op+"]";
	},
	sumArray:function(ar) {
		t=0;
		for(c=0;c<ar.length;c++) t+=ar[c]*1;
		return t;
	},
	flashCSS:function() {
		var op="h1{color:#36469e;font-size:5;display:block;margin:2px;}";
		op+="h2{color:#36469e;font-size:4;display:block;margin:2px;}";
		op+="h3{color:#36469e;font-size:3.7;display:block;margin:2px;}";
		op+="h4{color:#36469e;font-size:3.5;display:block;margin:1px;}";
		op+="p{font-size:3;margin:0px;color:#555555;}";
		op+=".answer{color:#44a901;text-align:right;}";
		op+="span{display:block;}";
		op+=".ans{color:#555555;}";
		op+="b{color:#47aa01;}";
		op+=".red{text-align:right;color:#db1010;}";
		op+=".amber{text-align:right;color:#bc840d;}";
		op+=".green{text-align:right;color:#009900;}";
		op+=".indent{padding:0px 0px 0px 20px}";
		return op;
	}
}
function printLoaded() {flash_printer.loaded();}
dooit.temporaries('printLoaded');
