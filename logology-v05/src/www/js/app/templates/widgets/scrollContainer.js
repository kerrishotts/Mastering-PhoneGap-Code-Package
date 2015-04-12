"use strict";
import el from "../el";
export default function scrollContainer({contents, tag="main", props}={}) {
    return el({tag:`${tag}?is=y-scroll-container`, props, contents});
}

