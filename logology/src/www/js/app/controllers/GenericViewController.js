/*****************************************************************************
 *
 * Author: Kerri Shotts <kerrishotts@gmail.com> 
 *         http://www.photokandy.com/books/mastering-phonegap
 *
 * MIT LICENSED
 * 
 * Copyright (c) 2016 Packt Publishing
 * Portions Copyright (c) 2016 Kerri Shotts (photoKandy Studios LLC)
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

import GCS from "$LIB/grandCentralStation";
import ViewController from "$LIB/ViewController";
import {createAboutView} from "$VIEWS/AboutView";

import h from "yasmf-h";
import el from "$LIB/templates/el";
import navigationBar from "$WIDGETS/bars/navigation";
import widgetGroup from "$WIDGETS/group";
import glyph from "$WIDGETS/glyph";

import L from "$APP/localization/localization";

export default class GenericViewController extends ViewController {
    constructor({model, title, view, viewClass}={}) {
        super({title, model, view, tag: viewClass});
    }
    get TARGET_SELECTORS() {
        return [
            {selector: "tap spacepressed:.back-icon", emit: "backTapped"}
        ];
    }
    onBackTapped() {
        GCS.emit("APP:DO:back");
    }
    onDidRemoveFromParent() {
        this.destroy();
    }
    template() {
        let viewClass = this.tag;
        if (!viewClass) {
            viewClass = "Generic";
        }
        let viewClassLower = viewClass.toLowerCase();
        return h.el(`main.${viewClass}ViewController y-container?is=y-${viewClassLower}-view-controller`, [
            navigationBar({contents: [
                widgetGroup({contents: [
                    glyph({icon: "back", contents: L.T("icon:back"), title: L.T("general:tap-to-go-back")})
                ]}),
                widgetGroup({contents: [
                    h.el("h1?is=y-title", L.T(this.title))
                ], flex: true}),
                widgetGroup({contents: [
                ], align: "right"})
            ]}),
            this.renderSubviews()
        ]);
    }
}

export function createGenericViewController(options = {}) {
    return new GenericViewController(options);
}
