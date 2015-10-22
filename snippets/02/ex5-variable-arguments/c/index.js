"use strict";

function interpolate ( str ) {
  var args = [].slice.call(arguments,1);
  return args.reduce( function (prev, cur, idx) {
    return prev.replace(new RegExp(":" + (idx+1), "g"), cur);
  }, str);
}
console.log(interpolate("My name is :1 and I say :2", "Bob", "Hello"));
// My name is Bob and I say Hello

