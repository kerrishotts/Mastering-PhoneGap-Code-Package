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
