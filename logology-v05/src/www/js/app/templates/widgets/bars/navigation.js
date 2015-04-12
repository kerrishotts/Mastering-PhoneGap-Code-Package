"use strict";
import el from "../../el";
export default function navigationBar({contents, props={}}={}) {
    return el({tag:"nav?is=y-nav", props, contents});
}
