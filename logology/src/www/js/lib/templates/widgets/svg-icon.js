/*****************************************************************************
 *
 * Author: Kerri Shotts <kerrishotts@gmail.com> 
 *         http://www.photokandy.com/books/mastering-phonegap
 *
 * MIT LICENSED
 * 
 * Copyright (c) 2016 Kerri Shotts (photoKandy Studios LLC)
 * Portions Copyright various third parties where noted.
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
 
 "use strict";
let svgNS = "http://www.w3.org/2000/svg",
    xlinkNS = "http://www.w3.org/1999/xlink";

const ICONMAP = {
    "arrow-up": "arrow-top",
    "arrow-down": "arrow-bottom",
    "back": "arrow-thick-left",
    "bookmark": "bookmark",
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
    "favorite": "heart",
    "fav": "heart",
    "gear": "cog",
    "history": "clock",
    "home": "home",
    "list-indicator": "chevron-right",
    "info": "info",
    "menu": "menu",
    "note": "pencil",
    "navicon": "menu",
    "search": "magnifying-glass",
    "settings": "cog",
    "share": "share-boxed",
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
