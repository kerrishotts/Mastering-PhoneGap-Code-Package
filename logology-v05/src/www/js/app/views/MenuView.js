/* @flow */
"use strict";

import scrollContainer from "../templates/widgets/scrollContainer";
import View from "../../lib/View";
import glyph from "../templates/widgets/glyph";
import list from "../templates/widgets/list";
import listItem from "../templates/widgets/listItem";
import listItemContents from "../templates/widgets/listItemContents";
import listItemActions from "../templates/widgets/listItemActions";
import listIndicator from "../templates/Widgets/listIndicator";

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
