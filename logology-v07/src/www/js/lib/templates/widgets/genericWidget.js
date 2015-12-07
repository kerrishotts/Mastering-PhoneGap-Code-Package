"use strict";
import el from "../el";
export default function genericWidget({contents, tag="div", is, props, defProps, value}={}) {
    return el({tag:`${tag}${is ? `?is=${is}` : ""}`, defProps, props, contents, value});
}
