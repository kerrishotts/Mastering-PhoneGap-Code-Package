"use strict";

var cordovaTasks = require("../utils/cordova-tasks"),
    paths = require("../utils/paths"),
    config = require("../config"),
    rimraf = require("rimraf");

function clean(cb) {
    var BUILD_PATH = paths.makeFullPath(".", paths.DEST);
    rimraf(BUILD_PATH, cb);
}

module.exports = {
    task: clean,
    desc: "Removes the build directory"
}
