"use strict";

function findElements(options) {
  var first = false,
      query,
      els;
  if (options !== undefined && typeof options === "object") {
    if (options.first !== undefined) { first = options.first; }
    if (options.query !== undefined) { query = options.query; }
  }
  els = [].slice.call(document.querySelectorAll(query));
  if (first === true) { els = [els[0]]; }
  return els;
}

console.log(findElements({query: "a", first: true})
            .map(function(o){return o.textContent;}) );
console.log(findElements({query: "a"})
            .map(function(o){return o.textContent;}) );

