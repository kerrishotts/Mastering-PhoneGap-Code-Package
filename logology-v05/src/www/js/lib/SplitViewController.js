/* @flow */
"use strict";

import ViewController from "./ViewController";
import h from "yasmf-h";

export default class SplitViewController extends ViewController {
    constructor(options = {}) {
        super(options);

    }
    template()/*: Node*/ {
        return h.el("main.SplitViewController?is=y-split-view-controller",
            this.renderSubviews().map( elTree => h.el("div.y-split-view-wrapper?is=y-split-view-wrapper", elTree)));
    }

/// mark: quick view access

    get firstView()/*: View*/ {
        if (this.subviews.length > 0) {
            return this.subviews[0];
        } else {
            return null;
        }
    }

    get secondView()/*: View*/ {
        if (this.subviews.length > 1) {
            return this.subviews[1];
        } else {
            return null;
        }
    }

    get masterView()/*: View*/ { return this.firstView; }
    get detailView()/*: View*/ { return this.secondView; }
    get leftView()/*: View*/ { return this.firstView; }
    get rightView()/*: View*/ { return this.secondView; }

// mark: view management

    addSubview(v/*: View*/)/*: void*/ {
        if (this.subviews.length < 2) {
            super.addSubview(v);
        } else {
            throw new Error("Split views only support two subviews.");
        }
    }

// mark: split management

    showSidebar() {
        if (this.themeManager && this.themeManager.currentTheme) {
            return this.themeManager.currentTheme.animateSplitViewSidebarEnter(this.elementTree);
        } else {
            return Promise.reject("No theme manager, or no current theme. Can't show sidebar.");
        }
    }

    hideSidebar() {
        if (this.themeManager && this.themeManager.currentTheme) {
            return this.themeManager.currentTheme.animateSplitViewSidebarLeave(this.elementTree);
        } else {
            return Promise.reject("No theme manager, or no current theme. Can't hide sidebar.");
        }
    }

    get sidebarVisible() {

    }

}
