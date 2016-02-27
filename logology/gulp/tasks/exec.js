"use strict";

var gulp = require("gulp"),
    gutil = require("gulp-util"),
    notify = require("gulp-notify"),
    config = require("../config"),
    settings = require("../settings"),
    paths = require("../utils/paths");

function exec(done) {
    var fn = require("./scripts/" + gutil.env.script);
    return fn(done);
}

module.exports = {
    task: exec,
    desc: "Executes a script",
    help: ["Executes a script as defined under ./gulp/tasks/scripts. Intended for use with",
           "gulp-sequence to build sequences of steps that are commonly used.",
           "", 
           "    --script = script-to-run", 
           ""
          ]
};
