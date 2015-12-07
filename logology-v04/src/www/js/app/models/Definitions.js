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
