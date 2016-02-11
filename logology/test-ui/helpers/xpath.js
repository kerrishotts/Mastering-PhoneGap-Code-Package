"use strict";

function xPathUsingName(v, {partial = false} = {}) {
    return `//*[${partial ? "contains(" : ""}@content-desc|@name${partial ? "," : "="}'${v}'${partial ? ")" : ""}]`;
}

module.exports = {
    usingName:xPathUsingName
}
