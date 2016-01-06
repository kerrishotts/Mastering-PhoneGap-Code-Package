try {
    require("babelify/polyfill");
} catch (err) {
    console.log(err);
}

if (typeof window === "undefined") {
    global.window = global;
    global.navigator = {
        userAgent: "node"
    };
    let Storage = require("dom-storage");
    global.localStorage = new Storage(null, { strict: true });
    let indexedDB = require("fake-indexeddb");
    global.indexedDB = indexedDB;
    let openDatabase = require("opendatabase");
    global.openDatabase = openDatabase;
}

