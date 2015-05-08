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

import "babel/polyfill";
import h from "yasmf-h";
import Emitter from "yasmf-emitter";
import GCS from "../lib/grandCentralStation";
import SoftKeyboard from "../lib/SoftKeyboard";
import L from "./localization/localization";
import Settings from "./models/Settings";
import Dictionaries from "./models/Dictionaries";
import StarterDictionary from "./models/StarterDictionary";
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

import SearchViewController from "./controllers/SearchViewController";

class App extends Emitter {
    init() {
        //document.addEventListener("deviceready", this.start.bind(this), false);
        document.addEventListener("DOMContentLoaded", this.start.bind(this), false);
        this.GCS = GCS;
        GCS.on("APP:startupFailure", this.onStartupFailure, this);
    }

    onStartupFailure(sender, notice, err) {
        console.log(`Startup failure ${err}`);
    }

    async start() {

//        try {

            // zoom our text for accessibility
            if (typeof MobileAccessibility !== "undefined") {
                MobileAccessibility.usePreferredTextZoom(true);
            }

            // load localization information
            let locale = await L.loadLocale();
            this.locale = locale;
            this.L = L;
            L.loadTranslations(require("./localization/root/messages"));

            // load settings
            this.settings = new Settings();

            // create dictionaries list
            this.dictionaries = new Dictionaries();
            this.dictionaries.addDictionary(StarterDictionary);

            this.searchViewController = new SearchViewController({model: new StarterDictionary()});
            this.searchViewController.renderElement = document.getElementById("mainWindow");

            // tell everyone that the app has started
            GCS.emit("APP:started");
            this.emit("started");
 /*       } catch (err) {
            GCS.emit("APP:startupFailure", err);
            this.emit("startupFailure", err);
        }*/

        //document.querySelector("[is='y-menu-glyph']").addEventListener("click", simpleAlert, false);
        //let softKeyboard = new SoftKeyboard({selectors: [".ui-scroll-container", "[is='y-scroll-container']", "y-scroll-container"]});
    }
}

let app = new App();
export default app;


