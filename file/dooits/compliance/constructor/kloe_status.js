yoodoo.kloeStatus={
	object:null,
	records:null,
	ready:[],
	started:false,
	warning:null,
	statuses:{},
	init:function() {
		var me=this;
		this.started=true;
		yoodoo.object.get('KLOE Status',function(obj) {
			me.object=obj.shift();
			me.records=me.object.records;
			me.statuses={};
			for(var r in me.records) {
				me.statuses[me.records[r].Id]=me.records[r];
				if (me.records[r].value.typst==0) me.warning=me.records[r];
			}
			me.processBuffer();
		},function(){},true);
	},
	processBuffer:function() {
		for(var r in this.ready) {
			if (this.ready[r][1]>0) {
				this.ready[r][0](this.statuses[this.ready[r][1]]);
			}else{
				this.ready[r][0]();
			}
		}
		this.ready=[];
	},
	get:function(callback,id) {
		if (this.object===null) {
			this.ready.push([callback,id]);
			if (this.started===false) this.init();
		}else{
			if (typeof(callback)=="function") {
				callback(this.statuses[this.ready[r][1]]);
			}
			this.processBuffer();
		}
	},
	getWarning:function(callback) {
		if (this.warning!==null) {
			callback(this.warning);
		}else{
			var me=this;
			this.ready.push([function() {
				callback(me.warning);
			},0]);
			if (this.started===false) this.init();
		}
	}
};