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
