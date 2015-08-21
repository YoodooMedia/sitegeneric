yoodoo.actionLogging = {
	add : function(type, p) {
		if (p.timestamp == undefined || p.timestamp === null)
			p.timestamp = new Date().getTime() + yoodoo.serverTimeOffset;
		p.type = type;
		yoodoo.actionLog.push(p);
		clearTimeout(yoodoo.idleLogout);
		if (!yoodoo.stayin)
			yoodoo.idleLogout = setTimeout('yoodoo.logout();', 14400000);
	},
	output : function() {
		var op = Base64.encode(dooit.json(yoodoo.actionLog));
		yoodoo.actionLog = [];
		return op;
	}
};
yoodoo.replaceMeta = function(content) {

	// replaces any user meta into the string or another string if the meta does not exist
	// e.g. <[user_meta_key|blank_replacement_text]>

	content = content.replace(/\__(.+?)__/g, function(m, f) {
		var parts = f.split("|");
		if (yoodoo.user.meta[parts[0]] !== undefined && yoodoo.user.meta[parts[0]] != '') {
			return yoodoo.user.meta[parts[0]].replace(/\"/g, "&dq;").replace(/\'/g, "&sq;").replace(/\</g, "&lt;").replace(/\n/g, '<br />');
		} else if (parts.length > 1) {
			return parts[1].replace(/\'/g, "&sq;").replace(/\"/g, "&dq;").replace(/\</g, "&lt;").replace(/\n/g, '<br />');
		} else {
			return '';
		}
	});
	return content;
};
yoodoo.replaceResourceUrl = function(content) {
	//if (this.option.resourceUrl!="") {
	//content=content.replace(/http\:\/\/[^\/]+\.yoodidit\.co\.uk\/ui/g,this.option.resourceUrl+'ui');

	//content=content.replace(/http\:\/\/[^\/]+\/uploads\/episodes/g,this.option.resourceUrl+'uploads/episodes');
	//}
	return content;
};
yoodoo.scrollTo = function(obj) {
	var t = ($(obj).position().top - $('.dooitBox').position().top) - 100;
	$('#yoodooScrolledArea').animate({
		scrollTop : t
	});
};
yoodoo.dooitFiles = null;
yoodoo.showingForgot = false;
yoodoo.showFullLoginForm = function() {
	if ($('.password').css("display") == "none") {
		yoodoo.showingForgot = false;
		$('.password').slideDown().next().slideDown();
		$('.forgotten>a').slideDown();
		$('.forgotten>div').slideUp();
	}
};
yoodoo.tryLogin = function() {
	var un = $(yoodoo.frame).find('.login input:first').val();
	if (yoodoo.showingForgot) {
		if (un != "") {
			yoodoo.actionLogging.add('Reset password', {
				id : un
			});
			var params = {
				cmd : yoodoo.cmd.forgotpassword.server,
				username : escape(un),
				callback : 'yoodoo.' + yoodoo.cmd.forgotpassword.callback
			};
			yoodoo.sendPost(null, params);

		}
	} else {
		var pw = $(yoodoo.frame).find('.login input[type=password]').val();
		pw = pw.replace(/[^a-z^0-9]/gi, '');
		if (un == '' || pw == '') {
			var err = $(yoodoo.frame).find('.login .error');
			err.html(yoodoo.w('needbothdetails'));
			err.slideDown(yoodoo.animateDuration);
			err.fadeIn(yoodoo.animateDuration);
			yoodoo.timer = setTimeout('yoodoo.hideError();', 3000);
		} else {
			//yoodoo.stayin=$(yoodoo.frame).find('#stayin').val()=="on";
			yoodoo.login(un, pw);
		}
	}
};
yoodoo.forgotReply = function(reply) {
	if (reply == "Success") {
		yoodoo.actionLogging.add('Login error', {});
		var err = $(yoodoo.frame).find('.login .error');
		err.html(yoodoo.w('newpasswordemailed'));
		err.fadeIn(yoodoo.animationDuration);
		yoodoo.timer = setTimeout('yoodoo.hideError();', 8000);
		yoodoo.showFullLoginForm();
	} else {
		if (reply == "")
			reply = yoodoo.w('issueapology');
		yoodoo.actionLogging.add('Login error', {});
		var err = $(yoodoo.frame).find('.login .error');
		err.html(reply);
		err.fadeIn(yoodoo.animationDuration);
		yoodoo.timer = setTimeout('yoodoo.hideError();', 3000);

	}
};
yoodoo.getAverageScore = function() {
	if (yoodoo.bookcaseLoaded) {
		var as = yoodoo.bookcase.averageScore();
		if (as > 0) {
			$('#averageScoreDiv').html('Average quiz score: <b>' + as.toFixed(1) + '%</b>').css({
				display : "block"
			});
		} else {
			$('#averageScoreDiv').css({
				display : "block"
			});
		}
	} else {
		$('#averageScoreDiv').css({
			display : "none"
		});
	}
};
yoodoo.loseBubble = function() {
	$('.advisorBubble').fadeOut(3000, function() {
		$(this).remove();
	});
};
yoodoo.switchVersion = function() {
	this.html5 = !this.html5;
	this.restart();
};

yoodoo.welcomeContainers = {};
yoodoo.toggleWelcomeTab = function(src) {
	if (yoodoo.first_login && !yoodoo.password_updated)
		return false;
	if (!$(src).hasClass("on")) {
		$(yoodoo.welcomeContainers.tabcontent[$(src.parentNode).find("button.on").removeClass("on").prevAll('button.tabSelector').get().length]).slideUp(500);
		$(yoodoo.welcomeContainers.tabcontent[$(src).addClass("on").prevAll('.tab.tabSelector').get().length]).slideDown(500);
	}
};
yoodoo.welcomeOpen = false;
yoodoo.closeWelcome = function() {
	this.welcomeOpen = false;
	this.hide(function() {
		$(yoodoo.welcomeContainers.frame).remove();
	});
};
yoodoo.welcome = function() {
	this.welcomeOpen = true;
	var w = this.option.width - 40;
	var h = this.option.height - 40;
	var tabs = [yoodoo.w('mydetails'), yoodoo.w('mypassword'), yoodoo.w('mydashboard')];
	var defaultTab = 2;
	if (!yoodoo.password_updated)
		defaultTab = 1;
	yoodoo.welcomeContainers.tabcontent = [];
	for (var t = 0; t < tabs.length; t++) {
		yoodoo.welcomeContainers.tabcontent.push(yoodoo.e("div"));
	}
	var err = yoodoo.e("div");
	$(err).addClass("error").css({
		display : 'none'
	});
	var messenger = yoodoo.e("div");
	$(messenger).addClass("messenger").css({
		display : 'none'
	});

	yoodoo.welcomeContainers.frame = yoodoo.e("div");
	$(yoodoo.welcomeContainers.frame).append(err).append(messenger).addClass('yoodooBackground');
	yoodoo.welcomeContainers.content = yoodoo.e("div");
	yoodoo.welcomeContainers.tabarea = yoodoo.e("div");
	$(yoodoo.welcomeContainers.tabarea).css({
		position : 'relative'
	});
	if (this.first_login == 'true' || this.first_login === true)
		this.first_login = true;
	var ins = '<div class="yoodoo-title">' + this.replaceDomain(this.site.welcome_title) + '</div><h2 class="clear">' + ((this.home_screen_title=='')?'&nbsp;':this.home_screen_title) + '</h2><center class="clear"><button type="button" id="continue" class="onlyContinue green reversed" onclick="yoodoo.closeWelcome();">'+yoodoo.w('continue')+'</button>';
	if (!yoodoo.bookcaseLoaded)
		ins += '<div id="xmlwaiting">'+yoodoo.w('loadingpleasewait')+'</div>';
	ins += '</center>';
	var logout = yoodoo.e("button");
	$(logout).attr("type", "button").addClass("logout medium right").html(yoodoo.w('logout')).bind("click", function() {
		yoodoo.logout();
	});

	$(yoodoo.welcomeContainers.content).css({
		width : w,
		height : h
	}).addClass('dashboardLogo').html(ins).append(yoodoo.welcomeContainers.tabarea);

	if (this.user.advisorAcceptance && (this.user.advisor || this.user.advised)) {
		var bt = yoodoo.w('openadvisorpanel');
		var tt = [];
		var butins = '';
		if (this.user.advisor && (this.user.adviseeUnread > 0 || this.user.adviseeRequests > 0)) {
			butins = '';
			if (this.user.adviseeUnread > 0)
				butins += ' [' + this.user.adviseeUnread + ']';
			if (this.user.adviseeRequests > 0)
				butins += ' <b>[' + this.user.adviseeRequests + ']</b>';
			if (this.user.adviseeUnread > 0)
				tt.push(yoodoo.w('youhave') + this.user.adviseeUnread + yoodoo.w("message" + (this.user.adviseeUnread == 1 ? "" : "s") + "fromyourusers")+".");
			if (this.user.adviseeRequests > 0)
				tt.push(yoodoo.w('youhave') + this.user.adviseeRequests + " "+yoodoo.w('dooit' + (this.user.adviseeRequests == 1 ? "" : "s")) + yoodoo.w('requiringyouracceptance')+".");
		} else if (this.user.advised && this.user.advisorUnread > 0) {
			butins = ' [' + this.user.advisorUnread + ']';
			tt.push(yoodoo.w('youhave') +this.user.advisorUnread + yoodoo.w('message' + (this.user.advisorUnread == 1 ? "" : "s") + 'fromyouradvisor')+'.');
		}
		var bubble = '';
		if (tt.length > 0) {
			bt = tt.join('\n');
			bubble = "<div class='advisorBubble'><div>" + tt.join("<br />") + "<div class='spike'></div></div></div>";
			setTimeout('yoodoo.loseBubble();', 5000);
		}
		var adBut = yoodoo.e("button");
		$(adBut).html(yoodoo.w('advisorpanel') + butins + bubble).addClass('green medium right advisorButton').css({
			position : 'relative',
			display : (yoodoo.password_updated ? 'inline-block' : 'none')
		}).bind("click", function() {
			yoodoo.hide(yoodoo.advisorPanelShow);
		});
		adBut.id = 'advisorButton';
		adBut.title = bt;
		$(yoodoo.welcomeContainers.content).prepend(adBut);
	}
	$(yoodoo.welcomeContainers.content).prepend(logout);

	yoodoo.clearTransition(yoodoo.container);

	$(yoodoo.welcomeContainers.frame).addClass("welcome").css({
		width : w,
		height : h,
		visibility : 'hidden'
	}).append(yoodoo.welcomeContainers.content);
	
	$(yoodoo.container).empty().append(yoodoo.welcomeContainers.frame).css({
		visibility : 'hidden',
		display : 'block'
	});
	
	yoodoo.welcomeContainers.topPanel = yoodoo.e("div");
	$(yoodoo.welcomeContainers.topPanel).css({
		clear : "both"
	});
	yoodoo.welcomeContainers.bottomPanel = yoodoo.e("div");
	yoodoo.welcomeContainers.bottomPanelContainer = yoodoo.e("div");
	$(yoodoo.welcomeContainers.bottomPanelContainer).css({
		clear : "both",
		position : 'relative'
	}).append(yoodoo.welcomeContainers.bottomPanel);
	$(yoodoo.welcomeContainers.tabcontent[2]).append(yoodoo.welcomeContainers.topPanel).append(yoodoo.welcomeContainers.bottomPanelContainer);
	//alert("Pause");
	var availableHeight = Math.floor((h - ($(yoodoo.welcomeContainers.tabarea).offset().top - $(yoodoo.welcomeContainers.content).offset().top)));
	//alert(availableHeight);
	var panelHeight = Math.floor((availableHeight / 2) - 5);
	for (var t = 0; t < tabs.length; t++) {
		$(yoodoo.welcomeContainers.tabcontent[t]).addClass('tabcontent').css({
			margin : '0px -20px',
			height : availableHeight,
			display : ((defaultTab == t) ? 'block' : 'none')
		});
		$(yoodoo.welcomeContainers.tabarea).append(yoodoo.welcomeContainers.tabcontent[t]);
	}
	/*if (!(yoodoo.bookcaseLoaded && yoodoo.bookcase.display_continue()))
	 $(yoodoo.welcomeContainers.content).find('button#continue').css({
	 visibility : 'visible',
	 display : 'none'
	 });*/
	$(yoodoo.welcomeContainers.topPanel).css({
		height : panelHeight
	});
	$(yoodoo.welcomeContainers.bottomPanel).css({
		height : panelHeight,
		overflow : 'hidden'
	});
	$(yoodoo.welcomeContainers.frame).css({
		visibility : "visible"
	});
	var center = $(yoodoo.welcomeContainers.content).find(">center");
	$(yoodoo.welcomeContainers.content).append(center);

	$(yoodoo.welcomeContainers.topPanel).css({
		width : this.option.width,
		margin : '5px 0px'
	}).addClass('yd_overlay');
	$(yoodoo.welcomeContainers.bottomPanel).css({
		width : this.option.width,
		margin : '5px 0px'
	}).addClass('yd_overlay');

	// draw progress and warnings

	yoodoo.welcomeContainers.tabs = yoodoo.e("div");
	$(yoodoo.welcomeContainers.tabs).addClass("tabs");
	
	if (this.user.groups===true) {
		var tb = yoodoo.e("button");
		$(tb).attr("type", "button").html(yoodoo.w('mygroups')).addClass('tab');
		$(tb).bind("click", function() {
			yoodoo.groups.manage();
		});
		$(yoodoo.welcomeContainers.tabs).append(tb);
	}
		
	for (var t = 0; t < tabs.length; t++) {
		var tb = yoodoo.e("button");
		$(tb).attr("type", "button").html(tabs[t]).addClass('tabSelector tab' + ((defaultTab == t) ? ' on' : ''));
		$(tb).bind("click", function() {
			yoodoo.toggleWelcomeTab(this);
		});
		$(yoodoo.welcomeContainers.tabs).append(tb);
	}
	yoodoo.welcomeContainers.anchorWidget = yoodoo.e("div");
	$(yoodoo.welcomeContainers.anchorWidget).css({
		width : 0,
		height : panelHeight,
		float : 'left'
	});
	$(yoodoo.welcomeContainers.tabarea).append(yoodoo.welcomeContainers.tabs);
	$(yoodoo.welcomeContainers.topPanel).append(yoodoo.welcomeContainers.anchorWidget);

	yoodoo.welcomeContainers.notices = yoodoo.e("div");
	//yoodoo.user.unreadComments=Math.round(10*Math.random());
	if (yoodoo.user.unreadComments > 0) {
		var idx = -1;
		for (var n = this.notices.length - 1; n >= 0; n--) {
			if (this.notices[n].type !== undefined && this.notices[n].type === 'unreadcomment') {
				this.notices.splice(n, 1);
			}
		}
		this.notices.unshift({
			type : 'unreadcomment',
			warning : false,
			width : 100,
			background : '#fff',
			content : '<div style="text-align:center;padding:10px 0px 0px 0px;"><div class="commentIconOnly" onclick="yoodoo.comments.show()">' + yoodoo.comments.unreadButtonProcess() + '</div>'+yoodoo.w('comments')+'</div>'
		});
	}
	var o = '';
	if ( typeof (this.notices) == "object" && this.notices.length > 0) {
		var nw = Math.floor(this.option.width / 4);
		if (nw < panelHeight - 2)
			nw = (panelHeight - 2);
		for (var n = 0; n < this.notices.length; n++) {
			var w = nw;
			if (this.notices[n].width > 0)
				w = this.notices[n].width;
			o += "<div class='" + (this.notices[n].warning ? "warningNotice" : "Notice") + "' style='width:" + w + "px;height:" + (panelHeight - 2) + "px;'><div style='";
			if (this.notices[n].background !== undefined)
				o += "background:" + this.notices[n].background + ";";
			o += "height:" + (panelHeight - 22) + "px;padding:5px;' class='scrollStyle'>" + this.notices[n].content + "</div></div>";
		}
		o = '<div class="noticesContainer">' + o + '</div>';
	} else {
		o += "<div class='tipContent' style='height:" + panelHeight + "px;'>" + this.home_left_text + "</div>";
	}
	$(yoodoo.welcomeContainers.notices).css({
		width : '100%',
		height : panelHeight,
		float : 'left'
	}).html('<div class="tipContainer" style="height:' + panelHeight + 'px;">' + o + '</div>');
	$(yoodoo.welcomeContainers.topPanel).append(yoodoo.welcomeContainers.notices);
	var tw = 0;
	$(yoodoo.welcomeContainers.notices).find('.noticesContainer').find('>div').each(function(i, e) {
		tw += $(e).outerWidth(true);
	});
	$(yoodoo.welcomeContainers.notices).find('.noticesContainer').css({
		width : tw
	});
	if ( typeof (this.notices) == "object" && this.notices.length > 0) {
		this.initSlider($(yoodoo.welcomeContainers.notices).find('.tipContainer').get(0), $(yoodoo.welcomeContainers.notices).find('.noticesContainer').get(0), {
			horizontal : true
		});
	}

	/* details */

	yoodoo.user.oldusername = yoodoo.user.username;
	var ips = [{
		label : yoodoo.w('emailaddress'),
		ref : 'emailaddress',
		length : 100,
		mobileType : 'email'
	}, {
		label : yoodoo.w('firstname'),
		ref : 'firstname',
		length : 20,
		keyup : function() {
			if (yoodoo.user.nickname == '')
				$(yoodoo.frame).find("input#nickname").val($(yoodoo.frame).find("input#firstname").val() + " " + $(yoodoo.frame).find("input#lastname").val());
		}
	}, {
		label : yoodoo.w('lastname'),
		ref : 'lastname',
		length : 20,
		keyup : function() {
			if (yoodoo.user.nickname == '')
				$(yoodoo.frame).find("input#nickname").val($(yoodoo.frame).find("input#firstname").val() + " " + $(yoodoo.frame).find("input#lastname").val());
		}
	}, {
		label : yoodoo.w('username').toLowerCase(),
		ref : 'username',
		length : 128,
		keydown : function(e) {
			var kc = yoodoo.keyCode(e);
			if (!kc.alpha && !kc.numeric && !kc.dash && !kc.navigate) {
				e.preventDefault();
				return false;
			}
		}
	}, {
		label : yoodoo.w('nickname'),
		ref : 'nickname',
		length : 255
	}];
	var details = yoodoo.e("div");
	var changed = false;
	if (yoodoo.user.nickname == '' && yoodoo.user.firstname != '') {
		yoodoo.user.nickname = yoodoo.user.firstname + " " + yoodoo.user.lastname;
		changed = true;
	}
	for (var i = 0; i < ips.length; i++) {
		var row = yoodoo.e("div");
		$(row).addClass("clear inputline");
		var label = yoodoo.e('label');
		$(row).append($(label).html(ips[i].label));
		var input = yoodoo.e('input');
		if (yoodoo.mobile && ips[i].mobileType !== undefined) {
			$(input).attr("type", ips[i].mobileType);
		} else {
			$(input).attr("type", 'text');
		}
		input.id = input.ref = ips[i].ref;
		var v = yoodoo.user[ips[i].ref];
		if (ips[i].keypress !== undefined)
			$(input).bind("keypress", ips[i].keypress);
		if (ips[i].keydown !== undefined)
			$(input).bind("keydown", ips[i].keydown);
		if (ips[i].keyup !== undefined)
			$(input).bind("keyup", ips[i].keyup);
		$(input).bind("keyup", function() {
			var nv = $(this).val();
			var ov = yoodoo.user[this.ref];
			if (ov != nv) {
				yoodoo.user[this.ref] = nv;
				$(this.parentNode.parentNode).find("button").slideDown();
			}
		});
		$(row).append($(input).attr("maxlength", ips[i].length).val(v));
		$(details).append(row);
	}
	var but = yoodoo.e("button");
	$(but).attr("type", "button").addClass("green").css({
		'margin-left' : '250px',
		display : changed ? 'block' : 'none'
	}).html("change");
	$(details).append(but);

	$(but).bind("click", function() {
		if ($(this).html() == "change") {
			var valid = /^[a-z0-9]{1,}/i.test(yoodoo.user.username);
			if (!valid) {
				var err = $(yoodoo.frame).find('.welcome .error');
				err.html(yoodoo.w('emptyusername'));
				err.fadeIn(yoodoo.animateDuration);
				yoodoo.timer = setTimeout('yoodoo.hideError();', 3000);
			} else {
				$(this).html(yoodoo.w('changing')+"...");
				yoodoo.changeDetails(yoodoo.user.firstname, yoodoo.user.lastname, yoodoo.user.username, yoodoo.user.emailaddress, yoodoo.user.nickname);
			}
		}
	});

	$(yoodoo.welcomeContainers.tabcontent[0]).append(details).addClass(this.class_prefix + '_overlay');

	/* password */

	var password = yoodoo.e("div");

	if (!yoodoo.password_updated)
		$(password).html('<div class="alert">'+yoodoo.w('changepasswordwarning')+'</div>');
	var op = yoodoo.e('div');
	$(op).addClass("clear inputline").html('<label>'+yoodoo.w('yourcurrentpassword')+'</label><input type="password" id="oldpassword" maxlength="20" />');
	var np = yoodoo.e('div');
	$(np).addClass("clear inputline").html('<label>'+yoodoo.w('yournewpassword')+'</label><input type="password" id="newpassword" maxlength="20" />');
	var npa = yoodoo.e('div');
	$(npa).addClass("clear inputline").html('<label>'+yoodoo.w('confirmpassword')+'</label><input type="password" id="newpasswordagain" maxlength="20" />');
	var but = yoodoo.e("button");
	$(but).attr("type", "button").addClass("green").css({
		'margin-left' : '250px',
		display : 'none'
	}).html(yoodoo.w('change'));
	$(password).append(op).append(np).append(npa).append(but);
	$(password).find('input[type=password]').bind('keyup', function(e) {
		if (/[^a-z^0-9]/i.test(this.value))
			this.value = this.value.replace(/[^a-z^0-9]/gi, '');
	});
	$(yoodoo.welcomeContainers.tabcontent[1]).append(password).addClass(this.class_prefix + '_overlay');
	$(but).bind("click", function() {
		if ($(this).html() == "change") {
			// var em = $(yoodoo.frame).find('#emailaddress').val();
			var opw = $(yoodoo.welcomeContainers.tabcontent[1]).find('#oldpassword').val();
			var npw = $(yoodoo.welcomeContainers.tabcontent[1]).find('#newpassword').val();
			var npwc = $(yoodoo.welcomeContainers.tabcontent[1]).find('#newpasswordagain').val();
			var valid = /^[a-z0-9]{6,}/i.test(npw);
			if (!valid || npw != npwc || opw == '') {
				var err = $(yoodoo.frame).find('.welcome .error');
				if (npw != npwc) {
					err.html(yoodoo.w('passwordnotmatch'));
				} else {
					err.html(yoodoo.w('passwordlength'));
				}
				err.fadeIn(yoodoo.animateDuration);
				yoodoo.timer = setTimeout('yoodoo.hideError();', 3000);
			} else {
				$(this).html("changing...");
				yoodoo.changePassword(yoodoo.username, opw, npw);
				$(yoodoo.welcomeContainers.tabcontent[1]).find("input").val('');
			}
		}
	});
	$(yoodoo.welcomeContainers.tabcontent[1]).find("input").bind('keyup', function() {
		var opw = $(yoodoo.welcomeContainers.tabcontent[1]).find('#oldpassword').val();
		var npw = $(yoodoo.welcomeContainers.tabcontent[1]).find('#newpassword').val();
		var npwc = $(yoodoo.welcomeContainers.tabcontent[1]).find('#newpasswordagain').val();
		if (npw == npwc && npw != "" && opw != "") {
			$(yoodoo.welcomeContainers.tabcontent[1]).find("button").slideDown();
		} else {
			$(yoodoo.welcomeContainers.tabcontent[1]).find("button").slideUp();
		}
	});

	if (yoodoo.option.introMovie.flashvars.intro != '') {
		var footer = yoodoo.e("div");
		$(footer).addClass("footerLinks").html('<a href="javascript:void(0)" class="" onclick="yoodoo.showIntro(true)">'+yoodoo.w('showintro')+'</a>');
		$(yoodoo.welcomeContainers.content).append(footer);
	}
	$(yoodoo.container).css({
		visibility : 'visible',
		display : 'none'
	});
	yoodoo.revealAnimation($(yoodoo.container).css({
		visibility : 'visible'
	}), function() {
		if (yoodoo.bookcaseLoaded)
			yoodoo.bookcase.fetchWidgets();
	});
	/*$(yoodoo.container).css({
	 visibility : 'visible',
	 display : 'none'
	 }).slideDown(500, function() {
	 if (yoodoo.bookcaseLoaded)
	 yoodoo.bookcase.fetchWidgets();
	 });*/
};
yoodoo.noticeScroller = function() {
	var tips = $(this.frame).find('.welcomeContent .tip').get();
	if (tips.length == 1) {
		var scrollArea = $(tips).find(".noticeContainer");
		var scrollContainer = $(scrollArea).find(">div");
		var scrollBar = $(tips).find(".noticeScroller");
		if (scrollContainer.outerHeight(false) > scrollArea.height()) {
			var scrollButton = yoodoo.e("div");
			scrollButton.proportion = scrollArea.height() / scrollContainer.outerHeight(false);
			scrollButton.overallheight = scrollBar.height();
			var h = Math.floor(scrollButton.overallheight * scrollButton.proportion);
			scrollButton.space = scrollButton.overallheight - h;
			scrollButton.target = scrollArea;
			scrollButton.maxscroll = scrollArea.height() - scrollContainer.outerHeight(false);
			$(scrollButton).addClass("scrollButton").css({
				height : h
			});
			scrollBar.get(0).appendChild(scrollButton);
			$(scrollButton).bind("mousedown", function(e) {
				e.preventDefault();
				$(this).addClass("scrolling");
				this.offsetY = e.pageY;
				this.initialTop = parseInt($(this).css("top").replace(/px/, ""));
				yoodoo.noticeScrollerObject = this;
				$(document).bind("mousemove", noticeScroll = function(e) {
					var t = yoodoo.noticeScrollerObject.initialTop + e.pageY - yoodoo.noticeScrollerObject.offsetY;
					if (t < 0)
						t = 0;
					if (t > yoodoo.noticeScrollerObject.space)
						t = yoodoo.noticeScrollerObject.space;
					var st = yoodoo.noticeScrollerObject.maxscroll * (t / yoodoo.noticeScrollerObject.space);
					yoodoo.noticeScrollerObject.target.get(0).scrollTop = -st;
					$(yoodoo.noticeScrollerObject).css({
						top : t
					});
				});
				$(document).bind("mouseleave mouseup", docmouse = function(e) {
					$(yoodoo.noticeScrollerObject).removeClass("scrolling");
					$(document).unbind("mouseleave mouseup", docmouse);
					$(document).unbind("mousemove", noticeScroll);
				});
			});
		}
	}
};
yoodoo.hideError = function() {
	$(this.frame).find('.error').animate({
		opacity : 0,
		height : 0
	}, 500, function() {
		$(this).css({
			display : 'none',
			height : 'auto',
			opacity : 1
		});
	});
};
yoodoo.dooit_standardize=function(obj) {
	if (typeof(obj)=='undefined') obj={};
		var standard={
			containers:{},
			value: null,
			key: null,
			globalkey: null,
			outFields:{},
			fields: {},
			schema: {},
			words:{
				sample_key:{en:'Sample key in English',es:'Sample key in Spanish',fr:'Sample key in Spanish'}
			},
			init: function() {
				this.loadFields();
				this.containers.container = (yoodoo.dooit!==undefined)?yoodoo.dooit.arena:$('.dooitDisplay');
				if (this.containers.container !== undefined && this.containers.container !== null) {
					if (typeof(infoSchema) != "undefined") this.schema = infoSchema;
					if (typeof(this.schema.words)=="object" && this.schema.words!==null) yoodoo.words.setOverrides(this.schema.words);
					this.start();
				}
			},
			start: function() {},
			displayed: function() {
				if (yoodoo.ui!==undefined && yoodoo.ui.update!==undefined) yoodoo.ui.update();
				if (yoodoo.metaphor<2) {
					$(this.containers.container).css({
						height: $('#yoodooScrolledArea').height() - 8,
						'box-sizing':'border-box',
						border:'none'
					});
				}
				if (this.schema!==undefined && typeof(this.schema.ondisplay)=='function') this.schema.ondisplay.apply(this,[]);
			},
			loadFields: function() {
				/*if (this.words!==undefined) {
					for(var k in this.words) {
						yoodoo.words.data[k]=this.words[k];
					}
				}*/
				yoodoo.words.setOverrides(this.words);
				if (yoodoo.dooit!==undefined) {
					if (this.globalkey === null && yoodoo.dooit.params.global_fields.length>0) this.globalkey = yoodoo.dooit.params.global_fields[0];
					if (this.globalkey !== null) this.schema=yoodoo.dooit.params.fields[this.globalkey][1];
					if (yoodoo.dooit.params.default_fields.length>1) {
						for(var i=0;i<yoodoo.dooit.params.default_fields.length;i++) {
							var k=yoodoo.dooit.params.default_fields[i];
							if (k!=this.globalkey) {
								this.fields[k]=yoodoo.dooit.params.fields[k][1];
								this.outFields[k]=true;
							}
						}
					}else{
						if (this.key === null && yoodoo.dooit.params.default_fields.length>0) this.key = yoodoo.dooit.params.default_fields[0];
						if (this.key !== null) this.value=yoodoo.dooit.params.fields[this.key][1];
					}
					for(var k in yoodoo.dooit.params.fields) {
						if (k!=this.key && k!=this.globalkey && this.outFields[k]!==true) {
							this.fields[k]=yoodoo.dooit.params.fields[k][1];
							this.outFields[k]=false;
						}
					}
				}else{
					if (this.globalkey === null && array_of_global_fields.length>0) this.globalkey = array_of_global_fields[0];
					if (this.globalkey !== null)  try{eval('ui_questions.schema='+array_of_fields[this.globalkey][1]+';');}catch(e){
						yoodoo.errorLog(e);
					};
					if (array_of_default_fields.length>1) {
						for(var i=0;i<array_of_default_fields.length;i++) {
							var k=array_of_default_fields[i];
							if (k!=this.globalkey) {
								var tmp='';
								try{
									eval('tmp='+array_of_fields[k][1]+';');
								}catch(e){
									yoodoo.errorLog(e);
									tmp=array_of_fields[k][1];
								};
								this.fields[k]=tmp;
								this.outFields[k]=true;
							}
						}
					}else{
						if (this.key === null && array_of_default_fields.length>0) this.key = array_of_default_fields[0];
						if (this.key !== null) try{eval('ui_questions.value='+array_of_fields[this.key][1]+';');}catch(e){yoodoo.errorLog(e);ui_questions.value=array_of_fields[this.key][1];};
					}
					for(var k in array_of_fields) {
						if (k!=this.key && k!=this.globalkey && this.outFields[k]!==true) {
							var tmp='';
							try{
								eval('tmp='+array_of_fields[k][1]+';');
							}catch(e){
								yoodoo.errorLog(e);
								tmp=array_of_fields[k][1];
							};
							this.fields[k]=tmp;
							this.outFields[k]=false;
						}
					}
				}
			},
			finishable: function() {
				var require=$(this.containers.container).find('.stillRequired').get().length>0;
				return {
					canSave:true,
					canComplete:!require,
					hilite:true
				};
			},
			output: function() {
				var reply = {};
				if (this.key!==null) {
					if (yoodoo.dooit!==undefined) {
						reply['EF'+yoodoo.dooit.params.fields[this.key][0]]=yoodoo.json.encode(this.value);
					}else{
						reply['EF'+array_of_fields[this.key][0]]=dooit.json(this.value);
					}
				}
					for(var f in this.outFields) {
						if (this.outFields[f]===true) {
							if (yoodoo.dooit!==undefined) {
								reply['EF'+yoodoo.dooit.params.fields[f][0]]=(typeof(this.fields[f])=='object')?yoodoo.json.encode(this.fields[f]):this.fields[f];
							}else{
								reply['EF'+array_of_fields[f][0]]=(typeof(this.fields[f])=='object')?dooit.json(this.fields[f]):this.fields[f];
							}
						}
					}
				
				return reply;
			}
		};
		for(var k in standard) {
			if (obj[k]===undefined) obj[k]=standard[k];
		}
		return obj;
	};
yoodoo.working = function(on) {
	var txt = '';
	if (arguments.length > 1)
		txt = arguments[1];
	if (on)
		$(this.wait).empty().append(
			$(yoodoo.e("div")).html(txt).append(
				$(yoodoo.e("div")).addClass("loading")
			)
		);
	if (on && $(this.wait).css('display') == 'none') {
		if (this.canHTML) {
			$(this.wait).stop().css({
				opacity : 0,
				scale : 0.8
			}).show().transition({
				opacity : 1,
				scale : 1
			}, 500, 'snap');
		} else {
			$(this.wait).stop().fadeIn(200);
		}
	} else if (!on && $(this.wait).css('display') != 'none') {
		if (this.canHTML) {
			$(this.wait).stop().transition({
				opacity : 0,
				scale : 0.9
			}, 500, 'snap', function() {
				$(this).hide();
			});
		} else {
			$(this.wait).stop().fadeOut(200);
		}
	}
	//$(this.wait).css('display', on ? 'block' : 'none');
	if (!on && this.container !== null && $(this.container).css("display") == "block")
		this.clearFocus();
	//if (!on) alert("Clear");
	//if (!on) this.clearFocus();
};
yoodoo.clearFocus = function() {
	if (yoodoo.option.flashMovie!==undefined && yoodoo.option.flashMovie.loaded) {
		window.focus();
		var f = swfobject.getObjectById(yoodoo.option.flashMovie.id);
		if (f) {
			f.tabIndex = 0;
			//$(f).css("visibility","visible");
			f.focus();
		}
	}
};
yoodoo.sendingU = null;
yoodoo.sendingF = null;
yoodoo.sendingFr = null;
yoodoo.pause = false;
yoodoo.postBuffer = [];
yoodoo.sendingPost = false;
/*yoodoo.sendPost = function(u, f) {
	if (!yoodoo.sendingPost) {
		if (f.cmd !== undefined)
			yoodoo.debuggerz.sendpost(f.cmd);
		if (yoodoo.debuggerz.getAllItems)
			f.getAllItems = 1;
		var otherData = true;
		if (arguments.length > 3)
			otherData = arguments[3];
		yoodoo.sendingPost = true;
		this.pause = false;
		f.userhash = this.loginCode;
		f.sitehash = this.sitehash;
		if (otherData) {
			var meta = this.changed_meta();
			f['record_metas'] = 1;
			for (var k in meta)
			f['meta_' + k] = meta[k];
			var ut = this.changed_users_totals();
			for (var k in ut)
			f['usersTotals_' + k] = ut[k];
		}
		if (this.serverTimeOffset !== undefined)
			f.timestamp = yoodoo.formatDate('d/m/Y H:i:s', new Date(new Date().getTime() + this.serverTimeOffset));
		if (yoodoo.loggedin)
			f.actionsLog = this.actionLogging.output();
		if (this.trigger_list.length > 0) {
			f.triggers = [];
			while (this.trigger_list.length > 0)
			f.triggers.push(this.trigger_list.shift());
		}
		yoodoo.console(f);
		if (u === null)
			u = this.option.yoodooPortal.url;
		u += '?r=' + new Date().getTime();
		if (arguments.length > 2)
			this.pause = arguments[2];
		if (this.pause)
			f.callback = 'yoodoo.console';
		this.sendingU = u;
		this.sendingF = f;
		this.sendingFr = yoodoo.e('iframe');
		//this.sendingFr.src=yoodoo.option.yoodooPortal.url;
		this.sendingFr.id = "yoodooPoster";
		this.sendingFr.loaded = false;
		document.body.appendChild(this.sendingFr);
		yoodoo.writeIframe();
	} else {
		yoodoo.postBuffer.push({
			u : u,
			f : f
		});
	}
};*/
yoodoo.fieldsUpdateCallbacks = [];
yoodoo.updateFields = function(fields, complete) {
	// fields = [[field_id,value]];
	yoodoo.fieldsUpdateCallbacks.push(complete);
	var f = {
		callback : 'yoodoo.updatedFields',
		cmd : 'updateFields'
	};
	for (var i = 0; i < fields.length; i++) {
		f['field' + fields[i][0]] = Base64.encode(fields[i][1]);
	}

	if (dooit.addTags.length > 0) {
		f['addtags'] = dooit.addTags.join(",");
	}
	if (dooit.removeTags.length > 0) {
		f['removetags'] = dooit.removeTags.join(",");
	}
	dooit.addTags = [];
	dooit.removeTags = [];
	yoodoo.sendPost(null, f);
};
yoodoo.updatedFields = function(reply) {
	if (/^\&lt\;/.test(reply)) {
		yoodoo.gotXML(reply);
	}
	var complete = yoodoo.fieldsUpdateCallbacks.shift();
	complete(reply);
};
yoodoo.toPDF = function(obj) {
	if ( typeof (this.downloader) != "object") {
		this.downloader = yoodoo.e("iframe");
		this.widget.appendChild(this.downloader);
		$(this.downloader).css({
			display : "none"
		});
	}
	var op = '';
	op += "<html><head></head><body><form id='yoodooPost' action='" + this.option.yoodooPortal.url + "' method='POST'>";
	op += "<textarea name='pdf'>" + Base64.encode(dooit.json(obj)) + "</textarea>";
	op += "<textarea name='userhash'>" + this.loginCode + "</textarea>";
	op += "<textarea name='sitehash'>" + this.sitehash + "</textarea>";
	if (arguments.length > 1)
		op += "<textarea name='filename'>" + arguments[1] + "</textarea>";
	op += "<textarea name='cmd'>pdf</textarea>";
	op += "</form>";
	op += "<script type='text/javascript'>document.getElementById('yoodooPost').submit();</script>";
	op += "</body></html>";
	var doc = (this.downloader.contentWindow) ? this.downloader.contentWindow : (this.downloader.contentDocument.document ? this.downloader.contentDocument.document : this.downloader.contentDocument);
	doc.document.open();
	doc.document.write(op);
	doc.document.close();

};
yoodoo.fillPDF = function(obj) {	
	if ( typeof (this.downloader) != "object") {
		this.downloader = yoodoo.e("iframe");
		this.widget.appendChild(this.downloader);
		$(this.downloader).css({
			display : "none"
		});
	}		
	var op = '';
	op += "<html><head></head><body><form id='yoodooPost' action='" + this.option.yoodooPortal.url + "' method='POST'>";
	op += "<textarea name='userhash'>" + this.loginCode + "</textarea>";
	op += "<textarea name='sitehash'>" + this.sitehash + "</textarea>";
	op += "<textarea name='cmd'>fill_pdf</textarea>";
	for ( var k in obj) {
		console.log(k);
		if ( typeof(obj[k])=="object" )
		{ 
			console.log('object:' + dooit.json(obj[k]));
		} else {
			console.log('srting:' +obj[k]);
		}
		
		op += "<textarea name='"+k+"'>" + ((typeof(obj[k])=="object")?Base64.encode(dooit.json(obj[k])):obj[k]) + "</textarea>";	
	}
	op += "</form>";
	op += "<script type='text/javascript'>document.getElementById('yoodooPost').submit();</script>";
	op += "</body></html>";	
	var doc = (this.downloader.contentWindow) ? this.downloader.contentWindow : (this.downloader.contentDocument.document ? this.downloader.contentDocument.document : this.downloader.contentDocument);
	doc.document.open();
	doc.document.write(op);
	doc.document.close();	
};
/*yoodoo.writeIframe = function() {
	if (!this.sendingFr.loaded) {
		this.initPostResponder();
		if (this.sendingFr.tries===undefined) this.sendingFr.tries=0;
		this.sendingFr.tries++;
		this.sendingFr.loaded = true;
		var doc = null;
		if (this.sendingFr.contentDocument) {
			doc = this.sendingFr.contentDocument;
			//console.log('For NS6');
		} else if (this.sendingFr.contentWindow) {
			doc = this.sendingFr.contentWindow.document;
			//console.log('For IE5.5 and IE6');
		} else if (this.sendingFr.document) {
			doc = this.sendingFr.document;
			//console.log('default');
		}
		if (doc !== null) {
			try{
				doc.open();
			}catch(e) {
				if (this.sendingFr.tries>5) {
					alert("A security error is preventing this system from operating correctly");
					return false;
				}else{
					yoodoo.sendingFr.loaded=false;
					setTimeout('yoodoo.writeIframe()',200);
					return false;
				}
			}
			var op = '';
			op += "<html><head></head><body><form id='yoodooPost' action='" + this.sendingU + "' method='POST'>";
			for (k in this.sendingF) {
				if (this.sendingF[k]!==null &&  typeof (this.sendingF[k]) == "object" && this.sendingF[k].length > 0) {
					for (var i = 0; i < this.sendingF[k].length; i++) {
						op += "<textarea name='" + k + "[]'>" + this.sendingF[k][i] + "</textarea>";
					}
				} else if (this.sendingF[k]!==null){
					if (/^EF/.test(k))
						op += "<input type='text' name='fields[]' value='" + k.replace(/^EF/, '') + "' />";
					op += "<textarea name='" + k + "'>" + this.sendingF[k] + "</textarea>";
				}
			}
			op += "</form>";
			if (!this.pause && this.sendingF.cmd!='xmlbookcase2')
				op += "<script type='text/javascript'>document.getElementById('yoodooPost').submit();</script>";
			op += "</body></html>";
			//console.log(op);
			doc.writeln(op);
			doc.close();
			this.timeout = setTimeout('yoodoo.cancelPost()', this.timeoutDelay);
			$(this.sendingFr).bind('load', function() {
				var frw = yoodoo.sendingFr.contentWindow;
				if (frw.postMessage) {
					frw.postMessage('completed', yoodoo.option.baseUrl);
				} else {
					if (frw.completed) {
						frw.completed();
					}
				}
			});
		}
	}
};*/
/*yoodoo.cancelPost = function() {
	if (!this.pause) {
		yoodoo.sendingPost = false;
		this.removePostResponder();
		$(this.sendingFr).unbind('load');
		clearTimeout(this.timeout);
		this.timeout = null;
		if (this.sendingFr.parentNode)
			this.sendingFr.parentNode.removeChild(this.sendingFr);
		this.working(true, '<div class="oops">'+yoodoo.w('oops')+'<br /><button class="green" type="button">'+yoodoo.w('ok')+'</button></div>');
		$(this.wait).find('button.green').bind("click", function() {
			$(this).blur();
			yoodoo.working(false);
			yoodoo.clearFocus();
		});
		this.hide();
		if (yoodoo.postBuffer.length > 0) {
			var toSend = yoodoo.postBuffer.splice(0, 1)[0];
			yoodoo.sendPost(toSend.u, toSend.f);
		}
	}
};*/
yoodoo.lastReplyFrame = null;
/*yoodoo.postReply = function(e) {
	if (e.source != this.lastReplyFrame) {
		yoodoo.debuggerz.receivedpost();
		this.lastReplyFrame = e.source;
		yoodoo.removePostResponder();
		clearTimeout(yoodoo.timeout);
		yoodoo.timeout = null;
		var parts = yoodoo.translateXML(e.data).split('|');
		if (parts.length > 1) {
			if(/^error$/.test(parts[1])) {
				return yoodoo.logout();
			}else{
				var rg = '^' + parts[0].replace(/\./g, '\\.').replace(/\[/g, '\\[').replace(/\]/g, '\\]') + '\\|';
				var caller = new RegExp(rg);
				var op = e.data.replace(caller, '');
				eval(parts[0] + "('" + op.replace(/'/g, '\\\'') + "');");
			}
		} else if (/^error/.test(parts[0])) {
			return yoodoo.logout();
		}
		var fr = $('#yoodooPoster').get();
		for (var i = fr.length - 1; i >= 0; i--) {
			if (fr[i].contentWindow == e.source)
				fr[i].parentNode.removeChild(fr[i]);
		}

		yoodoo.clearFocus();
	}
	yoodoo.sendingPost = false;
	if (yoodoo.postBuffer.length > 0) {
		var toSend = yoodoo.postBuffer.splice(0, 1)[0];
		yoodoo.sendPost(toSend.u, toSend.f);
	}
};*/
yoodoo.translateXML = function(xml) {
	var remote = this.option.yoodooPortal.url + '?userhash=' + this.loginCode + '&sitehash=' + this.sitehash;
	xml = xml.replace(/<ru>/g, remote);
	for (var k in this.xmltranslation) {
		var rg1 = new RegExp('<' + this.xmltranslation[k], 'g');
		var rg2 = new RegExp('</' + this.xmltranslation[k], 'g');
		xml = xml.replace(rg1, '<' + k);
		xml = xml.replace(rg2, '</' + k);
	}
	return xml;
};
yoodoo.initPostResponder = function() {
	if (window.attachEvent) {
		window.attachEvent('onmessage', yoodoo.postReply);
	} else {
		window.addEventListener('message', yoodoo.postReply, false);
	}
};
yoodoo.removePostResponder = function() {
	if (window.detachEvent) {
		window.detachEvent('onmessage', yoodoo.postReply);
	} else {
		window.removeEventListener('message', yoodoo.postReply, false);
	}
};
yoodoo.flashReady = function() {
	yoodoo.option.flashMovie.loaded = true;
	yoodoo.checkFlashLoaded();
};
yoodoo.checkFlashLoaded = function() {
	if (yoodoo.option.flashMovie.loaded) {
		if (yoodoo.loggedin)
			yoodoo.callXML();
		//if ($('#continue').css("display")=="none") $('#continue').fadeIn();
	}
};
yoodoo.decodeHTMLResponse = function(html) {
	html = html.replace(/[\n\r]/g, '');
	html = html.replace(/&lt;/g, '<');
	html = html.replace(/&gt;/g, '>');
	html = html.replace(/&amp;/g, '&');
	return html;
};
yoodoo.specialDecodeResponse = function(html) {
	html = html.replace(/&dq;/g, '"');
	html = html.replace(/&sq;/g, '\'');
	return html;
};
yoodoo.secsToMins = function(s) {
	var m = Math.floor(s / 60);
	var ss = Math.floor(s - (m * 60)).toString();
	if (ss.length == 1)
		ss = '0' + ss;
	var p = s.toFixed(1).split(".");
	return m + ":" + ss + "." + p[1];
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Command function
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
yoodoo.hasTag = function(tag) {
	if (this.bookcase != undefined) {
		if (this.bookcase.tags != undefined) {
			for (var t = 0; t < this.bookcase.tags.length; t++) {
				if (this.bookcase.tags[t].name == tag)
					return true;
			}
		}
	}else if (typeof(this.sessions)=="object") {
		if (this.sessions._tags != undefined) {
			for (var t = 0; t < this.sessions._tags.length; t++) {
				if (this.sessions._tags[t] == tag)
					return true;
			}
		}
	}
	return false;
};
yoodoo.timecode = function(tc) {
	if ( typeof tc != 'string' || !tc instanceof String)
		return 0;
	var s = 0;
	var c = 0;
	var t = tc.split(":");
	while (t.length > 0)
	s += Math.pow(60, c++) * parseInt(t.pop());
	return s;
};
yoodoo.getStatus = function() {
	var params = {
		cmd : yoodoo.cmd.status.server,
		callback : 'yoodoo.' + yoodoo.cmd.status.callback
	};
	yoodoo.sendPost(null, params);
};
yoodoo.removeDooitDependencies = function() {
	if (dooit.destroy != undefined) {
		try {
			dooit.destroy();
		} catch (e) {
			yoodoo.errorLog(e);
		}
	}
	if (dooit != undefined) {
		dooit.removeTemporaries();
		if (yoodoo.dooitFiles !== null)
			yoodoo.dooitFiles.removeFiles();
		yoodoo.dooitFiles = null;
	}
};
yoodoo.ago = function(d) {
	if (!(d instanceof Date)) return '';
	var brief = false;
	if (arguments.length > 1)
		brief = arguments[0];
	var today = new Date().getTime() / 1000;
	var ts = d.getTime() / 1000;
	var dt = today - ts;
	var minute = 60;
	var hour = 60 * minute;
	var day = hour * 24;
	var week = 7 * day;
	var month = 30.42 * day;
	var year = 364.25 * day;
	if (brief) {
		if (dt < minute)
			return yoodoo.w('justnow');
		if (dt < hour)
			return yoodoo.w('thishour');
		if (dt < day)
			return yoodoo.w("today");
		if (dt < week)
			return yoodoo.w("thisweek");
		if (dt < month)
			return yoodoo.w("thismonth");
		var m = Math.floor(dt / month);
		if (m == 1)
			return yoodoo.w("lastmonth");
		return yoodoo.w('nmonthsago',{n:m});
	} else {
		var q = 0;
		var u = "minute";
		if (dt < minute)
			return yoodoo.w("justnow");
		if (dt < hour) {
			q = Math.floor(dt / minute);
		} else if (dt < day) {
			q = Math.floor(dt / hour);
			u = "hour";
		} else if (dt < week) {
			q = Math.floor(dt / day);
			u = "day";
		} else {
			q = Math.floor(dt / week);
			u = "week";
		}
		if (q == 1)
			return yoodoo.w("a" + u + "ago");
		return yoodoo.w("n" + u + "sago",{n:q});
	}
};
yoodoo.playSound = function(url) {
	yoodoo.stopVoiceover();
	yoodoo.voiceFinishedCallback = function() {
	};
	if (arguments.length > 1)
		yoodoo.voiceFinishedCallback = arguments[1];
	yoodoo.stopSound();
	if (this.html5) {
		if (typeof(yoodooPlaya)!="undefined") {
			yoodooPlaya.audio.loadAndPlay(url, {
				onComplete : yoodoo.voiceFinished
			});
		}else{
			yoodoo.audio.loadAndPlay(url, {
				onComplete : yoodoo.voiceFinished
			});
		}
	} else {
		swfobject.getObjectById(yoodoo.option.voiceoverMovie.id).loadAndPlay(url);
	}
};
yoodoo.stopSound = function() {
	clearTimeout(yoodoo.voiceovertimer);
	if (this.html5) {
		if (typeof(yoodooPlaya)!="undefined") {
			yoodooPlaya.audio.pause();
		}else{
			yoodoo.audio.pause();
		}
	} else {
		swfobject.getObjectById(yoodoo.option.voiceoverMovie.id).PauseVoiceover('');
	}
};
yoodoo.startVoiceover = function(forced) {
	yoodoo.voiceFinishedCallback = function() {
	};
	if (yoodoo.voiceoverfile != "" && (forced || this.playVoice)) {
		if (this.html5) {
				if (typeof(yoodooPlaya)!="undefined") {
					yoodooPlaya.audio.loadAndPlay(yoodoo.voiceoverfile, {
						onComplete : yoodoo.voiceFinishedCallback
					});
				}else{
					yoodoo.audio.loadAndPlay(yoodoo.voiceoverfile, {
						onComplete : yoodoo.voiceFinishedCallback
					});
				}
			/*if (typeof(yoodooPlaya)!="undefined") {
				yoodooPlaya.audio.play();
			}else{
				yoodoo.audio.play();
			}*/
			//yoodooPlaya.audio.loadAndPlay(yoodoo.voiceoverfile,{onUpdate:yoodoo.checkVoiceProgress,onComplete:yoodoo.voiceFinished});
			return true;
		} else {
			swfobject.getObjectById(yoodoo.option.voiceoverMovie.id).loadAndPlay(yoodoo.voiceoverfile);
			this.checkVoiceTimer = setTimeout('yoodoo.checkVoiceProgress();', 500);
			return true;
		}
	}
	return false;
};
yoodoo.stopVoiceover = function() {
	clearTimeout(yoodoo.voiceovertimer);
	$('#voiceoverbutton').removeClass('isPlaying');
	if (this.html5) {
		if (typeof(yoodooPlaya)!="undefined") {
			yoodooPlaya.audio.pause();
		}else{
			yoodoo.audio.pause();
		}
		return true;
	} else {
		clearTimeout(yoodoo.checkVoiceTimer);
		//clearTimeout(yoodoo.voiceovertimer);
		//clearTimeout(this.checkVoiceProgress);
		//yoodoo.voiceovertimer=null;
		swfobject.getObjectById(yoodoo.option.voiceoverMovie.id).PauseVoiceover('');
		return true;
		if (yoodoo.voiceoverfile != "") {
			swfobject.getObjectById(yoodoo.option.voiceoverMovie.id).PauseVoiceover(yoodoo.voiceoverfile);
			return true;
		}
	}
	return false;
};
yoodoo.voiceoverStartStop = function(o) {
	this.playVoice = !this.playVoice;
	if (this.playVoice) {
		this.playVoice = yoodoo.startVoiceover(true);
		$(o).addClass('isPlaying');
	} else {
		yoodoo.stopVoiceover(true);
	}
};
yoodoo.checkVoiceTimer = null;
yoodoo.checkVoiceProgress = function() {
	if (arguments.length > 0) {
		var st = arguments[0];
		$(yoodoo.container).find('.overlayFooter.liveDooit #voiceoverbutton .progress .bar').css("width", Math.round(st.progress) + "%");
	} else {
		if (this.playVoice) {
			var p = swfobject.getObjectById(yoodoo.option.voiceoverMovie.id).playHead();
			if (p > 1)
				p = 1;
			$(this.container).find('.overlayFooter.liveDooit #voiceoverbutton .progress .bar').css("width", Math.round(p * 100) + "%");
			this.checkVoiceTimer = setTimeout('yoodoo.checkVoiceProgress();', 500);
		}
	}
};
yoodoo.voiceFinishedCallback = function() {
};
yoodoo.voiceFinished = function() {
	yoodoo.console("Voiceover finished");
	yoodoo.playVoice = false;
	$(yoodoo.container).find('.overlayFooter.liveDooit #voiceoverbutton').removeClass('isPlaying');
	yoodoo.voiceFinishedCallback();
};
yoodoo.runInitThis = function() {
	if (this.initThisParams!==undefined) {
		setTimeout(function() {
			dooit.init(yoodoo.initThisParams);
		},400);
	}else{
		setTimeout(function() {
			if ( typeof (initThis) !== "undefined")
				initThis();
		}, 400);
	}
};
yoodoo.utc = function() {
	var now = new Date();
	now.setMinutes(now.getMinutes() + now.getTimezoneOffset());
	return now.getFullYear() + "-" + this.doubleNumberLength(now.getMonth() + 1) + "-" + this.doubleNumberLength(now.getDate()) + " " + this.doubleNumberLength(now.getHours()) + ":" + this.doubleNumberLength(now.getMinutes()) + ":" + this.doubleNumberLength(now.getSeconds());
};
yoodoo.utcToLocal = function(d) {
	d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
	return d;
};
yoodoo.doubleNumberLength = function(n) {
	n = String(n);
	while (n.length < 2)
	n = '0' + n;
	return n;
};
yoodoo.makeButton = function() {
	var j = 'javascript:yoodoo.login("' + yoodoo.user.username + '","' + yoodoo.user.password + '")';
	var a = yoodoo.e("a");
	a.href = j;
	$(a).html("Yoodoo auto login");
	document.body.appendChild(a);
};
yoodoo.loginValidate = function() {
	var params = {
		cmd : 'home',
		callback : 'yoodoo.' + yoodoo.cmd.login.callback
	};
	yoodoo.sendPost(null, params);
};
yoodoo.login = function(un, pw) {
	yoodoo.interface.showDialog(yoodoo.w('attemptinglogin')+yoodoo.w('_attempting_login'));
	yoodoo.user.username = un;
	yoodoo.username = un;
	yoodoo.user.password = pw;
	var params = {
		cmd : yoodoo.cmd.login.server,
		username : escape(un),
		password : escape(pw),
		callback : 'yoodoo.' + yoodoo.cmd.login.callback
	};
	yoodoo.sendPost(null, params);
	//yoodoo.sendPost('/frontend_dev.php/remote', params);
	yoodoo.events.trigger("login", un);
};
yoodoo.replyValues = function(reply) {
	yoodoo.words.setOverrides(reply.words);
	yoodoo.first_login = reply.first;
	yoodoo.introMovie=reply.initialVideo;
	if (yoodoo.option.introMovie!==undefined) yoodoo.option.introMovie.flashvars.intro = reply.initialVideo;
	yoodoo.user.emailaddress = reply.emailaddress;
	yoodoo.user.firstname = reply.firstname;
	yoodoo.user.lastname = reply.lastname;
	yoodoo.user.nickname = reply.nickname;
	yoodoo.user.facebook = (reply.facebook===true);
	yoodoo.user.avatar = 'imagedomain:'+reply.avatar;
	if (reply.smallAvatar!==undefined) yoodoo.user.smallAvatar = 'imagedomain:'+reply.smallAvatar;
	if (reply.largeAvatar!==undefined) yoodoo.user.largeAvatar = 'imagedomain:'+reply.largeAvatar;
	var protocol=(/^https\:/i.test(yoodoo.option.baseUrl))?'https://':'http://';
	yoodoo.option.contentUrl = protocol+reply.contentUrl;
	yoodoo.option.videoUrl = protocol+reply.videoUrl;
	yoodoo.option.audioUrl = protocol+reply.audioUrl;
	yoodoo.option.imageUrl = protocol+reply.imageUrl;
	yoodoo.user.unreadComments = reply.unreadComments;
	yoodoo.user.staff = reply.staff;
	yoodoo.user.groups = reply.groups;
	yoodoo.home_banner_html = reply.banner;
	yoodoo.user.score = reply.score;
	yoodoo.home_screen_title = yoodoo.w('welcome_title');
	yoodoo.username = yoodoo.w('welcome_title');
	yoodoo.flash_message = yoodoo.w('welcome_text');
	yoodoo.home_left_text = Base64.decode(reply.tip);
	if (yoodoo.home_left_text=='') {
		yoodoo.home_left_text = yoodoo.w('tip_title')+yoodoo.w('default_tip');
	}else{
		yoodoo.home_left_text = yoodoo.w('tip_title')+yoodoo.home_left_text;
	}
	yoodoo.notices=[];
	if (yoodoo.notification!==undefined) {
		for(var n=0;n<reply.notices.length;n++) {
			yoodoo.notices.push(new yoodoo.notification.notice(reply.notices[n]));
		}
	}else{
		yoodoo.notices = reply.notices;
	}
	if (reply.serverTime !== undefined) {
		try {
			eval('var tmpTime=' + reply.serverTime + ';');
			yoodoo.serverTimeOffset = (new Date().getTime()) - tmpTime.getTime();
		} catch (e) {
			yoodoo.errorLog(e);
		}
	}
	//yoodoo.serverTimeOffset = reply.serverTime;
	yoodoo.user.meta = (reply.meta === null) ? {} : reply.meta;
	yoodoo.user.advisorAcceptance = reply.advisorAcceptance;
	yoodoo.user.advisorRestricted = reply.advisorRestricted;
	yoodoo.user.advisor = reply.advisor;
	yoodoo.user.advised = reply.advised;
	yoodoo.user.adviseeUnread = reply.adviseeUnread;
	yoodoo.user.adviseeRequests = reply.adviseeRequests;
	yoodoo.user.advisorUnread = reply.advisorUnread;
	if ( typeof (reply.resourceUrl) != "undefined")
		yoodoo.option.resourceUrl = reply.resourceUrl;
	if ( typeof (reply.htmlResourceUrl) != "undefined")
		yoodoo.option.htmlResourceUrl = reply.htmlResourceUrl;
	yoodoo.user.advisorUnread = reply.advisorUnread;
	yoodoo.user.metaUpdate = {};
	yoodoo.events.trigger("userInformation", yoodoo.user);
	yoodoo.loggedin = true;
	yoodoo.comments.updateUnreadComments();
	if (typeof(yoodoo.sessions)=="object" && reply.icons!==undefined) yoodoo.icons.custom=reply.icons;
	if (typeof(yoodoo.sessions)=="object" && reply.tags!==undefined) yoodoo.sessions._tags=reply.tags;
	if (typeof(yoodoo.sessions)=="object" && reply.sessions!==undefined) yoodoo.sessions.build(reply.sessions);
	if (typeof(yoodoo.sessions)=="object" && reply.syllabus!==undefined) yoodoo.sessions.syllabus(reply.syllabus);
	if (yoodoo.user.staff && !yoodoo.isApp)
		yoodoo.debuggerz.start();
	yoodoo.debuggerz.showMeta(yoodoo.user.meta);
};
yoodoo.trigger_list = [];
yoodoo.set_trigger = function(params) {// {trigger:id,dooit:id} if trigger id is 0 then any for this dooit will run
	this.trigger_list.push(Base64.encode(dooit.json(params)));
};
yoodoo.set_meta = function(k, v) {
	if (yoodoo.user.meta == undefined)
		yoodoo.user.meta = {};
	if (yoodoo.user.metaUpdate == undefined)
		yoodoo.user.metaUpdate = {};
	if (yoodoo.user.meta[k] == undefined || yoodoo.user.meta[k] != v) {
		yoodoo.user.meta[k] = v;
		yoodoo.user.metaUpdate[k] = v;
		yoodoo.events.trigger("meta", {
			key : k,
			value : v
		});
		yoodoo.debuggerz.setMeta(k, v);
	}
};
yoodoo.get_meta = function(k) {
	return (yoodoo.user.meta[k] == undefined) ? null : yoodoo.user.meta[k];
};
yoodoo.changed_meta = function() {
	var reply = {};
	for (var k in yoodoo.user.metaUpdate)
	reply[k] = yoodoo.user.metaUpdate[k];
	yoodoo.user.metaUpdate = {};
	return reply;
};
yoodoo.set_users_totals = function(k, d, v, newRecord) {
	// key, diff, value, boolean
	if (yoodoo.user.users_totals == undefined)
		yoodoo.user.users_totals = {};
	yoodoo.user.users_totals[k] = d + ',' + v + ',' + ( newRecord ? '1' : '0');
};
yoodoo.changed_users_totals = function() {
	var reply = {};
	for (var k in yoodoo.user.users_totals)
	reply[k] = yoodoo.user.users_totals[k];
	yoodoo.user.users_totals = {};
	return reply;
};

yoodoo.debuggerz = {
	container : null,
	display : null,
	tags : null,
	meta : null,
	getAllItems : false,
	lists : {
		tags : {},
		meta : {},
		post : []
	},
	start : function() {
		if (this.container !== undefined && this.container === null) {
			this.container = yoodoo.e("div");
			this.display = yoodoo.e("div");
			this.tags = yoodoo.e("div");
			this.meta = yoodoo.e("div");
			this.post = yoodoo.e("div");
			$(this.container).addClass('yoodoo_debugger');

			var label = yoodoo.e("label");
			$(label).html("Load all content");
			var cb = yoodoo.e("input");
			$(label).append($(cb).attr("type", "checkbox").bind("change", function() {
				yoodoo.debuggerz.getAllItems = this.checked;
				yoodoo.debuggerz.reloadBookcase();
			}));

			var but = yoodoo.e("button");
			$(this.container).append($(but).attr("type", "button").html("close debugger").click(function() {
				yoodoo.debuggerz.close();
			})).append(label).append(this.display).append('<div>Tags</div>').append($(this.tags).addClass('tag_debug')).append('<div>Meta</div>').append($(this.meta).addClass('meta_debug')).append('<div>Posts</div>').append($(this.post).addClass('post_debug'));

			$(document.body).append(this.container);
		}
	},
	reloadBookcase : function() {
		yoodoo.callXML();
	},
	close : function() {
		$(this.container).remove();
		this.container = undefined;
		if (yoodoo.debuggerz.getAllItems) {
			yoodoo.debuggerz.getAllItems = false;
			yoodoo.debuggerz.reloadBookcase();
		}
	},
	showMeta : function(list) {
		if (this.container !== undefined && this.container !== null) {
			for (var k in list) {
				if (this.lists.meta[k] === undefined || this.lists.meta[k].element === undefined) {
					var txt = list[k];
					if (txt.length > 15) {
						txt = txt.substring(0, 15);
						txt = txt.replace(/\&/g, '&amp;');
						txt += "&hellip;";
						txt = txt.replace(/\</g, '&lt;').replace(/\>/g, '&gt;');
					} else {
						txt = txt.replace(/\&/g, '&amp;').replace(/\</g, '&lt;').replace(/\>/g, '&gt;');
					}
					this.lists.meta[k] = {
						value : txt,
						cache : false,
						element : yoodoo.e("div")
					};
					$(this.meta).append($(this.lists.meta[k].element).html(k + ': ' + this.lists.meta[k].value).hide());
					$(this.lists.meta[k].element).slideDown();
				} else {
					this.lists.meta[k].element.cache = false;
					$(this.lists.meta[k].element).removeClass('cachedMeta');
				}
			}
			for (var k in this.lists.meta) {
				if (list[k] === undefined) {
					$(this.lists.meta[k].element).slideUp(500, function() {
						$(this).remove();
					});
					this.lists.meta[k] = undefined;
				}
			}
		}
	},
	showTags : function(list) {
		if (this.container !== undefined && this.container !== null) {
			var existing = {};
			for (var l = 0; l < list.length; l++) {
				var k = list[l].name;
				existing[k] = true;
				if (this.lists.tags[k] === undefined) {
					this.lists.tags[k] = {
						live : true,
						cache : null,
						element : yoodoo.e("div")
					};
					$(this.tags).append($(this.lists.tags[k].element).html(k).hide());
					$(this.lists.tags[k].element).slideDown();
				} else {
					this.lists.tags[k].cache = null;
					this.lists.tags[k].live = true;
					$(this.lists.tags[k].element).removeClass('removeTag').removeClass('addTag');
				}
			}
			for (var k in this.lists.tags) {
				if (existing[k] === undefined) {
					if (this.lists.tags[k] !== undefined)
						$(this.lists.tags[k].element).slideUp(500, function() {
							$(this).remove();
						});
					this.lists.tags[k] = undefined;
				}
			}

		}
	},
	addTag : function(tag) {
		if (this.lists.tags[tag] === undefined) {
			this.lists.tags[tag] = {
				cache : true,
				element : yoodoo.e("div")
			};
			$(this.tags).append($(this.lists.tags[tag].element).html(tag).addClass('addTag').hide());
			$(this.lists.tags[tag].element).slideDown();
		} else if (this.lists.tags[tag].cache === false) {
			this.lists.tags[tag].cache = null;
			$(this.lists.tags[tag].element).removeClass("removeTag");
			if (this.lists.tags[tag].live !== true) {
				this.lists.tags[tag].cache = true;
				$(this.lists.tags[tag].element).addClass("addTag");
			}
		}
	},
	removeTag : function(tag) {
		if (this.lists.tags[tag] !== undefined) {
			if (this.lists.tags[tag].live === true) {
				this.lists.tags[tag].cache = false;
				$(this.lists.tags[tag].element).addClass('removeTag').removeClass("addTag");
			} else {
				$(this.lists.tags[tag].element).remove();
				this.lists.tags[tag] = undefined;
			}
		}
	},
	setMeta : function(k, v) {
		if (v.length > 15) {
			v = v.substring(0, 15);
			v = v.replace(/\&/g, '&amp;');
			v += "&hellip;";
			v = v.replace(/\</g, '&lt;').replace(/\>/g, '&gt;');
		} else {
			v = v.replace(/\&/g, '&amp;').replace(/\</g, '&lt;').replace(/\>/g, '&gt;');
		}
		if (this.lists.meta[k] === undefined) {
			this.lists.meta[k] = {
				value : v,
				cache : true,
				element : yoodoo.e("div")
			};
			$(this.meta).append($(this.lists.meta[k].element).html(k + ': ' + this.lists.meta[k].value).hide());
			$(this.lists.meta[k].element).slideDown();
			$(this.lists.meta[k].element).addClass('cachedMeta');
		} else if (this.lists.meta[k].value != v) {
			this.lists.meta[k].value = v;
			this.lists.meta[k].element.cache = true;
			$(this.lists.meta[k].element).html(k + ': ' + this.lists.meta[k].value);
			$(this.lists.meta[k].element).addClass('cachedMeta');
		}
	},
	lastPost : null,
	lastPostTimestamp : 0,
	sendpost : function(cmd) {
		this.lastPost = yoodoo.e("div");
		$(this.lastPost).html(cmd);
		$(this.post).prepend(this.lastPost);
		this.lists.post.push(this.lastPost);
		while (this.lists.post.length > 10) {
			var ee = this.lists.post.splice(0, 1);
			$(ee[0]).remove();
		}
		this.lastPostTimestamp = new Date().getTime();
	},
	receivedpost : function() {
		var em = yoodoo.e("em");
		var ms = new Date().getTime() - this.lastPostTimestamp;
		$(this.lastPost).append($(em).html('&nbsp;(' + ms + "ms)"));
	}
};
yoodoo.download = function(id, file) {
	yoodoo.console(file);
	window.open(file, 'yoodoo_download');
	this.bookcase.handlers.document_requested(id);
};
yoodoo.keyCodes = {
	standard:{
		backspace:8,
		tab:9,
		enter:13,
		shift:16,
		ctrl:17,
		alt:18,
		capslock:20,
		esc:27,
		space:32,
		pageup:33,
		pagedown:34,
		end:35,
		home:36,
		left:37,
		up:38,
		right:39,
		down:40,
		insert:45,
		del:46,
		zero:48,
		nine:57,
		padzero:96,
		padnine:105,
		a:65,
		z:90,
		f1:112,
		f12:123,
		numlock:144,
		scrolllock:145,
		comma:188,
		period:190,
		padperiod:110,
		slash:191,
		padslash:111,
		leftbracket:219,
		backslash:220,
		rightbracket:221,
		apostrophe:222,
		dash:189,
		paddash:109,
		tilde:192,
		padplus:107,
		padasterix:106,
		equals:187,
		leftquote:223,
		semicolon:186
	},
	keypress:{
		backspace:8,
		tab:9,
		enter:13,
		shift:16,
		ctrl:17,
		alt:18,
		capslock:20,
		esc:27,
		space:32,
		pageup:33,
		pagedown:34,
		end:35,
		home:36,
		left:37,
		up:38,
		right:39,
		down:40,
		insert:45,
		del:46,
		zero:48,
		nine:57,
		padzero:96,
		padnine:105,
		a:65,
		z:90,
		A:97,
		Z:122,
		f1:112,
		f12:123,
		numlock:144,
		scrolllock:145,
		comma:188,
		period:46,
		padperiod:110,
		slash:191,
		padslash:111,
		leftbracket:219,
		backslash:220,
		rightbracket:221,
		apostrophe:222,
		dash:45,
		paddash:109,
		tilde:192,
		padplus:107,
		padasterix:106,
		equals:187,
		leftquote:223,
		semicolon:186
	}
};
yoodoo.keyCode = function(e) {
	var yk=yoodoo.keyCodes.standard;
	if (e.type=='keypress') yk=yoodoo.keyCodes.keypress;
	var keycode;
	if (window.event)
		keycode = window.event.keyCode;
	else if (e)
		keycode = e.which;
	var shift=(yoodooKeylog[yk.shift] === true || e.shiftKey === true);
	var ctrl=(yoodooKeylog[yk.ctrl] === true || e.ctrlKey === true);
	var key = {
		code : keycode,
		alpha : !ctrl && (keycode >= yk.a && keycode <= yk.z),
		space : (keycode == yk.space),
		numeric : !ctrl && !shift && ((keycode >= yk.zero && keycode <= yk.nine) || (keycode >= yk.padzero && keycode <= yk.padnine)),
		decimal : (!ctrl && !shift && ((keycode >= yk.zero && keycode <= yk.nine) || (keycode >= yk.padzero && keycode <= yk.padnine)) || (keycode == yk.padperiod) || (keycode == yk.period) || (keycode == yk.dash) || (keycode == yk.paddash)),
		enter : (keycode == yk.enter),
		escape : (keycode == yk.esc),
		character : String.fromCharCode(keycode),
		input : ((keycode == yk.period) || (keycode == yk.comma) || (keycode == yk.tilde) || (keycode == yk.slash) || 
				(keycode == yk.padperiod) || (keycode == yk.padtilde) || (keycode == yk.padslash) || (keycode == yk.padplus) || (keycode == yk.equals) || (keycode == yk.dash)
				 || (keycode == yk.padasterix) || (keycode == yk.padperiod) || (keycode == yk.backslash) || (keycode == yk.leftquote) || (keycode == yk.apostrophe) || (keycode == yk.rightbracket) || (keycode == yk.leftbracket) || (keycode == yk.semicolon)),
		tab : (keycode == yk.tab),
		shift : shift,
		onlyshift : shift && (keycode==yk.shift),
		ctrl : ctrl,
		onlyctrl : ctrl && (keycode==yk.ctrl),
		backspace : (keycode == yk.backspace),
		del : (keycode == yk.del),
		fkey : ((keycode >= yk.f1 && keycode <= yk.f12) ? keycode - yk.f1 + 1 : false),
		home : (keycode == yk.home),
		end : (keycode == yk.end),
		up : (keycode == yk.up),
		down : (keycode == yk.down),
		left : (keycode == yk.left),
		right : (keycode == yk.right),
		navigate : false
	};
	for(var k in yk) {
		key[k]=(keycode==yk[k]);
	}
	//if (key.numeric && keycode > 95)
		key.character = String.fromCharCode(keycode);
	key.navigate = (key.left || key.right || key.del || key.backspace || key.onlyshift || key.home || key.end || key.tab);
	return key;
};
yoodoo.htmlEntities = function(str) {
	return String(str).replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&#34;').replace(/'/g, '&#39;').replace(/&/g, '&amp;');
};
yoodoo.outerhtml = function(obj) {
	var tmp=$(yoodoo.e("div")).append(obj);
	return tmp.html();
};
yoodoo.sliders = [];
yoodoo.initSlider = function(container, content, options) {
	if (container.sliderIndex == undefined) {
		for (var s = 0; s < this.sliders.length; s++) {
			if (this.sliders[s] == container)
				container.sliderIndex = s;
		}
	}
	if (container.sliderIndex == undefined) {
		this.sliders.push(container);
		container.sliderIndex = this.sliders.length - 1;
	}
	//if (container.physics!=undefined) return false;
	var items = null;
	var horizontal = true;
	container.useMargin = false;
	container.persist = true;
	container.canPersist = false;
	container.slideTarget = content;
	container.physics = {
		speed : 0,
		x : 0,
		time : 0,
		dtime : 0,
		friction : 400,
		interval : 20
	};
	container.scrollTo = function() {
	};
	container.stop = function() {
	};
	container.change = function() {
	};
	container.childScroll = null;
	if (options.horizontal != undefined)
		horizontal = options.horizontal;
	if (options.useMargin != undefined)
		container.useMargin = options.useMargin;
	if (options.persist != undefined)
		container.persist = options.persist;
	if (options.friction != undefined)
		container.physics.friction = options.friction;
	if (options.items != undefined)
		items = $(container).find(options.items);
	if (options.stop != undefined)
		container.stop = options.stop;
	if (options.change != undefined)
		container.change = options.change;
	container.direction = horizontal ? 'X' : 'Y';
	if (!horizontal) {
		$(container).bind("mousewheel", function(e) {
			this.setScroll(this.scrollamount - e.originalEvent.wheelDeltaY);
		});
	} else {
		$(container).bind("mousewheel", function(e) {
			this.setScroll(this.scrollamount - e.originalEvent.wheelDeltaX);
		});
	}
	if (items != null) {
		items.each(function(i, e) {
			e.sliderContainer = container;
		});
		if (yoodoo.is_touch) {
			items.unbind("touchstart").bind("touchstart", function(e) {

				if (e.originalEvent.touches.length == 1) {
					$(this.sliderContainer).stop();
					e.preventDefault();
					this.direction = this.sliderContainer.direction ? 'X' : 'Y';
					this.X = e.originalEvent.touches[0]['page' + this.direction];
					yoodoo.sliderItemOver = this;
					$(window).bind("touchmove.itemTemp", function(e) {
						if (Math.sqrt(Math.pow(yoodoo.sliderItemOver.X - e.originalEvent.touches[0]['page' + yoodoo.sliderItemOver.sliderContainer.direction], 2)) > 5) {
							$(window).unbind("touchmove.itemTemp");
							$(window).unbind("touchend.itemTemp");
						}
					});
					$(window).bind("touchend.itemTemp", function(e) {
						$(window).unbind("touchmove.itemTemp");
						$(window).unbind("touchend.itemTemp");
						if (yoodoo.sliderItemOver.selected !== undefined)
							yoodoo.sliderItemOver.selected(e);
					});
				}
			});
		}
		if (yoodoo.is_mouse) {
			items.unbind("mousedown").bind("mousedown", function(e) {
				e.preventDefault();
				this.direction = this.sliderContainer.direction ? 'X' : 'Y';
				this.X = e['page' + this.direction];
				yoodoo.sliderItemOver = this;
				$(document).bind("mouseup.itemTemp mouseleave.itemTemp", function(e) {
					$(document).unbind("mouseup.itemTemp");
					$(document).unbind("mouseleave.itemTemp");
					if (Math.sqrt(Math.pow(yoodoo.sliderItemOver.X - e['page' + yoodoo.sliderItemOver.direction], 2)) < 5) {
						if (yoodoo.sliderItemOver.selected !== undefined)
							yoodoo.sliderItemOver.selected(e);
					} else {
						e.preventDefault();
					}
				});
			});
		}
	}
	container.isActive = function() {
		var innerWidth = $(this.slideTarget).outerWidth(false);
		var innerHeight = $(this.slideTarget).outerHeight(false);
		return (($(this).width() < innerWidth && this.direction == "X") || ($(this).height() < innerHeight && this.direction == "Y"));
	};
	container.persisting = function() {
		if (this.persist && this.canPersist) {
			var df = (this.physics.interval * this.physics.friction) / 1000;
			if (this.physics.speed > 0) {
				this.physics.speed -= df;
			} else {
				this.physics.speed += df;
			}
			var ds = (this.physics.speed * this.physics.interval) / 1000;
			var ws = this.scrollamount;
			this.setScroll(this.scrollamount + ((this.useMargin) ? -ds : ds));
			ds = this.scrollamount - ws;
			if (ds < 2 && ds > -2) {
				this.physics.speed = 0;
				this.stop();
			} else {
				setTimeout('yoodoo.sliders[' + container.sliderIndex + '].persisting()', this.physics.interval);
			}
			this.change();
		} else {
			this.stop();
		}
	};
	container.startScroll = function() {
		if (this.isActive) {
			if (this.useMargin) {
				var mk = 'margin' + ((this.direction == "X") ? 'Left' : 'Top');
				var m = parseInt($(this.slideTarget).css(mk).replace("px", ""));
				this.scrollamount = m;
			} else {
				this.scrollamount = this['scroll' + ((this.direction == "X") ? 'Left' : 'Top')];
			}
			if (this.direction == "Y") {
				this.maxScroll = $(this.slideTarget).outerHeight(false) - $(this).height();
			} else {
				this.maxScroll = $(this.slideTarget).outerWidth(false) - $(this).width();
			}
			return true;
		} else {
			return false;
		}
	};
	container.scrollTo = function(ele) {
		if (ele !== undefined) {
			var f = function() {
			};
			if (arguments.length > 1)
				f = arguments[1];
			this.startScroll();
			if (this.direction == "X") {
				var x = $(ele).offset().left - $(this.slideTarget).offset().left + ($(ele).outerWidth(true) / 2) - ($(this).width() / 2);
				this.setScroll((this.useMargin ? -x : x), true, f);
			} else {
				var y = $(ele).offset().top - $(this.slideTarget).offset().top + ($(ele).outerHeight(true) / 2) - ($(this).height() / 2);
				this.setScroll((this.useMargin ? -y : y), true, f);
			}
		}
		//console.log(ele);
	};
	container.setScroll = function(s) {
		var animate = false;
		if (arguments.length > 1)
			animate = arguments[1];
		var f = function() {
		};
		if (arguments.length > 2)
			f = arguments[2];

		this.scrollamount = s;
		if (this.useMargin) {
			var ma = [0, 0, 0, 0];
			if (this.scrollamount < -this.maxScroll)
				this.scrollamount = -this.maxScroll;
			if (this.scrollamount > 0)
				this.scrollamount = 0;
			ma[(this.direction == "X") ? 3 : 0] = this.scrollamount;
			if (animate) {
				$(this.slideTarget).animate({
					margin : ma.join("px ") + "px"
				}, {
					duration : 500,
					easing : "swing",
					complete : f
				});
			} else {
				$(this.slideTarget).css({
					margin : ma.join("px ") + "px"
				});
			}
		} else {
			if (this.scrollamount > this.maxScroll)
				this.scrollamount = this.maxScroll;
			if (this.scrollamount < 0)
				this.scrollamount = 0;
			var k = 'scroll' + ((this.direction == "X") ? 'Left' : 'Top');
			var css = {};
			css[k] = this.scrollamount;
			if (animate) {
				$(this).animate(css, {
					duration : 500,
					easing : "swing",
					complete : f
				});
			} else {
				this[k] = this.scrollamount;
			}
		}
		this.change();
	};
	if (yoodoo.is_touch) {
		$(container).unbind("touchstart").bind("touchstart", function(e) {
			if (e.originalEvent.touches.length == 1) {
				$(this).stop();
				if ( typeof (yoodooPlaya) != 'undefined')
					yoodooPlaya.centreTimerClear();
				if ($(e.target).hasClass("interactive"))
					return true;
				this.physics.time = new Date().getTime();
				this.physics.speed = 0;
				this.physics.x = e.originalEvent.touches[0]['page' + this.direction];
				this.lastLocation = {
					x : e.originalEvent.touches[0].pageX,
					y : e.originalEvent.touches[0].pageY
				};
				this.childScroll = e.target;
				if (this.childScroll != this) {
					while (!$(this.childScroll).hasClass("scrollStyle") && this.childScroll != this) {
						this.childScroll = this.childScroll.parentNode;
					}
				}
				if (!$(this.childScroll).hasClass("scrollStyle"))
					this.childScroll = null;
				this.canPersist = false;

				if (this.startScroll()) {
					$(this).bind("touchmove", function(e) {
						e.preventDefault();
						var now = new Date().getTime();
						this.physics.dtime = now - this.physics.time;
						this.physics.time = now;
						this.physics.speed = (this.physics.x - e.originalEvent.touches[0]['page' + this.direction]) / (this.physics.dtime / 1000);
						if (this.useMargin) {
							this.setScroll(this.scrollamount - (this.physics.x - e.originalEvent.touches[0]['page' + this.direction]));
						} else {
							this.setScroll(this.scrollamount + (this.physics.x - e.originalEvent.touches[0]['page' + this.direction]));
						}
						this.physics.x = e.originalEvent.touches[0]['page' + this.direction];
						if (this.childScroll !== null) {
							this.childScroll.scrollTop -= e.originalEvent.touches[0].pageY - this.lastLocation.y;
							this.childScroll.scrollLeft -= e.originalEvent.touches[0].pageX - this.lastLocation.x;
						}
						this.lastLocation = {
							x : e.originalEvent.touches[0].pageX,
							y : e.originalEvent.touches[0].pageY
						};
					});
					$(this).bind("touchend", function(e) {

						$(this).unbind("touchmove touchend");
						this.canPersist = true;
						this.persisting();
					});
				}
			}
		});
	}
	if (yoodoo.is_mouse) {
		$(container).unbind("mousedown").bind("mousedown", function(e) {
			if (e.target.tagName == "SELECT")
				return true;
			$(this).unbind("mousemove mouseup mouseleave");
			if ( typeof (yoodooPlaya) != 'undefined')
				yoodooPlaya.centreTimerClear();
			if ($(e.target).hasClass("interactive"))
				return true;
			e.preventDefault();
			this.physics.speed = 0;
			this.physics.time = new Date().getTime();
			this.physics.x = e['page' + this.direction];
			this.lastLocation = {
				x : e.pageX,
				y : e.pageY
			};
			this.startLocation = this.physics.x;
			this.childScroll = e.target;
			if (this.childScroll != this) {
				while (!$(this.childScroll).hasClass("scrollStyle") && this.childScroll != this) {
					this.childScroll = this.childScroll.parentNode;
				}
			}
			if (!$(this.childScroll).hasClass("scrollStyle"))
				this.childScroll = null;
			this.canPersist = false;
			if (this.startScroll()) {
				if (this.childScroll !== null && !yoodoo.webkit) {
					this.childScroll.target = this;
					$(this).bind("mouseout", function() {
						this.canPersist = true;
						$(this).unbind("mousemove mouseup mouseleave");
						this.persisting();
					});
				}
				$(this).bind("mousemove", function(e) {
					e.preventDefault();
					var now = new Date().getTime();
					this.physics.dtime = now - this.physics.time;
					this.physics.time = now;
					this.physics.speed = (this.physics.x - e['page' + this.direction]) / (this.physics.dtime / 1000);
					if (this.useMargin) {
						this.setScroll(this.scrollamount - (this.physics.x - e['page' + this.direction]));
					} else {
						this.setScroll(this.scrollamount + (this.physics.x - e['page' + this.direction]));
					}
					this.physics.x = e['page' + this.direction];
					if (this.childScroll !== null) {
						this.childScroll.scrollTop -= e.pageY - this.lastLocation.y;
						this.childScroll.scrollLeft -= e.pageX - this.lastLocation.x;
					}
					this.lastLocation = {
						x : e.pageX,
						y : e.pageY
					};
				});
				$(this).bind("mouseup mouseleave", function(e) {
					var moved = Math.sqrt(Math.pow(this.startLocation - e['page' + this.direction], 2));
					this.canPersist = true;
					$(this).unbind("mousemove mouseup mouseleave");
					if (moved > 5) {
						var target = yoodoo.parentOfType(e.target, ['a', 'button']);
						if (target !== false) {
							//target.disabled=true;
							var events = jQuery._data(target, "events");
							var clicks = [];
							if (events && events.click) {
								for (var i = 0; i < events.click.length; i++) {
									clicks.push(events.click[i].handler);
								}
								$(target).unbind("click");
								setTimeout(function() {
									for (var i = 0; i < clicks.length; i++) {
										$(target).click(clicks[i]);
									}
								}, 200);
							}
						}
					}
					this.persisting();
				});
			}
		});
	}
};
yoodoo.parentOfType = function(obj, typeList) {
	var types = {};
	var classes = [];
	while (typeList.length > 0) {
		var item=typeList.pop();
		if (item.match(/^\./)) {
			classes.push(item.replace(/^\./,''));
		}else{
			types[item.toLowerCase()] = true;
		}
	}
	while (types[obj.tagName.toLowerCase()] !== true && 
	 yoodoo.hasClassIn(obj,classes)!==true 
	 && obj.id != 'yoodooWidget')
	obj = obj.parentNode;
	if (obj.id == 'yoodooWidget')
		return false;
	return obj;
};
yoodoo.parentWithScroll = function(obj) {
	if (obj===yoodoo.widget) return false;
	if (obj.scrollHeight>obj.clientHeight && $(obj).css('overflow-y')=='auto') return obj;
	return yoodoo.parentWithScroll(obj.parentNode);
	return false;
};
yoodoo.hasClassIn = function(obj,classes) {
	for(var c in classes) {
		if ($(obj).hasClass(classes[c])) return true;
	}
	return false;
};
yoodoo.stringToDate = function(f, str) {
	var today = new Date();
	var D = today.getDate();
	var M = today.getMonth();
	var Y = today.getFullYear();
	var h = today.getHours();
	var m = today.getMinutes();
	var s = today.getSeconds();
	var morning = (h <= 12);
	//var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
	//var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	for (var l = 0; l < f.length; l++) {
		var L = f.substr(l, 1);
		switch(L) {
			case "d":
				var mD = str.match(/^\d+/);
				if (mD) {
					D = mD[0];
					str = str.replace(new RegExp('^' + mD[0]), '');
				}
				break;
			case "j":
				var mD = str.match(/^\d+/);
				if (mD) {
					D = mD[0];
					str = str.replace(new RegExp('^' + mD[0]), '');
				}
				break;
			case "D":
				var rem = '';
				for (var i = 0; i < this.days.length; i++) {
					if (str.substr(0, 3) == this.days[i].substr(0, 3))
						rem = str.substr(0, 3);
				}
				if (rem != "")
					str = str.replace(new RegExp('^' + rem), '');
				break;
			case "l":
				var rem = '';
				for (var i = 0; i < this.days.length; i++) {
					if (str.substr(0, this.days[i].length) == this.days[i])
						rem = this.days[i];
				}
				if (rem != "")
					str = str.replace(new RegExp('^' + rem), '');
				break;
			case "N":
				str = str.replace(/^\d/, '');
				break;
			case "S":
				str = str.replace(/^[st|nd|rd|th]/, '');
				break;
			case "w":
				str = str.replace(/^\d/, '');
				break;
			case "z":
				str = str.replace(/^\d{1,3}/, '');
				break;
			case "W":
				str = str.replace(/^\d{1,2}/, '');
				break;
			case "F":
				var rem = '';
				for (var i = 0; i < this.months.length; i++) {
					if (str.substr(0, 3) == this.months[i].substr(0, 3))
						rem = str.substr(0, 3);
				}
				if (rem != "")
					str = str.replace(new RegExp('^' + rem), '');
				break;
			case "M":
				var rem = '';
				for (var i = 0; i < this.months.length; i++) {
					if (str.substr(0, this.months[i].length) == this.months[i])
						rem = this.months[i];
				}
				if (rem != "")
					str = str.replace(new RegExp('^' + rem), '');
				break;
			case "m":
				var mD = str.match(/^\d{1,2}/);
				if (mD) {
					M = mD[0] - 1;
					str = str.replace(new RegExp('^' + mD[0]), '');
				}
				break;
			case "n":
				var mD = str.match(/^\d{1,2}/);
				if (mD) {
					M = mD[0] - 1;
					str = str.replace(new RegExp('^' + mD[0]), '');
				}
				break;
			case "t":
				str = str.replace(/^\d{1,2}/, '');
				break;
			case "Y":
				var mD = str.match(/^\d{4}/);
				if (mD) {
					Y = mD[0];
					str = str.replace(new RegExp('^' + mD[0]), '');
				}
				break;
			case "y":
				var mD = str.match(/^\d{2}/);
				if (mD) {
					Y = Y.substr(0, 2) + mD[0];
					str = str.replace(new RegExp('^' + mD[0]), '');
				}
				break;
			case "a":
				morning = (str.substr(0, 2) == "am");
				str = str.replace(/^\w\w/, '');
				break;
			case "A":
				morning = (str.substr(0, 2) == "AM");
				str = str.replace(/^\w\w/, '');
				break;
			case "g":
				var mD = str.match(/^\d{1,2}/);
				if (mD) {
					h = (1 * mD[0]) + ( morning ? 12 : 0);
					str = str.replace(new RegExp('^' + mD[0]), '');
				}
				break;
			case "G":
				var mD = str.match(/^\d{1,2}/);
				if (mD) {
					h = 1 * mD[0];
					str = str.replace(new RegExp('^' + mD[0]), '');
				}
				break;
			case "h":
				var mD = str.match(/^\d{1,2}/);
				if (mD) {
					h = (1 * mD[0]) + ( morning ? 12 : 0);
					str = str.replace(new RegExp('^' + mD[0]), '');
				}
				break;
			case "H":
				var mD = str.match(/^\d{1,2}/);
				if (mD) {
					h = 1 * mD[0];
					str = str.replace(new RegExp('^' + mD[0]), '');
				}
				break;
			case "i":
				var mD = str.match(/^\d{1,2}/);
				if (mD) {
					m = 1 * mD[0];
					str = str.replace(new RegExp('^' + mD[0]), '');
				}
				break;
			case "s":
				var mD = str.match(/^\d{1,2}/);
				if (mD) {
					s = 1 * mD[0];
					str = str.replace(new RegExp('^' + mD[0]), '');
				}
				break;
			default:
				str = str.substr(1, str.length - 1);
				break;
		}
	}
	return new Date(Y, M, D, h, m, s);
};
yoodoo.days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
yoodoo.months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
yoodoo.formatDate = function(f, dt) {
	var op = '';
	if ( typeof (dt.getDate) == "function") {
		var d = dt.getDate();
		var m = dt.getMonth();
		var y = dt.getFullYear().toString();
		var hours = dt.getHours();
		var minutes = dt.getMinutes();
		var seconds = dt.getSeconds();
		var onejan = new Date(dt.getFullYear(), 0, 1);
		var doy = Math.ceil((dt - onejan) / 86400000);
		var days = [];
		for(var i=0;i<yoodoo.days.length;i++) days.push(yoodoo.w(yoodoo.days[i].toLowerCase()));
		var months = [];
		for(var i=0;i<yoodoo.months.length;i++) months.push(yoodoo.w(yoodoo.months[i].toLowerCase()));
		var daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
		var leapYear = ((y % 4) == 0) ? (((y % 100) == 0) ? (((y % 400) == 0) ? true : false) : true) : false;
		if (leapYear)
			daysInMonth[1] = 29;
		var suffix = [];
		for (var l = 0; l < 31; l++)
			suffix[l] = "th";
		suffix[0] = suffix[20] = suffix[30] = "st";
		suffix[1] = suffix[21] = "nd";
		suffix[2] = suffix[22] = "rd";
		for (var l = 0; l < f.length; l++) {
			var L = f.substr(l, 1);
			switch(L) {
				case "d":
					op += ((d.toString().length == 1) ? "0" : "") + d.toString();
					break;
				case "D":
					op += days[dt.getDay() + 0].substr(0, 3);
					break;
				case "j":
					op += d.toString();
					break;
				case "l":
					op += days[dt.getDay()];
					break;
				case "N":
					op += (dt.getDay() == 0) ? "7" : dt.getDay();
					break;
				case "S":
					if (yoodoo.words.language=='en') op += suffix[d - 1];
					break;
				case "w":
					op += dt.getDay();
					break;
				case "z":
					op += doy;
					break;
				case "W":
					op += Math.ceil(doy / 7);
					break;
				case "F":
					op += months[m];
					break;
				case "m":
					var mn = m + 1;
					op += ((mn.toString().length == 1) ? "0" : "") + mn.toString();
					break;
				case "M":
					op += months[m].substr(0, 3);
					break;
				case "n":
					var mn = m + 1;
					op += mn.toString();
					break;
				case "t":
					op += daysInMonth[m];
					break;
				case "L":
					op += leapYear;
					break;
				case "Y":
					op += y.toString();
					break;
				case "y":
					op += y.toString().substr(-2);
					break;
				case "a":
					op += (hours < 12) ? "am" : "pm";
					break;
				case "A":
					op += (hours < 12) ? "AM" : "PM";
					break;
				case "g":
					op += (hours > 12) ? hours - 12 : hours;
					break;
				case "G":
					op += hours;
					break;
				case "h":
					var hrs = (hours > 12) ? hours - 12 : hours;
					op += ((hrs.toString().length == 1) ? "0" : "") + hrs;
					break;
				case "H":
					op += ((hours.toString().length == 1) ? "0" : "") + hours;
					break;
				case "i":
					op += ((minutes.toString().length == 1) ? "0" : "") + minutes;
					break;
				case "s":
					op += ((seconds.toString().length == 1) ? "0" : "") + seconds;
					break;
				default:
					op += L;
					break;
			}
		}
	}
	return op;
};
yoodoo.readDate=function(str) {
	if (/^\d+\/\d+\/\d+ \d+\:\d+\:\d+$/.test(str)) return this.stringToDate('Y/m/d H:i:s',str);
	if (/^\d+\/\d+\/\d+ \d+\:\d+$/.test(str)) return this.stringToDate('Y/m/d H:i',str);
	if (/^\d+\/\d+\/\d+$/.test(str)) return this.stringToDate('Y/m/d',str);
	if (/^\d+\-\d+\-\d+ \d+\:\d+\:\d+$/.test(str)) return this.stringToDate('Y-m-d H:i:s',str);
	if (/^\d+\-\d+\-\d+ \d+\:\d+$/.test(str)) return this.stringToDate('Y-m-d H:i',str);
	if (/^\d+\-\d+\-\d+$/.test(str)) return this.stringToDate('Y-m-d',str);
};
yoodoo.stringToDate=function(f,str) {
	var today=new Date();
	var D=today.getDate();
	var M=today.getMonth();
	var Y=today.getFullYear();
	var h=today.getHours();
	var m=today.getMinutes();
	var s=today.getSeconds();
	var morning=(h<=12);
	for(var l=0;l<f.length;l++) {
		var L=f.substr(l,1);
		switch(L) {
			case "d":
				var mD=str.match(/^\d+/);
				if (mD) {
					D=mD[0];
					str=str.replace(new RegExp('^'+mD[0]),'');
				}
			break;
			case "j":
				var mD=str.match(/^\d+/);
				if (mD) {
					D=mD[0];
					str=str.replace(new RegExp('^'+mD[0]),'');
				}
			break;
			case "D":
				var rem='';
				for(var i=0;i<this.days.length;i++) {
					if (str.substr(0,3)==this.days[i].substr(0,3)) rem=str.substr(0,3);
				}
				if (rem!="") str=str.replace(new RegExp('^'+rem),'');
			break;
			case "l":
				var rem='';
				for(var i=0;i<this.days.length;i++) {
					if (str.substr(0,this.days[i].length)==this.days[i]) rem=days[i];
				}
				if (rem!="") str=str.replace(new RegExp('^'+rem),'');
			break;
			case "N":
				str=str.replace(/^\d/,'');
			break;
			case "S":
				str=str.replace(/^[st|nd|rd|th]/,'');
			break;
			case "w":
				str=str.replace(/^\d/,'');
			break;
			case "z":
				str=str.replace(/^\d{1,3}/,'');
			break;
			case "W":
				str=str.replace(/^\d{1,2}/,'');
			break;
			case "F":
				var rem='';
				for(var i=0;i<this.months.length;i++) {
					if (str.substr(0,3)==this.months[i].substr(0,3)) rem=str.substr(0,3);
				}
				if (rem!="") str=str.replace(new RegExp('^'+rem),'');
			break;
			case "M":
				var rem='';
				for(var i=0;i<this.months.length;i++) {
					if (str.substr(0,this.months[i].length)==this.months[i]) rem=this.months[i];
				}
				if (rem!="") str=str.replace(new RegExp('^'+rem),'');
			break;
			case "m":
				var mD=str.match(/^\d{1,2}/);
				if (mD) {
					M=mD[0]-1;
					str=str.replace(new RegExp('^'+mD[0]),'');
				}
			break;
			case "n":
				var mD=str.match(/^\d{1,2}/);
				if (mD) {
					M=mD[0]-1;
					str=str.replace(new RegExp('^'+mD[0]),'');
				}
			break;
			case "t":
				str=str.replace(/^\d{1,2}/,'');
			break;
			case "Y":
				var mD=str.match(/^\d{4}/);
				if (mD) {
					Y=mD[0];
					str=str.replace(new RegExp('^'+mD[0]),'');
				}
			break;
			case "y":
				var mD=str.match(/^\d{2}/);
				if (mD) {
					Y=Y.substr(0,2)+mD[0];
					str=str.replace(new RegExp('^'+mD[0]),'');
				}
			break;
			case "a":
				morning=(str.substr(0,2)=="am");
				str=str.replace(/^\w\w/,'');
			break;
			case "A":
				morning=(str.substr(0,2)=="AM");
				str=str.replace(/^\w\w/,'');
			break;
			case "g":
				var mD=str.match(/^\d{1,2}/);
				if (mD) {
					h=(1*mD[0])+(morning?12:0);
					str=str.replace(new RegExp('^'+mD[0]),'');
				}
			break;
			case "G":
				var mD=str.match(/^\d{1,2}/);
				if (mD) {
					h=1*mD[0];
					str=str.replace(new RegExp('^'+mD[0]),'');
				}
			break;
			case "h":
				var mD=str.match(/^\d{1,2}/);
				if (mD) {
					h=(1*mD[0])+(morning?12:0);
					str=str.replace(new RegExp('^'+mD[0]),'');
				}
			break;
			case "H":
				var mD=str.match(/^\d{1,2}/);
				if (mD) {
					h=1*mD[0];
					str=str.replace(new RegExp('^'+mD[0]),'');
				}
			break;
			case "i":
				var mD=str.match(/^\d{1,2}/);
				if (mD) {
					m=1*mD[0];
					str=str.replace(new RegExp('^'+mD[0]),'');
				}
			break;
			case "s":
				var mD=str.match(/^\d{1,2}/);
				if (mD) {
					s=1*mD[0];
					str=str.replace(new RegExp('^'+mD[0]),'');
				}
			break;
			default:
				str=str.substr(1,str.length-1);
			break;
		}
	}
	return new Date(Y,M,D,h,m,s);
};

var Base64 = {

	// private property
	_keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

	// public method for encoding
	encode : function(input) {
		var output = "";
		var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
		var i = 0;

		input = Base64._utf8_encode(input);

		while (i < input.length) {

			chr1 = input.charCodeAt(i++);
			chr2 = input.charCodeAt(i++);
			chr3 = input.charCodeAt(i++);

			enc1 = chr1 >> 2;
			enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
			enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
			enc4 = chr3 & 63;

			if (isNaN(chr2)) {
				enc3 = enc4 = 64;
			} else if (isNaN(chr3)) {
				enc4 = 64;
			}

			output = output + this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) + this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);

		}

		return output;
	},

	// public method for decoding
	decode : function(input) {
		var output = "";
		var chr1, chr2, chr3;
		var enc1, enc2, enc3, enc4;
		var i = 0;

		input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

		while (i < input.length) {

			enc1 = this._keyStr.indexOf(input.charAt(i++));
			enc2 = this._keyStr.indexOf(input.charAt(i++));
			enc3 = this._keyStr.indexOf(input.charAt(i++));
			enc4 = this._keyStr.indexOf(input.charAt(i++));

			chr1 = (enc1 << 2) | (enc2 >> 4);
			chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
			chr3 = ((enc3 & 3) << 6) | enc4;

			output = output + String.fromCharCode(chr1);

			if (enc3 != 64) {
				output = output + String.fromCharCode(chr2);
			}
			if (enc4 != 64) {
				output = output + String.fromCharCode(chr3);
			}

		}

		output = Base64._utf8_decode(output);

		return output;

	},

	// private method for UTF-8 encoding
	_utf8_encode : function(string) {
		string = string.replace(/\r\n/g, "\n");
		var utftext = "";

		for (var n = 0; n < string.length; n++) {

			var c = string.charCodeAt(n);

			if (c < 128) {
				utftext += String.fromCharCode(c);
			} else if ((c > 127) && (c < 2048)) {
				utftext += String.fromCharCode((c >> 6) | 192);
				utftext += String.fromCharCode((c & 63) | 128);
			} else {
				utftext += String.fromCharCode((c >> 12) | 224);
				utftext += String.fromCharCode(((c >> 6) & 63) | 128);
				utftext += String.fromCharCode((c & 63) | 128);
			}

		}

		return utftext;
	},

	// private method for UTF-8 decoding
	_utf8_decode : function(utftext) {
		var string = "";
		var i = 0;
		var c = c1 = c2 = 0;

		while (i < utftext.length) {

			c = utftext.charCodeAt(i);

			if (c < 128) {
				string += String.fromCharCode(c);
				i++;
			} else if ((c > 191) && (c < 224)) {
				c2 = utftext.charCodeAt(i + 1);
				string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
				i += 2;
			} else {
				c2 = utftext.charCodeAt(i + 1);
				c3 = utftext.charCodeAt(i + 2);
				string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
				i += 3;
			}

		}

		return string;
	}
};
yoodoo.jsError = function(err) {
	if (err.url===undefined) err={error:err.message};
	//if (yoodoo.user.staff!==true) {
		err.callback = 'yoodoo.jsErrorSent';
		err.cmd = 'jserror';
		err.username = this.user.username;
		err.system = BrowserDetect.OS + ' ' + BrowserDetect.browser + ' ' + BrowserDetect.version;
		err.site = this.siteFolder;
		err.lastCommand = $(this.debuggerz.lastPost).html();
		if (err.url===undefined) {
			console.log(err);
			yoodoo.sendPost(null, err);
		}else{
			yoodoo.sendPost(null, err);
			//if (console !== undefined && console.log !== undefined)
			//	console.log(err);
			//ok
		}
	//}
};
yoodoo.jsErrorSent = function(done) {
	if (typeof(console) != 'undefined' && typeof(console.log) != 'undefined')
		console.log("error recorded");
	//ok
};


