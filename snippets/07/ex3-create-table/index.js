/*globals WebSQLDB */
function go() {
  let db = new WebSQLDB({name: "test.db"});

  // using executeSql
  db.transaction((tx) => {
      console.log("creating tables...");
      tx.executeSql("DROP TABLE IF EXISTS definition");
      tx.executeSql("DROP TABLE IF EXISTS lemmas");
      tx.executeSql("CREATE TABLE IF NOT EXISTS definition ( wordNetRef INTEGER PRIMARY KEY, partOfSpeech TEXT, gloss TEXT)");
      tx.executeSql("CREATE TABLE IF NOT EXISTS lemmas ( wordNetRef INTEGER, lemma TEXT, PRIMARY KEY(wordNetRef, lemma) FOREIGN KEY (wordNetRef) REFERENCES definition (wordNetRef))");
  }).then(() => console.log("Tables created successfully."))
    .catch((err) => console.log(`Error: ${err}`));

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
  }).then(() => console.log("Promise Tables created successfully."))
    .catch((err) => console.log(`Promise Error: ${err}`));
}

go();
