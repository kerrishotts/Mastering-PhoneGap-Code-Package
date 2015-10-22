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
     * Here anims == animation setup, animd == animation doing, animh = animation hold
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

    get CLASS_SPLIT_ANIMS_ENTER()/*: string*/ { return this.namespace + "anims-split-enter"; }
    get CLASS_SPLIT_ANIMD_ENTER()/*: string*/ { return this.namespace + "animd-split-enter"; }
    get CLASS_SPLIT_ANIMH_ENTER()/*: string*/ { return this.namespace + "animh-split-enter"; }
    get CLASS_SPLIT_ANIMS_LEAVE()/*: string*/ { return this.namespace + "anims-split-leave"; }
    get CLASS_SPLIT_ANIMD_LEAVE()/*: string*/ { return this.namespace + "animd-split-leave"; }
    get CLASS_SPLIT_ANIMH_LEAVE()/*: string*/ { return this.namespace + "animh-split-leave"; }

    get CLASS_VIEW_VISIBLE()/*: string*/ { return this.namespace + "visible"; }
    get CLASS_VIEW_NOT_VISIBLE()/*: string*/ { return this.namespace + "not-visible"; }
    get CLASS_VIEW_DISPLAYED()/*: string*/ { return this.namespace + "displayed"; }
    get CLASS_VIEW_NOT_DISPLAYED()/*: string*/ { return this.namespace + "not-displayed"; }

/// visibility and display for elements

    markElementVisibility(e/*: Node*/, visibility = false) {
        if (e) {
            if (visibility === undefined) {
                e.classList.remove(this.CLASS_VIEW_VISIBLE);
                e.classList.remove(this.CLASS_VIEW_NOT_VISIBLE);
            } else {
                e.classList.remove(visibility ? this.CLASS_VIEW_NOT_VISIBLE : this.CLASS_VIEW_VISIBLE);
                e.classList.add(visibility ? this.CLASS_VIEW_VISIBLE : this.CLASS_VIEW_NOT_VISIBLE);
                //TODO: handle ARIA
            }
        }
    }
    markElementDisplay(e/*: Node*/, display = false) {
        if (e) {
            e.classList.remove(display ? this.CLASS_VIEW_NOT_DISPLAYED : this.CLASS_VIEW_DISPLAYED);
            e.classList.add(display ? this.CLASS_VIEW_DISPLAYED : this.CLASS_VIEW_NOT_DISPLAYED);
        }
    }

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

    animateElementWithAnimSequence ( [e, setup, doing, hold], { animate/*: boolean*/ = true } = {} ) {
        return new Promise((resolve) => {
            let finalAnimationStep = () => {
                e.classList.remove(setup);
                e.classList.remove(doing);
                e.classList.add(hold);
                this.addClearClassToElement(hold, e);
                resolve();
            };
            this.clearElementClasses(e);
            if (animate) {
                e.classList.add(setup);
                setImmediate( () => {
                    e.classList.add(doing);
                    this.addClearClassToElement(doing, e);
                    setTimeout(finalAnimationStep, this.ANIMATION_TIMING);
                });
            } else {
                finalAnimationStep();
            }
        });
    }

    animateViewHierarchyPush({enteringViewElement/*: Node*/, leavingViewElement/*: Node*/, options} = {})/*: Promise*/ {
        return Promise.all(
            [ [ leavingViewElement, this.CLASS_VIEW_ANIMS_LEAVE_IN, this.CLASS_VIEW_ANIMD_LEAVE_IN, this.CLASS_VIEW_ANIMH_LEAVE_IN ],
              [ enteringViewElement, this.CLASS_VIEW_ANIMS_ENTER_IN, this.CLASS_VIEW_ANIMD_ENTER_IN, this.CLASS_VIEW_ANIMH_ENTER_IN ] ]
                .map( arr => this.animateElementWithAnimSequence(arr, options)));
    }
    animateViewHierarchyPop({enteringViewElement/*: Node*/, leavingViewElement/*: Node*/, options} = {})/*: Promise*/ {
        return Promise.all(
            [ [ leavingViewElement, this.CLASS_VIEW_ANIMS_LEAVE_OUT, this.CLASS_VIEW_ANIMD_LEAVE_OUT, this.CLASS_VIEW_ANIMH_LEAVE_OUT ],
              [ enteringViewElement, this.CLASS_VIEW_ANIMS_ENTER_OUT, this.CLASS_VIEW_ANIMD_ENTER_OUT, this.CLASS_VIEW_ANIMH_ENTER_OUT ] ]
                .map( arr => this.animateElementWithAnimSequence(arr, options)));
    }
    animateModalViewEnter({enteringViewElement/*: Node*/, leavingViewElement/*: Node*/} = {})/*: Promise*/ {
    }
    animateModalViewExit({enteringViewElement/*: Node*/, leavingViewElement/*: Node*/} = {})/*: Promise*/ {
    }
    animateAlertViewEnter({enteringViewElement/*: Node*/})/*: Promise*/ {
    }
    animateAlertViewExit({leavingViewElement/*: Node*/})/*: Promise*/ {
    }
    animateSplitViewSidebarEnter({splitViewElement/*: Node*/, options})/*: Promise*/ {
        return Promise.all(
            [ [ splitViewElement, this.CLASS_SPLIT_ANIMS_ENTER,
                                  this.CLASS_SPLIT_ANIMD_ENTER,
                                  this.CLASS_SPLIT_ANIMH_ENTER ] ]
                .map( arr => this.animateElementWithAnimSequence(arr, options)));
    }
    animateSplitViewSidebarLeave({splitViewElement/*: Node*/, options})/*: Promise*/ {
        return Promise.all(
            [ [ splitViewElement, this.CLASS_SPLIT_ANIMS_LEAVE,
                                  this.CLASS_SPLIT_ANIMD_LEAVE,
                                  this.CLASS_SPLIT_ANIMH_LEAVE ] ]
                .map( arr => this.animateElementWithAnimSequence(arr, options)));
    }

}
