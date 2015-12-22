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
import {getSettings} from "../models/Settings";

const _scrollTop = Symbol("_scrollTop");

export default class SearchViewController extends ViewController {
    constructor({model}={}) {
        super({title: "Search", model, view: createSearchView()});
        this[_scrollTop] = 0;
    }
    get TARGET_SELECTORS() {
        return [
            {selector: "input:label[role='search'] input", emit: "searchChanged"},
            {selector: "tap:.settings-icon", emit: "settingsTapped"},
            {selector: "submit:form", emit: "searchSubmitted"}
        ];
    }
    performSearch(filter) {
        if (filter === "") {
            this.view.clearFilter();
        } else {
            this.view.filter = filter;
        }
        getSettings().lastLemma = filter;
    }
    onSearchChanged(sender, notice, target/*, e*/) {
        let filter = target.value.trim();
        this.performSearch(filter);
    }
    onMenuTapped() {
        GCS.emit("APP:DO:menu");
    }
    onSettingsTapped() {
        GCS.emit("APP:DO:settings");
    }
    onSearchSubmitted(sender, notice, target, evt) {
        evt.preventDefault();
        let focusedElement = document.querySelector(":focus");
        if (focusedElement) {
            focusedElement.blur();
        }
        // in case the filter hasn't been updated properly:
        let inputElement = this.elementTree.querySelector("input");
        if (inputElement) {
            this.performSearch(inputElement.value.trim());
        }
    }
    onDidLeaveByPop() {
        this.destroy();
    }
    onWillLeaveByPush() {
        if (this.view) {
            this[_scrollTop] = this.view.elementTree.scrollTop;
        }
    }
    onDidEnterByPop() {
        if (this.view) {
            setTimeout( () => this.view.elementTree.scrollTop = this[_scrollTop],10);
        }
    }
    template() {
        return h.el("main.SearchViewController y-container?is=y-search-view-controller", [
            navigationBar({contents: [
                widgetGroup({contents: [
                    glyph({icon: "settings", contents: L.T("icon:settings"), title: L.T("general:tap:settings")})
                ], align: "left"}),
                widgetGroup({contents: [
                    h.el("h1?is=y-title", L.T("app:title"))
                ], flex: true}),
                widgetGroup({contents: [
                    h.el("form?method=post&onsubmit=return false;",
                        h.el("label?role=search", [
                            glyph({tag: "div", icon: "search", contents: L.T("icon:search")}),
                            el({tag: "input?type=text&autocapitalize=off&autocorrect=off", value: this.view && this.view.filter})
                        ])
                    )
                ], align: "right"})
            ]}),
            this.renderSubviews()
        ]);
    }
}

export function createSearchViewController(options = {}) {
    return new SearchViewController(options);
}
