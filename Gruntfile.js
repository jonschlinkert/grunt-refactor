/*
 * grunt-refactor
 * https://github.com/jonschlinkert/grunt-refactor
 *
 * Copyright (c) 2013 Jon Schlinkert
 * Licensed under the MIT license.
 */


module.exports = function(grunt) {

  'use strict';

  // Captures the `@import` path and media condition
  var Import = /\@import\s*(?:url\()?\s*["']([^'"]*)['"]\s*\)?\s*(.*?);/;

  // WIP. Global version of `Import`
  var ImportGlobal = new RegExp(Import.toString().slice(1, Import.toString().length - 1), ['g']);


  grunt.initConfig({

    replace: {
      // replace.sass_with_less
      sass_with_less: {
        files: [{
            expand: true,
            flatten: true,
            cwd: 'test/fixtures/compass/',
            src: ['*.scss'],
            dest: 'test/result/compass/less/',
            ext: '.less'
          }, {
            // bootstrap-sass
            expand: true,
            flatten: true,
            cwd: 'test/fixtures/bootstrap-sass/vendor/assets/stylesheets/bootstrap',
            src: ['**/*.scss'],
            dest: 'test/result/bootstrap/less/',
            ext: '.less'
          }, {
            // Foundation
            expand: true,
            flatten: true,
            cwd: 'test/fixtures/foundation/scss',
            src: ['**/*.scss'],
            dest: 'test/result/foundation/core/',
            ext: '.less'
          }, {
            // Foundation Docs
            expand: true,
            flatten: true,
            cwd: 'test/fixtures/foundation/docs/css',
            src: ['**/*.scss'],
            dest: 'test/result/foundation/docs/',
            ext: '.less'
          }, {
            // Foundation Templates
            expand: true,
            flatten: true,
            cwd: 'test/fixtures/foundation/templates/project/scss',
            src: ['**/*.scss'],
            dest: 'test/result/foundation/templates/',
            ext: '.less'
          }
        ],
        options: {
          replacements: [{
              // Replace SASS mixins with LESS mixins
              pattern: /@mixin /g,
              replacement: '.'
            }, {
              // Replace SASS variables with LESS variables
              pattern: /\$ */g,
              replacement: '@'
            },

            // GRID SYSTEM
            // ======================================================

            // The following grid patterns are here for the hell of it,
            // for testing purposes only to help identify useful patterns.
            // The grid won't work after you convert, because SASS doesn't
            // have the ability to do the same things as LESS, so there
            // are workarounds that won't convert back to LESS.
            //
            // Besides, there is no practical reason to use a verion of 
            // Bootstrap that was converted from LESS to SASS and back 
            // to LESS.
            {
              // Convert SASS grid mixin back to Bootstrap
              pattern: /@include grid-input/g,
              replacement: '#grid > .input'
            }, {
              // Convert SASS core grid mixin back to Bootstrap
              pattern: /@include grid-core-span-x/g,
              replacement: '#grid > .spanX'
            }, {
              // Convert SASS core grid mixin back to Bootstrap
              pattern: /@include grid-fluid-span-x/g,
              replacement: '#grid > .spanX'
            }, {
              // Convert SASS core grid mixin back to Bootstrap
              pattern: /@include grid-fluid-offset-x/g,
              replacement: '#grid > .offsetX'
            }, {
              // Convert SASS core grid mixin back to Bootstrap
              pattern: /@include grid-core-span/g,
              replacement: '#grid > .core > .span'
            }, {
              // Convert SASS core grid mixin back to Bootstrap
              pattern: /@include grid-core/g,
              replacement: '#grid > .core'
            }, {
              // Convert SASS core grid mixin back to Bootstrap
              pattern: /@include grid-fluid/g,
              replacement: '#grid > .fluid'
            }, {
              pattern: /@gridColumns, @gridColumnWidth, @gridGutterWidth/g,
              replacement: '@gridColumns'
            },

            //
            // GRADIENTS
            // ======================================================

            {
              // Replace remaining SASS includes with LESS mixins
              // Leave this generic pattern last after other specific
              // "@include" patterns
              pattern: /@include /g,
              replacement: '.'
            }, {

              // Convert SASS gradient mixin back to Bootstrap
              pattern: /.gradient-/g,
              replacement: '#gradient > .'
            },

            //
            // Replace SASS font classes with Bootstrap mixins
            // ===============================================
            {
              pattern: /.font-shorthand/g,
              replacement: '#font > .shorthand'
            }, {
              pattern: /.font-monospace/g,
              replacement: '#font > .monospace'
            }, {
              pattern: /.font-serif/g,
              replacement: '#font > .serif'
            }, {
              pattern: /.font-family-/g,
              replacement: '#font > #family > .'
            }, {
              pattern: /.font-sans-serif/g,
              replacement: '#font > .sans-serif'
            },
            // {
            //   pattern: /(#font > )(.*)(\<=@size: @baseFontSize)/g,
            //   replacement: '$2'
            // },


            // @import statements
            // ===============================================

            {
              // Remove first underscore in files referenced in @import statements
              // just testing to see if lodash templates work with regex
              pattern: /\@import "_ */g,
              replacement: '@import "'
            },

            // {
            //   // Convert a list of comma separated @import statements into valid
            //   // import statements.
            //   pattern: /(.+)(",|;$)/g,
            //   replacement: '@import $1";'
            // },
            {
              // Remove "boostrap/" from path in @import statements, since we
              // don't need them with LESS. (see the "paths" option in the
              // 'less' task above)
              pattern: /(bootstrap\/)(.*)(";)/g,
              replacement: '$2.less";'
            },

            // Strip !important and !default declarations.
            // keep these patterns before other patterns that modify properties
            // and values.
            {
              // Remove all "!important" declarations
              pattern: /\ !important */g,
              replacement: ''
            }, {
              // Remove all "!default" declarations
              pattern: /\s*!default */g,
              replacement: ''
            },

            // Transitions and box-shadows are common properties with comma-
            // separated values. Add other properties with the same pattern
            // if you require them.
            //
            // Less requires that comma separated values
            // be wrapped like this: ~"comma, separated, values".
            // The following regex will the values of ALL transitions and
            // box shadows, regardless of whether or not they have more than
            // one value. That's fine though, less doesn't mind. We could
            // get more specific, but what's the point?
            {
              pattern: /(transition\()(.*)(?=,)(.*\b)/g,
              replacement: "transition(e('$2$3')"
            }, {
              pattern: /(box-shadow\()(.*)(?=\),)(.*)(?=\);)/g,
              replacement: 'box-shadow(~"$2$3"'
            },


            // URL/paths
            // =================================

            {
              // Interpolated variables in urls
              pattern: /(url\(@)(.*)(?=\);)/g,
              replacement: 'url("@{$2}"'
            }, {
              pattern: /(image-path\(")(.*)(\);)/g,
              replacement: '"../img/$2;'
            }, {
              // Replace SASS interpolated variables with LESS interpolated variables
              pattern: /\#{ */g,
              replacement: '@{'
            }, {
              // Replace '.scss' extension with '.less'
              // mostly in @import statements
              pattern: /\ ?.scss */g,
              replacement: '.less'
            }, {
              // Replace "adjust-hue" with "spin"
              pattern: /\adjust-hue/g,
              replacement: 'spin'
            }, {
              // Replace "fade-in" with "fadein"
              pattern: /\fade-in/g,
              replacement: 'fadein'
            },
            // {
            //   // Remove all line comments
            //   pattern: /(\/\/[^\n]*)/g,
            //   replacement: ''
            // },
            // {
            //   // Remove all block comments
            //   pattern: /(\/\*(?:[^*\n]|\*+[^\/*])*\*+\/)/g,
            //   replacement: ''
            // },
            {
              // Can't really fix silly font bs, but try to turn "font: {"
              // into a mixin anyway: .font() {}
              pattern: /\sfont:\s*{/gim,
              replacement: '  .font () {'
            }, {
              // same silliness...
              pattern: /\sfamily:\s*/gim,
              replacement: '  font-family: '
            },
            {
              // same silliness...
              pattern: /fade-in\(/gim,
              replacement: 'fadein('
            }, {
              // same...
              pattern: /\sweight:\s*/gi,
              replacement: '  font-weight: '
            }, {
              // same...
              pattern: /\sstyle:\s*/gim,
              replacement: '  font-style: '
            }, {
              // same...
              pattern: /\ssize:\s*/gim,
              replacement: '  font-size: '
            }, {
              // Try to turn "min: {" into a mixin just to make it pass
              pattern: /\smin:\s*{/gim,
              replacement: '  .min () {'
            },

            // {
            //   // Comment out "if" statments
            //   // This DOESN"T WORK YET!!
            //   pattern: /([^@if]  +)/gim,
            //   replacement: '//  '
            // }


            // A few "one-off" patterns and some
            //  clean up just for convenience
            // =================================
            {
              pattern: /(~"none")/g,
              replacement: 'none'
            }, {
              pattern: /@each @item in label, badge/g,
              replacement: '.label, \n.badge'
            }, {
              pattern: /.@{@item}/g,
              replacement: '&'
            },

            // Microsoft, oh microsoft.
            {
              pattern: /progid:DXImageTransform.Microsoft.gradient\(enabled=false\)/g,
              replacement: 'e(%("progid:DXImageTransform.Microsoft.gradient(enabled = false)"))'
            },
            // {
            //   pattern: /(\\9)/g,
            //   replacement: ' e(\"\\9\")'
            // },
            {
              pattern: /alpha\(opacity=@opacity\)/g,
              replacement: '~"alpha(opacity=@{opacity})"'
            }
          ]
        }
      },
      // replace.liquid
      liquid: {
        files: [
          {expand: true, flatten: true, cwd: 'test/fixtures/liquid/', src: ['**/*.liquid'], dest: 'test/result/liquid/', ext: '.hbs'}
        ],
        options: {
          replacements: [
            // Replace liquid variables
            {
              pattern: /({%= )/g,
              replacement: '{{'
            }, {
              pattern: /({% )/g,
              replacement: '{{'
            }, {
              pattern: /( %})/g,
              replacement: '}}'
            }, {
              pattern: /({% if)/g,
              replacement: '{{#if'
            }, {
              pattern: /({{if)/g,
              replacement: '{{#if'
            }, {
              pattern: /(endif)/g,
              replacement: '/if'
            }, {
              pattern: /(endfor)/g,
              replacement: '/for'
            }, {
              pattern: /( \|\| \'\')/g,
              replacement: ''
            }, {
              pattern: /({{)(include ')(.*)('\}})/g,
              replacement: '$1> $3 }}'
            }, {
              pattern: /(')/g,
              replacement: ''
            }
          ]
        }
      },
      // replace.styles
      styles: {
        options: {
          replacements: [{
              pattern: /\@import "_ */g,
              replacement: '@import "'
            }
          ]
        },
        files: [
          {expand: true, flatten: true, cwd: 'test/fixtures/underscore/', src: ['*.tmpl.md'],   dest: 'test/result/underscore/', ext: '.md.hbs'},
          {expand: true, flatten: true, cwd: 'test/fixtures/liquid/',     src: ['**/*.liquid'], dest: 'test/result/liquid/',     ext: '.hbs'}
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

    rename: {
      sass_to_less: {
        options: {
          // Strip preceding underscores from '.scss' filenames since LESS doesn't require them.
          process: function(src, callback) {
            var dest = src.replace(/\_/, '');
            if (callback) {
              callback(dest);
            }
            return dest;
          }
        },
        files: [{
            src: 'test/result/**/*.less'
          }
        ]
      }
    },

    // Attempt to compile converted LESS files
    less: {
      // test: {
      //   options: {
      //     paths: 'test/result/sample/less'
      //   },
      //   src: 'test/result/compass/less/*.less',
      //   dest: 'test/result/compass/result.css'
      // },

      // boostrap-sass
      // The "replace" and "rename" tasks get 90% of the way 
      // there. The grid in particular just won't convert cleanly. 
      // But variables, mixins, even some browser hacks are converted.
      bootstrap: {
        options: {
          concat: false,
          require: [
              'test/result/bootstrap/less/variables.less',
              'test/result/bootstrap/less/mixins.less'
          ],
          paths: 'test/result/bootstrap/less'
        },
        src: 'test/result/bootstrap/less/*.less',
        dest: 'test/result/bootstrap/css'
      },

      // ZURB Foundation.
      // As with sass-bootstrap, the "replace" and "rename" 
      // tasks get 90% of the way there. You will need to
      // make decisions with if/else statements, and comment 
      // out or change other code that doesn't convert.
      foundation: {
        options: {
          paths: [
              'test/result/foundation/core',
              'test/result/foundation/docs',
              'test/result/foundation/templates'
          ]
        },
        src: 'test/result/foundation/core/*.less',
        dest: 'test/result/foundation/core.css'
      },
      foundationDocs: {
        options: {
          paths: [
              'test/result/foundation/core',
              'test/result/foundation/docs',
              'test/result/foundation/templates'
          ]
        },
        src: 'test/result/foundation/docs/*.less',
        dest: 'test/result/foundation/docs.css'
      },
      foundationTemplates: {
        options: {
          paths: [
              'test/result/foundation/core',
              'test/result/foundation/docs',
              'test/result/foundation/templates'
          ]
        },
        src: 'test/result/foundation/templates/*.less',
        dest: 'test/result/foundation/templates.css'
      }
    },

    // Attempt to build refactored templates
    assemble: {
      options: {
        flatten: true,
        layout: 'layout.hbs',
        layoutdir: 'test/templates/layouts',
        assets: 'test/actual/assets'
      },
      paths: {
        options: {
          partials: 'test/templates/partials/*.hbs',
          layout: 'paths-example.hbs',
          data: ['test/data/*.yml']
        },
        files: {
          'test/actual/paths/': ['test/templates/pages/*.hbs']
        }
      }
    },

    jshint: {
      all: ['Gruntfile.js', 'tasks/*.js'],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    // Clean out results folder before each build.
    clean: {
      tests: {
        src: ['test/result']
      }
    }

  });

  // Load npm tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('assemble-less');

  // Load local tasks.
  grunt.loadTasks('tasks');

  grunt.registerTask('sass',    ['replace:sass_with_less']);
  grunt.registerTask('liquid',  ['replace:liquid']);
  grunt.registerTask('styles',  ['replace:styles']);

  // By default, lint and run all tests.
  grunt.registerTask('test',    ['jshint']); // 'less:test'
  grunt.registerTask('default', [
    'clean',
    'jshint',
    'sass',
    'styles',
    'liquid',
    'rename'
  ]);
};