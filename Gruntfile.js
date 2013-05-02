'use strict';
module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    configs: grunt.file.readJSON('config.json'),
    foo: {
      boo: [1, 2, 3],
      bar: 'hello world',
      baz: false
    },
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
      cssmin      : '<%= pkg.path.cssmin %><%= pkg.version %>/<%= pkg.distName.cssmin %>',
      lessconcat  : '<%= pkg.path.lessconcat %>/<%= pkg.version %>/<%= pkg.distName.lessconcat %>',
      lessmin     : '<%= pkg.path.lessmin %><%= pkg.version %>/<%= pkg.distName.lessmin %>',
      sassconcat  : '<%= pkg.path.sassconcat %>/<%= pkg.version %>/<%= pkg.distName.sassconcat %>',
      sassmin     : '<%= pkg.path.sassmin %><%= pkg.version %>/<%= pkg.distName.sassmin %>'
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
          '<%= path.htmlmin %>' : '<%= configs.html %>'  //DO NOT CHANGE LEFT SIDE
        }
      },
      dev: {                                         // Target
        options: {                                 // Target options
          removeComments: true
        },                                    // Another target
        files: {
          '<%= path.htmlconcat %>' : '<%= configs.html %>' //DO NOT CHANGE LEFT SIDE
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
        src: '<%= configs.js %>',
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
          '<%= path.cssconcat %>' : '<%= configs.css %>'//DO NOT CHANGE LEFT SIDE
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
    //LESS
    less: {
      development: {
        options: {
          paths: ["css"]
        },
        files: {
          '<%= path.lessconcat %>': '<%= configs.less %>'
        }
      },
      production: {
        options: {
          paths: ["css"],
          yuicompress: true
        },
        files: {
          '<%= path.lessmin %>': '<%= configs.less %>'
        }
      }
    },

    //SASS
    sass: {                              // Task
      dist: {                            // Target
        files: {                         // Dictionary of files
          '<%= path.sassconcat %>': '<%= configs.sass %>'
        }
      },
      dev: {                             // Another target
        options: {                       // Target options
          style: 'expanded'
        },
        files: {
          '<%= path.sassmin %>': '<%= configs.sass %>'
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
      less: {
        files: [
          'less/*.less'
        ],
        tasks: ['buildLESS']
      },
      sass: {
        files: [
          'sass/*.sass'
        ],
        tasks: ['buildSASS']
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
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');

  /*grunt.task.registerTask('configs', 'Log stuff.', function() {
     var data = grunt.config('configs');

      for( var i in data ){
          grunt.log.writeln(data[i] );
          if( i == "js" ){
            grunt.task.run("jshint",data[i]);
          }
      }

  });*/

  grunt.registerTask('buildJS', ['jshint', 'concat', 'uglify']);
  grunt.registerTask('buildCSS', ['mincss']);
  grunt.registerTask('buildLESS', ['less']);
  grunt.registerTask('buildSASS', ['sass']);
  grunt.registerTask('buildHTML', ['htmlmin']);
  grunt.registerTask('default', ['buildHTML','buildJS', 'buildCSS', 'buildLESS', 'buildSASS'] );/*, 'configs'*/

  
};
