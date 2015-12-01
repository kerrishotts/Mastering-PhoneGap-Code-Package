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
        let response = await fetch("dicts/" + this.options.path);
        let [definitions, index] = await response.json();
        this[_sortedIndex] = Object.keys(index).sort((a,b) => (a === b ? 0 : ( a < b ? -1 : 1)));
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

    getEntries( {lemma="", wordNetRef, _refs, per=10000} ) {
        if (!this.isLoaded) {
            return Promise.resolve(() => []);
        }

        let normalizedLemma = lemma.toLowerCase().trim();
        if (!_refs) {
            if (normalizedLemma !== "") {
                let refs = this[_order][normalizedLemma];
                if (refs) {
                    return this.getEntries({_refs:refs, per});
                }
            }
            if (wordNetRef) {
                return this.getEntries({_refs:[wordNetRef], per});
            }
            return Promise.resolve(() => []);
        } else {
            let arr = [], idx = 0, len = this[_defs].length, id;

            return new Promise((resolve, reject) => {
                id = setInterval(() => {
                    if (idx<len) {
                        let nextLen = idx + per;
                        if (nextLen > len) {
                            nextLen = len;
                        }
                        for (let i=idx;i<nextLen;i++) {
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
