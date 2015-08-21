function checkNumericOnly(srcObj,e,enterHandler) {
    if (window.event) {
        e=window.event;
        keycode=window.event.keyCode;
    }else{
        keycode=e.which;
    }
	reply=false;
	if (!srcObj.value.match(/[\.]/)) {
		if (keycode==190 || keycode==110) reply=true; //decimal
	}
	if (keycode>=48 && keycode<=57) reply=true; //top numbers
	if (keycode>=96 && keycode<=105) reply=true; //keypad numbers
	if (keycode==9) reply=true; //tab
	if (keycode==8 || keycode==46 || keycode==36 || keycode==35 || keycode==37 || keycode==39) reply=true;
	if (keycode==13 && enterHandler!=null) enterHandler();
	//if (!reply) objid("total").style.color="#f00";
	return reply;
}
function checkAlphaNumericOnly(srcObj,e,enterHandler) {
    if (window.event) {
        e=window.event;
        keycode=window.event.keyCode;
    }else{
        keycode=e.which;
    }
	reply=false;
	if (keycode==190 || keycode==110) reply=true; //decimal
	if (keycode>=65 && keycode<=90) reply=true; //letter
	if (keycode>=48 && keycode<=57) reply=true; //top numbers
	if (keycode>=96 && keycode<=105) reply=true; //keypad numbers
	if (keycode==32) reply=true; //space
	if (keycode==9) reply=true; //tab
	if (keycode==16) reply=true; //shift
	if (keycode==8 || keycode==46 || keycode==36 || keycode==35 || keycode==37|| keycode==39) reply=true;
	if (keycode==13 && enterHandler!=null) enterHandler();
	return reply;
}
function checkEnterEsc(srcObj,e,enterHandler,escHandler) {
    if (window.event) {
        e=window.event;
        keycode=window.event.keyCode;
    }else{
        keycode=e.which;
    }
	if (keycode==13 && enterHandler!=null) {
		enterHandler(srcObj);
		return false;
	}else if (keycode==27 && escHandler!=null) {
		escHandler(srcObj);
		return false;
	}else{
		return true;
	}
}
function removeTheNode(idname) {
	if (typeof(idname)=="string") {
		if (objid(idname)!=null)
		{
			thisNode=objid(idname);
			thisNode.parentNode.removeChild(thisNode);
		}
	}else{
		idname.parentNode.removeChild(idname);
	}
}
function pasteRawHTML(theHTML,destinationObj)
{
    var hiddenArea=null;
    if (objid("ParseArea")==null)
    {
        hiddenArea=document.createElement("div");
        hiddenArea.style.display="none";
        hiddenArea.ID="ParseArea";
    }
    else
    {
        hiddenArea = objid("ParseArea");
    }
    hiddenArea.innerHTML=theHTML;
    for (c=0;c<hiddenArea.childNodes.length;c++)
    {
        destinationObj.appendChild(hiddenArea.childNodes[c]);
    }
    hiddenArea.innerHTML="";
}
function loadjscssfile(filename, filetype){
 if (filetype=="js"){ //if filename is a external JavaScript file
  var fileref=document.createElement('script');
  fileref.setAttribute("type","text/javascript");
  fileref.setAttribute("src", filename);
 }
 else if (filetype=="css"){ //if filename is an external CSS file
  var fileref=document.createElement("link");
  fileref.setAttribute("rel", "stylesheet");
  fileref.setAttribute("type", "text/css");
  fileref.setAttribute("href", filename);
 }
 if (typeof fileref!="undefined")
  document.getElementsByTagName("head")[0].appendChild(fileref);
}
//loadjscssfile('/uploads/file/dooit.css', 'css');

