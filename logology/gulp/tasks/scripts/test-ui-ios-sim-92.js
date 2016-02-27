"use strict";

var gulp = require("gulp"),
    gutil = require("gulp-util"),
    notify = require("gulp-notify"),
    config = require("../../config"),
    settings = require("../../settings"),
    paths = require("../../utils/paths"),
    sequence = require("gulp-sequence");

module.exports = function(done) {
    gutil.env.profile = 'ios-simulator-9-2';
    gutil.env.server = 'local';
    gutil.env.udid = '';
    settings.NO_COPY = true;
    settings.NO_BUILD = true;
    settings.TARGET_DEVICE = "--target=emulator";
    settings.BUILD_PLATFORMS = ["ios"];
    settings.PLATFORM = "ios"
    
    return sequence("test-ui", done);
}