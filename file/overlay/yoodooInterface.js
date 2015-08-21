yoodoo.interface = {
	useApp:true,
	gotUserhash : function(userhash) {
		yoodoo.loginCode=userhash;
		yoodoo.sitehash=yoodooApp.site_getSitehash();
		yoodoo.loginValidate();
	},
	community : function(args) {
		yoodoo.interface.showWebview();
		yoodoo.community.show(args);
	},
	menu : function() {
		yoodoo.console('yoodoo.menu()');
	},
	comments : function() {
		yoodoo.community.show();
	},
	back : function() {
		yoodoo.display.remove(null,function() {});
	},
	cachedNotification:null,
	clicked_notifications : function(fromHubCall) {
		if (yoodoo.appFunctionExists(['clicked_notifications']) && this.useApp && true) {
			var tmp=undefined;
			if (yoodoo.interface.cachedNotification!==null) {
				tmp=yoodoo.interface.cachedNotification;

			}else{
				tmp=yoodooApp.clicked_notifications();
			}
			//tmp='{"title":"Internal test","content":"The notification content","command":"","created":"new Date(2014,11,20)"}';
			if (typeof(tmp)!="undefined") {
				if (typeof(tmp)=="string") tmp=$.parseJSON(tmp);
				if (yoodoo.fullyLoaded || fromHubCall===true) {
					yoodoo.interface.cachedNotification=null;
					if (tmp.content!==undefined) {
						yoodoo.interface.showWebview();
						yoodoo.notification.show(tmp);
						return tmp;
					}
				}else{			
					yoodoo.interface.cachedNotification=tmp;
				}
			}else{
				if (fromHubCall!==true && yoodoo.fullyLoaded && yoodoo.display.stack.length==0) {
					yoodoo.sessions.showHub();
				}
			}
		}
		return false;
	},
	list_notifications : function() {
		yoodoo.interface.showWebview();
		yoodoo.notification.list();
	},
	sessionUpdate : function(arr) {
		if (yoodoo.appFunctionExists(['sessions_update']) && this.useApp) {
			var sess={current:arr.current,sessions:[]};
			for(var s=0;s<arr.sessions.length;s++) sess.sessions.push(arr.sessions[s].appArray());
			yoodooApp.sessions_update(JSON.stringify(sess));
			yoodoo.console('yoodooApp.sessions_update '+JSON.stringify(sess));
		}
	},
	toolbarShow : function(opts) {
		if (yoodoo.appFunctionExists(['toolbar_show']) && this.useApp && false) {
			if (typeof(opts.menu)=='object') {
				for(var m=0;m<opts.menu.length;m++) {
					opts.menu[m].icon=$(opts.menu[m].icon).html();
				}
			}
			if (typeof(opts.buttons)=='object') {
				for(var m=0;m<opts.buttons.length;m++) {
					opts.buttons[m].icon=$(opts.buttons[m].icon).html();
				}
			}
			yoodooApp.toolbar_show(JSON.stringify(opts));
			yoodoo.console('yoodooApp.toolbar_show '+JSON.stringify(opts));
			return true;
		}
		return false;
	},
	session : function(id) {
		yoodoo.interface.setOrientation("portrait");
		yoodoo.console('yoodoo.session.show('+id+');');
		yoodoo.interface.showWebview();
		yoodoo.session.show.apply(yoodoo.session,arguments);
		yoodoo.interface.hideHub();
	},
	experience : function(id) {
		yoodoo.interface.setOrientation("portrait");
		yoodoo.interface.showWebview();
		yoodoo.console('yoodoo.session.showExperience('+id+');');
		yoodoo.session.showExperience(id);
	},
	content : function(id) {
		yoodoo.interface.setOrientation("auto");
		yoodoo.interface.showWebview();
		yoodoo.console('yoodoo.session.showContent('+id+');');
		yoodoo.session.showContent.apply(yoodoo.session,arguments);
	},
	search : function() {
		yoodoo.interface.showWebview();
		yoodoo.search(arguments);
	},
	searchResults : function(text) {
		return yoodoo.search(text);
	},
	showWebview : function() {
		if (yoodoo.appFunctionExists(['webview_show'])) {
			console.log('yoodooApp.webview_show');
			yoodooApp.webview_show();
		}
	},
	hideWebview : function() {
		if (yoodoo.appFunctionExists(['webview_hide'])) {
			console.log('yoodooApp.webview_hide');
			yoodooApp.webview_hide();
		}
	},
	setOrientation : function(orientation) {
		if (yoodoo.appFunctionExists(['setOrientation'])) {
			//console.log('yoodooApp.setOrientation');
			yoodooApp.setOrientation(orientation);
		}
	},
	showLogin : function() {
		if (yoodoo.appFunctionExists(['user_showLogin'])) {
			console.log('yoodooApp.user_showLogin');
			yoodooApp.user_showLogin();
		}else{
			yoodoo.showLogin();
		}
	},
	showHub : function (data) {
		yoodoo.interface.setOrientation("portrait");
		yoodoo.interface.hideDialog();
		if (yoodoo.appFunctionExists(['hub_show']) && this.useApp) {
			//console.log(yoodoo.interface.showHub.caller);
			//console.log("Hub show");
			if (yoodoo.interface.clicked_notifications(true)===false) {
				yoodooApp.hub_show(window.JSON.stringify(data));
			}
		}else{
			yoodoo.hub.display(data);
		}
	},
	hideHub : function () {
		console.log('yoodooApp.hub_hide');
		if (yoodoo.appFunctionExists(['hub_hide']) && this.useApp) {
			yoodooApp.hub_hide();
		}else{
			//yoodoo.hub.display(data);
		}
	},
	drawWidget : function(obj) {
		if (yoodoo.appFunctionExists(['widgets_set']) && this.useApp) {
			yoodooApp.widgets_set(window.JSON.stringify(obj));
		}else{
			yoodoo.hub.widgets.set(obj);
		}
	},
	dropWidget : function(obj) {
		if (yoodoo.appFunctionExists(['widgets_drop']) && this.useApp) {
			yoodooApp.widgets_drop(obj);
		}else{
			yoodoo.hub.widgets.drop(obj);
		}
	},
	drawTool : function(obj) {
		if (yoodoo.appFunctionExists(['tools_set']) && this.useApp) {
			if (typeof(obj.icon)=='object' && obj.icon!==null) {
				var tmp=$(yoodoo.e("div"));
				tmp.append(obj.icon);
				obj.icon=tmp.html();
			}
			yoodooApp.tools_set(window.JSON.stringify(obj));
		}else{
			yoodoo.hub.tools.set(obj);
		}
	},
	dropTool : function(obj) {
		if (yoodoo.appFunctionExists(['tools_drop']) && this.useApp) {
			yoodooApp.tools_drop(obj);
		}else{
			yoodoo.hub.tools.drop(obj);
		}
	},
	drawFavourite : function(obj) {
		if (yoodoo.appFunctionExists(['favourites_set']) && this.useApp) {
			yoodooApp.favourites_set(window.JSON.stringify(obj));
		}else{
			yoodoo.hub.favourites.set(obj);
		}
	},
	dropFavourite : function(obj) {
		if (yoodoo.appFunctionExists(['favourites_drop']) && this.useApp) {
			yoodooApp.favourites_drop(obj);
		}else{
			yoodoo.hub.favourites.drop(obj);
		}
	},
	showDialog:function(txt) {
		//alert(txt);
		if (yoodoo.appFunctionExists(['dialogue_show']) && this.useApp && true) {
			//if (this.appDialog===true) yoodoo.interface.hideDialog();
			if ((typeof(txt)!="string" || txt=='')) {
				yoodoo.interface.hideDialog();
			}else{
			//if (typeof(txt)=="string" && txt!='') {
				this.appDialog=true;
				yoodooApp.dialogue_show(window.JSON.stringify({
					text:txt.replace(/\&hellip;/g,'...'),
					spinner:true
				}));
			}
		}else{
			if ((typeof(txt)!="string" || txt=='')) {
				this.appDialog=false;
				yoodoo.working(false);
			}else{
				this.appDialog=true;
				yoodoo.working(true,txt);
			}
		}
	},
	hideDialog:function() {
		//alert('drop dialog');
		//if (this.appDialog===true) {
			if (yoodoo.appFunctionExists(['dialogue__hide']) && this.useApp && true) {
				yoodooApp.dialogue__hide();
				//this.appDialog=false;
			}else{
				yoodoo.working(false);
			}
				this.appDialog=false;
		//}
	}
};
