"use strict";
import Emitter from "yasmf-emitter";
import GCS from "../../lib/grandCentralStation";

// private property symbols
let _fontFamily = Symbol(), // font family
    _fontSize = Symbol(),   // 0 = use system default, otherwise specific point sizes
    _theme = Symbol(),      // light, dark, lightHighContrast, etc.
    _externalResources = Symbol(), // link templates to external resources, like Wikipedia
    _showImages = Symbol(); // determines if images are shown (if possible)

export default class Settings extends Emitter {
    constructor() {
        super();
        this[_fontFamily] = undefined; // undefined will use app default
        this[_fontSize] = 0;           // 0 will use app default (from system)
        this[_theme] = "light";
        this[_showImages] = true;
        this[_externalResources] = {
            "Wikipedia": "http://www.wikipedia.org/search-redirect.php?language=en&search=%WORD%",
            "WordNet": "http://wordnetweb.princeton.edu/perl/webwn?s=%WORD%"
        };
    }

    init() {
        super.init();
        this.retrieveSettings();
    }

    _emitChangeNotice(notice, newV, oldV) {
        this.emit(notice + "Changed", newV, oldV);
        this.emit("settingsChanged");
    }

    retrieveSettings() {
        if (localStorage.fontFamily !== undefined) { this[_fontFamily] = localStorage.fontFamily; }
        if (localStorage.fontSize !== undefined) { this[_fontSize] = localStorage.fontSize; }
        if (localStorage.theme !== undefined) { this[_theme] = localStorage.theme; }
        if (localStorage.showImages !== undefined) { this[_showImages] = localStorage.showImages; }
        if (localStorage.externalResources !== undefined) { this[_externalResources] = localStorage.externalResources; }
        this.emit("settingsRetrieved");
        GCS.emit("APP:SETTINGS:loaded");
        this.emit("settingsChanged"); // this will save the settings again, but that's OK
    }

    persistSettings() {
        localStorage.fontFamily = this.fontFamily;
        localStorage.fontSize = this.fontSize;
        localStorage.theme = this.theme;
        localStorage.showImages = this.showImages;
        localStorage.externalResources = this._externalResources;
        this.emit("settingsPersisted");
        GCS.emit("APP:SETTINGS:persisted");
    }

    onSettingsChanged() {
        GCS.emit("APP:SETTINGS:changed");
        // save the settings whenever they change
        this.persistSettings();
    }

    get fontFamily() { return this[_fontFamily]; }
    set fontFamily(v) {
        this._emitChangeNotice("fontFamily", v, this[_fontFamily]);
        this[_fontFamily] = v;
    }

    get fontSize() { return this[_fontSize]; }
    set fontSize(v) {
        this._emitChangeNotice("fontSize", v, this[_fontFamily]);
        this[_fontSize] = v;
    }

    get theme() { return this[_theme]; }
    set theme(v) {
        this._emitChangeNotice("theme", v, this[_theme]);
        this[_theme] = v;
    }

    get showImages() { return this[_showImages]; }
    set showImages(v) {
        this._emitChangeNotice("showImages", v, this[_showImages]);
        this[_showImages] = v;
    }

    get externalResources() { return this[_externalResources]; }

    addExternalResource({name, template}) {
        this._emitChangeNotice("externalResources");
        this[_externalResources][name] = template;
    }
    removeExternalResource(name) {
        this[_externalResources][name] = undefined;
    }
}

export function createSettings(...args) {
    return new Settings(...args);
}

