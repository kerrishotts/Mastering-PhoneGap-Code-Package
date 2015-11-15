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
                {src: "../build.json",      dest: "."},
                {src: "www/*.*",            dest: "www"},
                {src: "www/html/**/*",      dest: "www/html"},
                {src: "www/img/**/*",       dest: "www/img"},
                //{src: "www/js/lib/**/*",    dest: "www/js/lib"},
                {src: "res/**/*",           dest: "res"},
                {src: "www/dicts/**/*",     dest: "www/dicts"},
                {src: "../node_modules/open-iconic/sprite/sprite.svg",
                dest: "www/img/open-iconic"}
              ],
        code: {src: "www/js/app/index.js", dest: "www/js/app"},
        styles: {src: "www/scss/app.scss",  dest: "www/css"}
    },
    lint: "src/www/js/app/**/*.js",
    "code-style": "src/www/js/app/**/*.js",
    serve: "build/www",
    watch: ["src/www/**/*"],
    reload: ["src/www/**/*.js"],
    test: {
        code: "test/*.js",
        ui: "test-ui/*.js"
    }
}

module.exports = config;
