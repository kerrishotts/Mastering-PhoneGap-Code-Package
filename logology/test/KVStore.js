/*
 * Logology testing suite
 * 
 * This suite tests the basic features of Logology. Don't assume that this test suite
 * is in any way complete; as bugs are discovered, new tests will be added.
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
 */

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
                let store;
                afterEach(() => {
                    store.close();
                });
                it ("should be able to create a new store", () => {
                    store = createKVStore({adapter:adapterFn({[mockProperty]:mock})});
                    return store.should.exist;
                });
                it ("should be able to create a new store using a specific namespace", () => {
                    let adapter = adapterFn({namespace:"test", [mockProperty]:mock});
                    store = createKVStore({adapter});
                    return adapter.namespace.should.equal("test");
                });
            });
            describe ("#Using", function()  {
                let options = {
                    namespace: "test",
                    [mockProperty]: mock
                };
                let store;
                beforeEach(() => {
                    store = createKVStore({adapter:adapterFn(options)});
                });
                afterEach(() => {
                    store.close();
                });
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


