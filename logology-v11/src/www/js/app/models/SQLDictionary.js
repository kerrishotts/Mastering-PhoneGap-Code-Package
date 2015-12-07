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
            name: this.options.path,
            description: this.options.name,
            location: 2,
            createFromLocation: 1
        });
        let db = this[_db];
        db.select({
            fields: ["lemma"],
            from: "lemmas",
            orderBy: ["lemma"]
        }).then((r) => {
            this[_sortedIndex] = r.rows.map((r) => r.lemma);
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
        let sql = `
        select d.wordNetRef, group_concat(l.lemma, ":::") lemmas, partOfSpeech, semantics, gloss
        from lemmas l, senses s, definitions d
        `
        if (wordNetRef) {
            sql += ` where d.wordNetRef= ? `;
        } else {
            sql += ` where l.lemma= ? `;
        }

        sql += `
        and s.wordid = l.wordid
        and d.wordid = s.wordid
        and d.wordNetRef = s.wordNetRef
        group by d.wordNetRef
        order by s.posname, s.sensenum`;

        return this[_db].exec({
            sql,
            binds:[wordNetRef ? wordNetRef : lemma.toLowerCase().trim()]
        }).then((r) => r.rows.map((d) => new Definition(d)));
    }
}

SQLDictionary.meta = {
    name: "SQL Dictionary",
    language: "en"
};

export function createSQLDictionary(options = {}) {
    return new SQLDictionary(options = {});
}
