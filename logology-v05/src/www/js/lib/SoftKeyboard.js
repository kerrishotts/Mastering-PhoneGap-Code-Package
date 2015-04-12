"use strict";

/*globals cordova*/
import Emitter from "yasmf-emitter";

// private properties -- we need some symbols
let _selectors = Symbol();

export default class SoftKeyboard extends Emitter {

    constructor() {
        super();
        this[_selectors] = new Set();
    }

    init({selectors=[]} = {}) {
        if (cordova) {
            cordova.plugins.Keyboard.disableScroll(true);
            window.addEventListener("native.keyboardshow", this.keyboardShown.bind(this));
            window.addEventListener("native.keyboardhide", this.keyboardHidden.bind(this));
        }
        selectors.forEach( sel => this.addSelector(sel) );
    }

    addSelector(selector) {
        this[_selectors].add(selector);
        return this;
    }

    removeSelector(selector) {
        this[_selectors].delete(selector);
    }

    get selectors() {
        return Array.from(this[_selectors]);
    }

    get selector() {
        return Array.from(this[_selectors]).join(", ");
    }

    keyboardShown(e) {
        this.emit("SoftKeyboard:keyboardShown", e);
        this.emit("SoftKeyboard:willResize", e);
        setTimeout(function resizeView() {
            let scrollContainers = Array.from(document.querySelectorAll(this.selector)),
                //TODO: get rid of depenency on navbar height
                navBarHeight = parseInt(window.getComputedStyle(document.querySelector("[is='y-nav']")).getPropertyValue("height"), 10),
                screenHeight = window.screen.height,
                maxHeight = screenHeight - ( navBarHeight + e.keyboardHeight );
            scrollContainers.forEach(el => el.style.maxHeight = `${maxHeight}px`);
            this.emit("SoftKeyboard:didResize", e);
            setTimeout(() => {
                let focusedElement = document.querySelector(":focus");
                if (focusedElement) {
                    focusedElement.scrollIntoView();
                }
            }, 0);
        }, 0);
    }

    keyboardHidden(e) {
        setTimeout(function resizeView() {
            this.emit("SoftKeyboard:keyboardHidden", e);
            this.emit("SoftKeyboard:willResize", e);
            let scrollContainers = Array.from(document.querySelectorAll(this.selector));
            scrollContainers.forEach(el => el.style.maxHeight = "");
            this.emit("SoftKeyboard:didResize", e);
        }, 0);
    }
}
