
var updatingObject=null;
var draggingObject=null;
var currentDraggingContainer=null;
var currentDraggingContainerContent=null;
var otherDraggingContainers=new Array();
var dragoffsetx=-8;
var dragoffsety=-12;
//var dragObjSize=new Array();
var dropHandler=null;
var moveHandler=null;
var dragrect=[0,200,0,200];
var isStatic=false;
var objPosition='';
var containerTL=[0,0];

function dragObject(e,dragObj,dropped,moved) {
	if (draggingObject==null) {
		dropHandler=dropped;
		moveHandler=moved;
		draggingObject=dragObj;
		var loc=eventLocation(e);
		//alert(loc.draggingObject(","));
		var tl=gTL(dragObj);
		dragoffsetx=tl[1]-loc[0];
		dragoffsety=tl[0]-loc[1];
		containerTL=gTL(relativeOffset(draggingObject));
		//dh=containerTL[0]-tl[0];
		//alert(containerTL[1]+","+containerTL[0]);
		//tl=[dragObj.offsetLeft,dragObj.offsetTop];
		//alert(tl[1]+"-"+loc[0]+" , "+tl[0]+"-"+loc[1]);
		//dragObj.innerHTML=dragoffsety;
		objPosition=getStyle(dragObj,'position');
		isStatic=(objPosition!=="fixed" && objPosition!=="absolute");
		if (isStatic) dragObj.style.position="absolute";
		if (document.attachEvent) {
			document.attachEvent("onmousemove", moveObject);
			document.attachEvent("onmouseup",   dropObject);
			if (window.event!=null) {
				window.event.cancelBubble = true;
				window.event.returnValue = false;
			}
		}else{
			document.addEventListener("mousemove", moveObject,   true);
			document.addEventListener("mouseup",   dropObject, true);
			if (e!=null) e.preventDefault();
		}
		if (e!=null) moveObject(e);
	}
	return false;
}
function moveObject(e) {
	loc=eventLocation(e);
	//draggingObject.innerHTML=x+","+y;
	x=loc[0]+dragoffsetx;
	y=loc[1]+dragoffsety;
	fixPosition(draggingObject,x,y);
	if (moveHandler!==null) eval(moveHandler+"(draggingObject,x,y);");
}
function fixPosition(obj,l,t) {
	if (getStyle(obj,'position')=="fixed") {
		scrolls=getScrollXY();
		l-=scrolls[0];
		t-=scrolls[1];
	}else{
		l-=containerTL[1];
		t-=containerTL[0];
	}
	//obj.style.position='absolute';
	obj.style.left=l+"px";
	obj.style.top=t+"px";
	//obj.innerHTML=l+","+t;
}
function dropObject(e) {
	loc=eventLocation(e);
	x=loc[0]+dragoffsetx;
	y=loc[1]+dragoffsety;
	if (document.detachEvent) {
    	document.detachEvent("onmousemove", moveObject);
    	document.detachEvent("onmouseup",   dropObject);
	}else{
    	document.removeEventListener("mousemove", moveObject,   true);
    	document.removeEventListener("mouseup",   dropObject, true);
	}
	if (dropHandler!==null) eval(dropHandler+"(draggingObject,x,y);");
	if (isStatic) draggingObject.style.position=objPosition;
	draggingObject=null;
}
function relativeOffset(obj) {
	obj = obj.offsetParent;
	var reply=null;
	while( obj != null ) {
		if (getStyle(obj,"position") == "relative") {
			//obj.style.background='#f00';
			reply=obj;
			obj=null;
		}else{
			obj=obj.offsetParent;
		}
	}
	return reply;
}
function gTL(obj) {
	reply = [0,0];
	while( obj != null ) {
		if (obj.style) {
			if (obj.style.position=="absolute2" || obj.style.position=="relative2") {
				if (obj.style.top) {
					reply[0] += 1*obj.style.top.replace("px","");
				}else{
					reply[0] += obj.offsetTop;
				}
				if (obj.style.left) {
					reply[1] += 1*obj.style.left.replace("px","");
				}else{
					reply[1] += obj.offsetLeft;
				}
				if (obj.offsetParent.style.position=="relative") {
					obj = obj.offsetParent;
				}else{
					obj=null;
				}
			}else{
				reply[0] += obj.offsetTop;
				reply[1] += obj.offsetLeft;
				obj = obj.offsetParent;
			}
		}else{
			reply[0] += obj.offsetTop;
			reply[1] += obj.offsetLeft;
			obj = obj.offsetParent;
		}
	}
	return reply;
}
	
function getElementCentre(obj) {
	tl=gTL(obj);
	l=tl[1];
	t=tl[0];
	l=l+(obj.offsetWidth/2);
	t=t+(obj.offsetHeight/2);
	return [obj,l,t];
}
function eventLocation(e) {
	if (draggingObject) {
		ws=(draggingObject.style.position!="fixed");
	}else{
		ws=true;
	}
	ws=false;
	if (window.event) {
		x = window.event.clientX + (ws?document.documentElement.scrollLeft + document.body.scrollLeft:0);
		y = window.event.clientY + (ws?document.documentElement.scrollTop + document.body.scrollTop:0);
	}else{
		x = e.clientX + (ws?window.scrollX:0);
		y = e.clientY + (ws?window.scrollY:0);
	}
	return [x,y];
}
function getScrollXY() {
    var scrOfX=scrOfY=0;
	if(typeof(window.pageYOffset)=='number'){scrOfY=window.pageYOffset;scrOfX=window.pageXOffset;}else if(document.body&&(document.body.scrollLeft||document.body.scrollTop)){scrOfY=document.body.scrollTop;scrOfX=document.body.scrollLeft;}else if(document.documentElement&&(document.documentElement.scrollLeft||document.documentElement.scrollTop)){scrOfY=document.documentElement.scrollTop;scrOfX=document.documentElement.scrollLeft;}
    return [scrOfX,scrOfY];
}
function getStyle(oElm, strCssRule){
	var strValue = "";
	if(document.defaultView && document.defaultView.getComputedStyle){
		strValue = document.defaultView.getComputedStyle(oElm, "").getPropertyValue(strCssRule);
	}else if(oElm.currentStyle){
		strCssRule = strCssRule.replace(/\-(\w)/g, function (strMatch, p1){
			return p1.toUpperCase();
		});
		strValue = oElm.currentStyle[strCssRule];
	}
	if (strValue=="") strValue=oElm.style[strCssRule];
	return strValue;
}
dooit.temporaries('updatingObject',
'draggingObject',
'currentDraggingContainer',
'currentDraggingContainerContent',
'otherDraggingContainers',
'dragoffsetx',
'dragoffsety',
'dropHandler',
'moveHandler',
'dragrect',
'isStatic',
'objPosition',
'containerTL',
'dragObject',
'moveObject',
'fixPosition',
'dropObject',
'relativeOffset',
'gTL',
'getElementCentre',
'eventLocation',
'getScrollXY',
'getStyle');
