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
 
 /* @flow */
"use strict";

import Emitter from "yasmf-emitter";

const _current = Symbol(),
      _available = Symbol();

export default class ThemeManager extends Emitter {

    constructor() {
        super();
        this[_current] = null;
        this[_available] = new Set();
    }

    registerTheme(theme/*: Theme*/)/*: void*/ {
        this[_available].add(theme);
    }

    get availableThemes()/*: Array*/ {
        return Array.from(this[_available]);
    }

    getThemeByName(n) {
        let themes = Array.from(this[_available]).filter(theme => theme.name === n);
        return themes[0];
    }

    get currentTheme()/*: Theme*/ {
        return this[_current];
    }
    set currentTheme(v/*: Theme*/) {
        let bodyEl = document.body;
        if (this.currentTheme) {
            bodyEl.classList.remove(this[_current].cssClass);
        }
        this[_current] = v;
        bodyEl.classList.add(v.cssClass);
        this.emit("themeChanged", v);
    }

    destroy()/*: void*/ {
        this[_current] = null;
        this[_available] = null;
        super.destroy();
    }
}

export function createThemeManager(options = {}) {
    return new ThemeManager(options);
}