yoodoo.ifApp=function() {
	return typeof(yoodooApp)!='undefined';
};
yoodoo.appFunctionExists=function(names) {
	if (this.ifApp()) {
		var tmp=yoodooApp;
		while(names.length>0) {
			var nom=names.shift();
			if (tmp[nom]!==undefined) {
				tmp=tmp[nom];
			}else{
				return false;
			}
		}
		return true;
	}
	return false;
};


yoodoo.sendingU = null;
yoodoo.sendingF = null;
yoodoo.sendingFr = null;
yoodoo.pause = false;
yoodoo.postBuffer = [];
yoodoo.sendingPost = false;
yoodoo.sendPost = function(u, f) {
	if (!yoodoo.sendingPost) {
		if (f.cmd !== undefined)
			yoodoo.debuggerz.sendpost(f.cmd);
		if (yoodoo.debuggerz.getAllItems)
			f.getAllItems = 1;
		var otherData = true;
		if (arguments.length > 3)
			otherData = arguments[3];
		yoodoo.sendingPost = true;
		this.pause = false;
		f.userhash = this.loginCode;
		f.sitehash = this.sitehash;
		if (yoodoo.metaphor!==undefined) f.metaphor=yoodoo.metaphor;
		if (otherData) {
			var meta = this.changed_meta();
			f['record_metas'] = 1;
			for (var k in meta)
			f['meta_' + k] = meta[k];
			var ut = this.changed_users_totals();
			for (var k in ut)
			f['usersTotals_' + k] = ut[k];
		}
		if (this.serverTimeOffset !== undefined)
			f.timestamp = yoodoo.formatDate('d/m/Y H:i:s', new Date(new Date().getTime() + this.serverTimeOffset));
		if (yoodoo.loggedin)
			f.actionsLog = this.actionLogging.output();
		f.isApp=false;
		if (yoodoo.isApp===true) 
			f.isApp=true;
		if (this.trigger_list.length > 0) {
			f.triggers = [];
			while (this.trigger_list.length > 0)
			f.triggers.push(this.trigger_list.shift());
		}
		yoodoo.console(f);
		
		
		if(f.addTags===undefined) {
			if (dooit.addTags.length>0) {
				f.addtags=dooit.addTags.join(",");
			}
			if (dooit.removeTags.length>0) {
				f.removetags=dooit.removeTags.join(",");
			}
			dooit.addTags=[];
			dooit.removeTags=[];
		}
		
		
		if (u === null)
			u = this.option.yoodooPortal.url;
		u += '?r=' + new Date().getTime();
		if (arguments.length > 2)
			this.pause = arguments[2];
		if (this.pause)
			f.callback = 'yoodoo.console';
			
			this.sendingU = u;
			this.sendingF = f;
		if (this.ajax===true) {
			f.ajax=true;
			var callback=f.callback;
			var context=this;
			if (f.context!==undefined) {
				context=f.context;
				f.context=undefined;
			}
			$.ajax(u,{
				data:f,
				dataType:'text',
				type:'POST',
				context:context,
				complete:function() {
					//console.log(arguments);
					//eval(callback+'('+this.responseText+');');
					yoodoo.sendingPost=false;
					
					if (yoodoo.postBuffer.length > 0) {
						var toSend = yoodoo.postBuffer.shift();
						yoodoo.sendPost(toSend.u, toSend.f);
					}
				},
				success:function(r) {
					if (r=='error') {
						yoodoo.logout();
					}else{
						var f=eval(callback);
						if (typeof(f)=='function') f.apply(this,[r]);
					}
				}
			});
		}else{
			this.sendingF.context=undefined;
			this.sendingFr = yoodoo.e('iframe');
			//this.sendingFr.src=yoodoo.option.yoodooPortal.url;
			this.sendingFr.id = "yoodooPoster";
			this.sendingFr.loaded = false;
			document.body.appendChild(this.sendingFr);
			yoodoo.writeIframe();
		}
	} else {
		yoodoo.postBuffer.push({
			u : u,
			f : f
		});
	}
};

