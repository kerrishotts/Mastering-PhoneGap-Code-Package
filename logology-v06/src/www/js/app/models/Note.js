"use strict";

import {getNotes} from "./Notes";
import Emitter from "yasmf-emitter";
import GCS from "../../lib/grandCentralStation";

// region private properties
const _lemma = Symbol("_lemma"),
      _note  = Symbol("_note");
// endregion

export default class Note extends Emitter {
    constructor({lemma, adapter} = {}) {
        super({adapter});
        this[_lemma] = lemma;
        this[_note] = undefined;
        getNotes().getNoteForWord(lemma)
                  .then(note => this[_note] = note ? note : "")
                  .then(() => this.emit("model:changed:note"));
    }

    get lemma() {
        return this[_lemma];
    }

    get note() {
        return this[_note];
    }

    set note(t) {
        this[_note] = t;
        getNotes().saveNoteForWord(this.lemma, t)
                  .then(() => GCS.emit("APP:DID:noteDefinition", this.lemma, true));
    }

    removeNote() {
        this[_note] = "";
        getNotes().removeNoteFromWord(this.lemma)
                  .then(() => GCS.emit("APP:DID:noteDefinition", this.lemma, false));
    }

}

export function createNote(options = {}) {
    return new Note(options);
}
