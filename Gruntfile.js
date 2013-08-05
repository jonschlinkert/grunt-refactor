/*
 * grunt-refactor
 * https://github.com/jonschlinkert/grunt-refactor
 *
 * Copyright (c) 2013 Jon Schlinkert
 * Licensed under the MIT license.
 */


module.exports = function(grunt) {

  'use strict';

  grunt.initConfig({

    // Regex for refactor task.
    replacements: require('./replacements').init(grunt),

    refactor: {
      // replace.sass_to_less
      sass_to_less: {
        options: {
          replacements: '<%= replacements.regex.sass %>'
        },
        files: [{
            expand: true,
            flatten: true,
            cwd: 'test/fixtures/compass/',
            src: ['*.scss'],
            dest: 'tmp/actual/compass/less/',
            ext: '.less',
            // rename: '<%= rename.less %>'

          }, {
            // bootstrap-sass
            expand: true,
            flatten: true,
            cwd: 'test/fixtures/bootstrap-sass/vendor/assets/stylesheets/bootstrap',
            src: ['**/*.scss'],
            dest: 'tmp/actual/bootstrap/less/',
            ext: '.less',
            // rename: '<%= rename.less %>'
          }, {
            // Foundation
            expand: true,
            flatten: true,
            cwd: 'test/fixtures/foundation/scss',
            src: ['**/*.scss'],
            dest: 'tmp/actual/foundation/core/',
            ext: '.less',
            // rename: '<%= rename.less %>'
          }, {
            // Foundation Docs
            expand: true,
            flatten: true,
            cwd: 'test/fixtures/foundation/docs/css',
            src: ['**/*.scss'],
            dest: 'tmp/actual/foundation/docs/',
            ext: '.less',
            // rename: '<%= rename.less %>'
          }, {
            // Foundation Templates
            expand: true,
            flatten: true,
            cwd: 'test/fixtures/foundation/templates/project/scss',
            src: ['**/*.scss'],
            dest: 'tmp/actual/foundation/templates/',
            ext: '.less',
            // rename: '<%= rename.less %>'
          }
        ]
      },
      // replace.liquid
      liquid: {
        options: {
          replacements: '<%= replacements.regex.liquid %>'
        },
        files: [{
            expand: true,
            cwd: 'test/fixtures/liquid/providence',
            src: ['**/*.liquid'],
            dest: 'tmp/actual/liquid/',
            ext: '.hbs'
          }
        ]
      },
      // replace.test
      test: {
        files: {
          'tmp/foo.txt': 'test/fixtures/foo.txt'
        },
        options: {
          replacements: [{
              pattern: '[test:string]',
              replacement: 'replaced!'
            }, {
              pattern: /\[test a:regex \d{3,}\]/,
              replacement: 'replaced!'
            }, {
              pattern: /\[test b:regex \d{3,}\]/g,
              replacement: 'replaced!'
            }, {
              pattern: /\[test c:regex \d{3,}\]/g,
              replacement: 'replaced!'
            }, {
              pattern: /\[test d:regex \d{3,}\]/ig,
              replacement: 'replaced!'
            }
          ]
        }
      }
    },

    // Strip preceding underscores from '.scss'
    // file names since LESS doesn't require them.
    rename: {
      remove_underscores: {
        options: {
          from: /\_/,
          to: ''
        },
        src: 'tmp/actual/**/*.less'
      }
    },


    // Attempt to compile converted LESS files
    less: {
      // boostrap-sass
      // The "replace" and "rename" tasks get 90% of the way
      // there. The grid in particular require more regex and patterns
      // than it's worth. But variables, mixins, even some browser
      // hacks are converted properly.
      bootstrap: {
        options: {
          paths: ['tmp/actual/bootstrap/less'],
          imports: {
            less: [
                'tmp/actual/bootstrap/less/variables.less',
                'tmp/actual/bootstrap/less/mixins.less'
            ]
          }
        },
        files: [{
            expand: true,
            flatten: true,
            cwd: 'tmp/actual/bootstrap/less',
            src: ['*.less'],
            dest: 'tmp/actual/bootstrap/css/',
            ext: 'c.ss'
          }
        ]
      },

      // ZURB Foundation.
      // As with sass-bootstrap, the "replace" and "rename"
      // tasks get 90% of the way there. You will need to
      // make decisions with if/else statements, and comment
      // out or change other code that doesn't convert.
      foundation: {
        options: {
          paths: [
              'tmp/actual/foundation/core',
              'tmp/actual/foundation/docs',
              'tmp/actual/foundation/templates'
          ]
        },
        src: 'tmp/actual/foundation/core/*.less',
        dest: 'tmp/actual/foundation/core.css'
      },
      foundationDocs: {
        options: {
          paths: [
              'tmp/actual/foundation/core',
              'tmp/actual/foundation/docs',
              'tmp/actual/foundation/templates'
          ]
        },
        src: 'tmp/actual/foundation/docs/*.less',
        dest: 'tmp/actual/foundation/docs.css'
      },
      foundationTemplates: {
        options: {
          paths: [
              'tmp/actual/foundation/core',
              'tmp/actual/foundation/docs',
              'tmp/actual/foundation/templates'
          ]
        },
        src: 'tmp/actual/foundation/templates/*.less',
        dest: 'tmp/actual/foundation/templates.css'
      }
    },

    // Attempt to build refactored templates
    assemble: {
      options: {
        flatten: true,
        layoutdir: 'tmp/actual/liquid/layout',
        assets: 'tmp/actual/assets'
      },
      paths: {
        options: {
          partials: 'tmp/actual/liquid/snippets/*.hbs',
          layout: 'theme.hbs',
          // data: ['test/data/*.yml']
        },
        files: {
          'tmp/site/': ['tmp/actual/liquid/templates/*.hbs']
        }
      }
    },

    jshint: {
      all: ['Gruntfile.js', 'tasks/*.js'],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    // Clean out actuals folder before each build.
    clean: {
      tests: {
        src: ['tmp/**']
      }
    }

  });

  // Load NPM tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('assemble-less');
  grunt.loadNpmTasks('assemble');

  // Load this task.
  grunt.loadTasks('tasks');

  // By default, lint and run all tests.
  grunt.registerTask('test', ['jshint']);

  // Refactor code.
  grunt.registerTask('sass',   ['refactor:sass_to_less']);
  grunt.registerTask('liquid', ['refactor:liquid']);
  grunt.registerTask('styles', ['refactor:styles']);

  // The default task to be run with the 'grunt' command.
  grunt.registerTask('default', ['clean', 'test', 'sass', 'liquid', 'rename']);
};