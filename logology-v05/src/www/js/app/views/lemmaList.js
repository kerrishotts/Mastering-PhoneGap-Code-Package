"use strict";

import h from "yasmf-h";
import el from "../templates/el";
import L from "../localization/localization";

import glyph from "../templates/widgets/glyph";
import list from "../templates/widgets/list";
import listItem from "../templates/widgets/listItem";
import listItemContents from "../templates/widgets/listItemContents";
import listItemActions from "../templates/widgets/listItemActions";
import listIndicator from "../templates/Widgets/listIndicator";

export default function lemmaList(lemmas) {
    return list({
        contents: lemmas.map( lemma => {
            return listItem({
                contents: listItemContents({
                    props: {
                        value: lemma
                    },
                    contents: [
                        h.el("div.y-flex", lemma),
                        listIndicator()
                    ]
                }),
                actions: listItemActions({
                    contents: [
                        glyph({icon:"fav", title:"Save this item as a favorite", contents: "Favorite"}),
                        glyph({icon:"share", title:"Share this item", contents: "Share"}),
                        glyph({icon:"note", title:"Create or edit a note", contents: "Note"})
                    ]
                })
           });
        })
    });
}

