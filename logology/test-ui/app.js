"use strict";
/*globals afterEach, describe, it */
var util = require("./helpers/util");
var should = util.should;

afterEach(function() {
    this.timeout(300000);
    return util.wait(3000); // give time for any interactions to settle
});

/* ---------------------------------------------------------------------------
 * App Navigation
 * ---------------------------------------------------------------------------*/
 
function goBack() {
    return util.tapElementByCss("main.visible > nav .back-icon");
}

/* ---------------------------------------------------------------------------
 * Tests
 * ---------------------------------------------------------------------------*/


describe("App", function() {
    this.timeout(300000);
    it("should have a rootContainer", function() {
        return util.elementByCssExists("#rootContainer");
    });
    it ("should have a settings button in the nav bar", function() {
        return util.elementByCssExists("main.SearchViewController nav button.settings-icon");
    });  
    it ("Clicking settings button in the nav bar should reveal settings view controller", () => {
        return util.tapElementByCss("main.SearchViewController nav button.settings-icon")
                   .then(() => util.elementByCssDisplayed("main.SettingsViewController.displayed"));
    });
    it ("Once in settings, clicking Back button in nav bar should go back", () => {
        return goBack()
                   .then(() => util.elementByCssDisplayed("main.SearchViewController.displayed"));
    });
    
    it("should be able to focus the search field, search for cat, and find it", function() {
        return util.typeIntoElementByCss("main.SearchViewController nav input", "cat", {waitBetween: 100})
                   .then(() => util.elementByCssExists("main.SearchViewController ul li button[value=cat] div"))
                   .text().should.eventually.equal("cat");
    });
    it("should be able to click on a found word", function() {
        //
        // notes: this test assumes that the word is VISIBLE on the screen; it /will/ find a word that 
        // is off-screen, but the tap may hit the wrong element.
        return util.typeIntoElementByCss("main.SearchViewController nav input", "quicke", {waitBetween: 100})
                   .then(() => util.tapElementByCss("main.SearchViewController ul li button[value=quicker] div"))
                   .then(() => util.elementByCssExists("main.DefinitionViewController h2"))
                   .text().should.eventually.equal("quicker");
    });
    it("should be able to favorite the word", function() {
        return util.tapElementByCss("main.DefinitionViewController nav button.fav-icon[data-fav=no]")
                   .then(() => util.elementByCssExists("main.DefinitionViewController nav button.fav-icon"))
                   .getAttribute("data-fav").should.eventually.equal("yes");
    });
    it("should be able to un-favorite the word", function() {
        return util.driver
                   .waitForElementByCss("main.DefinitionViewController nav button.back-icon")     //go back a view
                   .then(el => util.tapElement(el))
                   .waitForElementByCss("main.SearchViewController ul li button[value=quicker] div", 2000) // click the word again
                   .then(el => util.tapElement(el))
                   .waitForElementByCss("main.DefinitionViewController nav button.fav-icon[data-fav=yes]", 2000)  // make sure it's still a fav
                   .then(el => util.tapElement(el))
                   .waitForElementByCss("main.DefinitionViewController nav button.fav-icon", 2000) // remove fav
                   .getAttribute("data-fav").should.eventually.equal("no");
    });
    
});
