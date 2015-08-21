var documents={
	containers:{
		main:null,
		list:null,
		info:null,
		files:null
	},
	layout:"<div class='docDown'></div>\n<script type='text/javascript'>\nfunction initThis() {\nvar params={};\nparams.dependencies=[\n['dooits/utility/document_download.js',true],\n['css/utility/document_download.css',true],\n['css/file_type.css',true]\n];\nparams.loaded=function(){\ndocDown.init();\n};\nparams.saveValues=['docDown.output'];\nparams.finished='docDown.finishable';\ndooit.init(params);\n}\n</script>",
	value:{files:[]},
	files:[],
	init:function() {
		$('form#sf_admin_edit_form').submit(function(e) {
			return documents.save(e);
		});
		this.containers.main=$('.exerciseTemplate').get(0);
		$(this.containers.main).addClass('icon16');
		$(this.ancester(this.containers.main,'form-row')).css({overflow:"visible"});
		var val=$('#globalFieldContent').val();
		try{
			eval('documents.value='+val+';');
		}catch(e) {}
		documents.value=json.decode(documents.value);
		this.build();
	},
	build:function() {
		$(this.containers.main).html("<h2>Document Download Construction</h2>");
		this.containers.info=document.createElement("div");
		$(this.containers.info).addClass("docInfo");
		this.containers.main.appendChild(this.containers.info);
		this.containers.list=document.createElement("div");
		$(this.containers.list).addClass("docList");
		this.containers.main.appendChild(this.containers.list);
		$(this.containers.list).html("The documents selected");
		this.showInfo();
		this.fetchFiles();
	},
	showInfo:function() {
		var d=document.createElement("div");
		$(d).html("Available documents");
		this.containers.files=document.createElement("div");
		$(this.containers.files).addClass("scrollList");
		$(this.containers.files).html("Fetching the library files");
		d.appendChild(this.containers.files);
		this.containers.info.appendChild(d);
	},
	render:function() {
		for(var d=0;d<this.value.files.length;d++) {
			this.containers.list.appendChild(this.doc(this.value.files[d]));
		}
		this.sorting();
	},
	sorting:function() {
		if (this.sortingDefined!==undefined) $(documents.containers.list).sortable("destroy");
		$(documents.containers.list).sortable({items:'.docFile',handle:'.mover',update:documents.setOrder});
		this.sortingDefined=true;
	},
	setOrder:function() {
		var items=[];
		$(documents.containers.list).find('.docFile').each(function(i,e) {
			items.push(e.item);
		});
		documents.value.files=items;
	},
	add:function(item) {
		item.description=item.description;
		if (typeof(item.description)!="string") item.description='';
		item.title=item.name;
		if (typeof(item.title)!="string") item.title='';
		documents.value.files.push(item);
		var o=documents.doc(item);
		$(o).css({display:"none"});
		documents.containers.list.appendChild(o);
		$(o).slideDown();
		documents.sorting();
	},
	doc:function(item) {
		var d=document.createElement("div");
		$(d).addClass("docFile");
		var move=document.createElement("div");
		$(move).addClass("mover");
		d.appendChild(move);

		var div=document.createElement("div");
		$(div).addClass(item.extension.toLowerCase()+'_Icon file_icon');
		d.appendChild(div);

		d.item=item;
		if (documents.files[item.url]===undefined || documents.files[item.url].exists===false) {
			var view=document.createElement("span");
			$(view).html("missing").addClass("warning");
			view.title="This file is missing!";
		}else{
			var view=document.createElement("a");
			view.href=item.url;
			view.target='_blank';
			$(view).html("view");
		}
		d.appendChild(view);
		var del=document.createElement("button");
		del.type='button';
		$(del).html("remove").bind("click",function(e) {
			e.preventDefault();
			if (window.confirm("Remove this document from the list?")) {
				var i=$(this.parentNode).prevAll(".docFile").get().length;
				documents.value.files.splice(i,1);
				documents.makeAvailable(this.parentNode.item);
				$(this.parentNode).slideUp(500,function() {
					$(this).remove();
				});
			}
		});
		var move=document.createElement("div");
		
		var t=document.createElement("span");
		$(t).html(item.name+" ("+item.extension+")  -  "+item.created);
		d.appendChild(t);

		var inputs=document.createElement("div");
		var label=document.createElement("label");
		$(label).html("Title");
		var ip=document.createElement("input");
		ip.type='text';
		ip.doc=d;
		ip.value=item.title;
		$(ip).bind("keyup",function() {
			documents.update(this.doc,'title',this.value);
		});
		inputs.appendChild(label);
		inputs.appendChild(ip);
		d.appendChild(inputs);

		var inputs=document.createElement("div");
		var label=document.createElement("label");
		$(label).html("Description");
		var ip=document.createElement("textarea");
		ip.value=item.description;
		ip.doc=d;
		$(ip).bind("keyup",function() {
			documents.update(this.doc,'description',this.value);
		});
		inputs.appendChild(label);
		inputs.appendChild(ip);
		d.appendChild(inputs);
		d.appendChild(del);

		return d;
	},
	update:function(doc,key,value) {
		doc.item[key]=value;
		var i=$(doc).prevAll('.docFile').get().length;
		documents.value.files[i][key]=value;
	},
	makeAvailable:function(item) {
		$(this.containers.files).find(".libraryFile.on").each(function(i,e) {
			if (e.item.url==item.url) $(e).removeClass("on");
		});
	},
	fetchFiles:function() {
		$.ajax({
			url:'/library/ajax',
			dataType:'json'
		}).done(function(files) {
			documents.listAvailable(files);
		});
	},
	listAvailable:function(files) {
		this.files={};
		var found=0;
		for(var f=0;f<files.length;f++) {
			if (files[f].exists) {
				this.files[files[f].url]=files[f];
				found++;
			}
		}
		while(this.containers.files.childNodes.length>0) this.containers.files.removeChild(this.containers.files.childNodes[0]);
		if (found==0) {
			$(this.containers.files).html("No documents in your library");
		}else{
			for(var d=0;d<files.length;d++) {
				if (files[d].exists) {
					var sel=document.createElement("div");
					$(sel).addClass("libraryFile");
					var ext=files[d].url.match(/\.([^\.]+)$/);
					files[d].extension='';
					if (ext.length>1) {
						var div=document.createElement("div");
						files[d].extension=ext[1];
						$(div).addClass(files[d].extension.toLowerCase()+'_Icon file_icon');
						sel.appendChild(div);
					}
					sel.item=files[d];
					var s=document.createElement("span");
					$(s).html(files[d].name+" ("+files[d].extension+")  -  "+files[d].created);
					sel.appendChild(s);
					if (this.selected(files[d])) $(sel).addClass("on");
					$(sel).bind("click",function(e) {
						e.preventDefault();
						if (!$(this).hasClass("on")) {
							documents.add(this.item);
							$(this).addClass("on");
						}
					});
					this.containers.files.appendChild(sel);
				}
			}
		}
		this.render();
	},
	selected:function(file) {
		for (var f=0;f<this.value.files.length;f++) {
			if (this.value.files[f].url==file.url) return true;
		}
		return false;
	},
	ancester:function(o,c) {
		if ($(o).hasClass(c)) return o;
		if (o==document.body) return false;
		if (!o.parentNode) return false;
		return documents.ancester(o.parentNode,c);
	},
	save:function(e) {
		$('textarea#globalFieldContent').val(json.build(this.value));
		$('textarea#display').val(this.layout);
		return true;
	}
	
};
