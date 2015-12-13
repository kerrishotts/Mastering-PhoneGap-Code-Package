"use strict";
import genericWidget from "./genericWidget";
export default function widgetGroup({contents, flex, align, props}={}) {
    let classes = [];
    if (flex) { classes.push("y-flex"); }
    if (align) { classes.push("y-group-align-" + align); }
    return genericWidget({is: "y-widget-group", tag: "div", contents, props, defProps: {attrs: {"class": classes.join(" ")}}});
}
