"use strict";
import genericWidget from "./genericWidget";
export default function scrollContainer({contents, tag="main", props}={}) {
    return genericWidget({is: "y-scroll-container", tag, contents, props});
}
