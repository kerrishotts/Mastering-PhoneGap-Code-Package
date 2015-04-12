"use strict";
import el from "../el";
export default function glyph({icon, contents, title, tag="button", props={}} = {}) {
    return el({tag:tag + "?is=y-" + icon + "-glyph", defProps:{attrs: {title}, value:icon, content:contents}, props});
}

