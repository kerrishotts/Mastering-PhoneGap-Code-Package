"use strict";

var browserSync = require("browser-sync").get("www");

module.exports = {
    deps: ["copy"],
    task: function() {browserSync.reload();}
}
