/*
 * grunt-rename
 * https://github.com/doowb/grunt-rename
 *
 * Copyright (c) 2013 Brian Woodward
 * Licensed under the MIT license.
 */

module.exports = function(grunt) {
  "use strict";

  var path = require('path');
  var fs   = require('fs');

  // rename files in a path
  grunt.registerMultiTask('rename', 'Rename files in a path', function() {

    var done    = this.async();
    var helpers = require('grunt-lib-contrib').init(grunt);
    var options = this.options({
      process: function(src, callback) {
        if (callback) {
          callback(src);
        }
        return src;
      }
    });

    grunt.verbose.writeflags(options, 'Options');
    grunt.verbose.writeflags(this.files);

    this.files.forEach(function(filePair) {

      // validate that the source object exists
      // and there are files at the source.
      if (!filePair.src) {
        grunt.warn('Missing src property.');
        return false;
      }
      if (filePair.src.length === 0) {
        grunt.warn('Source files not found.');
        return false;
      }

      var src = filePair.src;
      src.forEach(function(srcFile) {
        srcFile = path.normalize(srcFile);
        var dirname = path.dirname(srcFile);
        var filename = path.basename(srcFile);
        if (options.process) {
          options.process(filename, function(dest) {
            dest = path.normalize(path.join(dirname, dest));
            grunt.verbose.writeln('Renaming ' + srcFile.cyan + ' -> ' + dest.cyan);
            fs.renameSync(srcFile, dest);
          });
        }
      }); // src.forEach

    }); // this.files.forEach

    if (done) {
      done();
    }

  }); // grunt.registerMultiTask
};