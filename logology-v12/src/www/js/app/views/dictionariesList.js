"use strict";

import h from "yasmf-h";
import el from "$LIB/templates/el";
import L from "$APP/localization/localization";

import glyph from "$WIDGETS/glyph";
import list from "$WIDGETS/list";
import listItem from "$WIDGETS/listItem";
import listItemContents from "$WIDGETS/listItemContents";
import listIndicator from "$WIDGETS/listIndicator";

export default function dictionariesList(dictionaries) {
    return dictionaries.dictionaries.map(dictionaryName => {
        return listItem({
            contents: listItemContents({
                props: {
                    value: dictionaryName
                },
                contents: [
                    h.el("div.y-flex", dictionaryName),
                    listIndicator()
                ]
            })
        });
    });
}
