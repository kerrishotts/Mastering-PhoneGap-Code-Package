// IndexedDB has been prefixed, so we need to get the prefixed version if the non-prefixed version
// is not available. from: https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Using_IndexedDB
let indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;

// if we don't have an object, we can't continue, obviously.
if (!indexedDB) {
    console.log("You need to run this example in a browser that supports IndexedDB.");
}

function openDatabase({name, version, onerror}) {
    return new Promise((resolve, reject) => {
        let req = indexedDB.open(name, version);
        req.onerror = function(evt) {
            reject(evt.target.error);
        };
        req.onsuccess = function() {
            let db = this.result;
            db.onerror = onerror || function(dbEvent) {
                console.log("[DB] Encountered a database error:", dbEvent.target.error);
            };
            resolve(db);
        };
    });
}

openDatabase({name: "StarterDictionary", version: 1})
.then(db => console.log(db))
.catch(err => console.log("Encountered an error opening the database:", err));


