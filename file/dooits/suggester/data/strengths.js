dooit.temporaries('strengths','weaknesses','is_strength','is_weakness');
is_strength=function(k) {
	for(var s=0;s<strengths.length;s++) {
		if (strengths[s]==k) return true;
	}
	return false;
};
is_weakness=function(k) {
	for(var s=0;s<weaknesses.length;s++) {
		if (weaknesses[s]==k) return true;
	}
	return false;
};
var strengths=[
	'Analysing numbers and situations',
	'Communicating with other people',
	'Creative and imaginative thinking',
	'Dealing with customers',
	'Getting started by myself',
	'Keeping calm when other people are angry',
	'Learning new things fast',
	'Listening to other people',
	'Making decisions',
	'Managing money',
	'Managing my time',
	'Motivating other people',
	'Multi-tasking',
	'Negotiating',
	'Organising people, events etc.',
	'Sales',
	'Seeing opportunities',
	'Seeing the good side of situations',
	'Seeing things through',
	'Solving problems',
	'Taking Responsibility',
	'Teaching and training',
	'Thinking clearly and logically',
	'Working in a team'
];
var weaknesses=[
	'Nervous around other people',
	'Over-passionate about things which matter to me',
	'Too nosey',
	'Missing skills in some areas',
	'A bit scatty',
	'Disorganised',
	'Uncomfortable with change',
	'Too quick to get angry',
	'Slow to understand new things',
	'Late for work or meetings',
	'Negative / Depressed',
	'More likely to give up than see things through',
	'Happier on my own',
	'Unreliable'
];
