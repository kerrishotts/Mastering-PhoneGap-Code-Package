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
        console.log("[DB] Encountered an error opening the database:" + evt.target.error);
    };
    req.onsuccess = function() {
        let db = this.result;
        db.onerror = onerror || function(dbEvent) {
            console.log("[DB] Encountered a database error:" + dbEvent.target.error);
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

function allDefinitionsByLemma(db) {
    let IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;
    let range = IDBKeyRange.only("cat");
    let req = db.transaction(["definition"]).objectStore("definition")
                .index("lemmas").openCursor(range);
    req.onerror = function (evt) {
        console.log("[DB] An error occurred: " + evt.target.error);
        db.close();
    };
    req.onsuccess = function (evt) {
        let cursor = evt.target.result;
        if (cursor) {
            console.log(`key: ${cursor.key}, value: ${JSON.stringify(cursor.value, null, 2)}`);
            cursor.continue();
        } else {
            console.log("No more entries.");
            db.close();
        }
    };
}

function findADefinitionByLemma(db) {
    let req = db.transaction(["definition"]).objectStore("definition")
                .index("lemmas").get("cat");
    req.onerror = function (evt) {
        console.log("[DB] An error occurred: " + evt.target.error);
        db.close();
    };
    req.onsuccess = function (evt) {
        let definition = evt.target.result;
        if (definition) {
            console.log(JSON.stringify(definition, null, 2));
            allDefinitionsByLemma(db);
        } else {
            console.log("Couldn't find entry.");
            db.close();
        }
    };
}

function gotADatabase(db) {
    // Definitions from WordNet. See LICENSE-WordNet.md in package root.
    let definitions = [
        {wordNetRef: "02124272", lemmas: ["cat", "true cat"], partOfSpeech: "noun", semantics: "noun.animal",
            gloss: "feline mammal usually having thick soft fur and no ability to roar: domestic cats; wildcats"},
        {wordNetRef: "02130460", lemmas: ["cat", "big cat"], partOfSpeech: "noun", semantics: "noun.animal",
            gloss: "any of several large cats typically able to roar and living in the wild"},
        {wordNetRef: "02085443", lemmas: ["aardvark", "ant bear", "anteater", "Orycteropus afer"], partOfSpeech: "noun", sematics: "noun.animal",
            gloss: "nocturnal burrowing mammal of the grasslands of Africa that feeds on termites; sole extant representative of the order Tubulidentata"}
    ];
    let transaction = db.transaction(["definition"], "readwrite");
    transaction.onerror = function(evt) {
        console.log("[DB] Transaction got an error: " + evt.target.error);
        db.close();
    };
    transaction.oncomplete = function() {
        console.log("[DB] All entries added.");
        findADefinitionByLemma(db);
    };
    let definitionStore = transaction.objectStore("definition");
    definitions.forEach(definition => definitionStore.put(definition));
}

let deleteReq = indexedDB.deleteDatabase("StarterDictionary");
deleteReq.onsuccess = () => {
    openDatabase({name: "StarterDictionary", version: 2,
                onopen: gotADatabase, onupgrade: upgradeDatabase});
};


