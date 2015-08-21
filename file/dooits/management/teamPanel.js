/* --- dooit layout ---

	<div class='teamPanel'>&nbsp;</div>
	<script type='text/javascript'>
	function initThis() {
		var params={};
		params.dependencies=[
			['dooits/managament/teamPanel.js',true],
			['css/managament/teamPanel.ccs',true]
		];
		params.loaded=function(){
			teamPanel.init({selectors:{container:'.teamPanel'}});
		};
		params.saveValues=['teamPanel.output'];
		params.finished='teamPanel.finishable';
		dooit.init(params);
	}
	</script>
*/



dooit.temporaries('teamPanel');
var teamPanel={
	selectors:{
		container:'.teamPanel'
	},
	containers:{
		container:null
	},
	value:null,
	matrixKey:'Suitability',
	key:null,
	fields:{},
	init:function() {
		if (arguments.length>0) this.transposeOptions([],arguments[0]);
		this.loadFields();
		this.containers.container=$(this.selectors.container);
		//if (this.key!==null && this.containers.container!==null) {
			// start rendering the dooit
			this.value=this.sampleData();
			this.start();
		//}
	},
	positions:{
		shelfSpacing:128,
		left:50,
		top:50,
		userhorizontal:80,
		oddUserOffset:30,
		tabspace:30,
		tabtop:100
	},
	sampleData:function() {
		var tmp={users:[
			{name:"Paul Clark",id:1,sex:'male'},
			{name:"Alex Rigg",id:2,sex:'male'},
			{name:"Charlotte Gill",id:3,sex:'female'},
			{name:"James Lacey",id:4,sex:'male'},
			{name:"Deepa Down",id:5,sex:'female'},
			{name:"Gavin Woods",id:6,sex:'male'}
		],matrix:{
			'Suitability':[
				{userid:1,level:0,text:'Conveys clear accountabilities and expectations to others.<br/>Ensures that others have the resources, information, authority, and support to achieve goals.<br />Holds people accountable for meeting deadlines and achieving their goals.'},
				{userid:2,level:0,text:'Conveys clear accountabilities and expectations to others.<br/>Ensures that others have the resources, information, authority, and support to achieve goals.<br />Holds people accountable for meeting deadlines and achieving their goals.'},
				{userid:3,level:1,text:'Conveys clear accountabilities and expectations to others.<br/>Ensures that others have the resources, information, authority, and support to achieve goals.<br />Holds people accountable for meeting deadlines and achieving their goals.'},
				{userid:4,level:1,text:'Conveys clear accountabilities and expectations to others.<br/>Ensures that others have the resources, information, authority, and support to achieve goals.<br />Holds people accountable for meeting deadlines and achieving their goals.'},
				{userid:5,level:2,text:'Conveys clear accountabilities and expectations to others.<br/>Ensures that others have the resources, information, authority, and support to achieve goals.<br />Holds people accountable for meeting deadlines and achieving their goals.'},
				{userid:6,level:2,text:'Conveys clear accountabilities and expectations to others.<br/>Ensures that others have the resources, information, authority, and support to achieve goals.<br />Holds people accountable for meeting deadlines and achieving their goals.'}
			],
			'Manager Interaction':[
				{userid:1,level:1,text:'Conveys clear accountabilities and expectations to others.<br/>Ensures that others have the resources, information, authority, and support to achieve goals.<br />Holds people accountable for meeting deadlines and achieving their goals.'},
				{userid:2,level:0,text:'Conveys clear accountabilities and expectations to others.<br/>Ensures that others have the resources, information, authority, and support to achieve goals.<br />Holds people accountable for meeting deadlines and achieving their goals.'},
				{userid:3,level:2,text:'Conveys clear accountabilities and expectations to others.<br/>Ensures that others have the resources, information, authority, and support to achieve goals.<br />Holds people accountable for meeting deadlines and achieving their goals.'},
				{userid:4,level:1,text:'Conveys clear accountabilities and expectations to others.<br/>Ensures that others have the resources, information, authority, and support to achieve goals.<br />Holds people accountable for meeting deadlines and achieving their goals.'},
				{userid:5,level:1,text:'Conveys clear accountabilities and expectations to others.<br/>Ensures that others have the resources, information, authority, and support to achieve goals.<br />Holds people accountable for meeting deadlines and achieving their goals.'},
				{userid:6,level:2,text:'Conveys clear accountabilities and expectations to others.<br/>Ensures that others have the resources, information, authority, and support to achieve goals.<br />Holds people accountable for meeting deadlines and achieving their goals.'}
			],
			'Team Interaction':[
				{userid:1,level:0,text:'Conveys clear accountabilities and expectations to others.<br/>Ensures that others have the resources, information, authority, and support to achieve goals.<br />Holds people accountable for meeting deadlines and achieving their goals.'},
				{userid:2,level:1,text:'Conveys clear accountabilities and expectations to others.<br/>Ensures that others have the resources, information, authority, and support to achieve goals.<br />Holds people accountable for meeting deadlines and achieving their goals.'},
				{userid:3,level:1,text:'Conveys clear accountabilities and expectations to others.<br/>Ensures that others have the resources, information, authority, and support to achieve goals.<br />Holds people accountable for meeting deadlines and achieving their goals.'},
				{userid:4,level:2,text:'Conveys clear accountabilities and expectations to others.<br/>Ensures that others have the resources, information, authority, and support to achieve goals.<br />Holds people accountable for meeting deadlines and achieving their goals.'},
				{userid:5,level:2,text:'Conveys clear accountabilities and expectations to others.<br/>Ensures that others have the resources, information, authority, and support to achieve goals.<br />Holds people accountable for meeting deadlines and achieving their goals.'},
				{userid:6,level:2,text:'Conveys clear accountabilities and expectations to others.<br/>Ensures that others have the resources, information, authority, and support to achieve goals.<br />Holds people accountable for meeting deadlines and achieving their goals.'}
			]
			
		}};
		return tmp;
	},
	start:function() {
		// add the content to this.containers.container
		this.containers.shelves=document.createElement("div");
		this.containers.tabs=document.createElement("div");
		$(this.containers.tabs).addClass("teamtabs").html("<h2>Team Panel</h2>");
		this.containers.container.append(this.containers.shelves).append(this.containers.tabs);
		this.renderTabs();
		this.makeUsers();
		this.renderShelves();
	},
	makeUsers:function() {
		this.users={};
		for(var u=0;u<this.value.users.length;u++) {
			this.users[this.value.users[u].id]={name:this.value.users[u].name,sex:this.value.users[u].sex,id:this.value.users[u].id,bust:this.bust(this.value.users[u])};
			$(this.containers.shelves).append(this.users[this.value.users[u].id].bust);
		}
	},
	renderTabs:function() {
		var tt=this.positions.tabtop;
		for(var k in this.value.matrix) {
			var t=document.createElement("div");
			$(t).addClass("teamtab").css({top:tt});
			t.key=k;
			if (k==this.matrixKey) $(t).addClass("on");
			$(t).html("<div class='tabLabel'>"+k+"</div>");
			$(this.containers.tabs).append(t);
			$(t).find('.tabLabel').bind("click",function() {
				$(this).parent().siblings().removeClass("on");
				$(this).parent().addClass("on");
				teamPanel.matrixKey=this.parentNode.key;
				teamPanel.renderShelves();
			});
			tt+=this.positions.tabspace;
		}
	},
	renderShelves:function() {
		var t=this.positions.top;
		var l=this.positions.left;
		var counts=[];
		for(var u=0;u<this.value.matrix[this.matrixKey].length;u++) {
			var level=this.value.matrix[this.matrixKey][u].level;
			while(counts[level]===undefined) counts.push(0);
			var shelfTop=this.positions.shelfSpacing*level;
			var offset=0;
			if (u%2==0) offset=this.positions.oddUserOffset;
			var bust=this.users[this.value.matrix[this.matrixKey][u].userid].bust;
			$(bust).css({top:t+offset+shelfTop,left:l+(this.positions.userhorizontal*counts[level])});
			counts[level]++;
		}
	},
	bust:function(u) {
		var head=document.createElement("div");
		$(head).addClass("userBust").html("<div class='reflection'></div><div class='"+u.sex+"'></div><div class='above'><div>"+u.name+"</div></div>");
		head.user=u;
		$(head).bind("click",function() {
			teamPanel.dialog(this.user);
		});
		return head;
	},
	dialog:function(user) {
		var mat=null;
		for(var u=0;u<this.value.matrix[this.matrixKey].length;u++) {
			if (this.value.matrix[this.matrixKey][u].userid==user.id) mat=this.value.matrix[this.matrixKey][u];
		}
		if (mat!==null) {
			var shield=document.createElement("div");
			$(shield).addClass("shield").css({width:this.containers.container.width(),height:this.containers.container.height(),display:"none"});
			var txt='<span style="float:right">'+user.name+'</span><h3>'+this.matrixKey+'</h3>';
			var colours=['#00ff00','#ffff00','#ff0000'];
			txt+="<div style='background:"+colours[mat.level]+";height:5px;'></div>";
			txt+="<div>"+mat.text+"</div>";
			var dialog=document.createElement("div");
			$(dialog).addClass("teamDialog").html(txt).css({display:"none"});
			this.containers.container.append(shield).append(dialog);
			$(shield).bind("click",function() {
				$(this).next('.teamDialog').fadeOut(function() {$(this).remove();});
				$(this).fadeOut(function() {$(this).remove();});
			});
			$(shield).fadeIn();
			$(dialog).fadeIn();
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
		var ok=true;
		return ok;
	},
	output:function() {
		var op=(dooit.json(this.value));
		array_of_fields[this.key][1]=op;
		var reply={};
		eval('reply.EF'+array_of_fields[this.key][0]+'=op;');
		return reply;
	}
};
