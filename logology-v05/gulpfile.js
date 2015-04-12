/*********************************************************************
 *
 * Build Process
 *
 * Usage
 *
 * version-bump-patch
 *   Bumps the patch version in package.json.
 *
 * version-bump-minor
 *   Bumps the minor version in package.json.
 *
 * version-bump-major
 *   Bumps the major version in package.json.
 *
 * init
 *   Initializes the cordova project, adds platforms and plugins
 *
 * clean
 *   Removes the cordova project
 *
 * build [--mode release]
 *   Builds the project, copying all assets and configuration from src
 *   to build first. If release mode is specified, code is uglified. If not
 *   sourcemaps are included. Also lints & checks source style.
 *
 * emulate --platform <platform> [--mode release]
 *   Emulates the specified platform, copying all assetss and config from
 *   src to build first. If release mode is specified, code is uglified.
 *   If not, source maps are included. Also lints & checks source style.
 *
 * run --platform <platform> [--mode release]
 *   Runs the app on the specified platform, copying all assets and config
 *   from src to build first. If release mode is specified, code is uglified.
 *   If not, source maps are included. Also lints & checks source style.
 *
 * cordova-build, cordova-emulate, cordova-run
 *   Equivalents to the build, emulate, run, without the prior file copies,
 *   linting, or style checks.
 *
 * lint
 *   lints the source code using jshint (+ES6)
 *
 * code-style
 *   checks the code style using jscs (+ES6)
 *
 * serve [--port 8080] [--mode debug|release]
 *   Start a static server on the specified port (8080 is default)
 *
 * watch [--port 8080 [--lrport ####]] [--mode debug|release]
 *   Start a live-reload server. Static content at --port; the lr server
 *   is at --lrport. Not all livereload plugins can listen on an arbitrary
 *   port, so if it doesn't work, be sure the specified port matches that
 *   of your livereload plugin.
 *
 * pgserve [--pgport 3000]
 *   Starts a phonegap serve session at the specified port. Default is at
 *   3000.
 *
 * default
 *   Start a live reload server
 *
 * AUDIT TRAIL
 * 2015.01.18 KS   Created
 *
 *********************************************************************/
/*globals require, __dirname, process */
"use strict";

var path = require("path");

var gulp = require("gulp");
var gutil = require("gulp-util");
var concat = require("gulp-concat");
var rename = require("gulp-rename");
var bump = require("gulp-bump");
var replace = require("gulp-replace-task");
var merge = require("merge-stream");
var rimraf = require("rimraf");
//var toES5 = require("gulp-6to5");
var sourcemaps = require("gulp-sourcemaps");
var uglify = require("gulp-uglify");
var jshint = require("gulp-jshint");
var jscs = require("gulp-jscs");
var plumber = require("gulp-plumber");
var livereload = require("gulp-livereload");
var http = require("http");
var st = require("st");
var sass = require("gulp-sass");
var autoprefixer = require("gulp-autoprefixer");

var source = require("vinyl-source-stream");
var buffer = require("vinyl-buffer");
var browserify = require("browserify");
var babelify = require("babelify");

var pkg = require("./package.json");

var BUILD_DIR = path.join(__dirname, "build");
var SOURCE_DIR = path.join(__dirname, "src");
var CONFIG_DIR = path.join(__dirname, "config");
var CORDOVA_CONFIG = path.join(SOURCE_DIR, "config.xml");

var PLATFORM = gutil.env.platform ? gutil.env.platform : "ios"; // or android
var BUILD_MODE = gutil.env.mode ? gutil.env.mode : "debug"; // or release
var LR_PORT = parseInt(gutil.env.lrport ? gutil.env.lrport : "35729", 10);
var SERVE_PORT = parseInt(gutil.env.port ? gutil.env.port : "8080", 10);
var PG_PORT = parseInt(gutil.env.pgport ? gutil.env.pgport : "3000", 10);

var cordova = require("cordova-tasks");
var cordovaTasks = new cordova.CordovaTasks({pkg: pkg, basePath: __dirname, buildDir: "build", sourceDir: "src",
                                             gulp: gulp, replace: replace});
/**
 * Log a done message to gulp
 */
function logDone() {
    gutil.log("... Done!");
}

