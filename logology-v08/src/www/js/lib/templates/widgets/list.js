"use strict";
import genericWidget from "./genericWidget";
export default function list({contents, tag="ul", props} = {}) {
    return genericWidget({is:"y-list", tag, contents, props});
}
