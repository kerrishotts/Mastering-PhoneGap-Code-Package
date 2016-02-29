/*****************************************************************************
 *
 * Logology testing suite
 * 
 * This suite tests the basic features of Logology. Don't assume that this test suite
 * is in any way complete; as bugs are discovered, new tests will be added.
 * 
 * Because these tests rely on application state, it's important not to run any tests
 * in parallel. As such, tests should be performed serially.
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

function goBackAndVerify(checkElement = "main.SearchViewController.displayed") {
    return goBack().then(() => util.elementByCssDisplayed(checkElement));    
}

/**
 * Navigates to settings; assumes the app is at the launch screen
 */
function navigateToSettings() {
    return util.tapElementByCss("main.SearchViewController nav button.settings-icon")
          .then(() => util.elementByCssDisplayed("main.SettingsViewController.displayed"));
}

/**
 * Navigates to the notes view. Assumes the app is already at a definition.
 */
function navigateToNotes() {
    return util.tapElementByCss("main.DefinitionViewController nav button.note-icon")
          .then(() => util.elementByCssDisplayed("main.NotesViewController.displayed"));
}    

/**
 * Navigates to the About view. Assumes the app is already in the Settings view.
 */
function navigateToAbout() {
    return util.tapElementByCss("main.SettingsViewController ul li > button[value='about']")
          .then(() => util.elementByCssDisplayed("main.AboutViewController.displayed"));
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
        return navigateToSettings();
    });
    it ("Once in settings, clicking Back button in nav bar should go back", () => {
        return goBackAndVerify();
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
              .then(() => util.wait(1000))
              .then(() => util.elementByCssExists("main.DefinitionViewController h2"))
              .text().should.eventually.equal("quicker");
    });
    it("should be able to favorite the word", function() {
        return util.tapElementByCss("main.DefinitionViewController nav button.fav-icon[data-fav=no]")
              .then(() => util.elementByCssExists("main.DefinitionViewController nav button.fav-icon"))
              .getAttribute("data-fav").should.eventually.equal("yes");
    });
    it("should be able to un-favorite the word", function() {
        return goBackAndVerify()
              .waitForElementByCss("main.SearchViewController ul li button[value=quicker] div", 2000) // click the word again                   
              .then(el => util.tapElement(el))
              .waitForElementByCss("main.DefinitionViewController nav button.fav-icon[data-fav=yes]", 2000)  // make sure it's still a fav
              .then(el => util.tapElement(el))
              .waitForElementByCss("main.DefinitionViewController nav button.fav-icon", 2000) // remove fav
              .getAttribute("data-fav").should.eventually.equal("no");
    });
    it ("should be able to navigate to the Notes View", function() {
        return navigateToNotes();   
    });
    it("should be able to add a note", function() {
        return util.typeIntoElementByCss("main.NotesViewController textarea", "This is a note.", {waitBetween: 100});
    });
    it("should be able to see an existing note", function() {
        return goBackAndVerify("main.DefinitionViewController.displayed")
              .then(() => util.wait(1000))
              .then(() => navigateToNotes())
              .then(() => util.wait(1000))
              .then(() => util.driver.waitForElementByCss("main.NotesViewController textarea"))
              .getAttribute("value").should.eventually.equal("This is a note.");
    });
    it("should be able to remove a note", function() {
        return util.tapElementByCss("main.NotesViewController nav button.trash-icon")
              .then(() => util.wait(1000))
              .then(() => navigateToNotes())
              .then(() => util.wait(1000))
              .then(() => util.driver.waitForElementByCss("main.NotesViewController textarea"))
              .getAttribute("value").should.eventually.equal("");
    });
    it("should return to the search view", function() {
        return goBackAndVerify("main.DefinitionViewController.displayed")
              .then(() => goBackAndVerify());
    })
    it("should be able to view about", function() {
        return navigateToSettings()
              .then(() => navigateToAbout());
    });
    
});
