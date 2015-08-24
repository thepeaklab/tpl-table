'use strict';

module.exports = function(grunt) {
  // Load all grunt tasks
  require('load-grunt-tasks')(grunt);

  // Project configuration
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    yo: {
      src: 'src',
      dist: 'dist'
    },
    clean: {
      dist: {
        files: [{
          dot: true,
          src: ['.tmp', '<%= yo.dist %>/*', '!<%= yo.dist %>/.git*']
        }]
      },
      server: '.tmp'
    },
    jshint: {
      gruntfile: {
        options: {
          jshintrc: '.jshintrc'
        },
        src: 'Gruntfile.js'
      },
      src: {
        options: {
          jshintrc: '.jshintrc'
        },
        src: ['<%= yo.src %>/{,*/}*.js']
      },
      test: {
        options: {
          jshintrc: 'test/.jshintrc'
        },
        src: ['test/**/*.js']
      }
    },
    ngtemplates: {
      'tpl.table': {
        src: 'src/**/*.html',
        dest: 'src/templates.js'
      }
    },
    ngmin: {
      dist: {
        src: ['<%= yo.dist %>/<%= pkg.name %>.js'],
        dest: '<%= yo.dist %>/<%= pkg.name %>.js'
      }
    },
    concat: {
      options: {
        stripBanners: true
      },
      js: {
        src: ['<%= yo.src %>/*.js', '!<%= yo.src %>/loading-points*', '<%= yo.src %>/loading-points.directive.js', '!<%= yo.src %>/templates.js', '<%= yo.src %>/templates.js',],
        dest: '<%= yo.dist %>/tpl-table.js'
      },
      css: {
        src: ['.tmp/*.css'],
        dest: '<%= yo.dist %>/tpl-table.css'
      }
    },
    cssmin: {
      dist: {
        files: {
          '<%= yo.dist %>/tpl-table.min.css': [
            '<%= yo.dist %>/tpl-table.css'
          ]
        }
      }
    },
    sprite: {
      all: {
        src: '<%= yo.src %>/images/sprites/*.png',
        dest: '<%= yo.src %>/images/sprites.png',
        destCss: '<%= yo.src %>/sprites.scss',
        cssFormat: 'css',
        cssVarMap: function(sprite) {
          if (sprite.name.indexOf('--hover') >= 0) {
            sprite.name = sprite.name.replace('--hover', ':hover') + ', .icon-' + sprite.name +
            ', .icon-' + sprite.name.replace('--hover', '') + '.hover';
          }
        }
      }
    },
    compass: {
      options: {
        sassDir: '<%= yo.src %>',
        cssDir: '.tmp',
        javascriptsDir: '<%= yo.src %>',
        relativeAssets: true,
        assetCacheBuster: false,
        raw: 'Sass::Script::Number.precision = 10\n'
      },
      dist: {
        options: {
          debugInfo: true
        }
      }
    },
    uglify: {
      dist: {
        files: {
          '<%= yo.dist %>/<%= pkg.name %>.min.js': ['<%= yo.dist %>/<%= pkg.name %>.js']
        }
      }
    },
    copy: {
      dist: {
        files: [
          {
            expand: true,
            flatten: true,
            src: '<%= yo.src %>/fonts/*',
            dest: '<%= yo.dist %>/fonts/'
          }
        ]
      }
    }
    // githooks: {
    //   all: {
    //     // Will run the jshint and test:unit tasks at every commit
    //     'pre-commit': 'build',
    //   }
    // }
  });

  grunt.registerTask('test', ['jshint', 'karma:unit']);
  grunt.registerTask('build', ['clean:dist', 'sprite', 'ngtemplates', 'compass:dist', 'concat:css', 'cssmin', 'concat:js', 'ngmin:dist', 'uglify:dist', 'copy:dist']);
  grunt.registerTask('release', ['test', 'bump-only', 'build', 'bump-commit']);
  grunt.registerTask('default', ['build']);
};
