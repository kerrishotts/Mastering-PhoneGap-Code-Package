"use strict";

var runCordova = require("./cordova-run");

module.exports = {
    deps: ["copy", "lint"],
    task: runCordova,
    desc: "Runs the project on a device",
    help: ["Builds the project targeting a physical device. The device must be connected",
            "to the development machine. Once connceted, the app should automatically",
            "launch on the device.",
            "",
            "    --mode=debug | release",
            "        Specifies the build mode. Also impacts code transformation; see",
            "        copy-code. Debug is the default mode.",
            "",
            "    --platform=<platform>",
            "        Specifies which platform to emulate, e.g., 'ios', 'android'"]
};
