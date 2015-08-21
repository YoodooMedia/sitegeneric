currentRequests=new Array();
currentHandlers=new Array();
var asynchLoaded=true;
function sendRequest(docUrl,returnHandler) {
    now=new Date();
    docUrl+="&rand="+now.valueOf();
    if (window.XMLHttpRequest){
        thisRequest=new XMLHttpRequest();
        currentHandlers.push(returnHandler);
        thisRequest.onreadystatechange=requestReceived;
        thisRequest.open("GET",docUrl,true);
        thisRequest.send(null);
        currentRequests.push(thisRequest);
    }else if (window.ActiveXObject){
        thisRequest=new ActiveXObject("Microsoft.XMLHTTP");
        currentRequests.push(thisRequest);
        currentHandlers.push(returnHandler);
        if (thisRequest){
            thisRequest.onreadystatechange=requestReceived;
            thisRequest.open("GET",docUrl,true);
            thisRequest.send();
        }
    }
}
function sendPostRequest(docUrl,parameters,returnHandler,headers) {
    now=new Date();
    docUrl+="?rand="+now.valueOf();
	soap=false;
	if (parameters.match(/<soapenv/)) soap=true;
    if (window.XMLHttpRequest){
        thisRequest=new XMLHttpRequest();
        currentHandlers.push(returnHandler);
        thisRequest.onreadystatechange=requestReceived;
        thisRequest.open("POST",docUrl,true);
		if (headers!==null) {
			for(h=0;h<headers.length;h++) {
				thisRequest.setRequestHeader(headers[h][0],headers[h][1]);
			}
		}else{
			thisRequest.setRequestHeader("Content-Type","application/x-www-form-urlencoded; charset=UTF-8");
		}
        //thisRequest.setRequestHeader("Content-length", parameters.length);
        currentRequests.push(thisRequest);
        thisRequest.send(parameters);
    }else if (window.ActiveXObject){
        thisRequest=new ActiveXObject("Microsoft.XMLHTTP");
        currentRequests.push(thisRequest);
        currentHandlers.push(returnHandler);
        if (thisRequest){
            thisRequest.onreadystatechange=requestReceived;
            thisRequest.open("POST",docUrl,true);
			if (headers!==null) {
				for(h=0;h<headers.length;h++) {
					thisRequest.setRequestHeader(headers[h][0],headers[h][1]);
				}
			}else{
				thisRequest.setRequestHeader("Content-Type","application/x-www-form-urlencoded; charset=UTF-8");
			}
            //thisRequest.setRequestHeader("Content-length", parameters.length);
            thisRequest.send(parameters);
        }
    }
}
function requestReceived() {
    reply="";
    for (requestIndex=currentRequests.length-1;requestIndex>=0;requestIndex--) {
        if (currentRequests[requestIndex].readyState==4) {
            reply=currentRequests[requestIndex].responseText;
			currentRequests[requestIndex].getAllResponseHeaders();
            if (currentRequests[requestIndex].status==200) {
                reply=currentRequests[requestIndex].responseText;
            }else{
			}
			//alert("Staus:"+currentRequests[requestIndex].status+reply);
            currentRequests[requestIndex]=null;
            currentRequests.splice(requestIndex,1);
            thisHandler=currentHandlers[requestIndex];
            currentHandlers.splice(requestIndex,1);
            thisHandler(reply);
		}else{
			//alert("Ready state:"+currentRequests[requestIndex].readyState);
		}
    }
}
expandObj=new Array();
currentExpandWidth=0;
currentExpandHeight=0;
desiredExpandWidth=0;
desiredExpandHeight=0;
expandTimer=null;
expandInterval=2;
expandMaxVelocity=20;
expandMaxProportion=0.1;
expandProportion=3;
collapseObj=new Array();
currentcollapseWidth=0;
currentcollapseHeight=0;
desiredcollapseWidth=0;
desiredcollapseHeight=0;
collapseTimer=null;
collapseInterval=expandInterval;
collapseMaxVelocity=expandMaxVelocity;
collapseProportion=expandProportion;


