"use strict";
import Emitter from "yasmf-emitter";
import GCS from "../../lib/grandCentralStation";

// private property symbols
let _fontFamily = Symbol("fontFamily"), // font family
    _fontSize = Symbol("fontSize"),   // 0 = use system default, otherwise specific point sizes
    _theme = Symbol("theme"),      // light, dark, lightHighContrast, etc.
    _externalResources = Symbol("externalResources"), // link templates to external resources, like Wikipedia
    _showImages = Symbol("images"), // determines if images are shown (if possible)
    _lastDictionary = Symbol("lastDictionary"), // records the last dictionary
    _pageSize = Symbol("pageSize"),   // page length (search results, etc.)
    _localStorage = Symbol("_localStorage"); // for testing

export default class Settings extends Emitter {
    constructor({localStorage} = {}) {
        super();
        this[_fontFamily] = "default"; // will just use the default font family
        this[_fontSize] = 0;           // 0 will use app default (from system)
        this[_theme] = "Default";      // default theme
        this[_showImages] = true;      // not currently used
        this[_pageSize] = 100;         // search result limit
        this[_lastDictionary] = undefined; // if undefined, the app will pick the first one
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

    get localStorage() {
        return this[_localStorage] ? this[_localStorage] : (typeof localStorage !== "undefined" ? localStorage : {});
    }

    get entries() {
        return [
            {name: "setting:font-family", key: "fontFamily", value: this.fontFamily, type: "select", options: [
                {name: "setting:font-family:Default", value: "default"},
                {name: "setting:font-family:Helvetica-Neue", value: "HelveticaNeue, 'Helvetica Neue', Helvetica, Arial, sans-serif"},
                {name: "setting:font-family:Lucida-Grande", value: "'Lucida Sans Unicode', 'Lucida Grande', sans-serif"},
                {name: "setting:font-family:Georgia", value: "Georgia, serif"},
                {name: "setting:font-family:Palatino", value: "'Palatino Linotype', 'Book Antiqua', Palatino, serif"},
                {name: "setting:font-family:Times-New-Roman", value: "'Times New Roman', Times, serif"}
            ]},
            {name: "setting:font-size",   key: "fontSize", value: this.fontSize, type: "select", options: [
                {name: "setting:font-size:Default", value: 0},
                {name: "setting:font-size:Tiny", value: 50},
                {name: "setting:font-size:Small", value: 75},
                {name: "setting:font-size:Normal", value: 100},
                {name: "setting:font-size:Large", value: 125},
                {name: "setting:font-size:Huge", value: 150},
                {name: "setting:font-size:Gigantic", value: 250}
            ]},
            {name: "setting:theme", key: "theme", value: this.theme, type: "select", options: [
                {name: "setting:theme:Default", value: "Default"},
                {name: "setting:theme:Light", value: "Light"},
                {name: "setting:theme:Dark", value: "Dark"}
            ]},
            {name: "setting:page-size", key: "pageSize", value: this.pageSize, type: "select", options: [
                {name: "setting:page-size:20", value: 25},
                {name: "setting:page-size:50", value: 50},
                {name: "setting:page-size:80", value: 80},
                {name: "setting:page-size:100", value: 100},
                {name: "setting:page-size:150", value: 150},
                {name: "setting:page-size:200", value: 200}
            ]}
        ];
    }

    retrieveSettings() {
        const storage = this.localStorage;
        if (storage.fontFamily !== undefined) { this[_fontFamily] = storage.fontFamily; }
        if (storage.fontSize !== undefined) { this[_fontSize] = storage.fontSize; }
        if (storage.theme !== undefined) { this[_theme] = storage.theme; }
        if (storage.showImages !== undefined) { this[_showImages] = storage.showImages; }
        if (storage.externalResources !== undefined) { this[_externalResources] = JSON.parse(storage.externalResources); }
        if (storage.pageSize !== undefined) { this[_pageSize] = storage.pageSize; }
        if (storage.lastDictionary !== undefined) { this[_lastDictionary] = storage.lastDictionary; }
        this.emit("settingsRetrieved");
        GCS.emit("APP:SETTINGS:loaded");
        this.emit("settingsChanged"); // this will save the settings again, but that's OK
    }

    persistSettings() {
        const storage = this.localStorage;
        if (this.fontFamily !== undefined) { storage.fontFamily = this.fontFamily; }
        if (this.fontSize !== undefined) { storage.fontSize = this.fontSize; }
        if (this.theme !== undefined) { storage.theme = this.theme; }
        if (this.showImages !== undefined) { storage.showImages = this.showImages; }
        storage.externalResources = JSON.stringify(this.externalResources);
        if (this.pageSize !== undefined) { storage.pageSize = this.pageSize; }
        if (this.lastDictionary !== undefined) { storage.lastDictionary = this.lastDictionary; }
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

    get pageSize() { return this[_pageSize]; }
    set pageSize(s) {
        this._emitChangeNotice("pageSize", s, this[_pageSize]);
        this[_pageSize] = s;
    }

    get lastDictionary() { return this[_lastDictionary]; }
    set lastDictionary(d) {
        this._emitChangeNotice("lastDictionary", d, this[_lastDictionary]);
        this[_lastDictionary] = d;
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

let settings;
export function getSettings() {
    if (!settings) {
        settings = createSettings();
        settings.retrieveSettings();
    }
    return settings;
}

