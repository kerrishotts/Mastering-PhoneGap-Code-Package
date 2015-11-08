"use strict";
import Dictionary from "./Dictionary";
import Definition from "./Definition";

export default class StarterDictionary extends Dictionary {
    constructor() {
        super();

        // create a few definitions
        // definitions from Princeton's WordNet
        // Princeton University "About WordNet." WordNet. Princeton University. 2010. <http://wordnet.princeton.edu>
        let definitions = [
            {wordNetRef: "02124272", lemmas: ["cat", "true cat"], partOfSpeech: "noun", semantics: "noun.animal",
             gloss: "feline mammal usually having thick soft fur and no ability to roar: domestic cats; wildcats"},
            {wordNetRef: "02130460", lemmas: ["cat", "big cat"], partOfSpeech: "noun", semantics: "noun.animal",
             gloss: "any of several large cats typically able to roar and living in the wild"},
            {wordNetRef: "02085443", lemmas: ["aardvark", "ant bear", "anteater", "Orycteropus afer"], partOfSpeech: "noun", sematics: "noun.animal",
             gloss: "nocturnal burrowing mammal of the grasslands of Africa that feeds on termites; sole extant representative of the order Tubulidentata"}
        ];
        definitions.forEach((definition) => this._addDefinition(new Definition(definition)));
    }
}

StarterDictionary.meta = {
    name: "Starter Dictionary",
    language: "en"
};

export function createStarterDictionary(...args) {
    return new StarterDictionary(...args);
}
