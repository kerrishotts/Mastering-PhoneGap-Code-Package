"use strict";

import Controller from "./Controller";
import View from "./View";

import h from "yasmf-h";

// private properties
const _controller = Symbol();

export default class ViewController extends View {
    constructor(options = {}) {
        super(options);
        let {view} = options;
        this[_controller] = new Controller(options);
        if (view) { this.addSubview(view); }
    }

    template() {
        return h.el("main.ViewController y-container?is=y-view-controller",
                    this.renderSubviews());
    }

    get controller() {
        return this[_controller];
    }
    get model() {
        return this.controller && this.controller.model;
    }
    get view() {
        return this.controller && this.controller.view;
    }

    destroy() {
        if (this.controller) {
            this.controller.destroy();
        }
        this[_controller] = null;
        super.destroy();
    }

}
