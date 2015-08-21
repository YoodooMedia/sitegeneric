dooit.temporaries('thomas_tagging');
var thomas_tagging={
	groups:{
		'group1':['ver-highc-lowd','ver-highd-lowc'],
		'factors':['creativeness','drive','individuality','goodwill','contactability','selfconfidence','patience','reflectiveness','persistence','adaptability','perfectionism','sensitivity']
	},
	rules:[
		{
			group:'group1',
			tag:'ver-highc-lowd',
			unique:true,
			remove:true,
			bool:'or',
			scoreType:0, // 0=work, 1=behaviour under pressure 2=self image
			checks:[
				{
					score:'C',
					comparison:['>D'],
					//highest:true,
					//lowest:false,
					//index:2,
					bool:'or'
				}				
			]
		},
		{
			group:'group1',
			tag:'ver-highd-lowc',
			unique:true,
			remove:true,
			bool:'or',
			scoreType:0, // 0=work, 1=behaviour under pressure 2=self image
			checks:[
				{
					score:'D',
					comparison:['>C'],
					//highest:true,
					//lowest:false,
					//index:2,
					bool:'or'
				}				
			]
		},
		{
			group:'factors',
			tag:'creativeness',
			unique:true,
			remove:true,
			bool:'and',
			scoreType:2,
			checks:[
				{
					score:'D',
					highest:true
				},
				{
					score:'I',
					lowest:true
				}			
			]
		},
		{
			group:'factors',
			tag:'drive',
			unique:true,
			remove:true,
			bool:'and',
			scoreType:2,
			checks:[
				{
					score:'D',
					highest:true
				},
				{
					score:'S',
					lowest:true
				}			
			]
		},
		{
			group:'factors',
			tag:'individuality',
			unique:true,
			remove:true,
			bool:'and',
			scoreType:2,
			checks:[
				{
					score:'D',
					highest:true
				},
				{
					score:'C',
					lowest:true
				}			
			]
		},
		{
			group:'factors',
			tag:'goodwill',
			unique:true,
			remove:true,
			bool:'and',
			scoreType:2,
			checks:[
				{
					score:'I',
					highest:true
				},
				{
					score:'D',
					lowest:true
				}			
			]
		},
		{
			group:'factors',
			tag:'contactability',
			unique:true,
			remove:true,
			bool:'and',
			scoreType:2,
			checks:[
				{
					score:'I',
					highest:true
				},
				{
					score:'S',
					lowest:true
				}			
			]
		},
		{
			group:'factors',
			tag:'selfconfidence',
			unique:true,
			remove:true,
			bool:'and',
			scoreType:2,
			checks:[
				{
					score:'I',
					highest:true
				},
				{
					score:'C',
					lowest:true
				}			
			]
		},
		{
			group:'factors',
			tag:'patience',
			unique:true,
			remove:true,
			bool:'and',
			scoreType:2,
			checks:[
				{
					score:'S',
					highest:true
				},
				{
					score:'D',
					lowest:true
				}			
			]
		},
		{
			group:'factors',
			tag:'reflectiveness',
			unique:true,
			remove:true,
			bool:'and',
			scoreType:2,
			checks:[
				{
					score:'S',
					highest:true
				},
				{
					score:'I',
					lowest:true
				}			
			]
		},
		{
			group:'factors',
			tag:'persistence',
			unique:true,
			remove:true,
			bool:'and',
			scoreType:2,
			checks:[
				{
					score:'S',
					highest:true
				},
				{
					score:'C',
					lowest:true
				}			
			]
		},
		{
			group:'factors',
			tag:'adaptability',
			unique:true,
			remove:true,
			bool:'and',
			scoreType:2,
			checks:[
				{
					score:'C',
					highest:true
				},
				{
					score:'D',
					lowest:true
				}			
			]
		},
		{
			group:'factors',
			tag:'perfectionism',
			unique:true,
			remove:true,
			bool:'and',
			scoreType:2,
			checks:[
				{
					score:'C',
					highest:true
				},
				{
					score:'I',
					lowest:true
				}			
			]
		},
		{
			group:'factors',
			tag:'sensitivity',
			unique:true,
			remove:true,
			bool:'and',
			scoreType:2,
			checks:[
				{
					score:'C',
					highest:true
				},
				{
					score:'S',
					lowest:true
				}			
			]
		}
	]
};
