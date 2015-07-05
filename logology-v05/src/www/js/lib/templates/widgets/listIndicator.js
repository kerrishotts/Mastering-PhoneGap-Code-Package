"use strict";
import genericWidget from "./genericWidget";
export default function listIndicator({tag="div", props} = {}) {
    return genericWidget({is: "y-indicator", tag, props});
}
