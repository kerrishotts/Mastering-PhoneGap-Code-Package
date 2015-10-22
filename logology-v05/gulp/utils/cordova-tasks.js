"use strict";

var pkg = require("../../package.json"),
    config = require("../config"),
    gulp = require("gulp"),
    replace = require("gulp-replace-task");

var cordova = require("cordova-tasks");
var cordovaTasks = new cordova.CordovaTasks({pkg: pkg,
                                             basePath: process.cwd(),
                                             buildDir: config.paths.dest,
                                             sourceDir: config.paths.src,
                                             gulp: gulp, 
                                             replace: replace});

module.exports = cordovaTasks;
