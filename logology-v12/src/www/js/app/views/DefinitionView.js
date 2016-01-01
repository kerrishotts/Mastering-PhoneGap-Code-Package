/* @flow */
"use strict";

import scrollContainer from "$WIDGETS/scrollContainer";
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
import {getSettings} from "$MODELS/settings";
let settings = getSettings();

const kp = require("keypather")();

export default class DefinitionView extends View {
    get TARGET_SELECTORS() {
        return [
            {selector: "tap spacepressed:ul li > button", emit: "externalResourceTapped"}
        ];
    }

    onExternalResourceTapped(sender, notice, listItem) {
        let model = kp.get(this, "controller.model");
        if (!model) {model = {lemma: ""};}
        GCS.emit("APP:DO:URL", listItem.value.replace("%WORD%", model.lemma));
    }

    template() {
        let model = kp.get(this, "controller.model");
        if (!model) {model = {entries: []}};  // we need to support an empty set of entries
        return scrollContainer({
            contents:
            [
                textContainer({contents: h.h2(model.lemma)}),
                textContainer({contents: h.ol(
                        model.entries.map(d => h.li([
                            h.el("span.pos", d.partOfSpeech),
                            h.el("span.def", d.gloss)
                        ]))
                )}),
                list({
                    contents: Object.entries(settings.externalResources).map(([k,v]) => {
                        return listItem({
                            contents: listItemContents({
                                props: {
                                    value: v
                                },
                                contents: h.el("div.y-flex", L.T("actions:external", {resource: k}))
                            })
                        });
                    })
                })
            ]
        });
    }

}

export function createDefinitionView(options = {}) {
    return new DefinitionView(options);
}
