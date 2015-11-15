/* @flow */
"use strict";

import scrollContainer from "$WIDGETS/scrollContainer";
import lemmaList from "./lemmaList";
import View from "$LIB/View";
import GCS from "$LIB/grandCentralStation";

import prefix from "prefix-property";

const kp = require("keypather")();

const prefixedJSTransition = prefix("transition"),
      prefixedCSSTransform = prefix.css("transform"),
      prefixedJSTransform  = prefix("transform");

//region private properties
//-----------------------------------------------------------------------------
const _panningItem = Symbol(),
      _panningStartX = Symbol(),
      _panningActionWidth = Symbol(),
      _filter = Symbol(),
      _filteredItems = Symbol();
//-----------------------------------------------------------------------------
//endregion

//region private methods
//-----------------------------------------------------------------------------
/**
 * Translates the element using CSS 2D transforms, optionally using animation.
 *
 * @param {Node} el - element to translate
 * @param {Number} [v=0] - pixel position to translate the elemnt to
 * @param {Boolean} [withAnimation=false] - If true, uses 100ms animation
 * @return {void}
 */
function translateElement(el: Node, v: number = 0, withAnimation: boolean = false): void {
    if (withAnimation) {
        el.style[prefixedJSTransition] = `${prefixedCSSTransform} 0.1s linear`;
        setTimeout(() => {
            el.style[prefixedJSTransition] = "";
        }, 100);
    }
    if (v!==0) {
        el.style[prefixedJSTransform] = `translateX(${v}px)`;
    } else {
        el.style[prefixedJSTransform] = "";
    }
}

/**
 * Return the internal contents and actions items in a list item
 *
 * @param {Node} listItem
 * @return {Array<Node>} array of nodes
 */
function getInternalItems(listItem: Node): Array<Node> {
    return ['y-list-contents', 'y-list-actions'].map(s => listItem.querySelector(`[is='${s}']`));
}

/**
 * Return the width of an element
 *
 * @param {Node} el
 * @return {number}
 */
function getWidth(el: Node): number {
    return el ? parseInt(window.getComputedStyle(el).getPropertyValue("width"),10) : 0;
}

/**
 * Closes a currently panned item.
 *
 * @this SearchView
 */
function closePannedItem(): void {
    if (this[_panningItem]) {
        translateElement(this[_panningItem], 0, true);
        this[_panningItem] = null;
        this[_panningStartX] = undefined;
        this[_panningActionWidth] = undefined;
    }
}

/**
 * Starts panning a list item; closes any open panned items.
 *
 * @this SearchView
 * @param {Node} listItem
 * @param {Event} evt
 */
function panItemStart(listItem: Node, evt: Event): void {
    const [panItem, actionItem] = getInternalItems(listItem);
    if (panItem !== this[_panningItem] && this[_panningItem]) {
        closePannedItem.call(this);
    }
    this[_panningActionWidth] = getWidth(actionItem);
    this[_panningItem] = panItem;
    if (this[_panningStartX] === undefined) {
        this[_panningStartX] = evt.center.x;
    }
}

/**
 * Moves the currently panning item, based on the event.
 *
 * @this SearchView
 * @param {Node} listItem
 * @param {Event} evt
 */
function panItemMove(listItem: Node, evt: Event): void {
    const panItem = this[_panningItem];
    if (panItem) {
        let startX = this[_panningStartX],
            curX = evt.center.x,
            deltaX = curX - startX;
        translateElement(panItem, deltaX);
    }
}

/**
 * Stops panning an item. Decides to slide open or closed based on the
 * last touch position in the event.
 *
 * @this SearchView
 * @param {Node} listItem
 * @param {Event} evt
 */
function panItemEnd(listItem: Node, evt: Event): void {
    const panItem = this[_panningItem],
          actionWidth = this[_panningActionWidth];
    if (panItem) {
        let startX = this[_panningStartX],
            curX = evt.center.x,
            deltaX = curX - startX,
            targetX = (actionWidth + deltaX < actionWidth / 2) ? -actionWidth : 0;
        if (targetX === 0) {
            closePannedItem.call(this);
        } else {
            translateElement(panItem, targetX, true);
        }
    }
}
//-----------------------------------------------------------------------------
//endregion

//region SearchView
//-----------------------------------------------------------------------------
export default class SearchView extends View {
    constructor (...args) {
        super(...args);

        // initialize our private properties for item panning support
        this[_panningItem] = null;
        this[_panningStartX] = undefined;
        this[_panningActionWidth] = undefined;

        // indicate that we want all dictionary items
        this[_filter] = undefined;
        this[_filteredItems] = [];
    }

    get filter() {
        return this[_filter];
    }
    set filter(f) {
        this[_filter] = f ? f.trim() : undefined;
        this.emit("filterChanged");
    }
    clearFilter() {
        this[_filter] = undefined;
        this.emit("filterChanged");
    }

    template() {
        let model = kp.get(this, "controller.model");
        let dictionaryItems = (this[_filter] ? this[_filteredItems] : model.sortedIndex).slice(0,100);
        return scrollContainer({contents: lemmaList(dictionaryItems)});
    }

    get TARGET_SELECTORS() {
        return [
            {selector: "tap:ul li > button", emit:"listItemTapped"},
            {selector: "panstart panmove panend:ul li", emit:"listItemPanned"},
            {selector: "tap:ul li div button", emit:"actionTapped"}
        ];
    }

    //region Event Handlers
    //-------------------------------------------------------------------------
    onListItemTapped(sender, notice, listItem/*, evt*/) {
        closePannedItem.call(this);
        GCS.emit("APP:DO:viewDefinition", listItem.value);
    }

    onListItemPanned(sender, notice, listItem, evt) {
        switch (evt.type) {
            case "panstart":
                panItemStart.call(this, listItem, evt);
                break;
            case "panmove":
                panItemMove.call(this, listItem, evt);
                break;
            case "panend":
                panItemEnd.call(this, listItem, evt);
                break;
        }
    }

    onActionTapped(sender, notice, action) {
        closePannedItem.call(this);
        GCS.emit(`APP:DO:${action.value}Definition`, action.parentElement.parentElement.firstChild.value);
    }

    onFilterChanged(_, notice, data) {
        let model = kp.get(this, "controller.model");
        let filter = this[_filter];
        if (filter) {
            // look up some entries!
            this[_filteredItems] = model.filteredIndex(filter);
            this.render();
            /*model.asyncFilteredIndex(filter)
                .then(entries => {
                    this[_filteredItems] = entries;
                    this.render();
                });*/
        } else {
            // back to the sorted list
            this.render();
        }
    }

    //-------------------------------------------------------------------------
    //endregion
}
//-----------------------------------------------------------------------------
//endregion

//region Factory
//-----------------------------------------------------------------------------
export function createSearchView(...args) {
    return new SearchView(...args);
}
//-----------------------------------------------------------------------------
//endregion
