"use strict";
export default class Definition {
    constructor({wordNetRef, lemmas=[], partOfSpeech, gloss } = {}) {
        this.lemmas = typeof lemmas === "string" ? lemmas.split(":::") : lemmas;
        this.partOfSpeech = partOfSpeech;
        this.gloss = gloss;
        this.wordNetRef = wordNetRef;
    }
}

export function createDefinition(options = {}) {
    return new Definition(options);
}
