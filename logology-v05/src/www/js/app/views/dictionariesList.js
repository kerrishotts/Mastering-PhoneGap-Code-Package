"use strict";

import h from "yasmf-h";
import el from "../templates/el";
import L from "../localization/localization";

import glyph from "../templates/widgets/glyph";
import list from "../templates/widgets/list";
import listItem from "../templates/widgets/listItem";
import listItemContents from "../templates/widgets/listItemContents";
import listIndicator from "../templates/Widgets/listIndicator";

export default function dictionariesList(dictionaries) {
    return list({
        contents: dictionaries.dictionaries.map( dictionaryName => {
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
        })
    });
}

