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
      let paragraphs = [
        "This is a story. A very long story. A story so long that you are apt to be unable to read to the end.",
        "It is also a story in which nothing much happens. Except for the heat-death of the universe, which I suppose might be seen as pretty exciting for the first few trillion years, but quickly becomes boring when nothing much is going on for the remainder of eternity itself.",
        "Of course, if you're reading this, something interesting has happened, and so maybe there is some small shred of hope after all. But don't worry -- entropy must always increase, and so pretty soon that interestingness will fade away into cosmic uniformity.",
        "For some reason that sounds terribly defeatist, and I suppose one could look at it that way. On the other hand, it can also encourage each one of us to cherish the moments that we get to experience, precisely because those moments are transitory and fleeting. Perhaps therein lies the true meaning of life and death: everything is fleeting, and that makes it all the more special.",
        "And so with all of that out of the way, the story can now begin. You might ask where we will start, but therein lies a fundamental problem: how do we define \"beginning\"? That's a difficult question, and it no doubt depends upon your particular philosophical bent."
      ];
      let n =
        h.el("div.ui-view-container",
             [ h.el("div.ui-navigation-bar", "Logology {{{VERSION}}}"),
               h.el("div.ui-scroll-container", paragraphs.map(content => h.el("p",content))),
               h.el("div.ui-tool-bar", [
                 h.a("Add")
               ])
             ]
        );
        h.renderTo(n, document.querySelector("#rootContainer"));
    }
};

//document.addEventListener("deviceready", startApp, false);
document.addEventListener("DOMContentLoaded", app.start, false);

