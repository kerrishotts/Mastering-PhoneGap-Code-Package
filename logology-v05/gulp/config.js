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

var config = {
    paths: {
        base: process.cwd(),
        dest: "build",
        src: "src",
        config: "config"
    },
    assets: {
        copy: [
                {src: "www/*.*",            dest: "www"},
                {src: "www/html/**/*",      dest: "www/html"},
                {src: "www/img/**/*",       dest: "www/img"},
                //{src: "www/js/lib/**/*",    dest: "www/js/lib"},
                {src: "res/**/*",           dest: "res"},
                {src: "../node_modules/open-iconic/sprite/sprite.svg",
                dest: "www/img/open-iconic"}
              ],
        code: {src: "www/js/app/index.js", dest: "www/js/app"},
        styles: {src: "www/scss/app.scss",  dest: "www/css"}
    },
    lint: "src/www/js/app/**/*.js",
    "code-style": "src/www/js/app/**/*.js",
    serve: "build/www",
    watch: ["src/www/**/*"],
    reload: ["src/www/**/*.js"],
    aliases: {
        "$APP": "src/www/js/app",
        "$LIB": "src/www/js/lib",
        "$WIDGETS": "src/www/js/lib/templates/widgets",
        "$MODELS": "src/www/js/app/models",
        "$VIEWS": "src/www/js/app/views",
        "$CONTROLLERS": "src/www/js/app/controllers"
    },
    sass: {
        includeModules: ["node-reset-scss"],
        includePaths: ["./node_modules/node-reset-scss/scss"]
    }
}

module.exports = config;
