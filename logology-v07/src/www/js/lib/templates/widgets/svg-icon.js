"use strict";
let svgNS = "http://www.w3.org/2000/svg",
    xlinkNS = "http://www.w3.org/1999/xlink";

const ICONMAP = {
    "arrow-up": "arrow-top",
    "arrow-down": "arrow-bottom",
    "back": "chevron-left",
    "caret-up": "caret-top",
    "caret-down": "caret-bottom",
    "chevron-up": "chevron-top",
    "chevron-down": "chevron-bottom",
    "data-list": "list",
    "list-indicator": "chevron-right",
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
    "trash": "trash"
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
