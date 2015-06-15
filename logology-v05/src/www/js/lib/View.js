/* @flow */
"use strict";

import Emitter from "yasmf-emitter";
import h from "yasmf-h";
import Hammer from "hammerjs";
import matchesSelector from "matches-selector";

h.renderTo = function renderTo(n, el, idx) {
    if (!idx) {
        idx = 0;
    }
    if (n instanceof Array) {
        let elNodeCount = el.children.length;
        for (let i = 0, l = n.length; i < l; i++) {
            if (n[i] !== undefined && n[i] !== null) {
                renderTo(n[i], el, i);
            }
        }
        for (let i = n.length; i< elNodeCount; i++) {
            el.removeChild(el.childNodes[i]);
        }
    } else {
        if (n === undefined || n === null || el === undefined || el === null) {
            return;
        }
        var elid = [null, null];
        if (el.hasChildNodes() && idx < el.childNodes.length) {
            elid[0] = el.childNodes[idx].getAttribute("id");
            if (h.useDomMerging) {
                transform(el, el.childNodes[idx], n);
            } else {
                el.replaceChild(n, el.childNodes[idx]);
            }
        } else {
            el.appendChild(n);
        }
    }
}
/******************************************************************************
 *
 * VIEW
 *
 ******************************************************************************

 Views are the basic building block of the visual hierarchy used to render the
 application. Technically, these could be widgets at the lowest level, but in
 practice views typically render a DOM Tree based on a related model. This
 could be a simple tree or a very complex tree. This is called the
 `elementTree`. It is generated by the `render` method. This tree is parented
 by the `renderElement` in the DOM. `render` calls the `template` method to
 actually generate the tree. `template` should call `renderSubviews` in order
 to ensure subviews also get a chance to render themselves.

 One should never attempt to attach event listeners directly to any element in
 the tree as that element may be destroyed at the next render attempt. Instead
 the view itself provides mechanisms for detecting events that occur on any
 element within the tree. These are called `targetSelectors`. They are a map
 between a selector and the event to emit. For example, a selector of
 `tap:ul > li.item` emitting `listItemTapped` will emit `listItemTapped`
 whenever a `li.item` directly inside a `ul` is tapped. Any listener that
 responds to `listItemTapped` will be notified (and will be passed the
 event, sender, notice, the element that triggered the event and the event
 itself.
*/

// private property symbols
const _subviews = Symbol(),
      _elementTree = Symbol(),
      _parentView = Symbol(),
      _hammer = Symbol(),
      _renderElement = Symbol(),
      _targetSelectors = Symbol(),
      _themeManager = Symbol(),
      _visible = Symbol(),
      _display = Symbol(),
      _attached = Symbol(),
      _scrollTop = Symbol();

/**
 * Remove the view's tree from the render element.
 * @private
 * @emits willDetachFromParent, didDetachFromParent
 */
function removeTreeFromElement()/*: void*/ {
    this.emitSync("willDetachFromParent");
    this[_renderElement].removeChild(this.elementTree);
    this[_renderElement] = null;
    this[_attached] = false;
    this.emit("didDetachFromParent");
}

/**
 * Adds the view's tree to the render element
 * @private
 * @emits willAttachToParent, didAttachToParent
 */
function addTreeToElement()/*: void*/ {
    this.emitSync("willAttachToParent");
    this[_renderElement].appendChild(this.elementTree);
    this[_attached] = true;
    this.emit("didAttachToParent");
}

/**
 * Finds an element starting from the starting target and progressing up the DOM tree until
 * an element matching the specified selector is located. Searching stops once stoppingAt is
 * reached.
 *
 * This is used by triggerTargetSelectors so as to find the element that we need to pass to
 * event handlers. Should the app want a list item, it's possible the event was actually
 * triggered from a DIV deeply nested within. This lets us find the list item and pass that
 * on as appropriate. The original target is still accessible.
 *
 * Return `null` if there is no match located.
 *
 * @param {string} selector
 * @param {Node} startingTarget
 * @param {Node} stoppingAt
 * @returns {Node}
 */
function findElementMatchingSelectorLocally(selector/*: string*/, startingTarget/*: Node*/, stoppingAt/*: Node*/)/*: Node*/ {
    let curTarget = startingTarget;
    let matches = false;
    while (curTarget && !(matches = matchesSelector(curTarget, selector)) && (curTarget !== stoppingAt)) {
        curTarget = curTarget.parentNode;
    }
    return (matches ? curTarget : null);
}
/**
 * Given an event, this triggers all the target selectors
 *
 * Selectors are of the form "event:CSS Selector". As an example "tap:ul li > button".
 *
 * Once an event's target matches a selector, the corresponding event is emitted.
 *
 * @param  {event} e DOM event
 * @private
 */
function triggerTargetSelectors(e/*: Event*/)/*: void*/ {
    const targetSelectors = this[_targetSelectors];
    for (let [eventAndSelector, emitSet] of targetSelectors) {
        let [eventFilters, selector] = eventAndSelector.split(":");
        selector = selector.trim();
        eventFilters = eventFilters.trim().split(" ");
        if (eventFilters && eventFilters.indexOf(e.type) > -1) {
            let curTarget = findElementMatchingSelectorLocally(selector, e.target, this.elementTree);
            if (curTarget) {
                for (let emit of emitSet) {
                    this.emit(emit, curTarget, e);
                }
            }
        }
    }
}

