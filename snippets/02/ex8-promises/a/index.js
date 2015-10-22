"use strict";

function slowDiv ( a, b, callback ) {
  setTimeout ( function() {
    if (b === 0) { callback("Can't divide by zero"); }
    else { callback(undefined, a/b); }
  }, 2500 + Math.random()*10000 );
}
slowDiv ( 10, 5, function (err, result) {
  if (err !== undefined) {
    console.log(err);
    return;
  }
  console.log(result);
});

