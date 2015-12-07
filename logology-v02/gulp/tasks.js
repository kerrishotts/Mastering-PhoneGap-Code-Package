"use strict";

var path = require("path");

var tasks = require("require-all")(path.join(__dirname, "tasks"));
var help = require("./help");

tasks.help.task = help.bind(null, tasks);

module.exports = tasks;