yoodoo.writeIframe = function() {
	if (!this.sendingFr.loaded) {
		this.initPostResponder();
		if (this.sendingFr.tries===undefined) this.sendingFr.tries=0;
		this.sendingFr.tries++;
		this.sendingFr.loaded = true;
		var doc = null;
		if (this.sendingFr.contentDocument) {
			doc = this.sendingFr.contentDocument;
			//console.log('For NS6');
		} else if (this.sendingFr.contentWindow) {
			doc = this.sendingFr.contentWindow.document;
			//console.log('For IE5.5 and IE6');
		} else if (this.sendingFr.document) {
			doc = this.sendingFr.document;
			//console.log('default');
		}
		if (doc !== null) {
			try{
				doc.open();
			}catch(e) {
				yoodoo.errorLog(e);
				if (this.sendingFr.tries>5) {
					alert("A security error is preventing this system from operating correctly");
					return false;
				}else{
					yoodoo.sendingFr.loaded=false;
					setTimeout('yoodoo.writeIframe()',200);
					return false;
				}
			}
			var op = '';
			op += "<html><head></head><body><form id='yoodooPost' action='" + this.sendingU + "' method='POST'>";
			for (k in this.sendingF) {
				if (this.sendingF[k]!==null &&  typeof (this.sendingF[k]) == "object" && this.sendingF[k].length > 0) {
					for (var i = 0; i < this.sendingF[k].length; i++) {
						op += "<textarea name='" + k + "[]'>" + this.sendingF[k][i] + "</textarea>";
					}
				} else if (this.sendingF[k]!==null){
					if (/^EF/.test(k))
						op += "<input type='text' name='fields[]' value='" + k.replace(/^EF/, '') + "' />";
					op += "<textarea name='" + k + "'>" + this.sendingF[k] + "</textarea>";
				}
			}
			op += "</form>";
			if (!this.pause && this.sendingF.cmd!='xmlbookcase2')
				op += "<script type='text/javascript'>document.getElementById('yoodooPost').submit();</script>";
			op += "</body></html>";
			//console.log(op);
			doc.writeln(op);
			doc.close();
			this.timeout = setTimeout('yoodoo.cancelPost()', this.timeoutDelay);
			$(this.sendingFr).bind('load', function() {
				var frw = yoodoo.sendingFr.contentWindow;
				if (frw.postMessage) {
					frw.postMessage('completed', yoodoo.option.baseUrl);
				} else {
					if (frw.completed) {
						frw.completed();
					}
				}
			});
		}
	}
};
yoodoo.cancelPost = function() {
	if (!this.pause) {
		yoodoo.sendingPost = false;
		this.removePostResponder();
		$(this.sendingFr).unbind('load');
		clearTimeout(this.timeout);
		this.timeout = null;
		if (this.sendingFr.parentNode)
			this.sendingFr.parentNode.removeChild(this.sendingFr);
		yoodoo.working(true, '<div class="oops">'+yoodoo.w('oops')+'<br /><button class="green" type="button">'+yoodoo.w('ok')+'</button></div>');
		$(this.wait).find('button.green').bind("click", function() {
			$(this).blur();
			yoodoo.working(false);
			yoodoo.clearFocus();
		});
		this.hide();
		if (yoodoo.postBuffer.length > 0) {
			var toSend = yoodoo.postBuffer.splice(0, 1)[0];
			yoodoo.sendPost(toSend.u, toSend.f);
		}
	}
};

