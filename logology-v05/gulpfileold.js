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
 *   lints the source code using eslint (+ES6)
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
 *   port, so if it doesn"t work, be sure the specified port matches that
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
/*globals require, __dirname */
"use strict";
require ("babel/register");

var path = require("path");                         // path manipulation
var gulp = require("gulp");                         // Gulp itself
var gutil = require("gulp-util");                   // Gulp utilities, like logging
var bump = require("gulp-bump");                    // Bump version numbers
var replace = require("gulp-replace-task");         // Allow replacement strings in files
var merge = require("merge-stream");                // Allows multiple gulp actions to be processed
var rimraf = require("rimraf");                     // Akin to unix RM
var sourcemaps = require("gulp-sourcemaps");        // Generate soruce maps for debug versions
var uglify = require("gulp-uglify");                // Uglify files in release versions
var eslint = require("gulp-eslint");                // Use ESLINT for linting
var jscs = require("gulp-jscs");                    // Use JSCS for code-style checks
var livereload = require("gulp-livereload");        // Used for live reloading
var http = require("http");                         // "
var st = require("st");                             // "
var sass = require("gulp-sass");                    // Compile SASS files to CSS
var autoprefixer = require("gulp-autoprefixer");    // Auto-prefix CSS
var source = require("vinyl-source-stream");
var buffer = require("vinyl-buffer");
var browserify = require("browserify");             // browserify lets us use require()
var babelify = require("babelify");                 // Use Babel to transpile our JS files in combination with browserify

var mocha = require("gulp-mocha");                  // Used for automated testing

// flow, notify, sourcemap reporter adapted from http://www.keendevelopment.ch/flow-babel-gulp-es6/
var notify = require("gulp-notify");                // used for flow
var flow = require("gulp-flowtype");                // "
//var sourcemapReporter = require("jshint-sourcemap-reporter");

var pkg = require("./package.json");                // get the package information that we'll need for configuration settings

var BUILD_DIR = path.join(__dirname, "build");
var CONFIG_DIR = path.join(__dirname, "config");

var PLATFORM = gutil.env.platform ? gutil.env.platform : "ios"; // or android
var BUILD_PLATFORMS = (gutil.env.for ? gutil.env.for : "ios,android").split(",");
var BUILD_MODE = gutil.env.mode ? gutil.env.mode : "debug"; // or release
var NO_BUILD = gutil.env.ignore ? gutil.env.ignore.indexOf("build") > -1 : false;
var TARGET_DEVICE = gutil.env.target ? "--target=" + gutil.env.target : "";
var LR_PORT = parseInt(gutil.env.lrport ? gutil.env.lrport : "35729", 10);
var SERVE_PORT = parseInt(gutil.env.port ? gutil.env.port : "8080", 10);
//var PG_PORT = parseInt(gutil.env.pgport ? gutil.env.pgport : "3000", 10);
var FAIL_ON_ERROR = gutil.env.continue ? (gutil.env.continue !== "yes") : true;
var VERBOSE = gutil.env.verbose ? (gutil.env.verbose==="yes") : false;