function toggleExpansion(srcObj, expandTheWidth, expandTheHeight, collapseOthers) {
	src=objid(srcObj);
	
	if (src.style.display=="none") {
		if (objid(srcObj+"Button")){
			bar=objid(srcObj+"Button");
			if (bar.className=="close") bar.className="open";
			nobr=bar.getElementsByTagName("nobr");
			if (nobr.length>0) nobr[0].innerHTML=nobr[0].innerHTML.replace("Show","Hide");
		}
		sizeObject(src,expandTheWidth,expandTheHeight,true);
		if (collapseOthers!="") {
			objs=collapseOthers.split(";");
			for (i=0;i<objs.length;i++) {
				vals=objs[i].split(":");
				if (objid(vals[0])) {
					col=objid(vals[0]);
					if (col.style.display!="none") {
						if (objid(vals[0]+"Button")){
							bar=objid(vals[0]+"Button");
							if (bar.className=="open") bar.className="close";
							nobr=bar.getElementsByTagName("nobr");
							if (nobr.length>0) nobr[0].innerHTML=nobr[0].innerHTML.replace("Hide","Show");
						}
						exw=false;
						exh=false;
						if (vals[1]==1) exw=true;
						if (vals[2]==1) exh=true;
						sizeObject(col, exw, exh,false);
					}
				}
			}
		}
	}else{
		if (objid(srcObj+"Button")){
			bar=objid(srcObj+"Button");
			if (bar.className=="open") bar.className="close";
			nobr=bar.getElementsByTagName("nobr");
			if (nobr.length>0) nobr[0].innerHTML=nobr[0].innerHTML.replace("Hide","Show");
		}
		sizeObject(src,expandTheWidth,expandTheHeight,false);
	}
}