yoodoo.postReply = function(e) {
	if (e.source != this.lastReplyFrame) {
		yoodoo.debuggerz.receivedpost();
		this.lastReplyFrame = e.source;
		yoodoo.removePostResponder();
		clearTimeout(yoodoo.timeout);
		yoodoo.timeout = null;
		var parts = yoodoo.translateXML(e.data).split('|');
		if (parts.length > 1) {
			if(/^error$/.test(parts[1])) {
			 	yoodoo.logout();
			 }else{
				var rg = '^' + parts[0].replace(/\./g, '\\.').replace(/\[/g, '\\[').replace(/\]/g, '\\]') + '\\|';
				var caller = new RegExp(rg);
				var op = e.data.replace(caller, '');
				eval(parts[0] + "('" + op.replace(/'/g, '\\\'') + "');");
			}
		} else if (/^error/.test(parts[0])) {
			return yoodoo.logout();
		}
		var fr = $('#yoodooPoster').get();
		for (var i = fr.length - 1; i >= 0; i--) {
			if (fr[i].contentWindow == e.source)
				fr[i].parentNode.removeChild(fr[i]);
		}

		yoodoo.clearFocus();
	}
	yoodoo.sendingPost = false;
	if (yoodoo.postBuffer.length > 0) {
		var toSend = yoodoo.postBuffer.splice(0, 1)[0];
		yoodoo.sendPost(toSend.u, toSend.f);
	}
};

