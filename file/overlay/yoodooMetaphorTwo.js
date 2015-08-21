yoodoo.logo={
	svg:'<path fill="#FFFFFF" d="M54.091,26.762H37.043l-4.715,12.614c-1.159,2.931-2.523,6.828-3.799,10.657 c-1.106-3.402-2.425-7.255-3.75-10.684l-4.723-12.587H2.5l17.325,44.367C16.11,80.241,11.34,85.414,4.411,87.658l6.213,11.879 l2.801-0.864c10.044-3.073,17.65-12.128,23.938-28.519l7.614-19.559L54.091,26.762z"/><path fill="#42B649" d="M73.538,61.479c-3.884-0.025-9.379-4.354-9.379-10.467c0-6.111,5.177-10.287,9.026-10.463 c3.951-0.181,6.324,0.862,7.89,2.408V59.07c-1.55,1.418-4.427,2.406-7.448,2.406C73.598,61.479,73.566,61.479,73.538,61.479 M81.075,26.267c-2.347-0.741-4.976-1.045-7.677-1.045c-14.711,0-25.497,12.27-25.497,27.092c0,7.006,2.673,13.365,7.625,17.904 c4.438,4.069,9.603,6.402,15.418,6.402c4.594,0,7.783-0.891,10.13-2.553v2.75H97.5V58.048V43.969V9.195L81.075,0.463V26.267z"/>',
	width:100,
	height:100
};
yoodoo.cmd= {
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
		},
		hub:{
			server:'fetchHub',
			callback:'yoodoo.gotHub'	
		}
};

// The display stack

yoodoo.display={
	index:0,
	stack:[],
	add:function(name,obj,hideBelow,animate) {
		var params={
			name:'stack'+this.index++, 
			obj:null,
			hideBelow:false,
			animate:false,
			added:function() {},
			complete:function() {},
			revealed:function() {},
			removed:function() {}
		};
		if (arguments.length==1 && typeof(arguments[0])=="object") {
			for(var k in arguments[0]) params[k]=arguments[0][k];
		}else{
			if (arguments.length>0) params.name=arguments[0];
			if (arguments.length>1) params.obj=arguments[1];
			if (arguments.length>2) params.hideBelow=arguments[2];
			if (arguments.length>3) params.animate=arguments[3];
			if (arguments.length>4) params.complete=arguments[4];
			if (arguments.length>5) params.revealed=arguments[5];
			if (arguments.length>6) params.removed=arguments[6];
			if (arguments.length>7) params.added=arguments[7];
		}
		if (yoodoo.loaderInfo!==undefined) {
			$(yoodoo.loaderInfo).remove();
			yoodoo.loaderInfo=undefined;
		}
		var idx=this.getIndex(params.name);
		if (idx!==false) {
			var obj=this.stack[idx].obj;
			obj.empty().append(params.obj);
			params.obj=obj;
			this.stack[idx]=params;
			this.z();
			params.added();
			params.complete();
		}else{
			//this.z();
			if (params.animate===true) {
				var aniDiv=$(yoodoo.e("div")).css({'position':'absolute',top:0,left:'100%',width:'100%',height:'100%',overflow:'hidden'}).append(params.obj);
				params.obj=aniDiv;
				this.stack.push(params);
				$(yoodoo.widget).append(aniDiv);
				this.z();
				params.added();
				aniDiv.transition({'left':'0%'},function() {
					params.complete();
					yoodoo.display.hides();
				});
			}else{
				this.stack.push(params);
				$(yoodoo.widget).append(params.obj);
				this.z();
				params.added();
				params.complete();
				this.hides();
			}
		}
		$(':focus').blur();
		return function() {
			yoodoo.display.remove(params.name);
		};
	},
	z:function() {
		for(var s=0;s<this.stack.length;s++) {
			$(this.stack[s].obj).css({'z-index':(s*10)+10});
		}
	},
	hides:function(withRemove) {
		var hide=false;
		for(var s=this.stack.length-1;s>=0;s--) {
			$(this.stack[s].obj).css({display:hide?'none':'block'});
			//if (!hide && s==this.stack.length-1 && withRemove) this.stack[s].revealed();
			if (this.stack[s].hideBelow) hide=true;
		}
	},
	removeUnder:function(name) {
		if (name!==undefined) {
			while(this.stack.length>1 && this.stack[0].name!=name) {
				obj = this.stack.shift();
				$(obj.obj).remove();
			}
			this.z();
			this.hides();
		}
	},
	remove:function(name) {
		var complete=function() {};
		if (arguments.length>1) complete=arguments[1];
		var obj=null;
		if (name!==undefined && name!==null) {
			var i=this.getIndex(name);
			if (i!==false) {
				obj = this.stack.splice(i,1)[0];
			}
		}else{
			if (this.stack.length>0 && (
(this.stack[this.stack.length-1].name=='dooit' && yoodoo.dooit.item._experience._session.intervention===true)
 || 
(this.stack[this.stack.length-1].name=='episode' && yoodoo.episode.item._experience._session.intervention===true)
))
 return false;
			obj=this.stack.pop();
		}
		if (obj===null) return false;
		var removed=function() {};
		if (obj.removed!==undefined) removed=obj.removed;
		var me=this;
		if (typeof(obj)!='undefined' && obj!==null) {
			if (obj.animate) {
				this.hides(true);
				obj.obj.transition({'left':'100%'},function() {
					$(this).remove();
					complete();
					removed();
					if (yoodoo.display.stack.length>0) yoodoo.display.stack[yoodoo.display.stack.length-1].revealed();
					//if (me.stack.length==0) yoodoo.sessions.showHub();
				});
			}else{
				$(obj.obj).remove();
				this.z();
				this.hides(true);
				complete();
				removed();
				if (yoodoo.display.stack.length>0) yoodoo.display.stack[yoodoo.display.stack.length-1].revealed();
				//if (this.stack.length==0) yoodoo.sessions.showHub();
			}
		}
		return obj;
	},
	clear:function() {
		while(this.stack.length>0) this.remove();
	},
	getIndex:function(name) {
		for(var s=0;s<this.stack.length;s++) {
			if (this.stack[s].name==name) return s;
		}
		return false;
	}
};

