yoodoo.element = {
	bookcase : function(xml) {
		this.bookcaseFirstLoad = null;
		this.items = [];
		this.previousitems = {};
		this.currentitems = {};
		this.levels = [];
		this.settings = {};
		this.progression = null;
		this.autoProgress = false;
		this.tags = [];
		this.levelIds = {};
		this.showingIntervention = false;
		this.parse = function(xml) {
			this.cachedXML = xml;
			var node = yoodoo.parseXML(xml);
			this.items = [];
			this.currentitems = {};
			this.levels = [];
			this.settings = {};
			this.progression = null;
			this.tags = [];
			this.levelIds = {};
			var kid = node.firstChild;
			if (yoodoo.widgets.length === 0) {
				yoodoo.widgets.push(new yoodoo.element.widget({
					dependencies : [],
					ready : function(src) {
						this.object = new yoodoo.element.widgets.progress(src);
					}
				}));
			}
			var widgetsToHave = [];
			while (kid !== null) {
				var c = null;
				if (kid.nodeName == "book" || kid.nodeName == "dooit" || kid.nodeName == "doc") {
					var kidid = kid.getElementsByTagName('content_id')[0].firstChild.nodeValue;
					if (this.previousitems[kidid] !== undefined) {
						c = this.previousitems[kidid];
						c.reload(kid);
					} else {
						c = new yoodoo.element[kid.nodeName](kid);
						this.previousitems[c.content_id] = c;
					}
					this.items.push(c);
					this.currentitems[c.content_id] = c;
				} else if (kid.nodeName == "widget") {
					widgetsToHave.push(kid);
				} else if (kid.nodeName == "settings") {
					this.settings = yoodoo.nodeKids(kid);
				} else if (kid.nodeName == "level") {
					c = new yoodoo.element[kid.nodeName](kid);
					this.levels.push(c);
				} else if (kid.nodeName == "tag") {
					c = new yoodoo.element[kid.nodeName](kid);
					this.tags.push(c);
				} else if (kid.nodeName == "progress") {
					this.progression = new yoodoo.element[kid.nodeName](kid);
				} else {
					if (kid.firstChild !== undefined && kid.firstChild !== null) {
						this[kid.nodeName] = kid.firstChild.data;
					} else {
						this[kid.nodeName] = kid.data;
					}
				}
				kid = kid.nextSibling;
			}
			var widgetsToRemove = [];
			var addedSomething = false;
			for (var yw = 0; yw < yoodoo.widgets.length; yw++)
				widgetsToRemove.push(true);
			for (var w = 0; w < widgetsToHave.length; w++) {
				kid = widgetsToHave[w];
				var idx = -1;
				var id = kid.getAttribute("id");
				for ( yw = 0; yw < yoodoo.widgets.length; yw++) {
					if (yoodoo.widgets[yw].id == id)
						idx = yw;
				}
				if (idx < 0) {
					yoodoo.widgets.push(new yoodoo.element.widget(kid));
					addedSomething = true;
				} else {
					widgetsToRemove[idx] = false;
				}
			}
			var removedSomething = false;
			for ( yw = widgetsToRemove.length - 1; yw >= 0; yw--) {
				if (widgetsToRemove[yw] === true && yoodoo.widgets[yw].object !== undefined) {
					var removed = yoodoo.widgets.splice(yw, 1);
					if (removed.length > 0) {
						removed[0].destroy();
						removedSomething = true;
					}
				}
			}
			if ($(yoodoo.container).css("display") !== "none" && $(yoodoo.container).find('.welcome').get().length > 0 && addedSomething)
				setTimeout(function() {
					yoodoo.bookcase.fetchWidgets();
				}, 1000);
			for (var l = 0; l < this.levels.length; l++) {
				this.levelIds[this.levels[l].id.toString()] = l;
				this.levels[l].last = 0;
				this.levels[l].first = 99999;
				this.levels[l].content = 0;
			}
			for (var b = 0; b < this.items.length; b++) {
				if (this.items[b].level_id !== undefined && this.levelIds[this.items[b].level_id] !== undefined) {
					this.levels[this.levelIds[this.items[b].level_id]].content++;
					if (this.levels[this.levelIds[this.items[b].level_id]].last < b)
						this.levels[this.levelIds[this.items[b].level_id]].last = b;
					if (this.levels[this.levelIds[this.items[b].level_id]].first > b)
						this.levels[this.levelIds[this.items[b].level_id]].first = b;
				}
			}
			if (this.bookcaseFirstLoad === null) {
				this.bookcaseFirstLoad = true;
			} else {
				this.bookcaseFirstLoad = false;
			}
		};
		this.progress = function() {
			if (this.autoProgress === true) {
				if (yoodoo.intervention !== null) {
					this.gotoNextItem(true);
				} else {
					this.gotoNextItem();
				}
			} else if ( typeof (this.autoProgress) == 'object') {
				this.gotoItem(this.autoProgress, true);
			}
			this.autoProgress = false;
		};
		this.showIntervention = function() {
			yoodoo.bookcaseContentFilter = {
				show : {},
				hide : {}
			};
			var newIntervention = null;
			var autoPlay = true;
			if (arguments.length > 0)
				newIntervention = arguments[0];
			if (arguments.length > 1)
				autoPlay = arguments[1];
			if (newIntervention != yoodoo.intervention) {
				yoodoo.working(true,(newIntervention>0)?'Configuring Intervention':'Clearing intervention');
				yoodoo.intervention = newIntervention;
				if (this.filter()===false) {
					yoodoo.working(false);
				}else if (yoodoo.intervention===null) {
					yoodoo.working(false);
				}
			//console.log('Finished filtering',new Date().getTime());
				if (yoodoo.intervention !== null)
					this.handlers.intervention_showing(autoPlay);
			}
		};
		this.averageScore = function() {
			var c = 0;
			var t = 0;
			for (var b = 0; b < this.items.length; b++) {
				if (this.items[b].type == "book") {
					if (this.items[b].score > 0) {
						t += (1 * this.items[b].score);
						c++;
					}
				}
			}
			if (c === 0)
				return 0;
			return t / c;
		};
		this.byId = function(id) {
			for (var b = 0; b < this.items.length; b++) {
				if (this.items[b].id == id)
					return this.items[b];
			}
			return false;
		};
		this.byContentId = function(id) {
			for (var b = 0; b < this.items.length; b++) {
				if (this.items[b].content_id == id)
					return this.items[b];
			}
			return false;
		};
		this.initNotReadyWidgets = function() {
			if (yoodoo.welcomeOpen) {
				for (var w = 0; w < yoodoo.widgets.length; w++) {
					if (!yoodoo.widgets[w].readied) {
						yoodoo.widgets[w].init(yoodoo.bookcase.allWidgetsReady);
					}
				}
			}
			return false;
		};
		this.allWidgetsReady = function() {
			var ready = true;
			var w = 0;
			if (yoodoo.welcomeOpen) {
				for ( w = 0; w < yoodoo.widgets.length; w++) {
					if (!yoodoo.widgets[w].readied)
						ready = false;
				}
			} else {
				ready = false;
			}
			if (ready) {
				for ( w = 0; w < yoodoo.widgets.length; w++)
					yoodoo.widgets[w].readyCallback = function() {
					};
				yoodoo.bookcase.display_continue();
				if (!yoodoo.password_updated)
					$($('.tabcontent').slideUp().get(1)).slideDown();
				if (yoodoo.welcomeOpen)
					yoodoo.bookcase.sortWidgets();
			}
		};
		this.fetchWidgets = function() {
			var target = yoodoo.welcomeContainers.bottomPanel;
			$(target).empty();
			var wd = yoodoo.e("div");
			var w = 0;
			for ( w = 0; w < yoodoo.widgets.length; w++) {
				$(wd).append(yoodoo.widgets[w].render());
			}
			for ( w = 0; w < yoodoo.widgets.length; w++)
				yoodoo.widgets[w].readied = false;
			wd.update = function() {
				var w = 0;
				$(this).find(">div").each(function(i, e) {
					w += $(e).outerWidth(true);
				});
				$(this).css({
					width : w + 50
				});
			};
			$(target).append(wd);
			wd.update();
			var l = yoodoo.widgets.length;
			if (arguments.length > 0)
				l = arguments[0];
			var loaded = 0;
			var i = 0;
			var toLoad = [];
			while (i < yoodoo.widgets.length && loaded < l) {
				if (yoodoo.widgets[i].loaded === false) {
					if (yoodoo.widgets[i].id !== undefined)
						toLoad.push(yoodoo.widgets[i].id);
					loaded++;
				}
				i++;
			}
			if (toLoad.length > 0) {
				var p = {};
				p.cmd = 'getWidgets';
				p.widgetIds = toLoad.join(",");
				p.callback = 'yoodoo.bookcase.gotWidgets';
				yoodoo.sendPost(null, p);
			} else {
				yoodoo.bookcase.gotWidgets();
			}
		};
		this.gotWidgets = function(r) {
			if (r !== undefined) {
				var response = {};
				try {
					response = jQuery.parseJSON(yoodoo.ajax ? r : Base64.decode(r));
				} catch (e) {
				}
				var data = response.widgets;
				for (var id in data) {
					try {
						data[id].exercise.display = Base64.decode(data[id].exercise.display);
					} catch (e) {
					}
					for (var k in data[id].fields) {
						try {
							eval('data[id].fields[k][1]=' + Base64.decode(data[id].fields[k][1]) + ';');
						} catch (e) {
							data[id].fields[k][1] = Base64.decode(data[id].fields[k][1]);
						}
					}
					for (var k in data[id].globals) {
						try {
							eval('data[id].globals[k][1]=' + Base64.decode(data[id].globals[k][1]) + ';');
						} catch (e) {
							data[id].globals[k][1] = Base64.decode(data[id].globals[k][1]);
						}
					}
					for (var w = 0; w < yoodoo.widgets.length; w++) {
						if (yoodoo.widgets[w].id == id)
							yoodoo.widgets[w].receiveData(data[id]);
					}
				}
				if (response.usersTotals) {
					yoodoo.usersTotals = response.usersTotals;
				}
			}
			yoodoo.initSlider(yoodoo.welcomeContainers.bottomPanel, $(yoodoo.welcomeContainers.bottomPanel).find('>div').get(0), {
				horizontal : true,
				change : function() {
					if (yoodoo.welcomeContainers.bottomPanelContainer.arrow !== undefined)
						yoodoo.welcomeContainers.bottomPanelContainer.arrow.update();
				}
			});
			yoodoo.bookcase.initNotReadyWidgets();
			if (yoodoo.bookcase.continueControl() === true)
				$(yoodoo.welcomeContainers.frame).addClass("noContinue");
		};
		this.sortWidgets = function() {
			if (yoodoo.widgets.length === 0)
				return false;
			yoodoo.widgets.sort(function(a, b) {
				return b.priority - a.priority;
			});
			var block = $(yoodoo.welcomeContainers.bottomPanel).find('>div');
			if (block.get().length === 0)
				return false;
			var blockLeft = block.offset().left;
			$(yoodoo.welcomeContainers.bottomPanel).find('>div').css({
				position : 'relative'
			});
			var w = 0;
			for ( w = 0; w < yoodoo.widgets.length; w++) {
				var l = $(yoodoo.widgets[w].container).offset().left - blockLeft;
				yoodoo.widgets[w].left = l;
				$(yoodoo.widgets[w].container).css({
					left : l
				});
			}
			for ( w = 0; w < yoodoo.widgets.length; w++) {
				$(yoodoo.widgets[w].container).css({
					position : 'absolute'
				});
			}
			var ol = 0;
			$(yoodoo.welcomeContainers.notices).animate({
				width : $(yoodoo.welcomeContainers.topPanel).width() - $(yoodoo.widgets[0].container).outerWidth(true)
			}, 200);
			$(yoodoo.welcomeContainers.anchorWidget).animate({
				width : $(yoodoo.widgets[0].container).outerWidth(true)
			}, 200, function() {
				if (yoodoo.widgets[0].container.parentNode !== null) {
					var h = $(yoodoo.welcomeContainers.bottomPanel).offset().top - $(yoodoo.welcomeContainers.topPanel).offset().top;
					$(yoodoo.welcomeContainers.frame).css({
						overflow : 'hidden'
					});
					$(yoodoo.welcomeContainers.bottomPanel).css({
						overflow : 'visible'
					});
					for (var w = 0; w < yoodoo.widgets.length; w++) {
						var css = {
							left : ol
						};
						if (w == 0)
							css.top = -h;
						$(yoodoo.widgets[w].container).addClass('widgetMoving').animate(css, 500, function() {
							$(this).removeClass("widgetMoving");
							if ($(this.parentNode).find(".widgetMoving").get().length == 0) {
								for (var ww = 0; ww < yoodoo.widgets.length; ww++) {
									if (ww == 0) {
										yoodoo.welcomeContainers.anchorWidget.appendChild(yoodoo.widgets[ww].container);
									} else {
										if (yoodoo.widgets[ww].container.parentNode)
											yoodoo.widgets[ww].container.parentNode.appendChild(yoodoo.widgets[ww].container);
									}
									if (yoodoo.widgets[ww].object !== undefined && typeof (yoodoo.widgets[ww].object.sorted) == 'function') {
										yoodoo.widgets[ww].object.sorted();
									}
								}
								$(yoodoo.welcomeContainers.bottomPanel).css({
									overflow : 'hidden'
								});
								$(yoodoo.welcomeContainers.bottomPanel).find(".widgetContainer").css({
									position : 'static',
									top : '',
									left : ''
								});
								$(yoodoo.welcomeContainers.anchorWidget).find(".widgetContainer").css({
									position : 'static',
									top : '',
									left : ''
								});
								var w = $(yoodoo.welcomeContainers.bottomPanel).find('>div').get(0);
								if (w !== undefined)
									w.update();
								if ($(yoodoo.welcomeContainers.bottomPanel).width() < $(yoodoo.welcomeContainers.bottomPanel).find('>div').width()) {
									if (yoodoo.welcomeContainers.bottomPanelContainer.arrow === undefined) {
										yoodoo.welcomeContainers.bottomPanelContainer.arrow = {
											left : yoodoo.e("div"),
											right : yoodoo.e("div")
										};
										yoodoo.welcomeContainers.bottomPanelContainer.arrow.update = function() {
											if (yoodoo.welcomeContainers.bottomPanel.scrollLeft < 10) {
												$(yoodoo.welcomeContainers.bottomPanelContainer.arrow.left).addClass("off");
											} else {
												$(yoodoo.welcomeContainers.bottomPanelContainer.arrow.left).removeClass("off");
											}
											if ($(yoodoo.welcomeContainers.bottomPanel).find('.widgetContainer').get().length > 0) {
												var lw = $(yoodoo.welcomeContainers.bottomPanel).find('.widgetContainer').last();
												var rx = $(yoodoo.welcomeContainers.bottomPanel).offset().left + $(yoodoo.welcomeContainers.bottomPanel).width();
												var rdx = rx - (lw.offset().left + lw.width());
												if (rdx > 0) {
													$(yoodoo.welcomeContainers.bottomPanelContainer.arrow.right).addClass("off");
												} else {
													$(yoodoo.welcomeContainers.bottomPanelContainer.arrow.right).removeClass("off");
												}
											}
										};
									}
									$(yoodoo.welcomeContainers.bottomPanelContainer.arrow.left).addClass('widgetLeft').addClass("off").append($(yoodoo.e("div")).html('<div>' + (yoodoo.is_touch ? 'Swipe' : 'Drag') + ' the<br />widgets right<br />for more</div>'));
									$(yoodoo.welcomeContainers.bottomPanelContainer.arrow.right).addClass('widgetRight').addClass("off").append($(yoodoo.e("div")).html('<div>' + (yoodoo.is_touch ? 'Swipe' : 'Drag') + ' the<br />widgets left<br />for more</div>'));
									$(yoodoo.welcomeContainers.bottomPanelContainer).prepend(yoodoo.welcomeContainers.bottomPanelContainer.arrow.left);
									$(yoodoo.welcomeContainers.bottomPanelContainer).append(yoodoo.welcomeContainers.bottomPanelContainer.arrow.right);
									yoodoo.welcomeContainers.bottomPanelContainer.arrow.update();
								} else {
									if (yoodoo.welcomeContainers.bottomPanelContainer.arrow !== undefined) {
										$(yoodoo.welcomeContainers.bottomPanelContainer.arrow.left).fadeOut(200, function() {
											$(this).remove();
										});
										$(yoodoo.welcomeContainers.bottomPanelContainer.arrow.right).fadeOut(200, function() {
											$(this).remove();
										});
									}
								}
							}
						});
						if (w > 0)
							ol += $(yoodoo.widgets[w].container).outerWidth(true);
					}
				}
				yoodoo.events.trigger('widgetsComplete');
			});
		};
		this.updateWidgetField = function(field_name, field_data) {
			for (var w = 0; w < yoodoo.widgets.length; w++) {
				if (yoodoo.widgets[w].data !== undefined && yoodoo.widgets[w].data.fields !== undefined && yoodoo.widgets[w].data.fields[field_name] !== undefined) {
					yoodoo.widgets[w].data.fields[field_name] = field_data;
					if (yoodoo.widgets[w].field_was_updated !== undefined)
						yoodoo.widgets[w].field_was_updated();
				}
			}
			yoodoo.bookcase.display_continue();
		};
		this.continueControl = function() {
			for (var w = 0; w < yoodoo.widgets.length; w++) {
				if (yoodoo.widgets[w].data.exercise !== undefined && yoodoo.widgets[w].data.exercise.display.continueControl === true)
					return true;
			}
			return false;
		};
		this.display_continue = function() {
			var allowed = true;
			if (yoodoo.first_login && !yoodoo.password_updated)
				allowed = false;
			if (allowed) {
				for (var w = 0; w < yoodoo.widgets.length; w++) {
					if (yoodoo.widgets[w].preventing_continue())
						allowed = false;
				}
			}
			if (allowed) {
				$(yoodoo.welcomeContainers.frame).removeClass("noContinue");
			} else {
				$(yoodoo.welcomeContainers.frame).addClass("noContinue");
			}
			return allowed;
		};
		this.lastCheckInStandardJourney = false;
		this.checkChanges = function() {
			if (this.lastCheckInStandardJourney && yoodoo.intervention === null) {
				var removed = 0;
				var added = 0;
				if (this.lastBookcase !== undefined) {
					for (var i = 0; i < this.items.length; i++) {
						if (this.items[i].visible) {
							if (this.lastBookcase[this.items[i].content_id] !== true) {
								added++;
							} else {
								this.lastBookcase[this.items[i].content_id] = false;
							}
						} else {
							if (this.lastBookcase[this.items[i].content_id] === true) {
								this.lastBookcase[this.items[i].content_id] = false;
								removed++;
							}
						}
					}
					for (var id in this.lastBookcase) {
						if (this.lastBookcase[id] === true)
							removed++;
					}
					var m = null;
					if (added > 0 && removed == 0)
						m = yoodoo.w('journeyLonger');
					if (removed > 0 && added == 0)
						m = yoodoo.w('journeyShorter');
					if (removed > 0 && added > 0)
						m = yoodoo.w('journeyChanged');
					if (m !== null)
						yoodoo.alert(m, [], 4);
				}
				this.lastBookcase = {};
				for (var i = 0; i < this.items.length; i++) {
					if (this.items[i].visible)
						this.lastBookcase[this.items[i].content_id] = true;
				}
			}
			this.lastCheckInStandardJourney = (yoodoo.intervention === null);
		};
		this.filter = function() {
			this.showingIntervention = (yoodoo.intervention === null);
			this.handlers.bookcase_prefilter();
			this.removeFromXML = {
				book : [],
				dooit : [],
				document : []
			};
			var hideRest = false;
			this.nextReveal = null;
			var previousCompleted = true;
			var previousCompletedTime = 0;
			var today = new Date();
			this.nextItem = null;
			this.revealItem = null;
			var idx = 0;
			if (yoodoo.debuggerz.getAllItems === true) {
				for (var i = 0; i < this.items.length; i++) {
					this.items[i].visible = true;
					this.items[i].xmlindex = i;
				}
			} else {
				var bookcaseLength=0;
				for (var i = 0; i < this.items.length; i++) {
					this.items[i].index = i;
					if (yoodoo.intervention !== null) {
						this.items[i].visible = (this.items[i].intervention == yoodoo.intervention);
						if (!this.items[i].visible) {
							this.removeFromXML[this.items[i].type].push(this.items[i].id);
							this.items[i].xmlindex = null;
						} else {
							this.items[i].xmlindex = idx++;
						}
					} else {
						this.items[i].visible = !(this.items[i].intervention > 0 && this.items[i].intervention_exclude !== true);
						if (this.items[i].hidden === true) {
							this.items[i].visible = false;
						} else {
							if (yoodoo.revealMinutes !== undefined) {
								if (previousCompletedTime.getTime !== undefined && this.items[i].hideTilPreviousCompleteHours > 0 && yoodoo.revealMinutes !== undefined)
									previousCompletedTime = new Date(previousCompletedTime.getFullYear(), previousCompletedTime.getMonth(), previousCompletedTime.getDate(), previousCompletedTime.getHours(), previousCompletedTime.getMinutes() + this.revealMinutes, previousCompletedTime.getSeconds());
							} else {
								if (previousCompletedTime.getTime !== undefined && this.items[i].hideTilPreviousCompleteHours > 0)
									previousCompletedTime = new Date(previousCompletedTime.getFullYear(), previousCompletedTime.getMonth(), previousCompletedTime.getDate(), previousCompletedTime.getHours() + parseInt(this.items[i].hideTilPreviousCompleteHours), previousCompletedTime.getMinutes(), previousCompletedTime.getSeconds());
							}
						}
						if (this.items[i].visible === true) {
							if (hideRest) {
								if (this.revealItem === null && this.nextReveal !== null)
									this.revealItem = this.items[i];
								this.items[i].visible = false;
							} else if (this.items[i].hideIfComplete && this.items[i].completed) {
								this.items[i].visible = false;
							} else if (this.items[i].hideTilPreviousComplete && !previousCompleted) {
								this.items[i].visible = false;
							} else if (this.items[i].hideTilPreviousComplete && previousCompleted && (this.items[i].hideTilPreviousCompleteHours > 0 && previousCompletedTime > 0 && previousCompletedTime.getTime() >= today.getTime()
							)) {
								if (this.nextReveal === null || this.nextReveal < previousCompletedTime) {
									this.nextReveal = previousCompletedTime;
									this.items[i].visible = false;
									this.revealItem = this.items[i];
								}
							} else {
								this.items[i].visible = !(yoodoo.bookcaseContentFilter.hide[this.items[i].content_id] === true);
							}
						}
						if (!this.items[i].visible) {
							this.removeFromXML[this.items[i].type].push(this.items[i].id);
							this.items[i].xmlindex = null;
						} else {
							this.items[i].xmlindex = idx++;
						}
						if (this.items[i].hideAfterTilComplete && !this.items[i].completed && !(yoodoo.intervention > 0))
							hideRest = true;
						if (!hideRest) {
							if (yoodoo.intervention === null && this.items[i].hideAfterTilComplete && this.items[i].completed && !(yoodoo.intervention > 0 && this.items[i].intervention_exclude !== true) && this.items[i].completed_date.getTime !== undefined) {
								var completedTime = this.items[i].completed_date;
								if (this.items[i].hideAfterTilCompleteHours > 0) {
									if (yoodoo.revealMinutes !== undefined) {
										completedTime = new Date(completedTime.getFullYear(), completedTime.getMonth(), completedTime.getDate(), completedTime.getHours(), completedTime.getMinutes() + yoodoo.revealMinutes, completedTime.getSeconds());
									} else {
										completedTime = new Date(completedTime.getFullYear(), completedTime.getMonth(), completedTime.getDate(), completedTime.getHours() + parseInt(this.items[i].hideAfterTilCompleteHours), completedTime.getMinutes(), completedTime.getSeconds());
									}
									if (completedTime > today) {
										hideRest = true;
										this.nextReveal = completedTime;
									}
								}
							}
							previousCompleted = this.items[i].completed;
							if (previousCompleted && this.items[i].completed_date !== undefined) {
								previousCompletedTime = this.items[i].completed_date;
							} else {
								previousCompletedTime = 0;
							}
						}
					}
					if (this.items[i].visible) bookcaseLength++;
				}
			}
			this.nextItem = this.getNextItem();
			if (this.revealItem !== null) {
				if (this.nextReveal > new Date()) {
					yoodoo.alert(yoodoo.w('moreshallberevealedat', {
						date : yoodoo.formatDate('H:i jS F', this.nextReveal)
					}), [], 5);
				}
			}
			this.handlers.bookcase_postfilter();
			return (bookcaseLength>0);
		};
		this.fetched = {
			standard : null
		};
		this.getFirstIncomplete = function() {
			for (var i = 0; i < this.items.length; i++) {
				if (this.items[i].visible === true && this.items[i].completed !== true && ((this.items[i].intervention > 0 && this.items[i].intervention == yoodoo.intervention) || (!(this.items[i].intervention > 0) && yoodoo.intervention === null)
					))
					return this.items[i];
			}
			return null;
		};
		this.getLastComplete = function() {
			for (var i = this.items.length - 1; i >= 0; i--) {
				if (this.items[i].visible === true && this.items[i].completed === true && ((this.items[i].intervention > 0 && this.items[i].intervention == yoodoo.intervention) || (!(this.items[i].intervention > 0) && yoodoo.intervention === null)
					))
					return this.items[i];
			}
			return null;
		};
		this.getFetchedItem = function() {
			return this.fetched[(yoodoo.intervention === null) ? 'standard' : yoodoo.intervention];
		};
		this.getCurrentItem = function() {
			var last = this.getFetchedItem();
			if (last === undefined || last === null)
				last = this.getNextItem();
			if (last === undefined || last === null)
				last = this.getLastComplete();
			return last;
		};
		this.getNextItem = function() {
			var last = this.getFetchedItem();
			if (last === undefined || last === null)
				return this.getFirstIncomplete();
			var foundLevel = false;
			for (var i = 0; i < this.items.length; i++) {
				if (this.items[i].level_id == last.level_id)
					foundLevel = true;
				if (this.items[i].visible === true && ((this.items[i].sortPriority > last.sortPriority && this.items[i].level_id == last.level_id) || (foundLevel && this.items[i].level_id != last.level_id)
					) && ((this.items[i].intervention > 0 && this.items[i].intervention == yoodoo.intervention) || (!(this.items[i].intervention > 0) && yoodoo.intervention === null)
					))
					return this.items[i];
			}
			return this.getLastComplete();
		};
		this.fetchContent = function(id) {
			for (var i = 0; i < this.items.length; i++) {
				if (this.items[i].content_id == id)
					return this.items[i];
			}
			return null;
		};
		this.fetchDooit = function(id) {
			for (var i = 0; i < this.items.length; i++) {
				if (this.items[i].id == id && this.items[i].type == 'dooit')
					return this.items[i];
			}
			return null;
		};
		this.interventionLength = function(id) {
			var c = 0;
			for (var i = 0; i < this.items.length; i++) {
				if (this.items[i].intervention == id)
					c++;
			}
			return c;
		};
		this.gotoNextItem = function() {
			var ni = this.getNextItem();
			if (ni != null) {
				if (arguments.length > 1 && ni === arguments[1]) {
				} else if (arguments.length > 0) {
					this.gotoItem(ni, arguments[0]);
				} else {
					this.gotoItem(ni);
				}
			}
		};
		this.gotoItem = function(item) {
			var autoPlay = item.autoplay && !item.completed;
			if (arguments.length > 1)
				autoPlay = arguments[1];
			if (yoodoo.html5) {
				yoodooPlaya[yoodoo.cmdHTML5.scrollTo.playa](item.index, autoPlay);
			} else {
				if (item.type == 'dooit') {
					this.scrollTo(item, 0);
					if (autoPlay)
						setTimeout('yoodoo.showDooit("' + item.id + '");', 1500);
				} else {
					if (autoPlay) {
						setTimeout('yoodoo.startEpisode(' + item.id + ');', 500);
					} else {
						this.scrollTo(item, 0);
					}
				}
			}
		};
		this.scrollTo = function(item) {
			var delay = 1000;
			if (arguments.length > 1)
				delay = arguments[1];
			if (yoodoo.html5) {
				if (item !== undefined && item !== null)
					setTimeout('yoodooPlaya.' + yoodoo.cmd.scrollTo.playa + '(' + item.index + ')', delay);
			} else {
				if (item !== undefined && item !== null)
					setTimeout('yoodoo.callFlash(yoodoo.cmd.scrollTo.flash,' + (item.xmlindex + 1) + ');', delay);
			}
		};
		this.events = {
			bookcase : {
				parsed : function() {
					yoodoo.events.trigger("bookcaseLoaded", this.items);
					if (this.object.settings !== undefined && this.object.settings.levelcompletetext !== undefined)
						yoodoo.alert(this.object.settings.levelcompletetext, [], 4);
					yoodoo.debuggerz.showTags(this.object.tags);
					this.object.filter();
				},
				prefilter : function() {
					if (yoodoo.preProcessFilterBookcase !== undefined)
						yoodoo.preProcessFilterBookcase();
				},
				postfilter : function() {
					var fetchedItem = this.object.getCurrentItem();
					var currentItem = null;
					if (fetchedItem !== null && fetchedItem.visible === false) {
						var idx = fetchedItem.index;
						if (idx > 0) {
							while (idx < this.object.items.length - 1 && this.object.items[idx].visible == false)
							idx++;
							currentItem = this.object.items[idx];
						}
					} else {
						currentItem = fetchedItem;
					}
					if (!yoodoo.html5) {
						var txt = this.object.cachedXML;
						for (var type in this.object.removeFromXML) {
							for (var i = 0; i < this.object.removeFromXML[type].length; i++) {
								txt = yoodoo.removeXML(type, this.object.removeFromXML[type][i], txt);
							}
						}
						yoodoo.callFlash(yoodoo.cmd.introText.flash, yoodoo.flash_message);
						yoodoo.callFlash(yoodoo.cmd.bookshelfxml.flash, txt, (currentItem !== null && currentItem !== undefined) ? currentItem.xmlindex + 1 : -1);
					} else {
						yoodooPlaya.bookcaseLoaded(this.object, (currentItem !== null && currentItem !== undefined) ? currentItem.index : -1);
					}
					this.object.checkChanges();
					if (yoodoo.postProcessFilter !== undefined)
						yoodoo.postProcessFilter();
					yoodoo.postProcessFilter = undefined;
					var me = this.object;
					setTimeout(function() {
						me.progress();
					}, 500);
				}
			},
			intervention : {
				ContentRead : {},
				read : function(item) {
					if (item.intervention > 0 && yoodoo.intervention == item.intervention) {
						this.intervention_ContentRead[item.content_id] = true;
					} else {
						this.intervention_ContentRead = {};
					}
				},
				nextItem : null,
				onCloseAction : null,
				check : function() {
					if (yoodoo.intervention === null)
						return false;
					var complete = true;
					this.intervention_nextItem = null;
					for (var i = 0; i < this.object.items.length; i++) {
						if (this.object.items[i].intervention == yoodoo.intervention && this.intervention_ContentRead[this.object.items[i].content_id] !== true) {
							complete = false;
							if (this.intervention_nextItem === null)
								this.intervention_nextItem = this.object.items[i];
						}
					}
					if (complete) {
						yoodoo.intervention = null;
						this.intervention_ContentRead = {};
					}
					if (complete) {
						if (this.intervention_onCloseAction !== null) {
							yoodoo.nextActions.push(this.intervention_onCloseAction);
							this.intervention_onCloseAction = null;
						} else {
							if (yoodoo.nextActions.length == 0)
								yoodoo.nextActions.push('yoodoo.welcome();');
						}
					} else {
						yoodoo.nextActions.push('yoodoo.bookcase.gotoItem(yoodoo.bookcase.handlers.intervention_nextItem,true);');
					}
					return complete;
				},
				getNextItem : function() {
					this.intervention_nextItem = null;
					for (var i = 0; i < this.object.items.length; i++) {
						if (this.object.items[i].intervention == yoodoo.intervention && this.intervention_ContentRead[this.object.items[i].content_id] !== true) {
							if (this.intervention_nextItem === null) {
								return this.intervention_nextItem = this.object.items[i];
							}
						}
					}
					return null;
				},
				showing : function() {
					if (arguments.length > 0 && arguments[0] === true) {
						this.intervention_ContentRead = {};
						var ni = this.intervention_getNextItem();
						if (ni !== null)
							setTimeout(function() {
								yoodoo.bookcase.gotoItem(yoodoo.bookcase.handlers.intervention_nextItem, true);
							}, 100);
					}
				}
			},
			episode : {
				requested : function(item) {
					if ( typeof (item) != 'object')
						item = this.object.fetchContent(item);
					this.object.fetched[(yoodoo.intervention === null) ? 'standard' : yoodoo.intervention] = (item !== null) ? item : null;
					if (item !== null) {
						yoodoo.actionLogging.add('open book', {
							id : item.content_id
						});
						this.intervention_read(item);
					}
				},
				received : function() {
					var item = this.object.fetched[(yoodoo.intervention === null) ? 'standard' : yoodoo.intervention];
					if (item !== undefined && item !== null) {
						yoodoo.events.trigger("loadPlayit", item);
					}
				},
				exit : function() {
					var item = this.object.fetched[(yoodoo.intervention === null) ? 'standard' : yoodoo.intervention];
					if (item !== null) {
						if (yoodoo.intervention !== null) {
							this.object.autoProgress = false;
							if (this.object.handlers.intervention_check()) {
								this.object.filter();
								yoodoo.doNextActions();
							} else {
								var me = this.object;
								yoodoo.doNextActions(function() {
									me.gotoNextItem(true, item);
								});
							}
						} else if (item.completed === true) {
							this.object.autoProgress = false;
							yoodoo.doNextActions(function() {
								yoodoo.bookcase.autoProgress = true;
								yoodoo.bookcase.progress();
							});
						} else {
							yoodoo.doNextActions();
						}
					}
				},
				complete : function() {
					var item = this.object.fetched[(yoodoo.intervention === null) ? 'standard' : yoodoo.intervention];
					if (item !== null) {
						yoodoo.actionLogging.add('episode complete', {
							id : item.content_id
						});
					}
				}
			},
			dooit : {
				requested : function(item) {
					if ( typeof (item) != 'object')
						item = this.object.fetchDooit(item);
					this.object.fetched[(yoodoo.intervention === null) ? 'standard' : yoodoo.intervention] = (item !== null) ? item : null;
					if (item !== null) {
						yoodoo.actionLogging.add('open dooit', {
							id : item.content_id
						});
						this.intervention_read(item);
					}
				},
				received : function() {
					var item = this.object.fetched[(yoodoo.intervention === null) ? 'standard' : yoodoo.intervention];
					if (item !== null) {
					}
				},
				onCloseAction : null,
				exit : function(autoProgress) {
					var item = this.object.fetched[(yoodoo.intervention === null) ? 'standard' : yoodoo.intervention];
					if (item !== null) {
						if (autoProgress === null)
							autoProgress = item.completed;
						var doactions = false;
						if (yoodoo.events.dooit_onCloseAction !== null && yoodoo.events.dooit_onCloseAction !== undefined) {
							yoodoo.nextActions = [yoodoo.events.dooit_onCloseAction];
							yoodoo.events.dooit_onCloseAction = null;
							autoProgress = false;
							doactions = true;
						}
						this.object.autoProgress = autoProgress;
						if (yoodoo.intervention !== null) {
							this.object.autoProgress = false;
							if (this.object.handlers.intervention_check()) {
								this.object.filter();
								yoodoo.doNextActions();
							} else {
								var me = this.object;
								yoodoo.doNextActions(function() {
									me.gotoNextItem(true, item);
								});
							}
						} else if ((autoProgress && item.completed === true) || doactions) {
							yoodoo.doNextActions();
						}
					}
				},
				complete : function() {
					var item = this.object.fetched[(yoodoo.intervention === null) ? 'standard' : yoodoo.intervention];
					if (item !== null) {
					}
				}
			},
			document : {
				requested : function(item) {
					if ( typeof (item) != 'object')
						item = this.object.fetchContent(item);
					this.object.fetched[(yoodoo.intervention === null) ? 'standard' : yoodoo.intervention] = (item !== null) ? item : null;
					if (item !== null) {
						yoodoo.actionLogging.add('open document', {
							id : item.content_id
						});
						this.intervention_read(item);
					}
				}
			}
		};
		this.handlers = {
			object : this
		};
		for (var e in this.events) {
			for (var ee in this.events[e]) {
				this.handlers[e + '_' + ee] = this.events[e][ee];
			}
		}
		this.parse(xml);
	},
	book : function(node) {
		this.settings = {
			boundary : 10,
			heading : {
				height : 0
			},
			movie : {
				aspect : 1.7845,
				originalWidth : 530,
				originalHeight : 297,
				tolerance : 30,
				width : 530,
				height : 297,
				proportion : 0.8,
				progress : {
					height : 15,
					minHeight : 10,
					maxHeight : 40,
					proportion : 0.05
				}
			},
			keypoints : {
				width : 200,
				height : 297,
				minWidth : 100,
				minHeight : 18,
				maxHeight : 30,
				maxFontHeight : 14,
				margin : 2
			},
			chapters : {
				width : 530,
				height : 297,
				minHeight : 60
			}
		};
		this.visible = true;
		this.hidden = false;
		this.changed = true;
		this.chapters = [];
		this.type = "book";
		this.saveXML = null;
		this.id = node.getAttribute("id");
		var kid = node.firstChild;
		this.chapter = 0;
		while (kid !== null) {
			if (kid.nodeName == "chapters") {
				var chapter = kid.firstChild;
				while (chapter !== null) {
					var c = null;
					if (chapter.nodeName == "quiz") {
						c = new yoodoo.element.quiz(chapter);
					} else {
						c = new yoodoo.element.chapter(chapter);
					}
					this.chapters.push(c);
					chapter = chapter.nextSibling;
				}
			} else if (kid.firstChild) {
				this[kid.nodeName] = (kid.firstChild.data == "true") ? true : ((kid.firstChild.data == "false") ? false : (kid.firstChild.data));
			} else if (kid.data) {
				this[kid.nodeName] = (kid.data == "true") ? true : ((kid.data == "false") ? false : (kid.data));
			}
			kid = kid.nextSibling;
		}
		if (this.hidden === true)
			this.visible = false;
		this.sortPriority = parseInt(this.sortPriority);
		if (this.completed_date !== undefined) {
			var t = null;
			try {
				eval('t=' + this.completed_date);
				this.completed_date = new Date(t.getTime() + yoodoo.serverTimeOffset);
			} catch(e) {
			}
		}
		this.reload = function(node) {
			this.visible = true;
			var params = {};
			var kid = node.firstChild;
			while (kid !== null) {
				if (kid.nodeName == "chapters") {
				} else if (kid.firstChild) {
					params[kid.nodeName] = (kid.firstChild.data == "true") ? true : ((kid.firstChild.data == "false") ? false : (kid.firstChild.data));
				} else if (kid.data) {
					params[kid.nodeName] = (kid.data == "true") ? true : ((kid.data == "false") ? false : (kid.data));
				}
				kid = kid.nextSibling;
			}
			this.changed = false;
			for (var k in params) {
				if (!(/mlUrl/.test(k)) && params[k] != this[k]) {
					this.changed = true;
					this[k] = params[k];
				}
			}
			this.visible = (this.hidden !== true);
			this.sortPriority = parseInt(this.sortPriority);
			if (this.completed_date !== undefined) {
				var t = null;
				try {
					eval('t=' + this.completed_date);
					this.completed_date = new Date(t.getTime() + yoodoo.serverTimeOffset);
				} catch(e) {
				}
			}
		};
		this.validateCompletion = function() {
			if (this.mandatoryChapterComplete()) {
				if (this.quizComplete()) {
					this.isComplete = true;
				}
			}
		};
		this.mandatoryChapterComplete = function() {
			var complete = ( typeof (this.mandatorychapter) == "undefined");
			for (var c = 0; c < this.chapters.length; c++) {
				if (this.chapters[c].type == "chapter" && this.chapters[c].id == this.mandatorychapter && this.chapters[c].progressed && this.chapters[c].progressed > 51)
					complete = true;
			}
			return complete;
		};
		this.quizComplete = function() {
			var complete = true;
			for (var c = 0; c < this.chapters.length; c++) {
				if (this.chapters[c].type == "quiz" && this.chapters[c].completed !== true)
					complete = false;
				if (this.chapters[c].type == "quiz" && complete && this.chapters[c].xml !== undefined)
					this.saveXML = this.chapters[c].xml;
			}
			return complete;
		};
		this.quizScore = function() {
			var score = 0;
			var quizzes = 0;
			for (var c = 0; c < this.chapters.length; c++) {
				if (this.chapters[c].type == "quiz" && !isNaN(this.chapters[c].score)) {
					score += this.chapters[c].score;
					quizzes++;
				}
			}
			return (quizzes == 0) ? 0 : (score / quizzes);
		};
	},
	dooit : function(node) {
		this.chapters = [];
		this.type = "dooit";
		this.visible = true;
		this.hidden = false;
		this.changed = true;
		this.id = node.getAttribute("id");
		var kid = node.firstChild;
		while (kid !== null) {
			if (kid.firstChild) {
				this[kid.nodeName] = (kid.firstChild.data == "true") ? true : ((kid.firstChild.data == "false") ? false : (kid.firstChild.data));
			} else if (kid.data) {
				this[kid.nodeName] = (kid.data == "true") ? true : ((kid.data == "false") ? false : (kid.data));
			}
			kid = kid.nextSibling;
		}
		if (this.hidden === true)
			this.visible = false;
		this.sortPriority = parseInt(this.sortPriority);
		if (this.completed_date !== undefined) {
			var t = null;
			try {
				eval('t=' + this.completed_date);
				this.completed_date = new Date(t.getTime() + yoodoo.serverTimeOffset);
			} catch(e) {
			}
		}
		this.reload = function(node) {
			var params = {};
			var kid = node.firstChild;
			while (kid !== null) {
				if (kid.nodeName == "chapters") {
				} else if (kid.firstChild) {
					params[kid.nodeName] = (kid.firstChild.data == "true") ? true : ((kid.firstChild.data == "false") ? false : (kid.firstChild.data));
				} else if (kid.data) {
					params[kid.nodeName] = (kid.data == "true") ? true : ((kid.data == "false") ? false : (kid.data));
				}
				kid = kid.nextSibling;
			}
			this.changed = false;
			for (var k in params) {
				if (params[k] != this[k]) {
					this.changed = true;
					this[k] = params[k];
				}
			}
			this.visible = (this.hidden !== true);
			this.sortPriority = parseInt(this.sortPriority);
			if (this.completed_date !== undefined) {
				var t = null;
				try {
					eval('t=' + this.completed_date);
					this.completed_date = new Date(t.getTime() + yoodoo.serverTimeOffset);
				} catch(e) {
				}
			}
		};
	},
	doc : function(node) {
		this.chapters = [];
		this.type = "document";
		this.visible = true;
		this.changed = true;
		this.id = node.getAttribute("id");
		var kid = node.firstChild;
		while (kid !== null) {
			if (kid.firstChild) {
				this[kid.nodeName] = (kid.firstChild.data == "true") ? true : ((kid.firstChild.data == "false") ? false : (kid.firstChild.data));
			} else if (kid.data) {
				this[kid.nodeName] = (kid.data == "true") ? true : ((kid.data == "false") ? false : (kid.data));
			}
			kid = kid.nextSibling;
		}
		this.sortPriority = parseInt(this.sortPriority);
		if (this.completed_date !== undefined) {
			var t = null;
			try {
				eval('t=' + this.completed_date);
				this.completed_date = new Date(t.getTime() + yoodoo.serverTimeOffset);
			} catch(e) {
			}
		}
		this.reload = function(node) {
			var params = {};
			var kid = node.firstChild;
			while (kid !== null) {
				if (kid.firstChild) {
					params[kid.nodeName] = (kid.firstChild.data == "true") ? true : ((kid.firstChild.data == "false") ? false : (kid.firstChild.data));
				} else if (kid.data) {
					params[kid.nodeName] = (kid.data == "true") ? true : ((kid.data == "false") ? false : (kid.data));
				}
				kid = kid.nextSibling;
			}
			this.changed = false;
			for (var k in params) {
				if (!(/mlUrl/.test(k)) && params[k] != this[k]) {
					this.changed = true;
					this[k] = params[k];
				}
			}
			this.visible = (this.hidden !== true);
			this.sortPriority = parseInt(this.sortPriority);
			if (this.completed_date !== undefined) {
				var t = null;
				try {
					eval('t=' + this.completed_date);
					this.completed_date = new Date(t.getTime() + yoodoo.serverTimeOffset);
				} catch(e) {
				}
			}
		};
	},
	widgets : {
		progress : function(src) {
			this.widget = src;
			this.progress = true;
			this.widget.autoReady = false;
			this.widget.setSize({
				aspect : 2.5,
				complete : function(widget) {
					widget.readied = true;
					widget.readyCallback();
					widget.data.exercise.display.object.displayed();
				}
			});
			this.averageScore = yoodoo.bookcase.averageScore();
			this.widget.priority = 100;
			$(this.widget.display).empty();
			this.build = function() {
				var f = yoodoo.e("div");
				if (yoodoo.intervention !== null) {
					$(f).html(yoodoo.w('youarecurrentlyoutsideyourstandardcontent'));
				} else {
					var as = '';
					this.progressBlock = yoodoo.e("button");
					$(this.progressBlock).attr("type", "button").click(function() {
						yoodoo.closeWelcome();
					}).html('<span>' + yoodoo.w('gotoyourbookcase') + '</span>').addClass('progressBlock').addClass('onlyContinue').css({
						opacity : 0
					});
					var lastHidden = 0;
					var visible = 0;
					var completed = 0;
					var hidden = 0;
					for (var i = 0; i < yoodoo.bookcase.items.length; i++) {
						if (yoodoo.bookcase.items[i].hidden === false && (yoodoo.bookcase.items[i].intervention === undefined || yoodoo.bookcase.items[i].intervention_exclude === true)) {
							if (yoodoo.bookcase.items[i].visible === false && yoodoo.bookcase.nextReveal !== null) {
								var b = yoodoo.e("div");
								$(b).addClass("hidden");
								lastHidden++;
								hidden++;
								if (lastHidden < 10)
									$(this.progressBlock).append(b);
							} else if (yoodoo.bookcase.items[i].visible !== false) {
								var b = yoodoo.e("div");
								visible++;
								lastHidden = 0;
								if (yoodoo.bookcase.items[i].completed === true) {
									$(b).addClass("complete");
									completed++;
								}
								$(this.progressBlock).append(b);
							}
						}
					}
					if (visible > 0) {
						var str = yoodoo.w('youhavecompleted' + ((completed == 0) ? 'none' : 'n') + 'ofthencurrentlyavailabletoyou', {
							completed : completed,
							available : visible
						});
						if (completed == visible) {
							str = yoodoo.w('youhavecompleted' + ((visible == 2) ? 'both' : ((visible == 1) ? 'theone' : 'alln')) + 'currentlyavailabletoyou', {
								available : visible
							});
						}
						if (yoodoo.bookcase.nextReveal !== null && hidden > 0)
							str += '<br />' + yoodoo.w('youarealsowaitingfor' + ((hidden > 1) ? 'some' : 'one') + 'toberevealed');
						yoodoo.bubble(this.progressBlock, str);
					}
					var homeLevel = yoodoo.e("div");
					var averageScore = yoodoo.e("div");
					averageScore.id = 'averageScoreDiv';
					if (this.averageScore > 0)
						as = yoodoo.w('averagequizscore') + ': <b>' + this.averageScore.toFixed(1) + '%</b>';
					$(averageScore).html(as);
					var episodeText = yoodoo.e("div");
					var firstIncomplete = yoodoo.bookcase.getFirstIncomplete();
					if (firstIncomplete === null)
						firstIncomplete = yoodoo.bookcase.nextItem;
					if (yoodoo.bookcase.revealItem !== null) {
						var type = 'episode';
						if (yoodoo.bookcase.revealItem.type == 'dooit')
							type = 'dooit';
						if (yoodoo.bookcase.revealItem.type == 'doc')
							type = 'doc';
						$(episodeText).addClass('episodeText').addClass('onlyContinue').html(yoodoo.w('willbecomeavailablein', {
							title : yoodoo.w(type) + ' <b>' + yoodoo.bookcase.revealItem.title + '</b>'
						}));
					} else if (firstIncomplete !== null && visible != completed) {
						var type = 'episode';
						if (firstIncomplete.type == 'dooit')
							type = 'dooit';
						if (firstIncomplete.type == 'doc')
							type = 'doc';
						$(episodeText).addClass('episodeText').addClass('onlyContinue').html(yoodoo.w('yournextitemis', {
							type : yoodoo.w(type),
							title : '<b>' + firstIncomplete.title + '</b>'
						})).css({
							padding : '5px 10px'
						});
					} else {
						$(episodeText).empty();
					}
					var blankText = yoodoo.e("div");
					$(blankText).addClass('notContinue').css({
						'padding-top' : '25px',
						'font-style' : 'italic'
					}).html("<center>" + yoodoo.w('youhavependingactionsrequiredbeforeyoucanenteryourbookcase') + "</center>");
					if (yoodoo.bookcase.nextReveal !== null) {
						this.revealerDiv = yoodoo.e("div");
						$(f).empty().html(yoodoo.home_progress_text).append(this.progressBlock).append(episodeText).append($(this.revealerDiv).addClass('countdown'));
						this.setRevealTime();
						var me = this;
						var thisInterval = setInterval(function() {
							if (me.widget.container === undefined || me.widget.container.parentNode === null) {
								clearInterval(thisInterval);
							} else {
								me.setRevealTime();
							}
						}, 1000);
						this.thisInterval = thisInterval;
					} else {
						$(f).html('<span class="onlyContinue">' + yoodoo.w('home_progress_text') + '</span>').append(this.progressBlock).append(homeLevel).append(averageScore).append(episodeText).append(blankText);
					}
				}
				$(this.widget.display).empty().append(f);
			};
			this.displayed = function() {
				var w = $(this.progressBlock).width();
				var c = $(this.progressBlock).find('>div').get().length;
				var cw = Math.floor((w - c) / c);
				if (cw > 10)
					cw = 10;
				if (cw < 1)
					cw = 1;
				$(this.progressBlock).find('>div').css({
					width : cw
				});
				$(this.progressBlock).animate({
					opacity : 1
				});
			};
			this.setRevealTime = function() {
				if (yoodoo.bookcase.nextReveal === null)
					return false;
				var minute = 60;
				var hour = 60 * minute;
				var day = hour * 24;
				var week = 7 * day;
				var month = 30.42 * day;
				var dt = Math.floor((yoodoo.bookcase.nextReveal.getTime() - (new Date().getTime())) / 1000);
				if (dt < 0) {
					clearInterval(this.thisInterval);
					yoodoo.bookcase.nextReveal = null;
					yoodoo.bookcase.revealItem = null;
					var me = this;
					yoodoo.postProcessFilter = function() {
						me.build();
						me.displayed();
					};
					yoodoo.bookcase.filter();
				} else {
					var m = Math.floor(dt / month);
					dt -= (m * month);
					var d = Math.floor(dt / day);
					dt -= (d * day);
					var h = Math.floor(dt / hour);
					dt -= (h * hour);
					var min = Math.floor(dt / minute);
					dt -= (min * minute);
					var s = dt;
					var str = [];
					if (m > 0)
						str.push(m + ' ' + yoodoo.w('month' + ((m == 1) ? '' : 's')));
					if (d > 0)
						str.push(d + ' ' + yoodoo.w('day' + ((d == 1) ? '' : 's')));
					str.push(h + ':' + ((min < 10) ? '0' : '') + min + ':' + ((s < 10) ? '0' : '') + s);
					$(this.revealerDiv).html(str.join(" "));
				}
			};
			this.build();
		}
	},
	widget : function(node) {
		this.loaded = false;
		this.container = null;
		this.window = null;
		this.display = null;
		this.loadingBlock = null;
		this.data = {};
		this.readied = false;
		this.autoReady = true;
		this.priority = 0;
		this.field_was_updated = function() {
		};
		this.preventing_continue = function() {
			return false;
		};
		if (node.firstChild) {
			var kid = node.firstChild;
			this.id = node.getAttribute("id");
			while (kid !== null) {
				if (kid.firstChild) {
					this[kid.nodeName] = (kid.firstChild.data == "true") ? true : ((kid.firstChild.data == "false") ? false : (kid.firstChild.data));
				} else if (kid.data) {
					this[kid.nodeName] = (kid.data == "true") ? true : ((kid.data == "false") ? false : (kid.data));
				}
				kid = kid.nextSibling;
			}
		} else {
			this.data.exercise = {
				display : node
			};
		}
		this.loading = function(on) {
			if (on && this.loadingBlock === null) {
				this.loadingBlock = yoodoo.loadingDiv();
				/*var h = $(yoodoo.welcomeContainers.bottomPanel).height() - 20;
				$(this.loadingBlock).css({
					height : h,
					background : 'url(' + yoodoo.option.baseUrl + 'uploads/sitegeneric/image/working.gif) no-repeat center center'
				});*/
				$(this.window).append(this.loadingBlock);
			} else if (!on && this.loadingBlock !== null) {
				$(this.loadingBlock).remove();
				this.loadingBlock = null;
			}
		};
		this.render = function() {
			if (this.container === null)
				this.container = yoodoo.e("div");
			var h = $(yoodoo.welcomeContainers.bottomPanel).height();
			this.window = yoodoo.e("div");
			this.window.widget = this;
			this.container.widget = this;
			/*$(this.window).css({
				height : h - 20
			});*/
			$(this.container).empty().addClass("widgetContainer").css({
				height : h - 10,
				width : h - 10
			}).append(this.window);
			this.loading(true);
			this.readied = false;
			return this.container;
		};
		this.destroy = function() {
			$(this.container).animate({
				width : 0
			}, 500, function() {
				$(this).remove();
			});
		};
		this.receiveData = function(r) {
			this.data = r;
			try {
				eval('this.data.exercise.display=' + this.data.exercise.display.replace(/\n/g, '') + ';');
			} catch (e) {
			}
		};
		this.init = function() {
			if (this.display === null)
				this.display = yoodoo.e("div");
			$(this.display).css({
				opacity : 0
			});
			$(this.window).append(this.display).addClass('scrollStyle').css({
				'overflow-x' : 'hidden',
				'overflow-y' : 'auto'
			});
			$(this.display).animate({
				opacity : 1
			});
			if (this.container !== null && this.container.parentNode !== null)
				this.container.parentNode.update();
			this.readyCallback = function() {
			};
			if (arguments.length > 0)
				this.readyCallback = arguments[0];
			if (this.data.exercise !== undefined && this.data.exercise.display !== undefined && this.data.exercise.display.dependencies !== undefined && this.data.exercise.display.dependencies.length > 0) {
				if (this.data.sitefolder !== undefined) {
					for (var d = 0; d < this.data.exercise.display.dependencies.length; d++) {
						this.data.exercise.display.dependencies[d][2] = this.data.sitefolder;
					}
				}
				var me = this;
				var loader = new yoodoo.fileLoader.loader(this.data.exercise.display.dependencies, function(complete) {
					if (complete) {
						me.ready();
					} else {
						yoodoo.noInternet();
					}
				});
			} else {
				this.ready();
			}
		};
		this.ready = function() {
//console.log(this.data.exercise.display.dependencies,this.title,yoodoo.fileLoader.loaded['http://www.yoodoobiz.info//uploads/sitespecific/ratingoptimiser/file/widgets/js/kloe_widget_2.js']);
			this.loading(false);
			if ( typeof (this.data.exercise.display.ready) == "function")
				this.data.exercise.display.ready(this);
		};
		this.setSize = function(opts) {
			var complete = function() {
			};
			if (opts.complete !== undefined)
				complete = opts.complete;
			var w = $(this.window).width();
			var h = $(this.window).height();
			if (opts.area !== undefined) {
				w = opts.area / h;
			} else if (opts.width !== undefined) {
				w = opts.width;
			} else if (opts.aspect !== undefined) {
				w = opts.aspect * h;
			}
			$(this.container).animate({
				width : w + 10
			}, {
				duration : 500,
				complete : function() {
					if (this.parentNode !== null)
						this.parentNode.update();
					complete(this.widget);
				},
				step : function() {
					if (this.parentNode !== null)
						this.parentNode.update();
				}
			});
		};
		this.showIntervention = function() {
			if (this.intervention !== undefined) {
				if (this.intervention != yoodoo.intervention) {
					yoodoo.bookcase.showIntervention(this.intervention);
				} else {
					yoodoo.bookcase.showIntervention(null);
				}
			}
		};
	},
	level : function(node) {
		this.id = node.getAttribute("id");
		var kid = node.firstChild;
		while (kid !== null) {
			if (kid.firstChild) {
				this[kid.nodeName] = (kid.firstChild.data == "true") ? true : ((kid.firstChild.data == "false") ? false : (kid.firstChild.data));
			} else if (kid.data) {
				this[kid.nodeName] = (kid.data == "true") ? true : ((kid.data == "false") ? false : (kid.data));
			}
			kid = kid.nextSibling;
		}
	},
	quiz : function(node) {
		this.type = 'quiz';
		this.id = node.getAttribute("id");
		var kid = node.firstChild;
		while (kid !== null) {
			if (kid.firstChild) {
				this[kid.nodeName] = (kid.firstChild.data == "true") ? true : ((kid.firstChild.data == "false") ? false : (kid.firstChild.data));
			} else if (kid.data) {
				this[kid.nodeName] = (kid.data == "true") ? true : ((kid.data == "false") ? false : (kid.data));
			}
			kid = kid.nextSibling;
		}
		this.completed = function() {
			alert("Quiz complete");
		};
		this.load = function(node) {
			var k = ['introVoiceoverURL', 'summaryVoiceoverURL', 'summarySuccessVoiceoverURL', 'summaryFailedVoiceoverURL', 'totalQuestions', 'passRate', 'duration'];
			for (var i = 0; i < k.length; i++) {
				this[k[i]] = node.getAttribute(k[i]);
			}
			this.questions = [];
			var kid = node.firstChild;
			while (kid !== null) {
				if (kid.nodeName == "question") {
					this.questions.push(new yoodoo.element.question(kid));
				} else if (kid.firstChild) {
					this[kid.nodeName] = (kid.firstChild.data == "true") ? true : ((kid.firstChild.data == "false") ? false : (kid.firstChild.data));
				} else if (kid.data) {
					this[kid.nodeName] = (kid.data == "true") ? true : ((kid.data == "false") ? false : (kid.data));
				}
				kid = kid.nextSibling;
			}
		};
	},
	question : function(node) {
		var k = ['type', 'difficulty', 'questionId', 'duration', 'responseDuration', 'passRate', 'duration'];
		for (var i = 0; i < k.length; i++) {
			this[k[i]] = node.getAttribute(k[i]);
		}
		this.answers = [];
		this.prompts = [];
		this.responses = {};
		var kid = node.firstChild;
		while (kid !== null) {
			if (kid.getAttribute("voiceoverURL")) {
				this[kid.nodeName + "VoiceoverURL"] = kid.getAttribute("voiceoverURL");
			}
			if (kid.nodeName == "answers") {
				var ans = kid.firstChild;
				while (ans !== null) {
					this.answers.push(new yoodoo.element.answer(ans));
					ans = ans.nextSibling;
				}
			} else if (kid.nodeName == "prompts") {
				var pro = kid.firstChild;
				while (pro !== null) {
					this.prompts.push(new yoodoo.element.prompt(pro));
					pro = pro.nextSibling;
				}
			} else if (kid.nodeName == "responses") {
				var res = kid.firstChild;
				while (res !== null) {
					if (res.getAttribute("voiceoverURL")) {
						this.responses[res.nodeName + "VoiceoverURL"] = res.getAttribute("voiceoverURL");
					}
					if (res.firstChild) {
						this.responses[res.nodeName] = (res.firstChild.data == "true") ? true : ((res.firstChild.data == "false") ? false : (res.firstChild.data));
					} else if (res.data) {
						this.responses[res.nodeName] = (res.data == "true") ? true : ((res.data == "false") ? false : (res.data));
					}
					res = res.nextSibling;
				}
			} else if (kid.firstChild) {
				this[kid.nodeName] = (kid.firstChild.data == "true") ? true : ((kid.firstChild.data == "false") ? false : (kid.firstChild.data));
			} else if (kid.data) {
				this[kid.nodeName] = (kid.data == "true") ? true : ((kid.data == "false") ? false : (kid.data));
			}
			kid = kid.nextSibling;
		}
	},
	answer : function(node) {
		var k = ['voiceoverURL', 'responseVoiceoverURL', 'answerId', 'promptId', 'correct'];
		for (var i = 0; i < k.length; i++) {
			var val = node.getAttribute(k[i]);
			if (val !== null)
				this[k[i]] = (val == "true") ? true : ((val == "false") ? false : val);
		}
		if (node.firstChild) {
			this[node.nodeName] = (node.firstChild.data == "true") ? true : ((node.firstChild.data == "false") ? false : (node.firstChild.data));
		} else if (node.data) {
			this[node.nodeName] = (node.data == "true") ? true : ((node.data == "false") ? false : (node.data));
		}
	},
	prompt : function(kid) {
		var k = ['answerId', 'promptId'];
		for (var i = 0; i < k.length; i++) {
			var val = kid.getAttribute(k[i]);
			if (val !== null)
				this[k[i]] = (val == "true") ? true : ((val == "false") ? false : val);
		}
		var res = kid.firstChild;
		while (res !== null) {
			if (res.getAttribute("voiceoverURL")) {
				this[res.nodeName + "VoiceoverURL"] = res.getAttribute("voiceoverURL");
			}
			if (res.firstChild) {
				this[res.nodeName] = (res.firstChild.data == "true") ? true : ((res.firstChild.data == "false") ? false : (res.firstChild.data));
			} else if (res.data) {
				this[res.nodeName] = (res.data == "true") ? true : ((res.data == "false") ? false : (res.data));
			}
			res = res.nextSibling;
		}
	},
	chapter : function(node) {
		this.keypoints = [];
		this.type = 'chapter';
		this.id = node.getAttribute("id");
		var kid = node.firstChild;
		while (kid !== null) {
			if (kid.nodeName == "keyPoints") {
				var kp = kid.firstChild;
				while (kp !== null) {
					var k = new yoodoo.element.keypoint(kp);
					this.keypoints.push(k);
					kp = kp.nextSibling;
				}
			} else if (kid.nodeName == "videoTypes") {
				this.videoTypes = {};
				var kp = kid.firstChild;
				while (kp !== null) {
					if (kp.firstChild) {
						this.videoTypes[kp.nodeName] = kp.firstChild.data;
					} else if (kid.data) {
						this.videoTypes[kp.nodeName] = kp.data;
					}
					kp = kp.nextSibling;
				}
			} else if (kid.firstChild) {
				this[kid.nodeName] = (kid.firstChild.data == "true") ? true : ((kid.firstChild.data == "false") ? false : (kid.firstChild.data));
			} else if (kid.data) {
				this[kid.nodeName] = (kid.data == "true") ? true : ((kid.data == "false") ? false : (kid.data));
			}
			kid = kid.nextSibling;
		}
		this.video = function(type) {
			if (yoodoo.option.forceHTMLVideo)
				return yoodooPlaya.videoTypeConvert(this.videoUrl);
			if ( typeof (this.videoTypes) == "object") {
				if (this.videoTypes[type])
					return this.videoTypes[type];
			}
			return false;
		};
	},
	keypoint : function(node) {
		this.columns = [];
		this.id = node.getAttribute("id");
		this.start = yoodoo.timecode(node.getAttribute("startTimecode"));
		this.end = yoodoo.timecode(node.getAttribute("endTimecode"));
		var kid = node.firstChild;
		while (kid !== null) {
			if (kid.nodeName == "columns") {
				var kp = kid.firstChild;
				while (kp !== null) {
					var c = new yoodoo.element.column(kp);
					this.columns.push(c);
					kp = kp.nextSibling;
				}
			} else if (kid.firstChild) {
				this[kid.nodeName] = (kid.firstChild.data == "true") ? true : ((kid.firstChild.data == "false") ? false : (kid.firstChild.data));
			} else if (kid.data) {
				this[kid.nodeName] = (kid.data == "true") ? true : ((kid.data == "false") ? false : (kid.data));
			}
			kid = kid.nextSibling;
		}
		this.html = function() {
			var ins = '';
			ins += "<div style='overflow:hidden;white-space:nowrap'>";
			ins += "<div class='keypoint_goto'>&nbsp;";
			ins += "</div>";
			ins += "<div class='keypoint_opener'>" + this.title + "</div>";
			ins += "</div>";
			return ins;
		};
		this.open = function() {
			yoodooPlaya.movie.playHead.pause();
			yoodooPlaya.displayKeypoint(this);
		};
	},
	column : function(node) {
		this.type = node.getAttribute("type");
		var kid = node.firstChild;
		while (kid !== null) {
			if (kid.firstChild) {
				this[kid.nodeName] = (kid.firstChild.data == "true") ? true : ((kid.firstChild.data == "false") ? false : (kid.firstChild.data));
			} else if (kid.data) {
				this[kid.nodeName] = (kid.data == "true") ? true : ((kid.data == "false") ? false : (kid.data));
			}
			kid = kid.nextSibling;
		}
		this.html = function() {
			var col = yoodoo.e("div");
			var img = null;
			if (this.text !== undefined && this.type != "image")
				col.innerHTML = (this.text === '') ? "<p> </p>" : this.text;
			if (this.imageUrl !== undefined && /\.[^\.]+$/.test(this.imageUrl) && !(/^http.*uploads$/.test(this.imageUrl))) {
				img = yoodoo.e("img");
				img.src = this.imageUrl;
				$(img).bind("load", function() {
					var mw = $(this.parentNode).width();
					if ($(this).width() > mw)
						$(this).css({
							width : mw
						});
				}).css({
					margin : '5px auto',
					display : "block"
				});
			}
			if (this.type != "text" && img !== null) {
				if (this.type == "image") {
					col.appendChild(img);
				} else if (this.type == "image-text") {
					col.insertBefore(img, col.childeNodes[0]);
				} else if (this.type == "text-image") {
					col.appendChild(img);
				}
			}
			var colScroll = yoodoo.e("div");
			colScroll.appendChild(col);
			$(colScroll).addClass("colScroll");
			var colContainer = yoodoo.e("div");
			colContainer.appendChild(colScroll);
			return colContainer;
		};
	},
	tag : function(node) {
		var kid = node.firstChild;
		this.id = node.getAttribute("id");
		while (kid !== null) {
			if (kid.firstChild) {
				this[kid.nodeName] = (kid.firstChild.data == "true") ? true : ((kid.firstChild.data == "false") ? false : (kid.firstChild.data));
			} else if (kid.data) {
				this[kid.nodeName] = (kid.data == "true") ? true : ((kid.data == "false") ? false : (kid.data));
			}
			kid = kid.nextSibling;
		}
	},
	progress : function(node) {
		var p = yoodoo.nodeKids(node);
		for (var k in p) {
			this[k] = p[k];
		}
	}
};