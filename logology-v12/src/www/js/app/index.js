/*****************************************************************************
 *
 * Logology V{{{VERSION}}}
 * Author: {{{AUTHOR.NAME}}} <{{{AUTHOR.EMAIL}}}> <{{{AUTHOR.SITE}}}>
 *
 * This is a very simple demonstration of using gulp + ES6; it obviously
 * doesn't do anything resembling the goal of the app yet.
 *
 *****************************************************************************/

/*globals MobileAccessibility, setImmediate*/

require("whatwg-fetch");

import "babel/polyfill";

import h from "yasmf-h";

import once from "once";

import Emitter from "yasmf-emitter";
import GCS from "$LIB/grandCentralStation";
import {createSoftKeyboard} from "$LIB/SoftKeyboard";
import L from "./localization/localization";

import {createTheme} from "$LIB/Theme";
import {createThemeManager} from "$LIB/ThemeManager";

import {createNavigationViewController} from "$LIB/NavigationViewController";
import {createSplitViewController} from "$LIB/SplitViewController";

import {createSettings} from "$MODELS/Settings";
import {createDictionaries} from "$MODELS/Dictionaries";

import StarterDictionary from "$MODELS/StarterDictionary";
import XHRDictionary from "$MODELS/XHRDictionary";

let SVGInjector = require("svg-injector");
/*
function simpleAlert() {
    let outerDiv = document.createElement("div"),
        innerDiv = document.createElement("div"),
        titleEl  = document.createElement("h1"),
        messageEl =  document.createElement("p"),
        buttonEl = document.createElement("button"),
        mainWindow = document.getElementById("mainWindow");
    outerDiv.setAttribute("is", "y-alert-container");
    innerDiv.setAttribute("is", "y-alert-dialog");
    titleEl.textContent = "Important!";
    messageEl.textContent = "This is an important message. Close this by tapping OK.";
    buttonEl.textContent = "OK";

    // accessibility
    innerDiv.setAttribute("role", "alertdialog");
    messageEl.setAttribute("role", "alert");

    // create the dom structure
    outerDiv.appendChild(innerDiv);
    innerDiv.appendChild(titleEl);
    innerDiv.appendChild(messageEl);
    innerDiv.appendChild(buttonEl);

    document.body.appendChild(outerDiv);
    setTimeout(function () {
      outerDiv.classList.add("visible");
      mainWindow.setAttribute("aria-hidden", true);
      buttonEl.focus();
    }, 0);

    buttonEl.addEventListener("click", function() {
        outerDiv.classList.remove("visible");
        setTimeout(function() {
          mainWindow.removeAttribute("aria-hidden");
          document.body.removeChild(outerDiv);
        }, 400);
    }, false);
}
*/

import {createSearchViewController} from "$CONTROLLERS/SearchViewController";
import {createMenuViewController} from "$CONTROLLERS/MenuViewController";

class App extends Emitter {
    constructor() {
        super();
        let startAppOnce = once(this.start.bind(this));
        document.addEventListener("deviceready", startAppOnce, false);
        document.addEventListener("DOMContentLoaded", () => {
            setTimeout(startAppOnce, 1000);
        }, false);
        GCS.on("APP:startupFailure", this.onStartupFailure, this);

        // DEBUG: debugging only
        this.GCS = GCS;
    }

    onStartupFailure(sender, notice, err) {
        console.log(`Startup failure ${err}`);
    }

    configureSVGIcons() {
        let injectSVGs = document.querySelectorAll("img.inject-svg");
        SVGInjector(injectSVGs);
    }

    configureAccessibility() {
        // zoom our text for accessibility
        if (typeof MobileAccessibility !== "undefined") {
            MobileAccessibility.usePreferredTextZoom(true);
        }
    }

    async configurei18n() {
        // load localization information
        this.locale = await L.loadLocale();
        this.L = L; // DEBUG: testing only
        L.loadTranslations(require("./localization/root/messages"));
    }

    configureTheme() {
        // load theme
        this.themeManager = createThemeManager();
        this.themeManager.currentTheme = createTheme();
    }

    configureSoftKeyboard() {
        this.softKeyboard = createSoftKeyboard({selectors: [".ui-scroll-container",
                                                            "[is='y-scroll-container']",
                                                            "y-scroll-container"]});
    }

    handleNavigationRequests(sender, notice, ...data) {
        // notice will be of the form APP:DO:command
        let [, , command] = notice.split(":");
        switch (command) {
            case "menu":
                this.splitViewController.toggleSidebar();
                break;
            default:
                console.log(["Couldn't handle a navigation request:", sender, notice, data]);
        }
    }

    async start() {

        try {
            let rootElement = document.getElementById("rootContainer");

            this.configureAccessibility();
            this.configureTheme();
            this.configureSoftKeyboard();
            this.configureSVGIcons();

            await this.configurei18n();

            // load settings
            this.settings = createSettings();

            // create dictionaries list
            this.dictionaries = createDictionaries();
            this.dictionaries.addDictionary({name: "Starter", Dictionary: StarterDictionary});
            this.dictionaries.addDictionary({name: "WordNet - JSON", Dictionary: XHRDictionary, options: {path: "wordnet.json"}});

            let starterDictionary = await this.dictionaries.getDictionaryInstance({name: "Starter"});
            let wnjDictionary = await this.dictionaries.getDictionaryInstance({name: "WordNet - JSON"});

            let svc = createSearchViewController({model: wnjDictionary});
            let mvc = createMenuViewController({model: this.dictionaries});
            //this.searchViewController2 = createSearchViewController({model: starterDictionary});

            let nvc = createNavigationViewController({subviews: [svc]});

            this.splitViewController = createSplitViewController( {subviews: [mvc, nvc], themeManager: this.themeManager, renderElement: rootElement});
            this.splitViewController.visible = true;

            // logging
            GCS.on("/.*/", (...args) => console.log(args));

            GCS.on("/APP:DO:.+/", this.handleNavigationRequests, this)

            // tell everyone that the app has started
            GCS.emit("APP:started");
            this.emit("started");
        } catch (err) {
            GCS.emit("APP:startupFailure", err);
            this.emit("startupFailure", err);
        }
    }
}

let app = new App();
export default app;
