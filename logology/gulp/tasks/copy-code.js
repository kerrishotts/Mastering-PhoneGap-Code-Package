"use strict";

var cordovaTasks = require("../utils/cordova-tasks"),
    gulp = require("gulp"),
    babelify = require("babelify"),
    browserify = require("browserify"),
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
    licensify = require("licensify"),
    browserSync = require("browser-sync").get("www");

function copyCode() {
    var isRelease = (settings.BUILD_MODE === "release");
    var pm = config.aliases;
    return browserify(paths.makeFullPath(config.assets.code.src, paths.SRC), {
            debug: !isRelease,
            standalone: "app"
        })
        .transform(babelify.configure({
            //blacklist: ["flow"],        // if we want to use type annotations, we can
            stage: 0,                   // allow experimental features
            // resolve require directories so that we don't have to always specify full paths
            resolveModuleSource: function (id, parent) {
                // this method inspired by https://github.com/babel/babelify/issues/48#issuecomment-104309530
                var matches = id.split(path.sep);
                var firstMatch = matches[0];
                var firstLetter;
                if (pm && pm[firstMatch]) {
                    matches[0] = path.relative(path.dirname(parent), path.resolve(config.paths.base, pm[firstMatch]));
                    id = matches.join(path.sep);
                    firstLetter = id.substr(0, 1);
                    if (firstLetter !== path.sep && firstLetter !== ".") {
                        // require must indicate that it is relative, so ensure we have a ./
                        // if the resulting path is a child of the cwd
                        id = [".", id].join(path.sep);
                    }
                }
                return id;
            }
        }))
        //.plugin(licensify)
        .bundle()
        .on("error", function (error) {
            this.emit("end");
        })
        .on("error", notify.onError(function (error) {
            return "BABEL: " + error.message;
        }))
        .pipe(source("app.js"))
        .pipe(buffer())
        .pipe(cordovaTasks.performSubstitutions())
        .pipe(isRelease ? gutil.noop() : sourcemaps.init({
            loadMaps: true
        })) // loads map from browserify file
        .pipe(isRelease ? uglify({preserveComments: "some"}) : gutil.noop())
        .pipe(isRelease ? gutil.noop() : sourcemaps.write())
        .pipe(gulp.dest(paths.makeFullPath(config.assets.code.dest, paths.DEST)))
        .pipe(browserSync.stream());
}

module.exports = {
    task: copyCode,
    desc: "Transforms JS and ES2015 code",
    help: ["Transforms the JS and ES2015 code in the source directory and writes the",
            "result to the build directory. ES2015 is transpiled using Browserify and",
            "Babel. The output is controlled by various flags:",
            "    --mode=release | debug",
            "        debug: generates debugging information and source maps. DEFAULT",
            "        release: removes debugging information, source maps, and also",
            "                 uglifies the code automatically."]
};
