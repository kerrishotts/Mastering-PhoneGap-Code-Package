"use strict";
import el from "../el";
export default function container({contents, tag="div", props}={}) {
    return el({tag:`${tag}?is=y-container`, props, contents});
}

