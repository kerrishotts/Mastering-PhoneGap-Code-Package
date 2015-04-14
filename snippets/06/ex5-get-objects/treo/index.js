let treo = window.treo,
    promise = window.treoPromise,
    webSQL = window.treoWebsql;

let schema = treo.schema()
             .version(1)
             .addStore("definition", {key: "wordNetRef"})
             .addIndex("lemmas", "lemmas", {unique: false, multiEntry:true})
             .version(2)
             .addStore("favorites", {autoIncrement: true})
             .addStore("notes", {autoIncrement: true});

let db = treo("StarterDictionary", schema);
db.use(webSQL());
db.use(promise());

// Definitions from WordNet; see LICENSE-WordNet.md in the root directory of this code package.
let definitions = [
    {wordNetRef: "02124272", lemmas: ["cat", "true cat"], partOfSpeech: "noun", semantics: "noun.animal",
        gloss: "feline mammal usually having thick soft fur and no ability to roar: domestic cats; wildcats"},
    {wordNetRef: "02130460", lemmas: ["cat", "big cat"], partOfSpeech: "noun", semantics: "noun.animal",
        gloss: "any of several large cats typically able to roar and living in the wild"},
    {wordNetRef: "02085443", lemmas: ["aardvark", "ant bear", "anteater", "Orycteropus afer"], partOfSpeech: "noun", sematics: "noun.animal",
        gloss: "nocturnal burrowing mammal of the grasslands of Africa that feeds on termites; sole extant representative of the order Tubulidentata"}
];

let definitionStore = db.store("definition");
definitionStore.batch(definitions)
  .then(() => definitionStore.get("02124272"))
  .then((result) => console.log(result ? JSON.stringify(result, null, 2)
                                       : "Couldn't find entry."))
  .then(() => db.close())
  .catch((err) => {
      console.log("[DB] An error was encountered " + err);
      db.close();
  });

