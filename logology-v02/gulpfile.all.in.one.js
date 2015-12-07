/*********************************************************************
 *
 * Build Process
 *
 * Usage: run gulp help
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
var concat = require("gulp-concat");                // Concatenate files
var merge = require("merge-stream");                // Allows multiple gulp actions to be processed
var rimraf = require("rimraf");                     // Akin to unix RM
var babel = require("gulp-babel");                  // Convert ES2015 to ES5
var sourcemaps = require("gulp-sourcemaps");        // Generate soruce maps for debug versions
var uglify = require("gulp-uglify");                // Uglify files in release versions
var eslint = require("gulp-eslint");                // Use ESLINT for linting
var jscs = require("gulp-jscs");                    // Use JSCS for code-style checks
var plumber = require("gulp-plumber");
var notify = require("gulp-notify");                // used for reporting errors
var browserSync = require("browser-sync").create(); // Used for live reloading
var sprintf = require("sprintf-js").sprintf;        // used for string formatting in help

var pkg = require("./package.json");                // get the package information that we'll need for configuration settings

var PLATFORM = gutil.env.platform ? gutil.env.platform : "ios"; // or android
var BUILD_PLATFORMS = (gutil.env.for ? gutil.env.for : "ios,android").split(",");
var BUILD_MODE = gutil.env.mode ? gutil.env.mode : "debug"; // or release
var NO_BUILD = gutil.env.ignore ? gutil.env.ignore.indexOf("build") > -1 : false;
var TARGET_DEVICE = gutil.env.target ? "--target=" + gutil.env.target : "";
var LR_PORT = parseInt(gutil.env.lrport ? gutil.env.lrport : "35729", 10);
var SERVE_PORT = parseInt(gutil.env.port ? gutil.env.port : "8080", 10);
var FAIL_ON_ERROR = gutil.env.continue ? (gutil.env.continue !== "yes") : true;
var VERBOSE = gutil.env.verbose ? (gutil.env.verbose==="yes") : false;

var cordova = require("cordova-tasks");
var cordovaTasks = new cordova.CordovaTasks({pkg: pkg, basePath: __dirname, buildDir: "build", sourceDir: "src",
                                             gulp: gulp, replace: replace});
//
// CONFIGURATION SETTINGS
//
var BUILD_DIR = path.join(__dirname, "build");
var SOURCE_DIR = path.join(__dirname, "src");
var CONFIG_DIR = path.join(__dirname, "config");

var ASSETS_TO_COPY =
        [
         {src:  "www/*.*",         dest: "www"},
         {src:  "www/html/**/*",   dest: "www/html"},
         {src:  "www/img/**/*",    dest: "www/img"},
         {src:  "www/js/lib/**/*", dest: "www/js/lib"},
         {src:  "res/**/*",    dest: "res"}
        ];

var CODE_FILES = [path.join(SOURCE_DIR, "www", "js", "app", "**", "*.js")];
var CODE_DEST = path.join(BUILD_DIR, "www", "js", "app");

var CODE_STYLE_FILES = [path.join(SOURCE_DIR, "www", "js", "app", "**", "*.js")];
var CODE_LINT_FILES = [path.join(SOURCE_DIR, "www", "js", "app", "**", "*.js")];

var WATCH_FILES = [path.join(SOURCE_DIR, "www", "**", "*")];
var WATCH_FILES_RELOAD = [path.join(SOURCE_DIR, "www", "**", "*.js")];


/**
 * Increment the version in package.json
 * using importance to specify which portion of the version
 * is incremented.
 *
 * @param {string} importance     patch, minor, major
 */
