/**
 * Throws an error with `msg` if `expr` is false.
 */
function assert(expr, msg) {
  if (!expr) {
    throw new Error (msg);
  }
}

let x = 5;
try {
    assert (x === 5);                  // (1)
} catch (err) {
    console.log("1. ERROR:" + err.message);
}
x = 4;
try {
    assert (x === 5);                  // (2)
} catch (err) {
    console.log("2. ERROR:" + err.message);
}

try {
    assert (x === 5, "X isn't 5")      // (3)
} catch (err) {
    console.log("3. ERROR:" + err.message);
}

