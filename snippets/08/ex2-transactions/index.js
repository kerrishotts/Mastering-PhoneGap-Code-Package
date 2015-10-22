/*globals WebSQLDB */
function go() {
  let db = new WebSQLDB({name: "test.db"});

  // a transaction without using our class
  db.db.transaction(
    (tx) => {
      console.log("in transaction");
      // do queries, etc.
    },
    (err) => console.log(`Transaction error: ${err}`),
    () => console.log("Transaction completed successfully.")
  );

  // or using our class

  db.transaction((tx) => {
      console.log("in promised transaction");
      // do queries, etc...
  }).then(() => console.log("Promise transaction completed successfully."))
    .catch((err) => console.log(`Promise transactoun error: ${err}`));

}

go();
