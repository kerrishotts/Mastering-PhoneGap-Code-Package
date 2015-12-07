"use strict";

var cordovaTasks = require("../utils/cordova-tasks"),
    gulp = require("gulp"),
    babel = require("babel"),
    concat = require("gulp-concat"),
    buffer = require("vinyl-buffer"),
    uglify = require("gulp-uglify"),
    source = require("vinyl-source-stream"),
    path = require("path"),
    notify = require("gulp-notify"),
    sourcemaps = require("gulp-sourcemaps"),
    gutil = require("gulp-util"),
    config = require("../config"),
    settings = require("../settings"),
    paths = require("../utils/paths"),
    browserSync = require("browser-sync").get("www");

function copyCode() {
    var isRelease = (settings.BUILD_MODE === "release");
    var pm = config.aliases;
    return gulp.src([paths.makeFullPath(config.assets.code.src, paths.SRC)]
               .pipe(cordovaTasks.performSubstitutions())
               .pipe(BUILD_MODE === "debug" ? sourcemaps.init() : gutil.noop())
               .pipe(babel())
               .pipe(concat("app.js"))
               .pipe(BUILD_MODE === "debug" ? sourcemaps.write() : gutil.noop())
               .pipe(BUILD_MODE === "release" ? uglify() : gutil.noop())
               .pipe(gulp.dest(paths.makeFullPath(config.assets.code.dest, paths.DEST)))
               .pipe(browserSync.stream());
}

module.exports = {
    task: copyCode,
    desc: "Transforms JS and ES2015 code",
    help: ["Transforms the JS and ES2015 code in the source directory and writes the",
            "result to the build directory. ES2015 is transpiled using",
            "Babel. The output is controlled by various flags:",
            "    --mode=release | debug",
            "        debug: generates debugging information and source maps. DEFAULT",
            "        release: removes debugging information, source maps, and also",
            "                 uglifies the code automatically."]
};
