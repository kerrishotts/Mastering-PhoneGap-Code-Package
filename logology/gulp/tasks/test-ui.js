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
    deps: ["build", "launch-appium"],
    task: testUI,
    desc: "Runs UI Automation tests",
    help: ["Executes UI Automation tests in ./test-ui using Mocha and Appium",
           "",
           "    --ignore [build][,copy]",
           "        build:",
           "            bypasses the build phase; useful when the code being tested hasn't",
           "            changed.",
           "        copy:",
           "            bypasses the copy phase; useful when the code being tested hasn't",
           "            changed.",
           "",
           "    --target device|emulator",
           "        change the build target. 'device' is assumed by default.",
           "",
           "    --profile <device_profile>",
           "        target the specified device profile; required",
           "",
           "    --server local|remote",
           "        Use the local or remote server; local is the default",
           "",
           "    --udid <device udid>",
           "        Target iOS device UDID; required for testing on physical devices",
           "",
           "    --verbose",
           "        Display verbose logging information during tests.",
           "",
           "See the build task for more configuration settings regarding builds."
          ]
};
