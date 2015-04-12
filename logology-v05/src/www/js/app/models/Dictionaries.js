"use strict";

import Emitter from "yasmf-emitter";

// private property symbols

let _dictionaries = Symbol();

export default class Dictionaries extends Emitter {
    constructor() {
        super();
        this[_dictionaries] = new Map();
    }

    addDictionary(Dictionary) {
        this[_dictionaries].set(Dictionary.name, Dictionary);
    }

    getDictionary(dictionaryName) {
        return this[_dictionaries].get(dictionaryName);
    }

    get dictionaries() {
        return Array.from(this[_dictionaries]).map(([k])=>k);
    }
}
