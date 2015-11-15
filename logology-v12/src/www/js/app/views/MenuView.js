/* @flow */
"use strict";

import scrollContainer from "$WIDGETS/scrollContainer";
import View from "$LIB/View";
import glyph from "$WIDGETS/glyph";
import list from "$WIDGETS/list";
import listItem from "$WIDGETS/listItem";
import listItemContents from "$WIDGETS/listItemContents";
import listItemActions from "$WIDGETS/listItemActions";
import listIndicator from "$WIDGETS/listIndicator";

import h from "yasmf-h";
import L from "$APP/localization/localization";
import GCS from "$LIB/grandCentralStation";

import dictionariesList from "./dictionariesList";

const kp = require("keypather")();


export default class MenuView extends View {
    get TARGET_SELECTORS() {
        return [
            {selector: "tap:ul li > button:not([value^='APP:'])", emit: "dictionaryItemTapped"},
            {selector: "tap:ul li > button[value^='APP:']", emit: "navItemTapped"}
        ];
    }
    
    get MENU_ITEMS() {
        return [
            {label: "nav:get-more-dictionaries", emit: "APP:DO:moreDictionaries"},
            {label: "nav:readability", emit:"APP:DO:readability"},
            {label: "nav:about", emit:"APP:DO:about"}];        
    }

    template() {
        const model = kp.get(this, "controller.model"); // get the dictionary list model
        // return a list of all the available dictionaries along with options for downloading
        // more and changing settings.
        return scrollContainer({contents: list({
            contents: dictionariesList(model).concat(this.MENU_ITEMS.map(item => {
                    return  listItem({
                        contents: listItemContents({
                            props: {
                                value: item.emit
                            },
                            contents: [
                                h.el("div.y-flex",L.T(item.label) ),
                                listIndicator()
                            ]
                        })
                    });
                }))
            })
        });
    }

    onDictionaryItemTapped(sender: Object, notice: string, listItem: Node) {
        GCS.emit("APP:DO:viewDictionary",listItem.value);   // select another dictionary
        GCS.emit("APP:DO:menu");   // close the sidebar
    }
    
    onNavItemTapped(sender: Object, notice: string, listItem: Node) {
        GCS.emit(listItem.value);   // notify the app that it needs to navigate
        GCS.emit("APP:DO:menu");   // close the sidebar
    }
}

export function createMenuView(options = {}) {
    return new MenuView(options);
}
