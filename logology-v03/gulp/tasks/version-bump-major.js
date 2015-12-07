"use strict";

var bump = require("../utils/bump");

module.exports = {
    task: bump.bind(null, "major"),
    desc: "Bump major version number",
    help: ["Increases the major portion of the version in package.json by one. For",
            "example, if package.json's version is at 1.2.3, the version after the bump",
            "will be 2.0.0"]
};

