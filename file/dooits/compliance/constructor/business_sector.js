yoodoo.businessSector={
	object:null,
	records:null,
	ready:[],
	started:false,
	selectedBusinessSector:null,
	businessSectorAvailableCount:0,
	businessSectors:{},
	init:function() {
		var me=this;
		this.started=true;
		yoodoo.object.get('KLOE Business sector',function(obj) {
			me.object=obj.shift();
			me.records=me.object.records;
			me.businessSectors={};
			me.businessSectorAvailableCount=0;
			me.check();
		},function(){},true);
	},
	check:function(callback) {
		if (this.object===null) {
			this.ready.push(callback);
			if (this.started===false) this.init();
		}else{
			var previousBusinessSector=this.selectedBusinessSector;
			this.businessSectors={};
			var myTags={};
			for(var t in yoodoo.bookcase.tags) {
				myTags[yoodoo.bookcase.tags[t].id]=yoodoo.bookcase.tags[t].name;
			}
			this.businessSectorAvailableCount=0;
			for(var b in this.records) {
				var bs={on:false};
				for(var tid in this.records[b].tagIds) {
					if (myTags[tid]!==undefined) {
						if (myTags[tid].match(/^User_Type/)) {
							bs.tag=myTags[tid];
							bs.id=tid;
							bs.on=true;
							this.selectedBusinessSector=this.records[b].Id;
						}else if (myTags[tid].match(/^Selectable_Type/)) {
							
						}
					}else{
						bs.tag=tid;
						bs.id=tid;
						
					}
				}
				this.businessSectorAvailableCount++;
				this.businessSectors[this.records[b].displayName()]=bs;
			}
			var me=this;
			var doNext=function() {
				if (typeof(callback)=="function") {
					callback(me.object.recordsCache[me.selectedBusinessSector]);
				}
				for(var r in me.ready) {
					me.ready[r](me.object.recordsCache[me.selectedBusinessSector]);
				}
				me.ready=[];
			};
			//console.log(previousBusinessSector!=this.selectedBusinessSector);
			if (previousBusinessSector!==null && previousBusinessSector!=this.selectedBusinessSector) {
				yoodoo.keyQuestion.clear(doNext);
			}else{
				doNext();
			}
		}
	}
};