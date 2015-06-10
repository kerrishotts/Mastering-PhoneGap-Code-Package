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

    /*
     * Here anims == animation startion, animd == animation doing, animh = animation hold
     */
    get CLASS_VIEW_ANIMS_LEAVE_IN()/*: string*/ { return this.namespace + "anims-view-leave-in"; }
    get CLASS_VIEW_ANIMD_LEAVE_IN()/*: string*/ { return this.namespace + "animd-view-leave-in"; }
    get CLASS_VIEW_ANIMH_LEAVE_IN()/*: string*/ { return this.namespace + "animh-view-leave-in"; }
    get CLASS_VIEW_ANIMS_ENTER_IN()/*: string*/ { return this.namespace + "anims-view-enter-in"; }
    get CLASS_VIEW_ANIMD_ENTER_IN()/*: string*/ { return this.namespace + "animd-view-enter-in"; }
    get CLASS_VIEW_ANIMH_ENTER_IN()/*: string*/ { return this.namespace + "animh-view-enter-in"; }
    get CLASS_VIEW_ANIMS_LEAVE_OUT()/*: string*/ { return this.namespace + "anims-view-leave-out"; }
    get CLASS_VIEW_ANIMD_LEAVE_OUT()/*: string*/ { return this.namespace + "animd-view-leave-out"; }
    get CLASS_VIEW_ANIMH_LEAVE_OUT()/*: string*/ { return this.namespace + "animh-view-leave-out"; }
    get CLASS_VIEW_ANIMS_ENTER_OUT()/*: string*/ { return this.namespace + "anims-view-enter-out"; }
    get CLASS_VIEW_ANIMD_ENTER_OUT()/*: string*/ { return this.namespace + "animd-view-enter-out"; }
    get CLASS_VIEW_ANIMH_ENTER_OUT()/*: string*/ { return this.namespace + "animh-view-enter-out"; }

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

    animateElementWithAnimSequence ( [e, setup, doing, hold], cb ) {
        this.clearElementClasses(e);
        e.classList.add(setup);
        setImmediate( () => {
            e.classList.add(doing);
            this.addClearClassToElement(doing, e);
            setTimeout(() => {
                e.classList.remove(setup);
                e.classList.remove(doing);
                e.classList.add(hold);
                this.addClearClassToElement(hold, e);
                cb();
            }, this.ANIMATION_TIMING);
        });
    }

    animateViewHierarchyPush({enteringViewElement/*: Node*/, leavingViewElement/*: Node*/} = {})/*: Promise*/ {
        return new Promise((resolve) => {
            [ [ leavingViewElement, this.CLASS_VIEW_ANIMS_LEAVE_IN, this.CLASS_VIEW_ANIMD_LEAVE_IN, this.CLASS_VIEW_ANIMH_LEAVE_IN ],
              [ enteringViewElement, this.CLASS_VIEW_ANIMS_ENTER_IN, this.CLASS_VIEW_ANIMD_ENTER_IN, this.CLASS_VIEW_ANIMH_ENTER_IN ] ]
                .forEach( arr => this.animateElementWithAnimSequence( arr, resolve) );
        });
    }
    animateViewHierarchyPop({enteringViewElement/*: Node*/, leavingViewElement/*: Node*/} = {})/*: Promise*/ {
        return new Promise((resolve) => {
            [ [ leavingViewElement, this.CLASS_VIEW_ANIMS_LEAVE_OUT, this.CLASS_VIEW_ANIMD_LEAVE_OUT, this.CLASS_VIEW_ANIMH_LEAVE_OUT ],
              [ enteringViewElement, this.CLASS_VIEW_ANIMS_ENTER_OUT, this.CLASS_VIEW_ANIMD_ENTER_OUT, this.CLASS_VIEW_ANIMH_ENTER_OUT ] ]
                .forEach( arr => this.animateElementWithAnimSequence( arr, resolve) );
        });
    }
    animateModalViewEnter({enteringViewElement/*: Node*/, leavingViewElement/*: Node*/} = {})/*: Promise*/ {
    }
    animateModalViewExit({enteringViewElement/*: Node*/, leavingViewElement/*: Node*/} = {})/*: Promise*/ {
    }
    animateAlertViewEnter({enteringViewElement/*: Node*/})/*: Promise*/ {
    }
    animateAlertViewExit({leavingViewElement/*: Node*/})/*: Promise*/ {
    }
    animateSplitViewSidebarEnter({splitViewElement/*: Node*/})/*: Promise*/ {
    }
    animateSplitViewSidebarExit({splitViewElement/*: Node*/})/*: Promise*/ {
    }

}
