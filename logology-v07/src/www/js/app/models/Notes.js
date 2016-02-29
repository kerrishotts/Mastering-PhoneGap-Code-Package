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
