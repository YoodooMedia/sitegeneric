var yoodoo={
	siteFolder:'a4e',
    option:{
        flashMovie:{
            url:'domain:uploads/yoodoo.siteFolder/file/08_Episode_playa.swf',
            id:'Episode_playa',
            width:788,
            height:466,
            zoom:1,
			loaded:false,
            bgcolor:'#fff',
            fullscreen:'false',
            quality:'high',
            wmode:'transparent',
            scriptaccess:'always',
            allowNetworking:'all',
            version:'9.0.0',
            expressInstall:"expressInstall.swf",
            flashvars:{
            },
            ports:{
                closedDooit:'',
                closedMessages:'',
                login:'setUsername',
                logout:''
            },
            bookshelfXML:'xml/bookshelf.xml',
            object:null,
			buffer:[]
        },
        voiceoverMovie:{
            url:'domain:uploads/yoodoo.siteFolder/flash/voiceover.swf',
            id:'voiceover_playa',
            width:1,
            height:1,
            zoom:1,
            bgcolor:'#fff',
            fullscreen:'false',
            quality:'high',
            wmode:'transparent',
            scriptaccess:'always',
            allowNetworking:'all',
            version:'9.0.0',
            expressInstall:"expressInstall.swf",
            flashvars:{
            },
            object:null
        },
        introMovie:{
            url:'domain:uploads/yoodoo.siteFolder/flash/introPlaya.swf',
            id:'intro_playa',
            width:756,
            height:424,
            zoom:1,
            bgcolor:'#fff',
            fullscreen:'false',
            quality:'high',
            wmode:'transparent',
            scriptaccess:'always',
            allowNetworking:'all',
            version:'9.0.0',
            expressInstall:"expressInstall.swf",
            flashvars:{
				intro:'',
				buffer:2
            },
            object:null
        },
        helpDefaultVoiceover:'',
        yoodooPortal:{
            url:'domain:remote'
        },
        prefix:'<div class="dooitLogo"></div>',
        dooitUrl:'domain:uploads/yoodoo.siteFolder/file/', // need upload folder appended
        baseUrl:'http://www.yoodidit.co.uk/',
        fixedBaseUrl:'http://iptodomain/', // if replaced on the server, then baseUrl will be fixed to this
        buttons:{
            dooitclose:'close',
            frameclose:'Done',
            scrapbookadd:'+ scrapbook',
            dooitsave:'Done',
            playVoice:'play voiceover',
            stopVoice:'stop voiceover',
            helpbutton:'what&rsquo;s this for?',
            helpDefaultText:'Unfortunately, we don&rsquo;t have any help here at the moment'
        }
    },
    cmd:{
        bookshelfxml:{server:'xmlbookcase',flash:'setBookshelfXML',callback:'gotXML'},
        dooit:{server:'dooit',callback:'gotDooit'},
        episodedooit:{server:'dooit',callback:'gotDooit'},
        dooitsave:{server:'dooitsave',callback:'dooitSaved'},
        status:{server:'status',callback:'status'},
        scrapbook:{server:'scrapbook',callback:'gotScrapbook'},
        scrapbookremove:{server:'scrapbookremove',callback:'gotScrapbook'},
        scrapbookadd:{server:'scrapdooit',callback:'showScrapbook'},
        scrapbookadditem:{server:'scrapepisode',callback:'showScrapbook'},
        //scrapbookadd:{server:'scrapdooit',callback:'gotScrapbook'},
        //scrapbookadditem:{server:'scrapepisode',callback:'gotScrapbook'},
        changepassword:{server:'changepass',callback:'passwordChanged'},
        login:{server:'login',callback:'loginreply'},
        bookxml:{server:'xmlbook',flash:'setEpisodeXML',callback:'gotbookxml'},
        currentbook:{server:'xmlbook',flash:'setOpenBook',callback:'gotbook'},
		home:{server:'home',flash:'',callback:'dashboardreply'},
        
        wipedooit:{server:'wipedooit',callback:'nullResponse'},
        quiz:{server:'xmlquiz',flash:'setQuizXML',callback:'gotquizxml'},
        quizresults:{server:'quizresults',flash:'',callback:'gotXML'},
        commentpost:{server:'post_comment',flash:'',callback:'gotcomments'},
        commentpostadv:{server:'post_adv_message',flash:'',callback:'gotcomments'},
        commentsget:{server:'get_comments',flash:'',callback:'gotcomments'},
        earmark:{server:'earmark',flash:'',callback:'nullResponse'},
        //episodecomplete:{server:'completedepisode',flash:'',callback:'gotXML'},
        episodecomplete:{server:'completedepisode',flash:'',callback:'gotXML'},
        introText:{server:'',flash:'setIntroText',callback:''},
        setUsername:{server:'',flash:'setUsername',callback:''},
        inbox:{server:'',flash:'',callback:'displayResponse'},
        commentskeypointget:{server:'get_comments',flash:'',callback:'gotcomments'},
        startEpisode:{server:'',flash:'startEpisode',callback:'nullResponse'},
        setTab:{server:'',flash:'setActiveTab',callback:''}
        
    },
	flash:{
		getFlashURL:'http://get.adobe.com/flashplayer/',
		minimumVersion:10
	},
	site:{
		login_heading:'access your yoo<span class="doo">doo</span> content',
		welcome_title:'<div class="left">Welcome to </div><div class="yoodoo-medium left"></div>'
	},
    visitedDooits:[],
    uploadFolder:'',
    animateDuration:500,
	nextBookDelay:2000,
    //sitehash:'eEpmBDEBuj7gq1306147', // a4e
    //sitehash:'j8H6tTSCUPdWha130614', // yoodoo.biz
	log:false,
	bookshelf:[],
    sitehash:'',
    checkedDependencies:false,
    timeout:null,
	timeoutDelay:20000,
    lastLoad:'',
    loginCode:'',
    username:'',
    loggedin:false,
    days:10,
    cookieName:'yoodooUser',
    loadedScriptFiles:[],
    loadedStyleSheets:[],
    frame:null,
    container:null,
    embedObject:null,
    area:null,
    comment_id:null,
    comment_tab:0,
    bookcaseLoaded:false,
    first_login:false,
    home_screen_title:'Here\'s how your doing',
    home_progress_text:'My progress',
    home_percentage_complete:'17',
    home_percentage_text:'Seventeen percent',
    home_level_text:'Well done, you have completed the last episode',
    home_episode_text:'<p><b>Next Episode</b></p><p>Can I turn my idea into a business?</p>',
    home_left_text:'<p>Yoodoo tip of day</p><p>Do some volunteering to keep busy</p>',
    home_password_change_text:'Change my password?',
    password_updated:false,
    
    jquery:{
        url:'overlay/jquery-1-6-2-min.js',
        version:'1.6.2',
        fetched:false
    },
    swfobject:{
        jqurl:'overlay/jq-swfobject.js',
        googleurl:'overlay/swfobject.js',
        fetched:false,
        jquery:false
    },
            
    // my libraries that are required
    dependencies:[['overlay/yoodoo_versions.js','yoodoo_js_versions']],
    // the overlay stylesheets
    stylesheets:[[[['Explorer','<9'],'css/yoodoo_widget_ie8.css']],'css/yoodoo_widget.css'],
    ignoreStylesheets:['main.css','refresh.css'],
    
    visible:false,
    ready:false,
    lastHTML:'',
    init:function() {
        if (typeof(yoodooSite)!="undefined") {
			if (typeof(yoodooSite)=="string") {
				this.sitehash=yoodooSite;
			}else{
				this.sitehash=yoodooSite[0];
				this.siteFolder=yoodooSite[1];
			}
			if(/iptodomain/.test(this.option.fixedBaseUrl)) {
				var scriptTags=document.body.getElementsByTagName("SCRIPT");
				for(var t=0;t<scriptTags.length;t++) {
					if (/file\/overlay\/yoodoo\.js/.test(scriptTags[t].src)) {
						if (/^http/.test(scriptTags[t].src)) {
							var matches=scriptTags[t].src.match(/^(http:\/\/[^\/]+)/);
							yoodoo.option.baseUrl=matches[0]+"/";
						}
					}
				}
			}else{
				yoodoo.option.baseUrl=fixedBaseUrl;
			}
			yoodoo.option.flashMovie.url=yoodoo.replaceDomain(yoodoo.option.flashMovie.url);
			yoodoo.option.voiceoverMovie.url=yoodoo.replaceDomain(yoodoo.option.voiceoverMovie.url);
			yoodoo.option.introMovie.url=yoodoo.replaceDomain(yoodoo.option.introMovie.url);
			yoodoo.option.yoodooPortal.url=yoodoo.replaceDomain(yoodoo.option.yoodooPortal.url);
			yoodoo.option.dooitUrl=yoodoo.replaceDomain(yoodoo.option.dooitUrl);
			
			yoodoo.option.dooitUrl=yoodoo.option.dooitUrl.replace('yoodoo.siteFolder',yoodoo.siteFolder);
			yoodoo.option.flashMovie.url=yoodoo.option.flashMovie.url.replace('yoodoo.siteFolder',yoodoo.siteFolder);
			yoodoo.option.voiceoverMovie.url=yoodoo.option.voiceoverMovie.url.replace('yoodoo.siteFolder',yoodoo.siteFolder);
			yoodoo.option.introMovie.url=yoodoo.option.introMovie.url.replace('yoodoo.siteFolder',yoodoo.siteFolder);		
			
			yoodoo.option.flashMovie.width*=yoodoo.option.flashMovie.zoom;
			yoodoo.option.flashMovie.height*=yoodoo.option.flashMovie.zoom;
		
			this.fetchStyleSheets(this.stylesheets);
        	this.checkJquery();
		}
    },
	replaceDomain:function(u){
		u=u.replace(/domain\:/,yoodoo.option.baseUrl);
		return u;
	},
	fetchStyleSheets:function(ss) {
        for(var i=0;i<ss.length;i++) {
			if (typeof(ss[i])!="string") {
				var j=0;
				var loadthis=false;
				while(j<ss[i].length && !loadthis) {
					if (typeof(ss[i][j][0])=="string") {
						loadthis=true;
						this.loadfile(ss[i][j][0],"css");
					}else if (ss[i][j][0][0]==BrowserDetect.browser) {
						eval('loadthis=(BrowserDetect.version'+ss[i][j][0][1]+');');
						if (loadthis) this.loadfile(ss[i][j][1],"css");
					}
					j++;
				}
			}else{
            	this.loadfile(ss[i],"css");
			}
        }
	},
    checkJquery:function() {
        var required=false;
        if (typeof(jQuery)!=="undefined") {
            if (!this.jquery.fetched) {
                var v=$().jquery.split('.');
                var rv=this.jquery.version.split('.');
                while(rv.length<v.length) rv.push(0);
                while(v.length<rv.length) v.push(0);
                for(var vi=0;vi<rv.length;vi++) {
                    if (v[vi]<rv[vi]) {
                        required=true;
                        break;
                    }
                }
            }
            this.checkSwfobject();
        }else{
            required=true;
        }
        if (required && !this.jquery.fetched) {
            this.jquery.fetched=true;
            this.loadfile(this.jquery.url,"js");
        }
        if (required) setTimeout('yoodoo.checkJquery();',50);
    },
    checkSwfobject:function() {
        var required=false;
        if (this.swfobject.jquery) {
            if (typeof($.flash)!=="undefined") {
                this.checkDependencies();
            }else{
                required=true;
            }
            if (required && !this.swfobject.fetched) {
                this.swfobject.fetched=true;
                this.loadfile(this.swfobject.jqurl,"js");
            }
        }else{
            if (typeof(swfobject)!=="undefined") {
                this.checkDependencies();
            }else{
                required=true;
            }
            if (required && !this.swfobject.fetched) {
                this.swfobject.fetched=true;
                this.loadfile(this.swfobject.googleurl,"js");
            }
        }
        if (required) setTimeout('yoodoo.checkSwfobject();',50);
    },
    checkDependencies:function() {
        this.ready=true;
        for(var i=0;i<this.dependencies.length;i++) {
            var ok=false;
            eval("if (typeof("+this.dependencies[i][1]+")!=='undefined') ok=true;");
            if (!ok && !this.checkedDependencies) this.loadfile(this.dependencies[i][0],"js");
            if (!ok) this.ready=false;
        }
        this.checkedDependencies=true;
        if (!this.ready) {
            setTimeout('yoodoo.checkDependencies();',300);
        }else{
            this.loaded();
        }
    },
	fetchSiteSettings:function() {
		if (typeof(yoodoo_site_settings)!="undefined") {
			for(var k in yoodoo_site_settings) {
				if (typeof(this.site[k])!="undefined") this.site[k]=yoodoo_site_settings[k];
			}
		}
	},
    loaded:function() {
		this.fetchSiteSettings();
        this.frame=$('#yoodooWidget').get(0);
        $(this.frame).css('width',yoodoo.option.flashMovie.width+"px");
        $(this.frame).css('height',yoodoo.option.flashMovie.height+"px");
        //this.playerHolder=document.createElement("div");
        //this.playerHolder.id='yoodooPlayerHolder';
        this.yoodooVoiceoverPlayerHolder=document.createElement("div");
        this.yoodooVoiceoverPlayerHolder.id='yoodooVoiceoverPlayerHolder';
        //this.frame.appendChild(this.playerHolder);
        this.frame.appendChild(this.yoodooVoiceoverPlayerHolder);
        this.container=document.createElement("div");
        this.container.id='yoodooContainerContent';
        this.area=document.createElement("div");
        this.area.id='yoodooContainerContentArea';
       // this.whiteout=document.createElement("div");
       // this.whiteout.id='yoodooWhiteout';
        this.wait=document.createElement("div");
        this.wait.id='yoodooWait';
        $(this.wait).css("width",yoodoo.option.flashMovie.width+"px");
        $(this.wait).css("padding",((yoodoo.option.flashMovie.height-80)/2)+"px 0 "+((yoodoo.option.flashMovie.height-80)/2)+"px 0");
        //$(this.whiteout).css("width",yoodoo.option.flashMovie.width+"px");
        $(this.container).css("width",yoodoo.option.flashMovie.width+"px");
        //this.frame.appendChild(this.whiteout);
        this.frame.appendChild(this.container);
        this.frame.appendChild(this.wait);
        this.working(false);
        if (this.lastHTML!="") this.display(this.lastHTML);
		if (this.flash.minimumVersion>swfobject.getFlashPlayerVersion().major) {
			var pad=((yoodoo.option.flashMovie.height-80)/2);
			this.display('<div style="text-align:center;height:80px;padding:'+pad+'px 0 '+pad+'px 0;color:#ddd">To access the YooDoo widget you need to install at least <a href="'+this.flash.getFlashURL+'" target="_blank">Flash '+this.flash.minimumVersion+'</a></div>');
		}else{
			this.initPostResponder();
			//this.insertFlash();
			this.insertVoiceover();
			this.showLogin();
		}
    },
    removeiframe:function() {
        setTimeout("eez.removeElement('#yoodooPoster');",200);
    },
    validStylesheet:function(filename) {
        var ok=true;
        for(var ss=0;ss<this.ignoreStylesheets.length;ss++) {
            var rg=new RegExp(this.ignoreStylesheets[ss],"i");
            if (rg.test(filename)) ok=false;
        }
        return ok;
    },
    loadfile:function (filename, filetype){
		 filename=this.translate_version(filename);
         if (filetype=="js"){
          var fileref=document.createElement('script');
          fileref.setAttribute("type","text/javascript");
          if (/^http\:\/\//i.test(filename)){
            fileref.setAttribute("src", filename);
          }else{
            fileref.setAttribute("src", this.option.dooitUrl+filename);
          }
         }
         else if (filetype=="css"){
            if (this.validStylesheet(filename)) {
              var fileref=document.createElement("link");
              fileref.setAttribute("rel", "stylesheet");
              fileref.setAttribute("type", "text/css");
              if (/^http\:\/\//i.test(filename)){
                fileref.setAttribute("href", filename);
              }else{
                fileref.setAttribute("href", this.option.dooitUrl+filename);
              }
            }
         }
         if (typeof fileref!="undefined") {
             document.getElementsByTagName("head")[0].appendChild(fileref);
         }
    },
	translate_version:function(file) {
		var file_parts=file.split('/');
		var fn=file_parts.pop();
		this.console("Check version of "+fn);
		if (typeof(yoodoo_js_versions)!='undefined' && yoodoo_js_versions[fn.replace('.js','')]) {
			fn=fn+yoodoo_js_versions[fn.replace('.js','')]+'.js';
		}else if(typeof(yoodoo_css_versions)!='undefined' && yoodoo_css_versions[fn.replace('.css','')]) {
			fn=fn+yoodoo_css_versions[fn.replace('.css','')]+'.css';
		}else{
			fn=fn+'?r='+new Date().getTime();
		}
		file_parts.push(fn);
		this.console("Versioned filename: "+fn);
		return file_parts.join('/');
	},
    display:function(content) {
		var reveal=true;
		if (arguments.length>3) reveal=arguments[3];
        if (arguments.length>2 && arguments[2]) {
            var isDooit=false;
            if (arguments.length>1) isDooit=arguments[1];
            if (!isDooit) this.lastLoad='';
            var fh=this.container.clientHeight;
            var o=this.frameit(content,isDooit);
            while(this.container.childNodes.length>0) this.container.removeChild(this.container.childNodes[0]);
            if ($(this.container).css('display')=="none") {
                $(this.container).css("height","0px");
                $(this.container).css("display","block");
            }
            this.container.appendChild(o);
            if (reveal) {
				$('.overlayFooter').css("display","none");
				$(this.container).animate({height:this.option.flashMovie.height+'px'}, this.animateDuration,'swing',function() {$('.overlayFooter').fadeIn();});
			}
        }else{
            var isDooit=false;
            if (arguments.length>1) isDooit=arguments[1];
            if (!isDooit) this.lastLoad='';
            $(this.container).css("width",this.option.flashMovie.width+"px");
            var fh=this.container.clientHeight;
            if (this.ready ) {
                $(this.container).css("maxHeight",this.option.flashMovie.height+"px");
                if ($(this.container).css('display')=="none") {
                    $(this.container).html(content);
					$(this.container).find('.overlayFooter').css("display","none");
                    $(this.container).slideDown(this.animateDuration,function() {$('.overlayFooter').fadeIn();});
                    //$(this.whiteout).fadeIn();
                }else{
                    var fh=this.container.clientHeight;
                    $(this.container).css("height",fh+"px");
                    $(this.container).html(content);
                    if (reveal) {
						$(this.container).find('.overlayFooter').css("display","none");
						$(this.container).animate({height:this.option.flashMovie.height+'px'}, this.animateDuration,'swing',function() {$('.overlayFooter').fadeIn();});
					}
                }
               // $(this.whiteout).fadeIn();
               // $(this.whiteout).animate({height:this.option.flashMovie.height+'px'}, this.animateDuration);
                if (!this.visible) {
                   // $(this.whiteout).fadeIn();
                   // $(this.whiteout).animate({height:this.option.flashMovie.height+'px'}, this.animateDuration);
                    this.visible=true;
                }
                this.lastHTML=content;
            }
        }
    },
	reveal:function() {
		$('.overlayFooter').css("display","none");
		$(this.container).animate({height:this.option.flashMovie.height+'px'}, this.animateDuration,'swing',function() {$('.overlayFooter').fadeIn();});
	},
    frameit:function(ip) {
        var withFooter=true;
        if (arguments.length>1) withFooter=arguments[1];
        var ins='';
        if (typeof(ip)=='string') ins=ip;
        var op=document.createElement("div");
        var opc=document.createElement("div");
		opc.id="yoodooScrolledArea";
        $(opc).attr('style','overflow-x:none;overflow-y:auto;');
        if (ins!="") $(opc).html(ins);
        op.appendChild(opc);
        if (!withFooter) {
            var of=document.createElement("div");
            of.className="overlayFooter";
            $(of).html("<button type='button' class='done'>"+yoodoo.option.buttons.frameclose+"</button>");
            op.appendChild(of);
        	$(op).find('.overlayFooter>button.done').bind('click',function() {yoodoo.hide();});
        }
        if (typeof(ip)!='string') opc.appendChild(ip);
        $(opc).css("width",(yoodoo.option.flashMovie.width-16)+"px");
        $(opc).css("height",(yoodoo.option.flashMovie.height-40)+"px");
        $(op).css("width",(yoodoo.option.flashMovie.width-16)+"px");
        $(op).css("height",(yoodoo.option.flashMovie.height-16)+"px");
        $(op).find('.overlayFooter').css("width",(yoodoo.option.flashMovie.width-8)+"px");
        if (!withFooter) {
            $(opc).find('>div').css("zoom",yoodoo.option.flashMovie.zoom);
        }else{
            $(opc).find('form').css("zoom",yoodoo.option.flashMovie.zoom);
        }
        op.id='framed';
        return op;
    },
	scrollTo:function(obj) {
		var t=($(obj).position().top-$('.dooitBox').position().top)-100;
		$('#yoodooScrolledArea').animate({scrollTop:t});
	},
    hide:function(completed) {
        yoodoo.stopVoiceover(true);
		clearTimeout(this.voiceovertimer);
		yoodoo.showPlaya();
        var sels=$(this.container).find('select').get();
        if (sels.length>0) {
            for(var s=0;s<sels.length;s++) {
                if (typeof(sels.blockout)=="object") sels.blockout.parentNode.removeChild(sels.blockout);
                if (typeof(sels.dropdown)=="object") sels.dropdown.parentNode.removeChild(sels.dropdown);
            }
        }
        var ips=$(this.container).find('input').get();
        if (ips.length>0) {
            for(var s=0;s<sels.length;s++) {
                if (typeof(sels.listContainer)=="object") sels.listContainer.parentNode.removeChild(sels.listContainer);
            }
        }
        this.lastHTML=this.container.innerHTML;
        $(this.container).slideUp(completed);
        $(this.whiteout).slideUp();
        this.visible=false;
		this.clearFocus();
		//swfobject.getObjectById(yoodoo.option.flashMovie.id).focus();
		//this.option.flashMovie.object.focus();
    },
    show:function() {
        $(this.container).slideDown();
        $(this.whiteout).slideDown();
        this.visible=true;
    },
    insertFlash:function() {
        this.playerHolder=document.createElement("div");
        this.playerHolder.id='yoodooPlayerHolder';
        this.frame.insertBefore(this.playerHolder,this.frame.childNodes[0]);
        if (this.swfobject.jquery) {
            this.option.flashMovie.object=$('#yoodooPlayerHolder');
            this.option.flashMovie.object.flash({
                swf:this.option.flashMovie.url,
                width:this.option.flashMovie.width,
                height:this.option.flashMovie.height,
                flashvars:this.option.flashMovie.flashvars,
                allowscriptaccess:this.option.flashMovie.scriptaccess,
                allowfullscreen:this.option.flashMovie.fullscreen,
                bgcolor:this.option.flashMovie.bgcolor,
                quality:this.option.flashMovie.quality,
                wmode:this.option.flashMovie.wmode,
                menu: "false",
                allowNetworking:'all',
                id: this.option.flashMovie.id,
                name: this.option.flashMovie.id
            });
        }else{
            var params = {
                allowscriptaccess:this.option.flashMovie.scriptaccess,
                allowfullscreen:this.option.flashMovie.fullscreen,
                bgcolor:this.option.flashMovie.bgcolor,
                quality:this.option.flashMovie.quality,
                wmode:this.option.flashMovie.wmode,
                menu: "false",
                allowNetworking:'all'
            };
            var attributes = {
              id: this.option.flashMovie.id,
              name: this.option.flashMovie.id
            };
            
            swfobject.embedSWF(this.option.flashMovie.url, "yoodooPlayerHolder",this.option.flashMovie.width,this.option.flashMovie.height,this.option.flashMovie.version,this.option.flashMovie.expressInstall, this.option.flashMovie.flashvars, params, attributes,yoodoo.flashLoaded);
        }
    },
    insertVoiceover:function() {
        if (this.swfobject.jquery) {
            this.option.voiceoverMovie.object=$('#yoodooVoiceoverPlayerHolder');
            this.option.voiceoverMovie.object.flash({
                swf:this.option.voiceoverMovie.url,
                width:this.option.voiceoverMovie.width,
                height:this.option.voiceoverMovie.height,
                flashvars:this.option.voiceoverMovie.flashvars,
                allowscriptaccess:this.option.voiceoverMovie.scriptaccess,
                allowfullscreen:this.option.voiceoverMovie.fullscreen,
                bgcolor:this.option.voiceoverMovie.bgcolor,
                quality:this.option.voiceoverMovie.quality,
                wmode:this.option.voiceoverMovie.wmode,
                menu: "false",
                allowNetworking:'all',
                id: this.option.voiceoverMovie.id,
                name: this.option.voiceoverMovie.id
            
            });
        }else{
            var params = {
                allowscriptaccess:this.option.voiceoverMovie.scriptaccess,
                allowfullscreen:this.option.voiceoverMovie.fullscreen,
                bgcolor:this.option.voiceoverMovie.bgcolor,
                quality:this.option.voiceoverMovie.quality,
                wmode:this.option.voiceoverMovie.wmode,
                menu: "false",
                allowNetworking:'all'
            };
            var attributes = {
              id: this.option.voiceoverMovie.id,
              name: this.option.voiceoverMovie.id
            };
            
            swfobject.embedSWF(this.option.voiceoverMovie.url, "yoodooVoiceoverPlayerHolder",this.option.voiceoverMovie.width,this.option.voiceoverMovie.height,this.option.voiceoverMovie.version,this.option.voiceoverMovie.expressInstall,this.option.voiceoverMovie.flashvars, params, attributes,yoodoo.voiceoverLoaded);
        }
    },
    
    insertIntroMovie:function() {
        if (this.swfobject.jquery) {
            this.option.introMovie.object=$('#yoodooIntroPlayerHolder');
            this.option.introMovie.object.flash({
                swf:this.option.introMovie.url,
                width:this.option.introMovie.width,
                height:this.option.introMovie.height,
                flashvars:this.option.introMovie.flashvars,
                allowscriptaccess:this.option.introMovie.scriptaccess,
                allowfullscreen:this.option.introMovie.fullscreen,
                bgcolor:this.option.introMovie.bgcolor,
                quality:this.option.introMovie.quality,
                wmode:this.option.introMovie.wmode,
                menu: "false",
                allowNetworking:'all',
                id: this.option.introMovie.id,
                name: this.option.introMovie.id
            
            });
        }else{
            var params = {
                allowscriptaccess:this.option.introMovie.scriptaccess,
                allowfullscreen:this.option.introMovie.fullscreen,
                bgcolor:this.option.introMovie.bgcolor,
                quality:this.option.introMovie.quality,
                wmode:this.option.introMovie.wmode,
                menu: "false",
                allowNetworking:'all'
            };
            var attributes = {
              id: this.option.introMovie.id,
              name: this.option.introMovie.id
            };
            
            swfobject.embedSWF(this.option.introMovie.url, "yoodooIntroPlayerHolder",this.option.introMovie.width,this.option.introMovie.height,this.option.introMovie.version,this.option.introMovie.expressInstall,this.option.introMovie.flashvars, params, attributes,yoodoo.introLoaded);
        }
    },
    introLoaded:function() {
		yoodoo.working(false);
	},
    
    dooitFiles:[],
    isLoadedScript:function(s) {
        for(var i=0;i<yoodoo.loadedScriptFiles.length;i++) {
            if (yoodoo.loadedScriptFiles[i]==s) return true;
        }
        return false;
    },
    isLoadedStyle:function(s) {
        for(var i=0;i<yoodoo.loadedStyleSheets.length;i++) {
            if (yoodoo.loadedStyleSheets[i]==s) return true;
        }
        return false;
    },
    getScripts:function(s) {
        var scripts=[];
        var r=/<script.*?<\/script>/mig;
        var src=/src=["|'](.*?)["|']/mi;
        var c=s.match(r);
        if (c) {
            for(var i=0;i<c.length;i++) {
                var u=c[i].match(src);
                if (u) {
                    scripts.push(u[1]);
                }else{
                    scripts.push(c[i]);
                }
            }
        }
        return scripts;
    },
    getStyleSheets:function(s) {
        var sheets=[];
        var r=/<link[^>]*?>/mig;
        var src=/href=["|'](.*?)["|']/mi;
        var c=s.match(r);
        if (c) {
            for(var i=0;i<c.length;i++) {
                var u=c[i].match(src);
                if (u) {
                    sheets.push(u[1]);
                }
            }
        }
        return sheets;
    },
    getStyleTags:function(s) {
        var sheets=[];
        var c=/<style.*?<\/style>/mig;
        if (c) {
            for(var i=0;i<c.length;i++) {
                var html=c[i].replace(/^<style[^>]*>/i,'').replace(/<\/style>$/i,'');
                sheets.push(html);
            }
        }
        return sheets;
    },
    callFlash:function(f,p) {
        if (yoodoo.swfobject.jquery) {
            yoodoo.option.flashMovie.object.flash(
                function() {
					var cmd='this.'+f+"("+((p==null)?"":"p")+");";
					yoodoo.console(cmd);
                    try{
                        eval(cmd);
                    }catch (err){
                    }
                }
            )
        }else{
            var cb="swfobject.getObjectById(yoodoo.option.flashMovie.id)."+f+"("+((p==null)?"":"p")+");";
					yoodoo.console(cb);
            try{
                eval(cb);
            }catch (err){
            }
        }
    },
	playaObject:function() {
		return swfobject.getObjectById(yoodoo.option.flashMovie.id);
	},
    showLogin:function() {
        var o='<div class="login"><nobr>'+this.site.login_heading+'</nobr><h2>Login</h2>';
        o+='<div><div>Username</div><input type="text" name="username" /></div>';
        o+='<div><div>Password</div><input type="password" name="password" /></div>';
        o+='<center><button type="button">login</button></center>';
        o+='<div class="error"></div></div>';
        this.display(o);
        $(this.frame).find('.login button').bind('click',function() {yoodoo.tryLogin();});
        $(this.frame).find('.login input[name=username]').bind('keyup',function(e) {if (e.which==13) yoodoo.tryLogin();});
        $(this.frame).find('.login input[name=password]').bind('keyup',function(e) {if (e.which==13) yoodoo.tryLogin();});
    },
    tryLogin:function() {
        var un=$(yoodoo.frame).find('.login input:first').val();
        var pw=$(yoodoo.frame).find('.login input:last').val();
        if (un=='' || pw=='') {
            var err=$(yoodoo.frame).find('.login .error');
            err.html('You need to provide both details');
            err.slideDown(yoodoo.animateDuration);
            err.fadeIn(yoodoo.animateDuration);
            yoodoo.timer=setTimeout('yoodoo.hideError();',3000);
        }else{
            yoodoo.login(un,pw);
        }
    },
    welcome:function() {
        var o='<div class="welcome">';
        o+='<button type="button" class="logout medium right">Logout</button><button type="button" class="green medium right" id="dashboardButton" style="display:none">Dashboard</button><button type="button" id="changepassword" class="green medium right">'+this.home_password_change_text+'</button>';
        o+='<div class="yoodoo-title">'+this.site.welcome_title+'</div><h2 class="clear">'+this.home_screen_title+'</h2>';
        o+='<div class="welcomeContent" style="display:'+(yoodoo.password_updated?'block':'none')+'">';
        o+='<div class="half"><h3>'+this.home_progress_text+'</h3>';
        o+='<div id="progress"><div class="progressBack"><div class="progress" style="width:'+(this.home_percentage_complete*2)+'px"></div></div><div class="progressText">'+this.home_percentage_complete+'</div>';
        o+='<div class="clear"></div>';
        o+='<div>'+this.home_level_text+'</div></div>';
        //o+='<div class="episodeText">'+this.home_episode_text+'<button type="button" class="go"></button></div>';
        o+='<div class="episodeText">'+this.home_episode_text+'</div>';
        //o+='<center><button type="button" id="changepassword" class="medium">'+this.home_password_change_text+'</button></center>';
        o+='</div>';
        o+='<div class="half"><div class="tip"><div>'+this.home_left_text+'</div></div>';
        o+='</div>';
        o+='<center><button type="button" id="continue" class="green reversed"'+(yoodoo.bookcaseLoaded?'':' style="display:none"')+'>Continue</button>';
		if (!yoodoo.bookcaseLoaded) o+='<div id="xmlwaiting">Loading your journey, please wait...</div>';
		o+='</center>';
        o+='</div>';
        o+='<div style="clear:both;display:'+(yoodoo.password_updated?'none':'block')+'" id="passwordChanger"><h3>Change your details</h3>';
        if (!yoodoo.password_updated) o+='<div class="alert">You must change your password before continuing, also supply an email address if you can.</div>';
        o+='<div class="clear inputline"><label>your current password</label><input type="password" id="oldpassword" /></div>';
        o+='<div class="clear inputline"><label>your new password</label><input type="password" id="newpassword" /></div>';
        o+='<div class="clear inputline"><label>confirm new password</label><input type="password" id="newpasswordagain" /></div>';
        o+='<div class="clear inputline"><label>email address</label><input type="text" id="emailaddress" /></div>';
        o+='<div class="error">&nbsp;</div>';
        o+='<button type="button" id="updatePassword" class="green" style="margin-left:250px">change</button></div>';
        o+='<div class="messenger"></div>';
        this.display(o);
        $(yoodoo.frame).find('.welcome').css('zoom',yoodoo.option.flashMovie.zoom);
        $(yoodoo.frame).find('#continue').bind('click',function() {yoodoo.hide();});
        if (!yoodoo.password_updated) {
			$(yoodoo.frame).find('#changepassword').css('display','none');
            $(yoodoo.frame).find('#continue').fadeOut(yoodoo.animateDuration);
            $(yoodoo.frame).find('#cancelPassword').css('display','none');
        }
        $(yoodoo.frame).find('#changepassword, #dashboardButton').bind('click',function() {
            var target=$(yoodoo.frame).find('#passwordChanger');
            if (target.css("display")=="none") {
                $(this).fadeOut('fast',function() {$(yoodoo.frame).find('#dashboardButton').fadeIn();});
                target.slideDown(yoodoo.animateDuration);
                $(yoodoo.frame).find('.welcomeContent').slideUp(yoodoo.animateDuration);
                
            }else{
                $(yoodoo.frame).find('#dashboardButton').fadeOut('fast',function() {$(yoodoo.frame).find('#changepassword').fadeIn();});
                target.slideUp(yoodoo.animateDuration);
                $(yoodoo.frame).find('.welcomeContent').slideDown(yoodoo.animateDuration);
            }
        });
        $(yoodoo.frame).find("button.go").bind("click",function() {
            yoodoo.hide();
        });
        $(yoodoo.frame).find('button.logout').bind("click",function() {
            yoodoo.logout();
        });
        $(yoodoo.frame).find('#updatePassword').bind("click",function() {
            var em=$(yoodoo.frame).find('#emailaddress').val();
            var opw=$(yoodoo.frame).find('#oldpassword').val();
            var npw=$(yoodoo.frame).find('#newpassword').val();
            var npwc=$(yoodoo.frame).find('#newpasswordagain').val();
            var valid=/^[a-z0-9]{6,}/i.test(npw);
            if (!valid || npw!=npwc || opw=='') {
                var err=$(yoodoo.frame).find('.welcome .error');
                if (npw!=npwc) {
                    err.html('Your new new password does not match the confirmation');
                }else{
                    err.html('Your password must 6 or more letters and/or numbers');
                }
                err.fadeIn(yoodoo.animateDuration);
                yoodoo.timer=setTimeout('yoodoo.hideError();',3000);
            }else{
                yoodoo.changePassword(yoodoo.username,em,opw,npw);
            }
        });
    },
    hideError:function() {
        $(this.frame).find('.error').fadeOut();
    },
    logout:function() {
        this.loggedin=false;
        this.showLogin();
		this.option.flashMovie.loaded=false;
		$('#'+this.option.flashMovie.id).remove();
        //if (yoodoo.option.flashMovie.ports.logout!="") this.callFlash(yoodoo.option.flashMovie.ports.logout,'loggedout');
    },
    /*jsonGet:function(u) {
        var hd=document.getElementsByTagName("HEAD")[0];
        var scripts=document.getElementsByTagName("SCRIPT");
        var scr = document.createElement('script');
        scr.id="script-"+scripts.length;
        scr.type = 'text/javascript';
        scr.src = u+"&id="+scr.id+"&r="+Math.random()+"&user="+this.loginCode;
        hd.appendChild(scr);
    },
    removeJSON:function(id) {
        var hd=document.getElementsByTagName("HEAD")[0];
        hd.removeChild(obj('#'+id,hd));
    },*/
    working:function(on) {
		var txt='';
		if (arguments.length>1) txt=arguments[1];
		if (on) $(this.wait).html(txt);
        $(this.wait).css('display',on?'block':'none');
		if (!on && this.container!==null && $(this.container).css("display")=="block") this.clearFocus();
		//if (!on) alert("Clear");
		//if (!on) this.clearFocus();
    },
	clearFocus:function() {
		if (yoodoo.option.flashMovie.loaded) {
			window.focus();
			var f=swfobject.getObjectById(yoodoo.option.flashMovie.id);
			if (f) {
				f.tabIndex=0;
				//$(f).css("visibility","visible");
				f.focus();
			}
		}
	},
    sendingU:null,
    sendingF:null,
    sendingFr:null,
    pause:false,
    sendPost:function(u,f) {
        this.pause=false;
        f.userhash=this.loginCode;
        f.sitehash=this.sitehash;
		yoodoo.console(f);
        if (u===null) u=this.option.yoodooPortal.url;
		u+='?r='+new Date().getTime()
        if (arguments.length>2) this.pause=arguments[2];
        if (this.pause) f.callback='yoodoo.console';
        this.sendingU=u;
        this.sendingF=f;
        this.sendingFr = document.createElement('iframe');
        this.sendingFr.id="yoodooPoster";
        this.sendingFr.loaded=false;
        //this.pause=false;
        document.body.appendChild(this.sendingFr);
        yoodoo.writeIframe();
        /*if (this.pause) {
            clearTimeout(this.timeout);
            this.timeout=null;
        }*/
    },
    writeIframe:function() {
        if (!this.sendingFr.loaded) {
            this.sendingFr.loaded=true;
            var doc = this.sendingFr.document;
            if(this.sendingFr.contentDocument) {
                doc = this.sendingFr.contentDocument; // For NS6
            } else if(this.sendingFr.contentWindow) {
                doc = this.sendingFr.contentWindow.document; // For IE5.5 and IE6
            } else if(this.sendingFr.document) {
                doc = this.sendingFr.document; // default*/
            }
            if (doc!==null) {
                doc.open();
                var op='';
                op+="<html><head></head><body><form id='yoodooPost' action='"+this.sendingU+"' method='POST'>";
                for(k in this.sendingF) {
                    if (/^EF/.test(k)) op+="<input type='text' name='fields[]' value='"+k.replace(/^EF/,'')+"' />";
                    op+="<textarea name='"+k+"'>"+this.sendingF[k]+"</textarea>";
                }
                op+="</form>";
                if (!this.pause) op+="<script type='text/javascript'>document.getElementById('yoodooPost').submit();</script>";
                op+="</body></html>";
                doc.writeln(op);
                doc.close();
                this.timeout=setTimeout('yoodoo.cancelPost()',this.timeoutDelay);
                $(this.sendingFr).bind('load',function() {
                    var frw=yoodoo.sendingFr.contentWindow;
                    if (frw.postMessage) {
                        frw.postMessage('completed',yoodoo.option.baseUrl);
                    }else{
                        if (frw.completed) {
                            frw.completed();
                        }
                    }
                });
            }
        }
    },
    cancelPost:function() {
		if (!this.pause) {
			$(this.sendingFr).unbind('load');
			clearTimeout(this.timeout);
			this.timeout=null;
			if (this.sendingFr.parentNode) this.sendingFr.parentNode.removeChild(this.sendingFr);
			this.working(true,'<div class="oops">Oops, there seems to have been a problem. Maybe try again.<br /><button class="green" type="button">OK</button></div>');
			$(this.wait).find('button.green').bind("click",function() {
				$(this).blur();
				yoodoo.working(false);
				yoodoo.clearFocus();
			});
			this.hide();
		}
    },
    postReply:function(e) {
        clearTimeout(yoodoo.timeout);
        yoodoo.timeout=null;
        var parts=e.data.split('|');
        if (parts.length>1) {
            var rg='^'+parts[0].replace(/\./g,'\\.')+'\\|';
            var caller=new RegExp(rg);
            var op=e.data.replace(caller,'');
            eval(parts[0]+"('"+op.replace(/'/g,'\\\'')+"');");
        }else if(/^error/.test(parts[0])){
            yoodoo.showLogin();
        }
        var fr=$('#yoodooPoster').get();
        for(var i=fr.length-1;i>=0;i--) {
            if (fr[i].contentWindow==e.source) fr[i].parentNode.removeChild(fr[i]);
        }
		yoodoo.clearFocus();
    },
    initPostResponder:function() {
        if (window.attachEvent) {
            window.attachEvent('onmessage',yoodoo.postReply);
        }else{
            window.addEventListener('message',yoodoo.postReply,false);
        }
    },
    flashReady:function() {
        yoodoo.option.flashMovie.loaded=true;
		yoodoo.checkFlashLoaded();
    },
    checkFlashLoaded:function() {
        if (yoodoo.option.flashMovie.loaded) {
       		if (yoodoo.loggedin) yoodoo.callXML();
			//if ($('#continue').css("display")=="none") $('#continue').fadeIn();
		}
    },
    decodeHTMLResponse:function(html) {
        html=html.replace(/[\n\r]/g,'');
        html=html.replace(/&lt;/g,'<');
        html=html.replace(/&gt;/g,'>');
        html=html.replace(/&amp;/g,'&');
        return html;
    },
    setIntroText:function(txt) {
        yoodoo.callFlash(yoodoo.cmd.introText.flash,txt);
    },
    setUsername:function(txt) {
        yoodoo.callFlash(yoodoo.cmd.setUsername.flash,txt);
    },
    
    
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Command function
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
    
    callXML:function() {
        var params={
            cmd:yoodoo.cmd.bookshelfxml.server,
            callback:'yoodoo.'+yoodoo.cmd.bookshelfxml.callback
        };
        yoodoo.sendPost(null,params);
    },
    gotXML:function(html) {
        this.working(false);
		this.bookcaseLoaded=true;
        var txt=yoodoo.decodeHTMLResponse(html);
        yoodoo.callFlash(yoodoo.cmd.bookshelfxml.flash,txt);
        yoodoo.callFlash(yoodoo.cmd.introText.flash,yoodoo.flash_message);
		yoodoo.console(this.bookshelf);
		if ($('#xmlwaiting').css('display')!="none") $('#xmlwaiting').slideUp(1000,function() {
			if ($('button#continue').css("display")=="none") $('button#continue').fadeIn();
		});
    },
	nextBook:function() {
		setTimeout("yoodoo.callFlash('openNextBook',null);",this.nextBookDelay);
	},
    getbook:function() {
        var params={
            cmd:yoodoo.cmd.currentbook.server,
            callback:'yoodoo.'+yoodoo.cmd.currentbook.callback
        };
        yoodoo.sendPost(null,params);
    },
    getbookxml:function(book) {
        var params={
            cmd:yoodoo.cmd.bookxml.server,
            book:book,
            callback:'yoodoo.'+yoodoo.cmd.bookxml.callback
        };
        yoodoo.sendPost(null,params);
    },
    gotbook:function(r) {
        yoodoo.callFlash(yoodoo.cmd.currentbook.flash,yoodoo.decodeHTMLResponse(r));
    },
    gotbookxml:function(r) {
		$('#insertText').val(yoodoo.decodeHTMLResponse(r));
        yoodoo.callFlash(yoodoo.cmd.bookxml.flash,yoodoo.decodeHTMLResponse(r));
    },
    getQuizXML:function(quiz) {
        var params={
            cmd:yoodoo.cmd.quiz.server,
            quiz:quiz,
            callback:'yoodoo.'+yoodoo.cmd.quiz.callback
        };
        yoodoo.sendPost(null,params);
    },
    gotquizxml:function(r) {
        yoodoo.callFlash(yoodoo.cmd.quiz.flash,yoodoo.decodeHTMLResponse(r));
    },
    getStatus:function() {
        var params={
            cmd:yoodoo.cmd.status.server,
            callback:'yoodoo.'+yoodoo.cmd.status.callback
        }
        yoodoo.sendPost(null,params);
    },
    status:function(r) {
        if (/\|/.test(r)) {
            var prts=r.split('|');
            r=prts[0];
            this.option.uploadFolder=prts[1];
            this.option.dooitUrl+=this.option.uploadFolder+'/';
        }
        if (r=="true") {
            this.loggedin=true;
            this.callXML();
            if (yoodoo.option.flashMovie.ports.login!="") this.callFlash(yoodoo.option.flashMovie.ports.login,yoodoo.username);
        }else{
            this.loggedin=false;
            this.showLogin();
            if (yoodoo.option.flashMovie.ports.logout!="")  this.callFlash(yoodoo.option.flashMovie.ports.logout,'loggedout');
        }
    },
    showEpisodeDooit:function(id) {
        yoodoo.working(true,'Fetching your Doo-it...');
        if (yoodoo.loggedin) {
            if (yoodoo.lastLoad==id) {
                yoodoo.show();
            }else{
                yoodoo.lastLoad=id;
                var params={
                    cmd:yoodoo.cmd.episodedooit.server,
                    dooit:id,
                    callback:'yoodoo.'+yoodoo.cmd.episodedooit.callback
                };
                yoodoo.sendPost(null,params);
            }
        }
    },
	loadDooit:0,
    showDooit:function(id) {
        if (yoodoo.loggedin) {
            yoodoo.working(true,'Fetching your Doo-it...');
            if (yoodoo.lastLoad==id) {
                yoodoo.show();
                yoodoo.working(false);
            }else{
                if (typeof(dooit)!="undefined") dooit.dependenciesChecked=false;
				yoodoo.loadDooit=id;
                var params={
                    cmd:yoodoo.cmd.dooit.server,
                    dooit:id,
                    callback:'yoodoo.'+yoodoo.cmd.dooit.callback
                };
                yoodoo.sendPost(null,params);
            }
        }
    },
    dooitVisited:function(id) {
        for(var i=0;i<this.visitedDooits.length;i++) {
            if (this.visitedDooits[i]==id) return true;
        }
        return false;
    },
	hidePlaya:function() {
		yoodoo.callFlash('suspendUI',null);
	},
	showPlaya:function() {
		yoodoo.callFlash('unsuspendUI',null);
	},
    gotDooit:function(html) {
		if (dooit!=undefined) dooit.finished=function(){return true;};
        if (/^error/.test(html)) {
            this.showLogin();
        }else{
			yoodoo.hidePlaya();
            this.lastLoad=this.loadDooit;
            this.playVoice=!this.dooitVisited(this.lastLoad);
            if (this.playVoice) this.visitedDooits.push(this.lastLoad);
            
            $('#insertText').val(html);
            while(yoodoo.dooitFiles.length>0) {
                var re=yoodoo.dooitFiles.pop();
                re.parentNode.removeChild(re);
            }
            html=yoodoo.decodeHTMLResponse(html);
            var r=/<form name=\WexerciseForm.*<\/form>/mi;
            var c=html.match(r);
            if (c) {
                c=c[0].replace(/<div id=\Wview_exercise_controls.*<\/div>/mi,'');

                c+="<div class='clear'></div>";
                c+="<div class='overlayFooter' style='width:"+(yoodoo.option.flashMovie.width-8)+"px'><div style='position:relative'>";
                c+="<button type='button' id='saveDooit' class='done'>"+yoodoo.option.buttons.dooitsave+"</button>";
		c+="<div class='finishCheck'>You haven't yet finished.<br /><a href='javascript:void(0);'>Leave anyway</a><br /><a href='javascript:void(0);'>Stay for the moment</a></div>";
                c+="<div class='dooitclosewarning'><a href='javascript:void(0)' class='closelink'>close without saving</a> <a href='javascript:void(0)' class='savelink'>save and close</a> <a href='javascript:void(0)' class='cancellink'>cancel</a></div>";
                c+="<button type='button' class='hide'>"+yoodoo.option.buttons.dooitclose+"</button>";
                c+="<button type='button' id='scrapbookadd'>"+yoodoo.option.buttons.scrapbookadd+"</button>";
                c+="<div class='yoodoohelp' ></div>";
                c+="<button type='button' id='helpbutton'>"+yoodoo.option.buttons.helpbutton+"</button>";
                c+="<button type='button' id='voiceoverbutton'>"+(this.playVoice?yoodoo.option.buttons.stopVoice:yoodoo.option.buttons.playVoice)+"</button>";
		c+="<button type='button' id='dooitExport' style='display:none'>export</button>";
                c+="</div></div>";
                var dooitContent=c;
                dooitContent=dooitContent.replace(/<form name/gi,'<form onsubmit="return false;" name');
                dooitContent=dooitContent.replace(/<script.+?<\/script>/gi,'');
                dooitContent=dooitContent.replace(/<style.+?<\/style>/gi,'');
        dooitContent=dooitContent.replace(/&br;/g,'\n');
                yoodoo.display("<div class='dooitBox'>"+yoodoo.option.prefix+"<div>"+dooitContent+"<div style='clear:both'></div></div></div>",true,true,false);
                $(yoodoo.frame).find('#saveDooit').bind('click',function() {
					$(yoodoo.container).find('.dooitclosewarning').fadeOut(yoodoo.animateDuration);
					if (dooit.finishable()) {
				dooit.leave();
                   		yoodoo.saveDooit();
					}else{
						$(yoodoo.container).find('.finishCheck').fadeIn(yoodoo.animateDuration);
					}
				});
                $(yoodoo.frame).find('#scrapbookadd').bind('click',yoodoo.scrapbookAdd);
				
				var f=this.loadLinkedFiles(c.replace(/&br;/g,''));
				for(var ff=0;ff<f.length;ff++) yoodoo.dooitFiles.push(f[ff]);
				
                this.helptext=(typeof(helptext)!="undefined")?helptext:yoodoo.option.buttons.helpDefaultText;
                
                this.dooittitle=(typeof(dooittitle)!="undefined")?dooittitle:'';
                this.dooitteaser=(typeof(dooitteaser)!="undefined")?dooitteaser:'';
                
                var hb=$(this.container).find('#helpbutton').get(0);
                hb.bubble=$(this.container).find('.yoodoohelp').get(0);
                $(hb).css('display',(this.helptext=='')?'none':'block');
                hb.bubble.innerHTML=this.helptext;
                this.voiceoverfile=(typeof(voiceoverfile)!="undefined")?voiceoverfile:yoodoo.option.helpDefaultVoiceover;
                
                $(hb).bind('mouseover',function() {
                    $(this.bubble).css('left',(this.offsetLeft-1)+"px");
                    $($(this).get(0).bubble).fadeIn(yoodoo.animateDuration)
                });
                $(hb).bind('mouseout',function() {
                    $($(this).get(0).bubble).fadeOut(yoodoo.animateDuration)
                });
                $(this.frame).find('button.hide').bind('click',function() {
                    var dial=$(yoodoo.container).find('.dooitclosewarning');
                    dial.css('left',(this.offsetLeft-1)+"px");
                    dial.fadeIn(yoodoo.animateDuration);
					$(yoodoo.container).find('.finishCheck').fadeOut(yoodoo.animateDuration);
                });
                $(this.container).find('a.savelink').bind("click",function() {
					$(yoodoo.container).find('.dooitclosewarning').fadeOut(yoodoo.animateDuration);
					if (dooit.finishable()) {
						dooit.leave();
                   				yoodoo.saveDooit();
					}else{
						$(yoodoo.container).find('.finishCheck').fadeIn(yoodoo.animateDuration);
					}
					$(this).blur();
                });
				var doneLinks=$(this.container).find('.finishCheck a').get();
				$(doneLinks[0]).bind("click",function() {
					$(yoodoo.container).find('.finishCheck').fadeOut(yoodoo.animateDuration);
					dooit.leave();
					yoodoo.saveDooit();
				});
				$(doneLinks[1]).bind("click",function() {
					$(yoodoo.container).find('.finishCheck').fadeOut(yoodoo.animateDuration);
				});
                $(this.container).find('a.closelink').bind("click",function() {
                    $(this.parentNode).css('display','none');
                    yoodoo.stopVoiceover();
					$(this).blur();
			dooit.leave();
                    yoodoo.hide();
                });
                $(this.container).find('a.cancellink').bind("click",function() {
					$(this).blur();
                    $(this.parentNode).fadeOut(yoodoo.animateDuration);
                });
		if(this.voiceoverfile!=null && this.voiceoverfile!="") {
		        $(this.frame).find('#voiceoverbutton').bind("click",function() {
		            if (yoodoo.playVoice) {
		                yoodoo.stopVoiceover(true);
		                $(this).fadeOut();
		            }else{
		                yoodoo.playVoice=!yoodoo.playVoice;
		                yoodoo.startVoiceover(true);
		                $(this).fadeOut();
		            }
		        });
		}else{
			$(this.frame).find('#voiceoverbutton').css("display","none");
		}
		$(this.frame).find('#dooitExport').bind("click",function() {
			yoodoo.xport();
		});
                yoodoo.runInitThis();
            }
        }
    },
	
	xport:function() {
		dooit.xport();
	},
	setExport:function() {
		$(this.frame).find('#dooitExport').fadeIn();
	},
	dropExport:function() {
		$(this.frame).find('#dooitExport').css("display","none");
	},
	getCSV:function(title,message,filename,csv) {
		var exwin=window.open("","csvExport","width=400,height=100,location=0,menubar=0,resizable=0,status=0,toolbar=0,scrollbars=0");
		exwin.document.open("text/html");
		exwin.document.write("<html><head><title>"+title+"</title></head><body style='padding:0;margin:0' onload='self.focus();document.getElementById(\"getCSV\").submit()'><div style='position:fixed;width:100%;height:100%;background:#1a2d48;color:#fff'><a href='javascipt:void(0)' onclick='window.close()' style='color:#fff'>close</a><div style='margin:10px 0 0 0;text-align:center;'>"+message+"</div></div><form style='visibility:hidden' action='"+yoodoo.option.baseUrl+"csvDownload.php' method='POST' id='getCSV'><textarea name='csv'>"+csv+"</textarea><input type='hidden' name='filename' value='"+filename+"' /></form></body></html>");
		exwin.document.close();
	},
	voiceFinished:function() {
		yoodoo.console("Voiceover finished");
	},
	loadLinkedFiles:function(c) {
		var files=[];
		var scripts=yoodoo.getScripts(c);
		var hd=document.getElementsByTagName("HEAD")[0];
		var content=/^[^>]*>(.+)<[^>]*>$/mi;
		for(var i=0;i<scripts.length;i++) {
			if (/^<script/i.test(scripts[i])) {
				var myscript=scripts[i].match(content);
				/*if (/\$\(/.test(myscript[1])) {
					myscript[1]=myscript[1].replace(/\$\(/g,'obj(');
				}else{*/
				myscript[1]=myscript[1].replace("$('finishButton').style.display = (canFinish)?'block':'none';","");
					var scr = document.createElement('script');
					scr.type = 'text/javascript';
					scr.text = myscript[1];
					//yoodoo.dooitFiles.push(scr);
					files.push(scr);
					hd.appendChild(scr);
			}else{
				if (!yoodoo.isLoadedScript(scripts[i])) {
					var scr = document.createElement('script');
					scr.type = 'text/javascript';
					if (/^http\:\/\//i.test(scripts[i])) {
						scr.src = scripts[i];
					}else if(/^\//.test(scripts[i])) {
						scr.src = yoodoo.option.baseUrl+this.translate_version(scripts[i]);
					}else{
						scr.src = yoodoo.option.dooitUrl+this.translate_version(scripts[i]);
					}
					//yoodoo.dooitFiles.push(scr);
					files.push(scr);
					hd.appendChild(scr);
					yoodoo.loadedScriptFiles.push(scripts[i]);
				}
			}
		}


		var sheets=yoodoo.getStyleSheets(c);
		for(var i=0;i<sheets.length;i++) {
			if (!yoodoo.isLoadedStyle(sheets[i]) && yoodoo.validStylesheet(sheets[i])) {
				var myscript=sheets[i];
				var scr = document.createElement('link');
				scr.rel = 'stylesheet'
				scr.type = 'text/css'
				if (/^http\:\/\//i.test(sheets[i])) {
					scr.href = sheets[i];
				}else{
					scr.href = yoodoo.option.dooitUrl+sheets[i];
				}
				//yoodoo.dooitFiles.push(scr);
				files.push(scr);
				hd.appendChild(scr);
				yoodoo.loadedStyleSheets.push(sheets[i]);
			}
		}
		var styles=yoodoo.getStyleTags(c);
		for(var i=0;i<styles.length;i++) {
			var scr = document.createElement('style');
			scr.type='text/css';
			scr.innerHTML=styles[i];
			//yoodoo.dooitFiles.push(scr);
			files.push(scr);
			hd.appendChild(scr);
		}
		return files;
	},
	displayDooit:function() {
        this.working(false);
		this.reveal();
        if (this.voiceoverfile!="") this.voiceovertimer=setTimeout('yoodoo.startVoiceover(false)',2000);
	},
    runInitThis:function() {
        setTimeout("initThis();",400);
    },
	console:function(txt) {
		if (typeof(console)!="undefined" && this.log && typeof(console.log)!="undefined") console.log(txt);
	},
    startVoiceover:function(forced) {
        if (yoodoo.voiceoverfile!="" && (forced || this.playVoice)) {
            if(yoodoo.swfobject.jquery) {
                yoodoo.option.voiceoverMovie.object.flash(function() {this.loadAndPlay(yoodoo.voiceoverfile);});
            }else{
                swfobject.getObjectById(yoodoo.option.voiceoverMovie.id).loadAndPlay(yoodoo.voiceoverfile);
            }
        }
    },
    stopVoiceover:function() {
		clearTimeout(yoodoo.voiceovertimer);
		yoodoo.voiceovertimer=null;
        if (yoodoo.voiceoverfile!="") {
            if(yoodoo.swfobject.jquery) {
                yoodoo.option.voiceoverMovie.object.flash(function() {this.PauseVoiceover('');});
            }else{
                swfobject.getObjectById(yoodoo.option.voiceoverMovie.id).PauseVoiceover(yoodoo.voiceoverfile);
            }
        }
    },
    showScrapbook:function() {
        yoodoo.working(true,'Fetching your Scrapbook...');
        if (yoodoo.loggedin) {
            var params={
                cmd:yoodoo.cmd.scrapbook.server,
                callback:'yoodoo.'+yoodoo.cmd.scrapbook.callback
            };
            if ($('#filter_order_by').get().length>0) params.filterorder=$('#filter_order_by').val();
            if ($('#filter_type').get().length>0) params.filtertype=$('#filter_type').val();
            yoodoo.sendPost(null,params);
        }
    },
    scrapbookRemove:function(id) {
        yoodoo.working(true,'Updating your Scrapbook...');
        var params={
            cmd:yoodoo.cmd.scrapbookremove.server,
            scrapbook:id,
            callback:'yoodoo.'+yoodoo.cmd.scrapbookremove.callback
        };
        yoodoo.sendPost(null,params);
    },
    scrapbookRemoveItem:function(id) {
        yoodoo.working(true,'Updating your Scrapbook...');
        var params={
            cmd:yoodoo.cmd.scrapbookremove.server,
            episode_id:id,
            callback:'yoodoo.'+yoodoo.cmd.scrapbookremove.callback
        };
        yoodoo.sendPost(null,params);
    },
    wipedooit:function() {
        yoodoo.working(true,'Updating your Scrapbook...');
        var params={
            cmd:yoodoo.cmd.wipedooit.server,
            dooit:yoodoo.lastLoad,
            callback:'yoodoo.'+yoodoo.cmd.wipedooit.callback
        };
        yoodoo.sendPost(null,params);
    },
    scrapbookAdd:function() {
        yoodoo.stopVoiceover();
        yoodoo.working(true,'Updating your Scrapbook...');
        var params={
            cmd:yoodoo.cmd.scrapbookadd.server,
            dooit:yoodoo.lastLoad,
            callback:'yoodoo.'+yoodoo.cmd.scrapbookadd.callback
        };
        yoodoo.sendPost(null,params);
    },
    scrapbookAddItem:function(id) {
        yoodoo.working(true,'Updating your Scrapbook...');
        var params={
            cmd:yoodoo.cmd.scrapbookadditem.server,
            episode_id:id,
            callback:'yoodoo.'+yoodoo.cmd.scrapbookadditem.callback
        };
        yoodoo.sendPost(null,params);
    },
    gotScrapbook:function(html) {
        yoodoo.working(false);
        if (/^error/.test(html)) {
            this.showLogin();
        }else{
            if (this.loggedin) {
                html=yoodoo.decodeHTMLResponse(html);
				html=html.replace(/<script.*?>.*?<\/script>/gi,'');
				this.loadLinkedFiles(html);
				html=html.replace(/<link.*?>/gi,'');
				html=html.replace(/<style.*?>.*?<\/style>/gi,'');
                html="<div id='scrapbook'>"+html+"</div>";
                var tmp=document.createElement("div");
                tmp.id='scrapbook';
                tmp.innerHTML=html;
                var con=$(tmp).find('>div>div>.boxnt_content').get(0);
                $(con).removeClass('boxnt_content');
                tmp.appendChild(con);
                var re=$(tmp).find('>div:first').get(0);
                re.parentNode.removeChild(re);
                this.display(tmp,false,true);
                var launchers=$('a.button_link').get();
                for(var l=0;l<launchers.length;l++) {
                    var href=launchers[l].getAttribute('href');
                    if (/\/plan\/doo-it/.test(href)) {
                        var did=href.match(/\/\d+\/$/)[0].replace(/\//g,'');
                       	$(launchers[l]).attr('href','javascript:void(0)');
                        launchers[l].dooit=did;
                        $(launchers[l]).bind('click',function() {
                            yoodoo.showDooit(this.dooit);
                        });
                        var mainLink=$(launchers[l].parentNode.parentNode).find('.scrapbookDetails a').get(0);
                       	$(mainLink).attr('href','javascript:void(0)');
                        mainLink.dooit=did;
                        $(mainLink).bind('click',function() {
                            yoodoo.showDooit(this.dooit);
                        });
                    }else if(/\/episode_id%3D/.test(href)) {
                        var did=href.match(/episode_id%3D([^%]+)/);
                        launchers[l].episode=did[1];
                       	$(launchers[l]).attr('href','javascript:void(0)');
                        $(launchers[l]).bind('click',function() {
                            yoodoo.startEpisode(this.episode);
                            yoodoo.hide();
                        });
                        var mainLink=$(launchers[l].parentNode.parentNode).find('.scrapbookDetails a').get(0);
                       	$(mainLink).attr('href','javascript:void(0)');
                        mainLink.episode=did[1];
                        $(mainLink).bind('click',function() {
                            yoodoo.startEpisode(this.episode);
                            yoodoo.hide();
                        });
                    }
                }
				$(this.container).find('.red_button').each(function(i,o) {
					$(o.parentNode).addClass("green medium");
                    $(o.parentNode).attr('href','javascript:void(0)');
					var t=$(o).find(".button_text").html();
					$(o.parentNode).html(t.replace(/[\n]+/g,''));
				});
				$(this.container).find('.green_button').each(function(i,o) {
					$(o.parentNode).addClass("green medium reversed");
                    $(o.parentNode).attr('href','javascript:void(0)');
					var t=$(o).find(".button_text").html();
					$(o.parentNode).html(t.replace(/[\n]+/g,''));
				});
				$(this.container).find('#filter_order_by').attr("onchange","");
				$(this.container).find('#filter_type').attr("onchange","");
                var imgs=$(this.container).find('img');
                for(var i=0;i<imgs.length;i++) {
                    var src=imgs[i].getAttribute("src");
                    if (!(/^http\:\/\//.test(src))) {
                        imgs[i].src=yoodoo.option.baseUrl+src;
                    }
                }
				$('#insertText').val($(tmp).html());
            }
        }
    },
    saveDooit:function(e,o) {
        yoodoo.stopVoiceover();
        var p=dooit.values();
        p.cmd=yoodoo.cmd.dooitsave.server;
        p.dooit=yoodoo.lastLoad;
        p.completed=dooit.finishable()?'1':'0';
        //if (typeof(dooit.completed)!="undefined") p.completed=dooit.completed();
        p.callback='yoodoo.'+yoodoo.cmd.dooitsave.callback;
        yoodoo.working(true,'Saving your information and recalculating your Journey');
        yoodoo.sendPost(null,p,false);
    },
    clearDooit:function(e,o) {
        yoodoo.stopVoiceover();
        var p=dooit.values();
        for(var k in p) {
            if (typeof(p[k])=="string") p[k]='';
        }
        p.cmd=yoodoo.cmd.dooitsave.server;
        p.dooit=yoodoo.lastLoad;
        p.callback='yoodoo.'+yoodoo.cmd.dooitsave.callback;
        yoodoo.working(true);
        yoodoo.sendPost(null,p);
    },
    dooitSaved:function(r) {
        this.working(false);
        if (r=="saved") {
            yoodoo.hide();
            if (yoodoo.option.flashMovie.ports.closedDooit!="") yoodoo.callFlash(yoodoo.option.flashMovie.ports.closedDooit,'closedDooit');
        }else{
            $('#insertText').val(r);
            eval('yoodoo.'+yoodoo.cmd.bookshelfxml.callback+"(r);");
            yoodoo.hide();
			this.nextBook();
            if (yoodoo.option.flashMovie.ports.closedDooit!="") yoodoo.callFlash(yoodoo.option.flashMovie.ports.closedDooit,'closedDooit');
        }
    },
    changePassword:function(un,em,opw,npw) {
        var params={
            cmd:yoodoo.cmd.changepassword.server,
            email:escape(em),
            password:escape(opw),
            newpass:escape(npw),
            callback:'yoodoo.'+yoodoo.cmd.changepassword.callback
        };
        yoodoo.sendPost(null,params);
    },
    passwordChanged:function(r) {
        if (/^error/.test(r)) {
            var err=$(yoodoo.frame).find('.login .error');
            err.html('Failed to change your password, maybe the details were incorrect');
            err.slideDown(yoodoo.animateDuration);
        }else{
            var postSlide='';
			yoodoo.loginCode=r;
            if (!yoodoo.password_updated && yoodoo.option.introMovie.flashvars.intro!="") {
				postSlide='yoodoo.showIntro();';
			}
            yoodoo.password_updated=true;
            var cont=$(this.frame).find('#continue').get(0);
            $(cont).fadeIn(1000);
            $(cont).css('display','inline-block');
            $(this.frame).find('#cancelPassword').css('display','inline-block');
            $(yoodoo.frame).find('.welcome .messenger').html('You have successfully changed your password');
            $(yoodoo.frame).find('.welcome .messenger').slideDown(this.animateDuration);
            if (postSlide!="") {
                setTimeout("$(yoodoo.frame).find('#passwordChanger').slideUp(yoodoo.animateDuration,function(){"+postSlide+"});",3000);
            }else{
            	$(yoodoo.frame).find('#passwordChanger').slideUp(this.animateDuration);
            	$(yoodoo.frame).find('.welcomeContent').slideDown(this.animateDuration);
                setTimeout("$(yoodoo.frame).find('.welcome .messenger').slideUp(2000,function() {$(yoodoo.frame).find('#passwordChanger').slideUp(yoodoo.animateDuration);$(yoodoo.frame).find('.welcomeContent').slideDown(yoodoo.animateDuration);});",3000);
            }
        }
    },
    showIntro:function() {
		//if (this.option.introMovie.flashvars.intro=="") this.option.introMovie.flashvars.intro='http://www.yoodoo.biz/uploads/a4e/media/over_25_with_quals.flv';
		if (this.option.introMovie.flashvars.intro!="") {
        	this.working(true,'Loading your introduction...');
        	var ins="<div><center><div style='padding:5px 10px 0 0'><div id='yoodooIntroPlayerHolder'></div></div><button type='button' onclick='yoodoo.hide(function() {yoodoo.welcome();});' class='green medium' style='margin:5px 0 0 0;display:none;'>press to start</button></center></div>";
        	yoodoo.display(ins);
        	yoodoo.insertIntroMovie();
		}
    },
	finishedIntro:function() {
		$('button.green.medium').fadeIn();
	},
    login:function(un,pw) {
        this.working(true,'Attempting login...');
        yoodoo.username=un;
        var params={
            cmd:yoodoo.cmd.login.server,
            username:escape(un),
            password:escape(pw),
            callback:'yoodoo.'+yoodoo.cmd.login.callback
        };
        yoodoo.sendPost(null,params);
    },
	
	dashboard:function() {
        this.working(true,'Fetching your dashboard...');
        var params={
            cmd:yoodoo.cmd.home.server,
            callback:'yoodoo.'+yoodoo.cmd.home.callback
        };
        yoodoo.sendPost(null,params);
	},
    dashboardreply:function(code) {
        this.working(false);
        //code+="|true|home_screen_title|home_progress_text|home_percentage_complete|home_percentage_text|home_level_text|home_episode_text|home_left_text|home_password_change_text";
        if (/\|/.test(code)) {
            $('#insertText').val(code);
            code=code.replace(/&gt;/g,'>').replace(/&lt;/g,'<');
            var reply=code.split("|");
			yoodoo.replyValues(reply);
			
            yoodoo.password_updated=!yoodoo.first_login;
            yoodoo.loggedin=true;
            //if (yoodoo.option.flashMovie.ports.login!="") yoodoo.callFlash(yoodoo.option.flashMovie.ports.login,yoodoo.username);
            $(yoodoo.container).slideUp(yoodoo.animateDuration,function(){
                yoodoo.welcome();
            });
        }else{
            var err=$(yoodoo.frame).find('.login .error');
            err.html(code);
            err.fadeIn(yoodoo.animateDuration);
            yoodoo.timer=setTimeout('yoodoo.hideError();',3000);
        }
    },
	replyValues:function(reply) {
            yoodoo.first_login=(reply.length>0)?((reply.shift()=="true")?true:false):true;
			//yoodoo.first_login=true;
            yoodoo.home_screen_title=(reply.length>0)?reply.shift():'Welcome to Yoodoo';
            yoodoo.home_progress_text=(reply.length>0)?reply.shift():'Not yet started';
            yoodoo.home_percentage_complete=(reply.length>0)?reply.shift():'10';
            yoodoo.home_percentage_text=(reply.length>0)?reply.shift():'10%';
            yoodoo.home_level_text=(reply.length>0)?reply.shift():'You are currently on <b>Level 1</b>';
            yoodoo.home_episode_text=(reply.length>0)?reply.shift():'<b>Next Episode</b><br />Shall we get started?';
            yoodoo.home_left_text=(reply.length>0)?reply.shift():'<b>Yoodoo Tip of the Day</b><br />You have succesfully entered the Yoodoo widget';
            yoodoo.home_password_change_text=(reply.length>0)?reply.shift():'Change password';
            yoodoo.username=(reply.length>0)?reply.shift():'Visitor';
            yoodoo.flash_message=(reply.length>0)?reply.shift():'';
            yoodoo.option.introMovie.flashvars.intro=(reply.length>0)?reply.shift():'';
            //yoodoo.option.introMovie.flashvars.intro='http://www.yoodoo.biz/uploads/a4e/media/over_25_with_quals.flv';
	},
    loginreply:function(code) {
        this.working(false);
        //code+="|true|home_screen_title|home_progress_text|home_percentage_complete|home_percentage_text|home_level_text|home_episode_text|home_left_text|home_password_change_text";
        if (/\|/.test(code)) {
            $('#insertText').val(code);
            code=code.replace(/&gt;/g,'>').replace(/&lt;/g,'<');
			yoodoo.console(code);
            var reply=code.split("|");
            yoodoo.loginCode=(reply.length>0)?reply.shift():'';
			yoodoo.replyValues(reply);
            yoodoo.password_updated=!yoodoo.first_login;
            yoodoo.loggedin=true;
            //if (yoodoo.option.flashMovie.ports.login!="") yoodoo.callFlash(yoodoo.option.flashMovie.ports.login,yoodoo.username);
            $(yoodoo.container).slideUp(yoodoo.animateDuration,function(){
                yoodoo.welcome();
            });
			this.insertFlash();
            //yoodoo.checkFlashLoaded();
            $(window).unload(function() {
                if (yoodoo.loggedin) {
                    yoodoo.logout();
                }
            });
        }else{
            var err=$(yoodoo.frame).find('.login .error');
            err.html(code);
            err.fadeIn(yoodoo.animationDuration);
            yoodoo.timer=setTimeout('yoodoo.hideError();',3000);
        }
    },
    inbox:function() {
        this.working(true,'Fetching your Inbox...');
        var params={
            cmd:yoodoo.cmd.inbox.server,
            callback:'yoodoo.'+yoodoo.cmd.inbox.callback
        };
        yoodoo.sendPost(null,params);
    },
    getcomments:function(episodeID) {
        yoodoo.comment_id=episodeID;
        yoodoo.working(true,'Fetching comments...');
        var params={
            cmd:yoodoo.cmd.commentsget.server,
            content_id:episodeID,
            callback:'yoodoo.'+yoodoo.cmd.commentsget.callback
        };
        yoodoo.sendPost(null,params);
    },
    comments_content_id:'',
    gotcomments:function(html) {
        yoodoo.working(false);
        if (/^error/.test(html)) {
            this.showLogin();
        }else{
            var content_id='';
            this.comments_content_id=html.match(/var content_id = (\d+);/)[1];
            html=yoodoo.decodeHTMLResponse(html);
            html=html.replace(/<script.*?<\/script>/gi,'');
			this.loadLinkedFiles(html);
            html=html.replace(/<link.*?>/gi,'');
			html=html.replace(/<style.*?>.*?<\/style>/gi,'');
            html=html.replace(/<h2.*?<\/h2>/gi,'');
			html='<h2>Your comments &amp; discussions...</h2>'+html;
            yoodoo.working(false);
            yoodoo.display(html,false,true);
            
            var contentContainer=$(yoodoo.container).find('.tabset_content_container').get(0);
            
            // detect if one is active already
            
            var tabs=$(yoodoo.container).find('.tabset_tabs li');
            var tabs_a=$(yoodoo.container).find('.tabset_tabs a');
            for(var i=0;i<tabs.length;i++) {
                tabs_a[i].href='javascript:void(0)';
            }
            var tabContents=$(contentContainer).find('.tabset_content').get();
            tabs.removeClass('active');
            $(tabs.get(yoodoo.comment_tab)).addClass('active');
            tabs.bind('click',function() {
                if (!$(this).hasClass('active')) {
                    $(this).siblings('li').removeClass("active");
                    var i=$(this).prevAll('li').get().length;
                    yoodoo.comment_tab=i;
                    $(this).addClass("active");
                    var contentContainer=$(yoodoo.container).find('.tabset_content_container');
                    var oldone=$(contentContainer).find('.tabset_content.display');
                    oldone.slideUp(this.animationDuration);
                    oldone.removeClass('display');
                    var newone=$(contentContainer).find('.tabset_content').get(i);
                    $(newone).slideDown(this.animationDuration);
                    $(newone).addClass('display');
                }
            });
            var first=tabContents.splice(yoodoo.comment_tab,1);
            $(first).css('display','block');
            $(first).addClass('display');
            $(tabContents).css('display','none');
            var contents=$(contentContainer).find('.comment_form').get();
            for(var i=0;i<contents.length;i++) {
                $(contents[i]).find('a').get(0).href='javascript:void(0)';
                var tmp=document.createElement("div");
                $(tmp).css('clear','both');
                contents[i].appendChild(tmp);
            }
            var buts=$(yoodoo.container).find('.tabset_content a').get();
            for(var b=0;b<buts.length;b++){
                var newbut=document.createElement("button");
                newbut.setAttribute("type","button");
                newbut.setAttribute("title",buts[b].title);
                newbut.setAttribute("onclick",buts[b].getAttribute("onclick"));
                newbut.innerHTML=buts[b].innerHTML;
                buts[b].parentNode.insertBefore(newbut,buts[b]);
                $(buts[b]).remove();
                $(newbut).addClass("green");
            }
            $(yoodoo.container).find('.tabset_content .comment_body button.green').addClass("medium");
        }
    },
    getkeypointcomments:function(episodeID,keypoint) {
        yoodoo.working(true,'Fetching comments...');
        var params={
            cmd:yoodoo.cmd.commentskeypointget.server,
            content_id:episodeID,
            keypoint:keypoint,
            callback:'yoodoo.'+yoodoo.cmd.commentskeypointget.callback
        };
        yoodoo.sendPost(null,params);
    },
    episodecomplete:function(episodeID) {
        yoodoo.working(true,'Updating your Journey...');
        var params={
            cmd:yoodoo.cmd.episodecomplete.server,
            content_id:episodeID,
            callback:'yoodoo.'+yoodoo.cmd.episodecomplete.callback
        };
        yoodoo.sendPost(null,params);
    },
    quizresults:function(quizresultdata) {
        yoodoo.working(true,'Updating your Journey...');
        var params={
            cmd:yoodoo.cmd.quizresults.server,
            quizresultdata:quizresultdata,
            callback:'yoodoo.'+yoodoo.cmd.quizresults.callback
        };
        yoodoo.sendPost(null,params);
    },
    download:function(id, file) {
		//window.location=file;
		yoodoo.console(file);
		window.open(file,'yoodoo_download');
        //yoodoo.working(true,'Fetching your download...');
        /*var params={
            cmd:yoodoo.cmd.download.server,
            id:id,
            file:file,
            callback:'yoodoo.'+yoodoo.cmd.download.callback
        };
        yoodoo.sendPost(null,params);*/
    },
    commentPost:function() {
        yoodoo.working(true,'Posting your comment...');
        var params={
            cmd:yoodoo.cmd.commentpost.server,
            callback:'yoodoo.'+yoodoo.cmd.commentpost.callback
        };
        yoodoo.sendPost(null,params);
    },
    commentPostAdv:function() {
        yoodoo.working(true,'Posting your comment...');
        var params={
            cmd:yoodoo.cmd.commentpostadv.server,
            callback:'yoodoo.'+yoodoo.cmd.commentpostadv.callback
        };
        yoodoo.sendPost(null,params);
    },
    earmark:function() {
        yoodoo.working(true,'Earmarking...');
        var params={
            cmd:yoodoo.cmd.earmark.server,
            callback:'yoodoo.'+yoodoo.cmd.earmark.callback
        };
        yoodoo.sendPost(null,params);
    },
    startEpisode:function(id) {
        yoodoo.callFlash(yoodoo.cmd.startEpisode.flash,id);
    },
    setTab:function(id) {
        yoodoo.callFlash(yoodoo.cmd.setTab.flash,id);
    },
    displayResponse:function(html) {
        yoodoo.working(false);
        html=yoodoo.decodeHTMLResponse(html);
        yoodoo.display(html,false,true);
    },
    nullResponse:function(r) {
        $('#insertText').val(r);
        yoodoo.working(false);
    }
    
    
    
    
    
}

// main site js function rewritten
function removeTag(id) {
	if(typeof(dooit)!="undefined") dooit.removeTag(id);
}
function addTag(id) {
	if(typeof(dooit)!="undefined") dooit.addTag(id);
}
function isNotBlank(id) {
	var val=getValue(id);
	return (typeof(val)!="undefined" && val!='' && val!==null);
}
function getValue(id) {
	if(!(/^EF\d/.test(id))) {
		id="EF"+array_of_fields[id][0];
	}
	var val=null;
	var tarea=$("textarea[name="+id+"]").get();
	if(tarea.length>0) {
		val=tarea[0].value;
	}else{
		var txt=elementsOfName("input[type=text]",id);
		//var txt=$("input[type=text][name="+id+"]").get();
		if(txt.length>0) {
			val=txt[0].value;
		}else{
			var rads=elementsOfName("input[type=radio]",id+"[]");
			//var rads=$("input[type=radio][name="+id+"[]]").get();
			if(rads.length>0) {
				val=radioValue(id);
			}else{
				var chck=elementsOfName("input[type=checkbox]",id+"[]");
				//var chck=$("input[type=checkbox][name="+id+"[]]").get();
				if (chck.length>0) val=checkboxValue(id);
			}
		}
	}
	if(val===null) {
		for(var i in array_of_fields) {
			if (id=="EF"+array_of_fields[i][0]) {
				val=array_of_fields[i][1];
			}
		}
	}
	return val;
}
function elementsOfName(sel,name) {
	var chck=$(sel).get();
	var reply=[];
	for(var i=0;i<chck.length;i++) {
		if(chck[i].name==name) reply.push(chck[i]);
	}
	return reply;
}
function setValue(id,val) {
    var o=$('#'+id).get();
	var name=id;
	if(!(/^EF\d/.test(name))) {
		//console.log(name);
		name="EF"+array_of_fields[name][0];
	}
//console.log(id,val);
    if (array_of_fields && typeof(array_of_fields[id])!="undefined") array_of_fields[id][1]=val;
    if (o.length>=1) {
        o[0].value=val;
    }else{
        setRadioValue(name,val);
    }   
}
function radioValue(name) {
	var rads=elementsOfName("input[type=radio]",name+"[]");
    //var rads=$("input[type=radio][name="+name+"]").get();
    for(var i=0;i<rads.length;i++) {
        if (rads[i].checked) {
            return rads[i].value;
        }
    }
    return null;
}
function setRadioValue(name,val) {
    var rads=$("input[type=radio][name="+name+"]").get();
    for(var i=0;i<rads.length;i++) {
        if (rads[i].value==val) {
            rads[i].checked=true;
        }else if (rads[i].checked) {
            rads[i].checked=false;
        }
    }
}
function showBookcase() { }
function showEpisode(arg) { }
function completeEpisode(arg) { }
function playerAnalytics(evt, itemType, itemId, text) { }
function fl_onHomeTabClicked() {
    yoodoo.dashboard();
}
function fl_onScrapbookTabClicked() {
    yoodoo.showScrapbook();
}
function fl_onInboxClicked() {
    //yoodoo.inbox();
}
function fl_onDooItClicked(id, from) {      // Exercise link from episode books or DOO-IT> link from doo-it books
    if (from=="doo-its") {
        yoodoo.showDooit(id);
    }else if (from=="episodes") {       
        yoodoo.showEpisodeDooit(id);
    }
}
function fl_onDownloadClicked(id, file) {   // Download link from documents books
    yoodoo.download(id, file);
}
function fl_onEpisodeCommentsClicked(episodeID) {   // comments about episode clicked
    yoodoo.getcomments(episodeID);
}
function fl_onKeyPointCommentsClicked(episodeID, keypointID) {  // comments clicked about a specific keypoint
    yoodoo.getkeypointcomments(episodeID, keypointID);
}
function fl_onReady() {
    yoodoo.flashReady();
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
function fl_onEpisodeEarmark(id,state) {
    yoodoo.earmark(id,state);
}
function fl_onEpisodeComplete(episodeID) {
    yoodoo.episodecomplete(episodeID);
}
function setFlashTab(tab) {
    yoodoo.setTab(tab);
    return false;
}
function fl_onQuizResults (episodeID,res) {
    yoodoo.quizresults(res);
}
function goRemove(id) {
    yoodoo.scrapbookRemove(id); 
}
function goFilter() {
    yoodoo.showScrapbook();
}
function checkFinish() {
    var canFinish=true;
    document.getElementById('saveDooit').style.display=canFinish?'block':'none';
}
function showForm(id){
    var form=$('#'+id);
    if (form.css('display')=="none") {
        form.slideDown();
        //resizer.resize(form,{fromHeight:0});
    }else{
        form.slideUp();
        //resizer.resize(form,{toHeight:0});
    }
}
function submitForm(parent_id, field_id, type){
    var val=$('#'+field_id).val();
    if (val!="") {
        var params={
            parent_id:parent_id,
            comment_text:val,
            content_id:yoodoo.comments_content_id
            //content_id:yoodoo.comment_id
        }
        if (type==2) {
        //if (/^adv_/.test(field_id)) {
            params.cmd=yoodoo.cmd.commentpostadv.server;
            params.callback='yoodoo.'+yoodoo.cmd.commentpostadv.callback;
        }else{
            params.cmd=yoodoo.cmd.commentpost.server;
            params.callback='yoodoo.'+yoodoo.cmd.commentpost.callback;
        }
        yoodoo.sendPost(null,params);
    }
}
var dooit={
    finishable:function() {
        return false;
    }
}


var BrowserDetect = {
	init: function () {
		this.browser = this.searchString(this.dataBrowser) || "An unknown browser";
		this.version = this.searchVersion(navigator.userAgent)
			|| this.searchVersion(navigator.appVersion)
			|| "an unknown version";
		this.OS = this.searchString(this.dataOS) || "an unknown OS";
	},
	searchString: function (data) {
		for (var i=0;i<data.length;i++)	{
			var dataString = data[i].s;
			var dataProp = data[i].p;
			this.versionSearchString = data[i].vs || data[i].i;
			if (dataString) {
				if (dataString.indexOf(data[i].ss) != -1)
					return data[i].i;
			}
			else if (dataProp)
				return data[i].i;
		}
	},
	searchVersion: function (dataString) {
		var index = dataString.indexOf(this.versionSearchString);
		if (index == -1) return;
		return parseFloat(dataString.substring(index+this.versionSearchString.length+1));
	},
	dataBrowser: [{s: navigator.userAgent,ss: "Chrome",i: "Chrome"},{ s: navigator.userAgent,ss: "OmniWeb",vs: "OmniWeb/",i: "OmniWeb"},{s: navigator.vendor,ss: "Apple",i: "Safari",vs: "Version"},{p: window.opera,i: "Opera",vs: "Version"},{s: navigator.vendor,ss: "iCab",i: "iCab"},{s: navigator.vendor,ss: "KDE",i: "Konqueror"},{s: navigator.userAgent,ss: "Firefox",i: "Firefox"},{s: navigator.vendor,ss: "Camino",i: "Camino"},{s: navigator.userAgent,ss: "Netscape",i: "Netscape"},{s: navigator.userAgent,ss: "MSIE",i: "Explorer",vs: "MSIE"},{s: navigator.userAgent,ss: "Gecko",i: "Mozilla",vs: "rv"},{s: navigator.userAgent,ss: "Mozilla",i: "Netscape",vs: "Mozilla"}],
	dataOS : [{s: navigator.platform,ss: "Win",i: "Windows"},{s: navigator.platform,ss: "Mac",i: "Mac"},{   s: navigator.userAgent,   ss: "iPhone",   i: "iPhone/iPod"    },{s: navigator.platform,ss: "Linux",i: "Linux"}]

};
BrowserDetect.init();
