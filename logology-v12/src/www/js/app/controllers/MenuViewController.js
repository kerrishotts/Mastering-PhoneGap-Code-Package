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
            {selector: "tap:.back-icon", emit: "menuTapped"}
        ];
    }
    onMenuTapped() {
        GCS.emit("APP:DO:menu");
    }
    template() {
        return h.el("main.MenuViewController y-container?is=menu-view-controller", [
            navigationBar({contents:[
                widgetGroup({contents:[
                    glyph({icon:"back", contents: L.T("icon:back"), title: L.T("general:tap-to-hide-the-sidebar")})
                ]}),
                widgetGroup({contents:[
                    h.el("h1?is=y-title", L.T("app:menu-title"))
                ], flex: true})
            ]}),
            this.renderSubviews()
        ]);
    }
}

export function createMenuViewController(...args) {
    return new MenuViewController(...args);
}