/**
 * Increment the version in package.json
 * using importance to specify which portion of the version
 * is incremented.
 *
 * @param {string} importance     patch, minor, major
 */
function incVersion(importance) {
    return gulp.src(["./package.json"])
        .pipe(bump({
            type: importance
        }))
        .pipe(gulp.dest("./"));
}

var projectTasks = {
    /**
     * Initialie the project by creating the cordova app,
     * adding the plugins and platforms.
     */
    init: function init() {
        return cordovaTasks.init();
    },
    /**
     * Emulates the app using the specified platform
     */
    emulateCordova: function emulateCordova() {
        return cordovaTasks.emulate({buildMode: BUILD_MODE, platform: PLATFORM});
    },
    /**
     * runs the app on the specified platform
     */
    runCordova: function runCordova() {
        return cordovaTasks.run({buildMode: BUILD_MODE, platform: PLATFORM});
    },
    /**
     * Builds the cordova portion of the project
     */
    buildCordova: function buildCordova() {
        return cordovaTasks.build({buildMode: BUILD_MODE});
    },
    /**
     * Prepares the cordova portion of the project
     */
    prepareCordova: function prepareCordova() {
        return cordovaTasks.prepare();
    },
    /**
     * Removes the build directory (which removes the cordova
     * app as well)
     */
    clean: function clean(cb) {
        rimraf(BUILD_DIR, cb);
    },
    /**
     * Copies the configuration file, performing substitutions as
     * needed, from src to build
     */
    copyConfig: function copyConfig() {
        return cordovaTasks.copyConfig();
    },
    /**
     * Copies all the assets that don't need any substitutions from
     * src to build.
     */
    copyAssets: function copyAssets() {
        return merge(gulp.src(["./src/www/*.*"])
                .pipe(gulp.dest(path.join(BUILD_DIR, "www"))),
                gulp.src(["./src/www/html/**/*"])
                .pipe(gulp.dest(path.join(BUILD_DIR, "www", "html"))),
                gulp.src(["./src/www/img/**/*"])
                .pipe(gulp.dest(path.join(BUILD_DIR, "www", "img"))),
                gulp.src(["./src/www/js/lib/**/*"])
                .pipe(gulp.dest(path.join(BUILD_DIR, "www", "js", "lib"))),
                gulp.src(["./src/res/**/*"])
                .pipe(gulp.dest(path.join(BUILD_DIR, "res"))),
                projectTasks.copyConfig()
            )
            .pipe(livereload());
    },
    copySCSS: function copySCSS() {
        var isRelease = (BUILD_MODE === "release");
        var includePaths = [];
        var includeModules = pkg.sass && pkg.sass.includeModules;
        if (includeModules instanceof Array) {
          includePaths = includePaths.concat(includeModules.map( function (moduleName) {
            var module = require(moduleName);
            return module.includePath;
          }));
        }
        var moreIncludePaths = pkg.sass && pkg.sass.includePaths;
        if (moreIncludePaths instanceof Array) {
          includePaths = includePaths.concat(moreIncludePaths);
        }
        return gulp.src(["./src/www/scss/app.scss"])
                   .pipe(isRelease ? gutil.noop() : sourcemaps.init())
                   .pipe(sass({
                     includePaths: includePaths,
                     outputStyle: (isRelease ? "compressed" : "nested"),
                   }))
                   .on("error", gutil.log.bind(gutil, "SASS Error"))
                   .pipe(autoprefixer({browsers: ["last 2 versions"]}))
                   .pipe(isRelease ? gutil.noop() : sourcemaps.write()) // writes .map file
                   .pipe(gulp.dest(path.join(BUILD_DIR, "www", "css")))
                   .pipe(livereload());
    },
    /**
     * Copies all code in js/app with substitutions (so we can get the
     * version number and such) from src to build.
     */
    copyCode: function copyCode() {
        var isRelease = (BUILD_MODE === "release");
        return browserify("./src/www/js/app/index.js", {
                debug: !isRelease,
                standalone: "app"
            })
            .transform(babelify.configure({
                stage: 0
            }))
            .bundle()
            .on("error", gutil.log.bind(gutil, "Browserify Error"))
            .pipe(source("app.js"))
            .pipe(buffer())
            .pipe(cordovaTasks.performSubstitutions())
            .pipe(isRelease ? gutil.noop() : sourcemaps.init({
                loadMaps: true
            })) // loads map from browserify file
            .pipe(isRelease ? uglify({preserveComments:"some"}) : gutil.noop())
            .pipe(isRelease ? gutil.noop() : sourcemaps.write()) // writes .map file
            .pipe(gulp.dest(path.join(BUILD_DIR, "www", "js", "app")))
            .pipe(livereload());
    },
    /**
     * Checks our coding style using JSCS. Config file should be in CONFIG_DIR
     * /jscs.json
     */
    checkCodeStyle: function checkCodeStyle() {
        return gulp.src(["./src/www/js/app/**/*"])
            .pipe(jscs({
                configPath: path.join(CONFIG_DIR, "jscs.json"),
                esnext: true
            }));
    },
    /**
     * Checks our code using jshint. Config file should be in CONFIGDIR/
     * jshint.json
     */
    lintCode: function lintCode() {
        return gulp.src(["./src/www/js/app/**/*"])
            .pipe(jshint(path.join(CONFIG_DIR, "jshint.json")))
            .pipe(jshint.reporter('default'))
            .pipe(jshint.reporter('fail'));
    },
    /**
     * Start a local HTTP server on SERVE_PORT, serving build/www
     */
    serve: function serve(done) {
        gutil.log("HTTP Server listening on", SERVE_PORT);
        http.createServer(
            st({
                path: path.join(BUILD_DIR, "www"),
                index: 'index.html',
                cache: false
            })
        ).listen(SERVE_PORT, done);
    },
    /**
     * Start a live reload server on LR_PRT, serving build/www
     */
    watch: function watch() {
        gutil.log("Live Reload listening on", LR_PORT);
        livereload.listen({
            port: LR_PORT,
            basePath: path.join(BUILD_DIR, "www")
        });
        gulp.watch(["./src/www/**/*"], ["copy"]);
    },
    /**
     * Start a PG serve app (doesn't currently work
     * because they use process.cwd, and that interferes with gulp.
     */
    pgserve: function pgserve() {
        //gulp.watch(["./src/www/**/*"], ["copy"]);
        //process.chdir(BUILD_DIR);
        //phonegapServe.listen({
        //    port: PG_PORT
        //});
    }
};

