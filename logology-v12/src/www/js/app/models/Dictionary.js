"use strict";
// jscs:disable
import Emitter from "yasmf-emitter";
import Definition from "./Definition";
// jscs:enable

// private property symbols
let _definitions = Symbol(),
    _index = Symbol(),
    _sortedIndex = Symbol();

export default class Dictionary extends Emitter {
    constructor() {
        super();
        this[_definitions] = new Map(); // wordNetRef : definition
        this[_index] = new Map(); // lemma : set of WordNetRef
        this[_sortedIndex] = [];
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


    async getEntries( {lemma="", wordNetRef} ) {
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
