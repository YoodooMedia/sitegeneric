/*
	yoodoo.comments.build({
		contentId:contentId, // null = all, 0 = not content, >0 = to content only
		targetId:contentId, // contentId of the lowest item in the content hierarchy
		container:element, // required
		listWindow:element, // optional
		inputWindow:element, // optional
		filterWindow:element, // optional
		sharing:true|false, // true = sharing is available and the feed includes comments by other people
		targetOnly:true|false, // true = comments by this user from within a dooit (ring-fenced)
		sliding:true|false, // true = initiates a slider object
		title:'Comments',
		generalPostTitle:'Post a general comment',
		callbacks:{
			received:function(list) {},
			replies:function(item) {},
			newcomment:function(comment) {}
		}
	});



 */
yoodoo.comments={
	commentsById:{},
	objects:[],
	groupsFetched:false,
	groupsLoaded:false,
	groupsLoadedCallbacks:[],
	emptyText:'Click here to write your new post...',
	build:function(opts) {
		if (!this.groupsFetched) yoodoo.groups.get(yoodoo.comments.groupsReply);
		this.groupsFetched=true;
		this.clearDisposedObjects();
		var obj=new this.object(opts);
		obj.index=this.objects.length;
		this.objects.push(obj);
		if (opts.contentId) obj.contentId=opts.contentId;
		if (opts.container) obj.container=opts.container;
		if (opts.listWindow) {
			obj.listWindow=opts.listWindow;
		}else{
			obj.listWindow=yoodoo.e("div");
			$(obj.listWindow).css({width:'50%',height:$(obj.container).height()-30,display:'inline-block','vertical-align':'top'});
			$(obj.container).append(obj.listWindow);
		}
		if (obj.listWindow!==obj.container) {
			if (opts.inputWindow) {
				obj.inputWindow=opts.inputWindow;
			}else{
				obj.inputWindow=yoodoo.e("div");
				$(obj.inputWindow).css({width:'50%',height:$(obj.container).height()-30,display:'inline-block','vertical-align':'top'});
				$(obj.container).append(obj.inputWindow);
			}
			if (opts.filterWindow) {
				obj.filterWindow=opts.filterWindow;
			}else{
				obj.filterWindow=yoodoo.e("div");
				$(obj.filterWindow).addClass('filterWindow');
				$(obj.container).prepend(obj.filterWindow);
			}
		}

		obj.listui();
		obj.inputui();
		return obj;
	},
	updateUnreadComments:function() {
		if (yoodoo.user.unreadComments>0) {
			$('.unreadButtonCount').html(yoodoo.user.unreadComments).show();
		}else{
			$('.unreadButtonCount').hide();
		}
	},
	unreadButtonProcess:function() {
		if (yoodoo.user.unreadComments>0) {
			return '<div class="reddot unreadButtonCount">'+yoodoo.user.unreadComments+'</div>';
		}else{
			return '<div class="reddot unreadButtonCount" style="display:none"></div>';
		}
	},
	groupsReply:function(groups) {
		yoodoo.comments.groupsLoaded=true;
		for(var c=0;c<yoodoo.comments.groupsLoadedCallbacks.length;c++) {
			try{
				eval(yoodoo.comments.groupsLoadedCallbacks[c]);
			}catch(e){}
		}
		yoodoo.comments.groupsLoadedCallbacks=[];
	},
	clearDisposedObjects:function() {
		for(var o=this.objects.length-1;o>=0;o--) {
			if (this.objects[o].container.parentNode===undefined || this.objects[o].container.parentNode===null) this.objects.splice(o,1);
		}
		for(var o=0;o<this.objects.length;o++) this.objects[o].index=0;
	},
	show:function(opts) {
//opts.sharing=false;
		yoodoo.pauseVideo();
		yoodoo.postDisplay=function() {yoodoo.comments.postShow(opts);};
		yoodoo.display('<div id="fullComments"></div>',false,true);
	},
	postShow:function(opts) {
		var container=$(yoodoo.container).find('#fullComments').get(0);
		var ysa=$('#yoodooScrolledArea');
		$(container).css({padding:4,width:ysa.width()-8,height:ysa.height()-8}).addClass('commentItem');
		if (opts===undefined) opts={};
		opts.container=container;
		this.build(opts);
	},
	updateComment:function(data,excludeIndex) {
		for(var o=0;o<this.objects.length;o++) {
			if (o!=excludeIndex && this.objects[o].commentsById[data.id]!==undefined) this.objects[o].commentsById[data.id].updateData(data);
		}
	},
	updateResponses:function(data,commentId,excludeIndex) {
		for(var o=0;o<this.objects.length;o++) {
			if (o!=excludeIndex && this.objects[o].commentsById[commentId]!==undefined) this.objects[o].commentsById[commentId].receivedResponses(data);
		}
	},
	object:function(options) {
		this.index=0;
		this.title='Comments';
		this.generalPostTitle='Post a general comment';
		this.comments=[];
		this.commentsById={};
		this.incrementQuantity=5;
		this.filterContent=null;
		this.filterUser=null;
		this.filterContentId=null;
		this.filterByUserButton=null;
		this.callbacks={
			received:function(list) {},
			replies:function(item) {},
			newcomment:function(comment) {}
		};
		this.sliding=true;
		this.more=true;
		this.contentId=null; // null = all, 0 = not content, >0 = to content only
		this.targetId=null; // null = contentId, else the keypoint or chapter id
		this.targetOnly=false; // true = comments by this user from within a dooit (ring-fenced)
		this.sharing=true; // true = sharing is available and the feed includes comments by other people
		for(var k in options) {
			if (k=='callbacks'){
				for(var kk in options[k]) {
					this[k][kk]=options[k][kk];
				}
			}else{
				this[k]=options[k];
			}
		}
		if (this.targetId!==null) this.filterContentId=this.targetId;
		this.sendingNew=false;
		this.clear=function() {
			this.contentId=null;
			this.more=true;
			this.comments=[];
			this.commentsById={};
		};
		this.refreshing=false;
		this.refresh=function() {
			this.refreshing=true;
			this.fetch(this.comments.length>this.incrementQuantity?this.comments.length:this.incrementQuantity);
		};
		this.fetch=function() {
			if (!this.targetOnly && this.sharing && this.filterContentId===null && !(this.filterUser>0)) {
				yoodoo.user.unreadComments=0;
				yoodoo.comments.updateUnreadComments();
			}
			var q=this.comments.length+this.incrementQuantity;
			if (arguments.length>0) q=arguments[0];
			var params={
				cmd:'commentsFeed',
				amount:q,
				callback:'yoodoo.comments.objects['+this.index+'].received',
				targetOnly:(this.targetOnly?'1':'0'),
				sharing:(this.sharing?'1':'0')
			};
			if (this.contentId!==null) {
				params.contentId=this.contentId;
			}
			if (this.contentId>0 && this.filterContentId!==null) {
				params.targetId=this.filterContentId;
				if (this.filterContent===null) params.getContent=1;
			}
			if (this.filterUser>0) params.filterUser=this.filterUser;
			yoodoo.sendPost(null,params);
		};
		this.filterToUser=function(userid,name) {
			if (this.filterUser==userid) return false;
			if (userid===null) {
				$(this.listContent).removeClass('filterByUser');
				if (this.filterByUserButton!==null) {
					$(this.filterByUserButton).fadeOut(200,function() {$(this).remove();});
					this.filterByUserButton=null;
				}
			}else{
				$(this.listContent).addClass('filterByUser');
				if (this.filterByUserButton===null) {
					this.filterByUserButton=yoodoo.e("a");
					this.filterByUserButton.source=this;
					this.filterByUserButton.href='javascript:void(0)';
					$(this.filterWindow).find('>div').append(this.filterByUserButton);
					$(this.filterByUserButton).html('<em class="whenNoHover" style="position:absolute;left:20px;">by</em><em class="whenHover">clear</em> '+name).addClass("commentFilter").click(function() {
						this.source.filterToUser(null,null);
					}).css({display:"none"}).fadeIn(200);
				}else{
					$(this.filterByUserButton).html(name);
				}
				for(var c=this.comments.length-1;c>=0;c--) {
					if (this.comments[c].user_id!=userid) {
						var toRemove=this.comments.splice(c,1);
						this.commentsById[toRemove[0].id]=undefined;
						//$(toRemove[0].container).remove();
						$(toRemove[0].container).slideUp(200,function() {$(this).remove();});
					}
				}
			}
			this.filterUser=userid;
			this.refresh();
		};
		this.receivedNew=function(args) {
			this.received(args,true);
		};
		this.received=function(args) {
			var withNew=false;
			if (arguments.length>1) withNew=arguments[1];
			var lastItem=(this.comments.length>0)?this.comments[this.comments.length-1]:null;
			var reply=$.parseJSON(Base64.decode(args));
			if (reply.content!==null) {
				this.filterContent={content:reply.content};
				if (reply.chapter!==null) this.filterContent.chapter=reply.chapter;
				if (reply.target!==null) this.filterContent.target=reply.target;
			}
			this.filterui();
			if (!withNew) {
				if (reply.comments.length==0 || this.comments.length+this.incrementQuantity>reply.comments.length) {
					this.more=this.refreshing;
				}else{
					this.more=(reply.comments.length!=this.comments.length);
				}
			}
			this.refreshing=false;
			if (reply.comments.length==0) {
				$(this.listContent).find('>span').slideUp(function() {
					$(this).remove();
				});
				$(this.listSlideContent).find('>span,>.noneFound').css({display:'block'}).slideUp(function() {$(this).remove();});
				var em=yoodoo.e('div');
				$(em).html('<em>No comments found</em>').hide().addClass("noneFound");
				$(this.listContent).append(em);
				$(em).slideDown();
				
				if (withNew) {
					this.callbacks.newcomment([]);
				}else{
					this.callbacks.received([]);
				}
			}else{
				var callbackList=[];
				for(var c=0;c<reply.comments.length;c++) {
					if (/^new Date/.test(reply.comments[c].created_at)) {
						try {
							eval('reply.comments[c].created_at='+reply.comments[c].created_at+';');
						}catch(e){}
					}
					if (/^new Date/.test(reply.comments[c].updated_at)) {
						try {
							eval('reply.comments[c].updated_at='+reply.comments[c].updated_at+';');
						}catch(e){}
					}
					reply.comments[c].created_at=new Date(reply.comments[c].created_at.getTime()+yoodoo.serverTimeOffset);
					reply.comments[c].updated_at=new Date(reply.comments[c].updated_at.getTime()+yoodoo.serverTimeOffset);
					if (this.commentsById[reply.comments[c].id]!==undefined) {
						this.commentsById[reply.comments[c].id].updateData(reply.comments[c]);
					}else{
						this.commentsById[reply.comments[c].id]=new yoodoo.comments.comment(this,reply.comments[c]);
					}
					callbackList.push(this.commentsById[reply.comments[c].id]);
					yoodoo.comments.updateComment(reply.comments[c],this.index);
					//if (yoodoo.comments.commentsById[reply.comments[c].id]===undefined) yoodoo.comments.commentsById[reply.comments[c].id]=this.commentsById[reply.comments[c].id];
				}
				this.comments=[];
				for(var id in this.commentsById) {
					if (this.commentsById[id]!==undefined) this.comments.push(this.commentsById[id]);
				}
				this.comments.sort(function(a,b) {
					return b.updated_at-a.updated_at;
				});
				if (withNew) {
					this.callbacks.newcomment(callbackList);
				}else{
					this.callbacks.received(callbackList);
				}
				$(this.listContent).find('>span,>.noneFound').css({display:'block'}).slideUp(function() {$(this).remove();});
				$(this.listSlideContent).find('>span,>.noneFound').css({display:'block'}).slideUp(function() {$(this).remove();});
				for(var c=0;c<this.comments.length;c++) {
					$(this.listContent).append(this.comments[c].getContainer());
				}
				$(this.listContent).find('.shrunk').removeClass("shrunk").slideDown(500);
				if (this.more && this.list.moreButton===undefined) {
					var but=yoodoo.e("button");
					but.source=this;
					$(this.listSlideContent).append($(but).attr("type","button").html("more...").bind("click",function() {
						this.source.fetch();
						$(this.parentNode).find('>button').animate({top:-26},200);
					}).addClass("moreButton").css({opacity:0,top:-26}).animate({opacity:1,top:-5},200));
					this.list.moreButton=but;
				}
				if (this.more) {
					$(this.list.moreButton).animate({top:0},200);
				}else{
					$(this.list.moreButton).animate({top:-26},200);
				}
				$(this.list.refreshButton).animate({top:0},200);

				if (this.list.refreshButton===undefined) {
					var but=yoodoo.e("button");
					but.source=this;
					$(this.listSlideContent).append($(but).attr("type","button").html("refresh").bind("click",function() {
						this.source.refresh();
						$(this.parentNode).find('>button').animate({top:-26},200);
					}).addClass("moreButton").css({opacity:0,top:-26}).animate({opacity:1,top:0},200));
					this.list.refreshButton=but;
				}

				if (this.sendingNew && this.comments.length>0) {
					lastItem=this.comments[0];
					this.sendingNew=false;
				}
				var me=this;
				var on=$(this.listContent).find('.commentItem.on').get();
				if (on.length>0) {
					lastItem=on[0].source;
				}
				if (lastItem!==null) setTimeout(function() {
					//console.log(lastItem.getContainer());
					me.list.scrollTo(lastItem.getContainer());
				},1000);
			}
			yoodoo.comments.updateTimes();
			if (this.filterContent!==null && this.filterContent.target!==undefined && this.filterContent.target.type=='dooit' && this.snapbutton!==null) $(this.snapbutton).show();
		};
		this.update=function() {
			if (this.comments.length==0) {
				this.fetch();
			}else{
				this.fetch(this.comments.length);
			}
		};
		this.filterui=function() {
			if (this.filterWindow!==undefined) {
				if (this.filter===undefined) {
					this.filter=yoodoo.e("div");
					$(this.filter).html('<span class="commentIcon"><span>&nbsp;</span>'+this.title+'</span>');
					$(this.filterWindow).append(this.filter);

					if (this.filterContent!==null && this.targetOnly===false) {
						if (this.filterContent.content!==undefined && this.filterContent.target!==undefined && this.filterContent.content.content!=this.filterContent.target.content) {
							var a=yoodoo.e("a");
							if (this.filterContentId===null) {
								$(a).addClass("on");
								$(this.textareaTitle).html('Comment on &lsquo;'+this.filterContent.content.name+'&rsquo;');
							}
							a.href='javascript:void(0)';
							a.content=this.filterContent.content;
							a.source=this;
							$(a).bind("click",function() {
								if (!($(this).hasClass("on"))) {
									this.source.filterContentId=null;
									this.source.comments=[];
									this.source.commentsById={};
									var src=this.source;
									this.source.list.clear(function() {src.fetch();});
									$(this).addClass("on").siblings('a').removeClass("on");
									$(this.source.textareaTitle).html('Comment on &lsquo;'+this.content.name+'&rsquo;');
								}
							}).html('All').addClass("commentFilter");
							$(this.filter).append(a);
						}
		
						if (this.filterContent.content!==undefined) {
							var a=yoodoo.e("a");
							if (this.filterContent.content.content==this.filterContentId) {
								$(a).addClass("on");
								$(this.textareaTitle).html('Comment on &lsquo;'+this.filterContent.content.name+'&rsquo;');
							}
							a.href='javascript:void(0)';
							a.content=this.filterContent.content;
							a.source=this;
							$(a).bind("click",function() {
								if (!($(this).hasClass("on"))) {
									this.source.filterContentId=this.content.content;
									this.source.comments=[];
									this.source.commentsById={};
									var src=this.source;
									this.source.list.clear(function() {src.fetch();});
									$(this).addClass("on").siblings('a').removeClass("on");
									$(this.source.textareaTitle).html('Comment on &lsquo;'+this.content.name+'&rsquo;');
								}
							}).html('<span class="filter'+this.filterContent.content.type+'">'+this.filterContent.content.name+'</span>').addClass("commentFilter");
							$(this.filter).append(a);
						}
		
						if (this.filterContent.chapter!==undefined && this.filterContent.chapter.content!=this.filterContent.content.content) {
							var a=yoodoo.e("a");
							if (this.filterContent.chapter.content==this.filterContentId) {
								$(a).addClass("on");
								$(this.textareaTitle).html('Comment on &lsquo;'+this.filterContent.chapter.name+'&rsquo;');
							}
							a.href='javascript:void(0)';
							a.content=this.filterContent.chapter;
							a.source=this;
							$(a).bind("click",function() {
								if (!($(this).hasClass("on"))) {
									this.source.filterContentId=this.content.content;
									this.source.comments=[];
									this.source.commentsById={};
									var src=this.source;
									this.source.list.clear(function() {src.fetch();});
									$(this).addClass("on").siblings('a').removeClass("on");
									$(this.source.textareaTitle).html('Comment on &lsquo;'+this.content.name+'&rsquo;');
								}
							}).html('<span class="filter'+this.filterContent.chapter.type+'">'+this.filterContent.chapter.name+'</span>').addClass("commentFilter");
							$(this.filter).append(a);
						}
		
						if (this.filterContent.target!==undefined && this.filterContent.target.content!=this.filterContent.content.content) {
							var a=yoodoo.e("a");
							if (this.filterContent.target.content==this.filterContentId) {
								$(a).addClass("on");
								$(this.textareaTitle).html('Comment on &lsquo;'+this.filterContent.target.name+'&rsquo;');
							}
							a.href='javascript:void(0)';
							a.content=this.filterContent.target;
							a.source=this;
							$(a).bind("click",function() {
								if (!($(this).hasClass("on"))) {
									this.source.filterContentId=this.content.content;
									this.source.comments=[];
									this.source.commentsById={};
									var src=this.source;
									this.source.list.clear(function() {src.fetch();});
									$(this).addClass("on").siblings('a').removeClass("on");
									$(this.source.textareaTitle).html('Comment on &lsquo;'+this.content.name+'&rsquo;');
								}
							}).html('<span class="filter'+this.filterContent.target.type+'">'+this.filterContent.target.name+'</span>').addClass("commentFilter");
							$(this.filter).append(a);
						}
					}
				}
			}
		};
		this.listui=function() {
			if (this.listWindow!==undefined) {
				this.list=yoodoo.e("div");
				this.listSlideContent=yoodoo.e("div");
				this.listContent=yoodoo.e("div");
				$(this.list).css({padding:5}).addClass("commentsListUI").append($(this.listSlideContent).append($(this.listContent).html("<span>Fetching comments...</span>")));
				if (this.sliding) $(this.list).css({height:$(this.listWindow).height()-10});
				$(this.listWindow).append(this.list);
				this.list.content=this.listContent;
				this.list.clear=function(complete) {
					if (complete===undefined) complete=function(){};
					$(this).fadeOut(500,function() {
						$(this.content).empty();
						$(this).find(">button").remove();
						$(this).show();
						complete();
					});
				};
				this.fetch();
				if (this.sliding) yoodoo.initSlider(this.list,this.listSlideContent,{horizontal:false});
			}
		};
		this.respondTo=null;
		this.inputIsReply=function(comment) {
			if (comment===null) {
				this.inputTitleText=this.generalPostTitle;
				$(this.textareaTitle).html(this.inputTitleText);
				$(this.groupSelector).slideDown();
				$(this.container).find('.commentItem').removeClass("on");
			}else{
				if (this.respondTo===null) this.inputTitleText=$(this.textareaTitle).html();
				$(comment.container).addClass("on").siblings().removeClass("on");
				var cancel=yoodoo.e("button");
				cancel.source=this;
				$(cancel).attr("type","button").html('cancel').bind("click",function() {
					this.source.inputIsReply(null);
				}).addClass('cancelReply');
				$(this.textareaTitle).html('Reply...').append(cancel);
				$(this.groupSelector).slideUp();
				$(this.textarea).focus();
			}
			this.respondTo=comment;
		};
		this.inputui=function() {
			if (this.inputWindow!==undefined) {
				this.input=yoodoo.e("div");
				$(this.input).css({padding:5,height:$(this.inputWindow).height()-10}).addClass("commentsInputUI");

				this.snapbutton=null;
				//if (this.filterContent.target.type=='dooit' && 
				//if (typeof(dooitInformation)!='undefined' && dooitInformation.canSnapshot===true) {
				if (typeof(dooitInformation)!='undefined' && dooit.canSnapshot) {
					this.snapbutton=yoodoo.e("div");
					var label=yoodoo.e("label");
					$(label).attr('for','sendSnapshot').html("Attach a snapshot <span class='camera'><span></span></span>")
					this.useSnapshot=yoodoo.e("input");
					this.useSnapshot.id='sendSnapshot';
					var info=yoodoo.e("span");
					$(info).addClass("infoBubble").html('<div><div>Attach a copy of your doo-it to this comment, with the information you have entered up to now.</div></div>');
					$(info).click(function() {
						$(this).find('>div').css({opacity:0}).show().animate({opacity:1},300);
					}).bind("mouseleave",function() {
						$(this).find('>div').animate({opacity:0},300,function() {$(this).hide()});
					});
					$(this.snapbutton).addClass("sendSnapshot").append(info).append($(this.useSnapshot).attr("type","checkbox")).append(label);
					/*this.snapbutton.source=this;
					$(this.snapbutton).attr("type","button").bind("click",function() {
						//if (!($(this).hasClass('unavailable')) && this.source.textarea.value!="") this.source.send();
					}).html('SNAPSHOT').addClass("sendComment").addClass("unavailable").hide();*/
				}

				var but=yoodoo.e("button");
				but.source=this;
				$(but).attr("type","button").bind("click",function() {
					if (!($(this).hasClass('unavailable')) && this.source.textarea.value!="") this.source.send();
				}).html('POST').addClass("sendComment").addClass("unavailable");

				this.textareaContainer=yoodoo.e("div");
				this.textarea=yoodoo.e('textarea');
				this.textarea.source=this;
				$(this.textarea).css({width:$(this.inputWindow).width()-26}).val(yoodoo.comments.emptyText);
				$(this.textareaContainer).addClass('emptyTextarea').addClass('textareaContainer').css({padding:0});
				this.textareaTitle=yoodoo.e('div');
				$(this.textareaTitle).html('Post a general comment').addClass('textareaTitle');
				$(this.input).append(this.textareaTitle).append(this.snapbutton).append(but).append($(this.textareaContainer).append(this.textarea).append(this.snapbutton));
				$(this.textarea).bind("focus",function() {
					if (this.value==yoodoo.comments.emptyText) this.value='';
					$(this).parent().removeClass('emptyTextarea').addClass("focus");
					if (this.value!="" && this.source.groupSelectionAcceptable()) {
						$(this.parentNode.parentNode).find('.sendComment').removeClass("unavailable");
						var done=$('.overlayFooter button.done').addClass("unavailable").get(0);
						done.disabled=true;
					}else{
						$(this.parentNode.parentNode).find('.sendComment').addClass("unavailable");
						var done=$('.overlayFooter button.done').removeClass("unavailable").get(0);
						done.disabled=false;
					}
				}).bind("keyup",function() {
					if (this.value!="" && this.source.groupSelectionAcceptable()) {
						$(this.parentNode.parentNode).find('.sendComment').removeClass("unavailable");
						var done=$('.overlayFooter button.done').addClass("unavailable").get(0);
						done.disabled=true;
					}else{
						$(this.parentNode.parentNode).find('.sendComment').addClass("unavailable");
						var done=$('.overlayFooter button.done').removeClass("unavailable").get(0);
						done.disabled=false;
					}
				}).bind("blur",function() {
					if (this.value=='') {
						this.value=yoodoo.comments.emptyText;
						$(this).parent().addClass('emptyTextarea').removeClass("focus");
						if (this.source.groupSelectionAcceptable()) $(this.parentNode.parentNode).find('.sendComment').addClass("unavailable");
						var done=$('.overlayFooter button.done').removeClass("unavailable").get(0);
						done.disabled=false;
					}else{
						$(this).parent().removeClass('emptyTextarea').removeClass("focus");
						$(this.parentNode.parentNode).find('.sendComment').removeClass("unavailable");
						var done=$('.overlayFooter button.done').addClass("unavailable").get(0);
						done.disabled=true;
					}
				});
				this.groupSelector=yoodoo.e('div');
				$(this.groupSelector).addClass("groupSelector");
				$(this.input).append(this.groupSelector);
				$(this.inputWindow).append(this.input);
				if (yoodoo.comments.groupsLoaded) {
					this.groupSelection();
				}else{
					yoodoo.comments.groupsLoadedCallbacks.push('yoodoo.comments.objects['+this.index+'].groupSelection();');
				}
			}
		};
		this.groups=undefined;
		this.groupSelectionAcceptable=function() {
			if (this.sharing===false) return true;
			if (this.groups===undefined || this.groups===null) return true;
			for(var id in this.groups) {
				if (this.groups[id]===true) return true;
			}
			return false;
		};
		this.groupSelection=function() {
			if (!this.sharing) return false;
			$(this.groupSelector).empty();


			var but=yoodoo.e("button");
			but.source=this;
			$(but).attr("type","button").html("<span class='shareNone'>&nbsp;</span>private").click(function() {
				if (!($(this).hasClass("on"))) {
					$(this).addClass("on").siblings().removeClass("on");
					this.source.groups=undefined;
					$(this.source.groupList).slideUp();
					if (this.source.textarea.value=='' || $(this.source.textarea).parent().hasClass('emptyTextarea')) {
						$(this.parentNode.parentNode).find('.sendComment').addClass("unavailable");
						var done=$('.overlayFooter button.done').removeClass("unavailable").get(0);
						done.disabled=false;
					}else{
						$(this.parentNode.parentNode).find('.sendComment').removeClass("unavailable");
						var done=$('.overlayFooter button.done').addClass("unavailable").get(0);
						done.disabled=true;
					}
				}
			});
			if (this.groups===undefined) $(but).addClass("on");
			$(this.groupSelector).append(but);


			var but=yoodoo.e("button");
			but.source=this;
			$(but).attr("type","button").html("<span class='shareAll'>&nbsp;</span>share to all").click(function() {
				if (!($(this).hasClass("on"))) {
					$(this).addClass("on").siblings().removeClass("on");
					this.source.groups=null;
					$(this.source.groupList).slideUp();
					if (this.source.textarea.value=='' || $(this.source.textarea).parent().hasClass('emptyTextarea')) {
						$(this.parentNode.parentNode).find('.sendComment').addClass("unavailable");
						var done=$('.overlayFooter button.done').removeClass("unavailable").get(0);
						done.disabled=false;
					}else{
						$(this.parentNode.parentNode).find('.sendComment').removeClass("unavailable");
						var done=$('.overlayFooter button.done').addClass("unavailable").get(0);
						done.disabled=true;
					}
				}
			});
			if (this.groups===null) $(but).addClass("on");
			$(this.groupSelector).append(but);

			if (yoodoo.groups.groups.length==1) {
				var but=yoodoo.e("button");
				but.source=this;
				$(but).attr("type","button").html("<span class='shareOne'>&nbsp;</span>share in "+yoodoo.groups.groups[0].name).click(function() {
					if (!($(this).hasClass("on"))) {
						$(this).addClass("on").siblings().removeClass("on");
						if (this.source.groups===undefined || this.source.groups===null) this.source.groups={};
						this.source.groups[yoodoo.groups.groups[0].id]=true;
						if (this.source.textarea.value=='' || $(this.source.textarea).parent().hasClass('emptyTextarea')) {
							$(this.parentNode.parentNode).find('.sendComment').addClass("unavailable");
							var done=$('.overlayFooter button.done').removeClass("unavailable").get(0);
							done.disabled=false;
						}else{
							$(this.parentNode.parentNode).find('.sendComment').removeClass("unavailable");
							var done=$('.overlayFooter button.done').addClass("unavailable").get(0);
							done.disabled=true;
						}
					}
				});
				if (this.groups!==undefined && this.groups!==null && this.groups[yoodoo.groups.groups[0].id]===true) $(but).addClass("on");
				$(this.groupSelector).append(but);
			}else if (yoodoo.groups.groups.length>1){
				var but=yoodoo.e("button");
				but.source=this;
				$(but).attr("type","button").html("<span class='shareSome'>&nbsp;</span>share to some").click(function() {
					if (!($(this).hasClass("on"))) {
						$(this).addClass("on").siblings().removeClass("on");
						this.source.groups={};
						$(this.source.groupList).find("button").each(function(i,e) {
							if ($(e).hasClass("on")) this.source.groups[e.group.id]=true;
						});
						$(this.source.groupList).slideDown();
						if (this.source.textarea.value=='' || !this.source.groupSelectionAcceptable() || $(this.source.textarea).parent().hasClass('emptyTextarea')) {
							$(this.parentNode.parentNode).find('.sendComment').addClass("unavailable");
							var done=$('.overlayFooter button.done').removeClass("unavailable").get(0);
							done.disabled=false;
						}else{
							$(this.parentNode.parentNode).find('.sendComment').removeClass("unavailable");
							var done=$('.overlayFooter button.done').addClass("unavailable").get(0);
							done.disabled=true;
						}
					}
				}).addClass('groupSelectButton');
				if (this.groups!==undefined && this.groups!==null) $(but).addClass("on");
				$(this.groupSelector).append(but);

				this.groupList=yoodoo.e("div");
				if (this.groups===undefined || this.groups===null) $(this.groupList).hide();
				for(var g=0;g<yoodoo.groups.groups.length;g++) {
					var but=yoodoo.e("button");
					$(but).attr("type","button").html(yoodoo.groups.groups[g].name).click(function() {
						if (this.source.groups[this.group.id]===undefined || this.source.groups[this.group.id]===false) {
							this.source.groups[this.group.id]=true;
							$(this).addClass("on");
						}else{
							this.source.groups[this.group.id]=false;
							$(this).removeClass("on");
						}
						if (this.source.textarea.value=='' || !this.source.groupSelectionAcceptable() || $(this.source.textarea).parent().hasClass('emptyTextarea')) {
							$(this.parentNode.parentNode.parentNode).find('.sendComment').addClass("unavailable");
							var done=$('.overlayFooter button.done').removeClass("unavailable").get(0);
							done.disabled=false;
						}else{
							$(this.parentNode.parentNode.parentNode).find('.sendComment').removeClass("unavailable");
							var done=$('.overlayFooter button.done').addClass("unavailable").get(0);
							done.disabled=true;
						}
					});
					but.source=this;
					but.group=yoodoo.groups.groups[g];
					but.id='group'+yoodoo.groups.groups[g].id;
					if (this.groups!==undefined && this.groups!==null && this.groups[yoodoo.groups.groups[g].id]===true) $(but).addClass("on");
					$(this.groupList).append(but);
				}
				$(this.groupSelector).append(this.groupList);


			}


		};
		this.send=function() {
			if (this.textarea.value!='') {
				if (this.respondTo!==null) {
					this.sendingNew=true;
					var params={
						cmd:'commentsFeed',
						newComment:Base64.encode(this.textarea.value),
						respond:this.respondTo.id,
						callback:'yoodoo.comments.objects['+this.index+'].respondTo.receivedResponses',
						targetOnly:(this.targetOnly?'1':'0'),
						sharing:(this.sharing?'1':'0')		
					};
				}else{
					this.sendingNew=true;
					var params={
						cmd:'commentsFeed',
						newComment:Base64.encode(this.textarea.value),
						callback:'yoodoo.comments.objects['+this.index+'].receivedNew'	
					};
					if (this.useSnapshot!==undefined && this.useSnapshot.checked===true && dooit.canSnapshot) {
						params.snapshot=dooit.snapshotData();
						this.useSnapshot.checked=false;
					}
					if (this.contentId!==null) {
						params.contentId=this.contentId;
						if (this.targetId!==null) {
							params.targetId=this.targetId;
						}
					}
					if (this.groups!==undefined) {
						if (this.groups===null) {
							params.groups='all';
						}else{
							params.groups=[];
							for(var id in this.groups) {
								if (this.groups[id]===true) params.groups.push(id);
							}
						}
					}else{
						params.groups='none';
					}
				}
				yoodoo.sendPost(null,params);
				this.textarea.value='';
				$(this.textarea).val('').addClass("emptyTextarea");
				$(this.textarea.parentNode).find('.sendComment').addClass("unavailable");
				var done=$('.overlayFooter button.done').removeClass("unavailable").get(0);
				done.disabled=false;
			} 
		};
	},
	comment:function(source,data) {
		this.source=source;
		this.replies=[];
		this.repliesById={};
		this.action=null;
		this.actionClass='';
		this.andReply=false;
		this.updateData=function(data) {
			for(var k in data) this[k]=data[k];
			if (this.content_id!==null) {
				var me=this;
				if (this.content_id==this.target_id) {
					if (this.content_type=='dooit') {
						this.actionClass='gotoDooit';
						this.action=function() {
							yoodoo.hide(
								function() {
									yoodoo.showDooit(me.id);
								}
							);
						};
					}else{
						if (this.content_type=='file') this.actionClass='gotoFile';
						if (this.content_type=='episode') this.actionClass='gotoEpisode';
						this.action=function() {
							yoodoo.hide(
								function() {
									yoodoo.startEpisode(me.content_id);
								}
							);
						};
					}
				}else if (this.parent_content_id!==null) {
					if (this.parent_content_id==this.content_id) {
							this.actionClass='gotoChapter';
							this.action=function() {
								yoodoo.hide(
									function() {
										yoodoo.gotoChapter(me.content_id,me.target_id);
									}
								);
							};
					}else{
							this.actionClass='gotoKeypoint';
							this.action=function() {
								yoodoo.hide(
									function() {
										yoodoo.gotoKeypoint(me.content_id,me.parent_content_id,me.target_id);
									}
								);
							};
					}
				}
			}				
			if (this.container!==undefined) this.render();
		};
		this.getContainer=function() {
			if (this.container!==undefined) return this.container;
			this.container=yoodoo.e('div');
			this.container.source=this;
			this.commentBlock=yoodoo.e('div');
			$(this.commentBlock).html(this.comment).addClass('commentBlock');
			if (this.snapshot_id!==null) {
				var snap=yoodoo.e("button");
				snap.id=this.snapshot_id;
				$(this.commentBlock).prepend($(snap).attr("type","button").css({float:'right'}).addClass('snapshot').click(function() {
					var ca=$('.coverall').get();
					if (ca.length>0) {
						ca=ca.shift();
						ca.click();
					}
					dooit.loadSnapshot(this.id);
				}));
			}
			this.shareContent=yoodoo.e("div");
			this.headingBlock=yoodoo.e('div');
			if (this.action!==null) {
				var a=yoodoo.e("a");
				a.href='javascript:void(0)';
				a.item=this;
				$(a).html(this.content_name).addClass(this.actionClass).bind("click",function() {this.item.action();});
				$(this.headingBlock).prepend(a);
			}
			this.authorBlock=yoodoo.e('div');
			this.createdBlock=yoodoo.e('span');
			this.shareComment=yoodoo.e("div");
			$(this.shareComment).addClass('shareContent');
			$(this.headingBlock).prepend($(this.createdBlock).addClass('createdBlock'));
			this.responseBlock=yoodoo.e('div');
			$(this.responseBlock).addClass('responseBlock');
			$(this.container).append(this.headingBlock).append(this.authorBlock).append(this.commentBlock).append(this.responseBlock).addClass('commentItem').addClass('shrunk').hide();
			if (yoodoo.is_touch) {
				var me=this;
				$(this.container).click(function() {
					if ($(this).hasClass("hover")) {
						$(this).removeClass("hover");
						me.source.inputIsReply(null);
					}else{
						$(this).addClass("hover").siblings().removeClass("hover");
						me.showReply();
					}
				});
			}
			this.render();
			return this.container;
		};
		this.showReply=function() {
			if (this.replies.length==0) {
				if (this.responses>0) {
					this.andReply=true;
					this.fetchResponses();
				}else{
					this.source.inputIsReply(this);
				}
			}else{
				this.source.inputIsReply(this);
			}
		};
		this.render=function() {
			$(this.authorBlock).addClass('authorBlock');
			if (this.source.sharing && this.authorFilter===undefined) {
				this.authorFilter=yoodoo.e("a");
				this.authorFilter.href='javascript:void(0)';
				this.authorFilter.source=this;
				$(this.authorFilter).html(this.author).click(function() {
					this.source.source.filterToUser(this.source.user_id,this.source.author);
				}).addClass('authorFilterButton');
				$(this.authorBlock).append(this.authorFilter).prepend(this.shareComment);
			}
			$(this.createdBlock).html(yoodoo.ago(this.created_at));
			if (this.groupcount>0) {
				if (this.groupcount==1 && this.groups.length==0) {
					this.shareComment.title='shared to all the author\'s groups';
					$(this.shareComment).addClass('isSharedAll').html("<span></span>");
				}else{
					var attachedGroups=[];
					for(var g=0;g<this.groups.length;g++) {
						for(var gg=0;gg<yoodoo.groups.groups.length;gg++) {
							if (yoodoo.groups.groups[gg].id==this.groups[g]) attachedGroups.push(yoodoo.groups.groups[gg].name);
						}
					}
					var notYourGroups=this.groups.length-attachedGroups.length;
					var last=attachedGroups.pop();
					var txt=attachedGroups.join(', ');
					if (attachedGroups.length>0) txt+=' and ';
					txt+=last;
					txt='shared to '+txt;
					if (notYourGroups>0) txt+=' and '+notYourGroups+' group'+(notYourGroups==1?'':'s')+' you are not a member of';
					this.shareComment.title=txt;
					$(this.shareComment).addClass('isShared').empty();
					for(var qq=0;qq<this.groups.length;qq++) $(this.shareComment).append(yoodoo.e("span"));
				}
			}else{
				$(this.shareComment).addClass('isprivate').html("<span></span>");
				this.shareComment.title='private';
			}
			//$(this.shareContent).html($(this.shareComment).addClass('shareContent'));
			if (this.replyButton===undefined) {
				this.replyButton=yoodoo.e('a');
				this.replyButton.source=this;
				this.replyButton.href='javascript:void(0)';
				this.replyButton.title='Post a reply';
				$(this.replyButton).html("").css({float:'right'}).addClass('respondButton');
				
				if (!yoodoo.is_touch) {
					$(this.replyButton).bind("click",function() {
						this.source.showReply();
					});
				}
				
				$(this.authorBlock).append(this.replyButton);
			}
			$(this.responseBlock).empty();
			if (this.replies.length==0) {
				if (this.responses==0) {
					$(this.responseBlock).append('<span>no comments</span>');
				}else{
					var a=yoodoo.e("a");
					a.href='javascript:void(0)';
					a.source=this;
					$(a).html(this.responses+' comment'+((this.responses==1)?'':'s')).bind('click',function() {
						this.source.fetchResponses();
					});
					$(this.responseBlock).append(a);
				
				}
			}else{
				if (this.replies.length!=this.responses) {
					this.fetchResponses();
				}else{
					$(this.responseBlock).find('>span,>a').remove();
					$(this.responseBlock).prepend('<span>'+this.responses+' comment'+((this.responses==1)?'':'s')+'</span>');
					for(var r=0;r<this.replies.length;r++) {
						$(this.responseBlock).append(this.replies[r].getContainer());
					}
					$(this.responseBlock).find('>.shrunk').removeClass('shrunk').slideDown();
				}
			}
		};
		this.updateData(data);
		this.fetchResponses=function() {
			var params={
				cmd:'commentResponses',
				commentId:this.id,
				callback:'yoodoo.comments.objects['+this.source.index+'].commentsById['+this.id+'].receivedResponses'			
			};
			yoodoo.sendPost(null,params);
		};
		this.receivedResponses=function(args) {
			var reply=$.parseJSON(Base64.decode(args));
			for(var c=0;c<reply.length;c++) {
				if (/^new Date/.test(reply[c].created_at)) {
					try {
						eval('reply[c].created_at='+reply[c].created_at+';');
					}catch(e){}
				}
				if (/^new Date/.test(reply[c].updated_at)) {
					try {
						eval('reply[c].updated_at='+reply[c].updated_at+';');
					}catch(e){}
				}
				if (this.repliesById[reply[c].id]!==undefined) {
					this.repliesById[reply[c].id].updateData(reply[c]);
				}else{
					this.repliesById[reply[c].id]=new yoodoo.comments.reply(this,reply[c]);
				}
				reply[c].created_at=new Date(reply[c].created_at.getTime()-yoodoo.serverTimeOffset);
				reply[c].updated_at=new Date(reply[c].updated_at.getTime()-yoodoo.serverTimeOffset);
				if (reply[c].updated_at>this.updated_at) this.updated_at=reply[c].updated_at;
			}
			this.replies=[];
			this.responses=0;
			for(var id in this.repliesById) {
				this.replies.push(this.repliesById[id]);
				this.responses++;
			}
			this.replies.sort(function(a,b) {
				return b.updated_at-a.updated_at;
			});
			this.source.callbacks.replies(this.replies);
			this.render();
			yoodoo.comments.updateResponses(args,this.id,this.source.index);
			if (this.andReply===true) {
				this.andReply=false;
				this.source.inputIsReply(this);
			}else{
				this.source.inputIsReply(null);
			}
			yoodoo.comments.updateTimes();
		};
	},
	reply:function(source,data) {
		this.source=source;
		this.updateData=function(data) {
			for(var k in data) this[k]=data[k];
			this.render();
		};
		this.getContainer=function() {
			if (this.container!==undefined) return this.container;
			this.container=yoodoo.e('div');
			this.commentBlock=yoodoo.e('div');
			$(this.commentBlock).html(this.comment).addClass('commentBlock');
			this.authorBlock=yoodoo.e('span');
			$(this.authorBlock).addClass('authorBlock');
			$(this.authorBlock).html(this.author);
			this.createdBlock=yoodoo.e('span');
			$(this.createdBlock).addClass('createdBlock');
			$(this.container).append(this.createdBlock).append(this.authorBlock).append(this.commentBlock).addClass('responseItem').addClass('shrunk').hide();
			this.render();
			return this.container;
		};
		this.render=function() {
			$(this.createdBlock).html(yoodoo.ago(this.created_at));
		};
		this.updateData(data);
	},
	updateTimes:function() {
		yoodoo.comments.clearDisposedObjects();
		if (yoodoo.comments.objects.length==0) {
			clearInterval(yoodoo.comments.updateTimeInterval);
			yoodoo.comments.updateTimeInterval=undefined;
		}else{
			for(var o=0;o<yoodoo.comments.objects.length;o++) {
				for(var c=0;c<yoodoo.comments.objects[o].comments.length;c++) {
					if (yoodoo.comments.objects[o].comments[c].replies!==undefined) {
						for(var r=0;r<yoodoo.comments.objects[o].comments[c].replies.length;r++) {
							$(yoodoo.comments.objects[o].comments[c].replies[r].createdBlock).html(yoodoo.ago(yoodoo.comments.objects[o].comments[c].replies[r].updated_at));
						}
					}
					$(yoodoo.comments.objects[o].comments[c].createdBlock).html(yoodoo.ago(yoodoo.comments.objects[o].comments[c].updated_at));
				}
			}
			if (yoodoo.comments.updateTimeInterval===undefined) yoodoo.comments.updateTimeInterval=setInterval(yoodoo.comments.updateTimes,60000);
		}
	}
};

