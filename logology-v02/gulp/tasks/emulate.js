"use strict";

var emulateCordova = require("./cordova-emulate");

module.exports = {
    deps: ["copy", "lint"],
    task: emulateCordova,
    desc: "Runs the project in an emulator",
    help: ["Builds the project targeting an emulator. The emulator is then started, if",
            "possible, and the app is started within the emulator. If the emulator can't",
            "be started automatically, you should start the emulator manually prior to",
            "executing this command.",
            "",
            "    --platform=<platform>",
            "        Specifies which platform to emulate, e.g., 'ios', 'android'"]
};
