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

    close() {
        if (this[_backingStore].close) {
            this[_backingStore].close();
        }
        return;
    }
}

export function createKVStore(options = {}) {
    return new KVStore(options);
}
