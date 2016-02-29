/*****************************************************************************
 *
 * Author: Kerri Shotts <kerrishotts@gmail.com> 
 *         http://www.photokandy.com/books/mastering-phonegap
 *
 * MIT LICENSED
 * 
 * Copyright (c) 2016 Packt Publishing
 * Portions Copyright (c) 2016 Kerri Shotts (photoKandy Studios LLC)
 * Portions Copyright various third parties where noted.
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this
 * software and associated documentation files (the "Software"), to deal in the Software
 * without restriction, including without limitation the rights to use, copy, modify,
 * merge, publish, distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to the following
 * conditions:
 * The above copyright notice and this permission notice shall be included in all copies
 * or substantial portions of the Software.
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
 * PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT
 * OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 * 
 *****************************************************************************/

"use strict";

var pkg = require("../../package.json"),
    replace = require("gulp-replace-task");

function performSubstitutions() {
  function transformCordovaPrefs() {
    var template = '<preference name="{{{NAME}}}" ' + 
                   'value="{{{VALUE}}}" />';
    if (pkg.cordova &&
      pkg.cordova.preferences instanceof Object) {
      return Object.keys(pkg.cordova.preferences).map(
        function(prefName) {
          var str = template.replace(/{{{NAME}}}/g,
            prefName)
            .replace(/{{{VALUE}}}/g,
              pkg.cordova.preferences[prefName]);
          return str;
        }).join("\n  ");
    }
  }

  return replace({
    patterns: [
      {
        match: /{{{VERSION}}}/g,
        replacement: pkg.version
      },
      {
        match: /{{{ID}}}/g,
        replacement: pkg.cordova.id
      },
      {
        match: /{{{NAME}}}/g,
        replacement: pkg.cordova.name
      },
      {
        match: /{{{DESCRIPTION}}}/g,
        replacement: pkg.cordova.description
      },
      {
        match: /{{{AUTHOR.NAME}}}/g,
        replacement: pkg.cordova.author.name
      },
      {
        match: /{{{AUTHOR.EMAIL}}}/g,
        replacement: pkg.cordova.author.email
      },
      {
        match: /{{{AUTHOR.SITE}}}/g,
        replacement: pkg.cordova.author.site
      },
      {
        match: /{{{PREFS}}}/g,
        replacement: transformCordovaPrefs
      }
    ]
  });
}

module.exports = performSubstitutions;