/**
 * View Class
 */
export default class View extends Emitter {
    constructor({deferRendering = false, subviews = [], renderElement = null, themeManager = null} = {}) {
        super();
        this[_subviews] = [];
        subviews.forEach(v => this.addSubview(v));
        this[_parentView] = null;
        this[_elementTree] = null;
        this[_renderElement] = renderElement;
        this[_themeManager] = themeManager;
        this[_targetSelectors] = new Map();
        if (this.TARGET_SELECTORS) {
            this.addTargetSelectors(this.TARGET_SELECTORS);
        }
        this[_scrollTop] = 0;
        this[_attached] = false;
        this[_visible] = undefined; // use parent if we have one
        this[_display] = true;

        if (!deferRendering) { setImmediate(this.render.bind(this)); }
    }

///mark: rendering

    /**
     * Returns a DOM tree that can be rendered to the DOM
     * @return {Node|Array} DOM tree
     */
    template()/*: Node|Array*/ {
        return h.el("div.View?is=y-view", this.renderSubviews());
    }

    /**
     * Renders the return from `render` to the target element (which is the `renderElement` or the `parentNode`)
     * @param  {{stopAt: Node}} options ]   the node to stop at (renders propagate up the tree)
     */
    renderTo(options = {})/*: void*/ {
        let {stopAt} = options,
            targetEl;
        if (this.parentView && this.parentView !== stopAt) {
            this.parentView.renderTo(options);
        } else {
            if ((targetEl = (this.renderElement || (this.elementTree && this.elementTree.parentNode)))) {
                h.renderTo(this.render(), targetEl);
            }
        }
    }

    /**
     * Returns a rendered DOM tree based on `template`
     * @return {Node|Array}
     */
    render()/*: Node|Array*/ {
        if (this.elementTree) {
            h.renderTo(Array.from(this.template().children), this.elementTree);
            //h.renderTo(this.template(), this.elementTree);
        } else {
            this.elementTree = this.template();
        }
        if (this.themeManager && this.themeManager.currentTheme) {
            // make sure we handle visibility and display
            this.themeManager.currentTheme.markElementVisibility(this.elementTree, this.visible || false);
            this.themeManager.currentTheme.markElementDisplay(this.elementTree, this[_display]);
        }
        return this.elementTree;
    }

    /**
     * If a `render` event is received, render our template up to our parent
     */
    onRender()/*: void*/ {
        this.renderTo({stopAt: this.parentView});
    }

    /**
     * Utility method for quickly rendering all our subviews.
     * @return {Array<Node>} [description]
     */
    renderSubviews()/*: Array<Node>*/ {
        return this.subviews.map(function(view) {return view.render(); });
    }

///mark: events

    /**
     * Returns an array of all the target selectors that have been defined for
     * this view.
     * @return {Array}
     */
    get targetSelectors()/*: Array*/ {
        return Array.from(this[_targetSelectors]);
    }

