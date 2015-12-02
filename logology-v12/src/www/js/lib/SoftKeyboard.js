/* @flow */
"use strict";

/*globals cordova*/
import Emitter from "yasmf-emitter";

// private properties -- we need some symbols
let _selectors = Symbol();
let _useSmoothScrolling = Symbol();
let _smoothScrollDuration = Symbol();
let _showElementUnderKeyboard = Symbol();

/**
 * given a selector string, return matching elements in an Array
 * @param {string} selectorString
 * @return Array<Node>
 */
function getScrollContainers(selectorString/*: string*/)/*: Array<Node>*/ {
    return Array.from(document.querySelectorAll(selectorString));
}

/**
 * Given an element, returns an array representing the start and end of
 * the current selection.
 * @param {Node} focusedElement
 * @return Array<number>
 */
function getElementSelection(focusedElement/*: Node*/)/*: Array<number>*/ {
    return [focusedElement.selectionStart, focusedElement.selectionEnd];
}

/**
 * Given an element and a tuple representing the start and end of the selection,
 * set the selection on the element.
 * @param {Node} focusedElement
 * @param {number} selectionStart the start of the selection
 * @param {number} selectionEnd   the end of the selection
 */
function setElementSelection(focusedElement/*: Node*/, [selectionStart/*: number*/, selectionEnd/*: number*/] = [0, 0])/*: void*/ {
    focusedElement.selectionStart = selectionStart;
    focusedElement.selectionEnd = selectionEnd;
}

function showElementUnderKeyboard(keyboardHeight/*: number*/) {
    let e = document.createElement("div");
    e.className = "sk-element-under-keyboard";
    e.style.position = "absolute";
    e.style.bottom = "0";
    e.style.left = "0";
    e.style.right = "0";
    e.style.zIndex = "9999999999999";
    e.style.height = `${keyboardHeight}px`;
    document.body.appendChild(e);
}

function hideElementUnderKeyboard()/*: void*/ {
    let els = Array.from(document.querySelectorAll(".sk-element-under-keyboard"));
    els.forEach((el) => document.body.removeChild(el));
}

/**
 * Saves the element's current text selection, then resets it to 0. After a tick, it
 * restores the element's saved text selection.
 * This is to fix iOS's buggy behavior regarding cursor positioning after the scrolling
 * of an element.
 *
 * @param {Node} focusedElement
 */
function handleTextSelection(focusedElement/*: Node*/)/*: void*/ {
    setTimeout(() => {
        // save the selection
        let selection = getElementSelection(focusedElement);

        // reset the selection to 0,0
        setElementSelection(focusedElement);

        // after a short delay, restore the selection
        setTimeout(() => setElementSelection(focusedElement, selection), 33);
    }, 0);
}

/**
 * Provides methods for avoiding the soft keyboard. This tries to be automatic,
 * but you will need to supply scrollable selectors.
 */
export default class SoftKeyboard extends Emitter {

    /**
     * Construct an instance of the SoftKeyboard
     *
     * @return SoftKeyboard
     */
    constructor(options) {
        super(options);
    }

    /**
     * Initialize a SoftKeyboard. Will be called automatically during construction
     * @param {Array<string>} [selectors]       defaults to an empty array
     * @param {boolean} [useSmoothScrolling]    defaults to true
     * @param {number} [smoothScrollDuration]   defaults to 100
     * @param {boolean} [showElementUnderKeyboard]   defaults to false
     */
    init({selectors=[], useSmoothScrolling = true, smoothScrollDuration = 100,
          showElementUnderKeyboard = false} = {}) {
        // selectors: Array, useSmoothScrolling: boolean, smoothScrollDuration: number
        if (typeof cordova !== "undefined" ) {
            if (cordova.plugins && cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.disableScroll(true);
                window.addEventListener("native.keyboardshow", this.keyboardShown.bind(this));
                window.addEventListener("native.keyboardhide", this.keyboardHidden.bind(this));
            }
        }
        this[_selectors] = new Set();
        selectors.forEach( sel => this.addSelector(sel) );
        this[_useSmoothScrolling] = useSmoothScrolling;
        this[_smoothScrollDuration] = smoothScrollDuration;
        this[_showElementUnderKeyboard] = showElementUnderKeyboard;
    }

    /**
     * Adds a selector
     * @param {string} selector    A CSS selector that identifies a scrolling container
     * @return {SoftKeyboard}
     */
    addSelector(selector/*: string*/)/*: SoftKeyboard*/ {
        this[_selectors].add(selector);
        return this;
    }

    /**
     * Removes a selector
     * @param {string} selector    A CSS selector that identifies a scrolling container
     * @return {SoftKeyboard}
     */
    removeSelector(selector/*: string*/)/*: SoftKeyboard*/ {
        this[_selectors].delete(selector);
        return this;
    }

    get selectors()/*: Array*/ {
        return Array.from(this[_selectors]);
    }

    get selectorString()/*: string*/ {
        return this.selectors.join(", ");
    }

    get useSmoothScrolling()/*: boolean*/ {
        return this[_useSmoothScrolling];
    }
    set useSmoothScrolling(b/*: boolean*/)/*: void*/ {
        this[_useSmoothScrolling] = b;
    }

