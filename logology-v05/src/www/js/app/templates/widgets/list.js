"use strict";
import el from "../el";
export default function list({contents, tag="ul", props} = {}) {
    return el({tag:`${tag}?is=y-list`, props, contents});
}

