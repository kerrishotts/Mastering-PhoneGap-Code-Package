"use strict";

const bg = require("gulp-bg-ex"),
      ar = require("appium-running"),
      gutil = require("gulp-util"),
      settings = require("../settings");

module.exports = function launchAppium(done) {
    ar(4723, (success) => {
        if (!success) {
            const bgTask = bg("appium", "--log-level", settings.VERBOSE ? "debug" : "error");
            bgTask();
        
            const waitForStartID = setInterval(() => {
                gutil.log("... Waiting for Appium...");
                ar(4723, (success) => {
                    if (success) {
                        gutil.log("Appium started; continuing...");
                        clearInterval(waitForStartID);
                        done();
                    }
                });
            }, 500);    
        } else {
            gutil.log("Appium already running... continuing...")
            done();
        }
    });
} 

