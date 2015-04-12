"use strict";
import el from "../el";
export default function widgetGroup({contents, flex, align, props}={}) {
    let classes = [];
    if (flex) { classes.push("y-flex"); }
    if (align) { classes.push("y-group-align-" + align); }
    return el({tag:"div?is=y-widget-group", defProps: {attrs:{"class": classes.join(" ")}}, props, contents});
}

