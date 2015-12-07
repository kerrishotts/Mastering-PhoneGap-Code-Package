"use strict";

var gulp = require("gulp"),
    notify = require("gulp-notify"),
    config = require("../config"),
    paths = require("../utils/paths"),
    mocha = require("gulp-mocha");

function test() {
    return gulp.src(paths.makeFullPath(config.test.code), {read: false})
                .pipe(mocha({reporter: "spec"}))
                .on("error", notify.onError("TEST: <%= error.message %>"))
                .once("error", function () {
                    process.exit(1);
                })
                .once("end", function () {
                    process.exit();
                });
}

module.exports = {
    task: test,
    desc: "Runs code-level tests",
    help: ["Executes code-level tests in ./test using Mocha"]
};
