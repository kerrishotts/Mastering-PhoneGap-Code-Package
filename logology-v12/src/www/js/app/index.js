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

// we need to use the Fetch API (replaces XHR), but not available in all
// instances, so we use a polyfill
require("whatwg-fetch");

// Need ES6 polyfill as well
import "babel/polyfill";

import once from "once";

import Emitter from "yasmf-emitter";
import h from "yasmf-h";

import GCS from "$LIB/grandCentralStation";
import {createSoftKeyboard} from "$LIB/SoftKeyboard";
import L from "./localization/localization";

import {createTheme} from "$LIB/Theme";
import {createThemeManager} from "$LIB/ThemeManager";

import {createNavigationViewController} from "$LIB/NavigationViewController";
import {createSplitViewController} from "$LIB/SplitViewController";
import {createViewController} from "$LIB/ViewController";

import {settings} from "$MODELS/Settings";
import {createDictionaries} from "$MODELS/Dictionaries";

import StarterDictionary from "$MODELS/StarterDictionary";
import XHRDictionary from "$MODELS/XHRDictionary";
import SQLDictionary from "$MODELS/SQLDictionary";

let SVGInjector = require("svg-injector");

import {createSearchViewController} from "$CONTROLLERS/SearchViewController";
import {createMenuViewController} from "$CONTROLLERS/MenuViewController";
import {createAboutViewController} from "$CONTROLLERS/AboutViewController";
import {createSettingsViewController} from "$CONTROLLERS/SettingsViewController";
import {createDefinitionViewController} from "$CONTROLLERS/DefinitionViewController";
import {createDefinitions} from "$MODELS/Definitions";


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

    viewLastDictionary() {
        let lastDictionary = this.settings.lastDictionary;
        if (lastDictionary) {
            GCS.emit("APP:DO:viewDictionary", lastDictionary);
        } else {
            // navigate to the first available dictionary
            GCS.emit("APP:DO:viewDictionary", this.dictionaries.dictionaries[0]);
        }
    }

    viewDictionary(dictionaryName) {
        // get an associated instance
        return this.dictionaries.getDictionaryInstance({name: dictionaryName})
                   .then(dictionary => {
                       this.settings.lastDictionary = dictionaryName;
                       let svc = createSearchViewController({model: dictionary});
                       this.splitViewController.rightView.popToRoot()
                           .then(() => this.splitViewController.rightView.push(svc, {animate: false}));
                   });
    }

    viewDefinition(lemma) {
        let definitions = [];
        return this.dictionaries.getDictionaryInstance({name: this.settings.lastDictionary})
                   .then(dictionary => {
                       let model = createDefinitions({dictionary, lemma});
                       let dvc = createDefinitionViewController({model});
                       return this.splitViewController.rightView.push(dvc, {animate: false});
                   });
    }

    showAbout() {
        let avc = createAboutViewController();
        GCS.emit("APP:DO:menu");
        return this.splitViewController.rightView.push(avc, {animate:false});
    }

    showSettings() {
        let svc = createSettingsViewController();
        GCS.emit("APP:DO:menu");
        return this.splitViewController.rightView.push(svc, {animate:false});
    }

    openURL(url) {
        function continueOpen() {
            if (typeof cordova !== "undefined" && cordova.inAppBrowser) {
                cordova.inAppBrowser.open(url, "_blank", `location=no,closebuttoncaption=${L.T("browser:done")}`);
            } else {
                window.open(url, '_blank', 'location=yes');
            }
        }
        // can we use the Safari View Controller?
        if (typeof SafariViewController !== "undefined") {
            SafariViewController.isAvailable(available => {
                if (available) {
                    SafariViewController.show({url});
                } else {
                    continueOpen();
                }
            });
        } else {
            continueOpen();
        }
    }

    handleNavigationRequests(sender, notice, ...data) {
        // notice will be of the form APP:DO:command
        let [, , command] = notice.split(":");
        switch (command) {
            case "menu":
                this.splitViewController.toggleSidebar({animate: false});
                break;
            case "back":
                this.splitViewController.rightView.pop({animate: false});
                break;
            case "menuBack":
                this.splitViewController.leftView.pop({animate: false});
                break;
            case "about":
                this.showAbout();
                break;
            case "settings":
                this.showSettings();
                break;
            case "viewDictionary":
                this.viewDictionary(data[0]);
                break;
            case "viewLastDictionary":
                this.viewLastDictionary();
                break;
            case "viewDefinition":
                this.viewDefinition(data[0]);
                break;
            case "URL":
                this.openURL(data[0]);
                break;
            default:
                console.log(["Couldn't handle a navigation request:", sender, notice, data]);
        }
    }

    enableEmitterLog(e) {
        e.on("/.*/", (...args) => console.log(args));
    }

    async configurei18n() {
        // load localization information
        this.locale = await L.loadLocale();
        this.L = L; // DEBUG: testing only
        L.loadTranslations(require("./localization/root/messages"));
    }

    async start() {

        try {
            this.h = h;
//            h.useDomMerging = true;

            let rootElement = document.getElementById("rootContainer");

            this.configureAccessibility();
            this.configureTheme();
            this.configureSoftKeyboard();
            this.configureSVGIcons();

            await this.configurei18n();

            // load settings
            this.settings = settings;


            // create dictionaries list
            this.dictionaries = createDictionaries();
            this.dictionaries.addDictionary({name: "Starter", Dictionary: StarterDictionary});
            this.dictionaries.addDictionary({name: "WordNet - JSON", Dictionary: XHRDictionary, options: {path: "wordnet.json"}});
            this.dictionaries.addDictionary({name: "WordNet - SQL", Dictionary: SQLDictionary, options: {path: "wordnet.db"}});

            let mvc = createMenuViewController({model: this.dictionaries});
            let rrv = createViewController();
            let nvc = createNavigationViewController({subviews: [rrv]});
            let mvnc = createNavigationViewController({subviews: [mvc]});

            this.splitViewController = createSplitViewController( {subviews: [mvnc, nvc], themeManager: this.themeManager, renderElement: rootElement});
            this.splitViewController.visible = true;

            // logging
            GCS.on("/.*/", (...args) => console.log(args));

            GCS.on("/APP:DO:.+/", this.handleNavigationRequests, this)

            // tell everyone that the app has started
            GCS.emit("APP:started");
            this.emit("started");

            // and ask the app to go to the last dictionary
            GCS.emit("APP:DO:viewLastDictionary");
        } catch (err) {
            GCS.emit("APP:startupFailure", err);
            this.emit("startupFailure", err);
        }
    }
}

let app = new App();
export default app;

