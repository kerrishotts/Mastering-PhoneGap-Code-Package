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
 * @param {string} str
 * @return {context}
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

function switchToWebViewContext() {
    return switchToContext("WEBVIEW");
}

function switchToNativeContext() {
    return switchToContext("NATIVE");
}

before(function() {
    this.timeout(30000);
    driver = wd.promiseChainRemote(serverConfig);
    configureLogging();
    driver = driver.init(profile);
    return switchToWebViewContext();
});

after(function() {
    this.timeout(30000);
    return driver.quit();       // clean up!
});

module.exports = {
    get driver() {
        return driver;
    },
    should,
    profile,
    switchToContext,
    switchToWebViewContext,
    switchToNativeContext,
    wd
}
