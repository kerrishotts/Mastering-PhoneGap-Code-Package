"use strict";

var settings = require("../settings"),
    cordovaTasks = require("../utils/cordova-tasks");

function emulateCordova() {
    return cordovaTasks.emulate({
        buildMode: settings.BUILD_MODE, 
        platform: settings.PLATFORM, 
        options: [settings.TARGET_DEVICE]});
}

module.exports = emulateCordova;
