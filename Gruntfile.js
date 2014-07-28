module.exports = function(grunt) {
  'use strict';
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jasmine : {
      src : 'src/**/*.js',
      options : {
        specs : 'spec/**/*.js',
        vendor: [
          "bower_components/jquery/dist/jquery.js",
          "bower_components/jquery-ui/jquery-ui.min.js",
          "bower_components/jasmine-jquery/lib/jasmine-jquery.js"
        ]
      }
    },
    concat: {
      options: {
        banner: '<%= banner %>\n',
        stripBanners: false,
        separator: ';'
      },
      dist: {
        src: [
          'src/googleImageSearchService.js',
          'src/imageCarouselWidget.js',
          'src/imageContainerWidget.js'
        ],
        dest: 'dist/<%= pkg.name %>.js'
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      dist: {
        files: {
          'dist/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
        }
      }
    },
    jshint: {
      files: ['Gruntfile.js', 'src/*.js', 'spec/**/*.js'],
      options: {
        // options here to override JSHint defaults
        globals: {
          jQuery: true,
          console: true,
          module: true,
          document: true
        }
      }
    },
    watch: {
      files: ['<%= jshint.files %>'],
      tasks: ['jshint', 'jasmine']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('test', ['jshint', 'jasmine']);

  grunt.registerTask('default', ['jshint', 'jasmine', 'concat', 'uglify']);

};
