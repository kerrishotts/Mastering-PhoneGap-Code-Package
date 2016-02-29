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
 
/* @flow */
"use strict";

import ViewController from "$LIB/ViewController";
import {createMenuView} from "$VIEWS/MenuView";

import navigationBar from "$WIDGETS/bars/navigation";
import widgetGroup from "$WIDGETS/group";
import glyph from "$WIDGETS/glyph";

import GCS from "$LIB/grandCentralStation";

import L from "$APP/localization/localization";

import h from "yasmf-h";

export default class MenuViewController extends ViewController {
    constructor({model} = {}) {
        super({title: "Menu", model, view: createMenuView()});
    }
    get TARGET_SELECTORS() {
        return [
            {selector: "tap:.menu-icon", emit: "menuTapped"}
        ];
    }
    onMenuTapped() {
        GCS.emit("APP:DO:menu");
    }
    template() {
        return h.el("main.MenuViewController y-container?is=menu-view-controller", [
            navigationBar({contents: [
                widgetGroup({contents: [
                    glyph({icon: "menu", contents: L.T("icon:menu"), title: L.T("general:tap-to-hide-the-sidebar")})
                ]}),
                widgetGroup({contents: [
                    h.el("h1?is=y-title", L.T("app:menu-title"))
                ], flex: true})
            ]}),
            this.renderSubviews()
        ]);
    }
}

export function createMenuViewController(options={}) {
    return new MenuViewController(options);
}
