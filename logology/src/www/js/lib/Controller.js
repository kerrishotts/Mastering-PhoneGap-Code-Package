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
