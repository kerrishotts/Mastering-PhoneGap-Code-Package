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
var merge = require("merge-stream");                // Allows multiple gulp actions to be processed
var rimraf = require("rimraf");                     // Akin to unix RM
var sourcemaps = require("gulp-sourcemaps");        // Generate soruce maps for debug versions
var uglify = require("gulp-uglify");                // Uglify files in release versions
var eslint = require("gulp-eslint");                // Use ESLINT for linting
var jscs = require("gulp-jscs");                    // Use JSCS for code-style checks
var sass = require("gulp-sass");                    // Compile SASS files to CSS
var autoprefixer = require("gulp-autoprefixer");    // Auto-prefix CSS
var source = require("vinyl-source-stream");
var buffer = require("vinyl-buffer");
var browserify = require("browserify");             // browserify lets us use require()
var babelify = require("babelify");                 // Use Babel to transpile our JS files in combination with browserify
var mocha = require("gulp-mocha");                  // Used for automated testing
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
         {src:  "../build.json",   dest: "."},
         {src:  "www/*.*",         dest: "www"},
         {src:  "www/html/**/*",   dest: "www/html"},
         {src:  "www/img/**/*",    dest: "www/img"},
         //{src:  "www/js/lib/**/*", dest: "www/js/lib"},
         {src:  "res/**/*",    dest: "res"},
         {src:  "../node_modules/open-iconic/sprite/sprite.svg",
          dest: "www/img/open-iconic"}
        ];

var STYLE_ENTRY_FILE = [path.join(SOURCE_DIR, "www", "scss", "app.scss")];
var STYLE_DEST = path.join(BUILD_DIR, "www", "css");

var CODE_ENTRY_FILE = path.join(SOURCE_DIR, "www", "js", "app", "index.js");
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
        .pipe(bump({
            type: importance
        }))
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
//
//        return merge(
//                gulp.src(["./build.json"])
//                    .pipe(gulp.dest(path.join(BUILD_DIR))),
//                gulp.src(["./src/www/*.*"])
//                    .pipe(gulp.dest(path.join(BUILD_DIR, "www"))),
//                gulp.src(["./src/www/html/**/*"])
//                    .pipe(gulp.dest(path.join(BUILD_DIR, "www", "html"))),
//                gulp.src(["./src/www/img/**/*"])
//                    .pipe(gulp.dest(path.join(BUILD_DIR, "www", "img"))),
//            //    gulp.src(["./src/www/js/lib/**/*"])
//            //        .pipe(gulp.dest(path.join(BUILD_DIR, "www", "js", "lib"))),
//                gulp.src(["./src/res/**/*"])
//                    .pipe(gulp.dest(path.join(BUILD_DIR, "res"))),
//                gulp.src(["node_modules/open-iconic/sprite/sprite.svg"])
//                    .pipe(gulp.dest(path.join(BUILD_DIR, "www", "img", "open-iconic"))),
//                projectTasks.copyConfig()
//            )
//            .pipe(browserSync.stream());
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
        return gulp.src(STYLE_ENTRY_FILE)
                   .pipe(isRelease ? gutil.noop() : sourcemaps.init())
                   .pipe(sass({
                     includePaths: includePaths,
                     outputStyle: (isRelease ? "compressed" : "nested")
                   }))
                   .on("error", notify.onError("SASS: <%= error.message %>"))
                   .pipe(autoprefixer({browsers: ["last 2 versions"]}))
                   .pipe(isRelease ? gutil.noop() : sourcemaps.write()) // writes .map file
                   .pipe(gulp.dest(STYLE_DEST))
                   .pipe(browserSync.stream());
    },
    /**
     * Copies all code in js/app with substitutions (so we can get the
     * version number and such) from src to build.
     */
    copyCode: function copyCode() {
        var isRelease = (BUILD_MODE === "release");
        var pm = pkg.aliases;
        return browserify(CODE_ENTRY_FILE, {
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
            .pipe(gulp.dest(CODE_DEST))
            .pipe(browserSync.stream());
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
    "copy-scss": {
        task: projectTasks.copySCSS,
        desc: "Transforms SCSS to CSS",
        help: ["Transforms the SCSS files in the source directory and writes the result to",
               "the build directory using NODE-SASS.",
               "NOTE: 'package.json' can be used to specify SCSS modules and paths to",
               "include."],
        examples: [{
            "sass": {
                "includeModules": [ "node-reset-scss" ],
                "includePaths": ["./node_modules/node-reset-scss/scss"]
            }
        }]
    },
    "copy-code": {
        task: projectTasks.copyCode,
        desc: "Transforms JS and ES2015 code",
        help: ["Transforms the JS and ES2015 code in the source directory and writes the",
               "result to the build directory. ES2015 is transpiled using Browserify and",
               "Babel. The output is controlled by various flags:",
               "    --mode=release | debug",
               "        debug: generates debugging information and source maps. DEFAULT",
               "        release: removes debugging information, source maps, and also",
               "                 uglifies the code automatically."]
    },
    "copy": {
        deps: ["copy-assets", "copy-scss", "copy-code"],
        desc: "Copies assets, styles and code"
    },
    "copy-reload": {
        deps: ["copy"],
        task: function () {browserSync.reload();}
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
    "check-types": projectTasks.checkTypes,

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
    /*"pgserve": {
        deps: ["copy"],
        task: projectTasks.pgserve
    },*/
    "test": {
        task: projectTasks.test,
        desc: "Runs code-level tests",
        help: ["Executes code-level tests in ./test using Mocha"]
    },
    "test-ui": {
        deps: ["build"],
        task: projectTasks.testUI,
        desc: "Runs UI Automation tests",
        help: ["Executes UI Automation tests in ./test using Mocha and Appium"]
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
