var yoodoo = {
	classVersion: 8,
	metaphor: 1,
	htmldetect: false,
	canHTML: false,
	html5: false,
	html5available: false,
	flashdefault: true,
	mobile: false,
	dev:false,
	ajax:false,
	isApp: false,
	fixedDimensions: null,
	language: 'en',
	languageSeleactable: false,
	class_prefix: 'yd',
	defaults: {},
	fullyLoaded:false,
	onceLoaded:{
		list:[],
		add:function(f) {
			this.list.push(f);
		},
		run:function() {
			yoodoo.fullyLoaded=true;
			while(this.list.length>0) {
				var f=this.list.shift();
				try{
					f();
				}catch(e){
					yoodoo.errorLog(e);
					console.log('Failed',f);
				}
			}
		}
	},
	ready: false,
	onLoad: function() {},
	canApp: 'onorientationchange' in window,
	is_touch: 'ontouchstart' in document.documentElement,
	is_mouse: !('ontouchstart' in document.documentElement),
	wifi: (navigator.connection ? ((navigator.connection.type == navigator.connection.WIFI) ? true : false) : false),
	siteFolder: 'sitegeneric',
	currentSiteFolder: 'sitegeneric',
	widgets: [],
	intervention: null,
	containers:{},
	e: function(type) {
		return document.createElement(type);
	},
	user: {},
	clearUser: function() {
		this.user = {
			firstname: '',
			lastname: '',
			username: '',
			nickname: '',
			meta: {},
			metaUpdate: {},
			getName: function() {
				if (this.nickname != "") return this.nickname;
				if (this.firstname != "") return this.firstname;
				return this.username;
			}
		};
		if (this.groups !== undefined) this.groups.dispose();
	},
	errorLog:function(e) {
		if (e.stack===undefined) {
			yoodoo.console(e);
			return false;
		}
		var stack=e.stack.match(/at [^\n]*(http[^\)]*\))/);
		if (e.stack!==null) {
			if (stack!==null && stack[1]!==undefined) {
				stack[1]=stack[1].replace(/^.*(http|https).*\:\/\//,'');
				var err={
					error:e.message
				};
				var url=stack[1].match(/^([^\?^\:]*)[\?\:]/);
				err.url=url===null?'':url[1];
				var line=stack[1].match(/^[^\:]*\:([^\:]*)/);
				err.line=line===null?'':line[1];
				if (yoodoo.jsError!==undefined) yoodoo.jsError(err);
			}else{
				if (yoodoo.jsError!==undefined) yoodoo.jsError(e);
			}
		}else{
			if (yoodoo.jsError!==undefined) yoodoo.jsError(e);
		}
	},
	actionLog: [],
	option: {
		width: 788,
		height: 466,
		autosize: false,
		yoodooPortal: {
			url: 'domain:remote'
			//url: 'domain:frontend_dev.php/remote'
		},
		prefix: '',
		dooitUrl: 'domain:uploads/sitespecific/yoodoo.siteFolder/file/', // need upload folder appended
		baseUrl: 'http://www.yoodidit.co.uk/',
		contentUrl: 'http://www.yoodidit.co.uk/',
		videoUrl: 'http://www.yoodidit.co.uk/',
		imageUrl: 'http://www.yoodidit.co.uk/',
		audioUrl: 'http://www.yoodidit.co.uk/',
		detectUrl: true,
		urls: {
			generic: {
				file: {
					css: 'domain:uploads/sitegeneric/file/css/',
					dooits: 'domain:uploads/sitegeneric/file/dooits/',
					overlay: 'domain:uploads/sitegeneric/file/overlay/',
					widgets: 'domain:uploads/sitegeneric/file/widgets/'
				},
				flash: 'domain:uploads/sitegeneric/flash/',
				image: 'domain:uploads/sitegeneric/image/'
			},
			specific: {
				file: {
					css: 'domain:uploads/sitespecific/yoodoo.siteFolder/file/css/',
					dooits: 'domain:uploads/sitespecific/yoodoo.siteFolder/file/dooits/',
					overlay: 'domain:uploads/sitespecific/yoodoo.siteFolder/file/overlay/',
					widgets: 'domain:uploads/sitespecific/yoodoo.siteFolder/file/widgets/'
				},
				flash: 'domain:uploads/sitespecific/yoodoo.siteFolder/flash/',
				image: 'domain:uploads/sitespecific/yoodoo.siteFolder/image/'
			}

		}
	},
	cmd: {},
	site: {
		login_heading: 'access your yoo<span class="doo">doo</span> content',
		welcome_title: '<div class="left">Welcome to </div><div class="yoodoo-medium left"></div>'
	},
	introMovie:null,
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
	workingHeight: 100,
	lastLoad: '',
	loginCode: '',
	username: '',
	loggedin: false,
	days: 10,
	loadedScriptFiles: [],
	loadedStyleSheets: [],
	frame: null,
	container: null,
	area: null,
	bookcaseLoaded: false,
	first_login: false,
	password_updated: false,
	filenameMatcher: /\/([^\/^\.]+)\.css/i,

	jquery: {
		url: 'overlay/jquery-1-11-0.js',
		version: '1.7.1',
		fetched: false
	},

	additionaldependencies: [],
	stylesheets: [],

	visible: false,
	ready: false,
	landscape: true,
	openAppOnRotate: false,
	lastHTML: '',
	init: function() {
		this.clearUser();
		this.checks.webkit();

		if (this.option.detectUrl) {
			var scriptTags = document.body.getElementsByTagName("SCRIPT");
			for (var t = 0; t < scriptTags.length; t++) {
				if (/\/yoodoo\d*\.js/.test(scriptTags[t].src)) {
					if (/^http/.test(scriptTags[t].src)) {
						var matches = scriptTags[t].src.match(/^((http|https):\/\/[^\/]+)/);
						yoodoo.option.baseUrl = matches[0] + "/";
					}
				}
			}
			yoodoo.option.contentUrl=yoodoo.option.videoUrl=yoodoo.option.imageUrl=yoodoo.option.audioUrl=yoodoo.option.baseUrl;
		}
		if (/feserver\-au/.test(yoodoo.option.baseUrl)) yoodoo.option.forceHTMLVideo=true;
		this.widget = document.getElementById('yoodooWidget');
		if (this.is_mouse === false) this.checks.mouse();
		var keepClasses = ['yd_light', 'yd_dark'];
		var foundClasses = [];
		for (var c = 0; c < keepClasses.length; c++) {
			if (this.widget.className.match(keepClasses[c])) foundClasses.push(keepClasses[c]);
		}
		this.widget.className = "yoodooBackground " + (this.isApp ? "isApp" : "isNotApp") + (this.webkit ? " webkit" : " notwebkit") + ' ' + foundClasses.join(' ');
		if (yoodoo.is_touch) this.widget.className += " isTouch";
		if (yoodoo.is_touch && !yoodoo.is_mouse) this.widget.className += " isTouchOnly";
		if (yoodoo.is_mouse) this.widget.className += " isMouse";
		if (yoodoo.is_mouse && !yoodoo.is_touch) this.widget.className += " isMouseOnly";
        (yoodoo.metaphor==1) ? this.widget.className += " metaphorOne" : this.widget.className += " metaphorTwo";
		this.widget.className += ' ' + BrowserDetect.browser + BrowserDetect.version;
		this.widget.className += ' ' + BrowserDetect.browser;
		if (arguments.length > 3) {
			this.fixedDimensions = {
				width: arguments[2],
				height: arguments[3]
			};
		}
		//if (this.isApp) this.setAppHeight();
		if (BrowserDetect.browser == "Explorer" && BrowserDetect.version < 8) {
			this.widget.innerHTML = '<div style="font-size:1.3em;text-align:center;">This system is not supported for Internet Explorer 7 or below.<br />Either update your browser or try another, like <a href="https://www.google.com/chrome" target="_blank">Google Chrome</a> or <a href="http://www.mozilla.org/firefox" target="_blank"> Mozilla Firefox</a>.<br />If you are using IE8 or above, press F12 and check you are not viewing this in a "Compatibility view".</div>';
		} else if (typeof(yoodooSite) != "undefined" || arguments.length > 0) {
			/*this.loaderInfo = document.createElement("div");
			this.loaderInfo.style.width = "100%";
			this.loaderInfo.style.margin = "0px auto";
			//this.loaderInfo.style.width = this.option.width + "px";
			var h = Math.floor((this.option.height - 20) / 2);
			this.loaderInfo.style.height = "20px";
			this.loaderInfo.style.fontSize = "14px";
			this.loaderInfo.style.fontFamily = "Courier";
			this.loaderInfo.style.textAlign = "center";
			this.loaderInfo.style.padding = h + "px 0px";
			if (this.isApp) this.loaderInfo.style.color = '#fff';
			this.loaderInfo.innerHTML = 'Loading...<br />&nbsp;';
			this.widget.appendChild(this.loaderInfo);*/
			this.loader('Loading...');
			if (arguments.length > 0) {
				this.sitehash = arguments[0];
				if (arguments.length > 1) this.siteFolder = arguments[1];
			} else {
				if (typeof(yoodooSite) == "string") {
					this.sitehash = yoodooSite;
				} else {
					this.sitehash = yoodooSite[0];
					this.siteFolder = yoodooSite[1];
				}
			}
			this.currentSiteFolder = this.siteFolder;
			this.checks.start();
		}

	},
	loaderOn:false,
	loader:function(txt) {
		if (this.loaderOn && (typeof(txt)!="string" || txt=="")) {
			if (typeof(yoodooApp)!="undefined" && yoodooApp.dialogue_hide!==undefined && false) {
				if (this.loaderOn) {
					yoodooApp.dialogue_hide();
					this.loaderOn=false;
				}
			}else{
				this.loaderInfo.parentNode.removeChild(this.loaderInfo);
				this.loaderInfo=undefined;
			}
		}else{
			if (typeof(yoodooApp)!="undefined" && yoodooApp.dialogue_show!==undefined && false) {
				//if (this.loaderOn) yoodooApp.dialogue_hide();
					yoodooApp.dialogue_show(window.JSON.stringify({
						text:txt.replace(/\&hellip;/g,'...'),
						spinner:true
					}));
					this.loaderOn=true;
			}else{
				if (this.loaderInfo===undefined) {
					this.loaderInfo = document.createElement("div");
					this.loaderInfo.style.width = "100%";
					this.loaderInfo.style.margin = "0px auto";
					//this.loaderInfo.style.width = this.option.width + "px";
					var h = Math.floor((this.option.height - 20) / 2);
					this.loaderInfo.style.height = "20px";
					this.loaderInfo.style.fontSize = "14px";
					this.loaderInfo.style.fontFamily = "Courier";
					this.loaderInfo.style.textAlign = "center";
					this.loaderInfo.style.padding = h + "px 0px";
					if (this.isApp) this.loaderInfo.style.color = '#fff';
					this.widget.appendChild(this.loaderInfo);
				}
				this.loaderInfo.innerHTML = txt;
			}
		}
	},
	defineScrollStop: function(complete) {
		$.fn.scrollStopped = function(callback) {
			$(this).scroll(function() {
				var self = this,
					$this = $(self);
				if ($this.data('scrollTimeout')) {
					clearTimeout($this.data('scrollTimeout'));
				}
				$this.data('scrollTimeout', setTimeout(callback, 250, self));
			});
		};
	},
	setSize: function() {
		if (typeof(yoodooApp)!='object' && !this.isApp) {
			if (this.html5) {
				if (this.option.autosize) {
					var w = this.widget.clientWidth;
					var h = this.widget.clientHeight;
					if (w >= this.option.width) this.option.width = w;
					if (h >= this.option.height) this.option.height = h;
				}
			}

			if (this.fixedDimensions !== null) {
				this.option.width = this.fixedDimensions.width;
				this.option.height = this.fixedDimensions.height;
			}
			$(this.widget).css({
				width: this.option.width,
				height: this.option.height
			});
		}
	},
	postInit: function() {
		this.checks.mobile();
		if (this.mobile) this.changeOrientation();
		this.checks.complexity();

		this.defineEvents();
		//this.onLoad();
		var continueInit = true;
		var rotate=yoodoo.changeOrientation;

		if (this.canApp) {

			try {

				window.removeEventListener("orientationchange", rotate, false);

			} catch (e) {

				yoodoo.errorLog(e);

			}

			window.addEventListener("orientationchange", rotate, false);

		}
		if (this.mobile && this.canApp && !this.isApp && localStorage.getItem('isApp') == "true") {
			if (this.landscape) {} else {
				this.openAppOnRotate = true;
			}
		}
		if (this.option.flashMovie !== undefined) {
			this.option.flashMovie.width = this.option.width;
			this.option.flashMovie.height = this.option.height;
			yoodoo.option.flashMovie.url = yoodoo.replaceDomain(yoodoo.option.flashMovie.url);
			yoodoo.option.width *= yoodoo.option.flashMovie.zoom;
			yoodoo.option.height *= yoodoo.option.flashMovie.zoom;
		}
		if (this.option.voiceoverMovie !== undefined) {
			yoodoo.option.voiceoverMovie.url = yoodoo.replaceDomain(yoodoo.option.voiceoverMovie.url);
			yoodoo.option.introMovie.url = yoodoo.replaceDomain(yoodoo.option.introMovie.url);
		}
		if (this.ajax===true) {
			yoodoo.option.yoodooPortal.url = yoodoo.replaceDomain(yoodoo.option.yoodooPortal.url.replace(/domain\:/,'/'));
		}else{
			yoodoo.option.yoodooPortal.url = yoodoo.replaceDomain(yoodoo.option.yoodooPortal.url);
		}
		yoodoo.option.dooitUrl = yoodoo.replaceDomain(yoodoo.option.dooitUrl);

		if (this.isApp) window.scrollTo(0, 1);
		this.loaded();
	},

	changeOrientation: function() {
		if (window.orientation % 180 == 0) {
			this.landscape = false;
			if (this.isApp) document.body.className = 'portrait';

		} else {
			this.landscape = true;
			if (this.isApp) document.body.className = 'landscape';

			if (this.openAppOnRotate) {
				this.openAppOnRotate = false;
				return false;
			}
		}
	},
	openApp: function() {
		yoodoo.option.zoom = 1;
		/*this.mobileMeta = document.createElement("meta");
		this.mobileMeta.name = 'viewport';
		this.mobileMeta.content = this.mobileMetaContent(10000);*/
		if ('ongesturestart' in document.documentElement) {
			window.addEventListener('gesturestart', nopinch = function(e) {
				e.preventDefault();
			});
		} else {
			window.addEventListener('touchstart', nopinch = function(e) {
				if (e.touches.length > 1) {
					e.preventDefault();
					return false;
				}
			}, true);
			window.addEventListener('touchmove', nopinch = function(e) {
				if (e.touches.length > 1) {
					e.preventDefault();
					return false;
				}
			}, true);
		}
		document.body.innerHTML = "";
		var w = 0;
		var h = 0;

		document.body.innerHTML = '';
		document.body.style.margin = "0px";
		document.body.style.padding = "0px";

		window.scrollTo(0, 1);

		window.scrollTop = 0;
		window.scrollLeft = 0;
		var invertZoom = false;
		if (BrowserDetect.browser == 'Chrome' && BrowserDetect.OS == 'Android') {
			/* Chrome on Android */
			w = window.innerWidth;
			h = window.innerHeight;
			if (h > w) {
				h = window.innerWidth;
				w = window.innerHeight;
			}
			invertZoom = true;
		} else if (BrowserDetect.OS == 'iPad' || BrowserDetect.browser == 'iPhone') {
			/* ios */
			var ar = window.innerWidth / window.innerHeight;
			w = screen.width;
			h = screen.height;
			if (h > w) {
				h = screen.width;
				w = screen.height;
			}
			h = Math.round(w / ar);
		} else {
			/* Android */
			w = window.outerWidth;
			h = window.outerHeight;
			if (h > w) {
				h = window.outerWidth;
				w = window.outerHeight;
			}
		}
		if (w < h) {
			var t = 1 * h;
			h = w * 1;
			w = t;
		}
		var z = 1;
		//if (w>yoodoo.option.width && h>yoodoo.option.height) {
		var ar = w / h;
		var xs = w / yoodoo.option.width;
		var ys = h / yoodoo.option.height;
		xs = 1 * xs.toFixed(3);
		ys = 1 * ys.toFixed(3);
		var z = xs;
		var nw = Math.round(w / z);
		var nh = Math.round(nw / ar);
		w = nw;
		h = nh;
		//}
		if (invertZoom) z = 1 / z;
		var newUrl = this.option.baseUrl + 'players/htmlplayer.php?sitecode=' + this.sitehash + '&site=' + this.siteFolder + '&zoom=' + z + '&width=' + Math.round(w) + '&height=' + Math.round(h);
		if (parent !== null) {
			parent.location.href = newUrl;
		} else {
			window.location = newUrl;
		}
		return false;
	},
	getFilePath: function(url) {
		// e.g. url = 'file.css' or 'flash' etc.
		var folders = url.split(".");
		var generic = true;
		if (arguments.length > 1) generic = arguments[1];
		var path = this.option.urls[generic ? 'generic' : 'specific'];
		var customPaths = [];
		if (folders.length > 0) {
			if (typeof(path[folders[0]]) == "undefined") folders.splice(0, 0, 'file');
			for (var i = 0; i < folders.length; i++) {
				if (typeof(path[folders[i]]) != "undefined" && customPaths.length == 0) {
					path = path[folders[i]];
				} else {
					customPaths.push(folders[i]);
				}
			}
		}
		if (customPaths.length > 0) {
			path += customPaths.join("/") + "/";
		}
		if (arguments.length > 2) {
			path = path.replace('yoodoo.siteFolder', arguments[2]);
		}
		path = this.replaceDomain(path);
		return path;
	},
	replaceDomain: function(u) {
		if (u===null) return null;
		if (/domain\:[^\/]/.test(u)) u=u.replace(/domain\:/,'domain:/');
		u = u.replace(/videodomain\:/, yoodoo.option.videoUrl);
		u = u.replace(/audiodomain\:/, yoodoo.option.audioUrl);
		u = u.replace(/imagedomain\:/, yoodoo.option.imageUrl);
		u = u.replace(/domain\:/, yoodoo.option.baseUrl);
		u = u.replace('yoodoo.siteFolder', yoodoo.currentSiteFolder);
		return u;
	},
	defineEvents: function() {
		this.events.batchRegister({
			'loadDooit': 'When a doo-it is loaded (returns the id and title)',
			'loadPlayit': 'When a play-it is loaded (returns the id and title)',
			'showLogin': 'When the login page is shown (returns true)',
			'showHome': 'When the user Home page is shown (returns true)',
			'bookcaseLoaded': 'When the bookcase is parsed (returns the item in the bookcase)',
			'login': 'When a user attempts login (returns the username)',
			'loggedin': 'When a user successfully logins in (returns the username)',
			'userInformation': 'When the user information is loaded (returns a user object)',
			'logout': 'When a user logs out',
			'loadQuiz': 'When a quiz is fetched (returns the quiz id)',
			'meta': 'When user meta data is updated (returns the meta key and value)',
			'tagUnset': 'When a user tag is unset (returns the tag name)',
			'tagSet': 'When a user tag is set (returns the tag name)',
			'progress': 'When the user progress is defined or updated (returns a progress object)',
			'saveDooit': 'When a dooit saves data (returns the dooit object and data)',
			'loadScrapbook': 'When the scrapbook is requested',
			'scrapbookPlayit': 'When a playit, chapter or keypoint is scrapbooked (returns the playit object)',
			'scrapbookDooit': 'When a dooit is scrapbooked (returns the dooit object)',
			'snapshot': 'When a dooit is snapshot (returns the dooit object and the dooit snapshot data)',
			'commentScrapbook': 'When comment is posted in the scrapbook, from the scrapbook or a dooit (returns the comment and the dooit or scrapbook item object)',
			'widgetsComplete': 'When widgets are displayed'
		});
	},
	plugins: {
		objects: {},
		buffer: [],
		register: function(name) {
			if (this.objects[name] != undefined) return this.objects[name];
			this.objects[name] = {
				name: name,
				handlers: function() {
					return yoodoo.events.getPluginHandlers(this.name);
				},
				addHandler: function(e, callback) {
					return yoodoo.plugins.addHandler(e, this.name, callback);
				},
				unregister: function() {
					yoodoo.plugins.unregister(this.name);
				}
			};
			return this.objects[name];
		},
		unregister: function(name) {
			yoodoo.events.removePluginHandlers(name);
			if (this.objects[name] != undefined) this.objects[name] = undefined;
		},
		find: function(name) {
			return (this.objects[name] == undefined) ? null : this.objects[name];
		},
		addHandler: function(handler, name, callback) {
			if (!yoodoo.ready) {
				this.buffer.push([handler, name, callback]);
				return false;
			}
			if (this.objects[name] != undefined) return yoodoo.events.addPluginHandler(handler, name, callback);
			return false;
		},
		readyBuffer: [],
		whenReady: function(callback) {
			if (yoodoo.ready) {
				callback();
			} else {
				this.readyBuffer.push(callback);
			}
		},
		ready: function() {
			while (this.readyBuffer.length > 0) {
				var cb = this.readyBuffer.pop();
				cb();
			}
			while (this.buffer.length > 0) {
				var handle = this.buffer.pop();
				return yoodoo.events.addPluginHandler(handle[0], handle[1], handle[2]);
				//this.addHandler(handle[0], handle[1], handle[2]);
			}
		}
	},
	events: {
		objects: {},
		batchRegister: function(e) {
			for (var name in e) this.register(name, e[name]);
		},
		register: function(name, description) {
			if (this.objects[name] != undefined) return "Already exists";
			this.objects[name] = {
				name: name,
				trigger: function() {
					for (var h = 0; h < this.handlers.length; h++) {
						try {
							this.handlers[h][1](this, arguments[0]);
						} catch (e) {
							yoodoo.errorLog(e);
						}
					}
				},
				handlers: [],
				description: description,
				addHandler: function(plugin, callback) {
					this.handlers.push([plugin, callback]);
				},
				removePluginHandlers: function(plugin) {
					for (var h = this.handlers.length - 1; h >= 0; h--) {
						if (this.handlers[h][0] == plugin) this.handlers.splice(h, 0);
					}
				},
				pluginAttached: function(plugin) {
					for (var h = this.handlers.length - 1; h >= 0; h--) {
						if (this.handlers[h][0] == plugin) return true;
					}
					return false;
				}
			};
		},
		removePluginHandlers: function(plugin) {
			for (var name in this.objects) {
				if (this.objects[name] != undefined) this.objects[name].removePluginHandlers(plugin);
			}
		},
		removePluginHandler: function(name, plugin) {
			if (this.objects[name] != undefined) this.objects[name].removePluginHandlers(plugin);
		},
		unregister: function(name) {
			if (this.objects[name] != undefined) this.objects[name] = undefined;
		},
		trigger: function(name) {
			var params = {};
			if (arguments.length > 1) params = arguments[1];
			if (this.objects[name] != undefined) this.objects[name].trigger(name, params);
		},
		addPluginHandler: function(name, plugin, callback) {
			if (this.objects[name] != undefined) {
				this.objects[name].addHandler(plugin, callback);
				return true;
			}
			return false;
		},
		list: function() {
			var items = {};
			for (var name in this.objects) {
				if (this.objects[name] != undefined) items[name] = this.objects[name].description;
			}
			return items;
		},
		getPluginHandlers: function(plugin) {
			var reply = [];
			for (var name in this.objects) {
				if (this.objects[name] != undefined) {
					if (this.objects[name].pluginAttached(plugin)) reply.push(this.objects[name]);
				}
			}
			return reply;
		}
	},
	checks: {
		index: null,
		start: function() {
			this.index = -1;
			this.next();
		},
		next: function() {
			this.index += (arguments.length > 0) ? parseInt(arguments[0]) : 1;
			if (this.index < this.functions.length) this.functions[this.index]();
		},
		functions: [

			// Load jQuery

			function() {
				yoodoo.checks.Jquery.check();
			},

			// Load base class and file versions

			function() {
				var prerequisites = [
					['overlay/yoodooExtension6_2.min.js', true, null, false]
				];
				if (yoodoo.loadVersions !== false) {
					prerequisites.push(['overlay/yoodoo_versions.js', true]);
					prerequisites.push(['overlay/yoodoo_versions.js', false]);
				}
				yoodoo.loadVersions = false;
				yoodoo.loader('Loading configuration&hellip;');
				var loader = new yoodoo.fileLoader.loader(prerequisites, function(complete) {
					if (complete) {
						yoodoo.checks.next();
					} else {
						yoodoo.noInternet();
					}
				});
			},

			// Load metaphor specific classes

			function() {
				yoodoo.defineScrollStop();
				yoodoo.checks.html();
				yoodoo.checks.ajax();
				yoodoo.setSize();

				var dependencies = [
					/*['dooits/jquery-ui.js', true],
					['overlay/jquery_transit.js', true],
					['overlay/dooit.js', true],
					['overlay/yoodooLanguage.js', true],
					['overlay/yoodooObject.js', true],
					['overlay/yoodooObject.css', true],
					['overlay/yoodooIcons.js', true],
					['overlay/yoodooStyler.js', true]*/
				];
				switch (yoodoo.metaphor) {
					case 1:
						if (yoodoo.html5) {
							if (yoodoo.dev) {
								dependencies.push(['overlay/yoodooPlaya.js', true]);
								dependencies.push(['overlay/yoodooQuiz.js', true]);
								dependencies.push(['overlay/yoodooQuiz.css', true]);
							}else{
								dependencies.push(['overlay/yoodoohtml.js', true]);
							}
						}else{
							if (yoodoo.dev) {
								dependencies.push(['dooits/jquery-ui.js', true]);
								dependencies.push(['overlay/jquery_transit.js', true]);
								dependencies.push(['overlay/dooit.js', true]);
								dependencies.push(['overlay/yoodooLanguage.js', true]);
								dependencies.push(['overlay/yoodooObject.js', true]);
								dependencies.push(['overlay/yoodooIcons.js', true]);
								dependencies.push(['overlay/yoodooStyler.js', true]);
								dependencies.push(['overlay/yoodooMetaphorOne.js', true]);
								dependencies.push(['overlay/yoodooInterface.js', true]);
								dependencies.push(['overlay/yoodooBookcase.js', true]);
								dependencies.push(['overlay/yoodooComments.js', true]);
								dependencies.push(['overlay/yoodooAdvisor.js', true]);
								dependencies.push(['overlay/yoodooGroups.js', true]);
								dependencies.push(['overlay/yoodooUi.js', true]);
							}else{
								dependencies.push(['overlay/yoodooplus.js', true]);
							}
						}
                        if(yoodoo.keywordSearch===true){
                           dependencies.push(['overlay/yoodooKeywordSearch.js', true]);
                           dependencies.push(['overlay/yoodooKeywordSearch.css', true]);
                        }
						//dependencies.push(['overlay/yoodooMetaphorOne.js', true]);
						//dependencies.push(['overlay/yoodooInterface.js', true]);
						dependencies.push(['overlay/yoodooPlaya.css', true]);
						//dependencies.push(['overlay/yoodooBookcase.js', true]);
						//dependencies.push(['overlay/yoodooComments.js', true]);
						//dependencies.push(['overlay/yoodooComments.css', true]);
						//dependencies.push(['overlay/yoodooAdvisor.js', true]);
						//dependencies.push(['overlay/yoodooGroups.js', true]);
						//dependencies.push(['overlay/yoodooGroups.css', true]);
						//dependencies.push(['overlay/yoodooUi.js', true]);
						//dependencies.push(['overlay/yoodooUi.css', true]);
						dependencies.push(['overlay/yoodooMetaphorOne.css', true]);
						dependencies.push([
							[
								['Explorer', '<=9'], 'overlay/yoodoo_widget_ie9.css'
							], true
						]);
						dependencies.push([
							[
								['Explorer', '==8'], 'overlay/yoodoo_widget_ie8.css'
							], true
						]);
						dependencies.push([
							[
								['Explorer', '<=9 && BrowserDetect.docMode==7'], 'overlay/yoodoo_widget_ie7.css'
							], true
						]);
						break;
					case 2:
						dependencies.push(['dooits/jquery-ui.js', true]);
						dependencies.push(['overlay/jquery_transit.js', true]);
						dependencies.push(['overlay/dooit.js', true]);
						dependencies.push(['overlay/yoodooLanguage.js', true]);
						dependencies.push(['overlay/yoodooObject.js', true]);
						dependencies.push(['overlay/yoodooIcons.js', true]);
						dependencies.push(['overlay/yoodooStyler.js', true]);
						dependencies.push(['overlay/yoodooMetaphorTwo.js', true]);
						dependencies.push(['overlay/yoodooUi.js', true]);
						dependencies.push(['overlay/yoodooInterface.js', true]);
						dependencies.push(['overlay/yoodooHub.js', true]);
						dependencies.push(['overlay/yoodooUi.css', true]);
						dependencies.push(['overlay/yoodooMetaphorTwo.css', true]);
						dependencies.push(['overlay/yoodooComments.js', true]);
						dependencies.push(['overlay/yoodooSessions.js', true]);
						dependencies.push(['overlay/yoodooPresenter.js', true]);
						//dependencies.push(['overlay/yoodooSessions.css', true]);
						break;
				}
				yoodoo.loader('Loading core files&hellip;');
				var loader = new yoodoo.fileLoader.loader(dependencies, function(complete) {
					if (complete) {
						if (yoodoo.html5 || yoodoo.metaphor==2) {
							yoodoo.checks.next();
						} else {
							yoodoo.checks.swfObject();
						}
					} else {
						yoodoo.noInternet();
					}
				});
			},

			// Load language classes

			function() {
				if (yoodoo.metaphor==1) yoodoo.cmd = yoodoo.html5 ? yoodoo.cmdHTML5 : yoodoo.cmdFlash;

				var dependencies = [
					['overlay/yoodooLanguageData.js', true],
				];
				if (yoodoo.is_touch) dependencies.push(['dooits/jquery-ui-touch.js', true]);
				yoodoo.loader('Loading Language&hellip;');
				var loader = new yoodoo.fileLoader.loader(dependencies, function(complete) {
					if (complete) {
						if (yoodoo.additionaldependencies.length > 0) {
							var loader = new yoodoo.fileLoader.loader(yoodoo.additionaldependencies, function(complete) {
								if (complete) {
									yoodoo.checks.next();
								} else {
									yoodoo.noInternet();
								}
							});
						} else {
							yoodoo.checks.next();
						}
					} else {
						yoodoo.noInternet();
					}
				});
			},

			// Start build

			function() {
				yoodoo.onceLoaded.run();
				yoodoo.postInit();
			}
		],
		Jquery: {
			fetched: false,
			check: function() {
				var required = false;
				if (typeof(jQuery) !== "undefined") {
					if (this.fetched === false) {
						var v = $().jquery.split('.');
						var rv = yoodoo.jquery.version.split('.');
						while (rv.length < v.length) rv.push(0);
						while (v.length < rv.length) v.push(0);
						for (var vi = 0; vi < rv.length; vi++) {
							if (v[vi] > rv[vi]) {
								if (typeof(console) != "undefined" && typeof(console.log) != "undefined") console.log("jQuery version used is higher than " + yoodoo.jquery.version + " that is recommended");
								break;
							} else if (v[vi] < rv[vi]) {
								if (typeof(console) != "undefined" && typeof(console.log) != "undefined") console.log("jQuery version " + yoodoo.jquery.version + " recommended");
								break;
							}
						}
					}
					yoodoo.checks.next();
				} else if (this.fetched === false) {
					this.fetched = true;
					yoodoo.loader('Loading jquery&hellip;');
					var loader = new yoodoo.fileLoader.loader([
						[yoodoo.jquery.url, true, null, false]
					], yoodoo.checks.Jquery.check);
				}
			}
		},
		complexity: function() {
			var c = 0;
			switch (BrowserDetect.OS) {
				case "iPad":
					c = 1;
					break;
				case "iPhone":
					c = 1;
					break;
				case "Android":
					if (BrowserDetect.browser == 'Chrome') {
						c = 2;
					} else {
						c = 1;
					}
					break;
				default:
					c = 0;
					break;
			}
			yoodoo.renderComplexity = c;
			return c;
		},
		html: function() {
			if (yoodoo.metaphor>1) yoodoo.htmldetect=true;
			try {
				var did = document.createElement("canvas");
				yoodoo.canHTML = !!(did.getContext && did.getContext('2d'));
				if (yoodoo.canHTML) {
					var aud = document.createElement("audio");
					yoodoo.canHTML = !!(aud.canPlayType);
				}
			} catch (e) {
				yoodoo.errorLog(e);
				yoodoo.canHTML = false;
			}
			if (yoodoo.htmldetect && yoodoo.canHTML) {
				yoodoo.html5 = true;
				yoodoo.html5available = yoodoo.html5;
				if (yoodoo.metaphor==1 && yoodoo.flashdefault && this.flash()) yoodoo.html5 = false;
			}
		},
		flash: function() {
			if (navigator && navigator.plugins && navigator.plugins.length > 0) {
				for (var n = 0; n < navigator.plugins.length; n++) {
					if (/Shockwave Flash/.test(navigator.plugins[n].name)) return true;
				}
			} else if (navigator.appVersion.indexOf("Mac") == -1 && window.execScript) {
				try {
					tmp = new ActiveXObject('ShockwaveFlash.ShockwaveFlash');
					return true;
				} catch (e) {
					yoodoo.errorLog(e);
				}
			}
			return false;
		},
		mouse: function() {
			window.addEventListener('mousemove', findMouse = function() {
				yoodoo.is_mouse = true;
				yoodoo.widget.className = yoodoo.widget.className + ' is_mouse';
				window.removeEventListener('mousemove', findMouse);
			});
		},
		mobile: function() {
			yoodoo.mobile = yoodoo.is_touch;
		},
		webkit: function() {
			yoodoo.webkit = navigator && navigator.userAgent && /webkit/i.test(navigator.userAgent);
		},
		app: function() {
			if (typeof(yoodooApp)!='undefined' && yoodooApp.user_getUserhash!==undefined) {
				yoodoo.loginCode=yoodooApp.user_getUserhash();
				if (yoodoo.loginCode!='') return yoodoo.loginCode;
			}
			return false;
		},
		ajax: function() {
			var src=(window.location.origin!==undefined)?window.location.origin:'http://'+window.location.hostname;
			if (!(/^http/.test(src))) src='http://'+src;
			yoodoo.ajax = (src.replace(/^[^\/]*\/\//,'').replace(/\/.*$/,'').toLowerCase() == yoodoo.option.baseUrl.replace(/^[^\/]*\/\//,'').replace(/\/.*$/,'').toLowerCase());
		},
		userMedia: function() {
			return !!(navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);
		}
	},
	call: function(f, p) {
		if (typeof(this[f]) == 'function') {
			if (p === null) {
				return this[f]();
			} else {
				return this[f](p);
			}
		}
	},
	noInternet: function() {
		this.alert("You seem to have a connection problem.\nChecking internet connection...");
		this.testImage = document.createElement("img");
		$(this.testImage).css("display", "none");
		this.testImage.src = 'http://www.google.com/images/logo.png';
		this.testImage.setAttribute('onerror', 'yoodoo.noConnection()');
		this.testImage.setAttribute('onload', 'yoodoo.noServer()');
		document.body.appendChild(this.testImage);
	},
	noConnection: function() {
		$(this.testImage).remove();
		this.alert("Your internet connection seems to be missing");
	},
	noServer: function() {
		$(this.testImage).remove();
		this.alert("Apologies... the Yoodoo server seems to be down");
	},
	fileVersions: [],
	versioning: function(arr) {
		var asDefault = false;
		if (arguments.length > 1) asDefault = arguments[1];
		if (typeof(this.fileVersions[this.currentSiteFolder]) == "undefined") this.fileVersions[this.currentSiteFolder] = {
			generic: {
				js: {},
				css: {}
			},
			specific: {
				js: {},
				css: {}
			}
		};
		if (typeof(arr.generic) != "undefined") {
			if (typeof(arr.generic.js) != "undefined") {
				for (var k in arr.generic.js) {
					if (typeof(this.fileVersions[this.currentSiteFolder].generic.js[k]) != "string" || !asDefault) this.fileVersions[this.currentSiteFolder].generic.js[k] = arr.generic.js[k];
				}
			}
			if (typeof(arr.generic.css) != "undefined") {
				for (var k in arr.generic.css) {
					if (typeof(this.fileVersions[this.currentSiteFolder].generic.css[k]) != "string" || !asDefault) this.fileVersions[this.currentSiteFolder].generic.css[k] = arr.generic.css[k];
				}
			}
		}
		if (typeof(arr.specific) != "undefined") {
			if (typeof(arr.specific.js) != "undefined") {
				for (var k in arr.specific.js) {
					if (typeof(this.fileVersions[this.currentSiteFolder].specific.js[k]) != "string" || !asDefault) this.fileVersions[this.currentSiteFolder].specific.js[k] = arr.specific.js[k];
				}
			}
			if (typeof(arr.specific.css) != "undefined") {
				for (var k in arr.specific.css) {
					if (typeof(this.fileVersions[this.currentSiteFolder].specific.css[k]) != "string" || !asDefault) this.fileVersions[this.currentSiteFolder].specific.css[k] = arr.specific.css[k];
				}
			}
		}
	},
	loadFailed: function() {
		yoodoo.console("Failed to load the file dependents");
	},
	checkSiteVersions: function() {
		if (typeof(this.fileVersions[this.currentSiteFolder]) != "undefined") {
			yoodoo.runInitThis();
		} else {
			var loader = new this.fileLoader.loader([
				['overlay/yoodoo_versions.js', false]
			], function() {
				yoodoo.runInitThis();
			});
		}

	},
	fileLoader: {
		fetching: {},
		loaded: {},
		loader: function(list, callback) {
			this.options = {
				cssCheckDelay: 200,
				timeout: 20 // stop after seconds
			};
			this.active = false;
			this.files = [];
			this.list = list;
			this.fetching = {};
			this.loaded = {};
			this.callback = callback;
			this.start = function() {
				var me = this;
				this.active = true;
				var process = false;
				for (var i = 0; i < this.list.length; i++) {
					var ok = true;
					if (typeof(this.list[i])=='undefined') ok=false;
					if (typeof(this.list[i])!='undefined' && typeof(this.list[i][0]) != "string") {
						ok = false;
						if (typeof(this.list[i][0][0]) == "object") {
							if (BrowserDetect.browser == this.list[i][0][0][0]) {
								try {
									eval('ok=(BrowserDetect.version' + this.list[i][0][0][1] + ');');
								} catch (e) {
									yoodoo.errorLog(e);
								}
							}
						} else if (typeof(this.list[i][0][0]) == "string") {
							ok = (BrowserDetect.browser == this.list[i][0][0]);
						}
					}
					if (ok) {
						var file = yoodoo.fileLoader.fileVersionUpdate(this.list[i]);
						if (file !== false /*&& yoodoo.fileLoader.fetching[file.filename] === undefined*/ && this.fetching[file.filename] === undefined && yoodoo.fileLoader.loaded[file.filename.replace(/\?\d*$/, '')] === undefined && this.loaded[file.filename.replace(/\?\d*$/, '')] === undefined) {
							//if (yoodoo.fileLoader.fetching[file.filename] === undefined) yoodoo.fileLoader.fetching[file.filename] = file;
							this.fetching[file.filename] = file;
							process = true;
						}
					}
				}
				if (process) {
					this.addFiles();
					this.timeoutObject = setTimeout(function() {
						me.active = false;
						me.checkComplete();
					}, me.options.timeout * 1000);
				} else {
					this.callback(true);
				}
			};
			this.removeFiles = function() {
				while (this.files.length > 0) {
					var ele = this.files.pop();
					$(ele).remove();
				}
				for (var fn in this.fetching) yoodoo.fileLoader.fetching[fn] = undefined;
				for (var fn in this.loaded) yoodoo.fileLoader.loaded[fn] = undefined;
				this.files = [];
				this.fetching = {};
				this.loaded = {};
			};
			this.checkComplete = function() {
				var loading = this.notLoaded();
				if (loading.waiting >= 0) {
					if (yoodoo.loaderInfo !== undefined) yoodoo.loader('Loading ' + (loading.total - loading.waiting) + '/' + loading.total + '&hellip;');
					/*if (yoodoo.loaderInfo !== undefined) {
						if (yoodoo.loaderInfo.parentElement !== null) {
							yoodoo.loaderInfo.innerHTML = 'Loading ' + (loading.total - loading.waiting) + '/' + loading.total + '&hellip;';
						}
					}*/
				}
				if (loading.waiting==0) {
					this.active = false;
					this.callback(true);
					clearTimeout(this.timeoutObject);
					clearInterval(this.timedChecker);
				} else if (this.active === false) {
					console.log("Timed out");
					clearTimeout(this.timeoutObject);
					clearInterval(this.timedChecker);
					if (this.callback(false)) this.failed();
				}
			};
			this.isComplete = function() {
				return this.notLoaded().waiting == 0;
			};
			this.notLoaded = function() {
				var i = 0;
				var t = 0;
				for (var f in this.fetching) {
					if (yoodoo.fileLoader.fetching[f] === undefined) this.fetching[f]=undefined;
					if (this.fetching[f] !== undefined) i++;
					t++;
				}
				return {
					waiting: i,
					total: t
				};
			};
			this.failed = function() {
				var i = this.notLoaded();
				if (i > 0) yoodoo.alert(i + " file" + ((i == 0) ? '' : 's') + " failed to load");
			};
			this.addFiles = function() {
				var regularCheck=false;
				for (var f in this.fetching) {
					if (this.fetching[f] !== undefined) {
						if (yoodoo.fileLoader.fetching[f] !== undefined) {
							regularCheck=true;
						}else{
							var file = this.fetching[f];
							yoodoo.fileLoader.fetching[f]=file;
							var filename = file.filename;
							var ele = null;
							if (file.type == "js") {
								ele = document.createElement("SCRIPT");
								ele.src = file.filename;
								ele.filename = file.filename.replace(/\?\d*$/, '');
								ele.fileObj = file;
								ele.loader = this;
								ele.type = 'text/javascript';
								ele.onload = function() {
									if (this.isloaded !== true) {
										this.isloaded = true;
										this.loader.fetching[this.fileObj.filename] = undefined;
										//console.log(this.fileObj.filename,this.filename);
										this.loader.loaded[this.filename] = this.fileObj;
										yoodoo.fileLoader.fetching[this.fileObj.filename] = undefined;
										yoodoo.fileLoader.loaded[this.filename] = this.fileObj;
										this.loader.checkComplete();
									}
								};
								ele.onreadystatechange = function() {
									if (this.readyState == "complete" || this.readyState == "loaded") {
										if (this.isloaded !== true) {
											this.isloaded = true;
											this.loader.fetching[this.fileObj.filename] = undefined;
										//console.log(this.fileObj.filename,this.filename);
											this.loader.loaded[this.filename] = this.fileObj;
											yoodoo.fileLoader.fetching[this.fileObj.filename] = undefined;
											yoodoo.fileLoader.loaded[this.filename] = this.fileObj;
											this.loader.checkComplete();
										}
									}
								};
							} else {
								ele = document.createElement("LINK");
								ele.href = file.filename;
								ele.type = 'text/css';
								ele.rel = 'stylesheet';
								var cssDiv = document.createElement("DIV");
								cssDiv.innerHTML = "&nbsp;";
								cssDiv.style.position = 'fixed';
								cssDiv.style.top = '-10px';
								cssDiv.style.fontSize = '4px';
								cssDiv.fileObj = file;
								cssDiv.filename = file.filename.replace(/\?\d*$/, '');

								var cl = file.filename.match(yoodoo.filenameMatcher);
								cl = 'cssDetector_' + cl[1].replace(/-/g, '_');
								cssDiv.className = cl + ' yoodooCssDependencyItem';
								document.body.appendChild(cssDiv);
								cssDiv.loader = this;
								cssDiv.cssDivChecker = function() {
									if (this.loader.active) {
										if (this.clientWidth == 0) {
											this.loader.fetching[this.fileObj.filename] = undefined;
											this.loader.loaded[this.filename] = this.fileObj;
											yoodoo.fileLoader.fetching[this.fileObj.filename] = undefined;
											yoodoo.fileLoader.loaded[this.filename] = this.fileObj;
											this.parentElement.removeChild(this);
											this.loader.checkComplete();
										} else {
											var thisObj = this;
											setTimeout(function() {
												thisObj.cssDivChecker();
											}, this.loader.options.cssCheckDelay);
										}
									} else {
										this.parentElement.removeChild(this);
									}
								};
								cssDiv.cssDivChecker();
							}
							if (ele !== null) {
								this.files.push(ele);
								var head = document.getElementsByTagName("head")[0];
								head.appendChild(ele);
							}
						}
					}
				}
				if (regularCheck) {
					var me=this;
					this.timedChecker=setInterval(function() {
						me.checkComplete();
					},500);
				}
			};
			this.start();
		},
		fileVersionUpdate: function(file) {
			var fn = (typeof(file) == "string") ? file : (typeof(file[0]) == "string") ? file[0] : file[0][1];
			var paths = fn.split('/');
			var filename = paths.pop();
			var generic = (typeof(file) == "string") ? "false" : ((typeof(file[1]) != "undefined") ? file[1] : true);
			var isjs = /\.js/.test(filename);
			if (paths.length == 0) {
				if (isjs) {
					paths = ['dooit'];
				} else {
					paths = ['css'];
				}
			}
			if (file.length > 2 && file[2] !== null) {
				var path = yoodoo.getFilePath(paths.join('.'), generic, file[2]);
			} else {
				var path = yoodoo.getFilePath(paths.join('.'), generic);
			}
			var ver = null;
			var nom = filename.replace(isjs ? '.js' : '.css', '');
			var noVersion = false;
			if (file.length > 3 && file[3] === false) {
				noVersion = true;
				ver = '';
			}
			if (noVersion === false) {
				if (typeof(yoodoo.fileVersions[yoodoo.currentSiteFolder]) != "undefined" && typeof(yoodoo.fileVersions[yoodoo.currentSiteFolder][generic ? 'generic' : 'specific'][isjs ? 'js' : 'css'][nom]) != "undefined") {
					ver = yoodoo.fileVersions[yoodoo.currentSiteFolder][generic ? 'generic' : 'specific'][isjs ? 'js' : 'css'][nom];
				} else if (typeof(yoodoo.fileVersions[yoodoo.siteFolder]) != "undefined" && typeof(yoodoo.fileVersions[yoodoo.siteFolder][generic ? 'generic' : 'specific'][isjs ? 'js' : 'css'][nom]) != "undefined") {
					ver = yoodoo.fileVersions[yoodoo.siteFolder][generic ? 'generic' : 'specific'][isjs ? 'js' : 'css'][nom];
				}
			}
			var fullPath = path + filename + '?' + new Date().getTime();
			if (ver !== null) {
				fullPath = path + filename.replace((isjs ? '.js' : '.css'), ver + (isjs ? '.js' : '.css'));
			}
			return {
				filename: fullPath,
				type: (isjs ? 'js' : 'css')
			};
		}
	},
	onLoadActions: [],
	onLoad: function(str) {
		if (this.ready) {
			try {
				eval(str);
			} catch (e) {
				yoodoo.errorLog(e);
			}
		} else {
			this.onLoadActions.push(str);
		}
	},
	doLoadActions: function() {
		while (this.onLoadActions.length > 0) {
			var str = this.onLoadActions.splice(0, 1)[0];
			try {
				eval(str);
			} catch (e) {
				yoodoo.errorLog(e);
			}
		}
	},
	console: function(txt) {
		if (typeof(console) != "undefined" && this.log && typeof(console.log) != "undefined") console.log(txt);
	},
	clearMetaCache:function() {
		this.user.metaUpdate={};
	}
};
var dooit = {
	finishable: function() {
		return false;
	}
};
var BrowserDetect = {
	init: function() {
		this.browser = this.searchString(this.dataBrowser) || "An unknown browser";
		this.version = this.searchVersion(navigator.userAgent) || this.searchVersion(navigator.appVersion) || "an unknown version";
		this.OS = this.searchString(this.dataOS) || "an unknown OS";
		this.docMode = null;
		if (this.browser == "Explorer" && this.version < 8) {
			try {
				if (/Trident/.test(navigator.userAgent)) this.version = 8;
			} catch (e) {}
		}else if (this.browser == "Explorer") {
			if (/Trident\/7/.test(navigator.userAgent)) this.version = 11;
		}
		if (this.browser == "Explorer") {
			try {
				if (!isNaN(document.documentMode)) this.docMode = document.documentMode;
			} catch (e) {
				yoodoo.errorLog(e);
			}
		}
	},
	searchString: function(data) {
		for (var i = 0; i < data.length; i++) {
			var dataString = data[i].s;
			var dataProp = data[i].p;
			this.versionSearchString = data[i].vs || data[i].i;
			if (dataString) {
				//alert(data[i].ss+" in "+dataString+" = "+dataString.indexOf(data[i].ss));
				if (dataString.indexOf(data[i].ss) != -1) return data[i].i;
			} else if (dataProp) return data[i].i;
		}
	},
	searchVersion: function(dataString) {
		var index = dataString.indexOf(this.versionSearchString);
		if (index == -1) return;
		return parseFloat(dataString.substring(index + this.versionSearchString.length + 1));
	},
	dataBrowser: [{
		s: navigator.userAgent,
		ss: "Edge",
		i: "Edge"
	}, {
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
		ss: "Trident/7",
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
		i: "iPhone"
	}, {
		s: navigator.userAgent,
		ss: "iPad",
		i: "iPad"
	}, {
		s: navigator.userAgent,
		ss: "Android",
		i: "Android"
	}, {
		s: navigator.platform,
		ss: "Linux",
		i: "Linux"
	}]

};
BrowserDetect.init();
yoodoo.findindex = function(needle, haystack) {
	for (var i = 0; i < haystack.length; i++) {
		if (haystack[i] === needle) {
			return i;
		}
	}
	return -1;
};
yoodoo.parseJSON=function(str) {
	var tmp=null;
	try{
		eval('tmp='+str+';');
	}catch(e){
		yoodoo.errorLog(e);
	}
	return tmp;
};
yoodoo.styles = {
	icons: {
		light: true,
		dark: false
	},
	boundary: {
		radius: 5
	},
	base: {
		r: 22,
		g: 39,
		b: 63,
		tint: {
			l: [0.3, 0.2, 0, 0.05],
			b: [0, 0, 0, 0],
			lightness: 0,
			brightness: 0.8
		}
	},
	backgroundImage: null,
	highlight: {
		l: 0.1,
		b: 2
	}, // lightness and brightness of base
	warning: {
		r: 124,
		g: 72,
		b: 54,
		tint: {
			l: [0.3, 0.2, 0, 0.05],
			b: [0, 0, 0, 0],
			lightness: 0,
			brightness: 0
		},
		gloss: false
	},
	text: {
		r: 255,
		g: 255,
		b: 255
	},
	dooittext: {
		r: 50,
		g: 50,
		b: 50
	},
	link: {
		r: 255,
		g: 255,
		b: 255
	},
	linkHover: {
		r: 150,
		g: 150,
		b: 255
	},
	button: {
		colour: {
			r: 72,
			g: 111,
			b: 163,
			tint: {
				l: [0.3, 0.2, 0, 0.05],
				b: [0, 0, 0, 0],
				lightness: 0,
				brightness: 0
			},
			gloss: true
		},
		colourHover: {
			r: 72,
			g: 111,
			b: 163,
			tint: {
				l: [0.35, 0.2, 0, 0.15],
				b: [0, 0, 0, 0.2],
				lightness: 0,
				brightness: 0
			},
			gloss: true
		},
		colourOn: {
			r: 72,
			g: 111,
			b: 163,
			tint: {
				l: [0.3, 0.2, 0, 0.05],
				b: [0, 0, 0, 0],
				lightness: 0,
				brightness: 0
			},
			gloss: true
		},
		colourOnHover: {
			r: 72,
			g: 111,
			b: 163,
			tint: {
				l: [0.35, 0.2, 0, 0.15],
				b: [0, 0, 0, 0.2],
				lightness: 0,
				brightness: 0
			},
			gloss: true
		},
		colourOff: {
			r: 114,
			g: 118,
			b: 123,
			tint: {
				l: [0.35, 0.2, 0, 0.15],
				b: [0, 0, 0, 0.2],
				lightness: 0,
				brightness: 0
			},
			gloss: true
		},
		colourOffHover: {
			r: 0,
			g: 141,
			b: 179,
			tint: {
				l: [0.35, 0.2, 0, 0.15],
				b: [0, 0, 0, 0.2],
				lightness: 0,
				brightness: 0
			},
			gloss: true
		}
	},
	book: {
		colour: {
			r: 190,
			g: 190,
			b: 190,
			tint: {
				l: [0.3, 0.2, 0, 0.05],
				b: [0, 0, 0, 0],
				lightness: 0.1,
				brightness: 0.2
			},
			gloss: false
		},
		spine: {
			r: 22,
			g: 48,
			b: 87,
			tint: {
				l: [0.3, 0.2, 0, 0.05],
				b: [0, 0, 0, 0],
				lightness: 0.1,
				brightness: 0.2
			},
			gloss: false
		},
		topic: {
			r: 0,
			g: 0,
			b: 0,
			tint: {
				l: [0.3, 0.2, 0, 0.05],
				b: [0, 0, 0, 0],
				lightness: 0.1,
				brightness: 0.1
			},
			gloss: false,
			adjust: {
				lightness: -0.1,
				brightness: -0.1
			}
		},
		border: {
			width: 1,
			r: 151,
			g: 170,
			b: 198
		},
		text: {
			r: 50,
			g: 50,
			b: 50
		},
		spinetext: {
			r: 200,
			g: 200,
			b: 200
		},
		topictext: {
			r: 100,
			g: 100,
			b: 100
		},
		radius: 5
	},
	overlay: {
		background: {
			r: 255,
			g: 255,
			b: 255,
			a: 0.2
		},
		text: {
			r: 200,
			g: 200,
			b: 200

		},
		link: {
			r: 200,
			g: 200,
			b: 255
		},
		linkHover: {
			r: 150,
			g: 150,
			b: 255
		}
	},
	h2: {
		r: 0,
		g: 174,
		b: 254
	},
	h3: {
		r: 0,
		g: 174,
		b: 254
	},
	progress: {
		background: {
			r: 72,
			g: 111,
			b: 163,
			tint: {
				l: [0.3, 0.2, 0, 0.05],
				b: [0, 0, 0, 0],
				lightness: 0,
				brightness: 0
			},
			gloss: true
		},
		bar: {
			r: 44,
			g: 183,
			b: 219,
			tint: {
				l: [0.3, 0.2, 0, 0.05],
				b: [0, 0, 0, 0],
				lightness: 0,
				brightness: 0
			},
			gloss: true
		},
		buffer: {
			r: 92,
			g: 131,
			b: 183,
			tint: {
				l: [0.3, 0.2, 0, 0.05],
				b: [0, 0, 0, 0],
				lightness: 0,
				brightness: 0
			},
			gloss: true
		}
	},
	keypoint: {
		text: {
			r: 70,
			g: 70,
			b: 70
		},
		background: {
			r: 250,
			g: 250,
			b: 250,
			tint: {
				l: [0.3, 0.2, 0, 0.05],
				b: [0, 0, 0, 0],
				lightness: 0,
				brightness: -0.1
			},
			gloss: false
		}
	},
	keypoints: {
		text: {
			r: 255,
			g: 255,
			b: 255
		},
		background: {
			r: 72,
			g: 111,
			b: 163,
			tint: {
				l: [0.3, 0.2, 0, 0.05],
				b: [0, 0, 0, 0],
				lightness: 0,
				brightness: 0
			},
			gloss: true
		},
		options: {
			r: 72,
			g: 111,
			b: 163,
			tint: {
				l: [0.3, 0.2, 0, 0.05],
				b: [0, 0, 0, 0],
				lightness: 0,
				brightness: 0
			},
			gloss: true
		},
		past: {
			text: {
				r: 255,
				g: 255,
				b: 255
			},
			background: {
				r: 100,
				g: 100,
				b: 100,
				tint: {
					l: [0.3, 0.2, 0, 0.05],
					b: [0, 0, 0, 0],
					lightness: 0,
					brightness: 0
				},
				gloss: true
			}
		},
		current: {
			text: {
				r: 255,
				g: 255,
				b: 255
			},
			background: {
				r: 0,
				g: 0,
				b: 100,
				tint: {
					l: [0.3, 0.2, 0, 0.05],
					b: [0, 0, 0, 0],
					lightness: 0,
					brightness: 0
				},
				gloss: true
			}
		}
	},
	episodeOverlay: {
		text: {
			r: 255,
			g: 255,
			b: 255
		},
		background: {
			r: 22,
			g: 39,
			b: 63,
			tint: {
				l: [0.3, 0.2, 0, 0.05],
				b: [0, 0, 0, 0],
				lightness: 0,
				brightness: 0.8
			},
			gloss: false
		}
	},
	toolbar: {
		text: {
			r: 226,
			g: 226,
			b: 226
		},
		background: {
			r: 47,
			g: 47,
			b: 47
		},
		button: {
			background: {
				r: 47,
				g: 47,
				b: 47
			},
			hover: {
				r: 68,
				g: 68,
				b: 68
			},
			on: {
				r: 239,
				g: 243,
				b: 247
			},
			text: {
				r: 255,
				g: 255,
				b: 255
			},
			textHover: {
				r: 255,
				g: 255,
				b: 255
			},
			textOn: {
				r: 0,
				g: 0,
				b: 0
			}
		},
		done: {
			background: {
				r: 62,
				g: 192,
				b: 62
			},
			backgroundHover: {
				r: 58,
				g: 239,
				b: 58
			},
			text: {
				r: 255,
				g: 255,
				b: 255
			},
			textHover: {
				r: 0,
				g: 0,
				b: 0
			}
		},
		dialog: {
			background: {
				r: 239,
				g: 243,
				b: 247
			},
			text: {
				r: 0,
				g: 0,
				b: 0
			},
			buttonbackground: {
				r: 135,
				g: 135,
				b: 135
			},
			buttontext: {
				r: 255,
				g: 255,
				b: 255
			},
			buttonbackgroundHover: {
				r: 67,
				g: 67,
				b: 67
			},
			buttontextHover: {
				r: 255,
				g: 255,
				b: 255
			}
		}
	},
	widget: {
		text: {
			r: 50,
			g: 50,
			b: 50
		},
		background: {
			r: 255,
			g: 255,
			b: 255,
			tint: {
				l: [0.3, 0.2, 0, 0.05],
				b: [0, 0, 0, 0],
				lightness: 0,
				brightness: -0.1
			},
			gloss: false
		}
	}
};


