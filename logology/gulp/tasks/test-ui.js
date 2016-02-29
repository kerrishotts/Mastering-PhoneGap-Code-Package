/*****************************************************************************
 *
 * Author: Kerri Shotts <kerrishotts@gmail.com> 
 *         http://www.photokandy.com/books/mastering-phonegap
 *
 * MIT LICENSED
 * 
 * Copyright (c) 2016 Packt Publishing
 * Portions Copyright (c) 2016 Kerri Shotts (photoKandy Studios LLC)
 * Portions Copyright various third parties where noted.
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this
 * software and associated documentation files (the "Software"), to deal in the Software
 * without restriction, including without limitation the rights to use, copy, modify,
 * merge, publish, distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to the following
 * conditions:
 * The above copyright notice and this permission notice shall be included in all copies
 * or substantial portions of the Software.
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
 * PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT
 * OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 * 
 *****************************************************************************/

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
