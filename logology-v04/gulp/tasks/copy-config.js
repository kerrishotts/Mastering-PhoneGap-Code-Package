"use strict";

var cordovaTasks = require("../utils/cordova-tasks");

function copyConfig() {
    return cordovaTasks.copyConfig();
}

module.exports = {
    task: copyConfig,
    desc: "Transforms 'config.xml'",
    help: ["Copies and populates the 'config.xml' template in the source directory and",
            "writes the result to the build directory. Most of the parameters are stored",
            "in 'package.json'."]
}
