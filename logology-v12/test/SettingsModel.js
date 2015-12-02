"use strict";
var Storage = require("dom-storage");
var localStorage = new Storage(null, { strict: true });

let should = require("./helpers/setup").should;
import Settings from "../src/www/js/app/models/Settings";

describe("Settings Tests (no initial settings)", () => {

    it("should be able to create a new Settings object", () => {
        let settings = new Settings({localStorage});
        return settings.should.exist;
    });
    it("should be able to access default settings", () => {
        let settings = new Settings();
        return settings.should.have.property("theme", "light");
    });
    it("should be able to access default settings even after retrieval", () => {
        let settings = new Settings();
        settings.retrieveSettings();
        return settings.should.have.property("theme", "light");
    });
});
