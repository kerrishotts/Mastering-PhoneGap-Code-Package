"use strict";
import genericWidget from "./genericWidget";
export default function listHeading({contents, tag="li", props}={}) {
    return genericWidget({is:"y-list-heading", tag, contents, props});
}