    /**
     * Adds a target selector to the view.
     *
     * Selectors are of the form event:CSS Selector.
     *
     * @param {string} selector event:CSS Selector, like tap:ul li > button
     * @param {string} emit     the event to emit
     */
    addTargetSelector({selector/*: string*/, emit/*: string*/}) {
        const targetSelectors = this[_targetSelectors];
        let targetSet = targetSelectors.get(selector);
        if (!targetSet) {
            targetSelectors.set(selector, targetSet = new Set());
        }
        targetSet.add(emit);
    }
    /**
     * Adds many target selectors at once
     * @param {*|Array} args... ]
     */
    addTargetSelectors(...args/*: any|Array*/) {
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

    /**
     * @abstract
     *
     * Returns undefined by default, but this is intended to be overridden to return
     * an array of target selectors. These will be automatically added using `addTargetSelectors`
     * to the view when it is constructed.
     */
    get TARGET_SELECTORS() {
        return undefined;
    }

    /**
     * Returns the list of hammer events that this view will listen for. Some Hammer events preclude the ability to listen for
     * other events, hence why this is not a complete list. This should be sufficient, however, to detect taps, long presses,
     * swipes and pans.
     *
     * If you want to change the events you listen for, override this method.
     */
    get HAMMER_EVENTS() {
        return "tap press pressup panmove panstart panend swipe swipeleft swiperight";
    }

    /**
     * Returns the list of DOM events this view will listen for. Because Hammer is handling touch events, we only
     * handle typing, focus, and form events.
     *
     * If you need to change the events, override this method.
     */
    get DOM_EVENTS() {
        return "input focus blur keyup keydown change submit reset select";
    }

    /**
     * Returns this view's Hammer instance.
     * @return {Hammer}
     */
    get hammer()/*: Hammer*/ {
        return this[_hammer];
    }

    /**
     * When a Hammer event is fired, we trigger the appropriate target selectors.
     * @param  {*}      sender
     * @param  {string} notice emitted event
     * @param  {Event}  e      DOM/Hammer Event
     */
    onHammerEvent(sender/*: Object*/, notice/*: string*/, e/*: Event*/)/*: void*/ {
        triggerTargetSelectors.call(this, e);
    }

    /**
     * When a DOM  event is fired, we trigger the appropriate target selectors.
     * @param  {*}      sender
     * @param  {string} notice emitted event
     * @param  {Event}  e      DOM/Hammer Event
     */
    onDOMEvent(sender/*: Object*/, notice/*: string*/, e/*: Event*/) {
        triggerTargetSelectors.call(this, e);
    }

///mark: parent view property

    /**
     * Returns the parent view for this view
     * @return {View} This view's parent view
     */
    get parentView()/*: View*/ {
        return this[_parentView];
    }

///mark: subview handling

    /**
     * Returns this view's subviews.
     * @return {Array<View>} ]
     */
    get subviews()/*: Array<View>*/ {
        return this[_subviews];
    }

    /**
     * Adds view as a subview to this view, correctly reparenting it if necessary.
     * @param {View} v View to add as a subview
     * @emits willAddSubview, willChangeParentView, didChangeParentView, didAddSubview
     */
    addSubview(v/*: View*/)/*: void*/ {
        this.emitSync("willAddSubview", v);
        this[_subviews].push(v);
        if (v.parentView !== this) {
            v.emitSync("willChangeParentView", this);
            if (v.parentView) {
                v[_parentView].removeSubview(v);
            }
            v[_parentView] = null;
        }
        v[_parentView] = this;
        v.emit("didChangeParentView");
        this.emit("didAddSubview", v);
        this.emitSync("render");
    }

    /**
     * Removes the view from our subviews
     * @param  {View} v View to remove
     * @emits willRemoveSubview, willRemoveFromParent, didRemoveFromParent, didRemoveView
     */
    removeSubview(v/*: View*/)/*: void*/ {
        let idx;
        this.emitSync("willRemoveSubview", v);
        if ((idx = this[_subviews].indexOf(v)) > -1) {
            this[_subviews].splice(idx, 1);
            v.emitSync("willRemoveFromParent");
            v[_parentView] = null;
            v.emit("didRemoveFromParent");
        }
        this.emit("didRemoveView", v);
        this.emitSync("render");
    }

///mark: element tree property and handling

    /**
     * Returns this view's element tree
     * @return {Node}
     */
    get elementTree()/*: Node*/ {
        return this[_elementTree];
    }

    /**
     * Sets this view's element tree
     * @param  {Node} e Element Tree
     * @emits willChangeElementTree, didChangeElementTree
     */
    set elementTree(e/*: Node*/)/*: void*/ {
        this.emitSync("willChangeElementTree", e);
        this[_elementTree] = e;
        this.emit("didChangeElementTree");
    }

    /**
     * Fired when the element tree is about to be changed. Removes the tree from
     * the view's rendering element if possible (and present).
     */
    onWillChangeElementTree()/*: void*/ {
        if (this.elementTree && this.renderElement) {
            removeTreeFromElement.call(this);
        }
    }

    /**
     * When the element tree has been changed, we need to wire up any event handlers in
     * order to intercept Hammer and DOM events.
     */
    onDidChangeElementTree()/*: void*/ {
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

///mark: renderElement property
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

///mark: theme manager
    get themeManager()/*: ThemeManager*/ {
        return (this[_themeManager] ? this[_themeManager] :
                 (this.parentView ? this.parentView.themeManager : null)
               );
    }
    set themeManager(v/*: ThemeManager*/)/*: void*/ {
        this[_themeManager] = v;
        this.emit("themeManagerChanged");
        this.subviews.forEach(view => view.emit("themeManagerChanged", v));
    }
/// mark: attached
    get attached()/*: boolean*/ {
        return this[_attached];
    }
/// mark: in DOM
    get inDOM()/*: boolean*/ {
        return document.contains(this.elementTree);
    }
/// mark: visibility and display
    get visible()/*: boolean*/ {
        if (this[_visible] === undefined && this.parentView) {
            return this.parentView.visible;
        }
        return this[_visible];
    }
    set visible(v/*: boolean*/)/*: void*/ {
        this[_visible] = v;
        if (this.themeManager && this.themeManager.currentTheme) {
            this.themeManager.currentTheme.markElementVisibility(this.elementTree, v);
        }
        this.emitSync("render");
    }

    get displayed()/*: boolean*/ {
        return this[_display];
    }
    set displayed(d/*: boolean*/)/*: void*/ {
        this[_display] = d;
        if (this.themeManager && this.themeManager.currentTheme) {
            this.themeManager.currentTheme.markElementDisplay(this.elementTree, d);
        }
        this.emitSync("render");
    }

///mark: cleanup
    destroy()/*: void*/ {
        this.emitSync("willDestroy");
        this[_subviews].forEach(view => this.removeSubview(view));
        this[_subviews] = [];
        this.renderElement = null;
        this[_hammer].destroy();
        this[_hammer] = null;
        this.elementTree = null;
        super.destroy();
    }
}
