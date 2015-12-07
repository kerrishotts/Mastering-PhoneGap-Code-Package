"use strict";

var gutil = require("gulp-util");

var settings = {
    PLATFORM: gutil.env.platform ? gutil.env.platform : "ios", // or android
    BUILD_PLATFORMS: (gutil.env.for ? gutil.env.for : "ios,android").split(","),
    BUILD_MODE: gutil.env.mode ? gutil.env.mode : "debug", // or release
    NO_BUILD: gutil.env.ignore ? gutil.env.ignore.indexOf("build") > -1 : false,
    TARGET_DEVICE: gutil.env.target ? "--target=" + gutil.env.target : "",
    LR_PORT: parseInt(gutil.env.lrport ? gutil.env.lrport : "35729", 10),
    SERVE_PORT: parseInt(gutil.env.port ? gutil.env.port : "8080", 10),
    FAIL_ON_ERROR: gutil.env.continue ? (gutil.env.continue !== "yes") : true,
    VERBOSE: gutil.env.verbose ? (gutil.env.verbose==="yes") : false
}

module.exports = settings;
