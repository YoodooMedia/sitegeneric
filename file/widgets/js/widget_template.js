/* sample layout
{
	dependencies:[
		['widgets/js/widget_template.js',true],
		['widgets/css/widget_template.css',true]
	],
	continueControl:false,
	ready:function(src) {
		src.object=new widget_template(src);
	},
	key:'',
	options:{

	}
}
*/


function widget_template(src) {
	this.widget=src;
	this.widget.allow_continue=true;
	this.showTool=true;
	this.showWidget=true;
	this.widget.priority=0;
	this.build=function() {
		this.widget.priority=Math.random()*100;
		this.renderWidget();
		this.renderTool();
	};
	this.showIntervention=function() {
		this.widget.showIntervention();
	};
	this.field_was_updated=function() { // required
		this.renderWidget();
	};
	this.renderWidget=function() { // draw an html string
		this.widget.drawWidget({html:this.showWidget?'boo':null});
	};
	this.renderTool=function() { // draw an html string
		this.widget.drawTool({title:this.showTool?'boo':null,icon:yoodoo.icons.get('groups',100,100)});
	};
	this.build();
}

