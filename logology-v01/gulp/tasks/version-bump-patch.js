"use strict";

var bump = require("../utils/bump");

module.exports = {
    task: bump.bind(null, "patch"),
    desc: "Bump patch version number",
    help: ["Increases the patch portion of the version in package.json by one. For",
           "example if package.json's version is at 1.2.3, the version after the bump",
           "will be 1.2.4"]
};

