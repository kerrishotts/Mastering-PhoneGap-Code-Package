"use strict";
let svgNS = "http://www.w3.org/2000/svg",
    xlinkNS = "http://www.w3.org/1999/xlink";

const ICONMAP = {
    "arrow-up": "arrow-top",
    "arrow-down": "arrow-bottom",
//    "back": "chevron-left",
    "back": "arrow-thick-left",
    "caret-up": "caret-top",
    "caret-down": "caret-bottom",
    "check": "check",
    "checked": "check",
    "checkmark": "check",
    "chevron-up": "chevron-top",
    "chevron-down": "chevron-bottom",
    "clock": "clock",
    "cog": "cog",
    "data-list": "list",
    "gear": "cog",
    "history": "clock",
    "list-indicator": "chevron-right",
    "info": "info",
    "menu": "menu",
    "navicon": "menu",
    "search": "magnifying-glass",
    "share": "share-boxed",
    "bookmark": "bookmark",
    "favorite": "heart",
    "fav": "heart",
    "clock": "clock",
    "history": "clock",
    "home": "home",
    "note": "pencil",
    "trash": "trash",
    "settings": "cog"
};

module.exports.svgIcon = function svgIcon(glyph, text) {
    let svgWrapper = document.createElementNS(svgNS, "svg");
    let svgIconEl = document.createElementNS(svgNS, "use");
    let glyphMap = ICONMAP[glyph];
    if (glyphMap) {
        svgIconEl.setAttributeNS(xlinkNS, "xlink:href", `#${glyphMap}`);
        svgWrapper.appendChild(svgIconEl);
    } else {
        if (text) {
            let svgTextEl = document.createElement("span");
            svgTextEl.textContent = text;
            return svgTextEl;
        }
    }
    return svgWrapper;
}