function incVersion(importance) {
    return gulp.src([path.join(__dirname, "package.json")])
        .pipe(bump({type: importance}))
        .pipe(gulp.dest("."));
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
        return merge.apply(merge, ASSETS_TO_COPY.map(function (asset) {
            var fqSourcePath = path.join.apply(path, [SOURCE_DIR].concat(asset.src.split("/")));
            var fqTargetPath = path.join.apply(path, [BUILD_DIR].concat(asset.dest.split("/")));
            return gulp.src([fqSourcePath])
                       .pipe(gulp.dest(fqTargetPath));
        }).concat(projectTasks.copyConfig()))
        .pipe(browserSync.stream());
    },
    /**
     * Copies all code in js/app with substitutions (so we can get the
     * version number and such) from src to build.
     */
    copyCode: function copyCode() {
        var isRelease = (BUILD_MODE === "release");
        gulp.src(CODE_FILES)
            .pipe(cordovaTasks.performSubstitutions())
            .pipe(plumber({errorHandler: notify.onError("copy-code: <%= error.message %>")}))
            .pipe(isRelease ? gutil.noop() : sourcemaps.init())
            .pipe(babel())
            .pipe(concat("app.js"))
            .pipe(isRelease ? uglify({preserveComments: "some"}) : gutil.noop())
            .pipe(isRelease ? gutil.noop() : sourcemaps.write()) // writes .map file
            .pipe(gulp.dest(CODE_DEST))
            .pipe(browserSync.stream());
    },
    /**
     * Checks our coding style using JSCS. Config file should be in CONFIG_DIR
     * /jscs.json
     */
    checkCodeStyle: function checkCodeStyle() {
        return gulp.src(CODE_STYLE_FILES)
            .pipe(jscs({
                configPath: path.join(CONFIG_DIR, "jscs.json"),
                esnext: true
            }));
    },
    /**
     * Checks our code using eslint.
     */
    lintCode: function lintCode() {
        return gulp.src(CODE_LINT_FILES)
            .pipe(eslint(path.join(CONFIG_DIR, "eslint.json")))
            .pipe(eslint.format())
            .pipe(FAIL_ON_ERROR ? eslint.failOnError() : gutil.noop());
    },
    /**
     * Tell browser sync-attached clients to reload
     */
    reloadClients: function reloadClients() {
        browserSync.reload();
    },
    /**
     * Start a local HTTP server on SERVE_PORT, serving build/www
     */
    serve: function serve() {
        browserSync.init({
            ui: {
                port: LR_PORT
            },
            port: SERVE_PORT,
            server: {
                baseDir: path.join(BUILD_DIR, "www"),
                index: "index.html"
            }
        });
    },
    /**
     * Start a live reload server on LR_PRT, serving build/www
     */
    watch: function watch() {
        gutil.log("Now watching...");
        gulp.watch(WATCH_FILES, ["copy"]);
        gulp.watch(WATCH_FILES_RELOAD, ["copy-reload"]);
    }
};

/**
 * Display some nicely formatted help in response to gulp help.
 * Also allow filtering with --filter
 */
function showHelp() {
    var helpOnTask = gutil.env.filter ? gutil.env.filter : "";
    var task;
    var help;
    for (var taskTitle in tasks) {
        if (tasks.hasOwnProperty(taskTitle)) {
            task = tasks[taskTitle];
            if (helpOnTask !== "" && taskTitle.indexOf(helpOnTask) < 0) {
                continue;
            }
            if (typeof task !== "function" && task.desc) {
                console.log (sprintf("%-40s%40s", taskTitle, task.desc));
                if (task.help) {
                    help = task.help;
                    if (!(help instanceof Array)) {
                        help = [help];
                    }
                    help.forEach(function (text) {
                        console.log("    " + text);
                    });
                }
                if (task.examples) {
                    console.log();
                    task.examples.forEach( function (example) {
                        var lines;
                        if (example instanceof Array) {
                            lines = example;
                        } else {
                            lines = JSON.stringify(example, null, 4).split("\n");
                        }
                        lines.forEach(function (text) {
                            console.log("        " + text);
                        });
                    });
                }
                if (task.deps) {
                    console.log();
                    console.log("    Dependencies: ", task.deps.join(", "));
                }
                console.log();
            }
        }
    }
}

/**
 * publicly available tasks
 */
