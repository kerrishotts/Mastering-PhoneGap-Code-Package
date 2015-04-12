"use strict";
import el from "../el";
export default function listItem({contents, actions, tag="li", props}={}) {
    return el({tag:`${tag}?is=y-list-item`, props, contents: [contents, actions]});
}

