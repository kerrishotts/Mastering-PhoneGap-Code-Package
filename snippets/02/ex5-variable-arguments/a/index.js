"use strict";

function sum() {
  var args = [].slice.call(arguments);
  return args.reduce(
    function(prev, cur) {
      return prev+cur;
    }, 0);
}
console.log(sum(1, 2, 3, 4, 5)); // 15

