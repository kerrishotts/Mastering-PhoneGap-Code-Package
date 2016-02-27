/*****************************************************************************
 *
 * Logology
 * Author: Kerri Shotts <kerrishotts@gmail.com> 
 *         http://www.photokandy.com/books/mastering-phonegap
 *
 * Copyright (c) 2016 Packt Publishing, except where otherwise indicated. Dependencies
 * are copyright their respective owners. For license information, see /LICENSE and the
 * licenses of dependencies.
 * 
 * MIT LICENSED
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

// parts from https://github.com/the-experimenters/appium-smoke-tester/blob/master/uat/hybrid/CanLogin.uat.js
// and from: https://github.com/appium/sample-code/blob/master/sample-code/examples/node/helpers
"use strict";

// ENVIRONMENT VARIABLES
const UIA_SERVER = process.env.UIA_SERVER || "local";
const UIA_PROFILE = process.env.UIA_PROFILE;
const UIA_UDID = process.env.UIA_UDID;
const UIA_LOGGING = process.env.UIA_LOGGING;

var wd = require("wd");                     // include the web driver
var should = require ("./should");          // should boilerplate for chai/promised

var serverConfig = require("./servers/" + UIA_SERVER).server;
var profile = require("./profiles/" + UIA_PROFILE).profile;

var driver;

if (UIA_UDID) {
    profile.udid = UIA_UDID;                // iOS physical device support
}

/**
 * Configures logging to the console using different colors
 */

function configureLogging() {
    if (UIA_LOGGING) {
        driver.on('status', function (info) {
            console.log(info.cyan);
        });
        driver.on('command', function (meth, path, data) {
            console.log(' > ' + meth.yellow, path.grey, data || '');
        });
        driver.on('http', function (meth, path, data) {
            console.log(' > ' + meth.magenta, path, (data || '').grey);
        });
    }
}

/**
 * Switches the web driver to the given context. Uses a substring search.
 * @param {webdriver} driver
 * @param {string}    str to search for, like 'WEBVIEW'
 * @return {promise}  context
 */
function switchToContext(str) {
    return driver.setImplicitWaitTimeout(3000)
                 .contexts()                    // list all contexts
                 .then( function(contexts) {
                    // find the context that matches str
                    var desiredContext = contexts.reduce(
                        function searchForDesiredContext(prev, cur, idx, arr) {
                            return (cur.indexOf(str) !== -1) ? cur : prev;
                        }, undefined);
                    if (!desiredContext) {
                        throw new Error ("Couldn't find requested context" + str);
                    }
                    return driver.context(desiredContext);
                 })
}

/**
 * Switch to the webview context
 * 
 * @return {promise}  Webview context
 */
function switchToWebViewContext() {
    return switchToContext("WEBVIEW");
}

/**
 * Switch to the native context
 * 
 * @return {promise}  Native context
 */
function switchToNativeContext() {
    return switchToContext("NATIVE");
}

/**
 * Initial configuration; switches to webview context automatically.
 * 
 * @return {promise}  Web context
 */
before(function() {
    this.timeout(90000);  // wait 90s for slow startup times
    driver = wd.promiseChainRemote(serverConfig);
    configureLogging();
    driver = driver.init(profile);
    return switchToWebViewContext();
});

/**
 * When done, clean up!
 */
after(function() {
    this.timeout(30000);
    return driver.quit();       // clean up!
});

/**
 * Taps an element using the native context and touch actions. The area tapped is
 * the precise middle of the element on both axes by default, but this can be
 * overridden by specifying `xPct` and `yPct` in the options.
 * 
 * The process is as follows:
 * 
 * - Get the on-screen size and location of the element
 * - Calculate the location to tap (default is middle)
 * - Switch to the native context
 * - Create a touch action consisting of a tap, release, and a 1s wait.
 * - Perform the touch action
 * - Switch back to the web context
 * 
 * Unfortunately, this is SLOOOOOW on iOS because Instruments forces a 1s delay on
 * taps. The Appium app itself can override this, but the CLI can't. As such, we have
 * to put up with very long taps in the app (>1s). Typically apps will reject at much
 * lower values (~500ms), so we modified the actual app a touch to accept longer presses.
 * 
 * On the other hand, this avoids the requirement of searching by xPath. You can decide
 * which is nicer.
 * 
 * @param {Object} el             the element to tap; returned by elementByCssExists
 * @param {{xPct, yPct}} options  options; xPct and yPct are multipliers. Default 0.5 === middle of axis
 * @return {Promise}
 */
