"use strict";
import genericWidget from "./genericWidget";
export default function listItemActions({contents, tag="div", props}={}) {
    return genericWidget({is: "y-list-actions", tag, contents, props});
}
