"use strict";

var settings = require("../settings"),
    cordovaTasks = require("../utils/cordova-tasks");
/**
 * Builds the cordova portion of the project
 */
function buildCordova() {
    if (settings.NO_BUILD) {
        return;
    }
    var target = settings.TARGET_DEVICE;
    if (!target || target === "" || target === "--target=device") {
        target = "--device";
    }
    return cordovaTasks.build({
        buildMode: settings.BUILD_MODE, 
        platforms: settings.BUILD_PLATFORMS, 
        options: [target]});
}

module.exports = buildCordova;
