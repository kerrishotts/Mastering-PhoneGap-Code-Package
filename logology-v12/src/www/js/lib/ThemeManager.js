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
