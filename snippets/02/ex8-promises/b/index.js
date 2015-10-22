"use strict";

function slowDiv ( a, b, success, failure ) {
  setTimeout ( function() {
    if (b === 0) { failure("Can't divide by zero"); }
    else { success(a/b); }
  }, 2500 + Math.random()*10000 );
}
slowDiv ( 10, 5, function success (result) {
  console.log(result);
}, function failure (err) {
  if (err !== undefined) {
    console.log(err);
    return;
  }
});

