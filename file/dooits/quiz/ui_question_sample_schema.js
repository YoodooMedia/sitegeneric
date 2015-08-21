dooit.temporaries('infoSchema');
var infoSchema = {
	numericPrefix: function(i) {
		var prefix = ['first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth', 'tenth', 'eleventh', 'twelfth', 'thirteenth', 'fourteenth', 'fifteenth'];
		return prefix[i];
	},
	prerender:function(){
		console.log("prerender",this);
	},
	postrender:function(uis){
		console.log("postrender",this,uis);
	},
	ondisplay:function() {
		this.schema.pages.ui.gotoPage(2,true);
	},
	words:{
		me:{en:'Paul',es:'Pablo',fr:'Pierre'}
	},
	tree: {
		start: 'Page1',
		prerender:function(){
			console.log("prerender",this);
		},
		prechildrender:function(){
			console.log("prechildrender",this);
		},
		postrender:function(){
			console.log("postrender",this);
		},
		screens: {
			Page1:{
				page_title: 'Page1',
				prerender:function(){
					console.log("prerender",this);
				},
				prechildrender:function(){
					console.log("prechildrender",this);
				},
				postrender:function(){
					console.log("postrender",this);
				},
				questions: {
					title: {
						type: 'html',
						label: function() {
							return $(yoodoo.e("div")).html('efgwegdfezrberh');
						},
						label_en: function() {
							return $(yoodoo.e("div")).html('in english');
						},
						prerender:function(){
							console.log("prerender",this);
						},
						prechildrender:function(){
							console.log("prechildrender",this);
						},
						postrender:function(){
							console.log("postrender",this);
						}
					},
					name: {
						label: 'What\'s your name?',
						type: 'text',
						defaultValue: '',
						saveToMeta: 'infoName',
						tagRules: [{
							type: 'matcher',
							textToMatch: 'paul',
							addTags: ['one', 'two'],
							removeTags: ['three', 'four']
						}]
					},
					age: {
						label: 'When were you born?',
						label_en: 'English - When were you born?',
						type: 'month',
						defaultValue: new Date(new Date().setFullYear(new Date().getFullYear() - 20)),
						forceCalendar: false,
						min: new Date(new Date().setFullYear(new Date().getFullYear() - 100)),
						max: new Date(),
						defaultValue: new Date(new Date().setFullYear(new Date().getFullYear() - 20)),
						metaFormat: 'jS F Y',
						saveToMeta: 'infoAge'
					},
					relStatus: {
						label: 'What\'s your relationship status?',
						value: ['Single', 'With a partner', 'Married'],
						type: 'selectbox',
						defaultValue: '',
						saveToMeta: 'relStatus',
						onchange:function() {
							if(this.object.value=='Married') this.context.schema.pages.ui.gotoPage("Page4");
						}
					}

				}
			},
			Page2:{
				page_title: '',
				questions: {
					title: {
						type: 'html',
						label: function() {
							return $(yoodoo.e("div")).html('<h1>What are some other techniques you could use when you are feeling stressed about<br> Meeting new people...</h1>');
						}
					},
					otherTechniques: {
						label: 'To avoid stress I could...',
						type: 'text',
						showChildren: function() {
							return !this.isEmptyValue();
						},
						children: {
							array_length: function() {
								if (this.kids === undefined) return this.context.value.otherTechniques.children.length;
								var l = this.kids.length;
								if (l > 0 && this.kids[l - 1].newTechnique.object.value != '') {
									l++;
								}
								if (l > 1 && this.kids[l - 2].newTechnique.object.value == '') {
									l--;
								}
								return l;
							},
							add_remove:true,
							max_length:10,
							childrenDetails: {
								newTechnique: {
									showparent: true,
									label: 'To avoid stress I could...',
									type: 'text',
									onchange: function() {
											this.parent.drawChildren();
										}
										/*,
										showChildren: function() {
											return !this.isEmptyValue();
										},
										children:{
											newTechniqueChild:{
												showparent:true,
												label:'To avoid stress I could...',
												type: 'text',
												showChildren: function() {
													return !this.isEmptyValue();
												},
											}
										},*/
								},
							}
						}
					},
				}
			},
			Page3 : {
				page_title: 'Page2',
				questions: {
					kidsNumber: {
						label: 'How many kids do you have?',
						required: true,
						type: 'text',
						defaultValue: '',
						validator: 'numeric',
						saveToMeta: 'kidsNumber',
						showChildren: function() {
							return !this.isEmptyValue();
						},
						children: {
							array_length: function() {
								return this.object.value;
							},
							childrenDetails: {
								kidName: {
									label: function(i) {
										var prefix = infoSchema.numericPrefix(i);
										prefix = (i == this.parent.kids.length - 1) ? 'youngest' : prefix;
										prefix = (i == 0) ? 'eldest' : prefix;
										var questionLabel = 'What\'s your ' + prefix + ' kid\'s name?';
										return questionLabel;
									},
									type: 'text',
									defaultValue: '',
									saveToMeta: 'kidName',
									metaSeparator: '. ', // null makes a verbose sentence else this is the separator character
									metaPrefix: '',
									metaSuffix: '.',
									metaValue: function() {
										if (this.object.value == '') return '';
										return this.object.value + ' was born ' + this.kids.kidAge.metaValue.apply(this.kids.kidAge, []);
									},
									showChildren: function() {
										return !this.isEmptyValue();
									},
									children: {
										kidAge: {
											label: function() {
												var questionLabel = 'When was ' + this.parent.object.value + ' born';
												return questionLabel;
											},
											metaFormat: 'd/m/y',
											metaValue: function() {
												if (this.isEmptyValue()) return 'in the past';
												return yoodoo.ago(this.object.value);
											},
											type: 'month',
											defaultValue: new Date(new Date().setFullYear(new Date().getFullYear() - 10))
										}
									}
								}

							}
						}
					},
				}
			},
			Page4 : {
				page_title: 'Page3',
				questions: {
					nextBabyPlan: {
						label: 'When are you planning to have another baby',
						type: 'selectbox',
						value: ['Later', 'Soon', 'I\'m already pregnant'],
						defaultValue: '',
						saveToMeta: 'nextBabyPlan'

					},
					howActive: {
						label: 'How active are you?',
						type: 'slider',
						showendvalues: false,
						showAdditionalLabel: true,
						metaAdditionalLabel: true,
						additionalLabel: [{
							min: 1,
							max: 2,
							label: 'Not very active'
						}, {
							min: 3,
							max: 4,
							label: 'Lightly active'
						}, {
							min: 5,
							max: 7,
							label: 'Active'
						}, {
							min: 8,
							max: 10,
							label: 'Highly active'
						}],
						defaultValue: '',
						/*metaValue:function() {
							return this.object.validatedLabel;
						},*/
						saveToMeta: 'howActive'

					}
				}
			}
		}
	}
};