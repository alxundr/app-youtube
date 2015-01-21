module.exports = function(grunt) {
	var port = 9000,
		config = {
   	 	build: 'build'
    };

    require('load-grunt-tasks')(grunt);

	// Project configuration.
	grunt.initConfig({
	    pkg: grunt.file.readJSON('package.json'),
	    config: config,	    
	    concat: {
	    	build: {
	    		src: ['js/*.js'],
	    		dest: '<%= config.build %>/js/<%= pkg.name %>.js'
	    	}
	    },
	    uglify: {
	        options: {
	          banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
	        },
	        build: {
	      	    files: [ {
	      		    expand: true,
	      		    src: '<%= config.build %>/js/*.js',
	      		    dest: '',
	      		    ext: '.min.js'
	      	    }]
	        }
	    },
	    cssmin: {
	    	options: {
	          banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
	        },
	    	build: {
	    		files: [{
	    			expand: true,
	    			src: ['css/main.css'],
	    			dest: '<%= config.build %>',
	    			ext: '.min.css'
	    		}]
	    	}
	    },
	    htmlmin: {
	    	options: {
	    		banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
	    		removeComments: true,
	    		collapseWhitespace: true
	    	},
	    	build: {
	    		files: [{
	    			expand: true,
	    			src: ['*.html'],
	    			dest: '<%= config.build %>'
	    		}]
	    	}
	    },
	    connect: {
	    	server: {
	    		options: {
	    			port: port,
	    			keepalive: true,
	    			hostname: 'localhost'
	    		}
	    	}    		
	    },
	    open: {
	    	all: {
	    		path: 'http://localhost:<%= connect.server.options.port %>'
	    	}
	    }
	  });

    grunt.registerTask('build', [
  	    'concat',
  	    'uglify',
  		'cssmin',
  		'htmlmin'
    ]);

    grunt.registerTask('server', [
    	'connect:server',
    	'open'
    ]);

    // Default task(s).
    grunt.registerTask('default', ['uglify']);

};