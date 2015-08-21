var ext=['com','co.uk','org.uk','biz','info','eu','net','mobi','org','tel'];
var nameofmybusinessLoaded=true;
function compileChecker() {
	nom=getValue('Name_of_business');
	nom=nom.replace(/[^a-z0-9\-]/gi,'').toLowerCase();
	ins="<div class='mainQuestion'>Domain availability checker</div>Domain to check is <input id='domaintocheck' type='text' value='"+nom+"' class='dooitinput' onkeydown='return checkEnterEsc(this,event,checkDomain,null)' />";
	ins+="&nbsp;<button type='button' class='easilyCheck' onclick='easilyCheckDomain()' ></button>";
	//ins+="<img src='/uploads/image/check.gif' style='cursor:pointer' onclick='easilyCheckDomain()' align='absmiddle' />";
	if(objid('domainChecker')!==null) objid('domainChecker').innerHTML=ins;
	setBusinessSummary();
	return isNotBlank('Name_of_business');
}
function easilyCheckDomain() {
	ip=objid("domaintocheck");
	nom=ip.value.replace(/[^a-z0-9\-]/gi,'').toLowerCase();
	tlds=ext.join(",");
	url='http://www.yoodoo.biz/utilities/easily/domainchecker.php?domain='+nom+'&TLDs='+tlds+'&callback=easilyChecked';
	//url='/domainchecker.php?domain='+nom+'&TLDs='+tlds+'&callback=alert';
	op='';
	//op+="<a href='"+url+"' target='_blank'>"+url+"</a>";
	for(e=0;e<ext.length;e++) {
		op+="<div><img src='"+yoodoo.getFilePath("image",false)+"biz/loading.gif' align='absmiddle' /> "+nom+"."+ext[e]+"</div>";
	}
	
	objid("domainResult").innerHTML=op;
	
	jsonobj=new JSONscriptRequest(url);
	jsonobj.buildScriptTag();
	jsonobj.addScriptTag();
}
function easilyChecked(reply) {
	op='';
	for(keys in reply) {
		exists=(reply[keys]=="201");
		img="<img src='"+yoodoo.getFilePath("image",false)+"biz/"+(exists?"exists":"available")+".gif' align='absmiddle' />&nbsp;"+keys;
		op+="<div>"+img+"</div>";
	}
	objid("domainResult").innerHTML=op;
	ins='<div class="abutton" onclick="gotoEasily()" ><div class="left"></div>Purchase '+nom+' from Easily.co.uk<div class="right"></div></div>';
	objid("easily").innerHTML=ins;
	objid("easily").style.display='block';
}
function checkDomain() {
	ip=objid("domaintocheck");
	nom=ip.value.replace(/[^a-z0-9\-]/gi,'').toLowerCase();
	if (nom.length<3) {
		//invalid domain name
	}else{
		ins="Domain availability results for "+nom+"...";
		for(e=0;e<ext.length;e++) {
			md=ext[e].replace('.','');
			ins+="<div id='ext"+md+"' style='padding:0px 30px'>Checking <b>"+nom+ext[e]+"</b>...</div>";
		}
		objid('domainResult').innerHTML=ins;
		for(e=0;e<ext.length;e++) {
			sendPostRequest('/dns.php','domain='+nom+ext[e],domainChecked,null);
		}
		//objid("easily").innerHTML="<a href='http://easily.co.uk/index.php3?domain="+nom+"' target='easily'>Purchase "+nom+" from Easily.co.uk</a>";
		ins='<div class="abutton" onclick="gotoEasily()" ><div class="left"></div>Purchase '+nom+' from Easily.co.uk<div class="right"></div></div>';
		objid("easily").innerHTML=ins;
		objid("easily").style.display='block';
		//objid("easily").innerHTML="<div onclick='gotoEasily()'>"+nom+"</div>";
	}
}
function domainChecked(reply) {
	exists=false;
	parts=false;
	dom=reply.split(' ');
	ins=dom[0];
	if (reply.match(/not found/)) {
		parts=domainToParts(dom[0]);
	}else if (reply.match(/exists/)) {
		exists=true;
		parts=domainToParts(dom[0]);
	}
	//alert(parts);
	if (parts) {
		objid('ext'+parts[1].replace('.','')).innerHTML="<img src='"+yoodoo.getFilePath("image",false)+"biz/"+(exists?"exists":"available")+".gif' align='absmiddle' />&nbsp;"+(exists?"":"<b>")+ins+(exists?"":"</b>");
	}
}
function domainToParts(dom) {
	p=dom.split('.');
	name=p[0];
	ex=dom.replace(name,'');
	return [name,ex];
}
function setBusinessSummary() {
	setValue('Business_description_summary','Describe what '+getValue('Name_of_business')+' will do');
}
function gotoEasily() {
	ip=objid("domaintocheck");
	nom=ip.value.replace(/[^a-z0-9\-]/gi,'').toLowerCase();
	window.open('http://easily.co.uk/index.php3?r=105126&domain='+nom,'easily','');
}
dooit.temporaries('gotoEasily','setBusinessSummary','domainToParts','domainChecked','checkDomain','easilyChecked','easilyCheckDomain','ext','nameofmybusinessLoaded','compileChecker');
