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
yoodoo.clearTransition = function(obj) {
	if (this.canHTML) {
		$(obj).css({
			rotate3d : '0,0,0,0deg',
			scale : 1
		});
	} else {
		$(obj).css({
			rotate3d : '0,0,0,0deg',
			scale : 1
		});
	}
};
yoodoo.hideAnimation = function(obj, complete) {
	var callback=function(){};
	yoodoo.showPlaya();
	if (typeof complete == 'function') callback=complete;
	if (this.canHTML) {
		$(obj).transition({
			perspective : '500px',
			rotate3d : '1,0,0,90deg',
			scale : 0.5
		}, function() {
			$(this).hide();
			callback();
		});
	} else {
		$(obj).slideUp(500, complete);
	}
};
yoodoo.revealAnimation = function(obj, complete) {
	var callback=function(){};
	if (typeof complete == 'function') callback=complete;
	if (this.canHTML) {
		if ($(obj).css("display") == "none")
			$(obj).css({
				perspective : '500px',
				rotate3d : '1,0,0,90deg',
				scale : 0.5,
				display : 'block'
			});
		$(obj).transition({
			perspective : '500px',
			rotate3d : '1,0,0,0deg',
			scale : 1
		}, function() {
			yoodoo.hidePlaya();
			callback();
		}
	);
	} else {
		$(obj).slideDown(500, complete);
	}
};