// Called once dependency files are loaded

yoodoo.loaded=function() {
	yoodoo.display.clear();
	//this.loader('Rendering...');
	this.userlogin();
};

/*yoodoo.working = function(on) {
	var txt = '';
	if (arguments.length > 1)
		txt = arguments[1];
	if (on)
		if (this.containers.wait===undefined) $(this.container).append();
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
};*/
yoodoo.credentials={username:'',password:''};

yoodoo.logout = function() {
	window.onbeforeunload = null;
	yoodoo.actionLogging.add('Logout', {});
	var params = {
		cmd : yoodoo.cmd.logout.server,
		callback : 'yoodoo.' + yoodoo.cmd.logout.callback
	};
	yoodoo.sendPost(null, params);
	this.loggedin = false;
	this.clearUser();
	if (this.object!==undefined) this.object.clear();
	this.groups.dispose();
	this.comments.dispose();
	this.username = '';
	yoodoo.interface.showLogin();
	this.display.removeUnder('login');
	yoodoo.events.trigger("logout");
};
yoodoo.userlogin=function() {
	if (this.checks.app()!==false) {
		this.loginValidate();
	}else{
		this.interface.showLogin();
	}
};
yoodoo.showLogin=function(error) {
	if (yoodoo.unavailable!==undefined && yoodoo.unavailable!==false) {
		var div=$(yoodoo.e("div")).css({
			'line-height':yoodoo.option.height+'px',
			'white-space':'nowrap',
			overflow:'hidden',
			'text-align':'center'
		}).html(yoodoo.unavailable);
		this.display.add({
			name:'login',
			obj:$(yoodoo.e("div")).append(div),
			complete:function() {
				yoodoo.display.removeUnder("login");
			},
			animate:(typeof(error)=='string')
		});
	}else if (yoodoo.unavailableAll!==undefined && yoodoo.unavailableAll!==false) {
		var div=$(yoodoo.e("div")).css({
			'line-height':yoodoo.option.height+'px',
			'white-space':'nowrap',
			overflow:'hidden',
			'text-align':'center'
		}).html(yoodoo.unavailableAll);
		this.display.add({
			name:'login',
			obj:$(yoodoo.e("div")).append(div),
			complete:function() {
				yoodoo.display.removeUnder("login");
			},
			animate:(typeof(error)=='string')
		});
	}else{
		this.containers.login=this.e("div");
		$(this.containers.login).addClass("login").css({
			'min-width':'500px',
			width:this.option.width,
			visibility:'hidden'
		}).append($(yoodoo.e("center")).html('<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="300px" height="125px" viewBox="0 0 300 125" enable-background="new 0 0 300 125" xml:space="preserve"><path fill="#FFFFFF" d="M141.055,53.049c0-5.309,1.122-10.216,3.128-14.48c-4.414-7.178-12.417-11.78-21.95-11.78c-12.299,0-22.06,7.598-24.897,18.499c-2.826-10.9-12.549-18.499-24.8-18.499c-7.971,0-14.871,3.013-19.517,8.224l2.687-7.176H39.082l-4.651,12.447c-1.145,2.892-2.491,6.737-3.75,10.515c-1.091-3.357-2.391-7.159-3.698-10.542l-4.659-12.42H5l17.093,43.776c-3.665,8.991-8.372,14.095-15.207,16.31l6.129,11.723l2.762-0.854c9.911-3.034,17.416-11.968,23.619-28.14l7.414-19.298c-0.003,0.192-0.014,0.386-0.014,0.58c0,14.281,11.066,25.052,25.739,25.052c12.251,0,21.974-7.569,24.8-18.426c2.838,10.856,12.598,18.426,24.897,18.426c9.465,0,17.417-4.52,21.851-11.58C142.116,61.564,141.055,57.333,141.055,53.049 M72.536,62.282c-5.22,0-9.307-4.542-9.307-10.339c0-5.914,4.087-10.545,9.307-10.545c5.217,0,9.306,4.632,9.306,10.545C81.841,57.74,77.753,62.282,72.536,62.282 M122.233,62.282c-5.22,0-9.308-4.542-9.308-10.339c0-5.914,4.088-10.545,9.308-10.545c5.218,0,9.305,4.632,9.305,10.545C131.538,57.74,127.451,62.282,122.233,62.282"></path><linearGradient id="SVGID_1_" gradientUnits="userSpaceOnUse" x1="220.4385" y1="77.2285" x2="220.4385" y2="1.8892"><stop offset="0" style="stop-color:#2D9B38"></stop><stop offset="0.0085" style="stop-color:#309C38"></stop><stop offset="0.1191" style="stop-color:#50A734"></stop><stop offset="0.2384" style="stop-color:#6AB131"></stop><stop offset="0.3701" style="stop-color:#7EB82F"></stop><stop offset="0.519" style="stop-color:#8CBD2D"></stop><stop offset="0.6997" style="stop-color:#94C02C"></stop><stop offset="1" style="stop-color:#97C12C"></stop></linearGradient><path fill="url(#SVGID_1_)" d="M171.171,62.091c-3.832-0.025-9.254-4.295-9.254-10.326c0-6.03,5.108-10.151,8.907-10.324c3.899-0.179,6.24,0.85,7.784,2.375v15.899c-1.528,1.399-4.366,2.375-7.35,2.375C171.229,62.091,171.2,62.091,171.171,62.091 M210.356,51.942c0-5.914,4.089-10.545,9.308-10.545c5.218,0,9.306,4.632,9.306,10.545c0,5.797-4.088,10.339-9.306,10.339C214.445,62.282,210.356,57.74,210.356,51.942 M260.054,51.942c0-5.914,4.088-10.545,9.307-10.545s9.307,4.632,9.307,10.545c0,5.797-4.088,10.339-9.307,10.339S260.054,57.74,260.054,51.942 M178.608,27.349c-2.314-0.731-4.909-1.031-7.575-1.031c-14.514,0-25.156,12.106-25.156,26.732c0,6.913,2.637,13.187,7.525,17.667c4.379,4.014,9.473,6.315,15.212,6.315c4.532,0,7.68-0.878,9.994-2.52v2.716h16.207V58.731c2.895,10.767,12.614,18.255,24.849,18.255c12.252,0,21.973-7.567,24.8-18.425c2.838,10.857,12.599,18.425,24.896,18.425c14.617,0,25.64-10.769,25.64-25.049c0-14.336-11.022-25.148-25.64-25.148c-12.298,0-22.059,7.598-24.896,18.499c-2.827-10.9-12.548-18.499-24.8-18.499c-12.234,0-21.954,7.519-24.849,18.326V10.504l-16.207-8.616V27.349z"></path><path fill="#FFFFFF" d="M192.036,109.857V99.299h-12.855v10.559h-3.038V86.221h3.038v10.447h12.855V86.221h3.075v23.637H192.036z"></path><path fill="#FFFFFF" d="M200.072,109.857V86.221h12.522v2.63h-9.484v7.817h7.891v2.631h-7.891v7.928h10.817v2.631H200.072z"></path><path fill="#FFFFFF" d="M233.227,109.857l-2.63-6.372h-9.596l-2.593,6.372h-3.001l9.892-23.971h1.111l9.892,23.971H233.227z M226.966,94.52c-0.37-0.927-0.778-2.148-1.111-3.261h-0.074c-0.296,1.112-0.778,2.334-1.148,3.261l-2.594,6.521h7.521L226.966,94.52z"></path><path fill="#FFFFFF" d="M239.633,109.857V86.221h3.038v21.006h10.707v2.631H239.633z"></path><path fill="#FFFFFF" d="M261.637,88.851v21.007h-3.038V88.851h-7.854v-2.63h18.746v2.63H261.637z"></path><path fill="#FFFFFF" d="M288.087,109.857V99.299h-12.855v10.559h-3.038V86.221h3.038v10.447h12.855V86.221h3.075v23.637H288.087z"></path></svg>'));
		var me=this;
		var un=new yoodoo.ui.text({
			label:yoodoo.w("_username"),
			fontSize:34,
			lineHeight:50,
			required:true,
			spellcheck:false,
			onchange:function() {
				me.credentials.username=this.value;
			},
			onenter:function() {
				me.tryLogin();
			}
		});
		var pw=new yoodoo.ui.password({
			label:yoodoo.w("_password"),
			fontSize:34,
			lineHeight:50,
			required:true,
			onchange:function() {
				me.credentials.password=this.value;
			},
			onenter:function() {
				me.tryLogin();
			}
		});
		var but=$(yoodoo.e("button")).attr("type","button").html(yoodoo.w("login")).click(function() {
			me.tryLogin();
		}).css({
			display:'block',
			margin:'30px auto'
		});
		$(this.containers.login).append(
			un.render('').css({'padding-top':5})
		).append(
			pw.render('').css({'padding-top':5})
		).append(but);
		
		this.display.add({
			name:'login',
			obj:$(yoodoo.e("div")).append(this.containers.login),
			complete:function() {
				yoodoo.display.removeUnder("login");
			},
			animate:(typeof(error)=='string')
		});
		var t=Math.round((this.option.height-$(this.containers.login).height())/2);
		$(this.containers.login).css({
			'padding-top':t-10,
			opacity:0,
			visibility:'visible'
		}).animate({
			'padding-top':t,
			opacity:1
		});
		
		if (this.canApp && !yoodoo.isApp) {
			$(this.containers.login).append(
				$(yoodoo.e("button")).attr("type","button").html("Open web app").click(function() {
					yoodoo.openApp();
				})
			);
		}
	}
};
yoodoo.tryLogin=function() {
	if (this.credentials.username=='' || this.credentials.password=='') {
		this.messages.show({text:yoodoo.w('needbothdetails')});
	}else{
		yoodoo.login(this.credentials.username,this.credentials.password);
	}
};
yoodoo.loginreply=function(val) {
	yoodoo.interface.hideDialog();
		//$(document.body).html('<span style="color:#fff">'+val+'</span>');
		try{
			//console.log(Base64.decode(val));
			if (!yoodoo.ajax) val=Base64.decode(val);
			var arr=yoodoo.parseJSON(val);
			if (arr.error!==undefined) {
				yoodoo.messages.show({text:arr.error,timeout:5});
			}else{
				yoodoo.console(arr);
				yoodoo.loginCode = arr.userHash;
				yoodoo.replyValues(arr);
				if (yoodoo.user.staff || yoodoo.ifApp()) {
					yoodoo.option.yoodooPortal.url = yoodoo.option.baseUrl + 'frontend_dev.php/remote';
				}
				yoodoo.fetchHub();
			}
			//yoodoo.interface.clicked_notifications();
		}catch(e) {
			yoodoo.errorLog(e);
			yoodoo.interface.showLogin();
			//$(document.body).html('<span style="color:#fff">'+JSON.stringify(val)+'</span>');
			//yoodoo.messages.show({text:'Sorry, an issue has prevented your profile being loaded'});
		}
};
yoodoo.fetchHub=function() {
	yoodoo.interface.showDialog(yoodoo.w('_fetchingyourstatus')+'&hellip;');
	var params={
		cmd : yoodoo.cmd.hub.server,
		callback : yoodoo.cmd.hub.callback,
		widgets : yoodoo.sessions.getWidgetIds().join(',')
	};
	yoodoo.sendPost(null,params);
};
yoodoo.gotHub=function(hub) {
	yoodoo.interface.showDialog(yoodoo.w('_buildingyourhub')+'&hellip;');
	try{
		if (!yoodoo.ajax) hub=Base64.decode(hub);
		var hub=yoodoo.parseJSON(hub);
			//$(document.body).append('<div>'+JSON.stringify(hub)+'</div>');
		if (hub.widgets!==undefined) {
			yoodoo.sessions.gotWidgets(hub.widgets,function() {
				//$(document.body).append(' Height='+$('#yoodooWidget').height());
		//$(document.body).append($('#yoodooWidget').get().length);
		//return false;
				yoodoo.sessions.showHub();
			});
		}else{
			yoodoo.sessions.showHub();
		}
		//var notification=yoodoo.interface.clicked_notifications();
		//if (notification!==false) {
			// display the notification
		//}
	}catch(e) {
			yoodoo.errorLog(e);
		//$(document.body).html(JSON.stringify(e.message));
		yoodoo.messages.show({text:yoodoo.w('sorryhubissue')});
	}
};
yoodoo.header_height=50;
yoodoo.buildHeader=function(opts) {
	
		var buttonSize=Math.floor(this.header_height*0.5);
	
		if (opts.buttons===undefined) opts.buttons=[];
		if (opts.search===true)  opts.buttons.push({icon:'search',action:'yoodoo.interface.search()'});
		if (opts.community===true)  opts.buttons.push({icon:'communityHub',action:'yoodoo.interface.community()'});
		for(var b in opts.buttons) {
			if (typeof(opts.buttons[b].icon)=="string") opts.buttons[b].icon=yoodoo.icons.get(opts.buttons[b].icon,buttonSize,buttonSize,{'4d4d4d':'ffffff'});
		}
		
	if (yoodoo.interface.toolbarShow(opts)===true) return true;
		this.header=$(yoodoo.e("div")).addClass("yoodooHub_header").css({
			height:this.header_height,
			'line-height':this.header_height+'px',
			'white-space':'nowrap',
			overflow:'hidden'
		}).html($(yoodoo.e("span")).html(opts.title));
		var logo=null;
		if (opts.logo!==undefined) logo=yoodoo.icons.drawSVG(opts.logo,(opts.logoWidth/opts.logoHeight)*this.header_height*0.6,this.header_height*0.6,opts.logoWidth,opts.logoHeight);
		$(logo).css({margin:this.header_height*0.2});
		
		this.menuButton=null;
		var menuItems=(typeof(opts.menu)=='object')?opts.menu:null;
		if (typeof(opts.menu)=='object') this.menuButton=$(yoodoo.e("button")).attr("type","button").append(yoodoo.icons.get("menu",buttonSize,buttonSize)).css({
			width:this.header_height,
			height:this.header_height,
			padding:Math.floor((this.header_height-buttonSize)/2).toString()+'px 10px'
		}).click(function() {
			yoodoo.menu.show(menuItems);
		});
		this.backButton=null;
		if (opts.back===true || typeof(opts.back)=="string") {
			this.backButton=$(yoodoo.e("button")).attr("type","button").append(yoodoo.icons.get("back",buttonSize,buttonSize,{'212121':'FFFFFF','opacity="0.7"':''})).css({
				width:buttonSize,
				height:buttonSize,
				margin:Math.floor((this.header_height-buttonSize)/2).toString()+'px 10px'
			}).click(function() {
				try{
					eval(this.action);
				}catch(e) {
					yoodoo.errorLog(e);
					yoodoo.display.remove();
				}
			});
			this.backButton.get(0).action=(typeof(opts.back)=="string")?opts.back:'yoodoo.display.remove()';
		}
		var rightButtons=$(yoodoo.e("div")).addClass('rightButtons');
			for(var b in opts.buttons) {
				if (opts.buttons[b].icon!==undefined && opts.buttons[b].action!==undefined) {
					var button=$(yoodoo.e("button")).attr("type","button").append(opts.buttons[b].icon).css({
						width:buttonSize,
						height:buttonSize,
						margin:Math.floor((this.header_height-buttonSize)/2).toString()+'px 10px'
					}).click(function() {
						try{
							eval(this.action);
						}catch(e) {
							yoodoo.errorLog(e);
						}
					});
					button.get(0).action=opts.buttons[b].action;
					rightButtons.append(button);
				}
			}
			
		/*this.favButton=null;
		if (opts.favourite!==undefined && opts.favourite.on!==undefined) {
			this.favButton=$(yoodoo.e("button")).attr("type","button").append(yoodoo.icons.get("favourite"+(opts.favourite.on?'On':''),buttonSize,buttonSize)).css({
				width:buttonSize,
				height:buttonSize,
				margin:Math.floor((this.header_height-buttonSize)/2).toString()+'px 10px'
			}).click(function() {
				try{
					eval(this.action);
				}catch(e) {
				}
			});
			this.favButton.get(0).action=opts.favourite.action;
		}
		this.searchButton=null;
		if (opts.search===true) this.searchButton=$(yoodoo.e("button")).attr("type","button").append(yoodoo.icons.get("search",buttonSize,buttonSize)).css({
			width:buttonSize,
			height:buttonSize,
			margin:Math.floor((this.header_height-buttonSize)/2).toString()+'px 10px'
		}).click(function() {
			yoodoo.interface.search();
		});
		this.communityButton=null;
		if (opts.community===true) this.communityButton=$(yoodoo.e("button")).attr("type","button").append(yoodoo.icons.get("communityHub",buttonSize,buttonSize,{'4D4D4D':'FFFFFF'})).css({
			width:buttonSize,
			height:buttonSize,
			margin:Math.floor((this.header_height-buttonSize)/2).toString()+'px 10px'
		}).click(function() {
			yoodoo.interface.community();
		});*/
		return $(this.header).prepend(logo).prepend(this.menuButton).prepend(this.backButton).append(rightButtons);
	};
	
