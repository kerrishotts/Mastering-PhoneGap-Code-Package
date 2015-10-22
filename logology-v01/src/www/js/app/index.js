/*****************************************************************************
 *
 * Logology V{{{VERSION}}}
/* Author: {{{AUTHOR.NAME}}} <{{{AUTHOR.EMAIL}}}> <{{{AUTHOR.SITE}}}>
 *
 * This is a very simple demonstration of using gulp + ES6; it obviously
 * doesn't do anything resembling the goal of the app yet.
 *
 *****************************************************************************/

function h ( elType, ...children ) {
  let el = document.createElement(elType); 
  for (let child of children) {
      if (typeof child !== "object") {
          el.textContent = child;
      } else if (child instanceof Array) {
          child.forEach( el.appendChild.bind(el) );
      } else {
          el.appendChild( child );
      }
  }
  return el;
}

function startApp() {
  document.querySelector("#demo").appendChild(
    h("div",
      h("ul", h("li", "Some information about this app..."),
              h("li", "App name: {{{NAME}}}"),
              h("li", "App version: {{{VERSION}}}")
       )
     )
  );
}

;(function() {
    let appStartTimer;
    document.addEventListener("deviceready", () => {
        clearTimeout(appStartTimer);
        startApp();
    }, false);
    appStartTimer = setTimeout(startApp, 1000);
})();