var cordova = require("cordova-tasks");
var cordovaTasks = new cordova.CordovaTasks({pkg: pkg, basePath: __dirname, buildDir: "build", sourceDir: "src",
                                             gulp: gulp, replace: replace});
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
        return cordovaTasks.emulate({buildMode: BUILD_MODE, platform: PLATFORM, options: [TARGET_DEVICE]});
    },
    /**
     * runs the app on the specified platform
     */
    runCordova: function runCordova() {
        return cordovaTasks.run({buildMode: BUILD_MODE, platform: PLATFORM, options: [TARGET_DEVICE]});
    },
    /**
     * Builds the cordova portion of the project
     */
    buildCordova: function buildCordova() {
        if (NO_BUILD) {
            return;
        }
        var target = TARGET_DEVICE;
        if (!target || target === "" || target === "--target=device") {
            target = "--device";
        }
        return cordovaTasks.build({buildMode: BUILD_MODE, platforms: BUILD_PLATFORMS, options: [target, "--buildConfig=build.json"]});
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
     * Copies all the assets that don"t need any substitutions from
     * src to build.
     */
    copyAssets: function copyAssets() {
        return merge(
                gulp.src(["./build.json"])
                    .pipe(gulp.dest(path.join(BUILD_DIR))),
                gulp.src(["./src/www/*.*"])
                    .pipe(gulp.dest(path.join(BUILD_DIR, "www"))),
                gulp.src(["./src/www/html/**/*"])
                    .pipe(gulp.dest(path.join(BUILD_DIR, "www", "html"))),
                gulp.src(["./src/www/img/**/*"])
                    .pipe(gulp.dest(path.join(BUILD_DIR, "www", "img"))),
            //    gulp.src(["./src/www/js/lib/**/*"])
            //        .pipe(gulp.dest(path.join(BUILD_DIR, "www", "js", "lib"))),
                gulp.src(["./src/res/**/*"])
                    .pipe(gulp.dest(path.join(BUILD_DIR, "res"))),
                gulp.src(["node_modules/open-iconic/sprite/sprite.svg"])
                    .pipe(gulp.dest(path.join(BUILD_DIR, "www", "img", "open-iconic"))),
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
                     outputStyle: (isRelease ? "compressed" : "nested")
                   }))
                   .on("error", notify.onError("SASS: <%= error.message %>"))
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
        var pm = pkg.aliases;
        return browserify("./src/www/js/app/index.js", {
                debug: !isRelease,
                standalone: "app"
            })
            .transform(babelify.configure({
                blacklist: ["flow"],
                stage: 0,
                resolveModuleSource: function (id, parent) {
                    // this method inspired by https://github.com/babel/babelify/issues/48#issuecomment-104309530
                    var matches = id.split(path.sep);
                    var firstMatch = matches[0];
                    var firstLetter;
                    if (pm && pm[firstMatch]) {
                        matches[0] = path.relative(path.dirname(parent), path.resolve(__dirname, pm[firstMatch]));
                        id = matches.join(path.sep);
                        firstLetter = id.substr(0, 1);
                        if (firstLetter !== path.sep && firstLetter !== ".") {
                            // require must indicate that it is relative, so ensure we have a ./
                            // if the resulting path is a child of the cwd
                            id = [".", id].join(path.sep);
                        }
                    }
                    return id;
                }
            }))
            .bundle()
            .on("error", notify.onError("BABEL: <%= error.message %>"))
            .pipe(source("app.js"))
            .pipe(buffer())
            .pipe(cordovaTasks.performSubstitutions())
            .pipe(isRelease ? gutil.noop() : sourcemaps.init({
                loadMaps: true
            })) // loads map from browserify file
            .pipe(isRelease ? uglify({preserveComments: "some"}) : gutil.noop())
            .pipe(isRelease ? gutil.noop() : sourcemaps.write()) // writes .map file
            .pipe(gulp.dest(path.join(BUILD_DIR, "www", "js", "app")))
            .pipe(livereload());
    },
    /**
     * Checks our code's types using Facebook's Flow: Doesn't fully support ES6 yet, though
     */
    checkTypes: function checkTypes() {
        return gulp.src("./src/**/*.js")
        .pipe(flow({
                all: false,
                weak: true,
                killFlow: false,
                beep: false,
                abort: FAIL_ON_ERROR
            }))
        .on("error", notify.onError("FLOW: <%= error.message %>"));
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
     * Checks our code using eslint.
     */
    lintCode: function lintCode() {
        return gulp.src(["./src/www/js/app/**/*.js"])
            .pipe(eslint(path.join(CONFIG_DIR, "eslint.json")))
            .pipe(eslint.format())
            .pipe(FAIL_ON_ERROR ? eslint.failOnError() : gutil.noop());
    },
    /**
     * Start a local HTTP server on SERVE_PORT, serving build/www
     */
    serve: function serve(done) {
        gutil.log("HTTP Server listening on", SERVE_PORT);
        http.createServer(
            st({
                path: path.join(BUILD_DIR, "www"),
                index: "index.html",
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
     * Start a PG serve app (doesn"t currently work
     * because they use process.cwd, and that interferes with gulp.
     */
    pgserve: function pgserve() {
        //gulp.watch(["./src/www/**/*"], ["copy"]);
        //process.chdir(BUILD_DIR);
        //phonegapServe.listen({
        //    port: PG_PORT
        //});
    },
    test: function test() {
        return gulp.src("./test/*.js", {read: false})
                   .pipe(mocha({reporter: "spec"}))
                   .on("error", notify.onError("TEST: <%= error.message %>"))
                   .once("error", function () {
                       process.exit(1);
                   })
                   .once("end", function () {
                        process.exit();
                   });
    },
    testUI: function testUI() {
        var iosUDID = gutil.env.udid;
        var profile = gutil.env.profile;
        var server = gutil.env.server || "local";

        process.env["UIA_PROFILE"] = profile;
        process.env["UIA_SERVER"] = server;
        if (VERBOSE) {
            process.env["UIA_LOGGING"] = "enabled";
        }
        if (iosUDID) {
            process.env["UIA_UDID"] = iosUDID;
        }

        return gulp.src("./test-ui/*.js", {read: false})
                   .pipe(mocha({reporter: "spec"}))
                   .on("error", notify.onError("TEST-UI: <%= error.message %>"))
                   .once("error", function () {
                       process.exit(1);
                   })
                   .once("end", function () {
                        process.exit();
                   });
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
        deps: ["copy"/*, "lint"*/],
        task: projectTasks.buildCordova
    },
    "emulate": {
        deps: ["copy"/*, "lint"*/],
        task: projectTasks.emulateCordova
    },
    "run": {
        deps: ["copy", "lint"],
        task: projectTasks.runCordova
    },

    // code checking
    "lint": projectTasks.lintCode,
    "code-style": projectTasks.checkCodeStyle,
    "check-types": projectTasks.checkTypes,

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
    "test": {
        task: projectTasks.test
    },
    "test-ui": {
        deps: ["build"],
        task: projectTasks.testUI
    },
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
