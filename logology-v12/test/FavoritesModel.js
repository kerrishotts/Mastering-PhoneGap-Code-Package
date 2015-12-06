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
        let favorites = new Favorites();
        it ("should report a new word as not a favorite", () => {
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
