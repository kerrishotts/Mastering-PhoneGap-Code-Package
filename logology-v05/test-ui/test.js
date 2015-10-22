"use strict";

var util = require("./helpers/util");
var should = util.should;

describe("Test", function() {
    this.timeout(300000);
    it("should have a rootContainer", function() {
        return util.driver.elementByCss("#rootContainer")
        .should.eventually.exist;
    });
    it ("should have a menu button in the nav bar", function() {
        return util.driver.waitForElementByCss("main.SearchViewController nav button.menu-icon")
        .should.eventually.exist;
    });
    it ("Clicking menu button in the nav bar should reveal sidebar", () => {
        return util.driver.waitForElementByCss("main.SearchViewController nav button.menu-icon")
                     .then(util.switchToNativeContext)
                     .waitForElementByXPath("//*[@content-desc|@name='Tap to reveal the sidebar']")
                     .click()
                     .then(util.switchToWebViewContext)
                     .waitForElementByCss("main.MenuViewController.default-displayed", 2000)
                     .isDisplayed().should.eventually.equal(true);
    });
});

// xpath example that works on iOS and Android
// //*[contains(@content-desc|@name,"anteater")]/following-sibling::*[contains(@content-desc|@name,"Save")][1]]]
                     //.eval("app.splitViewController.rightView.topView.hammer.emit('tap', {target:document.querySelector('main.SearchViewController button.menu-icon')})")
