"use strict";
import genericWidget from "./genericWidget";
export default function container({contents, tag="div", props}={}) {
    return genericWidget({is: "y-container", tag, contents, props});
}
