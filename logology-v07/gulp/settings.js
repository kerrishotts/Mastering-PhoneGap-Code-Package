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

var gutil = require("gulp-util");

var settings = {
    PLATFORM: gutil.env.platform ? gutil.env.platform : "ios", // or android
    BUILD_PLATFORMS: (gutil.env.for ? gutil.env.for : "ios,android").split(","),
    BUILD_MODE: gutil.env.mode ? gutil.env.mode : "debug", // or release
    NO_COPY: gutil.env.ignore ? gutil.env.ignore.indexOf("copy") > -1 : false,
    NO_BUILD: gutil.env.ignore ? gutil.env.ignore.indexOf("build") > -1 : false,
    TARGET_DEVICE: gutil.env.target ? "--target=" + gutil.env.target : "",
    LR_PORT: parseInt(gutil.env.lrport ? gutil.env.lrport : "35729", 10),
    SERVE_PORT: parseInt(gutil.env.port ? gutil.env.port : "8080", 10),
    FAIL_ON_ERROR: gutil.env.continue ? (gutil.env.continue !== "yes") : true,
    VERBOSE: gutil.env.verbose ? (gutil.env.verbose === "yes") : false
}

module.exports = settings;
