"use strict";

var merge = require("merge-stream"),
    gulp = require("gulp"),
    config = require("../config"),
    paths = require("../utils/paths"),
    copyConfig = require("./copy-config").task,
    browserSync = require("browser-sync").get("www");

function copyAssets() {
    return merge.apply(merge, config.assets.copy.map(function (asset) {
        var fqSourcePath = paths.makeFullPath(asset.src, paths.SRC);
        var fqTargetPath = paths.makeFullPath(asset.dest, paths.DEST);
        return gulp.src([fqSourcePath])
                   .pipe(gulp.dest(fqTargetPath));
    }).concat(copyConfig()))
    .pipe(browserSync.stream());
}

module.exports = {
    task: copyAssets,
    desc: "Copies non-transformable assets",
    help: ["Copies files that don't need transformations to the build directory.",
            "Equivalent to 'cp' or 'copy' command."]
}
