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

import Emitter from "yasmf-emitter";

// private property symbols

let _dictionary = Symbol("_dictionary"),
    _lemma = Symbol("_lemma"),
    _entries = Symbol("_entries");

export default class Definitions extends Emitter {
    constructor({lemma, dictionary} = {}) {
        super();
        this[_lemma] = lemma;
        this[_dictionary] = dictionary;
        this[_entries] = undefined;
    }

    get lemma() {
        return this[_lemma];
    }

    get dictionary() {
        return this[_dictionary];
    }

    get entries() {
        if (this[_entries]) {
            return this[_entries];
        }
        this[_dictionary].getEntries({lemma: this[_lemma]})
                         .then(entries => {
                             this[_entries] = entries;
                             this.emit ("model:changed:entries");
                         });
        return [];
    }

    destroy() {
        this[_lemma] = null;
        this[_dictionary] = null;
        this[_entries] = null;
        super.destroy();
    }
}

export function createDefinitions(options = {}) {
    return new Definitions(options);
}
