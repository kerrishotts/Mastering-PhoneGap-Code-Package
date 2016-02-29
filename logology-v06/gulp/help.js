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

var gutil = require("gulp-util"),
    sprintf = require("sprintf-js").sprintf;
/**
 * Display some nicely formatted help in response to gulp help.
 * Also allow filtering with --filter
 */
module.exports = function showHelp(tasks) {
    var helpOnTask = gutil.env.filter ? gutil.env.filter : "";
    var task;
    var help;
    for (var taskTitle in tasks) {
        if (tasks.hasOwnProperty(taskTitle)) {
            task = tasks[taskTitle];
            if (helpOnTask !== "" && taskTitle.indexOf(helpOnTask) < 0) {
                continue;
            }
            if (typeof task !== "function" && task.desc) {
                console.log (sprintf("%-40s%40s", taskTitle, task.desc));
                if (task.help) {
                    help = task.help;
                    if (!(help instanceof Array)) {
                        help = [help];
                    }
                    help.forEach(function (text) {
                        console.log("    " + text);
                    });
                }
                if (task.examples) {
                    console.log();
                    task.examples.forEach(function (example) {
                        var lines;
                        if (example instanceof Array) {
                            lines = example;
                        } else {
                            lines = JSON.stringify(example, null, 4).split("\n");
                        }
                        lines.forEach(function (text) {
                            console.log("        " + text);
                        });
                    });
                }
                if (task.deps) {
                    console.log();
                    console.log("    Dependencies: ", task.deps.join(", "));
                }
                console.log();
            }
        }
    }
}
