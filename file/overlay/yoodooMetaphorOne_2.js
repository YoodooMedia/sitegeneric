yoodoo.swfobject = {
		url: 'overlay/swfobject.js',
		fetched: false
};
yoodoo.option.flashMovie= {
			url: 'domain:uploads/sitegeneric/flash/12_1_Episode_playa.swf',
			id: 'Episode_playa',
			zoom: 1,
			loaded: false,
			bgcolor: '#fff',
			fullscreen: 'false',
			quality: 'high',
			wmode: 'transparent',
			scriptaccess: 'always',
			allowNetworking: 'all',
			version: '10.0.0',
			expressInstall: "expressInstall.swf",
			flashvars: {},
			// flashvars: {chapterVideoEditMode:"noWait"},
			ports: {
				closedDooit: '',
				closedMessages: '',
				login: 'setUsername',
				logout: ''
			},
			bookshelfXML: 'xml/bookshelf.xml',
			object: null,
			buffer: []
		};
yoodoo.option.voiceoverMovie= {
			url: 'domain:uploads/sitegeneric/flash/voiceover3.swf',
			id: 'voiceover_playa',
			width: 1,
			height: 1,
			zoom: 1,
			bgcolor: '#fff',
			fullscreen: 'false',
			quality: 'high',
			wmode: 'transparent',
			scriptaccess: 'always',
			allowNetworking: 'all',
			version: '10.0.0',
			expressInstall: "expressInstall.swf",
			flashvars: {
				volume: 100
			},
			object: null
		};
yoodoo.option.introMovie= {
			url: 'domain:uploads/sitegeneric/flash/introPlaya.swf',
			id: 'intro_playa',
			width: 756,
			height: 424,
			zoom: 1,
			bgcolor: '#fff',
			fullscreen: 'false',
			quality: 'high',
			wmode: 'transparent',
			scriptaccess: 'always',
			allowNetworking: 'all',
			version: '9.0.0',
			expressInstall: "expressInstall.swf",
			flashvars: {
				intro: '',
				buffer: 2
			},
			object: null
		};
