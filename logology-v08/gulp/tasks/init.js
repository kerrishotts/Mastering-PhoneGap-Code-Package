"use strict";

var cordovaTasks = require("../utils/cordova-tasks");

/**
 * Initialie the project by creating the cordova app,
 * adding the plugins and platforms.
 */
function init() {
    return cordovaTasks.init();
}

module.exports = {
    deps: ["clean"],
    task: init,
    desc: "Initializes the Cordova project",
    help: ["When executed, the build directory is removed and rebuilt. Execute this",
            "whenever you add or remove plugins and platforms."]
}
