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

import Emitter from "yasmf-emitter";

// private symbols
let _model = Symbol(),
    _view = Symbol();

let MODEL_CHANGED_REGEXP = "/model\\:changed\\:.*/",
    VIEW_USER_REGEXP = "/user\\:.*/";

export default class Controller extends Emitter {
    constructor({model, view} = {}) {
        super();
        this[_model] = null;
        this[_view] = null;

        if (model) {
            this.model = model;
        }

        if (view) {
            this.view = view;
        }
    }

    get model() {
        return this[_model];
    }

    set model(m) {
        if (this[_model] !== m) {
            if (this[_model]) {
                this[_model].off(MODEL_CHANGED_REGEXP, this);
                this[_model].controller = null;
                this[_model] = null;
            }
            this[_model] = m;
            if (m) {
                m.controller = this;
                m.on(MODEL_CHANGED_REGEXP, (...args) => this.emit("model:changed", ...args), this);
            }
        }
    }

    get view() {
        return this[_view];
    }

    set view(v) {
        if (this[_view] !== v) {
            if (this[_view]) {
                this[_view].off(MODEL_CHANGED_REGEXP, this);
                this[_view].controller = null;
                this[_view] = null;
            }
            this[_view] = v;
            if (v) {
                v.controller = this;
                v.on(VIEW_USER_REGEXP, (...args) => this.emit("view:updated", ...args), this);
            }
        }
    }

    destroy() {
        this.model = null;
        this.view = null;
        super.destroy();
    }

    onModel_changed(sender, notice, model, modelNotice, ...args) {
        if (this[_model]) {
            this.emit("view:render", model, modelNotice, ...args);
        }
    }
    onModel_update(sender, notice, view, viewNotice, ...args) {
        if (this[_model]) {
            this[_model].emit("view:updated", view, viewNotice, ...args);
        }
    }
    onView_updated(sender, notice, view, viewNotice, ...args) {
        this.emit("model:update", view, viewNotice, ...args);
    }
    onView_render(sender, notice, model, modelNotice, ...args) {
        if (this[_view]) {
            this[_view].emit("render", model, modelNotice, ...args);
        }
    }
}

export function createController(options = {}) {
    return new Controller(options = {});
}