yoodoo.checks.swfObject=function() {

		var required = false;
		yoodoo.loaderInfo.innerHTML = 'Loading...<br />swfobject';
			if (typeof(swfobject) !== "undefined") {
				yoodoo.checks.next();
			} else if (yoodoo.swfobject.fetched===false) {
				yoodoo.swfobject.fetched = true;
				var loader = new yoodoo.fileLoader.loader([[yoodoo.swfobject.url,true]],function(complete) {
					if (complete) {
						yoodoo.checks.next();
					} else {
						yoodoo.noInternet();
					}
				});
			}
};
yoodoo.restart= function() {
		if (this.option.flashMovie!==undefined && this.option.flashMovie.object !== null) {
			$(this.option.flashMovie.object).remove();
			this.option.flashMovie.object = null;
			this.option.flashMovie.loaded = false;
		}
		if (this.option.voiceoverMovie!==undefined && this.option.voiceoverMovie.object !== null) {
			$(this.option.voiceoverMovie.object).remove();
			this.option.voiceoverMovie.object = null;
		}
		if (this.option.introMovie!==undefined && this.option.introMovie.object !== null) {
			$(this.option.introMovie.object).remove();
			this.option.introMovie.object = null;
		}
		this.ready = false;
		this.htmldetect = false;
		this.loadVersions = false;
		//var mine = new RegExp(this.option.baseUrl);
		this.widget.innerHTML = "";
		yoodoo.init(yoodoo.sitehash, yoodoo.siteFolder);
};
yoodoo.cmd= {};
yoodoo.cmdFlash= {
		bookshelfxml: {
			server: 'xmlbookcase',
			flash: 'setBookshelfXML',
			callback: 'gotXML'
		},
		dooit: {
			server: 'dooit',
			callback: 'gotDooit'
		},
		episodedooit: {
			server: 'dooit',
			callback: 'gotDooit'
		},
		dooitsave: {
			server: 'dooitsave',
			callback: 'dooitSaved'
		},
		deletesnapshot: {
			server: 'deleteSnapshot'
		},
		createsnapshot: {
			server: 'createSnapshot'
		},
		snapshot: {
			server: 'saveSnapshot',
			callback: 'gotSnapshot'
		},
		status: {
			server: 'status',
			callback: 'status'
		},
		scrapbook: {
			server: 'scrapbookXML',
			callback: 'gotScrapbook'
		},
		scrapbookremove: {
			server: 'scrapbookremove',
			callback: 'gotScrapbook'
		},
		scrapbookadd: {
			server: 'scrapdooit',
			callback: 'dooitScrapped'
		},
		scrapbookadditem: {
			server: 'scrapepisode',
			callback: 'showScrapbook'
		},
		scrapcomments: {
			server: 'fetchComments',
			callback: 'gotScrapbookComments'
		},
		//scrapbookadd:{server:'scrapdooit',callback:'gotScrapbook'},
		//scrapbookadditem:{server:'scrapepisode',callback:'gotScrapbook'},
		changepassword: {
			server: 'changepass',
			callback: 'passwordChanged'
		},
		changedetails: {
			server: 'changedetails',
			callback: 'detailsChanged'
		},
		login: {
			server: 'login',
			callback: 'loginreply'
		},
		logout: {
			server: 'logout',
			callback: 'nullResponse'
		},
		scrollTo: {
			flash: 'setOpenIndex'
		},
		bookxml: {
			server: 'xmlbook',
			flash: 'setEpisodeXML',
			callback: 'gotbookxml'
		},
		currentbook: {
			server: 'xmlbook',
			flash: 'setOpenBook',
			callback: 'gotbook'
		},
		chapter: {
			flash: 'gotoChapter'
		},
		keypoint: {
			flash: 'gotoKeypoint'
		},
		home: {
			server: 'home',
			flash: '',
			callback: 'dashboardreply'
		},

		wipedooit: {
			server: 'wipedooit',
			callback: 'nullResponse'
		},
		quiz: {
			server: 'xmlquiz',
			flash: 'setQuizXML',
			callback: 'gotquizxml'
		},
		quizresults: {
			server: 'quizresults',
			flash: '',
			callback: 'gotXML'
		},
		commentpost: {
			server: 'post_comment',
			flash: '',
			callback: 'gotcomments'
		},
		commentpostadv: {
			server: 'post_adv_message',
			flash: '',
			callback: 'gotcomments'
		},
		commentsget: {
			server: 'get_comments',
			flash: '',
			callback: 'gotcomments'
		},
		earmark: {
			server: 'earmark',
			flash: '',
			callback: 'nullResponse'
		},
		//episodecomplete:{server:'completedepisode',flash:'',callback:'gotXML'},
		episodecomplete: {
			server: 'completedepisode',
			flash: '',
			callback: 'gotXML'
		},
		introText: {
			server: '',
			flash: 'setIntroText',
			callback: ''
		},
		setUsername: {
			server: '',
			flash: 'setUsername',
			callback: ''
		},
		inbox: {
			server: '',
			flash: '',
			callback: 'displayResponse'
		},
		commentskeypointget: {
			server: 'get_comments',
			flash: '',
			callback: 'gotcomments'
		},
		startEpisode: {
			server: '',
			flash: 'startEpisode',
			callback: 'nullResponse'
		},
		setTab: {
			server: '',
			flash: 'setActiveTab',
			callback: ''
		},
		forgotpassword: {
			server: 'forgotpass',
			flash: '',
			callback: 'forgotReply'
		},
		fetchAdvisees: {
			server: 'advisees',
			flash: '',
			callback: 'yoodoo.advisorPanel.gotAdvisees'
		},
		fetchAdvisee: {
			server: 'advisee',
			flash: '',
			callback: 'yoodoo.advisorPanel.gotAdvisee'
		},
		fetchAdviseeMessages: {
			server: 'adviseeMessages',
			flash: '',
			callback: 'yoodoo.advisorPanel.gotMessages'
		},
		sendAdviseeMessage: {
			server: 'sendAdviseeMessage',
			flash: '',
			callback: 'yoodoo.advisorPanel.gotMessages'
		},
		approveCompletion: {
			server: 'approveCompletion',
			flash: '',
			callback: 'yoodoo.advisorPanel.approvedCompletion'
		}
};
yoodoo.cmdHTML5= {
		bookshelfxml: {
			server: 'xmlbookcase',
			playa: 'loadBookcase',
			callback: 'gotXML'
		},
		dooit: {
			server: 'dooit',
			callback: 'gotDooit'
		},
		episodedooit: {
			server: 'dooit',
			callback: 'gotDooit'
		},
		dooitsave: {
			server: 'dooitsave',
			callback: 'dooitSaved'
		},
		createsnapshot: {
			server: 'createSnapshot'
		},
		deletesnapshot: {
			server: 'deleteSnapshot'
		},
		snapshot: {
			server: 'saveSnapshot',
			callback: 'gotSnapshot'
		},
		status: {
			server: 'status',
			callback: 'status'
		},
		scrapbook: {
			server: 'scrapbookXML',
			callback: 'gotScrapbook'
		},
		scrapbookremove: {
			server: 'scrapbookremove',
			callback: 'gotScrapbook'
		},
		scrapbookadd: {
			server: 'scrapdooit',
			callback: 'dooitScrapped'
		},
		scrapbookadditem: {
			server: 'scrapepisode',
			callback: 'showScrapbook'
		},
		scrapcomments: {
			server: 'fetchComments',
			callback: 'gotScrapbookComments'
		},
		//scrapbookadd:{server:'scrapdooit',callback:'gotScrapbook'},
		//scrapbookadditem:{server:'scrapepisode',callback:'gotScrapbook'},
		changepassword: {
			server: 'changepass',
			callback: 'passwordChanged'
		},
		changedetails: {
			server: 'changedetails',
			callback: 'detailsChanged'
		},
		login: {
			server: 'login',
			callback: 'loginreply'
		},
		logout: {
			server: 'logout',
			callback: 'nullResponse'
		},
		scrollTo: {
			playa: 'setOpenIndex'
		},
		bookxml: {
			server: 'xmlbook',
			playa: 'gotEpisode',
			callback: 'gotbookxml'
		},
		currentbook: {
			server: 'xmlbook',
			flash: 'setOpenBook',
			callback: 'gotbook'
		},
		chapter: {
			flash: 'gotoChapter'
		},
		keypoint: {
			flash: 'gotoKeypoint'
		},
		home: {
			server: 'home',
			flash: '',
			callback: 'dashboardreply'
		},

		wipedooit: {
			server: 'wipedooit',
			callback: 'nullResponse'
		},
		quiz: {
			server: 'xmlquiz',
			flash: 'setQuizXML',
			callback: 'gotquizxml'
		},
		quizresults: {
			server: 'quizresults',
			flash: '',
			callback: 'gotXML'
		},
		commentpost: {
			server: 'post_comment',
			flash: '',
			callback: 'gotcomments'
		},
		commentpostadv: {
			server: 'post_adv_message',
			flash: '',
			callback: 'gotcomments'
		},
		commentsget: {
			server: 'get_comments',
			flash: '',
			callback: 'gotcomments'
		},
		earmark: {
			server: 'earmark',
			flash: '',
			callback: 'nullResponse'
		},
		//episodecomplete:{server:'completedepisode',flash:'',callback:'gotXML'},
		episodecomplete: {
			server: 'completedepisode',
			flash: '',
			callback: 'gotXML'
		},
		introText: {
			server: '',
			flash: 'setIntroText',
			callback: ''
		},
		setUsername: {
			server: '',
			flash: 'setUsername',
			callback: ''
		},
		inbox: {
			server: '',
			flash: '',
			callback: 'displayResponse'
		},
		commentskeypointget: {
			server: 'get_comments',
			flash: '',
			callback: 'gotcomments'
		},
		startEpisode: {
			server: '',
			flash: 'startEpisode',
			callback: 'nullResponse'
		},
		setTab: {
			server: '',
			flash: 'setActiveTab',
			callback: ''
		},
		forgotpassword: {
			server: 'forgotpass',
			flash: '',
			callback: 'forgotReply'
		},
		fetchAdvisees: {
			server: 'advisees',
			flash: '',
			callback: 'yoodoo.advisorPanel.gotAdvisees'
		},
		fetchAdvisee: {
			server: 'advisee',
			flash: '',
			callback: 'yoodoo.advisorPanel.gotAdvisee'
		},
		fetchAdviseeMessages: {
			server: 'adviseeMessages',
			flash: '',
			callback: 'yoodoo.advisorPanel.gotMessages'
		},
		sendAdviseeMessage: {
			server: 'sendAdviseeMessage',
			flash: '',
			callback: 'yoodoo.advisorPanel.gotMessages'
		},
		approveCompletion: {
			server: 'approveCompletion',
			flash: '',
			callback: 'yoodoo.advisorPanel.approvedCompletion'
		}
};
yoodoo.flash= {
		getFlashURL: 'http://get.adobe.com/flashplayer/',
		minimumVersion: 10
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
		$(obj).stop().transition({
			perspective : '500px',
			rotate3d : '1,0,0,90deg',
			scale : 0.2
		}, function() {
			$(this).hide();
			callback(this);
		});
	} else {
		$(obj).slideUp(500, complete);
	}
};
yoodoo.revealAnimation = function(obj, complete) {
	var callback=function(){};
	if (typeof complete == 'function') callback=complete;
	if (this.canHTML) {
		$(obj).stop();
		if ($(obj).css("display") == "none")
			$(obj).css({
				perspective : '500px',
				rotate3d : '1,0,0,90deg',
				scale : 0.2,
				display : 'block'
			});
		$(obj).transition({
			perspective : '500px',
			rotate3d : '1,0,0,0deg',
			scale : 1
		}, function() {
			yoodoo.hidePlaya();
			callback(this);
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
yoodoo.getPadding = function(obj) {
	var p=$(obj).css('padding').replace(/px/g,'').split(' ');
	if (p.length==1 && p[0]!='') {
		var p=parseInt(p[0]);
		return {top:p,right:p,bottom:p,left:p};
	}else if (p.length==2) {
		var x=parseInt(p[0]);
		var y=parseInt(p[0]);
		return {top:y,right:x,bottom:y,left:x};
	}else if (p.length==4) {
		return {top:parseInt(p[0]),right:parseInt(p[1]),bottom:parseInt(p[2]),left:parseInt(p[3])};
	}
		var p=0;
		return {top:p,right:p,bottom:p,left:p};

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
	this.loaderInfo.innerHTML = 'Rendering...';
	//this.fetchSiteSettings();
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
		this.userlogin();
	} else {
		$(this.frame).append(this.container);
		$(this.frame).append(this.wait);
		if (this.flash.minimumVersion > swfobject.getFlashPlayerVersion().major) {
			var pad = ((yoodoo.option.height - 80) / 2);
			this.display('<div style="text-align:center;height:80px;padding:' + pad + 'px 0 ' + pad + 'px 0;color:#ddd">To access the YooDoo widget you need to install at least <a href="' + this.flash.getFlashURL + '" target="_blank">Flash ' + this.flash.minimumVersion + '</a></div>');
		} else {
			this.insertVoiceover();
			this.userlogin();
		}
	}
	this.working(false);
	//if (this.lastHTML != "")
	//	this.display(this.lastHTML);
	this.plugins.ready();
	this.doLoadActions();
	$(this.loaderInfo).remove();
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
			//console.log(yoodoo.postDisplay);
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

				//if ( typeof (content) == "string") {
					$(this.container).empty().append(content);
				//} else {
				//	$(this.container).html(content);
				//}
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
		$(of).html("<button type='button' class='back footerbutton'>"+yoodoo.w('back')+"</button>");
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
			$(of).html("<button type='button' class='done'>" + yoodoo.w('done') + "</button>");
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
		if (this.defaults.volume!==undefined) this.option.voiceoverMovie.flashvars.volume=this.defaults.volume;
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
	if (yoodoo.option.flashMovie.loaded!==true) return false;
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
			} catch (e) {
				yoodoo.errorLog(e);
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
		} catch (e) {
			yoodoo.errorLog(e);
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
yoodoo.facebook = {
	statusChangeCallback:function(response,silent) {
	    //console.log('statusChangeCallback');
		//console.log(response);
		// The response object is returned with a status field that lets the
		// app know the current login status of the person.
		// Full docs on the response object can be found in the documentation
		// for FB.getLoginStatus().
		if (response.status === 'connected') {
		 // console.log(response.authResponse.userID);
		  yoodoo.sendPost(null,{
		  	cmd:yoodoo.loggedin?'facebookattach':'login',
		  	silent:(silent===true)?1:0,
		  	facebcode:response.authResponse.userID,
		  	context:yoodoo.loggedin?yoodoo.facebook:yoodoo,
		  	callback:yoodoo.loggedin?'yoodoo.facebook.attached':'yoodoo.loginreply'
		  });
		  // Logged into your app and Facebook.
		} else if (response.status === 'not_authorized') {
		  // The person is logged into Facebook, but not your app.
		  //document.getElementById('status').innerHTML = 'Please log ' + 'into this app.';
		} else {
		  // The person is not logged into Facebook, so we're not sure if
		  // they are logged into this app or not.
		 // document.getElementById('status').innerHTML = 'Please log ' + 'into Facebook.';
		}
	},
	attached:function(reply) {
		if (reply=='true') {
			yoodoo.user.facebook=true;
			$('#fbbutton').animate({
				opacity:0
			},300,function() {
				$(this).html("Facebook Login is available").animate({
					opacity:1
				});
			});
		}
	},
	checkLoginState:function() {
		FB.getLoginStatus(function(response) {
			yoodoo.facebook.statusChangeCallback(response);
		});
	},
	button:function() {

			window.fbAsyncInit = function() {
				FB.init({
					//appId      : '774689215931746',
					appId : yoodoo.defaults.facebook,
					cookie : true, // enable cookies to allow the server to access
					xfbml : true,
					version : 'v2.2'
				});

				// Now that we've initialized the JavaScript SDK, we call
				// FB.getLoginStatus().  This function gets the state of the
				// person visiting this page and can return one of three states to
				// the callback you provide.  They can be:
				//
				// 1. Logged into your app ('connected')
				// 2. Logged into Facebook, but not your app ('not_authorized')
				// 3. Not logged into Facebook and can't tell if they are logged into
				//    your app or not.
				//
				// These three cases are handled in the callback function.

				FB.getLoginStatus(function(response) {
					yoodoo.facebook.statusChangeCallback(response,true);
				});

			};


			( function(d, s, id) {
					var js, fjs = d.getElementsByTagName(s)[0];
					if (d.getElementById(id))
						return;
					js = d.createElement(s);
					js.id = id;
					js.src = "//connect.facebook.net/en_US/sdk.js";
					fjs.parentNode.insertBefore(js, fjs);
				}(document, 'script', 'facebook-jssdk'));
		return '<fb:login-button scope="public_profile,email" onlogin="yoodoo.facebook.checkLoginState();"></fb:login-button>';
	}
};
//yoodoo.facebook=undefined;
yoodoo.showLogin = function() {
	if (yoodoo.unavailable!==undefined && yoodoo.unavailable!==false) {
		var div=$(yoodoo.e("div")).css({
			'line-height':yoodoo.option.height+'px',
			'white-space':'nowrap',
			overflow:'hidden',
			'text-align':'center'
		}).html(yoodoo.unavailable);
		this.display(div);
	}else if (yoodoo.unavailableAll!==undefined && yoodoo.unavailableAll!==false) {
		var div=$(yoodoo.e("div")).css({
			'line-height':yoodoo.option.height+'px',
			'white-space':'nowrap',
			overflow:'hidden',
			'text-align':'center'
		}).html(yoodoo.unavailableAll);
		this.display(div);
	}else{
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
			var o = '<div class="login"><nobr>' + this.replaceDomain(this.site.login_heading) + '</nobr><h2>'+yoodoo.w("login")+'</h2>';
			o += '<div style="padding:10px 0px" class="yd_overlay">';
			o += '<div><div>'+yoodoo.w("username")+'</div><input type="text" name="username" autocapitalize="off" /></div>';
			o += '<div class="password"><div>'+yoodoo.w("password")+'</div><input type="password" name="password" /></div>';
			o += '<center><button type="button" onclick="yoodoo.tryLogin();">'+yoodoo.w("login").toLowerCase()+'</button></center>';
			if (this.showForgotPassword) {
				o += '<div class="forgotten"><a href="javascript:void(0)" id="forgotPassword">'+yoodoo.w("forgotmypassword")+'</a>';
				o += "<div style='display:none'>"+yoodoo.w('enterusernameandclick');
				o += "<center><button type='button' onclick='yoodoo.tryLogin()'>"+yoodoo.w('resetmypassword')+"</button>&nbsp;&nbsp;<button type='button' onclick='yoodoo.showFullLoginForm()'>"+yoodoo.w('cancel')+"</button></center>";
				o += '</div></div>';
			}
			o += '<div class="error" style="display:none"></div>';
			o += '</div>';
			if (this.html5available && this.checks.flash())
				o += '<button type="button" class="green medium right" onclick="yoodoo.switchVersion()">' + (this.html5 ? 'Flash '+yoodoo.w('version') : 'HTML5 '+yoodoo.w('version')) + '</button>';
			if (typeof(yoodoo.defaults.facebook)=='string' && yoodoo.defaults.facebook.length>0) o += '<div style="margin:10px">'+yoodoo.facebook.button()+'</div>';
			if (this.mobile) {
				o += "<div class='yd_mobileOptions'>";
				//o += "<center><label>Keep me logged in <input type='checkbox' id='stayin' /></label></center>";
				if (this.openAppOnRotate) {
					o += '<span>'+yoodoo.w('stillloggedin')+'<br />'+yoodoo.w('turndeviceround')+'</span>';
				} else {
					o += '<button type="button" class="green' + (this.stayin ? '' : ' off') + '" onclick="yoodoo.stayin=!yoodoo.stayin;if (yoodoo.stayin) {$(this).removeClass(\'off\');}else{$(this).addClass(\'off\');};">'+yoodoo.w('keeploggedin')+'</button>';
					if (this.canApp && !this.isApp)
						o += '<button type="button" class="green deviceLandscape" onclick="yoodoo.openApp();">'+yoodoo.w('openwebapp')+'</button><span class="devicePortrait">'+yoodoo.w('rotatedevice')+'</span>';
				}
				o += "</div>";
			}
			o += '</div>';
			this.postDisplay = function() {
				$(this.frame).find('.login input[name=username]').keyup( function(e) {
					var kc = yoodoo.keyCode(e);
					if (kc.enter)
						yoodoo.tryLogin();
				});
				$(this.frame).find('.login input[name=password]').keyup( function(e) {
					var kc = yoodoo.keyCode(e);
					if (kc.enter)
						yoodoo.tryLogin();
				});
				var forgotButton=$(this.frame).find('#forgotPassword').get(0);
				$(forgotButton).bind('click',function() {
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
					mes = yoodoo.w('notloggedin');
				err.html(mes);
				err.slideDown(yoodoo.animateDuration);
				err.fadeIn(yoodoo.animateDuration);
				yoodoo.timer = setTimeout('yoodoo.hideError();', 3000);
			}
		}
	}
};

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

	$(yoodoo.welcomeContainers.content).prepend(logout);

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
			display : ((tabs.length-1 == t) ? 'block' : 'none')
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


	$(details).prepend(
		$(yoodoo.e("span")).css({
			padding:'4px',
			float:'right',
			display:'block'
		}).append(
			(yoodoo.user.facebook===false && typeof(yoodoo.defaults.facebook)=="string" && yoodoo.defaults.facebook.length>0)?$(yoodoo.e("button")).attr("type","button").html("Log In").prepend(
				$(yoodoo.e("img")).attr("src",yoodoo.option.baseUrl+"uploads/sitegeneric/icons/png/fb.png").css({
					margin:'0px 3px 0px 0px',
					'vertical-align':'middle'
				})
			).click(
				function() {
					yoodoo.facebook.checkLoginState();
				}
			).css(
				{
					color:'#ffffff',
					background:'#3c56a1',
					'border-radius':'3px',
					border:'none',
					padding:'2px 4px',
					'box-shadow':'0px 0px 3px #FFF',
					cursor:'pointer'
				}
			):null
		).attr("id","fbbutton")
	);

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
	$(this.frame).find('.error').slideUp();
	/*.animate({
		opacity : 0,
		height : 0
	}, 500, function() {
		$(this).css({
			display : 'none',
			height : 'auto',
			opacity : 1
		});
	});*/
};
/*
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
	if (this.bookcase!==undefined) this.bookcase.items = [];
	this.clearUser();
	if (this.object!==undefined) this.object.clear();
	this.groups.dispose();
	this.comments.dispose();
	this.username = '';
	this.showLogin(yoodoo.w('notloggedin'));
	this.option.flashMovie.loaded = false;
	$('#' + this.option.flashMovie.id).remove();
	$(this.playerHolder).remove();
	this.playerHolder = undefined;
	yoodoo.events.trigger("logout");
};*/
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

yoodoo.fieldsUpdateCallbacks = [];
yoodoo.updateFields = function(fields, complete, opts) {
	// fields = [[field_id,value]];
	var option={
		justFields:false,
		ignoreSyllabus:false
	};
	if (typeof(opts)!="undefined") {
		for(var k in opts) option[k]=opts[k];
	}
	yoodoo.fieldsUpdateCallbacks.push(complete);
	var f = {
		callback : 'yoodoo.updatedFields',
		cmd : 'updateFields'
	};
	for (var i = 0; i < fields.length; i++) {
		f['field' + fields[i][0]] = Base64.encode(fields[i][1]);
	}
	if (option.justFields===false) {
		if (dooit.addTags.length > 0) {
			f['addtags'] = dooit.addTags.join(",");
		}
		if (dooit.removeTags.length > 0) {
			f['removetags'] = dooit.removeTags.join(",");
		}
	}else{
		var tagadd=$.extend([],dooit.addTags);
		var tagdel=$.extend([],dooit.removeTags);
	}
	dooit.addTags = [];
	dooit.removeTags = [];
	if (option.ignoreSyllabus===true) f.ignoreSyllabus=1;
	yoodoo.sendPost(null, f);
	
	if (option.justFields===true) {
		dooit.addTags=tagadd;
		dooit.removeTags=tagdel;
	}
};
yoodoo.updatedFields = function(reply) {
	if (/^\&lt\;/.test(reply) || /^\<\?xml/.test(reply)) {
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
yoodoo.lastReplyFrame = null;

yoodoo.userlogin=function() {
	if (this.checks.app()!==false) {
		this.loginValidate();
	}else{
		this.showLogin();
	};
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

yoodoo.setIntroText = function(txt) {
	yoodoo.callFlash(yoodoo.cmd.introText.flash, txt);
};
yoodoo.setUsername = function(txt) {
	yoodoo.callFlash(yoodoo.cmd.setUsername.flash, txt);
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
		} catch (e) {
			yoodoo.errorLog(e);
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
		try {
			eval(act);
		} catch (e) {
			yoodoo.errorLog(e);
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
		yoodoo.working(true,yoodoo.w('fetchingyourepisode'));
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
	yoodoo.working(true, yoodoo.w('fetchingyourdooit'));
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
			this.working(true, yoodoo.w('fetchingyourdooit'));
			this.dooitShowTimestamp = new Date().getTime();
			this.processShowDooit(id, snapshot);
			this.actionLogging.add('enter dooit', {
				id : id
			});
			//}
			return true;
		} else {
			this.alert(yoodoo.w('thisdooitisnotinyourjourney'));
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
	this.working(true, yoodoo.w('fetchingyourdooit'));
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

//yoodoo.receivedDooitHTML= '';
yoodoo.logout = function() {
	window.onbeforeunload = null;	this.widgets = [];
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
	if (this.bookcase!==undefined) this.bookcase.items = [];
	this.clearUser();
	if (this.object!==undefined) this.object.clear();
	this.groups.dispose();
	this.comments.dispose();
	this.username = '';
	this.showLogin(yoodoo.w('notloggedin'));
	this.option.flashMovie.loaded = false;
	$('#' + this.option.flashMovie.id).remove();
	$(this.playerHolder).remove();
	this.playerHolder = undefined;
	yoodoo.events.trigger("logout");
};

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
					yoodoo.errorLog(e);
				}
			}
		}
		try {
			eval('dooitInformation.snapshot=' + Base64.decode(dooitInformation.snapshot));
		} catch(e) {
			yoodoo.errorLog(e);
		}
		dooit.asyncSave = (dooitInformation.snapshot===null && dooitInformation.asyncSave===true);
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
	yoodoo.initThisParams=undefined;
	if (dooitInformation.display.match(/\<script/)) {
		$(div).html(dooitInformation.display + "<div style='clear:both'></div>");
		$(div).find('div').first().addClass("dooitDisplay");
	}else{
		$(div).html("<div class='dooitDisplay'></div><div style='clear:both'></div>");
		try{
			eval('yoodoo.initThisParams='+dooitInformation.display+';');
		}catch(e) {
			yoodoo.errorLog(e);
		}
	}
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

	var processThisDooitSave=function() {
		var thisdooit = yoodoo.bookcase.fetchDooit(yoodoo.lastLoad);
		var needsApproval = (thisdooit !== null && ((thisdooit.completed === undefined || !thisdooit.completed) && thisdooit.advisor_accept && yoodoo.user.advised && yoodoo.intervention===null));
		var comp = dooit.finishable();
		if (comp === null)
			return false;
		comp=(comp==true || comp.canComplete===true);
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
				html = yoodoo.w('thisdatawascreatedby')+' ' + dooitInformation.snapshotOwner + '. <nobr>'+yoodoo.w('savingitwilloverwriteyourown')+'</nobr> ';
				$(cont).html(html);
				var but = yoodoo.e("button");
				$(cont).append($(but).attr("type", "button").click(function() {
					dialogBox.close();
					yoodoo.processDooitSave();
				}).html(yoodoo.w('saveasmine')));

				var but = yoodoo.e("button");
				$(cont).append($(but).attr("type", "button").click(function() {
					if (yoodoo.intervention > 0) {
						yoodoo.hide();
						yoodoo.bookcase.showIntervention(null);
						setTimeout('yoodoo.welcome();', 500);
					} else {
						dialogBox.close();
					}
				}).html(yoodoo.w("cancel")));

			} else if (dooitInformation.snapshot !== null) {
				html = yoodoo.w('thisdataisfromoneofyoursnapshots')+' <nobr>'+yoodoo.w('savingitwilloverwriteyourcurrentversion')+'</nobr> ';
				$(cont).html(html);
				var but = yoodoo.e("button");
				$(cont).append($(but).attr("type", "button").click(function() {
					dialogBox.close();
					yoodoo.processDooitSave();
				}).html(yoodoo.w('save')));

				var but = yoodoo.e("button");
				$(cont).append($(but).attr("type", "button").click(function() {
					if (yoodoo.intervention > 0) {
						yoodoo.hide();
						yoodoo.bookcase.showIntervention(null);
						setTimeout('yoodoo.welcome();', 500);
					} else {
						dialogBox.close();
					}
				}).html(yoodoo.w('cancel')));

			} else if (needsApproval) {
				html = yoodoo.w('thisdooitwillnotbemarkedascompleteuntilyouradvisorhasacceptedit');
				$(cont).html(html);
				var but = yoodoo.e("button");
				$(cont).append($(but).attr("type", "button").click(function() {
					dialogBox.close();
					yoodoo.processDooitSave();
				}).html(yoodoo.w('continuetosave')));

				var but = yoodoo.e("button");
				$(cont).append($(but).attr("type", "button").click(function() {
					dialogBox.close();
				}).html(yoodoo.w('cancel')));
			} else {
				yoodoo.processDooitSave();
			}
		} else if (needsApproval) {
			html = yoodoo.w('youhaventyetfinishedifyoudecidetoleaveanywayyouradvisorwillberequiredtoacceptitbeforeitismarkedascomplete')+' ';
			$(cont).html(html);
			var but = yoodoo.e("button");
			$(cont).append($(but).attr("type", "button").click(function() {
				dialogBox.close();
				yoodoo.processDooitSave();
			}).html(yoodoo.w('leaveanyway')));

			var but = yoodoo.e("button");
			$(cont).append($(but).attr("type", "button").click(function() {
				dialogBox.close();
			}).html(yoodoo.w('stayforthemoment')));

		} else {
			html = yoodoo.w('youhaventyetfinished')+' ';
			$(cont).html(html);
			var but = yoodoo.e("button");
			$(cont).append($(but).attr("type", "button").click(function() {
				dialogBox.close();
				yoodoo.processDooitSave();
			}).html(yoodoo.w('leaveanyway')));

			var but = yoodoo.e("button");
			$(cont).append($(but).attr("type", "button").click(function() {
				dialogBox.close();
			}).html(yoodoo.w('stayforthemoment')));

		}
		if (html !== null) {
			dialog.show(cont);
		}
	};
	var doneWord=yoodoo.w("done");
	if (dooit.asyncSave===true) doneWord=doneWord.toLowerCase();
	$(rel).append($(done).attr("type", "button").addClass("done").html(doneWord).click(function() {
		processThisDooitSave();
	}));
	if (dooit.asyncSave===true) {
		var asyncSave=$(yoodoo.e("button")).attr("type","button").addClass("asyncSave").html("save").append(
			$(yoodoo.e("span"))
		).append(
			$(yoodoo.e("span")).addClass("ambersand").html("&amp;")
		).click(function() {
			var me=this;
			yoodoo.working(true,'Saving...');
			var updated=function() {
				yoodoo.working(false);
			};
			if (yoodoo.object!==undefined) {
				yoodoo.object.saveChanges(function() {
					var fields=dooit.values({withTags:false,encode:false});
					var arr=[];
					for(var k in fields) arr.push([k.replace(/^EF/,'')*1,fields[k]]);
					if (arr.length>0) {
						yoodoo.updateFields(arr,updated,{justFields:true,ignoreSyllabus:true});
					}else{
						updated();
					}
				},function() {
					yoodoo.working(false);
				});
			}else{
				// save
				var fields=dooit.values({withTags:false,encode:false});
				var arr=[];
				for(var k in fields) arr.push([k.replace(/^EF/,'')*1,fields[k]]);
				if (arr.length>0) {
					yoodoo.updateFields(arr,updated,{justFields:true,ignoreSyllabus:true});
				}else{
					updated();
				}
			}
		});
		$(rel).append(asyncSave);
	}

	var close = null;
	var justThisInIntervention = false;
	if (this.intervention === null) {
		close = yoodoo.e("button");
		$(rel).append($(close).attr("type", "button").addClass('footerbutton').html(yoodoo.w('close')).click(function() {
			var dialogBox = dialog;
			var coverallBox = coverall;
			$(this).addClass("on");
			var cont = yoodoo.e("div");
			var but1 = yoodoo.e("button");
			$(but1).attr("type", "button").html(yoodoo.w("cancel")).click(function() {
				dialogBox.close();
			}).css({
				margin : '0px 10px'
			});
			var but2 = yoodoo.e("button");
			$(but2).attr("type", "button").html(yoodoo.w('closewithoutsaving')).click(function() {
				dialogBox.close();
				yoodoo.cancelDooit();
			}).css({
				margin : '0px 10px'
			});
			var but3 = yoodoo.e("button");
			$(but3).attr("type", "button").html(yoodoo.w('saveandclose')).click(function() {
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
		$(rel).append($(scrapbook).addClass('scrapbookDooit').attr("type", "button").addClass('footerbutton').html('<div>' + yoodoo.w('scrapbook').toLowerCase() + '</div><div></div>').click(function() {
			$(this).addClass("on");
			if (dooitInformation.isScrapbooked) {
				var dialogBox = dialog;
				var cont = yoodoo.e("div");
				var but1 = yoodoo.e("button");
				$(but1).attr("type", "button").html(yoodoo.w('openscrapbook')).click(function() {
					//yoodoo.cancelDooit();
					dialogBox.close();
					yoodoo.showScrapbook();
				}).css({
					margin : '0px 10px'
				});
				var but2 = yoodoo.e("button");
				$(but2).attr("type", "button").html(yoodoo.w('stayhere')).click(function() {
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
				$(but1).attr("type", "button").html(yoodoo.w('yes')).click(function() {
					var addButton = me;
					dialogBox.close();
					/*$(addButton).css({
						width : $(addButton).outerWidth(false)
					});*/
					//.html("adding&hellip;");
					yoodoo.dooitScrapped = function() {
						dooitInformation.isScrapbooked = true;
						$(addButton).removeClass('scrapbookDooitAdd');
						/*var w = $(addButton).outerWidth(false);
						$(addButton).css({
							visibility : 'hidden',
							width : '50px',
							overflow : 'hidden',
							'white-space' : 'nowrap'
						}).removeClass('scrapbookDooitAdd');//.html(dooitInformation.isScrapbooked ? yoodoo.option.buttons.scrapbooked : yoodoo.option.buttons.scrapbook);
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
						});*/
					};
					yoodoo.scrapbookAdd();
				}).css({
					margin : '0px 10px'
				});
				var but2 = yoodoo.e("button");
				$(but2).attr("type", "button").html(yoodoo.w('no')).click(function() {
					dialogBox.close();
				}).css({
					margin : '0px 10px'
				});
				$(cont).html(yoodoo.w('addtoscrapbook')+'? ').append(but1).append(but2).css({
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
		$(rel).append($(comments).attr("type", "button").addClass('dooitComments').addClass('footerbutton').html('<div>' + yoodoo.w('comments') + '</div><div><div>' + ((dooitInformation.comments > 0) ? dooitInformation.comments : '') + '</div></div>').click(function() {
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
				title : yoodoo.w('comments'),
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
			$(rel).append($(snapshotButton).attr("type", "button").addClass('footerbutton').addClass('dooitSnapshots').html('<div>'+yoodoo.w("snapshots")+'</div><div><div>' + ((dooit.snapshots.length > 0) ? dooit.snapshots.length : '') + '</div></div>').click(function() {
				$(this).addClass("on");
				var cont = yoodoo.e("div");
				$(cont).addClass("snapshotList");
				var bin = yoodoo.e("div");
				$(cont).append($(bin).addClass("snapshotBin"));
				$(bin).droppable({
					drop : function(e, ui) {
						var item = ui.helper[0];
						if (window.confirm(yoodoo.w('areyousureyouwishtodeletethissnapshot'))) {
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
									alert(yoodoo.w('thissnapshotcouldnotbedeleted'));
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
						var sh = jQuery.parseJSON(yoodoo.ajax?data:Base64.decode(data));
						try {
							eval("sh.created=" + sh.created + ";");
							sh.created = new Date(sh.created.getTime() + yoodoo.serverTimeOffset);
						} catch(e) {
							yoodoo.errorLog(e);
						}

						dooit.snapshots.push(sh);
						var snap = yoodoo.e("div");
						snap.title = yoodoo.w('saved')+' ' + yoodoo.ago(sh.created);
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
				$(cont).append($(snap).addClass('addSnapshot').html('<span>+</span>'+yoodoo.w('newcall')));
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
		$(rel).append($(help).attr("type", "button").addClass('footerbutton').addClass('dooitHelp').html('<div>' + yoodoo.w('wtf') + '</div><div></div>').click(function() {
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
	yoodoo.object.purgeChanges();
	dooit.leave();
	yoodoo.hide(
		function() {
			yoodoo.closeDooitFunction();
			yoodoo.removeDooitDependencies();
			dooit.destroy();
			dooit.clearTagCache();
			yoodoo.clearMetaCache();
			yoodoo.object.purgeChanges();
			$(yoodoo.container).empty();
			yoodoo.bookcase.handlers.dooit_exit();
		}
	);
};
yoodoo.processDooitSave = function() {
	yoodoo.stopVoiceover();
	var dur = new Date().getTime() - yoodoo.dooitShowTimestamp;
	yoodoo.actionLogging.add('dooit saved', {
		id : yoodoo.lastLoad,
		duration : dur
	});
	var dosave=function() {
		dooit.leave();
		yoodoo.saveDooit();
	};
	dooit.presave();
	if (yoodoo.object.saveChanges(dosave)===false) dosave();
};
yoodoo.gotSnapshot = function() {
	this.warning({
		html : yoodoo.w('snapshotcaptured'),
		autoClose : 3000
	});
	this.hideWarning();
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
	} catch (e) {
			yoodoo.errorLog(e);
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

yoodoo.showScrapbook = function() {
	var targetItem = null;
	if (arguments.length > 0) {
		targetItem = arguments[0];
		yoodoo.scrapbookedItem.type = "book";
		yoodoo.scrapbookedItem.id = targetItem;
	}
	if (this.html5)
		yoodooPlaya.hideBookcase();
	yoodoo.working(true, yoodoo.w('fetchingyourscrapbook'));
	if (yoodoo.loggedin) {
		yoodoo.actionLogging.add('Scrapbook opened', {});
		var params = {
			cmd : yoodoo.cmd.scrapbook.server,
			callback : 'yoodoo.' + yoodoo.cmd.scrapbook.callback
		};
		/*if (targetItem !== null)
			params.targetItem = targetItem;
		if ($('#filter_order_by').get().length > 0)
			params.filterorder = $('#filter_order_by').val();
		if ($('#filter_type').get().length > 0)
			params.filtertype = $('#filter_type').val();*/
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
	yoodoo.working(true, yoodoo.w('updatingyourscrapbook'));
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
	yoodoo.working(true, yoodoo.w('updatingyourscrapbook'));
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
	yoodoo.working(true, yoodoo.w('updatingyourscrapbook'));
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
	yoodoo.working(true, yoodoo.w('updatingyourscrapbook'));
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
		}
	}
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
			$(tmp).html("<div style='height:" + yoodoo.option.height + "px'><center style='padding:20% 0'>"+yoodoo.w('loadingscrapbookfiles')+"</center></div>");
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
			['dooits/nicEdit.js', true],  ['dooits/inputs.js', true]];
			this.scrapbookFiles=new yoodoo.fileLoader.loader(scrapDep, function() {
				yoodoo.scrapbookLoaded();
			});
			/*this.scrapbookFiles = this.checkDependencies(scrapDep, function() {
				yoodoo.scrapbookLoaded();
			});*/
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
		var finishedReturn = dooit.finishable();
		var complete=(finishedReturn===true || finishedReturn.canComplete===true || finishedReturn.complete===true);
		var savable=!(finishedReturn === null || finishedReturn.canSave===false);
		if (savable) {
			var dv = dooit.values({
				blind : blind
			});
			var p = {};
			for (var k in dv)
			p[k] = dv[k];
			p.cmd = yoodoo.cmd.dooitsave.server;
			p.dooit = yoodoo.lastLoad;
			dv.completed = p.completed = complete ? '1' : '0';
			if (blind) {
				p.callback = 'yoodoo.' + yoodoo.cmd.bookshelfxml.callback;
			} else {
				p.callback = 'yoodoo.' + yoodoo.cmd.dooitsave.callback;
				yoodoo.working(true, yoodoo.w('savingyourinformationandrecalculatingyourjourney'));
			}
			yoodoo.sendPost(null, p, false);
			yoodoo.events.trigger('saveDooit', {
				dooit : yoodoo.bookcase.fetchDooit(p.dooit),
				value : dv
			});
			if (complete) {
				this.bookcase.handlers.dooit_complete();
			}
			//if (!blind) {
			this.postDooitSave = function() {
				var progression = complete;
				// autoprogress if dooit is completed
				if (yoodoo.autoLoad != undefined && yoodoo.autoLoad != null && !isNaN(yoodoo.autoLoad))
					progression = yoodoo.bookcase.fetchDooit(yoodoo.autoLoad);
				yoodoo.autoLoad = undefined;
				yoodoo.bookcase.handlers.dooit_exit(progression);
			};
			//}
		} else {
			if (!blind) {
				this.postDooitSave = function() {
					this.bookcase.handlers.dooit_exit(false);
				};
			}
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
	var hidden=function() {
		yoodoo.removeDooitDependencies();
		dooit.clearTagCache();
		yoodoo.closeDooitFunction();
		yoodoo.postDooitSave();
	};
	//hidden=function(){};
	if (r == "saved") {
		yoodoo.hide(hidden);
		if (yoodoo.option.flashMovie.ports.closedDooit != "")
			yoodoo.callFlash(yoodoo.option.flashMovie.ports.closedDooit, 'closedDooit');
	} else {
		yoodoo.hide(hidden);
		eval('yoodoo.' + yoodoo.cmd.bookshelfxml.callback + "(r);");
		if (yoodoo.option.flashMovie.ports.closedDooit != "")
			yoodoo.callFlash(yoodoo.option.flashMovie.ports.closedDooit, 'closedDooit');
	}
	/*yoodoo.removeDooitDependencies();
	dooit.clearTagCache();
	yoodoo.closeDooitFunction();
	this.postDooitSave();*/
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
	//yoodoo.password_updated=true;
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

		$(yoodoo.frame).find('.welcome .messenger').html(yoodoo.w('youhavesuccessfullysavedyourdetails'));
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
		err.html(yoodoo.w('failedtochangeyourpasswordmaybethedetailswereincorrect'));
		err.slideDown(yoodoo.animateDuration);
	} else {
		$(yoodoo.welcomeContainers.tabcontent[0]).find('input').val('');
		var postSlide = '';
		yoodoo.loginCode = r;
		if (!yoodoo.password_updated) {
			if (yoodoo.option.introMovie.flashvars.intro != "") {
				postSlide = 'yoodoo.showIntro();';
			}else{
				postSlide = '$(yoodoo.frame).find(".welcome #continue").trigger("click");';
			}
		}
		yoodoo.password_updated = true;
		$(this.frame).find('#cancelPassword').css('display', 'inline-block');
		$(yoodoo.frame).find('.welcome .messenger').html(yoodoo.w('youhavesuccessfullychangedyourpassword'));
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
		if (this.bookcase.continueControl() !== true && postSlide=='')
			$(yoodoo.frame).find('.welcome').removeClass("noContinue");
		if (postSlide != "") {
			$($(yoodoo.frame).find('.tabs .tab').last()).trigger('click');
			setTimeout(postSlide, 1000);
		} else {
			setTimeout(function() {
				$(yoodoo.frame).find('.welcome .messenger').slideUp(500, function() {
					$($(yoodoo.frame).find('.tabs .tab').last()).trigger('click');
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
		this.working(true, yoodoo.w('loadingyourintroduction'));
		var ins = "<div><center><div style='padding:5px 10px 0 0'><div id='yoodooIntroPlayerHolder'></div></div><button type='button' onclick='yoodoo.removeIntroMovie();yoodoo.hide(function() {" + ( withClose ? '' : 'yoodoo.welcome();') + "});' class='green medium' style='margin:5px 0 0 0;" + ( withClose ? '' : 'display:none;') + "'>"+yoodoo.w('presstostart')+"</button></center></div>";
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

yoodoo.refreshedDashboard = function() {
	yoodoo.nextActions = ['yoodoo.welcome();'];
	yoodoo.dashboard();
};
yoodoo.dashboard = function() {
	this.working(true, yoodoo.w('fetchingyourdashboard'));
	var params = {
		cmd : yoodoo.cmd.home.server,
		callback : 'yoodoo.' + yoodoo.cmd.home.callback
	};
	yoodoo.sendPost(null, params);
};
yoodoo.dashboardreply = function(code) {
	this.working(false);
	try {
		if (!yoodoo.ajax) code=Base64.decode(code);
		code = yoodoo.decodeHTMLResponse(code);
		code = yoodoo.replaceMeta(code);
		code = jQuery.parseJSON(code);
		code = dooit.decode(code);
		yoodoo.console(code);
		yoodoo.replyValues(code);
		yoodoo.password_updated = !code.first;
		yoodoo.nextActions = ['yoodoo.welcome();'];
		$(yoodoo.container).slideUp(yoodoo.animateDuration, function() {
			yoodoo.doNextActions();
		});
	} catch (e) {
		yoodoo.errorLog(e);
		var err = $(yoodoo.frame).find('.login .error');
		err.html(yoodoo.w('failedtoloadyourinformation'));
		err.fadeIn(yoodoo.animateDuration);
		yoodoo.timer = setTimeout('yoodoo.hideError();', 3000);
	}

};

yoodoo.loginreply = function(code) {
	var reply = code;
	if (!yoodoo.ajax && !(/^error/.test(code))) code=Base64.decode(code);
	var err=false;
	if (/^error/.test(code)) err=true;
	if (err!==true) {
		try {
			code = yoodoo.replaceMeta(code);
			code=yoodoo.parseJSON(code);
			if (typeof(code.error)=='string' && code.error.length>0) {
				if (code.error=='notattached') return false;
				err=true;
				//console.log(code);
			}
		}catch(e) {
			yoodoo.errorLog(e);
			err=true;
		}
	}
	if (err===false) {
		yoodoo.nextActions = ['yoodoo.welcome();'];
		yoodoo.working(true, yoodoo.w('loadingyourbookcase'));
		try{
			//code = jQuery.parseJSON(Base64.decode(code));
			yoodoo.console(code);
			yoodoo.loginCode = code.userHash;
			if (yoodoo.mobile) {
				if (yoodoo.stayin) {
					localStorage.setItem('userhash', yoodoo.loginCode);
					localStorage.setItem('isApp', yoodoo.isApp);
				} else {
					localStorage.removeItem('userhash');
					localStorage.removeItem('isApp');
				}
			}
			yoodoo.password_updated = !code.first;
			yoodoo.replyValues(code);
			yoodoo.loggedin = true;
			if (BrowserDetect.browser=='Explorer' || BrowserDetect.version<=10) {
			}else{
				window.onbeforeunload = function() {
					return yoodoo.w('leavingthispagewilllogyouout');
				};
			}
			if (yoodoo.loggedin) {
				yoodoo.actionLogging.add('Logged in', {});
				yoodoo.events.trigger("loggedin", yoodoo.user.username);
				yoodoo.openAppOnRotate = false;
				$(yoodoo.container).slideUp(yoodoo.animateDuration, function() {
					if (!yoodoo.html5) {
						yoodoo.insertFlash();
					} else {
						yoodoo.callXML();
					}
				});
			}
			if (yoodoo.user.staff) {
				yoodoo.option.yoodooPortal.url = yoodoo.option.baseUrl + 'frontend_dev.php/remote';
				// ok
			}
		} catch (e) {
			yoodoo.errorLog(e);
			err=true;
		}
	}
	if (err===true) {
		yoodoo.working(false);
		yoodoo.actionLogging.add('Login error', {});
		var err = $(yoodoo.frame).find('.login .error');
		if (code.error!==undefined) {
			code=code.error;
		}else if (/^error\:/.test(code)) {
			code = code.replace(/^error\:/, '');
		} else {
			//code = "Failed to load your information. Please try again.";
			code = yoodoo.w('failedtoloadyourinformation');
		}
		err.html(code);
		err.slideDown(yoodoo.animationDuration);
		yoodoo.timer = setTimeout('yoodoo.hideError();', 10000);
	}
};
yoodoo.getkeypointcomments = function(episodeID, keypoint) {
	yoodoo.working(true, yoodoo.w('fetchingcomments'));
	var params = {
		cmd : yoodoo.cmd.commentskeypointget.server,
		content_id : episodeID,
		keypoint : keypoint,
		callback : 'yoodoo.' + yoodoo.cmd.commentskeypointget.callback
	};
	yoodoo.sendPost(null, params);
};
yoodoo.episodeclosed = function() {
	if (arguments.length>0 && arguments[0]!==null) yoodoo.nextActions.push(arguments[0]);
	if (this.html5) {
		yoodoo.hideAnimation(yoodooPlaya.episodeTarget,function() {yoodoo.bookcase.handlers.episode_exit();});
	}else{
		this.bookcase.handlers.episode_exit();
	}
};
yoodoo.episodecomplete = function(episodeID) {
	this.lastItemId = episodeID;
	yoodoo.working(true, yoodoo.w('updatingyourjourney'));

	var params = {
		cmd : yoodoo.cmd.episodecomplete.server,
		content_id : episodeID,
		callback : 'yoodoo.' + yoodoo.cmd.episodecomplete.callback
	};
	yoodoo.sendPost(null, params);
	if (this.html5) {
		yoodoo.hideAnimation(yoodooPlaya.episodeTarget,function() {yoodoo.bookcase.handlers.episode_complete();});
	}else{
		this.bookcase.handlers.episode_complete();
	}
};
yoodoo.quizresults = function(quizresultdata) {
	yoodoo.working(true, yoodoo.w('updatingyourjourney'));
	yoodoo.actionLogging.add('saving quiz', {});
	var params = {
		cmd : yoodoo.cmd.quizresults.server,
		quizresultdata : quizresultdata,
		callback : 'yoodoo.' + yoodoo.cmd.quizresults.callback
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
		this.alert(yoodoo.w('thisepisodeisnotinyourjourney'));
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

yoodoo.bubble = function(obj, text) {
	obj.bubbleOptions={
		fadeIn:true,
		fadeOut:true,
		onlyTarget:false,
		trackMouse:false,
		trackMouseX:true,
		trackMouseY:true
	};
	if (arguments.length>2) {
		for(var k in arguments[2]) obj.bubbleOptions[k]=arguments[2][k];
	}
	obj.bubbleText = text;
	obj.clearBubble=function() {
		var bind=this.bubbleOptions.trackMouse?'mousemove':(this.bubbleOptions.onlyTarget?"mouseover":"mouseenter");
		$(this).unbind(bind);
	};
	var bind=obj.bubbleOptions.trackMouse?'mousemove':(obj.bubbleOptions.onlyTarget?"mouseover":"mouseenter");
	$(obj).unbind(bind).bind(bind, function(e) {
		if (this.bubbleOptions.onlyTarget===true && e.target!==this) return false;
		var created=false;
		if (this.bubble === undefined) {
			this.bubble = yoodoo.e("div");
			$(this.bubble).css({
				visibility : 'hidden'
			});
			created=true;
		}
		$(this.bubble).html(this.bubbleText).css({
		}).addClass("yoodooBubble");
		$(document.body).append(this.bubble);
		var pos = $(this).offset();
		var l = pos.left + ($(this).width() / 2) - ($(this.bubble).width() / 2);
		var t = pos.top - $(this.bubble).height() - 20;

		if (this.bubbleOptions.trackMouse===true && this.bubbleOptions.trackMouseX===true) {
			l=e.pageX-($(this.bubble).width() / 2);
		}
		if (this.bubbleOptions.trackMouse===true && this.bubbleOptions.trackMouseY===true) {
			t=e.pageY-$(this.bubble).height() - 20;
		}

		var r = l + $(this.bubble).width();
		if (r > $(document.body).width())
			l -= (r - $(document.body).width());
		if (l < 0)
			l = 0;
		if (t < 0)
			t += $(this.bubble).height() + 40 + $(this).height();
		$(this.bubble).css({
			left : l,
			top : t
		});
		if (created) {
			if (this.bubbleOptions.fadeIn) {
				$(this.bubble).css({
				visibility : 'visible',
				opacity : 0
				}).stop().animate({
					opacity : 1
				});
			}else{
				$(this.bubble).css({
					visibility : 'visible'
				});
			}
			var bind=(this.bubbleOptions.onlyTarget?"mouseout":"mouseleave");
			$(this).bind(bind, function() {
				$(this).unbind(bind);
				var me = this;
				if (this.bubbleOptions.fadeOut) {
					$(this.bubble).stop().animate({
						opacity : 0
					}, 200, function() {
						me.bubble = undefined;
						$(this).remove();
					});
				}else{
					$(this.bubble).remove();
					this.bubble = undefined;
				}
			});
			$(this).on("remove", function() {
				var me = this;
				$(this.bubble).stop().animate({
					opacity : 0
				}, 200, function() {
					$(this).remove();
				});
			});
		}
	});
};
yoodoo.advisorPanelShow = function() {
	yoodoo.advisorPanel.show();
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