var tasks = {
    // help
    "help": {
        task: showHelp,
        desc: "Show help",
        help: "Displays this help. Use --filter to limit your results; case sensitive.",
        examples: ["gulp help --filter copy"]
    },
    // version
    "version-bump-patch": {
        task: incVersion.bind(null, "patch"),
        desc: "Bump patch version number",
        help: ["Increases the patch portion of the version in package.json by one. For",
               "example if package.json's version is at 1.2.3, the version after the bump",
               "will be 1.2.4"]
    },
    "version-bump-minor": {
        task: incVersion.bind(null, "minor"),
        desc: "Bump minor version number",
        help: ["Increases the minor portion of the version in package.json by one. For",
               "example, if package.json's version is at 1.2.3, the version after the bump",
               "will be 1.3.0"]
    },
    "version-bump-major": {
        task: incVersion.bind(null, "major"),
        desc: "Bump major version number",
        help: ["Increases the major portion of the version in package.json by one. For",
               "example, if package.json's version is at 1.2.3, the version after the bump",
               "will be 2.0.0"]
    },

    // cordova
    "cordova-build": projectTasks.buildCordova,
    "cordova-prepare": projectTasks.prepareCordova,
    "cordova-emulate": projectTasks.emulateCordova,
    "cordova-run": projectTasks.runCordova,

    //project
    "clean": projectTasks.clean,
    "init": {
        deps: ["clean"],
        task: projectTasks.init,
        desc: "Initializes the Cordova project",
        help: ["When executed, the build directory is removed and rebuilt. Execute this",
               "whenever you add or remove plugins and platforms."]
    },

    // copy
    "copy-assets": {
        task: projectTasks.copyAssets,
        desc: "Copies non-transformable assets",
        help: ["Copies files that don't need transformations to the build directory.",
               "Equivalent to 'cp' or 'copy' command."]
    },
    "copy-config": {
        task: projectTasks.copyConfig,
        desc: "Transforms 'config.xml'",
        help: ["Copies and populates the 'config.xml' template in the source directory and",
               "writes the result to the build directory. Most of the parameters are stored",
               "in 'package.json'."]
    },
    "copy-code": {
        task: projectTasks.copyCode,
        desc: "Transforms JS and ES2015 code",
        help: ["Transforms the JS and ES2015 code in the source directory and writes the",
               "result to the build directory. ES2015 is transpiled using Babel.",
               "The output is controlled by various flags:",
               "    --mode=release | debug",
               "        debug: generates debugging information and source maps. DEFAULT",
               "        release: removes debugging information, source maps, and also",
               "                 uglifies the code automatically."]
    },
    "copy": {
        deps: ["copy-assets", "copy-code"],
        desc: "Copies assets and code"
    },
    "copy-reload": {
        deps: ["copy"],
        task: projectTasks.reloadClients
    },

    // building / running
    "build": {
        deps: ["copy", "lint"],
        task: projectTasks.buildCordova,
        desc: "Builds the project",
        help: ["Generates a build of the project. The following flags can be used to change",
               "the build behavior.",
               "",
               "    --mode=debug | release",
               "        Specifies the build mode. Also impacts code transformation; see",
               "        copy-code. Debug is the default mode.",
               "",
               "    --for=<platforms>",
               "        Indicates the platform or platforms for which to generate a build.",
               "        If multiple platforms need to be specified, they can be separated",
               "        by a comma.",
               "",
               "    --target=<device> | device | emulator",
               "        Generates a build suitable for the specified device. The type of",
               "        device (device or emulator) can be specified generically, or a ",
               "        specific device name can be used. This name must match what one",
               "        would pass to the --target flag when using the Cordova CLI"]
    },
    "emulate": {
        deps: ["copy"/*, "lint"*/],
        task: projectTasks.emulateCordova,
        desc: "Runs the project in an emulator",
        help: ["Builds the project targeting an emulator. The emulator is then started, if",
               "possible, and the app is started within the emulator. If the emulator can't",
               "be started automatically, you should start the emulator manually prior to",
               "executing this command.",
               "",
               "    --platform=<platform>",
               "        Specifies which platform to emulate, e.g., 'ios', 'android'"]
    },
    "run": {
        deps: ["copy", "lint"],
        task: projectTasks.runCordova,
        desc: "Runs the project on a device",
        help: ["Builds the project targeting a physical device. The device must be connected",
               "to the development machine. Once connceted, the app should automatically",
               "launch on the device.",
               "",
               "    --mode=debug | release",
               "        Specifies the build mode. Also impacts code transformation; see",
               "        copy-code. Debug is the default mode.",
               "",
               "    --platform=<platform>",
               "        Specifies which platform to emulate, e.g., 'ios', 'android'"]
    },

    // code checking
    "lint": {
        task: projectTasks.lintCode,
        desc: "Lint the project code",
        help: ["Lints your project's code using eslint. The configuration is taken from",
               "<project-root>/config/eslint.json"]
    },
    "code-style": {
        task: projectTasks.checkCodeStyle,
        desc: "Check the project's code style",
        help: ["Checks your project's code style using jscs. The configuration is taken from",
               "<project-root>/config.jscs.json"]
    },

    // serving
    "serve": {
        deps: ["copy"],
        task: projectTasks.serve,
        desc: "Serves the source WWW",
        help: ["Creates a Browser Sync server that serves the source www directory. This is",
               "extremely useful when testing, both on the local development machine using",
               "Chrome or Safari, but also the device itself using either the web browser",
               "on the device or using the PhoneGap Developer app",
               "",
               "    --mode=debug | release",
               "        Affects the generated output. See copy-code for more."]
    },
    "watch": {
        deps: ["serve"],
        task: projectTasks.watch,
        desc: "Watches the source WWW",
        help: ["Creates a Browser Sync server that watches the source www directory. This is",
               "extremely useful when testing, both on the local development machine using",
               "Chrome or Safari, but also the device itself using either the web browser",
               "on the device or using the PhoneGap Developer app",
               "",
               "    --mode=debug | release",
               "        Affects the generated output. See copy-code for more."]
    },
    "default": {
        deps: ["watch"],
        desc: "Default task",
        help: "See the dependencies for more information."
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
