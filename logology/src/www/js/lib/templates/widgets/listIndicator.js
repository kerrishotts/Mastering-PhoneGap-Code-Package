"use strict";
import glyph from "./glyph";
//import genericWidget from "./genericWidget";
export default function listIndicator({tag="div", props} = {}) {
    return glyph({icon: "list-indicator", tag, props});
    // return genericWidget({is: "y-indicator", tag, props});
}