yoodoo.messages={
	msgs:[],
	container:null,
	textContainer:null,
	showingType:null,
	show:function(params) {
		if (params.type===undefined) params.type='error';
		if (params.type===this.showingType && this.container!==null) {
			$(this.textContainer).html(params.text);
		}else{
			this.msgs.push(params);
			
			if (this.container===null) {
				this.display();
			}
		}
	},
	display:function() {
		if (this.msgs.length>0) {
			var msg=this.msgs.shift();
			this.showingType=msg.type;
			this.textContainer=yoodoo.e("div");
			this.container=$(yoodoo.e("div")).addClass("yd_"+msg.type).append($(this.textContainer).html(msg.text)).hide();
			if (yoodoo.isApp) this.container.css({
				width:'100%',
				height:'100%',
				position:'absolute'
			});
			yoodoo.display.add({name:'message',obj:this.container,hideBelow:false});
			if (msg.closeButton!==undefined) {
				this.container.append(
					$(yoodoo.e("button")).attr("type","button").html(msg.closeButton).click(function() {
						$(this).unbind("click");
						yoodoo.messages.hide();
					})
				);
			}else if (msg.timeout===undefined) {
				msg.timeout=3;
			}
			if (msg.timeout!==undefined && msg.timeout>0) yoodoo.messages.timeout=setTimeout(function() {yoodoo.messages.hide();},msg.timeout*1000);
			this.container.slideDown(300);
		}
	},
	hide:function() {
		var me=yoodoo.messages;
		clearTimeout(me.timeout);
		if (me.container!==null) {
			$(me.container).stop().slideUp(300,function() {
				yoodoo.display.remove('message');
				$(me.container).remove();
				me.container=null;
				me.display();
			}).bind(me);
		}
	}
};

yoodoo.alert = function(txt) {
		yoodoo.messages.show({
			text:txt,
			type:'working',
			timeout:3000
		});
};
yoodoo.working = function(on) {
	if (on) {
		var txt=yoodoo.w('_loading')+'&hellip;';
		if (arguments.length>1) txt=arguments[1];
		yoodoo.messages.show({
			text:txt+'<div class="spinner"></div>',
			type:'working',
			timeout:0
		});
	}else{
		yoodoo.messages.hide();
	}
};

yoodoo.json={
	encode:function(o) {
		this.rewriteDates(o);
		return JSON.stringify(o);
	},
	rewriteDates:function(o) {
		if (typeof(o)=="object") {
			for(var k in o) {
				if (o[k] instanceof Date) {
					o[k]='new Date('+o[k].getFullYear()+','+o[k].getMonth()+','+o[k].getDate()+','+o[k].getHours()+','+o[k].getMinutes()+','+o[k].getSeconds()+')';
				}else{
					this.rewriteDates(o[k]);
				}
			}
		}
	}
};
