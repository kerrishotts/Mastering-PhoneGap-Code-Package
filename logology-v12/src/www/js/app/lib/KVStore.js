"use strict";

//region private properties

const _backingStore = Symbol("_backingStore");

import Emitter from "yasmf-emitter";

export default class KVStore extends Emitter {
    constructor({adapter} = {}) {
        super();
        this[_backingStore] = adapter;
    }

    set(key, value) {
        return this[_backingStore].set(key, value).then(() => {
            this.emit("model:changed:" + key, value);
        });
    }

    get(key, defaultValue) {
        return this[_backingStore].get(key, defaultValue);
    }

    exists(key) {
        return this[_backingStore].exists(key);
    }

    remove(key) {
        return this[_backingStore].remove(key).then(() => {
            this.emit("model:changed:" + key);
        });
    }
}

export function createKVStore(options = {}) {
    return new KVStore(options);
}
