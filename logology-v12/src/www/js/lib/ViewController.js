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

export function createViewController(options = {}) {
    return new ViewController(options);
}
