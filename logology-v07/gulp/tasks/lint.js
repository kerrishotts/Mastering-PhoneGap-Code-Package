"use strict";

var gulp = require("gulp"),
    eslint = require("gulp-eslint"),
    config = require ("../config"),
    settings = require("../settings"),
    paths = require("../utils/paths");


function lintCode() {
    return gulp.src(paths.makeFullPath(config.lint))
        .pipe(eslint(paths.makeFullPath("eslint.json", paths.CONFIG)))
        .pipe(eslint.format())
        .pipe(settings.FAIL_ON_ERROR ? eslint.failOnError() : gutil.noop());
}

module.exports = {
    task: lintCode,
    desc: "Lint the project code",
    help: ["Lints your project's code using eslint. The configuration is taken from",
            "<project-root>/config/eslint.json"]
};
