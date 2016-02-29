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

export default class StarterDictionary extends Dictionary {
    load() {
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
        this.loaded();
    }
}

StarterDictionary.meta = {
    name: "Starter Dictionary",
    language: "en"
};

export function createStarterDictionary(options = {}) {
    return new StarterDictionary(options);
}