/**
 * publicly available tasks
 */
var tasks = {
    // version
    "version-bump-patch": incVersion.bind(null, "patch"),
    "version-bump-minor": incVersion.bind(null, "minor"),
    "version-bump-major": incVersion.bind(null, "major"),

    // cordova
    "cordova-build": projectTasks.buildCordova,
    "cordova-prepare": projectTasks.prepareCordova,
    "cordova-emulate": projectTasks.emulateCordova,
    "cordova-run": projectTasks.runCordova,

    //project
    "clean": projectTasks.clean,
    "init": {
        deps: ["clean"],
        task: projectTasks.init
    },

    // copy
    "copy-assets": projectTasks.copyAssets,
    "copy-config": projectTasks.copyConfig,
    "copy-scss": projectTasks.copySCSS,
    "copy-code": projectTasks.copyCode,
    "copy": {
        deps: ["copy-assets", "copy-scss", "copy-code"]
    },

    // building / running
    "build": {
        deps: ["copy", "lint"],
        task: projectTasks.buildCordova
    },
    "emulate": {
        deps: ["copy", "lint"],
        task: projectTasks.emulateCordova
    },
    "run": {
        deps: ["copy", "lint"],
        task: projectTasks.runCordova
    },

    // code checking
    "lint": projectTasks.lintCode,
    "code-style": projectTasks.checkCodeStyle,

    // serving
    "serve": {
        deps: ["copy"],
        task: projectTasks.serve
    },
    "watch": {
        deps: ["serve", "copy"],
        task: projectTasks.watch
    },
    /*"pgserve": {
        deps: ["copy"],
        task: projectTasks.pgserve
    },*/
    "default": {
        deps: ["watch"]
    }

};

//
// register tasks with gulp
Object.keys(tasks).forEach(function(taskName) {
    var taskOpts = tasks[taskName];
    if (typeof taskOpts === "function") {
        gulp.task(taskName, taskOpts);
    } else {
        gulp.task(taskName, taskOpts.deps, taskOpts.task);
    }
});
