/*globals require, __dirname */
"use strict";
require ("babel/register");

var gulp = require("gulp");                         // Gulp itself

var tasks = require("./gulp/tasks");
//var help = require("./gulp/help");

//
// register tasks with gulp
Object.keys(tasks).forEach(function(taskName) {
    var taskOpts = tasks[taskName];
    if (typeof taskOpts === "function") {
        gulp.task(taskName, taskOpts);
    } else {
        gulp.task(taskName, taskOpts.deps, taskOpts.task);
    }
});
