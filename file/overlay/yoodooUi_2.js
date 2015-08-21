yoodoo.ui = {
	built : [],
	ruleKeys : {},
	counter : 0,
	update : function() {
		for (var i = this.built.length - 1; i >= 0; i--) {
			if (this.built[i].update() === false)
				this.built.splice(i, 1);
			
			if($('.yoodooUI.yoodooUI_multiplechoiceButton').hasClass('multiCol')){
				var multiplechoiceButtonHeight=$('.yoodooUI.yoodooUI_multiplechoiceButton button').width();
				$('.yoodooUI.yoodooUI_multiplechoiceButton').height(/*multiplechoiceButtonHeight*/);
				$('.yoodooUI.yoodooUI_multiplechoiceButton button').height(/*multiplechoiceButtonHeight*/200);
			}
		}
		$('.verticalAlign').each(function(i,e) {
			if (!$(e).prev().hasClass('verticalAlign')) {
				if ($(e).siblings(".verticalAlign").get().length>0) {
					var h=$(e).outerHeight(true);
					$(e).siblings(".verticalAlign").each(function(i,e) {
						h+=$(e).outerHeight(true);
					});
					h=$(e).parent().height()-h;
					$(e).css({'margin-top':Math.round(h/2)});
				}else{
					var h=$(e).outerHeight(true);
					h=$(e).parent().height()-h;
					$(e).css({position:'relative','top':Math.round(h/2)});
				}
				//var h=$(e).parent().height();
			}
		});
	},
	standard : function(obj, args) {
		args.ui=obj;
		obj.container = yoodoo.e("div");
		$(obj.container).addClass('yoodooUI').addClass('yoodooUI_' + obj.settings.type);
		for (var k in args) {
			if (obj.settings[k] !== undefined)
				obj.settings[k].value = args[k];
		}
		obj.update = function() {
			if (this.container.parentNode === null)
				return false;
			if ( typeof (obj.updated) == 'function')
				obj.updated();
		};
		obj.processOnPageChange = function() {
			this.processRules('pagechange');
		};
		obj.processOnChange = function() {
			this.processRules('onchange');
		};
		obj.processOnBlur = function() {
			this.processRules('onblur');
		};

		obj.id = 'yoodooUi' + this.counter++;
		this.built.push(obj);

		// build tag rules
		/*obj.tagRules = [];
		 if (args.tagRules !== undefined) {
		 for (var r in args.tagRules) {
		 if (yoodoo.ui.tagrules[obj.settings.type] !== undefined && yoodoo.ui.tagrules[obj.settings.type][args.tagRules[r].type] !== undefined) {
		 obj.tagRules.push(new yoodoo.ui.tagrules[obj.settings.type][args.tagRules[r].type](obj, args.tagRules[r]));
		 }
		 }
		 }*/
		/*obj.processTags = function() {
		 for (var i in obj.tagRules) {
		 obj.tagRules[i].process();
		 //      console.log(i);
		 }
		 };*/
		obj.rules = [];
		if (args.rules !== undefined) {
			//console.log(args.rules);
			// console.log(yoodoo.ui.rules[obj.settings.type]);
			for (var r in args.rules) {
				//console.log(args.rules);
				//console.log(args.rules[r]);
				//console.log(yoodoo.ui.rules[obj.settings.type]);
				if (yoodoo.ui.rules[obj.settings.type] !== undefined && yoodoo.ui.rules[obj.settings.type][args.rules[r].type] !== undefined) {
					var rule = new yoodoo.ui.rules[obj.settings.type][args.rules[r].type](obj, args.rules[r]);
					yoodoo.ui.ruleKeys[r] = rule;
					obj.rules.push(rule);
				}
			}
		}
		obj.processRules = function(event) {
			for (var i in obj.rules) {
				var on = false;
				if (obj.rules[i].event.type == event && obj.rules[i].event.uitypes === null) {

					on = obj.rules[i].check();
					if (on && obj.rules[i].stopOnTrue) break;
				} else if (obj.rules[i].event.type == event && obj.rules[i].event.uitypes !== null && obj.rules[i].event.uitypes instanceof Array) {
					for (var x in obj.rules[i].event.uitypes) {
						if (this.settings.type === obj.rules[i].event.uitypes[x]) {
							on = obj.rules[i].check();
							if (on && obj.rules[i].stopOnTrue) break;
						} else {
							on = false;
							break;
						}

					}
				}
			}
		};
		obj.render = function() {

			var op = (this.processRender !== undefined) ? this.processRender.apply(obj, arguments) : null;
			this.processRules('render');
			return op;
		};
	},
	html : function(args) {
	   this.settings = {
	      type : 'html',
	      label : {
	         title : 'The html to show',
	         type : 'text',
	         value : 'Label'
	      },
	      className : {
	           title : 'CSS classes to add to the dialogue box',
           type : 'text',
	           value : ''
	      }
	   };
	   yoodoo.ui.standard(this, args);
	   this.value = null;
	   this.processRender = function() {
	      $(this.container).append(( typeof (this.settings.label.value) == "function") ? this.settings.label.value.apply(this, []) : this.settings.label.value).addClass(this.settings.className.value);
	      return $(this.container);
	   };
	},
	text : function(args) {
		this.settings = {
			type : 'text',
			label : {
				title : 'Label',
				type : 'text',
				value : 'Label'
			},
			fontSize : {
				title : 'Font size in pixels',
				type : 'numeric',
				value : null
			},
			lineHeight : {
				title : 'Line height in pixels',
				type : 'numeric',
				value : null
			},
			spellcheck : {
				title : 'Allow spell check',
				type : 'boolean',
				value : true
			},
			emptyCombine : {
				title : 'Show label in box when empty',
				type : 'boolean',
				value : true
			},
			emptyText : {
				title : 'Text to show in the input field when empty but not combining with the label',
				type : 'text',
				value : ''
			},
			defaultValue : {
				title : 'If the value is empty, use this instead.',
				type : 'text',
				value : ''
			},
			maxlength : {
				title : 'Maximum length',
				type : 'numeric',
				value : 255
			},
			required : {
				title : 'The container element receives the "stillRequired" class if the value is empty',
				type : 'boolean',
				value : false
			},
			validator : {
				title : 'Key down validator',
				type : 'validator',
				value : null
			},
			onchange : {
				title : 'Callback function on change',
				type : 'function',
				value : function(e) {
				}
			},
			onenter : {
				title : 'Callback function when enter is pressed',
				type : 'function',
				value : function(e) {
				}
			}
		};
		yoodoo.ui.standard(this, args);
		this.value = null;
		this.processRender = function(value) {
			this.value = value;
			if (typeof(this.settings.defaultValue.value)=="string" && this.value=='') this.value = value = this.settings.defaultValue.value;
			var me = this;
			this.label = yoodoo.e("label");
			$(this.label).html(this.settings.label.value + ((this.settings.required.value === true && this.settings.emptyCombine.value !== true) ? '<span>*<span>' : ''));
			this.error = yoodoo.e("div");
			$(this.error).addClass('yoodooUIerrorMessage');
			this.input = yoodoo.e("input");
			this.input.maxLength = this.settings.maxlength.value;
			$(this.input).attr("placeholder", (this.settings.emptyCombine.value === true) ? this.settings.label.value : this.settings.emptyText.value);
			if (this.settings.fontSize.value !== null)
				$(this.input).css({
					'font-size' : this.settings.fontSize.value + 'px'
				});
			if (this.settings.lineHeight.value !== null)
				$(this.input).css({
					'line-height' : this.settings.lineHeight.value + 'px'
				});
			if (this.settings.spellcheck === false)
				$(this.input).attr('spellcheck', 'false');
			var validator = this.settings.validator.value;

			if(validator!== null && validator!==undefined && validator.type=='numeric'){
				$(this.input).attr({
					'type':'number',
					'inputmode':'numeric',
					'pattern':'[0-9]*',
					'min':validator.minimum,
					'max':validator.maximum
				});
			}else if(validator!== null && validator!==undefined && validator.type=='decimal'){
				$(this.input).attr({
					'type':'number',
					'inputmode':'numeric',
					'step':'0.01',
					'min':validator.minimum,
					'max':validator.maximum
				});
			}else{
				$(this.input).attr("type", "text");	
			}
			$(this.input).bind('keypress', function(e) {
				if (validator !== null && validator.pressed(e) === false)
					e.preventDefault();
				var kc = yoodoo.keyCode(e);
				if (kc.enter)
					me.settings.onenter.value.apply(me, [e]);
			}).bind('keyup paste', function(e) {
				me.value = this.value;
				me.processChange();
				me.processOnChange();
				me.settings.onchange.value.apply(me, [e]);
			}).blur(function() {
				me.processOnBlur();
			}).val(value);
			$(this.container).append(this.error).append(this.label).append(this.input);
			this.processChange();
			return $(this.container);
		};
		this.processChange = function() {
			if (this.settings.emptyCombine.value === true)
				$(this.label).css({
					visibility : (this.input.value == '') ? 'hidden' : 'visible'
				});
			this.stillRequired = ((this.input.value == '') && (this.settings.required.value === true));
			var valid = true;
			if (this.stillRequired === false && this.settings.validator.value !== null)
				valid = this.settings.validator.value.valid(this.input);
			if (valid !== true)
				this.stillRequired = true;
			if (this.stillRequired === true) {
				$(this.container).addClass("stillRequired");
			} else {
				$(this.container).removeClass("stillRequired");
			}
			if (valid === true || valid === null) {
				$(this.error).removeClass("yoodooUIerror");
			} else {
				$(this.error).html(valid).addClass("yoodooUIerror");
			}
			//this.processOnChange();
			//this.processTags();
		};
		this.updated = function(params) {
			if ( typeof (params) == 'object') {
				for (var k in params) {
					if (this.settings[k] !== undefined)
						this.settings[k].value = params[k];
				}
			}
			$(this.label).html(this.settings.label.value + ((this.settings.required.value === true && this.settings.emptyCombine.value !== true) ? '<span>*<span>' : ''));
			$(this.input).attr("placeholder", (this.settings.emptyCombine.value === true) ? this.settings.label.value : this.settings.emptyText.value);
			this.processChange();
		};
	},
	password : function(args) {
		this.settings = {
			type : 'password',
			label : {
				title : 'Label',
				type : 'text',
				value : 'Label'
			},
			fontSize : {
				title : 'Font size in pixels',
				type : 'numeric',
				value : null
			},
			lineHeight : {
				title : 'Line height in pixels',
				type : 'numeric',
				value : null
			},
			emptyCombine : {
				title : 'Show label in box when empty',
				type : 'boolean',
				value : true
			},
			emptyText : {
				title : 'Text to show in the input field when empty but not combining with the label',
				type : 'text',
				value : ''
			},
			maxlength : {
				title : 'Maximum length',
				type : 'numeric',
				value : 255
			},
			required : {
				title : 'The container element receives the "stillRequired" class if the value is empty',
				type : 'boolean',
				value : false
			},
			validator : {
				title : 'Key down validator',
				type : 'validator',
				value : null
			},
			onchange : {
				title : 'Callback function on change',
				type : 'function',
				value : function(e, o) {
				}
			},
			onenter : {
				title : 'Callback function when enter is pressed',
				type : 'function',
				value : function(e) {
				}
			}
		};
		this.value = null;
		yoodoo.ui.standard(this, args);
		this.processRender = function(value) {
			this.value = value;
			var me = this;
			this.label = yoodoo.e("label");
			$(this.label).html(this.settings.label.value + ((this.settings.required.value === true && this.settings.emptyCombine.value !== true) ? '<span>*<span>' : ''));
			this.error = yoodoo.e("div");
			$(this.error).addClass('yoodooUIerrorMessage');
			this.input = yoodoo.e("input");
			this.input.maxLength = this.settings.maxlength.value;
			$(this.input).attr("placeholder", (this.settings.emptyCombine.value === true) ? this.settings.label.value : this.settings.emptyText.value);
			if (this.settings.fontSize.value !== null)
				$(this.input).css({
					'font-size' : this.settings.fontSize.value + 'px'
				});
			if (this.settings.lineHeight.value !== null)
				$(this.input).css({
					'line-height' : this.settings.lineHeight.value + 'px'
				});
			var validator = this.settings.validator.value;

			this.input.changeFunction = this.settings.onchange.value;
			this.input.enterFunction = this.settings.onenter.value;
			$(this.input).attr("type", "password").bind('keypress', function(e) {
				if (validator !== null && validator.pressed(e) === false)
					e.preventDefault();
				var kc = yoodoo.keyCode(e);
				if (kc.enter)
					me.settings.onenter.value.apply(me, [e]);
				me.processChange();
				me.processOnChange();
			}).bind('change keyup', function(e) {
				me.value = this.value;
				me.processChange();
				me.settings.onchange.value.apply(me, [e]);
			}).val(value);
			$(this.container).append(this.error).append(this.label).append(this.input);
			this.processChange();
			return $(this.container);
		};
		this.processChange = function() {
			if (this.settings.emptyCombine.value === true)
				$(this.label).css({
					visibility : (this.input.value == '') ? 'hidden' : 'visible'
				});
			this.stillRequired = ((this.input.value == '') && (this.settings.required.value === true));
			var valid = true;
			if (this.stillRequired === false && this.settings.validator.value !== null)
				valid = this.settings.validator.value.valid(this.input);
			if (valid !== true)
				this.stillRequired = true;
			if (this.stillRequired === true) {
				$(this.container).addClass("stillRequired");
			} else {
				$(this.container).removeClass("stillRequired");
			}
			if (valid === true || valid === null) {
				$(this.error).removeClass("yoodooUIerror");
			} else {
				$(this.error).html(valid).addClass("yoodooUIerror");
			}
		};
		this.updated = function(params) {
			if ( typeof (params) == 'object') {
				for (var k in params) {
					if (this.settings[k] !== undefined)
						this.settings[k].value = params[k];
				}
			}
			$(this.label).html(this.settings.label.value + ((this.settings.required.value === true && this.settings.emptyCombine.value !== true) ? '<span>*<span>' : ''));
			$(this.input).attr("placeholder", (this.settings.emptyCombine.value === true) ? this.settings.label.value : this.settings.emptyText.value);
			this.processChange();
		};
	},
	textarea : function(args) {
		this.settings = {
			type : 'textarea',
			label : {
				title : 'Label',
				type : 'text',
				value : 'Label'
			},
			emptyCombine : {
				title : 'Show label in box when empty',
				type : 'boolean',
				value : true
			},
			emptyText : {
				title : 'Text to show in the input field when empty but not combining with the label',
				type : 'text',
				value : ''
			},
			defaultValue : {
				title : 'If the value is empty, use this instead.',
				type : 'text',
				value : ''
			},
			maxlength : {
				title : 'Maximum length',
				type : 'numeric',
				value : 255
			},
			rows : {
				title : 'Number of rows to display',
				type : 'numeric',
				value : null
			},
			required : {
				title : 'The container element receives the "stillRequired" class if the value is empty',
				type : 'boolean',
				value : false
			},
			disabled : {
				title : 'The input is disabled',
				type : 'boolean',
				value : false
			},
			validator : {
				title : 'Key down validator',
				type : 'validator',
				value : null
			},
			lineHeight : {
				title : 'Line height',
				type : 'numeric',
				value : 20
			},
			fontSize : {
				title : 'Font size',
				type : 'numeric',
				value : 14
			},
			onchange : {
				title : 'Callback function on change',
				type : 'function',
				value : function(e, o) {
				}
			}
		};
		this.value = null;
		yoodoo.ui.standard(this, args);
		this.processRender = function(value) {
			this.value = value;
			if (typeof(this.settings.defaultValue.value)=="string" && this.value=='') this.value = value = this.settings.defaultValue.value;
			var me = this;
			me.sel = {
				start : 0,
				end : 0
			};
			this.testdiv = yoodoo.e("div");
			var hidden = yoodoo.e("div");
			$(hidden).css({
				width : 0,
				height : 0,
				overflow : 'hidden'
			}).append($(this.testdiv).css({

			}).addClass('yoodooUItextarea_tester'));
			if (this.settings.rows.value>0) hidden=null;
			this.label = yoodoo.e("label");
			$(this.label).html(this.settings.label.value + ((this.settings.required.value === true && this.settings.emptyCombine.value !== true) ? '<span>*<span>' : ''));
			this.error = yoodoo.e("div");
			$(this.error).addClass('yoodooUIerrorMessage');
			this.input = yoodoo.e("textarea");
			if (this.settings.disabled.value===true) this.input.disabled=true;
			if (this.settings.rows.value!==null && this.settings.rows.value>0) this.input.rows=this.settings.rows.value;
			this.inputSurround = yoodoo.e('div');
			$(this.inputSurround).addClass((this.settings.rows.value>0)?'fixedTextareaSurround':'textareaSurround');
			if (this.settings.maxlength.value > 0)
				this.input.maxLength = this.settings.maxlength.value;
			$(this.input).attr("placeholder", (this.settings.emptyCombine.value === true) ? this.settings.label.value : this.settings.emptyText.value);
			var validator = this.settings.validator.value;
			$(this.input).bind('keydown', function(e) {
				if (validator !== null && validator.pressed(e) === false)
					e.preventDefault();
				var kc = yoodoo.keyCode(e);
				if (kc.enter) {
					me.checksize(true, 1);
				}
			}).bind('change keyup', function(e) {
				var kc = yoodoo.keyCode(e);
				me.checksize(true);
				me.value = this.value;
				me.processChange(true);
				me.processOnChange();
				me.settings.onchange.value.apply(me, [e]);
			}).val(value);
			
			if (this.settings.rows.value>0) {
				var blurHeight=this.settings.lineHeight.value;
				var focusHeight=this.settings.lineHeight.value*this.settings.rows.value;
				$(this.inputSurround).css({height:blurHeight});
				$(this.input).css({
					fontSize:this.settings.fontSize.value+'px',
					lineHeight:this.settings.lineHeight.value+'px',
					height:blurHeight
				}).bind('blur',function() {
					this.cacheScrollTop=this.scrollTop;
					$(this).animate({scrollTop:0,height:blurHeight},500,function() {
						$(this).css({'z-index':'inherit'});
					});
				}).bind('focus',function() {
					if (!isNaN(this.cacheScrollTop)) {
						$(this).css({'z-index':999}).animate({scrollTop:this.cacheScrollTop,height:focusHeight},500);
					}else{
						$(this).css({'z-index':999}).animate({height:focusHeight},500);
					}
				})
				
				
			}
			
			
			$(this.container).append(hidden).append(this.error).append(this.label).append($(this.inputSurround).append(this.input));
			if (!(this.settings.rows.value>0)) $(this.inputSurround).append($(yoodoo.e("div")).addClass('textareaBorder'));
			this.processChange(false);
			me.checksize(false);
			return $(this.container);
		};
		this.processChange = function(withAnimation) {
			//this.checksize(withAnimation);
			if (this.settings.emptyCombine.value === true)
				$(this.label).css({
					visibility : (this.input.value == '') ? 'hidden' : 'visible'
				});
			this.stillRequired = ((this.input.value == '') && (this.settings.required.value === true));
			var valid = true;
			if (this.stillRequired === false && this.settings.validator.value !== null)
				valid = this.settings.validator.value.valid(this.input);
			if (valid !== true)
				this.stillRequired = true;
			if (this.stillRequired === true) {
				$(this.container).addClass("stillRequired");
			} else {
				$(this.container).removeClass("stillRequired");
			}
			if (valid === true || valid === null) {
				$(this.error).removeClass("yoodooUIerror");
			} else {
				$(this.error).html(valid).addClass("yoodooUIerror");
			}
		};
		this.checksize = function(withAnimation, plusRows) {
			if (this.settings.rows.value>0) return false;
			var plus = '';
			if (plusRows > 0) {
				for (var r = 0; r < plusRows; r++) {
					plus += '<br />&nbsp;';
				}
			}

			$(this.testdiv).html(this.input.value.replace(/^\n$/g, '&nbsp;<br />&nbsp;').replace(/^\n/g, '&nbsp;<br />').replace(/\n$/g, '<br />&nbsp;').replace(/\n/g, '<br />').replace(/^$/, '&nbsp;') + plus).css({
				width : $(this.input).width()
			});
			var h = $(this.testdiv).height() + 20;
			var change = true;
			if (this.height === undefined) {
				this.height = h;
				withAnimation = false;
			} else {
				if (this.height == h)
					change = false;
				this.height = h;
			}
			if (change) {
				var me = this;
				if (withAnimation) {
					$(this.inputSurround).animate({
						height : h
					}, 300);
				} else {
					$(this.inputSurround).css({
						height : h
					});
				}
				$(this.input).css({
					height : h
				});
			}
		};
		this.updated = function(params) {
			if ( typeof (params) == 'object') {
				for (var k in params) {
					if (this.settings[k] !== undefined)
						this.settings[k].value = params[k];
				}
			}
			this.checksize(false);
			$(this.label).html(this.settings.label.value + ((this.settings.required.value === true && this.settings.emptyCombine.value !== true) ? '<span>*<span>' : ''));
			$(this.input).attr("placeholder", (this.settings.emptyCombine.value === true) ? this.settings.label.value : this.settings.emptyText.value);
			this.processChange();
		};
	},
	selectbox : function(args) {
		this.settings = {
			type : 'selectbox',
			label : {
				title : 'Label',
				type : 'text',
				value : 'Label'
			},
			required : {
				title : 'The container element receives the "stillRequired" class if the value is empty',
				type : 'boolean',
				value : false
			},
			defaultText : {
				title : 'Default text before an option is selected',
				type : 'text',
				value : "Select..."
			},
			disabled : {
				title : 'disables this option',
				type : 'boolean',
				value : false
			},
			multiple : {
				title : 'allows to select more than one option',
				type : 'boolean',
				value : false
			},
			randomAnswers : {
				title : 'Options will be randomized',
				type : 'boolean',
				value : false
			},
			value : {
				title : 'The value returned when selected',
				type : 'text',
				value : 'undefined'
			},
			onchange : {
				title : 'Callback function on change',
				type : 'function',
				value : function(e) {
				}
			}
		};
		yoodoo.ui.standard(this, args);
		this.value = null;
		this.processRender = function(value) {
			if (value == '')
				value = [''];
			this.value = value;
			if (!( value instanceof Array))
				this.value = [this.value];
			this.label = yoodoo.e("label");
			$(this.label).html(this.settings.label.value);
			this.input = yoodoo.e("select");
			if (this.settings.multiple.value)
				this.input.multiple = true;
			if (this.settings.disabled.value)
				this.input.disabled = true;
			this.input = $(this.input);
			var unselected = yoodoo.e("option");
			unselected.value = '';
			if(typeof this.settings.defaultText.value=="function")this.settings.defaultText.value=this.settings.defaultText.value();
			unselected.text = this.settings.defaultText.value;
			unselected.selected = true;
			unselected.disabled = true;
			$(unselected).hide();
			$(this.container).append(this.label).append(this.input);
			if (this.settings.randomAnswers.value === true) {
				this.options = this.shuffle(this.options);
				this.optionGroups = this.shuffle(this.optionGroups);
			}
			this.optionGroups.forEach( function(optionValue) {
				this.input.append(optionValue.render(this.value));
			}.bind(this));
			var found=false;
			this.options.forEach( function(optionValue) {
				if (optionValue.isValue(this.value)) found=true;
				this.input.append(optionValue.render(this.value));
			}.bind(this));
			var me = this;
			this.input.bind("change", function(e) {
				me.value = this.value;
				me.processOnChange();
				me.settings.onchange.value.apply(me, e);
				if (me.settings.required.value === true && (me.value==undefined || me.value=='')) {
					$(me.container).addClass("stillRequired");
				} else {
					$(me.container).removeClass("stillRequired");
				}
			});
			if (this.settings.required.value === true && (this.value==undefined || this.value=='')) {
				$(this.container).addClass("stillRequired");
			} else {
				$(this.container).removeClass("stillRequired");
			}
			if (this.value.length == 0 || this.value[0]==undefined || found===false) $(this.input).prepend(unselected);
			return $(this.container);
		};
		this.options = [];
		this.optionGroups = [];
		this.add = function(args) {
			var me = this;
			if ( args instanceof Array) {
				for (var i in args) {
					var op = new yoodoo.ui.selectOption(( typeof (args[i]) == 'string') ? {
						label : args[i]
					} : args[i]);
					this.options.push(op);
				}
				return this.options;
			} else if ( typeof (args) === 'object') {
				var op = new yoodoo.ui.selectOption({
					label : (args.title === undefined) ? args.label : args.title,
					value : args.value,
					disabled : (args.disabled !== undefined) ?  args.disabled : this.settings.disabled.value
				});
				this.options.push(op);
				return op;
			} else {
				args.onchange = this.settings.onchange.value;
				var op = new yoodoo.ui.selectOption(args);
				if (args.value == "" || args.value === undefined)
					args.value = args.label;
				this.options.push(op);
				return op;
			}

		};
		this.addGroup = function(args) {
			if (args.options !== undefined) {
				var op = new yoodoo.ui.selectOptionGroup({
					label : args.title
				});
				op.add(args.options);
				this.optionGroups.push(op);

				return this.options;
			} else {
				args.onchange = this.settings.onchange.value;
				var op = new yoodoo.ui.selectOptionGroup(args);
				this.optionGroups.push(op);
				return op;
			}
		};
		this.shuffle = function(v) {
			for (var j, x, i = v.length; i; j = parseInt(Math.random() * i), x = v[--i], v[i] = v[j], v[j] = x);
			return v;
		};
		this.updated = function(params) {
			if ( typeof (params) == 'object') {
				for (var k in params) {
					if (this.settings[k] !== undefined)
						this.settings[k].value = params[k];
				}
			}
			$(this.label).html(this.settings.label.value);
		};
	},
	selectOptionGroup : function(args) {
		this.settings = {
			type : 'selectbox',
			label : {
				title : 'Label',
				type : 'text',
				value : 'Label'
			},
			disabled : {
				title : 'disables this option',
				type : 'boolean',
				value : false
			},
			randomAnswers : {
				title : 'Options will be randomized',
				type : 'boolean',
				value : false,
			},
			onchange : {
				title : 'Callback function on change',
				type : 'function',
				value : function(e) {
				}
			}
		};
		yoodoo.ui.standard(this, args);
		this.processRender = function(value) {
			var op = $(yoodoo.e("optgroup")).attr("label", this.settings.label.value).prop("disabled", this.settings.disabled.value);
			if (this.settings.randomAnswers.value === true)
				this.options = this.shuffle(this.options);
			this.options.forEach( function(optionValue) {
				op.append(optionValue.render(value));
			}.bind(this));
			return op;
		};
		this.options = [];
		this.add = function(args) {
			if ( args instanceof Array) {
				for (var i in args) {
					var op = new yoodoo.ui.selectOption(( typeof (args[i]) == 'string') ? {
						label : args[i]
					} : args[i]);
					this.options.push(op);
				}
				return this.options;
			}
			args.onchange = this.settings.onchange.value;
			if (this.settings.disabled.value)
				args.disabled = this.settings.disabled.value;
			var op = new yoodoo.ui.selectOption(args);
			//if(args.value=="" || args.value=== undefined )args.value=args.label;
			this.options.push(op);
			return op;
		};
		this.shuffle = function(v) {
			for (var j, x, i = v.length; i; j = parseInt(Math.random() * i), x = v[--i], v[i] = v[j], v[j] = x);
			return v;
		};
	},
	selectOption : function(args) {
		this.settings = {
			type : 'selectbox',
			label : {
				title : 'Label',
				type : 'text',
				value : 'Label'
			},
			disabled : {
				title : 'disables this option',
				type : 'boolean',
				value : false
			},
			value : {
				title : 'Value of this option, if left undefined, the label will become the value',
				type : 'text',
				value : ""
			},
			onchange : {
				title : 'Callback function on change',
				type : 'function',
				value : function(e) {
				}
			}
		};
		if (args.label === undefined && args.value !== undefined)
			args.label = args.value;
		if (args.value === undefined && args.label !== undefined)
			args.value = args.label;
		yoodoo.ui.standard(this, args);
		this.isValue=function(value) {
			return (value.indexOf(this.settings.value.value) >= 0);
		};
		this.processRender = function(value) {
			var me = this;
			this.element = yoodoo.e("option");
			this.element.selected = this.isValue(value);
			this.element.value = this.settings.value.value;
			this.element.text = this.settings.label.value;
			this.element.disabled = this.settings.disabled.value;
			return this.element;
		};
	},
	slider : function(args) {
		this.settings = {
			type : 'slider',
			label : {
				title : 'Label',
				type : 'text',
				value : 'Label'
			},
			minimum : {
				title : 'Minimum value',
				type : 'integer',
				value : 0
			},
			maximum : {
				title : 'Maximum value',
				type : 'integer',
				value : 10
			},
			step : {
				title : 'Selectable divisions',
				type : 'integer',
				value : 1
			},
			minimumlabel : {
				title : 'Minimum label',
				type : 'text',
				value : ''
			},
			maximumlabel : {
				title : 'Maximum label',
				type : 'text',
				value : ''
			},
			metaAdditionalLabel : {
				title : 'Use the calculated label for the meta value',
				type : 'boolean',
				value : true
			},
			showAdditionalLabel : {
				title : 'Display the calculated label',
				type : 'boolean',
				value : true
			},
			additionalLabel : {
				title : 'Additional Label',
				type : 'array',
				user_meta_key : 'additional_label',
				value : []
			},
			showvalues : {
				title : 'Display the values',
				type : 'boolean',
				value : false
			},
			showendvalues : {
				title : 'Display the end values only',
				type : 'boolean',
				value : true
			},
			textinput : {
				title : 'Include a text input field',
				type : 'boolean',
				value : false
			},
			onchange : {
				title : 'Callback function on change',
				type : 'function',
				value : function(e, o, v) {
				}
			}
		};
		yoodoo.ui.standard(this, args);
		this.value = null;
		this.validatedLabel = null;
		this.processRender = function(value) {
			var me = this;
			this.label = yoodoo.e("label");
			$(this.label).html(this.settings.label.value);
			this.slider = yoodoo.e("div");
			this.hotspot = yoodoo.e("div");
			this.bar = yoodoo.e("div");
			this.labels = yoodoo.e("div");
			this.range = yoodoo.e("div");
			this.button = yoodoo.e("div");
			this.validateValue();
			if (this.settings.showAdditionalLabel.value) {
				this.additionalLabelContainer = $(yoodoo.e("div"));
				this.additionalLabel = $(yoodoo.e("label")).css({
					margin : '0px auto'
				}).html((this.validatedLabel === null) ? '' : this.validatedLabel);
				this.additionalLabelContainer.addClass('ui_additional_label').css('display', (this.validatedLabel === null) ? 'none' : 'block').append(this.additionalLabel);
			}
			$(this.container).append(this.label).append(this.additionalLabelContainer).append($(this.slider).addClass("ui_slider_block").append($(this.hotspot).addClass("ui_slider_hotspot").append($(this.bar).addClass("ui_slider_bar").append($(this.range).addClass("ui_slider_range").append($(this.button).addClass("ui_slider_button").append(yoodoo.e("div"))))).bind('click touchmove touchstart', function(e) {
				var x = 0;
				var animate = true;
				if (e.originalEvent !== undefined && e.originalEvent.changedTouches !== undefined) {
					x = e.originalEvent.changedTouches[0].pageX;
					animate = (e.type != 'touchmove');
				} else {
					x = e.pageX;
				}
				e.preventDefault();
				var dx = x - $(me.hotspot).offset().left;
				var w = me.settings.maximum.value - me.settings.minimum.value;
				var p = dx / $(me.hotspot).width();
				var v = (p * w);
				v = Math.round(v / me.settings.step.value) * me.settings.step.value;
				v += (1 * me.settings.minimum.value);
				me.set(v, animate);
				me.validateValue(e);
				me.settings.onchange.value.apply(me, [e]);
			}).append($(this.labels).addClass("ui_slider_labels"))));
			if (this.settings.showvalues.value === true) {
				for (var v = (1 * this.settings.minimum.value); v <= (1 * this.settings.maximum.value); v += (1 * this.settings.step.value)) {
					var lbl = yoodoo.e("div");
					var p = 100 * ((v - (1 * this.settings.minimum.value)) / (this.settings.maximum.value - this.settings.minimum.value));
					$(this.labels).append($(lbl).html('<div>' + v.toString() + '</div>').css({
						left : p.toFixed(1) + '%'
					}));
				}
			} else if (this.settings.showendvalues.value === true) {
				var mintxt = (this.settings.minimumlabel.value != "") ? this.settings.minimumlabel.value : (1 * this.settings.minimum.value).toString();
				var maxtxt = (this.settings.maximumlabel.value != "") ? this.settings.maximumlabel.value : (1 * this.settings.maximum.value).toString();
				$(this.labels).append($(yoodoo.e("div")).html('<div>' + mintxt + '</div>').css({
					left : '0%'
				}).addClass('ui_slider_mintxt')).append($(yoodoo.e("div")).html('<div>' + maxtxt + '</div>').css({
					right : '0%'
				}).addClass('ui_slider_maxtxt'));
			}

			this.set(value);
			this.validateValue(null);
			return $(this.container);
		};
		this.set = function(value, animate) {
			value = 1 * value;
			if (value < this.settings.minimum.value)
				value = 1 * this.settings.minimum.value;
			if (value > this.settings.maximum.value)
				value = 1 * this.settings.maximum.value;
			this.value = 1 * value;
			var p = ((value / (this.settings.maximum.value - this.settings.minimum.value)) * 100).toFixed(1);
			if (animate === false) {
				$(this.button).stop().css({
					width : p + '%',
					overflow : 'visible'
				});
			} else {
				$(this.button).animate({
					width : p + '%',
					overflow : 'visible'
				}, 300);
			}
			//this.processTags();
			//if (animate === true)
				this.processOnChange();
		};
		this.metaValue = function() {
			if (this.settings.metaAdditionalLabel.value && typeof (this.settings.additionalLabel.value) == 'object' && this.settings.additionalLabel.value.length !== undefined && this.settings.additionalLabel.value.length > 0) {
				var lbl=(typeof(this.validatedLabel)=="function")?this.validatedLabel():this.validatedLabel;
				return (lbl === null) ? '' : lbl;
			} else {
				return this.settings.metaAdditionalLabel.value ? '' : this.value;
			}
		};
		this.validateValue = function(e) {
			var me = this;
			me.validatedLabel = null;
			for (var i in me.settings.additionalLabel.value) {
				if (me.value >= me.settings.additionalLabel.value[i].min && me.value <= me.settings.additionalLabel.value[i].max) {
					me.validatedLabel = me.settings.additionalLabel.value[i].label;
				}
			}
			if (me.settings.showAdditionalLabel.value && me.additionalLabelContainer !== undefined) {
				//$(me.additionalLabel).empty();
				if (me.validatedLabel === null) {
					me.additionalLabelContainer.slideUp(300, function() {
						$(me.additionalLabel).empty();
					});
				} else {
					me.additionalLabel.html((me.validatedLabel === null) ? '' : me.validatedLabel);
					me.additionalLabelContainer.slideDown(300);
				}
			}

		};

		this.updated = function(params) {
			if ( typeof (params) == 'object') {
				for (var k in params) {
					if (this.settings[k] !== undefined)
						this.settings[k].value = params[k];
				}
			}
			$(this.label).html(this.settings.label.value);
			//$(this.input).attr("placeholder", (this.settings.emptyCombine.value === true) ? this.settings.label.value : this.settings.emptyText.value);
			this.validateValue();
		};
	},
	checkbox : function(args) {
		this.settings = {
			type : 'checkbox',
			label : {
				title : 'Label',
				type : 'text',
				value : 'Label'
			},
			setLayout : {
				title : 'Set the layout',
				type : 'select',
				options : ['outLabel', 'inLabelRight', 'inLabelLeft'],
				value : 0
			},
			onchange : {
				title : 'Callback function on change',
				type : 'function',
				value : function(e) {
				}
			}
		};
		this.value = false;
		yoodoo.ui.standard(this, args);
		this.processRender = function(value) {
			var me = this;
			this.value = value;
			this.label = yoodoo.e("label");
			$(this.label).html('<span>' + this.settings.label.value + '</span>');
			this.input = yoodoo.e("input");
			$(this.input).attr("type", this.settings.type);

			if (this.settings.setLayout.value < 0 || this.settings.setLayout.value > this.settings.setLayout.options.length) {
				//console.log('error');
				return false;
			}

			this.input.checked = this.value;
			if (this.settings.setLayout.options[this.settings.setLayout.value] == 'outLabel') {
				$(this.label).attr('for', this.id);
				this.input.id = this.id;
				$(this.container).append(this.input).append($(this.label).prepend($(yoodoo.e("span")).append(yoodoo.e("span")).addClass('checkImage')));
			} else if (this.settings.setLayout.options[this.settings.setLayout.value] == 'inLabelRight') {
				$(this.container).append($(this.label).append(this.input));
			} else if (this.settings.setLayout.options[this.settings.setLayout.value] == 'inLabelLeft') {
				$(this.container).append($(this.label).prepend(this.input));
			}

			$(this.input).bind('change', function(e) {
				me.value = this.checked;
				me.settings.onchange.value.apply(me, [e]);
				me.processOnChange();

			});
			return $(this.container);
		};

		this.updated = function(params) {
			if ( typeof (params) == 'object') {
				for (var k in params) {
					if (this.settings[k] !== undefined)
						this.settings[k].value = params[k];
				}
			}
			$(this.label).find('span').last().html(this.settings.label.value);
		};

	},
	radioGroup : function(args) {
		this.settings = {
			type : 'radioGroup',
			label : {
				title : 'Label',
				type : 'text',
				value : 'Label'
			},
			required : {
				title : 'The container element receives the "stillRequired" class if the value is empty',
				type : 'boolean',
				value : false
			},
			cssStyled : {
				title : 'Hide the standard radio button',
				type : 'boolean',
				value : true
			},
			onchange : {
				title : 'Callback function on change',
				type : 'function',
				value : function(e) {
				}
			}
		};
		this.value = null;
		yoodoo.ui.standard(this, args);
		this.processRender = function(value) {
			this.label = yoodoo.e("label");
			$(this.label).html(this.settings.label.value);
			$(this.container).append(this.label);
			this.options.forEach( function(optionValue) {
				$(this.container).append(optionValue.render(value));
			}.bind(this));
			$(this.container).find('input[type=radio]').attr('name', this.id);
			this.processChange(null);
			return $(this.container);
		};

		this.processChange = function(e) {
			if (this.settings.required.value === true && $(this.container).find('input[type=radio]:checked').get().length == 0) {
				$(this.container).addClass("stillRequired");
			} else {
				$(this.container).removeClass("stillRequired");
			}
			if (e !== null) {
				this.settings.onchange.value.apply(this, e);
				this.processOnChange();
			}
		};

		this.options = [];
		this.add = function(args) {
			var me = this;
			args.onchange = function(e) {
				me.value = this.value;
				me.processChange(e);
			};
			args.cssStyled = this.settings.cssStyled.value;
			var radio = new yoodoo.ui.radioButton(args);
			this.options.push(radio);
			return radio;
		};
		this.updated = function(params) {
			if ( typeof (params) == 'object') {
				for (var k in params) {
					if (this.settings[k] !== undefined)
						this.settings[k].value = params[k];
				}
			}
			$(this.label).html(this.settings.label.value);
		};
	},

	radioButton : function(args) {
		this.settings = {
			type : 'radio',
			label : {
				title : 'Label',
				type : 'text',
				value : 'Label'
			},
			setActive : {
				title : 'This radio button is available',
				type : 'boolean',
				value : true
			},
			value : {
				title : 'The value returned when selected',
				type : 'text',
				value : 'undefined'
			},
			cssStyled : {
				title : 'Hide the standard radio button',
				type : 'boolean',
				value : true
			},
			onchange : {
				title : 'Callback function on change',
				type : 'function',
				value : function(e) {
				}
			}
		};
		this.value = null;
		yoodoo.ui.standard(this, args);
		this.processRender = function(value) {
			var me = this;

			this.label = yoodoo.e("label");
			$(this.label).html(this.settings.label.value).attr("for", 'yoodooUiRadio' + this.id);
			$(this.container).append(this.label);
			this.input = yoodoo.e("input");
			this.input.id = 'yoodooUiRadio' + this.id;
			$(this.input).attr("type", "radio");
			this.input.value = this.settings.value.value;
			if (value == this.settings.value.value)
				this.input.checked = true;
			if (this.settings.cssStyled.value === true) {
				$(this.input).insertBefore($(this.label).prepend(yoodoo.e("span")));
			} else {
				$(this.label).append(this.input);
			}
			if (!this.settings.setActive.value)
				this.input.disabled = true;
			this.input.checked = this.settings.value.value == value;

			$(this.input).bind('change', function(e) {
				me.changed(e);
			});
			this.changed(null);
			return $(this.container);
		};
		this.changed = function(e) {
			this.value = this.input.checked ? this.settings.value.value : null;
			if (e !== null) {
				this.settings.onchange.value.apply(this, [e]);
				this.processOnChange();
			}
		};
		this.updated = function(params) {
			if ( typeof (params) == 'object') {
				for (var k in params) {
					if (this.settings[k] !== undefined)
						this.settings[k].value = params[k];
				}
			}
			$(this.label).html(this.settings.label.value);
		};
	},
	sorter : function(args) {
		this.settings = {
			type : 'sorter',
			label : {
				title : 'Label',
				type : 'text',
				value : 'Label'
			},
			onchange : {
				title : 'Callback function on change',
				type : 'function',
				value : function(e) {
				}
			},
			highlightFirst : {
				title : 'Highlight the top n items',
				type : 'integer',
				value : null
			},
			disabled : {
				title : 'Disable sorter',
				type : 'boolean',
				value : false
			},

			randomize : {
				title : 'The sorter item will be displayed in a random order',
				type : 'boolean',
				value : false
			}
		};
		this.value = [];
		yoodoo.ui.standard(this, args);
		this.processRender = function(value) {
			// value=[of element names]
			var me = this;
			this.sorter = yoodoo.e("div");

			this.sorter.changeFunction = this.settings.onchange.value;
			$(this.sorter).addClass("ui-sortable").sortable({

				items : '> div:not(.yoodooUiSortableDisabled)',
				containment : 'parent',
				disabled : this.settings.disabled.value,

				update : function(e, ui) {
					var source = me;
					var order = $(source.sorter).find('>div').get();
					var newArrayElements = [];
					me.value = [];
					for (var i = 0; i < order.length; i++) {
						me.value.push(order[i].me.settings.value.value);
						var el = order[i].me;
						for (var j in me.elementByKey) {
							if (me.elementByKey[j].id == el.id)
								el.key = j;
						}
						newArrayElements.push(el);
					}
					me.elements = newArrayElements;
					me.settings.onchange.value.apply(me, [e]);
					me.processOnChange();
				}
			}).disableSelection();
			this.label = yoodoo.e("label");
			$(this.label).html(this.settings.label.value);

			if (value === undefined || typeof (value) != 'object' || typeof (value.length) != 'number') {
				if (this.settings.randomize.value) {
					//var orderedElements = this.elements;
					this.elements = this.shuffle(this.elements);
				}
			} else {
				for (var o = value.length - 1; o >= 0; o--) {
					for (var i in this.elements) {
						if (this.elements[i].settings.value.value == value[o]) {
							this.elements.unshift(this.elements.splice(i, 1)[0]);
						}
					}
				}
			}
			this.elements.forEach(function(element) {
				$(me.sorter).append(element.render());
			});

			$(this.container).append(this.label).append(this.sorter);
			return $(this.container);
		};

		this.elements = [];
		this.elementByKey = {};

		this.add = function(args, key) {
			var me = this;
			this.key = this.source.key;
			args.key = key;
			args.parent = this;
			if ( args instanceof Array) {
				for (var i in args) {
					var op = new yoodoo.ui.sorter_element(( typeof (args[i]) == 'string') ? {
						label : args[i]
					} : args[i]);
					this.elements.push(op);
					this.elementByKey[i] = op;
				}
				return this.options;
			} else if ( typeof (args) === 'object') {
				var op = new yoodoo.ui.sorter_element({
					label : args.label,
					value : args.value,
					key : args.key
				});
				this.elements.push(op);
				this.elementByKey[args.key] = op;
				return op;
			} else {
				args.onchange = this.settings.onchange.value;
				var op = new yoodoo.ui.sorter_element(args);
				if (args.value == "" || args.value === undefined)
					args.value = args.label;
				this.elements.push(op);
				this.elementByKey[i] = op;
				return op;
			}
		};

		this.empty = function() {
			this.elements.length = 0;
		};

		this.updated = function(params) {
			if ( typeof (params) == 'object') {
				for (var k in params) {
					if (this.settings[k] !== undefined)
						this.settings[k].value = params[k];
				}
			}
			$(this.label).html(this.settings.label.value);
		};

		this.shuffle = function(v) {
			for (var j, x, i = v.length; i; j = parseInt(Math.random() * i), x = v[--i], v[i] = v[j], v[j] = x);
			return v;
		};
	},
	sorter_element : function(args) {
		this.settings = {
			type : 'element',
			label : {
				title : 'Label',
				type : 'text',
				value : 'Label'
			},
			setClass : {
				title : 'Assign a class to the element',
				type : 'text',
				value : ''
			},
			value : {
				title : 'A value to assign to this item',
				type : 'text',
				value : null
			},
			active : {
				title : 'Set the element Active',
				type : 'boolean',
				value : true
			},
			highlight : {
				title : 'Highlight the element',
				type : 'boolean',
				value : false
			},
			disableSortable : {
				title : 'Disable one sortable item by id',
				type : 'boolean',
				value : false
			},
			onchange : {
				title : 'Callback function on change',
				type : 'function',
				value : function(e) {
				}
			}
		};

		yoodoo.ui.standard(this, args);
		if (this.settings.value.value === null || this.settings.value.value === undefined)
			this.settings.value.value = this.settings.label.value;
		this.processRender = function() {
			var me = this;
			this.label = yoodoo.e("label");
			$(this.label).html(this.settings.label.value);
			if (this.settings.setClass.value != '')
				$(this.container).addClass(this.settings.setClass.value);
			this.container.me = this;
			if (this.settings.highlight.value)
				$(this.container).addClass('yoodooUiSortableHighlight');
			if (this.settings.disableSortable.value)
				$(this.container).addClass('yoodooUiSortableDisabled');
			if (!this.settings.active.value) {
				$(this.container).css('display', 'none');
			}

			$(this.container).append(this.element).append(this.label);
			return $(this.container);
		};

	},

	boxdrop : function(args) {
		this.settings = {
			type : 'boxdrop',
			label : {
				title : 'Label',
				type : 'text',
				value : 'Label'
			},
			setClass : {
				title : 'Assign a class to the element',
				type : 'text',
				value : 'ClassName'
			},
			setActive : {
				title : 'Set the element Active',
				type : 'boolean',
				value : true
			},
			highlight : {
				title : 'Highlight the element',
				type : 'boolean',
				value : false
			},
			setLayout : {
				title : 'Set the layout',
				type : 'select',
				options : ['sideItems', 'topItems', 'middleItems'],
				value : 0
			},
			onchange : {
				title : 'Callback function on change',
				type : 'function',
				value : function(e) {
				}
			}
		};

		yoodoo.ui.standard(this, args);
		this.items = [];
		this.addItem = function(obj) {
			var item = new yoodoo.ui.boxdrop_item(obj, this);
			this.items.push(item);
			return item;
		};
		this.boxes = [];
		this.addBox = function(obj) {
			var box = new yoodoo.ui.boxdrop_box(obj, this);
			this.boxes.push(box);
			return box;
		};
		this.processRender = function(value) {
			var me = this;
			this.label = yoodoo.e("label");
			$(this.label).html(this.settings.label.value);

			this.displayArea = yoodoo.e("div");
			$(this.displayArea).addClass('displayArea');

			this.dropArea = yoodoo.e("div");
			$(this.dropArea).addClass('dropArea');

			this.items.forEach(function(e) {
				var item = e.render(me);
				$(me.displayArea).append(item);
			});

			this.boxes.forEach(function(e) {
				var box = e.render(me);
				$(me.dropArea).append(box);
			});

			if (this.settings.setLayout.value < 0 || this.settings.setLayout.value > this.settings.setLayout.options.length) {
				//console.log('error');
				return false;
			}

			if (this.settings.setLayout.options[this.settings.setLayout.value] == 'sideItems') {
				$(this.displayArea).css('width', '30%');
				$(this.dropArea).css('width', '70%');
				$(this.container).append(this.label).append(this.displayArea).append(this.dropArea);
			} else if (this.settings.setLayout.options[this.settings.setLayout.value] == 'topItems') {
				$(this.displayArea).css({
					width : '100%',
					padding : 0
				});
				$(this.dropArea).css({
					width : '100%',
					padding : 0
				});

				$(this.container).append(this.label).append(this.displayArea).append(this.dropArea);
			} else if (this.settings.setLayout.options[this.settings.setLayout.value] == 'middleItems' && this.boxes.length <= 2) {

				$(me.displayArea).children().empty();
				$(me.dropArea).children().empty();

				this.dropArea1 = yoodoo.e("div");
				$(this.dropArea1).addClass('dropArea');

				var box1 = this.boxes[0].render(me);
				$(me.dropArea).append(box1);

				this.items.forEach(function(e) {
					var item = e.render(me);
					$(me.displayArea).append(item);
				});

				var box2 = this.boxes[1].render(me);
				$(me.dropArea1).append(box2);

				$(this.displayArea).css({
					width : '100%',
					padding : 0
				});

				$(this.dropArea).css({
					width : '100%',
					padding : 0
				});

				$(this.dropArea1).css({
					width : '100%',
					padding : 0
				});
				$(this.container).append(this.label).append(this.dropArea).append(this.displayArea).append(this.dropArea1);
			} else if (this.settings.setLayout.options[this.settings.setLayout.value] == 'middleItems' && this.boxes.length > 2) {
				$(this.container).html('Layout not available for more than 2 boxes');
			}

			return $(this.container);
		};
		this.updated = function(params) {
			if ( typeof (params) == 'object') {
				for (var k in params) {
					if (this.settings[k] !== undefined)
						this.settings[k].value = params[k];
				}
			}
			$(this.label).html(this.settings.label.value);
		};
	},

	boxdrop_item : function(args, parent) {
		this.parent = parent;
		this.settings = {
			type : 'item',
			label : {
				title : 'Label',
				type : 'text',
				value : 'Label'
			},
			setActive : {
				title : 'Set the element Active',
				type : 'boolean',
				value : true
			},
			highlight : {
				title : 'Highlight the element',
				type : 'boolean',
				value : false
			},
			disableItem : {
				title : 'Disable item',
				type : 'boolean',
				value : false
			},
			onchange : {
				title : 'Callback function on change',
				type : 'function',
				value : function(e) {
				}
			}
		};

		yoodoo.ui.standard(this, args);
		this.processRender = function(value) {
			var me = this;
			var parentContainer = this.parent;

			this.label = yoodoo.e("label");
			$(this.label).html(this.settings.label.value);

			$(this.container).draggable({
				containment : this.parentContainer,
				revert : 'invalid',
				stop : function() {
					$(this).draggable('option', 'revert', 'invalid');
				}
			}).data("itemDragged", this);

			if (this.settings.highlight.value)
				$(this.container).addClass('highlight');
			if (this.settings.disableItem.value)
				$(this.container).draggable('option', 'disabled', this.settings.disableItem.value);
			if (!this.settings.setActive.value) {
				$(this.container).css('display', 'none');
			}

			$(this.container).append(this.label);
			return $(this.container);
		};
	},
	boxdrop_box : function(args, parent) {
		this.parent = parent;
		this.settings = {
			type : 'box',
			label : {
				title : 'Label',
				type : 'text',
				value : 'Label'
			},
			setClass : {
				title : 'Assign a class to the element',
				type : 'text',
				value : 'ClassName'
			},
			setActive : {
				title : 'Set the element Active',
				type : 'boolean',
				value : true
			},
			highlight : {
				title : 'Highlight the element',
				type : 'boolean',
				value : false
			},
			disableBox : {
				title : 'Disable box',
				type : 'boolean',
				value : false
			},
			invalidItems : {
				title : 'Set a list of invalid items for the box',
				type : 'array',
				value : []
			},
			ondropDelete : {
				title : 'Delete the item when it is dropped',
				type : 'boolean',
				value : false
			},
			ondropAppend : {
				title : 'Append the item to the box when it is dropped',
				type : 'boolean',
				value : false
			},
			onchange : {
				title : 'Callback function on change',
				type : 'function',
				value : function(e) {
				}
			}
		};

		yoodoo.ui.standard(this, args);
		this.processRender = function(value) {
			var me = this;
			this.label = yoodoo.e("label");
			$(this.label).html(this.settings.label.value);
			$(this.container).droppable({

				drop : function(e, u) {
					var source = me;
					var reverted = false;
					for (var i in me.settings.invalidItems.value) {
						if ($(u.draggable).data("itemDragged") == me.settings.invalidItems.value[i]) {
							u.draggable.draggable('option', 'revert', true);
							reverted = true;
						}
					}
					var placeholder = yoodoo.e("div");
					$(placeholder).css({
						width : u.draggable.outerWidth(true),
						height : u.draggable.outerHeight(true)
					});

					if (me.settings.ondropAppend.value && !reverted) {
						u.draggable.draggable('option', 'stop', function(e, ui) {

							var offset = $(u.draggable).offset();
							offset = {
								left : offset.left,
								top : offset.top
							};

							var itemToAppend = u.draggable.css({
								visibility : 'hidden',
								left : 0,
								top : 0,
								width : u.draggable.outerWidth(true)
							});

							$(placeholder).insertBefore(u.draggable).slideUp(300, function() {
								$(this).remove();
							});

							$(source.container).append(itemToAppend);
							u.draggable.draggable('option', 'disabled', true);
							var newoffset = $(u.draggable).offset();

							$(u.draggable).css({
								left : offset.left - newoffset.left,
								top : offset.top - newoffset.top,
								visibility : 'visible'
							}).animate({
								left : 0,
								top : 0
							});
						});
					}

					if (me.settings.ondropDelete.value && !reverted) {
						u.draggable.draggable('option', 'disabled', true);
						u.draggable.draggable('option', 'stop', function(e, ui) {

							u.draggable.fadeOut(function() {
								$(placeholder).insertBefore(u.draggable).slideUp(300, function() {
									$(this).remove();
								});
							});
						});
					}
					me.parent.processOnChange();
					return $(u.draggable).data("itemDragged");
				}
			});

			if (this.settings.highlight.value)
				$(this.container).addClass('highlight');
			if (this.settings.disableBox.value)
				$(this.container).droppable('option', 'disabled', this.settings.disableBox.value);
			if (!this.settings.setActive.value) {
				$(this.container).css('display', 'none');
			}

			$(this.container).append(this.label);
			return $(this.container);
		};
	},
	date : function(args) {

		this.settings = {
			type : 'date',
			label : {
				title : 'Label',
				type : 'text',
				value : 'Label'
			},
			forceCalendar : {
				title : 'Force the input to use the calendar',
				type : 'boolean',
				value : false
			},
			setActive : {
				title : 'Set the element Active',
				type : 'boolean',
				value : true
			},
			minDate : {
				title : 'The earliest date selectable',
				type : 'date',
				value : null
			},
			maxDate : {
				title : 'The latest date selectable',
				type : 'date',
				value : null
			},
			past : {
				title : 'Allow a past date',
				type : 'boolean',
				value : true
			},
			daynamelength : {
				title : 'Number of characters of the day name to show',
				type : 'integer',
				value : 3
			},
			monthyearformat : {
				title : 'php date format for the calendar month and year display',
				type : 'string',
				value : 'F Y'
			},
			showOther : {
				title : 'Show dates outside the current month within the calendar',
				type : 'boolean',
				value : true
			},
			onchange : {
				title : 'Function to call when changed',
				type : 'function',
				value : function(e) {
				}
			},
			defaultValue : {
				title : 'Default date',
				type : 'date',
				value : null
			},
			displayFormat : {
				title : 'The php date format of the date to display',
				type : 'string',
				value : 'jS F Y'
			}
		};
		this.calendarOptions = {};
		yoodoo.ui.standard(this, args);
		this.setValue = function (newDate) {
			this.value=newDate;
			if (this.input.type == 'date' && !this.settings.forceCalendar.value) {
				this.input.value = yoodoo.formatDate('Y-m-d',this.value);
			}else{
				yoodoo.formatDate(this.settings.displayFormat.value, this.value);
			}
		};
		this.processRender = function(value) {
			if (!( value instanceof Date)) {
				if (this.settings.defaultValue.value instanceof Date) {
					value = this.settings.defaultValue.value;
				} else {
					value = new Date();
				}
			}
			if (this.settings.minDate.value !== null && this.settings.minDate.value > value)
				value = this.settings.minDate.value;
			if (this.settings.maxDate.value !== null && this.settings.maxDate.value > value)
				value = this.settings.maxDate.value;
			this.calendarOptions = {
				minDate : this.settings.minDate.value,
				maxDate : this.settings.maxDate.value,
				daynamelength : this.settings.daynamelength.value,
				past : this.settings.past.value,
				showOther : this.settings.showOther.value,
				cellspacing : 0,
				cellpadding : 1
			};
			this.value = value;
			this.label = $(yoodoo.e("label")).html(this.settings.label.value);
			$(this.container).append(this.label);
			this.input = yoodoo.e("input");
			$(this.input).attr("type", "date");
			var me = this;
			if (this.input.type == 'date' && !this.settings.forceCalendar.value) {
				if (this.settings.minDate.value !== null)
					this.input.min = this.settings.minDate.value;
				if (this.settings.maxDate.value !== null)
					this.input.min = this.settings.maxDate.value;
				//this.input.value = this.value;
				this.input.value = yoodoo.formatDate('Y-m-d',this.value);
				if (!this.settings.setActive.value)
					this.input.disabled = true;
				$(this.container).append($(this.input).bind("change", function(e) {
					me.value = yoodoo.stringToDate('Y-m-d', this.value);
					me.processOnChange();
					me.settings.onchange.value.apply(me, e);

				}));
			} else {
				$(this.container).append($(this.input).attr("type", "text"));
				if (this.settings.setActive.value) {
					$(this.input).bind('click focus keydown', function(e) {
						if (me.blockout !== undefined)
							return false;
						e.preventDefault();
						me.blockout = $(yoodoo.e("div")).addClass("yoodooUI-blockout").append($(yoodoo.e("div")).addClass("yoodooUI-center").append(me.calendar = $(yoodoo.e("div")).addClass("yoodooUI-calendar").css({}))).click(function(e) {
							if (e.target == this) {
								$(this).remove();
								me.blockout = undefined;
							}
						});
						me.calendar.empty().append(me.monthTable(me.value, me.calendarOptions));
						$(document.body).append(me.blockout);
						me.processOnChange();
					}).val(yoodoo.formatDate(this.settings.displayFormat.value, this.value));
				} else {
					this.input.disabled = true;
				}
			}
			return $(this.container);
		}, this.monthTable = function(dt, opts) {
			var fd = this.firstDayInMonth(dt);
			var ld = this.daysInMonth(dt);
			var today = new Date(dt.getFullYear(), dt.getMonth(), -fd + 1);
			var selectedDate = new Date(dt.getFullYear(), dt.getMonth(), dt.getDate());
			var table = $(yoodoo.e("table"));
			table.attr("cellspacing", opts.cellspacing).attr("cellpadding", opts.cellpadding);
			var current = new Date();
			current = new Date(current.getFullYear(), current.getMonth(), current.getDate());
			var canBack = true;
			var firstDate = new Date(dt.getFullYear(), dt.getMonth(), 1);
			if (opts.minDate !== null && opts.minDate >= firstDate)
				canBack = false;
			var tr = $(yoodoo.e("tr")).addClass("yoodooUI-calendar-title");
			table.append(tr);
			var me = this;
			var td = $(yoodoo.e("td"));
			if (opts.minDate === null || new Date(dt.getFullYear(), -1, 1) >= opts.minDate) {
				td.append($(yoodoo.e("button")).attr("type", "button").html('<<').click(function(e) {
					e.preventDefault();
					$(this).unbind("click");
					me.moveToYear(-1);
				}));
			}
			tr.append(td);
			td = $(yoodoo.e("td"));
			if (opts.minDate === null || new Date(dt.getFullYear(), dt.getMonth(), -1) >= opts.minDate) {
				td.append($(yoodoo.e("button")).attr("type", "button").html('<').click(function(e) {
					e.preventDefault();
					$(this).unbind("click");
					me.moveToMonth(-1);
				}));
			}
			tr.append(td);
			tr.append($(yoodoo.e("td")).attr('colspan', '3').html(yoodoo.formatDate(this.settings.monthyearformat.value, dt)));
			td = $(yoodoo.e("td"));
			if (opts.maxDate === null || new Date(dt.getFullYear(), dt.getMonth() + 1, 1) <= opts.maxDate) {
				td.append($(yoodoo.e("button")).attr("type", "button").html('>').click(function(e) {
					e.preventDefault();
					$(this).unbind("click");
					me.moveToMonth(1);
				}));
			}
			tr.append(td);
			td = $(yoodoo.e("td"));
			if (opts.maxDate === null || new Date(dt.getFullYear() + 1, 1, 1) <= opts.maxDate) {
				td.append($(yoodoo.e("button")).attr("type", "button").html('>>').click(function(e) {
					e.preventDefault();
					$(this).unbind("click");
					me.moveToYear(1);
				}));
			}
			tr.append(td);
			tr = $(yoodoo.e("tr")).addClass("yoodooUI-days");
			table.append(tr);
			for (var d = 0; d < 7; d++) {
				tr.append($(yoodoo.e("td")).html(yoodoo.days[d].substr(0, opts.daynamelength)));
			}
			while (today.getFullYear() < dt.getFullYear() || (today.getFullYear() == dt.getFullYear() && today.getMonth() <= dt.getMonth()) || today.getDay() > 0) {
				var weekend = (today.getDay() == 0 || today.getDay() == 6);
				var notMonth = (today.getMonth() != dt.getMonth());
				var inRange = true;
				var now = !(today < current || today > current);
				var inPast = (today < current);
				var selected = !(today < selectedDate || today > selectedDate);
				if (opts.minDate !== null && opts.minDate > today)
					inRange = false;
				if (opts.maxDate !== null && opts.maxDate < today)
					inRange = false;
				if (!opts.past && inPast)
					inRange = false;
				var classes = "date" + ((weekend && !notMonth) ? " weekend" : "") + ( notMonth ? " notMonth" : ( inRange ? " selectable date" + today.getDate() : "")) + ( now ? " today" : "") + ( selected ? " selected" : "") + ( inPast ? " inPast" : "");
				if (today.getDay() == 0) {
					tr = $(yoodoo.e("tr"));
					table.append(tr);
				}
				var but = $(yoodoo.e("button")).attr("type", "button").html(((opts.showOther || !notMonth) ? today.getDate() : "&nbsp;")).addClass(classes);
				if (inRange && !notMonth) {
					but.click(function() {
						me.value.setDate(parseInt($(this).html()));
						me.blockout.remove();
						me.blockout = undefined;
						me.changed();
					});
				} else {
					but.get(0).disabled = true;
				}
				tr.append($(yoodoo.e('td')).append(but));
				today = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
			}
			return table;
		};
		this.moveToMonth = function(m) {
			this.value = new Date(this.value.getFullYear(), this.value.getMonth() + m, this.value.getDate());
			this.changeMonth();
		};
		this.moveToYear = function(y) {
			this.value = new Date(this.value.getFullYear() + y, this.value.getMonth(), this.value.getDate());
			this.changeMonth();
		};
		this.changeMonth = function() {
			this.calendar.empty().append(this.monthTable(this.value, this.calendarOptions));
			this.changed();
		};
		this.changed = function() {
			$(this.input).val(yoodoo.formatDate(this.settings.displayFormat.value, this.value));
			this.settings.onchange.value.apply(this, null);
			this.processOnChange();
		};
		this.firstDayInMonth = function(dt) {
			var today = new Date(dt.getFullYear(), dt.getMonth(), 1);
			return today.getDay();
		};
		this.daysInMonth = function(dt) {
			var y = dt.getFullYear();
			var daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
			var leapYear = ((y % 4) == 0) ? (((y % 100) == 0) ? (((y % 400) == 0) ? true : false) : true) : false;
			return daysInMonth[dt.getMonth()];
		};

		this.updated = function(params) {
			if ( typeof (params) == 'object') {
				for (var k in params) {
					if (this.settings[k] !== undefined)
						this.settings[k].value = params[k];
				}
			}
			$(this.label).html(this.settings.label.value);
		};
	},

	month : function(args) {
		var me = this;
		this.settings = {
			type : 'month',
			label : {
				title : 'Label',
				type : 'text',
				value : 'Label'
			},
			value : {
				title : 'Value',
				type : 'text',
				value : ""
			},
			forceSelectBox : {
				title : 'Force input to selectbox',
				type : 'boolean',
				value : false
			},
			min : {
				title : 'Min month',
				type : 'date',
				value : null
			},
			max : {
				title : 'Max month',
				type : 'date',
				value : null
			},
			defaultValue : {
				title : 'Default month',
				type : 'date',
				value : null
			},
			onchange : {
				title : 'Callback function on change',
				type : 'function',
				value : function(e) {
				}
			}
		};
		yoodoo.ui.standard(this, args);
		this.value = null;
		this.processRender = function(value) {
			this.value = value;
			this.resetMinMaxValues(null);
			if ( typeof (this.value) == "string" && this.value != '')
				this.value = yoodoo.stringToDate('Y-m', this.value);
			if (!(this.value instanceof Date) && (this.settings.defaultValue.value instanceof Date))
				this.value = this.settings.defaultValue.value;
			//if (!(this.value instanceof Date))
			//	this.value = new Date();
			//this.value.setDate(1);
			var me = this;

			this.label = yoodoo.e("label");
			$(this.label).html(this.settings.label.value);

			this.input = yoodoo.e("input");
			$(this.input).attr('type', 'month');

			if (this.input.type !== 'month' || this.settings.forceSelectBox.value) {
				this.months = new yoodoo.ui.selectbox({
					label : 'Month',
					onchange : function(e) {
						me.value.setMonth(this.value);
						me.monthValidator(e);
						me.settings.onchange.value.apply(me, e);
						me.processOnChange();

					}
				});
				var monthOptions = this.months.add(this.monthToString(-1));
				this.years = new yoodoo.ui.selectbox({
					label : 'Year',
					onchange : function(e) {
						me.value.setFullYear(this.value);
						me.yearValidator(e);
						me.settings.onchange.value.apply(me, e);
						me.processOnChange();
					}
				});
				var yearsOptions = this.years.add(this.yearsList());
				$(this.container).append(this.label).append(this.months.render(yoodoo.formatDate('m', this.value) - 1)).append(this.years.render(parseInt(yoodoo.formatDate('Y', this.value))));

				this.monthValidator(null);
				this.yearValidator(null);

			} else {
				if (this.settings.max.value instanceof Date)
					this.input.max = yoodoo.formatDate('Y-m', this.settings.max.value);
				if (this.settings.min.value instanceof Date)
					this.input.min = yoodoo.formatDate('Y-m', this.settings.min.value);
				this.input.value = yoodoo.formatDate('Y-m', this.value);

				$(this.container).bind('change', function(e) {
					me.value = me.input.value;
					if ( typeof (me.value) == "string") {
						me.value = yoodoo.stringToDate('Y-m', me.value);
						me.value.setDate(1);
						if (me.value < me.settings.min.value)
							me.value = me.settings.min.value;
						if (me.value > me.settings.max.value)
							me.value = me.settings.max.value;
						me.input.value = yoodoo.formatDate('Y-m', me.value);
					}
					me.processOnChange();
					if (e !== null)
						me.settings.onchange.value.apply(me, [e]);
				});
				$(this.container).append(this.label).append(this.input);
			}

			return $(this.container);
		};

		this.currentMonth = function() {
			var currentMonth = new Date();
			currentMonth.getFullYear();
			currentMonth.getMonth();
			currentMonth.setDate(1);
			currentMonth.setHours(0, 0, 0, 0);
			return currentMonth;
		};

		this.monthToString = function(n) {
			if (n === -1) {
				var arr = [];
				for (var m = 0; m < yoodoo.months.length; m++) {
					arr.push({
						value : m,
						label : yoodoo.months[m]
					});
				}
				return arr;
			} else if (n >= 0 && n <= 11) {
				return yoodoo.months[n];
			}
		};

		this.stringToMonth = function(s) {
			for ( i = 0; i < yoodoo.months.length; i++) {
				if (yoodoo.months[i] == s) {
					var monthFormat = ("0" + i).slice(-2);
					return monthFormat;
				}
			}
		};

		this.yearsList = function(n) {
			var yearsList = [];
			var currentDate = new Date();
			for (var i = this.settings.max.value.getFullYear(); i >= this.settings.min.value.getFullYear(); i--) {
				yearsList.push({
					label : i
				});
			}
			return yearsList;
		};

		this.resetMinMaxValues = function(e) {
			if (this.settings.min.value === null || this.settings.min.value === undefined || this.settings.min.value == '') {
				//this.settings.min.value = new Date(new Date().setFullYear(new Date().getFullYear() - 20));
				this.settings.min.value = new Date(new Date().setFullYear(new Date("January 1, 1960 00:00:00").getFullYear()/* - 20*/));

				this.settings.min.value.setDate(1);
			} else if ( typeof this.settings.min.value == 'string') {
				this.settings.min.value = yoodoo.stringToDate('Y-m', this.settings.min.value);
				this.settings.min.value.setMonth(this.settings.min.value.getMonth() + 1);
			} else if (this.settings.min.value instanceof Date) {
				this.settings.min.value.setDate(1);
				this.settings.min.value.setHours(0, 0, 0, 0);
			}

			if (this.settings.max.value === null || this.settings.max.value === undefined || this.settings.max.value == '') {
				this.settings.max.value = new Date(new Date().setFullYear(new Date().getFullYear() + 10));
				this.settings.max.value.setDate(1);
			} else if ( typeof this.settings.max.value == 'string') {
				this.settings.max.value = yoodoo.stringToDate('Y-m', this.settings.max.value);
				this.settings.max.value.setMonth(this.settings.max.value.getMonth() + 1);
			} else if (this.settings.max.value instanceof Date) {
				this.settings.max.value.setDate(1);
				this.settings.max.value.setHours(0, 0, 0, 0);
			}

		}, this.monthValidator = function(e) {
			if (e !== null) {
				if (this.value.getMonth() >= this.settings.min.value.getMonth() && this.value.getMonth() <= this.settings.max.value.getMonth()) {
					for (var i in this.years.options) {
						this.years.options[i].element.disabled = false;
						if (this.years.options[i].settings.value.value < this.settings.min.value.getFullYear()) {
							this.years.options[i].element.disabled = true;
						} else if (this.years.options[i].settings.value.value > this.settings.max.value.getFullYear()) {
							this.years.options[i].element.disabled = true;
						}
					}
				} else if (this.value.getMonth() < this.settings.min.value.getMonth()) {
					for (var i in this.years.options) {
						this.years.options[i].element.disabled = false;
						if (this.years.options[i].settings.value.value <= this.settings.min.value.getFullYear() || this.years.options[i].settings.value.value > this.settings.max.value.getFullYear()) {
							this.years.options[i].element.disabled = true;
						}
					}
				} else if (this.value.getMonth() > this.settings.max.value.getMonth()) {
					for (var i in this.years.options) {
						this.years.options[i].element.disabled = false;
						if (this.years.options[i].settings.value.value < this.settings.min.value.getFullYear() || this.years.options[i].settings.value.value >= this.settings.max.value.getFullYear()) {
							this.years.options[i].element.disabled = true;
						}
					}
				}
			} else if (e === null) {
			}
		};

		this.yearValidator = function(e) {
			if (e !== null) {
				if (this.settings.min.value.getFullYear() == this.settings.max.value.getFullYear()) {
					for (var i in this.months.options) {
						this.months.options[i].element.disabled = false;
						if (this.months.options[i].settings.value.value < this.settings.min.value.getMonth()) {
							this.months.options[i].element.disabled = true;
						} else if (this.months.options[i].settings.value.value > this.settings.max.value.getMonth()) {
							this.months.options[i].element.disabled = true;
						}
					}
				} else if (this.value.getFullYear() > this.settings.min.value.getFullYear() && this.value.getFullYear() < this.settings.max.value.getFullYear()) {
					for (var i in this.months.options) {
						this.months.options[i].element.disabled = false;
					}
				} else if (this.value.getFullYear() == this.settings.min.value.getFullYear()) {
					for (var i in this.months.options) {
						this.months.options[i].element.disabled = false;
						if (this.months.options[i].settings.value.value < this.settings.min.value.getMonth()) {
							this.months.options[i].element.disabled = true;
						}
					}
				} else if (this.value.getFullYear() == this.settings.max.value.getFullYear()) {
					for (var i in this.months.options) {
						this.months.options[i].element.disabled = false;
						if (this.months.options[i].settings.value.value > this.settings.max.value.getMonth()) {
							this.months.options[i].element.disabled = true;
						}
					}
				}
			} else if (e === null) {
				for (var i in this.years.options) {
					if (this.years.options[i].settings.value.value < this.settings.min.value.getFullYear()) {
						this.years.options[i].element.disabled = true;
					} else if (this.years.options[i].settings.value.value > this.settings.max.value.getFullYear()) {
						this.years.options[i].element.disabled = true;
					}
				}
			}

		};
		this.updated = function(params) {
			if ( typeof (params) == 'object') {
				for (var k in params) {
					if (this.settings[k] !== undefined)
						this.settings[k].value = params[k];
				}
			}
			$(this.label).html(this.settings.label.value);
		};
	},
	proportion : function(args) {

	},
	multiplechoice : function(args) {
		this.settings = {
			type : 'multiplechoice',
			label : {
				title : 'Label',
				type : 'text',
				value : 'Label'
			},
			radioBehaviour : {
				title : 'Only one option can be selected if radioBehaviour is set to true',
				type : 'boolean',
				value : false
			},
			displayAsCheckbox : {
				title : 'display options as checkboxes, default is false. If true, setLayout gives you displaying options',
				type : 'boolean',
				value : false
			},
			setLayout : {
				title : 'Set the layout',
				type : 'select',
				options : ['outLabel', 'inLabelRight', 'inLabelLeft'],
				value : 0
			},
			maxAnswers : {
				title : 'The maximum number of items selectable.',
				type : 'integer',
				value : 1
			},
			minAnswers : {
				title : 'The mininmum number of items selectable.',
				type : 'integer',
				value : 1
			},
			errorMessage : {
				title : 'Error message to display when are required',
				type : 'text',
				value : ""
			},
			randomAnswers : {
				title : 'Options will be randomized',
				type : 'boolean',
				value : false
			},
			swipe:{
				title :'Give swipe behaviour to the choices',
				type : 'boolean',
				value : false
			},
			columns:{
				title :'Display choices in more column. Default is 1 column',
				type : 'integer',
				value : 1
			},
			centreOdd:{
				title :'Centre odd choice if there are three choices and 2 columns',
				type : 'boolean',
				value : true
			},
			square:{
				title :'Set shape of button to square',
				type : 'boolean',
				value : true
			},
			svg:{
				title :'Set svg for the multiplechoice',
				type : 'text',
				value : ''
			},
			img:{
				title :'Set image for the multiplechoice',
				type : 'text',
				value : ''
			},
			margin:{
				title :'Set margin between the choices',
				type : 'integer',
				value : 1
			},
			className:{
				title :'The css class to apply to the multiplechoice container',
				type : 'text',
				value : ''
			},
			optionClassName:{
				title :'The css class to apply to the multiplechoice container',
				type : 'text',
				value : ''
			},
			questionClassName:{
				title :'The css class to apply to the question container',
				type : 'text',
				value : ''
			},
			imgFirstLayout:{
				title :'Position the multiplechoice image before the label',
				type : 'boolean',
				value : false
			},
			onchange : {
				title : 'Callback function on change',
				type : 'function',
				value : function(e) {
				}
			},
			onclick : {
				title : 'Callback function on click',
				type : 'function',
				value : function(e) {

				}
			}
		};
		this.value = [];
		this.clicks = 0;
		this.display = -1;
		yoodoo.ui.standard(this, args);
		this.processRender = function(value) {
			this.value = value;
			var me = parentObject = this;
			this.label = yoodoo.e("label");
			$(this.label).html(this.settings.label.value);
			var image='';
			
			if(this.settings.img.value!=='' && this.settings.img.value!==undefined){
				image=$(yoodoo.e("img"));
				image.attr("src", yoodoo.option.baseUrl+this.settings.img.value);
			}else if(this.settings.svg.value!=='' && this.settings.svg.value!==undefined){
				image=this.settings.svg.value;
			}	
			var questionWrapper=$(yoodoo.e("div"));
			if(this.settings.imgFirstLayout.value!==undefined && this.settings.imgFirstLayout.value)
				questionWrapper.append(image).append(this.label);
			else
				questionWrapper.append(this.label).append(image);
			
			if(this.settings.questionClassName.value!=='' && this.settings.questionClassName.value!==undefined)
				questionWrapper.addClass(this.settings.questionClassName.value);
				
			this.error = yoodoo.e("div");
			$(this.error).addClass('yoodooUIerrorMessage').hide();
			$(this.container).attr("id", this.id).append(this.error).append(questionWrapper);

			if (this.settings.randomAnswers.value === true)
				this.options = this.shuffle(this.options);
			
			for(var o in this.options) {
				var choice=this.options[o].render(value);
				var n = this.settings.columns.value;
				var m = this.settings.margin.value;
				
				if(n>1){
					var choiceWidth=(100-(n*m*2))/n;
					$(choice).width(choiceWidth+'%');
					
					if(this.settings.centreOdd.value)
						$(this.container).addClass('centreOdd');
				}
				if(this.settings.centreOdd.value)
					$(this.container).addClass('centreOdd');
				$(choice).css({
					margin:m+'%',
					display:'inline-block'
				});
				
				if(this.settings.optionClassName.value!=='' && this.settings.optionClassName.value!==undefined)
					$(choice).addClass(this.settings.optionClassName.value);
				if(!this.settings.square.value)
					$(choice[0]).children('button').css('border-radius','50%');
				
				$(this.container).append(choice);
			}
			if(this.settings.className.value!=='' && this.settings.className.value!==undefined)
				$(this.container).addClass(this.settings.className.value);
			/*this.options.forEach(function(optionValue) {
				me.label = yoodoo.e("label");
				$(me.label).html(optionValue.render(me.value));
				$(me.container).append(me.label);
			});*/
			return $(this.container);
		};
		this.getValue = function() {
			this.value = [];
			for (var i in this.options) {
				if (this.options[i].selected)
					this.value.push(this.options[i].settings.value.value);
			}
			return this.value;
		};
		this.options = [];
		this.optionsByKey = {};
		this.add = function(args, key) {
		var me = this;
		if (me.settings.radioBehaviour.value === true) me.settings.maxAnswers.value = 1;
		       if (me.settings.minAnswers.value >=1) $(this.container).addClass("stillRequired");
			if ( args instanceof Array) {
				for (var i in args) {
					if (args.value === undefined || args.value.value === "")
						args.value = args.label;
					var op = new yoodoo.ui.multiplechoiceButton(( typeof (args[i]) == 'string') ? {
						label : args[i]
					} : args[i]);
					op.settings.displayAsCheckbox = this.settings.displayAsCheckbox.value;
					op.settings.setLayout = this.settings.setLayout.value;

					op.settings.onchange.value = function(e) {
						me.validateClicks(this, e);
						me.settings.onchange.value.apply(me, [e]);
						me.processOnChange();
					};
					this.options.push(op);
					this.optionsByKey[i] = op;
				}
				return op;
			} else if ( typeof (args) === 'object') {
				if (args.value === "" || args.value === undefined)
                	args.value = args.label;
                if(typeof (args.value)==='function'){
                    args.value = args.value();
                }
				var params = {
					displayAsCheckbox : this.settings.displayAsCheckbox.value,
					setLayout : this.settings.setLayout.value,
					radioBehaviour : this.settings.radioBehaviour.value,
					onchange : function(e) {
						me.validateClicks(this, e);
						me.settings.onchange.value.apply(me, [e]);
						me.processOnChange();
					}
				};
				if (args.onchange !== undefined) {
					var newOnClick = args.onchange;
					params.onchange = function(e) {
						me.validateClicks(this, e);
						me.settings.onchange.value.apply(me, [e]);
						newOnClick();
						me.processOnChange();
					};
				}

				args.key = key;
				args.parent = this;
				for (var k in args) {
                    if (k !== 'onchange'){
                          params[k] = args[k];
                    }

				}

				var op = new yoodoo.ui.multiplechoiceButton(params);
				this.options.push(op);
				this.optionsByKey[args.key] = op;
				return this.options;
			} else {
				args.onchange = this.settings.onchange.value;
				var op = new yoodoo.ui.multiplechoiceButton(args);
				if (args.value.value == "" || args.value === undefined)
					args.value = args.label;
				this.options.push(op);
				this.optionsByKey[this.key] = op;
				return op;
			}
		};
		this.flagError = function() {
			var clicks = 0;
			var canClick = false;
			for (var op in this.options) {
				if (this.options[op].selected === true)
					clicks++;
			}
			if (this.settings.maxAnswers.value > clicks)
				canClick = true;
			if (this.settings.minAnswers.value > clicks) {
				$(this.container).addClass("stillRequired");
				if (this.settings.errorMessage.value !== "" && this.settings.errorMessage.value !== null)
					$(this.error).html(this.settings.errorMessage.value).addClass("yoodooUIerror").show();
			} else {
				$(this.container).removeClass("stillRequired");
				$(this.error).removeClass("yoodooUIerror");
			}
			return canClick;
		};
		this.validateClicks = function(obj, e) {
			var event = e;
			var canClick = false;
			var displayAsCB = this.settings.displayAsCheckbox.value;
			var radioBehaviour = this.settings.radioBehaviour.value;
			if (displayAsCB === false) {
				if (radioBehaviour === false) {
					canClick = this.flagError();
					if (obj.selected === true && obj.settings.disabled.value === false) {
						if (obj.settings.unique.value === true)
							this.enableNotUniques();
						obj.selected = false;
						$(obj.input).removeClass("UIselected").addClass('UIavailable');
					} else if (obj.selected === false && obj.settings.disabled.value === false && canClick) {
						if (obj.settings.unique.value === true)
							this.disableNotUniques();
						obj.selected = true;
						$(obj.input).removeClass("UIavailable").addClass('UIselected');
					}
				} else {
					if (obj.settings.disabled.value === false) {
						for (var i in this.options) {
							this.options[i].selected = false;
							$(this.options[i].input).removeClass("UIselected").addClass('UIavailable');
						}
						obj.selected = true;
						$(obj.input).removeClass("UIavailable").addClass('UIselected');
					}
				}
			} else {
				canClick = this.flagError();
				if (obj.selected === true && obj.settings.disabled.value === false) {
					if (obj.settings.unique.value === true)
						this.enableNotUniques();
					obj.selected = false;
					$(obj).removeClass("UIselected").addClass('UIavailable').prop("checked", false);
					this.flagError();
				} else if (obj.selected === false && obj.settings.disabled.value === false && canClick) {
					if (obj.settings.unique.value === true)
						this.disableNotUniques();
					obj.selected = true;
					$(obj.input).removeClass("UIavailable").addClass('UIselected').prop("checked", true);
					this.flagError();
				} else {
					event.preventDefault();
				}
			}
			this.flagError();
			this.value = this.getValue();
		}, this.disableNotUniques = function() {
			for (var op in this.options) {
				if (!this.options[op].settings.unique.value === true) {
					this.options[op].settings.disabled.value = true;
					this.options[op].selected.value = false;
					$(this.options[op].input).removeClass("UIselected").removeClass("UIavailable").prop("disabled", true).prop("checked", false);
				}
			}
		}, this.enableNotUniques = function() {
			for (var op in this.options) {
				if (!this.options[op].settings.unique.value === true) {
					this.options[op].settings.disabled.value = false;
					this.options[op].selected.value = false;
					$(this.options[op].input).removeClass("UIdisabled").addClass("UIavailable").prop("disabled", false);
				}
			}
		};
		this.validateColour = function(colour) {
			var hex = colour.match(/^#(?:[0-9a-f]{3}){1,2}$/i);
			if (hex == null) {
				var rgb2Hex = colour.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
				return "#" + ("0" + parseInt(rgb2Hex[1], 10).toString(16)).slice(-2) + ("0" + parseInt(rgb2Hex[2], 10).toString(16)).slice(-2) + ("0" + parseInt(rgb2Hex[3], 10).toString(16)).slice(-2);
			} else
				return hex[0];
		};
		this.shuffle = function(v) {
			for (var j, x, i = v.length; i; j = parseInt(Math.random() * i), x = v[--i], v[i] = v[j], v[j] = x);
			return v;
		};
	},
	multiplechoiceButton : function(args) {
		this.settings = {
			type : 'multiplechoiceButton',
			label : {
				title : 'Label',
				type : 'text',
				value : 'Label'
			},
			unique : {
				title : 'Unique answers remain enabled, disables the rest non-unique when selected',
				type : 'boolean',
				value : false
			},
			value : {
				title : 'String value associated with this button',
				type : 'string',
				value : ''
			},
			disabled : {
				title : 'disable this button',
				type : 'boolean',
				value : false
			},
			radioBehaviour : {
				title : 'Only one option can be selected if radioBehaviour is set to true',
				type : 'boolean',
				value : false
			},
			cssBackgroundColour : {
				title : 'Background colour for the label',
				type : 'text',
				value : '#FFFFFF'
			},
			cssFontColour : {
				title :'Font colour for the label',
				type : 'text',
				value : '#000000'
			},
			displayAsCheckbox : {
				title : 'display options as checkboxes, default is false. If true, setLayout gives you displaying options',
				type : 'boolean',
				value : false
			},
			setLayout : {
				title : 'Set the layout',
				type : 'select',
				options : ['outLabel', 'inLabelRight', 'inLabelLeft'],
				value : 0
			},
			svg:{
				title :'Set svg as background of button',
				type : 'text',
				value : ''
			},
			img:{
				title :'Set image as background of button',
				type : 'text',
				value : ''
			},
			disableLabelStyle:{
				title : 'Disable label style',
				type : 'boolean',
				value : true
			},
			labelClassName:{
				title : 'The css class to apply to the button label',
				type : 'text',
				value : ''
			},
			className:{
				title : 'The css class to apply to the multiplechoice button container',
				type : 'text',
				value : ''
			},
			onclick : {
				title : 'Callback function on click',
				type : 'function',
				value : function(e, obj) {
				}
			},
			onchange : {
				title : 'Callback function on change',
				type : 'function',
				value : function(e, obj) {
				}
			}
		};
		this.selected = false;
		this.validated = false;
		yoodoo.ui.standard(this, args);
		this.processRender = function(value) {
			var me = this;
			var displayOptions = -1;
			if (me.settings.displayAsCheckbox.value == true && this.settings.setLayout.value >= 0 && this.settings.setLayout.value <= this.settings.setLayout.options.length)
				displayOptions = me.settings.setLayout.value;
			if (displayOptions == -1) {
				this.input = yoodoo.e("button");
				this.label = yoodoo.e("label");
				$(this.label).html(this.settings.label.value);
				$(this.input).attr("type", this.settings.type).attr("id", this.id)/*.append(this.label)*/.addClass("UIavailable");
				
				$(this.label).css({
					  bottom: 0,
					  'border-radius': '10px',
					  'background-color':' rgb(218, 218, 218)',
					  'padding': '10px',
					  'margin':' auto',
					  'text-align':'center',
					  left: 0,
					  right: 0,
					  position:' absolute'
				});
				
				if(this.settings.labelClassName.value!=='' && this.settings.labelClassName.value!==undefined)
					$(this.label).addClass((this.settings.labelClassName.value));
				
				if(this.settings.img.value!=='' && this.settings.img.value!==undefined){
					$(this.input).css({
						'height':'100%',
						'width':'100%',
						'background-size':'cover',
						"background-image" : 'url(../'+this.settings.img.value+')',
						'background-position':'center center'
					});
				}
				if(this.settings.svg.value!=='' && this.settings.svg.value!==undefined){
					$(this.input).append(this.settings.svg.value);
					}
				if (this.settings.disabled.value === true)
					$(this.input).prop("disabled", true);
				if (this.selected.value === true && this.settings.disabled.value !== true)
					$(this.input).removeClass("UIavailable").addClass('UIselected');
				if (this.settings.radioBehaviour.value === true) {
					var bgc = this.settings.cssBackgroundColour.value;
					var fc = this.settings.cssFontColour.value;
					$(this.input).css({
						"background-color" : bgc,
						"color" : fc
					});
				}
				$(this.input).click(function(e) {
					me.settings.onchange.value.apply(me, [e]);
				});
				if (this.settings.disableLabelStyle.value === true){
					$(this.input).html(this.settings.label.value);
					if(this.settings.labelClassName.value!=='' && this.settings.labelClassName.value!==undefined)
						$(this.input).addClass((this.settings.labelClassName.value));
					$(this.container).append(this.input);
				}
				else{
					$(this.container).append(this.input).append(this.label);
				}
					
					
			} else {
				this.label = yoodoo.e("label");
				$(this.label).html(this.settings.label.value);
				this.input = yoodoo.e("input");
				$(this.input).attr("type", "checkbox").attr("id", this.id).addClass("UIavailable");
				if (this.settings.disabled.value === true)
					$(this.input).prop("disabled", true);
				if (this.selected.value === true && this.settings.disabled.value !== true)
					$(this.input).removeClass("UIavailable").addClass('UIselected').prop("checked", true);

				if (displayOptions == 0) {
					$(this.label).attr('for', "id", this.id);
					$(this.input).prop("checked", this.selected.value);
					$(this.container).append(this.input).append(this.label);
				} else if (displayOptions == 1) {
					$(this.label).append(this.input);
					$(this.container).append(this.label);
				} else if (displayOptions == 2) {
					$(this.input).css('float', 'left');
					$(this.label).append(this.input);
					$(this.container).append(this.label);
				}
				$(this.input).bind('click', function(e) {
					me.settings.onchange.value.apply(me, [e]);

				});
			}
			return $(this.container);
		};
		this.updated = function() {
			if (this.settings.disabled.value!=this.input.disabled) this.input.disabled=this.settings.disabled.value;
		};
	},
	tree : function(args) {
		this.screens = {};
		this.currentKey=null;
		this.history = [];
		this.settings = {
			type : 'tree',
			context : {
				title : 'The driving class object',
				type : 'Object',
				value : null
			},
			className : {
				title : 'The css classes to apply to the Pages container',
				type : 'text',
				value : ''
			},
			css : {
				title : 'The css definitions to apply to the Pages container',
				type : 'object',
				value : {}
			},
			screens : {
				title : 'A schema of screen branches',
				type : 'object',
				value : null
			},
			start : {
				title : 'The screen key to start from',
				type : 'text',
				value : 'start'
			},
			alwaysRestart : {
				title : 'Start from the beginning every time',
				type : 'boolean',
				value : 'false'
			},
			prerender : {
				title : 'Function called as this object is created',
				type : 'function',
				value : function() {
				}
			}/*,
			postrender : {
				title : 'Function called on completion of render',
				type : 'function',
				value : function() {
				}
			}*/
		};
		yoodoo.ui.standard(this, args);
		this.build = function() {
			for(var k in this.settings.screens.value) {
				this.screens[k]=new this.screenObject(this,this.settings.screens.value[k]);
			}
			this.settings.prerender.value.apply(this, []);
			$(this.container).css({
				height : '100%'
			}).addClass(this.settings.className.value).css(this.settings.css.value);
			this.start();

		};
		this.addScreen=function(key,schema) {
			this.settings.screens.value[key]=schema;
			this.screens[key]=new this.screenObject(this,this.settings.screens.value[key]);
		};
		this.screenObject=function(tree,schema) {
			var me = this;
			this.tree=tree;
			this.schema=schema;
			this.container=$(yoodoo.e("div")).addClass("tree_screen");
			this.draw=function() {
				var source = me;
				this.empty();
				if (this.schema.questions !== null && typeof (this.schema.questions) == 'object') {
					for (var x in this.schema.questions) {
						var q = new yoodoo.ui.drawQuestion(this.tree.settings.context.value, null, x, this.schema.questions[x], null);
						this.append(q.render());
					}
				}
			};
			this.render=function() {
				var source = me;
				this.draw();
				return this.container;
			};
			this.append=function(ele) {
				$(this.container).append(ele);
			};
			this.empty=function() {
				$(this.container).empty();
			};

		};
		this.start = function() {
			if (this.settings.context.value!==null) {
				if (typeof(this.settings.context.value.value)=="object" && this.settings.context.value.value!==null) {
					if (this.settings.context.value.value.treehistory instanceof Array) this.history=this.settings.context.value.value.treehistory;
				}
			}
			this.cleanHistory();
			if (this.settings.alwaysRestart.value===true) this.history=[];
			if (this.settings.alwaysRestart.value!==true && this.history.length>0) {
				this.settings.start.value=this.history.pop();
			}
			if (this.screens[this.settings.start.value]!==undefined) {
				$(this.container).append(this.screens[this.settings.start.value].render());
				this.history.push(this.settings.start.value);
				this.currentKey=this.settings.start.value;
				if (this.screens[this.settings.start.value].schema.voiceover !== undefined && this.screens[this.settings.start.value].schema.voiceover !== null) {
					if( typeof this.screens[this.settings.start.value].schema.voiceover === 'function') this.screens[this.settings.start.value].schema.voiceover = this.screens[this.settings.start.value].schema.voiceover();
					yoodoo.playSound(this.screens[this.settings.start.value].schema.voiceover, function() {});
				}
				if (this.screens[this.settings.start.value].schema.postrender !== undefined && this.screens[this.settings.start.value].schema.postrender !== null) {
					if( typeof this.screens[this.settings.start.value].schema.postrender === 'function')  this.screens[this.settings.start.value].schema.postrender();
				}
			}
		};
		this.processRender = function (){

		};
		this.getScreen=function(optionalKey){
			var key = null;
			if (typeof this.currentKey !== "undefined") key = this.currentKey;
			if (typeof optionalKey !== "undefined" ) key = optionalKey;
			if (this.screens[key]!==undefined)	return this.screens[key];
			return false;
		},
		this.gotoScreen = function(key,complete) {
			if (this.screens[key]!==undefined) {
				var me=this;
				var done=function() {};
				if (typeof(complete)=='function') done=complete;
				yoodoo.stopSound();
				if (this.screens[key].schema.voiceover !== undefined && this.screens[key].schema.voiceover !== null) {
					if( typeof this.screens[key].schema.voiceover === 'function') this.screens[key].schema.voiceover = this.screens[key].schema.voiceover();
					yoodoo.playSound(this.screens[key].schema.voiceover, function() {});
				}
				$(this.container).animate({opacity:0},300,function() {
					$(this).empty().append(me.screens[key].render()).animate({opacity:1},300,function(){
						done();
						if (typeof(yoodoo.dooit.checkDone)=="function" && typeof(yoodoo.dooit.params.display)=='object') yoodoo.dooit.checkDone();
					});
				});
				
				this.history.push(key);
				this.currentKey=key;
				this.saveHistory();
			}
		};
		this.cleanHistory = function() {
			for(var i=this.history.length-1;i>=0;i--) {
				if (this.screens[this.history[i]]===undefined) this.history.splice(i,1);
			}
		};
		this.deleteHistory = function(){
			this.history =[];
			this.saveHistory();
			return true;
		};
		this.saveHistory = function() {
			if (this.settings.context.value!==null) {
				if (typeof(this.settings.context.value.value)=="object" && this.settings.context.value.value!==null) {
					this.settings.context.value.value.treehistory=this.history;
				}
			}
		};
		this.backScreen = function() {
			if (this.history.length>1) {
				this.history.pop();
				this.gotoScreen(this.history.pop());
				this.saveHistory();
			}
		};
		this.build(); 
	},
	pages : function(args) {
		args.ui = this;
		this.pagesByKey = {};
		this.pages = [];
		this.page = 0;
		this.settings = {
			type : 'pages',
			context : {
				title : 'The driving class object',
				type : 'Object',
				value : null
			},
			pages : {
				title : 'A schema of pages',
				type : 'object',
				value : null
			},
			prerender : {
				title : 'Function called as this object is created',
				type : 'function',
				value : function() {
				}
			},
			prechildrender : {
				title : 'Function called before the Page list is rendered',
				type : 'function',
				value : function() {
				}
			},
			postrender : {
				title : 'Function called on completion of render',
				type : 'function',
				value : function() {
				}
			},
			className : {
				title : 'The css classes to apply to the Pages container',
				type : 'text',
				value : ''
			},
			css : {
				title : 'The css definitions to apply to the Pages container',
				type : 'object',
				value : {}
			},
			pageDots : {
				title : 'Display the dots indicating the pages',
				type : 'boolean',
				value : true
			},
			pageDotsClass : {
				title : 'The page dots container class',
				type : 'text',
				value : ''
			},
			pageDotsClickable : {
				title : 'The dots indicating the pages are buttons to slide to that page',
				type : 'boolean',
				value : true
			},
			pageDotsUnder : {
				title : 'Display the dots indicating the pages below the pages',
				type : 'boolean',
				value : true
			},
			onchange : {
				title : 'Callback function on change',
				type : 'function',
				value : function(e, o, v) {
				}
			},
			canchange : {
				title : 'Callback function before change',
				type : 'function',
				value : function() {
					return true;
				}
			},
			navButtons : {
				title : 'Display the navigation buttons',
				type : 'boolean',
				value : true
			},
			swipe : {
				title : 'Allow the swipe gesture to change the page',
				type : 'boolean',
				value : true
			},
			navBack : {
				title : 'Can go back a page',
				type : 'boolean',
				value : true
			},
			snapPagesToLeft : {
				title : 'Pages snap to the left edge of the pages panel, otherwise they are centered.',
				type : 'boolean',
				value : false
			},
			navButtonsWhenNoTouchOnly : {
				title : 'Display the navigation buttons only when touchscreen is not available',
				type : 'boolean',
				value : true
			},
			width : {
				title : 'Width of the pages (defaults to 100% but auto or an integer is possible)',
				type : 'text',
				value : '100%'
			},
			height : {
				title : 'Height of the pages (defaults to inherit but auto or an integer is possible)',
				type : 'text',
				value : 'inherit'
			}
		};
		var me = this;
		this.backbutton = $(yoodoo.e("button")).attr('type', 'button').addClass("backButton").click(function() {
			me.movePage(-1);
		});

		this.nextbutton = $(yoodoo.e("button")).attr('type', 'button').addClass("ctaButton").click(function() {
			me.movePage(1);
		});

		yoodoo.ui.standard(this, args);
		this.changeFunction = this.settings.onchange.value;
		this.build = function() {
			this.settings.prerender.value.apply(this, []);
			$(this.container).css({
				height : this.settings.height.value
			}).addClass(this.settings.className.value).css(this.settings.css.value);
			this.panel = $(yoodoo.e("div")).addClass("pagePanel");
			if (this.settings.pageDots.value) {
				this.dotpanel = $(yoodoo.e("div")).addClass("pageDotPanel").addClass(this.settings.pageDotsClass.value);
				$(this.container).append(this.dotpanel);
			}
			if (this.settings.pageDotsUnder.value && this.settings.pageDots.value) {
				$(this.container).prepend(this.panel);
			} else {
				$(this.container).prepend($(this.panel).addClass(this.settings.pageDots.value ? "dotsAbove" : ''));
			}
			var me = this;
			for (var p = 0; p < this.pages.length; p++) {
				$(this.panel).append(page.container);
				if (this.settings.pageDotsClickable.value) {
					$(this.dotpanel).append($(yoodoo.e("button")).attr("type", "button").click(function() {
						me.gotoPage($(this).prevAll('button').get().length);
					}));
				} else {
					$(this.dotpanel).append(yoodoo.e("div"));
				}
			}
			if (this.settings.navButtons.value === true && ((this.settings.navButtonsWhenNoTouchOnly.value === true && yoodoo.is_touch === false) || this.settings.navButtonsWhenNoTouchOnly.value === false)) {
				this.navpanel = $(yoodoo.e("div")).addClass("pageNavPanel");
				$(this.container).append($(this.navpanel).append((this.settings.navBack.value === true) ? this.backbutton : null).append(this.nextbutton));
			}

			if (this.settings.swipe.value) {
				var me = this;
				yoodoo.ui.behaviours.swipe(this.panel.get(0), {
					swipeCallback : function(direction, index) {
						if (index !== null)
							me.setPage(index);
					},
					canNext : function() {
						if (me.page + 1 < me.pages.length && me.pages[me.page + 1].settings.disabled.value == true)
							return false;
						return me.pages[me.page].settings.nextButtonValidate.value.apply(me.pages[me.page]);
					},
					canBack : function() {
						return me.settings.navBack.value === true;
					},
					canChange : function() {
						return me.settings.canchange.value.apply(me, arguments);
					},
					snapChildrenToLeft : me.settings.snapPagesToLeft.value
				});
			}
			if (this.settings.pages.value instanceof Array) {
				this.settings.prechildrender.value.apply(this, []);
				for (var p in this.settings.pages.value) {
					this.settings.pages.value[p].context = this.settings.context.value;
					this.addPage(this.settings.pages.value[p],true);
				}
				this.setPage(0);
			}
			this.settings.postrender.value.apply(this, []);
		};
		this.movePage = function(p) {
			if ((p > 0 && this.pages[this.page].settings.nextButtonValidate.value.apply(this.pages[this.page])) || (p < 0 && me.settings.navBack.value === true)) {
				p += this.page;
				p = (p < 0) ? 0 : ((p >= this.pages.length) ? this.pages.length - 1 : p);
				if (this.settings.canchange.value.apply(this, [((p > this.page) ? 'left' : 'right'), p]))
					this.gotoPage(p);
			}
		};
		this.gotoPage = function(p, noAnimation, callback) {
			this.processOnPageChange();
			this.setPage(p);
			var complete = function() {
			};
			if ( typeof (callback) == 'function')
				complete = callback;
			if (this.settings.swipe.value === true) {
				this.panel.get(0).swipe.setPage(this.page, noAnimation, complete);
			} else if (noAnimation === true) {
				this.panel.css({
					'left' : -(this.page * 100) + "%"
				});
				complete();
			} else {
				this.panel.transition({
					'left' : -(this.page * 100) + "%"
				}, 300, complete );
			}
		};
		this.getPageKeyIndex = function(key) {
			for (var p = 0; p < this.pages.length; p++) {
				if (this.pages[p] === this.pagesByKey[key])
					return p;
			}
			return false;
		};
		this.setPage = function(p) {
			if (isNaN(p))
				p = this.getPageKeyIndex(p);
			if (p === false)
				return false;
			this.page = (p < 0) ? 0 : ((p >= this.pages.length) ? this.page : p);
			if (this.settings.pageDots.value)
				$(this.dotpanel.find('>*').get(this.page)).addClass("on").siblings().removeClass('on');
			if (this.pages[this.page].settings.backButton.value !== null)
				this.backbutton.html((typeof(this.pages[this.page].settings.backButton.value)=='function')?this.pages[this.page].settings.backButton.value():this.pages[this.page].settings.backButton.value).append(yoodoo.icons.get('back', 20, 20));
			if (this.pages[this.page].settings.nextButton.value !== null)
				this.nextbutton.html((typeof(this.pages[this.page].settings.nextButton.value)=='function')?this.pages[this.page].settings.nextButton.value():this.pages[this.page].settings.nextButton.value).append(yoodoo.icons.get('next', 20, 20));
			this.update();
			this.settings.onchange.value.apply(this, []);
			if (typeof(yoodoo.dooit)!=="undefined" && typeof(yoodoo.dooit.checkDone)=="function" && typeof(yoodoo.dooit.params.display)=='object') yoodoo.dooit.checkDone();
		};
		this.update = function() {
			if (this.settings.pageDots.value)
				$(this.dotpanel.find('>*').get(this.page)).addClass("on").siblings().removeClass('on');
			this.backbutton.attr("disabled", (this.page == 0) || (this.pages[this.page].settings.backButton.value === null));
			this.nextbutton.attr("disabled", (this.page == (this.pages.length - 1)) || (this.pages[this.page].settings.nextButton.value === null));
		};
		this.addPage = function(params,dontSetPage) {
			if (params === undefined)
				params = {};
			params.parent = this;
			var page = new yoodoo.ui.page(params);
			this.pages.push(page);
			if (params.key !== undefined)
				this.pagesByKey[params.key] = page;
			if (this.panel !== undefined) {
				$(this.panel).append(page.render());
				if (this.settings.pageDots.value) {
					if (this.settings.pageDotsClickable.value) {
						$(this.dotpanel).append(page.dot());
					} else {
						$(this.dotpanel).append(page.blankdot());
						//$(this.dotpanel).append(yoodoo.e("div"));
					}
				}
			}
			if (dontSetPage!==true) this.setPage(this.page);
			return page;
		};
		this.removePage = function(remove, target, callback) {
			if (isNaN(remove))
				remove = this.getPageKeyIndex(remove);
			if (isNaN(target))
				target = this.getPageKeyIndex(target);
			var complete = function() {
			};
			if ( typeof (callback) == 'function')
				complete = callback;
			var p = this.pages[remove];
			var me = this;
			var delIndex = remove;
			if ( typeof target == "undefined" || target === null) {
				//remove page
				p.removePage(function() {
					me.pages.splice(delIndex, 1);
					complete();
					me.update();
				});
			} else if (target < remove) {
				//scroll to page, then remove
				this.gotoPage(target, false, function() {
					var delIndex2 = delIndex;
					var source = me;
					var complete2 = complete;
					p.removePage.apply(p, [
					function() {
						source.pages.splice(delIndex2, 1);
						complete2();
						source.update();
					}]);
				});
			} else if (remove < target) {
				//remove page then scroll
				var targetIndex = target;
				var complete2 = complete;
				p.removePage(function() {
					me.pages.splice(delIndex, 1);
					me.gotoPage(targetIndex - 1, true, function() {
						complete2();
					});
				});
			}
		};
		this.appendTo = function(obj) {
			$(obj).append(this.container);
		};
		this.build();
	},
	page : function(args) {
		args.ui = this;
		this.settings = {
			type : 'page',
			context : {
				title : 'The driving class object',
				type : 'Object',
				value : null
			},
			questions : {
				title : 'Schema object to auto-build',
				type : 'Schema',
				value : null
			},
			prerender : {
				title : 'Function called as this object is created',
				type : 'function',
				value : function() {
				}
			},
			prechildrender : {
				title : 'Function called before the Question list is rendered',
				type : 'function',
				value : function() {
				}
			},
			postrender : {
				title : 'Function called on completion of render',
				type : 'function',
				value : function() {
				}
			},
			parent : {
				title : 'Pages object parent',
				type : 'Pages',
				value : null
			},
			className : {
				title : 'Any css classes to add to the page container',
				type : 'text',
				value : ''
			},
			css : {
				title : 'The css definitions to apply to the Page container',
				type : 'object',
				value : {}
			},
			page_title : {
				title : 'H3 text for the top of the page',
				type : 'text',
				value : ''
			},
			nextButton : {
				title : 'Next button text',
				type : 'text',
				value : function() {
					return yoodoo.w("next");
				}
			},
			nextButtonValidate : {
				title : 'Next button availability check',
				type : 'function',
				value : function() {
					return $(this.container).find('.stillRequired').get().length == 0;
				}
			},
			backButton : {
				title : 'Previous button text',
				type : 'text',
				value : function() {
					return yoodoo.w("back");
				}
			},
			disabled : {
				title : 'Cannot move to the page',
				type : 'boolean',
				value : false
			},
			width : {
				title : 'Width of the page (defaults to 100% but auto or an integer is possible)',
				type : 'text',
				value : '100%'
			},
			height : {
				title : 'Height of the page (defaults to inherit but auto or an integer is possible)',
				type : 'text',
				value : 'inherit'
			}
		};
		yoodoo.ui.standard(this, args);
		this.settings.prerender.value.apply(this, []);
		this.processRender = function() {
			if (this.settings.disabled.value === true)
				this.container.disabled = true;
			if (this.settings.page_title.value !== undefined && this.settings.page_title.value != '')
				this.append($(yoodoo.e("h3")).html(this.settings.page_title.value));
			if (this.settings.questions.value !== null && typeof (this.settings.questions.value) == 'object') {
				this.settings.prechildrender.value.apply(this, []);
				for (var x in this.settings.questions.value) {
					var q = new yoodoo.ui.drawQuestion(this.settings.context.value, null, x, this.settings.questions.value[x], null);
					this.append(q.render());
				}
			}
			this.settings.postrender.value.apply(this, []);
			this.container.scrollPageTo = function(target) {
				var st = this.scrollTop;
				var h = $(this).height();
				var t = $(target).offset().top - $(this).offset().top;
				var b = t + $(target).outerHeight(true);
				var dy = b - h;
				if (dy < 0) {
					dy = t;
					if (dy > 0)
						dy = 0;
				}
				if (dy != 0)
					$(this).animate({
						scrollTop : st + dy
					});
			};
			return $(this.container).css({
				width : this.settings.width.value,
				height : this.settings.height.value
			}).addClass(this.settings.className.value).css(this.settings.css.value);
		};
		this.setDisable = function(val) {
			this.settings.disabled.value =val;
			this.container.disabled = val;
			if (this.dotButton !== undefined) this.dotButton.get(0).disabled = val;
		};
		this.setLast = function () {
			$(this.container).parent().append(this.container);

			if (this.dotButton !== undefined) $(this.dotButton).parent().append(this.dotButton);
		};
		this.html = function(html) {
			$(this.container).html(html);
			return this;
		};
		this.append = function(ele) {
			$(this.container).append(ele);
			return this;
		};
		this.empty = function() {
			$(this.container).empty();
			return this;
		};
		this.dot = function() {
			var me = this;
			if (this.dotButton === undefined)
				this.dotButton = $(yoodoo.e("button")).attr("type", "button").click(function() {
					if (me.settings.parent.value !== null)
						me.settings.parent.value.gotoPage($(this).prevAll('button').get().length);
				});
			if (this.settings.disabled.value)
				this.dotButton.get(0).disabled = true;
			return this.dotButton;
		};
		this.blankdot = function() {
			if (this.dotBlank === undefined)
				this.dotBlank = $(yoodoo.e("div"));
			return this.dotBlank;
		};
		this.removePage = function(callback) {
			var complete = function() {
			};
			if ( typeof (callback) == 'function')
				complete = callback;
			if (this.dotButton !== undefined)
				$(this.dotButton).remove();
			if (this.dotBlank !== undefined)
				$(this.dotBlank).remove();
			$(this.container).css({}).animate({
				width : 0
			}, 500, function() {
				$(this).remove();
				complete();
			});
		};
	},

	dialog : function(args) {
		this.settings = {
			type : 'dialog',
			html : {
				title : 'The html to show',
				type : 'text', // can be DOM element
				value : ''
			},
			blockoutClickClose : {
				title : 'Clicking the background will close the dialogue box',
				type : 'boolean',
				value : false
			},
			className : {
				title : 'CSS classes to add to the dialogue box',
				type : 'text',
				value : ''
			},
			voiceover : {
				title : 'Sound file url',
				type : 'text',
				value : null
			},
			voiceoverComplete : {
				title : 'On completion of sound file',
				type : 'function',
				value : function() {

				}
			},
			closeWhenVoiceoverComplete : {
				title : 'Close the dialog once the sound file has completed',
				type : 'boolean',
				value : true
			},
			closeButton : {
				title : 'Show the close button',
				type : 'boolean',
				value : false
			},
			closeTimeout : {
				title : 'Close the dialogue box after N seconds if no sound file is played',
				type : 'integer',
				value : null
			},
			closedCallback : {
				title : 'On closing of the dialog',
				type : 'function',
				value : function() {

				}
			},
			css : {
				title : 'CSS to apply to the dialog box',
				type : 'object',
				value : {}
			}
		};
		yoodoo.ui.standard(this, args);
		this.value = null;
		this.timeout = null;
		this.render = function() {
			this.dialogueBox = $(yoodoo.e("div")).addClass(this.settings.className.value).html(this.settings.html.value).css(this.settings.css.value);
			var me = this;
			if (this.settings.blockoutClickClose.value) {
				$(this.container).bind('mousedown', function(e) {
					if (e.target === this) {
						e.preventDefault();
						me.close();
					}
				});
			}
			if (this.settings.closeButton.value) {
				this.closeButton = $(yoodoo.e("button")).attr("type", "button").append(yoodoo.icons.get('close', 10, 10)).addClass("close_dialog").click(function() {
					me.close();
				});
				this.dialogueBox.prepend(this.closeButton);
			}
			this.vertical = $(yoodoo.e("div"));
			this.topPos = $(yoodoo.e("div")).css({
				top : '100%'
			});
			$(this.container).css({
				visibility : 'hidden'
			}).append(this.topPos.append(this.vertical.append(this.dialogueBox)));
			if (yoodoo.display.add!==undefined) {
				this.removeFromDisplay = yoodoo.display.add({
					obj : this.container
				});
			}else{
				$(yoodoo.widget).append($(this.container).css({
					'z-index':999,
					top:0,
					left:0
				}));
				var me=this;
				this.removeFromDisplay=function() {
					$(me.container).remove();
				};
			}
			this.vertical.css({
				top : '-' + Math.round(0.5 * this.dialogueBox.outerHeight()) + 'px'
			});
			if (this.settings.voiceover.value !== null) {
				yoodoo.playSound(this.settings.voiceover.value, function() {
					me.settings.voiceoverComplete.value.apply(me, []);
					if (me.settings.closeWhenVoiceoverComplete.value === true)
						me.close();
				});
			} else if (this.settings.closeTimeout.value !== null) {
				this.timeout = setTimeout(function() {
					me.close();
				}, this.settings.closeTimeout.value * 1000);
			}
			$(this.container).css({
				visibility : 'visible'
			});
			this.topPos.css({
				opacity : 0
			}).transition({
				opacity : 1,
				top : '50%'
			}, 300);
			return $(this.container);
		};
		this.append = function(obj) {
			this.dialogueBox.append(obj);
		};
		this.close = function() {
			if (this.timeout !== null)
				clearTimeout(this.timeout);
			yoodoo.stopSound();
			var me = this;
			$(this.topPos).transition({
				opacity : 0,
				top : '100%'
			}, 300, function() {
				me.removeFromDisplay();
				me.settings.closedCallback.value.apply(me, []);
			});
		};
	},
	rules : {
		events : {
			render : {
				type : 'render',
				uitypes : null // all ui types
			},
			onchange : {
				type : 'onchange',
				uitypes : null // all ui types
			},
			pagechange : {
				type : 'pagechange',
				uitypes : ['pages'] // all ui types
			},
			complete : {
				type : 'complete',
				uitypes : null // all ui types
			},
			onblur : {
				type : 'onblur',
				uitypes : ['text', 'password', 'textarea']
			}
		},
		standardize : function(obj, source, args) {
			obj.source = source;
			var currentTags = yoodoo.sessions._tags;
			obj.event = 'onchange';

			// inputs
			obj.stopOnTrue = false;
			// prevent later rules running if this return true
			obj.haveTags = [];
			// run if any of these tags
			obj.mustHaveTags = [];
			// run if all these tags
			obj.mustNotHaveTags = [];
			// run if none of these tags
			obj.dependentRules = [];
			// run if a rule returns true
			obj.mustDependentRules = [];
			// run if ALL rules return true

			// outputs
			obj.response = null;
			obj.score = null;
			obj.scoreValue = 0;
			// incremental
			obj.addTags = [];
			obj.removeTags = [];
			obj.functions = [];

			for (var k in args) {
				if (obj.args !== undefined && obj.args[k] !== undefined) {
					obj.args[k].value = args[k];
				} else if (obj[k] !== undefined) {
					obj[k] = args[k];
				}
			}
			obj.cache = {
				data : {
					addTags : [],
					removeTags : []
				},
				clear : function() {
					this.data.addTags = [];
					this.data.removeTags = [];
				},
				addTag : function(tag) {
					this.data.addTags.push(tag);
					for (var l = this.data.removeTags.length; l >= 0; l--) {
						if (this.data.removeTags[l] == tag)
							this.data.removeTags.splice(l, 1);
					}
				},
				removeTag : function(tag) {
					this.data.removeTags.push(tag);
					for (var l = this.data.addTags.length; l >= 0; l--) {
						if (this.data.addTags[l] == tag)
							this.data.addTags.splice(l, 1);
					}
				},
				run : function() {
					// activate the cache
					while (this.data.addTags.length > 0) {
						dooit.addTag(this.data.addTags.shift());
					}
					while (this.data.removeTags.length > 0) {
						dooit.removeTag(this.data.removeTags.shift());
					}
				}
			};
			obj.checkDependentRules = function() {
				var cont = true;
				for (var r in this.mustDependentRules) {
					if (yoodoo.ui.ruleKeys[this.mustDependentRules[r]] !== undefined && yoodoo.ui.ruleKeys[this.mustDependentRules[r]].check() !== true)
						cont = false;
				}
				var got = (this.dependentRules.length == 0);
				for (var r in this.dependentRules) {
					if (yoodoo.ui.ruleKeys[this.dependentRules[r]] !== undefined && yoodoo.ui.ruleKeys[this.dependentRules[r]].check() === true)
						got = true;
				}
				return (cont && got);
			};
			obj.check = function() {
				this.cache.clear();
				var pass = this.checkDependentRules();
				if (pass === true && this.mustNotHaveTags !== undefined) {
					for (var tag in this.mustNotHaveTags) {
						if ($.inArray(tag, yoodoo.sessions._tags) !== -1)
							pass = false;
					}
				}
				if (pass === true && this.mustHaveTags !== undefined) {
					for (var tag in this.mustHaveTags) {
						if ($.inArray(tag, yoodoo.sessions._tags) == -1)
							pass = false;
					}
				}
				if (pass === true && this.haveTags !== undefined) {
					var got = (this.haveTags.length == 0);
					for (var tag in this.haveTags) {
						if ($.inArray(tag, yoodoo.sessions._tags) !== -1)
							got = true;
					}
					if (got == false)
						pass = false;
				}
				if (pass === false)
					return false;

				var on = obj.processCheck();

				if(this.source.key===undefined && this.source.source.key!==undefined){
					this.source.key=this.source.source.key;
				}
				if (on === true) {
					for (var f in this.functions) {
						this.functions[f].apply(this, [on]);
					}
					// add/remove tags
					for (var t in this.addTags) {
						this.cache.addTag(this.addTags[t]);
					}
					for (var t in this.removeTags) {
						this.cache.removeTag(this.removeTags[t]);
					}

					if (this.response !== undefined && this.response.match !== undefined)
						yoodoo.ui.responses.add(this.source.key, this.response.match);
					yoodoo.ui.responses.call(this.source.key);
				} else if (on === false) {
					if (this.response !== undefined && this.response.nomatch !== undefined)
						yoodoo.ui.responses.add(this.source.key, this.response.nomatch);
					yoodoo.ui.responses.call(this.source.key);
				}
				return on;
			};
			if ( typeof (obj.event) == 'string' && yoodoo.ui.rules.events[obj.event] !== undefined)
				obj.event = yoodoo.ui.rules.events[obj.event];
		},
		multiplechoice : {
			selectedKeys : function(source, args) {

				this.args = {
					keylist : {
						title : 'The choices to match',
						type : 'multiplechoiceOptions',
						value : {}
					}
				};
				this.keylist = {};
				// {key1:1,key2:0,key3:null}
				yoodoo.ui.rules.standardize(this, source, args);
				if (this.args.keylist.value !== undefined)
					this.keylist = this.args.keylist.value;

				this.processCheck = function() {
					var on = true;
					var off = true;
					var reachedMax = yoodoo.ui.rules.multiplechoice.isMaxSelected(source);
					if (this.source.optionsByKey !== undefined && this.source.optionsByKey !== null && typeof (this.source.optionsByKey) == 'object') {
						for (var k in this.keylist) {
							if (this.source.optionsByKey[k].selected && this.keylist[k] === 0) {
								off = false;
							} else if (!this.source.optionsByKey[k].selected && this.keylist[k] === 1) {
								on = false;
							}
						}
					}
					if (this.source.settings.radioBehaviour.value === true || reachedMax === true)
						return (on && off);
					return null;
				};
			},
			selectedValues : function(source, args) {
				this.args = {
					keylist : {
						title : 'The choices to match',
						type : 'multiplechoiceOptions',
						value : {}
					}
				};
				this.keylist = {};
				// {key1:1,key2:0,key3:null}
				yoodoo.ui.rules.standardize(this, source, args);
				if (this.args.keylist.value !== undefined)
					this.keylist = this.args.keylist.value;

				this.valid = true;
				this.processCheck = function() {
					this.objectKey = source.key;
					if (this.source.optionsByKey !== undefined && this.source.optionsByKey !== null && typeof (this.source.optionsByKey) == 'object') {
						for (i in this.keylist) {
							if (this.source.optionsByKey[i].settings.value.value !== this.keylist[i])
								this.valid = false;
						}
					}
					/*if (this.valid) {
					 if (this.args.response !== undefined && this.args.response.match !== undefined) yoodoo.ui.responses.add(this.objectKey, this.args.response.match);
					 } else if (this.args.response !== undefined && this.args.response.nomatch !== undefined) yoodoo.ui.responses.add(this.objectKey, this.args.response.nomatch);

					 yoodoo.ui.responses.call(this.objectKey);*/
					return this.valid;
				};
			},
			selectedQuantity : function(source, args) {
				this.args = {
					keylist : {
						title : 'The choices to match',
						type : 'multiplechoiceOptions',
						value : {}
					}
				};
				this.keylist = {};
				// {key1:1,key2:0,key3:null}
				yoodoo.ui.rules.standardize(this, source, args);
				if (this.args.keylist.value !== undefined)
					this.keylist = this.args.keylist.value;
				this.valid = false;
				this.processCheck = function() {
					this.valid = false;
					this.objectKey = source.key;
					if (!yoodoo.ui.rules.multiplechoice.isMaxSelected(this.source)) {
						var count = 0;
						for (j in this.source.optionsByKey) {
							if (this.source.optionsByKey[j].selected)
								count++;
						}
						if (count >= this.keylist.quantity)
							this.valid = true;
					} else {
						if (this.source.settings.maxAnswers.value == this.keylist.quantity)
							this.valid = true;
					}

					/*if (this.valid) {
					if (this.args.response !== undefined && this.args.response.match !== undefined) yoodoo.ui.responses.add(this.objectKey, this.args.response.match);
					} else if (this.args.response !== undefined && this.args.response.nomatch !== undefined) yoodoo.ui.responses.add(this.objectKey, this.args.response.nomatch);*/

					//yoodoo.ui.responses.call(this.objectKey);
					return this.valid;
				};
			},
			isMaxSelected : function(source) {
				var isSelected = true;
				var count = 0;
				for (j in source.optionsByKey) {
					if (source.optionsByKey[j].selected)
						count++;
				}
				if (count == source.settings.maxAnswers.value)
					isSelected = true;
				else
					isSelected = false;
				return isSelected;
			}
		},
		sorter : {
			orderByKeys : function(source, args) {
				this.args = {
					keylist : {
						title : 'The choices to match order',
						type : 'sorterOptions',
						value : {}
					}
				};
				this.keylist = {};
				// {key1:1,key2:0,key3:null}
				yoodoo.ui.rules.standardize(this, source, args);
				if (this.args.keylist.value !== undefined)
					this.keylist = this.args.keylist.value;

				this.valid = true;
				this.processCheck = function() {
					this.valid = true;
					this.objectKey = source.key;
					for (var y in this.source.elements) {
						if (this.source.elements[y].key !== this.keylist[y]) {
							this.valid = false;
						}
					}
					/*if (!this.valid) {
					 if (this.args.response !== undefined && this.args.response.match !== undefined) yoodoo.ui.responses.add(this.objectKey, this.args.response.match);
					 } else if (this.args.response !== undefined && this.args.response.nomatch !== undefined) yoodoo.ui.responses.add(this.objectKey, this.args.response.nomatch);

					 yoodoo.ui.responses.call(this.objectKey);*/
					return this.valid;
				};
			},
			orderByValues : function(source, args) {
				this.args = {
					keylist : {
						title : 'The choices to match order',
						type : 'sorterOptions',
						value : {}
					}
				};
				this.keylist = {};
				// {key1:1,key2:0,key3:null}
				yoodoo.ui.rules.standardize(this, source, args);
				if (this.args.keylist.value !== undefined)
					this.keylist = this.args.keylist.value;
				this.valid = true;
				this.processCheck = function() {
					this.valid = true;
					this.objectKey = source.key;
					for (var y in this.source.elements) {
						if (this.source.elements[y].settings.value.value !== this.keylist[y])
							this.valid = false;
					}
					/*if (!this.valid) {
					 if (this.args.response !== undefined && this.args.response.match !== undefined) yoodoo.ui.responses.add(this.objectKey, this.args.response.match);
					 } else if (this.args.response !== undefined && this.args.response.nomatch !== undefined) yoodoo.ui.responses.add(this.objectKey, this.args.response.nomatch);

					 yoodoo.ui.responses.call(this.objectKey);*/
					return this.valid;
				};
			},
			elementPos : function(source, args) {
				this.args = {
					keylist : {
						title : 'The choices to match in a position',
						type : 'sorterOptionPosition',
						value : {}
					}
				};
				this.keylist = {};
				// {key1:1,key2:0,key3:null}
				yoodoo.ui.rules.standardize(this, source, args);
				if (this.args.keylist.value !== undefined)
					this.keylist = this.args.keylist.value;
				this.valid = false;
				this.processCheck = function() {
					this.valid = false;
					this.objectKey = source.key;
					for (var y in this.source.elements) {
						if (this.source.elements[y].key === this.keylist.key) {
							if (this.keylist.pos == y)
								this.valid = true;
						}
					}
					/*if (this.valid) {
					 if (this.args.response !== undefined && this.args.response.match !== undefined) yoodoo.ui.responses.add(this.objectKey, this.args.response.match);
					 } else if (this.args.response !== undefined && this.args.response.nomatch !== undefined) yoodoo.ui.responses.add(this.objectKey, this.args.response.nomatch);

					 yoodoo.ui.responses.call(this.objectKey);*/
					return this.valid;
				};
			}
		},
		text : {
			/*matchingValue: function(source, args) {
			 //this.args = args;
			 this.keylist = {};
			 this.valid = false;
			 //if (this.args.keylist !== undefined) this.keylist = this.args.keylist;
			 yoodoo.ui.rules.standardize(this,source, args);
			 if (this.args.keylist !== undefined) this.keylist = this.args.keylist.value;
			 this.processCheck = function() {
			 this.valid = false;
			 this.objectKey = source.key;
			 for (var t in this.keylist) {
			 if (this.keylist[t] === this.source.value)
			 this.valid = true;
			 }
			 if (this.valid)
			 yoodoo.ui.responses.add(this.objectKey, this.args.response.match);
			 else
			 yoodoo.ui.responses.add(this.objectKey, this.args.response.nomatch);
			 yoodoo.ui.responses.call(this.objectKey);
			 return this.valid;
			 };
			 },*/
			match : function(source, args) {
				this.args = {
					textToMatch : {
						title : 'The text to match',
						type : 'text',
						value : null
					},
					caseInsensitive : {
						title : 'To ignore the case when matching the text',
						type : 'boolean',
						value : true
					},
					matchAll : {
						title : 'Match the whole provided text',
						type : 'boolean',
						value : false
					},
					trim : {
						title : 'Trim any whitespace from the ends of the text before matching',
						type : 'boolean',
						value : true
					}
				};
				yoodoo.ui.rules.standardize(this, source, args);

				if (this.args.textToMatch.value !== null) {
					this.regexp = [];
					if ( typeof (this.args.textToMatch.value) == 'string')
						this.args.textToMatch.value = [this.args.textToMatch.value];
					for (var m in this.args.textToMatch.value) {
						var mods = ['g'];
						if (this.args.caseInsensitive.value)
							mods.push('i');
						var txt = this.args.textToMatch.value[m];
						if (this.args.matchAll.value)
							txt = '^' + txt + '$';
						this.regexp.push(new RegExp(txt, mods.join("")));
					}
				}
				this.processCheck = function() {
					if (this.regexp === undefined)
						return false;
					var txt = this.source.value;
					if (this.args.trim.value)
						txt.replace(/^ +/, '').replace(/ +$/, '');
					for (var r in this.regexp) {
						if (this.regexp[r].test(txt))
							return true;
					}
					return false;
				};
			}
		},
		slider : {
			matchingValue : function(source, args) {

				this.args = {
					keylist : {
						title : 'The values to match',
						type : 'sliderValues',
						value : []
					}
				};
				this.keylist = {};
				this.valid = false;
				yoodoo.ui.rules.standardize(this, source, args);
				if (this.args.keylist !== undefined)
					this.keylist = this.args.keylist.value;
				this.processCheck = function() {
					this.valid = false;
					this.objectKey = source.key;
					for (var v in this.keylist) {
						if (this.keylist[v] === this.source.value)
							this.valid = true;
					}
					/*if (this.valid) {
					 if (this.args.response !== undefined && this.args.response.match !== undefined) yoodoo.ui.responses.add(this.objectKey, this.args.response.match);
					 } else if (this.args.response !== undefined && this.args.response.nomatch !== undefined) yoodoo.ui.responses.add(this.objectKey, this.args.response.nomatch);

					 yoodoo.ui.responses.call(this.objectKey);*/
					return this.valid;
				};
			},
			matchingRange : function(source, args) {
				this.args = {
					keylist : {
						title : 'The values to match',
						type : 'sliderRange',
						value : {}
					}
				};
				this.keylist = {};
				this.valid = false;
				yoodoo.ui.rules.standardize(this, source, args);
				if (this.args.keylist !== undefined)
					this.keylist = this.args.keylist.value;
				this.processCheck = function() {
					this.valid = false;
					this.objectKey = source.key;
					for (var r in this.keylist) {
						if (this.keylist[r].min !== undefined && this.keylist[r].max !== undefined && this.source.value >= this.keylist[r].min && this.source.value <= this.keylist[r].max)
							this.valid = true;
					}
					/*if (this.valid) {
					 if (this.args.response !== undefined && this.args.response.match !== undefined) yoodoo.ui.responses.add(this.objectKey, this.args.response.match);
					 } else if (this.args.response !== undefined && this.args.response.nomatch !== undefined) yoodoo.ui.responses.add(this.objectKey, this.args.response.nomatch);

					 yoodoo.ui.responses.call(this.objectKey);*/
					return this.valid;
				};
			}
		},
		month : {
			matchingValue : function(source, args) {
				this.args = {
					keylist : {
						title : 'The month to match',
						type : 'date',
						value : null
					}
				};
				this.keylist = {};
				this.valid = false;
				yoodoo.ui.rules.standardize(this, source, args);
				if (this.args.keylist !== undefined)
					this.keylist = this.args.keylist.value;
				this.processCheck = function() {
					this.valid = false;
					this.objectKey = source.key;
					for (var val in this.keylist) {
						if (this.keylist[val].value === this.source.value)
							this.valid = true;
					}
					/*if (this.valid) {
					 if (this.args.response !== undefined && this.args.response.match !== undefined) yoodoo.ui.responses.add(this.objectKey, this.args.response.match);
					 } else if (this.args.response !== undefined && this.args.response.nomatch !== undefined) yoodoo.ui.responses.add(this.objectKey, this.args.response.nomatch);
					 yoodoo.ui.responses.call(this.objectKey);*/
					return this.valid;
				};
			},
			matchingRange : function(source, args) {
				this.args = {
					keylist : {
						title : 'The month to match',
						type : 'date',
						value : null
					}
				};
				this.keylist = {};
				this.valid = false;
				yoodoo.ui.rules.standardize(this, source, args);
				if (this.args.keylist.value !== undefined)
					this.keylist = this.args.keylist.value;
				this.processCheck = function() {
					this.valid = false;
					this.objectKey = source.key;
					for (var r in this.keylist) {
						if (this.keylist[r].min !== undefined && this.keylist[r].max !== undefined && this.source.value >= this.keylist[r].min && this.source.value <= this.keylist[r].max)
							this.valid = true;
					}
					/*if (this.valid) {
					 if (this.args.response !== undefined && this.args.response.match !== undefined) yoodoo.ui.responses.add(this.objectKey, this.args.response.match);
					 } else if (this.args.response !== undefined && this.args.response.nomatch !== undefined) yoodoo.ui.responses.add(this.objectKey, this.args.response.nomatch);
					 yoodoo.ui.responses.call(this.objectKey);*/
					return this.valid;
				};
			}
		},
		date : {
			matchingValue : function(source, args) {
				this.args = {
					keylist : {
						title : 'The date to match',
						type : 'date',
						value : null
					}
				};
				this.keylist = {};
				this.valid = false;
				yoodoo.ui.rules.standardize(this, source, args);
				if (this.args.keylist.value !== undefined)
					this.keylist = this.args.keylist.value;
				this.processCheck = function() {
					this.valid = false;
					this.objectKey = source.key;
					for (var val in this.keylist) {
						if (this.keylist[val].value === this.source.value)
							this.valid = true;
					}
					/*if (this.valid) {
					 if (this.args.response !== undefined && this.args.response.match !== undefined) yoodoo.ui.responses.add(this.objectKey, this.args.response.match);
					 } else if (this.args.response !== undefined && this.args.response.nomatch !== undefined) yoodoo.ui.responses.add(this.objectKey, this.args.response.nomatch);
					 yoodoo.ui.responses.call(this.objectKey);*/
					return this.valid;
				};
			},
			matchingRange : function(source, args) {
				this.args = {
					keylist : {
						title : 'The date range to match',
						type : 'date',
						value : null
					}
				};
				this.keylist = {};
				this.valid = false;
				yoodoo.ui.rules.standardize(this, source, args);
				if (this.args.keylist.value !== undefined)
					this.keylist = this.args.keylist.value;
				this.processCheck = function() {
					this.valid = false;
					this.objectKey = source.key;
					for (var r in this.keylist) {
						if (this.keylist[r].min !== undefined && this.keylist[r].max !== undefined && this.source.value >= this.keylist[r].min && this.source.value <= this.keylist[r].max)
							this.valid = true;
					}
					/*if (this.valid) {
					 if (this.args.response !== undefined && this.args.response.match !== undefined) yoodoo.ui.responses.add(this.objectKey, this.args.response.match);
					 } else if (this.args.response !== undefined && this.args.response.nomatch !== undefined) yoodoo.ui.responses.add(this.objectKey, this.args.response.nomatch);
					 yoodoo.ui.responses.call(this.objectKey);*/
					return this.valid;
				};
			}
		},
		checkbox : {
			checkedValue : function(source, args) {
				this.args = {
					keylist : {
						title : 'The checkbox value to match',
						type : 'checkBoxValue',
						value : null
					}
				};
				this.keylist = {};
				this.valid = false;
				if (this.args.keylist !== undefined)
					this.keylist = this.args.keylist;
				yoodoo.ui.rules.standardize(this,source, args);
				this.processCheck = function() {
					this.valid = false;
					this.objectKey = source.key;
					if (this.source.value)
						this.valid = true;

					/*if (this.valid)
					 yoodoo.ui.responses.add(this.objectKey, this.args.response.match);
					 else
					 yoodoo.ui.responses.add(this.objectKey, this.args.response.nomatch);
					 yoodoo.ui.responses.call(this.objectKey);*/
					return this.valid;
				};
			}
		}
	},
	responses : {
		data : {},
		buffer : [],
		showing : false,
		add : function(key, params) {
			//    if (key ==undefined || key ==null) gotta fix this
			this.data[key] = params;
			this.data[key].closeButton = true;
			this.data[key].blockoutClickClose = true;
			if (this.data[key].closedCallback !== undefined) {
				var newClosedCallback = this.data[key].closedCallback;
				this.data[key].closedCallback = function() {
					yoodoo.ui.responses.next();
					newClosedCallback();
				};
			} else {
				this.data[key].closedCallback = function() {
					yoodoo.ui.responses.next();
				};
			}
		},
		next : function() {
			if (this.buffer.length == 0) {
				this.showing = false;
			} else {
				var d = this.buffer.shift();
				d.render();
				this.showing = true;
			}
		},
		call : function(key) {
			if (this.data[key] !== undefined) {
				this.buffer.push(new yoodoo.ui.dialog(this.data[key]));
				this.data[key] = undefined;
			}
			if (this.showing === false)
				this.next();
		}
	},
	validators : {
		text : {
			numeric : function(args) {
				this.minimum = null;
				this.maximum = null;
				this.invalid = null;
				this.type='numeric';
				for (var k in args) {
					if (this[k] !== undefined)
						this[k] = args[k];
				}
				this.pressed = function(e) {
					var kc = yoodoo.keyCode(e);
					var n = e.target.value + kc.character;
					if (kc.period) return false;
					if (kc.numeric && isNaN(n))
						return false;
					if (kc.dash && e.target.value != "")
						return false;
					if (this.minimum !== null && kc.dash && this.minimum >= 0)
						return false;
					if (!isNaN(n)) {
						n = 1 * e.target.value;
						if (this.minimum !== null) {
							if (this.minimum < 0 && n < 0) {
								if (Math.ceil(Math.abs(this.minimum)).toString().length <= Math.ceil(Math.abs(n)).toString().length)
									return false;
							} else if (this.minimum >= 0 && n < 0) {
								return false;
							}
						}
						if (this.maximum !== null && this.maximum < 0 && n >= 0) {
							return false;
						}
					}
					return (kc.numeric || kc.navigate || kc.dash);
				};
				this.valid = function(obj) {
					var n = obj.value;
					if (n == '')
						return true;
					var txt = this.invalid;
					if (isNaN(n))
						return txt;
					n = 1 * n;
					if (this.minimum !== null && n < this.minimum)
						return txt;
					if (this.maximum !== null && n > this.maximum)
						return txt;
					return true;
				};
			},
			decimal : function(args) {
				this.minimum = null;
				this.maximum = null;
				this.invalid = null;
				this.type='decimal';
				this.decimalpoints = null;
				for (var k in args) {
					if (this[k] !== undefined)
						this[k] = args[k];
				}
				this.pressed = function(e) {
					var kc = yoodoo.keyCode(e);
					if (kc.period && e.target.value.match(/\./))
						return false;
					if (kc.period && e.target.value == '')
						return false;
					if (kc.dash && e.target.value != "")
						return false;
					if (this.minimum !== null && kc.dash && this.minimum >= 0)
						return false;
					if (this.decimalpoints !== null && this.decimalpoints >= 0 && e.target.value.match(/\./)) {
						var parts = e.target.value.split('.');
						if (parts.length == 2 && parts[1].length >= this.decimalpoints)
							return false;
					}
					var n = e.target.value + kc.character;
					if (kc.numeric && isNaN(n))
						return false;
					if (kc.dash && e.target.value != "")
						return false;
					if (!isNaN(n)) {
						n = 1 * e.target.value;
						if (this.minimum !== null) {
							if (this.minimum < 0 && n < 0) {
								if (Math.ceil(Math.abs(this.minimum)).toString().length <= Math.ceil(Math.abs(n)).toString().length)
									return false;
							} else if (this.minimum >= 0 && n < 0) {
								return false;
							}
						}
						if (this.maximum !== null && this.maximum < 0 && n >= 0) {
							return false;
						}
					}
					return (kc.numeric || kc.navigate || kc.dash);
				};
				this.valid = function(obj) {
					var n = obj.value;
					if (n == '')
						return true;
					var txt = this.invalid;
					if (isNaN(n))
						return txt;
					n = 1 * n;
					if (this.minimum !== null && n < this.minimum)
						return txt;
					if (this.maximum !== null && n > this.maximum)
						return txt;
					return true;
				};
			}
		},
		password : {
			minsecure : function(args) {
				this.minlength = null;
				this.invalid = null;
				for (var k in args) {
					if (this[k] !== undefined)
						this[k] = args[k];
				}
				this.pressed = function(e) {
					var kc = yoodoo.keyCode(e);
					return true;
				};
				this.valid = function(obj) {
					var n = obj.value;
					if (n == '')
						return true;
					var txt = this.invalid;
					var ok = true;
					if (this.minlength !== null && n.length < this.minlength)
						return txt;
					return true;
				};
			}
		}
	},
	tagrules : {
		standardBuild : function(obj, params) {
			for (var k in params) {
				if (obj.params[k] !== undefined)
					obj.params[k].value = params[k];
			}
		},
		text : {
			matcher : function(ui, params) {
				this.params = {
					textToMatch : {
						title : 'The text to match',
						type : 'text',
						value : null
					},
					caseInsensitive : {
						title : 'To ignore the case when matching the text',
						type : 'boolean',
						value : true
					},
					matchAll : {
						title : 'Match the whole provided text',
						type : 'boolean',
						value : false
					},
					trim : {
						title : 'Trim any whitespace from the ends of the text before matching',
						type : 'boolean',
						value : true
					},
					addTags : {
						title : 'The tags to add to the user when the match is found',
						type : 'array',
						value : []
					},
					removeTags : {
						title : 'The tags to add to the user when the match is found',
						type : 'array',
						value : []
					}
				};
				this.ui = ui;
				yoodoo.ui.tagrules.standardBuild(this, params);
				if (this.params.textToMatch.value !== null) {
					var mods = ['g'];
					if (this.params.caseInsensitive.value)
						mods.push('i');
					var txt = this.params.textToMatch.value;
					if (this.params.matchAll.value)
						txt = '^' + txt + '$';
					this.regexp = new RegExp(txt, mods.join(""));
				}
				this.process = function() {
					if (this.regexp === undefined)
						return false;
					var txt = this.ui.value;
					if (this.params.trim.value)
						txt.replace(/^ +/, '').replace(/ +$/, '');
					if (this.regexp.test(txt)) {
						for (var t in this.params.addTags.value)
						dooit.addTag(this.params.addTags.value[t]);
						for (var t in this.params.removeTags.value)
						dooit.removeTag(this.params.removeTags.value[t]);
					}
				};
			}
		}
	},
	behaviours : {
		swipe : function(target, params) {
			target.swipe = {
				currentIndex : 0,
				settings : {
					scrolled : {
						title : 'The target uses scrolling (requires sub-element to contain all items) - detected true if target is not position:relative',
						type : 'boolean',
						value : false
					},
					persistent : {
						title : 'Continue to scroll with speed (not with snap)',
						type : 'boolean',
						value : true
					},
					persistentFriction : {
						title : 'Reduce the speed by % per second',
						type : 'int',
						value : 95
					},
					persistentStopLimit : {
						title : 'The pixels per second limit for persistence',
						type : 'int',
						value : 50
					},
					snapToChildren : {
						title : 'Snap to a child element',
						type : 'boolean',
						value : true
					},
					snapChildrenToLeft : {
						title : 'When snap is on, the pages will snap to the center. This option will make the child snap to the left of the display',
						type : 'boolean',
						value : false
					},
					swipeCallback : {
						title : 'Callback on swipe event',
						type : 'function',
						value : function(direction) {
						}
					},
					swipeMinX : {
						title : 'The minimum x swipe for a swipe to be registered',
						type : 'integer',
						value : 70
					},
					detectSwipeMinX : {
						title : 'The minimum x swipe for a swipe to animate',
						type : 'integer',
						value : 10
					},
					swipeMaxY : {
						title : 'The maximum y movement to validate the swipe',
						type : 'integer',
						value : 70
					},
					canChange : {
						title : 'Allow the change item',
						type : 'boolean',
						value : function() {
							return true;
						}
					},
					canNext : {
						title : 'Allow the next item',
						type : 'boolean',
						value : function() {
							return true;
						}
					},
					canBack : {
						title : 'Allow the previous item',
						type : 'boolean',
						value : function() {
							return true;
						}
					},
					onlyToNeighbour : {
						title : 'Only allow the item to be moved by one',
						type : 'boolean',
						value : false
					}
				},
				target : null,
				setPage : function(i, noAnimation, callback) {
					var complete = function() {
					};
					if ( typeof (callback) == 'function')
						complete = callback;
					this.target.currentIndex = i;
					var kids = $(this.target).find('>*');
					var newItem = kids.get(this.target.currentIndex);
					var sx = $(newItem).position().left + (this.settings.snapChildrenToLeft.value ? 0 : (($(newItem).outerWidth() / 2) - ($(newItem).parent().width() / 2)));
					//var lastItem=kids.last();
					//var panelWidth=lastItem.offset().left-kids.first().offset().left+lastItem.width();
					//if (panelWidth-sx<$(newItem).parent().parent().width()) sx=panelWidth-$(newItem).parent().parent().width();
					var lastItem = kids.last();
					var panelWidth = lastItem.offset().left - kids.first().offset().left + lastItem.width();
					var pagesWidth = $(newItem).parent().parent().width();
					if (this.settings.snapChildrenToLeft.value && panelWidth >= pagesWidth && panelWidth - sx < pagesWidth)
						sx = panelWidth - pagesWidth;

					if (noAnimation) {
						$(this.target).css({
							left : -sx
						});
						complete();
					} else {
						$(this.target).animate({
							left : -sx
						}, 300, complete);
					}
				},
				build : function(target, params) {
					this.target = target;
					//if ($(this.target).css('position')="relative") params.scrolled=true;
					for (var k in params) {
						if (this.settings[k] !== undefined)
							this.settings[k].value = params[k];
					}
					this.target.currentIndex = 0;

					$(this.target).addClass('yoodooUI_swipe').unbind('touchstart mousedown').bind('touchstart mousedown', function(e) {
						if (this.persistTimeout !== undefined) {
							clearTimeout(this.persistTimeout);
							this.persistTimeout = undefined;
						}
						var cursor = (e.type == 'touchstart') ? e.originalEvent.changedTouches[0] : e;
						if (this.swipe.settings.scrolled.value && cursor.target === this)
							return true;
						var parentPageObject = yoodoo.parentOfType(e.target, ['.yoodooUI_swipe']);
						if ($(this).hasClass("yoodooUI_swipe") && parentPageObject !== this)
							return false;
						var target = yoodoo.parentOfType(e.target, ['.ui-sortable', '.ui-draggable']);
						var input = yoodoo.parentOfType(e.target, ['select', 'input']);
						this.scroller = yoodoo.parentWithScroll(e.target);
						if (this.scroller !== false)
							this.scroller.scrollTopOrigin = this.scroller.scrollTop;
						if (target !== false)
							return true;
						if (/*e.type == 'mousedown' &&*/input !== false)
							return true;
						e.preventDefault();
						this.lastpos = undefined;
						this.currentpos = undefined;
						$(this).finish();
						if (this.originalPosition === undefined) {
							this.originalPosition = {
								left : this.swipe.settings.scrolled.value ? -this.scrollLeft : parseInt($(this).css('left').replace(/px/, '')),
								x : cursor.pageX,
								y : cursor.pageY,
								time : new Date().getTime()
							};
							this.lastpos = this.originalPosition;
						}
						this.returnPosition = {
							left : this.swipe.settings.scrolled.value ? -this.scrollLeft : parseInt($(this).css('left').replace(/px/, '')),
							x : cursor.pageX,
							y : cursor.pageY,
							time : new Date().getTime()
						};
						this.speed = 0;
						var minx = Number.MAX_VALUE;
						var minIndex = 0;
						var kids = $(this).find((this.swipe.settings.scrolled.value ? '>*>*' : '>*'));
						var l = $(this).offset().left;
						var ol = this.originalPosition.left;
						kids.each(function(i, e) {
							var dl = $(e).offset().left - l;
							if (Math.abs(dl + ol) < minx) {
								minx = Math.abs(dl + ol);
								minIndex = i;
							}
						});
						//this.currentIndex = minIndex;
						var moveEvent = (e.type == 'touchstart') ? 'touchmove' : 'mousemove';
						$(this).unbind(moveEvent).bind(moveEvent, function(e) {
							var cursor = (e.type == 'touchmove') ? e.originalEvent.changedTouches[0] : e;
							this.currentpos = {
								x : cursor.pageX,
								y : cursor.pageY,
								time : new Date().getTime()
							};
							if (this.currentpos !== undefined) {
								this.lastpos = {
									x : this.currentpos.x,
									y : this.currentpos.y,
									time : this.currentpos.time
								};
							} else {
								this.lastpos = {
									x : this.originalPosition.x,
									y : this.originalPosition.y,
									time : this.originalPosition.time
								};
							}
							var dx = this.currentpos.x - this.returnPosition.x;
							var dt = this.currentpos.time - this.returnPosition.time;
							this.speed = dx / (dt / 1000);
							var dy = this.currentpos.y - this.returnPosition.y;
							var ox = Math.abs(this.currentpos.x - this.originalPosition.x);
							var oy = Math.abs(this.currentpos.y - this.originalPosition.y);
							if (this.swipe.settings.scrolled.value) {
								if (ox > this.swipe.settings.detectSwipeMinX.value && ox > oy) {
									this.scrollLeft = -(this.originalPosition.left + dx);
								} else {
									this.scrollLeft = -(this.returnPosition.left);
								}
							} else {
								if (ox > this.swipe.settings.detectSwipeMinX.value && ox > oy) {
									$(this).css({
										left : this.originalPosition.left + dx
									});
								} else {
									$(this).css({
										left : this.returnPosition.left
									});
								}
							}
							if (this.scroller !== false)
								this.scroller.scrollTop = this.scroller.scrollTopOrigin - dy;

						});
						this.preventClick=false;
						var endEvent = (e.type == 'touchstart') ? 'touchend' : 'mouseup mouseleave';
						$(this).unbind(endEvent).bind(endEvent, function(e) {
							$(this).unbind('touchmove touchend mousemove mouseup mouseleave');
							var settings = this.swipe.settings;
							e.preventDefault();
							var cursor = (e.type == 'touchend') ? e.originalEvent.changedTouches[0] : e;
							var dx = (this.currentpos === undefined) ? 0 : this.currentpos.x - this.returnPosition.x;
							var dy = (this.currentpos === undefined) ? 0 : this.currentpos.y - this.returnPosition.y;
							var target = yoodoo.parentOfType(e.target, ['a', 'button']);
							var input = yoodoo.parentOfType(e.target, ['input', 'select', 'select', 'textarea', 'label']);
							var panelLeft = $(this.parentNode).offset().left;
							var halfPanelWidth = Math.floor($(settings.scrolled.value ? this : this.parentNode).width() / 2);
							//if (Math.abs(dx) > Math.abs(dy)) {
							this.preventClick=(Math.abs(dx) > 20 || Math.abs(dy) > 20);
							var nearest = {
								i : null,
								x : null,
								o : null
							};
							if (Math.abs(dx) > settings.swipeMinX.value && Math.abs(dy) < settings.swipeMaxY.value) {
								this.preventClick=true;
								//if (e.type != 'touchend') {
									if (target !== false) {
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
								//}
								var dt = new Date().getTime() - this.currentpos.time;
								if (dt > 50)
									this.speed = 0;
								var l = $(settings.scrolled.value ? $(this).find('>*') : this).offset().left;
								var left = this.returnPosition.left + dx;
								var me = this;
								if (settings.snapToChildren.value) {
									var kids = $(this).find((settings.scrolled.value ? '>*>*' : '>*'));
									if (!this.swipe.settings.onlyToNeighbour.value) {
										var panelCenter = $(this.parentNode).offset().left + (settings.snapChildrenToLeft.value ? 0 : halfPanelWidth);
										var posX = 0;
										kids.each(function(i, e) {
											var ew = $(e).outerWidth(true);
											if (e.disabled !== true) {
												var center = $(e).offset().left + (settings.snapChildrenToLeft.value ? 0 : (ew / 2));
												var panelOffset = $(e).offset().left - l;
												var dl = panelCenter - center;
												if (nearest.x === null || Math.abs(nearest.x) > Math.abs(dl)) {
													nearest = {
														x : dl,
														o : e,
														i : i,
														sx : panelOffset + (settings.snapChildrenToLeft.value ? 0 : (ew / 2) - halfPanelWidth)
													};
												}
											}
											posX += ew;
										});
									}
								}
								//console.log(nearest,me.originalPosition.left);
								if (settings.scrolled.value !== true && (settings.onlyToNeighbour.value || me.originalPosition.left == -nearest.sx)) {
									var newIndex = this.currentIndex + ((dx > 0) ? -1 : 1);
									if (newIndex < 0)
										newIndex = 0;
									if (newIndex >= kids.get().length)
										newIndex = kids.get().length - 1;
									var newItem = kids.get(newIndex);
									while (newItem.disabled === true) {
										newIndex = newIndex + ((dx > 0) ? -1 : 1);
										if (newIndex < 0)
											newIndex = this.currentIndex;
										if (newIndex >= kids.get().length)
											newIndex = this.currentIndex;
										newItem = kids.get(newIndex);
										if (newIndex === this.currentIndex)
											break;
									}
									nearest = {
										x : $(newItem).offset().left - l,
										o : newItem,
										i : newIndex,
										sx : $(newItem).position().left + (settings.snapChildrenToLeft.value ? 0 : (($(newItem).outerWidth(true) / 2) - ($(newItem).parent().outerWidth(true) / 2)))
									};

								}
							}
								//console.log(nearest,me.originalPosition.left);
								var direction = (dx > 0) ? 'right' : 'left';
								if (this.swipe.settings.canNext.value() !== true && direction == 'left')
									nearest.o = null;
								if (this.swipe.settings.canBack.value() !== true && direction == 'right')
									nearest.o = null;

								this.currentIndex = nearest.i;
								if (nearest.o !== null && this.swipe.settings.canChange.value(direction, nearest.i)) {
									//console.log($(nearest.o).position().left,nearest.sx,$(nearest.o).position().left + (settings.snapChildrenToLeft.value?0:(($(nearest.o).outerWidth(true) / 2) - ($(nearest.o).parent().outerWidth(true) / 2))));
									//if ($(newItem).parent().outerWidth(true)-nearest.sx<$(newItem).parent().parent().width()) nearest.sx=$(newItem).parent().outerWidth(true)-$(newItem).parent().parent().width();

									var lastItem = kids.last();
									var panelWidth = lastItem.offset().left - kids.first().offset().left + lastItem.width();
									var pagesWidth = $(nearest.o).parent().parent().width();
									if (settings.snapChildrenToLeft.value && panelWidth >= pagesWidth && panelWidth - nearest.sx < pagesWidth)
										nearest.sx = panelWidth - pagesWidth;
									//console.log(panelWidth,nearest.sx,pagesWidth);

									this.originalPosition.left = -nearest.x;
									var css = {};
									if (settings.scrolled.value) {
										css.scrollLeft = nearest.sx;
									} else {
										css.left = -nearest.sx;
									}
									$(this).animate(css, {
										duration : 300,
										easing : 'easeOutBack',
										complete : function() {
											this.originalPosition = undefined;
										}
									});
									this.swipe.settings.swipeCallback.value(direction, nearest.i);
								} else if (settings.snapToChildren.value) {
									var css = {};
									if (settings.scrolled.value) {
										css.scrollLeft = -this.originalPosition.left;
									} else {
										css.left = this.originalPosition.left;
									}
									$(this).animate(css, 300, function() {
										this.originalPosition = undefined;
									});
								} else {
									if (settings.persistent.value) {
										this.persistentTimestamp = new Date().getTime();
										this.persistLeft = this.swipe.settings.scrolled.value ? -this.scrollLeft : parseInt($(this).css('left').replace(/px/, ''));
										this.minLeft = 0;
										this.maxLeft = this.swipe.settings.scrolled.value ? $(this).find('>*').width() - $(this).width() : $(this).width() - $(this).parent().width();
										this.processPersistence = function() {
											var now = new Date().getTime();
											var dt = (now - this.persistentTimestamp) / 1000;
											this.persistentTimestamp = now;
											var f = this.swipe.settings.persistentFriction.value * dt;
											this.speed -= (this.speed * f / 100);
											this.persistLeft += dt * this.speed;
											if (this.swipe.settings.scrolled.value) {
												this.scrollLeft = -this.persistLeft;
												if (-this.persistLeft < this.minLeft || -this.persistLeft > this.maxLeft)
													this.speed = 0;
											} else {
												$(this).css({
													left : this.persistLeft
												});
												if (-this.persistLeft < this.minLeft || -this.persistLeft > this.maxLeft)
													this.speed = 0;
											}
											if (Math.abs(this.speed) > this.swipe.settings.persistentStopLimit.value) {
												var me = this;
												this.persistTimeout = setTimeout(function() {
													me.processPersistence();
												}, 20);
											} else {
												this.persistTimeout = undefined;
											}
										};
										var me = this;
										this.persistTimeout = setTimeout(function() {
											me.processPersistence();
										}, 20);
									}
									this.originalPosition = undefined;
								}
							//}
							if (this.preventClick!==true) {
								if (target !== false && e.type == 'touchend')
									$(target).click();
								if (input !== false)
									$(input).focus();

								/*var css = {};
								if (settings.scrolled.value) {
									css.scrollLeft = -this.originalPosition.left;
								} else {
									css.left = this.originalPosition.left;
								}
								$(this).animate(css, 300, function() {
									this.originalPosition = undefined;
								});*/
							}
						});
					});
				}
			};
			target.swipe.build(target, params);
		}
	},
	graphs : {
		ring : function(params) {
			this.container = $(yoodoo.e("div")).addClass('yoodooUI_ring');
			this.svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
			this.padding = 5;
			this.unit = '%';
			this.max =100;
			this.label = $(yoodoo.e("div"));
			this.background = document.createElementNS("http://www.w3.org/2000/svg", "path");
			this.bar = document.createElementNS("http://www.w3.org/2000/svg", "path");
			this.outerRadius = 30;
			this.innerRadius = 20;
			this.value=0;
			this.backgroundColour =  {
				r : 220,
				g : 220,
				b : 220
			};
			this.backgroundStroke =  {
				colour:{
					r : 180,
					g : 180,
					b : 180
				},
				width:1
			};
			this.colours =  {
				low : {
					r : 62,
					g : 135,
					b : 187
				},
				high : {
					r : 156,
					g : 23,
					b : 55
				}
			};

			if ( typeof (params) != "undefined")
				for (var k in params)
				this[k] = params[k];

			$(this.svg).attr("width", (this.outerRadius + this.padding) * 2).attr("height", (this.outerRadius + this.padding) * 2);
			this.center = (this.outerRadius + this.padding);
			var r=this.outerRadius;
			var c=this.center;
			var ring='M '+c+','+c+' m -'+r+',0 a '+r+','+r+' 0 1,0 '+(r*2)+',0 a '+r+','+r+' 0 1,0 -'+(r*2)+',0 z ';
			r=this.innerRadius;
			ring+='M '+c+','+c+' m -'+r+',0 a '+r+','+r+' 0 1,0 '+(r*2)+',0 a '+r+','+r+' 0 1,0 -'+(r*2)+',0 z';
			var style="fill:"+yoodooStyler.rgbToHex(this.backgroundColour)+";";
			if (this.backgroundStroke!==null && this.backgroundStroke.colour!==undefined) {
				style+="stroke: "+yoodooStyler.rgbToHex(this.backgroundStroke.colour)+";";
				if (!isNaN(this.backgroundStroke.width!==undefined)) {
					style+="stroke-width: "+this.backgroundStroke.width+";";
				}else{
					style+="stroke-width: 1;";
				}
			}
			this.container.append(
				$(this.svg).append(
					$(this.background).attr("d",ring).attr("style", style).attr("fill-rule","evenodd")
				).append(
					this.bar
				)
			).append(this.label);
			this.setValue=function(v) {
				this.label.html(v+this.unit);
				if (this.value!=v) {
					this.value=v;
					this.animateValue(this.value);
				}else{
					this.drawValue(this.value);
				}
			};
			this.animateValue=function(v) {
				if (typeof(v)!="undefined") {
					this.targetvalue=v;
				}
				if (this.actual===undefined) this.actual=0;
				var dv=(this.targetvalue-this.actual)/2;
				if (Math.abs(dv)<1) {
					this.actual=this.targetvalue;
					this.drawValue(this.actual);
				}else{
					this.actual+=dv;
					this.drawValue(this.actual);
					var me=this;
					this.timer=setTimeout(function() {
						if (me.container.get(0).parentNode!=null) me.animateValue();
					},30);
				}
			};
			this.drawValue=function(v) {
				if (v>this.max) this.max=this.value;
				var colour=yoodooStyler.fromTo(this.colours.low,this.colours.high,v/this.max);
				var a=(v/this.max)*(2*Math.PI);
				var or=this.outerRadius;
				var ir=this.innerRadius;
				var c=this.center;
				var dir='0,1';
				var insidedir='0,0';
				if (a>Math.PI) {
					dir='1,1';
					insidedir='1,0';
				}
				//console.log(v,this.max);
				if (v==this.max) {
					$(this.bar).attr("d",$(this.background).attr("d")).attr('fill-rule','evenodd');
				}else{
					$(this.bar).attr("d","M "+this.xy(0,or)+" A"+or+","+or+" 0 "+dir+" "+this.xy(a,or)+" L"+this.xy(a,ir)+" A"+ir+","+ir+" 0 "+insidedir+" "+this.xy(0,ir)+" L"+this.xy(0,or)+" Z").attr('fill-rule','');
				}
				$(this.bar).attr("style",
					'fill:'+yoodooStyler.rgbToHex(colour)
				);
			};
			this.render = function(val) {
				if ( typeof (val) != "undefined")
					this.setValue(val);
				return this.container;
			};
			this.xy=function(a,r) {
				var x=this.center+(r*Math.sin(a));
				var y=this.center-(r*Math.cos(a));
				return x.toFixed(1)+','+y.toFixed(1);
			};
		},
		dial : function(params) {
			this.balanced = 100;
			this.container = $(yoodoo.e("div")).addClass('yoodooUI_dial');
			this.svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
			this.padding = 5;
			this.unit = '';
			this.markBalance=true;
			this.targetValue=null;
			this.outerRadius = 30;
			this.innerRadius = 20;
			this.tolerance = null;
			this.colours = {
				low : {
					r : 62,
					g : 135,
					b : 187
				},
				mid : {
					r : 51,
					g : 153,
					b : 51
				},
				midabove:null,
				high : {
					r : 156,
					g : 23,
					b : 55
				}
			};
			this.totalAngle = 270;
			if ( typeof (params) != "undefined")
				for (var k in params)
				this[k] = params[k];
			if (this.tolerance===null) this.tolerance=this.balanced;
			$(this.svg).attr("width", (this.outerRadius + this.padding) * 2).attr("height", (this.outerRadius + this.padding) * 2);
			this.center = (this.outerRadius + this.padding);
			this.value = this.balanced;
			this.targetvalue = this.balanced;
			this.startAngle = -this.totalAngle / 2;
			this.finishAngle = this.totalAngle / 2;
			this.colour = {
				r : this.colours.mid.r,
				g : this.colours.mid.g,
				b : this.colours.mid.b
			};
			if (this.colours.midabove===undefined || this.colours.midabove===null) {
				this.colours.midabove={
					r:this.colours.mid.r,
					g:this.colours.mid.g,
					b:this.colours.mid.b
				};
			}
			this.setValue = function(v,col) {
				this.value = v;
				if (Math.abs(this.balanced-this.value)>this.tolerance) this.tolerance=Math.abs(this.balanced-this.value);
				var targetDelta=0;
				if (this.targetValue!==null) {
					if (Math.abs(this.balanced-this.targetValue)>this.tolerance) this.tolerance=1.2*Math.abs(this.balanced-this.targetValue);
					if (this.targetValue <= this.balanced) {
						var p = (this.targetValue-(this.balanced-this.tolerance)) / this.tolerance;
						if (p < 0)
							p = 0;
						targetDelta = this.startAngle + (p * (this.totalAngle / 2));
					} else {
						var p = (this.targetValue - this.balanced) / this.tolerance;
						if (p > 1)
							p = 1;
						targetDelta = (p * (this.totalAngle / 2));
					}
				}
				var a = 0;
				if (this.value <= this.balanced) {
					var p = (this.value-(this.balanced-this.tolerance)) / this.tolerance;
					if (p < 0)
						p = 0;
					a = this.startAngle + (p * (this.totalAngle / 2));
					if (col!==undefined && col !== null) {
						this.setColour(col);
					}else{
						this.setColour(yoodooStyler.fromTo(this.colours.low, this.colours.mid, p));
					}
				} else {
					var p = (this.value - this.balanced) / this.tolerance;
					if (p > 1)
						p = 1;
					a = (p * (this.totalAngle / 2));
					if (col!==undefined && col !== null) {
						this.setColour(col);
					}else{
						this.setColour(yoodooStyler.fromTo(this.colours.midabove, this.colours.high, p));
					}
				}
				this.needle.setAngle(a);
				if (this.targetValue!==null) {
					this.targetMark.setAngle(targetDelta);
				}
				this.label.html(this.value+this.unit);
			};
			this.targetMarkObject = function(dial) {
				this.dial = dial;
				this.svg = document.createElementNS("http://www.w3.org/2000/svg", "g");
				this.mark = document.createElementNS("http://www.w3.org/2000/svg", "path");
				this.colour = {
					r:49,
					g:147,
					b:49
				};
				var or = this.dial.outerRadius;
				var ir = this.dial.innerRadius;
				var arrow = 5;
				$(this.mark).attr("d","M0,-"+ir+" L0,-"+or+" L-"+arrow+",-"+(or+arrow)+" L"+arrow+",-"+(or+arrow)+" L0,-"+or+" L0,-"+ir+" L"+arrow+",-"+(ir-arrow)+" L-"+arrow+",-"+(ir-arrow)+" Z").
					attr("style","stroke:#"+yoodooStyler.rgbToHex(this.colour)+";fill:"+yoodooStyler.rgbToHex(this.colour)+";stroke-width:1;");
				$(this.svg).append(this.mark);
				this.render = function() {
					return this.svg;
				};
				this.setAngle = function(a) {
					$(this.svg).attr("transform", "rotate(" + a + "," + this.dial.center + ',' + this.dial.center + "),translate(" + this.dial.center + ',' + this.dial.center + ")");
				};
			};
			this.needleObject = function(dial, angle) {
				this.dial = dial;
				this.angle = ( typeof (angle) != "undefined") ? 1*angle : 0;
				this.targetAngle = 1*this.angle;
				this.accurateAngle = 1*this.angle;
				this.stepAngle = 0;
				this.animate = {
					time : 50,
					steps : 10
				};
				this.timer = null;
				this.svg = document.createElementNS("http://www.w3.org/2000/svg", "g");
				this.needle = document.createElementNS("http://www.w3.org/2000/svg", "path");
				var ld = this.dial.outerRadius;
				var sd = ld / 8;
				$(this.needle).attr("d", "M" + sd + ",0 L0,-" + ld + " L-" + sd + ",0 L0," + sd + " Z");
				$(this.needle).attr("style", "fill:#FFFFFF;stroke: #555555; stroke-width:1");
				$(this.svg).append(this.needle).attr("transform", "rotate(" + this.angle + "," + this.dial.center + ',' + this.dial.center + "),translate(" + this.dial.center + ',' + this.dial.center + ")");
				this.render = function() {
					return this.svg;
				};
				this.setAngle = function(a) {
					this.targetAngle = a;
					this.stepAngle = (this.targetAngle - this.angle) / this.animate.steps;
					this.accurateAngle = this.angle;
					if (this.timer !== null)
						clearTimeout(this.timer);
					this.animateAngle();
				};
				this.animateAngle = function() {
					this.accurateAngle += (1*this.stepAngle);
					this.angle = 1*this.accurateAngle.toFixed(1);
					if (Math.abs(this.targetAngle - this.angle) < 2) {
						this.angle = this.targetAngle;
						$(this.svg).attr("transform", "rotate(" + this.angle + "," + this.dial.center + ',' + this.dial.center + "),translate(" + this.dial.center + ',' + this.dial.center + ")");
						clearTimeout(this.timer);
					} else {
						$(this.svg).attr("transform", "rotate(" + this.angle + "," + this.dial.center + ',' + this.dial.center + "),translate(" + this.dial.center + ',' + this.dial.center + ")");
						var me = this;
						this.timer = setTimeout(function() {
							me.animateAngle();
						}, this.animate.time);
					}
				};
			};
			this.segment = function(dial, angleStart, angleFinish, largerRadius, lightness, brightness) {
				this.dial = dial;
				this.lightness = lightness;
				this.brightness = brightness;
				this.colour = {
					r : 255,
					g : 255,
					b : 255
				};
				this.accurateColour = {
					r : 255,
					g : 255,
					b : 255
				};
				this.stepColour = {
					r : 0,
					g : 0,
					b : 0
				};
				this.targetColour = {
					r : 100,
					g : 100,
					b : 100
				};
				this.animate = {
					time : 50,
					steps : 10
				};
				this.timer = null;

				this.largerRadius = largerRadius;
				var r2 = (this.dial.outerRadius - this.dial.innerRadius) / 2;
				this.rIn = this.dial.innerRadius;
				this.rOut = this.rIn + r2;
				if (this.largerRadius) {
					this.rIn = this.dial.innerRadius + r2;
					this.rOut = this.dial.outerRadius;
				}

				this.angles = [Math.PI * angleStart / 180, Math.PI * angleFinish / 180];
				this.svg = document.createElementNS("http://www.w3.org/2000/svg", "path");
				this.render = function() {

					var dir = '0,' + ((this.angles[1] > this.angles[0]) ? '0' : '1');
					var insidedir = '0,' + ((this.angles[1] < this.angles[0]) ? '0' : '1');

					var d = 'M' + this.xy(this.angles[0], this.rIn) + ' A' + this.rIn + ',' + this.rIn + ' 0 ' + insidedir + ' ' + this.xy(this.angles[1], this.rIn);
					d += ' L' + this.xy(this.angles[1], this.rOut);
					d += ' L' + this.xy(this.angles[1], this.rOut) + ' A' + this.rOut + ',' + this.rOut + ' 0 ' + dir + ' ' + this.xy(this.angles[0], this.rOut);
					d += ' Z';
					$(this.svg).attr("d", d);
					$(this.svg).attr('style', "stroke: " + yoodooStyler.rgbToHex(this.colour) + "; stroke-width:1; fill:" + yoodooStyler.rgbToHex(this.colour) + ";");
					return this.svg;
				};
				this.setColour = function(col) {
					this.accurateColour = {
						r : this.colour.r,
						g : this.colour.g,
						b : this.colour.b
					};
					this.targetColour = yoodooStyler.tint(col, this.lightness, this.brightness);
					this.stepColour = {
						r : (this.targetColour.r - this.colour.r) / this.animate.steps,
						g : (this.targetColour.g - this.colour.g) / this.animate.steps,
						b : (this.targetColour.b - this.colour.b) / this.animate.steps
					};
					if (this.timer !== null)
						clearTimeout(this.timer);
					this.animateColour();
				};
				this.animateColour = function() {
					var me = this;
					this.accurateColour.r += this.stepColour.r;
					this.accurateColour.g += this.stepColour.g;
					this.accurateColour.b += this.stepColour.b;
					if (Math.abs(this.targetColour.r - this.accurateColour.r) < 2 && Math.abs(this.targetColour.g - this.accurateColour.g) < 2 && Math.abs(this.targetColour.b - this.accurateColour.b) < 2) {
						this.colour = {
							r : this.targetColour.r,
							g : this.targetColour.g,
							b : this.targetColour.b
						};
						this.accurateColour = {
							r : this.colour.r,
							g : this.colour.g,
							b : this.colour.b
						};
						$(this.svg).attr('style', "stroke: " + yoodooStyler.rgbToHex(this.colour) + "; stroke-width:1; fill:" + yoodooStyler.rgbToHex(this.colour) + ";");
						this.timer = null;
					} else {

						this.colour = {
							r : Math.round(this.accurateColour.r),
							g : Math.round(this.accurateColour.g),
							b : Math.round(this.accurateColour.b)
						};
						$(this.svg).attr('style', "stroke: " + yoodooStyler.rgbToHex(this.colour) + "; stroke-width:1; fill:" + yoodooStyler.rgbToHex(this.colour) + ";");
						this.timer = setTimeout(function() {
							me.animateColour();
						}, this.animate.time);
					}
				};
				this.xy = function(a, r) {
					while (a < 0)
					a += (2 * Math.PI);
					while (a > (2 * Math.PI))
					a -= (2 * Math.PI);
					var x = this.dial.center + (r * Math.sin(a));
					var y = this.dial.center - (r * Math.cos(a));
					return x.toFixed(1) + ',' + y.toFixed(1);
				};
			};
			var segAngle = this.totalAngle / 3;
			this.targetMark=new this.targetMarkObject(this);
			this.segments = [new this.segment(this, this.startAngle, this.startAngle + segAngle, true, -0.2, 0), new this.segment(this, this.startAngle, this.startAngle + segAngle, false, -0.2, 0.2), new this.segment(this, this.startAngle + segAngle, this.finishAngle - segAngle, true, 0, 0), new this.segment(this, this.startAngle + segAngle, this.finishAngle - segAngle, false, 0, 0.2), new this.segment(this, this.finishAngle - segAngle, this.finishAngle, true, 0.2, 0), new this.segment(this, this.finishAngle - segAngle, this.finishAngle, false, 0.2, 0.2)];
			this.needle = new this.needleObject(this);
			for (var s in this.segments) {
				$(this.svg).append(this.segments[s].render());
			}
			if (this.targetValue!==null) {
				$(this.svg).append(this.targetMark.render());
			}
			if (this.markBalance) {
				this.centerMark = document.createElementNS("http://www.w3.org/2000/svg", "path");
				$(this.svg).append(
					$(this.centerMark).attr('style', "stroke: #FFFFFF; stroke-width:2; fill:none;").attr("d",
						"M"+this.center+","+(this.center-this.innerRadius)+"L"+this.center+","+(this.center-this.outerRadius)
					)
				);

			}
			this.label = $(yoodoo.e("div")).html(this.value).css({
				width : '100%',
				'text-align' : 'center',
				bottom : 0,
				left : 0,
				position : 'absolute'
			});
			$(this.container).append($(this.svg).append(this.needle.render())).css({
				width : 2 * (this.outerRadius + this.padding),
				height : 2 * (this.outerRadius + this.padding),
				position : 'relative'
			}).append(this.label);
			this.render = function(val,col) {
				if ( typeof (val) != "undefined")
					this.setValue(val,col);
				return this.container;
			};
			this.setColour = function(rgb) {
				for (var s in this.segments) {
					this.segments[s].setColour(rgb);
				}
			};
		},
		linegraph : function(params) {
			this.width = null;
			this.widthOverride = null;
			this.height = 200;
			this.framecolour={
				r:200,
				g:200,
				b:200
			};
			this.linecolour={
				r:100,
				g:100,
				b:100
			};
			this.linewidth=1;
			this.threshold={
				y:null,
				colour:{
					r:100,
					g:100,
					b:200
				},
				stroke:1
			};
			this.dots={
				show:true,
				colour:{
					r:100,
					g:100,
					b:100
				},
				thresholdabovecolour:{
					r:100,
					g:200,
					b:100
				},
				thresholdbelowcolour:{
					r:200,
					g:100,
					b:100
				},
				stroke:1,
				strokecolour:{
					r:100,
					g:100,
					b:100
				},
				thresholdabovestrokecolour:{
					r:255,
					g:255,
					b:255
				},
				thresholdbelowstrokecolour:{
					r:255,
					g:255,
					b:255
				},
				radius:3
			};
			this.padding=10;
			this.axis={
				x:{
					width:null,
					labels:true, // false if data has a label at all
					min:null,
					max:null,
					padding:20,
					step:1,
					modulus:1,
					fontsize:10
				},
				y:{
					height:null,
					min:null,
					max:null,
					minOverride:0,
					maxOverride:null,
					padding:50,
					step:2,
					modulus:2,
					fontsize:10
				}
			};
			this.data=[];
			$.extend(true,this,params);
			this.setData=function(data) {
				if (data instanceof Array) {
					this.data=data;
					this.processData();
				}
			};
			this.processData=function() {
				this.axis.y.min=(this.axis.y.minOverride===null)?Number.MAX_VALUE:this.axis.y.minOverride;
				this.axis.y.max=(this.axis.y.maxOverride===null)?Number.MIN_VALUE:this.axis.y.maxOverride;
				this.axis.x.min=Number.MAX_VALUE;
				this.axis.x.max=Number.MIN_VALUE;
				this.data.sort(function(a,b){
					return a.x-b.x;
				});
				for(var i=0;i<this.data.length;i++) {
					//if (this.axis.y.minOverride===null) {
						if (this.data[i].y<this.axis.y.min) this.axis.y.min=this.data[i].y;
					//}else{
					//	this.axis.y.min=this.axis.y.minOverride;
					//}
					//if (this.axis.y.maxOverride===null) {
					//	if (this.data[i].y>this.axis.y.max) this.axis.y.max=this.data[i].y;
					//}else{
						if (this.data[i].y>this.axis.y.max) this.axis.y.max=this.data[i].y;
					//}
					if (this.data[i].x>this.axis.x.max) this.axis.x.max=this.data[i].x;
					if (this.data[i].x<this.axis.x.min) this.axis.x.min=this.data[i].x;
					if (typeof(this.data[i].label)=='string') this.axis.x.labels=false;
				}
				if (this.axis.y.max==this.axis.y.min) this.axis.y.max++;
				if (this.axis.x.max==this.axis.x.min) this.axis.x.max++;
				if (this.threshold.y!==null) {
					if (this.axis.y.minOverride===null && this.threshold.y<this.axis.y.min) this.axis.y.min=this.threshold.y;
					if (this.axis.y.maxOverride===null && this.threshold.y>this.axis.y.max) this.axis.y.max=this.threshold.y;
				}
				if (typeof(this.axis.y.stepFunction)=='function') this.axis.y.step=this.axis.y.stepFunction.apply(this,[]);
				if (typeof(this.axis.y.modulusFunction)=='function') this.axis.y.modulus=this.axis.y.modulusFunction.apply(this,[]);
				if (typeof(this.axis.x.stepFunction)=='function') this.axis.x.step=this.axis.x.stepFunction.apply(this,[]);
				if (typeof(this.axis.x.modulusFunction)=='function') this.axis.x.modulus=this.axis.x.modulusFunction.apply(this,[]);
				this.axis.y.max+=(this.axis.y.modulus-(this.axis.y.max % this.axis.y.modulus));
				this.axis.y.min-=(this.axis.y.min % this.axis.y.modulus);
				//this.axis.x.max+=(this.axis.x.modulus-(this.axis.x.max % this.axis.x.modulus));
				//this.axis.x.min-=(this.axis.x.min % this.axis.x.modulus);
				if (this.axis.y.height===null) {
					this.axis.y.height=(this.height/(this.axis.y.max-this.axis.y.min));
				}else{
					this.height=Math.round(this.axis.y.height*(this.axis.y.max-this.axis.y.min));
				}
				this.width=(this.widthOverride!==null)?this.widthOverride:null;
				if (this.width===null) {
					if (this.axis.x.width===null) {
						this.width=Math.round(yoodoo.dooit.arena.width()*0.8);
						this.axis.x.width=Math.round(this.width/(this.axis.x.max-this.axis.x.min));
						this.width=Math.round(this.axis.x.width*(this.axis.x.max-this.axis.x.min));
					}else{
						this.width=Math.round(this.axis.x.width*(this.axis.x.max-this.axis.x.min));
					}
				}else{
					if (this.axis.x.width===null) {
						this.axis.x.width=Math.round(this.width/(this.axis.x.max-this.axis.x.min));
					}
				}
				$(this.svg).attr("width",this.width+(2*this.padding)).attr("height",this.height+(2*this.padding));

				this.xaxis.css({
					height:this.axis.x.padding,
					'width':(this.width+(2*this.padding))+'px',
					position:'relative'
				});

				this.arena.css({
					//width:'100%',
					height:'100%',
					//display:'inline-block',
					'vertical-align':'top',
					'overflow-x':'auto',
					'overflow-y':'hidden'
				}).find('>div').css({
					'width':(this.width+(2*this.padding))+'px',
					position:'relative'
				});
				this.arenaContainer.css({
					'margin-left':this.axis.y.padding+'px',
					height:'100%',
					//display:'inline-block',
					'vertical-align':'top'
					,'overflow':'hidden'
				});
				this.yaxis.css({
					width:this.axis.y.padding,
					height:'100%',
					//display:'inline-block',
					'vertical-align':'top',
					position:'absolute'
				});
			};
			this.container = $(yoodoo.e("div")).addClass('yoodooUI_linegraph').css({
				height:this.height+(2*this.padding)+this.axis.x.padding,
				position:'relative'
			});
			this.yaxis = $(yoodoo.e("div"));
			this.arenaContainer = $(yoodoo.e("div"));
			this.arena = $(yoodoo.e("div"));
			this.xaxis = $(yoodoo.e("div"));
			this.svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
			this.container.append(
				this.yaxis
			).append(
				this.arenaContainer.append(
					this.arena.append(
						$(yoodoo.e("div")).append(
							this.svg
						).append(
							this.xaxis
						)
					).css({
					})
				)
			);
			this.processData();
			this.render=function(data) {
				if (this.data.length==0) return this.container;
				if (typeof(data)!='undefined') this.setData(data);
				$(this.svg).empty();

				// x

				this.xaxis.empty();
				var b=this.height+this.padding;
				var t=this.padding;
				for(var x=this.axis.x.min;x<=this.axis.x.max;x+=this.axis.x.step) {
					var px=this.padding+((x-this.axis.x.min)*this.axis.x.width);
					if (this.axis.x.labels===true && ((x-this.axis.x.min) % this.axis.x.modulus) == 0)
						this.xaxis.append(
							$(yoodoo.e("div")).css({
								width:50,
								left:px-25,
								top:0,
								position:'absolute',
								'text-align':'center',
								'font-size':this.axis.x.fontsize+'px'
							}).html(yoodoo.thousands(x))
						);
					$(this.svg).append(
						$(document.createElementNS("http://www.w3.org/2000/svg", "path"))
							.attr("d","M"+px+","+b+" L"+px+","+t)
							.attr("style","stroke: "+yoodooStyler.rgbToHex(this.framecolour)+";stroke-width:1;fill:none;")
					);
				}
				if ((this.axis.x.max-this.axis.x.min)%this.axis.x.step >0) {
					var px=this.padding+((this.axis.x.max-this.axis.x.min)*this.axis.x.width);
					$(this.svg).append(
						$(document.createElementNS("http://www.w3.org/2000/svg", "path"))
							.attr("d","M"+px+","+b+" L"+px+","+t)
							.attr("style","stroke: "+yoodooStyler.rgbToHex(this.framecolour)+";stroke-width:1;fill:none;")
					);
				}

				// y

				var l=this.padding;
				var r=l+this.width;
				this.yaxis.empty();
				var lineHeight=this.axis.y.step*this.axis.y.height;
				if (lineHeight*0.8>this.axis.y.fontsize) lineHeight=Math.round(this.axis.y.fontsize/0.8);
				for(var y=this.axis.y.min;y<=this.axis.y.max;y+=this.axis.y.step) {
					var py=this.height+this.padding-((y-this.axis.y.min)*this.axis.y.height);
					$(this.svg).append(
						$(document.createElementNS("http://www.w3.org/2000/svg", "path"))
							.attr("d","M"+l+","+py+" L"+r+","+py)
							.attr("style","stroke: "+yoodooStyler.rgbToHex(this.framecolour)+";stroke-width:1;fill:none;")
					);
					//console.log(y,this.axis.y.min,((y-this.axis.y.min) % this.axis.y.modulus));
					if ((y-this.axis.y.min) % this.axis.y.modulus == 0)
						this.yaxis.append(
							$(yoodoo.e("div")).css({
								width:'100%',
								left:0,
								top:py-(lineHeight/2),
								position:'absolute',
								'text-align':'right',
								'line-height':lineHeight+'px',
								'font-size':Math.round(0.8*lineHeight)+'px'
							}).html(yoodoo.thousands(y))
						);
				}

				// threshold

				if (this.threshold.y!==null && this.threshold.y>=this.axis.y.min && this.threshold.y<=this.axis.y.max) {
					var py=this.height+this.padding-((this.threshold.y-this.axis.y.min)*this.axis.y.height);
					$(this.svg).append(
						$(document.createElementNS("http://www.w3.org/2000/svg", "path"))
							.attr("d","M"+l+","+py+" L"+r+","+py)
							.attr("style","stroke: "+yoodooStyler.rgbToHex(this.threshold.colour)+";stroke-width:"+this.threshold.stroke+";fill:none;")
					);
				}

				// line

				var points=[];
				var dots=[];
				for (var d=0;d<this.data.length;d++) {
					var pos={x:0,y:0};
					pos.x=this.padding+Math.round(this.axis.x.width*(this.data[d].x-this.axis.x.min));
					pos.y=this.height+this.padding-Math.round(this.axis.y.height*(this.data[d].y-this.axis.y.min));
					pos.val=this.data[d].y;
					dots.push(pos);
					points.push(pos.x+','+pos.y);
					if (this.axis.x.labels!==true && typeof(this.data[d].label))
						this.xaxis.append(
							$(yoodoo.e("div")).css({
								width:50,
								left:pos.x-((d==0)?0:((d==this.data.length-1)?50:25)),
								top:0,
								position:'absolute',
								'text-align':((d==0)?'left':((d==this.data.length-1)?'right':'center')),
								'font-size':this.axis.x.fontsize+'px'
							}).html(this.data[d].label)
						);
				}
				var line=document.createElementNS("http://www.w3.org/2000/svg", "path");
				var str='M'+points.shift()+' L'+points.join(' L');
				$(this.svg).append(
					$(line).attr("d",str).attr("style","stroke: "+yoodooStyler.rgbToHex(this.linecolour)+";stroke-width:"+this.linewidth+";fill:none;")
				);

				// dots

				if (this.dots.show===true) {
					for(var p=0;p<dots.length;p++) {
						var line=document.createElementNS("http://www.w3.org/2000/svg", "circle");
						var fill=this.dots.colour;
						var stroke=this.dots.strokecolour;
						if (this.threshold.y!==null) {
							if (dots[p].val<=this.threshold.y) {
								if (this.dots.thresholdbelowcolour!==null) fill=this.dots.thresholdbelowcolour;
								if (this.dots.thresholdbelowstrokecolour!==null) stroke=this.dots.thresholdbelowstrokecolour;
							}else{
								if (this.dots.thresholdabovecolour!==null) fill=this.dots.thresholdabovecolour;
								if (this.dots.thresholdabovestrokecolour!==null) stroke=this.dots.thresholdabovestrokecolour;
							}
						}
						$(this.svg).append(
							$(line)
								.attr("cx",dots[p].x)
								.attr("cy",dots[p].y)
								.attr("r",this.dots.radius)
								.attr("stroke",yoodooStyler.rgbToHex(stroke))
								.attr("fill",yoodooStyler.rgbToHex(fill))
								.attr("stroke-width",this.dots.stroke)
						);
					}
				}
				//yoodoo.ui.behaviours.swipe(this.arenaContainer.get(0),{
				yoodoo.ui.behaviours.swipe(this.arena.get(0),{
					scrolled:true,
					snapToChildren:false
				});
				return this.container;
			};
		}
	},
	runRuleCache : function() {

		for (var k in this.ruleKeys) {
			if (this.ruleKeys[k].event.type == 'complete')
				this.ruleKeys[k].check();
			this.ruleKeys[k].cache.run();
		}
	},
	drawSchema : function(context, schema, target) {
		if ( typeof (schema.finishable) == 'function')
			context.finishable = schema.finishable;
		if (typeof(yoodoo.dooit.params.display.finished)=='undefined' && typeof(context.finishable)=='function') yoodoo.dooit.params.display.finished=context.finishable;
		if ( typeof (schema.prerender) == 'function')
			schema.prerender.apply(context, []);
		var uis = [];
		this.ruleKeys = {};
		for (var k in schema) {
			if (yoodoo.ui[k] !== undefined) {
				schema[k].context = context;
				var ui = new yoodoo.ui[k](schema[k]);
				$(target).append(ui.container);
				uis.push(ui);
			}
		}
		if ( typeof (schema.postrender) == 'function')
			schema.postrender.apply(context, [uis]);
			
	},
	drawQuestion : function(me, index, key, question, parentQuestion) {
		this.key = key;
		this.index = index;
		this.question = question;
		this.parent = parentQuestion;
		this.context = me;
		this.object = null;
		this.childContainer = null;
		this.onchange = function() {
		};
		this.getKeys = function() {
			var arr = [];
			if (this.parent !== null)
				arr = this.parent.getKeys();
			var arr2 = [];
			if (this.parent !== null)
				arr.push('children');
			if (this.index !== null)
				arr2.push(this.index);
			arr2.push(this.key);
			arr = arr.concat(arr2);
			return arr;
		};
		this.render = function() {
			this.question.object = this;
			this.params = {};
			for (var k in this.question) {
				if (k == 'onchange') {
					this.onchange = this.question[k];
				} else {
					this.params[k] = this.question[k];
				}
			}

			if (this.question.validator !== undefined) {
				if (typeof(this.question.validator)=="string") {
					this.params.validator = new yoodoo.ui.validators[this.question.type][this.question.validator]();
				}else if (typeof(this.question.validator)=="object") {
					this.params.validator = new yoodoo.ui.validators[this.question.type][this.question.validator.type](this.question.validator);
				}
			}
			var labelKey = 'label';
			if ( typeof (this.question[labelKey + '_' + yoodoo.language]) != "undefined")
				labelKey += '_' + yoodoo.language;
			if ( typeof (this.question[labelKey]) == "function") {
				this.params.label = this.question[labelKey].apply(this, [this.index]);
			} else {
				this.params.label = this.question[labelKey];
			}
			if ( typeof (this.question.value) == "function" && this.parent !== null)
				this.params.value = this.question.value.apply(this, [this.index]);
			if (yoodoo.ui[this.question.type] === undefined) {
				yoodoo.console(this.question.type + ' is an undefined type');
				this.question.type = 'text';
			}
			if ( typeof (this.question.prerender) == 'function')
				this.question.prerender.apply(this, []);
			this.object = new yoodoo.ui[this.question.type](this.params);
			this.object.source = this;

			if ( typeof (this.question.value) == "function") {
				this.question.value.apply(this, []);
			} else if (this.question.value instanceof Array) {
				this.object.add(this.question.value);
			} else if ( typeof (this.question.value) === 'object') {
				for (var x in this.question.value) {
					if (this.question.value[x].options !== undefined) {
						this.object.addGroup(this.question.value[x]);
					} else {
						this.object.add(this.question.value[x], x);
					}
				}
			}
			var container = this.object.render(this.getValue());
			if (this.parent !== null) {
				$(this.parent.childContainer).append(container);
			}
			if (this.childContainer === null) {
				this.childContainer = $(yoodoo.e("div"));
				$(this.object.container).append(this.childContainer);
			}
			this.childContainer.css({
				display : (this.question.showChildren === undefined) ? 'block' : ((( typeof (this.question.showChildren) == 'function') ? this.question.showChildren.apply(this, []) : this.question.showChildren) ? 'block' : 'none'
				)
			});
			var obj = this;
			if (this.object.settings.onchange !== undefined) {
				this.object.settings.onchange.value = function() {
					obj.setValue(this.value);
					obj.onchange.apply(obj, []);
					if (obj.question.children !== undefined) {
						obj.drawChildren();
						if ((obj.question.showChildren !== undefined) && ( typeof (obj.question.showChildren) == 'function') ? obj.question.showChildren.apply(obj, []) : obj.question.showChildren) {
							obj.childContainer.slideDown();
						} else {
							obj.childContainer.slideUp();
						}
					}
				};
			}
			if ( typeof (this.question.prechildrender) == 'function')
				this.question.prechildrender.apply(this, []);
			this.drawChildren();
			if ( typeof (this.question.postrender) == 'function')
				this.question.postrender.apply(this, []);

			return container;
		};
		this.isEmptyValue = function() {
			return this.object.value == '';
		};
		this.drawChildren = function() {
			if (this.question.children !== undefined) {
				if (this.question.children.add_remove === true) {
					if (this.list === undefined) {
						this.list = new yoodoo.ui.questionList(this.context, this.question.children, this);
						$(this.childContainer).append(this.list.render());
					}
				} else if (this.question.children.array_length !== undefined) {
					var l = 0;
					if ( typeof (this.question.children.array_length) == "function") {
						l = this.question.children.array_length.apply(this, []);
					} else {
						l = this.question.children.array_length;
					}
					if (this.kids === undefined)
						this.kids = [];
					while (this.kids.length >= l && this.kids.length > 0) {
						var last = this.kids.pop();
						for (var k in last) {
							last[k].object.container.remove();
						}
					}
					var newlist=[];
					for (var i = 0; i < l; i++) {
						var kidQuestion = {};
						if (i == this.kids.length) {
							this.kids.push(kidQuestion);
						} else {
							kidQuestion = this.kids[i];
						}
						for (var kk in this.question.children.childrenDetails) {
							if (kidQuestion[kk] === undefined) {
								kidQuestion[kk] = new yoodoo.ui.drawQuestion(this.context, i, kk, this.question.children.childrenDetails[kk], this);
								newlist.push(kidQuestion[kk]);
							} else {
								if (kidQuestion[kk].update !== undefined)
									kidQuestion[kk].update(i);
							}
						}
					}
					while(newlist.length>0) {
						var newobj=newlist.shift();
						$(this.childContainer).append(newobj.render());
					}
				} else {
					if (this.kids === undefined)
						this.kids = {};
					for (var kk in this.question.children) {
						if (this.kids[kk] === undefined) {
							var kid = new yoodoo.ui.drawQuestion(this.context, null, kk, this.question.children[kk], this);
							this.kids[kk] = kid;
							$(this.childContainer).append(kid.render());
						} else {
							if (this.kids[kk].update !== undefined)
								this.kids[kk].update(0);
						}
					}
				}
			}
		};
		this.update = function(i) {
			var labelKey = 'label';
			if ( typeof (this.question[labelKey + '_' + yoodoo.language]) != "undefined")
				labelKey += '_' + yoodoo.language;
			if ( typeof (this.question[labelKey]) == "function") {
				this.params.label = this.question[labelKey].apply(this, [i]);
			} else {
				this.params.label = this.question[labelKey];
			}
			if ( typeof (this.question.value) == "function")
				this.params.value = this.question.value.apply(this, [i]);
			if (this.object.updated !== undefined)
				this.object.updated(this.params);
		};
		this.metaValue = function() {
			var val = this.object.value;
			if ( typeof (this.object.metaValue) == 'function')
				val = this.object.metaValue();
			if ( typeof (this.question.metaValue) == 'function')
				val = this.question.metaValue.apply(this, []);
			if (val !== null && typeof (val.getTime) == 'function') {
				if ( typeof (this.question.metaFormat) == 'string') {
					val = yoodoo.formatDate(this.question.metaFormat, val);
				} else {
					val = val.toDateString();
				}
			}
			if (val === undefined || val === null)
				val = '';
			val = val.toString();
			if (this.parent != null && this.parent.question.array_length !== undefined) {
				if ( typeof (this.question.metaPrefix) == 'string')
					val = this.question.metaPrefix + val;
				if ( typeof (this.question.metaSuffix) == 'string')
					val += this.question.metaSuffix;
			}
			return val;
		};
		this.setMeta = function() {
			if (this.question.saveToMeta !== undefined && this.question.saveToMeta != '') {
				if (this.parent != null && this.parent.question.children != undefined && this.parent.question.children.array_length !== undefined) {
					var vals = [];
					for (var i in this.parent.kids) {
						for (var k in this.parent.kids[i]) {
							var val = this.parent.kids[i][k].metaValue();
							if (val !== undefined && val !== null && val != '')
								vals.push(val);
						}
					}
					var str = '';
					if (this.question.metaSeparator === undefined || this.question.metaSeparator === null) {
						if (vals.length > 0) {
							var last = vals.pop();
							str = vals.join(', ');
							str += ((str != "") ? ' and ' : '') + last;
						}
					} else {
						str = vals.join(this.question.metaSeparator);
					}
					if ( typeof (this.question.metaPrefix) == 'string')
						str = this.question.metaPrefix + str;
					if ( typeof (this.question.metaSuffix) == 'string')
						str += this.question.metaSuffix;
					yoodoo.set_meta(this.question.saveToMeta, str);
				} else {
					yoodoo.set_meta(this.question.saveToMeta, this.metaValue());
				}
			}
		};
		this.setValue = function(v) {
			var keys = this.getKeys();
			var val = this.context.value;
			if (val == '') {
				this.context.value = {};
				val = this.context.value;
			}
			var str = [];
			var parent=null;
			while (keys.length > 0) {
				var k = keys.shift();
				if ((val[k] === undefined || val[k] == '') && k != 'children' && isNaN(k)) {
					if (val.length!==undefined && val.length==0) {
						try{
							eval('val=this.context.value['+str.join("][")+']={};');
						}catch(e) {
							yoodoo.errorLog(e);
						}
					}
					val[k] = {
						value : '',
						children : []
					};
				} else if ((val[k] === undefined || val[k] == '') && !isNaN(k)) {
					val[k] = {
						a : keys.length
					};
				} else if ((val[k] === undefined || val[k] == '') && k == 'children') {
					val[k] = [];
				}
				if (isNaN(k)) {
					str.push("'" + k + "'");
				} else {
					str.push(k);
				}
				parent=val;
				val = val[k];
			}
			val.value = v;
			this.setMeta();
			if (this.parent !== null)
				this.parent.setMeta();
		};
		this.getValueObject = function() {
			var keys = this.getKeys();
			var val = this.context.value;
			if (val == '') {
				this.context.value = {};
				val = this.context.value;
			}
			while (keys.length > 0) {
				var k = keys.shift();
				if ((val[k] === undefined || val[k] == '' || val[k] == null) && k != 'children' && isNaN(k)) {
					val[k] = {
						value : '',
						children : []
					};
				} else if ((val[k] === undefined || val[k] == '' || val[k] == null) && !isNaN(k)) {
					val[k] = {
						a : keys.length
					};
				} else if ((val[k] === undefined || val[k] == '' || val[k] == null) && k == 'children') {
					val[k] = [];
				}
				val = val[k];
			}
			return val;
		};
		this.getValue = function() {
			return this.getValueObject().value;
		};
	},
	questionList : function(context, children, from) {
		this.context = context;
		this.schema = children;
		this.parent = from;
		this.length = from.getValueObject().children.length;
		this.container = $(yoodoo.e("div")).addClass('yoodooUI_list');
		if (this.length < 1)
			this.length = 1;
		this.render = function() {
			var me = this;
			if (this.addButton === undefined) {
				this.addButton = $(yoodoo.e("button")).attr("type", "button").append(yoodoo.icons.get("add", 20, 20, {
					'4d4d4d' : 'ffffff'
				})).addClass("addButton").click(function() {
					if (!(me.container.hasClass('nomore')))
						me.add();
				});
				this.container.append(this.addButton);
			}
			if (this.kids === undefined)
				this.kids = [];
			if (this.rows === undefined)
				this.rows = [];
			while (this.kids.length >= this.length && this.kids.length > 0) {
				var last = this.kids.pop();
				for (var k in last) {
					last[k].object.container.remove();
				}
			}
			for (var i = 0; i < this.length; i++) {
				var row = $(yoodoo.e("div")).addClass("yoodooUI_list_row");
				this.rows.push(row);
				var kidQuestion = {};
				if (i == this.kids.length) {
					this.kids.push(kidQuestion);
				} else {
					kidQuestion = this.kids[i];
				}
				for (var kk in this.schema.childrenDetails) {
					if (kidQuestion[kk] === undefined) {
						kidQuestion[kk] = new yoodoo.ui.drawQuestion(this.context, i, kk, this.schema.childrenDetails[kk], this.parent);
						row.append(kidQuestion[kk].render());
					} else {
						if (kidQuestion[kk].update !== undefined)
							kidQuestion[kk].update(i);
					}
				}
				this.removeButton(row);
				row.insertBefore(this.addButton);
			}
			if (this.schema.max_length > 0 && this.length >= this.schema.max_length) {
				this.container.addClass('nomore');
			}
			return this.container;
		};
		this.add = function() {
			var row = $(yoodoo.e("div")).addClass("yoodooUI_list_row");
			this.rows.push(row);
			var kidQuestion = {};
			this.kids.push(kidQuestion);
			this.length = this.kids.length;
			for (var kk in this.schema.childrenDetails) {
				if (kidQuestion[kk] === undefined) {
					kidQuestion[kk] = new yoodoo.ui.drawQuestion(this.context, this.kids.length - 1, kk, this.schema.childrenDetails[kk], this.parent);
					row.append(kidQuestion[kk].render());
				}
			}
			this.removeButton(row);
			row.hide().insertBefore(this.addButton);
			var me = this;
			row.slideDown(300, function() {
				var p = this;
				while ( typeof (p.scrollPageTo) != 'function' && p !== yoodoo.widget) {
					p = p.parentNode;
				}
				if ( typeof (p.scrollPageTo) == 'function')
					p.scrollPageTo(me.addButton);
				yoodoo.dooit.checkDone();
			});
			if (this.schema.max_length > 0 && this.length >= this.schema.max_length) {
				this.container.addClass('nomore');
			}
		};
		this.removeButton = function(row) {
			var me = this;
			var source = row;
			var rem = $(yoodoo.e("button")).attr("type", "button").addClass("removeButton").append(yoodoo.icons.get("close", 20, 20, {
				'4d4d4d' : 'ffffff'
			})).click(function() {
				$(this).unbind("click");
				me.remove(source);
			});
			$(row).append(rem);
		};
		this.remove = function(row) {
			this.container.removeClass('nomore');
			var i = row.prevAll('.yoodooUI_list_row').get().length;
			$(row).slideUp(300, function() {
				$(this).remove();
				yoodoo.dooit.checkDone();
			});
			this.kids.splice(i, 1);
			var children = this.parent.getValueObject();
			children.children.splice(i, 1);
			this.length = this.kids.length;
			if (this.length == 0) {
				this.add();
			} else {
				for (var i = 0; i < this.kids.length; i++) {
					for (var kk in this.schema.childrenDetails) {
						this.kids[i][kk].index = i;
					}
				}
			}
		};
	}
};
