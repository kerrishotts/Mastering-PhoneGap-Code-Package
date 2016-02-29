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

var gulp = require("gulp"),
    sass = require("gulp-sass"),
    autoprefixer = require("gulp-autoprefixer"),
    notify = require("gulp-notify"),
    sourcemaps = require("gulp-sourcemaps"),
    gutil = require("gulp-util"),
    config = require("../config"),
    settings = require("../settings"),
    paths = require("../utils/paths"),
    browserSync = require("browser-sync").get("www");

function copySCSS() {
    if (settings.NO_COPY) {
        return;
    }
    var isRelease = (settings.BUILD_MODE === "release");
    var includePaths = [];
    var includeModules = config.sass && config.sass.includeModules;
    if (includeModules instanceof Array) {
        includePaths = includePaths.concat(includeModules.map(function (moduleName) {
            var module = require(moduleName);
            return module.includePath;
        }));
    }
    var moreIncludePaths = config.sass && config.sass.includePaths;
    if (moreIncludePaths instanceof Array) {
        includePaths = includePaths.concat(moreIncludePaths);
    }
    return gulp.src(paths.makeFullPath(config.assets.styles.src, paths.SRC))
               .pipe(isRelease ? gutil.noop() : sourcemaps.init())
               .pipe(sass({
                   includePaths: includePaths,
                   outputStyle: (isRelease ? "compressed" : "nested")
               }))
               .on("error", function (error) {
                   this.emit("end");
               })
               .on("error", notify.onError(function (error) {
                   return "SASS: " + error.message;
               }))
               .pipe(autoprefixer({browsers: ["last 2 versions"]}))
               .pipe(isRelease ? gutil.noop() : sourcemaps.write())
               .pipe(gulp.dest(paths.makeFullPath(config.assets.styles.dest, paths.DEST)))
               .pipe(browserSync.stream());
}

module.exports = {
    task: copySCSS,
    desc: "Transforms SCSS to CSS",
    help: ["Transforms the SCSS files in the source directory and writes the result to",
            "the build directory using NODE-SASS.",
            "NOTE: 'package.json' can be used to specify SCSS modules and paths to",
            "include."],
    examples: [{
        "sass": {
            "includeModules": ["node-reset-scss"],
            "includePaths": ["./node_modules/node-reset-scss/scss"]
        }
    }]
};
