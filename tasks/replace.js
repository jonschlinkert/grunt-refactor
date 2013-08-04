/*
 * grunt-refactor
 * Based on grunt-string-replace
 * https://github.com/erickrdch/grunt-string-replace
 *
 * Copyright (c) 2012 Erick Ruiz de Chavez
 * Licensed under the MIT license.
 */

module.exports = function(grunt) {
  'use strict';

  var path = require('path');

  grunt.registerMultiTask('refactor', 'String Replace Task.', function() {
    var options = this.options({
      replacements: [],
      rename: []
    });

    // Execute replacements
    var replacements = normalizeReplacements(options.replacements);
    replace(this.files, replacements);
  });

  // Detect file or directory
  function detectDestType(dest) {
    if (grunt.util._.endsWith(dest, '/')) {
      return 'directory';
    } else {
      return 'file';
    }
  }
  // Convert paths to slashes
  function normalizePath(filepath) {
    if (process.platform === 'win32') {
      return filepath.replace(/\\/g, '/');
    } else {
      return filepath;
    }
  }
  function replace(files, replacements) {
    var dest;
    var isExpandedPair;
    var content;

    files.forEach(function(filePair) {
      filePair.src.forEach(function(src) {
        isExpandedPair = filePair.orig.expand || false;

        if (detectDestType(filePair.dest) === 'directory') {
          dest = (isExpandedPair) ? filePair.dest : normalizePath(path.join(filePair.dest, src));
        } else {
          dest = filePair.dest;
        }

        content = grunt.file.read(src);
        content = replaceMultiStrings(content, replacements);
        grunt.file.write(dest, content);
      });
    });
  }
  function replaceMultiStrings(string, replacements) {
    return replacements.reduce(function(content, replacement) {
      return content.replace(replacement[0], replacement[1]);
    }, string);
  }
  function normalizeReplacements(replacements) {
    return replacements.map(function(replacement) {
      return [replacement.pattern, replacement.replacement];
    });
  }
};