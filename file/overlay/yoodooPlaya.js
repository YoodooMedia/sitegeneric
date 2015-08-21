var yoodooPlaya = {
	canvas: null,
	content: null,
	asCanvas: true,
	width: 788,
	height: 466,
	slicePixelSizeLimit: 64000,
	localFiles: false,
	autoplayChapter: null,
	autoplayKeypoint: null,
	videoTypes: {
		/*minimp4:{
			validate:function() {
				return true;
				if (yoodooPlaya.videoFileType!="mp4") return false;
				return yoodooPlaya.episode.settings.movie.width<=400;
			},
			mime:'video/mp4',
			extension:'mp4'
		},*/

		webm: {
			validate: function() {
				if (yoodooPlaya.videoFileType != "webm") return false;
				return true;
				return yoodooPlaya.episode.settings.movie.width > 100;
			},
			mime: 'video/webm',
			extension: 'webm'
		},
		mp4: {
			validate: function() {
				if (yoodooPlaya.videoFileType != "mp4") return false;
				return true;
				return yoodooPlaya.episode.settings.movie.width > 100;
			},
			mime: 'video/mp4',
			extension: 'mp4'
		}
	},
	videoType: null,
	detectVideoType: function() {
		for (var k in this.videoTypes) {
			if (this.videoTypes[k].validate()) this.videoType = k;
		}
	},
	videoFileType: null,
	detectVideoFileType: function() {
		try {
			var vid = document.createElement("video");
			for (var k in this.videoTypes) {
				if (vid.canPlayType(this.videoTypes[k].mime).replace(/no/i, '') != "") this.videoFileType = k;
			}
		} catch (e) {}
	},
	videoTypeConvert: function(url) {
		if (this.videoFileType === null) return url;
		var parts = url.split('/');
		var filename = parts.pop();
		var filenameparts = filename.split('.');
		var extension = filenameparts.pop();
		if (extension.toLowerCase() != this.videoTypes[this.videoFileType].extension) {
			if (parts[parts.length - 1] == 'flv') {
				parts[parts.length - 1] = this.videoFileType;
			} else {
				parts.push(this.videoFileType);
			}
			filename = filename.replace(/\.[a-z0-9]+$/i, '.' + this.videoTypes[this.videoFileType].extension);
		}
		url = parts.join("/") + "/" + filename;
		//if (yoodoo.option.htmlResourceUrl!=yoodoo.option.resourceUrl) url=url.replace(yoodoo.option.resourceUrl,yoodoo.option.htmlResourceUrl);
		if (yoodooPlaya.localFiles) {
			url = url.replace(/^http\:\/\/flserver\.yoodidit\.co\.uk\//, yoodoo.option.baseUrl);
			url = url.replace(/^http\:\/\/www\.yoodidit\.co\.uk\//, yoodoo.option.baseUrl);
		}
		return url;
	},
	button: {
		container: {
			margin: 5,
			className: 'buttonBox'
		},
		count: 7,
		width: 78,
		margin: 2,
		maxProportion: 0.2,
	},
	bookcase: {
		margin: 7,
		width: 690,
		height: 446,
		slider: {
			maxProportion: 0.1,
			maxHeight: 50,
			height: 20
		},
		filter: {
			episodes: {
				value: true,
				className: 'book',
				invertClass: false,
				invertAction: false
			},
			dooits: {
				value: true,
				className: 'dooit',
				invertClass: false,
				invertAction: false
			},
			documents: {
				value: true,
				className: 'document',
				invertClass: false,
				invertAction: false
			},
			earmarks: {
				value: false,
				className: 'earmarked',
				invertClass: true,
				invertAction: true
			}
		},
		items: [],
		keypoint: {
			minColumnWidth: 350,
			maxColumnWidth: 800
		}
	},
	minibookcase: {
		minWidth: 2,
		maxWidth: 30,
		width: 1,
		margin: 0,
		expandProportion: 3,
		padding: 5
	},
	book: {
		imageWidth: 0.9,
		colourBand: {
			height: null,
			maxHeight: null,
			minHeight: null,
			proportion: 0.15,
			lighten: -0.5,
			brighten: -0.1
		},
		text: {
			colour: '#fff',
			size: '14px',
			top: 40
		},
		margin: 6,
		radius: 10,
		earradius: 20,
		minimum: 7, // must be odd number
		shown: 7, // the calculated book count visible
		minSpineWidth: 20,
		width: 200,
		height: 446,
		spine: 20,
		expandWidth: 200,
		expandAspect: 0.7, // width/height
		spineAspect: 0.1, // width/height
		spineTextHeight: 0.3 // proportion of spine width
	},
	touch: {
		speed: 0,
		x: 0,
		on: false,
		friction: 400,
		interval: 20,
		time: 0,
		dtime: 0
	},
	currentBookIndex: -1,
	episode: [],
	container: null,
	containers: {
		bookcase: null
	},
	buttons: [{
			name: '{dashboard}',
			className: 'home',
			click: 'yoodoo.refreshedDashboard()'
		},
		//{name:'toggle view',className:'bookcase_view',click:'yoodooPlaya.toggleBookcaseView()'},
		{
			name: '{scrapbook}',
			className: 'scrapbook',
			click: 'yoodoo.showScrapbook()'
		}, {
			name: '{comments}',
			className: 'comments',
			click: 'yoodoo.comments.show({})',
			processor: 'yoodoo.comments.unreadButtonProcess'
		}, {
			container: 'div',
			className: 'bookcaseButtons',
			children: [{
				name: '{episodes}',
				className: 'episodes',
				click: 'yoodooPlaya.toggleFilter(this,"episodes")',
				initial: true,
				content: '<div class="buttonLight"></div>'
			}, {
				name: '{dooits}',
				className: 'dooits',
				click: 'yoodooPlaya.toggleFilter(this,"dooits")',
				initial: true,
				content: '<div class="buttonLight"></div>'
			}, {
				name: '{documents}',
				className: 'documents',
				click: 'yoodooPlaya.toggleFilter(this,"documents")',
				initial: true,
				content: '<div class="buttonLight"></div>'
			}, {
				name: '{earmarks}',
				className: 'earmarks',
				click: 'yoodooPlaya.toggleFilter(this,"earmarks")',
				initial: false,
				content: '<div class="buttonLight"></div>'
			}]
		}
	],
	episode_buttons: [{
			name: '{dashboard}',
			className: 'home',
			click: 'yoodooPlaya.destroyEpisode();yoodoo.episodeclosed((yoodoo.intervention===null)?"yoodoo.welcome();":null);'
		}, {
			name: '{bookcase}',
			className: 'goto_bookcase',
			click: 'yoodooPlaya.destroyEpisode();yoodoo.episodeclosed("yoodooPlaya.showBookcase();");'
		}, {
			name: '{comments}',
			className: 'comments',
			click: 'yoodoo.comments.show({contentId:yoodooPlaya.episode.id,targetId:yoodooPlaya.episode.chapters[yoodooPlaya.episode.chapter].id})'
		}, {
			name: '{scrapbook}',
			className: 'scrapbook',
			click: 'yoodooPlaya.destroyEpisode();yoodoo.showScrapbook()'
		},
		//{name:'fullscreen',className:'fullscreen',click:'yoodooPlaya.fullscreen()'}
		//{name:'settings',className:'settings',click:'yoodooPlaya.showSettings()'}
	],
	init: function(targetElement) {
		//alert(navigator.userAgent);
		//alert(BrowserDetect.browser+", "+BrowserDetect.version);
		this.detectVideoFileType();
		this.width = $(targetElement).width();
		this.height = $(targetElement).height();
		this.container = targetElement;
		this.button.width = this.width * this.button.maxProportion;
		this.button.width = (((this.button.margin * 2) + this.button.width) * this.button.count > this.height - (2 * this.button.container.margin)) ? Math.floor((this.height - (2 * this.button.container.margin)) / this.button.count) : Math.floor(this.button.width);
		this.bookcase.width = this.width - this.button.width - (this.bookcase.margin * 2) - (this.button.container.margin * 2);
		this.bookcase.height = this.height - (this.bookcase.margin * (yoodoo.displayMiniBookcase ? 3 : 2));
		this.bookcase.slider.height = Math.floor(this.height * this.bookcase.slider.maxProportion);
		this.bookcase.slider.height = (this.bookcase.slider.height > this.bookcase.slider.maxHeight) ? this.bookcase.slider.maxHeight : Math.floor(this.bookcase.slider.height);
		if (!yoodoo.displayMiniBookcase) this.bookcase.slider.height = 0;
		this.bookcase.height -= this.bookcase.slider.height;
		this.book.height = this.bookcase.height - (2 * this.book.margin) - (2 * yoodoo.styles.book.border.width);
		this.book.expandWidth = Math.round(this.book.height * this.book.expandAspect);
		this.book.spine = Math.round(this.book.height * this.book.spineAspect);
		var showWidth = this.book.expandWidth + (this.book.margin * 2 * this.book.minimum) + ((this.book.minimum - 1) * this.book.spine);
		while (showWidth > this.bookcase.width) {
			this.book.expandAspect *= 0.99;
			this.book.spineAspect *= 0.99;
			this.book.expandWidth = Math.round(this.book.height * this.book.expandAspect);
			this.book.spine = Math.round(this.book.height * this.book.spineAspect);
			showWidth = this.book.expandWidth + (this.book.margin * 2 * this.book.minimum) + ((this.book.minimum - 1) * this.book.spine);
		}
		this.book.shown = Math.floor((this.bookcase.width - (this.book.expandWidth + (this.book.margin * 2))) / ((this.book.margin * 2) + this.book.spine));
		this.book.colourBand.height = Math.floor(this.book.height * this.book.colourBand.proportion);
		if (this.book.colourBand.maxHeight !== null && this.book.colourBand.height > this.book.colourBand.maxHeight) this.book.colourBand.height = this.book.colourBand.maxHeight;
		if (this.book.colourBand.minHeight !== null && this.book.colourBand.height < this.book.colourBand.minHeight) this.book.colourBand.height = this.book.colourBand.minHeight;


		this.containers.bookcase = document.createElement("div");
		//var bcw=this.button.width+this.bookcase.margin+(this.button.container.margin);
		var ins = '<div class="' + yoodoo.class_prefix + '_buttons ' + yoodoo.class_prefix + '_overlay" style="float:left;width:' + this.button.width + 'px;height:' + (this.height - (2 * this.button.container.margin)) + 'px;margin:' + this.button.container.margin + 'px;">';
		for (var b = 0; b < this.buttons.length; b++) {
			if (this.buttons[b].container === undefined) {
				ins += this.build_button(this.buttons[b]);
			} else {
				ins += '<' + this.buttons[b].container + ' class="' + yoodoo.class_prefix + '_' + this.buttons[b].className + '">';
				for (var bb = 0; bb < this.buttons[b].children.length; bb++) {
					ins += this.build_button(this.buttons[b].children[bb]);
				}
				ins += '</' + this.buttons[b].container + '>';
			}
		}
		ins += '</div>';
		ins += '<div class="' + yoodoo.class_prefix + '_bookcase_viewport ' + yoodoo.class_prefix + '_overlay" style="width:' + this.bookcase.width + 'px;height:' + this.bookcase.height + 'px;margin:' + this.bookcase.margin + 'px"></div>';
		if (yoodoo.displayMiniBookcase) ins += '<div class="' + yoodoo.class_prefix + '_bookcase_slider" style="width:' + this.bookcase.width + 'px;height:' + this.bookcase.slider.height + 'px;margin:0px ' + this.bookcase.margin + 'px ' + this.bookcase.margin + 'px ' + this.bookcase.margin + 'px;"></div>';
		this.containers.bookcase.innerHTML = ins;
		this.container.appendChild(this.containers.bookcase);
		$(this.containers.bookcase).addClass(yoodoo.class_prefix + '_bookcase_container').css({
			overflow: "auto",
			height: this.height
		});
		this.animation.prerender();
		/*window.addEventListener("deviceorientation",function(e){
			yoodooPlaya.tilt(e.beta);
		},true);*/
		//window.addEventListener("MozOrientation",function(e){
		//yoodooPlaya.tilt(e.y);
		//},true);
	},
	hideBookcase: function() {
		if (this.container != null) {
			$(this.container).css({
				display: "none"
			});
		}
	},
	showScrapbook: function(content_id) {
		if (window.confirm(yoodoo.w('leavethisepisodeandopenthescrapbook'))) {
			this.destroyEpisode();
			this.closeKeypoint();
			yoodoo.showScrapbook(content_id);
		}
	},
	build_button: function(obj) {
		if ((obj.className != 'scrapbook' && obj.className != 'comments') || yoodoo.intervention === null) {
			var addClass = '';
			if (obj.initial !== undefined) {
				addClass = obj.initial ? '' : ' off';
			}
			var ins = '';
			if (obj.processor !== undefined) {
				try {
					eval('ins=' + obj.processor + '();');
				} catch (e) {}
			}
			return '<button type="button" class="' + yoodoo.class_prefix + '_' + obj.className + addClass + '" onclick=\'' + obj.click + '\' title="' + yoodoo.wr(obj.name) + '" style="height:' + (this.button.width - (2 * this.button.margin)) + 'px;width:' + (this.button.width - (2 * this.button.margin)) + 'px;margin:' + this.button.margin + 'px;"><div>' + (obj.content !== undefined ? obj.content : '') + ins + '</div></button>';
		} else {
			return '';
		}
	},
	loadBookcase: function(txt) {
		yoodoo.loadBookcase(txt);
	},
	bookcaseLoaded: function(bookcase) {
		this.bookcase.object = bookcase;
		this.firstTime = false;
		if (this.currentBookIndex < 0) this.firstTime = true;
		if (this.firstTime && this.currentBookIndex < 0 && arguments.length > 0) this.currentBookIndex = arguments[0];
		if (arguments.length > 1) this.currentBookIndex = arguments[1];
		this.renderBookcase();
		this.initSliderEvents();
		//this.countDisplayed();
		if (yoodoo.displayMiniBookcase) this.initMinibookcaseSlider();
		/*if (this.currentBookIndex>=0) {
			if (this.asCanvas) {
				//if (!this.firstTime) this.slideToOpen();
				//yoodooPlaya.bookcase.object.items[this.currentBookIndex].toggle();
			}else{
				//yoodooPlaya.expand(yoodooPlaya.currentBookIndex);
			}
		}*/
	},
	countDisplayed: function() {
		this.bookcase.displayed = [];
		this.bookcase.indexes = [];
		var onFilters = {};
		for (var f in this.bookcase.filter) {
			if (f != "earmarks") onFilters[this.bookcase.filter[f].className] = this.bookcase.filter[f].value;
		}
		var withEarmarks = this.bookcase.filter.earmarks.value;
		for (var b = 0; b < this.bookcase.object.items.length; b++) {
			if ((withEarmarks && this.bookcase.object.items[b].earmarked) || !withEarmarks) {
				this.bookcase.indexes.push(this.bookcase.displayed.length);
				if (onFilters[this.bookcase.object.items[b].type]) this.bookcase.displayed.push(b);
			}
		}
	},
	xmlToJson: function(xml) {
		var item = xml.firstChild;
		var col = [];
		while (item !== null && item != undefined) {
			var i = {};
			if (item.nodeName != '#text' && item.nodeName != 'parsererror' && (!(item.firstChild && item.firstChild.nodeName == '#cdata-section'))) {
				i.type = item.nodeName;
				if (item.data) i.data = item.data;
				if (item.getAttribute && item.getAttribute("id")) i.id = item.getAttribute("id");
				if (item.firstChild) {
					var k = item.firstChild;
					while (k !== null && k != undefined) {
						if (k.firstChild) {
							if (k.firstChild.nodeName == "#cdata-section") {
								i[k.nodeName] = k.firstChild.data;
							}
						}
						k = k.nextSibling;
					}
					i.kids = this.xmlToJson(item);
				}
				col.push(i);
			}
			item = item.nextSibling;
		}
		return col;
	},
	topicsStyled: {},
	renderMiniBookcase: function() {
		var conts = $(this.containers.bookcase).find('.' + yoodoo.class_prefix + '_bookcase_slider').get();
		if (conts.length == 1) {
			while (conts[0].childNodes.length > 0) conts[0].removeChild(conts[0].childNodes[0]);
		}
		var minibookcase = '';
		this.minibookcase.width = (this.bookcase.width - (2 * this.minibookcase.padding)) / this.bookcase.object.items.length;
		if (this.minibookcase.width > this.minibookcase.maxWidth) this.minibookcase.width = this.minibookcase.maxWidth;
		if (this.minibookcase.width < this.minibookcase.minWidth) this.minibookcase.width = this.minibookcase.minWidth;
		var w = 0; // float width
		var aw = 0; // integer width
		var tw = 0;
		this.miniEyepiece = document.createElement("div");
		$(this.miniEyepiece).addClass(yoodoo.class_prefix + "_eyepiece").css({
			height: this.bookcase.slider.height - 2
		});
		this.miniEyepiece.update = function() {
			var range = yoodooPlaya.containers.bookcase.range();
			var left = Math.floor(yoodooPlaya.minibookcase.width * range.first);
			var right = Math.ceil(yoodooPlaya.minibookcase.width * (range.last + 1));
			w = right - left;
			left += yoodooPlaya.minibookcase.padding;
			$(yoodooPlaya.miniEyepiece).css({
				width: w - 2,
				left: left
			});
		};
		var items = document.createElement("div");
		var levels = document.createElement("div");
		var mb = document.createElement("div");
		$(mb).addClass(yoodoo.class_prefix + "_minibookcase").css({
			position: 'relative',
			padding: "0px " + this.minibookcase.padding + "px 0px " + this.minibookcase.padding + "px"
		});
		$(mb).addClass(yoodoo.class_prefix + "_with" + ((this.bookcase.object.levels.length > 1) ? '' : 'out') + "_levels");
		for (var l = 0; l < this.bookcase.object.levels.length; l++) {
			this.bookcase.object.levels[l].left = null;
			this.bookcase.object.levels[l].right = null;
		}
		for (var b = 0; b < this.bookcase.object.items.length; b++) {
			var lev = undefined;
			if (this.bookcase.object.items[b].level_id != undefined) {
				lev = this.bookcase.object.levels[this.bookcase.object.levelIds[this.bookcase.object.items[b].level_id]];
			}
			if (lev !== undefined && b == lev.first) lev.left = aw;

			var colKey = 'Colour' + this.bookcase.object.items[b].spineColour.replace('#', '');
			w += this.minibookcase.width;
			if (aw + this.minibookcase.width > w) {
				tw = Math.floor(this.minibookcase.width);
			} else {
				tw = Math.ceil(this.minibookcase.width);
			}
			aw += tw;
			var item = document.createElement("div");
			$(item).addClass(yoodoo.class_prefix + "_thumb " + colKey + "" + ((this.bookcase.object.items[b].completed) ? " " + yoodoo.class_prefix + "_completed" : " " + yoodoo.class_prefix + "_uncompleted")).css({
				width: tw
			});
			items.appendChild(item);
			if (lev !== undefined && b == lev.last) lev.right = aw;
		}
		for (var l = 0; l < this.bookcase.object.levels.length; l++) {
			if (this.bookcase.object.levels[l].content > 0) {
				var colKey = 'Colour' + this.bookcase.object.levels[l].colour.replace('#', '');
				var item = document.createElement("div");
				$(item).addClass(yoodoo.class_prefix + "_level " + colKey).css({
					width: this.bookcase.object.levels[l].right - this.bookcase.object.levels[l].left
				}).html("<span>" + this.bookcase.object.levels[l].name + "</span>");
				levels.appendChild(item);
			}
		}
		mb.appendChild(this.miniEyepiece);
		mb.appendChild(items);
		mb.appendChild(levels);
		$(this.containers.bookcase).find('.' + yoodoo.class_prefix + '_bookcase_slider').get(0).appendChild(mb);

		if (yoodoo.is_touch) {
			$(mb).bind("touchstart", function(e) {
				this.clicked(e.originalEvent.touches[0].pageX);
				$(this).bind("touchmove", function(e) {
					this.clicked(e.originalEvent.touches[0].pageX);
				});
				$(this).bind("touchstop", function(e) {
					$(this).unbind("touchmove touchstop");
				});
			});
		} else {
			$(mb).bind("mousedown", function(e) {
				this.clicked(e.pageX);
				$(this).bind("mousemove", function(e) {
					this.clicked(e.pageX);
				});
				$(this).bind("mouseup mouseleave", function(e) {
					$(this).unbind("mousemove mouseup mouseleave");
				});
			});
		}
		mb.bookcaseSlider = $(yoodooPlaya.containers.bookcase).find('.' + yoodoo.class_prefix + '_bookcase_viewport').get(0);
		mb.clicked = function(x) {
			var l = x - $(this).offset().left - yoodooPlaya.minibookcase.padding;
			var i = Math.round(l / yoodooPlaya.minibookcase.width);
			i = yoodooPlaya.bookcase.indexes[i];
			var si = i * (yoodooPlaya.book.spine + (2 * yoodoo.styles.book.border.width) + (2 * yoodooPlaya.book.margin));
			if (i > yoodooPlaya.book.expanded) si += yoodooPlaya.book.expandWidth - yoodooPlaya.book.spine;
			this.bookcaseSlider.physics.speed = 0;
			this.bookcaseSlider.setScroll(si);
		};
	},
	bookcaseScrollTimerInterval: 500,
	bookcaseScrollTimer: null,
	revealBookcaseButtons: function() {
		$(this.containers.bookcaseButtons).css({
			left: window.scrollX
		}).fadeIn();
	},
	topicColours: {},
	welcomeMessage: function() {
		var d = document.createElement("div");
		$(d).addClass("welcome").css({
			color: yoodooStyler.rgbToHex(yoodoo.styles.text),
			overflow: 'hidden',
			'vertical-align': 'top',
			display: "inline-block",
			width: (1 * this.book.expandWidth) + (2 * yoodoo.styles.book.border.width) + (2 * this.book.margin),
			height: this.book.height + (2 * this.book.margin)
		}).html("<div style='padding:10px'>" + yoodoo.flash_message + "</div>");
		return d;
	},
	hideWelcomeMessage: function() {
		yoodooPlaya.containers.bookcaseViewport.find('.welcome').animate({
			opacity: 0
		}, 500, function() {
			$(this).animate({
				width: 0
			}, 500, function() {
				$(this).remove();
				yoodooPlaya.slideToOpen();
			});
		});
	},
	renderBookcaseCanvas: function() {
		var fullWidth = ((this.bookcase.object.items.length - 1) * (this.book.spine + (2 * yoodoo.styles.book.border.width) + (2 * this.book.margin))) + (2 * this.book.expandWidth) + (2 * yoodoo.styles.book.border.width) + (2 * this.book.margin);

		this.containers.bookcaseViewport = $(this.containers.bookcase).find("." + yoodoo.class_prefix + "_bookcase_viewport");

		var d = document.createElement("div");

		if (this.bookcaseCreated === undefined && yoodoo.flash_message !== null) $(d).append(this.welcomeMessage());
		this.bookcaseCreated = true;


		//this.containers.bookcaseViewport.css({'overflow-x':'auto'});
		for (var b = 0; b < this.bookcase.object.items.length; b++) {
			if (this.bookcase.object.items[b].visible) {
				//console.log(this.bookcase.object.items[b]);
				this.bookcase.object.items[b].itemIndex = b;
				//			if (this.bookcase.object.items[b].context===undefined) 
				$(d).append(this.createCanvas(this.bookcase.object.items[b]));
			}
		}
		$(d).css({
			width: fullWidth,
			height: this.bookcase.height
		});
		this.containers.bookcaseViewport.empty().append(d);
		//this.displayRenderedCanvas();
		//setTimeout('yoodooPlaya.displayRenderedCanvas();',2000);
	},
	displayRenderedCanvas: function() {
		for (var b = 0; b < this.bookcase.object.items.length; b++) {
			this.bookcase.object.items[b].render();
		}
	},
	animation: {
		frames: {
			base: {
				earmarked: [],
				normal: []
			},
			topic: {}
		},
		framecount: (yoodoo.renderComplexity == 2) ? 3 : ((yoodoo.renderComplexity == 1) ? 10 : 20),
		interval: (yoodoo.renderComplexity == 2) ? 100 : 20,
		fullWidth: 100,
		prerender: function() {
			yoodooPlaya.slicePixelSizeLimit = (yoodoo.renderComplexity == 2) ? 64000 : 200000;
			this.bgc = yoodoo.styles.book.colour;
			this.bgt = yoodooStyler.tint(yoodoo.styles.book.colour, yoodoo.styles.book.colour.tint.lightness, yoodoo.styles.book.colour.tint.brightness);
			this.bgcs = yoodoo.styles.book.spine;
			this.bgts = yoodooStyler.tint(yoodoo.styles.book.spine, yoodoo.styles.book.spine.tint.lightness, yoodoo.styles.book.spine.tint.brightness);
			this.fullWidth = yoodooPlaya.book.spine + yoodooPlaya.book.expandWidth;
			this.earWidth = Math.round(yoodooPlaya.book.expandWidth / 10);
			var sliceHeight = Math.floor(yoodooPlaya.slicePixelSizeLimit / (this.fullWidth + (2 * yoodooPlaya.book.margin)));
			var slices = Math.ceil((yoodooPlaya.book.height + (2 * yoodooPlaya.book.margin)) / sliceHeight);
			while (this.frames.base.earmarked.length < this.framecount) {
				var nc = document.createElement("canvas");
				nc.width = this.fullWidth + (2 * yoodooPlaya.book.margin);
				nc.height = this.earWidth + (2 * yoodooPlaya.book.margin);
				this.frames.base.earmarked.push({
					canvas: nc,
					context: nc.getContext("2d")
				});

				var nc = document.createElement("canvas");
				nc.width = this.fullWidth + (2 * yoodooPlaya.book.margin);
				nc.height = yoodooPlaya.book.height + (2 * yoodooPlaya.book.margin);
				this.frames.base.normal.push({
					canvas: nc,
					context: nc.getContext("2d")
				});
			}
			var sliceCanvas = document.createElement("canvas");
			sliceCanvas.width = this.fullWidth + (2 * yoodooPlaya.book.margin);
			sliceCanvas.height = sliceHeight;
			var sliceContext = sliceCanvas.getContext("2d");
			// base image
			var offsetX = 0;
			var offsetY = 0;
			var context = sliceContext;
			for (var f = 0; f < this.framecount; f++) {
				var drawToContext = this.frames.base.normal[f].context;
				for (var s = 0; s < slices; s++) {
					var offset = {
						x: 0,
						y: 0
					};
					context.clearRect(0, 0, sliceCanvas.width, sliceCanvas.height);
					offset.y = -(s * sliceHeight);
					context.translate(0, -(s * sliceHeight));
					offset.x += yoodooPlaya.book.margin;
					offset.y += yoodooPlaya.book.margin;
					context.translate(yoodooPlaya.book.margin, yoodooPlaya.book.margin);
					var scaleX = f / (this.framecount - 1);
					var alpha = scaleX * Math.PI / 2;
					var spineWidth = Math.sin(alpha);
					var actualSpineScale = spineWidth;
					var faceWidth = Math.cos(alpha);
					var actualFaceScale = faceWidth;
					var spineTint = {
						lightness: -faceWidth * 0.3,
						brightness: -faceWidth * 0.1
					};
					var faceTint = [{
						lightness: 0,
						brightness: 0
					}, {
						lightness: -spineWidth * 0.5,
						brightness: -spineWidth * 0.1
					}];
					spineWidth *= yoodooPlaya.book.spine;
					faceWidth *= yoodooPlaya.book.expandWidth;
					var earWidth = this.earWidth;
					var miniEarWidth = earWidth / 2;
					if (miniEarWidth > yoodooPlaya.book.spine / 3) miniEarWidth = yoodooPlaya.book.spine / 3;
					if (yoodoo.renderComplexity == 2) {
						this.gradient = yoodooStyler.rgbToHex(yoodooStyler.tint(this.bgcs, spineTint.lightness, spineTint.brightness));
						this.faceGradient = yoodooStyler.rgbToHex(yoodooStyler.tint(this.bgt, spineTint.lightness, spineTint.brightness));
					} else {
						var spineGradientColours = [
							yoodooStyler.rgbToHex(yoodooStyler.tint(this.bgcs, spineTint.lightness, spineTint.brightness)),
							yoodooStyler.rgbToHex(yoodooStyler.tint(this.bgts, spineTint.lightness, spineTint.brightness))
						];
						var faceGradientColour = [
							yoodooStyler.rgbToHex(yoodooStyler.tint(this.bgt, faceTint[1].lightness, faceTint[1].brightness)),
							yoodooStyler.rgbToHex(yoodooStyler.tint(this.bgc, faceTint[0].lightness, faceTint[0].brightness))
						];
						this.gradient = yoodooPlaya.canvasGradient(context, {
							left: 0,
							top: 0,
							right: yoodooPlaya.book.spine,
							bottom: 0
						}, [
							[0, spineGradientColours[0]],
							[1, spineGradientColours[1]]
						]);

						this.faceGradient = yoodooPlaya.canvasGradient(context, {
							left: 0,
							top: 0,
							right: yoodooPlaya.book.expandWidth,
							bottom: 0
						}, [
							[0, faceGradientColour[1]],
							[1, faceGradientColour[0]]
						]);
					}
					if (scaleX > 0) {
						context.save();
						context.scale(actualSpineScale, 1);
						/* spine */
						if (yoodoo.renderComplexity < 2) {
							context.shadowOffsetX = 0;
							context.shadowOffsetY = 0;
							context.shadowBlur = 5;
							context.shadowColor = 'rgba(0,0,0,0.5)';
						}
						context.fillStyle = this.gradient;
						yoodooPlaya.roundedRect(context, 0, 0, yoodooPlaya.book.spine, yoodooPlaya.book.height, yoodooPlaya.book.radius, [true, true, true, true], false);
						context.fill();
						context.shadowBlur = 0;

						/* spine border */

						context.lineWidth = yoodoo.styles.book.border.width;
						context.strokeStyle = 'rgb(' + yoodoo.styles.book.border.r + ',' + yoodoo.styles.book.border.g + ',' + yoodoo.styles.book.border.b + ')';
						var outside = Math.floor(yoodoo.styles.book.border.width / 2);
						if (scaleX > 0) {
							yoodooPlaya.roundedRect(context, -outside, -outside, yoodooPlaya.book.spine + (2 * outside), yoodooPlaya.book.height + (2 * outside), yoodooPlaya.book.radius, [true, true, true, true], false);
							context.stroke();
						}

						context.restore();
					}
					/* face */
					if (scaleX < 1) {
						context.save();
						context.translate(spineWidth, 0);
						context.scale(actualFaceScale, 1);

						context.fillStyle = this.faceGradient;
						if (yoodoo.renderComplexity < 2) {
							context.shadowOffsetX = 0;
							context.shadowOffsetY = 0;
							context.shadowBlur = 5;
							context.shadowColor = 'rgba(0,0,0,0.5)';
						}

						yoodooPlaya.roundedRect(context, 0, 0, yoodooPlaya.book.expandWidth, yoodooPlaya.book.height, yoodooPlaya.book.radius, [true, true, true, true], false);
						context.fill();
						context.shadowBlur = 0;


						/* border */

						context.lineWidth = yoodoo.styles.book.border.width;
						context.strokeStyle = 'rgb(' + yoodoo.styles.book.border.r + ',' + yoodoo.styles.book.border.g + ',' + yoodoo.styles.book.border.b + ')';
						var outside = Math.floor(yoodoo.styles.book.border.width / 2);
						if (scaleX < 1) {
							yoodooPlaya.roundedRect(context, -outside, -outside, yoodooPlaya.book.expandWidth + (2 * outside), yoodooPlaya.book.height + (2 * outside), yoodooPlaya.book.radius, [true, true, true, true], false);
							context.stroke();
						}

						/* earmark */

						context.fillStyle = 'rgba(255,255,255,0.2)';
						yoodooPlaya.drawEarmarkOff(context, 0, 0, earWidth, earWidth, yoodooPlaya.book.radius);
						context.fill();

						context.restore();
					}
					context.translate(-offset.x, -offset.y);
					drawToContext.drawImage(sliceCanvas, 0, 0, sliceCanvas.width, sliceCanvas.height, 0, (s * sliceHeight), sliceCanvas.width, sliceCanvas.height);
				}
			}
			sliceContext = undefined;
			sliceCanvas = undefined;
			// earmarked base
			for (var f = 0; f < this.framecount; f++) {
				var contextEar = this.frames.base.earmarked[f].context;
				contextEar.translate(yoodooPlaya.book.margin, yoodooPlaya.book.margin);
				var scaleX = f / (this.framecount - 1);
				var alpha = scaleX * Math.PI / 2;
				var spineWidth = Math.sin(alpha);
				var actualSpineScale = spineWidth;
				var faceWidth = Math.cos(alpha);
				var actualFaceScale = faceWidth;
				var spineTint = {
					lightness: -faceWidth * 0.3,
					brightness: -faceWidth * 0.1
				};
				var faceTint = [{
					lightness: 0,
					brightness: 0
				}, {
					lightness: -spineWidth * 0.5,
					brightness: -spineWidth * 0.1
				}];
				spineWidth *= yoodooPlaya.book.spine;
				faceWidth *= yoodooPlaya.book.expandWidth;
				var earWidth = this.earWidth;
				var miniEarWidth = earWidth / 2;
				if (miniEarWidth > yoodooPlaya.book.spine / 3) miniEarWidth = yoodooPlaya.book.spine / 3;
				if (yoodoo.renderComplexity == 2) {
					this.gradientEar = yoodooStyler.rgbToHex(yoodooStyler.tint(this.bgcs, spineTint.lightness, spineTint.brightness));
					this.faceGradientEar = yoodooStyler.rgbToHex(yoodooStyler.tint(this.bgt, spineTint.lightness, spineTint.brightness));
					this.earmarkGradient = yoodooStyler.rgbToHex(yoodooStyler.tint(this.bgc, spineTint.lightness, spineTint.brightness));
					this.miniEarmarkGradient = this.earmarkGradient;
				} else {
					var spineGradientColours = [
						yoodooStyler.rgbToHex(yoodooStyler.tint(this.bgcs, spineTint.lightness, spineTint.brightness)),
						yoodooStyler.rgbToHex(yoodooStyler.tint(this.bgts, spineTint.lightness, spineTint.brightness))
					];
					var faceGradientColour = [
						yoodooStyler.rgbToHex(yoodooStyler.tint(this.bgt, faceTint[1].lightness, faceTint[1].brightness)),
						yoodooStyler.rgbToHex(yoodooStyler.tint(this.bgc, faceTint[0].lightness, faceTint[0].brightness))
					];
					this.gradientEar = yoodooPlaya.canvasGradient(contextEar, {
						left: 0,
						top: 0,
						right: yoodooPlaya.book.spine,
						bottom: 0
					}, [
						[0, spineGradientColours[0]],
						[1, spineGradientColours[1]]
					]);

					this.faceGradientEar = yoodooPlaya.canvasGradient(contextEar, {
						left: 0,
						top: 0,
						right: yoodooPlaya.book.expandWidth,
						bottom: 0
					}, [
						[0, faceGradientColour[1]],
						[1, faceGradientColour[0]]
					]);
					this.earmarkGradient = yoodooPlaya.canvasGradient(contextEar, {
						left: earWidth / 2,
						top: earWidth / 2,
						right: earWidth,
						bottom: earWidth
					}, [
						[0, faceGradientColour[1]],
						[1, faceGradientColour[0]]
					]);
					this.miniEarmarkGradient = yoodooPlaya.canvasGradient(contextEar, {
						left: miniEarWidth / 2,
						top: miniEarWidth / 2,
						right: miniEarWidth,
						bottom: miniEarWidth
					}, [
						[0, spineGradientColours[0]],
						[1, spineGradientColours[1]]
					]);
				}
				if (scaleX > 0) {
					contextEar.save();
					contextEar.scale(actualSpineScale, 1);
					/* spine */
					if (yoodoo.renderComplexity < 2) {
						contextEar.shadowOffsetX = 0;
						contextEar.shadowOffsetY = 0;
						contextEar.shadowBlur = 5;
						contextEar.shadowColor = 'rgba(0,0,0,0.5)';
					}
					contextEar.fillStyle = this.gradientEar;
					yoodooPlaya.roundedRect(contextEar, 0, 0, yoodooPlaya.book.spine, yoodooPlaya.book.height, yoodooPlaya.book.radius, [true, true, true, true], miniEarWidth);
					contextEar.fill();
					contextEar.shadowBlur = 0;

					/* earmark */
					if (yoodoo.renderComplexity < 2) {
						contextEar.shadowOffsetX = 1;
						contextEar.shadowOffsetY = 1;
						contextEar.shadowBlur = 3;
						contextEar.shadowColor = 'rgba(0,0,0,0.5)';
					}
					contextEar.fillStyle = this.miniEarmarkGradient;
					yoodooPlaya.drawEarmark(contextEar, 0, 0, miniEarWidth, miniEarWidth, yoodooPlaya.book.radius);
					contextEar.fill();
					contextEar.shadowOffsetX = 0;
					contextEar.shadowOffsetY = 0;
					contextEar.shadowBlur = 0;

					/* spine border */


					contextEar.lineWidth = yoodoo.styles.book.border.width;
					contextEar.strokeStyle = 'rgb(' + yoodoo.styles.book.border.r + ',' + yoodoo.styles.book.border.g + ',' + yoodoo.styles.book.border.b + ')';
					if (scaleX > 0) {
						yoodooPlaya.roundedRect(contextEar, -outside, -outside, yoodooPlaya.book.spine + (2 * outside), yoodooPlaya.book.height + (2 * outside), yoodooPlaya.book.radius, [true, true, true, true], miniEarWidth);
						contextEar.stroke();
					}

					contextEar.restore();
				}
				/* face */
				if (scaleX < 1) {
					contextEar.save();
					contextEar.translate(spineWidth, 0);
					contextEar.scale(actualFaceScale, 1);

					contextEar.fillStyle = this.faceGradientEar;
					if (yoodoo.renderComplexity < 2) {
						contextEar.shadowOffsetX = 0;
						contextEar.shadowOffsetY = 0;
						contextEar.shadowBlur = 5;
						contextEar.shadowColor = 'rgba(0,0,0,0.5)';
					}


					yoodooPlaya.roundedRect(contextEar, 0, 0, yoodooPlaya.book.expandWidth, yoodooPlaya.book.height, yoodooPlaya.book.radius, [true, true, true, true], earWidth);
					contextEar.fill();
					contextEar.shadowBlur = 0;

					/* border */

					contextEar.lineWidth = yoodoo.styles.book.border.width;
					contextEar.strokeStyle = 'rgb(' + yoodoo.styles.book.border.r + ',' + yoodoo.styles.book.border.g + ',' + yoodoo.styles.book.border.b + ')';
					var outside = Math.floor(yoodoo.styles.book.border.width / 2);
					if (scaleX < 1) {
						yoodooPlaya.roundedRect(contextEar, -outside, -outside, yoodooPlaya.book.expandWidth + (2 * outside), yoodooPlaya.book.height + (2 * outside), yoodooPlaya.book.radius, [true, true, true, true], earWidth);
						contextEar.stroke();
					}

					/* earmark */

					if (yoodoo.renderComplexity < 2) {
						contextEar.shadowOffsetX = 1;
						contextEar.shadowOffsetY = 1;
						contextEar.shadowBlur = 3;
						contextEar.shadowColor = 'rgba(0,0,0,0.5)';
						contextEar.fillStyle = this.earmarkGradient;
					}
					yoodooPlaya.drawEarmark(contextEar, 0, 0, earWidth, earWidth, yoodooPlaya.book.radius);
					contextEar.fill();
					contextEar.shadowOffsetX = 0;
					contextEar.shadowOffsetY = 0;
					contextEar.shadowBlur = 0;

					contextEar.restore();
				}

			}



		},
		prerenderTopic: function(colour) {
			var colKey = 'Colour' + colour;
			this.fullWidth = yoodooPlaya.book.spine + yoodooPlaya.book.expandWidth;
			if (this.frames.topic[colKey] === undefined) this.frames.topic[colKey] = [];
			while (this.frames.topic[colKey].length < this.framecount) {
				var nc = document.createElement("canvas");
				nc.width = this.fullWidth + (2 * yoodooPlaya.book.margin);
				nc.height = yoodooPlaya.book.colourBand.height + (2 * yoodooPlaya.book.margin);
				this.frames.topic[colKey].push({
					canvas: nc,
					context: nc.getContext("2d")
				});
			}
			for (var f = 0; f < this.framecount; f++) {
				var context = this.frames.topic[colKey][f].context;
				context.translate(yoodooPlaya.book.margin, yoodooPlaya.book.margin);
				var scaleX = f / (this.framecount - 1);
				var alpha = scaleX * Math.PI / 2;
				var spineWidth = Math.sin(alpha);
				var actualSpineScale = spineWidth;
				var faceWidth = Math.cos(alpha);
				var actualFaceScale = faceWidth;
				var spineTint = {
					lightness: -faceWidth * 0.3,
					brightness: -faceWidth * 0.1
				};
				var faceTint = [{
					lightness: 0,
					brightness: 0
				}, {
					lightness: -spineWidth * 0.5,
					brightness: -spineWidth * 0.1
				}];
				spineWidth *= yoodooPlaya.book.spine;
				faceWidth *= yoodooPlaya.book.expandWidth;
				/*if (yoodoo.renderComplexity==2) {
					this.topicGradient=yoodooStyler.rgbToHex(yoodooStyler.tint(yoodooPlaya.topicColours[colKey].source,spineTint.lightness,spineTint.brightness));
					this.topicFaceGradient=yoodooStyler.rgbToHex(yoodooStyler.tint(yoodooPlaya.topicColours[colKey].tint,spineTint.lightness,spineTint.brightness));
				}else{*/
				var topicGradientColours = [
					yoodooStyler.rgbToHex(yoodooStyler.tint(yoodooPlaya.topicColours[colKey].source, spineTint.lightness, spineTint.brightness)),
					yoodooStyler.rgbToHex(yoodooStyler.tint(yoodooPlaya.topicColours[colKey].tint, spineTint.lightness, spineTint.brightness))
				];
				var topicFaceGradientColours = [
					yoodooStyler.rgbToHex(yoodooStyler.tint(yoodooPlaya.topicColours[colKey].tint, faceTint[1].lightness, faceTint[1].brightness)),
					yoodooStyler.rgbToHex(yoodooStyler.tint(yoodooPlaya.topicColours[colKey].source, faceTint[0].lightness, faceTint[0].brightness))
				];
				this.topicGradient = yoodooPlaya.canvasGradient(context, {
					left: 0,
					top: 0,
					right: yoodooPlaya.book.spine,
					bottom: 0
				}, [
					[0, topicGradientColours[0]],
					[1, topicGradientColours[1]]
				]);

				this.topicFaceGradient = yoodooPlaya.canvasGradient(context, {
					left: 0,
					top: 0,
					right: yoodooPlaya.book.expandWidth,
					bottom: 0
				}, [
					[0, topicFaceGradientColours[1]],
					[1, topicFaceGradientColours[0]]
				]);
				//}
				if (scaleX > 0) {
					context.save();
					context.scale(actualSpineScale, 1);

					/* topic */
					context.fillStyle = this.topicGradient;
					yoodooPlaya.roundedRect(context, 0, 0, yoodooPlaya.book.spine, yoodooPlaya.book.colourBand.height, yoodooPlaya.book.radius, [false, false, true, true]);
					context.fill();
					context.restore();
				}
				/* face */
				if (scaleX < 1) {
					context.save();
					context.translate(spineWidth, 0);
					context.scale(actualFaceScale, 1);
					/* topic */
					context.fillStyle = this.topicFaceGradient;
					yoodooPlaya.roundedRect(context, 0, 0, yoodooPlaya.book.expandWidth, yoodooPlaya.book.colourBand.height, yoodooPlaya.book.radius, [false, false, true, true]);
					context.fill();

					context.restore();
				}

			}



		}
	},
	openCanvas: null,
	canvases: [],
	createCanvas: function(item) {
		if (item.changed === false && item.canvas !== undefined) return item.canvas;
		//while(this.canvases.length<=b) this.canvases.push(document.createElement("canvas"));
		//var item=this.bookcase.object.items[b];
		if (item.canvas === undefined) {
			item.canvas = document.createElement("canvas");
		} else {
			//console.log(item);
		}
		item.fullWidth = this.book.spine + this.book.expandWidth;
		item.canvas.width = item.fullWidth + (2 * this.book.margin);
		item.canvas.height = this.book.height + (2 * this.book.margin);
		item.canvas.item = item;
		item.open = (item.itemIndex == yoodooPlaya.currentBookIndex);
		item.scaleX = (item.itemIndex == yoodooPlaya.currentBookIndex) ? 0 : 1;
		if (item.itemIndex == yoodooPlaya.currentBookIndex) yoodooPlaya.openCanvas = item;

		item.frames = this.animation.framecount;
		item.interval = this.animation.interval;
		$(item.canvas).css({
			margin: "0px " + (-this.book.expandWidth) + "px 0px 0px"
		});
		item.context = item.canvas.getContext("2d");
		item.context.translate(this.book.margin, this.book.margin);
		item.bgc = yoodoo.styles.book.colour;
		item.bgt = yoodooStyler.tint(yoodoo.styles.book.colour, yoodoo.styles.book.colour.tint.lightness, yoodoo.styles.book.colour.tint.brightness);


		if (item.spineColour === undefined || item.spineColour == '' || item.spineColour == '#') item.spineColour = '#999';
		item.colKey = 'Colour' + item.spineColour.replace(/#/, '');
		if (item.colKey == '') {
			item.spineColour = '#999';
			item.colKey = '999';
		}
		if (item.colKey != "" && this.topicColours[item.colKey] === undefined) {
			this.topicColours[item.colKey] = {
				source: yoodooStyler.tint(yoodooStyler.hexToRGB(item.spineColour), yoodoo.styles.book.topic.adjust.lightness, yoodoo.styles.book.topic.adjust.brightness),
				tint: yoodooStyler.tint(yoodooStyler.hexToRGB(item.spineColour), yoodoo.styles.book.topic.tint.lightness, yoodoo.styles.book.topic.tint.brightness)
			};
			yoodooPlaya.animation.prerenderTopic(item.spineColour.replace(/#/, ''));
		}
		item.render = function() {
			this.context.clearRect(-yoodooPlaya.book.margin, -yoodooPlaya.book.margin, this.fullWidth + yoodooPlaya.book.margin, yoodooPlaya.book.height + (2 * yoodooPlaya.book.margin));
			var frame = Math.round(item.scaleX * (yoodooPlaya.animation.framecount - 1));
			var alpha = item.scaleX * Math.PI / 2;
			var spineWidth = Math.sin(alpha);
			var actualSpineScale = spineWidth;
			var faceWidth = Math.cos(alpha);
			var actualFaceScale = faceWidth;
			var lineHeight = parseFloat(yoodooPlaya.book.text.size.replace(/px/, '')) + 2;
			var spineTint = {
				lightness: -faceWidth * 0.3,
				brightness: -faceWidth * 0.1
			};
			var faceTint = [{
				lightness: 0,
				brightness: 0
			}, {
				lightness: -spineWidth * 0.5,
				brightness: -spineWidth * 0.1
			}];
			spineWidth *= yoodooPlaya.book.spine;
			faceWidth *= yoodooPlaya.book.expandWidth;
			if (this.earmarked) {
				this.context.drawImage(
					yoodooPlaya.animation.frames.base.normal[frame].canvas,
					0,
					yoodooPlaya.animation.frames.base.earmarked[frame].canvas.height,
					yoodooPlaya.animation.frames.base.normal[frame].canvas.width,
					yoodooPlaya.animation.frames.base.normal[frame].canvas.height - yoodooPlaya.animation.frames.base.earmarked[frame].canvas.height, -yoodooPlaya.book.margin,
					yoodooPlaya.animation.frames.base.earmarked[frame].canvas.height - yoodooPlaya.book.margin,
					yoodooPlaya.animation.frames.base.normal[frame].canvas.width,
					yoodooPlaya.animation.frames.base.normal[frame].canvas.height - yoodooPlaya.animation.frames.base.earmarked[frame].canvas.height

				);
				this.context.drawImage(yoodooPlaya.animation.frames.base.earmarked[frame].canvas, -yoodooPlaya.book.margin, -yoodooPlaya.book.margin);
			} else {
				this.context.drawImage(yoodooPlaya.animation.frames.base.normal[frame].canvas, -yoodooPlaya.book.margin, -yoodooPlaya.book.margin);
			}
			this.context.drawImage(yoodooPlaya.animation.frames.topic['Colour' + this.spineColour.replace(/#/, '')][frame].canvas, -yoodooPlaya.book.margin, yoodooPlaya.book.height - yoodooPlaya.book.colourBand.height - yoodooPlaya.book.margin);

			if (this.scaleX > 0 && true) {
				this.context.save();
				this.context.rotate(Math.PI / 2);
				this.context.scale(1, actualSpineScale);
				this.context.fillStyle = 'rgba(' + yoodoo.styles.book.spinetext.r + ',' + yoodoo.styles.book.spinetext.g + ',' + yoodoo.styles.book.spinetext.b + ',' + actualSpineScale + ')';
				var th = Math.round(yoodooPlaya.book.spineTextHeight * yoodooPlaya.book.spine);
				this.context.font = th + "px Sans-Serif";
				this.context.fillText(this.title.replace(/&amp;/g, '&'), th, -(yoodooPlaya.book.spine - th) / 2, yoodooPlaya.book.height - yoodooPlaya.book.colourBand.height - yoodooPlaya.book.text.top - th);
				this.context.rotate(-Math.PI / 2);

				/* completed */
				if (this.completed === true) {
					yoodooPlaya.drawTick(
						this.context,
						0,
						yoodooPlaya.book.height - yoodooPlaya.book.colourBand.height - yoodooPlaya.book.spine,
						yoodooPlaya.book.spine,
						yoodooPlaya.book.spine,
						yoodooPlaya.book.spine * 0.1
					);
				}

				/* spine images */
				if (this.typeImage === undefined) {
					var url = '';
					switch (this.type) {
						case 'dooit':
							url = 'playa_item_dooit.png';
							break;
						case 'book':
							url = 'playa_item_episode.png';
							break;
						case 'document':
							url = 'playa_item_doc.png';
							break;
						case 'dooit':
							url = 'playa_dooit.png';
							break;
						case 'book':
							url = 'playa_bookcase.png';
							break;
						case 'document':
							url = 'playa_documents.png';
							break;
					}
					this.typeImage = new Image();
					this.typeImage.context = this.context;
					this.typeImage.contextY = yoodooPlaya.book.height - (yoodooPlaya.book.colourBand.height / 2);
					this.typeImage.width = this.typeImage.height = Math.round(yoodooPlaya.book.imageWidth * yoodooPlaya.book.spine);
					this.typeImage.contextX = Math.round((yoodooPlaya.book.spine - this.typeImage.width) / 2);
					this.typeImage.onload = function() {
						this.context.drawImage(this, this.contextX, this.contextY - (this.height / 2), this.width, this.height);
					};
					this.typeImage.src = yoodoo.option.baseUrl + 'uploads/sitegeneric/image/' + url;
				} else {
					this.typeImage.onload();
				}


				this.context.restore();
			}

			/* face */
			if (this.scaleX < 1 && true) {
				this.context.save();
				this.context.translate(spineWidth, 0);
				this.context.scale(actualFaceScale, 1);
				/* face render */

				this.context.fillStyle = this.spineColour;
				var fs = lineHeight * 1.2;
				this.context.font = fs + "px Sans-Serif";
				this.context.textAlign = "center";

				/* face category */

				var w = yoodooPlaya.book.expandWidth * 0.9;
				var y = 10;
				var x = Math.round(yoodooPlaya.book.expandWidth / 2);
				if (this.category !== undefined) {
					//y+=lineHeight;
					this.context.fillStyle = 'rgba(' + yoodoo.styles.book.topictext.r + ',' + yoodoo.styles.book.topictext.g + ',' + yoodoo.styles.book.topictext.b + ',' + actualFaceScale + ')';
					y = yoodooPlaya.wrapCanvasText(this.context, x, y, this.category.replace(/&amp;/g, '&'), w, fs, null);
					y += lineHeight;
				}


				/* face title */
				this.context.fillStyle = 'rgba(' + yoodoo.styles.book.text.r + ',' + yoodoo.styles.book.text.g + ',' + yoodoo.styles.book.text.b + ',' + actualFaceScale + ')';
				this.context.font = yoodooPlaya.book.text.size + " Sans-Serif";
				this.context.textAlign = "center";

				//var w=yoodooPlaya.book.expandWidth*0.9;
				//var y=10;
				//var x=Math.round(yoodooPlaya.book.expandWidth/2);
				y = yoodooPlaya.wrapCanvasText(this.context, x, y, this.title.replace(/&amp;/g, '&'), w, lineHeight, null);
				y += lineHeight;


				/* face images */
				if (this.thumbImage === undefined) {
					this.thumbImage = new Image();
					this.thumbImage.context = this.context;
					var src = '';
					if (this.imageUrl !== undefined && this.imageUrl != "" && /\.[a-z0-9]{3}$/.test(this.imageUrl)) {
						this.thumbImage.width = Math.round(yoodooPlaya.book.imageWidth * yoodooPlaya.book.expandWidth);
						this.thumbImage.height = (50 * this.thumbImage.width) / 89;
						this.thumbImage.contextX = Math.round((yoodooPlaya.book.expandWidth - this.thumbImage.width) / 2);
						this.thumbImage.contextY = y + (this.thumbImage.height / 2);
						src = this.imageUrl.replace('/crop/167/94/', '/crop/530/297/');
					} else {
						this.thumbImage.width = Math.round(yoodooPlaya.book.imageWidth * yoodooPlaya.book.expandWidth);
						this.thumbImage.width = (50 * this.thumbImage.width) / 89;
						this.thumbImage.height = this.thumbImage.width;
						this.thumbImage.contextX = Math.round((yoodooPlaya.book.expandWidth - this.thumbImage.width) / 2);
						this.thumbImage.contextY = y + (this.thumbImage.height / 2);
						var url = '';
						switch (this.type) {
							case 'dooit':
								url = 'playa_item_dooit.png';
								break;
							case 'book':
								url = 'playa_item_episode.png';
								break;
							case 'document':
								url = 'playa_item_doc.png';
								break;
						}
						src = yoodoo.option.baseUrl + "uploads/sitegeneric/image/" + url;
					}
					this.thumbImage.onload = function() {
						this.context.drawImage(this, this.contextX, this.contextY - (this.height / 2), this.width, this.height);
					};
					this.thumbImage.src = src;
				} else {
					this.thumbImage.onload();
				}
				y += lineHeight + this.thumbImage.height;


				this.context.textAlign = "left";
				x -= w / 2;
				/* face description */
				if (this.shortDescription !== undefined && this.shortDescription != '') {
					var txt = this.shortDescription.replace(/&amp;/g, '&').split('&#13;');
					var mh = yoodooPlaya.book.height - y - (3 * lineHeight) - yoodooPlaya.book.colourBand.height;
					for (var i = 0; i < txt.length; i++) {
						y = yoodooPlaya.wrapCanvasText(this.context, x, y, txt[i], w, lineHeight, mh);
					}
				}
				y += lineHeight;


				/* face adhoc */
				if (this.completed) {
					if (this.score !== undefined && this.score > 0) {
						var txt = this.score.replace(/&amp;/g, '&').split('&#13;');
						var mh = yoodooPlaya.book.height - y - yoodooPlaya.book.colourBand.height;
						for (var i = 0; i < txt.length; i++) {
							y = yoodooPlaya.wrapCanvasText(this.context, x, y, yoodoo.w('score') + ': ' + this.score, w, lineHeight, mh);
						}
					}

				} else {
					if (this.duration !== undefined && this.duration != '') {
						var txt = this.duration.replace(/&amp;/g, '&').split('&#13;');
						var mh = yoodooPlaya.book.height - y - yoodooPlaya.book.colourBand.height;
						for (var i = 0; i < txt.length; i++) {
							y = yoodooPlaya.wrapCanvasText(this.context, x, y, yoodoo.w('duration') + ': ' + this.duration, w, lineHeight, mh);
						}
					}
				}

				/* cta */
				var txt = yoodoo.w('view' + this.type + 'prompt');
				this.context.textAlign = 'center';
				var wasStyle = this.context.fillStyle;
				if (yoodooStyler.isDark(yoodooPlaya.topicColours[this.colKey].source)) {
					this.context.fillStyle = 'rgba(255,255,255,' + actualFaceScale + ')';
				} else {
					this.context.fillStyle = 'rgba(0,0,0,' + actualFaceScale + ')';
				}
				var ty = yoodooPlaya.book.height - (yoodooPlaya.book.colourBand.height / 2) - (lineHeight / 2);
				for (var i = 0; i < txt.length; i++) {
					y = yoodooPlaya.wrapCanvasText(this.context, yoodooPlaya.book.expandWidth / 2, ty, txt, w, lineHeight, null);
				}
				this.context.fillStyle = wasStyle;

				this.context.restore();
			}

			$(this.canvas).css({
				'margin-right': (-(this.fullWidth - spineWidth - faceWidth))
			});
		};
		item.render();
		if (!yoodoo.is_touch) {
			$(item.canvas).bind("mousemove", function(e) {
				if (this.item.open) {
					var pos = $(this).offset();
					var h = Math.sqrt(Math.pow(e.pageX - pos.left, 2) + Math.pow(e.pageY - pos.top, 2));
					if (h < yoodooPlaya.book.expandWidth / 5) {
						yoodooPlaya.bubble(e, this.item.earmarked ? yoodoo.w('removeearmark') : yoodoo.w('earmarkthisitem', {
							type: this.item.type
						}));
					} else {
						yoodooPlaya.loseBubble();
					}
				}
			}).bind("mouseleave", function() {
				yoodooPlaya.loseBubble();
			});
		}
		item.canvas.selected = function(e) {
			yoodooPlaya.centreTimerClear();
			yoodooPlaya.currentBookIndex = this.item.itemIndex;
			var pos = $(this).offset();
			if (typeof(e) == 'object' && this.item.open) {
				var h = Math.sqrt(Math.pow(e.pageX - pos.left, 2) + Math.pow(e.pageY - pos.top, 2));
				if (h < yoodooPlaya.book.expandWidth / 5) {
					this.item.earmarked = !this.item.earmarked;
					yoodoo.earmark(this.item.content_id, this.item.earmarked);
					this.item.render();
				} else {
					yoodooPlaya.openItem(this.item);
				}
			} else {
				this.item.toggle((e === true) ? true : false);
			}
		};
		item.toggle = function(e) {
			if (!this.open) {
				if (yoodooPlaya.openCanvas !== null) yoodooPlaya.openCanvas.shrink();
				yoodooPlaya.openCanvas = this;
				if (e === true || e === false) this.autoplay = e;
				this.grow();
			} else if (e == true) {
				this.autoplay = true;
				this.grow();
			} else if (e !== false) {
				yoodooPlaya.openItem(this);
			}
		};
		item.grow = function() {
			this.open = true;
			clearTimeout(this.timer);
			this.scaleX -= 1 / this.frames;
			if (this.scaleX <= 0) this.scaleX = 0;
			this.render();
			if (this.scaleX > 0) {
				this.timer = setTimeout('yoodooPlaya.bookcase.object.items[' + this.itemIndex + '].grow();', this.interval);
			} else {
				this.grown();
			}
		};
		item.grown = function() {
			var x = $(this.canvas).offset().left - $(this.canvas.parentNode).offset().left;
			x -= (yoodooPlaya.bookcase.width - yoodooPlaya.book.expandWidth) / 2;
			yoodooPlaya.containers.bookcaseViewport.animate({
				scrollLeft: x
			});
			if (this.autoplay) yoodooPlaya.openItem(this);
		};
		item.shrink = function() {
			this.open = false;
			clearTimeout(this.timer);
			this.scaleX += 1 / this.frames;
			if (this.scaleX >= 1) this.scaleX = 1;
			this.render();
			if (this.scaleX < 1) this.timer = setTimeout('yoodooPlaya.bookcase.object.items[' + this.itemIndex + '].shrink();', this.interval);
		};
		return item.canvas;

	},
	bubbleBox: null,
	bubble: function(e, txt) {
		if (this.bubbleBox === null) {
			this.bubbleBox = document.createElement("div");
			$(this.bubbleBox).addClass(yoodoo.class_prefix + "_playa_bubble");
			$(document.body).append(this.bubbleBox);
		}
		$(this.bubbleBox).html(txt).css({
			top: e.pageY - window.scrollY + 30,
			left: e.pageX - window.scrollX,
			display: "block"
		});
	},
	loseBubble: function() {
		$(this.bubbleBox).css({
			display: "none"
		});
	},
	drawTick: function(ctx, x, y, w, h) {
		var mem = {
			fillStyle: ctx.fillStyle,
			strokeStyle: ctx.strokeStyle,
			lineWidth: ctx.lineWidth
		};
		ctx.fillStyle = 'rgb(0,200,0)';
		ctx.strokeStyle = 'rgb(0,0,0)';
		ctx.lineWidth = 1;
		var m = 2;
		if (arguments.length > 5) m = arguments[5];
		var dx = (w - (2 * m)) / 20;
		var dy = (h - (2 * m)) / 20;
		x += m;
		y += m;
		ctx.beginPath();
		ctx.moveTo(x + (3 * dx), y + (7 * dy));
		ctx.lineTo(x + (7 * dx), y + (12 * dy));
		ctx.lineTo(x + (16 * dx), y);
		ctx.lineTo(x + (20 * dx), y + (4 * dy));
		ctx.lineTo(x + (7 * dx), y + (20 * dy));
		ctx.lineTo(x, y + (12 * dy));
		ctx.closePath();
		ctx.fill();
		ctx.stroke();
		ctx.fillStyle = mem.fillStyle;
		ctx.strokeStyle = mem.strokeStyle;
		ctx.lineWidth = mem.lineWidth;
	},
	drawEarmark: function(ctx, x, y, w, h, r) {
		if (r > (w * 0.5)) r = w * 0.5;
		ctx.beginPath();
		ctx.moveTo(x + w, y);
		ctx.lineTo(x + w, y + h - r);
		if (BrowserDetect.browser == "Opera") {
			ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
		} else {
			ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
		}
		ctx.lineTo(x, y + h);
		ctx.closePath();
	},
	drawEarmarkOff: function(ctx, x, y, w, h, r) {
		if (r > (w * 0.5)) r = w * 0.5;
		ctx.beginPath();
		ctx.moveTo(x + w, y);
		ctx.lineTo(x + r, y);
		if (BrowserDetect.browser == "Opera") {
			ctx.quadraticCurveTo(x, y, x, y + r);
		} else {
			ctx.arcTo(x, y, x, y + r, r);
		}
		ctx.lineTo(x, y + h);
		ctx.closePath();
	},
	roundedRect: function(ctx, x, y, w, h, r) {
		var corners = [true, true, true, true];
		if (arguments.length > 6) corners = arguments[6];
		var earmarked = false;
		if (arguments.length > 7) earmarked = arguments[7];
		ctx.beginPath();
		if (earmarked !== false) {
			ctx.moveTo(x + earmarked, y);
		} else {
			ctx.moveTo(x + (w / 2), y);
		}
		if (corners[1]) {
			if (BrowserDetect.browser == "Opera") {
				ctx.lineTo(x + w - r, y);
				ctx.quadraticCurveTo(x + w, y, x + w, y + r);

			} else {
				ctx.lineTo(x + w - r, y);
				ctx.arcTo(x + w, y, x + w, y + r, r);
			}
		} else {
			ctx.lineTo(x + w, y);
		}

		if (corners[2]) {
			if (BrowserDetect.browser == "Opera") {
				ctx.lineTo(x + w, y + h - r);
				ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
			} else {
				ctx.lineTo(x + w, y + h - r);
				ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
			}
		} else {
			ctx.lineTo(x + w, y + h);
		}

		if (corners[3]) {
			if (BrowserDetect.browser == "Opera") {
				ctx.lineTo(x + r, y + h);
				ctx.quadraticCurveTo(x, y + h, x, y + h - r);
			} else {
				ctx.lineTo(x + r, y + h);
				ctx.arcTo(x, y + h, x, y + h - r, r);
			}
		} else {
			ctx.lineTo(x, y + h);
		}

		if (earmarked !== false) {
			ctx.lineTo(x, y + earmarked);
		} else if (corners[0]) {
			if (BrowserDetect.browser == "Opera") {
				ctx.lineTo(x, y + r);
				ctx.quadraticCurveTo(x, y, x + r, y, r);
			} else {
				ctx.lineTo(x, y + r);
				ctx.arcTo(x, y, x + r, y, r);
			}
		} else {
			ctx.lineTo(x, y);
		}
		ctx.closePath();
	},
	wrapCanvasText: function(ctx, x, y, txt, maxWidth, lineHeight, maxHeight) {
		var height = (maxHeight === null) ? null : maxHeight + y;
		var op = [];
		var words = txt.split(' ');
		var line = '';
		for (var w = 0; w < words.length; w++) {
			var testText = line + words[w] + ' ';
			var metrics = ctx.measureText(testText);
			if (metrics.width > maxWidth) {
				y += lineHeight;
				ctx.fillText(line, x, y);
				line = words[w] + ' ';
				if (height !== null && y > height) return y;
			} else {
				line = testText;
			}
		}
		y += lineHeight;
		ctx.fillText(line, x, y);
		return y;
	},
	canvasGradients: {},
	canvasGradient: function(context, pos, stops) {
		if (yoodoo.renderComplexity == 2) {
			var g = stops[0][0];
		} else {
			var g = context.createLinearGradient(pos.left, pos.top, pos.right, pos.bottom);
			for (var s = 0; s < stops.length; s++) {
				g.addColorStop(stops[s][0], stops[s][1]);
			}
		}
		return g;
	},
	renderBookcase: function() {
		if (this.asCanvas) return this.renderBookcaseCanvas();
	},
	openBook: function() {
		var i = 0;
		if (arguments.length > 0) {
			i = $(arguments[0].parentNode.parentNode).prevAll('.' + yoodoo.class_prefix + '_bookcaseItem').get().length;
		} else {
			i = this.currentBookIndex;
		}
		this.openItem(this.bookcase.object.items[i]);
	},
	openItem: function(item) {
		if (item.type == "dooit") yoodooPlaya.showDooit(item.id);
		if (item.type == "book") yoodooPlaya.showEpisode(item.id);
		if (item.type == "document") {
			switch (item.fragment_type) {
				case 'url':
					window.open(item.file, item.title);
					break;
				case 'pdf':
					window.open(item.file, item.title);
					break;
				case 'reference':
					window.open(item.file, item.title);
					break;
				case 'podcast':
					window.open(item.file, item.title);
					break;
			}
		}
	},
	showDooit: function(id) {
		yoodoo.showDooit(id);
	},
	showEpisode: function(id) {
		this.destroyEpisode();
		yoodoo.getbookxml(id);
	},
	fetchQuiz: function(content_id) {
		this.movie.playHead.pause();
		yoodoo.sendPost(null, {
			cmd: 'xmlquiz',
			context: yoodooPlaya,
			callback: 'yoodooPlaya.gotQuiz',
			contentid: content_id
		});
	},
	gotQuiz: function(txt) {
		var xml = yoodoo.parseXML(yoodoo.decodeHTMLResponse(txt));
		this.quiz.load(xml);
		yoodooQuiz.init(this.quiz);
	},
	gotEpisode: function(txt) {
		var xml = yoodoo.parseXML(txt);
		this.episode = new yoodoo.element.book(xml.firstChild);
		this.episode.isComplete = false;
		this.episode.bookcaseItem = yoodoo.bookcase.items[yoodoo.bookcaseIndex(this.episode.type, this.episode.id)];
		if (this.episode.bookcaseItem.completed != undefined) this.episode.isComplete = this.episode.bookcaseItem.completed;
		this.displayEpisode();
	},
	displayEpisode: function() {
		$(yoodoo.episodeContainer).html("<div class='" + yoodoo.class_prefix + "_episode_container'></div>");
		this.episode.chapter = 0;
		if (this.autoplayChapter !== null) {
			var c = 0;
			while (c < yoodooPlaya.episode.chapters.length && yoodooPlaya.autoplayChapter !== null) {
				if (parseInt(yoodooPlaya.episode.chapters[c].id) == parseInt(yoodooPlaya.autoplayChapter)) this.episode.chapter = c;
				c++;
			}
		}
		yoodooPlaya.autoplayChapter = null;

		this.renderEpisode($(yoodoo.episodeContainer).find('.' + yoodoo.class_prefix + '_episode_container').get(0));
		this.renderChapters();
		$(yoodoo.episodeContainer).fadeIn(500, function() {
			$(yoodoo.playaContainer).css("display", "none");
			yoodooPlaya.marquees(yoodooPlaya.episode.containers.heading);
		});
		if (yoodooPlaya.autoplayChapter === null) yoodooPlaya.setChapter('new');
	},
	destroyEpisode: function() {
		if (this.movie.playHead.playing) this.movie.playHead.pause();
		this.episode = [];
		this.dropmarquees(yoodooPlaya.episodeContainer);
		$(yoodoo.episodeContainer).fadeOut(function() {
			$(this).html('');
		});
	},
	showBookcase: function() {
		if (this.episode.length == 0) {
			$(yoodooPlaya.containers.bookcase.parentNode).css({
				display: "block"
			});
			if (this.firstTime && yoodoo.flash_message !== null) {
				setTimeout('yoodooPlaya.hideWelcomeMessage();', 5000);
			} else {
				this.slideToOpen();
			}
		}
	},
	hideBookcase: function() {
		$(yoodooPlaya.containers.bookcase.parentNode).css({
			display: "none"
		});
		window.scrollTo(0, 1);
	},
	scrapbookAddItem: function(id) {
		if (window.confirm(yoodoo.w('addthistoyourscrapbookandleavethisepisodetoopenthescrapbook'))) {
			yoodoo.scrapbookAddItem(id);
			this.destroyEpisode();
		}
	},
	renderQuiz: function() {
		this.movie.playHead.pause();
		this.hideEpisode();
		this.quiz = this.episode.chapters[this.episode.chapter];
		yoodoo.working(yoodoo.w('fetchquiz'));
		this.fetchQuiz(this.quiz.id);
	},
	hideEpisode: function() {
		$(this.episodeTarget).css({
			display: "none"
		});
	},
	revealEpisode: function() {
		$(this.episodeTarget).css({
			display: "block"
		});
	},
	renderEpisode: function(target) {
		this.episodeTarget = target;
		this.hideBookcase();
		var op = "";
		var butins = "<div class='" + yoodoo.class_prefix + "_buttons " + yoodoo.class_prefix + "_overlay' style='float:left;width:" + this.button.width + "px;height:" + (this.height - (2 * this.button.container.margin)) + "px;margin:" + this.button.container.margin + "px;'>";
		for (var b = 0; b < this.episode_buttons.length; b++) {
			if (this.episode_buttons[b].container == undefined) {
				butins += this.build_button(this.episode_buttons[b]);
			} else {
				butins += '<' + this.episode_buttons[b].container + ' class="' + yoodoo.class_prefix + '_' + this.episode_buttons[b].className + '">';
				for (var bb = 0; bb < this.episode_buttons[b].children.length; bb++) {
					butins += this.build_button(this.episode_buttons[b].children[bb]);
				}
				butins += '</' + this.episode_buttons[b].container + '>';
			}
		}
		butins += "</div>";
		var ew = this.width - (this.button.width + (2 * this.button.container.margin)) - (1 * this.episode.settings.boundary);
		op += "<div class='" + yoodoo.class_prefix + "_episode_heading' >";


		op += "<div><h2";
		if (yoodoo.intervention === null) {
			if (this.episode.scrapbooked) {
				op += " onclick='yoodooPlaya.showScrapbook(" + this.episode.id + ")' class='" + yoodoo.class_prefix + "_scrapbook_show'";
			} else {
				op += " onclick='yoodooPlaya.scrapbookAddItem(" + this.episode.id + ")' class='" + yoodoo.class_prefix + "_scrapbook_add'";
			}
		}
		op += "><div class='marquee'><div>" + this.episode.title + "</div></div>";
		if (yoodoo.intervention === null) op += "<span>" + (this.episode.scrapbooked ? yoodoo.w('clicktoshowinscrapbook') : yoodoo.w('clicktoaddtoscrapbook')) + "</span>";
		op += "</h2></div>";

		if (this.episode.chapters.length > 0) {


			op += "<div><h3";
			op += "><div class='marquee'><div>" + this.episode.chapters[this.episode.chapter].title + "</div></div>";
			if (yoodoo.intervention === null) op += "<span>" + this.episode.chapters[this.episode.chapter].scrapbooked ? yoodoo.w('clicktoshowinscrapbook') : yoodoo.w('clicktoaddtoscrapbook') + "</span>";
			//op += this.episode.chapters[this.episode.chapter].scrapbooked?this.translation.scrapbookShow:this.translation.scrapbookAdd;
			op += "</h3></div>";


			op += "</div>";
			op += "<div style='overflow:hidden'>";
			op += "<div class='" + yoodoo.class_prefix + "_movie'></div>";
			op += "<div class='" + yoodoo.class_prefix + "_keypoints'></div>";
			op += "<div style='clear:both'></div>";
			op += "</div>";
			op += "<div class='" + yoodoo.class_prefix + "_chapters'></div>";
			op = butins + "<div style='padding:" + this.episode.settings.boundary + "px 0px " + this.episode.settings.boundary + "px " + this.episode.settings.boundary + "px;float:left;width:" + ew + "px'' class='" + yoodoo.class_prefix + "_episodeInnerContainer'>" + op + "</div>";
			op += "<div class='" + yoodoo.class_prefix + "_keypointDisplay'></div>";
			$(target).html(op);
			$(yoodoo.episodeContainer).css("visibility", "hidden");
			$(yoodoo.episodeContainer).css("display", "block");
			this.episode.settings.heading.height = $(target).find('.' + yoodoo.class_prefix + "_episode_heading").outerHeight(false);
			$(yoodoo.episodeContainer).css("display", "none");
			$(yoodoo.episodeContainer).css("visibility", "visible");
			this.episode.containers = {};
			this.episode.containers.buttons = $(target).find('.' + yoodoo.class_prefix + "_buttons");
			this.episode.containers.heading = $(target).find('.' + yoodoo.class_prefix + "_episode_heading");
			this.episode.containers.movie = $(target).find('.' + yoodoo.class_prefix + "_movie");
			this.episode.containers.keypoints = $(target).find('.' + yoodoo.class_prefix + "_keypoints");
			this.episode.containers.keypoint = $(target).find('.' + yoodoo.class_prefix + "_keypointDisplay");
			this.episode.containers.chapters = $(target).find('.' + yoodoo.class_prefix + "_chapters");

			this.episode.containers.keypoint.css({
				position: 'absolute',
				width: this.width,
				height: this.height,
				top: 0,
				right: 0,
				display: 'none',
				'z-index': 57
			});

			this.episode.containers.heading.css({
				"margin-bottom": this.episode.settings.boundary + "px",
				"margin-right": this.episode.settings.boundary + "px"
			});
			this.episode.containers.movie.css("margin", '0px ' + this.episode.settings.boundary + 'px 0px 0px');
			this.episode.containers.keypoints.css("margin", '0px');
			this.episode.containers.chapters.css({
				"padding-top": this.episode.settings.boundary + "px",
				"margin-right": this.episode.settings.boundary + "px"
			});

			this.episode.settings.chapters.width = $("." + yoodoo.class_prefix + "_episodeInnerContainer").width() - (2 * this.episode.settings.boundary);
			this.episode.settings.movie.progress.height = Math.floor(this.height * this.episode.settings.movie.progress.proportion);
			if (this.episode.settings.movie.progress.height > this.episode.settings.movie.progress.maxHeight) this.episode.settings.movie.progress.height = this.episode.settings.movie.progress.maxHeight;
			if (this.episode.settings.movie.progress.height < this.episode.settings.movie.progress.minHeight) this.episode.settings.movie.progress.height = this.episode.settings.movie.progress.minHeight;

			var maxmh = this.height - (5 * this.episode.settings.boundary) - this.episode.settings.heading.height - this.episode.settings.chapters.minHeight - this.episode.settings.movie.progress.height;
			var mw = Math.ceil(this.episode.settings.movie.proportion * (ew - (2 * this.episode.settings.boundary)));
			if (Math.sqrt(Math.pow(this.episode.settings.movie.originalWidth - mw, 2)) < this.episode.settings.movie.tolerance) mw = this.episode.settings.movie.originalWidth;
			var kw = ew - (1 * this.episode.settings.boundary) - mw;
			if (kw < this.episode.settings.keypoints.minWidth) {
				kw = this.episode.settings.keypoints.minWidth;
				mw = ew - (1 * this.episode.settings.boundary) - kw;
			}
			var mh = Math.round(mw / this.episode.settings.movie.aspect);
			if (mh > maxmh) {
				mh = maxmh;
				mw = Math.round(mh * this.episode.settings.movie.aspect);
				kw = ew - (1 * this.episode.settings.boundary) - mw;
			}
			this.episode.settings.movie.width = mw;
			this.episode.settings.movie.height = mh;
			this.episode.settings.keypoints.height = mh + this.episode.settings.boundary + this.episode.settings.movie.progress.height;
			this.episode.settings.keypoints.width = kw;
			this.episode.settings.chapters.height = this.height - (4 * this.episode.settings.boundary) - this.episode.settings.heading.height - this.episode.settings.keypoints.height;

			this.episode.containers.movie.css({
				height: this.episode.settings.movie.height + this.episode.settings.movie.progress.height + this.episode.settings.boundary,
				width: this.episode.settings.movie.width,
				position: 'relative'
			}).addClass(yoodoo.class_prefix + "_movieObject");
			this.episode.containers.keypoints.css({
				height: this.episode.settings.keypoints.height,
				width: this.episode.settings.keypoints.width
			});
			this.episode.containers.chapters.css({
				height: this.episode.settings.chapters.height
			});

			this.movie.init();

			this.episode.containers.timeline = $(target).find('.' + yoodoo.class_prefix + "_timeline");
			this.episode.containers.timeline.css({
				height: this.episode.settings.movie.progress.height,
				margin: this.episode.settings.boundary + 'px 0px 0px 0px'
			});
			this.episode.containers.timeline.find("." + yoodoo.class_prefix + "_timeline,." + yoodoo.class_prefix + "_progress,." + yoodoo.class_prefix + "_buffer").css({
				height: this.episode.settings.movie.progress.height
			});
			$(this.episode.video).attr("width", this.episode.settings.movie.width);
			$(this.episode.video).attr("height", this.episode.settings.movie.height);
			$(this.episode.video).attr("webkit-playsinline", "");

			this.detectVideoType();

		} else {
			op += "</div>";
		}
	},
	marqs: {},
	marquees: function(o) {
		$(o).find(".marquee").each(function(i, e) {
			//if (e.processed==undefined) {
			clearTimeout(e.timer);
			e.processed = true;
			var i = 0;
			for (var ii in yoodooPlaya.marqs) i++;
			e.index = i;
			var id = 'marq' + i;
			yoodooPlaya.marqs[id] = this;
			e.id = id;
			e.marquee = $(e).find(">div").get(0);
			$(e.marquee).css({
				position: "absolute"
			});
			var perform = ($(e.marquee).outerWidth(false) > $(e).width());
			if (perform) {
				e.marqueeWidth = $(e.marquee).outerWidth(false) + $(e).outerWidth(false);
				$(e.marquee).css({
					width: e.marqueeWidth,
					position: "static"
				});
				$(e).css({
					overflow: "hidden"
				});
			}
			$(e.marquee).css({
				position: "static"
			});
			if (perform) {
				e.process = function() {
					var was = this.scrollLeft * 1;
					this.scrollLeft++;
					if (was != this.scrollLeft) {
						this.timer = setTimeout('yoodooPlaya.marqs.' + this.id + '.process();', 20);
					} else {
						$(this).css({
							opacity: 0
						});
						this.scrollLeft = 0;
						$(this).animate({
							opacity: 1
						}, 500, function() {
							this.timer = setTimeout('yoodooPlaya.marqs.' + this.id + '.process();', 1000);
						});
					}
				};
				e.process();
			}
			//}
		});
	},
	dropmarquees: function(o) {
		$(o).find(".marquee").each(function(i, e) {
			clearTimeout(e.timer);
		});
	},
	audio: {
		file: null,
		object: null,
		source: null,
		onUpdate: function() {},
		onComplete: function() {},
		playing: false,
		autoplay: false,
		updateTimer: null,
		updateInterval: 100,
		additionalType: [{
				mime: 'audio/ogg',
				subfolder: 'ogg',
				extension: 'ogg',
				codecs: 'vorbis'
			}
			//{mime:'audio/m4a',subfolder:'m4a',extension:'m4a',codecs:'vorbis'}
		],
		playType: -1, // -1 = default mp3
		init: function() {
			if (this.object === null) {
				//this.object=new Audio();
				this.object = document.createElement("audio");
				this.object.volume = yoodoo.option.voiceoverMovie.flashvars.volume / 100;
				//		       		if (!this.mobile) 
				$(this.object).attr("onloadedmetadata", 'yoodooPlaya.audio.loaded()');
				//this.object.onloadeddata=function() {yoodooPlaya.audio.loaded();};
				$(this.object).attr("onerror", 'alert("Audio error")');
				$(this.object).attr("onended", 'yoodooPlaya.audio.ended()');
				$(this.object).attr("ontimeupdate", 'yoodooPlaya.audio.update()');
				$(this.object).attr("onprogress", 'yoodooPlaya.audio.update()');
				$(this.object).attr("preload", "auto");
				//$(this.object).attr("controls","controls").css({position:"fixed",top:0,left:0,'z-index':999}).html("Not supported");
				//$(this.object).attr("autoplay","autoplay");
				//this.source=document.createElement("source");
				//$(this.source).attr("type",'audio/mpeg;codecs="mp3"');
				//this.object.appendChild(this.source);
				yoodoo.frame.appendChild(this.object);
				//alert(this.object.canPlayType('audio/mpeg'));
				//alert(this.object.canPlayType('audio/mpeg'));
				if (!this.object.canPlayType('audio/mpeg')) {
					for (var i = 0; i < this.additionalType.length; i++) {
						//alert(this.object.canPlayType(this.additionalType[i].mime));
						if (this.object.canPlayType(this.additionalType[i].mime)) this.playType = i;
					}
				}
				if (this.playType < 0) {
					$(this.source).attr("type", 'audio/mpeg;codecs="mp3"');
				} else {
					$(this.source).attr("type", this.additionalType[this.playType].mime + ';' + (this.additionalType[this.playType].codecs ? 'codecs="' + this.additionalType[this.playType].codecs + '"' : ''));
				}
				//console.log(this.object);
			}
		},
		clear: function() {
			while (this.object.childNodes.length > 0) this.object.removeChild(this.object.childNodes[0]);
		},
		ended: function() {
			this.pause();
			this.onComplete();
		},
		loaded: function() {
			if (this.autoplay) this.play();
			this.autoplay = false;
		},
		typeUrl: function(url) {
			if (this.playType < 0) return url;
			var turl = url.replace(/^(.*)\/([^\/]+)\.([^\/]+)$/, '$1/' + this.additionalType[this.playType].subfolder + '/' + '$2.' + this.additionalType[this.playType].extension);
			return turl;
		},
		load: function(url) {
			this.clear();
			if (yoodooPlaya.localFiles) url = url.replace(/^http\:\/\/feserver\.yoodidit\.co\.uk\//, yoodoo.option.baseUrl);
			this.source = document.createElement("source");
			//url='http://www.yoodoo.co/uploads/audio/test.mp3';
			if (arguments.length > 1) {
				if (arguments[1].onUpdate != undefined) {
					this.onUpdate = arguments[1].onUpdate;
				} else {
					this.onUpdate = function() {};
				}
				if (arguments[1].onComplete != undefined) {
					this.onComplete = arguments[1].onComplete;
				} else {
					this.onComplete = function() {};
				}
			} else {
				this.onComplete = function() {};
				this.onUpdate = function() {};
			}
			//this.autoplay=false;
			this.playing = false;
			this.file = this.typeUrl(url);
			this.source.src = this.file;
			this.object.appendChild(this.source);
			this.object.load();
		},
		preload: function() {
			this.autoplay = false;
			if (arguments.length > 1) {
				this.load(arguments[0], arguments[1]);
			} else {
				this.load(arguments[0]);
			}
			//this.object.play();
			//this.object.pause();
		},
		loadAndPlay: function() {
			this.autoplay = true;
			if (arguments.length > 1) {
				this.load(arguments[0], arguments[1]);
			} else {
				this.load(arguments[0]);
			}
			if (this.mobile) this.play();
		},
		play: function() {
			this.playing = true;
			this.object.play();
		},
		pause: function() {
			this.playing = false;
			this.autoplay = false;
			this.object.pause();
		},
		update: function() {
			var st = this.status();
			this.onUpdate(st);
		},
		status: function() {
			var reply = {};
			if (this.object.buffered.length > 0) {
				reply.buffer = this.object.buffered.end(0) - this.object.buffered.start(0);
			} else {
				reply.buffer = 0;
			}
			reply.buffer = 100 * (reply.buffer / this.object.duration);
			reply.currentTime = this.object.currentTime;
			reply.volume = this.object.volume;
			reply.duration = this.object.duration;
			reply.state = this.object.readyState;
			reply.buffering = (reply.state > 1 && reply.state < 4);
			reply.bufferedAhead = (this.object.duration - this.object.currentTime);
			reply.progress = 100 * (this.object.currentTime / this.object.duration);
			return reply;
		}
	},
	movie: {
		autoPlay: false,
		overlay: null,
		completeMessage: null,
		video: null,
		timeline: null,
		progress: null,
		progressSlide: null,
		updateTimer: null,
		updateInterval: 100,
		cancelled: false,
		src: null,
		init: function() {
			this.completeMessage = document.createElement("div");
			$(this.completeMessage).css({
				height: yoodooPlaya.episode.settings.movie.height,
				width: yoodooPlaya.episode.settings.movie.width
			}).addClass(yoodoo.class_prefix + "_complete");
			this.overlay = document.createElement("div");
			this.overlay.appendChild(document.createElement("div"));
			$(this.overlay).css({
				height: yoodooPlaya.episode.settings.movie.height,
				width: yoodooPlaya.episode.settings.movie.width
			}).addClass(yoodoo.class_prefix + "_moviePlaybutton");
			$(this.overlay).find('>div').css({
				height: yoodooPlaya.episode.settings.movie.height,
				width: yoodooPlaya.episode.settings.movie.width
			});
			this.timeline = document.createElement("div");
			$(this.timeline).addClass(yoodoo.class_prefix + "_timeline");
			this.buffer = document.createElement("div");
			$(this.buffer).addClass(yoodoo.class_prefix + "_buffer");
			this.timeline.appendChild(this.buffer);
			this.progress = document.createElement("div");
			$(this.progress).addClass(yoodoo.class_prefix + "_progress");
			this.timeline.appendChild(this.progress);
			this.progressSlide = document.createElement("div");
			$(this.progressSlide).addClass(yoodoo.class_prefix + "_progressSlide");
			this.timeline.appendChild(this.progressSlide);
			this.video = document.createElement("video");
			$(this.video).bind("load", function() {
				yoodooPlaya.movie.buffering(false);
			});
			//$(this.video).attr("onloadedmetadata", 'console.log(yoodooPlaya.movie.autoPlay,"onloadedmetadata");yoodooPlaya.movie.loaded()');
			//$(this.video).attr("onloadeddata", 'console.log(yoodooPlaya.movie.autoPlay,"onloadeddata");yoodooPlaya.movie.buffering(false)');
			$(this.video).attr("oncanplay", 'yoodooPlaya.movie.buffering(false)');
			$(this.video).attr("onwaiting", 'yoodooPlaya.movie.buffering(true)');
			$(this.video).attr("width", yoodooPlaya.episode.settings.movie.width);
			$(this.video).attr("height", yoodooPlaya.episode.settings.movie.height);
			$(this.video).attr("autobuffer", "autobuffer");
			$(this.video).attr("autoplay", "yes");
			$(this.video).attr("preload", "auto");
			$(this.video).attr("poster", "");
			$(this.video).attr("webkit-playsinline", "");
			$(this.video).bind("ended", function() {
				yoodooPlaya.movie.complete();
			});
			yoodooPlaya.episode.containers.movie.get(0).appendChild(this.video);
			yoodooPlaya.episode.containers.movie.get(0).appendChild(this.overlay);
			yoodooPlaya.episode.containers.movie.get(0).appendChild(this.timeline);
			yoodooPlaya.episode.containers.movie.get(0).appendChild(this.completeMessage);
			$(this.overlay).bind("click", function() {
				if ($(this).hasClass("playing")) {
					$(this).removeClass("playing");
					yoodooPlaya.movie.playHead.pause();
				} else {
					$(this).addClass("playing");
					yoodooPlaya.movie.playHead.play();
				}
			});
			if (yoodoo.is_touch) {
				$(this.timeline).bind("touchstart", function(e) {
					e.preventDefault();
					$(yoodooPlaya.movie.progressSlide).css({
						display: "block"
					});
					var pc = yoodooPlaya.movie.positionProgressSlide(e.originalEvent.touches[0]);
					this.status = yoodooPlaya.movie.playHead.status();
					var time = this.status.duration * pc / 100;
					$(yoodooPlaya.movie.progressSlide).html(yoodoo.secsToMins(time));
				});
				$(this.timeline).bind('touchmove', function(e) {
					var pc = yoodooPlaya.movie.positionProgressSlide(e.originalEvent.touches[0]);
					var time = this.status.duration * pc / 100;
					$(yoodooPlaya.movie.progressSlide).html(yoodoo.secsToMins(time));
				});
				$(this.timeline).bind('touchend', function(e) {
					var pos = yoodooPlaya.movie.positionProgressSlide(e.originalEvent.changedTouches[0]);
					yoodooPlaya.movie.playHead.gotoPercent(pos);
					$(yoodooPlaya.movie.progressSlide).css({
						display: "none"
					});
				});
			} else {
				$(this.timeline).bind('mouseenter', function(e) {
					$(yoodooPlaya.movie.progressSlide).css({
						display: "block"
					});
					var pc = yoodooPlaya.movie.positionProgressSlide(e);
					this.status = yoodooPlaya.movie.playHead.status();
					var time = this.status.duration * pc / 100;
					$(yoodooPlaya.movie.progressSlide).html(time.toFixed(1) + "s");
					$(this).bind('mousemove.progressSlide', function(e) {
						var pc = yoodooPlaya.movie.positionProgressSlide(e);
						var time = this.status.duration * pc / 100;
						$(yoodooPlaya.movie.progressSlide).html(yoodoo.secsToMins(time));
					});
					$(this).bind('mouseleave.progressSlide', function(e) {
						$(yoodooPlaya.movie.progressSlide).css({
							display: "none"
						});
						$(this).unbind('mouseleave.progressSlide mouseup.progressSlide mousemove.progressSlide');
					});
					$(this).bind('mouseup.progressSlide', function(e) {
						var pos = yoodooPlaya.movie.positionProgressSlide(e);
						yoodooPlaya.movie.playHead.gotoPercent(pos);
					});
				});
			}
		},
		positionProgressSlide: function(e) {
			var mx = $(yoodooPlaya.movie.timeline).width();
			var x = e.pageX - $(yoodooPlaya.movie.timeline).offset().left;
			if (x < 0) x = 0;
			if (x > mx) x = mx;
			var pc = 100 * x / mx;
			x = Math.round(x - ($(yoodooPlaya.movie.progressSlide).outerWidth(false) / 2));
			$(yoodooPlaya.movie.progressSlide).css({
				left: x
			});
			return pc;
		},
		startpoint: null,
		load: function(url) {
			this.cancelled = false;
			//this.startpoint=0;
			this.unhide();
			$(yoodooPlaya.movie.overlay).removeClass("complete");
			if (this.src !== null) {
				this.playHead.pause();
			}
			if (url) {
				if (yoodooPlaya.localFiles) url = url.replace(/^http\:\/\/flserver\.yoodidit\.co\.uk\//, yoodoo.option.baseUrl);
				this.video.src = url;
				this.video.load();
				this.video.play();
				this.video.pause();
			}
		},
		error: function() {
			//console.log(arguments);
		},
		loaded: function() {
			var s = this.update();
			if (this.cancelled) {
				this.playHead.pause();
			} else {
				if (s != 0 && this.startpoint != null) {
					this.playHead.goto(this.startpoint);
				} else {
					this.playHead.pause();
				}
			}
		},
		buffering: function(on) {
			if (on) {
				$(yoodooPlaya.movie.overlay).addClass(yoodoo.class_prefix + '_buffering');
			} else {
				$(yoodooPlaya.movie.overlay).removeClass(yoodoo.class_prefix + '_buffering');
				if (yoodooPlaya.movie.autoPlay) yoodooPlaya.movie.playHead.play();
				yoodooPlaya.movie.autoPlay = false;
			}
		},
		update: function() {
			var status = this.playHead.status();
			/*if (status.buffering) {
				$(this.overlay).addClass(yoodoo.class_prefix+'_buffering');
			}else{
				$(this.overlay).removeClass(yoodoo.class_prefix+'_buffering');
			}*/
			var b = Math.round(status.buffer);
			$(this.buffer).css({
				width: b + "%"
			});
			var p = Math.round(status.progress);
			if (status.duration == 0) p = 0;
			$(this.progress).css({
				width: p + "%"
			});
			yoodooPlaya.episode.containers.keypoints.find('.' + yoodoo.class_prefix + '_keypoint').each(function(i, e) {
				if (e.item.start <= status.currentTime && e.item.end >= status.currentTime) {
					$(e).addClass(yoodoo.class_prefix + '_current_keypoint').removeClass(yoodoo.class_prefix + '_future_keypoint');
				} else if (e.item.start > status.currentTime) {
					$(e).removeClass(yoodoo.class_prefix + '_current_keypoint').addClass(yoodoo.class_prefix + '_future_keypoint');
				} else {
					$(e).removeClass(yoodoo.class_prefix + '_current_keypoint ' + yoodoo.class_prefix + '_future_keypoint');
				}
			});
			return p;
		},
		complete: function() {
			yoodooPlaya.episode.validateCompletion();
			this.playHead.pause();
			$(this.progress).css({
				width: "100%"
			});
			var ins = '';
			$(yoodooPlaya.movie.completeMessage).unbind("click");
			if (yoodooPlaya.episode.chapter + 1 >= yoodooPlaya.episode.chapters.length) {
				$(yoodoo.widget).find('.chapterItem.playing').removeClass('playing').addClass("played");
				ins = yoodoo.w('continueonyourjourney') + "<br />" + yoodoo.w('nextitem');
				$(yoodooPlaya.movie.completeMessage).bind("click", function() {
					yoodooPlaya.movie.hideComplete();
					yoodooPlaya.movie.nextItem();
				});
			} else {
				var nextChapter = (yoodooPlaya.episode.chapters[yoodooPlaya.episode.chapter + 1].thumbnailUrl !== undefined) ? "<img src='" + yoodooPlaya.episode.chapters[yoodooPlaya.episode.chapter + 1].thumbnailUrl + "' width='50%' /><br />" + yoodooPlaya.episode.chapters[yoodooPlaya.episode.chapter + 1].title : yoodooPlaya.episode.chapters[yoodooPlaya.episode.chapter + 1].title;
				if (yoodooPlaya.episode.chapters[yoodooPlaya.episode.chapter + 1].splashUrl !== undefined && /\.[a-z0-9]+$/i.test(yoodooPlaya.episode.chapters[yoodooPlaya.episode.chapter + 1].splashUrl)) {
					nextChapter = "<img src='" + yoodooPlaya.episode.chapters[yoodooPlaya.episode.chapter + 1].splashUrl + "' width='50%' /><br />" + yoodooPlaya.episode.chapters[yoodooPlaya.episode.chapter + 1].title;
				}
				ins = yoodoo.w('nextchapter') + "<br />" + nextChapter + "...";
				$(yoodooPlaya.movie.completeMessage).bind("click", function() {
					yoodooPlaya.movie.hideComplete();
					yoodooPlaya.movie.nextChapter();
				});
			}
			var d = document.createElement('div');
			$(d).css({
				"visibility": "hidden"
			}).html(ins);
			$(yoodooPlaya.movie.completeMessage).html("");
			yoodooPlaya.movie.completeMessage.appendChild(d);
			$(yoodooPlaya.movie.completeMessage).css({
				display: "block"
			});
			var m = Math.floor(($(yoodooPlaya.movie.completeMessage).height() - $(yoodooPlaya.movie.completeMessage).find(">div").outerHeight(false)) / 2);
			$(yoodooPlaya.movie.completeMessage).find(">div").css({
				margin: m + 'px 5px',
				visibility: "visible"
			});

			$(yoodooPlaya.movie.completeMessage).find("img").bind("load", function() {
				var m = Math.floor(($(yoodooPlaya.movie.completeMessage).height() - $(yoodooPlaya.movie.completeMessage).find(">div").outerHeight(false)) / 2);
				$(yoodooPlaya.movie.completeMessage).find(">div").css({
					margin: m + 'px 5px',
					visibility: "visible"
				});
			});
			$(yoodooPlaya.movie.completeMessage).css({
				display: "none"
			}).fadeIn();
		},
		returnToComplete: function() {
			$(yoodoo.widget).find('.chapterItem.playing').removeClass('playing');
			var nextChapter = (yoodooPlaya.episode.chapters[yoodooPlaya.episode.chapter].thumbnailUrl !== undefined) ? "<img src='" + yoodooPlaya.episode.chapters[yoodooPlaya.episode.chapter].thumbnailUrl + "' width='50%' /><br />" + yoodooPlaya.episode.chapters[yoodooPlaya.episode.chapter].title : yoodooPlaya.episode.chapters[yoodooPlaya.episode.chapter].title;
			ins = yoodoo.w('nextchapter') + "<br />" + nextChapter + "...";
			$(yoodooPlaya.movie.completeMessage).bind("click", function() {
				yoodooPlaya.movie.hideComplete();
				yoodooPlaya.episode.chapter--;
				if (yoodooPlaya.episode.chapter < 0) yoodooPlaya.episode.chapter = 0;
				yoodooPlaya.movie.nextChapter();
			});
			var d = document.createElement('div');
			$(d).css({
				"visibility": "hidden"
			}).html(ins);
			$(yoodooPlaya.movie.completeMessage).html("");
			yoodooPlaya.movie.completeMessage.appendChild(d);
			$(yoodooPlaya.movie.completeMessage).css({
				display: "block"
			});
			var m = Math.floor(($(yoodooPlaya.movie.completeMessage).height() - $(yoodooPlaya.movie.completeMessage).find(">div").outerHeight(false)) / 2);
			$(yoodooPlaya.movie.completeMessage).find(">div").css({
				margin: m + 'px 5px',
				visibility: "visible"
			});
			$(yoodooPlaya.movie.completeMessage).css({
				display: "none"
			}).fadeIn();
			$(yoodooPlaya.movie.completeMessage).find('img').bind('load error', function() {
				var m = Math.floor(($(yoodooPlaya.movie.completeMessage).height() - $(yoodooPlaya.movie.completeMessage).find(">div").outerHeight(false)) / 2);
				$(yoodooPlaya.movie.completeMessage).find(">div").css({
					margin: m + 'px 5px'
				});
			});
		},
		hideComplete: function() {
			$(yoodooPlaya.movie.completeMessage).css({
				display: 'none'
			});
		},
		nextChapter: function() {
			yoodooPlaya.episode.chapter++;
			if (yoodooPlaya.episode.chapter >= yoodooPlaya.episode.chapters.length) {
				yoodooPlaya.destroyEpisode();
				yoodooPlaya.showBookcase();
			} else {
				yoodooPlaya.setChapter(true);
			}
		},
		nextItem: function() {
			if (yoodooPlaya.episode.isComplete == true) {
				yoodoo.setAutoProgress();
				if (yoodooPlaya.episode.saveXML !== null) {
					yoodoo.quizresults(yoodooPlaya.episode.saveXML);
				} else {
					yoodoo.episodecomplete(yoodooPlaya.episode.id);
				}
				yoodoo.episodeclosed(yoodooPlaya.episode.id);
				yoodoo.nextActions.push("setTimeout('yoodoo.bookcase.progress();',500);");

				//yoodooPlaya.episode.saveEpisodeAsComplete();
				yoodooPlaya.destroyEpisode();
				yoodooPlaya.showBookcase();
			} else {
				setTimeout('yoodoo.bookcase.progress();', 500);
			}
		},
		record: function(start) {
			var times = yoodooPlaya.episode.chapters[yoodooPlaya.episode.chapter].times;
			if (times == undefined) times = [];
			var s = yoodooPlaya.movie.playHead.status();
			if (start) {
				times.push([s.currentTime, 0]);
			} else if (times.length > 0) {
				if (yoodooPlaya.episode.chapters[yoodooPlaya.episode.chapter].duration == undefined) {
					yoodooPlaya.episode.chapters[yoodooPlaya.episode.chapter].duration = s.duration;
				}
				times[times.length - 1][1] = s.currentTime;
			}
			yoodooPlaya.episode.chapters[yoodooPlaya.episode.chapter].times = times;
			if (!start) this.chapterCompletion();
		},
		chapterCompletion: function() {
			var i = yoodooPlaya.episode.chapter;
			if (arguments.length > 0) i = arguments[0];
			var times = yoodooPlaya.episode.chapters[i].times;
			if (times.length > 1) {
				var t = 0;
				while (t < times.length) {
					for (var tt = times.length - 1; tt > t; tt--) {
						if ((times[tt][0] <= times[t][1] && times[tt][0] >= times[t][0]) || (times[tt][1] <= times[t][1] && times[tt][0] >= times[t][1])) {
							if (times[tt][0] < times[t][0]) times[t][0] = times[tt][0];
							if (times[tt][1] > times[t][1]) times[t][1] = times[tt][1];
							times.splice(tt, 1);
						}
					}
					t++;
				}
			}
			var totalTime = 0;
			for (var tt = 0; tt < times.length; tt++) totalTime += (times[tt][1] - times[tt][0]);
			if (times.length > 0) {
				yoodooPlaya.episode.chapters[i].watched = totalTime;
				yoodooPlaya.episode.chapters[i].progressed = 100 * totalTime / yoodooPlaya.episode.chapters[i].duration;
				yoodooPlaya.episode.chapters[i].times = times;
			}
			this.episodeCompletion();
		},
		episodeCompletion: function() {
			var t = 0;
			var seen = 0;
			for (var c = 0; c < yoodooPlaya.episode.chapters.length; c++) {
				if (yoodooPlaya.episode.chapters[c].duration != undefined) {
					seen++;
					if (!isNaN(yoodooPlaya.episode.chapters[c].progressed)) t += yoodooPlaya.episode.chapters[c].progressed;
				}
			}
			t /= seen;
			yoodooPlaya.episode.viewed = {
				seen: seen,
				percent: t
			};
		},
		hide: function() {
			$(this.video).css({
				display: "none"
			});
			$(this.timeline).css({
				display: "none"
			});
			$(this.overlay).css({
				display: "none"
			});
			yoodooPlaya.episode.containers.keypoints.find(">div").css({
				display: "none"
			});
			$('.' + yoodoo.class_prefix + "_episode_heading h3").css({
				display: "none"
			});
		},
		unhide: function() {
			$(this.video).css({
				display: "block"
			});
			$(this.timeline).css({
				display: "block"
			});
			$(this.overlay).css({
				display: "block"
			});
			yoodooPlaya.episode.containers.keypoints.find(">div").css({
				display: "block"
			});
			$('.' + yoodoo.class_prefix + "_episode_heading h3").css({
				display: "block"
			});
		},
		playHead: {
			playing: false,
			play: function() {
				$(yoodooPlaya.movie.overlay).removeClass("complete");
				this.playing = true;
				$(yoodooPlaya.movie.overlay).addClass("playing");
				yoodooPlaya.movie.record(true);
				yoodooPlaya.movie.video.play();
				yoodooPlaya.movie.updateTimer = setInterval('yoodooPlaya.movie.update();', yoodooPlaya.movie.updateInterval);
			},
			pause: function() {
				if (yoodooPlaya.movie.video === undefined || yoodooPlaya.movie.video === null) return false;
				yoodooPlaya.movie.cancelled = true;
				this.playing = false;
				$(yoodooPlaya.movie.overlay).removeClass("playing");
				yoodooPlaya.movie.video.pause();
				yoodooPlaya.movie.record(false);
				clearInterval(yoodooPlaya.movie.updateTimer);
			},
			goto: function(i) {
				yoodooPlaya.movie.hideComplete();
				$(yoodooPlaya.movie.overlay).removeClass("complete");
				if (this.playing) yoodooPlaya.movie.record(false);
				var s = this.status();
				if (s.state == 0) {
					yoodooPlaya.movie.startpoint = i;
				} else if (i < s.duration && s.duration > 0) {
					yoodooPlaya.movie.startpoint = 0;
					yoodooPlaya.movie.video.currentTime = i;
					yoodooPlaya.movie.update();
					if (this.playing) yoodooPlaya.movie.record(true);
				}
			},
			gotoAndPlay: function(i) {
				var openEpisode = false;
				if (this.playing) yoodooPlaya.movie.record(false);
				if (arguments.length > 1) openEpisode = arguments[1];
				if ((BrowserDetect.OS != "iPad" && BrowserDetect.OS != "iPhone") || !openEpisode) {
					yoodooPlaya.movie.buffering(true);
				}
				yoodooPlaya.movie.autoPlay = true;
				this.goto(i);
				if (this.playing) yoodooPlaya.movie.record(true);
			},
			gotoPercent: function(p) {
				yoodooPlaya.movie.hideComplete();
				$(yoodooPlaya.movie.overlay).removeClass("complete");
				if (this.playing) yoodooPlaya.movie.record(false);
				var s = this.status();
				var f = (s.duration * p) / 100;
				yoodooPlaya.movie.video.currentTime = f;
				yoodooPlaya.movie.update();
				if (this.playing) yoodooPlaya.movie.record(true);
			},
			status: function() {
				var reply = {};
				try {
					reply.buffer = yoodooPlaya.movie.video.buffered.end(0);
				} catch (e) {
					reply.buffer = 0;
				}
				reply.buffer = 100 * (reply.buffer / yoodooPlaya.movie.video.duration);
				reply.currentTime = yoodooPlaya.movie.video.currentTime;
				reply.volume = yoodooPlaya.movie.video.volume;
				reply.duration = yoodooPlaya.movie.video.duration;
				reply.state = yoodooPlaya.movie.video.readyState;
				reply.buffering = (reply.state > 1 && reply.state < 4);
				reply.bufferedAhead = (yoodooPlaya.movie.video.duration - yoodooPlaya.movie.video.currentTime);
				reply.progress = 100 * (yoodooPlaya.movie.video.currentTime / yoodooPlaya.movie.video.duration);
				return reply;
			}
		}
	},
	quizCompleted: function() {

		this.movie.complete();
	},
	renderChapters: function() {
		var chapterContainer = document.createElement("div");
		$(chapterContainer).addClass('.' + yoodoo.class_prefix + '_overlay');
		var itemWidth = Math.floor(((this.episode.settings.chapters.height - 4) / 50) * 89);
		var itemOuterWidth = itemWidth + 4;
		for (var c = 0; c < this.episode.chapters.length; c++) {
			var chap = document.createElement("div");
			$(chap).addClass("chapterItem");
			chap.selected = function() {
				if (!$(this).hasClass("playing")) {
					yoodooPlaya.setChapter(true, $(this).prevAll('.chapterItem').get().length);
				}
				this.parentNode.parentNode.scrollTo(this);
			};
			if (this.episode.chapter == c) $(chap).addClass("playing");
			if (this.episode.chapters[c].type == "quiz") {
				var thumb = document.createElement("div");
				$(thumb).css({
					border: '1px solid #000',
					'line-height': (this.episode.settings.chapters.height - 4) + "px",
					height: this.episode.settings.chapters.height - 4,
					width: itemWidth
				}).html(yoodoo.w("quiz")).addClass("quizThumb");
				chap.appendChild(thumb);
				//$(chap).html("Quiz");
			} else {
				var thumb = document.createElement("img");
				if (this.episode.chapters[c].thumbnailUrl === undefined) this.episode.chapters[c].thumbnailUrl = yoodoo.replaceDomain('domain:uploads/sitegeneric/image/broken_chapter.jpg');
				thumb.source = this.episode.chapters[c].thumbnailUrl;
				thumb.src = this.episode.chapters[c].thumbnailUrl;
				$(thumb).bind("error", function() {
					this.src = this.source.replace(/(http\:\/\/[^\/]+\/)(.*)$/, '$1uploads/sitegeneric/image/broken_chapter.jpg');
				});
				$(thumb).css({
					"vertical-align": "middle",
					border: '1px solid #000',
					height: this.episode.settings.chapters.height - 4,
					width: itemWidth
				});
				chap.appendChild(thumb);
			}
			chapterContainer.appendChild(chap);
			var overlay = document.createElement("div");
			var overlayDisplay = document.createElement("div");
			$(overlay).addClass("overlay").css({
				height: this.episode.settings.chapters.height - 2,
				width: itemWidth + 2,
				left: 1,
				top: 1
			});
			$(overlayDisplay).css({
				height: this.episode.settings.chapters.height - 2,
				width: itemWidth + 2
			});
			overlay.appendChild(overlayDisplay);
			chap.appendChild(overlay);
			//chap.insertBefore(overlay,thumb);
		}
		this.episode.containers.chapters.append(chapterContainer);
		$(chapterContainer).css({
			width: itemOuterWidth * this.episode.chapters.length
		});
		yoodoo.initSlider(this.episode.containers.chapters.get(0), chapterContainer, {
			horizontal: true,
			items: '.chapterItem, .' + yoodoo.class_prefix + '_callToAction'
		});
	},
	centreTimer: null,
	centreTimerClear: function() {
		if (this.centreTimer !== null) clearTimeout(this.centreTimer);
	},
	openCentre: function() {
		if (yoodoo.openCenterBook) {
			if (this.centreTimer !== null) clearTimeout(this.centreTimer);
			this.centreTimer = setTimeout('yoodooPlaya.openCentral();', 1000);
		}
	},
	openCentral: function() {
		if (this.currentBookIndex >= 0 && this.bookcase.object.items[this.currentBookIndex].canvas !== undefined) {
			var contLeft = this.containers.bookcaseViewport.find('>div').offset().left;
			var ol = $(this.bookcase.object.items[this.currentBookIndex].canvas).offset().left + (this.book.expandWidth / 2) - contLeft - this.containers.bookcaseViewport.scrollLeft() - (this.bookcase.width / 2);
			if (Math.sqrt(Math.pow(ol, 2)) > (this.bookcase.width / 2)) {
				var d = 10000;
				var idx = -1;
				for (var i = 0; i < this.bookcase.object.items.length; i++) {
					if (this.bookcase.object.items[i].canvas !== null && this.bookcase.object.items[i].canvas !== undefined) {
						var l = (($(this.bookcase.object.items[i].canvas).offset().left - contLeft + (this.book.spine / 2)) - this.containers.bookcaseViewport.scrollLeft()) - (this.bookcase.width / 2);
						l = Math.sqrt(Math.pow(l, 2));
						if (l < d) {
							d = l;
							idx = i;
						}
					}
				}
				if (idx >= 0) this.bookcase.object.items[idx].canvas.selected(null);
			}
		}
	},
	setOpenIndex: function(idx) {
		var autoPlay = false;
		if (arguments.length > 1) autoPlay = arguments[1];
		if (idx >= 0) this.bookcase.object.items[idx].canvas.selected(autoPlay);
	},
	setChapter: function(autoplay) {
		var wasChapter = 1 * this.episode.chapter;
		var openEpisode = false;
		if (autoplay == "new") {
			openEpisode = true;
			autoplay = true;
		}
		if (this.episode.chapter != undefined) {
			i = this.episode.chapter;
		}
		if (arguments.length > 1) i = arguments[1];
		this.episode.chapter = i;
		this.movie.playHead.pause();
		if (this.episode.chapters[this.episode.chapter].type == "quiz") {
			if (this.episode.mandatoryChapterComplete()) {
				this.movie.hide();
				this.renderQuiz();
			} else {
				var m = yoodoo.w('youhavenotviewedenoughtostartthequizyet');
				if (this.episode.mandatorytext) m = this.episode.mandatorytext;
				this.episode.chapter = wasChapter;
				yoodoo.message(m);
				return false;
			}
		} else {
			var h3 = $(this.episode.containers.heading).find("h3");
			h3.unbind("click");
			if (yoodoo.intervention === null) {
				if (this.episode.chapters[this.episode.chapter].scrapbooked) {
					h3.addClass(yoodoo.class_prefix + "_scrapbook_show").removeClass(yoodoo.class_prefix + "_scrapbook_add");
					h3.bind("click", function() {
						yoodooPlaya.showScrapbook(yoodooPlaya.episode.chapters[yoodooPlaya.episode.chapter].id);
					});
				} else {
					h3.addClass(yoodoo.class_prefix + "_scrapbook_add").removeClass(yoodoo.class_prefix + "_scrapbook_show");
					h3.bind("click", function() {
						yoodooPlaya.scrapbookAddItem(yoodooPlaya.episode.chapters[yoodooPlaya.episode.chapter].id);
					});
				}
			}
			h3.html("<div class='marquee'><div>" + this.episode.chapters[this.episode.chapter].title + "</div></div>" + ((yoodoo.intervention === null) ? ("<span>" + (this.episode.chapters[this.episode.chapter].scrapbooked ? yoodoo.w('clicktoshowinscrapbook') : yoodoo.w('clicktoaddtoscrapbook')) + "</span>") : ''));




			var current = this.episode.containers.chapters.find('.chapterItem').get(this.episode.chapter);
			$(current).addClass("playing").removeClass("played").removeClass("toplay");
			$(current).siblings().removeClass("playing").removeClass("played").removeClass("toplay");
			$(current).prevAll().addClass("played");
			$(current).nextAll().addClass("toplay");
			this.renderKeypoints();
			yoodooPlaya.movie.autoPlay = autoplay;
			this.movie.load(yoodooPlaya.episode.chapters[yoodooPlaya.episode.chapter].video(yoodooPlaya.videoFileType));
			$(this.movie.video).attr("poster", yoodooPlaya.episode.chapters[yoodooPlaya.episode.chapter].thumbnailUrl);
			var kp = null;
			for (var k = 0; k < this.episode.chapters[this.episode.chapter].keypoints.length; k++) {
				if (this.episode.chapters[this.episode.chapter].keypoints[k].id == this.autoplayKeypoint) {
					kp = this.episode.chapters[this.episode.chapter].keypoints[k];
				}
			}
			if (kp !== null) {
				this.movie.playHead.goto(kp.start);
			} else {
				if (autoplay) {
					this.movie.playHead.gotoAndPlay(0, openEpisode);
				} else {
					this.movie.playHead.goto(0);
				}
			}
			this.autoplayKeypoint = null;
			this.autoplayChapter = null;
			this.marquees(this.episode.containers.heading);

		}
		var current = this.episode.containers.chapters.find('.chapterItem').get(this.episode.chapter);
		$(current).addClass("playing").removeClass("played").removeClass("toplay");
		$(current).siblings().removeClass("playing").removeClass("played").removeClass("toplay");
		$(current).prevAll().addClass("played");
		$(current).nextAll().addClass("toplay");

	},
	renderKeypoints: function() {
		var keypointFrame = document.createElement("div");
		var kh = Math.floor(this.episode.settings.keypoints.height / this.episode.chapters[this.episode.chapter].keypoints.length);
		kh -= this.episode.settings.keypoints.margin;
		if (kh < this.episode.settings.keypoints.minHeight) kh = this.episode.settings.keypoints.minHeight;
		if (kh > this.episode.settings.keypoints.maxHeight) kh = this.episode.settings.keypoints.maxHeight;
		$(keypointFrame).css({
			height: this.episode.chapters[this.episode.chapter].keypoints.length * (kh + this.episode.settings.keypoints.margin)
		});
		var kfs = Math.floor(kh * 0.6);
		var fs = kfs;
		if (fs > this.episode.settings.keypoints.maxFontHeight) fs = this.episode.settings.keypoints.maxFontHeight;
		if (this.episode.chapters[this.episode.chapter].keypoints.length > 0) {
			for (var k = 0; k < this.episode.chapters[this.episode.chapter].keypoints.length; k++) {
				var kp = document.createElement("div");
				$(kp).addClass(yoodoo.class_prefix + "_keypoint").css({
					'margin-top': this.episode.settings.keypoints.margin + "px",
					height: kh,
					'font-size': fs,
					'line-height': kh + "px"
				}).html(this.episode.chapters[this.episode.chapter].keypoints[k].html());
				kp.item = this.episode.chapters[this.episode.chapter].keypoints[k];
				if (kh < 44) $(kp).addClass("small");
				$(kp).find("div").css({
					height: kh,
					'line-height': kh + "px"
				});
				$(kp).find("button").css({
					'max-height': kh + "px"
				});
				keypointFrame.appendChild(kp);
			}
		}
		$(keypointFrame).find(".keypoint_goto").each(function(i, e) {
			e.selected = function() {
				this.parentNode.parentNode.parentNode.parentNode.scrollTo(this);
				yoodooPlaya.movie.playHead.goto(this.parentNode.parentNode.item.start);
				yoodooPlaya.movie.playHead.play();
			};
		});
		$(keypointFrame).find(".keypoint_opener").each(function(i, e) {
			e.selected = function() {
				this.parentNode.parentNode.parentNode.parentNode.scrollTo(this);
				this.parentNode.parentNode.item.open();
			};
		});
		var kps = this.episode.containers.keypoints.get(0);
		while (kps.childNodes.length > 0) kps.removeChild(kps.childNodes[0]);
		kps.appendChild(keypointFrame);
		this.keypointSlider();
	},
	keypointSlider: function() {
		yoodoo.initSlider(this.episode.containers.keypoints.get(0), this.episode.containers.keypoints.find(">div").get(0), {
			horizontal: false,
			useMargin: true,
			items: '.keypoint_goto, .keypoint_opener'
		});
	},
	closeKeypoint: function() {
		if (yoodooPlaya.episode.containers!==undefined && yoodooPlaya.episode.containers.keypoint!==undefined) 
			yoodooPlaya.episode.containers.keypoint.animate({
				width: 0
			}, {
				duration: 500,
				easing: "swing",
				complete: function() {
					$(yoodooPlaya.keypointFrame).remove();
					yoodooPlaya.keypointFrame = undefined;
				}
			});
	},
	displayKeypoint: function(keypoint) {
		var keypointFrame = document.createElement("div");
		var footerHeight = 30;
		this.episode.containers.keypoint.get(0).appendChild(keypointFrame);
		keypointFrame.id = 'keypointFrame';
		$(keypointFrame).css({
			width: this.width - 20,
			height: this.height - 20,
			margin: 10,
			overflow: "hidden"
		});
		var header = document.createElement("div");
		header.innerHTML = keypoint.title;
		if (yoodoo.intervention === null) $(header).append((keypoint.scrapbooked ? "<button onclick='yoodooPlaya.showScrapbook(" + keypoint.id + ")' class='" + yoodoo.class_prefix + "_scrapbook_show'>" + yoodoo.w('clicktoshowinscrapbook') + "</button>" : " <button onclick='yoodooPlaya.scrapbookAddItem(" + keypoint.id + ")' class='" + yoodoo.class_prefix + "_scrapbook_add'>" + yoodoo.w('clicktoaddtoscrapbook') + "</button>"));
		if (yoodoo.intervention === null) $(header).append("<button onclick='yoodoo.comments.show({contentId:" + yoodooPlaya.episode.id + ",targetId:" + keypoint.id + "})' class='" + yoodoo.class_prefix + "_comment'>" + yoodoo.w("comments") + "</button>");

		keypointFrame.appendChild(header);
		$(header).css({
			width: this.width - 20,
			display: 'block',
			padding: 0
		}).addClass(yoodoo.class_prefix + "_keypointHeader");
		var back = document.createElement("button");
		$(back).html(yoodoo.w("back")).bind("click", function() {
			yoodooPlaya.closeKeypoint();
		});
		header.insertBefore(back, header.childNodes[0]);
		this.episode.containers.keypoint.css({
			width: 0,
			display: 'block'
		});
		var headerHeight = $(header).outerHeight(true);
		var keypointWindow = document.createElement("div");
		keypointWindow.id = 'keypointWindow';
		$(keypointWindow).css({
			width: this.width - 40,
			height: this.height - 20 - headerHeight - footerHeight - 20,
			margin: 10,
			overflow: "hidden"
		});
		keypointFrame.appendChild(keypointWindow);
		var columnContainer = document.createElement("div");
		$(columnContainer).css({
			'max-height': this.height - 20 - headerHeight - 20 - footerHeight,
			overflow: 'hidden'
		}).addClass(yoodoo.class_prefix + "_columnContainer");
		keypointFrame.columns = [];
		for (var c = 0; c < keypoint.columns.length; c++) {
			keypointFrame.columns.push(keypoint.columns[c].html());
		}
		var screenWidth = this.width - 40;
		var cw = screenWidth;
		keypointFrame.showColumns = 1;
		if (keypointFrame.columns.length > 1) {
			cw = screenWidth / keypointFrame.columns.length;
			keypointFrame.showColumns = keypointFrame.columns.length;
			if (cw < this.bookcase.keypoint.minColumnWidth) cw = this.bookcase.keypoint.minColumnWidth;
			if (cw > this.bookcase.keypoint.maxColumnWidth) cw = this.bookcase.keypoint.maxColumnWidth;
			if (cw > screenWidth) cw = screenWidth;
			if (cw * keypointFrame.columns.length < screenWidth) {
				cw = Math.floor(screenWidth / keypointFrame.columns.length);
			} else {
				while (keypointFrame.showColumns > 1 && keypointFrame.showColumns * cw > screenWidth) {
					keypointFrame.showColumns--;
				}
				cw = Math.floor(screenWidth / keypointFrame.showColumns);
			}
			$(keypointFrame.columns).css({
				width: cw,
				padding: 0,
				float: 'left',
				'height': this.height - 20 - headerHeight - footerHeight - 20,
				position: 'relative'
			}).addClass(yoodoo.class_prefix + "_columnVertical");
			$(keypointFrame.columns).find(">div").css({
				width: cw - 20,
				padding: 10,
				'max-height': this.height - 20 - headerHeight - footerHeight - 20 - 0,
				overflow: 'hidden'
			});
		}
		keypointFrame.columnWidth = cw;
		for (c = 0; c < keypointFrame.columns.length; c++) {
			columnContainer.appendChild(keypointFrame.columns[c]);
		}
		$(columnContainer).css({
			width: cw * keypointFrame.columns.length,
			overflow: "hidden"
		});
		keypointWindow.appendChild(columnContainer);
		var footer = document.createElement("div");
		$(footer).css({
			height: footerHeight,
			'line-height': footerHeight
		}).addClass(yoodoo.class_prefix + "_keypointFooter");
		keypointFrame.appendChild(footer);
		keypointFrame.showingPage = 0;
		keypointFrame.keypointWindow = keypointWindow;
		this.episode.containers.keypoint.animate({
			width: this.width
		}, {
			duration: 500,
			easing: "swing",
			complete: yoodooPlaya.columnVertical()
		});
		if (keypointFrame.showColumns < keypointFrame.columns.length) {
			var next = document.createElement("button");
			var prev = document.createElement("button");
			next.source = keypointFrame;
			prev.source = keypointFrame;
			footer.appendChild(next);
			footer.appendChild(prev);
			$(next).bind('click', function() {
				this.source.showPage(1);
			}).html("next").css({
				float: "right"
			}).addClass(yoodoo.class_prefix + "_keypointNext");
			$(prev).bind('click', function() {
				this.source.showPage(-1);
			}).html("prev").addClass(yoodoo.class_prefix + "_keypointPrev");
			keypointFrame.nextButton = next;
			keypointFrame.prevButton = prev;
		}
		keypointFrame.showPage = function(dir) {
			this.showingPage += dir;
			if (this.showingPage < 0) this.showingPage = 0;
			if (this.showingPage > this.columns.length - this.showColumns) this.showingPage = this.columns.length - this.showColumns;
			$(this.prevButton).css({
				display: (this.showingPage == 0) ? 'none' : 'block'
			});
			$(this.nextButton).css({
				display: (this.showingPage == this.columns.length - this.showColumns) ? 'none' : 'block'
			});
			var sl = this.columnWidth * this.showingPage;
			$(this.keypointWindow).animate({
				scrollLeft: sl
			}, {
				duration: 500,
				easing: "swing"
			});
		};
		keypointFrame.showPage(0);
		this.keypointFrame = keypointFrame;
	},
	columnVertical: function() {
		$(this.episode.containers.keypoint).find('.' + yoodoo.class_prefix + '_columnVertical').each(function(i, e) {
			e.scroller = $(e).find('>div').get(0);
			e.content = $(e.scroller).find('>div');
			if (e.content.height() > $(e.scroller).height()) {
				$(e).addClass(yoodoo.class_prefix + "_scrollVertical");
				$(e.scroller).css({
					height: $(e.scroller).height() - 60,
					margin: '20px 0px 0px 0px'
				});
				e.up = document.createElement("button");
				e.up.source = e.scroller;
				$(e.up).addClass(yoodoo.class_prefix + "_upScroll").css({
					position: 'absolute',
					width: 'inherit',
					top: 0
				}).bind('click', function() {
					this.source.update(-1);
				});
				e.down = document.createElement("button");
				e.down.source = e.scroller;
				$(e.down).addClass(yoodoo.class_prefix + "_downScroll").css({
					position: 'absolute',
					width: 'inherit',
					bottom: 0
				}).bind('click', function() {
					this.source.update(1);
				});
				e.insertBefore(e.up, e.childNodes[0]);
				e.insertBefore(e.down, e.childNodes[0]);
				e.scroller.maxScroll = e.content.height() - $(e.scroller).height();
				e.scroller.update = function() {
					if (arguments.length > 0) this.scrollTop += (arguments[0] * 10);
					$(this.parentNode.down).css({
						display: (this.scrollTop < this.maxScroll) ? 'block' : 'none'
					});
					$(this.parentNode.up).css({
						display: (this.scrollTop > 0) ? 'block' : 'none'
					});
				};
				e.scroller.update();
				if (yoodoo.is_touch) {
					$(e.scroller).bind("touchstart", function(e) {
						if (e.target.tagName != "a") {
							e.preventDefault();
							this.y = e.originalEvent.touches[0].pageY;
							document.colScroll = this;
							$(window).bind("touchmove.colScroll", function(e) {
								if (document.colScroll) {
									document.colScroll.scrollTop -= (e.originalEvent.touches[0].pageY - document.colScroll.y);
									document.colScroll.y = e.originalEvent.touches[0].pageY;
									document.colScroll.update();
								}
							});
							$(window).bind("touchend.colScroll", function(e) {
								$(window).unbind("touchmove.colScroll, touchend.colScroll");
							});
						}
					});
				} else {
					$(e.scroller).bind("mousedown", function(e) {
						if (e.target.tagName != "a") {
							e.preventDefault();
							this.y = e.pageY;
							document.colScroll = this;
							$(document).bind("mousemove.colScroll", function(e) {
								if (document.colScroll) {
									document.colScroll.scrollTop -= (e.pageY - document.colScroll.y);
									document.colScroll.y = e.pageY;
									document.colScroll.update();
								}
							});
							$(document).bind("mouseleave.colScroll, mouseup.colScroll", function(e) {
								$(document).unbind("mouseleave.colScroll, mouseup.colScroll, mousemove.colScroll");
							});
						}
					});
				}
			}
		});
	},
	hideKeypoint: function() {
		if ($(this.episode.containers.keypoint).css("display") == "block") {
			$(this.episode.containers.keypoint).animate({
				width: 0
			}, {
				duration: 500,
				easing: "swing",
				complete: function() {
					this.innerHTML = '';
					$(this).css({
						display: "none"
					});
				}
			});
		}
	},
	animatedBookCount: 0,

	toggleFilter: function(o, type) {
		if (this.animatedBookCount == 0) {
			this.bookcase.filter[type].value = !this.bookcase.filter[type].value;
			if (this.asCanvas) {
				var typeTranslate = {
					dooits: 'dooit',
					episodes: 'book',
					documents: 'document',
					earmarks: 'earmarked'
				};
				for (var i = 0; i < this.bookcase.object.items.length; i++) {
					var on = true;
					for (var k in typeTranslate) {
						if (k == 'earmarks') {
							if (this.bookcase.filter[k].value && !this.bookcase.object.items[i].earmarked) on = false;
						} else if (!this.bookcase.filter[k].value && this.bookcase.object.items[i].type == typeTranslate[k]) {
							on = false;
						}
					}
					$(this.bookcase.object.items[i].canvas).css({
						display: on ? 'inline-block' : 'none'
					});
				}
				if (this.bookcase.filter[type].value) {
					$(o).removeClass("off");
				} else {
					$(o).addClass("off");
				}
				this.slideToOpen();
			} else {
				this.countDisplayed();
				if (this.bookcase.object.items[this.currentBookIndex].type == this.bookcase.filter[type].className) this.shrink(this.currentBookIndex);
				var selectorSuffix = [];
				if (this.bookcase.filter.earmarks.value && type != "earmarks") {
					//if(!this.bookcase.filter[type].value) {
					selectorSuffix.push('.' + this.bookcase.filter.earmarks.className + '');
					//}
				}
				var variants = [];
				if (type == "earmarks") {
					var sf = '';
					if (selectorSuffix.length > 0) sf += selectorSuffix[0];
					for (var k in this.bookcase.filter) {
						if (this.bookcase.filter[k].value && k != "earmarks") {
							if (this.bookcase.filter[k].invertClass) {
								variants.push(sf + ':not(.' + this.bookcase.filter[k].className + ')');
							} else {
								variants.push(sf + '.' + this.bookcase.filter[k].className);
							}
						}
					}
				} else {
					variants = selectorSuffix;
				}
				var open = this.bookcase.filter[type].value;
				if (this.bookcase.filter[type].invertAction) open = !open;
				if (this.bookcase.filter[type].value) {
					$(o).removeClass("off");
				} else {
					$(o).addClass("off");
				}
				if (open) {
					$(this.containers.bookcase).find('.' + this.bookcase.filter[type].className).removeClass("off");
					var selector = '';
					if (this.bookcase.filter[type].invertClass) {
						selector = '.' + yoodoo.class_prefix + '_bookcaseItem:not(.' + this.bookcase.filter[type].className + ')';
					} else {
						selector = '.' + yoodoo.class_prefix + '_bookcaseItem.' + this.bookcase.filter[type].className;
					}
					var sel = [];
					if (variants.length > 0) {
						for (var s = 0; s < variants.length; s++) {
							sel.push(selector + variants[s]);
						}
						selector = sel.join(",");
					}
					var books = $(this.containers.bookcase).find(selector);
					this.animatedBookCount = books.get().length;
					books.css({
						display: "block"
					}).animate({
						width: this.book.spine + 'px',
						'margin-left': this.book.margin,
						opacity: 1
					}, 1000, function() {
						yoodooPlaya.animatedBookCount--;
						if (yoodooPlaya.animatedBookCount == 0) {
							if (!yoodooPlaya.slideToOpen()) {
								//if (yoodooPlaya.touch.areas[0].scrollLeft>yoodooPlaya.maxScroll) $(yoodooPlaya.touch.areas[0]).animate({scrollLeft:yoodooPlaya.maxScroll});
							}
						}
					});
					if (this.bookcase.object.items[this.currentBookIndex].type == this.bookcase.filter[type].className) this.expand(this.currentBookIndex);
				} else {
					$(this.containers.bookcase).find('.' + this.bookcase.filter[type].className).addClass("off");
					if (this.bookcase.object.items[this.currentBookIndex].type == this.bookcase.filter[type].className) this.shrink(this.currentBookIndex);
					var selector = '';
					if (this.bookcase.filter[type].invertClass) {
						selector = '.' + yoodoo.class_prefix + '_bookcaseItem:not(.' + this.bookcase.filter[type].className + ')';
					} else {
						selector = '.' + yoodoo.class_prefix + '_bookcaseItem.' + this.bookcase.filter[type].className;
					}
					var sel = [];
					if (variants.length > 0) {
						for (var s = 0; s < variants.length; s++) {
							sel.push(selector + variants[s]);
						}
						selector = sel.join(",");
					}
					var books = $(this.containers.bookcase).find(selector);
					this.animatedBookCount = books.get().length;
					books.animate({
						width: '0px',
						'margin-left': -((this.book.margin * 2) + 2),
						opacity: 0
					}, 1000, function() {
						$(this).css({
							display: "none"
						});
						yoodooPlaya.animatedBookCount--;
						if (yoodooPlaya.animatedBookCount == 0) {
							if (!yoodooPlaya.slideToOpen()) {

								//if (yoodooPlaya.touch.areas[0].scrollLeft>yoodooPlaya.maxScroll) $(yoodooPlaya.touch.areas[0]).animate({scrollLeft:yoodooPlaya.maxScroll});
							}
						}
					});
				}
			}
		}
	},
	initMinibookcaseSlider: function() {
		yoodoo.initSlider($(this.containers.bookcase).find('.' + yoodoo.class_prefix + '_bookcase_slider').get(0),
			$(this.containers.bookcase).find('.' + yoodoo.class_prefix + '_minibookcase').get(0), {
				horizontal: true,
				items: '.' + yoodoo.class_prefix + '_thumb'
			});
	},
	initSliderEvents: function() {
		if (this.asCanvas) {
			if (!yoodoo.mobile) $(this.containers.bookcase).find('.' + yoodoo.class_prefix + '_bookcase_viewport').css({
				overflow: "hidden"
			});
			yoodoo.initSlider($(this.containers.bookcase).find('.' + yoodoo.class_prefix + '_bookcase_viewport').get(0),
				$(this.containers.bookcase).find('.' + yoodoo.class_prefix + '_bookcase_viewport>div').get(0), {
					horizontal: true,
					items: 'canvas',
					change: ((yoodoo.displayMiniBookcase) ? yoodooPlaya.miniEyepiece.update : function() {}),
					stop: function() {
						yoodooPlaya.openCentre();
					}
				});
		} else {
			yoodoo.initSlider($(this.containers.bookcase).find('.' + yoodoo.class_prefix + '_bookcase_viewport').get(0),
				$(this.containers.bookcase).find('.' + yoodoo.class_prefix + '_bookcase_viewport>div').get(0), {
					horizontal: true,
					items: '.' + yoodoo.class_prefix + '_bookcaseItem',
					change: ((yoodoo.displayMiniBookcase) ? yoodooPlaya.miniEyepiece.update : function() {}),
					stop: function() {
						yoodooPlaya.openCentre();
					}
				});
		}
	},
	bookcase_earmark: function(o) {
		var i = $(o.parentNode).prevAll(this.asCanvas ? 'canvas' : "." + yoodoo.class_prefix + "_bookcaseItem").get().length;
		this.bookcase.object.items[i].earmarked = !this.bookcase.object.items[i].earmarked;
		yoodoo.earmark(this.bookcase.object.items[i].content_id, this.bookcase.object.items[i].earmarked);
		if (this.bookcase.object.items[i].earmarked) {
			$(o).addClass("on");
			$(o.parentNode).addClass("earmarked");
		} else {
			$(o).removeClass("on");
			$(o.parentNode).removeClass("earmarked");
		}
	},
	bookcase_isSelected: function(o) {
		var i = $(o).prevAll(this.asCanvas ? 'canvas' : "." + yoodoo.class_prefix + "_bookcaseItem").get().length;
		return this.currentBookIndex == i;
	},
	bookcase_select: function(o) {
		var i = $(o).prevAll(this.asCanvas ? 'canvas' : "." + yoodoo.class_prefix + "_bookcaseItem").get().length;
		this.bookcase_select_by_index(i);
	},
	bookcase_select_by_index: function(i) {
		this.autoOpen = false;
		if (arguments.length > 1) this.autoOpen = arguments[1];
		if (this.currentBookIndex != i && i >= 0) {
			if (this.asCanvas) {
				this.bookcase.object.items[i].toggle();
			} else {
				this.shrink(this.currentBookIndex);
				this.currentBookIndex = i;
				this.expand(this.currentBookIndex);
			}
		}
	},
	/*shrink2:function(i) {
		var o=$("."+yoodoo.class_prefix+"_bookcaseItem").get(i);
		if($(o).hasClass("off")) {
			$(o).animate({'width':'0px'},function(){
				//yoodooPlaya.updateMaxScroll();
			});
		}else{
			$(o).animate({'width':yoodooPlaya.book.spine+'px'},function(){
				//yoodooPlaya.updateMaxScroll();
			});
		}
		$($('.'+yoodoo.class_prefix+'_bookcase_slider .'+yoodoo.class_prefix+'_thumb').get(i)).animate({width:this.minibookcase.width+"px"});
		$(o).find('.'+yoodoo.class_prefix+'_book_title').fadeIn();
		$(o).find('.'+yoodoo.class_prefix+'_callToAction').fadeOut();
		$(o).find('.'+yoodoo.class_prefix+'_bookcaseItemLogo').fadeIn();
		$(o).find('.'+yoodoo.class_prefix+'_expandedLabel').slideUp(200,function(){
			$(this).remove();
		});
	},
	shrink3:function(i) {
		var o=$("."+yoodoo.class_prefix+"_bookcaseItem").get(i);
		var s=$(o).find('.'+yoodoo.class_prefix+"_spine").get(0);
		s.scaleX=0;
		s.toScaleX=1;
		clearTimeout(o.timer);
		this.book.shrinked=i;
		this.book.shrinkedObject=o;
		this.book.shrinkedObject.spine=s;
		o.shrink=function() {
			this.spine.scaleX+=0.02;
			if (this.spine.scaleX>=this.spine.toScaleX) this.spine.scaleX=this.spine.toScaleX;
			//$(this.spine).css({transform:"scale("+this.spine.scaleX.toFixed(2)+",1)"});
			$(this.spine).css({'margin-left':(-(yoodooPlaya.book.spine-(yoodooPlaya.book.spine*this.spine.scaleX)))+"px",transform:"scale("+this.spine.scaleX.toFixed(2)+",1)"});
			if (this.spine.scaleX!=this.spine.toScaleX) this.timer=setTimeout('yoodooPlaya.book.shrinkedObject.shrink();',20);
		};
		o.timer=setTimeout('yoodooPlaya.book.shrinkedObject.shrink();',20);
	},*/
	shrink: function(i) {
		var face = this.bookcase.items[i].face;
		var s = this.bookcase.items[i].spine;
		if (s.scaleX === undefined) s.scaleX = 0;
		s.toScaleX = 1;
		if (s.scaleX === undefined) face.scaleX = 1;
		face.toScaleX = 0;
		this.bookcase.items[i].speed = (yoodoo.renderComplexity == 1) ? 5 : 50;
		this.bookcase.items[i].interval = (yoodoo.renderComplexity == 1) ? 100 : 20;
		clearTimeout(this.bookcase.items[i].timer);
		this.bookcase.items[i].shrink = function() {
			this.spine.scaleX += 1 / this.speed;
			if (this.spine.scaleX > this.spine.toScaleX) this.spine.scaleX = this.spine.toScaleX;
			var ass = Math.sin(this.spine.scaleX * Math.PI / 2);
			var afs = Math.cos(this.spine.scaleX * Math.PI / 2);

			if (yoodoo.renderComplexity != 2) {
				var mls = (yoodooPlaya.book.spine / 2);
				mls -= mls * ass;
				var mlf = yoodooPlaya.book.expandWidth / 2;
				mlf *= (1 - afs);
				mlf += mls;
			}
			var sw = Math.round(ass * yoodooPlaya.book.spine);
			var fw = Math.round(afs * yoodooPlaya.book.expandWidth);
			var w = sw;

			w += yoodooPlaya.book.expandWidth * afs;
			if (yoodoo.renderComplexity == 2) {
				var sc = Math.round(ass * 255);
				$(this.spine).css({
					background: 'rgb(' + sc + ',' + sc + ',' + sc + ')',
					width: sw
				});
				var fc = Math.round((afs * 255));
				$(this.face).css({
					background: 'rgb(' + fc + ',' + fc + ',' + fc + ')',
					width: fw
				});
			} else {
				$(this.spine).css({
					'margin-left': (-mls) + "px",
					transform: "scale(" + ass.toFixed(2) + ",1)"
				});
				$(this.spineShader).css({
					background: 'rgba(0,0,0,' + (0.5 * (1 - ass)).toFixed(2) + ')',
					display: "block"
				});
				$(this.face).css({
					'margin-left': -mlf,
					transform: "scale(" + afs.toFixed(2) + ",1)"
				});
				$(this.faceShader).css({
					background: 'rgba(0,0,0,' + (0.5 * ass).toFixed(2) + ')',
					'border-left': '1px solid rgba(255,255,255,' + (0.5 * Math.sin(ass * Math.PI)).toFixed(1) + ')'
				});
			}

			this.currentWidth = w;
			var m = (5 * Math.sin(this.spine.scaleX * Math.PI)) + yoodooPlaya.book.margin;
			$(this).css({
				width: this.currentWidth,
				'margin': yoodooPlaya.book.margin + "px " + m.toFixed(1) + "px " + yoodooPlaya.book.margin + "px " + m.toFixed(1) + "px"
			});
			if (this.spine.scaleX < this.spine.toScaleX) {
				this.timer = setTimeout('yoodooPlaya.bookcase.items[' + this.index + '].shrink();', this.interval);
			} else {
				$(this.spineShader).css({
					display: "none"
				});
				$(this.face).remove();
			}
		};
		this.bookcase.items[i].timer = setTimeout('yoodooPlaya.bookcase.items[' + i + '].shrink();', 20);
	},
	expand: function(i) {
		var face = $(this.bookcase.items[i]).find('.' + yoodoo.class_prefix + "_bookFace").get(0);
		if (face === undefined || face === null) {
			face = this.expandFace(i);
			$(this.bookcase.items[i]).append(face);
		}
		var s = $(this.bookcase.items[i]).find('.' + yoodoo.class_prefix + "_spine").get(0);
		if (yoodoo.renderComplexity == 2) $(s).children().css({
			display: "none"
		});
		if (s.scaleX === undefined) s.scaleX = 1;
		s.toScaleX = 0;
		if (face.scaleX === undefined) face.scaleX = 0;
		face.toScaleX = 1;
		this.bookcase.items[i].speed = (yoodoo.renderComplexity == 1) ? 5 : 50;
		this.bookcase.items[i].interval = (yoodoo.renderComplexity == 1) ? 100 : 20;
		clearTimeout(this.bookcase.items[i].timer);
		this.bookcase.items[i].index = i;
		this.bookcase.items[i].spine = s;
		this.bookcase.items[i].spineShader = $(s).find('.' + yoodoo.class_prefix + "_spine_shader").get(0);
		this.bookcase.items[i].face = face;
		this.bookcase.items[i].faceShader = $(face).find('.' + yoodoo.class_prefix + "_book_face_shader").get(0);
		this.bookcase.items[i].currentWidth = yoodooPlaya.book.spine;

		if (yoodoo.renderComplexity == 2) {
			$(this.bookcase.items[i].spine).css({
				background: '#fff'
			});
			$(this.bookcase.items[i].face).css({
				background: '#000'
			});
		}

		this.bookcase.items[i].grow = function() {
			this.spine.scaleX -= 1 / this.speed;
			if (this.spine.scaleX <= this.spine.toScaleX) this.spine.scaleX = this.spine.toScaleX;
			var ass = Math.sin(this.spine.scaleX * Math.PI / 2);
			var afs = Math.cos(this.spine.scaleX * Math.PI / 2);

			if (yoodoo.renderComplexity != 2) {
				var mls = (yoodooPlaya.book.spine / 2);
				mls -= mls * ass;
				var mlf = yoodooPlaya.book.expandWidth / 2;
				mlf *= (1 - afs);
				mlf += mls;
			}
			var sw = Math.round(ass * yoodooPlaya.book.spine);
			var fw = Math.round(afs * yoodooPlaya.book.expandWidth);
			var w = sw;

			w += yoodooPlaya.book.expandWidth * afs;
			if (yoodoo.renderComplexity == 2) {
				var sc = Math.round(ass * 255);
				$(this.spine).css({
					background: 'rgb(' + sc + ',' + sc + ',' + sc + ')',
					width: sw
				});
				var fc = Math.round((afs * 255));
				$(this.face).css({
					background: 'rgb(' + fc + ',' + fc + ',' + fc + ')',
					width: fw
				});
			} else {
				$(this.spine).css({
					'margin-left': (-mls) + "px",
					transform: "scale(" + ass.toFixed(2) + ",1)"
				});
				$(this.spineShader).css({
					background: 'rgba(0,0,0,' + (0.5 * (1 - ass)).toFixed(2) + ')',
					display: "block"
				});
				$(this.face).css({
					'margin-left': -mlf,
					transform: "scale(" + afs.toFixed(2) + ",1)"
				});
				$(this.faceShader).css({
					background: 'rgba(0,0,0,' + (0.5 * ass).toFixed(2) + ')',
					'border-left': '1px solid rgba(255,255,255,' + (0.5 * Math.sin(ass * Math.PI)).toFixed(1) + ')'
				});
			}
			this.currentWidth = w;
			var m = (5 * Math.sin(this.spine.scaleX * Math.PI)) + yoodooPlaya.book.margin;
			$(this).css({
				width: this.currentWidth,
				'margin': yoodooPlaya.book.margin + "px " + m.toFixed(1) + "px " + yoodooPlaya.book.margin + "px " + m.toFixed(1) + "px"
			});
			if (this.spine.scaleX != this.spine.toScaleX) {
				this.timer = setTimeout('yoodooPlaya.bookcase.items[' + this.index + '].grow();', this.interval);
			}
		};
		this.bookcase.items[i].grow();
	},
	expandFace: function(i) {

		var ins = "<div class='" + yoodoo.class_prefix + "_catTitle' style='color:" + this.bookcase.object.items[i].spineColour + "'>" + this.bookcase.object.items[i].category + "</div>";
		ins += "<div class='" + yoodoo.class_prefix + "_bookTitle'>" + this.bookcase.object.items[i].title + "</div>";
		if (this.bookcase.object.items[i].imageUrl != undefined) ins += "<img src='" + this.bookcase.object.items[i].imageUrl + "' onload='$(this).fadeIn()' width='" + Math.round(this.book.imageWidth * this.book.expandWidth) + "px'/>";
		if (this.bookcase.object.items[i].shortDescription != undefined && this.bookcase.object.items[i].shortDescription != '') ins += "<div class='" + yoodoo.class_prefix + "_shortDescription'>" + this.bookcase.object.items[i].shortDescription.replace(/&#13;/g, '<br />') + "</div>";
		if (this.bookcase.object.items[i].duration != undefined && this.bookcase.object.items[i].duration != '') ins += "<div class='" + yoodoo.class_prefix + "_EpisodeDuration'>Duration: <b>" + this.bookcase.object.items[i].duration + "</b></div>";
		if (this.bookcase.object.items[i].score != undefined && this.bookcase.object.items[i].score != '' && !isNaN(this.bookcase.object.items[i].score) && this.bookcase.object.items[i].score > 0) ins += "<div class='" + yoodoo.class_prefix + "_EpisodeScore'>My score: <b>" + this.bookcase.object.items[i].score + "%</b></div>";
		var no = document.createElement("div");
		$(no).addClass(yoodoo.class_prefix + "_bookFace");
		$(no).css({
			width: this.book.expandWidth,
			height: this.book.height
		});
		if (yoodoo.renderComplexity != 2) $(no).css({
			transform: "scale(0,1)"
		});
		$(no).html(ins);
		var shader = document.createElement("div");
		if (yoodoo.renderComplexity == 2) $(no).children().css({
			display: "none"
		});
		$(shader).css({
			position: "absolute",
			width: this.book.expandWidth,
			height: this.book.height
		}).addClass(yoodoo.class_prefix + "_book_face_shader");
		if (yoodoo.renderComplexity != 2) $(no).prepend(shader);
		return no;
	},
	openNextBook: function() {
		var ap = false;
		if (arguments.length > 0) ap = arguments[0];
		if (this.currentBookIndex < 0) return false;
		this.currentBookIndex++;
		while (this.currentBookIndex < this.bookcase.object.items.length && this.bookcase.object.items[this.currentBookIndex].visible !== true) this.currentBookIndex++;
		//console.log(this.currentBookIndex);
		if (this.currentBookIndex >= this.bookcase.object.items.length) {
			this.currentBookIndex = this.bookcase.object.items.length - 1;
			return false;
		} else {
			if (this.bookcase.object.items[this.currentBookIndex].visible !== false) this.bookcase.object.items[this.currentBookIndex].toggle((!this.bookcase.object.items[this.currentBookIndex].completed) && (this.bookcase.object.items[this.currentBookIndex].autoplay || ap));
		}
	},
	slideToOpen: function() {
		var i = this.currentBookIndex;
		if (i < 0) return false;
		if (arguments.length > 0) i = arguments[0];
		if (i == undefined || i == null) return false;
		var focused = this.asCanvas ? this.bookcase.object.items[i].canvas : $('.' + yoodoo.class_prefix + '_bookcaseItem').get(i);
		var ok = true;
		while ($(focused).css("display") == "none" && focused !== null) {
			ok = false;
			focused = $(focused).next();
			if (focused.get().length == 0) {
				focused = null;
			} else {
				focused = focused.get(0);
			}
		}
		if (focused === null) {
			focused = this.asCanvas ? this.bookcase.object.items[0].canvas : $('.' + yoodoo.class_prefix + '_bookcaseItem').get(0);
			while ($(focused).css("display") == "none" && focused !== null) {
				focused = $(focused).next();
				if (focused.get().length == 0) {
					focused = null;
				} else {
					focused = focused.get(0);
				}
			}
		}
		if (focused === null) return false;
		if (!ok) {
			this.currentBookIndex = $(focused).prevAll().get().length;
			focused.selected(null);
		} else {
			var vp = $(this.containers.bookcase).find("." + yoodoo.class_prefix + "_bookcase_viewport").get(0);
			if (yoodoo.isApp && false) {
				window.scrollTo($(focused).offset().left, 1);
			} else if (!$(focused).hasClass("off") || i != this.currentBookIndex) {
				if (vp && vp.scrollTo) vp.scrollTo(focused);
				return true;
			}
			return false;
		}
	}
};