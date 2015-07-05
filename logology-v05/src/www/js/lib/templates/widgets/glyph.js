"use strict";
import genericWidget from "./genericWidget";
export default function glyph({icon, contents, title, tag="button", props={}} = {}) {
    return genericWidget({is:`y-${icon}-glyph`, tag, defProps:{attrs: {title}, value:icon, content:contents}, props});
}
