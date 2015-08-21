yoodoo.groups = {
	containers : {
		container : null
	},
	sortBy : 'score',
	sorting:function(a,b) {
		if (yoodoo.groups.sortFunctions[yoodoo.groups.sortBy]===undefined) {
			return yoodoo.groups.sortFunctions.unspecified(yoodoo.groups.sortBy,a,b);	
		}else{
			return yoodoo.groups.sortFunctions[yoodoo.groups.sortBy](a,b);
		}
	},
	sortFunctions:{
		unspecified:function(key,a,b) {
			if (b[key]==a[key]) {
				if (a.displayName<b.displayName) return -1;
				if (a.displayName>b.displayName) return 1;
				return 0;
			}
			return b[key]-a[key];
		}/*,
		score:function(a,b) {
			return b.score-a.score;
		},
		completed:function(a,b) {
			return b.completed-a.completed;
		}*/
	},
	sortFunctionsNames:{
		score:'Score',
		completed:'Items completed'
	},
	groups : null,
	optional : null,
	callback : function() {
	},
	dispose:function() {
		this.groups=null;
		this.containers={
			container : null
		};
		this.sortBy = 'score';
	},
	get : function() {
		if (arguments.length > 0)
			this.callback = arguments[0];
		if (this.groups !== null)
			return this.callback(this.groups);
		this.load();
	},
	load : function() {
		yoodoo.sendPost(null, {
			cmd : 'mygroups',
			context:this,
			callback : 'yoodoo.groups.received'
		});
	},
	opening : null,
	open : function(group) {
		if (this.opening!==null) {
			this.opening.close(group);
			this.opening=null;
		}else{
			var reloadLimit=1000*60*10; // 10 minutes
			this.opening=group;
			var now=new Date().getTime();
			if (group.fetchedMembers!==null && (now-group.fetchedMembers)<reloadLimit) {
				this.opened();
			}else{
				group.fetchedMembers=now;
				yoodoo.sendPost(null, {
					cmd : 'viewgroup',
					group : group.id,
					context:this,
					callback : 'yoodoo.groups.opened'
				});
			}
		}
	},
	opened : function(reply) {
		$(yoodoo.groups.containers.container).find('.viewing').removeClass("viewing");
		$(yoodoo.groups.opening.container).removeClass("busy").addClass("viewing");
		if (reply!==undefined) {
			reply=$.parseJSON(yoodoo.ajax?reply:Base64.decode(reply));
			yoodoo.groups.otherSortKeys=reply.sortkeys;
		}
		yoodoo.groups.opening.showusers((reply===undefined || reply.users===undefined)?null:reply.users);
	},
	viewClose : function() {
		if (this.opening!==null) this.opening.close();
		this.opening=null;
	},
	joining : null,
	join : function(group) {
		this.joining=group;
		yoodoo.sendPost(null, {
			cmd : 'joingroup',
			group : group.id,
			context:this,
			callback : 'yoodoo.groups.joined'
		});
	},
	joined : function(reply) {
		this.joining.joined(reply=='true');
		if (reply=='true') {
			for (var g = this.optional.length-1; g >= 0; g--) {
				if (this.optional[g]===this.joining) this.optional.splice(g,1);
			}
			this.groups.unshift(this.joining);
			$(this.joining.container).slideUp(300,function() {
				var box=yoodoo.groups.joining.render();
				$(yoodoo.groups.containers.memberList).prepend(box);
				$(box).slideDown(300);
				if (yoodoo.groups.optional.length==0) yoodoo.groups.containers.optional.hide();
			});
		}
	},
	leaving : null,
	leave : function(group) {
		this.leaving=group;
		yoodoo.sendPost(null, {
			cmd : 'leavegroup',
			group : group.id,
			context:this,
			callback : 'yoodoo.groups.leaved'
		});
	},
	leaved : function(reply) {
		
		$(this.containers.container).find('.viewing').removeClass("viewing");
		this.leaving.leaved(reply=='true');
		if (reply=='true') {
			for (var g = this.groups.length-1; g >= 0; g--) {
				if (this.groups[g]===this.leaving) this.groups.splice(g,1);
			}
			
			this.optional.unshift(this.leaving);
			yoodoo.groups.containers.viewer.hide(function() {
				yoodoo.groups.containers.optional.reveal();
			});
			$(this.leaving.container).slideUp(300,function() {
				var box=yoodoo.groups.leaving.render();
				$(yoodoo.groups.containers.optionalList).prepend(box);
				$(box).slideDown(300);
			});
		}
	},
	received : function(args) {
		yoodoo.groups.groups = [];
		yoodoo.groups.optional = [];
		var g = $.parseJSON(yoodoo.ajax?args:Base64.decode(args));
		for (var i = 0; i < g.member.length; i++)
			yoodoo.groups.groups.push(new yoodoo.groups.group(g.member[i], true));
		for (var i = 0; i < g.optional.length; i++)
			yoodoo.groups.optional.push(new yoodoo.groups.group(g.optional[i], false));
		yoodoo.groups.groups.sort(function(a, b) {
			if (a.name < b.name)
				return -1;
			if (a.name > b.name)
				return 1;
			return 0;
		});
		yoodoo.groups.callback(yoodoo.groups.groups);
		yoodoo.groups.callback = function() {
		};
	},
	sortSelector:function(){
		var sel=yoodoo.e("select");
		for(var k in this.sortFunctionsNames) {
			var opt=yoodoo.e("option");
			opt.value=k;
			$(opt).html(yoodoo.w(this.sortFunctionsNames[k]));
			$(sel).append(opt);
			if (k==this.sortBy) opt.selected=true;
		}
		for(var i=0;i<this.otherSortKeys.length;i++) {
			var k=this.otherSortKeys[i];
			var n=k.replace(/_/g,' ').replace(/^\w/,function(txt) {return txt.toUpperCase();});
			var opt=yoodoo.e("option");
			opt.value=k;
			$(opt).html(n);
			$(sel).append(opt);
			if (k==this.sortBy) opt.selected=true;
		}
		
		
		return sel;
	},
	bioDivUpdate : function(reply) {
		var newtxt=yoodoo.ajax?reply:Base64.decode(reply);
		$(this.bioDiv).slideUp(500,function() {
			$(this).html(newtxt).slideDown(500);
		});
	},
	useractivityUpdate : function(reply) {
		var activity=$.parseJSON(yoodoo.ajax?reply:Base64.decode(reply));
		$(this.activityDiv).slideUp(500,function() {
			$(this).empty();
			var graphs=yoodoo.e("div");
			var graphsBox=yoodoo.e("div");
			$(this).append(
				$(graphs).addClass('groupGraphs').append(graphsBox)
			);
			var timespan=yoodoo.groups.renderActivity(graphsBox,activity.activity);
			if (yoodoo.user.staff===true) yoodoo.groups.renderSyllabus(graphsBox,activity.syllabus,timespan);
		yoodoo.initSlider(graphs,graphsBox,{horizontal:true});
			$(this).slideDown(500);
		});
	},
	renderActivity:function(target,arr) {
		var earliest=new Date();
		var latest=new Date(1970,0,1);
		var today=new Date();
		var byKey={};
		var maxs=0;
		for(var i=0;i<arr.length;i++) {
			if (arr[i].date.match(/^new Date/)!==null) arr[i].date=eval(arr[i].date);
			if (arr[i].date<earliest) earliest=arr[i].date;
			if (arr[i].date>latest) latest=arr[i].date;
			if (arr[i].seconds>maxs) maxs=arr[i].seconds;
			var thisday=Math.round(arr[i].date.getTime()/(1000*60*60*24));
			byKey[thisday]=arr[i].seconds;
		}
		var daySpan=1+Math.round((latest.getTime()-earliest.getTime())/(1000*60*60*24));
		var day=new Date(earliest.getFullYear(),earliest.getMonth(),earliest.getDate());
		var graph=yoodoo.e("div");
		var graphMonths=yoodoo.e("div");
		var graphBars=yoodoo.e("div");
		$(target).append(
					$(graphMonths).addClass("groupActivityGraphMonths")
				).append(
			$(graph).css({}).addClass("groupActivityGraph").append(
					$(graphBars).addClass("groupActivityGraphBars")
				)
		);
		
		$(target).parent().parent().css({visibility:'hidden',display:'block'});
		var w=$(target).parent().width();
		$(target).parent().parent().css({visibility:'visible',display:'none'});
		
		var barWidth=Math.floor(w/daySpan);
		if (barWidth>30) barWidth=30;
		if (barWidth<4) barWidth=4;
		$(target).css({width:barWidth*daySpan});
		var inactiveWidth=0;
		var monthWidth=0;
		var monthObject=new Date(day.getFullYear(),day.getMonth(),day.getDate());
		while(day<=latest) {
			if (day.getDate()==1 && monthWidth>0) {
				var month=yoodoo.e("div");
				$(graphMonths).append(
					$(month).css({
						width:monthWidth
					}).html('<div>'+yoodoo.formatDate((monthObject.getMonth()==0)?'M Y':'M',monthObject)+'</div>')
				);
				monthObject=new Date(day.getFullYear(),day.getMonth(),day.getDate());;
				monthWidth=0;
			}
			var thisday=Math.round(day.getTime()/(1000*60*60*24));
			var h=0;
			if (byKey[thisday]!==undefined) h=Math.round(byKey[thisday]*100/maxs);
			if (h>0) {
				if (inactiveWidth>0) {
				var bar=yoodoo.e("div");
					$(graphBars).append(
						$(bar).css({
							height:'100%',
							width:inactiveWidth,
							display:'inline-block'
						})
					);
					inactiveWidth=0;
				}
				var bar=yoodoo.e("div");
				$(graphBars).append(
					$(bar).css({
						height:h+'%',
						width:barWidth,
						background:'#367ca7',
						display:'inline-block'
					})
				);
				if (byKey[thisday]!==undefined) {
					var s=new Date(0,0,0,0,0,byKey[thisday]);
					yoodoo.bubble(bar,yoodoo.formatDate('H:i:s',s)+' '+yoodoo.w("on")+' '+yoodoo.formatDate('jS M',day));
				}
			}else{
				inactiveWidth+=barWidth;
			}
			day.setDate(day.getDate()+1);
			monthWidth+=barWidth;
		}
		if (monthWidth>0) {
			var month=yoodoo.e("div");
			$(graphMonths).append(
				$(month).css({
					width:monthWidth
				}).html('<div>'+yoodoo.formatDate((monthObject.getMonth()==0)?'F Y':'F',monthObject)+'</div>')
			);
			monthWidth=0;
		}
		if (inactiveWidth>0) {
			$(graphBars).append(
				$(bar).css({
					height:'0px',
					width:inactiveWidth,
					display:'inline-block'
				})
			);
			inactiveWidth=0;
		}
		return {earliest:earliest,latest:latest,dayWidth:barWidth};
	},
	renderSyllabus:function(target,arr,timespan) {
		var dayMilliseconds=1000*60*60*24;
		var earliest=timespan.earliest;
		var latest=timespan.latest;
		var dayWidth=timespan.dayWidth;
		var today=new Date();
		var incomplete=false;
		for(var i=0;i<arr.length;i++) {
			if (arr[i].completed_date.match(/^new Date/)!==null) arr[i].completed_date=eval(arr[i].completed_date);
			if (arr[i].start_date.match(/^new Date/)!==null) arr[i].start_date=eval(arr[i].start_date);
			//if (arr[i].start_date<earliest) earliest=arr[i].start_date;
			if (arr[i].completed===true && arr[i].completed_date>latest) latest=arr[i].completed_date;
			if (arr[i].completed===false) incomplete=true;
		}
		var graph=yoodoo.e("div");
		$(target).append(
			$(graph).addClass('groupSyllabusGraph')
		);
		var minx=earliest.getTime();
		var maxx=latest.getTime();
		var xw=maxx-minx;
		for(var i=0;i<arr.length;i++) {
			var bar=yoodoo.e("div");
			var txt='';
			switch(arr[i].content_type) {
				case 'dooit':
					txt+=yoodoo.w("dooit")+'<br />';
				break;
				case 'episode':
					txt+=yoodoo.w("episode")+'<br />';
				break;
				case 'file':
					txt+=yoodoo.w("document")+'<br />';
				break;
			}
			txt+=arr[i].content_name+'<br />'+yoodoo.words.capitalize(yoodoo.w('from'))+': '+yoodoo.formatDate('jS M Y',arr[i].start_date);
			if (arr[i].completed) txt+='<br />'+yoodoo.words.capitalize(yoodoo.w('to'))+': '+yoodoo.formatDate('jS M Y',arr[i].completed_date);
			yoodoo.bubble(bar,txt,{trackMouse:true,fadeOut:false});
			var l=Math.round((arr[i].start_date.getTime()-minx)/dayMilliseconds);
			var r=arr[i].completed?arr[i].completed_date.getTime():maxx;
			r=Math.round((r-minx)/dayMilliseconds);
			if (l<0) l=0;
			var w=r-l+1;
			$(graph).append(
				$(bar).addClass(arr[i].content_type+'_activity').css({
					width:(dayWidth*w)+'px',
					'margin-left':+(dayWidth*l)+'px'
				})
			);
			if (arr[i].completed) $(bar).addClass('activity_complete');
		}
		
	},
	group : function(data, isMember) {
		this.fetchedMembers=null;
		this.isMember = isMember;
		for (var d in data)
		this[d] = data[d];
		this.canLeave = function() {
			return (this.isMember && this.optional === true);
		};
		this.canJoin = function() {
			return (!this.isMember && this.optional === true);
		};
		this.render = function() {
			if (this.container === undefined) this.container = yoodoo.e("div");
			$(this.container).html(this.name);
			var me=this;
			if (this.canLeave()) {
				$(this.container).addClass("canLeave");
				var but=yoodoo.e("button");
				yoodoo.bubble(but,yoodoo.w('leavegroupname',{name:me.name}));
				$(this.container).append($(but).attr("type","button").click(function() {
					if (!$(me.container).hasClass("busy")) {
						//if (window.confirm(yoodoo.w('leavegroupname',{name:me.name})+'?')) {
							me.leave();
						//}
					}
				}));
			}
			if (this.canJoin()) {
				$(this.container).addClass("canJoin");
				var but=yoodoo.e("button");
				yoodoo.bubble(but,yoodoo.w('joingroupname',{name:me.name}));
				$(this.container).append($(but).attr("type","button").click(function() {
					if (!$(me.container).hasClass("busy")) {
						me.join();
					}
				}));
			}
			if (this.isMember) {
				yoodoo.bubble(this.container,yoodoo.w('viewgroupname',{name:me.name}),{onlyTarget:true});
				$(this.container).click(function(e) {
					if (!$(me.container).hasClass("busy") && !$(me.container).hasClass("viewing")) {
						if (this===e.target) {
							me.open();
						}
					}
				});
			}
			return this.container;
		};
		this.open=function() {
			if (this.isMember) {
				$(this.container).addClass("busy");
				yoodoo.groups.open(this);
			}
		};
		this.close=function(group) {
			var nextGroup=group;
			$(this.container).removeClass("busy").removeClass("viewing");
			yoodoo.groups.containers.viewer.hide(function() {
				if (nextGroup!==undefined) yoodoo.groups.open(nextGroup);
			});
		};
		this.leave=function() {
			$(this.container).addClass("busy");
			yoodoo.groups.leave(this);
		};
		this.leaved=function(success) {
			$(this.container).removeClass("busy");
			this.isMember=!success;
			if (this.container.clearBubble!==undefined) this.container.clearBubble();
		};
		this.join=function() {
			$(this.container).addClass("busy");
			yoodoo.groups.join(this);
		};
		this.joined=function(success) {
			$(this.container).removeClass("busy");
			this.isMember=success;
		};
		this.showusers=function(users) {
			if (users!==null) this.users=users;
			var me=this;
			yoodoo.groups.containers.optional.hide(function() {
				$(yoodoo.groups.containers.viewerTitle).find('div').html(me.name);
				me.renderUsers();
				yoodoo.groups.containers.viewer.reveal();
			});
		};
		this.renderUsers=function() {
			$(yoodoo.groups.containers.viewerList).empty();
			
			var sel=yoodoo.groups.sortSelector();
			$(yoodoo.groups.containers.viewerTitle).find('label').html(yoodoo.w('sortby')+":").append(sel);
			$(sel).bind("change",function() {
				yoodoo.groups.sortBy=this.value;
				yoodoo.groups.opening.rearrangeUsers();
			});
			this.users.sort(yoodoo.groups.sorting);
			for(var u=0;u<this.users.length;u++) {
				
				
				var username=((this.users[u].firstname!==null)?this.users[u].firstname:'')+' '+((this.users[u].lastname!==null)?this.users[u].lastname:'');
				if (username==' ') username=((this.users[u].name!==null)?this.users[u].name:'');
				if (username=='') username=this.users[u].username;
				this.users[u].displayName=username;
				var user=yoodoo.e("div");
				var circle=yoodoo.e("div");
				var name=yoodoo.e("div");
				var score=yoodoo.e("div");
				$(user).addClass("groupuser").append(
					$(circle).addClass('groupusercircle').append(yoodoo.e("div"))
				).append(
					$(name).addClass("groupusername").html(username)
				).append(
					$(score).addClass("groupuserscore").html('<span>'+this.users[u][yoodoo.groups.sortBy]+'</span>')
				);
				if (this.users[u].photo!='') $(circle).find('>div').css({'background-image':'url('+yoodoo.replaceDomain(this.users[u].photo)+')'});
				$(yoodoo.groups.containers.viewerList).append(user);
				this.users[u].container=user;
				this.users[u].container.user=this.users[u];
				
				if (this.users[u].awaiting>0) {
					var from={r:243,g:201,b:110};
					var to={r:246,g:71,b:53};
					var p=this.users[u].awaiting/5;
					if (p>1) p=1;
					colour=yoodooStyler.fromTo(from,to,p);
					var awaiting=yoodoo.e("div");
					var span=yoodoo.e("span");
					$(user).append(
						$(awaiting).addClass('groupuserawaiting').append($(span).html(this.users[u].awaiting).css({
							background:yoodooStyler.rgbToHex(colour)
						}))
					);
					yoodoo.bubble(span,yoodoo.w('ndooit'+((this.users[u].awaiting==1)?'':'s')+'awaitingapproval',{n:this.users[u].awaiting}));
					//yoodoo.bubble(span,this.users[u].awaiting+' doo-it'+((this.users[u].awaiting==1)?'':'s')+' awaiting approval');
				}
				
				// user details
				
				$(this.users[u].container).click(function() {
					if (!$(this).hasClass("showingDetails")) {
						var loc=$(this).offset();
						var yoodooLoc=$(yoodoo.container).offset();
						var blockout=yoodoo.e("div");
						$(blockout).addClass("yd_blockout");
						var details=yoodoo.e("div");
						details.source=this;
						blockout.details=details;
						var circle=$(this).find('.groupusercircle');
						details.originalSize={w:circle.width(),h:circle.height(),left:loc.left-yoodooLoc.left-3,top:loc.top-yoodooLoc.top-3};
						$(yoodoo.groups.containers.container).append(
								$(blockout).css({
									width:$(yoodoo.container).width(),
									height:$(yoodoo.container).height()
								})
							).append(
								$(details).addClass('groupuserdetails').css(details.originalSize)
							);
						var margin=50;
						var pos={
							left:margin,
							top:margin,
							width:$(yoodoo.container).width()-(margin*2)-6,
							height:$(yoodoo.container).height()-(margin*2)-6
						};
						$(details).addClass("showingDetails");
						$(details).animate(pos,500,function() {
							var u=this.source.user;
							var fulldetails=yoodoo.e("div");
							var avatar=yoodoo.e("div");
							var name=yoodoo.e("h2");
							$(name).html(u.displayName);
							$(avatar).addClass('groupuseravatar');
							if (u.photo!="") $(avatar).css({'background-image':'url('+yoodoo.replaceDomain(u.photo)+')'});
							$(this).append(
								$(fulldetails).css({
									width:pos.width-(margin*2),
									height:pos.height-(margin*2),
									overflow:'auto',
									opacity:0,
									padding:margin
								}).append(
									avatar
								).append(
									name
								)
							);
							for(var k in yoodoo.groups.sortFunctionsNames) {
								var row=yoodoo.e("div");
								$(fulldetails).append($(row).html(yoodoo.groups.sortFunctionsNames[k]+': <b>'+u[k]+'</b>'));
							}
							
							for(var i=0;i<yoodoo.groups.otherSortKeys.length;i++) {
								var k=yoodoo.groups.otherSortKeys[i];
								var n=k.replace(/_/g,' ').replace(/^\w/,function(txt) {return txt.toUpperCase();});
								
								var row=yoodoo.e("div");
								$(fulldetails).append($(row).html(n+': <b>'+u[k]+'</b>'));
							}
							$(fulldetails).animate({opacity:1});
							
							var activity=yoodoo.e("div");
							yoodoo.groups.activityDiv=activity;
							if (yoodoo.user.advisor===true || yoodoo.user.staff===true) {
								var but=yoodoo.e("button");
								$(activity).append(
									$(but).attr("type","button").html(yoodoo.w("viewactivity")).addClass("asLink").click(function() {
										var params={
											cmd:'useractivity',
											bio_user_id:u.id,
											context:yoodoo.groups,
											callback:'yoodoo.groups.useractivityUpdate'
										};
										yoodoo.sendPost(null,params);
									})
								);
								
							}
							
							var bio=yoodoo.e("div");
							$(fulldetails).append(
								activity
							).append(
								$(bio).html(yoodoo.w('loadingmore'))
							);
							yoodoo.groups.bioDiv=bio;
							var params={
								cmd:'userbio',
								bio_user_id:u.id,
								context:yoodoo.groups,
								callback:'yoodoo.groups.bioDivUpdate'
							};
							yoodoo.sendPost(null,params);
						});
						$(blockout).click(function(e) {
							e.preventDefault();
							e.stopPropagation();
							var details=this.details;
							$(this.details).find('>div').animate({opacity:0},200,function() {
								$(details).removeClass("showingDetails");
								$(details).animate({
									width:details.originalSize.w,
									height:details.originalSize.h,
									top:details.originalSize.top,
									left:details.originalSize.left
								},500,function() {
									$(this).remove();
								});
							});
							$(this).remove();
						});
					}
				});
			}
		};
		this.rearrangeUsers=function() {
			var pos=[];
			for(var u=0;u<this.users.length;u++) {
				this.users[u].index=u;
				pos.push($(this.users[u].container).offset());
				$(this.users[u].container).find('.groupuserscore').html('<span>'+this.users[u][yoodoo.groups.sortBy]+'</span>');
			}
			this.users.sort(yoodoo.groups.sorting);
			for(var u=0;u<this.users.length;u++) {
				$(this.users[u].container).css({
					position:'relative',
					left:pos[this.users[u].index].left-pos[u].left,
					top:pos[this.users[u].index].top-pos[u].top
				});
				$(yoodoo.groups.containers.viewerList).append(this.users[u].container);
			}
			for(var u=0;u<this.users.length;u++) {
				this.users[u].index=u;
				$(this.users[u].container).animate({left:0,top:0});
			}
			
			
		};
	},
	close : function() {
		if (this.containers.container !== null) {
			this.opening=null;
			$(this.containers.container).find(".busy").removeClass("busy");
			$(this.containers.container).find(".viewing").removeClass("viewing");
			this.containers.optional.hide();
			this.containers.viewer.hide();
			this.containers.member.hide(
				function() {
					$(yoodoo.groups.containers.container).remove();
					yoodoo.groups.containers.container = null;
					if ($(yoodoo.container).find('>*').get().length==0) $(yoodoo.container).hide();
				}
			);
		}
	},
	manage : function() {
		if (yoodoo.user.advisor) this.sortFunctionsNames.awaiting='Awaiting acceptance';
		if (this.containers.container !== null) {
			yoodoo.hideAnimation(this.containers.container, function() {
				$(yoodoo.groups.containers.container).remove();
				yoodoo.groups.containers.container = null;
				yoodoo.groups.manage();
			});
			return false;
		}
		yoodoo.working(true,yoodoo.w('fetchinggroups'));
		this.get(this.management);
	},
	management : function() {
		var me=this;
		yoodoo.working(false);
		yoodoo.clearTransition(yoodoo.container);
		$(yoodoo.container).show();
		this.containers.container = yoodoo.e("div");
		$(this.containers.container).addClass("yoodooGroups").css({
			width : yoodoo.option.width - 8,
			height : yoodoo.option.height - 8
		}).click(function(e) {
			if (e.target===this) me.close();
		});

		this.containers.member = yoodoo.e("div");
		this.containers.memberTitle = yoodoo.e("div");
		$(this.containers.memberTitle).append(yoodoo.icons.get('groups',50,50)).css({'text-align':'center'});
		this.containers.memberList = yoodoo.e("div");
		$(this.containers.container).append($(this.containers.member).addClass("yoodooGroupsMember").append($(this.containers.memberTitle).addClass("yoodooGroupsMemberTitle").append("<div>"+yoodoo.w('yourgroups')+"</div>")).append($(this.containers.memberList).addClass("yoodooGroupsMemberList")));
		var closeBut=yoodoo.e("button");
		$(this.containers.memberTitle).append(
			$(closeBut).attr("type","button").html("<span></span> "+yoodoo.w('close')).addClass("closeBySlide").click(function() {
				$(this).unbind("click");
				yoodoo.groups.close();
			})
		);
		this.listMembers();
		

		this.containers.viewer = yoodoo.e("div");
		this.containers.viewerTitle = yoodoo.e("div");
		$(this.containers.viewerTitle).append(yoodoo.icons.get('groupsViewer',50,50)).css({'text-align':'center'});
		this.containers.viewerList = yoodoo.e("div");
		$(this.containers.container).append($(this.containers.viewer).addClass("yoodooGroupsViewer").append($(this.containers.viewerTitle).addClass("yoodooGroupsViewerTitle").append("<div>"+yoodoo.w('noneselected')+"</div>")).append($(this.containers.viewerList).addClass("yoodooGroupsViewerList")));
		var label=yoodoo.e("label");
		$(this.containers.viewerTitle).append(
			label
		);

		this.containers.optional = yoodoo.e("div");
		this.containers.optionalTitle = yoodoo.e("div");
		$(this.containers.optionalTitle).append(yoodoo.icons.get('groupsAvailable',50,50)).css({'text-align':'center'});
		this.containers.optionalList = yoodoo.e("div");
		$(this.containers.container).append($(this.containers.optional).addClass("yoodooGroupsOptional").append($(this.containers.optionalTitle).addClass("yoodooGroupsOptionalTitle").append("<div>"+yoodoo.w('availablegroups')+"</div>")).append($(this.containers.optionalList).addClass("yoodooGroupsOptionalList")));
		this.listAvailable();
		
		
		this.containers.member.hide=function() {
			var callback=function(){};
			if (arguments.length>0) callback=arguments[0];
			$(this).animate({
				left : -$(this).width()
			},300,function() {
				callback();
			});
		};
		this.containers.member.reveal=function() {
			var callback=function(){};
			if (arguments.length>0) callback=arguments[0];
			$(this).animate({
				left : 0
			},300,function() {
				callback();
			});
		};
		this.containers.optional.hide=function() {
			var callback=function(){};
			if (arguments.length>0) callback=arguments[0];
			$(this).animate({
				right : -($(this).width()+50)
			},300,function() {
				$(this).parent().prepend(this);
				callback();
			});
		};
		this.containers.optional.reveal=function() {
			var callback=function(){};
			if (arguments.length>0) callback=arguments[0];
			$(this).animate({
				right : 0
			},300,function() {
				callback();
			});
		};
		this.containers.viewer.hide=function() {
			var callback=function(){};
			if (arguments.length>0) callback=arguments[0];
			$(this).animate({
				right : -($(this).width()+50)
			},300,function() {
				$(this).parent().prepend(this);
				callback();
			});
		};
		this.containers.viewer.reveal=function() {
			var callback=function(){};
			if (arguments.length>0) callback=arguments[0];
			$(this).animate({
				right : 0
			},300,function() {
				callback();
			});
		};

		$(yoodoo.container).append(this.containers.container);
		
		var memberPadding=0;
		var pad=yoodoo.getPadding(this.containers.memberList);
		$(this.containers.memberList).css({
			'height':$(this.containers.member).height()-($(this.containers.memberList).offset().top-$(this.containers.member).offset().top)-($(this.containers.memberList).outerHeight(true)-$(this.containers.memberList).height())-pad.top-pad.bottom
		});
		var pad=yoodoo.getPadding(this.containers.viewerList);
		$(this.containers.viewerList).css({
			'height':$(this.containers.viewer).height()-($(this.containers.viewerList).offset().top-$(this.containers.viewer).offset().top)-($(this.containers.viewerList).outerHeight(true)-$(this.containers.viewerList).height())-pad.top-pad.bottom
		});
		var pad=yoodoo.getPadding(this.containers.optionalList);
		$(this.containers.optionalList).css({
			'height':$(this.containers.optional).height()-($(this.containers.optionalList).offset().top-$(this.containers.optional).offset().top)-($(this.containers.optionalList).outerHeight(true)-$(this.containers.optionalList).height())-pad.top-pad.bottom
		});
		
		
		
		$(this.containers.member).css({
			left : -$(this.containers.member).width(),
			visibility : 'visible'
		});
		$(this.containers.optional).css({
			right : -($(this.containers.optional).width()+50),
			visibility : 'visible'
		});
		$(this.containers.viewer).css({
			width:yoodoo.option.width-$(this.containers.member).width()-30
		});
		$(this.containers.viewer).css({
			right : -($(this.containers.viewer).width()+50),
			visibility : 'visible'
		});
		
		this.containers.member.reveal();
		if (this.optional.length>0) this.containers.optional.reveal();
	},
	listMembers : function() {
		for (var g = 0; g < this.groups.length; g++) {
			$(this.containers.memberList).append(this.groups[g].render());
		}
	},
	listAvailable : function() {
		for (var g = 0; g < this.optional.length; g++) {
			$(this.containers.optionalList).append(this.optional[g].render());
		}
	}
}; 