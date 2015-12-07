"use strict";

var path = require("path"),
    config = require("../config");

function makeFullPath(filepath, relativeTo) {
    var pathComponents = [config.paths.base];
    if (relativeTo) {
        pathComponents.push(config.paths[relativeTo]);
    }
    pathComponents = pathComponents.concat(filepath.split("/"));
    return path.join.apply(path, pathComponents);
}

module.exports = {
    SRC: "src",
    DEST: "dest",
    CONFIG: "config",
    makeFullPath: makeFullPath
};
