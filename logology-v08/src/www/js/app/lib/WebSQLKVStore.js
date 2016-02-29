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
import WebSQL from "../../lib/WebSQL";

//region private properties
const _namespace = Symbol("_namespace"),
      _db = Symbol("_db");
//endregion

export default class WebSQLKVStore extends Emitter {
    constructor({namespace = "_default", openDatabase} = {}) {
        super();
        this[_namespace] = namespace;
        if (openDatabase) {
            global.openDatabase = openDatabase;
        }
        this[_db] = new WebSQL({name: `${namespace}.db`});
    }

    get db() {
        return this[_db];
    }

    close() {
        if (this[_db].close) {
            this[_db].close();
        }
    }

    get namespace() {
        return this[_namespace];
    }

    _createTables(transaction) {
        this.db.createTable({name: "KV", ifNotExists: true, transaction,
                        fields: [["K", "TEXT PRIMARY KEY"],
                                 ["V", "TEXT"]]});
    }

    set(key, value) {
        return new Promise((resolve,reject) => {
            return this.db.transaction(transaction=> {
                this._createTables(transaction);
                this.db.replace({transaction, intoTable: "KV",
                            data: { K: key, V: value }})
                this.emit(`model:changed:${key}`, value);
                resolve();
            }).catch(err => reject(err));
        });
    }

    get(key, defaultValue) {
        return new Promise((resolve,reject) => {
            return this.db.transaction(transaction=> {
                this._createTables(transaction)
            }).then(() => {
                return this.db.select({fields: ["V"], from: ["KV"],
                        where: { K: key }
                });
            }).then((r) => {
                if (r.rows.length > 0) {
                    resolve(r.rows[0].V);
                } else {
                    resolve(defaultValue);
                }
            }).catch(err => reject(err));
        });
    }

    exists(key) {
        return new Promise((resolve,reject) => {
            return this.db.transaction(transaction=> {
                this._createTables(transaction);
            }).then(() => {
                return this.db.select({fields: ["V"], from: ["KV"],
                        where: { K: key }
                });
            }).then((r) => {
                resolve(r.rows.length > 0);
            }).catch(err => reject(err));
        });
    }

    remove(key) {
        return new Promise((resolve,reject) => {
            return this.db.transaction(transaction=> {
                this._createTables(transaction);
                this.db.exec({transaction, sql: "DELETE FROM KV WHERE K=?", binds: [key]});
                this.emit(`model:changed:${key}`);
                resolve();
            }).catch(err => reject(err));
        });
    }
}

export function createWebSQLKVStore(options = {}) {
    return new WebSQLKVStore(options);
}
