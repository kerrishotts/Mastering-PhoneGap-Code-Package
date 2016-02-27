"use strict";

var gulp = require("gulp"),
    gutil = require("gulp-util"),
    notify = require("gulp-notify"),
    config = require("../../config"),
    settings = require("../../settings"),
    paths = require("../../utils/paths"),
    sequence = require("gulp-sequence");

module.exports = function(done) {
    gutil.env.profile = 'android-6-0-0';
    gutil.env.server = 'local';
    gutil.env.udid = '';
    settings.NO_COPY = true;
    settings.NO_BUILD = true;
    settings.TARGET_DEVICE = "--device";
    settings.BUILD_PLATFORMS = ["android"];
    settings.PLATFORM = "android"
    
    return sequence("test-ui", done);
}