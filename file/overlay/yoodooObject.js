yoodoo.object={
	objects:{},
	objectNames:{},
	loadCache:[],
	requests:{},
	temporaryIds:{},
	views:{},
	availableviews:null,
	parameterType:null, // assigned on load
	clear:function() {
		this.objects={};
		this.objectNames={};
		this.loadCache=[];
		this.requests={};
		this.temporaryIds={};
		this.views={};
		this.availableviews=null;
		this.parameterType=null;
	},
	load:function(id,success,failure,getAllRecords) {
		var req=new this.request(id,success,failure,getAllRecords);
		yoodoo.sendPost(null,req.params);
		return req;
	},
	getTemporaryId:function() {
		var code=this.makeCode();
		while(this.temporaryIds[code]!==undefined) code=this.makeCode();
		return code;
	},
	makeCode:function(length) {
		if (!(length>0)) length=5;
		var chars='abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
		var str='';
		while(str.length<length) str+=chars.substr(Math.floor(Math.random()*chars.length),1);
		return str;
	},
	request:function(id,success,failure,getAllRecords) {
		this.successCallback=(typeof(success)=="function")?success:function(){};
		this.failureCallback=(typeof(failure)=="function")?failure:function(){};
		this.status='pending';
		this.response=null;
		this.names=[];
		this.ids=[];
		if (id instanceof Array) {
			this.requested=id;
			for(var i in id) {
				if (isNaN(id[i])) {
					this.names.push(id[i]);
				}else{
					this.ids.push(id[i]);
				}
			}
		}else if (isNaN(id)) {
			this.requested=[id];
			this.names.push(id);
		}else{
			this.requested=[id];
			this.ids.push(id);
		}
		var excludes=[];
		for(var id in this.objects) excludes.push(id);
		this.index=yoodoo.object.loadCache.length;
		yoodoo.object.loadCache.push(this);
		this.params={
			cmd:'objects',
			cmdaction:'load',
			objectNames:this.names,
			objectIds:this.ids,
			context:this,
			callback:'yoodoo.object.loadCache['+this.index+'].loaded',
			excludeIds:[]
		};
		if (getAllRecords===true) {
			this.params.getAllRecords=1;
		}else{
			for(var id in yoodoo.object.objects) this.params.excludeIds.push(id);
		}
		if (yoodoo.object.parameterType===null) this.params.getTypes=1;
		this.loaded=function(reply) {
			var obj=null;
			try{
				obj=$.parseJSON(reply);
				if (obj.types!==null && obj.types!==undefined) {
					yoodoo.object.parameterType={};
					for(var id in obj.types) {
						yoodoo.object.parameterType[id]=new yoodoo.object.parameterTypeObject(obj.types[id]);
					}
				}
				if (obj.load instanceof Array && obj.load.length>0) {
					for(var i in obj.load) {
						obj.load[i]=new yoodoo.object.object(obj.load[i],this);
					}
					var requested=[];
					for(var i in this.requested) {
						if (isNaN(this.requested[i])) {
							requested.push(yoodoo.object.objectNames[this.requested[i]]);
						}else{
							requested.push(yoodoo.object.objects[this.requested[i]]);
						}
					}
					//for(var i in this.names) requested.push(yoodoo.object.objectNames[this.names[i]]);
					//for(var i in this.ids) requested.push(yoodoo.object.objects[this.ids[i]]);
					this.response=obj;
					this.status='Success';
					this.successCallback(requested);
				}else{
					this.failureCallback(this);
				}
			}catch(e) {
				yoodoo.jsError(e);
				this.status=reply;
				this.failureCallback(this);
			}
		};
	},
	viewrequest:function(id,managerTypeId,success,failure) {
		this.successCallback=(typeof(success)=="function")?success:function(){};
		this.failureCallback=(typeof(failure)=="function")?failure:function(){};
		this.status='pending';
		this.response=null;
		if (id===null) {
			this.id='all';
		}else{
			this.id=id;
			this.managerTypeId=managerTypeId;
		}
		this.index=yoodoo.object.loadCache.length;
		yoodoo.object.loadCache.push(this);
		this.params={
			cmd:'objects',
			cmdaction:'view',
			viewId:this.id,
			context:this,
			callback:'yoodoo.object.loadCache['+this.index+'].loaded'
		};
		if (this.managerTypeId!==undefined) this.params.managerTypeId=this.managerTypeId;
		this.loaded=function(reply) {
			var obj=null;
			//try{
				obj=$.parseJSON(reply);
				if (obj.view!==undefined) {
					if (obj.view.views!==undefined) {
						yoodoo.object.availableviews={};
						for(var v in obj.view.views) {
							yoodoo.object.availableviews[obj.view.views[v].Id]=obj.view.views[v];
						}
						this.response=obj;
						this.status='Success';
						this.successCallback(yoodoo.object.availableviews);
					}else{
						if (yoodoo.object.views[this.id]===undefined) yoodoo.object.views[this.id]={};
						yoodoo.object.views[this.id][this.managerTypeId]=new yoodoo.object.view(obj.view,this.managerTypeId);
						this.response=obj;
						this.status='Success';
						this.successCallback(yoodoo.object.views[this.id][this.managerTypeId]);
					}
				}else{
					this.status=reply;
					this.failureCallback(this);
				}
			/*}catch(e) {
				console.log(e);
				this.status=reply;
				this.failureCallback(this);
			}*/
		};
	},
	getView:function(id,managerTypeId,success,failure) {
		if (!(managerTypeId>0)) managerTypeId=0;
		//if (this.views[id]!==undefined && this.views[id][managerTypeId]!==undefined) {
		//	success(this.views[id][managerTypeId]);
		//}else{
			var req=new this.viewrequest(id,managerTypeId,success,failure);
			yoodoo.sendPost(null,req.params);
			return req;
		//}
	},
	getViews:function(success,failure) {
		if (this.availableviews!==null) {
			success(this.availableviews);
		}else{
			var req=new this.viewrequest(null,null,success,failure);
			yoodoo.sendPost(null,req.params);
			return req;
		}
	},
	get:function(id,success,failure,getAllRecords) {
		if (!(id instanceof Array)) id=[id];
		var got=[];
		var need=[];
		for(var i in id) {
			if (isNaN(id[i])) {
				if (this.objectNames[id[i]]!==undefined) id[i]=this.objectNames[id[i]].schema.Id;
			}
			if (!isNaN(id[i]) && this.objects[id[i]]!==undefined) {
				if (getAllRecords===true && this.objects[id[i]].records.length==0) {
					need.push(this.objects[id[i]]);
				}else{
					got.push(this.objects[id[i]]);
				}
			}else{
				need.push(this.objects[id[i]]);
			}
		}
		var reply={
			objects:[]
		};
		if (got.length>0) reply.objects=got;
		if (need.length>0) {
			reply.request=this.load(id,function(received) {
				var list=[];
				for(var i in id) {
					if (isNaN(id[i])) {
						list.push(yoodoo.object.objectNames[id[i]]);
					}else{
						list.push(yoodoo.object.objects[id[i]]);
					}
				}
				//while(reply.objects.length) received.push(reply.objects.pop());
				success(list);
			},failure,getAllRecords);
		}else{
			success(got);
		}
	},
	parameterTypeObject:function(obj) {
		for(var k in obj) this[k]=obj[k];
		this.operators={
			'integer':['equals','lessthan','greaterthan','lessthanequalto','greaterthanequalto'],
			'decimal':['equals','lessthan','greaterthan','lessthanequalto','greaterthanequalto'],
			'boolean':['equals'],
			'date':['equals','sameday','sameweek','samemonth','sameyear','before','after'],
			'text':['contains','equals']
		};
		this.getOperators=function() {
			if (this.operators[this.ParameterTableColumn]===undefined) return false;
			return this.operators[this.ParameterTableColumn];
		};
		this.defaultOperator=function() {
			if (this.operators[this.ParameterTableColumn]===undefined) return false;
			return this.operators[this.ParameterTableColumn][0];
		};
	},
	object:function(obj) {
		this.schema={};
		for(var k in obj) {
			if (k!='records') {
				this.schema[k]=obj[k];
			}
		}
		this.perPage=10;
		this.records=[]; // as list
		this.recordsListed={}; // by id
		this.recordsCache={}; // by id
		this.fetchedRecords=false;
		this.filter={};
		this.parameters={};
		this.displayParameter=null;
		this.temporaryDisplayName={};
		this.callback=function(reply) {};
		for(var k in this.schema.parameters) {
			var param=new yoodoo.object.parameter(this.schema.parameters[k],this);
			this.parameters[param.Key]=param;
			if (param.DisplayParameter===true) this.displayParameter=param.Key;
		}
		yoodoo.object.objectNames[this.schema.Name]=this;
		yoodoo.object.objects[this.schema.Id]=this;
		this.searchBox=function(callback,opts) {
			for(var p in this.parameters) {
				if (this.parameters[p].Key===this.displayParameter) return this.parameters[p].searchInput(callback,opts);
			}
			return false;
		};
		this.clearSearchCache=function() {
			if (this.parameters[this.displayParameter]!==undefined) this.parameters[this.displayParameter].searchCache={};
		};
		this.clearFilter=function(callback) {
			for(var k in this.filter) this.filter[k]=null;
			if (this.fetchedRecords && typeof(callback)!=="undefined") {
				this.refresh(callback);
			}
		};
		this.filterBy=function(k,v,callback) {
			if (this.filter[k]!==undefined) this.filter[k]=v;
			if (typeof(callback)=="function") this.refresh(callback);
		};
		this.refresh=function(callback) {
			this.fetchedRecords=false;
			this.get((this.records.length<this.perPage)?this.perPage:this.records.length);
			this.records=[];
		};
		this.request=function(object,success,failure,length,filter) {
			this.id=yoodoo.object.getTemporaryId();
			this.successCallback=(typeof(success)=="function")?success:function(){};
			this.failureCallback=(typeof(failure)=="function")?failure:function(){};
			this.filter=(filter!==null && typeof(filter)=="object")?filter:{};
			if (isNaN(length)) length=0;
			this.length=length;
			this.object=object;
			this.params={
				cmd:'objects',
				cmdaction:'records',
				filter:{},
				length:length,
				objectId:this.object.schema.Id,
				callback:'yoodoo.object.requests["'+this.id+'"].loaded',
				context:this
			};
			for(var k in this.filter) {
				if (this.filter[k]!==null) this.params.filter[k]=this.filter[k];
			}
			//if (recordIds instanceof Array && recordIds.length>0) params.filter={recordIds:recordIds};
			//params.callback='yoodoo.object.requests['+this.id+'].loaded';

			yoodoo.object.requests[this.id]=this;
			this.loaded=function(reply) {
				var obj=null;
				try{
					obj=$.parseJSON(reply);
				}catch(e) {
					yoodoo.jsError(e);
					this.status=reply;
				}
				if (obj.records instanceof Array) {
					this.successCallback(obj.records);
				}else{
					this.failureCallback(this);
				}
				//yoodoo.object.requests[this.id]=undefined;
			};
			yoodoo.sendPost(null,this.params);
		};
		this.get=function(success,failure,length,filter,recordIds) {
			if (length===null && this.records.length>0 && !(recordIds instanceof Array && recordIds.length>0)) {
				success(this.records);
				return false;
			}else if (length===null) {
				length=0;
			}
			success=(typeof(success)=="function")?success:function(){};
			failure=(typeof(failure)=="function")?failure:function(){};
			if (filter===undefined || filter===null) filter=this.filter;
			var me=this;
			var callback=function(reply) {
				success(me.loaded(reply));
			};
			if (recordIds instanceof Array && recordIds.length>0) {
				var foundById=[];
				for(var r=recordIds.length-1;r>=0;r--) {
					if (this.recordsCache[recordIds[r]]!==undefined) {
						foundById.push(this.recordsCache[recordIds[r]]);
						recordIds.splice(r,1);
					}
				}
				if (recordIds.length==0) {
					var list={};
					for(var i in foundById) list[foundById[i].Id]=foundById[i];
					success(list);
					return false;
				}else{
					callback=function(reply) {
						var list={};
						for(var i in foundById) list[foundById[i].Id]=foundById[i];
						var received=me.loadByIds(reply);
						for(var i in received) list[received[i].Id]=received[i];
						success(list);
						//console.log(me);
					};
					filter.recordIds=recordIds;
				}
			}
			var request=new this.request(this,callback,function(reply) {
				failure(reply);
			},length,filter);
		};
		this.purgeChanges=function() {
			var i=0;
			for(var r in this.records) i+=this.records[r].purgeChanges();
			return i;
		};
		this.getChangedRecords=function() {
			var records=[];
			for(var r in this.records) {
				var changed=this.records[r].changed();
				if (changed===true) {
					records.push(this.records[r]);
				}else if (changed instanceof Array) {
					records=$.merge(records,changed);
				}
				//if (this.records[r].readonly===false && this.records[r].changed()) records.push(this.records[r]);
			}
			return records;
		};
		this.saveChanges=function(success,failure) {
			var records=this.getChangedRecords();
			if (records.length==0) {
				success();
			}else{
				for(var i=records.length-1;i>=0;i--) {
					var found=false;
					var ii=0
					for(ii=0;(ii<i && found===false);ii++) {
						if (records[i]===records[ii]) found=true;
					}
					if (found) records.splice(i,1);
				}
				var me=this;
				var postSave=function() {
					me.saveChanges(success,failure);
				};
				yoodoo.object.save(records,postSave,failure);
			}
		};
		this.loadByIds=function(obj) {
			return this.loaded(obj,true);
		};
		this.loaded=function(records,doNotList) {
			if (records instanceof Array) {
				for(var i in records) {
					if (records[i].Id>0 && this.recordsCache[records[i].Id]!==undefined) {
						records[i]=this.recordsCache[records[i].Id].update(records[i]);
						//records[i]=this.recordsCache[records[i].Id].update(this.recordsCache[records[i]]);
					}else{
						records[i]=new yoodoo.object.record(records[i],this);
					}
					if (doNotList!==true && this.recordsListed[records[i].Id]===undefined) {
						this.records.push(records[i]);
						this.recordsListed[records[i].Id]=records[i];
					}
				}
				return records;
			}else{
				return this;
			}
		};
		this.input=function(record) {
			var div=$(yoodoo.e("div"));
			for(var p in this.parameters) {
				div.append(this.parameters[p].input(record));
			}
			return div;
		};
		this.add=function(values) {
			if (this.schema.canAdd!==true) return null;
			var newRec=new yoodoo.object.record({ObjectId:this.schema.Id},this);
			if (typeof(values)!==undefined) {
				for(var k in values) {
					if (this.parameters[k]!==undefined) newRec.value[k]=values[k];
				}
			}
			this.records.push(newRec);
			return newRec;
		};
		this.selector=function(definition,record,callback) {
			var id=(record.value[definition.Key]>0)?record.value[definition.Key]:null;
			var me=this;
			//console.log(this);
			//callback($(yoodoo.e("select")));
			//return;
			if (this.recordsCache[id]!==undefined) {
				callback(this.selectbox(definition,record));
			}else{
				this.get(function() {
					//console.log(me.recordsCache);
					if (id>0 && me.recordsCache[id]===undefined) {
						callback($(yoodoo.e("div")).html("Broken record"));
					}else{
						callback(me.selectbox(definition,record));
					}
				},function(reply) {
					console.log("Failed:",reply);
				},0);
			}
		};
		this.selectbox=function(definition,record) {
			var id=(record.value[definition.Key]>0)?record.value[definition.Key]:null;
			var sel=new yoodoo.ui.selectbox({
				onchange:function() {
					record.value[definition.Key]=parseInt(this.value);
				},label:(definition.label!==undefined)?definition.label:this.schema.Name
			});
			for(var r in this.records) {
				sel.add({
					label:this.records[r].toString(),
					value:this.records[r].Id
				});
			}
			return sel.render(id);
		};
		this.parameterselector=function(value,callback,onchange,type) {
			var sel=new yoodoo.ui.selectbox({
				onchange:onchange,
				label:this.schema.Name
			});
			for(var p in this.parameters) {
				if (type===undefined || type==this.parameters[p].type.Name) {
					sel.add({
						label:this.parameters[p].words.en,
						value:p
					});
				}
			}
			return sel.render(value);
		};
		this.findByDisplayName=function(name) {
			for (var id in this.recordsCache) {
				if (this.recordsCache[id].displayName()==name) return this.recordsCache[id];
			}
			/*for(var r=0;r<this.records.length;r++) {
				if (this.records[r].displayName()==str) return this.records[r];
			}*/
			return false;
		};
		this.getParameterByName=function(str) {
			for(var k in this.parameters) {
				if (this.parameters[k].words.en==str) return k;
			}
			return false;
		};
		this.parameterNames=function() {
			var op={};
			for(var k in this.parameters) {
				op[this.parameters[k].words.en]=k;
			}
			return op;
		};
		this.getParameterReferingToObjectId=function(objectId) {
			for(var k in this.parameters) {
				if (this.parameters[k].ReferenceParameter==objectId) return k;
			}
			return false;
		};
		this.getRecordByDisplayName=function(name) {
			var gotit=this.findByDisplayName(name);
			if (gotit!==false) return gotit;
			if (this.temporaryDisplayName[name]!==undefined) return this.temporaryDisplayName[name];
			this.temporaryDisplayName[name]=this.add();
			this.temporaryDisplayName[name].value[this.displayParameter]=name;
			return this.temporaryDisplayName[name];
		};
		if (obj['records'] instanceof Array) {
			this.loaded(obj['records']);
		}
	},
	parameter:function(obj,source) {
		this.searchCache={};
		for(var k in obj) this[k]=obj[k];
		this.object=source;
		this.type=yoodoo.object.parameterType[this.ObjectParameterTypeId];
		if (this.type.ParameterColumnName!="data") this.object.filter[this.Key]=null;
		this.defaultValue=function() {
			if (this.type.ParameterColumnName!="data") return {};
			return null;
		};
		this.input=function(record) {
			return yoodoo.object.input.input(this,record);
		};
		this.getShortlist=function(words,callback,operator) {
			var str=words.term;
			var me=this;
			if (this.searchCache[operator]===undefined) this.searchCache[operator]={};
			if (this.searchCache[operator][str]!==undefined) {
				callback(me.cleanSearchResult(str,this.searchCache[operator][str]));
			}else{
				var opts={};
				opts[this.Key]=[str,operator];
				this.object.get(function(reply) {
					if (me.searchCache[operator]===undefined) me.searchCache[operator]={};
					me.searchCache[operator][str]=reply;
					callback(me.cleanSearchResult(str,reply));
				},function() {},10,opts);
			}
		};
		this.cleanSearchResult=function(str,list) {
			var op=[];
			var thesplit=str.split(/ /);
			var parts=[];
			for(var p in thesplit) {
				if (thesplit[p]!="") parts.push(new RegExp(thesplit[p],'ig'));
			}
			for(var l in list) {
				var label=list[l].toString();
				for(var p in parts) {
					label=label.replace(parts[p],function(txt,index) {
						return '<b>'+txt+'</b>';
					});
				}
				op.push({
					unescapetext:label,
					label:list[l].toString(),
					value:list[l].toString(),
					id:list[l].Id,
					record:list[l]
				});
			}
			return op;
		};
		this.searchInput=function(selectCallback,opts) {
			var me=this;
			if (opts===undefined) opts={};
			if (opts.operator===undefined) opts.operator=this.type.defaultOperator();
			var operator=opts.operator;
			if (opts.renderItem===undefined) opts.renderItem=function(item) {
				return item.unescapetext;
			};
			var ip= $(yoodoo.e("input")).attr("type","search");
			if (ip.get(0).type!="search") $(ip).attr("type","text");
			ip.autocomplete({
				source:function(request,response) {
					me.getShortlist(request,response,operator);
				},
				select:function(e,ui) {
					selectCallback(ui.item);
				}
			}).data("ui-autocomplete")._renderItem=function(ul,item) {
				return $(yoodoo.e("li")).data( "ui-autocomplete-item", item ).append(
					$(yoodoo.e("a")).html(opts.renderItem(item))
				).appendTo(ul);
			};
			if (opts.onchange!==undefined) ip.bind("keyup",opts.onchange);
			return ip;
		};
	},
	record:function(obj,source) {
		this.form=null;
		this.object=source;
		this.deleted=false;
		this.Id=null;
		this.temporaryId=null;
		this.ObjectId=null;
		this.owner=null;
		this.readonly=false;
		this.displayContainer=null;
		this.cache=null;
		this.value={};;
		this.tagIds=null;
		this.tagCache=null;
		this.nameToKey={};
		this.mustUpdate=false;
		this.created=new Date();
		this.updated=new Date();
		for(var p in this.object.parameters) {
			this.nameToKey[this.object.parameters[p].words.en]=this.object.parameters[p].Key;
		}
		this.update=function(obj) {
			this.mustUpdate=false;
			if (this.cache!==null) this.object.clearSearchCache();
			for(var k in obj) {
				if (this[k]!==undefined) this[k]=obj[k];
			}
			if (obj.updated!==undefined) {
				try{
					this.updated=yoodoo.readDate(obj.updated);
					this.updated.setMilliseconds(this.updated.getMilliseconds()+yoodoo.serverTimeOffset);
				}catch(e) {}
			}
			if (obj.created!==undefined) {
				try{
					this.created=yoodoo.readDate(obj.created);
					this.created.setMilliseconds(this.created.getMilliseconds()+yoodoo.serverTimeOffset);
				}catch(e) {}
			}
			this.cache=JSON.stringify(this.value);
			this.tagCache=JSON.stringify(this.tagIds);
			if (this.Id>0) {
				this.object.recordsCache[this.Id]=this;
				if (this.temporaryId!==null) {
					yoodoo.object.temporaryIds[this.temporaryId]=undefined;
					this.temporaryId=null;
				}
			}else if (this.temporaryId===null) {
				this.temporaryId=yoodoo.object.getTemporaryId();
				yoodoo.object.temporaryIds[this.temporaryId]=this;
			}
			//this.object.clearSearchCache();
			//console.log("Updated",this);
			return this;
		};
		this.tagSelector=function() {
			//console.log(this);
			var d=$(yoodoo.e("div")).addClass("TagSelector");
			var names=[];
			for(var id in this.object.schema.tags) names.push([this.object.schema.tags[id],id]);
			if (names.length==0) return null;
			//var selIds={};
			//for(var tid in this.tagIds) selIds[tid]=true;
			//console.log(names,this.tagIds);
			names.sort(function(a,b) {
				var nomA=a[0].toLowerCase();
				var nomB=b[0].toLowerCase();
				if (nomA<nomB) return -1;
				if (nomA>nomB) return 1;
				return 0;
			});
			if (names.length==0) return null;
			var me=this;
			for(var n in names) {
				(function() {
					var id=names[n][1];
					var but=$(yoodoo.e('button')).attr("type","button").html(names[n][0].replace(/_/g,' ')).click(function() {
							//console.log(id);
						if ($(this).hasClass("on")) {
							$(this).removeClass("on");
							if (me.tagIds[id]!==undefined) me.tagIds[id].remove=true;
						}else{
							$(this).addClass("on");
							if (me.tagIds[id]!==undefined) {
								delete me.tagIds[id].remove;
							}else{
								me.tagIds[id]=[$(this).html(),id];
							}
						}
						console.log(me);
					});
					if (me.tagIds!==null && me.tagIds[names[n][1]]!==undefined && me.tagIds[names[n][1]].remove!==false) but.addClass("on");
					d.append(but);
				})();
			}
			return d;
		};
		this.toString=function() {
			return this.value[this.object.displayParameter];
		};
		this.update(obj);
		this.changed=function() {
			if (this.readonly) return false;
			if (this.deleted===true) return true;
			var refs=this.getUnsavedReferences();
			if (refs.length>0) return refs;
			if (this.mustUpdate===true) return true;
			return (this.cache!=JSON.stringify(this.value)) || (this.tagCache!=JSON.stringify(this.tagIds));
		};
		this.getUnsavedReferences=function() {
			var refs=[];
			for(var k in this.object.parameters) {
				if (this.object.parameters[k].ReferenceParameter>0) {
					if (this.value[k]!==undefined) {
						//console.log(this.value[k]);
						var obj=yoodoo.object.objects[this.object.parameters[k].ReferenceParameter];
						if (typeof(this.value[k])=='object' && this.value[k]!==null && this.value[k].Id>0) {
							// linked and saved record
							var refrefs=this.value[k].getUnsavedReferences();
							if (refrefs.length>0) {
								refs=$.merge(refs,refrefs);
							}else{
								this.value[k]=this.value[k].Id;
							}
						}else if (typeof(this.value[k])=='object' && this.value[k]!==null && this.value[k].Id===null) {
							// linked and unsaved record
							var refrefs=this.value[k].getUnsavedReferences();
							if (refrefs.length==0) {
								refs.push(this.value[k]);
							}else{
								refs=$.merge(refs,refrefs);
							}
						//}else if (typeof(this.value[k])=='object' && this.value[k]!==null) {
						}else if (typeof(this.value[k])=='string' && isNaN(this.value[k])) {
							// referenced by a new display name
							this.value[k]=obj.getRecordByDisplayName(this.value[k]);
							/*var nr=obj.add();
							nr.setValue(obj.displayParameter,val);
							this.value[k]=nr;
							console.log(nr);*/
							if (this.value[k]!==null) {
								var refrefs=this.value[k].getUnsavedReferences();
								if (refrefs.length==0) {
									refs.push(this.value[k]);
								}else{
									refs=$.merge(refs,refrefs);
								}
							}
							//if (this.value[k].Id>0) this.value[k]=this.value[k].Id;
						}
					}
				}
			}
			return refs;
		};
		this.purgeChanges=function() {
			if (this.changed()) {
				this.value=$.parseJSON(this.cache);
				this.tagIds=$.parseJSON(this.tagCache);
				return 1;
			}
			return 0;
		};
		this.setValue=function(key,value) {
			if (this.object.parameters[key]!==undefined) {
				if (this.value[key]===undefined) this.value[key]=this.object.parameters[key].defaultValue();
				if (this.object.schema.LanguageRecords && this.object.parameters[key].type.Name=='text') {
					this.value[key][yoodoo.words.language]=value;
				}else{
					this.value[key]=value;
				}
			}
		};
		this.getValue=function(name) {
			if (this.nameToKey[name]!==undefined) {
				return this.value[this.nameToKey[name]];
			}
			return undefined;
		};
		this.output=function() {
			this.UpdatedAt=yoodoo.formatDate('Y-m-d H:i:s',new Date());
			try{
				var json=JSON.stringify(this.value);
			}catch(e) {
				yoodoo.jsError(e);
				//console.log(e.message,this,this.value);
			}
			var tids={};
			for(var tid in this.tagIds) {
				tids[tid]=(this.tagIds[tid].remove!==true);
			}
			var op={
				Id:this.Id,
				ObjectId:this.ObjectId,
				UpdatedAt:this.UpdatedAt,
				value:json,
				tagIds:JSON.stringify(tids)
			};
			if (this.deleted) {
				op.deleted=true;
				this.remove();
			}
			if (this.temporaryId!==null) op['temporaryId']=this.temporaryId;
			return op;
		};
		this.save=function(success,failure) {
			yoodoo.object.save([this],success,failure);
		};
		this.getForm=function() {
			if (this.readonly) return $(yoodoo.e("em")).html("You do not have write access");
			if (this.form===null) this.form=yoodoo.object.makeForm(this);
			return this.form;
		};
		this.displayName=function() {
			if (this.value[this.object.displayParameter]!==undefined) return this.value[this.object.displayParameter];
			return "<em>Untitled</em>";
		};
		this.getDisplay=function(opts) {
			if (this.displayOptions===undefined) this.displayOptions={};
			if (opts!==undefined) this.displayOptions=opts;
			opts=this.displayOptions;
			if (opts.parameters===undefined) opts.parameters=[this.object.displayParameter];
			if (opts.edit===undefined) opts.edit=true;
			if (opts.labels===undefined) opts.labels=true;
			if (this.readonly) opts.edit=false;
			if (this.displayContainer===null) this.displayContainer=$(yoodoo.e("div")).addClass('object_'+this.object.schema.Name.replace(/[^a-z^0-9]/ig,'_')+'_record');
			if (this.recordDisplay===undefined) this.recordDisplay=$(yoodoo.e("div")).addClass("recordDisplay");
			if (this.editDisplay===undefined) this.editDisplay=$(yoodoo.e("div")).addClass("recordedit");
			this.drawDisplay();
			return this.displayContainer.empty().append(this.recordDisplay).append(this.editDisplay);
		};
		this.drawDisplay=function() {
			var opts=this.displayOptions;
			this.recordDisplay.empty();
			for(var p in this.object.parameters) {
				(function() {
					var val=(this.value[this.object.parameters[p].Key]===undefined)?'<em>Empty</em>':this.value[this.object.parameters[p].Key];
					if (this.object.parameters[p].type.ParameterTableColumn!="data") {
						if (this.object.parameters[p].ReferenceParameter>0) {
							if (!(val>0)) {
								val='<em>Empty</em>';
							}else{

								var refContainer=$(yoodoo.e("span")).addClass("dataLoading").html("Loading&hellip;");

								this.recordDisplay.append(
									$(yoodoo.e("div")).addClass('parameter_'+this.object.parameters[p].words[yoodoo.words.language].replace(/[^a-z^0-9]/ig,'_')).addClass('parameter_type_'+this.object.parameters[p].type.Name.replace(/[^a-z^0-9]/ig,'_')).append(
										opts.labels?$(yoodoo.e("label")).html(this.object.parameters[p].words[yoodoo.words.language]):null
									).append(refContainer)
								);

								yoodoo.object.get(this.object.parameters[p].ReferenceParameter,function(obj) {
									if (obj.objects instanceof Array && obj.objects.length>0) {
									//console.log(refContainer.get(0),val);
										var refContainer2=refContainer;
										var val2=val;
										obj.objects.shift().get(function(records) {
									//console.log(records,refContainer2.get(0),val2);
											if (records[val2]!==undefined) {
												refContainer2.empty().removeClass("dataLoading").html(records[val2].displayName());
											}else{
												refContainer2.empty().removeClass("dataLoading").html('<em>Failed to load</em>');
											}
										},function() {
											refContainer2.empty().removeClass("dataLoading").html('<em>Failed to load</em>');
										},1,null,[val]);
									}
								});
							}
						}else{
							if (val=='') val='<em>Empty</em>';
							this.recordDisplay.append(
								$(yoodoo.e("div")).addClass('parameter_'+this.object.parameters[p].words[yoodoo.words.language].replace(/[^a-z^0-9]/ig,'_')).addClass('parameter_type_'+this.object.parameters[p].type.Name.replace(/[^a-z^0-9]/ig,'_')).append(
									opts.labels?$(yoodoo.e("label")).html(this.object.parameters[p].words[yoodoo.words.language]):null
								).append($(yoodoo.e("span")).html(val))
							);
						}
					}
				}).apply(this,[]);
			}

			var me=this;
			if (opts.edit===true) this.recordDisplay.append(
				$(yoodoo.e("button")).attr("type","button").html("edit").addClass("editButton").click(function() {
					me.editDisplay.empty().hide().append(me.getForm()).prepend(
						$(yoodoo.e("button")).attr("type","button").html("close").click(function() {
							me.drawDisplay();
							me.editDisplay.slideUp(500);
							me.recordDisplay.slideDown(500,function() {
							});
						})
					).slideDown(500);
					me.recordDisplay.slideUp(500,function() {
						yoodoo.ui.update();
					});
				})
			);
		};
		this.revert=function() {
			if (this.changed()) {
				this.value=$.parseJSON(this.cache);
				this.drawDisplay();
			}
		};
		this.parameters=function() {
			var op=[];
			for(var p in this.object.parameters) {
				op.push({
					parameter:this.object.parameters[p],
					value:this.value[this.object.parameters[p].Key]
				});
			}
			return op;
		};
		this.erase=function() {
			if (this.Id>0) {
				this.deleted=true;
			}else{
				this.remove();
			}
		};
		this.remove=function() {
			for(var r in this.object.records) {
				if (this.object.records[r]===this) this.object.records.splice(r,1);
			}
			if (this.object.recordsCache[this.Id]!==undefined) delete this.object.recordsCache[this.Id];
			if (this.recordDisplay!==undefined) this.recordDisplay.remove();
		};
		this.input=function(keys) {
			if (keys===undefined) {
				keys=[];
				for(var p in this.object.parameters) keys.push(p);
			}else if (typeof(keys)=="string") {
				keys=[keys];
			}
			var div=$(yoodoo.e("div"));
			for(var i in keys) {
				div.append(this.object.parameters[keys[i]].input(this));
			}
			return div;
		};
	},
	purgeChanges:function() {
		for(var o in this.objects) this.objects[o].purgeChanges();
	},
	saveChanges:function(success,failure) {
//console.log('saveChanges');
		if (success===undefined) success=function(){};
		if (failure===undefined) failure=function(){};
		var records=[];
		for(var o in this.objects) {
			records=$.merge(records,this.objects[o].getChangedRecords());
		}
//console.log(records);
		if (records.length==0) {
			for(var o in this.objects) {
				for(var r in this.objects[o].records) {
					if (this.objects[o].records[r].deleted===true) this.objects[o].records[r].remove();
				}
				this.objects[o].temporaryDisplayName={};
			}
			success();
		}else{
			for(var i=records.length-1;i>=0;i--) {
				var found=false;
				var ii=0
				for(ii=0;(ii<i && found===false);ii++) {
					if (records[i]===records[ii]) found=true;
				}
				if (found) records.splice(i,1);
			}
			var me=this;
			var postSave=function() {
				me.saveChanges(success,failure);
			};
			yoodoo.object.save(records,postSave,failure);
		}
		
		
		
		
		/*var records=[];
		for(var o in this.objects) {
			records=$.merge(records,this.objects[o].getChangedRecords());
		}
		if (records.length==0) return false;
		yoodoo.object.save(records,success,failure);
		return true;*/
	},
	savingBuffer:[],
	savePending:false,
	save:function(records,callback) {
		this.savingBuffer.push(new this.saveRequest(records,callback));
		if (this.savePending===false) this.doSave();
	},
	doSave:function() {
		if (this.savingBuffer.length==0) return this.savePending=false;
		if (this.savePending===false) this.savingBuffer[0].send();
	},
	bufferReceivedResponse:function(reply) {
		yoodoo.object.savingBuffer[0].saved(reply);
	},
	saveRequest:function(records,success,failure) {
		this.records=records;
		this.successCallback=(typeof(success)=="function")?success:function(){};
		this.failureCallback=(typeof(failure)=="function")?failure:function(){};
		this.send=function() {
			var params={
				cmd:'objects',
				cmdaction:'save',
				context:this,
				records:[],
				callback:'yoodoo.object.bufferReceivedResponse'
			};
			for(var r in this.records) params.records.push(this.records[r].output());
			yoodoo.sendPost(null,params);
		};
		this.saved=function(reply) {
			var success=false;
			try{
				var obj=$.parseJSON(reply);
				if (this.records.length==obj.save.saved.length) {
					for(var r in obj.save.saved) {
						if (obj.save.saved[r]!==null) this.records[r].update(obj.save.saved[r]);
					}
				}
				if ( obj.save.deleted instanceof Array) {
					for(var r in obj.save.deleted) {
						if (yoodoo.object.objects[obj.save.deleted[r].object]!==undefined) {
							if (yoodoo.object.objects[obj.save.deleted[r].object].recordsCache[obj.save.deleted[r].record]!==undefined) {
								var deleted=yoodoo.object.objects[obj.save.deleted[r].object].recordsCache[obj.save.deleted[r].record];
								deleted.Id=null;
								deleted.remove();
							}
						}
					}
				}
				 success=true;
				//this.successCallback(this.records);
			}catch(e) {
				yoodoo.jsError(e);
				//this.failureCallback(this.records);
			}
			yoodoo.object.savingBuffer.shift();
			yoodoo.object.savePending=false;
			yoodoo.object.doSave();
			if (success) {
				this.successCallback(this.records);
			}else{
				this.failureCallback(this.records);
			}
		};
	},
	makeForm:function(record) {
		return record.object.input(record).addClass("object_form").addClass("object_form_"+record.object.schema.Name.replace(/[^a-z^0-9]+/ig,'_'));
	},
	input:{
		input:function(definition,record,object) {
			if (record.object!==undefined) object=record.object;
			var value=(record instanceof yoodoo.object.record)?record.value:record;
			var useLanguages=object.schema.LanguageRecords===true;
			var ip=null;
			var label=(definition.words===undefined)?definition.title:definition.words;
			 var itemKey=(definition.Key===undefined)?definition.key:definition.Key;
			var options={
				label:(label[yoodoo.words.language]===undefined)?label:label[yoodoo.words.language],
				onchange:function() {
					if (useLanguages) {
						if (value[itemKey]===null || typeof(value[itemKey])!="object") value[this.itemKey]={};
						value[itemKey][yoodoo.words.language]=value;
					}else{
						value[itemKey]=this.value;
					}
				}
			};
			var type=(typeof(definition.type)=="string")?definition.type:definition.type.ParameterTableColumn;
			if (typeof(definition.type)=="object" && definition.type.Name=='reference') type='reference';
				switch(type) {
					case "reference":
						var refContainer=$(yoodoo.e("div")).addClass("dataLoading").html("Loading&hellip;");
						yoodoo.object.get(definition.ReferenceParameter,function(objects) {
							if (objects instanceof Array && objects.length>0) {
								var o=objects.shift();
								//console.log(o);
								o.selector(definition,record,function(element) {refContainer.empty().removeClass("dataLoading").append(element);});
							}
						});
						return refContainer;
						break;
					case "data":
						return yoodoo.object.input.complexEditor(definition,record,object);
					break;
					case "list":
						var list=new yoodoo.object.input.list(definition,record,object);
						return list.render();
					break;
					case "text":
						ip=new yoodoo.ui.text(options);
					break;
					case "textarea":
						options.maxlength=0;
						//options.showRows=5;
						ip=new yoodoo.ui.textarea(options);
					break;
					case "integer":
						options.maxlength=11;
						options.validator=new yoodoo.ui.validators.text.numeric();
						ip=new yoodoo.ui.text(options);
					break;
					case "decimal":
						options.maxlength=11;
						options.validator=new yoodoo.ui.validators.text.decimal();
						ip=new yoodoo.ui.text(options);
					break;
					case "boolean":
						ip=new yoodoo.ui.checkbox(options);
					break;
					case "date":
						options.onchange=function() {
							record[itemKey]=yoodoo.formatDate('Y-m-d H:i:s',this.value);
						};
						ip=new yoodoo.ui.date(options);
					break;
				}
			if (ip!==null) {
				switch(type) {
					case "date":
						return (ip.render(yoodoo.readDate(value[itemKey])));
					break;
					case "text":
						return (ip.render(useLanguages?value[itemKey][yoodoo.words.language]:value[itemKey]));
					break;
					case "textarea":
						return (ip.render(useLanguages?value[itemKey][yoodoo.words.language]:value[itemKey]));
					break;
					default:
						return (ip.render(value[itemKey]));
					break;
				}
			}
			return null;
		},
		list:function(definition,record,object) {
			if (!(record[definition.key] instanceof Array)) record[definition.key]=[];
			this.definition=definition;
			this.record=record;
			//console.log(this.definition);
			var me=this;
			this.addButton=$('<button></button>').attr("type","button").addClass("addButton").click(function() {
				me.add();
			});
			this.container=$('<div></div>').addClass("complexList").append(
				$('<label></label>').html(this.definition.title[yoodoo.words.language])
			).append(this.addButton);
			this.items=[];
			for(var r in this.record[definition.key]) {
				var item=new yoodoo.object.input.listItem(this,this.definition.json_schema,this.record[definition.key][r],object);
				this.items.push(item);
				this.container.append(item.render());
			}
			this.add=function() {
				this.record[this.definition.key].push({});
				var r=this.record[this.definition.key].length-1;
				var item=new yoodoo.object.input.listItem(this,this.definition.json_schema,this.record[this.definition.key][r],object);
				this.items.push(item);
				this.container.append(item.render());
			};
			this.remove=function(item) {
				var i=0;
				while(i<this.items.length && this.items[i]!==item) i++;
				if (this.items[i]===item) {
					this.items.splice(i,1);
					this.record[this.definition.key].splice(i,1);
					item.container.remove();
				}
			};
			this.render=function() {return this.container;};
		},
		listItem:function(list,definition,record,object) {
			this.list=list;
			this.definition=definition;
			this.record=record;
			var me=this;
			this.delButton=$('<button></button>').attr("type","button").addClass("delButton").click(function() {
				me.remove();
			});
			this.container=$('<div></div>').addClass("complexItem").append(this.delButton);
			for(var i in this.definition) {
				this.container.append(yoodoo.object.input.input(this.definition[i],record,object));
			}
			this.remove=function() {
				if (window.confirm('Remove this item from '+this.list.definition.title[yoodoo.words.language]+'?')) this.list.remove(this);
			};
			this.render=function() {return this.container;};
		},
		complexEditor:function(definition,record) {
			//console.log(definition,record);
			if (record.value[definition.Key]===undefined || record.value[definition.Key]===null || typeof(record.value[definition.Key])=="string") record.value[definition.Key]={};
			var container=$('<div></div>').addClass("complexEditor").html('<h3>'+definition.words[yoodoo.words.language]+'&hellip;</h3>');
			for(var i in definition.json_schema) {
				var item=definition.json_schema[i];
				container.append(this.input(item,record.value[definition.Key],record.object));
			}
			return container;
		}
	},
	view:function(obj,viewAs) {
		this.parameters={};
		this.results=[];
		this.columns=[];
		this.header=null;
		this.table=null;
		this.container=null;
		this.viewAs=isNaN(viewAs)?0:viewAs;
		if (obj!==undefined && obj.view!==undefined && obj.view.Id>0) {
			for(var k in obj.view) this.parameters[k]=obj.view[k];
		}
		this.result=function(view,obj) {
			this.columns=[];
			this.view=view;
			this.managerTypeId=null;
			for(var c in obj) {
				if (obj[c].Title=='managerid') {
					if (obj[c].value>0) this.managerTypeId=obj[c].value;
				}else{
					if (obj[c].Title=='managername' && obj[c].id!==undefined) {
						if (obj[c].id>0) this.managerTypeId=obj[c].id;
					}
					this.columns.push(obj[c].value);
					while(this.columns.length>view.columns.length) view.columns.push(null);
					if (view.columns[this.columns.length-1]===null) view.columns[this.columns.length-1]=(obj[c].Title==='managername')?'Manager type':obj[c].Title;
				}
			}
			this.click=function(success,failure) {
				if (this.managerTypeId>0 && this.view.parameters.ClickObjectViewId>0) {
					this.view.click(this.managerTypeId,success,failure);
				}else{
					return false;
				}
			};
		};
		if (obj.results instanceof Array) {
			this.results=[];
			for(var i in obj.results) this.results.push(new this.result(this,obj.results[i]));
		}
		this.clickable=this.parameters.ClickObjectViewId>0;
		this.click=function(asManagerTypeId,success,failure) {
			if (!(asManagerTypeId>0)) return false;
			var me=this;
			yoodoo.object.getView(this.parameters.ClickObjectViewId,asManagerTypeId,function(view) {
				if (typeof(success)=="function") {
					success(view);
				}else{
					var table=view.drawTable(this.header!==null);
					table.insertAfter(me.table);
				}
			},failure);
		};
		this.getHeader=function() {
			if (this.header===null) this.header=$(yoodoo.e("div")).append(
				$(yoodoo.e("h2")).html(this.parameters.Name)
			).append(
				(this.parameters.Description=='')?null:$(yoodoo.e("p")).html(this.parameters.Description)
			);
			return this.header;
		};
		this.drawTable=function(withHeader) {
			if (this.results.length==0) return false;
			if (this.container===null) this.container=$(yoodoo.e("div"));
			if (withHeader===true) this.container.append(this.getHeader());
			if (this.table===null) {
				this.table=$(yoodoo.e("table"));
				this.container.append(this.table);
			}
			this.table.empty();
			var head=$(yoodoo.e("tr"));
			for(var c in this.columns) {
				head.append($(yoodoo.e("th")).html(this.columns[c]));
			}
			this.table.append(head);
			var me=this;
			for(var r in this.results) {
				var row=$(yoodoo.e("tr"));
				for(var c in this.results[r].columns) {
					if (this.columns[c]=="Manager type" && this.results[r].managerTypeId>0 &&
					(this.parameters.ClickObjectViewId!=this.parameters.Id || this.results[r].managerTypeId!=this.viewAs)) {
						(function() {
							var mid=me.results[r].managerTypeId;
							row.append($(yoodoo.e("td")).append(
								$(yoodoo.e("button")).attr("type","button").html(
									me.results[r].columns[c]
								).click(function() {
									me.click(mid);
								})
							));
						}());
					}else{
						row.append($(yoodoo.e("td")).html(this.results[r].columns[c]));
					}
				}
				this.table.append(row);
			}
			return this.container;
		};
	}
};
