/*
	EXAMPLE: This is an example of the class to expose to the webview from the app.

	This class has subclasses to help us define the areas that will be developed.
	
	The webview will call the functions NOT starting with _.

	The params will be sent by the webview and the ones defined below are for reference only and will be commented out.



 */




var yoodooApp={
	setOrientation:function(type) {
		switch(type) {
			case 'portrait':
			
			break;
			case 'landscape':
			
			break;
			case 'auto':
			
			break;
		}
	},
	
	clicked_notifications:function() {
		// returns the command from a notification, if it has been clicked
		return 'yoodoo.interface.session(id)';
	},
	
	webview_show:function() {
			// make the WebView visible
	},
	webview_hide:function() {
			// hide the WebView
	},
	
	
	dialogue_show:function(params) {
			var params={
				spinner:true,
				text:'Sample text'
			};
			// display a dialogue message with or without a spinner
	},
	dialogue_hide:function() {
			// remove the dialogue from the display
	},
	
	
	

	toolbar_show:function(params) {
			var params={
				title:'Tool bar title',
				back:'console.log("back")',
				comments:false,
				community:false
			};
			// display the toolbar
		},
	toolbar_hide:function() {
			// remove the toolbar from the display
	},
	
	
	
	video_data:null,
	video_show:function(params) {
			
			// sample params
			var params={
				episode:{
					contentId:1234,
					title:'Untitled',
					favourite:true,
					completed:false,
					completedData:new Date(2014,10,29,10,2,0),
					duration:12.5,
					chapters:[
						{
							contentId:12345,
							title:'Untitled',
							source:'http://www.yoodoo.biz/video/url.mp4',
							favourite:false,
							duration:3.2,
							thumbnail:'http://www.yoodoo.biz/ui/imageurl.jpg',
							keypoints:[
								{
									contentId:123456,
									title:'Untitled keypoint',
									start:20,
									end:32,
									favourite:true,
									pages:[
										{
											text:'Key point text',
											image:''
										}
									]
								}
							]
						}
					],
				},
				completed:function(params) {
					console.log(params);
				},
				closed:function(params) {
					console.log(params);
				}
			};
			
			
			this._data=params;
	},
	video_completed:function() {
			var params=this._data.episode;
			params.complete=true;
			params.completedData=new Date();
			params.watched=0.45;
			if (typeof(this._data.closed)=='function') this._data.completed(params);
	},
	video_closed:function() {
			var params=this._data.episode;
			params.watched=0.45;
			if (typeof(this._data.closed)=='function') this._data.closed(params);
	},
	
	
	
	sessions_data:null,

	sessions_update:function(params) {
			// for data purposes, would be called on an update to the session data
			
			// sample params
			var params={
				current:0,
				sessions:[
					{
						id:123,
						title:'Session 1',
						shortDescription:'short description',
						longDescription:'long description',
						completed:false,
						duration:50,
						colour:'#999999',
						experiences:[
							{
								id:1235,
								title:'experience 1',
								completed:false,
								duration:20,
								icon:'http://www.yoodoo.biz/ui/experienceicon.jpg'
							}
						]
					}
				]
			};
			this._data=params;
	},
	hub_data:null,
		
	widgets_widgets:{},
			
// define a widget tile
	
	widgets_set:function(params) {
				params=yoodoo.parseJSON(params);
				// sample params
				/*var params={
					id:9876,
					html:'<h2>70%</h2><em>My CO</em>',
					colour:null,
					width:1,
					height:1,
					priority:10,
					onclick:'console.log(params);'
				};*/
				this.widgets_widgets[params.id]=params;
				// add or update the widget in the hub display
			},
			
// drop a widget tile
		
	widgets_drop:function(id) {
				this.widgets_widgets[id]=undefined;
				// remove the widget from the hub display
			},



		
			
	tools_tools:{},
			
	// define a tool tile
	
	tools_set:function(params) {
				params=$.parseJSON(params);
				// sample params
				/*var params={
					id:9876,
					title:'Tool title',
					icon:'<g></g>', // string containing an svg group tag
					colour:{r:255,g:200,b:200},
					width:1,
					height:1,
					priority:30,
					onclick:function(params) {
						console.log(params);
					}
				};*/
				this.tools_tools[params.id]=params;
				// add or update the tools in the hub display
			},
			
	// drop a tool tile
	
	tools_drop:function(id) {
				this.tools_tools[id]=undefined;
				// remove the widget from the hub display
			},
		
		
		
			
	favourites_favourites:{},
			
	// define a favourite tile
			
	favourites_set:function(params) {
				params=$.parseJSON(params);
				// sample params
				/*var params={
					id:9876,
					title:'Tool title',
					icon:'<g></g>', // string containing an svg group tag
					colour:{r:255,g:200,b:200},
					width:1,
					height:1,
					priority:30,
					onclick:function(params) {
						console.log(params);
					}
				};*/
				this.favourites_favourites[params.id]=params;
				// add or update the favourites in the hub display
			},
			
	// drop a favourite tile
	
	favourites_drop:function(id) {
				this.favourites_favourites[id]=undefined;
				// remove the widget from the hub display
			},
		
		
		
		
	hub_show:function(params) {
			params=$.parseJSON(params);
			// sample params
			/*var params={
				search:true, // display search
				community:true, // display community button
				sessionRow:3 // on which row of the grid in the hub, to show the next session
				sessionId:1324 // on which row of the grid in the hub, to show the next session
				notices:[
					{
						title:'The notice title', 
						content:'The notice message', 
						button:'The button text', 
						action:'The action to eval in the webview on clicking of the button'
					}
				] // the list of notifications for the hub screen
			};*/
			// display the hub screen using the sessions
		},
		
	hub_hide:function() {
			// remove the hub screen
	},
	
	
	
	processing_data:null,
	processing_show:function(params) {
			params=$.parseJSON(params);
			// sample params
			/*var params={
				text:'Loading...',
				spinner:true
			};*/
			this.processing_data=params;
			// display the text and optional spinner in a dialogue box preventing all actions below it
		},
	processing_drop:function() {
			// remove the dialogue box display
	},
	
	
	
	user_userhash:'trhjrstjsrtjrtsj',
	user_getUserhash:function() {
			// returns the value received from the api
			return this.user_userhash;
		},
	user_showLogin:function() {
			// App revalidates the user and the userhash is invalid
			var me=this;
			$.ajax(
			'http://paul.yoodoo.tv/frontend_dev.php/app',
			{
				data:{
					cmd:'login',
					android:'abcdefghijklmnopqrstuvwxyz',
					apple:null,
					username:'caroline',
					password:'yoodoo',
					width:800,
					height:600,
					userhash:null,
					sitehash:null,
					devicehash:'002c631fc762ec925aaa73230f8fe3fefa5a26480'
				},
				type:'POST',
				dataType:'JSON',
				success:function(r) {
					if (r.user_detected===true) {
						me.user_userhash=r.userhash;
						if (r.instance!==undefined && r.instance.hashcode) yoodooApp.site_hashcode=r.instance.hashcode;
						me.user_gotUserHash();
					}
				}
				
			});
		},
	user_gotUserHash:function() {
			yoodoo.interface.gotUserhash(this.user_userhash);
	},
	



	site_hashcode:'LzwOwQwqf6ug5BvE1314',
	site_getSitehash:function() {
			// returns the value received from the api
			return this.site_hashcode;
	}
};