yoodoo.message = function(txt) {
	var t = null;
	if (arguments.length > 1)
		t = arguments[1];
	this.working(true, '<div class="oops">' + txt + '<br /><button class="green" type="button">OK</button></div>');
	this.wait.timeout = null;
	if (t != null) {
		this.wait.timeout = setTimeout('yoodoo.working(false);', t * 1000);
	}
	$(this.wait).find('button.green').bind("click", function() {
		if (yoodoo.wait.timeout !== null)
			clearTimeout(yoodoo.wait.timeout);
		$(this).blur();
		yoodoo.working(false);
		yoodoo.clearFocus();
	});
};
yoodoo.alertWindow = null;
yoodoo.alert = function() {
	var txt = '';
	var buttons = [];
	var t = 0;
	if (arguments.length > 0)
		txt = arguments[0];
	if (arguments.length > 1)
		buttons = arguments[1];
	if (arguments.length > 2)
		t = arguments[2];
	if (buttons.length == 0 && t == 0)
		buttons = [['OK', 'yoodoo.alert();']];
	if (txt == '') {
		if (this.alertWindow !== null) {
			$(this.alertWindow).remove();
			clearTimeout(this.alertWindow.timer);
			this.alertWindow = null;
		}
	} else {
		if (this.alertWindow === null && this.frame !== null) {
			this.alertWindow = yoodoo.e("div");
			this.alertWindow.id = 'yoodooAlert';
			$(this.alertWindow).css("display", "none");
			$(this.alertWindow).css("width", yoodoo.option.width + "px");
			txt += "<div class='alertButtons'>";
			for (var i = 0; i < buttons.length; i++) {
				txt += "<button type='button' onclick='" + buttons[i][1] + "'>" + buttons[i][0] + "</button>";
			}
			txt += "</div>";
			if (t == 0) {
				$(this.alertWindow).html(txt);
				$(this.alertWindow).css({
					height : "80px",
					padding : ((yoodoo.option.height - 80) / 2) + "px 0 " + ((yoodoo.option.height - 80) / 2) + "px 0",
					display : "block"
				});
			} else {
				var bound = yoodoo.e("div");
				$(bound).css({
					padding : '10px 0px'
				}).html(txt);
				this.alertWindow.appendChild(bound);
				$(this.alertWindow).css({
					display : "none"
				});
			}
			this.frame.appendChild(this.alertWindow);
			if (t != 0) {
				this.alertWindow.timer = setTimeout('$(yoodoo.alertWindow).slideUp(500,function(){$(this).remove();yoodoo.alertWindow=null;});', t * 1000);
				$(this.alertWindow).slideDown(500, function() {

				});
			}
		}
	}
};
yoodoo.loaded = function() {
	this.plugins.ready();
	this.loaderInfo.innerHTML = 'Rendering...';
	this.fetchSiteSettings();
	this.frame = $('#yoodooWidget').get(0);
	$(this.frame).css('width', yoodoo.option.width + "px");
	$(this.frame).css('height', yoodoo.option.height + "px");
	this.yoodooVoiceoverPlayerHolder = yoodoo.e("div");
	this.yoodooVoiceoverPlayerHolder.id = 'yoodooVoiceoverPlayerHolder';
	this.frame.appendChild(this.yoodooVoiceoverPlayerHolder);
	this.container = yoodoo.e("div");
	this.container.id = 'yoodooContainerContent';
	this.area = yoodoo.e("div");
	this.area.id = 'yoodooContainerContentArea';
	this.wait = yoodoo.e("div");
	$(this.wait).hide();
	this.wait.id = 'yoodooWait';

	yoodooStyler.build_styles();

	$(this.wait).css("width", yoodoo.option.width + "px");
	var topPadding = Math.floor((this.option.height - this.workingHeight) / 2);
	var bottomPadding = this.option.height - this.workingHeight - topPadding;
	$(this.wait).css({
		padding : topPadding + "px 0 " + bottomPadding + "px 0",
		height : this.workingHeight
	});
	$(this.container).css("width", yoodoo.option.width + "px");
	$(this.container).css("height", yoodoo.option.height + "px");
	this.ready = true;
	if (this.html5) {
		this.playaContainer = yoodoo.e('div');
		$(this.playaContainer).css("width", this.option.width + "px");
		$(this.playaContainer).css("height", this.option.height + "px");
		$(this.frame).css("position", "relative");
		$(this.playaContainer).css("position", "absolute");
		$(this.playaContainer).css("top", "0px");
		$(this.playaContainer).css("display", "none");
		$(this.frame).append(this.playaContainer);
		this.episodeContainer = yoodoo.e('div');
		$(this.episodeContainer).css("width", this.option.width + "px");
		$(this.episodeContainer).css("height", this.option.height + "px");
		$(this.episodeContainer).css("position", "absolute");
		$(this.episodeContainer).css("top", "0px");
		$(this.episodeContainer).css("display", "none");
		$(this.frame).append(this.episodeContainer);
		this.playa = yoodooPlaya.init(this.playaContainer);
		$(this.frame).append(this.container);
		$(this.frame).append(this.wait);
		this.insertVoiceover();
		this.showLogin();
	} else {
		$(this.frame).append(this.container);
		$(this.frame).append(this.wait);
		if (this.flash.minimumVersion > swfobject.getFlashPlayerVersion().major) {
			var pad = ((yoodoo.option.height - 80) / 2);
			this.display('<div style="text-align:center;height:80px;padding:' + pad + 'px 0 ' + pad + 'px 0;color:#ddd">To access the YooDoo widget you need to install at least <a href="' + this.flash.getFlashURL + '" target="_blank">Flash ' + this.flash.minimumVersion + '</a></div>');
		} else {
			this.insertVoiceover();
			this.showLogin();
		}
	}
	this.working(false);
	if (this.lastHTML != "")
		this.display(this.lastHTML);
	this.doLoadActions();
	$(this.loaderInfo).remove();
};
yoodoo.removeiframe = function() {
	setTimeout("eez.removeElement('#yoodooPoster');", 200);
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
yoodoo.displaying = false;
yoodoo.display = function(content) {
	this.displaying = true;
	var reveal = true;
	if ( typeof (content) == "string")
		content = this.replaceMeta(content);
	if (arguments.length > 3)
		reveal = arguments[3];
	if (arguments.length > 2 && arguments[2]) {
		var isDooit = false;
		if (arguments.length > 1)
			isDooit = arguments[1];
		if (!isDooit)
			this.lastLoad = '';
		var fh = this.container.clientHeight;
		var o = this.frameit(content, isDooit);
		$(this.container).find('*').unbind('click');
		$(this.container).find('*').unbind('mouseover');
		$(this.container).find('*').unbind('mouseout');
		$(this.container).find('*').unbind('keyup');
		$(this.container).find('*').unbind('keydown');
		$(this.container).find('*').remove();
		//while(this.container.childNodes.length>0) this.container.removeChild(this.container.childNodes[0]);
		if ($(this.container).css('display') == "none") {
			if (!this.isApp)
				$(this.container).css({
					perspective : '200px',
					rotate3d : '1,0,0,90deg',
					scale : 0.5
				});
			//$(this.container).css("height", "0px");
			$(this.container).css("display", "block");
		}
		this.container.appendChild(o);
		if (reveal) {
			if (!this.isApp || true) {
				$('.overlayFooter.liveDooit').css("display", "none");

				yoodoo.revealAnimation(this.container, function() {
					$('.overlayFooter.liveDooit').fadeIn();
					yoodoo.displaying = false;
					if (yoodoo.postDisplay != undefined)
						yoodoo.postDisplay();
					yoodoo.postDisplay = undefined;
				});

				/*$(this.container).show().transition({perspective:'200px',rotate3d:'1,0,0,0deg',scale:1},function() {
				 $('.overlayFooter.liveDooit').fadeIn();
				 yoodoo.displaying = false;
				 if (yoodoo.postDisplay != undefined)
				 yoodoo.postDisplay();
				 yoodoo.postDisplay = undefined;
				 //$(this).transition({perspective:'200px',rotate3d:'1,0,0,0deg',scale:1});
				 });*/

				/*$(this.container).animate({
				 height : this.option.height + 'px'
				 }, this.animateDuration, 'swing', function() {
				 $('.overlayFooter.liveDooit').fadeIn();
				 yoodoo.displaying = false;
				 if (yoodoo.postDisplay != undefined)
				 yoodoo.postDisplay();
				 yoodoo.postDisplay = undefined;
				 });*/
			} else {
				yoodoo.displaying = false;
				if (yoodoo.postDisplay != undefined)
					yoodoo.postDisplay();
				yoodoo.postDisplay = undefined;
			}
		}
	} else {
		var isDooit = false;
		if (arguments.length > 1)
			isDooit = arguments[1];
		if (!isDooit)
			this.lastLoad = '';
		$(this.container).css("width", this.option.width + "px");
		var fh = this.container.clientHeight;
		if (this.ready) {
			$(this.container).css("maxHeight", this.option.height + "px");
			if ($(this.container).css('display') == "none") {
				if ( typeof (content) == "string") {
					$(this.container).empty().append(content);
				} else {
					$(this.container).html(content);
				}
				$(this.container).find('.overlayFooter.liveDooit').css("display", "none");
				/*$(this.container).slideDown(this.animateDuration, function() {
				$('.overlayFooter.liveDooit').fadeIn();
				yoodoo.displaying = false;
				if (yoodoo.postDisplay != undefined)
				yoodoo.postDisplay();
				yoodoo.postDisplay = undefined;
				});*/
				//$(this.whiteout).fadeIn();
			} else {
				var fh = this.container.clientHeight;
				$(this.container).css("height", fh + "px");
				$(this.container).html(content);
				if (reveal) {
					$(this.container).find('.overlayFooter.liveDooit').css("display", "none");

					/*$(this.container).transition({perspective:'200px',rotate3d:'1,0,0,90deg',scale:0.5},function() {
					 $('.overlayFooter.liveDooit').fadeIn();
					 yoodoo.displaying = false;
					 if (yoodoo.postDisplay != undefined)
					 yoodoo.postDisplay();
					 yoodoo.postDisplay = undefined;
					 $(this).transition({perspective:'200px',rotate3d:'1,0,0,0deg',scale:1});
					 });*/

					/*$(this.container).animate({
					 height : this.option.height + 'px'
					 }, this.animateDuration, 'swing', function() {
					 $('.overlayFooter.liveDooit').fadeIn();
					 yoodoo.displaying = false;
					 if (yoodoo.postDisplay != undefined)
					 yoodoo.postDisplay();
					 yoodoo.postDisplay = undefined;
					 });*/
				}
			}
			yoodoo.revealAnimation(this.container, function() {
				$('.overlayFooter.liveDooit').fadeIn();
				yoodoo.displaying = false;
				if (yoodoo.postDisplay != undefined)
					yoodoo.postDisplay();
				yoodoo.postDisplay = undefined;
			});
			if (!this.visible) {
				this.visible = true;
			}
			this.lastHTML = content;
		}
	}
};
yoodoo.revealComplete = function() {
};
yoodoo.reveal = function() {
	if (arguments.length > 0)
		yoodoo.revealComplete = arguments[0];
	$('.overlayFooter.liveDooit').css("display", "none");
	yoodoo.revealAnimation(this.container, function() {
		$('.overlayFooter.liveDooit').fadeIn();
		yoodoo.revealComplete();
		yoodoo.revealComplete = function() {
		};
	});
	/*$(this.container).animate({
	 height : this.option.height + 'px'
	 }, this.animateDuration, 'swing', function() {
	 $('.overlayFooter.liveDooit').fadeIn();
	 yoodoo.revealComplete();
	 yoodoo.revealComplete = function() {
	 };
	 });*/
};
yoodoo.frameit = function(ip) {
	var withFooter = true;
	if (arguments.length > 1)
		withFooter = arguments[1];
	var ins = '';
	if ( typeof (ip) == 'string')
		ins = ip;
	var op = yoodoo.e("div");
	var opc = yoodoo.e("div");
	opc.id = "yoodooScrolledArea";
	if (!this.isApp)
		$(opc).attr('style', 'overflow-x:none;overflow-y:auto;');
	if (ins != "")
		$(opc).html(ins);
	op.appendChild(opc);
	if (yoodoo.advisorPanel.retainer !== null) {
		withFooter = false;
		var of = yoodoo.e("div");
		of.className = "overlayFooter liveDooit";
		$(of).html("<button type='button' class='back footerbutton'>Back</button>");
		op.appendChild(of);
		if (dooitInformation.snapshotOwner !== null && dooitInformation.snapshotOwner != "")
			$(of).append("<em style='float:right'>by " + dooitInformation.snapshotOwner + '&nbsp;</em>');
		$(op).find('.overlayFooter.liveDooit>button.back').bind('click', function() {
			yoodoo.advisorPanel.show();
		});
	} else {
		if (!withFooter) {
			var of = yoodoo.e("div");
			of.className = "overlayFooter liveDooit";
			$(of).html("<button type='button' class='done'>" + yoodoo.option.buttons.frameclose + "</button>");
			op.appendChild(of);
			$(op).find('.overlayFooter.liveDooit>button.done').bind('click', function() {
				if ($(this).siblings('.scrapbookSaving').get().length == 0) {
					if ($('#yoodooWidget #yoodooScrolledArea>#comment_container').get().length == 0) {
						yoodoo.hide();
					} else {
						$(yoodoo.container).slideUp(500, function() {
							$(this).html('').css({
								display : "none"
							});
						});
					}
				}
			});
		}
	}
	if ( typeof (ip) != 'string')
		opc.appendChild(ip);
	$(opc).css("width", (yoodoo.option.width - 16) + "px");
	$(opc).css((this.isApp ? "min-height" : "height"), (yoodoo.option.height - 40) + "px");
	$(op).css("width", (yoodoo.option.width - 16) + "px");
	$(op).css((this.isApp ? "min-height" : "height"), (yoodoo.option.height - 16) + "px");
	if (!this.isApp)
		$(op).find('.overlayFooter.liveDooit').css("width", (yoodoo.option.width - 8) + "px");
	if (!withFooter) {
		$(opc).find('>div').css("zoom", yoodoo.option.flashMovie.zoom);
	} else {
		$(opc).find('form').css("zoom", yoodoo.option.flashMovie.zoom);
	}
	op.id = 'framed';
	return op;
};
yoodoo.scrollTo = function(obj) {
	var t = ($(obj).position().top - $('.dooitBox').position().top) - 100;
	$('#yoodooScrolledArea').animate({
		scrollTop : t
	});
};
yoodoo.hide = function(completed) {
	if (dooit !== undefined && dooit.close !== undefined)
		dooit.close();
	if ( typeof (scrapbooker) != 'undefined' && typeof (scrapbooker.destroy) != 'undefined')
		scrapbooker.destroy();
	yoodoo.stopVoiceover(true);
	clearTimeout(this.voiceovertimer);
	var sels = $(this.container).find('select').get();
	if (sels.length > 0) {
		for (var s = 0; s < sels.length; s++) {
			if ( typeof (sels.blockout) == "object")
				sels.blockout.parentNode.removeChild(sels.blockout);
			if ( typeof (sels.dropdown) == "object")
				sels.dropdown.parentNode.removeChild(sels.dropdown);
		}
	}
	var ips = $(this.container).find('input').get();
	if (ips.length > 0) {
		for (var s = 0; s < sels.length; s++) {
			if ( typeof (sels.listContainer) == "object")
				sels.listContainer.parentNode.removeChild(sels.listContainer);
		}
	}
	this.lastHTML = this.container.innerHTML;
	if (this.isApp) {
		$(this.container).css({
			display : "none"
		});
		$(this.whiteout).css({
			display : "none"
		});
		if ( typeof (completed) == "function")
			completed();
	} else {
		this.hideAnimation(this.container, completed);
		//$(this.container).slideUp(completed);
		$(this.whiteout).slideUp();
	}
	this.visible = false;
	this.clearFocus();
	yoodoo.showPlaya();
	//swfobject.getObjectById(yoodoo.option.flashMovie.id).focus();
	//this.option.flashMovie.object.focus();
};
yoodoo.show = function() {
	$(this.container).slideDown();
	$(this.whiteout).slideDown();
	this.visible = true;
};
yoodoo.insertFlash = function() {
	if (this.playerHolder == undefined || this.playerHolder === null) {
		this.playerHolder = yoodoo.e("div");
		this.playerHolder.id = 'yoodooPlayerHolder';
		this.frame.insertBefore(this.playerHolder, this.frame.childNodes[0]);
		if (this.swfobject.jquery) {
			this.option.flashMovie.object = $('#yoodooPlayerHolder');
			this.option.flashMovie.object.flash({
				swf : this.option.flashMovie.url,
				width : this.option.width,
				height : this.option.height,
				flashvars : this.option.flashMovie.flashvars,
				allowscriptaccess : this.option.flashMovie.scriptaccess,
				allowfullscreen : this.option.flashMovie.fullscreen,
				bgcolor : this.option.flashMovie.bgcolor,
				quality : this.option.flashMovie.quality,
				wmode : this.option.flashMovie.wmode,
				menu : "false",
				allowNetworking : 'all',
				id : this.option.flashMovie.id,
				name : this.option.flashMovie.id
			});
		} else {
			var params = {
				allowscriptaccess : this.option.flashMovie.scriptaccess,
				allowfullscreen : this.option.flashMovie.fullscreen,
				bgcolor : this.option.flashMovie.bgcolor,
				quality : this.option.flashMovie.quality,
				wmode : this.option.flashMovie.wmode,
				menu : "false",
				allowNetworking : 'all'
			};
			var attributes = {
				id : this.option.flashMovie.id,
				name : this.option.flashMovie.id
			};

			swfobject.embedSWF(this.option.flashMovie.url, "yoodooPlayerHolder", this.option.width, this.option.height, this.option.flashMovie.version, this.option.flashMovie.expressInstall, this.option.flashMovie.flashvars, params, attributes, yoodoo.flashLoaded);
		}
	}
};
yoodoo.insertVoiceover = function() {
	if (this.html5) {
		yoodooPlaya.audio.init();
	} else {
		if (this.swfobject.jquery) {
			this.option.voiceoverMovie.object = $('#yoodooVoiceoverPlayerHolder');
			this.option.voiceoverMovie.object.flash({
				swf : this.option.voiceoverMovie.url,
				width : this.option.voiceoverMovie.width,
				height : this.option.voiceoverMovie.height,
				flashvars : this.option.voiceoverMovie.flashvars,
				allowscriptaccess : this.option.voiceoverMovie.scriptaccess,
				allowfullscreen : this.option.voiceoverMovie.fullscreen,
				bgcolor : this.option.voiceoverMovie.bgcolor,
				quality : this.option.voiceoverMovie.quality,
				wmode : this.option.voiceoverMovie.wmode,
				menu : "false",
				allowNetworking : 'all',
				id : this.option.voiceoverMovie.id,
				name : this.option.voiceoverMovie.id

			});
		} else {
			var params = {
				allowscriptaccess : this.option.voiceoverMovie.scriptaccess,
				allowfullscreen : this.option.voiceoverMovie.fullscreen,
				bgcolor : this.option.voiceoverMovie.bgcolor,
				quality : this.option.voiceoverMovie.quality,
				wmode : this.option.voiceoverMovie.wmode,
				menu : "false",
				allowNetworking : 'all',
				volume : yoodoo.option.voiceoverMovie.flashvars.volume
			};
			var attributes = {
				id : this.option.voiceoverMovie.id,
				name : this.option.voiceoverMovie.id
			};

			swfobject.embedSWF(this.option.voiceoverMovie.url, "yoodooVoiceoverPlayerHolder", this.option.voiceoverMovie.width, this.option.voiceoverMovie.height, this.option.voiceoverMovie.version, this.option.voiceoverMovie.expressInstall, this.option.voiceoverMovie.flashvars, params, attributes, yoodoo.voiceoverLoaded);
		}
	}
};
yoodoo.playIntroMovie = function() {
	this.working(false);
	this.option.introMovie.player.play();
};
yoodoo.insertIntroMovie = function() {
	if (this.html5) {
		if (yoodooPlaya.videoFileType === null)
			yoodooPlaya.detectVideoFileType();
		if (yoodooPlaya.videoFileType !== null) {
			this.option.introMovie.object = $('#yoodooIntroPlayerHolder').css({
				width : this.option.introMovie.width,
				height : this.option.introMovie.height
			}).get(0);
			this.option.introMovie.player = yoodoo.e("video");
			$(this.option.introMovie.player).attr('width', '100%').attr('height', '100%').attr("controls", "yes");
			this.option.introMovie.object.appendChild(this.option.introMovie.player);
			this.option.introMovie.player.src = yoodooPlaya.videoTypeConvert(yoodoo.option.introMovie.flashvars.intro);
			$(this.option.introMovie.player).attr("onloadedmetadata", 'yoodoo.playIntroMovie()');
			$(this.option.introMovie.player).attr("onloadeddata", 'yoodoo.playIntroMovie()');
			$(this.option.introMovie.player).attr("oncanplay", 'yoodoo.playIntroMovie()');
			$(this.option.introMovie.player).attr("onended", 'yoodoo.finishedIntro()');
			this.option.introMovie.player.load();
		}
	} else {
		if (this.swfobject.jquery) {
			this.option.introMovie.object = $('#yoodooIntroPlayerHolder');
			this.option.introMovie.object.flash({
				swf : this.option.introMovie.url,
				width : this.option.introMovie.width,
				height : this.option.introMovie.height,
				flashvars : this.option.introMovie.flashvars,
				allowscriptaccess : this.option.introMovie.scriptaccess,
				allowfullscreen : this.option.introMovie.fullscreen,
				bgcolor : this.option.introMovie.bgcolor,
				quality : this.option.introMovie.quality,
				wmode : this.option.introMovie.wmode,
				menu : "false",
				allowNetworking : 'all',
				id : this.option.introMovie.id,
				name : this.option.introMovie.id

			});
		} else {
			var params = {
				allowscriptaccess : this.option.introMovie.scriptaccess,
				allowfullscreen : this.option.introMovie.fullscreen,
				bgcolor : this.option.introMovie.bgcolor,
				quality : this.option.introMovie.quality,
				wmode : this.option.introMovie.wmode,
				menu : "false",
				allowNetworking : 'all'
			};
			var attributes = {
				id : this.option.introMovie.id,
				name : this.option.introMovie.id
			};

			swfobject.embedSWF(this.option.introMovie.url, "yoodooIntroPlayerHolder", this.option.introMovie.width, this.option.introMovie.height, this.option.introMovie.version, this.option.introMovie.expressInstall, this.option.introMovie.flashvars, params, attributes, yoodoo.introLoaded);
		}
	}
};
yoodoo.introLoaded = function() {
	yoodoo.working(false);
};
yoodoo.removeIntroMovie = function() {
	if (this.html5) {
		$(this.option.introMovie.player).remove();
	} else {
		$(swfobject.getObjectById(yoodoo.option.introMovie.id)).remove();
	}
};
yoodoo.dooitFiles = null;
yoodoo.getStyleTags = function(s) {
	var sheets = [];
	var c = /<style.*?<\/style>/mig;
	if (c) {
		for (var i = 0; i < c.length; i++) {
			var html = c[i].replace(/^<style[^>]*>/i, '').replace(/<\/style>$/i, '');
			sheets.push(html);
		}
	}
	return sheets;
};
yoodoo.callFlash = function(f) {
	if (yoodoo.swfobject.jquery) {
		var pa = arguments;
		yoodoo.option.flashMovie.object.flash(function() {
			var params = [];
			for (var p = 1; p < pa.length; p++)
				params.push('pa[' + p + ']');
			var cmd = 'this.' + f + "(" + params.join(",") + ");";
			yoodoo.console(cmd);
			try {
				eval(cmd);
			} catch (err) {
			}
		});
	} else {
		var params = [];
		if (arguments.length > 1 && arguments[1] !== null) {
			for (var p = 1; p < arguments.length; p++)
				params.push('arguments[' + p + ']');
		}
		var cb = "swfobject.getObjectById(yoodoo.option.flashMovie.id)." + f + "(" + params.join(",") + ");";
		yoodoo.console(cb);
		try {
			eval(cb);
		} catch (err) {
		}
	}
};
yoodoo.playaObject = function() {
	return swfobject.getObjectById(yoodoo.option.flashMovie.id);
};
yoodoo.pauseVideo = function() {
	if (this.html5) {
		if (yoodooPlaya.movie.playHead.playing)
			yoodooPlaya.movie.playHead.pause();
	} else {
		yoodoo.playaObject().pauseVideo();
	}

};
yoodoo.setToWindow = function() {
	var w = 0;
	var h = 0;

	var meta = yoodoo.e("meta");
	meta.name = 'viewport';
	meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0, target-densitydpi=device-dpi';
	document.getElementsByTagName("head")[0].appendChild(meta);
	document.body.innerHTML = '';
	document.body.style.margin = "0px";
	document.body.style.padding = "0px";
	window.scrollTop = 0;
	window.scrollLeft = 0;
	w = window.outerWidth;
	h = window.outerHeight;
	if (w < h) {
		var t = 1 * h;
		h = w * 1;
		w = t;
	}
	yoodoo.option.width = w;
	yoodoo.option.height = h;
	var yw = yoodoo.e("div");
	yw.id = 'yoodooWidget';
	document.body.appendChild(yw);
	yw.style.height = h + "px";
	yw.style.width = w + "px";
};
yoodoo.showLogin = function() {
	yoodoo.events.trigger("showLogin", true);
	if (arguments.length > 0) {
		if (arguments[0] == "error") {
			this.stayin = false;
			localStorage.removeItem('userhash');
			this.loginCode = '';
		}
	}
	if (localStorage.getItem('userhash') != undefined && localStorage.getItem('userhash') != "" && !this.openAppOnRotate) {
		this.stayin = true;
		this.loginCode = localStorage.getItem('userhash');
		this.nextActions = ['yoodoo.welcome();'];
		//this.callXML();
		this.dashboard();
	} else {
		this.working(false);
		var o = '<div class="login"><nobr>' + this.replaceDomain(this.site.login_heading) + '</nobr><h2>Login</h2>';
		o += '<div style="padding:10px 0px" class="yd_overlay">';
		o += '<div><div>Username</div><input type="text" name="username" autocapitalize="off" /></div>';
		o += '<div class="password"><div>Password</div><input type="password" name="password" /></div>';
		o += '<center><button type="button" onclick="yoodoo.tryLogin();">login</button></center>';
		if (this.showForgotPassword) {
			o += '<div class="forgotten"><a href="javascript:void(0)" id="forgotPassword">Forgot my password</a>';
			o += "<div style='display:none'>Enter your Username above then click";
			o += "<center><button type='button' onclick='yoodoo.tryLogin()'>reset my password</button>&nbsp;&nbsp;<button type='button' onclick='yoodoo.showFullLoginForm()'>cancel</button></center>";
			o += '</div></div>';
		}
		o += '<div class="error" style="display:none"></div>';
		o += '</div>';
		if (this.html5available && this.detectflash())
			o += '<button type="button" class="green medium right" onclick="yoodoo.switchVersion()">' + (this.html5 ? 'Flash version' : 'HTML5 version') + '</button>';
		if (this.mobile) {
			o += "<div class='yd_mobileOptions'>";
			//o += "<center><label>Keep me logged in <input type='checkbox' id='stayin' /></label></center>";
			if (this.openAppOnRotate) {
				o += '<span>You were still logged in to the Web App.<br />Turn your device round to attempt to login.</span>';
			} else {
				o += '<button type="button" class="green' + (this.stayin ? '' : ' off') + '" onclick="yoodoo.stayin=!yoodoo.stayin;if (yoodoo.stayin) {$(this).removeClass(\'off\');}else{$(this).addClass(\'off\');};">Keep me logged in</button>';
				if (this.canApp && !this.isApp)
					o += '<button type="button" class="green deviceLandscape" onclick="yoodoo.openApp();">Open WebApp</button><span class="devicePortrait">Rotate your device for WebApp</span>';
			}
			o += "</div>";
		}
		o += '</div>';
		this.postDisplay = function() {
			$(this.frame).find('.login input[name=username]').bind('keyup', function(e) {
				var kc = yoodoo.keyCode(e);
				if (kc.enter)
					yoodoo.tryLogin();
			});
			$(this.frame).find('.login input[name=password]').bind('keyup', function(e) {
				if (e.which == 13)
					yoodoo.tryLogin();
			});
			$(this.frame).find('#forgotPassword').click(function() {
				if ($(this).next().css("display") == "none") {
					yoodoo.showingForgot = true;
					$(this).next().slideDown();
					$(this).slideUp();
					$(this.parentNode).prev().slideUp();
					$(this.parentNode).prev().prev().slideUp();
				}
			});
		};
		this.display(o);
		if (arguments.length > 0 && typeof (arguments[0]) == "string") {
			var err = $(yoodoo.frame).find('.login .error');
			var mes = arguments[0];
			if (mes == "error")
				mes = "You are no longer logged in";
			err.html(mes);
			err.slideDown(yoodoo.animateDuration);
			err.fadeIn(yoodoo.animateDuration);
			yoodoo.timer = setTimeout('yoodoo.hideError();', 3000);
		}
	}
};
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
			err.html('You need to provide both details');
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
		err.html('Your new password has been emailed to you');
		err.fadeIn(yoodoo.animationDuration);
		yoodoo.timer = setTimeout('yoodoo.hideError();', 8000);
		yoodoo.showFullLoginForm();
	} else {
		if (reply == "")
			reply = "There has been an issue. We apologise.";
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
		$(yoodoo.welcomeContainers.tabcontent[$(src.parentNode).find("button.on").removeClass("on").prevAll('button').get().length]).slideUp(500);
		$(yoodoo.welcomeContainers.tabcontent[$(src).addClass("on").prevAll('.tab').get().length]).slideDown(500);
	}
};
yoodoo.welcomeOpen = false;
yoodoo.closeWelcome = function() {
	this.welcomeOpen = false;
	this.hide();
};
yoodoo.welcome = function() {
	this.welcomeOpen = true;
	var w = this.option.width - 40;
	var h = this.option.height - 40;
	var tabs = ['My details', 'My password', 'Dashboard'];
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
	$(yoodoo.welcomeContainers.frame).append(err).append(messenger);
	yoodoo.welcomeContainers.content = yoodoo.e("div");
	yoodoo.welcomeContainers.tabarea = yoodoo.e("div");
	$(yoodoo.welcomeContainers.tabarea).css({
		position : 'relative'
	});
	if (this.first_login == 'true' || this.first_login === true)
		this.first_login = true;
	var ins = '<div class="yoodoo-title">' + this.replaceDomain(this.site.welcome_title) + '</div><h2 class="clear">' + this.home_screen_title + '</h2><center class="clear"><button type="button" id="continue" class="onlyContinue green reversed" onclick="yoodoo.closeWelcome();">Continue</button>';
	if (!yoodoo.bookcaseLoaded)
		ins += '<div id="xmlwaiting">Loading your journey, please wait...</div>';
	ins += '</center>';
	var logout = yoodoo.e("button");
	$(logout).attr("type", "button").addClass("logout medium right").html("Logout").bind("click", function() {
		yoodoo.logout();
	});

	$(yoodoo.welcomeContainers.content).css({
		width : w,
		height : h
	}).html(ins).append(yoodoo.welcomeContainers.tabarea);

	if (this.user.advisor || this.user.advised) {
		var bt = 'Open the advisor panel';
		var tt = [];
		var butins = '';
		if (this.user.advisor && (this.user.adviseeUnread > 0 || this.user.adviseeRequests > 0)) {
			butins = '';
			if (this.user.adviseeUnread > 0)
				butins += ' [' + this.user.adviseeUnread + ']';
			if (this.user.adviseeRequests > 0)
				butins += ' <b>[' + this.user.adviseeRequests + ']</b>';
			if (this.user.adviseeUnread > 0)
				tt.push("You have " + this.user.adviseeUnread + " message" + (this.user.adviseeUnread == 1 ? "" : "s") + " from your users.");
			if (this.user.adviseeRequests > 0)
				tt.push("You have " + this.user.adviseeRequests + " Doo-it" + (this.user.adviseeRequests == 1 ? "" : "s") + " requiring your acceptance.");
		} else if (this.user.advised && this.user.advisorUnread > 0) {
			butins = ' [' + this.user.advisorUnread + ']';
			tt.push("You have " + this.user.advisorUnread + " message" + (this.user.advisorUnread == 1 ? "" : "s") + " from your Advisor");
		}
		var bubble = '';
		if (tt.length > 0) {
			bt = tt.join('\n');
			bubble = "<div class='advisorBubble'><div>" + tt.join("<br />") + "<div class='spike'></div></div></div>";
			setTimeout('yoodoo.loseBubble();', 5000);
		}
		var adBut = yoodoo.e("button");
		$(adBut).html('Advisor panel' + butins + bubble).addClass('green medium right advisorButton').css({
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
	var availableHeight = Math.floor((h - ($(yoodoo.welcomeContainers.tabarea).offset().top - $(yoodoo.welcomeContainers.content).offset().top)));
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
	for (var t = 0; t < tabs.length; t++) {
		var tb = yoodoo.e("button");
		$(tb).attr("type", "button").html(tabs[t]).addClass('tab' + ((defaultTab == t) ? ' on' : ''));
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
			content : '<div style="text-align:center;padding:10px 0px 0px 0px;"><div class="commentIconOnly" onclick="yoodoo.comments.show()">' + yoodoo.comments.unreadButtonProcess() + '</div>comments</div>'
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
		label : 'email address',
		ref : 'emailaddress',
		length : 100,
		mobileType : 'email'
	}, {
		label : 'first name',
		ref : 'firstname',
		length : 20,
		keyup : function() {
			if (yoodoo.user.nickname == '')
				$(yoodoo.frame).find("input#nickname").val($(yoodoo.frame).find("input#firstname").val() + " " + $(yoodoo.frame).find("input#lastname").val());
		}
	}, {
		label : 'last name',
		ref : 'lastname',
		length : 20,
		keyup : function() {
			if (yoodoo.user.nickname == '')
				$(yoodoo.frame).find("input#nickname").val($(yoodoo.frame).find("input#firstname").val() + " " + $(yoodoo.frame).find("input#lastname").val());
		}
	}, {
		label : 'username',
		ref : 'username',
		length : 128,
		keydown : function(e) {
			var kc = yoodoo.keyCode(e);
			if (!kc.alpha && !kc.numeric && !kc.navigate) {
				e.preventDefault();
				return false;
			}
		}
	}, {
		label : 'nickname',
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
				err.html('Your username must contain something');
				err.fadeIn(yoodoo.animateDuration);
				yoodoo.timer = setTimeout('yoodoo.hideError();', 3000);
			} else {
				$(this).html("changing...");
				yoodoo.changeDetails(yoodoo.user.firstname, yoodoo.user.lastname, yoodoo.user.username, yoodoo.user.emailaddress, yoodoo.user.nickname);
			}
		}
	});

	$(yoodoo.welcomeContainers.tabcontent[0]).append(details).addClass(this.class_prefix + '_overlay');

	/* password */

	var password = yoodoo.e("div");

	if (!yoodoo.password_updated)
		$(password).html('<div class="alert">You must change your password before continuing, also supply an email address if it is not set in your details.</div>');
	var op = yoodoo.e('div');
	$(op).addClass("clear inputline").html('<label>your current password</label><input type="password" id="oldpassword" maxlength="20" />');
	var np = yoodoo.e('div');
	$(np).addClass("clear inputline").html('<label>your new password</label><input type="password" id="newpassword" maxlength="20" />');
	var npa = yoodoo.e('div');
	$(npa).addClass("clear inputline").html('<label>confirm new password</label><input type="password" id="newpasswordagain" maxlength="20" />');
	var but = yoodoo.e("button");
	$(but).attr("type", "button").addClass("green").css({
		'margin-left' : '250px',
		display : 'none'
	}).html("change");
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
					err.html('Your new password does not match the confirmation');
				} else {
					err.html('Your password must 6 or more letters and/or numbers');
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
		$(footer).addClass("footerLinks").html('<a href="javascript:void(0)" class="" onclick="yoodoo.showIntro(true)">Show intro</a>');
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
yoodoo.logout = function() {
	window.onbeforeunload = null;
	this.groups.groups = null;
	this.widgets = [];
	if (this.mobile) {
		this.stayin = false;
		localStorage.removeItem('userhash');
	}
	yoodoo.actionLogging.add('Logout', {});
	var params = {
		cmd : yoodoo.cmd.logout.server,
		callback : 'yoodoo.' + yoodoo.cmd.logout.callback
	};
	yoodoo.sendPost(null, params);
	this.loggedin = false;
	this.bookcase.items = [];
	this.user = {};
	this.username = '';
	this.showLogin();
	this.option.flashMovie.loaded = false;
	$('#' + this.option.flashMovie.id).remove();
	$(this.playerHolder).remove();
	this.playerHolder = undefined;
	yoodoo.events.trigger("logout");
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
	if (yoodoo.option.flashMovie.loaded) {
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
};
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
yoodoo.writeIframe = function() {
	if (!this.sendingFr.loaded) {
		this.initPostResponder();
		this.sendingFr.loaded = true;
		if (this.sendingFr.tries===undefined) this.sendingFr.tries=0;
		this.sendingFr.tries++;
		var doc = this.sendingFr.document;
		if (this.sendingFr.contentDocument) {
			doc = this.sendingFr.contentDocument;
			// For NS6
		} else if (this.sendingFr.contentWindow) {
			doc = this.sendingFr.contentWindow.document;
			// For IE5.5 and IE6
		} else if (this.sendingFr.document) {
			doc = this.sendingFr.document;
			// default*/
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
				if ( typeof (this.sendingF[k]) == "object" && this.sendingF[k].length > 0) {
					for (var i = 0; i < this.sendingF[k].length; i++) {
						op += "<textarea name='" + k + "[]'>" + this.sendingF[k][i] + "</textarea>";
					}
				} else {
					if (/^EF/.test(k))
						op += "<input type='text' name='fields[]' value='" + k.replace(/^EF/, '') + "' />";
					op += "<textarea name='" + k + "'>" + this.sendingF[k] + "</textarea>";
				}
			}
			op += "</form>";
			if (!this.pause)
				op += "<script type='text/javascript'>document.getElementById('yoodooPost').submit();</script>";
			op += "</body></html>";
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
		this.working(true, '<div class="oops">Oops, there seems to have been a problem. Maybe try again.<br /><button class="green" type="button">OK</button></div>');
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
yoodoo.lastReplyFrame = null;
yoodoo.postReply = function(e) {
	if (e.source != this.lastReplyFrame) {
		yoodoo.debuggerz.receivedpost();
		this.lastReplyFrame = e.source;
		yoodoo.removePostResponder();
		clearTimeout(yoodoo.timeout);
		yoodoo.timeout = null;
		var parts = yoodoo.translateXML(e.data).split('|');
		if (parts.length > 1) {
			/*if(/^error/.test(parts[1])) {
			 yoodoo.showLogin();
			 }else{*/
			var rg = '^' + parts[0].replace(/\./g, '\\.').replace(/\[/g, '\\[').replace(/\]/g, '\\]') + '\\|';
			var caller = new RegExp(rg);
			var op = e.data.replace(caller, '');
			eval(parts[0] + "('" + op.replace(/'/g, '\\\'') + "');");
			//}
		} else if (/^error/.test(parts[0])) {
			yoodoo.showLogin();
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
yoodoo.setIntroText = function(txt) {
	yoodoo.callFlash(yoodoo.cmd.introText.flash, txt);
};
yoodoo.setUsername = function(txt) {
	yoodoo.callFlash(yoodoo.cmd.setUsername.flash, txt);
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
	if (this.bookcase.tags != undefined) {
		for (var t = 0; t < this.bookcase.tags.length; t++) {
			if (this.bookcase.tags[t].name == tag)
				return true;
		}
	}
	return false;
};
yoodoo.setAutoProgress = function() {
	this.bookcase.autoProgress = true;
	if (arguments.length > 0)
		this.bookcase.autoProgress = arguments[0];
};
yoodoo.callXML = function() {
	var params = {
		cmd : yoodoo.cmd.bookshelfxml.server,
		callback : 'yoodoo.' + yoodoo.cmd.bookshelfxml.callback
	};
	yoodoo.sendPost(null, params);
};
yoodoo.gotXML = function(html) {
	this.working(false);
	this.bookcaseLoaded = true;
	var txt = yoodoo.decodeHTMLResponse(html);
	txt = yoodoo.replaceMeta(txt);

	if (this.html5) {
		try {
			eval('yoodooPlaya.' + yoodoo.cmd.bookshelfxml.playa + '(txt);');
		} catch (ex) {
			yoodoo.console("Failed to call playa");
		}
	} else {
		this.loadBookcase(txt);
	}
	this.doNextActions();
	if ($('#xmlwaiting').css('display') != "none")
		$('#xmlwaiting').slideUp(1000, function() {
		});

	/*if ($('button#continue').css("display") == "none" && yoodoo.bookcase.display_continue()) {
	 yoodoo.bookcase.fetchWidgets();
	 if (!yoodoo.bookcase.continueControl())
	 $('button#continue').fadeIn();
	 }*/
	this.getAverageScore();
};
yoodoo.doNextActions = function() {
	if (this.nextActions == undefined)
		this.nextActions = [];
	if (this.nextActions.length == 0 && arguments.length > 0) {
		arguments[0]();
	}
	while (this.nextActions.length > 0) {
		var act = this.nextActions.splice(0, 1)[0];
		//console.log(act);
		try {
			eval(act);
		} catch (e) {
			yoodoo.console('Failed: ' + act);
		}
	}
};
yoodoo.loadBookcase = function(txt) {
	if (this.bookcase === undefined) {
		this.bookcase = new this.element.bookcase(txt);
	} else {
		this.bookcase.parse(txt);
	}
	this.bookcase.handlers.bookcase_parsed();
};
yoodoo.inBookcase = function(type, id) {
	var forceToContentId = false;
	if (arguments.length > 2)
		forceToContentId = arguments[2];
	var item = null;
	if (type == 'dooit' && forceToContentId === false) {
		item = this.bookcase.fetchDooit(id);
	} else {
		item = this.bookcase.fetchContent(id);
	}
	if (item === null)
		return false;
	if (type == 'dooit' && item.intervention > 0 && yoodoo.bookcase.interventionLength(item.intervention) == 1) {
		return true;
	} else if (item.visible) {
		return true;
	}
	return false;
};
yoodoo.bookcaseIndex = function(type, id) {
	var forceToContentId = false;
	if (arguments.length > 2)
		forceToContentId = arguments[2];
	var item = null;
	if (type == 'dooit' && forceToContentId === false) {
		item = yoodoo.bookcase.fetchDooit(id);
	} else {
		item = yoodoo.bookcase.fetchContent(id);
	}
	if (item === null)
		return false;
	return (item.xmlindex >= 0) ? item.xmlindex : -1;
};
yoodoo.cdata = [];
yoodoo.parseXML = function(txt) {
	this.cdata = [];
	txt = txt.replace(/> +</g, '><');
	txt = txt.replace(/(<\!\[CDATA\[.*?\]\]>)/g, function(a, b) {
		yoodoo.cdata.push(b);
		return '<cdata' + yoodoo.cdata.length + '/>';
	});
	txt = txt.replace(/(<[^>]+>)([^<]+)(<\/[^>]+>)/g, "$1<![CDATA[$2]]>$3");
	txt = txt.replace(/<cdata(\d+)\/>/g, function(a, b) {
		return yoodoo.cdata[b - 1];
	});
	if (window.DOMParser) {
		parser = new DOMParser();
		xmlDoc = parser.parseFromString(txt, "text/xml");
		return xmlDoc.firstChild;
	} else// Internet Explorer
	{
		xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
		xmlDoc.async = false;
		xmlDoc.loadXML(txt);
		return xmlDoc.documentElement;
	}
};
yoodoo.bookcaseContentFilter = {
	show : {},
	hide : {}
};
yoodoo.clearBookcaseContentFilter = function() {
	this.bookcaseContentFilter = {
		show : {},
		hide : {}
	};
};
yoodoo.filterBookcase = function(content_id) {
	yoodoo.bookcaseContentFilter.hide[content_id] = true;
};
yoodoo.processFilterBookcase = function() {
	this.bookcase.filter();
};
yoodoo.removeXML = function(type, id, xml) {
	if (type == 'document')
		type = 'doc';
	var filter = new RegExp('<' + type + ' id="' + id + '".*?</' + type + '>', 'm');
	xml = xml.replace(filter, '');
	return xml;
};
yoodoo.nodeKids = function(node) {
	var keys = {};
	if (node.firstChild) {
		var kid = node.firstChild;
		while (kid !== null) {
			if (kid.firstChild) {
				if (kid.firstChild.nodeName != "#cdata-section") {
					keys[kid.firstChild.nodeName] = yoodoo.nodeKids(kid.firstChild);
				} else {
					keys[kid.nodeName] = kid.firstChild.data;
				}
			} else {
				keys[kid.nodeName] = kid.data;
			}
			kid = kid.nextSibling;
		}
	}
	return keys;
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
yoodoo.nextBook = function() {
	this.bookcase.gotoNextItem();
};
yoodoo.getbook = function() {
	var params = {
		cmd : yoodoo.cmd.currentbook.server,
		callback : 'yoodoo.' + yoodoo.cmd.currentbook.callback
	};
	yoodoo.sendPost(null, params);
};
yoodoo.getbookxml = function(book) {
	yoodoo.lastLoad = null;
	yoodoo.bookcase.handlers.episode_requested(book);

	var params = {
		cmd : yoodoo.cmd.bookxml.server,
		book : book
	};
	if (yoodoo.html5) {
		yoodoo.working(true);
		params.callback = 'yoodoo.' + yoodoo.cmdHTML5.bookxml.callback;
	} else {
		params.callback = 'yoodoo.' + yoodoo.cmd.bookxml.callback;
	}
	yoodoo.sendPost(null, params);
};
yoodoo.gotbook = function(r) {
	yoodoo.working(false);
	var txt = yoodoo.decodeHTMLResponse(r);
	txt = yoodoo.replaceMeta(txt);
	if (yoodoo.html5) {
		yoodooPlaya[yoodoo.cmdHTML5.bookxml.playa](txt);
	} else {
		yoodoo.callFlash(yoodoo.cmd.currentbook.flash, txt);
	}
	yoodoo.bookcase.handlers.episode_received();
};
yoodoo.gotbookxml = function(r) {
	yoodoo.working(false);
	var txt = yoodoo.decodeHTMLResponse(r);
	txt = yoodoo.replaceMeta(txt);

	if (yoodoo.html5) {
		yoodooPlaya[yoodoo.cmdHTML5.bookxml.playa](txt);
	} else {
		yoodoo.callFlash(yoodoo.cmd.bookxml.flash, txt);
	}
	yoodoo.bookcase.handlers.episode_received();
};
yoodoo.gotoChapter = function(episodeId, chapterId) {
	if (yoodoo.html5) {
		yoodooPlaya.autoplayChapter = chapterId;
		this.getbookxml(episodeId);
	} else {
		yoodoo.callFlash(yoodoo.cmd.chapter.flash, episodeId, chapterId);
	}
};
yoodoo.gotoKeypoint = function(episodeId, chapterId, keypointId) {
	if (yoodoo.html5) {
		yoodooPlaya.autoplayKeypoint = keypointId;
		yoodooPlaya.autoplayChapter = chapterId;
		this.getbookxml(episodeId);
	} else {
		yoodoo.callFlash(yoodoo.cmd.keypoint.flash, episodeId, chapterId, keypointId);
	}
};
yoodoo.getQuizXML = function(quiz) {
	yoodoo.actionLogging.add('open quiz', {
		id : quiz
	});
	yoodoo.events.trigger("loadQuiz", quiz);
	var params = {
		cmd : yoodoo.cmd.quiz.server,
		quiz : quiz,
		callback : 'yoodoo.' + yoodoo.cmd.quiz.callback
	};
	yoodoo.sendPost(null, params);
};
yoodoo.gotquizxml = function(r) {
	var txt = yoodoo.decodeHTMLResponse(r);
	txt = yoodoo.replaceMeta(txt);
	yoodoo.callFlash(yoodoo.cmd.quiz.flash, txt);
};
yoodoo.getStatus = function() {
	var params = {
		cmd : yoodoo.cmd.status.server,
		callback : 'yoodoo.' + yoodoo.cmd.status.callback
	};
	yoodoo.sendPost(null, params);
};
yoodoo.status = function(r) {
	if (/\|/.test(r)) {
		var prts = r.split('|');
		r = prts[0];
		this.option.uploadFolder = prts[1];
		this.option.dooitUrl += this.option.uploadFolder + '/';
	}
	if (r == "true") {
		this.loggedin = true;
		this.callXML();
		if (yoodoo.option.flashMovie.ports.login != "")
			this.callFlash(yoodoo.option.flashMovie.ports.login, yoodoo.username);
	} else {
		this.loggedin = false;
		this.showLogin();
		if (yoodoo.option.flashMovie.ports.logout != "")
			this.callFlash(yoodoo.option.flashMovie.ports.logout, 'loggedout');
	}
};
yoodoo.showEpisodeDooit = function(id) {
	yoodoo.working(true, 'Fetching your Doo-It...');
	if (yoodoo.loggedin) {
		if (yoodoo.lastLoad == id) {
			yoodoo.show();
		} else {
			yoodoo.lastLoad = id;
			var params = {
				cmd : yoodoo.cmd.episodedooit.server,
				dooit : id,
				callback : 'yoodoo.' + yoodoo.cmd.episodedooit.callback
			};
			yoodoo.sendPost(null, params);
		}
	}
};
yoodoo.loadDooit = 0;
yoodoo.closeDooitFunction = function() {
};
yoodoo.showDooit = function(id) {
	if (this.loggedin) {
		if (this.inBookcase('dooit', id)) {
			var doit = this.bookcase.byId(id);
			if (doit.intervention > 0)
				this.bookcase.showIntervention(doit.intervention, false);
			if (doit.voiceover && this.html5)
				yoodooPlaya.audio.preload(yoodoo.option.baseUrl + doit.voiceover.replace(/^\//, ''), {
					onUpdate : yoodoo.checkVoiceProgress,
					onComplete : yoodoo.voiceFinished
				});
			//this.setCurrentItem('dooit', id);
			var snapshot = 0;
			if (arguments.length > 1)
				snapshot = arguments[1];
			if (arguments.length > 2) {
				yoodoo.closeDooitFunction = arguments[2];
			} else {
				yoodoo.closeDooitFunction = function() {
				};
			}
			this.working(true, 'Fetching your Doo-It...');
			this.dooitShowTimestamp = new Date().getTime();
			this.processShowDooit(id, snapshot);
			this.actionLogging.add('enter dooit', {
				id : id
			});
			//}
			return true;
		} else {
			this.alert("This doo-it is not in your journey");
			return false;
		}
	} else {
		return false;
	}
};
yoodoo.processShowDooit = function(id, snapshot) {
	if (this.currentSiteFolder != this.siteFolder)
		this.currentSiteFolder = this.siteFolder;
	this.removeDooitDependencies();
	if ( typeof (dooit) != "undefined")
		dooit.dependenciesChecked = false;
	yoodoo.loadDooit = id;

	var params = {
		cmd : yoodoo.cmd.dooit.server,
		dooit : id,
		snapshot : snapshot,
		callback : 'yoodoo.' + yoodoo.cmd.dooit.callback
	};
	yoodoo.sendPost(null, params);
	this.bookcase.handlers.dooit_requested(id);
};
yoodoo.showUserDooit = function(id, userid) {
	this.working(true, 'Fetching user Doo-It...');
	if (this.currentSiteFolder != this.siteFolder)
		this.currentSiteFolder = this.siteFolder;
	this.removeDooitDependencies();
	if ( typeof (dooit) != "undefined")
		dooit.dependenciesChecked = false;
	yoodoo.loadDooit = id;
	var params = {
		cmd : yoodoo.cmd.dooit.server,
		dooit : id,
		dooitUser : userid,
		callback : 'yoodoo.' + yoodoo.cmd.dooit.callback
	};
	yoodoo.sendPost(null, params);
};
yoodoo.dooitVisited = function(id) {
	for (var i = 0; i < this.visitedDooits.length; i++) {
		if (this.visitedDooits[i] == id)
			return true;
	}
	return false;
};
yoodoo.hidePlaya = function() {
	if (this.html5) {
		yoodooPlaya.hideBookcase();
		//$(this.playaContainer).css("display", "none");
	} else {
		yoodoo.callFlash('suspendUI');
	}
};
yoodoo.showPlaya = function() {
	if (this.html5) {
		yoodooPlaya.showBookcase();
	} else {
		yoodoo.callFlash('unsuspendUI');
	}
};
yoodoo.removeDooitDependencies = function() {
	if (dooit.destroy != undefined) {
		try {
			dooit.destroy();
		} catch (e) {
		}
	}
	if (dooit != undefined) {
		dooit.removeTemporaries();
		if (yoodoo.dooitFiles !== null)
			yoodoo.dooitFiles.removeFiles();
		yoodoo.dooitFiles = null;
	}
};
//yoodoo.receivedDooitHTML= '';
yoodoo.gotDooit = function(html) {
	if (dooit != undefined)
		dooit.finished = function() {
			return true;
		};
	if (/^error/.test(html)) {
		this.showLogin();
	} else {
		//this.receivedDooitHTML = html;
		this.processGotDooit(html);
	}
	this.bookcase.handlers.dooit_received();
};
yoodoo.dooitScriptTag = null;
yoodoo.processGotDooit = function(html) {
	// var html = this.receivedDooitHTML;

	if (yoodoo.dooitScriptTag !== null)
		$(yoodoo.dooitScriptTag).remove();
	yoodoo.dooitScriptTag = yoodoo.e("script");
	$(yoodoo.dooitScriptTag).attr("type", "text/javascript");

	this.lastLoad = this.loadDooit;
	var doit = this.bookcase.byId(this.loadDooit);
	this.playVoice = !this.dooitVisited(this.lastLoad);
	if (this.playVoice)
		this.visitedDooits.push(this.lastLoad);
	html = yoodoo.replaceMeta(html);

	//$(yoodoo.dooitScriptTag).html(html);

	if (yoodoo.dooitScriptTag.text !== undefined) {
		yoodoo.dooitScriptTag.text = html;
	} else {
		yoodoo.dooitScriptTag.innerHTML = html;
	}
	$('head').append(yoodoo.dooitScriptTag);

	dooit.snapshots = [];
	//console.log(doit,dooitInformation);
	if (dooitInformation !== undefined) {
		dooitInformation.display = yoodoo.replaceMeta(Base64.decode(dooitInformation.display));
		dooitInformation.initialisation = yoodoo.replaceMeta(Base64.decode(dooitInformation.initialisation));
		this.helptext = dooitInformation.helptext = yoodoo.replaceMeta(Base64.decode(dooitInformation.helptext));
		this.dooitteaser = dooitInformation.teaser = yoodoo.replaceMeta(Base64.decode(dooitInformation.teaser));
		this.dooittitle = dooitInformation.title = yoodoo.replaceMeta(Base64.decode(dooitInformation.title));
		this.voiceoverfile = dooitInformation.voiceoverfile;
		dooit.canSnapshot = dooitInformation.canSnapshot;
		dooit.snapshots = jQuery.parseJSON(Base64.decode(dooitInformation.snapshots));
		for (var i = 0; i < dooit.snapshots.length; i++) {
			//dooit.snapshots[i].data=Base64.decode(dooit.snapshots[i].data);
			if (/^new Date/.test(dooit.snapshots[i].created)) {
				try {
					eval('dooit.snapshots[i].created=' + dooit.snapshots[i].created + ';');
					if (dooit.snapshots[i].created.getFullYear !== undefined)
						dooit.snapshots[i].created = new Date(dooit.snapshots[i].created.getTime() + yoodoo.serverTimeOffset);
				} catch(e) {
				}
			}
		}
		try {
			eval('dooitInformation.snapshot=' + Base64.decode(dooitInformation.snapshot));
		} catch(e) {
		}
		for (var k in array_of_fields) {
			if (dooitInformation.snapshot !== null && dooitInformation.snapshot[k] !== undefined) {
				array_of_fields[k][1] = yoodoo.replaceMeta(dooitInformation.snapshot[k][1]);
			} else {
				array_of_fields[k][1] = yoodoo.replaceMeta(Base64.decode(array_of_fields[k][1]));
			}
		}
	}
	yoodoo.display("<div class='dooitBox'>" + yoodoo.option.prefix + "</div>", true, true, false);
	var div = yoodoo.e("div");
	$(div).html(dooitInformation.display + "<div style='clear:both'></div>");
	$(div).find('div').first().addClass("dooitDisplay");
	$(yoodoo.container).find('.dooitBox').append(div);

	var overlayFooter = yoodoo.e("div");
	$(div).append($(overlayFooter).addClass("overlayFooter").addClass("liveDooit").css({
		width : (yoodoo.option.width - 8)
	}));

	var rel = yoodoo.e("div");
	$(overlayFooter).append($(rel).css({
		position : 'relative'
	}));

	var coverall = yoodoo.e("div");

	var dialog = yoodoo.e("div");

	var warning = yoodoo.e("div");
	$(rel).append($(warning).addClass('footerWarning').hide());

	var done = yoodoo.e("button");
	done.id = 'saveDooit';
	$(rel).append($(done).attr("type", "button").addClass("done").html(yoodoo.option.buttons.dooitsave).click(function() {
		var thisdooit = yoodoo.bookcase.fetchDooit(yoodoo.lastLoad);
		var needsApproval = (thisdooit !== null && ((thisdooit.completed === undefined || !thisdooit.completed) && thisdooit.advisor_accept && yoodoo.user.advised));
		var comp = dooit.finishable();
		if (comp === null)
			return false;
		if (comp && typeof (dooit.done) != "function")
			comp = dooit.done();
		var html = null;
		var cont = yoodoo.e("div");
		$(cont).css({
			'text-align' : 'center'
		});
		var dialogBox = dialog;
		if (comp !== null && comp != false && comp != '') {

			if (dooitInformation.snapshotOwner !== null && dooitInformation.snapshotOwner != "") {
				html = 'This data was created by ' + dooitInformation.snapshotOwner + '. <nobr>Saving it, will overwrite your own.</nobr> ';
				$(cont).html(html);
				var but = yoodoo.e("button");
				$(cont).append($(but).attr("type", "button").click(function() {
					dialogBox.close();
					yoodoo.processDooitSave();
				}).html('Save as mine'));

				var but = yoodoo.e("button");
				$(cont).append($(but).attr("type", "button").click(function() {
					if (yoodoo.intervention > 0) {
						yoodoo.hide();
						yoodoo.bookcase.showIntervention(null);
						setTimeout('yoodoo.welcome();', 500);
					} else {
						dialogBox.close();
					}
				}).html('cancel'));

			} else if (dooitInformation.snapshot !== null) {
				html = 'This data is from one of your snapshots. <nobr>Saving it, will overwrite your current version.</nobr> ';
				$(cont).html(html);
				var but = yoodoo.e("button");
				$(cont).append($(but).attr("type", "button").click(function() {
					dialogBox.close();
					yoodoo.processDooitSave();
				}).html('Save'));

				var but = yoodoo.e("button");
				$(cont).append($(but).attr("type", "button").click(function() {
					if (yoodoo.intervention > 0) {
						yoodoo.hide();
						yoodoo.bookcase.showIntervention(null);
						setTimeout('yoodoo.welcome();', 500);
					} else {
						dialogBox.close();
					}
				}).html('cancel'));

			} else if (needsApproval) {
				html = 'This doo-it will not be marked as complete until your advisor has accepted it. ';
				$(cont).html(html);
				var but = yoodoo.e("button");
				$(cont).append($(but).attr("type", "button").click(function() {
					dialogBox.close();
					yoodoo.processDooitSave();
				}).html('Continue to Save'));

				var but = yoodoo.e("button");
				$(cont).append($(but).attr("type", "button").click(function() {
					dialogBox.close();
				}).html('cancel'));
			} else {
				yoodoo.processDooitSave();
			}
		} else if (needsApproval) {
			html = 'You haven\'t yet finished. If you decide to leave anyway, your Advisor will be required to accept it before it is marked as complete. ';
			$(cont).html(html);
			var but = yoodoo.e("button");
			$(cont).append($(but).attr("type", "button").click(function() {
				dialogBox.close();
				yoodoo.processDooitSave();
			}).html('Leave anyway'));

			var but = yoodoo.e("button");
			$(cont).append($(but).attr("type", "button").click(function() {
				dialogBox.close();
			}).html('Stay for the moment'));

		} else {
			html = 'You haven\'t yet finished. ';
			$(cont).html(html);
			var but = yoodoo.e("button");
			$(cont).append($(but).attr("type", "button").click(function() {
				dialogBox.close();
				yoodoo.processDooitSave();
			}).html('Leave anyway'));

			var but = yoodoo.e("button");
			$(cont).append($(but).attr("type", "button").click(function() {
				dialogBox.close();
			}).html('Stay for the moment'));

		}
		if (html !== null) {
			dialog.show(cont);
		}
	}));

	var close = null;
	var justThisInIntervention = false;
	if (this.intervention === null) {
		close = yoodoo.e("button");
		$(rel).append($(close).attr("type", "button").addClass('footerbutton').html(yoodoo.option.buttons.dooitclose).click(function() {
			var dialogBox = dialog;
			var coverallBox = coverall;
			$(this).addClass("on");
			var cont = yoodoo.e("div");
			var but1 = yoodoo.e("button");
			$(but1).attr("type", "button").html("cancel").click(function() {
				dialogBox.close();
			}).css({
				margin : '0px 10px'
			});
			var but2 = yoodoo.e("button");
			$(but2).attr("type", "button").html("CLOSE without saving").click(function() {
				dialogBox.close();
				yoodoo.cancelDooit();
			}).css({
				margin : '0px 10px'
			});
			var but3 = yoodoo.e("button");
			$(but3).attr("type", "button").html("Save and close").click(function() {
				dialogBox.close();
				yoodoo.processDooitSave();
			}).css({
				margin : '0px 10px'
			});
			$(cont).append(but2).append(but3).append(but1).css({
				'text-align' : 'center'
			});
			dialog.show(cont);
		}));

		var scrapbook = yoodoo.e("button");
		if (!dooitInformation.isScrapbooked)
			$(scrapbook).addClass('scrapbookDooitAdd');
		$(rel).append($(scrapbook).addClass('scrapbookDooit').attr("type", "button").addClass('footerbutton').html('<div>' + yoodoo.option.buttons.scrapbooked + '</div><div></div>').click(function() {
			$(this).addClass("on");
			if (dooitInformation.isScrapbooked) {
				var dialogBox = dialog;
				var cont = yoodoo.e("div");
				var but1 = yoodoo.e("button");
				$(but1).attr("type", "button").html("Open Scrapbook").click(function() {
					//yoodoo.cancelDooit();
					dialogBox.close();
					yoodoo.showScrapbook();
				}).css({
					margin : '0px 10px'
				});
				var but2 = yoodoo.e("button");
				$(but2).attr("type", "button").html("Stay here").click(function() {
					dialogBox.close();
				}).css({
					margin : '0px 10px'
				});
				$(cont).append(but1).append(but2).css({
					'text-align' : 'center'
				});
				dialog.show(cont);
			} else {
				var dialogBox = dialog;
				var cont = yoodoo.e("div");
				var but1 = yoodoo.e("button");
				var me = this;
				$(but1).attr("type", "button").html("Yes").click(function() {
					var addButton = me;
					dialogBox.close();
					$(addButton).css({
						width : $(addButton).outerWidth(false)
					});
					//.html("adding&hellip;");
					yoodoo.dooitScrapped = function() {
						dooitInformation.isScrapbooked = true;
						var w = $(addButton).outerWidth(false);
						$(addButton).css({
							visibility : 'hidden',
							width : 'auto',
							overflow : 'hidden',
							'white-space' : 'nowrap'
						}).html(dooitInformation.isScrapbooked ? yoodoo.option.buttons.scrapbooked : yoodoo.option.buttons.scrapbook);
						var nw = $(addButton).outerWidth(false);
						$(addButton).css({
							visibility : 'visible',
							width : w
						}).animate({
							width : nw
						}, 200, function() {
							$(this).css({
								width : 'auto'
							});
						});
					};
					yoodoo.scrapbookAdd();
				}).css({
					margin : '0px 10px'
				});
				var but2 = yoodoo.e("button");
				$(but2).attr("type", "button").html("No").click(function() {
					dialogBox.close();
				}).css({
					margin : '0px 10px'
				});
				$(cont).html('Add to Scrapbook ? ').append(but1).append(but2).css({
					'text-align' : 'center'
				});
				dialog.show(cont);
			}
		}));

	} else {
		justThisInIntervention = this.bookcase.interventionLength(this.intervention) == 1;

	}
	if (this.intervention === null || justThisInIntervention === true) {
		var comments = yoodoo.e("button");
		$(rel).append($(comments).attr("type", "button").addClass('dooitComments').addClass('footerbutton').html('<div>' + yoodoo.option.buttons.dooitcomments + '</div><div><div>' + ((dooitInformation.comments > 0) ? dooitInformation.comments : '') + '</div></div>').click(function() {
			yoodoo.stopVoiceover();
			$(this).addClass("on");
			var cont = yoodoo.e("div");
			$(cont).css({
				height : yoodoo.option.height - 56
			});
			dialog.show(cont);
			var contentId = dooit.item.content_id;
			yoodoo.comments.build({
				contentId : contentId, // null = all, 0 = not content, >0 = to content only
				targetId : contentId, // contentId of the lowest item in the content hierarchy
				container : cont, // required
				//listWindow:element, // optional
				//inputWindow:element, // optional
				//filterWindow:element, // optional
				sharing : true, // true = sharing is available and the feed includes comments by other people
				targetOnly : false, // true = comments by this user from within a dooit (ring-fenced)
				sliding : true, // true = initiates a slider object
				title : 'Comments',
				//generalPostTitle:'Post a general comment',
				callbacks : {
					received : function(list) {
					},
					replies : function(item) {
					},
					newcomment : function(comment) {
					}
				}
			});
		}));

		if (dooit.canSnapshot) {

			var snapshotButton = yoodoo.e("button");
			$(rel).append($(snapshotButton).attr("type", "button").addClass('footerbutton').addClass('dooitSnapshots').html('<div>snapshots</div><div><div>' + ((dooit.snapshots.length > 0) ? dooit.snapshots.length : '') + '</div></div>').click(function() {
				$(this).addClass("on");
				var cont = yoodoo.e("div");
				$(cont).addClass("snapshotList");
				var bin = yoodoo.e("div");
				$(cont).append($(bin).addClass("snapshotBin"));
				$(bin).droppable({
					drop : function(e, ui) {
						var item = ui.helper[0];
						if (window.confirm("Are you sure you wish to delete this Snapshot?")) {
							dooit.deleteSnapshot(item.snapshotId, function(data) {
								if (data == 'true') {
									dooit.snapshots.splice($(item).prevAll('.buttonDiv').get().length, 1);
									$(item).css({
										visibility : 'hidden',
										position : 'static'
									}).animate({
										width : 0
									}, 200, function() {
										$(this).remove();
									});
									$('button.dooitSnapshots').find('>div>div').html(dooit.snapshots.length);
								} else {
									alert("This Snapshot could not be deleted");
									$(item).css({
										position : 'static'
									});
								}
							});
						}
					},
					hoverClass : 'hover'
				});
				var dialogBox = dialog;
				for (var d = 0; d < dooit.snapshots.length; d++) {
					var when = new Date(dooit.snapshots[d].created.getTime() + yoodoo.serverTimeOffset);
					var snap = yoodoo.e("div");
					$(snap).addClass('buttonDiv').draggable({
						revert : 'invalid'
					});
					snap.title = 'saved ' + yoodoo.ago(when);
					if (dooitInformation.snapshotId == dooit.snapshots[d].id) {
						$(snap).addClass('viewing');
					} else {
						$(snap).click(function() {
							dooit.loadSnapshot(this.snapshotId);
						});
					}
					if (dooit.snapshots[d].inComment === true)
						$(snap).addClass('inComment');
					snap.snapshotId = dooit.snapshots[d].id;
					$(cont).append($(snap).html('<span></span>' + yoodoo.ago(when, true)));
				}
				var snap = yoodoo.e("div");
				$(snap).addClass('buttonDiv').click(function() {
					var me = this;
					$(this).addClass('saving');
					dooit.createSnapshot(function(data) {
						var sh = jQuery.parseJSON(Base64.decode(data));
						try {
							eval("sh.created=" + sh.created + ";");
							sh.created = new Date(sh.created.getTime() + yoodoo.serverTimeOffset);
						} catch(e) {
						}

						dooit.snapshots.push(sh);
						var snap = yoodoo.e("div");
						snap.title = 'saved ' + yoodoo.ago(sh.created);
						$(snap).addClass('buttonDiv').html('<span></span>' + yoodoo.ago(sh.created, true)).css({
							width : 0,
							opacity : 0
						});
						$(snap).insertBefore(me);
						$(snap).draggable({
							revert : 'invalid'
						});
						snap.snapshotId = sh.id;
						$(snap).click(function() {
							dooit.loadSnapshot(this.snapshotId);
						});
						$(me).removeClass('saving');
						$(snap).animate({
							width : 60,
							opacity : 1
						}, 200);
						$('button.dooitSnapshots').find('>div>div').html(dooit.snapshots.length);
					});
				});
				$(cont).append($(snap).addClass('addSnapshot').html('<span>+</span>new'));
				$(cont).css({
					'line-height' : '18px',
					'max-height' : yoodoo.option.height - 56
				}).click(function(e) {
					var type = e.target.nodeName.toLowerCase();
					var parentType = e.target.parentNode.nodeName.toLowerCase();
					if (type != "a" && type != "button" && parentType != "a" && parentType != "button" && !($(e.target).hasClass('buttonDiv')) && !($(e.target.parentNode).hasClass('buttonDiv'))) {
						dialogBox.close();
					}
				});
				dialog.show(cont);
			}));
		}
	}
	if (dooitInformation.helptext != "") {
		var help = yoodoo.e("button");
		$(rel).append($(help).attr("type", "button").addClass('footerbutton').addClass('dooitHelp').html('<div>' + yoodoo.option.buttons.helpbutton + '</div><div></div>').click(function() {
			$(this).addClass("on");
			var cont = yoodoo.e("div");
			var dialogBox = dialog;
			$(cont).css({
				'line-height' : '18px',
				'max-height' : yoodoo.option.height - 56
			}).html(dooitInformation.helptext).click(function(e) {
				var type = e.target.nodeName.toLowerCase();
				if (type != "a" && type != "button") {
					dialogBox.close();
				}
			});
			dialog.show(cont);
		}));
	}

	if (this.voiceoverfile != "") {
		var voiceover = yoodoo.e("button");
		voiceover.id = 'voiceoverbutton';
		if (this.playVoice)
			$(voiceover).addClass("isPlaying");
		$(rel).append($(voiceover).attr("type", "button").addClass('footerbutton').html('<div class="progress"><div class="bar"></div></div>').click(function() {

			if (yoodoo.playVoice) {
				var dur = 0;
				if (yoodoo.html5) {
					dur = yoodooPlaya.audio.status().currentTime;
				} else {
					dur = swfobject.getObjectById(yoodoo.option.voiceoverMovie.id).playHead();
				}
				yoodoo.actionLogging.add('dooit voiceover stopped', {
					id : yoodoo.lastLoad,
					duration : dur
				});
			} else {
				yoodoo.actionLogging.add('dooit voiceover restarted', {
					id : yoodoo.lastLoad
				});
			}
			yoodoo.voiceoverStartStop(this);
		}));
	}

	$(rel).append($(coverall).addClass('coverall').hide().css({
		height : yoodoo.option.height - 8
	}).click(function() {
		$(this).hide();
		$(dialog).slideUp();
		$('.footerbutton.on').removeClass("on");
		$(done).removeClass('unavailable');
		done.disabled = false;
	}));

	$(rel).append($(dialog).addClass('dialog').hide());
	dialog.show = function(element) {
		$(coverall).show();
		$(this).empty().append(element).slideDown();
	};
	dialog.close = function() {
		$(coverall).hide();
		$(this).slideUp();
		$('.footerbutton.on').removeClass("on");
	};

	yoodoo.events.trigger("loadDooit", {
		id : this.loadDooit,
		title : yoodoo.dooittitle
	});
	this.lastLoad = dooitInformation.dooitId;

	//console.log(html);
	this.checkSiteVersions();
	//if (initThis!==undefined) initThis();
	yoodoo.show();
	return false;

};
yoodoo.eraseDooit = function() {
	checkFinish = undefined;
	array_of_default_fields = undefined;
	array_of_global_fields = undefined;
	array_of_fields = undefined;
	dooittitle = '';
	dooitteaser = '';
	voiceoverfile = '';
	helptext = '';
	dooitInformation = undefined;
	initThis = undefined;
};
yoodoo.cancelDooit = function() {
	yoodoo.stopVoiceover();
	var dur = new Date().getTime() - yoodoo.dooitShowTimestamp;
	yoodoo.actionLogging.add('dooit closed', {
		id : yoodoo.lastLoad,
		duration : dur
	});
	dooit.leave();
	yoodoo.hide(yoodoo.closeDooitFunction);
	dooit.destroy();
	dooit.clearTagCache();
	this.bookcase.handlers.dooit_exit();
};
yoodoo.processDooitSave = function() {
	yoodoo.stopVoiceover();
	var dur = new Date().getTime() - yoodoo.dooitShowTimestamp;
	yoodoo.actionLogging.add('dooit saved', {
		id : yoodoo.lastLoad,
		duration : dur
	});
	dooit.leave();
	yoodoo.saveDooit();
	yoodoo.removeDooitDependencies();
	dooit.clearTagCache();
};
yoodoo.gotSnapshot = function() {
	this.warning({
		html : "Snapshot captured",
		autoClose : 3000
	});
	this.hideWarning();
};
yoodoo.ago = function(d) {
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
	if (brief) {
		if (dt < minute)
			return "just now";
		if (dt < hour)
			return "this hour";
		if (dt < day)
			return "today";
		if (dt < week)
			return "this week";
		if (dt < month)
			return "this month";
		var m = Math.floor(dt / month);
		if (m == 1)
			return "last month";
		return m + " months ago";
	} else {
		var q = 0;
		var u = "minute";
		if (dt < minute)
			return "just now";
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
			return "a " + u + " ago";
		return q + " " + u + "s ago";
	}
};
yoodoo.warningList = [];
yoodoo.warning = function(warning) {
	// warning={html:'some html',autoClose:2000,classes:'class1 class'}
	this.warningList.push(warning);
	this.showWarning();
};
yoodoo.showWarning = function() {
	if (this.warningList.length > 0) {
		if ($(this.container).find(".overlayFooter.liveDooit .footerWarning").css("display") == "none") {
			$(this.container).find(".coverall").css({
				height : yoodoo.option.height - 8,
				display : "block",
				opacity : 0
			});
			var warning = this.warningList.splice(0, 1)[0];
			var w = $(this.container).find(".overlayFooter.liveDooit .footerWarning");
			w.html(warning.html);
			if (warning.classes)
				w.addClass(warning.classes);
			w.get(0).opts = warning;
			if (warning.autoClose) {
				w.slideDown(function() {
					setTimeout('yoodoo.hideWarning()', this.opts.autoClose);
				});
			} else {
				w.slideDown();
			}
		}
	} else {
		if ($(this.container).find(".overlayFooter.liveDooit .footerWarning").css("display") != "none") {
			this.hideWarning();
		}
	}
};
yoodoo.hideWarning = function() {
	$(this.container).find(".overlayFooter.liveDooit .footerWarning").slideUp(function() {
		if (this.opts != undefined) {
			if (this.opts.classes)
				$(this).removeClass(this.opts.classes);
		}
		this.opts = undefined;
		$(this.parentNode).find(".coverall").css({
			display : 'none'
		});
		yoodoo.showWarning();
	});
};
yoodoo.xport = function() {
	if ( typeof (dooit.xport) == "function") {
		yoodoo.actionLogging.add('dooit export', {
			id : yoodoo.lastLoad
		});
		dooit.xport();
	}
};
yoodoo.xportType = function(o) {
	try {
		dooit.xport[o.title]();
	} catch (ex) {
		//alert("Export option "+o.innerHTML+" has failed");
	}
};
yoodoo.setExport = function() {
	$(this.frame).find('#dooitExport').fadeIn();
	if ( typeof (dooit.xport) == "function") {
	} else if ( typeof (dooit.xport) == "object") {
		var ins = '';
		for (var k in dooit.xport) {
			ins += "<button type='button' onclick='yoodoo.xportType(this)' class='" + k + "' title='" + k + "'>&nbsp;</button>";
		}
		var et = yoodoo.e("div");
		$(et).addClass("exportTypes");
		$(et).html(ins);
		var eb = $(this.frame).find('#dooitExport').get(0);
		eb.appendChild(et);
	}
};
yoodoo.dropExport = function() {
	$(this.frame).find('#dooitExport').css("display", "none");
};
yoodoo.getCSV = function(title, message, filename, csv) {
	yoodoo.actionLogging.add('dooit export CSV', {
		id : yoodoo.lastLoad
	});
	var exwin = window.open("", "csvExport", "width=400,height=100,location=0,menubar=0,resizable=0,status=0,toolbar=0,scrollbars=0");
	exwin.document.open("text/html");
	exwin.document.write("<html><head><title>" + title + "</title></head><body style='padding:0;margin:0' onload='self.focus();document.getElementById(\"getCSV\").submit()'><div style='position:fixed;width:100%;height:100%;background:#1a2d48;color:#fff'><a href='javascipt:void(0)' onclick='window.close()' style='color:#fff'>close</a><div style='margin:10px 0 0 0;text-align:center;'>" + message + "</div></div><form style='visibility:hidden' action='" + yoodoo.option.baseUrl + "csvDownload.php' method='POST' id='getCSV'><textarea name='csv'>" + csv + "</textarea><input type='hidden' name='filename' value='" + filename + "' /></form></body></html>");
	exwin.document.close();
};
yoodoo.getXLS = function(title, message, filename, html) {
	yoodoo.actionLogging.add('dooit export XLS', {
		id : yoodoo.lastLoad
	});
	var exwin = window.open("", "xlsExport", "width=400,height=100,location=0,menubar=0,resizable=0,status=0,toolbar=0,scrollbars=0");
	exwin.document.open("text/html");
	exwin.document.write("<html><head><title>" + title + "</title></head><body style='padding:0;margin:0' onload='self.focus();document.getElementById(\"getXLS\").submit()'><div style='position:fixed;width:100%;height:100%;background:#1a2d48;color:#fff'><a href='javascipt:void(0)' onclick='window.close()' style='color:#fff'>close</a><div style='margin:10px 0 0 0;text-align:center;'>" + message + "</div></div><form style='visibility:hidden' action='" + yoodoo.option.baseUrl + "xlsDownload.php' method='POST' id='getXLS'><textarea name='xls'>" + html + "</textarea><input type='hidden' name='filename' value='" + filename + "' /></form></body></html>");
	exwin.document.close();
};
yoodoo.playSound = function(url) {
	yoodoo.stopVoiceover();
	yoodoo.voiceFinishedCallback = function() {
	};
	if (arguments.length > 1)
		yoodoo.voiceFinishedCallback = arguments[1];
	yoodoo.stopSound();
	if (this.html5) {
		yoodooPlaya.audio.loadAndPlay(url, {
			onComplete : yoodoo.voiceFinished
		});
	} else {
		swfobject.getObjectById(yoodoo.option.voiceoverMovie.id).loadAndPlay(url);
	}
};
yoodoo.stopSound = function() {
	clearTimeout(yoodoo.voiceovertimer);
	if (this.html5) {
		yoodooPlaya.audio.pause();
	} else {
		swfobject.getObjectById(yoodoo.option.voiceoverMovie.id).PauseVoiceover('');
	}
};
yoodoo.startVoiceover = function(forced) {
	yoodoo.voiceFinishedCallback = function() {
	};
	if (yoodoo.voiceoverfile != "" && (forced || this.playVoice)) {
		if (this.html5) {
			yoodooPlaya.audio.play();
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
		yoodooPlaya.audio.pause();
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
yoodoo.loadLinkedFiles = function(c) {
	var files = [];
	var scripts = yoodoo.getScripts(c);
	var hd = document.getElementsByTagName("HEAD")[0];
	var content = /^[^>]*>(.+)<[^>]*>$/mi;
	for (var i = 0; i < scripts.length; i++) {
		if (/^<script/i.test(scripts[i])) {
			var myscript = scripts[i].match(content);
			/*if (/\$\(/.test(myscript[1])) {
			 myscript[1]=myscript[1].replace(/\$\(/g,'obj(');
			 }else{*/
			myscript[1] = myscript[1].replace("$('finishButton').style.display = (canFinish)?'block':'none';", "");
			var scr = yoodoo.e('script');
			scr.type = 'text/javascript';
			scr.text = myscript[1];
			//yoodoo.dooitFiles.push(scr);
			files.push(scr);
			hd.appendChild(scr);
		} else {
			if (!yoodoo.isLoadedScript(scripts[i])) {
				var fileParts = scripts[i].split('/');
				var fn = fileParts.pop();
				if (!this.ignoreFile(fn)) {
					var scr = yoodoo.e('script');
					scr.type = 'text/javascript';
					if (/^http\:\/\//i.test(scripts[i])) {
						scr.src = scripts[i];
					} else if (/^\//.test(scripts[i])) {
						scr.src = yoodoo.option.baseUrl + this.translate_version(scripts[i]);
					} else {
						scr.src = yoodoo.option.dooitUrl + this.translate_version(scripts[i]);
					}
					//yoodoo.dooitFiles.push(scr);
					files.push(scr);
					hd.appendChild(scr);
					yoodoo.loadedScriptFiles.push(scripts[i]);
				}
			}
		}
	}

	var sheets = yoodoo.getStyleSheets(c);
	for (var i = 0; i < sheets.length; i++) {
		if (!yoodoo.isLoadedStyle(sheets[i]) && yoodoo.validStylesheet(sheets[i])) {
			var myscript = sheets[i];
			var scr = yoodoo.e('link');
			scr.rel = 'stylesheet';
			scr.type = 'text/css';
			if (/^http\:\/\//i.test(sheets[i])) {
				scr.href = sheets[i];
			} else {
				scr.href = yoodoo.option.dooitUrl + sheets[i];
			}
			//yoodoo.dooitFiles.push(scr);
			files.push(scr);
			hd.appendChild(scr);
			yoodoo.loadedStyleSheets.push(sheets[i]);
		}
	}
	var styles = yoodoo.getStyleTags(c);
	for (var i = 0; i < styles.length; i++) {
		var scr = yoodoo.e('style');
		scr.type = 'text/css';
		scr.innerHTML = styles[i];
		//yoodoo.dooitFiles.push(scr);
		files.push(scr);
		hd.appendChild(scr);
	}
	return files;
};
yoodoo.displayDooit = function() {
	this.working(false);
	this.reveal(dooit.displayed);
	if (this.voiceoverfile != "") {
		this.voiceovertimer = setTimeout('yoodoo.startVoiceover(false)', 2000);
	}
};
yoodoo.runInitThis = function() {
	setTimeout(function() {
		if ( typeof (initThis) !== "undefined")
			initThis();
	}, 400);
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
yoodoo.showScrapbook = function() {
	var targetItem = null;
	if (arguments.length > 0) {
		targetItem = arguments[0];
		yoodoo.scrapbookedItem.type = "book";
		yoodoo.scrapbookedItem.id = targetItem;
	}
	if (this.html5)
		yoodooPlaya.hideBookcase();
	yoodoo.working(true, 'Fetching your Scrapbook...');
	if (yoodoo.loggedin) {
		yoodoo.actionLogging.add('Scrapbook opened', {});
		var params = {
			cmd : yoodoo.cmd.scrapbook.server,
			callback : 'yoodoo.' + yoodoo.cmd.scrapbook.callback
		};
		if (targetItem !== null)
			params.targetItem = targetItem;
		if ($('#filter_order_by').get().length > 0)
			params.filterorder = $('#filter_order_by').val();
		if ($('#filter_type').get().length > 0)
			params.filtertype = $('#filter_type').val();
		yoodoo.sendPost(null, params);
	}
};
yoodoo.fetchScrapbookPage = function(page, callback) {
	//yoodoo.working(true,'Fetching your Scrapbook...');
	if (yoodoo.loggedin) {
		yoodoo.actionLogging.add('Scrapbook page ' + page + ' fetched', {});
		var params = {
			cmd : yoodoo.cmd.scrapbook.server,
			callback : callback,
			page : page
		};
		if (arguments.length > 2) {
			for (var k in arguments[2])
			params[k] = arguments[2][k];
		}
		yoodoo.sendPost(null, params);
	}
};
yoodoo.scrapbookRemove = function(id) {
	yoodoo.working(true, 'Updating your Scrapbook...');
	yoodoo.actionLogging.add('Scrapbook remove', {
		id : id
	});
	var params = {
		cmd : yoodoo.cmd.scrapbookremove.server,
		scrapbook : id,
		callback : 'yoodoo.' + yoodoo.cmd.scrapbookremove.callback
	};
	yoodoo.sendPost(null, params);
};
yoodoo.scrapbookRemoveItem = function(id) {
	yoodoo.working(true, 'Updating your Scrapbook...');
	yoodoo.actionLogging.add('Scrapbook remove episode', {
		id : id
	});
	var params = {
		cmd : yoodoo.cmd.scrapbookremove.server,
		episode_id : id,
		callback : 'yoodoo.' + yoodoo.cmd.scrapbookremove.callback
	};
	yoodoo.sendPost(null, params);
};
yoodoo.wipedooit = function() {
	yoodoo.working(true, 'Updating your Scrapbook...');
	yoodoo.actionLogging.add('Scrapbook remove dooit', {
		id : yoodoo.lastLoad
	});
	var params = {
		cmd : yoodoo.cmd.wipedooit.server,
		dooit : yoodoo.lastLoad,
		callback : 'yoodoo.' + yoodoo.cmd.wipedooit.callback
	};
	yoodoo.sendPost(null, params);
};
yoodoo.scrapbookedItem = {
	type : null,
	id : null
};
yoodoo.scrapbookAdd = function() {
	//yoodoo.stopVoiceover();
	//yoodoo.working(true, 'Updating your Scrapbook...');
	yoodoo.actionLogging.add('Scrapbook add dooit', {
		id : yoodoo.lastLoad
	});
	yoodoo.scrapbookedItem.type = "dooit";
	yoodoo.scrapbookedItem.id = yoodoo.lastLoad;
	var params = {
		cmd : yoodoo.cmd.scrapbookadd.server,
		dooit : yoodoo.lastLoad,
		callback : 'yoodoo.' + yoodoo.cmd.scrapbookadd.callback
	};
	yoodoo.sendPost(null, params);
	yoodoo.events.trigger('scrapbookDooit', yoodoo.bookcase.items[yoodoo.bookcaseIndex('dooit', yoodoo.lastLoad)]);
};
yoodoo.scrapbookAddItem = function(id) {
	yoodoo.actionLogging.add('Scrapbook add episode', {
		id : id
	});
	yoodoo.working(true, 'Updating your Scrapbook...');
	yoodoo.scrapbookedItem.type = "book";
	yoodoo.scrapbookedItem.id = id;
	var params = {
		cmd : yoodoo.cmd.scrapbookadditem.server,
		episode_id : id,
		callback : 'yoodoo.' + yoodoo.cmd.scrapbookadditem.callback
	};
	yoodoo.sendPost(null, params);
	yoodoo.events.trigger('scrapbookPlayit', yoodoo.bookcase.items[yoodoo.bookcaseIndex('book', id)]);
};
yoodoo.gotScrapbookComments = function(html) {
	dooit.gotComments(html);
};
yoodoo.gotScrapbook = function(html) {
	//this.removeDooitDependencies();
	html = yoodoo.decodeHTMLResponse(html);
	html = yoodoo.replaceMeta(html);
	if (/^<\?xml/.test(html) || this.forceScrapbook) {
		yoodoo.renderScrapbook(html);
		yoodoo.events.trigger('loadScrapbook');
	} else {
		yoodoo.working(false);
		if (/^error/.test(html)) {
			this.showLogin();
		} else {
			if (this.loggedin) {
				//html=yoodoo.decodeHTMLResponse(html);
				html = html.replace(/<script.*?>.*?<\/script>/gi, '');
				this.loadLinkedFiles(html);
				html = html.replace(/<link.*?>/gi, '');
				html = html.replace(/<style.*?>.*?<\/style>/gi, '');
				html = "<div id='scrapbook'>" + html + "</div>";
				var tmp = yoodoo.e("div");
				tmp.id = 'scrapbook';
				tmp.innerHTML = html;
				var con = $(tmp).find('>div>div>.boxnt_content').get(0);
				$(con).removeClass('boxnt_content');
				tmp.appendChild(con);
				var re = $(tmp).find('>div:first').get(0);
				re.parentNode.removeChild(re);
				this.display(tmp, false, true);
				var launchers = $('a.button_link').get();
				for (var l = 0; l < launchers.length; l++) {
					var href = launchers[l].getAttribute('href');
					href = href.replace(/http:\/\/[^\/]*/i, '');
					if (/\/plan\/doo-it/.test(href)) {
						var did = href.match(/\/\d+\/$/)[0].replace(/\//g, '');
						$(launchers[l]).attr('href', 'javascript:yoodoo.showDooit(' + did + ')');
						var mainLink = $(launchers[l].parentNode.parentNode).find('.scrapbookDetails a').get(0);
						$(mainLink).attr('href', 'javascript:void(0)');
						mainLink.dooit = did;
						$(mainLink).bind('click', function() {
							yoodoo.showDooit(this.dooit);
						});
					} else if (/\/episode_id%3D/.test(href)) {
						var did = href.match(/episode_id%3D([^%]+)/);
						$(launchers[l]).attr('href', 'javascript:yoodoo.startEpisode(' + did[1] + ');yoodoo.hide();');
						var mainLink = $(launchers[l].parentNode.parentNode).find('.scrapbookDetails a').get(0);
						$(mainLink).attr('href', 'javascript:void(0)');
						mainLink.episode = did[1];
						$(mainLink).bind('click', function() {
							yoodoo.startEpisode(this.episode);
							yoodoo.hide();
						});
					} else if (/\/episode_launch_id%3D/.test(href)) {
						var did = href.match(/episode_launch_id%3D([^%]+)/);
						$(launchers[l]).attr('href', 'javascript:yoodoo.startEpisode(' + did[1] + ');yoodoo.hide();');
						var mainLink = $(launchers[l].parentNode.parentNode).find('.scrapbookDetails a').get(0);
						$(mainLink).attr('href', 'javascript:void(0)');
						mainLink.episode = did[1];
						$(mainLink).bind('click', function() {
							yoodoo.startEpisode(this.episode);
							yoodoo.hide();
						});
					}
				}
				$(this.container).find('.red_button').each(function(i, o) {
					$(o.parentNode).addClass("green medium");
					//$(o.parentNode).attr('href','javascript:void(0)');
					var t = $(o).find(".button_text").html();
					$(o.parentNode).html(t.replace(/[\n]+/g, ''));
				});
				$(this.container).find('.green_button').each(function(i, o) {
					$(o.parentNode).addClass("green medium reversed");
					//$(o.parentNode).attr('href','javascript:void(0)');
					var t = $(o).find(".button_text").html();
					$(o.parentNode).html(t.replace(/[\n]+/g, ''));
				});
				$(this.container).find('#filter_order_by').attr("onchange", "");
				$(this.container).find('#filter_type').attr("onchange", "");
				var imgs = $(this.container).find('img');
				for (var i = 0; i < imgs.length; i++) {
					var src = imgs[i].getAttribute("src");
					if (!(/^http\:\/\//.test(src))) {
						imgs[i].src = yoodoo.option.baseUrl + src;
					}
				}
			}
		}
	}
};
yoodoo.makeButton = function() {
	var j = 'javascript:yoodoo.login("' + yoodoo.user.username + '","' + yoodoo.user.password + '")';
	var a = yoodoo.e("a");
	a.href = j;
	$(a).html("Yoodoo auto login");
	document.body.appendChild(a);
};
yoodoo.scrapbookData = null;
yoodoo.scrapbookFiles = [];
yoodoo.renderScrapbook = function(html) {
	yoodoo.working(false);
	if (/^error/.test(html)) {
		this.showLogin();
	} else {
		if (this.loggedin) {
			this.removeDooitDependencies();
			var tmp = yoodoo.e("div");
			tmp.id = 'scrapbook';
			$(tmp).html("<div style='height:" + yoodoo.option.height + "px'><center style='padding:20% 0'>Loading Scrapbook files...</center></div>");
			this.display(tmp, false, true);
			var done = $(this.container).find('.overlayFooter.liveDooit button.done');
			done.unbind("click");
			done.bind("click", function() {
				if ($(this).siblings('.scrapbookSaving').get().length == 0) {
					if ( typeof (yoodooPlaya) != "undefined")
						yoodooPlaya.showBookcase();
					scrapbooker.dispose();
				}
			});
			this.scrapbookData = html;
			var scrapDep = [['overlay/addons/scrapbook.js', true], ['overlay/addons/scrapbook.css', true], ['overlay/addons/dialog.js', true], ['overlay/addons/eez.js', true], ['overlay/addons/eez.css', true],
			//['overlay/addons/scrapbookxml.js',true],
			['dooits/nicEdit.js', true], ['dooits/jquery-ui.js', true], ['dooits/inputs.js', true]];
			this.scrapbookFiles = this.checkDependencies(scrapDep, function() {
				yoodoo.scrapbookLoaded();
			});
		}
	}
};
yoodoo.scrapbookLoaded = function() {
	var s = 'overflow:hidden;width:' + (yoodoo.option.width - 16) + 'px;height:' + (yoodoo.option.height - 40) + 'px;';
	$('#yoodooScrolledArea').attr("style", s);
	scrapbooker.init({
		container : $('#scrapbook').get(0),
		xml : this.scrapbookData
	});
};
yoodoo.getScrapbookUser = function(id, group, callback) {
	var params = {
		cmd : 'manageScrapbook',
		method : 'scrapbookUser',
		userid : id,
		group : group,
		callback : callback
	};
	yoodoo.sendPost(null, params);
};
yoodoo.postDooitSave = function() {
};
yoodoo.saveDooit = function(e, o) {
	this.postDooitSave = function() {
	};
	var blind = false;
	if (arguments.length > 2)
		blind = arguments[2];
	if (!blind)
		yoodoo.stopVoiceover();
	if (!dooit.saved) {
		var finished = dooit.finishable();
		if (finished !== null) {
			var dv = dooit.values({
				blind : blind
			});
			var p = {};
			for (var k in dv)
			p[k] = dv[k];
			p.cmd = yoodoo.cmd.dooitsave.server;
			p.dooit = yoodoo.lastLoad;
			dv.completed = p.completed = finished ? '1' : '0';
			if (blind) {
				p.callback = 'yoodoo.' + yoodoo.cmd.bookshelfxml.callback;
			} else {
				p.callback = 'yoodoo.' + yoodoo.cmd.dooitsave.callback;
				yoodoo.working(true, 'Saving your information and recalculating your Journey');
			}
			yoodoo.sendPost(null, p, false);
			yoodoo.events.trigger('saveDooit', {
				dooit : yoodoo.bookcase.items[yoodoo.bookcaseIndex('dooit', p.dooit)],
				value : dv
			});
			if (finished) {
				this.bookcase.handlers.dooit_complete();
			}
			//if (!blind) {
			this.postDooitSave = function() {
				var progression = finished;
				// autoprogress if dooit is completed
				if (yoodoo.autoLoad != undefined && yoodoo.autoLoad != null && !isNaN(yoodoo.autoLoad))
					progression = yoodoo.bookcase.fetchDooit(yoodoo.autoLoad);
				yoodoo.autoLoad = undefined;
				yoodoo.bookcase.handlers.dooit_exit(progression);
			};
			//}
		} else {
			if (!blind)
				this.bookcase.handlers.dooit_exit(false);
			// do not autoprogress
		}
	} else {
		var progression = null;
		// autoprogress if dooit is completed
		if (yoodoo.autoLoad != undefined && yoodoo.autoLoad != null && !isNaN(yoodoo.autoLoad))
			progression = this.bookcase.fetchDooit(yoodoo.autoLoad);
		yoodoo.autoLoad = undefined;
		this.bookcase.handlers.dooit_exit(progression);
		yoodoo.hide();
	}
	yoodoo.closeDooitFunction();
};
yoodoo.clearDooit = function(e, o) {
	yoodoo.stopVoiceover();
	var p = dooit.values();
	for (var k in p) {
		if ( typeof (p[k]) == "string")
			p[k] = '';
	}
	p.cmd = yoodoo.cmd.dooitsave.server;
	p.dooit = yoodoo.lastLoad;
	p.callback = 'yoodoo.' + yoodoo.cmd.dooitsave.callback;
	yoodoo.working(true);
	yoodoo.sendPost(null, p);
};
yoodoo.dooitSaved = function(r) {
	this.working(false);
	if (yoodoo.autoLoad != undefined && yoodoo.autoLoad != null && !isNaN(yoodoo.autoLoad)) {
		this.nextActions.push('yoodoo.showDooit(' + yoodoo.autoLoad + ');');
		yoodoo.autoLoad = undefined;
		//} else {
		//setTimeout('yoodoo.progress();', 1000);
	}
	if (r == "saved") {
		yoodoo.hide();
		if (yoodoo.option.flashMovie.ports.closedDooit != "")
			yoodoo.callFlash(yoodoo.option.flashMovie.ports.closedDooit, 'closedDooit');
	} else {
		yoodoo.hide();
		eval('yoodoo.' + yoodoo.cmd.bookshelfxml.callback + "(r);");
		if (yoodoo.option.flashMovie.ports.closedDooit != "")
			yoodoo.callFlash(yoodoo.option.flashMovie.ports.closedDooit, 'closedDooit');
	}
	yoodoo.closeDooitFunction();
	this.postDooitSave();
};
yoodoo.changePassword = function(un, opw, npw) {
	$(yoodoo.welcomeContainers.tabcontent[1]).find('input,button').each(function(i, e) {
		e.disabled = true;
	});
	yoodoo.actionLogging.add('Changed password', {
		id : un
	});
	var params = {
		cmd : yoodoo.cmd.changepassword.server,
		password : escape(opw),
		newpass : escape(npw),
		callback : 'yoodoo.' + yoodoo.cmd.changepassword.callback
	};
	yoodoo.sendPost(null, params);
};
yoodoo.changeDetails = function(fn, ln, un, em, nn) {
	$(yoodoo.welcomeContainers.tabcontent[0]).find('input,button').each(function(i, e) {
		e.disabled = true;
	});
	yoodoo.actionLogging.add('Changed details', {
		id : un
	});
	var params = {
		cmd : yoodoo.cmd.changedetails.server,
		email : (em),
		firstname : (fn),
		lastname : (ln),
		username : (un),
		nickname : (nn),
		callback : 'yoodoo.' + yoodoo.cmd.changedetails.callback
	};
	yoodoo.sendPost(null, params);
};
yoodoo.detailsChanged = function(r) {
	$(yoodoo.welcomeContainers.tabcontent[0]).find('input,button').each(function(i, e) {
		e.disabled = false;
	});
	$(yoodoo.welcomeContainers.tabcontent[0]).find('button').html("change").slideUp();
	if (/^error/.test(r)) {
		var err = $(yoodoo.welcomeContainers.tabcontent[0]).find('.error');
		err.html(r.replace(/^error:/, ''));
		err.slideDown(yoodoo.animateDuration);
		setTimeout("yoodoo.hideError();", 3000);
		$(yoodoo.welcomeContainers.tabcontent[0]).find("input#username").val(yoodoo.user.oldusername);
		yoodoo.user.username = yoodoo.user.oldusername;
	} else {

		$(yoodoo.frame).find('.welcome .messenger').html('You have successfully saved your details');
		$(yoodoo.frame).find('.welcome .messenger').slideDown(this.animateDuration);
		setTimeout("$(yoodoo.frame).find('.welcome .messenger').slideUp(yoodoo.animateDuration);", 3000);
	}
};
yoodoo.passwordChanged = function(r) {
	$(yoodoo.welcomeContainers.tabcontent[1]).find('input,button').each(function(i, e) {
		e.disabled = false;
	});
	$(yoodoo.welcomeContainers.tabcontent[1]).find('button').html("change").slideUp();
	if (/^error/.test(r)) {
		var err = $(yoodoo.frame).find('.login .error');
		err.html('Failed to change your password, maybe the details were incorrect');
		err.slideDown(yoodoo.animateDuration);
	} else {
		$(yoodoo.welcomeContainers.tabcontent[0]).find('input').val('');
		var postSlide = '';
		yoodoo.loginCode = r;
		if (!yoodoo.password_updated && yoodoo.option.introMovie.flashvars.intro != "") {
			postSlide = 'yoodoo.showIntro();';
		}
		yoodoo.password_updated = true;
		//var cont = $(this.frame).find('#continue').get(0);
		//$(cont).fadeIn(1000);
		//$(cont).css('display', yoodoo.bookcase.display_continue() ? 'inline-block' : 'none');
		$(this.frame).find('#cancelPassword').css('display', 'inline-block');
		$(yoodoo.frame).find('.welcome .messenger').html('You have successfully changed your password');
		$(yoodoo.frame).find('.welcome .messenger').slideDown(this.animateDuration);
		$(yoodoo.frame).find('#changepassword').css({
			display : "inline-block"
		});
		$(yoodoo.frame).find('#advisorButton').css({
			display : "inline-block"
		});
		$(yoodoo.frame).find('#dashboardButton').css({
			display : "none"
		});
		$($(yoodoo.frame).find('.tabcontent .alert').get(1)).slideUp(500, function() {
			$(this).empty();
		});
		if (this.bookcase.continueControl() !== true)
			$(yoodoo.frame).find('.welcome').removeClass("noContinue");
		if (postSlide != "") {
			$($(yoodoo.frame).find('.tabs .tab').get(2)).trigger('click');
			setTimeout(postSlide, 1000);
		} else {
			setTimeout(function() {
				$(yoodoo.frame).find('.welcome .messenger').slideUp(500, function() {
					$($(yoodoo.frame).find('.tabs .tab').get(2)).trigger('click');
				});
				$('#xmlwaiting').slideUp();
			}, 3000);

		}
	}
};
yoodoo.showIntro = function() {
	yoodoo.actionLogging.add('Show intro movie', {});
	var withClose = false;
	if (arguments.length > 0)
		withClose = arguments[0];
	if (this.option.introMovie.flashvars.intro != "") {
		this.working(true, 'Loading your introduction...');
		var ins = "<div><center><div style='padding:5px 10px 0 0'><div id='yoodooIntroPlayerHolder'></div></div><button type='button' onclick='yoodoo.removeIntroMovie();yoodoo.hide(function() {" + ( withClose ? '' : 'yoodoo.welcome();') + "});' class='green medium' style='margin:5px 0 0 0;" + ( withClose ? '' : 'display:none;') + "'>press to start</button></center></div>";
		yoodoo.display(ins);
		yoodoo.insertIntroMovie();
	}
};
yoodoo.finishedIntro = function() {
	yoodoo.hide(function() {
		yoodoo.welcome();
	});
	//$('button.green.medium').fadeIn();
};
yoodoo.login = function(un, pw) {
	this.working(true, 'Attempting login...');
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
yoodoo.refreshedDashboard = function() {
	yoodoo.nextActions = ['yoodoo.welcome();'];
	yoodoo.dashboard();
};
yoodoo.dashboard = function() {
	this.working(true, 'Fetching your dashboard...');
	var params = {
		cmd : yoodoo.cmd.home.server,
		callback : 'yoodoo.' + yoodoo.cmd.home.callback
	};
	yoodoo.sendPost(null, params);
};
yoodoo.dashboardreply = function(code) {
	this.working(false);
	try {
		code = yoodoo.decodeHTMLResponse(code);
		code = yoodoo.replaceMeta(code);
		code = jQuery.parseJSON(Base64.decode(code));
		code = dooit.decode(code);
		yoodoo.console(code);
		yoodoo.replyValues(code);
		yoodoo.password_updated = !code.first;
		$(yoodoo.container).slideUp(yoodoo.animateDuration, function() {
			yoodoo.doNextActions();
		});
	} catch (e) {
		var err = $(yoodoo.frame).find('.login .error');
		err.html("Failed to load your information. You may not be using the latest version. Please refresh your browser or press F5.");
		err.fadeIn(yoodoo.animateDuration);
		yoodoo.timer = setTimeout('yoodoo.hideError();', 3000);
	}

};
yoodoo.replyValues = function(reply) {
	yoodoo.first_login = reply.first;
	yoodoo.home_screen_title = reply.title;
	yoodoo.home_progress_text = reply.myprogress;
	yoodoo.home_left_text = Base64.decode(reply.tip);
	yoodoo.home_password_change_text = reply.button;
	yoodoo.username = reply.welcomeTitle;
	yoodoo.flash_message = Base64.decode(reply.welcomeText);
	yoodoo.option.introMovie.flashvars.intro = reply.initialVideo;
	yoodoo.user.emailaddress = reply.emailaddress;
	yoodoo.user.firstname = reply.firstname;
	yoodoo.user.lastname = reply.lastname;
	yoodoo.user.nickname = reply.nickname;
	yoodoo.user.unreadComments = reply.unreadComments;
	yoodoo.user.staff = reply.staff;
	yoodoo.user.groups = reply.groups;
	yoodoo.home_banner_html = reply.banner;
	yoodoo.user.score = reply.score;
	yoodoo.notices = reply.notices;
	if (reply.serverTime !== undefined) {
		try {
			eval('var tmpTime=' + reply.serverTime + ';');
			yoodoo.serverTimeOffset = (new Date().getTime()) - tmpTime.getTime();
		} catch (e) {
		}
	}
	//yoodoo.serverTimeOffset = reply.serverTime;
	yoodoo.user.meta = (reply.meta === null) ? {} : reply.meta;
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
	if (yoodoo.user.staff)
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

yoodoo.loginreply = function(code) {
	this.nextActions = ['yoodoo.welcome();'];
	this.working(true, 'Loading your bookcase');
	var reply = code;
	try {
		code = jQuery.parseJSON(Base64.decode(code));
		yoodoo.console(code);
		yoodoo.loginCode = code.userHash;
		if (this.mobile) {
			if (this.stayin) {
				localStorage.setItem('userhash', this.loginCode);
				localStorage.setItem('isApp', this.isApp);
			} else {
				localStorage.removeItem('userhash');
				localStorage.removeItem('isApp');
			}
		}
		yoodoo.password_updated = !code.first;
		yoodoo.replyValues(code);
		yoodoo.loggedin = true;
		yoodoo.actionLogging.add('Logged in', {});
		window.onbeforeunload = function() {
			return 'Leaving this page will log you out!';
		};
		if (yoodoo.loggedin) {
			this.openAppOnRotate = false;
			$(yoodoo.container).slideUp(yoodoo.animateDuration, function() {
				if (!yoodoo.html5) {
					yoodoo.insertFlash();
				} else {
					yoodoo.callXML();
				}
			});
		}
		if (this.user.staff) {
			this.option.yoodooPortal.url = this.option.baseUrl + 'frontend_dev.php/remote';
			// ok
		}
	} catch (e) {
		this.working(false);
		yoodoo.actionLogging.add('Login error', {});
		var err = $(yoodoo.frame).find('.login .error');
		if (/^error\:/.test(code)) {
			code = code.replace(/^error\:/, '');
		} else {
			//code = "Failed to load your information. Please try again.";
			code = "Failed to load your information. You may not be using the latest version. Please refresh your browser or press F5.";
		}
		err.html(code);
		err.fadeIn(yoodoo.animationDuration);
		yoodoo.timer = setTimeout('yoodoo.hideError();', 10000);
	}
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
yoodoo.inbox = function() {
	this.working(true, 'Fetching your Inbox...');
	var params = {
		cmd : yoodoo.cmd.inbox.server,
		callback : 'yoodoo.' + yoodoo.cmd.inbox.callback
	};
	yoodoo.sendPost(null, params);
};
yoodoo.getcomments = function(episodeID) {
	yoodoo.comment_id = episodeID;
	yoodoo.working(true, 'Fetching comments...');
	var params = {
		cmd : yoodoo.cmd.commentsget.server,
		content_id : episodeID,
		callback : 'yoodoo.' + yoodoo.cmd.commentsget.callback
	};
	yoodoo.sendPost(null, params);
};
yoodoo.comments_content_id = '';
yoodoo.gotcomments = function(html) {
	yoodoo.working(false);
	if (/^error/.test(html)) {
		this.showLogin();
	} else {
		var content_id = '';
		this.comments_content_id = html.match(/var content_id = (\d+);/)[1];
		html = yoodoo.decodeHTMLResponse(html);
		html = html.replace(/<script.*?<\/script>/gi, '');
		this.loadLinkedFiles(html);
		html = html.replace(/<link.*?>/gi, '');
		html = html.replace(/<style.*?>.*?<\/style>/gi, '');
		html = html.replace(/<h2.*?<\/h2>/gi, '');
		html = '<h2>Your comments &amp; discussions...</h2>' + html;
		yoodoo.working(false);
		yoodoo.display(html, false, true);

		var contentContainer = $(yoodoo.container).find('.tabset_content_container').get(0);

		// detect if one is active already

		var tabs = $(yoodoo.container).find('.tabset_tabs li');
		var tabs_a = $(yoodoo.container).find('.tabset_tabs a');
		for (var i = 0; i < tabs.length; i++) {
			tabs_a[i].href = 'javascript:void(0)';
		}
		var tabContents = $(contentContainer).find('.tabset_content').get();
		tabs.removeClass('active');
		$(tabs.get(yoodoo.comment_tab)).addClass('active');
		tabs.bind('click', function() {
			if (!$(this).hasClass('active')) {
				$(this).siblings('li').removeClass("active");
				var i = $(this).prevAll('li').get().length;
				yoodoo.comment_tab = i;
				$(this).addClass("active");
				var contentContainer = $(yoodoo.container).find('.tabset_content_container');
				var oldone = $(contentContainer).find('.tabset_content.display');
				oldone.slideUp(this.animationDuration);
				oldone.removeClass('display');
				var newone = $(contentContainer).find('.tabset_content').get(i);
				$(newone).slideDown(this.animationDuration);
				$(newone).addClass('display');
			}
		});
		var first = tabContents.splice(yoodoo.comment_tab, 1);
		$(first).css('display', 'block');
		$(first).addClass('display');
		$(tabContents).css('display', 'none');
		var contents = $(contentContainer).find('.comment_form').get();
		for (var i = 0; i < contents.length; i++) {
			$(contents[i]).find('a').get(0).href = 'javascript:void(0)';
			var tmp = yoodoo.e("div");
			$(tmp).css('clear', 'both');
			contents[i].appendChild(tmp);
		}
		var buts = $(yoodoo.container).find('.tabset_content a').get();
		for (var b = 0; b < buts.length; b++) {
			var newbut = yoodoo.e("button");
			newbut.setAttribute("type", "button");
			newbut.setAttribute("title", buts[b].title);
			newbut.setAttribute("onclick", buts[b].getAttribute("onclick"));
			newbut.innerHTML = buts[b].innerHTML;
			buts[b].parentNode.insertBefore(newbut, buts[b]);
			$(buts[b]).remove();
			$(newbut).addClass("green");
		}
		$(yoodoo.container).find('.tabset_content .comment_body button.green').addClass("medium");
	}
};
yoodoo.getkeypointcomments = function(episodeID, keypoint) {
	yoodoo.working(true, 'Fetching comments...');
	var params = {
		cmd : yoodoo.cmd.commentskeypointget.server,
		content_id : episodeID,
		keypoint : keypoint,
		callback : 'yoodoo.' + yoodoo.cmd.commentskeypointget.callback
	};
	yoodoo.sendPost(null, params);
};
yoodoo.episodeclosed = function() {
	this.bookcase.handlers.episode_exit();
};
yoodoo.episodecomplete = function(episodeID) {
	this.lastItemId = episodeID;
	yoodoo.working(true, 'Updating your Journey...');

	var params = {
		cmd : yoodoo.cmd.episodecomplete.server,
		content_id : episodeID,
		callback : 'yoodoo.' + yoodoo.cmd.episodecomplete.callback
	};
	yoodoo.sendPost(null, params);
	this.bookcase.handlers.episode_complete();
};
yoodoo.quizresults = function(quizresultdata) {
	yoodoo.working(true, 'Updating your Journey...');
	yoodoo.actionLogging.add('saving quiz', {});
	var params = {
		cmd : yoodoo.cmd.quizresults.server,
		quizresultdata : quizresultdata,
		callback : 'yoodoo.' + yoodoo.cmd.quizresults.callback
	};
	yoodoo.sendPost(null, params);
};
yoodoo.download = function(id, file) {
	yoodoo.console(file);
	window.open(file, 'yoodoo_download');
	this.bookcase.handlers.document_requested(id);
};
yoodoo.commentPost = function() {
	yoodoo.working(true, 'Posting your comment...');
	yoodoo.actionLogging.add('posting comment', {});
	var params = {
		cmd : yoodoo.cmd.commentpost.server,
		callback : 'yoodoo.' + yoodoo.cmd.commentpost.callback
	};
	yoodoo.sendPost(null, params);
};
yoodoo.commentPostAdv = function() {
	yoodoo.working(true, 'Posting your comment...');
	yoodoo.actionLogging.add('posting comment', {});
	var params = {
		cmd : yoodoo.cmd.commentpostadv.server,
		callback : 'yoodoo.' + yoodoo.cmd.commentpostadv.callback
	};
	yoodoo.sendPost(null, params);
};
yoodoo.earmark = function(id, state) {
	yoodoo.actionLogging.add('earmark', {
		id : id
	});
	var params = {
		cmd : yoodoo.cmd.earmark.server,
		book : id,
		callback : 'yoodoo.' + yoodoo.cmd.earmark.callback
	};
	yoodoo.sendPost(null, params);
};
yoodoo.startEpisode = function(id) {
	this.bookcase.handlers.episode_requested(id);
	if (this.inBookcase('book', id)) {
		if (this.html5) {
			yoodooPlaya.showEpisode(id);
		} else {
			yoodoo.callFlash(yoodoo.cmd.startEpisode.flash, id);
		}
		return true;
	} else {
		this.alert("This episode is not in your journey");
		return false;
	}
};
yoodoo.setTab = function(id) {
	yoodoo.callFlash(yoodoo.cmd.setTab.flash, id);
};
yoodoo.displayResponse = function(html) {
	yoodoo.working(false);
	html = yoodoo.decodeHTMLResponse(html);
	yoodoo.display(html, false, true);
};
yoodoo.nullResponse = function(r) {
	yoodoo.working(false);
};
yoodoo.keyCode = function(e) {
	var keycode;
	if (window.event)
		keycode = window.event.keyCode;
	else if (e)
		keycode = e.which;
	var shift = false;
	if (e.shiftKey !== undefined) {
		shift = e.shiftKey;
	} else {
		shift = (yoodooKeylog[16] === true);
	}
	var key = {
		code : keycode,
		alpha : (keycode > 64 && keycode < 91),
		space : (keycode == 32),
		numeric : !shift && ((keycode > 47 && keycode < 58) || (keycode > 95 && keycode < 106)),
		decimal : ((!shift && (keycode > 47 && keycode < 58) || (keycode > 95 && keycode < 106)) || (keycode == 189) || (keycode == 190) || (keycode == 110)),
		enter : (keycode == 13),
		escape : (keycode == 27),
		character : String.fromCharCode(keycode),
		input : ((keycode == 190) || (keycode == 188) || (keycode == 192) || (keycode == 111) || (keycode == 192) || (keycode == 191) || (keycode == 107) || (keycode == 187) || (keycode == 189) || (keycode == 106) || (keycode == 110) || (keycode == 220) || (keycode == 223) || (keycode == 222) || (keycode == 221) || (keycode == 219) || (keycode == 186)),
		tab : (keycode == 9),
		shift : (keycode == 16),
		backspace : (keycode == 8),
		del : (keycode == 46),
		fkey : ((keycode > 111 && keycode < 124) ? keycode - 111 : false),
		home : (keycode == 36),
		end : (keycode == 35),
		up : (keycode == 38),
		down : (keycode == 40),
		left : (keycode == 37),
		right : (keycode == 39),
		navigate : false
	};
	if (key.numeric && keycode > 95)
		key.character = String.fromCharCode(keycode - 48);
	key.navigate = (key.left || key.right || key.del || key.backspace || key.shift || key.home || key.end || key.tab);
	return key;
};
yoodoo.htmlEntities = function(str) {
	return String(str).replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&#34;').replace(/'/g, '&#39;').replace(/&/g, '&amp;');
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
	while (typeList.length > 0) {
		types[typeList.pop().toLowerCase()] = true;
	}
	while (types[obj.tagName.toLowerCase()] !== true && obj.id != 'yoodooWidget')
	obj = obj.parentNode;
	if (obj.id == 'yoodooWidget')
		return false;
	return obj;
};
yoodoo.bubble = function(obj, text) {
	obj.bubbleText = text;
	$(obj).unbind('mouseenter').bind("mouseenter", function(e) {
		if (this.bubble === undefined) {
			this.bubble = yoodoo.e("div");
			$(this.bubble).css({
				visibility : 'hidden'
			});
		}
		$(this.bubble).html(this.bubbleText).css({
		}).addClass("yoodooBubble");
		$(document.body).append(this.bubble);
		var pos = $(this).offset();
		var l = pos.left + ($(this).width() / 2) - ($(this.bubble).width() / 2);
		var t = pos.top - $(this.bubble).height() - 20;
		var r = l + $(this).width();
		if (r > $(document.body).width())
			l -= (r - $(document.body).width());
		if (l < 0)
			l = 0;
		if (t < 0)
			t += $(this.bubble).height() + 40 + $(this).height();
		$(this.bubble).css({
			visibility : 'visible',
			opacity : 0,
			left : l,
			top : t
		}).stop().animate({
			opacity : 1
		});
		$(this).bind("mouseleave", function() {
			$(this).unbind("mouseleave");
			var me = this;
			$(this.bubble).stop().animate({
				opacity : 0
			}, 200, function() {
				me.bubble = undefined;
				$(this).remove();
			});
		});
		$(this).on("remove", function() {
			var me = this;
			$(this.bubble).stop().animate({
				opacity : 0
			}, 200, function() {
				$(this).remove();
			});
		});
	});
};
yoodoo.advisorPanelShow = function() {
	yoodoo.advisorPanel.show();
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
	var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
	var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
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
				for (var i = 0; i < days.length; i++) {
					if (str.substr(0, 3) == days[i].substr(0, 3))
						rem = str.substr(0, 3);
				}
				if (rem != "")
					str = str.replace(new RegExp('^' + rem), '');
				break;
			case "l":
				var rem = '';
				for (var i = 0; i < days.length; i++) {
					if (str.substr(0, days[i].length) == days[i])
						rem = days[i];
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
				for (var i = 0; i < months.length; i++) {
					if (str.substr(0, 3) == months[i].substr(0, 3))
						rem = str.substr(0, 3);
				}
				if (rem != "")
					str = str.replace(new RegExp('^' + rem), '');
				break;
			case "M":
				var rem = '';
				for (var i = 0; i < months.length; i++) {
					if (str.substr(0, months[i].length) == months[i])
						rem = months[i];
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
		var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
		var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
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
					op += suffix[d - 1];
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
// main site js function rewritten

function removeTag(id) {
	if ( typeof (dooit) != "undefined")
		dooit.removeTag(id);
	yoodoo.events.trigger("tagUnset", {
		tag : id
	});
}

function addTag(id) {
	if ( typeof (dooit) != "undefined")
		dooit.addTag(id);
	yoodoo.events.trigger("tagSet", {
		tag : id
	});
}

function isNotBlank(id) {
	var val = getValue(id);
	return ( typeof (val) != "undefined" && val != '' && val !== null);
}

function getValue(id) {
	if (!(/^EF\d/.test(id))) {
		id = "EF" + array_of_fields[id][0];
	}
	var val = null;
	var tarea = $("textarea[name=" + id + "]").get();
	if (tarea.length > 0) {
		val = tarea[0].value;
	} else {
		var txt = elementsOfName("input[type=text]", id);
		//var txt=$("input[type=text][name="+id+"]").get();
		if (txt.length > 0) {
			val = txt[0].value;
		} else {
			var rads = elementsOfName("input[type=radio]", id + "[]");
			//var rads=$("input[type=radio][name="+id+"[]]").get();
			if (rads.length > 0) {
				val = radioValue(id);
			} else {
				var chck = elementsOfName("input[type=checkbox]", id + "[]");
				//var chck=$("input[type=checkbox][name="+id+"[]]").get();
				if (chck.length > 0)
					val = checkboxValue(id);
			}
		}
	}
	if (val === null) {
		for (var i in array_of_fields) {
			if (id == "EF" + array_of_fields[i][0]) {
				val = array_of_fields[i][1];
			}
		}
	}
	return val;
}

function elementsOfName(sel, name) {
	var chck = $(sel).get();
	var reply = [];
	for (var i = 0; i < chck.length; i++) {
		if (chck[i].name == name)
			reply.push(chck[i]);
	}
	return reply;
}

function show(id, on) {
	$('#' + id).css("display", on ? "block" : "none");
}

function setValue(id, val) {
	var o = $('#' + id).get();
	var name = id;
	if (!(/^EF\d/.test(name))) {
		name = "EF" + array_of_fields[name][0];
	}
	if (array_of_fields && typeof (array_of_fields[id]) != "undefined")
		array_of_fields[id][1] = val;
	if (o.length >= 1) {
		o[0].value = val;
	} else {
		setEFRadioValue(name, val);
	}
}

function getRadioValue(name) {

	if (!(/^EF\d/.test(name))) {
		name = "EF" + array_of_fields[name][0];
	}
	return radioValue(name);
}

function radioValue(name) {
	var rads = elementsOfName("input[type=radio]", name + "[]");
	for (var i = 0; i < rads.length; i++) {
		if (rads[i].checked) {
			return rads[i].value;
		}
	}
	return null;
}

function setEFRadioValue(name, val) {
	setRadioValue(name, val);
}

function setRadioValue(name, val) {
	var rads = $("input[type=radio][name^=" + name + "]").get();
	for (var i = 0; i < rads.length; i++) {
		if (rads[i].value == val) {
			rads[i].checked = true;
		} else if (rads[i].checked) {
			rads[i].checked = false;
		}
	}
}

function showBookcase() {
}

function showEpisode(arg) {
}

function completeEpisode(arg) {
}

function playerAnalytics(evt, itemType, itemId, text) {
}

function fl_onHomeTabClicked() {
	yoodoo.refreshedDashboard();
}

function fl_onScrapbookTabClicked() {
	yoodoo.showScrapbook();
}

function fl_onInboxClicked() {
	yoodoo.comments.show();
}

function fl_onDooItClicked(id, from) {// Exercise link from episode books or DOO-IT> link from doo-it books
	if (from == "doo-its") {
		yoodoo.showDooit(id);
	} else if (from == "episodes") {
		yoodoo.showEpisodeDooit(id);
	}
}

function fl_onDownloadClicked(id, file) {// Download link from documents books
	yoodoo.download(id, file);
}

function fl_onEpisodeCommentsClicked(episodeID) {// comments about episode clicked
	//yoodoo.getcomments(episodeID);
	yoodoo.comments.show({
		contentId : episodeID,
		targetId : episodeID
	});
}

function fl_onKeyPointCommentsClicked(episodeID, keypointID) {// comments clicked about a specific keypoint
	//yoodoo.getkeypointcomments(episodeID, keypointID);
	yoodoo.comments.show({
		contentId : episodeID,
		targetId : keypointID
	});
}

function fl_onReady() {
	yoodoo.flashReady();
}

function fl_onOpenNext() {
	yoodoo.progress();
}

function fl_episodeClosed() {
	yoodoo.episodeclosed();
}

function fl_loadEpisodeXML(episodeID) {
	yoodoo.getbookxml(episodeID);
}

function fl_onSetScrapbook(id) {
	yoodoo.scrapbookAddItem(id);
}

function fl_loadQuizXML(episodeID) {
	yoodoo.getQuizXML(episodeID);
}

function fl_onEpisodeEarmark(id, state) {
	yoodoo.earmark(id, state);
}

function fl_onDooitEarmark(id, state) {
	var doit = yoodoo.bookcase.fetchDooit(id);
	//console.log(doit);
	yoodoo.earmark(doit.content_id, state);
}

function fl_onEpisodeComplete(episodeID) {
	yoodoo.episodecomplete(episodeID);
}

function showBookcase() {

}

function setFlashTab(tab) {
	yoodoo.setTab(tab);
	return false;
}

function fl_onQuizResults(episodeID, res) {
	yoodoo.quizresults(res);
}

function goRemove(id) {
	yoodoo.scrapbookRemove(id);
}

function goFilter() {
	yoodoo.showScrapbook();
}

function checkFinish() {
	var canFinish = true;
	document.getElementById('saveDooit').style.display = canFinish ? 'block' : 'none';
}

function showForm(id) {
	var form = $('#' + id);
	if (form.css('display') == "none") {
		form.slideDown();
		//resizer.resize(form,{fromHeight:0});
	} else {
		form.slideUp();
		//resizer.resize(form,{toHeight:0});
	}
}

function submitForm(parent_id, field_id, type) {
	var val = $('#' + field_id).val();
	if (val != "") {
		var params = {
			parent_id : parent_id,
			comment_text : val,
			content_id : yoodoo.comments_content_id
			//content_id:yoodoo.comment_id
		};
		if (type == 2) {
			//if (/^adv_/.test(field_id)) {
			params.cmd = yoodoo.cmd.commentpostadv.server;
			params.callback = 'yoodoo.' + yoodoo.cmd.commentpostadv.callback;
		} else {
			params.cmd = yoodoo.cmd.commentpost.server;
			params.callback = 'yoodoo.' + yoodoo.cmd.commentpost.callback;
		}
		yoodoo.sendPost(null, params);
	}
}

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
	err.callback = 'yoodoo.jsErrorSent';
	err.cmd = 'jserror';
	err.username = this.user.username;
	err.system = BrowserDetect.OS + ' ' + BrowserDetect.browser + ' ' + BrowserDetect.version;
	err.site = this.siteFolder;
	err.lastCommand = $(this.debuggerz.lastPost).html();
	if (err.url.substring(0, this.option.baseUrl.length) == this.option.baseUrl) {
		err.url = err.url.replace(this.option.baseUrl, '');
		yoodoo.sendPost(null, err);
		if (console !== undefined && console.log !== undefined)
			console.log(err);
		//ok
	}
};
yoodoo.jsErrorSent = function(done) {
	if (console !== undefined && console.log !== undefined)
		console.log("error recorded");
	//ok
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