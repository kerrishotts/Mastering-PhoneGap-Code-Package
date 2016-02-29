/*****************************************************************************
 *
 * Author: Kerri Shotts <kerrishotts@gmail.com> 
 *         http://www.photokandy.com/books/mastering-phonegap
 *
 * MIT LICENSED
 * 
 * Copyright (c) 2016 Packt Publishing
 * Portions Copyright (c) 2016 Kerri Shotts (photoKandy Studios LLC)
 * Portions Copyright various third parties where noted.
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this
 * software and associated documentation files (the "Software"), to deal in the Software
 * without restriction, including without limitation the rights to use, copy, modify,
 * merge, publish, distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to the following
 * conditions:
 * The above copyright notice and this permission notice shall be included in all copies
 * or substantial portions of the Software.
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
 * PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT
 * OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 * 
 *****************************************************************************/
 
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
        db.query({sql: "select count(*) as numLemmas from lemmas"})
        .then((r) => {
            const ITEMS_PER = 10000;
            let numLemmas = r.rows[0].numLemmas;
            let p = Promise.resolve();
            for (let i = 0; i < numLemmas; i += ITEMS_PER) {
                p = p.then(() => db.query({sql: "select lemma from lemmas order by lemma limit ?, ?", binds:[i, ITEMS_PER]}))
                     .then((r) => this[_sortedIndex].push(...r.rows.map((r) => r.lemma)));
            }
            p = p.then(() => {
                this.loaded();
            });
            return p;            
        });

    }
    get sortedIndex() {
        if (!this.isLoaded) {
            return [];
        }
        return this[_sortedIndex];
    }

    getEntries({lemma="", wordNetRef, per=10000}) {
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
            binds: [wordNetRef ? wordNetRef : lemma.toLowerCase().trim()]
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
