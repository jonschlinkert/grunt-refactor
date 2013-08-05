/*
 * Regex for converting Bootstrap's liquid
 * templates over to Handlebars.
 * Copyright (c) 2013 Jon Schlinkert
 * Licensed under the MIT license.
 */

exports.init = function(grunt) {

  exports.regex = {

    // Regex for SASS replacements
    sass: [
      {
        // replace SASS mixins with LESS mixins
        pattern: /@mixin /g,
        replacement: '.'
      },
      {
        // replace SASS variables with LESS variables
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
      },
      {
        // Convert SASS core grid mixin back to Bootstrap
        pattern: /@include grid-core-span-x/g,
        replacement: '#grid > .spanX'
      },
      {
        // Convert SASS core grid mixin back to Bootstrap
        pattern: /@include grid-fluid-span-x/g,
        replacement: '#grid > .spanX'
      },
      {
        // Convert SASS core grid mixin back to Bootstrap
        pattern: /@include grid-fluid-offset-x/g,
        replacement: '#grid > .offsetX'
      },
      {
        // Convert SASS core grid mixin back to Bootstrap
        pattern: /@include grid-core-span/g,
        replacement: '#grid > .core > .span'
      },
      {
        // Convert SASS core grid mixin back to Bootstrap
        pattern: /@include grid-core/g,
        replacement: '#grid > .core'
      },
      {
        // Convert SASS core grid mixin back to Bootstrap
        pattern: /@include grid-fluid/g,
        replacement: '#grid > .fluid'
      },
      {
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
      },
      {

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
      },
      {
        pattern: /.font-monospace/g,
        replacement: '#font > .monospace'
      },
      {
        pattern: /.font-serif/g,
        replacement: '#font > .serif'
      },
      {
        pattern: /.font-family-/g,
        replacement: '#font > #family > .'
      },
      {
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
      },
      {
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
      },
      {
        pattern: /(box-shadow\()(.*)(?=\),)(.*)(?=\);)/g,
        replacement: 'box-shadow(~"$2$3"'
      },


      // URL/paths
      // =================================

      {
        // Interpolated variables in urls
        pattern: /(url\(@)(.*)(?=\);)/g,
        replacement: 'url("@{$2}"'
      },
      {
        pattern: /(image-path\(")(.*)(\);)/g,
        replacement: '"../img/$2;'
      },
      {
        // Replace SASS interpolated variables with LESS interpolated variables
        pattern: /\#{ */g,
        replacement: '@{'
      },
      {
        // Replace '.scss' extension with '.less'
        // mostly in @import statements
        pattern: /\ ?.scss */g,
        replacement: '.less'
      },
      {
        // Replace "adjust-hue" with "spin"
        pattern: /\adjust-hue/g,
        replacement: 'spin'
      },
      {
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
      },
      {
        // same silliness...
        pattern: /\sfamily:\s*/gim,
        replacement: '  font-family: '
      },
      {
        // same silliness...
        pattern: /fade-in\(/gim,
        replacement: 'fadein('
      },
      {
        // same...
        pattern: /\sweight:\s*/gi,
        replacement: '  font-weight: '
      },
      {
        // same...
        pattern: /\sstyle:\s*/gim,
        replacement: '  font-style: '
      },
      {
        // same...
        pattern: /\ssize:\s*/gim,
        replacement: '  font-size: '
      },
      {
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
      },
      {
        pattern: /@each @item in label, badge/g,
        replacement: '.label, \n.badge'
      },
      {
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
    ],

    // Regex for Liquid replacements
    liquid: [
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
  };

  return exports;
};