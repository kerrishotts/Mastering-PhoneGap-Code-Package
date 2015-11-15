"use strict";
import Dictionary from "./Dictionary";
import Definition from "./Definition";

import {_sortedIndex} from "./Dictionary";

let _json = Symbol("_json");

export default class XHRDictionary extends Dictionary {
    constructor (options = {}) {
        super(options);
        this[_json] = null;
    }
    async load() {
        // request definitions from a JSON file
        let response = await fetch("dicts/" + this.options.path);
        let definitions = await response.json();
        this[_json] = definitions;
        this.loaded();
    }
    get sortedIndex() {
        if (!this.isLoaded) {
            return [];
        }
        if (this[_sortedIndex].length > 0) {
            return this[_sortedIndex];
        }
        let lemmas = this[_json].map(i => i.lemmas);
        let index = [];
        lemmas.forEach(i => i.map(i => index.push(i)));
        this[_sortedIndex] = index.sort((a,b) => (a === b ? 0 : (a < b ? -1 : 1 )));
        return this[_sortedIndex];
    }

}

XHRDictionary.meta = {
    name: "XHR Dictionary",
    language: "en"
};

export function createXHRDictionary(options = {}) {
    return new XHRDictionary(options = {});
}
