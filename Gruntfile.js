'use strict';
module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    meta: {
      banner: "/*!\n" +
        " *  Project: <%= pkg.title || pkg.name %>\n" +
        " *  Version: <%= pkg.version %> (<%= grunt.template.today('yyyy-mm-dd') %>)\n" +
        " *  Description: <%= pkg.description %>\n" +
        " *  Author: <%= pkg.author.name %> <<%= pkg.author.email %>>\n" +
        "<%= pkg.homepage ? ' *  Homepage: ' + pkg.homepage + '\\n' : '' %>" +
        " *  License: <%= _.pluck(pkg.licenses, 'type').join(', ') %>\n" +
        "*/\n"
    },

    //REMAP JSON
    path: {
      htmlmin     : '<%= pkg.path.htmlmin %>/<%= pkg.version %>/<%= pkg.distName.indexmin %>',
      htmlconcat  : '<%= pkg.path.htmlclean %>/<%= pkg.version %>/<%= pkg.distName.indexconcat %>',
      jsconcat    : '<%= pkg.path.jsconcat %>/<%= pkg.version %>/<%= pkg.distName.indexjsconcat %>',
      jsmin       : '<%= pkg.path.jsmin %>/<%= pkg.version %>/<%= pkg.distName.indexjsmin %>',
      cssconcat   : '<%= pkg.path.cssconcat %>/<%= pkg.version %>/<%= pkg.distName.cssconcat %>',
      cssmin      : '<%= pkg.path.cssmin %><%= pkg.version %>/<%= pkg.distName.cssmin %>'
    },

    //HTML 
    htmlmin: {                                     // Task
      dist: {                                      // Target
        options: {                                 // Target options
          removeComments: true,
          collapseWhitespace: true, 
          banner: '<%= meta.banner %>'
        },
        files: {                                   // Dictionary of files
          '<%= path.htmlmin %>' : 'index.html'  //DO NOT CHANGE LEFT SIDE
        }
      },
      dev: {                                         // Target
        options: {                                 // Target options
          removeComments: true
        },                                    // Another target
        files: {
          '<%= path.htmlconcat %>' : 'index.html' //DO NOT CHANGE LEFT SIDE
        }
      }
    },

    //JAVASCRIPT
    jshint: {
      options: {
        node: true,
        strict: false
      },
      all: [
        'Gruntfile.js',
        'js/*.js'
      ]
    },
    concat: {
      index: {
        src: [
          'js/1.js',
          'js/2.js'
        ],
        dest: '<%= path.jsconcat %>'//DO NOT CHANGE
      }
    },
    uglify: {
      options: {
        banner: '<%= meta.banner %>'
      },
      dist: {
        files: {
          '<%= path.jsmin %>' : '<%= path.jsconcat %>'//DO NOT CHANGE 
        }
      }
    },

    //CSS
    mincss: {
      compress: {
        files: {
          '<%= path.cssconcat %>' : ['css/style1.css', 'css/style2.css'] //DO NOT CHANGE LEFT SIDE
        }
      },
      with_banner: {
        options: {
          banner: '<%= meta.banner %>'
        },
        files: {
          '<%= path.cssmin %>':['<%= path.cssconcat %>'] //DO NOT CHANGE 
        }
      }
    },

    //WATCH
    watch: {
      js: {
        files: [
          '<%= jshint.all %>'
        ],
        tasks: ['buildJS']
      },
      css: {
        files: [
          'css/*.css'
        ],
        tasks: ['buildCSS']
      },
      html: {
        files: [
          '*.html'
        ],
        tasks: ['buildHTML']
      }
    }

  });

  //grunt.loadTasks('build/tasks');

  grunt.loadNpmTasks('grunt-contrib-htmlmin');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-mincss');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('buildJS', ['jshint', 'concat', 'uglify']);
  grunt.registerTask('buildCSS', ['mincss']);
  grunt.registerTask('buildHTML', ['htmlmin']);
  grunt.registerTask('default', ['buildHTML','buildJS', 'buildCSS']);


};
