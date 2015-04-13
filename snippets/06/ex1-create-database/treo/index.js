let treo = window.treo,
    promise = window.treoPromise,
    webSQL = window.treoWebsql;

let schema = treo.schema()
             .version(1);

let db = treo("StarterDictionary", schema);
db.use(promise());
db.use(webSQL());

console.log(db);

