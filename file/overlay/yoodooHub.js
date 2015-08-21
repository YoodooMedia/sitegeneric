yoodoo.hub={
	background_transparency:0.5,
	widget_background:'#000000',
	tool_background:'#000000',
	tool_title_tint:{lighten:-.2,brighten:0},
	favourite_background:'#000000',
	widget_colour:'#FFFFFF',
	tool_colour:'#FFFFFF',
	favourite_colour:'#FFFFFF',
	grid:{
		width:2,
		landscapeWidth:4,
		cellAspect:1.2,
		cellWidth:120,
		cellHeight:100,
		landscapeMaxHeightProportion:0.2,
		padding:10
	},
	cellViewWidth:200,
	prebuilt:false,
	
	widgets:{
		_widgets:{},
		set:function(obj) {
			yoodoo.hub.prebuild();
			if (this._widgets[obj.id]===undefined) {
				this._widgets[obj.id]=new this.element(obj);
			}else{
				this._widgets[obj.id].update(obj);
			}
		},
		drop:function(id) {
			if (this._widgets[id]!==undefined) {
				this._widgets[id].drop();
				this._widgets[id]=undefined;
			}
		},
		element:function(obj) {
			yoodoo.hub.prebuild();
			this.container=$(yoodoo.e("button")).attr("type","button").addClass('hub_widget_button');
			this.view=$(yoodoo.e("div")).css({width:yoodoo.hub.cellViewWidth,height:Math.floor(yoodoo.hub.cellViewWidth/yoodoo.hub.grid.cellAspect)});
			//this.priority=50;
			this.settings={
				background:null,
				colour:null,
				priority:50,
				width:1
			};
			this.update=function(obj) {
				for(var k in obj) this.settings[k]=obj[k];
				if (this.settings.colour===null) this.settings.colour=yoodoo.hub.widget_colour;
				if (this.settings.belowCTA!==true) {
					//if (this.settings.background===null) this.settings.background=yoodoo.hub.widget_background;
				}
				var me=this;
				this.container.unbind("click").bind("click",function(e) {
					try{
						eval(me.settings.onclick);
					}catch(e) {}
				});
				var rgb=(this.settings.background===null)?null:yoodooStyler.hexToRGB(this.settings.background);
				//var zoom=((yoodoo.hub.grid.cellWidth*this.settings.width)-(2*yoodoo.hub.grid.padding))/yoodoo.hub.cellViewWidth;
				var zoom=((yoodoo.hub.grid.cellWidth*this.settings.width))/yoodoo.hub.cellViewWidth;
				this.container.empty().append(
					this.view.html(this.settings.html).css({
						background:this.settings.background,
						zoom:zoom.toFixed(3),
						'-moz-transform':'scale('+zoom.toFixed(3)+')',
						'-moz-transform-origin':'left top',
						height:Math.floor((yoodoo.hub.grid.cellHeight)/zoom)
					})
				).css({
					background:'none',
					color:this.settings.colour,
					width:yoodoo.hub.grid.cellWidth*this.settings.width,
					height:yoodoo.hub.grid.cellHeight
				});
			};
			this.update(obj);
			this.drop=function() {
				$(this.container).remove();
				
			};
		},
		getOrdered:function() {
			var list=[];
			for(var id in this._widgets) {
				if (this._widgets[id]!==undefined) list.push(this._widgets[id]);
			}
			return list.sort(function(a,b) {
				return b.settings.priority-a.settings.priority;
			});
		}
	},
	tools:{
		_tools:{},
		set:function(obj) {
			yoodoo.hub.prebuild();
			if (this._tools[obj.id]===undefined) {
				this._tools[obj.id]=new this.element(obj);
			}else{
				this._tools[obj.id].update(obj);
			}
		},
		drop:function(id) {
			if (this._tools[id]!==undefined) {
				this._tools[id].drop();
				this._tools[id]=undefined;
			}
		},
		element:function(obj) {
			//this.background=null;
			this.container=$(yoodoo.e("button")).attr("type","button").addClass('hub_tool_button');
			this.view=$(yoodoo.e("div")).css({width:yoodoo.hub.cellViewWidth,height:Math.floor(yoodoo.hub.cellViewWidth/yoodoo.hub.grid.cellAspect)});
			//this.label=$(yoodoo.e("div")).css({width:yoodoo.hub.cellViewWidth});
			//this.priority=50;
			this.settings={
				background:null,
				colour:null,
				priority:50,
				width:1
			};
			this.update=function(obj) {
				for(var k in obj) this.settings[k]=obj[k];
				if (this.settings.colour===null) this.settings.colour=yoodoo.hub.tool_colour;
				//if (this.settings.background===null) this.settings.background=yoodoo.hub.tool_background;
				//if (this.settings.background===null) this.settings.background='none';
				//var rgb=(this.settings.background===null)?null:yoodooStyler.hexToRGB(this.settings.background);
				/*var icon=null;
				if (this.settings.icon!==undefined) {
					icon=yoodoo.icons.drawSVG(this.settings.icon,70,70);
				}*/
				var me=this;
				this.container.unbind("click").bind("click",function(e) {
					try{
						eval(me.settings.onclick);
					}catch(e) {}
				});
				//var zoomPadding=((yoodoo.hub.grid.cellWidth*this.settings.width)-(2*yoodoo.hub.grid.padding))/yoodoo.hub.cellViewWidth;
				/*var zoom=(yoodoo.hub.grid.cellWidth*this.settings.width)/(yoodoo.hub.cellViewWidth);
				var titleBackground=yoodooStyler.tint(rgb,yoodoo.hub.tool_title_tint.lighten,yoodoo.hub.tool_title_tint.brighten);
				this.container.empty().append(
					$(yoodoo.e("div")).append(
						this.view.empty().append(icon).css({
							zoom:zoomPadding.toFixed(3),
							height:Math.floor((yoodoo.hub.grid.cellHeight-(2*yoodoo.hub.grid.padding))/zoom)
						})
					).css({
						padding:yoodoo.hub.grid.padding
					})
				).append(
					$(yoodoo.e("div")).append(
						this.label.empty().append($(yoodoo.e("div")).html(this.settings.title).addClass('hub_tool_title')).css({
							background:'rgba('+titleBackground.r+','+titleBackground.g+','+titleBackground.b+','+yoodoo.hub.background_transparency+')',
							position:'absolute',
							bottom:0,
							left:0,
							'box-sizing':'border-box',
							zoom:zoom.toFixed(3),
							padding:yoodoo.hub.grid.padding
						})
					)
				).css({
					background:'rgba('+rgb.r+','+rgb.g+','+rgb.b+','+yoodoo.hub.background_transparency+')',
					color:this.settings.colour,
					width:yoodoo.hub.grid.cellWidth*this.settings.width,
					height:yoodoo.hub.grid.cellHeight,
					position:'relative'
				});*/
				
				var zoom=((yoodoo.hub.grid.cellWidth*this.settings.width))/yoodoo.hub.cellViewWidth;
				this.container.empty().append(
					this.view.empty().append(this.settings.html).css({
						background:this.settings.background,
						zoom:zoom.toFixed(3),
						'-moz-transform':'scale('+zoom.toFixed(3)+')',
						'-moz-transform-origin':'left top',
						height:Math.floor((yoodoo.hub.grid.cellHeight)/zoom)
					})
				).css({
					background:'none',
					color:this.settings.colour,
					width:yoodoo.hub.grid.cellWidth*this.settings.width,
					height:yoodoo.hub.grid.cellHeight
				});
				
			};
			this.update(obj);
			this.drop=function() {
				$(this.container).remove();
				
			};
		},
		getOrdered:function() {
			var list=[];
			for(var id in this._tools) {
				if (this._tools[id]!==undefined) list.push(this._tools[id]);
			}
			return list.sort(function(a,b) {
				return b.settings.priority-a.settings.priority;
			});
		}
	},
	favourites:{
		_favourites:{},
		set:function(obj) {
			yoodoo.hub.prebuild();
			if (this._favourites[obj.id]===undefined) {
				this._favourites[obj.id]=new this.element(obj);
			}else{
				this._favourites[obj.id].update(obj);
			}
		},
		drop:function(id) {
			if (this._favourites[id]!==undefined) {
				this._favourites[id].drop();
				this._favourites[id]=undefined;
			}
		},
		element:function(obj) {
			this.background=null;
			this.container=$(yoodoo.e("button")).attr("type","button").addClass('hub_fav_button');
			this.view=$(yoodoo.e("div")).css({width:yoodoo.hub.cellViewWidth,height:Math.floor(yoodoo.hub.cellViewWidth/yoodoo.hub.grid.cellAspect)});
			this.label=$(yoodoo.e("div")).css({width:yoodoo.hub.cellViewWidth});
			//this.priority=50;
			this.settings={
				background:null,
				colour:null,
				priority:50,
				width:200
			};
			this.update=function(obj) {
				for(var k in obj) this.settings[k]=obj[k];
				if (this.settings.colour===null) this.settings.colour=yoodoo.hub.tool_colour;
				if (this.settings.background===null) this.settings.background=yoodoo.hub.tool_background;
				var rgb=(this.settings.background===null)?null:yoodooStyler.hexToRGB(this.settings.background);
				var icon=null;
				//if (this.settings.icon!==undefined) {
					icon=yoodoo.icons.get(this.settings.type,70,70);
				//}
				var me=this;
				this.container.unbind("click").bind("click",function(e) {
					try{
						eval(me.settings.onclick);
					}catch(e) {}
				});
				var zoomPadding=((yoodoo.hub.grid.cellWidth*this.settings.width))/yoodoo.hub.cellViewWidth;
				var zoom=(yoodoo.hub.grid.cellWidth*this.settings.width)/(yoodoo.hub.cellViewWidth);
				var titleBackground=yoodooStyler.tint(rgb,yoodoo.hub.tool_title_tint.lighten,yoodoo.hub.tool_title_tint.brighten);
				this.container.empty().append(
					$(yoodoo.e("div")).append(
						this.view.empty().append(this.settings.html).css({
							zoom:zoomPadding.toFixed(3),
							height:Math.floor(yoodoo.hub.grid.cellHeight/zoom)
						})
					).css({
						//padding:yoodoo.hub.grid.padding
					})
				).css({
					background:'none',
					color:this.settings.colour,
					width:yoodoo.hub.grid.cellWidth*this.settings.width,
					height:yoodoo.hub.grid.cellHeight,
					position:'relative'
				});
			};
			this.update(obj);
			this.drop=function() {
				$(this.container).remove();
				
			};
		},
		getOrdered:function() {
			var list=[];
			for(var id in this._favourites) {
				if (this._favourites[id]!==undefined) list.push(this._favourites[id]);
			}
			return list.sort(function(a,b) {
				return b.settings.priority-a.settings.priority;
			});
		}
	},
	prebuild:function() {
		if (this.prebuilt===false) {
			var landscape=yoodoo.landscape;
			if (!yoodoo.isApp) yoodoo.landscape=$(yoodoo.widget).height()<$(yoodoo.widget).width();
			if (yoodoo.landscape) {
				this.grid.cellWidth=Math.floor($(yoodoo.widget).height()/this.grid.width);
				this.grid.cellHeight=Math.floor(this.grid.cellWidth/this.grid.cellAspect);
				
				if (!yoodoo.isApp) {
					var h=Math.round($(yoodoo.widget).height()*this.grid.landscapeMaxHeightProportion);
					if (h<this.grid.cellHeight) {
						this.grid.cellHeight=h;
						this.grid.cellWidth=Math.round(this.grid.cellHeight*this.grid.cellAspect);
					}
				}
			}else{
				this.grid.cellWidth=Math.floor($(yoodoo.widget).width()/this.grid.width);
				this.grid.cellHeight=Math.floor(this.grid.cellWidth/this.grid.cellAspect);
			}
			this.prebuilt=true;
		}
	},
	display:function(params) {
		//document.body.style.zoom=2;
		//$(yoodoo.widget).html(window.location.href).append($(yoodoo.e("div")).html($(yoodoo.widget).width()+' x '+$(yoodoo.widget).height()));
		console.log(params);
		this.prebuild();
		this.pages=new yoodoo.ui.pages({
			height:'100%',
			onchange:function() {
				if (this.pages[this.page].playerName!==undefined) $('.hub_header_title').html(yoodoo.w('_'+this.pages[this.page].playerName));
			}
		});
		this.container=$(yoodoo.e("div")).addClass("yoodooHub");
		//$(document.body).append(this.container.width()+','+this.container.height());
		var header = yoodoo.buildHeader({
			logo: yoodoo.logo.svg,
			logoWidth: yoodoo.logo.width,
			logoHeight: yoodoo.logo.height,
			menu:yoodoo.menu.standard(),
			title:'<span class="hub_header_title">'+yoodoo.w("_hub")+'</span>',
			search:true,
			community:true
		});
		this.notification=null;
		if (yoodoo.notices.length>0) {
			var warnings=0;
			var notifies=0;
			for(var n=0;n<yoodoo.notices.length;n++) {
				if (yoodoo.notices[n].warning) {
					warnings++;
				}else{
					notifies++;
				}
			}
			var txt='';
			if (warnings>0) txt='<span style="color:#f00">'+warnings+' '+yoodoo.w('warning'+((warnings==1)?'':'s'))+'</span>';
			if (notifies>0) txt+=((txt=="")?'':' '+yoodoo.w("and")+' ')+notifies+' '+yoodoo.w('notification'+((notifies==1)?'':'s'));
			this.notification=$(yoodoo.e("div")).addClass("notificationMessage").append(
				$(yoodoo.e("button")).attr("type","button").html(txt).click(function() {
						yoodoo.interface.list_notifications();
				})
			).css({
				'padding-top':((warnings>0)?yoodoo.header_height:0)+'px'
			});
			if (warnings>0) this.notification.addClass('hasWarning');
		}
		this.page_container=$(yoodoo.e("div")).css({
			height:'inherit',
			padding:yoodoo.header_height+'px 0px 0px 0px',
			'box-sizing':'border-box'
		}).addClass("yoodooHub_pages");
		this.container.append(header).append(this.page_container).append(this.notification);
		
		var page1=this.pages.addPage({
			nextButton:yoodoo.w('_tools'),
			nextButtonValidate:function() {return true;}
		});
		page1.playerName='hub';
		$(page1.container).addClass("hub_widgets");
		this.blurred=$(yoodoo.e("div")).addClass("blurred");
		var widgetDiv=$(yoodoo.e("div")).css({
			'max-width':this.grid.landscapeWidth*this.grid.cellWidth,
			margin:'0px auto'
		});
		var widgetDivBelow=$(yoodoo.e("div")).css({
			'max-width':this.grid.landscapeWidth*this.grid.cellWidth,
			margin:'0px auto'
		});
		
// Widgets
		
		var widgets=this.widgets.getOrdered();
		var widgetsBelow=[];
		var row=0;
		var above=0;
		var rows=[];
		var rowLengths=[];
		for(var i in widgets) {
			var w=widgets[i].settings.width;
			var r=((widgets[i].settings.belowCTA===true)?params.sessionRow-1:0);
			while(rows.length<=r) {
				rows.push([]);
				rowLengths.push(0);
			}
			while(rowLengths[r]>yoodoo.hub.grid.width-w) {
				r++;
				if (rows.length<=r) {
					rows.push([]);
					rowLengths.push(0);
				}
			}
			rowLengths[r]+=w;
			rows[r].push($(widgets[i].container).css({position:'relative',display:'inline-block'}));
		}
		for(var r=0;r<2;r++) {
			while(rowLengths[r]<2) {
				rowLengths[r]++;
				rows[r].push($(yoodoo.e("div")).css({width:this.grid.cellWidth,height:this.grid.cellHeight,display:'inline-block'}));
			}
		}
		this.blurred.append(widgetDiv);
		for(var a in rows) {
			for(var aa in rows[a]) {
				if (params.sessionRow>((1*a)+1)) {
					widgetDiv.append(rows[a][aa]);
				}else{
					widgetDivBelow.append(rows[a][aa]);
				}
			}
		}
		var session=yoodoo.sessions.getSession(params.sessionId);
		var sessionId=session.id;
		var sessionDiv=$(yoodoo.e("button")).attr("type","button").addClass("sessionCTA").html(session.name+'<center>'+((session.short_description===null)?'':session.short_description)+'</center>').append($(yoodoo.e("div")).addClass("next").append($(yoodoo.e("div")).append(yoodoo.icons.get('next',20,20)))).click(function() {
			yoodoo.interface.session(sessionId);
		});
		this.blurred.append(sessionDiv);
		
		this.blurred.append(widgetDivBelow);
		
		page1.append(this.blurred);
		
		
		
// Tools
		
		var blurred=$(yoodoo.e("div")).addClass("blurred");
		var toolDiv=$(yoodoo.e("div")).css({
			'max-width':this.grid.landscapeWidth*this.grid.cellWidth,
			margin:'0px auto'
		});
		blurred.append(toolDiv);
		var tools=this.tools.getOrdered();
		for(var i in tools) {
			toolDiv.append(tools[i].container);
		}
		if (tools.length>0) {
			var page2=this.pages.addPage({
				nextButton:yoodoo.w('_favourites'),
				backButton:yoodoo.w('_hub'),
				nextButtonValidate:function() {return true;}
			});
			page2.playerName='tools';
			page2.append(blurred);
		}else{
			page1.settings.nextButton.value=yoodoo.w('_favourites');
		}
		
// Favourites
		
		var blurred=$(yoodoo.e("div")).addClass("blurred").css({
			height:'inherit'
		});
		var favDiv=$(yoodoo.e("div")).css({
			'max-width':this.grid.landscapeWidth*this.grid.cellWidth,
			margin:'0px auto',
			height:'inherit',
			overflow:'hidden'
		}).bind("mousewheel", function(e) {
			e.preventDefault();
			this.scrollTop-=e.originalEvent.wheelDeltaY;
		});
		
		blurred.append(favDiv);
		var favs=this.favourites.getOrdered();
		for(var i in favs) {
			favDiv.append(favs[i].container);
		}
		if (favs.length>0) {
			var page3=this.pages.addPage({
				backButton:yoodoo.w('_'+((tools.length>0)?'tools':'hub')),
				nextButtonValidate:function() {return true;}
			});
			page3.playerName='favourites';
			page3.append(blurred);
		}
		
		$(this.page_container).append(this.pages.container);
		yoodoo.display.add({name:'hub',obj:this.container,hideBelow:true,animate:true,complete:function() {
			yoodoo.display.remove('login');
			yoodoo.interface.clicked_notifications();
		}});
		
	}
	
};
