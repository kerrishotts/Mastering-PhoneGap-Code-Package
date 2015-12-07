"use strict";

var buildCordova = require("./cordova-build");

module.exports = {
    deps: ["copy", "lint"],
    task: buildCordova,
    desc: "Builds the project",
    help: ["Generates a build of the project. The following flags can be used to change",
            "the build behavior.",
            "",
            "    --mode=debug | release",
            "        Specifies the build mode. Also impacts code transformation; see",
            "        copy-code. Debug is the default mode.",
            "",
            "    --for=<platforms>",
            "        Indicates the platform or platforms for which to generate a build.",
            "        If multiple platforms need to be specified, they can be separated",
            "        by a comma.",
            "",
            "    --target=<device> | device | emulator",
            "        Generates a build suitable for the specified device. The type of",
            "        device (device or emulator) can be specified generically, or a ",
            "        specific device name can be used. This name must match what one",
            "        would pass to the --target flag when using the Cordova CLI"]
};
