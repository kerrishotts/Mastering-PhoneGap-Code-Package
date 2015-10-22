"use strict";

function mul(a, b, log) {
  var ans = a * b;
  if (log === true) {
    console.log ([a, b, ans]);
  }
}
mul(2,4);      // doesn't log anything
mul(4,8,true); // logs 4 8 32

