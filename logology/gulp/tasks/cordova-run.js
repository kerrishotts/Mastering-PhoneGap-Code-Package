"use strict";

var settings = require("../settings"),
    cordovaTasks = require("../utils/cordova-tasks");

function runCordova() {
    return cordovaTasks.run({
        buildMode: settings.BUILD_MODE,
        platform: settings.PLATFORM,
        options: [settings.TARGET_DEVICE]});
}

module.exports = runCordova;
