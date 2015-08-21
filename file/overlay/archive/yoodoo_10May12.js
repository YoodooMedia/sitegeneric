var yoodoo = {
    htmldetect: false,
    html5: false,
    html5available: false,
    mobile: false,
    gradientFill: true,
    displayMiniBookcase: true,
    isApp: false,
   // canApp: true,
    ready: false,
    onLoad:function() {},
    canApp : 'onorientationchange' in window,
    is_touch : 'ontouchstart' in document.documentElement,
    touch:{speed:0,x:0,on:false,friction:200,interval:20,time:0,dtime:0},
    forceScrapbook: false,
    wifi: (navigator.connection ? ((navigator.connection.type == navigator.connection.WIFI) ? true : false) : false),
    siteFolder: 'sitegeneric',
    currentSiteFolder: 'sitegeneric',
    styles: {
	icons:{light:true,dark:false},
	boundary:{
		radius:5
	},
	base:{r:22,g:39,b:63,tint:{l:[0.3,0.2,0,0.05],b:[0,0,0,0],lightness:0,brightness:0.8}},
	highlight:{l:0.1,b:2}, // lightness and brightness of base
	warning:{r:124,g:72,b:54,tint:{l:[0.3,0.2,0,0.05],b:[0,0,0,0],lightness:0,brightness:0},gloss:false},
	text:{r:255,g:255,b:255},
	button:{
		colour:{r:72,g:111,b:163,tint:{l:[0.3,0.2,0,0.05],b:[0,0,0,0],lightness:0,brightness:0},gloss:true},
		colourHover:{r:72,g:111,b:163,tint:{l:[0.35,0.2,0,0.15],b:[0,0,0,0.2],lightness:0,brightness:0},gloss:true},
		colourOn:{r:0,g:141,b:179,tint:{l:[0.35,0.2,0,0.15],b:[0,0,0,0.2],lightness:0,brightness:0},gloss:true},
		colourOnHover:{r:0,g:141,b:179,tint:{l:[0.35,0.2,0,0.15],b:[0,0,0,0.2],lightness:0,brightness:0},gloss:true},
		colourOff:{r:114,g:118,b:123,tint:{l:[0.35,0.2,0,0.15],b:[0,0,0,0.2],lightness:0,brightness:0},gloss:true},
		colourOffHover:{r:0,g:141,b:179,tint:{l:[0.35,0.2,0,0.15],b:[0,0,0,0.2],lightness:0,brightness:0},gloss:true}
	},
	book:{
		colour:{r:80,g:69,b:105,tint:{l:[0.3,0.2,0,0.05],b:[0,0,0,0],lightness:0.1,brightness:0.1},gloss:false},
		topic:{r:0,g:0,b:0,tint:{l:[0.3,0.2,0,0.05],b:[0,0,0,0],lightness:0.1,brightness:0.1},gloss:false,adjust:{lightness:-0.1,brightness:-0.1}},
		border:{width:1,r:130,g:99,b:155},
		radius:5
	},
	h2:{r:0,g:174,b:254},
	progress:{
		background:{r:72,g:111,b:163,tint:{l:[0.3,0.2,0,0.05],b:[0,0,0,0],lightness:0,brightness:0},gloss:true},
		bar:{r:44,g:183,b:219,tint:{l:[0.3,0.2,0,0.05],b:[0,0,0,0],lightness:0,brightness:0},gloss:true},
		buffer:{r:92,g:131,b:183,tint:{l:[0.3,0.2,0,0.05],b:[0,0,0,0],lightness:0,brightness:0},gloss:true}
	},
	keypoint:{
		text:{r:22,g:39,b:63},
		background:{r:250,g:250,b:250,tint:{l:[0.3,0.2,0,0.05],b:[0,0,0,0],lightness:0,brightness:-0.1},gloss:false}
	},
	keypoints:{
		text:{r:255,g:255,b:255},
		background:{r:72,g:111,b:163,tint:{l:[0.3,0.2,0,0.05],b:[0,0,0,0],lightness:0,brightness:0},gloss:true},
		options:{r:72,g:111,b:163,tint:{l:[0.3,0.2,0,0.05],b:[0,0,0,0],lightness:0,brightness:0},gloss:true},
		past:{
			text:{r:255,g:255,b:255},
			background:{r:100,g:100,b:100,tint:{l:[0.3,0.2,0,0.05],b:[0,0,0,0],lightness:0,brightness:0},gloss:true}
		},
		current:{
			text:{r:255,g:255,b:255},
			background:{r:0,g:0,b:100,tint:{l:[0.3,0.2,0,0.05],b:[0,0,0,0],lightness:0,brightness:0},gloss:true}
		}
	},
	episodeOverlay:{
		text:{r:255,g:255,b:255},
		background:{r:22,g:39,b:63,tint:{l:[0.3,0.2,0,0.05],b:[0,0,0,0],lightness:0,brightness:0.8},gloss:false}
	},
	toolbar:{
		text:{r:226,g:226,b:226},
		background:{r:35,g:37,b:51,tint:{l:[0.15,0.3,0.2,-0.05],b:[0,0,0,0.2],lightness:0,brightness:0},gloss:true},
		button:{
			background:{r:35,g:37,b:51,tint:{l:[0,0.2,0.15,0.05],b:[0,0,0,0],lightness:0,brightness:0.65},gloss:true},
			hover:{r:35,g:37,b:51,tint:{l:[0,0.2,0.15,0.25],b:[0,0,0,0.8],lightness:0,brightness:0.25},gloss:true}
		}
	}
    },
    messages:{
	chapterComplete:'Next Chapter:',
	episodeComplete:{
		success:'Continue on your journey:',
		failure:'I suggest you...'
	},
	journeyLonger:'Items have been added to your journey',
	journeyShorter:'Your journey has been updated',
	journeyChanged:'Your journey has been updated'
    },
    user: {
        firstname: '',
        lastname: '',
        username: '',
	meta:{},
	metaUpdate:{}
    },
    actionLog: [],
    option: {
        width: 788,
        height: 466,
        flashMovie: {
            url: 'domain:uploads/sitegeneric/flash/10_Episode_playa.swf',
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
        },
        voiceoverMovie: {
            url: 'domain:uploads/sitegeneric/flash/voiceover2.swf',
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
            flashvars: {},
            object: null
        },
        introMovie: {
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
        },
        helpDefaultVoiceover: '',
        yoodooPortal: {
            url: 'domain:remote'
            //url: 'domain:frontend_dev.php/remote'
        },
        prefix: '<div class="dooitLogo"></div>',
        dooitUrl: 'domain:uploads/sitespecific/yoodoo.siteFolder/file/', // need upload folder appended
        baseUrl: 'http://www.yoodidit.co.uk/',
        resourceUrl: '', // overrides the episode flvs url (if empty then set to baseUrl)
        htmlResourceUrl: '', // overrides the episode html movies url (if empty then set to resourceurl)
	forceHTMLVideo:true, // overrides the records of the file having been converted
        detectUrl: true,
	stayin: false,
        urls: {
            generic: {
                file: {
                    css: 'domain:uploads/sitegeneric/file/css/',
                    dooits: 'domain:uploads/sitegeneric/file/dooits/',
                    overlay: 'domain:uploads/sitegeneric/file/overlay/'
                },
                flash: 'domain:uploads/sitegeneric/flash/',
                image: 'domain:uploads/sitegeneric/image/'
            },
            specific: {
                file: {
                    css: 'domain:uploads/sitespecific/yoodoo.siteFolder/file/css/',
                    dooits: 'domain:uploads/sitespecific/yoodoo.siteFolder/file/dooits/',
                    overlay: 'domain:uploads/sitespecific/yoodoo.siteFolder/file/overlay/'
                },
                flash: 'domain:uploads/sitespecific/yoodoo.siteFolder/flash/',
                image: 'domain:uploads/sitespecific/yoodoo.siteFolder/image/'
            }

        },
        buttons: {
            dooitclose: 'close',
            frameclose: 'Done',
            scrapbook: 'scrapbook',
            snapshot: 'take a snapshot',
            comments: 'fetch comments',
            scrapbookadd: 'add to scrapbook',
            dooitsave: 'Done',
            playVoice: 'play voiceover',
            stopVoice: '<div class="progressContainer"><div class="progress"><div class="bar" style="width:0%"></div></div>stop voiceover</div>',
            helpbutton: 'what&rsquo;s this for?',
            helpDefaultText: 'Unfortunately, we don&rsquo;t have any help here at the moment'
        }
    },
    cmd:{},
    cmdFlash: {
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
            callback: 'showScrapbook'
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
    },
    cmdHTML5: {
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
            callback: 'showScrapbook'
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
    },
    flash: {
        getFlashURL: 'http://get.adobe.com/flashplayer/',
        minimumVersion: 10
    },
    site: {
        login_heading: 'access your yoo<span class="doo">doo</span> content',
        welcome_title: '<div class="left">Welcome to </div><div class="yoodoo-medium left"></div>'
    },
    xmltranslation: {
        'book': 'yb',
        'title': 'yt',
        'category': 'yc',
        'spineColour': 'ysc',
        'shortDescription': 'ysd',
        'xmlUrl': 'yxu',
        'episodeXmlUrl': 'yexu',
        'quizXmlUrl': 'yqxu',
        'level': 'yl',
        'duration': 'yd',
        'score': 'ys',
        'completed': 'yco',
        'earmarked': 'ye',
        'imageUrl': 'yiu',
        'exerciseLinkText': 'yelt'
    },
    visitedDooits: [],
    uploadFolder: '',
    animateDuration: 500,
    nextBookDelay: 1000,
    log: false,
    bookshelf: [],
    sitehash: '',
    checkedDependencies: false,
    timeout: null,
    timeoutDelay: 20000,
    workingHeight:100,
    lastLoad: '',
    loginCode: '',
    username: '',
    loggedin: false,
    days: 10,
    cookieName: 'yoodooUser',
    loadedScriptFiles: [],
    loadedStyleSheets: [],
    frame: null,
    container: null,
    embedObject: null,
    area: null,
    comment_id: null,
    comment_tab: 0,
    bookcaseLoaded: false,
    first_login: false,
    home_screen_title: 'Here\'s how you\'re doing',
    home_progress_text: 'My progress',
    home_percentage_complete: '17',
    home_percentage_text: 'Seventeen percent',
    home_level_text: 'Well done, you have completed the last episode',
    home_episode_text: '<p><b>Next Episode</b></p><p>Can I turn my idea into a business?</p>',
    home_banner_html: '',
    home_left_text: '<p>Yoodoo tip of day</p><p>Do some volunteering to keep busy</p>',
    home_password_change_text: 'Change my password?',
    password_updated: false,
    filenameMatcher: /\/([^\/^\.]+)\.css/i,

    jquery: {
        url: 'overlay/jquery-1-8-2.js',
        version: '1.7.1',
        fetched: false
    },
    swfobject: {
        jqurl: 'overlay/jq-swfobject.js',
        googleurl: 'overlay/swfobject.js',
        fetched: false,
        jquery: false
    },

    // my libraries that are required
    prerequisites: [],
    dependencies: [],
    // the overlay stylesheets
    // stylesheets:[[[['Explorer','<9'],'css/yoodoo_widget_ie8.css']],'css/yoodoo_widget.css'],
    stylesheets: [],
    ignoreFiles: ['main.css', 'refresh.css', 'dooit.js'],

    visible: false,
    ready: false,
    landscape:false,
    openAppOnRotate:false,
    lastHTML: '',
    defaultprereqanddependents:function() {

    	this.prerequisites= [
		['overlay/yoodooExtension.js', true],
		['overlay/yoodoo_versions.js', true],
		['overlay/yoodoo_versions.js', false]
	    ];
    	this.dependencies= [
		['dooits/jquery-ui.js', true],
		['overlay/dooit.js', true],
		[[['Explorer', '<=9'], 'overlay/yoodoo_widget_ie9.css'], true],
		[[['Explorer', '==8'], 'overlay/yoodoo_widget_ie8.css'], true],
		[[['Explorer', '<=9 && BrowserDetect.docMode==7'], 'overlay/yoodoo_widget_ie7.css'], true]
	    ];
    },
    init: function () {
	this.defaultprereqanddependents();
	if (this.htmldetect) this.detecthtml();
	this.detectmobile();
	 if (this.mobile) this.changeOrientation();

	if (this.option.detectUrl) {
		var scriptTags = document.body.getElementsByTagName("SCRIPT");
		for (var t = 0; t < scriptTags.length; t++) {
			if (/\/yoodoo\d*\.js/.test(scriptTags[t].src)) {
				if (/^http/.test(scriptTags[t].src)) {
					var matches = scriptTags[t].src.match(/^(http:\/\/[^\/]+)/);
					yoodoo.option.baseUrl = matches[0] + "/";
				}
			}
		}
	}
	this.widget=document.getElementById('yoodooWidget');
	if (yoodoo.is_touch) {
		this.widget.className="isTouch"+(this.isApp?" isApp":" isNotApp");
	}else{
		this.widget.className="isMouse isNotApp";
	}
	if (BrowserDetect.browser == "Explorer" && BrowserDetect.version < 8) {
		this.widget.innerHTML = '<div style="font-size:1.3em;text-align:center;">This system is not supported for Internet Explorer 7 or below.<br />Either update your browser or try another, like <a href="https://www.google.com/chrome" target="_blank">Google Chrome</a> or <a href="http://www.mozilla.org/firefox" target="_blank"> Mozilla Firefox</a>.<br />If you are using IE8 or above, press F12 and check you are not viewing this in a "Compatibility view".</div>';
	} else if (typeof (yoodooSite) != "undefined" || arguments.length > 0) {
		if (arguments.length > 0) {
			this.sitehash = arguments[0];
			if (arguments.length > 1) this.siteFolder = arguments[1];
		} else {
			if (typeof (yoodooSite) == "string") {
				this.sitehash = yoodooSite;
			} else {
				this.sitehash = yoodooSite[0];
				this.siteFolder = yoodooSite[1];
			}
		}

		this.defineEvents();
		this.onLoad();
		var continueInit=true;
		if (this.canApp) {
			try{
			window.removeEventListener("orientationchange",rotate,false);
			}catch(e) {}
			window.addEventListener("orientationchange",rotate=function() {
				yoodoo.changeOrientation();
			},false);
		}
		if (this.mobile && this.canApp && !this.isApp && localStorage.getItem('isApp')=="true") {
			if (this.landscape) {
				yoodoo.openApp();
				return false;
				continueInit=false;
			}else{
				this.openAppOnRotate=true;
			}
		}
		if (continueInit) {
			   this.dependencies.push(['overlay/yoodoo_common.css',true]);
			if (this.html5) {
			    this.cmd = this.cmdHTML5;
			    this.prerequisites.push(['overlay/yoodooPlaya.js', true]);
			    this.prerequisites.push(['overlay/yoodooStyler.js', true]);
			    this.prerequisites.push(['overlay/yoodooPlaya.css', true]);
			    this.prerequisites.push(['overlay/yoodooQuiz.js', true]);
			    this.prerequisites.push(['overlay/yoodooQuiz.css', true]);
			    this.dependencies.push(['overlay/yoodoo_widget_html.css',true]);
			}else{
			    this.cmd=this.cmdFlash;
			    this.dependencies.push(['overlay/yoodoo_widget.css',true]);
			}
			    this.currentSiteFolder = this.siteFolder;
			this.loaderInfo=document.createElement("div");
			this.loaderInfo.style.width=this.option.width+"px";
			var h=Math.floor((this.option.height-20)/2);
			this.loaderInfo.style.height="20px";
			this.loaderInfo.style.fontSize="14px";
			this.loaderInfo.style.fontFamily="Courier";
			this.loaderInfo.style.textAlign="center";
			this.loaderInfo.style.padding=h+"px 0px";
			this.loaderInfo.innerHTML = 'Loading...<br />&nbsp;';
			this.widget.appendChild(this.loaderInfo);
			if (this.option.resourceUrl=='') this.option.resourceUrl=this.option.baseUrl;
			if (this.option.htmlResourceUrl=='') this.option.htmlResourceUrl=this.option.resourceUrl;
			//if (this.isApp) this.setToWindow();
			this.option.flashMovie.width = this.option.width;
			this.option.flashMovie.height = this.option.height;
			    yoodoo.option.flashMovie.url = yoodoo.replaceDomain(yoodoo.option.flashMovie.url);
			    yoodoo.option.voiceoverMovie.url = yoodoo.replaceDomain(yoodoo.option.voiceoverMovie.url);
			    yoodoo.option.introMovie.url = yoodoo.replaceDomain(yoodoo.option.introMovie.url);
			    yoodoo.option.yoodooPortal.url = yoodoo.replaceDomain(yoodoo.option.yoodooPortal.url);
			    yoodoo.option.dooitUrl = yoodoo.replaceDomain(yoodoo.option.dooitUrl);

			    yoodoo.option.dooitUrl = yoodoo.option.dooitUrl.replace('yoodoo.siteFolder', yoodoo.siteFolder);
			    yoodoo.option.flashMovie.url = yoodoo.option.flashMovie.url.replace('yoodoo.siteFolder', yoodoo.siteFolder);
			    yoodoo.option.voiceoverMovie.url = yoodoo.option.voiceoverMovie.url.replace('yoodoo.siteFolder', yoodoo.siteFolder);
			    yoodoo.option.introMovie.url = yoodoo.option.introMovie.url.replace('yoodoo.siteFolder', yoodoo.siteFolder);

			    yoodoo.option.width *= yoodoo.option.flashMovie.zoom;
			    yoodoo.option.height *= yoodoo.option.flashMovie.zoom;

			    //this.fetchStyleSheets(this.stylesheets);
			    this.checkJquery();
				if(this.isApp) window.scrollTo(0, 1);
		
		}
	}
    },
    restart: function() {
	if (this.option.flashMovie.object!==null) $(this.option.flashMovie.object).remove();
	this.option.flashMovie.object=null;
	if (this.option.voiceoverMovie.object!==null) $(this.option.voiceoverMovie.object).remove();
	this.option.voiceoverMovie.object=null;
	if (this.option.introMovie.object!==null) $(this.option.introMovie.object).remove();
	this.option.introMovie.object=null;
	this.ready=false;
	this.option.flashMovie.loaded=false;
	this.htmldetect=false;
	if (yoodooStyler!==undefined) yoodooStyler.removeAll();
	var mine=new RegExp(this.option.baseUrl);
	$('head script').each(function(i,o) {
		if (o.src.substr(0,yoodoo.option.baseUrl.length)==yoodoo.option.baseUrl) $(o).remove();
	});
	$('head link').each(function(i,o) {
		if (o.href.substr(0,yoodoo.option.baseUrl.length)==yoodoo.option.baseUrl) $(o).remove();
	});
	this.widget.innerHTML="";
        yoodoo.init(yoodoo.sitehash, yoodoo.siteFolder);
    },
    changeOrientation: function () {
		if (window.orientation % 180 == 0) {
			this.landscape=false;
			if (this.isApp) document.body.className='portrait';
		
		}else{
			this.landscape=true;
			if (this.isApp) document.body.className='landscape';
			
			if (this.openAppOnRotate) {
				this.openAppOnRotate=false;
				setTimeout("yoodoo.openApp();",500);
				return false;
			}
		}
	//}
    },
    mobileMetaContent:function(w) {
		//return 'width=device-width, initial-scale=1.0, maximum-scale=1.0, target-densitydpi=device-dpi';
	if (yoodoo.bodyZoom) {
		return 'width=device-width, initial-scale=1.0, maximum-scale=1.0, target-densitydpi=device-dpi';
	}else{
		return 'width='+w+', initial-scale='+this.option.zoom.toFixed(1)+', minimum-scale='+this.option.zoom.toFixed(1)+', maximum-scale='+this.option.zoom.toFixed(1)+', user-scalable=no, target-densitydpi=device-dpi';
	}
    },
    openApp: function () {
	yoodoo.option.zoom = 1;
        this.mobileMeta = document.createElement("meta");
        this.mobileMeta.name = 'viewport';
	this.mobileMeta.content = this.mobileMetaContent(10000);
        document.getElementsByTagName("head")[0].appendChild(this.mobileMeta);

	if ('ongesturestart' in document.documentElement) {
		window.addEventListener('gesturestart',nopinch=function(e){e.preventDefault();});
	}else{
		window.addEventListener('touchstart',nopinch=function(e) {
			if (e.touches.length>1) {
				e.preventDefault();
				return false;
			}
		},true);
		window.addEventListener('touchmove',nopinch=function(e) {
			if (e.touches.length>1) {
				e.preventDefault();
				return false;
			}
		},true);
	}
        document.body.innerHTML = "";
        var w = 0;
        var h = 0;

        document.body.innerHTML = '';
        document.body.style.margin="0px";
        document.body.style.padding="0px";
        window.scrollTop = 0;
        window.scrollLeft = 0;
        w = window.outerWidth;
        h = window.outerHeight;
        if (w < h) {
            var t = 1 * h;
            h = w * 1;
            w = t;
        }
	var z=1;
	if (w>yoodoo.option.width && h>yoodoo.option.height) {
		var ar=w/h;
		var xs=w/yoodoo.option.width;
		var ys=h/yoodoo.option.height;
		xs=1*xs.toFixed(1);
		ys=1*ys.toFixed(1);
		var z=xs;
		var nw=Math.round(w/z);
		var nh=Math.round(nw/ar);
		w=nw;
		h=nh;
	}
        yoodoo.option.width = w;
        yoodoo.option.height = h;
        yoodoo.isApp = true;
	yoodoo.bodyZoom=false;
	if (yoodoo.bodyZoom) {
		document.body.style.zoom=z;
		yoodoo.option.zoom = z;
	}else{
		document.body.style.zoom=1;
		yoodoo.option.zoom = z;
        }



	this.mobileMeta.content = this.mobileMetaContent(w);


	var dv=document.createElement("div");
	dv.id='yoodooWidget';
	dv.style.height=h+"px";
	dv.style.width=w+"px";
	document.body.appendChild(dv);
	yoodoo.option.detectUrl=false;
        yoodoo.init(yoodoo.sitehash, yoodoo.siteFolder);
        window.scrollTo(0, 1);
    },
    detecthtml: function () {
	try{
		var did=document.createElement("canvas");
		this.html5=!!(did.getContext && did.getContext('2d'));
		if (this.html5) {
			var aud=document.createElement("audio");
			this.html5=!!(aud.canPlayType);
		}
	}catch(e){
		this.html5 = false;
	}
	this.html5available=this.html5;
    },
    detectflash: function () {
	if (navigator && navigator.plugins && navigator.plugins.length>0) {
		for(var n=0;n<navigator.plugins.length;n++) {
			if (/Shockwave Flash/.test(navigator.plugins[n].name)) return true;
		}
	}else if (navigator.appVersion.indexOf("Mac")==-1 && window.execScript) {
		try{
			tmp=new ActiveXObject('ShockwaveFlash.ShockwaveFlash');
			return true;
		}catch(e) {
		}
	}
	return false;
    },
    detectmobile: function () {
	this.mobile=this.is_touch;
	this.displayMiniBookcase=!this.mobile;
    },
    getFilePath: function (url) {
        // e.g. url = 'file.css' or 'flash' etc.
        var folders = url.split(".");
        var generic = true;
        if (arguments.length > 1) generic = arguments[1];
        var path = this.option.urls[generic ? 'generic' : 'specific'];
        var customPaths = [];
        if (folders.length > 0) {
            if (typeof (path[folders[0]]) == "undefined") folders.splice(0, 0, 'file');
            for (var i = 0; i < folders.length; i++) {
                if (typeof (path[folders[i]]) != "undefined" && customPaths.length == 0) {
                    path = path[folders[i]];
                } else {
                    customPaths.push(folders[i]);
                }
            }
        }
        if (customPaths.length > 0) {
            path += customPaths.join("/") + "/";
        }
        path = this.replaceDomain(path);
        path = path.replace('yoodoo.siteFolder', this.currentSiteFolder);
        return path;
    },
    replaceDomain: function (u) {
        u = u.replace(/domain\:/, yoodoo.option.baseUrl);
        return u;
    },
    defineEvents:function() {
	this.events.batchRegister({
		'loadDooit':'When a doo-it is loaded (returns the id and title)',
		'loadPlayit':'When a play-it is loaded (returns the id and title)',
		'showLogin':'When the login page is shown (returns true)',
		'showHome':'When the user Home page is shown (returns true)',
		'bookcaseLoaded':'When the bookcase is parsed (returns the item in the bookcase)',
		'login':'When a user attempts login (returns the username)',
		'userInformation':'When the user information is loaded (returns a user object)',
		'logout':'When a user logs out',
		'loadQuiz':'When a quiz is fetched (returns the quiz id)',
		'meta':'When user meta data is updated (returns the meta key and value)',
		'tagUnset':'When a user tag is unset (returns the tag name)',
		'tagSet':'When a user tag is set (returns the tag name)',
		'progress':'When the user progress is defined or updated (returns a progress object)',
		'saveDooit':'When a dooit saves data (returns the dooit object and data)',
		'loadScrapbook':'When the scrapbook is requested',
		'scrapbookPlayit':'When a playit, chapter or keypoint is scrapbooked (returns the playit object)',
		'scrapbookDooit':'When a dooit is scrapbooked (returns the dooit object)',
		'snapshot':'When a dooit is snapshot (returns the dooit object and the dooit snapshot data)',
		'commentScrapbook':'When comment is posted in the scrapbook, from the scrapbook or a dooit (returns the comment and the dooit or scrapbook item object)'
	});
    },
    plugins:{
	objects:{},
	buffer:[],
	register:function(name) {
		if (this.objects[name]!=undefined) return this.objects[name];
		this.objects[name]={
			name:name,
			handlers:function() {
				return yoodoo.events.getPluginHandlers(this.name);
			},
			addHandler:function(e,callback) {
				return yoodoo.plugins.addHandler(e,this.name,callback);
			},
			unregister:function() {
				yoodoo.plugins.unregister(this.name);
			}
		};
		return this.objects[name];
	},
	unregister:function(name) {
		yoodoo.events.removePluginHandlers(name);
		if (this.objects[name]!=undefined) this.objects[name]=undefined;
	},
	find:function(name) {
		return (this.objects[name]==undefined)?null:this.objects[name];
	},
	addHandler:function(handler,name,callback) {
		if (!yoodoo.ready) {
			this.buffer.push([handler,name,callback]);
			return false;
		}
		if (this.objects[name]!=undefined) return yoodoo.events.addPluginHandler(handler,name,callback);
		return false;
	},
	ready:function() {
		while(this.buffer.length>0) {
			var handle=this.buffer.pop();
			this.addHandler(handle[0],handle[1],handle[2]);
		}
	}
    },
    events:{
	objects:{},
	batchRegister:function(e) {
		for(var name in e) this.register(name,e[name]);
	},
	register:function(name,description) {
		if (this.objects[name]!=undefined) return "Already exists";
		this.objects[name]={
			name:name,
			trigger:function() {
				for(var h=0;h<this.handlers.length;h++) {
					try{
						this.handlers[h][1](arguments[0]);
					}catch(e){}
				}
			},
			handlers:[],
			description:description,
			addHandler:function(plugin,callback) {
				this.handlers.push([plugin,callback]);
			},
			removePluginHandlers:function(plugin) {
				for(var h=this.handlers.length-1;h>=0;h--) {
					if (this.handlers[h][0]==plugin) this.handlers.splice(h,0);
				}
			},
			pluginAttached:function(plugin) {
				for(var h=this.handlers.length-1;h>=0;h--) {
					if (this.handlers[h][0]==plugin) return true;
				}
				return false;
			}
		};
	},
	removePluginHandlers:function(plugin) {
		for (var name in this.objects) {
			if (this.objects[name]!=undefined) this.objects[name].removePluginHandlers(plugin);
		}
	},
	removePluginHandler:function(name,plugin) {
		if (this.objects[name]!=undefined) this.objects[name].removePluginHandlers(plugin);
	},
	unregister:function(name) {
		if (this.objects[name]!=undefined) this.objects[name]=undefined;
	},
	trigger:function(name) {
		var params={};
		if (arguments.length>1) params=arguments[1];
		if (this.objects[name]!=undefined) this.objects[name].trigger(params);
	},
	addPluginHandler:function(name,plugin,callback) {
		if (this.objects[name]!=undefined) {
			this.objects[name].addHandler(plugin,callback);
			return true;
		}
		return false;
	},
	list:function() {
		var items={};
		for (var name in this.objects) {
			if (this.objects[name]!=undefined) items[name]=this.objects[name].description;
		}
		return items;
	},
	getPluginHandlers:function(plugin) {
		var reply=[];
		for (var name in this.objects) {
			if (this.objects[name]!=undefined) {
				if (this.objects[name].pluginAttached(plugin)) reply.push(this.objects[name]);
			}
		}
		return reply;
	}
    },
    checkJquery: function () {
        var required = false;
        this.loaderInfo.innerHTML = 'Loading...<br />jquery';
        if (typeof (jQuery) !== "undefined") {
            if (!this.jquery.fetched) {
                var v = $().jquery.split('.');
                var rv = this.jquery.version.split('.');
                while (rv.length < v.length) rv.push(0);
                while (v.length < rv.length) v.push(0);
                for (var vi = 0; vi < rv.length; vi++) {
                    if (v[vi] > rv[vi]) {
                        if (typeof (console) != "undefined" && typeof (console.log) != "undefined") console.log("jQuery version used is higher than " + this.jquery.version + " that is recommended");
                        break;
                    } else if (v[vi] < rv[vi]) {
                        if (typeof (console) != "undefined" && typeof (console.log) != "undefined") console.log("jQuery version " + this.jquery.version + " recommended");
                        break;
                    }
                }
            }
		if (this.html5) {
			this.getPrerequisites();
		}else{
			this.checkSwfobject();
		}
        } else {
            required = true;
        }
        if (required && !this.jquery.fetched) {
            this.jquery.fetched = true;
            var paths = this.jquery.url.split("/");
            var fn = paths.pop();
            this.loadfile(this.getFilePath(paths.join('.'), true) + fn, "js");
        }
        if (required) setTimeout('yoodoo.checkJquery();', 50);
    },
    checkSwfobject: function () {
        var required = false;
        this.loaderInfo.innerHTML = 'Loading...<br />swfobject';
        if (this.swfobject.jquery) {
            if (typeof ($.flash) !== "undefined") {
                this.getPrerequisites();
            } else {
                required = true;
            }
            if (required && !this.swfobject.fetched) {
                this.swfobject.fetched = true;
                this.loadfile(this.swfobject.jqurl, "js");
            }
        } else {
            if (typeof (swfobject) !== "undefined") {
                this.getPrerequisites();
            } else {
                required = true;
            }
            if (required && !this.swfobject.fetched) {
                this.swfobject.fetched = true;

                var paths = this.swfobject.googleurl.split("/");
                var fn = paths.pop();
                this.loadfile(this.getFilePath(paths.join('.'), true) + fn, "js");
            }
        }
        if (required) setTimeout('yoodoo.checkSwfobject();', 50);
    },
    getPrerequisites: function () {
        this.loaderInfo.innerHTML = 'Loading...<br />Prerequisite files';
        this.checkDependencies(this.prerequisites, function () {
            yoodoo.checkDependencies();
        }, yoodoo.noInternet);
    },
    noInternet: function () {
        this.alert("You seem to have a connection problem.\nChecking internet connection...");
        this.testImage = document.createElement("img");
        $(this.testImage).css("display", "none");
        this.testImage.src = 'http://www.google.com/images/logo.png';
        this.testImage.setAttribute('onerror', 'yoodoo.noConnection()');
        this.testImage.setAttribute('onload', 'yoodoo.noServer()');
        document.body.appendChild(this.testImage);
    },
    noConnection: function () {
        $(this.testImage).remove();
        this.alert("Your internet connection seems to be missing");
    },
    noServer: function () {
        $(this.testImage).remove();
        this.alert("Apologies... the Yoodoo server seems to be down");
    },
    fileVersions: [],
    versioning: function (arr) {
        var asDefault = false;
        if (arguments.length > 1) asDefault = arguments[1];
        if (typeof (this.fileVersions[this.currentSiteFolder]) == "undefined") this.fileVersions[this.currentSiteFolder] = {
            generic: {
                js: {},
                css: {}
            },
            specific: {
                js: {},
                css: {}
            }
        };
        if (typeof (arr.generic) != "undefined") {
            if (typeof (arr.generic.js) != "undefined") {
                for (var k in arr.generic.js) {
                    if (typeof (this.fileVersions[this.currentSiteFolder].generic.js[k]) != "string" || !asDefault) this.fileVersions[this.currentSiteFolder].generic.js[k] = arr.generic.js[k];
                }
            }
            if (typeof (arr.generic.css) != "undefined") {
                for (var k in arr.generic.css) {
                    if (typeof (this.fileVersions[this.currentSiteFolder].generic.css[k]) != "string" || !asDefault) this.fileVersions[this.currentSiteFolder].generic.css[k] = arr.generic.css[k];
                }
            }
        }
        if (typeof (arr.specific) != "undefined") {
            if (typeof (arr.specific.js) != "undefined") {
                for (var k in arr.specific.js) {
                    if (typeof (this.fileVersions[this.currentSiteFolder].specific.js[k]) != "string" || !asDefault) this.fileVersions[this.currentSiteFolder].specific.js[k] = arr.specific.js[k];
                }
            }
            if (typeof (arr.specific.css) != "undefined") {
                for (var k in arr.specific.css) {
                    if (typeof (this.fileVersions[this.currentSiteFolder].specific.css[k]) != "string" || !asDefault) this.fileVersions[this.currentSiteFolder].specific.css[k] = arr.specific.css[k];
                }
            }
        }
    },
    ignoreFile: function (filename) {
        var found = false;
        for (var i = 0; i < this.ignoreFiles.length; i++) {
            var rg = new RegExp(this.ignoreFiles[i]);
            if (rg.test(filename)) found = true;
        }
        //console.log(filename+(found?" is ignored":" is added"));
        return found;
    },
    loadFailed: function () {
        yoodoo.console("Failed to load the file dependents");
    },
    checkSiteVersions: function () {
        if (typeof (this.fileVersions[this.currentSiteFolder]) != "undefined") {
            yoodoo.runInitThis();
        } else {
            this.checkDependencies([
                ['overlay/yoodoo_versions.js', false]
            ], yoodoo.runInitThis);
        }
        //yoodoo.runInitThis();

    },
    checkDependencies: function () {
        var dependencyList = this.dependencies; // [ ['example.js',genericBoolean] , ... ]
        this.dependencyCallback = this.loaded;
        this.dependencyFailCallback = function () {
            yoodoo.loadFailed()
        };
        this.dependencyTimeout = 10;
        this.dependencyCheckCount = 0;
        this.dependencyInterval = 250;
        this.checkingDependencies = true;
        if (arguments.length > 0) dependencyList = arguments[0];
        if (arguments.length > 1 && typeof (arguments[1]) == "function") this.dependencyCallback = arguments[1];
        if (arguments.length > 2 && typeof (arguments[2]) == "function") this.dependencyFailCallback = arguments[2];
        if (arguments.length > 3 && typeof (arguments[3]) == "number") this.dependencyTimeout = arguments[3];
        if (arguments.length > 4 && typeof (arguments[4]) == "number") this.dependencyInterval = arguments[4];
        var deps = [];
        this.dependencyCheckList = [];
        //console.log(dependencyList);
        for (var i = 0; i < dependencyList.length; i++) {
            //console.log(dependencyList[i]);
            var ok = true;
            //console.log(dependencyList[i][0]);
            if (typeof (dependencyList[i][0]) != "string") {
                ok = false;
                if (typeof (dependencyList[i][0][0]) == "object") {
                    if (BrowserDetect.browser == dependencyList[i][0][0][0]) {
                        try {
                           // console.log('ok=(BrowserDetect.version' + dependencyList[i][0][0][1] + ');');
                            eval('ok=(BrowserDetect.version' + dependencyList[i][0][0][1] + ');');
                        } catch (ex) {

                        }
                    }
                } else if (typeof (dependencyList[i][0][0]) == "string") {
                    ok = (BrowserDetect.browser == dependencyList[i][0][0]);
                }
            }
            if (ok) {
                var fn = (typeof (dependencyList[i]) == "string") ? dependencyList[i] : (typeof (dependencyList[i][0]) == "string") ? dependencyList[i][0] : dependencyList[i][0][1];
                var paths = fn.split('/');
                var filename = paths.pop();
                var generic = (typeof (dependencyList[i]) == "string") ? "false" : ((typeof (dependencyList[i][1]) != "undefined") ? dependencyList[i][1] : true);
                var isjs = /\.js/.test(filename);
                if (paths.length == 0) {
                    if (isjs) {
                        paths = ['dooit'];
                    } else {
                        paths = ['css'];
                    }
                }
                var path = this.getFilePath(paths.join('.'), generic);
                var ver = null;
                var nom = filename.replace(isjs ? '.js' : '.css', '');
                if (typeof (this.fileVersions[this.currentSiteFolder]) != "undefined") {
                    if (typeof (this.fileVersions[this.currentSiteFolder][generic ? 'generic' : 'specific'][isjs ? 'js' : 'css'][nom]) != "undefined") {
                        ver = this.fileVersions[this.currentSiteFolder][generic ? 'generic' : 'specific'][isjs ? 'js' : 'css'][nom];
                    } else if (typeof (this.fileVersions[this.siteFolder][generic ? 'generic' : 'specific'][isjs ? 'js' : 'css'][nom]) != "undefined") {
                        ver = this.fileVersions[this.siteFolder][generic ? 'generic' : 'specific'][isjs ? 'js' : 'css'][nom];
                    }
                }
                var fullPath = path + filename + '?' + new Date().getTime();
                if (ver !== null) {
                    fullPath = path + filename.replace((isjs ? '.js' : '.css'), ver + (isjs ? '.js' : '.css'));
                }
                if (!this.ignoreFile(fullPath)) this.dependencyCheckList.push({
                    filename: fullPath,
                    type: (isjs ? 'js' : 'css')
                });
            }

        }
        return this.dependencyChecker();
    },
    dependencyChecker: function () {
        this.ready = true;
        this.dependencyCheckCount++;
        var files = [];
        if (this.dependencyCheckCount * this.dependencyInterval > this.dependencyTimeout * 1000) {
            this.dependencyFailCallback();
        } else {
            for (var i = 0; i < this.dependencyCheckList.length; i++) {
                if (!this.isFileLoaded(this.dependencyCheckList[i].filename, this.dependencyCheckList[i].type)) {
                    this.ready = false;
                    if (this.checkingDependencies) {
                        var ele = null;
                        if (this.dependencyCheckList[i].type == "js") {
                            ele = document.createElement("SCRIPT");
                            ele.src = this.dependencyCheckList[i].filename;
                            ele.type = 'text/javascript';
                            ele.onload = function () {
                                $(this).attr("fetched", true);
                            };
                            ele.onreadystatechange = function () {
                                if (this.readyState == "complete" || this.readyState == "loaded") $(this).attr("fetched", true);
                            };
                        } else {
                            ele = document.createElement("LINK");
                            ele.href = this.dependencyCheckList[i].filename;
                            ele.type = 'text/css';
                            ele.rel = 'stylesheet';
                            var cssDiv = document.createElement("DIV");
                            $(cssDiv).html("&nbsp;");
                            $(cssDiv).css("position", "fixed");
                            $(cssDiv).css("top", "-10px");
                            $(cssDiv).css("font-size", "4px");

                            var cl = this.dependencyCheckList[i].filename.match(this.filenameMatcher);
                            cl = 'cssDetector_' + cl[1].replace(/-/g, '_');
                            $(cssDiv).addClass(cl);
                            $(cssDiv).addClass('yoodooCssDependencyItem');
                            document.body.appendChild(cssDiv);
                            ele.checker = cssDiv;
                        }
                        if (ele !== null) {
                            files.push(ele);
                            $('head').get(0).appendChild(ele);
                        }
                    }
                    //console.log(this.dependencyCheckList[i].filename+" not loaded");
                } else {
                    //console.log(this.dependencyCheckList[i].filename+" IS loaded");
                }
            }
            if (!this.ready) {
                setTimeout('yoodoo.dependencyChecker();', this.dependencyInterval);
            } else {
                $('.yoodooCssDependencyItem').remove();
                this.dependencyCallback();
            }
        }
        this.checkingDependencies = false;
        return files;
    },
    isFileLoaded: function (filename, type) {
        var obj = null;
        if (type == 'js') {
            $('script').each(function (i, o) {
                if (o.src == filename) obj = o;
            });
        } else {
            $('link').each(function (i, o) {
                if (o.href == filename) obj = o;
            });
        }
        var loaded = false;
        if (obj !== null && type == 'js' && $(obj).attr("fetched") == 'true') loaded = true;
        if (obj !== null && type == 'css') {
            var cl = filename.match(this.filenameMatcher);
            cl = cl[1].replace(/-/g, '_');
            loaded = obj.checker.offsetWidth == 0;
        }
        return loaded;
    },
    fetchSiteSettings: function () {
        if (typeof (yoodoo_site_settings) != "undefined") {
            for (var k in yoodoo_site_settings) {
                if (typeof (this.site[k]) != "undefined") this.site[k] = yoodoo_site_settings[k];
            }
        }
    },
    onLoadActions:[],
    onLoad: function (str) {
	if (this.ready) {
		try{
			eval(str);
		}catch(e){}
	}else{
		this.onLoadActions.push(str);
	}
    },
    doLoadActions: function() {
	while(this.onLoadActions.length>0) {
		var str=this.onLoadActions.splice(0,1)[0];
		try{
			eval(str);
		}catch(e){}
	}		
    },
    validStylesheet: function (filename) {
        var ok = true;
        /* for(var ss=0;ss<this.ignoreStylesheets.length;ss++) {
            var rg=new RegExp(this.ignoreStylesheets[ss],"i");
            if (rg.test(filename)) ok=false;
        }*/
        ok = this.ignoreFile(filename);
        return ok;
    },
    loadfile: function (filename, filetype) {
        filename = this.translate_version(filename);
        if (filetype == "js") {
            var fileref = document.createElement('script');
            fileref.setAttribute("type", "text/javascript");
            if (/^http\:\/\//i.test(filename)) {
                fileref.setAttribute("src", filename);
            } else {
                fileref.setAttribute("src", this.option.dooitUrl + filename);
            }
        } else if (filetype == "css") {
            if (this.validStylesheet(filename)) {
                var fileref = document.createElement("link");
                fileref.setAttribute("rel", "stylesheet");
                fileref.setAttribute("type", "text/css");
                if (/^http\:\/\//i.test(filename)) {
                    fileref.setAttribute("href", filename);
                } else {
                    fileref.setAttribute("href", this.option.dooitUrl + filename);
                }
            }
        }
        if (typeof fileref != "undefined") {
            document.getElementsByTagName("head")[0].appendChild(fileref);
        }
    },
    translate_version: function (file) {
        var file_parts = file.split('/');
        var fn = file_parts.pop();
        this.console("Check version of " + fn);
        if (typeof (yoodoo_js_versions) != 'undefined' && yoodoo_js_versions[fn.replace('.js', '')]) {
            fn = fn + yoodoo_js_versions[fn.replace('.js', '')] + '.js';
        } else if (typeof (yoodoo_css_versions) != 'undefined' && yoodoo_css_versions[fn.replace('.css', '')]) {
            fn = fn + yoodoo_css_versions[fn.replace('.css', '')] + '.css';
        } else {
            fn = fn + '?r=' + new Date().getTime();
        }
        file_parts.push(fn);
        this.console("Versioned filename: " + fn);
        return file_parts.join('/');
    },
    isLoadedScript: function (s) {
        for (var i = 0; i < yoodoo.loadedScriptFiles.length; i++) {
            if (yoodoo.loadedScriptFiles[i] == s) return true;
        }
        return false;
    },
    isLoadedStyle: function (s) {
        for (var i = 0; i < yoodoo.loadedStyleSheets.length; i++) {
            if (yoodoo.loadedStyleSheets[i] == s) return true;
        }
        return false;
    },
    getScripts: function (s) {
        var scripts = [];
        var r = /<script.*?<\/script>/mig;
        var src = /src=["|'](.*?)["|']/mi;
        var c = s.match(r);
        if (c) {
            for (var i = 0; i < c.length; i++) {
                var u = c[i].match(src);
                if (u) {
                    scripts.push(u[1]);
                } else {
                    scripts.push(c[i]);
                }
            }
        }
        return scripts;
    },
    console: function (txt) {
        if (typeof (console) != "undefined" && this.log && typeof (console.log) != "undefined") console.log(txt);
    },
    getStyleSheets: function (s) {
        var sheets = [];
        var r = /<link[^>]*?>/mig;
        var src = /href=["|'](.*?)["|']/mi;
        var c = s.match(r);
        if (c) {
            for (var i = 0; i < c.length; i++) {
                var u = c[i].match(src);
                if (u) {
                    sheets.push(u[1]);
                }
            }
        }
        return sheets;
    }
}
var dooit = {
    finishable: function () {
        return false;
    }
}
var BrowserDetect = {
    init: function () {
        this.browser = this.searchString(this.dataBrowser) || "An unknown browser";
        this.version = this.searchVersion(navigator.userAgent) || this.searchVersion(navigator.appVersion) || "an unknown version";
        this.OS = this.searchString(this.dataOS) || "an unknown OS";
	this.docMode=null;
	if (this.browser=="Explorer" && this.version<8) {
		try{
			if (/Trident/.test(navigator.userAgent)) this.version=8;
		}catch(e){}
	}
	if (this.browser=="Explorer") {
		try{
			if (!isNaN(document.documentMode)) this.docMode=document.documentMode;
		}catch(e){}
	}
    },
    searchString: function (data) {
        for (var i = 0; i < data.length; i++) {
            var dataString = data[i].s;
            var dataProp = data[i].p;
            this.versionSearchString = data[i].vs || data[i].i;
            if (dataString) {
                if (dataString.indexOf(data[i].ss) != -1) return data[i].i;
            } else if (dataProp) return data[i].i;
        }
    },
    searchVersion: function (dataString) {
        var index = dataString.indexOf(this.versionSearchString);
        if (index == -1) return;
        return parseFloat(dataString.substring(index + this.versionSearchString.length + 1));
    },
    dataBrowser: [{
        s: navigator.userAgent,
        ss: "Chrome",
        i: "Chrome"
    }, {
        s: navigator.userAgent,
        ss: "OmniWeb",
        vs: "OmniWeb/",
        i: "OmniWeb"
    }, {
        s: navigator.userAgent,
        ss: "iPad",
        i: "iPad OS"
    }, {
        s: navigator.userAgent,
        ss: "iPhone",
        i: "iPhone OS"
    }, {
        s: navigator.vendor,
        ss: "Apple",
        i: "Safari",
        vs: "Version"
    }, {
        p: window.opera,
        i: "Opera",
        vs: "Version"
    }, {
        s: navigator.vendor,
        ss: "iCab",
        i: "iCab"
    }, {
        s: navigator.vendor,
        ss: "KDE",
        i: "Konqueror"
    }, {
        s: navigator.userAgent,
        ss: "Firefox",
        i: "Firefox"
    }, {
        s: navigator.vendor,
        ss: "Camino",
        i: "Camino"
    }, {
        s: navigator.userAgent,
        ss: "Netscape",
        i: "Netscape"
    }, {
        s: navigator.userAgent,
        ss: "MSIE",
        i: "Explorer",
        vs: "MSIE"
    }, {
        s: navigator.userAgent,
        ss: "Android",
        i: "Android"
    }, {
        s: navigator.userAgent,
        ss: "Gecko",
        i: "Mozilla",
        vs: "rv"
    }, {
        s: navigator.userAgent,
        ss: "Mozilla",
        i: "Netscape",
        vs: "Mozilla"
    }],
    dataOS: [{
        s: navigator.platform,
        ss: "Win",
        i: "Windows"
    }, {
        s: navigator.platform,
        ss: "Mac",
        i: "Mac"
    }, {
        s: navigator.userAgent,
        ss: "iPhone",
        i: "iPhone/iPod"
    }, {
        s: navigator.platform,
        ss: "Linux",
        i: "Linux"
    }]

};
BrowserDetect.init();