var sizingObject=new Array();
function sizeObject(srcObj,expandWidth,expandHeight,expand) {
	if (expand) {
		if (expandWidth && expandHeight) srcObj.style.position='absolute';
		srcObj.style.visibility='hidden';
		srcObj.style.display='block';
		srcObj.style.overflow='visible';
		//alert("test state");
		srcObj.style.width=srcObj.style.height='';
		w=srcObj.offsetWidth;
		h=srcObj.offsetHeight;
	}else{
		w=srcObj.offsetWidth;
		h=srcObj.offsetHeight;
	}
	cw=dw=w;
	ch=dh=h;
	if (expand) {
		if (expandWidth) {
			cw=1;
		}
		if (expandHeight) {
			ch=1;
		}
		maxexp=Math.sqrt(Math.pow((dh-ch>dw-cw)?(dh-ch)*expandMaxProportion:(dw-cw)*expandMaxProportion,2));
	}else{
		if (expandWidth) {
			dw=0;
		}
		if (expandHeight) {
			dh=0;
		}
		maxexp=Math.sqrt(Math.pow((ch-dh>cw-dw)?(ch-dh)*expandMaxProportion:(cw-dw)*expandMaxProportion,2));
	}
	if (maxexp>expandMaxVelocity) maxexp=expandMaxVelocity;
	if (maxexp<5) maxexp=5;
	srcObj.style.width=cw+"px";
	srcObj.style.height=ch+"px";
	srcObj.style.overflow='hidden';
	srcObj.style.position='';
	srcObj.style.visibility='visible';
	//pasteRawHTML(w+"x"+h+" &amp; "+cw+"x"+ch+" &amp; "+dw+"x"+dh+", ",document.body);
	o={"object":srcObj,"width":expandWidth,"height":expandHeight,"expand":expand,"currentWidth":cw,"currentHeight":ch,"desiredWidth":dw,"desiredHeight":dh,"maxExpand":maxexp};
	sizingObject.push(o);
    if (expandTimer==null) expandTimer = setTimeout("grow()",expandInterval);
}
function grow() {
	for(i=sizingObject.length-1;i>=0;i--) {
		dw=0;
		dh=0;
		if (sizingObject[i]["width"]) dw=(sizingObject[i]["desiredWidth"]-sizingObject[i]["currentWidth"])/expandProportion;
		if (sizingObject[i]["height"]) dh=(sizingObject[i]["desiredHeight"]-sizingObject[i]["currentHeight"])/expandProportion;
		if (dw>sizingObject[i]["maxExpand"]) dw=sizingObject[i]["maxExpand"];
		if (dw<-sizingObject[i]["maxExpand"]) dw=-sizingObject[i]["maxExpand"];
		if (dh>sizingObject[i]["maxExpand"]) dh=sizingObject[i]["maxExpand"];
		if (dh<-sizingObject[i]["maxExpand"]) dh=-sizingObject[i]["maxExpand"];
		sizingObject[i]["currentWidth"]+=dw;
		sizingObject[i]["currentHeight"]+=dh;
		//alert(sizingObject[i]["currentWidth"]+","+sizingObject[i]["currentHeight"]);
		//pasteRawHTML(sizingObject[i]["currentWidth"]+"x"+sizingObject[i]["currentHeight"]+", ",document.body);
		sizingObject[i]["object"].style.width=sizingObject[i]["currentWidth"]+"px";
		sizingObject[i]["object"].style.height=sizingObject[i]["currentHeight"]+"px";
		if (dw<1 && dw>-1 && dh<1 && dh>-1) {
			if (sizingObject[i]["expand"]) {
				sizingObject[i]["object"].style.display="block";
				sizingObject[i]["object"].style.overflow='visible';
				sizingObject[i]["object"].style.width=sizingObject[i]["object"].style.height='';
			}else{
				sizingObject[i]["object"].style.display="none";
			}
			sizingObject.splice(i,1);
		}
	}
	if (sizingObject.length>0) {
		expandTimer = setTimeout("grow()",expandInterval);
	}else{
		expandTimer = null;
	}
}
var scrolling=null;
function scrollToElement(id) {
	var scrollloc=getTop(objid(id));
    if (scrolling==null) scrolling=new Array(scrollloc,setTimeout("smoothScroll()",2));
}
function smoothScroll() {
	maxScroll=20;
	if (scrolling!=null) {
		scrolls=getScrollXY();
		ds=(scrolling[0]-scrolls[1])/3;
		if (ds<-maxScroll) ds=-maxScroll;
		if (ds>maxScroll) ds=maxScroll;
		window.scrollTo(scrolls[0],scrolls[1]+ds);
		if (getScrollXY()[1]==scrolls[1]) ds=0;
		if (ds<-1 || ds>1) {
			scrolling[1]=setTimeout("smoothScroll()",2);
		}else{
			scrolling=null;
		}
	}
}var timer=null;
var currentOpacity=0;
var selectedObj=null;
var cycled=0;
var maxCycle=0;
var currentInterval=0;
var faderSteps=5;
var desiredDarkness=60;
var fadeInOutObj=null;
var fadeInOutOpacity=0;
function drawBlack()
{
    pasteRawHTML("<div id=\"blackBox\" style=\"visibility:visible;position:fixed;z-index:3;padding:0px;margin:0px;top:0px;left:0px;width:100%;height:100%\" >&nbsp;</div>",document.body);
    sizeFader();
}
function sizeFader()
{
    if (objid("blackBox")!=null)
    {
        var docHeight=(typeof document.height != 'undefined')?document.height:(document.compatMode && document.compatMode != 'BackCompat')?document.documentElement.scrollHeight:document.body.scrollHeight;
        var wh=getWindowHeight();
        if (docHeight<wh) docHeight=wh;
        obj=objid("blackBox");
        obj.style.height=docHeight+"px";
    }
    if (objid("dialogBox")!=null) centerObject(objid("dialogBox"));
}
function fader(obj,o) {if (obj.style) {if (o==100) {if (obj.style.MozOpacity!=null){obj.style.MozOpacity = "";}else if (obj.style.opacity!=null){obj.style.opacity = "";}else if (obj.style.filter!=null){obj.style.filter = "";}}else{if (obj.style.MozOpacity!=null){obj.style.MozOpacity = (o/100) - .001;}else if (obj.style.opacity!=null){obj.style.opacity = (o/100) - .001;}else if (obj.style.filter!=null){obj.style.filter = "alpha(opacity="+o+")";}}}}
function fadeUpTimer()
{
    obj=objid("blackBox");
    currentOpacity+=faderSteps;
    if (currentOpacity>desiredDarkness)
    {
        currentOpacity=desiredDarkness;
    }
    fader(obj,currentOpacity);
    if (currentOpacity==desiredDarkness)
    {
        clearTimeout(timer);
    }
    else
    {
        timer = setTimeout("fadeUpTimer()",2);
    }
}
function fadeDownTimer()
{
    obj=objid("blackBox");
    currentOpacity-=faderSteps;
    if (currentOpacity<0)
    {
        currentOpacity=0;
    }
    fader(obj,currentOpacity);
    if (currentOpacity==0)
    {
        clearTimeout(timer);
        removeTheNode("blackBox");
        removeTheNode("dialogBox");
        window.onresize=null;
        window.onscroll=null;
    }
    else
    {
        timer = setTimeout("fadeDownTimer()",2);
    }
}
function startFadeUp()
{
    window.onresize=sizeFader;
    window.onscroll=sizeFader;
    currentOpacity=0;
    if (objid("blackBox")==null)
    {
        drawBlack();
    }
    //sizeFader();
    obj=objid("blackBox");
    fader(obj,0);
    //obj.style.height=document.body.clientHeight+"px";
    obj.style.visibility="visible";
    if (typeof timer != 'undefined') clearTimeout(timer);
    timer = setTimeout("fadeUpTimer()",2);
}
function startFadeDown()
{
    if (objid("blackBox")!=null)
    {
        obj=objid("blackBox");
        if (typeof timer != 'undefined') clearTimeout(timer);
        timer = setTimeout("fadeDownTimer()",2);
    }
}
function flashThisObject(obj,repeats,interval)
{
    selectedObj=obj;
    currentInterval=interval;
    maxCycle=repeats;
    cycled=0;
    selectedObj.style.visibility="hidden";
    //fader(obj,0);
    if (typeof timer != 'undefined') clearTimeout(timer);
    timer = setTimeout("flashUpObject()",interval);
}
function flashUpObject()
{
    selectedObj.style.visibility="visible";
    //fader(selectedObj,100);
    cycled++;
    if (cycled<maxCycle)
    {
        timer = setTimeout("flashDownObject()",currentInterval);
    }
}
function flashDownObject()
{
    selectedObj.style.visibility="hidden";
    timer = setTimeout("flashUpObject()",currentInterval);
}
function getWindowHeight()
{
    var myHeight = ( typeof( window.innerWidth ) == 'number' )?window.innerHeight:( document.documentElement && ( document.documentElement.clientWidth || document.documentElement.clientHeight ) )?document.documentElement.clientHeight:document.body.clientHeight;
    return myHeight;
}
function getWindowWidth()
{
    var myWidth = 0, myHeight = 0;
    if( typeof( window.innerWidth ) == 'number' )
    {
        myWidth = window.innerWidth;
        myHeight = window.innerHeight;
    }
    else if( document.documentElement && ( document.documentElement.clientWidth || document.documentElement.clientHeight ) )
    {
        myWidth = document.documentElement.clientWidth;
        myHeight = document.documentElement.clientHeight;
    }
    else if( document.body && ( document.body.clientWidth || document.body.clientHeight ) )
    {
        myWidth = document.body.clientWidth;
        myHeight = document.body.clientHeight;
    }
    return myWidth;
} 
function startFadeIn(srcObj)
{
    fadeInOutObj=srcObj;
    fadeInOutOpacity=0;
    fader(fadeInOutObj,fadeInOutOpacity);
    fadeInOutObj.style.visibility="visible";
    if (typeof timer != 'undefined') clearTimeout(timer);
    timer = setTimeout("fadeInTimer()",2);
}
function fadeInTimer()
{
    fadeInOutOpacity+=10;
    fader(fadeInOutObj,fadeInOutOpacity);
    if (fadeInOutOpacity==100)
    {
        clearTimeout(timer);
    }
    else
    {
        timer = setTimeout("fadeInTimer()",2);
    }
}
function startFadeOut(srcObj)
{
    if (fadeInOutObj!==srcObj) {
        fadeInOutObj=srcObj;
        fadeInOutOpacity=100;
    }
    fader(fadeInOutObj,fadeInOutOpacity);
    if (typeof timer != 'undefined') clearTimeout(timer);
    timer = setTimeout("fadeOutTimer()",2);
}
function fadeOutTimer()
{
    fadeInOutOpacity-=10;
    fader(fadeInOutObj,fadeInOutOpacity);
    if (fadeInOutOpacity<10)
    {
        clearTimeout(timer);
        removeTheNode(fadeInOutObj.id);
        fadeInOutObj=null;
        fadeInOutOpacity=0;
    }
    else
    {
        timer = setTimeout("fadeOutTimer()",2);
    }
}
var fadein={'obj':null,'min':0,'max':100,'handler':null,'steps':10,'alpha':0,'timer':null};
var fadeobjectinterval=2;
function fadeinobject(obj,minalpha,maxalpha,handler,steps) {
	fadein={'obj':obj,'min':minalpha,'max':maxalpha,'handler':handler,'steps':steps,'alpha':minalpha,'timer':null};
	fader(fadein["obj"],fadein["alpha"]);
    fadein["timer"] = setTimeout("fadeinobjectstep()",fadeobjectinterval);
}
function fadeinobjectstep() {
	if (fadein["obj"]) {
		fadein["alpha"]+=fadein["steps"];
		if (fadein["alpha"]>=fadein["max"]) {
			fadein["alpha"]=fadein["max"];
			clearTimeout(fadein["timer"]);
			fader(fadein["obj"],fadein["alpha"]);
			if (fadein["handler"]!=null) fadein["handler"]();
			fadein["obj"]=null;
			fadein["handler"]=null;
			fadein["timer"]=null;
		}else{
   			fadein["timer"] = setTimeout("fadeinobjectstep()",fadeobjectinterval);
			fader(fadein["obj"],fadein["alpha"]);
		}
	}
}
var fadeout={'obj':null,'min':0,'max':100,'handler':null,'steps':10,'alpha':0,'timer':null};
function fadeoutobject(obj,minalpha,maxalpha,handler,steps) {
	fadeout={'obj':obj,'min':minalpha,'max':maxalpha,'handler':handler,'steps':steps,'alpha':maxalpha,'timer':null};
	fader(fadeout["obj"],fadeout["alpha"]);
    fadeout["timer"] = setTimeout("fadeoutobjectstep()",fadeobjectinterval);
}
function fadeoutobjectstep() {
	if (fadeout["obj"]) {
		fadeout["alpha"]-=fadeout["steps"];
		if (fadeout["alpha"]<=fadeout["min"]) {
			fadeout["alpha"]=fadeout["min"];
			clearTimeout(fadeout["timer"]);
			fader(fadeout["obj"],fadeout["alpha"]);
			if (fadeout["handler"]!=null) fadeout["handler"]();
			fadeout["obj"]=null;
			fadeout["handler"]=null;
			fadeout["timer"]=null;
		}else{
   			fadeout["timer"] = setTimeout("fadeoutobjectstep()",fadeobjectinterval);
			fader(fadeout["obj"],fadeout["alpha"]);
		}
	}
}

function JSONscriptRequest(fullUrl) {
    this.fullUrl = fullUrl; 
    this.noCacheIE = '&noCacheIE=' + (new Date()).getTime();
    this.headLoc = document.getElementsByTagName("head").item(0);
    this.scriptId = 'JscriptId' + JSONscriptRequest.scriptCounter++;
}
JSONscriptRequest.scriptCounter = 1;
JSONscriptRequest.prototype.buildScriptTag = function () {
    this.scriptObj = document.createElement("script");
    this.scriptObj.setAttribute("type", "text/javascript");
    this.scriptObj.setAttribute("charset", "utf-8");
    this.scriptObj.setAttribute("src", this.fullUrl + this.noCacheIE);
    this.scriptObj.setAttribute("id", this.scriptId);
};
JSONscriptRequest.prototype.removeScriptTag = function () {
    this.headLoc.removeChild(this.scriptObj);  
};
JSONscriptRequest.prototype.addScriptTag = function () {
    this.headLoc.appendChild(this.scriptObj);
};