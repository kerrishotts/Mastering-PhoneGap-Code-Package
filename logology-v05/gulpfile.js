/*globals require, __dirname */
"use strict";
require ("babel/register");

var gulp = require("gulp");                         // Gulp itself
var browserSync = require("browser-sync").create("www");

var tasks = require("./gulp/tasks");

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
