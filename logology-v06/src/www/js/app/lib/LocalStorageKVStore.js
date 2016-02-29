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
