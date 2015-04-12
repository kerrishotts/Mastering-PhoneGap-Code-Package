"use strict";
import el from "../el";
export default function listItemContents({contents, tag="button", props}={}) {
    return el({tag:`${tag}?is=y-list-contents`, props, contents});
}

