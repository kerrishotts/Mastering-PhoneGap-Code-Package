"use strict";

import GCS from "$LIB/grandCentralStation";
import ViewController from "$LIB/ViewController";
import {createSearchView} from "$VIEWS/SearchView";

import h from "yasmf-h";
import el from "$LIB/templates/el";
import navigationBar from "$WIDGETS/bars/navigation";
import widgetGroup from "$WIDGETS/group";
import glyph from "$WIDGETS/glyph";

import L from "$APP/localization/localization";

export default class SearchViewController extends ViewController {
    constructor({model}={}) {
        super({title: "Search", model, view: createSearchView()});
    }
    get TARGET_SELECTORS() {
        return [
            {selector: "input:label[role='search'] input", emit: "searchChanged"},
            {selector: "tap:.menu-icon", emit: "menuTapped"}
        ];
    }
    onSearchChanged(sender, notice, target/*, e*/) {
        let filter = target.value.trim();
        if (filter === "") {
            this.view.clearFilter();
        } else {
            this.view.filter = target.value;
        }
    }
    onMenuTapped() {
        GCS.emit("APP:DO:menu");
    }
    onDidRemoveFromParent() {
        this.destroy();
    }
    template() {
        return h.el("main.SearchViewController y-container?is=y-search-view-controller", [
            navigationBar({contents:[
                widgetGroup({contents:[
                    glyph({icon:"menu", contents: L.T("icon:menu"), title: L.T("general:tap-to-reveal-the-sidebar")})
                ]}),
                widgetGroup({contents:[
                    h.el("h1?is=y-title", L.T("app:title"))
                ], flex: true}),
                widgetGroup({contents:[
                    h.el("label?role=search", [
                        glyph({tag:"div", icon:"search", contents: L.T("icon:search")}),
                        el({tag:"input?type=text&autocapitalize=off&autocorrect=off", value: this.view && this.view.filter})
                    ])
                ], align:"right"})
            ]}),
            this.renderSubviews()
        ]);
    }
}

export function createSearchViewController(options = {}) {
    return new SearchViewController(options);
}
