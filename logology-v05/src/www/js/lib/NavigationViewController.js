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
        let exitingView = this.topView;
        let enteringView = v;

        let exitingViewElement = exitingView.elementTree;
        let enteringViewElement = enteringView.elementTree;

        this.addSubview(v);
        this.render();

        let themeManager = this.themeManager;

        if (themeManager) {
            if (themeManager.currentTheme) {
                return themeManager.currentTheme.animateViewHierarchyPush({enteringViewElement, exitingViewElement});
            }
        }

        return Promise.reject("No theme manager, or no current theme. Can't push.");
    }

    pop()/*: void*/ {

    }

    popToRoot() /*: void*/ {

    }

}
