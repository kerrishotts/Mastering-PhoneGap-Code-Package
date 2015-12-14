"use strict";

// performing substitutions version
var gulp = require("gulp"),
//    performSubstitutions = require("../utils/performSubstitutions"),
    config = require("../config"),
    paths = require("../utils/paths");
/*
function copyConfig() {
    return gulp.src([paths.makeFullPath("config.xml", paths.SRC)])
               .pipe(performSubstitutions())
               .pipe(gulp.dest(paths.makeFullPath(".", paths.DEST)));
}
*/

// final version
var cordovaTasks = require("../utils/cordova-tasks");

function copyConfig() {
    return cordovaTasks.copyConfig();
}

module.exports = {
    task: copyConfig,
    desc: "Transforms 'config.xml'",
    help: ["Copies and populates the 'config.xml' template in the source directory and",
            "writes the result to the build directory. Most of the parameters are stored",
            "in 'package.json'."]
}
