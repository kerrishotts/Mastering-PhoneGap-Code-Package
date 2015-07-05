"use strict";
import h from "yasmf-h";
import merge from "merge";

export default function el({tag, props={}, defProps={}, value, contents}) {
    let elProps = merge(defProps, props),
        args = [];
    if (value !== undefined) {
        args.push(value);
    }
    if (contents !== undefined) {
        args.push(contents);
    }
    return h.el(tag, elProps, ...args);
}
