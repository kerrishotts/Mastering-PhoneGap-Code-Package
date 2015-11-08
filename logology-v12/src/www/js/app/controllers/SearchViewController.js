"use strict";

import GCS from "$LIB/grandCentralStation";
import ViewController from "$LIB/ViewController";
import {createSearchView} from "$VIEWS/SearchView";

import h from "yasmf-h";
//import el from "../templates/el";
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
        console.log(target.value);
    }
    onMenuTapped() {
        GCS.emit("APP:menu");
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
                        h.el("input?type=text")
                    ])
                ], align:"right"})
            ]}),
            this.renderSubviews()
        ]);
    }
}

export function createSearchViewController(...args) {
    return new SearchViewController(...args);
}
