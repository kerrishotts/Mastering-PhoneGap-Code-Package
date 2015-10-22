/*globals WebSQLDB */
function go() {
  let db = new WebSQLDB({name: "test.db"});

let definitions = [
    {wordNetRef: "02124272", partOfSpeech: "noun",
        gloss: "feline mammal usually having thick soft fur and no ability to roar: domestic cats; wildcats"},
    {wordNetRef: "02130460", partOfSpeech: "noun",
        gloss: "any of several large cats typically able to roar and living in the wild"},
    {wordNetRef: "02085443", partOfSpeech: "noun",
        gloss: "nocturnal burrowing mammal of the grasslands of Africa that feeds on termites; sole extant representative of the order Tubulidentata"}
];

let lemmas = [
    {wordNetRef: "02124272", lemma: "cat"},
    {wordNetRef: "02124272", lemma: "true cat"},
    {wordNetRef: "02130460", lemma: "cat"},
    {wordNetRef: "02130460", lemma: "big cat"},
    {wordNetRef: "02085443", lemma: "aardvark"},
    {wordNetRef: "02085443", lemma: "ant bear"},
    {wordNetRef: "02085443", lemma: "anteater"},
    {wordNetRef: "02085443", lemma: "Orycteropus afer"}
];

  // using executeSql
  db.transaction((tx) => {
      console.log("creating tables...");
      tx.executeSql("DROP TABLE IF EXISTS definition");
      tx.executeSql("DROP TABLE IF EXISTS lemmas");
      tx.executeSql("CREATE TABLE IF NOT EXISTS definition ( wordNetRef INTEGER PRIMARY KEY, partOfSpeech TEXT, gloss TEXT)");
      tx.executeSql("CREATE TABLE IF NOT EXISTS lemmas ( wordNetRef INTEGER, lemma TEXT, PRIMARY KEY(wordNetRef, lemma) FOREIGN KEY (wordNetRef) REFERENCES definition (wordNetRef))");

      let definitionSql = "INSERT INTO definition ( wordNetRef, partOfSpeech, gloss ) VALUES ( ?, ?, ? )";
      let lemmaSql = "INSERT INTO lemmas ( wordNetRef, lemma ) VALUES ( ?, ? )";

      definitions.forEach(({wordNetRef, partOfSpeech, gloss}) => tx.executeSql(definitionSql, [wordNetRef, partOfSpeech, gloss]) );
      lemmas.forEach(({wordNetRef, lemma}) => tx.executeSql(lemmaSql, [wordNetRef, lemma]));
  }).then(() => console.log("Tables created successfully."))
    .catch((err) => console.log(`Error: ${err.message}`));

  // using our library
  db.transaction((tx) => {
    db.dropTable({name: "definition", ifExists: true, transaction: tx});
    db.dropTable({name: "lemmas", ifExists: true, transaction: tx});
    db.createTable({name: "definition", ifNotExists: true, transaction: tx,
                    fields: [ [ "wordNetRef", "INTEGER PRIMARY KEY" ],
                              [ "partOfSpeech", "TEXT"],
                              [ "gloss", "TEXT" ] ]});
    db.createTable({name: "lemmas", ifNotExists: true, transaction: tx,
                    fields: [ [ "wordNetRef", "INTEGER" ],
                              [ "lemma", "TEXT" ] ],
                    constraints: [ "PRIMARY KEY (wordNetRef, lemma)",
                                   "FOREIGN KEY (wordNetRef) REFERENCES definition (wordNetRef)"]});

    [ ["definition", definitions],
      ["lemmas", lemmas] ].forEach( ([ table, data]) => {
        let sql;
        data.forEach((datum) => {
            if (!sql) { sql = db.insert({intoTable: table, data: datum, template: true}); }
            db.exec({sql, binds: Object.values(datum), transaction: tx});
        });
      });
  }).then(() => console.log("Promise Tables created successfully."))
    .catch((err) => console.log(`Promise Error: ${err.message}`));
}

go();
