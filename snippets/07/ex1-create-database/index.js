/*globals WebSQLDB */
async function go() {
  let db = new WebSQLDB({name: "test.db"});
  try {
      await db.createTable({name: "version", ifNotExists: true,
                            fields: [ ["version", "integer primary key"],
                                      ["updated", "date"] ]});
      //await db.replace({intoTable:"version", data:{version:1, updated: new Date()}});
      let results = await db.select({fields:"max(version) version", from:"version"});
      console.log(results.rows[0].version);
  } catch (err) {
      console.log("err", err);
  }
}

go();
