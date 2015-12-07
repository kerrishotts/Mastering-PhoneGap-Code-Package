"use strict";
// jscs:disable
import Emitter from "yasmf-emitter";
import Definition from "./Definition";
// jscs:enable

// private property symbols
let _definitions = Symbol("_definitions"),
    _loaded = Symbol("_loaded"),
    _options = Symbol("_options");

export let _sortedIndex = Symbol("_sortedIndex");
export let _index = Symbol("_index");

export default class Dictionary extends Emitter {
    constructor(options = {}) {
        super();
        this[_definitions] = new Map(); // wordNetRef : definition
        this[_index] = new Map(); // lemma : set of WordNetRef
        this[_sortedIndex] = [];
        this[_loaded] = false;
        this[_options] = options;
    }

    get isLoaded() {
        return this[_loaded];
    }

    get options() {
        return this[_options];
    }

    loaded() {
        this[_loaded] = true;
        this.emit("loaded");
    }

    load() {
        throw new Error("must override load()!");
    }

    _addDefinition( definition ) {
        let {lemmas, wordNetRef} = definition;
        this[_definitions].set(wordNetRef, definition);
        for (let lemma of lemmas) {
            let entry = this[_index].get(lemma);
            if (!entry) {
                this[_index].set(lemma, entry = new Set());
            }
            entry.add(wordNetRef);
        }
        return this;
    }

    get sortedIndex() {
        if (!this.isLoaded) {
            return [];
        }
        if (this[_sortedIndex].length === this[_index].size) {
            // the currently sorted index is the same size as our map
            // return it
            return this[_sortedIndex];
        }

        // sort the index and cache it for future reference
        this[_sortedIndex] = Array.from(this[_index])
                                  .map(([k]) => k)
                                  .sort((a, b) => (a === b ? 0 : (a < b ? -1 : 1)));
        return this[_sortedIndex];
    }

    filteredIndex(filter) {
        if (!this.isLoaded) {
            return [];
        }
        return this[_sortedIndex].filter(v => v.indexOf(filter) === 0);
    }

    asyncFilteredIndex(filter, per=10000) {
        if (!this.isLoaded) {
            return Promise.resolve(() => []);
        }
        let arr = [], idx = 0, len = this[_sortedIndex].length, id;
        return new Promise((resolve, reject) => {
            id = setInterval(() => {
                if (idx<len) {
                    let nextLen = idx + per;
                    if (nextLen > len) {
                        nextLen = len;
                    }
                    for (let i = idx;i < nextLen;i++) {
                        if (this[_sortedIndex][i].indexOf(filter) === 0) {
                            arr.push(this[_sortedIndex][i]);
                        }
                        idx++;
                    }
                } else {
                    clearInterval(id);
                    resolve(arr);
                }
            }, 0);
        });
    }

    async getEntries( {lemma="", wordNetRef} ) {
        if (!this.isLoaded) {
            return [];
        }
        if (wordNetRef !== undefined) {
            // if we have a wordNetRef, we can get the word directly, so do that first.
            let entry = this[_definitions].get(wordNetRef);
            return entry ? [entry] : [];
        }
        // otherwise, we need to do a search through the entries for lemma
        // if partOfSpeech is specified, we also filter by that.
        let entry = this[_index].get(lemma.toLowerCase().trim());
        if (!entry) {
            return [];
        }
        return Array.from(entry)
                    .map(wordNetRef=>this[_definitions].get(wordNetRef))
                    .sort((a, b) => (a.wordNetRef === b.wordNetRef ? 0 : (a.wordNetRef < b.wordNetRef ? -1 : 1)));
    }
}
Dictionary.meta = {
    name: "Abstract Dictionary",
    language: "en"
};

export function createDictionary(options = {}) {
    return new Dictionary(options);
}

