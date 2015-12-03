"use strict";

import Emitter from "yasmf-emitter";
import treo from "treo";
let treoWebSql;
if (typeof window !== "undefined") {
    treoWebSql= require("treo/plugins/treo-websql");
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
        //if (indexedDB) {
        //    global.indexedDB = indexedDB;
        //}
        this[_db] = treo(namespace, kvSchema);
        if (!indexedDB) {
            this.db.use(treoWebsql());
        }
    }

    get db() {
        return this[_db];
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
