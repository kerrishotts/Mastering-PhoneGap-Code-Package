"use strict";
export default class Definition {
    constructor({wordNetRef, lemmas=[], partOfSpeech, gloss }) {
        this.lemmas = lemmas;
        this.partOfSpeech = partOfSpeech;
        this.gloss = gloss;
        this.wordNetRef = wordNetRef;
    }
}
