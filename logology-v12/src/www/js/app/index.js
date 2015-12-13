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

// inject SVG assets
let SVGInjector = require("svg-injector");

// Need ES6 polyfill as well
import "babel/polyfill";
import once from "once";
import Emitter from "yasmf-emitter";
import h from "yasmf-h";
import GCS from "../lib/grandCentralStation";
import L from "./localization/localization";
import {createSoftKeyboard} from "../lib/SoftKeyboard";
import {createTheme} from "../lib/Theme";
import {createThemeManager} from "../lib/ThemeManager";
import {createNavigationViewController} from "../lib/NavigationViewController";
import {createSplitViewController} from "../lib/SplitViewController";
import {createViewController} from "../lib/ViewController";
import {createDictionaries} from "./models/Dictionaries";
import {createSearchViewController} from "./controllers/SearchViewController";
import {createMenuViewController} from "./controllers/MenuViewController";
import {createAboutViewController} from "./controllers/AboutViewController";
import {createSettingsViewController} from "./controllers/SettingsViewController";
import {createDefinitionViewController} from "./controllers/DefinitionViewController";
import {createNotesViewController} from "./controllers/NotesViewController";
import {createDefinitions} from "./models/Definitions";
import {createNote} from "./models/Note";
import {getFavorites} from "./models/Favorites";
import {getNotes} from "./models/Notes";
import {getSettings} from "./models/settings";
import StarterDictionary from "./models/StarterDictionary";
import XHRDictionary from "./models/XHRDictionary";
import SQLDictionary from "./models/SQLDictionary";
let settings = getSettings();

class App extends Emitter {
    constructor() {
        super();
        let startAppOnce = once(this.start.bind(this));
        document.addEventListener("deviceready", startAppOnce, false);
        document.addEventListener("DOMContentLoaded", () => {
            setTimeout(startAppOnce, 1000);
        }, false);
        GCS.on("APP:startupFailure", this.onStartupFailure, this);

        this.version = "{{{VERSION}}}";
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
        this.themeManager.registerTheme(createTheme());
        this.themeManager.registerTheme(createTheme({name: "Light", cssClass: "theme-light", namespace: "light-"}));
        this.themeManager.registerTheme(createTheme({name: "Dark", cssClass: "theme-dark", namespace: "dark-"}));
        this.themeManager.currentTheme = this.themeManager.getThemeByName("Default");
    }

    configureSoftKeyboard() {
        this.softKeyboard = createSoftKeyboard({selectors: [".ui-scroll-container",
                                                            "[is='y-scroll-container']",
                                                            "y-scroll-container",
                                                            "textarea"]});
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

    viewNotes(lemma) {
        let model = createNote({lemma});
        let nvc = createNotesViewController({model});
        return this.splitViewController.rightView.push(nvc, {animate: false});
    }

    showAbout() {
        let avc = createAboutViewController();
        GCS.emit("APP:DO:menu");
        return this.splitViewController.rightView.push(avc, {animate: false});
    }

    showSettings() {
        let svc = createSettingsViewController();
        GCS.emit("APP:DO:menu");
        return this.splitViewController.rightView.push(svc, {animate: false});
    }

    toggleFavorite(word) {
        let favorites = getFavorites();
        favorites.toggleFavorite(word)
                 .then(() => favorites.isWordAFavorite(word))
                 .then(r => GCS.emit("APP:DID:favDefinition", word, r));
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
            case "favDefinition":
                this.toggleFavorite(data[0]);
                break;
            case "noteDefinition":
                this.viewNotes(data[0]);
                break;
            case "shareDefinition":
                // share definition
                break;
            case "URL":
                this.openURL(data[0]);
                break;
            default:
                console.log(["Couldn't handle a navigation request:", sender, notice, data]);
        }
    }

    applySettings() {
        document.body.style.fontFamily = settings.fontFamily === "default" ? "" : settings.fontFamily;

        Array.from(document.styleSheets).forEach((ss) => {
            if (ss.href && ss.href.indexOf("app.css") > -1) {
                Array.from(ss.rules).forEach((r) => {
                    if (r.selectorText === "html") {
                        r.style.fontSize = settings.fontSize == 0 ? "100%" : `${settings.fontSize}%`;
                    }
                });
            }
        });
        try {
            let theme = this.themeManager.getThemeByName(settings.theme);
            if (!theme) {
                theme = this.themeManager.getThemeByName("Default");
            }
            this.themeManager.currentTheme = theme;
            if (typeof StatusBar !== "undefined") {
                let barColor = {
                    "Default": {color: "#EEAA11", bg: "styleLightContent"},
                    "Light": {color: "#FFFFFF", bg: "styleDefault"},
                    "Dark": {color: "#40566F", bg: "styleLightContent"}
                }
                StatusBar.backgroundColorByHexString(barColor[settings.theme].color);
                StatusBar[barColor[settings.theme].bg]();
            }
        } catch (err) {
            console.log("couldn't change theme to ", settings.theme);
        }

    }

    enableEmitterLog(e) {
        e.on("/.*/", (...args) => console.log(args));
    }

    async configurei18n() {
        // load localization information
        this.locale = await L.loadLocale();
        L.loadTranslations(require("./localization/root/messages"));
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
            this.settings = settings;
            this.applySettings();

            // create dictionaries list
            this.dictionaries = createDictionaries();

            // starter only useful for quick testing
            // this.dictionaries.addDictionary({name: "Starter", Dictionary: StarterDictionary});

            /*
            if (typeof sqlitePlugin !== "undefined") {
               introduced ch8
               this.dictionaries.addDictionary({name: "WordNet - SQL", Dictionary: SQLDictionary, options: {path: "wordnet.db"}});
            } else {
               introduced ch4
            }
            */
            this.dictionaries.addDictionary({name: "WordNet - JSON", Dictionary: XHRDictionary, options: {path: "wordnet.json"}});

            let mvc = createMenuViewController({model: this.dictionaries});
            let rrv = createViewController();
            let nvc = createNavigationViewController({subviews: [rrv]});
            let mvnc = createNavigationViewController({subviews: [mvc]});

            this.splitViewController = createSplitViewController({subviews: [mvnc, nvc], themeManager: this.themeManager, renderElement: rootElement});
            this.splitViewController.visible = true;

            // logging, debug only
            // GCS.on("/.*/", (...args) => console.log(args));

            GCS.on("/APP:DO:.+/", this.handleNavigationRequests, this)

            GCS.on("APP:SETTINGS:changed", this.applySettings, this);

            // tell everyone that the app has started
            GCS.emit("APP:started");
            this.emit("started");

            // and ask the app to go to the last dictionary
            GCS.emit("APP:DO:viewLastDictionary");

            // hide splash screen if visible
            if (typeof navigator !== "undefined") {
                if (navigator.splashscreen) {
                    navigator.splashscreen.hide();
                }
            }
        } catch (err) {
            GCS.emit("APP:startupFailure", err);
            this.emit("startupFailure", err);
        }
    }
}

let app = new App();
export default app;

if (global) {
    global.appVersion = "{{{VERSION}}}";
}
if (window) {
    window.appVersion = "{{{VERSION}}}";
}

