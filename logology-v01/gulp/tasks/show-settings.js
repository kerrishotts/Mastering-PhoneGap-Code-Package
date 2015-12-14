"use strict";

var settings = require("../settings");

module.exports = function showSettings() {
    console.log(JSON.stringify(settings, null, 2));
};
