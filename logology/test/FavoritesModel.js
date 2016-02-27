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
import Favorites from "../src/www/js/app/models/Favorites";

describe("Favorites", () => {

    describe("#Create", () => {
        it("should be able to create a new Favorites object", () => {
            let favorites = new Favorites();
            return favorites.should.exist;
        });
    });

    describe("#Manage", () => {
        let favorites = {};
        it ("should report a new word as not a favorite", () => {
            favorites = new Favorites();
            favorites.isWordAFavorite("mumble").should.become(false);
        });
        it ("should save a word as a favorite", () => {
            favorites.saveWordAsFavorite("cat").should.be.fulfilled;
        });
        it ("... and the word should now be a favorite", () => {
            favorites.isWordAFavorite("cat").should.become(true);
        });
        it ("should be able to remove the word as a favorite", () => {
            favorites.removeFavoriteWord("cat").should.be.fulfilled;
        });
        it ("... and now it shouldn't be a favorite", () => {
            favorites.isWordAFavorite("cat").should.become(false);
        });
        it ("should be able to toggle a word not previously a favorite", () => {
            favorites.toggleFavorite("dog").should.be.fulfilled;
        });
        it ("... and the word should now be a favorite", () => {
            favorites.isWordAFavorite("dog").should.become(true);
        });
        it ("should be able to toggle a word previously a favorite", () => {
            favorites.toggleFavorite("dog").should.be.fulfilled;
        });
        it ("... and the word should now not be a favorite", () => {
            favorites.isWordAFavorite("dog").should.become(false);
        });
    })

});
