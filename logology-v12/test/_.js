require("babelify/polyfill");

if (typeof window === "undefined") {
    global.window = global;
    global.navigator = {
        userAgent: "node"
    };
    let Storage = require("dom-storage");
    global.localStorage = new Storage(null, { strict: true });
    indexedDB = require("fake-indexeddb");
    global.indexedDB = indexedDB;
    openDatabase = require("opendatabase");
    global.openDatabase = openDatabase;
}

