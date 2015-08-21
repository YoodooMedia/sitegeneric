function myfirstwidget(src) {
	this.widget=src;
	this.widget.autoReady=false;
	this.widget.setSize({aspect:2,complete:function(widget) {
		widget.readied=true;
		widget.readyCallback();
	}});
	this.widget.priority=Math.random()*100;
	$(this.widget.display).empty();
	this.build=function() {
		try {
			var qd=this.widget.data.fields.Data_7[1].f0HjdrFSzW2WcUq2SlSM[0][0];
			var dif=qd.getTime()-new Date().getTime();
			dif/=(60*60*24*1000);
				var f=document.createElement("div");
				$(f).html('You have '+Math.floor(dif)+' days to give up smoking').css({'text-align':'center'});
				$(this.widget.display).append(f);
		
		}catch(e) {
			for(var k in this.widget.data.fields) {
				var f=document.createElement("div");
				$(f).html(k);
				$(this.widget.display).append(f);
			}
		}
	};
	this.build();
}
