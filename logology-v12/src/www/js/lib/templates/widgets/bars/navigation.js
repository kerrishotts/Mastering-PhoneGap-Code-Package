"use strict";
import genericWidget from "../genericWidget";
export default function navigationBar({contents, props={}}={}) {
    return genericWidget({is: "y-nav", tag: "nav", contents, props});
}
