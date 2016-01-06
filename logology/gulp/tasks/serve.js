"use strict";

var config = require("../config"),
    settings = require("../settings"),
    paths = require("../utils/paths"),
    browserSync = require("browser-sync").get("www");

function serve() {
    browserSync.init({
        ui: {
            port: settings.LR_PORT
        },
        port: settings.SERVE_PORT,
        server: {
            baseDir: paths.makeFullPath(config.serve),
            index: "index.html"
        }
    });
}

module.exports = {
    deps: ["copy"],
    task: serve,
    desc: "Serves the source WWW",
    help: ["Creates a Browser Sync server that serves the source www directory. This is",
            "extremely useful when testing, both on the local development machine using",
            "Chrome or Safari, but also the device itself using either the web browser",
            "on the device or using the PhoneGap Developer app",
            "",
            "    --mode=debug | release",
            "        Affects the generated output. See copy-code for more."]
};
