"use strict";

var config = require("../config");

module.exports = function showConfig() {
    console.log(JSON.stringify(config,null,2));
};
