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

