"use strict";

var gulp = require("gulp"),
    jscs = require("gulp-jscs"),
    config = require ("../config"),
    settings = require("../settings"),
    paths = require("../utils/paths");


function checkCodeStyle() {
    var p = paths.makeFullPath("jscs.json", paths.CONFIG);
    console.log(p);
    return gulp.src(paths.makeFullPath(config["code-style"]))
        .pipe(jscs({
            configPath: p,
            esnext: true
        }));
}

module.exports = {
    task: checkCodeStyle,
    desc: "Check the project's code style",
    help: ["Checks your project's code style using jscs. The configuration is taken from",
            "<project-root>/config.jscs.json"]
};
