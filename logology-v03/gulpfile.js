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

var source = require("vinyl-source-stream");
var buffer = require("vinyl-buffer");
var browserify = require("browserify");
var babelify = require("babelify");

var cordovaLib = require("cordova-lib");
var cordova = cordovaLib.cordova.raw;
//var phonegapServe = require("connect-phonegap");

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

/**
 * Log a done message to gulp
 */
function logDone() {
    gutil.log("... Done!");
}

/**
 * Performs substitutions from package.json on a gulp stream.
 *
 * {{{VERSION}}} is replaced with version
 * {{{NAME}}} is replaced with cordova.name
 * {{{ID}}} is replaced with cordova.id
 * {{{DESCRIPTION}}} is replaced with cordova.description
 * {{{AUTHOR.NAME}}} is replaced with cordova.author.name
 * {{{AUTHOR.EMAIL}}} is replaced with cordova.author.email
 * {{{AUTHOR.SITE}}} is replaced with cordova.author.site
 * {{{PREFS}}} is repalced with cordova.preferences
 * {{{ICONS}}} is replaced with cordova.icons
 * {{{SPLASHES}}} is replaced with cordova.splashes
 * {{{GAP:PLUGINS}}} is replaced with cordova.plugins; suitable for pg build
 * {{{GAP:ICONS}}} is replaced with cordova.icons; suitable for pg build
 * {{{GAP:SPLASHES}}} is replaced with cordova.splashes; suitable for pg build
 */
function performSubstitutions() {

    /**
     * convert cordova.preferences in package.json into a format
     * suitable for config.xml
     */
    function transformCordovaPrefs() {
        var template = '<preference name="{{{NAME}}}" value="{{{VALUE}}}" />';
        if (pkg.cordova && pkg.cordova.preferences instanceof Object) {
            return Object.keys(pkg.cordova.preferences).map(function(prefName) {
                var str = template.replace(/{{{NAME}}}/g, prefName)
                    .replace(/{{{VALUE}}}/g, pkg.cordova.preferences[prefName]);
                return str;
            }).join("\n  ");
        }
    }

    /**
     * convert cordova.plugins in package.json into a format suitable
     * for phonegap build; should handle versions of the form of
     * com.example.plugin@0.2.3
     *
     * TODO: add repository?
     */
    function transformCordovaPlugins() {
        var template = '<gap:plugin name="{{{ID}}}" {{{VERSION}}} src="plugins.cordova.io" />',
            versionTemplate = 'version="{{{VERSION}}}"';
        if (pkg.cordova && pkg.cordova.plugins instanceof Array) {
            return pkg.cordova.plugins.map(function(p) {
                var plugin_split = p.split("@"),
                    plugin_id = plugin_split[0],
                    plugin_version = plugin_split[1],
                    str = "",
                    strVersion = "";
                if (plugin_version !== undefined) {
                    strVersion = versionTemplate.replace(/{{{VERSION}}}/g, plugin_version);
                }
                str = template.replace(/{{{ID}}}/g, plugin_id)
                    .replace(/{{{VERSION}}}/g, strVersion);
                return str;
            }).join("\n  ");
        }
    }

    /**
     * Create an icon or splash XML item
     */
    function transformAssets(template, platform, asset) {
        return template.replace(/{{{SRC}}}/g, asset.src)
            .replace(/{{{PLATFORM}}}/g, platform)
            .replace(/{{{QUALIFIER}}}/g, asset.d ? ('gap:qualifier="' + asset.d + '"') : "")
            .replace(/{{{DENSITY}}}/g, asset.d ? ('density="' + asset.d + '"') : "")
            .replace(/{{{W}}}/g, asset.w ? ('width="' + asset.w + '"') : "")
            .replace(/{{{H}}}/g, asset.h ? ('height="' + asset.h + '"') : "");
    }

    /**
     * Create a list of icons or splash screens
     * @param t {string} icon | splash
     * @param which {number} 0 | 1  (cordova | phonegap build)
     */
    function transformCordovaAssets(t, which) {
        var templates = ['<' + t + ' src="{{{SRC}}}" platform="{{{PLATFORM}}}" {{{DENSITY}}} {{{W}}} {{{H}}} />',
            '<' + t + ' src="{{{SRC}}}" gap:platform="{{{PLATFORM}}}" {{{QUALIFIER}}} {{{W}}} {{{H}}} />'
        ];
        var template = templates[which];
        var str = "";
        if (pkg.cordova && pkg.cordova.platforms instanceof Array &&
            pkg.cordova[t] instanceof Object) {
            str = pkg.cordova.platforms.map(function(platform) {
                var assetList = pkg.cordova[t][platform];
                if (assetList instanceof Array) {
                    return assetList.map(transformAssets.bind(null, template, platform)).join("\n  ");
                }
            }).join("\n  ");
        }
        return str;
    }

    return replace({
        patterns: [{
            match: /{{{VERSION}}}/g,
            replacement: pkg.version
        }, {
            match: /{{{ID}}}/g,
            replacement: pkg.cordova.id
        }, {
            match: /{{{NAME}}}/g,
            replacement: pkg.cordova.name
        }, {
            match: /{{{DESCRIPTION}}}/g,
            replacement: pkg.cordova.description
        }, {
            match: /{{{AUTHOR.NAME}}}/g,
            replacement: pkg.cordova.author.name
        }, {
            match: /{{{AUTHOR.EMAIL}}}/g,
            replacement: pkg.cordova.author.email
        }, {
            match: /{{{AUTHOR.SITE}}}/g,
            replacement: pkg.cordova.author.site
        }, {
            match: /{{{PREFS}}}/g,
            replacement: transformCordovaPrefs
        }, {
            match: /{{{ICONS}}}/g,
            replacement: transformCordovaAssets.bind(null, "icon", 0)
        }, {
            match: /{{{SPLASHES}}}/g,
            replacement: transformCordovaAssets.bind(null, "splash", 0)
        }, {
            match: /{{{GAP:PLUGINS}}}/g,
            replacement: transformCordovaPlugins
        }, {
            match: /{{{GAP:ICONS}}}/g,
            replacement: transformCordovaAssets.bind(null, "icon", 1)
        }, {
            match: /{{{GAP:SPLASHES}}}/g,
            replacement: transformCordovaAssets.bind(null, "splash", 1)
        }]
    });
}

