/*****************************************************************************
 *
 * Author: Kerri Shotts <kerrishotts@gmail.com> 
 *         http://www.photokandy.com/books/mastering-phonegap
 *
 * MIT LICENSED
 * 
 * Copyright (c) 2016 Packt Publishing
 * Portions Copyright (c) 2016 Kerri Shotts (photoKandy Studios LLC)
 * Portions Copyright various third parties where noted.
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this
 * software and associated documentation files (the "Software"), to deal in the Software
 * without restriction, including without limitation the rights to use, copy, modify,
 * merge, publish, distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to the following
 * conditions:
 * The above copyright notice and this permission notice shall be included in all copies
 * or substantial portions of the Software.
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
 * PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT
 * OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 * 
 *****************************************************************************/

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
    browserSync = require("browser-sync").get("www");

function copyCode() {
    if (settings.NO_COPY) {
        return;
    }
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
