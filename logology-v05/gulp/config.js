"use strict";

var config = {
    paths: {
        dest: "build",
        src: "src",
        config: "config"
    },
    assets: {
        copy: [
                {src: "www/*.*",            dest: "www"},
                {src: "www/html/**/*",      dest: "www/html"},
                {src: "www/img/**/*",       dest: "www/img"},
                {src: "www/js/lib/**/*",    dest: "www/js/lib/**/*"},
                {src: "res/**/*",           dest: "res"},
                {src: "../node_modules/open-iconic-sprite/sprite.svg",
                dest: "www/img/open-iconic"}
              ],
        code: [
                {src: "www/js/app/**/*.js", dest: "www/js/app"}
              ],
        sass: [
                {src: "www/scss/app.scss",  dest: "www/css"}
              ]
    },
    lint: ["src/www/js/app/**/*.js"],
    "code-style": ["src/www/js/app/**/*.js"],
    watch: ["src/www/**/*"],
    reload: ["src/www/**/*.js"]
}

module.exports = config;
