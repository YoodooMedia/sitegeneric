/* --- dooit layout ---

	<div class='style_template'></div>
	<script type='text/javascript'>
	function initThis() {
		var params={};
		params.dependencies=[
			['dooits/style_template.js',true]
		];
		params.loaded=function(){
			style_template.init({selectors:{container:'.style_template'}});
		};
		params.saveValues=['style_template.output'];
		params.displayed='style_template.displayed';
		params.finished='style_template.finishable';
		dooit.init(params);
	}
	</script>
*/



dooit.temporaries('style_template');
var style_template={
	selectors:{
		container:'.style_template'
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
		//if (this.key!==null && this.containers.container!==null) {
			// start rendering the dooit
			this.start();
		//}
	},
	start:function() {
		// add the content to this.containers.container
		this.containers.arena=yoodoo.e('div');
		this.containers.h2=yoodoo.e('h2');
		$(this.containers.h2).html('H2 header');
		this.containers.h3=yoodoo.e('h3');
		$(this.containers.h3).html('H3 header');
		this.containers.p=yoodoo.e('p');
		$(this.containers.p).html('Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum tempor neque vel tellus sodales, id scelerisque eros elementum. Sed vulputate nec dui ut commodo. Maecenas libero lectus, volutpat ut mauris vitae, interdum mollis purus. Nam non ante at odio egestas rhoncus.');

		$(this.containers.arena).append(
			$(yoodoo.e("div")).html('div.sectioned').css({
				width:'40%',
				'min-height':60,
				float:'right'
			}).addClass('sectioned')
		);

		$(this.containers.arena).append($(yoodoo.e("input")).attr("type","text").val('input[type=text]'));
		$(this.containers.arena).append($(yoodoo.e("input")).attr("type","text").val('input[type=text].required').addClass("required"));
		$(this.containers.arena).append($(yoodoo.e("textarea")).val('textarea'));
		$(this.containers.arena).append($(yoodoo.e("textarea")).val('textarea.required').addClass("required"));

		$(this.containers.arena).append(
			$(yoodoo.e("div")).append(
				$(yoodoo.e("input")).attr("type","radio").attr("id","radio1").attr("name","radiogroup1")
			).append(
				$(yoodoo.e("label")).html("radio").attr("for","radio1")
			).append(
				$(yoodoo.e("input")).attr("type","radio").attr("id","radio2").attr("name","radiogroup1")
			).append(
				$(yoodoo.e("label")).html("radio required").addClass('required').attr("for","radio2")
			)
		);
		$(this.containers.arena).append(
			$(yoodoo.e("div")).append(
				$(yoodoo.e("input")).attr("type","checkbox").attr("id","check1")
			).append(
				$(yoodoo.e("label")).html("checkbox").attr("for","check1")
			).append(
				$(yoodoo.e("input")).attr("type","checkbox").attr("id","check2")
			).append(
				$(yoodoo.e("label")).html("checkbox required").addClass('required').attr("for","check2")
			)
		);



		var buttons=['','.cta','.off','.on','.rem','.disabled','.next','.back'];
		for (var b=0;b<buttons.length;b++) {
			var but=yoodoo.e("button");
			$(but).attr("type","button").addClass(buttons[b].replace(/\./g,' ')).html('button'+buttons[b]);
			$(this.containers.arena).append(but);
		}

		$(this.containers.container).css({opacity:0}).append(this.containers.h2).append(this.containers.h3).append(this.containers.p).append(this.containers.arena);
	},
	displayed:function() {
		var ysa=$('#yoodooScrolledArea');
		var h=ysa.height()-($(this.containers.arena).offset().top-ysa.offset().top)-8;
		$(this.containers.arena).css({height:h,'overflow-y':'auto'});
		$(this.containers.container).animate({opacity:1},500);
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
		//var op=(dooit.json(this.value));
		//array_of_fields[this.key][1]=op;
		var reply={};
		//eval('reply.EF'+array_of_fields[this.key][0]+'=op;');
		return reply;
	}
}
