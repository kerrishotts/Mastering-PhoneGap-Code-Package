"use strict";
import genericWidget from "./genericWidget";
export default function listItemContents({contents, tag="button", props}={}) {
    return genericWidget({is: "y-list-contents", tag, contents, props});
}
