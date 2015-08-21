/* --- dooit layout ---

	<div class='advisorpanel'></div>
	<script type='text/javascript'>
	function initThis() {
		var params={};
		params.dependencies=[
			['dooits/training/advisorpanel.js',true],
			['css/training/advisorpanel.css',true]
		];
		params.loaded=function(){
			advisorpanel.init({selectors:{container:'.advisorpanel'}});      - options to override in the dooit class
		};
		params.saveValues=['advisorpanel.output'];
		params.finished='advisorpanel.finishable';
		dooit.init(params);
	}
	</script>
*/



dooit.temporaries('advisorpanel');
var advisorpanel={
	selectors:{
		container:'.advisorpanel'
	},
	containers:{
		container:null
	},
	value:null,
	key:null,
	fields:{},
	init:function() {
		if (arguments.length>0) this.transposeOptions([],arguments[0]);
		this.loadFields();
		this.containers.container=$(this.selectors.container);
		var h2=document.createElement("h2");
		$(h2).html(yoodoo.dooittitle).css({float:'left','margin-right':10});
		var description=document.createElement("div");
		$(description).html('');
		var rsbut=document.createElement("button");
		$(rsbut).attr('type','button').html("restart").css({position:'absolute',right:10,bottom:10}).addClass("green medium").bind("click",function() {advisorpanel.restart();});
		$(this.containers.container).css({position:"relative"});
		this.containers.steps=document.createElement("div");
		$(this.containers.steps).addClass("advisorsteps");
		this.containers.stage=document.createElement("div");
		this.containers.stage.id="yoodooContainerContent";
		$(this.containers.stage).css({clear:'both',position:"relative",'z-index':1,zoom:0.75,margin:0,height:yoodoo.option.height,width:yoodoo.option.width});
		this.containers.container.empty().append(h2).append(description).append(rsbut).append(this.containers.stage).append(this.containers.steps);
		if (this.key!==null && this.containers.container!==null) {
			// start rendering the dooit
			this.buildEnableTriggers();
			this.validateValue();
			this.start();
		}
	},
	start:function() {
		// add the content to this.containers.container
		$(this.containers.stage).empty().append(this.welcomePage());
		this.nextStep();
	},
	emptyTriggers:{
		returnHome:function() {},
		openPanel:function() {},
		clickUser:function(u) {},
		expandDooit:function(u,d) {},
		viewDooit:function(u,d) {},
		approveDooit:function(u,d) {},
		backDooit:function(u,d) {},
		sendMessage:function(u,d,m) {}
	},
	triggers:{
		returnHome:function() {},
		openPanel:function() {},
		clickUser:function(u) {},
		expandDooit:function(u,d) {},
		viewDooit:function(u,d) {},
		approveDooit:function(u,d) {},
		backDooit:function(u,d) {},
		sendMessage:function(u,d,m) {}
	},
	enabledTriggers:{
		returnHome:function() {return true;},
		openPanel:function() {return true;},
		clickUser:function(u) {return true;},
		expandDooit:function(u,d) {return true;},
		viewDooit:function(u,d) {return true;},
		approveDooit:function(u,d) {return true;},
		backDooit:function(u,d) {return true;},
		sendMessage:function(u,d,m) {return true;}
	},
	clearTriggers:function() {
		for(var k in this.triggers) {
			this.triggers[k]=this.emptyTriggers[k];
		}
	},
	advisorMessages:1,
	advisorWaiting:1,
	step:-1,
	stepsUserIndex:1,
	stepsDooitIndex:2,
	steps:[
		{
			message:"Welcome to the Yoodoo Homepage. \nYou'll notice the arrow pointing to the 'Advisor Panel' button - click on it to enter.",
			sound:yoodoo.option.baseUrl+"uploads/library/84a552d8cc823601be89a0a28cf7ce88.mp3",
			triggers:{
				openPanel:function() {
					advisorpanel.nextStep();
				}
			}
		},
		{
			message:"One of your learners, Joe Smith has submitted a Doo-It, select Joe by clicking on his name.",
			sound:yoodoo.option.baseUrl+"uploads/library/6ff66558561e5f3e4b6feece3c30f4b5.mp3",
			triggers:{
				clickUser:function(u) {
					if (u==advisorpanel.stepsUserIndex) advisorpanel.nextStep();
				}
			}
		},
		{
			message:"Nice work. \nJoe has just completed his 'My Skills and Interests' Doo-It, find it and click on it.",
			sound:yoodoo.option.baseUrl+"uploads/library/a251909afc150c3e5468ea463038ebfb.mp3",
			triggers:{
				expandDooit:function(u,d) {
					if (u==advisorpanel.stepsUserIndex && d==advisorpanel.stepsDooitIndex) advisorpanel.nextStep();
				}
			}
		},
		{
			message:"Good. \nNow, click on the button to view Joe's 'My Skills and Interests' Doo-It.",
			sound:yoodoo.option.baseUrl+"uploads/library/066f896f53659fbba44917fcfdd583c9.mp3",
			triggers:{
				viewDooit:function(u,d) {
					if (u==advisorpanel.stepsUserIndex && d==advisorpanel.stepsDooitIndex) advisorpanel.nextStep();
				}
			}
		},
		{
			message:"And here it is.\nOnce you have viewed 'My Skills and Interests', click 'Back'.",
			sound:yoodoo.option.baseUrl+"uploads/library/b09e685d5deb13a4821d2ad8c7a09db1.mp3",
			triggers:{
				backDooit:function(u,d) {
					if (u==advisorpanel.stepsUserIndex && d==advisorpanel.stepsDooitIndex) advisorpanel.nextStep();
				}
			}
		},
		{
			message:"It's time to approve Joe's Doo-It - click 'Approve completion'.",
			sound:yoodoo.option.baseUrl+"uploads/library/707a9a9afc9db9279b6df36398e1c1ea.mp3",
			triggers:{
				approveDooit:function(u,d) {
					if (u==advisorpanel.stepsUserIndex && d==advisorpanel.stepsDooitIndex) advisorpanel.nextStep();
				}
			},
			enabledTriggers:{
				approveDooit:function(u,d) {
					if (u==advisorpanel.stepsUserIndex && d==advisorpanel.stepsDooitIndex && advisorpanel.step==5) return true;
					if (u!=advisorpanel.stepsUserIndex || d!=advisorpanel.stepsDooitIndex) return true;
				}
			}
		},
		{
			message:"Congratulations, you've just approved your first Doo-It!\n Why not give Joe some feedback? Write 'Nice job' and click 'Send'",
			sound:yoodoo.option.baseUrl+"uploads/library/d35346bf0a78ccbdf865ed77d5b04e18.mp3",
			triggers:{
				sendMessage:function(u,d,m) {
					if (u==advisorpanel.stepsUserIndex && d==advisorpanel.stepsDooitIndex && /nice/i.test(m) && /job/i.test(m)) advisorpanel.nextStep();
				}
			}
		},
		{
			message:"Excellent. \nYour message is now visible in red, once Joe replies this will turn black. With no more learners to respond to, it's time to click 'Return Home'",
			sound:yoodoo.option.baseUrl+"uploads/library/fdaa994d552467f6ff3310a75f6a0f97.mp3",
			triggers:{
				returnHome:function() {
					advisorpanel.nextStep();
				}
			}
		},
		{
			message:"Good job. \nYour work here is done - it's really that simple! If you wish to try again, click <a href='javascript:void(0)' onclick='advisorpanel.restart()'>here</a>. Otherwise, click 'Done' in the bottom right to finish.",
			sound:yoodoo.option.baseUrl+"uploads/library/6c9ec27fbe6106989ede3902a35f64f6.mp3",
			triggers:{
			}
		}
	],
	users:[
		{
			name:"Sophie Neill",
			dooits:[
				{
					name:"A bit about you",
					complete:true,
					userComplete:true,
					viewAction:'advisorpanel.showDooit(yoodoo.option.baseUrl+"uploads/sitegeneric/file/css/training/images/abitaboutyou.jpg")',
					messages:[
						{
							when:'advisorpanel.todayMinusDays(4,2,3)',
							message:'Hi, I have completed this Doo-it.',
							read:true,
							fromUser:true
						},
						{
							when:'advisorpanel.todayMinusDays(2,2,3)',
							message:'Hi Sophie,\nWell done, this is a good start.',
							read:true,
							fromUser:false
						}
					]
				},
				{
					name:"My skills and interests",
					complete:true,
					userComplete:true,
					viewAction:'advisorpanel.showDooit(yoodoo.option.baseUrl+"uploads/sitegeneric/file/css/training/images/myskillsandinterests.jpg")',
					messages:[
						{
							when:'advisorpanel.todayMinusDays(5,2,3)',
							message:'Hi, I have completed this Doo-it.',
							read:true,
							fromUser:true
						},
						{
							when:'advisorpanel.todayMinusDays(2,2,3)',
							message:'Sophie,\nKeep this up, another very well thought out Doo-It.',
							read:true,
							fromUser:false
						}
					]
				},
				{
					name:"Hard and soft skills",
					complete:true,
					userComplete:true,
					viewAction:'advisorpanel.showDooit(yoodoo.option.baseUrl+"uploads/sitegeneric/file/css/training/images/hardandsoftskills.jpg")',
					messages:[
						{
							when:'advisorpanel.todayMinusDays(4,8,3)',
							message:'Hi, I have completed this Doo-it.',
							read:true,
							fromUser:true
						},
						{
							when:'advisorpanel.todayMinusDays(2,6,3)',
							message:'Hi Sophie,\nYour best work so far - congratulations.',
							read:true,
							fromUser:false
						}
					]
				}
			]
		},
            {
			name:"Joe Smith",
			dooits:[
				{
					name:"A bit about you",
					complete:true,
					userComplete:true,
					viewAction:'advisorpanel.showDooit(yoodoo.option.baseUrl+"uploads/sitegeneric/file/css/training/images/abitaboutyou.jpg")',
					messages:[
						{
							when:'advisorpanel.todayMinusDays(4,8,3)',
							message:'Hi, I have completed this Doo-it.',
							read:true,
							fromUser:true
						},
						{
							when:'advisorpanel.todayMinusDays(0,2,3)',
							message:'Morning Joe,\nStrong start - keep it up.',
							read:false,
							fromUser:false
						}
					]
				},
				{
					name:"Hard and soft skills",
					complete:true,
					userComplete:true,
					viewAction:'advisorpanel.showDooit(yoodoo.option.baseUrl+"uploads/sitegeneric/file/css/training/images/hardandsoftskills.jpg")',
					messages:[
						{
							when:'advisorpanel.todayMinusDays(4,8,3)',
							message:'Hi, I have completed this Doo-it.',
							read:true,
							fromUser:true
						},
						{
							when:'advisorpanel.todayMinusDays(0,2,3)',
							message:'Another good effort Joe,\nWell done.',
							read:true,
							fromUser:true
						}
					]
				},
				{
					name:"My skills and interests",
					complete:false,
					userComplete:true,
					viewAction:'advisorpanel.showDooit(yoodoo.option.baseUrl+"uploads/sitegeneric/file/css/training/images/myskillsandinterests.jpg")',
					messages:[
						{
							when:'advisorpanel.todayMinusDays(0,8,3)',
							message:'Hi, I have completed this Doo-it.',
							read:false,
							fromUser:true
						}
					]
				}
			]
		},
		{
			name:"Steve Marriott",
			dooits:[
				{
					name:"A bit about you",
					complete:true,
					userComplete:true,
					viewAction:'advisorpanel.showDooit(yoodoo.option.baseUrl+"uploads/sitegeneric/file/css/training/images/abitaboutyou.jpg")',
					messages:[
						{
							when:'advisorpanel.todayMinusDays(6,8,3)',
							message:'Hi, I have completed this Doo-it.',
							read:true,
							fromUser:true
						},
						{
							when:'advisorpanel.todayMinusDays(2,9,3)',
							message:'Hi Steve,\nYou need to complete the rest of this Doo-It.',
							read:false,
							fromUser:false
						}
					]
				},
				{
					name:"My skills and interests",
					complete:false,
					userComplete:true,
					viewAction:'advisorpanel.showDooit(yoodoo.option.baseUrl+"uploads/sitegeneric/file/css/training/images/myskillsandinterests.jpg")',
					messages:[
						{
							when:'advisorpanel.todayMinusDays(9,3,3)',
							message:'Hi, I have completed this Doo-it.',
							read:true,
							fromUser:true
						},
						{
							when:'advisorpanel.todayMinusDays(0,2,3)',
							message:'Steve,\nYou need to focus more on job interests here.',
							read:true,
							fromUser:false
						}
					]
				},
				{
					name:"Hard and soft skills",
					complete:false,
					userComplete:true,
					viewAction:'advisorpanel.showDooit(yoodoo.option.baseUrl+"uploads/sitegeneric/file/css/training/images/hardandsoftskills.jpg")',
					messages:[
						{
							when:'advisorpanel.todayMinusDays(7,3,3)',
							message:'Hi, I have completed this Doo-it.',
							read:true,
							fromUser:true
						},
						{
							when:'advisorpanel.todayMinusDays(4,2,3)',
							message:'Hi Steve,\nI suggest you have another look over the episode to get a better idea of the difference between hard and soft skills.',
							read:false,
							fromUser:false
						}
					]
				}
			]
		},
		{
			name:"Mei Ling",
			dooits:[
				{
					name:"A bit about you",
					complete:true,
					userComplete:true,
					viewAction:'advisorpanel.showDooit(yoodoo.option.baseUrl+"uploads/sitegeneric/file/css/training/images/abitaboutyou.jpg")',
					messages:[
						{
							when:'advisorpanel.todayMinusDays(6,3,3)',
							message:'Hi, I have completed this Doo-it.',
							read:true,
							fromUser:true
						},
						{
							when:'advisorpanel.todayMinusDays(1,2,3)',
							message:'Excellent work Mei.',
							read:false,
							fromUser:false
						}
					]
				},
				{
					name:"My skills and interests",
					complete:true,
					userComplete:true,
					viewAction:'advisorpanel.showDooit(yoodoo.option.baseUrl+"uploads/sitegeneric/file/css/training/images/myskillsandinterests.jpg")',
					messages:[
						{
							when:'advisorpanel.todayMinusDays(3,3,3)',
							message:'Hi, I have completed this Doo-it.',
							read:true,
							fromUser:true
						},
						{
							when:'advisorpanel.todayMinusDays(2,2,3)',
							message:'Hi Mei,\nThis is another well thought out Doo-It, keep it up.',
							read:true,
							fromUser:false
						}
					]
				},
				{
					name:"Hard and soft skills",
					complete:true,
					userComplete:true,
					viewAction:'advisorpanel.showDooit(yoodoo.option.baseUrl+"uploads/sitegeneric/file/css/training/images/hardandsoftskills.jpg")',
					messages:[
						{
							when:'advisorpanel.todayMinusDays(2,3,3)',
							message:'Hi, I have completed this Doo-it.',
							read:true,
							fromUser:true
						},
						{
							when:'advisorpanel.todayMinusDays(1,2,3)',
							message:'Well done Mei,\nYou have understood this Doo-It well.',
							read:false,
							fromUser:false
						}
					]
				}
			]
		},
            {
			name:"Tarik Ahmed",
			dooits:[
				{
					name:"A bit about you",
					complete:true,
					userComplete:true,
					viewAction:'advisorpanel.showDooit(yoodoo.option.baseUrl+"uploads/sitegeneric/file/css/training/images/abitaboutyou.jpg")',
					messages:[
						{
							when:'advisorpanel.todayMinusDays(2,3,3)',
							message:'Hi, I have completed this Doo-it.',
							read:true,
							fromUser:true
						},
						{
							when:'advisorpanel.todayMinusDays(0,2,3)',
							message:'Morning Tarik,\nCongratulations, this is good work.',
							read:false,
							fromUser:false
						}
					]
				},
				{
					name:"Hard and soft skills",
					complete:true,
					userComplete:true,
					viewAction:'advisorpanel.showDooit(yoodoo.option.baseUrl+"uploads/sitegeneric/file/css/training/images/hardandsoftskills.jpg")',
					messages:[
						{
							when:'advisorpanel.todayMinusDays(2,3,3)',
							message:'Hi, I have completed this Doo-it.',
							read:true,
							fromUser:true
						},
						{
							when:'advisorpanel.todayMinusDays(0,2,3)',
							message:'Afternoon Tarik,\nSome good answers here, well done.',
							read:true,
							fromUser:false
						}
					]
				},
				{
					name:"My skills and interests",
					complete:true,
					userComplete:true,
					viewAction:'advisorpanel.showDooit(yoodoo.option.baseUrl+"uploads/sitegeneric/file/css/training/images/myskillsandinterests.jpg")',
					messages:[
						{
							when:'advisorpanel.todayMinusDays(2,3,3)',
							message:'Hi, I have completed this Doo-it.',
							read:true,
							fromUser:true
						},
						{
							when:'advisorpanel.todayMinusDays(1,2,3)',
							message:'Hi Tarik,\nThis is your best Doo-It so far - well done.',
							read:false,
							fromUser:false
						}
					]
				}
			]
		}
	],
	restart:function() {
		this.value='';
		this.step=-1;
		this.validateValue();
		this.start();
	},
	validateValue:function() {
		if (this.value=='' || this.value.step<this.steps.length-1) {
			this.value={users:[],step:-1};
			for(var k=0;k<this.users.length;k++) {
				advisorpanel.transposeValues([k]);
			}
			this.step=this.value.step;
		}else{
			this.step=this.value.step-1;
		}
	},
	transposeValues:function(keys) {
		var keyString=keys.join('][');
		var u=null;
		eval("u=advisorpanel.users["+keyString+"];");
		if (typeof(u)!="object") {
			if (keys[keys.length-1]=='"when"') {
				eval("advisorpanel.value.users["+keyString+"]="+u+";");
			}else{
				eval("advisorpanel.value.users["+keyString+"]=advisorpanel.users["+keyString+"];");
			}
		}else{
			for(var k in u) {
				if (isNaN(k)) {
					eval("if (advisorpanel.value.users["+keyString+"]===undefined) advisorpanel.value.users["+keyString+"]={};");
					advisorpanel.transposeValues(keys.concat(['"'+k+'"']));
				}else{
					eval("if (advisorpanel.value.users["+keyString+"]===undefined) advisorpanel.value.users["+keyString+"]=[];");
					advisorpanel.transposeValues(keys.concat([k.toString()]));
				}
			}
		}
	},
	todayMinusDays:function(d,h,m) {
		var today=new Date();
		return new Date(today.getFullYear(),today.getMonth(),today.getDate()-d,today.getHours()-h,today.getMinutes()-m,0);
	},
	nextStep:function() {
		this.clearTriggers();
		this.step++;
		$(this.containers.steps).slideUp(500,function() {
			advisorpanel.displayStep();
		});
	},
	buildEnableTriggers:function() {
		for(var s=0;s<this.steps.length;s++) {
			if (this.steps[s].enabledTriggers!==undefined) {
				for(var t in this.steps[s].enabledTriggers) {
					this.enabledTriggers[t]=this.steps[s].enabledTriggers[t];
				}
			}
		}
	},
	displayStep:function() {
		var s=this.steps[this.step];
		for(var t in s.triggers) this.triggers[t]=s.triggers[t];
		$(this.containers.steps).html(s.message).slideDown();
		if (s.sound!==undefined && s.sound!==null) {
			yoodoo.playSound(s.sound);
		}
	},
	welcomePage:function() {
		var welcome=document.createElement("div");
		var adbutTitle='Open the advisor panel';
		var ins='';
		var tt=[];
		this.advisorMessages=0;
		this.advisorWaiting=0;
		for(var u=0;u<this.value.users.length;u++) {
			if (this.value.users[u].dooits===undefined) this.value.users[u].dooits=[];
			for(var d=0;d<this.value.users[u].dooits.length;d++) {
				if (this.value.users[u].dooits[d].userComplete && !this.value.users[u].dooits[d].complete) this.advisorWaiting++;
				if (this.value.users[u].dooits[d].messages===undefined) this.value.users[u].dooits[d].messages=[];
				for(var m=0;m<this.value.users[u].dooits[d].messages.length;m++) {
					if (!this.value.users[u].dooits[d].messages[m].read && this.value.users[u].dooits[d].messages[m].fromUser) this.advisorMessages++;
				}
			}
		}
		if (this.advisorMessages>0) ins+=' ['+this.advisorMessages+']';
		if (this.advisorWaiting>0) ins+=' <b>['+this.advisorWaiting+']</b>';
		if (this.advisorMessages>0) tt.push("You have "+this.advisorMessages+" message"+(this.advisorMessages==1?"":"s")+" from your users.");
		if (this.advisorMessages>0) tt.push("You have "+this.advisorWaiting+" Doo-it"+(this.advisorWaiting==1?"":"s")+" requiring your acceptance.");
		var bubble='';
		if (tt.length>0) {
			adbutTitle=tt.join('\n');
			bubble="<div class='advisorBubble'><div>"+tt.join("<br />")+"<div class='spike'></div></div></div>";
		}
		var adButton='<button type="button" class="green medium right advisorButton" id="advisorButton" style="position:relative;display:inline-block" title="'+adbutTitle+'">Advisor panel'+ins+bubble+'<div class="advisorArrow"></div></button>';

		$(welcome).addClass("welcome").html('<div style="height:'+yoodoo.option.height+'px"><button type="button" class="logout medium right">Logout</button>'+adButton+'<button type="button" class="green medium right" id="dashboardButton" style="display:none">Return Home</button><button type="button" id="changepassword" class="green medium right">Change my settings</button><div class="yoodoo-title">'+yoodoo.site.welcome_title+'</div><h2 class="clear">'+yoodoo.home_screen_title+'</h2><div class="welcomeContent" style="display:block"><div class="half halfLeft" style="height:266px;width:374px"><div><h3>My Progress</h3><div id="progress"><div class="progressBack"><div class="progress" style="width:' + (yoodoo.home_percentage_complete * 2) + 'px"></div></div><div class="progressText">'+yoodoo.home_percentage_complete+'%</div><div class="clear"></div><div>'+yoodoo.home_level_text+'</div><div id="averageScoreDiv" style="display: block;"></div></div><div class="episodeText">' + yoodoo.home_episode_text + '</div></div></div><div class="half" style="height:266px;width:374px"><div class="tip"><div class="tipContent"></div></div></div><div class="footerLinks"></div><center><button type="button" id="continue" class="green reversed">Continue</button></center></div><div style="clear:both;display:none" id="detailsChanger"><div class="welcomeTabs"><a href="javascript:void(0)" class="on">Change your password</a><a href="javascript:void(0)" class="">Change your details</a></div><div class="welcomeTabContent on"><div class="clear inputline"><label>your current password</label><input type="password" id="oldpassword" maxlength="20"></div><div class="clear inputline"><label>your new password</label><input type="password" id="newpassword" maxlength="20"></div><div class="clear inputline"><label>confirm new password</label><input type="password" id="newpasswordagain" maxlength="20"></div><button type="button" id="updatePassword" class="green" style="margin-left:250px">change</button></div><div class="welcomeTabContent" style="display:none"><div class="clear inputline"><label>email address</label><input type="text" id="emailaddress" maxlength="100"></div><div class="clear inputline"><label>first name</label><input type="text" id="firstname" maxlength="20"></div><div class="clear inputline"><label>last name</label><input type="text" id="lastname" maxlength="20"></div><div class="clear inputline"><label>username</label><input type="text" id="username" maxlength="128"></div><div class="clear inputline"><label>nickname</label><input type="text" id="nickname" maxlength="255"></div><button type="button" id="updateDetails" class="green" style="margin-left:250px">change</button></div><div class="error">&nbsp;</div><div class="messenger"></div></div></div>');
		setTimeout('if (advisorpanel!==undefined) advisorpanel.loseBubble()',5000);
		$(welcome).find('.advisorButton').bind("click",function() {
			advisorpanel.showPanel();
		});
		return welcome;
	},
	loseBubble:function() {
		$(this.containers.stage).find('.advisorBubble').fadeOut(3000,function() {
			$(this).remove();
		});
	},
	showPanel:function() {
		if (advisorpanel.enabledTriggers.openPanel()) {
			$(this.containers.stage).find(".welcome").slideUp(500,function() {
				advisorpanel.triggers.openPanel();
				$(this).remove();
				var pan=advisorpanel.panel();
				$(advisorpanel.containers.stage).append(pan);
				$(pan).slideDown();
			});
		}
	},
	returnhome:function() {
		if (advisorpanel.enabledTriggers.returnHome()) {
			$(this.containers.stage).find(".advisorpanelPanel").slideUp(500,function() {
				advisorpanel.triggers.returnHome();
				$(this).remove();
				var pan=advisorpanel.welcomePage();
				$(pan).css({display:"none"});
				$(advisorpanel.containers.stage).append(pan);
				$(pan).slideDown();
			});
		}
	},
	panel:function() {
		var div=document.createElement("div");
		$(div).addClass("advisorpanelPanel");
		$(div).html('<div id="advisorRetained"><button type="button" onclick="advisorpanel.returnhome()" class="green medium right">Return Home</button><h2 style="margin-left:10px">Advisor Panel</h2><div style="clear: both; height: 377px;" id="advisorPanel"><div class="advisees"><div>Your users...</div>'+this.userList()+'</div><div class="advisee" style="display:none"></div></div></div>');
		return div;
	},
	userList:function() {
		var ins='';
		for(var u=0;u<this.value.users.length;u++) {
			ins+="<button type='button' onclick='advisorpanel.showuser("+u+")'>"+this.value.users[u].name;
			var unread=0;
			var waiting=0;
			for(var d=0;d<this.value.users[u].dooits.length;d++) {
				if (!this.value.users[u].dooits[d].complete && this.value.users[u].dooits[d].userComplete) waiting++;
				for(var m=0;m<this.value.users[u].dooits[d].messages.length;m++) {
					if (!this.value.users[u].dooits[d].messages[m].read && this.value.users[u].dooits[d].messages[m].fromUser) unread++;
				}
			}
			if (waiting>0) ins+=" ["+waiting+" waiting]";
			if (unread>0) ins+=" ["+unread+" unread]";
			ins+="</button>\n";
		}
		return ins;
	},
	showingUser:0,
	showingDooit:0,
	showuser:function(u) {
		if (advisorpanel.enabledTriggers.clickUser(u)) {
			this.showingUser=u;
			var cont=$(this.containers.stage).find(".advisee");
			if (cont.css("display")!="none") {
				cont.slideUp(500,function() {
					advisorpanel.showuser(u);
				});
			}else{
				advisorpanel.triggers.clickUser(u);
				cont.empty();
				var dooits=advisorpanel.getUserDooits(u);
				cont.html(dooits).slideDown(500);
				$(cont).find('.adviseeDooit').bind("click",function() {
					if ($(this).next().css("display")=="none") {
						var d=$(this).prevAll('.adviseeDooit').get().length;
						advisorpanel.showingDooit=d;
						advisorpanel.triggers.expandDooit(advisorpanel.showingUser,d);
						for(var m=0;m<advisorpanel.value.users[advisorpanel.showingUser].dooits[d].messages.length;m++) {
							advisorpanel.value.users[advisorpanel.showingUser].dooits[d].messages[m].read=true;
						}
						$(this).addClass("open").removeClass("unread").siblings('.open').removeClass("open");
						var nt=$(this).find(">nobr").html();
						if (nt!==undefined) $(this).find(">nobr").html(nt.replace(/\[[^\]]*\]/,''));
						$(this).next().slideDown().siblings('.dooitMessages').slideUp();
					}else{
						$(this).removeClass("open").next().slideUp();
					}
				});
			}
		}
	},
	getUserDooits:function(u) {
		var ins="<h3>"+this.value.users[u].name+"</h3>";
		for(var d=0;d<this.value.users[u].dooits.length;d++) {
			var waiting=(this.value.users[u].dooits[d].userComplete && !this.value.users[u].dooits[d].complete);
			var unread=0;
			for(var m=0;m<this.value.users[u].dooits[d].messages.length;m++) {
				if (!this.value.users[u].dooits[d].messages[m].read && this.value.users[u].dooits[d].messages[m].fromUser) unread++;
			}
			ins+="<div class='adviseeDooit"+(this.value.users[u].dooits[d].userComplete?" userCompleted":"")+(this.value.users[u].dooits[d].complete?" completed":"")+((unread>0)?" unread":"")+"'>";
			if (this.value.users[u].dooits[d].messages.length>0) {
				ins+="<nobr>"+this.value.users[u].dooits[d].messages.length+" message"+((this.value.users[u].dooits[d].messages.length>1)?"s":"");
				if (unread>0) ins+=" ["+unread+" unread]</nobr>";
				ins+="</nobr>";
			}
			ins+="<div><span>&nbsp;</span>"+this.value.users[u].dooits[d].name;
			if (waiting) ins+=" <em style='color:#f99' class='awaiting'>Awaiting acceptance</em>";
			ins+="</div>";
			ins+="</div>";
			ins+="<div class='dooitMessages' style='display:none'>";
			ins+="<div><div class='advisorMessageHeader'>";
			if (waiting) ins+="<button type='button' onclick='advisorpanel.approve(this,"+u+","+d+")'>Approve completion</button>";
			if (this.value.users[u].dooits[d].userComplete) ins+="<button type='button' onclick='"+this.value.users[u].dooits[d].viewAction+"'>View their Doo-it</button>";
			ins+="Messages:</div>";
			for(var m=0;m<this.value.users[u].dooits[d].messages.length;m++) {
				ins+=this.messageHTML(u,d,m);
				/*ins+="<div class='advisorMessage"+(this.value.users[u].dooits[d].messages[m].fromUser?" fromUser":" fromMe")+(this.value.users[u].dooits[d].messages[m].read?"":" unread")+"'>";
				ins+="<nobr><b>"+(this.value.users[u].dooits[d].messages[m].fromUser?this.value.users[u].name:"Me")+"</b> - <span>"+yoodoo.ago(this.value.users[u].dooits[d].messages[m].when)+"</span></nobr>";
				ins+="<div>"+this.value.users[u].dooits[d].messages[m].message+"</div></div>";*/
			}
			ins+="</div>";
			ins+="<div class='advisorCommenter'>New message:<textarea></textarea><button type='button' onclick='advisorpanel.sendMessage(this,"+u+","+d+")'>Send</button></div>";
			ins+="</div>";
		}
		return ins;
	},
	messageHTML:function(u,d,m) {
		var ins="<div class='advisorMessage"+(this.value.users[u].dooits[d].messages[m].fromUser?" fromUser":" fromMe")+(this.value.users[u].dooits[d].messages[m].read?"":" unread")+"'>";
		ins+="<nobr><b>"+(this.value.users[u].dooits[d].messages[m].fromUser?this.value.users[u].name:"Me")+"</b> - <span>"+yoodoo.ago(this.value.users[u].dooits[d].messages[m].when)+"</span></nobr>";
		ins+="<div>"+this.value.users[u].dooits[d].messages[m].message+"</div></div>";
		return ins;
	},
	showDooit:function(img) {
		if (advisorpanel.enabledTriggers.viewDooit(advisorpanel.showingUser,advisorpanel.showingDooit)) {
			$(this.containers.stage).find(".advisorpanelPanel").slideUp(500,function() {
				advisorpanel.triggers.viewDooit(advisorpanel.showingUser,advisorpanel.showingDooit);
				//$(this).remove();
				var pan=advisorpanel.dooit(img);
				$(pan).css({display:"none"});
				$(advisorpanel.containers.stage).append(pan);
				$(pan).slideDown();
			});
		}
	},
	dooit:function(img) {
		var footer='<div class="overlayFooter" style="z-index:1;width: '+(yoodoo.option.width-8)+'px;"><div style="position:relative"><div class="footerWarning" style="display:none"></div><button type="button" class="hide footerbutton" onclick="advisorpanel.backToPanel()">back</button><div></div></div>';
		var div=document.createElement("div");
		$(div).addClass("adviseDooit").css({'border-radius':'3px',top:4,position:"relative",height:yoodoo.option.height-8,width:yoodoo.option.width-8,background:'url('+img+') top center no-repeat #fff',margin:"4px"}).append(footer);
		var mes='Snapshot loaded from '+this.value.users[this.showingUser].name;
		$(div).find(".footerWarning").html(mes).slideDown(1000,function() {
			setTimeout('if (advisorpanel!==undefined) advisorpanel.hideDooitMessage();',3000);
		});
		return div;
	},
	backToPanel:function() {
		if (advisorpanel.enabledTriggers.backDooit(advisorpanel.showingUser,advisorpanel.showingDooit)) {
			$(this.containers.stage).find(".adviseDooit").slideUp(500,function() {
				advisorpanel.triggers.backDooit(advisorpanel.showingUser,advisorpanel.showingDooit);
				$(this).remove();
				$(advisorpanel.containers.stage).find(".advisorpanelPanel").slideDown();
			});
		}
	},
	hideDooitMessage:function() {
		$(this.containers.stage).find(".footerWarning").slideUp(1000,function() {
		});
	},
	approve:function(o,u,d) {
		if (advisorpanel.enabledTriggers.approveDooit(u,d)) {
			advisorpanel.triggers.approveDooit(u,d);
			advisorpanel.value.users[u].dooits[d].complete=true;
			$(o).parent().parent().parent().prev().addClass("completed").find(".awaiting").fadeOut(500,function() {$(this).remove();});
			$(o).remove();
		}
	},
	sendMessage:function(o,u,d) {
		var txt=$(o).prev("textarea").val();
		txt=txt.replace(/^ +/,'').replace(/ +$/,'');
		if (txt!="") {
			if (advisorpanel.enabledTriggers.sendMessage(u,d,txt)) {
				advisorpanel.triggers.sendMessage(u,d,txt);
				advisorpanel.value.users[u].dooits[d].messages.push({
								when:new Date(),
								message:txt,
								read:false,
								fromUser:false});
				var more=advisorpanel.messageHTML(u,d,advisorpanel.value.users[u].dooits[d].messages.length-1);
				$(o).parent().prev().append(more);
				$(o).prev("textarea").val('');
			}
		}
	},
	loadFields:function() {
		if(this.key===null || array_of_fields[this.key]==undefined) this.key=null;
		if (this.key===null && array_of_default_fields.length>0) this.key=array_of_default_fields[0];
		if (this.key===null) {
			for(var k in array_of_fields) {
				if(this.key===null) this.key=k;
			}
		}
		if(this.key!==null) {
			try{
				eval('this.value='+array_of_fields[this.key][1]+';');
			}catch(e){
				this.value=array_of_fields[this.key][1];
			}
		}
		for(var k in array_of_fields) {
			if (k!=this.key) {
				try{
					eval('this.fields["'+k+'"]='+array_of_fields[k][1]+';');
				}catch(e){
					this.fields[k]=array_of_fields[this.key][1];
				}
			}
		}
		this.value=dooit.decode(this.value);
		this.fields=dooit.decode(this.fields);
	},
	transposeOptions:function(keys,obj) {
		for(var k in obj) {
			if(typeof(obj[k])=="object") {
				var thiskeys=keys.slice();
				thiskeys.push(k);
				this.transposeOptions(thiskeys,obj[k]);
			}else{
				this.setOption(keys,k,obj[k]);
			}
		}
	},
	setOption:function(keys,key,val) {
		try{
			var e=keys.join('.');
			if(e!='') {
				e='this.'+e;
			}else{
				e='this';
			}
			if(isNaN(key)) {
				e+='.'+key+"=val;";
			}else{
				e+='['+key+']=val;';
			}
			eval(e);

		}catch(e){}
	},
	finishable:function() {
		var ok=(this.step==this.steps.length-1);
		return ok;
	},
	output:function() {
		if (this.finishable) dooit.addTag("advisorPanelDooitComplete");
		this.value.step=this.step;
		var op=(dooit.json(this.value));
		array_of_fields[this.key][1]=op;
		var reply={};
		eval('reply.EF'+array_of_fields[this.key][0]+'=op;');
		return reply;
	}
};
