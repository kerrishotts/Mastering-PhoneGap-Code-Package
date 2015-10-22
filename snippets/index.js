"use strict";
/*globals Sass, setTimeout, clearTimeout, document, require, console */

var ace = require("brace");
require("brace/mode/javascript");
require("brace/mode/css");
require("brace/mode/scss");
require("brace/mode/html");
require("brace/theme/monokai");
var babel = require("babel");
var xhr = require("xhr");
var autoprefixer = require("autoprefixer-core");

var chapters = require("./chapters");

var es5Editor, es6Editor, scssEditor, cssEditor, htmlEditor;

//var oldConsole = console;
var consoleOutput = document.getElementById("consoleOutput");

var chapterSelect = document.getElementById("chapters"),
    exampleSelect = document.getElementById("examples");

function Console() {
    var console = this;

    function _print(level, data) {
        var div = document.createElement("div");
        div.textContent = "[" + level + "] " + JSON.stringify(data, null, 2);
        consoleOutput.appendChild(div);
    }
    ["log", "info", "debug", "warn", "error" ].forEach(function(level) {
        console[level] = _print.bind(console, level);
    });
    return console;
}
function clearConsole() {
    consoleOutput.innerHTML = "";
}

function populateEditor(err, resp, data) {
    if (!err) {
        this.setValue(data);
        this.clearSelection();
        this.scrollToLine(0);
    }
}

function _renderResults() {

    console.log("[INFO] Rendering code changes");

    var selectedChapter = chapterSelect.selectedIndex,
        selectedExample = exampleSelect.selectedIndex,
        example = chapters[selectedChapter].examples[selectedExample];

    var el = document.createElement("iframe");
    var resultsFrame = document.getElementById("results");
    var resultsParent = resultsFrame.parentElement;
    el.setAttribute("id", "results");
    resultsParent.removeChild(resultsFrame);
    resultsParent.appendChild(el);
    setTimeout( function() {
        var doc = el.contentDocument,
            win = el.contentWindow,
            docStyle, docScript, docHead, docBody;

        var docBase = example && example.base;
        if (docBase) {
            if (docBase.substr(docBase.length-1) !== "/") {
                docBase += "/";
            }
        }

        clearConsole();

        doc.open();

        doc.addEventListener("DOMContentLoaded", function installStylesAndScripts() {
            doc.removeEventListener("DOMContentLoaded", installStylesAndScripts);
            docHead = doc.getElementsByTagName("head")[0];
            docBody = doc.getElementsByTagName("body")[0];

            docStyle = doc.createElement("style");
            docScript = doc.createElement("script");

            docStyle.textContent = cssEditor.getValue();
            docScript.textContent = ";(function () { try { " + es5Editor.getValue() + "\n } catch(err) { console.log(err.message); } })();";
            docScript.setAttribute("type", "text/javascript");

            docHead.appendChild(docStyle);
            win.console = new Console();
            docBody.appendChild(docScript);

            setTimeout(function() {
                if (!win.cordova) {
                    // simulate Cordova deviceReady event, but only if cordova isn't defined
                    var deviceReady = doc.createEvent("Event");
                    deviceReady.initEvent("deviceready", true, true);
                    doc.dispatchEvent(deviceReady);
                }
            }, 500);
        }, false);

        doc.write(htmlEditor.getValue().replace("<!--base-->", "<base href='" + docBase + "' />"));
        doc.close();
    }, 0);
}

var renderTimer;
function renderResults() {
    if (renderTimer) {
        console.log("[INFO] Delaying render");
        clearTimeout(renderTimer);
        renderTimer = null;
    }
    renderTimer = setTimeout(function() {
        renderTimer = null;
        _renderResults();
    }, 1000);
}

