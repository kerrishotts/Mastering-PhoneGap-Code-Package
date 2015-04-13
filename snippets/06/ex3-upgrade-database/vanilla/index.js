// IndexedDB has been prefixed, so we need to get the prefixed version if the non-prefixed version
// is not available. from: https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Using_IndexedDB
let indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;

// if we don't have an object, we can't continue, obviously.
if (!indexedDB) {
    console.log("You need to run this example in a browser that supports IndexedDB.");
}

function openDatabase({name, version, onopen, onerror, onupgrade}) {
    let req = indexedDB.open(name, version);
    req.onerror = function(evt) {
        console.log("[DB] Encountered an error opening the database:" + evt.target.errorCode);
    };
    req.onsuccess = function() {
        let db = this.result;
        db.onerror = onerror || function(dbEvent) {
            console.log("[DB] Encountered a database error:" + dbEvent.target.errorCode);
        };
        onopen(db);
    };
    req.onupgradeneeded = function(evt) {
        let oldVersion = evt.oldVersion;
        // Safari returns a really silly value for newly created databases.
        // From https://github.com/treojs/idb-schema/blob/master/lib/index.js
        onupgrade(evt.target.result, oldVersion > 4294967295 ? 0 : oldVersion);
    };
}

function upgradeDatabase(db, oldVersion) {
    for (let curVersion = oldVersion; curVersion < db.version; curVersion++) {
        switch (curVersion) {
            case 0:
                console.log("First version schema");
                let definitionStore = db.createObjectStore("definition", {keyPath: "wordNetRef"});
                definitionStore.createIndex("lemmas", "lemmas", {unique: false, multiEntry: true});
                console.log(definitionStore.indexNames);
                break;
            case 1:
                console.log("Second version schema");
                // these schemas will have keys automatically incremented
                db.createObjectStore("notes", {autoIncrement: true});
                db.createObjectStore("favorites", {autoIncrement: true});
                break;
            default:
                console.log("No upgrade steps available");
        }
    }
}

function gotADatabase(db) {
    console.log(db.version);
    db.close();
}

let deleteReq = indexedDB.deleteDatabase("StarterDictionary");
deleteReq.onsuccess = () => {
    openDatabase({name: "StarterDictionary", version: 2,
                onopen: gotADatabase, onupgrade: upgradeDatabase});
};