yoodoo.thousands=function(n) {
	n=parseInt(n).toString();
	n=n.replace(/(\d)(\d\d\d)$/,'$1,$2').replace(/(\d\d\d\,)/g,',$1');
	return n.replace(/^\,/,'');
};




















window.onerror = function(error, url, line) {
	yoodoo.jsError({
		error : error,
		url : url,
		line : line
	});
};
yoodooKeylog = {};
window.onkeydown = function(e) {
	if (window.event) {
		yoodooKeylog[window.event.keyCode] = true;
	} else {
		yoodooKeylog[e.which] = true;
	}
};
window.onkeyup = function(e) {
	if (window.event) {
		yoodooKeylog[window.event.keyCode] = false;
	} else {
		yoodooKeylog[e.which] = false;
	}
};
window.onblur = function() {
	yoodooKeylog = {};
};
yoodoo.md5 = {
	hexcase : 0,
	b64pad : "",
	hex_md5 : function(s) {
		return this.rstr2hex(this.rstr_md5(this.str2rstr_utf8(s)));
	},
	b64_md5 : function(s) {
		return this.rstr2b64(this.rstr_md5(this.str2rstr_utf8(s)));
	},
	any_md5 : function(s, e) {
		return this.rstr2any(this.rstr_md5(this.str2rstr_utf8(s)), e);
	},
	hex_hmac_md5 : function(k, d) {
		return this.rstr2hex(this.rstr_hmac_md5(this.str2rstr_utf8(k), this.str2rstr_utf8(d)));
	},
	b64_hmac_md5 : function(k, d) {
		return this.rstr2b64(this.rstr_hmac_md5(this.str2rstr_utf8(k), this.str2rstr_utf8(d)));
	},
	any_hmac_md5 : function(k, d, e) {
		return this.rstr2any(this.rstr_hmac_md5(this.str2rstr_utf8(k), this.str2rstr_utf8(d)), e);
	},
	md5_vm_test : function() {
		return this.hex_md5("abc").toLowerCase() == "900150983cd24fb0d6963f7d28e17f72";
	},
	rstr_md5 : function(s) {
		return this.binl2rstr(this.binl_md5(this.rstr2binl(s), s.length * 8));
	},
	rstr_hmac_md5 : function(key, data) {
		var bkey = this.rstr2binl(key);
		if (bkey.length > 16)
			bkey = this.binl_md5(bkey, key.length * 8);
		var ipad = Array(16), opad = Array(16);
		for (var i = 0; i < 16; i++) {
			ipad[i] = bkey[i] ^ 0x36363636;
			opad[i] = bkey[i] ^ 0x5C5C5C5C;
		}
		var hash = this.binl_md5(ipad.concat(this.rstr2binl(data)), 512 + data.length * 8);
		return this.binl2rstr(this.binl_md5(opad.concat(hash), 512 + 128));
	},
	rstr2hex : function(input) {
		try {
			this.hexcase;
		} catch(e) {
			yoodoo.errorLog(e);
			this.hexcase = 0;
		}
		var hex_tab = this.hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
		var output = "";
		var x;
		for (var i = 0; i < input.length; i++) {
			x = input.charCodeAt(i);
			output += hex_tab.charAt((x >>> 4) & 0x0F) + hex_tab.charAt(x & 0x0F);
		}
		return output;
	},
	rstr2b64 : function(input) {
		try {
			this.b64pad;
		} catch(e) {
			yoodoo.errorLog(e);
			this.b64pad = '';
		}
		var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
		var output = "";
		var len = input.length;
		for (var i = 0; i < len; i += 3) {
			var triplet = (input.charCodeAt(i) << 16) | (i + 1 < len ? input.charCodeAt(i + 1) << 8 : 0) | (i + 2 < len ? input.charCodeAt(i + 2) : 0);
			for (var j = 0; j < 4; j++) {
				if (i * 8 + j * 6 > input.length * 8) {
					output += this.b64pad;
				} else {
					output += tab.charAt((triplet >>> 6 * (3 - j)) & 0x3F);
				}
			}
		}
		return output;
	},
	rstr2any : function(input, encoding) {
		var divisor = encoding.length;
		var i, j, q, x, quotient;
		var dividend = Array(Math.ceil(input.length / 2));
		for ( i = 0; i < dividend.length; i++)
			dividend[i] = (input.charCodeAt(i * 2) << 8) | input.charCodeAt(i * 2 + 1);
		var full_length = Math.ceil(input.length * 8 / (Math.log(encoding.length) / Math.log(2)));
		var remainders = Array(full_length);
		for ( j = 0; j < full_length; j++) {
			quotient = Array();
			x = 0;
			for ( i = 0; i < dividend.length; i++) {
				x = (x << 16) + dividend[i];
				q = Math.floor(x / divisor);
				x -= q * divisor;
				if (quotient.length > 0 || q > 0)
					quotient[quotient.length] = q;
			}
			remainders[j] = x;
			dividend = quotient;
		}
		var output = "";
		for ( i = remainders.length - 1; i >= 0; i--)
			output += encoding.charAt(remainders[i]);
		return output;
	},
	str2rstr_utf8 : function(input) {
		var output = "";
		var i = -1;
		var x, y;

		while (++i < input.length) {
			x = input.charCodeAt(i);
			y = i + 1 < input.length ? input.charCodeAt(i + 1) : 0;
			if (0xD800 <= x && x <= 0xDBFF && 0xDC00 <= y && y <= 0xDFFF) {
				x = 0x10000 + ((x & 0x03FF) << 10) + (y & 0x03FF);
				i++;
			}
			if (x <= 0x7F) {
				output += String.fromCharCode(x);
			} else if (x <= 0x7FF) {
				output += String.fromCharCode(0xC0 | ((x >>> 6 ) & 0x1F), 0x80 | (x & 0x3F));
			} else if (x <= 0xFFFF) {
				output += String.fromCharCode(0xE0 | ((x >>> 12) & 0x0F), 0x80 | ((x >>> 6 ) & 0x3F), 0x80 | (x & 0x3F));
			} else if (x <= 0x1FFFFF) {
				output += String.fromCharCode(0xF0 | ((x >>> 18) & 0x07), 0x80 | ((x >>> 12) & 0x3F), 0x80 | ((x >>> 6 ) & 0x3F), 0x80 | (x & 0x3F));
			}
		}
		return output;
	},
	str2rstr_utf16le : function(input) {
		var output = "";
		for (var i = 0; i < input.length; i++)
			output += String.fromCharCode(input.charCodeAt(i) & 0xFF, (input.charCodeAt(i) >>> 8) & 0xFF);
		return output;
	},
	str2rstr_utf16be : function(input) {
		var output = "";
		for (var i = 0; i < input.length; i++)
			output += String.fromCharCode((input.charCodeAt(i) >>> 8) & 0xFF, input.charCodeAt(i) & 0xFF);
		return output;
	},
	rstr2binl : function(input) {
		var output = Array(input.length >> 2);
		for (var i = 0; i < output.length; i++)
			output[i] = 0;
		for (var i = 0; i < input.length * 8; i += 8)
			output[i >> 5] |= (input.charCodeAt(i / 8) & 0xFF) << (i % 32);
		return output;
	},
	binl2rstr : function(input) {
		var output = "";
		for (var i = 0; i < input.length * 32; i += 8)
			output += String.fromCharCode((input[i >> 5] >>> (i % 32)) & 0xFF);
		return output;
	},
	binl_md5 : function(x, len) {
		x[len >> 5] |= 0x80 << ((len) % 32);
		x[(((len + 64) >>> 9) << 4) + 14] = len;
		var a = 1732584193;
		var b = -271733879;
		var c = -1732584194;
		var d = 271733878;

		for (var i = 0; i < x.length; i += 16) {
			var olda = a;
			var oldb = b;
			var oldc = c;
			var oldd = d;

			a = this.md5_ff(a, b, c, d, x[i + 0], 7, -680876936);
			d = this.md5_ff(d, a, b, c, x[i + 1], 12, -389564586);
			c = this.md5_ff(c, d, a, b, x[i + 2], 17, 606105819);
			b = this.md5_ff(b, c, d, a, x[i + 3], 22, -1044525330);
			a = this.md5_ff(a, b, c, d, x[i + 4], 7, -176418897);
			d = this.md5_ff(d, a, b, c, x[i + 5], 12, 1200080426);
			c = this.md5_ff(c, d, a, b, x[i + 6], 17, -1473231341);
			b = this.md5_ff(b, c, d, a, x[i + 7], 22, -45705983);
			a = this.md5_ff(a, b, c, d, x[i + 8], 7, 1770035416);
			d = this.md5_ff(d, a, b, c, x[i + 9], 12, -1958414417);
			c = this.md5_ff(c, d, a, b, x[i + 10], 17, -42063);
			b = this.md5_ff(b, c, d, a, x[i + 11], 22, -1990404162);
			a = this.md5_ff(a, b, c, d, x[i + 12], 7, 1804603682);
			d = this.md5_ff(d, a, b, c, x[i + 13], 12, -40341101);
			c = this.md5_ff(c, d, a, b, x[i + 14], 17, -1502002290);
			b = this.md5_ff(b, c, d, a, x[i + 15], 22, 1236535329);

			a = this.md5_gg(a, b, c, d, x[i + 1], 5, -165796510);
			d = this.md5_gg(d, a, b, c, x[i + 6], 9, -1069501632);
			c = this.md5_gg(c, d, a, b, x[i + 11], 14, 643717713);
			b = this.md5_gg(b, c, d, a, x[i + 0], 20, -373897302);
			a = this.md5_gg(a, b, c, d, x[i + 5], 5, -701558691);
			d = this.md5_gg(d, a, b, c, x[i + 10], 9, 38016083);
			c = this.md5_gg(c, d, a, b, x[i + 15], 14, -660478335);
			b = this.md5_gg(b, c, d, a, x[i + 4], 20, -405537848);
			a = this.md5_gg(a, b, c, d, x[i + 9], 5, 568446438);
			d = this.md5_gg(d, a, b, c, x[i + 14], 9, -1019803690);
			c = this.md5_gg(c, d, a, b, x[i + 3], 14, -187363961);
			b = this.md5_gg(b, c, d, a, x[i + 8], 20, 1163531501);
			a = this.md5_gg(a, b, c, d, x[i + 13], 5, -1444681467);
			d = this.md5_gg(d, a, b, c, x[i + 2], 9, -51403784);
			c = this.md5_gg(c, d, a, b, x[i + 7], 14, 1735328473);
			b = this.md5_gg(b, c, d, a, x[i + 12], 20, -1926607734);

			a = this.md5_hh(a, b, c, d, x[i + 5], 4, -378558);
			d = this.md5_hh(d, a, b, c, x[i + 8], 11, -2022574463);
			c = this.md5_hh(c, d, a, b, x[i + 11], 16, 1839030562);
			b = this.md5_hh(b, c, d, a, x[i + 14], 23, -35309556);
			a = this.md5_hh(a, b, c, d, x[i + 1], 4, -1530992060);
			d = this.md5_hh(d, a, b, c, x[i + 4], 11, 1272893353);
			c = this.md5_hh(c, d, a, b, x[i + 7], 16, -155497632);
			b = this.md5_hh(b, c, d, a, x[i + 10], 23, -1094730640);
			a = this.md5_hh(a, b, c, d, x[i + 13], 4, 681279174);
			d = this.md5_hh(d, a, b, c, x[i + 0], 11, -358537222);
			c = this.md5_hh(c, d, a, b, x[i + 3], 16, -722521979);
			b = this.md5_hh(b, c, d, a, x[i + 6], 23, 76029189);
			a = this.md5_hh(a, b, c, d, x[i + 9], 4, -640364487);
			d = this.md5_hh(d, a, b, c, x[i + 12], 11, -421815835);
			c = this.md5_hh(c, d, a, b, x[i + 15], 16, 530742520);
			b = this.md5_hh(b, c, d, a, x[i + 2], 23, -995338651);

			a = this.md5_ii(a, b, c, d, x[i + 0], 6, -198630844);
			d = this.md5_ii(d, a, b, c, x[i + 7], 10, 1126891415);
			c = this.md5_ii(c, d, a, b, x[i + 14], 15, -1416354905);
			b = this.md5_ii(b, c, d, a, x[i + 5], 21, -57434055);
			a = this.md5_ii(a, b, c, d, x[i + 12], 6, 1700485571);
			d = this.md5_ii(d, a, b, c, x[i + 3], 10, -1894986606);
			c = this.md5_ii(c, d, a, b, x[i + 10], 15, -1051523);
			b = this.md5_ii(b, c, d, a, x[i + 1], 21, -2054922799);
			a = this.md5_ii(a, b, c, d, x[i + 8], 6, 1873313359);
			d = this.md5_ii(d, a, b, c, x[i + 15], 10, -30611744);
			c = this.md5_ii(c, d, a, b, x[i + 6], 15, -1560198380);
			b = this.md5_ii(b, c, d, a, x[i + 13], 21, 1309151649);
			a = this.md5_ii(a, b, c, d, x[i + 4], 6, -145523070);
			d = this.md5_ii(d, a, b, c, x[i + 11], 10, -1120210379);
			c = this.md5_ii(c, d, a, b, x[i + 2], 15, 718787259);
			b = this.md5_ii(b, c, d, a, x[i + 9], 21, -343485551);

			a = this.safe_add(a, olda);
			b = this.safe_add(b, oldb);
			c = this.safe_add(c, oldc);
			d = this.safe_add(d, oldd);
		}
		return Array(a, b, c, d);
	},
	md5_cmn : function(q, a, b, x, s, t) {
		return this.safe_add(this.bit_rol(this.safe_add(this.safe_add(a, q), this.safe_add(x, t)), s), b);
	},
	md5_ff : function(a, b, c, d, x, s, t) {
		return this.md5_cmn((b & c) | ((~b) & d), a, b, x, s, t);
	},
	md5_gg : function(a, b, c, d, x, s, t) {
		return this.md5_cmn((b & d) | (c & (~d)), a, b, x, s, t);
	},
	md5_hh : function(a, b, c, d, x, s, t) {
		return this.md5_cmn(b ^ c ^ d, a, b, x, s, t);
	},
	md5_ii : function(a, b, c, d, x, s, t) {
		return this.md5_cmn(c ^ (b | (~d)), a, b, x, s, t);
	},
	safe_add : function(x, y) {
		var lsw = (x & 0xFFFF) + (y & 0xFFFF);
		var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
		return (msw << 16) | (lsw & 0xFFFF);
	},
	bit_rol : function(num, cnt) {
		return (num << cnt) | (num >>> (32 - cnt));
	}
};
