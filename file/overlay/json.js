if (typeof(dooit)!="undefined") dooit.temporaries('json');
var json={
	build:function(o) {

		if (o===null || typeof(o)=="undefined") {
			return 'null';
		}else if (typeof(o)=="string") {
			return '"'+this.encode(o)+'"';
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
					col.push('"'+k+'":'+this.build(o[k]));
				}
			}else{
				for(var k in o) {
					col.push(this.build(o[k]));
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
	},
	encode:function(ip) {
		ip=ip.replace(/[\u2018\u2019]/g,"&sq;");
		ip=ip.replace(/[\u201C\u201D]/g,"&dq;");
		ip=ip.replace(/[\u2014]/g,"-");
		ip=ip.replace(/'/g,'&sq;');
		ip=ip.replace(/"/g,'&dq;');
		ip=ip.replace(/\n/g,'&nl;');
		ip=ip.replace(/\r/g,'');
		return ip;
	},
	decode:function(ip) {
		var notJustString=false;
		if (arguments.length>1) notJustString=true;
		if (typeof(ip)=="string") {
			ip=ip.replace(/&sq;/g,"'");
			ip=ip.replace(/&apos;/g,"'");
			if (notJustString) {
				ip=ip.replace(/&dq;/g,'"');
			}else{
				ip=ip.replace(/&dq;/g,'\\"');
			}
			ip=ip.replace(/&nl;/g,"\n");
			return ip;
		}else if (typeof(ip)=="object"){
			for(var i in ip) {
				ip[i]=this.decode(ip[i],true);
			}
		}
		return ip;
	}
}
