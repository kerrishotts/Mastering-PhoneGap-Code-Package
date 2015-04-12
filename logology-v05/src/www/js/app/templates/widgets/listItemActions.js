"use strict";
import el from "../el";
export default function listItemActions({contents, tag="div", props}={}) {
    return el({tag:`${tag}?is=y-list-actions`, props, contents});
}

