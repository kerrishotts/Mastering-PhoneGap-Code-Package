"use strict";
let localStorage, indexedDB, openDatabase;
if (typeof window !== "undefined") {
    localStorage = window.localStorage;
    indexedDB = window.indexedDB;
    openDatabase = window.openDatabase;
}
else {
    global.window = global;
    global.navigator = {
        userAgent: "node"
    };

    let Storage = require("dom-storage");
    let localStorage = new Storage(null, { strict: true });
    indexedDB = require("fake-indexeddb");
    global.indexedDB = indexedDB;
    openDatabase = require("opendatabase");
    global.openDatabase = openDatabase;
}
let should = require("./helpers/setup").should;

import {createKVStore} from "../src/www/js/app/lib/KVStore";
import {createLocalStorageKVStore} from "../src/www/js/app/lib/LocalStorageKVStore";
import {createIndexedDBKVStore} from "../src/www/js/app/lib/IndexedDBKVStore";
import {createWebSQLKVStore} from "../src/www/js/app/lib/WebSQLKVStore";

describe ("KVStore", () => {
    [["localStorage", createLocalStorageKVStore, "localStorage", localStorage],
     ["IndexedDB",    createIndexedDBKVStore, "indexedDB", indexedDB],
     ["WebSQL",       createWebSQLKVStore,       "openDatabase", openDatabase]
    ].forEach( ([adapterName, adapterFn, mockProperty, mock]) => {
        describe ("Using " + adapterName, () => {
            if (mock) {
            describe ("#Create", () => {
                it ("should be able to create a new store", () => {
                    let store = createKVStore({adapter:adapterFn({[mockProperty]:mock})});
                    return store.should.exist;
                });
                it ("should be able to create a new store using a specific namespace", () => {
                    let adapter = adapterFn({namespace:"test", [mockProperty]:mock});
                    let store = createKVStore({adapter});
                    return adapter.namespace.should.equal("test");;
                });
            });
            describe ("#Using", function()  {
                let options = {
                    namespace: "test",
                    [mockProperty]: mock
                };
                let store = createKVStore({adapter:adapterFn(options)});
                it ("should be able to store a value", () => {
                    return store.set("key", "value").should.be.fulfilled;
                });
                it ("should be able to get that value", () => {
                    return store.get("key").should.become("value");
                });
                it ("should be able to get a default value", () => {
                    return store.get("key2", "default").should.become("default");
                });
                it ("should be able to check the existence of an existing key", () => {
                    return store.exists("key").should.become(true);
                });
                it ("should be able to check the existence of a non-existing key", () => {
                    return store.exists("key2").should.become(false);
                });
                it ("should be able to remove a key", () => {
                    return store.remove("key").should.be.fulfilled;
                });
                it ("... and the key should be gone!", () => {
                    return store.exists("key").should.become(false);
                });
            });
          }
        });
    });
});


