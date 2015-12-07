"use strict";

var gulp = require("gulp"),
    config = require ("../config"),
    settings = require("../settings"),
    paths = require("../utils/paths"),
    licenseFinder = require("gulp-license-finder");


function findLicenses() {
    var p = paths.makeFullPath("audit", paths.BASE);
    return licenseFinder().pipe(gulp.dest(p));
}

module.exports = {
    task: findLicenses,
    desc: "Find licenses in the project",
    help: ["Find licenses used in packages used by the project and place into ",
            "the audit/ directory."]
};
