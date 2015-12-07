"use strict";
let should = require("./helpers/setup").should;
import Notes from "../src/www/js/app/models/Notes";

describe("Notes", () => {

    describe("#Create", () => {
        it("should be able to create a new Notes object", () => {
            let notes = new Notes();
            return notes.should.exist;
        });
    });

    describe("#Manage", () => {
        let notes = new Notes();
        it ("report that an un-noted word should not have a note", () => {
            notes.doesWordHaveANote("mumble").should.become(false);
        });
        it ("should be able to save a note", () => {
            notes.saveNoteForWord("cat", "Cats are cute!").should.be.fulfilled;
        });
        it ("... and now the word should have a note", () => {
            notes.doesWordHaveANote("cat").should.become(true);
        });
        it ("... and the note should be what we expect", () => {
            notes.getNoteForWord("cat").should.become("Cats are cute!");
        });
        it ("should be able to remove the note from the word", () => {
            notes.removeNoteFromWord("cat").should.be.fulfilled;
        });
        it ("... and now it shouldn't have a note", () => {
            notes.doesWordHaveANote("cat").should.become(false);
        });
    })

});
