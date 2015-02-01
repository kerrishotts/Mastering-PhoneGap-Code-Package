/*****************************************************************************
 *
 * Logology V{{{VERSION}}}
 * Author: {{{AUTHOR.NAME}}} <{{{AUTHOR.EMAIL}}}> <{{{AUTHOR.SITE}}}>
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
    h( "div",
      h("ul", h("li", "Hello, World"),
              h("li", "App name: {{{NAME}}}"),
              h("li", "App version: {{{VERSION}}}")
       )
     )
  );
}

//document.addEventListener("DOMContentLoaded", startApp, false);
document.addEventListener("deviceready", startApp, false);

