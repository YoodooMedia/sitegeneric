dooit.temporaries('quizit_structure');
var quizit_structure={
	title:'Sample Quiz',
	paragraph:'You have 3 pages of questions to complete in 10 minutes... good luck',
	start:"Let's get going...",
	nextPage:"Next page...",
	finish:"Finish and stop the timer...",
	passedMessage:'Congratulations, you passed with a score of {score}',
	failedMessage:'Unfortunately, you did not pass with a score of {score}',
	redoable:true,
	navigable:false, // only if the quiz or pages have no timer
	timeout:'70', // 10 minutes
	//timeout:null, // 10 minutes
	timeoutMessage:'You took too long!',
	completeOnPassOnly:true,
	passMark:75,
	scoreTagRules:[
		{
			tag:"did well",
			unique:true, // remove tags in the other scoreTagRules
			unset:true, // remove if not matched
			above:{
				compare:'<=',
				value:90
			},
			below:{
				compare:'>',
				value:80
			},
			stop:false // if true do not validate the following rules
		},{
			tag:"almost did well",
			unique:true, // remove tags in the other scoreTagRules
			unset:true, // remove if not matched
			above:{
				compare:'<=',
				value:80
			},
			below:{
				compare:'>',
				value:70
			},
			stop:false // if true do not validate the following rules
		}
	],
	timerWarnings:[
		{
			timeLeft:60,
			message:'Not long left!',
			colour:'#900'
		},{
			timeLeft:10,
			message:'Hurry up!',
			colour:'#f00'
		}
	],
	pages:[
		{
			title:'Page 1',
			paragraph:'Some simple ones to get started with...',
			timeout:null,
			timeoutMessage:null,
			shuffle:'All',
			autoProgress:true,
			questions:[
				{
					type:'Text',
					title:'Can you type?',
					paragraph:'Type in &lsquo;there&rsquo;',
					caseInsensative:true,
					options:[
						{
							title:'their',
							score:1
						},{
							title:'There',
							score:2
						},{
							title:'They\'re',
							score:1
						}
					]
				},{
					type:'Select',
					title:'Which is not right?',
					paragraph:'Select the correct answer.',
					options:[
						{
							title:'Correct',
							score:0
						},{
							title:'Wrong',
							score:1
						}
					]
				},{
					type:'Drag and Drop',
					title:'Which is right?',
					paragraph:'The correct answer is [blank].',
					options:[
						{
							title:'Correct',
							score:1
						},{
							title:'Wrong',
							score:0
						}
					]
				},{
					type:'Reorder',
					title:'Put these items in order of priority',
					paragraph:'Put these words in integer order.',
					positions:3,
					scores:{
						position:[1,1,1], // ensure the sum of these is less than or equal to the 'all' value
						all:4
					},
					options:[ // defined in the correct order
						{
							title:'First'
						},{
							title:'Second'
						},{
							title:'Third'
						},{
							title:'Fourth'
						}
					]
				},{
					type:'Multiple choice',
					title:'Which is not right?',
					options:[
						{
							title:'Correct',
							score:0
						},{
							title:'Wrong',
							score:1
						}
					]
				},{
					type:'Multiple choice',
					title:'Which is not right?',
					options:[
						{
							title:'Correct',
							score:0
						},{
							title:'Wrong',
							score:1
						}
					]
				}
			]
		},{
			title:'Page 2',
			paragraph:'A little harder...',
			timeout:null,
			timeoutMessage:null,
			shuffle:'All',
			autoProgress:true,
			questions:[
				{
					type:'Multiple choice',
					title:'Which is right?',
					options:[
						{
							title:'Correct',
							score:1
						},{
							title:'Wrong',
							score:0
						}
					]
				},{
					type:'Multiple choice',
					title:'Which is not right?',
					options:[
						{
							title:'Correct',
							score:0
						},{
							title:'Wrong',
							score:1
						}
					]
				}
				
			]
		},{
			title:'Page 3',
			paragraph:'Last batch...',
			timeout:null,
			timeoutMessage:null,
			shuffle:'All',
			autoProgress:true,
			questions:[
				{
					type:'Multiple choice',
					title:'Which is right?',
					options:[
						{
							title:'Correct',
							score:1
						},{
							title:'Wrong',
							score:0
						}
					]
				},{
					type:'Multiple choice',
					title:'Which is not right?',
					options:[
						{
							title:'Correct',
							score:0
						},{
							title:'Wrong',
							score:1
						}
					]
				}
				
			]
		}
	]
};
