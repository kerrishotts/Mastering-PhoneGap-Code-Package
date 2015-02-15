/*****************************************************************************
 *
 * Logology V{{{VERSION}}}
/* Author: {{{AUTHOR.NAME}}} <{{{AUTHOR.EMAIL}}}> <{{{AUTHOR.SITE}}}>
 *
 * This is a very simple demonstration of using gulp + ES6; it obviously
 * doesn't do anything resembling the goal of the app yet.
 *
 *****************************************************************************/

import 'babel/polyfill';
import h from 'yasmf-h';

export var app = {
    start: function start() {
        var n = h.el("div",
            h.el("ul",
                h.el("li", "Some information about this app..."),
                h.el("li", "App name: {{{NAME}}}"),
                h.el("li", "App version: {{{VERSION}}}")
            )
        );
        h.renderTo(n, document.querySelector("#demo"));
    }
};

//document.addEventListener("deviceready", startApp, false);
document.addEventListener("DOMContentLoaded", app.start, false);

