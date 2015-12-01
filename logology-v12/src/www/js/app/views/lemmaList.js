"use strict";

import h from "yasmf-h";
import el from "$LIB/templates/el";
import L from "$APP/localization/localization";

import glyph from "$WIDGETS/glyph";
import list from "$WIDGETS/list";
import listItem from "$WIDGETS/listItem";
import listItemContents from "$WIDGETS/listItemContents";
import listItemActions from "$WIDGETS/listItemActions";
import lemmaActions from "./lemmaActions";

export default function lemmaList(lemmas) {
    return list({
        contents: lemmas.map( lemma => {
            return listItem({
                contents: listItemContents({
                    props: {
                        value: lemma
                    },
                    contents: [
                        h.el("div.y-flex", lemma)
                    ]
                }),
                actions: listItemActions({ contents: lemmaActions() })
           });
        })
    });
}
