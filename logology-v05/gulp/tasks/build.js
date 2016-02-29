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

var buildCordova = require("./cordova-build");

module.exports = {
    deps: ["copy", "lint"],
    task: buildCordova,
    desc: "Builds the project",
    help: ["Generates a build of the project. The following flags can be used to change",
            "the build behavior.",
            "",
            "    --mode=debug | release",
            "        Specifies the build mode. Also impacts code transformation; see",
            "        copy-code. Debug is the default mode.",
            "",
            "    --for=<platforms>",
            "        Indicates the platform or platforms for which to generate a build.",
            "        If multiple platforms need to be specified, they can be separated",
            "        by a comma.",
            "",
            "    --target=<device> | device | emulator",
            "        Generates a build suitable for the specified device. The type of",
            "        device (device or emulator) can be specified generically, or a ",
            "        specific device name can be used. This name must match what one",
            "        would pass to the --target flag when using the Cordova CLI"]
};
