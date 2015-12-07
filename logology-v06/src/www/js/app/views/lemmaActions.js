"use strict";

import L from "$APP/localization/localization";

import glyph from "$WIDGETS/glyph";

export default function lemmaActions({isFavorite = false, hasNote = false} = {}) {
    return [ glyph({icon:"fav", contents: L.T(isFavorite ? "actions:unfavorite"
                                                         : "actions:favorite"),
                   props: { attrs: {"class": "fav-icon", "data-fav": isFavorite ? "yes" : "no",
                                    title: L.T(isFavorite ? "actions:unfavorite:title"
                                                          : "actions:favorite:title") } } }),
             /* sharing disabled for now
             glyph({icon:"share", title: L.T("actions:share:title"),    contents: L.T("actions:share")}),
              */
             glyph({icon:"note",  title: L.T("actions:note:title"),
                   props: { attrs: {"class": "note-icon", "data-note": hasNote ? "yes" : "no",
                                    title: L.T("actions:note")}} })];
}
