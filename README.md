# [grunt-refactor](http://github.com/jonschlinkert/grunt-refactor) [![Build Status](https://travis-ci.org/jonschlinkert/grunt-refactor.png)](https://travis-ci.org/jonschlinkert/grunt-refactor)

> Grunt tasks for refactoring code

As a proof-of-concept, the project is using (mostly) out-of-the-box Grunt tasks for converting SASS/SCSS to LESS and CSS to LESS. But as a broader goal, the project is focused on finding relatively simple ways to refactor massive amounts of code.

Just download the project and then run `npm install` to install all of the project's dependencies.  After everything is installed, run `grunt`, and you will see **an official _shload_ of SASS/SCSS files get refactored to LESS**.


### Tasks used in the project

* [grunt-rename](https://github.com/doowb/grunt-rename): enables file renaming based on patterns.
* [grunt-string-replace](https://github.com/erickrdch/grunt-replace) [![Build Status](https://travis-ci.org/erickrdch/grunt-string-replace.png?branch=0.2.0rc1)](https://travis-ci.org/erickrdch/grunt-string-replace): "replaces strings on files by using string or regex patterns. Attempts to be a [String.prototype.replace](http://www.ecma-international.org/ecma-262/5.1/#sec-15.5.4.11) adapter task for your grunt project".
* [assemble-less](http://github.com/assemble/assemble-less): "Compile LESS to CSS, with options for creating 'bundles', individual components, themes or whatever makes you happy". This task is used


### Did you say "it refactors SASS to LESS"? How well does it work?

Oh ho, hoho scoodlie do, I am sooo glad you asked that question! Not really, but you know what, _yes_ I did say "refactor", and this project does a freakin' amazing job of almost doing a good job. If I had to guess, which I hate doing btw, it gets you somewhere between 97-104% of the way there.

In a nutshell, here is how it works:

1. The `rename` task:
    * grabs a bunch of `.scss` files from each defined `src`
    * changes the file extensions to `.less`
    * removes the silly underscores from file names. Lol, underscores.
    * does some other really cool things you'll have to learn for yourself (this is just a way of buying me time until I can convince the author of that plugin to add more cool things)
2. The `replace` task then, well, replaces... things. But if you insist I get technical, the task:
    * grabs each _newly created_ `.less` file
    * uses a series of (mostly) simple regex patterns to find and replace SASS syntax with LESS syntax. Like this gem (seriously, take it easy on me. I'm not like you, I can't just pickup a copy of "Regex Weekly" and get down to business. This stuff hurted my brain.)


``` js
{
  pattern: /(transition\()(.*)(?=,)(.*\b)/g,
  replacement: "transition(e('$2$3')"
}
```

#### What works?

A bunch, actually. For instance:

* Variables: from: `$`, to: `@`
* Mixins: from: `@mixin` and `@include`, to: `.`
* Import statements: cleaned up, but see below.
* Remove all SASS `!default` declarations
* Replace `adjust-hue` with `spin`
* Replace `fade-in` with `fadein`
* A ton of other "one-off" stuff commented in the Gruntfile...

In the **./test/** folder you will find files from [bootstrap-sass](https://github.com/thomas-mcdonald/bootstrap-sass) and [foundation](https://github.com/zurb/foundation). I converted the `.scss` from both libraries to LESS to help me stay focused on implementing practical patterns. I was actually pleasantly surprised at how close I came to converting all of the Bootstrap `.scss` files back to LESS. Try doing a diff between the converted sass files and "native" bootstrap less files (v2.3.1) - it's not feature complete, but it saves a lot of time.

#### What doesn't work?

Let's just say, enough to get you fired if you're adventurous enough to use this on anything that pays your bills.

* Import statements: LESS cannot do comma separated lists of values, as SASS does. But this is easy to do if you're refactoring manually.
* `@if`, `@else` and other magic that LESS doesn't do. These will have to be addressed by your actual brain, personally. (or impersonally, that's your call)
* More described in the code comments.


## [grunt-string-replace](https://github.com/erickrdch/grunt-replace)

To install this grunt plugin on your project simply do: `npm install grunt-string-replace`

Then add this line to your project's `Gruntfile.js`:

```javascript
grunt.loadNpmTasks('grunt-string-replace');
```

[grunt]: http://gruntjs.com/


### Configuration

Inside your `Gruntfile.js` file add a section named `replace`. This section specifies the files to edit, destinations, patterns and replacements.

### Parameters

##### files `object`

This defines what files this task will edit and must follow [Gruntfile Files mapping](https://github.com/gruntjs/grunt/wiki/Configuring-tasks).

##### options `object`

This controls how this task operates and should contain key:value pairs, see options below.

#### Options

##### replacements `array`

This option will hold all your pattern/replacement pairs. A pattern/replacement pair should contain key:value pairs containing:

* pattern `string` or `regex`
* replacement `string`

``` javascript
replace: {
  options: {
    replacements: [
      {
        pattern: /\/(asdf|qwer)\//ig,
        replacement: "'$1'"
      },
      {
        pattern: ",",
        replacement: ";"
      }
    ]
  }
}
```
_Note: If the pattern is a string, only the first occurrence will be replaced, as stated on [String.prototype.replace](http://www.ecma-international.org/ecma-262/5.1/#sec-15.5.4.11)._


## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [grunt][grunt].


## Credit
Special thanks to [Erick Ruiz de Chavez](https://github.com/erickrdch) for creating [grunt-string-replace](https://github.com/erickrdch/grunt-string-replace). This isn't a fork of that project, because I'm using other tasks as well, but it might as well be because this project wouldn't exist without it. Please visit [grunt-string-replace](https://github.com/erickrdch/grunt-replace) and star it!


## License
Copyright (c) 2013 Jon Schlinkert, and the authors of tasks utilized herein.

Licensed under the MIT license.
