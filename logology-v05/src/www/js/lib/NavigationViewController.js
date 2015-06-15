/* @flow */
"use strict";

import ViewController from "./ViewController";
import h from "yasmf-h";

export class NoRootViewError extends Error {}

/**
 * Navigation View Controller
 *
 * @emits view:pushed
 * @emits view:popped
 */
export default class NavigationViewController extends ViewController {
    /**
     * Create a new navigation view controller with the specified root
     * view controller. If a root view isn't specified, a NoRootViewError
     * is thrown.
     *
     * @param {View} view
     * @throws NoRootViewError
     */
    constructor(options = {})/*: NavigationViewController*/ {
        super(options);

        if (!this.rootView) {
            throw new NoRootViewError("Can not construct a navigation controller without a root view");
        }
    }
    template()/*: Node*/ {
        return h.el("main.NavigationViewController?is=y-navigation-view-controller",
            this.renderSubviews().map( elTree => h.el("div.navigation-wrapper?is=y-navigation-wrapper", elTree)));
    }

///mark: top and root view properties

    get topView()/*: View*/ {
        const subviews = this.subviews;
        if (subviews.length > 0 ) {
           return subviews[subviews.length - 1];
        } else {
           return null;
        }
    }

    get viewUnderTopView()/*: View*/ {
        const subviews = this.subviews;
        if (subviews.length > 1 ) {
            return subviews[subviews.length - 2];
        } else {
            return null;
        }
    }

    get rootView()/*: View*/ {
        const subviews = this.subviews;
        if (subviews.length > 0) {
            return subviews[0];
        } else {
            return null;
        }
    }

    set rootView(v/*: View*/)/*: void*/ {
        super.addSubview(v);
    }

///mark: view management

    addSubview(v/*: View*/)/*: void*/ {
        super.addSubview(v);

    }

    push(v/*: View*/)/*: Promise*/ {
        let leavingView = this.topView;
        let enteringView = v;
        enteringView.visible = undefined;

        this.addSubview(v);

        let leavingViewElement = leavingView.elementTree;//.parentNode;
        let enteringViewElement = enteringView.elementTree;//.parentNode;

        let themeManager = this.themeManager;
        if (themeManager && themeManager.currentTheme) {
            return themeManager.currentTheme.animateViewHierarchyPush({enteringViewElement, leavingViewElement})
                .then(() => {
                    leavingView.visible = false;
                });
        }

        return Promise.reject("No theme manager, or no current theme. Can't push.");
    }

    pop()/*: Promise*/ {

        if (this.subviews.length < 2) {
            return Promise.resolve(); // can't pop anything!
        }

        let leavingView = this.topView;
        let enteringView = this.viewUnderTopView;
        enteringView.visible = undefined;

        let leavingViewElement = leavingView.elementTree;//.parentNode;
        let enteringViewElement = enteringView.elementTree;//.parentNode;


        let themeManager = this.themeManager;
        if (themeManager && themeManager.currentTheme) {
            return themeManager.currentTheme.animateViewHierarchyPop({enteringViewElement, leavingViewElement})
            .then(() => {
                leavingView.visible = false;
                this.removeSubview(leavingView);
            });
        }

        return Promise.reject("No theme manager, or no current theme. Can't pop.");
    }

    popToRoot()/*: void*/ {

    }

}
