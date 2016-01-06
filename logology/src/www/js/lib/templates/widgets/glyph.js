"use strict";
import genericWidget from "./genericWidget";

let svgIcon = require("./svg-icon").svgIcon;

export default function glyph({icon, contents, title, tag="button", props={}} = {}) {
    //return genericWidget({is:`y-${icon}-glyph`, tag, defProps:{attrs: {title}, value:icon, content:contents}, props});
    return genericWidget({is: `y-svg`, tag, contents: svgIcon(icon, contents), defProps: {attrs: {title, "class": `${icon}-icon`}, value: icon}, props});
}
