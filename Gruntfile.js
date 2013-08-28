module.exports = function(grunt) {

	"use strict";

	var mountFolder = function ( connect, path ) {
		return connect.static( require( "path" ).resolve( path ) );
	};

	grunt.initConfig({
		pkg: grunt.file.readJSON( "package.json" ),
		connect: {
			options: {
				port: 9001,
				hostname: "localhost"
			},
			test: {
				options: {
					middleware: function ( connect ) {
						return [
							mountFolder( connect, "." ),
							mountFolder( connect, "test" )
						];
					}
				}
			}
		},
		jshint: {
			source: {
				src: [ "src/**/*.js" ],
				options: {
					jshintrc: "src/.jshintrc"
				}
			},
			grunt: {
				src: [ "Gruntfile.js" ],
				options: {
					jshintrc: ".jshintrc"
				}
			},
			test: {
				src: [ "test/*.js" ],
				options: {
					jshintrc: "test/.jshintrc"
				}
			}
		},
		uglify: {
			dist: {
				options: {
					beautify: {
						ascii_only: true
					},
					banner: "/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - " +
						"<%= grunt.template.today('isoDate') %>\n" +
						"<%= pkg.homepage ? '* ' + pkg.homepage + '\\n' : '' %>" +
						"* Copyright <%= grunt.template.today('yyyy') %> <%= pkg.author.name %>;" +
						" Licensed <%= _.pluck(pkg.licenses, 'type').join(', ') %> */\n"
				},
				files: {
					"dist/globalize.min.js": [ "lib/globalize.js" ]
				}
			}
		},
		mocha: {
			all: {
				options: {
					urls: [ "http://localhost:<%= connect.options.port %>/index.html" ]
				}
			}
		},
		watch: {
			files: [ "src/*.js", "test/spec/*.js", "test/*.html" ],
			tasks: [ "jshint", "test" ]
		}
	});

	require( "matchdep" ).filterDev( "grunt-*" ).forEach( grunt.loadNpmTasks );

	grunt.registerTask( "test", [
		"connect:test",
		"mocha"
	]);

	// Default task.
	grunt.registerTask( "default", [ "jshint", "uglify", "test" ] );

};

