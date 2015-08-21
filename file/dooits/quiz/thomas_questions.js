dooit.temporaries('thomas_quiz');

var thomas_quiz={
	dooit:{
		randomize:true,
		randomizeoptions:false,
		redoable:false,
		scoring:'none',
		buttonsUniqueInGroups:true,
		serialize:true,
		subheading:'',
		title:'Thomas profiling'
	},
	structure:[
		{
			id:'thomas0',
			required:'0',
			title:'You will now be asked a series of questions...',
			paragraph:"<center><img src='http://www.yoodoo.biz/uploads/sitegeneric/image/dooits/quiz/phrenology.png' /></center>You don't just want to find any old job - to really succeed, you want the right job. To do that, you need to know yourself: your talents, motivations and what makes you happy. This Doo-it will uncover all those things - in under ten minutes. It's called your Personality Profile, and it might just open your eyes to a whole new future. Hit 'Next' to start!",
			value:{
				grouped:'0',
				multiple:'0',
				type:'paragraph',
				option:[]
			}
		},
		{
			id:'thomas1m',
			required:'1',
			title:'Most like you...',
			paragraph:'',
			value:{
				grouped:'0',
				multiple:'0',
				type:'buttons',
				option:[
					{title:'<b>gentle</b><br />mild',isdefault:'0'},
					{title:'<b>persuasive</b><br />can get others to agree',isdefault:'0'},
					{title:'<b>humble</b><br />modest',isdefault:'0'},
					{title:'<b>original</b><br />creative',isdefault:'0'}
				]
			}
		},
		{
			id:'thomas1l',
			required:'1',
			title:'Least like you...',
			paragraph:'',
			value:{
				grouped:'1',
				multiple:'0',
				type:'buttons',
				option:[
					{title:'<b>gentle</b><br />mild',isdefault:'0'},
					{title:'<b>persuasive</b><br />can get others to agree',isdefault:'0'},
					{title:'<b>humble</b><br />modest',isdefault:'0'},
					{title:'<b>original</b><br />creative',isdefault:'0'}
				]
			}
		},
		{
			id:'thomas2m',
			required:'1',
			title:'Most like you...',
			paragraph:'',
			value:{
				grouped:'0',
				multiple:'0',
				type:'buttons',
				option:[
					{title:'<b>attractive</b><br />appealing',isdefault:'0'},
					{title:'<b>dutiful</b><br />do what is expected of me',isdefault:'0'},
					{title:'<b>stubborn</b><br />firm in my views',isdefault:'0'},
					{title:'<b>pleasant</b><br />easy going',isdefault:'0'}
				]
			}
		},
		{
			id:'thomas2l',
			required:'1',
			title:'Least like you...',
			paragraph:'',
			value:{
				grouped:'1',
				multiple:'0',
				type:'buttons',
				option:[
					{title:'<b>attractive</b><br />appealing',isdefault:'0'},
					{title:'<b>dutiful</b><br />do what is expected of me',isdefault:'0'},
					{title:'<b>stubborn</b><br />firm in my views',isdefault:'0'},
					{title:'<b>pleasant</b><br />easy going',isdefault:'0'}
				]
			}
		},
		{
			id:'thomas3m',
			required:'1',
			title:'Most like you...',
			paragraph:'',
			value:{
				grouped:'0',
				multiple:'0',
				type:'buttons',
				option:[
					{title:'<b>easily led</b><br />tend to follow others',isdefault:'0'},
					{title:'<b>bold</b><br />not afraid to have a go',isdefault:'0'},
					{title:'<b>loyal</b><br />trustworthy',isdefault:'0'},
					{title:'<b>charming</b><br />liked by people',isdefault:'0'}
				]
			}
		},
		{
			id:'thomas3l',
			required:'1',
			title:'Least like you...',
			paragraph:'',
			value:{
				grouped:'1',
				multiple:'0',
				type:'buttons',
				option:[
					{title:'<b>easily led</b><br />tend to follow others',isdefault:'0'},
					{title:'<b>bold</b><br />not afraid to have a go',isdefault:'0'},
					{title:'<b>loyal</b><br />trustworthy',isdefault:'0'},
					{title:'<b>charming</b><br />liked by people',isdefault:'0'}
				]
			}
		},
		{
			id:'thomas4m',
			required:'1',
			title:'Most like you...',
			paragraph:'',
			value:{
				grouped:'0',
				multiple:'0',
				type:'buttons',
				option:[
					{title:'<b>open-minded</b><br />value all ideas',isdefault:'0'},
					{title:'<b>obliging</b><br />try to please others',isdefault:'0'},
					{title:'<b>will power</b><br />resolve',isdefault:'0'},
					{title:'<b>cheerful</b><br />smiling',isdefault:'0'}
				]
			}
		},
		{
			id:'thomas4l',
			required:'1',
			title:'Least like you...',
			paragraph:'',
			value:{
				grouped:'1',
				multiple:'0',
				type:'buttons',
				option:[
					{title:'<b>open-minded</b><br />value all ideas',isdefault:'0'},
					{title:'<b>obliging</b><br />try to please others',isdefault:'0'},
					{title:'<b>will power</b><br />resolve',isdefault:'0'},
					{title:'<b>cheerful</b><br />smiling',isdefault:'0'}
				]
			}
		},
		{
			id:'thomas5m',
			required:'1',
			title:'Most like you...',
			paragraph:'',
			value:{
				grouped:'0',
				multiple:'0',
				type:'buttons',
				option:[
					{title:'<b>jolly</b><br />joyful',isdefault:'0'},
					{title:'<b>precise</b><br />do things accurately',isdefault:'0'},
					{title:'<b>courageous</b><br />have courage',isdefault:'0'},
					{title:'<b>even-tempered</b><br />not up and down',isdefault:'0'}
				]
			}
		},
		{
			id:'thomas5l',
			required:'1',
			title:'Least like you...',
			paragraph:'',
			value:{
				grouped:'1',
				multiple:'0',
				type:'buttons',
				option:[
					{title:'<b>jolly</b><br />joyful',isdefault:'0'},
					{title:'<b>precise</b><br />do things accurately',isdefault:'0'},
					{title:'<b>courageous</b><br />have courage',isdefault:'0'},
					{title:'<b>even-tempered</b><br />not up and down',isdefault:'0'}
				]
			}
		},
		{
			id:'thomas6m',
			required:'1',
			title:'Most like you...',
			paragraph:'',
			value:{
				grouped:'0',
				multiple:'0',
				type:'buttons',
				option:[
					{title:'<b>competitive</b><br />like to compete',isdefault:'0'},
					{title:'<b>considerate</b><br />think of the needs of others',isdefault:'0'},
					{title:'<b>happy</b><br />cheerful',isdefault:'0'},
					{title:'<b>harmonious</b><br />will try to avoid bad feelings',isdefault:'0'}
				]
			}
		},
		{
			id:'thomas6l',
			required:'1',
			title:'Least like you...',
			paragraph:'',
			value:{
				grouped:'1',
				multiple:'0',
				type:'buttons',
				option:[
					{title:'<b>competitive</b><br />like to compete',isdefault:'0'},
					{title:'<b>considerate</b><br />think of the needs of others',isdefault:'0'},
					{title:'<b>happy</b><br />cheerful',isdefault:'0'},
					{title:'<b>harmonious</b><br />will try to avoid bad feelings',isdefault:'0'}
				]
			}
		},
		{
			id:'thomas7m',
			required:'1',
			title:'Most like you...',
			paragraph:'',
			value:{
				grouped:'0',
				multiple:'0',
				type:'buttons',
				option:[
					{title:'<b>fussy</b><br />perfectionist',isdefault:'0'},
					{title:'<b>obedient</b><br />follow rules ',isdefault:'0'},
					{title:'<b>won’t be beaten</b><br />want to win',isdefault:'0'},
					{title:'<b>playful</b><br />full of fun',isdefault:'0'}
				]
			}
		},
		{
			id:'thomas7l',
			required:'1',
			title:'Least like you...',
			paragraph:'',
			value:{
				grouped:'1',
				multiple:'0',
				type:'buttons',
				option:[
					{title:'<b>fussy</b><br />perfectionist',isdefault:'0'},
					{title:'<b>obedient</b><br />follow rules ',isdefault:'0'},
					{title:'<b>won’t be beaten</b><br />want to win',isdefault:'0'},
					{title:'<b>playful</b><br />full of fun',isdefault:'0'}
				]
			}
		},
		{
			id:'thomas8m',
			required:'1',
			title:'Most like you...',
			paragraph:'',
			value:{
				grouped:'0',
				multiple:'0',
				type:'buttons',
				option:[
					{title:'<b>brave</b><br />gutsy',isdefault:'0'},
					{title:'<b>inspiring</b><br />encourage others by actions and words',isdefault:'0'},
					{title:'<b>willing to submit</b><br />give in to others',isdefault:'0'},
					{title:'<b>timid</b><br />not happy taking chances',isdefault:'0'}
				]
			}
		},
		{
			id:'thomas8l',
			required:'1',
			title:'Least like you...',
			paragraph:'',
			value:{
				grouped:'1',
				multiple:'0',
				type:'buttons',
				option:[
					{title:'<b>brave</b><br />gutsy',isdefault:'0'},
					{title:'<b>inspiring</b><br />encourage others by actions and words',isdefault:'0'},
					{title:'<b>willing to submit</b><br />give in to others',isdefault:'0'},
					{title:'<b>timid</b><br />not happy taking chances',isdefault:'0'}
				]
			}
		},
		{
			id:'thomas9m',
			required:'1',
			title:'Most like you...',
			paragraph:'',
			value:{
				grouped:'0',
				multiple:'0',
				type:'buttons',
				option:[
					{title:'<b>sociable</b><br />friendly',isdefault:'0'},
					{title:'<b>patient</b><br />will wait until the time is right',isdefault:'0'},
					{title:'<b>independent</b><br />rely on myself',isdefault:'0'},
					{title:'<b>soft-spoken</b><br />speak in a mild manner',isdefault:'0'}
				]
			}
		},
		{
			id:'thomas9l',
			required:'1',
			title:'Least like you...',
			paragraph:'',
			value:{
				grouped:'1',
				multiple:'0',
				type:'buttons',
				option:[
					{title:'<b>sociable</b><br />friendly',isdefault:'0'},
					{title:'<b>patient</b><br />will wait until the time is right',isdefault:'0'},
					{title:'<b>independent</b><br />rely on myself',isdefault:'0'},
					{title:'<b>soft-spoken</b><br />speak in a mild manner',isdefault:'0'}
				]
			}
		},
		{
			id:'thomas10m',
			required:'1',
			title:'Most like you...',
			paragraph:'',
			value:{
				grouped:'0',
				multiple:'0',
				type:'buttons',
				option:[
					{title:'<b>adventurous</b><br />willing to take risks',isdefault:'0'},
					{title:'<b>receptive</b><br />accept suggestions',isdefault:'0'},
					{title:'<b>polite</b><br />ask for enough and no more',isdefault:'0'},
					{title:'<b>moderate</b><br />calm',isdefault:'0'}
				]
			}
		},
		{
			id:'thomas10l',
			required:'1',
			title:'Least like you...',
			paragraph:'',
			value:{
				grouped:'1',
				multiple:'0',
				type:'buttons',
				option:[
					{title:'<b>adventurous</b><br />willing to take risks',isdefault:'0'},
					{title:'<b>receptive</b><br />accept suggestions',isdefault:'0'},
					{title:'<b>polite</b><br />ask for enough and no more',isdefault:'0'},
					{title:'<b>moderate</b><br />calm',isdefault:'0'}
				]
			}
		},
		{
			id:'thomas11m',
			required:'1',
			title:'Most like you...',
			paragraph:'',
			value:{
				grouped:'0',
				multiple:'0',
				type:'buttons',
				option:[
					{title:'<b>talkative</b><br />talk a lot',isdefault:'0'},
					{title:'<b>controlled</b><br />self-controlled',isdefault:'0'},
					{title:'<b>go with the flow</b><br />toe the line',isdefault:'0'},
					{title:'<b>decisive</b><br />ready to make decisions',isdefault:'0'}
				]
			}
		},
		{
			id:'thomas11l',
			required:'1',
			title:'Least like you...',
			paragraph:'',
			value:{
				grouped:'1',
				multiple:'0',
				type:'buttons',
				option:[
					{title:'<b>talkative</b><br />talk a lot',isdefault:'0'},
					{title:'<b>controlled</b><br />self-controlled',isdefault:'0'},
					{title:'<b>go with the flow</b><br />toe the line',isdefault:'0'},
					{title:'<b>decisive</b><br />ready to make decisions',isdefault:'0'}
				]
			}
		},
		{
			id:'thomas12m',
			required:'1',
			title:'Most like you...',
			paragraph:'',
			value:{
				grouped:'0',
				multiple:'0',
				type:'buttons',
				option:[
					{title:'<b>polished</b><br />poised',isdefault:'0'},
					{title:'<b>daring</b><br />take risks to win',isdefault:'0'},
					{title:'<b>diplomatic</b><br />tactful',isdefault:'0'},
					{title:'<b>satisfied</b><br />fulfilled',isdefault:'0'}
				]
			}
		},
		{
			id:'thomas12l',
			required:'1',
			title:'Least like you...',
			paragraph:'',
			value:{
				grouped:'1',
				multiple:'0',
				type:'buttons',
				option:[
					{title:'<b>polished</b><br />poised',isdefault:'0'},
					{title:'<b>daring</b><br />take risks to win',isdefault:'0'},
					{title:'<b>diplomatic</b><br />tactful',isdefault:'0'},
					{title:'<b>satisfied</b><br />fulfilled',isdefault:'0'}
				]
			}
		},
		{
			id:'thomas13m',
			required:'1',
			title:'Most like you...',
			paragraph:'',
			value:{
				grouped:'0',
				multiple:'0',
				type:'buttons',
				option:[
					{title:'<b>aggressive</b><br />forceful in getting things done',isdefault:'0'},
					{title:'<b>life-of-the-party</b><br />high spirited',isdefault:'0'},
					{title:'<b>soft-touch</b><br />can be taken advantage of',isdefault:'0'},
					{title:'<b>fearful</b><br />usually fear the worst',isdefault:'0'}
				]
			}
		},
		{
			id:'thomas13l',
			required:'1',
			title:'Least like you...',
			paragraph:'',
			value:{
				grouped:'1',
				multiple:'0',
				type:'buttons',
				option:[
					{title:'<b>aggressive</b><br />forceful in getting things done',isdefault:'0'},
					{title:'<b>life-of-the-party</b><br />high spirited',isdefault:'0'},
					{title:'<b>soft-touch</b><br />can be taken advantage of',isdefault:'0'},
					{title:'<b>fearful</b><br />usually fear the worst',isdefault:'0'}
				]
			}
		},
		{
			id:'thomas14m',
			required:'1',
			title:'Most like you...',
			paragraph:'',
			value:{
				grouped:'0',
				multiple:'0',
				type:'buttons',
				option:[
					{title:'<b>cautious</b><br />avoid trouble',isdefault:'0'},
					{title:'<b>determined</b><br />set on doing something',isdefault:'0'},
					{title:'<b>convincing</b><br />can convince others',isdefault:'0'},
					{title:'<b>good-natured</b><br />easy to get on with',isdefault:'0'}
				]
			}
		},
		{
			id:'thomas14l',
			required:'1',
			title:'Least like you...',
			paragraph:'',
			value:{
				grouped:'1',
				multiple:'0',
				type:'buttons',
				option:[
					{title:'<b>cautious</b><br />avoid trouble',isdefault:'0'},
					{title:'<b>determined</b><br />set on doing something',isdefault:'0'},
					{title:'<b>convincing</b><br />can convince others',isdefault:'0'},
					{title:'<b>good-natured</b><br />easy to get on with',isdefault:'0'}
				]
			}
		},
		{
			id:'thomas15m',
			required:'1',
			title:'Most like you...',
			paragraph:'',
			value:{
				grouped:'0',
				multiple:'0',
				type:'buttons',
				option:[
					{title:'<b>willing</b><br />ready to help others',isdefault:'0'},
					{title:'<b>eager</b><br />keen',isdefault:'0'},
					{title:'<b>agreeable</b><br />amenable',isdefault:'0'},
					{title:'<b>high spirited</b><br />full of life',isdefault:'0'}
				]
			}
		},
		{
			id:'thomas15l',
			required:'1',
			title:'Least like you...',
			paragraph:'',
			value:{
				grouped:'1',
				multiple:'0',
				type:'buttons',
				option:[
					{title:'<b>willing</b><br />ready to help others',isdefault:'0'},
					{title:'<b>eager</b><br />keen',isdefault:'0'},
					{title:'<b>agreeable</b><br />amenable',isdefault:'0'},
					{title:'<b>high spirited</b><br />full of life',isdefault:'0'}
				]
			}
		},
		{
			id:'thomas16m',
			required:'1',
			title:'Most like you...',
			paragraph:'',
			value:{
				grouped:'0',
				multiple:'0',
				type:'buttons',
				option:[
					{title:'<b>confident</b><br />believe in myself',isdefault:'0'},
					{title:'<b>sympathetic</b><br />feel sorry for others',isdefault:'0'},
					{title:'<b>tolerant</b><br />accept others for what they are',isdefault:'0'},
					{title:'<b>assertive</b><br />stand up for my rights',isdefault:'0'}
				]
			}
		},
		{
			id:'thomas16l',
			required:'1',
			title:'Least like you...',
			paragraph:'',
			value:{
				grouped:'1',
				multiple:'0',
				type:'buttons',
				option:[
					{title:'<b>confident</b><br />believe in myself',isdefault:'0'},
					{title:'<b>sympathetic</b><br />feel sorry for others',isdefault:'0'},
					{title:'<b>tolerant</b><br />accept others for what they are',isdefault:'0'},
					{title:'<b>assertive</b><br />stand up for my rights',isdefault:'0'}
				]
			}
		},
		{
			id:'thomas17m',
			required:'1',
			title:'Most like you...',
			paragraph:'',
			value:{
				grouped:'0',
				multiple:'0',
				type:'buttons',
				option:[
					{title:'<b>well-disciplined</b><br />accept limits',isdefault:'0'},
					{title:'<b>generous</b><br />happy to share what i have',isdefault:'0'},
					{title:'<b>dramatic</b><br />larger than life',isdefault:'0'},
					{title:'<b>persistent</b><br />finish what i start',isdefault:'0'}
				]
			}
		},
		{
			id:'thomas17l',
			required:'1',
			title:'Least like you...',
			paragraph:'',
			value:{
				grouped:'1',
				multiple:'0',
				type:'buttons',
				option:[
					{title:'<b>well-disciplined</b><br />accept limits',isdefault:'0'},
					{title:'<b>generous</b><br />happy to share what i have',isdefault:'0'},
					{title:'<b>dramatic</b><br />larger than life',isdefault:'0'},
					{title:'<b>persistent</b><br />finish what i start',isdefault:'0'}
				]
			}
		},
		{
			id:'thomas18m',
			required:'1',
			title:'Most like you...',
			paragraph:'',
			value:{
				grouped:'0',
				multiple:'0',
				type:'buttons',
				option:[
					{title:'<b>admirable</b><br />worthy of praise',isdefault:'0'},
					{title:'<b>kind</b><br />kind-hearted',isdefault:'0'},
					{title:'<b>resigned</b><br />let it be, think it’s all over',isdefault:'0'},
					{title:'<b>force-of-character</b><br />determined to get results',isdefault:'0'}
				]
			}
		},
		{
			id:'thomas18l',
			required:'1',
			title:'Least like you...',
			paragraph:'',
			value:{
				grouped:'1',
				multiple:'0',
				type:'buttons',
				option:[
					{title:'<b>admirable</b><br />worthy of praise',isdefault:'0'},
					{title:'<b>kind</b><br />kind-hearted',isdefault:'0'},
					{title:'<b>resigned</b><br />let it be, think it’s all over',isdefault:'0'},
					{title:'<b>force-of-character</b><br />determined to get results',isdefault:'0'}
				]
			}
		},
		{
			id:'thomas19m',
			required:'1',
			title:'Most like you...',
			paragraph:'',
			value:{
				grouped:'0',
				multiple:'0',
				type:'buttons',
				option:[
					{title:'<b>respectful</b><br />show respect',isdefault:'0'},
					{title:'<b>want to be in the lead</b><br />take the first step ahead of the crowd',isdefault:'0'},
					{title:'<b>optimistic</b><br />always look on the bright side',isdefault:'0'},
					{title:'<b>accommodating</b><br />unselfish',isdefault:'0'}
				]
			}
		},
		{
			id:'thomas19l',
			required:'1',
			title:'Least like you...',
			paragraph:'',
			value:{
				grouped:'1',
				multiple:'0',
				type:'buttons',
				option:[
					{title:'<b>respectful</b><br />show respect',isdefault:'0'},
					{title:'<b>want to be in the lead</b><br />take the first step ahead of the crowd',isdefault:'0'},
					{title:'<b>optimistic</b><br />always look on the bright side',isdefault:'0'},
					{title:'<b>accommodating</b><br />unselfish',isdefault:'0'}
				]
			}
		},
		{
			id:'thomas20m',
			required:'1',
			title:'Most like you...',
			paragraph:'',
			value:{
				grouped:'0',
				multiple:'0',
				type:'buttons',
				option:[
					{title:'<b>argumentative</b><br />will argue a lot',isdefault:'0'},
					{title:'<b>adaptable</b><br />will consider alternatives',isdefault:'0'},
					{title:'<b>easy going</b><br />laid-back',isdefault:'0'},
					{title:'<b>light-hearted</b><br />like to have fun',isdefault:'0'}
				]
			}
		},
		{
			id:'thomas20l',
			required:'1',
			title:'Least like you...',
			paragraph:'',
			value:{
				grouped:'1',
				multiple:'0',
				type:'buttons',
				option:[
					{title:'<b>argumentative</b><br />will argue a lot',isdefault:'0'},
					{title:'<b>adaptable</b><br />will consider alternatives',isdefault:'0'},
					{title:'<b>easy going</b><br />laid-back',isdefault:'0'},
					{title:'<b>light-hearted</b><br />like to have fun',isdefault:'0'}
				]
			}
		},
		{
			id:'thomas21m',
			required:'1',
			title:'Most like you...',
			paragraph:'',
			value:{
				grouped:'0',
				multiple:'0',
				type:'buttons',
				option:[
					{title:'<b>trusting</b><br />trust people',isdefault:'0'},
					{title:'<b>contented</b><br />relaxed',isdefault:'0'},
					{title:'<b>positive</b><br />stress good points',isdefault:'0'},
					{title:'<b>peaceful</b><br />peaceable',isdefault:'0'}
				]
			}
		},
		{
			id:'thomas21l',
			required:'1',
			title:'Least like you...',
			paragraph:'',
			value:{
				grouped:'1',
				multiple:'0',
				type:'buttons',
				option:[
					{title:'<b>trusting</b><br />trust people',isdefault:'0'},
					{title:'<b>contented</b><br />relaxed',isdefault:'0'},
					{title:'<b>positive</b><br />stress good points',isdefault:'0'},
					{title:'<b>peaceful</b><br />peaceable',isdefault:'0'}
				]
			}
		},
		{
			id:'thomas22m',
			required:'1',
			title:'Most like you...',
			paragraph:'',
			value:{
				grouped:'0',
				multiple:'0',
				type:'buttons',
				option:[
					{title:'<b>good-mixer</b><br />mix easily with others',isdefault:'0'},
					{title:'<b>cultured</b><br />know how to say and do things right',isdefault:'0'},
					{title:'<b>vigorous</b><br />have a lot of energy',isdefault:'0'},
					{title:'<b>caring</b><br />understanding',isdefault:'0'}
				]
			}
		},
		{
			id:'thomas22l',
			required:'1',
			title:'Least like you...',
			paragraph:'',
			value:{
				grouped:'1',
				multiple:'0',
				type:'buttons',
				option:[
					{title:'<b>good-mixer</b><br />mix easily with others',isdefault:'0'},
					{title:'<b>cultured</b><br />know how to say and do things right',isdefault:'0'},
					{title:'<b>vigorous</b><br />have a lot of energy',isdefault:'0'},
					{title:'<b>caring</b><br />understanding',isdefault:'0'}
				]
			}
		},
		{
			id:'thomas23m',
			required:'1',
			title:'Most like you...',
			paragraph:'',
			value:{
				grouped:'0',
				multiple:'0',
				type:'buttons',
				option:[
					{title:'<b>companionable</b><br />want to be a friend',isdefault:'0'},
					{title:'<b>accurate</b><br />need things to be correct',isdefault:'0'},
					{title:'<b>outspoken</b><br />say what is on my mind',isdefault:'0'},
					{title:'<b>restrained</b><br />keep control of my feelings',isdefault:'0'}
				]
			}
		},
		{
			id:'thomas23l',
			required:'1',
			title:'Least like you...',
			paragraph:'',
			value:{
				grouped:'1',
				multiple:'0',
				type:'buttons',
				option:[
					{title:'<b>companionable</b><br />want to be a friend',isdefault:'0'},
					{title:'<b>accurate</b><br />need things to be correct',isdefault:'0'},
					{title:'<b>outspoken</b><br />say what is on my mind',isdefault:'0'},
					{title:'<b>restrained</b><br />keep control of my feelings',isdefault:'0'}
				]
			}
		},
		{
			id:'thomas24m',
			required:'1',
			title:'Most like you...',
			paragraph:'',
			value:{
				grouped:'0',
				multiple:'0',
				type:'buttons',
				option:[
					{title:'<b>restless</b><br />need to keep busy',isdefault:'0'},
					{title:'<b>neighbourly</b><br />do favours to help',isdefault:'0'},
					{title:'<b>popular</b><br />want to be liked and admired',isdefault:'0'},
					{title:'<b>faithful</b><br />true to family, friends',isdefault:'0'}
				]
			}
		},
		{
			id:'thomas24l',
			required:'1',
			title:'Least like you...',
			paragraph:'',
			value:{
				grouped:'1',
				multiple:'0',
				type:'buttons',
				option:[
					{title:'<b>restless</b><br />need to keep busy',isdefault:'0'},
					{title:'<b>neighbourly</b><br />do favours to help',isdefault:'0'},
					{title:'<b>popular</b><br />want to be liked and admired',isdefault:'0'},
					{title:'<b>faithful</b><br />true to family, friends',isdefault:'0'}
				]
			}
		},
		{
			id:'thomas25',
			required:'0',
			title:'Thank you for completing the questions. Your profile is being calculated...',
			paragraph:'',
			value:{
				grouped:'0',
				multiple:'0',
				type:'paragraph',
				option:[]
			}
		}
	]
}
