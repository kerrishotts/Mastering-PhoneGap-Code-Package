"use strict";

import Emitter from "yasmf-emitter";

// private property symbols

let _dictionaries = Symbol(),
    _instances = Symbol(),
    _options = Symbol();

export default class Dictionaries extends Emitter {
    constructor() {
        super();
        this[_dictionaries] = new Map();
        this[_instances] = new Map();
        this[_options] = new Map();
    }

    addDictionary({name, Dictionary, options = {}} = {}) {
        this[_dictionaries].set(name, Dictionary);
        this[_instances].set(name, null);
        this[_options].set(name, options);
    }

    getDictionary({name} = {}) {
        return this[_dictionaries].get(name);
    }

    get dictionaries() {
        return Array.from(this[_dictionaries]).map(([k])=>k);
    }

    async getDictionaryInstance({name} = {}) {
        let instance = this[_instances].get(name);
        if (!instance) {
            let Dictionary = this[_dictionaries].get(name);
            let options = this[_options].get(name);
            instance = new Dictionary(options);
            await instance.load();
            this[_instances].set(name, instance);
        }
        return instance;
    }
}

export function createDictionaries(options = {}) {
    return new Dictionaries(options);
}
