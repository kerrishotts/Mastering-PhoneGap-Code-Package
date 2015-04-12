"use strict";
import el from "../el";
export default function listIndicator({tag="div", props} = {}) {
    return el({tag:`${tag}?is=y-indicator`, props});
}

