"use strict";

import KVStore from "../lib/KVStore";
import {createIndexedDBKVStore} from "../lib/IndexedDBKVStore";

// region private properties

// endregion

export default class Notes extends KVStore {
    constructor({adapter} = {}) {
        if (!adapter) {
            adapter = createIndexedDBKVStore({namespace: "notes"});
        }
        super({adapter});
    }

    doesWordHaveANote(word) {
        return this.exists(word);
    }

    saveNoteForWord(word, note) {
        return this.set(word, note);
    }

    removeNoteFromWord(word) {
        return this.remove(word);
    }

    getNoteForWord(word) {
        return this.get(word);
    }
}

export function createNotes(options = {}) {
    return new Notes(options);
}

let notes;
export function getNotes() {
    if (!notes) {
        notes = createNotes();
    }
    return notes;
}
