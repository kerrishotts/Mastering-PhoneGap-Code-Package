"use strict";

import L from "$APP/localization/localization";

import glyph from "$WIDGETS/glyph";

export default function lemmaActions() {
    return [ glyph({icon:"fav",   title: L.T("actions:favorite:title"), contents: L.T("actions:favorite")}),
             glyph({icon:"share", title: L.T("actions:share:title"),    contents: L.T("actions:share")}),
             glyph({icon:"note",  title: L.T("actions:note:title"),     contents: L.T("actions:note")})];
}
