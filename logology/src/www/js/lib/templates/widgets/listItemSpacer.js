"use strict";
import genericWidget from "./genericWidget";
export default function listItemSpacer({contents, tag="li", props}={}) {
    return genericWidget({is: "y-list-item-spacer", tag, contents: [contents], props});
}
