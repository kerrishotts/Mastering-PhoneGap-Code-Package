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

import dictionariesList from "./dictionariesList";

const kp = require("keypather")();

export default class MenuView extends View {
    get TARGET_SELECTORS() {
        return [
            {selector: "tap:ul li > button", emit: "listItemTapped"}
        ];
    }

    template() {
        const model = kp.get(this, "controller.model");
        return scrollContainer({contents: dictionariesList(model)});
    }

    onListItemTapped(sender, notice, listItem/*, evt*/) {
        alert(listItem.textContent);
    }
}

export function createMenuView(...args) {
    return new MenuView(...args);
}
