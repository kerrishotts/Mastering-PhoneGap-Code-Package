"use strict";

var gulp = require("gulp"),
    gutil = require("gulp-util"),
    notify = require("gulp-notify"),
    config = require("../config"),
    settings = require("../settings"),
    paths = require("../utils/paths"),
    mocha = require("gulp-mocha");

function testUI() {
    var iosUDID = gutil.env.udid;
    var profile = gutil.env.profile;
    var server = gutil.env.server || "local";

    process.env["UIA_PROFILE"] = profile;
    process.env["UIA_SERVER"] = server;
    if (settings.VERBOSE) {
        process.env["UIA_LOGGING"] = "enabled";
    }
    if (iosUDID) {
        process.env["UIA_UDID"] = iosUDID;
    }

    return gulp.src(paths.makeFullPath(config.test.ui), {read: false})
                .pipe(mocha({reporter: "spec"}))
                .on("error", notify.onError("TEST-UI: <%= error.message %>"))
                .once("error", function () {
                    process.exit(1);
                })
                .once("end", function () {
                    process.exit();
                });
}

module.exports = {
    deps: ["build"],
    task: testUI,
    desc: "Runs UI Automation tests",
    help: ["Executes UI Automation tests in ./test using Mocha and Appium"]
};
