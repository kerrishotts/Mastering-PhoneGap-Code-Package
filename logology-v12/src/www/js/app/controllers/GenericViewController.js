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
