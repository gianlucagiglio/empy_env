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
    mincss: {
      compress: {
        files: {
          '<%= pkg.path.cssconcat %>/<%= pkg.version %>/style.css': ['css/style1.css', 'css/style2.css']
        }
      },
      with_banner: {
        options: {
          banner: '/* My minified css file */'
        },
        files: {
          '<%= pkg.path.cssmin %><%= pkg.version %>/style-min.css': ['<%= pkg.path.cssconcat %>/<%= pkg.version %>/style.css']
        }
      }
    },
    htmlmin: {                                     // Task
      dist: {                                      // Target
        options: {                                 // Target options
          removeComments: true,
          collapseWhitespace: true
        },
        files: {                                   // Dictionary of files
          '<%= pkg.path.htmlmin %>/<%= pkg.version %>/index-min.html': 'index.html'     // 'destination': 'source'
        }
      },
      dev: {                                         // Target
        options: {                                 // Target options
          removeComments: true
        },                                    // Another target
        files: {
          '<%= pkg.path.htmlclean %>/<%= pkg.version %>/index.html': 'index.html'
        }
      }
    },
    concat: {
      index: {
        src: [
          'js/1.js',
          'js/2.js'
        ],
        dest: '<%= pkg.path.jsconcat %>/<%= pkg.version %>/12.js'
      }
    },
    uglify: {
      options: {
        banner: '<%= meta.banner %>'
      },
      dist: {
        files: {
          '<%= pkg.path.jsmin %>/<%= pkg.version %>/12-min.js': ['<%= pkg.path.jsconcat %>/<%= pkg.version %>/12.js']
        }
      }
    },
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