    get smoothScrollDuration()/*: number*/ {
        return this[_smoothScrollDuration];
    }
    set smoothScrollDuration(d/*: number*/)/*: void*/ {
        this[_smoothScrollDuration] = d;
    }

    get showElementUnderKeyboard()/*: boolean*/ {
        return this[_showElementUnderKeyboard];
    }
    set showElementUnderKeyboard(b/*: boolean*/)/*: void*/ {
        this[_showElementUnderKeyboard] = b;
    }

    /**
     * Shows the keyboard, if possible
     */
    showKeyboard(force/*: boolean*/ = false)/*: void*/ {
        if (typeof cordova !== "undefined") {
            if (cordova.plugins && cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.show();
                return;
            }
        }
        if (force) {
            this.keyboardShown({keyboardHeight:240});
        }
    }

    /**
     * Hide the keyboard, if possible
     */
    hideKeyboard(force/*: boolean*/ = false)/*: void*/ {
        if (typeof cordova !== "undefined") {
            if (cordova.plugins && cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hide();
                return;
            }
        }
        if (force) {
            this.keyboardHidden({});
        }
    }

    /**
     * Triggered when the soft keyboard is displayed
     * @param {{keyboardHeight: number}} e    the event triggered from the keyboard plugin
     */
    keyboardShown(e)/*: void*/ {
        this.emit("keyboardShown", e);
        this.emit("willResize", e);
        setTimeout(() => {
            let screenHeight = window.innerHeight; //(document.body.clientWidth === window.screen.height ? window.screen.width : window.screen.height);
            let scrollContainers = getScrollContainers(this.selectorString);
            let keyboardHeight = e.keyboardHeight / devicePixelRatio;

            if (this.showElementUnderKeyboard) {
                showElementUnderKeyboard(keyboardHeight);
            }

            // for each scroll container in the DOM, we need to calculate the
            // the height it should be to fit in the reduced view
            scrollContainers.forEach((sc) => {
                let scTop = sc.getBoundingClientRect().top;
                // now that we know the top of the scroll container, the height of the
                // the screen, and the height of the keyboard, we can calculate the
                // appropriate max-height for the container.
                sc.style.maxHeight = "" + (screenHeight - keyboardHeight - scTop) + "px";
            });
            this.emit("didResize", e);
            // changing the height isn't sufficient: we need to scroll any focused
            // element into view.
            setTimeout(() => {
                let focusedElement = document.querySelector(":focus");
                if (focusedElement) {
                    if (!this.useSmoothScrolling || !window.requestAnimationFrame) {
                        // scroll the element into view, but only if we have to
                        if (focusedElement.scrollIntoViewIfNeeded) {
                            focusedElement.scrollIntoViewIfNeeded();
                        } else {
                            // aim for the bottom of the viewport
                            focusedElement.scrollIntoView(false);
                        }
                        // iOS doesn't always position the cursor correctly after
                        // a scroll operation. Clear the selection so that iOS is
                        // forced to recompute where the cursor should appear.
                        handleTextSelection(focusedElement);
                    } else {
                        // to scroll the element smoothly into view, things become a little
                        // more difficult.
                        let fElTop = focusedElement.getBoundingClientRect().top,
                            sc = focusedElement, scTop, scBottom,
                            selectorString = this.selectorString;
                        // find the containing scroll container if we can
                        while (sc && !sc.matches(selectorString)) {
                            sc = sc.parentElement;
                        }
                        if (sc) {
                            scTop = sc.getBoundingClientRect().top;
                            scBottom = sc.getBoundingClientRect().bottom;
                            if (fElTop < scTop || fElTop > (((scBottom - scTop) / 2) + scTop)) {
                                // the element isn't above the keyboard (or is too far above),
                                // scroll it into view smoothly
                                let targetTop = ((scBottom - scTop) / 2) + scTop,
                                    deltaTop = fElTop - targetTop,
                                    origScrollTop = sc.scrollTop,
                                    startTimestamp = null;
                                // animate our scroll
                                let scrollStep;
                                window.requestAnimationFrame(scrollStep = (timestamp) => {
                                    if (!startTimestamp) {
                                        startTimestamp = timestamp;
                                    }
                                    var progressDelta = timestamp - startTimestamp,
                                        pct = progressDelta / this.smoothScrollDuration;
                                    sc.scrollTop = origScrollTop + (deltaTop * pct);
                                    if (progressDelta < this.smoothScrollDuration) {
                                        window.requestAnimationFrame(scrollStep);
                                    } else {
                                        // set the scroll to the final desired position, just in case
                                        // we didn't actually get there (or overshot)
                                        sc.scrollTop = origScrollTop + deltaTop;
                                        handleTextSelection(focusedElement);
                                    }
                                });
                            }
                        }
                    }
                }
            }, 0);
        }, 0);
    }

    /**
     * Triggered when the soft keyboard is hidden
     * @param {*} e
     */
    keyboardHidden(e)/*: void*/ {
        setTimeout(() => {
            this.emit("keyboardHidden", e);
            this.emit("willResize", e);
            let scrollContainers = getScrollContainers(this.selectorString);
            scrollContainers.forEach(el => el.style.maxHeight = "");
            hideElementUnderKeyboard();
            this.emit("didResize", e);
        }, 0);
    }
}

export function createSoftKeyboard(...args) {
    return new SoftKeyboard(...args);
}