function get_radio_value(obj) {
	var reply=null;
	for (var i=0; i < obj.length; i++) {
	   if (obj[i].checked) reply = obj[i].value;
	}
	return reply;
}
function set_radio_value(obj,val) {
	for (var i=0; i < obj.length; i++) {
		obj[i].checked=(val==obj[i].value);
	}
}
function eventLocation(e) {
	if (window.event) {
		x = window.event.clientX + document.documentElement.scrollLeft + document.body.scrollLeft;
		y = window.event.clientY + document.documentElement.scrollTop + document.body.scrollTop;
	}else{
		x = e.clientX + window.scrollX;
		y = e.clientY + window.scrollY;
	}
	return [x,y];
}
function getTopLeft(oElement) {
	loc = [0,0];
	while( oElement != null ) {
		if (oElement.style) {
			if (oElement.style.position=="absolute" || oElement.style.position=="relative") {
				if (oElement.style.left) {
					loc[1] += 1*oElement.style.top.replace("px","");
					loc[0] += 1*oElement.style.left.replace("px","");
				}else{
					loc[0] += oElement.offsetLeft;
					loc[1] += oElement.offsetTop;
				}
				if (oElement.offsetParent.style.position=="relative") {
					oElement = oElement.offsetParent;
				}else{
					oElement=null;
				}
			}else{
				loc[0] += oElement.offsetLeft;
				loc[1] += oElement.offsetTop;
				oElement = oElement.offsetParent;
			}
		}else{
			loc[0] += oElement.offsetLeft;
			loc[1] += oElement.offsetTop;
			oElement = oElement.offsetParent;
		}
	}
	return loc;
}
function getFlashMovie(movieName) {
	//var isIE = navigator.appName.indexOf("Microsoft") != -1;
	//return (isIE) ? window[movieName] : document[movieName];
	return swfobject.getObjectById(movieName);
}
function embedGraph(id) {
	var flashvars = { };
	var params = { };
		params.wmode="opaque";
		params.menu = "false";
		params.allowScriptAccess = "always";
		params.allowNetworking = "all";
		params.swliveconnect = "true";
	var attributes = {id:"graph",name:"graph"};
	swfobject.embedSWF(yoodoo.getFilePath('flash',true)+'biz/graph.swf',id,"500","400","9.0.0","expressInstall.swf", flashvars, params, attributes);
}
function embedPreview(id) {
	var flashvars = { };
	var params = { };
		params.wmode="opaque";
		params.menu = "false";
		params.allowScriptAccess = "always";
		params.allowNetworking = "all";
		params.swliveconnect = "true";
	var attributes = {id:"printing",name:"printing"};
	swfobject.embedSWF(yoodoo.getFilePath('flash',true)+'biz/printing.swf',id,"700","298","9.0.0","expressInstall.swf", flashvars, params, attributes);
}
function placeBusinessNames() {
	nom=getValue("Name_of_business");
	if (nom=="") nom="my business";
	spans=objid("exercise_content").getElementsByTagName("SPAN");
	for(s=0;s<spans.length;s++) {
		if (spans[s].className=='businessname') spans[s].innerHTML=nom;
	}
}
function placeUserNames() {
	nom=objid("profile_name").innerHTML.split(" ");
	spans=objid("exercise_content").getElementsByTagName("SPAN");
	for(s=0;s<spans.length;s++) {
		if (spans[s].className=='username') spans[s].innerHTML=nom[0];
	}
}
function buildSelector(data,container,targetfield,handler) {
	var tmp=new radioCheckSelection(data,"#"+container,targetfield,handler);
}
function radioCheckSelection(data,container,targetfield,handler) {
	this.data=data;
	this.container=$(container).get(0);
	this.field=targetfield;
	this.handler=handler;
	gv=getValue(targetfield);
	splits=new Array();
	if (gv!="") splits=getValue(targetfield).split(",");
	ins="";
	for(i=0;i<data.length;i++) {
		var seled=false;
		for(j=0;j<splits.length;j++) {
			if (data[i].value==splits[j]) seled=true;
		}
		this.data[i].selected=seled;
		ins+='<td id="'+container+'-'+i+'" onclick=\'this.choose()\' class="'+(seled?"selected":"")+(this.data[i].unique?" unique":"")+'">';
		if (data[i].image) ins+='<img src="'+data[i].image+'" />';
		ins+=data[i].name+'</td>';
	}
	w=data.length*120;
	cls="checkselector";
	if (data[0]["image"]) cls="radioselector";
	$(this.container).html('<table class="'+cls+'" style="float:right;width:auto"><tr>'+ins+'</tr></table><div style="clear:both"></div>');
	var newbuttons=$(this.container).find("td").get();
	for(var b=0;b<newbuttons.length;b++) {
		newbuttons[b].selection=this;
		newbuttons[b].choose=function() {
			var i=$(this).prevAll("td").get().length;
			this.selection.data[i].selected=!this.selection.data[i].selected;
			if (this.selection.data[i].unique) {
				for(var ii=0;ii<this.selection.data.length;ii++) {
					if (i!=ii) this.selection.data[ii].selected=false;
				}
				$(this).siblings("td").removeClass("selected");
			}
			$(this).siblings("td.unique").removeClass("selected");
			if (this.selection.data[i].selected) {
				$(this).addClass("selected");
			}else{
				$(this).removeClass("selected");
			}
			
			var v=new Array();
			for(j=0;j<this.selection.data.length;j++) {
				if (this.selection.data[j].selected) v.push(this.selection.data[j].value);
			}
			setValue(this.selection.field,v.join(','));
			this.selection.handler();
		};
	}
	
}
var selectorData=new Array();
function buildSelector2(data,container,targetfield,handler) {
	selectorData[container]=[data,container,targetfield,handler];
	gv=getValue(targetfield);
	splits=new Array();
	if (gv!="") splits=getValue(targetfield).split(",");
	
	ins="";
	for(i=0;i<data.length;i++) {
		seled=false;
		for(j=0;j<splits.length;j++) {
			if (data[i]["value"]==splits[j]) seled=true;
		}
		selectorData[container][0][i]["selected"]=seled;
		ins+='<td id="'+container+'-'+i+'" onclick=\'selectOption(this)\' class="'+(seled?"selected":"")+'">';
		if (data[i]["image"]) ins+='<img src="'+data[i]["image"]+'" />';
		ins+=data[i]["name"]+'</td>';
	}
	w=data.length*120;
	cls="checkselector";
	if (data[0]["image"]) cls="radioselector";
	objid(container).innerHTML='<table class="'+cls+'" style="float:right;width:auto"><tr>'+ins+'</tr></table><div style="clear:both"></div>';
}
function selectOption(srcObj) {
	cont=srcObj.id.split("-");
	container=cont[0];
	//container=srcObj.parentNode.parentNode.id;
	//i=srcObj.id.replace(container,'');
	i=cont[1];
	seled=selectorData[container][0][i]["selected"];
	if (selectorData[container][0][i]["unique"]) {
		for(j=0;j<selectorData[container][0].length;j++) {
			sel=(j==i);
			li=objid(container+"-"+j);
			li.className=sel?"selected":"";
			selectorData[container][0][j]["selected"]=sel;
		}
	}else{
		for(j=0;j<selectorData[container][0].length;j++) {
			if (j!=i) {
				if (selectorData[container][0][j]["unique"]) {
					selectorData[container][0][j]["selected"]=false;
					objid(container+"-"+j).className="";
				}
			}
		}
		selectorData[container][0][i]["selected"]=!selectorData[container][0][i]["selected"];
		li=objid(container+"-"+i);
		li.className=selectorData[container][0][i]["selected"]?"selected":"";
	}
	v=new Array();
	for(j=0;j<selectorData[container][0].length;j++) {
		if (selectorData[container][0][j]["selected"]) v.push(selectorData[container][0][j]["value"]);
	}
	setValue(selectorData[container][2],v.join(','));
	selectorData[container][3]();
}
function objid(id) {
	return document.getElementById(id);
}
function pasteRawHTML(theHTML,destinationObj)
{
    var hiddenArea=null;
    if (objid("ParseArea")==null)
    {
        hiddenArea=document.createElement("div");
        hiddenArea.style.display="none";
        hiddenArea.ID="ParseArea";
    }
    else
    {
        hiddenArea = objid("ParseArea");
    }
    hiddenArea.innerHTML=theHTML;
    for (c=0;c<hiddenArea.childNodes.length;c++)
    {
        destinationObj.appendChild(hiddenArea.childNodes[c]);
    }
    hiddenArea.innerHTML="";
}
function setCheckBoxes() {
	tables=$("#exercise_content table").get();
	checks=new Array();
	for(t=0;t<tables.length;t++) {
		if (tables[t].className=="checkboxes") checks.push(tables[t]);
	}
	for(t=0;t<checks.length;t++) {
		d=new Array();
		labels=checks[t].getElementsByTagName("LABEL");
		buttons=checks[t].getElementsByTagName("INPUT");
		id="temp";
		for(l=0;l<labels.length;l++) {
			id=buttons[l].name.replace("[]","");
			d.push({'image':'','name':labels[l].innerHTML,'value':buttons[l].value,'unique':true,'selected':buttons[l].checked});
		}
		pasteRawHTML("<div id='"+id+"'></div>",checks[t].parentNode);
		//pasteRawHTML("<div id='"+id+"'></div>",document.body);
		targetfield="";
		for(rads in radios) {
			if (radios[rads]==id+"[]") targetfield=rads;
		}
		buildSelector(d,id,targetfield,checkFinish);
		checks[t].style.display="none";
	}
}
function addGraph() {
	graphdata[0][5]=500;
	graphdata[0][6]=300;
	graphdata[0][7]=300;
	graphdata[0][9]=3;
	graphdata[0][10]=20;
	if (thegraph = getFlashMovie('printing')) thegraph.setGraph(graphdata);
}
function addPage() {
	if (thegraph = getFlashMovie('printing')) {
		thegraph.addPage();
	}else{
		alert("Could not find printing");
	}
}
function addPageText(thehtml) {
	if (thegraph = getFlashMovie('printing')) {
		thegraph.addPageText(thehtml);
	}else{
		alert("Could not find printing");
	}
}
function addCSS(css) {
	if (thegraph = getFlashMovie('printing')) thegraph.addCSS(css);
}
function printThePreview() {
	if (thegraph = getFlashMovie('printing')) thegraph.doPrint();
}
function loadPreviewGraph(fieldid) {
	eval("graphdata="+getValue(fieldid)+";");	
}
function arrayToString(ip) {
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
}
function sumArray(ar) {
	t=0;
	for(c=0;c<ar.length;c++) t+=ar[c]*1;
	return t;
}
function flashCSS() {
	op="h1{color:#36469e;font-size:6;}";
	op+="p{font-size:4;margin-top:2;color:#44a901}";
	op+="b{color:#47aa01}";
	return op;
}
var myIP='';
var myLocation=null;
var locationHandler=null;
var jsonip=null;
function getMyIp(anip) {
	ipinput=objid('ipinput');
	if (anip) {
		myIP=anip;
		getMyLocation();
	}else{
		var url = ((typeof(yoodoo)!="undefined")?yoodoo.option.baseUrl:'/')+"ip.php?r="+(new Date().getTime());
		jsonip=new JSONscriptRequest(url);
		jsonip.buildScriptTag();
		jsonip.addScriptTag();

		//sendPostRequest(((typeof(yoodoo)!="undefined")?yoodoo.option.baseUrl:'/')+"ip.php",'',gotIP,null);
	}
}
function gotIP(reply) {
		jsonip.removeScriptTag();
	myIP=reply;
	getMyLocation();
}
function gotLocation(reply) {
	summary='';
	myLocation=new Array();
	if (reply["query"]["count"]==1) {
		place=reply["query"]["results"]["place"];
		myLocation.push(new Array());
		myLocation[0]["name"]=place["name"];
		if (place["admin1"])  myLocation[0][place["admin1"]["type"]]=place["admin1"]["content"];
		if (place["admin2"])  myLocation[0][place["admin2"]["type"]]=place["admin2"]["content"];
		if (place["admin3"])  myLocation[0][place["admin3"]["type"]]=place["admin3"]["content"];
		if (place["country"])  {
			myLocation[0]["Country"]=place["country"]["content"];
			myLocation[0]["CountryCode"]=place["country"]["code"];
		}
		if (place["locality1"])  myLocation[0][place["locality1"]["type"]]=place["locality1"]["content"];
		if (place["locality2"])  myLocation[0][place["locality2"]["type"]]=place["locality2"]["content"];
		if (place["centroid"])  myLocation[0]["latitude"]=place["centroid"]["latitude"];
		if (place["centroid"])  myLocation[0]["longitude"]=place["centroid"]["longitude"];
	}else{
		if (reply["query"]["count"]>1) {
			if (place=reply["query"]["results"]["place"]) {
				for(r=0;r<place.length;r++) {
					myLocation.push(new Array());
					myLocation[r]["name"]=place[r]["name"];
					if (place[r]["admin1"])  myLocation[r][place[r]["admin1"]["type"]]=place[r]["admin1"]["content"];
					if (place[r]["admin2"])  myLocation[r][place[r]["admin2"]["type"]]=place[r]["admin2"]["content"];
					if (place[r]["admin3"])  myLocation[r][place[r]["admin3"]["type"]]=place[r]["admin3"]["content"];
					if (place[r]["country"])  {
						myLocation[r]["Country"]=place[r]["country"]["content"];
						myLocation[r]["CountryCode"]=place[r]["country"]["code"];
					}
					if (place[r]["locality1"])  myLocation[r][place[r]["locality1"]["type"]]=place[r]["locality1"]["content"];
					if (place[r]["locality2"])  myLocation[r][place[r]["locality2"]["type"]]=place[r]["locality2"]["content"];
					if (place[r]["centroid"])  myLocation[r]["latitude"]=place[r]["centroid"]["latitude"];
					if (place[r]["centroid"])  myLocation[r]["longitude"]=place[r]["centroid"]["longitude"];
					//summary+=drilldown("",myLocation[r]);
				}
			}
		}
	}
	if (locationHandler) locationHandler(myLocation);
	//objid("searchsuggestions").innerHTML=summary;
}
function drilldown(prefix,obj) {
	op="";
	for(keys in obj) {
		if (typeof(obj[keys])=="string") {
			op+="<div>"+prefix+keys+" = "+obj[keys]+"</div>";
		}else{
			op+=drilldown(prefix+"&nbsp;",obj[keys]);
		}
	}
	return op;
}
function getMyLocation() {
	if (myIP!==null) {
		var key=ipkey;
		url='http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20geo.places%20where%20woeid%20in%20(select%20place.woeid%20from%20flickr.places%20where%20(lat%2Clon)%20in(select%20Latitude%2CLongitude%20from%20ip.location%20where%20ip%3D%22'+myIP+'%22%20and%20key%3D%22'+key+'%22))&format=json&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=gotLocation';
		jsonobj=new JSONscriptRequest(url);
		jsonobj.buildScriptTag();
		jsonobj.addScriptTag();
	}
}
function searchLocation(srcObj) {
	locationHandler=searchsuggestions;
	url='http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20geo.places%20where%20text%3D%22'+escape(srcObj.value)+'%22&format=json&callback=gotLocation';
	jsonobj=new JSONscriptRequest(url);
	jsonobj.buildScriptTag();
	jsonobj.addScriptTag();
}
function insertTitle() {
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
}
function toggleExpansion(id) {
	if ($('#'+id).css('display')=='none') {
		$('#'+id).slideDown();
	}else{
		$('#'+id).slideUp();
	}
	if(arguments.length>1 && typeof(arguments[1])=='string') {
		$('#'+id).siblings(arguments[1]).slideUp();
	}
}
dooit.temporaries('checkNumericOnly',
'checkAlphaNumericOnly',
'checkEnterEsc',
'removeTheNode',
'pasteRawHTML',
'loadjscssfile',
'get_radio_value',
'set_radio_value',
'eventLocation',
'getTopLeft',
'getFlashMovie',
'embedGraph',
'embedPreview',
'placeBusinessNames',
'placeUserNames',
'buildSelector',
'radioCheckSelection',
'selectorData',
'buildSelector2',
'selectOption',
'objid',
'setCheckBoxes',
'addGraph',
'addPage',
'addPageText',
'addCSS',
'printThePreview',
'loadPreviewGraph',
'arrayToString',
'sumArray',
'flashCSS',
'myIP',
'myLocation',
'locationHandler',
'jsonip',
'getMyIp',
'gotIP',
'gotLocation',
'drilldown',
'getMyLocation',
'searchLocation',
'insertTitle');
