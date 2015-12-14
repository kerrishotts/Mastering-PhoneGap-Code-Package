"use strict";

var config = {
    paths: {
        base: process.cwd(),
        dest: "build",
        src: "src",
        config: "config"
    },
    assets: {
        copy: [
                {src: "www/*.*",            dest: "www"},
                {src: "www/html/**/*",      dest: "www/html"},
                {src: "www/img/**/*",       dest: "www/img"},
                {src: "www/js/lib/**/*",    dest: "www/js/lib"},
                {src: "res/**/*",           dest: "res"}
              ],
        code: {src: "www/js/app/**/*.js",      dest: "www/js/app"}
    },
    lint: "src/www/js/app/**/*.js",
    "code-style": "src/www/js/app/**/*.js",
    serve: "build/www",
    watch: ["src/www/**/*"],
    reload: ["src/www/**/*.js"]
}

module.exports = config;
