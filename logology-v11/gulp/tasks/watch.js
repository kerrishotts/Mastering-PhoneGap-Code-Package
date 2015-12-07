"use strict";

var gulp = require("gulp"),
    config = require("../config");

function watch() {
    gulp.watch(config.watch, ["copy"]);
    gulp.watch(config.reload, ["copy-reload"]);
}

module.exports = {
    deps: ["serve"],
    task: watch,
    desc: "Watches the source WWW",
    help: ["Creates a Browser Sync server that watches the source www directory. This is",
            "extremely useful when testing, both on the local development machine using",
            "Chrome or Safari, but also the device itself using either the web browser",
            "on the device or using the PhoneGap Developer app",
            "",
            "    --mode=debug | release",
            "        Affects the generated output. See copy-code for more."]
};
