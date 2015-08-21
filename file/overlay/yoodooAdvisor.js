
yoodoo.advisorPanel = {
	container : null,
	retainer : null,
	adviseeIndex : 0,
	advisees : [],
	content_id : 0,
	userLoading : null,
	show : function() {
		if (this.retainer !== null) {
			this.container = $(this.retainer).css({
				display : "block"
			}).find('#advisorPanel').get(0);
			yoodoo.display(this.retainer);
			this.container = $(yoodoo.frame).find('#advisorPanel').get(0);
		} else {
			var ins = '<div id="advisorRetained" class="yoodooBackground"><button type="button" onclick="yoodoo.advisorPanel.dispose()" class="green medium right">'+yoodoo.w('backtodashboard')+'</button><h2 style="margin:0px 0px 0px 10px;padding:20px 0px;display:inline-block;">'+yoodoo.w('advisorpanel')+'</h2><div style="clear:both" id="advisorPanel">';
			if (yoodoo.user.advisor) {
				ins += '<div class="advisees">'+yoodoo.w('fetchingyourusers')+'</div><div class="advisee"></div></div>';
			} else {
				ins += '<div class="advisee">'+yoodoo.w('fetchingyourdooits')+'</div></div>';
			}
			ins += '</div>';
			yoodoo.postDisplay = yoodoo.advisorPanel.setHeight;
			yoodoo.display(ins);
			this.retainer = $(yoodoo.frame).find('#advisorRetained').get(0);
			this.container = $(yoodoo.frame).find('#advisorPanel').get(0);
			//$(this.container).css({'height':yoodoo.option.height-30});
			if (yoodoo.user.advisor)
				this.adviseescontainer = $(this.container).find('.advisees');
			this.adviseecontainer = $(this.container).find('.advisee');
			if (yoodoo.user.advisor) {
				this.fetchAdvisees();
			} else {
				this.fetchAdvisee();
			}
		}
	},
	setHeight : function() {
		var dh = $(yoodoo.advisorPanel.container).offset().top - $(yoodoo.frame).offset().top;
		$(yoodoo.advisorPanel.container).animate({
			'height' : yoodoo.option.height - 20 - dh
		}, 500, function() {
			yoodoo.hidePlaya();
		});
	},
	fetchAdvisees : function() {
		yoodoo.actionLogging.add('fetchAdvisees', {});
		var params = {
			cmd : yoodoo.cmd.fetchAdvisees.server,
			callback : yoodoo.cmd.fetchAdvisees.callback
		};
		yoodoo.sendPost(null, params);
	},
	gotAdvisees : function(reply) {
		var adv = [];
		try {
			eval('adv=' + reply + ';');
		} catch (e) {
		}
		this.advisees = adv;
		this.advisees.sort(function(a, b) {
			return a.unread - b.unread;
		});
		this.renderAdvisees();
		if (this.advisees.length == 1)
			this.fetchAdvisee(this.advisees[0].userId);
	},
	fetchAdvisee : function() {
		var id = 0;
		if (arguments.length > 0)
			id = arguments[0];
		yoodoo.actionLogging.add('fetchAdvisee', {});
		var params = {
			userid : id,
			cmd : yoodoo.cmd.fetchAdvisee.server,
			callback : yoodoo.cmd.fetchAdvisee.callback
		};
		this.adviseecontainer.slideUp(500, function() {
			yoodoo.sendPost(null, params);
		});

	},
	gotAdvisee : function(reply) {
		reply = yoodoo.decodeHTMLResponse(reply);
		var adv = {};
		try {
			eval('adv=' + reply + ';');
		} catch (e) {
		}

		this.advisee = adv;
		this.advisee.sort(function(a, b) {
			return a.order - b.order;
		});
		this.renderContent();
		this.adviseecontainer.slideDown();
	},
	renderAdvisees : function() {
		var list = yoodoo.e("div");
		if (this.advisees.length > 10) {
			this.adviseescontainer.html(yoodoo.w('yourusers')+"&nbsp;");
			var sel = yoodoo.e("select");
			var adv = yoodoo.e("option");
			$(adv).html(yoodoo.w('selectauser')+' ');
			adv.value = -1;
			sel.appendChild(adv);
			for (var u = 0; u < this.advisees.length; u++) {
				adv = yoodoo.e("option");
				adv.value = u;
				adv.id = "userSelect" + this.advisees[u].userId;
				var title = this.advisees[u].firstName + " " + this.advisees[u].lastName;
				if (title == "" || title == " ")
					title = this.advisees[u].nickname;
				if (title == "" || title == " ")
					title = this.advisees[u].username;
				title = yoodoo.specialDecodeResponse(title);
				if (this.advisees[u].requests > 0)
					title += " [" + this.advisees[u].requests + " "+yoodoo.w('waiting')+"]";
				if (this.advisees[u].unread > 0)
					title += " [" + this.advisees[u].unread + " "+yoodoo.w('unread')+"]";
				$(adv).html(title);
				sel.appendChild(adv);
			}
			this.adviseescontainer.get(0).appendChild(sel);
			$(sel).bind("change", function() {
				yoodoo.advisorPanel.adviseeIndex = $(this).val();
				$(yoodoo.advisorPanel.userLoading).html(yoodoo.w('fetching')+" " + yoodoo.advisorPanel.advisees[yoodoo.advisorPanel.adviseeIndex].firstName + " " + yoodoo.advisorPanel.advisees[yoodoo.advisorPanel.adviseeIndex].lastName + '...').slideDown();
				yoodoo.advisorPanel.fetchAdvisee(yoodoo.advisorPanel.advisees[yoodoo.advisorPanel.adviseeIndex].userId);
			});
		} else {
			this.adviseescontainer.html("<div>"+yoodoo.w('yourusers')+"</div>");
			for (var u = 0; u < this.advisees.length; u++) {
				var adv = yoodoo.e("button");
				$(adv).attr("type", "button");
				adv.id = "userSelect" + this.advisees[u].userId;
				if (this.advisees.length != 1) {
					$(adv).bind("click", function() {
						if (!$(this).hasClass("deactive")) {
							yoodoo.advisorPanel.adviseeIndex = $(this).prevAll("button").get().length;
							$(yoodoo.advisorPanel.userLoading).html(yoodoo.w('fetching')+" " + yoodoo.specialDecodeResponse(yoodoo.advisorPanel.advisees[yoodoo.advisorPanel.adviseeIndex].firstName) + " " + yoodoo.specialDecodeResponse(yoodoo.advisorPanel.advisees[yoodoo.advisorPanel.adviseeIndex].lastName) + '...').slideDown();
							$(this).siblings('.deactive').animate({
								opacity : 1
							}).removeClass("deactive");
							$(this).animate({
								opacity : 0.3
							}).addClass("deactive");
							yoodoo.advisorPanel.fetchAdvisee(this.user.userId);
						}
					});
				}
				adv.user = this.advisees[u];
				var title = this.advisees[u].firstName + " " + this.advisees[u].lastName;
				if (title == "" || title == " ")
					title = this.advisees[u].nickname;
				if (title == "" || title == " ")
					title = this.advisees[u].username;
				title = yoodoo.specialDecodeResponse(title);
				if (this.advisees[u].requests > 0)
					title += " [" + this.advisees[u].requests + " "+yoodoo.w('waiting')+"]";
				if (this.advisees[u].unread > 0)
					title += " [" + this.advisees[u].unread + " "+yoodoo.w('unread')+"]";
				$(adv).html(title);
				this.adviseescontainer.get(0).appendChild(adv);
			}
		}
		this.userLoading = yoodoo.e("div");
		$(this.userLoading).addClass("loadingUser").css({
			display : "none"
		});
		this.adviseescontainer.get(0).appendChild(this.userLoading);
	},
	renderContent : function() {
		$(yoodoo.advisorPanel.userLoading).slideUp();
		var list = yoodoo.e("div");

		if (yoodoo.user.advisor) {
			var usertitle = this.advisees[this.adviseeIndex].firstName + " " + this.advisees[this.adviseeIndex].lastName;
			if (usertitle == "" || usertitle == " ")
				usertitle = this.advisees[this.adviseeIndex].nickname;
			if (usertitle == "" || usertitle == " ")
				usertitle = this.advisees[this.adviseeIndex].username;
			this.adviseecontainer.html("<h3>"+yoodoo.w('dooitsof')+" " + usertitle + "</h3>");
		} else {
			this.adviseecontainer.html("<h3>"+yoodoo.w('mydooits')+"</h3>");
		}
		for (var u = 0; u < this.advisee.length; u++) {
			if (!yoodoo.user.adviseeRestricted || yoodoo.inBookcase('dooit', this.advisee[u].content_id, true)) {

				var adv = yoodoo.e("div");
				adv.id = this.advisee[u].content_id;
				adv.content = this.advisee[u];
				//adv.unread=this.advisee[u].unread;
				var title = "";
				if (this.advisee[u].messages > 0) {
					title += "<nobr>" + this.advisee[u].messages + " "+yoodoo.w("message" + ((this.advisee[u].messages == 1) ? "" : "s"));
					if (this.advisee[u].unread > 0)
						title += " [" + this.advisee[u].unread + " "+yoodoo.w("unread")+"]";
					title += "</nobr>";
				}
				title += "<div><span>&nbsp;</span>" + yoodoo.specialDecodeResponse(this.advisee[u].content_name);

				if (this.advisee[u].user_completed && !this.advisee[u].completed) {
					title += " <em style='color:#f99' class='awaiting'>"+yoodoo.w("awaitingacceptance")+"</em>";
				}

				title += "</div>";
				$(adv).html(title).addClass("adviseeDooit").bind("click", function() {
					var open = $(this).hasClass("open");
					open = !open;
					if (open) {
						$(this).addClass("open");
					} else {
						$(this).removeClass("open");
					}
					var mes = $(this).next('.dooitMessages');
					mes.siblings(".dooitMessages").slideUp(500, function() {
						$(this).prev('.open').removeClass("open");
					});
					mes.get(0).content = this.content;
					if (open) {
						mes.html(yoodoo.w('fetchingmessages'));
						mes.slideDown(function() {
							yoodoo.advisorPanel.content_id = this.content.content_id;
							if (yoodoo.user.advisor) {
								yoodoo.advisorPanel.fetchMessages(yoodoo.advisorPanel.advisees[yoodoo.advisorPanel.adviseeIndex].userId, this.content.content_id);
							} else {
								yoodoo.advisorPanel.fetchMessages(0, this.content.content_id);
							}
						});
					} else {
						mes.slideUp();
					}
				});
				if (this.advisee[u].user_completed)
					$(adv).addClass("userCompleted");
				if (this.advisee[u].completed)
					$(adv).addClass("completed");
				if (this.advisee[u].unread > 0)
					$(adv).addClass("unread");
				var mes = yoodoo.e("div");
				$(mes).addClass("dooitMessages").css({
					display : "none"
				});
				this.adviseecontainer.get(0).appendChild(adv);
				this.adviseecontainer.get(0).appendChild(mes);
			}
		}
	},
	fetchMessages : function(userid, contentid) {
		yoodoo.actionLogging.add('fetchAdviseeMessages', {
			contentid : contentid
		});
		var params = {
			userid : userid,
			contentid : contentid,
			cmd : yoodoo.cmd.fetchAdviseeMessages.server,
			callback : yoodoo.cmd.fetchAdviseeMessages.callback
		};
		yoodoo.sendPost(null, params);
	},
	gotMessages : function(reply) {
		var adv = [];
		reply = yoodoo.decodeHTMLResponse(reply);
		try {
			eval('adv=' + reply + ';');
		} catch (e) {
		}
		for (var i = 0; i < adv.length; i++) {
			if (/^new Date/.test(adv[i].updated_at)) {
				var ago = '';
				try {
					eval('adv[' + i + '].updated_at=' + adv[i].updated_at + ';');
					adv[i].updated_at = new Date(adv[i].updated_at.getTime() + yoodoo.serverTimeOffset);
					adv[i].ago = yoodoo.ago(adv[i].updated_at);
				} catch (e) {
				}
			}
		}
		this.renderMessages(adv);
	},
	renderMessages : function(messages) {
		//if (messages.length>0) {
		var dooit = null;
		for (var i = 0; i < this.advisee.length; i++) {
			if (this.advisee[i].content_id == yoodoo.advisorPanel.content_id)
				dooit = this.advisee[i];
		}
		var heading = this.adviseecontainer.find('#' + yoodoo.advisorPanel.content_id);
		var txt = heading.find("nobr").html();
		if (txt !== null && txt !== undefined) {
			txt = txt.replace(/\[[^\]]+\]/, '');
			var nobr = heading.find("nobr");
			if (nobr) {
				nobr.get(0).parentNode.content.unread = 0;
				nobr.html(txt);
			}
		}
		var totalUnread = 0;
		var ad = $(this.adviseecontainer).find("adviseeDooit").get();
		for ( n = 0; n < ad.length; n++) {
			totalUnread += ad[n].content.unread;
		}
		this.adviseeIndex = parseInt(this.adviseeIndex);
		if (this.adviseeIndex + 1 > this.advisees.length) {

		} else {
			var selector = $("#userSelect" + this.advisees[this.adviseeIndex].userId);
			if (selector) {
				var txt = selector.html();
				if (/\[[^\]]*\]/.test(txt)) {
					if (totalUnread == 0) {
						txt = txt.replace(/\[[^\]]+\]/, '');
					} else {
						txt = txt.replace(/\[[^\]]+\]/, '[' + totalUnread + ' '+yoodoo.w("unread")+']');
					}
				} else if (totalUnread > 0) {
					txt += ' [' + totalUnread + ' '+yoodoo.w("unread")+']';
				}
				selector.html(txt);
			}
		}
		heading.removeClass("unread");
		var cont = heading.next(' .dooitMessages');
		if (cont.get().length > 0) {
			var ins = '<div>';
			ins += "<div class='advisorMessageHeader'>";
			if (yoodoo.user.advisor) {
				if (dooit.user_completed && !dooit.completed)
					ins += '<button type="button" onclick="yoodoo.advisorPanel.approveCompletion(this)">'+yoodoo.w('approvecompletion')+'</button>';
				if (dooit.user_completed || dooit.completed)
					ins += '<button type="button" onclick="yoodoo.advisorPanel.openDooit()">'+yoodoo.w('viewtheirdooit')+'</button>';
			}
			ins += yoodoo.words.capitalize(yoodoo.w('messages'))+':';
			if (messages.length == 0)
				ins += " <em>none</em>";
			ins += "</div>";
			for (var m = 0; m < messages.length; m++) {
				ins += '<div class="advisorMessage' + (messages[m].from_user ? " fromUser" : messages[m].from_me ? " fromMe" : "") + (messages[m].unread ? " "+yoodoo.w("unread") : "") + '">';
				var who = yoodoo.w('advisor');
				if (messages[m].from_user) {
					who = yoodoo.advisorPanel.advisees[yoodoo.advisorPanel.adviseeIndex].firstName + " " + yoodoo.advisorPanel.advisees[yoodoo.advisorPanel.adviseeIndex].lastName;
					if (who == ' ')
						who = yoodoo.advisorPanel.advisees[yoodoo.advisorPanel.adviseeIndex].nickname;
					if (who == ' ' || who == '')
						who = yoodoo.advisorPanel.advisees[yoodoo.advisorPanel.adviseeIndex].username;
				}
				if (messages[m].from_me)
					who = yoodoo.w('me');
				who = "<b>" + who + "</b>";
				if (messages[m].ago)
					who += " - <span>" + messages[m].ago + "</span>";
				ins += "<nobr>" + who + "</nobr>";
				var txt=yoodoo.specialDecodeResponse(messages[m].message);
				
				// -hidden- secret text -/hidden-
				
				if (yoodoo.user.advisor!==true) {
					txt=txt.replace(/\-hidden\-.*?\-\/hidden\-/gi,'');
				}else{
					txt=txt.replace(/\-hidden\-/gi,'').replace(/\-\/hidden\-/gi,'');
				}
				ins += "<div>" + txt + '</div></div>';
			}
			ins += '</div>';
			var ih = cont.height();
			cont.html(ins);
			var th = cont.height();
			cont.css({
				height : ih
			});
			cont.animate({
				height : th
			}, 500, function() {
				$(this).css({
					height : "auto"
				});
				yoodoo.advisorPanel.renderCommenter($(this));
			});
		}
		//}
	},
	renderCommenter : function(target) {
		var element = target.get(0);
		var com = yoodoo.e("div");
		$(com).css({
			display : "none"
		}).addClass("advisorCommenter").html(yoodoo.w('newmessage')+":");
		var ip = yoodoo.e("textarea");
		var send = yoodoo.e("button");
		$(send).attr("type", "button");
		com.appendChild(ip);
		com.appendChild(send);
		$(ip).bind("keydown", function(e) {
			var kc = yoodoo.keyCode(e);
			if (kc.enter) {
				var txt = $(this).val();
				txt = txt.replace(/^ +/, '').replace(/ +$/, '').replace(/[\n\r]+/, ' ');
				e.preventDefault();
				if (txt != "") {
					$(this).next("button").html(yoodoo.w('sending')+"...");
					var uid = 0;
					if (yoodoo.user.advisor)
						uid = yoodoo.advisorPanel.advisees[yoodoo.advisorPanel.adviseeIndex].userId;
					yoodoo.advisorPanel.send(uid, this.parentNode.parentNode.content.content_id, txt);
					$(this.parentNode).slideUp();
				}
			}
		});
		$(send).html(yoodoo.w("send")).bind("click", function() {
			var txt = $(this).prev("textarea").val();
			txt = txt.replace(/^ +/, '').replace(/ +$/, '').replace(/[\n\r]+/, ' ');
			if (txt != "") {
				$(this).unbind("click");
				$(this).html(yoodoo.w('sending')+"...");
				var uid = 0;
				if (yoodoo.user.advisor)
					uid = yoodoo.advisorPanel.advisees[yoodoo.advisorPanel.adviseeIndex].userId;
				yoodoo.advisorPanel.send(uid, this.parentNode.parentNode.content.content_id, txt);
				$(this.parentNode).slideUp();
			}
		});
		element.appendChild(com);
		$(com).slideDown();
	},
	send : function(userid, contentid, message) {
		yoodoo.actionLogging.add('sendAdviseeMessage', {
			userid : userid,
			contentid : contentid
		});
		var params = {
			userid : userid,
			contentid : contentid,
			message : message.replace('\\', '\\\\'),
			timestamp : new Date().getTime(),
			cmd : yoodoo.cmd.sendAdviseeMessage.server,
			callback : yoodoo.cmd.fetchAdviseeMessages.callback
		};
		yoodoo.sendPost(null, params);
	},
	approveCompletion : function(o) {
		$(o).attr("onclick", "");
		$(o).fadeOut();
		var userid = yoodoo.advisorPanel.advisees[yoodoo.advisorPanel.adviseeIndex].userId;
		var contentid = yoodoo.advisorPanel.content_id;
		yoodoo.actionLogging.add('approveCompletion', {
			userid : userid,
			contentid : contentid
		});
		var params = {
			userid : userid,
			contentid : contentid,
			cmd : yoodoo.cmd.approveCompletion.server,
			callback : yoodoo.cmd.approveCompletion.callback
		};
		yoodoo.sendPost(null, params);
	},
	approvedCompletion : function(reply) {
		this.adviseecontainer.find('#' + yoodoo.advisorPanel.content_id).removeClass("userCompleted").addClass("completed").find('.awaiting').fadeOut(500, function() {
			$(this).remove();
		});
	},
	openDooit : function() {
		$(this.retainer).css({
			display : "none"
		});
		document.body.appendChild(this.retainer);
		//this.retainer.appendChild(this.container);
		this.container = null;
		//this.adviseecontainer.find('#'+yoodoo.advisorPanel.content_id).removeClass("userCompleted").addClass("completed");
		this.hide();
		yoodoo.showUserDooit(yoodoo.advisorPanel.content_id, yoodoo.advisorPanel.advisees[yoodoo.advisorPanel.adviseeIndex].userId);
	},
	dispose : function() {
		var me=this.container;
		yoodoo.hide(function() {
			$(me).remove();
			yoodoo.advisorPanel.container = null;
			yoodoo.advisorPanel.retainer = null;
			yoodoo.refreshedDashboard();
		});
		/*yoodoo.hideAnimation(this.container,function(me) {
			$(me).remove();
			yoodoo.advisorPanel.container = null;
			yoodoo.advisorPanel.retainer = null;
			yoodoo.refreshedDashboard();
		});*/
		/*$(this.container).slideUp(500, function() {
			$(this).remove();
			yoodoo.advisorPanel.container = null;
			yoodoo.advisorPanel.retainer = null;
			yoodoo.refreshedDashboard();
			//yoodoo.hide();
		});*/
	},
	hide : function() {
		yoodoo.hide(this.container);
		//$(this.container).slideUp();
	}
};