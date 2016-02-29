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

let should = require("./helpers/setup").should;
import Note from "../src/www/js/app/models/Note";
import {getNotes} from "../src/www/js/app/models/Notes";

describe("Note", () => {

    describe("#Create", () => {
        it("should be able to create a new Note object for a cat", () => {
            let note = new Note({lemma:"cat"});
            return note.should.exist;
        });
    });

    describe("#Manage", () => {
        let note = {},
            notes = {};
        it ("should be able to save a note", () => {
            note = new Note({lemma:"cat"});
            notes = getNotes();
            note.note = "Cats are cute";
            return notes.getNoteForWord("cat").should.become(note.note);
        });
        it ("should be able to change a note", () => {
            note.note = "Cats are better than dogs";
            return notes.getNoteForWord("cat").should.become(note.note);
        });
        it ("should be able to delete a note", () => {
            note.removeNote();
            return notes.doesWordHaveANote("cat").should.become(false);
        });
    });

});
