"use strict";

var
    config = require("../config"),
    paths = require("../utils/paths"),
    run = require("browserify-test").default,
    glob = require("glob"),
    gutil = require("gulp-util");

function testPhantom() {
    let files = [];
    files.push(...glob.sync(paths.makeFullPath(config.test.code)));

    run({
        watch: gutil.env.watch === "yes",
        transform: [['babelify', { stage: 0 }]],
        files
    });
}

module.exports = {
    task: testPhantom,
    desc: "Runs code-level tests using PhantomJS",
    help: ["Executes code-level tests in ./test using Mocha and PhantomJS",
           "Run with --watch yes to watch and run in other browsers."]
};
