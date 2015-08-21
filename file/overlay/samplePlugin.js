var samplePlugin={
	name:'sample',
	plugin:null,
	init:function() {
		var me=this
		yoodoo.plugins.whenReady(function() {
			me.define();
		});
	},
	define:function() {
		this.plugin=yoodoo.plugins.register(this.name);
		var me=this
		for (var k in yoodoo.events.objects) {
			var eventName=k.toString();
			this.plugin.addHandler(eventName,function(event,params) {
				me.called(event,params);
			});
		}
	},
	called:function(e,args) {
			console.log(e,args);
	}
};
samplePlugin.init();