/*****************************************************************************
 *
 * Author: Kerri Shotts <kerrishotts@gmail.com> 
 *         http://www.photokandy.com/books/mastering-phonegap
 *
 * MIT LICENSED
 * 
 * Copyright (c) 2016 Kerri Shotts (photoKandy Studios LLC)
 * Portions Copyright various third parties where noted.
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this
 * software and associated documentation files (the "Software"), to deal in the Software
 * without restriction, including without limitation the rights to use, copy, modify,
 * merge, publish, distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to the following
 * conditions:
 * The above copyright notice and this permission notice shall be included in all copies
 * or substantial portions of the Software.
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
 * PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT
 * OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 * 
 *****************************************************************************/
 
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
            this.renderSubviews()); //.map( elTree => h.el("div.y-navigation-wrapper?is=y-navigation-wrapper", elTree)));
    }

///mark: top and root view properties

    get topView()/*: View*/ {
        const subviews = this.subviews;
        if (subviews.length > 0) {
            return subviews[subviews.length - 1];
        } else {
            return null;
        }
    }

    get viewUnderTopView()/*: View*/ {
        const subviews = this.subviews;
        if (subviews.length > 1) {
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

    push(v/*: View*/, options = {})/*: Promise*/ {
        let leavingView = this.topView;
        let enteringView = v;
        enteringView.visible = undefined;

        leavingView.emitSync("willLeaveByPush", options);
        enteringView.emitSync("willEnterByPush", options);

        this.addSubview(v);

        let leavingViewElement = leavingView.elementTree;//.parentNode;
        let enteringViewElement = enteringView.elementTree;//.parentNode;

        let themeManager = this.themeManager;
        if (themeManager && themeManager.currentTheme) {
            return themeManager.currentTheme.animateViewHierarchyPush({enteringViewElement, leavingViewElement, options})
                .then(() => {
                    leavingView.visible = false;
                    leavingView.emitSync("didLeaveByPush", options);
                    enteringView.emitSync("didEnterByPush", options);
                });
        }

        return Promise.reject("No theme manager, or no current theme. Can't push.");
    }

    pop(options = {})/*: Promise*/ {

        if (this.subviews.length < 2) {
            return Promise.resolve(); // can't pop anything!
        }

        let leavingView = this.topView;
        let enteringView = this.viewUnderTopView;

        leavingView.emitSync("willLeaveByPop", options);
        enteringView.emitSync("willEnterByPop", options);

        enteringView.visible = undefined;

        let leavingViewElement = leavingView.elementTree;//.parentNode;
        let enteringViewElement = enteringView.elementTree;//.parentNode;

        let themeManager = this.themeManager;
        if (themeManager && themeManager.currentTheme) {
            return themeManager.currentTheme.animateViewHierarchyPop({enteringViewElement, leavingViewElement, options})
            .then(() => {
                leavingView.visible = false;
                leavingView.emitSync("didLeaveByPop", options);
                enteringView.emitSync("didEnterByPop", options);
                this.removeSubview(leavingView);
            });
        }

        return Promise.reject("No theme manager, or no current theme. Can't pop.");
    }

    popToRoot(): Promise<void> {
        if (this.subviews.length < 2) {
            return Promise.resolve();
        }

        var p: Promise<{}> = Promise.resolve();
        for (var i = this.subviews.length; i >= 2; i--) {
            p = p.then(() => this.pop({animate: false}));
        }
        return p.then(() => {return;});
    }

}

export function createNavigationViewController(options = {}) {
    return new NavigationViewController(options);
}
