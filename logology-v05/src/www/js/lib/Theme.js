/* @flow */
"use strict";

import Emitter from "yasmf-emitter";
import animationEnd from "animationend";

const _name = Symbol(),
      _cssClass = Symbol(),
      _namespace = Symbol();

export default class Theme extends Emitter {

    constructor({name = "Default", cssClass = "theme-default", namespace = "default-"} = {}) {
        super();
        this[_name] = name;
        this[_cssClass] = cssClass;
        this[_namespace] = namespace;
    }

    get name()/*: string*/ {
        return this[_name];
    }

    get cssClass()/*: string*/ {
        return this[_cssClass];
    }

    get namespace()/*: string*/ {
        return this[_namespace];
    }

    get ANIMATION_TIMING()/*: milliseconds*/ {
        return 300; // milliseconds
    }

///mark: CSS classes

    get CLASS_VIEW_BEFORE_EXIT()/*: string*/ { return this.namespace + "before-view-exit"; }
    get CLASS_VIEW_DOING_EXIT()/*: string*/ { return this.namespace + "doing-view-exit"; }
    get CLASS_VIEW_AFTER_EXIT()/*: string*/ { return this.namespace + "after-view-exit"; }
    get CLASS_VIEW_BEFORE_ENTER()/*: string*/ { return this.namespace + "before-view-enter"; }
    get CLASS_VIEW_DOING_ENTER()/*: string*/ { return this.namespace + "doing-view-enter"; }
    get CLASS_VIEW_AFTER_ENTER()/*: string*/ { return this.namespace + "after-view-enter"; }
///mark: animations

    addClearClassToElement(c, e) {
        let existingClears = e.getAttribute("y-anim-clear-class");
        if (existingClears) {
            existingClears = existingClears.split(" ");
        } else {
            existingClears = [];
        }
        existingClears.push(c);
        e.setAttribute("y-anim-clear-class", existingClears.join(" "));
    }

    clearElementClasses(e) {
        let existingClears = e.getAttribute("y-anim-clear-class");
        if (existingClears) {
            existingClears = existingClears.split(" ");
            existingClears.forEach( c => {
                e.classList.remove(c);
            });
            e.removeAttribute("y-anim-clear-class");
        }
    }

    animateElementWithBeforeDoingAfter ( [e, before, doing, after], cb ) {
        this.clearElementClasses(e);
        e.classList.add(before);
        setImmediate( () => {
            e.classList.add(doing);
            this.addClearClassToElement(doing, e);
            setTimeout(() => {
                e.classList.remove(before);
                e.classList.add(after);
                this.addClearClassToElement(after, e);
                cb();
            }, this.ANIMATION_TIMING);
        });
    }

    animateViewHierarchyPush({enteringViewElement/*: Node*/, exitingViewElement/*: Node*/} = {})/*: Promise*/ {
        return new Promise((resolve) => {
            [ [ exitingViewElement, this.CLASS_VIEW_BEFORE_EXIT, this.CLASS_VIEW_DOING_EXIT, this.CLASS_VIEW_AFTER_EXIT ],
              [ enteringViewElement, this.CLASS_VIEW_BEFORE_ENTER, this.CLASS_VIEW_DOING_ENTER, this.CLASS_VIEW_AFTER_ENTER ] ]
                .forEach( arr => this.animateElementWithBeforeDoingAfter( arr, resolve) );
        });
    }
    animateViewHierarchyPop({enteringViewElement/*: Node*/, exitingViewElement/*: Node*/} = {})/*: Promise*/ {
    }
    animateModalViewEnter({enteringViewElement/*: Node*/, exitingViewElement/*: Node*/} = {})/*: Promise*/ {
    }
    animateModalViewExit({enteringViewElement/*: Node*/, exitingViewElement/*: Node*/} = {})/*: Promise*/ {
    }
    animateAlertViewEnter({enteringViewElement/*: Node*/})/*: Promise*/ {
    }
    animateAlertViewExit({exitingViewElement/*: Node*/})/*: Promise*/ {
    }
    animateSplitViewSidebarEnter({splitViewElement/*: Node*/})/*: Promise*/ {
    }
    animateSplitViewSidebarExit({splitViewElement/*: Node*/})/*: Promise*/ {
    }

}
