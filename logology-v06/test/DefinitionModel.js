"use strict";

let should = require("./helpers/setup").should;
import  Definition from "../src/www/js/app/models/Definition";

describe("Definition Tests", () => {
    it("should be able to create a new definition", () => {
        let d = new Definition({wordNetRef:1, 
                               lemmas: ["apple"],
                               partOfSpeech: "n",
                               gloss: "A tasty fruit"});
        return d.should.exist;
    })
    it("should be able to create a new noun", () => {
        let d = new Definition({wordNetRef:1, 
                               lemmas: ["apple"],
                               partOfSpeech: "n",
                               gloss: "A tasty fruit"});
        return d.should.have.property("partOfSpeech","n");
    })
});
