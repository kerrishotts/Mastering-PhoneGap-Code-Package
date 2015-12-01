"use strict";

var settings = require("../settings"),
    cordovaTasks = require("../utils/cordova-tasks");
/**
 * Builds the cordova portion of the project
 */
function prepareCordova() {
    return cordovaTasks.prepare();
}

module.exports = prepareCordova;
