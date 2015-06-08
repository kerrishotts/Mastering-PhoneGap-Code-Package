"use strict";

import ViewController from "../../lib/ViewController";
import SearchView from "../views/SearchView";

import h from "yasmf-h";
//import el from "../templates/el";
import navigationBar from "../templates/widgets/bars/navigation";
import widgetGroup from "../templates/widgets/group";
import glyph from "../templates/widgets/glyph";

import L from "../localization/localization";

export default class SearchViewController extends ViewController {
    constructor({model}={}) {
        super({title: "Search", model, view: new SearchView()});
    }
    get TARGET_SELECTORS() {
        return [
            {selector: "input:label[role='search'] input", emit: "searchChanged"}
        ];
    }
    onSearchChanged(sender, notice, target/*, e*/) {
        console.log(target.value);
    }
    template() {
        return h.el("main.SearchViewController?is=y-search-view-controller", [
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
