/*
 * Logology testing suite
 * 
 * This suite tests the basic features of Logology. Don't assume that this test suite
 * is in any way complete; as bugs are discovered, new tests will be added.
 * 
 * Author: Kerri Shotts <kerrishotts@gmail.com> 
 *         http://www.photokandy.com/books/mastering-phonegap
 *
 * Copyright (c) 2016 Packt Publishing, except where otherwise indicated. Dependencies
 * are copyright their respective owners. For license information, see /LICENSE and the
 * licenses of dependencies.
 * 
 * MIT LICENSED
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
 */

"use strict";
var Storage = require("dom-storage");
var localStorage = new Storage(null, { strict: true });
localStorage.clear();

let should = require("./helpers/setup").should;
import Settings from "../src/www/js/app/models/Settings";

describe("Settings Tests (no initial settings)", () => {

    it("should be able to create a new Settings object", () => {
        let settings = new Settings({localStorage});
        return settings.should.exist;
    });
    it("should be able to access default settings", () => {
        let settings = new Settings();
        return settings.should.have.property("theme", "Default");
    });
    it("should be able to access default settings even after retrieval", () => {
        let settings = new Settings();
        settings.retrieveSettings();
        return settings.should.have.property("theme", "Default");
    });
});
