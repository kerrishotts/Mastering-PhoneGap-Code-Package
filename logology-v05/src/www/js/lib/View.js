"use strict";

import Emitter from "yasmf-emitter";
import h from "yasmf-h";
import Hammer from "hammerjs";
import matchesSelector from "matches-selector";

// private property symbols
const _subviews = Symbol(),
      _elementTree = Symbol(),
      _parentView = Symbol(),
      _hammer = Symbol(),
      _renderElement = Symbol(),
      _targetSelectors = Symbol();

function removeTreeFromElement() {
    this.emitSync("willDetachFromParent");
    this[_renderElement].removeChild(this.elementTree);
    this[_renderElement] = null;
    this.emit("didDetachFromParent");
}

function addTreeToElement() {
    this.emitSync("willAttachToParent");
    this[_renderElement].appendChild(this.elementTree);
    this.emit("didAttachToParent");
}

function triggerTargetSelectors(e) {
    const targetSelectors = this[_targetSelectors];
    for (let [eventAndSelector, emitSet] of targetSelectors) {
        let [eventFilters, selector] = eventAndSelector.split(":");
        selector = selector.trim();
        eventFilters = eventFilters.trim().split(" ");
        if (eventFilters) {
            if (eventFilters.indexOf(e.type) > -1) {
                let matches = false;
                let curTarget = e.target;
                while (curTarget && !(matches = matchesSelector(curTarget, selector)) && !(curTarget === this.elementTree)) {
                    curTarget = curTarget.parentNode;
                }
                if (matches) {
                    for (let emit of emitSet) {
                        this.emit(emit, curTarget, e);
                    }
                }
            }
        }
    }
}

export default class View extends Emitter {
    constructor({deferRendering = false} = {}) {
        super();
        this[_subviews] = [];
        this[_parentView] = null;
        this[_elementTree] = null;
        this[_renderElement] = null;
        this[_targetSelectors] = new Map();
        if (this.TARGET_SELECTORS) {
            this.addTargetSelectors(this.TARGET_SELECTORS);
        }
        if (!deferRendering) { setImmediate(this.render.bind(this)); }
    }

///pragma rendering
    template() {
        return h.el("div.View?is=y-view", this.renderSubviews());
    }
    renderTo(options = {}) {
        let {stopAt} = options,
            targetEl;
        if (this.parentView && this.parentView !== stopAt) {
            this.parentView.renderTo(options);
        } else {
            if ((targetEl = (this.renderElement || (this.elementTree && this.elementTree.parentNode)))) {
                h.renderTo(this.render(), targetEl );
            }
        }
    }
    render() {
        if (this.elementTree) {
            h.renderTo(Array.from(this.template().children), this.elementTree);
        } else {
            this.elementTree = this.template();
        }
        return this.elementTree;
    }
    onRender() {
        this.renderTo({stopAt: this.parentView});
    }

    renderSubviews() {
        return this.subviews.map(function(view) {return view.render(); });
    }

///pragma events

    get targetSelectors() {
        return Array.from(this[_targetSelectors]);
    }
    addTargetSelector({selector, emit}) {
        const targetSelectors = this[_targetSelectors];
        let targetSet = targetSelectors.get(selector);
        if (!targetSet) {
            targetSelectors.set(selector, targetSet = new Set());
        }
        targetSet.add(emit);
    }
    addTargetSelectors(...args) {
        for (let arg of args) {
            if (arg) {
                if (arg instanceof Array) {
                    this.addTargetSelectors(...arg);
                } else {
                    this.addTargetSelector(arg);
                }
            }
        }
    }
    get TARGET_SELECTORS() {
        return undefined;
    }

    get HAMMER_EVENTS() {
        return "tap press pressup panmove panstart panend swipe swipeleft swiperight";
    }

    get DOM_EVENTS() {
        return "input focus blur keyup keydown change submit reset select";
    }
    get hammer() {
        return this[_hammer];
    }

    onHammerEvent(sender, notice, e) {
        triggerTargetSelectors.call(this, e);
    }

    onDOMEvent(sender, notice, e) {
        triggerTargetSelectors.call(this, e);
    }

///pragma parent view property
    get parentView() {
        return this[_parentView];
    }

///pragma subview handling
    get subviews() {
        return this[_subviews];
    }
    addSubview(v) {
        this.emitSync("willAddSubview", v);
        this[_subviews].push(v);
        if (v.parentView !== this) {
            v.emitSync("willChangeParentView", this);
            if (v.parentView) {
                v[_parentView].removeView(v);
            }
            v[_parentView] = null;
        }
        v[_parentView] = this;
        v.emit("didChangeParentView");
        this.emit("didAddSubview", v);
    }
    removeView(v) {
        let idx;
        this.emitSync("willRemoveSubview", v);
        if ((idx = this[_subviews].indexOf(v)) > -1) {
            this[_subviews].splice(idx, 1);
            v.emitSync("willRemoveFromParent");
            v[_parentView] = null;
            v.emit("didRemoveFromParent");
        }
        this.emit("didRemoveView", v);
    }

///pragma element tree property and handling
    get elementTree() {
        return this[_elementTree];
    }
    set elementTree(e) {
        this.emitSync("willChangeElementTree", e);
        this[_elementTree] = e;
        this.emit("didChangeElementTree");
    }
    onWillChangeElementTree() {
        if (this.elementTree && this.renderElement) {
            removeTreeFromElement.call(this);
        }
    }
    onDidChangeElementTree() {
        if (this.elementTree) {
            for (let evt of this.DOM_EVENTS.split(" ")) {
                this[_elementTree].addEventListener(evt, (e)=>this.emit("DOMEvent", e), true);
            }
            this[_hammer] = new Hammer(this[_elementTree], {domEvents: true});
            this[_hammer].on(this.HAMMER_EVENTS, (e)=>this.emit("hammerEvent", e));

            if (this.renderElement) {
                addTreeToElement.call(this);
            }
        }
    }

///pragma renderElement property
    get renderElement() {
        return this[_renderElement];
    }
    set renderElement(e) {
        if (this[_renderElement] && this[_renderElement] !== e && this.elementTree) {
            removeTreeFromElement.call(this);
        }
        this[_renderElement] = e;
        if (this[_renderElement] && this.elementTree) {
            addTreeToElement.call(this);
        }
    }

///pragma cleanup
    destroy() {
        this.emitSync("willDestroy");
        this[_subviews].forEach(view => this.removeView(view));
        this[_subviews] = [];
        this.renderElement = null;
        this[_hammer].destroy();
        this[_hammer] = null;
        this.elementTree = null;
        super.destroy();
    }

}
