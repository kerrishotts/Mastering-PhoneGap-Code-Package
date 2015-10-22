"use strict";

// these would be set to your actual src and build paths
var SOURCE_DIR = "/logology/src";
var BUILD_DIR = "/logology/build";

// these would be set to your assets (that don't need transformations)
// relative to SOURCE_DIR.
var ASSETS_TO_COPY = 
        [{src:  "www/*.*",         dest: "www"},
         {src:  "www/html/**/*",   dest: "www/html"},
         {src:  "www/img/**/*",    dest: "www/img"},
         {src:  "www/js/lib/**/*", dest: "www/js/lib"},
         {src:  "www/res/**/*",    dest: "www/res"}];

var projectTasks = {
  copyAssets: function() {
    return merge.apply(merge, ASSETS_TO_COPY.map(function (asset) {
        return [path.join.apply(path, [SOURCE_DIR].concat(asset.src.split("/"))),
                path.join.apply(path, [BUILD_DIR].concat(asset.dest.split("/")))];
    }));
  }
}

/**
 * STUBS to simulate path joining and task merging
 */
var path = {
    join(...args) {
        return args.join("/");
    }
}

function merge(...tasks) {
    tasks.forEach( (task) => {
        console.log(task);
    });
}
/**
 * END STUBS
 */

// gulp would call this when we run gulp copy-assets
projectTasks.copyAssets();

