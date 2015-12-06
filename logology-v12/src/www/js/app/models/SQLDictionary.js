"use strict";
import Dictionary from "./Dictionary";
import Definition from "./Definition";
import WebSQLDB from "$LIB/WebSQL";

import {_sortedIndex} from "./Dictionary";

const _db = Symbol("db");

export default class SQLDictionary extends Dictionary {
    constructor (options = {}) {
        super(options);
        this[_db] = null;
    }

    async load() {
        this[_db] = new WebSQLDB({
            name: "dicts/" + this.options.path,
            description: this.options.name
        });
        let db = this[_db];

        return db.transaction((transaction) => {
            this[_sortedIndex] = (db.select({
                transaction,
                fields: ["lemma"],
                from: "lemmas",
                orderBy: ["lemma"]
            })).rows;

        }, {readOnly: true}).then(() => {
            this.loaded();
        });

    }
    get sortedIndex() {
        if (!this.isLoaded) {
            return [];
        }
        return this[_sortedIndex];
    }

    getEntries( {lemma="", wordNetRef, per=10000} ) {
        if (!this.isLoaded) {
            return Promise.resolve(() => []);
        }
        let arr = [], idx = 0, len = this[_json].length, id;
        let searchKey = wordNetRef !== undefined ? "wordNetRef" : "lemmas";
        let searchStr = wordNetRef !== undefined ? wordNetRef : lemma.toLowerCase().trim();

        return new Promise((resolve, reject) => {
            id = setInterval(() => {
                if (idx<len) {
                    let nextLen = idx + per;
                    if (nextLen > len) {
                        nextLen = len;
                    }
                    for (let i=idx;i<nextLen;i++) {
                        let definition = this[_json][i];
                        if (definition[searchKey].indexOf(searchStr) > -1) {
                            arr.push(definition);
                        }
                        idx++;
                    }
                } else {
                    clearInterval(id);
                    resolve(arr.map(d => new Definition(d))
                               .sort((a, b) => (a.wordNetRef === b.wordNetRef ? 0 : (a.wordNetRef < b.wordNetRef ? -1 : 1))));
                }
            }, 0);
        });
    }
}

SQLDictionary.meta = {
    name: "SQL Dictionary",
    language: "en"
};

export function createSQLDictionary(options = {}) {
    return new SQLDictionary(options = {});
}
