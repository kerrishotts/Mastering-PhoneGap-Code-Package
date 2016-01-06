"use strict";
import genericWidget from "./genericWidget";
export default function listItem({contents, actions, tag="li", props}={}) {
    return genericWidget({is: "y-list-item", tag, contents: [contents, actions], props});
}