// cordova commands
// inspired by https://github.com/kamrik/CordovaGulpTemplate/blob/master/gulpfile.js
var cordovaTasks = {
    /**
     * Creates the cordova project based on the settings in package.json
     * cordova.id specifies the app's id
     * cordova.name specifies the app's display name
     * cordova.template specifies where the initial template should come from
     *    TODO: maybe the above should be removed and www just deleted?
     *    TODO: that said, if we don't specify one, default gets downloaded
     */
    create: function create() {
        gutil.log("Creating Cordova project at " + BUILD_DIR);
        gutil.log("...  ID:", pkg.cordova.id);
        gutil.log("...NAME:", pkg.cordova.name);
        gutil.log("... SRC:", pkg.cordova.template);
        return cordova.create(BUILD_DIR, pkg.cordova.id,
                pkg.cordova.name, {
                    lib: {
                        www: {
                            url: path.join(__dirname, pkg.cordova.template),
                            link: false
                        }
                    }
                })
            .then(logDone);
    },
    /**
     * All cordova commands other than create need to be in the project's
     * directory. This will change the current working directory to the
     * cordova project directory.
     */
    cdProject: function cdProject() {
        process.chdir(path.join(BUILD_DIR, "www"));
        gutil.log("... CWD:", process.cwd());
    },
    /**
     * Changes back to the (meta-) project's directory after a cordova
     * command
     */
    cdUp: function cdUp() {
        process.chdir("..");
        gutil.log("... CWD:", process.cwd());
    },
    /**
     * Add the plugins specified in cordova.plugins in package.json
     */
    addPlugins: function addPlugins() {
        gutil.log("Adding plugins...");
        return cordova.plugins("add", pkg.cordova.plugins)
            .then(logDone);
    },
    /**
     * Removes the plugins specified in cordova.plugins in package.json
     */
    removePlugins: function removePlugins() {
        gutil.log("Removing plugins...");
        return cordova.plugins("add", pkg.cordova.plugins.reverse())
            .then(logDone);
    },
    /**
     * Adds the platforms specified in cordova.platforms in package.json.
     * The platforms must also be added as dev dependencies.
     */
    addPlatforms: function addPlatforms() {
        function transformPlatform(platform) {
            return path.join(__dirname, "node_modules", "cordova-" + platform);
        }
        gutil.log("Adding platforms...");
        return cordova.platforms("add", pkg.cordova.platforms.map(transformPlatform))
            .then(logDone);
    },
    /**
     * build the cordova project
     */
    build: function build() {
        gutil.log("Building...", BUILD_MODE);
        return cordova.build({
                options: ["--" + BUILD_MODE]
            })
            .then(logDone);
    },
    /**
     * prepare the cordova project
     */
    prepare: function prepare() {
        gutil.log("Preparing...");
        return cordova.prepare()
            .then(logDone);
    },
    /**
     * emulate the app with the specified platform
     */
    emulate: function emulate() {
        gutil.log("Starting emulator...", PLATFORM, BUILD_MODE);
        return cordova.emulate({
                platforms: [PLATFORM],
                options: ["--" + BUILD_MODE]
            })
            .then(logDone);
    },
    /**
     * run the app on the specified platform
     */
    run: function run() {
        gutil.log("Running app on device...", PLATFORM, BUILD_MODE);
        return cordova.run({
                platforms: [PLATFORM],
                options: ["--device", "--" + BUILD_MODE]
            })
            .then(logDone);
    }
};

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
        return cordovaTasks.create()
            .then(projectTasks.copyConfig)
            .then(cordovaTasks.cdProject)
            .then(cordovaTasks.addPlugins)
            .then(cordovaTasks.addPlatforms)
            .then(cordovaTasks.cdUp);
    },
    /**
     * Emulates the app using the specified platform
     */
    emulateCordova: function emulateCordova() {
        cordovaTasks.cdProject();
        return cordovaTasks.emulate()
            .then(cordovaTasks.cdUp);
    },
    /**
     * runs the app on the specified platform
     */
    runCordova: function runCordova() {
        cordovaTasks.cdProject();
        return cordovaTasks.run()
            .then(cordovaTasks.cdUp);
    },
    /**
     * Builds the cordova portion of the project
     */
    buildCordova: function buildCordova() {
        cordovaTasks.cdProject();
        return cordovaTasks.build()
            .then(cordovaTasks.cdUp);
    },
    /**
     * Prepares the cordova portion of the project
     */
    prepareCordova: function prepareCordova() {
        cordovaTasks.cdProject();
        return cordovaTasks.prepare()
            .then(cordovaTasks.cdUp);
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
        return gulp.src(["./src/config.xml"])
            .pipe(performSubstitutions())
            .pipe(gulp.dest("./build"));
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
                   .pipe(isRelease ? gutil.noop() : sourcemaps.write(".")) // writes .map file
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
              experimental: true
            }))
            .bundle()
            .on("error", gutil.log.bind(gutil, "Browserify Error"))
            .pipe(source("app.js"))
            .pipe(buffer())
            .pipe(performSubstitutions())
            .pipe(isRelease ? gutil.noop() : sourcemaps.init({
                loadMaps: true
            })) // loads map from browserify file
            .pipe(isRelease ? uglify({preserveComments:"some"}) : gutil.noop())
            .pipe(isRelease ? gutil.noop() : sourcemaps.write(".")) // writes .map file
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
    "cordova-emulate": projectTasks.emulateCordova.bind(null, PLATFORM),
    "cordova-run": projectTasks.runCordova.bind(null, PLATFORM),

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
        deps: ["copy", "lint", "code-style"],
        task: projectTasks.buildCordova
    },
    "emulate": {
        deps: ["copy", "lint", "code-style"],
        task: projectTasks.emulateCordova
    },
    "run": {
        deps: ["copy", "lint", "code-style"],
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
