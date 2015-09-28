module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
	  yoodoo:{
		  options: {
			beautify:false,
			comments:false,
			indent_level:1,
			mangle:true,
			banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
        	sourceMap: true,
        	sourceMapName: 'file/overlay/yoodoo.map'
		  },
		  files:{
		  	'file/overlay/yoodoo.js' : ['file/overlay/yoodooSource.js'],
		  	'file/overlay/yoodooExtension6_2.min.js' : ['file/overlay/yoodooExtension6_2.js'],
		  	'file/overlay/yoodooplus.js' : [
											'file/dooits/jquery-ui-1-10-4.js',
										   'file/overlay/yoodooBookcase.js',
										   'file/overlay/yoodooComments2.js',
										   'file/overlay/yoodooAdvisor.js',
										   'file/overlay/jquery_transit.js',
										   'file/overlay/yoodooGroups_2.js',
										   'file/overlay/yoodooIcons.js',
										   'file/overlay/yoodooInterface.js',
										   'file/overlay/yoodooLanguage.js',
										   'file/overlay/yoodooMetaphorOne_3.js',
										   'file/overlay/yoodooObject.js',
										   'file/overlay/yoodooStyler3.js',
										   'file/overlay/yoodooUi_3.js',
										   'file/overlay/dooit8_6.js'
			],
		  	'file/overlay/yoodoohtml.js' : [
											'file/dooits/jquery-ui-1-10-4.js',
										   'file/overlay/yoodooBookcase.js',
										   'file/overlay/yoodooComments2.js',
										   'file/overlay/yoodooAdvisor.js',
										   'file/overlay/jquery_transit.js',
										   'file/overlay/yoodooGroups_2.js',
										   'file/overlay/yoodooIcons.js',
										   'file/overlay/yoodooInterface.js',
										   'file/overlay/yoodooLanguage.js',
										   'file/overlay/yoodooMetaphorOne_3.js',
										   'file/overlay/yoodooObject.js',
										   'file/overlay/yoodooPlaya.js',
										   'file/overlay/yoodooQuiz.js',
										   'file/overlay/yoodooStyler3.js',
										   'file/overlay/yoodooUi_3.js',
										   'file/overlay/dooit8_6.js'
			]
		  }
	  }
    },
	  sass:{                            // Task 
		dist: {                            // Target 
		  options: {                       // Target options 
			style: 'compressed'
		  },
		  files: {                         // Dictionary of files 
			'file/overlay/yoodooMetaphorOne_3.css': 'file/overlay/scss/yoodooMetaphorOne.scss'       // 'destination': 'source' 
		  }
		}
	  }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');
grunt.loadNpmTasks('grunt-contrib-sass');

  // Default task(s).
  grunt.registerTask('default', ['uglify','sass']);

};
