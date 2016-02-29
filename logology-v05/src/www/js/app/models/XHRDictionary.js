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
import Dictionary from "./Dictionary";
import Definition from "./Definition";

import {_sortedIndex, _index} from "./Dictionary";

let _defs = Symbol("_defs"),
    _order = Symbol("_order")

export default class XHRDictionary extends Dictionary {
    constructor (options = {}) {
        super(options);
        this[_defs] = null;
        this[_order] = null;
    }
    async load() {
        // request definitions from a JSON file
        let response = await fetch(this.options.path);
        let [definitions, index] = await response.json();
        this[_sortedIndex] = Object.keys(index).sort((a,b) => (a === b ? 0 : (a < b ? -1 : 1)));
        this[_defs] = definitions;
        this[_order] = index;
        this.loaded();
    }
    get sortedIndex() {
        if (!this.isLoaded) {
            return [];
        }
        return this[_sortedIndex];
    }

    getEntries({lemma="", wordNetRef, _refs, per=10000}) {
        if (!this.isLoaded) {
            return Promise.resolve(() => []);
        }

        let normalizedLemma = lemma.toLowerCase().trim();
        if (!_refs) {
            if (normalizedLemma !== "") {
                let refs = this[_order][normalizedLemma];
                if (refs) {
                    return this.getEntries({_refs: refs, per});
                }
            }
            if (wordNetRef) {
                return this.getEntries({_refs: [wordNetRef], per});
            }
            return Promise.resolve(() => []);
        } else {
            let arr = [], idx = 0, len = this[_defs].length, id;

            return new Promise((resolve, reject) => {
                id = setInterval(() => {
                    if (idx < len) {
                        let nextLen = idx + per;
                        if (nextLen > len) {
                            nextLen = len;
                        }
                        for (let i = idx; i < nextLen; i++) {
                            let definition = this[_defs][i];
                            let arrPos = -1;
                            if ((arrPos = _refs.indexOf(definition.wordNetRef)) > -1) {
                                arr[arrPos] = definition;
                            }
                            idx++;
                        }
                    } else {
                        clearInterval(id);
                        resolve(arr.map(d => new Definition(d)));
                    }
                }, 0);
            });
        }
    }
}

XHRDictionary.meta = {
    name: "XHR Dictionary",
    language: "en"
};

export function createXHRDictionary(options = {}) {
    return new XHRDictionary(options = {});
}
