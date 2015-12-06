"use strict";

import KVStore from "../lib/KVStore";
import {createWebSQLKVStore} from "../lib/WebSQLKVStore";

// region private properties

// endregion

export default class Favorites extends KVStore {
    constructor({adapter} = {}) {
        if (!adapter) {
            adapter = createWebSQLKVStore({namespace: "favorites"});
        }
        super({adapter});
    }

    isWordAFavorite(word) {
        return this.exists(word);
    }

    saveWordAsFavorite(word) {
        return this.set(word, "true");
    }

    toggleFavorite(word) {
        return this.exists(word).then(r => r ? this.remove(word) : this.saveWordAsFavorite(word));
    }

    removeFavoriteWord(word) {
        return this.remove(word);
    }
}

export function createFavorites(options = {}) {
    return new Favorites(options);
}

let favorites;
export function getFavorites() {
    if (!favorites) {
        favorites = createFavorites();
    }
    return favorites;
}