function configureSelectElements() {

    function addOptions(selectEl, arr) {
        arr.map(function(item) {
            var optionEl = document.createElement("option");
            optionEl.textContent = item.name;
            return optionEl;
        }).forEach(function(optionEl) {
            selectEl.appendChild(optionEl);
        });
    }

    function loadOrClear(load, uri, editor) {
        if (load) {
            xhr({
                uri: uri
            }, populateEditor.bind(editor));
        } else {
            editor.setValue("");
        }
    }

    function loadExample() {
        var selectedChapter = chapterSelect.selectedIndex,
            selectedExample = exampleSelect.selectedIndex,
            example = chapters[selectedChapter].examples[selectedExample],
            layout = ["es6", "scss", "html"],
            allEditors = ["es6", "es5", "scss", "css", "html"];
        if (example.base) {
            consoleOutput.innerHTML = "";
            cssEditor.setValue("");
            es5Editor.setValue("");
            loadOrClear(example.html, example.base + "/index.html", htmlEditor);
            loadOrClear(example.scss, example.base + "/style.scss", scssEditor);
            loadOrClear(example.js, example.base + "/index.js", es6Editor);

            // determine the layout
            if (example.layout) {
                layout = example.layout.split(",");
            }
            allEditors.forEach(function(editor) {
                document.getElementById(editor + "-editor-group").classList.add("hidden");
            });
            layout.forEach(function(editor) {
                document.getElementById(editor + "-editor-group").classList.remove("hidden");
            });
            [es5Editor, es6Editor, cssEditor, scssEditor, htmlEditor].forEach(function(editor) {
                editor.resize();
            });
        }
    }

    function populateExamples() {
        var examples = chapters[this.selectedIndex].examples;
        exampleSelect.innerHTML = "";
        addOptions(exampleSelect, examples);
        exampleSelect.selectedIndex = 0;
    }

    function populateChapters() {
        addOptions(chapterSelect, chapters);
    }

    populateChapters();

    chapterSelect.addEventListener("change", populateExamples, false);
    exampleSelect.addEventListener("change", loadExample, false);

    return {
        populateExamples: populateExamples,
        populateChapters: populateChapters,
        loadExample: loadExample
    };
}

function configureEditors() {
    function createEditor(options) {
        var mode = options && options.mode || "ace/mode/javascript",
            el = options && options.el,
            changeHandler = options && options.onchange,
            changeDelay = options && options.changeDelay || 1000,
            debounce;
        if (!el) {
            throw new Error("createEditor needs an element");
        }

        var editor = ace.edit(el);
        editor.$blockScrolling = Infinity;
        editor.getSession().setMode(mode);
        editor.setTheme("ace/theme/monokai");

        if (typeof changeHandler === "function") {
            editor.on("change", function() {
                if (debounce !== undefined) {
                    clearTimeout(debounce);
                    debounce = undefined;
                }
                debounce = setTimeout(changeHandler.bind(editor), changeDelay);
            });
        }

        return editor;
    }

    es5Editor = createEditor({
        mode: "ace/mode/javascript",
        el: "es5-editor",
        onchange: renderResults
    });
    es6Editor = createEditor({
        mode: "ace/mode/javascript",
        el: "es6-editor",
        onchange: function() {
            es5Editor.setValue(babel.transform(this.getValue(), {stage:0}).code, -1);
        }
    });
    cssEditor = createEditor({
        mode: "ace/mode/css",
        el: "css-editor",
        onchange: renderResults
    });
    scssEditor = createEditor({
        mode: "ace/mode/scss",
        el: "scss-editor",
        onchange: function() {
            cssEditor.setValue(autoprefixer.process(Sass.compile(this.getValue())).css, -1);
        }
    });
    htmlEditor = createEditor({
        mode: "ace/mode/html",
        el: "html-editor",
        onchange: renderResults
    });
}

var selects = configureSelectElements();
configureEditors();

// if we have any parameters, parse them

function parseQueryString() {
    var queryString = window.location.search,
        queryArgs;
    if (queryString.length > 0) {
        queryArgs = queryString.substr(1).split("&");
        queryArgs.forEach(function(argKV, i) {
            setTimeout(function() {
                var argKVArr = argKV.split("="),
                    argKey = argKVArr[0],
                    argValue = argKVArr[1];
                switch (argKey) {
                    case "ch":
                        chapterSelect.selectedIndex = parseInt(argValue, 10);
                        selects.populateExamples.call(chapterSelect);
                        break;
                    case "ex":
                        exampleSelect.selectedIndex = parseInt(argValue, 10);
                        selects.loadExample();
                        break;
                    case "editors":
                        if (argValue === "no") {
                            document.querySelector(".editors").classList.add("hidden");
                        }
                        break;
                }
            }, i * 100);
        });
    }
}

document.addEventListener("DOMContentLoaded", parseQueryString, false);

function toggleVisibility() {
  this.classList.toggle("hidden");
            [es5Editor, es6Editor, cssEditor, scssEditor, htmlEditor].forEach(function(editor) {
                editor.resize();
            });
}

[["toggleES6Editor", "es6-editor-group"],
 ["toggleES5Editor", "es5-editor-group"],
 ["toggleSCSSEditor", "scss-editor-group"],
 ["toggleCSSEditor", "css-editor-group"],
 ["toggleHTMLEditor", "html-editor-group"]].forEach(function (toggler) {
  document.getElementById(toggler[0]).addEventListener("click", toggleVisibility.bind(document.getElementById(toggler[1])), false);
});
