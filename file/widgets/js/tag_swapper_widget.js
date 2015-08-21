/* sample layout
{
	dependencies:[
		['widgets/js/tag_swapper_widget.js',false],
		['widgets/css/tag_swapper_widget.css',false]
	],
	continueControl:false,
	ready:function(src) {
		src.object=new tag_swapper_widget(src);
	},
	key:'',
	options:{

	}
}
*/


function tag_swapper_widget(src) {
	this.widget=src;
	this.container=null;
	this.allow_continue=true;
	this.selectCourses=null;
	this.widget.autoReady=false;
	this.globalKey=null;
	this.key=null;
	this.cache={};
	this.courses=[
	];
	this.coursesAvailable=[];
	this.courseIndex=null;
	var me=this;
	this.widget.setSize({aspect:2,complete:function(widget) {
		widget.readied=true;
		me.render();
		widget.readyCallback();
	}});
	this.widget.priority=90;
	this.build=function() {
		for(var k in this.widget.data.globals) {
			if (this.globalKey===null) this.globalKey=k;
		}
		if (this.globalKey===null) return false;
		for(var k in this.widget.data.fields) {
			if (this.key===null) this.key=k;
		}
		this.courses=this.widget.data.globals[this.globalKey][1].main;
		this.cache=this.widget.data.fields[this.key][1];
		if (this.cache=='') this.cache={};
		$(this.widget.display).empty();
		this.widget.preventing_continue=function(){
			return !this.object.allow_continue;
		};
		$(this.widget.container).addClass("tag_swapper_widget_parent");
	};
	this.courseText=function() {
		this.current=[];
		this.coursesAvailable=[];
		for(var c=0;c<this.courses.courses.length;c++) {
			var available=false;
			for(var t=0;t<this.courses.courses[c].requiredTags.length;t++) {
				if ((yoodoo.hasTag(this.courses.courses[c].requiredTags[t].tag))) available=true;
			}
			if (available) {
				var selected=true;
				for(var t=0;t<this.courses.courses[c].selectedTags.length;t++) {
					if (this.courses.courses[c].selectedTags[t].tagNot===true) {
						if (yoodoo.hasTag(this.courses.courses[c].selectedTags[t].tag)) selected=false;
					}else{
						if (!(yoodoo.hasTag(this.courses.courses[c].selectedTags[t].tag))) selected=false;
					}
				}
				if (selected) {
					this.courses.courses[c].on=true;
					this.courseIndex=this.coursesAvailable.length;
					this.current.push(this.courses.courses[c].title);
				}else{
					this.courses.courses[c].on=false;
				}
				this.coursesAvailable.push(this.courses.courses[c]);
			}
		}

		var currentList='No course selected';
		if (this.current.length>0) {
			currentList=this.current.join('<br />');
			currentList='Selected course'+((this.current.length==1)?'':'s')+':<br /><b>'+currentList+'</b>';
		}
		$(this.currentCourses).html(currentList);
	};
	this.fillSelectBox=function() {
		var selectable=false;
		$(this.selectBox).empty();
		var o=yoodoo.e("option");
		o.value='-1';
		o.text='Choose another course';
		$(this.selectBox).append(o);
		var v=0;
		for(var c=0;c<this.coursesAvailable.length;c++) {
			if (this.coursesAvailable[c].on!==true) {
				selectable=true;
				var o=yoodoo.e("option");
				o.value=c.toString();
				o.text=this.coursesAvailable[c].title;
				if (c==this.courseIndex) o.selected=true;
				$(this.selectBox).append(o);
			}
		}
		return selectable;
	};
	this.salesJuiceBespoke=function() {
		var sjId=null;
		var sjIndex=null;
		var namesToId={};
		var namesToIndex={};
		for(var c=0;c<this.coursesAvailable.length;c++) {
			namesToId[this.coursesAvailable[c].title]=this.coursesAvailable[c].id;
			namesToIndex[this.coursesAvailable[c].title]=c;
			if (this.coursesAvailable[c].title=='Sales Juice') {
				sjId=this.coursesAvailable[c].id;
				sjIndex=c;
			}
		}
		var inSalesJuice=false;
		if (yoodoo.hasTag("kill_sj_widget")) return false;
		//if (this.cache['not:SalesJuice']!==undefined) return false;
		//if (this.cache['SalesJuice']!==undefined) return false;
		if (sjId!==null) {



			var ignoreTags={};
			for(var t=0;t<this.courses.ignoreTags.length;t++) {
				ignoreTags[this.courses.ignoreTags[t].tag]=true;
			}
			for(var c=0;c<this.coursesAvailable.length;c++) {
				for(var t=0;t<this.coursesAvailable[c].requiredTags.length;t++) {
					ignoreTags[this.coursesAvailable[c].requiredTags[t].tag]=true;
				}
				for(var t=0;t<this.coursesAvailable[c].selectedTags.length;t++) {
					ignoreTags[this.coursesAvailable[c].selectedTags[t].tag]=true;
				}
			}


			var other=[];
			for(var s=0;s<this.current.length;s++) {
				if (this.current[s]=='Sales Juice') {
					inSalesJuice=true;
				}else{
					other.push(this.current[s]);
				}
			}


	//console.log(sjId,inSalesJuice,this.current.length,other);



			if (inSalesJuice && other.length==1) {
	// add not sj tags to other cache
				if (this.cache['not:SalesJuice'] instanceof Array) {
					if (this.cache[namesToId[other[0]]]===undefined) this.cache[namesToId[other[0]]]=[];
					for(var t=0;t<this.cache['not:SalesJuice'].length;t++) {
						if (ignoreTags[this.cache['not:SalesJuice'][t]]!==true) {
							this.cache[namesToId[other[0]]].push(this.cache['not:SalesJuice'][t]);
							dooit.removeTag(this.cache['not:SalesJuice'][t]);
						}
					}
				}
				for(var t=0;t<this.coursesAvailable[namesToIndex[other[0]]].selectedTags.length;t++) {
					if (this.isIgnoreTag(this.coursesAvailable[namesToIndex[other[0]]].selectedTags[t].tag)!==true) {
						if (this.coursesAvailable[namesToIndex[other[0]]].selectedTags[t].tagNot!==true) {
							dooit.removeTag(this.coursesAvailable[namesToIndex[other[0]]].selectedTags[t].tag);
						}
					}
				}
				if (this.cache['SalesJuice']!==undefined) this.cache['SalesJuice']=undefined;
				if (this.cache['not:SalesJuice']!==undefined) this.cache['not:SalesJuice']=undefined;
	// remove other
			}else if (inSalesJuice && this.current.length==1){
//console.log(ignoreTags);
				if (this.cache['SalesJuice'] instanceof Array) {
					if (this.cache[sjId]===undefined) this.cache[sjId]=[];
					for(var t=0;t<this.cache['SalesJuice'].length;t++) {
						if (ignoreTags[this.cache['SalesJuice'][t]]!==true) {
							this.cache[sjId].push(this.cache['SalesJuice'][t]);
							dooit.removeTag(this.cache['SalesJuice'][t]);
						}
					}
				}
				for(var t=0;t<this.coursesAvailable[sjIndex].selectedTags.length;t++) {
					if (this.coursesAvailable[sjIndex].selectedTags[t].tagNot!==true) {
						if (ignoreTags[this.coursesAvailable[sjIndex].selectedTags[t].tag]!==true) 
							dooit.removeTag(this.coursesAvailable[sjIndex].selectedTags[t].tag);
					}
				}
				if (this.cache['not:SalesJuice'] instanceof Array) {
					for(var t=0;t<this.cache['not:SalesJuice'].length;t++) {
						if (ignoreTags[this.cache['not:SalesJuice'][t]]!==true) {
							dooit.addTag(this.cache['not:SalesJuice'][t]);
						}
					}
				}
				if (this.cache['SalesJuice']!==undefined) this.cache['SalesJuice']=undefined;
				if (this.cache['not:SalesJuice']!==undefined) this.cache['not:SalesJuice']=undefined;
	// add not sj tags to all other cache

	//console.log(sjId,inSalesJuice);
			}else if (inSalesJuice===false) {
	// add sj tags to sj cache
				if (this.cache['SalesJuice'] instanceof Array) {
					if (this.cache[sjId]===undefined) this.cache[sjId]=[];
					for(var t=0;t<this.cache['SalesJuice'].length;t++) {
						if (ignoreTags[this.cache['SalesJuice'][t]]!==true) {
							this.cache[sjId].push(this.cache['SalesJuice'][t]);
							//dooit.removeTag(this.cache['SalesJuice'][t]);
						}
					}
				}
				if (this.cache['SalesJuice']!==undefined) this.cache['SalesJuice']=undefined;
				if (this.cache['not:SalesJuice']!==undefined) this.cache['not:SalesJuice']=undefined;
			}
			dooit.addTag("kill_sj_widget");
			var widget=this;
			yoodoo.updateFields([[this.widget.data.fields[this.key][0],dooit.json(this.cache)]],function (reply) {widget.answerUpdateReply(reply);});
		}
	};
	this.render=function() {

		if (this.container!==null) $(this.container).remove();
		var b=yoodoo.e("div");
		this.currentCourses=yoodoo.e("a");
		this.currentCourses.href='javascript:void(0)';
		$(b).css({display:"none"}).addClass("tag_swapper_widget").empty().append(this.currentCourses);
		this.courseText();
		this.salesJuiceBespoke();
		if (this.current.length!=this.coursesAvailable.length) {
			var selectable=false
			this.selectBox=yoodoo.e("select");
			selectable=this.fillSelectBox();
			if (selectable) {
				if (this.selectCourses===null) this.selectCourses=yoodoo.e("div");
				var me=this;
				yoodoo.bubble(me.currentCourses,'click to Change Course');
				$(this.currentCourses).click(function() {
					$(me.selectCourses).slideDown();
					$(me.widget.display).addClass("selecting");
				});
				$(this.selectCourses).hide().append($(this.selectBox).bind("change",function() {
					var optTags=[];
					if (this.value>=0) {
						var ignoreTags={};
						for(var t=0;t<me.courses.ignoreTags.length;t++) {
							ignoreTags[me.courses.ignoreTags[t].tag]=true;
						}
						var saveCourse={};
						//saveCourse[me.coursesAvailable[this.value].id]=true;

						for(var t=0;t<me.coursesAvailable[this.value].selectedTags.length;t++) {
							ignoreTags[me.coursesAvailable[this.value].selectedTags[t].tag]=true;
							if (me.isIgnoreTag(me.coursesAvailable[this.value].selectedTags[t].tag)!==true) {
								if (me.coursesAvailable[this.value].selectedTags[t].tagNot===true) {
									dooit.removeTag(me.coursesAvailable[this.value].selectedTags[t].tag);
								}else{
									dooit.addTag(me.coursesAvailable[this.value].selectedTags[t].tag);
								}
							}
						}
						for(var c=0;c<me.coursesAvailable.length;c++) {
							if (c!=this.value) {
								if (c==me.courseIndex) saveCourse[me.coursesAvailable[c].id]=true;
								for(var t=0;t<me.coursesAvailable[c].selectedTags.length;t++) {
									ignoreTags[me.coursesAvailable[c].selectedTags[t].tag]=true;
									if (me.isIgnoreTag(me.coursesAvailable[c].selectedTags[t].tag)!==true) {
										if (me.coursesAvailable[c].selectedTags[t].tagNot!==true) {
											dooit.removeTag(me.coursesAvailable[c].selectedTags[t].tag);
										}
									}
								}
							}
						}
						for(var t=0;t<yoodoo.bookcase.tags.length;t++) {
							if (ignoreTags[yoodoo.bookcase.tags[t].name]!==true) optTags.push(yoodoo.bookcase.tags[t].name);
						}
						for(var id in saveCourse) {
							me.cache[id]=optTags;
							for(var t in optTags) dooit.removeTag(optTags[t]);
						}
						if (me.cache[me.coursesAvailable[this.value].id] instanceof Array) {
							for(var t=0;t<me.cache[me.coursesAvailable[this.value].id].length;t++) {
								dooit.addTag(me.cache[me.coursesAvailable[this.value].id][t]);
							}
						}
//console.log(ignoreTags,me.cache);
//console.log([me.widget.data.fields[me.key][0],dooit.json(me.cache)]);
						var widget=me;
						$(me.widget.display).addClass("processing");
						$(me.selectCourses).slideUp();
						var updater=yoodoo.e("div");
						$(me.container).append($(updater).hide().addClass("updater").html('Adding '+me.coursesAvailable[this.value].title));
						$(updater).slideDown();
						yoodoo.updateFields([[me.widget.data.fields[me.key][0],dooit.json(me.cache)]],function (reply) {widget.answerUpdateReply(reply);});
					}
				}));
				$(b).append(this.selectCourses);
			}
		}


		$(this.widget.display).append(b);
		this.container=b;
		b.widget=this;
		$(b).fadeIn(500,function() {

		});
	};
	this.isIgnoreTag=function(tag) {
		for(var t=0;t<this.courses.ignoreTags.length;t++) {
			if (this.courses.ignoreTags[t].tag==tag) return true;
		}
		return false;
	};
	this.answerUpdateReply=function(reply) {
		$(this.widget.display).removeClass("selecting");
		this.courseText();
		this.fillSelectBox();
		var sel = this.selectCourses;
		$(this.container).find('.updater').stop().slideUp(200,function() {
			$(this).remove();
		});
		$(this.widget.display).removeClass("processing");
	};
	this.build();
}
