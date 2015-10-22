"use strict";

import h from "yasmf-h";
import el from "$LIB/templates/el";
import L from "$APP/localization/localization";

import glyph from "$WIDGETS/glyph";
import list from "$WIDGETS/list";
import listItem from "$WIDGETS/listItem";
import listItemContents from "$WIDGETS/listItemContents";
import listItemActions from "$WIDGETS/listItemActions";
import listIndicator from "$WIDGETS/listIndicator";

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
