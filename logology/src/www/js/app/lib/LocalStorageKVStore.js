"use strict";

import Emitter from "yasmf-emitter";

//region private properties
const _namespace = Symbol("_namespace"),
      _localStorage = Symbol("_localStorage");
//endregion

export default class LocalStorageKVStore extends Emitter {
    constructor({namespace = "_default", localStorage} = {}) {
        super();
        this[_namespace] = namespace;
        this[_localStorage] = localStorage;
    }

    get localStorage() {
        return this[_localStorage] ? this[_localStorage] : (typeof localStorage !== "undefined" ? localStorage : {
            getItem() { throw new Error("Not Implemented."); },
            setItem() { throw new Error("Not Implemented."); },
            removeItem() { throw new Error("Not Implemented."); }
        });
    }

    get namespace() {
        return this[_namespace];
    }

    set(key, value) {
        return new Promise ((resolve, reject) => {
            this.localStorage.setItem(`${this.namespace}:${key}`, value);
            this.emit(`model:changed:${key}`, value);
            resolve();
        });
    }

    get(key, defaultValue) {
        return new Promise ((resolve, reject) => {
            let v = this.localStorage.getItem(`${this.namespace}:${key}`);
            if (v === null || v === undefined) {
                v = defaultValue;
            }
            resolve(v);
        });
    }

    exists(key) {
        return new Promise ((resolve, reject) => {
            let v = this.localStorage.getItem(`${this.namespace}:${key}`);
            resolve(!(v === null || v === undefined));
        });
    }

    remove(key) {
        return new Promise ((resolve, reject) => {
            this.localStorage.removeItem(`${this.namespace}:${key}`);
            this.emit(`model:changed:${key}`);
            resolve();
        });
    }
}

export function createLocalStorageKVStore(options = {}) {
    return new LocalStorageKVStore(options);
}