function tapElement(el, {xPct = 0.5, yPct = 0.5} = {}) {
    let platformOffset = {
        "iOS": 20,
        "Android": 25
    };
    
    return Promise.all([(driver.getLocation(el)), (driver.getSize(el))])
                  .then((r) => {
                      let x = r[0].x + (r[1].width * xPct);
                      let y = r[0].y + (r[1].height * yPct) + (platformOffset[profile.platformName] ? platformOffset[profile.platformName] : 0);
                      if (profile.pixelRatio) {
                          [x, y] = [x, y].map(v => v*profile.pixelRatio);
                      }
                      return switchToNativeContext()
                             .then(() => {
                                 let action = new wd.TouchAction(driver);
                                 action.tap({x, y});
                                 if (profile.platformName === "iOS") {
                                     action.release();
                                 }
                                 action.wait({ms:1000});
                                 action.perform()
                             })
                             .then(switchToWebViewContext);
                  });
}

/**
 * Waits for a given amount of time before resolving.
 * 
 * @param {number} ms     The number of milliseconds to wait before resolving
 * @return {Promise}
 */
function wait(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

/**
 * Types some text into an element. The text can be typed in one go, or there
 * can be a delay between each character. This is controlled by `waitBetween`,
 * which defaults to `0` (no delay). 
 * 
 * The delay before any typing starts and how long before the promise resolves
 * is controlled by `waitBefore` and `waitAfter` respectively. These default to
 * 1s. 
 * 
 * @param {Object} el       the element we're sending keys to
 * @param {string} text     The text to send 
 * @param {Object} options  Options
 * @return {Promise}
 */
function sendKeysToElement(el, text, {waitBefore = 1000, waitAfter = 1000, waitBetween = 0} = {}) {
    return wait(waitBefore)
           .then(() => {
               if (waitBetween === 0) {
                    return el.sendKeys(text);
               } else {
                   return text.split("").reduce((p, c) => p.then(() => el.sendKeys(c))
                                                           .then(() => wait(waitBetween)),
                                         wait(waitBetween));
               }
           })
           .then(() => wait(waitAfter));
}

/**
 * Locates an element given the CSS. Verifies existence with an assertion
 * 
 * @param {string} selector    CSS selector to locate
 * @param {number} delay=2000  ms to wait when waiting for elements
 * @return {Promise}           Returns the element if it exists
 */
function elementByCssExists(selector, delay = 2000) {
    return driver.waitForElementByCss(selector, delay)
           .should.eventually.exist;
}

/**
 * Locates an element given the CSS. Verifies if it is displayed with an assertion
 * 
 * @param {string} selector    CSS selector to locate
 * @param {number} delay=2000  ms to wait when waiting for elements
 * @return {Promise}           Returns the element if it is displayed
 */
function elementByCssDisplayed(selector, delay = 2000) {
    return driver.waitForElementByCss(selector, delay)
                 .isDisplayed().should.eventually.equal(true);   
}

/**
 * Tap an element given the CSS. Verifies existence prior to tapping with an assertion
 * 
 * NOTES: WILL BE SLOW ON IOS DUE TO 1s INSTRUMENTS DELAY, WHICH APPIUM
 * CAN'T CORRECT
 * 
 * @param {string} selector    CSS selector to tap
 * @param {number} delay=2000  ms to wait when waiting for elements
 * @return {Promise} 
 */
function tapElementByCss(selector, delay = 2000) {
    return elementByCssExists(selector, delay)
           .then(el => tapElement(el));
}

/**
 * Find an element by CSS, taps it, and then proceeds to type into it. Clears the element first, 
 * in case there is any text already there. If this is not desired, pass `clear: false` to `options`.
 * 
 * @param {string} selector    CSS selector to tap and type into; asserts presence
 * @param {string} strToType   the string to type into the element
 * @param {object} options     Options; will be passed to internal typing function as well
 *                             To specify wait delay, use options.delay = ms
 *                             To set clearing behavior, use options.clear = true|false
 * @return {Promise}
 */
function typeIntoElementByCss(selector, strToType, options = {}) {
    if (options.clear === undefined) {
        options.clear = true;
    }
    if (options.delay === undefined) {
        options.delay = 2000;
    }
    let p = elementByCssExists(selector, options.delay);
    if (options.clear) {
        p = p.clear();
    }
    return p.then(el => tapElement(el))
            .then(() => elementByCssExists(selector, options.delay))
            .then(el => sendKeysToElement(el, strToType, options));
}


module.exports = {
    get driver() {
        return driver;
    },
    should,
    profile,
    switchToContext,
    switchToWebViewContext,
    switchToNativeContext,
    wd,
    tapElement,
    wait,
    sendKeysToElement,
    elementByCssExists,
    elementByCssDisplayed,
    tapElementByCss,
    typeIntoElementByCss
}
