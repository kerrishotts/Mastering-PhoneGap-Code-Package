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
import treo from "treo";
let treoWebSql;
if (typeof window !== "undefined") {
    treoWebSql = require("treo/plugins/treo-websql");
}

//region private properties
const _namespace = Symbol("_namespace"),
      _indexedDB = Symbol("_indexedDB"),
      _db = Symbol("_db");
//endregion

const kvSchema = treo.schema()
                     .version(1)
                       .addStore("kv");

export default class IndexedDBKVStore extends Emitter {
    constructor({namespace = "_default", indexedDB} = {}) {
        super();
        this[_namespace] = namespace;
        this[_indexedDB] = indexedDB;
        this[_db] = treo(namespace, kvSchema);
        if (!indexedDB) {
            this.db.use(treoWebSql());
        }
    }

    get db() {
        return this[_db];
    }

    close() {
        this[_db].close(() => {console.log("closed")});
    }

    get namespace() {
        return this[_namespace];
    }

    set(key, value) {
        let store = this.db.store("kv");
        return new Promise((resolve, reject) => {
            store.put(key, value, (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                    this.emit(`model:changed:${key}`, value);
                }
            });
        });
    }

    get(key, defaultValue) {
        let store = this.db.store("kv");
        return new Promise((resolve, reject) => {
            store.get(key, (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data === null || data === undefined ? defaultValue : data);
                }
            });
        });
    }

    exists(key) {
        let store = this.db.store("kv");
        return new Promise((resolve, reject) => {
            store.get(key, (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(!(data === null || data === undefined));
                }
            });
        });
    }

    remove(key) {
        let store = this.db.store("kv");
        return new Promise((resolve, reject) => {
            store.del(key, (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                    this.emit(`model:changed:${key}`);
                }
            });
        });
    }
}

export function createIndexedDBKVStore(options = {}) {
    return new IndexedDBKVStore(options);
}
