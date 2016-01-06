"use strict";
import genericWidget from "./genericWidget";
export default function textContainer({contents, tag="div", props}={}) {
    return genericWidget({is: "y-text-container", tag, contents, props});
}
