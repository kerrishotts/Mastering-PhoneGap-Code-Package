# Logology v8.0.0

Chapter 8 discusses using the Cordova SQLite plugin for persistent storage. As such, the project has been updated to use SQLite.

## Important Changes

* `src/www/js/app/lib/WebSQLKVStore.js` has been added, allowing for Note and Favorite storage in a user SQLite database.

* `src/www/js/app/models/SQLDictionary.js` has been added as a dictionary source, which allows SQL queries against the WordNet
  database.

* `src/www/js/app/index.js`, `src/www/js/app/models/Notes.js`, `src/www/js/app/models/Favorites.js` have been modified to use SQLite
  as a storage mechanism.

