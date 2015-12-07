/* @flow */
"use strict";

import container from "$WIDGETS/container";
import textContainer from "$WIDGETS/textContainer";
import View from "$LIB/View";
import glyph from "$WIDGETS/glyph";
import list from "$WIDGETS/list";
import listItem from "$WIDGETS/listItem";
import listItemContents from "$WIDGETS/listItemContents";
import listItemActions from "$WIDGETS/listItemActions";
import listItemSpacer from "$WIDGETS/listItemSpacer";
import listHeading from "$WIDGETS/listHeading";
import listIndicator from "$WIDGETS/listIndicator";

import h from "yasmf-h";
import L from "$APP/localization/localization";
import GCS from "$LIB/grandCentralStation";

const kp = require("keypather")();

export default class NotesView extends View {
    get TARGET_SELECTORS() {
        return [
            {selector: "input:textarea", emit: "noteEdited"}
        ];
    }

    onNoteEdited(sender, notice, textarea) {
        let model = kp.get(this, "controller.model");
        if (model) {
            model.note = textarea.value;
        }
    }

    template() {
        let model = kp.get(this, "controller.model");
        return textContainer({contents: [h.el("textarea", {content:model && model.note})]});
    }

}

export function createNotesView(options = {}) {
    return new NotesView(options);
}
