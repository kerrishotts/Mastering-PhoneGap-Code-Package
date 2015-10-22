"use strict";

//import h from "yasmf-h";
//import el from "../templates/el";
//import L from "../localization/localization";

import scrollContainer from "$WIDGETS/scrollContainer";
import lemmaList from "./lemmaList";
import View from "$LIB/View";

const kp = require("keypather")();

export default class SearchView extends View {
    get TARGET_SELECTORS() {
        return [
            {selector: "tap:ul li > button", emit:"listItemTapped"},
            {selector: "panstart panmove panend:ul li", emit:"listItemPanned"}
        ];
    }
    template() {
        return scrollContainer({contents: lemmaList(kp.get(this, "controller.model.sortedIndex"))});
    }
    onListItemTapped(sender, notice, listItem/*, evt*/) {
        listItem.style.backgroundColor = "blue";
    }
    onListItemPanned(sender, notice, listItem, evt) {
        let startX, curX, deltaX;
        let panItem = listItem.querySelector("[is='y-list-contents']");
        let actionItem = listItem.querySelector("[is='y-list-actions']");
        let actionWidth = 0;
        let state = 0;
        if (actionItem) {
            actionWidth = parseInt(window.getComputedStyle(actionItem).getPropertyValue("width"), 10);
        }
        switch (evt.type) {
            case "panstart":
                panItem.setAttribute("data-y-pan-start-x", evt.center.x);
                break;
            case "panmove":
                startX = panItem.getAttribute("data-y-pan-start-x");
                if (startX !== "" && startX !== null) {
                    curX = evt.center.x;
                    deltaX = curX - startX;
                    panItem.style.webkitTransform = `translateX(${deltaX}px)`;
                }
                break;
            case "panend":
                startX = panItem.getAttribute("data-y-pan-start-x");
                if (startX !== "" && startX !== null) {
                    curX = evt.center.x;
                    deltaX = curX - startX;
                    if (actionWidth + deltaX < actionWidth / 2) { state = 1; }
                    panItem.removeAttribute("data-y-pan-start-x");
                    panItem.style.webkitTransition = "-webkit-transform 0.1s linear";
                    panItem.style.webkitTransform = `translateX(${state === 0 ? 0 : -actionWidth}px)`;
                    setTimeout(() => {
                        panItem.style.webkitTransition = "";
                        if (state === 0) { panItem.style.webkitTransform = ""; }
                    }, 100);
                }
                break;
        }
    }
}
