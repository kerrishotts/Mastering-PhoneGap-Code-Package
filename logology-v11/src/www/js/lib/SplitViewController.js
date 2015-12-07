/* @flow */
"use strict";

import ViewController from "./ViewController";
import h from "yasmf-h";

export default class SplitViewController extends ViewController {
    constructor(options = {}) {
        super(options);

        // if we have a sidebar, it should be invisible at the start.
        if (this.firstView) {
            this.firstView.visible = false;
            this.firstView.displayed = false;
        }
    }

    template()/*: Node*/ {
        let visibleClass, invisibleClass;
        if (this.themeManager && this.themeManager.currentTheme) {
            visibleClass = this.themeManager.currentTheme.CLASS_VIEW_DISPLAYED;
            invisibleClass = this.themeManager.currentTheme.CLASS_VIEW_NOT_DISPLAYED;
        }
        return h.el("main.SplitViewController?is=y-split-view-controller",
            this.renderSubviews().map( elTree => h.el("div.y-split-view-wrapper?is=y-split-view-wrapper", {
                attrs: {
                    class: elTree.classList.contains(visibleClass) ? visibleClass : invisibleClass
                }
            }, elTree)));
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
            if (this.subviews.length === 1) {
                // we just added the side bar
                // we need to listen to it for display values
                v.on("displayChanged", (...args) => this.sidebarDisplayChanged(...args));
            }
        } else {
            throw new Error("Split views only support two subviews.");
        }
    }

// mark: split management

    sidebarDisplayChanged (sender, notice, newDisplayStatus) {
        // update our sidebar with the first view's display status
        if (this.themeManager && this.themeManager.currentTheme && this.elementTree) {
            let visibleClass, invisibleClass;
            let firstChild = this.elementTree.children[0];
            visibleClass = this.themeManager.currentTheme.CLASS_VIEW_DISPLAYED;
            invisibleClass = this.themeManager.currentTheme.CLASS_VIEW_NOT_DISPLAYED;
            if (newDisplayStatus) {
                firstChild.classList.remove(invisibleClass);
                firstChild.classList.add(visibleClass);
            } else {
                firstChild.classList.remove(visibleClass);
                firstChild.classList.add(invisibleClass);
            }
        }
    }
    showSidebar(options = {}) {
        if (this.themeManager && this.themeManager.currentTheme) {
            this.firstView.visible = true;
            this.firstView.displayed = true;
            return this.themeManager.currentTheme.animateSplitViewSidebarEnter({splitViewElement: this.elementTree, options});
        } else {
            return Promise.reject("No theme manager, or no current theme. Can't show sidebar.");
        }
    }

    hideSidebar(options = {}) {
        if (this.themeManager && this.themeManager.currentTheme) {
            return this.themeManager.currentTheme.animateSplitViewSidebarLeave({splitViewElement: this.elementTree, options})
            .then( () => {
                this.firstView.visible = false;
                this.firstView.displayed = false;
            } );
        } else {
            return Promise.reject("No theme manager, or no current theme. Can't hide sidebar.");
        }
    }

    get sidebarVisible() {
        if (this.firstView) {
            return this.firstView.visible;
        }
        return false;
    }

    get sidebarDisplayed() {
        if (this.firstView) {
            return this.firstView.displayed;
        }
        return false;
    }

    toggleSidebar(options = {}) {
        return (this.sidebarDisplayed ? this.hideSidebar : this.showSidebar).bind(this)(options);
    }

}

export function createSplitViewController(options={}) {
    return new SplitViewController(options);
}
